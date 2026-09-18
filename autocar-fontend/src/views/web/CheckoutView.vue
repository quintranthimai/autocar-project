<template>
    <div class="checkout-page bg-light py-5 min-vh-100">
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status"></div>
            <p class="mt-3 text-muted fw-bold">Đang thiết lập yêu cầu thuê xe...</p>
        </div>

        <div v-else-if="vehicle && priceDetails" class="container-fluid px-4 px-lg-5 py-2 py-lg-4">
            <div class="row justify-content-center">
                <div class="col-12 col-xxl-11">

                    <div class="card bg-transparent border-0 shadow-none rounded-4 overflow-hidden">
                        <div
                            class="card-header bg-transparent border-bottom border-primary border-opacity-10 py-4 position-relative">
                            <h4 class="fw-bold text-center mb-0 text-primary">Tóm tắt yêu cầu thuê</h4>
                            <RouterLink :to="`/vehicle-details/${vehicle.id}`"
                                class="btn-close position-absolute top-50 translate-middle-y end-0 me-4"
                                aria-label="Close"></RouterLink>
                        </div>

                        <div class="card-body p-4 p-md-5 bg-transparent">
                            <div class="row g-5">

                                <div class="col-lg-7">
                                    <div class="row g-4 mb-5">
                                        <div class="col-md-5">
                                            <img :src="vehicle.images?.[0]?.image_url || '/img/carousel-2.jpg'"
                                                class="img-fluid rounded-3 w-100 object-fit-cover h-100"
                                                style="max-height: 200px;" alt="Car Image">
                                        </div>
                                        <div class="col-md-7">
                                            <h4 class="fw-bold mb-3 text-uppercase">{{ vehicle.car_model?.brand_name }}
                                                {{ vehicle.car_model?.model_name }} {{ vehicle.year }}</h4>
                                            <div class="text-dark mb-2 d-flex align-items-center">
                                                <span v-if="vehicle.avg_rating > 0"><i class="fas fa-star text-warning"></i> {{ Number(vehicle.avg_rating).toFixed(1) }}</span>
                                                <span v-else class="badge bg-success bg-opacity-10 text-success fw-bold px-2 py-1">Mới</span>
                                                <span class="mx-2">•</span>
                                                <i class="fas fa-suitcase-rolling text-primary me-1"></i> {{ vehicle.total_trips || 0 }} chuyến (xe này)
                                            </div>
                                            <div class="text-dark mb-3">
                                                <i class="fas fa-map-marker-alt text-muted me-1"></i> {{
                                                    vehicle.parking_address }}
                                            </div>

                                            <div
                                                class="border border-primary border-opacity-25 bg-primary bg-opacity-10 rounded-3 p-3 d-flex gap-3 shadow-sm">
                                                <i class="fas fa-shield-alt text-primary fs-3 mt-1"></i>
                                                <div>
                                                    <div class="text-primary fw-bold mb-1">Bảo hiểm chuyến đi</div>
                                                    <div class="text-dark small" style="font-size: 0.8rem;">
                                                        Hành trình được bảo vệ. Khách thuê bồi thường tối đa 2.000.000
                                                        VNĐ trong trường hợp có sự cố.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h5 class="fw-bold mb-4">Thời gian thuê xe</h5>
                                    <div class="row g-3 mb-5">
                                        <div class="col-md-6">
                                            <div class="text-muted small mb-2">
                                                <i class="far fa-calendar-alt fs-5 me-1 align-middle"></i> Nhận xe
                                            </div>
                                            <h5 class="fw-bold mb-0 text-dark">{{ formatDateTimeDisplay(startDatetime)
                                                }}</h5>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="text-muted small mb-2">
                                                <i class="far fa-calendar-alt fs-5 me-1 align-middle"></i> Trả xe
                                            </div>
                                            <h5 class="fw-bold mb-0 text-dark">{{ formatDateTimeDisplay(endDatetime) }}
                                            </h5>
                                        </div>
                                    </div>

                                    <h5 class="fw-bold mb-3">Địa chỉ giao nhận xe</h5>
                                    <div class="mb-3 position-relative">
                                        <label class="form-label small text-muted mb-1">Địa chỉ nhận xe</label>
                                        <input type="text" class="form-control bg-white" v-model="pickupLocation"
                                            @input="debounceSearchLocation('pickup')"
                                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                                            autocomplete="off">
                                        <ul v-if="pickupSuggestions.length > 0"
                                            class="list-group position-absolute w-100 shadow-sm mt-1"
                                            style="z-index: 20; max-height: 200px; overflow-y: auto;">
                                            <li v-for="(item, index) in pickupSuggestions" :key="`pickup-${index}`"
                                                class="list-group-item list-group-item-action small"
                                                @click="selectLocationSuggestion('pickup', item)">
                                                {{ locationService.formatVietnameseAddress(item) || item.display_name }}
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="mb-2 position-relative">
                                        <label class="form-label small text-muted mb-1">Địa chỉ trả xe</label>
                                        <input type="text" class="form-control bg-white" v-model="dropoffLocation"
                                            @input="debounceSearchLocation('dropoff')"
                                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                                            autocomplete="off">
                                        <ul v-if="dropoffSuggestions.length > 0"
                                            class="list-group position-absolute w-100 shadow-sm mt-1"
                                            style="z-index: 20; max-height: 200px; overflow-y: auto;">
                                            <li v-for="(item, index) in dropoffSuggestions" :key="`dropoff-${index}`"
                                                class="list-group-item list-group-item-action small"
                                                @click="selectLocationSuggestion('dropoff', item)">
                                                {{ locationService.formatVietnameseAddress(item) || item.display_name }}
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="text-muted small mb-5">Gợi ý địa chỉ chỉ trong phạm vi Việt Nam, hiển
                                        thị theo số nhà, đường, phường/xã, quận/huyện, tỉnh/thành.</div>

                                    <h5 class="fw-bold mb-3">Thông tin chủ xe</h5>
                                    <div class="d-flex align-items-center mb-3 border rounded-3 p-3 bg-white">
                                        <img :src="vehicle.owner?.avatar || '/img/team-1.jpg'"
                                            class="rounded-circle me-3 border border-primary p-1 bg-white object-fit-cover"
                                            width="60" height="60" alt="Avatar">
                                        <div>
                                            <h6 class="fw-bold mb-1">{{ vehicle.owner?.name || 'Chủ xe' }}</h6>
                                            <div class="text-muted small">Nhằm bảo mật thông tin, số điện thoại chủ xe
                                                sẽ hiển thị sau khi đặt cọc.</div>
                                        </div>
                                    </div>

                                    <div class="fw-bold mb-2 mt-4 text-dark">Lời nhắn đến chủ xe (Tùy chọn)</div>
                                    <textarea class="form-control bg-white mb-5 shadow-sm" rows="3"
                                        placeholder="Gợi ý: Chào anh chủ xe! Tôi cần thuê xe của anh để đi du lịch..."
                                        v-model="messageToOwner"></textarea>

                                    <h5 class="fw-bold mb-3">Giấy tờ & Tài sản thế chấp</h5>
                                    <div
                                        class="border-start border-4 border-primary bg-white shadow-sm p-4 rounded-end mb-4">
                                        <div class="text-muted small mb-3"><i
                                                class="fas fa-info-circle text-primary me-1"></i> Bạn cần xuất trình các
                                            giấy tờ sau khi nhận xe:</div>
                                        <div class="d-flex align-items-center mb-3 fw-bold text-dark"
                                            v-for="(doc, idx) in vehicle.required_documents" :key="idx">
                                            <i class="far fa-id-card fs-5 me-3 text-primary"></i> {{ doc }}
                                        </div>
                                        <hr class="border-secondary opacity-25">
                                        <div class="fw-bold text-dark mt-3 d-flex align-items-center">
                                            <i class="fas fa-lock fs-5 me-3 text-primary"></i>
                                            {{ getMortgageNotice(vehicle.is_mortgage_exempt) }}
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-5">
                                    <div class="sticky-top" style="top: 100px; z-index: 10;">

                                        <div class="card border-0 shadow-sm rounded-4 mb-4">
                                            <div class="card-body p-4">
                                                <h5 class="fw-bold mb-3 text-dark">
                                                    <i class="fas fa-ticket-alt text-primary me-2"></i>Mã khuyến mãi
                                                </h5>
                                                <select class="form-select bg-light border-0 fw-medium text-dark py-3"
                                                    v-model="promoCode" @change="handlePromoChange"
                                                    :disabled="isApplyingPromo">
                                                    <option value="">-- Chọn mã giảm giá phù hợp --</option>
                                                    <option v-for="promo in availablePromos" :key="promo.code"
                                                        :value="promo.code">
                                                        {{ promo.code }} - {{ promo.description }}
                                                    </option>
                                                </select>

                                                <div v-if="promoMessage" class="mt-3 small"
                                                    :class="promoSuccess ? 'text-success fw-bold' : 'text-danger'">
                                                    <i :class="promoSuccess ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"
                                                        class="me-1"></i>
                                                    {{ promoMessage }}
                                                </div>
                                            </div>
                                        </div>

                                        <div class="card border-0 shadow-sm rounded-4">
                                            <div class="card-body p-4">
                                                <h5 class="fw-bold mb-4">Chi phí dự kiến</h5>

                                                <div class="d-flex justify-content-between mb-3 text-muted">
                                                    <span>Đơn giá thuê ({{ priceDetails.is_hourly ?
                                                        priceDetails.rental_duration + ' giờ' :
                                                        priceDetails.rental_duration + ' ngày' }})</span>
                                                    <span class="fw-medium text-dark">{{
                                                        formatCurrency(priceDetails.total_rental_fee) }}</span>
                                                </div>
                                                <div class="d-flex justify-content-between mb-3 text-muted">
                                                    <span>Bảo hiểm chuyến đi</span>
                                                    <span class="fw-medium text-dark">{{
                                                        formatCurrency(priceDetails.total_insurance_fee) }}</span>
                                                </div>
                                                <div v-if="deliveryFee > 0" class="d-flex justify-content-between mb-3 text-muted">
                                                    <span>Phí giao nhận xe tận nơi</span>
                                                    <span class="fw-medium text-dark">{{
                                                        formatCurrency(deliveryFee) }}</span>
                                                </div>

                                                <div v-if="discountAmount > 0"
                                                    class="d-flex justify-content-between mb-3 text-success fw-bold">
                                                    <span>Mã giảm giá ({{ promoCode }})</span>
                                                    <span>- {{ formatCurrency(discountAmount) }}</span>
                                                </div>

                                                <hr class="text-muted my-3 opacity-25">

                                                <div class="d-flex justify-content-between align-items-center mb-4">
                                                    <span class="fw-bold text-dark">Tổng chi phí</span>
                                                    <span class="fw-bold fs-4 text-primary">{{
                                                        formatCurrency(finalTotalAmount) }}</span>
                                                </div>

                                                <div
                                                    class="bg-light p-3 rounded-3 mb-4 border border-warning border-opacity-50">
                                                    <div
                                                        class="d-flex justify-content-between text-warning fw-bold mb-2">
                                                        <span>{{ paymentOption === 'full' ? 'Cần thanh toán sau khi duyệt (100%):' : 'Cần thanh toán sau khi duyệt (30%):' }}</span>
                                                        <span class="fs-5">{{ formatCurrency(finalDepositAmount) }}</span>
                                                    </div>
                                                    <div v-if="paymentOption !== 'full'"
                                                        class="d-flex justify-content-between text-muted small border-top border-warning border-opacity-25 pt-2 mt-2">
                                                        <span>Thanh toán khi nhận xe:</span>
                                                        <span class="fw-bold text-dark">{{ formatCurrency(finalTotalAmount - finalDepositAmount) }}</span>
                                                    </div>
                                                    <div v-else
                                                        class="d-flex justify-content-between text-success small border-top border-warning border-opacity-25 pt-2 mt-2">
                                                        <i class="fas fa-check-circle me-1 mt-1"></i>
                                                        <span>Đã bao gồm trọn gói chi phí. Bạn không cần thanh toán gì thêm khi nhận xe.</span>
                                                    </div>
                                                </div>

                                                <button @click="submitBooking"
                                                    class="btn btn-primary w-100 py-3 fw-bold rounded-3 d-flex justify-content-center align-items-center fs-5"
                                                    :disabled="isSubmitting">
                                                    <span v-if="isSubmitting"
                                                        class="spinner-border spinner-border-sm me-2"
                                                        role="status"></span>
                                                    {{ isSubmitting ? 'Đang gửi yêu cầu...' : 'Gửi Yêu Cầu Đến Chủ Xe'
                                                    }}
                                                </button>

                                                <div class="text-center mt-3 small text-muted">
                                                    <i class="fas fa-clock text-warning me-1"></i> Hệ thống sẽ gửi yêu
                                                    cầu này đến chủ xe. Bạn chỉ tiến hành đặt cọc <b>sau khi chủ xe đồng
                                                        ý duyệt chuyến</b>.
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div v-else class="text-center py-5">
            <h5 class="text-danger fw-bold">Lỗi không tìm thấy dữ liệu đặt xe!</h5>
            <p>Vui lòng quay lại trang chi tiết xe và thực hiện lại thao tác chọn ngày giờ.</p>
            <button @click="$router.push('/vehicles')" class="btn btn-primary mt-3">Về trang danh sách xe</button>
        </div>
    </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CÁC TRANG DIỆN TIỆN ÍCH (IMPORTS)
// ============================================================================
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import vehicleService from '@/services/vehicle.service';
import bookingService from '@/services/booking.service';
import locationService from '@/services/location.service';

const route = useRoute();
const router = useRouter();

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI GIAO NHẬN, CHI PHÍ VÀ KHUYẾN MÃI (STATE & PROMOS)
// ============================================================================
const loading = ref(true);         // Cờ đang nạp dữ liệu chi tiết xe & bảng giá
const isSubmitting = ref(false);   // Cờ đang gửi Đơn yêu cầu đặt xe tới Backend

const vehicle = ref(null);         // Hồ sơ chi tiết xe được chọn
const priceDetails = ref(null);    // Bảng giá chi tiết bóc tách thành tiền, giảm giá, tiền cọc
const messageToOwner = ref('');    // Lời nhắn gởi kèm tới Chủ xe

// Cụm biến xử lý Gợi ý Địa chỉ Tự động bằng LocationService
const pickupLocation = ref('');
const dropoffLocation = ref('');
const pickupSuggestions = ref([]);
const dropoffSuggestions = ref([]);
let pickupSearchTimeout = null;    // Biến hỗ trợ chống rung (Debounce) cho tìm kiếm địa điểm nhận
let dropoffSearchTimeout = null;   // Biến hỗ trợ chống rung (Debounce) cho tìm kiếm địa điểm trả

// Cụm biến quản lý Mã giảm giá (Promotions & Vouchers)
const promoCode = ref('');
const isApplyingPromo = ref(false);
const promoSuccess = ref(false);
const promoMessage = ref('');
const availablePromos = ref([]);   // Danh sách ưu đãi khả dụng tải từ Backend

// Bóc tách dữ liệu đơn hàng từ chuỗi URL Query Params
const vehicleId = route.query.vehicle_id;
const startDatetime = route.query.start;
const endDatetime = route.query.end;
const paymentOption = route.query.option || 'deposit'; // Lấy đúng phương thức thanh toán khách đã lựa chọn
const deliveryFee = computed(() => Number(route.query.delivery_fee) || 0);

// ============================================================================
// 3. BỘ HÀM COMPUTED CHI PHÍ TỔNG VÀ ĐỊNH DẠNG HÓA HIỂN THỊ (FORMATTERS)
// ============================================================================
const formatCurrency = (val) => val ? Math.round(val).toLocaleString('vi-VN') + 'đ' : '0đ';

/**
 * Hiển thị chính sách thế chấp tài sản tương ứng
 */
const getMortgageNotice = (isMortgageExempt) => {
    if (isMortgageExempt) {
        return 'Được Miễn Thế Chấp (Không cần cọc tiền mặt hay xe máy).';
    }

    return 'Cần thế chấp xe máy hoặc 15.000.000 VNĐ tiền mặt.';
};

/**
 * Chuyển đổi chuỗi ISO thời gian sang định dạng dễ đọc cho người Việt Nam
 */
const formatDateTimeDisplay = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const d = new Date(dateTimeStr);
    const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    const date = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return `${time} ${days[d.getDay()]}, ${date}`;
};

// Tổng chi phí chung sau khi cộng thêm Phí giao nhận xe (nếu có)
const finalTotalAmount = computed(() => {
    let total = priceDetails.value ? priceDetails.value.total_amount : 0;
    if (deliveryFee.value > 0) {
        total += deliveryFee.value;
    }
    return total;
});

// Số tiền cần thanh toán trước theo đúng lựa chọn cọc 30% hoặc thanh toán 100% trọn gói
const finalDepositAmount = computed(() => {
    if (!priceDetails.value) return 0;
    if (paymentOption === 'full') {
        return finalTotalAmount.value;
    }
    // Nếu có phí giao nhận, cọc 30% trên tổng giá trị đơn hàng
    return deliveryFee.value > 0 ? Math.round(finalTotalAmount.value * 0.3) : priceDetails.value.deposit_amount;
});

// Khoản tiền được chiết khấu từ Mã ưu đãi
const discountAmount = computed(() => priceDetails.value ? (priceDetails.value.discount_amount || 0) : 0);

// ============================================================================
// 4. BỘ HÀM GỌI API NẠP DỮ LIỆU ĐỐI SOÁT & DANH SÁCH VOUCHER (DATA HYDRATION)
// ============================================================================

/**
 * Nạp danh sách Mã khuyến mãi có khả năng áp dụng từ Backend
 */
const loadPromos = async () => {
    try {
        const res = await bookingService.getAvailablePromos();
        if (res.data.success) {
            availablePromos.value = res.data.data;
        }
    } catch (error) {
        console.error("Không thể tải danh sách mã giảm giá:", error);
    }
};

/**
 * Phương thức tải song song Thông tin xe và Bảng giá thuê đối soát (calculatePrice)
 */
const loadCheckoutData = async () => {
    if (!vehicleId || !startDatetime || !endDatetime) {
        loading.value = false;
        return;
    }

    try {
        loading.value = true;
        const [vehicleRes, priceRes] = await Promise.all([
            vehicleService.getById(vehicleId),
            bookingService.calculatePrice({
                vehicle_id: vehicleId,
                start_datetime: startDatetime,
                end_datetime: endDatetime,
                payment_option: paymentOption,
                promo_code: promoCode.value || null
            })
        ]);

        if (vehicleRes.data.success) {
            vehicle.value = vehicleRes.data.data.vehicle_info;
            // Mặc định lấy địa chỉ bãi đỗ làm địa điểm nhận trả xe ban đầu
            pickupLocation.value = vehicle.value?.parking_address || '';
            dropoffLocation.value = vehicle.value?.parking_address || '';
        }
        if (priceRes.data.success) priceDetails.value = priceRes.data.data;

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu đối soát:", error);
    } finally {
        loading.value = false;
    }
};

// ============================================================================
// 5. QUẢN LÝ GỢI Ý ĐỊA CHỈ NHẬN/TRẢ XE THÔNG MÌNH (ADDRESS AUTOCOMPLETE)
// ============================================================================

/**
 * Kích hoạt tìm kiếm gợi ý địa chỉ sau khi người dùng ngừng gõ 500ms (Debounce)
 */
const debounceSearchLocation = (type) => {
    const isPickup = type === 'pickup';
    const queryRef = isPickup ? pickupLocation : dropoffLocation;
    const suggestionsRef = isPickup ? pickupSuggestions : dropoffSuggestions;

    const query = queryRef.value?.trim() || '';
    if (query.length < 3) {
        suggestionsRef.value = [];
        return;
    }

    if (isPickup) {
        clearTimeout(pickupSearchTimeout);
        pickupSearchTimeout = setTimeout(async () => {
            suggestionsRef.value = await locationService.searchAddress(`${query}, Việt Nam`);
        }, 500);
        return;
    }

    clearTimeout(dropoffSearchTimeout);
    dropoffSearchTimeout = setTimeout(async () => {
        suggestionsRef.value = await locationService.searchAddress(`${query}, Việt Nam`);
    }, 500);
};

const selectLocationSuggestion = (type, item) => {
    const formatted = locationService.formatVietnameseAddress(item) || item.display_name;

    if (type === 'pickup') {
        pickupLocation.value = formatted;
        pickupSuggestions.value = [];
        return;
    }

    dropoffLocation.value = formatted;
    dropoffSuggestions.value = [];
};

// ============================================================================
// 6. TRÌNH THẨM ĐỊNH MÃ KHUYẾN MÃI & CHỐT ĐƠN ĐẶT XE (BOOKING SUBMIT)
// ============================================================================

/**
 * Áp dụng Mã Ưu Đãi và tải lại cơ sở giá tiền chi tiết
 */
const handlePromoChange = async () => {
    if (!promoCode.value) {
        promoMessage.value = '';
        promoSuccess.value = false;
        await loadCheckoutData();
        return;
    }

    isApplyingPromo.value = true;
    promoMessage.value = '';

    try {
        const res = await bookingService.calculatePrice({
            vehicle_id: vehicleId,
            start_datetime: startDatetime,
            end_datetime: endDatetime,
            payment_option: paymentOption,
            promo_code: promoCode.value
        });

        if (res.data.success) {
            priceDetails.value = res.data.data;
            promoSuccess.value = true;
            promoMessage.value = `Áp dụng mã thành công!`;
        }
    } catch (error) {
        console.error("Mã giảm giá không hợp lệ:", error);
        promoSuccess.value = false;
        promoMessage.value = error.response?.data?.message || 'Mã khuyến mãi không đủ điều kiện áp dụng.';
        await loadCheckoutData();
    } finally {
        isApplyingPromo.value = false;
    }
};

/**
 * PHƯƠNG THỨC CHỐT ĐƠN ĐẶT XE (createBooking)
 * - Gửi trọn bộ hồ sơ đặt xe tới Chủ xe thẩm định.
 * - Sau khi gửi thành công, lập tức chuyển qua trang Chi tiết chuyến đi (TripDetailView).
 */
const submitBooking = async () => {
    if (!pickupLocation.value.trim() || !dropoffLocation.value.trim()) {
        alert('Vui lòng nhập đầy đủ địa chỉ nhận và trả xe theo gợi ý.');
        return;
    }

    isSubmitting.value = true;
    try {
        const payload = {
            vehicle_id: vehicleId,
            start_datetime: startDatetime,
            end_datetime: endDatetime,
            payment_option: paymentOption,
            pickup_location: pickupLocation.value,
            dropoff_location: dropoffLocation.value,
            message: messageToOwner.value,
            promo_code: promoSuccess.value ? promoCode.value : null,
            delivery_fee: deliveryFee.value
        };

        const res = await bookingService.createBooking(payload);

        if (res.data.success) {
            router.replace({
                path: `/trip-details/${res.data.data.id}`,
                query: { message: 'Đã gửi yêu cầu thành công! Vui lòng chờ chủ xe phản hồi.' }
            });
        }
    } catch (error) {
        console.error("Lỗi gửi đơn đặt xe:", error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra trong quá trình khởi tạo giao dịch. Vui lòng thử lại!');
    } finally {
        isSubmitting.value = false;
    }
};

// ============================================================================
// 7. MÓC TRÌNH DẪN VÒNG ĐỜI ONMOUNTED
// ============================================================================
onMounted(() => {
    // Kích hoạt nạp song song Mã giảm giá và Thông số đơn đặt xe
    loadPromos();
    loadCheckoutData();
});
</script>
