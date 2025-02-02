"use client"
import React, { useEffect, useState } from 'react';
import { AnimeType } from '@/bounded-contexts/video-search-context/domain/model/anime';
import { useAnimelist } from '../../hooks/AnimeListProvider';

type Props = {
    editedAnime?: AnimeType
    children?: React.ReactNode
}

const blankAnime: AnimeType = {
    uid: crypto.randomUUID().toString(),
    type: 'movie',
    status: 'completed',
    title: '',
    summary: '',
    thumbnail: '',
    studio: '',
    publishedBy: '',
    publishedAt: new Date(),
    releaseAt: new Date(),
    updateAt: new Date(),
    originalTitle: '',
    subtitle: '',
    lastEpisode: undefined,
    totalEpisodes: undefined
  }

const AnimeEdit: React.FC<Props> = ({editedAnime}) => {
    const { upsert } = useAnimelist();
    const [ anime, setAnime ] = useState<AnimeType>(blankAnime);

    useEffect(() => {
        console.log('AnimeEdit', editedAnime);
        if (editedAnime) setAnime(editedAnime)
    }, [editedAnime]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAnime({
            ...anime,
            [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        upsert(anime)
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
                <input className='col-span-12' type="text" name="summary" value={anime.summary} onChange={handleChange} placeholder="Summary" required />
                <input className='col-span-12' type="text" name="thumbnail" value={anime.thumbnail} onChange={handleChange} placeholder="Thumbnail" required />
                <input className='col-span-6' type="text" name="studio" value={anime.studio} onChange={handleChange} placeholder="Studio" required />
                <input className='col-span-6' type="text" name="publishedBy" value={anime.publishedBy} onChange={handleChange} placeholder="Published By" required />
                <input className='col-span-6' type="date" name="publishedAt" value={anime.publishedAt.toISOString().split('T')[0]} onChange={handleChange} required />
                <input className='col-span-6' type="date" name="releaseAt" value={anime.releaseAt.toISOString().split('T')[0]} onChange={handleChange} required />
                <input className='col-span-6' type="date" name="updateAt" value={anime.updateAt.toISOString().split('T')[0]} onChange={handleChange} required />
                <input className='col-span-6' type="number" name="lastEpisode" value={anime.lastEpisode} onChange={handleChange} placeholder="Last Episode" />
                <input className='col-span-6' type="number" name="totalEpisodes" value={anime.totalEpisodes} onChange={handleChange} placeholder="Total Episodes" />
                <button className='col-span-5' type="submit">Create</button>
            </form>
        </div>
    );
};

export default AnimeEdit;
