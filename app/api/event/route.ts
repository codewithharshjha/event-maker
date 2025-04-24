import { NextRequest, NextResponse } from "next/server";
;import Event from "../../../models/Event";
import User from "../../../models/User";

import connectDb from "../../../config/db"
import { getUserIdFromRequest } from "../../../middleware/auths";
import { FilterQuery } from "mongoose";
import { IEvent } from "../../../types/type";

export async function GET(req: NextRequest) {
  await connectDb()
try {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const query: FilterQuery<IEvent> = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  const events = await Event.find(query)
    .sort({ date: 1 })
    .populate("organizer", ["name", "email"]);

  return NextResponse.json(events);
} catch (error) {
  return NextResponse.json({msg:`Error from get all events ${error}`})
}
  
}

export async function POST(req: NextRequest) {
    await connectDb();
    const userId = getUserIdFromRequest(req);
   
    if (!userId) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }
   
  
  
    const user = await User.findById(userId);
    if (!user || (user.role !== "organizer" && user.role !== "admin")) {
      return NextResponse.json({ msg: "Not authorized" }, { status: 403 });
    }
  
    const body = await req.json();
    
    const {
      title, description, date, time, location,
      price, capacity, category, imageUrl
    } = body;
  
    if (!title || !description || !date || !time || !location || !price || !capacity || !category) {
      return NextResponse.json({ msg: "Missing fields" }, { status: 400 });
    }
  
    const newEvent = new Event({
      title,
      description,
      imageUrl,
      date,
      time,
      location,
      organizer: userId,
      ticketPrice: price,
      totalSeats: capacity,
      availableSeats: capacity,
      category
    });
  
    const event = await newEvent.save();
    return NextResponse.json(event, { status: 201 });
  }
  
