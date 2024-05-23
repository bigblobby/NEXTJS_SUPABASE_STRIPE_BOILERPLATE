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
    id                 uuid references auth.users not null primary key,
    -- The user's customer ID in Lemon Squeezy. User must not be able to update this.
    ls_customer_id     text
);
alter table ls_customers enable row level security;

/**
* SUBSCRIPTIONS
* Note: subscriptions are created and managed in Lemon Squeezy and synced to our DB via Lemon Squeezy webhooks.
*/
create type ls_subscription_status as enum ('on_trial', 'active', 'cancelled', 'past_due', 'paused', 'unpaid', 'expired');
create table ls_subscriptions (
    -- Subscription ID from Lemon Squeezy.
    id                     text primary key,
    -- The supabase auth.user ID
    user_id                uuid references auth.users not null,
    -- The ID of the customer this subscription belongs to.
    customer_id            integer not null,
    -- The ID of the store this subscription belongs to.
    store_id               integer not null,
    -- The ID of the order associated with this subscription.
    order_id               integer not null,
    -- The ID of the order item associated with this subscription.
    order_item_id          integer not null,
    -- The ID of the product associated with this subscription.
    product_id             integer not null,
    -- The ID of the variant associated with this subscription.
    variant_id             integer not null,
    -- The full name of the customer.
    user_name              text not null,
    -- The email address of the customer.
    user_email             text not null,
    -- A boolean indicating if the subscription has been cancelled.
    cancelled              boolean,
    -- The status of the subscription
    status                 ls_subscription_status not null,
    -- An object containing the payment collection pause behaviour options for the subscription, if set
    pause                  text,
    -- Lowercase brand of the card used to pay for the latest subscription payment.
    card_brand             text,
    -- The last 4 digits of the card used to pay for the latest subscription payment. Will be empty for non-card payments.
    card_last_four         text,
    -- An object representing the first subscription item belonging to this subscription.
    first_subscription_item json,
    -- An integer representing a day of the month (21 equals 21st day of the month). This is the day on which subscription invoice payments are collected.
    billing_anchor         integer,
    -- An object of customer-facing URLs for managing the subscription
    urls                   json,
    -- If the subscription has a free trial (status is on_trial), this will be an ISO 8601 formatted date-time string indicating when the trial period ends. For all other status values, this will be null.
    trial_ends_at          timestamp,
    -- An ISO 8601 formatted date-time string indicating the end of the current billing cycle, and when the next invoice will be issued. This also applies to past_due subscriptions; renews_at will reflect the next renewal charge attempt.
    renews_at              timestamp not null,
    --If the subscription has as status of cancelled or expired, this will be an ISO 8601 formatted date-time string indicating when the subscription expires (or expired). For all other status values, this will be null.
    ends_at                timestamp,
    -- An ISO 8601 formatted date-time string indicating when the object was last updated.
    updated_at             timestamp not null,
    -- An ISO 8601 formatted date-time string indicating when the object was created.
    created_at             timestamp not null
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
    id                          text primary key,
    -- The supabase auth.user ID
    user_id                     uuid references auth.users not null,
    -- The ID of the store this order belongs to.
    store_id                    integer not null ,
    -- The ID of the customer this order belongs to.
    customer_id                 integer not null,
    -- The unique identifier (UUID) for this order.
    identifier                  text,
    -- An integer representing the sequential order number for this store.
    order_number                integer not null,
    -- The full name of the customer.
    user_name                   text,
    -- The email address of the customer.
    user_email                  text,
    -- The ISO 4217 currency code for the order (e.g. USD, GBP, etc).
    currency                    text not null,
    -- If the order currency is USD, this will always be 1.0. Otherwise, this is the currency conversion rate used to determine the cost of the order in USD at the time of purchase.
    currency_rate               text,
    -- A positive integer in cents representing the subtotal of the order in the order currency.
    subtotal                    integer,
    -- A positive integer in cents representing the setup fee of the order in the order currency.
    setup_fee                   integer,
    -- A positive integer in cents representing the total discount value applied to the order in the order currency.
    discount_total              integer,
    -- A positive integer in cents representing the tax applied to the order in the order currency.
    tax                         integer,
    -- A positive integer in cents representing the total cost of the order in the order currency.
    total                       integer,
    -- A positive integer in cents representing the subtotal of the order in USD.
    subtotal_usd                integer,
    -- A positive integer in cents representing the setup fee of the order in USD.
    setup_fee_usd               integer,
    -- A positive integer in cents representing the total discount value applied to the order in USD.
    discount_total_usd          integer,
    -- A positive integer in cents representing the tax applied to the order in USD.
    tax_usd                     integer,
    -- A positive integer in cents representing the total cost of the order in USD.
    total_usd                   integer,
    -- The name of the tax rate (e.g. VAT, Sales Tax, etc) applied to the order. Will be null if no tax was applied.
    tax_name                    text,
    -- If tax is applied to the order, this will be the rate of tax as a decimal percentage.
    tax_rate                    text,
    -- A boolean indicating if the order was created with tax inclusive or exclusive pricing.
    tax_inclusive               boolean,
    -- The status of the order.
    status                      ls_order_status,
    -- Has the value true if the order has been refunded.
    refunded                    boolean,
    -- If the order has been refunded, this will be an ISO 8601 formatted date-time string indicating when the order was refunded.
    refunded_at                 timestamp,
    -- A human-readable string representing the subtotal of the order in the order currency (e.g. $9.99).
    subtotal_formatted          text,
    -- A human-readable string representing the setup fee of the order in the order currency (e.g. $9.99).
    setup_fee_formatted         text,
    -- A human-readable string representing the total discount value applied to the order in the order currency (e.g. $9.99).
    discount_total_formatted    text,
    -- A human-readable string representing the tax applied to the order in the order currency (e.g. $9.99).
    tax_formatted               text,
    -- A human-readable string representing the total cost of the order in the order currency (e.g. $9.99).
    total_formatted             text,
    -- An object representing the first order item belonging to this order.
    first_order_item            jsonb,
    -- An object of customer-facing URLs for this order.
    urls                        jsonb,
    -- An ISO 8601 formatted date-time string indicating when the object was created.
    created_at                  timestamp,
    -- An ISO 8601 formatted date-time string indicating when the object was last updated.
    updated_at                  timestamp
);
alter table ls_orders enable row level security;
create policy "Can only view own subs data." on ls_orders for select using (auth.uid() = user_id);