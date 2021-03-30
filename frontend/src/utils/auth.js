export const BASE_URL = '//localhost:3001';

export const register = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',  
      body: JSON.stringify({
        password,
        email
      })
    })
    .then((res) => res)
    .catch((err) => console.log(err))
};

export const authorize = (password, email) => {
  return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',   
      body: JSON.stringify({
        password,
        email
      })
    })
    .then((res) => res.json())
    .catch((err) => console.log(err))
};

export const getContent = () => {
  const token = localStorage.getItem('token');
  return fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      credentials: 'include',   
      headers: {
        "content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    .then((res) => res.ok ? res : 'err')
    .catch((err) => console.log(err))
}

// const checkResponse = (res) => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.statusText}`);