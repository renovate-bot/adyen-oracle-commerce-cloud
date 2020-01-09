import ccConstants from 'ccConstants'
import { store } from '../components'
import * as constants from '../constants'
import { eventEmitter } from './index'

export const getDefaultConfig = () => {
    const environment = store.get(constants.environment)
    const locale = store.get(constants.locale)
    const originKey = store.get(constants.originKey)
    const paymentMethodsResponse = store.get(constants.paymentMethodsResponse)

    return {
        showPayButton: true,
        locale,
        environment: environment.toLowerCase(),
        originKey,
        paymentMethodsResponse,
    }
}

export const createFromAction = ({ action, selector, checkoutComponent }) => {
    checkoutComponent.createFromAction(action).mount(selector)
}

class Checkout {
    constructor(type) {
        this.type = type
    }

    createCheckout = ({ configuration, selector, type, options = {} }, cb) => {
        const defaultConfiguration = getDefaultConfig()
        // eslint-disable-next-line no-undef
        const checkout = new AdyenCheckout({
            ...defaultConfiguration,
            ...configuration,
            onAdditionalDetails: this.onAdditionalDetails,
        })
        checkout.create(type, options).mount(selector)

        cb(checkout)
    }

    onAdditionalDetails = (state, component) => {
        console.log('addionalDetails', { state, component })
    }

    onSubmit = () => () => {
        const loader = document.querySelector(`#adyen-${this.type}-wrapper .loader-wrapper`)
        loader && loader.classList.toggle('hide', false)

        const order = store.get(constants.order)
        eventEmitter.payment.emit(constants.setPayment, this.type)

        order().id(null)
        order().op(ccConstants.ORDER_OP_INITIATE)
        order().handlePlaceOrder()
    }

    onChange = options => (state, component) => {
        const paymentDetails = store.get(constants.paymentDetails)
        const isValid = component.isValid && typeof state.data === 'object'
        eventEmitter.store.emit(constants.isValid, isValid)

        const payload = { ...paymentDetails, [this.type]: { ...state.data, ...options } }

        eventEmitter.store.emit(constants.paymentDetails, payload)
    }
}

export default Checkout
