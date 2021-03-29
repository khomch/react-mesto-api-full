import React from 'react';


function InfoTooltip(props) {
  return (
    // <div className={`popup popup_type_info-tooltip ${props.isOpen ? "popup_opened" : ""}`}>
    <div className={`popup popup_type_info-tooltip ${props.isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <button className="popup__close-icon" type="button" aria-label="Закрыть" onClick={props.onClose}/>
          {props.isAuthOk ? <div className="popup__auth-image popup__auth-image_ok"></div> : <div className="popup__auth-image popup__auth-image_not-ok"></div> }
          {props.isAuthOk ? <p className="popup__auth-text">Вы успешно зарегистрировались!</p> : <p className="popup__auth-text">Что-то пошло не так! Попробуйте еще раз.</p> }
      </div>
    </div>  
   
  );
}

export default InfoTooltip;