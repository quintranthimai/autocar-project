<template>
    <div class="modal fade" id="timePickerModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content border-0 rounded-4 overflow-hidden">
                <div class="modal-header border-0 px-4 py-3">
                    <h5 class="modal-title fw-bold w-100 text-center">Thời gian</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body p-0">
                    <div class="px-3 px-lg-4 pt-3 pt-lg-4">
                        <ul class="nav nav-tabs nav-fill border-0 mb-3 mb-lg-4">
                            <li class="nav-item">
                                <button type="button" class="nav-link" :class="{ active: activeMode === 'day' }"
                                    @click="setMode('day')">
                                    Thuê theo ngày
                                </button>
                            </li>
                            <li class="nav-item">
                                <button type="button" class="nav-link" :class="{ active: activeMode === 'hour' }"
                                    @click="setMode('hour')">
                                    Thuê theo giờ
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div class="px-3 px-lg-4 pb-3 pb-lg-4">
                        <div v-if="activeMode === 'day'" class="bg-white rounded p-3 p-lg-4 shadow-sm">
                            <div class="row g-4">
                                <div class="col-lg-6">
                                    <div class="d-flex align-items-center justify-content-between mb-3 mb-lg-4">
                                        <button type="button" @click.prevent="prevMonth()"
                                            class="btn btn-outline-light border text-muted px-2 py-1"><span
                                                class="fas fa-chevron-left"></span></button>
                                        <h5 class="mb-0 fw-bold">Tháng {{ monthsToShow[0].month }}</h5>
                                        <button type="button" @click.prevent="nextMonth()"
                                            class="btn btn-outline-light border text-muted px-2 py-1"><span
                                                class="fas fa-chevron-right"></span></button>
                                    </div>
                                    <table class="table table-borderless mb-0 text-center">
                                        <thead>
                                            <tr>
                                                <th>T2</th>
                                                <th>T3</th>
                                                <th>T4</th>
                                                <th>T5</th>
                                                <th>T6</th>
                                                <th>T7</th>
                                                <th>CN</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(week, wi) in generateMonthWeeks(monthsToShow[0].year, monthsToShow[0].month)"
                                                :key="wi">
                                                <td v-for="(day, di) in week" :key="di">
                                                    <span v-if="day"
                                                        class="d-flex align-items-center justify-content-center rounded-2 fw-semibold"
                                                        style="cursor: pointer;" :class="{
                                                            'bg-primary text-white': (selectedStart && selectedStart.year === monthsToShow[0].year && selectedStart.month === monthsToShow[0].month && selectedStart.day === day) || (selectedEnd && selectedEnd.year === monthsToShow[0].year && selectedEnd.month === monthsToShow[0].month && selectedEnd.day === day),
                                                            'text-muted opacity-50 bg-light': isPastDate(monthsToShow[0].year, monthsToShow[0].month, day) || isBusyDate(monthsToShow[0].year, monthsToShow[0].month, day),
                                                            'cursor-not-allowed': isPastDate(monthsToShow[0].year, monthsToShow[0].month, day) || isBusyDate(monthsToShow[0].year, monthsToShow[0].month, day),
                                                            'text-decoration-underline text-primary': isTodayObj({ year: monthsToShow[0].year, month: monthsToShow[0].month, day }) && !isBusyDate(monthsToShow[0].year, monthsToShow[0].month, day)
                                                        }"
                                                        @click="onDayClick(monthsToShow[0].year, monthsToShow[0].month, day)">{{
                                                            day }}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="col-lg-6">
                                    <div class="d-flex align-items-center justify-content-between mb-3 mb-lg-4">
                                        <button type="button" @click.prevent="prevMonth()"
                                            class="btn btn-outline-light border text-muted px-2 py-1"><span
                                                class="fas fa-chevron-left"></span></button>
                                        <h5 class="mb-0 fw-bold">Tháng {{ monthsToShow[1].month }}</h5>
                                        <button type="button" @click.prevent="nextMonth()"
                                            class="btn btn-outline-light border text-muted px-2 py-1"><span
                                                class="fas fa-chevron-right"></span></button>
                                    </div>
                                    <table class="table table-borderless mb-0 text-center">
                                        <thead>
                                            <tr>
                                                <th>T2</th>
                                                <th>T3</th>
                                                <th>T4</th>
                                                <th>T5</th>
                                                <th>T6</th>
                                                <th>T7</th>
                                                <th>CN</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(week, wi) in generateMonthWeeks(monthsToShow[1].year, monthsToShow[1].month)"
                                                :key="wi">
                                                <td v-for="(day, di) in week" :key="di">
                                                    <span v-if="day"
                                                        class="d-flex align-items-center justify-content-center rounded-2 fw-semibold"
                                                        style="cursor: pointer;" :class="{
                                                            'bg-primary text-white': (selectedStart && selectedStart.year === monthsToShow[1].year && selectedStart.month === monthsToShow[1].month && selectedStart.day === day) || (selectedEnd && selectedEnd.year === monthsToShow[1].year && selectedEnd.month === monthsToShow[1].month && selectedEnd.day === day),
                                                            'text-muted opacity-50 bg-light': isPastDate(monthsToShow[1].year, monthsToShow[1].month, day) || isBusyDate(monthsToShow[1].year, monthsToShow[1].month, day),
                                                            'cursor-not-allowed': isPastDate(monthsToShow[1].year, monthsToShow[1].month, day) || isBusyDate(monthsToShow[1].year, monthsToShow[1].month, day),
                                                            'text-decoration-underline text-primary': isTodayObj({ year: monthsToShow[1].year, month: monthsToShow[1].month, day }) && !isBusyDate(monthsToShow[1].year, monthsToShow[1].month, day)
                                                        }"
                                                        @click="onDayClick(monthsToShow[1].year, monthsToShow[1].month, day)">{{
                                                            day }}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="row g-3 g-lg-4 mt-3 mt-lg-4 align-items-start">
                                <div class="col-md-6 col-lg-5">
                                    <div class="card">
                                        <div class="card-header d-flex align-items-center justify-content-between py-2">
                                            <div>
                                                <div class="text-muted small fw-semibold">Nhận xe</div>
                                                <div class="fw-bold fs-5 lh-1">{{ selectedStartTime }}</div>
                                            </div>
                                            <button type="button" class="btn btn-link p-0 text-dark"
                                                @click="toggleTimeDropdown('start')"><span
                                                    class="fas fa-chevron-down"></span></button>
                                        </div>
                                        <div v-show="isStartTimeOpen" class="list-group list-group-flush overflow-auto"
                                            ref="startTimeListRef" style="max-height:12rem;">
                                            <label v-for="t in times" :key="t" :data-time="t" role="button"
                                                class="list-group-item border-0 d-flex align-items-center gap-3"
                                                @click.prevent="selectStartTimeIfAllowed(t)">
                                                <input class="form-check-input me-3" type="radio" name="startTime"
                                                    :checked="selectedStartTime === t"
                                                    :disabled="isPastDateTime(selectedStart, t)" readonly>
                                                <span class="fw-semibold">{{ t }}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="col-12 col-md-12 col-lg-2 d-flex justify-content-center align-items-center py-2 py-md-4">
                                    <button type="button" @click="swapTimes()"
                                        class="btn btn-outline-secondary rounded-circle" title="Trao đổi giờ nhận/trả">
                                        <span class="fas fa-arrow-right"></span>
                                    </button>
                                </div>
                                <div class="col-md-6 col-lg-5">
                                    <div class="card">
                                        <div class="card-header d-flex align-items-center justify-content-between py-2">
                                            <div>
                                                <div class="text-muted small fw-semibold">Trả xe</div>
                                                <div class="fw-bold fs-5 lh-1">{{ selectedEndTime }}</div>
                                            </div>
                                            <button type="button" class="btn btn-link p-0 text-dark"
                                                @click="toggleTimeDropdown('end')"><span
                                                    class="fas fa-chevron-down"></span></button>
                                        </div>
                                        <div v-show="isEndTimeOpen" class="list-group list-group-flush overflow-auto"
                                            ref="endTimeListRef" style="max-height:12rem;">
                                            <label v-for="t in times" :key="`end-${t}`" :data-time="t" role="button"
                                                class="list-group-item border-0 d-flex align-items-center gap-3"
                                                @click.prevent="selectEndTimeIfAllowed(t)">
                                                <input class="form-check-input me-3" type="radio" name="endTime"
                                                    :checked="selectedEndTime === t"
                                                    :disabled="isPastDateTime(selectedEnd, t)" readonly>
                                                <span class="fw-semibold">{{ t }}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-else class="bg-white rounded p-3 p-lg-4 shadow-sm">
                            <div class="row g-3 g-lg-4 align-items-start">
                                <div class="col-lg-6 col-xl-4">
                                    <div class="card">
                                        <div class="card-header d-flex align-items-center justify-content-between py-2">
                                            <div>
                                                <div class="text-muted small fw-semibold">Ngày bắt đầu</div>
                                                <div class="fw-bold fs-5 lh-1">{{ formatHourDate(selectedHourDate) }}
                                                </div>
                                            </div>
                                            <button type="button" class="btn btn-link p-0 text-dark"
                                                @click="toggleHourDropdown('date')"><span
                                                    class="fas fa-chevron-down"></span></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-xl-4">
                                    <div class="card">
                                        <div class="card-header d-flex align-items-center justify-content-between py-2">
                                            <div>
                                                <div class="text-muted small fw-semibold">Giờ nhận xe</div>
                                                <div class="fw-bold fs-5 lh-1">{{ selectedHourTime }}</div>
                                            </div>
                                            <button type="button" class="btn btn-link p-0 text-dark"
                                                @click="toggleHourDropdown('time')"><span
                                                    class="fas fa-chevron-down"></span></button>
                                        </div>
                                        <div v-show="isHourTimeOpen" class="list-group list-group-flush overflow-auto"
                                            ref="hourTimeListRef" style="max-height:12rem;">
                                            <label v-for="t in times" :key="`hour-${t}`" :data-time="t" role="button"
                                                class="list-group-item border-0 d-flex align-items-center gap-3"
                                                @click.prevent="selectHourTimeIfAllowed(t)">
                                                <input class="form-check-input me-3" type="radio" name="hourTime"
                                                    :checked="selectedHourTime === t"
                                                    :disabled="isPastDateTime(selectedHourDate, t)" readonly>
                                                <span class="fw-semibold">{{ t }}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-xl-4">
                                    <div class="card">
                                        <div class="card-header d-flex align-items-center justify-content-between py-2">
                                            <div>
                                                <div class="text-muted small fw-semibold">Thời gian thuê</div>
                                                <div class="fw-bold fs-5 lh-1">{{ selectedRentalHours }} giờ</div>
                                            </div>
                                            <button type="button" class="btn btn-link p-0 text-dark"
                                                @click="toggleHourDropdown('duration')"><span
                                                    class="fas fa-chevron-down"></span></button>
                                        </div>
                                        <div v-show="isHourDurationOpen"
                                            class="list-group list-group-flush overflow-auto" ref="hourDurationListRef"
                                            style="max-height:12rem;">
                                            <label v-for="hour in rentalHourOptions" :key="hour"
                                                :data-time="String(hour)" role="button"
                                                class="list-group-item border-0 d-flex align-items-center gap-3"
                                                @click.prevent="selectRentalHours(hour)">
                                                <input class="form-check-input me-3" type="radio" name="rentalDuration"
                                                    :checked="selectedRentalHours === hour" readonly>
                                                <span class="fw-semibold">{{ hour }} giờ</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-show="isHourDateOpen" class="bg-white rounded p-3 p-lg-4 shadow-sm mt-3 border">
                                <div class="d-flex align-items-center justify-content-between mb-3 mb-lg-4">
                                    <button type="button" @click.prevent="prevHourMonth()"
                                        class="btn btn-outline-light border text-muted px-2 py-1"><span
                                            class="fas fa-chevron-left"></span></button>
                                    <h5 class="mb-0 fw-bold">Tháng {{ hourMonthsToShow[0].month }}</h5>
                                    <h5 class="mb-0 fw-bold d-none d-md-block">Tháng {{ hourMonthsToShow[1].month }}
                                    </h5>
                                    <button type="button" @click.prevent="nextHourMonth()"
                                        class="btn btn-outline-light border text-muted px-2 py-1"><span
                                            class="fas fa-chevron-right"></span></button>
                                </div>
                                <div class="row g-4">
                                    <div class="col-md-6">
                                        <table class="table table-borderless mb-0 text-center">
                                            <thead>
                                                <tr>
                                                    <th>T2</th>
                                                    <th>T3</th>
                                                    <th>T4</th>
                                                    <th>T5</th>
                                                    <th>T6</th>
                                                    <th>T7</th>
                                                    <th>CN</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(week, wi) in generateMonthWeeks(hourMonthsToShow[0].year, hourMonthsToShow[0].month)"
                                                    :key="`hour-month-a-${wi}`">
                                                    <td v-for="(day, di) in week" :key="di">
                                                        <span v-if="day"
                                                            class="d-flex align-items-center justify-content-center rounded-2 fw-semibold"
                                                            style="cursor: pointer;" :class="{
                                                                'bg-primary text-white': selectedHourDate && selectedHourDate.year === hourMonthsToShow[0].year && selectedHourDate.month === hourMonthsToShow[0].month && selectedHourDate.day === day,
                                                                'text-muted opacity-50 bg-light': isPastDate(hourMonthsToShow[0].year, hourMonthsToShow[0].month, day) || isBusyDate(hourMonthsToShow[0].year, hourMonthsToShow[0].month, day),
                                                                'cursor-not-allowed': isPastDate(hourMonthsToShow[0].year, hourMonthsToShow[0].month, day) || isBusyDate(hourMonthsToShow[0].year, hourMonthsToShow[0].month, day),
                                                                'text-decoration-underline text-primary': isTodayObj({ year: hourMonthsToShow[0].year, month: hourMonthsToShow[0].month, day }) && !isBusyDate(hourMonthsToShow[0].year, hourMonthsToShow[0].month, day)
                                                            }"
                                                            @click="onHourDayClick(hourMonthsToShow[0].year, hourMonthsToShow[0].month, day)">{{
                                                                day }}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="col-md-6 d-none d-md-block">
                                        <table class="table table-borderless mb-0 text-center">
                                            <thead>
                                                <tr>
                                                    <th>T2</th>
                                                    <th>T3</th>
                                                    <th>T4</th>
                                                    <th>T5</th>
                                                    <th>T6</th>
                                                    <th>T7</th>
                                                    <th>CN</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(week, wi) in generateMonthWeeks(hourMonthsToShow[1].year, hourMonthsToShow[1].month)"
                                                    :key="`hour-month-b-${wi}`">
                                                    <td v-for="(day, di) in week" :key="di">
                                                        <span v-if="day"
                                                            class="d-flex align-items-center justify-content-center rounded-2 fw-semibold"
                                                            style="cursor: pointer;" :class="{
                                                                'bg-primary text-white': selectedHourDate && selectedHourDate.year === hourMonthsToShow[1].year && selectedHourDate.month === hourMonthsToShow[1].month && selectedHourDate.day === day,
                                                                'text-muted opacity-50 bg-light': isPastDate(hourMonthsToShow[1].year, hourMonthsToShow[1].month, day) || isBusyDate(hourMonthsToShow[1].year, hourMonthsToShow[1].month, day),
                                                                'cursor-not-allowed': isPastDate(hourMonthsToShow[1].year, hourMonthsToShow[1].month, day) || isBusyDate(hourMonthsToShow[1].year, hourMonthsToShow[1].month, day),
                                                                'text-decoration-underline text-primary': isTodayObj({ year: hourMonthsToShow[1].year, month: hourMonthsToShow[1].month, day }) && !isBusyDate(hourMonthsToShow[1].year, hourMonthsToShow[1].month, day)
                                                            }"
                                                            @click="onHourDayClick(hourMonthsToShow[1].year, hourMonthsToShow[1].month, day)">{{
                                                                day }}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer border-0 px-3 px-lg-4 pb-3 pb-lg-4 pt-0">
                    <div
                        class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 w-100">
                        <div>
                            <div class="fw-semibold fs-6">{{ summaryText }}</div>
                            <div class="text-muted small mt-1">
                                Thời gian thuê: <span class="text-primary fw-semibold">{{ rentalDurationText }}</span>
                                <span class="ms-1 text-muted">⟲</span>
                            </div>
                        </div>
                        <button type="button" @click="applyAndClose()"
                            class="btn btn-primary btn-lg px-4 px-lg-5 rounded-3 fw-semibold"
                            :disabled="!isTimeSelectionValid()"
                            :title="isTimeSelectionValid() ? '' : 'Vui lòng chọn đầy đủ thông tin thời gian'">Tiếp
                            tục</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH KẾT NỐI (IMPORTS & SETUP)
// ============================================================================
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { useRentalTimeStore } from '@/stores/rentalTime.store';

// ============================================================================
// 2. CẤU HÌNH TRƯỜNG DỮ LIỆU THÔNG HẬU & SỰ KIỆN KẾT XUẤT (PROPS & EMITS)
// ============================================================================
// Khai báo sự kiện emit ra ngoài
const emit = defineEmits(['timeSelected']);

const props = defineProps({
    busyDates: {
        type: Array,
        default: () => []
    },
    bookedDates: {
        type: Array,
        default: () => []
    }
});
const rentalTimeStore = useRentalTimeStore();

// ============================================================================
// 3. KHỞI TẠO BIẾN TRẠNG THÁI NGÀY GIỜ & HỘP THOẠI TRẢI XUỐNG (TIME STATE)
// ============================================================================
const today = new Date();
const yearNow = today.getFullYear();
const monthIndex = today.getMonth() + 1;
const dayOfMonth = today.getDate();

const activeMode = ref('day');
const start = ref({ year: yearNow, month: monthIndex });

// Date & Time State
const selectedStart = ref(null);
const selectedEnd = ref(null);
const selectedStartTime = ref('08:00');
const selectedEndTime = ref('20:00');

const selectedHourDate = ref({ year: yearNow, month: monthIndex, day: dayOfMonth });
const selectedHourTime = ref('08:00');
const selectedRentalHours = ref(4);

// Dropdown State & Refs
const isStartTimeOpen = ref(false);
const isEndTimeOpen = ref(false);
const isHourDateOpen = ref(false);
const isHourTimeOpen = ref(false);
const isHourDurationOpen = ref(false);

const startTimeListRef = ref(null);
const endTimeListRef = ref(null);
const hourTimeListRef = ref(null);
const hourDurationListRef = ref(null);
const hourCalendarStart = ref({ year: yearNow, month: monthIndex });

const times = Array.from({ length: 48 }, (_, index) => {
    const totalMinutes = index * 30;
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const minutes = String(totalMinutes % 60).padStart(2, '0');
    return `${hours}:${minutes}`;
});

const rentalHourOptions = Array.from({ length: 9 }, (_, index) => index + 4);

let modalShowHandler = null;

// ============================================================================
// 4. BỘ CÔNG CỤ TÍNH TOÁN LỊCH BẬN VÀ KIỂM SOÁT THỜI GIAN (CALENDAR LOGIC)
// ============================================================================
function addMonths(y, m, delta) {
    let newMonth = m + delta;
    let newYear = y;
    while (newMonth > 12) { newMonth -= 12; newYear += 1; }
    while (newMonth < 1) { newMonth += 12; newYear -= 1; }
    return { year: newYear, month: newMonth };
}

function inferMode(startDatetime, endDatetime) {
    const s = new Date(startDatetime);
    const e = new Date(endDatetime);
    const diffHours = (e - s) / (1000 * 60 * 60);
    if (diffHours <= 12 && s.toDateString() === e.toDateString()) return 'hour';
    return 'day';
}

function resetDropdownStates() {
    isStartTimeOpen.value = false;
    isEndTimeOpen.value = false;
    isHourDateOpen.value = false;
    isHourTimeOpen.value = false;
    isHourDurationOpen.value = false;
}

function syncSelectionFromStore() {
    const startDatetime = rentalTimeStore.startDatetime;
    const endDatetime = rentalTimeStore.endDatetime;
    if (!startDatetime || !endDatetime) return;

    const startDate = new Date(startDatetime);
    const endDate = new Date(endDatetime);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return;

    const mode = rentalTimeStore.mode || inferMode(startDatetime, endDatetime);
    activeMode.value = mode;

    if (mode === 'hour') {
        selectedHourDate.value = {
            year: startDate.getFullYear(),
            month: startDate.getMonth() + 1,
            day: startDate.getDate(),
        };
        selectedHourTime.value = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;

        const diffHours = Math.round((endDate - startDate) / (1000 * 60 * 60));
        const minHour = rentalHourOptions[0];
        const maxHour = rentalHourOptions[rentalHourOptions.length - 1];
        selectedRentalHours.value = Math.max(minHour, Math.min(maxHour, diffHours || minHour));

        hourCalendarStart.value = {
            year: selectedHourDate.value.year,
            month: selectedHourDate.value.month,
        };
    } else {
        selectedStart.value = {
            year: startDate.getFullYear(),
            month: startDate.getMonth() + 1,
            day: startDate.getDate(),
        };
        selectedEnd.value = {
            year: endDate.getFullYear(),
            month: endDate.getMonth() + 1,
            day: endDate.getDate(),
        };
        selectedStartTime.value = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;
        selectedEndTime.value = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

        start.value = {
            year: selectedStart.value.year,
            month: selectedStart.value.month,
        };
    }

    resetDropdownStates();
}

const monthsToShow = computed(() => [
    { year: start.value.year, month: start.value.month },
    addMonths(start.value.year, start.value.month, 1)
]);

const hourMonthsToShow = computed(() => [
    hourCalendarStart.value,
    addMonths(hourCalendarStart.value.year, hourCalendarStart.value.month, 1)
]);

function prevMonth() { start.value = addMonths(start.value.year, start.value.month, -1); }
function nextMonth() { start.value = addMonths(start.value.year, start.value.month, 1); }
function prevHourMonth() { hourCalendarStart.value = addMonths(hourCalendarStart.value.year, hourCalendarStart.value.month, -1); }
function nextHourMonth() { hourCalendarStart.value = addMonths(hourCalendarStart.value.year, hourCalendarStart.value.month, 1); }

function generateMonthWeeks(year, month) {
    const first = new Date(year, month - 1, 1);
    const last = new Date(year, month, 0);
    const weeks = [];
    let week = Array(7).fill(null);
    let idx = (first.getDay() + 6) % 7;
    let day = 1;
    week[idx] = day++;
    while (day <= last.getDate()) {
        idx++;
        if (idx === 7) {
            weeks.push(week);
            week = Array(7).fill(null);
            idx = 0;
        }
        week[idx] = day++;
    }
    weeks.push(week);
    return weeks;
}

// === CÁC HÀM XỬ LÝ CHỌN THỜI GIAN ===
function toDateObj(y, m, d) { return { year: y, month: m, day: d }; }
function compareDate(a, b) {
    if (!a || !b) return 0;
    const da = new Date(a.year, a.month - 1, a.day);
    const db = new Date(b.year, b.month - 1, b.day);
    return da - db;
}

function setMode(mode) {
    activeMode.value = mode;
    isStartTimeOpen.value = false;
    isEndTimeOpen.value = false;
    isHourDateOpen.value = false;
    isHourTimeOpen.value = false;
    isHourDurationOpen.value = false;
}

function isBusyDate(year, month, day) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return props.busyDates.includes(dateStr) || props.bookedDates.includes(dateStr);
}

function hasBusyDateBetween(startObj, endObj) {
    let current = new Date(startObj.year, startObj.month - 1, startObj.day);
    const endDate = new Date(endObj.year, endObj.month - 1, endObj.day);
    while (current <= endDate) {
        if (isBusyDate(current.getFullYear(), current.getMonth() + 1, current.getDate())) {
            return true;
        }
        current.setDate(current.getDate() + 1);
    }
    return false;
}

function selectHourCalendarDay(year, month, day) {
    selectedHourDate.value = { year, month, day };
    isHourDateOpen.value = false;
}

function onHourDayClick(year, month, day) {
    if (isPastDate(year, month, day) || isBusyDate(year, month, day)) return;
    selectHourCalendarDay(year, month, day);
}

function handleDayClick(y, m, day) {
    if (!day) return;
    const clicked = toDateObj(y, m, day);
    if (!selectedStart.value || (selectedStart.value && selectedEnd.value)) {
        selectedStart.value = clicked;
        selectedEnd.value = null;
        return;
    }
    const cmp = compareDate(clicked, selectedStart.value);
    if (cmp >= 0) {
        if (hasBusyDateBetween(selectedStart.value, clicked)) {
            alert('Khoảng thời gian bạn chọn có chứa ngày xe bận hoặc đã có người thuê. Vui lòng chọn lại.');
            selectedStart.value = clicked;
            selectedEnd.value = null;
            return;
        }
        selectedEnd.value = clicked;
    } else {
        selectedStart.value = clicked;
    }
}

function onDayClick(y, m, day) {
    if (isPastDate(y, m, day) || isBusyDate(y, m, day)) return;
    handleDayClick(y, m, day);
}

// === HIỂN THỊ SUMMARY ===
function formatSummary() {
    if (!selectedStart.value || !selectedEnd.value) return 'Chọn thời gian';
    const sDate = selectedStart.value, eDate = selectedEnd.value;
    const sWeekday = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][new Date(sDate.year, sDate.month - 1, sDate.day).getDay()];
    const eWeekday = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][new Date(eDate.year, eDate.month - 1, eDate.day).getDay()];
    const sDD = String(sDate.day).padStart(2, '0'), sMM = String(sDate.month).padStart(2, '0');
    const eDD = String(eDate.day).padStart(2, '0'), eMM = String(eDate.month).padStart(2, '0');
    return `${selectedStartTime.value} ${sWeekday}, ${sDD}/${sMM} - ${selectedEndTime.value} ${eWeekday}, ${eDD}/${eMM}`;
}

function formatHourDate(dateObj) {
    if (!dateObj) return '';
    return `${String(dateObj.day).padStart(2, '0')}/${String(dateObj.month).padStart(2, '0')}/${dateObj.year}`;
}

function formatHourSummary() {
    const startDate = selectedHourDate.value;
    const startTime = selectedHourTime.value;
    const startDT = new Date(startDate.year, startDate.month - 1, startDate.day, Number(startTime.slice(0, 2)), Number(startTime.slice(3, 5)));
    const endDT = new Date(startDT.getTime() + selectedRentalHours.value * 60 * 60 * 1000);
    const weekday = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const sDD = String(startDT.getDate()).padStart(2, '0'), sMM = String(startDT.getMonth() + 1).padStart(2, '0');
    const eDD = String(endDT.getDate()).padStart(2, '0'), eMM = String(endDT.getMonth() + 1).padStart(2, '0');
    return `${startTime} ${weekday[startDT.getDay()]}, ${sDD}/${sMM} - ${String(endDT.getHours()).padStart(2, '0')}:${String(endDT.getMinutes()).padStart(2, '0')} ${weekday[endDT.getDay()]}, ${eDD}/${eMM}`;
}

const summaryText = computed(() => activeMode.value === 'day' ? formatSummary() : formatHourSummary());

const rentalDaysText = computed(() => {
    if (!selectedStart.value || !selectedEnd.value) return '0 ngày';

    // 1. Tách Giờ và Phút từ chuỗi (Ví dụ: "08:30" -> [8, 30])
    const [startHour, startMinute] = selectedStartTime.value.split(':').map(Number);
    const [endHour, endMinute] = selectedEndTime.value.split(':').map(Number);

    // 2. Tạo đối tượng Date chứa CẢ NGÀY LẪN GIỜ
    const startDate = new Date(
        selectedStart.value.year,
        selectedStart.value.month - 1,
        selectedStart.value.day,
        startHour,
        startMinute
    );

    const endDate = new Date(
        selectedEnd.value.year,
        selectedEnd.value.month - 1,
        selectedEnd.value.day,
        endHour,
        endMinute
    );

    // 3. Tính khoảng cách thời gian bằng Giờ
    const diffHours = (endDate - startDate) / (1000 * 60 * 60);

    // 4. Tính số ngày (Làm tròn lên: Ví dụ 24.5 tiếng -> 2 ngày, 36 tiếng -> 2 ngày)
    const diffDays = Math.ceil(diffHours / 24);

    // Đảm bảo kết quả trả về tối thiểu là 1 ngày
    const rentalDays = Math.max(1, diffDays);

    return `${rentalDays} ngày`;
});

const rentalDurationText = computed(() => activeMode.value === 'day' ? rentalDaysText.value : `${selectedRentalHours.value} giờ`);

// === CÁC HÀM XỬ LÝ DROPDOWN & KÉO CUỘN LÊN ===
function scrollSelectedTime(listRef, value) {
    nextTick(() => {
        const root = listRef.value;
        if (!root) return;
        const activeEl = root.querySelector(`[data-time="${value}"]`);
        if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

function isPastDate(year, month, day) {
    return new Date(year, month - 1, day, 23, 59, 59, 999).getTime() < new Date().getTime();
}

function isTodayObj(obj) {
    const now = new Date();
    return obj && obj.year === now.getFullYear() && obj.month === (now.getMonth() + 1) && obj.day === now.getDate();
}

function isPastDateTime(dateObj, timeStr) {
    if (!dateObj || !timeStr) return false;
    const d = new Date(dateObj.year, dateObj.month - 1, dateObj.day, Number(timeStr.slice(0, 2)), Number(timeStr.slice(3, 5)), 0, 0);
    return d.getTime() < new Date().getTime();
}

function swapTimes() {
    const temp = selectedStartTime.value;
    selectedStartTime.value = selectedEndTime.value;
    selectedEndTime.value = temp;
}

function toggleTimeDropdown(target) {
    if (target === 'start') {
        isStartTimeOpen.value = !isStartTimeOpen.value;
        if (isStartTimeOpen.value) scrollSelectedTime(startTimeListRef, selectedStartTime.value);
    } else {
        isEndTimeOpen.value = !isEndTimeOpen.value;
        if (isEndTimeOpen.value) scrollSelectedTime(endTimeListRef, selectedEndTime.value);
    }
}

function selectStartTimeIfAllowed(t) {
    if (!isPastDateTime(selectedStart.value, t)) {
        selectedStartTime.value = t;
        scrollSelectedTime(startTimeListRef, t);
    }
}

function selectEndTimeIfAllowed(t) {
    if (!isPastDateTime(selectedEnd.value, t)) {
        selectedEndTime.value = t;
        scrollSelectedTime(endTimeListRef, t);
    }
}

function toggleHourDropdown(target) {
    if (target === 'date') {
        isHourDateOpen.value = !isHourDateOpen.value;
        if (isHourDateOpen.value) hourCalendarStart.value = { year: selectedHourDate.value.year, month: selectedHourDate.value.month };
    } else if (target === 'time') {
        isHourTimeOpen.value = !isHourTimeOpen.value;
        if (isHourTimeOpen.value) scrollSelectedTime(hourTimeListRef, selectedHourTime.value);
    } else {
        isHourDurationOpen.value = !isHourDurationOpen.value;
        if (isHourDurationOpen.value) scrollSelectedTime(hourDurationListRef, String(selectedRentalHours.value));
    }
}

function selectHourTimeIfAllowed(t) {
    if (!isPastDateTime(selectedHourDate.value, t)) {
        selectedHourTime.value = t;
        scrollSelectedTime(hourTimeListRef, t);
    }
}

function selectRentalHours(h) {
    selectedRentalHours.value = h;
    scrollSelectedTime(hourDurationListRef, String(h));
}

function isTimeSelectionValid() {
    return activeMode.value === 'day'
        ? (selectedStart.value && selectedEnd.value)
        : (selectedHourDate.value && selectedHourTime.value && selectedRentalHours.value);
}

function getOrCreateModalInstance(el) {
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
}

function getExistingModalInstance(el) {
    const ModalCtor = window.bootstrap?.Modal;
    if (!ModalCtor || !el || typeof ModalCtor.getInstance !== 'function') return null;
    return ModalCtor.getInstance(el);
}

// === GỬI DỮ LIỆU VÀ ĐÓNG MODAL ===
function applyAndClose() {
    if (!isTimeSelectionValid()) return;

    let start_datetime = '';
    let end_datetime = '';

    if (activeMode.value === 'day') {
        start_datetime = `${selectedStart.value.year}-${String(selectedStart.value.month).padStart(2, '0')}-${String(selectedStart.value.day).padStart(2, '0')}T${selectedStartTime.value}`;
        end_datetime = `${selectedEnd.value.year}-${String(selectedEnd.value.month).padStart(2, '0')}-${String(selectedEnd.value.day).padStart(2, '0')}T${selectedEndTime.value}`;
    } else {
        start_datetime = `${selectedHourDate.value.year}-${String(selectedHourDate.value.month).padStart(2, '0')}-${String(selectedHourDate.value.day).padStart(2, '0')}T${selectedHourTime.value}`;
        const sDate = new Date(start_datetime);
        sDate.setHours(sDate.getHours() + selectedRentalHours.value);
        end_datetime = sDate.toISOString().slice(0, 16); // format yyyy-mm-ddThh:mm
    }

    // Bắn sự kiện chứa data ra Component cha
    emit('timeSelected', {
        displayString: summaryText.value,
        start_datetime,
        end_datetime,
        mode: activeMode.value
    });

    // Đóng Modal an toàn
    const el = document.getElementById('timePickerModal');
    if (window.bootstrap && el) {
        if (document.activeElement instanceof HTMLElement && el.contains(document.activeElement)) {
            document.activeElement.blur();
        }

        const modal = getOrCreateModalInstance(el);
        if (modal && typeof modal.hide === 'function') {
            modal.hide();
        }
    }
}

onMounted(() => {
    syncSelectionFromStore();

    const modalEl = document.getElementById('timePickerModal');
    if (!modalEl) return;

    modalShowHandler = () => {
        syncSelectionFromStore();
    };

    modalEl.addEventListener('show.bs.modal', modalShowHandler);
});

onUnmounted(() => {
    const modalEl = document.getElementById('timePickerModal');
    if (!modalEl) return;

    if (modalShowHandler) {
        modalEl.removeEventListener('show.bs.modal', modalShowHandler);
    }

    if (window.bootstrap) {
        const modal = getExistingModalInstance(modalEl);
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