export interface Env {
  TURNSTILE_SECRET: string; // បង្កើតនៅ Worker environment
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://sms-46d.pages.dev", // ដាក់ domain frontend របស់អ្នក
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 1️⃣ Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 2️⃣ Only allow POST
    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: corsHeaders,
      });
    }

    try {
      const body = await request.json();
      const { token } = body as { token: string };

      if (!token) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing token" }),
          { status: 400, headers: corsHeaders }
        );
      }

      // 3️⃣ Verify Turnstile token
      const formData = new URLSearchParams();
      formData.append("secret", env.TURNSTILE_SECRET);
      formData.append("response", token);

      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        { method: "POST", body: formData }
      );

      const verifyJson = (await verifyRes.json()) as { success: boolean };

      if (!verifyJson.success) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid token" }),
          { status: 400, headers: corsHeaders }
        );
      }

      // ✅ Success
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: corsHeaders,
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, error: (err as Error).message }),
        { status: 500, headers: corsHeaders }
      );
    }
  },
};
