// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH KẾT NỐI (IMPORTS)
// ============================================================================
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// ============================================================================
// 2. KHO QUẢN LÝ BIẾN ĐẾM MẪU (COUNTER STORE DEMO/DEFAULT)
// ============================================================================
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
