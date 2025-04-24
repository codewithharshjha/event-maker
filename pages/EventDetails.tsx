'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import SeatSelector from '../components/events/SeatSelector';
import { useParams, useRouter } from 'next/navigation';
import { Event, Seat } from '@/types/type';

const EventDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isBooking, setIsBooking] = useState<boolean>(false);

  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (err: any) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to book tickets');
      router.push('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      toast.warning('Please select at least one seat');
      return;
    }

    try {
      setIsBooking(true);
      const totalAmount = selectedSeats.length * (event?.ticketPrice ?? 0);

      await axios.post('/api/bookings', {
        eventId: event?._id,
        seats: selectedSeats,
        totalAmount
      });

      toast.success('Booking successful!');
      router.push('/bookings');
    } catch (err: any) {
      console.error('Booking error:', err);
      toast.error(err?.response?.data?.msg || 'Failed to book tickets. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="main-container text-center py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="main-container">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <p className="font-bold">Error</p>
          <p>{error || 'Event not found'}</p>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    imageUrl,
    date,
    time,
    location,
    organizer,
    ticketPrice,
    totalSeats,
    availableSeats,
    category
  } = event;

  const formattedDate = format(new Date(date), 'MMMM dd, yyyy');
  const isPastEvent = new Date(date) < new Date();
  const isSoldOut = availableSeats === 0;
  const isOrganizer = user && (organizer._id === user._id || user.role === 'admin');

  return (
    <div className="main-container">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Event Image */}
          <div className="relative h-64 md:h-80">
            {imageUrl ? (
              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">{title.substring(0, 1)}</span>
              </div>
            )}
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-primary-600">
              {category}
            </div>
          </div>

          {/* Event Details */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-500 mb-4">Organized by {organizer.name}</p>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6">
                <span className="text-2xl font-bold text-primary-600">${ticketPrice}</span>
                <span className="text-gray-500 ml-1">per ticket</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Date */}
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-500">Date</span>
                <span className="font-medium">{formattedDate}</span>
              </div>
              {/* Time */}
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-500">Time</span>
                <span className="font-medium">{time}</span>
              </div>
              {/* Location */}
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-500">Location</span>
                <span className="font-medium">{location}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{description}</p>
            </div>

            {/* Seat Booking */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Tickets</h2>
                <div className="text-sm text-gray-500">
                  {availableSeats} out of {totalSeats} available
                </div>
              </div>

              {!isPastEvent && !isSoldOut && !isOrganizer && (
                <SeatSelector
                  totalSeats={totalSeats}
                  availableSeats={availableSeats}
                  selectedSeats={selectedSeats}
                  onSeatSelect={setSelectedSeats}
                />
              )}

              {isPastEvent && (
                <div className="p-4 bg-gray-100 rounded-md text-gray-700">
                  This event has already taken place.
                </div>
              )}

              {isSoldOut && !isPastEvent && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-md text-red-700">
                  This event is sold out.
                </div>
              )}

              {isOrganizer && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-md text-blue-700">
                  You are the organizer of this event. You cannot book tickets for your own event.
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {!isPastEvent && !isSoldOut && !isOrganizer && (
                  <button
                    onClick={handleBooking}
                    disabled={selectedSeats.length === 0 || isBooking}
                    className={`btn-primary flex-1 py-3 flex items-center justify-center ${
                      selectedSeats.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isBooking
                      ? 'Processing...'
                      : `Book ${selectedSeats.length} Ticket${selectedSeats.length !== 1 ? 's' : ''}`}
                  </button>
                )}

                {isOrganizer && (
                  <button
                    onClick={() => router.push(`/events/edit/${id}`)}
                    className="btn-outline flex-1 py-3"
                  >
                    Edit Event
                  </button>
                )}

                <button
                  onClick={() => router.back()}
                  className="btn-outline flex-1 py-3"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
