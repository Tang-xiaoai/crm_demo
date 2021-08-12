import request from '@/utils/request'
import { cryptSign } from '@/utils/cryptSign'

/**
 * 管理员登录
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function adminLogin(data) {
  const url = '/api/admin/login'
  data = cryptSign(url, data)
  return request({
    url,
    method: 'post',
    data
  })
}

export function getAdminInfo(data) {
  const url = '/api/admin/info'
  data = cryptSign(url, data)
  return request({
    url,
    method: 'post',
    data
  })
}

export function adminLogout(data) {
  const url = '/api/admin/logout'
  data = cryptSign(url, data)
  return request({
    url,
    method: 'post',
    data
  })
}
