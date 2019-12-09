import PaymentPage from '../modules/PaymentPage'
import User from '../modules/User'
import ThreeDSpaymentPage from '../modules/ThreeDSPaymentPage'
import config from '../config'
import { Selector } from 'testcafe'

const { adminUser } = config
const { username, password } = adminUser
const user = new User(adminUser)
user.userType = 'guestUser'
const paymentPage = new PaymentPage(user)

fixture`Oracle frontend guest in user card payments`
    .page(config.storeFrontURL)
    .httpAuth({ username, password })
    .beforeEach(async t => {
        await t
            .hover(Selector('#headerCurrencyPicker'))
            .click(Selector('.currencyCodeWidth').withText('BRL'))
            .hover(Selector('#CC-header-language-link'))
            .click(Selector('span').withText(/^PT_BR.*/))
        await paymentPage.addProductToCart()
        await paymentPage.goToPaymentsPage()
        await user.setUser()
    })

test('Successful card payment without 3DS', async t => {
    await paymentPage.doCardPayment(
        'Attila test',
        config.masterCardWithout3D,
        config.expDate,
        config.cvc
    )
    await paymentPage.placeOrder()
    await paymentPage.expectSuccess()
})

test('Refused card payment without 3DS', async t => {
    await paymentPage.doCardPayment(
        'Attila test',
        config.masterCardWithout3D,
        config.wrongExpDate,
        config.cvc
    )
    await paymentPage.placeOrder()
    await paymentPage.expectRefusal()
})

test.skip('Successful card payment without 3DS explicitly checking for terms and conditions checkbox - prerequisite: custom terms and conditions needs to be enabled and set up on the magento admin', async t => {
    await paymentPage.doCardPayment(
        'Attila test',
        config.masterCardWithout3D,
        config.expDate,
        config.cvc
    )

    await t
        .expect(paymentPage.termsAndConditionsCheckbox.exists)
        .ok('Custom terms and conditions in NOT set up on the page')

    await paymentPage.placeOrder()
    await paymentPage.expectSuccess()
})

test('Successful card payment with 3DS1', async t => {
    await paymentPage.doCardPayment(
        'Attila test',
        config.visa3DS1,
        config.expDate,
        config.cvc
    )
    await paymentPage.placeOrder()

    const threeDSpaymentPage = new ThreeDSpaymentPage()
    await threeDSpaymentPage.do3DSValidation('user', 'password')
    await paymentPage.expectSuccess()
})

test('Refused card payment with 3DS', async t => {
    await paymentPage.doCardPayment(
        'Attila test',
        config.visa3DS1,
        config.expDate,
        config.cvc
    )
    await paymentPage.placeOrder()

    const threeDSpaymentPage = new ThreeDSpaymentPage()
    await threeDSpaymentPage.do3DSValidation('wrongUser', 'wrongPassword')
    await paymentPage.expect3DSRefusal()
})

test('Successful card payment with 3DS2', async t => {
    await paymentPage.doCardPayment(
        'Attila test',
        config.masterCard3DS2,
        config.expDate,
        config.cvc
    )
    await paymentPage.placeOrder()
    await paymentPage.do3DS2Validation(config.threeDS2CorrectAnswer)
    await paymentPage.expectSuccess()
})

test.skip('Successful iDeal payment', async t => {
    const paymentPage = new PaymentPage()
    await paymentPage.goToCheckoutPageWithFullCart()

    const user = new User()
    await paymentPage.goToPaymentsPage()
    await user.setUser('guestUser')

    await paymentPage.doIDealPayment()
    await paymentPage.expectSuccess()
})

test.skip('Successful Klarna payment, using street line 2 for housenumber - prerequisite: address line 2 needs to be enabled on the magento admin', async t => {
    const paymentPage = new PaymentPage()
    await paymentPage.goToCheckoutPageWithFullCart()

    const user = new User()
    await user.setUser('guestUserKlarna', true)
    await paymentPage.goToPaymentsPage()

    await paymentPage.doKlarnaPayment(
        'continue',
        config.klarnaApprovedNLDateOfBirth
    )
    await paymentPage.expectSuccess()
})

test.skip('Changing shipping country successfully refresh payment methods list', async t => {
    const paymentPage = new PaymentPage()
    await paymentPage.goToCheckoutPageWithFullCart()

    const user = new User()
    await user.setUser('guestUser')
    await paymentPage.goToPaymentsPage()

    await t
        .expect(paymentPage.iDealInput.exists)
        .ok('iDeal did not appear, while it should.')

    await paymentPage.goToShippingAddressPage()
    await paymentPage.changeCountry('HU')
    await paymentPage.goToPaymentsPage()

    await t
        .expect(paymentPage.iDealInput.exists)
        .notOk("iDeal appeared, while it shouldn't")
})
