
create type paddle_item_type as enum ('standard', 'custom');
create type paddle_entity_status as enum ('active', 'archived');
create type paddle_tax_mode as enum ('account_setting', 'external', 'internal');
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
* PRODUCTS
* Note: products are created and managed in Paddle and synced to our DB via Paddle webhooks.
*/
create type paddle_product_tax_category as enum ('digital-goods', 'ebooks', 'implementation-services', 'professional-services', 'saas', 'software-programming-services', 'standard', 'training-services', 'website-hosting');
create table paddle_products (
    -- Product ID from Paddle, e.g. prod_1234.
    id              text primary key,
    -- Whether the product is 'active' or 'archived'
    status          paddle_entity_status,
    -- The product's name, meant to be displayable to the customer. Whenever this product is sold via a subscription, name will show up on associated invoice line item descriptions.
    name            text,
    -- The product's description, meant to be displayable to the customer. Use this field to optionally store a long form explanation of the product being sold for your own rendering purposes.
    description     text,
    -- One of `standard` or `custom`.
    type            paddle_item_type,
    -- The products tax category
    tax_category    paddle_product_tax_category,
    -- A URL of the product image in Paddle, meant to be displayable to the customer.
    image           text,
    -- Set of key-value pairs, used to store additional information about the object in a structured format.
    custom_data     jsonb,
    -- The date the product was created
    created_at      timestamp,
    -- The date the product was updated
    updated_at      timestamp
);
alter table paddle_products enable row level security;
create policy "Allow public read-only access." on paddle_products for select using (true);

/**
* PRICES
* Note: prices are created and managed in Paddle and synced to our DB via Paddle webhooks.
* https://developer.paddle.com/webhooks/prices/price-created
*/
create type paddle_pricing_plan_interval as enum ('day', 'week', 'month', 'year');
create table paddle_prices (
    -- Price ID from Paddle, e.g. price_1234.
    id                          text primary key,
    -- The ID of the product that this price belongs to.
    product_id                  text references paddle_products,
    -- Whether this entity can be used in Paddle.
    status                      paddle_entity_status,
    -- A brief description of the price.
    description                 text,
    -- The product name
    name                        text,
    -- One of `standard` or `custom`.
    type                        paddle_item_type,
    -- The unit amount as a positive integer in the smallest currency unit (e.g., 100 cents for US$1.00 or 100 for ¥100, a zero-decimal currency).
    unit_price_amount           text,
    -- Supported three-letter ISO 4217 currency code.
    unit_price_currency_code    paddle_currency_code,
    -- The frequency at which a subscription is billed. One of `day`, `week`, `month` or `year`.
    interval                    paddle_pricing_plan_interval,
    -- The number of intervals (specified in the `interval` attribute) between subscription billings. For example, `interval=month` and `interval_count=3` bills every 3 months.
    interval_frequency          integer,
    -- The frequency of the trial period. One of `day`, `week`, `month` or `year`.
    trial_interval              paddle_pricing_plan_interval,
    -- The number of intervals (specified in the `interval` attribute) between subscription billings. For example, `interval=month` and `interval_count=3` bills every 3 months.
    trial_interval_frequency    integer,
    -- How tax is calculated for this price.
    tax_mode                    paddle_tax_mode,
    -- Limits on how many times the related product can be purchased at this price
    quantity_min                integer,
    -- Limits on how many times the related product can be purchased at this price
    quantity_max                integer,
    -- List of unit price overrides. Use to override the base price with a custom price and currency for a country or group of countries.
    unit_price_overrides        jsonb,
    -- Set of key-value pairs, used to store additional information about the object in a structured format.
    custom_data                 jsonb,
    -- The date the product was created
    created_at                  timestamp,
    -- The date the product was updated
    updated_at                  timestamp
);
alter table paddle_prices enable row level security;
create policy "Allow public read-only access." on paddle_prices for select using (true);

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