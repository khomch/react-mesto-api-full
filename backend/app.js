require('dotenv').config({ path: './process.env' });

const cors = require('cors');
const express = require('express'); // импортируем экспресс
const bodyParser = require('body-parser'); // подключаем мидлвар для парсинга JSON в body
const mongoose = require('mongoose'); // подключаем mongoose
const path = require('path'); // модуль, чтобы формировать путь до папки
const { requestLogger, errorLogger } = require('./middlewares/logger');
const usersRouter = require('./routes/users.js'); // пользовательский роутер
const cardsRouter = require('./routes/cards.js');
const errorRouter = require('./routes/error.js');
const authRouter = require('./routes/auth.js');
const { auth } = require('./middlewares/auth.js');

const app = express(); // добавляем экспресс в приложение

const options = {
  origin: [
    'http://localhost:3000',
    'https://mesto.khomchenko.com',
    'https://www.mesto.khomchenko.com',
  ],
  credentials: true, // эта опция позволяет устанавливать куки
};
app.use('*', cors(options)); // Подключаем первой миддлварой

const PORT = 3005;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(console.log(`Connected on port ${PORT}`));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use('/', authRouter);
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.use('/', errorRouter);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use((err, req, res, next) => {
  if (err.details !== undefined) {
    const errorBody = err.details.get('body'); // 'details' is a Map()
    const { details: [errorDetails] } = errorBody;
    return res.status(400).send({
      message: errorDetails.message,
    });
  } return next(err);
});

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
