import connectDb from "@/db/dbConnect";
import User from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";

connectDb();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { verifyToken } = reqBody;

    let user = await User.findOne({
      verifyToken,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid Token or Token has been expired",
        },
        {
          status: 400,
        }
      );
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "User Verified Successfully",
        user,
      },
      {
        status: 200,
      }
    );
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
