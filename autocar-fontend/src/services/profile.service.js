// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH GIAO THỨC TRUY TRONG (IMPORTS & CONFIG)
// ============================================================================
import axios from 'axios';

// Tuyến đường gốc của Máy chủ API
const API_URL = 'https://autocar-citx.onrender.com/api';

// Hàm tiện ích lấy Token từ localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return { 
        headers: { 'Authorization': `Bearer ${token}` } 
    };
};

// ============================================================================
// 2. LỚP DỊCH VỤ QUẢN TRỊ HỒ SƠ & TRẠNG THÁI TÀI KHOẢN (PROFILE SERVICE)
// ============================================================================
class ProfileService {
    // --------------------------------------------------------------------------
    // 2.1. TRUY VẤN VÀ ĐIỀU CHỈNH THÔNG TIN CHI TIẾT HỒ SƠ (GENERAL PROFILE)
    // --------------------------------------------------------------------------
    
    /**
     * Lấy thông tin tổng quan của User (bao gồm Ví và CCCD/GPLX)
     * @returns {Promise} Dữ liệu người dùng
     */
    getMe() {
        return axios.get(`${API_URL}/auth/me`, getAuthHeader());
    }

    /**
     * Cập nhật thông tin chữ (Name, Phone, Email)
     * @param {Object} dataPayload - Dữ liệu cập nhật
     * @returns {Promise} Kết quả cập nhật
     */
    updateProfile(dataPayload) {
        return axios.put(`${API_URL}/v1/web/profile/update`, dataPayload, getAuthHeader());
    }

    /**
     * Cập nhật Avatar (File)
     * @param {FormData} formData - Dữ liệu ảnh dưới dạng FormData
     * @returns {Promise} Kết quả upload
     */
    updateAvatar(formData) {
        const config = getAuthHeader();
        config.headers['Content-Type'] = 'multipart/form-data';
        return axios.post(`${API_URL}/v1/web/profile/update-avatar`, formData, config);
    }

    // --------------------------------------------------------------------------
    // 2.2. QUYỀN MẬT TRONG VIỆC GỠ BỎ TÀI KHOẢN (ACCOUNT UPGRADE & REMOVAL)
    // --------------------------------------------------------------------------
    
    /**
     * Xóa tài khoản
     * @returns {Promise} Trạng thái xóa
     */
    deleteAccount() {
        return axios.delete(`${API_URL}/v1/web/profile/delete`, getAuthHeader());
    }

    /**
     * Nâng cấp tài khoản thành chủ xe
     * @returns {Promise} Trạng thái nâng cấp
     */
    upgradeToOwner() {
        return axios.post(`${API_URL}/v1/web/profile/upgrade-to-owner`, {}, getAuthHeader()); 
    }
}

// ============================================================================
// 3. XUẤT THÀNH ĐỐI TƯỢNG ĐỂ DÙNG TRONG HỆ THỐNG (SINGLETON EXPORT)
// ============================================================================
export default new ProfileService();