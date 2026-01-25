"use client"
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import RemovableItem from '@/components/molecules/RemovableItem';
import { useWatchLists } from '../../hooks';

interface Props {
  className?: string
}

export const WatchLists: React.FC<Props> = ({ className }) => {
  const watchLists = useWatchLists();
  const [title, setTitle] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const loadedRef = useRef<boolean>(false);

  const { loadLists } = watchLists;

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    loadLists();
  }, [loadLists]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    await watchLists.createList(title.trim());
    setTitle('');
  }

  const handleDelete = async (listId: string) => {
    await watchLists.deleteList(listId);
  }

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleVisibility = async (listId: string, currentIsPublic: boolean) => {
    setTogglingId(listId);
    const next = !currentIsPublic;
    // optimistic UI is driven by the central store, so just call the API
    try {
      await watchLists.setListVisibility(listId, next);
    } catch (err) {
      console.error('Failed to set list visibility', err);
    } finally {
      setTogglingId(null);
    }
  }

  const handleShare = async (listId: string) => {
    try {
      const url = `${window.location.origin}/watchlists/public/${listId}`;
      await navigator.clipboard.writeText(url);
      setCopiedId(listId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy share URL', err);
    }
  }

  return (
    <div className={className}>
      <div className='text-md pl-4'>Manage your watch lists</div>
      <div className='followings-header p-4 flex flex-wrap items-center gap-2'>
        <input
          className='rounded-md p-2 border border-tertiary bg-secondary-variant text-sm'
          placeholder='new watch list title'
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button className='rounded-md border px-3 py-1 text-xs' onClick={handleCreate}>add</button>
      </div>

      <div className='flex flex-col gap-2 p-2'>
        {(watchLists.lists || []).map(list => (
          <RemovableItem key={list.uid} id={list.uid} onDelete={handleDelete}>
            <div className="col-span-11 flex flex-wrap items-center justify-between gap-2">
              <Link className="min-w-56" href={`/watchlists/${list.uid}`}>
                <div className="col-span-5 hover:text-tertiary font-semibold" >{list.title}</div>
                <div className="text-xs text-gray-400">visibility: {list.isPublic ? 'public' : 'private'}</div>
                <div className="text-xs text-gray-400">created: {new Date(list.createdAt).toLocaleDateString()}</div>
                <div className="text-xs text-gray-400">updated: {new Date(list.updatedAt).toLocaleDateString()}</div>
              </Link>
              <div className='flex items-center gap-2'>
                <button
                  className={`rounded-md border px-3 py-1 text-xs ${list.isPublic ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                  onClick={() => handleToggleVisibility(list.uid, !!list.isPublic)}
                  disabled={togglingId === list.uid}
                >
                  {togglingId === list.uid ? '...' : (list.isPublic ? 'Public' : 'Private')}
                </button>
                <button
                  className="rounded-md border px-3 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleShare(list.uid)}
                  disabled={!list.isPublic}
                  title={list.isPublic ? 'Copy share link' : 'Make this list public to share'}
                >
                  {copiedId === list.uid ? 'copied' : 'share'}
                </button>
              </div>
            </div>
          </RemovableItem>
        ))}
      </div>
    </div>
  );
};
