<template>
  <div>
    <div class="controls">
      <el-form :inline="true" label-position="left">
        <el-form-item label="选择年份:">
          <el-select
            v-model="selectedYears"
            multiple
            placeholder="请选择年份"
            style="width: 200px;"
          >
            <el-option
              v-for="year in years"
              :key="year"
              :label="year"
              :value="year"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="选择平台:">
          <el-select
            v-model="selectedPlatforms"
            multiple
            placeholder="请选择平台"
            style="width: 200px;"
          >
            <el-option
              v-for="platform in platforms"
              :key="platform"
              :label="platform"
              :value="platform"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="选择SKU:">
          <el-select
            v-model="selectedSkus"
            multiple
            placeholder="请选择SKU"
            style="width: 200px;"
          >
            <el-option
              v-for="sku in skus"
              :key="sku"
              :label="sku"
              :value="sku"
            />
          </el-select>
        </el-form-item>

        <el-button type="primary" @click="loadData">加载数据</el-button>
      </el-form>
    </div>

    <div id="map" ref="mapContainer"></div>

    <div class="controls">
      <el-button type="success" @click="toggleHeatmap">切换热图</el-button>
      <el-button type="info" @click="changeGradient">改变渐变</el-button>
      <el-button type="warning" @click="changeOpacity">改变不透明度</el-button>
      <el-button type="danger" @click="changeRadius">改变半径</el-button>
      <el-button type="primary" @click="toggleMarkers">切换标记</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const mapContainer = ref<HTMLElement | null>(null);

const years = ref<string[]>([]);
const platforms = ref<string[]>([]);
const skus = ref<string[]>([]);

const selectedYears = ref<string[]>([]);
const selectedPlatforms = ref<string[]>([]);
const selectedSkus = ref<string[]>([]);

let map: google.maps.Map | null = null;
let heatmap: google.maps.visualization.HeatmapLayer | null = null;
let markers: google.maps.marker.AdvancedMarkerElement[] = [];
let markersVisible = true;
let AdvancedMarkerElement: any;
const imageCache: Record<string, string> = {};
let isImageLoading = false;

const mapId = 'YOUR_MAP_ID';

onMounted(() => {
  loadOptions();
  loadGoogleMapsScript();
});

async function loadGoogleMapsScript() {
  try {
    const { data } = await axios.get('https://kerwin.org.cn/api/google-maps-script-url');
    const script = document.createElement('script');
    script.src = `${data.scriptUrl}&libraries=visualization`; // No callback
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);
  } catch (error) {
    ElMessage.error('加载Google Maps脚本时出错');
    console.error('加载Google Maps脚本时出错:', error);
  }
}

async function initMap() {
  const { Map } = await google.maps.importLibrary('maps');
  AdvancedMarkerElement = (await google.maps.importLibrary('marker')).AdvancedMarkerElement;
  const { HeatmapLayer } = await google.maps.importLibrary('visualization');

  map = new Map(mapContainer.value as HTMLElement, {
    zoom: 13,
    center: { lat: 38.913611, lng: -77.013222 },
    mapId,
  });
}

function loadOptions() {
  axios
    .get('https://kerwin.org.cn/api/options')
    .then(({ data }) => {
      years.value = data.years;
      platforms.value = data.platforms;
      skus.value = data.skus;
    })
    .catch((error) => {
      ElMessage.error('加载选项数据时出错');
      console.error('加载选项数据时出错:', error);
    });
}

async function loadData() {
  if (!selectedYears.value.length || !selectedPlatforms.value.length || !selectedSkus.value.length) {
    ElMessage.warning('请选择所有选项');
    return;
  }

  const apiUrl = `https://kerwin.org.cn/api/data?years=${selectedYears.value.join(
    ','
  )}&platforms=${selectedPlatforms.value.join(',')}&skus=${selectedSkus.value.join(',')}`;

  try {
    const { data } = await axios.get(apiUrl);
    if (Array.isArray(data)) updateMap(data);
  } catch (error) {
    ElMessage.error('获取数据时出错');
    console.error('获取数据时出错:', error);
  }
}

async function fetchStreetView(latitude: number, longitude: number): Promise<string | null> {
  const cacheKey = `${latitude},${longitude}`;
  if (imageCache[cacheKey]) return imageCache[cacheKey];

  try {
    const { data } = await axios.get(
      `https://kerwin.org.cn/api/street-view?latitude=${latitude}&longitude=${longitude}`,
      { responseType: 'blob' }
    );
    const imageUrl = URL.createObjectURL(data);
    imageCache[cacheKey] = imageUrl;
    return imageUrl;
  } catch (error) {
    console.error('获取Street View图像时出错:', error);
    return null;
  }
}

function updateMap(data: any[]) {
  if (!map) return;

  const points = data
    .filter((row) => row.latitude && row.longtitude)
    .map((row) => new google.maps.LatLng(row.latitude, row.longtitude));

  if (heatmap) heatmap.setMap(null);
  heatmap = new google.maps.visualization.HeatmapLayer({ data: points, map });

  markers.forEach((marker) => marker.setMap(null));
  markers = [];

  data.forEach((row) => {
    if (row.latitude && row.longtitude) {
      const marker = new AdvancedMarkerElement({
        position: new google.maps.LatLng(row.latitude, row.longtitude),
        map: markersVisible ? map : null,
        title: row.buyer_name,
      });

      const infoWindow = new google.maps.InfoWindow();

      marker.content.addEventListener('mouseover', async () => {
        if (isImageLoading) return;
        isImageLoading = true;
        const streetViewUrl = await fetchStreetView(row.latitude, row.longtitude);
        if (streetViewUrl) {
          infoWindow.setContent(`
            买家名称: ${row.buyer_name}<br>
            国家名称: ${row.country_code}<br>
            城市名称: ${row.city_name}<br>
            平台: ${row.platform}<br>
            SKU: ${row.sku}<br>
            纬度: ${row.latitude}<br>
            经度: ${row.longtitude}<br>
            <img src="${streetViewUrl}" alt="Street View Image">
          `);
          infoWindow.open(map, marker);
        }
        isImageLoading = false;
      });

      marker.content.addEventListener('mouseout', () => {
        infoWindow.close();
      });

      markers.push(marker);
    }
  });
}

function toggleHeatmap() {
  if (heatmap) heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
  const gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0,159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)',
  ];
  heatmap?.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
  heatmap?.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
  heatmap?.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

function toggleMarkers() {
  markersVisible = !markersVisible;
  markers.forEach((marker) => marker.setMap(markersVisible ? map : null));
}
</script>

<style scoped>
#map {
  height: 1000px;
  width: 100%;
}
</style>
