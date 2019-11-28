const fetch = require('node-fetch')

const checkStatus = res => {
    if (res.ok) return res
    throw new Error(res.statusText)
}
const ccRestClient = {
    request: async (url, payload, success, fail) => {
        try {
            const res = checkStatus(
                await fetch(`http://localhost${url}`, { method: 'post' })
            )
            const body = await res.json()
            success(body)
        } catch (e) {
            fail(e)
        }
    },
}
module.exports = ccRestClient
