const handleOriginalResponse = (res) => {
  if (!res.ok) {
    return Promise.reject(`Error: ${res.status}`);
  }
  return res.json();
}

export class Api {
  constructor(config) {
    this._url = config.url;
  }

  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      method: "GET",
      credentials: 'include',   
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(handleOriginalResponse);
  }

  addCard(data) {
    return fetch(`${this._url}/cards/`, {
      method: "POST",
      credentials: 'include',   
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
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
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(handleOriginalResponse);
  }

  changeLikeCardStatus(id, isLiked, token) {
    if (isLiked) {
      return fetch(`${this._url}/cards/${id}/likes/`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(handleOriginalResponse);
    } else {
      return fetch(`${this._url}/cards/${id}/likes/`, {
        method: "DELETE",
        credentials: 'include',   
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(handleOriginalResponse);
    }
  }

  updateAvatar(link) {
    return fetch(`${this._url}/users/me/avatar`, {
        method: "PATCH",
        credentials: 'include',   
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          avatar: link.avatar,
        }),
      })
      .then(handleOriginalResponse);
  }


  getProfileInfo() {
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      credentials: 'include',   
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
    }).then(handleOriginalResponse);
  }

  setProfileInfo(data) {
    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
      credentials: 'include',   
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
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
  url: `${window.location.protocol}${process.env.REACT_APP_API_URL || '//localhost:3001'}`,
  token: localStorage.getItem('token'),
})

export default api;