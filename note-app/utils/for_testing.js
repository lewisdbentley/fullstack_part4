const palindrome = (string) => {
    return string
        .split('')
        .reverse()
        .join('') // back together
}

const average = (array) => {
    const reducer = (sum, currentValue) => sum + currentValue

    return array.length === 0
        ? 0
        : array.reduce(reducer) / array.length
}

module.exports = {
    palindrome,
    average
}