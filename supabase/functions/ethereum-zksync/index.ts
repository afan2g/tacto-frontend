// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { ethers } from "npm:ethers";
import { Provider, utils, types } from "npm:zksync-ethers";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ZKSYNC_USDC_CONTRACT_ADDRESS =
  "0xAe045DE5638162fa134807Cb558E15A3F5A7F853";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);

console.log("Hello from zksync test!");

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
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // Parse request body once
    const { action, ...params } = await req.json();
    console.log("action: ", action);
    console.log("params: ", params);
    // Handle different actions
    switch (action) {
      case "getNetwork": {
        const network = await provider.getNetwork();
        return createJsonResponse({ network });
      }

      case "getBlockNumber": {
        const blockNumber = await provider.getBlockNumber();
        return createJsonResponse({ blockNumber });
      }

      case "getBalance": {
        const { address } = params;
        console.log("retreiving balance for address: ", address);
        const balances = await provider.getAllAccountBalances(address);
        console.log("balances: ", balances);
        return createJsonResponse(utils.toJSON(balances));
      }

      case "getUSDCBalance": {
        const { address } = params;
        const usdcToken = await provider.getBalance(
          address,
          "latest",
          ZKSYNC_USDC_CONTRACT_ADDRESS
        );
        const decimals = 6;
        return createJsonResponse(
          utils.toJSON(ethers.formatUnits(usdcToken, decimals))
        );
      }

      case "broadcastTxTest": {
        const { signedTransaction } = params;
        console.log("signedTransaction: ", signedTransaction);
        const txResponse = await provider.sendRawTransactionWithDetailedOutput(
          signedTransaction
        );
        console.log("txResponse: ", txResponse);
        return createJsonResponse(utils.toJSON(txResponse));
      }
      case "broadcastTxUSDC": {
        console.log("broadcastTxUSDC");
        const { signedTransaction, txRequest, txInfo } = params;
        console.log("signedTransaction: ", signedTransaction);
        const txResponseDetailedOutput =
          await provider.sendRawTransactionWithDetailedOutput(
            signedTransaction
          );
        const { data: transactionRecord, error: txInsertError } = await supabase
          .from("transactions")
          .insert({
            from_user_id: user.id,
            to_user_id: txInfo.toUserId,
            from_address: txRequest.from,
            to_address: txRequest.to,
            amount: ethers.formatUnits(txRequest.value, 6), // Assuming USDC with 6 decimals
            method_id: txInfo.methodId, // You'd get this from the request params
            request_id: txInfo.requestId, // If applicable
            hash: txResponseDetailedOutput.transactionHash,
            status: "pending",
            asset: "USDC",
            fee: 0, // You don't know the exact fee yet
          })
          .select()
          .single();

        if (txInsertError) {
          console.error("Failed to insert transaction record", txInsertError);
          return createJsonResponse(
            { error: "Failed to insert transaction record" },
            500
          );
        }
        console.log("txResponseDetailedOutput: ", txResponseDetailedOutput);
        return createJsonResponse(
          utils.toJSON({
            ...txResponseDetailedOutput,
            transaction_id: transactionRecord.id,
          })
        );
      }

      case "getCompleteTransferTx": {
        const { txRequest } = params;
        if (
          !txRequest ||
          !txRequest.from ||
          !txRequest.to ||
          !txRequest.value
        ) {
          console.log("Invalid transaction request", txRequest);
          return createJsonResponse(
            { error: "Invalid transaction request. Required: from, to, value" },
            400
          );
        }

        const [usdcBalance, ethBalance, nonce] = await Promise.all([
          provider.getBalance(
            txRequest.from,
            "latest",
            ZKSYNC_USDC_CONTRACT_ADDRESS
          ),
          provider.getBalance(txRequest.from, "latest"),
          provider.getTransactionCount(txRequest.from),
        ]);

        if (usdcBalance < BigInt(txRequest.value)) {
          return createJsonResponse({ error: "Insufficient balance" }, 400);
        }

        const transferTx = await provider.getTransferTx({
          from: txRequest.from,
          to: txRequest.to,
          amount: txRequest.value,
          token: ZKSYNC_USDC_CONTRACT_ADDRESS,
        });

        console.log("transferTx: ", transferTx);

        const fee = await provider.estimateFee(transferTx);

        console.log("fee: ", fee);
        const completeTransferTx = {
          ...transferTx,
          ...fee,
          nonce,
          value: 0,
          type: utils.EIP712_TX_TYPE,
          chainId: 300,
          customData: {
            gasPerPubdata: fee.gasPerPubdataLimit,
            factoryDeps: [],
          },
        };
        return createJsonResponse(utils.toJSON(completeTransferTx));
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
