-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated users to update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own bookings" ON public.bookings;

-- Create new policies that allow anonymous access
CREATE POLICY "Allow anonymous users to read bookings"
ON public.bookings FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anonymous users to insert bookings"
ON public.bookings FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous users to update bookings"
ON public.bookings FOR UPDATE
TO anon
USING (true);

CREATE POLICY "Allow anonymous users to delete bookings"
ON public.bookings FOR DELETE
TO anon
USING (true);

-- Also allow authenticated users (if you plan to add authentication later)
CREATE POLICY "Allow authenticated users to read bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert bookings"
ON public.bookings FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to delete bookings"
ON public.bookings FOR DELETE
TO authenticated
USING (true);
