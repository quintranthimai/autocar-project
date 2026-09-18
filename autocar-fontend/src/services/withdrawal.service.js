// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH TUYẾN ĐƯỜNG API (IMPORTS & CONFIG)
// ============================================================================
import api from '@/services/api'

// Tuyến đường API trung tâm xử lý phê duyệt giao dịch Rút tiền trên cổng Admin
const API_URL = '/v1/admin/withdrawals'

// ============================================================================
// 2. LỚP DỊCH VỤ KIỂM DUYỆT VÀ TÍNH TRANG GIAO Đ CH RÚT TIỀN (WITHDRAWAL SERVICE)
// ============================================================================
class WithdrawalService {
  // --------------------------------------------------------------------------
  // 2.1. TRUY VẤN SỐ LIỆU VÀ GIAO TÁC KIỂM DUYỆT (LIST & REVIEW)
  // --------------------------------------------------------------------------
  /**
   * Lấy danh sách các đơn đăng ký rút tiền từ Đối tác/Khách hàng có bộ lọc trạng thái & từ khóa
   */
  getWithdrawals(params = {}) {
    const { page = 1, status = 'all', search = '', perPage = 10 } = params
    return api.get(
      `${API_URL}?page=${page}&status=${status}&search=${encodeURIComponent(search)}&per_page=${perPage}`,
    )
  }

  /**
   * Xác nhận phê duyệt đơn rút tiền (Đã chuyển khoản thành công ngoài ngân hàng)
   */
  approve(id) {
    return api.post(`${API_URL}/${id}/approve`)
  }

  /**
   * Từ chối lệnh rút tiền kèm theo chú ý rõ lý do hoàn trả lại số dư vào Ví
   */
  reject(id, reason) {
    return api.post(`${API_URL}/${id}/reject`, { reason })
  }
}

// ============================================================================
// 3. XUẤT XƯỞNG ĐỐI TƯỢNG DUYỆT TRÍCH TRÚ RÚT TIỀN (SINGLETON EXPORT)
// ============================================================================
export default new WithdrawalService()
