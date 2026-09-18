import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import flushPromises from 'flush-promises'
import UserDetailView from '@/views/admin/UserDetailView.vue'
import adminUserService from '@/services/admin-user.service'

// 1. Giả lập module vue-router, luôn trả về id 99 ngay lập tức
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '99' },
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}))

// 2. Giả lập Service
vi.mock('@/services/admin-user.service', () => ({
  default: { getUserById: vi.fn() },
}))

describe('UserDetailView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders đúng thông tin và các Tabs của User khi gọi API detail', async () => {
    // Dữ liệu giả lập
    const mockDetail = {
      data: {
        success: true,
        data: {
          id: 99,
          name: 'Trần Mai Quỳnh',
          email: 'quynh@gmail.com',
          roles: [{ name: 'Chủ xe', slug: 'owner' }],
          vehicles: {
            data: [{ id: 1, car_model: { brand_name: 'Toyota', model_name: 'Vios' } }],
            current_page: 1,
            last_page: 1,
            total: 1,
          },
          bookings: null,
        },
      },
    }
    adminUserService.getUserById.mockResolvedValue(mockDetail)

    const wrapper = mount(UserDetailView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { RouterLink: { template: '<a><slot/></a>' } }, // Fix lỗi RouterLink
      },
    })

    // Chờ component xử lý DOM và gọi API
    await flushPromises()

    // 1. Kiểm tra API gọi đúng tham số
    expect(adminUserService.getUserById).toHaveBeenCalledWith('99', expect.anything())

    // 2. Kiểm tra giao diện
    expect(wrapper.text()).toContain('Trần Mai Quỳnh')
    expect(wrapper.text()).toContain('quynh@gmail.com')
  })

  it('hiển thị Tab Xe (Vehicles) nếu user là chủ xe', async () => {
    adminUserService.getUserById.mockResolvedValue({
      data: {
        success: true,
        data: {
          id: 99,
          name: 'Quỳnh',
          roles: [{ slug: 'owner' }],
          vehicles: {
            data: [{ id: 1, car_model: { brand_name: 'Toyota', model_name: 'Vios' } }],
            current_page: 1,
            last_page: 1,
            total: 1,
          },
        },
      },
    })

    const wrapper = mount(UserDetailView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { RouterLink: { template: '<a><slot/></a>' } },
      },
    })

    await flushPromises()

    // Tìm và click vào Tab "Xe"
    const vehicleTabBtn = wrapper
      .findAll('button.nav-link')
      .find((btn) => btn.text().includes('Xe'))
    if (vehicleTabBtn) {
      await vehicleTabBtn.trigger('click')
    }

    await flushPromises()

    // Xác nhận render ra dữ liệu hãng xe
    expect(wrapper.text()).toContain('Toyota')
  })
})
