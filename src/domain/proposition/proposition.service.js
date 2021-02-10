const PropositionDAO = require('./proposition.dao')
const AuthorDAO = require('../author/author.dao')
const ProcedureDAO = require('../procedure/procedure.dao')
const logger = require('log4js').getLogger('proposition.service')
const CamaraClient = require('../../integrations/camara.client')

module.exports.getMostRelevant = async () => {
  return await PropositionDAO.find(null, [['status_date_time', 'desc']], 10)
}
module.exports.save = async (camaraProposition) => {
  let proposition = await PropositionDAO.load(camaraProposition.id)
  if (proposition) return
  logger.info(`Saving proposition ${camaraProposition.id}`)
  camaraProposition = await CamaraClient.fetchPropositionDetails(camaraProposition.uri)
  try {
    if (!camaraProposition.statusProposicao) {
      camaraProposition.statusProposicao.ultimoStatus = {}
    }
    proposition = {
      id: camaraProposition.id,
      type: camaraProposition.siglaTipo,
      number: camaraProposition.numero,
      year: camaraProposition.ano,
      synthesis: camaraProposition.ementa,
      presentationDate: camaraProposition.dataApresentacao,
      description: camaraProposition.ementaDetalhada,
      text: camaraProposition.texto,
      justification: camaraProposition.justificativa,
      urlFullContent: camaraProposition.urlInteiroTeor,
      lead: '',
      countRetweets: 0,
      countLikes: 0,
      statusDateTime: camaraProposition.statusProposicao.dataHora,
      statusDescription: camaraProposition.statusProposicao.descricaoSituacao
    }
    if (camaraProposition.uriPropPrincipal) {
      const arr = camaraProposition.uriPropPrincipal.split('/')
      proposition.idParent = arr[arr.length - 1]
    }
    await PropositionDAO.insert(proposition)
    const sequences = new Set()
    for (const camaraProcedure of camaraProposition.procedures) {
      let sequence = camaraProcedure.sequencia + ''
      let order = 0
      while (sequences.has(sequence)) {
        sequence = `${camaraProcedure.sequencia}_${++order}`
      }
      sequences.add(sequence)
      const procedure = {
        sequence: sequence,
        dateTime: camaraProcedure.dataHora,
        organ: camaraProcedure.siglaOrgao,
        regime: camaraProcedure.regime,
        description: camaraProcedure.descricaoTramitacao,
        despatch: camaraProcedure.despacho,
        statusCode: camaraProcedure.codSituacao,
        statusDescription: camaraProcedure.descricaoSituacao,
        scope: camaraProcedure.ambito,
        url: camaraProcedure.url
      }
      if (camaraProcedure.uriUltimoRelator) {
        const arr = camaraProcedure.uriUltimoRelator.split('/')
        procedure.lastRapporteur = arr[arr.length - 1]
      }
      await ProcedureDAO.insert(proposition.id, procedure)
    }

    for (const camaraAuthor of camaraProposition.authors) {
      if (camaraAuthor.nomeCivil) {
        let author = await AuthorDAO.load(camaraAuthor.id)
        if (!author) {
          if (!camaraAuthor.ultimoStatus) {
            camaraAuthor.ultimoStatus = {}
          }
          author = {
            id: camaraAuthor.id,
            name: camaraAuthor.nomeCivil,
            cpf: camaraAuthor.cpf,
            party: camaraAuthor.ultimoStatus.siglaPartido,
            urlPhoto: camaraAuthor.ultimoStatus.urlFoto,
            state: camaraAuthor.ultimoStatus.siglaUf,
            electoralName: camaraAuthor.ultimoStatus.nomeEleitoral,
            email: camaraAuthor.ultimoStatus.email
          }
          await AuthorDAO.insert(author)
        }
        try {
          await PropositionDAO.insertAuthorLink(proposition.id, author.id, author.party)
        } catch (error) {
          logger.info(`Proposição ${proposition.id} repetindo autor ${author.id}`)
        }
      } else {
        try {
          await PropositionDAO.insertAuthorLink(proposition.id, '9999999', 'OUTROS')
        } catch (error) {
          logger.info(`Proposição ${proposition.id} repetindo autor ${9999999}`)
        }
      }
    }
  } catch (error) {
    logger.error(`Error on proposition ${camaraProposition.id}`, error)
  }
}
