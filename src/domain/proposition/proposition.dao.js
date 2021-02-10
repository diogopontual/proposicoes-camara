const db = require('../../database')
const squel = require('squel')

module.exports.find = async (where, sort, limit) => {
  let query = squel.select({ tableAliasQuoteCharacter: '"' }).from('propositions', 'p').left_join('propositions_tags', 'pt', 'pt.id_proposition  = p.id')
    .field('distinct id')
    .field('type')
    .field('number')
    .field('year')
    .field('synthesis')
    .field('presentation_date')
    .field('description')
    .field('id_parent')
    .field('url_full_content')
    .field('lead')
    .field('count_retweets')
    .field('count_likes')
    .field('justification')
    .field('proposition_text')
    .field('status_date_time')
    .field('status_description')
    .field('twitter_id')
    .field('severity')
    .field('keywords')
  if (where) {
    query = query.where(where || squel.expr())
  }
  if (sort) {
    for (const field of sort) {
      query = query.order(field[0], field[1].toLowerCase() === 'asc')
    }
  }
  if (limit) {
    query = query.limit(limit)
  }
  console.log(query.toString())
  return (await db.query(query.toString())).rows
}

module.exports.insertTag = async (id, tagId, manual) => {
  const query = `INSERT INTO public.propositions_tags(id_proposition, id_tag, is_manual) VALUES(${id}, ${tagId}, ${manual});`
  await db.query(query)
}

module.exports.insert = async (proposition) => {
  const query = {
    text: 'INSERT INTO public.propositions (id, "type", "number", "year", synthesis, presentation_date, description, id_parent, url_full_content, "lead", count_retweets, count_likes, proposition_text, justification, status_date_time, status_description) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)',
    values: [proposition.id, proposition.type, proposition.number, proposition.year, proposition.synthesis, proposition.presentationDate, proposition.description, proposition.idParent, proposition.urlFullContent, proposition.lead, proposition.countRetweets || 0, proposition.countLikes || 0, proposition.text, proposition.justification, proposition.statusDateTime, proposition.statusDescription]
  }
  const res = await db.query(query)
  return res.rows[0]
}

module.exports.load = async (id) => {
  const query = {
    text: 'SELECT id, "type", "number", "year", synthesis, presentation_date, description, id_parent, url_full_content, "lead", count_retweets, count_likes, proposition_text, justification, status_date_time, status_description FROM public.propositions where id = $1',
    values: [id]
  }
  const res = await db.query(query)
  if (res.rows.length > 0) {
    return res.rows[0]
  } else {
    return null
  }
}

module.exports.update = async (fields, id) => {
  const query = squel.update()
    .table('propositions')
    .setFields(fields)
    .where(`id = ${id}`)
    .toString()
  const res = await db.query(query)
  return res.rows[0]
}

module.exports.deleteAuthorsLinks = async (id) => {
  const query = {
    text: 'DELETE FROM public.propositions_authors WHERE id_proposition=$1',
    values: [id]
  }
  await db.query(query)
}

module.exports.insertAuthorLink = async (id, authorId, party) => {
  const query = {
    text: 'INSERT INTO public.propositions_authors (id_proposition, id_author, party) VALUES($1, $2, $3)',
    values: [id, authorId, party]
  }
  await db.query(query)
}
