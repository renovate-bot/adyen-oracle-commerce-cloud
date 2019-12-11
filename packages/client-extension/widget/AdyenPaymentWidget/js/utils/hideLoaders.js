const hideLoaders = () => {
    const toggleElementAttribute = el => el.classList.toggle('hide', true)
    document.querySelectorAll('.loader-wrapper').forEach(toggleElementAttribute)
}

export default hideLoaders
