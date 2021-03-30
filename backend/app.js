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
const { isAuthorized } = require('./middlewares/auth.js');

const app = express(); // добавляем экспресс в приложение

const options = {
  origin: [
    'http://localhost:3000',
    'http://vskipel.nomoredomains.icu',
    'https://vskipel.nomoredomains.icu',
  ],
  credentials: true, // эта опция позволяет устанавливать куки
};
app.use('*', cors(options)); // Подключаем первой миддлварой

const PORT = 3001;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => console.log('!!! Connected to DB'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use(requestLogger); // подключаем логгер запросов

app.use('/', authRouter);
app.use('/users', isAuthorized, usersRouter);
app.use('/cards', isAuthorized, cardsRouter);
app.use('/', errorRouter);

app.use(errorLogger); // подключаем логгер ошибок

app.use((err, req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
