<template>
    <main class="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div class="container d-flex justify-content-center">
            <!-- KHỐI KHUNG THẺ QUÊN MẬT KHẨU (FORGOT PASSWORD CARD) -->
            <div class="card border-0 shadow-sm rounded-4 w-100" style="max-width: 450px;">
                <div class="card-body p-4 p-md-5">
                    <!-- 1. Khối Tiêu đề & Hướng dẫn cơ bản -->
                    <div class="text-center mb-4">
                        <h2 class="fw-bold text-primary mb-4">AutoCar</h2>
                        <h5 class="fw-bold text-dark mb-2">Khôi phục mật khẩu</h5>
                        <p class="text-muted small mb-0">Nhập email tài khoản của bạn để nhận mã xác nhận (OTP).</p>
                    </div>

                    <!-- 2. Khối Hiển thị Thông báo Kết quả Cảnh báo -->
                    <div v-if="successMessage" class="alert alert-success small rounded-3 border-0 shadow-sm"
                        role="alert">
                        <i class="fas fa-check-circle me-1"></i> {{ successMessage }}
                    </div>
                    <div v-if="errorMessage" class="alert alert-danger small rounded-3 border-0 shadow-sm" role="alert">
                        <i class="fas fa-exclamation-circle me-1"></i> {{ errorMessage }}
                    </div>

                    <!-- 3. Khối Biểu mẫu Yêu cầu Mã OTP (Forgot Password Form) -->
                    <form @submit.prevent="handleSubmit">
                        <!-- Trường nhập Email Khách hàng -->
                        <div class="mb-4">
                            <label class="form-label text-dark fw-semibold small mb-2">Địa chỉ Email</label>
                            <input type="email" class="form-control form-control-lg bg-light border-0 fs-6 shadow-none"
                                v-model="email" placeholder="Nhập email của bạn" :readonly="isSubmitting">
                        </div>

                        <!-- Nút kích hoạt phát lệnh gửi mã -->
                        <button type="submit" class="btn btn-primary w-100 py-3 fw-bold rounded-3 mb-4"
                            :disabled="!isFormValid || isSubmitting">
                            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                            {{ isSubmitting ? 'Đang gửi...' : 'Gửi mã xác nhận' }}
                        </button>

                        <!-- 4. Khối Điều hướng Quay lại Đăng nhập -->
                        <div class="text-center">
                            <router-link :to="{ name: 'login' }"
                                class="text-decoration-none text-muted small fw-semibold">
                                <i class="fas fa-arrow-left me-1"></i> Quay lại Đăng nhập
                            </router-link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
// =====================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & KHỞI TẠO BIẾN TRẠNG THÁI (STATE & ROUTER)
// =====================================================================
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/services/auth.service'

const router = useRouter()
const email = ref('')
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// =====================================================================
// 2. BỘ THẨM ĐỊNH TỰ ĐỘNG & HÀM ĐIỀU CHÍNH GIAO GIỌNG (LOGIC METHODS)
// =====================================================================

// Thuộc tính computed: Kiểm tra nhanh cú pháp định dạng Email bằng Biểu thức chính quy (Regex)
const isFormValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))

/**
 * Hàm xử lý khi người dùng nhấn "Gửi mã xác nhận"
 * - Bước 1: Khởi động cờ tải và xóa trắng thông báo lỗi cũ.
 * - Bước 2: Gọi dịch vụ AuthService.forgotPassword(email) để kích hoạt Backend gửi email chứa OTP 6 số.
 * - Bước 3: Đợi 1.5s rồi tự động chuyển qua màn hình "reset-password" kèm tham số email.
 */
const handleSubmit = async () => {
    errorMessage.value = ''
    successMessage.value = ''
    isSubmitting.value = true
    try {
        const response = await AuthService.forgotPassword(email.value)
        successMessage.value = response.data?.message || 'Mã đã được gửi!'
        // Tự động chuyển trang sang màn Đặt lại mật khẩu sau 1.5 giây
        setTimeout(() => router.push({ name: 'reset-password', query: { email: email.value } }), 1500)
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Lỗi hệ thống.'
    } finally { 
        isSubmitting.value = false 
    }
}
</script>