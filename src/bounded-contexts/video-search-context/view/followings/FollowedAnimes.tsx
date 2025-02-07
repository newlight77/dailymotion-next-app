import React, { useState } from 'react';
import Link from 'next/link'
import { FollowedAnimeType } from '../../domain/model/anime';
import RemovableItem from '@/components/molecules/RemovableItem';
import { useFollowedAnimes } from '../../hooks/FollowedAnimesProvider';



type Props = {
    className?: string,
}

const FollowedAnimes: React.FC<Props> = ({className}) => {
    const { items, remove, loadData, clear } = useFollowedAnimes();
    const [data, setData] = useState('')
    const [loadMode, setLoadMode] = useState(false);


    function toggleLoadMode(): void {
        setLoadMode(loadMode ? false : true);
    }

    const handleReloadDataChange = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (event.target.value !== data) {
        setData(event.target.value);
    }
    };

    const reloadData = () => {
        if (data) {
            try {
                const newFollowings = (JSON.parse(data) as FollowedAnimeType[])
                .reduce<FollowedAnimeType[]>((acc, curr) => acc.some(item => item.animeId === curr.animeId) ? acc : [...acc, curr], []);
                loadData(newFollowings);
            } catch (error) {
                // display error latet
                alert(`there is an error with the json you try to load : ${error}`);
            }
        }
    };

    const sample = JSON.stringify(
        [
            {
                "uid": "910906a2-95eb-4c8b-b560-91fe65754252",
                "animeId": "910906a2-95eb-4c8b-b560-91fe65754252",
                "title": "test 1",
                "subtitle": "test 1",
                "originalTitle": "test 1",
                "thumbnail": "url",
                "lastEpisode": 122,
                "updatedAt": new Date(),
            },
            {
                "uid": "7526bc07-7eb1-41df-afd2-67b1bbeb94b0",
                "animeId": "7526bc07-7eb1-41df-afd2-67b1bbeb94b0",
                "title": "test 2",
                "subtitle": "test 2",
                "originalTitle": "test 2",
                "thumbnail": "url",
                "lastEpisode": 122,
                "updatedAt": new Date(),
            }
        ], null, 4
    )

    const keywords = (anime: FollowedAnimeType) => encodeURIComponent(`${anime.title} ${anime.lastEpisode ? anime.lastEpisode : ''}`)

    return (
        <div className={className}>
            <div className='text-md pl-4'>Follow an anime in order trigger latest updates on that anime</div>
            <div className='followings-header p-4'>
                <Link href={''} className="pr-4" onClick={toggleLoadMode}>load</Link>
                <Link className='pr-4' href={''} onClick={clear}>clear</Link>

                {loadMode ?
                    <>
                        <textarea
                            className='w-full h-96 rounded-lg'
                            defaultValue={data || ''}
                            onBlur={(event: React.FocusEvent<HTMLTextAreaElement>) => handleReloadDataChange(event) }
                            placeholder={`Example : \n ${sample}`}
                        ></textarea>
                        <Link href={''} className="pl-4" onClick={reloadData}>load</Link>
                    </>
                    :
                    <></>
                }
            </div>

            <div className='flex flex-col gap-2 p-2'>
                { items ?.map(s => (
                    <RemovableItem onDelete={remove} key={s.uid} id={s.uid}>
                        <Link
                            className="col-span-11"
                            href={`/?keywords=${keywords(s)}`} >
                            <div className="col-span-5 hover:text-tertiary" >
                                <div className='underline underline-offset-4 decoration-primary'>{s.title}</div>
                                { s.originalTitle ? <div className='pr-2 w-fit'>{s.originalTitle}</div> : <></>}
                                {/* { s.subtitle ? <div>{s.subtitle}</div> : <></>} */}
                                { s.lastEpisode ? <div>{s.lastEpisode}</div> : <></>}
                            </div>
                        </Link>
                    </RemovableItem>
                ))}
            </div>
        </div>
    );
};

export default FollowedAnimes;