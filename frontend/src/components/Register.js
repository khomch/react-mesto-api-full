import React, { useState } from 'react'; 
import { Link, useHistory } from 'react-router-dom';


const Register = (props) => {
 
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
    const { password, email } = data;

    props.handleRegister(password, email, history)
  }




  return (
    <>
    <form className="auth" onSubmit={handleSubmit}>
      <h2 className="auth__title">Регистрация</h2>
      <input maxLength="40" minLength="2" className="auth__input" type="email" name="email" value={data.email} onChange={handleChange}
        placeholder="Email" required aria-label="электронная почта" />
      <span className="error" id="email-error"/>
      <input maxLength="40" minLength="2" className="auth__input" type="password" name="password" value={data.password} onChange={handleChange}
        placeholder="Пароль" required aria-label="пароль"/>
      <span className="error" id="password-error"/>
      <button className="auth__button" type="submit" aria-label="Зарегистрироваться">Зарегистрироваться</button>
      <Link to="/sign-in" className="auth__link">Уже зарегистрированы? Войти</Link>
    </form>


    </>
  );
}

export default Register;