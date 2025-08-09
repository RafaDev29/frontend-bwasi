<template>
    <!-- Modal centrado -->
    <div :class="'fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999]'">
      <div class="modal-content max-h-[95vh] overflow-y-auto">
        <h2 class="text-white text-lg mb-4 text-center">Área de Dibujo</h2>
  
        <!-- Área de dibujo con Konva -->
        <v-stage
          ref="stage"
          :config="{ width: 800, height: 800 }"
          @click="handleStageClick"
        >
          <v-layer>
            <!-- Imagen de fondo -->
            <v-image :config="backgroundImageConfig" />
  
            <!-- Líneas conectadas de cada área -->
            <v-line
              v-for="(area, index) in areas"
              :key="index"
              :config="{
                points: area.points.flatMap((p) => [p.x, p.y]),
                stroke: 'red',
                strokeWidth: 2,
                lineJoin: 'round',
                closed: true,
                fill: 'rgba(255, 0, 0, 0.3)',
              }"
            />
  
            <!-- Puntos trazados del área actual -->
            <v-circle
              v-for="(point, index) in currentArea"
              :key="index"
              :config="{
                x: point.x,
                y: point.y,
                radius: 5,
                fill: 'yellow',
              }"
            />
            <!-- Línea temporal -->
            <v-line
              :config="{
                points: currentArea.flatMap((p) => [p.x, p.y]),
                stroke: '#497fae',
                strokeWidth: 2,
                dash: [10, 5],
              }"
            />
          </v-layer>
        </v-stage>
  
        <!-- Botones -->
        <div class="text-center mt-4 flex">
          <button
            class="px-4 py-2 bg-[#396895] text-white rounded hover:bg-[#396895] mr-2"
            @click="clearCanvas"
          >
            Limpiar Todo
          </button>
  
          <button
            class="px-4 py-2 bg-[#396895] text-white rounded hover:bg-[#396895] mr-2"
            @click="$emit('close')"
          >
            Cancelar
          </button>
        </div>
  
        <!-- Lista de coordenadas -->
        <div class="mt-4 bg-gray-900 p-2 rounded text-white">
          <h3 class="text-center text-sm mb-2">Coordenadas de Áreas</h3>
          <div v-for="(area, index) in areas" :key="index" class="mb-2">
            <strong>Área {{ index + 1 }}:</strong>
            <span v-for="(point, pIndex) in area.points" :key="pIndex">
              ({{ point.x }}, {{ point.y }})
            </span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ModalPlane",
    data() {
      return {
        areas: [], // Almacena las áreas completadas
        currentArea: [], // Almacena el área que se está dibujando
        backgroundImageConfig: {}, // Configuración de la imagen de fondo
      };
    },
    methods: {
      handleStageClick() {
        const stage = this.$refs.stage.getStage();
        const pointerPos = stage.getPointerPosition();
  
        // Agregar un punto al área actual
        this.currentArea.push({ x: pointerPos.x, y: pointerPos.y });
  
        // Verificar si se cierra el área
        if (this.currentArea.length > 2) {
          const firstPoint = this.currentArea[0];
          const lastPoint = this.currentArea[this.currentArea.length - 1];
  
          const distance = Math.hypot(
            lastPoint.x - firstPoint.x,
            lastPoint.y - firstPoint.y
          );
  
          if (distance < 10) {
            // Cierra el área y la guarda
            this.currentArea[this.currentArea.length - 1] = firstPoint;
            this.areas.push({ points: [...this.currentArea] });
            this.currentArea = []; // Reiniciar el área actual
          }
        }
      },
      clearCanvas() {
        this.areas = [];
        this.currentArea = [];
      },
      loadBackgroundImage() {
        const image = new window.Image();
        image.src = require("@/assets/login/plano.png"); // Ruta a la imagen
  
        image.onload = () => {
          this.backgroundImageConfig = {
            image,
            x: 0,
            y: 0,
            width: 800,
            height: 800,
          };
        };
      },
    },
    mounted() {
      this.loadBackgroundImage();
    },
  };
  </script>
  
  <style scoped>
  .modal-content {
    width: 820px;
    background: #222;
    border-radius: 8px;
    padding: 16px;
  }
  </style>
  