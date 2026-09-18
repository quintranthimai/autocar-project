// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH TUYẾN ĐƯỜNG API (IMPORTS & CONFIG)
// ============================================================================
import axios from 'axios'

// Tuyến đường API trung tâm quản lý danh mục Mẫu xe (Car Models & Brands)
const API_URL = 'https://autocar-citx.onrender.com/api/v1/admin/car-models'

/**
 * Trình trích xuất Token từ LocalStorage và dựng Headers xác thực cho Axios
 */
const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
})

// ============================================================================
// 2. LỚP DỊCH VỤ TRUY TẮT DANH MỤC THƯƠNG HIỆU VÀ MẪU XE (CAR MODEL SERVICE)
// ============================================================================
class CarModelService {
  // --------------------------------------------------------------------------
  // 2.1. TRUY KẾT VÀ HỢP TƯ N THÀNH VÌ CHI TIẾT (MODEL CRUD)
  // --------------------------------------------------------------------------
  /**
   * Tải toàn bộ danh sách các mẫu xe hiện hữu trong từ điển trang Admin
   */
  getAll() {
    return axios.get(API_URL, getAuthHeader())
  }

  /**
   * Khởi tạo mới một mẫu xe gắn liền với Thương hiệu sản xuất (Honda, Toyota, Tesla...)
   */
  create(data) {
    return axios.post(API_URL, data, getAuthHeader())
  }

  /**
   * Cập nhật thông số kỹ thuật hoặc quy đổi kiểu dáng xe
   */
  update(id, data) {
    return axios.put(`${API_URL}/${id}`, data, getAuthHeader())
  }

  /**
   * Loại bỏ mẫu xe ra khỏi danh bạ từ điển hệ thống
   */
  delete(id) {
    return axios.delete(`${API_URL}/${id}`, getAuthHeader())
  }

  // --------------------------------------------------------------------------
  // 2.2. TRUY KẾT TỪ Đ ĐẾN DANH HI M U K BIẾT (UNIQUE BRANDS)
  // --------------------------------------------------------------------------
  /**
   * Lọc và lấy danh sách độc bản các Hãng sản xuất xe (Unique Brands) để đổ vào Dropdown tìm kiếm
   */
  getUniqueBrands() {
    return axios.get(`${API_URL}/unique-brands`, getAuthHeader())
  }
}

// ============================================================================
// 3. XUẤT XƯỞNG DỊCH VỤ MẪU XE TRỤ SỞ TOÀN CỤC (SINGLETON EXPORT)
// ============================================================================
export default new CarModelService()
