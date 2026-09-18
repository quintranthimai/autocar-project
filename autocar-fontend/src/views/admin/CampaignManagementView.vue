<template>
    <main id="content" class="content bg-light vh-100 d-flex flex-column overflow-hidden">

        <div style="height: 70px; flex-shrink: 0;"></div>

        <div class="container-fluid pt-4 px-lg-4 grow overflow-auto pb-5">

            <div class="row mb-4 shrink-0">
                <div class="col-12">
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h1 class="fs-3 mb-2 fw-bold text-dark">Quản lý Chiến dịch & Khuyến mãi</h1>
                            <p class="mb-0 text-muted fs-6">Tạo mã giảm giá (Coupon) và thiết lập Banner quảng cáo ngoài
                                trang chủ</p>
                        </div>
                        <div class="d-flex gap-2">
                            <router-link to="/admin/promotion-management"
                                class="btn btn-white border bg-white fw-bold text-dark shadow-sm px-4 py-3 rounded-3 fs-6 d-flex align-items-center">
                                <i class="fas fa-list me-2 text-primary"></i>Danh sách mã giảm giá
                            </router-link>
                            <router-link to="/admin/banner-management"
                                class="btn btn-white border bg-white fw-bold text-dark shadow-sm px-4 py-3 rounded-3 fs-6 d-flex align-items-center">
                                <i class="fas fa-images me-2 text-warning"></i>Quản lý Banner
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4 grow align-items-stretch">

                <div class="col-12 col-xl-6 d-flex flex-column">
                    <div class="card border-0 shadow-sm rounded-4 grow">
                        <div class="card-body p-4 p-xl-5 d-flex flex-column">

                            <h4 class="mb-4 border-bottom pb-3 fw-bold text-dark">
                                <i class="fas fa-ticket-alt text-warning me-2"></i>Phát hành Mã giảm giá
                            </h4>

                            <form id="addDiscountForm" @submit.prevent="handleCreateDiscount"
                                class="grow d-flex flex-column">

                                <div class="mb-4">
                                    <label class="form-label fw-semibold text-dark mb-2">Tên chiến dịch <span
                                            class="text-danger">*</span></label>
                                    <input type="text" class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                        v-model="discount.name" placeholder="VD: Khuyến mãi Hè Sôi Động 2026" required :disabled="submitting">
                                </div>

                                <div class="row g-4 mb-4">
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">Mã Coupon (Code) <span
                                                class="text-danger">*</span></label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3 text-uppercase fw-bold text-primary"
                                            v-model="discount.code" placeholder="VD: SUMMER26" required :disabled="submitting">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">Loại giảm giá <span
                                                class="text-danger">*</span></label>
                                        <select class="form-select form-select-lg bg-light border-0 fs-6 py-3" v-model="discount.type" :disabled="submitting">
                                            <option value="percentage">Giảm theo phần trăm (%)</option>
                                            <option value="fixed_amount">Giảm tiền mặt cố định (VNĐ)</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="row g-4 mb-4">
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">
                                            {{ discount.type === 'percentage' ? 'Phần trăm giảm (%) *' : 'Số tiền giảm (VNĐ) *' }}
                                        </label>
                                        <input type="number"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="discount.value" 
                                            :placeholder="discount.type === 'percentage' ? 'VD: 15 (tối đa 100%)' : 'VD: 150000'" 
                                            :min="1" 
                                            :max="discount.type === 'percentage' ? 100 : 100000000"
                                            required :disabled="submitting">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">Số lượng mã (Lượt dùng)</label>
                                        <input type="number"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="discount.usageLimit" placeholder="Để trống nếu vô hạn" min="1" :disabled="submitting">
                                    </div>
                                </div>

                                <div class="row g-4 mb-5">
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">Ngày bắt đầu <span class="text-danger">*</span></label>
                                        <input type="date"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="discount.startDate" required :disabled="submitting">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">Ngày kết thúc <span class="text-danger">*</span></label>
                                        <input type="date"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="discount.endDate" required :disabled="submitting">
                                    </div>
                                </div>

                                <div class="d-flex justify-content-end pt-4 border-top mt-auto">
                                    <button type="submit"
                                        class="btn btn-warning px-5 py-3 fw-bold rounded-3 fs-6 text-dark w-100 shadow-sm" :disabled="submitting">
                                        <span v-if="submitting"><i class="fas fa-spinner fa-spin me-2"></i>Đang xử lý...</span>
                                        <span v-else><i class="fas fa-magic me-2"></i>Phát Hành Mã Giảm Giá</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-xl-6 d-flex flex-column">
                    <div class="card border-0 shadow-sm rounded-4 grow">
                        <div class="card-body p-4 p-xl-5 d-flex flex-column">

                            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <h4 class="fw-bold text-dark mb-0">
                                    <i class="fas fa-image text-primary me-2"></i>Banner Quảng Cáo
                                </h4>
                                <div class="form-check form-switch fs-3 mb-0">
                                    <input class="form-check-input cursor-pointer" type="checkbox" role="switch"
                                        v-model="banner.isActive" title="Bật/Tắt hiển thị Banner này trên Home">
                                </div>
                            </div>

                            <form id="addBannerForm" @submit.prevent="handleUploadBanner"
                                class="grow d-flex flex-column">

                                <div class="mb-4">
                                    <label class="form-label fw-semibold text-dark mb-2">Tiêu đề Banner (Ghi chú nội bộ)
                                        <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                        v-model="banner.title" placeholder="VD: Banner Mùa Hè - Cột giữa" required>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label fw-semibold text-dark mb-2">Hình ảnh Banner <span
                                            class="text-danger">*</span></label>
                                    <label for="bannerImageUpload" class="border border-2 border-dashed rounded-4 bg-light d-flex flex-column align-items-center justify-content-center p-4 cursor-pointer hover-shadow w-100"
                                        style="min-height: 180px;">
                                        <i class="fas fa-cloud-upload-alt fs-1 text-primary mb-3 opacity-75"></i>
                                        <span class="fw-bold text-dark">Kéo thả ảnh vào đây hoặc Click để duyệt
                                            file</span>
                                        <span class="text-muted small mt-1">Hỗ trợ JPG, PNG. Kích thước khuyến nghị:
                                            1920x600px</span>
                                        <input type="file" class="d-none" id="bannerImageUpload" accept="image/*" @change="handleFileChange">
                                        <div v-if="bannerFile" class="mt-2 text-success fw-bold small">Đã chọn ảnh: {{ bannerFile.name }}</div>
                                    </label>
                                </div>



                                <div class="row g-4 mb-5">
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">Thứ tự hiển thị
                                            (Order)</label>
                                        <input type="number"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="banner.order" placeholder="VD: 1, 2, 3...">
                                    </div>
                                </div>

                                <div class="d-flex justify-content-end pt-4 border-top mt-auto">
                                    <button type="submit" class="btn btn-primary px-5 py-3 fw-bold rounded-3 fs-6 w-100"
                                        :disabled="!banner.isActive || submittingBanner">
                                        <span v-if="submittingBanner"><i class="fas fa-spinner fa-spin me-2"></i>Đang tải lên...</span>
                                        <span v-else><i class="fas fa-upload me-2"></i>Tải lên & Lưu Banner</span>
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>

            </div>

        </div>
    </main>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH TRON ĐẦU NỐI (IMPORTS)
// ============================================================================
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import promotionService from '@/services/promotion.service';

const router = useRouter();
const submitting = ref(false);
const submittingBanner = ref(false);
const bannerFile = ref(null);

// ============================================================================
// 2. KHỞI TẠO BIỂU MẪU MÃ GIẢM GIÁ & BẢNG KHUYẾN MÃI (STATE MANAGEMENT)
// ============================================================================
// Biểu mẫu định dạng Chiến dịch Mã giảm giá (Discount Codes)
const discount = ref({
    name: '',          // Tên chương trình ưu đãi
    code: '',          // Mã voucher (Ví dụ: SUMMER26...)
    type: 'percentage', // Loại giảm giá: percentage hoặc fixed_amount
    value: null,       // Giá trị giảm (%) hoặc số tiền VNĐ
    usageLimit: null,  // Giới hạn số lượt khách hàng sử dụng
    startDate: new Date().toISOString().slice(0, 10), // Ngày bắt đầu mặc định hôm nay
    endDate: ''        // Ngày kết thúc
});

// Biểu mẫu tải lên Banner Quảng bá chiến dịch Marketing
const banner = ref({
    title: '',         // Tiêu đề khẩu hiệu hiển thị
    order: 1,          // Thứ tự ưu tiên sắp xếp trên Carousel trang chủ
    isActive: true     // Cờ kích hoạt xuất hiện ngay sau khi tạo
});

// ============================================================================
// 3. NGHIỆP VỤ PHÁT HÀNH MÃ ƯU ĐÃI & BẢNG HIỂN THỊ MARKETING (ACTIONS)
// ============================================================================
/**
 * Xử lý kiểm tra và tạo mới Mã giảm giá trong chiến dịch Marketing (gọi API Backend)
 */
const handleCreateDiscount = async () => {
    if (!discount.value.name || !discount.value.code || !discount.value.value || !discount.value.startDate || !discount.value.endDate) {
        alert('Vui lòng điền đầy đủ các thông tin bắt buộc (*) !');
        return;
    }

    if (new Date(discount.value.endDate) < new Date(discount.value.startDate)) {
        alert('Ngày kết thúc không được trước ngày bắt đầu!');
        return;
    }

    if (confirm(`Xác nhận phát hành mã giảm giá [ ${discount.value.code.toUpperCase()} ]?`)) {
        submitting.value = true;
        try {
            const payload = {
                title: discount.value.name.trim(),
                code: discount.value.code.trim().toUpperCase(),
                type: discount.value.type,
                value: Number(discount.value.value),
                start_date: discount.value.startDate,
                end_date: discount.value.endDate,
                usage_limit: discount.value.usageLimit ? Number(discount.value.usageLimit) : null
            };

            const response = await promotionService.createVoucher(payload);
            
            if (response.data?.success || response.status === 201) {
                alert('🎉 Phát hành mã giảm giá thành công!');
                router.push('/admin/promotion-management');
            } else {
                alert(response.data?.message || 'Có lỗi xảy ra khi tạo mã giảm giá.');
            }
        } catch (error) {
            console.error('Lỗi tạo mã giảm giá:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.errors?.code?.[0] || 'Lỗi kết nối máy chủ hoặc mã Code đã tồn tại!';
            alert('❌ ' + errorMessage);
        } finally {
            submitting.value = false;
        }
    }
};

/**
 * Bắt sự kiện chọn file ảnh banner
 */
const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        bannerFile.value = file;
    }
};

/**
 * Xử lý đăng tải và trình lưu Banner Quảng bá Marketing hiển thị ra trang điểm nhấn Trang Chủ
 */
const handleUploadBanner = async () => {
    if (!banner.value.title || !bannerFile.value) {
        alert('Vui lòng nhập Tiêu đề và chọn Hình ảnh Banner!');
        return;
    }

    if (confirm('Xác nhận lưu Banner này để hiển thị ra trang chủ?')) {
        submittingBanner.value = true;
        try {
            const formData = new FormData();
            formData.append('title', banner.value.title);
            formData.append('image', bannerFile.value);
            formData.append('display_order', banner.value.order || 1);
            formData.append('is_active', banner.value.isActive ? 1 : 0);

            await axios.post('https://autocar-citx.onrender.com/api/v1/admin/banners', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            alert('Đã lưu Banner thành công!');
            router.push('/admin/banner-management');
        } catch (error) {
            console.error('Lỗi lưu banner:', error);
            alert('Có lỗi xảy ra khi tải lên banner!');
        } finally {
            submittingBanner.value = false;
        }
    }
};
</script>

<style scoped>
/* Chút style nhỏ cho viền upload ảnh nét đứt */
.border-dashed {
    border-style: dashed !important;
    border-color: #dee2e6 !important;
}

.hover-shadow:hover {
    box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15) !important;
    transition: all .3s ease-in-out;
}

/* Chuẩn bị layout flex */
.grow {
    flex-grow: 1 !important;
}
.shrink-0 {
    flex-shrink: 0 !important;
}
</style>
