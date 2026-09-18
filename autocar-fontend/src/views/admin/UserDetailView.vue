<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 class="fs-3 mb-1 fw-bold text-dark">Chi tiết người dùng</h1>
                    <p class="mb-0 text-muted">Thông tin hồ sơ và dữ liệu theo vai trò</p>
                </div>
                <router-link to="/admin/user-management" class="btn btn-outline-secondary">
                    <i class="ti ti-arrow-left me-1"></i>Quay lại
                </router-link>
            </div>

            <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
            </div>

            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
            </div>

            <template v-else-if="user">
                <ul class="nav nav-tabs mb-4">
                    <li class="nav-item">
                        <button type="button" class="nav-link" :class="{ active: activeTab === 'overview' }"
                            @click="setActiveTab('overview')">
                            Thông tin
                        </button>
                    </li>
                    <li v-if="isRenter" class="nav-item">
                        <button type="button" class="nav-link" :class="{ active: activeTab === 'bookings' }"
                            @click="setActiveTab('bookings')">
                            Chuyến đi
                        </button>
                    </li>
                    <li v-if="isOwner" class="nav-item">
                        <button type="button" class="nav-link" :class="{ active: activeTab === 'vehicles' }"
                            @click="setActiveTab('vehicles')">
                            Xe
                        </button>
                    </li>
                </ul>

                <div v-if="activeTab === 'overview'" class="card border-0 shadow-sm rounded-4 mb-4">
                    <div class="card-body p-4">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <h5 class="fw-bold mb-3">Thông tin cơ bản</h5>
                                <p class="mb-2"><strong>Họ tên:</strong> {{ user.name || 'N/A' }}</p>
                                <p class="mb-2"><strong>Email:</strong> {{ user.email || 'N/A' }}</p>
                                <p class="mb-2"><strong>Số điện thoại:</strong> {{ user.phone || 'Chưa cập nhật' }}</p>
                                <p class="mb-2"><strong>Địa chỉ:</strong> {{ user.address || 'Chưa cập nhật' }}</p>
                                <p class="mb-0"><strong>Ngày tạo:</strong> {{ formatDateTime(user.created_at) }}</p>
                            </div>

                            <div class="col-md-6">
                                <h5 class="fw-bold mb-3">Trạng thái hệ thống</h5>
                                <p class="mb-2">
                                    <strong>Vai trò:</strong>
                                    <span v-if="user.roles?.length" class="ms-1">
                                        <span v-for="role in user.roles" :key="role.id" class="badge me-1"
                                            :class="getRoleBadgeClass(role.slug)">
                                            {{ role.name }}
                                        </span>
                                    </span>
                                    <span v-else>Chưa gán</span>
                                </p>
                                <p class="mb-2"><strong>KYC:</strong> {{ getKycText(user.kyc_status) }}</p>
                                <p class="mb-2">
                                    <strong>Tài khoản:</strong>
                                    <span class="badge ms-1" :class="user.is_blacklisted ? 'bg-danger' : 'bg-success'">
                                        {{ user.is_blacklisted ? 'Bị khóa' : 'Hoạt động' }}
                                    </span>
                                </p>
                                <p class="mb-2"><strong>Ví khả dụng:</strong> {{
                                    formatMoney(user.wallet?.available_balance) }}</p>
                                <p class="mb-0"><strong>Ví ký quỹ:</strong> {{ formatMoney(user.wallet?.deposit_balance)
                                }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="activeTab === 'bookings' && isRenter" class="card border-0 shadow-sm rounded-4 mb-4">
                    <div
                        class="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <h5 class="mb-1 fw-bold">Danh sách chuyến đi của khách thuê</h5>
                            <div class="small text-muted">Tổng: {{ bookingTotal }} | Lọc: {{ bookingFilterLabel }}</div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <label for="bookingsStatus" class="small text-muted mb-0">Trạng thái</label>
                            <select id="bookingsStatus" v-model="bookingsStatus" class="form-select form-select-sm"
                                @change="onBookingsFilterChange">
                                <option value="all">Tất cả</option>
                                <option value="pending_approval">Chờ chủ xe duyệt</option>
                                <option value="pending_payment">Chờ thanh toán</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="in_progress">Đang diễn ra</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <div v-if="renterTrips.length === 0" class="text-muted p-4">Người dùng này chưa có chuyến đi
                            nào.</div>
                        <div v-else class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="px-4 py-3">Mã chuyến</th>
                                        <th class="py-3">Xe</th>
                                        <th class="py-3">Thời gian thuê</th>
                                        <th class="py-3">Trạng thái</th>
                                        <th class="py-3 text-end pe-4">Tổng tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="trip in renterTrips" :key="trip.id">
                                        <td class="px-4 py-3">
                                            <router-link :to="{ name: 'admin-booking-detail', params: { id: trip.id } }"
                                                class="text-decoration-none">
                                                #{{ trip.id }}
                                            </router-link>
                                        </td>
                                        <td class="py-3">
                                            {{ getVehicleLabel(trip.vehicle) }}
                                            <div class="small text-muted">{{ trip.vehicle?.license_plate || 'N/A' }}
                                            </div>
                                        </td>
                                        <td class="py-3">
                                            <div>{{ formatDateTime(trip.start_datetime) }}</div>
                                            <div class="small text-muted">đến {{ formatDateTime(trip.end_datetime) }}
                                            </div>
                                        </td>
                                        <td class="py-3">
                                            <span class="badge text-bg-secondary">{{ getBookingStatusText(trip.status)
                                            }}</span>
                                        </td>
                                        <td class="py-3 text-end pe-4 fw-semibold">{{ formatMoney(trip.total_amount) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div v-if="bookingPagination.last_page > 1"
                        class="card-footer bg-white border-top p-3 d-flex justify-content-end">
                        <ul class="pagination pagination-sm mb-0">
                            <li class="page-item" :class="{ disabled: bookingPagination.current_page === 1 }">
                                <a class="page-link" href="#"
                                    @click.prevent="goToBookingsPage(bookingPagination.current_page - 1)">Trước</a>
                            </li>
                            <li v-for="page in bookingPagination.last_page" :key="`booking-page-${page}`"
                                class="page-item" :class="{ active: bookingPagination.current_page === page }">
                                <a class="page-link" href="#" @click.prevent="goToBookingsPage(page)">{{ page }}</a>
                            </li>
                            <li class="page-item"
                                :class="{ disabled: bookingPagination.current_page === bookingPagination.last_page }">
                                <a class="page-link" href="#"
                                    @click.prevent="goToBookingsPage(bookingPagination.current_page + 1)">Sau</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div v-if="activeTab === 'vehicles' && isOwner" class="card border-0 shadow-sm rounded-4">
                    <div
                        class="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <h5 class="mb-1 fw-bold">Danh sách xe của chủ xe</h5>
                            <div class="small text-muted">Tổng: {{ vehicleTotal }} | Lọc: {{ vehicleFilterLabel }}</div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <label for="vehiclesStatus" class="small text-muted mb-0">Trạng thái</label>
                            <select id="vehiclesStatus" v-model="vehiclesStatus" class="form-select form-select-sm"
                                @change="onVehiclesFilterChange">
                                <option value="all">Tất cả</option>
                                <option value="pending">Chờ duyệt</option>
                                <option value="available">Sẵn sàng</option>
                                <option value="rented">Đang cho thuê</option>
                                <option value="maintenance">Bảo trì</option>
                                <option value="locked">Đã khóa</option>
                            </select>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <div v-if="ownerVehicles.length === 0" class="text-muted p-4">Người dùng này chưa đăng xe nào.
                        </div>
                        <div v-else class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="px-4 py-3">Mã xe</th>
                                        <th class="py-3">Mẫu xe</th>
                                        <th class="py-3">Biển số</th>
                                        <th class="py-3">Trạng thái</th>
                                        <th class="py-3 text-end pe-4">Giá cơ bản</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="vehicle in ownerVehicles" :key="vehicle.id">
                                        <td class="px-4 py-3">
                                            <router-link :to="{ name: 'vehicle-details', params: { id: vehicle.id } }"
                                                class="text-decoration-none">
                                                #{{ vehicle.id }}
                                            </router-link>
                                        </td>
                                        <td class="py-3">{{ getVehicleLabel(vehicle) }}</td>
                                        <td class="py-3">{{ vehicle.license_plate || 'N/A' }}</td>
                                        <td class="py-3">
                                            <span class="badge text-bg-light border text-dark">{{ vehicle.status ||
                                                'N/A' }}</span>
                                        </td>
                                        <td class="py-3 text-end pe-4 fw-semibold">{{ formatMoney(vehicle.base_price) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div v-if="vehiclePagination.last_page > 1"
                        class="card-footer bg-white border-top p-3 d-flex justify-content-end">
                        <ul class="pagination pagination-sm mb-0">
                            <li class="page-item" :class="{ disabled: vehiclePagination.current_page === 1 }">
                                <a class="page-link" href="#"
                                    @click.prevent="goToVehiclesPage(vehiclePagination.current_page - 1)">Trước</a>
                            </li>
                            <li v-for="page in vehiclePagination.last_page" :key="`vehicle-page-${page}`"
                                class="page-item" :class="{ active: vehiclePagination.current_page === page }">
                                <a class="page-link" href="#" @click.prevent="goToVehiclesPage(page)">{{ page }}</a>
                            </li>
                            <li class="page-item"
                                :class="{ disabled: vehiclePagination.current_page === vehiclePagination.last_page }">
                                <a class="page-link" href="#"
                                    @click.prevent="goToVehiclesPage(vehiclePagination.current_page + 1)">Sau</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
        </div>
    </main>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & ĐẦU NỐI ĐIỀU HẢO (IMPORTS)
// ============================================================================
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AdminUserService from '@/services/admin-user.service'

const route = useRoute()

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI & TRÌNH ĐIỀU ĐỘ CHI TIẾT USER (STATE MANAGEMENT)
// ============================================================================
const loading = ref(false)         // Cờ hiển thị trạng thái chờ tải dữ liệu chi tiết
const errorMessage = ref('')     // Chuỗi thông báo khi có sự cố tải thông tin
const user = ref(null)           // Hồ sơ toàn diện của người dùng (kèm Đơn thuê & Xe cộ)
const activeTab = ref('overview')// Điều hướng giữa các Tab: Tổng quan, Đơn thuê, Danh sách Xe

// Hồ sơ phân trang và bộ lọc riêng biệt cho từng Tab chuyên sâu
const bookingsPage = ref(1)
const vehiclesPage = ref(1)
const bookingsStatus = ref('all')
const vehiclesStatus = ref('all')
const perPage = 10
let bookingsDebounceTimer = null
let vehiclesDebounceTimer = null

// ============================================================================
// 3. THUẬT TOÁN ĐIỀU PHỐI VAI TRÒ & DANH SÁCH CHI TIẾT (COMPUTED RBAC & LISTS)
// ============================================================================
// Trích xuất tập hợp mã định danh vai trò (Role Slugs) của cá nhân này
const roleSlugs = computed(() => (user.value?.roles || []).map((role) => role.slug))
const isRenter = computed(() => roleSlugs.value.includes('renter'))
const isOwner = computed(() => roleSlugs.value.includes('owner'))

// Danh sách chuyến đi và xe cho thuê được bóc tách từ hồ sơ User
const renterTrips = computed(() => user.value?.bookings?.data || [])
const ownerVehicles = computed(() => user.value?.vehicles?.data || [])

// Bộ đếm trang và Nhãn bộ lọc Đơn đặt xe
const bookingPagination = computed(() => ({
    current_page: user.value?.bookings?.current_page || 1,
    last_page: user.value?.bookings?.last_page || 1,
}))
const bookingTotal = computed(() => user.value?.bookings?.total || 0)
const bookingFilterLabel = computed(() => {
    const map = {
        all: 'Tất cả',
        pending_approval: 'Chờ chủ xe duyệt',
        pending_payment: 'Chờ thanh toán',
        confirmed: 'Đã xác nhận',
        in_progress: 'Đang diễn ra',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy',
    }
    return map[bookingsStatus.value] || bookingsStatus.value
})

// Bộ đếm trang và Nhãn bộ lọc Xe ô tô
const vehiclePagination = computed(() => ({
    current_page: user.value?.vehicles?.current_page || 1,
    last_page: user.value?.vehicles?.last_page || 1,
}))
const vehicleTotal = computed(() => user.value?.vehicles?.total || 0)
const vehicleFilterLabel = computed(() => {
    const map = {
        all: 'Tất cả',
        pending: 'Chờ duyệt',
        available: 'Sẵn sàng',
        rented: 'Đang cho thuê',
        maintenance: 'Bảo trì',
        locked: 'Đã khóa',
    }
    return map[vehiclesStatus.value] || vehiclesStatus.value
})

// ============================================================================
// 4. BỘ TIỆN ÍCH HIỂN THỊ TRANG THÁI & CHUYỂN HOÁ DỮ LIỆU (UI FORMATTERS)
// ============================================================================
const getKycText = (status) => {
    if (status === 'approved') return 'Đã duyệt'
    if (status === 'rejected') return 'Từ chối'
    return 'Chờ duyệt'
}

/**
 * Phối nhãn màu Bootstrap cho toàn bộ danh sách 9 Vai trò trong cơ sở dữ liệu RBAC
 */
const getRoleBadgeClass = (slug) => {
    switch (slug) {
        case 'master_admin':
        case 'admin':
            return 'bg-danger'
        case 'coordinator':
            return 'bg-warning text-dark'
        case 'ops_admin':
            return 'bg-primary'
        case 'support':
        case 'staff':
        case 'cskh':
            return 'bg-info text-dark' // Màu dành cho Chăm sóc khách hàng (CSKH)
        case 'owner':
            return 'bg-primary bg-opacity-75'
        case 'renter':
            return 'bg-secondary'
        default:
            return 'bg-dark'
    }
}

// Ghép nối tên Hãng và dòng Xe thành tiêu đề gọn gàng
const getVehicleLabel = (vehicle) => {
    if (!vehicle) return 'N/A'
    const brand = vehicle.car_model?.brand_name || ''
    const model = vehicle.car_model?.model_name || ''
    const text = `${brand} ${model}`.trim()
    return text || 'N/A'
}

const getBookingStatusText = (status) => {
    const map = {
        pending_approval: 'Chờ chủ xe duyệt',
        pending_payment: 'Chờ thanh toán',
        confirmed: 'Đã xác nhận',
        in_progress: 'Đang diễn ra',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy',
    }
    return map[status] || status || 'N/A'
}

const formatDateTime = (value) => {
    if (!value) return 'N/A'
    const date = new Date(value)
    return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
    })}`
}

const formatMoney = (value) => {
    const amount = Number(value || 0)
    return `${amount.toLocaleString('vi-VN')} VND`
}

// ============================================================================
// 5. TRÌNH TƯỞNG TRANH TRỢ HOẠT API & XỬ LÝ TRUY VẤN SỐ LIỆU (API INTEGRATION)
// ============================================================================
/**
 * Đóng gói bộ tham số lọc và phân trang gửi cho API chi tiết thành viên
 */
const buildDetailParams = () => ({
    bookings_page: bookingsPage.value,
    bookings_per_page: perPage,
    bookings_status: bookingsStatus.value,
    vehicles_page: vehiclesPage.value,
    vehicles_per_page: perPage,
    vehicles_status: vehiclesStatus.value,
    include_bookings: activeTab.value === 'bookings', // Chỉ truy vấn khi đứng tại Tab Đơn thuê
    include_vehicles: activeTab.value === 'vehicles', // Chỉ truy vấn khi đứng tại Tab Xe
})

/**
 * Tải hồ sơ toàn diện của cá nhân thành viên từ Backend Laravel theo ID
 */
const fetchUserDetail = async () => {
    loading.value = true
    errorMessage.value = ''

    try {
        const response = await AdminUserService.getUserById(route.params.id, buildDetailParams())
        if (response.data?.success) {
            user.value = response.data.data
        } else {
            errorMessage.value = 'Không thể tải chi tiết người dùng.'
        }
    } catch (error) {
        user.value = null
        errorMessage.value = error?.response?.data?.message || 'Không thể tải chi tiết người dùng từ database.'
    } finally {
        loading.value = false
    }
}

// ============================================================================
// 6. NGHIỆP VỤ PHÂN TRANG, ĐỔI TAB & BỘ SUY CỔ DEBOUNCE (NAVIGATION & FILTER DEBOUNCE)
// ============================================================================
const goToBookingsPage = async (page) => {
    if (page < 1 || page > bookingPagination.value.last_page) return
    bookingsPage.value = page
    await fetchUserDetail()
}

const goToVehiclesPage = async (page) => {
    if (page < 1 || page > vehiclePagination.value.last_page) return
    vehiclesPage.value = page
    await fetchUserDetail()
}

/**
 * Điều hướng Tab và kích hoạt tải chi tiết danh sách tương ứng
 */
const setActiveTab = async (tab) => {
    if (activeTab.value === tab) return
    activeTab.value = tab
    if (tab === 'bookings') bookingsPage.value = 1
    if (tab === 'vehicles') vehiclesPage.value = 1
    await fetchUserDetail()
}

/**
 * Bộ trì hoãn Debounce (300ms) ngăn nghẽn mạng khi thay đổi bộ lọc Đơn thuê xe
 */
const onBookingsFilterChange = async () => {
    bookingsPage.value = 1
    if (bookingsDebounceTimer) clearTimeout(bookingsDebounceTimer)
    bookingsDebounceTimer = setTimeout(async () => {
        await fetchUserDetail()
    }, 300)
}

/**
 * Bộ trì hoãn Debounce (300ms) cho thanh Trình cắm Lọc Xe của Đối tác
 */
const onVehiclesFilterChange = async () => {
    vehiclesPage.value = 1
    if (vehiclesDebounceTimer) clearTimeout(vehiclesDebounceTimer)
    vehiclesDebounceTimer = setTimeout(async () => {
        await fetchUserDetail()
    }, 300)
}

// ============================================================================
// 7. MÓC DẪN VÒNG ĐỜI VUE COMPONENTS (LIFECYCLE HOOKS)
// ============================================================================
onMounted(async () => {
    await fetchUserDetail()
})

onBeforeUnmount(() => {
    // Thu hồi toàn bộ luồng hẹn giờ Debounce khi giải phóng trang
    if (bookingsDebounceTimer) clearTimeout(bookingsDebounceTimer)
    if (vehiclesDebounceTimer) clearTimeout(vehiclesDebounceTimer)
})
</script>
