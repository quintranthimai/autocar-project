// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH TUYẾN ĐƯỜNG API (IMPORTS & CONFIG)
// ============================================================================
import axios from 'axios';

// Đường dẫn API trung gian xử lý nghiệp vụ Phân khúc và Danh mục Phương tiện
const API_URL = 'https://autocar-citx.onrender.com/api/v1/admin/categories';

// Hàm lấy Token từ LocalStorage để đính kèm vào Header
const getAuthHeader = () => {
    // Lưu ý: Đảm bảo 'authToken' đúng với tên biến bạn đang dùng để lưu token khi đăng nhập nhé
    const token = localStorage.getItem('authToken'); 
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

// ============================================================================
// 2. LỚP DỊCH VỤ QUẢN LÝ PHÂN KHÚC VÀ LOẠI PHƯƠNG TIỆN (CATEGORY SERVICE)
// ============================================================================
class CategoryService {
    // --------------------------------------------------------------------------
    // 2.1. BỘ CÔNG CỤ TRUY XUẤT VÀ BẢO TRÌ (CRUD OPERATIONS)
    // --------------------------------------------------------------------------
    /**
     * Lấy danh sách tất cả các phân khúc.
     * @returns {Promise} Kết quả trả về từ API.
     */
    getAllCategories() {
        return axios.get(API_URL, getAuthHeader());
    }

    /**
     * Thêm mới một phân khúc.
     * @param {Object} data Dữ liệu phân khúc cần thêm.
     * @returns {Promise} Kết quả trả về từ API.
     */
    createCategory(data) {
        return axios.post(API_URL, data, getAuthHeader());
    }

    /**
     * Xóa một phân khúc theo ID.
     * @param {string|number} id ID của phân khúc cần xóa.
     * @returns {Promise} Kết quả trả về từ API.
     */
    deleteCategory(id) {
        return axios.delete(`${API_URL}/${id}`, getAuthHeader());
    }

    /**
     * Cập nhật thông tin phân khúc.
     * @param {string|number} id ID của phân khúc cần cập nhật.
     * @param {Object} data Dữ liệu cập nhật mới.
     * @returns {Promise} Kết quả trả về từ API.
     */
    updateCategory(id, data) {
        return axios.put(`${API_URL}/${id}`, data, getAuthHeader());
    }
}

// ============================================================================
// 3. XUẤT XƯỞNG DỊCH VỤ ĐỐI TƯỢNG TOÀN CỤC (SINGLETON EXPORT)
// ============================================================================
export default new CategoryService();