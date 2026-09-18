// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH ĐỊNH TRÌNH API (IMPORTS & CONFIG)
// ============================================================================
import apiClient from './api';

// ============================================================================
// 2. LỚP DỊCH VỤ THỐNG KÊ BIỂU ĐỒ VÀ CHỈ T KI KI M H HI (DASHBOARD SERVICE)
// ============================================================================
class DashboardService {
    // --------------------------------------------------------------------------
    // 2.1. TRUY VẤN SỐ LIỆU TỔNG QUAN HỢP ĐI M H VÀ B BI (KPI & CHARTS)
    // --------------------------------------------------------------------------
    /**
     * Lấy dữ liệu KPI tổng quan cho Admin
     */
    async getSummary() {
        return await apiClient.get('/v1/admin/dashboard/summary');
    }

    /**
     * Lấy dữ liệu biểu đồ doanh thu theo năm
     * @param {number} year Năm cần xem thống kê (mặc định năm hiện tại)
     */
    async getChartData(year = new Date().getFullYear()) {
        return await apiClient.get(`/v1/admin/dashboard/chart?year=${year}`);
    }

    /**
     * Xuất dữ liệu báo cáo doanh thu ra file CSV
     * @param {number} year Năm cần xuất báo cáo
     */
    async exportReport(year = new Date().getFullYear()) {
        return await apiClient.get(`/v1/admin/dashboard/export?year=${year}`, {
            responseType: 'blob' // Trả về dạng file blob (binary)
        });
    }
}

// ============================================================================
// 3. XUẤT XƯỞNG DỊCH VỤ B Đ M THỐNG T TR TR T TO (SINGLETON EXPORT)
// ============================================================================
export default new DashboardService();
