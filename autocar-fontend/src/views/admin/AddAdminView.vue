<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100 d-flex flex-column">
        <div class="container-fluid pt-3 d-flex flex-column grow">

            <div class="row shrink-0">
                <div class="col-12">
                    <div
                        class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                        <div>
                            <h1 class="fs-3 mb-1 fw-bold text-dark">Thêm người dùng mới</h1>
                            <p class="mb-0 text-muted">Tạo tài khoản và gán vai trò trực tiếp từ hệ thống quản trị</p>
                        </div>
                        <div>
                            <router-link to="/admin/user-management"
                                class="btn btn-white border bg-white fw-semibold text-dark shadow-sm px-4 py-2">
                                <i class="fas fa-arrow-left me-2"></i>Quay lại danh sách
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row grow">
                <div class="col-12 d-flex flex-column">
                    <div class="card border-0 shadow-sm rounded-4 grow">
                        <div class="card-body p-4 p-xl-5 d-flex flex-column">

                            <h5 class="mb-4 border-bottom pb-3 fw-bold text-dark fs-5">
                                <i class="fas fa-user-shield text-primary me-2"></i>Thông tin người dùng
                            </h5>

                            <form id="addAdminForm" @submit.prevent="handleAddAdmin"
                                class="grow d-flex flex-column">

                                <div class="row g-4 mb-4">
                                    <div class="col-md-6">
                                        <label for="adminName" class="form-label fw-semibold text-dark mb-2">Họ và Tên
                                            <span class="text-danger">*</span></label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            id="adminName" placeholder="VD: Nguyễn Văn A" required v-model="form.name"
                                            :disabled="loading">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="adminEmail" class="form-label fw-semibold text-dark mb-2">Địa chỉ
                                            Email <span class="text-danger">*</span></label>
                                        <input type="email"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            id="adminEmail" placeholder="VD: admin@autocar.com" required
                                            v-model="form.email" :disabled="loading">
                                    </div>
                                </div>

                                <div class="row g-4 mb-4">
                                    <div class="col-md-6">
                                        <label for="adminPassword" class="form-label fw-semibold text-dark mb-2">Mật
                                            khẩu tạm thời <span class="text-danger">*</span></label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            id="adminPassword" placeholder="Tự động tạo: tên + vai trò + 123" required
                                            v-model="form.password" :disabled="loading">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="adminPhone" class="form-label fw-semibold text-dark mb-2">Số điện
                                            thoại <span class="text-danger">*</span></label>
                                        <input type="tel"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            id="adminPhone" placeholder="Nhập số điện thoại" required
                                            v-model="form.phone" :disabled="loading">
                                    </div>
                                </div>

                                <div class="row g-4 mb-4">
                                    <div class="col-md-6">
                                        <label for="adminRole" class="form-label fw-semibold text-dark mb-2">Vai trò
                                            (Phân quyền) <span class="text-danger">*</span></label>
                                        <select class="form-select form-select-lg bg-light border-0 fs-6 py-3"
                                            id="adminRole" required v-model="form.role_slug" :disabled="loading">
                                            <option value="" selected disabled>-- Chọn vai trò --</option>
                                            <option v-for="role in roles" :key="role.id" :value="role.slug">{{ role.name
                                            }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="adminAvatar" class="form-label fw-semibold text-dark mb-2">Ảnh đại
                                            diện (Tùy chọn)</label>
                                        <input type="file"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            id="adminAvatar" accept="image/*" disabled>
                                    </div>
                                </div>

                                <div class="mb-5 grow d-flex flex-column">
                                    <label for="adminNote" class="form-label fw-semibold text-dark mb-2">Ghi chú nội
                                        bộ</label>
                                    <textarea class="form-control bg-light border-0 grow" id="adminNote"
                                        style="min-height: 150px;"
                                        placeholder="Ghi chú về chức vụ hoặc bộ phận làm việc của nhân sự này..."
                                        v-model="form.note" :disabled="loading"></textarea>
                                </div>

                                <div class="d-flex gap-3 pt-4 border-top justify-content-end mt-auto">
                                    <button type="reset"
                                        class="btn btn-white border bg-white px-5 py-3 fw-semibold rounded-3 text-dark"
                                        :disabled="loading" @click="resetForm">
                                        Nhập lại
                                    </button>
                                    <button type="submit" class="btn btn-primary px-5 py-3 fw-bold rounded-3 fs-6"
                                        :disabled="loading">
                                        <i class="fas fa-user-plus me-2"></i>Tạo tài khoản
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
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH THEO DÕI BIẾNN ĐỘNG WATCHER (IMPORTS)
// ============================================================================
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AdminUserService from '@/services/admin-user.service'

const router = useRouter()

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI & HỢP KHÍ GIAO THỰC BẢO NHÂN (STATE MANAGEMENT)
// ============================================================================
const loading = ref(false)         // Cờ khóa nút bấm trong khi đang đệ trình
const roles = ref([])              // Danh sách Vai trò có thể lựa chọn (Master Admin, CSKH, Điều phối...)
const form = ref({
    name: '',
    email: '',
    password: '',
    phone: '',
    role_slug: '',                 // Mã Vai trò RBAC (Slug) được phân quyền
    note: '',
})

// ============================================================================
// 3. THUẬT TOÁN LOẠI BỎ DẤU TỪ C HUẨN VĂN BẢN (STRING NORMALIZATION UTILS)
// ============================================================================
/**
 * Chuyển hóa chuỗi tiếng Việt có dấu thành chuỗi không dấu thuần Latin mượt mà
 */
const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "a");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "e");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "i");
    str = str.replace(/Ò|Ó|Ọ|ỏ|õ|Ô|Ồ|Ố|Ộ|Ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "u");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "y");
    str = str.replace(/Đ/g, "d");
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Trích xuất từ tên riêng cuối cùng từ toàn bộ Họ và Tên (ví dụ: "Nguyễn Văn Hưng" -> "hung")
 */
const getFirstName = (fullName) => {
    if (!fullName) return ''
    const parts = fullName.trim().split(/\s+/)
    const lastWord = parts[parts.length - 1]
    return removeVietnameseTones(lastWord)
}

/**
 * Nhận diện chuỗi hậu tố theo quyền hạn chức vụ (Coordinator -> dieuphoi, Staff/Support -> cskh)
 */
const getRoleSuffix = (slug) => {
    if (slug === 'coordinator') return 'dieuphoi'
    if (slug === 'staff' || slug === 'support') return 'cskh'
    return ''
}

// ============================================================================
// 4. TRÌNH TỰ ĐÔNG SINH TÀI KHOẢN VÀ MẬT KHẢU THEO QUY CHẾ VAI TRÒ (AUTO GENERATOR WATCHER)
// ============================================================================
/**
 * Theo dõi hai tham số Họ Tên & Quyền Hạn (RBAC Role) để Tự động gợi ý Email & Mật khẩu
 * Ví dụ: Tên "An" + Quyền "support" -> Email: ancskh@gmail.com, Password: ancskh123
 */
watch([() => form.value.name, () => form.value.role_slug], ([newName, newRole]) => {
    const firstName = getFirstName(newName)
    const roleSuffix = getRoleSuffix(newRole)
    if (firstName && roleSuffix) {
        form.value.email = `${firstName}${roleSuffix}@gmail.com`
        form.value.password = `${firstName}${roleSuffix}123`
    }
})

/**
 * Làm mới toàn bộ nội dung Biểu mẫu về rỗng ban đầu
 */
const resetForm = () => {
    form.value = {
        name: '',
        email: '',
        password: '',
        phone: '',
        role_slug: '',
        note: '',
    }
}

// ============================================================================
// 5. CÁC CẦU KẾT NỐI HỆ THỐNG VÀ XỬ LÝ NỘP TÀI KHOẢN MỚI (API HANDLERS)
// ============================================================================
/**
 * Tải danh sách vai trò có thẩm quyền ban cấp từ Backend Laravel
 */
const fetchRoles = async () => {
    try {
        const response = await AdminUserService.getAssignableRoles()
        if (response.data?.success) {
            roles.value = response.data.data || []
        }
    } catch (error) {
        roles.value = []
    }
}

/**
 * Thực thi Khai sinh tài khoản nội bộ bộ máy Ban Quản Trị và Cấp quyền ngay lập tức
 */
const handleAddAdmin = async () => {
    if (!form.value.name || !form.value.email || !form.value.password || !form.value.phone || !form.value.role_slug) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc.')
        return
    }

    if (!confirm('Bạn có chắc chắn muốn tạo người dùng này không? Hệ thống sẽ cấp quyền truy cập ngay lập tức.')) {
        return
    }

    loading.value = true
    try {
        const payload = {
            name: form.value.name,
            email: form.value.email,
            password: form.value.password,
            phone: form.value.phone,
            role_slug: form.value.role_slug,
        }

        const response = await AdminUserService.createUser(payload)
        if (response.data?.success) {
            alert('Tạo tài khoản thành công!')
            router.push('/admin/user-management')
        }
    } catch (error) {
        alert(error?.response?.data?.message || 'Không thể tạo tài khoản. Vui lòng thử lại.')
    } finally {
        loading.value = false
    }
}

// ============================================================================
// 6. MÓC DẪN VÒNG ĐỜI KHỞI TẠO BIỂU MẪU (LIFECYCLE HOOKS)
// ============================================================================
onMounted(() => {
    fetchRoles()
})
</script>
