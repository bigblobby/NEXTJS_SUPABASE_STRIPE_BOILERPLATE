## Running locally

1. `pnpm install` to install node packages.
2. Make sure you have Supabase installed globally via npm then run `supabase:start`, this will spin up a local supabase DB and and Inbucket instance.
   1. Use `API URL` to set `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`.
   2. Use `anon key` to set `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
   3. Use `service_role key` to set `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
3. Run `pnpm dev`
4. In another terminal run `ngrok http 3000` this will return a url that end in 'ngrok-free.app' this is the endpoint url you'll use for webhooks in stripe. As well as other services that use webhooks such as Resend.
    1. You'll then need to copy the generated url and paste it in `stripe:listen` in `package.json` it should look like this `stripe listen --forward-to=https://415e-2a00-23c6-8d03-7d01-946f-eb9c-ca37-e55f.ngrok-free.app/api/stripe/webhooks` don't forget to add `/api/stripe/webhooks` to the end.
   2. In a new terminal window run `pnpm stripe:listen`
5. 