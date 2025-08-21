-- Create demo admin and user accounts with profiles

-- Insert demo admin user profile
INSERT INTO public.profiles (user_id, full_name, email, phone, location, profession, bio)
VALUES (
  'demo-admin-uuid-123456789',
  'Admin User',
  'admin@demo.com',
  '+91 98765 43210',
  'Mumbai, Maharashtra',
  'Community Administrator',
  'Passionate about building strong community connections and helping members thrive.'
)
ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location = EXCLUDED.location,
  profession = EXCLUDED.profession,
  bio = EXCLUDED.bio;

-- Insert demo regular user profile  
INSERT INTO public.profiles (user_id, full_name, email, phone, location, profession, bio)
VALUES (
  'demo-user-uuid-123456789',
  'Regular User',
  'user@demo.com',
  '+91 87654 32109',
  'Delhi, India',
  'Software Engineer',
  'Tech enthusiast and community volunteer. Love to participate in local events and help others.'
)
ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location = EXCLUDED.location,
  profession = EXCLUDED.profession,
  bio = EXCLUDED.bio;

-- Assign admin role to admin user
INSERT INTO public.user_roles (user_id, role, assigned_by)
VALUES (
  'demo-admin-uuid-123456789',
  'admin',
  'demo-admin-uuid-123456789'
)
ON CONFLICT (user_id, role) DO NOTHING;

-- Assign user role to regular user
INSERT INTO public.user_roles (user_id, role, assigned_by)
VALUES (
  'demo-user-uuid-123456789',
  'user',
  'demo-admin-uuid-123456789'
)
ON CONFLICT (user_id, role) DO NOTHING;

-- Insert sample events
INSERT INTO public.events (title, description, event_date, event_time, location, category, max_attendees, created_by)
VALUES 
  ('Community Diwali Celebration', 'Join us for a grand Diwali celebration with cultural programs, food, and fireworks.', '2024-11-12', '18:00:00', 'Community Center, Main Hall', 'festival', 200, 'demo-admin-uuid-123456789'),
  ('Monthly Community Meeting', 'Discuss community issues, upcoming projects, and volunteer opportunities.', '2024-09-15', '10:00:00', 'Conference Room A', 'meeting', 50, 'demo-admin-uuid-123456789'),
  ('Youth Cricket Tournament', 'Annual cricket tournament for youth aged 16-25. Registration required.', '2024-09-20', '09:00:00', 'Sports Ground', 'social', 100, 'demo-user-uuid-123456789'),
  ('Ganesh Chaturthi Pooja', 'Traditional Ganesh Chaturthi celebrations with prayers and cultural activities.', '2024-09-07', '16:00:00', 'Temple Premises', 'religious', 300, 'demo-admin-uuid-123456789')
ON CONFLICT (id) DO NOTHING;

-- Insert sample donation campaigns
INSERT INTO public.donation_campaigns (title, description, category, target_amount, end_date, organizer, created_by, image_url)
VALUES 
  ('Emergency Medical Fund for Sharma Family', 'Support the Sharma family with medical expenses for their child''s urgent surgery.', 'healthcare', 100000, '2024-10-01', 'Community Welfare Committee', 'demo-admin-uuid-123456789', NULL),
  ('Education Support for Underprivileged Children', 'Help provide quality education materials and resources for children in need.', 'education', 200000, '2024-12-31', 'Education Support Group', 'demo-admin-uuid-123456789', NULL),
  ('Flood Relief Fund - Assam 2024', 'Emergency relief for flood-affected families in Assam. Immediate help needed.', 'disaster-relief', 500000, '2024-09-30', 'Disaster Relief Team', 'demo-admin-uuid-123456789', NULL),
  ('Community Garden Project', 'Create a sustainable community garden for organic vegetables and herbs.', 'community', 75000, '2024-11-15', 'Green Initiative Group', 'demo-user-uuid-123456789', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample jobs
INSERT INTO public.jobs (title, company, location, job_type, experience_level, salary_range, description, requirements, posted_by)
VALUES 
  ('Senior Software Developer', 'TechCorp India', 'Mumbai, Maharashtra', 'full-time', 'Senior (5+ years)', '₹15-20 LPA', 'Join our innovative team to build cutting-edge web applications using modern technologies.', 'React, Node.js, TypeScript, 5+ years experience', 'demo-admin-uuid-123456789'),
  ('Community Event Coordinator', 'Local NGO', 'Delhi, India', 'part-time', 'Mid-level (2-5 years)', '₹3-5 LPA', 'Organize and manage community events, workshops, and social activities.', 'Event management experience, excellent communication skills', 'demo-admin-uuid-123456789'),
  ('Freelance Graphic Designer', 'Multiple Clients', 'Remote', 'contract', 'Mid-level (2-5 years)', '₹500-1500 per project', 'Create visual designs for community newsletters, event posters, and social media.', 'Adobe Creative Suite, portfolio required', 'demo-user-uuid-123456789'),
  ('Teaching Assistant', 'Local School', 'Pune, Maharashtra', 'part-time', 'Entry-level (0-2 years)', '₹15,000-25,000 per month', 'Assist teachers with classroom activities and student support programs.', 'Graduate degree, patience with children', 'demo-admin-uuid-123456789')
ON CONFLICT (id) DO NOTHING;

-- Insert sample family members
INSERT INTO public.family_members (name, relation, phone, email, location, added_by)
VALUES 
  ('Rajesh Kumar Sharma', 'Uncle', '+91 98765 12345', 'rajesh.sharma@email.com', 'Mumbai, Maharashtra', 'demo-user-uuid-123456789'),
  ('Priya Patel', 'Cousin', '+91 87654 98765', 'priya.patel@email.com', 'Ahmedabad, Gujarat', 'demo-user-uuid-123456789'),
  ('Arjun Singh', 'Brother', '+91 76543 21098', 'arjun.singh@email.com', 'Delhi, India', 'demo-user-uuid-123456789'),
  ('Kavita Gupta', 'Aunt', '+91 65432 10987', 'kavita.gupta@email.com', 'Bangalore, Karnataka', 'demo-admin-uuid-123456789'),
  ('Rohit Verma', 'Cousin', '+91 54321 09876', 'rohit.verma@email.com', 'Hyderabad, Telangana', 'demo-admin-uuid-123456789')
ON CONFLICT (id) DO NOTHING;

-- Insert sample marketplace items
INSERT INTO public.marketplace_items (title, description, category, price, condition, location, seller_id)
VALUES 
  ('iPhone 13 Pro Max', 'Excellent condition iPhone 13 Pro Max 256GB. Used for 1 year with all accessories.', 'electronics', 65000, 'Excellent', 'Mumbai, Maharashtra', 'demo-user-uuid-123456789'),
  ('Wooden Dining Table Set', 'Beautiful 6-seater wooden dining table with chairs. Perfect for family dinners.', 'furniture', 15000, 'Good', 'Delhi, India', 'demo-admin-uuid-123456789'),
  ('Kids Study Books Bundle', 'Complete set of CBSE class 10 study materials and reference books.', 'books', 2500, 'Good', 'Pune, Maharashtra', 'demo-user-uuid-123456789'),
  ('Cricket Kit Complete', 'Professional cricket kit with bat, pads, helmet, and gloves. Lightly used.', 'sports', 8000, 'Good', 'Chennai, Tamil Nadu', 'demo-admin-uuid-123456789'),
  ('Laptop HP Pavilion', 'HP Pavilion laptop, i5 processor, 8GB RAM, 512GB SSD. Great for students.', 'electronics', 35000, 'Excellent', 'Bangalore, Karnataka', 'demo-user-uuid-123456789')
ON CONFLICT (id) DO NOTHING;

-- Insert sample classified ads
INSERT INTO public.classified_ads (title, description, category, price, contact_phone, location, posted_by)
VALUES 
  ('Home Cleaning Service', 'Professional home cleaning services available. Weekly, monthly packages available.', 'services', '₹500-1500 per visit', '+91 98765 43210', 'Mumbai, Maharashtra', 'demo-user-uuid-123456789'),
  ('2BHK Flat for Rent', 'Spacious 2BHK apartment in prime location. Fully furnished with modern amenities.', 'housing', '₹25,000 per month', '+91 87654 32109', 'Delhi, India', 'demo-admin-uuid-123456789'),
  ('Maruti Swift 2018', '2018 Maruti Swift in excellent condition. Single owner, all papers clear.', 'vehicles', '₹4,50,000', '+91 76543 21098', 'Pune, Maharashtra', 'demo-user-uuid-123456789'),
  ('Sofa Set 5-Seater', 'Comfortable 5-seater sofa set in brown leather. Moving sale, must go!', 'furniture', '₹12,000', '+91 65432 10987', 'Bangalore, Karnataka', 'demo-admin-uuid-123456789'),
  ('Math Tutoring Classes', 'Experienced math teacher offering tutoring for classes 8-12. Flexible timings.', 'services', '₹800 per hour', '+91 54321 09876', 'Chennai, Tamil Nadu', 'demo-user-uuid-123456789')
ON CONFLICT (id) DO NOTHING;

-- Insert sample community posts
INSERT INTO public.community_posts (title, content, category, author_id)
VALUES 
  ('Welcome New Members!', 'We are excited to welcome all our new community members! Please introduce yourselves and let us know how we can help you settle in. Don''t forget to check out our upcoming events and join the ones that interest you.', 'general', 'demo-admin-uuid-123456789'),
  ('Community Garden Update', 'Great progress on our community garden project! We have successfully planted tomatoes, herbs, and flowers. Volunteers needed for weekend maintenance. Contact me if you''re interested in helping out.', 'announcement', 'demo-user-uuid-123456789'),
  ('Lost and Found: Blue Bicycle', 'Has anyone seen a blue mountain bicycle that was parked near the community center yesterday evening? It has a small bell and a water bottle holder. Please contact me if you have any information.', 'help', 'demo-user-uuid-123456789'),
  ('Diwali Celebration Planning', 'Planning committee for Diwali celebration is looking for volunteers! We need help with decorations, food coordination, and cultural program organization. This is a great opportunity to contribute to our community festivities.', 'event', 'demo-admin-uuid-123456789'),
  ('Recommendation: Local Plumber', 'Can anyone recommend a reliable and affordable plumber in the area? I need some urgent repairs done and would prefer someone who has been tried and tested by community members.', 'question', 'demo-user-uuid-123456789')
ON CONFLICT (id) DO NOTHING;