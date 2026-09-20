<template>
    <aside id="sidebar" class="sidebar d-flex flex-column">
        <div class="logo-area">
            <router-link to="/admin/dashboard" class="d-inline-flex align-items-center text-decoration-none">
                <span class="logo-text fw-bold fs-5 text-primary">AutoCar</span>
            </router-link>
        </div>

        <div class="sidebar-menu-scroll">
            <ul class="nav flex-column pb-4">
                <li class="px-4 py-2"><small class="nav-text">Tổng quan</small></li>
                <li>
                    <router-link to="/admin/dashboard" class="nav-link" active-class="active">
                        <i class="ti ti-layout-dashboard"></i>
                        <div class="nav-text text-truncate" :title="'Dashboard'">{{ truncateByChars('Dashboard') }}
                        </div>
                    </router-link>
                </li>

                <li class="px-4 pt-4 pb-2" v-if="canAccessVehicles || canAccessKyc || canAccessTickets"><small class="nav-text">Kiểm duyệt</small></li>
                <li v-if="canAccessVehicles">
                    <router-link :to="{ name: 'admin-vehicle-management' }" class="nav-link" active-class="active">
                        <i class="ti ti-check"></i>
                        <div class="nav-text text-truncate" :title="'Quản lý phương tiện'">Quản lý phương tiện</div>
                    </router-link>
                </li>
                <li v-if="canAccessKyc">
                    <router-link to="/admin/kyc-approval" class="nav-link" active-class="active">
                        <i class="ti ti-id-badge"></i>
                        <div class="nav-text text-truncate" :title="'Duyệt KYC'">{{ truncateByChars('Duyệt KYC') }}
                        </div>
                    </router-link>
                </li>
                <li v-if="canAccessTickets">
                    <router-link :to="{ name: 'admin-support-tickets' }" class="nav-link" active-class="active">
                        <i class="ti ti-headset"></i>
                        <div class="nav-text text-truncate" :title="'Hỗ trợ khách hàng'">Hỗ trợ khách hàng</div>
                    </router-link>
                </li>

                <li class="px-4 pt-4 pb-2" v-if="canAccessBookings || canAccessFinance"><small class="nav-text">Đơn xe & Giao dịch</small></li>
                <li v-if="canAccessBookings">
                    <router-link :to="{ name: 'admin-booking-management' }" class="nav-link" active-class="active">
                        <i class="ti ti-calendar-event"></i>
                        <div class="nav-text text-truncate" :title="'Quản lý đơn đặt xe'">Quản lý đơn đặt xe</div>
                    </router-link>
                </li>
                <li v-if="canAccessFinance">
                    <router-link :to="{ name: 'admin-withdrawal-management' }" class="nav-link" active-class="active">
                        <i class="ti ti-cash"></i>
                        <div class="nav-text text-truncate" :title="'Yêu cầu rút tiền'">Yêu cầu rút tiền</div>
                    </router-link>
                </li>
                <li v-if="canAccessFinance">
                    <router-link :to="{ name: 'admin-transaction-logs' }" class="nav-link" active-class="active">
                        <i class="ti ti-receipt"></i>
                        <div class="nav-text text-truncate" :title="'Nhật ký giao dịch'">Nhật ký giao dịch</div>
                    </router-link>
                </li>

                <li class="px-4 pt-4 pb-2" v-if="canAccessSystemSettings || canAccessReports"><small class="nav-text">Quản trị hệ thống</small></li>
                <li v-if="canAccessSystemSettings">
                    <router-link to="/admin/category-management" class="nav-link" active-class="active">
                        <i class="ti ti-category"></i>
                        <div class="nav-text text-truncate" :title="'Quản lý thông số'">Quản lý thông số</div>
                    </router-link>
                </li>
                <li v-if="canAccessSystemSettings">
                    <router-link to="/admin/add-category" class="nav-link" active-class="active">
                        <i class="ti ti-layout-grid-add"></i>
                        <div class="nav-text text-truncate" :title="'Thêm thông số'">{{ truncateByChars('Thêm thông số')
                        }}</div>
                    </router-link>
                </li>
                <li v-if="canAccessReports">
                    <router-link to="/admin/reports" class="nav-link" active-class="active">
                        <i class="ti ti-file-analytics"></i>
                        <div class="nav-text text-truncate" :title="'Báo cáo'">{{ truncateByChars('Báo cáo') }}</div>
                    </router-link>
                </li>
                <li v-if="canAccessSystemSettings">
                    <router-link :to="{ name: 'admin-promotion-management' }" class="nav-link" active-class="active">
                        <i class="ti ti-discount-2"></i>
                        <div class="nav-text text-truncate" :title="'Quản lý khuyến mãi'">Quản lý khuyến mãi</div>
                    </router-link>
                </li>
                <li v-if="canAccessSystemSettings">
                    <router-link :to="{ name: 'admin-banner-management' }" class="nav-link" active-class="active">
                        <i class="ti ti-photo"></i>
                        <div class="nav-text text-truncate" :title="'Quản lý banner'">Quản lý banner</div>
                    </router-link>
                </li>
                <li v-if="canAccessSystemSettings">
                    <router-link :to="{ name: 'admin-campaign-management' }" class="nav-link" active-class="active">
                        <i class="ti ti-speakerphone"></i>
                        <div class="nav-text text-truncate" :title="'Quản lý chiến dịch'">Quản lý chiến dịch</div>
                    </router-link>
                </li>


                <li v-if="canAccessSystemSettings">
                    <router-link :to="{ name: 'admin-system-settings' }" class="nav-link" active-class="active">
                        <i class="ti ti-settings"></i>
                        <div class="nav-text text-truncate" :title="'Cài đặt hệ thống'">Cài đặt hệ thống</div>
                    </router-link>
                </li>

                <li class="px-4 pt-4 pb-2" v-if="canAccessPayment"><small class="nav-text">Thanh toán</small></li>
                <li v-if="canAccessPayment">
                    <router-link to="/admin/payment-gateway-config" class="nav-link" active-class="active">
                        <i class="ti ti-credit-card"></i>
                        <div class="nav-text text-truncate" :title="'Cấu hình cổng thanh toán'">Cấu hình cổng thanh toán
                        </div>
                    </router-link>
                </li>
                <li v-if="canAccessPayment">
                    <router-link to="/admin/add-payment-gateway" class="nav-link" active-class="active">
                        <i class="ti ti-plus"></i>
                        <div class="nav-text text-truncate" :title="'Thêm cổng thanh toán'">Thêm cổng thanh toán</div>
                    </router-link>
                </li>

                <li class="px-4 pt-4 pb-2" v-if="canAccessUsers"><small class="nav-text">Người dùng</small></li>
                <li v-if="canAccessUsers">
                    <router-link :to="{ name: 'admin-user-management' }" class="nav-link" active-class="active">
                        <i class="ti ti-users"></i>
                        <div class="nav-text text-truncate" :title="'Quản lý người dùng'">Quản lý người dùng</div>
                    </router-link>
                </li>
                <li v-if="canAddAdmin">
                    <router-link :to="{ name: 'admin-add-admin' }" class="nav-link" active-class="active">
                        <i class="ti ti-user-plus"></i>
                        <div class="nav-text text-truncate" :title="'Thêm Admin'">{{ truncateByChars('Thêm Admin') }}
                        </div>
                    </router-link>
                </li>

                <li class="px-4 pt-4 pb-2"><small class="nav-text">Account</small></li>
                <li v-if="isAuthenticated">
                    <router-link :to="{ name: 'admin-profile' }" class="nav-link" active-class="active">
                        <i class="ti ti-user"></i>
                        <div class="nav-text text-truncate" :title="'Hồ sơ cá nhân'">{{ truncateByChars('Hồ sơ cá nhân') }}</div>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'admin-change-password' }" class="nav-link" active-class="active">
                        <i class="ti ti-lock"></i>
                        <div class="nav-text text-truncate" :title="'Đổi mật khẩu'">{{ truncateByChars('Đổi mật khẩu')
                        }}</div>
                    </router-link>
                </li>
                <li v-if="!isAuthenticated">
                    <router-link class="nav-link" to="/admin/signin">
                        <i class="ti ti-login"></i>
                        <div class="nav-text text-truncate" :title="'Login'">{{ truncateByChars('Login') }}</div>
                    </router-link>
                </li>
                <li v-else>
                    <button type="button" class="nav-link w-100 text-start border-0 bg-transparent"
                        @click="handleLogout">
                        <i class="ti ti-logout"></i>
                        <div class="nav-text text-truncate" :title="'Đăng xuất'">{{ truncateByChars('Đăng xuất') }}
                        </div>
                    </button>
                </li>
            </ul>
        </div>
    </aside>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH KẾT NỐI (IMPORTS & ROUTING)
// ============================================================================
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

// Khởi tạo trình điều hướng và kho quản lý trạng thái xác thực
const router = useRouter()
const authStore = useAuthStore()

// Cấu hình giới hạn ký tự tối đa cho nhãn menu bên
const MENU_MAX_CHARS = 21

// ============================================================================
// 2. HỆ THỐNG PHÂN CẤP QUYỀN TRUY CẬP TRUNG TÂM (RBAC COMPUTED PERMISSIONS)
// ============================================================================
// Kiểm tra trạng thái đã đăng nhập của quản trị viên
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Chuẩn hóa danh sách mã vai trò (slugs) của tài khoản hiện tại
const userRoles = computed(() => {
    const roles = authStore.user?.roles || []
    return roles.map(r => typeof r === 'string' ? r : r.slug).filter(Boolean)
})

// Xác định nhóm Quản trị viên cấp cao nhất (Super Admin / Master / Ops)
const isSuperAdmin = computed(() => {
    return userRoles.value.some(r => ['admin', 'master_admin', 'ops_admin'].includes(r))
})

// Quyền hạn truy cập các phân vùng nghiệp vụ trong hệ thống Quản trị
const canAccessVehicles = computed(() => isSuperAdmin.value || userRoles.value.some(r => ['coordinator', 'support', 'staff', 'cskh'].includes(r)))
const canAccessKyc = computed(() => isSuperAdmin.value || userRoles.value.some(r => ['coordinator', 'support', 'staff', 'cskh'].includes(r)))
const canAccessTickets = computed(() => isSuperAdmin.value || userRoles.value.some(r => ['staff', 'support', 'cskh'].includes(r)))

const canAccessBookings = computed(() => isSuperAdmin.value || userRoles.value.some(r => ['coordinator', 'staff', 'support', 'cskh'].includes(r)))
const canAccessFinance = computed(() => isSuperAdmin.value || userRoles.value.includes('coordinator'))

const canAccessReports = computed(() => isSuperAdmin.value || userRoles.value.includes('coordinator'))
const canAccessSystemSettings = computed(() => isSuperAdmin.value)
const canAccessPayment = computed(() => isSuperAdmin.value)
const canAccessUsers = computed(() => isSuperAdmin.value || userRoles.value.some(r => ['coordinator', 'support', 'staff', 'cskh'].includes(r)))
const canAddAdmin = computed(() => isSuperAdmin.value)

// ============================================================================
// 3. BỘ TIỆN ÍCH HIỂN THỊ & TRÌNH NGHIỆP VỤ (UTILITIES & ACTIONS)
// ============================================================================
/**
 * Rút gọn chuỗi văn bản nếu vượt quá độ dài tối đa cho phép trên Sidebar
 */
const truncateByChars = (text, maxChars = MENU_MAX_CHARS) => {
    if (!text) return ''
    return text.length > maxChars ? `${text.slice(0, maxChars)}...` : text
}

/**
 * Đăng xuất khỏi cổng Quản trị viên, hủy phiên và chuyển hướng về trang đăng nhập Admin
 */
async function handleLogout() {
    const confirmed = window.confirm('Bạn có chắc muốn đăng xuất khỏi tài khoản admin không?')
    if (!confirmed) {
        return
    }

    await authStore.logout()
    router.push({ name: 'admin-signin' })
}
</script>
