<template>
    <div>
    <!-- ========================================================== -->
    <!-- 1. KHỐI CAROUSEL BANNER & BIỂU MẪU TÌM KIẾM XE (HERO SEARCH) -->
    <!-- ========================================================== -->
    <div class="header-carousel mb-5">
        <div id="carouselId" class="carousel slide">
            <ol class="carousel-indicators">
                <li v-for="(banner, index) in activeBanners" :key="'ind-' + banner.id"
                    data-bs-target="#carouselId" :data-bs-slide-to="index" :class="{ active: index === 0 }"
                    :aria-current="index === 0 ? 'true' : 'false'"
                    :aria-label="'Slide ' + (index + 1)"></li>
                
                <!-- Fallback indicator nếu chưa có banner nào -->
                <li v-if="activeBanners.length === 0" data-bs-target="#carouselId" data-bs-slide-to="0" class="active" aria-current="true" aria-label="First slide"></li>
            </ol>
            <div class="carousel-inner" role="listbox">
                <!-- Vòng lặp hiển thị Banners từ API -->
                <div v-for="(banner, index) in activeBanners" :key="banner.id" class="carousel-item" :class="{ active: index === 0 }">
                    <img :src="banner.image_url ? `https://autocar-citx.onrender.com${banner.image_url}` : '/img/carousel-2.jpg'" class="img-fluid w-100" style="object-fit: cover; max-height: 800px;" :alt="banner.title" />
                    <div class="carousel-caption">
                        <div class="container py-4">
                            <div class="row g-5">
                                <!-- Khối bên trái: Biểu mẫu tìm kiếm nhanh -->
                                <div class="col-lg-6 fadeInLeft animated" data-animation="fadeInLeft" data-delay="1s" style="animation-delay: 1s;">
                                    <div class="glass-search-box rounded-4 p-5 shadow-lg border border-light border-opacity-25">
                                        <h4 class="text-white mb-4 fw-bold">TÌM XE TỰ LÁI</h4>
                                        <form>
                                            <div class="row g-4">
                                                <!-- Chọn địa điểm nhận xe (Kích hoạt LocationModal) -->
                                                <div class="col-12">
                                                    <button type="button"
                                                        class="input-group input-group-lg w-100 border border-secondary-subtle bg-white p-0 rounded-3 overflow-hidden shadow-none"
                                                        @click="openModalById('locationDetailModal')">
                                                        <span
                                                            class="d-flex align-items-center text-body px-3 px-lg-4 border-end">
                                                            <span class="fas fa-circle-dot text-dark"></span>
                                                            <span class="ms-2 fw-semibold">Địa điểm</span>
                                                        </span>
                                                        <span
                                                            class="form-control border-0 text-start bg-white d-flex align-items-center justify-content-between rounded-end ps-3 pe-3 py-2">
                                                            <span class="text-muted fw-normal text-truncate d-block">
                                                                {{ locationDisplay || 'Chọn địa điểm...' }}
                                                            </span>
                                                            <span class="fas fa-chevron-down text-muted ms-2"></span>
                                                        </span>
                                                    </button>
                                                </div>

                                                <!-- Chọn thời gian nhận và trả xe (Kích hoạt TimePickerModal) -->
                                                <div class="col-12">
                                                    <button type="button"
                                                        class="input-group input-group-lg w-100 border-0 bg-transparent p-0"
                                                        @click="openModalById('timePickerModal')">
                                                        <span
                                                            class="d-flex align-items-center bg-light text-body rounded-start px-4 border-end">
                                                            <span class="fas fa-calendar-alt text-primary"></span>
                                                            <span class="ms-2 fw-bold">Thời gian</span>
                                                        </span>
                                                        <span
                                                            class="form-control text-start bg-white d-flex align-items-center justify-content-between rounded-end">
                                                            <span class="fw-bold">{{ timeDisplay }}</span>
                                                        </span>
                                                    </button>
                                                </div>

                                                <!-- Nút kích hoạt Trình tìm kiếm xe và chuyển trang -->
                                                <div class="col-12 mt-2">
                                                    <button type="button" @click="handleSearchVehicles()"
                                                        class="btn btn-primary w-100 py-3 fw-bold fs-5 text-white rounded-3">
                                                        TÌM XE NGAY
                                                    </button>
                                                </div>

                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <!-- Khối bên phải: Tiêu đề quảng bá Banner -->
                                <div class="col-lg-6 d-none d-lg-flex fadeInRight animated" data-animation="fadeInRight"
                                    data-delay="1s" style="animation-delay: 1s;">
                                    <div class="text-start">
                                        <h1 class="display-5 text-white fw-bold" style="text-shadow: 2px 2px 8px rgba(0,0,0,0.8);">{{ banner.title }}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Fallback hiển thị mặc định nếu chưa có banner nào -->
                <div v-if="activeBanners.length === 0" class="carousel-item active">
                    <img src="/img/carousel-2.jpg" class="img-fluid w-100" style="object-fit: cover; max-height: 800px;" alt="Default slide" />
                    <div class="carousel-caption">
                        <div class="container py-4">
                            <div class="row g-5">
                                <!-- Khối bên trái: Biểu mẫu tìm kiếm nhanh -->
                                <div class="col-lg-6 fadeInLeft animated" data-animation="fadeInLeft" data-delay="1s" style="animation-delay: 1s;">
                                    <div class="glass-search-box rounded-4 p-5 shadow-lg border border-light border-opacity-25">
                                        <h4 class="text-white mb-4 fw-bold">TÌM XE TỰ LÁI</h4>
                                        <form>
                                            <div class="row g-4">
                                                <div class="col-12">
                                                    <button type="button" class="input-group input-group-lg w-100 border border-secondary-subtle bg-white p-0 rounded-3 overflow-hidden shadow-none" @click="openModalById('locationDetailModal')">
                                                        <span class="d-flex align-items-center text-body px-3 px-lg-4 border-end">
                                                            <span class="fas fa-circle-dot text-dark"></span>
                                                            <span class="ms-2 fw-semibold">Địa điểm</span>
                                                        </span>
                                                        <span class="form-control border-0 text-start bg-white d-flex align-items-center justify-content-between rounded-end ps-3 pe-3 py-2">
                                                            <span class="text-muted fw-normal text-truncate d-block">{{ locationDisplay || 'Chọn địa điểm...' }}</span>
                                                            <span class="fas fa-chevron-down text-muted ms-2"></span>
                                                        </span>
                                                    </button>
                                                </div>
                                                <div class="col-12">
                                                    <button type="button" class="input-group input-group-lg w-100 border-0 bg-transparent p-0" @click="openModalById('timePickerModal')">
                                                        <span class="d-flex align-items-center bg-light text-body rounded-start px-4 border-end">
                                                            <span class="fas fa-calendar-alt text-primary"></span>
                                                            <span class="ms-2 fw-bold">Thời gian</span>
                                                        </span>
                                                        <span class="form-control text-start bg-white d-flex align-items-center justify-content-between rounded-end">
                                                            <span class="fw-bold">{{ timeDisplay }}</span>
                                                        </span>
                                                    </button>
                                                </div>
                                                <div class="col-12 mt-2">
                                                    <button type="button" @click="handleSearchVehicles()" class="btn btn-primary w-100 py-3 fw-bold fs-5 text-white rounded-3">TÌM XE NGAY</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div class="col-lg-6 d-none d-lg-flex fadeInRight animated" data-animation="fadeInRight" data-delay="1s" style="animation-delay: 1s;">
                                    <div class="text-start">
                                        <h1 class="display-5 text-white">Trải nghiệm hành trình thoải mái cùng AutoCar</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- ========================================================== -->
    <!-- 2. KHỐI GIỚI THIỆU SÀN THUÊ XE AUTOCAR (ABOUT US SECTION)  -->
    <!-- ========================================================== -->
    <div class="container-fluid overflow-hidden about py-5">
        <div class="container py-5">
            <div class="row g-5 align-items-center">
                <!-- Hình ảnh thực tế minh họa xe cho thuê -->
                <div class="col-xl-6 wow fadeInLeft" data-wow-delay="0.2s">
                    <div class="about-img position-relative">
                        <div class="img-1">
                            <img src="/img/about-img.jpg" class="img-fluid rounded-4 shadow-lg w-100 object-fit-cover" style="height: 400px;" alt="Xe chất lượng cao">
                        </div>
                        <div class="img-2 position-absolute" style="bottom: -15%; right: -10%; width: 50%; z-index: 2;">
                            <img src="/img/about-img-1.jpg" class="img-fluid rounded-4 shadow-lg border border-3 border-white" alt="Khách hàng hài lòng">
                        </div>
                        <div class="position-absolute bg-primary rounded-circle d-flex align-items-center justify-content-center shadow-lg" style="width: 100px; height: 100px; top: -10%; left: -5%; z-index: 3;">
                            <div class="text-center text-white">
                                <h4 class="mb-0 fw-bold">5+</h4>
                                <small>Năm</small>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Thông tin điểm mạnh và kinh nghiệm -->
                <div class="col-xl-6 wow fadeInRight" data-wow-delay="0.2s">
                    <div class="about-item ps-xl-5 mt-5 mt-xl-0">
                        <div class="pb-4">
                            <h6 class="text-primary text-uppercase fw-bold mb-2 tracking-wider">VỀ CHÚNG TÔI</h6>
                            <h1 class="display-5 text-capitalize mb-4 fw-bold text-dark">Nền Tảng Thuê Xe Tự Lái <span class="text-primary">Hàng Đầu</span></h1>
                            <p class="mb-4 text-muted lh-lg fs-5">AutoCar mang đến giải pháp di chuyển thông minh, tiện lợi và tiết kiệm. Dù bạn cần một chiếc xe nhỏ gọn để đi phố hay một chiếc SUV rộng rãi cho chuyến dã ngoại cuối tuần, chúng tôi đều sẵn sàng đáp ứng với hàng trăm lựa chọn xe chất lượng.</p>
                        </div>
                        <div class="row g-4">
                            <div class="col-sm-6">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="flex-shrink-0 btn-square bg-primary-subtle text-primary rounded-circle me-3">
                                        <i class="fa fa-car-side fs-4"></i>
                                    </div>
                                    <h5 class="mb-0 fw-bold">Đa dạng dòng xe</h5>
                                </div>
                                <p class="text-muted">Từ xe hạng phổ thông đến sang trọng, đáp ứng mọi nhu cầu.</p>
                            </div>
                            <div class="col-sm-6">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="flex-shrink-0 btn-square bg-primary-subtle text-primary rounded-circle me-3">
                                        <i class="fa fa-shield-alt fs-4"></i>
                                    </div>
                                    <h5 class="mb-0 fw-bold">Bảo hiểm toàn diện</h5>
                                </div>
                                <p class="text-muted">An tâm trên mọi nẻo đường với gói bảo hiểm chuẩn quốc tế.</p>
                            </div>
                            <div class="col-sm-6">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="flex-shrink-0 btn-square bg-primary-subtle text-primary rounded-circle me-3">
                                        <i class="fa fa-tags fs-4"></i>
                                    </div>
                                    <h5 class="mb-0 fw-bold">Giá cả minh bạch</h5>
                                </div>
                                <p class="text-muted">Không phí ẩn, cam kết mức giá tốt nhất trên thị trường.</p>
                            </div>
                            <div class="col-sm-6">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="flex-shrink-0 btn-square bg-primary-subtle text-primary rounded-circle me-3">
                                        <i class="fa fa-headset fs-4"></i>
                                    </div>
                                    <h5 class="mb-0 fw-bold">Hỗ trợ 24/7</h5>
                                </div>
                                <p class="text-muted">Đội ngũ CSKH chuyên nghiệp luôn sẵn sàng đồng hành cùng bạn.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ========================================================== -->
    <!-- 3. KHỐI CÁCH THỨC HOẠT ĐỘNG (HOW IT WORKS)                 -->
    <!-- ========================================================== -->
    <div class="container-fluid steps py-5 bg-light">
        <div class="container py-5">
            <div class="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.1s" style="max-width: 800px;">
                <h6 class="text-primary text-uppercase fw-bold mb-2 tracking-wider">CÁCH THỨC HOẠT ĐỘNG</h6>
                <h1 class="display-5 text-capitalize mb-3 fw-bold text-dark">3 Bước Thuê Xe <span class="text-primary">Đơn Giản</span></h1>
                <p class="mb-0 text-muted fs-5">Quy trình đặt xe trực tuyến tại AutoCar được tối ưu hóa nhằm mang lại trải nghiệm nhanh chóng và mượt mà nhất cho khách hàng chỉ với vài cú click chuột.
                </p>
            </div>
            <div class="row g-4">
                <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                    <div class="step-item text-center p-5 h-100 bg-white rounded-4 shadow-sm border border-light hover-elevate transition-all">
                        <div class="step-icon bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style="width: 100px; height: 100px;">
                            <i class="fa fa-map-marked-alt fa-3x"></i>
                        </div>
                        <h4 class="mb-3 fw-bold">1. Chọn xe & Thời gian</h4>
                        <p class="mb-0 text-muted">Nhập địa điểm, thời gian và lựa chọn chiếc xe ưng ý nhất từ hàng trăm mẫu xe trên hệ thống.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                    <div class="step-item text-center p-5 h-100 bg-white rounded-4 shadow-sm border border-light hover-elevate transition-all">
                        <div class="step-icon bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style="width: 100px; height: 100px;">
                            <i class="fa fa-credit-card fa-3x"></i>
                        </div>
                        <h4 class="mb-3 fw-bold">2. Thanh toán đặt cọc</h4>
                        <p class="mb-0 text-muted">Xác nhận thông tin chuyến đi và thanh toán khoản đặt cọc an toàn qua cổng thanh toán trực tuyến.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
                    <div class="step-item text-center p-5 h-100 bg-white rounded-4 shadow-sm border border-light hover-elevate transition-all">
                        <div class="step-icon bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style="width: 100px; height: 100px;">
                            <i class="fa fa-key fa-3x"></i>
                        </div>
                        <h4 class="mb-3 fw-bold">3. Nhận xe & Di chuyển</h4>
                        <p class="mb-0 text-muted">Gặp chủ xe để làm thủ tục giao nhận, nhận chìa khóa và bắt đầu hành trình tuyệt vời của bạn.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ========================================================== -->
    <!-- 3.5. KHỐI XE NỔI BẬT (FEATURED VEHICLES)                   -->
    <!-- ========================================================== -->
    <div class="container-fluid vehicles py-5">
        <div class="container py-5">
            <div class="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.1s" style="max-width: 800px;">
                <h6 class="text-primary text-uppercase fw-bold mb-2 tracking-wider">XE DÀNH CHO BẠN</h6>
                <h1 class="display-5 text-capitalize mb-3 fw-bold text-dark">Dàn Xe <span class="text-primary">Nổi Bật</span></h1>
                <p class="mb-0 text-muted fs-5">Những chiếc xe được khách hàng yêu thích và thuê nhiều nhất trong tháng qua.</p>
            </div>
            
            <div v-if="featuredVehicles.length > 0" class="row g-4">
                <div v-for="vehicle in featuredVehicles" :key="vehicle.id" class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                    <VehicleCard :car="vehicle" />
                </div>
            </div>
            <!-- Skeleton Loading -->
            <div v-else class="row g-4">
                <div v-for="i in 3" :key="'skeleton-'+i" class="col-lg-4 col-md-6">
                    <div class="bg-white rounded-4 shadow-sm h-100 overflow-hidden border border-light p-3" style="min-height: 400px;">
                        <div class="placeholder-glow w-100 rounded-3 bg-light" style="height: 250px;"></div>
                        <div class="placeholder-glow mt-3">
                            <span class="placeholder col-7 placeholder-lg rounded bg-light d-inline-block" style="height: 20px;"></span>
                            <span class="placeholder col-4 placeholder-sm rounded mt-2 bg-light d-inline-block" style="height: 15px;"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center mt-5">
                <router-link :to="{ name: 'vehicles' }" class="btn btn-outline-primary rounded-pill py-3 px-5 fw-bold fs-5 hover-elevate transition-all">Xem Tất Cả Trạm Xe <i class="fa fa-arrow-right ms-2"></i></router-link>
            </div>
        </div>
    </div>

    <!-- ========================================================== -->
    <!-- 4. KHỐI TIN TỨC & CẨM NANG THUÊ XE (BLOG POSTS)            -->
    <!-- ========================================================== -->
    <div class="container-fluid blog py-5 bg-light">
        <div class="container py-5">
            <div class="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.1s" style="max-width: 800px;">
                <h6 class="text-primary text-uppercase fw-bold mb-2 tracking-wider">CẨM NANG HÀNH TRÌNH</h6>
                <h1 class="display-5 text-capitalize mb-3 fw-bold text-dark">Góc <span class="text-primary">Chia Sẻ & Tin Tức</span></h1>
                <p class="mb-0 text-muted fs-5">Những kinh nghiệm hữu ích và mẹo hay giúp chuyến đi của bạn thêm phần trọn vẹn và an toàn.</p>
            </div>
            <div class="row g-4">
                <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                    <div class="blog-item bg-white rounded-4 shadow-sm border border-light h-100 hover-elevate transition-all">
                        <div class="blog-img overflow-hidden rounded-top-4 position-relative">
                            <img src="/img/blog-1.jpg" class="img-fluid w-100 object-fit-cover transition-transform" style="height: 240px;" alt="Image">
                            <div class="position-absolute top-0 start-0 bg-primary text-white px-3 py-2 rounded-end-pill mt-3 shadow-sm">
                                <span class="fw-bold">15 Th12</span> 2025
                            </div>
                        </div>
                        <div class="blog-content p-4">
                            <div class="blog-comment mb-3 d-flex text-muted small">
                                <div class="me-3"><i class="fa fa-user text-primary me-1"></i> Admin</div>
                                <div><i class="fa fa-folder text-primary me-1"></i> Kinh nghiệm</div>
                            </div>
                            <a href="#" class="h5 d-block mb-3 fw-bold text-dark hover-primary text-decoration-none lh-base">Top 5 địa điểm cắm trại lý tưởng nhất vùng ngoại ô dịp cuối tuần</a>
                            <p class="mb-3 text-muted">Cuối tuần là khoảng thời gian lý tưởng để trốn khỏi phố thị ồn ào. Cùng AutoCar điểm danh 5 khu cắm trại không thể bỏ qua...</p>
                            <a href="#" class="btn btn-link text-primary p-0 fw-bold text-decoration-none mt-auto">Đọc tiếp <i class="fa fa-arrow-right ms-1"></i></a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                    <div class="blog-item bg-white rounded-4 shadow-sm border border-light h-100 hover-elevate transition-all">
                        <div class="blog-img overflow-hidden rounded-top-4 position-relative">
                            <img src="/img/blog-2.jpg" class="img-fluid w-100 object-fit-cover transition-transform" style="height: 240px;" alt="Image">
                            <div class="position-absolute top-0 start-0 bg-primary text-white px-3 py-2 rounded-end-pill mt-3 shadow-sm">
                                <span class="fw-bold">02 Th12</span> 2025
                            </div>
                        </div>
                        <div class="blog-content p-4">
                            <div class="blog-comment mb-3 d-flex text-muted small">
                                <div class="me-3"><i class="fa fa-user text-primary me-1"></i> Mai Quỳnh</div>
                                <div><i class="fa fa-folder text-primary me-1"></i> Hướng dẫn</div>
                            </div>
                            <a href="#" class="h5 d-block mb-3 fw-bold text-dark hover-primary text-decoration-none lh-base">Kinh nghiệm xử lý khi xe gặp sự cố hoặc phạt nguội dọc đường</a>
                            <p class="mb-3 text-muted">Dù đã chuẩn bị kỹ lưỡng, những rủi ro trên đường vẫn có thể xảy ra. Hãy lưu lại cẩm nang này để biết cách xử lý mượt mà...</p>
                            <a href="#" class="btn btn-link text-primary p-0 fw-bold text-decoration-none mt-auto">Đọc tiếp <i class="fa fa-arrow-right ms-1"></i></a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
                    <div class="blog-item bg-white rounded-4 shadow-sm border border-light h-100 hover-elevate transition-all">
                        <div class="blog-img overflow-hidden rounded-top-4 position-relative">
                            <img src="/img/blog-3.jpg" class="img-fluid w-100 object-fit-cover transition-transform" style="height: 240px;" alt="Image">
                            <div class="position-absolute top-0 start-0 bg-primary text-white px-3 py-2 rounded-end-pill mt-3 shadow-sm">
                                <span class="fw-bold">28 Th11</span> 2025
                            </div>
                        </div>
                        <div class="blog-content p-4">
                            <div class="blog-comment mb-3 d-flex text-muted small">
                                <div class="me-3"><i class="fa fa-user text-primary me-1"></i> AutoCar</div>
                                <div><i class="fa fa-folder text-primary me-1"></i> Đánh giá xe</div>
                            </div>
                            <a href="#" class="h5 d-block mb-3 fw-bold text-dark hover-primary text-decoration-none lh-base">Đánh giá thực tế Mazda CX-5: Mẫu SUV "Quốc dân" cho gia đình</a>
                            <p class="mb-3 text-muted">Mazda CX-5 luôn là cái tên hot nhất trên nền tảng AutoCar. Cùng tìm hiểu tại sao mẫu xe này lại được ưa chuộng đến vậy...</p>
                            <a href="#" class="btn btn-link text-primary p-0 fw-bold text-decoration-none mt-auto">Đọc tiếp <i class="fa fa-arrow-right ms-1"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ========================================================== -->
    <!-- 5. KHỐI MODAL DÙNG CHUNG (LOCATION & TIME PICKER MODALS)   -->
    <!-- ========================================================== -->
    <LocationModal @locationSelected="handleLocationSelect" />
    <TimePickerModal @timeSelected="handleTimeSelect" />
    </div>
</template>

<script setup>
// =====================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN & KHỞI TẠO BIẾN TRẠNG THÁI (STATE & STORES)
// =====================================================================
import { computed, nextTick, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useRentalTimeStore } from '@/stores/rentalTime.store';

// Nhập các thành phần Modal dùng chung cho việc lựa chọn Địa điểm và Lịch trình
import LocationModal from '@/components/common/LocationModal.vue';
import TimePickerModal from '@/components/common/TimePickerModal.vue';
import VehicleCard from '@/components/common/VehicleCard.vue';

const router = useRouter()
const rentalTimeStore = useRentalTimeStore();

// Cấu hình tham số cho thư viện hiển thị trình chiếu Owl Carousel
const categoriesCarouselOptions = {
    autoplay: true,
    smartSpeed: 1000,
    dots: false,
    loop: true,
    margin: 25,
    nav: true,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    responsiveClass: true,
    responsive: {
        0: { items: 1 },
        576: { items: 1 },
        768: { items: 1 },
        992: { items: 2 },
        1200: { items: 3 },
    },
}

// Biến quản lý hiển thị tên Địa điểm & Thời gian trực quan trên biểu mẫu
const locationDisplay = ref('');
const timeDisplay = computed(() => rentalTimeStore.displayString || 'Chọn thời gian thuê');

// Biến lưu trữ tổng hợp bộ thông số tìm kiếm chuẩn bị gửi sang Trang Danh sách Xe (VehicleView)
const searchFilters = ref({
    lat: null,
    lng: null,
    location_name: '',
    start_datetime: '',
    end_datetime: '',
    mode: 'day' // Lưu chế độ thuê theo ngày ('day') hoặc theo giờ ('hour')
});

// Biến chứa dữ liệu Banner từ API
const activeBanners = ref([]);

// Biến chứa dữ liệu Xe Nổi Bật
const featuredVehicles = ref([]);

// =====================================================================
// 2. BỘ HÀM QUẢN TRỊ MODAL & ĐỒNG BỘ DỮ LIỆU THỜI GIAN (MODAL HANDLERS)
// =====================================================================

/**
 * Fetch banners từ API backend
 */
const fetchBanners = async () => {
    try {
        const response = await axios.get('https://autocar-citx.onrender.com/api/v1/web/banners/public');
        if (response.data?.success) {
            activeBanners.value = response.data.data;
        }
    } catch (error) {
        console.error('Lỗi khi tải danh sách banners:', error);
    }
};

/**
 * Fetch danh sách xe nổi bật từ API backend
 */
const fetchFeaturedVehicles = async () => {
    try {
        const response = await axios.get('https://autocar-citx.onrender.com/api/v1/web/search/vehicles?per_page=3');
        if (response.data?.success && response.data.data?.data) {
            featuredVehicles.value = response.data.data.data;
        }
    } catch (error) {
        console.error('Lỗi khi tải danh sách xe nổi bật:', error);
    }
};

/**
 * Hàm đồng bộ thông số thời gian từ Kho lưu trữ toàn cầu Pinia (RentalTimeStore) vào Biểu mẫu tìm kiếm
 */
const syncTimeFromStore = () => {
    searchFilters.value.start_datetime = rentalTimeStore.startDatetime;
    searchFilters.value.end_datetime = rentalTimeStore.endDatetime;
    searchFilters.value.mode = rentalTimeStore.mode || 'day';
};

/**
 * Hàm hỗ trợ truy xuất hoặc khởi tạo đối tượng Modal của Bootstrap 5 an toàn
 */
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

/**
 * Hàm mở Modal theo ID phần tử DOM
 */
const openModalById = (modalId) => {
    const el = document.getElementById(modalId);
    const modal = getOrCreateModalInstance(el);
    if (modal && typeof modal.show === 'function') {
        modal.show();
    }
};

// =====================================================================
// 3. XỬ LÝ SỰ KIỆN TƯƠNG TÁC TỪ MODAL (EMITTED EVENTS)
// =====================================================================

/**
 * Tiếp nhận dữ liệu khi Người dùng xác nhận Địa điểm từ LocationModal.vue
 * @param {Object} data - Chứa tên địa điểm và tọa độ GPS ({ name, lat, lng })
 */
const handleLocationSelect = (data) => {
    locationDisplay.value = data.name;
    searchFilters.value.location_name = data.name;
    searchFilters.value.lat = data.lat;
    searchFilters.value.lng = data.lng;
};

/**
 * Tiếp nhận dữ liệu khi Người dùng xác nhận Khung giờ thuê từ TimePickerModal.vue
 */
const handleTimeSelect = (data) => {
    rentalTimeStore.setSelection(data);
    syncTimeFromStore();
};

// =====================================================================
// 4. XỬ LÝ SỰ KIỆN CHÍNH: NÚT "TÌM XE NGAY" (SEARCH EXECUTION)
// =====================================================================

/**
 * Hàm kiểm duyệt và kích hoạt chuyển hướng sang trang Danh sách Xe (VehicleView)
 * - Bước 1: Đồng bộ lịch thuê mới nhất từ Store.
 * - Bước 2: Kiểm tra bắt buộc phải chọn Khung giờ thuê (Nếu trống => Tự động mở Modal thời gian).
 * - Bước 3: Đóng gói tham số (Query Params: location, lat, lng, startDate, startTime, endDate, endTime, mode).
 * - Bước 4: Chuyển hướng trình duyệt qua Router.
 */
function handleSearchVehicles() {
    syncTimeFromStore();

    // 1. Kiểm duyệt thông tin bắt buộc
    if (!searchFilters.value.start_datetime || !searchFilters.value.end_datetime) {
        alert('Vui lòng chọn thời gian bạn muốn thuê xe nhé!');
        // Tự động bật Modal thời gian lên cho người dùng bổ sung
        openModalById('timePickerModal');
        return;
    }

    // 2. Đóng gói tham số chuỗi URL
    const query = {};

    if (searchFilters.value.location_name) query.location = searchFilters.value.location_name;
    if (searchFilters.value.lat) query.lat = searchFilters.value.lat;
    if (searchFilters.value.lng) query.lng = searchFilters.value.lng;

    // Tách ngày và giờ từ chuỗi ISO 'YYYY-MM-DDTHH:mm:ss' để hiển thị đẹp mắt trên URL
    if (searchFilters.value.start_datetime) {
        const [startDate, startTime] = searchFilters.value.start_datetime.split('T');
        const [endDate, endTime] = searchFilters.value.end_datetime.split('T');

        query.startDate = startDate;
        query.startTime = startTime.substring(0, 5); // Cắt lấy định dạng HH:mm
        query.endDate = endDate;
        query.endTime = endTime.substring(0, 5);     // Cắt lấy định dạng HH:mm
        query.mode = searchFilters.value.mode;
    }

    // 3. Chuyển hướng qua trang Tìm kiếm Xe
    router.push({ name: 'vehicles', query: query });
}

// =====================================================================
// 5. MÓC TRÌNH DẪN VÒNG ĐỜI VUE (LIFECYCLE HOOKS)
// =====================================================================
onMounted(async () => {
    // Tải danh sách Banner từ API
    await fetchBanners();

    // Tải danh sách Xe nổi bật (Không cần await để tránh block trang)
    fetchFeaturedVehicles();

    // Đồng bộ thời gian thuê ngay khi Khởi tạo trang
    syncTimeFromStore();

    await nextTick()

    // Khởi tạo thư viện trình chiếu Banner (Hero Carousel)
    const bannerCarouselElement = document.getElementById('carouselId');
    if (bannerCarouselElement && window.bootstrap) {
        const heroCarousel = new window.bootstrap.Carousel(bannerCarouselElement, {
            interval: 5000,
            ride: 'carousel',
            pause: 'hover'
        });
        heroCarousel.cycle();
    }

    // Khởi tạo thư viện trình chiếu Categories Carousel khi DOM đã sẵn sàng
    const carousel = window.jQuery?.('.categories-carousel')
    if (carousel?.length && !carousel.hasClass('owl-loaded')) {
        carousel.owlCarousel(categoriesCarouselOptions)
    }
})

onBeforeUnmount(() => {
    // Dọn dẹp owl carousel trước khi component bị hủy để tránh lỗi DOM khi Vue Router chuyển trang
    const carousel = window.jQuery?.('.categories-carousel');
    if (carousel?.length) {
        carousel.trigger('destroy.owl.carousel');
    }
})
</script>

<style scoped>
.glass-search-box {
    background: rgba(0, 0, 0, 0.35); /* Đen trong suốt 35% */
    backdrop-filter: blur(10px);     /* Làm mờ nền phía sau */
    -webkit-backdrop-filter: blur(10px);
}

.hover-elevate {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.hover-elevate:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
}
.tracking-wider {
    letter-spacing: 0.1em;
}
.bg-gradient-dark {
    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
}
.transition-transform {
    transition: transform 0.5s ease;
}
.blog-item:hover .transition-transform {
    transform: scale(1.05);
}
.hover-primary:hover {
    color: var(--bs-primary) !important;
}
</style>
