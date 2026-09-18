<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">

            <div class="row">
                <div class="col-12">
                    <div
                        class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                        <div>
                            <h1 class="fs-3 mb-1 fw-bold text-dark">Duyệt hồ sơ eKYC</h1>
                            <p class="mb-0 text-muted">Quản lý và xét duyệt các yêu cầu định danh tài khoản từ người
                                dùng</p>
                        </div>
                        <div>
                            <button @click="fetchList" class="btn btn-primary fw-bold shadow-sm px-4 py-2 rounded-3">
                                <i class="fas fa-sync-alt me-2"></i>Làm mới
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                        <div class="input-group shadow-sm rounded-3 overflow-hidden" style="max-width: 320px;">
                            <span class="input-group-text bg-white border-end-0 text-muted">
                                <i class="fas fa-search"></i>
                            </span>
                            <input type="text" class="form-control border-start-0 ps-0"
                                placeholder="Tìm theo tên, email, CCCD...">
                        </div>

                        <div class="d-flex gap-2 flex-wrap">
                            <select v-model="filterStatus" @change="fetchList" class="form-select text-muted shadow-sm"
                                style="width: auto;">
                                <option value="pending">Đang chờ duyệt</option>
                                <option value="approved">Đã duyệt</option>
                                <option value="rejected">Bị từ chối</option>
                            </select>
                            <button class="btn btn-white border bg-white shadow-sm fw-semibold">
                                <i class="fas fa-filter me-1"></i> Bộ lọc
                            </button>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light text-muted small fw-semibold">
                                    <tr>
                                        <th class="px-4 py-3">Người dùng / ID</th>
                                        <th class="py-3">Email liên hệ</th>
                                        <th class="py-3">Tài liệu</th>
                                        <th class="py-3">Ngày nộp</th>
                                        <th class="py-3">Trạng thái</th>
                                        <th class="px-4 py-3 text-end">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody class="border-top-0">

                                    <tr v-if="loading">
                                        <td colspan="6" class="text-center py-5 text-muted">
                                            <span class="spinner-border spinner-border-sm me-2"></span> Đang tải dữ
                                            liệu...
                                        </td>
                                    </tr>

                                    <tr v-else-if="kycList.length === 0">
                                        <td colspan="6" class="text-center py-5 text-muted fw-semibold">
                                            Không có hồ sơ nào trong trạng thái này.
                                        </td>
                                    </tr>

                                    <tr v-else v-for="item in kycList" :key="item.id">
                                        <td class="px-4 py-3">
                                            <h6 class="mb-1 fw-bold text-dark">{{ item.user_name }}</h6>
                                            <span
                                                class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 fs-6 font-monospace py-1 shadow-sm">
                                                ID: #{{ item.id }}
                                            </span>
                                        </td>

                                        <td class="py-3">
                                            <span class="text-dark fw-semibold fs-6">{{ item.user_email }}</span>
                                        </td>

                                        <td>
                                            <!-- Nếu là Căn cước công dân -->
                                            <span v-if="item.document_type === 'id_card'"
                                                class="badge bg-primary bg-opacity-10 text-primary px-2 py-1">
                                                <i class="fas fa-id-card me-1"></i> CCCD
                                            </span>

                                            <!-- Nếu là Giấy phép lái xe -->
                                            <span v-else-if="item.document_type === 'driver_license'"
                                                class="badge bg-success bg-opacity-10 text-success px-2 py-1">
                                                <i class="fas fa-file-alt me-1"></i> GPLX
                                            </span>

                                            <!-- Dự phòng nếu sau này có thêm loại giấy tờ khác -->
                                            <span v-else
                                                class="badge bg-secondary bg-opacity-10 text-secondary px-2 py-1">
                                                <i class="fas fa-file-alt me-1"></i> Khác
                                            </span>
                                        </td>

                                        <td class="py-3">
                                            <div class="text-dark small fw-semibold">{{ new Date(item.created_at).toLocaleDateString('vi-VN') }}</div>
                                            <div class="text-muted small">{{ new Date(item.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit'}) }}</div>
                                        </td>

                                        <td class="py-3">
                                            <span v-if="item.status === 'pending'"
                                                class="badge bg-warning bg-opacity-10 text-warning border border-warning px-2 py-1 rounded-2">
                                                Đang chờ
                                            </span>
                                            <span v-else-if="item.status === 'approved'"
                                                class="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1 rounded-2">
                                                Đã duyệt
                                            </span>
                                            <span v-else
                                                class="badge bg-danger bg-opacity-10 text-danger border border-danger px-2 py-1 rounded-2">
                                                Bị từ chối
                                            </span>
                                        </td>

                                        <td class="px-4 py-3 text-end">
                                            <router-link :to="{ name: 'admin-kyc-detail', params: { id: item.id } }"
                                                class="btn btn-sm btn-light text-primary"
                                                title="Xem chi tiết & Phân xử">
                                                <i class="fas fa-eye me-1"></i> Chi tiết
                                            </router-link>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>

                        <div
                            class="card-footer bg-white border-top p-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                            <span class="text-muted small fw-semibold">Quản lý hồ sơ định danh điện tử eKYC</span>
                            <nav aria-label="Page navigation">
                                <ul class="pagination pagination-sm mb-0 shadow-sm">
                                    <li class="page-item disabled"><a class="page-link" href="#">Trước</a></li>
                                    <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                                    <li class="page-item"><a class="page-link" href="#">Sau</a></li>
                                </ul>
                            </nav>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    </main>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH KẾT NỐI NGHIỆP VỤ KYC (IMPORTS)
// ============================================================================
import { ref, onMounted } from 'vue';
import axios from 'axios';
import kycService from '@/services/kyc.service'; // Dịch vụ xử lý phê duyệt Định danh (CCCD / GPLX)

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI & BỘ LỌC HỒ SƠ CHỜ DUYỆT (STATE & FILTERS)
// ============================================================================
const kycList = ref([]);               // Danh sách hồ sơ định danh KYC cần thẩm định
const loading = ref(false);            // Cờ hiển thị hiệu ứng xoay nạp số liệu
const filterStatus = ref('pending');   // Mặc định hiển thị ngay danh sách chờ duyệt (pending)

const API_URL = import.meta.env.VITE_API_URL + '/v1/admin/kyc-approvals';

// ============================================================================
// 3. ĐẦU NỐI GIAO THUẬT NẠP HỒ SƠ CỨNG CỦA HỆ THỐNG (API HYDRATION)
// ============================================================================
/**
 * Tải danh sách hồ sơ xin cấp chứng nhận Định danh KYC theo Trang thái Bộ lọc
 */
const fetchList = async () => {
    loading.value = true;
    try {
        const res = await kycService.getPendingList(filterStatus.value);

        // Trích xuất dữ liệu mảng trả về từ máy chủ
        const apiData = res.data.data;
        kycList.value = apiData.data ? apiData.data : (apiData || []);

    } catch (err) {
        // ĐÂY LÀ CHÌA KHÓA BẮT LỖI MẠNH MẼ: Tóm hiển thị rõ thông báo lỗi tường minh từ Backend
        const backendError = err.response?.data?.message || err.message;
        alert("🚨 LỖI BACKEND BỊ GIẤU:\n" + backendError + "\n\nQuỳnh hãy chụp hoặc copy thông báo này lại nhé!");
        console.error("Chi tiết lỗi:", err.response);
    } finally {
        loading.value = false;
    }
};

// ============================================================================
// 4. MÓC DẪN VÒNG ĐỜI GIAO DIỆN COMPONENT (LIFECYCLE HOOKS)
// ============================================================================
// Khởi chạy nạp danh sách hồ sơ khi trang vừa được mở lên
onMounted(fetchList);
</script>
