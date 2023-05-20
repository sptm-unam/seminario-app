/**
 * @jest-environment jsdom
 */

const { SoundEnvironment } = require('../SoundEnvironment.js')
window.AudioContext = jest.fn().mockReturnValue({
  suspend: jest.fn(),
  currentTime: 0,
  createOscillator: jest.fn().mockReturnValue({ type: '', connect: jest.fn() }),
  createGain: jest.fn().mockReturnValue({
    gain: {
      connect: jest.fn(),
      setValueAtTime: jest.fn()
    }
  })
})

Date.now = jest.fn(() => 1487076708000) //14.02.2017

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

