import React, { useState } from 'react';
import Link from 'next/link'
import { useFollowings } from './FollowingsProvider';


interface ViewFollowingsProps {}

export type FollowingType = {
    uid: string,
    owner: string,
    order: number,
}

const Followings: React.FC<ViewFollowingsProps> = () => {
    const { items, remove, loadData, reset, clear } = useFollowings();
    const [data, setData] = useState('')
    const [editMode, setEditMode] = useState(false);


    function toggleEditMode(): void {
        setEditMode(editMode ? false : true);
    }

    const handleReloadDataChange = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (event.target.value !== data) {
        setData(event.target.value);
    }
    };

    const reloadData = () => {
        if (data) {
            try {
                const newFollowings = (JSON.parse(data) as FollowingType[])
                .reduce<FollowingType[]>((acc, curr) => acc.some(item => item.owner === curr.owner) ? acc : [...acc, curr], []);
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
        <div className="p-1 md:gap-4 md:p-4 sm:p-1 sm:gap-1">
            <div className='favorties-header'>
                <div className="pb-4">
                    <Link href={''} className="pr-4" onClick={toggleEditMode}>edit</Link>
                    <Link className='pr-4' href={''} onClick={clear}>clear</Link>
                    <Link href={''} className="pr-4" onClick={reset}>reset</Link>
                </div>
                {editMode ?
                    <>
                        <textarea
                            className='flex w-full h-96 rounded-lg'
                            defaultValue={data || ''}
                            onBlur={(event: React.FocusEvent<HTMLTextAreaElement>) => handleReloadDataChange(event) }
                            placeholder={`Example : \n ${sample}`}
                        ></textarea>
                        <button onClick={reloadData}>load</button>
                    </>
                    :
                    <></>
                }
            </div>


            <div className='items-center'>

                <div>
                    { items ?.map(s => (
                        <div key={s.uid} className="flex flex-row gap-4 items-center">
                            <Link href={''} className="basis-1/8" onClick={() => remove(s.uid)}>
                                delete
                            </Link>
                            <Link href={`https://www.dailymotion.com/${s.owner}`} target="_blank" className="basis-1/2">
                                {`${s.owner}` }
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Followings;