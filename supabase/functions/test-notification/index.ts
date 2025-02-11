// test-notification.ts
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Expo } from "npm:expo-server-sdk";

const expo = new Expo({ accessToken: Deno.env.get("EXPO_ACCESS_TOKEN") });
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { pushToken } = await req.json();

    if (!pushToken) {
      return new Response(JSON.stringify({ error: "Push token is required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Validate the token
    if (!Expo.isExpoPushToken(pushToken)) {
      return new Response(
        JSON.stringify({ error: "Invalid Expo push token" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Create the notification
    const message = {
      to: pushToken,
      sound: "default",
      title: "Test Notification",
      body: "This is a test notification!",
      data: { testData: "Hello from edge function!" },
    };

    // Send the notification
    const tickets = await expo.sendPushNotificationsAsync([message]);

    return new Response(JSON.stringify({ success: true, tickets }), {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
