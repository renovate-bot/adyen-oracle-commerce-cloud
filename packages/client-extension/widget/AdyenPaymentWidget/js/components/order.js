import $ from 'jquery'
import ccRestClient from 'ccRestClient'
import ccConstants from 'ccConstants'
import storageApi from 'storageApi'
import pubsub from 'pubsub'
import {
    redirectAuth,
    createSpinner,
    getOrderPayload,
    eventEmitter,
} from '../utils'
import * as constants from '../constants'
import { store } from './index'

class Order {
    constructor() {
        this.instance = storageApi.getInstance()

        this.startEventListeners()
    }

    startEventListeners = () => {
        eventEmitter.order.on(
            constants.pageChanged,
            this.getUrlParametersAndCreateOrder
        )
        eventEmitter.order.on(
            constants.initialOrderCreated,
            this.initialOrderCreated
        )
    }

    initialOrderCreated = orderEvent => {
        const order = store.get(constants.order)
        const {
            customPaymentProperties: { data, resultCode },
        } = orderEvent.order.payments[0]

        const payload = {
            order: getOrderPayload(order),
            customPaymentProperties: JSON.parse(data),
            resultCode,
        }

        eventEmitter.store.emit(constants.orderPayload, payload)
        const isDone = store.get(constants.isDone)
        !isDone() && redirectAuth(payload, this.createOrder)
    }

    getAndCreatOrder = result => {
        result.paymentData = this.instance.getItem(
            constants.storage.paymentData
        )

        const payment = { type: 'generic', customProperties: result }

        this.recreateOrder(payment)
    }

    createOrder = orderPayload => {
        const translate = store.get(constants.translate)
        const orderFail = ({ message = 'Failed to create order' } = {}) => {
            $.Topic(pubsub.topicNames.ORDER_SUBMISSION_FAIL).publish({
                message: 'fail',
                errorMessage: message,
            })
        }

        const submitOrder = ({ id, uuid }) => {
            const publishData = { message: 'success', id, uuid }
            $.Topic(pubsub.topicNames.ORDER_COMPLETED).publish(publishData)
            $.Topic(pubsub.topicNames.ORDER_SUBMISSION_SUCCESS).publish([
                publishData,
            ])
        }

        const orderSuccess = data => {
            const { paymentState } = data.payments[0]
            const isAuthorized =
                paymentState === ccConstants.PAYMENT_GROUP_STATE_AUTHORIZED
            const message = translate(
                constants.errorMessages.failed3dsValidation
            )
            isAuthorized ? submitOrder(data) : orderFail({ message })
        }

        ccRestClient.request(
            ccConstants.ENDPOINT_ORDERS_CREATE_ORDER,
            orderPayload,
            orderSuccess,
            orderFail
        )
    }

    recreateOrder = paymentData => {
        const storedOrder = JSON.parse(
            this.instance.getItem(constants.storage.order)
        )
        storedOrder.payments = [paymentData]

        eventEmitter.store.emit(constants.isDone, true)
        this.createOrder(storedOrder)
    }

    getResult = urlParameters => {
        const params = urlParameters.split('&')
        const formatResult = (acc, param) => {
            const [key, value] = param.split('=')
            return { ...acc, [key]: decodeURIComponent(value) }
        }

        return params.reduce(formatResult, {})
    }

    getUrlParametersAndCreateOrder = pageData => {
        const order = store.get(constants.order)
        const { parameters } = pageData

        if (parameters) {
            createSpinner()

            const parametersObj = this.getResult(parameters)

            if (order().paymentGateway()) {
                order().paymentGateway().type = ''
            }

            this.isAction = 'PaRes' in parametersObj && 'MD' in parametersObj
            this.isAction && this.getAndCreatOrder(parametersObj)
        }
    }
}

export default Order
