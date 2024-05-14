import { NextResponse } from 'next/server';
import { Paddle } from '@paddle/paddle-node-sdk';
import type { EventEntity } from '@paddle/paddle-node-sdk/dist/types/notifications/helpers/types';
import { upsertPriceRecord, upsertProductRecord } from '@/lib/utils/supabase/admin/paddle';

const paddle = new Paddle(process.env.PADDLE_API_KEY as string);

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
]);

export async function POST(req: Request) {
  const sig = req.headers.get('paddle-signature') as string;
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET!;
  const body = await req.text();

  let eventData: EventEntity;

  try {
    if (!sig || !webhookSecret) return new NextResponse('Webhook secret not found.', { status: 400 });
    eventData = paddle.webhooks.unmarshal(body, webhookSecret, sig)!;
    console.log(`🔔  Webhook received: ${eventData?.eventType}`);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(eventData?.eventType)) {
    try {
      switch(eventData.eventType) {
        case 'product.created':
        case 'product.updated':
          await upsertProductRecord(eventData);
          break;
        case 'price.created':
        case 'price.updated':
          await upsertPriceRecord(eventData);
          break;
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
    return new NextResponse(`Unsupported event type: ${eventData?.eventType}`, {
      status: 400
    });
  }

  return new NextResponse(JSON.stringify({ received: true }));
}