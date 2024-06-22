/** 
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table users (
    -- UUID from auth.users
    id              uuid references auth.users not null primary key,
    full_name       text,
    avatar_url      text,
    -- The customer's billing address, stored in JSON format.
    billing_address jsonb,
    -- Stores your customer's payment instruments.
    payment_method  jsonb
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
    current_period_end   timestamp with time zone default timezone('utc'::text, now()),
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
    total                number
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