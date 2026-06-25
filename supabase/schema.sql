-- Run this in Supabase Dashboard → SQL Editor

create table if not exists public.submissions (
  id text primary key,
  created_at timestamptz not null default now(),
  name text not null default 'Website Visitor',
  email text not null,
  message text default ''
);

create index if not exists submissions_created_at_idx on public.submissions (created_at desc);
create index if not exists submissions_email_idx on public.submissions (email);

create table if not exists public.email_settings (
  id int primary key default 1 check (id = 1),
  notification_email text not null default 'bilalrazaupwork@gmail.com',
  emailjs_service_id text default '',
  emailjs_template_id text default '',
  emailjs_public_key text default '',
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.email_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.submissions enable row level security;
alter table public.email_settings enable row level security;

-- No public policies: only service_role key (backend) can access data.
