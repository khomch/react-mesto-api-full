export const BASE_URL = `${window.location.protocol}${process.env.REACT_APP_API_URL || '//localhost:3001'}`;

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
    .catch((err) => console.log(err))
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
    .catch((err) => console.log(err))
};