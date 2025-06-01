<template>
  <UContainer class="min-h-screen">
    <NuxtPage />
  </UContainer>
  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>
</template>

<script setup>
import { Notification, Notivue } from 'notivue';
</script>
