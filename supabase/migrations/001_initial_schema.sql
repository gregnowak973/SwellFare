-- SwellFare Database Schema Migration
-- Run this migration in your Supabase SQL editor

-- Create destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  airport_code VARCHAR(3) NOT NULL UNIQUE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  timezone VARCHAR(50) NOT NULL,
  ideal_swell_direction INTEGER NOT NULL CHECK (ideal_swell_direction >= 0 AND ideal_swell_direction <= 360),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create swell_data table
CREATE TABLE IF NOT EXISTS swell_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  height DECIMAL(5, 2) NOT NULL CHECK (height >= 0),
  period DECIMAL(5, 2) NOT NULL CHECK (period >= 0),
  wind_speed DECIMAL(5, 2) NOT NULL CHECK (wind_speed >= 0),
  wind_direction INTEGER NOT NULL CHECK (wind_direction >= 0 AND wind_direction <= 360),
  type VARCHAR(20) NOT NULL CHECK (type IN ('barrel', 'log')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(destination_id, timestamp)
);

-- Create flight_fares table
CREATE TABLE IF NOT EXISTS flight_fares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  origin_code VARCHAR(3) NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL CHECK (return_date > departure_date),
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_swell_data_destination_timestamp ON swell_data(destination_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_flight_fares_destination ON flight_fares(destination_id);
CREATE INDEX IF NOT EXISTS idx_flight_fares_dates ON flight_fares(departure_date, return_date);
CREATE INDEX IF NOT EXISTS idx_destinations_airport_code ON destinations(airport_code);

-- Function to calculate wind alignment multiplier
CREATE OR REPLACE FUNCTION calculate_wind_alignment(
  wind_dir INTEGER,
  ideal_swell_dir INTEGER
) RETURNS DECIMAL AS $$
DECLARE
  angle_diff INTEGER;
BEGIN
  -- Calculate the absolute difference in angles (accounting for 360-degree wrap)
  angle_diff := ABS(wind_dir - ideal_swell_dir);
  IF angle_diff > 180 THEN
    angle_diff := 360 - angle_diff;
  END IF;
  
  -- Offshore: wind direction is opposite to swell (180 degrees difference)
  -- Onshore: wind direction is same as swell (0-45 degrees difference)
  -- Cross-shore: 45-135 degrees difference
  
  IF angle_diff >= 135 AND angle_diff <= 180 THEN
    -- Offshore conditions (wind blowing offshore)
    RETURN 1.2;
  ELSIF angle_diff <= 45 THEN
    -- Onshore conditions (wind blowing onshore)
    RETURN 0.5;
  ELSE
    -- Cross-shore conditions
    RETURN 1.0;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create the swell_fare_deals view
CREATE OR REPLACE VIEW swell_fare_deals AS
SELECT 
  d.id AS destination_id,
  d.name AS destination_name,
  d.airport_code,
  d.latitude,
  d.longitude,
  d.timezone,
  s.id AS swell_id,
  s.timestamp AS swell_timestamp,
  s.height AS swell_height,
  s.period AS swell_period,
  s.wind_speed,
  s.wind_direction,
  s.type AS swell_type,
  f.id AS fare_id,
  f.origin_code,
  f.price,
  f.departure_date,
  f.return_date,
  f.currency,
  -- Calculate Value Score: V = (Height × Period × WindAlignment) / Price
  CASE 
    WHEN f.price > 0 THEN
      (s.height * s.period * calculate_wind_alignment(s.wind_direction, d.ideal_swell_direction)) / f.price
    ELSE 0
  END AS value_score
FROM destinations d
INNER JOIN swell_data s ON d.id = s.destination_id
INNER JOIN flight_fares f ON d.id = f.destination_id
WHERE s.timestamp >= CURRENT_DATE
  AND f.departure_date >= CURRENT_DATE
ORDER BY value_score DESC;

-- Create a function to get top deals by surf type
CREATE OR REPLACE FUNCTION get_top_deals_by_type(
  surf_type VARCHAR(20),
  limit_count INTEGER DEFAULT 5
) RETURNS TABLE (
  destination_name VARCHAR(255),
  airport_code VARCHAR(3),
  swell_height DECIMAL,
  swell_period DECIMAL,
  price DECIMAL,
  value_score DECIMAL,
  departure_date DATE,
  return_date DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sfd.destination_name,
    sfd.airport_code,
    sfd.swell_height,
    sfd.swell_period,
    sfd.price,
    sfd.value_score,
    sfd.departure_date,
    sfd.return_date
  FROM swell_fare_deals sfd
  WHERE sfd.swell_type = surf_type
  ORDER BY sfd.value_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_destinations_updated_at
  BEFORE UPDATE ON destinations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flight_fares_updated_at
  BEFORE UPDATE ON flight_fares
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

