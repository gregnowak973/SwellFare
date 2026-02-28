-- Seed Golden 20 Destinations
-- Run this in Supabase SQL Editor after running the initial schema migrations

INSERT INTO destinations (name, airport_code, latitude, longitude, timezone, ideal_swell_direction)
VALUES
  ('Malibu, California', 'LAX', 34.0324, -118.6758, 'America/Los_Angeles', 270),
  ('Pipeline, Oahu', 'HNL', 21.6569, -158.0500, 'Pacific/Honolulu', 315),
  ('Trestles, California', 'SNA', 33.3847, -117.5892, 'America/Los_Angeles', 220),
  ('Nosara, Costa Rica', 'SJO', 9.9833, -85.6500, 'America/Costa_Rica', 225),
  ('Tamarindo, Costa Rica', 'LIR', 10.3000, -85.8333, 'America/Costa_Rica', 225),
  ('Playa Venao, Panama', 'PTY', 7.4500, -80.0167, 'America/Panama', 180),
  ('Arpoador, Rio de Janeiro', 'GIG', -22.9878, -43.1919, 'America/Sao_Paulo', 135),
  ('Chicama, Peru', 'TRU', -7.8333, -79.1500, 'America/Lima', 225),
  ('Mancora, Peru', 'PIU', -4.1000, -81.0500, 'America/Lima', 225),
  ('Nazaré, Portugal', 'LIS', 39.6011, -9.0714, 'Europe/Lisbon', 315),
  ('Ericeira, Portugal', 'LIS', 39.0167, -9.4167, 'Europe/Lisbon', 270),
  ('Hossegor, France', 'BIQ', 43.6500, -1.4000, 'Europe/Paris', 270),
  ('Uluwatu, Bali', 'DPS', -8.8292, 115.0850, 'Asia/Makassar', 225),
  ('Canggu, Bali', 'DPS', -8.6500, 115.1333, 'Asia/Makassar', 225),
  ('Raglan, New Zealand', 'AKL', -37.8000, 174.8833, 'Pacific/Auckland', 225),
  ('Byron Bay, Australia', 'BNE', -28.6474, 153.6020, 'Australia/Sydney', 135),
  ('Jeffreys Bay, South Africa', 'CPT', -34.0500, 24.9167, 'Africa/Johannesburg', 180),
  ('Teahupo''o, Tahiti', 'PPT', -17.8667, -149.2667, 'Pacific/Tahiti', 225),
  ('Cloudbreak, Fiji', 'NAN', -18.1667, 177.4500, 'Pacific/Fiji', 225)
ON CONFLICT (airport_code) DO NOTHING;


