import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import Pill from '../../../../components/atoms/Pill';

interface Props {
  animeId: string,
  title: string,
  subtitle?: string,
  originalTitle?: string,
  thumbnail?: string,
  lastEpisode?: number,
  lastPublishedAt?: Date,
  upcomingEpisode?: number | string,
  upcomingAt?: Date,
  source?: string,
  sourceUrl?: string,
  isEstimate?: boolean,
  className?: string,
}

const formatDate = (date?: Date): string => {
  return date ? date.toLocaleDateString() : 'N/A';
}

const keywords = (title: string, episode?: number | string) => encodeURIComponent(`${title} ${episode ?? ''}`.trim());

export const UpcomingScheduleCard: React.FC<Props> = ({
  animeId,
  title,
  subtitle,
  originalTitle,
  thumbnail,
  lastEpisode,
  lastPublishedAt,
  upcomingEpisode,
  upcomingAt,
  source,
  sourceUrl,
  isEstimate,
  className,
}) => {
  return (
    <div className={`${className || ''} p-2 md:hover:border border-gold rounded-md`}>
      <div className='grid'>
        <div className='grid grid-rows-1 pt-5 absolute translate-y-14'>
          <Link href={`/videosearch?keywords=${keywords(title, upcomingEpisode)}`} className="searchlink gap-2 p-4">
            <FaMagnifyingGlass size={36} className="p-2 bg-secondary-variant rounded-md border border-tertiary-variant outline outline-tertiary-variant"/>
          </Link>
        </div>
        {originalTitle && (
          <div className='title p-2 m-1 absolute translate-y-4 font-bold text-xxl text-wrap text-tertiary border rounded-sm bg-secondary-variant justify-self-end'>
            {originalTitle}
          </div>
        )}
      </div>

      <Link className='thumbnaillink' href={`/animelist/${animeId}`}>
        {thumbnail ? (
          <Image className='anime max-h-screen h-128' src={thumbnail} alt={title} width={480} height={480} />
        ) : (
          <div className='anime max-h-screen h-128 bg-secondary-variant rounded-md' />
        )}
      </Link>

      <div>
        <Link className='titlelink' href={`/animelist/${animeId}`}>
          <div className='title h-12 font-extrabold text-xl text-wrap text-tertiary underline underline-offset-4 decoration-primary'>{title}</div>
          <div className='title py-2 h-8 text-sm text-wrap text-tertiary decoration-primary-variant'>{subtitle}</div>
        </Link>

        <div className='content pt-6'>
          <div className='grid grid-cols-2 gap-2 items-center'>
            <div className='ml-2'>last episode:</div>
            <div className='ml-2'>{lastEpisode ?? 'N/A'}</div>
            <div className='ml-2'>last published:</div>
            <div className='ml-2 text-xs'>{formatDate(lastPublishedAt)}</div>
            <div className='ml-2'>upcoming episode:</div>
            <div className='ml-2'>{upcomingEpisode ?? 'N/A'}</div>
            <div className='ml-2'>upcoming date:</div>
            <div className='ml-2 text-xs'>{formatDate(upcomingAt)}</div>
          </div>
        </div>

        <div className='flex items-center gap-2 text-xs pt-3'>
          {source ? (
            <Pill label={source} tone={isEstimate ? 'warning' : 'success'} />
          ) : (
            <Pill label="estimated" tone="warning" />
          )}
          {sourceUrl && (
            <Link href={sourceUrl} className="text-xs underline text-tertiary">
              source
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
