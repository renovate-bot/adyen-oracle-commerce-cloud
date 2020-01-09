import $ from 'jquery'
import * as constants from '../constants'
import { eventEmitter } from '../utils'
import { createBoletoCheckout, createCardCheckout, createLocalPaymentCheckout, store } from './index'

class Component {
    constructor() {
        this.startEventListeners()
    }

    startEventListeners = () => {
        eventEmitter.component.on(constants.render, this.render)
        eventEmitter.component.on(constants.comboCardOptions, this.getComboCardOptions)
    }

    getBrand = (brands, brand) => {
        const result = brand in brands ? brands[store.get(constants.selectedBrand)] : store.get(constants.selectedBrand)
        eventEmitter.store.emit(constants.selectedBrand, result)
        return result
    }

    getComboCardOptions = () => {
        const brands = { visa: constants.bins.electron, mc: constants.bins.maestro }
        const selectedComboCard = store.get(constants.selectedComboCard)()
        const isDebitCard = selectedComboCard === constants.comboCards.debit
        const brand = store.get(constants.selectedBrand)
        const selectedBrand = this.getBrand(brands, brand)

        const options = { selectedBrand, additionalData: { overwriteBrand: true } }

        eventEmitter.store.emit(constants.comboCardOptions, isDebitCard ? options : {})
    }

    getOriginKeysSuccessResponse = originKeysRes => {
        const { origin } = window.location
        const cart = store.get(constants.cart)
        const { amount, currencyCode } = cart()

        eventEmitter.store.emit(constants.originKey, originKeysRes.originKeys[origin])
        store.get(constants.ajax)('paymentMethods', this.getPaymentMethods, {
            method: 'post',
            body: { amount: { currency: currencyCode(), value: amount() } },
        })
    }

    render = () => {
        const environment = store.get(constants.environment)
        const href = constants.adyenCssUrl(environment)
        const cssLink = `
            <link rel="stylesheet" href="${href}" />
            <script type="module" src="https://unpkg.com/generic-component@0.0.8/dist/adyen-checkout/adyen-checkout.esm.js"></script>
            <script nomodule src="https://unpkg.com/generic-component@0.0.8/dist/adyen-checkout/adyen-checkout.js"></script>     
        `
        $('head').append(cssLink)

        store.get(constants.ajax)('originKeys', this.getOriginKeysSuccessResponse)
    }

    renderComponent = () => {
        const environment = store.get(constants.environment)
        const locale = store.get(constants.locale)
        const originKey = store.get(constants.originKey)
        const paymentMethodsResponse = JSON.stringify(store.get(constants.paymentMethodsResponse))
        const cart = store.get(constants.cart)
        const { amount, currencyCode } = cart()
        const amountField = JSON.stringify({ value: amount() * 100, currency: currencyCode() })

        const node = document.createElement('template')
        node.innerHTML = `
            <adyen-checkout
              locale="${locale}"
              environment="${environment}"
              origin-key='${originKey}'
              payment-methods='${paymentMethodsResponse}'
              amount='${amountField}'
              show-pay-button
            >
              <div id="adyen-collapse-heading" class="oc-panel panel-1">
                 <div class="collapse-heading">
                    <strong>
                        <span class="collapse-toggle collapsed" data-toggle="collapse" data-target="#adyen-scheme1-wrapper">
                            <button>Pay with Card</button>
                        </span>
                    </strong>
                 </div>
              </div>
              <div id="adyen-scheme1-wrapper" class="adyen-wrapper collapse">
                  <adyen-card installments combo-card></adyen-card>
              </div>
              <div id="adyen-collapse-heading" class="oc-panel panel-1">
                 <div class="collapse-heading">
                    <strong>
                        <span class="collapse-toggle collapsed" data-toggle="collapse" data-target="#adyen-boleto-wrapper">
                            <button>Pay with Boleto</button>
                        </span>
                    </strong>
                 </div>
              </div>
              <div id="adyen-boleto-wrapper" class="adyen-wrapper collapse">
                  <adyen-boleto></adyen-boleto>
              </div>
            </adyen-checkout>
          `
        document.getElementById('adyen-checkout').appendChild(node.content)
        const myComponent = document.querySelector('adyen-checkout')
        const logEvent = ({ detail }) => {
            console.log(detail)
        }
        myComponent.addEventListener('adyenChange', logEvent)
        myComponent.addEventListener('adyenBrand', logEvent)
    }

    getPaymentMethods = paymentMethodsResponse => {
        eventEmitter.store.emit(constants.paymentMethodsResponse, paymentMethodsResponse)
        const environment = store.get(constants.environment)
        const url = constants.adyenCheckoutComponentUrl(environment)

        const createComponents = () => {
            this.renderComponent()
            createCardCheckout(paymentMethodsResponse)
            createLocalPaymentCheckout(paymentMethodsResponse)
            createBoletoCheckout(paymentMethodsResponse)
        }

        $.getScript(url, createComponents)
    }
}

export default Component
