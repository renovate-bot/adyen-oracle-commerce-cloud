import { store } from '../index'
import * as constants from '../../constants'
import { Checkout, eventEmitter, getInstallmentOptions } from '../../utils'

export const onBrand = ({ brand }) => {
    eventEmitter.store.emit(constants.selectedBrand, brand)
    const installmentsOptions = store.get(constants.installmentsOptions)
    const cart = store.get(constants.cart)
    const amount = cart().amount()
    const installments = installmentsOptions ? getInstallmentOptions(installmentsOptions, amount, brand) : []

    eventEmitter.store.emit(constants.installments, installments)
}

export const onConfigSuccess = () => eventEmitter.store.emit(constants.isLoaded, true)

const createCardCheckout = () => {
    const checkout = new Checkout(constants.paymentMethodTypes.generic)
    const onChange = checkout.onChange()
    const onSubmit = checkout.onSubmit()

    const storedPaymentType = store.get(constants.storedPaymentType)
    const options = { hasHolderName: false, enableStoreDetails: !!storedPaymentType() }

    const configuration = { onBrand, onConfigSuccess, onChange, onSubmit }
    const checkoutOptions = { configuration, selector: '#adyen-card-payment', type: 'card', options }

    checkout.createCheckout(checkoutOptions, checkout => {
        eventEmitter.store.emit(constants.checkout.card, checkout)
    })
}

export default createCardCheckout
