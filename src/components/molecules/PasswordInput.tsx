import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  wrapperClassName?: string;
  inputClassName?: string;
};

const PasswordInput: React.FC<Props> = ({
  wrapperClassName,
  inputClassName,
  ...props
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className={`relative ${wrapperClassName || ''}`}>
      <input
        {...props}
        type={show ? 'text' : 'password'}
        className={`pr-10 ${inputClassName || ''}`}
      />
      <button
        type="button"
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-2 flex items-center text-tertiary/70 hover:text-tertiary"
        onClick={() => setShow((prev) => !prev)}
      >
        {show ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
      </button>
    </div>
  );
};

export default PasswordInput;
