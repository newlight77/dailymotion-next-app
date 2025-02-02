
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { FaXmark } from 'react-icons/fa6';

type Props = {
      title: string,
      children: React.ReactNode,
      className?: string,
      onClose: () => void
}

const Modal: React.FC<Props> = ({ title, children, className, onClose }) => {

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

    const handleCloseClick = (e: React.MouseEvent<HTMLAnchorElement | SVGElement>) => {
      e.preventDefault();
      onClose();
    };

    const modalContent = (
        <div className={`${className} modal-overlay absolute p-4 w-full rounded-lg bg-secondaryVariant`}>
              <div className="modal border rounded-lg border-tertiary bg-secondary p-4">
                  <div className="modal-header flex text-xl">
                      <FaXmark size={28} className="close hover:border rounded-md border-tertiary bg-secondaryVariant" onClick={handleCloseClick}/>
                      {title && <h3 className="px-4 bg-secondaryVariant rounded-md">{title}</h3>}
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