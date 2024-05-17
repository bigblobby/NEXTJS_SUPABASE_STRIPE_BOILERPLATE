import { NextResponse } from 'next/server';
import { EventName } from '@paddle/paddle-node-sdk';
import type { EventEntity } from '@paddle/paddle-node-sdk/dist/types/notifications/helpers/types';
import { manageSubscriptionStatusChange, upsertPriceRecord, upsertProductRecord } from '@/lib/utils/supabase/admin/paddle';
import { paddle } from '@/lib/utils/paddle/config';

const relevantEvents = new Set([
  EventName.ProductCreated,
  EventName.ProductUpdated,
  EventName.PriceCreated,
  EventName.PriceUpdated,
  EventName.SubscriptionCreated,
  EventName.SubscriptionUpdated,
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
        case EventName.ProductCreated:
        case EventName.ProductUpdated:
          await upsertProductRecord(eventData);
          break;
        case EventName.PriceCreated:
        case EventName.PriceUpdated:
          await upsertPriceRecord(eventData);
          break;
        case EventName.SubscriptionCreated:
        case EventName.SubscriptionUpdated:
          await manageSubscriptionStatusChange(eventData);
        // TODO add transaction.completed event
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