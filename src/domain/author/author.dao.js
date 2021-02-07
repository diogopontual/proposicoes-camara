const db = require('../../database')

module.exports.insert = async (author) => {
  const query = {
    text: 'INSERT INTO public.authors (id, "name", cpf, party, url_photo, state, electoral_name, email) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
    values: [author.id, author.name, author.cpf, author.party, author.urlPhoto, author.state, author.electoralName, author.email]
  }
  const res = await db.query(query)
  return res.rows[0]
}

module.exports.load = async (id) => {
  const query = {
    text: 'SELECT id, "name", cpf, party, url_photo, state, electoral_name, email FROM public.authors where id = $1',
    values: [id]
  }
  const res = await db.query(query)
  if (res.rows.length > 0) {
    return res.rows[0]
  } else {
    return null
  }
}
