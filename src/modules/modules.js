import camelCase from 'lodash/camelCase'

const files = require.context('./files', false, /\.js$/)
const modules = {}
const keys = files.keys()

for (let i = 0; i < keys.length; i++) {
  const fileName = keys[i]
  const moduleName = camelCase(fileName.replace(/(\.\/|\.js)/g, ''))
  modules[moduleName] = files(fileName).default
}

export default modules
