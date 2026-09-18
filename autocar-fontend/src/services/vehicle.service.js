// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH GIAO THỨC TRUY KẾT (IMPORTS & CONFIG)
// ============================================================================
import axios from 'axios'

// Cấu hình đường dẫn Máy chủ API Cổng ngoài (Web Client Endpoint)
const BASE_URL = 'https://autocar-citx.onrender.com/api/v1/web'
const API_URL = `${BASE_URL}/vehicles`

/**
 * Trình hỗ trợ trích xuất Token Xác thực và dựng tiêu đề hợp lệ cho Axios
 */
const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
};

// ============================================================================
// 2. LỚP DỊCH VỤ TRUY BẮT VÀ NGHIỆP VỤ PHƯƠNG TIỆN (VEHICLE SERVICE)
// ============================================================================
class VehicleService {
    // --------------------------------------------------------------------------
    // 2.1. TRA CỨU, TÌM KIẾM VÀ TRỌN LỌC PHƯƠNG TIỆN (SEARCH & FETCH)
    // --------------------------------------------------------------------------
    /**
     * Tìm kiếm và lọc thông tin phương tiện công khai trên chợ thuê xe
     */
    searchVehicles(filters = {}) {
        return axios.get(`${BASE_URL}/search/vehicles`, {
            params: filters,
        });
    }
    
    /**
     * Lấy toàn bộ hồ sơ chi tiết, hình ảnh và thông số của xe theo mã số ID
     */
    getById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    // LẤY DỮ LIỆU ĐỔ VÀO DROPDOWN FORM ĐĂNG KÝ
    getFormOptions() {
        return axios.get(`${API_URL}/form-options`, getAuthHeader());
    }

    // --------------------------------------------------------------------------
    // 2.2. ĐĂNG TRẠI VÀ CHỈNH SỬA PHƯƠNG TIỆN CHỦ XE (PARTNER VEHICLE MANAGEMENT)
    // --------------------------------------------------------------------------
    /**
     * Đăng tải đơn khởi tạo xe mới của Chủ xe (Giao thức gửi Dữ liệu tệp đính kèm Multipart)
     */
    createVehicle(formData) {
        const config = getAuthHeader();
        config.headers['Content-Type'] = 'multipart/form-data';
        return axios.post(API_URL, formData, config);
    }

    // LẤY DANH SÁCH XE CỦA CHỦ XE ĐANG ĐĂNG NHẬP
    getMyVehicles() {
        return axios.get(`${BASE_URL}/partner/vehicles`, getAuthHeader());
    }

    /**
     * Cập nhật thông tin thông số và đơn giá của xe cho Khách hàng
     */
    updateVehicle(id, data) {
        return axios.put(`${BASE_URL}/partner/vehicles/${id}`, data, getAuthHeader());
    }

    // --------------------------------------------------------------------------
    // 2.3. ĐIỀU KHOẢN LỊCH TRÌNH & TRẠNG THÁI BẬN (BUSY DATES & MAINTENANCE)
    // --------------------------------------------------------------------------
    /**
     * Tải danh sách các ngày đã bị kén đặt hoặc tạm khóa lịch không cho thuê
     */
    getBusyDates(id) {
        return axios.get(`${BASE_URL}/partner/vehicles/${id}/busy-dates`, getAuthHeader());
    }

    /**
     * Khóa lịch cho thuê (Thiết lập mốc thời gian bận / Xe đi bảo dưỡng cá nhân)
     */
    addBusyDates(id, startDate, endDate) {
        return axios.post(`${BASE_URL}/partner/vehicles/${id}/busy-dates`, {
            start_date: startDate,
            end_date: endDate
        }, getAuthHeader());
    }

    /**
     * Mở khóa mốc ngày bận để đưa xe trở lại tình trạng sẵn sàng đón khách
     */
    removeBusyDate(id, date) {
        return axios.delete(`${BASE_URL}/partner/vehicles/${id}/busy-dates`, {
            ...getAuthHeader(),
            params: { date }
        });
    }

    /**
     * Đưa phương tiện thoát khỏi chu trình bảo trì, đưa lại lên Sàn giao dịch
     */
    restoreFromMaintenance(id) {
        return axios.post(`${API_URL}/${id}/restore`, {}, getAuthHeader());
    }
}

// ============================================================================
// 3. XUẤT TRUNG DIỄN DỊCH VỤ TRỤ SỞ TOÀN CỤC (SINGLETON EXPORT)
// ============================================================================
export default new VehicleService();