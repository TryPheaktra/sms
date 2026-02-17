<template>
  <div class="h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <form
        @submit.prevent="handleSubmit"
        class="bg-white/80 border-white border-2 shadow-2xl shadow-zinc-200/50 rounded-4xl pt-6 pb-8 space-y-2"
      >
        <img src="./assets/logo.png" alt="Logo" class="h-12 mx-auto mb-4" />

        <div class="overflow-auto px-8 space-y-2">

          <!-- Title -->
          <div class="flex flex-col gap-1">
            <label class="text-gray-700 text-sm font-medium">Title</label>
            <select v-model="formData.title" class="field">
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Dr.">Dr.</option>
            </select>
          </div>

          <!-- Full Name -->
          <div class="flex flex-col gap-1">
            <label class="text-gray-700 text-sm font-medium">
              Full Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.fullName"
              type="text"
              required
              class="field"
              :class="{ 'border-red-500': errors.fullName }"
            />
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-1">
            <label class="text-gray-700 text-sm font-medium">
              E-mail <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.email"
              type="email"
              required
              class="field"
              :class="{ 'border-red-500': errors.email }"
            />
          </div>

          <!-- Phone -->
          <div class="flex flex-col gap-1">
            <label class="text-gray-700 text-sm font-medium">Phone</label>
            <input v-model="formData.phone" type="tel" class="field" />
          </div>

          <!-- Subject -->
          <div class="flex flex-col gap-1">
            <label class="text-gray-700 text-sm font-medium">
              Subject <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.subject"
              type="text"
              required
              class="field"
              :class="{ 'border-red-500': errors.subject }"
            />
          </div>

          <!-- Message -->
          <div class="flex flex-col gap-1">
            <label class="text-gray-700 text-sm font-medium">
              Message <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="formData.message"
              rows="3"
              required
              class="field resize-none"
              :class="{ 'border-red-500': errors.message }"
            ></textarea>
          </div>

          <!-- Turnstile -->
          <div class="w-full flex justify-center mt-4">
            <Turnstile
              ref="turnstileRef"
              :key="turnstileKey"
              :site-key="siteKey"
              v-model="token"
              theme="light"
              @complete="handleSuccess"
            />
          </div>
        </div>

        <!-- Buttons -->
        <div
          class="flex justify-center gap-4 mt-6 border-t border-zinc-200 pt-6"
        >
          <button
            type="submit"
            :disabled="isSubmitting"
            class="bg-[#174c83] hover:bg-[#123a62] text-white font-medium py-2 px-6 rounded-xl transition duration-200 disabled:opacity-50"
          >
            Send
          </button>

          <button
            type="button"
            @click="resetForm"
            class="bg-red-500/10 hover:bg-red-500/15 text-red-500 font-medium py-2 px-6 rounded-xl transition duration-200"
          >
            Reset
          </button>
        </div>
      </form>
    </div>

    <!-- Success Message -->
    <Transition name="fade">
      <div
        v-if="showSuccess"
        class="bg-white/80 backdrop-blur-sm border border-white px-4 py-3 rounded-2xl absolute top-4 right-4 shadow-lg"
      >
        Form submitted successfully!
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import axios from "axios"
import { ref, reactive } from "vue"
import { Turnstile } from "@sctg/turnstile-vue3"

const siteKey = import.meta.env.VITE_TURNSTILE_SITEKEY as string

const token = ref("")
const turnstileRef = ref<any>(null)
const turnstileKey = ref(0) // 🔥 force re-render

const formData = reactive({
  title: "Mr.",
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
})

const errors = reactive<Record<string, boolean>>({
  fullName: false,
  email: false,
  subject: false,
  message: false
})

const isSubmitting = ref(false)
const showSuccess = ref(false)

const validateForm = () => {
  let valid = true
  Object.keys(errors).forEach(k => (errors[k] = false))

  if (!formData.fullName.trim()) {
    errors.fullName = true
    valid = false
  }
  if (!formData.email.trim()) {
    errors.email = true
    valid = false
  }
  if (!formData.subject.trim()) {
    errors.subject = true
    valid = false
  }
  if (!formData.message.trim()) {
    errors.message = true
    valid = false
  }

  return valid
}

const handleSuccess = () => {
  console.log("Turnstile token:", token.value)
}

const handleSubmit = async () => {
  if (!validateForm()) return

  if (!token.value) {
    alert("Please complete Turnstile verification.")
    return
  }

  isSubmitting.value = true

  try {
    const apiUrl = import.meta.env.VITE_API_URL + "sale/contact"

    const form = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, String(value))
    })

    await axios.post(apiUrl, form)

    showSuccess.value = true

    setTimeout(() => {
      showSuccess.value = false
      resetForm()
    }, 3000)

  } catch (err) {
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.title = "Mr."
  formData.fullName = ""
  formData.email = ""
  formData.phone = ""
  formData.subject = ""
  formData.message = ""

  Object.keys(errors).forEach(k => (errors[k] = false))

  token.value = ""

  // 🔥 Force Turnstile reset
  turnstileKey.value++
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.field {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  border-radius: 0.75rem;
  outline: none;
  transition: 0.2s;
}

.field:focus {
  border-color: #174c83;
}
</style>
