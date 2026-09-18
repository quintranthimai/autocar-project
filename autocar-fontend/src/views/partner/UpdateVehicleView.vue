<template>
    <div class="bg-light py-5 min-vh-100">
        <div class="container pt-3">
            <div class="row justify-content-center">
                <div class="col-12">
                    
                    <div class="d-flex align-items-center mb-4">
                        <router-link to="/partner/my-cars" class="btn btn-white shadow-sm rounded-circle me-3" style="width: 40px; height: 40px; padding: 0; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-arrow-left text-primary"></i>
                        </router-link>
                        <div>
                            <h2 class="fw-bold mb-0 text-dark">Cập nhật thông tin phương tiện</h2>
                            <p class="text-muted mb-0 mt-1">Cập nhật giá thuê, địa chỉ và tiện ích cho xe của bạn.</p>
                        </div>
                    </div>

                    <div v-if="loading" class="text-center py-5 my-5">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="mt-3 text-muted">Đang tải dữ liệu xe...</p>
                    </div>

                    <div v-else class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <div class="card-body p-4 p-md-5">
                            <form @submit.prevent="submitUpdate">
                                
                                <h4 class="fw-bold mb-4 pb-2 border-bottom"><i class="fas fa-info-circle text-primary me-2"></i>Thông tin chung</h4>
                                
                                <div class="row mb-4">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label fw-bold">Biển số xe (Không thể đổi)</label>
                                        <input type="text" class="form-control bg-light" v-model="form.license_plate" disabled>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label fw-bold">Giá thuê 1 ngày (VNĐ) <span class="text-danger">*</span></label>
                                        <input type="number" class="form-control py-2" v-model="form.base_price" required min="300000" max="3000000">
                                        <small class="text-muted">Giá từ 300k - 3tr VNĐ</small>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label fw-bold">Mô tả về xe</label>
                                    <textarea class="form-control" rows="4" v-model="form.description" placeholder="Mô tả chi tiết về xe..."></textarea>
                                </div>

                                <h4 class="fw-bold mb-4 mt-5 pb-2 border-bottom"><i class="fas fa-map-marker-alt text-primary me-2"></i>Địa chỉ giao xe</h4>
                                
                                <div class="position-relative cursor-pointer mb-4" @click="openLocationModal">
                                    <label class="form-label fw-bold">Địa chỉ bãi đậu xe mặc định <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control py-3 px-4 rounded-3 text-dark bg-light border-1"
                                        v-model="form.parking_address" placeholder="Nhấn vào đây để chọn địa chỉ trên bản đồ..." readonly required>
                                    <i class="fas fa-map-pin position-absolute text-danger" style="right: 15px; top: 45px; font-size: 1.2rem;"></i>
                                </div>

                                <!-- GIAO XE TẬN NƠI -->
                                <div class="p-4 bg-light border rounded-4 mb-4">
                                    <div class="form-check form-switch fs-5 mb-3 d-flex justify-content-between align-items-center px-0">
                                        <label class="form-check-label fw-bold text-dark fs-5" for="delivery">Giao xe tận nơi</label>
                                        <input class="form-check-input ms-0" type="checkbox" role="switch" id="delivery" v-model="form.is_delivery_supported" style="cursor: pointer;">
                                    </div>
                                    <div class="row g-4" v-if="form.is_delivery_supported">
                                        <div class="col-md-6">
                                            <label class="form-label text-dark mb-3">Quãng đường giao xe tối đa</label>
                                            <input type="range" class="w-100" style="accent-color: var(--bs-primary); cursor: pointer;" min="5" max="50" step="1" v-model="form.delivery_radius_km">
                                            <div class="d-flex justify-content-between mt-2">
                                                <span class="small text-muted">Đề xuất: 20km</span>
                                                <span class="fw-bold text-primary">{{ form.delivery_radius_km }}km</span>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label text-dark mb-3">Phí giao nhận xe cho mỗi km</label>
                                            <input type="range" class="w-100" style="accent-color: var(--bs-primary); cursor: pointer;" min="5000" max="30000" step="1000" v-model="form.delivery_fee_per_km">
                                            <div class="d-flex justify-content-between mt-2">
                                                <span class="small text-muted">Đề xuất: 10K</span>
                                                <span class="fw-bold text-primary">{{ form.delivery_fee_per_km / 1000 }}K</span>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label text-dark mb-3">Miễn phí giao nhận xe trong vòng</label>
                                            <input type="range" class="w-100" style="accent-color: var(--bs-primary); cursor: pointer;" min="0" max="20" step="1" v-model="form.free_delivery_radius_km">
                                            <div class="d-flex justify-content-between mt-2">
                                                <span class="small text-muted">Đề xuất: 0km</span>
                                                <span class="fw-bold text-primary">{{ form.free_delivery_radius_km }}km</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h4 class="fw-bold mb-4 mt-5 pb-2 border-bottom"><i class="fas fa-tags text-primary me-2"></i>Giảm giá & Tuỳ chọn</h4>
                                
                                <!-- GIẢM GIÁ -->
                                <div class="p-4 bg-light border rounded-4 mb-4">
                                    <div class="form-check form-switch fs-5 mb-3 d-flex justify-content-between align-items-center px-0">
                                        <label class="form-check-label fw-bold text-dark fs-5" for="discount">Giảm giá</label>
                                        <input class="form-check-input ms-0" type="checkbox" role="switch" id="discount" v-model="form.is_discount_enabled" style="cursor: pointer;">
                                    </div>
                                    <div class="row g-4" v-if="form.is_discount_enabled">
                                        <div class="col-12">
                                            <label class="form-label text-dark mb-3">Giảm giá thuê tuần (% trên đơn giá)</label>
                                            <input type="range" class="w-100" style="accent-color: var(--bs-primary); cursor: pointer;" min="0" max="50" step="1" v-model="form.weekly_discount_percent">
                                            <div class="d-flex justify-content-between mt-2">
                                                <span class="small text-muted">Đề xuất: 20%</span>
                                                <span class="fw-bold text-primary">{{ form.weekly_discount_percent }}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                <!-- THẾ CHẤP -->
                                <div class="p-4 bg-light border rounded-4 mb-4">
                                    <div class="form-check form-switch fs-5 mb-0 d-flex justify-content-between align-items-center px-0">
                                        <label class="form-check-label fw-bold text-dark fs-5" for="mortgage">Yêu cầu thế chấp tài sản</label>
                                        <input class="form-check-input ms-0" type="checkbox" role="switch" id="mortgage" v-model="form.require_mortgage" style="cursor: pointer;">
                                    </div>
                                    <div class="text-muted mt-2">Nếu bật, khách thuê sẽ phải để lại tài sản thế chấp (xe máy/tiền mặt) khi nhận xe.</div>
                                </div>

                                <!-- ĐIỀU KHOẢN -->
                                <div class="mb-4">
                                    <label class="form-label fw-bold text-dark">Điều khoản cho thuê</label>
                                    <textarea class="form-control py-3 px-4 rounded-3 text-dark bg-light border-1" rows="3" v-model="form.rental_terms" placeholder="VD: Không hút thuốc, rửa xe trước khi trả..."></textarea>
                                </div>

                                <h4 class="fw-bold mb-4 mt-5 pb-2 border-bottom"><i class="fas fa-coins text-primary me-2"></i>Phụ phí phát sinh</h4>
                                
                                <div class="p-4 bg-light border rounded-4 mb-4">
                                    <div class="row g-4">
                                        <div class="col-md-6">
                                            <div class="form-check form-switch fs-5 mb-2 px-0 d-flex justify-content-between">
                                                <label class="form-check-label fw-bold fs-6" for="cleaning_fee">Phụ phí vệ sinh</label>
                                                <input class="form-check-input ms-0" type="checkbox" role="switch" id="cleaning_fee" v-model="form.has_cleaning_fee">
                                            </div>
                                            <div v-if="form.has_cleaning_fee" class="mt-2">
                                                <input type="number" class="form-control" v-model="form.cleaning_fee_price" placeholder="VD: 100000">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-check form-switch fs-5 mb-2 px-0 d-flex justify-content-between">
                                                <label class="form-check-label fw-bold fs-6" for="deodorize_fee">Phụ phí khử mùi</label>
                                                <input class="form-check-input ms-0" type="checkbox" role="switch" id="deodorize_fee" v-model="form.has_deodorize_fee">
                                            </div>
                                            <div v-if="form.has_deodorize_fee" class="mt-2">
                                                <input type="number" class="form-control" v-model="form.deodorize_fee_price" placeholder="VD: 350000">
                                                <small class="text-muted mt-1 d-block">Có thể áp dụng linh hoạt cho mùi thuốc lá, thức ăn, hoặc mùi đặc chủng (hải sản, sầu riêng...)</small>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-check form-switch fs-5 mb-2 px-0 d-flex justify-content-between">
                                                <label class="form-check-label fw-bold fs-6" for="mileage">Phí vượt giới hạn</label>
                                                <input class="form-check-input ms-0" type="checkbox" role="switch" id="mileage" v-model="form.is_mileage_limit_enabled">
                                            </div>
                                            <div v-if="form.is_mileage_limit_enabled" class="mt-2 row">
                                                <div class="col-6">
                                                   <small class="text-muted mb-1 d-block">Số km / ngày</small>
                                                   <input type="number" class="form-control" v-model="form.mileage_limit_per_day" placeholder="400">
                                                </div>
                                                <div class="col-6">
                                                   <small class="text-muted mb-1 d-block">Phí vượt (đ/km)</small>
                                                   <input type="number" class="form-control" v-model="form.extra_fee_per_km" placeholder="3000">
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <h4 class="fw-bold mb-4 mt-5 pb-2 border-bottom"><i class="fas fa-concierge-bell text-primary me-2"></i>Tiện ích xe</h4>
                                <div class="row g-3 mb-4">
                                    <div class="col-sm-6 col-md-4" v-for="amenity in options.amenities" :key="amenity.id">
                                        <div class="form-check custom-checkbox">
                                            <input class="form-check-input" type="checkbox" :value="amenity.id" :id="'amenity_' + amenity.id" v-model="form.amenities">
                                            <label class="form-check-label fw-medium" :for="'amenity_' + amenity.id">
                                                <i :class="amenity.icon || 'fas fa-check'" class="me-2 text-primary"></i> {{ amenity.display_name }}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-end mt-5 pt-3 border-top">
                                    <button type="submit" class="btn btn-primary px-5 py-3 rounded-pill fw-bold" :disabled="submitting">
                                        <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                                        <i v-else class="fas fa-save me-2"></i> Lưu cập nhật
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <LocationModal id="locationUpdateModal" title="Chọn địa chỉ" :showAirports="false" @locationSelected="handleLocationSelected" />
    </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & THỰC THỂ MODAL (IMPORTS)
// ============================================================================
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LocationModal from '@/components/common/LocationModal.vue';
import vehicleService from '@/services/vehicle.service';

const router = useRouter();
const route = useRoute();

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI & TÌNH HUỐNG GIAO DIỆN (STATE MANAGEMENT)
// ============================================================================
const loading = ref(true);     // Cờ trạng thái Skeleton Loading chờ nạp dữ liệu xe cũ
const submitting = ref(false); // Cờ khóa biểu mẫu khi đang gửi cập nhật

const options = ref({ amenities: [] }); // Danh sách Trang bị tiện ích có sẵn trên hệ thống

// ============================================================================
// 3. HỒ SƠ BIỂU MẪU ĐIỀU CHỈNH CHI TIẾT Ô TÔ (VEHICLE FORM STATE)
// ============================================================================
const form = ref({
    license_plate: '',
    base_price: 500000,
    description: '',
    parking_address: '',
    latitude: null,
    longitude: null,
    amenities: [],
    
    // Thiết lập tùy chọn Giao/Nhận
    is_delivery_supported: false,
    delivery_radius_km: 20,
    delivery_fee_per_km: 10000,
    free_delivery_radius_km: 0,
    
    // Thiết lập Khuyến mãi theo tuần/tháng
    is_discount_enabled: true,
    weekly_discount_percent: 25,
    
    // Các giới hạn & Quy định thuê
    is_mileage_limit_enabled: true,
    mileage_limit_per_day: 400,
    extra_fee_per_km: 3000,
    require_mortgage: true,
    rental_terms: '',
    
    // Hệ thống phụ phí (Vệ sinh & Khử mùi)
    has_cleaning_fee: false,
    cleaning_fee_price: 100000,
    has_deodorize_fee: false,
    deodorize_fee_price: 350000
});

// ============================================================================
// 4. TRÌNH ĐIỀU KHIỂN MODAL CHỌN TOA ĐỘ ĐỊA CHỈ TRÊN BẢN ĐỒ (LOCATION HANDLER)
// ============================================================================
/**
 * Mở hộp thoại Modal chọn vị trí trên Bản đồ
 */
const openLocationModal = () => {
    const modalEl = document.getElementById('locationUpdateModal');
    if (modalEl && window.bootstrap) {
        let modal = window.bootstrap.Modal.getInstance(modalEl);
        if (!modal) modal = new window.bootstrap.Modal(modalEl);
        modal.show();
    }
};

/**
 * Cập nhật thông số tọa độ và địa chỉ bãi đỗ khi người dùng lựa chọn xong từ Modal
 */
const handleLocationSelected = (location) => {
    form.value.parking_address = location.display_name || location.name || '';
    form.value.latitude = location.lat;
    form.value.longitude = location.lng;
};

// ============================================================================
// 5. TRÌNH ĐỒNG BỘ VÀ TRUY NỘI HẢO (DATA HYDRATION & MAPPING API)
// ============================================================================
/**
 * Tải song song Danh sách trang bị và Thông tin hiện tại của Xe (Promise.all)
 * Đồng thời thực hiện đối chiếu (Mapping) từ dữ liệu Server sang Biểu mẫu Vue
 */
const loadData = async () => {
    loading.value = true;
    try {
        const [optRes, vehRes] = await Promise.all([
            vehicleService.getFormOptions(),
            vehicleService.getById(route.params.id)
        ]);

        if (optRes.data.success) {
            options.value = optRes.data.data;
        }

        if (vehRes.data.success) {
            const vehicle = vehRes.data.data.vehicle_info;
            form.value.license_plate = vehicle.license_plate;
            form.value.base_price = vehicle.base_price;
            form.value.description = vehicle.description || '';
            form.value.parking_address = vehicle.parking_address;
            form.value.latitude = vehicle.latitude;
            form.value.longitude = vehicle.longitude;
            
            form.value.is_delivery_supported = vehicle.is_delivery_supported === 1 || vehicle.is_delivery_supported === true;
            form.value.delivery_radius_km = vehicle.delivery_radius_km || 20;
            form.value.delivery_fee_per_km = vehicle.delivery_fee_per_km || 10000;
            form.value.free_delivery_radius_km = vehicle.free_delivery_radius_km || 0;
            
            form.value.is_discount_enabled = vehicle.is_discount_enabled === 1 || vehicle.is_discount_enabled === true;
            form.value.weekly_discount_percent = vehicle.weekly_discount_percent || 0;
            
            form.value.is_mileage_limit_enabled = vehicle.is_mileage_limit_enabled === 1 || vehicle.is_mileage_limit_enabled === true;
            form.value.mileage_limit_per_day = vehicle.mileage_limit_per_day || 400;
            form.value.extra_fee_per_km = vehicle.extra_fee_per_km || 3000;
            
            form.value.require_mortgage = !(vehicle.is_mortgage_exempt === 1 || vehicle.is_mortgage_exempt === true);
            form.value.rental_terms = vehicle.rental_terms || '';

            // Map danh sách tiện ích
            if (vehicle.amenities) {
                form.value.amenities = vehicle.amenities.map(a => a.id);
            }
            
            // Map danh sách phụ phí (Vệ sinh & Khử mùi)
            if (vehicle.surcharges && vehicle.surcharges.length > 0) {
                const cleaning = vehicle.surcharges.find(s => s.surcharge_type === 'cleaning');
                if (cleaning) {
                    form.value.has_cleaning_fee = true;
                    form.value.cleaning_fee_price = cleaning.price;
                }
                const deodorize = vehicle.surcharges.find(s => s.surcharge_type === 'deodorize' || s.surcharge_type === 'deodorizing');
                if (deodorize) {
                    form.value.has_deodorize_fee = true;
                    form.value.deodorize_fee_price = deodorize.price;
                }
            }
        }
    } catch (e) {
        console.error(e);
        alert('Lỗi tải dữ liệu xe!');
        router.push('/partner/my-cars');
    } finally {
        loading.value = false;
    }
};

// ============================================================================
// 6. NGHIỆP VỤ ĐỆ TRÌNH CẬP NHẬT THÔNG TIN LÊN BACKEND (SUBMIT UPDATE API)
// ============================================================================
/**
 * Xử lý đóng gói mảng Phụ phí và đẩy Dữ liệu cập nhật xe lên máy chủ
 */
const submitUpdate = async () => {
    if (!form.value.latitude || !form.value.longitude) {
        alert('Vui lòng chọn địa chỉ giao xe trên bản đồ!');
        return;
    }

    submitting.value = true;
    try {
        const payload = { ...form.value };
        payload.is_mortgage_exempt = !form.value.require_mortgage;
        
        // Cấu trúc lại danh sách Surcharges (Phụ phí) gửi đi
        const surcharges = [];
        if (payload.has_cleaning_fee) {
            surcharges.push({ surcharge_type: 'cleaning', price: payload.cleaning_fee_price });
        }
        if (payload.has_deodorize_fee) {
            surcharges.push({ surcharge_type: 'deodorize', price: payload.deodorize_fee_price, description: 'Phụ phí phát sinh khi xe hoàn trả bị ám mùi khó chịu (mùi thuốc lá, thực phẩm nặng mùi, sầu riêng, hải sản...)' });
        }

        payload.surcharges = surcharges;

        const res = await vehicleService.updateVehicle(route.params.id, payload);
        if (res.data.success) {
            alert('Cập nhật thành công!');
            router.push('/partner/my-cars');
        }
    } catch (e) {
        alert(e.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
    } finally {
        submitting.value = false;
    }
};

// ============================================================================
// 7. MÓC DẪN VÒNG ĐỜI HỆ THỐNG (LIFECYCLE HOOKS)
// ============================================================================
onMounted(() => {
    loadData();
});
</script>

<style scoped>
.custom-checkbox .form-check-input {
    width: 1.25rem;
    height: 1.25rem;
    margin-top: 0.15rem;
    border: 2px solid #dee2e6;
}
.custom-checkbox .form-check-input:checked {
    background-color: #0d6efd;
    border-color: #0d6efd;
}
</style>