import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
serve(async (req)=>{
  try {
    const { email } = await req.json();
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // TODO: Save/persist OTP for verification later (optional for now)
    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    if (!SENDGRID_API_KEY) {
      return new Response(JSON.stringify({
        message: "SendGrid API key not set in environment"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              {
                email
              }
            ]
          }
        ],
        from: {
          email: "help.campuscupid@gmail.com"
        },
        subject: "Your OTP Code",
        content: [
          {
            type: "text/plain",
            value: `Your OTP code is ${otp}`
          }
        ]
      })
    });
    if (response.ok) {
      return new Response(JSON.stringify({
        message: "OTP sent successfully"
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } else {
      return new Response(JSON.stringify({
        message: "Failed to send OTP"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      message: "Bad request",
      error: error.message
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
});
