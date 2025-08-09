<template>
  <div class="relative flex flex-col items-center">
    <h1 class="text-gray-700 font-bold text-lg mb-2 relative w-full">
      {{ name }}
    </h1>

    <div class="relative border border-gray-300 rounded-lg shadow-md">
      <v-stage ref="stage" :config="stageConfig" @contentClick="onStageClick">
        <v-layer>
          <!-- Imagen de fondo -->
          <v-image v-if="backgroundimage" :config="{
            image: backgroundImg,
            width: stageConfig.width,
            height: stageConfig.height
          }" />
          <!-- Áreas existentes -->
          <template v-for="area in areas" :key="area._id">
            <!-- Área visual -->
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
              fill: getAreaColor(area),
              stroke: countBeaconsForAforo(area.items, area.aforo.typeItemMobiles) > area.aforo.amount ? 'red' : '',
              strokeWidth: countBeaconsForAforo(area.items, area.aforo.typeItemMobiles) > area.aforo.amount ? 4 : 2 // Cambia el grosor del borde
            }" />

            <v-text :config="{
              text: `${area.name}\n(${countBeaconsForAforo(area.items, area.aforo.typeItemMobiles)}/${area.aforo.amount})\nTotal: ${area.items.length}`,
              x: calculateAreaCenter(parseCoordinates(area.coordinates)).x,
              y: calculateAreaCenter(parseCoordinates(area.coordinates)).y,
              fontSize: 16,
              fontFamily: 'Arial',
              fill: 'black',
              align: 'center',
              verticalAlign: 'middle',
              cursor: 'pointer'
            }" @mouseover="onTextHover" @mouseout="onTextOut" @click="onAreaNameClick(area)"
              :style="{ cursor: 'pointer' }" />


          </template>
        </v-layer>
      </v-stage>



      <!-- Beacons en HTML superpuesto -->
      <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div v-for="area in areas" :key="area._id" class="flex flex-wrap">
          <!-- Reducimos los beacons a uno por typeId -->
          <MonitoringBeacon v-for="(beacon, index) in reduceBeaconsByTypeId(area.items)" :key="beacon._id"
            :beacon="beacon" :position="getBeaconPosition(beacon, area, index, area.items.length)" :isHighlighted="highlightedBeacon &&
              findBeaconAndAreaById(highlightedBeacon)?.area._id === area._id &&
              beacon.typeId === findBeaconAndAreaById(highlightedBeacon)?.beacon.typeId
              " @highlight="$emit('highlight', $event)" class="pointer-events-auto" />


        </div>
      </div>


    </div>
  </div>

  <MonitoringLayout />
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { eventBus } from '@/utils/eventBus';
import MonitoringBeacon from '@/components/monitoring/MonitoringBeacons.vue';
import MonitoringLayout from '@/layouts/MonitoringLayout.vue';

export default {
  components: {
    MonitoringBeacon,
    MonitoringLayout

  },
  props: {
    name: { type: String, required: true },
    backgroundimage: { type: String, required: true },
    areas: { type: Array, required: true },
    highlightedBeacon: { type: String, default: null },
  },
  emits: ['highlight', 'beacon-group-count'],
  setup(props, { emit }) {
    const stageConfig = { width: 1300, height: 570 };
    const backgroundImg = ref(null);
    const highlightedBeacon = ref(null);
    const getAreaColor = (area) => {
  return area.color ? `${area.color}50` : "rgba(173, 216, 230, 0.3)"; // Usa el color del área con transparencia
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
      return { x: sum.x / totalPoints, y: sum.y / totalPoints };
    };

    const parseCoordinates = (coordString) => {
      if (!coordString || typeof coordString !== 'string') {
        console.warn('Coordenadas inválidas:', coordString);
        return [];
      }
      const parsed = coordString
        .split(')')
        .map((pair) => pair.trim())
        .filter((pair) => pair.length > 0)
        .map((pair) => {
          const cleanPair = pair.replace('(', '').trim();
          const [x, y] = cleanPair.split(',').map((num) => parseFloat(num.trim()));
          return { x, y };
        });


      return parsed;
    };

    const loadBackgroundImage = () => {
      if (props.backgroundimage) {
        const image = new Image();
        image.src = props.backgroundimage;
        image.onload = () => {
          backgroundImg.value = image;
        };
      }
    };

    const onAreaNameClick = (area) => {
      console.log('Área seleccionada:', area);
      eventBus.emit('area-clicked', area);
    };

    const getBeaconPosition = (beacon, area, index) => {
      const areaPoints = parseCoordinates(area.coordinates);

      // Determinar las dimensiones del área
      const minX = Math.min(...areaPoints.map((point) => point.x));
      const maxX = Math.max(...areaPoints.map((point) => point.x));
      const minY = Math.min(...areaPoints.map((point) => point.y));
      const maxY = Math.max(...areaPoints.map((point) => point.y));

      const areaWidth = maxX - minX;
      const areaHeight = maxY - minY;

      // Calcular filas y columnas basadas en el número de beacons
      const totalBeacons = area.items.length;
      const columns = Math.ceil(Math.sqrt(totalBeacons)); // Número de columnas
      const rows = Math.ceil(totalBeacons / columns); // Número de filas

      // Calcular el tamaño de cada celda
      const cellWidth = areaWidth / columns;
      const cellHeight = areaHeight / rows;

      // Determinar la posición del beacon en la cuadrícula
      const row = Math.floor(index / columns); // Índice de la fila
      const column = index % columns; // Índice de la columna

      return {
        x: minX + column * cellWidth + cellWidth / 2, // Centrar dentro de la celda
        y: minY + row * cellHeight + cellHeight / 2, // Centrar dentro de la celda
      };
    };

    const onTextHover = (e) => {
      const container = e.target.getStage().container();
      container.style.cursor = 'pointer';
    };

    const onTextOut = (e) => {
      const container = e.target.getStage().container();
      container.style.cursor = 'default';
    };

    const reduceBeaconsByTypeId = (items) => {
      const grouped = items.reduce((acc, item) => {
        if (!acc[item.typeId]) {
          acc[item.typeId] = {
            beacon: item,
            count: 1
          };
        } else {
          acc[item.typeId].count++;
        }
        return acc;
      }, {});

      // Convert to array and emit counts for each group
      const groupedArray = Object.entries(grouped).map(([typeId, data]) => {
        // Emit the count for this group
        emit('beacon-group-count', {
          typeId,
          count: data.count,
          beacon: data.beacon
        });
        
        return {
          ...data.beacon,
          groupCount: data.count // Add count to beacon object for use in component
        };
      });

      return groupedArray;
    };

    const filterBeaconsForAforo = (items, typeItemMobiles) => {
      return items.filter((item) => typeItemMobiles.includes(item.typeId));
    };

    const countBeaconsForAforo = (items, typeItemMobiles) => {
      // Solo cuenta los beacons que coinciden con los typeId permitidos
      return items.filter((item) => typeItemMobiles.includes(item.typeId)).length;
    };


    const findBeaconsByTypeId = (typeId) => {
      let grouped = [];
      for (const area of props.areas) {
        grouped = grouped.concat(area.items.filter((item) => item.typeId === typeId));
      }
      return grouped;
    };



    const findBeaconAndAreaById = (beaconId) => {
      for (const area of props.areas) {
        const found = area.items.find((item) => item._id === beaconId);
        if (found) return { beacon: found, area };
      }
      return null;
    };



    onMounted(loadBackgroundImage);

    watch(() => props.backgroundimage, loadBackgroundImage);


    watch(() => props.highlightedBeacon, (newValue) => {
      console.log('Nuevo valor recibido en highlightedBeacon (hijo):', newValue);
      if (newValue) {
        const beaconData = findBeaconById(newValue);
        if (beaconData) {
          console.log('Beacon encontrado (hijo):', beaconData);
        } else {
          console.warn('No se encontró el beacon con el ID (hijo):', newValue);
        }
      } else {
        console.log('No hay beacon seleccionado (hijo).');
      }
    });

    const findBeaconById = (beaconId) => {
      for (const area of props.areas) {
        const found = area.items.find((item) => item._id === beaconId);
        if (found) return found;
      }
      return null;
    };


    const highlightBeacon = (id) => {
      console.log(`Highlighting beacon with ID: ${id}`); // Verificar si se llama al evento
      highlightedBeacon.value = id;
      setTimeout(() => (highlightedBeacon.value = null), 3000); // Resalta por 3 segundos
    };



    watch(() => props.highlightedBeacon, (newValue) => {
      console.log('Nuevo beacon destacado:', findBeaconAndAreaById(newValue));
    });




    return {
      stageConfig,
      backgroundImg,
      parseCoordinates,
      calculateAreaCenter,
      onAreaNameClick,
      getBeaconPosition,
      onTextHover,
      onTextOut,
      filterBeaconsForAforo,
      reduceBeaconsByTypeId,
      highlightBeacon,
      countBeaconsForAforo,
      findBeaconById,
      findBeaconsByTypeId,
      findBeaconAndAreaById,
      getAreaColor,
    };
  },
};
</script>
