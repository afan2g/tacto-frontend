import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    // Add request validation
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        headers: { "Content-Type": "application/json" },
        status: 405,
      });
    }

    const body = await req.json();

    // Validate required fields
    if (!body.userId || !body.fullName) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required fields: userId and fullName must be provided",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const { userId, fullName } = body;

    // Validate environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get initials (existing implementation...)
    const getInitials = (fullName: string) => {
      if (!fullName) return "";

      // Remove extra spaces, special characters, and split
      const nameParts = fullName
        .trim()
        .replace(/[^\p{L}\s]/gu, "") // Remove non-letter characters while preserving Unicode letters
        .split(/\s+/)
        .filter((part) => part.length > 0);

      if (nameParts.length === 0) return "";

      // Handle different name length cases
      switch (nameParts.length) {
        case 1:
          // Single name: use first two letters or just first letter if too short
          return nameParts[0].length > 1
            ? nameParts[0].slice(0, 2).toUpperCase()
            : nameParts[0][0].toUpperCase();

        case 2:
          // Two names: use first letter of each
          return (nameParts[0][0] + nameParts[1][0]).toUpperCase();

        default: {
          // Three or more names: consider prefix handling
          const prefixes = ["van", "de", "der", "el", "al", "bin", "ben"];

          // Get first letter of first name
          const firstInitial = nameParts[0][0];

          // For last name, skip known prefixes if present
          let lastNameIndex = nameParts.length - 1;
          while (
            lastNameIndex > 0 &&
            prefixes.includes(nameParts[lastNameIndex - 1].toLowerCase())
          ) {
            lastNameIndex--;
          }

          const lastInitial = nameParts[lastNameIndex][0];
          return (firstInitial + lastInitial).toUpperCase();
        }
      }
    };

    // Generate SVG
    const initials = getInitials(fullName);
    if (!initials) {
      return new Response(
        JSON.stringify({
          error: "Could not generate initials from provided name",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const backgroundColor = "#E2E8F0";
    const textColor = "#2D3748";
    const svgString = `
      <svg height="80" width="80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" fill="${backgroundColor}" />
        <text
          fill="${textColor}"
          font-size="36"
          font-weight="bold"
          x="40"
          y="40"
          text-anchor="middle"
          alignment-baseline="central"
          dominant-baseline="middle"
        >${initials}</text>
      </svg>
    `.trim();

    // Upload to storage
    const filePath = `${userId}/avatar.svg`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, svgString, {
        contentType: "image/svg+xml",
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw uploadError;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    // Update profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    if (updateError) {
      console.error("Profile update error:", updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: { publicUrl },
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);

    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          error: error.message,
          details: error.stack,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: "An unknown error occurred",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
