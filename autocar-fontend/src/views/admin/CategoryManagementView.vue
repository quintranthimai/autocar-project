<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">

            <div class="row">
                <div class="col-12">
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
                        <div>
                            <h1 class="fs-3 mb-1 fw-bold text-dark">Quản lý Thông số & Dòng xe</h1>
                            <p class="mb-0 text-muted">Xem, sửa, xóa các thuộc tính cấu hình, danh sách dòng xe và tiện ích</p>
                        </div>
                        <div>
                            <router-link to="/admin/add-category"
                                class="btn btn-primary fw-semibold shadow-sm px-4 py-2">
                                <i class="fas fa-plus me-2"></i>Thêm Dữ liệu mới
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TABS ĐIỀU HƯỚNG -->
            <div class="row">
                <div class="col-12">
                    <ul class="nav nav-pills p-2 bg-white border rounded-4 shadow-sm mb-4 gap-2 flex-wrap">
                        <li class="nav-item flex-grow-1 text-center">
                            <button class="nav-link w-100 fw-bold py-2 rounded-3"
                                :class="{ 'active': activeTab === 'category' }" @click="switchTab('category')">
                                <i class="fas fa-car-side me-1"></i>Phân khúc
                            </button>
                        </li>
                        <li class="nav-item flex-grow-1 text-center">
                            <button class="nav-link w-100 fw-bold py-2 rounded-3"
                                :class="{ 'active': activeTab === 'fuel' }" @click="switchTab('fuel')">
                                <i class="fas fa-gas-pump me-1"></i>Nhiên liệu
                            </button>
                        </li>
                        <li class="nav-item flex-grow-1 text-center">
                            <button class="nav-link w-100 fw-bold py-2 rounded-3"
                                :class="{ 'active': activeTab === 'transmission' }" @click="switchTab('transmission')">
                                <i class="fas fa-cogs me-1"></i>Hộp số
                            </button>
                        </li>
                        <li class="nav-item flex-grow-1 text-center">
                            <button class="nav-link w-100 fw-bold py-2 rounded-3"
                                :class="{ 'active': activeTab === 'amenity_type' }" @click="switchTab('amenity_type')">
                                <i class="fas fa-layer-group me-1"></i>Nhóm Tiện ích
                            </button>
                        </li>
                        <li class="nav-item flex-grow-1 text-center">
                            <button class="nav-link w-100 fw-bold py-2 rounded-3"
                                :class="{ 'active': activeTab === 'amenities' }" @click="switchTab('amenities')">
                                <i class="fas fa-concierge-bell me-1"></i>Tiện ích chi tiết
                            </button>
                        </li>
                        <li class="nav-item flex-grow-1 text-center">
                            <button class="nav-link w-100 fw-bold py-2 rounded-3"
                                :class="{ 'active': activeTab === 'carmodel' }" @click="switchTab('carmodel')">
                                <i class="fas fa-car me-1"></i>Dòng xe
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- BẢNG DỮ LIỆU -->
            <div class="row">
                <div class="col-12">
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div class="table-responsive">

                            <div v-if="isLoading" class="text-center py-5 text-muted">
                                <span class="spinner-border spinner-border-sm text-primary me-2"></span>Đang tải dữ liệu thực tế từ Database...
                            </div>

                            <div v-else>
                                <!-- BẢNG PHÂN KHÚC -->
                                <table v-if="activeTab === 'category'" class="table table-hover align-middle mb-0">
                                    <thead class="table-light text-muted small fw-semibold">
                                        <tr>
                                            <th class="px-4 py-3" style="width: 80px;">ID</th>
                                            <th class="py-3">Tên hiển thị (Display Name)</th>
                                            <th class="py-3">Mã phân khúc (Name)</th>
                                            <th class="px-4 py-3 text-end">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody class="border-top-0">
                                        <tr v-if="categories.length === 0"><td colspan="4" class="text-center py-4 text-muted">Chưa có dữ liệu.</td></tr>
                                        <tr v-else v-for="item in categories" :key="item.id">
                                            <td class="px-4 py-3 fw-bold text-dark">#{{ item.id }}</td>
                                            <td class="py-3 fw-bold text-dark">{{ item.display_name }}</td>
                                            <td class="py-3"><span class="badge bg-light text-dark border px-3 py-2 rounded-2">{{ item.name }}</span></td>
                                            <td class="px-4 py-3 text-end">
                                                <button class="btn btn-sm btn-light text-primary me-2" @click="openEditModal(item, 'category')"><i class="ti ti-edit"></i></button>
                                                <button class="btn btn-sm btn-light text-danger" @click="deleteItem(item.id, item.display_name, 'category')"><i class="ti ti-trash"></i></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <!-- BẢNG NHIÊN LIỆU -->
                                <table v-if="activeTab === 'fuel'" class="table table-hover align-middle mb-0">
                                    <thead class="table-light text-muted small fw-semibold">
                                        <tr>
                                            <th class="px-4 py-3" style="width: 80px;">ID</th>
                                            <th class="py-3">Loại nhiên liệu (Display Name)</th>
                                            <th class="py-3">Mã (Name)</th>
                                            <th class="px-4 py-3 text-end">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody class="border-top-0">
                                        <tr v-if="fuels.length === 0"><td colspan="4" class="text-center py-4 text-muted">Chưa có dữ liệu.</td></tr>
                                        <tr v-else v-for="item in fuels" :key="item.id">
                                            <td class="px-4 py-3 fw-bold text-dark">#{{ item.id }}</td>
                                            <td class="py-3 fw-bold text-dark">{{ item.display_name }}</td>
                                            <td class="py-3"><span class="badge bg-light text-dark border px-3 py-2 rounded-2">{{ item.name }}</span></td>
                                            <td class="px-4 py-3 text-end">
                                                <button class="btn btn-sm btn-light text-primary me-2" @click="openEditModal(item, 'fuel')"><i class="ti ti-edit"></i></button>
                                                <button class="btn btn-sm btn-light text-danger" @click="deleteItem(item.id, item.display_name, 'fuel')"><i class="ti ti-trash"></i></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <!-- BẢNG HỘP SỐ -->
                                <table v-if="activeTab === 'transmission'" class="table table-hover align-middle mb-0">
                                    <thead class="table-light text-muted small fw-semibold">
                                        <tr>
                                            <th class="px-4 py-3" style="width: 80px;">ID</th>
                                            <th class="py-3">Loại hộp số (Display Name)</th>
                                            <th class="py-3">Mã (Name)</th>
                                            <th class="px-4 py-3 text-end">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody class="border-top-0">
                                        <tr v-if="transmissions.length === 0"><td colspan="4" class="text-center py-4 text-muted">Chưa có dữ liệu.</td></tr>
                                        <tr v-else v-for="item in transmissions" :key="item.id">
                                            <td class="px-4 py-3 fw-bold text-dark">#{{ item.id }}</td>
                                            <td class="py-3 fw-bold text-dark">{{ item.display_name }}</td>
                                            <td class="py-3"><span class="badge bg-light text-dark border px-3 py-2 rounded-2">{{ item.name }}</span></td>
                                            <td class="px-4 py-3 text-end">
                                                <button class="btn btn-sm btn-light text-primary me-2" @click="openEditModal(item, 'transmission')"><i class="ti ti-edit"></i></button>
                                                <button class="btn btn-sm btn-light text-danger" @click="deleteItem(item.id, item.display_name, 'transmission')"><i class="ti ti-trash"></i></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <!-- BẢNG NHÓM TIỆN ÍCH -->
                                <table v-if="activeTab === 'amenity_type'" class="table table-hover align-middle mb-0">
                                    <thead class="table-light text-muted small fw-semibold">
                                        <tr>
                                            <th class="px-4 py-3" style="width: 80px;">ID</th>
                                            <th class="py-3">Tên nhóm tiện ích (Display Name)</th>
                                            <th class="py-3">Mã (Name)</th>
                                            <th class="px-4 py-3 text-end">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody class="border-top-0">
                                        <tr v-if="amenityTypes.length === 0"><td colspan="4" class="text-center py-4 text-muted">Chưa có dữ liệu.</td></tr>
                                        <tr v-else v-for="item in amenityTypes" :key="item.id">
                                            <td class="px-4 py-3 fw-bold text-dark">#{{ item.id }}</td>
                                            <td class="py-3 fw-bold text-dark">{{ item.display_name }}</td>
                                            <td class="py-3"><span class="badge bg-light text-dark border px-3 py-2 rounded-2">{{ item.name }}</span></td>
                                            <td class="px-4 py-3 text-end">
                                                <!-- Sử dụng chung Modal sửa thông số chung -->
                                                <button class="btn btn-sm btn-light text-primary me-2" @click="openEditModal(item, 'amenity_type')"><i class="ti ti-edit"></i></button>
                                                <button class="btn btn-sm btn-light text-danger" @click="deleteItem(item.id, item.display_name, 'amenity_type')"><i class="ti ti-trash"></i></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <!-- BẢNG TIỆN ÍCH CHI TIẾT -->
                                <div v-if="activeTab === 'amenities'">
                                    <div class="d-flex justify-content-end p-3 border-bottom">
                                        <button class="btn btn-primary btn-sm rounded-pill px-3 shadow-sm fw-semibold" @click="openAmenityModal()">
                                            <i class="fas fa-plus me-1"></i> Thêm tiện ích nhanh
                                        </button>
                                    </div>
                                    <table class="table table-hover align-middle mb-0">
                                        <thead class="table-light text-muted small fw-semibold">
                                            <tr>
                                                <th class="px-4 py-3" style="width: 80px;">ID</th>
                                                <th class="py-3" style="width: 60px;">Icon</th>
                                                <th class="py-3">Tên hiển thị</th>
                                                <th class="py-3">Mã (Code)</th>
                                                <th class="py-3">Thuộc Nhóm</th>
                                                <th class="px-4 py-3 text-end">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody class="border-top-0">
                                            <tr v-if="amenities.length === 0"><td colspan="6" class="text-center py-4 text-muted">Chưa có dữ liệu Tiện ích.</td></tr>
                                            <tr v-else v-for="item in amenities" :key="item.id">
                                                <td class="px-4 py-3 fw-bold text-dark">#{{ item.id }}</td>
                                                <td class="py-3"><i :class="item.icon" class="fs-5 text-primary"></i></td>
                                                <td class="py-3 fw-bold text-dark">{{ item.display_name }}</td>
                                                <td class="py-3"><span class="badge bg-light text-dark border px-3 py-2 rounded-2">{{ item.name }}</span></td>
                                                <td class="py-3"><span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle">{{ item.amenity_type?.display_name }}</span></td>
                                                <td class="px-4 py-3 text-end">
                                                    <button class="btn btn-sm btn-light text-primary me-2" @click="openAmenityModal(item)"><i class="ti ti-edit"></i></button>
                                                    <button class="btn btn-sm btn-light text-danger" @click="deleteItem(item.id, item.display_name, 'amenities')"><i class="ti ti-trash"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- BẢNG DÒNG XE -->
                                <table v-if="activeTab === 'carmodel'" class="table table-hover align-middle mb-0">
                                    <thead class="table-light text-muted small fw-semibold">
                                        <tr>
                                            <th class="px-4 py-3" style="width: 60px;">ID</th>
                                            <th class="py-3">Hãng / Tên dòng xe</th>
                                            <th class="py-3">Cấu hình kỹ thuật</th>
                                            <th class="py-3">Thông số</th>
                                            <th class="px-4 py-3 text-end">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody class="border-top-0">
                                        <tr v-if="carModels.length === 0"><td colspan="5" class="text-center py-4 text-muted">Chưa có dữ liệu Dòng xe.</td></tr>
                                        <tr v-else v-for="car in carModels" :key="car.id">
                                            <td class="px-4 py-3 fw-bold text-dark">#{{ car.id }}</td>
                                            <td class="py-3">
                                                <h6 class="mb-1 fw-bold text-dark">{{ car.brand_name }}</h6>
                                                <div class="text-muted small">{{ car.model_name }}</div>
                                            </td>
                                            <td class="py-3">
                                                <div class="d-flex flex-wrap gap-1">
                                                    <span class="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle">{{ car.category?.display_name }}</span>
                                                    <span class="badge bg-success bg-opacity-10 text-success border border-success-subtle">{{ car.fuel?.display_name }}</span>
                                                    <span class="badge bg-warning bg-opacity-10 text-warning border border-warning-subtle">{{ car.transmission?.display_name }}</span>
                                                </div>
                                            </td>
                                            <td class="py-3 small text-muted">
                                                <div><i class="fas fa-user me-1"></i> {{ car.seat_count }} chỗ</div>
                                                <div>
                                                    <i :class="getFuelCategory(car.fuel) === 'electric' ? 'fas fa-charging-station text-success' : (getFuelCategory(car.fuel) === 'hybrid' ? 'fas fa-leaf text-info' : 'fas fa-gas-pump')" class="me-1"></i> 
                                                    {{ formatFuelConsumption(car.fuel_consumption, car.fuel) }}
                                                </div>
                                            </td>
                                            <td class="px-4 py-3 text-end">
                                                <button class="btn btn-sm btn-light text-primary me-2" @click="openEditCarModelModal(car)"><i class="ti ti-edit"></i></button>
                                                <button class="btn btn-sm btn-light text-danger" @click="deleteItem(car.id, car.brand_name + ' ' + car.model_name, 'carmodel')"><i class="ti ti-trash"></i></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- MODAL CHỈNH SỬA THÔNG SỐ CHUNG (Category, Fuel, Transmission, Amenity_Type) -->
        <div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 rounded-4 shadow">
                    <div class="modal-header border-bottom px-4 py-3">
                        <h5 class="modal-title fw-bold text-dark"><i class="fas fa-edit text-primary me-2"></i>Chỉnh sửa Thông số</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form @submit.prevent="handleUpdate">
                        <div class="modal-body p-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-dark small">Tên hiển thị <span class="text-danger">*</span></label>
                                <input type="text" class="form-control bg-light border-0 py-2" v-model="editData.display_name" required>
                            </div>
                            <div class="mb-2">
                                <label class="form-label fw-semibold text-dark small">Mã hệ thống (Name) <span class="text-danger">*</span></label>
                                <input type="text" class="form-control bg-light border-0 py-2" v-model="editData.name" required>
                            </div>
                        </div>
                        <div class="modal-footer border-top-0 px-4 pb-4 pt-0">
                            <button type="button" class="btn btn-light fw-semibold" data-bs-dismiss="modal">Hủy</button>
                            <button type="submit" class="btn btn-primary fw-semibold px-4" :disabled="isSubmitting">Lưu thay đổi</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- MODAL THÊM/SỬA TIỆN ÍCH CHI TIẾT -->
        <div class="modal fade" id="amenityModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 rounded-4 shadow">
                    <div class="modal-header border-bottom px-4 py-3">
                        <h5 class="modal-title fw-bold text-dark">
                            <i class="fas fa-concierge-bell text-primary me-2"></i>{{ amenityForm.id ? 'Sửa' : 'Thêm' }} Tiện ích
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form @submit.prevent="handleSaveAmenity">
                        <div class="modal-body p-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-dark small">Nhóm tiện ích <span class="text-danger">*</span></label>
                                <select v-model="amenityForm.amenity_type_id" class="form-select bg-light border-0" required>
                                    <option value="">-- Chọn nhóm --</option>
                                    <option v-for="type in amenityTypes" :key="type.id" :value="type.id">
                                        {{ type.display_name }}
                                    </option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-dark small">Mã định danh (VD: camera_360) <span class="text-danger">*</span></label>
                                <input type="text" v-model="amenityForm.name" class="form-control bg-light border-0 py-2" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-dark small">Tên hiển thị (VD: Camera 360) <span class="text-danger">*</span></label>
                                <input type="text" v-model="amenityForm.display_name" class="form-control bg-light border-0 py-2" required>
                            </div>
                            <div class="mb-2">
                                <label class="form-label fw-semibold text-dark small">FontAwesome Icon (VD: fas fa-camera)</label>
                                <input type="text" v-model="amenityForm.icon" class="form-control bg-light border-0 py-2">
                            </div>
                        </div>
                        <div class="modal-footer border-top-0 px-4 pb-4 pt-0">
                            <button type="button" class="btn btn-light fw-semibold" data-bs-dismiss="modal">Hủy</button>
                            <button type="submit" class="btn btn-primary fw-semibold px-4" :disabled="isSubmitting">Lưu tiện ích</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- MODAL CHỈNH SỬA DÒNG XE (Giữ nguyên) -->
        <div class="modal fade" id="editCarModelModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0 rounded-4 shadow">
                    <!-- ... Nội dung modal giữ nguyên ... -->
                    <div class="modal-header border-bottom px-4 py-3">
                        <h5 class="modal-title fw-bold text-dark"><i class="fas fa-car text-primary me-2"></i>Chỉnh sửa Dòng xe</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form @submit.prevent="handleUpdateCarModel">
                        <div class="modal-body p-4">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label small fw-semibold">Phân khúc *</label>
                                    <select class="form-select bg-light border-0" v-model="editCarModelData.category_id" required>
                                        <option v-for="cat in categoriesList" :key="cat.id" :value="cat.id">{{ cat.display_name }}</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-semibold">Nhiên liệu *</label>
                                    <select class="form-select bg-light border-0" v-model="editCarModelData.fuel_id" required>
                                        <option v-for="f in fuelsList" :key="f.id" :value="f.id">{{ f.display_name }}</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-semibold">Hộp số *</label>
                                    <select class="form-select bg-light border-0" v-model="editCarModelData.transmission_id" required>
                                        <option v-for="t in transmissionsList" :key="t.id" :value="t.id">{{ t.display_name }}</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold">Hãng xe *</label>
                                    <input type="text" class="form-control bg-light border-0" v-model="editCarModelData.brand_name" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold">Tên dòng xe *</label>
                                    <input type="text" class="form-control bg-light border-0" v-model="editCarModelData.model_name" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold">Số chỗ ngồi *</label>
                                    <input type="number" class="form-control bg-light border-0" v-model="editCarModelData.seat_count" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold">
                                        Tiêu hao ({{ getFuelCategory(editCarModelData.fuel_id) === 'electric' ? 'kWh/100km' : (getFuelCategory(editCarModelData.fuel_id) === 'hybrid' ? 'L/100km & kWh/100km' : 'L/100km') }}) *
                                    </label>
                                    <input type="text" class="form-control bg-light border-0" v-model="editCarModelData.fuel_consumption" required>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer border-top-0 px-4 pb-4 pt-0">
                            <button type="button" class="btn btn-light fw-semibold" data-bs-dismiss="modal">Hủy</button>
                            <button type="submit" class="btn btn-primary fw-semibold px-4" :disabled="isSubmitting">Cập nhật xe</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </main>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH TRỌN ĐẦU NỐI CÁC DỊCH VỤ (IMPORTS)
// ============================================================================
import { ref, onMounted } from 'vue';
import categoryService from '@/services/category.service';         // Quản lý Phân khúc xe
import fuelService from '@/services/fuel.service';                 // Quản lý Loại nhiên liệu
import transmissionService from '@/services/transmission.service'; // Quản lý Loại hộp số
import carModelService from '@/services/carModel.service';         // Quản lý Danh mục các dòng xe/Hãng xe
import amenityService from '@/services/amenity.service';           // Quản lý Tiện ích & Nhóm trang bị

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI GIAO DIỆN & DANH SÁCH SỐ LIỆU (STATE MANAGEMENT)
// ============================================================================
const activeTab = ref('category');   // Theo dõi thẻ quản lý hiện hành (Phân khúc / Nhiên liệu / Hộp số / Dòng xe / Tiện ích)
const isLoading = ref(true);         // Cờ hiển thị hiệu ứng xoay tải bảng biểu
const isSubmitting = ref(false);     // Cờ khóa nút thao tác khi đang lưu cập nhật

// Các biến mảng lưu trữ danh sách số liệu tải về từ từng Bảng chuyên trách trên Database
const categories = ref([]);
const fuels = ref([]);
const transmissions = ref([]);
const carModels = ref([]);
const amenities = ref([]);
const amenityTypes = ref([]);        // Biến dùng chung cho cả Tab Nhóm tiện ích và Dropdown Tiện ích

// Thực thể ghi nhớ dữ liệu khi bật Modal Chỉnh sửa thông số (Chung cho Phân khúc, Nhiên liệu, Hộp số, Nhóm tiện ích)
const editData = ref({ id: null, name: '', display_name: '', type: '' });

// Biểu mẫu quản lý thông tin Trang bị / Tiện ích xe
const amenityForm = ref({ id: null, amenity_type_id: '', name: '', display_name: '', icon: '' });

// ============================================================================
// 3. TRÌNH BỐC TÁCH NẠP ĐẦU ĐỦ DỮ LIỆU TỪ BACKEND (DATA HYDRATION)
// ============================================================================
/**
 * Nạp thông số và số liệu thống kê bảng biểu phù hợp với thẻ Tab đang bật
 */
const loadDataByTab = async (tab) => {
    isLoading.value = true;
    try {
        if (tab === 'category') {
            const res = await categoryService.getAllCategories();
            categories.value = res.data.data || res.data || [];
        } else if (tab === 'fuel') {
            const res = await fuelService.getAll();
            fuels.value = res.data.data || res.data || [];
        } else if (tab === 'transmission') {
            const res = await transmissionService.getAll();
            transmissions.value = res.data.data || res.data || [];
        } else if (tab === 'carmodel') {
            const res = await carModelService.getAll();
            carModels.value = res.data.data || res.data || [];
        } else if (tab === 'amenity_type') { // Tải dữ liệu Nhóm tiện ích
            const res = await amenityService.getAmenityTypes();
            amenityTypes.value = res.data.data || res.data || [];
        } else if (tab === 'amenities') {
            // Đồng bộ tải song song cả Danh sách Tiện ích lẫn Danh sách Nhóm cho Dropdown
            const [amenitiesRes, typesRes] = await Promise.all([
                amenityService.getAmenities(),
                amenityService.getAmenityTypes()
            ]);
            amenities.value = amenitiesRes.data.data || [];
            amenityTypes.value = typesRes.data.data || [];
        }
    } catch (error) {
        console.error(`Lỗi tải dữ liệu tab ${tab}:`, error);
    } finally {
        isLoading.value = false;
    }
};

/**
 * Xử lý chuyển đổi giữa các Tab và kích hoạt nạp lại bảng dữ liệu tương ứng
 */
const switchTab = (tabName) => {
    activeTab.value = tabName;
    loadDataByTab(tabName);
};

// ============================================================================
// 4. TRÌNH CHỈNH SỬA & LƯU TRỮ DANH MỤC THÔNG SỐ CHUNG (COMMON CRUD ACTIONS)
// ============================================================================
/**
 * Mở hộp thoại chỉnh sửa cho các Danh mục đơn (Phân khúc, Hộp số, Nhiên liệu, Nhóm tiện ích)
 */
const openEditModal = (item, type) => {
    editData.value = { id: item.id, name: item.name, display_name: item.display_name, type: type };
    const modal = new window.bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
};

/**
 * Xử lý kiểm tra Mã hệ thống (Không chứa khoảng trắng) và gọi API Cập nhật
 */
const handleUpdate = async () => {
    editData.value.name = editData.value.name.toLowerCase().trim();
    if (editData.value.name.includes(' ')) {
        alert('Mã hệ thống không được chứa khoảng trắng!'); return;
    }

    try {
        isSubmitting.value = true;
        const payload = { name: editData.value.name, display_name: editData.value.display_name };

        if (editData.value.type === 'category') await categoryService.updateCategory(editData.value.id, payload);
        else if (editData.value.type === 'fuel') await fuelService.update(editData.value.id, payload);
        else if (editData.value.type === 'transmission') await transmissionService.update(editData.value.id, payload);
        else if (editData.value.type === 'amenity_type') await amenityService.updateAmenityType(editData.value.id, payload);

        alert('Cập nhật dữ liệu thành công!');

        const modalEl = document.getElementById('editModal');
        const modal = window.bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        loadDataByTab(activeTab.value);
    } catch (error) {
        console.error("Lỗi cập nhật:", error);
        if (error.response?.status === 422) alert('Mã hệ thống (Name) này đã tồn tại!');
        else alert('Lỗi khi cập nhật dữ liệu!');
    } finally { isSubmitting.value = false; }
};

// ============================================================================
// 5. CÔNG HOẠT THIẾT HOẠT TRANG BỊ & TIỆN ÍCH XE (AMENITY MANAGEMENT LOGIC)
// ============================================================================
/**
 * Mở hộp thoại Modal Tạo mới hoặc Chỉnh sửa Tiện ích ô tô (Kèm biểu tượng Icon)
 */
const openAmenityModal = (item = null) => {
    if (item) {
        amenityForm.value = { 
            id: item.id, 
            amenity_type_id: item.amenity_type_id || (item.amenity_type ? item.amenity_type.id : ''), 
            name: item.name, 
            display_name: item.display_name, 
            icon: item.icon || '' 
        };
    } else {
        amenityForm.value = { id: null, amenity_type_id: '', name: '', display_name: '', icon: '' };
    }
    const modal = new window.bootstrap.Modal(document.getElementById('amenityModal'));
    modal.show();
};

/**
 * Ghi nhận tạo mới hoặc cập nhật thông tin Tiện ích xe trên hệ thống
 */
const handleSaveAmenity = async () => {
    amenityForm.value.name = amenityForm.value.name.toLowerCase().trim();
    if (amenityForm.value.name.includes(' ')) {
        alert('Mã định danh không được chứa khoảng trắng!'); return;
    }

    try {
        isSubmitting.value = true;
        const payload = { ...amenityForm.value };

        if (payload.id) {
            await amenityService.updateAmenity(payload.id, payload);
            alert('Cập nhật tiện ích thành công!');
        } else {
            await amenityService.createAmenity(payload);
            alert('Thêm mới tiện ích thành công!');
        }

        window.bootstrap.Modal.getInstance(document.getElementById('amenityModal'))?.hide();
        loadDataByTab('amenities');
    } catch (error) {
        console.error(error);
        if (error.response?.status === 422) alert('Lỗi: Mã định danh này đã tồn tại!');
        else alert('Có lỗi xảy ra khi lưu tiện ích!');
    } finally {
        isSubmitting.value = false;
    }
};

// ============================================================================
// 6. TRÌNH XÓA THUẬT DANH MỤC CÓ KIỂM TRA KHÓA NGOẠI (DELETE ACTIONS)
// ============================================================================
/**
 * Xóa một mục danh mục khỏi máy chủ.
 * Đặc biệt: Cảnh báo người dùng nếu mục đang có liên kết ràng buộc khóa ngoại với xe
 */
const deleteItem = async (id, name, type) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa "${name}" không? Thao tác này không thể hoàn tác!`)) return;
    try {
        if (type === 'category') await categoryService.deleteCategory(id);
        else if (type === 'fuel') await fuelService.delete(id);
        else if (type === 'transmission') await transmissionService.delete(id);
        else if (type === 'carmodel') await carModelService.delete(id);
        else if (type === 'amenities') await amenityService.deleteAmenity(id);
        else if (type === 'amenity_type') await amenityService.deleteAmenityType(id);

        alert('Xóa thành công!');
        loadDataByTab(activeTab.value);
    } catch (error) { 
        alert(error.response?.data?.message || 'Không thể xóa! Bản ghi này đang có liên kết khóa ngoại dữ liệu.'); 
    }
};

// ============================================================================
// 7. HỆ THỐNG QUẢN LÝ THAY ĐỔI THỰC THỂ DÒNG XE (CAR MODEL MANAGEMENT)
// ============================================================================
const categoriesList = ref([]);
const fuelsList = ref([]);
const transmissionsList = ref([]);
const editCarModelData = ref({ id: null, category_id: '', fuel_id: '', transmission_id: '', brand_name: '', model_name: '', seat_count: '', fuel_consumption: '' });

/**
 * Phân loại dữ liệu nhiên liệu (hoặc id nhiên liệu) thuộc nhóm: 'hybrid', 'electric' hoặc 'standard'
 */
const getFuelCategory = (fuelOrId) => {
    if (!fuelOrId) return 'standard';
    let str = '';
    if (typeof fuelOrId === 'object') {
        str = `${fuelOrId.name || ''} ${fuelOrId.display_name || ''}`.toLowerCase();
    } else {
        const fuelObj = fuelsList.value.find(f => f.id === Number(fuelOrId) || f.id === fuelOrId);
        if (fuelObj) {
            str = `${fuelObj.name || ''} ${fuelObj.display_name || ''}`.toLowerCase();
        }
    }
    if (!str) return 'standard';

    if (str.includes('hybrid') || str.includes('phev') || str.includes('hev') || str.includes('lai') || (str.includes('xăng') && str.includes('điện'))) {
        return 'hybrid';
    }
    if (str.includes('điện') || str.includes('electric') || str.includes('ev') || str.includes('bev')) {
        return 'electric';
    }
    return 'standard';
};

/**
 * Trình tự động hiển thị chuỗi tiêu hao kèm đơn vị phù hợp theo từng dòng xe
 */
const formatFuelConsumption = (consumption, fuel) => {
    if (consumption === undefined || consumption === null || consumption === '') return 'N/A';
    const valStr = String(consumption).trim();
    if (valStr.toLowerCase().includes('l') || valStr.toLowerCase().includes('kwh') || valStr.toLowerCase().includes('/')) {
        return valStr;
    }
    const cat = getFuelCategory(fuel);
    if (cat === 'electric') return `${valStr} kWh/100km`;
    if (cat === 'hybrid') return `${valStr} (L/100km & kWh/100km)`;
    return `${valStr} L/100km`;
};

/**
 * Mở hộp thoại chỉnh sửa cho một Dòng xe cụ thể, đồng thời tự động nạp các Dropdown nếu chưa nạp
 */
const openEditCarModelModal = async (car) => {
    if (categoriesList.value.length === 0) {
        const [rCat, rFuel, rTrans] = await Promise.all([
            categoryService.getAllCategories(), fuelService.getAll(), transmissionService.getAll()
        ]);
        categoriesList.value = rCat.data.data || [];
        fuelsList.value = rFuel.data.data || [];
        transmissionsList.value = rTrans.data.data || [];
    }

    editCarModelData.value = {
        id: car.id,
        category_id: car.category_id || (car.category ? car.category.id : ''),
        fuel_id: car.fuel_id || (car.fuel ? car.fuel.id : ''),
        transmission_id: car.transmission_id || (car.transmission ? car.transmission.id : ''),
        brand_name: car.brand_name,
        model_name: car.model_name,
        seat_count: car.seat_count,
        fuel_consumption: car.fuel_consumption
    };

    const modal = new window.bootstrap.Modal(document.getElementById('editCarModelModal'));
    modal.show();
};

/**
 * Phát lệnh lưu các thay đổi về Dòng xe (Số ghế, mức tiêu hao nhiên liệu...) lên Database
 */
const handleUpdateCarModel = async () => {
    try {
        isSubmitting.value = true;
        const payload = { ...editCarModelData.value };

        if (payload.fuel_consumption) payload.fuel_consumption = String(payload.fuel_consumption);
        if (payload.seat_count) payload.seat_count = Number(payload.seat_count);

        await carModelService.update(payload.id, payload);
        alert('Cập nhật dòng xe thành công!');

        window.bootstrap.Modal.getInstance(document.getElementById('editCarModelModal'))?.hide();
        loadDataByTab('carmodel');
    } catch (error) {
        console.error(error);
        if (error.response?.status === 422) alert('Lỗi: Tên dòng xe đã tồn tại!');
        else alert('Có lỗi xảy ra khi cập nhật!');
    } finally {
        isSubmitting.value = false;
    }
};

// ============================================================================
// 8. MÓC DẪN VÒNG ĐỜI KHỞI ĐỘNG COMPONENT (LIFECYCLE HOOKS)
// ============================================================================
onMounted(() => {
    loadDataByTab(activeTab.value);
});
</script>
