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
      headers: {
        authorization: this._token,
      },
    }).then(handleOriginalResponse);
  }

  addCard(data) {
    return fetch(`${this._url}/cards/`, {
      method: "POST",
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

  deleteCard(id) {
    return fetch(`${this._url}/cards/${id}`, {
      method: "DELETE",
      headers: {
        authorization: this._token,
      },
    }).then(handleOriginalResponse);
  }


  changeLikeCardStatus(id, isLiked) {
    if (isLiked) {
      return fetch(`${this._url}/cards/likes/${id}`, {
        method: "PUT",
        headers: {
          authorization: this._token,
        },
      }).then(handleOriginalResponse);
    } else {
      return fetch(`${this._url}/cards/likes/${id}`, {
        method: "DELETE",
        headers: {
          authorization: this._token,
        },
      }).then(handleOriginalResponse);
    }
  }

  updateAvatar(link) {
    return fetch(`${this._url}/users/me/avatar`, {
        method: "PATCH",
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
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      headers: {
        authorization: this._token,
      },
    }).then(handleOriginalResponse);
  }

  setProfileInfo(data) {
    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
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
  url: "https://mesto.nomoreparties.co/v1/cohort-18",
  token: "e9b15767-4b50-4f24-9b84-b0128a0d1268",
})

export default api;