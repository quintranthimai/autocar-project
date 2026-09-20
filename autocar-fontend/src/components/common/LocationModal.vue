<template>
    <div class="modal fade" id="locationDetailModal" tabindex="-1" aria-labelledby="locationDetailModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div class="modal-content border-0 rounded-4 shadow-lg">

                <div class="modal-header border-bottom px-4 py-3 position-relative">
                    <!-- 1. THAY ĐỔI TIÊU ĐỀ ĐỘNG DỰA VÀO PROP -->
                    <h5 class="modal-title fw-bold w-100 text-center text-dark" id="locationDetailModalLabel">
                        {{ title }}
                    </h5>
                    <button type="button" class="btn-close border rounded-circle p-2 position-absolute end-0 me-4"
                        data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body p-4">

                    <!-- PHẦN TÌM KIẾM GIỮ NGUYÊN -->
                    <div class="position-relative mb-4">
                        <div
                            class="d-flex align-items-center border border-2 border-primary rounded-3 px-3 py-2 bg-white shadow-sm">
                            <i class="fas fa-search text-primary fs-5 me-3"></i>
                            <input type="text" class="form-control border-0 shadow-none p-0 text-dark fw-medium"
                                placeholder="Nhập tên đường, phường, quận..." v-model="searchQuery"
                                @input="handleSearchInput">
                            <div v-if="isSearchingAddress" class="spinner-border spinner-border-sm text-primary ms-2">
                            </div>
                            <button v-if="searchQuery" type="button" class="btn btn-link text-muted p-0 ms-2"
                                @click="clearSearch()">
                                <span class="fas fa-times-circle fs-5"></span>
                            </button>
                        </div>

                        <ul v-if="addressSuggestions.length > 0"
                            class="list-group position-absolute w-100 shadow-lg mt-2 border-0"
                            style="z-index: 1060; max-height: 250px; overflow-y: auto; border-radius: 0.75rem;">
                            <li v-for="(item, index) in addressSuggestions" :key="index"
                                class="list-group-item list-group-item-action d-flex align-items-start gap-3 cursor-pointer py-3 border-bottom"
                                @click="selectAddressSuggestion(item)">
                                <i class="fas fa-map-marker-alt text-danger mt-1"></i>
                                <div>
                                    <div class="fw-bold text-dark" style="font-size: 0.95rem;">
                                        {{ locationService.formatVietnameseAddress(item) || item.name }}
                                    </div>
                                    <div class="text-muted" style="font-size: 0.8rem;">{{ item.display_name }}</div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <!-- NÚT LẤY GPS GIỮ NGUYÊN -->
                    <div class="d-flex align-items-center gap-3 mb-2 cursor-pointer" role="button"
                        @click="getCurrentLocation()">
                        <i class="fas fs-5 ms-1"
                            :class="isFetchingLocation ? 'fa-spinner fa-spin text-primary' : 'fa-map-marker-alt text-dark'"></i>
                        <span class="fw-bold fs-6" :class="isFetchingLocation ? 'text-primary' : 'text-dark'">
                            {{ isFetchingLocation ? 'Đang dò tìm tọa độ GPS...' : 'Vị trí hiện tại' }}
                        </span>
                    </div>

                    <!-- 2. ẨN/HIỆN PHẦN SÂN BAY DỰA VÀO PROP -->
                    <div v-if="showAirports">
                        <hr class="text-muted opacity-25 my-4">
                        <div class="mb-2 pb-2">
                            <div class="text-muted small mb-3">Giao xe sân bay</div>
                            <div class="d-flex flex-wrap gap-3">
                                <button v-for="airport in airports" :key="airport.name" type="button"
                                    class="btn bg-white border rounded-pill px-3 py-2 d-flex align-items-center gap-2 text-dark"
                                    @click="selectSpecificLocation(airport)">
                                    <i class="fas fa-plane text-dark"></i> {{ airport.label }}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';
import locationService from '@/services/location.service';

// 3. KHAI BÁO PROPS Ở ĐÂY
const props = defineProps({
    title: {
        type: String,
        default: 'Địa điểm nhận xe' // Mặc định nếu không truyền gì thì vẫn giữ chữ cũ
    },
    showAirports: {
        type: Boolean,
        default: true // Mặc định vẫn hiện sân bay
    }
});

const emit = defineEmits(['locationSelected']);

// === STATE ===
const searchQuery = ref('');
const addressSuggestions = ref([]);
const isSearchingAddress = ref(false);
const isFetchingLocation = ref(false);
let searchTimeout = null;

const getOrCreateModalInstance = (el) => {
    const ModalCtor = window.bootstrap?.Modal;
    if (!ModalCtor || !el) return null;
    if (typeof ModalCtor.getOrCreateInstance === 'function') {
        return ModalCtor.getOrCreateInstance(el);
    }
    if (typeof ModalCtor.getInstance === 'function') {
        const instance = ModalCtor.getInstance(el);
        if (instance) return instance;
    }
    return new ModalCtor(el);
};

const getExistingModalInstance = (el) => {
    const ModalCtor = window.bootstrap?.Modal;
    if (!ModalCtor || !el || typeof ModalCtor.getInstance !== 'function') return null;
    return ModalCtor.getInstance(el);
};

const airports = [
    { name: 'Sân bay Tân Sơn Nhất', label: 'Tân Sơn Nhất', lat: 10.8142, lng: 106.6660 },
    { name: 'Ga T3 (TSN)', label: 'Ga T3 (TSN)', lat: 10.8142, lng: 106.6660 },
    { name: 'Sân bay Nội Bài', label: 'Nội Bài', lat: 21.2187, lng: 105.8042 },
    { name: 'Sân bay Đà Nẵng', label: 'Đà Nẵng', lat: 16.0538, lng: 108.2022 },
    { name: 'Sân bay Cam Ranh', label: 'Cam Ranh', lat: 11.9981, lng: 109.2193 },
    { name: 'Sân bay Phú Quốc', label: 'Phú Quốc', lat: 10.1659, lng: 103.9956 },
    { name: 'Sân bay Liên Khương', label: 'Liên Khương', lat: 11.7512, lng: 108.3670 }
];

// ==========================================
// ĐÃ FIX DỨT ĐIỂM LỖI NỀN ĐEN Ở HÀM NÀY
// ==========================================
const emitSelectionAndClose = (name, lat, lng) => {
    emit('locationSelected', { name, lat, lng });
    searchQuery.value = '';
    addressSuggestions.value = [];
    const el = document.getElementById('locationDetailModal');

    if (window.bootstrap && el) {
        if (document.activeElement instanceof HTMLElement && el.contains(document.activeElement)) {
            document.activeElement.blur();
        }
        const modal = getOrCreateModalInstance(el);
        if (modal && typeof modal.hide === 'function') {
            modal.hide();
        }
    }
};

const handleSearchInput = () => {
    clearTimeout(searchTimeout);
    if (!searchQuery.value.trim()) {
        addressSuggestions.value = [];
        return;
    }
    isSearchingAddress.value = true;
    searchTimeout = setTimeout(async () => {
        try {
            addressSuggestions.value = await locationService.searchAddress(searchQuery.value);
        } catch (error) {
            console.error("Lỗi lấy gợi ý:", error);
        } finally {
            isSearchingAddress.value = false;
        }
    }, 600);
};

const selectAddressSuggestion = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lng ?? item.lon);
    const formattedName = locationService.formatVietnameseAddress(item) || item.name;
    emitSelectionAndClose(formattedName, lat, lng);
};

const clearSearch = () => {
    searchQuery.value = '';
    addressSuggestions.value = [];
    emit('locationSelected', { name: '', lat: null, lng: null });
};

const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
        alert('Trình duyệt của bạn không hỗ trợ định vị GPS.');
        return;
    }
    isFetchingLocation.value = true;
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const data = await locationService.getAddressFromCoords(latitude, longitude);
                const formattedName = locationService.formatVietnameseAddress(data);
                if (!formattedName) {
                    alert('Không thể lấy địa chỉ chi tiết từ GPS. Vui lòng thử lại hoặc nhập địa chỉ thủ công.');
                    return;
                }
                emitSelectionAndClose(formattedName, latitude, longitude);
            } catch (error) {
                console.error("Lỗi Geocoding:", error);
                alert('Không thể chuyển GPS sang địa chỉ. Vui lòng thử lại sau.');
            } finally {
                isFetchingLocation.value = false;
            }
        },
        (error) => {
            console.error("Lỗi GPS:", error);
            isFetchingLocation.value = false;
            if (error.code === 1) {
                alert('Bạn đã chặn quyền truy cập vị trí. Vui lòng bấm vào icon ổ khóa trên thanh địa chỉ trình duyệt để mở lại.');
            } else {
                alert('Lỗi lấy tín hiệu GPS, vui lòng thử gõ tay hoặc chọn lại.');
            }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
};

const selectSpecificLocation = (airport) => {
    emitSelectionAndClose(airport.name, airport.lat, airport.lng);
};

const selectHomeAddress = () => {
    emitSelectionAndClose('194 Cao Lỗ, Phường 4, Quận 8', 10.7380, 106.6780);
};

onBeforeUnmount(() => {
    clearTimeout(searchTimeout);
    const el = document.getElementById('locationDetailModal');
    if (window.bootstrap && el) {
        const modal = getExistingModalInstance(el);
        if (modal) {
            if (typeof modal.hide === 'function') {
                modal.hide();
            }
            if (typeof modal.dispose === 'function') {
                modal.dispose();
            }
        }
    }
});
</script>
