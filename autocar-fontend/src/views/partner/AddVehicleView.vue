<template>
    <div class="bg-light py-5 min-vh-100">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8">

                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <button class="btn btn-white bg-white border shadow-sm fw-bold text-dark"
                            @click="$router.push('/profile')">
                            <i class="fas fa-chevron-left me-2"></i>Quay lại
                        </button>
                        <h3 class="fw-bold mb-0 text-dark">Đăng ký xe cho thuê</h3>
                        <div style="width: 100px;"></div>
                    </div>

                    <!-- THANH TIẾN ĐỘ -->
                    <div class="card border-0 shadow-sm rounded-4 mb-4">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-center position-relative">
                                <div class="position-absolute top-50 start-0 w-100 bg-secondary bg-opacity-25"
                                    style="height: 3px; z-index: 1; transform: translateY(-150%);"></div>
                                <div class="position-absolute top-50 start-0 bg-primary transition-all"
                                    :style="{ width: ((step - 1) * 33.33) + '%', height: '3px', zIndex: 2, transform: 'translateY(-150%)' }">
                                </div>

                                <div v-for="i in 4" :key="i"
                                    class="d-flex flex-column align-items-center bg-white px-2 position-relative"
                                    style="z-index: 3;">
                                    <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all"
                                        :class="step >= i ? 'bg-primary text-white' : 'bg-light text-muted border'"
                                        style="width: 45px; height: 45px; font-size: 1.1rem;">
                                        {{ i }}
                                    </div>
                                    <span class="small fw-semibold mt-2"
                                        :class="step >= i ? 'text-primary' : 'text-muted'">
                                        {{ stepNames[i - 1] }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4">
                        <div class="card-body p-4 p-md-5">

                            <!-- BƯỚC 1: THÔNG TIN CƠ BẢN -->
                            <div v-show="step === 1">
                                <h5 class="fw-bold mb-4">Biển số xe</h5>
                                <div class="mb-4">
                                    <input type="text"
                                        class="form-control form-control-lg bg-light border-0 text-uppercase fw-bold text-primary"
                                        v-model="form.license_plate" placeholder="VD: 51H-123.45">
                                    <div class="form-text text-danger small mt-2">Lưu ý: Biển số xe sẽ không thể thay
                                        đổi sau khi đăng ký.</div>
                                </div>

                                <h5 class="fw-bold mb-4 border-top pt-4">Thông tin cơ bản</h5>
                                <div class="row g-4 mb-4">
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold text-dark">Hãng xe <span
                                                class="text-danger">*</span></label>
                                        <select class="form-select bg-light border-0 py-2" v-model="selectedBrand"
                                            @change="form.car_model_id = ''">
                                            <option value="">-- Chọn Hãng xe --</option>
                                            <option v-for="brand in uniqueBrands" :key="brand" :value="brand">{{ brand
                                            }}</option>
                                        </select>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label fw-bold text-dark">Mẫu xe <span
                                                class="text-danger">*</span></label>
                                        <select class="form-select bg-light border-0 py-2" v-model="form.car_model_id"
                                            :disabled="!selectedBrand" @change="handleModelChange">
                                            <option value="">-- Chọn Mẫu xe --</option>
                                            <option v-for="model in filteredModels" :key="model.id" :value="model.id">{{
                                                model.model_name }}</option>
                                        </select>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label fw-bold text-dark">Phân khúc</label>
                                        <select class="form-select bg-light border-0 py-2" v-model="form.category_id">
                                            <option value="">-- Chọn Phân khúc --</option>
                                            <option v-for="cat in options.categories" :key="cat.id" :value="cat.id">{{
                                                cat.display_name }}</option>
                                        </select>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label fw-bold text-dark">Năm sản xuất <span
                                                class="text-danger">*</span></label>
                                        <select class="form-select bg-light border-0 py-2" v-model="form.year">
                                            <option value="">-- Chọn Năm --</option>
                                            <option v-for="y in 20" :key="y" :value="2026 - y + 1">{{ 2026 - y + 1 }}
                                            </option>
                                        </select>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label fw-bold text-dark">Truyền động</label>
                                        <select class="form-select bg-light border-0 py-2"
                                            v-model="form.transmission_id">
                                            <option value="">-- Chọn Truyền động --</option>
                                            <option v-for="trans in options.transmissions" :key="trans.id"
                                                :value="trans.id">{{ trans.display_name }}</option>
                                        </select>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label fw-bold text-dark">Nhiên liệu</label>
                                        <select class="form-select bg-light border-0 py-2" v-model="form.fuel_id">
                                            <option value="">-- Chọn Nhiên liệu --</option>
                                            <option v-for="fuel in options.fuels" :key="fuel.id" :value="fuel.id">{{
                                                fuel.display_name }}</option>
                                        </select>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label fw-bold text-dark">Số ghế</label>
                                        <input type="number" class="form-control bg-light border-0 py-2"
                                            v-model="form.seat_count" placeholder="VD: 5">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold text-dark">
                                            {{ selectedFuelCategory === 'electric' ? 'Mức tiêu thụ năng lượng' : (selectedFuelCategory === 'hybrid' ? 'Mức tiêu thụ Hybrid' : 'Mức tiêu thụ nhiên liệu') }}
                                        </label>
                                        <div class="input-group">
                                            <input type="text" class="form-control bg-light border-0 py-2"
                                                v-model="form.fuel_consumption" 
                                                :placeholder="selectedFuelCategory === 'electric' ? 'VD: 15.5' : (selectedFuelCategory === 'hybrid' ? 'VD: 4.5L + 5.2kWh' : 'VD: 6.5')">
                                            <span class="input-group-text bg-light border-0 text-muted fw-semibold" style="font-size: 0.85rem;">
                                                {{ selectedFuelCategory === 'electric' ? 'kWh/100km' : (selectedFuelCategory === 'hybrid' ? 'L/100km & kWh/100km' : 'Lít/100km') }}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="col-12 mt-4">
                                        <label class="form-label fw-bold text-dark">Mô tả xe</label>
                                        <textarea class="form-control bg-light border-0" rows="3"
                                            v-model="form.description"
                                            placeholder="Giới thiệu điểm nổi bật của xe..."></textarea>
                                    </div>
                                </div>

                                <h6 class="fw-bold mb-3 border-top pt-4">Tính năng & Tiện ích</h6>
                                <div v-if="loadingOptions" class="text-muted small"><i
                                        class="fas fa-spinner fa-spin me-2"></i> Đang tải dữ liệu...</div>
                                <div class="row g-2 mb-4" v-else>
                                    <div class="col-4 col-md-3" v-for="amenity in options.amenities" :key="amenity.id">
                                        <input type="checkbox" class="btn-check" :id="'amenity_' + amenity.id"
                                            :value="amenity.id" v-model="form.amenities">
                                        <label
                                            class="btn btn-outline-primary w-100 d-flex flex-column align-items-center py-3 rounded-3 border-opacity-50"
                                            :for="'amenity_' + amenity.id">
                                            <i :class="amenity.icon || 'fas fa-check'" class="fs-4 mb-2"></i>
                                            <span class="small" style="font-size: 0.8rem;">{{ amenity.display_name
                                            }}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- BƯỚC 2: ĐƠN GIÁ & GIAO NHẬN -->
                            <div v-show="step === 2">

                                <!-- ĐƠN GIÁ CƠ BẢN -->
                                <div class="p-4 bg-light rounded-4 mb-4">
                                    <label class="form-label fw-bold text-dark fs-5 mb-3">Đơn giá thuê mặc định <span
                                            class="text-danger">*</span></label>
                                    <div class="input-group input-group-lg mb-2">
                                        <input type="number" class="form-control bg-white border-0 fw-bold text-primary"
                                            v-model="form.base_price" min="300000" max="3000000"
                                            placeholder="VD: 800000">
                                        <span class="input-group-text bg-white border-0 text-muted">VNĐ / Ngày</span>
                                    </div>
                                    <div class="form-text text-danger small">Giá thuê yêu cầu từ 300.000đ đến 3.000.000đ
                                        / ngày.</div>
                                </div>

                                <!-- GIẢM GIÁ (Card 1) -->
                                <div class="p-4 bg-light rounded-4 mb-4">
                                    <div
                                        class="form-check form-switch fs-5 mb-3 d-flex justify-content-between align-items-center px-0">
                                        <label class="form-check-label fw-bold text-dark fs-5" for="discount">Giảm
                                            giá</label>
                                        <input class="form-check-input ms-0" type="checkbox" role="switch" id="discount"
                                            v-model="form.discount_enabled" style="cursor: pointer;">
                                    </div>
                                    <div class="row g-4" v-if="form.discount_enabled">
                                        <div class="col-12">
                                            <label class="form-label text-dark mb-3">Giảm giá thuê tuần (% trên đơn
                                                giá)</label>
                                            <!-- Sử dụng accent-color để đổ màu thanh kéo -->
                                            <input type="range" class="w-100"
                                                style="accent-color: var(--bs-primary); cursor: pointer;" min="0"
                                                max="50" step="1" v-model="form.weekly_discount_percent">
                                            <div class="d-flex justify-content-between mt-2">
                                                <span class="small text-muted">Giảm đề xuất: 20%</span>
                                                <span class="fw-bold text-primary">{{ form.weekly_discount_percent
                                                }}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- ĐỊA CHỈ MẶC ĐỊNH (Card 2) -->
                                <div class="position-relative cursor-pointer mb-4" @click="openLocationModal">
                                    <input type="text"
                                        class="form-control bg-light border-0 py-3 px-4 rounded-4 text-dark"
                                        v-model="form.parking_address"
                                        placeholder="Bấm vào đây để chọn địa chỉ mặc định..." readonly
                                        style="cursor: pointer;">
                                    <i
                                        class="fas fa-map-marker-alt text-danger position-absolute top-50 end-0 translate-middle-y me-4 fs-5"></i>
                                </div>

                                <!-- GIAO XE TẬN NƠI (Card 3) -->
                                <div class="p-4 bg-light rounded-4 mb-4">
                                    <div
                                        class="form-check form-switch fs-5 mb-3 d-flex justify-content-between align-items-center px-0">
                                        <label class="form-check-label fw-bold text-dark fs-5" for="delivery">Giao xe
                                            tận nơi</label>
                                        <input class="form-check-input ms-0" type="checkbox" role="switch" id="delivery"
                                            v-model="form.delivery_enabled" style="cursor: pointer;">
                                    </div>

                                    <div class="row g-5" v-if="form.delivery_enabled">
                                        <div class="col-md-6">
                                            <label class="form-label text-dark mb-3">Quãng đường giao xe tối đa</label>
                                            <input type="range" class="w-100"
                                                style="accent-color: var(--bs-primary); cursor: pointer;" min="5"
                                                max="50" step="1" v-model="form.delivery_radius">
                                            <div class="d-flex justify-content-between mt-2">
                                                <span class="small text-muted">Quãng đường đề xuất: 20km</span>
                                                <span class="fw-bold text-primary">{{ form.delivery_radius }}km</span>
                                            </div>
                                        </div>

                                        <div class="col-md-6">
                                            <label class="form-label text-dark mb-3">Phí giao nhận xe cho mỗi km</label>
                                            <input type="range" class="w-100"
                                                style="accent-color: var(--bs-primary); cursor: pointer;" min="5000"
                                                max="30000" step="1000" v-model="form.delivery_fee_per_km">
                                            <div class="d-flex justify-content-between mt-2">
                                                <span class="small text-muted">Phí đề xuất: 10K</span>
                                                <span class="fw-bold text-primary">{{ form.delivery_fee_per_km / 1000
                                                }}K</span>
                                            </div>
                                        </div>

                                        <div class="col-md-6">
                                            <label class="form-label text-dark mb-3">Miễn phí giao nhận xe trong
                                                vòng</label>
                                            <input type="range" class="w-100"
                                                style="accent-color: var(--bs-primary); cursor: pointer;" min="0"
                                                max="20" step="1" v-model="form.free_delivery_radius">
                                            <div class="d-flex justify-content-between mt-2">
                                                <span class="small text-muted">Quãng đường đề xuất: 0km</span>
                                                <span class="fw-bold text-primary">{{ form.free_delivery_radius
                                                }}km</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                <!-- GIỚI HẠN SỐ KM -->
                                <div class="p-4 bg-light rounded-4 mb-4">
                                    <div
                                        class="form-check form-switch fs-5 mb-3 d-flex justify-content-between align-items-center px-0">
                                        <label class="form-check-label fw-bold text-dark fs-5" for="mileage">Giới hạn số
                                            km</label>
                                        <input class="form-check-input ms-0" type="checkbox" role="switch" id="mileage"
                                            v-model="form.mileage_limit_enabled" style="cursor: pointer;">
                                    </div>
                                    <div class="row g-4" v-if="form.mileage_limit_enabled">
                                        <div class="col-md-6">
                                            <label class="form-label text-dark mb-2">Số km tối đa / ngày</label>
                                            <input type="number" class="form-control bg-white border-0 py-2"
                                                v-model="form.mileage_limit_per_day">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label text-dark mb-2">Phí vượt giới hạn (VNĐ/km)</label>
                                            <input type="number" class="form-control bg-white border-0 py-2"
                                                v-model="form.extra_fee_per_km">
                                        </div>
                                    </div>
                                </div>

                                <!-- THẾ CHẤP -->
                                <div class="p-4 bg-light rounded-4 mb-4">
                                    <div class="form-check form-switch fs-5 mb-0 d-flex justify-content-between align-items-center px-0">
                                        <label class="form-check-label fw-bold text-dark fs-5" for="mortgage">Yêu cầu thế chấp tài sản</label>
                                        <input class="form-check-input ms-0" type="checkbox" role="switch" id="mortgage" v-model="form.require_mortgage" style="cursor: pointer;">
                                    </div>
                                    <div class="text-muted mt-2">Nếu bật, khách thuê sẽ phải để lại tài sản thế chấp (xe máy/tiền mặt) khi nhận xe.</div>
                                </div>

                                <!-- ĐIỀU KHOẢN -->
                                <div class="mb-4">
                                    <label class="form-label fw-bold text-dark">Điều khoản cho thuê</label>
                                    <textarea class="form-control bg-light border-0 rounded-4 p-3" rows="3"
                                        v-model="form.rental_terms"
                                        placeholder="VD: Không hút thuốc, rửa xe trước khi trả..."></textarea>
                                </div>
                            </div>

                            <!-- BƯỚC 3: HÌNH ẢNH -->
                            <div v-show="step === 3">
                                <h5 class="fw-bold mb-2">Hình ảnh phương tiện</h5>
                                <p class="text-muted small mb-4">Đăng nhiều hình ở các góc độ khác nhau để tăng tỉ lệ
                                    nhận chuyến.</p>

                                <div class="border rounded-4 bg-light d-flex flex-column align-items-center justify-content-center p-5 mb-4 position-relative"
                                    style="border-style: dashed !important; border-width: 2px !important;">
                                    <input type="file" multiple accept="image/*"
                                        class="position-absolute w-100 h-100 opacity-0 cursor-pointer"
                                        @change="handleCarImagesUpload">
                                    <i class="fas fa-cloud-upload-alt fa-3x text-primary mb-3"></i>
                                    <h6 class="fw-bold text-dark">Bấm hoặc kéo thả ảnh vào đây</h6>
                                    <span class="small text-muted">Tối đa 5MB/Ảnh. Nên chụp rõ đầu, đuôi và nội
                                        thất.</span>
                                </div>

                                <div class="row g-3" v-if="carImagePreviews.length > 0">
                                    <div class="col-4 col-md-3 position-relative" v-for="(img, idx) in carImagePreviews"
                                        :key="idx">
                                        <img :src="img" class="img-fluid rounded-3 object-fit-cover w-100 shadow-sm"
                                            style="height: 100px;">
                                        <button
                                            class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-1"
                                            style="width: 24px; height: 24px; line-height: 1;"
                                            @click="removeCarImage(idx)">
                                            <i class="fas fa-times" style="font-size: 0.7rem;"></i>
                                        </button>
                                        <span v-if="idx === 0"
                                            class="badge bg-primary position-absolute bottom-0 start-0 m-2">Ảnh
                                            bìa</span>
                                    </div>
                                </div>
                            </div>

                            <!-- BƯỚC 4: GIẤY TỜ -->
                            <div v-show="step === 4">
                                <h5 class="fw-bold mb-2">Xác minh giấy tờ xe</h5>
                                <div class="alert alert-warning border-0 rounded-3 mb-4">
                                    <i class="fas fa-shield-alt me-2"></i>Bảo mật: Hình ảnh giấy tờ chỉ dùng để Admin
                                    kiểm duyệt tính hợp lệ, tuyệt đối không hiển thị công khai cho Khách thuê.
                                </div>

                                <div class="mb-4">
                                    <label class="form-label fw-bold text-dark">Giấy Đăng Ký Xe (Cà vẹt) <span
                                            class="text-danger">*</span></label>
                                    <div class="border rounded-4 bg-light d-flex flex-column align-items-center justify-content-center p-4 position-relative"
                                        style="border-style: dashed !important; border-width: 2px !important; min-height: 200px;">
                                        <input type="file" accept="image/*"
                                            class="position-absolute w-100 h-100 opacity-0 cursor-pointer"
                                            @change="handleCavetUpload">
                                        <template v-if="!cavetPreview">
                                            <i class="fas fa-id-card fa-3x text-secondary mb-3"></i>
                                            <h6 class="fw-bold text-dark">Tải lên mặt trước Cà vẹt</h6>
                                        </template>
                                        <template v-else>
                                            <img :src="cavetPreview"
                                                class="img-fluid rounded-3 object-fit-cover w-100 h-100 position-absolute top-0 start-0"
                                                style="z-index: 1;">
                                            <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 rounded-4 d-flex align-items-center justify-content-center"
                                                style="z-index: 2; opacity: 0; transition: 0.3s;"
                                                onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0">
                                                <span class="text-white fw-bold"><i class="fas fa-pen me-2"></i>Bấm để
                                                    đổi ảnh</span>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>

                            <div class="d-flex justify-content-between mt-5 pt-3 border-top">
                                <button class="btn btn-light bg-white border fw-bold px-4 shadow-sm text-dark"
                                    :disabled="step === 1" @click="step--">
                                    Quay lại
                                </button>
                                <button v-if="step < 4" class="btn btn-primary fw-bold px-5" @click="nextStep">
                                    Kế tiếp
                                </button>
                                <button v-if="step === 4" class="btn btn-success fw-bold px-5 d-flex align-items-center"
                                    @click="submitVehicle" :disabled="isSubmitting">
                                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"
                                        role="status"></span>
                                    <i v-else class="fas fa-check-circle me-2"></i> Gửi Yêu Cầu Duyệt
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <LocationModal id="locationDetailModal" title="Chọn địa chỉ" :showAirports="false"
            @locationSelected="handleLocationSelected" />
    </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & THÀNH PHẦN MODAL ĐỊA ĐIỂM (IMPORTS)
// ============================================================================
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LocationModal from '@/components/common/LocationModal.vue';
import vehicleService from '@/services/vehicle.service';

const router = useRouter();

// ============================================================================
// 2. KHỞI TẠO TRẠNG THÁI BIỂU MẪU NHIỀU BƯỚC (MULTI-STEP FORM STATE)
// ============================================================================
const step = ref(1); // Chỉ mục bước đăng ký hiện tại (từ 1 đến 4)
const stepNames = ['Thông tin', 'Cho thuê', 'Hình ảnh', 'Giấy tờ'];
const isSubmitting = ref(false);  // Cờ khóa thao tác đệ trình
const loadingOptions = ref(true); // Cờ trạng thái tải dữ liệu thông số chuẩn
const isCompressing = ref(false); // Cờ theo dõi tiến trình nén ảnh tại client

// Từ điển cấu hình thông số xe thu thập từ API Backend
const options = ref({
    categories: [], fuels: [], transmissions: [], carModels: [], amenities: []
});

const selectedBrand = ref(''); // Hãng xe đang chọn để lọc Model xe

// ============================================================================
// 3. TRÌNH TỰ ĐÔNG LỌC HÃNG VÀ MẪU XE (REACTIVE BRAND & MODEL FILTERS)
// ============================================================================
// Danh sách các Hãng xe duy nhất được chắt lọc ra từ bộ dữ liệu Car Models
const uniqueBrands = computed(() => {
    const brands = options.value.carModels.map(model => model.brand_name);
    return [...new Set(brands)].sort();
});

// Danh sách các Mẫu xe tương ứng sau khi đã lọc theo Hãng (Brand)
const filteredModels = computed(() => {
    if (!selectedBrand.value) return options.value.carModels;
    return options.value.carModels.filter(model => model.brand_name === selectedBrand.value);
});

// Phân loại nhiên liệu đang được chọn: 'hybrid', 'electric', hoặc 'standard'
const selectedFuelCategory = computed(() => {
    if (!form.value.fuel_id || !options.value.fuels.length) return 'standard';
    const selectedFuel = options.value.fuels.find(f => f.id === Number(form.value.fuel_id) || f.id === form.value.fuel_id);
    if (!selectedFuel) return 'standard';
    const combinedName = `${selectedFuel.name || ''} ${selectedFuel.display_name || ''}`.toLowerCase();
    
    if (combinedName.includes('hybrid') || combinedName.includes('phev') || combinedName.includes('hev') || combinedName.includes('lai') || (combinedName.includes('xăng') && combinedName.includes('điện'))) {
        return 'hybrid';
    }
    if (combinedName.includes('điện') || combinedName.includes('electric') || combinedName.includes('ev') || combinedName.includes('bev')) {
        return 'electric';
    }
    return 'standard';
});

// Tự động điền thông số chuẩn khi Chủ xe chọn Mẫu xe
const handleModelChange = () => {
    if (!form.value.car_model_id) return;
    const selectedModel = options.value.carModels.find(m => m.id === Number(form.value.car_model_id) || m.id === form.value.car_model_id);
    if (selectedModel) {
        if (selectedModel.category_id) form.value.category_id = selectedModel.category_id;
        if (selectedModel.fuel_id) form.value.fuel_id = selectedModel.fuel_id;
        if (selectedModel.transmission_id) form.value.transmission_id = selectedModel.transmission_id;
        if (selectedModel.seat_count) form.value.seat_count = selectedModel.seat_count;
        if (selectedModel.fuel_consumption) form.value.fuel_consumption = String(selectedModel.fuel_consumption);
    }
};

// ============================================================================
// 4. HỒ SƠ BIỂU MẪU ĐĂNG KÝ PHƯƠNG TIỆN (VEHICLE FORM PAYLOAD STATE)
// ============================================================================
const form = ref({
    license_plate: '', car_model_id: '', year: '', category_id: '', transmission_id: '', fuel_id: '',
    seat_count: '', fuel_consumption: '', description: '', amenities: [],
    base_price: '', parking_address: '', latitude: null, longitude: null,

    // Thiết lập giao nhận xe tại nhà Khách
    delivery_enabled: false, delivery_radius: 20, delivery_fee_per_km: 10000,
    free_delivery_radius: 0,

    // Thiết lập chiến dịch Khuyến mãi theo thời gian dài
    discount_enabled: true,
    weekly_discount_percent: 25,

    // Các giới hạn & Quy định đặc biệt
    mileage_limit_enabled: true, mileage_limit_per_day: 400, extra_fee_per_km: 3000,
    require_mortgage: true,
    rental_terms: ''
});

// Các biến lưu tệp (Blob File) và liên kết phát thảo ảnh xem trước
const carImages = ref([]);
const carImagePreviews = ref([]);
const cavetFile = ref(null);
const cavetPreview = ref('');

// ============================================================================
// 5. TRÌNH NÉN ẢNH CLIENT-SIDE BẰNG CANVAS (CLIENT-SIDE IMAGE COMPRESSION)
// ============================================================================
/**
 * Thuật toán nén ảnh trực tiếp trên trình duyệt bằng HTML5 Canvas
 * Giảm dung lượng 80-90%, ngăn chặn hoàn toàn lỗi 413 Content Too Large của Web Server
 */
const compressImage = (file, maxWidth = 1920, quality = 0.7) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Tự động thu nhỏ tỷ lệ nếu chiều ngang ảnh vượt trần maxWidth
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Triết xuất dữ liệu ra file mới dạng JPEG với chất lượng tinh chỉnh
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas is empty'));
                        return;
                    }
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    resolve(compressedFile);
                }, 'image/jpeg', quality);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

// ============================================================================
// 6. QUẢN LÝ MODAL BẢN ĐỒ CHỌN TỌA ĐỘ BÃI XE (LOCATION MODAL CONTROLLER)
// ============================================================================
/**
 * Trình kích hoạt Modal Bản đồ địa điếm bằng hệ Bootstrap API
 */
const openLocationModal = () => {
    const modalEl = document.getElementById('locationDetailModal');
    if (modalEl && window.bootstrap) {
        let modal = window.bootstrap.Modal.getInstance(modalEl);
        if (!modal) {
            modal = new window.bootstrap.Modal(modalEl);
        }
        modal.show();
    }
};

/**
 * Lấy địa chỉ và tọa độ thực (lat/lng) từ Modal gán thẳng vào Biểu mẫu
 */
const handleLocationSelected = (location) => {
    if (location) {
        form.value.parking_address = location.display_name || location.name || '';
        form.value.latitude = location.lat;
        form.value.longitude = location.lng;
    }
};

// ============================================================================
// 7. MÓC TRÌNH DẪN VÒNG ĐỜI NẠP THÔNG SỐ XE TỪ BACKEND (LIFECYCLE HOOK)
// ============================================================================
onMounted(async () => {
    try {
        const res = await vehicleService.getFormOptions();
        if (res.data.success) {
            options.value = {
                categories: res.data.data.categories,
                fuels: res.data.data.fuels,
                transmissions: res.data.data.transmissions,
                carModels: res.data.data.car_models,
                amenities: res.data.data.amenities
            };
        }
    } catch (error) {
        console.error("Lỗi tải thông số xe:", error);
    } finally {
        loadingOptions.value = false;
    }
});

// ============================================================================
// 8. TRÌNH KIỂM TOÁN TÍNH HỢP LỆ VÀ CHUYỂN BƯỚC FORM (STEP VALIDATION)
// ============================================================================
/**
 * Kiểm tra đầy đủ thông tin bắt buộc trước khi cho phép đi đến Bước tiếp theo
 */
const nextStep = () => {
    if (step.value === 1) {
        if (!form.value.license_plate || !form.value.car_model_id || !form.value.year) {
            alert('Vui lòng điền Biển số, Hãng xe, Mẫu xe và Năm sản xuất!');
            return;
        }
    }
    if (step.value === 2) {
        if (!form.value.base_price || !form.value.parking_address) {
            alert('Vui lòng nhập Đơn giá và Địa chỉ giao xe!');
            return;
        }
        if (!form.value.latitude || !form.value.longitude) {
            alert('Vui lòng chọn địa chỉ từ danh sách gợi ý để hệ thống lấy tọa độ bản đồ!');
            return;
        }
        if (form.value.base_price < 300000 || form.value.base_price > 3000000) {
            alert('Đơn giá thuê xe phải từ 300.000đ đến 3.000.000đ / ngày!');
            return;
        }
    }
    // Ràng buộc nghiêm ngặt số lượng ảnh ngoại thất xe (Tối thiểu 3, tối đa 10)
    if (step.value === 3) {
        if (carImages.value.length < 3) {
            alert('Vui lòng tải lên tối thiểu 3 ảnh phương tiện!');
            return;
        }
        if (carImages.value.length > 10) {
            alert('Bạn chỉ được phép tải lên tối đa 10 ảnh phương tiện!');
            return;
        }
    }
    step.value++;
};

// ============================================================================
// 9. QUY TRÌNH XỬ LÝ NÉN VÀ TẢI LÊN ẢNH NGOẠI THẤT Ô TÔ (CAR IMAGES HANDLER)
// ============================================================================
const handleCarImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    let limitExceeded = false;
    
    isCompressing.value = true;

    for (const file of files) {
        if (carImages.value.length >= 10) {
            limitExceeded = true;
            break; // Ngắt tiếp nhận nếu số ảnh đã chạm trần 10
        }

        try {
            // Nén ảnh xuống Max-Width 1920px và Quality 70%
            const compressedFile = await compressImage(file);
            carImages.value.push(compressedFile);
            carImagePreviews.value.push(URL.createObjectURL(compressedFile));
        } catch (error) {
            console.error("Lỗi khi nén ảnh:", error);
            alert(`Lỗi khi xử lý ảnh ${file.name}. Vui lòng thử ảnh khác.`);
        }
    }

    isCompressing.value = false;

    if (limitExceeded) {
        alert('Chỉ được phép tải lên tối đa 10 ảnh! Các ảnh thừa đã bị bỏ qua.');
    }

    e.target.value = ''; // Xóa trường input sau khi thu nhận
};

/**
 * Loại bỏ ảnh xe khỏi mảng và hủy URL Preview
 */
const removeCarImage = (index) => {
    carImages.value.splice(index, 1);
    carImagePreviews.value.splice(index, 1);
};

// ==========================================
// 10. XỬ LÝ UPLOAD HỒ SƠ PHÁP LÝ CÀ VẸT XE (CAVET UPLOAD HANDLER)
// ==========================================
const handleCavetUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
        try {
            isCompressing.value = true;
            const compressedFile = await compressImage(file);
            cavetFile.value = compressedFile;
            cavetPreview.value = URL.createObjectURL(compressedFile);
        } catch (error) {
            console.error("Lỗi khi nén Cà vẹt:", error);
            alert('Lỗi xử lý ảnh Cà vẹt. Vui lòng thử lại.');
        } finally {
            isCompressing.value = false;
            e.target.value = '';
        }
    }
};

// ============================================================================
// 11. ĐỆ TRÌNH TỐI HẬU ĐĂNG KÝ PHƯƠNG TIỆN LÊN MÁY CHỦ (FINAL SUBMIT API)
// ============================================================================
/**
 * Đóng gói dữ liệu biểu mẫu cùng tập tệp ảnh vào FormData và gửi qua vehicleService
 */
const submitVehicle = async () => {
    if (carImages.value.length < 3 || carImages.value.length > 10) {
        alert('Vui lòng cung cấp từ 3 đến 10 ảnh phương tiện!');
        return;
    }
    if (!cavetFile.value) {
        alert('Vui lòng tải lên 1 hình ảnh Cà vẹt xe để kiểm duyệt!');
        return;
    }

    isSubmitting.value = true;

    const formData = new FormData();
    Object.keys(form.value).forEach(key => {
        if (key === 'amenities') {
            formData.append(key, form.value[key].join(','));
        } else if (key === 'require_mortgage') {
            formData.append('is_mortgage_exempt', !form.value[key]);
        } else {
            formData.append(key, form.value[key] !== null ? form.value[key] : '');
        }
    });

    carImages.value.forEach(file => { formData.append('images[]', file); });
    formData.append('cavet_image', cavetFile.value);

    try {
        const res = await vehicleService.createVehicle(formData);
        if (res.data.success) {
            alert('Đã gửi hồ sơ xe thành công! Vui lòng chờ Admin duyệt.');
            router.push('/profile');
        }
    } catch (error) {
        console.error("Lỗi đăng ký xe:", error);
        if (error.response && error.response.status === 413) {
            alert('Dù đã nén nhưng mạng hoặc server của bạn cấu hình quá thấp (Lỗi 413). Vui lòng thử up ít ảnh hơn!');
        } else {
            alert(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
    } finally {
        isSubmitting.value = false;
    }
};
</script>
