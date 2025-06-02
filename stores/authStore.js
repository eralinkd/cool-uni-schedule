import { useAuthApi } from '~/api/authApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const roles = ref([])
  const token = ref(localStorage.getItem('accessToken') || null)
  const { postLogin, getMe } = useAuthApi()

  const fetchMe = async() => {
    if (!token.value) return
    try {
      const response = await getMe(token.value)
      user.value = response.data.username
      roles.value = response.data.roles
    }
    catch (err) {
      user.value = null
      roles.value = []
      token.value = null
      localStorage.removeItem('accessToken')

      throw err
    }
  }

  const login = async(username, password) => {
    const response = await postLogin({ username, password })
    const receivedToken = response.data.token
    token.value = receivedToken
    localStorage.setItem('accessToken', receivedToken)

    await fetchMe()
  }

  const logout = () => {
    user.value = null
    roles.value = []
    token.value = null
    localStorage.removeItem('accessToken')
  }

  return { user, roles, token, login, logout, fetchMe }
})
