import axios from 'axios'

// Lấy Key Goong từ file .env
const GOONG_API_KEY = import.meta.env.VITE_GOONG_API_KEY || ''

const geoCache = {
  cities: null,
  districts: {},
  wards: {},
}

class LocationService {
  normalizeText(value) {
    return (value || '').toString().trim().replace(/\s+/g, ' ')
  }

  // Lấy phần đầu địa chỉ (thường là số nhà + tên đường) để đưa vào ô street.
  extractStreetLine(data) {
    if (!data) return ''

    const displayName = this.normalizeText(data.display_name)
    if (displayName) {
      return this.normalizeText(displayName.split(',')[0] || '')
    }

    return this.normalizeText(data.name)
  }

  // ==========================================
  // HÀM FORMAT ĐỊA CHỈ (Đã được thêm lại)
  // ==========================================
  formatVietnameseAddress(data) {
    if (!data) return null
    const displayName = this.normalizeText(data.display_name)
    if (!displayName) return null

    const parts = displayName
      .split(',')
      .map((part) => this.normalizeText(part))
      .filter((part) => part)
      .filter((part) => !/^việt nam$/i.test(part) && !/^vietnam$/i.test(part))
      .filter((part) => !/^\d{5,6}$/.test(part))

    return parts.slice(0, 4).join(', ')
  }

  // ==========================================
  // 1. TÌM KIẾM ĐỊA CHỈ (DÙNG GOONG API)
  // ==========================================
  async searchAddress(query) {
    if (!query || query.trim() === '' || !GOONG_API_KEY) {
      console.warn('Thiếu từ khóa hoặc chưa có VITE_GOONG_API_KEY')
      return []
    }

    const normalizedQuery = this.normalizeText(query)

    try {
      const url = `https://rsapi.goong.io/geocode?address=${encodeURIComponent(normalizedQuery)}&api_key=${GOONG_API_KEY}`
      const response = await axios.get(url, { timeout: 8000 })

      if (response.data?.status === 'OK' && response.data.results) {
        return response.data.results.map((item) => {
          const formattedAddress = this.normalizeText(item.formatted_address)
          const mainText = formattedAddress.split(',')[0] || formattedAddress
          return {
            name: mainText,
            display_name: formattedAddress,
            lat: item.geometry.location.lat,
            lng: item.geometry.location.lng,
            source: 'goong',
          }
        })
      }
      return []
    } catch (error) {
      console.error('Lỗi kết nối Goong API Geocoding:', error)
      return []
    }
  }

  // ==========================================
  // 2. LẤY ĐỊA CHỈ TỪ TỌA ĐỘ GPS (DÙNG GOONG API)
  // ==========================================
  async getAddressFromCoords(lat, lng) {
    if (!GOONG_API_KEY) return null

    try {
      const url = `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${GOONG_API_KEY}`
      const response = await axios.get(url, { timeout: 8000 })

      if (response.data?.status === 'OK' && response.data.results?.length > 0) {
        const item = response.data.results[0]
        const formattedAddress = this.normalizeText(item.formatted_address)
        return {
          name: formattedAddress.split(',')[0],
          display_name: formattedAddress,
          lat: item.geometry.location.lat,
          lng: item.geometry.location.lng,
          source: 'goong',
        }
      }
      return null
    } catch (error) {
      console.error('Lỗi Goong Reverse Geocoding:', error)
      return null
    }
  }

  // ==========================================
  // 3. API ĐỊA CHÍNH ESGOO (Giữ nguyên cho Tỉnh/Quận/Phường)
  // ==========================================
  async getCities() {
    if (geoCache.cities) return geoCache.cities
    try {
      const res = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm')
      if (res.data.error === 0) {
        geoCache.cities = res.data.data
        return geoCache.cities
      }
    } catch (error) {
      console.error('Lỗi tải Tỉnh/Thành:', error)
    }
    return []
  }

  async getDistricts(cityId) {
    if (!cityId) return []
    if (geoCache.districts[cityId]) return geoCache.districts[cityId]
    try {
      const res = await axios.get(`https://esgoo.net/api-tinhthanh/2/${cityId}.htm`)
      if (res.data.error === 0) {
        geoCache.districts[cityId] = res.data.data
        return geoCache.districts[cityId]
      }
    } catch (error) {
      console.error('Lỗi tải Quận/Huyện:', error)
    }
    return []
  }

  async getWards(districtId) {
    if (!districtId) return []
    if (geoCache.wards[districtId]) return geoCache.wards[districtId]
    try {
      const res = await axios.get(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`)
      if (res.data.error === 0) {
        geoCache.wards[districtId] = res.data.data
        return geoCache.wards[districtId]
      }
    } catch (error) {
      console.error('Lỗi tải Phường/Xã:', error)
    }
    return []
  }
}

export default new LocationService()
