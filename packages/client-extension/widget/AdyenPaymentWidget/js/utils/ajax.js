import $ from 'jquery'
import { baseAPIUrl, channels } from '../constants'

const getData = (method, body) => method === 'post' && { data: { json: JSON.stringify(body) } }
export default isPreview => {
    return (path, cb, { body, method } = { body: '', method: 'get' }) => {
        const data = getData(method, body)
        $.ajax({
            url: `${baseAPIUrl}/${path}`,
            method,
            headers: {
                'x-oracle-cc-webhook-signature': 'ABC123',
                channel: isPreview ? channels.preview : channels.storefront,
            },
            success: cb,
            ...data,
        })
    }
}
