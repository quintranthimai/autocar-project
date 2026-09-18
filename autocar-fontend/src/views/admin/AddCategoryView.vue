<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100 d-flex flex-column">
        <div class="container-fluid pt-3 d-flex flex-column flex-grow-1">

            <div class="row flex-shrink-0">
                <div class="col-12">
                    <div
                        class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                        <div>
                            <h1 class="fs-3 mb-1 fw-bold text-dark">Thêm Thông số & Dòng xe</h1>
                            <p class="mb-0 text-muted">Quản lý và thêm mới các thuộc tính cấu thành nên một chiếc xe</p>
                        </div>
                        <div>
                            <router-link to="/admin/category-management"
                                class="btn btn-white border bg-white fw-semibold text-dark shadow-sm px-4 py-2">
                                <i class="fas fa-arrow-left me-2"></i>Quay lại danh sách
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row flex-grow-1">
                <div class="col-12 d-flex flex-column">

                    <ul
                        class="nav nav-pills p-2 bg-white border rounded-4 shadow-sm mb-4 gap-2 flex-column flex-md-row">
                        <li class="nav-item flex-grow-1 text-center">
                            <button class="nav-link w-100 fw-bold py-3 rounded-3"
                                :class="{ 'active': activeTab === 'category' }" @click="activeTab = 'category'">
                                <i class="fas fa-car-side me-2"></i>Phân khúc xe
                            </button>
                        </li>
                        <li class="nav-item flex-grow-1 text-center">
                            <button class="nav-link w-100 fw-bold py-3 rounded-3"
                                :class="{ 'active': activeTab === 'fuel' }" @click="activeTab = 'fuel'">
                                <i class="fas fa-gas-pump me-2"></i>Nhiên liệu
                            </button>
                        </li>
                        <li class="nav-item flex-grow-1 text-center">
                            <button class="nav-link w-100 fw-bold py-3 rounded-3"
                                :class="{ 'active': activeTab === 'transmission' }" @click="activeTab = 'transmission'">
                                <i class="fas fa-cogs me-2"></i>Hộp số
                            </button>
                        </li>
                        <li class="nav-item flex-grow-1 text-center">
                            <button class="nav-link w-100 fw-bold py-3 rounded-3"
                                :class="{ 'active': activeTab === 'carmodel' }" @click="activeTab = 'carmodel'">
                                <i class="fas fa-car me-2"></i>Dòng xe
                            </button>
                        </li>
                        <!-- THÊM TAB NHÓM TIỆN ÍCH Ở ĐÂY -->
                        <li class="nav-item flex-grow-1 text-center">
                            <button class="nav-link w-100 fw-bold py-3 rounded-3"
                                :class="{ 'active': activeTab === 'amenity_type' }" @click="activeTab = 'amenity_type'">
                                <i class="fas fa-layer-group me-2"></i>Nhóm tiện ích
                            </button>
                        </li>
                    </ul>

                    <div class="card border-0 shadow-sm rounded-4 flex-grow-1">
                        <div class="card-body p-4 p-xl-5 d-flex flex-column">

                            <!-- FORM PHÂN KHÚC XE -->
                            <form v-if="activeTab === 'category'" @submit.prevent="submitCategory"
                                class="flex-grow-1 d-flex flex-column">
                                <h5 class="mb-4 border-bottom pb-3 fw-bold text-dark fs-5">
                                    <i class="fas fa-car-side text-primary me-2"></i>Thêm Phân khúc mới
                                </h5>
                                <div class="row g-4 mb-4">
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">Tên hiển thị <span
                                                class="text-danger">*</span></label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="categoryData.display_name" placeholder="VD: SUV (7 chỗ gầm cao)"
                                            required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">Mã phân khúc <span
                                                class="text-danger">*</span></label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="categoryData.name" placeholder="VD: suv" required>
                                    </div>
                                </div>
                                <div class="d-flex gap-3 pt-4 border-top justify-content-end mt-auto">
                                    <button type="submit" class="btn btn-primary px-5 py-3 fw-bold rounded-3 fs-6"
                                        :disabled="isSubmitting">
                                        <i class="fas fa-save me-2"></i>Lưu Phân khúc
                                    </button>
                                </div>
                            </form>

                            <!-- FORM NHIÊN LIỆU -->
                            <form v-if="activeTab === 'fuel'" @submit.prevent="submitFuel"
                                class="flex-grow-1 d-flex flex-column">
                                <h5 class="mb-4 border-bottom pb-3 fw-bold text-dark fs-5">
                                    <i class="fas fa-gas-pump text-primary me-2"></i>Thêm Loại nhiên liệu
                                </h5>
                                <div class="row g-4 mb-4">
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">Tên hiển thị <span
                                                class="text-danger">*</span></label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="fuelData.display_name" placeholder="VD: Xăng" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">Mã nhiên liệu <span
                                                class="text-danger">*</span></label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="fuelData.name" placeholder="VD: gasoline" required>
                                    </div>
                                </div>
                                <div class="d-flex gap-3 pt-4 border-top justify-content-end mt-auto">
                                    <button type="submit" class="btn btn-primary px-5 py-3 fw-bold rounded-3 fs-6"
                                        :disabled="isSubmitting">
                                        <i class="fas fa-save me-2"></i>Lưu Nhiên liệu
                                    </button>
                                </div>
                            </form>

                            <!-- FORM HỘP SỐ -->
                            <form v-if="activeTab === 'transmission'" @submit.prevent="submitTransmission"
                                class="flex-grow-1 d-flex flex-column">
                                <h5 class="mb-4 border-bottom pb-3 fw-bold text-dark fs-5">
                                    <i class="fas fa-cogs text-primary me-2"></i>Thêm Loại Hộp số
                                </h5>
                                <div class="row g-4 mb-4">
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">Tên hiển thị <span
                                                class="text-danger">*</span></label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="transmissionData.display_name" placeholder="VD: Số tự động"
                                            required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">Mã hộp số <span
                                                class="text-danger">*</span></label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="transmissionData.name" placeholder="VD: automatic" required>
                                    </div>
                                </div>
                                <div class="d-flex gap-3 pt-4 border-top justify-content-end mt-auto">
                                    <button type="submit" class="btn btn-primary px-5 py-3 fw-bold rounded-3 fs-6"
                                        :disabled="isSubmitting">
                                        <i class="fas fa-save me-2"></i>Lưu Hộp số
                                    </button>
                                </div>
                            </form>

                            <!-- FORM NHÓM TIỆN ÍCH -->
                            <form v-if="activeTab === 'amenity_type'" @submit.prevent="submitAmenityType"
                                class="flex-grow-1 d-flex flex-column">
                                <h5 class="mb-4 border-bottom pb-3 fw-bold text-dark fs-5">
                                    <i class="fas fa-layer-group text-primary me-2"></i>Thêm Nhóm Tiện ích
                                </h5>
                                <div class="row g-4 mb-4">
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">Tên hiển thị (Display Name)<span
                                                class="text-danger">*</span></label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="amenityTypeData.display_name" placeholder="VD: Tính năng an toàn"
                                            required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">Mã nhóm (Name)<span
                                                class="text-danger">*</span></label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="amenityTypeData.name" placeholder="VD: safety" required>
                                    </div>
                                </div>
                                <div class="d-flex gap-3 pt-4 border-top justify-content-end mt-auto">
                                    <button type="submit" class="btn btn-primary px-5 py-3 fw-bold rounded-3 fs-6"
                                        :disabled="isSubmitting">
                                        <i class="fas fa-save me-2"></i>Lưu Nhóm tiện ích
                                    </button>
                                </div>
                            </form>

                            <!-- FORM DÒNG XE -->
                            <form v-if="activeTab === 'carmodel'" @submit.prevent="submitCarModel"
                                class="flex-grow-1 d-flex flex-column">
                                <h5 class="mb-4 border-bottom pb-3 fw-bold text-dark fs-5">
                                    <i class="fas fa-car text-primary me-2"></i>Thêm Dòng xe mới (Car Model)
                                </h5>

                                <div class="row g-4 mb-4">
                                    <div class="col-md-4">
                                        <label class="form-label fw-semibold text-dark mb-2">Phân khúc xe (Category)
                                            <span class="text-danger">*</span></label>
                                        <select class="form-select form-select-lg bg-light border-0 fs-6 py-3 text-body"
                                            v-model="carModelData.category_id" required>
                                            <option value="" disabled selected>-- Chọn phân khúc --</option>
                                            <option v-for="cat in categoriesList" :key="cat.id" :value="cat.id">{{
                                                cat.display_name }}</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-semibold text-dark mb-2">Nhiên liệu (Fuel) <span
                                                class="text-danger">*</span></label>
                                        <select class="form-select form-select-lg bg-light border-0 fs-6 py-3 text-body"
                                            v-model="carModelData.fuel_id" required>
                                            <option value="" disabled selected>-- Chọn nhiên liệu --</option>
                                            <option v-for="fuel in fuelsList" :key="fuel.id" :value="fuel.id">{{
                                                fuel.display_name }}</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-semibold text-dark mb-2">Hộp số (Transmission) <span
                                                class="text-danger">*</span></label>
                                        <select class="form-select form-select-lg bg-light border-0 fs-6 py-3 text-body"
                                            v-model="carModelData.transmission_id" required>
                                            <option value="" disabled selected>-- Chọn hộp số --</option>
                                            <option v-for="trans in transmissionsList" :key="trans.id"
                                                :value="trans.id">{{ trans.display_name }}</option>
                                        </select>
                                    </div>

                                    <div class="col-md-6">
                                        <div class="d-flex justify-content-between align-items-end mb-2">
                                            <label class="form-label fw-semibold text-dark mb-0">Hãng sản xuất (Brand
                                                Name)
                                                <span class="text-danger">*</span>
                                            </label>

                                            <a href="#" v-if="!isTypingNewBrand"
                                                @click.prevent="isTypingNewBrand = true; carModelData.brand_name = ''"
                                                class="small text-primary fw-medium text-decoration-none">
                                                Thêm hãng mới
                                            </a>
                                            <a href="#" v-else
                                                @click.prevent="isTypingNewBrand = false; carModelData.brand_name = ''"
                                                class="small text-primary fw-medium text-decoration-none">
                                                Chọn từ danh sách
                                            </a>
                                        </div>

                                        <select v-if="!isTypingNewBrand"
                                            class="form-select form-select-lg bg-light border-0 fs-6 py-3 text-body"
                                            v-model="carModelData.brand_name" required>
                                            <option value="" disabled selected>-- Chọn hãng xe --</option>
                                            <option v-for="brand in uniqueBrandsList" :key="brand" :value="brand">
                                                {{ brand }}
                                            </option>
                                        </select>

                                        <input v-else type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3 text-body"
                                            v-model="carModelData.brand_name"
                                            placeholder="Gõ tên hãng xe mới vào đây..." required>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">Tên dòng xe (Model Name)
                                            <span class="text-danger">*</span></label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3 text-body"
                                            v-model="carModelData.model_name" placeholder="VD: Camry" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">Số chỗ ngồi (Seat Count)
                                            <span class="text-danger">*</span></label>
                                        <input type="number"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3 text-body"
                                            v-model="carModelData.seat_count" min="2" max="50" placeholder="VD: 5"
                                            required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">
                                            {{ selectedFuelCategory === 'electric' ? 'Tiêu hao năng lượng (kWh/100km)' : (selectedFuelCategory === 'hybrid' ? 'Tiêu hao Hybrid (L/100km & kWh/100km)' : 'Tiêu hao nhiên liệu (L/100km)') }}
                                            <span class="text-danger">*</span>
                                        </label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3 text-body"
                                            v-model="carModelData.fuel_consumption" 
                                            :placeholder="selectedFuelCategory === 'electric' ? 'VD: 15.5' : (selectedFuelCategory === 'hybrid' ? 'VD: 4.5L + 5.2kWh' : 'VD: 6.5')" required>
                                    </div>
                                </div>

                                <div class="d-flex gap-3 pt-4 border-top justify-content-end mt-auto">
                                    <button type="button" @click="resetCarModelForm"
                                        class="btn btn-white border bg-white px-5 py-3 fw-semibold rounded-3 text-dark">Nhập
                                        lại</button>
                                    <button type="submit" class="btn btn-primary px-5 py-3 fw-bold rounded-3 fs-6"
                                        :disabled="isSubmitting">
                                        <i class="fas fa-plus-circle me-2"></i>Tạo Dòng xe
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    </main>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH TRỌN ĐẦU NỐI DANH MỤC (IMPORTS)
// ============================================================================
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import categoryService from '@/services/category.service';         // Quản lý Phân khúc xe (Sedan, SUV...)
import fuelService from '@/services/fuel.service';                 // Quản lý Loại Nhiên liệu (Xăng, Điện...)
import transmissionService from '@/services/transmission.service'; // Quản lý Loại Hộp số (Số sàn, Tự động)
import carModelService from '@/services/carModel.service';         // Quản lý Dòng xe và Thương hiệu
import amenityService from '@/services/amenity.service';           // Quản lý Nhóm trang bị & Tiện ích xe

const router = useRouter();

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI & TÌNH TRẠNG CHUYỂN HOẠT TRANG (STATE)
// ============================================================================
const activeTab = ref('category');   // Thẻ hiện tại đang chỉnh sửa (category, fuel, transmission, amenity, carmodel)
const isSubmitting = ref(false);     // Cờ khóa trạng thái trong quá trình phát lệnh Lưu lên máy chủ

// Danh sách dữ liệu nguồn dùng cho Danh sách xả xuống (Dropdowns)
const categoriesList = ref([]);      // Danh sách Phân khúc
const fuelsList = ref([]);           // Danh sách Nhiên liệu
const transmissionsList = ref([]);   // Danh sách Hộp số
const uniqueBrandsList = ref([]);    // Danh sách Hãng xe độc lập đã có trong CSDL
const isTypingNewBrand = ref(false); // Cờ cho phép người dùng tự nhập tên Hãng xe mới hoàn toàn

// ============================================================================
// 3. CÁC BIỂU MẪU ĐĂNG KÝ THÔNG SỐ DANH MỤC HỆ THỐNG (FORM MODELS)
// ============================================================================
const categoryData = ref({ name: '', display_name: '' });
const fuelData = ref({ name: '', display_name: '' });
const transmissionData = ref({ name: '', display_name: '' });
const amenityTypeData = ref({ name: '', display_name: '' }); // Biểu mẫu tạo Nhóm tiện ích (An toàn, Giải trí...)
const carModelData = ref({ 
    category_id: '', 
    fuel_id: '', 
    transmission_id: '', 
    brand_name: '', 
    model_name: '', 
    seat_count: '', 
    fuel_consumption: '' 
});

/**
 * Phân loại loại nhiên liệu được chọn: 'hybrid', 'electric', hoặc 'standard' (xăng/dầu)
 */
const selectedFuelCategory = computed(() => {
    if (!carModelData.value.fuel_id || !fuelsList.value.length) return 'standard';
    const selectedFuel = fuelsList.value.find(f => f.id === Number(carModelData.value.fuel_id) || f.id === carModelData.value.fuel_id);
    if (!selectedFuel) return 'standard';
    const combinedName = `${selectedFuel.name || ''} ${selectedFuel.display_name || ''}`.toLowerCase();
    
    // Ưu tiên kiểm tra Hybrid trước (vì Hybrid thường chứa cả từ Xăng và Điện)
    if (combinedName.includes('hybrid') || combinedName.includes('phev') || combinedName.includes('hev') || combinedName.includes('lai') || (combinedName.includes('xăng') && combinedName.includes('điện'))) {
        return 'hybrid';
    }
    // Sau đó kiểm tra Thuần Điện
    if (combinedName.includes('điện') || combinedName.includes('electric') || combinedName.includes('ev') || combinedName.includes('bev')) {
        return 'electric';
    }
    return 'standard';
});

// ============================================================================
// 4. TRÌNH NẠP DỮ LIỆU ĐÒN BẨY CHO DROPDOWN DÒNG XE (DATA HYDRATION)
// ============================================================================
/**
 * Tải đồng thời tất cả dữ liệu nền (Phân khúc, Nhiên liệu, Hộp số, Hãng) để làm trắc nghiệm cho Dòng xe
 */
const loadDropdownData = async () => {
    try {
        const [resCat, resFuel, resTrans, resBrands] = await Promise.all([
            categoryService.getAllCategories(),
            fuelService.getAll(),
            transmissionService.getAll(),
            carModelService.getUniqueBrands()
        ]);

        categoriesList.value = resCat.data?.data || resCat.data || [];
        fuelsList.value = resFuel.data?.data || resFuel.data || [];
        transmissionsList.value = resTrans.data?.data || resTrans.data || [];
        uniqueBrandsList.value = resBrands.data?.data || resBrands.data || [];

    } catch (error) {
        console.error("Lỗi tải thông tin nền:", error);
    }
};

// Lắng nghe sự kiện chuyển Tab: Nếu bật sang Tạo Dòng Xe (carmodel) thì lập tức nạp danh sách hỗ trợ
watch(activeTab, (newTab) => {
    if (newTab === 'carmodel') loadDropdownData();
});

// ============================================================================
// 5. CÔNG HOẠT NGHIỆP VỤ THỤ TINH VÀ ĐĂNG KÝ MỚI DANH MỤC (SUBMIT ACTIONS)
// ============================================================================
/**
 * Phát hành Phân khúc xe mới vào hệ thống
 */
const submitCategory = async () => {
    categoryData.value.name = categoryData.value.name.toLowerCase().trim();
    try {
        isSubmitting.value = true;
        await categoryService.createCategory(categoryData.value);
        alert('Thêm phân khúc thành công!');
        router.push('/admin/category-management');
    } catch (error) {
        if (error.response?.status === 422) {
            alert('Lỗi: Mã/Tên phân khúc này đã tồn tại trên hệ thống. Vui lòng chọn tên khác!');
        } else {
            alert(error.response?.status === 500 ? 'Lỗi hệ thống 500: Hãy kiểm tra Database!' : 'Có lỗi xảy ra khi tạo phân khúc.');
        }
    } finally {
        isSubmitting.value = false;
    }
};

/**
 * Phát hành Loại nhiên liệu mới
 */
const submitFuel = async () => {
    fuelData.value.name = fuelData.value.name.toLowerCase().trim();
    try {
        isSubmitting.value = true;
        await fuelService.create(fuelData.value);
        alert('Thêm nhiên liệu thành công!');
        router.push('/admin/category-management');
    } catch (error) {
        if (error.response?.status === 422) {
            alert('Lỗi: Loại nhiên liệu này đã tồn tại trên hệ thống!');
        } else {
            alert('Lỗi khi tạo nhiên liệu.');
        }
    } finally {
        isSubmitting.value = false;
    }
};

/**
 * Phát hành Loại hộp số xe mới
 */
const submitTransmission = async () => {
    transmissionData.value.name = transmissionData.value.name.toLowerCase().trim();
    try {
        isSubmitting.value = true;
        await transmissionService.create(transmissionData.value);
        alert('Thêm hộp số thành công!');
        router.push('/admin/category-management');
    } catch (error) {
        if (error.response?.status === 422) {
            alert('Lỗi: Loại hộp số này đã tồn tại trên hệ thống!');
        } else {
            alert('Lỗi khi tạo hộp số.');
        }
    } finally {
        isSubmitting.value = false;
    }
};

/**
 * Phát hành Nhóm Tiện ích và Trang bị mới (An toàn, Gói cắm trại, Ghế trẻ em...)
 */
const submitAmenityType = async () => {
    amenityTypeData.value.name = amenityTypeData.value.name.toLowerCase().trim();
    if (amenityTypeData.value.name.includes(' ')) {
        alert('Mã hệ thống không được chứa khoảng trắng!'); return;
    }

    try {
        isSubmitting.value = true;
        await amenityService.createAmenityType(amenityTypeData.value);
        alert('Thêm Nhóm tiện ích thành công!');
        router.push('/admin/category-management');
    } catch (error) {
        if (error.response?.status === 422) {
            alert('Lỗi: Mã Nhóm tiện ích này đã tồn tại trên hệ thống!');
        } else {
            alert('Lỗi khi tạo Nhóm tiện ích.');
        }
    } finally {
        isSubmitting.value = false;
    }
};

/**
 * Phát hành Dòng xe mới (Tổ hợp thông số Phân khúc + Hãng + Tên dòng + Tiêu hao nhiên liệu)
 */
const submitCarModel = async () => {
    try {
        isSubmitting.value = true;
        const payload = { ...carModelData.value };

        if (payload.fuel_consumption) payload.fuel_consumption = String(payload.fuel_consumption);
        if (payload.seat_count) payload.seat_count = Number(payload.seat_count);

        await carModelService.create(payload);

        alert(`Đã lưu dòng xe ${carModelData.value.brand_name} ${carModelData.value.model_name} thành công!`);
        router.push('/admin/category-management');

    } catch (error) {
        console.error("Lỗi từ Backend:", error.response?.data);
        if (error.response?.status === 422) {
            const errorMsg = error.response?.data?.message || error.response?.data?.errors?.model_name?.[0] || 'Lỗi: Phiên bản xe với các thông số này đã tồn tại!';
            alert(errorMsg);
        } else {
            alert('Lỗi khi tạo dòng xe, vui lòng kiểm tra lại!');
        }
    } finally {
        isSubmitting.value = false;
    }
};

/**
 * Lm trống thông số nhập Dòng xe để lập biểu mẫu mới
 */
const resetCarModelForm = () => {
    carModelData.value = {
        category_id: '', fuel_id: '', transmission_id: '',
        brand_name: '', model_name: '', seat_count: '', fuel_consumption: ''
    };
    isTypingNewBrand.value = false;
};

// ============================================================================
// 6. MÓC DẪN VÒNG ĐỜI KHỞI CHẠY (LIFECYCLE HOOKS)
// ============================================================================
onMounted(() => {
    if (activeTab.value === 'carmodel') loadDropdownData();
});
</script>
