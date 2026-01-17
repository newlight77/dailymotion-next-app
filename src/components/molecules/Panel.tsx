import React from 'react';

interface Props {
  children: React.ReactNode,
  className?: string,
}

const Panel: React.FC<Props> = ({ children, className }) => {
  return (
    <div className={`rounded-lg border border-tertiary-variant bg-secondary-variant/40 ${className || ''}`}>
      {children}
    </div>
  )
}

export default Panel;
