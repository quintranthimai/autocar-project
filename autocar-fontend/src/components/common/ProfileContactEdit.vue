<template>
    <div class="bg-light p-4 p-md-5 rounded-4">
        <div class="mt-2 mt-md-0 pt-md-2">
            <div class="row mb-3 align-items-center pb-3 border-bottom border-secondary border-opacity-25">
                <div class="col-5 col-sm-4">
                    <span class="text-muted small">Ngày sinh <i class="fas fa-shield-alt text-primary ms-1 opacity-75"></i></span>
                </div>
                <div class="col-7 col-sm-8 text-end">
                    <span class="fw-bold text-dark">{{ dob || '--/--/----' }}</span>
                </div>
            </div>

            <div class="row mb-3 align-items-center pb-3 border-bottom border-secondary border-opacity-25">
                <div class="col-5 col-sm-4">
                    <span class="text-muted small">Giới tính <i class="fas fa-shield-alt text-primary ms-1 opacity-75"></i></span>
                </div>
                <div class="col-7 col-sm-8 text-end">
                    <span class="fw-bold text-dark text-uppercase">{{ gender || 'Chưa cập nhật' }}</span>
                </div>
            </div>

            <div class="row mb-3 align-items-center pb-3 border-bottom border-secondary border-opacity-25">
                <div class="col-12 col-sm-5 d-flex align-items-center mb-2 mb-sm-0">
                    <span class="text-muted small me-2">Số điện thoại</span>
                    <span v-if="phone" class="badge bg-primary bg-opacity-10 text-primary rounded-pill fw-medium px-2 py-1" style="font-size: 0.7rem;">
                        <i class="fas fa-check-circle me-1"></i>Đã xác thực
                    </span>
                    <span v-else class="badge bg-warning bg-opacity-10 text-warning rounded-pill fw-medium px-2 py-1" style="font-size: 0.7rem;">
                        <i class="fas fa-exclamation-circle me-1"></i>Chưa cập nhật
                    </span>
                </div>
                <div class="col-12 col-sm-7 d-flex justify-content-between align-items-center bg-white p-2 rounded-3 border">
                    <span class="fw-bold ms-2">{{ phone || 'Chưa cập nhật' }}</span>
                    <button class="btn btn-sm btn-light border-0 text-primary rounded-circle bg-transparent" 
                        data-bs-toggle="modal" data-bs-target="#updatePhoneModal" title="Chỉnh sửa số điện thoại">
                        <i class="fas fa-pen"></i>
                    </button>
                </div>
            </div>

            <div class="row align-items-center pb-2">
                <div class="col-12 col-sm-5 d-flex align-items-center mb-2 mb-sm-0">
                    <span class="text-muted small me-2">Email</span>
                    <span v-if="email" class="badge bg-primary bg-opacity-10 text-primary rounded-pill fw-medium px-2 py-1" style="font-size: 0.7rem;">
                        <i class="fas fa-check-circle me-1"></i>Đã xác thực
                    </span>
                    <span v-else class="badge bg-warning bg-opacity-10 text-warning rounded-pill fw-medium px-2 py-1" style="font-size: 0.7rem;">
                        <i class="fas fa-exclamation-circle me-1"></i>Chưa cập nhật
                    </span>
                </div>
                <div class="col-12 col-sm-7 d-flex justify-content-between align-items-center bg-white p-2 rounded-3 border">
                    <span class="fw-bold ms-2 text-truncate" style="max-width: 200px;">{{ email || 'Chưa cập nhật' }}</span>
                    <button class="btn btn-sm btn-light border-0 text-primary rounded-circle bg-transparent" 
                        data-bs-toggle="modal" data-bs-target="#updateEmailModal" title="Chỉnh sửa email">
                        <i class="fas fa-pen"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="updatePhoneModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 450px;">
            <div class="modal-content border-0 rounded-4 shadow-lg p-3">
                <div class="modal-header border-0 pb-0 position-relative justify-content-center">
                    <h4 class="modal-title fw-bold text-dark">Cập nhật số điện thoại</h4>
                    <button type="button" class="btn-close border rounded-circle p-2 position-absolute end-0 top-0 mt-2 me-2" 
                        data-bs-dismiss="modal" aria-label="Close" style="font-size: 0.7rem;"></button>
                </div>
                <div class="modal-body pt-4 pb-2">
                    <input type="tel" class="form-control form-control-lg border-secondary-subtle rounded-3 mb-4 fw-medium text-dark" 
                        v-model="tempPhone" placeholder="+84366741245">
                    
                    <button type="button" @click="savePhone" class="btn btn-primary w-100 py-3 fw-bold rounded-3 fs-6 text-white border-0">
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="updateEmailModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 450px;">
            <div class="modal-content border-0 rounded-4 shadow-lg p-3">
                <div class="modal-header border-0 pb-0 position-relative justify-content-center">
                    <h4 class="modal-title fw-bold text-dark">Cập nhật email</h4>
                    <button type="button" class="btn-close border rounded-circle p-2 position-absolute end-0 top-0 mt-2 me-2" 
                        data-bs-dismiss="modal" aria-label="Close" style="font-size: 0.7rem;"></button>
                </div>
                <div class="modal-body pt-4 pb-2">
                    <input type="email" class="form-control form-control-lg border-secondary-subtle rounded-3 mb-4 fw-medium text-dark" 
                        v-model="tempEmail" placeholder="Email mới">
                    
                    <button type="button" @click="saveEmail" class="btn btn-primary w-100 py-3 fw-bold rounded-3 fs-6 text-white border-0">
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH KẾT NỐI (IMPORTS)
// ============================================================================
import { ref, watch } from 'vue';

// ============================================================================
// 2. CẤU HÌNH TRƯỜNG DỮ LIỆU ĐẦU VÀO & SỰ KIỆN KẾT XUẤT (PROPS & EMITS)
// ============================================================================
const props = defineProps({
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    dob: { type: String, default: '--/--/----' },
    gender: { type: String, default: 'Chưa cập nhật' }
});

const emit = defineEmits(['updatePhone', 'updateEmail']);

// ============================================================================
// 3. KHỞI TẠO BIẾN TRẠNG THÁI BIỂU MẪU CHỈNH SỬA TẠM (FORM STATE)
// ============================================================================
const tempPhone = ref(props.phone);
const tempEmail = ref('');

// Lắng nghe đồng bộ khi thuộc tính số điện thoại bên ngoài thay đổi
watch(() => props.phone, (newVal) => tempPhone.value = newVal);

// ============================================================================
// 4. BỘ HÀM XỬ LÝ GIAO DIỆN HỘP THOẠI & ĐỒNG BỘ DỮ LIỆU (ACTIONS)
// ============================================================================
/**
 * Đóng cửa sổ modal Bootstrap an toàn và dọn dẹp các lớp phủ màn hình (modal-backdrop)
 */
const closeModal = (modalId) => {
    const el = document.getElementById(modalId);
    if (window.bootstrap && el) {
        const modalInstance = window.bootstrap.Modal.getInstance(el);
        if (modalInstance) modalInstance.hide();
    }
    setTimeout(() => {
        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }, 200);
};

/**
 * Xác thực và lưu thay đổi số điện thoại liên lạc mới vào hồ sơ
 */
const savePhone = () => {
    if (!tempPhone.value.trim()) {
        alert("Vui lòng nhập số điện thoại hợp lệ!");
        return;
    }
    emit('updatePhone', tempPhone.value);
    closeModal('updatePhoneModal');
};

/**
 * Xác thực định dạng email và phát sự kiện lưu thay đổi địa chỉ email mới
 */
const saveEmail = () => {
    if (!tempEmail.value.includes('@')) {
        alert("Vui lòng nhập định dạng email hợp lệ!");
        return;
    }
    emit('updateEmail', tempEmail.value);
    closeModal('updateEmailModal');
    tempEmail.value = ''; 
};
</script>
