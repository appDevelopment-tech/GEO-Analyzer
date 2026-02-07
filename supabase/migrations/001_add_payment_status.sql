-- Add payment_status column to Reports table
-- Tracks whether a report is free (1 page shown) or paid (all pages shown)
ALTER TABLE "Reports"
  ADD COLUMN "payment_status" TEXT DEFAULT 'free'
  CHECK (payment_status IN ('free', 'paid'));

-- Add paid_at timestamp to track when payment was completed
ALTER TABLE "Reports" ADD COLUMN "paid_at" TIMESTAMPTZ;

-- Add index for faster lookups by payment status
CREATE INDEX IF NOT EXISTS idx_reports_payment_status ON "Reports"(payment_status);
CREATE INDEX IF NOT EXISTS idx_reports_email_payment ON "Reports"(email, payment_status);

-- Add comment for documentation
COMMENT ON COLUMN "Reports"."payment_status" IS 'Payment tier: free = 1 page of remediation, paid = all pages';
COMMENT ON COLUMN "Reports"."paid_at" IS 'Timestamp when payment was completed via Stripe';
