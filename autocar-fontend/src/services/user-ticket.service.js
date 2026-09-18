// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TUYẾN ĐƯỜNG GIAO THỨC (IMPORTS & CONFIG)
// ============================================================================
import api from '@/services/api'

// ============================================================================
// 2. LỚP DỊCH VỤ TRÌNH KHIẾU NẠI VÀ YÊU CẦU TRỢ GIÚP USER (USER TICKET SERVICE)
// ============================================================================
class UserTicketService {
  // --------------------------------------------------------------------------
  // 2.1. TRUY VẤN & GỬI TƯ K M S P CH TH (SUBMISSION & HISTORY)
  // --------------------------------------------------------------------------
  /**
   * Lấy danh sách khiếu nại của user
   */
  getMyTickets() {
    return api.get('/v1/web/tickets')
  }

  /**
   * Tạo khiếu nại mới
   * Sử dụng FormData để gửi kèm ảnh (nếu có)
   * payload: FormData object (chứa subject, content, booking_id, evidences[])
   */
  createTicket(formData) {
    return api.post('/v1/web/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}

// ============================================================================
// 3. XUẤT XƯỞNG DỊCH VỤ KHIẾU NẠI NGƯỜI DÙNG TOÀN CỤC (SINGLETON EXPORT)
// ============================================================================
export default new UserTicketService()
