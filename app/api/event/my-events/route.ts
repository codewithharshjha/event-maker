import { NextRequest, NextResponse } from "next/server";
;import Event from "@/models/Event";
import User from "@/models/User";

import connectDb from "../../../../config/db"
import { getUserIdFromRequest } from "@/middleware/auths";

export async function GET(req: NextRequest) {
  await connectDb()
try {
 
  

  const events = await Event.find()
    

  return NextResponse.json(events);
} catch (error) {
  return NextResponse.json({msg:`Error from get all events ${error}`})
}
  
}


  
