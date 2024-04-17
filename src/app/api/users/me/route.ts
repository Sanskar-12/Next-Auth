import connectDb from "@/db/dbConnect";
import User from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/getDataFromToken";

connectDb();

export async function GET(request: NextRequest) {
  try {
    const id = getDataFromToken(request);

    const user = await User.findById(id).select("-password");

    return NextResponse.json(
      {
        success: true,
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
