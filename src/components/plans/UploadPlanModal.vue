<template>
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 class="text-lg font-bold mb-4">Cargar Plano</h2>
        <form @submit.prevent="submitForm">
          <input
            type="file"
            @change="handleFileChange"
            accept="image/*"
            class="block w-full mb-4 border border-gray-300 rounded-lg"
          />
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-[#396895] text-white rounded-lg hover:bg-[#6999c2]"
            >
              Subir
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import {ref} from "vue"
  export default {
    props: {
      layoutId: {
        type: String,
        required: true,
      },
    },
    emits: ["close", "imageUploaded"],
    setup(props, { emit }) {
      const file = ref(null);
  
      const handleFileChange = (event) => {
        file.value = event.target.files[0];
      };
  
      const submitForm = () => {
        if (!file.value) return;
  
        const formData = new FormData();
        formData.append("image", file.value);
        const id = props.layoutId
        emit("imageUploaded", formData, id);
        emit("close");
      };
  
      return {
        handleFileChange,
        submitForm,
      };
    },
  };
  </script>
  