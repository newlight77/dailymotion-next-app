import React from 'react';
import Link from 'next/link'

interface CollapsableProps {
    title: string,
    collapsedLabel: string,
    children: React.ReactNode;
}

const SearchHistory: React.FC<CollapsableProps> = ({ title, collapsedLabel, children }) => {
    const [show, setShow] = React.useState(false)

    const toggleShowHide = () => {
        setShow(!show);
    }

    return (
        <div className="p-1 md:gap-4 md:p-4 sm:p-1 sm:gap-1">
            <div>
                <div className="flex flex-row pb-4 items-center">
                    <Link href={''} onClick={toggleShowHide}>
                    { show ? <h3>{title}</h3> : <div>{collapsedLabel}</div> }
                    </Link>
                </div>
                <div>
                    {
                        show ?
                            <>{children}</>
                        :
                        <></>
                    }
                </div>
            </div>

        </div>
    );
};

export default SearchHistory;