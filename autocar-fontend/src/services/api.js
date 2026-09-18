// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH GIAO ĐIỂM API (AXIOS CONFIG)
// ============================================================================
import axios from 'axios'

// Địa chỉ gốc của máy chủ API, ưu tiên lấy từ biến môi trường VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://autocar-citx.onrender.com/api'

// Khởi tạo đối tượng Axios dùng chung toàn bộ ứng dụng
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ============================================================================
// 2. BỘ CHIỂN KẾT TRUY CẤP ĐẦU VÀO (REQUEST INTERCEPTOR - JWT ATTACHMENT)
// ============================================================================
// Tự động đóng gói Token Xác thực (Bearer Token) vào Tiêu đề (Header) trước mỗi lần gửi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ============================================================================
// 3. BỘ CHIỂN KẾT PHẢN HỒI ĐẦU RA (RESPONSE INTERCEPTOR - 401 EXPIRY HANDLING)
// ============================================================================
// Xử lý tập trung các kết quả trả về từ máy chủ, đặc biệt là tình huống Hết hạn phiên (Error 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const pathname = window.location.pathname
      const isAdminArea = pathname.startsWith('/admin')
      const isAuthPage =
        pathname.startsWith('/auth/login') ||
        pathname.startsWith('/auth/register') ||
        pathname.startsWith('/admin/signin')

      // Token hết hạn hoặc bất hợp pháp -> Tiến hành thu hồi token và xóa hồ sơ người dùng khỏi bộ nhớ
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')

      // Nếu không phải đang đứng ở các trang đăng nhập/đăng ký thì tự động chuyển hướng về đúng cổng đăng nhập
      if (!isAuthPage) {
        window.location.href = isAdminArea ? '/admin/signin' : '/auth/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
