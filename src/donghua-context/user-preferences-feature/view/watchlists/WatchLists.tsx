"use client"
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import RemovableItem from '@/components/molecules/RemovableItem';
import { useWatchLists } from '../../hooks';

interface Props {
  collectionId: string,
  className?: string
}

export const WatchLists: React.FC<Props> = ({ collectionId, className }) => {
  const watchLists = useWatchLists();
  const [title, setTitle] = useState('');
  const loadedCollectionRef = useRef<string | null>(null);

  const { loadCollection } = watchLists;

  useEffect(() => {
    if (!collectionId) return;
    if (loadedCollectionRef.current === collectionId) return;
    loadedCollectionRef.current = collectionId;
    loadCollection(collectionId);
  }, [collectionId, loadCollection]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    await watchLists.createList(title.trim());
    setTitle('');
  }

  const handleDelete = async (listId: string) => {
    await watchLists.deleteList(listId);
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
            <Link className="col-span-11" href={`/watchlists/${list.uid}`}>
              <div className="col-span-5 hover:text-tertiary font-semibold" >{list.title}</div>
              <div className="text-xs text-gray-400">created: {new Date(list.createdAt).toLocaleDateString()}</div>
              <div className="text-xs text-gray-400">updated: {new Date(list.updatedAt).toLocaleDateString()}</div>
            </Link>
          </RemovableItem>
        ))}
      </div>
    </div>
  );
};
