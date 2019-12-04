import getCheckout from '../../utils/checkout'

export default async (req, res, next) => {
    const { customProperties } = req.body
    const checkout = getCheckout(req)

    const { paymentData, ...details } = customProperties
    try {
        const body = { paymentData, details }

        const paymentResponse = await checkout.paymentsDetails(body)

        const isSuccess = paymentResponse.resultCode.toString() === 'Authorised'
        const response = {
            amount: req.body.amount,
            hostTimestamp: new Date().toISOString(),
            paymentId: req.body.paymentId,
            additionalProperties: {
                data: JSON.stringify(paymentResponse.additionalData),
                resultCode: paymentResponse.resultCode,
            },
            externalProperties: ['data', 'resultCode'],
            merchantTransactionId: paymentResponse.pspReference,
            response: { success: isSuccess },
            orderId: customProperties.orderId,
            transactionType: req.body.transactionType,
        }

        res.json(response)
    } catch (e) {
        next(e)
    }
}
