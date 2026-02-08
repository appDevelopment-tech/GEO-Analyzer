import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Stripe environment variable is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: "Could not retrieve session" },
      { status: 500 },
    );
  }
}

export const runtime = 'nodejs';