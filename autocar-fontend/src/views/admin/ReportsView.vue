<template>
    <main id="content" class="content pt-5 mt-4 pb-4 bg-light min-vh-100">
        <div class="container-fluid pt-3">
            <div class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="">
                            <h1 class="fs-3 mb-1">Báo Cáo Phân Tích (Reports)</h1>
                            <p class="mb-0 text-muted">Phân tích chuyên sâu về doanh thu, tài chính và hiệu quả kinh doanh</p>
                        </div>
                        <div class="controls">
                            <button class="btn btn-success btn-sm" @click="exportExcel" :disabled="isExporting">
                                <i class="ti ti-file-spreadsheet"></i> 
                                <span v-if="isExporting">Đang xuất file...</span>
                                <span v-else>Xuất Báo Cáo Excel (.csv)</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Các chỉ số tài chính chính -->
            <div class="row g-3 mb-4">
                <div class="col-12 col-sm-6 col-md-3">
                    <div class="card h-100 border-0 shadow-sm rounded-4">
                        <div class="card-body p-4 position-relative">
                            <h6 class="mb-4 text-secondary">Tổng Doanh Thu (GMV)</h6>
                            <h3 class="mb-1 fw-bold">{{ formatCurrency(summary.total_sales) }}</h3>
                            <p class="mb-0 text-success small"><i class="ti ti-arrow-up"> </i>12% so với tháng trước</p>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-sm-6 col-md-3">
                    <div class="card h-100 border-0 shadow-sm rounded-4">
                        <div class="card-body p-4 position-relative">
                            <h6 class="mb-4 text-secondary">Lợi Nhuận (30%)</h6>
                            <h3 class="mb-1 fw-bold text-success">{{ formatCurrency(summary.total_profit) }}</h3>
                            <p class="mb-0 text-success small"><i class="ti ti-arrow-up"> </i> 
                                {{ summary.growth && summary.growth.profit_vs_last_month ? summary.growth.profit_vs_last_month : 0 }}% so với tháng trước
                            </p>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-sm-6 col-md-3">
                    <div class="card h-100 border-0 shadow-sm rounded-4">
                        <div class="card-body p-4 position-relative">
                            <h6 class="mb-4 text-secondary">Tổng Tiền Hoàn Trả</h6>
                            <h3 class="mb-1 fw-bold text-danger">{{ formatCurrency(summary.total_returns) }}</h3>
                            <p class="mb-0 text-muted small">Lịch sử giao dịch hoàn cọc</p>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-sm-6 col-md-3">
                    <div class="card h-100 border-0 shadow-sm rounded-4">
                        <div class="card-body p-4 position-relative">
                            <h6 class="mb-4 text-secondary">Quỹ Bảo Hiểm Rủi Ro</h6>
                            <h3 class="mb-1 fw-bold text-info">{{ formatCurrency(summary.total_insurance_fund) }}</h3>
                            <p class="mb-0 text-muted small">Số dư bảo lãnh rủi ro</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Biểu đồ phân tích tài chính -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card border-0 shadow-sm rounded-4">
                        <div class="card-body p-4">
                            <div class="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3 gap-2">
                                <div>
                                    <h2 class="mb-0 fs-5">Biểu Đồ Doanh Thu & Lợi Nhuận (12 Tháng)</h2>
                                </div>
                                <div class="controls">
                                    <select class="form-select form-select-sm" v-model="selectedYear" @change="loadChartData">
                                        <option :value="new Date().getFullYear()">Năm {{ new Date().getFullYear() }}</option>
                                        <option :value="new Date().getFullYear() - 1">Năm {{ new Date().getFullYear() - 1 }}</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Chart container -->
                            <div id="salesPurchaseChart" style="min-height:350px;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Phân tích hiệu quả kinh doanh xe -->
            <div class="row">
                <!-- Cột Biểu đồ Tròn Thống kê theo Loại xe -->
                <div class="col-12 col-lg-5 mb-4">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-body p-4">
                            <h2 class="mb-3 fs-5">Tỷ Trọng Doanh Thu Theo Dòng Xe</h2>
                            <div id="categoryPieChart" style="min-height:300px;"></div>
                        </div>
                    </div>
                </div>

                <!-- Cột Danh sách chi tiết các xe -->
                <div class="col-12 col-lg-7 mb-4">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h2 class="mb-0 fs-5">Hiệu Suất Phương Tiện</h2>
                                </div>
                                <div class="controls">
                                    <select class="form-select form-select-sm" v-model="activeVehicleTab">
                                        <option value="most_rented">Cho Thuê Nhiều Nhất</option>
                                        <option value="highest_profit">Doanh Thu Cao Nhất</option>
                                        <option value="least_rented">Cho Thuê Ít Nhất</option>
                                    </select>
                                </div>
                            </div>

                            <div class="list-group list-group-flush">
                                <div v-for="(vehicle, index) in currentTabVehicles" :key="vehicle.id || index" class="list-group-item p-3 d-flex align-items-center border-top border-bottom-0 px-0">
                                    <span :class="['badge me-3', activeVehicleTab === 'least_rented' ? 'bg-danger-subtle text-danger border border-danger' : 'bg-primary-subtle text-primary border border-primary']">Top {{ index + 1 }}</span>
                                    <div class="flex-grow-1">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 class="mb-0 fw-semibold fs-6">{{ vehicle.name }} <span class="badge bg-secondary ms-1">{{ vehicle.license_plate }}</span></h6>
                                                <small class="text-secondary">Hoàn thành: <strong>{{ vehicle.total_trips }} chuyến</strong></small>
                                            </div>
                                            <div class="text-end">
                                                <p class="text-muted small mb-0">Lợi nhuận sàn</p>
                                                <strong class="text-success fs-5">{{ formatCurrency(vehicle.total_profit) }}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="!currentTabVehicles || currentTabVehicles.length === 0" class="text-center py-4 text-muted">
                                    Chưa có dữ liệu xe nào
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import ApexCharts from 'apexcharts'
import DashboardService from '@/services/dashboard.service'

const selectedYear = ref(new Date().getFullYear())
let chartInstance = null
let pieChartInstance = null
const isExporting = ref(false)

const activeVehicleTab = ref('most_rented')
const vehicleStats = ref({
    categories: [],
    most_rented: [],
    least_rented: [],
    highest_profit: []
})

const currentTabVehicles = computed(() => {
    return vehicleStats.value[activeVehicleTab.value] || []
})

const summary = ref({
    total_sales: 0,
    total_profit: 0,
    total_returns: 0,
    total_insurance_fund: 0,
    growth: { profit_vs_last_month: 0 },
    top_vehicles: []
})

const formatCurrency = (val) => val ? Number(val).toLocaleString('vi-VN') + 'đ' : '0đ'

const renderPieChart = () => {
    const pieEl = document.querySelector("#categoryPieChart")
    if (pieEl && vehicleStats.value.categories.length > 0) {
        if (pieChartInstance) {
            pieChartInstance.destroy();
        }

        const labels = vehicleStats.value.categories.map(c => c.category_name);
        const series = vehicleStats.value.categories.map(c => Number(c.total_revenue));

        const options = {
            series: series,
            labels: labels,
            chart: { type: 'donut', height: 350 },
            colors: ['#E66239', '#f7a085', '#2b3445', '#4caf50', '#ff9800', '#9c27b0'],
            plotOptions: {
                pie: {
                    donut: { size: '65%' }
                }
            },
            dataLabels: { enabled: false },
            legend: { position: 'bottom' },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return formatCurrency(val)
                    }
                }
            }
        }
        pieChartInstance = new ApexCharts(pieEl, options)
        pieChartInstance.render()
    }
}

const loadChartData = async () => {
    try {
        const resChart = await DashboardService.getChartData(selectedYear.value);
        let chartSeries = [];
        if (resChart.data.success) {
            chartSeries = resChart.data.data.series;
        }

        const salesPurchaseEl = document.querySelector("#salesPurchaseChart")
        if (salesPurchaseEl && chartSeries.length > 0) {
            if (chartInstance) {
                chartInstance.destroy();
            }

            const options = {
                series: chartSeries, 
                colors: ['#f7a085', '#E66239'],
                chart: { type: 'bar', height: 350, width: '100%', parentHeightOffset: 0, toolbar: { show: true } },
                grid: { show: true, borderColor: "#e2e8f0" },
                legend: { show: true, fontFamily: 'Poppins, serif', fontWeight: 500, markers: { size: 5, shape: 'square', offsetX: -2 } },
                plotOptions: { bar: { horizontal: false, columnWidth: '50%', borderRadius: 3, borderRadiusApplication: 'end' } },
                dataLabels: { enabled: false },
                stroke: { show: false, width: 2, colors: ['transparent'] },
                xaxis: {
                    categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                    axisBorder: { show: false },
                    axisTicks: { show: false }
                },
                yaxis: {
                    labels: { formatter: function (e) { return formatCurrency(e) } },
                    title: { text: 'VNĐ' }
                },
                fill: { opacity: 1 },
                tooltip: { y: { formatter: function (val) { return formatCurrency(val) } } }
            }
            chartInstance = new ApexCharts(salesPurchaseEl, options)
            chartInstance.render()
        }
    } catch (err) {
        console.error("Lỗi khi tải biểu đồ", err)
    }
}

const loadVehicleStats = async () => {
    try {
        const res = await DashboardService.getVehicleStats(selectedYear.value);
        if (res.data && res.data.success) {
            vehicleStats.value = res.data.data;
            await nextTick();
            renderPieChart();
        }
    } catch (err) {
        console.error("Lỗi tải thống kê xe:", err);
    }
}

watch(selectedYear, async () => {
    await loadChartData();
    await loadVehicleStats();
})

const exportExcel = async () => {
    try {
        isExporting.value = true;
        const response = await DashboardService.exportReport(selectedYear.value);
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Bao_Cao_Doanh_Thu_${selectedYear.value}.csv`);
        document.body.appendChild(link);
        link.click();
        
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Lỗi khi xuất báo cáo:", err);
        alert("Đã xảy ra lỗi khi tải file báo cáo, vui lòng thử lại!");
    } finally {
        isExporting.value = false;
    }
}

onMounted(async () => {
    try {
        const res = await DashboardService.getSummary()
        if (res.data && res.data.success) {
            const d = res.data.data
            summary.value.total_sales = d.total_sales || 0
            summary.value.total_profit = d.total_profit || 0
            summary.value.total_returns = d.total_returns || 0
            summary.value.total_insurance_fund = d.total_insurance_fund || 0
            summary.value.growth = d.growth || { profit_vs_last_month: 0 }
            
            if (d.top_vehicles && d.top_vehicles.length > 0) {
                summary.value.top_vehicles = d.top_vehicles
            }
        }
    } catch (err) {
        console.error("Lỗi khi tải dữ liệu báo cáo:", err)
    } finally {
        await nextTick()
        await loadChartData()
        await loadVehicleStats()
    }
})
</script>

<style scoped>
@media print {
    .btn, select, .sidebar, header, nav, .controls {
        display: none !important;
    }
    .card {
        border: 1px solid #dee2e6 !important;
        box-shadow: none !important;
        page-break-inside: avoid;
    }
    body, .content {
        background: #fff !important;
        padding: 0 !important;
        margin: 0 !important;
    }
}
</style>
