import crypto from 'crypto';
import { NextResponse } from 'next/server';

const relevantEvents = new Set([
  'subscription_created',
  'subscription_updated',
  'subscription_payment_success',
  'order_created',
]);

export async function POST(req: Request) {
  const rawBody = await req.text();
  const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac('sha256', webhookSecret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const signature = Buffer.from(
    req.headers.get('X-Signature') ?? '',
    'utf8'
  );

  let eventName;
  let eventData;
  // let objId;

  try {
    if (!signature || !webhookSecret) return new NextResponse('Webhook secret not found.', { status: 400 });

    if (!crypto.timingSafeEqual(digest, signature)) {
      return new Response('Invalid signature', { status: 400 });
    }

    const data = JSON.parse(rawBody);

    eventName = data['meta']['event_name'];
    eventData = data['data']['attributes'];
    // objId = data['data']['id'];

    console.log(eventData);

    console.log(`🔔  Webhook received: ${eventName}`);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(eventName)) {
    try {
      switch(eventName) {
        case 'subscription_created':
          console.log('subscription_created event fired');
          break;
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.log(error);
      return new NextResponse(
        'Webhook handler failed. View your Next.js function logs.',
        {
          status: 400
        }
      );
    }
  } else {
    return new NextResponse(`Unsupported event type: ${eventName}`, {
      status: 400
    });
  }

  return new NextResponse(JSON.stringify({ received: true }));
}