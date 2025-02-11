import React, { useState } from 'react';
import Link from 'next/link'
import Modal from '@/components/molecules/Modal';
import { useAnimelist } from '../../hooks';
import { AnimeType } from '../../domain';
import { AnimeCard } from './AnimeCard';
import { AnimeEdit } from './AnimeEdit';

type AnimeWithOrderScore = AnimeType & {
    orderScore: number
}

type Props = {
    className?: string,
}

export const AnimeList: React.FC<Props> = ({className}) => {
    const { items, loadData, reset } = useAnimelist();
    const [data, setData] = useState('')
    const [addModal, setAddModal] = useState(false);
    const [loadMode, setLoadMode] = useState(false);
    const [filterKeywords, setFilterKeywords] = useState('');
    const [excludeCompleted, setExcludeCompleted] = useState(true);
    const [onlyWithThumbnail, setOnlyWithThumbnail] = useState(true);

    // useEffect(() => {
    // }, [onlyCompleted]);

    const onFilterInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterKeywords(event.target.value);
    };

    function toggleLoadMode(): void {
        setLoadMode(loadMode ? false : true);
    }

    function toggleAddModal(): void {
        setAddModal(addModal ? false : true);
    }

    const handleReloadDataChange = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        if (event.target.value !== data) {
            setData(event.target.value);
        }
    };

    const handleExcludeCompletedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExcludeCompleted(event.target.checked)
    };

    const handleOnlyWithThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOnlyWithThumbnail(event.target.checked)
    };

    const reloadData = () => {
        if (data) {
            try {
                const newAnimelist = (JSON.parse(data) as AnimeType[])
                .reduce<AnimeType[]>((acc, curr) => acc.some(item => item.title === curr.title) ? acc : [...acc, curr], []);
                loadData(newAnimelist);
            } catch (error) {
                // display error latet
                alert(`there is an error with the json you try to load : ${error}`);
            }
        }
    };

    const sample = JSON.stringify(
        [], null, 4
    )

    // function orderScore(anime: AnimeType): number {
    //     const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    //     const todayWeekDay = new Date().getDay();

    //     if (anime.updateDays) {
    //         if (anime.updateDays.toLowerCase().includes(daysOfWeek[(todayWeekDay + 0) % 7].toLowerCase())) return 7;
    //         if (anime.updateDays.toLowerCase().includes(daysOfWeek[(todayWeekDay + 1) % 7].toLowerCase())) return 6;
    //         if (anime.updateDays.toLowerCase().includes(daysOfWeek[(todayWeekDay + 2) % 7].toLowerCase())) return 5;
    //         if (anime.updateDays.toLowerCase().includes(daysOfWeek[(todayWeekDay + 3) % 7].toLowerCase())) return 4;
    //         if (anime.updateDays.toLowerCase().includes(daysOfWeek[(todayWeekDay + 4) % 7].toLowerCase())) return 3;
    //         if (anime.updateDays.toLowerCase().includes(daysOfWeek[(todayWeekDay + 5) % 7].toLowerCase())) return 2;
    //         if (anime.updateDays.toLowerCase().includes(daysOfWeek[(todayWeekDay + 6) % 7].toLowerCase())) return 1;
    //     }
    //     return 0;
    // }

    function orderScore(anime: AnimeType): number {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayWeekDay = new Date().getDay();

        if (!anime.updateDays) {
          return 0;
        }

        for (let i = 0; i < 7; i++) {
          const day = daysOfWeek[(todayWeekDay + i) % 7].toLowerCase();
          if (anime.updateDays.toLowerCase().includes(day)) {
            return 7 - i;
          }
        }

        return 0;
      }

    function withOrderScore(anime: AnimeType): AnimeWithOrderScore {
        const score = orderScore(anime);
        console.log('score updateDays', anime.updateDays, score)
        return {
            ...anime,
            orderScore: score
        }
    }

    function filterList(items: AnimeType[] | undefined): AnimeType[] {
        if (!items) return []

        return items
            .filter(
                v => filterKeywords !== '' ?
                    v.title.toLowerCase().includes(filterKeywords.toLowerCase())
                    || v.originalTitle!.toLocaleLowerCase().includes(filterKeywords.toLowerCase())
                    || v.subtitle!.toLocaleLowerCase().includes(filterKeywords.toLowerCase())
                    || v.summary.toLowerCase().includes(filterKeywords.toLowerCase())
                : true)
            .filter(v => onlyWithThumbnail ? v.thumbnail !== '' : true)
            .filter(v => excludeCompleted ? v.status !== 'completed' : true )
    }

    return (
        <div className={className}>

            <div id="modal-root"></div>

            {addModal &&
                <Modal className='sm:w-128 sm:h-156 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-2/5 3xl:w-3/8 z-40' onClose={() => setAddModal(false)} title={'New Amine'}>
                    <AnimeEdit edit={false}></AnimeEdit>
                </Modal>
            }

            {
                items && items?.length > 0 ?
                <div className="pt-4 pb-4 text-primary">
                    <input
                        className='w-96'
                        type="text"
                        value={filterKeywords}
                        onChange={onFilterInputChange}
                        placeholder="filter on title, subtile original title or summary"
                    />
                    <label className='px-2 w-12'>exclude completed</label>
                    <input className='px-2 w-4'
                        type="checkbox"
                        checked={excludeCompleted}
                        onChange={handleExcludeCompletedChange} />

                    <label className='px-2 w-12'>only with thumbnail</label>
                    <input className='px-2 w-4'
                        type="checkbox"
                        checked={onlyWithThumbnail}
                        onChange={handleOnlyWithThumbnailChange} />

                </div>
                :
                <></>
            }

            <label className='px-4 w-12'>total: {filterList(items).length} / {items?.length}</label>

            <div className='animelist-header p-4'>
                { addModal ?
                    <span className="pr-4">add</span>
                    :
                    <Link href={''} className="pr-4" onClick={toggleAddModal}>add</Link>
                }
                <Link href={''} className="pr-4" onClick={toggleLoadMode}>load</Link>
                <Link href={''} className="pr-4" onClick={reset}>reset</Link>

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

            <div className="md:flex flex-wrap">
                {
                    filterList(items)
                    .map(anime => withOrderScore(anime))
                    .sort((a: AnimeWithOrderScore, b: AnimeWithOrderScore) => b.orderScore - a.orderScore)
                    .map(anime => (
                        <AnimeCard
                            className="pt-4 pb-4 xs:w-screen sm:w-screen md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 3xl:w-1/6 4xl:w-1/7 5xl:w-1/8 h-auto"
                            key={anime.uid}
                            anime={anime} >
                        </AnimeCard>
                    ))
                }
            </div>
        </div>
    );
};

export default AnimeList;
