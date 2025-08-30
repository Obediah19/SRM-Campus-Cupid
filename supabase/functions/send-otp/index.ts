import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { email } = await req.json();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");

    if (!SENDGRID_API_KEY) {
      return new Response(JSON.stringify({message: "SendGrid API key not set in environment"}), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: "your-verified-sender@example.com" }, // replace with your verified sender email
        subject: "Your OTP Code",
        content: [{ type: "text/plain", value: `Your OTP code is ${otp}` }]
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return new Response(JSON.stringify({
        message: "Failed to send OTP",
        status: response.status,
        detail: errorBody,
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response(JSON.stringify({ message: "OTP sent successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ message: "Bad request", error: error.message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
