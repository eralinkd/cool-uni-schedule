<template>
  <div class="preloader" :class="{ hidden: !$loader.data.value }">
    <div class="spinner"></div>
  </div>
</template>
<script setup>

const { $loader } = useNuxtApp()
</script>

