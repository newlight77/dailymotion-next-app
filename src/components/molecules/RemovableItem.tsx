import React from 'react';
import Link from 'next/link'
import { FaSquareMinus } from 'react-icons/fa6';

interface Props {
    id: string,
    children: React.ReactNode,
    onDelete: (id: string) => void,
    className?: string,
}

const RemovableItem: React.FC<Props> = ({ id, children, onDelete, className }) => {

    const handleDelete = async (id: string) => {
        onDelete(id)
    }

    return (
        <div key={id} className={`${className} grid grid-cols-12 items-center hover:border rounded-md border-tertiary bg-secondaryVariant`}>
            <Link className='col-span-1 p-1' href=''>
                <FaSquareMinus size={24} className="hover:border rounded-md border-tertiary bg-secondaryVariant" onClick={() => handleDelete(id)}/>
            </Link>

            {children}
        </div>
    );
};

export default RemovableItem;