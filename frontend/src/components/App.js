import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Header from './Header';
import Login from './Login';
import Register from './Register';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import api from '../utils/api';
import CurrentUserContext from '../context/CurrentUserContext';
import EditProfilePopup from '../components/EditProfilePopup';
import EditAvatarPopup from '../components/EditAvatarPopup';
import AddPlacePopup from '../components/AddPlacePopup'
import InfoTooltip from './InfoTooltip.js';
import * as auth from '../utils/auth.js'



function App() {

  // устанавливаем стейты для попапов
  const  [editProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const  [addPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const  [editAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const  [infoTooltipPopupOpen, setInfoTooltipPopupOpen] = React.useState(false);
  const  [authOk, setAuthOk] = React.useState(false);

  // устанавливаем стейты аутентификации

  const [loggedIn, setLoggedIn] = useState(null);
  const [userData, setUserData] = useState({
    email: ''
  });


  const handleSignOut = () => {
    setLoggedIn(false);
    localStorage.removeItem('token');
    setUserData('');

  }

  const handleLogin = (password, email, history) => {
    auth.authorize(password, email)
    .then((data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        setLoggedIn(true);
        history.push('/');
        tokenCheck();
      } else {
        setAuthOk(false);
        setInfoTooltipPopupOpen(true);
        return
      }

      if (data.status === 400){
        throw new Error ('Введены некорректные данные')
      }
    })
    .catch(err => console.log(err)) 
  }

  const handleRegister = (password, email, history) => {
    auth.register(password, email)
    .then((data) => {
    
      if (data.ok) {
        console.log(data)  
        setAuthOk(true);
        history.push("/sign-in");
        setInfoTooltipPopupOpen(true);
      } else {
          setAuthOk(false);
          setInfoTooltipPopupOpen(true);
          return
      }
    })
    .catch(err => console.log(err))
  }  


  const tokenCheck = useCallback(() => {
    const token = localStorage.getItem('token');
    auth.getContent(token)
    .then((res) => {
      if (res === 'err') {
        setLoggedIn(false)
      } 
      else if (res) {
        setUserData(userData => ({
          ...userData,
          email: res.data.email 
        }));
        setLoggedIn(true);
      }
    
    })
    .catch((err) => console.log(err))}, 
    [])

  useEffect(() => {
    tokenCheck();
  }, [tokenCheck])

  // обработчики открытия попапов
  const handleEditAvatarClick = () => {
    setEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = () => {
    setEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick =() => {
    setAddPlacePopupOpen(true);
  }
  // обработчик закрытия попапов
  const closeAllPopups = () => {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    imagePopupIsOpen(false);
    setInfoTooltipPopupOpen(false);
    selectedCardData({});
  }

  
  // стейты для открытия попапов карточек
  const  [selectedCard, selectedCardData] = React.useState({});
  const  [isImagePopupOpen, imagePopupIsOpen] = React.useState(false);

  const handleCardClick = (card) => {
    imagePopupIsOpen(true)
    selectedCardData(card)
  }

  // стейт для определения пользоателя
  const [currentUser, currentUserUpdate] = React.useState({});
  React.useEffect(() => {
    api.getProfileInfo()
      .then(data => {
        currentUserUpdate(data);
      })
      .catch((err) => 'Ошибка: ' + err)
  }, [])

  function handleUpdateUser(data) {
    api.setProfileInfo(data)
      .then(res => {
        currentUserUpdate(res);
        closeAllPopups();
      })
      .catch((err) => 'Ошибка: ' + err);

  }

  function handleUpdateAvatar(link) {
    api.updateAvatar(link)
      .then(res => {
        currentUserUpdate(res);
        closeAllPopups();
      })
      .catch((err) => 'Ошибка: ' + err)
  }

  // получаем инфу о карточках
  const  [cards, setCards] =  React.useState([]);
  
  React.useEffect(() => {
    api.getInitialCards()
      .then(data => {
        setCards(data)})
      .catch((err) => 'Ошибка: ' + err)
      
  }, [])

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(liker => liker._id === currentUser._id);
    
    
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {

    // Формируем новый массив на основе имеющегося, подставляя в него новую карточку
    const newCards = cards.map((oldCard) => {
      if (oldCard._id === card._id) { 
        return newCard
      } 
        else {
          return  oldCard
        }
    });
    
    // Обновляем стейт
    setCards(newCards);
    })
    .catch((err) => 'Ошибка: ' + err)
  } 

  function handleCardDelete(card) {

    // Отправляем запрос в API на удаление карточки
    api.deleteCard(card._id).then(() => {
  
      // Формируем новый массив на основе имеющегося, удаляя из него карточку
      const newCardsReduced = cards.filter((c) => c._id !== card._id);
      
      // Обновляем стейт
      setCards(newCardsReduced);
    })
    .catch((err) => 'Ошибка: ' + err)
  } 

  function handleAddPlaceSubmit(data) {
    api.addCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups(); 
      })
      .catch((err) => 'Ошибка: ' + err)
  }


  if (loggedIn === null) {
    return 'Загрузка'
  }


  return (
    <BrowserRouter>
    <CurrentUserContext.Provider value={currentUser}>

    
        <div className="page">
            <Header handleSignOut={handleSignOut} loggedIn={loggedIn} userData={userData}/>

            <Switch>
              <>
                <InfoTooltip isOpen={infoTooltipPopupOpen} isAuthOk={authOk} onClose={closeAllPopups}/>
                <Route path="/sign-up">
                <Register handleRegister={handleRegister}/>  
                </Route>

            <Route path="/sign-in">
                <Login handleLogin={handleLogin}/>  
                </Route>

            <ProtectedRoute exact path="/" 
                  userData={userData} 
                  loggedIn={loggedIn} 
                  component={() =>  
                    <>
                      <Main
                        onEditAvatar={handleEditAvatarClick} 
                        onAddPlace={handleAddPlaceClick} 
                        onEditProfile={handleEditProfileClick} 
                        onCardClick={handleCardClick} 
                        cards={cards} 
                        onCardLike={handleCardLike}
                        onCardDelete={handleCardDelete} 
                      />

                      <EditProfilePopup 
                        isOpen={editProfilePopupOpen} 
                        onClose={closeAllPopups} 
                        onUpdateUser={handleUpdateUser}/> 

                      <AddPlacePopup 
                        isOpen={addPlacePopupOpen} 
                        onClose={closeAllPopups}
                        onAddPlace={handleAddPlaceSubmit} /> 

                      <EditAvatarPopup 
                        isOpen={editAvatarPopupOpen} 
                        onClose={closeAllPopups} 
                        onUpdateAvatar={handleUpdateAvatar} />
                  
                      <ImagePopup 
                        isOpen={isImagePopupOpen} 
                        onClose={closeAllPopups} 
                        card={selectedCard} />

                    </> }>
                  </ProtectedRoute>   
                  </>
                  </Switch>
            <Footer /> 
        </div>

        </CurrentUserContext.Provider>

    </BrowserRouter>
  );
}

export default App;
