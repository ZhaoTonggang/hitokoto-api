// This module is intended to search songs
const Joi = require('joi')
// validation schema
const { ValidateParams } = require('../../utils/response')
const {
  getPlaylistDetail,
  getPlaylistDetailWithCache,
} = require('./_sdk_wrapper')
const { recoverRequest } = require('./_sdk_utils')
const schema = Joi.object({
  id: Joi.number().min(1).max(1000000000000).required(),
  s: Joi.number().min(1).max(10000).default(8),
  nocache: Joi.boolean().default(false),
})

module.exports = async (ctx) => {
  const params = Object.assign({}, ctx.params, ctx.query, ctx.request.body)
  if (!(await ValidateParams(params, schema, ctx))) {
    // validateParams
    return
  }
  const { id, s, nocache } = params
  let data
  try {
    data = await (nocache
      ? getPlaylistDetail(id, s, ctx.get('X-Real-IP'))
      : getPlaylistDetailWithCache(id, s, ctx.get('X-Real-IP')))
  } catch (err) {
    data = recoverRequest(err)
  }
  ctx.status = 200
  ctx.body = data
}
