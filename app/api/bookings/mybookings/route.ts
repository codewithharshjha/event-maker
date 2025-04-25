import { NextRequest, NextResponse } from "next/server";

import Booking from "../../../../models/Booking";
import { getUserIdFromRequest } from "../../../../middleware/auths";

export async function GET(req:NextRequest){
    try {
        const userId = getUserIdFromRequest(req)
      
        if(!userId){
            return NextResponse.json({status:401,msg:"Login first"});
        }
        const bookings = await Booking.find({ user: userId })
          .sort({ bookingDate: -1 })
          .populate('event', ['title', 'date', 'time', 'location'])
          .populate('user', ['name', 'email']);
        
       return  NextResponse.json(bookings);
      } catch (err) {
        console.error(err);
      return  NextResponse.json({status:500,msg:'Server error'});
      }
}
