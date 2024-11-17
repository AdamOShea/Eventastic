const { check, validationResult } = require('express-validator');

const validateRegister = [
    check('username')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Username is empty')
        .isString()
        .withMessage('Username must contain letters')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters'),
    check('email')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Email is empty')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email'),
    check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is empty')
        .isLength({ min: 8, max: 20 })
        .withMessage('Password must be between 8 and 20 characters'),
    check('confirmPassword')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Confirm Password is empty')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords did not match');
            }
            return true;
        }),
];

const validateLogin = [
    check('email')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Email is empty')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email'),
    check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is empty'),
];

const userValidation = (req, res, next) => {
    const result = validationResult(req).array();
    if (!result.length) return next();

    const error = result[0].msg;
    res.json({ success: false, message: error });
};

module.exports = {
    validateRegister,
    validateLogin,
    userValidation,
};
