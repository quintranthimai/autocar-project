// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH TUYẾN ĐƯỜNG API (IMPORTS & CONFIG)
// ============================================================================
import axios from 'axios'

// Tuyến đường API trung gian quản trị Hệ thống Nhiên liệu (Xăng / Dầu / Điện / Hybrid)
const API_URL = 'https://autocar-citx.onrender.com/api/v1/admin/fuels'

/**
 * Trình đính kèm Bearer Token từ bộ nhớ LocalStorage vào Headers request
 */
const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
})

// ============================================================================
// 2. LỚP DỊCH VỤ NGHIỆP VỤ QUẢN TRỊ DANH MỤC NHIÊN LIỆU (FUEL SERVICE)
// ============================================================================
class FuelService {
  // --------------------------------------------------------------------------
  // 2.1. BỘ HỢP ĐỒNG HOẠT ĐỘNG THAO TÁC THƯ C X CH (CRUD OPERATIONS)
  // --------------------------------------------------------------------------
  /**
   * Truy xuất danh sách toàn bộ các danh mục Loại nhiên liệu trên hệ thống
   */
  getAll() {
    return axios.get(API_URL, getAuthHeader())
  }

  /**
   * Thêm mới một định nghĩa nhiên liệu vào hệ quản trị
   */
  create(data) {
    return axios.post(API_URL, data, getAuthHeader())
  }

  /**
   * Cập nhật thông số tiêu hao và nhãn hiệu của loại nhiên liệu
   */
  update(id, data) {
    return axios.put(`${API_URL}/${id}`, data, getAuthHeader())
  }

  /**
   * Xóa vĩnh viễn định nghĩa loại nhiên liệu ra khỏi kho lưu trữ
   */
  delete(id) {
    return axios.delete(`${API_URL}/${id}`, getAuthHeader())
  }
}

// ============================================================================
// 3. XUẤT THÀNH HOẠT ĐỘNG TRỤ SỞ DI M TR D C (SINGLETON EXPORT)
// ============================================================================
export default new FuelService()
