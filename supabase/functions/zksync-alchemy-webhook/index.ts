// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { ethers } from "npm:ethers";
import { Provider, utils, types } from "npm:zksync-ethers";
import { Expo, ExpoPushMessage } from "npm:expo-server-sdk";
import * as crypto from "node:crypto";

const ZKSYNC_USDC_CONTRACT_ADDRESS =
  "0xAe045DE5638162fa134807Cb558E15A3F5A7F853";
const provider = Provider.getDefaultProvider(types.Network.Sepolia);
// Define types for better code structure
interface NotificationMessage {
  title: string;
  body: string;
  data?: Record<string, any>;
}

interface TransactionActivity {
  category: string;
  asset: string;
  fromAddress: string;
  toAddress: string;
  value: number;
  hash: string;
}

interface TransactionDetails {
  mainTransfer: TransactionActivity | null;
  totalFees: number;
}

interface Profile {
  id: string;
  username: string;
  // Add other profile fields as needed
}

// Environment variables with proper fallbacks
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const alchemySigningKey = Deno.env.get("ALCHEMY_ZKSYNC_SIGNING_KEY");

if (!supabaseUrl || !supabaseServiceKey || !alchemySigningKey) {
  console.error("Required environment variables are missing");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const expo = new Expo({ accessToken: Deno.env.get("EXPO_ACCESS_TOKEN") });

/**
 * Sends push notifications to multiple users
 * @param userIds Array of user IDs to send notifications to
 * @param message Notification message details
 */
async function sendPushNotifications(
  userIds: string[],
  message: NotificationMessage
): Promise<void> {
  if (!userIds.length) {
    return;
  }

  try {
    const { data: tokens, error } = await supabase
      .from("notification_tokens")
      .select("push_token")
      .in("user_id", userIds);

    if (error) {
      console.error("Error fetching notification tokens:", error);
      return;
    }

    if (!tokens?.length) {
      return;
    }
    console.log("Sending push notifications to:", tokens);
    const messages: ExpoPushMessage[] = tokens.map(
      ({ push_token }: { push_token: string }) => ({
        to: push_token,
        sound: "default",
        title: message.title,
        body: message.body,
        data: message.data,
      })
    );

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        // Process ticket responses if needed
        for (let i = 0; i < ticketChunk.length; i++) {
          const ticket = ticketChunk[i];
          if (ticket.status === "error") {
            console.error(`Push notification error:`, ticket.message);
          }
        }
      } catch (error) {
        console.error("Error sending push notifications:", error);
      }
    }
  } catch (error) {
    console.error("Unexpected error in sendPushNotifications:", error);
  }
}

const getProfileFromAddress = async (
  address: string
): Promise<Profile | null> => {
  try {
    const checksummedAddress = ethers.getAddress(address);

    const { data, error } = await supabase
      .from("wallets")
      .select("owner_id") // Manually alias the profiles table
      .eq("address", checksummedAddress)
      .maybeSingle();

    if (error) {
      console.error("Error fetching wallet:", error);
      return null;
    }
    if (!data) {
      return null;
    }
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.owner_id)
      .maybeSingle();
    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return null;
    }
    if (!profileData) {
      return null;
    }

    console.log("Profile found for address:", address);
    console.log("Profile data:", profileData);
    return profileData as Profile;
  } catch (error) {
    console.error("Error in getProfileFromAddress:", error);
    return null;
  }
};

/**
 * Validates the webhook signature from Alchemy
 * @param body Raw request body
 * @param signature Signature from request header
 * @param signingKey Signing key from Alchemy dashboard
 * @returns Whether the signature is valid
 */
function isValidSignatureForStringBody(
  body: string,
  signature: string,
  signingKey: string
): boolean {
  try {
    const hmac = crypto.createHmac("sha256", signingKey);
    hmac.update(body, "utf8");
    const digest = hmac.digest("hex");
    return signature === digest;
  } catch (error) {
    console.error("Error validating signature:", error);
    return false;
  }
}

/**
 * Parses transaction details from Alchemy webhook data
 * @param activities Array of transaction activities
 * @returns Parsed transaction details
 */
function parseTransactionDetails(
  activities: TransactionActivity[]
): TransactionDetails {
  if (!Array.isArray(activities) || activities.length === 0) {
    return { mainTransfer: null, totalFees: 0 };
  }

  // Find the main token transfer
  const mainTransfer = activities.find(
    (activity) =>
      activity.category !== "external" &&
      activity.asset !== "ETH" &&
      activity.fromAddress !== utils.BOOTLOADER_FORMAL_ADDRESS &&
      activity.toAddress !== utils.BOOTLOADER_FORMAL_ADDRESS
  );

  if (!mainTransfer) {
    return { mainTransfer: null, totalFees: 0 };
  }

  // Calculate net ETH fee (amount sent to system contract minus amount returned)
  const ethFees = activities.filter((activity) => activity.asset === "ETH");
  let totalFees = 0;

  for (const activity of ethFees) {
    if (activity.toAddress === utils.BOOTLOADER_FORMAL_ADDRESS) {
      totalFees += activity.value; // Fee paid to system
    } else if (activity.fromAddress === utils.BOOTLOADER_FORMAL_ADDRESS) {
      totalFees -= activity.value; // Refund from system
    }
  }

  return {
    mainTransfer,
    totalFees,
  };
}

/**
 * Processes a transaction and updates the database
 * @param transactionDetails Parsed transaction details
 * @returns Success status
 */
async function processTransaction(
  transactionDetails: TransactionDetails
): Promise<boolean> {
  const { mainTransfer, totalFees } = transactionDetails;

  if (!mainTransfer) {
    return false;
  }

  try {
    // Get user profiles in parallel
    const [fromUser, toUser] = await Promise.all([
      getProfileFromAddress(mainTransfer.fromAddress),
      getProfileFromAddress(mainTransfer.toAddress),
    ]);

    if (!fromUser && !toUser) {
      return false;
    }

    const { data: existingTx, error: findError } = await supabase
      .from("transactions")
      .select("*")
      .eq("hash", mainTransfer.hash)
      .maybeSingle();

    if (findError) {
      console.error("Error checking for existing transaction:", findError);
      return false;
    }

    // If existing transaction is found, update it
    if (existingTx) {
      const { error: updateError } = await supabase
        .from("transactions")
        .update({
          status: "confirmed",
          fee: totalFees,
          updated_at: new Date().toISOString(),
        })
        .eq("hash", mainTransfer.hash);

      if (updateError) {
        console.error("Failed to update transaction record:", updateError);
        return false;
      }

      // Send notification if recipient is a known user
      if (toUser) {
        //fromUser exists, toUser exists
        const senderName =
          fromUser?.username ||
          mainTransfer.fromAddress.slice(0, 6) +
            "..." +
            mainTransfer.fromAddress.slice(-4);

        const [
          pushNotificationResponse,
          fromETHBalance,
          fromUSDCBalance,
          toETHBalance,
          toUSDCBalance,
        ] = await Promise.all([
          sendPushNotifications([toUser.id], {
            title: "Payment Received",
            body: `You received ${mainTransfer.value} ${mainTransfer.asset} from ${senderName}`,
            data: {
              type: existingTx.type,
              hash: mainTransfer.hash,
              token: mainTransfer.asset,
              amount: mainTransfer.value,
              fee: totalFees,
              fromAddress: mainTransfer.fromAddress,
              toAddress: mainTransfer.toAddress,
            },
          }),
          provider.getBalance(mainTransfer.fromAddress),
          provider.getBalance(
            mainTransfer.fromAddress,
            "committed",
            ZKSYNC_USDC_CONTRACT_ADDRESS
          ),
          provider.getBalance(mainTransfer.toAddress),
          provider.getBalance(
            mainTransfer.toAddress,
            "committed",
            ZKSYNC_USDC_CONTRACT_ADDRESS
          ),
        ]);

        const { error: updateFromBalanceError } = await supabase
          .from("wallets")
          .update({
            eth_balance: ethers.formatEther(fromETHBalance),
            usdc_balance: ethers.formatUnits(fromUSDCBalance, 6),
          })
          .eq("address", ethers.getAddress(mainTransfer.fromAddress));

        const { error: updateToBalanceError } = await supabase
          .from("wallets")
          .update({
            eth_balance: ethers.formatEther(toETHBalance),
            usdc_balance: ethers.formatUnits(toUSDCBalance, 6),
          })
          .eq("address", ethers.getAddress(mainTransfer.toAddress));

        if (updateFromBalanceError || updateToBalanceError) {
          console.error(
            "Failed to update wallet balances:",
            updateFromBalanceError,
            updateToBalanceError
          );
          return false;
        }
      } else {
        //fromUser exists, toUser doesnt exist
        // This is a transaction sent from a known user to an external address
        const { error: insertError } = await supabase
          .from("transactions")
          .insert({
            from_user_id: fromUser?.id,
            status: "confirmed",
            hash: mainTransfer.hash,
            from_address: ethers.getAddress(mainTransfer.fromAddress),
            to_address: ethers.getAddress(mainTransfer.toAddress),
            amount: mainTransfer.value,
            asset: mainTransfer.asset,
            fee: totalFees,
            method_id: "5", // Consider making this dynamic
            type: "transfer",
          });

        const [ethBalance, usdcBalance] = await Promise.all([
          provider.getBalance(mainTransfer.fromAddress),
          provider.getBalance(
            mainTransfer.fromAddress,
            "committed",
            ZKSYNC_USDC_CONTRACT_ADDRESS
          ),
        ]);

        const { error: updateBalanceError } = await supabase
          .from("wallets")
          .update({
            eth_balance: ethers.formatEther(ethBalance),
            usdc_balance: ethers.formatUnits(usdcBalance, 6),
          })
          .eq("address", ethers.getAddress(mainTransfer.fromAddress));

        if (insertError || updateBalanceError) {
          console.error("Failed to insert transaction record:", insertError);
          return false;
        }
      }
    } else if (toUser) {
      //fromUser doesnt exist, toUser exists
      // This is a transaction sent from an external address to a known user
      const { error: insertError } = await supabase
        .from("transactions")
        .insert({
          to_user_id: toUser.id,
          status: "confirmed",
          hash: mainTransfer.hash,
          from_address: ethers.getAddress(mainTransfer.fromAddress),
          to_address: ethers.getAddress(mainTransfer.toAddress),
          amount: mainTransfer.value,
          asset: mainTransfer.asset,
          fee: totalFees,
          method_id: "5", // Consider making this dynamic
          type: "transfer",
        });

      if (insertError) {
        console.error("Failed to insert transaction record:", insertError);
        return false;
      }

      // Format the sender address for display
      const senderDisplay =
        mainTransfer.fromAddress.slice(0, 6) +
        "..." +
        mainTransfer.fromAddress.slice(-4);

      //update the balance of the receiver
      const [ethBalance, usdcBalance] = await Promise.all([
        provider.getBalance(mainTransfer.toAddress),
        provider.getBalance(
          mainTransfer.toAddress,
          "committed",
          ZKSYNC_USDC_CONTRACT_ADDRESS
        ),
      ]);
      const { error: updateBalanceError } = await supabase
        .from("wallets")
        .update({
          eth_balance: ethers.formatEther(ethBalance),
          usdc_balance: ethers.formatUnits(usdcBalance, 6),
        })
        .eq("address", ethers.getAddress(mainTransfer.toAddress));

      if (updateBalanceError) {
        console.error("Failed to update wallet balance:", updateBalanceError);
        return false;
      }
      // Send notification to the receiver
      await sendPushNotifications([toUser.id], {
        title: "Payment Received",
        body: `You received ${mainTransfer.value} ${mainTransfer.asset} from ${senderDisplay}`,
        data: {
          type: "transfer",
          hash: mainTransfer.hash,
          token: mainTransfer.asset,
          amount: mainTransfer.value,
          fee: totalFees,
          fromAddress: mainTransfer.fromAddress,
          toAddress: mainTransfer.toAddress,
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error processing transaction:", error);
    return false;
  }
}

Deno.serve(async (req: Request) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { "Content-Type": "application/json" },
      status: 405,
    });
  }

  try {
    const rawBody = await req.text();

    // Basic validation of request body
    if (!rawBody) {
      return new Response(JSON.stringify({ error: "Empty request body" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Verify signature
    const signature = req.headers.get("X-Alchemy-Signature");
    if (!signature || !alchemySigningKey) {
      console.error("Missing signature or signing key");
      // Return 200 to avoid webhook retries, but log the error
      return new Response(JSON.stringify({ message: "Webhook processed" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (!isValidSignatureForStringBody(rawBody, signature, alchemySigningKey)) {
      console.error("Invalid signature");
      // Return 200 to avoid webhook retries, but log the error
      return new Response(JSON.stringify({ message: "Webhook processed" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Validate webhook data structure
    if (!payload.event?.activity || !Array.isArray(payload.event.activity)) {
      console.error("Invalid webhook payload structure");
      return new Response(JSON.stringify({ message: "Webhook processed" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    const transactionDetails = parseTransactionDetails(payload.event.activity);
    const success = await processTransaction(transactionDetails);
    console.log("Transaction processed successfully:", success);
    // Always return 200 for webhook, but include processing status
    return new Response(
      JSON.stringify({
        message: "Webhook processed successfully",
        success,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    // Return 200 to prevent webhook retries, but include error info in logs
    return new Response(
      JSON.stringify({
        message: "Webhook processed",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});
