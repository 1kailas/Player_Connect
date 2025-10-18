-- Sample Data for Sports Ranking Platform
-- Run this after the application creates the initial schema

-- Insert Sample Achievements
INSERT INTO achievements (name, description, icon_url, badge_type, points_required, is_rare, is_active, created_at, updated_at) VALUES
('First Win', 'Win your first match', 'https://example.com/icons/first-win.png', 'BRONZE', 0, false, true, NOW(), NOW()),
('10 Wins', 'Win 10 matches', 'https://example.com/icons/10-wins.png', 'SILVER', 1000, false, true, NOW(), NOW()),
('50 Wins', 'Win 50 matches', 'https://example.com/icons/50-wins.png', 'GOLD', 5000, false, true, NOW(), NOW()),
('100 Wins', 'Win 100 matches', 'https://example.com/icons/100-wins.png', 'PLATINUM', 10000, true, true, NOW(), NOW()),
('Tournament Champion', 'Win a tournament', 'https://example.com/icons/champion.png', 'GOLD', 3000, false, true, NOW(), NOW()),
('Consistent Player', 'Play 30 days in a row', 'https://example.com/icons/consistent.png', 'SILVER', 2000, false, true, NOW(), NOW()),
('Team Captain', 'Create and lead a team', 'https://example.com/icons/captain.png', 'SILVER', 500, false, true, NOW(), NOW()),
('Legendary', 'Reach top 10 global ranking', 'https://example.com/icons/legendary.png', 'PLATINUM', 20000, true, true, NOW(), NOW());

-- Note: You'll need to manually add users through the registration API
-- The following are example queries for reference

-- Example: Create a sample admin user (password: admin123)
-- Password hash for "admin123" using BCrypt
-- INSERT INTO users (username, email, password, first_name, last_name, country, city, email_verified, account_locked, total_points, is_active, created_at, updated_at) VALUES
-- ('admin', 'admin@sportsplatform.com', '$2a$10$YourBCryptHashHere', 'Admin', 'User', 'USA', 'New York', true, false, 0, true, NOW(), NOW());

-- Example: Assign admin role
-- INSERT INTO user_roles (user_id, role) VALUES (1, 'ADMIN');

-- Sample Venues (can be inserted directly)
INSERT INTO venues (name, address, city, state, country, postal_code, latitude, longitude, capacity, facilities, contact_email, contact_phone, verified_venue, is_active, created_at, updated_at) VALUES
('Central Sports Complex', '123 Main Street', 'New York', 'NY', 'USA', '10001', 40.7128, -74.0060, 5000, '["Parking", "Cafeteria", "Changing Rooms", "Medical Room"]', 'info@centralsports.com', '+1-555-0100', true, true, NOW(), NOW()),
('Olympic Stadium', '456 Sports Avenue', 'Los Angeles', 'CA', 'USA', '90001', 34.0522, -118.2437, 80000, '["VIP Boxes", "Parking", "Restaurants", "Shops"]', 'contact@olympicstadium.com', '+1-555-0200', true, true, NOW(), NOW()),
('Community Sports Center', '789 Park Road', 'Chicago', 'IL', 'USA', '60601', 41.8781, -87.6298, 2000, '["Parking", "Cafeteria", "Lockers"]', 'info@communitysports.com', '+1-555-0300', true, true, NOW(), NOW()),
('Metro Arena', '321 Arena Boulevard', 'Houston', 'TX', 'USA', '77001', 29.7604, -95.3698, 15000, '["Parking", "Food Courts", "VIP Areas", "Medical Facilities"]', 'contact@metroarena.com', '+1-555-0400', true, true, NOW(), NOW());

-- Tips for using this data:
-- 1. First, start your application to create the schema
-- 2. Then run this SQL in Supabase SQL Editor
-- 3. Register users through the API (/api/auth/register)
-- 4. Use the API to create teams, events, and matches
-- 5. The ranking system will automatically calculate rankings as matches are played
