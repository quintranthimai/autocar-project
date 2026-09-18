<template>
    <main id="content" class="content bg-light vh-100 d-flex flex-column overflow-hidden">

        <div style="height: 70px; flex-shrink: 0;"></div>

        <div class="container-fluid pt-4 px-lg-4 grow overflow-auto pb-5">

            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h1 class="fs-3 mb-2 fw-bold text-dark">Cổng thanh toán</h1>
                            <p class="mb-0 text-muted fs-6">Bật/tắt và thiết lập API Key cho các phương thức thanh toán
                            </p>
                        </div>
                        <div>
                            <router-link to="/admin/add-payment-gateway"
                                class="btn btn-primary fw-bold px-4 py-3 rounded-3 shadow-sm fs-6">
                                <i class="fas fa-plus me-2"></i>Thêm cổng mới
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                <div class="col-12">

                    <div class="card border-0 shadow-sm rounded-4 mb-4">
                        <div class="card-body p-4 p-xl-5">

                            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-4">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center"
                                        style="width: 56px; height: 56px;">
                                        <i class="fas fa-credit-card fs-3"></i>
                                    </div>
                                    <div>
                                        <h4 class="fw-bold text-dark mb-2">Cổng thanh toán VNPay</h4>
                                        <span
                                            class="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1">Đang
                                            hoạt động</span>
                                    </div>
                                </div>
                                <div class="form-check form-switch fs-2 mb-0">
                                    <input class="form-check-input cursor-pointer" type="checkbox" role="switch"
                                        v-model="vnpay.isActive" id="vnpaySwitch">
                                </div>
                            </div>

                            <form @submit.prevent="handleSave('VNPay')">
                                <div class="row g-4 mb-4">
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">vnp_TmnCode (Terminal ID)
                                            <span class="text-danger">*</span></label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="vnpay.tmnCode" :disabled="!vnpay.isActive"
                                            placeholder="Nhập TmnCode do VNPay cấp" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-dark mb-2">vnp_HashSecret (Chuỗi bí
                                            mật) <span class="text-danger">*</span></label>
                                        <input type="password"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="vnpay.hashSecret" :disabled="!vnpay.isActive"
                                            placeholder="••••••••••••••••" required>
                                    </div>
                                </div>

                                <div class="row g-4 mb-5">
                                    <div class="col-md-8">
                                        <label class="form-label fw-semibold text-dark mb-2">Payment Endpoint
                                            URL</label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="vnpay.url" :disabled="!vnpay.isActive"
                                            placeholder="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-semibold text-dark mb-2">Môi trường</label>
                                        <select class="form-select form-select-lg bg-light border-0 fs-6 py-3"
                                            v-model="vnpay.env" :disabled="!vnpay.isActive">
                                            <option value="sandbox">Sandbox (Thử nghiệm)</option>
                                            <option value="production">Production (Thực tế)</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-end pt-3 border-top mt-4">
                                    <button type="submit" class="btn btn-dark px-5 py-3 fw-bold rounded-3 fs-6"
                                        :disabled="!vnpay.isActive">
                                        <i class="fas fa-save me-2"></i>Lưu cấu hình
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4 mb-4" :class="{ 'opacity-75': !momo.isActive }">
                        <div class="card-body p-4 p-xl-5">

                            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-4">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="bg-danger bg-opacity-10 text-danger rounded-3 d-flex align-items-center justify-content-center"
                                        style="width: 56px; height: 56px;">
                                        <i class="fas fa-wallet fs-3"></i>
                                    </div>
                                    <div>
                                        <h4 class="fw-bold text-dark mb-2">Ví điện tử MoMo</h4>
                                        <span v-if="momo.isActive"
                                            class="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1">Đang
                                            hoạt động</span>
                                        <span v-else
                                            class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary px-2 py-1">Đã
                                            tắt</span>
                                    </div>
                                </div>
                                <div class="form-check form-switch fs-2 mb-0">
                                    <input class="form-check-input cursor-pointer" type="checkbox" role="switch"
                                        v-model="momo.isActive" id="momoSwitch">
                                </div>
                            </div>

                            <form @submit.prevent="handleSave('MoMo')">
                                <div class="row g-4 mb-5">
                                    <div class="col-md-4">
                                        <label class="form-label fw-semibold text-dark mb-2">Partner Code</label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="momo.partnerCode" :disabled="!momo.isActive" placeholder="MOMO...">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-semibold text-dark mb-2">Access Key</label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="momo.accessKey" :disabled="!momo.isActive"
                                            placeholder="Nhập Access Key">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-semibold text-dark mb-2">Secret Key</label>
                                        <input type="password"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="momo.secretKey" :disabled="!momo.isActive"
                                            placeholder="••••••••••••••••">
                                    </div>
                                </div>

                                <div class="d-flex justify-content-end pt-3 border-top mt-4">
                                    <button type="submit" class="btn btn-dark px-5 py-3 fw-bold rounded-3 fs-6"
                                        :disabled="!momo.isActive">
                                        <i class="fas fa-save me-2"></i>Lưu cấu hình
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4 mb-4">
                        <div class="card-body p-4 p-xl-5">

                            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-4">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center"
                                        style="width: 56px; height: 56px;">
                                        <i class="fas fa-university fs-3"></i>
                                    </div>
                                    <div>
                                        <h4 class="fw-bold text-dark mb-2">Chuyển khoản thủ công (Bank Transfer)</h4>
                                        <span
                                            class="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1">Đang
                                            hoạt động</span>
                                    </div>
                                </div>
                                <div class="form-check form-switch fs-2 mb-0">
                                    <input class="form-check-input cursor-pointer" type="checkbox" role="switch"
                                        v-model="bank.isActive" id="bankSwitch">
                                </div>
                            </div>

                            <form @submit.prevent="handleSave('Bank Transfer')">
                                <div class="row g-4 mb-5">
                                    <div class="col-md-4">
                                        <label class="form-label fw-semibold text-dark mb-2">Tên Ngân hàng</label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="bank.bankName" :disabled="!bank.isActive"
                                            placeholder="VD: Vietcombank">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-semibold text-dark mb-2">Số tài khoản</label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3"
                                            v-model="bank.accNumber" :disabled="!bank.isActive"
                                            placeholder="0123456789">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-semibold text-dark mb-2">Tên chủ tài khoản</label>
                                        <input type="text"
                                            class="form-control form-control-lg bg-light border-0 fs-6 py-3 text-uppercase"
                                            v-model="bank.accName" :disabled="!bank.isActive"
                                            placeholder="CTY TNHH AUTOCAR">
                                    </div>
                                </div>

                                <div class="d-flex justify-content-end pt-3 border-top mt-4">
                                    <button type="submit" class="btn btn-dark px-5 py-3 fw-bold rounded-3 fs-6"
                                        :disabled="!bank.isActive">
                                        <i class="fas fa-save me-2"></i>Lưu cấu hình
                                    </button>
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
import { ref } from 'vue'

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI CẤU HÌNH ĐẦU TRỤ THÍCH ỨNG THANH TOÁN (STATE)
// ============================================================================
// Cấu hình cổng thanh toán VNPAY (Thanh toán qua Thẻ ATM, QRCode, Tài khoản Ngân hàng)
const vnpay = ref({
    isActive: true,
    tmnCode: 'GZ8X92JA',
    hashSecret: 'secret_key_hidden',
    url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    env: 'sandbox'
})

// Cấu hình ví thanh toán điện tử MoMo
const momo = ref({
    isActive: false,
    partnerCode: '',
    accessKey: '',
    secretKey: ''
})

// Cấu hình thông tin thụ hưởng Ngân hàng (Dành cho Chuyển khoản trực tiếp)
const bank = ref({
    isActive: true,
    bankName: 'Vietcombank - CN Tân Bình',
    accNumber: '0881000456789',
    accName: 'CTY TNHH DICH VU AUTOCAR'
})

// ============================================================================
// 3. TRÌNH GHI NHÂN XỬ LÝ LƯU CẤU HÌNH (GATEWAY CONFIG ACTIONS)
// ============================================================================
/**
 * Lưu các thông số bảo mật và khóa tích hợp mới nhất của Cổng thanh toán vào Hệ thống
 */
const handleSave = (gatewayName) => {
    alert(`Đã cập nhật và lưu cấu hình thành công cho cổng: ${gatewayName}`);
}
</script>
