import { NextRequest, NextResponse } from "next/server";
import Event from "../../../models/Event"
import Booking from "../../../models/Booking";
import { getUserIdFromRequest } from "../../../middleware/auths";

export async function POST(req:NextRequest){
    try {
    const {eventId,seats,totalAmount}=await req.json()
    const event=await Event.findById(eventId)
    
    if (!event) {
       return NextResponse.json({status:404,mes:"Event error"})
      }
      
      // Check if enough seats are available
      if (seats.length > event.availableSeats) {
        return NextResponse.json({status:400, msg: 'Not enough seats available' });
      }
      const userId = getUserIdFromRequest(req)
      // Create new booking
      const newBooking = new Booking({
        user: userId,
        event: eventId,
        seats,
        totalAmount,
        status: 'confirmed' // Assuming payment is processed successfully
      });
      
      const booking = await newBooking.save();
      
      // Update available seats in event
      event.availableSeats -= seats.length;
      await event.save();
      
    return   NextResponse.json(booking);
    
   
    } catch (error) {
       return NextResponse.json({status:500,mes:`Server error ${error}`})
    }
}
