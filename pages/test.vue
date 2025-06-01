<template>
  <div>
    {{ subjectStore.subject }}
  </div>
</template>

<script setup>
import { useSubjectStore } from '~/stores/subjectStore'

const subjectStore = useSubjectStore()

onMounted(async() => {
  await subjectStore.getSubjectData(1)
})
</script>
