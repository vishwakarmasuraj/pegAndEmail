const Employee = require('../models/employee')
const constants = require('./../constant/employee')
const { successHandler, errorHandler } = require('./../helper/responseHandler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

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

// search by field

// const searchByName = async (req, res) => {
//   try {
//     const result = await Employee.find(req.body)
//     successHandler(res, constants.SUCCESS_SEARCH, result)
//   } catch (error) {
//     console.log(error)
//     errorHandler(res, error)
//   }
// }

const pageSearching = async (req, res) => {
  try {
    let { page, size, sort } = req.query
    if (!page) {
      page = 1
    }
    if (!size) {
      size = 10
    }
    const limit = parseInt(size)
    const user = await Employee.find()
      .search({ name: { $in: name } })
      .limit(limit)
    res.send({
      page,
      size,

      Data: user,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'something went wrong' })
  }
}

const searchByName = async (req, res) => {
  try {
    const page = req.query
    const search = req.query
    if (!page) {
      res.status(402).json({ message: 'page not found' })
    }
    if (!search) {
      res.status(402).json({ message: 'search data not found' })
    }
    const result = await Employee.find(req.query.name)
    res.status(200).json({ message: 'search data found ', result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'something went wrong' })
  }
}

module.exports = {
  addEmployee,
  employeeList,
  employeeLogin,
  searchByName,
  pageSearching,
  searchByName,
}
