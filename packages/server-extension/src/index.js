import errorMiddleware from './middlewares/errorHandler'
import validateWebhookMiddleware from './middlewares/validateWebhook'
import loggerMiddleware from './middlewares/logger'
import routes from './routes/index'
import createClient from './middlewares/createClient'
import uaParser from './middlewares/uaParser'
import occClient from './middlewares/occClient'

export default function configureApp(app) {
    app.use(loggerMiddleware)
    app.use(validateWebhookMiddleware)
    app.use(uaParser)

    app.use(occClient, createClient, routes)

    app.use(errorMiddleware)
}
