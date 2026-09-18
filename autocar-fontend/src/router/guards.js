// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & ĐỊNH NGHĨA HỆ THỐNG VAI TRÒ (RBAC CONSTANTS)
// ============================================================================
import { useAuthStore } from '@/stores/auth.store'

// Danh sách mã vai trò Quản trị viên (Admin Portal) - bao gồm trọn vẹn quyền CSKH, Support...
const ADMIN_ROLES = ['admin', 'coordinator', 'master_admin', 'ops_admin', 'support', 'staff', 'cskh']

// Danh sách mã vai trò Người dùng trang Web Cổng ngoài (Khách thuê / Chủ xe Đăng cai)
const WEB_ROLES = ['renter', 'owner']

// ============================================================================
// 2. BỘ HÀM BỔ TRỢ XỬ LÝ QUYỀN VÀ XÁC MÍNH TÀI KHOẢN (AUTHENTICATION HELPERS)
// ============================================================================
/**
 * Chuẩn hóa và trích xuất danh sách các mã định danh quyền (slugs) từ hồ sơ người dùng
 */
function getRoleSlugs(user) {
  return Array.isArray(user?.roles)
    ? user.roles.map((role) => (typeof role === 'string' ? role : role?.slug)).filter(Boolean)
    : []
}

/**
 * Kiểm tra xem người dùng có ít nhất một quyền thuộc danh sách được cho phép truy cập hay không
 */
function hasAnyRole(user, allowedRoles = []) {
  if (!allowedRoles.length) {
    return true
  }

  const roleSlugs = getRoleSlugs(user)
  return allowedRoles.some((role) => roleSlugs.includes(role))
}

/**
 * Đảm bảo người dùng sở hữu token hợp lệ và tự động phục hồi quyền từ Server nếu LocalStorage bị suy hao
 */
async function ensureAuthenticatedUser(authStore) {
  if (!authStore.token) {
    return false
  }

  // Nếu chưa có user hoặc bị thiếu/trống danh sách quyền trong localStorage (bị lỗi cũ ghi đè), gọi API để khôi phục quyền
  if (!authStore.user || !Array.isArray(authStore.user.roles) || authStore.user.roles.length === 0) {
    try {
      await authStore.fetchCurrentUser()
    } catch {
      authStore.clearAuth()
      return false
    }
  }

  return !!authStore.user
}

// ============================================================================
// 3. HÀM TỔNG TÍCH HỢP BẢO VỆ TUYẾN ĐƯỜNG CENTRALIZED ROUTING GUARDS)
// ============================================================================
/**
 * Cài đặt bộ chốt chặn an ninh trước mỗi lệnh điều hướng (Router BeforeEach Guard)
 */
export function installRouteGuards(router) {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore()
    const requiresAuth = Boolean(to.meta.requiresAuth)
    const guestOnly = Boolean(to.meta.guestOnly)
    const allowedRoles = Array.isArray(to.meta.roles) ? to.meta.roles : []
    const isAdminRoute = to.path.startsWith('/admin')

    // Xác thực tính hợp lệ của phiên làm việc trước khi quyết định điều hướng
    const isAuthenticated = await ensureAuthenticatedUser(authStore)

    if (isAuthenticated) {
      const userRoles = getRoleSlugs(authStore.user)
      const isAdminUser = userRoles.some((role) => ADMIN_ROLES.includes(role))

      // Nếu route chỉ dành cho khách (guestOnly như Trang Đăng nhập) nhưng đã có token -> Bật ngược về Trang Chủ
      if (guestOnly) {
        if (isAdminUser) {
          return { name: 'admin-dashboard' }
        }
        return { name: 'home' }
      }

      // Tài khoản admin chỉ được đi trong khu vực /admin. Tuyệt đối không cho phép truy cập trang khách thuê/chủ xe.
      if (isAdminUser && !isAdminRoute) {
        return { name: 'admin-dashboard' }
      }

      // Tài khoản không thuộc nhóm admin không được vào khu vực /admin.
      if (!isAdminUser && isAdminRoute) {
        if (userRoles.some((role) => WEB_ROLES.includes(role))) {
          return { name: 'home' }
        }
        return { name: 'admin-signin' }
      }

      // Master Admin hoặc Admin hệ thống có toàn quyền truy cập mọi route admin
      if (isAdminRoute && userRoles.some((role) => ['admin', 'master_admin', 'ops_admin'].includes(role))) {
        return true
      }

      // Kiểm tra thẩm quyền truy cập theo Danh sách Role đặc trưng của từng Route (meta.roles)
      if (allowedRoles.length && !hasAnyRole(authStore.user, allowedRoles)) {
        if (isAdminRoute) {
          if (to.name !== 'admin-dashboard') {
            return { name: 'admin-dashboard' }
          }
          return false
        }
        return { name: 'home' }
      }

      // Chốt chặn độc quyền trang Checkout & Chuyến đi của Khách thuê (Renter)
      if (to.meta.renterOnly && !userRoles.includes('renter')) {
        return { name: 'home' }
      }

      // Chốt chặn độc quyền Quản lý xe cho Đối tác Chủ xe (Owner / Partner)
      if (to.meta.ownerOnly && !userRoles.includes('owner') && !userRoles.includes('partner')) {
        return { name: 'profile' }
      }

      return true
    } else {
      // Trường hợp chưa đăng nhập (Chưa có Token hợp lệ)
      if (guestOnly) {
        return true
      }

      // Điều hướng về màn Đăng nhập phù hợp nếu cố gắng vào trang Yêu cầu Bảo mật
      if (requiresAuth || allowedRoles.length) {
        if (isAdminRoute) {
          return { name: 'admin-signin', query: { redirect: to.fullPath } }
        }
        return { name: 'login', query: { redirect: to.fullPath } }
      }

      return true
    }
  })
}

// ============================================================================
// 4. XUẤT KHẨU THÀNH VẬT THỤ VIỆN HỖ TRỢ CHIẾN MÔN
// ============================================================================
export { ADMIN_ROLES, WEB_ROLES, getRoleSlugs, hasAnyRole }
