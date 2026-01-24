"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useWatchLists, WatchLists } from '@/donghua-context/user-preferences-feature';

const WatchListsIndexPage: React.FC = () => {
  const watchLists = useWatchLists();
  const { loadCollection } = watchLists;
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const loadedRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const resolveCollection = async () => {
      const response = await fetch('/api/watchlists', { method: 'GET' });
      if (!response.ok) return;
      const collection = await response.json();
      if (!collection?.uid) return;
      if (loadedRef.current === collection.uid) return;
      loadedRef.current = collection.uid;
      await loadCollection(collection.uid);
      if (mounted) setCollectionId(collection.uid);
    };

    resolveCollection();
    return () => {
      mounted = false;
    };
  }, [loadCollection]);

  if (!collectionId) {
    return (
      <div className='w-full'>
        <div className='p-4 text-sm'>loading watch lists...</div>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <h2 className='title text-3xl p-1 md:p-4 capitalize'>watch lists</h2>
      <WatchLists collectionId={collectionId} />
    </div>
  );
};

export default WatchListsIndexPage;
