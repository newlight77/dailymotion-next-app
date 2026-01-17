import React from 'react';

interface Props {
  title: string,
  subtitle?: string,
  children: React.ReactNode,
  className?: string,
}

const FeaturedRegion: React.FC<Props> = ({ title, subtitle, children, className }) => {
  return (
    <section className={`w-full ${className || ''}`}>
      <div className="pb-4">
        <h2 className="title text-3xl p-1 md:p-4 capitalize">{title}</h2>
        {subtitle && <div className="text-sm text-secondary px-1 md:px-4">{subtitle}</div>}
      </div>
      {children}
    </section>
  )
}

export default FeaturedRegion;
