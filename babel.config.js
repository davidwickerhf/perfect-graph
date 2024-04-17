module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['@babel/preset-react', '@babel/preset-typescript'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.js', '.jsx', '.es', '.es6', '.mjs', '.ts', '.tsx'],
          alias: {
            '@assets': './src/assets',
            '@components': './src/components',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@root': './src',
            '@core': './src/core',
            '@constants': './src/constants',
            '@type': './src/type',
            '@material-ui/core': '@mui/material',
            '@material-ui/icons': '@mui/icons-material',
            '@material-ui/styles': '@mui/styles'
          }
        }
      ],
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true
        }
      ],
      '@babel/plugin-transform-nullish-coalescing-operator', // updated
      '@babel/plugin-transform-optional-chaining', // updated
      '@babel/plugin-transform-class-properties', // updated
      '@babel/plugin-transform-object-rest-spread', // updated
      '@babel/plugin-transform-optional-catch-binding', // add this new plugin
      '@babel/plugin-transform-logical-assignment-operators', // add this new plugin
      '@babel/plugin-transform-numeric-separator', // add this new plugin
      '@babel/plugin-transform-async-generator-functions' // add this new plugin
    ]
  }
}
