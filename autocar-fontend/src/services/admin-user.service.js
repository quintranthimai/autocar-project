// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TUYẾN ĐƯỜNG NGHIỆP VỤ (IMPORTS & CONFIG)
// ============================================================================
import api from '@/services/api'

// Tuyến đường API trung tâm điều phối nghiệp vụ Nhân sự & Khách hàng Cổng Admin
const API_URL = '/v1/admin'

// ============================================================================
// 2. LỚP DỊCH VỤ ĐIỀU PHỐI VÀ QUẢN TRỊ VIÊN TÀI KHOẢN (ADMIN USER SERVICE)
// ============================================================================
class AdminUserService {
  // --------------------------------------------------------------------------
  // 2.1. TRUY KẾT VÀ BẢO TRI TÀI KHOẢN NGƯỜI DÙNG (USER CRUD)
  // --------------------------------------------------------------------------
  /**
   * Tải danh sách người dùng toàn hệ thống có áp dụng Phân quyền Role và Bộ lọc tìm kiếm
   */
  getUsers(params = {}) {
    const { page = 1, role_slug = 'all', search = '', per_page = 10 } = params
    return api.get(`${API_URL}/users`, {
      params: {
        page,
        role_slug,
        search,
        per_page,
      },
    })
  }

  /**
   * Truy xuất hồ sơ chi tiết theo định danh ID, bao gồm toàn bộ lịch sử hoạt động
   */
  getUserById(id, params = {}) {
    return api.get(`${API_URL}/users/${id}`, { params })
  }

  /**
   * Khởi tạo và bổ sung một hồ sơ người dùng mới trực tiếp từ bảng Quản trị
   */
  createUser(payload) {
    return api.post(`${API_URL}/users`, payload)
  }

  /**
   * Cập nhật điều chỉnh thông tin hồ sơ và phân vai trò cho người dùng
   */
  updateUser(id, payload) {
    return api.put(`${API_URL}/users/${id}`, payload)
  }

  /**
   * Xóa bỏ hồ sơ tài khoản vi phạm khỏi hệ thống
   */
  deleteUser(id) {
    return api.delete(`${API_URL}/users/${id}`)
  }

  // --------------------------------------------------------------------------
  // 2.2. NGHIỆP VỤ NHÂN KIỆN VÀ TỔ CHỨC CƠ VẬN HÀNH (STAFF & RBAC)
  // --------------------------------------------------------------------------
  /**
   * Tải danh sách các nhóm Quyền (Roles RBAC) khả dụng để quy định điều phối nhân sự
   */
  getAssignableRoles() {
    return api.get(`${API_URL}/staff/roles`)
  }

  /**
   * Cấp phát tài khoản Nhân sự điều phối mới (CSKH / Kế toán / Chuyên viên Kỹ thuật)
   */
  createStaff(payload) {
    return api.post(`${API_URL}/staff/create`, payload)
  }
}

// ============================================================================
// 3. XUẤT XƯỞNG DỊCH VỤ GIÁO NGHIỆP TÀI KHOẢN TOÀN CỤC (SINGLETON EXPORT)
// ============================================================================
export default new AdminUserService()
