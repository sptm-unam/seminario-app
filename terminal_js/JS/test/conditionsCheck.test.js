const checks = require('../conditionsCheck')

describe('Check midi match', () => {
  it('should call midi handler if passed number in range [0,127]', () => {
    const handlerMIDI = jest.fn()
    const handlerFreq = jest.fn()
    checks.midiMatch('60', handlerMIDI)
    expect(handlerMIDI).toHaveBeenCalledWith('60')
    expect(handlerFreq).not.toHaveBeenCalled()
  })

  it('should call freq handler if passed number in range [0,127]', () => {
    const handlerMIDI = jest.fn()
    const handlerFreq = jest.fn()
    checks.midiMatch('440', handlerMIDI, handlerFreq)
    expect(handlerMIDI).not.toHaveBeenCalled()
    expect(handlerFreq).toHaveBeenCalledWith('440')
  })
})

describe('Checky Lily match', () => {
  it('should call lily handler if passed simple lily note without modifier', () => {
    const expectObj = [{ note: 'c' }]
    const handlerLily = jest.fn()
    checks.multipleLily('c', handlerLily)
    expect(handlerLily).toHaveBeenCalledWith(expectObj)
  })
  it('should call lily handler if passed simple lily note with modifier', () => {
    const expectObj = [{ note: 'c', modifier: 'is' }]
    const handlerLily = jest.fn()
    checks.multipleLily('cis', handlerLily)
    expect(handlerLily).toHaveBeenCalledWith(expectObj)
  })
  it('should call lily handler if passed simple lily note with modifier "is" and octave up', () => {
    const expectObj = [{ note: 'c', modifier: 'is', octave: "'" }]
    const handlerLily = jest.fn()
    checks.multipleLily("cis'", handlerLily)
    expect(handlerLily).toHaveBeenCalledWith(expectObj)
  })
  it('should call lily handler if passed simple lily note with modifier "is" and two octave up', () => {
    const expectObj = [{ note: 'c', modifier: 'is', octave: "''" }]
    const handlerLily = jest.fn()
    checks.multipleLily("cis''", handlerLily)
    expect(handlerLily).toHaveBeenCalledWith(expectObj)
  })
  it('should call lily handler if passed simple lily note without modifier "is" and octave up', () => {
    const expectObj = [{ note: 'c', octave: "''" }]
    const handlerLily = jest.fn()
    checks.multipleLily("c''", handlerLily)
    expect(handlerLily).toHaveBeenCalledWith(expectObj)
  })
  it('should call lily handler if passed simple lily note with modifier "is", octave up and duration', () => {
    const expectObj = [{ note: 'c', modifier: 'is', octave: "'", duration: '8' }]
    const handlerLily = jest.fn()
    checks.multipleLily("cis'8", handlerLily)
    expect(handlerLily).toHaveBeenCalledWith(expectObj)
  })
})

describe('Checky Multiple Lily match', () => {
  it('should call multiplelily handler if passed simple lily notes list', () => {
    const expectObj = [
      {
        duration: undefined,
        modifier: undefined,
        note: 'c',
        octave: undefined
      },
      {
        duration: undefined,
        modifier: undefined,
        note: 'a',
        octave: undefined
      },
      {
        duration: undefined,
        modifier: undefined,
        note: 'b',
        octave: undefined
      },
      {
        duration: undefined,
        modifier: undefined,
        note: 'd',
        octave: undefined
      },
      { duration: undefined, modifier: undefined, note: 'g', octave: undefined }
    ]
    const handlerLily = jest.fn()
    checks.multipleLily('c a b d g', handlerLily)
    expect(handlerLily).toHaveBeenCalledWith(expectObj)
  })
  it('should call multiplelily handler if passed simple lily notes list modifiers, octave and durations', () => {
    const expectObj = [
      { duration: undefined, modifier: 'is', note: 'c', octave: undefined },
      { duration: undefined, modifier: 'es', note: 'a', octave: "''" },
      { duration: '8', modifier: undefined, note: 'b', octave: ',' },
      { duration: undefined, modifier: undefined, note: 'd', octave: "'" },
      { duration: '4', modifier: undefined, note: 'g', octave: undefined }
    ]
    const handlerLily = jest.fn()
    checks.multipleLily("cis aes'' b,8 d' g4", handlerLily)
    expect(handlerLily).toHaveBeenCalledWith(expectObj)
  })
})

describe('Check stop match', () => {
  it('should call stop function if string is a period', () => {
    const handlerStop = jest.fn()
    checks.stopMatch('.', handlerStop)
    expect(handlerStop).toHaveBeenCalled()
  })
})

describe('Check BPM match', () => {
  it('should call change BOM function if string Number with BPM string a period', () => {
    const handlerBPM = jest.fn()
    checks.bpmMatch('120BPM', handlerBPM)
    expect(handlerBPM).toHaveBeenCalledWith('120')
  })
})

describe('Check sample play match', () => {
  it('should call sample play handler if strin is in format #sample 2|2', () => {
    const expected = { duration: '2', rate: '2', sample: 'sample' }
    const handlerBPM = jest.fn()
    checks.sampleMatch('#sample 2|2', handlerBPM)
    expect(handlerBPM).toHaveBeenCalledWith(expected)
  })
})
