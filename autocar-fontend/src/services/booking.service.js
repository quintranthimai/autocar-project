// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & ĐỊNH NGHĨA GIAO THỨC TRUY CẬP API (IMPORTS)
// ============================================================================
import api from '@/services/api'

// Đường dẫn gốc điều phối các yêu cầu giao dịch đặt xe cho phía người dùng Cổng ngoài
const API_URL = '/v1/web/bookings'

// ============================================================================
// 2. LỚP DỊCH VỤ NGHIỆP VỤ QUẢN LÝ ĐẶT THUÊ PHƯƠNG TIỆN (BOOKING SERVICE)
// ============================================================================
class BookingService {
  // --------------------------------------------------------------------------
  // 2.1. TÍNH TOÁN HÓA ĐƠN & KHỞI TẠO GIAO DỊCH (CHECKOUT & CREATE)
  // --------------------------------------------------------------------------
  /**
   * Tính toán trước chi phí chuyến đi, bảo hiểm và áp dụng voucher ưu đãi
   */
  calculatePrice(payload) {
    return api.post(`${API_URL}/calculate-price`, payload)
  }

  /**
   * Khởi tạo một đơn yêu cầu thuê xe mới từ khách hàng
   */
  createBooking(payload) {
    return api.post(API_URL, payload)
  }

  /**
   * Truy xuất danh sách lịch sử chuyến đi cá nhân của Khách thuê (Renter)
   */
  getMyBookings() {
    return api.get('/v1/web/bookings/my-bookings')
  }

  // --------------------------------------------------------------------------
  // 2.2. HỆ THỐNG QUẢN TRỊ TRUNG TÂM & GIÁO NGHIỆP VỤ ADMIN (ADMIN OPERATIONS)
  // --------------------------------------------------------------------------
  /**
   * Truy xuất tổng thể các đơn đặt xe toàn hệ thống cho Admin / CSKH điều phối
   */
  getAllBookings(page = 1, status = 'all', search = '', date = '') {
    return api.get(`/v1/admin/bookings?page=${page}&status=${status}&search=${encodeURIComponent(search)}&date=${date}`)
  }

  /**
   * Cập nhật trạng thái đơn đặt xe trực tiếp từ cổng Quản trị (Duyệt / Khóa / Cập nhật mốc)
   */
  updateBookingStatus(id, status) {
    return api.put(`/v1/admin/bookings/${id}/status`, { status })
  }

  /**
   * Lấy tường trình chi tiết của một đơn đặt xe phục vụ công tác giám định Admin
   */
  getAdminBookingDetail(id) {
    return api.get(`/v1/admin/bookings/${id}`)
  }

  /**
   * Lấy lịch sử biến động dòng tiền và sổ chi thu toàn cục hệ thống cho Admin
   */
  getAllTransactions(page = 1, type = 'all', search = '', fromDate = '', toDate = '') {
    return api.get(`/v1/admin/transactions?page=${page}&type=${type}&search=${search}&from_date=${fromDate}&to_date=${toDate}`)
  }

  // --------------------------------------------------------------------------
  // 2.3. CHI TIẾT CHIẾN THẦN THUÊ & ĐIỀU CHÍNH HỢP DỒNG (USER TRIP DETAILS)
  // --------------------------------------------------------------------------
  /**
   * Truy xuất hồ sơ chi tiết chuyến đi theo ID cho Khách thuê hoặc Chủ xe
   */
  getBookingDetail(id) {
    return api.get(`/v1/web/bookings/${id}`)
  }

  /**
   * Hàm bí danh (Alias) gọi lại getBookingDetail, duy trì khả năng tương thích mã cũ
   */
  show(id) {
    return this.getBookingDetail(id)
  }

  /**
   * Xác nhận đồng ý chuyến đi (Khớp lệnh từ phía Chủ xe)
   */
  approve(id) {
    return api.post(`/v1/web/bookings/${id}/approve`)
  }

  /**
   * Từ chối chuyến đi và hoàn tiền cọc về tài khoản cho Khách
   */
  reject(id, payload) {
    return api.post(`/v1/web/bookings/${id}/reject`, payload)
  }

  /**
   * Tiến hành tất toán tiền cọc hoặc thanh toán đầy đủ đơn đặt xe
   */
  payBooking(id, payload) {
    return api.post(`/v1/web/bookings/${id}/pay`, payload)
  }

  // THÊM HÀM MỚI Ở ĐÂY: Gọi API lấy mã giảm giá
  getAvailablePromos() {
    return api.get('/v1/web/vouchers/available')
  }

  // --------------------------------------------------------------------------
  // 2.4. NGHIỆP VỤ ĐIỀU PHỐI ĐỐI TÁC CHỦ XE (OWNER / PARTNER PORTAL)
  // --------------------------------------------------------------------------
  /**
   * Lấy danh sách thông báo và đơn yêu cầu đặt xe đang chờ xử lý từ khách
   */
  getOwnerRequests() {
    return api.get('/v1/web/partner/requests')
  }

  // Lấy danh sách lịch trình chuyến đi của Chủ xe
  getOwnerBookings() {
    return api.get('/v1/web/partner/bookings')
  }

  // Chủ xe xác nhận bàn giao xe
  handoverVehicle(id) {
    return api.post(`/v1/web/partner/bookings/${id}/handover`)
  }

  /**
   * Chủ xe xác nhận phê duyệt hợp đồng thuê xe của khách
   */
  approveBooking(id) {
    return api.post(`/v1/web/bookings/${id}/approve`)
  }

  /**
   * Chủ xe hủy từ chối nhận chuyến kèm nguyên nhân lý do
   */
  rejectBooking(id, data) {
    return api.post(`/v1/web/bookings/${id}/reject`, data)
  }

  // Chủ xe xác nhận nhận lại xe (Hoàn thành)
  completeTrip(id) {
    return api.post(`/v1/web/partner/bookings/${id}/complete`)
  }

  // --------------------------------------------------------------------------
  // 2.5. QUY VÌ DUY QUẢN HỦY VÀ HOÀN TRẢ CHI TRANG (CANCEL WORKFLOWS)
  // --------------------------------------------------------------------------
  // Khách thuê hủy chuyến
  cancelBooking(id, payload) {
    return api.post(`/v1/web/bookings/${id}/cancel`, payload)
  }

  /**
   * Chủ xe chủ động hủy đơn trong tình huống khẩn cấp (kèm hình ảnh chứng từ đính kèm)
   */
  cancelByOwner(id, formData) {
    return api.post(`/v1/web/bookings/${id}/cancel-by-owner`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
  }
}

// ============================================================================
// 3. XUẤT THÀNH TRUNG CHI TR TRỪ DỊCH VỤ TRUNG TÂM (SINGLETON EXPORT)
// ============================================================================
export default new BookingService()
