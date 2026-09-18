<template>
    <main class="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div class="container d-flex justify-content-center">
            <!-- KHỐI KHUNG THẺ TẠO MẬT KHẨU MỚI (RESET PASSWORD CARD) -->
            <div class="card border-0 shadow-sm rounded-4 w-100" style="max-width: 480px;">
                <div class="card-body p-4 p-md-5">

                    <!-- 1. Khối Tiêu đề & Chỉ dẫn nghiệp vụ -->
                    <div class="text-center mb-4">
                        <h3 class="fw-bold text-primary mb-2">Tạo mật khẩu mới</h3>
                        <p class="text-muted small mb-0">Nhập mã OTP 6 số và mật khẩu mới của bạn.</p>
                    </div>

                    <!-- 2. Khối Hiển thị Thông báo Thành công / Thất bại -->
                    <div v-if="successMessage" class="alert alert-success small rounded-3 border-0 shadow-sm"
                        role="alert">
                        <i class="fas fa-check-circle me-1"></i> {{ successMessage }}
                    </div>
                    <div v-if="errorMessage" class="alert alert-danger small rounded-3 border-0 shadow-sm" role="alert">
                        <i class="fas fa-exclamation-circle me-1"></i> {{ errorMessage }}
                    </div>

                    <!-- 3. Khối Biểu mẫu Đổi Mật Khẩu (Reset Password Form) -->
                    <form @submit.prevent="handleSubmit">
                        <!-- Trường hiển thị Email (Khóa Đọc - Readonly) -->
                        <div class="mb-3">
                            <label class="form-label text-dark fw-semibold small mb-2">Email</label>
                            <div
                                class="input-group input-group-lg border rounded-3 overflow-hidden bg-secondary bg-opacity-10">
                                <input type="email"
                                    class="form-control border-0 bg-transparent fs-6 shadow-none text-muted"
                                    v-model="form.email" readonly>
                            </div>
                        </div>

                        <!-- Trường nhập Mã OTP 6 chữ số (Tối ưu nhập liệu bằng ký tự phân cách rộng) -->
                        <div class="mb-4">
                            <label class="form-label text-dark fw-semibold small mb-2">Mã OTP</label>
                            <input type="text"
                                class="form-control form-control-lg bg-light border-0 fs-4 text-center fw-bold shadow-none"
                                style="letter-spacing: 0.5rem;" v-model="form.token" maxlength="6" placeholder="------"
                                @input="form.token = form.token.replace(/[^0-9]/g, '')">
                        </div>

                        <!-- Trường nhập Mật khẩu mới kèm nút Bật/Tắt xem mật khẩu -->
                        <div class="mb-3">
                            <label class="form-label text-dark fw-semibold small mb-2">Mật khẩu mới</label>
                            <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-white">
                                <input :type="showNew ? 'text' : 'password'" class="form-control border-0 shadow-none"
                                    v-model="form.password" placeholder="Nhập mật khẩu mới">
                                <button class="btn bg-transparent border-0 text-muted px-3" type="button"
                                    @click="showNew = !showNew">
                                    <i class="fas" :class="showNew ? 'fa-eye text-primary' : 'fa-eye-slash'"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Trường Nhập lại Xác nhận Mật khẩu mới -->
                        <div class="mb-4">
                            <label class="form-label text-dark fw-semibold small mb-2">Xác nhận mật khẩu</label>
                            <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-white">
                                <input :type="showConfirm ? 'text' : 'password'"
                                    class="form-control border-0 shadow-none" v-model="form.password_confirmation"
                                    placeholder="Nhập lại mật khẩu mới">
                                <button class="btn bg-transparent border-0 text-muted px-3" type="button"
                                    @click="showConfirm = !showConfirm">
                                    <i class="fas" :class="showConfirm ? 'fa-eye text-primary' : 'fa-eye-slash'"></i>
                                </button>
                            </div>
                        </div>

                        <!-- 4. Khối Nút bấm Kích hoạt cập nhật Mật khẩu -->
                        <button type="submit" class="btn w-100 py-3 fw-bold rounded-3 mb-4 text-white"
                            style="background-color: #f65e39; border: none; transition: 0.3s;"
                            :disabled="!isFormValid || isSubmitting">
                            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                            {{ isSubmitting ? 'Đang xử lý...' : 'Cập nhật mật khẩu' }}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
// =====================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & KHỞI TẠO BIẾN TRẠNG THÁI (STATE & ROUTE)
// =====================================================================
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AuthService from '@/services/auth.service'

const router = useRouter()
const route = useRoute()

// Đối tượng lưu trữ toàn bộ tham số cần thiết để Đặt lại mật khẩu
const form = ref({ email: '', token: '', password: '', password_confirmation: '' })

// Trạng thái bật/tắt hiển thị mật khẩu bằng mắt thường
const showNew = ref(false)
const showConfirm = ref(false)

// Cờ trạng thái điều khiển quá trình xử lý
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// =====================================================================
// 2. BỘ HÀM VÀ MÓC TRÌNH DẪN VÒNG ĐỜI (LIFECYCLE & BUSINESS LOGIC)
// =====================================================================

// Khi trang vừa tải xong: Tự động điền email từ tham số URL (query) chuyển sang từ trang Quên mật khẩu
onMounted(() => { 
    if (route.query.email) form.value.email = route.query.email 
})

// Bộ kiểm duyệt tự động (Computed): Yêu cầu OTP đủ 6 số, Mật khẩu >= 6 ký tự và Trùng khớp nhau
const isFormValid = computed(() =>
    form.value.token.length === 6 && form.value.password.length >= 6 && form.value.password === form.value.password_confirmation
)

/**
 * Hàm xử lý khi nhấn nút "Cập nhật mật khẩu"
 * - Bước 1: Gửi trọn gói (email, otp_token, password, password_confirmation) sang AuthService.resetPassword.
 * - Bước 2: Hiển thị thông báo thành công và chuyển về Trang Đăng nhập sau 2 giây.
 */
const handleSubmit = async () => {
    isSubmitting.value = true
    try {
        const response = await AuthService.resetPassword(form.value.email, form.value.token, form.value.password, form.value.password_confirmation)
        successMessage.value = response.data?.message || 'Đổi mật khẩu thành công!'
        // Chuyển hướng sang trang đăng nhập sau khi khôi phục thành công
        setTimeout(() => router.push({ name: 'login' }), 2000)
    } catch (e) {
        errorMessage.value = 'Mã xác thực không hợp lệ hoặc đã hết hạn.'
    } finally { 
        isSubmitting.value = false 
    }
}
</script>