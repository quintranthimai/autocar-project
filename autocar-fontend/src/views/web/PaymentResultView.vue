<template>
    <div class="payment-result-page bg-light py-5 min-vh-100 d-flex align-items-center">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-6 text-center">
                    
                    <!-- ========================================================== -->
                    <!-- 1. TRẠNG THÁI 1: THANH TOÁN GIAO DỊCH THÀNH CÔNG (SUCCESS)   -->
                    <!-- ========================================================== -->
                    <div v-if="isSuccess" class="card border-0 shadow-sm rounded-4 p-5 mb-4 bg-white">
                        <div class="mb-4">
                            <div class="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 100px; height: 100px;">
                                <i class="fas fa-check fs-1"></i>
                            </div>
                        </div>
                        <h2 class="fw-bold text-dark mb-3">Đặt xe thành công!</h2>
                        <p class="text-muted mb-4">Cảm ơn bạn đã sử dụng dịch vụ. Mã chuyến đi của bạn là <strong class="text-primary">#{{ bookingId }}</strong>. Chủ xe sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
                        
                        <!-- Bảng đối soát tiền cọc đã trả qua VNPAY -->
                        <div class="bg-light rounded-3 p-3 mb-4 text-start">
                            <div class="d-flex justify-content-between mb-2 small">
                                <span class="text-muted">Tổng tiền:</span>
                                <span class="fw-bold text-dark">{{ formatPrice(amount) }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2 small">
                                <span class="text-muted">Đã thanh toán (Cọc):</span>
                                <span class="fw-bold text-success">{{ formatPrice(depositPaid) }}</span>
                            </div>
                            <div class="d-flex justify-content-between small">
                                <span class="text-muted">Còn lại thanh toán lúc nhận xe:</span>
                                <span class="fw-bold text-danger">{{ formatPrice(amount - depositPaid) }}</span>
                            </div>
                        </div>

                        <!-- Khối điều hướng hậu giao dịch -->
                        <div class="d-flex gap-3 justify-content-center">
                            <RouterLink to="/" class="btn btn-outline-primary px-4 py-2 fw-bold rounded-3">Về Trang chủ</RouterLink>
                            <RouterLink to="/my-trips" class="btn btn-primary px-4 py-2 fw-bold rounded-3">Xem chuyến đi</RouterLink>
                        </div>
                    </div>

                    <!-- ========================================================== -->
                    <!-- 2. TRẠNG THÁI 2: THANH TOÁN THẤT BẠI HOẶC HỦY BỎ (FAILED)   -->
                    <!-- ========================================================== -->
                    <div v-else class="card border-0 shadow-sm rounded-4 p-5 mb-4 bg-white">
                        <div class="mb-4">
                            <div class="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 100px; height: 100px;">
                                <i class="fas fa-times fs-1"></i>
                            </div>
                        </div>
                        <h2 class="fw-bold text-dark mb-3">Thanh toán thất bại</h2>
                        <p class="text-muted mb-4">Giao dịch của bạn đã bị hủy hoặc có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.</p>
                        <p class="text-danger small mb-4 fw-medium">{{ errorMessage }}</p>
                        
                        <div class="d-flex gap-3 justify-content-center">
                            <button @click="$router.go(-1)" class="btn btn-outline-primary px-4 py-2 fw-bold rounded-3">Quay lại</button>
                            <RouterLink to="/vehicles" class="btn btn-primary px-4 py-2 fw-bold rounded-3">Tìm xe khác</RouterLink>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// ============================================================================
// KHÔNG GIAN XỬ LÝ LOGIC ĐỌC KẾT QUẢ GIAO DỊCH TỪ CỔNG VNPAY (VNPAY CALLBACK)
// ============================================================================
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isSuccess = ref(true);
const bookingId = ref('BK123456');
const amount = ref(998712);
const depositPaid = ref(408712);
const errorMessage = ref('');

const formatPrice = (val) => val ? val.toLocaleString('vi-VN') + 'đ' : '0đ';

onMounted(() => {
    // Đọc mã trạng thái từ chuỗi truy vấn VNPAY trả về (vnp_ResponseCode = '00' là thành công)
    const vnp_ResponseCode = route.query.vnp_ResponseCode;
    if (vnp_ResponseCode && vnp_ResponseCode !== '00') {
        isSuccess.value = false;
        errorMessage.value = 'Mã lỗi VNPAY: ' + vnp_ResponseCode;
    }
});
</script>