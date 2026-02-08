import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Stripe secret key is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  const { id, email } = await req.json();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "GEO/AEO/AI Full Report" },
          unit_amount: 450,//450 cents = $4.50
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    metadata: {
      report_id: String(id),
    },
    payment_intent_data: {
      metadata: {
        report_id: String(id),
      },
    },
  });
  return NextResponse.json({ url: session.url });
}

export const runtime = 'nodejs';