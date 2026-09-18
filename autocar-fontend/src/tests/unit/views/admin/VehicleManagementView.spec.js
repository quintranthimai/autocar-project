import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import VehicleManagementView from '@/views/admin/VehicleManagementView.vue'
import adminVehicleService from '@/services/admin-vehicle.service'

vi.mock('@/services/admin-vehicle.service', () => ({
  default: {
    getVehicles: vi.fn(),
  },
}))

describe('VehicleManagementView - search and filter integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()

    adminVehicleService.getVehicles.mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [],
          current_page: 1,
          last_page: 1,
        },
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('sends current status filter and search text together after debounce', async () => {
    const wrapper = mount(VehicleManagementView, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    await flushPromises()

    expect(adminVehicleService.getVehicles).toHaveBeenCalledTimes(1)
    expect(adminVehicleService.getVehicles).toHaveBeenLastCalledWith(1, 'all', '')

    const select = wrapper.find('select')
    await select.setValue('available')

    expect(adminVehicleService.getVehicles).toHaveBeenLastCalledWith(1, 'available', '')

    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('Nguyen')

    vi.advanceTimersByTime(500)
    await flushPromises()

    expect(adminVehicleService.getVehicles).toHaveBeenLastCalledWith(1, 'available', 'Nguyen')
  })

  it('resets to page 1 when status changes', async () => {
    const wrapper = mount(VehicleManagementView, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    await flushPromises()

    const select = wrapper.find('select')
    await select.setValue('locked')

    expect(adminVehicleService.getVehicles).toHaveBeenLastCalledWith(1, 'locked', '')
  })
})
