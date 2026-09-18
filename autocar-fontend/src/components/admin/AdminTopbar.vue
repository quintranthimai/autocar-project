<template>
    <!-- TOPBAR -->
    <nav id="topbar" class="navbar bg-white border-bottom fixed-top topbar px-3">
        <button id="toggleBtn" class="d-none d-lg-inline-flex btn btn-light btn-icon btn-sm ">
            <i class="ti ti-layout-sidebar-left-expand"></i>
        </button>

        <!-- MOBILE -->
        <button id="mobileBtn" class="btn btn-light btn-icon btn-sm d-lg-none me-2">
            <i class="ti ti-layout-sidebar-left-expand"></i>
        </button>
        <div>
            <!-- Navbar nav -->
            <ul class="list-unstyled d-flex align-items-center mb-0 gap-1">
                <!-- Pages link -->

                <!-- Bell icon -->
                <li>
                    <a class="position-relative btn-icon btn-sm btn-light btn rounded-circle" data-bs-toggle="dropdown"
                        aria-expanded="false" href="#" role="button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                            class="icon icon-tabler icons-tabler-outline icon-tabler-bell">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path
                                d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                            <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                        </svg>
                        <span v-if="unreadNotificationCount > 0"
                            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-2 ms-n2">
                            {{ unreadNotificationCount }}
                            <span class="visually-hidden">unread messages</span>
                        </span>
                    </a>
                    <div class="dropdown-menu dropdown-menu-end dropdown-menu-md p-0">
                        <ul class="list-unstyled p-0 m-0">
                            <li v-if="notificationItems.length === 0" class="p-3 text-center text-muted small">
                                Không có thông báo nào.
                            </li>
                            
                            <li v-for="item in visibleNotifications" :key="item.id" class="p-3 border-bottom"
                                :class="{ 'bg-light': item.read_at === null, 'opacity-50 text-muted': item.read_at !== null }">
                                <router-link :to="item.data.to || '#'" @click="handleNotificationClick(item)" class="text-decoration-none text-dark d-flex gap-3">
                                    <div class="flex-grow-1 small">
                                        <p class="mb-0 fw-bold" :class="item.read_at === null ? 'text-dark' : 'text-muted'">
                                            <span v-if="item.read_at === null" class="text-danger me-1">•</span>
                                            {{ item.data.title }}
                                        </p>
                                        <p class="mb-1">{{ item.data.message }}</p>
                                    </div>
                                </router-link>
                            </li>
                            <li class="px-4 py-3 text-center">
                                <button class="btn btn-sm btn-link text-primary text-decoration-none" 
                                    @click="showMoreNotifications" :disabled="!hasMoreNotifications">
                                    {{ hasMoreNotifications ? 'Xem thêm' : 'Đã hiển thị tất cả' }}
                                </button>
                            </li>
                        </ul>
                    </div>
                </li>
                <!-- Dropdown -->
                <li class="ms-3 dropdown">
                    <a href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <img :src="avatarSrc" alt="Avatar" class="avatar avatar-sm rounded-circle object-fit-cover" />
                    </a>
                    <div class="dropdown-menu dropdown-menu-end p-0" style="min-width: 200px;">
                        <div>
                            <div class="d-flex gap-3 align-items-center border-dashed border-bottom px-3 py-3">
                                <img :src="avatarSrc" alt="Avatar" class="avatar avatar-md rounded-circle object-fit-cover" />
                                <div>
                                    <h4 class="mb-0 small">{{ displayName }}</h4>
                                    <p class="mb-0 small text-capitalize">{{ displayRole }}</p>
                                </div>
                            </div>
                            <div class="p-3 d-flex flex-column gap-1 small lh-lg">
                                <router-link :to="{ name: 'admin-profile' }" class="text-decoration-none text-dark"><span>Hồ sơ cá nhân</span></router-link>
                                <router-link :to="{ name: 'admin-change-password' }" class="text-decoration-none text-dark"><span>Đổi mật khẩu</span></router-link>
                                <a href="#" @click.prevent="logout" class="text-decoration-none text-danger fw-bold"><span>Đăng xuất</span></a>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH KẾT NỐI (IMPORTS & SETUP)
// ============================================================================
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import notificationService from '@/services/notification.service'

// Khởi tạo các bộ điều hướng và truy xuất kho lưu trữ dữ liệu xác thực
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { user, token } = storeToRefs(authStore)

// ============================================================================
// 2. TRÌNH TÍNH TOÁN HỒ SƠ NGƯỜI DÙNG HỂN THỊ (USER PROFILE COMPUTED)
// ============================================================================
// Tên hiển thị trên thanh công cụ trên cùng
const displayName = computed(() => user.value?.name || 'Admin')

// Đường dẫn ảnh đại diện cá nhân
const avatarSrc = computed(() => user.value?.avatar || '/img/team-1.jpg')

// Trích xuất chức danh/vai trò chính để hiển thị bên dưới tên Quản trị viên
const displayRole = computed(() => {
    const roles = user.value?.roles || []
    if (roles.length > 0) {
        const firstRole = roles[0]
        return typeof firstRole === 'string' ? firstRole : (firstRole?.name || firstRole?.slug || 'Admin')
    }
    return 'Admin'
})

// ============================================================================
// 3. QUẢN LÝ TRẠNG THÁI HỘP THƯ THÔNG BÁO HỆ THỐNG (NOTIFICATION STATE)
// ============================================================================
const notificationItems = ref([])            // Danh sách toàn bộ thông báo lấy về từ máy chủ
const visibleNotificationCount = ref(5)      // Số lượng thông báo hiển thị tối đa trên hộp xối xuống (dropdown)

// Đếm số lượng thông báo chưa đọc (chưa có thời gian read_at)
const unreadNotificationCount = computed(() => notificationItems.value.filter(n => n.read_at === null).length)

// Trích xuất danh sách thông báo để hiển thị dựa theo giới hạn hiển thị hiện tại
const visibleNotifications = computed(() => notificationItems.value.slice(0, visibleNotificationCount.value))

// Cờ kiểm tra còn thông báo cũ hơn để bấm xem thêm hay không
const hasMoreNotifications = computed(() => visibleNotificationCount.value < notificationItems.value.length)

// ============================================================================
// 4. BỘ HÀM NGHIỆP VỤ & TƯƠNG TÁC THÔNG BÁO (ACTIONS & SERVICES)
// ============================================================================
/**
 * Tải danh sách thông báo hệ thống dành cho admin từ máy chủ
 */
const loadNotifications = async () => {
    if (!token.value) return;
    try {
        const res = await notificationService.getNotifications(50);
        if (res.data.success) {
            notificationItems.value = res.data.data;
        }
    } catch (error) {
        console.error("Lỗi tải thông báo:", error);
    }
}

/**
 * Xử lý sự kiện bấm vào từng thẻ thông báo để chuyển trạng thái sang đã đọc
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
 * Mở rộng số lượng thông báo hiển thị trên danh sách dropdown (+5 mục mỗi lần)
 */
const showMoreNotifications = async () => {
    if (!hasMoreNotifications.value) return
    visibleNotificationCount.value += 5
}

/**
 * Tiến hành đăng xuất tài khoản và điều hướng về trang đăng nhập của Admin Portal
 */
const logout = async () => {
    await authStore.logout();
    router.push('/admin/signin');
}

// Biến lưu chu kỳ làm mới tự động ngầm (polling timer)
let pollInterval = null;

// ============================================================================
// 5. KHUNG MÓC CHU KỲ VÒNG ĐỜI HỆ THỐNG (LIFECYCLE HOOKS & WATCHERS)
// ============================================================================
onMounted(() => {
    if (token.value) {
        if (!user.value) authStore.fetchCurrentUser();
        loadNotifications()
        
        // Thiết lập đồng hồ chu kỳ làm mới danh sách thông báo mỗi 15 giây
        pollInterval = setInterval(() => {
            loadNotifications()
        }, 15000)
    }
})

onUnmounted(() => {
    // Giải phóng chu kỳ ngầm khi component bị hủy để tránh rò rỉ bộ nhớ (Memory Leak)
    if (pollInterval) clearInterval(pollInterval)
})

// Theo dõi thay đổi đường dẫn trang để cập nhật kịp thời thông báo mới
watch(() => route.path, () => {
    if (token.value) loadNotifications()
})
</script>

