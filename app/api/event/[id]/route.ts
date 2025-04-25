import { NextRequest, NextResponse } from "next/server";
import Event from "../../../../models/Event";
import User from "../../../../models/User";
import connecttodb from "../../../../config/db";
import { getUserIdFromRequest } from "../../../../middleware/auths";


export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await connecttodb();
  const id= params.id
  const event = await Event.findById(id).populate("organizer", ["name", "email"]);
  if (!event) return NextResponse.json({ msg: "Event not found" }, { status: 404 });
console.log('from event data',event)
  return NextResponse.json(event);
}

export async function PUT(req: NextRequest, {params}: {params: Promise<{ id: string }>}) {
  await connecttodb();
  const userId = getUserIdFromRequest(req);
  const {id}=await params
  console.log("from event",id)
  if (!userId) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

  const event = await Event.findById(id);
  if (!event) return NextResponse.json({ msg: "Event not found" }, { status: 404 });

  const user = await User.findById(userId);
  if (event.organizer.toString() !== userId && user.role !== "admin") {
    return NextResponse.json({ msg: "Not authorized" }, { status: 403 });
  }

  const data = await req.json();
  Object.assign(event, data);
  const updatedEvent = await event.save();

  return NextResponse.json(updatedEvent);
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  await connecttodb();
  const userId = getUserIdFromRequest(req)
 ;
  if (!userId) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  const id= context.params.id
  const event = await Event.findById(id);
  if (!event) return NextResponse.json({ msg: "Event not found" }, { status: 404 });

  const user = await User.findById(userId);
  if (event.organizer.toString() !== userId && user.role !== "admin") {
    return NextResponse.json({ msg: "Not authorized" }, { status: 403 });
  }

  await event.deleteOne();
  return NextResponse.json({ msg: "Event deleted" });
}