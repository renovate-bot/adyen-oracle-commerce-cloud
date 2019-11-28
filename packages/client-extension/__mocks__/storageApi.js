const storageApi = {
    getInstance: jest.fn(() => ({
        setItem: jest.fn(),
        getItem: jest.fn(val => `{ "${val}": "mocked_value" }`),
    })),
}
module.exports = storageApi
