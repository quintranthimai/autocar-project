<template>
  
  <AdminTopbar />
  <AdminSidebar />
  <router-view />

  <footer class="text-center py-2 text-secondary border-top mt-5">
    <p class="mb-0">Copyright © 2026 Autocar Admin.</p>
  </footer>
</template>

<script setup>
import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import { onMounted } from 'vue'
import AdminTopbar from '@/components/admin/AdminTopbar.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'

import * as bootstrap from 'bootstrap'
window.bootstrap = bootstrap

onMounted(async () => {
  try {
    await import('@/assets/admin/js/sidebar.js')
    await import('@/assets/admin/js/custom.js')
  } catch (error) {
    console.error("Lỗi khi biên dịch JS Admin:", error)
  }
})
</script>

<style lang="scss">
/* Chỉ giữ lại duy nhất 1 dòng gọi SCSS gốc của template. Không viết thêm gì cả! */
@import "@/assets/admin/scss/style.scss";
</style>
