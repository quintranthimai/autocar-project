<template>
    <div class="bg-light min-vh-100 py-5">
        <div class="container" style="max-width: 800px;">
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            
            <div v-else-if="error" class="alert alert-danger shadow-sm border-0 rounded-4">
                <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
                <div class="mt-3">
                    <router-link to="/" class="btn btn-outline-danger btn-sm rounded-pill px-3">Về trang chủ</router-link>
                </div>
            </div>

            <div v-else>
                <!-- Thông tin tài khoản -->
                <div class="card border-0 shadow-sm rounded-4 mb-4">
                    <div class="card-body p-4 p-md-5 text-center position-relative">
                        <!-- Số chuyến đi (ở góc phải) -->
                        <div class="position-absolute top-0 end-0 mt-4 me-4 d-none d-sm-block">
                            <div class="bg-success bg-opacity-10 text-success rounded-3 px-3 py-2 fw-bold border border-success border-opacity-25">
                                <i class="fas fa-car-side me-2"></i>{{ profileData.completed_trips_count || 0 }} chuyến
                            </div>
                        </div>

                        <h5 class="fw-bold mb-4 text-start">Thông tin tài khoản</h5>

                        <!-- Chuyến đi (Mobile) -->
                        <div class="d-sm-none mb-4 d-inline-block">
                            <div class="bg-success bg-opacity-10 text-success rounded-3 px-3 py-2 fw-bold border border-success border-opacity-25">
                                <i class="fas fa-car-side me-2"></i>{{ profileData.completed_trips_count || 0 }} chuyến
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <img :src="profileData.user?.avatar || '/img/team-1.jpg'" 
                                class="rounded-circle object-fit-cover shadow-sm border border-2 border-white"
                                style="width: 120px; height: 120px;" alt="Avatar">
                        </div>
                        <h4 class="fw-bold text-dark mb-2 text-uppercase">{{ profileData.user?.name || 'Người dùng' }}</h4>
                        <div class="text-muted small">
                            Tham gia: {{ profileData.user?.created_at ? new Date(profileData.user.created_at).toLocaleDateString('vi-VN') : '--/--/----' }}
                        </div>
                    </div>
                </div>

                <!-- Đánh giá -->
                <div class="card border-0 shadow-sm rounded-4 mb-4">
                    <div class="card-body p-4 p-md-5">
                        <div class="d-flex align-items-center gap-2 fw-bold mb-4 fs-5">
                            <template v-if="profileData.total_reviews > 0 && profileData.avg_rating > 0">
                                <i class="fas fa-star text-warning"></i>
                                <span>{{ Number(profileData.avg_rating).toFixed(1) }}</span>
                                <i class="fas fa-circle text-muted" style="font-size: 4px;"></i>
                                <span>{{ profileData.total_reviews }} Đánh giá</span>
                            </template>
                            <template v-else>
                                <i class="far fa-comment-dots text-muted"></i>
                                <span class="text-muted fs-6">Chưa có bài đánh giá nào</span>
                            </template>
                        </div>
                        
                        <div v-if="profileData.reviews_received && profileData.reviews_received.length > 0" class="d-flex flex-column gap-3">
                            <div v-for="(review, idx) in profileData.reviews_received" :key="idx" class="card border rounded-3 shadow-sm">
                                <div class="card-body p-4">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <div class="d-flex align-items-center gap-3">
                                            <img :src="review.reviewer?.avatar || '/img/team-1.jpg'" class="rounded-circle object-fit-cover shadow-sm border bg-dark" style="width: 55px; height: 55px;">
                                            <div>
                                                <div class="fw-bold text-dark fs-6">{{ review.reviewer?.name || 'Người dùng' }}</div>
                                                <div class="text-warning small mt-1">
                                                    <i v-for="n in 5" :key="n" class="fa-star" :class="n <= review.rating ? 'fas' : 'far text-muted'"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="text-muted small">{{ new Date(review.created_at).toLocaleDateString('vi-VN') }}</div>
                                    </div>
                                    <p v-if="review.comment" class="small mb-0 text-dark mt-3">
                                        {{ review.comment }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-5 bg-light rounded-3 mt-3">
                            <p class="text-muted mb-0"><i class="fas fa-comment-slash me-2"></i>Người dùng này chưa có đánh giá nào.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH ROUTING (IMPORTS)
// ============================================================================
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';

const route = useRoute();

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI TRANG CÔNG KHAI VÀ ĐÁNH GIÁ (STATE MANAGEMENT)
// ============================================================================
const loading = ref(true);     // Cờ đang tải dữ liệu hồ sơ công khai
const error = ref('');         // Lưu chuỗi thông báo lỗi nếu không tìm thấy User
const profileData = ref(null); // Gói dữ liệu uy tín, lịch sử chuyến và nhận xét

// ============================================================================
// 3. TRÌNH TẢI HỒ SƠ VÀ NHẬN XÉT CÔNG KHAI CỦA THÀNH VIÊN (PUBLIC PROFILE FETCH)
// ============================================================================
onMounted(async () => {
    try {
        const userId = route.params.id;
        if (!userId) {
            error.value = 'Không tìm thấy người dùng.';
            loading.value = false;
            return;
        }

        // Truy xuất hồ sơ công khai không yêu cầu quyền kiểm soát cá nhân
        const response = await api.get(`/v1/web/users/${userId}/public-profile`);
        if (response.data.success) {
            profileData.value = response.data.data;
        } else {
            error.value = 'Không thể tải thông tin người dùng.';
        }
    } catch (err) {
        console.error('Lỗi khi tải thông tin tài khoản công khai:', err);
        error.value = 'Đã xảy ra lỗi hệ thống hoặc người dùng không tồn tại.';
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.bg-light {
    background-color: #f7f9fa !important;
}
</style>
