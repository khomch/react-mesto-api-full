const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET_KEY } = process.env;

const generateSign = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev-secret', { expiresIn: '7d' });

function auth (req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev-secret');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};



// const User = require('../models/user');

// const generateSign = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev-secret', { expiresIn: '7d' });

// function isAuthorized(req, res, next) {
//   const token = req.headers.authorization;

//   if (!token) {
//     res.status(401).send({ message: 'Требуется авторизация' });
//   }

//   try {
//     const payload = jwt.verify(token, JWT_SECRET_KEY);
//     User.findOne({ _id: payload._id })
//       .then((admin) => {
//         if (!admin) {
//           res.status(404).send({ message: 'Пользователь не существует' });
//         }
//         next();
//       })

//       .catch((err) => {
//         res.status(500).send({ message: `Ошибка сервера: ${err}` });
//       });
//   } catch (err) {
//     res.status(403).send({ message: `Нет доступа: ${err}` });
//   }
// }

module.exports = {
  auth,
  generateSign,
  // isAuthorized
};
