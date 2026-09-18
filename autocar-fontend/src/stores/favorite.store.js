// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CÁC DEPENDENCIE (IMPORTS)
// ============================================================================
import { defineStore } from 'pinia'
import favoriteService from '@/services/favorite.service'
import { useAuthStore } from './auth.store'

// ============================================================================
// 2. KHO QUẢN LÝ DANH SÁCH PHƯƠNG TIỆN YÊU THÍCH (FAVORITE STORE)
// ============================================================================
export const useFavoriteStore = defineStore('favorite', {
  // --------------------------------------------------------------------------
  // 2.1. TRẠNG THÁI LƯU TRỮ TRUNG TÂM (STATE)
  // --------------------------------------------------------------------------
  state: () => ({
    favoriteIds: [], // Danh sách mã số xe đã được người dùng chọn Yêu thích (Tim)
    loading: false,  // Cờ báo tình trạng đang giao tiếp tải danh sách từ máy chủ
    loaded: false    // Cờ đánh dấu đã tải trọn vẹn trong phiên hiện tại (tránh lặp gọi API)
  }),

  // --------------------------------------------------------------------------
  // 2.2. TRÌNH KIỂM TRA TRẠNG THÁI YÊU THÍCH (GETTERS)
  // --------------------------------------------------------------------------
  getters: {
    // Kiểm tra nhanh xe theo ID có nằm trong danh sách đã tim hay không
    isFavorited: (state) => (id) => state.favoriteIds.includes(Number(id)),
    
    // Đếm tổng lượng xe đã lưu
    totalFavorites: (state) => state.favoriteIds.length,
  },

  // --------------------------------------------------------------------------
  // 2.3. BỘ PHƯƠNG THỨC TƯƠNG TÁC THÊM / XÓA TIM XE (ACTIONS)
  // --------------------------------------------------------------------------
  actions: {
    /**
     * Tải danh sách ID các xe yêu thích từ máy chủ dành cho người dùng đã xác thực
     */
    async fetchFavoriteIds() {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        this.favoriteIds = []
        this.loaded = false
        return
      }

      // Tránh lặp lại gọi API nếu đã load trong session và không cần ép mới
      if (this.loaded && !this.loading) return

      try {
        this.loading = true
        const res = await favoriteService.getFavoriteIds()
        this.favoriteIds = (res.data?.data || []).map((id) => Number(id))
        this.loaded = true
      } catch (error) {
        console.error('Lỗi khi tải danh sách ID xe yêu thích:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Buộc làm mới danh sách ID yêu thích ngay lập tức bỏ qua cờ loaded
     */
    async forceRefreshIds() {
      this.loaded = false
      await this.fetchFavoriteIds()
    },

    /**
     * Xử lý thêm/hủy xe yêu thích kèm chiến lược Optimistic Update (Cập nhật giao diện lập tức trước khi server trả kết quả)
     */
    async toggleFavorite(vehicleId) {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        // Có thể yêu cầu người dùng đăng nhập
        alert('Vui lòng đăng nhập để lưu xe yêu thích!')
        return false
      }

      const numId = Number(vehicleId)
      // Optimistic update (chuyển trạng thái ngay lập tức trên UI cho mượt)
      const index = this.favoriteIds.indexOf(numId)
      const wasFavorited = index !== -1

      if (wasFavorited) {
        this.favoriteIds.splice(index, 1)
      } else {
        this.favoriteIds.push(numId)
      }

      try {
        const res = await favoriteService.toggleFavorite(numId)
        // Đồng bộ chuẩn theo phản hồi từ Server
        if (res.data?.is_favorited && !this.favoriteIds.includes(numId)) {
          this.favoriteIds.push(numId)
        } else if (!res.data?.is_favorited && this.favoriteIds.includes(numId)) {
          const newIdx = this.favoriteIds.indexOf(numId)
          if (newIdx !== -1) this.favoriteIds.splice(newIdx, 1)
        }
        return res.data?.is_favorited
      } catch (error) {
        // Phục hồi trạng thái cũ nếu API thất bại
        if (wasFavorited) {
          if (!this.favoriteIds.includes(numId)) this.favoriteIds.push(numId)
        } else {
          const revIdx = this.favoriteIds.indexOf(numId)
          if (revIdx !== -1) this.favoriteIds.splice(revIdx, 1)
        }
        console.error('Lỗi khi thao tác yêu thích:', error)
        alert('Có lỗi xảy ra khi cập nhật danh sách yêu thích.')
        return wasFavorited
      }
    },
  },
})
