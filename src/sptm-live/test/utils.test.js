const utils = require("../utils")

test('Debe regresar una frecuencia si se introduce un numero midi', () => {
    // Arrange
    const notaMidi = 69
    // Act
    const freq = utils.midiToFrequency(notaMidi)
    // Assert
    expect(freq).toBe(440)
})


it('letterToNote should return corresponding numbre to letter ', () => {
    expect(utils.letterToNote('a')).toBe(9)
    expect(utils.letterToNote('b')).toBe(10)
    expect(utils.letterToNote('c')).toBe(0)
    expect(utils.letterToNote('d')).toBe(2)
    expect(utils.letterToNote('e')).toBe(4)
    expect(utils.letterToNote('f')).toBe(5)
    expect(utils.letterToNote('g')).toBe(7)
    expect(utils.letterToNote('la')).toBe(9)
    expect(utils.letterToNote('si')).toBe(10)
    expect(utils.letterToNote('do')).toBe(0)
    expect(utils.letterToNote('re')).toBe(2)
    expect(utils.letterToNote('mi')).toBe(4)
    expect(utils.letterToNote('fa')).toBe(5)
    expect(utils.letterToNote('sol')).toBe(7)
    expect(utils.letterToNote('r')).toBe(-40)
})

test('modifierToNumeric should map is to +1 and es to -1', () => {
    expect(utils.modifierToNumeric('is')).toBe(1)
    expect(utils.modifierToNumeric('es')).toBe(-1)
    expect(utils.modifierToNumeric('')).toBe(0)
})

test('calculateOctave should sum the number of apostrophes as +1 and commma to -1', () => {
    expect(utils.calculateOctave('')).toBe(0)
    expect(utils.calculateOctave("'")).toBe(1)
    expect(utils.calculateOctave("''")).toBe(2)
    expect(utils.calculateOctave(',')).toBe(-1)
    expect(utils.calculateOctave(',,')).toBe(-2)
})

test('durationToTime should reutn the reciprocal of the value', () => {
    expect(utils.durationToTime('2')).toBe(1/2)
    expect(utils.durationToTime('')).toBe(NaN)
    expect(utils.durationToTime('0')).toBe(Infinity)

})
