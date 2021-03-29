import React from 'react';
import PopupWithForm from './PopupWithForm';


function AddPlacePopup(props){

  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');

  function handleNameChange(e) {
    setName(e.target.value)
  }
  
  function handleLinkChange(e) {
    setLink(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onAddPlace({
      name: name,
      link: link
    });
  }

  return (
    <PopupWithForm name={'add-card'} title='Новое место' button="Создать"
      isOpen={props.isOpen} 
      onClose={props.onClose}
      onSubmit={handleSubmit} >
      <input onChange={handleNameChange} maxLength="30" minLength="1" className="popup__item popup__item-place" type="text" name="name" 
        placeholder="Название" required aria-label="попап форма" />
      <span className="error" id="name-error"/>
      <input onChange={handleLinkChange} className="popup__item popup__item-link" type="url" name="link" placeholder="Ссылка на картинку"
        required aria-label="попап форма" />
      <span className="error" id="link-error"/>
    </PopupWithForm>
  )
}


export default AddPlacePopup;