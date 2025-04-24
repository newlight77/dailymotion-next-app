"use client"
import React, { useState } from 'react';
import { AnimeType } from '../../domain';
import { useAnimelist } from '../../hooks';

type Props = {
    mode: ModeType,
    editedAnime?: AnimeType
    onEdit?: (anime: AnimeType) => void
    onCopy?: (anime: AnimeType) => void
    children?: React.ReactNode,
}

type ModeType = 'edit' | 'add'

const blankAnime: AnimeType = {
    uid: crypto.randomUUID().toString(),
    type: 'movie',
    status: 'completed',
    title: '',
    summary: '',
    thumbnail: '',
    thumbnailFilename: '',
    studio: '',
    updateDays: '',
    publishedBy: '',
    publishedAt: new Date(),
    releaseAt: new Date(),
    updatedAt: new Date(),
    originalTitle: '',
    subtitle: '',
    lastEpisode: undefined,
    totalEpisodes: undefined
  }

export const AnimeEdit: React.FC<Props> = ({mode = 'new', editedAnime = blankAnime, onEdit, onCopy}) => {
    const useAnimes = useAnimelist();
    const [ anime, setAnime ] = useState<AnimeType>(editedAnime);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAnime({
            ...anime,
            [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        useAnimes.upsert(anime)
        if (onEdit) onEdit(anime)
    };

    const handleCopy = (e: React.FormEvent) => {
        e.preventDefault();
        const newAnime = {
            ...anime,
            uid: crypto.randomUUID().toString()
        }
        if (onCopy) onCopy(newAnime)
    };

    return (
        <div className='w-full'>
            <form onSubmit={handleSubmit} className='grid grid-cols-12 gap-2 p-1 items-center'>
                <select className='p-2 m-1 col-span-6 bg-secondaryVariant border border-primary rounded' name="type" value={anime.type} onChange={handleChange}>
                    <option value="movie">Movie</option>
                    <option value="series">Series</option>
                </select>
                <select className='p-2 m-1 col-span-6 bg-secondaryVariant border border-primary rounded' name="status" value={anime.status} onChange={handleChange}>
                    <option value="completed">Completed</option>
                    <option value="ongoing">Ongoing</option>
                </select>
                <input className='col-span-12' type="text" name="title" value={anime.title} onChange={handleChange} placeholder="Title" required />
                <input className='col-span-12' type="text" name="originalTitle" value={anime.originalTitle} onChange={handleChange} placeholder="Original Title" />
                <input className='col-span-12' type="text" name="subtitle" value={anime.subtitle} onChange={handleChange} placeholder="Subtitle" />
                <input className='col-span-12' type="text" name="summary" value={anime.summary} onChange={handleChange} placeholder="Summary" />
                <input className='col-span-12' type="text" name="thumbnail" value={anime.thumbnail} onChange={handleChange} placeholder="Thumbnail" required />
                <input className='col-span-12' type="text" name="thumbnailFilename" value={anime.thumbnail} onChange={handleChange} placeholder="Thumbnail filename in public/uploads" required />
                <input className='col-span-6' type="text" name="studio" value={anime.studio} onChange={handleChange} placeholder="Studio" />
                <input className='col-span-6' type="text" name="updateDays" value={anime.updateDays} onChange={handleChange} placeholder="Update days of week e.g. Monday,Friday" />
                <input className='col-span-6' type="text" name="publishedBy" value={anime.publishedBy} onChange={handleChange} placeholder="Published By" />
                <input className='col-span-6' type="date" name="publishedAt" value={anime.publishedAt.toISOString().split('T')[0]} onChange={handleChange} required />
                <input className='col-span-6' type="date" name="releaseAt" value={anime.releaseAt.toISOString().split('T')[0]} onChange={handleChange} required />
                <input className='col-span-6' type="date" name="updatedAt" value={anime.updatedAt.toISOString().split('T')[0]} onChange={handleChange} required />
                <input className='col-span-6' type="number" name="firstSeasonEpisode" value={anime.firstSeasonEpisode} onChange={handleChange} placeholder="First Episode of Season (global number)" />
                <input className='col-span-6' type="number" name="lastSeasonEpisode" value={anime.lastSeasonEpisode} onChange={handleChange} placeholder="Last Episode of Season (season number)" />
                <input className='col-span-6' type="number" name="totalSeasonEpisodes" value={anime.totalSeasonEpisodes} onChange={handleChange} placeholder="Total Episodes of Season" />
                <input className='col-span-6' type="number" name="lastEpisode" value={anime.lastEpisode} onChange={handleChange} placeholder="Last Episode (global number)" />
                <input className='col-span-6' type="number" name="totalEpisodes" value={anime.totalEpisodes} onChange={handleChange} placeholder="Total Episodes" />
                <button className='col-span-5' type="submit">{ mode === 'edit' ? 'Apply changes' : 'Create'} </button>
                { onCopy ? <button className='col-span-5' type="button" onClick={handleCopy}>{ 'Copy'} </button> : <></> }
            </form>
        </div>
    );
};
