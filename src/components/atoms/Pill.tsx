import React from 'react';

interface Props {
  label: string,
  tone?: 'neutral' | 'success' | 'warning' | 'info',
  className?: string,
}

const toneClasses = {
  neutral: 'bg-secondary-variant text-secondary',
  success: 'bg-emerald-900/30 text-emerald-300 border-emerald-700',
  warning: 'bg-amber-900/30 text-amber-300 border-amber-700',
  info: 'bg-blue-900/30 text-blue-300 border-blue-700',
}

const Pill: React.FC<Props> = ({ label, tone = 'neutral', className }) => {
  const classes = toneClasses[tone] || toneClasses.neutral;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] ${classes} ${className || ''}`}>
      {label}
    </span>
  )
}

export default Pill;
