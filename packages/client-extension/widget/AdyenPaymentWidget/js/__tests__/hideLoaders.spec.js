import Widget from '../../../../__mocks__/widget'
import generateTemplate from '../utils/tests/koTemplate'
import { hideLoaders } from '../utils'

describe('Hide Loaders', () => {
    let widget
    beforeEach(() => {
        widget = new Widget()
    })

    it('should hide loaders', () => {
        generateTemplate(widget)

        const node = document.querySelectorAll('.loader-wrapper')[0]
        node.classList.toggle('hide', false)

        expect(node.classList.contains('hide')).toBeFalsy()
        hideLoaders()
        expect(node.classList.contains('hide')).toBeTruthy()
    })
})
