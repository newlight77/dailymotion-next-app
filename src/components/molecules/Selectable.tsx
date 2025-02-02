import React from 'react';

interface Props {
    children: React.ReactNode,
    onSelect: () => void,
    className?: string,
}

const SelactableItem: React.FC<Props> = ({ children, onSelect, className }) => {

    return (
        <div className={`${className}`} onClick={onSelect}>
            {children}
        </div>
    );
};

export default SelactableItem;