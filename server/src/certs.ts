const path = require('path')

process.env.NODE_EXTRA_CA_CERTS= path.resolve(process.cwd(),  'certs')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'


console.log(process.env.NODE_EXTRA_CA_CERTS)