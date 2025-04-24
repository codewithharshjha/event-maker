import Booking from "@/models/Booking";
import Event from "@/models/Event";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req:NextRequest){
    try {
        const userId = req.headers.get("x-auth-token");
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const booking = await Booking.findById(id);
        
        if (!booking) {
          return NextResponse.json({status:404, msg: 'Booking not found' });
        }
        
        // Check if user owns this booking or is admin
        const user = await User.findById(userId);
        
        if (booking.user.toString() !== userId && user.role !== 'admin') {
          return NextResponse.json({ status:403,msg: 'Not authorized to cancel this booking' });
        }
        
        // Check if already cancelled
        if (booking.status === 'cancelled') {
          return NextResponse.json({ msg: 'Booking is already cancelled' });
        }
        
        // Update booking status
        booking.status = 'cancelled';
        await booking.save();
        
        // Update available seats in event
        const event = await Event.findById(booking.event);
        event.availableSeats += booking.seats.length;
        await event.save();
        
        NextResponse.json(booking);
      } catch (err) {
        console.error(err);
       
        NextResponse.json({status:500,msg:'Server error'});
      }
}