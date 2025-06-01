import { useSubjectApi } from '~/api/subjectApi'
import { useShowNotivue } from '~/composables/useNotivue.js'

export const useSubjectStore = defineStore('subject', () => {
  const { $loader } = useNuxtApp()
  console.log($loader)
  const { showNotivue } = useShowNotivue()
  const { getSubject } = useSubjectApi()

  const subject = ref({})

  const getSubjectData = async(id) => {
    $loader.show()
    try {
      const response = await getSubject(id)
      subject.value = response
    }
    catch {
      showNotivue(true, 'Failed to load subject')
    }
    finally {
      $loader.hide()
    }
  }

  return {
    subject,
    getSubjectData
  }
})

