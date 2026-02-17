<template>
  <div class="h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <form @submit.prevent="handleSubmit" class="bg-white/80 border-white border-2 shadow-2xl shadow-zinc-200/50 rounded-4xl pt-6 pb-8 space-y-4">

        <!-- Logo -->
        <img src="./assets/logo.png" alt="Logo" class="h-12 mx-auto mb-4">

        <!-- Form fields -->
        <div class="space-y-4 px-8 overflow-auto">
          
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
            <input v-model="formData.fullName" type="text" required class="field" :class="{ 'border-red-500': errors.fullName }" />
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-1">
            <label class="text-gray-700 text-sm font-medium">
              E-mail <span class="text-red-500">*</span>
            </label>
            <input v-model="formData.email" type="email" required class="field" :class="{ 'border-red-500': errors.email }" />
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
            <input v-model="formData.subject" type="text" required class="field" :class="{ 'border-red-500': errors.subject }" />
          </div>

          <!-- Message -->
          <div class="flex flex-col gap-1">
            <label class="text-gray-700 text-sm font-medium">
              Message <span class="text-red-500">*</span>
            </label>
            <textarea v-model="formData.message" rows="3" required class="field resize-none" :class="{ 'border-red-500': errors.message }"></textarea>
          </div>

          <!-- Turnstile -->
          <div class="w-full flex turnstile-wrapper rounded-2xl overflow-hidden justify-center mt-4">
            <Turnstile
              :site-key="siteKey"
              v-model="token"
              theme="light"
              @complete="handleComplete"
            />
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-center gap-4 mt-6 border-t border-zinc-200 pt-6">
          <button type="submit" :disabled="isSubmitting"
            class="bg-[#174c83] hover:bg-[#123a62] text-white font-medium py-2 px-6 rounded-xl cursor-pointer shadow-sm transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Submit
          </button>

          <button type="button" @click="resetForm"
            class="bg-red-500/10 hover:bg-red-500/15 active:bg-red-500/10 text-red-500 font-medium py-2 px-6 rounded-xl cursor-pointer transition duration-200">
            Reset
          </button>
        </div>
      </form>
    </div>

    <!-- Success Message -->
    <Transition name="fade">
      <div v-if="showSuccess" class="bg-white/80 backdrop-blur-sm border border-white px-4 py-3 rounded-2xl absolute top-4 right-4 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>Form submitted successfully!</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Turnstile } from '@sctg/turnstile-vue3';

const siteKey = import.meta.env.VITE_TURNSTILE_SITEKEY;
const token = ref<string>('');

const formData = reactive({
  title: "Mr.",
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
});

const errors = reactive<Record<string, boolean>>({
  fullName: false,
  email: false,
  subject: false,
  message: false
});

const isSubmitting = ref(false);
const showSuccess = ref(false);

const validateForm = () => {
  let isValid = true;
  Object.keys(errors).forEach(k => errors[k] = false);

  if (!formData.fullName.trim()) { errors.fullName = true; isValid = false; }
  if (!formData.email.trim()) { errors.email = true; isValid = false; }
  if (!formData.subject.trim()) { errors.subject = true; isValid = false; }
  if (!formData.message.trim()) { errors.message = true; isValid = false; }

  return isValid;
};

const handleComplete = () => {
  console.log('Turnstile token (frontend-only):', token.value);
};

const handleSubmit = () => {
  if (!validateForm()) return;

  if (!token.value) {
    alert('Please complete Turnstile verification!');
    return;
  }

  isSubmitting.value = true;

  // Frontend-only submission: log data
  console.log('Form data + token (frontend-only):', { ...formData, token: token.value });

  showSuccess.value = true;

  setTimeout(() => {
    showSuccess.value = false;
    resetForm();
    isSubmitting.value = false;
  }, 3000);
};

const resetForm = () => {
  formData.title = 'Mr.';
  formData.fullName = '';
  formData.email = '';
  formData.phone = '';
  formData.subject = '';
  formData.message = '';
  Object.keys(errors).forEach(k => errors[k] = false);
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.turnstile-wrapper iframe {
  border-radius: 1rem !important; /* Rounded corners */
}
</style>
