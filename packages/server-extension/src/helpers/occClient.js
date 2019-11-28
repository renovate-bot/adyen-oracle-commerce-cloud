import nconf from 'nconf/lib/nconf'
import CommerceSDK from '../utils/occSdk'

export default function occClient(logger) {
    return new CommerceSDK({
        hostname: nconf.get('atg.server.admin.url'),
        apiKey: nconf.get('atg.application.credentials:atg.application.token'),
        logger,
    })
}
