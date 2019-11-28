import * as constants from '../constants'
import Widget from '../../../../__mocks__/widget'
import viewModel from '../adyen-checkout'

jest.mock('../utils/checkout')
jest.mock('../utils/getInstallmentOptions')
import { Checkout, eventEmitter, getInstallmentOptions } from '../utils'
import { createCardCheckout, store } from '../components'
import { onBrand } from '../components/card'

describe('Card', () => {
    let widget
    beforeEach(() => {
        widget = new Widget()
    })

    it('should create card checkout', function() {
        viewModel.onLoad(widget)

        Checkout.prototype.createCheckout = jest.fn()
        Checkout.prototype.onChange = jest.fn()
        Checkout.prototype.onSubmit = jest.fn()

        createCardCheckout()
        expect(Checkout.prototype.createCheckout).toHaveBeenCalled()
    })

    it('should set brand', function() {
        const brand = 'visa'
        onBrand({ brand })
        const selectedBrand = store.get(constants.selectedBrand)
        const installments = store.get(constants.installments)

        expect(selectedBrand).toEqual(brand)
        expect(installments()).toEqual([])
    })

    it('should set brand with installments', function() {
        const brand = 'visa'
        eventEmitter.store.emit(
            constants.installmentsOptions,
            'mocked_installments_options'
        )
        onBrand({ brand })

        const expected = ['mocked_installments_options', '1000', 'visa']
        expect(getInstallmentOptions).toHaveBeenCalledWith(...expected)
    })
})
