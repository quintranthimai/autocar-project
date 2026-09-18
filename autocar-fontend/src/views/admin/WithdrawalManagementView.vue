<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">

            <!-- HEADER -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h1 class="fs-3 mb-1 fw-bold text-dark">Yêu cầu rút tiền</h1>
                            <p class="mb-0 text-muted">Quản lý và xét duyệt các lệnh rút tiền từ ví của Chủ xe về ngân
                                hàng</p>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-primary fw-semibold shadow-sm">
                                <i class="fas fa-history me-2"></i>Lịch sử đối soát
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- THANH TÌM KIẾM VÀ LỌC -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-body p-4">
                    <div class="row g-3">
                        <div class="col-md-5">
                            <label class="form-label text-muted small fw-semibold">Tìm kiếm</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light border-0"><i
                                        class="fas fa-search text-muted"></i></span>
                                <input type="text" class="form-control bg-light border-0 fw-medium"
                                    placeholder="Nhập mã YC, tên chủ xe, số tài khoản..." v-model="searchQuery" @keyup.enter="fetchWithdrawals(1)">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-muted small fw-semibold">Trạng thái duyệt</label>
                            <select class="form-select bg-light border-0 fw-medium" v-model="filterStatus"
                                @change="fetchWithdrawals(1)">
                                <option value="all">Tất cả trạng thái</option>
                                <option value="pending">Chờ kiểm duyệt (Mới)</option>
                                <option value="approved">Đã chuyển khoản (Hoàn tất)</option>
                                <option value="rejected">Bị từ chối</option>
                            </select>
                        </div>
                        <div class="col-md-3 d-flex align-items-end">
                            <button class="btn btn-dark w-100 fw-semibold" @click="fetchWithdrawals(1)"><i
                                    class="fas fa-filter me-2"></i>Lọc dữ liệu</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BẢNG DANH SÁCH YÊU CẦU RÚT TIỀN -->
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0 text-center">
                            <thead class="bg-light text-muted small text-uppercase">
                                <tr>
                                    <th class="py-4 ps-4 text-start">Mã YC / Thời gian</th>
                                    <th class="py-4 text-start">Thông tin Chủ xe</th>
                                    <th class="py-4 text-start">Tài khoản thụ hưởng</th>
                                    <th class="py-4 text-end">Số tiền rút</th>
                                    <th class="py-4">Trạng thái</th>
                                    <th class="py-4 pe-4">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody class="text-dark border-top-0">
                                <tr v-for="withdrawal in filteredWithdrawals" :key="withdrawal.id">
                                    <td class="ps-4 text-start">
                                        <div class="fw-bold text-primary mb-1">#{{ withdrawal.code }}</div>
                                        <div class="text-muted small">{{ withdrawal.createdAt }}</div>
                                    </td>

                                    <td class="text-start">
                                        <div class="fw-bold text-dark mb-1">{{ withdrawal.ownerName }}</div>
                                        <div class="text-muted small">
                                            <i class="fas fa-phone-alt me-1"></i>{{ withdrawal.ownerPhone }}
                                        </div>
                                    </td>

                                    <td class="text-start">
                                        <div class="fw-bold text-dark mb-1">{{ withdrawal.bankName }}</div>
                                        <div class="text-muted small font-monospace">
                                            {{ withdrawal.bankAccount }} - {{ withdrawal.bankAccountName }}
                                        </div>
                                    </td>

                                    <td class="text-end">
                                        <div class="fw-bold fs-6 text-dark">{{ formatCurrency(withdrawal.amount) }}
                                        </div>
                                    </td>

                                    <td>
                                        <span :class="getStatusBadgeClass(withdrawal.status)"
                                            class="badge px-3 py-2 rounded-pill fw-medium">
                                            {{ getStatusText(withdrawal.status) }}
                                        </span>
                                    </td>

                                    <td class="pe-4">
                                        <div v-if="withdrawal.status === 'pending'"
                                            class="d-flex gap-2 justify-content-center">
                                            <button class="btn btn-sm btn-success fw-semibold rounded-3 px-3 shadow-sm"
                                                title="Xác nhận đã chuyển tiền" :disabled="loading"
                                                @click="handleApprove(withdrawal.id)">
                                                <i class="fas fa-check me-1"></i>Duyệt
                                            </button>
                                            <button class="btn btn-sm btn-danger fw-semibold rounded-3 px-3 shadow-sm"
                                                title="Từ chối yêu cầu" :disabled="loading"
                                                @click="handleReject(withdrawal.id)">
                                                <i class="fas fa-times me-1"></i>Từ chối
                                            </button>
                                        </div>
                                        <div v-else class="text-center">
                                            <span class="text-muted small fst-italic">Không có thao tác</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="filteredWithdrawals.length === 0">
                                    <td colspan="6" class="py-5 text-muted">
                                        <i class="fas fa-money-check-alt fs-2 mb-3 opacity-50 d-block"></i>
                                        Không tìm thấy yêu cầu rút tiền nào.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- PHÂN TRANG -->
                <div class="card-footer bg-white border-top p-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted small fw-medium">Hiển thị {{ pagination.from }} - {{ pagination.to }} trong
                        tổng số {{ pagination.total }} yêu cầu</div>
                    <nav aria-label="Page navigation" v-if="pagination.last_page > 1">
                        <ul class="pagination pagination-sm mb-0 gap-2">
                            <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                                <a class="page-link border-0 rounded-3 text-muted bg-light" href="#" tabindex="-1"
                                    @click.prevent="fetchWithdrawals(pagination.current_page - 1)"><i
                                        class="fas fa-chevron-left"></i></a>
                            </li>
                            <li class="page-item" v-for="page in pagination.last_page" :key="page"
                                :class="{ active: pagination.current_page === page }">
                                <a class="page-link border-0 rounded-3 shadow-sm" href="#"
                                    @click.prevent="fetchWithdrawals(page)">{{ page }}</a>
                            </li>
                            <li class="page-item"
                                :class="{ disabled: pagination.current_page === pagination.last_page }">
                                <a class="page-link border-0 rounded-3 text-dark bg-light" href="#"
                                    @click.prevent="fetchWithdrawals(pagination.current_page + 1)"><i
                                        class="fas fa-chevron-right"></i></a>
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
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & VÂN KẾT NỐI API RÚT TIỀN (IMPORTS)
// ============================================================================
import { ref, computed, onMounted } from 'vue';
import WithdrawalService from '@/services/withdrawal.service'; // Dịch vụ quản lý giải ngân Rút tiền Ví

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI & BỘ LỌC TÌM KIẾM CHI PHÍ (STATE MANAGEMENT)
// ============================================================================
const searchQuery = ref('');       // Từ khóa tra cứu mã phiếu RT, tên hoặc SĐT Chủ xe
const filterStatus = ref('all');   // Bộ lọc trạng thái rút tiền (Chờ duyệt, Đã chuyển khoản, Từ chối)
const loading = ref(false);        // Cờ chờ hiển thị hiệu ứng tải dữ liệu
const withdrawals = ref([]);       // Danh sách đơn yêu cầu giải ngân rút tiền từ Ví Chủ xe

// Cấu trúc theo dõi Trình Phân Trang (Pagination)
const pagination = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
});

// Xử lý bộ lọc hiển thị danh sách Yêu cầu giải ngân
const filteredWithdrawals = computed(() => withdrawals.value);

// ============================================================================
// 3. CÁC BỘ TIỆN ÍCH ĐỊNH DẠNG SỐ TIỀN & THỜI GIAN GIAO DỊCH (FORMATTERS)
// ============================================================================
// Quy chuẩn hiển thị chuỗi số nguyên sang kiểu tiền tệ Việt Nam (VNĐ)
const formatCurrency = (val) => val ? val.toLocaleString('vi-VN') + 'đ' : '0đ';

// Định dạng thời gian tạo giao dịch sang chuẩn "DD/MM/YYYY HH:mm"
const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// Hàm quy đổi chuỗi style Badge của Bootstrap cho Trạng thái Yêu cầu Rút tiền
const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'pending': return 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25';
        case 'approved': return 'bg-success bg-opacity-10 text-success border border-success border-opacity-25';
        case 'rejected': return 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
        default: return 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25';
    }
};

// Dịch nhãn mã trạng thái Rút tiền sang tiếng Việt
const getStatusText = (status) => {
    switch (status) {
        case 'pending': return 'Chờ duyệt';
        case 'approved': return 'Đã chuyển khoản';
        case 'rejected': return 'Từ chối';
        default: return 'Không xác định';
    }
};

// ============================================================================
// 4. TRÌNH NẠP DANH SÁCH & HỆ CHỌN TƯỢNG DUYỆT / TỪ CHỐI (API & ACTIONS)
// ============================================================================
/**
 * Tải danh sách yêu cầu Rút tiền của Đối tác Chủ xe theo trang, từ khóa và trạng thái
 */
const fetchWithdrawals = async (page = 1) => {
    if (page < 1) return;

    loading.value = true;
    try {
        const response = await WithdrawalService.getWithdrawals({
            page,
            status: filterStatus.value,
            search: searchQuery.value,
            perPage: 10,
        });

        if (response.data?.success) {
            const result = response.data.data;
            // Ánh xạ thuộc tính Tài khoản ngân hàng, Chủ xe và Số tiền rút
            withdrawals.value = (result.data || []).map((item) => ({
                id: item.id,
                code: `RT${item.id}`, // Tạo Tiền tố RT (Rút Tiền) cho mã lệnh
                createdAt: formatDateTime(item.created_at),
                ownerName: item.user?.name || 'N/A',
                ownerPhone: item.user?.phone || 'N/A',
                bankName: item.bank_name || 'N/A',
                bankAccount: item.bank_account,
                bankAccountName: item.bank_account_name || 'N/A',
                amount: item.amount,
                status: item.status,
            }));

            pagination.value = {
                current_page: result.current_page,
                last_page: result.last_page,
                total: result.total,
                from: result.from || 0,
                to: result.to || 0,
            };
        }
    } catch (error) {
        console.error('Lỗi tải yêu cầu rút tiền:', error);
    } finally {
        loading.value = false;
    }
};

/**
 * Phê duyệt chi tiền cho Chủ xe sau khi Kế toán/Quản trị viên đã thực hiện Chuyển khoản thực tế
 */
const handleApprove = async (id) => {
    if (!confirm('Xác nhận duyệt yêu cầu rút tiền này?')) return;

    try {
        const response = await WithdrawalService.approve(id);
        if (response.data?.success) {
            await fetchWithdrawals(pagination.value.current_page);
        }
    } catch (error) {
        alert(error?.response?.data?.message || 'Duyệt yêu cầu thất bại');
    }
};

/**
 * Từ chối yêu cầu giải ngân Rút tiền kèm theo nhập lý do minh bạch (Ví dụ: Sai số tài khoản ngân hàng)
 */
const handleReject = async (id) => {
    const reason = prompt('Nhập lý do từ chối yêu cầu:');
    if (!reason) return;

    try {
        const response = await WithdrawalService.reject(id, reason);
        if (response.data?.success) {
            await fetchWithdrawals(pagination.value.current_page);
        }
    } catch (error) {
        alert(error?.response?.data?.message || 'Từ chối yêu cầu thất bại');
    }
};

// ============================================================================
// 5. MÓC DẪN VÒNG ĐỜI KHỞI CHẠY (LIFECYCLE HOOKS)
// ============================================================================
onMounted(() => {
    fetchWithdrawals();
});
</script>
