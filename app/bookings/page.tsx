'use client'
import React, { useEffect, useState } from 'react';

import axios from 'axios';
import Link from 'next/link';
import { BookingType } from '@/types/type';

const MyBookings = () => {
  const [bookings, setBookings] =  useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/bookings/mybookings');
       
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div className="container mx-auhref px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auhref px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map(booking => (
            <div key={booking._id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">{booking.event.title}</h2>
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  <span className="font-semibold">Date:</span>{new Date(booking.event.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Time:</span> {booking.event.time}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Location:</span> {booking.event.location}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Tickets:</span> {booking.event.availableSeats}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">hreftal Price:</span> ${booking.event.ticketPrice}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Status:</span> {booking.status}
                </p>
              </div>
              <div className="flex space-x-4">
                <Link
                  href={`/bookings/${booking._id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View Details
                </Link>
                {booking.status === 'pending' && (
                  <button
                    onClick={async () => {
                      try {
                        await axios.delete(`/api/bookings/${booking._id}`);
                        setBookings(bookings.filter(b => b._id !== booking._id));
                      } catch (error) {
                        console.error('Error canceling booking:', error);
                      }
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg mb-4">You have not made any bookings yet.</p>
          <Link
            href="/"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Browse Events
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookings; 