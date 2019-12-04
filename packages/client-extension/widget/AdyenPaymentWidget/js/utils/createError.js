import notifier from 'notifier'
import navigation from 'navigation'
import { destroySpinner } from './spinner'

const createError = (options, preserveUrl = false) => ({ errorMessage = 'The payment is REFUSED.' } = {}) => {
    'redirectLink' in options && navigation.goTo(options.redirectLink, preserveUrl)
    destroySpinner()
    notifier.sendError('adyen', errorMessage, true)
}

export default createError
