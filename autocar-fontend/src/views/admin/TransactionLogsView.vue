<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">

            <!-- HEADER -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h1 class="fs-3 mb-1 fw-bold text-dark">Nhật ký giao dịch</h1>
                            <p class="mb-0 text-muted">Đối soát dòng tiền, kiểm tra lịch sử thanh toán, hoàn tiền và rút
                                tiền</p>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-white border bg-white fw-semibold shadow-sm text-dark">
                                <i class="fas fa-print me-2"></i>In sao kê
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- THANH TÌM KIẾM VÀ LỌC BÁO CÁO -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-body p-4">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label text-muted small fw-semibold">Tìm kiếm giao dịch</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light border-0"><i
                                        class="fas fa-search text-muted"></i></span>
                                <!-- Gắn sự kiện enter để tìm kiếm -->
                                <input type="text" class="form-control bg-light border-0 fw-medium"
                                    placeholder="Mã đơn xe hoặc nội dung..." v-model="searchQuery"
                                    @keyup.enter="fetchTransactions(1)">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted small fw-semibold">Loại giao dịch</label>
                            <!-- Gắn sự kiện đổi bộ lọc gọi API. Đổi value thành chuẩn của database (credit/debit) -->
                            <select class="form-select bg-light border-0 fw-medium" v-model="filterType"
                                @change="fetchTransactions(1)">
                                <option value="all">Tất cả loại hình</option>
                                <option value="credit">Tiền vào (Nạp ví / Hoàn tiền)</option>
                                <option value="debit">Tiền ra (Chi / Thanh toán)</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label text-muted small fw-semibold">Từ ngày</label>
                            <input type="date" v-model="fromDate" class="form-control bg-light border-0 fw-medium">
                        </div>
                        <div class="col-md-2">
                            <label class="form-label text-muted small fw-semibold">Đến ngày</label>
                            <input type="date" v-model="toDate" class="form-control bg-light border-0 fw-medium">
                        </div>
                        <div class="col-md-2 d-flex align-items-end">
                            <button class="btn btn-dark w-100 fw-semibold" @click="fetchTransactions(1)"><i
                                    class="fas fa-filter me-2"></i>Truy vấn</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BẢNG DANH SÁCH GIAO DỊCH -->
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0 text-center">
                            <thead class="bg-light text-muted small text-uppercase">
                                <tr>
                                    <th class="py-4 ps-4 text-start">Mã Giao dịch</th>
                                    <th class="py-4 text-start">Nội dung / Tham chiếu</th>
                                    <th class="py-4 text-start">Đối tác / Khách hàng</th>
                                    <th class="py-4">Cổng thanh toán</th>
                                    <th class="py-4 text-end">Số tiền</th>
                                    <th class="py-4">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody class="text-dark border-top-0">

                                <tr v-if="loading">
                                    <td colspan="6" class="py-5 text-center">
                                        <div class="spinner-border text-primary" role="status"></div>
                                    </td>
                                </tr>

                                <tr v-else-if="filteredTransactions.length > 0" v-for="txn in filteredTransactions"
                                    :key="txn.id">
                                    <td class="ps-4 text-start">
                                        <div class="fw-bold text-dark mb-1">{{ txn.transactionId }}</div>
                                        <div class="text-muted small">{{ txn.createdAt }}</div>
                                    </td>

                                    <td class="text-start">
                                        <div class="fw-bold text-dark mb-1">{{ txn.description }}</div>
                                        <div class="text-muted small">
                                            Tham chiếu:
                                            <router-link v-if="txn.booking_id" :to="'/admin/bookings/' + txn.booking_id"
                                                class="text-decoration-none fw-semibold">
                                                #DX{{ txn.booking_id }}
                                            </router-link>
                                            <span v-else class="fw-medium text-muted fst-italic">Nạp/Rút ví</span>
                                        </div>
                                    </td>

                                    <td class="text-start">
                                        <div class="fw-medium text-dark mb-1">{{ txn.userName }}</div>
                                        <div class="text-muted small">{{ txn.userPhone }}</div>
                                    </td>

                                    <td>
                                        <span v-if="txn.gateway === 'VNPAY'"
                                            class="badge bg-light text-dark border px-3 py-1 rounded-pill">
                                            <img src="@/assets/images/vnpay-logo.png"
                                                height="16" class="me-1">
                                        </span>
                                        <span v-else-if="txn.gateway === 'WALLET'"
                                            class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1 rounded-pill fw-medium">
                                            <i class="fas fa-wallet me-1"></i> Ví Hệ Thống
                                        </span>
                                        <span v-else
                                            class="badge bg-secondary bg-opacity-10 text-secondary border px-3 py-1 rounded-pill fw-medium">
                                            <i class="fas fa-university me-1"></i> Ngân hàng
                                        </span>
                                    </td>

                                    <td class="text-end">
                                        <div class="fw-bold fs-6"
                                            :class="txn.flow === 'IN' ? 'text-success' : 'text-danger'">
                                            {{ txn.flow === 'IN' ? '+' : '-' }} {{ formatCurrency(txn.amount) }}
                                        </div>
                                    </td>

                                    <td>
                                        <span :class="getStatusBadgeClass(txn.status)"
                                            class="badge px-3 py-2 rounded-pill fw-medium">
                                            {{ getStatusText(txn.status) }}
                                        </span>
                                    </td>
                                </tr>

                                <tr v-else>
                                    <td colspan="6" class="py-5 text-muted">
                                        <i class="fas fa-receipt fs-2 mb-3 opacity-50 d-block"></i>
                                        Không tìm thấy lịch sử giao dịch nào phù hợp.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- PHÂN TRANG -->
                <div class="card-footer bg-white border-top p-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted small fw-medium">Hiển thị {{ pagination.from }} - {{ pagination.to }} trong
                        tổng số {{ pagination.total }} giao dịch</div>
                    <nav aria-label="Page navigation" v-if="pagination.last_page > 1">
                        <ul class="pagination pagination-sm mb-0 gap-2">
                            <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                                <a class="page-link border-0 rounded-3 bg-light"
                                    :class="pagination.current_page === 1 ? 'text-muted' : 'text-dark'" href="#"
                                    @click.prevent="fetchTransactions(pagination.current_page - 1)">
                                    <i class="fas fa-chevron-left"></i>
                                </a>
                            </li>
                            <li class="page-item" v-for="page in pagination.last_page" :key="page"
                                :class="{ active: pagination.current_page === page }">
                                <a class="page-link border-0 rounded-3 shadow-sm"
                                    :class="pagination.current_page === page ? '' : 'text-dark bg-light'" href="#"
                                    @click.prevent="fetchTransactions(page)">
                                    {{ page }}
                                </a>
                            </li>
                            <li class="page-item"
                                :class="{ disabled: pagination.current_page === pagination.last_page }">
                                <a class="page-link border-0 rounded-3 bg-light"
                                    :class="pagination.current_page === pagination.last_page ? 'text-muted' : 'text-dark'"
                                    href="#" @click.prevent="fetchTransactions(pagination.current_page + 1)">
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
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CÔNG CHẾ DỊCH VỤ (IMPORTS)
// ============================================================================
import { ref, onMounted } from 'vue';
import BookingService from '@/services/booking.service'; // Service chứa cổng nối truy vấn giao dịch tài chính

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI & TRÌNH BỘ LỌC TƯƠNG TÁC (FILTERS & STATE)
// ============================================================================
const searchQuery = ref('');      // Từ khóa tìm kiếm theo tên hoặc số điện thoại khách
const filterType = ref('all');    // Phân loại dòng tiền (Tất cả, Nạp vào, Rút ra)
const fromDate = ref('');         // Mốc thời gian tra cứu từ ngày
const toDate = ref('');           // Mốc thời gian tra cứu đến ngày
const filteredTransactions = ref([]); // Danh sách giao dịch hiển thị trên Bảng
const loading = ref(true);        // Cờ hiệu ứng đang nạp dữ liệu

// Đối tượng quản lý phân trang chuyên sâu (Pagination)
const pagination = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0
});

// ============================================================================
// 3. TRÌNH TIỆN ÍCH CHUYỂN NGỮ VÀ HIỂN THỊ (FORMATTERS & BADGES)
// ============================================================================
/**
 * Định dạng số tiền sang chuẩn chuỗi tiền tệ VNĐ
 */
const formatCurrency = (val) => val ? Number(val).toLocaleString('vi-VN') + 'đ' : '0đ';

/**
 * Chuẩn hóa ngày giờ sang dạng hiển thị Giờ:Phút:Giây và Ngày/Tháng/Năm của Việt Nam
 */
const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')} ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

/**
 * Phối chuỗi bộ style nhãn màu sắc Bootstrap theo trạng thái thực tế của giao dịch
 */
const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'success': return 'bg-success bg-opacity-10 text-success border border-success border-opacity-25';
        case 'pending': return 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25';
        case 'failed': return 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
        default: return 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25';
    }
};

/**
 * Chuyển đổi mã trang thái hệ thống sang ngôn từ ngữ nghĩa tiếng Việt
 */
const getStatusText = (status) => {
    switch (status) {
        case 'success': return 'Thành công';
        case 'pending': return 'Đang xử lý';
        case 'failed': return 'Thất bại';
        default: return 'Không xác định';
    }
};

// ============================================================================
// 4. ĐẦU NỐI KẾT NỐI VÀ ÁNH XẠ DỮ LIỆU TÀI CHÍNH MÁY CHỦ (API & DATA MAPPING)
// ============================================================================
/**
 * Tải danh sách nhật ký kiểm toán giao dịch hệ thống từ Backend
 * Thực hiện biến đổi (Mapping) cấu trúc luồng tiền credit/debit thành dấu + (IN) hoặc - (OUT)
 */
const fetchTransactions = async (page = 1) => {
    loading.value = true;
    try {
        const response = await BookingService.getAllTransactions(page, filterType.value, searchQuery.value, fromDate.value, toDate.value);
        if (response.data.success) {
            const resultData = response.data.data;

            // Ánh xạ (Mapping) dữ liệu thô từ máy chủ về dạng tương thích hoàn hảo với Template
            filteredTransactions.value = resultData.data.map(t => {
                // Định dạng chiều chuyển khoản: credit (nạp/nhận thưởng/cọc) = IN (+), debit (rút/trả cọc) = OUT (-)
                const isIncome = t.type === 'credit';

                // Nhận diện cổng thanh toán (Gateway) từ nội dung mô tả hoặc ID ví
                const gatewayType = t.description?.toLowerCase().includes('vnpay') ? 'VNPAY' : (t.wallet_id ? 'WALLET' : 'BANK');

                return {
                    id: t.id,
                    transactionId: '#GD' + t.id,
                    createdAt: formatDateTime(t.created_at),
                    description: t.description || 'Giao dịch hệ thống',
                    booking_id: t.booking_id,
                    userName: t.wallet?.user?.name || t.booking?.renter?.name || 'Khách vãng lai',
                    userPhone: t.wallet?.user?.phone || t.booking?.renter?.phone || 'Chưa cập nhật',
                    gateway: gatewayType,
                    amount: t.amount,
                    flow: isIncome ? 'IN' : 'OUT',
                    status: 'success' // Mặc định bản ghi đã vào log kiểm toán là thành công
                };
            });

            // Đồng bộ trạng thái bộ điều hướng Phân trang
            pagination.value = {
                current_page: resultData.current_page,
                last_page: resultData.last_page,
                total: resultData.total,
                from: resultData.from || 0,
                to: resultData.to || 0
            };
        }
    } catch (error) {
        console.error('Lỗi tải nhật ký giao dịch:', error);
    } finally {
        loading.value = false;
    }
};

// ============================================================================
// 5. MÓC DẪN VÒNG ĐỜI KHỞI TRÌNH GIAO DIỆN (LIFECYCLE HOOKS)
// ============================================================================
onMounted(() => {
    fetchTransactions();
});
</script>
