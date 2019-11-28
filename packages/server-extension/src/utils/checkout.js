import { CheckoutAPI } from '@adyen/api-library'

function getCheckout(req) {
    const { client } = req.app.locals
    const checkout = new CheckoutAPI(client)

    return checkout
}

export default getCheckout
