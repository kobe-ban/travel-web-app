-- ==========================================
-- Supabase SQL Schema สำหรับเว็บท่องเที่ยว
-- ==========================================

-- 1. สร้างตาราง profiles (ข้อมูลผู้ใช้)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. สร้างตาราง travel_plans (แผนการท่องเที่ยว)
CREATE TABLE travel_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  price NUMERIC(10, 2),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. สร้างตาราง promotions (โปรโมชั่น)
CREATE TABLE promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  discount INTEGER NOT NULL CHECK (discount >= 1 AND discount <= 100),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Function สร้าง profile อัตโนมัติเมื่อ user สมัคร
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger เรียก function เมื่อมี user ใหม่
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Row Level Security (RLS)

-- Profiles: ทุกคนอ่านได้, แก้ไขได้เฉพาะของตัวเอง/admin
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Travel Plans: ทุกคนอ่านได้, admin จัดการได้
ALTER TABLE travel_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Travel plans viewable by everyone"
  ON travel_plans FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage travel plans"
  ON travel_plans FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Promotions: active โปรโมชั่นทุกคนดูได้, admin จัดการได้
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Promotions viewable by everyone"
  ON promotions FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage promotions"
  ON promotions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 7. ข้อมูลตัวอย่าง (Optional)
INSERT INTO travel_plans (title, destination, description, duration, price, image_url) VALUES
('เที่ยวเชียงใหม่ 3 วัน 2 คืน', 'เชียงใหม่', 'สัมผัสธรรมชาติและวัฒนธรรมล้านนา เยี่ยมชมวัดพระธาตุดอยสุเทพ ตลาดไนท์บาซาร์', 3, 5900, 'https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=400'),
('ทะเลกระบี่ 4 วัน 3 คืน', 'กระบี่', 'ดำน้ำดูปะการัง เกาะพีพี อ่าวนาง หาดไร่เลย์', 4, 8500, 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400'),
('ภูเขาเขาใหญ่ 2 วัน 1 คืน', 'นครราชสีมา', 'เดินป่าอุทยานแห่งชาติเขาใหญ่ ชมน้ำตก ดูช้างป่า', 2, 3200, 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400');

INSERT INTO promotions (title, description, discount, start_date, end_date, is_active) VALUES
('Early Bird ลด 20%', 'จองล่วงหน้า 30 วัน รับส่วนลดทันที', 20, '2026-05-01', '2026-06-30', true),
('Summer Sale', 'โปรโมชั่นพิเศษช่วงซัมเมอร์ ลดสูงสุด 30%', 30, '2026-05-15', '2026-07-31', true);
