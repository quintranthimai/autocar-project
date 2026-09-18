import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import * as bootstrap from 'bootstrap'

const app = createApp(App)

window.addEventListener('click', (event) => {
  const dropdownToggle = event.target.closest('[data-bs-toggle="dropdown"]')
  if (dropdownToggle) {
    const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownToggle)
    dropdown.toggle()
  }

  const collapseToggle = event.target.closest('[data-bs-toggle="collapse"]')
  if (collapseToggle) {
    const targetSelector = collapseToggle.getAttribute('data-bs-target')
    const targetEl = document.querySelector(targetSelector)
    if (targetEl) {
      const collapse = bootstrap.Collapse.getOrCreateInstance(targetEl, { toggle: false })
      collapse.toggle()
    }
  }
})

app.use(createPinia())
app.use(router)

app.mount('#app')
