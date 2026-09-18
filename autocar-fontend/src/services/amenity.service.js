// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH GIAO THỨC TRUY KẾT (IMPORTS & CONFIG)
// ============================================================================
import axios from 'axios';
// Đảm bảo import hàm lấy token của bạn vào đây
import { getAuthHeader } from '@/services/auth.service'; 

// Tuyến đường API trung gian quản trị Tiện nghi (Amenity) và Nhóm tiện nghi (Types)
const API_URL = 'https://autocar-citx.onrender.com/api/v1/admin/amenities';
const TYPES_URL = 'https://autocar-citx.onrender.com/api/v1/admin/amenity-types';

// ============================================================================
// 2. LỚP DỊCH VỤ QUẢN LÝ TIỆN NGHI PHƯƠNG TIỆN (AMENITY SERVICE)
// ============================================================================
class AmenityService {
    // --------------------------------------------------------------------------
    // 2.1. TRUY KẾT VÀ BẢO TRI CHI TIẾT TIỆN NGHI (AMENITY CRUD)
    // --------------------------------------------------------------------------
    /**
     * Tải trọn bộ danh sách các tiện nghi (Wifi, Camera hành trình, GPS, Cửa sổ trời...)
     */
    getAmenities() {
        return axios.get(API_URL, getAuthHeader());
    }

    /**
     * Tải danh sách phân loại nhóm tiện nghi (An toàn / Giải trí / Ngoại thất)
     */
    getAmenityTypes() {
        return axios.get(TYPES_URL, getAuthHeader());
    }

    /**
     * Thêm mới một tiện nghi xe vào thư viện hệ thống
     */
    createAmenity(data) {
        return axios.post(API_URL, data, getAuthHeader());
    }

    /**
     * Cập nhật thông số và biểu tượng tượng trưng cho tiện nghi
     */
    updateAmenity(id, data) {
        return axios.put(`${API_URL}/${id}`, data, getAuthHeader());
    }

    /**
     * Xóa tiện nghi ra khỏi thư viện (Áp dụng khi không còn xe nào ràng buộc)
     */
    deleteAmenity(id) {
        return axios.delete(`${API_URL}/${id}`, getAuthHeader());
    }

    // --------------------------------------------------------------------------
    // 2.2. TRUY KẾT VÀ BẢO TRI NHÓM PHÂN TIỆN TIỆN NGHI (AMENITY TYPE CRUD)
    // --------------------------------------------------------------------------
    /**
     * Khởi tạo nhóm tiện nghi mới
     */
    createAmenityType(data) {
        return axios.post(TYPES_URL, data, getAuthHeader());
    }

    /**
     * Chỉnh sửa tên và thông tin Mô tả của nhóm tiện nghi
     */
    updateAmenityType(id, data) {
        return axios.put(`${TYPES_URL}/${id}`, data, getAuthHeader());
    }

    /**
     * Xóa nhóm tiện nghi khỏi hệ thống
     */
    deleteAmenityType(id) {
        return axios.delete(`${TYPES_URL}/${id}`, getAuthHeader());
    }
}

// ============================================================================
// 3. XUẤT XƯỞNG DỊCH VỤ CHI TIẾT TIỆN NGHI TOÀN CỤC (SINGLETON EXPORT)
// ============================================================================
export default new AmenityService();