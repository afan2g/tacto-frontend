import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { ethers } from "npm:ethers";

// Initialize Ethereum provider
const provider = new ethers.AlchemyProvider(
  "sepolia",
  Deno.env.get("ALCHEMY_API_KEY")
);

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

      case "sendTransaction": {
        const {
          signedTransaction,
          fromWalletId,
          toUserId,
          methodId,
          requestId = null, // Optional, for request fulfillment
        } = params;

        if (!signedTransaction || !fromWalletId || !toUserId || !methodId) {
          return createJsonResponse(
            {
              error: "Missing required transaction parameters",
            },
            400
          );
        }

        // Get wallet details
        const { data: wallet, error: walletError } = await supabase
          .from("wallets")
          .select("*")
          .eq("id", fromWalletId)
          .single();

        if (walletError || !wallet) {
          return createJsonResponse({ error: "Wallet not found" }, 404);
        }

        // Verify wallet ownership
        if (wallet.owner_id !== user.id) {
          return createJsonResponse(
            { error: "Unauthorized wallet access" },
            403
          );
        }

        try {
          // Parse the transaction to get details
          const tx = ethers.Transaction.from(signedTransaction);

          // Create pending transaction record
          const { data: dbTx, error: insertError } = await supabase
            .from("transactions")
            .insert({
              wallet_id: fromWalletId,
              from_user_id: user.id,
              to_user_id: toUserId,
              method_id: methodId,
              status: "pending",
              from_address: tx.from,
              to_address: tx.to,
              amount: tx.value.toString(),
              gas_price: tx.gasPrice?.toString(),
              gas_limit: tx.gasLimit.toString(),
              nonce: tx.nonce,
              request_id: requestId,
            })
            .select()
            .single();

          if (insertError) throw insertError;

          // Broadcast transaction
          const broadcastedTx = await provider.broadcastTransaction(
            signedTransaction
          );

          // Update transaction with hash
          await supabase
            .from("transactions")
            .update({
              hash: broadcastedTx.hash,
              updated_at: new Date().toISOString(),
            })
            .eq("id", dbTx.id);

          // If this is fulfilling a request, update the request status
          if (requestId) {
            await supabase
              .from("payment_requests")
              .update({
                status: "completed",
                fulfilled_by: dbTx.id,
                updated_at: new Date().toISOString(),
              })
              .eq("id", requestId);
          }

          return createJsonResponse({
            transaction: dbTx,
            hash: broadcastedTx.hash,
          });
        } catch (error) {
          // If broadcasting fails, update transaction status
          if (dbTx) {
            await supabase
              .from("transactions")
              .update({
                status: "failed",
                updated_at: new Date().toISOString(),
              })
              .eq("id", dbTx.id);
          }
          throw error;
        }
      }

      case "getNetwork": {
        const network = await provider.getNetwork();
        return createJsonResponse({ network });
      }
      case "sendDirectTransaction": {
        console.log("sendDirectTransaction called");
        const { signedTransaction } = params;
        if (!signedTransaction) {
          console.log("Missing signed transaction");
          return createJsonResponse(
            { error: "Missing signed transaction" },
            400
          );
        }
        console.log("signed transaction received", signedTransaction);
        try {
          const TransactionResponse = await provider.broadcastTransaction(
            signedTransaction
          );
          console.log("TransactionResponse", TransactionResponse);
        } catch (error) {
          console.log("error occured sending transaction", error);
          return createJsonResponse(
            { error: error instanceof Error ? error.message : "Uknown error" },
            400
          );
        }
        return createJsonResponse({ success: true });
      }
      case "getTransaction": {
        const { txHash } = params;
        if (!txHash) {
          return createJsonResponse(
            { error: "Transaction hash is required" },
            400
          );
        }
        const transaction = await provider.getTransaction(txHash);
        return createJsonResponse({ transaction });
      }

      case "getTransactionStatus": {
        const { transactionId } = params;
        if (!transactionId) {
          return createJsonResponse({ error: "Transaction ID required" }, 400);
        }

        // Get transaction from database
        const { data: tx, error: txError } = await supabase
          .from("transactions")
          .select("*")
          .eq("id", transactionId)
          .single();

        if (txError) {
          return createJsonResponse({ error: "Transaction not found" }, 404);
        }

        // If pending, check current status
        if (tx.status === "pending" && tx.hash) {
          const receipt = await provider.getTransactionReceipt(tx.hash);
          if (receipt) {
            // Update status based on receipt
            const newStatus = receipt.status ? "confirmed" : "failed";
            await supabase
              .from("transactions")
              .update({
                status: newStatus,
                block_number: receipt.blockNumber,
                block_timestamp: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq("id", transactionId);

            tx.status = newStatus;
            tx.block_number = receipt.blockNumber;
          }
        }

        return createJsonResponse({ transaction: tx });
      }

      case "getBlockNumber": {
        const blockNumber = await provider.getBlockNumber();
        return createJsonResponse({ blockNumber });
      }

      case "getFeeData": {
        const feeData = await provider.getFeeData();
        return createJsonResponse({ feeData });
      }

      case "getTransactionRequirements": {
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

        try {
          const [gasLimit, feeData, nonce] = await Promise.all([
            provider.estimateGas(txRequest),
            provider.getFeeData(),
            provider.getTransactionCount(txRequest.from),
          ]);

          return createJsonResponse({
            gasLimit: gasLimit.toString(), // Convert BigInt to string
            feeData: {
              maxFeePerGas: feeData.maxFeePerGas?.toString(),
              maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
              gasPrice: feeData.gasPrice?.toString(),
            },
            nonce,
          });
        } catch (error) {
          console.error("Error getting transaction requirements:", error);
          return createJsonResponse(
            {
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to get transaction requirements",
              details: error,
            },
            500
          );
        }
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
