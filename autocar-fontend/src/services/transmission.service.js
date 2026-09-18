// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH HỆ DI HI T H B (IMPORTS & CONFIG)
// ============================================================================
import axios from 'axios'

// Tuyến đường API quản lý định danh Hộp số Phương tiện (Số Sàn / Số Tự động)
const API_URL = 'https://autocar-citx.onrender.com/api/v1/admin/transmissions'

/**
 * Trình đóng gói Bearer Token vào Tiêu đề (Header) của yêu cầu HTTP
 */
const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
})

// ============================================================================
// 2. LỚP DỊCH VỤ TRUY TI N V V B B G CH B B K CH B M N N (TRANSMISSION SERVICE)
// ============================================================================
class TransmissionService {
  // --------------------------------------------------------------------------
  // 2.1. TRUY KẾT VÀ DI Đ H TR CH M L M (CRUD OPERATIONS)
  // --------------------------------------------------------------------------
  /**
   * Tải toàn bộ danh sách các loại hộp số khả dụng
   */
  getAll() {
    return axios.get(API_URL, getAuthHeader())
  }
  /**
   * Thêm mới định danh một kiểu hộp số vào từ điển kỹ thuật
   */
  create(data) {
    return axios.post(API_URL, data, getAuthHeader())
  }
  /**
   * Cập nhật thông số hoặc đặt lại tên hiển thị của loại hộp số
   */
  update(id, data) {
    return axios.put(`${API_URL}/${id}`, data, getAuthHeader())
  }
  /**
   * Xóa vĩnh viễn kiểu hộp số ra khỏi thư viện
   */
  delete(id) {
    return axios.delete(`${API_URL}/${id}`, getAuthHeader())
  }
}

// ============================================================================
// 3. XUẤT H G DI C V H CH TR DI M TO (SINGLETON EXPORT)
// ============================================================================
export default new TransmissionService()
