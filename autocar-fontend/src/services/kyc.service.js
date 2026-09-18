import axios from 'axios'

const API_URL = 'https://autocar-citx.onrender.com/api/v1/admin/kyc-approvals'

// ==========================================
// HÀM TIỆN ÍCH: TỰ ĐỘNG LẤY TOKEN GẮN VÀO HEADER
// ==========================================
const getAuthHeader = () => {
  // SỬA CHỮ 'token' THÀNH 'authToken' CHO ĐÚNG VỚI LOCAL STORAGE
  const token = localStorage.getItem('authToken')

  // Bạn có thể giữ dòng log này để kiểm tra, nếu nó in ra "33|AU6o..." là chuẩn!
  console.log('Token chuẩn bị gửi đi là:', token)

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  }
}

class KycService {
  // 1. Lấy danh sách hồ sơ (có đính kèm Header)
  getPendingList(status = 'pending') {
    return axios.get(API_URL, {
      params: { status: status },
      ...getAuthHeader(), // Gắn token vào đây
    })
  }

  // 2. Lấy chi tiết hồ sơ (có đính kèm Header)
  getKycDetail(id) {
    return axios.get(`${API_URL}/${id}`, getAuthHeader())
  }

  // 3. Phê duyệt / Từ chối (có đính kèm Header)
  processKyc(id, action, rejectReason = '') {
    const payload = { action: action }

    if (action === 'rejected') {
      payload.reject_reason = rejectReason
    }

    return axios.post(`${API_URL}/${id}/process`, payload, getAuthHeader())
  }

  //4. API Dành cho Khách hàng: Upload ảnh CCCD để OCR

  uploadIdCard(formData) {
    // Lấy token của khách hàng
    const token = localStorage.getItem('authToken')

    // Gọi đến đúng route /api/v1/web/kyc/upload-id-card của Laravel
    return axios.post('https://autocar-citx.onrender.com/api/v1/web/kyc/upload-id-card', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // 5. API Dành cho Khách hàng: Upload ảnh GPLX để OCR
  uploadDriverLicense(formData) {
    const token = localStorage.getItem('authToken')
    return axios.post('https://autocar-citx.onrender.com/api/v1/web/kyc/upload-driver-license', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // 6. Cập nhật hạng bằng lái xe (khi AI bị thiếu)
  updateDriverLicenseClass(licenceClass) {
    const token = localStorage.getItem('authToken')
    return axios.post('https://autocar-citx.onrender.com/api/v1/web/kyc/update-driver-license-class', { licence_class: licenceClass }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
}

export default new KycService()
