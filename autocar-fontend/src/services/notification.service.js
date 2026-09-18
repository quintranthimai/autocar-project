// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TUYẾN ĐƯỜNG GIAO THỨC (IMPORTS & CONFIG)
// ============================================================================
import api from './api';

// ============================================================================
// 2. LỚP DỊCH VỤ QUẢN TRỊ THÔNG BÁO VÀ HỘP THƯ HỆ THỐNG (NOTIFICATION SERVICE)
// ============================================================================
class NotificationService {
    // --------------------------------------------------------------------------
    // 2.1. TRUY KẾT TRUY BỘ DANH SA VÀ CH N S H B G (LIST & COUNTS)
    // --------------------------------------------------------------------------
    /**
     * Tải danh sách các thông báo mới nhất gửi đến tài khoản (giới hạn mặc định 20 bản tin)
     */
    getNotifications(limit = 20) {
        return api.get('/v1/web/notifications', { params: { limit } });
    }

    /**
     * Lấy số lượng huy hiệu thông báo chưa đọc (Unread Badge Count) hiển thị trên quả chuông
     */
    getUnreadCount() {
        return api.get('/v1/web/notifications/unread-count');
    }

    // --------------------------------------------------------------------------
    // 2.2. XỬ LÝ TR N N G S TR T KI TIẾP N KI Đ B G (STATUS UPDATES)
    // --------------------------------------------------------------------------
    markAsRequest(id) { // Not used directly, but keep similar pattern if I need to rename
        return api.post(`/v1/web/notifications/${id}/read`);
    }

    /**
     * Đánh dấu một bản tin thông báo là Đã Đọc (Mark as Read)
     */
    markAsRead(id) {
        return api.post(`/v1/web/notifications/${id}/read`);
    }

    /**
     * Đồng loạt đánh dấu toàn bộ hộp thư thông báo là Đã đọc
     */
    markAllAsRead() {
        return api.post('/v1/web/notifications/read-all');
    }
}

// ============================================================================
// 3. XUẤT XƯỞNG ĐỐI TƯỢNG H T H N THÔNG BÁO TOÀN CỤC (SINGLETON EXPORT)
// ============================================================================
export default new NotificationService();
