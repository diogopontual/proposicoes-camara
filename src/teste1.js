const squel = require('squel')
console.log(squel.expr().and("name = 'Thomas'").or('age > 18').toString())
