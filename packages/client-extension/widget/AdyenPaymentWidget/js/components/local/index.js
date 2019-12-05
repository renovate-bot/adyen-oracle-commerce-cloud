import * as constants from '../../constants'
import { Checkout, eventEmitter } from '../../utils'

const hasType = paymentMethod => 'type' in paymentMethod
const isNotScheme = paymentMethod => hasType(paymentMethod) && paymentMethod.type !== 'scheme'
const hasDetails = paymentMethod => isNotScheme(paymentMethod) && 'details' in paymentMethod
const hasOneItem = paymentMethod => hasDetails(paymentMethod) && paymentMethod.details.length === 1
const getDetail = paymentMethod => hasOneItem(paymentMethod) && paymentMethod.details[0]
const isValid = (paymentMethod, key, value) => getDetail(paymentMethod) && getDetail(paymentMethod)[key] === value

const isLocalPaymentMethod = paymentMethod => {
    const isIssuer = isValid(paymentMethod, 'key', 'issuer')
    const isSelect = isValid(paymentMethod, 'type', 'select')
    const isLocal = isIssuer && isSelect

    return isLocal
}

const createLocalCheckout = (acc, localPaymentMethod) => {
    const { type } = localPaymentMethod
    const checkout = new Checkout(type)
    const onChange = checkout.onChange()
    const onSubmit = checkout.onSubmit()

    const configuration = { onSubmit, onChange, showPayButton: true }

    const checkoutOptions = type => ({ configuration, selector: `#adyen-${type}-payment`, type })
    checkout.createCheckout(checkoutOptions(type), checkout => ({ ...acc, [type]: checkout }))
}

const createLocalPaymentCheckout = ({ paymentMethods }) => {
    const localPaymentMethods = paymentMethods.filter(isLocalPaymentMethod)
    eventEmitter.store.emit(constants.localPaymentMethods, localPaymentMethods)
    const localPaymentMethodsCheckout = localPaymentMethods.reduce(createLocalCheckout, {})

    eventEmitter.store.emit(constants.checkout.local, localPaymentMethodsCheckout)
}

export default createLocalPaymentCheckout
