import { NextResponse } from "next/server";
import { createClient } from '@/lib/utils/supabase/server';

export async function GET(req: Request){
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  console.log(user);

  return NextResponse.json({
    message: "Hello World!",
    data: user.data,
  }, {
    status: 200,
  })
}