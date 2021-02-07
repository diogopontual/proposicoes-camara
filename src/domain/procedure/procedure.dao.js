const db = require('../../database')

module.exports.insert = async (idProposition, procedure) => {
  const query = {
    text: 'INSERT INTO public."procedure" (id_proposition, "sequence", date_time, organ, regime, description, despatch, status_code, status_description, "scope", url, last_rapporteur) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);',
    values: [idProposition, procedure.sequence, procedure.dateTime, procedure.organ, procedure.regime, procedure.description, procedure.despatch, procedure.statusCode, procedure.statusDescription, procedure.scope, procedure.url, procedure.lastRapporteur]
  }
  const res = await db.query(query)
  return res.rows[0]
}
