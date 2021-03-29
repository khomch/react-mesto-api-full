import React from 'react';
import CurrentUserContext from '../context/CurrentUserContext'


function Card(props) {
  // подписываемся на контекст о пользователе хуком 
  const currentUser = React.useContext(CurrentUserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = props.owner._id === currentUser._id;

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = (
    `card__button-delete ${isOwn ? 'card__button-delete_visible' : ''}`
  ); 

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = props.likes.some(i => i._id === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = (
    `card__button-like ${isLiked ? 'card__button-like_active' : 'card__button-like'}`
  ); ; 
  
  function handleClick() {
    props.onCardClick(props);
  } 

  function handleLikeClick() {
    props.onCardLike(props);
  } 

  function handleDeleteClick() {
    props.onCardDelete(props);
  }   

  return (
    <li className="card">
      <button className={cardDeleteButtonClassName} type="button" aria-label="Удалить" onClick={handleDeleteClick}></button>
      <img className="card__image" src={props.link} alt={props.name} onClick={handleClick}/>
      <div className="card__elements">
        <h2 className="card__title">{props.name}</h2>
        <button className={cardLikeButtonClassName} type="button" aria-label="Лайк" onClick={handleLikeClick}></button>
        <div className="card__button-likes-counter">{props.likes.length}</div>
      </div>
    </li>
  );
}

export default Card;
