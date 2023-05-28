const Parser = require('../parser')

it('should instanciate parser', () => {
  const parser = new Parser()
  expect(parser).toBeDefined()
})

it('should parse a empty string and no nothing', () => {
  const parser = new Parser()
  expect(parser.parseString('')).toBe(undefined)
})

it('should parse a stop string', () => {
  // Arrange
  const handlers = {
    handlerMidi: jest.fn(),
    handlerFreq: jest.fn(),
    handlerLilySingle: jest.fn(),
    handlerLilyMultiple: jest.fn(),
    handlerStop: jest.fn(),
    handlerBpm: jest.fn(),
    handlerSamplePlay: jest.fn()
  }
  const parser = new Parser(handlers)
  // Act
  const command = parser.parseString('.')
  // Assert

  expect(handlers.handlerStop).toHaveBeenCalled()
})

it('should parse a lily string', () => {
  // Arrange
  const handlers = {
    handlerMidi: jest.fn(),
    handlerFreq: jest.fn(),
    handlerLilySingle: jest.fn(),
    handlerLilyMultiple: jest.fn(),
    handlerStop: jest.fn(),
    handlerBpm: jest.fn(),
    handlerSamplePlay: jest.fn()
  }
  const parser = new Parser(handlers)
  // Act
  const command = parser.parseString('a b c')
  // Assert

  expect(handlers.handlerLilyMultiple).toHaveBeenCalled()
})

it('should parse a sample sinlge string', () => {
  // Arrange
  const handlers = {
    handlerMidi: jest.fn(),
    handlerFreq: jest.fn(),
    handlerLilySingle: jest.fn(),
    handlerLilyMultiple: jest.fn(),
    handlerStop: jest.fn(),
    handlerBpm: jest.fn(),
    handlerSamplePlay: jest.fn()
  }
  const parser = new Parser(handlers)
  // Act
  const command = parser.parseString('#sample 2|2')
  // Assert
  expect(handlers.handlerSamplePlay).toHaveBeenCalled()
})
