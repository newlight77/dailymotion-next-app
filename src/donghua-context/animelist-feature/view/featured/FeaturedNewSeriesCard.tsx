import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaMagnifyingGlass } from 'react-icons/fa6';

interface Props {
  anime: {
    uid: string,
    title: string,
    originalTitle?: string,
    subtitle?: string,
    summary?: string,
    thumbnail?: string,
  },
  className?: string,
}

export const FeaturedNewSeriesCard: React.FC<Props> = ({ anime, className }) => {
  const keywords = (a: Props['anime']) => encodeURIComponent(`${a.title}`)

  return (
    <div className={`${className || ''} p-2 md:hover:border border-gold rounded-md`}>
      <div className='grid'>
        <div className='grid grid-rows-1 pt-5 absolute translate-y-14'>
          <Link href={`/videosearch?keywords=${keywords(anime)}`} className="searchlink gap-2 p-4">
            <FaMagnifyingGlass size={36} className="p-2 bg-secondary-variant rounded-md border border-tertiary-variant outline outline-tertiary-variant"/>
          </Link>
        </div>
        {anime.originalTitle && (
          <div className='title p-2 m-1 absolute translate-y-4 font-bold text-xxl text-wrap text-tertiary border rounded-sm bg-secondary-variant justify-self-end'>
            {anime.originalTitle}
          </div>
        )}
      </div>

      <Link className='thumbnaillink' href={`/videosearch?keywords=${keywords(anime)}`}>
        {anime.thumbnail ? (
          <Image className='anime max-h-screen h-128' src={anime.thumbnail} alt={anime.title} width={480} height={480} />
        ) : (
          <div className='anime max-h-screen h-128 bg-secondary-variant rounded-md' />
        )}
      </Link>

      <div>
        <Link className='titlelink' href={`/videosearch?keywords=${keywords(anime)}`}>
          <div className='title h-12 font-extrabold text-xl text-wrap text-tertiary underline underline-offset-4 decoration-primary'>{anime.title}</div>
          <div className='title py-2 h-8 text-sm text-wrap text-tertiary decoration-primary-variant'>{anime.subtitle}</div>
        </Link>
        <div className='description text-sm text-wrap pt-4 h-10 '>{anime.summary ? `${anime.summary.substring(0, 140)} ...` : ''}</div>
      </div>
    </div>
  )
}
