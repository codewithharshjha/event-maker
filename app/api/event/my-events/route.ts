import { NextRequest, NextResponse } from "next/server";
;import Event from "@/models/Event";

import connectDb from "../../../../config/db"


export async function GET() {
  await connectDb()
try {
 
  

  const events = await Event.find()
    

  return NextResponse.json(events);
} catch (error) {
  return NextResponse.json({msg:`Error from get all events ${error}`})
}
  
}


  
