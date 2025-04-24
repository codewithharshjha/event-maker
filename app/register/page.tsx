'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'organizer';
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const { name, email, password, confirmPassword, role } = formData;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name) newErrors.name = 'Name is required';

    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const registerData = {
      name,
      email,
      password,
      role,
    };

    const success = await register(registerData);

    setIsLoading(false);

    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="main-container flex justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Create your account</h1>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="form-label">
                Full name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`input-field ${errors.name ? 'border-error-500' : ''}`}
                value={name}
                onChange={handleChange}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-sm text-error-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`input-field ${errors.email ? 'border-error-500' : ''}`}
                value={email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-error-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`input-field ${errors.password ? 'border-error-500' : ''}`}
                value={password}
                onChange={handleChange}
                placeholder="Create a password"
              />
              {errors.password && <p className="mt-1 text-sm text-error-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`input-field ${errors.confirmPassword ? 'border-error-500' : ''}`}
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Role */}
            <div className="mb-6">
              <label htmlFor="role" className="form-label">
                Account type
              </label>
              <select
                id="role"
                name="role"
                className="input-field"
                value={role}
                onChange={handleChange}
              >
                <option value="user">Event Attendee</option>
                <option value="organizer">Event Organizer</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Select "Event Organizer" if you want to create and manage events.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary w-full py-2"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-800 font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
