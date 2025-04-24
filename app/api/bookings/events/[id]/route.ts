import { getUserIdFromRequest } from "@/middleware/auths";
import Booking from "@/models/Booking";
import Event from "@/models/Event";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        const userId =getUserIdFromRequest(req);
        const { searchParams } = new URL(req.url);
        const id = await searchParams.get("id");
        console.log('ffrom event data',id)
        const event = await Event.findById(id);
        
        if (!event) {
          return NextResponse.json({ status:404,msg: 'Event not found' });
        }
        
        // Check if user is organizer or admin
        const user = await User.findById(userId);
        
        if (event.organizer.toString() !== userId && user.role !== 'admin') {
          return NextResponse.json({status:403, msg: 'Not authorized to view these bookings' });
        }
        
        const bookings = await Booking.find({ event: id })
          .sort({ bookingDate: -1 })
          .populate('user', ['name', 'email']);
        
        NextResponse.json(bookings);
      } catch (err) {
        console.error(err);
       
        NextResponse.json({status:500,msg:'Server error'});
      }
}

