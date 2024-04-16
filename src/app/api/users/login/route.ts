import connectDb from "@/db/dbConnect";
import User from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectDb();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { email, password } = reqBody;

    let user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid Email or Password",
        },
        {
          status: 400,
        }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        {
          error: "Invalid Email or Password",
        },
        {
          status: 400,
        }
      );
    }

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    let response = NextResponse.json(
      {
        success: true,
        message: "User Logged In Successfully",
        user,
      },
      {
        status: 200,
      }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
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
