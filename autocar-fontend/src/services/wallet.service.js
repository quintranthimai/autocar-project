// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH TUYẾN ĐƯỜNG API (IMPORTS & CONFIG)
// ============================================================================
// XÓA dòng này: import axios from 'axios'
import api from '@/services/api' // Trỏ tới file cấu hình axios của bạn

// Tuyến đường API trung gian xử lý nghiệp vụ tài trợ Ví và Dòng tiền trang Web
const API_URL = '/v1/web/wallet'

// ============================================================================
// 2. LỚP DỊCH VỤ GIAO THỨC VÍ ĐIỆN TỬ VÀ SỔ QUY VẮT TRANG (WALLET SERVICE)
// ============================================================================
class WalletService {
  // --------------------------------------------------------------------------
  // 2.1. TRUY VẤN VÍ TÀI CHÍNH & NẠP RÚT SỐ DIỆN (BALANCE & TRANSACTIONS)
  // --------------------------------------------------------------------------
  /**
   * Truy xuất chi tiết số dư ví hiện hữu và trạng thái kích hoạt ví
   */
  getWallet() {
    return api.get(API_URL)
  }

  /**
   * Tạo lệnh nạp tiền vào ví điện tử thông qua các Cổng thanh toán trực tuyến (VNPAY / MoMo / PayOS)
   */
  deposit(payload) {
    return api.post(`${API_URL}/deposit`, payload)
  }

  /**
   * Gửi đơn đăng ký xin rút tiền về tài khoản ngân hàng liên kết của chủ ví
   */
  withdraw(payload) {
    return api.post(`${API_URL}/withdraw`, payload)
  }

  // --------------------------------------------------------------------------
  // 2.2. BÁO CÁO SAO KÊ HỘI TUYẾN GIAO DỊCH (HISTORY REPORTS)
  // --------------------------------------------------------------------------
  /**
   * Truy xuất tường trình lịch sử đơn yêu cầu rút tiền của tài khoản có phân trang
   */
  getWithdrawalHistory(page = 1, status = 'all', perPage = 10) {
    return api.get(`${API_URL}/withdrawals?page=${page}&status=${status}&per_page=${perPage}`)
  }

  /**
   * Truy xuất trọn bộ lịch sử biến động số dư và giao dịch thu chi tổng hợp
   */
  getTransactionHistory(page = 1, type = 'all', status = 'all', perPage = 10) {
    return api.get(`${API_URL}/transactions?page=${page}&type=${type}&status=${status}&per_page=${perPage}`)
  }
}

// ============================================================================
// 3. XUẤT XƯỞNG ĐỐI TƯỢNG TRUY VẤN TRƯỜNG TRÌNH VÍ (SINGLETON EXPORT)
// ============================================================================
export default new WalletService()
