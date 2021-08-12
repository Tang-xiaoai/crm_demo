import { GUID, TOKEN, PCHashSite, HASHS, noCryptTokenApi, VERSION } from '@/utils/constant'
import store from '@/store'
import md5 from 'js-md5'

/**
 * 获取需要后续加密的token内容
 * @param token
 * @returns {string}
 * @author tah
 */
export function getCryptToken(token) {
  let hex_str = ''
  for (let i = 0; i < PCHashSite.length; i++) {
    hex_str += token.charAt(PCHashSite[i])
  }
  const flag = parseInt(hex_str, 16) % 8
  const arr = HASHS[flag]
  let cryptToken = ''
  for (let j = 0; j < arr.length; j++) {
    cryptToken += token.charAt(arr[j])
  }
  return cryptToken
}

/**
 * 签名加密
 * @param path
 * @param data
 * @returns {{path: *, param: string, sign, guid: *, time: number}}
 * @author tah
 */
export function cryptSign(path, data) {
  const time = Date.parse(new Date()) / 1000
  let guid = ''
  let cryptToken = ''

  if (noCryptTokenApi.indexOf(path) !== -1) {
    // 该接口为通用接口，token不用加密
    guid = GUID
    cryptToken = TOKEN
  } else {
    // 如果不是通用接口，则需获取全局的guid，和多次转换后与token相关的cryptToken
    guid = store.getters.guid
    cryptToken = getCryptToken(store.getters.token)
  }

  // 将发送request请求的参数在此组合
  const param = JSON.stringify(data)
  const sign = md5(guid + param + time + cryptToken + path)
  let config = ''
  config = {
    'time': time,
    'guid': guid,
    'param': param,
    'signatures': sign,
    'version': VERSION
  }
  return config
}
