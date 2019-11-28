import spinner from 'spinner'
import $ from 'jquery'

export const createSpinner = () => {
    const indicatorOptions = {
        parent: '#loadingModal',
        posTop: '20%',
        posLeft: '50%',
        loadingText: 'Loading',
    }
    $('#loadingModal').removeClass('hide')
    $('#loadingModal').show()
    spinner.create(indicatorOptions)
}

export const destroySpinner = () => {
    $('#loadingModal').hide()
    spinner.destroy()
}
