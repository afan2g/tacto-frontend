import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { ethers } from "npm:ethers";

// Initialize Ethereum provider
const provider = new ethers.JsonRpcProvider(
  Deno.env.get("ALCHEMY_ETHEREUM_RPC")
);

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to create consistent responses
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

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization")!;
    if (!authHeader) {
      return createJsonResponse({ error: "Missing authorization header" }, 401);
    }

    // const jwt = authHeader.replace("Bearer ", "");
    // const {
    //   data: { user },
    //   error: authError,
    // } = await supabase.auth.getUser(jwt);

    // if (authError || !user) {
    //   return createJsonResponse({ error: "Unauthorized" }, 401);
    // }

    // Parse request body once
    const { action, ...params } = await req.json();

    // Handle different actions
    switch (action) {
      case "getBalance": {
        const { address } = params;
        if (!address) {
          return createJsonResponse({ error: "Address is required" }, 400);
        }
        const balance = await provider.getBalance(address);
        return createJsonResponse({ balance: balance.toString() });
      }

      case "getTransaction": {
        const { txHash } = params;
        if (!txHash) {
          return createJsonResponse(
            { error: "Transaction hash is required" },
            400
          );
        }
        const transaction = await provider.getTransaction(hash);
        return createJsonResponse({ transaction });
      }

      case "getBlockNumber": {
        const blockNumber = await provider.getBlockNumber();
        return createJsonResponse({ blockNumber });
      }

      case "getFeeData": {
        const feeData = await provider.getFeeData();
        return createJsonResponse({ feeData });
      }

      default:
        return createJsonResponse({ error: "Invalid action" }, 400);
    }
  } catch (error) {
    console.error(error);
    return createJsonResponse(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500
    );
  }
});
