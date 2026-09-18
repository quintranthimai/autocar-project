<template>
    <div class="profile-page bg-light py-5 min-vh-100">
        <div class="container">
            <div class="row g-4">
                
                <ProfileSidebar />

                <div class="col-lg-9">
                    <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                        <h2 class="fw-bold mb-0"><i class="fas fa-headset text-primary me-2"></i>Trung tâm Hỗ trợ & Khiếu nại</h2>
                        <button class="btn btn-primary fw-bold shadow-sm" @click="showModal = true">
                            <i class="fas fa-plus me-1"></i> Gửi khiếu nại mới
                        </button>
                    </div>

                    <!-- Loading State -->
                    <div v-if="loading" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status"></div>
                        <div class="mt-2 text-muted fw-medium">Đang tải lịch sử khiếu nại...</div>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="!loading && tickets.length === 0" class="text-center py-5 bg-white rounded-4 border shadow-sm">
                        <img src="https://cdn-icons-png.flaticon.com/512/7486/7486747.png" alt="No Tickets" class="img-fluid mb-3 opacity-50" style="max-width: 120px;">
                        <h5 class="fw-bold text-dark">Bạn chưa gửi khiếu nại nào</h5>
                        <p class="text-muted">Nếu có vấn đề với chuyến đi hoặc đối tác, hãy gửi yêu cầu hỗ trợ để chúng tôi giải quyết nhé.</p>
                    </div>

                    <!-- Ticket List -->
                    <div v-else class="bg-white rounded-4 shadow-sm border overflow-hidden">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light text-muted small">
                                    <tr>
                                        <th class="ps-4">MÃ TICKET</th>
                                        <th>TIÊU ĐỀ</th>
                                        <th>CHUYẾN ĐI (NẾU CÓ)</th>
                                        <th>TRẠNG THÁI</th>
                                        <th>NGÀY GỬI</th>
                                    </tr>
                                </thead>
                                <tbody class="border-top-0">
                                    <tr v-for="ticket in tickets" :key="ticket.id">
                                        <td class="ps-4 fw-bold text-dark">#TK-{{ ticket.id }}</td>
                                        <td>
                                            <div class="fw-semibold text-dark text-truncate" style="max-width: 250px;" :title="ticket.subject">{{ ticket.subject }}</div>
                                            <div class="small text-muted text-truncate" style="max-width: 250px;">{{ ticket.content }}</div>
                                        </td>
                                        <td>
                                            <span v-if="ticket.booking_id" class="badge bg-light text-dark border">Chuyến DX-{{ ticket.booking_id }}</span>
                                            <span v-else class="text-muted small fst-italic">Không có</span>
                                        </td>
                                        <td>
                                            <span class="badge rounded-pill" :class="getStatusClass(ticket.status)">
                                                {{ getStatusLabel(ticket.status) }}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="small text-muted">{{ formatDate(ticket.created_at) }}</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Modal Tạo Khiếu nại -->
                <div class="modal fade show" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);" v-if="showModal">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content border-0 shadow rounded-4">
                            <div class="modal-header border-bottom-0 pb-0">
                                <h5 class="modal-title fw-bold text-dark"><i class="fas fa-edit text-primary me-2"></i>Gửi Yêu cầu Hỗ trợ / Khiếu nại</h5>
                                <button type="button" class="btn-close" @click="closeModal"></button>
                            </div>
                            <form @submit.prevent="submitTicket">
                                <div class="modal-body py-4">
                                    <div class="alert alert-info border-0 bg-info bg-opacity-10 d-flex align-items-center mb-4">
                                        <i class="fas fa-info-circle fs-4 text-info me-3"></i>
                                        <div class="small text-dark">
                                            Vui lòng mô tả chi tiết sự cố và cung cấp hình ảnh minh chứng rõ nét (trước và sau chuyến đi). Bộ phận CSKH sẽ căn cứ trên hình ảnh và biên bản bàn giao thực tế để đóng vai trò trung gian, giải quyết minh bạch mọi khiếu nại nhằm bảo vệ quyền lợi chính đáng và thỏa đáng cho hai bên.
                                        </div>
                                    </div>
                                    
                                    <div class="row g-3">
                                        <div class="col-md-8">
                                            <label class="form-label fw-semibold small text-dark">Tiêu đề khiếu nại <span class="text-danger">*</span></label>
                                            <input type="text" class="form-control bg-light border-0" v-model="form.subject" placeholder="Ví dụ: Khách hàng làm trầy xước xe" required>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label fw-semibold small text-dark">Mã chuyến đi (Tùy chọn)</label>
                                            <input type="number" class="form-control bg-light border-0" v-model="form.booking_id" placeholder="ID chuyến">
                                            <div class="form-text small" style="font-size: 0.7rem;">VD: Điền số 12 nếu là chuyến DX-12</div>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label fw-semibold small text-dark">Nội dung chi tiết <span class="text-danger">*</span></label>
                                            <textarea class="form-control bg-light border-0" rows="5" v-model="form.content" placeholder="Mô tả sự việc một cách trung thực và khách quan..." required></textarea>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label fw-semibold small text-dark">Hình ảnh minh chứng</label>
                                            <input type="file" class="form-control bg-light border-0" multiple accept="image/*" @change="handleFileSelect">
                                            <div class="form-text small">Tối đa 5 ảnh. Giới hạn 5MB/ảnh.</div>
                                            
                                            <!-- Preview Images -->
                                            <div class="d-flex gap-2 flex-wrap mt-3" v-if="previewUrls.length > 0">
                                                <div v-for="(url, index) in previewUrls" :key="index" class="position-relative">
                                                    <img :src="url" class="rounded border" style="width: 80px; height: 80px; object-fit: cover;">
                                                    <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 translate-middle rounded-circle p-1" style="width: 24px; height: 24px; line-height: 1;" @click="removeImage(index)">
                                                        <i class="fas fa-times" style="font-size: 0.7rem;"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer border-top-0 pt-0">
                                    <button type="button" class="btn btn-light fw-semibold" @click="closeModal" :disabled="submitting">Hủy bỏ</button>
                                    <button type="submit" class="btn btn-primary fw-semibold px-4" :disabled="submitting">
                                        <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                                        Gửi Khiếu nại
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & HỆ SỞ TRUY NGUYÊN KHIẾU NẠI (IMPORTS)
// ============================================================================
import { ref, onMounted } from 'vue';
import ProfileSidebar from '@/components/web/ProfileSidebar.vue';
import UserTicketService from '@/services/user-ticket.service';

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI DANH SÁCH VÀ BIỂU MẪU KHIẾU NẠI (STATE)
// ============================================================================
const tickets = ref([]);        // Mảng trọn bộ lịch sử yêu cầu hỗ trợ / khiếu nại
const loading = ref(true);      // Cờ trạng thái chờ nạp dữ liệu từ máy chủ
const showModal = ref(false);   // Điều khiển trạng thái Ẩn/Hiện Modal tạo Ticket mới
const submitting = ref(false);  // Cờ khóa tác vụ trong khi đang đệ trình dữ liệu lên Server

// Biểu mẫu thu nhận thông tin Khiếu nại từ khách
const form = ref({
    subject: '',
    content: '',
    booking_id: ''
});

const selectedFiles = ref([]); // Danh sách File hình ảnh minh chứng gửi kèm
const previewUrls = ref([]);   // Danh sách đường dẫn Object URL xem trước hình ảnh

// ============================================================================
// 3. TRÌNH TRUY TRUYỀN LỊCH SỬ KHIẾU NẠI (FETCH TICKETS API)
// ============================================================================
/**
 * Tải danh sách toàn bộ Yêu cầu Khiếu nại / CSKH mà người dùng này từng khởi tạo
 */
const fetchTickets = async () => {
    loading.value = true;
    try {
        const res = await UserTicketService.getMyTickets();
        if (res.data?.success) {
            tickets.value = res.data.data;
        }
    } catch (error) {
        console.error('Lỗi lấy danh sách ticket', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchTickets();
});

// ============================================================================
// 4. TRÌNH KIỂM CHỨNG & XỬ LÝ QUY TRÌNH HÌNH ẢNH MINH CHỨNG (FILE UPLOAD UTILS)
// ============================================================================

/**
 * Xử lý tải lên nhiều ảnh (Tối đa 5 ảnh & Dung lượng trần 5MB/tệp)
 */
const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (selectedFiles.value.length + files.length > 5) {
        alert('Chỉ được tải lên tối đa 5 ảnh');
        return;
    }

    files.forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
            alert(`Ảnh ${file.name} vượt quá giới hạn 5MB`);
            return;
        }
        selectedFiles.value.push(file);
        previewUrls.value.push(URL.createObjectURL(file));
    });
};

/**
 * Loại bỏ ảnh đã chọn và giải phóng bộ nhớ Object URL tương ứng
 */
const removeImage = (index) => {
    selectedFiles.value.splice(index, 1);
    const url = previewUrls.value.splice(index, 1)[0];
    URL.revokeObjectURL(url);
};

// ============================================================================
// 5. NGHIỆP VỤ HỢP NHẤT MODAL & ĐỆ TRÌNH TICKET LÊN MÁY CHỦ (SUBMIT TICKET)
// ============================================================================

/**
 * Đóng Modal và xóa trắng toàn bộ dữ liệu bản nháp Biểu mẫu Khiếu nại
 */
const closeModal = () => {
    showModal.value = false;
    form.value = { subject: '', content: '', booking_id: '' };
    selectedFiles.value = [];
    previewUrls.value.forEach(url => URL.revokeObjectURL(url));
    previewUrls.value = [];
};

/**
 * Chốt gửi hồ sơ khiếu nại (kèm minh chứng ảnh) lên hệ thống CSKH
 */
const submitTicket = async () => {
    submitting.value = true;
    try {
        const formData = new FormData();
        formData.append('subject', form.value.subject);
        formData.append('content', form.value.content);
        if (form.value.booking_id) {
            formData.append('booking_id', form.value.booking_id);
        }
        selectedFiles.value.forEach(file => {
            formData.append('evidences[]', file);
        });

        const res = await UserTicketService.createTicket(formData);
        if (res.data?.success) {
            alert('Đã gửi khiếu nại thành công! Bộ phận CSKH sẽ sớm phản hồi.');
            closeModal();
            fetchTickets();
        }
    } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi gửi khiếu nại');
    } finally {
        submitting.value = false;
    }
};

// ============================================================================
// 6. BỘ HÀM TIỆN ÍCH HIỂN THỊ VÀ TRANG HỌC TRẠNG THÁI (RENDER UTILS)
// ============================================================================
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getStatusLabel = (status) => {
    const map = {
        'open': 'Chờ xử lý',
        'in_progress': 'Đang xử lý',
        'resolved': 'Đã giải quyết',
        'closed': 'Đã đóng'
    };
    return map[status] || status;
};

const getStatusClass = (status) => {
    const map = {
        'open': 'bg-warning text-dark',
        'in_progress': 'bg-primary text-white',
        'resolved': 'bg-success text-white',
        'closed': 'bg-secondary text-white'
    };
    return map[status] || 'bg-light text-dark';
};
</script>
