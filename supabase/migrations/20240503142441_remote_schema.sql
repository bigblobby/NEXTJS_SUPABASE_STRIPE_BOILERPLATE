/**
* -------------------------------------------------------
* Section - Settings
* -------------------------------------------------------
*/

CREATE TABLE IF NOT EXISTS public.config
(
    enable_team_accounts            boolean default true,
    enable_personal_account_billing boolean default true,
    enable_team_account_billing     boolean default true,
    billing_provider                text    default 'stripe'
);

-- create config row
INSERT INTO public.config (enable_team_accounts, enable_personal_account_billing, enable_team_account_billing)
VALUES (true, true, true);

-- enable select on the config table
GRANT SELECT ON public.config TO authenticated, service_role;

-- enable RLS on config
ALTER TABLE public.config
    ENABLE ROW LEVEL SECURITY;

create policy "Public settings can be read by authenticated users" on public.config
    for select
                   to authenticated
                   using (
                   true
                   );

/**
  * -------------------------------------------------------
  * Section - Utility functions
  * -------------------------------------------------------
 */

/**
  public.get_config()
  Get the full config object to check settings
  This is not accessible from the outside, so can only be used inside postgres functions
 */
CREATE OR REPLACE FUNCTION public.get_config()
    RETURNS json AS
$$
DECLARE
result RECORD;
BEGIN
SELECT * from public.config limit 1 into result;
return row_to_json(result);
END;
$$ LANGUAGE plpgsql;

grant execute on function public.get_config() to authenticated, service_role;

/**
  public.is_set("field_name")
  Check a specific boolean config value
 */
CREATE OR REPLACE FUNCTION public.is_set(field_name text)
    RETURNS boolean AS
$$
DECLARE
result BOOLEAN;
BEGIN
execute format('select %I from public.config limit 1', field_name) into result;
return result;
END;
$$ LANGUAGE plpgsql;

grant execute on function public.is_set(text) to authenticated;


/**
  * Automatic handling for maintaining created_at and updated_at timestamps
  * on tables
 */
CREATE OR REPLACE FUNCTION public.trigger_set_timestamps()
    RETURNS TRIGGER AS
$$
BEGIN
    if TG_OP = 'INSERT' then
        NEW.created_at = now();
        NEW.updated_at = now();
else
        NEW.updated_at = now();
        NEW.created_at = OLD.created_at;
end if;
RETURN NEW;
END
$$ LANGUAGE plpgsql;


/**
  * Automatic handling for maintaining created_by and updated_by timestamps
  * on tables
 */
CREATE OR REPLACE FUNCTION public.trigger_set_user_tracking()
    RETURNS TRIGGER AS
$$
BEGIN
    if TG_OP = 'INSERT' then
        NEW.created_by = auth.uid();
        NEW.updated_by = auth.uid();
else
        NEW.updated_by = auth.uid();
        NEW.created_by = OLD.created_by;
end if;
RETURN NEW;
END
$$ LANGUAGE plpgsql;

/**
 * Account roles allow you to provide permission levels to users
 * when they're acting on an account.  By default, we provide
 * "owner" and "member".  The only distinction is that owners can
 * also manage billing and invite/remove account members.
 */
DO
$$
BEGIN
        -- check it account_role already exists on public schema
        IF NOT EXISTS(SELECT 1
                      FROM pg_type t
                               JOIN pg_namespace n ON n.oid = t.typnamespace
                      WHERE t.typname = 'account_role'
                        AND n.nspname = 'public') THEN
CREATE TYPE public.account_role AS ENUM ('owner', 'member');
end if;
end;
$$;

/**
  public.generate_token(length)
  Generates a secure token - used internally for invitation tokens
  but could be used elsewhere.  Check out the invitations table for more info on
  how it's used
 */
CREATE OR REPLACE FUNCTION public.generate_token(length int)
    RETURNS text AS
$$
select regexp_replace(replace(
                              replace(replace(replace(encode(gen_random_bytes(length)::bytea, 'base64'), '/', ''), '+',
                                              ''), '\', ''),
                              '=',
                              ''), E'[\\n\\r]+', '', 'g');
$$ LANGUAGE sql;

grant execute on function public.generate_token(int) to authenticated;

/**
 * Accounts are the primary grouping for most objects within
 * the system. They have many users, and all billing is connected to
 * an account.
 */
CREATE TABLE IF NOT EXISTS public.accounts
(
    id                    uuid unique                NOT NULL DEFAULT extensions.uuid_generate_v4(),
    -- defaults to the user who creates the account
    -- this user cannot be removed from an account without changing
    -- the primary owner first
    primary_owner_user_id uuid references auth.users not null default auth.uid(),
    -- Account name
    name                  text,
    slug                  text unique,
    personal_account      boolean                             default false not null,
    updated_at            timestamp with time zone,
    created_at            timestamp with time zone,
                                        created_by            uuid references auth.users,
                                        updated_by            uuid references auth.users,
                                        private_metadata      jsonb                               default '{}'::jsonb,
                                        public_metadata       jsonb                               default '{}'::jsonb,
                                        PRIMARY KEY (id)
    );


-- constraint that conditionally allows nulls on the slug ONLY if personal_account is true
-- remove this if you want to ignore accounts slugs entirely
ALTER TABLE public.accounts
    ADD CONSTRAINT public_accounts_slug_null_if_personal_account_true CHECK (
        (personal_account = true AND slug is null)
            OR (personal_account = false AND slug is not null)
        );

-- Open up access to accounts
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.accounts TO authenticated, service_role;

/**
 * We want to protect some fields on accounts from being updated
 * Specifically the primary owner user id and account id.
 * primary_owner_user_id should be updated using the dedicated function
 */
CREATE OR REPLACE FUNCTION public.protect_account_fields()
    RETURNS TRIGGER AS
$$
BEGIN
    IF current_user IN ('authenticated', 'anon') THEN
        -- these are protected fields that users are not allowed to update themselves
        -- platform admins should be VERY careful about updating them as well.
        if NEW.id <> OLD.id
            OR NEW.personal_account <> OLD.personal_account
            OR NEW.primary_owner_user_id <> OLD.primary_owner_user_id
        THEN
            RAISE EXCEPTION 'You do not have permission to update this field';
end if;
end if;

RETURN NEW;
END
$$ LANGUAGE plpgsql;


-- trigger to protect account fields
CREATE TRIGGER public_protect_account_fields
    BEFORE UPDATE
    ON public.accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_account_fields();

-- convert any character in the slug that's not a letter, number, or dash to a dash on insert/update for accounts
CREATE OR REPLACE FUNCTION public.slugify_account_slug()
    RETURNS TRIGGER AS
$$
BEGIN
    if NEW.slug is not null then
        NEW.slug = lower(regexp_replace(NEW.slug, '[^a-zA-Z0-9-]+', '-', 'g'));
end if;

RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- trigger to slugify the account slug
CREATE TRIGGER public_slugify_account_slug
    BEFORE INSERT OR UPDATE
                         ON public.accounts
                         FOR EACH ROW
                         EXECUTE FUNCTION public.slugify_account_slug();

-- enable RLS for accounts
alter table public.accounts
    enable row level security;

-- protect the timestamps
CREATE TRIGGER public_set_accounts_timestamp
    BEFORE INSERT OR UPDATE
                         ON public.accounts
                         FOR EACH ROW
                         EXECUTE PROCEDURE public.trigger_set_timestamps();

-- set the user tracking
CREATE TRIGGER public_set_accounts_user_tracking
    BEFORE INSERT OR UPDATE
                         ON public.accounts
                         FOR EACH ROW
                         EXECUTE PROCEDURE public.trigger_set_user_tracking();





/**
  * Account users are the users that are associated with an account.
  * They can be invited to join the account, and can have different roles.
  * The system does not enforce any permissions for roles, other than restricting
  * billing and account membership to only owners
 */
create table if not exists public.account_user
(
    -- id of the user in the account
    user_id      uuid references auth.users on delete cascade        not null,
    -- id of the account the user is in
    account_id   uuid references public.accounts on delete cascade not null,
    -- role of the user in the account
    account_role public.account_role                               not null,
    constraint account_user_pkey primary key (user_id, account_id)
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.account_user TO authenticated, service_role;


-- enable RLS for account_user
alter table public.account_user
    enable row level security;

/**
  * When an account gets created, we want to insert the current user as the first
  * owner
 */
create or replace function public.add_current_user_to_new_account()
    returns trigger
    language plpgsql
    security definer
    set search_path = public
as
$$
begin
    if new.primary_owner_user_id = auth.uid() then
        insert into public.account_user (account_id, user_id, account_role)
        values (NEW.id, auth.uid(), 'owner');
end if;
return NEW;
end;
$$;

-- trigger the function whenever a new account is created
CREATE TRIGGER public_add_current_user_to_new_account
    AFTER INSERT
    ON public.accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.add_current_user_to_new_account();

/**
  * When a user signs up, we need to create a personal account for them
  * and add them to the account_user table so they can act on it
 */
create or replace function public.run_new_user_setup()
    returns trigger
    language plpgsql
    security definer
    set search_path = public
as
$$
declare
first_account_id    uuid;
    generated_user_name text;
begin

    -- first we setup the user profile
    -- TODO: see if we can get the user's name from the auth.users table once we learn how oauth works
    if new.email IS NOT NULL then
        generated_user_name := split_part(new.email, '@', 1);
end if;
    -- create the new users's personal account
insert into public.accounts (name, primary_owner_user_id, personal_account, id)
values (generated_user_name, NEW.id, true, NEW.id)
    returning id into first_account_id;

-- add them to the account_user table so they can act on it
insert into public.account_user (account_id, user_id, account_role)
values (first_account_id, NEW.id, 'owner');

return NEW;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
    after insert
    on auth.users
    for each row
    execute procedure public.run_new_user_setup();


/**
  * -------------------------------------------------------
  * Section - Account permission utility functions
  * -------------------------------------------------------
  * These functions are stored on the public schema, and useful for things like
  * generating RLS policies
 */

/**
  * Returns true if the current user has the pass in role on the passed in account
  * If no role is sent, will return true if the user is a member of the account
  * NOTE: This is an inefficient function when used on large query sets. You should reach for the get_accounts_with_role and lookup
  * the account ID in those cases.
 */
create or replace function public.has_role_on_account(account_id uuid, account_role public.account_role default null)
    returns boolean
    language sql
    security definer
    set search_path = public
as
$$
select exists(
    select 1
    from public.account_user wu
    where wu.user_id = auth.uid()
      and wu.account_id = has_role_on_account.account_id
      and (
        wu.account_role = has_role_on_account.account_role
            or has_role_on_account.account_role is null
        )
);
$$;

grant execute on function public.has_role_on_account(uuid, public.account_role) to authenticated;


/**
  * Returns account_ids that the current user is a member of. If you pass in a role,
  * it'll only return accounts that the user is a member of with that role.
  */
create or replace function public.get_accounts_with_role(passed_in_role public.account_role default null)
    returns setof uuid
    language sql
    security definer
    set search_path = public
as
$$
select account_id
from public.account_user wu
where wu.user_id = auth.uid()
  and (
    wu.account_role = passed_in_role
        or passed_in_role is null
    );
$$;

grant execute on function public.get_accounts_with_role(public.account_role) to authenticated;

/**
  Returns the current user's accounts
 */
create or replace function public.get_accounts()
    returns json
    language sql
as
$$
select coalesce(json_agg(
                        json_build_object(
                                'account_id', wu.account_id,
                                'account_role', wu.account_role,
                                'is_primary_owner', a.primary_owner_user_id = auth.uid(),
                                'name', a.name,
                                'slug', a.slug,
                                'personal_account', a.personal_account,
                                'created_at', a.created_at,
                                'updated_at', a.updated_at
                        )
                ), '[]'::json)
from public.account_user wu
         join public.accounts a on a.id = wu.account_id
where wu.user_id = auth.uid();
$$;

grant execute on function public.get_accounts() to authenticated;

/**
 * Returns the current user's role within a given account_id
*/
create or replace function public.current_user_account_role(account_id uuid)
    returns jsonb
    language plpgsql
as
$$
DECLARE
response jsonb;
BEGIN

select jsonb_build_object(
               'account_role', wu.account_role,
               'is_primary_owner', a.primary_owner_user_id = auth.uid(),
               'is_personal_account', a.personal_account
       )
into response
from public.account_user wu
         join public.accounts a on a.id = wu.account_id
where wu.user_id = auth.uid()
  and wu.account_id = current_user_account_role.account_id;

-- if the user is not a member of the account, throw an error
if response ->> 'account_role' IS NULL then
        raise exception 'Not found';
end if;

return response;
END
$$;

grant execute on function public.current_user_account_role(uuid) to authenticated;


/**
  Returns a list of current account members. Only account owners can access this function.
  It's a security definer because it requries us to lookup personal_accounts for existing members so we can
  get their names.
 */
create or replace function public.get_account_members(account_id uuid, results_limit integer default 50,
                                                      results_offset integer default 0)
    returns json
    language plpgsql
    security definer
    set search_path = public
as
$$
BEGIN

    -- only account owners can access this function
    if (select public.current_user_account_role(get_account_members.account_id) ->> 'account_role' <> 'owner') then
                raise exception 'Only account owners can access this function';
end if;

return (select json_agg(
                       json_build_object(
                               'user_id', wu.user_id,
                               'account_role', wu.account_role,
                               'name', p.name,
                               'email', u.email,
                               'is_primary_owner', a.primary_owner_user_id = wu.user_id
                       )
               )
        from public.account_user wu
                 join public.accounts a on a.id = wu.account_id
                 join public.accounts p on p.primary_owner_user_id = wu.user_id and p.personal_account = true
                 join auth.users u on u.id = wu.user_id
        where wu.account_id = get_account_members.account_id
    limit coalesce(get_account_members.results_limit, 50) offset coalesce(get_account_members.results_offset, 0));
END;
$$;

grant execute on function public.get_account_members(uuid, integer, integer) to authenticated;

/**
  Returns a specific account that the current user has access to
 */
create or replace function public.get_account(account_id uuid)
    returns json
    language plpgsql
as
$$
BEGIN
    -- check if the user is a member of the account or a service_role user
    if current_user IN ('anon', 'authenticated') and
       (select current_user_account_role(get_account.account_id) ->> 'account_role' IS NULL) then
        raise exception 'You must be a member of an account to access it';
end if;


return (select json_build_object(
                       'account_id', a.id,
                       'account_role', wu.account_role,
                       'is_primary_owner', a.primary_owner_user_id = auth.uid(),
                       'name', a.name,
                       'slug', a.slug,
                       'personal_account', a.personal_account,
                       'billing_enabled', case
                                              when a.personal_account = true then
                                                  config.enable_personal_account_billing
                                              else
                                                  config.enable_team_account_billing
                           end,
                       'created_at', a.created_at,
                       'updated_at', a.updated_at,
                       'metadata', a.public_metadata
               )
        from public.accounts a
                 left join public.account_user wu on a.id = wu.account_id and wu.user_id = auth.uid()
                 join public.config config on true
--                  left join (select bs.account_id, status
--                             from public.subscriptions bs
--                             where bs.account_id = get_account.account_id
--                             order by created desc
--                                 limit 1) bs on bs.account_id = a.id
        where a.id = get_account.account_id);
END;
$$;

grant execute on function public.get_account(uuid) to authenticated, service_role;

/**
  Returns a specific account that the current user has access to
 */
create or replace function public.get_account_by_slug(slug text)
    returns json
    language plpgsql
as
$$
DECLARE
internal_account_id uuid;
BEGIN
select a.id
into internal_account_id
from public.accounts a
where a.slug IS NOT NULL
  and a.slug = get_account_by_slug.slug;

return public.get_account(internal_account_id);
END;
$$;

grant execute on function public.get_account_by_slug(text) to authenticated;



/**
  Returns the personal account for the current user
 */
create or replace function public.get_personal_account()
    returns json
    language plpgsql
as
$$
BEGIN
return public.get_account(auth.uid());
END;
$$;

grant execute on function public.get_personal_account() to authenticated;

/**
  * -------------------------
  * Section - RLS Policies
  * -------------------------
  * This is where we define access to tables in the public schema
 */
create policy "users can view their own account_users" on public.account_user
    for select
                                                                          to authenticated
                                                                          using (
                                                                          user_id = auth.uid()
                                                                          );

create policy "users can view their teammates" on public.account_user
    for select
                   to authenticated
                   using (
                   public.has_role_on_account(account_id) = true
                   );

create policy "Account users can be deleted by owners except primary account owner" on public.account_user
    for delete
to authenticated
    using (
    (public.has_role_on_account(account_id, 'owner') = true)
        AND
    user_id != (select primary_owner_user_id
                from public.accounts
                where account_id = accounts.id)
    );

create policy "Accounts are viewable by members" on public.accounts
    for select
                   to authenticated
                   using (
                   public.has_role_on_account(id) = true
                   );

-- Primary owner should always have access to the account
create policy "Accounts are viewable by primary owner" on public.accounts
    for select
                   to authenticated
                   using (
                   primary_owner_user_id = auth.uid()
                   );

create policy "Team accounts can be created by any user" on public.accounts
    for insert
    to authenticated
    with check (
    public.is_set('enable_team_accounts') = true
        and personal_account = false
    );


create policy "Accounts can be edited by owners" on public.accounts
    for update
                          to authenticated
                          using (
                          public.has_role_on_account(id, 'owner') = true
                          );

/**
* CUSTOMERS
* Note: this is a private table that contains a mapping of user IDs to Stripe customer IDs.
*/
create table customers (
    -- UUID from auth.users
    id                 uuid references auth.users not null primary key,
    -- The user's customer ID in Stripe. User must not be able to update this.
    stripe_customer_id text
);
alter table customers enable row level security;
-- No policies as this is a private table that the user must not have access to.

/**
* SUBSCRIPTIONS
* Note: subscriptions are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
create type subscription_status as enum ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');
create table subscriptions (
    -- Subscription ID from Stripe, e.g. sub_1234.
    id                   text primary key,
    user_id              uuid references auth.users                                    not null,
    -- The status of the subscription object, one of subscription_status type above.
    status               subscription_status,
    -- Set of key-value pairs, used to store additional information about the object in a structured format.
    metadata             jsonb,
    -- ID of the price that created this subscription.
    price_id             text,
    -- Quantity multiplied by the unit amount of the price creates the amount of the subscription. Can be used to charge multiple seats.
    quantity             integer,
    -- If true the subscription has been canceled by the user and will be deleted at the end of the billing period.
    cancel_at_period_end boolean,
    -- Time at which the subscription was created.
    created              timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Start of the current period that the subscription has been invoiced for.
    current_period_start timestamp with time zone default timezone('utc'::text, now()) not null,
    -- End of the current period that the subscription has been invoiced for. At the end of this period, a new invoice will be created.
    current_period_end   timestamp with time zone default timezone('utc'::text, now()) not null,
    -- If the subscription has ended, the timestamp of the date the subscription ended.
    ended_at             timestamp with time zone default timezone('utc'::text, now()),
    -- A date in the future at which the subscription will automatically get canceled.
    cancel_at            timestamp with time zone default timezone('utc'::text, now()),
    -- If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with `cancel_at_period_end`, `canceled_at` will still reflect the date of the initial cancellation request, not the end of the subscription period when the subscription is automatically moved to a canceled state.
    canceled_at          timestamp with time zone default timezone('utc'::text, now()),
    -- If the subscription has a trial, the beginning of that trial.
    trial_start          timestamp with time zone default timezone('utc'::text, now()),
    -- If the subscription has a trial, the end of that trial.
    trial_end            timestamp with time zone default timezone('utc'::text, now())
);
alter table subscriptions enable row level security;
create policy "Can only view own subs data." on subscriptions for select using (auth.uid() = user_id);

create table orders (
    -- Order ID from Stripe, e.g. pi_1234.
    id                   text primary key,
    user_id              uuid references auth.users not null,
    -- Set of key-value pairs, used to store additional information about the object in a structured format.
    metadata             jsonb,
    -- List of items
    items                jsonb,
    -- Time at which the order was created.
    created              timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Total cost of order
    total                integer
);
alter table orders enable row level security;
create policy "Can only view own subs data." on orders for select using (auth.uid() = user_id);


create type paddle_collection_mode as enum ('manual', 'automatic');
create type paddle_currency_code as enum ('USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF','HKD','SGD','SEK','ARS','BRL','CNY','COP','CZK','DKK','HUF','ILS','INR','KRW','MXN','NOK','NZD','PLN','RUB','THB','TRY','TWD','UAH','ZAR');

/**
* CUSTOMERS
* Note: this is a private table that contains a mapping of user IDs to Paddle customer IDs.
*/
create table paddle_customers (
    -- UUID from auth.users
    id                 uuid references auth.users not null primary key,
    -- The user's customer ID in Paddle. User must not be able to update this.
    paddle_customer_id text
);
alter table paddle_customers enable row level security;


/**
* SUBSCRIPTIONS
* Note: subscriptions are created and managed in Paddle and synced to our DB via Paddle webhooks.
*/
create type paddle_subscription_status as enum ('trialing', 'active', 'canceled', 'past_due', 'paused');
create table paddle_subscriptions (
    -- Subscription ID from Paddle, e.g. sub_1234.
    id                     text primary key,
    -- The supabase auth.user ID
    user_id                uuid references auth.users not null,
    -- Paddle ID of the customer that this subscription is for, prefixed with ctm_.
    customer_id            text,
    -- Paddle ID for the transaction entity that resulted in this subscription being created, prefixed with txn_.
    transaction_id         text,
    -- The status of the subscription object, one of subscription_status type above.
    status                 paddle_subscription_status,
    -- Paddle ID of the address that this subscription is for, prefixed with add_.
    address_id             text,
    -- Paddle ID of the business that this subscription is for, prefixed with biz_.
    business_id            text,
    -- Supported three-letter ISO 4217 currency code.
    currency_code          paddle_currency_code,
    -- The date the subscription was created
    created_at             timestamp,
    -- The date the subscription was updated
    updated_at             timestamp,
    -- RFC 3339 datetime string of when this subscription started. This may be different from first_billed_at if the subscription started in trial.
    started_at             timestamp,
    -- RFC 3339 datetime string of when this subscription was first billed. This may be different from started_at if the subscription started in trial.
    first_billed_at        timestamp,
    -- RFC 3339 datetime string of when this subscription is next scheduled to be billed.
    next_billed_at         timestamp,
    -- RFC 3339 datetime string of when this subscription was paused. Set automatically by Paddle when the pause subscription operation is used. null if not paused.
    paused_at              timestamp,
    -- RFC 3339 datetime string of when this subscription was canceled. Set automatically by Paddle when the cancel subscription operation is used. null if not canceled.
    cancelled_at           timestamp,
    -- Details of the discount applied to this subscription.
    discount               jsonb,
    -- How payment is collected for transactions created for this subscription. automatic for checkout, manual for invoices.
    collection_mode        paddle_collection_mode,
    -- Details for invoicing. Required if collection_mode is manual.
    billing_details        jsonb,
    -- Current billing period for this subscription. Set automatically by Paddle based on the billing cycle.
    current_billing_period jsonb,
    -- How often this subscription renews. Set automatically by Paddle based on the prices on this subscription.
    billing_cycle          jsonb,
    -- Change that's scheduled to be applied to a subscription. Use the pause subscription, cancel subscription, and resume subscription operations to create scheduled changes. null if no scheduled changes.
    scheduled_change       jsonb,
    -- An array of product IDs
    items                  jsonb,
    -- Custom data
    custom_data            jsonb
);
alter table paddle_subscriptions enable row level security;
create policy "Can only view own subs data." on paddle_subscriptions for select using (auth.uid() = user_id);

create type ls_item_type as enum ('standard', 'custom');
create type ls_entity_status as enum ('active', 'archived');
create type ls_tax_mode as enum ('account_setting', 'external', 'internal');
create type ls_collection_mode as enum ('manual', 'automatic');
create type ls_currency_code as enum ('USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF','HKD','SGD','SEK','ARS','BRL','CNY','COP','CZK','DKK','HUF','ILS','INR','KRW','MXN','NOK','NZD','PLN','RUB','THB','TRY','TWD','UAH','ZAR');

/**
* CUSTOMERS
* Note: this is a private table that contains a mapping of user IDs to Lemon Squeezy customer IDs.
*/
create table ls_customers (
    -- UUID from auth.users
    id             uuid references auth.users not null primary key,
    -- The user's customer ID in Lemon Squeezy. User must not be able to update this.
    ls_customer_id text
);
alter table ls_customers enable row level security;

/**
* SUBSCRIPTIONS
* Note: subscriptions are created and managed in Lemon Squeezy and synced to our DB via Lemon Squeezy webhooks.
*/
create type ls_subscription_status as enum ('on_trial', 'active', 'cancelled', 'past_due', 'paused', 'unpaid', 'expired');
create table ls_subscriptions (
    -- Subscription ID from Lemon Squeezy.
    id                      text primary key,
    -- The supabase auth.user ID
    user_id                 uuid references auth.users not null,
    -- The ID of the customer this subscription belongs to.
    customer_id             integer                    not null,
    -- The ID of the store this subscription belongs to.
    store_id                integer                    not null,
    -- The ID of the order associated with this subscription.
    order_id                integer                    not null,
    -- The ID of the order item associated with this subscription.
    order_item_id           integer                    not null,
    -- The ID of the product associated with this subscription.
    product_id              integer                    not null,
    -- The ID of the variant associated with this subscription.
    variant_id              integer                    not null,
    -- The full name of the customer.
    user_name               text                       not null,
    -- The email address of the customer.
    user_email              text                       not null,
    -- A boolean indicating if the subscription has been cancelled.
    cancelled               boolean,
    -- The status of the subscription
    status                  ls_subscription_status     not null,
    -- An object containing the payment collection pause behaviour options for the subscription, if set
    pause                   text,
    -- Lowercase brand of the card used to pay for the latest subscription payment.
    card_brand              text,
    -- The last 4 digits of the card used to pay for the latest subscription payment. Will be empty for non-card payments.
    card_last_four          text,
    -- An object representing the first subscription item belonging to this subscription.
    first_subscription_item json,
    -- An integer representing a day of the month (21 equals 21st day of the month). This is the day on which subscription invoice payments are collected.
    billing_anchor          integer,
    -- An object of customer-facing URLs for managing the subscription
    urls                    json,
    -- If the subscription has a free trial (status is on_trial), this will be an ISO 8601 formatted date-time string indicating when the trial period ends. For all other status values, this will be null.
    trial_ends_at           timestamp,
    -- An ISO 8601 formatted date-time string indicating the end of the current billing cycle, and when the next invoice will be issued. This also applies to past_due subscriptions; renews_at will reflect the next renewal charge attempt.
    renews_at               timestamp                  not null,
    --If the subscription has as status of cancelled or expired, this will be an ISO 8601 formatted date-time string indicating when the subscription expires (or expired). For all other status values, this will be null.
    ends_at                 timestamp,
    -- An ISO 8601 formatted date-time string indicating when the object was last updated.
    updated_at              timestamp                  not null,
    -- An ISO 8601 formatted date-time string indicating when the object was created.
    created_at              timestamp                  not null
);
alter table ls_subscriptions enable row level security;
create policy "Can only view own subs data." on ls_subscriptions for select using (auth.uid() = user_id);

/**
* ORDERS
* Note: Orders are created and managed in Lemon Squeezy and synced to our DB via Lemon Squeezy webhooks.
*/
create type ls_order_status as enum ('pending', 'failed', 'paid', 'refunded');
create table ls_orders (
    -- Order ID from Lemon Squeezy
    id                       text primary key,
    -- The supabase auth.user ID
    user_id                  uuid references auth.users not null,
    -- The ID of the store this order belongs to.
    store_id                 integer                    not null,
    -- The ID of the customer this order belongs to.
    customer_id              integer                    not null,
    -- The unique identifier (UUID) for this order.
    identifier               text,
    -- An integer representing the sequential order number for this store.
    order_number             integer                    not null,
    -- The full name of the customer.
    user_name                text,
    -- The email address of the customer.
    user_email               text,
    -- The ISO 4217 currency code for the order (e.g. USD, GBP, etc).
    currency                 text                       not null,
    -- If the order currency is USD, this will always be 1.0. Otherwise, this is the currency conversion rate used to determine the cost of the order in USD at the time of purchase.
    currency_rate            text,
    -- A positive integer in cents representing the subtotal of the order in the order currency.
    subtotal                 integer,
    -- A positive integer in cents representing the setup fee of the order in the order currency.
    setup_fee                integer,
    -- A positive integer in cents representing the total discount value applied to the order in the order currency.
    discount_total           integer,
    -- A positive integer in cents representing the tax applied to the order in the order currency.
    tax                      integer,
    -- A positive integer in cents representing the total cost of the order in the order currency.
    total                    integer,
    -- A positive integer in cents representing the subtotal of the order in USD.
    subtotal_usd             integer,
    -- A positive integer in cents representing the setup fee of the order in USD.
    setup_fee_usd            integer,
    -- A positive integer in cents representing the total discount value applied to the order in USD.
    discount_total_usd       integer,
    -- A positive integer in cents representing the tax applied to the order in USD.
    tax_usd                  integer,
    -- A positive integer in cents representing the total cost of the order in USD.
    total_usd                integer,
    -- The name of the tax rate (e.g. VAT, Sales Tax, etc) applied to the order. Will be null if no tax was applied.
    tax_name                 text,
    -- If tax is applied to the order, this will be the rate of tax as a decimal percentage.
    tax_rate                 text,
    -- A boolean indicating if the order was created with tax inclusive or exclusive pricing.
    tax_inclusive            boolean,
    -- The status of the order.
    status                   ls_order_status,
    -- Has the value true if the order has been refunded.
    refunded                 boolean,
    -- If the order has been refunded, this will be an ISO 8601 formatted date-time string indicating when the order was refunded.
    refunded_at              timestamp,
    -- A human-readable string representing the subtotal of the order in the order currency (e.g. $9.99).
    subtotal_formatted       text,
    -- A human-readable string representing the setup fee of the order in the order currency (e.g. $9.99).
    setup_fee_formatted      text,
    -- A human-readable string representing the total discount value applied to the order in the order currency (e.g. $9.99).
    discount_total_formatted text,
    -- A human-readable string representing the tax applied to the order in the order currency (e.g. $9.99).
    tax_formatted            text,
    -- A human-readable string representing the total cost of the order in the order currency (e.g. $9.99).
    total_formatted          text,
    -- An object representing the first order item belonging to this order.
    first_order_item         jsonb,
    -- An object of customer-facing URLs for this order.
    urls                     jsonb,
    -- An ISO 8601 formatted date-time string indicating when the object was created.
    created_at               timestamp,
    -- An ISO 8601 formatted date-time string indicating when the object was last updated.
    updated_at               timestamp
);
alter table ls_orders enable row level security;
create policy "Can only view own subs data." on ls_orders for select using (auth.uid() = user_id);