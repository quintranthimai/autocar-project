<template>
    <div class="trip-details-page bg-light py-4 min-vh-100">
        <div class="container">
            <div class="mb-4">
                <router-link to="/my-trips" class="text-decoration-none text-dark fw-bold hover-primary">
                    <i class="fas fa-chevron-left me-2"></i> Chuyến của tôi
                </router-link>
            </div>

            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status"></div>
                <p class="mt-3 text-muted fw-bold">Đang tải chi tiết chuyến đi...</p>
            </div>

            <div v-else-if="booking">

                <!-- Thông báo nếu chuyến bị hủy -->
                <div v-if="booking.status === 'cancelled'" class="alert alert-danger shadow-sm rounded-4 mb-4 border-0 d-flex flex-column gap-2">
                    <div class="d-flex align-items-center gap-2 fw-bold fs-5">
                        <i class="fas fa-times-circle"></i> Chuyến đi này đã bị hủy
                    </div>
                    <div class="small">
                        <div class="mb-1"><strong>Người hủy:</strong> {{ booking.cancel_by === 'owner' ? 'Chủ xe' : (booking.cancel_by === 'renter' ? 'Bạn (Khách thuê)' : 'Hệ thống') }}</div>
                        <div class="mb-1" v-if="booking.cancel_reason"><strong>Lý do:</strong> {{ booking.cancel_reason }}</div>
                        <div v-if="booking.cancelled_at"><strong>Thời gian hủy:</strong> {{ formatSimpleDate(booking.cancelled_at) }}</div>
                    </div>
                </div>

                <div class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden d-none d-md-block">
                    <div class="card-body p-4 position-relative">
                        <div class="position-absolute w-100 border-top border-2"
                            style="top: 45%; left: 0; z-index: 1; border-color: #e9ecef !important;"></div>

                        <div class="d-flex justify-content-between position-relative" style="z-index: 2;">
                            <div class="text-center bg-white px-3">
                                <div class="btn btn-success rounded-3 text-white mb-2 shadow-sm"
                                    style="width: 45px; height: 45px; line-height: 30px;"><i
                                        class="fas fa-file-alt"></i>
                                </div>
                                <div class="small fw-bold text-dark">Gửi yêu cầu</div>
                            </div>
                            <div class="text-center bg-white px-3">
                                <div :class="['btn rounded-3 mb-2 shadow-sm', booking.status !== 'pending_approval' ? 'btn-success text-white' : 'btn-light text-muted border']"
                                    style="width: 45px; height: 45px; line-height: 30px;"><i
                                        class="fas fa-clipboard-check"></i>
                                </div>
                                <div class="small fw-bold text-dark">Duyệt yêu cầu</div>
                            </div>
                            <div class="text-center bg-white px-3">
                                <div :class="['btn rounded-3 mb-2 shadow-sm', ['pending_payment', 'confirmed', 'in_progress', 'completed'].includes(booking.status) ? 'btn-success text-white' : 'btn-light text-muted border']"
                                    style="width: 45px; height: 45px; line-height: 30px;"><i
                                        class="fas fa-money-check-alt"></i>
                                </div>
                                <div class="small fw-bold text-dark">Thanh toán giữ chỗ</div>
                            </div>
                            <div class="text-center bg-white px-3">
                                <div :class="['btn rounded-3 mb-2 shadow-sm position-relative border-2', ['in_progress', 'completed'].includes(booking.status) ? 'btn-outline-success bg-success bg-opacity-10 text-success' : 'btn-light text-muted border']"
                                    style="width: 45px; height: 45px; line-height: 30px;">
                                    <i class="fas fa-car"></i>
                                </div>
                                <div class="small fw-bold text-dark">Khởi hành</div>
                            </div>
                            <div class="text-center bg-white px-3">
                                <div :class="['btn rounded-3 mb-2 shadow-sm', booking.status === 'completed' ? 'btn-success text-white' : 'btn-light text-muted border']"
                                    style="width: 45px; height: 45px; line-height: 30px;"><i class="fas fa-check"></i>
                                </div>
                                <div class="small fw-bold text-muted">Kết thúc</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card border-start border-4 border-success shadow-sm rounded-3 mb-3">
                    <div class="card-body p-3 d-flex align-items-center gap-3">
                        <i class="far fa-clock fs-3 text-success"></i>
                        <div>
                            <div class="fw-bold text-dark small">Chuyến xe sẽ bắt đầu lúc {{ booking.startTime }}, {{
                                booking.startDate }}</div>
                        </div>
                    </div>
                </div>

                <div class="row g-4 mt-1">
                    <div class="col-lg-8">
                        <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4">

                            <div class="row g-4 align-items-center mb-5">
                                <div class="col-md-4">
                                    <img :src="booking.vehicle.image"
                                        class="img-fluid rounded-3 w-100 object-fit-cover shadow-sm"
                                        style="height: 140px;" alt="Car">
                                </div>
                                <div class="col-md-8">
                                    <h4 class="fw-bold text-uppercase mb-2">{{ booking.vehicle.plate }} • {{
                                        booking.vehicle.name }}</h4>
                                    <span
                                        class="badge bg-light text-dark border px-3 py-2 rounded-pill fw-medium mb-3">{{
                                            booking.vehicle.transmission }}</span>
                                    <div class="text-muted small d-flex align-items-center gap-2">
                                        <i class="fas fa-map-marker-alt text-secondary"></i> {{ booking.vehicle.address
                                        }}
                                    </div>
                                </div>
                            </div>

                            <h5 class="fw-bold mb-3">Thời gian thuê xe</h5>
                            <div class="row g-3 mb-5">
                                <div class="col-6">
                                    <div class="text-muted small mb-1"><i class="far fa-calendar-alt me-1"></i> Bắt đầu
                                        thuê
                                        xe</div>
                                    <div class="fw-bold text-dark fs-6">{{ booking.startTime }} {{
                                        booking.startDayOfWeek
                                        }}, {{ booking.startDate }}</div>
                                </div>
                                <div class="col-6 border-start">
                                    <div class="text-muted small mb-1"><i class="far fa-calendar-check me-1"></i> Kết
                                        thúc
                                        thuê xe</div>
                                    <div class="fw-bold text-dark fs-6">{{ booking.endTime }} {{ booking.endDayOfWeek
                                        }}, {{
                                            booking.endDate }}</div>
                                </div>
                            </div>

                            <h5 class="fw-bold mt-5 mb-3">Chính sách hủy chuyến</h5>
                            <div class="table-responsive mb-2">
                                <table class="table table-bordered text-center align-middle mb-0">
                                    <thead class="bg-light text-muted small">
                                        <tr>
                                            <th class="fw-medium py-3">Thời Điểm Hủy Chuyến</th>
                                            <th class="fw-medium py-3">Phí Hủy Chuyến</th>
                                        </tr>
                                    </thead>
                                    <tbody class="small fw-bold">
                                        <tr>
                                            <td class="text-start px-3 py-3 align-middle">Trước thời điểm nhận xe <br> <span class="badge bg-success text-white mt-1"><i class="fas fa-clock me-1"></i> >= 24 tiếng</span></td>
                                            <td class="py-3 text-success fw-bold"><i
                                                    class="fas fa-check-circle fs-5 d-block mb-1"></i> Miễn phí <br> <small class="text-muted fw-normal">(Hoàn 100% tiền)</small></td>
                                        </tr>
                                        <tr>
                                            <td class="text-start px-3 py-3 align-middle">Sát thời điểm nhận xe <br> <span class="badge bg-danger text-white mt-1"><i class="fas fa-clock me-1"></i> < 24 tiếng</span></td>
                                            <td class="py-3 text-danger fw-bold"><i
                                                    class="fas fa-times-circle fs-5 d-block mb-1"></i> Mất cọc <br> <small class="text-muted fw-normal">(Tương đương 30% chuyến đi)</small>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div v-if="booking.status === 'pending_approval'"
                            class="card shadow-sm rounded-4 p-4 mb-4 bg-warning bg-opacity-10 border border-warning">
                            <div class="text-center">
                                <i class="fas fa-hourglass-half fs-1 text-warning mb-3"></i>
                                <h5 class="fw-bold text-dark">Đang chờ chủ xe duyệt</h5>
                                <p class="text-muted small mb-0">Yêu cầu của bạn đã được gửi đến chủ xe. Vui lòng chờ
                                    phản
                                    hồi. Bạn sẽ nhận được thông báo khi chủ xe đồng ý.</p>
                                
                                <div class="mt-3 p-3 bg-white rounded-3 border border-warning shadow-sm">
                                    <div class="text-danger fw-bold small mb-1"><i class="fas fa-phone-volume"></i> Nhắc nhở chủ xe duyệt đơn</div>
                                    <p class="text-muted small mb-2">Hãy gọi điện trực tiếp cho chủ xe để nhắc nhở duyệt khi bạn chờ quá lâu.</p>
                                    <div class="fw-bold fs-5 text-dark"><i class="fas fa-phone-alt text-success me-2"></i>{{ booking.owner.phone }}</div>
                                </div>
                            </div>
                        </div>

                        <div v-if="booking.status === 'pending_payment'"
                            class="card shadow-sm rounded-4 p-4 mb-4 bg-danger bg-opacity-10 border border-danger">
                            <div class="text-center mb-3">
                                <i class="fas fa-wallet fs-1 text-danger mb-3"></i>
                                <h5 class="fw-bold text-dark">Đến lúc thanh toán!</h5>
                                <p class="text-muted small mb-2">Chủ xe đã đồng ý. Vui lòng thanh toán giữ chỗ để hoàn
                                    tất
                                    đặt xe.</p>

                                <div class="bg-white rounded-3 py-2 px-3 d-inline-block border border-danger">
                                    <span class="text-danger fw-bold fs-5"><i class="fas fa-stopwatch me-1"></i> {{
                                        countdownText }}</span>
                                </div>
                            </div>

                            <div class="d-grid gap-2 mt-3" v-if="!isExpired">
                                <button @click="payTrip('wallet')" class="btn btn-primary fw-bold rounded-3 py-2"
                                    :disabled="isPaying">
                                    {{ isPaying ? 'Đang xử lý...' : 'Thanh toán bằng Ví AutoCar' }}
                                </button>
                                <button @click="payTrip('vnpay')"
                                    class="btn btn-vnpay fw-bold rounded-3 py-2 d-flex align-items-center justify-content-center gap-2"
                                    :disabled="isPaying">
                                    Thanh toán qua
                                    <img src="@/assets/images/vnpay-logo.png" alt="VNPAY" style="height: 20px;" />
                                </button>
                            </div>
                        </div>

                        <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                            <div class="d-flex align-items-center mb-3">
                                <img :src="booking.owner.avatar"
                                    class="rounded-circle me-3 object-fit-cover shadow-sm border-2 border-white"
                                    style="width: 50px; height: 50px;" alt="Owner">
                                <div>
                                    <div class="text-muted small mb-1">Chủ xe</div>
                                    <h6 class="fw-bold mb-1 text-uppercase text-truncate" style="max-width: 150px;">{{
                                        booking.owner.name }}</h6>
                                </div>
                            </div>
                            <div class="border rounded-3 p-3 bg-light">
                                <div class="text-muted small mb-1">Số điện thoại</div>
                                <div class="fw-bold text-dark fs-6 d-flex align-items-center gap-2">
                                    <i class="fas fa-phone-alt text-success"></i> {{ booking.owner.phone }}
                                </div>
                            </div>
                        </div>

                        <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                            <h5 class="fw-bold mb-4">Bảng tính giá</h5>

                            <div class="d-flex justify-content-between text-muted small mb-2">
                                <span>Tiền thuê xe <i class="far fa-question-circle"></i></span>
                                <span class="fw-bold text-dark">{{ formatCurrency(booking.price.base - (booking.price.insurance || 0)) }}</span>
                            </div>
                            <div class="d-flex justify-content-between text-muted small mb-3">
                                <span>Bảo hiểm chuyến đi <i class="far fa-question-circle"></i></span>
                                <span class="fw-bold text-dark">{{ formatCurrency(booking.price.insurance || 0) }}</span>
                            </div>

                            <div v-if="booking.price.delivery > 0" class="d-flex justify-content-between text-muted small mb-3">
                                <span>Phí giao nhận xe tận nơi <i class="far fa-question-circle"></i></span>
                                <span class="fw-bold text-dark">{{ formatCurrency(booking.price.delivery) }}</span>
                            </div>

                            <div v-if="booking.price.discount > 0"
                                class="d-flex justify-content-between text-success small mb-3 border-bottom pb-3 fw-bold">
                                <span><i class="fas fa-ticket-alt me-1"></i> Mã giảm giá</span>
                                <span>-{{ formatCurrency(booking.price.discount) }}</span>
                            </div>
                            <div v-else class="border-bottom pb-3 mb-3"></div>

                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <span class="fw-bold text-muted small">Thành tiền</span>
                                <span class="fw-bold text-dark fs-5">{{ formatCurrency(booking.price.finalTotal)
                                    }}</span>
                            </div>

                            <div class="bg-light p-3 rounded-3 mb-4">
                                <div class="d-flex justify-content-between text-success small fw-bold mb-2">
                                    <span>Thanh toán giữ chỗ <i class="far fa-question-circle text-muted"></i></span>
                                    <span>{{ formatCurrency(booking.price.deposit) }}</span>
                                </div>
                                <div class="d-flex justify-content-between text-success small fw-bold">
                                    <span>Thanh toán khi nhận xe <i
                                            class="far fa-question-circle text-muted"></i></span>
                                    <span>{{ formatCurrency(booking.price.payOnPickup) }}</span>
                                </div>
                            </div>

                            <button v-if="['pending_approval', 'pending_payment', 'confirmed'].includes(booking.status)"
                                data-bs-toggle="modal" data-bs-target="#cancelBookingModal"
                                class="btn btn-outline-danger w-100 py-2 fw-bold rounded-3 bg-danger bg-opacity-10 text-danger">
                                Hủy chuyến
                            </button>
                            
                            <div v-if="booking.status === 'completed'" class="mt-4">
                                <div v-if="myReview" class="card border-0 bg-success bg-opacity-10 rounded-4 p-3 border-success border">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="fw-bold text-success">Đánh giá của bạn</span>
                                        <div class="text-warning">
                                            <i v-for="i in 5" :key="i" class="fas fa-star" :class="i <= myReview.rating ? 'text-warning' : 'text-secondary opacity-25'"></i>
                                        </div>
                                    </div>
                                    <p class="mb-0 text-dark small fst-italic">"{{ myReview.comment || 'Không có nhận xét' }}"</p>
                                </div>
                                <button v-else
                                    data-bs-toggle="modal" data-bs-target="#tripReviewModal"
                                    class="btn btn-primary w-100 py-2 fw-bold rounded-3 shadow-sm">
                                    <i class="fas fa-star me-1"></i> Đánh giá chuyến đi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-center py-5">
                <h5 class="text-danger fw-bold">Không tìm thấy dữ liệu đặt xe!</h5>
                <router-link to="/my-trips" class="btn btn-primary mt-3">Quay lại danh sách</router-link>
            </div>
        </div>

        <!-- Cancel Booking Modal -->
        <div class="modal fade" id="cancelBookingModal" tabindex="-1" aria-labelledby="cancelBookingModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title fw-bold text-danger" id="cancelBookingModalLabel">Xác nhận hủy chuyến</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeCancelModalBtn"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="alert alert-warning mb-3 small">
                            <strong>Chính sách hủy chuyến:</strong>
                            <ul class="mb-0 ps-3 mt-1">
                                <li>Hủy trước 24 giờ so với thời điểm nhận xe: <strong class="text-success">Hoàn 100% tiền</strong></li>
                                <li>Hủy trong vòng 24 giờ: <strong class="text-danger">Mất 100% tiền cọc (tương đương 30% giá trị chuyến đi)</strong></li>
                                <li>Đối với đơn trả trước 100%, khi hủy trong vòng 24 giờ, hệ thống sẽ tự động <strong class="text-primary">hoàn lại 70% phần tiền dư còn lại</strong> về ví khả dụng của bạn.</li>
                            </ul>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Lý do hủy (tùy chọn)</label>
                            <textarea v-model="cancelReason" class="form-control rounded-3 border-light shadow-sm bg-light" rows="3" placeholder="Nhập lý do hủy chuyến của bạn..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer border-0 pt-0">
                        <button type="button" class="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Đóng</button>
                        <button type="button" class="btn btn-danger rounded-pill px-4 fw-bold shadow-sm" @click="handleCancelTrip" :disabled="isCanceling">
                            {{ isCanceling ? 'Đang xử lý...' : 'Xác nhận Hủy chuyến' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <ReviewModal 
            v-if="booking"
            id="tripReviewModal"
            :bookingId="booking.id"
            title="Đánh giá chủ xe"
            subtitle="Chia sẻ trải nghiệm của bạn về chiếc xe và chủ xe này"
            @reviewSubmitted="onReviewSubmitted"
        />

    </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CÁC THÀNH PHẦN MODAL (IMPORTS)
// ============================================================================
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BookingService from '@/services/booking.service';
import ReviewModal from '@/components/common/ReviewModal.vue';

const route = useRoute();
const router = useRouter();

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI ĐƠN HÀNG, THANH TOÁN & ĐẾM NGƯỢC (STATE)
// ============================================================================
const booking = ref(null);       // Hồ sơ toàn bộ chi tiết Chuyến đi & thông tin xe
const loading = ref(true);       // Cờ trạng thái đang tải từ hệ thống

const isPaying = ref(false);     // Cờ đang kích hoạt thanh toán (VNPAY / Ví)
const isCanceling = ref(false);  // Cờ đang gửi xử lý hủy chuyến đi
const cancelReason = ref('');    // Lý do hủy chuyến đi ghi nhận từ khách hàng
const countdownText = ref('Đang tính...'); // Chuỗi hiển thị đồng hồ đếm ngược giữ cọc (2 tiếng)
const isExpired = ref(false);    // Trạng thái đơn đặt xe có bị quá hạn giữ cọc hay chưa
let timerInterval = null;        // Con trỏ lưu giữ nhịp đếm ngược Timer (Interval ID)

// ============================================================================
// 3. QUẢN LÝ HỆ THỐNG ĐÁNH GIÁ CHUYẾN ĐI (REVIEW SYSTEM MANAGEMENT)
// ============================================================================

/**
 * Lọc bài đánh giá do chính người dùng hiện tại (Khách thuê) đã gửi cho chuyến đi này
 */
const myReview = computed(() => {
    if (!booking.value || !booking.value.reviews) return null;
    return booking.value.reviews.find(r => r.reviewer_id === booking.value.renter_id);
});

const onReviewSubmitted = (reviewData) => {
    if (!booking.value.reviews) booking.value.reviews = [];
    booking.value.reviews.push(reviewData);
};

// ============================================================================
// 4. BỘ HÀM ĐỊNH DẠNG VÀ CẮT TỈA CHUỖI NGÀY/GIỜ (FORMATTING UTILITIES)
// ============================================================================
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatSimpleDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatDateOnly = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const formatTimeOnly = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// ============================================================================
// 5. TRÌNH TẢI DỮ LIỆU & ÁP DỤNG ĐÁNH MÃ ĐỊNH DẠNG (DATA MAPPING)
// ============================================================================

/**
 * Truy Xuất chi tiết Đơn từ BookingService.
 * Thực hiện biến đổi (Mapping) cấu trúc dữ liệu Backend để ăn khớp tuyệt đối với Template hiển thị HTML.
 */
const fetchBookingDetail = async () => {
    try {
        const id = route.params.id;
        const response = await BookingService.getBookingDetail(id);

        if (response.data.success) {
            const rawData = response.data.data;
            const startD = new Date(rawData.start_datetime);
            const endD = new Date(rawData.end_datetime);
            const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

            // MAPPING: Ép dữ liệu Backend về đúng định dạng mà Template HTML chờ đợi
            booking.value = {
                id: rawData.id,
                status: rawData.status,
                created_at: rawData.created_at,
                start_datetime: rawData.start_datetime,
                updated_at: rawData.updated_at,
                cancel_by: rawData.cancel_by,
                cancel_reason: rawData.cancel_reason,
                cancelled_at: rawData.cancelled_at,

                startDate: formatDateOnly(rawData.start_datetime),
                startTime: formatTimeOnly(rawData.start_datetime),
                startDayOfWeek: days[startD.getDay()],
                endDate: formatDateOnly(rawData.end_datetime),
                endTime: formatTimeOnly(rawData.end_datetime),
                endDayOfWeek: days[endD.getDay()],

                vehicle: {
                    plate: rawData.vehicle?.license_plate || 'Chưa có biển',
                    name: `${rawData.vehicle?.car_model?.brand_name || ''} ${rawData.vehicle?.car_model?.model_name || ''} ${rawData.vehicle?.year || ''}`,
                    transmission: rawData.vehicle?.car_model?.transmission?.display_name || 'Tự động',
                    address: rawData.pickup_location,
                    image: rawData.vehicle?.images?.[0]?.image_url || '/img/car-1.png'
                },

                owner: {
                    name: rawData.vehicle?.owner?.name || 'Chủ xe',
                    avatar: rawData.vehicle?.owner?.avatar || '/img/team-1.jpg',
                    phone: rawData.vehicle?.owner?.phone || 'Đang cập nhật'
                },

                price: {
                    base: rawData.total_amount + (rawData.discount_amount || 0) - (rawData.total_insurance_fee || 0) - (rawData.delivery_fee || 0),
                    insurance: rawData.total_insurance_fee || 0,
                    delivery: rawData.delivery_fee || 0,
                    discount: rawData.discount_amount || 0,
                    finalTotal: rawData.total_amount,
                    deposit: rawData.deposit_amount,
                    payOnPickup: rawData.total_amount - rawData.deposit_amount
                }
            };

            // Khi đơn ở trạng thái 'pending_payment' -> Khởi chạy đếm ngược giữ cọc (tối đa 2 tiếng)
            if (booking.value.status === 'pending_payment') {
                startCountdown(booking.value.updated_at);
            }
        }
    } catch (error) {
        console.error('Lỗi tải chi tiết đơn hàng:', error);
    } finally {
        loading.value = false;
    }
};

// ============================================================================
// 6. HỆ THỐNG ĐẾM NGƯỢC GIỮ CHỖ & HỦY TỰ ĐỘNG (COUNTDOWN TIMER SYSTEM)
// ============================================================================

/**
 * Khởi tạo đồng hồ đếm ngược 2 tiếng kể từ thời điểm Chủ xe chấp thuận Duyệt chuyến
 */
const startCountdown = (updatedAt) => {
    const expireTime = new Date(updatedAt).getTime() + (2 * 60 * 60 * 1000);

    timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const diff = expireTime - now;

        if (diff <= 0) {
            clearInterval(timerInterval);
            countdownText.value = 'Đã hết hạn';
            isExpired.value = true;
            fetchBookingDetail(); // Tải lại để kiểm chứng hệ thống đã auto-cancel
        } else {
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            countdownText.value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
    }, 1000);
};

// ============================================================================
// 7. XỬ LÝ NGHIỆP VỤ THANH TOÁN (VNPAY/VÍ) & HỦY CHUYÊN (PAY & CANCEL)
// ============================================================================

/**
 * Tiến hành thanh toán cọc chuyến đi thông qua Cổng VNPAY hoặc cấn trừ Số dư Ví AutoCar
 * @param {'vnpay' | 'wallet'} method - Phương thức lựa chọn
 */
const payTrip = async (method) => {
    isPaying.value = true;
    try {
        const response = await BookingService.payBooking(booking.value.id, { payment_method: method });
        if (response.data.success) {
            if (method === 'vnpay') {
                // Điều hướng sang cổng giao dịch VNPAY
                window.location.href = response.data.data.payment_url;
            } else {
                alert('Thanh toán thành công!');
                fetchBookingDetail();
            }
        }
    } catch (error) {
        alert(error.response?.data?.message || 'Lỗi thanh toán.');
    } finally {
        isPaying.value = false;
    }
};

/**
 * Xử lý yêu cầu Hủy Chuyến đi (tuân thủ nguyên tắc hoàn cọc >= 24h hoặc mất cọc < 24h)
 */
const handleCancelTrip = async () => {
    isCanceling.value = true;
    try {
        const response = await BookingService.cancelBooking(booking.value.id, {
            cancel_reason: cancelReason.value
        });
        if (response.data.success) {
            alert(response.data.message || 'Đã hủy chuyến thành công!');
            document.getElementById('closeCancelModalBtn').click();
            fetchBookingDetail(); // Làm mới hiển thị sang trạng thái 'cancelled'
        }
    } catch (error) {
        alert(error.response?.data?.message || 'Lỗi khi hủy chuyến.');
    } finally {
        isCanceling.value = false;
    }
};

// ============================================================================
// 8. MÓC TRÌNH DẪN VÒNG ĐỜI VUE (LIFECYCLE HOOKS)
// ============================================================================
onMounted(() => {
    fetchBookingDetail();
});

onUnmounted(() => {
    // Dọn dẹp trệt để nhịp đếm ngược Timer khi đóng Component
    if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.hover-primary:hover {
    color: #0d6efd !important;
}

.btn-vnpay {
    background-color: #ffffff !important;
    border: 1.5px solid var(--bs-primary) !important;
    color: var(--bs-primary) !important;
    transition: all 0.2s ease-in-out;
}

.btn-vnpay:hover, .btn-vnpay:focus, .btn-vnpay:active {
    background-color: #fff5f0 !important;
    color: var(--bs-primary) !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(235, 90, 28, 0.15);
}
</style>