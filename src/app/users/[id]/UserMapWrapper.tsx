'use client';

import dynamic from 'next/dynamic';

const MapExample = dynamic(() => import('@/components/UserMap'), {
  ssr: false,
});

interface UserMapWrapperProps {
  user: {
    name?: string;
    address?: {
      geo?: {
        lat?: string;
        lng?: string;
      };
    };
  };
}

export default function UserMapWrapper({ user }: UserMapWrapperProps) {
  return <MapExample user={user} />;
}