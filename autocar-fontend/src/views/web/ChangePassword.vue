<template>
    <main class="profile-page bg-light py-5 min-vh-100">
        <div class="container">
            <div class="row g-4">
                <ProfileSidebar />

                <div class="col-lg-9">
                    <div class="mb-4">
                        <h2 class="fw-bold mb-0hayx">Đổi mật khẩu</h2>
                        <p class="text-muted fs-6">Vui lòng nhập mật khẩu hiện tại của bạn để thay đổi mật khẩu</p>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4">
                        <div class="card-body p-4 p-lg-5">

                            <h5 class="fw-bold text-dark mb-4 fs-5">Nhập mật khẩu</h5>

                            <div v-if="successMessage" class="alert alert-success rounded-3" role="alert">
                                {{ successMessage }}
                            </div>
                            <div v-if="errorMessage" class="alert alert-danger rounded-3" role="alert">
                                {{ errorMessage }}
                            </div>

                            <form @submit.prevent="handleSubmit">
                                <div class="mb-4">
                                    <label class="form-label text-muted small fw-semibold mb-2">Mật khẩu hiện
                                        tại</label>
                                    <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-white">
                                        <input :type="showCurrent ? 'text' : 'password'"
                                            class="form-control border-0 bg-transparent fs-6 shadow-none"
                                            v-model="form.currentPassword">
                                        <button class="btn bg-transparent border-0 text-muted px-3" type="button"
                                            @click="showCurrent = !showCurrent">
                                            <i class="fas"
                                                :class="showCurrent ? 'fa-eye text-primary' : 'fa-eye-slash'"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label text-muted small fw-semibold mb-2">Mật khẩu mới</label>
                                    <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-white"
                                        :class="{ 'border-danger': form.newPassword.length > 0 && form.newPassword.length < 6 }">
                                        <input :type="showNew ? 'text' : 'password'"
                                            class="form-control border-0 bg-transparent fs-6 shadow-none"
                                            v-model="form.newPassword">
                                        <button class="btn bg-transparent border-0 text-muted px-3" type="button"
                                            @click="showNew = !showNew">
                                            <i class="fas"
                                                :class="showNew ? 'fa-eye text-primary' : 'fa-eye-slash'"></i>
                                        </button>
                                    </div>
                                    <small v-if="form.newPassword.length > 0 && form.newPassword.length < 6"
                                        class="text-danger mt-1 d-block">
                                        * Mật khẩu mới phải có ít nhất 6 ký tự
                                    </small>
                                </div>

                                <div class="mb-5">
                                    <label class="form-label text-muted small fw-semibold mb-2">Xác nhận mật khẩu
                                        mới</label>
                                    <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-white">
                                        <input :type="showConfirm ? 'text' : 'password'"
                                            class="form-control border-0 bg-transparent fs-6 shadow-none"
                                            v-model="form.confirmPassword">
                                        <button class="btn bg-transparent border-0 text-muted px-3" type="button"
                                            @click="showConfirm = !showConfirm">
                                            <i class="fas"
                                                :class="showConfirm ? 'fa-eye text-primary' : 'fa-eye-slash'"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-end">
                                    <button type="submit" class="btn px-5 py-3 fw-bold rounded-3 fs-6 transition-all"
                                        :class="isFormValid ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'"
                                        :disabled="!isFormValid || isSubmitting">
                                        {{ isSubmitting ? 'Đang cập nhật...' : 'Xác nhận' }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & THÀNH PHẦN SIDEBAR BỔ TRỢ (IMPORTS)
// ============================================================================
import ProfileSidebar from '@/components/web/ProfileSidebar.vue'
import { ref, computed } from 'vue'
import AuthService from '@/services/auth.service'

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI BIỂU MẪU & THẺ HIỆN ẨN (FORM & UI STATE)
// ============================================================================
// Hồ sơ trạng thái lưu trữ 3 trường nhập liệu mật khẩu
const form = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})

// Cụm trạng thái quản lý công tắc hiển thị mật khẩu dưới dạng chuỗi thô hay dấu hoa thị (*)
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const isSubmitting = ref(false) // Cờ khóa biểu mẫu trong quá trình gửi API
const errorMessage = ref('')    // Lưu trữ thông báo lỗi từ phía máy chủ trả về
const successMessage = ref('')  // Lưu trữ thông báo chúc mừng thành công

// ============================================================================
// 3. TRÌNH GIẢI TRÌNH & TỐI ƯU KIỂM TIẾT TÍNH HỢP LỆ FORM (VALIDATION COMPUTED)
// ============================================================================
/**
 * Theo dõi động (Reactive Computed) để mở khóa nút Xác nhận nếu mọi yêu cầu độ dài/đối chiếu hợp lệ
 */
const isFormValid = computed(() => {
    return form.value.currentPassword.length > 0 &&
        form.value.newPassword.length >= 6 &&
        form.value.confirmPassword === form.value.newPassword
})

/**
 * Xóa trắng toàn bộ các ô nhập liệu về trạng thái ban đầu sau khi thành công
 */
const resetForm = () => {
    form.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
}

// ============================================================================
// 4. PHƯƠNG THỨC XỬ LÝ CẬP NHẬT MẬT KHẢU TÀI KHOẢN (SUBMIT HANDLER)
// ============================================================================
/**
 * Đệ trình yêu cầu Đổi mật khẩu lên hệ thống máy chủ thông qua AuthService
 */
const handleSubmit = async () => {
    errorMessage.value = ''
    successMessage.value = ''

    // Đối chiếu dự phòng ở phía Frontend
    if (form.value.newPassword !== form.value.confirmPassword) {
        errorMessage.value = 'Mật khẩu xác nhận không khớp!'
        return
    }

    isSubmitting.value = true

    try {
        const response = await AuthService.changePassword(
            form.value.currentPassword,
            form.value.newPassword,
            form.value.confirmPassword,
        )

        successMessage.value = response.data?.message || 'Đổi mật khẩu thành công!'
        resetForm() // Khởi tạo lại Biểu mẫu sau khi thông suốt
    } catch (error) {
        errorMessage.value =
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu cũ và thử lại.'
    } finally {
        isSubmitting.value = false
    }
}
</script>