import { Resend } from "resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";

const MAX_BODY_BYTES = 10 * 1024;
const NAME_MAX = 100;
const EMAIL_MAX = 200;
const MESSAGE_MAX = 2000;

const limiter = createRateLimiter({
  name: "contact",
  max: 5,
  windowMs: 10 * 60 * 1000,
});

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req) {
  if (!process.env.RESEND_API_KEY) {
    console.error("Contact API: RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }
  if (!process.env.CONTACT_EMAIL) {
    console.error("Contact API: CONTACT_EMAIL is not set");
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
  }

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  const ip = clientIp(req);
  if (limiter.isOverLimit(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  let body;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch (err) {
    console.error("Contact API: invalid JSON body:", err);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const { name, email, message } = body ?? {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const safeName = name
      .replace(/<[^>]*>/g, "")
      .replace(/[\r\n]+/g, " ")
      .trim()
      .slice(0, NAME_MAX);
    const safeMessage = message.replace(/<[^>]*>/g, "").trim().slice(0, MESSAGE_MAX);

    if (!safeName || !email || !safeMessage) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const safeEmail = email.slice(0, EMAIL_MAX);

    limiter.record(ip);

    try {
      await prisma.message.create({
        data: {
          name: safeName,
          email: safeEmail,
          message: safeMessage,
        },
      });
    } catch (err) {
      console.error("Contact API: failed to save message to the database:", err);
      return NextResponse.json(
        { error: "Could not save your message. Please try again later." },
        { status: 500 }
      );
    }

    let error;
    try {
      ({ error } = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: process.env.CONTACT_EMAIL,
        replyTo: safeEmail,
        subject: `New message from ${safeName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #111;">
            <h2>New Contact Form Message</h2>
            <hr style="border: none; border-top: 1px solid #eee;" />
            <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
            <h3>Message:</h3>
            <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; line-height: 1.7; white-space: pre-wrap;">${escapeHtml(safeMessage)}</div>
            <hr style="border: none; border-top: 1px solid #eee; margin-top: 24px;" />
            <p style="color: #aaa; font-size: 12px;">Sent from your portfolio contact form</p>
          </div>
        `,
      }));
    } catch (err) {
      console.error("Contact API: Resend request failed:", err);
      return NextResponse.json(
        { success: true, message: "Message saved! Email delivery may be delayed." },
        { status: 200 }
      );
    }

    if (error) {
      console.error("Contact API: Resend rejected the email:", error);
      return NextResponse.json(
        { success: true, message: "Message saved! Email delivery may be delayed." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { status: 200 }
    );

  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
