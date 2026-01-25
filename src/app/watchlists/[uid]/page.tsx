"use client"
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { WatchListDetail } from '@/donghua-context/user-preferences-feature';

const WatchListPage: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const resolveList = async () => {
      setLoading(true);
      setError(null);

      try {
        if (loadedRef.current) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/watchlists/${uid}`, { method: 'GET', credentials: 'include' });
        if (!response.ok) {
          if (response.status === 401) {
            setError('You must sign in to view this watch list.');
            setLoading(false);
            return;
          }
          if (response.status === 404) {
            setError('Watch list not found or not accessible.');
            setLoading(false);
            return;
          }
          setError(`Failed to fetch watch list: ${response.status} ${response.statusText}`);
          setLoading(false);
          return;
        }
        loadedRef.current = true;
        if (mounted) setError(null);
      } catch (err) {
        console.error('Error resolving watch list', err);
        setError('Unexpected error fetching watch list');
      } finally {
        setLoading(false);
      }
    };

    resolveList();
    return () => {
      mounted = false;
    };
  }, [uid]);

  if (loading && !error) {
    return (
      <div className='w-full'>
        <div className='p-4 text-sm'>loading watch list...</div>
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
      <h2 className='title text-3xl p-1 md:p-4 capitalize'>watch list</h2>
      <WatchListDetail listId={uid} />
    </div>
  );
};

export default WatchListPage;
