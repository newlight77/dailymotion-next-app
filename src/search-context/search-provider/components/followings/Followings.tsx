import React, { useState } from 'react';
import Link from 'next/link'
import { FaSquareMinus } from 'react-icons/fa6';
import { useFollowings } from '../../domain/FollowingsProvider';
import { FollowingType } from '../../domain/anime';



type Props = {
    className?: string,
}

const Followings: React.FC<Props> = ({className}) => {
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
        <div className={className}>
            <div className='followings-header p-4'>
                <Link href={''} className="pr-4" onClick={toggleEditMode}>edit</Link>
                <Link className='pr-4' href={''} onClick={clear}>clear</Link>
                <Link href={''} className="pr-4" onClick={reset}>reset</Link>

                {editMode ?
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
                    <div key={s.uid} className="grid grid-cols-12 items-center">
                        <Link className='col-span-1 p-1' href=''>
                            <FaSquareMinus size={24} className="hover:border rounded-md border-tertiary bg-secondaryVariant" onClick={() => remove(s.uid)}/>
                        </Link>
                        <Link
                            className="col-span-11 pl-2 hover:border rounded-md border-tertiary bg-secondaryVariant"
                            href={`https://www.dailymotion.com/${s.owner}`}
                            target="_blank">
                            {`${s.owner}` }
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Followings;