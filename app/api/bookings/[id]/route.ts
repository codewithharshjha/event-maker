import { getUserIdFromRequest } from "../../../../middleware/auths";
import Booking from "../../../../models/Booking"
import User from "../../../../models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}: {params: Promise<{ id: string }>}){
    try {
        const userId = getUserIdFromRequest(req);
        const { id } = await params;
        const booking = await Booking.findById(id)
          .populate('event', ['title', 'date', 'time', 'location', 'imageUrl'])
          .populate('user', ['name', 'email']);
        
        if (!booking) {
          return NextResponse.json({status:404, msg: 'Booking not found' });
        }
        
        // Check if user owns this booking or is admin
        const user = await User.findById(userId);
        
        if (booking.user._id.toString() !== userId && user.role !== 'admin') {
        
          return NextResponse.json({status:403, msg: 'Not authorized to view this booking' });
        }
        
      return   NextResponse.json(booking);
      } catch (err) {
        console.error(err);
        
        return NextResponse.json({status:500,msg:'Server error'});
      }
}