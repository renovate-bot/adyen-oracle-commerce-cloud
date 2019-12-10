import PaymentPage from '../modules/PaymentPage'
import User from '../modules/User'
import config from '../config'
import { Selector } from 'testcafe'

const { adminUser } = config
const { username, password } = adminUser
const user = new User(adminUser)
const paymentPage = new PaymentPage(user)

fixture`Oracle frontend logged in user card payments`
    .page(config.storeFrontURL)
    .httpAuth({ username, password })
    .beforeEach(async t => {
        await t.useRole(user.regularUser)
        await t
            .hover(Selector('#headerCurrencyPicker'))
            .click(Selector('.currencyCodeWidth').withText('BRL'))
            .hover(Selector('#CC-header-language-link'))
            .click(Selector('span').withText(/^PT_BR.*/))
        await paymentPage.addProductToCart()
        await paymentPage.goToPaymentsPage()
    })

test('Successful card payment without 3DS', async t => {
    await paymentPage.doCardPayment('Attila test', config.masterCardWithout3D, config.expDate, config.cvc)
    await paymentPage.placeOrder()
    await paymentPage.expectSuccess()
})

test('Refused card payment without 3DS', async t => {
    await paymentPage.doCardPayment('Attila test', config.masterCardWithout3D, config.wrongExpDate, config.cvc)
    await paymentPage.placeOrder()
    await paymentPage.expectRefusal()
})

test('Successful card payment with 3DS2', async t => {
    await paymentPage.doCardPayment('Attila test', config.masterCard3DS2, config.expDate, config.cvc)
    await paymentPage.placeOrder()
    await paymentPage.do3DS2Validation(config.threeDS2CorrectAnswer)
    await paymentPage.expectSuccess()
})

test('Successful boleto payment', async t => {
    await paymentPage.doBoletoPayment({
        firstName: 'Jose',
        lastName: 'Silva',
        houseNumber: '999',
        ssn: '56861752509',
        street: 'Rua Funcionarios',
        zip: '04386040',
        city: 'Sao Paulo',
    })
    await paymentPage.expectBoletoWrapper()
    await paymentPage.expectSuccess()
})

test.skip('Successful one click payment', async t => {
    await paymentPage.doOneClickPayment(config.cvc)
    await paymentPage.expectSuccess()
})
test.skip('Successful iDeal payment', async t => {
    await paymentPage.doIDealPayment()
    await paymentPage.expectSuccess()
})

test.skip('Successful AfterPay payment', async t => {
    await paymentPage.doAfterPayPayment(
        config.afterPayApprovedNLGender,
        config.afterPayApprovedNLDateOfBirth,
        config.afterPayApprovedNLPhoneNumber
    )

    await paymentPage.expectSuccess()
})

test.skip('Successful Klarna payment', async t => {
    const user = new User()
    await user.setUser('klarnaApprovedUser')
    await paymentPage.goToPaymentsPage()

    await paymentPage.doKlarnaPayment('continue', config.klarnaApprovedNLDateOfBirth)
    await paymentPage.expectSuccess()
})

test.skip('Cancelled Klarna payment', async t => {
    const paymentPage = new PaymentPage()
    await paymentPage.goToCheckoutPageWithFullCart()

    const user = new User()
    await user.setUser('klarnaApprovedUser')
    await paymentPage.goToPaymentsPage()

    await paymentPage.doKlarnaPayment('cancel')
    await paymentPage.expectError()
})

test('Successful payment with combo card', async t => {
    await paymentPage.doCardPayment('Attila test', config.masterCard3DS2, config.expDate, config.cvc)
    await paymentPage.selectCardType(config.cardTypes.debit)
    await paymentPage.placeOrder()
    await paymentPage.do3DS2Validation(config.threeDS2CorrectAnswer)
    await paymentPage.expectSuccess()
})

test('Successful payment with installments', async t => {
    await paymentPage.doCardPayment('Attila test', config.masterCardWithout3D, config.expDate, config.cvc)
    await paymentPage.selectInstallments()
    await paymentPage.placeOrder()
    await paymentPage.expectSuccess()
})
