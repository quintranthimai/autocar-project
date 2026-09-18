<template>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card shadow-sm border-0 rounded-3">
                    <div class="card-header bg-white border-bottom-0 pt-4 pb-2">
                        <h4 class="fw-bold text-primary mb-0">Xác thực Giấy phép lái xe (GPLX)</h4>
                        <p class="text-muted small mt-1">Vui lòng cung cấp hình ảnh Giấy phép lái xe để hệ thống AI tự
                            động trích xuất dữ liệu.</p>
                    </div>

                    <div class="card-body px-4 pb-4">
                        <div class="alert alert-info d-flex align-items-center mb-4 border-0 bg-light text-dark">
                            <span class="fs-4 me-3 text-info">ℹ️</span>
                            <div>
                                <strong>Lưu ý quan trọng:</strong>
                                <ul class="mb-0 small ps-3">
                                    <li>Chụp ảnh rõ nét, không bị lóa sáng hay mất góc.</li>
                                    <li>Sử dụng GPLX thẻ cứng (PET) hoặc chụp từ ứng dụng VNeID.</li>
                                </ul>
                            </div>
                        </div>

                        <form @submit.prevent="handleUpload">
                            <div class="row g-4 mb-4">
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">Mặt trước GPLX <span
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
                                    <label class="form-label fw-semibold">Mặt sau GPLX <span
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

                            <div class="d-grid" v-if="!requiresManualClass">
                                <button type="submit" class="btn btn-primary py-2 fw-bold fs-5"
                                    :disabled="loading || !frontFile || !backFile">
                                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                                        aria-hidden="true"></span>
                                    {{ loading ? 'AI đang phân tích dữ liệu (Vui lòng chờ)...' : 'Gửi hồ sơ định danh'
                                    }}
                                </button>
                            </div>
                        </form>

                        <!-- Phần chọn thủ công nếu AI đọc sót Hạng Bằng -->
                        <div v-if="requiresManualClass" class="mt-4 p-4 bg-warning bg-opacity-10 border border-warning rounded-3">
                            <h5 class="fw-bold text-warning-emphasis mb-3">⚠️ Cần bổ sung Hạng Bằng Lái Xe</h5>
                            <p class="mb-3 text-dark">Hệ thống AI nhận diện thành công hồ sơ của bạn nhưng không thể đọc rõ <strong>Hạng bằng lái</strong> trên ảnh. Vui lòng chọn hạng bằng của bạn ở bên dưới để hoàn tất:</p>
                            
                            <div class="d-flex gap-3 align-items-center">
                                <select v-model="selectedClass" class="form-select border-warning shadow-sm" style="max-width: 200px;">
                                    <option value="" disabled>-- Chọn Hạng GPLX --</option>
                                    <option value="B1">B1</option>
                                    <option value="B2">B2</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                    <option value="E">E</option>
                                    <option value="F">F</option>
                                </select>
                                <button @click="submitManualClass" class="btn btn-success fw-bold px-4" :disabled="!selectedClass || loading">
                                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                                    Xác nhận & Gửi Duyệt
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & DỊCH VỤ XÁC NHẬN GPLX (IMPORTS)
// ============================================================================
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import kycService from '@/services/kyc.service';

const router = useRouter();

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI TỆP ẢNH & THẺ THÔNG SỐ (STATE MANAGEMENT)
// ============================================================================
const frontFile = ref(null);           // Hồ sơ tệp ảnh Mặt trước Bằng lái
const backFile = ref(null);            // Hồ sơ tệp ảnh Mặt sau Bằng lái
const frontPreview = ref(null);        // Bản xem trước (URL Object) cho Mặt trước
const backPreview = ref(null);         // Bản xem trước (URL Object) cho Mặt sau
const loading = ref(false);            // Cờ quản lý tiến trình đồng bộ dữ liệu
const requiresManualClass = ref(false);// Trường hợp OCR không rõ Hạng Bằng -> Cần bổ sung tay
const selectedClass = ref('');         // Lựa chọn Hạng bằng lái (B1, B2, C, D, E...)

// ============================================================================
// 3. HÀM QUẢN LÝ TẬP PHỔ ẢNH TỪ BẢNG NHẬP LIỆU (IMAGE SELECTION LOGIC)
// ============================================================================
/**
 * Ghi nhận đối tượng Tệp tải lên và dựng liên kết ảnh thực tại (Object URL)
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
// 4. TRÌNH TẢI LÊN VÀ THẨM ĐỊNH AI OCR HỢP PHÁP HÓA GPLX (UPLOAD & OCR API)
// ============================================================================
/**
 * Đệ trình hình ảnh Giấy Phép Lái Xe sang máy chủ phục vụ phân tích tự động
 */
const handleUpload = async () => {
    loading.value = true;
    const formData = new FormData();

    // Định tính Khóa truyền tải khớp với hệ thống xác thực Laravel Backend (Validator)
    formData.append('gplx_front', frontFile.value);
    formData.append('gplx_back', backFile.value);

    try {
        // Giao thức đặc nhiệm riêng cho Giấy phép lái xe: uploadDriverLicense
        const res = await kycService.uploadDriverLicense(formData);

        // Trường hợp hệ thống yêu cầu khai báo bộ trợ Hạng bằng tay
        if (res.data.requires_manual_class) {
            requiresManualClass.value = true;
        } else {
            alert(res.data.message || 'Tải lên thành công! GPLX của bạn đang chờ duyệt.');
            router.push({ name: 'profile' }); // Chuyển về Profile
        }

    } catch (err) {
        console.error("Lỗi chi tiết từ Backend:", err.response?.data || err.message);
        const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi phân tích ảnh.';
        alert('Lỗi: ' + errorMsg);
    } finally {
        loading.value = false;
    }
};

// ============================================================================
// 5. TRÌNH CẬP NHẬT HẠNG BẰNG LÁI TRONG TRƯỜNG HỢP NHẬP TAY (MANUAL CLASS ENTRY)
// ============================================================================
/**
 * Xử lý cập nhật bổ sung Hạng Bằng Lái nếu OCR cần sự trợ giúp xác minh từ thành viên
 */
const submitManualClass = async () => {
    loading.value = true;
    try {
        const res = await kycService.updateDriverLicenseClass(selectedClass.value);
        alert(res.data.message || 'Đã cập nhật hạng bằng lái xe. Hồ sơ đang chờ duyệt.');
        router.push({ name: 'profile' });
    } catch (err) {
        console.error("Lỗi chi tiết từ Backend:", err.response?.data || err.message);
        const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.';
        alert('Lỗi: ' + errorMsg);
    } finally {
        loading.value = false;
    }
};
</script>