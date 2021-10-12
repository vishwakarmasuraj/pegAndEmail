const express = require('express')
const router = express.Router()

const validateRule = require('./../middleware/validationRule')
const valid = require('./../middleware/valid')

const employeeControll = require('./../controller/employee')

router.post(
  '/api/add',
  validateRule.validationRule(),
  valid.validate,
  employeeControll.addEmployee,
)

router.get('/api/list', employeeControll.employeeList)

router.post('/api/login', employeeControll.employeeLogin)

// router.get('/api/search', employeeControll.searchByName)

// router.get('/api/page', employeeControll.pageSearching)

router.get('/api/pagination', employeeControll.empPagination)

module.exports = router
