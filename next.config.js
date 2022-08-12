/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const removeImports = require('next-remove-imports')({})
// const nextConfig = {
//   reactStrictMode: true,
// }
// module.exports = nextConfig
module.exports = removeImports({
  reactStrictMode: true,
})
