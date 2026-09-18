<template>
    <div class="modal fade" :id="id" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div class="modal-header border-bottom-0 bg-light pb-2">
                    <h5 class="modal-title fw-bold text-dark">{{ title }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4 pt-3">
                    <div class="text-center mb-4">
                        <p class="text-muted small mb-2">{{ subtitle }}</p>
                        <div class="d-flex justify-content-center gap-2">
                            <i v-for="star in 5" :key="star"
                               class="fas fa-star fs-2 cursor-pointer transition"
                               :class="star <= (hoverRating || form.rating) ? 'text-warning' : 'text-secondary opacity-25'"
                               @mouseover="hoverRating = star"
                               @mouseleave="hoverRating = 0"
                               @click="form.rating = star">
                            </i>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label small fw-bold text-muted">Đánh giá chi tiết (Không bắt buộc)</label>
                        <textarea class="form-control bg-light border-0 rounded-3 p-3" rows="4" 
                            v-model="form.comment" 
                            placeholder="Chia sẻ trải nghiệm của bạn..."></textarea>
                    </div>

                    <div v-if="errorMessage" class="alert alert-danger small p-2 mb-3">
                        {{ errorMessage }}
                    </div>

                    <button class="btn btn-primary w-100 fw-bold py-3 rounded-3" 
                        @click="submitReview" 
                        :disabled="submitting || form.rating === 0">
                        <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                        GỬI ĐÁNH GIÁ
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH KẾT NỐI (IMPORTS & SERVICES)
// ============================================================================
import { ref, reactive, onUnmounted } from 'vue';
import api from '@/services/api';

/**
 * Đảm bảo dọn trệt lớp nền mờ đen (backdrop) bị Bootstrap lưu cữu trong DOM sau khi Modal đóng/bị Vue phá hủy
 */
const cleanupBackdrop = () => {
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
};

onUnmounted(() => {
    cleanupBackdrop();
});

// ============================================================================
// 2. CẤU HÌNH TRƯỜNG DỮ LIỆU THÔNG HẬU & SỰ KIỆN KẾT XUẤT (PROPS & EMITS)
// ============================================================================
const props = defineProps({
    id: { type: String, required: true },
    bookingId: { type: Number, required: true },
    title: { type: String, default: 'Đánh giá chuyến đi' },
    subtitle: { type: String, default: 'Vui lòng chọn số sao để đánh giá' }
});

const emit = defineEmits(['reviewSubmitted']);

// ============================================================================
// 3. KHỞI TẠO BIẾN TRẠNG THÁI & BIỂU MẪU CHẤM ĐIỂM (REVIEW STATE & FORM)
// ============================================================================
const hoverRating = ref(0);          // Trạng thái sao khi di chuột qua để tạo hiệu ứng
const form = reactive({
    rating: 0,                       // Số sao đánh giá (Từ 1 đến 5)
    comment: ''                      // Nội dung bình luận chi tiết từ khách
});
const submitting = ref(false);       // Cờ hiệu ứng gửi đánh giá
const errorMessage = ref('');        // Thông báo lỗi nếu có

// ============================================================================
// 4. BỘ HÀM TRUYỀN TẢI DỮ LIỆU ĐÁNH GIÁ VỀ HỆ THỐNG (ACTIONS)
// ============================================================================
/**
 * Thực hiện gửi thông tin đánh giá chuyến xe lên máy chủ qua API và dọn dẹp hộp thoại Modal
 */
const submitReview = async () => {
    if (form.rating === 0) return;
    
    submitting.value = true;
    errorMessage.value = '';
    
    try {
        const response = await api.post(`/v1/web/bookings/${props.bookingId}/reviews`, form);
        
        if (response.data.success) {
            // Close modal safely using getOrCreateInstance
            const modalEl = document.getElementById(props.id);
            if (modalEl && window.bootstrap) {
                const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
                if (modal) modal.hide();
            }
            
            // Dọn sạch hoàn toàn màng đen backdrop ngay và sau hiệu ứng Bootstrap transition
            cleanupBackdrop();
            setTimeout(cleanupBackdrop, 200);
            
            // Emit success
            emit('reviewSubmitted', response.data.data);
            
            // Reset form
            form.rating = 0;
            form.comment = '';
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.';
    } finally {
        submitting.value = false;
    }
};
</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
.transition {
    transition: all 0.2s ease;
}
.fa-star:hover {
    transform: scale(1.1);
}
</style>
