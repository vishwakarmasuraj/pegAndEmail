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

const employeeEvent = async (req, res) => {
  try {
    const aggregate_options = []
    const page = parseInt(req.query.page) || constants.PAGE
    const limit = parseInt(req.query.limit) || limit_

    const options = {
      page,
      limit,
      collation: { locale: 'en' },
      customLabels: {
        totalDocs: 'totalResults',
        docs: 'events',
      },
    }
    let match = {}
    if (req.query.q) {
      match.name = { $regex: req.query.q, $options: 'i' }
    }
    if (req.query.date) {
      let d = moment(req.query.date)
      let next_day = moment(d).add(1, 'days')
      match.start_date = { $gte: new Date(d), $lt: new Date(next_day) }
    }
    aggregate_options.push({ $match: match })
    // successHandler(res, constants.SUCCESS_LOG_MSG,)
    // Grouping

    if (req.query.group !== 'false' && parseInt(req.query) !== 0) {
      let group = {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$start_date' } },
        data: { $push: '$$ROOT' },
      }
      aggregate_options.push({ $group: group })
    }

    // SORTING
    const sortOrder =
      req.query.sort_order && req.query.sort_order === 'desc' ? -1 : 1
    aggregation_options.push({ $sort: { 'data.start_date': sortOrder } })

    const myAggregate = Employee.aggregate(aggregate_options)
    const result = await Employee.find(myAggregate, options)
    successHandler(res, constants.RECORD_FOUND, result)
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
}
