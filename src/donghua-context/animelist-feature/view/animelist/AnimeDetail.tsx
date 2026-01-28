"use client"
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { FaMagnifyingGlass, FaPenToSquare } from 'react-icons/fa6';
import Modal from '@/components/molecules/Modal';
import { useIsMounted } from '@/core/core-lib/shared/useIsMounted';
import { AnimeType } from '../../domain';
import { useAnimelist } from '../../hooks';
import { AnimeEdit } from './AnimeEdit';
import Link from 'next/link';
import StarRating from '@/components/atoms/StarRating';
import { useAuth } from '@/core/capabilities/auth-feature';

type Props = {
    id: string
    mode?: string
    children?: React.ReactNode
}

export const AnimeDetail: React.FC<Props> = ({id, mode}) => {
    const useAnimes = useAnimelist();
    const { user } = useAuth();

    const isMounted = useIsMounted();
    const [anime, setAnime] = useState<AnimeType>();
    const [editModal, setEditModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [ratingStats, setRatingStats] = useState<{ average: number; count: number; userRating: number | null }>({
        average: 0,
        count: 0,
        userRating: null,
    });
    const [comments, setComments] = useState<Array<{ uid: string; content: string; ownerId: string; updatedAt: string | Date; owner?: { name?: string | null; username?: string | null } }>>([]);
    const [commentText, setCommentText] = useState('');
    const [isSavingComment, setIsSavingComment] = useState(false);

    const toggleEditModal = useCallback((): void => {
        setEditModal(prev => !prev);
    }, []);

    // loadComments and loadRating are declared below as stable callbacks

    const loadComments = useCallback(async () => {
        try {
            const response = await fetch(`/api/comments?animeId=${id}`);
            if (!response.ok) return;
            const data = await response.json();
            setComments(data || []);
            const myComment = (data || []).find((item: { ownerId: string }) => item.ownerId === user?.id);
            if (myComment) {
                setCommentText(myComment.content);
            }
        } catch (error) {
            console.error('Failed to load comments', error);
        }
    }, [id, user?.id]);

    const loadRating = useCallback(async () => {
        try {
            const response = await fetch(`/api/ratings?animeId=${id}`);
            if (!response.ok) return;
            const data = await response.json();
            setRatingStats(prev => ({ ...prev, average: Number(data?.average || prev.average), count: Number(data?.count || prev.count), userRating: data?.userRating?.value ?? prev.userRating }));
        } catch (error) {
            console.error('Failed to load rating stats', error);
        }
    }, [id]);

    useEffect(() => {
        // console.log('AnimeDetail useEffect params:', id, mode);
        useAnimes.findById(id).then((a) => { // todo move to storage provider : add findById and
            // console.log('AnimeDetail useEffect params:', id, a);
            if (isMounted()) {
                setAnime(a);
                // initialize rating from server-attached value
                const rated = a as AnimeType & { rating?: { average: number; count: number } };
                if (rated?.rating) {
                    setRatingStats(prev => ({ ...prev, average: Number(rated.rating!.average ?? 0), count: Number(rated.rating!.count ?? 0) }));
                }

                // fetch user-specific rating if user is present
                if (user) {
                    loadRating();
                }

                // load comments in parallel
                loadComments();
            }
        });

        if (mode === 'edit') setEditModal(true)
    }, [id, isMounted, mode, useAnimes, user, loadComments, loadRating]);



    const handleAnimeUpdate = (anime: AnimeType) => {
        setAnime(anime);
    }

    const keywords = (anime: AnimeType) => encodeURIComponent(`${anime.title} ${anime.lastEpisode ? anime.lastEpisode : ''}`)

    const handleAdd = async (anime: AnimeType) => {
        try {
            setEditModal(false)
            setAddModal(true)
            setAnime(anime);
        } catch (error) {
            console.error('Failed to add anime:', error);
        }
    }

    const handleSetRating = async (value: number) => {
        try {
            const response = await fetch('/api/ratings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ animeId: id, value }),
            });
            if (response.status === 401) {
                window.location.href = '/signin';
                return;
            }
            if (!response.ok) {
                throw new Error(`Failed to rate anime (${response.status})`);
            }
            await loadRating();
        } catch (error) {
            console.error('Failed to save rating', error);
        }
    };

    const handleSaveComment = async () => {
        if (!commentText.trim()) return;
        setIsSavingComment(true);
        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ animeId: id, content: commentText.trim() }),
            });
            if (response.status === 401) {
                window.location.href = '/signin';
                return;
            }
            if (!response.ok) {
                throw new Error(`Failed to save comment (${response.status})`);
            }
            await loadComments();
        } catch (error) {
            console.error('Failed to save comment', error);
        } finally {
            setIsSavingComment(false);
        }
    };

    return (
        <div className='w-full'>
            <div id="modal-root"></div>
            { editModal && anime &&
                <Modal className='sm:w-128 sm:h-156 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-2/5 3xl:w-3/8 z-40 inset-20 items-center' onClose={() => setEditModal(false)} title={anime.title}>
                    <AnimeEdit editedAnime={anime} mode={'edit'} onEdit={handleAnimeUpdate} onCopy={handleAdd}></AnimeEdit>
                </Modal>
            }
            { addModal && anime &&
                <Modal className='sm:w-128 sm:h-156 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-2/5 3xl:w-3/8 z-40 inset-20 items-center' onClose={() => setAddModal(false)} title={`Copy of ${anime.title}`}>
                    <AnimeEdit editedAnime={anime} mode={'add'}></AnimeEdit>
                </Modal>
            }

            {anime ?
                <div className='flex flex-wrap p-2'>
                    <div className='grid grid-rows-4 pt-5 absolute translate-y-8'>
                        <Link href={`/?keywords=${keywords(anime)}`} className="searchlink gap-2 p-4">
                            <FaMagnifyingGlass size={36} className="p-2 bg-secondary-variant rounded-md border border-tertiary-variant outline outline-tertiary-variant"/>
                        </Link>
                        { !editModal &&
                            <Link href={''} className="gap-2 p-4" onClick={toggleEditModal}>
                                <FaPenToSquare size={36} className="p-2 bg-secondary-variant rounded-md border border-tertiary-variant outline outline-tertiary-variant"/>
                            </Link>
                        }
                    </div>

                    <Image className='anime md:w-1/2 md:max-w-screen-sm center justify-center items-center'
                        src={anime.thumbnail}
                        alt={anime.title}
                        width={480}
                        height={480} />
                    <div className='flex flex-col px-2 md:w-1/2'>
                        <h3 className='title text-3xl p-4 capitalize'>{anime.title}</h3>
                        {anime.originalTitle && <div className='p-1 md:px-4'><strong>Original Title:</strong> {anime.originalTitle}</div>}
                        {anime.subtitle && <div className='p-1 md:px-4'><strong>Subtitle:</strong> {anime.subtitle}</div>}
                        <div className='p-1 md:px-4'><strong>Summary:</strong> {anime.summary}</div>

                        <div className='flex flex-col gap-2 p-4 md:px-4'>
                            <div className='flex items-center gap-2'>
                                <span className='text-sm text-tertiary'>global rating</span>
                                <StarRating value={ratingStats.average} readOnly size={18} />
                                <span className='text-xs text-tertiary'>{ratingStats.average.toFixed(1)} ({ratingStats.count})</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <span className='text-sm text-tertiary'>your rating</span>
                                <StarRating value={ratingStats.userRating || 0} readOnly={false} size={20} onChange={handleSetRating} />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-2 p-4 md:px-4'>
                            <div className='p-1 md:px-4'><strong>UID:</strong> {anime.uid}</div>
                            <div className='p-1 md:px-4'><strong>Type:</strong> {anime.type}</div>
                            <div className='p-1 md:px-4'><strong>Status:</strong> {anime.status}</div>
                            <div className='p-1 md:px-4'><strong>Studio:</strong> {anime.studio}</div>
                            <div className='p-1 md:px-4'><strong>Published By:</strong> {anime.publishedBy}</div>
                            <div className='p-1 md:px-4'><strong>Update Days:</strong> {anime.updateDays || 'N/A'}</div>
                            <div className='p-1 md:px-4'><strong>Published At:</strong> {anime.publishedAt ? new Date(anime.publishedAt).toLocaleDateString() : 'N/A'}</div>
                            <div className='p-1 md:px-4'><strong>Release At:</strong> {anime.releaseAt ? new Date(anime.releaseAt).toLocaleDateString() : 'N/A'}</div>
                            <div className='p-1 md:px-4'><strong>Updated At:</strong> {anime.updatedAt ? new Date(anime.updatedAt).toLocaleDateString() : 'N/A'}</div>
                            <div className='p-1 md:px-4'><strong>Thumbnail Filename:</strong> {anime.thumbnailFilename || 'N/A'}</div>
                        </div>

                        <div className='grid grid-cols-2 gap-2 p-4 md:px-4 border-t border-gray-300 mt-4'>
                            <div className='p-1 md:px-4'><strong>First Episode of Season (Global):</strong> {anime.firstSeasonEpisode ?? 'N/A'}</div>
                            <div className='p-1 md:px-4'><strong>Last Episode of Season (Season #):</strong> {anime.lastSeasonEpisode ?? 'N/A'}</div>
                            <div className='p-1 md:px-4'><strong>Total Episodes of Season:</strong> {anime.totalSeasonEpisodes ?? 'N/A'}</div>
                            <div className='p-1 md:px-4'><strong>Last Episode (Global):</strong> {anime.lastEpisode ?? 'N/A'}</div>
                            <div className='p-1 md:px-4'><strong>Total Episodes:</strong> {anime.totalEpisodes ?? 'N/A'}</div>
                        </div>
                    </div>
                </div>
                :
                <div>Loading...</div>
            }

            <div className='w-full mt-8 border-t border-gray-300 pt-4'>
                <h4 className='title text-xl px-2'>comments</h4>
                <div className='flex flex-col md:flex-row gap-2 p-2'>
                    <textarea
                        className='w-full min-h-24 p-2 border border-tertiary-variant rounded-md bg-secondary-variant/40'
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        placeholder='add a comment'
                    />
                    <button
                        type='button'
                        onClick={handleSaveComment}
                        disabled={isSavingComment}
                        className='h-10 px-4 rounded-md bg-primary text-secondary hover:bg-primary/80 disabled:opacity-50'
                    >
                        {isSavingComment ? 'saving...' : 'add'}
                    </button>
                </div>
                <div className='p-2 space-y-3'>
                    {comments.length === 0 && (
                        <div className='text-sm text-tertiary px-2'>no comments yet</div>
                    )}
                    {comments.map(comment => (
                        <div key={comment.uid} className='border border-tertiary-variant rounded-md p-3 bg-secondary-variant/30'>
                            <div className='text-xs text-tertiary flex flex-wrap gap-2'>
                                <span>{comment.owner?.name || comment.owner?.username || 'anonymous'}</span>
                                <span>{new Date(comment.updatedAt).toLocaleDateString()}</span>
                                {user?.id === comment.ownerId && <span className='text-primary'>your comment</span>}
                            </div>
                            <div className='text-sm mt-2'>{comment.content}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
