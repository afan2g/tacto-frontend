// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Alchemy, Network } from "npm:alchemy-sdk";

console.log("Hello from Functions!");
const settings = {
  authToken: Deno.env.get("ALCHEMY_AUTH_TOKEN"), // Replace with your Alchemy API key.
  network: Network.ETH_SEPOLIA, // Replace with your network.
};
const WEBHOOK_ID = Deno.env.get("ZKSYNC_SEPOLIA_WEBHOOK_ID")!;

const alchemy = new Alchemy(settings);
const createJsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    },
  });
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  // Initialize Supabase client
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization")!;
    if (!authHeader) {
      return createJsonResponse({ error: "Missing authorization header" }, 401);
    }

    const jwt = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(jwt);
    if (authError || !user) {
      return createJsonResponse({ error: "Unauthorized" }, 401);
    }

    console.log("User:", user);
    console.log("gathering all webhooks");

    const { address } = await req.json();
    if (!address) {
      return createJsonResponse({ error: "Missing address" }, 400);
    }

    await alchemy.notify.updateWebhook(WEBHOOK_ID, {
      addAddresses: [address],
    });

    return createJsonResponse({ success: true });
  } catch (error) {
    console.error("Error adding address to webhook:", error);
    return createJsonResponse({ error: "Internal server error" }, 500);
  }
});
