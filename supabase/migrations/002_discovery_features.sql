-- SwellFare MVP - Additional Schema for Discovery Features
-- Run this migration after 001_initial_schema.sql

-- Add surf_spot_name to destinations (maps spots to airports)
ALTER TABLE destinations 
ADD COLUMN IF NOT EXISTS surf_spot_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS skill_level VARCHAR(20) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert'));

-- Create board_bag_fees table (proprietary "secret sauce")
CREATE TABLE IF NOT EXISTS board_bag_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  airline_code VARCHAR(3) NOT NULL,
  airline_name VARCHAR(255) NOT NULL,
  fee_one_way DECIMAL(10, 2) NOT NULL CHECK (fee_one_way >= 0),
  fee_round_trip DECIMAL(10, 2) NOT NULL CHECK (fee_round_trip >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  policy_notes TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(airline_code)
);

-- Create strike_alerts table
CREATE TABLE IF NOT EXISTS strike_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  origin_code VARCHAR(3) NOT NULL,
  max_price DECIMAL(10, 2) NOT NULL CHECK (max_price > 0),
  min_swell_height DECIMAL(5, 2) DEFAULT 0.9 CHECK (min_swell_height >= 0),
  min_period DECIMAL(5, 2) DEFAULT 10 CHECK (min_period >= 0),
  skill_level VARCHAR(20) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_triggered TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_email, destination_id, origin_code)
);

-- Create index for strike alerts
CREATE INDEX IF NOT EXISTS idx_strike_alerts_active ON strike_alerts(is_active, destination_id) WHERE is_active = TRUE;

-- Function to check Prime Strike conditions
-- Prime Strike: Swell > 3ft (0.9m) AND Period > 10s AND Flight < $500
CREATE OR REPLACE FUNCTION is_prime_strike(
  swell_height_meters DECIMAL,
  swell_period DECIMAL,
  flight_price DECIMAL
) RETURNS BOOLEAN AS $$
BEGIN
  -- Convert 3ft to meters (approximately 0.91m)
  RETURN swell_height_meters > 0.91 
    AND swell_period > 10 
    AND flight_price < 500;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update swell_fare_deals view to include Prime Strike flag
CREATE OR REPLACE VIEW swell_fare_deals AS
SELECT 
  d.id AS destination_id,
  d.name AS destination_name,
  d.surf_spot_name,
  d.airport_code,
  d.latitude,
  d.longitude,
  d.timezone,
  d.skill_level AS destination_skill_level,
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
  END AS value_score,
  -- Prime Strike flag
  is_prime_strike(s.height, s.period, f.price) AS is_prime_strike
FROM destinations d
INNER JOIN swell_data s ON d.id = s.destination_id
INNER JOIN flight_fares f ON d.id = f.destination_id
WHERE s.timestamp >= CURRENT_DATE
  AND f.departure_date >= CURRENT_DATE
ORDER BY 
  is_prime_strike DESC,
  value_score DESC;

-- Function to get Surf-Fare Feed (top 10 destinations)
CREATE OR REPLACE FUNCTION get_surf_fare_feed(
  limit_count INTEGER DEFAULT 10
) RETURNS TABLE (
  destination_name VARCHAR(255),
  surf_spot_name VARCHAR(255),
  airport_code VARCHAR(3),
  swell_height DECIMAL,
  swell_period DECIMAL,
  price DECIMAL,
  currency VARCHAR(3),
  is_prime_strike BOOLEAN,
  value_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sfd.destination_name,
    sfd.surf_spot_name,
    sfd.airport_code,
    sfd.swell_height,
    sfd.swell_period,
    sfd.price,
    sfd.currency,
    sfd.is_prime_strike,
    sfd.value_score
  FROM swell_fare_deals sfd
  ORDER BY 
    sfd.is_prime_strike DESC,
    sfd.value_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Insert board bag fees for top 15 international airlines
INSERT INTO board_bag_fees (airline_code, airline_name, fee_one_way, fee_round_trip, currency, policy_notes) VALUES
('UA', 'United Airlines', 200.00, 400.00, 'USD', 'Each way, applies to oversized bags'),
('AA', 'American Airlines', 150.00, 300.00, 'USD', 'Each way for surfboards'),
('DL', 'Delta Air Lines', 200.00, 400.00, 'USD', 'Each way, must be in board bag'),
('BA', 'British Airways', 75.00, 150.00, 'GBP', 'Included in checked baggage allowance if under weight'),
('LH', 'Lufthansa', 100.00, 200.00, 'EUR', 'Each way, subject to size restrictions'),
('AF', 'Air France', 100.00, 200.00, 'EUR', 'Each way for oversized sports equipment'),
('QF', 'Qantas', 150.00, 300.00, 'AUD', 'Each way, must be properly packed'),
('JL', 'Japan Airlines', 200.00, 400.00, 'USD', 'Each way for sports equipment'),
('SQ', 'Singapore Airlines', 100.00, 200.00, 'USD', 'Each way, included in some fare classes'),
('EK', 'Emirates', 50.00, 100.00, 'USD', 'Each way, varies by route'),
('CX', 'Cathay Pacific', 100.00, 200.00, 'USD', 'Each way for sports equipment'),
('VS', 'Virgin Atlantic', 75.00, 150.00, 'GBP', 'Each way, check weight limits'),
('TK', 'Turkish Airlines', 100.00, 200.00, 'USD', 'Each way for oversized baggage'),
('NZ', 'Air New Zealand', 150.00, 300.00, 'NZD', 'Each way, must be in protective bag'),
('AS', 'Alaska Airlines', 100.00, 200.00, 'USD', 'Each way, included for some credit card holders')
ON CONFLICT (airline_code) DO UPDATE SET
  fee_one_way = EXCLUDED.fee_one_way,
  fee_round_trip = EXCLUDED.fee_round_trip,
  policy_notes = EXCLUDED.policy_notes,
  last_updated = NOW();


