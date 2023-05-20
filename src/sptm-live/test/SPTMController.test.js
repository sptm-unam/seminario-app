const { SPTMController } = require('../SPTMController')

it('should instanciate controller', () => {
  const parser =  SPTMController()
  expect(parser).toBeDefined()
})
