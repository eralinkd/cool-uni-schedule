<script setup>
import ScheduleBuilder from '~/components/ScheduleBuilder.vue'

const router = useRouter()
const auth = useAuthStore()
if (!auth.token) router.replace({ name: 'login' })
</script>

<template>
  <ScheduleBuilder />
</template>
