import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendReport } from "@/lib/email";

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("Stripe environment variables are not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const buf = await req.arrayBuffer();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(buf),
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 },
    );
  }

  if (event.type === "charge.succeeded") {
    const session = event.data.object as Stripe.Charge;
    const email = session.billing_details.email;

    console.log("Charge succeeded for email:", email);
    console.log("Charge details:", session);

    if (email) {
      // Fetch the latest report for this email
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_API_KEY!,
      );
      const { data, error } = await supabase
        .from("Reports")
        .select("*")
        .eq("email", email)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      console.log("Fetched report from Supabase:", data, error);

      if (data && !error) {
        // Send the report via email
        await sendReport(email, data.domain, data.full_report);
      } else {
        console.error("Supabase error fetching report:", email, data, error);
      }
      const id = data.id;
      await supabase
        .from("Reports")
        .update({ webhook_result: error ? error : true })
        .eq("id", id);
    }
  }

  return NextResponse.json({ received: true });
}
