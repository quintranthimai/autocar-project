<template>
    <div class="container py-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="fw-bold mb-1">Ví của tôi</h2>
                <p class="text-muted mb-0">Quản lý số dư, nạp tiền và gửi yêu cầu rút tiền.</p>
            </div>
        </div>

        <!-- CẢNH BÁO KHI VÍ BỊ KHÓA HOẶC SỐ DƯ ÂM -->
        <div v-if="wallet && (wallet.status === 'locked' || wallet.available_balance < 0)" class="alert alert-danger shadow-sm rounded-3 mb-4 d-flex align-items-center" role="alert">
            <i class="fas fa-exclamation-triangle fs-3 me-3 text-danger"></i>
            <div>
                <h6 class="fw-bold mb-1">Tài khoản và Ví của bạn đang bị hạn chế / khóa tạm thời!</h6>
                <p class="mb-1 small">
                    <strong>Lý do:</strong> {{ wallet.locked_reason || 'Số dư ví khả dụng của bạn đang bị âm do nợ tiền bồi thường hủy chuyến hoặc vi phạm sự cố/khiếu nại.' }}
                </p>
                <p class="mb-0 small text-dark fw-semibold">
                    <i class="fas fa-lock me-1"></i> Tất cả phương tiện của bạn sẽ tạm dừng niêm yết trên Sàn và chức năng Đặt xe bị vô hiệu hóa. Vui lòng nạp tối thiểu <strong class="text-danger">{{ formatCurrency(Math.abs(Math.min(0, wallet.available_balance))) }}</strong> để tự động tất toán công nợ và khôi phục hoạt động!
                </p>
            </div>
        </div>

        <div class="row g-4 mb-4">
            <div class="col-lg-4">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-body p-4">
                        <div class="text-muted small mb-1">Số dư khả dụng</div>
                        <div class="fs-3 fw-bold text-primary">{{ formatCurrency(wallet.available_balance) }}</div>
                        <div class="text-muted small mt-2">Số dư cọc: {{ formatCurrency(wallet.deposit_balance) }}</div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="fw-bold mb-0">Nạp tiền</h6>
                            <img src="@/assets/images/vnpay-logo.png" alt="VNPAY" style="height: 20px;" />
                        </div>
                        <div class="input-group mb-3">
                            <input type="number" min="10000" class="form-control" v-model.number="depositAmount" />
                            <button class="btn btn-primary" :disabled="loading" @click="handleDeposit">Nạp</button>
                        </div>
                        <div class="text-muted small">Tối thiểu 10.000đ</div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-body p-4">
                        <h6 class="fw-bold mb-3">Rút tiền</h6>
                        <input type="text" class="form-control mb-2" placeholder="Ngân hàng"
                            v-model="withdrawForm.bank_name" />
                        <input type="text" class="form-control mb-2" placeholder="Số tài khoản"
                            v-model="withdrawForm.bank_account" />
                        <input type="text" class="form-control mb-2" placeholder="Tên chủ tài khoản"
                            v-model="withdrawForm.bank_account_name" />
                        <div class="input-group mb-2">
                            <input type="number" min="50000" class="form-control"
                                v-model.number="withdrawForm.amount" />
                            <button class="btn btn-outline-primary" :disabled="loading"
                                @click="handleWithdraw">Gửi</button>
                        </div>
                        <div class="text-muted small">Tối thiểu 50.000đ</div>
                    </div>
                </div>
            </div>
        </div>

        <ul class="nav nav-tabs mb-3" id="walletTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active fw-semibold" id="transactions-tab" data-bs-toggle="tab" data-bs-target="#transactions" type="button" role="tab" aria-controls="transactions" aria-selected="true" @click="activeTab = 'transactions'">
                    Lịch sử giao dịch
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link fw-semibold" id="withdrawals-tab" data-bs-toggle="tab" data-bs-target="#withdrawals" type="button" role="tab" aria-controls="withdrawals" aria-selected="false" @click="activeTab = 'withdrawals'">
                    Yêu cầu rút tiền
                </button>
            </li>
        </ul>

        <div class="tab-content" id="walletTabContent">
            <!-- TAB GIAO DỊCH -->
            <div class="tab-pane fade show active" id="transactions" role="tabpanel" aria-labelledby="transactions-tab">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div class="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                        <h6 class="fw-bold mb-0">Biến động số dư</h6>
                        <select class="form-select form-select-sm" style="max-width: 180px" v-model="transactionFilter"
                            @change="fetchTransactionHistory(1)">
                            <option value="all">Tất cả trạng thái</option>
                            <option value="success">Thành công</option>
                            <option value="pending">Chờ xử lý</option>
                            <option value="failed">Thất bại</option>
                        </select>
                    </div>
                    <div class="table-responsive">
                        <table class="table align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th class="ps-4">Mã GD</th>
                                    <th>Loại</th>
                                    <th>Số tiền</th>
                                    <th>Nội dung</th>
                                    <th>Trạng thái</th>
                                    <th class="pe-4">Thời gian</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in transactions" :key="item.id">
                                    <td class="ps-4 fw-semibold">#GD{{ item.id }}</td>
                                    <td>
                                        <span class="badge" :class="item.type === 'credit' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'">
                                            {{ item.type === 'credit' ? 'Cộng tiền' : 'Trừ tiền' }}
                                        </span>
                                    </td>
                                    <td class="fw-bold" :class="item.type === 'credit' ? 'text-success' : 'text-danger'">
                                        {{ item.type === 'credit' ? '+' : '-' }}{{ formatCurrency(item.amount) }}
                                    </td>
                                    <td>{{ item.description }}</td>
                                    <td>
                                        <span class="badge rounded-pill"
                                            :class="item.status === 'success' ? 'text-bg-success' : item.status === 'failed' ? 'text-bg-danger' : 'text-bg-warning'">
                                            {{ item.status === 'success' ? 'Thành công' : item.status === 'failed' ? 'Thất bại' : 'Đang chờ' }}
                                        </span>
                                    </td>
                                    <td class="pe-4 text-muted small">{{ formatDate(item.created_at) }}</td>
                                </tr>
                                <tr v-if="!loading && transactions.length === 0">
                                    <td colspan="6" class="text-center text-muted py-4">Chưa có giao dịch nào.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="card-footer bg-white border-top d-flex justify-content-between align-items-center">
                        <span class="small text-muted">Hiển thị {{ transactionPagination.from }} - {{ transactionPagination.to }} / {{
                            transactionPagination.total }}</span>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-secondary" :disabled="transactionPagination.current_page <= 1"
                                @click="fetchTransactionHistory(transactionPagination.current_page - 1)">Trước</button>
                            <button class="btn btn-outline-secondary"
                                :disabled="transactionPagination.current_page >= transactionPagination.last_page"
                                @click="fetchTransactionHistory(transactionPagination.current_page + 1)">Sau</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB RÚT TIỀN -->
            <div class="tab-pane fade" id="withdrawals" role="tabpanel" aria-labelledby="withdrawals-tab">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div class="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                        <h6 class="fw-bold mb-0">Lịch sử yêu cầu rút tiền</h6>
                        <select class="form-select form-select-sm" style="max-width: 180px" v-model="statusFilter"
                            @change="fetchWithdrawalHistory(1)">
                            <option value="all">Tất cả</option>
                            <option value="pending">Chờ duyệt</option>
                            <option value="approved">Đã duyệt</option>
                            <option value="rejected">Từ chối</option>
                        </select>
                    </div>
                    <div class="table-responsive">
                        <table class="table align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th class="ps-4">Mã</th>
                                    <th>Ngân hàng</th>
                                    <th>Số tài khoản</th>
                                    <th class="text-end">Số tiền</th>
                                    <th>Trạng thái</th>
                                    <th class="pe-4">Thời gian</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in withdrawals" :key="item.id">
                                    <td class="ps-4 fw-semibold">#WD{{ item.id }}</td>
                                    <td>{{ item.bank_name || 'N/A' }}</td>
                                    <td>{{ item.bank_account }}</td>
                                    <td class="text-end fw-semibold">{{ formatCurrency(item.amount) }}</td>
                                    <td>
                                        <span class="badge rounded-pill"
                                            :class="item.status === 'approved' ? 'text-bg-success' : item.status === 'rejected' ? 'text-bg-danger' : 'text-bg-warning'">
                                            {{ getStatusText(item.status) }}
                                        </span>
                                    </td>
                                    <td class="pe-4 text-muted small">{{ formatDate(item.created_at) }}</td>
                                </tr>
                                <tr v-if="!loading && withdrawals.length === 0">
                                    <td colspan="6" class="text-center text-muted py-4">Chưa có yêu cầu rút tiền nào.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="card-footer bg-white border-top d-flex justify-content-between align-items-center">
                        <span class="small text-muted">Hiển thị {{ pagination.from }} - {{ pagination.to }} / {{
                            pagination.total }}</span>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-secondary" :disabled="pagination.current_page <= 1"
                                @click="fetchWithdrawalHistory(pagination.current_page - 1)">Trước</button>
                            <button class="btn btn-outline-secondary"
                                :disabled="pagination.current_page >= pagination.last_page"
                                @click="fetchWithdrawalHistory(pagination.current_page + 1)">Sau</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH XỬ LÝ VÍ (IMPORTS)
// ============================================================================
import { onMounted, ref } from 'vue'
import WalletService from '@/services/wallet.service'

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI VÍ, GIAO DỊCH VÀ ĐM NẠP/RÚT (STATE MANAGEMENT)
// ============================================================================
const activeTab = ref('transactions') // Điều hướng Tab hiển thị hiện tại ('transactions' vs 'withdrawals')
const loading = ref(false)            // Cờ trạng thái đang tải từ hệ thống
const wallet = ref({ available_balance: 0, deposit_balance: 0 }) // Thông số số dư khả dụng và cọc
const depositAmount = ref(100000)     // Mức tiền mặc định mong muốn nạp qua VNPAY

// Cụm cấu trúc Quản lý Yêu cầu rút tiền
const statusFilter = ref('all')
const withdrawals = ref([])
const pagination = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
})

// Cụm cấu trúc Quản lý Lịch sử giao dịch biến động số dư
const transactionFilter = ref('all')
const transactions = ref([])
const transactionPagination = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
})

// Biểu mẫu đệ trình yêu cầu Rút tiền về Ngân hàng cá nhân
const withdrawForm = ref({
    amount: 50000,
    bank_name: '',
    bank_account: '',
    bank_account_name: '',
})

// ============================================================================
// 3. BỘ HÀM TIỆN ÍCH ĐỊNH DẠNG TIỀN TỆ & TRẠNG THÁI GIAO DỊCH (FORMATTERS)
// ============================================================================
const formatCurrency = (val) => Number(val || 0).toLocaleString('vi-VN') + 'đ'

const formatDate = (val) => {
    if (!val) return 'N/A'
    const d = new Date(val)
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const getStatusText = (status) => {
    if (status === 'approved') return 'Đã duyệt'
    if (status === 'rejected') return 'Từ chối'
    return 'Chờ duyệt'
}

// ============================================================================
// 4. BỘ HÀM TẢI DỮ LIỆU TỪ HỆ THỐNG MÁY CHỦ (DATA HYDRATION API)
// ============================================================================

/**
 * Tải thông tin tài khoản Ví điện tử AutoCar (Số dư khả dụng + Số dư giữ cọc)
 */
const fetchWallet = async () => {
    const response = await WalletService.getWallet()
    if (response.data?.success) {
        wallet.value = response.data.data
    }
}

/**
 * Tải danh sách Lịch sử yêu cầu rút tiền theo Trang & Điều kiện lọc trạng thái
 */
const fetchWithdrawalHistory = async (page = 1) => {
    loading.value = true
    try {
        const response = await WalletService.getWithdrawalHistory(page, statusFilter.value)
        if (response.data?.success) {
            const result = response.data.data
            withdrawals.value = result.data || []
            pagination.value = {
                current_page: result.current_page,
                last_page: result.last_page,
                total: result.total,
                from: result.from || 0,
                to: result.to || 0,
            }
        }
    } finally {
        loading.value = false
    }
}

/**
 * Tải danh sách Biến động số dư (Cộng/Trừ tiền) trong toàn bộ lịch sử tài khoản
 */
const fetchTransactionHistory = async (page = 1) => {
    loading.value = true
    try {
        const response = await WalletService.getTransactionHistory(page, 'all', transactionFilter.value)
        if (response.data?.success) {
            const result = response.data.data
            transactions.value = result.data || []
            transactionPagination.value = {
                current_page: result.current_page,
                last_page: result.last_page,
                total: result.total,
                from: result.from || 0,
                to: result.to || 0,
            }
        }
    } finally {
        loading.value = false
    }
}

// ============================================================================
// 5. TRÌNH NẠP VÀ RÚT TIỀN VÍ THÔNG QUA CỔNG VNPAY (DEPOSIT & WITHDRAWAL LOGIC)
// ============================================================================

/**
 * Xử lý Nạp tiền: Ghi nhận số tiền và điều hướng người dùng sang Cổng VNPAY
 */
const handleDeposit = async () => {
    if (!depositAmount.value || Number(depositAmount.value) < 10000) {
        alert('Số tiền nạp tối thiểu là 10.000đ')
        return
    }

    loading.value = true
    try {
        const response = await WalletService.deposit({ amount: Number(depositAmount.value) })
        if (response.data?.success && response.data?.data?.payment_url) {
            // Đẩy sang cổng VNPAY để người dùng thanh toán nạp Quỹ
            window.location.href = response.data.data.payment_url;
        }
    } catch (error) {
        alert(error?.response?.data?.message || 'Nạp tiền thất bại')
    } finally {
        loading.value = false
    }
}

/**
 * Xử lý Rút tiền: Đệ trình yêu cầu thanh lý về Tài khoản ngân hàng (admin duyệt tay)
 */
const handleWithdraw = async () => {
    if (!withdrawForm.value.bank_account || !withdrawForm.value.amount) {
        alert('Vui lòng nhập đầy đủ thông tin rút tiền')
        return
    }

    loading.value = true
    try {
        const response = await WalletService.withdraw({
            amount: Number(withdrawForm.value.amount),
            bank_name: withdrawForm.value.bank_name,
            bank_account: withdrawForm.value.bank_account,
            bank_account_name: withdrawForm.value.bank_account_name,
        })

        if (response.data?.success) {
            await Promise.all([fetchWallet(), fetchWithdrawalHistory(1)])
            alert('Yêu cầu rút tiền đã được gửi thành công')
        }
    } catch (error) {
        alert(error?.response?.data?.message || 'Gửi yêu cầu rút tiền thất bại')
    } finally {
        loading.value = false
    }
}

// ============================================================================
// 6. MÓC TRÌNH DẪN VÒNG ĐỜI ONMOUNTED (URL PARSER & INITIALIZATION)
// ============================================================================
onMounted(async () => {
    // Kiểm tra tham số trả về từ VNPAY trên URL để thông báo kết quả nạp Quỹ
    const urlParams = new URLSearchParams(window.location.search);
    const vnpCode = urlParams.get('vnp_ResponseCode');
    
    if (vnpCode) {
        if (vnpCode === '00') {
            alert('Nạp tiền vào ví thành công!');
        } else {
            alert('Nạp tiền thất bại hoặc đã bị hủy.');
        }
        
        // Làm sạch chuỗi truy vấn (query params) khỏi thanh URL cho thẩm mỹ
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Tải song song tất cả các bảng dữ liệu Ví, Lịch sử Rút và Biến động số dư
    await Promise.all([fetchWallet(), fetchWithdrawalHistory(), fetchTransactionHistory()])
})
</script>
