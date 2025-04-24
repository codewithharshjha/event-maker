export interface Event {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  date: string; // ISO string (e.g., from MongoDB)
  time: string;
  location: string;
  organizer: {
    _id: string;
    name: string;
    email?: string;
    role?: string;
  };
  ticketPrice: number;
  totalSeats: number;
  availableSeats: number;
  category: string;
  createdAt: string;
  capacity:string;
   // also an ISO string
}

  export type Seat = {
    seatNumber: number;
  };
  export type User = {
    _id: string;
    name: string;
    email: string;
    role:string;
    hreftalBookings:number;
    eventsCreated:number;
    // Add more user fields as needed
  };
  export interface EventFormData {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    price: string;
    capacity: string;
    category: string;
    image: File | null;
  }
  export interface BookingType {
    _id: string;
    event: Event;
    seats: Seat[];
    totalAmount: number;
    createdAt: string;
    status: 'pending' | 'confirmed' | 'cancelled';
  }