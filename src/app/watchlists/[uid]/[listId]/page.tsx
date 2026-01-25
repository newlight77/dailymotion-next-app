"use client"
import React from 'react';
import { useParams } from 'next/navigation';
import { WatchListDetail } from '@/donghua-context/user-preferences-feature';

const WatchListDetailPage: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();

  return (
    <div className='w-full'>
      <h2 className='title text-3xl p-1 md:p-4 capitalize'>watch list</h2>
      <WatchListDetail listId={listId} />
    </div>
  );
};

export default WatchListDetailPage;
