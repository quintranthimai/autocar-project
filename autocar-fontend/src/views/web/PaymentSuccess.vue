<template>
    <div class="success-page text-center py-5">
        <div class="container">
            <!-- Biểu tượng xác thực thành công -->
            <i class="fas fa-check-circle text-success" style="font-size: 6rem;"></i>
            <h2 class="mt-4 fw-bold text-success">Thanh toán thành công!</h2>
            <p class="lead">Đơn đặt xe của bạn đã được xác nhận.</p>

            <!-- Hiển thị Mã Đơn Hàng truy xuất từ chuỗi URL Query Params -->
            <div v-if="bookingId" class="mt-4">
                <p>Mã đơn hàng: <strong>#{{ bookingId }}</strong></p>
            </div>

            <!-- Điều hướng về Quá trình quản lý Chuyến đi cá nhân -->
            <RouterLink to="/my-trips" class="btn btn-primary btn-lg mt-4">
                Xem đơn đặt xe của tôi
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
// ============================================================================
// TRÌNH XỬ LÝ TRANG HIỂN THỊ KẾT QUẢ VNPAY HỢP LỆ (PAYMENT SUCCESS)
// ============================================================================
import { useRoute } from 'vue-router';
const route = useRoute();

// Bốc tách mã số chuyến đi từ tham số chuỗi URL
const bookingId = route.query.booking_id;
</script>