"use client"

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useForm, useController, Control, RegisterOptions } from 'react-hook-form';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type FormData = {
  name: string;
  age: number;
  gender: string;
  email: string;
  interests: string;
  lookingFor: string;
  idealDate?: string;
  dealBreakers?: string;
};

type FormFieldProps = {
  name: keyof FormData;
  control: Control<FormData>;
  label: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  rules?: RegisterOptions<FormData, keyof FormData>;
};

const FormField = ({ name, control, rules = {}, ...props }: FormFieldProps) => {
  const {
    field,
    fieldState: { error }
  } = useController({
    name,
    control,
    rules
  });

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {props.label}
      </label>
      {props.type === 'textarea' ? (
        <textarea
          id={name}
          {...field}
          {...props}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 h-24"
        />
      ) : props.type === 'select' ? (
        <select
          id={name}
          {...field}
          {...props}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          {props.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          {...field}
          {...props}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      )}
      {error && <span className="text-red-500 text-xs">{error.message}</span>}
    </div>
  );
};

const ValentineForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: "",
      age: 0,
      gender: "",
      email: "",
      interests: "",
      lookingFor: "",
      idealDate: "",
      dealBreakers: ""
    }
  });

  const onSubmit = async (data: FormData) => {
    console.log('Form data submitted: ', data);
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: supabaseError } = await supabase
        .from('valentine_profiles')
        .insert([data]);

      if (supabaseError) throw supabaseError;
      
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit form. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <Heart className="w-16 h-16 mx-auto text-pink-500 mb-4" />
            <h2 className="text-2xl font-bold text-pink-600 mb-4">Thank You!</h2>
            <p className="text-gray-600">
              Your love quest has begun! We'll carefully review your profile and get back to you with potential matches on Valentine's Day.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-pink-600 flex items-center justify-center">
              <Heart className="w-6 h-6 mr-2" />
              Find Your Valentine
            </h1>
            <p className="text-gray-600 mt-2">
              Fill out this form to find your perfect match this Valentine's Day
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="name"
              control={control}
              label="Name"
              type="text"
              placeholder="Your name"
              rules={{ required: 'Name is required' }}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="age"
                control={control}
                label="Age"
                type="number"
                placeholder="Your age"
                rules={{
                  required: 'Age is required',
                  min: { value: 18, message: 'Minimum age is 18' },
                  max: { value: 120, message: 'Maximum age is 120' },
                  valueAsNumber: true,
                }}
              />

              <FormField
                name="gender"
                control={control}
                label="Gender"
                type="select"
                placeholder="Select gender"
                options={[
                  { value: '', label: 'Select gender' },
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'non-binary', label: 'Non-binary' },
                  { value: 'other', label: 'Other' },
                ]}
                rules={{ required: 'Gender is required' }}
              />
            </div>

            <FormField
              name="email"
              control={control}
              label="Email"
              type="email"
              placeholder="your.email@example.com"
              rules={{
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
              }}
            />

            <FormField
              name="interests"
              control={control}
              label="Your Interests"
              type="textarea"
              placeholder="Tell us about your hobbies and interests..."
              rules={{ required: 'This field is required' }}
            />

            <FormField
              name="lookingFor"
              control={control}
              label="What You're Looking For"
              type="textarea"
              placeholder="Describe your ideal match..."
              rules={{ required: 'This field is required' }}
            />

            <FormField
              name="idealDate"
              control={control}
              label="Ideal First Date"
              type="textarea"
              placeholder="Describe your perfect first date..."
            />

            <FormField
              name="dealBreakers"
              control={control}
              label="Deal Breakers"
              type="textarea"
              placeholder="Any absolute deal breakers?"
            />

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                'Submitting...'
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" /> Submit
                </>
              )}
            </button>
          </form>
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ValentineForm;
