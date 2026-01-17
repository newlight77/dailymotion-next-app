
import React, { useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import { FaXmark } from 'react-icons/fa6';

type Props = {
      title: string,
      children: React.ReactNode,
      className?: string,
      onClose: () => void
}

const Modal: React.FC<Props> = ({ title, children, className, onClose }) => {

  const handleEscapeKey = useCallback((event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleEscapeKey]);

    const handleCloseClick = (e: React.MouseEvent<HTMLAnchorElement | SVGElement>) => {
      e.preventDefault();
      onClose();
    };

    const modalContent = (
        <div className={`${className} modal-overlay fixed z-999 p-4 w-full rounded-lg bg-secondary-variant bottom-0`}>
              <div className="modal z-1000 border rounded-lg border-tertiary bg-secondary p-4">
                  <div className="modal-header flex text-xl">
                      <FaXmark size={36} className="p-1 close hover:border rounded-md border-tertiary bg-secondary-variant" onClick={handleCloseClick}/>
                      {title && <h3 className="px- py-1 mx-2 bg-secondary-variant rounded-md w-full">{title}</h3>}
                    </div>
                  <div className="modal-body pt-4">{children}</div>
              </div>
        </div>
    );

    const modalRoot = document.getElementById("modal-root");
    if (!modalRoot) throw new Error("Modal root element not found");

    return ReactDOM.createPortal(
        modalContent,
        modalRoot
    );
};

export default Modal