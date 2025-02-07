import React, { useState } from 'react';
import Link from 'next/link'
import { useAnimelist } from '../../hooks/AnimeListProvider';
import { AnimeType } from '../../domain/model/anime';
import AnimeCard from './AnimeCard';
import Modal from '@/components/molecules/Modal';
import AnimeEdit from './AnimeEdit';



type Props = {
    className?: string,
}

const AnimeList: React.FC<Props> = ({className}) => {
    const { items, loadData, reset } = useAnimelist();
    const [data, setData] = useState('')
    const [addModal, setAddModal] = useState(false);
    const [loadMode, setLoadMode] = useState(false);
    const [filterKeywords, setFilterKeywords] = useState('');

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
        [
        ], null, 4
    )

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
                </div>
                :
                <></>
            }

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
                    items?.filter(
                        v => filterKeywords !== '' ?
                            v.title.toLowerCase().includes(filterKeywords.toLowerCase())
                            || v.originalTitle!.includes(filterKeywords.toLowerCase())
                            || v.subtitle!.includes(filterKeywords.toLowerCase())
                            || v.summary.toLowerCase().includes(filterKeywords.toLowerCase())
                        : true)
                    // .sort((a: AnimeType, b: AnimeType) => b.updateAt.getTime() - a.updateAt.getTime())
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
