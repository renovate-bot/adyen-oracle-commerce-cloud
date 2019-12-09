import { Selector, t, ClientFunction } from 'testcafe'

export default class PaymentPage {
    placeOrderButton = Selector('button.adyen-checkout__button:nth-child(2)')

    navBar = Selector('.nav.navbar-nav')

    shippingMethodsButton = Selector(
        '#shipping-method-buttons-container .continue'
    )
    backToShippingMethods = Selector('.opc-progress-bar-item').withText(
        'Shipping'
    )

    productCard = Selector('#product-grid .row').child(0)
    addToCartButton = Selector('#cc-prodDetailsAddToCart')

    checkoutModal = Selector('#CC-headerShoppingCart-Checkout')
    checkoutButton = Selector('#CC-headerCheckout')
    creditCardToggle = Selector('span[data-target="#adyen-generic-wrapper"]')
    iDealInput = Selector('#ideal')
    klarnaInput = Selector('#klarna')
    afterPayInput = Selector('#afterpay_default')
    oneClickInput = Selector('.adyen_oneclick')
    holderNameInput = Selector('input[name="nameOnCard"]')
    cardNumberIFrame = Selector(
        '.adyen-checkout__card__cardNumber__input iframe'
    )
    cardNumberInput = Selector('#encryptedCardNumber')
    expDateIFrame = Selector('.adyen-checkout__card__exp-date__input iframe')
    expDateInput = Selector('#encryptedExpiryDate')
    cvcIFrame = Selector('.adyen-checkout__card__cvc__input iframe')
    cvcInput = Selector('input.cvc-field')
    klarnaIframe = Selector('#klarna-hpp-instance-fullscreen')

    boletoToggle = Selector('span[data-target="#adyen-boleto-wrapper"]')
    boletoName = Selector(
        '.adyen-checkout__field--firstName > label:nth-child(1) > span:nth-child(2) > input:nth-child(1)'
    )
    boletoLastName = Selector(
        '.adyen-checkout__field--lastName > label:nth-child(1) > span:nth-child(2) > input:nth-child(1)'
    )
    boletoSsn = Selector(
        'div.adyen-checkout__field:nth-child(3) > label:nth-child(1) > span:nth-child(2) > input:nth-child(1)'
    )
    boletoHouseNumber = Selector('.adyen-checkout__input--houseNumberOrName')
    boletoStreet = Selector('.adyen-checkout__input--street')
    boletoZip = Selector('.adyen-checkout__input--postalCode')
    boletoCity = Selector('.adyen-checkout__input--city')
    boletoStateDropdown = Selector('.adyen-checkout__dropdown__button')
    boletoState = Selector('li.adyen-checkout__dropdown__element:nth-child(26)')
    boletoButton = Selector('button.adyen-checkout__button:nth-child(4)')

    presentShopper = Selector('#present-shopper')

    iDealDropDown = Selector(
        '#iDealContainer .adyen-checkout__dropdown__button'
    )
    iDealDropDownList = Selector(
        '#iDealContainer .adyen-checkout__dropdown__list'
    )
    iDealDropDownListElement = Selector(
        '#iDealContainer .adyen-checkout__dropdown__list li'
    )
    iDealContinueButtonOnHPP = Selector('input[type="submit"]')

    threeDS2ChallengeIframe = Selector(
        '.adyen-checkout__threeds2__challenge iframe'
    )
    threeDS2ChallengeInput = Selector('input[name="answer"]')
    threeDS2ChallengeSubmit = Selector('input[type="submit"]')

    termsAndConditionsCheckbox = Selector(
        '.checkout-agreement input[type="checkbox"]'
    )

    constructor(user) {
        this.user = user
    }

    errorMessage = Selector('.cc-notification-message')

    klarnaBuyButton = Selector('#buy-button')
    klarnaDateOfBirthInput = Selector('#purchase-approval-date-of-birth')
    klarnaContinueButton = Selector('#purchase-approval-continue')
    klarnaRedirectButton = Selector(
        '#confirmation__footer-button-wrapper button'
    )
    klarnaCancelButton = Selector('#back-link')

    openInvoiceGenderRadioButton = Selector(
        'input[name="personalDetails__gender"]'
    )
    openInvoiceDateOfBirthInput = Selector(
        'input[name="personalDetails__dateOfBirth"]'
    )
    openInvoicePhoneNumberInput = Selector(
        'input[name="personalDetails__telephoneNumber"]'
    )

    shippingMethodDropdown = Selector('#cc-shippingOptions-dropDown')
    shippingMethodOption = Selector(
        '#CC-checkoutOrderSummary-shippingMethods ul'
    ).child(0)

    checkoutUrl = '/checkout'

    getLocation = ClientFunction(() => document.location.href)

    addProductToCart = async () => {
        await t
            .click(Selector('.rootCategoryChild > a > span:nth-child(1)'))
            .click(this.productCard.with({ timeout: 20000 }))
            .click(this.addToCartButton)
    }

    fillHolderName = async holderName => {
        await t.typeText(this.holderNameInput, holderName)
    }

    fillCardNumber = async cardNumber => {
        await t
            .switchToIframe(this.cardNumberIFrame.filterVisible())
            .typeText(this.cardNumberInput, cardNumber)
            .switchToMainWindow()
    }

    fillExpDate = async expDate => {
        await t
            .switchToIframe(this.expDateIFrame.filterVisible())
            .typeText(this.expDateInput, expDate)
            .switchToMainWindow()
    }

    fillCVC = async cvc => {
        await t
            .switchToIframe(this.cvcIFrame.filterVisible())
            .typeText(this.cvcInput, cvc)
            .switchToMainWindow()
    }

    fillThreeDS2ChallengeAndSubmit = async answer => {
        await t
            .switchToIframe(this.threeDS2ChallengeIframe)
            .typeText(this.threeDS2ChallengeInput, answer)
            .click(this.threeDS2ChallengeSubmit)
            .switchToMainWindow()
            .wait(5000)
    }

    goToCheckoutPageWithFullCart = async () => {
        await this.addProductToCart()
        await this.checkoutModal()
    }

    goToPaymentsPage = async () => {
        await t.click(this.checkoutButton)
    }

    doCardPayment = async (holderName, cardNumber, expDate, cvc) => {
        await t.click(this.creditCardToggle)

        await this.fillCardNumber(cardNumber)
        await this.fillExpDate(expDate)
        await this.fillCVC(cvc)
    }

    clearInput = async selector => {
        await t.selectText(selector).pressKey('delete')
        return selector
    }

    fillBoletoDetails = async ({
        firstName,
        lastName,
        houseNumber,
        ssn,
        city,
        street,
        zip,
    }) => {
        await t.typeText(await this.clearInput(this.boletoName), firstName)
        await t.typeText(await this.clearInput(this.boletoLastName), lastName)
        await t.typeText(
            await this.clearInput(this.boletoHouseNumber),
            houseNumber
        )
        await t.typeText(await this.clearInput(this.boletoCity), city)
        await t.typeText(await this.clearInput(this.boletoStreet), street)
        await t.typeText(await this.clearInput(this.boletoSsn), ssn)
        await t.typeText(await this.clearInput(this.boletoZip), zip)
        await t.click(this.boletoStateDropdown)
        await t.click(this.boletoState)
    }

    doBoletoPayment = async options => {
        await t.click(this.boletoToggle)

        await this.fillBoletoDetails(options)

        await this.selectShippingMethod()
        await t.click(this.boletoButton)
    }

    selectCardType = async cardType => {
        this.comboCardSelect = Selector('#comboCard')
        this.comboCardOption = this.comboCardSelect.find('option')
        await t
            .click(this.comboCardSelect)
            .click(this.comboCardOption.withText(cardType))
    }

    selectInstallments = async () => {
        this.installmentsSelect = Selector('#installments')
        this.installmentsOption = this.installmentsSelect.find('option')

        await t
            .click(this.installmentsSelect)
            .click(this.installmentsOption.withText('3x'))
    }

    checkTermsAndConditions = async () => {
        if (await this.termsAndConditionsCheckbox.exists) {
            await t.click(this.termsAndConditionsCheckbox.filterVisible())
        }
    }

    selectShippingMethod = async () => {
        await t
            .click(this.shippingMethodDropdown)
            .wait(300)
            .click(this.shippingMethodOption)
    }

    placeOrder = async () => {
        await this.selectShippingMethod()
        await this.checkTermsAndConditions()

        await t.click(this.placeOrderButton)
    }

    do3DS2Validation = async answer => {
        await this.fillThreeDS2ChallengeAndSubmit(answer)
    }

    expectSuccess = async () => {
        await t.wait(10000)
        const location = await this.getLocation()
        await t.expect(location).contains('confirmation')
    }

    expectBoletoWrapper = async () => {
        await t.expect(this.presentShopper.visible).ok()
    }

    expectRefusal = async () => {
        await t.wait(10000)
        await t
            .expect(this.errorMessage.innerText)
            .eql('The payment is REFUSED.')
    }

    expect3DSRefusal = async () => {
        await t
            .expect(this.errorMessage.innerText)
            .eql(
                '3D-secure validation was unsuccessful',
                '3D-secure validation was unsuccessful'
            )
    }

    expectError = async () => {
        const location = await this.getLocation()
        await t
            .expect(this.errorMessage.innerText)
            .eql(
                'Your payment failed, Please try again later',
                'Your payment failed, Please try again later'
            )
            .expect(location)
            .contains('checkout/cart')
    }

    doIDealPayment = async () => {
        await t
            .click(this.iDealInput)
            .click(this.iDealDropDown)
            .click(this.iDealDropDownListElement)

        await this.placeOrder()
        await this.continueOnHPP()
    }

    continueOnHPP = async () => {
        await t.click(this.iDealContinueButtonOnHPP)
    }

    doOneClickPayment = async cvc => {
        await t.click(this.oneClickInput)

        await this.fillCVC(cvc)
        await this.placeOrder()
    }

    doKlarnaPayment = async (action, dateOfBirth = null) => {
        await t.click(this.klarnaInput)

        await this.placeOrder()

        switch (action) {
            case 'continue':
                await this.continueOnKlarna(dateOfBirth)
                break
            case 'cancel':
                await this.cancelOnKlarna()
                break
            default:
                await this.continueOnKlarna(dateOfBirth)
        }
    }

    continueOnKlarna = async dateOfBirth => {
        // doesn't wait for the button to be clickable
        const klarnaBuyButton = await this.klarnaBuyButton.with({
            visibilityCheck: true,
        })()
        await t
            .expect(this.klarnaBuyButton.hasAttribute('disabled'))
            .notOk('ready for testing', { timeout: 5000 })
            .click(klarnaBuyButton)
            .switchToIframe(this.klarnaIframe)
            .typeText(this.klarnaDateOfBirthInput, dateOfBirth)
            .click(this.klarnaContinueButton)
            .click(this.klarnaRedirectButton)
            .switchToMainWindow()
    }

    cancelOnKlarna = async () => {
        await t.click(this.klarnaCancelButton)
    }

    doAfterPayPayment = async (gender, dateOfBirth, phoneNumber) => {
        await t
            .click(this.afterPayInput)
            .click(
                this.openInvoiceGenderRadioButton.withAttribute('value', gender)
            )
            .typeText(this.openInvoiceDateOfBirthInput, dateOfBirth)
            .typeText(this.openInvoicePhoneNumberInput, phoneNumber, {
                replace: true,
            })

        await this.placeOrder()
    }

    goToShippingAddressPage = async () => {
        await t.click(this.backToShippingMethods)
    }

    changeCountry = async countryCode => {
        await t
            .click(this.user.checkoutPageUserCountrySelect)
            .click(
                this.user.checkoutPageUserCountrySelectOption.withAttribute(
                    'value',
                    countryCode
                )
            )
    }
}
