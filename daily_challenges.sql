-- Daily challenges table
CREATE TABLE daily_challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  applications_count INTEGER DEFAULT 0,
  goal_met BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create an index for faster queries
CREATE INDEX idx_daily_challenges_user_date ON daily_challenges(user_id, date);

-- Function to update daily challenge when an application is created
CREATE OR REPLACE FUNCTION update_daily_challenge()
RETURNS TRIGGER AS $$
DECLARE
  challenge_exists INTEGER;
BEGIN
  -- Check if a challenge record exists for today
  SELECT COUNT(*) INTO challenge_exists 
  FROM daily_challenges 
  WHERE user_id = NEW.user_id AND date = CURRENT_DATE;
  
  IF challenge_exists > 0 THEN
    -- Update existing challenge
    UPDATE daily_challenges
    SET applications_count = applications_count + 1,
        goal_met = CASE WHEN applications_count + 1 >= 5 THEN TRUE ELSE goal_met END,
        updated_at = NOW()
    WHERE user_id = NEW.user_id AND date = CURRENT_DATE;
  ELSE
    -- Create new challenge for today
    INSERT INTO daily_challenges (user_id, date, applications_count, goal_met)
    VALUES (NEW.user_id, CURRENT_DATE, 1, CASE WHEN 1 >= 5 THEN TRUE ELSE FALSE END);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update daily challenge when a new application is created
CREATE TRIGGER update_daily_challenge_trigger
AFTER INSERT ON applications
FOR EACH ROW
EXECUTE FUNCTION update_daily_challenge();
