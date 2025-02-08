// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  // Check if the request method is POST
  if (req.method === "POST") {
    try {
      // Parse the JSON body of the request
      const payload = await req.json();

      // Log the payload for debugging purposes
      console.log("Received webhook payload:", payload);

      // Here you can add your logic to handle the webhook data
      // For example, you might want to store it in your database or trigger other actions

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
