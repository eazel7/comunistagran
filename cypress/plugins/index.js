module.exports = (on, config) => {
  const filePreprocessor = require('@bahmutov/cy-rollup')
  on('file:preprocessor', filePreprocessor())
}
