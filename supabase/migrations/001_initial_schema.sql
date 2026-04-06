-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- INVESTORS TABLE
-- ============================================
create table public.investors (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text not null,
  organisation text,
  investor_type text check (investor_type in ('individual', 'family_office', 'vc_fund', 'syndicate', 'sovereign', 'corporate', 'other')) default 'individual',
  status text check (status in ('invited', 'active', 'suspended', 'expired')) default 'invited',
  nda_signed boolean default false,
  nda_signed_at timestamptz,
  auth_user_id uuid references auth.users(id),
  access_expires_at timestamptz,
  notes text,
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- DOCUMENT FOLDERS TABLE
-- ============================================
create table public.document_folders (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  sort_order integer default 0,
  is_collapsed_default boolean default false,
  icon text default 'folder',
  created_at timestamptz default now()
);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
create table public.documents (
  id uuid primary key default uuid_generate_v4(),
  folder_id uuid references public.document_folders(id) on delete cascade,
  title text not null,
  description text,
  file_path text not null,
  file_type text not null,
  file_size bigint,
  version integer default 1,
  is_viewable boolean default true,
  is_downloadable boolean default false,
  is_watermarked boolean default true,
  sort_order integer default 0,
  uploaded_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- ACTIVITY LOG TABLE
-- ============================================
create table public.activity_log (
  id uuid primary key default uuid_generate_v4(),
  investor_id uuid references public.investors(id) on delete cascade,
  action text not null check (action in ('login', 'logout', 'view_document', 'download_document', 'sign_nda', 'request_access', 'submit_question')),
  document_id uuid references public.documents(id) on delete set null,
  duration_seconds integer,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- ============================================
-- QUESTIONS TABLE (Investor Q&A)
-- ============================================
create table public.questions (
  id uuid primary key default uuid_generate_v4(),
  investor_id uuid references public.investors(id) on delete cascade,
  question text not null,
  answer text,
  answered_by uuid,
  answered_at timestamptz,
  status text check (status in ('pending', 'answered')) default 'pending',
  created_at timestamptz default now()
);

-- ============================================
-- DATA ROOM SETTINGS TABLE
-- ============================================
create table public.settings (
  id uuid primary key default uuid_generate_v4(),
  room_name text default 'Influunt — Seed Round $5M',
  room_description text default 'Investor Data Room',
  nda_text text default 'This non-disclosure agreement ("Agreement") is entered into between Influunt Pty Ltd ("Company") and the undersigned party ("Recipient"). Recipient agrees to hold in confidence all proprietary information, financial data, business plans, projections, partner details, and strategic materials disclosed through this data room. Recipient shall not disclose, reproduce, or distribute any materials without prior written consent from the Company. This obligation survives for a period of two (2) years from the date of acceptance. Breach of this agreement may result in legal action and liability for damages.',
  watermark_opacity integer default 15,
  require_nda boolean default true,
  allow_downloads boolean default false,
  brand_primary_color text default '#1a1a1a',
  brand_accent_color text default '#C8A85C',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Insert default settings row
insert into public.settings (room_name) values ('Influunt — Seed Round $5M');

-- ============================================
-- INSERT DEFAULT DOCUMENT FOLDERS
-- ============================================
insert into public.document_folders (name, description, sort_order, is_collapsed_default) values
  ('The opportunity', 'Start here — the essential documents that tell the Influunt story', 1, false),
  ('Technical architecture', 'Deep-dive into ICC token architecture, Holli AI, and the protocol layer', 2, true),
  ('Partnership briefs', 'Strategic partner details and integration frameworks', 3, true),
  ('Traction & evidence', 'LOIs, pilot commitments, partnership agreements, and product demos', 4, true),
  ('Legal & governance', 'Corporate structure, cap table, incorporation documents, and IP', 5, true),
  ('Regulatory & compliance', 'Licensing status, jurisdictional compliance, and AML/KYC frameworks', 6, true);

-- ============================================
-- INSERT ADMIN USERS
-- ============================================
insert into public.investors (email, name, organisation, is_admin, status, nda_signed)
values
  ('brad@influunt.global', 'Brad Crawford', 'Influunt', true, 'active', true),
  ('kayde@influunt.global', 'Kayde', 'Influunt', true, 'active', true);

-- ============================================
-- AUTH TRIGGER: Link auth.users to investors
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  update public.investors
  set auth_user_id = new.id, status = 'active', updated_at = now()
  where email = new.email;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.investors enable row level security;
alter table public.documents enable row level security;
alter table public.document_folders enable row level security;
alter table public.activity_log enable row level security;
alter table public.questions enable row level security;
alter table public.settings enable row level security;

-- Investors can read their own record
create policy "Investors can view own record" on public.investors
  for select using (auth.uid() = auth_user_id);

-- Admin can manage all investors
create policy "Admins can manage investors" on public.investors
  for all using (
    exists (select 1 from public.investors where auth_user_id = auth.uid() and is_admin = true)
  );

-- Investors can update their own record (for NDA signing)
create policy "Investors can update own record" on public.investors
  for update using (auth.uid() = auth_user_id);

-- Investors can read all document folders
create policy "Investors can view folders" on public.document_folders
  for select using (true);

-- Investors can read viewable documents
create policy "Investors can view documents" on public.documents
  for select using (is_viewable = true);

-- Admins can manage documents
create policy "Admins can manage documents" on public.documents
  for all using (
    exists (select 1 from public.investors where auth_user_id = auth.uid() and is_admin = true)
  );

-- Investors can insert their own activity
create policy "Investors can log activity" on public.activity_log
  for insert with check (
    investor_id in (select id from public.investors where auth_user_id = auth.uid())
  );

-- Investors can read their own activity
create policy "Investors can view own activity" on public.activity_log
  for select using (
    investor_id in (select id from public.investors where auth_user_id = auth.uid())
  );

-- Admins can read all activity
create policy "Admins can view all activity" on public.activity_log
  for select using (
    exists (select 1 from public.investors where auth_user_id = auth.uid() and is_admin = true)
  );

-- Investors can submit questions
create policy "Investors can submit questions" on public.questions
  for insert with check (
    investor_id in (select id from public.investors where auth_user_id = auth.uid())
  );

-- Investors can view their own questions
create policy "Investors can view own questions" on public.questions
  for select using (
    investor_id in (select id from public.investors where auth_user_id = auth.uid())
  );

-- Admins can manage questions
create policy "Admins can manage questions" on public.questions
  for all using (
    exists (select 1 from public.investors where auth_user_id = auth.uid() and is_admin = true)
  );

-- Settings readable by all authenticated
create policy "Settings readable by authenticated" on public.settings
  for select using (auth.role() = 'authenticated');

-- Admins can update settings
create policy "Admins can update settings" on public.settings
  for update using (
    exists (select 1 from public.investors where auth_user_id = auth.uid() and is_admin = true)
  );
