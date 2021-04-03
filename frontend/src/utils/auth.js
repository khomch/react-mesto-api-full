export const BASE_URL = `https://vskipel-backend.nomoredomains.icu`;

export const register = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        "content-type": "application/json",
      },
      credentials: 'include',  
      body: JSON.stringify({
        password,
        email
      })
    })
    .then((res) => res)
    .catch((err) => 'Ошибка: ' + err)
};

export const authorize = (password, email) => {
  return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        "content-type": "application/json",
      },
      credentials: 'include',   
      body: JSON.stringify({
        password,
        email
      })
    })
    .then((res) => res.json())
    .catch((err) => 'Ошибка: ' + err)
};