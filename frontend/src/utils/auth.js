export const BASE_URL = "https://vskipel-backend.nomoredomains.icu";

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

export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      credentials: 'include',   
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })
    .then((res) => res.ok ? console.log(res) : 'err')
    .catch((err) => console.log(err))
}

// const checkResponse = (res) => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.statusText}`);