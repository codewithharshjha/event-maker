import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import User from "../../../models/User"
import jwt from "jsonwebtoken"
export async function POST(req:NextRequest){
    const {email,password}=await req.json()
    try {
        const user=await User.findOne({email})
        if (!user) {
            return NextResponse.json({status:400, msg: 'Invalid credentials' });
          }
      
          // Verify password
          const isMatch = await bcrypt.compare(password, user.password);
      
          if (!isMatch) {
            return NextResponse.json({status:400, msg: 'Wrong Password' });
          }
      
          // Return JWT
          const payload = {
            user: {
              id: user.id,
              role: user.role
            }
          };
      
          const token = jwt.sign(payload, process.env.JWT_SECRET!);

          return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
        console.error(error);
       return  NextResponse.json({status:500,msg:`Internal server error:${error}`})
      } 
    }
