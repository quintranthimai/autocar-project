<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">

            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h1 class="fs-3 mb-1 fw-bold text-dark">Quản lý đơn đặt xe</h1>
                            <p class="mb-0 text-muted">Theo dõi và xử lý tất cả các giao dịch thuê xe trên toàn hệ thống
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-body p-4">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label text-muted small fw-semibold">Tìm kiếm</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light border-0"><i
                                        class="fas fa-search text-muted"></i></span>
                                <input type="text" class="form-control bg-light border-0 fw-medium"
                                    placeholder="Nhập mã đơn, tên khách..." v-model="searchQuery" @keyup.enter="fetchBookings(1)">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted small fw-semibold">Trạng thái</label>
                            <select class="form-select bg-light border-0 fw-medium" v-model="filterStatus"
                                @change="fetchBookings(1)">
                                <option value="all">Tất cả trạng thái</option>
                                <option value="pending_approval">Chờ chủ xe duyệt</option>
                                <option value="pending_payment">Chờ thanh toán</option>
                                <option value="confirmed">Đã đặt cọc (Chờ đi)</option>
                                <option value="in_progress">Đang chuyến đi</option>
                                <option value="completed">Đã hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted small fw-semibold">Lọc theo ngày</label>
                            <input type="date" class="form-control bg-light border-0 fw-medium">
                        </div>
                        <div class="col-md-2 d-flex align-items-end">
                            <button class="btn btn-dark w-100 fw-semibold" @click="fetchBookings(1)">
                                <i class="fas fa-filter me-2"></i>Lọc
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-sm rounded-4" style="overflow: visible !important;">
                <div class="card-body p-0">
                    <div class="w-100" style="overflow: visible !important;">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0 text-center">
                            <thead class="bg-light text-muted small text-uppercase">
                                <tr>
                                    <th class="py-4 ps-4 text-start">Mã Đơn</th>
                                    <th class="py-4 text-start">Thông tin Xe</th>
                                    <th class="py-4">Khách thuê</th>
                                    <th class="py-4">Thời gian thuê</th>
                                    <th class="py-4">Tổng tiền</th>
                                    <th class="py-4">Trạng thái</th>
                                    <th class="py-4 pe-4">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody class="text-dark border-top-0">

                                <tr v-if="loading">
                                    <td colspan="7" class="py-5 text-center">
                                        <div class="spinner-border text-primary" role="status"></div>
                                    </td>
                                </tr>

                                <tr v-else-if="bookings.length > 0" v-for="booking in bookings" :key="booking.id">
                                    <td class="ps-4 text-start">
                                        <div class="fw-bold text-primary mb-1">#{{ booking.code }}</div>
                                        <div class="text-muted small">{{ booking.createdAt }}</div>
                                    </td>
                                    <td class="text-start">
                                        <div class="fw-bold text-dark text-uppercase mb-1">{{ booking.vehicleName }}
                                        </div>
                                        <div class="text-muted small"><i class="fas fa-id-card me-1"></i>{{
                                            booking.plate }}</div>
                                    </td>
                                    <td>
                                        <div class="fw-bold text-dark mb-1">{{ booking.renterName }}</div>
                                        <div class="text-muted small"><i class="fas fa-phone-alt me-1"></i>{{
                                            booking.renterPhone }}</div>
                                    </td>
                                    <td>
                                        <div class="fw-medium text-dark small mb-1">Nhận: {{ booking.startDate }}</div>
                                        <div class="fw-medium text-dark small">Trả: <span class="ms-2">{{
                                            booking.endDate }}</span></div>
                                    </td>
                                    <td>
                                        <div class="fw-bold text-dark">{{ formatCurrency(booking.totalAmount) }}</div>
                                        <div class="text-success small fw-semibold">Cọc: {{
                                            formatCurrency(booking.depositAmount) }}</div>
                                    </td>
                                    <td>
                                        <span :class="getStatusBadgeClass(booking.status)"
                                            class="badge px-3 py-2 rounded-pill fw-medium">
                                            {{ getStatusText(booking.status) }}
                                        </span>
                                    </td>
                                    <td class="pe-4">
                                        <div class="dropdown">
                                            <button
                                                class="btn btn-sm btn-light border fw-semibold rounded-3 px-3 dropdown-toggle"
                                                type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                Xử lý
                                            </button>
                                            <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                                                <li>
                                                    <router-link :to="'/admin/bookings/' + booking.id"
                                                        class="dropdown-item py-2 fw-medium text-dark">
                                                        <i class="far fa-eye me-2 text-primary"></i>Xem chi tiết
                                                    </router-link>
                                                </li>
                                                
                                                <li v-if="booking.status === 'in_progress'">
                                                    <a class="dropdown-item py-2 fw-medium text-success" href="#"
                                                        @click.prevent="handleUpdateStatus(booking.id, 'completed')">
                                                        <i class="fas fa-check-circle me-2"></i>Hoàn thành chuyến
                                                    </a>
                                                </li>

                                                <li>
                                                    <hr class="dropdown-divider">
                                                </li>

                                                <li
                                                    v-if="['pending_approval', 'pending_payment', 'confirmed'].includes(booking.status)">
                                                    <a class="dropdown-item py-2 fw-medium text-danger" href="#"
                                                        @click.prevent="handleUpdateStatus(booking.id, 'cancelled')">
                                                        <i class="fas fa-times-circle me-2"></i>Hủy đơn / Hoàn tiền
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>

                                <tr v-else>
                                    <td colspan="7" class="py-5 text-muted">
                                        <i class="fas fa-box-open fs-2 mb-3 opacity-50 d-block"></i>
                                        Chưa có đơn đặt xe nào phù hợp với bộ lọc.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    </div>
                </div>

                <div class="card-footer bg-white border-top p-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted small fw-medium">
                        Hiển thị {{ pagination.from }} - {{ pagination.to }} trong tổng số {{ pagination.total }} đơn
                    </div>
                    <nav aria-label="Page navigation" v-if="pagination.last_page > 1">
                        <ul class="pagination pagination-sm mb-0 gap-2">
                            <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                                <a class="page-link border-0 rounded-3 bg-light"
                                    :class="pagination.current_page === 1 ? 'text-muted' : 'text-dark'" href="#"
                                    @click.prevent="fetchBookings(pagination.current_page - 1)">
                                    <i class="fas fa-chevron-left"></i>
                                </a>
                            </li>

                            <li class="page-item" v-for="page in pagination.last_page" :key="page"
                                :class="{ active: pagination.current_page === page }">
                                <a class="page-link border-0 rounded-3 shadow-sm"
                                    :class="pagination.current_page === page ? '' : 'text-dark bg-light'" href="#"
                                    @click.prevent="fetchBookings(page)">
                                    {{ page }}
                                </a>
                            </li>

                            <li class="page-item"
                                :class="{ disabled: pagination.current_page === pagination.last_page }">
                                <a class="page-link border-0 rounded-3 bg-light"
                                    :class="pagination.current_page === pagination.last_page ? 'text-muted' : 'text-dark'"
                                    href="#" @click.prevent="fetchBookings(pagination.current_page + 1)">
                                    <i class="fas fa-chevron-right"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

        </div>
    </main>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CỔNG KẾT NỐI API ĐƠN THUÊ (IMPORTS)
// ============================================================================
import { ref, onMounted } from 'vue';
import BookingService from '@/services/booking.service'; // Trình kết nối nghiệp vụ Đơn hàng

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI & BỘ QUẢN TRI TRA CỨU (STATE MANAGEMENT)
// ============================================================================
const filterStatus = ref('all');   // Bộ lọc trạng thái đơn (Chờ duyệt, Đã cọc, Hủy...)
const searchQuery = ref('');       // Từ khóa tra cứu mã đơn DX, Tên hoặc SĐT Khách/Chủ xe
const filterDate = ref('');        // Bộ lọc theo ngày khởi hành / ngày xuất đơn
const bookings = ref([]);          // Danh sách đơn đặt xe sau khi ánh xạ từ máy chủ
const loading = ref(true);         // Cờ hiển thị trạng thái đang tải số liệu

// Lưu trạng thái cấu trúc Phân trang trả về từ hệ thống Backend Laravel
const pagination = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0
});

// ============================================================================
// 3. TRÌNH BẢO ĐẢM HIỂN THỊ TIỀN TỆ & THỜI GIAN (UI FORMATTERS)
// ============================================================================
// Định dạng con số nguyên sang dạng chuỗi tiền tệ VNĐ ("x.xxx.xxxđ")
const formatCurrency = (val) => val ? Number(val).toLocaleString('vi-VN') + 'đ' : '0đ';

// Định dạng ngày giờ chuẩn hóa mượt mà sang "DD/MM/YYYY HH:mm"
const formatSimpleDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

/**
 * Phối chuỗi class nhãn màu Bootstrap theo các Mốc vòng đời Đơn đặt xe
 */
const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'pending_approval': return 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25';
        case 'completed': return 'bg-success bg-opacity-10 text-success border border-success border-opacity-25';
        case 'confirmed': return 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25'; // Đã cọc thành công
        case 'pending_payment': return 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25'; // Đang chờ nạp cọc
        case 'in_progress': return 'bg-info bg-opacity-10 text-info border border-info border-opacity-25';
        case 'cancelled': return 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
        default: return 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25';
    }
};

/**
 * Chuyển đổi mã trạng thái đơn hàng sang tiếng Việt tường minh
 */
const getStatusText = (status) => {
    switch (status) {
        case 'pending_approval': return 'Chờ chủ xe duyệt';
        case 'completed': return 'Đã hoàn thành';
        case 'confirmed': return 'Đã đặt cọc (Chờ đi)';
        case 'pending_payment': return 'Chờ thanh toán';
        case 'in_progress': return 'Đang chuyến đi';
        case 'cancelled': return 'Đã hủy';
        default: return 'Không xác định';
    }
};

// ============================================================================
// 4. ĐẦU NỐI KẾT NỐI VÀ ÁNH XẠ DỮ LIỆU ĐƠN HÀNG (API HYDRATION & MAPPING)
// ============================================================================
/**
 * Tải danh sách đơn đặt xe theo Trang, Trạng thái và Ngày lọc từ máy chủ
 */
const fetchBookings = async (page = 1) => {
    loading.value = true;
    try {
        const response = await BookingService.getAllBookings(
            page, 
            filterStatus.value, 
            searchQuery.value, 
            filterDate.value
        );
        if (response.data?.success) {
            const resultData = response.data.data;

            // [Bước 1]: Gắn dữ liệu cho Trình điều khiển Phân trang
            pagination.value = {
                current_page: resultData.current_page,
                last_page: resultData.last_page,
                total: resultData.total,
                from: resultData.from || 0,
                to: resultData.to || 0
            };

            // [Bước 2]: Ánh xạ (Mapping) dữ liệu Backend sang đúng cấu trúc thuộc tính của Bảng hiển thị
            bookings.value = resultData.data.map(b => ({
                id: b.id,
                code: `DX${b.id}`,
                createdAt: formatSimpleDate(b.created_at),
                // Tổ hợp tên đầy đủ: Hãng + Dòng xe + Năm sản xuất
                vehicleName: `${b.vehicle?.car_model?.brand_name || ''} ${b.vehicle?.car_model?.model_name || ''} ${b.vehicle?.year || ''}`,
                plate: b.vehicle?.license_plate || 'N/A',
                renterName: b.renter?.name || 'Khách chưa rõ',
                renterPhone: b.renter?.phone || 'Chưa cập nhật',
                startDate: formatSimpleDate(b.start_datetime),
                endDate: formatSimpleDate(b.end_datetime),
                totalAmount: b.total_amount,
                depositAmount: b.deposit_amount,
                status: b.status
            }));
        }
    } catch (error) {
        console.error('Lỗi lấy danh sách:', error);
    } finally {
        loading.value = false;
    }
};

// ============================================================================
// 5. NGHIỆP VỤ CAN thiệp VÀ THAY ĐỔI VÒNG ĐỜI ĐƠN HÀNG CỦA ADMIN (ADMIN ACTIONS)
// ============================================================================
/**
 * Quyền năng can thiệp trực tiếp của Admin để ép đổi trang thái đơn (Ví dụ: Hủy đơn đột xuất)
 */
const handleUpdateStatus = async (id, newStatus) => {
    const actionName = newStatus === 'cancelled' ? 'Hủy đơn hàng này' : 'đổi trạng thái đơn hàng';
    if (!confirm(`Bạn có chắc chắn muốn ${actionName}?`)) return;

    try {
        const response = await BookingService.updateBookingStatus(id, newStatus);
        if (response.data.success) {
            // Cập nhật thành công thì tự động làm mới ngay tại trang hiện tại
            fetchBookings(pagination.value.current_page);
        }
    } catch (error) {
        alert('Có lỗi xảy ra khi cập nhật trạng thái.');
        console.error(error);
    }
};

// ============================================================================
// 6. MÓC DẪN VÒNG ĐỜI GIAO DIỆN COMPONENT (LIFECYCLE HOOKS)
// ============================================================================
onMounted(() => {
    fetchBookings();
});
</script>

<style scoped>
.card {
    overflow: visible !important;
}
.table thead th:first-child {
    border-top-left-radius: 1rem;
}
.table thead th:last-child {
    border-top-right-radius: 1rem;
}
.card-footer {
    border-bottom-left-radius: 1rem !important;
    border-bottom-right-radius: 1rem !important;
}
.dropdown-menu {
    z-index: 1050 !important;
}
</style>
