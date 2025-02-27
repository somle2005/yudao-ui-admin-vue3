<template>
  <div class="storeList">
    <div class="search">
      <el-input :suffix-icon="Search" v-model="value" @input="searchDB" @keyup.enter="search" />
    </div>
    <el-scrollbar>
      <div class="platform-list">
        <div class="item" v-for="item in shopList" :key="item.id" @click="clickShop(item)">
          <div class="item-platform">
            {{ item.platform }}
          </div>
          <div class="item-accountTotal"> 店铺数:{{ item.accountTotal }} </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ShopApi } from '@/api/erp/sale/shop'
import { cloneDeep } from 'lodash-es'
import { debounce } from 'min-dash'
const shopList: any = ref([])
const allShopList: any = ref([])
const value = ref('')

const emits = defineEmits(['clickShop'])
const clickShop = (item: any) => {
  emits('clickShop', item)
}
const search = () => {
  const val = value.value
  if (val) {
    shopList.value = allShopList.value.filter((item: any) => {
      return item?.platform?.toLowerCase()?.indexOf(val.toLowerCase()) !== -1
    })
  } else {
    shopList.value = allShopList.value
  }
}
const searchDB = debounce(search, 500)
const getList = () => {
  shopList.value = []
  ShopApi.getShopList().then((res) => {
    const map = {}
    res.forEach((item) => {
      const typeMap = {
        // '线上',
        0: () => {
          if (map[item.platform]) {
            map[item.platform].accountTotal += 1
          } else {
            map[item.platform] = {
              platform: item.platform,
              accountTotal: 1,
              id: item.id,
              type: item.type
            }
          }
        },
        // '线下'
        1: () => {
          const platform = '线下'
          if (map[platform]) {
            map[platform].accountTotal += 1
          } else {
            map[platform] = {
              platform: platform,
              accountTotal: 1,
              id: item.id,
              type: item.type
            }
          }
        }
      }
      typeMap[item.type]()
    })
    const list = Object.values(map)
    const hasOnline = list.some((item: any) => item.type === 1)
    if (!hasOnline) {
      list.push({
        platform: '线下',
        accountTotal: 0,
        id: Math.random(),
        type: 1
      })
    }

    // 线下的排在最后面
    const offlineIndex = list.findIndex((item: any) => item.type === 1)
    const item = list[offlineIndex]
    list.splice(offlineIndex, 1)
    list.push(item)

    shopList.value = list
    allShopList.value = cloneDeep(list)
  })
}

onMounted(() => {
  getList()
})
onUnmounted(() => {})
defineExpose({
  getList
})
</script>
<style lang="scss" scoped>
.storeList {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 200px;
  background: white;
  box-sizing: border-box;
  border-radius: 4px;
  .search {
    height: 30px;
    padding: 0 10px;
    box-sizing: border-box;
    margin-top: 10px;
  }
  .platform-list {
    padding: 0 10px;
    // height: 1000px;
    // overflow: auto;
    box-sizing: border-box;
  }
  .item {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    font-size: 12px;
    cursor: pointer;
    .item-platform {
      width: 100px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
