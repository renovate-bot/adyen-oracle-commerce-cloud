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

const createLocalComponent = ({ type, name }) => {
    const headingNode = document.createElement('div')
    headingNode.classList.add('collapse-heading')
    headingNode.innerHTML = ` <strong>
        <span
            class="collapse-toggle collapsed"
            data-toggle="collapse"
            data-target="#adyen-${type}-wrapper"
        >
          <button>${name}</button>
        </span>
      </strong>`
    const component = document.createElement('div')
    component.setAttribute('id', `adyen-${type}-wrapper`)
    component.classList.add('adyen-wrapper', 'collapse')

    component.innerHTML = `
        <div class="loader-wrapper hide">
            <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            <div style="font-weight: bold; font-size: 16px;">Processing...</div>
        </div>
        <div id="adyen-${type}-payment" class="adyen-component"></div>
    `
    const adyenNode = document.getElementById('adyen-collapse-heading')
    adyenNode.appendChild(headingNode)
    adyenNode.appendChild(component)
}

const createLocalCheckout = (acc, localPaymentMethod) => {
    const { type } = localPaymentMethod
    const checkout = new Checkout(type)
    const onChange = checkout.onChange()
    const onSubmit = checkout.onSubmit()

    const configuration = { onSubmit, onChange, showPayButton: true }

    createLocalComponent(localPaymentMethod)
    const checkoutOptions = type => ({ configuration, selector: `#adyen-${type}-payment`, type })
    checkout.createCheckout(checkoutOptions(type), checkout => ({ ...acc, [type]: checkout }))
}

const createLocalPaymentCheckout = ({ paymentMethods }) => {
    const localPaymentMethods = paymentMethods.filter(isLocalPaymentMethod)
    const localPaymentMethodsCheckout = localPaymentMethods.reduce(createLocalCheckout, {})

    eventEmitter.store.emit(constants.checkout.local, localPaymentMethodsCheckout)
}

export default createLocalPaymentCheckout
