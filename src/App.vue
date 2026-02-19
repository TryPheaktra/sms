<template>
  <div class="h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <form @submit.prevent="handleSubmit" class="bg-white/80 border-white border-2 shadow-2xl shadow-zinc-200/50 rounded-4xl pt-6 pb-8 space-y-2">

        <img src="./assets/logo.png" alt="Logo" class="h-12 mx-auto mb-4">

        <div class="overflow-auto px-8 space-y-2">
          <!-- Title -->
          <div class="flex flex-col gap-1">  
            <label class="w-32 text-gray-700 text-sm font-medium">Title</label>
            <select v-model="formData.title" class="field">
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Dr.">Dr.</option>
            </select>
          </div>

          <!-- Full Name -->
          <div class="flex flex-col gap-1">
            <label class="w-32 text-gray-700 text-sm font-medium">Full Name <span class="text-red-500">*</span></label>
            <input v-model="formData.fullName" type="text" required class="field" :class="{ 'border-red-500': errors.fullName }"/>
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-1">
            <label class="w-32 text-gray-700 text-sm font-medium">E-mail <span class="text-red-500">*</span></label>
            <input v-model="formData.email" type="email" required class="field" :class="{ 'border-red-500': errors.email }"/>
          </div>

          <!-- Phone -->
          <div class="flex flex-col gap-1">
            <label class="w-32 text-gray-700 text-sm font-medium">Phone</label>
            <input v-model="formData.phone" type="tel" class="field"/>
          </div>

          <!-- Subject -->
          <div class="flex flex-col gap-1">
            <label class="w-32 text-gray-700 text-sm font-medium">Subject <span class="text-red-500">*</span></label>
            <input v-model="formData.subject" type="text" required class="field" :class="{ 'border-red-500': errors.subject }"/>
          </div>

          <!-- Message -->
          <div class="flex flex-col gap-1">
            <label class="w-32 text-gray-700 text-sm font-medium">Message <span class="text-red-500">*</span></label>
            <textarea v-model="formData.message" rows="3" required class="field resize-none" :class="{ 'border-red-500': errors.message }"></textarea>
          </div>

          <!-- Turnstile -->
          <div class="w-full flex turnstile-wrapper rounded-2xl overflow-hidden justify-center mt-4">
            <Turnstile :site-key="siteKey" v-model="token" theme="light"/>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-center gap-4 mt-6 border-t border-zinc-200 pt-6">
          <button type="submit" :disabled="isSubmitting || !token"  class="bg-[#174c83] hover:bg-[#123a62] text-white font-medium py-2 px-6 rounded-xl cursor-pointer shadow-sm transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
            Send
          </button>
          <button type="button" @click="resetForm" class="bg-red-500/10 hover:bg-red-500/15 active:bg-red-500/10 text-red-500 font-medium py-2 px-6 rounded-xl cursor-pointer transition duration-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
            </svg>
            Reset
          </button>
        </div>
        <span v-if="!token && !isSubmitting" class="text-red-500 text-sm mt-1">
          Please complete Turnstile verification
        </span>
      </form>
    </div>
  </div>

  <!-- Success Message -->
  <Transition name="fade">
    <div v-if="showSuccess" class="bg-white/80 backdrop-blur-sm border border-white px-4 py-3 rounded-2xl absolute top-4 transform right-4 shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
      </svg>
      <span class="block sm:inline">Form submitted successfully!</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Turnstile } from '@sctg/turnstile-vue3';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

// Turnstile
const token = ref<string>('');
const siteKey = import.meta.env.VITE_TURNSTILE_SITEKEY as string;

// Form data
const formData = reactive({
  company: "6",
  langId: 1,
  userId: 0,
  uuid: "",
  title: "Mr.",
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  remark: "",
  statusId: 1
});

// Validation errors
const errors = reactive<Record<string, boolean>>({
  fullName: false,
  email: false,
  subject: false,
  message: false
});

const isSubmitting = ref(false);
const showSuccess = ref(false);

// Reset form
const resetForm = () => {
  formData.title = 'Mr.';
  formData.fullName = '';
  formData.email = '';
  formData.phone = '';
  formData.subject = '';
  formData.message = '';
  Object.keys(errors).forEach(key => errors[key] = false);
  showSuccess.value = false;
};

// Form validation
const validateForm = (): boolean => {
  let isValid = true;
  Object.keys(errors).forEach(key => errors[key] = false);

  if (!formData.fullName.trim()) { errors.fullName = true; isValid = false; }
  if (!formData.email.trim()) { errors.email = true; isValid = false; }
  if (!formData.subject.trim()) { errors.subject = true; isValid = false; }
  if (!formData.message.trim()) { errors.message = true; isValid = false; }

  return isValid;
};

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) return;

  if (!token.value) {
    toast.add({ severity: 'warn', summary: 'Human verification', detail: 'Please complete Turnstile verification', life: 3000 });
    return;
  }

  isSubmitting.value = true;

  try {
    // 1️⃣ Verify Turnstile via Worker
    const workerRes = await fetch(import.meta.env.VITE_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token.value })
    });

    const workerData = await workerRes.json();
    if (!workerData.success) {
      toast.add({ severity: 'error', summary: 'Verification failed', detail: 'Turnstile verification failed', life: 3000 });
      isSubmitting.value = false;
      return;
    }

    // 2️⃣ Send form data to API using FormData
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => form.append(key, value != null ? String(value) : ''));

    const apiUrl = import.meta.env.VITE_API_URL + 'sale/contact';
    const apiRes = await fetch(apiUrl, { method: 'POST', body: form });
    if (!apiRes.ok) throw new Error('Failed to submit form');

    // 3️⃣ Success feedback
    showSuccess.value = true;
    toast.add({ severity: 'success', summary: 'Success', detail: 'Form submitted successfully!', life: 3000 });
    resetForm();

    setTimeout(() => showSuccess.value = false, 3000);

  } catch (error: any) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Submission failed', life: 5000 });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ;
}
.fade-enter-from, .fade-leave-to {
  transition: opacity 0.3s ;
  opacity: 0;
}

.turnstile-wrapper iframe {
  border-radius: 1rem !important;
}
</style>
