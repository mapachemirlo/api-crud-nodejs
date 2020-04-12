const express = require('express');
const { isValidHostname, isAuth, isAdmin } = require('../../middlewares/auth')

const usersController = require('../../controllers/v1/users-controller');

const router = express.Router();

router.post('/login', usersController.login);
router.post('/create', usersController.createUsers);
router.post('/update', isValidHostname, isAuth, usersController.updateUsers);
router.post('/delete', isAuth, isAdmin, usersController.deleteUsers);
router.get('/get-all', isAuth, isAdmin, usersController.getUsers);


module.exports = router;
