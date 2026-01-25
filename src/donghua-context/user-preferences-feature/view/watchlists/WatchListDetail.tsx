"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useWatchLists } from '../../hooks';
import { AnimeCard } from '@/donghua-context/animelist-feature';

interface Props {
  listId: string,
  className?: string
}

export const WatchListDetail: React.FC<Props> = ({ listId, className }) => {
  const { data: session } = useSession();
  const sessionUserId = session?.user && (session.user as { id?: string }).id;

  const watchLists = useWatchLists();
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const loadedListsRef = useRef<boolean>(false);

  const { loadLists, loadListItems } = watchLists;
  const loadedListRef = useRef<string | null>(null);

  useEffect(() => {
    if (loadedListsRef.current) return;
    loadedListsRef.current = true;
    loadLists();
  }, [loadLists]);

  useEffect(() => {
    if (!listId) return;
    if (loadedListRef.current === listId) return;
    loadedListRef.current = listId;
    loadListItems(listId).then(list => {
      if (list) {
        setTitle(list.title);
        setIsPublic(!!list.isPublic);
      }
    });
  }, [listId, loadListItems]);

  useEffect(() => {
    const list = watchLists.lists?.find(l => l.uid === listId);
    if (list) {
      setTitle(list.title);
      setIsPublic(!!list.isPublic);
    }
  }, [listId, watchLists.lists]);

  const handleRename = async () => {
    if (!title.trim()) return;
    await watchLists.renameList(listId, title.trim());
  }

  const handleCopyLink = async () => {
    if (!isPublic) return;
    try {
      const url = `${window.location.origin}/watchlists/public/${listId}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy share URL', err);
    }
  }

  // determine ownership by looking up the current list and comparing to session user id
  const currentList = watchLists.lists?.find(l => l.uid === listId);
  const isOwner = !!currentList && !!sessionUserId && currentList.ownerId === sessionUserId;
  const listItems = (watchLists.items || []).filter(item => item.listId === listId);

  return (
    <div className={className}>
      <div className='p-4 flex flex-wrap items-center gap-2'>
        {isOwner ? (
          <>
            <input
              className='rounded-md p-2 border border-tertiary bg-secondary-variant text-sm'
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <button className='rounded-md border px-3 py-1 text-xs' onClick={handleRename}>rename</button>
            <div className='flex items-center gap-2'>
              <button
                className={`rounded-md border px-3 py-1 text-xs ${isPublic ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                onClick={async () => {
                  const next = !isPublic;
                  setIsPublic(next);
                  setIsToggling(true);
                  try {
                    await watchLists.setListVisibility(listId, next);
                  } catch (err) {
                    console.error('Failed to update visibility', err);
                    setIsPublic(!next);
                  } finally {
                    setIsToggling(false);
                  }
                }}
                disabled={isToggling}
              >
                {isToggling ? '...' : (isPublic ? 'Public' : 'Private')}
              </button>
              <span className='text-xs text-gray-400'>{isPublic ? 'public' : 'private'}</span>
            </div>
            <button
              className='rounded-md border px-3 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={handleCopyLink}
              disabled={!isPublic}
              title={isPublic ? 'Copy share link' : 'Make this list public to share'}
            >
              {copied ? 'copied' : 'copy public link'}
            </button>
          </>
        ) : (
          <div className='w-full'>
            <div className='font-semibold'>{title}</div>
            <span className='text-xs text-gray-400'>{isPublic ? 'public' : 'private'}</span>
          </div>
        )}
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4'>
        {listItems.map(item => (
          item.anime ? (
            <AnimeCard
              key={item.uid}
              anime={item.anime}
              watchListId={listId}
              isInWatchListOverride={true}
              className="pt-4 pb-4 xs:w-screen sm:w-screen md:w-1/2 lg:w-1/3 xl:w-1/4 min-w-80 h-auto"
              canModify={isOwner}
            />
          ) : null
        ))}
      </div>
    </div>
  );
};
