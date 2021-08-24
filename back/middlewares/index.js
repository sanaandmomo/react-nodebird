const isLoggedIn = require('./isLoggedIn');
const isNotLoggedIn = require('./isNotLoggedIn');
const isExistPost = require('./isExistPost');

const middlewares = { isLoggedIn, isNotLoggedIn, isExistPost };

module.exports = middlewares;