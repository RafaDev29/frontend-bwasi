<template>
  <div class="relative flex flex-col items-center">
    <h1 class="text-gray-700 font-bold text-lg mb-2 relative w-full">
      {{ name }}
      <!-- Ícono de editar -->
      <i class="mdi mdi-image-edit text-3xl cursor-pointer absolute top-0 right-16 text-gray-700 hover:text-[#497fae]"
        @click="openUploadPlans"></i>
      <!-- Ícono de crear -->
      <i :class="[
        'mdi text-3xl cursor-pointer absolute top-0 right-4',
        drawMode ? 'mdi-pencil-box-outline text-[#099cb4]' : 'mdi-pencil-box-outline text-gray-700 hover:text-#497fae-500'
      ]" @click="toggleDrawMode"></i>
      <!-- Ícono de cancelar dibujo -->
      <i v-if="drawMode && currentArea.length > 0"
        class="mdi mdi-close-circle-outline text-3xl cursor-pointer absolute top-0 right-28 text-gray-700 hover:text-red-500"
        @click="cancelDraw"></i>
    </h1>

    <div class="relative border border-gray-300 rounded-lg shadow-md">
      <v-stage ref="stage" :config="stageConfig">
        <v-layer>
          <!-- Imagen de fondo -->
          <v-image v-if="backgroundimage" :config="{
            image: backgroundImg,
            width: stageConfig.width,
            height: stageConfig.height
          }" />

          <!-- Áreas existentes -->
          <template v-for="area in areas" :key="area._id">
            <v-shape :config="{
              sceneFunc: (context, shape) => {
                const points = parseCoordinates(area.coordinates);
                context.beginPath();
                if (points.length > 0) {
                  context.moveTo(points[0].x, points[0].y);
                  for (let i = 1; i < points.length; i++) {
                    context.lineTo(points[i].x, points[i].y);
                  }
                  context.closePath();
                }
                context.fillStrokeShape(shape);
              },
              fill: 'rgba(191, 211, 230, 0.3)',
              stroke: '#396895',
              strokeWidth: 2
            }" />
            <v-text :config="{
              text: area.name,
              x: calculateAreaCenter(parseCoordinates(area.coordinates)).x,
              y: calculateAreaCenter(parseCoordinates(area.coordinates)).y,
              fontSize: 16,
              fontFamily: 'Arial',
              fill: 'black',
              align: 'center',
              verticalAlign: 'middle'
            }" />
          </template>

          <!-- Área que se está dibujando actualmente -->
          <v-line v-if="currentArea.length > 0 && drawMode" :config="{
            points: [...currentArea, mousePosition.x, mousePosition.y],
            stroke: '#497fae',
            strokeWidth: 2,
            dash: [5, 5],
            closed: false
          }" />
        </v-layer>
      </v-stage>

      <!-- Botones de control -->

      <button v-if="!backgroundimage" @click="openUploadPlans"
        class="text-white bg-[#6999c2] hover:bg-[#28415c] focus:ring-4 focus:outline-none focus:ring-#497fae-300 font-medium rounded-lg text-base px-15 py-6 absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/4 flex items-center justify-center"
        style="writing-mode: horizontal-tb; text-orientation: mixed;">
        Cargar plano
      </button>


    </div>

    <!-- Modal para selección de área -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-4 rounded shadow-lg w-96">
        <h2 class="text-lg font-bold mb-4">Asignar Área</h2>
        <label for="area-select" class="block text-sm font-medium text-gray-700">Selecciona el área:</label>
        <select id="area-select" v-model="selectedAreaId"
          class="mt-2 block w-full p-2 border border-gray-300 rounded-md">
          <option v-for="area in areas" :key="area._id" :value="area._id">
            {{ area.name }}
          </option>
        </select>
        <div class="mt-4 flex justify-end">
          <button class="px-4 py-2 bg-[#396895] text-white rounded hover:bg-[#396895] mr-2" @click="confirmAreaSelection">
            Confirmar
          </button>
          <button class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" @click="closeModal">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    backgroundimage: {
      type: String,
      required: true,
    },
    areas: {
      type: Array,
      required: true,
    },
  },

  emits: ['uploadPlans', 'areaSelected'],

  setup(props, { emit }) {
    const stageConfig = {
      width: 1300,
      height: 570,
    };

    const stage = ref(null);
    const backgroundImg = ref(null);
    const drawMode = ref(false);
    const showModal = ref(false);
    const selectedAreaId = ref(null);
    const currentArea = ref([]);
    const coordinatesString = ref('');
    const mousePosition = ref({ x: 0, y: 0 });
    const cancelDraw = () => {
      currentArea.value = [];
    };


    const handleMouseMove = () => {
      const stageNode = stage.value.getNode();
      const pointer = stageNode.getPointerPosition();
      mousePosition.value = pointer || { x: 0, y: 0 };
    };



    const calculateAreaCenter = (points) => {
      const totalPoints = points.length;
      const sum = points.reduce(
        (acc, point) => {
          acc.x += point.x;
          acc.y += point.y;
          return acc;
        },
        { x: 0, y: 0 }
      );

      return {
        x: sum.x / totalPoints,
        y: sum.y / totalPoints,
      };
    };


    // Procesa el string de coordenadas a un array de puntos
    const parseCoordinates = (coordString) => {
      return coordString
        .split(')')
        .map(pair => pair.trim())
        .filter(pair => pair.length > 0)
        .map(pair => {
          const cleanPair = pair.replace('(', '').trim();
          const [x, y] = cleanPair.split(',').map(num => parseFloat(num.trim()));
          return { x, y };
        });
    };

    // Cargar imagen de fondo
    const loadBackgroundImage = () => {
      if (props.backgroundimage) {
        const image = new Image();
        image.src = props.backgroundimage;
        image.onload = () => {
          backgroundImg.value = image;
        };
      }
    };

    const handleStageClick = () => {
      if (!drawMode.value) return;

      const point = stage.value.getNode().getPointerPosition();
      currentArea.value = [...currentArea.value, point.x, point.y];

      // Verificar si debemos cerrar el área
      if (currentArea.value.length >= 8) {
        const [startX, startY] = [currentArea.value[0], currentArea.value[1]];
        const [lastX, lastY] = [
          currentArea.value[currentArea.value.length - 2],
          currentArea.value[currentArea.value.length - 1]
        ];

        const distance = Math.hypot(lastX - startX, lastY - startY);
        if (distance < 10) {
          // Crear string de coordenadas en el formato requerido
          coordinatesString.value = currentArea.value
            .reduce((acc, val, index) => {
              if (index % 2 === 0) {
                return [...acc, `(${val.toFixed(4)}, ${currentArea.value[index + 1].toFixed(4)})`];
              }
              return acc;
            }, [])
            .join(' ');

          showModal.value = true;
        }
      }
    };

    const confirmAreaSelection = () => {
      if (selectedAreaId.value) {
        emit('areaSelected', {
          id: selectedAreaId.value,
          coordinates: coordinatesString.value
        });
        closeModal();
      }
    };

    const closeModal = () => {
      showModal.value = false;
      selectedAreaId.value = null;
      currentArea.value = [];
    };

    const toggleDrawMode = () => {
      drawMode.value = !drawMode.value;
    };

    const openUploadPlans = () => {
      emit('uploadPlans');
    };

    onMounted(() => {
      loadBackgroundImage();
      if (stage.value) {
        stage.value.getNode().on('click', handleStageClick);
      }
    });

    // Observar cambios en la imagen de fondo
    watch(() => props.backgroundimage, loadBackgroundImage);

    onMounted(() => {
      stage.value.getNode().on('mousemove', handleMouseMove);
    });

    return {
      stage,
      stageConfig,
      backgroundImg,
      parseCoordinates,
      currentArea,
      drawMode,
      showModal,
      selectedAreaId,
      coordinatesString,
      toggleDrawMode,
      openUploadPlans,
      confirmAreaSelection,
      closeModal,
      calculateAreaCenter,
      cancelDraw,
      handleMouseMove,
      mousePosition
    };
  },
};
</script>

<style scoped>
.mdi {
  transition: color 0.3s ease;
}
</style>