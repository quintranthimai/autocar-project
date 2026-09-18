// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH KHÓA LƯU TRỮ TRÌNH DUYỆT
// ============================================================================
import { defineStore } from 'pinia'

// Khóa chuyên môn để ghi nhớ thời gian lựa chọn đặt xe trên LocalStorage
const STORAGE_KEY = 'autocar:rental-time'

// ============================================================================
// 2. BỘ HỢP TRẠNG HẠI TOÁN TÍNH TOÁN HỖ TRỢ THỜI GIAN (UTILITY FUNCTIONS)
// ============================================================================
/**
 * Suy luận chế độ thuê theo giờ ('hour') hay theo ngày ('day') dựa vào quãng chênh lệch thời gian
 */
function inferMode(start, end) {
  const s = new Date(start)
  const e = new Date(end)
  const diffHours = (e - s) / (1000 * 60 * 60)
  if (diffHours <= 12 && s.toDateString() === e.toDateString()) return 'hour'
  return 'day'
}

/**
 * Tạo chuỗi tóm tắt hiển thị thời gian thuê sang định dạng Việt Nam trực quan
 */
function formatDisplay(start, end) {
  if (!start || !end) return 'Chon thoi gian thue'

  const s = new Date(start)
  const e = new Date(end)
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  const sh = String(s.getHours()).padStart(2, '0')
  const sm = String(s.getMinutes()).padStart(2, '0')
  const sd = String(s.getDate()).padStart(2, '0')
  const sMon = String(s.getMonth() + 1).padStart(2, '0')

  const eh = String(e.getHours()).padStart(2, '0')
  const em = String(e.getMinutes()).padStart(2, '0')
  const ed = String(e.getDate()).padStart(2, '0')
  const eMon = String(e.getMonth() + 1).padStart(2, '0')

  return `${sh}:${sm} ${days[s.getDay()]}, ${sd}/${sMon} - ${eh}:${em} ${days[e.getDay()]}, ${ed}/${eMon}`
}

/**
 * Khôi phục trạng thái thời gian thuê xe ban đầu từ LocalStorage (Có kiểm tra bảo vệ thời gian quá khứ)
 */
function loadInitialState() {
  const defaultState = {
    startDatetime: '',
    endDatetime: '',
    mode: 'day',
    displayString: 'Chọn thời gian thuê',
  }

  if (typeof window === 'undefined') {
    return defaultState
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaultState
    }

    const parsed = JSON.parse(raw)
    
    // Nếu thời gian bắt đầu đã qua, reset về mặc định
    if (parsed.startDatetime && new Date(parsed.startDatetime).getTime() < new Date().getTime()) {
        return defaultState
    }

    return {
      startDatetime: parsed.startDatetime || '',
      endDatetime: parsed.endDatetime || '',
      mode: parsed.mode || 'day',
      displayString: parsed.displayString || 'Chọn thời gian thuê',
    }
  } catch {
    return defaultState
  }
}

// ============================================================================
// 3. KHO ĐIỀU PHỐI ĐỒNG HỒ ĐẶT THUÊ PHƯƠNG TIỆN (RENTAL TIME STORE)
// ============================================================================
export const useRentalTimeStore = defineStore('rentalTime', {
  // --------------------------------------------------------------------------
  // 3.1. TRẠNG THÁI KHỞI TẠO BỘ NHỚ TRÌNH DUYỆT (STATE)
  // --------------------------------------------------------------------------
  state: () => loadInitialState(),

  // --------------------------------------------------------------------------
  // 3.2. BỘ NGHIỆP VỤ THAO TÁC & LƯU VẾT THỜI GIAN (ACTIONS)
  // --------------------------------------------------------------------------
  actions: {
    /**
     * Đồng bộ dữ liệu mốc thời gian xuống ổ đĩa trình duyệt
     */
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          startDatetime: this.startDatetime,
          endDatetime: this.endDatetime,
          mode: this.mode,
          displayString: this.displayString,
        }),
      )
    },

    /**
     * Lấy mốc thời gian thuê do người dùng ấn định và lưu cache
     */
    setSelection({ start_datetime, end_datetime, displayString, mode }) {
      // Nếu cố tình set thời gian trong quá khứ thì chặn lại
      if (start_datetime && new Date(start_datetime).getTime() < new Date().getTime()) {
          this.clearSelection()
          return
      }

      this.startDatetime = start_datetime || ''
      this.endDatetime = end_datetime || ''
      this.mode = mode || inferMode(start_datetime, end_datetime)
      this.displayString = displayString || formatDisplay(this.startDatetime, this.endDatetime)
      this.persist()
    },

    /**
     * Xóa sạch thiết lập thời gian, trả về trạng thái nguyên bản
     */
    clearSelection() {
      this.startDatetime = ''
      this.endDatetime = ''
      this.mode = 'day'
      this.displayString = 'Chọn thời gian thuê'
      this.persist()
    },

    /**
     * Tự động khởi tạo khoảng thuê mặc định 1 ngày (từ 08:00 đến 20:00 hôm sau) nếu khách chưa chọn
     */
    ensureDefaultSelection() {
      if (this.startDatetime && this.endDatetime) return

      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0, 0)
      const end = new Date(start)
      end.setDate(end.getDate() + 1)
      end.setHours(20, 0, 0, 0)

      this.setSelection({
        start_datetime: start.toISOString().slice(0, 16),
        end_datetime: end.toISOString().slice(0, 16),
        mode: 'day',
      })
    },
  },
})
