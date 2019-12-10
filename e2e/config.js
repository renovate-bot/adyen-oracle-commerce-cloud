const isCI = !!process.env.CI
if (!isCI) {
    require('dotenv').config()
}

export default {
    masterCardWithout3D: '5100290029002909',
    masterCard3DS2: '5454545454545454',
    visa3DS1: '4212345678901237',

    wrongExpDate: '1122',
    expDate: '1020',
    cvc: '737',
    cardTypes: { credit: 'creditCard', debit: 'debitCard' },

    threeDS2CorrectAnswer: 'password',
    threeDS2WrongAnswer: 'wrong answer',

    guestUser: {
        regular: {
            email: 'guest@adyen.com',
            firstName: 'Guest',
            lastName: 'Test',
            street: 'Guest street',
            houseNumber: '1',
            city: 'London',
            postCode: 'WC2N 5DU',
            countryCode: 'UK',
            countryName: 'United Kingdom',
            phoneNumber: '06123456789',
            stateCode: 'NH',
        },
        klarna: {
            approved: {
                nl: {
                    firstName: 'Testperson-nl',
                    lastName: 'Approved',
                    street: 'Neherkade',
                    houseNumber: '1 XI',
                    city: 'Gravenhage',
                    postCode: '2521VA',
                    countryCode: 'NL',
                    phoneNumber: '0612345678',
                    dateOfBirth: '10071970',
                    gender: 'M',
                },
            },
        },
        afterPay: {
            approved: {
                nl: {
                    firstName: 'Test',
                    lastName: 'Acceptatie',
                    address: 'Hoofdstraat 80',
                    city: 'Heerenveen',
                    postCode: '8441ER',
                    phoneNumber: '0612345678',
                    dateOfBirth: '1990-01-01',
                    gender: 'M',
                },
            },
        },
    },
    domain: process.env.OCC_DOMAIN,
    domainBr: `${process.env.OCC_DOMAIN}/pt_BR`,
    storeFrontURL: `${process.env.OCC_DOMAIN}/home`,
    storeAdminURL: `${process.env.OCC_DOMAIN}/occ-admin`,

    adminUser: {
        username: process.env.OCC_ADMIN_USERNAME,
        password: process.env.OCC_ADMIN_PASSWORD,
    },

    registeredUser: {
        regular: {
            username: process.env.OCC_SHOPPER_USERNAME,
            password: process.env.OCC_SHOPPER_PASSWORD,
        },
    },
}
