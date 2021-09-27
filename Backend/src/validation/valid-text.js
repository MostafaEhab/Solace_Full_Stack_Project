const validText = Str => {
    return typeof Str === 'string' && Str.trim().length > 0 ;
}

module.exports = validText;