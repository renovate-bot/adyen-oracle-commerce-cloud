import * as constants from '../constants'
import { eventEmitter } from '../utils'
import { store } from './index'

class Payment {
    constructor() {
        this.startEventListeners()
    }

    startEventListeners = () => {
        eventEmitter.payment.on(constants.setPayment, this.setPayment)
    }

    setPayment = type => {
        eventEmitter.store.emit(constants.isSubmitting, true)
        const order = store.get(constants.order)
        const id = store.get(constants.id)

        const genericPayment = store.get(constants.genericPayment)
        const updatedGenericPayment = { ...genericPayment, id: id() }

        eventEmitter.store.emit(constants.genericPayment, updatedGenericPayment)
        eventEmitter.component.emit(constants.comboCardOptions)

        const payments = [updatedGenericPayment]

        order().updatePayments(payments)

        this.updatePayment(this.createPayment(type))
    }

    updatePayment = pPayment => {
        const order = store.get(constants.order)
        const id = store.get(constants.id)

        const payments = order().payments()
        const setPayments = (payment, index) => {
            const curPayment = payments[index]
            const { id: curId } = curPayment
            const isSameId = curId && curId === id()
            return isSameId ? pPayment : curPayment
        }

        const newPayments = payments.map(setPayments)
        order().payments(newPayments)
    }

    createPayment = type => {
        const storedPaymentType = store.get(constants.storedPaymentType)
        const isPaymentStored = store.get(constants.isPaymentStored)
        const paymentDetails = store.get(constants.paymentDetails)
        const selectedInstallment = store.get(constants.selectedInstallment)
        const selectedComboCard = store.get(constants.selectedComboCard)
        const comboCardOptions = store.get(constants.comboCardOptions)

        const hasInstallments =
            selectedInstallment() &&
            'numberOfInstallments' in selectedInstallment()

        const isCreditCard = selectedComboCard() === constants.comboCards.credit
        const isValidInstallment = hasInstallments && isCreditCard
        const getInstallments = () =>
            isValidInstallment &&
            parseInt(selectedInstallment().numberOfInstallments)

        const storedPayment = isPaymentStored ? storedPaymentType() : ''
        const numberOfInstallments = getInstallments()

        const genericPayment = store.get(constants.genericPayment)
        const updatedGenericPayment = {
            ...genericPayment,
            customProperties: {
                paymentDetails: paymentDetails[type],
                storedPayment,
                ...(numberOfInstallments && { numberOfInstallments }),
                ...comboCardOptions,
            },
        }

        return updatedGenericPayment
    }
}

export default Payment
