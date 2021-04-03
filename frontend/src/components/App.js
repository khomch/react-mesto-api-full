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

  // стейт для определения пользоателя
  const [currentUser, currentUserUpdate] = React.useState({});

  // получаем инфу о карточках
  const  [cards, setCards] =  React.useState([]);
  
  const proceedSignIn = React.useCallback(() => { 
    if (loggedIn === true) {
      api.getProfileInfo()
      .then(data => {
        currentUserUpdate(data);
        setUserData(userData => ({
          ...userData,
          email: data.email 
        }));
      })
      .catch((err) => 'Ошибка: ' + err)
      
      api.getInitialCards()
        .then(data => {
          setCards(data)})
        .catch((err) => 'Ошибка: ' + err)
    }

  }, 
  [loggedIn]);
    
  const proceedSignOut = React.useCallback(() => {
    setUserData(setLoggedIn(false)); 
    setCards([]); }, 
  []);

  React.useEffect(() => { 
    loggedIn 
    ? proceedSignIn() 
    :  proceedSignIn();
    }, 
  [loggedIn, proceedSignIn, proceedSignOut]);


  const tokenCheck = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      proceedSignOut()
    } else {
      setLoggedIn(true)
    }
  }

  useEffect(() => {
    tokenCheck();
  }, [])

  const handleSignOut = () => {
    setLoggedIn(false);
    localStorage.removeItem('token');
    setUserData('');
  }

  const handleLogin = (password, email, history) => {
    auth.authorize(password, email)
    .then((data) => {
      if (!data.token) {
        setAuthOk(false);
        setInfoTooltipPopupOpen(true);
        return
      }
      if (data.token) {
        history.push('/');
        localStorage.setItem('token', data.token);
        setLoggedIn(true);
        proceedSignIn();
        tokenCheck();
      }
      if (data.status === 400){
        throw new Error ('Введены некорректные данные')
      }
    })
    .catch(err => 'Ошибка: ' + err) 
  }

  const handleRegister = (password, email, history) => {
    auth.register(password, email)
    .then((data) => {
      if (data.ok) {
        setAuthOk(true);
        history.push("/signin");
        setInfoTooltipPopupOpen(true);
      } else {
          setAuthOk(false);
          setInfoTooltipPopupOpen(true);
          return
      }
    })
    .catch(err => 'Ошибка: ' + err)
  }  

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

  function handleCardLike(card) {

    const token = localStorage.getItem('token');

    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(liker => liker === currentUser._id);    

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked, token).then((newCard) => {

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
    const token = localStorage.getItem('token');

    // Отправляем запрос в API на удаление карточки
    api.deleteCard(card._id, token).then(() => {
  
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
            <Header handleSignOut={handleSignOut} loggedIn={loggedIn} userData={currentUser}/>

            <Switch>
              <>
                <InfoTooltip isOpen={infoTooltipPopupOpen} isAuthOk={authOk} onClose={closeAllPopups}/>
                <Route path="/signup">
                <Register handleRegister={handleRegister}/>  
                </Route>

            <Route path="/signin">
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
