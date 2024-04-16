import connectDb from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";

connectDb();

export async function GET(request: NextRequest) {
  try {
    let response = NextResponse.json(
      {
        success: true,
        message: "User Logged Out Successfully",
      },
      {
        status: 200,
      }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 400,
      }
    );
  }
}
