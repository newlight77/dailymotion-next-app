import React from 'react';

export const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button {...props as React.ButtonHTMLAttributes<HTMLButtonElement>}>{children}</button>
);

export const Divider: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children }) => (
  <div className="divider">{children}</div>
);

export const Link: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({ children, href, ...props }) => (
  <a href={href} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>
);

export const LogoutButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children || 'Logout'}</button>
);

export const ProfileButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children || 'Profile'}</button>
);

export const GoogleIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#DB4437"/></svg>
);

const moduleExport = {};
export default moduleExport;
