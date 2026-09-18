<template>
    <main class="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div class="container d-flex justify-content-center">

            <div class="card border-0 shadow-sm rounded-4 w-100" style="max-width: 450px;">
                <div class="card-body p-4 p-md-5">

                    <div class="text-center mb-4">
                        <h2 class="fw-bold text-primary mb-4">AutoCar Admin</h2>
                        <h5 class="fw-bold text-dark mb-2">Khôi phục mật khẩu</h5>
                        <p class="text-muted small mb-0">Vui lòng nhập email tài khoản của bạn, chúng tôi sẽ gửi mã xác
                            nhận OTP gồm 6 chữ số.</p>
                    </div>

                    <div v-if="successMessage" class="alert alert-success small rounded-3 border-0 shadow-sm"
                        role="alert">
                        <i class="fas fa-check-circle me-1"></i> {{ successMessage }}
                    </div>
                    <div v-if="errorMessage" class="alert alert-danger small rounded-3 border-0 shadow-sm" role="alert">
                        <i class="fas fa-exclamation-circle me-1"></i> {{ errorMessage }}
                    </div>

                    <form @submit.prevent="handleSubmit">
                        <div class="mb-4">
                            <label class="form-label text-dark fw-semibold small mb-2">Địa chỉ Email</label>
                            <input type="email" class="form-control form-control-lg bg-light border-0 fs-6 shadow-none"
                                v-model="email" placeholder="admin@autocar.vn" :readonly="isSubmitting">
                        </div>

                        <button type="submit" class="btn btn-primary w-100 py-3 fw-bold rounded-3 mb-4"
                            style="transition: all 0.3s ease;" :disabled="!isFormValid || isSubmitting">
                            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"
                                aria-hidden="true"></span>
                            {{ isSubmitting ? 'Đang gửi mã...' : 'Gửi mã xác nhận' }}
                        </button>

                        <div class="text-center">
                            <router-link to="/admin/signin" class="text-decoration-none text-muted small fw-semibold">
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/services/auth.service'

const router = useRouter()

const email = ref('')
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const isEmailValid = (emailStr) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(emailStr)
}

const isFormValid = computed(() => {
    return email.value.trim().length > 0 && isEmailValid(email.value)
})

const handleSubmit = async () => {
    errorMessage.value = ''
    successMessage.value = ''
    isSubmitting.value = true

    try {
        // GỌI API: Truyền chuỗi email vào hàm Service
        const response = await AuthService.forgotPassword(email.value)

        successMessage.value = response.data?.message || 'Mã xác nhận đã được gửi đến email của bạn!'

        // Đợi 1.5s rồi chuyển sang trang Nhập OTP, mang theo email trên URL
        setTimeout(() => {
            router.push({
                name: 'admin-reset-password',
                query: { email: email.value }
            })
        }, 1500)

    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Email không tồn tại trong hệ thống.'
    } finally {
        if (errorMessage.value) {
            isSubmitting.value = false
        }
    }
}
</script>
