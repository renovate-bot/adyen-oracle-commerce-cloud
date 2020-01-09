import validateWebHookPayloadSignature from '../helpers/webhookSignatureValidation'

function validateWebhookHeaders(req, res, next) {
    const logger = req.app.locals.logger
    logger.info(':::HOST', req.hostname)
    logger.info(':::HEADERS', req.headers)
    if (req.hostname !== 'localhost') {
        if (req.headers['x-oracle-cc-webhook-signature']) {
            validateWebHookPayloadSignature(req)
        } else {
            logger.error('No secret key provided for request: ' + req.url)
            throw new Error('Signature not included. Access denied')
        }
    }

    next()
}

export default validateWebhookHeaders
