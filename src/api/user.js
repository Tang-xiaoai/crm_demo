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

/**
 * 获取当前管理员信息
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function getAdminInfo(data) {
  const url = '/api/admin/info'
  data = cryptSign(url, data)
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 管理员退出登录
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function adminLogout(data) {
  const url = '/api/admin/logout'
  data = cryptSign(url, data)
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 获取管理员列表
 * @param data
 * @returns {AxiosPromise}
 */
export function getAdminList(data) {
  const url = '/api/admin/list'
  data = cryptSign(url, data)
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 添加管理员
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function addAdmin(data) {
  const url = '/api/admin/add'
  data = cryptSign(url, data)
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 更新管理员信息
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function updateAdmin(data) {
  const url = '/api/admin/update'
  data = cryptSign(url, data)
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 修改管理员密码
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function updateAdminPwd(data) {
  const url = '/api/admin/update/pwd'
  data = cryptSign(url, data)
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 修改管理员密码
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function updateAdminStatus(data) {
  const url = '/api/admin/update/status'
  data = cryptSign(url, data)
  return request({
    url,
    method: 'post',
    data
  })
}
