export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const data = ref(false)

  const show = () => {
    data.value = true
  }

  const hide = () => {
    data.value = false
  }

  router.beforeEach((to, from, next) => {
    show()
    next()
  })

  router.afterEach(() => {
    setTimeout(() => {
      hide()
    }, 500) // Затримка для плавного закриття
  })

  nuxtApp.provide('loader', {
    data,
    show,
    hide
  })
})

