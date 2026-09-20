<template>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card shadow-sm border-0 rounded-3">
                    <div class="card-header bg-white border-bottom-0 pt-4 pb-2">
                        <h4 class="fw-bold text-primary mb-0">Xác minh danh tính (eKYC)</h4>
                        <p class="text-muted small mt-1">Vui lòng cung cấp hình ảnh Căn cước công dân (CCCD) để hệ thống
                            AI tự động trích xuất dữ liệu.</p>
                    </div>

                    <div class="card-body px-4 pb-4">
                        <div class="alert alert-info d-flex align-items-center mb-4 border-0 bg-light text-dark">
                            <span class="fs-4 me-3 text-info">ℹ️</span>
                            <div>
                                <strong>Lưu ý quan trọng:</strong>
                                <ul class="mb-0 small ps-3">
                                    <li>Chụp ảnh rõ nét, không bị lóa sáng hay mất góc.</li>
                                    <li>Sử dụng CCCD gốc (không chụp lại từ màn hình khác).</li>
                                </ul>
                            </div>
                        </div>

                        <form @submit.prevent="handleUpload">
                            <div class="row g-4 mb-4">
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">Mặt trước CCCD <span
                                            class="text-danger">*</span></label>
                                    <div class="border border-2 rounded-3 p-3 text-center bg-light">
                                        <img v-if="frontPreview" :src="frontPreview"
                                            class="img-fluid rounded mb-3 shadow-sm"
                                            style="max-height: 180px; object-fit: contain;" />
                                        <div v-else class="text-muted py-5">
                                            <div class="fs-1 mb-2">📸</div>
                                            <p class="mb-0 small">Chưa chọn ảnh</p>
                                        </div>
                                        <input type="file" class="form-control form-control-sm"
                                            accept="image/jpeg, image/png" @change="onFileChange($event, 'front')"
                                            required>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">Mặt sau CCCD <span
                                            class="text-danger">*</span></label>
                                    <div class="border border-2 rounded-3 p-3 text-center bg-light">
                                        <img v-if="backPreview" :src="backPreview"
                                            class="img-fluid rounded mb-3 shadow-sm"
                                            style="max-height: 180px; object-fit: contain;" />
                                        <div v-else class="text-muted py-5">
                                            <div class="fs-1 mb-2">📸</div>
                                            <p class="mb-0 small">Chưa chọn ảnh</p>
                                        </div>
                                        <input type="file" class="form-control form-control-sm"
                                            accept="image/jpeg, image/png" @change="onFileChange($event, 'back')"
                                            required>
                                    </div>
                                </div>
                            </div>

                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary py-2 fw-bold fs-5"
                                    :disabled="loading || !frontFile || !backFile">
                                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                                        aria-hidden="true"></span>
                                    {{ loading ? 'AI đang phân tích dữ liệu (Vui lòng chờ)...' : 'Gửi hồ sơ định danh'
                                    }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH ĐỊNH TRÚNG TỰ KÝ (IMPORTS)
// ============================================================================
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import kycService from '@/services/kyc.service';

const router = useRouter();

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI & HỒ SƠ ẢNH HẠO CCCD (KYC STATE MANAGEMENT)
// ============================================================================
const frontFile = ref(null);    // Tệp ảnh Mặt trước CCCD (File Blob)
const backFile = ref(null);     // Tệp ảnh Mặt sau CCCD (File Blob)
const frontPreview = ref(null); // Đường dẫn tạo tạm thời Preview cho Mặt trước
const backPreview = ref(null);  // Đường dẫn tạo tạm thời Preview cho Mặt sau
const loading = ref(false);     // Cờ khóa nút bấm trong quá trình gửi lên Server (OCR)

// ============================================================================
// 3. TRÌNH XỬ LÝ CHỌN VÀ THAY TRẢ CHẾ ĐỘ XEM TẠM ẢNH (FILE SELECTION HANDLER)
// ============================================================================
/**
 * Lấy tệp từ thẻ Input File và hiển thị ảnh phát thảo ngay trên Giao diện (URL.createObjectURL)
 */
const onFileChange = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'front') {
        frontFile.value = file;
        frontPreview.value = URL.createObjectURL(file);
    } else {
        backFile.value = file;
        backPreview.value = URL.createObjectURL(file);
    }
};

// ============================================================================
// 4. NGHIỆP VỤ ĐỆ TRÌNH HỒ SƠ LÊN BACKEND MỞ OCR PHÂN TÍCH (UPLOAD API)
// ============================================================================
/**
 * Đệ trình cặp hình ảnh lên API qua KYC Service, hệ thống máy chủ sẽ phân tích OCR
 */
const handleUpload = async () => {
    loading.value = true;
    const formData = new FormData();
    formData.append('front_image', frontFile.value);
    formData.append('back_image', backFile.value);

    try {
        const res = await kycService.uploadIdCard(formData);

        alert(res.data.message || 'Tải lên thành công! Hồ sơ đang chờ duyệt.');
        router.push({ name: 'profile' }); // Quay lại bảng thông tin tài khoản cá nhân
    } catch (err) {
        // Ghi log chi tiết hỗ trợ kỹ thuật và kiểm thử
        console.error("Lỗi chi tiết từ Backend:", err.response?.data || err.message);
        
        // Cung cấp phản hồi thông tin trực quan cho người sử dụng
        const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi phân tích ảnh.';
        alert('Lỗi: ' + errorMsg);
    } finally {
        loading.value = false;
    }
};
</script>
