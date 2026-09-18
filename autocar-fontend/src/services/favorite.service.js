// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH TUYẾN ĐƯỜNG GIAO THỨC (IMPORTS & CONFIG)
// ============================================================================
import axios from 'axios';

// Tuyến đường gốc của Máy chủ API
const API_URL = 'https://autocar-citx.onrender.com/api';

/**
 * Trình trích xuất Token từ LocalStorage và dựng tiêu đề hợp lệ cho Axios
 */
const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return {
        headers: { 'Authorization': `Bearer ${token}` }
    };
};

// ============================================================================
// 2. LỚP DỊCH VỤ ĐIỀU TRÌNH TRUY B KH PH Ư PH Ư (FAVORITE SERVICE)
// ============================================================================
class FavoriteService {
    // --------------------------------------------------------------------------
    // 2.1. TRUY XUẤT DANH SÁCH VÀ CHI T TI M KH (FETCH & TOGGLE)
    // --------------------------------------------------------------------------
    // Lấy danh sách toàn bộ phương tiện đã yêu thích
    getMyFavorites() {
        return axios.get(`${API_URL}/v1/web/favorites`, getAuthHeader());
    }

    // Lấy mảng ID các xe đã yêu thích (phục vụ hiển thị tim đỏ trên danh sách/chi tiết)
    getFavoriteIds() {
        return axios.get(`${API_URL}/v1/web/favorites/ids`, getAuthHeader());
    }

    // Thêm hoặc xoá xe khỏi danh sách yêu thích
    toggleFavorite(vehicleId) {
        return axios.post(`${API_URL}/v1/web/favorites/${vehicleId}/toggle`, {}, getAuthHeader());
    }
}

// ============================================================================
// 3. XUẤT XƯỞNG DỊCH VỤ K TR G KH D M V (SINGLETON EXPORT)
// ============================================================================
export default new FavoriteService();
