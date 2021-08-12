import { adminLogin, adminLogout, getAdminInfo } from '@/api/user'
import { getGuid, setGuid, removeGuid, getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    guid: getGuid(),
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_GUID: (state, guid) => {
    state.guid = guid
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // admin login
  login({ commit }, userInfo) {
    const { username, password, verifyCode, number } = userInfo
    return new Promise((resolve, reject) => {
      adminLogin({
        username: username.trim(),
        password,
        captcha: verifyCode,
        number
      }).then(response => {
        const { data } = response
        commit('SET_GUID', data.guid)
        commit('SET_TOKEN', data.token)
        setGuid(data.guid)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getAdminInfo({}).then(response => {
        const { data } = response

        if (!data) {
          return reject('验证失败，请重新登录。')
        }

        const { avatar, nick_name } = data

        commit('SET_NAME', nick_name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      adminLogout(state.token).then(() => {
        removeGuid()
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeGuid()
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

