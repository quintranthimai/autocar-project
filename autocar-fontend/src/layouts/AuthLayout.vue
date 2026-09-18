<template>
  <div class="auth-layout bg-light">
    <!-- Nơi form Login hoặc Register sẽ được bơm vào -->
    <router-view />
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>