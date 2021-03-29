import React from 'react';

function ImagePopup(props) {



  return (
    <div className={`popup popup_type_image ${props.isOpen ? "popup_opened" : ""}`}>
      <div className="popup__image-container">
        <button className="popup__close-icon_image popup__close-icon" type="button" aria-label="Закрыть" onClick={props.onClose}/>
        <img className="popup__image" src={props.card.link} alt={props.card.name} />
        <p className="popup__subtitle">{props.card.name}</p>
      </div>
     </div>
  );
}

export default ImagePopup;