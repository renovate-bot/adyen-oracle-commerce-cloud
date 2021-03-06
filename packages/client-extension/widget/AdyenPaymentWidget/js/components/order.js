import $ from 'jquery'
import ccRestClient from 'ccRestClient'
import ccConstants from 'ccConstants'
import storageApi from 'storageApi'
import pubsub from 'pubsub'
import { redirectAuth, createSpinner, getOrderPayload, eventEmitter } from '../utils'
import * as constants from '../constants'
import { store } from './index'

class Order {
    constructor() {
        this.instance = storageApi.getInstance()

        this.startEventListeners()
    }

    startEventListeners = () => {
        eventEmitter.order.on(constants.pageChanged, this.getUrlParametersAndCreateOrder)
        eventEmitter.order.on(constants.initialOrderCreated, this.initialOrderCreated)
    }

    parseProperties = (properties) => {
        const parseProperty = (acc, [key, value]) => ({ ...acc, [key]: JSON.parse(value) })
        return Object.entries(properties).reduce(parseProperty, {})
    }
    initialOrderCreated = (orderEvent) => {
        const order = store.get(constants.order)
        const { customPaymentProperties } = this.getCustomProperties(orderEvent.order)

        const payload = {
            order: getOrderPayload(order),
            customPaymentProperties: this.parseProperties(customPaymentProperties),
            resultCode: customPaymentProperties.resultCode,
        }

        eventEmitter.store.emit(constants.orderPayload, payload)
        const isDone = store.get(constants.isDone)
        !isDone() && redirectAuth(payload, this.createOrder)
    }

    getAndCreateOrder = (details) => {
        const paymentData = this.instance.getItem(constants.storage.paymentData)

        const payment = {
            type: 'generic',
            customProperties: { details, paymentData },
        }

        this.recreateOrder(payment)
    }

    createOrder = (orderPayload) => {
        const orderFail = ({ message = 'Failed to create order' } = {}) => {
            $.Topic(pubsub.topicNames.ORDER_SUBMISSION_FAIL).publish({ message: 'fail', errorMessage: message })
        }

        const completeOrder = ({ id, uuid }) => {
            eventEmitter.store.emit(constants.isDone, true)
            const publishData = { message: 'success', id, uuid }
            $.Topic(pubsub.topicNames.ORDER_COMPLETED).publish(publishData)
            $.Topic(pubsub.topicNames.ORDER_SUBMISSION_SUCCESS).publish([publishData])
        }

        const submitOrder = (data) => {
            const orderIsCompleted = orderPayload.op === 'complete'
            const completedPayload = { ...orderPayload, op: 'complete' }
            return orderIsCompleted ? completeOrder(data) : this.createOrder(completedPayload)
        }

        const orderSuccess = (data) => {
            const { paymentState, message } = data.payments[0]
            const { PAYMENT_GROUP_STATE_AUTHORIZED, PAYMENT_GROUP_STATE_INITIAL } = ccConstants
            const validPaymentGroups = [PAYMENT_GROUP_STATE_AUTHORIZED, PAYMENT_GROUP_STATE_INITIAL]
            const isValid = validPaymentGroups.includes(paymentState)
            return isValid ? submitOrder(data) : orderFail({ message, data })
        }

        ccRestClient.request(ccConstants.ENDPOINT_ORDERS_CREATE_ORDER, orderPayload, orderSuccess, orderFail)
    }

    recreateOrder = (paymentData) => {
        const storedOrder = JSON.parse(this.instance.getItem(constants.storage.order))
        storedOrder.payments = [paymentData]
        this.createOrder(storedOrder)
    }

    getResult = (urlParameters) => {
        const details = JSON.parse(this.instance.getItem(constants.storage.details) || '[]')

        const params = urlParameters.split('&')
        const formatResult = (acc, param) => {
            const [key, value] = param.split('=')
            const useParam = Array.isArray(details) ? details.some(({ key: detailKey }) => detailKey === key) : true
            return useParam ? { ...acc, [key]: decodeURIComponent(value) } : acc
        }

        return params.reduce(formatResult, {})
    }

    getUrlParametersAndCreateOrder = (pageData) => {
        const order = store.get(constants.order)
        const { parameters } = pageData

        if (parameters) {
            createSpinner()

            const parametersObj = this.getResult(parameters)

            this.cleanPaymentGatewayType(order)
            this.setAction(parametersObj)
        }
    }

    cleanPaymentGatewayType = (order) => {
        if (order().paymentGateway()) {
            order().paymentGateway().type = ''
        }
    }

    getCustomProperties(data) {
        return data.payments[0]
    }

    setAction(parametersObj) {
        this.isAction = this.hasParameters(parametersObj)
        this.isAction && this.getAndCreateOrder(parametersObj)
    }
    checkIf3ds = (parametersObj) => 'PaRes' in parametersObj && 'MD' in parametersObj
    checkIfLocal = (parametersObj) => 'payload' in parametersObj
    hasParameters = (parametersObj) => {
        const is3DS = this.checkIf3ds(parametersObj)
        const isLocal = this.checkIfLocal(parametersObj)
        const hasDetails = is3DS || isLocal
        return hasDetails
    }
}

export default Order
