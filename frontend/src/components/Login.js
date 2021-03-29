import React, { useState } from 'react'; 
import { useHistory } from 'react-router-dom';
import InfoTooltip from './InfoTooltip.js';


const Login = ( props ) => {
 
  const [ data, setData ] = useState({
    password: '',
    email: ''
  });
 
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.email || !data.password) {
      return;
    }

    props.handleLogin(data.password, data.email, history)
  }



  return (
    <>
    <form className="auth" onSubmit={handleSubmit}>
      <h2 className="auth__title">Вход</h2>
      <input maxLength="40" minLength="2" className="auth__input" type="email" name="email" value={data.email} onChange={handleChange}
        placeholder="Email" required aria-label="электронная почта"/>
      <span className="error" id="email-error"/>
      <input maxLength="40" minLength="2" className="auth__input" type="password" name="password" value={data.password} onChange={handleChange}
        placeholder="Пароль" required aria-label="пароль"/>
      <span className="error" id="password-error"/>
      <button className="auth__button" type="submit" aria-label="Войти">Войти</button>
    </form>
    </>
  );
}

export default Login;