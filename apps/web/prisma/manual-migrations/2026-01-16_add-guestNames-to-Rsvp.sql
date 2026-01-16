-- Add a denormalized guest names array to "Rsvp" so that `select * from "Rsvp"` shows guests.

ALTER TABLE "Rsvp"
ADD COLUMN IF NOT EXISTS "guestNames" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Backfill from "RsvpGuest" (keeps existing data visible in the new column).
UPDATE "Rsvp" r
SET "guestNames" = COALESCE(
  (
    SELECT ARRAY_AGG(g.name ORDER BY g."createdAt" ASC)
    FROM "RsvpGuest" g
    WHERE g."rsvpId" = r.id
  ),
  ARRAY[]::TEXT[]
);

