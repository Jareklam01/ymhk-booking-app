-- Create a table for bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date DATE NOT NULL,
  from_time TIME NOT NULL,
  to_time TIME NOT NULL,
  "user" TEXT NOT NULL, -- Renamed to "user" to avoid conflict with reserved keywords
  team TEXT NOT NULL,
  remarks TEXT
);

-- Enable Row Level Security (RLS) for the bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all authenticated users to read bookings
CREATE POLICY "Allow authenticated users to read bookings"
ON bookings FOR SELECT
TO authenticated
USING (TRUE);

-- Create a policy to allow authenticated users to insert their own bookings
CREATE POLICY "Allow authenticated users to insert their own bookings"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (TRUE); -- You might want to add a check here if you have user IDs

-- Create a policy to allow authenticated users to update their own bookings
CREATE POLICY "Allow authenticated users to update their own bookings"
ON bookings FOR UPDATE
TO authenticated
USING (TRUE); -- You might want to add a check here if you have user IDs

-- Create a policy to allow authenticated users to delete their own bookings
CREATE POLICY "Allow authenticated users to delete their own bookings"
ON bookings FOR DELETE
TO authenticated
USING (TRUE); -- You might want to add a check here if you have user IDs

-- Optional: Add a unique constraint if a user can only book a specific time slot once
-- ALTER TABLE bookings ADD CONSTRAINT unique_booking_time UNIQUE (date, from_time, to_time, "user");

-- Optional: Add an index for faster lookups by date
CREATE INDEX idx_bookings_date ON bookings (date);

-- Optional: Add an index for faster lookups by user
CREATE INDEX idx_bookings_user ON bookings ("user");
