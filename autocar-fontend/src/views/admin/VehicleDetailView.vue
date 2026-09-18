<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
            </div>

            <div v-else-if="vehicle">
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                            <div>
                                <h1 class="fs-3 mb-1 fw-bold text-dark">Hồ sơ phương tiện</h1>
                                <span class="badge" :class="statusBadgeClass">Trạng thái: {{ formatStatus(vehicle.status) }}</span>
                            </div>
                            <div>
                                <router-link to="/admin/vehicles"
                                    class="btn btn-white border bg-white fw-semibold text-dark shadow-sm">
                                    <i class="fas fa-arrow-left me-2"></i>Quay lại danh sách
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row g-4">
                    <div class="col-xl-7">
                        <div class="card border-0 shadow-sm rounded-4 h-100">
                            <div class="card-body p-4 p-lg-5">
                                <h5 class="mb-4 border-bottom pb-3 fw-bold text-dark">
                                    <i class="fas fa-info-circle text-primary me-2"></i>Thông tin cơ bản
                                </h5>

                                <form>
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label text-muted small fw-semibold">Tên chủ xe</label>
                                            <input type="text" class="form-control bg-light border-0 fw-medium"
                                                :value="vehicle.owner?.name" readonly>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label text-muted small fw-semibold">Số điện thoại</label>
                                            <input type="text" class="form-control bg-light border-0 fw-medium"
                                                :value="vehicle.owner?.phone" readonly>
                                        </div>
                                    </div>

                                    <div class="row mt-2">
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label text-muted small fw-semibold">Tên xe</label>
                                            <input type="text"
                                                class="form-control bg-light border-0 fw-medium text-dark text-uppercase"
                                                :value="`${vehicle.car_model?.brand_name} ${vehicle.car_model?.model_name}`"
                                                readonly>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label text-muted small fw-semibold">Biển kiểm
                                                soát</label>
                                            <input type="text"
                                                class="form-control bg-light border-0 fw-bold text-uppercase text-primary"
                                                :value="vehicle.license_plate" readonly>
                                        </div>
                                    </div>

                                    <div class="row mt-2">
                                        <div class="col-md-4 mb-3">
                                            <label class="form-label text-muted small fw-semibold">Năm SX / Số
                                                khung</label>
                                            <input type="text" class="form-control bg-light border-0 fw-medium"
                                                :value="`${vehicle.year} / ${vehicle.vin_number}`" readonly>
                                        </div>
                                        <div class="col-md-4 mb-3">
                                            <label class="form-label text-muted small fw-semibold">Số chỗ ngồi</label>
                                            <input type="text" class="form-control bg-light border-0 fw-medium"
                                                :value="`${vehicle.car_model?.seat_count} chỗ`" readonly>
                                        </div>
                                        <div class="col-md-4 mb-3">
                                            <label class="form-label text-muted small fw-semibold">Truyền động</label>
                                            <input type="text" class="form-control bg-light border-0 fw-medium"
                                                :value="vehicle.car_model?.transmission?.display_name" readonly>
                                        </div>
                                    </div>

                                    <div class="row mt-2">
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label text-muted small fw-semibold">Giá thuê ngày</label>
                                            <input type="text"
                                                class="form-control bg-light border-0 fw-bold text-success"
                                                :value="formatCurrency(vehicle.base_price)" readonly>
                                        </div>
                                    </div>

                                    <div class="mb-2 mt-2">
                                        <label class="form-label text-muted small fw-semibold">Mô tả từ chủ xe</label>
                                        <textarea class="form-control bg-light border-0 fw-medium" rows="3"
                                            readonly>{{ vehicle.description }}</textarea>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-5">
                        <div class="card border-0 shadow-sm rounded-4 mb-4">
                            <div class="card-body p-4">
                                <h5 class="mb-3 border-bottom pb-3 fw-bold text-dark">
                                    <i class="fas fa-images text-primary me-2"></i>Hình ảnh phương tiện
                                </h5>
                                <div class="row g-3">
                                    <div class="col-6" v-for="(img, idx) in vehicle.images" :key="idx">
                                        <img :src="img.image_url"
                                            class="img-fluid rounded w-100 object-fit-contain bg-light shadow-sm"
                                            style="height: 120px;" alt="Hình xe">
                                    </div>
                                    <div v-if="!vehicle.images?.length" class="col-12 text-muted small text-center">Chủ
                                        xe chưa tải ảnh</div>
                                </div>
                            </div>
                        </div>

                        <!-- GIẤY TỜ XÁC MINH CÀ VẸT -->
                        <div class="card border-0 shadow-sm rounded-4 mb-4">
                            <div class="card-body p-4">
                                <h5 class="mb-3 border-bottom pb-3 fw-bold text-dark">
                                    <i class="fas fa-id-card text-primary me-2"></i>Giấy tờ xác minh (Cà vẹt)
                                </h5>

                                <div v-if="vehicle.legal_documents && vehicle.legal_documents.length > 0"
                                    class="text-center mt-3">
                                    <template v-for="doc in vehicle.legal_documents" :key="doc.id">
                                        <div v-if="doc.document_type === 'vehicle_registration'"
                                            class="position-relative">
                                            <!-- Bao bằng thẻ <a> để click vào mở ảnh to -->
                                            <a :href="doc.front_image_url" target="_blank" title="Bấm để phóng to">
                                                <img :src="doc.front_image_url"
                                                    class="img-fluid rounded-3 shadow-sm w-100 object-fit-contain bg-light border"
                                                    style="max-height: 250px; cursor: zoom-in;" alt="Cà vẹt xe">
                                            </a>
                                            <p class="small text-muted mt-2 fw-semibold"><i
                                                    class="fas fa-search-plus me-1"></i>Bấm vào ảnh để soi chi tiết</p>
                                        </div>
                                    </template>
                                </div>
                                <div v-else class="text-muted small text-center py-4 bg-light rounded-3">
                                    <i class="fas fa-file-excel fa-2x mb-2 text-secondary"></i><br>
                                    Chủ xe chưa tải lên giấy tờ xác minh.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mt-4 mb-5">
                    <div class="col-12">
                        <div class="card border-0 shadow-sm rounded-4">
                            <div
                                class="card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                                <div class="text-muted small">
                                    Ngày cập nhật gần nhất: <strong>{{ new Date(vehicle.updated_at).toLocaleString()
                                        }}</strong>
                                </div>

                                <!-- KHU VỰC 1: XE ĐANG CHỜ DUYỆT -->
                                <div v-if="vehicle.status === 'pending'"
                                    class="d-flex gap-3 w-100 w-md-auto justify-content-end">
                                    <button
                                        class="btn btn-outline-danger px-4 py-2 fw-bold rounded-3 flex-grow-1 flex-md-grow-0"
                                        @click="handleReject" :disabled="processing">
                                        <i class="fas fa-times me-2"></i>Từ chối duyệt
                                    </button>
                                    <button v-if="vehicle.status === 'pending'"
                                        class="btn btn-primary px-5 py-2 fw-bold rounded-3 flex-grow-1 flex-md-grow-0"
                                        @click="handleApprove" :disabled="processing">
                                        <i class="fas fa-check me-2"></i>Phê duyệt lên sàn
                                    </button>
                                </div>

                                <!-- KHU VỰC 2: XE ĐANG HOẠT ĐỘNG BÌNH THƯỜNG (CÓ QUYỀN KHÓA) -->
                                <div v-else-if="vehicle.status === 'available' || vehicle.status === 'rented'"
                                    class="d-flex gap-3 w-100 w-md-auto justify-content-end">
                                    <button
                                        class="btn btn-danger px-4 py-2 fw-bold rounded-3 flex-grow-1 flex-md-grow-0"
                                        @click="handleLock" :disabled="processing">
                                        <i class="fas fa-lock me-2"></i>Khóa xe (Cấm thuê)
                                    </button>
                                </div>

                                <!-- KHU VỰC 3: XE ĐANG BỊ KHÓA (CÓ QUYỀN MỞ KHÓA) -->
                                <div v-else-if="vehicle.status === 'locked'"
                                    class="d-flex gap-3 w-100 w-md-auto justify-content-end">
                                    <button
                                        class="btn btn-success px-5 py-2 fw-bold rounded-3 flex-grow-1 flex-md-grow-0"
                                        @click="handleUnlock" :disabled="processing">
                                        <i class="fas fa-unlock me-2"></i>Mở khóa xe
                                    </button>
                                </div>

                                <!-- KHU VỰC 4: XE ĐÃ BỊ TỪ CHỐI DUYỆT (ẨN NÚT BẤM, CHỈ HIỆN TEXT) -->
                                <div v-else-if="vehicle.status === 'rejected'"
                                    class="d-flex gap-3 w-100 w-md-auto justify-content-end align-items-center">
                                    <span
                                        class="text-danger fw-bold px-3 py-2 bg-danger bg-opacity-10 rounded-3 border border-danger border-opacity-25">
                                        <i class="fas fa-ban me-2"></i>Hồ sơ xe này đã bị từ chối
                                    </span>
                                </div>
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
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & BỘ ĐIỀU HƯỚNG ROUTING (IMPORTS)
// ============================================================================
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import adminVehicleService from '@/services/admin-vehicle.service';

const route = useRoute();
const router = useRouter();

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI HỒ SƠ Ô TÔ CHI TIẾT (STATE MANAGEMENT)
// ============================================================================
const vehicle = ref(null);         // Thực thể lưu thông tin kỹ thuật & chủ sở hữu ô tô
const loading = ref(true);         // Cờ hiển thị giao diện Skeleton chờ
const processing = ref(false);     // Cờ khóa nút bấm trong khi hệ thống gửi API

// ============================================================================
// 3. TRÌNH BẢO HIỂM HIỂN THỊ TIỀN TỆ & NHÃN KIẾM DUYỆT (FORMATTERS & BADGES)
// ============================================================================
// Định dạng hiển thị Đơn giá thuê theo chuỗi "xxx.xxx đ / Ngày"
const formatCurrency = (val) => val ? Number(val).toLocaleString('vi-VN') + 'đ / Ngày' : '0đ';

/**
 * Phối màu sắc thẻ Tag nhãn Bootstrap theo trang thái hoạt động thực tiễn của xe
 */
const statusBadgeClass = computed(() => {
    if (!vehicle.value) return '';
    switch (vehicle.value.status) {
        case 'pending': return 'bg-warning text-dark'; // Chờ duyệt
        case 'available': return 'bg-success';          // Đang hoạt động
        case 'rented': return 'bg-info';                // Đang cho thuê
        case 'locked': return 'bg-danger';              // Bị khóa cấm
        case 'rejected': return 'bg-dark';              // Bị từ chối
        case 'maintenance': return 'bg-secondary';      // Đang bảo dưỡng/khắc phục sự cố
        default: return 'bg-secondary';
    }
});

/**
 * Dịch nghĩa mã trạng thái sang ngôn từ hành chính trang trọng
 */
const formatStatus = (status) => {
    switch (status) {
        case 'pending': return 'Chờ duyệt';
        case 'available': return 'Đang hoạt động';
        case 'rented': return 'Đang cho thuê';
        case 'locked': return 'Đã khóa';
        case 'rejected': return 'Bị từ chối';
        case 'maintenance': return 'Đang bảo dưỡng';
        default: return 'Không xác định';
    }
};

// ============================================================================
// 4. ĐẦU NỐI NẠP THÔNG TIN KỸ THUẬT XE TỪ MÁY CHỦ (DATA HYDRATION API)
// ============================================================================
/**
 * Tải chi tiết hồ sơ đăng ký xe (Cà vẹt, hình ảnh ngoại thất, bảng phụ phí) từ Backend
 */
const loadData = async () => {
    loading.value = true;
    try {
        const res = await adminVehicleService.getVehicleDetail(route.params.id);
        if (res.data.success) {
            vehicle.value = res.data.data;
        }
    } catch (error) {
        console.error(error);
        alert('Không tìm thấy xe.');
        router.push('/admin/vehicles');
    } finally {
        loading.value = false;
    }
};

// ============================================================================
// 5. HỆ THỐNG NGHIỆP VỤ KIỂM DUYỆT, TỪ CHỐI & KHÓA XE CỦA BAN QUẢN TRỊ (MODERATION ACTIONS)
// ============================================================================
/**
 * Nghiệp vụ Phê duyệt (Approve) chuyển trạng thái xe sang 'available' để kinh doanh trên Sàn
 */
const handleApprove = async () => {
    if (!confirm('Xác nhận phê duyệt xe này và đưa lên sàn?')) return;
    processing.value = true;
    try {
        await adminVehicleService.approveVehicle(vehicle.value.id);
        alert('Đã phê duyệt thành công!');
        await loadData();
    } catch (e) {
        alert('Lỗi phê duyệt!');
    } finally {
        processing.value = false;
    }
};

/**
 * Từ chối hồ sơ đăng ký xe (Kèm bắt buộc điền Lý do vi phạm gửi qua Thông báo cho Chủ xe)
 */
const handleReject = async () => {
    const reason = prompt('Nhập lý do từ chối để gửi cho chủ xe:');
    if (!reason || reason.trim() === '') return;

    processing.value = true;
    try {
        await adminVehicleService.rejectVehicle(vehicle.value.id, reason);
        alert('Đã từ chối xe thành công.');
        await loadData();
    } catch (e) {
        alert('Lỗi từ chối!');
    } finally {
        processing.value = false;
    }
};

/**
 * Quyết định Khóa cấm kinh doanh phương tiện (Do khiếu nại chất lượng hoặc vi phạm hợp đồng)
 */
const handleLock = async () => {
    const reason = prompt('Nhập lý do khóa xe (Cấm cho thuê tiếp):');
    if (!reason || reason.trim() === '') return;

    processing.value = true;
    try {
        await adminVehicleService.lockVehicle(vehicle.value.id, reason);
        alert('Đã khóa xe thành công.');
        await loadData();
    } catch (e) {
        alert('Lỗi khóa xe!');
    } finally {
        processing.value = false;
    }
};

/**
 * Mở khóa ân xá cho phép xe được quay lại sàn giao dịch
 */
const handleUnlock = async () => {
    if (!confirm('Bạn muốn mở khóa cho chiếc xe này hoạt động lại?')) return;
    processing.value = true;
    try {
        await adminVehicleService.unlockVehicle(vehicle.value.id);
        alert('Đã mở khóa thành công!');
        await loadData();
    } catch (e) {
        alert('Lỗi mở khóa!');
    } finally {
        processing.value = false;
    }
};

// ============================================================================
// 6. MÓC DẪN VÒNG ĐỜI COMPONENT (LIFECYCLE HOOKS)
// ============================================================================
onMounted(() => {
    loadData();
});
</script>
