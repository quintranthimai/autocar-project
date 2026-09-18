<template>
    <div class="failed-page text-center py-5">
        <div class="container">
            <!-- Biểu tượng cảnh báo lỗi giao dịch -->
            <i class="fas fa-times-circle text-danger" style="font-size: 6rem;"></i>
            <h2 class="mt-4 fw-bold text-danger">Thanh toán thất bại!</h2>
            <p class="lead">Giao dịch của bạn đã bị hủy hoặc có lỗi xảy ra.</p>

            <!-- Hiển thị Mã Đơn Hàng gặp sự cố để Khách dễ đối chứng với bộ phận hỗ trợ -->
            <div v-if="bookingId" class="mt-4">
                <p>Mã đơn hàng: <strong>#{{ bookingId }}</strong></p>
            </div>

            <!-- Nút điều hướng quay lại trang quản lý để thanh toán lại hoặc hủy chuyến -->
            <RouterLink to="/my-trips" class="btn btn-primary btn-lg mt-4">
                Quay lại chuyến đi của tôi
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
// ============================================================================
// TRÌNH XỬ LÝ TRANG HIỂN THỊ KẾT QUẢ VNPAY THẤT BẠI HOẶC BỊ HỦY (PAYMENT FAILED)
// ============================================================================
import { useRoute } from 'vue-router';
const route = useRoute();

// Bốc tách mã số chuyến đi bị lỗi từ tham số chuỗi URL
const bookingId = route.query.booking_id;
</script>
