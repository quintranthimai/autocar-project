<template>
    <div>
    <!-- Header Start -->
    <div class="container-fluid bg-breadcrumb mb-5">
        <div class="container text-center py-5" style="max-width: 900px;">
            <h4 class="text-white display-4 mb-4 wow fadeInDown" data-wow-delay="0.1s">Câu chuyện của AutoCar</h4>
            <ol class="breadcrumb d-flex justify-content-center mb-0 wow fadeInDown" data-wow-delay="0.3s">
                <li class="breadcrumb-item"><router-link :to="{ name: 'home' }">Trang chủ</router-link></li>
                <li class="breadcrumb-item"><a href="#">Trang</a></li>
                <li class="breadcrumb-item active text-primary">Giới thiệu</li>
            </ol>
        </div>
    </div>
    <!-- Header End -->

    <!-- About Start -->
    <div class="container-fluid overflow-hidden about py-5">
        <div class="container py-5">
            <div class="row g-5 align-items-center">
                <div class="col-xl-6 wow fadeInLeft" data-wow-delay="0.2s">
                    <div class="about-item">
                        <div class="pb-4">
                            <h6 class="text-primary text-uppercase fw-bold mb-2 tracking-wider">VỀ CHÚNG TÔI</h6>
                            <h1 class="display-5 text-capitalize mb-4 fw-bold text-dark">Hành trình <span class="text-primary">Kiến tạo</span></h1>
                            <p class="mb-4 text-muted lh-lg fs-5">Được thành lập với khát vọng thay đổi cách thức di chuyển của người Việt, AutoCar tự hào là nền tảng kết nối thuê xe tự lái tiên phong. Chúng tôi mang đến sự tự do, linh hoạt và tiện lợi cho mọi hành trình của bạn.</p>
                        </div>
                        <div class="row g-4 mb-5">
                            <div class="col-lg-6">
                                <div class="about-item-inner border p-4 rounded-4 shadow-sm h-100 hover-elevate bg-white">
                                    <div class="about-icon mb-4 bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                                        <i class="fa fa-eye text-primary fs-3"></i>
                                    </div>
                                    <h5 class="mb-3 fw-bold text-dark">Tầm nhìn</h5>
                                    <p class="mb-0 text-muted">Trở thành nền tảng di chuyển số 1 Đông Nam Á, nơi mọi người đều có thể tiếp cận xe hơi dễ dàng.</p>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="about-item-inner border p-4 rounded-4 shadow-sm h-100 hover-elevate bg-white">
                                    <div class="about-icon mb-4 bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                                        <i class="fa fa-bullseye text-primary fs-3"></i>
                                    </div>
                                    <h5 class="mb-3 fw-bold text-dark">Sứ mệnh</h5>
                                    <p class="mb-0 text-muted">Tối ưu hóa nguồn tài nguyên xe rảnh rỗi, mang lại lợi ích kinh tế và trải nghiệm tuyệt vời cho cộng đồng.</p>
                                </div>
                            </div>
                        </div>
                        <div class="row g-4 align-items-center">
                            <div class="col-lg-5">
                                <div class="text-center rounded-4 bg-gradient-primary p-4 shadow-lg hover-elevate">
                                    <h1 class="display-4 text-white fw-bold mb-2">5+</h1>
                                    <h5 class="text-light mb-0">Năm kinh nghiệm</h5>
                                </div>
                            </div>
                            <div class="col-lg-7">
                                <div class="d-flex align-items-center ms-lg-3">
                                    <router-link :to="{ name: 'vehicles' }" class="btn btn-primary rounded-pill py-3 px-5 fw-bold fs-5 shadow hover-elevate">Bắt đầu hành trình <i class="fa fa-arrow-right ms-2"></i></router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6 wow fadeInRight" data-wow-delay="0.2s">
                    <div class="about-img position-relative">
                        <div class="img-1">
                            <img src="/img/about-img.jpg" class="img-fluid rounded-4 shadow-lg w-100 object-fit-cover" style="height: 500px;" alt="AutoCar Platform">
                        </div>
                        <div class="img-2 position-absolute" style="bottom: -10%; left: -10%; width: 45%; z-index: 2;">
                            <img src="/img/about-img-1.jpg" class="img-fluid rounded-4 shadow-lg border border-4 border-white" alt="Happy Customer">
                        </div>
                        <div class="position-absolute bg-white rounded-4 shadow-lg p-3 text-center" style="bottom: 10%; right: -5%; z-index: 3;">
                            <h3 class="text-primary fw-bold mb-0">10,000+</h3>
                            <p class="mb-0 text-muted small fw-bold">Chuyến đi thành công</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- About End -->

    <!-- Core Values Start -->
    <div class="container-fluid team py-5 bg-light">
        <div class="container py-5">
            <div class="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.1s" style="max-width: 800px;">
                <h6 class="text-primary text-uppercase fw-bold mb-2 tracking-wider">TẠI SAO CHỌN CHÚNG TÔI</h6>
                <h1 class="display-5 text-capitalize mb-3 fw-bold text-dark">Giá Trị <span class="text-primary">Cốt Lõi</span></h1>
                <p class="mb-0 text-muted fs-5">Những cam kết mạnh mẽ giúp AutoCar trở thành người bạn đồng hành tin cậy trên mọi nẻo đường của bạn.
                </p>
            </div>
            <div class="row g-4">
                <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.1s">
                    <div class="value-item p-5 h-100 bg-white rounded-4 shadow-sm border border-light text-center hover-elevate">
                        <div class="value-icon bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style="width: 90px; height: 90px;">
                            <i class="fa fa-gem fa-2x"></i>
                        </div>
                        <h4 class="mb-3 fw-bold text-dark">Chất Lượng Hàng Đầu</h4>
                        <p class="mb-0 text-muted">100% xe trên hệ thống đều được kiểm định chặt chẽ, bảo dưỡng định kỳ và đảm bảo vệ sinh sạch.</p>
                    </div>
                </div>
                <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.3s">
                    <div class="value-item p-5 h-100 bg-white rounded-4 shadow-sm border border-light text-center hover-elevate">
                        <div class="value-icon bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style="width: 90px; height: 90px;">
                            <i class="fa fa-hand-holding-usd fa-2x"></i>
                        </div>
                        <h4 class="mb-3 fw-bold text-dark">Giá Cả Minh Bạch</h4>
                        <p class="mb-0 text-muted">Mức giá niêm yết rõ ràng, không phát sinh chi phí ẩn. Cam kết luôn có mức giá tốt nhất.</p>
                    </div>
                </div>
                <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.5s">
                    <div class="value-item p-5 h-100 bg-white rounded-4 shadow-sm border border-light text-center hover-elevate">
                        <div class="value-icon bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style="width: 90px; height: 90px;">
                            <i class="fa fa-headset fa-2x"></i>
                        </div>
                        <h4 class="mb-3 fw-bold text-dark">Hỗ Trợ Tận Tâm</h4>
                        <p class="mb-0 text-muted">Đội ngũ tổng đài viên chuyên nghiệp, sẵn sàng hỗ trợ bạn 24/7 trong mọi tình huống khẩn cấp.</p>
                    </div>
                </div>
                <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.7s">
                    <div class="value-item p-5 h-100 bg-white rounded-4 shadow-sm border border-light text-center hover-elevate">
                        <div class="value-icon bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style="width: 90px; height: 90px;">
                            <i class="fa fa-bolt fa-2x"></i>
                        </div>
                        <h4 class="mb-3 fw-bold text-dark">Thủ Tục Nhanh Gọn</h4>
                        <p class="mb-0 text-muted">Quy trình đặt xe trực tuyến 100%, thủ tục nhận xe đơn giản không rườm rà giấy tờ phức tạp.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Core Values End -->
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    window.scrollTo(0, 0);
});
</script>

<style scoped>
.tracking-wider {
    letter-spacing: 0.1em;
}

.hover-elevate {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.hover-elevate:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
}

.bg-gradient-primary {
    background: linear-gradient(135deg, var(--bs-primary) 0%, #0056b3 100%);
}

.bg-primary-subtle {
    background-color: rgba(var(--bs-primary-rgb), 0.1) !important;
}
</style>
