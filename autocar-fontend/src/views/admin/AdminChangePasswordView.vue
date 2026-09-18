<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">

            <div class="row mb-4">
                <div class="col-12">
                    <h1 class="fs-3 fw-bold text-dark mb-2">Đổi mật khẩu</h1>
                    <p class="text-muted fs-6 mb-0">Vui lòng nhập mật khẩu hiện tại của bạn để thay đổi mật khẩu quản
                        trị.</p>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="card border-0 shadow-sm rounded-4">
                        <div class="card-body p-4 p-lg-5">

                            <h5 class="fw-bold text-dark mb-4 fs-5">Nhập mật khẩu</h5>

                            <div v-if="successMessage" class="alert alert-success rounded-3 border-0 shadow-sm"
                                role="alert">
                                <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
                            </div>
                            <div v-if="errorMessage" class="alert alert-danger rounded-3 border-0 shadow-sm"
                                role="alert">
                                <i class="fas fa-exclamation-circle me-2"></i>{{ errorMessage }}
                            </div>

                            <form @submit.prevent="handleSubmit">

                                <div class="mb-4">
                                    <label class="form-label text-muted small fw-semibold mb-2">Mật khẩu hiện
                                        tại</label>
                                    <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-white">
                                        <input :type="showCurrent ? 'text' : 'password'"
                                            class="form-control border-0 bg-transparent fs-6 shadow-none"
                                            v-model="form.currentPassword" placeholder="Nhập mật khẩu cũ">
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
                                            v-model="form.newPassword" placeholder="Tối thiểu 6 ký tự">
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
                                    <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-white"
                                        :class="{ 'border-danger': form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword }">
                                        <input :type="showConfirm ? 'text' : 'password'"
                                            class="form-control border-0 bg-transparent fs-6 shadow-none"
                                            v-model="form.confirmPassword" placeholder="Nhập lại mật khẩu mới">
                                        <button class="btn bg-transparent border-0 text-muted px-3" type="button"
                                            @click="showConfirm = !showConfirm">
                                            <i class="fas"
                                                :class="showConfirm ? 'fa-eye text-primary' : 'fa-eye-slash'"></i>
                                        </button>
                                    </div>
                                    <small
                                        v-if="form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword"
                                        class="text-danger mt-1 d-block">
                                        * Mật khẩu xác nhận không khớp
                                    </small>
                                </div>

                                <div class="d-flex justify-content-end">
                                    <button type="submit" class="btn px-5 py-2 fw-bold rounded-3 fs-6"
                                        style="transition: all 0.3s ease;"
                                        :class="isFormValid ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'"
                                        :disabled="!isFormValid || isSubmitting">
                                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"
                                            role="status" aria-hidden="true"></span>
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
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH TRỌN ĐẦU NỐI (IMPORTS)
// ============================================================================
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/services/auth.service' // Dịch vụ xác thực và đổi mật khẩu an toàn

const router = useRouter()

// ============================================================================
// 2. KHỞI TẠO BIỂU MẪU ĐỔI MẬT KHẢU & BIẾN GIAO DIỆN (STATE MANAGEMENT)
// ============================================================================
// Biểu mẫu nhập mật khẩu
const form = ref({
    currentPassword: '',   // Mật khẩu hiện tại đang sử dụng
    newPassword: '',       // Mật khẩu mới thiết lập (Tối thiểu 6 ký tự)
    confirmPassword: ''    // Xác nhận lại mật khẩu mới
})

// Các biến trạng thái điều khiển Giao diện (UI States)
const showCurrent = ref(false)     // Bật/tắt hiện con mắt xem Mật khẩu hiện tại
const showNew = ref(false)         // Bật/tắt hiện con mắt xem Mật khẩu mới
const showConfirm = ref(false)     // Bật/tắt hiện con mắt xem Mật khẩu xác nhận
const isSubmitting = ref(false)    // Cờ khóa nút khi gửi yêu cầu đổi mật khẩu
const errorMessage = ref('')       // Thông báo lỗi nếu mật khẩu sai hoặc không khớp
const successMessage = ref('')     // Thông báo chúc mừng khi đổi mật khẩu thành công

// ============================================================================
// 3. TRÌNH KIỂM DIỆT HỢP LỆ (FORM VALIDATION)
// ============================================================================
// Kiểm tra hợp lệ thời gian thực (Nút Lưu Thay Đổi chỉ sáng lên khi đáp ứng đủ các tiêu chuẩn bảo mật)
const isFormValid = computed(() => {
    return form.value.currentPassword.length > 0 &&
        form.value.newPassword.length >= 6 &&
        form.value.confirmPassword === form.value.newPassword
})

// Xóa trắng biểu mẫu sau khi cập nhật thành công hoặc khi hủy bỏ
const resetForm = () => {
    form.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
}

// ============================================================================
// 4. NGHIỆP VỤ PHÁT LỆNH THAY ĐỔI MẬT KHẢU LÊN SYSTEM (SUBMIT ACTION)
// ============================================================================
/**
 * Phát lệnh đổi mật khẩu tới hệ thống Backend Laravel (POST /api/v1/admin/change-password)
 */
const handleSubmit = async () => {
    errorMessage.value = ''
    successMessage.value = ''

    if (form.value.newPassword !== form.value.confirmPassword) {
        errorMessage.value = 'Mật khẩu xác nhận không khớp!'
        return
    }

    isSubmitting.value = true

    try {
        const response = await AuthService.changePassword(
            form.value.currentPassword,
            form.value.newPassword,
            form.value.confirmPassword
        )

        successMessage.value = response.data?.message || 'Đổi mật khẩu thành công!'
        resetForm()

    } catch (error) {
        errorMessage.value =
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.'
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
/* Không cần viết thêm CSS phức tạp, mọi thứ đã dùng tiện ích Bootstrap 5 */
</style>
