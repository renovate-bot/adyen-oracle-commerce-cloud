import * as constants from '../../constants'
import { Checkout, eventEmitter } from '../../utils'

const unsupportedTypes = ['wechatpayWeb', 'scheme', 'boleto', 'boletobancario']
const createValidator = paymentMethod => {
    return {
        // eslint-disable-next-line complexity
        validate: (key, value) => {
            const hasType = 'type' in paymentMethod
            const isValidType = hasType && !unsupportedTypes.includes(paymentMethod.type)
            const hasDetails = isValidType && 'details' in paymentMethod
            const hasOneItem = hasDetails && paymentMethod.details.length === 1
            const detail = hasOneItem && paymentMethod.details[0]
            const keyIsIssuerAndTypeIsSelect = detail && detail[key] === value
            const isValid = !hasDetails || keyIsIssuerAndTypeIsSelect
            return isValidType && isValid
        },
    }
}

const isLocalPaymentMethod = paymentMethod => {
    const { validate } = createValidator(paymentMethod)
    const keyIsIssuer = validate('key', 'issuer')
    const typeIsSelect = validate('type', 'select')
    const isLocal = keyIsIssuer && typeIsSelect

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
