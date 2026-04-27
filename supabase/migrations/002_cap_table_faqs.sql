-- ============================================
-- CAP TABLE ENTRIES
-- ============================================
create table public.cap_table_entries (
  id uuid primary key default uuid_generate_v4(),
  shareholder_name text not null,
  entity_type text not null check (entity_type in ('founder', 'investor', 'advisor', 'esop', 'reserved', 'gifted')),
  share_class text default 'Ordinary',
  shares_held bigint not null default 0,
  ownership_percentage numeric(7,4) default 0,
  investment_amount numeric(15,2) default 0,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.cap_table_entries enable row level security;

create policy "Cap table readable by authenticated" on public.cap_table_entries
  for select using (auth.role() = 'authenticated');

create policy "Admins can manage cap table" on public.cap_table_entries
  for all using (
    exists (select 1 from public.investors where auth_user_id = auth.uid() and is_admin = true)
  );

-- ============================================
-- FAQS TABLE
-- ============================================
create table public.faqs (
  id uuid primary key default uuid_generate_v4(),
  category text not null,
  question text not null,
  answer text not null,
  is_published boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.faqs enable row level security;

create policy "Published FAQs readable by authenticated" on public.faqs
  for select using (auth.role() = 'authenticated');

create policy "Admins can manage FAQs" on public.faqs
  for all using (
    exists (select 1 from public.investors where auth_user_id = auth.uid() and is_admin = true)
  );

-- ============================================
-- ADD CALENDLY URL TO SETTINGS
-- ============================================
alter table public.settings add column if not exists calendly_url text default '';
