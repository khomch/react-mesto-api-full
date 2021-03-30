const handleOriginalResponse = (res) => {
  if (!res.ok) {
    return Promise.reject(`Error: ${res.status}`);
  }
  return res.json();
}

export class Api {
  constructor(config) {
    this._url = config.url;
    this._token = config.token;

  }

  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      method: "GET",
      credentials: 'include',   
      headers: {
        authorization: this._token,
      },
    }).then(handleOriginalResponse);
  }

  addCard(data) {
    return fetch(`${this._url}/cards/`, {
      method: "POST",
      credentials: 'include',   
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        name: data.name,
        link: data.link,
      })
    }).then(handleOriginalResponse);
  }

  deleteCard(id, token) {
    return fetch(`${this._url}/cards/${id}`, {
      method: "DELETE",
      headers: {
        authorization: token,
      },
    }).then(handleOriginalResponse);
  }


  changeLikeCardStatus(id, isLiked, token) {
    if (isLiked) {
      console.log(isLiked)
      return fetch(`${this._url}/cards/${id}/likes/`, {
        method: "PUT",
        headers: {
          authorization: token,
        },
      }).then(handleOriginalResponse);
    } else {
      return fetch(`${this._url}/cards/${id}/likes/`, {
        method: "DELETE",
        credentials: 'include',   
        headers: {
          authorization: token,
        },
      }).then(handleOriginalResponse);
    }
  }

  updateAvatar(link) {
    return fetch(`${this._url}/users/me/avatar`, {
        method: "PATCH",
        credentials: 'include',   
        headers: {
          authorization: this._token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          avatar: link.avatar,
        }),
      })
      .then(handleOriginalResponse);
  }


  getProfileInfo() {
    const token = localStorage.getItem('token');
    console.log(token)
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      credentials: 'include',   
      headers: {
        authorization: token,
      },
    }).then(handleOriginalResponse);
  }

  setProfileInfo(data) {
    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
      credentials: 'include',   
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    }).then(handleOriginalResponse);
  }
}

const api = new Api({
  url: "https://vskipel-backend.nomoredomains.icu",
  // url: "http://localhost:3001",
  token: localStorage.getItem('token'),
})

export default api;