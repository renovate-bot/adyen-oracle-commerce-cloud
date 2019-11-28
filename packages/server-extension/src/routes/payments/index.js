import express from 'express'
import getPayment from './getPayment'
import getPaymentDetails from './getPaymentDetails'

const router = express.Router()
router.post('/', getPayment, getPaymentDetails)

export default router
