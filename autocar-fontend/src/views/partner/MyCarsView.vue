<template>
    <div class="container py-5 min-vh-100">
        <!-- Header -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <h2 class="fw-bold mb-0 text-dark">Quản lý cho thuê</h2>
            <div class="d-flex gap-3 align-items-center">
                <router-link to="/partner/add-vehicle" class="btn btn-primary fw-bold rounded-pill px-4 py-2 shadow-sm">
                    <i class="fas fa-plus-circle me-2"></i> Đăng ký xe mới
                </router-link>
            </div>
        </div>

        <!-- TABS ĐIỀU HƯỚNG (Thuần Bootstrap) -->
        <ul class="nav nav-tabs mb-4 border-bottom-0 gap-3">
            <li class="nav-item">
                <a class="nav-link fw-bold border-0 px-1 pb-3"
                    :class="activeTab === 'dashboard' ? 'active border-bottom border-primary border-3 text-primary bg-transparent' : 'text-muted'"
                    @click.prevent="activeTab = 'dashboard'" href="#">
                    <i class="fas fa-chart-pie me-1"></i> Tổng quan
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link fw-bold border-0 px-1 pb-3"
                    :class="activeTab === 'cars' ? 'active border-bottom border-primary border-3 text-primary bg-transparent' : 'text-muted'"
                    @click.prevent="activeTab = 'cars'" href="#">
                    <i class="fas fa-car-side me-1"></i> Danh sách xe
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link fw-bold border-0 px-1 pb-3 position-relative"
                    :class="activeTab === 'requests' ? 'active border-bottom border-primary border-3 text-primary bg-transparent' : 'text-muted'"
                    @click.prevent="activeTab = 'requests'" href="#">
                    <i class="fas fa-clipboard-list me-1"></i> Yêu cầu thuê xe
                    <!-- Chấm đỏ báo hiệu có đơn mới -->
                    <span v-if="requests.length > 0" class="badge bg-danger rounded-pill ms-1 shadow-sm">
                        {{ requests.length }}
                    </span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link fw-bold border-0 px-1 pb-3" 
                    :class="activeTab === 'trips' ? 'active border-bottom border-primary border-3 text-primary bg-transparent' : 'text-muted'"
                    @click.prevent="activeTab = 'trips'" href="#">
                    <i class="fas fa-car-side me-1"></i> Lịch trình chuyến đi
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link fw-bold border-0 px-1 pb-3" 
                    :class="activeTab === 'schedule' ? 'active border-bottom border-primary border-3 text-primary bg-transparent' : 'text-muted'"
                    @click.prevent="activeTab = 'schedule'" href="#">
                    <i class="fas fa-calendar-times me-1"></i> Lịch bận
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link fw-bold border-0 px-1 pb-3" 
                    :class="activeTab === 'history' ? 'active border-bottom border-primary border-3 text-primary bg-transparent' : 'text-muted'"
                    @click.prevent="activeTab = 'history'" href="#">
                    <i class="fas fa-history me-1"></i> Lịch sử chuyến đi
                </a>
            </li>
        </ul>

        <!-- ========================================== -->
        <!-- TAB TỔNG QUAN DOANH THU -->
        <!-- ========================================== -->
        <div v-if="activeTab === 'dashboard'">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="fw-bold mb-0">Thống kê hiệu quả cho thuê</h4>
                <div class="d-flex gap-2">
                    <select class="form-select form-select-sm" v-model="dashboardFilter.month" @change="fetchOwnerStats">
                        <option v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</option>
                    </select>
                    <select class="form-select form-select-sm" v-model="dashboardFilter.year" @change="fetchOwnerStats">
                        <option :value="new Date().getFullYear()">Năm {{ new Date().getFullYear() }}</option>
                        <option :value="new Date().getFullYear() - 1">Năm {{ new Date().getFullYear() - 1 }}</option>
                    </select>
                </div>
            </div>

            <div v-if="loadingStats" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
            </div>
            
            <div v-else>
                <!-- KPI Cards -->
                <div class="row g-4 mb-4">
                    <div class="col-md-4">
                        <div class="card border-0 shadow-sm rounded-4 h-100 bg-primary text-white">
                            <div class="card-body p-4 text-center">
                                <h6 class="opacity-75 mb-2">Tổng Doanh Thu (Hệ thống)</h6>
                                <h3 class="fw-bold mb-0">{{ formatPrice(ownerStats.total_revenue) }}đ</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card border-0 shadow-sm rounded-4 h-100 bg-success text-white">
                            <div class="card-body p-4 text-center">
                                <h6 class="opacity-75 mb-2">Thu Nhập Thực Nhận (70%)</h6>
                                <h3 class="fw-bold mb-0">{{ formatPrice(ownerStats.total_earning) }}đ</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card border-0 shadow-sm rounded-4 h-100 bg-warning text-dark">
                            <div class="card-body p-4 text-center">
                                <h6 class="opacity-75 mb-2">Tổng Chuyến Đi</h6>
                                <h3 class="fw-bold mb-0">{{ ownerStats.total_trips }} <span class="fs-6 fw-normal">chuyến</span></h3>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bảng chi tiết từng xe -->
                <div class="card border-0 shadow-sm rounded-4">
                    <div class="card-body p-4">
                        <h5 class="fw-bold mb-3">Hiệu suất theo từng xe</h5>
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0 text-center">
                                <thead class="bg-light text-muted small text-uppercase">
                                    <tr>
                                        <th class="text-start">Tên Xe</th>
                                        <th>Biển Số</th>
                                        <th>Số Chuyến</th>
                                        <th class="text-end">Doanh Thu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="car in ownerStats.vehicles_stats" :key="car.id">
                                        <td class="text-start fw-bold text-primary">{{ car.vehicle_name }}</td>
                                        <td><span class="badge bg-secondary">{{ car.license_plate }}</span></td>
                                        <td>{{ car.trips_count }}</td>
                                        <td class="text-end fw-bold text-success">{{ formatPrice(car.total_revenue) }}đ</td>
                                    </tr>
                                    <tr v-if="!ownerStats.vehicles_stats || ownerStats.vehicles_stats.length === 0">
                                        <td colspan="4" class="text-center py-4 text-muted">Không có dữ liệu trong khoảng thời gian này.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 1: DANH SÁCH XE CỦA TÔI -->
        <!-- ========================================== -->
        <div v-if="activeTab === 'cars'">
            <div class="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <select class="form-select form-select-sm rounded-pill px-3 border-light shadow-sm text-muted fw-semibold">
                        <option value="all">Tất cả xe</option>
                        <option value="available">Đang hoạt động</option>
                        <option value="pending">Đang chờ duyệt</option>
                    </select>
                </div>
            </div>

            <div v-if="loadingCars" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
            </div>

            <div v-else-if="myCars.length === 0" class="text-center py-5 mt-5">
                <div class="mb-4 position-relative d-inline-block">
                    <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto" style="width: 150px; height: 150px;">
                        <i class="fas fa-car-side fa-4x text-primary opacity-75"></i>
                    </div>
                    <span class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-white border shadow-sm p-2 text-warning"><i class="fas fa-star"></i></span>
                    <span class="position-absolute top-50 start-100 translate-middle badge rounded-pill bg-white border shadow-sm p-2 text-success"><i class="fas fa-check-circle"></i></span>
                </div>
                <h5 class="text-dark fw-bold mt-3">Bạn chưa đăng ký chiếc xe nào</h5>
                <p class="text-muted small">Hãy đăng ký xe ngay để bắt đầu hành trình kiếm tiền cùng AutoCar!</p>
            </div>

            <div v-else class="row g-4">
                <div class="col-md-6 col-lg-4" v-for="car in myCars" :key="car.id">
                    <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                        <div class="position-relative">
                            <img :src="getThumbnail(car)" class="card-img-top object-fit-cover" style="height: 220px;" alt="Car Image" onerror="this.src='https://placehold.co/600x400/eeeeee/999999?text=No+Image'">
                            <div class="position-absolute top-0 end-0 p-3">
                                <span class="badge shadow-sm rounded-pill px-3 py-2" :class="getStatusInfo(car.status).class">
                                    <i :class="getStatusInfo(car.status).icon" class="me-1"></i> {{ getStatusInfo(car.status).text }}
                                </span>
                            </div>
                            <div v-if="(car.is_discount_enabled && car.weekly_discount_percent > 0) || car.discount_percentage > 0" 
                                 class="position-absolute bottom-0 end-0 p-3" style="z-index: 5;">
                                <span class="badge rounded-pill px-3 py-2 fw-bold shadow-sm text-white" 
                                      style="background-color: #ea580c; font-size: 0.88rem;">
                                    Giảm {{ car.weekly_discount_percent || car.discount_percentage }}%
                                </span>
                            </div>
                        </div>
                        <div class="card-body p-4">
                            <h5 class="fw-bold text-dark mb-1 text-truncate">
                                {{ car.car_model?.brand?.name || car.car_model?.brand_name }} {{ car.car_model?.model_name }} {{ car.year }}
                            </h5>
                            <p class="text-muted small mb-3">
                                <span class="border border-secondary border-opacity-25 rounded px-2 py-1 text-dark fw-semibold bg-light">{{ car.license_plate }}</span>
                            </p>
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <span class="text-primary fw-bold fs-5">{{ formatPrice(car.base_price) }}đ<span class="fs-6 text-muted fw-normal">/ngày</span></span>
                                <span class="text-muted small text-truncate" style="max-width: 120px;" title="Địa chỉ">
                                    <i class="fas fa-map-marker-alt me-1 text-danger"></i> {{ car.parking_address?.split(',')[0] || 'Chưa cập nhật' }}
                                </span>
                            </div>
                            <div class="mb-3" v-if="car.status === 'maintenance'">
                                <button @click="restoreMaintenance(car.id)" class="btn btn-primary w-100 fw-bold rounded-pill text-white shadow-sm py-2">
                                    <i class="fas fa-wrench me-1"></i> Khôi phục hoạt động
                                </button>
                            </div>
                            <div class="d-flex gap-2">
                                <router-link :to="`/partner/edit-vehicle/${car.id}`" class="btn btn-outline-primary flex-grow-1 rounded-pill fw-semibold btn-sm shadow-sm py-2">
                                    <i class="fas fa-edit me-1"></i> Cập nhật
                                </router-link>
                                <button @click="goToSchedule(car.id)" class="btn btn-light bg-white border text-muted flex-grow-1 rounded-pill fw-semibold btn-sm shadow-sm py-2">
                                    <i class="fas fa-calendar-alt me-1"></i> Lịch xe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 2: YÊU CẦU ĐẶT XE (CÓ ĐỒNG HỒ ĐẾM NGƯỢC) -->
        <!-- ========================================== -->
        <div v-if="activeTab === 'requests'">
            <div v-if="loadingRequests" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
            </div>

            <div v-else-if="requests.length === 0" class="text-center py-5 mt-4">
                <i class="fas fa-box-open fa-4x text-muted mb-3 opacity-25"></i>
                <h5 class="text-muted">Chưa có yêu cầu đặt xe nào chờ duyệt.</h5>
            </div>

            <div v-else class="row g-4">
                <div class="col-md-6" v-for="req in requests" :key="req.id">
                    <div class="card border-0 shadow-sm rounded-4 p-4 position-relative overflow-hidden h-100 d-flex flex-column">
                        <div class="position-absolute top-0 start-0 w-100" :class="getTimer(req.created_at).expired ? 'bg-secondary' : 'bg-warning'" style="height: 4px;"></div>

                        <div class="d-flex justify-content-between align-items-start mb-3 mt-2">
                            <div>
                                <h5 class="fw-bold text-primary mb-1">{{ req.vehicle?.car_model?.brand_name }} {{ req.vehicle?.car_model?.model_name }}</h5>
                                <span class="badge bg-light text-dark border">{{ req.vehicle?.license_plate }}</span>
                            </div>
                            <div class="text-end">
                                <span v-if="!getTimer(req.created_at).expired" class="badge bg-warning text-dark fs-6 shadow-sm">
                                    <i class="fas fa-stopwatch me-1"></i> Còn {{ getTimer(req.created_at).text }}
                                </span>
                                <span v-else class="badge bg-secondary fs-6">
                                    <i class="fas fa-times-circle me-1"></i> Đã quá hạn 2h
                                </span>
                            </div>
                        </div>

                        <div class="bg-light rounded-3 p-3 mb-4">
                            <p class="mb-2"><i class="fas fa-user-circle text-muted me-2"></i><strong>Khách thuê:</strong> {{ req.renter?.name }}</p>
                            <p class="mb-2"><i class="fas fa-calendar-alt text-muted me-2"></i><strong>Nhận xe:</strong> {{ formatDateTime(req.start_datetime) }}</p>
                            <p class="mb-0"><i class="fas fa-calendar-check text-muted me-2"></i><strong>Trả xe:</strong> {{ formatDateTime(req.end_datetime) }}</p>
                        </div>

                        <div class="d-flex gap-2 mt-auto" v-if="!getTimer(req.created_at).expired">
                            <button class="btn btn-outline-danger flex-grow-1 fw-bold rounded-pill" @click="handleReject(req.id)" :disabled="processing">
                                <i class="fas fa-times me-1"></i> Từ chối
                            </button>
                            <button class="btn btn-primary flex-grow-1 fw-bold rounded-pill shadow-sm" @click="handleApprove(req.id)" :disabled="processing">
                                <i class="fas fa-check me-1"></i> Chấp nhận
                            </button>
                        </div>
                        <div v-else class="alert alert-secondary mb-0 text-center fw-semibold py-2 rounded-pill">
                            Hệ thống đã tự động hủy đơn này.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 3: LỊCH TRÌNH CHUYẾN ĐI (CHỜ GIAO XE) -->
        <!-- ========================================== -->
        <div v-if="activeTab === 'trips'">
            <div v-if="loadingTrips" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
            </div>

            <div v-else-if="activeTrips.length === 0" class="text-center py-5 mt-4">
                <i class="fas fa-calendar-times fa-4x text-muted mb-3 opacity-25"></i>
                <h5 class="text-muted">Chưa có chuyến đi nào sắp tới.</h5>
            </div>

            <div v-else class="row g-4">
                <div class="col-md-6 col-lg-4" v-for="trip in activeTrips" :key="trip.id">
                    <div class="card border-0 shadow-sm rounded-4 h-100 p-3">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="fw-bold mb-0 text-primary">{{ trip.vehicle?.car_model?.brand_name }} {{ trip.vehicle?.car_model?.model_name }}</h6>
                            <span class="badge bg-light text-dark border">{{ trip.vehicle?.license_plate }}</span>
                        </div>

                        <div class="bg-light rounded p-2 mb-3 small">
                            <div><i class="fas fa-user-circle text-muted me-1"></i> Khách: <strong>{{ trip.renter?.name }}</strong> ({{ trip.renter?.phone }})</div>
                            <hr class="my-2 opacity-10">
                            <div class="text-success"><i class="fas fa-calendar-alt me-1"></i> Giao: {{ formatDateTime(trip.start_datetime) }}</div>
                            <div class="text-danger"><i class="fas fa-calendar-check me-1"></i> Nhận: {{ formatDateTime(trip.end_datetime) }}</div>
                        </div>

                        <!-- Trạng thái và Nút hành động -->
                        <div class="mt-auto">
                            <!-- Đang chờ đi (confirmed) -->
                            <div v-if="trip.status === 'confirmed'" class="d-flex gap-2">
                                <button @click="openCancelModal(trip)" data-bs-toggle="modal" data-bs-target="#ownerCancelModal" class="btn btn-outline-danger flex-grow-1 fw-bold rounded-pill shadow-sm">
                                    <i class="fas fa-exclamation-triangle me-1"></i> Báo sự cố
                                </button>
                                <button @click="handleHandover(trip.id)" class="btn btn-warning flex-grow-1 fw-bold rounded-pill text-dark shadow-sm">
                                    <i class="fas fa-key me-1"></i> Bàn giao xe
                                </button>
                            </div>

                            <!-- Đang di chuyển (in_progress) -> Mở khóa nút nhận lại xe & Báo cáo sự cố -->
                            <div v-else-if="trip.status === 'in_progress'" class="d-flex gap-2">
                                <button @click="openIncidentModal(trip)" class="btn btn-outline-danger flex-grow-1 fw-bold rounded-pill shadow-sm">
                                    <i class="fas fa-exclamation-triangle me-1"></i> Báo sự cố
                                </button>
                                <button @click="handleComplete(trip.id)" class="btn btn-success flex-grow-1 fw-bold rounded-pill text-white shadow-sm">
                                    <i class="fas fa-flag-checkered me-1"></i> Nhận lại xe
                                </button>
                            </div>
                            
                            <!-- Đã hoàn thành (completed) -> Báo cáo đã xong (có thể bỏ qua nếu bạn lọc ẩn đơn completed) -->
                            <div v-else-if="trip.status === 'completed'" class="alert alert-secondary py-2 mb-0 text-center fw-semibold rounded-pill small">
                                <i class="fas fa-check-circle me-1 text-success"></i> Đã hoàn thành
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 4: LỊCH BẬN -->
        <!-- ========================================== -->
        <div v-if="activeTab === 'schedule'">
            <div class="row">
                <div class="col-lg-4 mb-4">
                    <div class="card border-0 shadow-sm rounded-4">
                        <div class="card-body p-4">
                            <h5 class="fw-bold mb-4">Chọn xe để quản lý lịch</h5>
                            <select class="form-select mb-4" v-model="selectedScheduleCar" @change="fetchBusyDates">
                                <option value="" disabled>-- Vui lòng chọn xe --</option>
                                <option v-for="car in myCars" :key="car.id" :value="car.id">
                                    {{ car.car_model?.brand_name }} {{ car.car_model?.model_name }} ({{ car.license_plate }})
                                </option>
                            </select>

                            <div v-if="selectedScheduleCar">
                                <h6 class="fw-bold mb-3">Thêm ngày bận mới</h6>
                                <form @submit.prevent="submitBusyDates">
                                    <div class="mb-3">
                                        <label class="form-label small text-muted">Từ ngày</label>
                                        <input type="date" class="form-control" v-model="scheduleForm.startDate" required :min="new Date().toISOString().split('T')[0]">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label small text-muted">Đến ngày</label>
                                        <input type="date" class="form-control" v-model="scheduleForm.endDate" required :min="scheduleForm.startDate || new Date().toISOString().split('T')[0]">
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100 fw-bold rounded-pill" :disabled="processingSchedule">
                                        <span v-if="processingSchedule" class="spinner-border spinner-border-sm me-2"></span>
                                        Thêm lịch bận
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm rounded-4">
                        <div class="card-body p-4">
                            <h5 class="fw-bold mb-4">Danh sách ngày đã khóa</h5>
                            
                            <div v-if="!selectedScheduleCar" class="text-center py-5 text-muted">
                                Vui lòng chọn một xe bên trái để xem lịch.
                            </div>
                            <div v-else-if="loadingSchedule" class="text-center py-5">
                                <div class="spinner-border text-primary"></div>
                            </div>
                            <div v-else-if="busyDates.length === 0" class="text-center py-5 text-muted">
                                Xe này chưa có ngày bận nào.
                            </div>
                            <div v-else class="row g-3">
                                <div class="col-sm-6 col-md-4" v-for="item in busyDates" :key="item.id">
                                    <div class="p-3 border rounded-3 d-flex justify-content-between align-items-center bg-light">
                                        <span class="fw-bold text-dark"><i class="fas fa-calendar-times text-danger me-2"></i> {{ formatDateTimeOnlyDate(item.date) }}</span>
                                        <button class="btn btn-sm btn-outline-danger border-0" @click="removeBusyDate(item.date)" title="Xóa lịch bận">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 5: LỊCH SỬ CHUYẾN ĐI -->
        <!-- ========================================== -->
        <div v-if="activeTab === 'history'">
            <div v-if="loadingTrips" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
            </div>

            <div v-else-if="historyTrips.length === 0" class="text-center py-5 mt-4">
                <i class="fas fa-history fa-4x text-muted mb-3 opacity-25"></i>
                <h5 class="text-muted">Chưa có chuyến đi nào trong lịch sử.</h5>
            </div>

            <div v-else class="row g-4">
                <div class="col-md-6 col-lg-4" v-for="trip in historyTrips" :key="trip.id">
                    <div class="card border-0 shadow-sm rounded-4 h-100 p-3" :class="{'opacity-75': trip.status === 'cancelled' || trip.status === 'rejected'}">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="fw-bold mb-0" :class="trip.status === 'completed' ? 'text-success' : 'text-danger'">{{ trip.vehicle?.car_model?.brand_name }} {{ trip.vehicle?.car_model?.model_name }}</h6>
                            <span class="badge bg-light text-dark border">{{ trip.vehicle?.license_plate }}</span>
                        </div>

                        <div class="bg-light rounded p-2 mb-3 small">
                            <div><i class="fas fa-user-circle text-muted me-1"></i> Khách: <strong>{{ trip.renter?.name }}</strong> ({{ trip.renter?.phone }})</div>
                            <hr class="my-2 opacity-10">
                            <div><i class="far fa-calendar-alt text-muted me-1"></i> Tới: {{ formatDateTime(trip.end_datetime) }}</div>
                        </div>

                        <div class="mb-3 d-flex justify-content-between align-items-center">
                            <span class="text-muted small">Tổng tiền:</span>
                            <span class="fw-bold text-success fs-5">{{ formatPrice(trip.total_amount) }}đ</span>
                        </div>

                        <div class="mt-auto">
                            <span class="badge w-100 py-2 mb-2" :class="trip.status === 'completed' ? 'bg-success' : 'bg-danger'">
                                <i :class="trip.status === 'completed' ? 'fas fa-check-circle' : 'fas fa-times-circle'" class="me-1"></i> 
                                {{ trip.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy' }}
                            </span>

                            <!-- Nút đánh giá cho chuyến đi hoàn thành -->
                            <div v-if="trip.status === 'completed'">
                                <div v-if="getMyReview(trip)" class="card border-0 bg-success bg-opacity-10 rounded-3 p-2 border-success border mt-2">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="fw-bold text-success small">Đánh giá của bạn</span>
                                        <div class="text-warning small">
                                            <i v-for="i in 5" :key="i" class="fas fa-star" :class="i <= getMyReview(trip).rating ? 'text-warning' : 'text-secondary opacity-25'"></i>
                                        </div>
                                    </div>
                                    <p class="mb-0 text-dark small fst-italic mt-1 text-truncate">"{{ getMyReview(trip).comment || 'Không có nhận xét' }}"</p>
                                </div>
                                <button v-else 
                                    @click="openReviewModal(trip)"
                                    class="btn btn-outline-primary w-100 fw-bold btn-sm rounded-pill mt-2">
                                    <i class="fas fa-star me-1"></i> Đánh giá khách thuê
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="ownerCancelModal" tabindex="-1" aria-labelledby="ownerCancelModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title fw-bold text-danger" id="ownerCancelModalLabel">Báo sự cố & Hủy chuyến</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeOwnerCancelModalBtn"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="alert alert-danger mb-3 small">
                            <strong>Lưu ý quan trọng:</strong> Hủy chuyến sau khi đã xác nhận sẽ ảnh hưởng lớn đến khách hàng.
                            <ul class="mb-0 ps-3 mt-1">
                                <li>Vui lòng cung cấp <strong>TỐI THIỂU 2 ẢNH</strong> minh chứng (xe hỏng, sự cố bất khả kháng,...).</li>
                                <li>Nếu cung cấp thiếu ảnh hoặc vô lý, bạn sẽ bị bồi thường <strong>30% giá trị chuyến đi</strong> cho Khách.</li>
                                <li>Xe trong chuyến sẽ tự động chuyển trạng thái Bảo trì chờ Admin xử lý. <strong class="text-danger">Lưu ý: Nếu số dư Ví của bạn bị âm do nợ tiền đền bù, hệ thống sẽ tạm dừng niêm yết toàn bộ xe của bạn cho đến khi bạn nạp tiền hoàn khoản nợ.</strong></li>
                            </ul>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Lý do hủy <span class="text-danger">*</span></label>
                            <textarea v-model="cancelData.reason" class="form-control rounded-3 border-light shadow-sm bg-light" rows="3" placeholder="Nhập lý do chi tiết..." required></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Ảnh minh chứng (ít nhất 2 ảnh) <span class="text-danger">*</span></label>
                            <input type="file" @change="handleFileUpload" class="form-control" multiple accept="image/*">
                            <div v-if="cancelData.files.length > 0" class="mt-2 small text-primary fw-bold">
                                Đã chọn {{ cancelData.files.length }} ảnh
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0 pt-0">
                        <button type="button" class="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Đóng</button>
                        <button type="button" class="btn btn-danger rounded-pill px-4 fw-bold shadow-sm" @click="submitCancel" :disabled="isCanceling || !cancelData.reason">
                            {{ isCanceling ? 'Đang xử lý...' : 'Xác nhận Hủy chuyến' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Modal Báo cáo sự cố sau chuyến / Trực tiếp khi thu hồi xe -->
        <div class="modal fade show" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5); z-index: 1055;" v-if="showIncidentModal">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-bottom-0 pb-0">
                        <h5 class="modal-title fw-bold text-danger"><i class="fas fa-gavel me-2"></i>Báo cáo Sự cố & Khiếu nại Chuyến đi</h5>
                        <button type="button" class="btn-close" @click="closeIncidentModal"></button>
                    </div>
                    <form @submit.prevent="submitIncident">
                        <div class="modal-body py-4">
                            <div class="alert alert-warning border-0 bg-warning bg-opacity-10 d-flex align-items-center mb-4">
                                <i class="fas fa-info-circle fs-4 text-warning me-3"></i>
                                <div class="small text-dark">
                                    Vui lòng cung cấp mô tả và <strong>hình ảnh minh chứng chi tiết</strong> (vết xước, hư hỏng, hóa đơn vệ sinh/phụ phí...). Bộ phận CSKH sẽ thẩm định và áp dụng chế tài bồi thường, bảo vệ đầy đủ quyền lợi tài chính cho bạn!
                                </div>
                            </div>
                            
                            <div class="row g-3">
                                <div class="col-md-9">
                                    <label class="form-label fw-semibold small text-dark">Tiêu đề sự cố / khiếu nại <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control bg-light border-0" v-model="incidentForm.subject" placeholder="VD: Khách làm xước cản trước xe..." required>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label fw-semibold small text-dark">Mã đơn xe</label>
                                    <input type="text" class="form-control bg-light border-0 fw-bold text-primary" :value="'#DX' + incidentForm.booking_id" readonly>
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-semibold small text-dark">Nội dung trình bày & Yêu cầu bồi thường <span class="text-danger">*</span></label>
                                    <textarea class="form-control bg-light border-0" rows="4" v-model="incidentForm.content" placeholder="Mô tả cụ thể sự cố, vị trí xước xát hoặc số tiền phụ phí cần bồi hoàn..." required></textarea>
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-semibold small text-dark">Hình ảnh minh chứng (Tối đa 5 ảnh) <span class="text-danger">*</span></label>
                                    <input type="file" @change="handleIncidentFileSelect" class="form-control bg-light border-0" multiple accept="image/*">
                                    <div class="d-flex flex-wrap gap-2 mt-3" v-if="incidentPreviews.length > 0">
                                        <div v-for="(url, index) in incidentPreviews" :key="index" class="position-relative">
                                            <img :src="url" class="rounded-3 shadow-sm border" width="90" height="90" style="object-fit: cover;">
                                            <button type="button" class="btn btn-danger btn-sm rounded-circle position-absolute top-0 start-100 translate-middle p-0 d-flex align-items-center justify-content-center" style="width: 22px; height: 22px;" @click="removeIncidentImage(index)">
                                                <i class="fas fa-times" style="font-size: 11px;"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer border-top-0 pt-0">
                            <button type="button" class="btn btn-light rounded-pill px-4 fw-bold" @click="closeIncidentModal">Hủy bỏ</button>
                            <button type="submit" class="btn btn-danger rounded-pill px-5 fw-bold shadow-sm" :disabled="submittingIncident">
                                <span v-if="submittingIncident"><span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Đang xử lý...</span>
                                <span v-else><i class="fas fa-paper-plane me-1"></i> Gửi báo cáo sự cố</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </div>

    <!-- Modal Đánh giá khách thuê -->
    <ReviewModal 
        v-if="selectedTripForReview"
        id="ownerReviewModal"
        :bookingId="selectedTripForReview.id"
        title="Đánh giá khách thuê"
        subtitle="Chia sẻ trải nghiệm của bạn về khách hàng này"
        @reviewSubmitted="onReviewSubmitted"
    />

</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & TRÌNH KẾT NỐI (IMPORTS)
// ============================================================================
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import vehicleService from '@/services/vehicle.service';
import bookingService from '@/services/booking.service';
import UserTicketService from '@/services/user-ticket.service';
import ReviewModal from '@/components/common/ReviewModal.vue';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// ============================================================================
// 2. KHỞI TẠO BIẾN TRẠNG THÁI & TÌNH HUỐNG TRANG HỢP NHẤT (STATE MANAGEMENT)
// ============================================================================
// Điều hướng Tab hiện tại (Mặc định hiển thị danh sách xe 'cars' hoặc lấy từ URL params)
const activeTab = ref(route.query.tab || 'cars'); 

// Danh sách xe của đối tác/chủ xe đang cho thuê trên hệ thống
const myCars = ref([]);
const loadingCars = ref(true);

// ============================================================================
// DASHBOARD TỔNG QUAN DOANH THU & HIỆU SUẤT CỦA CHỦ XE
// ============================================================================
const loadingStats = ref(true);
const dashboardFilter = ref({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
});
const ownerStats = ref({
    total_revenue: 0,
    total_earning: 0,
    total_trips: 0,
    vehicles_stats: []
});

const fetchOwnerStats = async () => {
    loadingStats.value = true;
    try {
        const res = await vehicleService.getOwnerStats(dashboardFilter.value.year, dashboardFilter.value.month);
        if (res.data && res.data.success) {
            ownerStats.value = res.data.data;
        }
    } catch (e) {
        console.error("Lỗi lấy dữ liệu thống kê:", e);
    } finally {
        loadingStats.value = false;
    }
};

// Danh sách các yêu cầu thuê xe mới (Đang chờ chủ xe phê duyệt/từ chối)
const requests = ref([]);
const loadingRequests = ref(true);
const processing = ref(false); // Cờ khóa thao tác duyệt/từ chối

// Lịch sử và hành trình các chuyến xe của chủ xe
const ownerTrips = ref([]);
const loadingTrips = ref(false);

// ============================================================================
// 3. TRÌNH GIẢI TRÌNH ĐỘNG HẢO HẠNG - SỰ CỐ & CHUYẾN ĐI (COMPUTED LISTS)
// ============================================================================
// Bộ lọc các chuyến đi đang kích hoạt (Đã xác nhận hoặc Đang trong hành trình thuê)
const activeTrips = computed(() => {
    return ownerTrips.value.filter(t => ['confirmed', 'in_progress'].includes(t.status));
});

// Bộ lọc lịch sử các chuyến đã đóng (Hoàn thành, Đã hủy, Bị từ chối) -> Sắp xếp giảm dần theo ngày kết thúc
const historyTrips = computed(() => {
    return ownerTrips.value.filter(t => ['completed', 'cancelled', 'rejected'].includes(t.status))
                         .sort((a, b) => new Date(b.end_datetime) - new Date(a.end_datetime));
});

// ============================================================================
// 4. HỆ KHUNG NGHIỆP VỤ ĐÁNH GIÁ CHUYẾN ĐI DÀNH CHO CHỦ XE (REVIEW MODAL SYSTEM)
// ============================================================================
const selectedTripForReview = ref(null);

/**
 * Kích hoạt Modal Đánh giá (Review Modal) bằng Bootstrap Vanilla JS
 */
const openReviewModal = (trip) => {
    selectedTripForReview.value = trip;
    setTimeout(() => {
        const modal = new window.bootstrap.Modal(document.getElementById('ownerReviewModal'));
        modal.show();
    }, 100);
};

/**
 * Tra cứu bản nhận xét mà chủ xe đã đánh giá khách thuê trong chuyến này
 */
const getMyReview = (trip) => {
    if (!trip.reviews) return null;
    return trip.reviews.find(r => r.reviewer_id === authStore.user?.id);
};

/**
 * Gia tăng thông tin đánh giá mới vào danh sách bộ nhớ tạm ngay khi hoàn tất gửi review
 */
const onReviewSubmitted = (reviewData) => {
    if (selectedTripForReview.value) {
        if (!selectedTripForReview.value.reviews) {
            selectedTripForReview.value.reviews = [];
        }
        selectedTripForReview.value.reviews.push(reviewData);
    }
};

// ============================================================================
// 5. QUẢN TRỊ LỊCH BẬN & TRÌNH THIẾT LẬP NGÀY KHÓA THUÊ (BUSY DATES MANAGEMENT)
// ============================================================================
const selectedScheduleCar = ref('');
const busyDates = ref([]);
const loadingSchedule = ref(false);
const processingSchedule = ref(false);
const scheduleForm = ref({
    startDate: '',
    endDate: ''
});

/**
 * Chuyển tab sang Giao diện Quản lý lịch bận và nạp ngày bận của xe được chọn
 */
const goToSchedule = (carId) => {
    activeTab.value = 'schedule';
    selectedScheduleCar.value = carId;
    fetchBusyDates();
};

/**
 * Tải danh sách các mốc thời gian bận (đã có khách hoặc chủ tự khóa) từ máy chủ
 */
const fetchBusyDates = async () => {
    if (!selectedScheduleCar.value) return;
    loadingSchedule.value = true;
    try {
        const res = await vehicleService.getBusyDates(selectedScheduleCar.value);
        if (res.data.success) {
            busyDates.value = res.data.data;
        }
    } catch (e) {
        console.error(e);
    } finally {
        loadingSchedule.value = false;
    }
};

/**
 * Đệ trình khai báo lịch bận (thời gian xe không nhận đơn) lên hệ thống
 */
const submitBusyDates = async () => {
    if (!selectedScheduleCar.value) return;
    processingSchedule.value = true;
    try {
        const res = await vehicleService.addBusyDates(selectedScheduleCar.value, scheduleForm.value.startDate, scheduleForm.value.endDate);
        if (res.data.success) {
            alert('Đã thêm lịch bận thành công.');
            scheduleForm.value.startDate = '';
            scheduleForm.value.endDate = '';
            fetchBusyDates();
        }
    } catch (e) {
        alert(e.response?.data?.message || 'Lỗi thêm lịch bận!');
    } finally {
        processingSchedule.value = false;
    }
};

/**
 * Xóa bỏ mốc ngày khóa/bận khỏi hệ thống để xe tiếp tục cho thuê bình thường
 */
const removeBusyDate = async (date) => {
    if (!selectedScheduleCar.value) return;
    if (!confirm(`Bạn chắc chắn muốn mở khóa ngày ${formatDateTimeOnlyDate(date)}?`)) return;
    try {
        const res = await vehicleService.removeBusyDate(selectedScheduleCar.value, date);
        if (res.data.success) {
            fetchBusyDates();
        }
    } catch (e) {
        alert(e.response?.data?.message || 'Lỗi mở khóa!');
    }
};

// ============================================================================
// 6. TRÌNH XỬ LÝ SỰ CỐ & HỦY CHUYẾN TỪ PHÍA CHỦ XE (CANCELLATION & DISPUTE HANDLING)
// ============================================================================
const isCanceling = ref(false);
const selectedTripId = ref(null);
const cancelData = ref({
    reason: '',
    files: []
});

/**
 * Mở hộp thoại (Modal) khai báo hủy chuyến và đính kèm bằng chứng
 */
const openCancelModal = (trip) => {
    selectedTripId.value = trip.id;
    cancelData.value.reason = '';
    cancelData.value.files = [];
};

/**
 * Ghi nhận tập file bằng chứng từ Input File
 */
const handleFileUpload = (event) => {
    cancelData.value.files = Array.from(event.target.files);
};

/**
 * Thực hiện đệ trình yêu cầu Hủy chuyến của Chủ xe lên hệ thống kèm ảnh minh chứng
 */
const submitCancel = async () => {
    if (!selectedTripId.value) return;
    isCanceling.value = true;
    try {
        const formData = new FormData();
        formData.append('cancel_reason', cancelData.value.reason);
        cancelData.value.files.forEach(file => {
            formData.append('evidences[]', file);
        });

        const response = await bookingService.cancelByOwner(selectedTripId.value, formData);
        if (response.data.success) {
            alert(response.data.message || 'Đã báo sự cố và hủy chuyến thành công!');
            document.getElementById('closeOwnerCancelModalBtn').click();
            fetchOwnerTrips(); // Tải lại danh sách chuyến sau khi hủy
        }
    } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xử lý.');
    } finally {
        isCanceling.value = false;
    }
};

// ============================================================================
// 7. BỘ HÀM TIỆN ÍCH HIỂN THỊ (FORMATTERS & RENDering UTILS)
// ============================================================================
const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price);
const formatDateTime = (dateString) => new Date(dateString).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
const formatDateTimeOnlyDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
const getThumbnail = (car) => (car.images && car.images.length > 0) ? car.images[0].image_url : 'https://placehold.co/600x400/eeeeee/999999?text=No+Image';

/**
 * Phối màu sắc và biểu tượng nhãn theo trạng thái kiểm duyệt / hoạt động của xe
 */
const getStatusInfo = (status) => {
    switch (status) {
        case 'available':
            return { text: 'Sẵn sàng thuê', class: 'bg-success text-white', icon: 'fas fa-check-circle' };
        case 'pending':
            return { text: 'Đang chờ duyệt', class: 'bg-warning text-dark', icon: 'fas fa-clock' };
        case 'rented':
            return { text: 'Đang cho thuê', class: 'bg-info text-white', icon: 'fas fa-car-side' };
        case 'maintenance':
            return { text: 'Đang bảo trì', class: 'bg-secondary text-white', icon: 'fas fa-tools' };
        case 'rejected':
            return { text: 'Bị từ chối', class: 'bg-danger text-white', icon: 'fas fa-times-circle' };
        case 'locked':
            return { text: 'Bị khóa', class: 'bg-dark text-white', icon: 'fas fa-lock' };
        default:
            return { text: status, class: 'bg-secondary text-white', icon: 'fas fa-info-circle' };
    }
};

// ============================================================================
// 8. NGHIỆP VỤ BẢO TRÌ & THAY ĐỔI TRẠNG THÁI Ô TÔ (MAINTENANCE ACTIONS)
// ============================================================================
/**
 * Khôi phục xe từ trạng thái Bảo trì/Sự cố về bình thường
 */
const restoreMaintenance = async (id) => {
    if (!confirm('Bạn chắc chắn đã khắc phục xong sự cố và muốn đưa xe trở lại hoạt động?')) return;
    try {
        const res = await vehicleService.restoreFromMaintenance(id);
        if (res.data.success) {
            alert(res.data.message);
            fetchMyCars();
        }
    } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi khôi phục xe.');
    }
};

// ============================================================================
// 9. CÁC ĐẦU NỐI TÍCH HỢP HỆ THỐNG MÁY CHỦ (DATA HYDRATION APIS)
// ============================================================================
/**
 * Tải danh sách xe ô tô thuộc quyền sở hữu của Chủ xe hiện tại
 */
const fetchMyCars = async () => {
    loadingCars.value = true;
    try {
        const response = await vehicleService.getMyVehicles();
        if (response.data && response.data.success) {
            myCars.value = response.data.data;
        }
    } catch (error) {
        console.error('Lỗi tải danh sách xe:', error);
    } finally {
        loadingCars.value = false;
    }
};

/**
 * Tải danh sách yêu cầu đặt xe đang chờ phê duyệt từ Khách hàng
 */
const fetchRequests = async () => {
    loadingRequests.value = true;
    try {
        const res = await bookingService.getOwnerRequests();
        if (res.data && res.data.success) {
            requests.value = res.data.data;
        }
    } catch (e) {
        console.error("Lỗi lấy danh sách yêu cầu:", e);
    } finally {
        loadingRequests.value = false;
    }
};

/**
 * Tải lịch trình toàn bộ chuyến đi thuộc xe của Chủ xe
 */
const fetchOwnerTrips = async () => {
    loadingTrips.value = true;
    try {
        const res = await bookingService.getOwnerBookings();
        if (res.data && res.data.success) {
            ownerTrips.value = res.data.data;
        }
    } catch (e) { console.error("Lỗi tải lịch trình chuyến đi:", e); }
    finally { loadingTrips.value = false; }
};

// ============================================================================
// 10. NGHIỆP VỤ ĐIỀU CHUYỂN TRẠNG THÁI CHI PHÍ & TRÌNH THUÊ XE (BOOKING ACTIONS)
// ============================================================================
/**
 * Nghiệp vụ chủ xe Bàn giao xe (Chụp ảnh & Kiểm tra giấy tờ xong) -> Chuyến bắt đầu
 */
const handleHandover = async (id) => {
    if (!confirm('Xác nhận bạn đã kiểm tra giấy tờ, chụp ảnh xe và giao chìa khóa cho khách?')) return;
    try {
        await bookingService.handoverVehicle(id);
        alert('Bàn giao xe thành công! Chuyến đi đã bắt đầu.');
        fetchOwnerTrips();
    } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
};

// ============================================================================
// 11. ĐỒNG HỒ THỰC ĐẾM NGƯỢC THỜI GIAN CHỜ THANH TOÁN CỌC (COUNTDOWN TIMER)
// ============================================================================
const now = ref(new Date());
let timerInterval = null;

/**
 * Tính thời gian còn lại (2 tiếng) từ lúc tạo đơn để hiển thị đếm ngược cho Chủ xe thấy
 */
const getTimer = (createdAt) => {
    const createdTime = new Date(createdAt).getTime();
    const expireTime = createdTime + 7200000; // 2 giờ trong đơn vị milliseconds
    const currentTime = now.value.getTime();
    const diff = expireTime - currentTime;

    if (diff <= 0) return { expired: true, text: '00:00:00' };

    const h = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
    const m = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, '0');
    const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');

    return { expired: false, text: `${h}:${m}:${s}` };
};

// ============================================================================
// 12. NGHIỆP VỤ DUYỆT VÀ TỪ CHỐI ĐƠN HÀNG THUÊ XE (APPROVE / REJECT LOGIC)
// ============================================================================
/**
 * Chấp nhận yêu cầu thuê xe -> Kích hoạt thời gian 2 giờ cho Khách nạp cọc
 */
const handleApprove = async (id) => {
    if (!confirm('Xác nhận cho thuê chiếc xe này? Khách hàng sẽ có 2 giờ để thanh toán.')) return;
    processing.value = true;
    try {
        await bookingService.approveBooking(id);
        alert('Đã chấp nhận yêu cầu. Đang chờ khách thanh toán.');
        fetchRequests();
    } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra!');
        fetchRequests();
    } finally {
        processing.value = false;
    }
};

/**
 * Từ chối yêu cầu đặt xe kèm theo thông báo lý do đến Khách
 */
const handleReject = async (id) => {
    const reason = prompt('Vui lòng nhập lý do từ chối để báo cho khách hàng:');
    if (!reason || reason.trim() === '') return;

    processing.value = true;
    try {
        await bookingService.rejectBooking(id, { reject_reason: reason });
        alert('Đã từ chối đơn hàng thành công.');
        fetchRequests();
    } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
        processing.value = false;
    }
};

/**
 * Xác nhận đã nhận lại xe từ khách và hoàn tất vòng đời Chuyến đi (Completed)
 */
const handleComplete = async (id) => {
    if (!confirm('Xác nhận bạn đã nhận lại xe an toàn? (Lưu ý: Nếu có phát sinh phụ phí như xước xát, hãy báo cáo sự cố trước khi bấm nút này!)')) return;
    try {
        await bookingService.completeTrip(id);
        alert('Tuyệt vời! Chuyến đi đã hoàn thành.');
        fetchOwnerTrips(); // Load lại danh sách để cập nhật trạng thái đơn
    } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
};

// ============================================================================
// 12.5. NGHIỆP VỤ BÁO CÁO SỰ CỐ SAU CHUYẾN ĐI (INCIDENT REPORTING LOGIC)
// ============================================================================
const showIncidentModal = ref(false);
const submittingIncident = ref(false);
const incidentForm = ref({ booking_id: '', subject: '', content: '' });
const incidentFiles = ref([]);
const incidentPreviews = ref([]);

const openIncidentModal = (trip) => {
    incidentForm.value = {
        booking_id: trip.id,
        subject: `Sự cố chuyến đi #DX${trip.id} (Trầy xước / Phụ phí / Vệ sinh)`,
        content: ''
    };
    incidentFiles.value = [];
    incidentPreviews.value = [];
    showIncidentModal.value = true;
};

const closeIncidentModal = () => {
    showIncidentModal.value = false;
    incidentForm.value = { booking_id: '', subject: '', content: '' };
    incidentFiles.value = [];
    incidentPreviews.value.forEach(url => URL.revokeObjectURL(url));
    incidentPreviews.value = [];
};

const handleIncidentFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (incidentFiles.value.length + files.length > 5) {
        alert('Chỉ được tải lên tối đa 5 ảnh minh chứng');
        return;
    }
    files.forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
            alert(`Ảnh ${file.name} vượt quá giới hạn 5MB`);
            return;
        }
        incidentFiles.value.push(file);
        incidentPreviews.value.push(URL.createObjectURL(file));
    });
};

const removeIncidentImage = (index) => {
    incidentFiles.value.splice(index, 1);
    const url = incidentPreviews.value.splice(index, 1)[0];
    URL.revokeObjectURL(url);
};

const submitIncident = async () => {
    if (!incidentForm.value.subject || !incidentForm.value.content) {
        alert('Vui lòng điền đầy đủ tiêu đề và mô tả sự cố.');
        return;
    }
    submittingIncident.value = true;
    try {
        const formData = new FormData();
        formData.append('subject', incidentForm.value.subject);
        formData.append('content', incidentForm.value.content);
        formData.append('booking_id', incidentForm.value.booking_id);
        incidentFiles.value.forEach(file => {
            formData.append('evidences[]', file);
        });

        const res = await UserTicketService.createTicket(formData);
        if (res.data?.success) {
            alert('Đã gửi báo cáo sự cố & khiếu nại lên Bộ phận CSKH thành công! Đơn khiếu nại của bạn sẽ được Quản trị viên xử lý tại trang Phân Xử Tranh Chấp.');
            closeIncidentModal();
        }
    } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi gửi báo cáo sự cố');
    } finally {
        submittingIncident.value = false;
    }
};

// ============================================================================
// 13. MÓC DẪN VÒNG ĐỜI VUE COMPONENTS (LIFECYCLE HOOKS)
// ============================================================================
onMounted(() => {
    if (route.query.tab) {
        activeTab.value = route.query.tab;
        router.replace({ query: {} }); // Xoá query sau khi đọc
    }

    fetchMyCars();
    fetchRequests();
    fetchOwnerTrips(); // Bổ sung hàm gọi API lịch trình chuyến đi
    fetchOwnerStats(); // Tải báo cáo doanh thu

    // Khởi tạo bộ đếm nhịp giây phục vụ cho bộ đồng hồ Countdown 2 tiếng
    timerInterval = setInterval(() => {
        now.value = new Date();
    }, 1000);
});

onBeforeUnmount(() => {
    // Giải phóng bộ đếm nhịp bộ nhớ khi component bị hủy
    if (timerInterval) clearInterval(timerInterval);
});
</script>
