import { Checkout } from '../../utils'
import * as constants from '../../constants'

const createStoredCards = () => {
    const checkout = new Checkout(constants.paymentMethodTypes.scheme)
    checkout.createStoredCardCheckout()
}

export default createStoredCards
