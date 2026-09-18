<template>
    <main id="content" class="content bg-light vh-100 d-flex flex-column overflow-hidden">

        <div style="height: 70px; flex-shrink: 0;"></div>

        <div class="container-fluid pt-4 px-lg-4 grow overflow-auto pb-5">

            <div class="row mb-4 shrink-0">
                <div class="col-12">
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h1 class="fs-3 mb-2 fw-bold text-dark">Thêm cổng thanh toán mới</h1>
                            <p class="mb-0 text-muted fs-6">Tích hợp thêm phương thức thanh toán (Ví điện tử, Ngân hàng,
                                Thẻ quốc tế) vào hệ thống</p>
                        </div>
                        <div>
                            <button
                                class="btn btn-white border bg-white fw-bold text-dark shadow-sm px-4 py-3 rounded-3 fs-6">
                                <i class="fas fa-arrow-left me-2"></i>Quay lại cấu hình
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row grow align-items-start">
                <div class="col-12 d-flex flex-column">
                    <div class="card border-0 shadow-sm rounded-4 grow">
                        <div class="card-body p-4 p-xl-5 d-flex flex-column">

                            <form id="addGatewayForm" @submit.prevent="handleAddGateway"
                                class="grow d-flex flex-column">

                                <div class="d-flex align-items-center gap-3 mb-4">
                                    <div class="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center fw-bold fs-5"
                                        style="width: 48px; height: 48px;">1</div>
                                    <h4 class="fw-bold text-dark mb-0">Thông tin định danh</h4>
                                </div>

                                <div class="row g-4 mb-5 pb-4 border-bottom">
                                    <div class="col-md-4">
                                        <label for="gatewayName" class="form-label fw-semibold text-dark mb-2">Tên hiển
                                            thị (App Khách) <span class="text-danger">*</span></label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            id="gatewayName" v-model="newGateway.name"
                                            placeholder="VD: ZaloPay, Thẻ Visa/Mastercard" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="gatewayType" class="form-label fw-semibold text-dark mb-2">Loại
                                            phương thức <span class="text-danger">*</span></label>
                                        <select class="form-select form-select-lg bg-light border-0 fs-6 py-3"
                                            id="gatewayType" v-model="newGateway.type" required>
                                            <option value="" selected disabled>-- Chọn phân loại --</option>
                                            <option value="e_wallet">Ví điện tử (E-Wallet)</option>
                                            <option value="credit_card">Thẻ tín dụng quốc tế (Credit Card)</option>
                                            <option value="bank_transfer">Chuyển khoản nội địa (Bank Transfer)</option>
                                            <option value="crypto">Tiền điện tử (Crypto)</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="gatewayLogo" class="form-label fw-semibold text-dark mb-2">Icon /
                                            Logo <span class="text-danger">*</span></label>
                                        <input type="file"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            id="gatewayLogo" accept="image/png, image/jpeg, image/svg+xml" required>
                                    </div>
                                </div>

                                <div class="d-flex align-items-center gap-3 mb-4">
                                    <div class="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center fw-bold fs-5"
                                        style="width: 48px; height: 48px;">2</div>
                                    <h4 class="fw-bold text-dark mb-0">Cấu hình API kết nối</h4>
                                </div>

                                <div class="row g-4 mb-4">
                                    <div class="col-md-8">
                                        <label for="endpointUrl" class="form-label fw-semibold text-dark mb-2">Payment
                                            Endpoint URL <span class="text-danger">*</span></label>
                                        <input type="url"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            id="endpointUrl" v-model="newGateway.endpoint"
                                            placeholder="https://api.payment-provider.com/v1/pay" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="gatewayEnv" class="form-label fw-semibold text-dark mb-2">Môi trường
                                            ban đầu</label>
                                        <select class="form-select form-select-lg bg-light border-0 fs-6 py-3"
                                            id="gatewayEnv" v-model="newGateway.env">
                                            <option value="sandbox">Sandbox (Thử nghiệm)</option>
                                            <option value="production">Production (Thực tế)</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="row g-4 mb-5">
                                    <div class="col-md-6">
                                        <label for="clientId" class="form-label fw-semibold text-dark mb-2">Client ID /
                                            App ID / Partner Code</label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            id="clientId" v-model="newGateway.clientId"
                                            placeholder="Nhập ID do đối tác cung cấp">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="secretKey" class="form-label fw-semibold text-dark mb-2">Secret Key
                                            / Private Key / Hash</label>
                                        <input type="password"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            id="secretKey" v-model="newGateway.secretKey"
                                            placeholder="Nhập chuỗi khóa bí mật">
                                    </div>
                                </div>

                                <div
                                    class="d-flex flex-column flex-md-row justify-content-between align-items-md-center pt-4 border-top mt-auto gap-4">

                                    <div class="d-flex align-items-center bg-light px-4 py-3 rounded-4">
                                        <div class="form-check form-switch fs-2 mb-0 me-3">
                                            <input class="form-check-input cursor-pointer" type="checkbox" role="switch"
                                                id="initialStatus" v-model="newGateway.isActive">
                                        </div>
                                        <div>
                                            <label
                                                class="form-check-label fw-bold text-dark mb-0 d-block cursor-pointer fs-6"
                                                for="initialStatus">
                                                Trạng thái ngay khi tạo
                                            </label>
                                            <span class="small text-muted" v-if="newGateway.isActive">Cổng sẽ <strong
                                                    class="text-success">hoạt động</strong> ngay</span>
                                            <span class="small text-muted" v-else>Tạo xong nhưng <strong
                                                    class="text-danger">chưa kích hoạt</strong></span>
                                        </div>
                                    </div>

                                    <div class="d-flex gap-3">
                                        <button type="reset"
                                            class="btn btn-white border bg-white px-5 py-3 fw-bold rounded-3 text-dark fs-6"
                                            @click="resetForm">
                                            Làm mới
                                        </button>
                                        <button type="submit" class="btn btn-primary px-5 py-3 fw-bold rounded-3 fs-6">
                                            <i class="fas fa-plus-circle me-2"></i>Tạo cổng thanh toán
                                        </button>
                                    </div>
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
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH TRỌN ĐẦU NỐI (IMPORTS)
// ============================================================================
import { ref } from 'vue';

// ============================================================================
// 2. KHỞI TẠO BIỂU MẪU CẤU HÌNH CỔNG THANH TOÁN MỚI (NEW GATEWAY STATE)
// ============================================================================
// Thực thể chứa thông số tích hợp (API Endpoint, Khóa Bảo Mật & Môi trường Test/Prod)
const newGateway = ref({
    name: '',          // Tên cổng thanh toán mới (Ví dụ: ZaloPay, Paypal, Stripe...)
    type: '',          // Loại cổng (Ví điện tử hay Cổng thanh toán quốc tế)
    endpoint: '',      // Đường dẫn API giao dịch (Webhook / Redirection URL)
    env: 'sandbox',    // Môi trường thử nghiệm (Sandbox) hay Chính thức (Production)
    clientId: '',      // Mã định danh đối tác (Partner / Client ID)
    secretKey: '',     // Khóa mã hóa bảo mật chữ ký giao dịch
    isActive: false    // Cờ trạng thái kích hoạt vận hành ngay sau khi tạo
});

// ============================================================================
// 3. NGHIỆP VỤ THIẾT HỌA & ĐĂNG KÝ CỔNG THANH TOÁN MỚI (ACTIONS)
// ============================================================================
/**
 * Trả lại các ô thông số trong biểu mẫu về cấu hình rỗng ban đầu
 */
const resetForm = () => {
    newGateway.value = {
        name: '',
        type: '',
        endpoint: '',
        env: 'sandbox',
        clientId: '',
        secretKey: '',
        isActive: false
    };
};

/**
 * Xử lý kiểm tra và tạo mới Cổng thanh toán trong kho Cấu hình tài chính
 */
const handleAddGateway = () => {
    if (confirm('Xác nhận tạo cổng thanh toán mới?')) {
        console.log("Dữ liệu chuẩn bị gửi API:", newGateway.value);
        alert('Tạo cổng thanh toán thành công! Vui lòng quay lại danh sách để kiểm tra kết nối.');
    }
};
</script>
