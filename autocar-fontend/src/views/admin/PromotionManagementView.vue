<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">

            <!-- TIÊU ĐỀ TRANG & NÚT TẠO MỚI -->
            <div class="row">
                <div class="col-12">
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                        <div>
                            <h1 class="fs-3 mb-1 fw-bold text-dark">Danh sách Mã giảm giá</h1>
                            <p class="mb-0 text-muted">Quản lý các chiến dịch khuyến mãi, mã coupon và lượt sử dụng</p>
                        </div>
                        <div>
                            <router-link to="/admin/campaign-management"
                                class="btn btn-primary fw-bold shadow-sm px-4 py-2 rounded-3 d-flex align-items-center">
                                <i class="fas fa-plus me-2"></i>Tạo mã mới
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <!-- THANH TÌM KIẾM & BỘ LỌC -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                        <!-- Search Box -->
                        <form @submit.prevent="handleSearch" class="input-group shadow-sm rounded-3 overflow-hidden" style="max-width: 360px;">
                            <span class="input-group-text bg-white border-end-0 text-muted">
                                <i class="fas fa-search"></i>
                            </span>
                            <input type="text" class="form-control border-start-0 ps-0"
                                v-model="searchQuery" @keyup.enter="handleSearch"
                                placeholder="Tìm theo tên chiến dịch, mã code...">
                            <button type="submit" class="btn btn-primary px-3">Tìm</button>
                        </form>

                        <!-- Filter options -->
                        <div class="d-flex gap-2 flex-wrap">
                            <select class="form-select text-dark shadow-sm fw-semibold" style="width: auto;" v-model="filterStatus" @change="handleFilter">
                                <option value="all">Tất cả trạng thái</option>
                                <option value="active">Đang diễn ra</option>
                                <option value="upcoming">Sắp tới</option>
                                <option value="expired">Đã kết thúc / Hết lượt</option>
                            </select>
                            <button type="button" class="btn btn-white border bg-white shadow-sm fw-semibold text-secondary" @click="loadVouchers(1)">
                                <i class="ti ti-refresh me-1"></i> Tải lại
                            </button>
                        </div>
                    </div>

                    <!-- BẢNG DANH SÁCH MÃ GIẢM GIÁ -->
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light text-muted small fw-semibold">
                                    <tr>
                                        <th class="px-4 py-3" style="width: 25%;">Chiến dịch / Mã Code</th>
                                        <th class="py-3">Mức giảm</th>
                                        <th class="py-3 text-center" style="width: 18%;">Đã dùng / Tổng số</th>
                                        <th class="py-3">Thời gian áp dụng</th>
                                        <th class="py-3">Trạng thái</th>
                                        <th class="px-4 py-3 text-end" style="width: 12%;">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody class="border-top-0">
                                    <!-- Hiển thị Loading -->
                                    <tr v-if="isLoading">
                                        <td colspan="6" class="text-center py-5">
                                            <div class="spinner-border text-primary" role="status">
                                                <span class="visually-hidden">Đang tải...</span>
                                            </div>
                                            <p class="text-muted mt-2 mb-0">Đang tải dữ liệu mã giảm giá...</p>
                                        </td>
                                    </tr>

                                    <!-- Không có dữ liệu -->
                                    <tr v-else-if="vouchers.length === 0">
                                        <td colspan="6" class="text-center py-5 text-muted">
                                            <i class="fas fa-ticket-alt fs-1 opacity-25 d-block mb-3"></i>
                                            Không tìm thấy mã giảm giá nào phù hợp với điều kiện tìm kiếm!
                                        </td>
                                    </tr>

                                    <!-- Danh sách Voucher -->
                                    <tr v-else v-for="item in vouchers" :key="item.id" :class="{'bg-light bg-opacity-50': getStatusInfo(item).code === 'expired'}">
                                        <td class="px-4 py-3">
                                            <h6 class="mb-1 fw-bold text-dark">{{ item.campaign?.title || 'Chiến dịch chung' }}</h6>
                                            <span class="badge bg-light text-primary border border-primary border-opacity-25 fs-6 font-monospace py-1 shadow-sm">
                                                {{ item.code }}
                                            </span>
                                        </td>
                                        <td class="py-3">
                                            <span class="text-danger fw-bold fs-6">
                                                {{ item.campaign?.type === 'percentage' ? `${Number(item.campaign?.value)}%` : `${formatCurrency(item.campaign?.value)}đ` }}
                                            </span>
                                        </td>
                                        <td class="py-3 text-center">
                                            <div class="fw-semibold text-dark">
                                                {{ item.used_count || 0 }} 
                                                <span class="text-muted fw-normal">/ {{ item.usage_limit ? item.usage_limit : '∞' }}</span>
                                            </div>
                                            <div class="progress mt-1" style="height: 5px;">
                                                <div class="progress-bar" 
                                                     :class="getProgressColor(item)"
                                                     role="progressbar" 
                                                     :style="`width: ${calculateProgress(item)}%;`">
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-3">
                                            <div class="text-dark small fw-semibold"><i class="far fa-calendar-alt text-muted me-1"></i>Từ: {{ formatDate(item.campaign?.start_date) }}</div>
                                            <div class="text-muted small"><i class="far fa-calendar-check text-muted me-1"></i>Đến: {{ formatDate(item.campaign?.end_date) }}</div>
                                        </td>
                                        <td class="py-3">
                                            <span :class="`badge bg-${getStatusInfo(item).color} bg-opacity-10 text-${getStatusInfo(item).color} border border-${getStatusInfo(item).color} px-2 py-1 rounded-2`">
                                                {{ getStatusInfo(item).label }}
                                            </span>
                                        </td>
                                        <td class="px-4 py-3 text-end">
                                            <button class="btn btn-sm btn-light text-primary me-2 shadow-sm" title="Chỉnh sửa mã" @click="openEditModal(item)">
                                                <i class="ti ti-edit fs-6"></i>
                                            </button>
                                            <button class="btn btn-sm btn-light text-danger shadow-sm" title="Xóa hoặc khóa hủy mã" @click="handleDeleteVoucher(item)">
                                                <i class="ti ti-trash fs-6"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- PHÂN TRANG -->
                        <div v-if="totalPages > 1 && !isLoading"
                             class="card-footer bg-white border-top p-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                            <span class="text-muted small fw-semibold">
                                Hiển thị {{ (currentPage - 1) * perPage + 1 }} đến {{ Math.min(currentPage * perPage, totalItems) }} trong tổng số {{ totalItems }} mã
                            </span>
                            <nav aria-label="Page navigation">
                                <ul class="pagination pagination-sm mb-0 shadow-sm">
                                    <li class="page-item" :class="{'disabled': currentPage <= 1}">
                                        <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage <= 1">Trước</button>
                                    </li>
                                    <li v-for="page in totalPages" :key="page" class="page-item" :class="{'active': page === currentPage}">
                                        <button class="page-link" @click="changePage(page)">{{ page }}</button>
                                    </li>
                                    <li class="page-item" :class="{'disabled': currentPage >= totalPages}">
                                        <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages">Sau</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MODAL CHỈNH SỬA MÃ GIẢM GIÁ -->
            <div class="modal fade" id="editVoucherModal" tabindex="-1" aria-labelledby="editVoucherModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content border-0 rounded-4 shadow">
                        <div class="modal-header border-bottom px-4 py-3">
                            <h5 class="modal-title fw-bold text-dark" id="editVoucherModalLabel">
                                <i class="fas fa-edit text-primary me-2"></i>Chỉnh sửa Mã giảm giá & Chiến dịch
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form @submit.prevent="handleUpdateVoucher">
                            <div class="modal-body p-4">
                                <div class="mb-3">
                                    <label class="form-label fw-semibold text-dark">Tên chiến dịch <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control bg-light border-0 py-2" v-model="editForm.title" required>
                                </div>
                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark">Mã Coupon (Code) <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control bg-light border-0 py-2 text-uppercase fw-bold text-primary" v-model="editForm.code" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark">Loại giảm giá <span class="text-danger">*</span></label>
                                        <select class="form-select bg-light border-0 py-2" v-model="editForm.type">
                                            <option value="percentage">Giảm theo phần trăm (%)</option>
                                            <option value="fixed_amount">Giảm tiền mặt cố định (VNĐ)</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark">
                                            {{ editForm.type === 'percentage' ? 'Phần trăm giảm (%) *' : 'Số tiền giảm (VNĐ) *' }}
                                        </label>
                                        <input type="number" class="form-control bg-light border-0 py-2" v-model="editForm.value" :min="1" :max="editForm.type === 'percentage' ? 100 : 100000000" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark">Giới hạn lượt dùng</label>
                                        <input type="number" class="form-control bg-light border-0 py-2" v-model="editForm.usage_limit" :min="editForm.used_count || 1" placeholder="Để trống nếu không giới hạn">
                                        <small class="text-muted">Đã sử dụng: {{ editForm.used_count || 0 }} lượt (Giới hạn mới không được nhỏ hơn lượt đã dùng)</small>
                                    </div>
                                </div>
                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark">Ngày bắt đầu <span class="text-danger">*</span></label>
                                        <input type="date" class="form-control bg-light border-0 py-2" v-model="editForm.start_date" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark">Ngày kết thúc <span class="text-danger">*</span></label>
                                        <input type="date" class="form-control bg-light border-0 py-2" v-model="editForm.end_date" required>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer border-top px-4 py-3 bg-light rounded-bottom-4">
                                <button type="button" class="btn btn-light border px-4" data-bs-dismiss="modal">Hủy</button>
                                <button type="submit" class="btn btn-primary px-4 fw-bold" :disabled="submitting">
                                    <span v-if="submitting"><i class="fas fa-spinner fa-spin me-2"></i>Đang lưu...</span>
                                    <span v-else><i class="fas fa-save me-2"></i>Lưu Thay Đổi</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    </main>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH API (IMPORTS & STATE)
// ============================================================================
import { ref, onMounted } from 'vue';
import promotionService from '@/services/promotion.service';

const vouchers = ref([]);
const isLoading = ref(false);
const submitting = ref(false);

// Bộ lọc & phân trang
const searchQuery = ref('');
const filterStatus = ref('all');
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const perPage = ref(15);

// Dữ liệu biểu mẫu sửa mã
const editForm = ref({
    id: null,
    title: '',
    code: '',
    type: 'percentage',
    value: null,
    usage_limit: null,
    used_count: 0,
    start_date: '',
    end_date: ''
});

// ============================================================================
// 2. TẢI DỮ LIỆU TỪ HỆ THỐNG MÁY CHỦ (DATA FETCHING)
// ============================================================================
/**
 * Tải danh sách mã giảm giá theo số trang và điều kiện bộ lọc
 */
const loadVouchers = async (page = 1) => {
    isLoading.value = true;
    currentPage.value = page;
    try {
        const response = await promotionService.getVouchers(
            currentPage.value,
            filterStatus.value,
            searchQuery.value
        );

        if (response.data && response.data.data) {
            const result = response.data.data;
            // Xử lý cả trường hợp response phân trang Laravel hoặc mảng thuần
            vouchers.value = result.data || result;
            currentPage.value = result.current_page || 1;
            totalPages.value = result.last_page || 1;
            totalItems.value = result.total || (Array.isArray(result) ? result.length : 0);
            perPage.value = result.per_page || 15;
        }
    } catch (error) {
        console.error('Lỗi khi tải danh sách mã giảm giá:', error);
        alert('Không thể tải dữ liệu từ máy chủ!');
    } finally {
        isLoading.value = false;
    }
};

/**
 * Trigger khi nhấn nút Tìm kiếm hoặc chọn Bộ lọc
 */
const handleSearch = () => loadVouchers(1);
const handleFilter = () => loadVouchers(1);
const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        loadVouchers(page);
    }
};

// ============================================================================
// 3. THAO TÁC SỬA HỢP ĐỒNG KHUYẾN MÃI (CRUD OPERATIONS)
// ============================================================================
/**
 * Mở modal chỉnh sửa chi tiết Mã giảm giá
 */
const openEditModal = (item) => {
    editForm.value = {
        id: item.id,
        title: item.campaign?.title || '',
        code: item.code,
        type: item.campaign?.type || 'percentage',
        value: Number(item.campaign?.value || 0),
        usage_limit: item.usage_limit || null,
        used_count: item.used_count || 0,
        start_date: parseDateForInput(item.campaign?.start_date),
        end_date: parseDateForInput(item.campaign?.end_date)
    };

    const modalEl = document.getElementById('editVoucherModal');
    const modal = new window.bootstrap.Modal(modalEl);
    modal.show();
};

/**
 * Xử lý lưu các thay đổi đã chỉnh sửa
 */
const handleUpdateVoucher = async () => {
    if (new Date(editForm.value.end_date) < new Date(editForm.value.start_date)) {
        alert('Ngày kết thúc không được nhỏ hơn ngày bắt đầu!');
        return;
    }

    submitting.value = true;
    try {
        const payload = {
            title: editForm.value.title.trim(),
            code: editForm.value.code.trim().toUpperCase(),
            type: editForm.value.type,
            value: Number(editForm.value.value),
            start_date: editForm.value.start_date,
            end_date: editForm.value.end_date,
            usage_limit: editForm.value.usage_limit ? Number(editForm.value.usage_limit) : null
        };

        const res = await promotionService.updateVoucher(editForm.value.id, payload);
        if (res.data?.success) {
            alert('✅ Cập nhật mã giảm giá thành công!');
            const modalEl = document.getElementById('editVoucherModal');
            const modal = window.bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();

            loadVouchers(currentPage.value);
        } else {
            alert(res.data?.message || 'Cập nhật không thành công!');
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật mã giảm giá:', error);
        const err = error.response?.data?.message || error.response?.data?.errors?.code?.[0] || 'Lỗi cập nhật hoặc Mã bị trùng!';
        alert('❌ ' + err);
    } finally {
        submitting.value = false;
    }
};

/**
 * Thao tác Xóa hoặc Khóa đóng phai hiệu lực mã
 */
const handleDeleteVoucher = async (item) => {
    const isUsed = (item.used_count || 0) > 0;
    const actionText = isUsed ? 'KHÓA & ĐÓNG PHAI HIỆU LỰC (do đã có lượt sử dụng)' : 'XÓA VĨNH VIỄN';
    
    if (confirm(`Xác nhận thực hiện thao tác: [ ${actionText} ] cho mã [ ${item.code} ]?`)) {
        try {
            const res = await promotionService.deleteVoucher(item.id);
            if (res.data?.success || res.status === 200) {
                alert('🎉 ' + (res.data?.message || 'Thao tác thành công!'));
                loadVouchers(currentPage.value);
            }
        } catch (error) {
            console.error('Lỗi khi xóa mã:', error);
            alert('❌ Lỗi hệ thống: ' + (error.response?.data?.message || 'Không thể thực hiện thao tác xóa!'));
        }
    }
};

// ============================================================================
// 4. TIỆN ÍCH HIỂN THỊ & ĐỊNH DẠNG (HELPERS & FORMATTERS)
// ============================================================================
/**
 * Chuyển đổi định dạng ISO string sang YYYY-MM-DD cho input[type=date]
 */
const parseDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    return date.toISOString().slice(0, 10);
};

/**
 * Định dạng ngày giờ chuẩn Việt Nam (DD/MM/YYYY)
 */
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    if (isNaN(d)) return dateString;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Định dạng tiền tệ VNĐ
 */
const formatCurrency = (val) => {
    if (!val && val !== 0) return '0';
    return Number(val).toLocaleString('vi-VN');
};

/**
 * Xác định trạng thái của Voucher theo thời gian và lượt dùng
 */
const getStatusInfo = (item) => {
    const now = new Date();
    const startDate = new Date(item.campaign?.start_date);
    const endDate = new Date(item.campaign?.end_date);
    
    // Nếu quá ngày kết thúc HOẶC hết lượt dùng
    if (now > endDate || (item.usage_limit && (item.used_count || 0) >= item.usage_limit)) {
        return { label: 'Hết hiệu lực / Hết lượt', color: 'secondary', code: 'expired' };
    }
    
    // Nếu chưa tới thời gian kích hoạt
    if (now < startDate) {
        return { label: 'Sắp tới', color: 'warning', code: 'upcoming' };
    }
    
    // Đang trong hạn áp dụng và còn lượt
    return { label: 'Đang diễn ra', color: 'success', code: 'active' };
};

/**
 * Tính toán tỷ lệ phần trăm sử dụng cho progress bar
 */
const calculateProgress = (item) => {
    if (!item.usage_limit) return 100; // Vô hạn thì hiển thị 100% thanh đầy
    const used = item.used_count || 0;
    const limit = item.usage_limit || 1;
    return Math.min(100, Math.round((used / limit) * 100));
};

const getProgressColor = (item) => {
    if (!item.usage_limit) return 'bg-info';
    const progress = calculateProgress(item);
    if (progress >= 100) return 'bg-danger';
    if (progress >= 80) return 'bg-warning';
    return 'bg-primary';
};

// ============================================================================
// 5. KHỞI TẠO TẢI TRANG Ban ĐẦU (MOUNTED HOOK)
// ============================================================================
onMounted(() => {
    loadVouchers(1);
});
</script>

<style scoped>
.font-monospace {
    letter-spacing: 0.5px;
}
.cursor-pointer {
    cursor: pointer;
}
</style>
