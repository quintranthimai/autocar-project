<template>
    <div class="col-lg-3">
        <h2 class="fw-bold mb-4">Xin chào bạn!</h2>

        <div v-if="hasBothRoles" class="mb-4 bg-white p-3 rounded-4 shadow-sm border text-center">
            <p class="small text-muted mb-2 fw-bold">Chế độ hiện tại:</p>
            <button @click="toggleMode" class="btn w-100 fw-bold rounded-pill shadow-sm transition"
                :class="activeMode === 'owner' ? 'btn-warning text-dark' : 'btn-primary text-white'">
                <i :class="activeMode === 'owner' ? 'fas fa-car-side' : 'fas fa-user'"></i>
                {{ activeMode === 'owner' ? 'Đang ở Chế độ Chủ xe' : 'Đang ở Chế độ Khách thuê' }}
                <div class="small fw-normal mt-1 opacity-75"><i class="fas fa-sync-alt me-1"></i> Bấm để chuyển</div>
            </button>
        </div>

        <div class="list-group list-group-flush gap-2">
            <RouterLink to="/profile"
                class="list-group-item list-group-item-action border-0 rounded-3 d-flex align-items-center gap-3 ps-3 py-2 text-dark text-decoration-none"
                active-class="text-primary fw-bold border-start border-4 border-primary bg-light"
                exact-active-class="text-primary fw-bold border-start border-4 border-primary bg-light">
                <i class="far fa-user fs-5 text-muted" style="width: 25px;"></i> Tài khoản của tôi
            </RouterLink>

            <template v-if="activeMode === 'owner'">
                <RouterLink to="/partner/my-cars"
                    class="list-group-item list-group-item-action border-0 rounded-3 d-flex align-items-center gap-3 ps-3 py-2 text-dark text-decoration-none"
                    active-class="text-primary fw-bold border-start border-4 border-primary bg-light">
                    <i class="fas fa-car fs-5 text-muted" style="width: 25px;"></i> Quản lý xe của tôi
                </RouterLink>
            </template>

            <template v-if="activeMode === 'renter'">
                <RouterLink to="/my-trips"
                    class="list-group-item list-group-item-action border-0 rounded-3 d-flex align-items-center gap-3 ps-3 py-2 text-dark text-decoration-none"
                    active-class="text-primary fw-bold border-start border-4 border-primary bg-light">
                    <i class="fas fa-map-marked-alt fs-5 text-muted" style="width: 25px;"></i> Chuyến của tôi
                </RouterLink>
                <RouterLink to="/favorites"
                    class="list-group-item list-group-item-action border-0 rounded-3 d-flex align-items-center gap-3 ps-3 py-2 text-dark text-decoration-none"
                    active-class="text-primary fw-bold border-start border-4 border-primary bg-light">
                    <i class="far fa-heart fs-5 text-muted" style="width: 25px;"></i> Xe yêu thích
                </RouterLink>
            </template>

            <RouterLink to="/wallet"
                class="list-group-item list-group-item-action border-0 rounded-3 d-flex align-items-center gap-3 ps-3 py-2 text-dark text-decoration-none"
                active-class="text-primary fw-bold border-start border-4 border-primary bg-light">
                <i class="fas fa-wallet fs-5 text-muted" style="width: 25px;"></i> Quản lý Ví
            </RouterLink>

            <RouterLink :to="{ name: 'change-password' }"
                class="list-group-item list-group-item-action border-0 rounded-3 d-flex align-items-center gap-3 ps-3 py-2 text-dark text-decoration-none"
                active-class="text-primary fw-bold border-start border-4 border-primary bg-light">
                <i class="fas fa-lock fs-5 text-muted" style="width: 25px;"></i> Đổi mật khẩu
            </RouterLink>

            <RouterLink to="/support-center"
                class="list-group-item list-group-item-action border-0 rounded-3 d-flex align-items-center gap-3 ps-3 py-2 text-dark text-decoration-none"
                active-class="text-primary fw-bold border-start border-4 border-primary bg-light">
                <i class="fas fa-headset fs-5 text-muted" style="width: 25px;"></i> Trung tâm Hỗ trợ
            </RouterLink>

            <button type="button" @click="handleDeleteAccount"
                class="list-group-item list-group-item-action border-0 rounded-3 d-flex align-items-center gap-3 ps-3 py-2 text-dark text-decoration-none bg-transparent text-start mt-2">
                <i class="far fa-trash-alt fs-5 text-muted" style="width: 25px;"></i> Yêu cầu xoá tài khoản
            </button>

            <hr class="text-muted opacity-25 my-1">
            <button type="button" @click="handleLogout"
                class="btn btn-link d-flex align-items-center gap-3 text-danger text-decoration-none ps-3 p-0 text-start">
                <i class="fas fa-sign-out-alt fs-5" style="width: 25px;"></i> Đăng xuất
            </button>
        </div>
    </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH KẾT NỐI (IMPORTS & SETUP)
// ============================================================================
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import ProfileService from '@/services/profile.service'

// Khởi tạo đối tượng định hướng và Kho lưu trữ trạng thái người dùng
const router = useRouter()
const authStore = useAuthStore()

// ============================================================================
// 2. HỆ THỐNG PHÂN BỘ QUYỀN HẠN VÀ TRẠNG THÁI CHẾ ĐỘ (ROLE & MODE STATE)
// ============================================================================
// Lấy danh sách quyền từ Store
const userRoles = computed(() => authStore.user?.roles?.map(r => r.slug) || []);
const isRenter = computed(() => userRoles.value.includes('renter'));
const isOwner = computed(() => userRoles.value.includes('owner') || userRoles.value.includes('partner'));

// Kiểm tra xem User có cả 2 quyền không (Để quyết định hiển thị nút Switch Mode)
const hasBothRoles = computed(() => isRenter.value && isOwner.value);

// Quản lý trạng thái Mode hiện tại (Lưu vào localStorage để F5 không bị mất)
const activeMode = ref(localStorage.getItem('activeMode') || (isOwner.value && !isRenter.value ? 'owner' : 'renter'));

// ============================================================================
// 3. BỘ CÔNG CỤ XỬ LÝ CHUYỂN TRẠNG THÁI VÀ NGHIỆP VỤ HỒ SƠ (ACTIONS & SERVICES)
// ============================================================================
// Hàm chuyển đổi chế độ Chủ xe / Khách thuê
function toggleMode() {
    activeMode.value = activeMode.value === 'renter' ? 'owner' : 'renter';
    localStorage.setItem('activeMode', activeMode.value);

    // Mỗi khi đổi chế độ, đẩy User về trang Profile dùng chung để tránh lỗi 403 khi đang đứng ở route cấm
    router.push('/profile');
}

/**
 * Xử lý thao tác xóa hồ sơ tài khoản và dữ liệu liên quan với xác nhận bảo vệ kép
 */
async function handleDeleteAccount() {
    const confirmed = window.confirm('CẢNH BÁO MẤT DỮ LIỆU: \n\nBạn có chắc chắn muốn xóa vĩnh viễn tài khoản này không? Mọi lịch sử chuyến đi, thông tin giấy tờ và số dư ví sẽ bị xóa sạch và không thể khôi phục!')
    if (!confirmed) return;

    try {
        await ProfileService.deleteAccount();
        alert('Tài khoản của bạn đã được xóa thành công. Hẹn gặp lại!');
        authStore.clearAuth();
        router.push({ name: 'login' });
    } catch (error) {
        console.error('Lỗi xóa tài khoản:', error);
        alert('Có lỗi xảy ra, không thể xóa tài khoản lúc này. Vui lòng thử lại sau.');
    }
}

/**
 * Đăng xuất tài khoản khỏi hệ thống Khách / Chủ xe và chuyển hướng sang màn hình đăng nhập
 */
async function handleLogout() {
    const confirmed = window.confirm('Bạn có chắc muốn đăng xuất không?')
    if (!confirmed) return;
    await authStore.logout();
    router.push({ name: 'login' });
}
</script>