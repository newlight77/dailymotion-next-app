import React from 'react';

interface Props {
  label: string,
  value?: React.ReactNode,
  className?: string,
}

const KeyValueRow: React.FC<Props> = ({ label, value, className }) => {
  return (
    <div className={`flex items-center justify-between gap-2 ${className || ''}`}>
      <div className="text-secondary">{label}</div>
      <div className="text-right">{value ?? 'N/A'}</div>
    </div>
  )
}

export default KeyValueRow;
