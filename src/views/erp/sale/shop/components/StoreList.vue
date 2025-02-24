<template>
  <div class="storeList">
    <div class="search">
      <el-input :suffix-icon="Search" v-model="value" @input="searchDB" @keyup.enter="search" />
    </div>
    <!-- <el-scrollbar>
      
    </el-scrollbar> -->
    <div class="platform-list">
        <div class="item" v-for="item in shopList" :key="item.id" @click="clickShop(item)">
          <div class="item-platform">
            {{ item.platform }}
          </div>
          <div class="item-accountTotal"> 店铺数:{{ item.accountTotal }} </div>
        </div>
      </div>
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
onMounted(() => {
  ShopApi.getShopList().then((res) => {
    const map = {}
    res.forEach((item) => {
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
    })
    const list = Object.values(map)
    const hasOnline = list.some((item:any) => item.type === 1)
    if(!hasOnline){
      list.push({
        platform: '线下',
        accountTotal: 0,
        id: Math.random(),
        type: 1
      })
    }
    console.log(list,'list')
    shopList.value = list
    allShopList.value = cloneDeep(list)
  })
})
onUnmounted(() => {})
defineExpose({})
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
    overflow: auto;
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
