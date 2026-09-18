<template>
    <main class="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div class="container d-flex justify-content-center">

            <div class="card border-0 shadow-sm rounded-4 w-100" style="max-width: 480px;">
                <div class="card-body p-4 p-md-5">

                    <div class="text-center mb-4">
                        <h2 class="fw-bold text-primary mb-4">AutoCar Admin</h2>
                        <h5 class="fw-bold text-dark mb-2">Tạo mật khẩu mới</h5>
                        <p class="text-muted small mb-0">Vui lòng kiểm tra email và nhập mã xác nhận 6 chữ số cùng mật
                            khẩu mới của bạn.</p>
                    </div>

                    <div v-if="successMessage" class="alert alert-success small rounded-3 border-0 shadow-sm"
                        role="alert">
                        <i class="fas fa-check-circle me-1"></i> {{ successMessage }}
                    </div>
                    <div v-if="errorMessage" class="alert alert-danger small rounded-3 border-0 shadow-sm" role="alert">
                        <i class="fas fa-exclamation-circle me-1"></i> {{ errorMessage }}
                    </div>

                    <form @submit.prevent="handleSubmit">

                        <div class="mb-3">
                            <label class="form-label text-dark fw-semibold small mb-2">Tài khoản Email</label>
                            <div
                                class="input-group input-group-lg border rounded-3 overflow-hidden bg-secondary bg-opacity-10">
                                <input type="email"
                                    class="form-control border-0 bg-transparent fs-6 shadow-none text-muted"
                                    v-model="form.email" readonly>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label text-dark fw-semibold small mb-2">Mã xác nhận (OTP)</label>
                            <input type="text"
                                class="form-control form-control-lg bg-light border-0 fs-4 text-center fw-bold shadow-none"
                                style="letter-spacing: 0.5rem;" v-model="form.token" maxlength="6" placeholder="------"
                                @input="form.token = form.token.replace(/[^0-9]/g, '')">
                        </div>

                        <div class="mb-3">
                            <label class="form-label text-dark fw-semibold small mb-2">Mật khẩu mới</label>
                            <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-white"
                                :class="{ 'border-danger': form.password.length > 0 && form.password.length < 6 }">
                                <input :type="showNew ? 'text' : 'password'"
                                    class="form-control border-0 bg-transparent fs-6 shadow-none"
                                    v-model="form.password" placeholder="Tối thiểu 6 ký tự">
                                <button class="btn bg-transparent border-0 text-muted px-3" type="button"
                                    @click="showNew = !showNew">
                                    <i class="fas" :class="showNew ? 'fa-eye text-primary' : 'fa-eye-slash'"></i>
                                </button>
                            </div>
                            <small v-if="form.password.length > 0 && form.password.length < 6"
                                class="text-danger mt-1 d-block">
                                * Mật khẩu mới phải có ít nhất 6 ký tự
                            </small>
                        </div>

                        <div class="mb-4">
                            <label class="form-label text-dark fw-semibold small mb-2">Xác nhận mật khẩu</label>
                            <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-white"
                                :class="{ 'border-danger': form.password_confirmation.length > 0 && form.password !== form.password_confirmation }">
                                <input :type="showConfirm ? 'text' : 'password'"
                                    class="form-control border-0 bg-transparent fs-6 shadow-none"
                                    v-model="form.password_confirmation" placeholder="Nhập lại mật khẩu mới">
                                <button class="btn bg-transparent border-0 text-muted px-3" type="button"
                                    @click="showConfirm = !showConfirm">
                                    <i class="fas" :class="showConfirm ? 'fa-eye text-primary' : 'fa-eye-slash'"></i>
                                </button>
                            </div>
                            <small
                                v-if="form.password_confirmation.length > 0 && form.password !== form.password_confirmation"
                                class="text-danger mt-1 d-block">
                                * Mật khẩu xác nhận không khớp
                            </small>
                        </div>

                        <button type="submit" class="btn w-100 py-3 fw-bold rounded-3 mb-4"
                            style="transition: all 0.3s ease;"
                            :class="isFormValid ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'"
                            :disabled="!isFormValid || isSubmitting">
                            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"
                                aria-hidden="true"></span>
                            {{ isSubmitting ? 'Đang xử lý...' : 'Cập nhật mật khẩu' }}
                        </button>

                        <div class="text-center">
                            <button type="button"
                                class="btn btn-link text-decoration-none text-muted small fw-semibold p-0 shadow-none border-0 vertical-align-baseline"
                                :disabled="isResending || countdown > 0 || !form.email" @click="handleResendOTP">
                                <i class="fas fa-redo-alt me-1" :class="{ 'fa-spin': isResending }"></i>
                                <span>{{ countdown > 0 ? `Gửi lại mã sau ${countdown}s` : 'Gửi lại mã OTP' }}</span>
                            </button>
                        </div>

                    </form>
                </div>
            </div>

        </div>
    </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AuthService from '@/services/auth.service'

const router = useRouter()
const route = useRoute()

// Lấy email từ URL truyền vào
onMounted(() => {
    if (route.query.email) {
        form.value.email = route.query.email
    }
})

const form = ref({
    email: '',
    token: '',
    password: '',
    password_confirmation: ''
})

const showNew = ref(false)
const showConfirm = ref(false)
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const isResending = ref(false)
const countdown = ref(0)

// Cập nhật lại computed isFormValid
const isFormValid = computed(() => {
    // Không cần check email.length nữa vì nó là readonly và được lấy từ URL
    return form.value.token.length === 6 &&
        form.value.password.length >= 6 &&
        form.value.password === form.value.password_confirmation
})

const handleSubmit = async () => {
    errorMessage.value = ''
    successMessage.value = ''
    isSubmitting.value = true

    try {
        // GỌI API: Truyền rời rạc 4 tham số để tránh lỗi 422
        const response = await AuthService.resetPassword(
            form.value.email,
            form.value.token,
            form.value.password,
            form.value.password_confirmation
        )

        successMessage.value = response.data?.message || 'Mật khẩu đã được khôi phục thành công!'

        // Về trang đăng nhập sau 2s
        setTimeout(() => {
            router.push({ name: 'admin-signin' })
        }, 2000)

    } catch (error) {
        console.log("Lỗi từ backend:", error.response?.data);
        errorMessage.value = error.response?.data?.message || 'Mã xác nhận không hợp lệ hoặc đã hết hạn.'
    } finally {
        if (errorMessage.value) {
            isSubmitting.value = false
        }
    }
}

// Hàm chạy đếm ngược 60 giây
const startCountdown = () => {
    countdown.value = 60
    const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
            clearInterval(timer)
        }
    }, 1000)
}

// Xử lý gửi lại OTP
const handleResendOTP = async () => {
    errorMessage.value = ''
    successMessage.value = ''
    isResending.value = true

    try {
        const response = await AuthService.forgotPassword(form.value.email)
        successMessage.value = response.data?.message || 'Mã OTP mới đã được gửi vào email của bạn!'
        startCountdown()
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Không thể gửi lại mã vào lúc này. Vui lòng thử lại sau.'
    } finally {
        isResending.value = false
    }
}
</script>
