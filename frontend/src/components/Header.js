import { Link, useLocation } from 'react-router-dom';
import logo from '../images/mesto-logo.svg';

function Header(props) {
  const location = useLocation();
  return (

      <header className="header">
        <img src={logo} alt="Место - логотип сайта" className="logo"/> 
        <div className="header__user-menu">
          {props.loggedIn ? <p className="header__user-email">{props.userData.email}</p> : "" }
          {props.loggedIn ? <button className="header__button header__button_exit" onClick={props.handleSignOut}>Выйти</button> : "" }
          {location.pathname === "/signup" ? <Link className="header__button" to="/signin">Войти</Link> : ""}
          {location.pathname === "/signin" ? <Link className="header__button" to="/signup">Зарегистрироваться</Link> : ""}
        </div>
        </header>
  );
}

export default Header;