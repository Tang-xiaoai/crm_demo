import Cookies from 'js-cookie'

const TokenKey = 'mytoken'
const GuidKey = 'myguid'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function getGuid() {
  return Cookies.get(TokenKey)
}

export function setGuid(guid) {
  return Cookies.set(GuidKey, guid)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function removeGuid() {
  return Cookies.remove(GuidKey)
}
