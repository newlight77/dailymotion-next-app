"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useWatchLists, WatchLists } from '@/donghua-context/user-preferences-feature';

const WatchListsIndexPage: React.FC = () => {
  const watchLists = useWatchLists();
  const { loadCollection, createCollection } = watchLists;
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const loadedRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('watchlists-collection-id');
    if (stored) {
      if (loadedRef.current === stored) return;
      loadedRef.current = stored;
      loadCollection(stored).finally(() => setCollectionId(stored));
      return;
    }

    createCollection().then((collection) => {
      if (collection?.uid) {
        loadedRef.current = collection.uid;
        setCollectionId(collection.uid);
      }
    });
  }, [loadCollection, createCollection]);

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
