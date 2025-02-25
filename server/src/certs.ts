const path = require('path')

const isProd = process.env.NODE_ENV = "production";
process.env.NODE_EXTRA_CA_CERTS= isProd ? "/certs" : path.resolve(process.cwd(),  'certs')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'


console.log(process.env.NODE_EXTRA_CA_CERTS)