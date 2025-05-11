'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";

// Dynamically import the Mapbox component without SSR
const Map = dynamic(() => import('@/components/Mapbox'), { ssr: false });

// Define the Zod schema for form validation
const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string()
  .min(10, "Phone must be at least 10 characters")
  .regex(/^[0-9a-zA-Z+\-() ]+$/, "Only letters, numbers, and common symbols (+, -, (, )) allowed"),
  address: z.string().min(1, "Address is required"),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    // Process registration data here (e.g., send to API)
    console.log("Registration Data:", data);

    // Redirect to login page after successful registration
    router.push('/login');
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow bg-white">
      <h1 className="text-2xl font-bold mb-6 text-blue-800 text-center">User Registration</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("firstName")}
          placeholder="First Name"
          className="w-full border p-2 rounded"
        />
        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}

        <input
          {...register("lastName")}
          placeholder="Last Name"
          className="w-full border p-2 rounded"
        />
        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}

        <input
          {...register("email")}
          placeholder="Email"
          type="email"
          className="w-full border p-2 rounded"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input
          {...register("phone")}
          placeholder="Phone Number"
          className="w-full border p-2 rounded"
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

        <input
          {...register("address")}
          placeholder="Search Address (select from map)"
          className="w-full border p-2 rounded"
          value={selectedAddress}
          onChange={(e) => {
            setSelectedAddress(e.target.value);
            setValue("address", e.target.value);
          }}
        />
        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}

        {/* Mapbox address picker */}
        <Map setAddress={(address: string) => {
          setSelectedAddress(address);
          setValue("address", address);
        }} />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
