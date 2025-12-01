const express = require('express');
const authController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// POST /auth/register
router.post('/register', validate.register, asyncHandler(authController.register));

// POST /auth/login
router.post('/login', validate.login, asyncHandler(authController.login));

module.exports = router;
