<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">

            <form @submit.prevent="handleSaveSettings">
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                            <div>
                                <h1 class="fs-3 mb-1 fw-bold text-dark">Cài đặt hệ thống</h1>
                                <p class="mb-0 text-muted">Cấu hình các thông số cốt lõi, tỷ lệ tài chính và thiết lập
                                    layout động cho ứng dụng</p>
                            </div>
                            <div class="d-flex gap-2">
                                <button type="button"
                                    class="btn btn-white border bg-white fw-semibold text-dark shadow-sm px-4"
                                    @click="resetSettings">
                                    <i class="fas fa-undo me-2"></i>Khôi phục gốc
                                </button>
                                <button type="submit" class="btn btn-primary fw-bold shadow-sm px-4">
                                    <i class="fas fa-save me-2"></i>Lưu tất cả thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row g-4">

                    <div class="col-12 col-xl-6">
                        <div class="card border-0 shadow-sm rounded-4 h-100">
                            <div class="card-body p-4 p-lg-5">
                                <h5 class="fw-bold text-dark mb-4 border-bottom pb-3">
                                    <i class="fas fa-money-bill-wave text-success me-2"></i>Tài chính & Hoa hồng
                                </h5>

                                <div class="mb-4">
                                    <label class="form-label fw-semibold text-dark">Phí hoa hồng sàn (Thu từ Chủ xe)
                                        <span class="text-danger">*</span></label>
                                    <div class="input-group input-group-lg shadow-sm">
                                        <input type="number" class="form-control bg-light border-end-0"
                                            v-model="settings.commissionRate" step="0.1" min="0" max="100" required>
                                        <span
                                            class="input-group-text bg-light text-muted fw-bold border-start-0">%</span>
                                    </div>
                                    <small class="text-muted mt-1 d-block">Tỷ lệ phần trăm hệ thống rút lại từ mỗi giao
                                        dịch thành công.</small>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label fw-semibold text-dark">Phí dịch vụ mặc định (Thu từ Khách
                                        thuê) <span class="text-danger">*</span></label>
                                    <div class="input-group input-group-lg shadow-sm">
                                        <input type="number" class="form-control bg-light border-end-0"
                                            v-model="settings.serviceFeeRate" step="0.1" min="0" max="100" required>
                                        <span
                                            class="input-group-text bg-light text-muted fw-bold border-start-0">%</span>
                                    </div>
                                </div>

                                <div class="mb-2">
                                    <label class="form-label fw-semibold text-dark">Hạn mức rút tiền tối thiểu <span
                                            class="text-danger">*</span></label>
                                    <div class="input-group input-group-lg shadow-sm">
                                        <input type="number" class="form-control bg-light border-end-0"
                                            v-model="settings.minWithdrawal" step="10000" min="0" required>
                                        <span
                                            class="input-group-text bg-light text-muted fw-bold border-start-0">VNĐ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-xl-6">
                        <div class="card border-0 shadow-sm rounded-4 h-100">
                            <div class="card-body p-4 p-lg-5">
                                <h5 class="fw-bold text-dark mb-4 border-bottom pb-3">
                                    <i class="fas fa-cogs text-primary me-2"></i>Quy định Vận hành
                                </h5>

                                <div class="mb-4">
                                    <label class="form-label fw-semibold text-dark">Thời gian chờ Chủ xe duyệt yêu cầu
                                        <span class="text-danger">*</span></label>
                                    <div class="input-group input-group-lg shadow-sm">
                                        <input type="number" class="form-control bg-light border-end-0"
                                            v-model="settings.ownerApprovalTimeout" min="1" required>
                                        <span
                                            class="input-group-text bg-light text-muted fw-bold border-start-0">Giờ</span>
                                    </div>
                                    <small class="text-muted mt-1 d-block">Quá hạn hệ thống tự động Hủy và hoàn tiền cho
                                        khách.</small>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label fw-semibold text-dark">Thời gian chờ Khách thanh toán cọc
                                        <span class="text-danger">*</span></label>
                                    <div class="input-group input-group-lg shadow-sm">
                                        <input type="number" class="form-control bg-light border-end-0"
                                            v-model="settings.paymentTimeout" min="1" required>
                                        <span
                                            class="input-group-text bg-light text-muted fw-bold border-start-0">Phút</span>
                                    </div>
                                </div>

                                <div class="mb-2">
                                    <label class="form-label fw-semibold text-dark">Tỷ lệ tiền cọc mặc định <span
                                            class="text-danger">*</span></label>
                                    <div class="input-group input-group-lg shadow-sm">
                                        <input type="number" class="form-control bg-light border-end-0"
                                            v-model="settings.depositRate" min="0" max="100" required>
                                        <span
                                            class="input-group-text bg-light text-muted fw-bold border-start-0">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-xl-6">
                        <div class="card border-0 shadow-sm rounded-4 h-100">
                            <div class="card-body p-4 p-lg-5">
                                <h5 class="fw-bold text-dark mb-4 border-bottom pb-3">
                                    <i class="fas fa-desktop text-info me-2"></i>Hiển thị Trang khách hàng
                                </h5>

                                <div
                                    class="d-flex align-items-center justify-content-between bg-light p-3 rounded-3 border mb-3">
                                    <div>
                                        <h6 class="mb-1 fw-bold text-dark">Khối Slider & Banner lớn</h6>
                                        <small class="text-muted">Hiển thị vùng chiến dịch quảng cáo đầu trang
                                            chủ</small>
                                    </div>
                                    <div class="form-check form-switch fs-4 mb-0">
                                        <input class="form-check-input cursor-pointer" type="checkbox" role="switch"
                                            v-model="settings.showHeroBanner">
                                    </div>
                                </div>

                                <div
                                    class="d-flex align-items-center justify-content-between bg-light p-3 rounded-3 border mb-3">
                                    <div>
                                        <h6 class="mb-1 fw-bold text-dark">Khối "Ưu đãi hot hằng tuần"</h6>
                                        <small class="text-muted">Hiển thị danh sách xe đang được giảm giá sâu</small>
                                    </div>
                                    <div class="form-check form-switch fs-4 mb-0">
                                        <input class="form-check-input cursor-pointer" type="checkbox" role="switch"
                                            v-model="settings.showHotDeals">
                                    </div>
                                </div>

                                <div
                                    class="d-flex align-items-center justify-content-between bg-light p-3 rounded-3 border mb-4">
                                    <div>
                                        <h6 class="mb-1 fw-bold text-dark">Khối "Xe mới đăng"</h6>
                                        <small class="text-muted">Hiển thị danh sách các phương thức xe vừa lên
                                            sàn</small>
                                    </div>
                                    <div class="form-check form-switch fs-4 mb-0">
                                        <input class="form-check-input cursor-pointer" type="checkbox" role="switch"
                                            v-model="settings.showNewVehicles">
                                    </div>
                                </div>

                                <div class="mb-2">
                                    <label class="form-label fw-semibold text-dark">Chế độ hiển thị danh sách xe mặc
                                        định</label>
                                    <select class="form-select form-select-lg bg-light border-0 fs-6 py-2 shadow-sm"
                                        v-model="settings.customerVehicleView">
                                        <option value="grid">Dạng Lưới (Grid View - Trực quan, nhiều ảnh)</option>
                                        <option value="list">Dạng Danh sách (List View - Tiết kiệm không gian)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-xl-6">
                        <div class="card border-0 shadow-sm rounded-4 h-100">
                            <div class="card-body p-4 p-lg-5">
                                <h5 class="fw-bold text-dark mb-4 border-bottom pb-3">
                                    <i class="fas fa-user-tie text-purple me-2 text-primary"></i>Giao diện của Chủ xe
                                </h5>

                                <div
                                    class="d-flex align-items-center justify-content-between bg-light p-3 rounded-3 border mb-3">
                                    <div>
                                        <h6 class="mb-1 fw-bold text-dark">Widget phân tích doanh thu trực quan</h6>
                                        <small class="text-muted">Hiển thị biểu đồ phân tích trên Dashboard của Chủ
                                            xe</small>
                                    </div>
                                    <div class="form-check form-switch fs-4 mb-0">
                                        <input class="form-check-input cursor-pointer" type="checkbox" role="switch"
                                            v-model="settings.showRevenueWidget">
                                    </div>
                                </div>

                                <div
                                    class="d-flex align-items-center justify-content-between bg-light p-3 rounded-3 border mb-3">
                                    <div>
                                        <h6 class="mb-1 fw-bold text-dark">Mục "Hướng dẫn đăng ký xe mới"</h6>
                                        <small class="text-muted">Hiển thị tài liệu chỉ dẫn các bước đăng kiểm
                                            xe</small>
                                    </div>
                                    <div class="form-check form-switch fs-4 mb-0">
                                        <input class="form-check-input cursor-pointer" type="checkbox" role="switch"
                                            v-model="settings.showOwnerGuide">
                                    </div>
                                </div>

                                <div
                                    class="d-flex align-items-center justify-content-between bg-light p-3 rounded-3 border mb-4">
                                    <div>
                                        <h6 class="mb-1 fw-bold text-dark">Tự động ẩn phương tiện hết hạn đăng kiểm</h6>
                                        <small class="text-muted">Ẩn xe trên App khách ngay khi giấy tờ hết hiệu
                                            lực</small>
                                    </div>
                                    <div class="form-check form-switch fs-4 mb-0">
                                        <input class="form-check-input cursor-pointer" type="checkbox" role="switch"
                                            v-model="settings.autoHideExpired">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="card border-0 shadow-sm rounded-4">
                            <div class="card-body p-4 p-lg-5">
                                <h5 class="fw-bold text-dark mb-4 border-bottom pb-3">
                                    <i class="fas fa-shield-alt text-warning me-2"></i>Tính năng hệ thống & Bảo mật
                                </h5>

                                <div class="row g-4">
                                    <div class="col-md-6 col-xl-4">
                                        <div
                                            class="d-flex align-items-center justify-content-between bg-light p-3 rounded-3 border">
                                            <div>
                                                <h6 class="mb-1 fw-bold text-dark">Duyệt KYC Tự động (AI)</h6>
                                                <small class="text-muted">Sử dụng dịch vụ eKYC của bên thứ 3</small>
                                            </div>
                                            <div class="form-check form-switch fs-4 mb-0">
                                                <input class="form-check-input cursor-pointer" type="checkbox"
                                                    role="switch" v-model="settings.autoKyc">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-xl-4">
                                        <div
                                            class="d-flex align-items-center justify-content-between bg-light p-3 rounded-3 border">
                                            <div>
                                                <h6 class="mb-1 fw-bold text-dark">Bảo trì hệ thống (Maintenance)</h6>
                                                <small class="text-muted">Chặn tạm thời mọi truy cập từ người
                                                    dùng</small>
                                            </div>
                                            <div class="form-check form-switch fs-4 mb-0">
                                                <input class="form-check-input cursor-pointer" type="checkbox"
                                                    role="switch" v-model="settings.maintenanceMode">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-12 col-xl-4 d-flex align-items-center">
                                        <p class="text-muted small mb-0">
                                            <i class="fas fa-info-circle me-1"></i> Các cài đặt layout động và tính năng
                                            hệ thống sẽ lập tức đồng bộ và thay đổi hiển thị ở phía Client sau khi bạn
                                            thực hiện Lưu cấu hình.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </form>

        </div>
    </main>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH TRỌN ĐẦU NỐI (IMPORTS)
// ============================================================================
import { ref, onMounted } from 'vue'
import axios from 'axios'

// ============================================================================
// 2. KHỞI TẠO BIẾN CẤU HÌNH HỆ THỐNG TOÀN DIỆN (SYSTEM SETTINGS STATE)
// ============================================================================
// Dữ liệu mở rộng đồng bộ với bảng system_settings trên Database
const settings = ref({
    commissionRate: 15.0,        // Tỷ lệ chiết khấu hoa hồng sàn (%)
    serviceFeeRate: 5.0,         // Phí dịch vụ hệ thống (%)
    minWithdrawal: 200000,       // Hạn mức rút tiền ví tối thiểu (VNĐ)
    ownerApprovalTimeout: 12,    // Thời hạn tối đa Chủ xe phải duyệt đơn (Giờ)
    paymentTimeout: 30,          // Thời hạn Khách hàng hoàn tất thanh toán cọc (Phút)
    depositRate: 30,             // Tỷ lệ tiền cọc tối thiểu giữ chỗ (%)
    autoKyc: true,               // Cờ tự động duyệt Định danh bằng Trí tuệ Nhân tạo OCR
    maintenanceMode: false,      // Chế độ bảo trì Toàn bộ Hệ thống (Khóa truy cập)

    // TRẠNG THÁI LAYOUT ĐỘNG TRANG KHÁCH HÀNG
    showHeroBanner: true,        // Hiển thị dải Hero Banner Trang Chủ
    showHotDeals: true,          // Hiển thị chuyên mục Ưu đãi tuần
    showNewVehicles: true,       // Hiển thị danh sách Xe mới gia nhập
    customerVehicleView: 'grid', // Chế độ mặc định xem danh sách xe: Lưới (grid) hay Danh sách (list)

    // TRẠNG THÁI GIAO DIỆN CHỦ XE
    showRevenueWidget: true,     // Bật biểu đồ Thống kê Doanh thu trên Dashoard Đối Tác
    showOwnerGuide: true,        // Hiển thị Trình Cẩm nang Hướng dẫn Chủ xe
    autoHideExpired: true        // Tự động ẩn bài đăng cho thuê khi hết thời gian rỗi
})

const fetchSettings = async () => {
    try {
        const response = await axios.get('https://autocar-citx.onrender.com/api/v1/admin/system-settings', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        const data = response.data.data;
        
        // Map backend data to frontend state if exists
        for (const key in settings.value) {
            if (data[key]) {
                const val = data[key].value;
                if (val === 'true' || val === 'false') {
                    settings.value[key] = val === 'true';
                } else if (!isNaN(val) && key !== 'customerVehicleView') {
                    settings.value[key] = Number(val);
                } else {
                    settings.value[key] = val;
                }
            }
        }
    } catch (error) {
        console.error("Lỗi khi tải cấu hình:", error);
    }
}

onMounted(() => {
    fetchSettings();
});

// ============================================================================
// 3. NGHIỆP VỤ ĐỒNG BỘ VÀ SAO LƯU CẤU HÌNH TOÀN CỤC (CONFIG ACTIONS)
// ============================================================================
/**
 * Trình phát lệnh áp dụng cấu hình và layout động lên toàn bộ giao diện hệ thống Quản trị, Chủ xe & Khách hàng
 */
const handleSaveSettings = async () => {
    if (confirm('Bạn có chắc chắn muốn áp dụng cấu hình phân bổ layout động mới này cho toàn bộ giao diện hệ thống không?')) {
        try {
            await axios.post('https://autocar-citx.onrender.com/api/v1/admin/system-settings/batch', {
                settings: settings.value
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            alert('Cập nhật và đồng bộ cấu hình hệ thống thành công!');
        } catch (error) {
            console.error("Lỗi cập nhật cấu hình:", error);
            alert('Có lỗi xảy ra khi cập nhật cấu hình!');
        }
    }
}

/**
 * Phục hồi các thiết lập về thông số nguyên bản ban đầu
 */
const resetSettings = () => {
    if (confirm('Hủy bỏ các thay đổi hiện tại và tải lại cấu hình gốc trên hệ thống?')) {
        fetchSettings();
    }
}
</script>

<style scoped>
/* Không viết thêm style tùy chỉnh, đảm bảo sạch mã nguồn */
</style>
