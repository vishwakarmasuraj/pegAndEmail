const express = require('express')
const router = express.Router()

const validateRule = require('./../middleware/validationRule')
const valid = require('./../middleware/valid')

const employeeControll = require('./../controller/employee')

router.post(
  '/add',
  validateRule.validationRule(),
  valid.validate,
  employeeControll.addEmployee,
)

router.get('/list', employeeControll.employeeList)

router.post(
  '/login',
  // validateRule.validationRule(),
  // valid.validate,
  employeeControll.employeeLogin,
)

module.exports = router
