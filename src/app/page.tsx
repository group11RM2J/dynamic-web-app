'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  address: z.string().min(5, 'Address is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function RegistrationForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Validated Data:', data);

    // ✅ Redirect to users list after successful validation
    router.push('/users');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4 text-center text-indigo-600">User Registration</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>First Name</Label>
              <Input {...register('firstName')} placeholder="John" />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
            </div>

            <div>
              <Label>Last Name</Label>
              <Input {...register('lastName')} placeholder="Doe" />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" {...register('email')} placeholder="john@example.com" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <Label>Phone</Label>
              <Input type="tel" {...register('phone')} placeholder="09123456789" />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            <div>
              <Label>Address</Label>
              <Input {...register('address')} placeholder="123 Street, City" />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>

            <Button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
