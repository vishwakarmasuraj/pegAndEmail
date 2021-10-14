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
    const sort = {}
    console.log(sort)
    if(req.query.sortBy && req.query.orderBy){
      sort[req.query.sortBy] = req.query.orderBy === 'desc' ? -1 : 1
    }
    // const limitValue = parseInt(req.query.limit) || 2
    const search = req.query.search || ''
    // const skipValue = parseInt(req.query.page) || 0
    const result = await Employee.find({name: { $regex: `${search}`, $options: 'i'}}).sort(sort)
    // .limit(limitValue)
    // .skip(skipValue * limitValue - 1);
    console.log(result);
    successHandler(res, constants.RECORD_FOUND, result);
  } catch (error) {
    console.log(error);
  }
};

const truncateCollection = async (req, res) => {
  try {
    await Employee.remove({})
    successHandler(res, constants.TRUNCATE_SUCCESS)
  } catch (error) {
    console.log(error)
    errorHandler(res)
  }
}

module.exports = {
  addEmployee,
  employeeList,
  employeeLogin,
  employeeEvent,
  truncateCollection,
}
