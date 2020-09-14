const average = require('../utils/for_testing').average

describe('average', () => {
    test('one value returns same average', () => {
        const result = average([1])

        expect(result).toBe(1)
    })
    test('of many is calculated right', () => {
        expect(average([1, 2, 3, 4, 5])).toBe(3)
    })
    test('empty array returns zero', () => {
        const result = average([])

        expect(result).toBe(0)
    })
})