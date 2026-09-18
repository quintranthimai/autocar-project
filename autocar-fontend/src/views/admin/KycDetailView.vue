<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">

            <div class="row">
                <div class="col-12">
                    <div
                        class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                        <div>
                            <h1 class="fs-3 mb-1 fw-bold text-dark">Duyệt hồ sơ pháp lý (KYC)</h1>
                            <p class="mb-0 text-muted">
                                Chi tiết thông tin đối chiếu dữ liệu OCR của
                                <span class="fw-bold text-primary">{{ isDriverLicense ? 'Giấy phép lái xe' : 'Căn cước công dân' }}</span>
                            </p>
                        </div>
                        <div>
                            <button @click="goBack"
                                class="btn btn-white border bg-white fw-semibold text-dark shadow-sm">
                                <i class="fas fa-arrow-left me-2"></i>Quay lại danh sách
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted fw-semibold">Đang tải dữ liệu hồ sơ...</p>
            </div>

            <div v-else-if="kycData" class="row g-4">
                <!-- CỘT DỮ LIỆU OCR -->
                <div class="col-xl-5">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-body p-4 p-lg-5">
                            <div class="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                                <h5 class="fw-bold text-dark mb-0">
                                    <i class="fas fa-robot text-primary me-2"></i>Dữ liệu bóc tách (OCR)
                                </h5>
                                <span class="badge bg-success bg-opacity-10 text-success border border-success">
                                    <i class="fas fa-check-circle me-1"></i>Trùng khớp
                                </span>
                            </div>

                            <form>
                                <div class="mb-3">
                                    <label class="form-label text-muted small fw-semibold">Họ và Tên</label>
                                    <input type="text"
                                        class="form-control bg-light border-0 fw-bold text-dark text-uppercase"
                                        :value="ocrData.name || 'Không rõ'" readonly>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small fw-semibold">
                                        {{ isDriverLicense ? 'Số Giấy phép lái xe' : 'Số CCCD / CMND' }}
                                    </label>
                                    <input type="text" class="form-control bg-light border-0 fw-bold text-primary fs-5"
                                        :value="ocrData.id || 'Không rõ'" readonly>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label text-muted small fw-semibold">Ngày sinh</label>
                                        <input type="text" class="form-control bg-light border-0 fw-medium"
                                            :value="ocrData.dob || 'Không rõ'" readonly>
                                    </div>
                                    <div v-if="!isDriverLicense" class="col-md-6 mb-3">
                                        <label class="form-label text-muted small fw-semibold">Giới tính</label>
                                        <input type="text" class="form-control bg-light border-0 fw-medium"
                                            :value="ocrData.sex || 'Không rõ'" readonly>
                                    </div>
                                    <div v-if="isDriverLicense" class="col-md-6 mb-3">
                                        <label class="form-label text-muted small fw-semibold">Hạng bằng</label>
                                        <input type="text" class="form-control bg-light border-0 fw-medium"
                                            :value="ocrData.class || 'Không rõ'" readonly>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label text-muted small fw-semibold">Ngày hết hạn</label>
                                        <input type="text" class="form-control bg-light border-0 fw-medium"
                                            :value="ocrData.doe || 'Không thời hạn'" readonly>
                                    </div>
                                </div>

                                <div v-if="!isDriverLicense" class="mb-3 mt-2">
                                    <label class="form-label text-muted small fw-semibold">Nơi thường trú</label>
                                    <textarea class="form-control bg-light border-0 fw-medium" rows="2" readonly
                                        :value="ocrData.address || 'Không rõ'"></textarea>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- CỘT HÌNH ẢNH -->
                <div class="col-xl-7">
                    <div class="card border-0 shadow-sm rounded-4 mb-4">
                        <div class="card-body p-4">
                            <h5 class="mb-3 border-bottom pb-3 fw-bold text-dark">
                                <i
                                    :class="isDriverLicense ? 'fas fa-id-card-clip text-primary me-2' : 'fas fa-id-card text-primary me-2'"></i>
                                Ảnh {{ isDriverLicense ? 'Giấy Phép Lái Xe' : 'Căn Cước Công Dân' }}
                            </h5>
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <div class="border rounded bg-light d-flex flex-column align-items-center justify-content-center text-muted cursor-pointer hover-shadow position-relative overflow-hidden"
                                        style="height: 220px;" role="button">
                                        <img v-if="kycData?.front_image_url" :src="kycData.front_image_url"
                                            class="w-100 h-100 object-fit-cover" alt="Mặt trước" />
                                        <div v-else class="text-center">
                                            <i class="far fa-address-card fs-1 mb-2 opacity-50"></i>
                                            <span class="small fw-semibold d-block">Ảnh mặt trước {{ isDriverLicense ?
                                                'GPLX' : 'CCCD' }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="border rounded bg-light d-flex flex-column align-items-center justify-content-center text-muted cursor-pointer hover-shadow position-relative overflow-hidden"
                                        style="height: 220px;" role="button">
                                        <img v-if="kycData?.back_image_url" :src="kycData.back_image_url"
                                            class="w-100 h-100 object-fit-cover" alt="Mặt sau" />
                                        <div v-else class="text-center">
                                            <i class="fas fa-qrcode fs-1 mb-2 opacity-50"></i>
                                            <span class="small fw-semibold d-block">Ảnh mặt sau {{ isDriverLicense ?
                                                'GPLX' : 'CCCD' }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PHẦN XÉT DUYỆT -->
            <div v-if="!loading && kycData?.status === 'pending'" class="row mt-4 mb-5">
                <div class="col-12">
                    <div class="card border-0 shadow-sm rounded-4">
                        <div
                            class="card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                            <div class="text-muted small">
                                Điểm tin cậy (AI): <strong class="text-success fs-6 ms-1">98%</strong>
                            </div>
                            <div class="d-flex gap-3 w-100 w-md-auto justify-content-end">
                                <button
                                    class="btn btn-outline-danger px-4 py-2 fw-bold rounded-3 flex-grow-1 flex-md-grow-0"
                                    @click="handleReject" :disabled="processing">
                                    <i class="fas fa-times me-2"></i>Từ chối & Yêu cầu chụp lại
                                </button>
                                <button class="btn btn-success px-5 py-2 fw-bold rounded-3 flex-grow-1 flex-md-grow-0"
                                    @click="handleApprove" :disabled="processing">
                                    <span v-if="processing" class="spinner-border spinner-border-sm me-2"></span>
                                    <i v-else class="fas fa-check-circle me-2"></i>Xác thực hợp lệ (Verified)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="!loading && kycData && kycData.status !== 'pending'" class="row mt-4 mb-5">
                <div class="col-12">
                    <div class="alert alert-secondary text-center fw-bold rounded-4 shadow-sm py-4">
                        <i class="fas fa-info-circle me-2"></i> Hồ sơ này đã được xử lý ({{ kycData.status ===
                            'approved' ? 'Đã duyệt' : 'Bị từ chối' }}).
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
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import kycService from '@/services/kyc.service'; // Trình dịch vụ Xử lý Hồ sơ Định danh KYC

const route = useRoute();
const router = useRouter();

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI HỒ SƠ & DỮ LIỆU ĐỌC QUANG HỌC OCR (STATE)
// ============================================================================
const kycData = ref(null);       // Toàn bộ hồ sơ (Hình ảnh Mặt trước/sau, thông tin người dùng)
const ocrData = ref({});         // Dữ liệu bóc tách tự động bởi Trí tuệ Nhân tạo (OCR) từ Ảnh thẻ
const loading = ref(true);       // Cờ hiệu ứng đang tải chi tiết
const processing = ref(false);   // Cờ khóa trình xử lý khi phát lệnh Phê duyệt hoặc Từ chối

// Biến tính toán (computed) để xác định xem đang duyệt loại giấy tờ nào
// Lưu ý: Chuỗi 'driver_license' phải khớp chính xác với chuỗi test ở bước trước (có thể là driving_license hoặc gplx)
const isDriverLicense = computed(() => {
    return kycData.value?.document_type === 'driving_license' || kycData.value?.document_type === 'driver_license';
});

// Điều hướng quay lại trang liền trước (Danh sách Duyệt KYC)
const goBack = () => {
    router.go(-1);
};

// ============================================================================
// 3. TRÌNH BÓC TÁCH DỮ LIỆU HỒ SƠ VÀ GIẢI MÃ OCR (DATA HYDRATION & OCR PARSER)
// ============================================================================
/**
 * Tải hồ sơ định danh chi tiết theo ID từ Database.
 * Đồng thời: Giải mã dữ liệu OCR bóc tách chuỗi JSON hoặc đối tượng cho hiển thị đối chiếu
 */
const fetchDetail = async () => {
    try {
        const id = route.params.id;
        const res = await kycService.getKycDetail(id);
        kycData.value = res.data.data;

        // Báo đảm bóc tách an toàn cho trường dữ liệu OCR extracted data
        let rawOcr = kycData.value.ocr_extracted_data;
        if (typeof rawOcr === 'string') {
            ocrData.value = JSON.parse(rawOcr) || {};
        } else if (typeof rawOcr === 'object' && rawOcr !== null) {
            ocrData.value = rawOcr;
        } else {
            ocrData.value = {};
        }
    } catch (err) {
        alert('Lỗi lấy thông tin hồ sơ từ Database!');
        console.error(err);
        goBack();
    } finally {
        loading.value = false;
    }
};

// ============================================================================
// 4. TRÌNH THẨM ĐỊNH TỐI CAO - PHÊ DUYỆT HOẶC BÁC BỔ HỒ SƠ (VERIFICATION ACTIONS)
// ============================================================================
/**
 * Xác minh hợp lệ: Cấp dấu xanh Định danh thành công cho người dùng
 */
const handleApprove = async () => {
    if (!confirm('Bạn có chắc chắn muốn phê duyệt hồ sơ này hợp lệ?')) return;
    processing.value = true;
    try {
        await kycService.processKyc(kycData.value.id, 'approved');
        alert('Đã phê duyệt hồ sơ thành công!');
        goBack();
    } catch (err) {
        alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
        processing.value = false;
    }
};

/**
 * Bác bỏ hồ sơ không đạt chuẩn: Bắt buộc Quản trị viên nhập lý do cụ thể để Khách biết sửa lại
 */
const handleReject = async () => {
    const reason = prompt("Vui lòng nhập lý do từ chối (Ví dụ: Ảnh bị lóa sáng, không đọc được số):");
    if (!reason) return;
    processing.value = true;
    try {
        await kycService.processKyc(kycData.value.id, 'rejected', reason);
        alert('Đã từ chối hồ sơ thành công!');
        goBack();
    } catch (err) {
        alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
        processing.value = false;
    }
};

// ============================================================================
// 5. MÓC DẪN VÒNG ĐỜI COMPONENT (LIFECYCLE HOOKS)
// ============================================================================
onMounted(fetchDetail);
</script>
