// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH TUYẾN ĐƯỜNG API (IMPORTS & CONFIG)
// ============================================================================
import api from '@/services/api'

// Tuyến đường API trung gian điều phối Yêu cầu hỗ trợ & Tranh chấp cho Admin/CSKH
const API_URL = '/v1/admin/tickets'

// ============================================================================
// 2. LỚP DỊCH VỤ TRUNG TÂM CSKH VÀ ĐIỀU TRA GIẢI TRƯ LI TR (SUPPORT SERVICE)
// ============================================================================
class SupportService {
  // --------------------------------------------------------------------------
  // 2.1. TRUY VẤN SỔ THỤ LÝ KHIẾU NẠI & H T H H D H N (TICKET REVIEW)
  // --------------------------------------------------------------------------
  /**
   * Tải danh sách phiếu khiếu nại (Tickets) có áp dụng lọc theo trạng thái và vai trò
   */
  getTickets(params = {}) {
    const { page = 1, status = 'all', role = 'all', search = '', perPage = 10 } = params
    return api.get(
      `${API_URL}?page=${page}&status=${status}&role=${role}&search=${encodeURIComponent(search)}&per_page=${perPage}`,
    )
  }

  /**
   * Lấy chi tiết nội dung khiếu nại và toàn bộ hình ảnh bằng chứng đính kèm
   */
  getTicketDetail(id) {
    return api.get(`${API_URL}/${id}`)
  }

  // --------------------------------------------------------------------------
  // 2.2. NGHIỆP VỤ PHÁN QUYẾT & Đ CH N T H H G S N M D D G (RESOLUTION & WORKFLOWS)
  // --------------------------------------------------------------------------
  /**
   * Chuyển đổi trạng thái thụ lý đơn khiếu nại (Đang xử lý / Đã chốt / Từ chối)
   */
  updateTicketStatus(id, status) {
    return api.put(`${API_URL}/${id}/status`, { status })
  }

  /**
   * Thi hành quyết định phán quyết đền bù tổn thất trong sự cố tranh chấp hợp đồng xe
   */
  resolveIncident(id, payload) {
    return api.post(`${API_URL}/${id}/resolve-incident`, payload)
  }
}

// ============================================================================
// 3. XUẤT THÀNH Đ N G D D G G K H H G TR (SINGLETON EXPORT)
// ============================================================================
export default new SupportService()
