const utils = require("../utils")

test('Debe regresar una frecuencia si se introduce un numero midi', () => {
    // Arrange
    const notaMidi = 69
    // Act
    const freq = utils.midiToFrequency(notaMidi)
    // Assert
    expect(freq).toBe(440)
})


it('letterToNote should return 9 if letter is a', () => {
    // Arrange
    const letter = 'a'
    // Act
    const note = utils.letterToNote(letter)
    // Assert
    expect(note).toBe(9)
})