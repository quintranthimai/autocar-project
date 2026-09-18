<template>
    <div class="vehicle-details-page py-4 bg-light text-dark">
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status"></div>
            <p class="mt-3 text-muted fw-bold">Hệ thống đang tải dữ liệu xe...</p>
        </div>

        <div v-else-if="vehicle" class="container">
            <div class="row g-2 mb-4" v-if="vehicle.images && vehicle.images.length > 0">
                <div class="col-md-8">
                    <img :src="vehicle.images[0]?.image_url" @click="openGallery(0)" role="button"
                        class="img-fluid rounded w-100 h-100 opacity-100 hover:opacity-75 transition"
                        style="object-fit: cover; max-height: 400px; min-height: 400px; cursor: pointer;"
                        alt="Main Car Image">
                </div>
                <div class="col-md-4 d-flex flex-column gap-2">
                    <img v-if="vehicle.images[1]" :src="vehicle.images[1].image_url" @click="openGallery(1)"
                        role="button" class="img-fluid rounded w-100"
                        style="height: 128px; object-fit: cover; cursor: pointer;" alt="Car 1">
                    <img v-if="vehicle.images[2]" :src="vehicle.images[2].image_url" @click="openGallery(2)"
                        role="button" class="img-fluid rounded w-100"
                        style="height: 128px; object-fit: cover; cursor: pointer;" alt="Car 2">
                    <div class="position-relative" v-if="vehicle.images[3]">
                        <img :src="vehicle.images[3].image_url" @click="openGallery(3)" role="button"
                            class="img-fluid rounded w-100" style="height: 128px; object-fit: cover; cursor: pointer;"
                            alt="Car 3">
                        <button @click="openGallery(0)"
                            class="btn btn-light btn-sm position-absolute bottom-0 end-0 m-2 fw-bold shadow-sm">
                            <i class="far fa-images me-1"></i> Xem tất cả ảnh ({{ vehicle.images.length }})
                        </button>
                    </div>
                </div>
            </div>

            <div class="row g-5">
                <div class="col-lg-8">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h1 class="fw-bold mb-2 text-uppercase">
                                {{ vehicle.car_model?.brand_name }} {{ vehicle.car_model?.model_name }} {{ vehicle.year
                                }}
                            </h1>
                            <div class="d-flex align-items-center text-muted small mb-2 gap-2">
                                <span class="text-warning fw-bold"><i class="fas fa-star"></i> {{ vehicle.owner?.avg_rating > 0 ? Number(vehicle.owner.avg_rating).toFixed(1) : '5.0' }}</span>
                                <span>&bull; {{ vehicle.owner?.total_reviews || 0 }} đánh giá</span>
                                <span>&bull; {{ vehicle.total_trips || 0 }} chuyến</span>
                                <span>&bull; {{ vehicle.parking_address }}</span>
                            </div>
                            <span v-if="vehicle.is_mortgage_exempt"
                                class="badge bg-primary bg-opacity-10 text-primary rounded-pill border border-primary fw-normal px-3 py-1">
                                <i class="fas fa-shield-alt me-1"></i> Miễn thế chấp
                            </span>
                        </div>
                        <div class="d-flex gap-2">
                            <button @click="toggleFavorite"
                                :class="['btn rounded-circle d-flex align-items-center justify-content-center', isFavorited ? 'btn-danger text-white border-danger' : 'btn-outline-primary']"
                                :title="isFavorited ? 'Xóa khỏi yêu thích' : 'Lưu xe này'"
                                style="width: 38px; height: 38px;">
                                <i :class="isFavorited ? 'fas fa-heart' : 'far fa-heart'"></i>
                            </button>
                        </div>
                    </div>

                    <h5 class="fw-bold mt-5 mb-4">Đặc điểm</h5>
                    <div class="row text-center mb-5">
                        <div class="col-3 border-end">
                            <i class="fas fa-cogs fs-4 text-muted mb-2"></i>
                            <div class="text-muted small">Truyền động</div>
                            <div class="fw-bold">{{ vehicle.car_model?.transmission?.display_name }}</div>
                        </div>
                        <div class="col-3 border-end">
                            <i class="fas fa-users fs-4 text-muted mb-2"></i>
                            <div class="text-muted small">Số ghế</div>
                            <div class="fw-bold">{{ vehicle.car_model?.seat_count }} chỗ</div>
                        </div>
                        <div class="col-3 border-end">
                            <i class="fas fa-gas-pump fs-4 text-muted mb-2"></i>
                            <div class="text-muted small">Nhiên liệu</div>
                            <div class="fw-bold">{{ vehicle.car_model?.fuel?.display_name }}</div>
                        </div>
                        <div class="col-3">
                            <i class="fas fa-tachometer-alt fs-4 text-muted mb-2"></i>
                            <div class="text-muted small">Tiêu hao</div>
                            <div class="fw-bold">{{ vehicle.car_model?.fuel_consumption }}</div>
                        </div>
                    </div>

                    <hr class="text-muted">

                    <h5 class="fw-bold mt-4 mb-3">Mô tả</h5>
                    <p class="text-muted mb-4 text-uppercase" style="white-space: pre-line;">{{ vehicle.description ||
                        'Chưa có mô tả chi tiết.' }}</p>

                    <h5 class="fw-bold mt-4 mb-3">Các tiện nghi khác</h5>
                    <div class="row row-cols-3 g-3 mb-4 text-muted small">
                        <div class="col" v-for="amenity in vehicle.amenities || []" :key="amenity.id">
                            <i class="fas fa-check-circle text-primary me-2"></i> {{ amenity.display_name }}
                        </div>
                    </div>

                    <div v-if="vehicle.rental_terms">
                        <h5 class="fw-bold mt-4 mb-3">Điều khoản thuê xe</h5>
                        <p class="text-muted mb-4" style="white-space: pre-line;">{{ vehicle.rental_terms }}</p>
                    </div>

                    <h5 class="fw-bold mt-4 mb-3">Chính sách hủy chuyến & Bảo lãnh rủi ro</h5>
                    <div class="bg-white p-4 rounded-4 mb-4 border shadow-sm">
                        <div class="mb-3">
                            <h6 class="fw-bold text-dark d-flex align-items-center mb-2">
                                <i class="fas fa-hand-holding-usd text-primary fs-5 me-2"></i> Chính sách Hủy chuyến (Đền bù 30%)
                            </h6>
                            <ul class="text-muted small ps-4 mb-0">
                                <li class="mb-1"><strong>Hủy sớm (> 24h trước giờ nhận xe):</strong> Khách thuê được <span class="text-success fw-bold">hoàn 100% tiền</span> (bất kể cọc hay trả trọn gói).</li>
                                <li class="mb-1"><strong>Khách hủy trễ (< 24h):</strong> Khách chịu phí vi phạm 30% cọc (nếu thanh toán 100%, hệ thống tự động hoàn lại 70% phần tiền dư).</li>
                                <li class="mb-0"><strong>Chủ xe hủy trái quy định:</strong> Quỹ Bảo Hiểm AutoCar bảo lãnh <span class="text-primary fw-bold">hoàn 100% tiền thuê</span> và <span class="text-danger fw-bold">bồi thường thêm 30% giá trị chuyến</span> cho Khách thuê.</li>
                            </ul>
                        </div>
                        <hr class="text-muted my-3 opacity-25">
                        <div>
                            <h6 class="fw-bold text-dark d-flex align-items-center mb-2">
                                <i class="fas fa-shield-alt text-success fs-5 me-2"></i> Bảo vệ quyền lợi & Trung gian xử lý
                            </h6>
                            <p class="text-muted small mb-0">
                                Mọi thanh toán trên hệ thống đều được AutoCar bảo đảm an toàn trong suốt quá trình thuê xe. Sàn đóng vai trò trung gian độc lập, hỗ trợ giải quyết minh bạch và nhanh chóng mọi vi phạm, sự cố hoặc khiếu nại phát sinh (dựa trên thực tế hình ảnh và biên bản bàn giao xe) nhằm tháo gỡ rủi ro và bảo vệ trọn vẹn quyền lợi cho cả hai bên.
                            </p>
                        </div>
                    </div>

                    <hr class="text-muted">

                    <h5 class="fw-bold mt-4 mb-3">Giấy tờ thuê xe</h5>
                    <div class="bg-white p-3 rounded mb-4 border shadow-sm">
                        <div class="text-muted small mb-2"><i class="fas fa-info-circle me-1 text-primary"></i> Khách
                            hàng cần chuẩn bị giấy tờ sau:</div>
                        <div class="d-flex align-items-center mb-2 fw-bold text-dark">
                            <i class="far fa-id-card fs-4 me-3 text-primary"></i> Giấy phép lái xe (hạng B1 trở lên)
                        </div>
                        <div class="d-flex align-items-center mb-2 fw-bold text-dark">
                            <i class="far fa-address-card fs-4 me-3 text-primary"></i> Căn cước công dân gắn chip / Passport
                        </div>
                    </div>

                    <template v-if="!vehicle.is_mortgage_exempt">
                        <h5 class="fw-bold mt-4 mb-3">Tài sản thế chấp</h5>
                        <div class="bg-white p-3 rounded mb-4 border shadow-sm">
                            <div class="fw-bold text-dark">
                                Yêu cầu thế chấp xe máy hoặc 15 triệu đồng tiền mặt khi nhận xe.
                            </div>
                        </div>
                    </template>

                    <hr class="text-muted">

                    <h4 class="fw-bold mt-5 mb-4">Chủ xe</h4>
                    <div class="d-flex flex-column mb-4">
                        <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                            <router-link :to="{ name: 'public-profile', params: { id: vehicle.owner?.id } }" class="d-flex align-items-center text-decoration-none text-dark">
                                <img :src="vehicle.owner?.avatar || '/img/team-1.jpg'"
                                    class="rounded-circle me-3 border border-2 p-1 border-primary bg-white"
                                    style="width: 70px; height: 70px; object-fit: cover;" alt="Owner">
                                <div>
                                    <h4 class="fw-bold mb-1 text-uppercase">{{ vehicle.owner?.name }}</h4>
                                    <div class="text-muted small d-flex align-items-center gap-2 flex-wrap">
                                        <span v-if="vehicle.owner && vehicle.owner.avg_rating > 0" class="text-warning fw-bold"><i class="fas fa-star"></i> {{ Number(vehicle.owner.avg_rating).toFixed(1) }}</span>
                                        <span v-else class="badge bg-success bg-opacity-10 text-success fw-bold border border-success border-opacity-25 px-2 py-1"><i class="fas fa-seedling me-1"></i>Chủ xe mới</span>
                                        <i class="fas fa-circle text-muted" style="font-size: 4px;"></i> 
                                        <span class="text-success"><i class="fas fa-car-side"></i> {{ vehicle.owner?.total_trips || 0 }} chuyến (toàn sàn)</span>
                                    </div>
                                </div>
                            </router-link>
                        </div>
                        
                        <div v-if="vehicle.owner && vehicle.owner.avg_rating >= 4.8 && vehicle.owner.total_reviews > 0" class="bg-primary bg-opacity-10 rounded-3 p-3 text-primary-emphasis d-flex gap-2">
                            <span>👑</span>
                            <span class="small fw-medium">Chủ xe 5★ uy tín có thời gian phản hồi nhanh chóng, tỉ lệ đồng ý cao & dịch vụ nhận được nhiều đánh giá tốt trên toàn hệ thống.</span>
                        </div>
                    </div>

                    <div class="mb-4">
                        <div class="d-flex align-items-center gap-2 fw-bold mb-3 fs-5">
                            <template v-if="vehicle.total_reviews > 0 && vehicle.avg_rating > 0">
                                <i class="fas fa-star text-warning"></i>
                                <span>{{ Number(vehicle.avg_rating).toFixed(1) }}</span>
                                <i class="fas fa-circle text-muted" style="font-size: 4px;"></i>
                                <span>{{ vehicle.total_reviews }} đánh giá (riêng xe này)</span>
                            </template>
                            <template v-else>
                                <i class="far fa-comment-dots text-muted"></i>
                                <span class="text-muted fs-6">Chưa có đánh giá nào cho chiếc xe này</span>
                            </template>
                        </div>

                        <div v-if="vehicle.reviews && vehicle.reviews.length > 0" class="row g-3">
                            <div v-for="(review, idx) in vehicle.reviews.slice(0, 2)" :key="idx" class="col-md-6">
                                <div class="card h-100 border rounded-4 shadow-sm">
                                    <div class="card-body p-3">
                                        <div class="d-flex justify-content-between align-items-start mb-2">
                                            <router-link :to="{ name: 'public-profile', params: { id: review.reviewer?.id } }" class="d-flex align-items-center gap-2 text-decoration-none">
                                                <img :src="review.reviewer?.avatar || '/img/team-1.jpg'" class="rounded-circle object-fit-cover shadow-sm border" style="width: 45px; height: 45px;">
                                                <div>
                                                    <div class="fw-bold text-dark hover-primary">{{ review.reviewer?.name || 'Khách hàng' }}</div>
                                                    <div class="text-warning small mt-1">
                                                        <i v-for="n in 5" :key="n" class="fa-star" :class="n <= review.rating ? 'fas' : 'far text-muted'"></i>
                                                    </div>
                                                </div>
                                            </router-link>
                                            <div class="text-muted small">{{ new Date(review.created_at).toLocaleDateString('vi-VN') }}</div>
                                        </div>
                                        <p v-if="review.comment" class="small mb-0 text-muted mt-2" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                                            {{ review.comment }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="text-end mt-4" v-if="vehicle.reviews && vehicle.reviews.length > 2">
                            <button class="btn btn-outline-success fw-bold px-4 rounded-3" data-bs-toggle="modal" data-bs-target="#reviewsModal">Xem thêm</button>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="sticky-top" style="top: 100px; z-index: 10;">
                        <div class="card border-0 shadow-sm mb-3 bg-white rounded-4 overflow-hidden">
                            <div class="card-body p-4">
                                <div class="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3 flex-wrap gap-2">
                                    <div class="d-flex align-items-baseline">
                                        <span v-if="getOriginalPrice(vehicle)" 
                                              class="text-muted text-decoration-line-through me-2 fs-5">
                                            {{ formatPriceShort(getOriginalPrice(vehicle)) }}
                                        </span>
                                        <h2 class="fw-bold text-primary mb-0 me-1">
                                            {{ formatPriceShort(getFinalPrice(vehicle)) }}
                                        </h2>
                                        <span class="text-muted fs-6">/ngày</span>
                                    </div>
                                    <span v-if="getOriginalPrice(vehicle)" 
                                          class="badge rounded-pill text-white shadow-sm px-3 py-2" style="background-color: #ea580c; font-size: 0.85rem;">
                                        Giảm {{ vehicle.weekly_discount_percent || vehicle.discount_percentage }}%
                                    </span>
                                </div>

                                <div class="row g-2 mb-3 cursor-pointer" @click="openTimeModal" role="button"
                                    title="Bấm để thay đổi lịch">
                                    <div class="col-6">
                                        <div
                                            class="border rounded p-2 text-center bg-light bg-opacity-50 hover:border-primary transition">
                                            <div class="text-muted small">Nhận xe</div>
                                            <div class="fw-bold text-dark" style="font-size: 0.85rem;">{{ displayStart
                                            }}</div>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div
                                            class="border rounded p-2 text-center bg-light bg-opacity-50 hover:border-primary transition">
                                            <div class="text-muted small">Trả xe</div>
                                            <div class="fw-bold text-dark" style="font-size: 0.85rem;">{{ displayEnd }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h6 class="fw-bold mb-2 small text-primary">Địa điểm giao nhận xe</h6>
                                
                                <div class="border rounded p-3 mb-2 cursor-pointer transition"
                                    :class="deliveryType === 'pickup' ? 'border-primary bg-primary bg-opacity-10' : 'bg-white'"
                                    @click="deliveryType = 'pickup'">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <span class="fw-bold" :class="deliveryType === 'pickup' ? 'text-primary' : 'text-dark'">
                                            <i :class="deliveryType === 'pickup' ? 'far fa-dot-circle' : 'far fa-circle'" class="me-1"></i> Tôi tự đến lấy xe
                                        </span>
                                        <span class="text-primary small">Miễn phí</span>
                                    </div>
                                    <div class="text-muted small ms-4">{{ vehicle.parking_address }}</div>
                                </div>
                                
                                <div v-if="vehicle.is_delivery_supported" 
                                    class="border rounded p-3 mb-2 cursor-pointer transition"
                                    :class="deliveryType === 'delivery' ? 'border-primary bg-primary bg-opacity-10' : 'bg-white'"
                                    @click="deliveryType = 'delivery'">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <span class="fw-bold" :class="deliveryType === 'delivery' ? 'text-primary' : 'text-dark'">
                                            <i :class="deliveryType === 'delivery' ? 'far fa-dot-circle' : 'far fa-circle'" class="me-1"></i> Giao xe tận nơi
                                        </span>
                                        <span class="text-primary small">{{ formatCurrency(vehicle.delivery_fee_per_km) }}/km</span>
                                    </div>
                                    <div class="text-muted small ms-4 mb-2">Giao xe miễn phí trong bán kính {{ vehicle.free_delivery_radius_km || 0 }}km. Tối đa {{ vehicle.delivery_radius_km }}km.</div>
                                    <div v-if="deliveryType === 'delivery'" class="ms-4 mt-2" @click.stop="openDeliveryLocationModal">
                                        <input type="text" class="form-control form-control-sm bg-white cursor-pointer" v-model="deliveryAddress" placeholder="Nhập địa chỉ giao xe" readonly style="cursor: pointer;">
                                    </div>
                                    <div v-if="deliveryType === 'delivery' && deliveryError" class="ms-4 mt-2 text-danger small fw-bold">
                                        {{ deliveryError }}
                                    </div>
                                    <div v-if="deliveryType === 'delivery' && !deliveryError && deliveryAddress" class="ms-4 mt-2 text-success small">
                                        Khoảng cách: {{ deliveryDistance }} km. Phí giao nhận: {{ formatCurrency(deliveryFee) }}.
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label small fw-bold text-muted">Phương thức thanh toán</label>
                                    <select class="form-select bg-light border-0 fw-medium text-dark"
                                        v-model="paymentOption">
                                        <option value="deposit">Chỉ đặt cọc trước 30%</option>
                                        <option value="full">Thanh toán trọn gói 100%</option>
                                    </select>
                                </div>

                                <div v-if="calculating" class="text-center py-3">
                                    <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                                    <span class="ms-2 small text-muted">Đang cập nhật chi phí...</span>
                                </div>

                                <div v-else-if="priceDetails" class="border-top pt-3">
                                    <div class="d-flex justify-content-between text-muted small mb-2">
                                        <span>Phí thuê xe ({{ priceDetails.is_hourly ? priceDetails.rental_duration +
                                            'giờ' : priceDetails.rental_duration + ' ngày' }})</span>
                                        <span class="text-dark fw-bold">{{ formatCurrency(priceDetails.total_rental_fee)
                                        }}</span>
                                    </div>
                                    <div class="d-flex justify-content-between text-muted small mb-3">
                                        <span>Bảo hiểm chuyến đi <i class="far fa-question-circle"></i></span>
                                        <span class="text-dark fw-bold">{{
                                            formatCurrency(priceDetails.total_insurance_fee) }}</span>
                                    </div>

                                    <hr class="text-muted my-2">

                                    <div v-if="deliveryType === 'delivery' && !deliveryError && deliveryAddress && deliveryFee > 0" class="d-flex justify-content-between text-muted small mb-2">
                                    <span>Phí giao nhận xe tận nơi</span>
                                    <span class="text-dark fw-bold">{{ formatCurrency(deliveryFee) }}</span>
                                </div>

                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <span class="fw-bold">Tổng chi phí</span>
                                    <h4 class="fw-bold mb-0 text-primary">{{
                                        formatCurrency((priceDetails.total_amount || 0) + (deliveryType === 'delivery' && !deliveryError && deliveryAddress ? deliveryFee : 0)) }}</h4>
                                </div>

                                <div class="bg-light p-3 rounded-3 mb-4">
                                    <div class="d-flex justify-content-between text-success small fw-bold mb-1">
                                        <span>Thanh toán ngay:</span>
                                        <span>{{ formatCurrency(((priceDetails.total_amount || 0) + (deliveryType === 'delivery' && !deliveryError && deliveryAddress ? deliveryFee : 0)) * (paymentOption === 'deposit' ? 0.3 : 1)) }}</span>
                                    </div>
                                    <div v-if="paymentOption === 'deposit'"
                                        class="d-flex justify-content-between text-muted small">
                                        <span>Còn lại trả khi nhận xe:</span>
                                        <span>{{ formatCurrency(((priceDetails.total_amount || 0) + (deliveryType === 'delivery' && !deliveryError && deliveryAddress ? deliveryFee : 0)) * 0.7) }}</span>
                                    </div>
                                </div>

                                <button @click="handleProceedToCheckout"
                                    :disabled="calculating || !priceDetails || (deliveryType === 'delivery' && (deliveryError || !deliveryAddress))"
                                    class="btn btn-primary w-100 py-3 fw-bold fs-5 rounded-3">
                                    GỬI YÊU CẦU THUÊ
                                </button>
                                </div>

                                <div v-else class="alert alert-danger p-2 text-center small mb-0 mt-3">
                                    {{ errorMessage || 'Thời gian chọn không hợp lệ hoặc xe bận lịch!' }}
                                </div>
                            </div>
                        </div>

                        <div class="bg-white p-4 rounded-4 border shadow-sm mb-4">
                            <h5 class="fw-bold mb-4 text-primary" style="font-size: 1.1rem;">Phụ phí có thể phát sinh</h5>

                            <!-- Phí quá giờ -->
                            <div class="mb-4" v-if="vehicle.overtime_fee">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="fw-bold text-dark fs-6">Phí quá giờ</span>
                                    <span class="fw-bold text-primary">{{ formatCurrency(vehicle.overtime_fee) }} /giờ</span>
                                </div>
                                <div class="text-muted small" style="line-height: 1.5;">
                                    Phụ phí phát sinh nếu hoàn trả xe trễ giờ. Trường hợp trễ quá 5 giờ, phụ phí thêm 1 ngày thuê
                                </div>
                            </div>

                            <!-- Phí vượt giới hạn -->
                            <div class="mb-4" v-if="vehicle.is_mileage_limit_enabled">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="fw-bold text-dark fs-6">Phí vượt giới hạn</span>
                                    <span class="fw-bold text-primary">{{ formatCurrency(vehicle.extra_fee_per_km) }} /km</span>
                                </div>
                                <div class="text-muted small" style="line-height: 1.5;">
                                    Phụ phí phát sinh nếu lộ trình di chuyển vượt quá {{ vehicle.mileage_limit_per_day }}km khi thuê xe 1 ngày
                                </div>
                            </div>

                            <!-- Các phụ phí khác (vệ sinh, khử mùi) -->
                            <div class="mb-4" v-for="fee in vehicle.surcharges" :key="fee.id">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="fw-bold text-dark fs-6">{{ fee.surcharge_type === 'cleaning' ? 'Phí vệ sinh' : (fee.surcharge_type === 'deodorize' || fee.surcharge_type === 'deodorizing' ? 'Phí khử mùi' : (fee.surcharge_type === 'over_limit' ? 'Phí vượt giới hạn' : (fee.surcharge_type === 'late_return' ? 'Phí trễ hẹn' : fee.surcharge_type))) }}</span>
                                    <span class="fw-bold text-primary">{{ formatCurrency(fee.price) }}</span>
                                </div>
                                <div class="text-muted small" style="line-height: 1.5;">
                                    {{ fee.surcharge_type === 'cleaning' ? 'Phụ phí phát sinh khi xe hoàn trả không đảm bảo vệ sinh (nhiều vết bẩn, bùn cát, sình lầy...)' : (fee.surcharge_type === 'deodorize' ? 'Phụ phí phát sinh khi xe hoàn trả bị ám mùi khó chịu (mùi thuốc lá, thực phẩm nặng mùi...)' : fee.description) }}
                                </div>
                            </div>

                            <!-- Phí nhiên liệu / sạc pin -->
                            <div class="mb-0" v-if="vehicle.fuel_fee_policy">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="fw-bold text-dark fs-6">Phí nhiên liệu / sạc pin</span>
                                    <span class="fw-bold text-primary">Theo thực tế</span>
                                </div>
                                <div class="text-muted small" style="line-height: 1.5;">
                                    Khách thuê thanh toán phí nhiên liệu/sạc pin theo thực tế hao hụt và phí sạc quá giờ (nếu có).
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="imageGalleryModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content bg-black rounded-0 border-0">
                    <div class="position-absolute top-0 start-0 m-4 text-white fw-bold d-flex align-items-center gap-3"
                        style="z-index: 1055;">
                        <span class="fs-5">{{ currentImageIndex + 1 }} / {{ vehicle?.images?.length || 0 }}</span>
                    </div>

                    <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-4"
                        data-bs-dismiss="modal" style="z-index: 1055; width: 20px; height: 20px;"></button>

                    <div
                        class="modal-body d-flex align-items-center justify-content-center p-0 position-relative h-100 w-100">
                        <button @click="prevImage"
                            class="btn btn-dark text-white rounded-circle position-absolute start-0 ms-4 shadow border-light border-opacity-25"
                            style="width: 50px; height: 50px; z-index: 1055; background-color: rgba(0,0,0,0.5);">
                            <i class="fas fa-chevron-left fs-5"></i>
                        </button>

                        <img v-if="vehicle?.images?.length" :src="vehicle.images[currentImageIndex]?.image_url"
                            class="img-fluid" style="max-height: 90vh; max-width: 90vw; object-fit: contain;"
                            alt="Gallery">

                        <button @click="nextImage"
                            class="btn btn-dark text-white rounded-circle position-absolute end-0 me-4 shadow border-light border-opacity-25"
                            style="width: 50px; height: 50px; z-index: 1055; background-color: rgba(0,0,0,0.5);">
                            <i class="fas fa-chevron-right fs-5"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <TimePickerModal 
            :busy-dates="vehicle?.calendars?.map(c => c.date) || []"
            :booked-dates="vehicle?.booked_dates || []"
            @timeSelected="handleTimeSelect" 
        />
        <LocationModal id="deliveryLocationModal" title="Chọn địa chỉ giao xe" :showAirports="false" @locationSelected="handleDeliveryLocationSelected" />
        
        <!-- Modal Tất cả đánh giá -->
        <div class="modal fade" id="reviewsModal" tabindex="-1" aria-labelledby="reviewsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div class="modal-content border-0 shadow rounded-4">
                    <div class="modal-header border-bottom-0 pb-0">
                        <h5 class="modal-title fw-bold" id="reviewsModalLabel">
                            Tất cả đánh giá ({{ vehicle?.total_reviews || 0 }})
                        </h5>
                        <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body pt-3 pb-4 px-4">
                        <div class="d-flex flex-column gap-3">
                            <div v-for="(review, idx) in (vehicle?.reviews || [])" :key="idx" class="card border rounded-3 shadow-sm">
                                <div class="card-body p-3">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <router-link :to="{ name: 'public-profile', params: { id: review.reviewer?.id } }" data-bs-dismiss="modal" class="d-flex align-items-center gap-2 text-decoration-none">
                                            <img :src="review.reviewer?.avatar || '/img/team-1.jpg'" class="rounded-circle object-fit-cover shadow-sm border" style="width: 45px; height: 45px;">
                                            <div>
                                                <div class="fw-bold text-dark hover-primary">{{ review.reviewer?.name || 'Khách hàng' }}</div>
                                                <div class="text-warning small mt-1">
                                                    <i v-for="n in 5" :key="n" class="fa-star" :class="n <= review.rating ? 'fas' : 'far text-muted'"></i>
                                                </div>
                                            </div>
                                        </router-link>
                                        <div class="text-muted small">{{ new Date(review.created_at).toLocaleDateString('vi-VN') }}</div>
                                    </div>
                                    <p v-if="review.comment" class="small mb-0 text-dark mt-2">
                                        {{ review.comment }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & CẤU HÌNH KHO VỰ (IMPORTS & PINIA STORES)
// ============================================================================
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TimePickerModal from '@/components/common/TimePickerModal.vue';
import LocationModal from '@/components/common/LocationModal.vue';
import bookingService from '@/services/booking.service';
import vehicleService from '@/services/vehicle.service';
import { useRentalTimeStore } from '@/stores/rentalTime.store';
import { useFavoriteStore } from '@/stores/favorite.store';

const route = useRoute();
const router = useRouter();
const vehicleId = route.params.id; // Truy xuất ID xe từ tham số URL
const rentalTimeStore = useRentalTimeStore();
const favoriteStore = useFavoriteStore();

// ============================================================================
// 2. QUẢN LÝ TRẠNG THÁI YÊU THÍCH XE (FAVORITE SYSTEM MANAGEMENT)
// ============================================================================
const isFavorited = computed(() => favoriteStore.isFavorited(vehicleId));
const toggleFavorite = () => {
    favoriteStore.toggleFavorite(vehicleId);
};

// ============================================================================
// 3. KHỞI TẠO BIẾN TRẠNG THÁI XE, CHI PHÍ VÀ GIAO NHẬN TẬN NƠI (STATE)
// ============================================================================
const vehicle = ref(null);         // Lưu trữ hồ sơ chi tiết kỹ thuật và mô tả xe
const loading = ref(true);         // Cờ báo hiệu trạng thái đang tải dữ liệu
const calculating = ref(false);    // Cờ báo hiệu khi gọi API tính tiền thuê
const priceDetails = ref(null);    // Gói dữ liệu tính phí hoàn chỉnh từ Backend
const errorMessage = ref('');      // Thông báo lỗi nếu lịch thuê bị trùng/trống
const paymentOption = ref('deposit'); // Phương thức cọc (mặc định đặt cọc trước 30%)

// Cụm biến quản lý nghiệp vụ Giao nhận xe tận nơi
const deliveryType = ref('pickup'); // Chế độ: tự đến lấy ('pickup') hoặc giao tận nơi ('delivery')
const deliveryAddress = ref('');    // Địa chỉ giao nhận do người dùng nhập
const deliveryLatitude = ref(null); // Vị trí GPS vĩ độ
const deliveryLongitude = ref(null);// Vị trí GPS kinh độ
const deliveryDistance = ref(0);    // Khoảng cách từ xe đến vị trí giao (Km)
const deliveryFee = ref(0);         // Phí tính thêm dựa theo số Km vượt bán kính miễn phí
const deliveryError = ref('');      // Cảnh báo nếu khoảng cách vượt bán kính phục vụ tối đa

// ============================================================================
// 4. HỆ THỐNG TRÌNH CHIẾU CHI TIẾT ẢNH XE (FULLSCREEN IMAGE GALLERY)
// ============================================================================
const currentImageIndex = ref(0);

/**
 * Mở hộp thoại (Modal) toàn màn hình hiển thị album ảnh thực tế của xe
 * @param {number} index - Vị trí hình ảnh trong mảng
 */
const openGallery = (index = 0) => {
    if (!vehicle.value?.images?.length) return;
    currentImageIndex.value = index;
    const modalEl = document.getElementById('imageGalleryModal');
    if (window.bootstrap && modalEl) {
        let modal = window.bootstrap.Modal.getInstance(modalEl);
        if (!modal) modal = new window.bootstrap.Modal(modalEl);
        modal.show();
    }
};

const nextImage = () => {
    if (!vehicle.value?.images?.length) return;
    currentImageIndex.value = (currentImageIndex.value + 1) % vehicle.value.images.length;
};

const prevImage = () => {
    if (!vehicle.value?.images?.length) return;
    currentImageIndex.value = (currentImageIndex.value - 1 + vehicle.value.images.length) % vehicle.value.images.length;
};

// ============================================================================
// 5. BỘ HÀM QUẢN LÝ MODAL & TÍNH TOÁN KHOẢNG CÁCH ĐỊA LÝ (MODAL & GEO UTILS)
// ============================================================================

/**
 * Dọn dẹp trệt để lớp phủ tối (Backdrop) và trạng thái treo của Modal Bootstrap
 */
const cleanupModalArtifacts = () => {
    document.querySelectorAll('.modal-backdrop').forEach((b) => b.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const openTimeModal = () => {
    const modalEl = document.getElementById('timePickerModal');
    if (modalEl && window.bootstrap) {
        let modal = window.bootstrap.Modal.getInstance(modalEl);
        if (!modal) {
            modal = new window.bootstrap.Modal(modalEl);
        }
        modal.show();
    }
};

const openDeliveryLocationModal = () => {
    const modalEl = document.getElementById('deliveryLocationModal');
    if (modalEl && window.bootstrap) {
        let modal = window.bootstrap.Modal.getInstance(modalEl);
        if (!modal) {
            modal = new window.bootstrap.Modal(modalEl);
        }
        modal.show();
    }
};

/**
 * Công thức Haversine tính toán khoảng cách đường chim bay giữa 2 tọa độ GPS (Km)
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; // Bán kính trái đất (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Xử lý sau khi người dùng chọn vị trí giao xe -> Thẩm định bán kính & tính phí giao xe
 */
const handleDeliveryLocationSelected = (location) => {
    deliveryAddress.value = location.name;
    deliveryLatitude.value = location.lat;
    deliveryLongitude.value = location.lng;
    
    // Tính toán khoảng cách thực từ điểm đỗ xe tới vị trí khách chọn
    const dist = calculateDistance(
        vehicle.value.latitude, 
        vehicle.value.longitude, 
        location.lat, 
        location.lng
    );
    
    deliveryDistance.value = Math.round(dist * 10) / 10;
    
    // Kiểm tra giới hạn phục vụ giao xe của Chủ xe
    if (deliveryDistance.value > vehicle.value.delivery_radius_km) {
        deliveryError.value = `Địa điểm giao nhận quá xa so với vị trí của xe (${deliveryDistance.value} km). Bạn vui lòng chọn địa điểm giao nhận gần hơn hoặc có thể chọn thuê xe khác.`;
        deliveryFee.value = 0;
    } else {
        deliveryError.value = '';
        let chargeableDist = deliveryDistance.value;
        // Trừ đi bán kính miễn phí (nếu có cấu hình)
        if (vehicle.value.free_delivery_radius_km > 0) {
            chargeableDist = Math.max(0, deliveryDistance.value - vehicle.value.free_delivery_radius_km);
        }
        deliveryFee.value = Math.round(chargeableDist * vehicle.value.delivery_fee_per_km);
    }
};

const handleTimeSelect = (data) => {
    rentalTimeStore.setSelection(data);
    calculatePrice(); // Gọi tính lại chi phí ngay sau khi đổi ngày giờ
};

// ============================================================================
// 6. BỘ HÀM HIỂN THỊ ĐỊNH DẠNG HÓA & TRUY XUẤT DỮ LIỆU TỪ API (API & FORMATTERS)
// ============================================================================
const displayStart = computed(() => {
    if (!rentalTimeStore.startDatetime) return 'Chọn ngày nhận';
    const d = new Date(rentalTimeStore.startDatetime);
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} ${days[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
});

const displayEnd = computed(() => {
    if (!rentalTimeStore.endDatetime) return 'Chọn ngày trả';
    const d = new Date(rentalTimeStore.endDatetime);
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} ${days[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
});

/**
 * Tải chi tiết thông số kỹ thuật, giá thuê, trang bị và lịch bận của Xe từ Backend
 */
const loadVehicleDetails = async () => {
    loading.value = true;
    try {
        const res = await vehicleService.getById(vehicleId);
        if (res.data?.success) {
            vehicle.value = res.data.data.vehicle_info;
            await calculatePrice();
        }
    } catch (error) {
        console.error('Lỗi tải chi tiết xe:', error);
    } finally {
        loading.value = false;
    }
};

/**
 * Gửi yêu cầu tính toán báo giá chi tiết tới BookingService (bao gồm đơn giá, chiết khấu, tiền cọc 30%)
 */
const calculatePrice = async () => {
    if (!vehicle.value) return;
    if (!rentalTimeStore.startDatetime || !rentalTimeStore.endDatetime) {
        priceDetails.value = null;
        return;
    }

    calculating.value = true;
    try {
        const res = await bookingService.calculatePrice({
            vehicle_id: vehicleId,
            start_datetime: rentalTimeStore.startDatetime,
            end_datetime: rentalTimeStore.endDatetime,
            payment_option: paymentOption.value,
        });
        priceDetails.value = res.data?.success ? res.data.data : null;
        errorMessage.value = '';
    } catch (error) {
        priceDetails.value = null;
        errorMessage.value = error.response?.data?.message || 'Thời gian chọn không hợp lệ hoặc xe bận lịch!';
    } finally {
        calculating.value = false;
    }
};

// Tự động tính lại chi phí khi người dùng chuyển đổi tùy chọn thanh toán
watch(paymentOption, () => {
    calculatePrice();
});

// ============================================================================
// 7. XỬ LÝ CHUYỂN BƯỚC ĐẶT XE (PROCEED TO CHECKOUT VALIDATION)
// ============================================================================

/**
 * Hàm kiểm tra hợp lệ và tiến hành chuyển mạch tới trang Chốt Đơn Đặt Xe (CheckoutView)
 * - Nếu chưa đăng nhập => Yêu cầu đăng nhập và tự động quay trở lại đúng đơn đặt xe sau khi đăng nhập thành công!
 */
const handleProceedToCheckout = () => {
    if (!priceDetails.value) {
        alert('Vui lòng chọn khoảng thời gian hợp lệ!');
        return;
    }

    if (!rentalTimeStore.startDatetime || !rentalTimeStore.endDatetime) {
        alert('Vui lòng chọn thời gian thuê hợp lệ!');
        return;
    }

    const checkoutQuery = {
        vehicle_id: vehicleId,
        mode: rentalTimeStore.mode,
        start: rentalTimeStore.startDatetime,
        end: rentalTimeStore.endDatetime,
        option: paymentOption.value,
        delivery_type: deliveryType.value,
    };
    
    // Đính kèm thông số Giao nhận tận nơi lên chuỗi URL nếu khách có chọn
    if (deliveryType.value === 'delivery') {
        checkoutQuery.delivery_address = deliveryAddress.value;
        checkoutQuery.delivery_lat = deliveryLatitude.value;
        checkoutQuery.delivery_lng = deliveryLongitude.value;
        checkoutQuery.delivery_distance = deliveryDistance.value;
        checkoutQuery.delivery_fee = deliveryFee.value;
    }

    // Kiểm tra thông tin chứng thực
    const token = localStorage.getItem('authToken');
    if (!token) {
        const queryString = new URLSearchParams(checkoutQuery).toString();
        // Lưu giữ đường dẫn Đơn hàng dở dang vào bộ nhớ tạm
        localStorage.setItem('redirectAfterLogin', `/checkout?${queryString}`);
        alert('Vui lòng đăng nhập để tiếp tục đặt xe nhé!');
        router.push('/auth/login');
        return;
    }

    // Đẩy sang trang Checkout kèm toàn bộ thông số đơn
    router.push({ path: '/checkout', query: checkoutQuery });
};

const formatCurrency = (value) => {
    const amount = Number(value || 0);
    return `${amount.toLocaleString('vi-VN')}đ`;
};

const formatPriceShort = (value) => {
    const amount = Number(value || 0);
    return `${amount.toLocaleString('vi-VN')}đ`;
};

const getOriginalPrice = (car) => {
    if (!car) return null;
    if (car.base_price_old) return car.base_price_old;
    const discount = (car.is_discount_enabled && car.weekly_discount_percent > 0) ? car.weekly_discount_percent : (car.discount_percentage || 0);
    if (discount > 0) {
        return car.base_price;
    }
    return null;
};

const getFinalPrice = (car) => {
    if (!car) return 0;
    if (car.base_price_old) return car.base_price;
    const discount = (car.is_discount_enabled && car.weekly_discount_percent > 0) ? car.weekly_discount_percent : (car.discount_percentage || 0);
    if (discount > 0) {
        return car.base_price * (1 - discount / 100);
    }
    return car.base_price;
};

// Hỗ trợ điều hướng ảnh Gallery bằng phím mũi tên bàn phím trái/phải
const handleGlobalKeydown = (e) => {
    const modalEl = document.getElementById('imageGalleryModal');
    if (!modalEl || !modalEl.classList.contains('show')) return;
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
};

// ============================================================================
// 8. MÓC TRÌNH DẪN VÒNG ĐỜI VUE (MOUNT & UNMOUNT LIFECYCLE HOOKS)
// ============================================================================
onMounted(() => {
    favoriteStore.fetchFavoriteIds();
    rentalTimeStore.ensureDefaultSelection();
    loadVehicleDetails();

    window.addEventListener('keydown', handleGlobalKeydown);

    // Xử lý dọn dẹp các sự kiện đóng Modal của Bootstrap để ngăn trệt để lỗi giật màn hình
    document.querySelectorAll('.modal').forEach((modal) => {
        modal.addEventListener('hide.bs.modal', () => {
            if (document.activeElement) document.activeElement.blur();
        });
        modal.addEventListener('hidden.bs.modal', () => {
            if (!document.querySelector('.modal.show')) cleanupModalArtifacts();
        });
    });
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleGlobalKeydown);

    document.querySelectorAll('.modal').forEach((modal) => {
        if (window.bootstrap && modal) {
            const instance = window.bootstrap.Modal.getInstance(modal);
            if (instance) instance.dispose();
        }
    });
    cleanupModalArtifacts();
});
</script>
