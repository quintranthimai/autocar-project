<template>
    <div class="profile-page bg-light py-5 min-vh-100">
        <div class="container">
            <div class="row g-4">

                <ProfileSidebar />

                <div class="col-lg-9">

                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2 class="fw-bold mb-0">Chuyến của tôi</h2>
                        <button
                            class="btn btn-filter rounded-3 px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm">
                            <i class="fas fa-sliders-h"></i> Bộ lọc
                        </button>
                    </div>

                    <h5 class="fw-bold mb-4">Danh sách chuyến đi</h5>

                    <!-- Skeleton Loading (Hiển thị khi đang tải) -->
                    <div v-if="loading" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>

                    <!-- Trống đơn hàng -->
                    <div v-else-if="trips.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm">
                        <p class="text-muted mb-0">Bạn chưa có chuyến đi nào.</p>
                    </div>

                    <!-- Danh sách đơn hàng (Render từ API) -->
                    <div v-else v-for="trip in trips" :key="trip.id" class="bg-white rounded-4 shadow-sm p-4 mb-4">

                        <!-- Header Card -->
                        <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
                            <div
                                :class="['fw-bold d-flex align-items-center gap-2', getStatusConfig(trip.status).textColor]">
                                <i :class="getStatusConfig(trip.status).icon"></i> {{ getStatusConfig(trip.status).text
                                }}
                            </div>
                            <div class="text-muted small">Cập nhật: {{ formatSimpleDate(trip.updated_at) }}</div>
                        </div>

                        <!-- Body Card -->
                        <div class="row g-4">
                            <!-- Cột Ảnh -->
                            <div class="col-md-4">
                                <!-- Lấy ảnh đầu tiên của xe, nếu không có dùng ảnh mặc định -->
                                <img :src="trip.vehicle?.images?.[0]?.image_url || '/img/car-1.png'"
                                    class="img-fluid rounded-3 w-100 object-fit-cover" style="height: 160px;" alt="Car">
                            </div>

                            <!-- Cột Thông tin -->
                            <div class="col-md-8 d-flex flex-column">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h5 class="fw-bold mb-0 text-primary">
                                        {{ trip.vehicle?.license_plate || 'Đang cập nhật' }} •
                                        {{ trip.vehicle?.car_model?.brand_name }} {{ trip.vehicle?.car_model?.model_name
                                        }} {{ trip.vehicle?.year }}
                                    </h5>

                                    <span class="text-dark small fw-bold">
                                        <i :class="getRentalType(trip.start_datetime, trip.end_datetime).icon"
                                            class="me-1"></i>
                                        {{ getRentalType(trip.start_datetime, trip.end_datetime).label }}
                                    </span>
                                </div>

                                <div class="text-muted small mb-2">
                                    <i class="far fa-calendar-alt me-2"></i> {{ formatRangeDate(trip.start_datetime,
                                        trip.end_datetime) }}
                                </div>

                                <div class="d-flex align-items-center mb-3">
                                    <img :src="trip.vehicle?.owner?.avatar || '/img/team-1.jpg'" class="rounded-circle me-2 object-fit-cover" width="24"
                                        height="24" alt="Owner">
                                    <span class="text-muted small fw-medium">{{ trip.vehicle?.owner?.name || 'Chủ xe AutoCar'
                                        }}</span>
                                </div>

                                <!-- Cột Giá tiền (Giữ nguyên cấu trúc của bạn) -->
                                <div class="d-flex justify-content-between align-items-end mt-auto">
                                    <div class="small">
                                        <div class="text-muted mb-1">Thanh toán</div>
                                        <div class="text-muted">
                                            Giữ chỗ: <span class="text-primary fw-bold">{{
                                                formatCurrencyK(trip.deposit_amount) }}</span>
                                        </div>
                                    </div>
                                    <div class="text-end">
                                        <div class="text-primary fw-bold fs-5 mb-1">{{
                                            formatCurrencyK(trip.total_amount) }}</div>
                                        <div class="text-muted small">
                                            Trực tiếp: <span class="text-primary fw-bold">{{
                                                formatCurrencyK(trip.total_amount - trip.deposit_amount) }}</span>
                                        </div>
                                        <router-link :to="{ name: 'trip-details', params: { id: trip.id } }"
                                            class="btn btn-sm btn-outline-primary rounded-3 mt-2 fw-semibold">
                                            Xem chi tiết
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & THÀNH PHẦN GIAO DIỆN (IMPORTS)
// ============================================================================
import { ref, onMounted } from 'vue'
import ProfileSidebar from '@/components/web/ProfileSidebar.vue'
import BookingService from '@/services/booking.service'

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI DANH SÁCH CHUYẾN ĐI (STATE MANAGEMENT)
// ============================================================================
const trips = ref([])        // Lưu trữ mảng danh sách trọn bộ đơn đặt xe cá nhân
const loading = ref(true)    // Cờ trạng thái đang chờ nạp từ máy chủ

// ============================================================================
// 3. PHƯƠNG THỨC NẠP LỊCH SỬ CHUYẾN ĐI TỪ BACKEND (API FETCHING)
// ============================================================================
/**
 * Gọi API tới BookingService để lấy danh sách chuyến đi của tài khoản đang đăng nhập
 */
const fetchMyTrips = async () => {
    try {
        const response = await BookingService.getMyBookings()
        if (response.data.success) {
            trips.value = response.data.data
        }
    } catch (error) {
        console.error('Lỗi khi tải lịch sử chuyến đi:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchMyTrips()
})

// ============================================================================
// 4. BỘ HÀM TIỆN ÍCH TRẮC HỌC VÀ HIỂN THỊ TRẠNG THÁI (RENDER UTILITIES)
// ============================================================================

/**
 * Áp dụng bảng màu và biểu tượng trang trí phù hợp theo Từng trạng thái đơn hàng
 * @param {string} status - Mã trạng thái từ Backend trả về
 */
const getStatusConfig = (status) => {
    const configs = {
        'pending_approval': { text: 'Chờ chủ xe duyệt', icon: 'fas fa-hourglass-half text-warning', textColor: 'text-warning' },
        'pending_payment': { text: 'Chờ thanh toán', icon: 'fas fa-clock text-danger', textColor: 'text-danger' },
        'confirmed': { text: 'Đã giữ chỗ', icon: 'fas fa-shield-alt text-success', textColor: 'text-success' },
        'in_progress': { text: 'Đang chuyến đi', icon: 'fas fa-car-side text-info', textColor: 'text-info' },
        'completed': { text: 'Đã kết thúc', icon: 'fas fa-check-circle text-primary', textColor: 'text-dark' },
        'cancelled': { text: 'Đã hủy', icon: 'fas fa-times-circle text-danger', textColor: 'text-danger' }
    }
    return configs[status] || { text: 'Không xác định', icon: 'fas fa-question-circle text-secondary', textColor: 'text-secondary' }
}

/**
 * Định dạng tiền tệ kiểu rút gọn (VD: 888000 -> 888K)
 */
const formatCurrencyK = (value) => {
    if (!value) return '0K'
    const thounsands = Math.round(value / 1000)
    return `${thounsands}K`
}

/**
 * Định dạng thời gian nhanh ở góc phải thẻ (VD: 23:00, 12/04/2026)
 */
const formatSimpleDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const hours = String(date.getHours()).padStart(2, '0')
    const mins = String(date.getMinutes()).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${hours}:${mins}, ${day}/${month}/${year}`
}

/**
 * Định dạng khoảng thời gian diễn ra chuyến đi (VD: 21:00 T7, 11/04 - 21:00 CN, 12/04)
 */
const formatRangeDate = (start, end) => {
    if (!start || !end) return ''

    const getParts = (dStr) => {
        const d = new Date(dStr)
        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
        const hours = String(d.getHours()).padStart(2, '0')
        const mins = String(d.getMinutes()).padStart(2, '0')
        const dayOfWeek = days[d.getDay()]
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0')
        return `${hours}:${mins} ${dayOfWeek}, ${day}/${month}`
    }

    return `${getParts(start)} - ${getParts(end)}`
}

/**
 * Phục vụ phân định chế độ thuê (theo giờ vs theo ngày) dựa theo độ trễ thời gian nhận/trả
 */
const getRentalType = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffHours = (e - s) / (1000 * 60 * 60);

    // Nếu khoảng thời gian <= 12 tiếng và kết thúc trong cùng ngày => Chế độ Thuê theo giờ
    if (diffHours <= 12 && s.toDateString() === e.toDateString()) {
        return { label: 'Thuê theo giờ', icon: 'fas fa-clock' };
    }
    return { label: 'Thuê theo ngày', icon: 'fas fa-calendar-alt' };
};
</script>

<style scoped>
.btn-filter {
    background-color: #ffffff !important;
    border: 1.5px solid var(--bs-primary) !important;
    color: var(--bs-primary) !important;
    transition: all 0.2s ease-in-out;
}

.btn-filter:hover, .btn-filter:focus, .btn-filter:active {
    background-color: #fff5f0 !important;
    color: var(--bs-primary) !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(235, 90, 28, 0.15) !important;
}
</style>
