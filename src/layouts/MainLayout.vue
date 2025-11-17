<template>
  <div class="min-h-screen flex flex-col">
    <header class="app-header">
      <div class="brand">
        <img :src="logoUrl" alt="logo" class="logo" />
        <span class="title">{{ title }}</span>
      </div>
      <nav class="nav">
        <router-link to="/">Конструктор</router-link>
        <router-link to="/templates">Шаблоны</router-link>
        <router-link to="/about">О проекте</router-link>
      </nav>
    </header>
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup>
import logoUrl from '@/shared/assets/logo.png'
const title = import.meta.env.VITE_APP_NAME || 'Report Constructor'
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo {
  height: 28px;
}
.title {
  font-weight: 600;
}
.nav a {
  margin-left: 16px;
}
</style>
