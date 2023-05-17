/**
 * @jest-environment jsdom
 */

const { SoundEnvironment } = require('../SoundEnvironment.js')
window.AudioContext = jest.fn().mockReturnValue({
  suspend: jest.fn()
})

// Usage
const { Sine } = require('../Sine')

// test.js
jest.mock('../Sine', () => ({
  Sine: jest.fn().mockReturnValue({sineElement:0})
}))
const mockTime = 12345677
Date.now = jest.fn().mockReturnValue({
  getMilliseconds: mockTime
}) 

describe('Audio config', () => {
  it('Debe inicializar un SoundEnvironment', () => {
    // Arrange
    // Act
    const a = new SoundEnvironment()
    // Assert
    expect(a.soundElements).toEqual({})
  })

  it('init audio debe iniciar un contexto de audio', () => {
    // Arrange
    const a = new SoundEnvironment()
    // Act
    a.initAudio()
    // Assert
    expect(window.AudioContext).toHaveBeenCalledTimes(1)
  })

  it('SoundEnvironment.suspend debe detener el audio context', () => {
    // Arrange
    const a = new SoundEnvironment()
    a.initAudio()
    // Act
    a.suspend()
    // Assert
    expect(window.AudioContext).toHaveBeenCalledTimes(1)
    expect(window.AudioContext().suspend).toHaveBeenCalledTimes(1)
  })
})

describe('Sine waves', () => {
  it('Should trigger a unnamed sine wave and add it to the soundElements ', () => {
    // Arrange
    const a = new SoundEnvironment()
    a.initAudio()
    // Act
    a.addSine()
    // Assert
    expect(a.soundElements).toEqual({
      [mockTime]:{sineElement:0}
    })
  })
})
