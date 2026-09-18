<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">
            <div class="row mb-4 align-items-center">
                <div class="col-md-8">
                    <h1 class="fs-3 fw-bold text-dark mb-2">Hồ sơ cá nhân</h1>
                    <p class="text-muted fs-6 mb-0">Quản lý thông tin tài khoản, ảnh đại diện và liên hệ của Quản trị viên.</p>
                </div>
                <div class="col-md-4 text-md-end mt-3 mt-md-0">
                    <router-link :to="{ name: 'admin-change-password' }" class="btn btn-outline-primary fw-bold rounded-3 px-4 py-2">
                        <i class="ti ti-lock me-2"></i>Đổi mật khẩu
                    </router-link>
                </div>
            </div>

            <div class="row g-4">
                <!-- Thẻ tóm tắt Profile bên trái -->
                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm rounded-4 text-center p-4">
                        <div class="card-body">
                            <div class="position-relative d-inline-block mb-3">
                                <img :src="avatarPreview || '/img/team-1.jpg'" alt="Avatar Admin" 
                                     class="rounded-circle object-fit-cover shadow-sm border border-3 border-white"
                                     style="width: 140px; height: 140px;" />
                                <label for="avatarUpload" 
                                       class="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0 p-2 shadow"
                                       title="Thay đổi ảnh đại diện" style="cursor: pointer;">
                                    <i class="ti ti-camera fs-5"></i>
                                </label>
                                <input type="file" id="avatarUpload" class="d-none" accept="image/*" @change="handleAvatarChange" />
                            </div>

                            <h4 class="fw-bold text-dark mb-1">{{ form.name || 'Admin' }}</h4>
                            <p class="text-muted small mb-3">{{ form.email }}</p>

                            <div class="d-flex justify-content-center gap-2 flex-wrap mb-4">
                                <span v-for="role in roleBadges" :key="role.slug" class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fs-7 fw-bold text-uppercase">
                                    <i class="ti ti-shield me-1"></i>{{ role.name || role.slug }}
                                </span>
                            </div>

                            <hr class="border-secondary border-opacity-10 mb-4">

                            <div class="text-start small">
                                <div class="d-flex justify-content-between mb-3">
                                    <span class="text-muted">Ngày tham gia:</span>
                                    <span class="fw-bold text-dark">{{ joinDate || 'N/A' }}</span>
                                </div>
                                <div class="d-flex justify-content-between mb-3">
                                    <span class="text-muted">Trạng thái tài khoản:</span>
                                    <span class="badge bg-success rounded-pill px-2">Đang hoạt động</span>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <span class="text-muted">Phân quyền bảo mật:</span>
                                    <span class="fw-bold text-primary">Quản trị nội bộ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cập nhật thông tin bên phải -->
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm rounded-4">
                        <div class="card-body p-4 p-lg-5">
                            <h5 class="fw-bold text-dark mb-4 fs-5">Cập nhật thông tin chi tiết</h5>

                            <div v-if="successMessage" class="alert alert-success rounded-3 border-0 shadow-sm mb-4" role="alert">
                                <i class="ti ti-circle-check me-2"></i>{{ successMessage }}
                            </div>
                            <div v-if="errorMessage" class="alert alert-danger rounded-3 border-0 shadow-sm mb-4" role="alert">
                                <i class="ti ti-alert-circle me-2"></i>{{ errorMessage }}
                            </div>

                            <form @submit.prevent="handleSubmit">
                                <div class="mb-4">
                                    <label class="form-label text-muted small fw-semibold mb-2">Họ và tên hiển thị <span class="text-danger">*</span></label>
                                    <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-white">
                                        <span class="input-group-text bg-transparent border-0 text-muted ps-3">
                                            <i class="ti ti-user"></i>
                                        </span>
                                        <input type="text" class="form-control border-0 bg-transparent fs-6 shadow-none"
                                            v-model="form.name" placeholder="Nhập họ và tên quản trị viên" required>
                                    </div>
                                </div>

                                <div class="row g-3 mb-4">
                                    <div class="col-md-6">
                                        <label class="form-label text-muted small fw-semibold mb-2">Địa chỉ Email (Tài khoản Đăng nhập)</label>
                                        <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-light opacity-75">
                                            <span class="input-group-text bg-transparent border-0 text-muted ps-3">
                                                <i class="ti ti-mail"></i>
                                            </span>
                                            <input type="email" class="form-control border-0 bg-transparent fs-6 shadow-none"
                                                :value="form.email" disabled title="Email đăng nhập không thể tự ý thay đổi">
                                        </div>
                                        <small class="text-muted mt-1 d-block" style="font-size: 11px;">* Để thay đổi Email đăng nhập, vui lòng liên hệ Master Admin.</small>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label text-muted small fw-semibold mb-2">Số điện thoại liên hệ</label>
                                        <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-white">
                                            <span class="input-group-text bg-transparent border-0 text-muted ps-3">
                                                <i class="ti ti-phone"></i>
                                            </span>
                                            <input type="text" class="form-control border-0 bg-transparent fs-6 shadow-none"
                                                v-model="form.phone" placeholder="Nhập số điện thoại (tùy chọn)">
                                        </div>
                                    </div>
                                </div>

                                <div class="mb-5">
                                    <label class="form-label text-muted small fw-semibold mb-2">Địa chỉ làm việc / Văn phòng</label>
                                    <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-white">
                                        <span class="input-group-text bg-transparent border-0 text-muted ps-3">
                                            <i class="ti ti-map-pin"></i>
                                        </span>
                                        <input type="text" class="form-control border-0 bg-transparent fs-6 shadow-none"
                                            v-model="form.address" placeholder="Nhập địa chỉ cơ quan hoặc khu vực">
                                    </div>
                                </div>

                                <div class="d-flex justify-content-end gap-3">
                                    <button type="button" @click="loadUserData" class="btn btn-light px-4 py-2 rounded-3 fw-bold text-muted">
                                        Khôi phục
                                    </button>
                                    <button type="submit" class="btn btn-primary px-5 py-2 fw-bold text-white rounded-3 shadow-sm"
                                        :disabled="isSubmitting">
                                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        {{ isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi' }}
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
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH TRỌN ĐẦU NỐI PROFILE (IMPORTS)
// ============================================================================
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store' // Kho thông tin tài khoản phiên đăng nhập
import ProfileService from '@/services/profile.service' // Dịch vụ quản lý Hồ sơ & Ảnh đại diện

const authStore = useAuthStore()

// ============================================================================
// 2. KHỞI TẠO BIỂU MẪU HỔ SƠ & BIẾN TRẠNG THÁI HIỂN THỊ (STATE MANAGEMENT)
// ============================================================================
const form = ref({
    name: '',          // Họ và tên Quản trị viên
    email: '',         // Địa chỉ hộp thư (Khóa không chỉnh sửa)
    phone: '',         // Số điện thoại liên hệ cá nhân
    address: ''        // Địa chỉ công tác/thường trú
})

const avatarPreview = ref('/img/team-1.jpg') // Ảnh đại diện mặc định hoặc sau tải lên
const joinDate = ref('')                     // Ngày tham gia bộ máy quản trị hệ thống
const isSubmitting = ref(false)              // Cờ khóa nút Khi đang ghi nhận cập nhật
const successMessage = ref('')               // Thông báo chúc mừng khi lưu thành công
const errorMessage = ref('')                 // Thông báo cảnh báo lỗi kỹ thuật

// Ánh xạ danh sách Huy hiệu Quyền Hạn (Role Badges) từ Auth Store
const roleBadges = computed(() => {
    return authStore.user?.roles || [{ slug: 'admin', name: 'Quản trị viên' }]
})

// ============================================================================
// 3. TRÌNH NẠP THÔNG TIN CÁ NHÂN & KẾT GIAO VỚI STORE (DATA HYDRATION)
// ============================================================================
/**
 * Nạp thông tin tài khoản hiện tại từ máy chủ hoặc đồng bộ lại từ Auth Store
 */
const loadUserData = async () => {
    try {
        const res = await ProfileService.getMe()
        const userData = res.data?.data || authStore.user || {}
        
        form.value.name = userData.name || ''
        form.value.email = userData.email || ''
        form.value.phone = userData.phone || ''
        form.value.address = userData.address || ''
        
        if (userData.avatar) {
            avatarPreview.value = userData.avatar
        }
        
        if (userData.created_at) {
            const date = new Date(userData.created_at)
            joinDate.value = date.toLocaleDateString('vi-VN')
        }
        
        authStore.updateUser(userData)
    } catch (err) {
        console.error("Lỗi tải thông tin cá nhân Admin:", err)
        if (authStore.user) {
            form.value.name = authStore.user.name || ''
            form.value.email = authStore.user.email || ''
            form.value.phone = authStore.user.phone || ''
            form.value.address = authStore.user.address || ''
        }
    }
}

// ============================================================================
// 4. NGHIỆP VỤ TẢI HÌNH TRỰC TIẾP & BẢO DIỄN CẬP NHẬT (AVATAR & PROFILE UPDATE)
// ============================================================================
/**
 * Xử lý sự kiện thay đổi hình đại diện (Avatar):
 * Tự động tạo ảnh xem trước ngay lập tức và gửi FormData lên máy chủ
 */
const handleAvatarChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
        const oldPreview = avatarPreview.value
        avatarPreview.value = URL.createObjectURL(file) // Tạo ảnh preview cục bộ
        try {
            const formData = new FormData()
            formData.append('avatar', file)
            const res = await ProfileService.updateAvatar(formData)
            successMessage.value = res.data?.message || 'Cập nhật ảnh đại diện thành công!'
            if (res.data?.data) {
                authStore.updateUser(res.data.data)
            } else if (res.data?.avatar && authStore.user) {
                authStore.updateUser({ ...authStore.user, avatar: res.data.avatar })
            }
            setTimeout(() => { successMessage.value = '' }, 4000)
        } catch (error) {
            console.error('Lỗi upload avatar Admin:', error)
            avatarPreview.value = oldPreview
            const serverErr = error.response?.data?.errors?.avatar?.[0] || error.response?.data?.message
            errorMessage.value = serverErr || 'Tải lên ảnh đại diện thất bại! Vui lòng kiểm tra dung lượng và định dạng ảnh.'
            setTimeout(() => { errorMessage.value = '' }, 5000)
        }
    }
}

/**
 * Lưu các thông tin cá nhân (Tên, số điện thoại, địa chỉ) lên Hệ thống Quản trị
 */
const handleSubmit = async () => {
    successMessage.value = ''
    errorMessage.value = ''
    isSubmitting.value = true

    try {
        const res = await ProfileService.updateProfile({
            name: form.value.name,
            phone: form.value.phone,
            address: form.value.address
        })
        
        successMessage.value = res.data?.message || 'Cập nhật hồ sơ thành công!'
        if (res.data?.data || authStore.user) {
            authStore.updateUser({
                ...authStore.user,
                name: form.value.name,
                phone: form.value.phone,
                address: form.value.address
            })
        }
        setTimeout(() => { successMessage.value = '' }, 5000)
    } catch (err) {
        console.error("Lỗi cập nhật profile Admin:", err)
        errorMessage.value = err.response?.data?.message || 'Có lỗi xảy ra khi lưu thay đổi.'
    } finally {
        isSubmitting.value = false
    }
}

// ============================================================================
// 5. MÓC DẪN VÒNG ĐỜI COMPONENT (LIFECYCLE HOOKS)
// ============================================================================
onMounted(() => {
    loadUserData()
})
</script>
