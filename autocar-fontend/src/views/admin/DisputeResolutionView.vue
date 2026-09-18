<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">
            <div class="row">
                <div class="col-12">
                    <div
                        class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-1">
                                <h1 class="fs-3 fw-bold text-dark mb-0">{{ pageTitle }}</h1>
                                <span class="badge rounded-pill" :class="ticket?.status === 'closed' || ticket?.status === 'resolved' ? 'bg-success' : 'bg-danger'">
                                    {{ ticket?.status === 'closed' || ticket?.status === 'resolved' ? 'Đã xử lý' : 'Cần xử lý' }}
                                </span>
                            </div>
                            <p class="mb-0 text-muted">Ticket #KN-{{ ticket?.id }} • {{ ticket?.subject }}</p>
                        </div>
                        <div>
                            <router-link :to="{ name: 'admin-support-tickets' }"
                                class="btn btn-white border bg-white fw-semibold text-dark shadow-sm">
                                <i class="fas fa-arrow-left me-2"></i>Danh sách Ticket
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <div class="mt-2 text-muted fw-medium">Đang tải dữ liệu...</div>
            </div>

            <div v-else-if="ticket" class="row g-4 align-items-stretch">
                <div class="col-xl-7 d-flex flex-column">
                    <div class="card border-0 shadow-sm rounded-4 mb-4">
                        <div class="card-body p-4">
                            <h5 class="mb-3 border-bottom pb-3 fw-bold text-dark">
                                <i class="fas fa-car text-primary me-2"></i>{{ bookingSectionTitle }}
                            </h5>
                            <div class="row">
                                <div class="col-sm-6 mb-3">
                                    <label class="form-label text-muted small fw-semibold">Mã chuyến / Xe</label>
                                    <input type="text" class="form-control bg-light border-0 fw-bold text-dark"
                                        :value="`DX-${ticket.booking_id} (${ticket.booking?.vehicle?.car_model?.brand_name} ${ticket.booking?.vehicle?.car_model?.model_name})`" readonly>
                                </div>
                                <div class="col-sm-6 mb-3">
                                    <label class="form-label text-muted small fw-semibold">Biển số xe</label>
                                    <input type="text" class="form-control bg-light border-0 fw-medium"
                                        :value="ticket.booking?.vehicle?.license_plate" readonly>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 mb-3 mb-sm-0">
                                    <label class="form-label text-muted small fw-semibold">{{ ownerRoleLabel }}</label>
                                    <input type="text" class="form-control bg-light border-0 fw-medium text-danger"
                                        :value="`${ticket.booking?.vehicle?.owner?.name} (${ticket.booking?.vehicle?.owner?.phone})`" readonly>
                                </div>
                                <div class="col-sm-6">
                                    <label class="form-label text-muted small fw-semibold">{{ renterRoleLabel }}</label>
                                    <input type="text" class="form-control bg-light border-0 fw-medium text-primary"
                                        :value="`${ticket.booking?.renter?.name} (${ticket.booking?.renter?.phone})`" readonly>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4 grow">
                        <div class="card-body p-4">
                            <h5 class="mb-4 border-bottom pb-3 fw-bold text-dark">
                                <i class="fas fa-gavel text-warning me-2"></i>{{ contentTitle }}
                            </h5>

                            <div class="mb-4">
                                <div class="p-3 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-3 text-dark small"
                                    style="line-height: 1.6; white-space: pre-wrap;">{{ ticket.content }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-5 d-flex flex-column">
                    <div class="card border-0 shadow-sm rounded-4 grow d-flex flex-column">
                        <div class="card-body p-4 d-flex flex-column">
                            <h5 class="mb-3 border-bottom pb-3 fw-bold text-dark">
                                <i class="fas fa-camera text-primary me-2"></i>Bằng chứng đính kèm
                            </h5>

                            <p class="text-muted small fw-semibold mb-2">Ảnh do {{ isOwnerSender ? 'Chủ xe' : 'Khách thuê' }} cung cấp:</p>
                            <div class="row g-2 mb-4" v-if="ticket.attachments && ticket.attachments.length > 0">
                                <div class="col-6" v-for="(img, index) in ticket.attachments" :key="index">
                                    <img :src="getImageUrl(img)" class="img-fluid rounded border hover-shadow cursor-pointer w-100" style="height: 150px; object-fit: cover;" @click="openImage(getImageUrl(img))" />
                                </div>
                            </div>
                            <div v-else class="text-muted small fst-italic mb-4">
                                Không có ảnh đính kèm.
                            </div>

                            <div class="mt-auto border-top pt-3" v-if="ticket.status !== 'resolved' && ticket.status !== 'closed'">
                                <label class="form-label text-muted small fw-semibold">Ghi chú của Admin (Tùy chọn)</label>
                                <textarea class="form-control bg-light" rows="2" v-model="adminNote"
                                    placeholder="Ghi chú lại quyết định của bạn..."></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quyết định xử lý -->
            <div class="row mt-4 mb-5" v-if="ticket && ticket.status !== 'resolved' && ticket.status !== 'closed'">
                <div class="col-12">
                    <div class="card shadow-sm rounded-4 border-top border-5 border-warning">
                        <div class="card-body p-4">
                            <div class="row align-items-center">
                                <div class="col-md-6 mb-3 mb-md-0">
                                    <h6 class="fw-bold mb-1">Quyết định thẩm định:</h6>
                                    <span class="text-muted small">Kiểm tra kỹ bằng chứng trước khi ra quyết định phạt hay không phạt chủ xe.</span>
                                </div>
                                <div class="col-md-6 d-flex justify-content-md-end gap-2">
                                    <button class="btn btn-outline-success px-4 py-2 fw-semibold rounded-3" @click="handleResolve('approve')" :disabled="submitting">
                                        <i class="fas fa-check-circle me-2"></i>{{ isCancelIncident ? 'Bằng chứng hợp lệ (Không phạt)' : 'Đã giải quyết thỏa đáng / Đóng khiếu nại' }}
                                    </button>
                                    <button class="btn btn-danger px-4 py-2 fw-semibold rounded-3" @click="showPenaltyModal = true" :disabled="submitting">
                                        <i class="fas fa-times-circle me-2"></i>{{ isCancelIncident ? 'Bác bỏ & Phạt Chủ Xe' : 'Phán xử chế tài / Khấu trừ bồi thường' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Nhập Phạt -->
            <div class="modal fade show" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);" v-if="showPenaltyModal">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow rounded-4">
                        <div class="modal-header border-bottom-0 pb-0">
                            <h5 class="modal-title fw-bold text-dark"><i class="fas fa-exclamation-triangle text-danger me-2"></i>{{ isCancelIncident ? 'Quyết định Xử Phạt Hủy Chuyến' : 'Quyết định Phán Xử Bồi Thường & Xử Phạt' }}</h5>
                            <button type="button" class="btn-close" @click="showPenaltyModal = false"></button>
                        </div>
                        <div class="modal-body py-4">
                            <p class="text-muted small mb-4">{{ isCancelIncident ? 'Bạn đã xác định bằng chứng của Chủ xe là giả mạo hoặc không đủ thuyết phục. Hệ thống sẽ tiến hành trừ điểm uy tín và bồi thường tiền cho Khách thuê.' : 'Ban Quản trị xác định bên vi phạm thắc mắc/tranh chấp hợp đồng. Quyết định chế tài tài chính dưới đây sẽ có tính chất chung cuộc theo quy chế Sàn AutoCar.' }}</p>
                            
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-dark small">Số điểm uy tín trừ đi <span class="text-danger">*</span></label>
                                <select class="form-select bg-light border-0 fw-medium" v-model="penaltyForm.deduct_score">
                                    <option value="1">Trừ 1 điểm (Vi phạm nhẹ)</option>
                                    <option value="2">Trừ 2 điểm (Vi phạm trung bình)</option>
                                    <option value="3">Trừ 3 điểm (Vi phạm nặng)</option>
                                    <option value="5">Trừ 5 điểm (Khóa tài khoản lập tức)</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-semibold text-dark small">Tiền phạt (Bồi thường cho khách) <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <input type="number" class="form-control bg-light border-0 fw-bold" v-model="penaltyForm.penalty_amount" placeholder="VD: 500000">
                                    <span class="input-group-text bg-light border-0 fw-bold">VNĐ</span>
                                </div>
                                <div class="form-text small">Số tiền này sẽ bị trừ trực tiếp từ Ví của Chủ xe và cộng vào Ví của Khách thuê.</div>
                            </div>
                        </div>
                        <div class="modal-footer border-top-0 pt-0">
                            <button type="button" class="btn btn-light fw-semibold" @click="showPenaltyModal = false">Hủy bỏ</button>
                            <button type="button" class="btn btn-danger fw-semibold px-4" @click="handleResolve('reject')" :disabled="submitting">
                                <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                                Xác nhận Phạt
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </main>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & ĐIỀU HƯỚNG BẢO ĐẢM (IMPORTS)
// ============================================================================
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SupportService from '@/services/support.service'; // Service xử lý Khiếu nại & Quyết định

const route = useRoute();
const router = useRouter();

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI & BIỂU MẪU XỬ PHẠT VI PHẠM (STATE & PENALTY FORM)
// ============================================================================
const ticket = ref(null);          // Hồ sơ khiếu nại (Kèm nội dung, hình ảnh Bằng chứng & Chủ đề)
const loading = ref(true);         // Cờ hiển thị hiệu ứng chờ tải chi tiết
const submitting = ref(false);     // Cờ khóa nút bấm trong khi phát lệnh thi hành phán quyết
const adminNote = ref('');         // Lời ghi chú / Giải trình của Quản trị viên khi chốt đơn
const showPenaltyModal = ref(false);// Hộp thoại nhập thông số xử phạt vi phạm (khi Reject bằng chứng)

// Bộ nhận diện Tranh chấp/Hủy chuyến theo Ngữ cảnh (Contextual Resolution Intelligence)
const isCancelIncident = computed(() => {
    if (!ticket.value) return true;
    const subj = (ticket.value.subject || '').toLowerCase();
    const bookingStatus = ticket.value.booking?.status;
    return subj.includes('hủy chuyến') || bookingStatus === 'cancelled';
});

const pageTitle = computed(() => isCancelIncident.value ? 'Thẩm định sự cố hủy chuyến' : 'Thẩm định & Giải quyết Sự cố Sau chuyến');
const bookingSectionTitle = computed(() => isCancelIncident.value ? 'Thông tin chuyến đi bị hủy' : 'Thông tin chuyến đi & phương tiện liên quan');

const isOwnerSender = computed(() => {
    if (!ticket.value) return false;
    return ticket.value.user_id === ticket.value.booking?.vehicle?.owner_id;
});

const ownerRoleLabel = computed(() => isOwnerSender.value ? 'Chủ xe (Người gửi yêu cầu / Báo sự cố)' : 'Chủ xe (Bên liên quan / Bị phản ánh)');
const renterRoleLabel = computed(() => !isOwnerSender.value ? 'Khách thuê (Người gửi khiếu nại / Báo sự cố)' : 'Khách thuê (Bên liên quan / Bị ảnh hưởng)');
const contentTitle = computed(() => `Nội dung trình bày từ ${isOwnerSender.value ? 'Chủ xe' : 'Khách thuê'}`);

// Biểu mẫu định dạng mức xử phạt khi Chủ xe / Khách hàng vi phạm sai trái
const penaltyForm = ref({
    deduct_score: 1,               // Trừ điểm uy tín
    penalty_amount: 500000         // Mức phạt vi phạm (VNĐ)
});

// ============================================================================
// 3. TRÌNH CHUYỂN HÓA CỦA SỐ LƯỢNG VÀ HÌNH ẢNH BẰNG CHỨNG (PROOF IMAGE UTILS)
// ============================================================================
/**
 * Tự động tạo chuỗi đường dẫn tuyệt đối cho hình ảnh Bằng chứng sự cố
 */
const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    let baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
    if (!path.startsWith('/')) path = '/' + path;
    return `${baseUrl}${path}`;
};

/**
 * Mở hình ảnh bằng chứng gốc trên Tab mới của Trình duyệt để soi rõ từng chi tiết xước xát
 */
const openImage = (url) => {
    window.open(url, '_blank');
};

// ============================================================================
// 4. MÓC DẪN VÒNG ĐỜI & HỢP THỂ GIẢI MÃ JSON BẰNG CHỨNG (LIFECYCLE & JSON PARSE)
// ============================================================================
/**
 * Nạp chi tiết sự cố khiếu nại.
 * Đặc biệt: Tự động Kiểm tra và Giải mã hai lần (Double JSON Parse) cho chuỗiAttachments 
 * phòng rủi ro bị mã hóa lồng nhau khi tải ảnh lên server
 */
onMounted(async () => {
    const ticketId = route.params.id;
    if (!ticketId) {
        alert('Không tìm thấy ID Ticket');
        router.push('/admin/support-tickets');
        return;
    }
    
    try {
        const res = await SupportService.getTicketDetail(ticketId);
        if (res.data?.success) {
            let data = res.data.data;
            if (data.attachments && typeof data.attachments === 'string') {
                try {
                    data.attachments = JSON.parse(data.attachments);
                    // Lực cản an toàn: Nếu giải mã lần 1 vẫn là chuỗi thì Giải mã thêm lần 2
                    if (typeof data.attachments === 'string') {
                        data.attachments = JSON.parse(data.attachments);
                    }
                } catch (e) {
                    console.error('Lỗi parse attachments:', e);
                }
            }
            ticket.value = data;
        } else {
            alert('Không tải được ticket');
        }
    } catch (err) {
        console.error(err);
        alert('Lỗi tải dữ liệu');
    } finally {
        loading.value = false;
    }
});

// ============================================================================
// 5. TRÌNH PHÁN QUYẾT TỐI CAO - DUYỆT BỘI THƯỜNG HỎA XỬ PHẠT (RESOLUTION ACTIONS)
// ============================================================================
/**
 * Ban Quản Trị chốt quyết định cho Vụ khiếu nại/Sự cố:
 * - action = 'approve': Chấp thuận Bằng chứng (Miễn truy cứu lỗi Chủ xe / Khách hàng)
 * - action = 'reject': Tuyên hủy bằng chứng không hợp lệ -> Áp dụng xử phạt tiền và trừ điểm uy tín
 */
const handleResolve = async (action) => {
    if (action === 'approve' && !confirm('Bạn xác nhận Bằng chứng hợp lệ và bỏ qua lỗi cho Chủ xe?')) {
        return;
    }

    submitting.value = true;
    try {
        const payload = {
            action: action,
            admin_note: adminNote.value,
        };

        // Nếu Bác bỏ (reject), gộp thêm mức áp đặt xử phạt từ Biểu mẫu
        if (action === 'reject') {
            payload.deduct_score = penaltyForm.value.deduct_score;
            payload.penalty_amount = penaltyForm.value.penalty_amount;
        }

        const res = await SupportService.resolveIncident(ticket.value.id, payload);
        if (res.data?.success) {
            alert(res.data.message || 'Xử lý thành công!');
            showPenaltyModal.value = false;
            router.push('/admin/support-tickets');
        }
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Lỗi khi xử lý');
    } finally {
        submitting.value = false;
    }
};
</script>
