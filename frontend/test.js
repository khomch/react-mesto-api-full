function getProperty(obj, path) {
  console.log(obj.path)
}

const object = {
  one: 1,
  two: {
    three: 3
  },
  four: 4
};

getProperty(object, 'one'); // 1
getProperty(object, 'two.three'); // 3 