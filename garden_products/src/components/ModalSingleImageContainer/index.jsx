import React from 'react';
import s from "./index.module.css";

export default function ModalSingleImageContainer({ isOpen, onClose, image }) {
  if (!isOpen) return null 
  return (
    <div className={s.modal_overlay} onClick={onClose}>
      <div className={s.modal_content} onClick={(el) => el.stopPropagation()}>
        <img src={image} alt="Product" className={s.image} />
      </div>
    </div>
  )
}





