const router = require('express').Router();

const { getAboutUser, patchUpdateUser } = require('../controllers/users');
const { patchUserMe } = require('../utils/userValidation');

router.get('/users/me', getAboutUser);

router.patch('/users/me', patchUserMe, patchUpdateUser);

module.exports = router;
