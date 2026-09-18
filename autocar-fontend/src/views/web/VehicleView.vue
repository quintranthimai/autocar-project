<template>
    <div>
        <!-- ========================================================== -->
        <!-- 1. KHỐI TIÊU ĐỀ BREADCRUMB ĐẦU TRANG (HEADER BREADCRUMB)     -->
        <!-- ========================================================== -->
        <div class="container-fluid bg-breadcrumb mb-5">
            <div class="container text-center py-5" style="max-width: 900px;">
                <h4 class="text-white display-4 mb-4 wow fadeInDown" data-wow-delay="0.1s">Xe của chúng tôi</h4>
                <ol class="breadcrumb d-flex justify-content-center mb-0 wow fadeInDown" data-wow-delay="0.3s">
                    <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
                    <li class="breadcrumb-item"><a href="#">Trang</a></li>
                    <li class="breadcrumb-item active text-primary">Xe</li>
                </ol>
            </div>
        </div>

        <!-- ========================================================== -->
        <!-- 2. KHỐI TRÌNH BỌC BỘ LỌC VÀ DANH SÁCH XE (MAIN CONTENT AREA) -->
        <!-- ========================================================== -->
        <div class="container-fluid categories py-5">
            <div class="container">
                <div class="row g-4">

                    <!-- KHỐI BÊN TRÁI: BỘ LỌC TÌM KIẾM ĐA CẤP (STICKY FILTER BAR) -->
                    <div class="col-lg-3">
                        <div class="bg-white border rounded p-4 sticky-top shadow-sm"
                            style="top: 100px; max-height: calc(100vh - 120px); overflow-y: auto; z-index: 10;">
                            
                            <!-- Tiêu đề & Nút Làm mới bộ lọc -->
                            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <h5 class="fw-bold mb-0 text-body"><i class="fas fa-filter text-primary me-2"></i>Bộ lọc
                                </h5>
                                <button @click="resetFilters"
                                    class="btn btn-sm btn-link text-danger fw-bold text-decoration-none p-0">Làm
                                    mới</button>
                            </div>

                            <!-- Lọc theo Địa điểm nhận xe -->
                            <div class="mb-4">
                                <label class="form-label small fw-bold text-muted"><i
                                        class="fas fa-map-marker-alt me-1 text-danger"></i> Địa điểm nhận xe</label>
                                <button type="button"
                                    class="input-group w-100 border border-secondary-subtle bg-white p-0 rounded-3 overflow-hidden shadow-none"
                                    @click="openModalById('locationDetailModal')">
                                    <span
                                        class="form-control border-0 text-start bg-white d-flex align-items-center justify-content-between rounded ps-3 pe-3 py-2 text-dark">
                                        <span class="fw-semibold text-truncate d-block">
                                            {{ locationDisplay || 'Chọn địa điểm của bạn' }}
                                        </span>
                                        <span class="fas fa-chevron-down text-muted ms-2"></span>
                                    </span>
                                </button>
                                <small class="text-muted mt-1 d-block" style="font-size: 11px;">Hệ thống ưu tiên hiển
                                    thị xe gần bạn nhất.</small>
                            </div>

                            <!-- Lọc theo Thời gian thuê xe -->
                            <div class="mb-4 border-bottom pb-4">
                                <label class="form-label small fw-bold text-muted"><i
                                        class="fas fa-calendar-alt me-1 text-primary"></i> Thời gian thuê</label>
                                <button type="button"
                                    class="input-group w-100 border border-secondary-subtle bg-white p-0 rounded-3 overflow-hidden shadow-none"
                                    @click="openModalById('timePickerModal')">
                                    <span
                                        class="form-control text-start border-0 bg-white d-flex align-items-center justify-content-between rounded ps-3 pe-3 py-2 text-dark">
                                        <span class="fw-semibold text-truncate d-block" style="font-size: 0.85rem;">{{
                                            timeDisplay }}</span>
                                        <span class="fas fa-chevron-down text-muted ms-2"></span>
                                    </span>
                                </button>
                            </div>

                            <!-- Lọc theo Phân khúc Khối xe (Loại xe) -->
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted"><i class="fas fa-car-side me-1"></i>
                                    Loại xe (Phân khúc)</label>
                                <select class="form-select bg-light text-body fw-medium" v-model="filters.category_id"
                                    @change="handleCategoryChange">
                                    <option value="">Tất cả loại xe</option>
                                    <option v-for="cat in dbCategories" :key="cat.id" :value="cat.id">
                                        {{ cat.display_name }} ({{ cat.name }})
                                    </option>
                                </select>
                            </div>

                            <!-- Lọc theo Hãng sản xuất xe -->
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted"><i class="fas fa-copyright me-1"></i>
                                    Hãng xe</label>
                                <select class="form-select bg-light text-body fw-medium" v-model="filters.brand_name"
                                    @change="handleBrandChange">
                                    <option value="">Tất cả hãng xe</option>
                                    <option v-for="brand in availableBrands" :key="brand" :value="brand">
                                        {{ brand }}
                                    </option>
                                </select>
                            </div>

                            <!-- Lọc theo Tên dòng xe cụ thể -->
                            <div class="mb-4">
                                <label class="form-label small fw-bold text-muted"><i class="fas fa-car me-1"></i> Tên
                                    dòng xe</label>
                                <select class="form-select bg-light text-body fw-medium" v-model="filters.model_name"
                                    @change="fetchVehicles">
                                    <option value="">Tất cả dòng xe</option>
                                    <option v-for="model in availableModels" :key="model" :value="model">
                                        {{ model }}
                                    </option>
                                </select>
                            </div>

                            <!-- Bộ lọc Đặc quyền: Chủ xe uy tín, Giao tận nơi, Miễn thế chấp -->
                            <div class="mb-4 pt-3 border-top">
                                <label class="form-label small fw-bold text-muted mb-3"><i
                                        class="fas fa-star text-warning me-1"></i> Dịch vụ & Đặc quyền</label>

                                <div class="form-check form-switch mb-3">
                                    <input class="form-check-input" type="checkbox" role="switch" id="filterSuperHost"
                                        v-model="filters.min_owner_rating" true-value="5" false-value=""
                                        @change="fetchVehicles" style="cursor: pointer;">
                                    <label class="form-check-label text-body fw-medium" for="filterSuperHost"
                                        style="cursor: pointer;">
                                        <i class="fas fa-medal text-info ms-1 me-1"></i> Chủ xe 5<i
                                            class="fas fa-star text-warning" style="font-size: 10px;"></i>
                                    </label>
                                </div>
                                <div class="form-check form-switch mb-3">
                                    <input class="form-check-input" type="checkbox" role="switch" id="filterDelivery"
                                        v-model="filters.is_delivery_supported" @change="fetchVehicles"
                                        style="cursor: pointer;">
                                    <label class="form-check-label text-body fw-medium" for="filterDelivery"
                                        style="cursor: pointer;">
                                        <i class="fas fa-map-marker-alt text-danger ms-1 me-2"></i> Giao nhận tận nơi
                                    </label>
                                </div>
                                <div class="form-check form-switch mb-3">
                                    <input class="form-check-input" type="checkbox" role="switch" id="filterMortgage"
                                        v-model="filters.is_mortgage_exempt" @change="fetchVehicles"
                                        style="cursor: pointer;">
                                    <label class="form-check-label text-body fw-medium" for="filterMortgage"
                                        style="cursor: pointer;">
                                        <i class="fas fa-id-card text-success ms-1 me-1"></i> Miễn thế chấp
                                    </label>
                                </div>

                            </div>

                            <!-- Lọc theo Cấu hình Cơ khí: Hộp số & Nhiên liệu -->
                            <div class="row gx-2 mb-3 border-top pt-3">
                                <div class="col-6">
                                    <label class="form-label small fw-bold text-muted">Hộp số</label>
                                    <select class="form-select form-select-sm bg-light text-body fw-medium"
                                        v-model="filters.transmission_id" @change="fetchVehicles">
                                        <option value="">Tất cả</option>
                                        <option v-for="t in dbTransmissions" :key="t.id" :value="t.id">{{ t.display_name
                                        }}</option>
                                    </select>
                                </div>
                                <div class="col-6">
                                    <label class="form-label small fw-bold text-muted">Nhiên liệu</label>
                                    <select class="form-select form-select-sm bg-light text-body fw-medium"
                                        v-model="filters.fuel_id" @change="fetchVehicles">
                                        <option value="">Tất cả</option>
                                        <option v-for="f in dbFuels" :key="f.id" :value="f.id">{{ f.display_name }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <!-- Lọc theo Thanh trượt Ngân sách Giá thuê tối đa/ngày -->
                            <div class="mb-2 border-top pt-3">
                                <label class="form-label small fw-bold text-muted d-flex justify-content-between">
                                    <span>Giá tối đa/ngày:</span>
                                    <span class="text-primary fw-bold fs-6">{{ formatPrice(filters.max_price) }}</span>
                                </label>
                                <input type="range" class="form-range" min="300000" max="3000000" step="50000"
                                    v-model="filters.max_price" @input="debounceSearch">
                            </div>
                        </div>
                    </div>

                    <!-- KHỐI BÊN PHẢI: KHÔNG GIAN HIỂN THỊ DANH SÁCH XE PHÙ HỢP (CAR GRID) -->
                    <div class="col-lg-9">
                        <!-- Tiêu đề tổng hợp thông số thời gian lọc hiện tại -->
                        <div class="text-center mx-auto pb-4" style="max-width: 800px;">
                            <h1 class="display-5 text-capitalize mb-3 text-body">Danh sách <span
                                    class="text-primary">xe</span></h1>
                            <p v-if="filters.start_datetime && filters.end_datetime" class="text-muted">
                                Hiển thị các xe trống lịch từ <b class="text-dark">{{
                                    formatDateDisplay(filters.start_datetime) }}</b> đến <b class="text-dark">{{
                                        formatDateDisplay(filters.end_datetime) }}</b>
                            </p>
                        </div>

                        <!-- Trạng thái 1: Màn hình Đang Tải (Loading State) -->
                        <div v-if="loading" class="text-center py-5">
                            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                            </div>
                            <p class="mt-3 text-muted fw-bold">Hệ thống đang tìm kiếm xe...</p>
                        </div>

                        <!-- Trạng thái 2: Màn hình Trống rỗng khi không có xe phù hợp (Empty State) -->
                        <div v-else-if="vehicles.length === 0"
                            class="text-center py-5 bg-white border rounded shadow-sm">
                            <img src="/img/car-1.png" class="img-fluid mb-3 opacity-50" style="max-width: 200px;"
                                alt="Empty">
                            <h5 class="fw-bold text-muted mb-0">Không tìm thấy chiếc xe nào phù hợp.</h5>
                            <p class="text-muted small mt-2">Vui lòng thay đổi thời gian/địa điểm hoặc xóa bớt bộ lọc.
                            </p>
                            <button @click="resetFilters" class="btn btn-outline-primary mt-3 rounded-pill px-4">Làm mới
                                bộ lọc</button>
                        </div>

                        <!-- Trạng thái 3: Lưới thẻ xe (VehicleCard Grid) -->
                        <div v-else class="row g-4">
                            <div class="col-md-6 col-xl-4" v-for="car in vehicles" :key="car.id">
                                <VehicleCard :car="car" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <!-- ========================================================== -->
        <!-- 3. KHỐI MODAL CHỌN ĐỊA ĐIỂM & THỜI GIAN DÙNG CHUNG           -->
        <!-- ========================================================== -->
        <LocationModal @locationSelected="handleLocationSelect" />
        <TimePickerModal @timeSelected="handleTimeSelect" />

    </div>
</template>

<script setup>
// =====================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & KHỞI TẠO BIẾN TRẠNG THÁI (STATE & STORES)
// =====================================================================
import axios from 'axios';
import { ref, computed, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import vehicleService from '@/services/vehicle.service';
import VehicleCard from '@/components/common/VehicleCard.vue';

// Nhập Dịch vụ Danh mục & Bộ 2 Modal dùng chung toàn hệ thống
import categoryService from '@/services/category.service';
import LocationModal from '@/components/common/LocationModal.vue';
import TimePickerModal from '@/components/common/TimePickerModal.vue';
import { useRentalTimeStore } from '@/stores/rentalTime.store';

const route = useRoute();
const router = useRouter();
const rentalTimeStore = useRentalTimeStore();
const vehicles = ref([]);
const loading = ref(true);
let timeoutId = null; // Biến hỗ trợ chống rung (Debounce) khi kéo thanh trượt giá

// Biến lưu trữ hiển thị thông tin trực quan cho bộ lọc bên thanh bên (Sidebar)
const locationDisplay = ref('');
const timeDisplay = computed(() => rentalTimeStore.displayString || 'Chọn thời gian thuê');

// Danh sách danh mục cấu hình tải từ Backend (Loại xe, Nhiên liệu, Hộp số, Dòng xe)
const dbCategories = ref([]);
const dbFuels = ref([]);
const dbTransmissions = ref([]);
const dbCarModels = ref([]);

// =====================================================================
// 2. QUẢN LÝ BỘ LỌC TÌM KIẾM ĐA HỆ THỐNG (FILTER OPTIONS STATE)
// =====================================================================
const filters = ref({
    model_name: '', brand_name: '', category_id: '', seat_count: '', transmission_id: '', fuel_id: '',
    min_owner_rating: '', is_mortgage_exempt: false, is_delivery_supported: false,
    is_hourly_rental: false, has_discount: false, min_price: 0, max_price: 3000000, old_budget_car: false,
    location_name: '', latitude: '', longitude: '', start_datetime: '', end_datetime: ''
});

/**
 * Hàm tải dữ liệu danh sách Cấu hình Bộ lọc (Categories, Fuels, Transmissions) từ API
 */
const loadFilterOptions = async () => {
    try {
        const res = await axios.get('https://autocar-citx.onrender.com/api/v1/web/search/filter-options');
        const data = res.data.data;
        dbCategories.value = data.categories || [];
        dbFuels.value = data.fuels || [];
        dbTransmissions.value = data.transmissions || [];
        dbCarModels.value = data.car_models || [];
    } catch (error) {
        console.error("Lỗi tải cấu hình bộ lọc:", error);
    }
};

// =====================================================================
// 3. BỘ TIÊU CHỦ ĐỘNG (COMPUTED): LIÊN KẾT PHỤ THUỘC HÃNG XE & DÒNG XE
// =====================================================================

// Danh sách Hãng xe có sẵn (Tự động lọc lại theo Loại Xe / Phân khúc đã chọn)
const availableBrands = computed(() => {
    let filtered = dbCarModels.value;
    if (filters.value.category_id) {
        filtered = filtered.filter(item => String(item.category_id) === String(filters.value.category_id));
    }
    return [...new Set(filtered.map(item => item.brand_name))].sort();
});

// Danh sách Tên dòng xe (Tự động lọc lại theo Loại xe và Hãng xe tương ứng)
const availableModels = computed(() => {
    let filtered = dbCarModels.value;
    if (filters.value.category_id) {
        filtered = filtered.filter(item => String(item.category_id) === String(filters.value.category_id));
    }
    if (filters.value.brand_name) {
        filtered = filtered.filter(item => item.brand_name === filters.value.brand_name);
    }
    return [...new Set(filtered.map(item => item.model_name))].sort();
});

// Sự kiện đổi danh mục: Xóa trắng Hãng xe & Dòng xe cũ rồi tải lại danh sách xe
const handleCategoryChange = () => { 
    filters.value.brand_name = ''; 
    filters.value.model_name = ''; 
    fetchVehicles(); 
};

// Sự kiện đổi hãng xe: Xóa trắng Dòng xe cũ và tải lại danh sách xe
const handleBrandChange = () => { 
    filters.value.model_name = ''; 
    fetchVehicles(); 
};

// =====================================================================
// 4. BỘ HÀM QUẢN TRỊ MODAL & ĐỒNG BỘ LỊCH THUÊ (MODAL CONTROLLERS)
// =====================================================================
const syncTimeFilterFromStore = () => {
    filters.value.start_datetime = rentalTimeStore.startDatetime;
    filters.value.end_datetime = rentalTimeStore.endDatetime;
};

const getOrCreateModalInstance = (el) => {
    const ModalCtor = window.bootstrap?.Modal;
    if (!ModalCtor || !el) return null;

    if (typeof ModalCtor.getOrCreateInstance === 'function') {
        return ModalCtor.getOrCreateInstance(el);
    }

    if (typeof ModalCtor.getInstance === 'function') {
        const instance = ModalCtor.getInstance(el);
        if (instance) return instance;
    }

    return new ModalCtor(el);
};

const openModalById = (modalId) => {
    const modalEl = document.getElementById(modalId);
    const modal = getOrCreateModalInstance(modalEl);
    if (modal && typeof modal.show === 'function') {
        modal.show();
    }
};

/**
 * Xử lý khi chọn xong Địa điểm nhận xe từ Modal -> Gọi API fetchVehicles ngay lập tức
 */
const handleLocationSelect = (data) => {
    locationDisplay.value = data.name;
    filters.value.location_name = data.name;
    filters.value.latitude = data.lat;
    filters.value.longitude = data.lng;

    fetchVehicles();
};

/**
 * Xử lý khi chọn xong Khung giờ thuê xe từ Modal -> Gọi API fetchVehicles ngay lập tức
 */
const handleTimeSelect = (data) => {
    rentalTimeStore.setSelection(data);
    syncTimeFilterFromStore();

    fetchVehicles();
};

// =====================================================================
// 5. BỘ HÀM GỌI DỊCH VỰ KẾT NỐI API & ĐỊNH DANG HIỆN N THỊ (API SEARCH)
// =====================================================================
const formatPrice = (value) => value ? value.toLocaleString('vi-VN') + 'đ' : '0đ';
const formatPriceShort = (value) => value ? Math.round(value / 1000) + 'K' : '0K';
const formatDateDisplay = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
};

/**
 * Phương thức cốt lõi truy xuất Danh sách xe phù hợp bộ lọc từ Backend (searchVehicles)
 */
const fetchVehicles = async () => {
    loading.value = true;
    try {
        const res = await vehicleService.searchVehicles(filters.value);
        vehicles.value = res.data.data.data || res.data.data || [];
    } catch (error) {
        console.error("Lỗi khi kéo danh sách xe:", error);
    } finally {
        loading.value = false;
    }
};

// Hàm chống rung (Debounce) 500ms khi người dùng kéo thanh trượt Giá tối đa (tránh gọi API liên tục gây chóp máy chủ)
const debounceSearch = () => { 
    clearTimeout(timeoutId); 
    timeoutId = setTimeout(() => { fetchVehicles(); }, 500); 
};

/**
 * Hàm làm mới toàn bộ bộ lọc về mặc định ban đầu và dọn dẹp tham số trên URL
 */
const resetFilters = () => {
    filters.value = {
        model_name: '', brand_name: '', category_id: '', seat_count: '', transmission_id: '', fuel_id: '',
        min_owner_rating: '', is_mortgage_exempt: false, is_delivery_supported: false, is_instant_booking: false,
        is_hourly_rental: false, has_discount: false, min_price: 0, max_price: 3000000, old_budget_car: false,
        location_name: '', latitude: '', longitude: '', start_datetime: '', end_datetime: ''
    };
    locationDisplay.value = '';
    rentalTimeStore.clearSelection();
    fetchVehicles();
    router.replace({ query: {} }); // Xóa tham số tìm kiếm trên URL
};

// =====================================================================
// 6. MÓC TRÌNH DẪN VÒNG ĐỜI ONMOUNTED (URL PARAMS HYDRATION)
// =====================================================================
onMounted(() => {
    // Tải cấu hình bộ lọc từ máy chủ
    loadFilterOptions();

    // Bóc tách tham số Query từ trang khác (ví dụ: Trang chủ chuyển sang)
    const q = route.query;

    // Phục hồi dữ liệu Vị trí địa lý
    if (q.location) {
        locationDisplay.value = q.location;
        filters.value.location_name = q.location;
    }
    if (q.lat) filters.value.latitude = q.lat;
    if (q.lng) filters.value.longitude = q.lng;
    if (q.keyword) filters.value.model_name = q.keyword;

    // Phục hồi khung giờ chọn thuê
    if (q.startDate && q.endDate) {
        const startTime = q.startTime || '08:00';
        const endTime = q.endTime || '20:00';

        rentalTimeStore.setSelection({
            start_datetime: `${q.startDate}T${startTime}`,
            end_datetime: `${q.endDate}T${endTime}`,
            mode: q.mode,
        });
    }

    syncTimeFilterFromStore();
    
    // Khởi chạy lấy dữ liệu xe lần đầu
    fetchVehicles();
});
</script>