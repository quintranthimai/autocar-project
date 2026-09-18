<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">

            <div class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center mb-4 gap-3 flex-wrap">
                        <div>
                            <h1 class="fs-3 mb-1 fw-bold text-dark">Danh sách Banner</h1>
                            <p class="mb-0 text-muted">Quản lý hình ảnh và liên kết quảng cáo trên trang chủ</p>
                        </div>
                        <div>
                            <router-link to="/admin/campaign-management"
                                class="btn btn-primary fw-semibold shadow-sm px-4 py-2">
                                <i class="fas fa-plus me-2"></i>Thêm Banner mới
                            </router-link>
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
                                placeholder="Tìm tiêu đề, đường dẫn link...">
                        </div>
                        <div class="d-flex gap-2 flex-wrap">
                            <select class="form-select text-muted shadow-sm" style="width: auto;">
                                <option selected>Tất cả trạng thái</option>
                                <option value="active">Đang hiển thị</option>
                                <option value="inactive">Đã ẩn</option>
                            </select>
                            <button class="btn btn-white border bg-white shadow-sm fw-semibold text-dark">
                                <i class="ti ti-filter me-1"></i> Bộ lọc
                            </button>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light text-muted small fw-semibold">
                                    <tr>
                                        <th class="px-4 py-3">Hình ảnh</th>
                                        <th class="py-3">Tiêu đề & Liên kết (Target URL)</th>
                                        <th class="py-3 text-center">Thứ tự</th>
                                        <th class="py-3">Trạng thái</th>
                                        <th class="px-4 py-3 text-end">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody class="border-top-0">

                                    <tr v-if="loading">
                                        <td colspan="5" class="text-center py-4 text-muted">
                                            <i class="fas fa-spinner fa-spin me-2"></i> Đang tải dữ liệu...
                                        </td>
                                    </tr>
                                    <tr v-else-if="banners.length === 0">
                                        <td colspan="5" class="text-center py-4 text-muted">
                                            Chưa có banner nào.
                                        </td>
                                    </tr>

                                    <tr v-for="item in banners" :key="item.id" :class="{ 'bg-light bg-opacity-50': !item.is_active }">
                                        <td class="px-4 py-3">
                                            <div class="bg-light border rounded-3 d-flex align-items-center justify-content-center shadow-sm overflow-hidden"
                                                style="width: 140px; height: 60px;">
                                                <img v-if="item.image_url" :src="`https://autocar-citx.onrender.com${item.image_url}`" class="w-100 h-100 object-fit-cover" />
                                                <i v-else class="fas fa-image text-muted fs-3 opacity-50"></i>
                                            </div>
                                        </td>
                                        <td class="py-3">
                                            <h6 class="mb-1 fw-bold" :class="item.is_active ? 'text-dark' : 'text-muted'">{{ item.title }}</h6>
                                            <a v-if="item.redirect_url" :href="item.redirect_url" class="text-primary small text-decoration-none"
                                                title="Click để thử link" target="_blank">
                                                <i class="fas fa-link me-1"></i>{{ item.redirect_url }}
                                            </a>
                                        </td>
                                        <td class="py-3 text-center">
                                            <span class="fw-bold fs-6" :class="item.is_active ? 'text-dark' : 'text-muted'">{{ item.display_order }}</span>
                                        </td>
                                        <td class="py-3">
                                            <span v-if="item.is_active" class="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1 rounded-2">
                                                Đang hiển thị
                                            </span>
                                            <span v-else class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary px-2 py-1 rounded-2">
                                                <i class="fas fa-eye-slash me-1"></i>Đã ẩn
                                            </span>
                                        </td>
                                        <td class="px-4 py-3 text-end">
                                            <button @click="deleteBanner(item.id)" class="btn btn-sm btn-light text-danger" title="Xóa Banner">
                                                <i class="ti ti-trash"></i>
                                            </button>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>

                        <div
                            class="card-footer bg-white border-top p-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                            <span class="text-muted small">Hiển thị 1 đến 2 trong số 12 banner</span>
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
// 1. KHÔNG GIAN TRỌN TRỌNG QUẢN TRỊ BẢNG TRUYỀN THÔNG (BANNER MANAGEMENT)
// ============================================================================
import { ref, onMounted } from 'vue'
import axios from 'axios'

const banners = ref([])
const loading = ref(true)

const fetchBanners = async () => {
    try {
        const res = await axios.get('https://autocar-citx.onrender.com/api/v1/admin/banners', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        banners.value = res.data.data
    } catch (error) {
        console.error('Lỗi tải danh sách banner:', error)
    } finally {
        loading.value = false
    }
}

const deleteBanner = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa banner này?')) {
        try {
            await axios.delete(`https://autocar-citx.onrender.com/api/v1/admin/banners/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            alert('Đã xóa banner!')
            fetchBanners()
        } catch (error) {
            console.error('Lỗi xóa banner:', error)
            alert('Không thể xóa banner!')
        }
    }
}

onMounted(() => {
    fetchBanners()
})
</script>
