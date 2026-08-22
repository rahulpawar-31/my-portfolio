import { Resend } from "resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 3;
const requestLog = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);

  if (requestLog.size > 5000) {
    for (const [key, value] of requestLog) {
      if (!value.some((t) => now - t < RATE_LIMIT_WINDOW_MS)) requestLog.delete(key);
    }
  }

  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(req) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }
  if (!process.env.CONTACT_EMAIL) {
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const body = await req.json();
    const { name, email, message, company } = body;

    // Honeypot — real visitors never fill this hidden field, bots that auto-fill forms do.
    if (company) {
      return NextResponse.json({ success: true, message: "Message sent successfully!" }, { status: 200 });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const safeName    = String(name).replace(/<[^>]*>/g, "").trim().slice(0, 100);
    const safeEmail   = String(email).trim().slice(0, 200);
    const safeMessage = String(message).replace(/<[^>]*>/g, "").trim().slice(0, 2000);

    await prisma.message.create({
      data: {
        name: safeName,
        email: safeEmail,
        message: safeMessage,
      },
    });

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL,
      replyTo: safeEmail,
      subject: `New message from ${safeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #111;">
          <h2>New Contact Form Message</h2>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <h3>Message:</h3>
          <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; line-height: 1.7; white-space: pre-wrap;">${safeMessage}</div>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 24px;" />
          <p style="color: #aaa; font-size: 12px;">Sent from your portfolio contact form</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
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
