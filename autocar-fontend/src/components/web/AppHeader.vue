<template>
    <div class="container-fluid nav-bar sticky-top px-0 px-lg-4 py-2 py-lg-0 bg-white">
        <div class="container">
            <nav class="navbar navbar-expand-lg navbar-light">
                <router-link to="/" class="navbar-brand p-0 text-decoration-none">
                    <h1 class="display-6 text-primary mb-0">
                        <i class="fas fa-car-alt me-3"></i>
                        AutoCar
                    </h1>
                </router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span class="fa fa-bars"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <div class="navbar-nav mx-auto py-0">
                        <router-link to="/" class="nav-item nav-link" active-class="active">Trang chủ</router-link>
                        <router-link to="/vehicles" class="nav-item nav-link">Xe</router-link>
                        <router-link to="/about" class="nav-item nav-link">Giới thiệu</router-link>
                    </div>

                    <router-link v-if="!isLoggedIn" to="/auth/login" class="btn btn-primary rounded-pill py-2 px-4">
                        Đăng nhập
                    </router-link>

                    <div v-else class="d-flex align-items-center ms-lg-4 border-start border-2 ps-4 gap-4">

                        <div class="dropdown">
                            <button type="button"
                                class="btn p-0 text-dark position-relative text-decoration-none border-0"
                                data-bs-toggle="dropdown" aria-expanded="false" aria-label="Thông báo">
                                <i class="far fa-bell fs-5"></i>
                                <span v-if="unreadNotificationCount > 0"
                                    class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-white rounded-circle"></span>
                            </button>
                            <div class="dropdown-menu dropdown-menu-end shadow-sm mt-2 p-0" style="min-width: 320px;">
                                <h6 class="dropdown-header">Thông báo</h6>
                                <div ref="notificationListRef" class="notification-scroll px-2 pb-2">
                                    <router-link v-for="item in visibleNotifications" :key="item.id" 
                                        :to="item.data.to || '/wallet'"
                                        @click="handleNotificationClick(item)"
                                        class="dropdown-item rounded-2 py-2 px-2 border-bottom"
                                        :class="{ 'bg-light': item.read_at === null, 'opacity-50 text-muted': item.read_at !== null }">
                                        <div class="fw-semibold small" :class="item.read_at === null ? 'text-dark' : 'text-muted'">
                                            <span v-if="item.read_at === null" class="text-danger me-1">•</span>
                                            {{ item.data.title }}
                                        </div>
                                        <div class="text-muted small">{{ item.data.message }}</div>
                                        <div class="text-primary fw-bold small mt-1" v-if="item.data.amount">
                                            {{ item.data.amount }}
                                        </div>
                                    </router-link>
                                    <div v-if="notificationItems.length === 0" class="text-center py-3 text-muted small">
                                        Không có thông báo nào.
                                    </div>
                                </div>
                                <div class="border-top px-2 py-2">
                                    <button type="button" class="btn btn-sm btn-outline-primary w-100 fw-semibold border-0"
                                        :disabled="!hasMoreNotifications" @click="showMoreNotifications">
                                        {{ hasMoreNotifications ? 'Xem tất cả' : 'Đã hiển thị tất cả' }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <a href="#" class="text-dark text-decoration-none">
                            <i class="far fa-comment-dots fs-5"></i>
                        </a>

                        <router-link to="/wallet" class="d-flex align-items-center gap-2 text-decoration-none">
                            <i class="fas fa-wallet text-primary"></i>
                            <span class="fw-bold text-dark fs-6">{{ formatCurrency(walletBalance) }}</span>
                        </router-link>

                        <router-link to="/profile"
                            class="d-flex align-items-center gap-2 text-dark text-decoration-none ms-2">
                            <img :src="avatarSrc" class="rounded-circle object-fit-cover shadow-sm" width="38"
                                height="38" alt="Avatar">
                            <span class="fw-bold fs-6">{{ displayName }}</span>
                            <i class="fas fa-chevron-down small text-muted ms-1"></i>
                        </router-link>

                    </div>
                </div>
            </nav>
        </div>
    </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH KẾT NỐI (IMPORTS & SETUP)
// ============================================================================
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import notificationService from '@/services/notification.service'

// Khởi tạo các bộ định tuyến và kho lưu trữ xác thực Pinia
const route = useRoute()
const authStore = useAuthStore()
const { user, token } = storeToRefs(authStore)

// ============================================================================
// 2. TRÌNH TÍNH TOÁN DỮ LIỆU TÀI KHOẢN & VÍ KÝ QUY CHUNG (USER COMPUTED)
// ============================================================================
// Trạng thái đã đăng nhập của người dùng
const isLoggedIn = computed(() => !!token.value)

// Tên hiển thị trên thanh điều hướng Nav Header
const displayName = computed(() => user.value?.name || 'Tài khoản')

// Đường dẫn ảnh đại diện hồ sơ cá nhân
const avatarSrc = computed(() => user.value?.avatar || '/img/team-1.jpg')

// Số dư ví hiện tại của người dùng để hiển thị trực tiếp
const walletBalance = computed(() => user.value?.wallet?.available_balance || 0)

// ============================================================================
// 3. QUẢN LÝ TRẠNG THÁI & TÌNH HUỐNG THÔNG BÁO HỆ THỐNG (NOTIFICATION STATE)
// ============================================================================
const notificationItems = ref([])            // Danh sách các thông báo thu thập từ máy chủ
const visibleNotificationCount = ref(10)     // Giới hạn hiển thị ban đầu trên thanh menu
const notificationListRef = ref(null)        // Tham chiếu DOM đến hộp chứa thông báo

// Tổng lượng thông báo chưa đọc
const unreadNotificationCount = computed(() => notificationItems.value.filter(n => n.read_at === null).length)

// Trích xuất danh sách thông báo hiển thị theo giới hạn
const visibleNotifications = computed(() => notificationItems.value.slice(0, visibleNotificationCount.value))

// Kiểm tra xem còn thông báo cũ chưa hiển thị hết hay không
const hasMoreNotifications = computed(() => visibleNotificationCount.value < notificationItems.value.length)

// ============================================================================
// 4. BỘ HÀM NGHIỆP VỤ XỬ LÝ TƯƠNG TÁC THÔNG BÁO (ACTIONS & SERVICES)
// ============================================================================
/**
 * Thu thập danh sách thông báo hệ thống của người dùng (tối đa 50 thông báo)
 */
const loadNotifications = async () => {
    if (!token.value) return;
    try {
        const res = await notificationService.getNotifications(50); // Lấy lên tới 50 thông báo
        if (res.data.success) {
            notificationItems.value = res.data.data;
        }
    } catch (error) {
        console.error("Lỗi tải thông báo:", error);
    }
}

/**
 * Xử lý sự kiện khi người dùng bấm vào một thông báo chưa đọc -> Cập nhật sang Đã Đọc
 */
const handleNotificationClick = async (item) => {
    if (item.read_at === null) {
        try {
            await notificationService.markAsRead(item.id);
            item.read_at = new Date().toISOString();
        } catch (error) {
            console.error("Lỗi đánh dấu đã đọc:", error);
        }
    }
}

/**
 * Mở rộng hiển thị toàn bộ thông báo hiện có trong danh sách
 */
const showMoreNotifications = async () => {
    if (!hasMoreNotifications.value) return

    visibleNotificationCount.value = notificationItems.value.length

    await nextTick()
    if (notificationListRef.value) {
        // notificationListRef.value.scrollTop = notificationListRef.value.scrollHeight
    }
}

// ============================================================================
// 5. BỘ TIỆN ÍCH HIỂN THỊ ĐỊNH DẠNG TIỀN TỆ (FORMATTERS)
// ============================================================================
/**
 * Định dạng số tiền sang chuẩn tiền tệ Việt Nam (VNĐ)
 */
const formatCurrency = (val) => {
    return Number(val).toLocaleString('vi-VN') + 'đ';
}

// Biến lưu đồng hồ chu kỳ cập nhật ngầm thông báo
let pollInterval = null;

// ============================================================================
// 6. KHUNG MÓC CHU KỲ VÒNG ĐỜI VÀ TRÌNH LẮNG NGHE (LIFECYCLE & WATCHERS)
// ============================================================================
onMounted(() => {
    if (token.value) {
        authStore.fetchCurrentUser().catch(() => authStore.clearAuth())
        loadNotifications()
        
        // Auto refresh every 30 seconds
        pollInterval = setInterval(() => {
            loadNotifications()
        }, 30000)
    }
})

onUnmounted(() => {
    if (pollInterval) clearInterval(pollInterval)
})

// Refresh when changing pages
watch(() => route.path, () => {
    if (token.value) {
        loadNotifications()
    }
})
</script>

<style scoped>
.notification-scroll {
    max-height: 280px;
    overflow-y: auto;
}
</style>