<template>
    <router-link :to="`/vehicle-details/${car.id}`" class="text-decoration-none text-body">
        <div class="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div class="position-relative">
                <!-- ĐIỂM CHÚ Ý: Đã thêm style="height: 220px;" để cố định khung ảnh -->
                <img :src="car?.images?.[0]?.image_url || 'https://placehold.co/600x400/eeeeee/999999?text=No+Image'" 
                     class="card-img-top object-fit-cover"
                     style="height: 220px;"
                     alt="Car Image" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='https://placehold.co/600x400/eeeeee/999999?text=No+Image'">

                <div class="position-absolute top-0 end-0 m-3" style="z-index: 10;">
                    <div @click.stop.prevent="handleToggleFavorite"
                        class="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                        :class="isFavorited ? 'bg-white text-danger border border-danger border-opacity-25' : 'bg-dark bg-opacity-50 text-white'"
                        style="width: 36px; height: 36px; cursor: pointer; transition: all 0.2s ease;"
                        :title="isFavorited ? 'Xóa khỏi yêu thích' : 'Lưu xe này'">
                        <i :class="isFavorited ? 'fas fa-heart fs-6 text-danger' : 'far fa-heart fs-6 text-white'"></i>
                    </div>
                </div>

                <div v-if="(car.is_discount_enabled && car.weekly_discount_percent > 0) || car.discount_percentage > 0" 
                     class="position-absolute bottom-0 end-0 m-3" style="z-index: 5;">
                    <span class="badge rounded-pill px-3 py-2 fw-bold shadow-sm text-white" 
                          style="background-color: #ea580c; font-size: 0.88rem;">
                        Giảm {{ car.weekly_discount_percent || car.discount_percentage }}%
                    </span>
                </div>

                <div class="position-absolute start-0 ms-3" style="bottom: -20px; z-index: 2;">
                    <div class="position-relative">
                        <img :src="car.owner?.avatar || '/img/team-1.jpg'"
                            class="rounded-circle border-3 border-white object-fit-cover shadow-sm bg-white"
                            style="width: 55px; height: 55px;" alt="Avatar"
                            onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=User&background=random'">

                        <div v-if="(car.owner && car.owner.avg_rating >= 4.8) || car.is_super_host"
                            class="position-absolute bottom-0 start-50 translate-middle-x rounded-circle bg-warning d-flex align-items-center justify-content-center border-2 border-white"
                            style="width: 20px; height: 20px; margin-bottom: -4px;" title="Chủ xe Uy Tín">
                            <i class="fas fa-crown text-white" style="font-size: 10px;"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card-body pt-4 mt-2 d-flex flex-column px-3 pb-3">
                <div class="d-flex flex-wrap gap-2 mb-3">
                    <span v-if="car.is_mortgage_exempt"
                        class="badge rounded-pill border border-secondary border-opacity-25 text-body fw-normal py-1 px-2 small bg-transparent">
                        <i class="fas fa-shield-alt text-success me-1"></i> Miễn thế chấp
                    </span>
                    <span v-if="car.is_delivery_supported"
                        class="badge rounded-pill border border-secondary border-opacity-25 text-body fw-normal py-1 px-2 small bg-transparent">
                        <i class="fas fa-map-marker-alt text-primary me-1"></i> Giao xe tận nơi
                    </span>
                </div>

                <h5 class="fw-bold text-body text-uppercase text-truncate mb-2" style="letter-spacing: -0.5px;"
                    :title="car.car_model?.brand_name + ' ' + car.car_model?.model_name + ' ' + car.year">
                    {{ car.car_model?.brand_name }} {{ car.car_model?.model_name }} {{ car.year }}
                </h5>

                <div class="d-flex align-items-center gap-3 small text-muted mb-3 fw-medium">
                    <span class="text-primary"><i class="fas fa-cogs me-1 opacity-50 text-primary"></i> {{
                        car.car_model?.transmission?.display_name || 'Số tự động' }}</span>
                    <span><i class="fas fa-user me-1 opacity-50"></i> {{ car.car_model?.seat_count || 5 }} chỗ</span>
                    <span><i class="fas fa-gas-pump me-1 opacity-50"></i> {{ car.car_model?.fuel?.display_name || 'Xăng'
                    }}</span>
                </div>

                <div class="text-muted small mb-3 text-truncate fw-medium">
                    <i class="fas fa-map-marker-alt text-body me-2 opacity-75"></i>
                    {{ car.distance ? `Cách bạn khoảng ${Math.round(car.distance)} km` : (car.parking_address || 'Đang cập nhật địa chỉ') }}
                </div>

                <!-- Footer chứa giá và rating sẽ tự động bị đẩy xuống cuối nhờ flex-column và mt-auto -->
                <div class="mt-auto border-top pt-3 d-flex justify-content-between align-items-end">
                    <div class="text-muted small fw-medium pb-1 d-flex align-items-center">
                        <span v-if="car.owner && car.owner.avg_rating > 0" class="d-inline-flex align-items-center">
                            <i class="fas fa-star text-warning me-1"></i>
                            <span class="text-body fw-bold">{{ Number(car.owner.avg_rating).toFixed(1) }}</span>
                        </span>
                        <span v-else class="badge bg-success bg-opacity-10 text-success fw-bold px-2 py-1">
                            Mới
                        </span>
                        <span class="mx-1">&bull;</span>
                        <i class="fas fa-suitcase text-primary me-1"></i> {{ car.total_trips || '0' }} chuyến
                    </div>
                    <div class="text-end">
                        <div v-if="getOriginalPrice(car)" class="text-muted text-decoration-line-through small fw-medium"
                            style="line-height: 1; margin-bottom: 2px;">
                            {{ formatPriceShort(getOriginalPrice(car)) }}
                        </div>
                        <div class="text-primary fw-bold fs-5" style="line-height: 1;">
                            {{ formatPriceShort(getFinalPrice(car)) }}
                            <span class="text-muted small fw-normal">/ngày</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </router-link>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH KẾT NỐI (IMPORTS & SETUP)
// ============================================================================
import { computed, onMounted } from 'vue';
import { useFavoriteStore } from '@/stores/favorite.store';

// Khởi tạo kho lưu trữ chuyên biệt quản lý xe Yêu thích
const favoriteStore = useFavoriteStore();

// ============================================================================
// 2. CẤU HÌNH THAM SỐ TRUYỀN VÀO & HỆ THỐNG TRẠNG THÁI (PROPS & STATE)
// ============================================================================
const props = defineProps({
    car: {
        type: Object,
        required: true
    }
});

// Trạng thái cho biết xe hiện tại đã được người dùng thêm vào mục yêu thích chưa
const isFavorited = computed(() => favoriteStore.isFavorited(props.car.id));

// ============================================================================
// 3. BỘ TIỆN ÍCH NGHIỆP VỤ VÀ CHUYỂN NGỮ ĐỊNH DẠNG (ACTIONS & FORMATTERS)
// ============================================================================
/**
 * Xử lý đổi trạng thái yêu thích (Thêm / Xóa khỏi danh sách lưu xe của người dùng)
 */
const handleToggleFavorite = () => {
    favoriteStore.toggleFavorite(props.car.id);
};

/**
 * Định dạng rút gọn số tiền giá thuê sang chuẩn đơn vị K (Ví dụ: 500,000 -> 500K)
 */
const formatPriceShort = (value) => {
    return value ? Math.round(value / 1000) + 'K' : '0K';
};

const getOriginalPrice = (car) => {
    if (car.base_price_old) return car.base_price_old;
    const discount = (car.is_discount_enabled && car.weekly_discount_percent > 0) ? car.weekly_discount_percent : (car.discount_percentage || 0);
    if (discount > 0) {
        return car.base_price;
    }
    return null;
};

const getFinalPrice = (car) => {
    if (car.base_price_old) return car.base_price;
    const discount = (car.is_discount_enabled && car.weekly_discount_percent > 0) ? car.weekly_discount_percent : (car.discount_percentage || 0);
    if (discount > 0) {
        return car.base_price * (1 - discount / 100);
    }
    return car.base_price;
};

// ============================================================================
// 4. KHUNG MÓC CHU KỲ VÒNG ĐỜI HỆ THỐNG (LIFECYCLE HOOKS)
// ============================================================================
onMounted(() => {
    favoriteStore.fetchFavoriteIds();
});
</script>

<style scoped>
.card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>
