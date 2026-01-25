"use client"
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useWatchLists, WatchLists } from '@/donghua-context/user-preferences-feature';

const WatchListsIndexPage: React.FC = () => {
  const watchLists = useWatchLists();
  const { loadLists } = watchLists;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const resolveLists = async () => {
      setLoading(true);
      setError(null);

      try {
        if (loadedRef.current) {
          setLoading(false);
          return;
        }

        const lists = await loadLists();
        if (!lists) {
          setError('You must sign in to view your watch lists.');
          setLoading(false);
          return;
        }

        loadedRef.current = true;
        if (mounted) setError(null);
      } catch (err) {
        console.error('Error resolving watch lists', err);
        setError('Unexpected error fetching watch lists');
      } finally {
        setLoading(false);
      }
    };

    resolveLists();
    return () => {
      mounted = false;
    };
  }, [loadLists]);

  if (loading && !error) {
    return (
      <div className='w-full'>
        <div className='p-4 text-sm'>loading watch lists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full p-4'>
        <div className='text-sm text-red-600 mb-4'>{error}</div>
        {error.includes('sign in') ? (
          <Link href="/signin" className='inline-block px-3 py-2 bg-blue-600 text-white rounded'>Sign in</Link>
        ) : (
          <button
            className='inline-block px-3 py-2 bg-gray-200 rounded'
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className='w-full'>
      <h2 className='title text-3xl p-1 md:p-4 capitalize'>watch lists</h2>
      <WatchLists />
    </div>
  );
};

export default WatchListsIndexPage;
