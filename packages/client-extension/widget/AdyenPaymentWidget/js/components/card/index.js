import { store } from '../index'
import * as constants from '../../constants'
import { Checkout, eventEmitter } from '../../utils'

export const onBrand = ({ brand }) => {
    eventEmitter.store.emit(constants.selectedBrand, brand)
}

export const onConfigSuccess = () => eventEmitter.store.emit(constants.isLoaded, true)

const createCardCheckout = ({ paymentMethods }) => {
    const [card] = paymentMethods.filter((paymentMethod) => paymentMethod.type === constants.paymentMethodTypes.scheme)

    if (card) {
        eventEmitter.store.emit(constants.paymentMethodTypes.scheme, true)
        const { brands } = card
        const checkout = new Checkout(constants.paymentMethodTypes.scheme)
        const onChange = checkout.onChange()
        const onSubmit = checkout.onSubmit()
        const storedPaymentType = store.get(constants.storedPaymentType)
        const installments = store.get(constants.installments)

        const options = {
            installments: installments(),
            hasHolderName: store.get(constants.holderNameEnabled),
            enableStoreDetails: !!storedPaymentType(),
            brands,
        }

        const configuration = { onBrand, onConfigSuccess, onChange, onSubmit }
        const checkoutOptions = { configuration, selector: '#adyen-card-payment', type: 'card', options }

        checkout.createCheckout(checkoutOptions, (checkout) => {
            eventEmitter.store.emit(constants.checkout.card, checkout)
        })
    }
}

export default createCardCheckout
