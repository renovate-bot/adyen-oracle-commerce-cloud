import express from 'express'
import getCheckout from '../../utils/checkout'

const router = express.Router()

router.get('/', async function(req, res, next) {
    try {
        const { merchantAccount } = req.app.locals
        const checkout = getCheckout(req)

        const paymentMethodsResponse = await checkout.paymentMethods({
            merchantAccount,
            channel: 'Web',
        })
        res.json(paymentMethodsResponse)
    } catch (e) {
        next(e)
    }
})

export default router
