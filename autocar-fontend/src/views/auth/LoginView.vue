<template>
    <div class="container">
        <div class="row justify-content-center wow fadeInUp" data-wow-delay="0.1s">
            <div class="col-md-8 col-lg-5">
                <!-- KHỐI KHUNG THẺ ĐĂNG NHẬP (LOGIN CARD CONTAINER) -->
                <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
                    <div class="card-body p-5">
                        <!-- 1. Khối Tiêu đề & Logo thương hiệu -->
                        <div class="text-center mb-4">
                            <div class="contact-icon mb-3 d-inline-flex bg-primary rounded-circle p-3">
                                <i class="fas fa-car-alt fa-2x text-white"></i>
                            </div>
                            <h2 class="text-primary fw-bold">AutoCar</h2>
                            <p class="text-muted">Đăng nhập vào tài khoản của bạn</p>
                        </div>

                        <!-- 2. Khối Biểu mẫu Đăng nhập (Form Xử Lý Đăng Nhập) -->
                        <form @submit.prevent="handleLogin">
                            <!-- Khu vực hiển thị thông báo lỗi (Alert Error) -->
                            <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show"
                                role="alert">
                                {{ errorMessage }}
                                <button type="button" class="btn-close" data-bs-dismiss="alert"
                                    aria-label="Close"></button>
                            </div>

                            <!-- Nhập Địa chỉ Email -->
                            <div class="form-floating mb-3">
                                <input type="email" class="form-control" id="email" placeholder="name@example.com"
                                    v-model="email" required :disabled="loading">
                                <label for="email">Địa chỉ Email</label>
                            </div>

                            <!-- Nhập Mật khẩu -->
                            <div class="form-floating mb-4">
                                <input type="password" class="form-control" id="password" placeholder="Password"
                                    v-model="password" required :disabled="loading">
                                <label for="password">Mật khẩu</label>
                            </div>

                            <!-- Lựa chọn Nhớ mật khẩu & Quên mật khẩu -->
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="remember" v-model="remember"
                                        :disabled="loading">
                                    <label class="form-check-label" for="remember">Nhớ mật khẩu</label>
                                </div>
                                <router-link to="/auth/forgot-password" class="small text-decoration-none">Quên mật
                                    khẩu?</router-link>
                            </div>

                            <!-- Nút bấm Kích hoạt Đăng nhập -->
                            <button type="submit" class="btn btn-primary w-100 py-3 rounded-pill fw-bold"
                                :disabled="loading">
                                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                                    aria-hidden="true"></span>
                                {{ loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP' }}
                            </button>
                        </form>

                        <!-- 3. Khối Chuyển hướng Bổ trợ (Đăng ký mới & Quay lại Trang chủ) -->
                        <div class="text-center mt-4">
                            <p class="mb-0">Chưa có tài khoản? <router-link to="/auth/register"
                                    class="text-primary fw-bold text-decoration-none">Đăng ký ngay</router-link></p>

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

// Định nghĩa các vai trò hợp lệ được quyền truy cập cổng thông tin WEB (Khách thuê & Chủ xe)
const WEB_ROLES = ['renter', 'owner']

const router = useRouter()
const authStore = useAuthStore()

// Biến reactive lưu trữ thông tin biểu mẫu và trạng thái màn hình
const email = ref('')
const password = ref('')
const remember = ref(false)
const loading = ref(false)
const errorMessage = ref('')

// =====================================================================
// 2. BỘ HÀM BẢO CHỨNG & HÀM XỬ LÝ NGHIỆP VỤ LOGIC (BUSINESS FUNCTIONS)
// =====================================================================

/**
 * Hàm hỗ trợ bóc tách danh sách chuỗi slug quyền lực từ đối tượng User
 * @param {Object} user - Đối tượng người dùng trả về từ hệ thống
 * @returns {Array} - Danh sách mã quyền (Ví dụ: ['renter', 'owner'])
 */
function getRoleSlugs(user) {
    return Array.isArray(user?.roles)
        ? user.roles.map((role) => (typeof role === 'string' ? role : role?.slug)).filter(Boolean)
        : []
}

/**
 * Hàm xử lý chính khi người dùng nhấn nút "ĐĂNG NHẬP"
 * - Bước 1: Gửi yêu cầu xác minh tài khoản sang Backend thông qua AuthStore.
 * - Bước 2: Thẩm định quyền (RBAC): Chặn không cho Quản trị viên (Admin) đăng nhập tại cổng Khách hàng.
 * - Bước 3: Đánh giá bộ nhớ tạm (localStorage) để điều hướng về đúng link đích trước đó hoặc về Trang chủ.
 */
const handleLogin = async () => {
    loading.value = true
    errorMessage.value = ''

    try {
        // Gọi hành động login trong Kho lưu trữ Pinia (AuthStore)
        await authStore.login({
            email: email.value,
            password: password.value,
        })

        // Lấy dữ liệu hồ sơ người dùng vừa đăng nhập
        const currentUser = authStore.user || await authStore.fetchCurrentUser()
        const roleSlugs = getRoleSlugs(currentUser)

        // Kiểm tra xem tài khoản có thuộc nhóm Người dùng Cửa hàng Web (Renter/Owner) hay không
        const canUseWebPortal = roleSlugs.some((role) => WEB_ROLES.includes(role))

        if (!canUseWebPortal) {
            // Nếu là tài khoản Quản trị Admin => Khởi động hủy Token và đẩy lùi ra ngoài
            await authStore.logout()
            errorMessage.value = 'Tài khoản admin không thể đăng nhập tại cổng khách thuê/chủ xe. Vui lòng đăng nhập ở trang admin.'
            return
        }

        // Kiểm tra đường dẫn ghi nhớ cần quay lại sau khi đăng nhập (ví dụ: đang đặt xe dở dang)
        const redirectUrl = localStorage.getItem('redirectAfterLogin');

        if (redirectUrl) {
            // Xóa biến nhớ đi để lần sau không bị điều hướng nhầm
            localStorage.removeItem('redirectAfterLogin');
            // Đẩy thẳng qua trang thanh toán hoặc trang dịch vụ khách vừa muốn vào
            router.push(redirectUrl);
        } else {
            // Trường hợp đăng nhập tự do => Trở về trang chủ
            router.push('/');
        }
    } catch (error) {
        console.error('Login error:', error)
        errorMessage.value =
            error.response?.data?.message ||
            'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.'
    } finally {
        // Tắt vòng quay tải (Spinner) dù thành công hay thất bại
        loading.value = false
    }
}
</script>