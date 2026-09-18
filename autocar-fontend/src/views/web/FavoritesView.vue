<template>
  <div class="profile-page bg-light py-5 min-vh-100">
    <div class="container">
      <div class="row g-4">
        <!-- Profile Sidebar -->
        <ProfileSidebar />

        <!-- Nội dung chính -->
        <div class="col-lg-9">
          <!-- Header -->
          <div class="bg-white p-4 rounded-4 shadow-sm border mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h2 class="fw-bold mb-1 d-flex align-items-center gap-2 text-dark">
                <i class="fas fa-heart text-danger"></i> Xe yêu thích của tôi
              </h2>
              <p class="text-muted small mb-0">
                Danh sách các xe bạn đã quan tâm và lưu lại cho hành trình tiếp theo
              </p>
            </div>
            <div>
              <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fs-6 fw-semibold">
                Đã lưu: {{ displayFavorites.length }} phương tiện
              </span>
            </div>
          </div>

          <!-- Skeleton Loading (Hiển thị khi đang tải) -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted fw-bold">Đang tải danh sách xe yêu thích...</p>
          </div>

          <!-- Trống danh sách yêu thích -->
          <div v-else-if="displayFavorites.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm border p-5">
            <div class="mb-4">
              <div class="bg-light d-inline-flex align-items-center justify-content-center rounded-circle" style="width: 100px; height: 100px;">
                <i class="far fa-heart text-secondary opacity-50 display-4"></i>
              </div>
            </div>
            <h4 class="fw-bold text-dark mb-2">Bạn chưa lưu chiếc xe nào</h4>
            <p class="text-muted small max-w-sm mx-auto mb-4" style="max-width: 450px;">
              Khám phá ngay hàng trăm xe chất lượng cao trên hệ thống AutoCar và nhấn vào biểu tượng trái tim để lưu lại mẫu xe bạn thích!
            </p>
            <router-link to="/vehicles" class="btn btn-primary fw-bold rounded-pill px-5 py-2 shadow-sm">
              <i class="fas fa-search me-2"></i> Khám phá xe ngay
            </router-link>
          </div>

          <!-- Danh sách xe yêu thích -->
          <div v-else class="row g-4">
            <div class="col-md-6 col-xl-4" v-for="car in displayFavorites" :key="car.id">
              <VehicleCard :car="car" />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH TRỤ KẾT ĐẤU (IMPORTS & STORES)
// ============================================================================
import { ref, computed, onMounted } from 'vue';
import ProfileSidebar from '@/components/web/ProfileSidebar.vue';
import VehicleCard from '@/components/common/VehicleCard.vue';
import favoriteService from '@/services/favorite.service';
import { useFavoriteStore } from '@/stores/favorite.store';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';

const favoriteStore = useFavoriteStore();
const authStore = useAuthStore();
const router = useRouter();

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI DANH SÁCH YÊU THÍCH (FAVORITE STATE MANAGEMENT)
// ============================================================================
const favorites = ref([]); // Mảng toàn bộ dữ liệu Xe được ghi nhận yêu thích
const loading = ref(true); // Cờ trạng thái Skeleton Loading lúc chờ máy chủ phản hồi

// ============================================================================
// 3. TRÌNH TỐI ƯU TRẠNG THÁI ĐỘNG HÓA SIÊU TRẦN (REACTIVE COMPUTED FILTER)
// ============================================================================
/**
 * Tự động sàng lọc theo tập ID từ FavoriteStore (khi khách hủy thả tim ngay lập tức biến mất mượt mà)
 */
const displayFavorites = computed(() => {
    return favorites.value.filter(car => favoriteStore.isFavorited(car.id));
});

// ============================================================================
// 4. PHƯƠNG THỨC TRUY TRUYỀN VÀ ĐỒNG BỘ TRÚ TỤ HIỆU NGHIỆP VỤ (LOAD FAVORITES API)
// ============================================================================
/**
 * Tải danh sách Xe yêu thích của người dùng và cập nhật sang Favorite Store
 */
const loadFavorites = async () => {
    // Nếu chưa đăng nhập -> Chuyển hướng lập tức sang Cổng Đăng nhập
    if (!authStore.isAuthenticated) {
        router.push('/login');
        return;
    }
    
    loading.value = true;
    try {
        const res = await favoriteService.getMyFavorites();
        favorites.value = res.data?.data || [];
        
        // Đồng bộ hóa danh sách ID vào Global Pinia Store
        const ids = favorites.value.map(c => Number(c.id));
        favoriteStore.favoriteIds = ids;
        favoriteStore.loaded = true;
    } catch (error) {
        console.error('Lỗi khi tải danh sách xe yêu thích:', error);
    } finally {
        loading.value = false;
    }
};

// ============================================================================
// 5. MÓC TRÌNH DẪN VÒNG ĐỜI HỆ THỐNG VUE (LIFECYCLE HOOK)
// ============================================================================
onMounted(() => {
    loadFavorites();
});
</script>

<style scoped>
.profile-page {
  background-color: #f8f9fa;
}
</style>
