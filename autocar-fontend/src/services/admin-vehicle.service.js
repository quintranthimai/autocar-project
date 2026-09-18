// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH TUYẾN ĐƯỜNG API (IMPORTS & CONFIG)
// ============================================================================
import api from '@/services/api';

// Tuyến đường API trung tâm quản trị danh sách Xe và Kiểm duyệt Sàn giao dịch
const API_URL = '/v1/admin/vehicles';

// ============================================================================
// 2. LỚP DỊCH VỤ KIỂM ĐỊNH VÀ QUẢN LÝ PHƯƠNG TIỆN ADMIN (ADMIN VEHICLE SERVICE)
// ============================================================================
class AdminVehicleService {
    // --------------------------------------------------------------------------
    // 2.1. TRUY VẤN VÀ TÍNH TỔNG QUAN PHƯƠNG TIỆN (FETCH & DETAILS)
    // --------------------------------------------------------------------------
    /**
     * Tải trang danh sách xe tổng thể trên Sàn có lọc theo trạng thái duyệt và từ khóa
     */
    getVehicles(page = 1, status = 'all', search = '') {
        return api.get(`${API_URL}?page=${page}&status=${status}&search=${search}`);
    }

    /**
     * Lấy tường trình chuyên sâu của xe bao gồm chứng từ GPLX, đăng kiểm và giấy phép kinh doanh
     */
    getVehicleDetail(id) {
        return api.get(`${API_URL}/${id}`);
    }

    // --------------------------------------------------------------------------
    // 2.2. QUY VÌ PHÊ DUYỆT & TRÌNH TRỊ VỤ ĐỘC CẢI BẢO HOÀN (APPROVAL & LOCKING)
    // --------------------------------------------------------------------------
    /**
     * Duyệt chấp thuận hồ sơ, chính thức đưa phương tiện niêm yết lên hệ thống
     */
    approveVehicle(id) {
        return api.put(`${API_URL}/${id}/approve`);
    }

    /**
     * Từ chối đơn xin niêm yết do hồ sơ lỗi hoặc vi phạm tiêu chuẩn kỹ thuật
     */
    rejectVehicle(id, reason) {
        return api.put(`${API_URL}/${id}/reject`, { reason });
    }

    /**
     * Khóa xe khẩn cấp không cho thuê khi có phát sinh khiếu nại nghiêm trọng hoặc bảo lưu tranh chấp
     */
    lockVehicle(id, reason) {
        return api.put(`${API_URL}/${id}/lock`, { reason });
    }

    /**
     * Mở khóa xe, phục hồi uy tín và quyền kinh doanh cho phương tiện
     */
    unlockVehicle(id) {
        return api.put(`${API_URL}/${id}/unlock`);
    }
}

// ============================================================================
// 3. XUẤT XƯỞNG ĐỐI TƯỢNG TRUY THU GIAO Đ TOÀN CỤC (SINGLETON EXPORT)
// ============================================================================
export default new AdminVehicleService();