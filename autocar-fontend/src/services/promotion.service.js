// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH TUYẾN ĐƯỜNG API (IMPORTS & CONFIG)
// ============================================================================
import api from '@/services/api';

// Tuyến đường API trung tâm quản trị Chiến dịch & Mã giảm giá (Vouchers)
const API_URL = '/v1/admin/vouchers';

// ============================================================================
// 2. LỚP DỊCH VỤ QUẢN LÝ MÃ KHUYẾN MÃI ADMIN (ADMIN PROMOTION SERVICE)
// ============================================================================
class PromotionService {
    /**
     * Tải danh sách mã giảm giá có hỗ trợ phân trang, lọc theo trạng thái và từ khóa
     */
    getVouchers(page = 1, status = 'all', search = '') {
        return api.get(`${API_URL}?page=${page}&status=${status}&search=${encodeURIComponent(search)}`);
    }

    /**
     * Lấy chi tiết thông tin một mã giảm giá và chiến dịch đi kèm
     */
    getVoucherDetail(id) {
        return api.get(`${API_URL}/${id}`);
    }

    /**
     * Phát hành mới một mã giảm giá cùng chiến dịch marketing
     */
    createVoucher(data) {
        return api.post(API_URL, data);
    }

    /**
     * Cập nhật thông tin mã giảm giá hoặc gia hạn thời gian chiến dịch
     */
    updateVoucher(id, data) {
        return api.put(`${API_URL}/${id}`, data);
    }

    /**
     * Xóa vĩnh viễn hoặc khóa hủy hiệu lực mã giảm giá
     */
    deleteVoucher(id) {
        return api.delete(`${API_URL}/${id}`);
    }
}

// ============================================================================
// 3. XUẤT XƯỞNG ĐỐI TƯỢNG DỊCH VỤ TOÀN CỤC (SINGLETON EXPORT)
// ============================================================================
export default new PromotionService();
