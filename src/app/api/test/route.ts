import { NextResponse } from "next/server";

export function GET(req: Request){
  console.log(req.headers.get('Authorization'));

  return NextResponse.json({
    message: "Hello World!",
  }, {
    status: 200,
  })
}