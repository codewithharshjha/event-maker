import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import connectDB from "../../../config/db"; // adjust path to your db connection utility

export async function POST(req: NextRequest) {
  await connectDB(); // ensure database is connected

  const { name, email, password, role } = await req.json();

  try {
    let user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role: role || "user",
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

    // Create JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, "hjha3987", { expiresIn: "5d" });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
