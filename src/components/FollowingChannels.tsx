import React, { useEffect, useState } from 'react';
import { useLocalStorage } from '@/shared/useLocalStorage';
import Link from 'next/link'

interface ViewHistoryProps {
    newChannel?: Channel,
    onSelected: (channel: Channel) => void;
}

export type Channel = {
    uid: string,
    name: string,
    slug: string,
    link: string,
}

const FollowingChannels: React.FC<ViewHistoryProps> = ({ newChannel, onSelected }) => {
    const [channels, setChannels] = useLocalStorage<Channel[]>(`following-channels`, []);
    const [inputChannel, setInputChannel] = useState('');
    const [show, setShow] = React.useState(false)

    const addNewChannel = (channel?: Channel) => {
        if (channel && channels) {
            const updatedChannels = [...channels, channel]
                .reduce<Channel[]>((acc, curr) => acc.some(item => item.name === curr.name) ? acc : [...acc, curr], []);
                setChannels(updatedChannels);
        }
    }

    useEffect(() => {
        addNewChannel(newChannel);
    }, [newChannel]);


    useEffect(() => {
        if (inputChannel !== '') {
            addNewChannel({uid: crypto.randomUUID().toString(), name: inputChannel, slug: '', link: ''});
        }
    }, [inputChannel]);

    const selectChannel = async (selected: Channel) => {
        onSelected(selected)
    }

    const deleteChannel = async (id: string) => {
        if (channels) {
            const newFollowingChannels = channels.filter(s => s.uid !== id)
            setChannels(newFollowingChannels);
            console.log('delete channel after ', id, newFollowingChannels);
        }
    }

    const clearHistory = async () => {
        setChannels([]);
        console.log('clear follwoing channels', history);
    }

    const handleAddNewChannel = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== '' && event.target.value !== inputChannel) {
            console.log('new follwoing channel', event.target.value);
            setInputChannel(event.target.value);
        }
    };

    function toggleShowHide(): void {
        setShow(show ? false : true);
    }

    return (
        <div className="p-1 md:gap-4 md:p-4 sm:p-1 sm:gap-1">
            <div>
                <div className="flex flex-row pb-4 items-center">
                    <Link href={''} onClick={toggleShowHide}>
                    { show ? '' : 'show my favorite channels' }
                    </Link>
                    { show ?
                        <div>
                            <Link href={''} onClick={toggleShowHide}>
                                <h3>My following channels</h3>
                            </Link>
                            <Link href={''} onClick={clearHistory}>clear channels</Link>
                        </div>
                        :
                        ''
                    }
                </div>
            </div>
            <div className='items-center'>
                <div>
                    { show ?
                        <input
                            className='basis-1/8 min-w-32 max-w-72 h-6'
                            type="text"
                            defaultValue={inputChannel}
                            onBlur={(event: React.ChangeEvent<HTMLInputElement>) => handleAddNewChannel(event) }
                            placeholder="follow a channel"
                        />
                        : <></>
                    }
                </div>
                <div>
                    { show && channels ?.map(s => (
                        <div key={s.uid} className="flex flex-row gap-4 items-center">
                            <Link href={''} className="basis-1/8" onClick={() => deleteChannel(s.uid)}>
                                delete
                            </Link>
                            <Link href={s.link} className="basis-1/2" onClick={() => selectChannel(s)}>
                            {`${s.name}` }
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FollowingChannels;