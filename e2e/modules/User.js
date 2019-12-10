import { Selector, Role, t } from 'testcafe'
import config from '../config'

export default class User {
    userType = 'regularUser'
    streeline = false

    loginLink = Selector('#CC-loginHeader-login')
    loginHeader = Selector('#CC-loginHeader-myAccount')
    checkoutEmailInput = Selector('#CC-login-input')
    checkoutPasswordInput = Selector('#CC-login-password-input')
    checkoutPageLoginButton = Selector('#CC-userLoginSubmit')

    checkoutGuestInput = Selector('#CC-checkoutRegistration-email')

    checkoutPageUserFirstNameInput = Selector('#CC-checkoutAddressBook-sfirstname')
    checkoutPageUserLastNameInput = Selector('#CC-checkoutAddressBook-slastname')
    checkoutPageUserStreetLine1Input = Selector('#CC-checkoutAddressBook-saddress1')
    checkoutPageUserStreetLine2Input = Selector('#CC-checkoutAddressBook-saddress2')
    checkoutPageUserCityInput = Selector('#CC-checkoutAddressBook-scity')
    checkoutPageUserPostCodeInput = Selector('#CC-checkoutAddressBook-szipcode')
    checkoutPageUserCountrySelect = Selector('#CC-checkoutAddressBook-scountry')
    checkoutPageUserCountrySelectOption = this.checkoutPageUserCountrySelect.find('option')
    checkoutPageUserStateSelect = Selector('#CC-checkoutAddressBook-sstate')
    checkoutPageUserStateSelectOption = this.checkoutPageUserStateSelect.find('option')
    checkoutPageUserTelephoneInput = Selector('#CC-checkoutAddressBook-sphone')

    constructor({ password }) {
        this.password = password
    }

    regularUser = Role(config.storeFrontURL, async t => {
        await this.setUser()
    })

    _setGuestUser = async (
        email,
        firstName,
        lastName,
        street,
        houseNumber,
        city,
        postCode,
        countryCode,
        stateCode,
        phoneNumber,
        useStreetLine2ForHouseNumber = false
    ) => {
        await t

            .typeText(this.checkoutGuestInput, email, { paste: true })
            .typeText(this.checkoutPageUserFirstNameInput, firstName)
            .typeText(this.checkoutPageUserLastNameInput, lastName)

        if (useStreetLine2ForHouseNumber) {
            await t
                .typeText(this.checkoutPageUserStreetLine1Input, street)
                .typeText(this.checkoutPageUserStreetLine2Input, houseNumber)
        } else {
            await t.typeText(this.checkoutPageUserStreetLine1Input, street + ' ' + houseNumber)
        }

        await t
            .typeText(this.checkoutPageUserCityInput, city)
            .typeText(this.checkoutPageUserPostCodeInput, postCode)
            .click(this.checkoutPageUserCountrySelect)
            .click(this.checkoutPageUserCountrySelectOption.withAttribute('value', countryCode))
            .click(this.checkoutPageUserStateSelect)
            .click(this.checkoutPageUserStateSelectOption.withAttribute('value', stateCode))
            .typeText(this.checkoutPageUserTelephoneInput, phoneNumber)
    }

    userRoles = useStreetLine2ForHouseNumber => ({
        regularUser: async () =>
            await this._setUser(config.registeredUser.regular.username, config.registeredUser.regular.password),
        guestUser: () =>
            this._setGuestUser(
                'guest@adyen.com',
                'Guest',
                'Test',
                'Guest Street',
                '1',
                'Amsterdam',
                '1000 Dk',
                'NL',
                'NH',
                '0612345678',
                useStreetLine2ForHouseNumber
            ),
    })

    setUser = async () => await this.userRoles(this.streeline)[this.userType]()

    _setUser = async (email, password) => {
        await t
            .click(this.loginLink)
            .typeText(this.checkoutEmailInput, email, { paste: true })
            .typeText(this.checkoutPasswordInput, password)
            .click(this.checkoutPageLoginButton)

        await this.loginHeader()
    }
}
