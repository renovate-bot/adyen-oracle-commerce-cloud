export default function getOrderPayload(order) {
    const { shippingAddress: shippingAddressFn, billingAddress: billingAddressFn, cart, payments } = order()

    const { billingAddress, shippingAddress, id, orderProfileId, shippingMethod, shoppingCart } = order().order()

    return {
        billingAddress: {
            ...billingAddressFn(),
            ...billingAddress,
        },
        combineLineItems: cart().combineLineItems,
        op: 'initiate',
        id,
        payments: payments(),
        profileId: orderProfileId,
        shippingAddress: {
            ...shippingAddressFn(),
            ...shippingAddress,
        },
        shippingMethod,
        shoppingCart,
        pspReference: 'Here comes a PSP Reference!',
        dynamicPropertyPspReference: 'Here comes a PSP Reference!',
        paymentMethod: 'Here comes a Payment Method!',
        dynamicPropertyPaymentMethod: 'Here comes a Payment Method!',
    }
}
