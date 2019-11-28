import Widget from '../../../../__mocks__/widget'
import viewModel from '../adyen-checkout'

jest.mock('../utils/checkout')
import { presentToShopper } from '../components/boleto'
import { Checkout, createFromAction } from '../utils'
import { createBoletoCheckout } from '../components'

describe('Boleto', () => {
    let widget
    beforeEach(() => {
        widget = new Widget()
    })

    it('should present to shopper', function() {
        const action = { data: 'mocked_custom_property' }
        const options = { action, selector: '#present-shopper' }

        viewModel.onLoad(widget)
        presentToShopper(action)

        expect(createFromAction).toHaveBeenCalledWith(options)
    })

    it('should create boleto checkout', function() {
        Checkout.prototype.createCheckout = jest.fn()
        Checkout.prototype.onChange = jest.fn()
        Checkout.prototype.onSubmit = jest.fn()

        createBoletoCheckout()
        expect(Checkout.prototype.createCheckout).toHaveBeenCalled()
    })
})
