import express from 'express'
import payments from './payments/index'
import paymentMethods from './paymentMethods/index'
import originKeys from './originKeys/index'
import cache from '../helpers/serverCache'
import clearCache from './clearCache/index'

const router = express.Router()
const oneWeek = 604800
const oneDay = 86400

router.use('/v1/payments', payments)
router.use('/v1/paymentMethods', cache(oneWeek), paymentMethods)
router.use('/v1/originKeys', cache(oneDay), originKeys)
router.use('/v1/clearCache', clearCache)

const adyenRouter = router.use('/adyen', router)

export default adyenRouter
