import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Keyboard } from "react-native";
import { AppText } from "./primitives";
import { colors, fonts } from "../config";
import { ethers } from "ethers";

function MnemonicImport({ onPhraseComplete, onPhraseInvalid }) {
    const [words, setWords] = useState(Array(12).fill(""));
    const [activeIndex, setActiveIndex] = useState(0);
    const [error, setError] = useState("");
    const inputRefs = useRef([]);

    // Initialize refs array
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 12);
    }, []);

    // Handle word input
    const handleWordChange = (text, index) => {
        const newWords = [...words];

        // Remove any spaces or special characters
        const cleanedText = text.trim().toLowerCase().replace(/[^a-z]/g, '');
        newWords[index] = cleanedText;
        setWords(newWords);

        console.log("Words:", newWords);
        // Clear error when user starts typing
        if (error) setError("");

    };

    // Handle focus on input
    const handleFocus = (index) => {
        setActiveIndex(index);
    };

    const handleNext = (index) => {
        if (index < 11) {
            inputRefs.current[index + 1]?.focus();
            setActiveIndex(index + 1);
        } else {
            // If we're at the last word, validate the phrase
            if (validatePhrase(words)) {
                Keyboard.dismiss();
            }
        }
    }

    // Validate the entire phrase
    const validatePhrase = (phraseWords) => {
        try {
            console.log("Validating phrase:", phraseWords);
            const phrase = phraseWords.join(" ");

            // Check if it's a valid mnemonic
            if (!ethers.HDNodeWallet.fromPhrase(phrase)) {
                setError("Invalid recovery phrase. Please double-check your words.");
                if (onPhraseInvalid) onPhraseInvalid("Invalid mnemonic");
                return false;
            }

            // If we get here, the phrase is valid
            if (onPhraseComplete) onPhraseComplete(phrase);
            return true;
        } catch (error) {
            console.error("Validation error:", error);
            setError("Error validating phrase. Please try again.");
            if (onPhraseInvalid) onPhraseInvalid(error.message);
            return false;
        }
    };

    // Clear all inputs
    const handleClear = () => {
        setWords(Array(12).fill(""));
        setError("");
        inputRefs.current[0]?.focus();
        setActiveIndex(0);
    };

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.headerContainer}>
                <AppText style={styles.header}>Enter Recovery Phrase</AppText>
                <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <AppText style={styles.clearButtonText}>Clear All</AppText>
                </TouchableOpacity>
            </View>

            <AppText style={styles.instructions}>
                Enter your 12-word recovery phrase in the correct order
            </AppText>

            <View style={styles.gridContainer}>
                {/* First Column */}
                <View style={styles.column}>
                    {words.slice(0, 6).map((word, index) => (
                        <View
                            key={index}
                            style={[
                                styles.wordContainer,
                                index === 5 && { borderBottomWidth: 0 },
                                activeIndex === index && styles.activeWordContainer
                            ]}
                        >
                            <AppText style={styles.wordIndex}>{index + 1}</AppText>
                            <TextInput
                                ref={el => inputRefs.current[index] = el}
                                style={[
                                    styles.wordInput,
                                    activeIndex === index && styles.activeInput
                                ]}
                                value={word}
                                onChangeText={(text) => handleWordChange(text, index)}
                                onFocus={() => handleFocus(index)}
                                autoCapitalize="none"
                                placeholder="word"
                                placeholderTextColor={colors.lightGray}
                                onSubmitEditing={() => handleNext(index)}
                                textAlign="center"
                                textAlignVertical="center"
                            />
                        </View>
                    ))}
                </View>

                {/* Second Column */}
                <View style={styles.column}>
                    {words.slice(6, 12).map((word, index) => {
                        const actualIndex = index + 6;
                        return (
                            <View
                                key={actualIndex}
                                style={[
                                    styles.wordContainer,
                                    styles.wordContainerRight,
                                    index === 5 && { borderBottomWidth: 0 },
                                    activeIndex === actualIndex && styles.activeWordContainer
                                ]}
                            >
                                <AppText style={[styles.wordIndex, styles.wordIndexRight]}>
                                    {actualIndex + 1}
                                </AppText>
                                <TextInput
                                    ref={el => inputRefs.current[actualIndex] = el}
                                    style={[
                                        styles.wordInput,
                                        activeIndex === actualIndex && styles.activeInput
                                    ]}
                                    value={word}
                                    onChangeText={(text) => handleWordChange(text, actualIndex)}
                                    onFocus={() => handleFocus(actualIndex)}
                                    autoCapitalize="none"
                                    placeholder="word"
                                    placeholderTextColor={colors.lightGray}
                                    onSubmitEditing={() => handleNext(actualIndex)}
                                    textAlign="center"
                                    textAlignVertical="center"
                                />
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Error message */}
            {error ? <AppText style={styles.errorText}>{error}</AppText> : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    header: {
        fontSize: 18,
        fontFamily: fonts.medium,
        color: colors.text,
    },
    clearButton: {
        padding: 5,
    },
    clearButtonText: {
        color: colors.yellow,
        fontSize: 14,
    },
    instructions: {
        fontSize: 14,
        color: colors.gray,
        marginBottom: 15,
    },
    gridContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    column: {
        flex: 1,
        alignItems: "center",
    },
    wordContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: colors.lightGray,
    },
    wordContainerRight: {
        flexDirection: "row-reverse",
        borderLeftWidth: 1,
        borderColor: colors.lightGray,
    },
    activeWordContainer: {
        borderColor: colors.yellow,
    },
    wordIndex: {
        fontSize: 16,
        color: colors.lightGray,
        width: 30,
        textAlign: "left",
    },
    wordIndexRight: {
        textAlign: "right",
    },
    wordInput: {
        flex: 1,
        fontFamily: fonts.regular,
        fontSize: 16,
        color: colors.text,
        textAlign: "center",
        height: 40,
        padding: 5,
        width: "100%",
    },
    activeInput: {
        color: colors.yellow,
    },
    errorText: {
        color: 'red',
        marginTop: 15,
        textAlign: 'center',
    },
});

export default MnemonicImport;