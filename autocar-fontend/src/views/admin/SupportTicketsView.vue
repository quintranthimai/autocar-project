<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">

            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h1 class="fs-3 mb-1 fw-bold text-dark">Hỗ trợ khách hàng</h1>
                            <p class="mb-0 text-muted">Quản lý khiếu nại, thắc mắc và yêu cầu hỗ trợ từ người dùng hệ
                                thống</p>
                        </div>
                        <!-- <div class="d-flex gap-2">
                            <button class="btn btn-outline-primary fw-semibold shadow-sm bg-white">
                                <i class="fas fa-cog me-2"></i>Cài đặt phản hồi tự động
                            </button>
                            <button class="btn btn-primary fw-semibold shadow-sm">
                                <i class="fas fa-plus me-2"></i>Tạo Ticket mới
                            </button>
                        </div> -->
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-body p-4">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label text-muted small fw-semibold">Tìm kiếm yêu cầu</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light border-0"><i
                                        class="fas fa-search text-muted"></i></span>
                                <input type="text" class="form-control bg-light border-0 fw-medium"
                                    placeholder="Nhập mã YC, email, số điện thoại..." v-model="searchQuery" @keyup.enter="fetchTickets(1)">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted small fw-semibold">Vai trò</label>
                            <select class="form-select bg-light border-0 fw-medium" v-model="filterRole"
                                @change="fetchTickets(1)">
                                <option value="all">Tất cả</option>
                                <option value="renter">Khách thuê xe</option>
                                <option value="owner">Chủ xe</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted small fw-semibold">Trạng thái</label>
                            <select class="form-select bg-light border-0 fw-medium" v-model="filterStatus"
                                @change="fetchTickets(1)">
                                <option value="all">Tất cả trạng thái</option>
                                <option value="open">Mới (Cần xử lý)</option>
                                <option value="in_progress">Đang xử lý</option>
                                <option value="closed">Đã đóng</option>
                            </select>
                        </div>
                        <div class="col-md-2 d-flex align-items-end">
                            <button class="btn btn-dark w-100 fw-semibold" @click="fetchTickets(1)"><i
                                    class="fas fa-filter me-2"></i>Lọc</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0 text-center">
                            <thead class="bg-light text-muted small text-uppercase">
                                <tr>
                                    <th class="py-4 ps-4 text-start">Mã YC</th>
                                    <th class="py-4 text-start">Người gửi</th>
                                    <th class="py-4 text-start">Nội dung hỗ trợ</th>
                                    <th class="py-4">Mức độ</th>
                                    <th class="py-4">Trạng thái</th>
                                    <th class="py-4">Cập nhật lúc</th>
                                    <th class="py-4 pe-4">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody class="text-dark border-top-0">
                                <tr v-for="ticket in filteredTickets" :key="ticket.id">
                                    <td class="ps-4 text-start fw-bold text-primary">#{{ ticket.code }}</td>

                                    <td class="text-start">
                                        <div class="fw-bold text-dark mb-1">{{ ticket.senderName }}</div>
                                        <div class="text-muted small">
                                            <i class="fas fa-envelope me-1"></i>{{ ticket.senderEmail }}
                                        </div>
                                        <span
                                            class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 mt-1 rounded-pill fw-normal"
                                            style="font-size: 0.7rem;">
                                            {{ ticket.role === 'renter' ? 'Khách thuê' : 'Chủ xe' }}
                                        </span>
                                    </td>

                                    <td class="text-start" style="max-width: 260px;">
                                        <div class="d-flex align-items-center gap-1 mb-1">
                                            <span v-if="ticket.subject && ticket.subject.toLowerCase().includes('hủy chuyến')" class="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-0" style="font-size: 0.7rem;"><i class="fas fa-ban me-1"></i>Hủy chuyến</span>
                                            <span v-else class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-0" style="font-size: 0.7rem;"><i class="fas fa-gavel me-1"></i>Sự cố sau chuyến</span>
                                            <span class="fw-bold text-dark text-truncate">{{ ticket.subject }}</span>
                                        </div>
                                        <div class="text-muted small text-truncate">{{ ticket.lastMessage }}</div>
                                    </td>

                                    <td>
                                        <span :class="getPriorityBadgeClass(ticket.priority)"
                                            class="badge px-3 py-1 rounded-pill fw-medium">
                                            {{ getPriorityText(ticket.priority) }}
                                        </span>
                                    </td>

                                    <td>
                                        <span :class="getStatusBadgeClass(ticket.status)"
                                            class="badge px-3 py-2 rounded-pill fw-medium">
                                            {{ getStatusText(ticket.status) }}
                                        </span>
                                    </td>

                                    <td class="text-muted small fw-medium">{{ ticket.updatedAt }}</td>

                                    <td class="pe-4">
                                        <button class="btn btn-sm fw-semibold rounded-3 px-3" :disabled="loading"
                                            @click="handleTicketAction(ticket)"
                                            :class="ticket.status === 'open' ? 'btn-primary' : 'btn-light border text-dark'">
                                            <i :class="ticket.status === 'closed' ? 'far fa-eye' : 'fas fa-reply'"
                                                class="me-1"></i>
                                            {{ ticket.status === 'closed' ? 'Xem' : 'Phản hồi' }}
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="filteredTickets.length === 0">
                                    <td colspan="7" class="py-5 text-muted">
                                        <i class="fas fa-headset fs-2 mb-3 opacity-50 d-block"></i>
                                        Không tìm thấy yêu cầu hỗ trợ nào.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card-footer bg-white border-top p-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted small fw-medium">Hiển thị {{ pagination.from }} - {{ pagination.to }} trong
                        tổng số {{ pagination.total }} yêu cầu</div>
                    <nav aria-label="Page navigation" v-if="pagination.last_page > 1">
                        <ul class="pagination pagination-sm mb-0 gap-2">
                            <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                                <a class="page-link border-0 rounded-3 text-muted bg-light" href="#" tabindex="-1"
                                    @click.prevent="fetchTickets(pagination.current_page - 1)"><i
                                        class="fas fa-chevron-left"></i></a>
                            </li>
                            <li class="page-item" v-for="page in pagination.last_page" :key="page"
                                :class="{ active: pagination.current_page === page }">
                                <a class="page-link border-0 rounded-3 shadow-sm" href="#"
                                    @click.prevent="fetchTickets(page)">{{ page }}</a>
                            </li>
                            <li class="page-item"
                                :class="{ disabled: pagination.current_page === pagination.last_page }">
                                <a class="page-link border-0 rounded-3 text-dark bg-light" href="#"
                                    @click.prevent="fetchTickets(pagination.current_page + 1)"><i
                                        class="fas fa-chevron-right"></i></a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

        </div>
    </main>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CỔNG NỐI DỊCH VỤ HỖ TRỢ (IMPORTS)
// ============================================================================
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SupportService from '@/services/support.service'; // Dịch vụ quản lý Yêu cầu hỗ trợ & Khiếu nại

const router = useRouter();

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI & TRÌNH BỘ LỌC TICKET (FILTERS & STATE)
// ============================================================================
const searchQuery = ref('');       // Từ khóa tra cứu mã khiếu nại KN hoặc tên khách/chủ xe
const filterRole = ref('all');     // Bộ lọc theo đối tượng gửi: Chủ xe vs Khách thuê
const filterStatus = ref('all');   // Bộ lọc tình trạng Mới (open) / Đang xử lý (in_progress) / Đã đóng (closed)

const loading = ref(false);        // Cờ chờ hiển thị hiệu ứng nạp dữ liệu
const tickets = ref([]);           // Danh sách Phiếu yêu cầu Khiếu nại/Hỗ trợ

// Đối tượng theo dõi trạng thái Phân trang
const pagination = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
});

// Xử lý bộ lọc dữ liệu Ticket
const filteredTickets = computed(() => tickets.value);

// ============================================================================
// 3. CÁC BỘ TIỆN ÍCH CHUYỂN HÓA VAI TRÒ & THỜI GIAN TUYỆT HẢO (FORMATTERS)
// ============================================================================
// Đồng bộ và quy chuẩn hóa trạng thái về 3 mốc căn bản: open, in_progress, closed
const normalizeStatus = (status) => {
    if (status === 'new' || status === 'open') return 'open';
    if (status === 'resolved' || status === 'closed') return 'closed';
    return 'in_progress';
};

// Nhận diện đối tượng người gửi là Chủ xe (owner) hay Khách thuê xe (renter)
const mapRole = (roles = []) => {
    const slugs = roles.map(r => r.slug);
    return slugs.includes('owner') ? 'owner' : 'renter';
};

/**
 * Thuật toán tính toán mốc thời gian Tương đối ("3 phút trước", "2 giờ trước", "5 ngày trước")
 */
const formatRelativeTime = (dateString) => {
    if (!dateString) return 'N/A';
    const now = new Date();
    const created = new Date(dateString);
    const diffMs = now - created;
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 60) return `${Math.max(diffMinutes, 1)} phút trước`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return created.toLocaleDateString('vi-VN');
};

// Quy đổi màu sắc thẻ Badge cho Mức độ Ưu tiên (Priority)
const getPriorityBadgeClass = (priority) => {
    switch (priority) {
        case 'high': return 'bg-danger text-white';       // Gấp -> Đỏ
        case 'medium': return 'bg-warning text-dark';     // Trung bình -> Vàng
        case 'low': return 'bg-info bg-opacity-10 text-info border border-info border-opacity-25';
        default: return 'bg-secondary text-white';
    }
};

const getPriorityText = (priority) => {
    switch (priority) {
        case 'high': return 'Cao';
        case 'medium': return 'Trung bình';
        case 'low': return 'Thấp';
        default: return 'Không rõ';
    }
};

// Quy đổi màu sắc thẻ Badge cho Trạng thái Ticket (Status)
const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'open': return 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
        case 'in_progress': return 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25';
        case 'closed': return 'bg-success bg-opacity-10 text-success border border-success border-opacity-25';
        default: return 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25';
    }
};

const getStatusText = (status) => {
    switch (status) {
        case 'open': return 'Mới';
        case 'in_progress': return 'Đang xử lý';
        case 'closed': return 'Đã đóng';
        default: return 'Không xác định';
    }
};

// ============================================================================
// 4. TRÌNH NẠP DANH SÁCH & NGHIỆP VỤ TIẾP CHUYỂN KHIẾU NẠI (API & ACTIONS)
// ============================================================================
/**
 * Tải danh sách Phiếu Hỗ trợ / Khiếu nại từ hệ thống có kèm theo tham số Trạng thái, Đối tượng & Tra cứu
 */
const fetchTickets = async (page = 1) => {
    if (page < 1) return;

    loading.value = true;
    try {
        const response = await SupportService.getTickets({
            page,
            status: filterStatus.value,
            role: filterRole.value,
            search: searchQuery.value,
            perPage: 10,
        });

        if (response.data?.success) {
            const result = response.data.data;
            tickets.value = (result.data || []).map((ticket) => ({
                id: ticket.id,
                code: `KN${ticket.id}`, // Tạo Tiền tố KN (Khiếu Nại) cho mã ID
                senderName: ticket.user?.name || 'N/A',
                senderEmail: ticket.user?.email || 'N/A',
                role: mapRole(ticket.user?.roles || []),
                subject: ticket.subject || 'Không có tiêu đề',
                lastMessage: ticket.content || 'Không có nội dung',
                priority: ticket.priority || 'medium',
                status: normalizeStatus(ticket.status),
                updatedAt: formatRelativeTime(ticket.updated_at || ticket.created_at),
            }));

            pagination.value = {
                current_page: result.current_page,
                last_page: result.last_page,
                total: result.total,
                from: result.from || 0,
                to: result.to || 0,
            };
        }
    } catch (error) {
        console.error('Lỗi tải ticket:', error);
    } finally {
        loading.value = false;
    }
};

/**
 * Khi Quản trị viên bấm xem: Nếu Ticket là mới (open), tự động nâng trạng thái sang 'in_progress'
 * Sau đó chuyển ngay giao diện về Trung tâm Phán quyết Khiếu nại (Dispute Resolution View)
 */
const handleTicketAction = async (ticket) => {
    if (ticket.status === 'open') {
        try {
            await SupportService.updateTicketStatus(ticket.id, 'in_progress');
        } catch (error) {
            console.error('Lỗi khi nhận xử lý ticket:', error);
        }
    }
    
    // Chuyển hướng sang trang phán quyết rạch ròi bồi thường
    router.push(`/admin/dispute-resolution/${ticket.id}`);
};

// ============================================================================
// 5. MÓC DẪN VÒNG ĐỜI COMPONENT (LIFECYCLE HOOKS)
// ============================================================================
onMounted(() => {
    fetchTickets();
});
</script>
