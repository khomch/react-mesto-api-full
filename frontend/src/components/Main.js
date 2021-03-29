import React from 'react';
import Card from './Card';
import CurrentUserContext from '../context/CurrentUserContext'


function Main(props) {
  // подписываемся на контекст о пользователе хуком 
  const currentUser = React.useContext(CurrentUserContext);



  return (
    <>
    <main className="main">

      <section className="profile">
        <img src={currentUser.avatar} alt="аватар" className="profile__avatar"></img> 
        <div className="profile__avatar-edit" onClick={props.onEditAvatar}></div>
        <div className="profile-info">
          <h1 className="profile-info__title">{currentUser.name}</h1>
          <button type="button" className="edit-button" onClick={props.onEditProfile}/>
          <p className="profile-info__subtitle">{currentUser.about}</p>
        </div>
        <button type="button" className="add-button" onClick={props.onAddPlace}/>
      </section>

      <ul className="cards">
        {
          props.cards.map((card) => (<Card 
            key={card._id} 
            _id={card._id} 
            name={card.name} 
            link={card.link} 
            likes={card.likes} 
            owner={card.owner} 
            onCardClick={props.onCardClick} 
            onCardLike={props.onCardLike} 
            onCardDelete={props.onCardDelete}/>))
        }
      </ul>
    </main>

    </>
  );
}

export default Main;