import Widget from '../../../../__mocks__/widget'
import viewModel from '../adyen-checkout'
import { Payment, store } from '../components'
import { eventEmitter } from '../utils'
import * as constants from '../constants'

const paymentDetails = { generic: { data: 'mocked_data' } }
const getPaymentResponse = (type, id) => [
    {
        customProperties: {
            numberOfInstallments: 3,
            paymentDetails: paymentDetails[type],
            storedPayment: undefined,
        },
        id,
        type: 'generic',
    },
]
describe('Payment', () => {
    let widget
    beforeEach(() => {
        widget = new Widget()
    })

    it('should create a payment', function() {
        viewModel.onLoad(widget)

        const payment = new Payment()
        const id = store.get(constants.id)
        const paymentMethodType = constants.paymentMethodTypes.generic
        const paymentResponse = getPaymentResponse(paymentMethodType, id())

        eventEmitter.store.emit(constants.selectedInstallment, {
            numberOfInstallments: 3,
        })
        eventEmitter.store.emit(constants.genericPayment, paymentResponse[0])
        eventEmitter.store.emit(constants.paymentDetails, paymentDetails)
        payment.setPayment(constants.paymentMethodTypes.generic)

        const order = store.get(constants.order)
        expect(order().payments()).toEqual(paymentResponse)
    })
})
