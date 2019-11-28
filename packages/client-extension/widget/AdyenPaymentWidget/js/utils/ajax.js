import $ from 'jquery'
import { baseAPIUrl, channels } from '../constants'

export default isPreview => {
    return (path, cb, method = 'get') => {
        $.ajax({
            url: `${baseAPIUrl}/${path}`,
            method,
            headers: {
                'x-oracle-cc-webhook-signature': 'ABC123',
                channel: isPreview ? channels.preview : channels.storefront,
            },
            success: cb,
        })
    }
}
