import { NextRequest, NextResponse } from "next/server";
import Event from "../../../../../models/Event"

export async function GET(req:NextRequest){
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
       
        const events=await Event.find({category:category}).sort({date:1})
        .populate('organizer', ['name', 'email']);
        NextResponse.json(events)
    } catch (error) {
       console.error(error) 
       NextResponse.json({status:500,msg:error})
    }
}