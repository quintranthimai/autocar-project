<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 class="fs-3 mb-1 fw-bold text-dark">Quản lý phương tiện</h1>
                    <p class="mb-0 text-muted">Quản lý danh sách xe, phê duyệt hoặc khóa xe vi phạm</p>
                </div>
            </div>

            <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                <div class="input-group" style="max-width: 320px;">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="fas fa-search"></i></span>
                    <input type="text" class="form-control border-start-0 ps-0" placeholder="Tìm biển số, VIN, chủ xe..." v-model="searchQuery" @input="debounceSearch">
                </div>
                <div class="d-flex gap-2">
                    <select class="form-select text-muted" v-model="statusFilter" @change="fetchVehicles(1)">
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Đang chờ duyệt</option>
                        <option value="available">Sẵn sàng thuê</option>
                        <option value="rented">Đang cho thuê</option>
                        <option value="maintenance">Đang bảo trì</option>
                        <option value="locked">Bị khóa (Vi phạm)</option>
                        <!-- Thêm bộ lọc Từ chối vào đây -->
                        <option value="rejected">Bị từ chối</option>
                    </select>
                </div>
            </div>

            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
            </div>

            <div v-else class="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light text-muted small fw-semibold">
                            <tr>
                                <th class="px-4 py-3">Mã xe</th>
                                <th class="py-3">Xe</th>
                                <th class="py-3">Chủ xe</th>
                                <th class="py-3">Biển kiểm soát</th>
                                <th class="py-3">Trạng thái</th>
                                <th class="py-3 text-end pe-4">Hành động</th>
                            </tr>
                        </thead>
                        <tbody class="border-top-0">
                            <tr v-for="vehicle in vehicles" :key="vehicle.id">
                                <td class="px-4 py-3 fw-bold text-secondary">
                                    X{{ vehicle.id }}
                                </td>
                                <td class="py-3 fw-bold text-dark text-uppercase">
                                    {{ vehicle.car_model?.brand_name }} {{ vehicle.car_model?.model_name }} {{ vehicle.year }}
                                </td>
                                <td class="py-3">
                                    <div class="text-dark fw-semibold">{{ vehicle.owner?.name }}</div>
                                    <div class="text-muted small">{{ vehicle.owner?.phone }}</div>
                                </td>
                                <td class="py-3 text-uppercase fw-bold text-primary">{{ vehicle.license_plate }}</td>
                                <td class="py-3">
                                    <!-- Cập nhật toàn bộ Badges cho đồng bộ với trang chi tiết -->
                                    <span v-if="vehicle.status === 'pending'" class="badge bg-warning text-dark"><i class="fas fa-clock me-1"></i>Chờ duyệt</span>
                                    <span v-else-if="vehicle.status === 'available'" class="badge bg-success"><i class="fas fa-check me-1"></i>Sẵn sàng</span>
                                    <span v-else-if="vehicle.status === 'rented'" class="badge bg-info"><i class="fas fa-car-side me-1"></i>Đang thuê</span>
                                    <span v-else-if="vehicle.status === 'locked'" class="badge bg-danger"><i class="fas fa-lock me-1"></i>Bị khóa</span>
                                    
                                    <!-- Bổ sung 2 trạng thái còn thiếu -->
                                    <span v-else-if="vehicle.status === 'rejected'" class="badge border border-danger text-danger bg-danger bg-opacity-10"><i class="fas fa-ban me-1"></i>Từ chối</span>
                                    <span v-else-if="vehicle.status === 'maintenance'" class="badge bg-secondary"><i class="fas fa-tools me-1"></i>Bảo trì</span>
                                    
                                    <span v-else class="badge bg-secondary">{{ vehicle.status }}</span>
                                </td>
                                <td class="py-3 text-end pe-4">
                                    <router-link :to="`/admin/vehicles/${vehicle.id}`" class="btn btn-sm btn-outline-primary fw-semibold rounded-pill">
                                        Xem chi tiết
                                    </router-link>
                                </td>
                            </tr>
                            <tr v-if="vehicles.length === 0">
                                <td colspan="6" class="text-center py-4 text-muted">Không tìm thấy xe nào.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div v-if="totalPages > 1" class="card-footer bg-white border-top p-3 d-flex justify-content-end">
                    <ul class="pagination pagination-sm mb-0">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <a class="page-link cursor-pointer" @click="fetchVehicles(currentPage - 1)">Trang trước</a>
                        </li>
                        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                            <a class="page-link cursor-pointer" @click="fetchVehicles(page)">{{ page }}</a>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <a class="page-link cursor-pointer" @click="fetchVehicles(currentPage + 1)">Trang sau</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TỰA ĐỂ DỊCH VỤ ADMIN (IMPORTS)
// ============================================================================
import { ref, onMounted } from 'vue';
import adminVehicleService from '@/services/admin-vehicle.service';

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI & BỘ QUẢN TRI DANH SÁCH Ô TÔ (STATE MANAGEMENT)
// ============================================================================
const vehicles = ref([]);          // Danh sách xe hiện thị trong bảng quản trị
const loading = ref(true);         // Cờ hiển thị hiệu ứng đang tải danh sách
const currentPage = ref(1);        // Trang hiện tại
const totalPages = ref(1);         // Tổng số trang phân cụm
const statusFilter = ref('all');   // Bộ lọc theo trạng thái xe (Sẵn sàng, Đang chờ, Khóa...)
const searchQuery = ref('');       // Từ khóa tìm kiếm xe theo Biển số, Tên hoặc SĐT Chủ xe
let searchTimeout = null;          // Biến quản lý hẹn giờ trì hoãn tra cứu

// ============================================================================
// 3. ĐẦU NỐI API TRUY NỘI DANH SÁCH PHƯƠNG TIỆN TOÀN SÀN (API HYDRATION)
// ============================================================================
/**
 * Tải danh sách xe ô tô toàn hệ thống từ Backend có đi kèm bộ lọc và từ khóa
 */
const fetchVehicles = async (page = 1) => {
    loading.value = true;
    try {
        const res = await adminVehicleService.getVehicles(page, statusFilter.value, searchQuery.value);
        if (res.data.success) {
            vehicles.value = res.data.data.data;
            currentPage.value = res.data.data.current_page;
            totalPages.value = res.data.data.last_page;
        }
    } catch (error) {
        console.error("Lỗi lấy danh sách xe:", error);
    } finally {
        loading.value = false;
    }
};

// ============================================================================
// 4. TRÌNH TRÌ HOÃN TRUY VẤN KIẾM CỨU (DEBOUNCED SEARCH)
// ============================================================================
/**
 * Trì hoãn gửi yêu cầu tìm kiếm 500ms khi Admin nhập dữ liệu vào ô tra cứu
 */
const debounceSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        fetchVehicles(1);
    }, 500);
};

// ============================================================================
// 5. MÓC DẪN VÒNG ĐỜI KHỞI ĐỤNG HỆ THỐNG (LIFECYCLE HOOKS)
// ============================================================================
onMounted(() => {
    fetchVehicles();
});
</script>
