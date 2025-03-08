import React, { useState, useCallback } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import * as SecureStore from "expo-secure-store";
import { ethers } from "ethers";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../../lib/supabase";
import { AppText, Header, Screen } from "../../components/primitives";
import MnemonicImport from "../../components/MnemonicImport";
import routes from "../../navigation/routes";
import { AppButton } from "../../components/primitives";
import { colors } from "../../config";

const WALLET_STORAGE_KEY = "TACTO_ENCRYPTED_WALLET";

function SignUpImportWallet({ navigation }) {
    const [phrase, setPhrase] = useState("");
    const [error, setError] = useState(null);
    const [isImporting, setIsImporting] = useState(false);

    // Add back button handler
    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                handleBack();
                return true;
            }
        );

        return () => backHandler.remove();
    }, [navigation]);

    const handleBack = () => {
        navigation.goBack();
    };

    // Handle when a valid phrase is entered
    const handlePhraseComplete = (validPhrase) => {
        console.log("Valid phrase:", validPhrase);
        setPhrase(validPhrase);
        setError(null);
    };

    // Handle when an invalid phrase is entered
    const handlePhraseInvalid = (errorMessage) => {
        setPhrase("");
        setError(errorMessage);
    };

    // Import the wallet
    const handleImportWallet = async () => {
        if (!phrase) {
            setError("Please enter a valid recovery phrase");
            return;
        }

        setIsImporting(true);
        try {
            // Create a wallet from the mnemonic
            const wallet = ethers.HDNodeWallet.fromPhrase(phrase);

            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session?.user) {
                throw new Error("Authentication required");
            }

            const userWalletKey = `${WALLET_STORAGE_KEY}_${session.user.id}`;

            // Save wallet to secure storage
            try {
                await SecureStore.setItemAsync(
                    userWalletKey,
                    JSON.stringify({
                        phrase: phrase,
                        path: wallet.path || "m/44'/60'/0'/0/0",
                    }),
                    {
                        requireAuthentication: true,
                    }
                );
            } catch (secureStoreError) {
                // Check for authentication cancellation
                if (
                    secureStoreError.message.includes(
                        "Could not Authenticate the user: User canceled"
                    )
                ) {
                    throw new Error("Authentication was cancelled. Please try again.");
                }
                if (secureStoreError.message.includes("Could not Authenticate")) {
                    throw new Error("Authentication failed. Please try again.");
                }
                // For any other secure storage errors
                throw new Error("Failed to securely store wallet. Please try again.");
            }

            console.log("Wallet imported and saved to secure storage");

            // Get neutered wallet info
            const uncompressedPublicKey = wallet.publicKey;
            const neuteredWallet = wallet.neuter();

            // Save public wallet info
            const publicInfo = {
                owner_id: session.user.id,
                name: "Imported Wallet", // Default name for imported wallet
                address: ethers.getAddress(neuteredWallet.address),
                public_key: uncompressedPublicKey,
                parent_fingerprint: neuteredWallet.parentFingerprint,
                chain_code: neuteredWallet.chainCode,
                path: neuteredWallet.path || "m/44'/60'/0'/0/0",
                index: neuteredWallet.index,
                depth: neuteredWallet.depth,
                is_primary: true, // Set as primary wallet
            };

            const { error: walletError } = await supabase
                .from("wallets")
                .insert(publicInfo)
                .select()
                .single();

            if (walletError) throw walletError;

            const { data: addToWebhookData, error: addToWebhookError } = await supabase.functions.invoke("add-wallet-to-webhook", {
                body: { address: publicInfo.address }
            });

            if (addToWebhookError) throw addToWebhookError;

            // Clear sensitive data
            setPhrase("");

            // Navigate to completion
            navigation.navigate(routes.SIGNUPCOMPLETE);
        } catch (error) {
            console.error("Failed to import wallet:", error);
            setError(error.message || "Failed to import wallet. Please try again.");
        } finally {
            setIsImporting(false);
        }
    };

    const insets = useSafeAreaInsets();

    return (
        <Screen style={[styles.screen, { paddingTop: insets.top }]}>
            <Header>Import Wallet</Header>

            <View style={styles.info}>
                <AppText style={styles.infoText}>
                    Enter your 12-word recovery phrase to import your existing wallet. Make sure you're in a private location where no one can see your screen.
                </AppText>
            </View>

            {error && <AppText style={styles.error}>{error}</AppText>}

            <MnemonicImport
                onPhraseComplete={handlePhraseComplete}
                onPhraseInvalid={handlePhraseInvalid}
            />

            <View style={styles.buttonContainer}>
                <AppButton
                    style={styles.button}
                    title={isImporting ? "Importing..." : "Import Wallet"}
                    onPress={handleImportWallet}
                    disabled={!phrase || isImporting}
                    color={colors.yellow}
                    loading={isImporting}
                />

                <AppButton
                    style={styles.button}
                    title="Back to Create Wallet"
                    onPress={handleBack}
                    disabled={isImporting}
                    color={colors.lightGray}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        paddingHorizontal: 20,
        flex: 1,
    },
    info: {
        marginBottom: 20,
    },
    infoText: {
        fontSize: 16,
    },
    error: {
        color: "red",
        marginBottom: 10,
    },
    buttonContainer: {
        gap: 10,
        marginTop: 20,
        marginBottom: 30,
    },
    button: {},
});

export default SignUpImportWallet;