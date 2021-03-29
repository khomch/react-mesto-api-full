const mongoose = require('mongoose'); // подключаем mongoose
const validator = require('validator');
const defaultAvatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';
const defaultName = 'Жак-Ив Кусто';
const defaultAbout = 'Исследователь';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: defaultName
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: defaultAbout
  },
  avatar: {
    type: String,
    validate: {
      validator: (avatar) => /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!]))?/.test(avatar),
      message: (props) => `${props.value} — некорректная ссылка`,
    },
    default: defaultAvatar,
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: (props) => `${props.value} — не имейл`,
    },
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false,
  }
});

module.exports = mongoose.model('user', userSchema);
