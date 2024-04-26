import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resendAudienceID = process.env.RESEND_NEWSLETTER_AUDIENCE_ID!;

export async function POST(req: Request) {
  const data = await req.formData()
  const email = data.get('email')?.toString();

  if (!email) {
    return NextResponse.json({
      error: 'Email required'
    }, {
      status: 400,
    });
  }

  const resend = new Resend(resendApiKey);

  try {
    await resend.contacts.create({
      email: email,
      unsubscribed: false,
      audienceId: resendAudienceID,
    });

    return NextResponse.json({
      message: 'Successfully subscribed!'
    }, {
      status: 200,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: 'Something went wrong'
    }, {
      status: 500,
    });
  }
}