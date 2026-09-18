<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">
            <div class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 class="fs-3 mb-1 fw-bold text-dark">Quản lý người dùng</h1>
                            <p class="mb-0 text-muted">Xem, thêm, sửa, xóa tài khoản người dùng</p>
                        </div>
                        <div>
                            <router-link to="/admin/add-admin" class="btn btn-primary fw-semibold shadow-sm">
                                <i class="ti ti-user-plus me-2"></i>Thêm người dùng
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TABS ĐIỀU HƯỚNG THEO VAI TRÒ -->
            <div class="row">
                <div class="col-12">
                    <ul class="nav nav-pills p-2 bg-white border rounded-4 shadow-sm mb-4 gap-2 flex-wrap">
                        <li class="nav-item flex-grow-1 text-center">
                            <button class="nav-link w-100 fw-bold py-2 rounded-3"
                                :class="{ 'active': roleFilter === 'all' }" @click="roleFilter = 'all'; fetchUsers(1)">
                                <i class="ti ti-users me-1"></i>Tất cả
                            </button>
                        </li>
                        <li class="nav-item flex-grow-1 text-center">
                            <button class="nav-link w-100 fw-bold py-2 rounded-3"
                                :class="{ 'active': roleFilter === 'renter' }" @click="roleFilter = 'renter'; fetchUsers(1)">
                                <i class="ti ti-user-check me-1"></i>Khách thuê
                            </button>
                        </li>
                        <li class="nav-item flex-grow-1 text-center">
                            <button class="nav-link w-100 fw-bold py-2 rounded-3"
                                :class="{ 'active': roleFilter === 'owner' }" @click="roleFilter = 'owner'; fetchUsers(1)">
                                <i class="ti ti-car me-1"></i>Chủ xe
                            </button>
                        </li>
                        <li class="nav-item flex-grow-1 text-center">
                            <button class="nav-link w-100 fw-bold py-2 rounded-3"
                                :class="{ 'active': roleFilter === 'staff' }" @click="roleFilter = 'staff'; fetchUsers(1)">
                                <i class="ti ti-headset me-1"></i>CSKH
                            </button>
                        </li>
                        <li class="nav-item flex-grow-1 text-center">
                            <button class="nav-link w-100 fw-bold py-2 rounded-3"
                                :class="{ 'active': roleFilter === 'coordinator' }" @click="roleFilter = 'coordinator'; fetchUsers(1)">
                                <i class="ti ti-list-check me-1"></i>Điều phối
                            </button>
                        </li>
                        <li class="nav-item flex-grow-1 text-center">
                            <button class="nav-link w-100 fw-bold py-2 rounded-3"
                                :class="{ 'active': roleFilter === 'admin' }" @click="roleFilter = 'admin'; fetchUsers(1)">
                                <i class="ti ti-shield-check me-1"></i>Admin
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                        <div class="input-group" style="max-width: 320px">
                            <span class="input-group-text bg-white border-end-0 text-muted">
                                <i class="ti ti-search"></i>
                            </span>
                            <input v-model="search" type="text" class="form-control border-start-0 ps-0"
                                placeholder="Tìm theo tên, email, SĐT..." @keyup.enter="fetchUsers(1)">
                        </div>
                        <div class="d-flex gap-2 flex-wrap">
                            <button class="btn btn-outline-secondary" @click="fetchUsers(1)">
                                <i class="ti ti-filter me-1"></i> Tìm kiếm
                            </button>
                        </div>
                    </div>

                    <div v-if="errorMessage" class="alert alert-danger py-2 px-3 mb-3" role="alert">
                        {{ errorMessage }}
                    </div>

                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light text-muted small fw-semibold">
                                    <tr>
                                        <th class="px-4 py-3">Người dùng</th>
                                        <th class="py-3">Liên hệ</th>
                                        <th class="py-3">Vai trò</th>
                                        <th class="py-3">Trạng thái KYC</th>
                                        <th class="py-3">Tài khoản</th>
                                        <th class="py-3 text-end pe-4">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody class="border-top-0">
                                    <tr v-if="loading">
                                        <td colspan="6" class="text-center py-5">
                                            <div class="spinner-border text-primary" role="status"></div>
                                        </td>
                                    </tr>

                                    <tr v-else-if="users.length === 0">
                                        <td colspan="6" class="text-center py-5 text-muted">Không tìm thấy người dùng
                                            nào.</td>
                                    </tr>

                                    <tr v-else v-for="user in users" :key="user.id">
                                        <td class="px-4 py-3">
                                            <div class="d-flex align-items-center">
                                                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3 text-uppercase"
                                                    style="width: 40px; height: 40px">
                                                    {{ getInitial(user.name) }}
                                                </div>
                                                <div>
                                                    <h6 class="mb-0 fw-bold">
                                                        <router-link class="text-dark text-decoration-none"
                                                            :to="{ name: 'admin-user-detail', params: { id: user.id } }">
                                                            {{ user.name }}
                                                        </router-link>
                                                    </h6>
                                                    <span class="text-muted small">Tham gia: {{
                                                        formatDate(user.created_at) }}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-3">
                                            <div class="text-dark">{{ user.email }}</div>
                                            <div class="text-muted small">{{ user.phone || 'Chưa cập nhật' }}</div>
                                        </td>
                                        <td class="py-3">
                                            <span v-for="role in user.roles" :key="role.id" class="badge me-1"
                                                :class="getRoleBadgeClass(role.slug)">
                                                {{ role.name }}
                                            </span>
                                        </td>
                                        <td class="py-3">
                                            <span :class="getKycClass(user.kyc_status)" class="small fw-bold">
                                                <i class="ti" :class="getKycIcon(user.kyc_status)"></i>
                                                {{ getKycText(user.kyc_status) }}
                                            </span>
                                        </td>
                                        <td class="py-3">
                                            <span class="badge px-2 py-1 rounded-2"
                                                :class="user.is_blacklisted ? 'bg-danger bg-opacity-10 text-danger border border-danger' : 'bg-success bg-opacity-10 text-success border border-success'">
                                                {{ user.is_blacklisted ? 'Bị khóa' : 'Hoạt động' }}
                                            </span>
                                        </td>
                                        <td class="py-3 text-end pe-4">
                                            <div v-if="isProtectedAdmin(user)" class="d-inline-flex align-items-center bg-warning bg-opacity-10 text-warning border border-warning px-2 py-1 rounded-3 small fw-bold shadow-sm" title="Tài khoản Master Admin / Hệ thống (Bất khả xâm phạm)">
                                                <i class="ti ti-shield-lock me-1 fs-6"></i> Bất khả thay đổi
                                            </div>
                                            <div v-else>
                                                <button class="btn btn-sm btn-light text-primary me-2" type="button" title="Sửa"
                                                    @click="openEditModal(user.id)">
                                                    <i class="ti ti-edit"></i>
                                                </button>
                                                <button class="btn btn-sm btn-light text-danger" type="button" title="Xóa"
                                                    @click="handleDelete(user)">
                                                    <i class="ti ti-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div
                            class="card-footer bg-white border-top p-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                            <span class="text-muted small">
                                Hiển thị {{ pagination.from }} đến {{ pagination.to }} trong số {{ pagination.total }}
                                người dùng
                            </span>
                            <nav v-if="pagination.last_page > 1" aria-label="Page navigation">
                                <ul class="pagination pagination-sm mb-0">
                                    <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                                        <a class="page-link" href="#"
                                            @click.prevent="fetchUsers(pagination.current_page - 1)">Trước</a>
                                    </li>
                                    <li v-for="page in pagination.last_page" :key="page" class="page-item"
                                        :class="{ active: pagination.current_page === page }">
                                        <a class="page-link" href="#" @click.prevent="fetchUsers(page)">{{ page }}</a>
                                    </li>
                                    <li class="page-item"
                                        :class="{ disabled: pagination.current_page === pagination.last_page }">
                                        <a class="page-link" href="#"
                                            @click.prevent="fetchUsers(pagination.current_page + 1)">Sau</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showEdit" class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header">
                        <h5 class="modal-title">Chỉnh sửa người dùng</h5>
                        <button type="button" class="btn-close" aria-label="Close" @click="showEdit = false"></button>
                    </div>
                    <form class="modal-body" @submit.prevent="handleUpdate">
                        <div class="mb-3">
                            <label class="form-label">Họ tên</label>
                            <input v-model="editForm.name" type="text" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input v-model="editForm.email" type="email" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Số điện thoại</label>
                            <input v-model="editForm.phone" type="text" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Địa chỉ</label>
                            <input v-model="editForm.address" type="text" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Vai trò</label>
                            <div v-if="isCustomerEdit" class="p-3 border rounded-3 bg-light text-muted small d-flex align-items-center">
                                <i class="ti ti-lock me-2 fs-5 text-secondary"></i>
                                <span>Tài khoản khách hàng (Chủ xe / Khách thuê) không yêu cầu và không hỗ trợ đổi vai trò sang nhân viên hệ thống.</span>
                            </div>
                            <select v-else v-model="editForm.role_slug" class="form-select">
                                <option value="">Giữ nguyên vai trò hiện tại</option>
                                <option v-for="role in editableRoles" :key="role.id" :value="role.slug">
                                    {{ role.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Mật khẩu mới (tùy chọn)</label>
                            <input v-model="editForm.password" type="password" class="form-control"
                                placeholder="Để trống nếu không đổi">
                        </div>
                        <div class="form-check mb-3">
                            <input id="blacklistedInput" v-model="editForm.is_blacklisted" class="form-check-input"
                                type="checkbox">
                            <label class="form-check-label" for="blacklistedInput">Khóa tài khoản (blacklist)</label>
                        </div>
                        <div class="d-flex justify-content-end gap-2">
                            <button type="button" class="btn btn-outline-secondary"
                                @click="showEdit = false">Hủy</button>
                            <button type="submit" class="btn btn-primary" :disabled="submitting">Lưu thay đổi</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div v-if="showEdit" class="modal-backdrop fade show"></div>
    </main>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CỔNG KẾT NỐI API (IMPORTS)
// ============================================================================
import { computed, onMounted, ref } from 'vue'
import AdminUserService from '@/services/admin-user.service'

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI & TRÌNH ĐIỀU CHUYỂN DANH SÁCH (STATE MANAGEMENT)
// ============================================================================
const loading = ref(false)         // Cờ hiển thị trạng thái đang tải dữ liệu
const errorMessage = ref('')     // Chuỗi thông báo lỗi truy vấn cơ sở dữ liệu
const search = ref('')           // Từ khóa tìm kiếm theo Tên, Email hoặc SĐT
const roleFilter = ref('all')    // Bộ lọc hiển thị theo Vai trò / Phân quyền
const users = ref([])            // Danh sách thành viên thu được từ Backend
const roleOptions = ref([])      // Danh sách các Quyền (Roles) có thể gán khi cấp tài khoản
const roleFilterOptions = ref([])// Danh sách các Quyền xuất hiện trên thanh Bộ lọc

// Trạng thái quản lý Hộp thoại (Modal) chỉnh sửa thông tin thành viên
const showEdit = ref(false)
const submitting = ref(false)
const editForm = ref({
    id: null,
    name: '',
    email: '',
    phone: '',
    address: '',
    role_slug: '',
    password: '',
    is_blacklisted: false,       // Cờ đưa vào Danh sách đen (Khóa cấm thuê/cho thuê)
    roles: [],
})

// ============================================================================
// 3. THUẬT TOÁN HẢO TRUNG - KIỂM TOÁN VAI TRÒ & PHÂN TRANG (COMPUTED & RBAC)
// ============================================================================
// Kiểm tra xem đối tượng đang sửa là Khách hay Chủ xe (Để áp dụng quy chế giao diện phù hợp)
const isCustomerEdit = computed(() => {
    return (editForm.value.roles || []).some(r => ['owner', 'renter'].includes(r.slug))
})

// Hồ sơ biến quản lý Bộ phân trang chuyên sâu (Pagination)
const pagination = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
})

/**
 * Kiểm tra tài khoản Quản trị viên Tối cao (Protected Admin) để TRÁNH thao tác Khóa/Xóa nhầm
 */
const isProtectedAdmin = (user) => {
    return user.email === 'admin@autocar.vn' || user.id === 1
}

// ============================================================================
// 4. BỘ HÀM TIỆN ÍCH HIỂN THỊ HỒ SƠ & TRÌNH TRANG THÁI (UI FORMATTERS)
// ============================================================================
// Trích xuất chữ cái đầu tiên của Họ tên để in lên thẻ Avatar mặc định
const getInitial = (name) => (name || '?').trim().charAt(0)

// Định dạng ngày tham gia về mẫu Tháng/Năm (MM/YYYY)
const formatDate = (value) => {
    if (!value) return 'N/A'
    const d = new Date(value)
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

/**
 * Quy định màu sắc nhãn Bootstrap cho 9 phân cấp Vai trò hệ thống (RBAC Slugs)
 */
const getRoleBadgeClass = (slug) => {
    switch (slug) {
        case 'master_admin':
        case 'admin':
            return 'bg-danger'        // Quản trị viên cao cấp -> Đỏ nhạt quyền lực
        case 'coordinator':
            return 'bg-warning text-dark' // Điều phối viên Ops -> Vàng
        case 'ops_admin':
            return 'bg-primary'       // Chuyên viên Vận hành -> Xanh Dương
        case 'cskh':
        case 'support':
        case 'staff':
            return 'bg-info text-dark'// Nhân viên hỗ trợ CSKH -> Xanh ngọc
        case 'owner':
            return 'bg-primary bg-opacity-75' // Chủ xe cho thuê
        case 'renter':
            return 'bg-secondary'     // Khách thuê xe thành viên
        default:
            return 'bg-dark'
    }
}

// Các bộ tiện ích nhận dạng trạng thái Xác thực định danh (CCCD KYC)
const getKycClass = (status) => {
    if (status === 'approved') return 'text-success'
    if (status === 'rejected') return 'text-danger'
    return 'text-warning'
}

const getKycIcon = (status) => {
    if (status === 'approved') return 'ti-circle-check me-1'
    if (status === 'rejected') return 'ti-circle-x me-1'
    return 'ti-clock me-1'
}

const getKycText = (status) => {
    if (status === 'approved') return 'Đã duyệt'
    if (status === 'rejected') return 'Từ chối'
    return 'Chờ duyệt'
}

// ============================================================================
// 5. CÁC NGHIỆP VỤ TƯƠNG TÁC DỮ LIỆU BACKEND LARAVEL (DATA HYDRATION APIS)
// ============================================================================
/**
 * Tải danh sách người dùng từ hệ thống cơ sở dữ liệu có kèm bộ lọc và từ khóa tra cứu
 */
const fetchUsers = async (page = 1) => {
    if (page < 1) return

    loading.value = true
    errorMessage.value = ''
    try {
        const response = await AdminUserService.getUsers({
            page,
            role_slug: roleFilter.value,
            search: search.value,
            per_page: 10,
        })

        if (response.data?.success) {
            const payload = response.data.data
            users.value = payload.data || []
            pagination.value = {
                current_page: payload.current_page,
                last_page: payload.last_page,
                total: payload.total,
                from: payload.from || 0,
                to: payload.to || 0,
            }

            // Đồng bộ danh sách Quyền hạn đang tồn tại vào thanh Bộ lọc
            const roleMap = new Map(roleFilterOptions.value.map((role) => [role.slug, role]))
            users.value.forEach((user) => {
                ; (user.roles || []).forEach((role) => {
                    if (role?.slug && !roleMap.has(role.slug)) {
                        roleMap.set(role.slug, { slug: role.slug, name: role.name || role.slug })
                    }
                })
            })
            roleFilterOptions.value = Array.from(roleMap.values())
        }
    } catch (error) {
        users.value = []
        pagination.value = {
            current_page: 1,
            last_page: 1,
            total: 0,
            from: 0,
            to: 0,
        }
        errorMessage.value = error?.response?.data?.message || 'Không thể tải dữ liệu người dùng từ database.'
    } finally {
        loading.value = false
    }
}

/**
 * Tải danh sách các Vai trò có khả năng phân quyền (Assignable Roles) từ máy chủ
 */
const fetchRoleOptions = async () => {
    try {
        const response = await AdminUserService.getAssignableRoles()
        if (response.data?.success) {
            roleOptions.value = response.data.data || []

            const dynamicRoles = response.data.data || []
            const merged = [...roleFilterOptions.value]
            dynamicRoles.forEach((role) => {
                if (!merged.find((item) => item.slug === role.slug)) {
                    merged.push({ slug: role.slug, name: role.name })
                }
            })
            roleFilterOptions.value = merged
        }
    } catch {
        roleOptions.value = []
    }
}

const editableRoles = roleOptions

// ============================================================================
// 6. NGHIỆP VỤ CHỈNH SỬA VÀ THAY ĐỔI HỒ SƠ THÀNH VIÊN (UPDATE & DELETE ACTIONS)
// ============================================================================
/**
 * Mở hộp thoại chỉnh sửa thành viên và điền dữ liệu chi tiết của User đó
 */
const openEditModal = async (id) => {
    try {
        const response = await AdminUserService.getUserById(id)
        if (response.data?.success) {
            const user = response.data.data
            editForm.value = {
                id: user.id,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                role_slug: '',
                password: '',
                is_blacklisted: !!user.is_blacklisted,
                roles: user.roles || [],
            }
            showEdit.value = true
        }
    } catch (error) {
        alert(error?.response?.data?.message || 'Không thể lấy dữ liệu để chỉnh sửa.')
    }
}

/**
 * Gửi yêu cầu cập nhật (Họ tên, SĐT, Địa chỉ, Đổi Quyền hoặc Blacklist) lên Backend
 */
const handleUpdate = async () => {
    if (!editForm.value.id) return

    const payload = {
        name: editForm.value.name,
        email: editForm.value.email,
        phone: editForm.value.phone || null,
        address: editForm.value.address || null,
        is_blacklisted: editForm.value.is_blacklisted,
    }

    if (editForm.value.role_slug) {
        payload.role_slug = editForm.value.role_slug
    }
    if (editForm.value.password) {
        payload.password = editForm.value.password
    }

    submitting.value = true
    try {
        const response = await AdminUserService.updateUser(editForm.value.id, payload)
        if (response.data?.success) {
            alert('Cập nhật người dùng thành công!')
            showEdit.value = false
            await fetchUsers(pagination.value.current_page)
        }
    } catch (error) {
        alert(error?.response?.data?.message || 'Không thể cập nhật người dùng.')
    } finally {
        submitting.value = false
    }
}

/**
 * Nghiệp vụ thủ tiêu/xóa vĩnh viễn tài khoản Người dùng khỏi hệ thống
 */
const handleDelete = async (user) => {
    if (!confirm(`Bạn có chắc muốn xóa người dùng ${user.name}?`)) {
        return
    }

    try {
        const response = await AdminUserService.deleteUser(user.id)
        if (response.data?.success) {
            alert('Xóa người dùng thành công!')
            await fetchUsers(pagination.value.current_page)
        }
    } catch (error) {
        alert(error?.response?.data?.message || 'Không thể xóa người dùng.')
    }
}

// ============================================================================
// 7. MÓC DẪN VÒNG ĐỜI HÀI HÒA HỆ THỐNG (LIFECYCLE HOOKS)
// ============================================================================
onMounted(async () => {
    await fetchRoleOptions()
    await fetchUsers()
})
</script>
