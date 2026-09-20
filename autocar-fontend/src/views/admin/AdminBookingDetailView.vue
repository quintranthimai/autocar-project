<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">

            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 class="fs-3 mb-0 fw-bold text-dark">Chi tiết đơn đặt xe #{{ booking?.id }}</h2>
                    <p class="mb-0 text-muted small" v-if="booking">Ngày tạo đơn: {{ formatDate(booking.created_at) }}
                    </p>
                </div>
                <div>
                    <router-link to="/admin/booking-management"
                        class="btn btn-white border bg-white fw-semibold text-dark shadow-sm px-4 py-2">
                        <i class="fas fa-arrow-left me-2"></i>Quay lại danh sách
                    </router-link>
                </div>
            </div>

            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Đang tải dữ liệu chi tiết...</p>
            </div>

            <div v-else-if="booking" class="row g-4">

                <div class="col-lg-8">

                    <!-- Thông báo hủy chuyến (nếu có) -->
                    <div v-if="booking.status === 'cancelled'" class="alert alert-danger shadow-sm rounded-4 mb-4 border-0">
                        <div class="d-flex align-items-center gap-2 fw-bold fs-5 mb-2">
                            <i class="fas fa-times-circle"></i> Đơn đặt xe đã bị hủy
                        </div>
                        <div class="row text-dark small">
                            <div class="col-md-4 mb-2 mb-md-0">
                                <span class="fw-semibold">Người hủy:</span> 
                                <span class="badge bg-danger ms-1">{{ getCancelByRole(booking.cancel_by) }}</span>
                            </div>
                            <div class="col-md-4 mb-2 mb-md-0" v-if="booking.cancelled_at">
                                <span class="fw-semibold">Thời gian:</span> {{ formatDate(booking.cancelled_at) }}
                            </div>
                            <div class="col-12 mt-2" v-if="booking.cancel_reason">
                                <span class="fw-semibold d-block mb-1">Lý do hủy:</span>
                                <div class="bg-white p-2 rounded border border-danger border-opacity-25">{{ booking.cancel_reason }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4 mb-4">
                        <div class="card-header bg-white border-0 pt-4 px-4">
                            <h5 class="fw-bold text-dark mb-0"><i class="fas fa-car text-primary me-2"></i>Thông tin
                                phương tiện</h5>
                        </div>
                        <div class="card-body p-4 pt-3">
                            <div class="row align-items-center g-3">
                                <div class="col-md-3">
                                    <img :src="getVehicleImage(booking.vehicle)" class="rounded-3 object-fit-cover"
                                        style="width: 120px; height: 80px;" alt="Car Image"
                                        onerror="this.onerror=null; this.src='https://placehold.co/600x400/eeeeee/999999?text=No+Image'">
                                </div>
                                <div class="col-md-9">
                                    <h4 class="fw-bold text-dark text-uppercase mb-1">
                                        {{ booking.vehicle?.car_model?.brand_name }} {{
                                            booking.vehicle?.car_model?.model_name }}
                                    </h4>
                                    <p class="mb-2"><span class="badge bg-dark px-3 py-2 fs-6 rounded-3">Biển số: {{
                                        booking.vehicle?.license_plate }}</span></p>
                                    <div class="row text-muted small">
                                        <div class="col-6"><strong>Năm sản xuất:</strong> {{ booking.vehicle?.year }}
                                        </div>
                                        <div class="col-6"><strong>Nhiên liệu hiện tại:</strong> {{
                                            booking.vehicle?.current_fuel_level }}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4 mb-4">
                        <div class="card-header bg-white border-0 pt-4 px-4">
                            <h5 class="fw-bold text-dark mb-0"><i class="fas fa-route text-primary me-2"></i>Lịch trình
                                di chuyển</h5>
                        </div>
                        <div class="card-body p-4 pt-3">
                            <div class="row g-3 mb-4">
                                <div class="col-md-6 border-end">
                                    <label class="text-muted small fw-semibold d-block text-uppercase mb-1">Thời gian
                                        nhận xe</label>
                                    <h5 class="fw-bold text-success mb-0"><i class="far fa-calendar-alt me-2"></i>{{
                                        formatDate(booking.start_datetime) }}</h5>
                                </div>
                                <div class="col-md-6">
                                    <label class="text-muted small fw-semibold d-block text-uppercase mb-1">Thời gian
                                        trả xe</label>
                                    <h5 class="fw-bold text-danger mb-0"><i class="far fa-calendar-check me-2"></i>{{
                                        formatDate(booking.end_datetime) }}</h5>
                                </div>
                            </div>
                            <div class="border-top pt-3">
                                <div class="mb-3">
                                    <label class="text-muted small fw-semibold d-block text-uppercase mb-1">Địa điểm
                                        giao xe</label>
                                    <p class="fw-medium text-dark mb-0"><i
                                            class="fas fa-map-marker-alt text-danger me-2"></i>{{
                                                booking.pickup_location }}</p>
                                </div>
                                <div>
                                    <label class="text-muted small fw-semibold d-block text-uppercase mb-1">Địa điểm trả
                                        xe</label>
                                    <p class="fw-medium text-dark mb-0"><i
                                            class="fas fa-map-marked-alt text-primary me-2"></i>{{
                                                booking.dropoff_location }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">

                    <div class="card border-0 shadow-sm rounded-4 mb-4">
                        <div class="card-header bg-white border-0 pt-4 px-4">
                            <h5 class="fw-bold text-dark mb-0"><i class="fas fa-user-tie text-primary me-2"></i>Khách
                                hàng tài xế</h5>
                        </div>
                        <div class="card-body p-4 pt-3">
                            <div class="d-flex align-items-center gap-3 mb-3">
                                <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4"
                                    style="width: 48px; height: 48px;">
                                    {{ booking.renter?.name?.charAt(0) }}
                                </div>
                                <div>
                                    <h5 class="fw-bold mb-0 text-dark">{{ booking.renter?.name }}</h5>
                                    <p class="text-muted small mb-0">ID tài khoản: #{{ booking.renter_id }}</p>
                                </div>
                            </div>
                            <ul class="list-group list-group-flush small">
                                <li
                                    class="list-group-flush list-group-item d-flex justify-content-between px-0 bg-transparent">
                                    <span class="text-muted">Số điện thoại:</span>
                                    <strong class="text-dark">{{ booking.renter?.phone || 'Chưa cập nhật' }}</strong>
                                </li>
                                <li
                                    class="list-group-flush list-group-item d-flex justify-content-between px-0 bg-transparent">
                                    <span class="text-muted">Email liên hệ:</span>
                                    <strong class="text-dark text-break">{{ booking.renter?.email }}</strong>
                                </li>
                                <li class="list-group-flush list-group-item bg-transparent px-0 pb-0">
                                    <span class="text-muted d-block mb-1">Giấy tờ xuất trình khi nhận xe:</span>
                                    <div class="d-flex gap-2">
                                        <span class="badge bg-light border text-dark text-uppercase rounded-2 px-2 py-1"
                                            v-for="doc in booking.vehicle?.required_documents" :key="doc">
                                            {{ doc }}
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4 mb-4">
                        <div class="card-header bg-white border-0 pt-4 px-4">
                            <h5 class="fw-bold text-dark mb-0"><i class="fas fa-receipt text-primary me-2"></i>Hóa đơn
                                chi phí</h5>
                        </div>
                        <div class="card-body p-4 pt-3">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Tiền thuê xe:</span>
                                <span class="fw-semibold text-dark">{{ formatCurrency(booking.total_amount + (booking.discount_amount || 0) - (booking.total_insurance_fee || 0)) }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Bảo hiểm chuyến đi:</span>
                                <span class="fw-semibold text-dark">{{ formatCurrency(booking.total_insurance_fee || 0) }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Hình thức cọc:</span>
                                <span class="fw-semibold text-dark text-capitalize">{{ booking.payment_option ===
                                    'deposit' ? 'Đặt cọc 30%' : 'Thanh toán 100%' }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2" v-if="booking.promo_code">
                                <span class="text-muted">Mã giảm giá ({{ booking.promo_code }}):</span>
                                <span class="text-success fw-semibold">-{{ formatCurrency(booking.discount_amount)
                                }}</span>
                            </div>
                            <hr class="text-muted my-2">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="text-muted fw-bold">Tổng tiền hóa đơn:</span>
                                <h4 class="fw-bold text-danger mb-0">{{ formatCurrency(booking.total_amount) }}</h4>
                            </div>
                            <div class="p-3 bg-light rounded-3">
                                <div class="d-flex justify-content-between text-muted small mb-1">
                                    <span>Số tiền đã thanh toán online:</span>
                                    <strong class="text-success">{{ formatCurrency(booking.deposit_amount) }}</strong>
                                </div>
                                <div class="d-flex justify-content-between text-muted small">
                                    <span>Số tiền thu trực tiếp tại xe:</span>
                                    <strong class="text-primary">{{ formatCurrency(booking.total_amount -
                                        booking.deposit_amount) }}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4">
                        <div class="card-body p-4 text-center">
                            <label class="text-muted small fw-semibold d-block text-uppercase mb-2">Trạng thái đơn
                                hàng</label>
                            <h4 class="fw-bold mb-4">
                                <span :class="getStatusBadgeClass(booking.status)"
                                    class="badge px-4 py-2 rounded-pill fs-6 fw-medium w-100">
                                    {{ getStatusText(booking.status) }}
                                </span>
                            </h4>

                            <div class="d-grid gap-2">
                                <button v-if="['pending_payment', 'confirmed'].includes(booking.status)"
                                    @click="updateBookingStatus('cancelled')"
                                    class="btn btn-danger fw-semibold py-2 rounded-3">
                                    <i class="fas fa-ban me-2"></i>Hủy chuyến xe này
                                </button>

                                <button v-if="booking.status === 'confirmed'"
                                    @click="updateBookingStatus('in_progress')"
                                    class="btn btn-primary text-white fw-semibold py-2 rounded-3">
                                    <i class="fas fa-key me-2"></i>Xác nhận đã bàn giao xe
                                </button>

                                <button v-if="booking.status === 'in_progress'"
                                    @click="updateBookingStatus('completed')"
                                    class="btn btn-success fw-semibold py-2 rounded-3">
                                    <i class="fas fa-check-double me-2"></i>Xác nhận hoàn thành & Trả xe
                                </button>
                            </div>
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BookingService from '@/services/booking.service' // Trình kết nối dịch vụ Giao dịch & Đơn xe

const route = useRoute()

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI HỒ SƠ CHI TIẾT GIAO DỊCH (STATE MANAGEMENT)
// ============================================================================
const booking = ref(null)          // Thực thể lưu toàn bộ chi tiết Hợp đồng/Đơn đặt xe
const loading = ref(true)          // Cờ trạng thái đang tải dữ liệu

// ============================================================================
// 3. TRÌNH TIỆN ÍCH HIỂN THỊ, HÌNH ẢNH VÀ TRÁCH NHIỆM HỦY ĐƠN (FORMATTERS & ATTRIBUTION)
// ============================================================================
/**
 * Trích xuất ảnh ngoại thất chính của xe trong đơn (Trả về ảnh mặc định nếu xe chưa có ảnh)
 */
const getVehicleImage = (vehicle) => {
    if (vehicle && vehicle.images && vehicle.images.length > 0) {
        return vehicle.images[0].image_url;
    }
    return 'https://placehold.co/600x400/eeeeee/999999?text=No+Image';
};

/**
 * Phân định trách nhiệm chủ thể gây ra sự kiện Hủy Chuyến Đi (Attribution)
 */
const getCancelByRole = (role) => {
    if (role === 'owner') return 'Chủ xe'
    if (role === 'renter') return 'Khách thuê'
    if (role === 'admin') return 'Hệ thống (Admin)'
    return 'Hệ thống'
}

// Chuẩn hóa hiển thị chuỗi số tiền sang VNĐ
const formatCurrency = (val) => val ? Number(val).toLocaleString('vi-VN') + 'đ' : '0đ'

// Định dạng thời gian mốc lịch trình sang Ngày/Tháng/Năm Giờ:Phút
const formatDate = (dateString) => {
    if (!dateString) return ''
    const d = new Date(dateString)
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/**
 * Phối chuỗi style nhãn trạng thái đơn xe theo chu trình giao dịch
 */
const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'pending_approval': return 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25'
        case 'completed': return 'bg-success bg-opacity-10 text-success border border-success border-opacity-25'
        case 'confirmed': return 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25'
        case 'pending_payment': return 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25'
        case 'in_progress': return 'bg-info bg-opacity-10 text-info border border-info border-opacity-25'
        case 'cancelled': return 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25'
        default: return 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25'
    }
}

/**
 * Dịch nhãn thông báo vòng đời đơn hàng sang tiếng Việt
 */
const getStatusText = (status) => {
    switch (status) {
        case 'pending_approval': return 'Chờ chủ xe duyệt'
        case 'completed': return 'Đã hoàn thành'
        case 'confirmed': return 'Đã đặt cọc (Chờ đi)'
        case 'pending_payment': return 'Chờ thanh toán'
        case 'in_progress': return 'Đang trong hành trình'
        case 'cancelled': return 'Đã hủy chuyến'
        default: return 'Không xác định'
    }
}

// ============================================================================
// 4. CÔNG HOẠT TƯƠNG TÁC API NẠP CHI TIẾT & CẬP NHẬT TRẠNG THÁI (API INTEGRATION)
// ============================================================================
/**
 * Tải chi tiết đơn thuê xe từ hệ thống theo ID trên thanh địa chỉ URL
 */
const fetchBookingDetail = async () => {
    loading.value = true
    try {
        const id = route.params.id // Trích xuất ID giao dịch từ Route parameters
        const response = await BookingService.getAdminBookingDetail(id)
        if (response.data.success) {
            booking.value = response.data.data
        }
    } catch (error) {
        console.error('Lỗi tải chi tiết đơn hàng:', error)
    } finally {
        loading.value = false
    }
}

/**
 * Quyền lực của Quản trị viên Tối cao can thiệp trực tiếp để đổi trạng thái hợp đồng thuê
 */
const updateBookingStatus = async (newStatus) => {
    if (!confirm('Bạn có chắc chắn muốn thực hiện hành động thay đổi trạng thái này không?')) return

    try {
        const response = await BookingService.updateBookingStatus(booking.value.id, newStatus)
        if (response.data.success) {
            alert('Cập nhật trạng thái thành công!')
            fetchBookingDetail() // Nạp lại toàn bộ dữ liệu hợp đồng mới
        }
    } catch (error) {
        alert('Cập nhật trạng thái thất bại.')
    }
}

// ============================================================================
// 5. MÓC DẪN VÒNG ĐỜI KHỞI VẬN GIAO DIỆN (LIFECYCLE HOOKS)
// ============================================================================
onMounted(() => {
    fetchBookingDetail()
})
</script>
