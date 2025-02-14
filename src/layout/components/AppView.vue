<script lang="ts" setup>
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'
import { Footer } from '@/layout/components/Footer'

defineOptions({ name: 'AppView' })

const appStore = useAppStore()

const layout = computed(() => appStore.getLayout)

const fixedHeader = computed(() => appStore.getFixedHeader)

const footer = computed(() => appStore.getFooter)

const tagsViewStore = useTagsViewStore()

const getCaches = computed((): string[] => {
  return tagsViewStore.getCachedViews
})

const tagsView = computed(() => appStore.getTagsView)

//region 无感刷新
const routerAlive = ref(true)
// 无感刷新，防止出现页面闪烁白屏
const reload = () => {
  routerAlive.value = false
  nextTick(() => (routerAlive.value = true))
}
// 为组件后代提供刷新方法
provide('reload', reload)
//endregion

// import { useRoute } from 'vue-router';

// // Get the current route object
// const currentRoute = useRoute();

// // Create a computed property to reactively track the matched route configuration
// const routeConfig = computed(() => route.matched);
</script>

<template>
  <section
    :class="[
      'p-[var(--app-content-padding)] w-full bg-[var(--app-content-bg-color)] dark:bg-[var(--el-bg-color)]',
      {
        '!min-h-[calc(100vh-var(--top-tool-height)-var(--tags-view-height)-var(--app-footer-height))] pb-0':
          footer
      }
    ]"
  >
    <router-view v-if="routerAlive">
<!--      作用域插槽，解构赋值子组件回传参数到Compenet和route-->
      <template #default="{ Component, route }">
        <keep-alive>
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
<!--        <div>-->
<!--          &lt;!&ndash; Print route's fullPath &ndash;&gt;-->
<!--          <p><strong>Current Path:</strong> {{ route.fullPath }}</p>-->

<!--          &lt;!&ndash; Display the entire route object (for debugging or inspection) &ndash;&gt;-->
<!--          <pre><strong>Route Configuration:</strong> {{ routeConfig }}</pre>-->
<!--        </div>-->
      </template>
    </router-view>
  </section>
  <Footer v-if="footer" />
</template>
