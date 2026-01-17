import React, { useCallback, useEffect } from 'react';
import Link from 'next/link'

interface CollapsableProps {
    title: string,
    collapsedLabel: string,
    children: React.ReactNode,
    className?: string,
    hideShow?: boolean
}

const Collapsable: React.FC<CollapsableProps> = ({ title, collapsedLabel, children, className, hideShow }) => {
    const [show, setShow] = React.useState(false)

    const toggleShowHide = useCallback(() => {
        setShow(!show);
    }, [show]);

    useEffect(() => {
        toggleShowHide()
    }, [hideShow, toggleShowHide]);

    return (
        <div className={className}>
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

export default Collapsable;