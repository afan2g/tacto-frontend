// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Expo } from "npm:expo-server-sdk";
import * as crypto from "node:crypto";
import { ethers } from "npm:ethers";
// Initialize the Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const expo = new Expo({ accessToken: Deno.env.get("EXPO_ACCESS_TOKEN") });
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
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

Deno.serve(async (req: Request) => {
  // Check if the request method is POST
  console.log("Received request");
  if (req.method === "POST") {
    try {
      // Parse the JSON body of the request
      const rawBody = await req.text();
      console.log("Raw body:", rawBody);

      const payload = JSON.parse(rawBody);
      console.log("Parsed payload:", payload);

      //verify the signature
      const signature = req.headers.get("X-Alchemy-Signature");
      const signingKey = Deno.env.get("ALCHEMY_SIGNING_KEY")!;

      if (
        !signature ||
        !isValidSignatureForStringBody(rawBody, signature, signingKey)
      ) {
        console.error("Invalid signature");
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          headers: { "Content-Type": "application/json" },
          status: 403,
        });
      }

      // Here you can add your logic to handle the webhook data
      // For example, you might want to store it in your database or trigger other actions

      // Send a push notification to the user
      const { fromAddress, toAddress, blockNum, hash, value, asset } =
        payload.event.activity[0];

      console.log("Transaction details:", {
        fromAddress,
        toAddress,
        blockNum,
        hash,
        value,
        asset,
      });
      console.log("Transaction details:", payload.event.activity[0]);
      // Find userid using the fromAddress
      const [fromUser, toUser] = await Promise.all([
        getProfileFromAddress(fromAddress),
        getProfileFromAddress(toAddress),
      ]);
      console.log("From user:", fromUser);
      console.log("To user:", toUser);

      if (!fromUser && !toUser) {
        console.error("Error finding either user");
        return new Response(JSON.stringify({ error: "Failed to find user" }), {
          headers: { "Content-Type": "application/json" },
          status: 400,
        });
      }

      console.log("From user:", fromUser);
      console.log("To user:", toUser);

      // Send a push notification to the user
      const message = {
        title: "Ethereum Transaction",
        body: `Transaction from ${fromAddress} ${fromUser?.username} to ${toAddress} ${toUser?.username} for ${value} ${asset}`,
        data: { blockNum, hash, value, asset },
      };
      const userIds = [fromUser?.id, toUser?.id].filter(
        (id): id is string => !!id
      );
      console.log("User IDs:", userIds);
      if (userIds.length === 0) {
        console.error("No valid users found for notification");
        return new Response(JSON.stringify({ error: "No valid users found" }), {
          headers: { "Content-Type": "application/json" },
          status: 400,
        });
      }

      await sendPushNotifications(userIds, message);
      // Respond with a success message
      return new Response(
        JSON.stringify({ message: "Webhook received successfully" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response(
        JSON.stringify({ error: "Failed to process webhook" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
  } else {
    // Respond with a method not allowed error for non-POST requests
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { "Content-Type": "application/json" },
      status: 405,
    });
  }
});
