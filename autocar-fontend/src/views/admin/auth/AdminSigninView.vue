<template>
    <div class="container d-flex align-items-center justify-content-center min-vh-100">
        <div class="card " style="max-width:420px; width:100%;">
            <div class="card-body p-5">
                <div class="text-center mb-3">
                    <a href="/admin/dashboard" class="mb-4 d-inline-block text-decoration-none">
                        <span class="fw-bold fs-4 text-primary">AutoCar</span>
                    </a>
                    <h1 class="card-title mb-5 h5">Sign in to your account</h1>
                </div>
                <form class="needs-validation mt-3" @submit.prevent="handleLogin" novalidate>
                    <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                        {{ errorMessage }}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Email address</label>
                        <input v-model="loginData.email" id="email" type="email" class="form-control"
                            placeholder="name@example.com" required autofocus :disabled="loading">
                        <div class="invalid-feedback">Please enter a valid email.</div>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label d-flex justify-content-between">
                            <span>Password</span>
                            <router-link :to="{ name: 'admin-forgot-password' }" class="small link-primary">Forgot
                                Password?</router-link>
                        </label>
                        <input id="password" v-model="loginData.password" type="password" class="form-control"
                            placeholder="Password" required minlength="6" :disabled="loading">
                        <div class="invalid-feedback">Please provide a password (min 6 characters).</div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="form-check">
                            <input id="remember" v-model="loginData.remember" class="form-check-input" type="checkbox"
                                :disabled="loading">
                            <label class="form-check-label small" for="remember">Remember me</label>
                        </div>
                    </div>
                    <button class="btn btn-primary w-100" type="submit" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                            aria-hidden="true"></span>
                        {{ loading ? 'Signing in...' : 'Sign in' }}
                    </button>
                </form>
                <div class="text-center mt-3 small text-muted">
                    Nếu bạn cần tài khoản admin, liên hệ Master Admin để được cấp.
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const ADMIN_ROLES = ['admin', 'coordinator', 'master_admin', 'ops_admin', 'support', 'staff', 'cskh']

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const errorMessage = ref('')

const loginData = reactive({
    email: '',
    password: '',
    remember: false
})

function getRoleSlugs(user) {
    return Array.isArray(user?.roles)
        ? user.roles.map((role) => (typeof role === 'string' ? role : role?.slug)).filter(Boolean)
        : []
}

const handleLogin = async () => {
    loading.value = true
    errorMessage.value = ''

    try {
        await authStore.login({
            email: loginData.email,
            password: loginData.password,
        })

        const currentUser = authStore.user || await authStore.fetchCurrentUser()
        const roleSlugs = getRoleSlugs(currentUser)
        const canUseAdminPortal = roleSlugs.some((role) => ADMIN_ROLES.includes(role))

        if (!canUseAdminPortal) {
            await authStore.logout()
            errorMessage.value = 'Tài khoản khách thuê/chủ xe không được phép đăng nhập trang admin.'
            return
        }

        // Điều hướng về admin dashboard
        router.push('/admin/dashboard')
    } catch (error) {
        console.error('Admin login error:', error)
        errorMessage.value =
            error.response?.data?.message ||
            'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.'
    } finally {
        loading.value = false
    }
}
</script>
