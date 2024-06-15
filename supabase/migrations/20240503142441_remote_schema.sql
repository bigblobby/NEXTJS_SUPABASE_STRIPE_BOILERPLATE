/** 
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table users (
    -- UUID from auth.users
                       id uuid references auth.users not null primary key,
                       full_name text,
                       avatar_url text,
    -- The customer's billing address, stored in JSON format.
                       billing_address jsonb,
    -- Stores your customer's payment instruments.
                       payment_method jsonb
);
alter table users enable row level security;
create policy "Can view own user data." on users for select using (auth.uid() = id);
create policy "Can update own user data." on users for update using (auth.uid() = id);

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/
create function public.handle_new_user()
    returns trigger as $$
begin
insert into public.users (id, full_name, avatar_url)
values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

/**
* CUSTOMERS
* Note: this is a private table that contains a mapping of user IDs to Stripe customer IDs.
*/
create table customers (
    -- UUID from auth.users
                           id uuid references auth.users not null primary key,
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
                               id text primary key,
                               user_id uuid references auth.users not null,
    -- The status of the subscription object, one of subscription_status type above.
                               status subscription_status,
    -- Set of key-value pairs, used to store additional information about the object in a structured format.
                               metadata jsonb,
    -- ID of the price that created this subscription.
                               price_id text,
    -- Quantity multiplied by the unit amount of the price creates the amount of the subscription. Can be used to charge multiple seats.
                               quantity integer,
    -- If true the subscription has been canceled by the user and will be deleted at the end of the billing period.
                               cancel_at_period_end boolean,
    -- Time at which the subscription was created.
                               created timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Start of the current period that the subscription has been invoiced for.
                               current_period_start timestamp with time zone default timezone('utc'::text, now()) not null,
    -- End of the current period that the subscription has been invoiced for. At the end of this period, a new invoice will be created.
                               current_period_end timestamp with time zone default timezone('utc'::text, now()) not null,
    -- If the subscription has ended, the timestamp of the date the subscription ended.
                               ended_at timestamp with time zone default timezone('utc'::text, now()),
    -- A date in the future at which the subscription will automatically get canceled.
                               cancel_at timestamp with time zone default timezone('utc'::text, now()),
    -- If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with `cancel_at_period_end`, `canceled_at` will still reflect the date of the initial cancellation request, not the end of the subscription period when the subscription is automatically moved to a canceled state.
                               canceled_at timestamp with time zone default timezone('utc'::text, now()),
    -- If the subscription has a trial, the beginning of that trial.
                               trial_start timestamp with time zone default timezone('utc'::text, now()),
    -- If the subscription has a trial, the end of that trial.
                               trial_end timestamp with time zone default timezone('utc'::text, now())
);
alter table subscriptions enable row level security;
create policy "Can only view own subs data." on subscriptions for select using (auth.uid() = user_id);


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
                                      id                      text primary key,
    -- The supabase auth.user ID
                                      user_id                 uuid references auth.users not null,
    -- Paddle ID of the customer that this subscription is for, prefixed with ctm_.
                                      customer_id             text,
    -- Paddle ID for the transaction entity that resulted in this subscription being created, prefixed with txn_.
                                      transaction_id          text,
    -- The status of the subscription object, one of subscription_status type above.
                                      status                  paddle_subscription_status,
    -- Paddle ID of the address that this subscription is for, prefixed with add_.
                                      address_id              text,
    -- Paddle ID of the business that this subscription is for, prefixed with biz_.
                                      business_id             text,
    -- Supported three-letter ISO 4217 currency code.
                                      currency_code           paddle_currency_code,
    -- The date the subscription was created
                                      created_at              timestamp,
    -- The date the subscription was updated
                                      updated_at              timestamp,
    -- RFC 3339 datetime string of when this subscription started. This may be different from first_billed_at if the subscription started in trial.
                                      started_at              timestamp,
    -- RFC 3339 datetime string of when this subscription was first billed. This may be different from started_at if the subscription started in trial.
                                      first_billed_at         timestamp,
    -- RFC 3339 datetime string of when this subscription is next scheduled to be billed.
                                      next_billed_at          timestamp,
    -- RFC 3339 datetime string of when this subscription was paused. Set automatically by Paddle when the pause subscription operation is used. null if not paused.
                                      paused_at               timestamp,
    -- RFC 3339 datetime string of when this subscription was canceled. Set automatically by Paddle when the cancel subscription operation is used. null if not canceled.
                                      cancelled_at            timestamp,
    -- Details of the discount applied to this subscription.
                                      discount                jsonb,
    -- How payment is collected for transactions created for this subscription. automatic for checkout, manual for invoices.
                                      collection_mode         paddle_collection_mode,
    -- Details for invoicing. Required if collection_mode is manual.
                                      billing_details         jsonb,
    -- Current billing period for this subscription. Set automatically by Paddle based on the billing cycle.
                                      current_billing_period  jsonb,
    -- How often this subscription renews. Set automatically by Paddle based on the prices on this subscription.
                                      billing_cycle           jsonb,
    -- Change that's scheduled to be applied to a subscription. Use the pause subscription, cancel subscription, and resume subscription operations to create scheduled changes. null if no scheduled changes.
                                      scheduled_change        jsonb,
    -- An array of product IDs
                                      items                   jsonb,
    -- Custom data
                                      custom_data             jsonb
);
alter table paddle_subscriptions enable row level security;
create policy "Can only view own subs data." on paddle_subscriptions for select using (auth.uid() = user_id);