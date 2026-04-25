-- ============================
-- 팔로(Pallo) Supabase 스키마
-- Supabase SQL Editor에 붙여넣기하여 실행
-- ============================

-- 유저 프로필 (auth.users와 1:1 연결)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('borrower', 'lender', 'admin')) default 'borrower',
  name text not null,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 업체 프로필
create table public.lender_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  company_name text not null,
  description text,
  logo_url text,
  license_number text,
  interest_rate_min numeric(5,2) not null,
  interest_rate_max numeric(5,2) not null,
  loan_amount_min bigint not null,
  loan_amount_max bigint not null,
  loan_types text[] not null default '{}',
  region text[] not null default '{}',
  plan text not null check (plan in ('free', 'standard', 'premium')) default 'free',
  is_verified boolean default false,
  contact_phone text not null,
  contact_email text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 업체 상품
create table public.lender_products (
  id uuid primary key default gen_random_uuid(),
  lender_id uuid not null references public.lender_profiles(id) on delete cascade,
  title text not null,
  description text,
  interest_rate numeric(5,2) not null,
  loan_amount_min bigint not null,
  loan_amount_max bigint not null,
  loan_period_months int not null,
  requirements text[] default '{}',
  loan_type text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 차주 견적 요청
create table public.borrower_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  desired_amount bigint not null,
  desired_period_months int not null,
  loan_type text not null,
  credit_score text check (credit_score in ('excellent', 'good', 'fair', 'poor')),
  collateral text,
  region text not null,
  status text not null check (status in ('active', 'closed', 'hidden')) default 'active',
  view_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 후기
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  lender_id uuid not null references public.lender_profiles(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  content text not null,
  created_at timestamptz default now(),
  unique(lender_id, author_id)
);

-- ============================
-- Row Level Security (RLS)
-- ============================

alter table public.profiles enable row level security;
alter table public.lender_profiles enable row level security;
alter table public.lender_products enable row level security;
alter table public.borrower_requests enable row level security;
alter table public.reviews enable row level security;

-- profiles: 본인만 수정, 전체 읽기
create policy "profiles_read" on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- lender_profiles: 전체 읽기, 본인만 수정
create policy "lender_profiles_read" on public.lender_profiles for select using (true);
create policy "lender_profiles_insert" on public.lender_profiles for insert with check (auth.uid() = user_id);
create policy "lender_profiles_update" on public.lender_profiles for update using (auth.uid() = user_id);

-- lender_products: 전체 읽기, 업체 본인만 수정
create policy "lender_products_read" on public.lender_products for select using (true);
create policy "lender_products_write" on public.lender_products for all
  using (auth.uid() = (select user_id from public.lender_profiles where id = lender_id));

-- borrower_requests: 전체 읽기, 본인만 수정
create policy "requests_read" on public.borrower_requests for select using (true);
create policy "requests_insert" on public.borrower_requests for insert with check (auth.uid() = user_id);
create policy "requests_update" on public.borrower_requests for update using (auth.uid() = user_id);

-- reviews: 전체 읽기, 로그인 유저만 작성
create policy "reviews_read" on public.reviews for select using (true);
create policy "reviews_insert" on public.reviews for insert with check (auth.uid() = author_id);

-- ============================
-- 조회수 증가 함수
-- ============================
create or replace function increment_view_count(request_id uuid)
returns void as $$
  update public.borrower_requests
  set view_count = view_count + 1
  where id = request_id;
$$ language sql security definer;

-- ============================
-- 신규 유저 자동 프로필 생성 트리거
-- ============================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', '사용자'),
    coalesce(new.raw_user_meta_data->>'role', 'borrower')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
