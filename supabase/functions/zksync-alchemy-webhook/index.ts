// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { ethers } from "npm:ethers";
import { utils } from "npm:zksync-ethers";
import { Expo } from "npm:expo-server-sdk";
import * as crypto from "node:crypto";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const expo = new Expo({ accessToken: Deno.env.get("EXPO_ACCESS_TOKEN") });

async function sendPushNotifications(
  userIds: string[],
  message: {
    title: string;
    body: string;
    data?: any;
  }
) {
  const { data: tokens } = await supabase
    .from("notification_tokens")
    .select("push_token")
    .in("user_id", userIds);

  if (!tokens?.length) {
    return;
  }

  const messages = tokens.map(({ push_token }) => ({
    to: push_token,
    sound: "default",
    title: message.title,
    body: message.body,
    data: message.data,
  }));

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      console.error(error);
    }
  }
}

const getProfileFromAddress = async (address: string) => {
  const checksummedAddress = ethers.getAddress(address);
  const { data: user, error } = await supabase
    .from("wallets")
    .select("owner_id")
    .eq("address", checksummedAddress)
    .maybeSingle();

  if (error) {
    return null;
  }
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.owner_id)
    .maybeSingle();
  if (profileError) {
    return null;
  }
  return profile;
};

function isValidSignatureForStringBody(
  body: string, // must be raw string body, not json transformed version of the body
  signature: string, // your "X-Alchemy-Signature" from header
  signingKey: string // taken from dashboard for specific webhook
): boolean {
  const hmac = crypto.createHmac("sha256", signingKey); // Create a HMAC SHA256 hash using the signing key
  hmac.update(body, "utf8"); // Update the token hash with the request body using utf8
  const digest = hmac.digest("hex");
  return signature === digest;
}

function parseTransactionDetails(activities: any[]) {
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
  console.log("calculating fees");
  for (const activity of ethFees) {
    console.log(
      `to Address: ${activity.toAddress}; type: ${typeof activity.toAddress}`
    );
    console.log(
      `from Address: ${
        activity.fromAddress
      }; type: ${typeof activity.fromAddress}`
    );

    console.log(`value: ${activity.value}; type: ${typeof activity.value}`);
    if (activity.toAddress === utils.BOOTLOADER_FORMAL_ADDRESS) {
      totalFees += activity.value; // Fee paid to system
      console.log(`Fee paid: ${activity.value}, current total: ${totalFees}`);
    } else if (activity.fromAddress === utils.BOOTLOADER_FORMAL_ADDRESS) {
      totalFees -= activity.value; // Refund from system
      console.log(`Refund: ${activity.value}, current total: ${totalFees}`);
    }
  }

  console.log(`Main transfer: ${JSON.stringify(mainTransfer, null, 2)}`);
  console.log(`Net ETH fee: ${totalFees}`);

  return {
    mainTransfer,
    totalFees,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "POST") {
    try {
      const rawBody = await req.text();
      const payload = JSON.parse(rawBody);

      // Verify signature
      const signature = req.headers.get("X-Alchemy-Signature");
      const signingKey = Deno.env.get("ALCHEMY_ZKSYNC_SIGNING_KEY")!;

      if (
        !signature ||
        !isValidSignatureForStringBody(rawBody, signature, signingKey)
      ) {
        console.error("Invalid signature");
        return new Response(
          JSON.stringify({ message: "Webhook processed successfully" }),
          {
            headers: { "Content-Type": "application/json" },
            status: 200,
          }
        );
      }

      const { mainTransfer, totalFees } = parseTransactionDetails(
        payload.event.activity
      );

      if (!mainTransfer) {
        console.error("No main transfer found in transaction");
        return new Response(
          JSON.stringify({ message: "Webhook processed successfully" }),
          {
            headers: { "Content-Type": "application/json" },
            status: 200,
          }
        );
      }

      // Get user profiles
      const [fromUser, toUser] = await Promise.all([
        getProfileFromAddress(mainTransfer.fromAddress),
        getProfileFromAddress(mainTransfer.toAddress),
      ]);

      // Create notification message with net fee
      const message = {
        title: `${mainTransfer.asset} Transfer`,
        body: `${fromUser?.username || mainTransfer.fromAddress} sent ${
          mainTransfer.value
        } ${mainTransfer.asset} to ${
          toUser?.username || mainTransfer.toAddress
        } (Fee: ${totalFees.toFixed(8)} ETH)`,
        data: {
          type: "transfer",
          hash: mainTransfer.hash,
          token: mainTransfer.asset,
          amount: mainTransfer.value,
          fee: totalFees,
          fromAddress: mainTransfer.fromAddress,
          toAddress: mainTransfer.toAddress,
        },
      };

      // Send notification to involved users
      const userIds = [fromUser?.id, toUser?.id].filter(
        (id): id is string => !!id
      );

      if (userIds.length > 0) {
        await sendPushNotifications(userIds, message);
      }

      return new Response(
        JSON.stringify({ message: "Webhook processed successfully" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response(
        JSON.stringify({ message: "Webhook processed successfully" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
  }

  return new Response(
    JSON.stringify({ message: "Webhook processed successfully" }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    }
  );
});
