// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH KẾT NỐI (IMPORTS)
// ============================================================================
import { defineStore } from 'pinia'
import AuthService from '@/services/auth.service'

// ============================================================================
// 2. KHO QUẢN LÝ TRẠNG THÁI XÁC TRÌNH & HỆ THỐNG QUYỀN HẠN (AUTH STORE)
// ============================================================================
export const useAuthStore = defineStore('auth', {
  // --------------------------------------------------------------------------
  // 2.1. TRẠNG THÁI HỆ THỐNG TRUNG TÂM (STATE)
  // --------------------------------------------------------------------------
  state: () => ({
    token: AuthService.getToken(), // Token xác thực JWT trích xuất từ LocalStorage/Cookie
    user: AuthService.getUser(),   // Hồ sơ thông tin chi tiết người dùng
  }),

  // --------------------------------------------------------------------------
  // 2.2. TRÌNH TÍNH TOÁN DỮ LIỆU DẪN XUẤT (GETTERS)
  // --------------------------------------------------------------------------
  getters: {
    // Trạng thái cho biết người dùng đã có phiên đăng nhập hợp lệ chưa
    isAuthenticated: (state) => !!state.token,

    // Trích xuất danh sách vai trò phân quyền (Roles RBAC) của người dùng hiện tại
    roles: (state) => state.user?.roles || [],
  },

  // --------------------------------------------------------------------------
  // 2.3. BỘ PHƯƠNG THỨC NÂNG THAO TÁC NGHIỆP VỤ (ACTIONS)
  // --------------------------------------------------------------------------
  actions: {
    /**
     * Đồng bộ và cập nhật token cùng hồ sơ người dùng vào Store và bộ nhớ trình duyệt
     */
    setAuth(token, user = null) {
      this.token = token
      this.user = user
      AuthService.setToken(token)
      if (user) {
        AuthService.setUser(user)
      }
    },

    /**
     * Dọn dẹp sạch sẽ trạng thái đăng nhập, loại bỏ Token khỏi bộ nhớ (Xử lý khi Hết hạn / Đăng xuất)
     */
    clearAuth() {
      this.token = null
      this.user = null
      AuthService.clearAuth()
    },

    /**
     * Cập nhật tức thời thông tin hồ sơ tài khoản xuống Trạng thái và LocalStorage
     */
    updateUser(userData) {
      if (!userData) {
        this.user = null
        AuthService.setUser(null)
        return
      }
      const currentRoles = this.user?.roles || []
      const updatedUser = {
        ...this.user,
        ...userData,
        roles: userData.roles || currentRoles,
      }
      this.user = updatedUser
      AuthService.setUser(updatedUser) // Cập nhật luôn xuống LocalStorage
    },

    /**
     * Tiến hành gửi yêu cầu Xác thực Đăng nhập vào Máy chủ và lưu giữ Token
     */
    async login({ email, password }) {
      const response = await AuthService.login(email, password)
      const payload = response.data?.data || {}
      const accessToken = payload.access_token

      if (!accessToken) {
        throw new Error('Login response missing access token')
      }

      this.setAuth(accessToken, payload.user || null)

      return payload
    },

    /**
     * Tiến hành đăng ký tài khoản mới và tự động thiết lập phiên đăng nhập nếu có trả về Token
     */
    async register(registerData) {
      const response = await AuthService.register(registerData)
      const payload = response.data?.data || {}

      if (payload.access_token) {
        this.setAuth(payload.access_token, payload.user || null)
      }

      return payload
    },

    /**
     * Đồng bộ hồ sơ tài khoản mới nhất từ máy chủ (Fetch Current User) để đảm bảo dữ liệu mới nhất
     */
    async fetchCurrentUser() {
      const response = await AuthService.getCurrentUser()
      const user = response.data?.data || null
      this.user = user

      if (user) {
        AuthService.setUser(user)
      }

      return user
    },

    /**
     * Thực hiện Hủy phiên đăng nhập an toàn từ phía Server lẫn Client (Logout logic)
     */
    async logout() {
      try {
        await AuthService.logout()
      } finally {
        this.clearAuth()
      }
    },
  },
})
