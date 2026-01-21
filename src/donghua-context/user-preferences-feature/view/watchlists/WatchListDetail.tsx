"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useWatchLists } from '../../hooks';
import { AnimeCard } from '@/donghua-context/animelist-feature';

interface Props {
  collectionId: string,
  listId: string,
  className?: string
}

export const WatchListDetail: React.FC<Props> = ({ collectionId, listId, className }) => {
  const watchLists = useWatchLists();
  const [title, setTitle] = useState('');
  const loadedCollectionRef = useRef<string | null>(null);

  const { loadCollection, loadListItems } = watchLists;
  const loadedListRef = useRef<string | null>(null);

  useEffect(() => {
    if (!collectionId) return;
    if (loadedCollectionRef.current === collectionId) return;
    loadedCollectionRef.current = collectionId;
    loadCollection(collectionId);
  }, [collectionId, loadCollection]);

  useEffect(() => {
    if (!listId) return;
    if (loadedListRef.current === listId) return;
    loadedListRef.current = listId;
    loadListItems(listId);
  }, [listId, loadListItems]);

  useEffect(() => {
    const list = watchLists.lists?.find(l => l.uid === listId);
    if (list) setTitle(list.title);
  }, [listId, watchLists.lists]);

  const handleRename = async () => {
    if (!title.trim()) return;
    await watchLists.renameList(listId, title.trim());
  }

  return (
    <div className={className}>
      <div className='p-4 flex flex-wrap items-center gap-2'>
        <input
          className='rounded-md p-2 border border-tertiary bg-secondary-variant text-sm'
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button className='rounded-md border px-3 py-1 text-xs' onClick={handleRename}>rename</button>
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4'>
        {(watchLists.items || []).map(item => (
          item.anime ? (
            <AnimeCard
              key={item.uid}
              anime={item.anime}
              watchListId={listId}
              isInWatchListOverride={true}
              className="pt-4 pb-4 xs:w-screen sm:w-screen md:w-1/2 lg:w-1/3 xl:w-1/4 min-w-80 h-auto"
            />
          ) : null
        ))}
      </div>
    </div>
  );
};
