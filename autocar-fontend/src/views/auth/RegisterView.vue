<template>
    <div class="container">
        <div class="row justify-content-center wow fadeInUp" data-wow-delay="0.1s">
            <div class="col-md-8 col-lg-5">
                <!-- KHỐI KHUNG THẺ ĐĂNG KÝ (REGISTER CARD CONTAINER) -->
                <div class="card border-0 shadow-lg rounded-4 overflow-hidden my-5">
                    <div class="card-body p-5">
                        <!-- 1. Khối Tiêu đề & Logo thương hiệu -->
                        <div class="text-center mb-4">
                            <div class="contact-icon mb-3 d-inline-flex bg-primary rounded-circle p-3">
                                <i class="fas fa-user-plus fa-2x text-white"></i>
                            </div>
                            <h2 class="text-primary fw-bold">AutoCar</h2>
                            <p class="text-muted">Tạo tài khoản mới</p>
                        </div>

                        <!-- 2. Khối Biểu mẫu Đăng ký (Form Xử Lý Đăng Ký Tài Khoản) -->
                        <form @submit.prevent="handleRegister">
                            <!-- Khu vực hiển thị thông báo Lỗi / Thành công -->
                            <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show"
                                role="alert">
                                {{ errorMessage }}
                                <button type="button" class="btn-close" data-bs-dismiss="alert"
                                    aria-label="Close"></button>
                            </div>

                            <div v-if="successMessage" class="alert alert-success alert-dismissible fade show"
                                role="alert">
                                {{ successMessage }}
                                <button type="button" class="btn-close" data-bs-dismiss="alert"
                                    aria-label="Close"></button>
                            </div>

                            <!-- Nhập Họ và Tên (Full Name) -->
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="fullname" placeholder="Họ và tên"
                                    v-model="fullname" required :disabled="loading">
                                <label for="fullname">Họ và tên</label>
                            </div>

                            <!-- Nhập Địa chỉ Email -->
                            <div class="form-floating mb-3">
                                <input type="email" class="form-control" id="email" placeholder="name@example.com"
                                    v-model="email" required :disabled="loading">
                                <label for="email">Địa chỉ Email</label>
                            </div>

                            <!-- Nhập Số điện thoại -->
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="phone" placeholder="Số điện thoại"
                                    v-model="phone" required :disabled="loading">
                                <label for="phone">Số điện thoại</label>
                            </div>

                            <!-- Lựa chọn Vai trò: Khách thuê hoặc Chủ xe -->
                            <div class="form-floating mb-3">
                                <select class="form-select" id="role" v-model="role" :disabled="loading">
                                    <option value="renter">Thuê (Renter)</option>
                                    <option value="owner">Cho thuê (Owner)</option>
                                </select>
                                <label for="role">Bạn muốn</label>
                            </div>

                            <!-- Nhập Mật khẩu mới -->
                            <div class="form-floating mb-3">
                                <input type="password" class="form-control" id="password" placeholder="Password"
                                    v-model="password" @input="checkPasswordMatch" required :disabled="loading">
                                <label for="password">Mật khẩu</label>
                            </div>

                            <!-- Nhập lại Xác nhận Mật khẩu -->
                            <div class="form-floating mb-4">
                                <input type="password" class="form-control" id="confirmPassword"
                                    placeholder="Confirm Password" v-model="confirmPassword" @input="checkPasswordMatch"
                                    required :disabled="loading" :class="{ 'is-invalid': !passwordsMatch }">
                                <label for="confirmPassword">Xác nhận mật khẩu</label>
                            </div>

                            <!-- Đồng ý Điều khoản sử dụng dịch vụ -->
                            <div class="form-check mb-4">
                                <input class="form-check-input" type="checkbox" id="terms" v-model="agreeTerms" required
                                    :disabled="loading">
                                <label class="form-check-label" for="terms">
                                    Tôi đồng ý với các <a href="#" class="text-primary text-decoration-none">Điều khoản
                                        & Dịch vụ</a>
                                </label>
                            </div>

                            <!-- Nút bấm Kích hoạt Đăng Ký -->
                            <button type="submit" class="btn btn-primary w-100 py-3 rounded-pill fw-bold"
                                :disabled="loading">
                                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                                    aria-hidden="true"></span>
                                {{ loading ? 'Đang đăng ký...' : 'ĐĂNG KÝ' }}
                            </button>
                        </form>

                        <!-- 3. Khối Chuyển hướng Bổ trợ (Trang Đăng nhập & Quay lại Trang chủ) -->
                        <div class="text-center mt-4">
                            <p class="mb-0">Đã có tài khoản? <router-link to="/auth/login"
                                    class="text-primary fw-bold text-decoration-none">Đăng nhập</router-link></p>

                            <router-link to="/" class="text-muted d-inline-block mt-3 text-decoration-none">
                                <i class="fas fa-arrow-left me-1"></i> Quay lại trang chủ
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// =====================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & KHỞI TẠO BIẾN TRẠNG THÁI (STATE & STORES)
// =====================================================================
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

// Biến reactive lưu trữ thông tin đăng ký mới
const fullname = ref('')
const email = ref('')
const phone = ref('')
const role = ref('renter') // Mặc định là Khách thuê (renter)
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)

// Biến theo dõi tiến trình và thông báo
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const passwordsMatch = ref(true)

// =====================================================================
// 2. BỘ HÀM BẢO CHỨNG & HÀM XỬ LÝ NGHIỆP VỤ LOGIC (BUSINESS FUNCTIONS)
// =====================================================================

/**
 * Hàm kiểm tra sự trùng khớp giữa Mật khẩu và Xác nhận mật khẩu theo thời gian thực (when @input)
 */
const checkPasswordMatch = () => {
    passwordsMatch.value = password.value === confirmPassword.value
}

/**
 * Hàm xử lý chính khi người dùng nhấn nút "ĐĂNG KÝ"
 * - Bước 1: Thẩm định (Validate) tính đầy đủ của thông tin, độ dài mật khẩu và sự đồng ý điều khoản.
 * - Bước 2: Đóng góp gói dữ liệu (Payload) và gửi yêu cầu đăng ký qua AuthStore.
 * - Bước 3: Đánh giá phản hồi: Nếu Backend trả về access_token lập tức đăng nhập tự động; ngược lại điều hướng sang trang Đăng nhập.
 */
const handleRegister = async () => {
    // Thẩm định biểu mẫu (Client-side Validation)
    if (!fullname.value || !email.value || !phone.value || !role.value || !password.value || !confirmPassword.value) {
        errorMessage.value = 'Vui lòng điền đầy đủ thông tin.'
        return
    }

    if (password.value.length < 6) {
        errorMessage.value = 'Mật khẩu phải có ít nhất 6 ký tự.'
        return
    }

    if (!passwordsMatch.value) {
        errorMessage.value = 'Mật khẩu xác nhận không khớp!'
        return
    }

    if (!agreeTerms.value) {
        errorMessage.value = 'Vui lòng đồng ý với Điều khoản & Dịch vụ.'
        return
    }

    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
        // Đóng gói thông tin gửi lên Backend API
        const payload = {
            name: fullname.value,
            email: email.value,
            phone: phone.value,
            role_slug: role.value,
            password: password.value,
            password_confirmation: confirmPassword.value,
        }

        const data = await authStore.register(payload)

        // Kiểm tra Token trả về để tự động hoàn tất quy trình
        const accessToken = data?.access_token
        if (accessToken) {
            successMessage.value = 'Đăng ký thành công! Bạn đã được đăng nhập tự động.'
            setTimeout(() => {
                router.push('/')
            }, 1200)
            return
        }

        successMessage.value = 'Đăng ký thành công! Chuyển hướng đến trang đăng nhập...'

        // Chuyển hướng về trang đăng nhập sau 2 giây
        setTimeout(() => {
            router.push('/auth/login')
        }, 2000)
    } catch (error) {
        console.error('Register error:', error)
        errorMessage.value =
            error.response?.data?.message ||
            'Đăng ký thất bại. Vui lòng thử lại.'
    } finally {
        // Tắt cờ trạng thái xử lý sau khi hoàn thành
        loading.value = false
    }
}
</script>
