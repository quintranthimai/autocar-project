<template>
    <div>
        <AppLoading v-if="isLoading" />
        <AppHeader />
        <router-view :key="$route.fullPath" />
        <AppFooter />
        <a href="#" class="btn btn-secondary btn-lg-square rounded-circle back-to-top"><i
                class="fa fa-arrow-up"></i></a>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Import các component
import AppLoading from '@/components/web/AppLoading.vue'
import AppHeader from '@/components/web/AppHeader.vue'
import AppFooter from '@/components/web/AppFooter.vue'

// Biến điều khiển trạng thái loading
const isLoading = ref(true)

onMounted(() => {
    // Giả lập thời gian loading khoảng 1 giây để template kịp render
    // Nếu có API thật, bạn sẽ tắt loading sau khi fetch API xong
    setTimeout(() => {
        isLoading.value = false;
    }, 1000);
})
</script>
