// ============================================================================
// 1. KHÔNG GIAN NHẬP THƯ VIỆN VÀ GIAO DIỆN (IMPORTS & COMPONENTS)
// ============================================================================
import { createRouter, createWebHistory } from 'vue-router'
// Import View khách thuê, chủ xe
import WebLayout from '@/layouts/WebLayout.vue' // Import WebLayout
import HomeView from '@/views/web/HomeView.vue' // Import HomeView
import AboutView from '@/views/web/AboutView.vue' // Import AboutView
import VehicleView from '@/views/web/VehicleView.vue' // Import VehicleView
import VehicleDetailsView from '@/views/web/VehicleDetailsView.vue' // Import VehicleDetailsView
import CheckoutView from '@/views/web/CheckoutView.vue' // Import CheckoutView
import ProfileView from '@/views/web/ProfileView.vue' // Import ProfileView
import MyTripsView from '@/views/web/MyTripsView.vue' // Import MyTripsView
import FavoritesView from '@/views/web/FavoritesView.vue' // Import FavoritesView
import ChangePasswordView from '@/views/web/ChangePassword.vue' // Import ChangePasswordView
import KycVerificationView from '@/views/web/KycVerificationView.vue' // Import KycVerificationView
import GplxVerificationView from '@/views/web/GplxVerificationView.vue' // Import GplxVerificationView
import PaymentSuccessView from '@/views/web/PaymentSuccess.vue' // Import PaymentSuccessView
import PaymentFailedView from '@/views/web/PaymentFailed.vue' // Import PaymentFailedView
import TripDetailView from '@/views/web/TripDetailView.vue' // Import TripDetailView
import WalletView from '@/views/web/WalletView.vue' // Import WalletView
import PublicProfileView from '@/views/web/PublicProfileView.vue' // Import PublicProfileView
import AddVehicleView from '@/views/partner/AddVehicleView.vue' // Import AddVehicleView
import UpdateVehicleView from '@/views/partner/UpdateVehicleView.vue' // Import UpdateVehicleView
import MyCarsView from '@/views/partner/MyCarsView.vue' // Import MyCarsView

// Auth chủ xe khách thuê
import AuthLayout from '@/layouts/AuthLayout.vue' // Import AuthLayout
import LoginView from '@/views/auth/LoginView.vue' // Import LoginView
import RegisterView from '@/views/auth/RegisterView.vue' // Import RegisterView
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue' // Import ForgotPasswordView
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue' // Import ResetPasswordView


// Import View của Admin
import AdminLayout from '@/layouts/AdminLayout.vue' // Import AdminLayout
import DashboardView from '@/views/admin/DashboardView.vue' // Import DashboardView
import ReportsView from '@/views/admin/ReportsView.vue' // Import ReportsView
import VehicleManagementView from '@/views/admin/VehicleManagementView.vue' // Import VehicleManagementView
import VehicleDetailView from '@/views/admin/VehicleDetailView.vue' // Import VehicleDetailView
import KycApprovalView from '@/views/admin/KycApprovalView.vue' // Import KycApprovalView
import KycDetailView from '@/views/admin/KycDetailView.vue' // Import KycDetailView
import DisputeResolutionView from '@/views/admin/DisputeResolutionView.vue' // Import DisputeResolutionView
import UserManagementView from '@/views/admin/UserManagementView.vue' // Import UserManagementView
import UserDetailView from '@/views/admin/UserDetailView.vue' // Import UserDetailView
import AddAdminView from '@/views/admin/AddAdminView.vue' // Import AddAdminView
import PaymentGatewayConfigView from '@/views/admin/PaymentGatewayConfigView.vue' // Import PaymentGatewayConfigView
import AddPaymentGatewayView from '@/views/admin/AddPaymentGatewayView.vue' // Import AddPaymentGatewayView
import CampaignManagementView from '@/views/admin/CampaignManagementView.vue' // Import CampaignManagementView
import PromotionManagementView from '@/views/admin/PromotionManagementView.vue' // Import PromotionManagementView
import BannerManagementView from '@/views/admin/BannerManagementView.vue' // Import BannerManagementView
import SystemSettingsView from '@/views/admin/SystemSettingsView.vue' // Import SystemSettingsView

import AdminChangePasswordView from '@/views/admin/AdminChangePasswordView.vue' // Import AdminChangePasswordView
import AdminProfileView from '@/views/admin/AdminProfileView.vue' // Import AdminProfileView
import CategoryManagementView from '@/views/admin/CategoryManagementView.vue' // Import CategoryManagementView
import AddCategoryView from '@/views/admin/AddCategoryView.vue' // Import AddCategoryView
import BookingManagementView from '@/views/admin/BookingManagementView.vue' // Import BookingManagementView
import WithdrawalManagementView from '@/views/admin/WithdrawalManagementView.vue' // Import WithdrawalManagementView
import SupportTicketsView from '@/views/admin/SupportTicketsView.vue' // Import SupportTicketsView
import TransactionLogsView from '@/views/admin/TransactionLogsView.vue' // Import TransactionLogsView
import AdminBookingDetailView from '@/views/admin/AdminBookingDetailView.vue' // Import AdminBookingDetailView

// Auth admin
import AdminSigninView from '@/views/admin/auth/AdminSigninView.vue' // Import AdminSigninView
import AdminAuthLayout from '@/layouts/AdminAuthLayout.vue' // Import AdminAuthLayout
import AdminForgotPasswordView from '@/views/admin/auth/AdminForgotPasswordView.vue' // Import AdminForgotPasswordView
import AdminResetPasswordView from '@/views/admin/auth/AdminResetPasswordView.vue'
import { installRouteGuards } from './guards'

// ============================================================================
// 2. KHỞI TẠO BẮT TRI CHUNG TẠI HÌNH TRÌNH TỬ ROUTE (ROUTER DEFINITIONS)
// ============================================================================
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Route chính cho phần web
    {
      path: '/',
      component: WebLayout,
      children: [
        // trang home
        {
          path: '',
          name: 'home',
          component: HomeView,
        },

        // trang about
        {
          path: 'about',
          name: 'about',
          component: AboutView,
        },

        // trang vehicles
        {
          path: 'vehicles',
          name: 'vehicles',
          component: VehicleView,
        },

        // trang vehicle details
        {
          path: 'vehicle-details/:id',
          name: 'vehicle-details',
          component: VehicleDetailsView,
        },

        // trang checkout
        {
          path: 'checkout',
          name: 'checkout',
          component: CheckoutView,
          meta: {
            requiresAuth: true,
            renterOnly: true,
          },
        },

        // trang profile
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
          meta: {
            requiresAuth: true,
          },
        },

        // trang public user profile
        {
          path: 'profile/:id',
          name: 'public-profile',
          component: PublicProfileView,
        },

        // trang my trips
        {
          path: 'my-trips',
          name: 'my-trips',
          component: MyTripsView,
          meta: {
            requiresAuth: true,
            renterOnly: true,
          },
        },

        // trang xe yêu thích
        {
          path: 'favorites',
          name: 'favorites',
          component: FavoritesView,
          meta: {
            requiresAuth: true,
            renterOnly: true,
          },
        },

        // trang ví
        {
          path: 'wallet',
          name: 'wallet',
          component: WalletView,
          meta: {
            requiresAuth: true,
          },
        },

        // trang đổi mật khẩu dùng chung cho khách thuê và chủ xe
        {
          path: 'change-password',
          name: 'change-password',
          component: ChangePasswordView,
          meta: {
            requiresAuth: true,
          },
        },

        // trang trung tâm hỗ trợ / khiếu nại
        {
          path: 'support-center',
          name: 'support-center',
          component: () => import('@/views/web/SupportCenterView.vue'),
          meta: {
            requiresAuth: true,
          },
        },

        // trang xác thực KYC
        {
          path: 'kyc-verification',
          name: 'kyc-verification',
          component: KycVerificationView,
          meta: {
            requiresAuth: true,
          },
        },

        // trang xác thực GPLX
        {
          path: 'gplx-verification',
          name: 'gplx-verification',
          component: GplxVerificationView,
          meta: {
            requiresAuth: true,
          },
        },

        // trang thanh toán thành công
        {
          path: 'payment/success',
          name: 'payment-success',
          component: PaymentSuccessView,
          meta: {
            requiresAuth: true,
          },
        },

        // trang thanh toán thất bại
        {
          path: 'payment/failed',
          name: 'payment-failed',
          component: PaymentFailedView,
          meta: {
            requiresAuth: true,
          },
        },

        // trang chi tiết chuyến đi
        {
          path: 'trip-details/:id',
          name: 'trip-details',
          component: TripDetailView,
          meta: {
            requiresAuth: true,
          },
        },

        // trang thêm xe (dành cho chủ xe/đối tác)
        {
          path: 'partner/add-vehicle',
          name: 'partner-add-vehicle',
          component: AddVehicleView,
          meta: {
            requiresAuth: true,
            ownerOnly: true, // Chặn: Chỉ Chủ xe (owner/partner) mới được vào
          },
        },
        // trang cập nhật xe
        {
          path: 'partner/edit-vehicle/:id',
          name: 'partner-edit-vehicle',
          component: UpdateVehicleView,
          meta: {
            requiresAuth: true,
            ownerOnly: true,
          },
        },

        {
          path: 'partner/my-cars',
          name: 'MyCars',
          component: MyCarsView,
          meta: { requiresAuth: true },
        },

        // Redirect old notifications to new tab
        {
          path: 'partner/requests',
          redirect: to => {
            return { path: '/partner/my-cars', query: { tab: 'requests' } }
          }
        },
      ],
    },

    // Route cho trang đăng nhập
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        // Trang đăng nhập
        {
          path: 'login',
          name: 'login',
          component: LoginView,
          meta: {
            guestOnly: true,
          },
        },

        // Trang đăng ký
        {
          path: 'register',
          name: 'register',
          component: RegisterView,
          meta: {
            guestOnly: true,
          },
        },

        // Trang quên mật khẩu
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: ForgotPasswordView,
          meta: {
            guestOnly: true,
          },
        },

        // Trang đặt lại mật khẩu
        {
          path: 'reset-password',
          name: 'reset-password',
          component: ResetPasswordView,
          meta: {
            guestOnly: true,
          },
        },

        // Nếu bạn có trang đăng ký, bạn có thể thêm vào đây
        // {
      ],
    },

    // Route cho trang admin
    {
      path: '/admin',
      component: AdminLayout,
      meta: {
        requiresAuth: true,
        roles: ['admin', 'coordinator', 'master_admin', 'ops_admin', 'support', 'staff', 'cskh'],
      },
      children: [
        {
          path: '',
          redirect: { name: 'admin-dashboard' },
        },

        // Trang dashboard
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: DashboardView,
        },

        // Trang báo cáo
        {
          path: 'reports',
          name: 'admin-reports',
          component: ReportsView,
          meta: { roles: ['admin', 'coordinator', 'master_admin', 'ops_admin'] },
        },

        // Trang quản lý xe
        {
          path: 'vehicles',
          name: 'admin-vehicle-management',
          component: VehicleManagementView,
          meta: { roles: ['admin', 'coordinator', 'master_admin', 'ops_admin', 'support', 'staff', 'cskh'] },
        },

        // Trang chi tiết xe
        {
          path: 'vehicles/:id',
          name: 'admin-vehicle-detail',
          component: VehicleDetailView,
          meta: { roles: ['admin', 'coordinator', 'master_admin', 'ops_admin', 'support', 'staff', 'cskh'] },
        },

        // Trang duyệt KYC
        {
          path: 'kyc-approval',
          name: 'admin-kyc-approval',
          component: KycApprovalView,
          meta: { roles: ['admin', 'coordinator', 'master_admin', 'ops_admin', 'support', 'staff', 'cskh'] },
        },

        // Trang chi tiết KYC
        {
          path: 'kyc-approval/:id',
          name: 'admin-kyc-detail',
          component: KycDetailView,
          meta: { roles: ['admin', 'coordinator', 'master_admin', 'ops_admin', 'support', 'staff', 'cskh'] },
        },

        // Trang giải quyết tranh chấp
        {
          path: 'dispute-resolution',
          redirect: { name: 'admin-support-tickets' },
        },
        {
          path: 'dispute-resolution/:id',
          name: 'admin-dispute-resolution',
          component: DisputeResolutionView,
        },

        // Trang quản lý người dùng
        {
          path: 'user-management',
          name: 'admin-user-management',
          component: UserManagementView,
          meta: { roles: ['admin', 'coordinator', 'master_admin', 'ops_admin', 'support', 'staff', 'cskh'] },
        },

        // Trang chi tiết người dùng
        {
          path: 'users/:id',
          name: 'admin-user-detail',
          component: UserDetailView,
          meta: { roles: ['admin', 'coordinator', 'master_admin', 'ops_admin', 'support', 'staff', 'cskh'] },
        },

        // Trang thêm admin mới
        {
          path: 'add-admin',
          name: 'admin-add-admin',
          component: AddAdminView,
          meta: { roles: ['admin', 'master_admin', 'ops_admin'] },
        },

        // Trang cấu hình cổng thanh toán
        {
          path: 'payment-gateway-config',
          name: 'admin-payment-gateway-config',
          component: PaymentGatewayConfigView,
          meta: { roles: ['admin', 'master_admin', 'ops_admin'] },
        },

        // Trang thêm cổng thanh toán mới
        {
          path: 'add-payment-gateway',
          name: 'admin-add-payment-gateway',
          component: AddPaymentGatewayView,
          meta: { roles: ['admin', 'master_admin', 'ops_admin'] },
        },

        // Trang danh sách khuyến mãi
        {
          path: 'promotion-management',
          name: 'admin-promotion-management',
          component: PromotionManagementView,
          meta: { roles: ['admin', 'master_admin', 'ops_admin'] },
        },

        // Trang tạo/chỉnh sửa chiến dịch
        {
          path: 'campaign-management',
          name: 'admin-campaign-management',
          component: CampaignManagementView,
          meta: { roles: ['admin', 'master_admin', 'ops_admin'] },
        },

        // Trang quản lý banner
        {
          path: 'banner-management',
          name: 'admin-banner-management',
          component: BannerManagementView,
          meta: { roles: ['admin', 'master_admin', 'ops_admin'] },
        },

        // Trang cấu hình hệ thống
        {
          path: 'system-settings',
          name: 'admin-system-settings',
          component: SystemSettingsView,
          meta: { roles: ['admin', 'master_admin', 'ops_admin'] },
        },




        // Trang thông tin cá nhân cho admin
        {
          path: 'profile',
          name: 'admin-profile',
          component: AdminProfileView,
        },

        // Trang đổi mật khẩu cho admin
        {
          path: 'change-password',
          name: 'admin-change-password',
          component: AdminChangePasswordView,
        },

        // Trang quản lý danh mục
        {
          path: 'category-management',
          name: 'admin-category-management',
          component: CategoryManagementView,
          meta: { roles: ['admin', 'master_admin', 'ops_admin'] },
        },

        // Trang thêm danh mục mới
        {
          path: 'add-category',
          name: 'admin-add-category',
          component: AddCategoryView,
          meta: { roles: ['admin', 'master_admin', 'ops_admin'] },
        },

        // Trang quản lý đặt xe
        {
          path: 'booking-management',
          name: 'admin-booking-management',
          component: BookingManagementView,
        },

        // Trang chi tiết chuyến đi
        {
          path: 'withdrawal-management',
          name: 'admin-withdrawal-management',
          component: WithdrawalManagementView,
          meta: { roles: ['admin', 'coordinator', 'master_admin', 'ops_admin'] },
        },
        // Hỗ trợ redirect cho các thông báo cũ
        {
          path: 'withdrawals',
          redirect: '/admin/withdrawal-management',
          meta: { roles: ['admin', 'coordinator', 'master_admin', 'ops_admin'] },
        },

        // Trang quản lý ticket hỗ trợ
        {
          path: 'support-tickets',
          name: 'admin-support-tickets',
          component: SupportTicketsView,
        },

        // Trang quản lý log giao dịch
        {
          path: 'transaction-logs',
          name: 'admin-transaction-logs',
          component: TransactionLogsView,
          meta: { roles: ['admin', 'coordinator', 'master_admin', 'ops_admin'] },
        },

        // Trang chi tiết đơn đặt xe
        {
          path: '/admin/bookings/:id',
          name: 'admin-booking-detail',
          component: AdminBookingDetailView,
        },
      ],
    },

    // Route cho trang đăng nhập admin
    {
      path: '/admin/signin',
      component: AdminAuthLayout,
      children: [
        {
          path: '',
          name: 'admin-signin',
          component: AdminSigninView,
          meta: {
            guestOnly: true,
          },
        },
        {
          path: 'forgot-password',
          name: 'admin-forgot-password',
          component: AdminForgotPasswordView,
          meta: {
            guestOnly: true,
          },
        },

        {
          path: 'reset-password',
          name: 'admin-reset-password',
          component: AdminResetPasswordView,
          meta: { guestOnly: true },
        },
      ],
    },

    {
      path: '/admin/login',
      redirect: '/admin/signin',
    },

    // (Admin signup removed — accounts managed by master admin)
  ],
})

// ============================================================================
// 3. BỘ CHỐT CHẶN TIỀN XỬ LÝ & DỌN DẸP GIAO DIỆN (UI CLEANUP BEFORE EACH)
// ============================================================================
// DỌN RÁC BOOTSTRAP TRƯỚC KHI CHUYỂN TRANG
router.beforeEach((to, from) => {
  // 3.1. Xóa tất cả các lớp nền đen bị kẹt lại do modal Bootstrap cũ chưa tắt hẳn
  document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove())

  // 3.2. Mở khóa cuộn chuột cho body
  document.body.classList.remove('modal-open')
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''

  return true
})

// ============================================================================
// 4. TRÌNH XUẤT XƯỞNG ROUTER & CÀI ĐẶT BẢO MẬT PHÂN QUYỀN (ROUTER EXPORT)
// ============================================================================
export default router

// Kích hoạt bộ lọc bảo mật và phân vùng vai trò (RBAC Route Guards) cho bộ định hướng
installRouteGuards(router)
