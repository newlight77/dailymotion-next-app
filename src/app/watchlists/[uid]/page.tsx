"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { WatchListDetail } from '@/donghua-context/user-preferences-feature';

const WatchListPage: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const [collectionId, setCollectionId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('watchlists-collection-id');
    if (stored) setCollectionId(stored);
  }, []);

  if (!collectionId) {
    return (
      <div className='w-full'>
        <div className='p-4 text-sm'>loading watch list...</div>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <h2 className='title text-3xl p-1 md:p-4 capitalize'>watch list</h2>
      <WatchListDetail collectionId={collectionId} listId={uid} />
    </div>
  );
};

export default WatchListPage;
