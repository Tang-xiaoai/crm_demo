import { cryptSign } from '@/utils/cryptSign'
import request from '@/utils/request'

/**
 * 获取客户列表
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function getClientList(data) {
  const url = '/api/customer/list'
  data = cryptSign(url, data)
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 添加客户
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function addClient(data) {
  const url = '/api/customer/add'
  data = cryptSign(url, data)
  return request({
    url,
    method: 'post',
    data
  })
}
