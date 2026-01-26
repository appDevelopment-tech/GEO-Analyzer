import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendReport } from "@/lib/email";

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("Stripe environment variables are not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
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
      console.error("Stripe webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 },
      );
    }

    if (event.type === "charge.succeeded") {
      const session = event.data.object as Stripe.Charge;
      const email = session.billing_details.email;
      const reportId = session.metadata?.report_id;

      if (email && reportId) {
        const supabase = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_API_KEY!,
        );
        let data, error;
        try {
          ({ data, error } = await supabase
            .from("Reports")
            .select("*")
            .eq("email", email)
            .order("created_at", { ascending: false })
            .limit(1)
            .single());
        } catch (dbErr) {
          console.error("Supabase DB error fetching report:", dbErr);
          return NextResponse.json(
            { error: "Database error" },
            { status: 500 },
          );
        }

        if (data && !error) {
          try {
            const score = JSON.parse(data.full_report);
            await sendReport(email, data.domain, score, reportId);
          } catch (mailErr) {
            console.error("Error sending report email:", mailErr);
            // Optionally update webhook_result with error
            await supabase
              .from("Reports")
              .update({ webhook_result: `email_error: ${mailErr}` })
              .eq("report_id", data.id);
            return NextResponse.json(
              { error: "Email send error" },
              { status: 500 },
            );
          }
        } else {
          console.error("Supabase error fetching report:", email, data, error);
          return NextResponse.json(
            { error: "Report not found" },
            { status: 404 },
          );
        }

        // Update webhook_result to indicate success
        try {
          await supabase
            .from("Reports")
            .update({ webhook_result: error ? String(error) : "success" })
            .eq("report_id", data.id);
        } catch (updateErr) {
          console.error("Error updating webhook_result:", updateErr);
        }
      } else {
        console.warn(
          "Missing email or reportId in Stripe charge.succeeded event",
        );
        return NextResponse.json(
          { error: "Missing email or reportId" },
          { status: 400 },
        );
      }
    } else {
      // Optionally log unhandled event types
      console.info("Unhandled Stripe event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Unexpected error in Stripe webhook handler:", err);
    // Always return 200 to Stripe to avoid retries unless you want Stripe to retry
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 200 },
    );
  }
}
