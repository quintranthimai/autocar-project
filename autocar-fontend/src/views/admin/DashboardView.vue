<template>
    <!-- MAIN CONTENT -->
    <main id="content" class="content py-10">
        <div class="container-fluid">
            <div class="row ">
                <div class="col-12">
                    <div class="mb-6">
                        <h1 class="fs-3 mb-1">Bảng Điều Khiển</h1>
                        <p>Xem nhanh các chỉ số quan trọng của hệ thống</p>
                    </div>
                </div>
            </div>
            <div class="row g-3 mb-3">
                <div class="col-lg-3 col-12">

                    <div class="card p-4 position-relative bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-2">
                        <router-link to="/admin/transaction-logs" class="stretched-link"></router-link>
                        <div class="d-flex gap-3 ">
                            <div class="icon-shape icon-md bg-primary text-white rounded-2">
                                <i class="ti ti-report-analytics fs-4"></i>
                            </div>
                            <div>
                                <h2 class="mb-3 fs-6">Tổng GMV</h2>
                                <h3 class="fw-bold mb-0">{{ formatCurrency(summary.total_sales) }}</h3>
                                <p class="text-primary mb-0 small">Tổng giá trị giao dịch</p>
                            </div>
                        </div>
                    </div>


                </div>
                <div class="col-lg-3 col-12">

                    <div class="card p-4 position-relative bg-success bg-opacity-10 border border-success border-opacity-25 rounded-2">
                        <router-link to="/admin/booking-management" class="stretched-link"></router-link>
                        <div class="d-flex gap-3 ">
                            <div class="icon-shape icon-md bg-success text-white rounded-2">
                                <i class="ti ti-repeat fs-4"></i>
                            </div>
                            <div>
                                <h2 class="mb-3 fs-6">Tổng Số Chuyến</h2>
                                <h3 class="fw-bold mb-0">{{ summary.total_bookings }} chuyến</h3>
                                <p class="text-success mb-0 small">Đã đặt trên hệ thống</p>
                            </div>
                        </div>
                    </div>


                </div>
                <div class="col-lg-3 col-12">

                    <div class="card p-4 position-relative bg-info bg-opacity-10 border border-info border-opacity-25 rounded-2">
                        <router-link v-if="canAccessFinance" to="/admin/withdrawal-management" class="stretched-link"></router-link>
                        <div class="d-flex gap-3 ">
                            <div class="icon-shape icon-md bg-info text-white rounded-2">
                                <i class="ti ti-currency-dollar fs-4"></i>
                            </div>
                            <div>
                                <h2 class="mb-3 fs-6">Đã Chi Trả (Payout)</h2>
                                <h3 class="fw-bold mb-0">{{ formatCurrency(summary.total_expenses) }}</h3>
                                <p class="text-info mb-0 small">Thanh toán cho Chủ xe</p>
                            </div>
                        </div>
                    </div>


                </div>
                <div class="col-lg-3 col-12">

                    <div class="card p-4 position-relative bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded-2">
                        <router-link v-if="canAccessFinance" to="/admin/transaction-logs" class="stretched-link"></router-link>
                        <div class="d-flex gap-3 ">
                            <div class="icon-shape icon-md bg-warning text-white rounded-2">
                                <i class="ti ti-notes fs-4"></i>
                            </div>
                            <div>
                                <h2 class="mb-3 fs-6">Tiền Tạm Giữ</h2>
                                <h3 class="fw-bold mb-0">{{ formatCurrency(summary.invoice_due) }}</h3>
                                <p class="text-warning mb-0 small">Chờ xử lý / Time-lock</p>
                            </div>
                        </div>
                    </div>


                </div>

            </div>
            <div class="row g-3 mb-3">
                <div class="col-lg-4 col-12">
                    <div class="card">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between border-bottom pb-5 mb-3">
                                <div>
                                    <h3 class="fw-bold h4 text-success">{{ formatCurrency(summary.total_profit) }}</h3>
                                    <span>Lợi Nhuận Nền Tảng (30%)</span>
                                </div>
                                <div>
                                    <i class="ti ti-layers-subtract fs-1 text-primary"></i>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center small">
                                <div class="text-muted">
                                    <span :class="summary.growth.profit_vs_last_month >= 0 ? 'text-success' : 'text-danger'">
                                        {{ summary.growth.profit_vs_last_month > 0 ? '+' : '' }}{{ summary.growth.profit_vs_last_month }}%
                                    </span> so với tháng trước
                                </div>
                                <div v-if="canAccessReports"><router-link to="/admin/reports"
                                        class="link-primary text-decoration-underline">Xem</router-link></div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="col-lg-4 col-12">
                    <div class="card">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between border-bottom pb-5 mb-3">
                                <div>
                                    <h3 class="fw-bold h4">{{ formatCurrency(summary.total_returns) }}</h3>
                                    <span>Tổng Tiền Hoàn Trả</span>
                                </div>
                                <div>
                                    <i class="ti ti-credit-card fs-1 text-danger"></i>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center small">
                                <div class="text-muted"><span class="text-danger"></span> Lịch sử Giao dịch</div>
                                <div v-if="canAccessFinance"><router-link to="/admin/transaction-logs"
                                        class="link-primary text-decoration-underline">Xem</router-link></div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="col-lg-4 col-12">
                    <div class="card">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between border-bottom pb-5 mb-3">
                                <div>
                                    <h3 class="fw-bold h4">{{ formatCurrency(summary.total_insurance_fund) }}</h3>
                                    <span>Quỹ Bảo Hiểm Chuyến Đi</span>
                                </div>
                                <div>
                                    <i class="ti ti-shield-check fs-1 text-success"></i>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center small">
                                <div class="text-muted"><span class="text-success"></span> Quỹ bảo lãnh rủi ro</div>
                                <div v-if="canAccessFinance"><router-link to="/admin/transaction-logs"
                                        class="link-primary text-decoration-underline">Xem</router-link></div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div class="row g-3 mb-3">
                <div class="col-12">
                    <div class="card">
                        <div
                            class="card-header d-flex justify-content-between align-items-center bg-transparent px-4 py-3">
                            <h3 class="h5 mb-0">Thông Tin Tổng Quan</h3>
                            <div>
                                <select class="form-select form-select-sm">
                                    <option selected>6 Tháng Gần Nhất</option>
                                    <option>Tháng Này</option>
                                    <option>Tuần Này</option>
                                </select>
                            </div>
                        </div>
                        <div class="card-body p-4">
                            <h3 class="h6">Tổng Quan Khách Hàng</h3>
                            <div class="row align-items-center">
                                <div class="col-sm-6">
                                    <div id="customerChart">

                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="row">
                                        <div class="col-6 border-end">
                                            <div class="text-center ">
                                                <h2 class="mb-1">{{ summary.customers_overview.first_time }}</h2>
                                                <p class="text-success mb-2">Khách Mới</p>
                                                <span class="badge bg-success"><i
                                                        class="ti ti-arrow-up-left me-1"></i>Mới</span>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="text-center">
                                                <h2 class="mb-1">{{ summary.customers_overview.return }}</h2>
                                                <p class="text-warning mb-2">Khách Cũ</p>
                                                <span
                                                    class="badge bg-success badge-xs d-inline-flex align-items-center"><i
                                                        class="ti ti-arrow-up-left me-1"></i>Thân Thiết</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div class="row text-center border-top mt-4 pt-4">
                                <div class="col-4 border-end">
                                    <h3 class="fw-bold mb-2">{{ summary.user_stats.suppliers }}</h3>
                                    <small class="text-secondary">Chủ xe</small>
                                </div>
                                <div class="col-4 border-end">
                                    <h3 class="fw-bold mb-2">{{ summary.user_stats.customers }}</h3>
                                    <small class="text-secondary">Khách thuê</small>
                                </div>
                                <div class="col-4">
                                    <h3 class="fw-bold mb-2">{{ summary.user_stats.orders }}</h3>
                                    <small class="text-secondary">Đơn đặt</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row g-3">
                <!-- CARD 1 — Xe Chờ Duyệt -->
                <div class="col-lg-6">
                    <div class="card  h-100">
                        <div class="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3">
                            <div class="d-flex align-items-center">

                                <h4 class="mb-0 h5">Xe Đợi Duyệt</h4>
                            </div>
                            <router-link v-if="canAccessVehicles" :to="{ name: 'admin-vehicle-management' }"
                                class="small text-primary text-decoration-underline">Xem Tất Cả</router-link>
                        </div>

                        <ul class="list-group list-group-flush">
                            <!-- item -->
                            <li v-for="(vehicle) in summary.pending_vehicles" :key="vehicle.id" class="list-group-item d-flex align-items-center gap-3">
                                <img :src="vehicle.thumbnail" class="rounded" width="48" height="48" style="object-fit: cover;">
                                <div class="flex-grow-1">
                                    <p class="mb-1 fw-medium text-truncate" style="max-width: 200px;">{{ vehicle.name }}</p>
                                    <small>Ngày đăng: {{ vehicle.created_at }}</small>
                                </div>
                                <div class="d-flex flex-column gap-0 align-items-center">
                                    <span class="badge bg-warning-subtle text-warning">Chờ Duyệt</span>
                                </div>
                            </li>
                            <li v-if="summary.pending_vehicles.length === 0" class="list-group-item text-center text-muted py-4">
                                Không có xe mới chờ duyệt
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- CARD 2 — Các Giao Dịch Gần Đây -->
                <div class="col-lg-6">
                    <div class="card  h-100">
                        <div class="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3">
                            <h4 class="mb-0 h5">Đơn Đặt Mới Nhất</h4>
                            <router-link to="/admin/booking-management" class="btn btn-sm btn-outline-secondary">
                                <i class="ti ti-calendar-event"></i> Tất cả
                            </router-link>
                        </div>

                        <ul class="list-group list-group-flush">
                            <!-- item -->
                            <li v-for="booking in summary.recent_bookings" :key="booking.id" class="list-group-item d-flex align-items-center gap-3">
                                <img :src="booking.thumbnail" class="rounded" width="48" height="48" style="object-fit: cover;">
                                <div class="flex-grow-1">
                                    <p class="mb-1 fw-medium text-truncate" style="max-width: 150px;">{{ booking.vehicle_name }}</p>
                                    <div class="d-flex align-items-center gap-2 text-muted">
                                        <small class="fw-semibold">Đơn #{{ booking.id }}</small>
                                        <small>•</small>
                                        <small>{{ formatCurrency(booking.total_amount) }}</small>
                                    </div>
                                </div>
                                <span class="badge" 
                                    :class="{
                                        'bg-success-subtle text-success': booking.status === 'completed',
                                        'bg-warning-subtle text-warning': ['pending', 'pending_approval', 'pending_payment', 'confirmed'].includes(booking.status),
                                        'bg-primary-subtle text-primary': booking.status === 'in_progress',
                                        'bg-danger-subtle text-danger': booking.status === 'cancelled'
                                    }">
                                    {{ translateStatus(booking.status) }}
                                </span>
                            </li>
                            <li v-if="summary.recent_bookings.length === 0" class="list-group-item text-center text-muted py-4">
                                Chưa có đơn đặt xe nào
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH ĐIỀU CHUYỂN BIỂU ĐỒ (IMPORTS)
// ============================================================================
import { computed, onMounted, ref } from 'vue'
import ApexCharts from 'apexcharts'
import DashboardService from '@/services/dashboard.service'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

// ============================================================================
// 2. CƠ CHẾ KIỂM SOÁT QUYỀN HẠN NGHIÊM NGẶT THEO VAI TRÒ (RBAC - ROLE BASED ACCESS CONTROL)
// ============================================================================
// Chuyển đổi và trích xuất danh sách Slug quyền hạn của Người dùng đăng nhập từ Pinia Store
const userRoles = computed(() => {
    const roles = authStore.user?.roles || []
    return roles.map(r => typeof r === 'string' ? r : r.slug).filter(Boolean)
})

// Xác định quyền quản trị Tối cao (Master Admin, Admin truyền thống hoặc Kỹ thuật viên Ops)
const isSuperAdmin = computed(() => userRoles.value.some(r => ['admin', 'master_admin', 'ops_admin'].includes(r)))

// Quyền truy cập các module nghiệp vụ nhạy cảm (Tài chính, Báo cáo & Xe cộ) - Riêng CSKH sẽ bị giới hạn
const canAccessFinance = computed(() => isSuperAdmin.value || userRoles.value.includes('coordinator'))
const canAccessReports = computed(() => isSuperAdmin.value || userRoles.value.includes('coordinator'))
const canAccessVehicles = computed(() => isSuperAdmin.value || userRoles.value.includes('coordinator'))

// ============================================================================
// 3. KHỞI TẠO BẢNG CHỈ SỐ TỔNG QUAN HỆ THỐNG (DASHBOARD SUMMARY STATE)
// ============================================================================
// Đối tượng chứa trọn bộ các chỉ số thống kê tài chính, khách hàng và xe cộ trên 4 thẻ Header & Lists
const summary = ref({
    total_sales: 0,           // Tổng doanh thu phát sinh
    total_bookings: 0,        // Tổng lượt thuê xe toàn sàn
    total_expenses: 0,        // Chi phí vận hành
    invoice_due: 0,           // Hóa đơn đến hạn
    total_profit: 0,          // Lợi nhuận ròng của Sàn AutoCar
    total_returns: 0,         // Hoàn cọc / Trả thưởng
    total_insurance_fund: 0,  // Quỹ Bảo Hiểm Chuyến Đi (Chi trả cho sự cố, xước xát)
    growth: { profit_vs_last_month: 0 }, // Tỷ lệ tăng trưởng so với tháng liền kề
    customers_overview: {
        first_time: 0,        // Khách hàng thuê lần đầu
        return: 0             // Khách hàng quay lại thuê từ 2 lần trở lên (Retention)
    },
    user_stats: {
        suppliers: 0,         // Số lượng Chủ xe / Đối tác cho thuê
        customers: 0,         // Số lượng Khách hàng thành viên
        orders: 0             // Số đơn hàng đang xử lý
    },
    top_vehicles: [],         // Bảng xếp hạng Top những xe có tần suất thuê nhiều nhất
    pending_vehicles: [],     // Hàng đợi các Xe mới gửi đăng ký chờ Ban Quản Trị duyệt
    recent_bookings: []       // Lịch sử các giao dịch đặt xe mới phát sinh nhất
})

const isLoading = ref(true)   // Cờ trạng thái hiển thị hiệu ứng chờ khi gọi máy chủ

// ============================================================================
// 4. BỘ TIỆN ÍCH CHUYỂN HOÁ DỮ LIỆU THÔNG SỐ (FORMATTERS & TRANSLATORS)
// ============================================================================
// Chuẩn hóa con số nghìn tỷ sang đơn vị tiền tệ Tiếng Việt (VNĐ)
const formatCurrency = (val) => val ? Number(val).toLocaleString('vi-VN') + 'đ' : '0đ'

// Dịch ngữ trạng thái kỹ thuật tiếng Anh sang nhãn hiển thị tiếng Việt trang trọng
const translateStatus = (status) => {
    const statusMap = {
        'pending': 'Chờ xác nhận',
        'pending_approval': 'Chờ chủ xe duyệt',
        'pending_payment': 'Chờ thanh toán',
        'confirmed': 'Đã đặt cọc / Chờ đi',
        'in_progress': 'Đang chuyến đi',
        'completed': 'Đã hoàn thành',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
}

// ============================================================================
// 5. MÓC DẪN VÒNG ĐỜI NẠP SỐ LIỆU & KIẾN TẠO BIỂU ĐỒ (LIFECYCLE & APEXCHARTS)
// ============================================================================
onMounted(async () => {
    try {
        // [Bước 1]: Tải bộ chỉ số tổng quát cho các thẻ Thống kê từ Backend Laravel
        const resSummary = await DashboardService.getSummary();
        if (resSummary.data.success) {
            summary.value = resSummary.data.data;
        }

        // [Bước 2]: Tải dữ liệu dãy số lượng cho các Biểu đồ thống kê theo chu kỳ
        const resChart = await DashboardService.getChartData();
        let chartSeries = [];
        if (resChart.data.success) {
            chartSeries = resChart.data.data.series;
        }

        // (Biểu đồ Sales bị gỡ bỏ, dời sang ReportsView)

    } catch (error) {
        console.error("Lỗi khi load Dashboard data", error)
    } finally {
        isLoading.value = false;
    }

        // --------------------------------------------------------------------
        // [Biểu đồ 2]: BIỂU ĐỒ TRÒN PHÂN GẤP KHÁCH HÀNG MỚI VÀ QUAY LẠI (ApexCharts RadialBar)
        // --------------------------------------------------------------------
        const customerEl = document.querySelector('#customerChart')
        if (customerEl) {
            // Tính toán tỷ trọng (Percentage) trên tổng khách
            const firstTime = summary.value.customers_overview.first_time;
            const returns = summary.value.customers_overview.return;
            const total = firstTime + returns;
            
            const firstTimePct = total > 0 ? Math.round((firstTime / total) * 100) : 0;
            const returnPct = total > 0 ? Math.round((returns / total) * 100) : 0;

            const options2 = {
                series: [firstTimePct, returnPct],
                chart: { height: 200, type: 'radialBar' },
                colors: ['#5BE49B', '#E66239'],
                plotOptions: {
                    radialBar: {
                        dataLabels: { name: { fontSize: '22px' }, value: { fontSize: '16px' }, total: { show: false } },
                        hollow: { margin: 3, size: '40%', background: 'transparent' },
                        track: { show: true, background: "#f0f0f0", strokeWidth: '45%', opacity: 1, margin: 5 }
                    }
                },
                fill: { type: 'gradient', gradient: { shade: 'dark', type: 'vertical', gradientToColors: ['#007867', '#FFD666', '#FFAC82'], stops: [0, 100] } },
                stroke: { lineCap: 'round' },
                labels: ['Khách Mới', 'Khách Cũ']
            }
            const chart2 = new ApexCharts(customerEl, options2)
            chart2.render()
        }

    // Lưu ý: Tạm ẩn đoạn code của biểu đồ thứ 3 (salesChart) nếu không có phần tử #salesChart trên Template
})
</script>
