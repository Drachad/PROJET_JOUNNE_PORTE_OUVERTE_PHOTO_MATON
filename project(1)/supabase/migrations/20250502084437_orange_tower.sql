/*
  # Create visitors table

  1. New Tables
    - `visitors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `institution` (text)
      - `photo` (text)
      - `certificate_id` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `visitors` table
    - Add policy for authenticated users to read all data
    - Add policy for authenticated users to insert their own data
*/

CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  institution text NOT NULL,
  photo text NOT NULL,
  certificate_id text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visitors"
  ON visitors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert visitors"
  ON visitors
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
