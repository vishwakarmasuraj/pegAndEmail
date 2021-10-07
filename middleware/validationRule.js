const { body } = require('express-validator')
const model = require('../models/employee')

const validationRule = () => {
  return [
    body('role').notEmpty(),
    body('name').notEmpty(),
    body('email')
      .isEmail()
      .notEmpty()
      .custom((value) => {
        return model.findOne({ email: value }).then((data) => {
          if (data) {
            return Promise.reject('Email is already exist')
          }
        })
      }),
    body('password')
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage('Invalid password'),
    body('mobile')
      .notEmpty()
      .isNumeric()
      .withMessage('Mobile number should be number'),
    body('address').notEmpty(),
    body('status').notEmpty(),
  ]
}

module.exports = { validationRule }
