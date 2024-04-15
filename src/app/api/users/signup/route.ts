import connectDb from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModels";
import bcrypt from "bcryptjs";
import sendMail from "@/utils/sendMail";

connectDb();

export async function POST(request: NextRequest) {
  try {
    const reqBody = request.json();
    const { username, email, password } = reqBody;

    let user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      username,
      email,
      hashedPassword,
    });

    await sendMail({ email, emailType: "VERIFY", userId: user._id });

    return NextResponse.json(
      {
        success: true,
        message: "User Registered Successfully",
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
