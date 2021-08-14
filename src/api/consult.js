import { cryptSign } from '@/utils/cryptSign'
import request from '@/utils/request'

/**
 * 获取客户咨询列表
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function getClientConsult(data) {
  const url = '/api/customer/link/list'
  data = cryptSign(url, data)
  return request({
    url,
    method: 'post',
    data
  })
}
/**
 * 获取客户咨询详情
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function getClientConsultDetail(data) {
  const url = '/api/customer/detail'
  data = cryptSign(url, data)
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 添加客户咨询
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function addClientConsult(data) {
  const url = '/api/log/consult/add'
  data = cryptSign(url, data)
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 修改客户联系人
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function updateCustomer(data) {
  const url = '/api/customer/update/link'
  data = cryptSign(url, data)
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 删除客户联系人
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function deleteCustomer(data) {
  const url = '/api/link/delete'
  data = cryptSign(url, data)
  return request({
    url,
    method: 'post',
    data
  })
}
