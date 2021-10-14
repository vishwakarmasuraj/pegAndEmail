const Employee = require('../models/employee')
const constants = require('./../constant/employee')
const { successHandler, errorHandler } = require('./../helper/responseHandler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/**
 *
 * @param {*} req
 * @param {*} res
 */

const addEmployee = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, constants.ROUNDS)
    const employee = await new Employee(req.body)
    await employee.save()
    successHandler(res, constants.ADD_MSG)
  } catch (error) {
    console.log(error)
    errorHandler(res)
  }
}

const employeeList = async (req, res) => {
  try {
    const result = await Employee.find({})
    successHandler(res, constants.LIST_MSG, result)
  } catch (error) {
    console.log(error)
    errorHandler(res)
  }
}

generateToken = (user) => {
  return jwt.sign({ data: user }, constants.TOKEN_SECRET, {
    expiresIn: constants.EXP_HOUR,
  })
}

const employeeLogin = async (req, res) => {
  try {
    let data = await Employee.findOne({ email: req.body.email })
    if (!data) {
      return errorHandler(res, constants.EMAIL_ERR)
    }
    await bcrypt.compare(req.body.password, data.password, (error, match) => {
      if (error) {
        return errorHandler(res, constants.ERR_MSG, error)
      } else if (match) {
        return successHandler(res, constants.SUCCESS_LOG_MSG, {
          token: generateToken(data),
          data,
        })
      } else {
        errorHandler(res, constants.LOGINPASSFAIL)
      }
    })
  } catch (error) {
    console.log(error)
    errorHandler(res)
  }
}

const employeeEvent = async (req, res) => {
  try {
    console.log(req.query)
    const limitValue = parseInt(req.query.limit) || 2
    const search = req.query.search || ''
    const skipValue = parseInt(req.query.page) || 1
    // const result = await Employee.find({ name: { $in: [/`${search}`/] } })
    const result = await Employee.find({
      $regex: req.query.name,
      $options: 'i',
    })
      .limit(limitValue)
      .skip(skipValue * limitValue - 1)
    successHandler(res, constants.RECORD_FOUND, result)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  addEmployee,
  employeeList,
  employeeLogin,
  employeeEvent,
}
