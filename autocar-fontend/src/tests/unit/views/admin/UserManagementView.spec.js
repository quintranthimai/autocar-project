import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import flushPromises from 'flush-promises'
import UserManagementView from '@/views/admin/UserManagementView.vue'
import adminUserService from '@/services/admin-user.service'

// Giả lập service
vi.mock('@/services/admin-user.service', () => ({
  default: {
    getUsers: vi.fn(),
    getAssignableRoles: vi.fn(),
    getUserById: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}))

describe('UserManagementView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    adminUserService.getAssignableRoles.mockResolvedValue({ data: { success: true, data: [] } })
  })

  it('renders danh sách user khi lấy dữ liệu từ API thành công', async () => {
    const mockUsers = {
      data: {
        success: true,
        data: {
          data: [
            { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com', roles: [{ name: 'renter' }] },
            { id: 2, name: 'Trần Thị B', email: 'b@gmail.com', roles: [{ name: 'owner' }] },
          ],
          current_page: 1,
          last_page: 1,
          total: 2,
        },
      },
    }
    adminUserService.getUsers.mockResolvedValue(mockUsers)

    const wrapper = mount(UserManagementView, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: { auth: { user: { roles: [{ slug: 'master_admin' }] } } },
          }),
        ],
        // Ép router-link hiển thị nội dung bên trong thay vì stub rỗng
        stubs: { 'router-link': { template: '<a><slot/></a>' } },
      },
    })

    await flushPromises()

    expect(adminUserService.getUsers).toHaveBeenCalledTimes(1)

    // Dùng wrapper.text() thay vì html() để test an toàn hơn
    expect(wrapper.text()).toContain('Nguyễn Văn A')
    expect(wrapper.text()).toContain('Trần Thị B')
  })

  it('gọi API tìm kiếm khi nhấn Enter trong ô filter', async () => {
    adminUserService.getUsers.mockResolvedValue({
      data: { success: true, data: { data: [], total: 0 } },
    })

    const wrapper = mount(UserManagementView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { 'router-link': { template: '<a><slot/></a>' } },
      },
    })

    // Chờ Mounted gọi API lần 1
    await flushPromises()

    // Xóa lịch sử gọi API để đếm lại từ đầu
    adminUserService.getUsers.mockClear()

    // Nhập từ khóa rồi nhấn Enter
    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('Nguyen')
    await searchInput.trigger('keyup.enter')

    await flushPromises()

    // Kỳ vọng API được gọi lại đúng 1 lần
    expect(adminUserService.getUsers).toHaveBeenCalledTimes(1)
  })
})
