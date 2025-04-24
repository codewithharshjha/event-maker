'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventList from '../components/events/EventList';
import EventFilter from '../components/events/EventFilter';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Event } from '@/types/type';

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const category = searchParams?.get('category') || '';
  const search = searchParams?.get('search') || '';

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        let url = '/api/event';
        const params = new URLSearchParams();

        if (category) params.set('category', category);
        if (search) params.set('search', search);
        if (params.toString()) url += `?${params.toString()}`;

       const res = await axios.get<Event[]>(url);
     
        setEvents(res.data);
        setError(null);
        console.log("from home",events)
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [category, search]);

  return (
    <div className="main-container">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
          <span className="block text-primary-600">Discover Amazing Events</span>
          <span className="block">Book Your Experience</span>
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Find and book tickets for concerts, conferences, workshops, and more events around you.
        </p>
      </div>

      <EventFilter initialCategory={category} initialSearch={search} />

      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <EventList events={events} loading={loading} />

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Are you an event organizer?</h2>
        <Link href="/createevent" className="btn-primary text-base px-6 py-3">
          Create Your Event
        </Link>
      </div>
    </div>
  );
};

export default Home;
