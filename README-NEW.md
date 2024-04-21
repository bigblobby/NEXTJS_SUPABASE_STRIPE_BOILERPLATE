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



## Production

1. Deploy a new project on Vercel, select the project to deploy
2. Make sure to add the Supabase keys to the environment variables
3. Follow the Supabase production checklist https://supabase.com/docs/guides/platform/going-into-prod
4. In your Supabase project, navigate to [auth > URL configuration](https://app.supabase.com/project/_/auth/url-configuration) and set your main production URL (e.g. https://your-deployment-url.vercel.app) as the site url.
5. Next, in your Vercel deployment settings, add a new **Production** environment variable called `NEXT_PUBLIC_SITE_URL` and set it to the same URL. Make sure to deselect preview and development environments to make sure that preview branches and local development work correctly.
6. Navigate to the [SQL Editor](https://supabase.com/dashboard/project/_/sql/new), paste the contents of [the Supabase `schema.sql` file](./schema.sql), and click RUN to initialize the database.
