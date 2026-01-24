import React from 'react';

export const PasswordInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ ...props }) => (
  <input type="password" {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />
);

const moduleExport = {};
export default moduleExport;
