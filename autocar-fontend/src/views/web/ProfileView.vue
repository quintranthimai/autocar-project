<template>
    <div class="profile-page bg-light py-5 min-vh-100">
        <div class="container">
            <div class="row g-4">

                <ProfileSidebar />

                <div class="col-lg-9">

                    <div class="bg-white rounded-4 shadow-sm p-4 p-md-5 mb-4">
                        <div class="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
                            <h4 class="fw-bold mb-0">Thông tin tài khoản
                                <i class="fas fa-pen text-muted fs-6 ms-2 cursor-pointer" @click="isEditingName = true"
                                    title="Đổi tên"></i>
                            </h4>
                            <div class="d-flex gap-3 align-items-center">
                                <button v-if="!isOwner" @click="handleUpgradeToOwner"
                                    class="btn btn-warning fw-bold text-dark rounded-pill px-4 shadow-sm"
                                    :disabled="isUpgrading">
                                    <i class="fas fa-car-side me-2"></i>
                                    <span v-if="isUpgrading" class="spinner-border spinner-border-sm"
                                        role="status"></span>
                                    <span v-else>Trở thành Chủ xe</span>
                                </button>

                                <div class="border border-primary bg-white text-primary rounded-3 px-3 py-2 fw-bold">
                                    <i class="fas fa-suitcase-rolling me-1"></i> <span class="fs-5">{{ completedTrips
                                    }}</span> chuyến
                                </div>
                            </div>
                        </div>

                        <div class="row g-5">
                            <div class="col-md-4 text-center">
                                <div class="position-relative d-inline-block mb-3">
                                    <img :src="avatarPreview || '/img/team-1.jpg'"
                                        class="rounded-circle object-fit-cover border shadow-sm bg-white" width="120"
                                        height="120" alt="Avatar">

                                    <label for="avatarUpload"
                                        class="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 cursor-pointer shadow"
                                        style="transform: translate(-10%, -10%);" title="Đổi ảnh đại diện">
                                        <i class="fas fa-camera"></i>
                                    </label>
                                    <input type="file" id="avatarUpload" class="d-none" accept="image/*"
                                        @change="handleAvatarChange">
                                </div>

                                <div v-if="!isEditingName"
                                    class="d-flex justify-content-center align-items-center gap-2 mb-1">
                                    <h4 class="fw-bold mb-0">{{ editableProfile.name }}</h4>
                                </div>
                                <div v-else class="d-flex justify-content-center align-items-center gap-2 mb-1 px-4">
                                    <input type="text" class="form-control form-control-sm text-center fw-bold"
                                        v-model="editableProfile.name" @keyup.enter="saveName">
                                    <button class="btn btn-success btn-sm px-2" @click="saveName"><i
                                            class="fas fa-check"></i></button>
                                </div>

                                <p class="text-muted small mb-4">Tham gia: {{ joinDate || '04/09/2025' }}</p>

                                <div class="d-flex justify-content-center gap-2 flex-wrap">
            
                                    <span
                                        class="badge bg-success bg-opacity-10 text-dark border border-success rounded-pill px-3 py-2 fs-6">
                                        <i class="fas fa-wallet me-1 text-success"></i> {{ formatCurrency(walletBalance)
                                        }}
                                    </span>
                                </div>
                            </div>

                            <div class="col-md-8">
                                <ProfileContactEdit :phone="editableProfile.phone" :email="editableProfile.email"
                                    :dob="userProfile.dob" :gender="userProfile.gender" @updatePhone="handleUpdatePhone"
                                    @updateEmail="handleUpdateEmail" />
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-4 shadow-sm p-4 p-md-5 mb-4">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <div class="d-flex align-items-center gap-3">
                                <h4 class="fw-bold mb-0">Căn cước công dân</h4>
                                <span v-if="userProfile.isVerified"
                                    class="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1">
                                    <i class="fas fa-check-circle"></i> Đã xác thực
                                </span>
                                <span v-else-if="userProfile.isPending"
                                    class="badge bg-warning bg-opacity-10 text-warning rounded-pill px-2 py-1">
                                    <i class="fas fa-clock"></i> Đang chờ duyệt
                                </span>
                                <span v-else class="badge bg-danger bg-opacity-10 text-danger rounded-pill px-2 py-1">
                                    <i class="fas fa-times-circle"></i> Chưa xác thực
                                </span>
                            </div>
                            <router-link :to="{ name: 'kyc-verification' }"
                                class="btn btn-outline-dark rounded-3 px-4 fw-bold">
                                {{ userProfile.isVerified || userProfile.isPending ? 'Chỉnh sửa' : 'Cập nhật' }} <i
                                    class="fas fa-pen ms-1"></i>
                            </router-link>
                        </div>

                        <template v-if="!userProfile.isVerified">
                            <div class="bg-danger bg-opacity-10 text-danger p-3 rounded-3 small mb-3">
                                Việc xác thực Căn cước công dân là bắt buộc để đảm bảo tính minh bạch và an toàn cho mọi
                                giao dịch thuê xe trên hệ thống.
                            </div>
                            <div class="bg-primary bg-opacity-10 text-primary p-3 rounded-3 small mb-4">
                                Hình chụp cần rõ nét, không bị lóa sáng hay mất góc. Thông tin trên thẻ phải khớp với
                                thông tin cá nhân bạn đã khai báo.
                            </div>
                        </template>

                        <div v-if="userProfile.isVerified || userProfile.isPending">
                            <div class="bg-light p-4 rounded-3 mb-4 border border-secondary border-opacity-25">
                                <h6 class="fw-bold text-dark mb-3"><i class="fas fa-id-card me-2 text-primary"></i>Thông
                                    tin thẻ</h6>
                                <div class="row">
                                    <div class="col-md-6 mb-2">
                                        <span class="text-muted small d-block">Số CCCD:</span>
                                        <span class="fw-bold fs-6 text-dark">{{ userProfile.idNumber }}</span>
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <span class="text-muted small d-block">Họ và tên:</span>
                                        <span class="fw-bold text-dark">{{ userProfile.fullName }}</span>
                                    </div>
                                    <div class="col-md-6 mb-2 mt-2">
                                        <span class="text-muted small d-block">Ngày sinh:</span>
                                        <span class="fw-bold text-dark">{{ userProfile.dob }}</span>
                                    </div>
                                    <div class="col-md-6 mb-2 mt-2">
                                        <span class="text-muted small d-block">Ngày hết hạn:</span>
                                        <span class="fw-bold text-dark">{{ userProfile.doe }}</span>
                                    </div>
                                    <div class="col-12 mt-2">
                                        <span class="text-muted small d-block">Nơi thường trú:</span>
                                        <span class="fw-bold text-dark">{{ userProfile.address }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="row g-4">
                                <div class="col-md-6">
                                    <p class="fw-bold mb-2">Mặt trước CCCD</p>
                                    <img :src="userImages.cccdFront"
                                        class="img-fluid rounded-3 border w-100 object-fit-cover shadow-sm"
                                        style="height: 200px;" alt="CCCD Front">
                                </div>
                                <div class="col-md-6">
                                    <p class="fw-bold mb-2">Mặt sau CCCD</p>
                                    <img :src="userImages.cccdBack"
                                        class="img-fluid rounded-3 border w-100 object-fit-cover shadow-sm"
                                        style="height: 200px;" alt="CCCD Back">
                                </div>
                            </div>

                            <div v-if="userProfile.isVerified" class="mt-3">
                                <p class="text-success small mb-0 fw-bold"><i class="fas fa-check-circle"></i> Xác thực
                                    thành công bởi hệ thống AI OCR.</p>
                            </div>
                            <div v-else-if="userProfile.isPending" class="mt-3">
                                <p class="text-warning small mb-0 fw-bold"><i class="fas fa-spinner fa-spin me-1"></i>
                                    Hồ sơ của bạn đã được gửi
                                    thành công và đang chờ Admin xét duyệt.</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-4 shadow-sm p-4 p-md-5 mb-4">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <div class="d-flex align-items-center gap-3">
                                <h4 class="fw-bold mb-0">Giấy phép lái xe</h4>
                                <span v-if="gplxProfile.isVerified"
                                    class="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1">
                                    <i class="fas fa-check-circle"></i> Đã xác thực
                                </span>
                                <span v-else-if="gplxProfile.isPending"
                                    class="badge bg-warning bg-opacity-10 text-warning rounded-pill px-2 py-1">
                                    <i class="fas fa-clock"></i> Đang chờ duyệt
                                </span>
                                <span v-else class="badge bg-danger bg-opacity-10 text-danger rounded-pill px-2 py-1">
                                    <i class="fas fa-times-circle"></i> Chưa xác thực
                                </span>
                            </div>
                            <router-link v-if="userProfile.isVerified || userProfile.isPending" :to="{ name: 'gplx-verification' }"
                                class="btn btn-outline-dark rounded-3 px-4 fw-bold">
                                {{ gplxProfile.isVerified || gplxProfile.isPending ? 'Chỉnh sửa' : 'Cập nhật' }} <i
                                    class="fas fa-pen ms-1"></i>
                            </router-link>
                            <button v-else class="btn btn-outline-secondary rounded-3 px-4 fw-bold" disabled title="Vui lòng cập nhật CCCD trước">
                                Cập nhật <i class="fas fa-lock ms-1"></i>
                            </button>
                        </div>

                        <template v-if="!(userProfile.isVerified || userProfile.isPending)">
                            <div class="bg-warning bg-opacity-10 text-warning p-3 rounded-3 small mb-3">
                                <i class="fas fa-exclamation-triangle me-1"></i> Bạn phải cập nhật <strong>Căn cước công dân</strong> trước khi có thể tải lên Giấy phép lái xe.
                            </div>
                        </template>
                        <template v-else-if="!gplxProfile.isVerified">
                            <div class="bg-danger bg-opacity-10 text-danger p-3 rounded-3 small mb-3">
                                Khách thuê cần xác thực GPLX chính chủ đồng thời phải là người trực tiếp làm thủ tục khi
                                nhận xe.
                            </div>
                            <div class="bg-primary bg-opacity-10 text-primary p-3 rounded-3 small mb-4">
                                Hình chụp cần thấy được Ảnh chân dung và Số GPLX. Bạn có thể sử dụng thẻ PET hoặc GPLX
                                điện tử trên VNeID.
                            </div>
                        </template>

                        <div v-if="gplxProfile.isVerified || gplxProfile.isPending">
                            <div class="bg-light p-4 rounded-3 mb-4 border border-secondary border-opacity-25">
                                <h6 class="fw-bold text-dark mb-3"><i
                                        class="fas fa-id-card-clip me-2 text-primary"></i>Thông tin thẻ</h6>
                                <div class="row">
                                    <div class="col-md-6 mb-2">
                                        <span class="text-muted small d-block">Số GPLX:</span>
                                        <span class="fw-bold fs-6 text-dark">{{ gplxProfile.idNumber }}</span>
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <span class="text-muted small d-block">Họ và tên:</span>
                                        <span class="fw-bold text-dark">{{ gplxProfile.fullName }}</span>
                                    </div>
                                    <div class="col-md-6 mt-2">
                                        <span class="text-muted small d-block">Ngày sinh:</span>
                                        <span class="fw-bold text-dark">{{ gplxProfile.dob }}</span>
                                    </div>
                                    <div class="col-md-6 mt-2">
                                        <span class="text-muted small d-block">Hạng bằng:</span>
                                        <span class="fw-bold text-dark">{{ gplxProfile.gplxClass }}</span>
                                    </div>
                                    <div class="col-12 mt-2">
                                        <span class="text-muted small d-block">Ngày hết hạn:</span>
                                        <span class="fw-bold text-dark">{{ gplxProfile.doe }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="row g-4">
                                <div class="col-md-6">
                                    <p class="fw-bold mb-2">Ảnh mặt trước GPLX</p>
                                    <img :src="gplxImages.front"
                                        class="img-fluid rounded-3 border w-100 object-fit-cover shadow-sm"
                                        style="height: 200px;" alt="GPLX Front">
                                </div>
                                <div class="col-md-6">
                                    <p class="fw-bold mb-2">Ảnh mặt sau GPLX</p>
                                    <img :src="gplxImages.back"
                                        class="img-fluid rounded-3 border w-100 object-fit-cover shadow-sm"
                                        style="height: 200px;" alt="GPLX Back">
                                </div>
                            </div>

                            <div v-if="gplxProfile.isVerified" class="mt-3">
                                <p class="text-success small mb-0 fw-bold"><i class="fas fa-check-circle"></i> Xác thực
                                    thành công bởi hệ
                                    thống.</p>
                            </div>
                            <div v-else-if="gplxProfile.isPending" class="mt-3">
                                <p class="text-warning small mb-0 fw-bold"><i class="fas fa-spinner fa-spin me-1"></i>
                                    Hồ sơ đang chờ Admin
                                    xét duyệt.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Reviews Section -->
                    <div class="bg-white rounded-4 shadow-sm p-4 p-md-5 mb-4">
                        <div class="d-flex align-items-center gap-2 fw-bold mb-4 fs-5">
                            <i class="fas fa-star text-warning"></i>
                            <span>{{ avgRating > 0 ? Number(avgRating).toFixed(1) : '5.0' }}</span>
                            <i class="fas fa-circle text-muted" style="font-size: 4px;"></i>
                            <span>{{ totalReviews || 0 }} Đánh giá</span>
                        </div>
                        
                        <div v-if="reviewsReceived && reviewsReceived.length > 0" class="d-flex flex-column gap-3">
                            <div v-for="(review, idx) in reviewsReceived" :key="idx" class="card border rounded-3 shadow-sm">
                                <div class="card-body p-4">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <div class="d-flex align-items-center gap-3">
                                            <img :src="review.reviewer?.avatar || '/img/team-1.jpg'" class="rounded-circle object-fit-cover shadow-sm border" style="width: 55px; height: 55px;">
                                            <div>
                                                <div class="fw-bold text-dark fs-6 text-uppercase">{{ review.reviewer?.name || 'Người dùng' }}</div>
                                                <div class="text-warning small mt-1">
                                                    <i v-for="n in 5" :key="n" class="fa-star" :class="n <= review.rating ? 'fas' : 'far text-muted'"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="text-muted small">{{ new Date(review.created_at).toLocaleDateString('vi-VN') }}</div>
                                    </div>
                                    <p v-if="review.comment" class="small mb-0 text-dark mt-3">
                                        {{ review.comment }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-4">
                            <p class="text-muted mb-0">Chưa có đánh giá nào.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & QUẢN LÝ TÀI KHOẢN (IMPORTS & PINIA STORES)
// ============================================================================
import { useAuthStore } from '@/stores/auth.store'
import { ref, onMounted, computed } from 'vue'
import ProfileSidebar from '@/components/web/ProfileSidebar.vue'
import ProfileContactEdit from '@/components/common/ProfileContactEdit.vue'
import ProfileService from '@/services/profile.service'

const authStore = useAuthStore();

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI HỒ SƠ, VÍ VÀ CHỨNG CHỈ (PROFILE STATE)
// ============================================================================
const completedTrips = ref(0);
const walletBalance = ref(0);
const formatCurrency = (val) => val ? Number(val).toLocaleString('vi-VN') + 'đ' : '0đ';

// Cụm biến trạng thái Giao diện thông tin cơ bản & Avatar
const isEditingName = ref(false);
const avatarPreview = ref('/img/team-1.jpg');
const joinDate = ref('');

const editableProfile = ref({
    name: 'Đang tải...',
    phone: '',
    email: ''
});

// Cụm biến quản lý Danh tiếng & Uy tín từ Khách/Chủ xe khác đánh giá
const reviewsReceived = ref([]);
const avgRating = ref(0);
const totalReviews = ref(0);

// Cụm biến hồ sơ định danh Căn Cước Công Dân (CCCD - KYC)
const userProfile = ref({
    isVerified: false, isPending: false, fullName: 'Đang tải...',
    idNumber: 'Chưa cập nhật', dob: '--/--/----', gender: 'Chưa cập nhật', address: 'Chưa cập nhật', doe: 'Không thời hạn'
});
const userImages = ref({ cccdFront: '/img/attachment-img.jpg', cccdBack: '/img/attachment-img.jpg' });

// Cụm biến hồ sơ định danh Giấy Phép Lái Xe (GPLX)
const gplxProfile = ref({
    isVerified: false, isPending: false, fullName: 'Chưa cập nhật',
    idNumber: 'Chưa cập nhật', dob: '--/--/----', gplxClass: 'Chưa cập nhật', doe: 'Không thời hạn'
});
const gplxImages = ref({ front: '/img/attachment-img.jpg', back: '/img/attachment-img.jpg' });

// ============================================================================
// 3. CÁC PHƯƠNG THỨC TRUY TRUYỀN VÀ CẬP NHẬT TRẠNG THÁI (PROFILE METHODS)
// ============================================================================

/**
 * Xử lý tải lên và thay đổi ảnh đại diện Avatar mới cho User (hỗ trợ lưu File qua FormData)
 */
const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
        const oldPreview = avatarPreview.value;
        avatarPreview.value = URL.createObjectURL(file);
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            const res = await ProfileService.updateAvatar(formData);
            if (res.data?.data) {
                authStore.updateUser(res.data.data);
            } else if (res.data?.avatar && authStore.user) {
                authStore.updateUser({ ...authStore.user, avatar: res.data.avatar });
            }
            alert('Cập nhật ảnh đại diện thành công!');
        } catch (error) {
            console.error('Lỗi upload avatar:', error);
            avatarPreview.value = oldPreview; // Phục hồi ảnh cũ nếu Server báo lỗi
            const serverErr = error.response?.data?.errors?.avatar?.[0] || error.response?.data?.message;
            alert(serverErr || 'Tải lên ảnh thất bại! Vui lòng kiểm tra định dạng và dung lượng ảnh.');
        }
    }
};

/**
 * Chốt lưu thông tin thay đổi Họ tên hiển thị trên trang cá nhân
 */
const saveName = async () => {
    isEditingName.value = false;
    await updateProfileToServer({ name: editableProfile.value.name });
};

// Hứng sự kiện từ ProfileContactEdit.vue để tiến hành đồng bộ số Điện thoại / Email
const handleUpdatePhone = async (newPhone) => {
    await updateProfileToServer({ phone: newPhone });
    editableProfile.value.phone = newPhone;
};

const handleUpdateEmail = async (newEmail) => {
    await updateProfileToServer({ email: newEmail });
    editableProfile.value.email = newEmail;
};

/**
 * Hàm chung gửi gói dữ liệu (payload) lên Backend thông qua ProfileService
 */
const updateProfileToServer = async (dataPayload) => {
    try {
        const res = await ProfileService.updateProfile(dataPayload);
        if (res.data.success) {
            // Đồng bộ hoá hoàn tất
        }
    } catch (error) {
        console.error("Lỗi cập nhật Profile:", error);
        alert('Cập nhật thất bại. Vui lòng kiểm tra lại!');
        // Phục hồi lại dữ liệu cũ từ Store nếu có biến cố xảy ra
        if (authStore.user) {
            editableProfile.value.phone = authStore.user.phone || '';
            editableProfile.value.email = authStore.user.email || '';
        }
    }
};

// ============================================================================
// 4. TRÌNH NẠP DỮ LIỆU CƠ BẢN VÀ THẨM CHỨNG GIẤY TỜ (DATA & DOCS HYDRATION)
// ============================================================================

/**
 * Nạp dữ liệu cơ bản (Tên, Email, Avatar, số chuyến, số dư ví) từ API trả về
 */
const loadBasicInfo = (userData) => {
    editableProfile.value.name = userData.name || 'Khách hàng';
    editableProfile.value.phone = userData.phone || '';
    editableProfile.value.email = userData.email || '';

    if (userData.created_at) {
        const date = new Date(userData.created_at);
        joinDate.value = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    }

    if (userData.avatar) avatarPreview.value = userData.avatar;
    if (userData.wallet) walletBalance.value = userData.wallet.available_balance || 0;
    completedTrips.value = userData.completed_trips_count || 0;
    
    reviewsReceived.value = userData.reviews_received || [];
    avgRating.value = userData.avg_rating || 0;
    totalReviews.value = userData.total_reviews || 0;
};

/**
 * Phân tích dữ liệu Giấy tờ pháp lý (OCR Extracted Data của CCCD & GPLX)
 */
const loadDocumentsInfo = (userData) => {
    let documents = [];
    if (userData.legal_documents && Array.isArray(userData.legal_documents)) {
        documents = userData.legal_documents;
    } else {
        if (userData.legal_document) documents.push(userData.legal_document);
        if (userData.gplx_document) documents.push(userData.gplx_document);
    }

    documents.forEach(doc => {
        let ocr = typeof doc.ocr_extracted_data === 'string' ? JSON.parse(doc.ocr_extracted_data) : (doc.ocr_extracted_data || {});

        if (doc.document_type === 'id_card' || doc.document_type === 'cccd') {
            userProfile.value.isVerified = doc.status === 'approved';
            userProfile.value.isPending = doc.status === 'pending';
            userProfile.value.fullName = ocr.name || 'Chưa nhận diện được';
            userProfile.value.idNumber = doc.document_number || 'Chưa cập nhật';
            userProfile.value.dob = ocr.dob || 'Chưa cập nhật';
            userProfile.value.gender = ocr.sex || 'Chưa cập nhật';
            userProfile.value.address = ocr.address || ocr.home || 'Chưa cập nhật';
            userProfile.value.doe = ocr.doe || 'Không thời hạn';

            if (doc.front_image_url) userImages.value.cccdFront = doc.front_image_url;
            if (doc.back_image_url) userImages.value.cccdBack = doc.back_image_url;
        }
        else if (doc.document_type === 'driver_license' || doc.document_type === 'driving_license') {
            gplxProfile.value.isVerified = doc.status === 'approved';
            gplxProfile.value.isPending = doc.status === 'pending';
            gplxProfile.value.fullName = ocr.name || 'Chưa nhận diện được';
            gplxProfile.value.idNumber = doc.document_number || 'Chưa cập nhật';
            gplxProfile.value.dob = ocr.dob || '--/--/----';
            gplxProfile.value.gplxClass = ocr.class || 'Chưa cập nhật';
            gplxProfile.value.doe = ocr.doe || 'Không thời hạn';

            if (doc.front_image_url) gplxImages.value.front = doc.front_image_url;
            if (doc.back_image_url) gplxImages.value.back = doc.back_image_url;
        }
    });
};

// ============================================================================
// 5. NGHIỆP VỤ NÂNG CẤP TÀI KHOẢN TRỞ THÀNH CHỦ XE (ROLE UPGRADE LOGIC)
// ============================================================================

/**
 * Kiểm tra xem tài khoản hiện tại đã sở hữu đặc quyền 'owner' hay 'partner' hay chưa
 */
const isOwner = computed(() => {
    return authStore.user?.roles?.some(r => r.slug === 'owner' || r.slug === 'partner');
});

const isUpgrading = ref(false);

/**
 * Gửi yêu cầu Nâng cấp đặc quyền tài khoản lên mức Chủ xe (Owner/Partner)
 */
const handleUpgradeToOwner = async () => {
    if (!confirm('Bạn có muốn đăng ký trở thành Chủ xe để cho thuê phương tiện của mình không?')) return;

    isUpgrading.value = true;
    try {
        const res = await ProfileService.upgradeToOwner();
        if (res.data.success) {
            alert(res.data.message);
            // Cập nhật lại Auth Store để hệ thống nhận thức người dùng đã có thêm quyền mới
            authStore.updateUser(res.data.data);
        }
    } catch (error) {
        console.error("Lỗi nâng cấp:", error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
        isUpgrading.value = false;
    }
};

// ============================================================================
// 6. MÓC TRÌNH DẪN VÒNG ĐỜI VUE (LIFECYCLE HOOK)
// ============================================================================
onMounted(async () => {
    try {
        const res = await ProfileService.getMe();
        const userData = res.data.data;

        loadBasicInfo(userData);
        loadDocumentsInfo(userData);
        authStore.updateUser(userData);

    } catch (error) {
        console.error("Lỗi đồng bộ dữ liệu Profile:", error);
    }
});
</script>
