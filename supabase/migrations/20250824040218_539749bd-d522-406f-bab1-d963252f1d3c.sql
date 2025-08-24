-- Create sample data with proper UUIDs

-- Insert sample events with generated UUIDs
INSERT INTO public.events (id, title, description, event_date, event_time, location, category, max_attendees, created_by)
VALUES 
  (gen_random_uuid(), 'Community Diwali Celebration', 'Join us for a grand Diwali celebration with cultural programs, food, and fireworks.', '2024-11-12', '18:00:00', 'Community Center, Main Hall', 'festival', 200, (SELECT user_id FROM profiles WHERE email = 'admin@demo.com' LIMIT 1)),
  (gen_random_uuid(), 'Monthly Community Meeting', 'Discuss community issues, upcoming projects, and volunteer opportunities.', '2024-09-15', '10:00:00', 'Conference Room A', 'meeting', 50, (SELECT user_id FROM profiles WHERE email = 'admin@demo.com' LIMIT 1)),
  (gen_random_uuid(), 'Youth Cricket Tournament', 'Annual cricket tournament for youth aged 16-25. Registration required.', '2024-09-20', '09:00:00', 'Sports Ground', 'social', 100, (SELECT user_id FROM profiles WHERE email = 'user@demo.com' LIMIT 1)),
  (gen_random_uuid(), 'Ganesh Chaturthi Pooja', 'Traditional Ganesh Chaturthi celebrations with prayers and cultural activities.', '2024-09-07', '16:00:00', 'Temple Premises', 'religious', 300, (SELECT user_id FROM profiles WHERE email = 'admin@demo.com' LIMIT 1))
ON CONFLICT (id) DO NOTHING;

-- Insert sample donation campaigns
INSERT INTO public.donation_campaigns (id, title, description, category, target_amount, end_date, organizer, created_by)
VALUES 
  (gen_random_uuid(), 'Emergency Medical Fund for Sharma Family', 'Support the Sharma family with medical expenses for their child''s urgent surgery.', 'healthcare', 100000, '2024-10-01', 'Community Welfare Committee', (SELECT user_id FROM profiles WHERE email = 'admin@demo.com' LIMIT 1)),
  (gen_random_uuid(), 'Education Support for Underprivileged Children', 'Help provide quality education materials and resources for children in need.', 'education', 200000, '2024-12-31', 'Education Support Group', (SELECT user_id FROM profiles WHERE email = 'admin@demo.com' LIMIT 1)),
  (gen_random_uuid(), 'Flood Relief Fund - Assam 2024', 'Emergency relief for flood-affected families in Assam. Immediate help needed.', 'disaster-relief', 500000, '2024-09-30', 'Disaster Relief Team', (SELECT user_id FROM profiles WHERE email = 'admin@demo.com' LIMIT 1)),
  (gen_random_uuid(), 'Community Garden Project', 'Create a sustainable community garden for organic vegetables and herbs.', 'community', 75000, '2024-11-15', 'Green Initiative Group', (SELECT user_id FROM profiles WHERE email = 'user@demo.com' LIMIT 1))
ON CONFLICT (id) DO NOTHING;

-- Insert sample jobs where profiles exist
INSERT INTO public.jobs (id, title, company, location, job_type, experience_level, salary_range, description, requirements, posted_by)
SELECT 
  gen_random_uuid(),
  'Senior Software Developer',
  'TechCorp India',
  'Mumbai, Maharashtra',
  'full-time',
  'Senior (5+ years)',
  '₹15-20 LPA',
  'Join our innovative team to build cutting-edge web applications using modern technologies.',
  'React, Node.js, TypeScript, 5+ years experience',
  user_id
FROM profiles WHERE email = 'admin@demo.com' LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- Insert more sample jobs
INSERT INTO public.jobs (id, title, company, location, job_type, experience_level, salary_range, description, requirements, posted_by)
SELECT 
  gen_random_uuid(),
  'Community Event Coordinator',
  'Local NGO',
  'Delhi, India',
  'part-time',
  'Mid-level (2-5 years)',
  '₹3-5 LPA',
  'Organize and manage community events, workshops, and social activities.',
  'Event management experience, excellent communication skills',
  user_id
FROM profiles WHERE email = 'admin@demo.com' LIMIT 1
ON CONFLICT (id) DO NOTHING;