import notifier from 'notifier'
import navigation from 'navigation'
import eventEmitter from './events'
import { destroySpinner } from './spinner'
import * as constants from '../constants'

const createError = (options, preserveUrl = false) => ({
    errorMessage = 'The payment is REFUSED.',
} = {}) => {
    eventEmitter.store.emit(constants.isSubmitting, false)
    'redirectLink' in options &&
        navigation.goTo(options.redirectLink, preserveUrl)
    destroySpinner()
    notifier.sendError('adyen', errorMessage, true)
}

export default createError
