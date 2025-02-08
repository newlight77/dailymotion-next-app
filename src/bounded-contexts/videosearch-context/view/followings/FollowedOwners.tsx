import React, { useState } from 'react';
import Link from 'next/link'
import { useFollowedVideoOwners } from '../../hooks/FollowedVideoOwnersProvider';
import { FollowedVideoOwnerType } from '../../domain/model/anime';
import RemovableItem from '@/components/molecules/RemovableItem';



type Props = {
    className?: string,
}

const Followings: React.FC<Props> = ({className}) => {
    const { items, remove, loadData, reset, clear } = useFollowedVideoOwners();
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
                const newFollowings = (JSON.parse(data) as FollowedVideoOwnerType[])
                .reduce<FollowedVideoOwnerType[]>((acc, curr) => acc.some(item => item.owner === curr.owner) ? acc : [...acc, curr], []);
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
                "owner": "VitaAnimation",
            },
            {
                "uid": "7526bc07-7eb1-41df-afd2-67b1bbeb94b0",
                "owner": "MM_8888",
            }
        ], null, 4
    )

    return (
        <div className={className}>
            <div className='text-md pl-4'>Follow an owner in order trigger latest updates on that anime from that owner</div>
            <div className='followings-header p-4'>
                <Link href={''} className="pr-4" onClick={toggleLoadMode}>load</Link>
                <Link className='pr-4' href={''} onClick={clear}>clear</Link>
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

            <div className='flex flex-col gap-2 p-2'>
                { items ?.map(s => (
                    <RemovableItem onDelete={remove} key={s.uid} id={s.uid}>
                        <Link
                            className="col-span-11 pl-2"
                            href={`https://www.dailymotion.com/${s.owner}`}
                            target="_blank">
                            {`${s.owner}` }
                        </Link>
                    </RemovableItem>
                ))}
            </div>
        </div>
    );
};

export default Followings;