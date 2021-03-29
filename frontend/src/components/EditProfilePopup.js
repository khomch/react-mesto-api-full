import React from 'react';
import PopupWithForm from './PopupWithForm';
import CurrentUserContext from '../context/CurrentUserContext';

function EditProfilePopup(props){
  // подписываемся на контекст о пользователе хуком 
  const currentUser = React.useContext(CurrentUserContext);

  // стейт для значения инпута
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  // Обработчик изменения инпута обновляет стейт
  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  // После загрузки текущего пользователя из API
  // его данные будут использованы в управляемых компонентах.
  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]); 

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser({
      name: name,
      about: description,
    });
  }


  return (
  <PopupWithForm name={'edit-profile'} title='Редактировать профиль' isOpen={props.isOpen} button="Сохранить" onClose={props.onClose} onSubmit={handleSubmit}> 
    <input maxLength="40" minLength="2" className="popup__item popup__item-name" type="text" name="name" 
      placeholder="Ваше имя" required aria-label="попап форма" onChange={handleNameChange} value={name || ''}/>
    <span className="error" id="name-error"/>
    <input maxLength="200" minLength="2" className="popup__item popup__item-job" type="text" name="job" 
      placeholder="Род деятельности" required aria-label="попап форма" onChange={handleDescriptionChange} value={description || ''}/>
    <span className="error" id="job-error"/>
  </PopupWithForm>)
}


export default EditProfilePopup;