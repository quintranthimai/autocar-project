// ============================================================================
// DỊCH VỤ QUẢN LÝ XÁC THỰC VÀ KẾT NỐI API TRÌNH TỰ ĐĂNG NHẬP (AUTH SERVICE)
// ============================================================================
import api from './api'

/**
 * Hàm hỗ trợ xuất Cấu hình tiêu đề (Header) mang Token hợp lệ từ bộ nhớ trình duyệt
 * @returns {Object} Đối tượng cấu hình Header kèm chữ ký Authorization Bearer
 */
export const getAuthHeader = () => {
  const token = localStorage.getItem('authToken')

  if (!token) {
    return {}
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

const AuthService = {
  // ============================================================================
  // 1. CÁC PHƯƠNG THỨC KẾT NỐI API ĐĂNG NHẬP, ĐĂNG KÝ & XÁC TRÌNH TÀI KHOẢN
  // ============================================================================

  /**
   * Phương thức Gửi yêu cầu Đăng nhập hệ thống
   * @param {string} email - Email người dùng
   * @param {string} password - Mật khẩu người dùng
   */
  login(email, password) {
    return api.post('/auth/login', {
      email,
      password,
    })
  },

  /**
   * Phương thức Gửi thông tin Đăng ký tài khoản mới (Khách thuê hoặc Chủ xe)
   * @param {Object} data - Gói dữ liệu (name, email, phone, role_slug, password, v.v.)
   */
  register(data) {
    return api.post('/auth/register', data)
  },

  /**
   * Phương thức Đăng xuất khỏi hệ thống (Thu hồi quyền Token trên Backend)
   */
  logout() {
    return api.post('/auth/logout')
  },

  /**
   * Phương thức Truy xuất thông tin cá nhân của người dùng hiện tại
   */
  getCurrentUser() {
    return api.get('/auth/me')
  },

  // ============================================================================
  // 2. CÁC PHƯƠNG THỨC QUẢN LÝ KHÔI PHỤC VÀ ĐỔI MẬT KHẨU (PASSWORD ACTIONS)
  // ============================================================================

  /**
   * Phương thức Phát lệnh Quên mật khẩu (Gửi email yêu cầu cấp mã OTP)
   * @param {string} email - Địa chỉ email cần khôi phục
   */
  forgotPassword(email) {
    return api.post('/auth/forgot-password', { email })
  },

  /**
   * Phương thức Đặt lại mật khẩu mới thông qua mã OTP nhận qua Email
   * @param {string} email - Email khách hàng
   * @param {string} token - Mã OTP 6 chữ số
   * @param {string} password - Mật khẩu mới
   * @param {string} passwordConfirmation - Xác nhận mật khẩu mới
   */
  resetPassword(email, token, password, passwordConfirmation) {
    return api.post('/auth/reset-password', {
      email,
      token,
      password,
      password_confirmation: passwordConfirmation,
    })
  },

  /**
   * Phương thức Đổi mật khẩu chủ động (Dành cho tài khoản đang trong trạng thái đăng nhập)
   * @param {string} oldPassword - Mật khẩu hiện tại (Mật khẩu cũ)
   * @param {string} newPassword - Mật khẩu mới muốn đặt
   * @param {string} newPasswordConfirmation - Xác nhận mật khẩu mới
   */
  changePassword(oldPassword, newPassword, newPasswordConfirmation) {
    return api.post('/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    })
  },

  // ============================================================================
  // 3. CÁC HÀM QUẢN LÝ BỘ NHỚ TRÌNH DUYỆT (LOCALSTORAGE TOKEN & USER MANAGEMENT)
  // ============================================================================

  /**
   * Lưu chuỗi xác minh (JWT Token / Sanctum Token) vào localStorage
   * @param {string} token - Chuỗi Token nhận về từ Backend
   */
  setToken(token) {
    localStorage.setItem('authToken', token)
  },

  /**
   * Lưu trọn vẹn thông tin đối tượng người dùng (User Object) vào localStorage dưới dạng chuỗi JSON
   * @param {Object} user - Hồ sơ người dùng
   */
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
  },

  /**
   * Lấy chuỗi Token từ localStorage
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('authToken')
  },

  /**
   * Lấy và giải mã chuỗi JSON thông tin người dùng từ localStorage
   * @returns {Object|null}
   */
  getUser() {
    const rawUser = localStorage.getItem('user')
    if (!rawUser) {
      return null
    }

    try {
      return JSON.parse(rawUser)
    } catch {
      return null
    }
  },

  /**
   * Dọn dẹp trọn vẹn Token và dữ liệu cá nhân (Dùng khi đăng xuất hoặc hết hạn Token)
   */
  clearAuth() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  },

  /**
   * Kiểm tra xem Người dùng hiện tại đã đăng nhập chưa thông qua sự tồn tại của Token
   * @returns {boolean} True nếu đã có Token hợp lệ
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken')
  },
}

export default AuthService
