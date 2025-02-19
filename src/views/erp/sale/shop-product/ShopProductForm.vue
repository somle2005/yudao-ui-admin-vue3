<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="800px">
    <el-form
      ref="formRef"
      :disabled="disabled"
      :model="formData"
      :inline="true"
      label-width="100px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="店铺SKU" prop="name">
            <el-input v-model="formData.name" placeholder="请输入店铺SKU" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平台账号" prop="name">
            <el-input v-model="formData.shop.account" placeholder="请输入平台账号" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-button type="primary" @click="selectProduct" style="margin-bottom: 10px"
      >选择产品</el-button
    >
    <ContentWrap>
      <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px">
        <el-tab-pane label="产品" name="item">
          <ProductItemForm ref="itemFormRef" :items="formData.items" />
        </el-tab-pane>
      </el-tabs>
    </ContentWrap>
    <template #footer>
      <el-button @click="submitFormDB" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <Dialog class="productForm-dialog" title="编辑" v-model="productVisible" width="850px">
    <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="100px">
      <el-form-item label="产品名称">
        <el-select
          v-model="queryParams.name"
          clearable
          filterable
          placeholder="请选择产品名称"
          @keyup.enter="handleQuery"
          @change="handleQuery"
          class="!w-240px"
        >
          <el-option
            v-for="item in productNameList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SKU（编码）">
        <el-select
          v-model="queryParams.barCode"
          clearable
          filterable
          placeholder="请选择SKU（编码）"
          @keyup.enter="handleQuery"
          @change="handleQuery"
          class="!w-240px"
        >
          <el-option
            v-for="item in productSkuList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <!-- <ContentWrap :bodyStyle="{ padding: '20px', 'padding-bottom': 0 }">
    </ContentWrap>   style="height: 500px" -->
    <SmTable
      border
      isSelection
      :loading="loading"
      :options="tableOptions"
      :data="list"
      :total="total"
      v-model:currentPage="queryParams.pageNo"
      v-model:pageSize="queryParams.pageSize"
      @pagination="getList"
      @selection-change="handleSelectionChange"
    >
      <template #primaryImageUrl="{ scope }">
        <el-image :src="scope.row.primaryImageUrl" class="w-64px h-64px" />
      </template>
    </SmTable>

    <template #footer>
      <el-button @click="confirmProduct" type="primary">确 定</el-button>
      <el-button @click="productVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { ShopProductApi, ShopProductVO } from '@/api/erp/sale/shop-product'
import { createDBFn } from '@/utils/decorate'
import ProductItemForm from './components/ProductItemForm.vue'
import { useProductItemForm } from './hooks/useProductItemForm'
import { cloneDeep } from 'lodash-es'
/** ERP 店铺产品 */
defineOptions({ name: 'ShopProductForm' })

const {
  selectProduct,
  getList,
  tableOptions,
  list,
  total,
  loading,
  queryParams,
  productVisible,
  handleQuery,
  productNameList,
  productSkuList,
  queryFormRef,
  handleSelectionChange,
  selectionList
} = useProductItemForm()

const requestFormOptions = ref([
  {
    type: 'input',
    label: '平台',
    prop: 'platform',
    placeholder: '请输入平台',
    attrs: {
      style: { width: '100%' },
      clearable: true
    },
    rules: [
      {
        required: true,
        message: '平台不能为空',
        trigger: 'blur'
      }
    ]
  },
  {
    type: 'input',
    label: '平台账户',
    prop: 'account',
    placeholder: '请输入平台账户',
    attrs: {
      style: { width: '100%' },
      clearable: true
    },
    rules: [
      {
        required: true,
        message: '平台账户不能为空',
        trigger: 'blur'
      }
    ]
  },

  {
    type: 'input',
    label: '店铺名称',
    prop: 'name',
    placeholder: '请输入店铺名称',
    attrs: {
      style: { width: '100%' },
      clearable: true
    },
    rules: [
      {
        required: true,
        message: '店铺名称不能为空',
        trigger: 'blur'
      }
    ]
  },
  {
    type: 'input',
    label: '店铺代码',
    prop: 'code',
    placeholder: '请输入店铺代码',
    attrs: {
      style: { width: '100%' },
      clearable: true
    },
    rules: [
      {
        required: true,
        message: '店铺代码不能为空',
        trigger: 'blur'
      }
    ]
  },
  {
    type: 'select',
    placeholder: '请选择状态',
    prop: 'status',
    label: '状态',
    attrs: {
      filterable: true,
      clearable: true,
      style: {
        width: '100%'
      }
    },
    rules: [
      {
        required: true,
        message: '状态不能为空',
        trigger: 'blur'
      }
    ],
    children: getIntDictOptions(DICT_TYPE.ERP_OFF_STATUS)
  },
  {
    type: 'select',
    placeholder: '请选择类型',
    prop: 'type',
    label: '类型',
    attrs: {
      filterable: true,
      clearable: true,
      style: {
        width: '100%'
      }
    },
    rules: [
      {
        required: true,
        message: '类型不能为空',
        trigger: 'blur'
      }
    ],
    children: getIntDictOptions(DICT_TYPE.ERP_SHOP_TYPE)
  },
  {
    type: 'input-number',
    label: '排序',
    prop: 'sort',
    placeholder: '请输入排序',
    attrs: {
      style: { width: '100%' },
      clearable: true,
      min: 0
    },
    rules: [
      {
        required: true,
        message: '排序不能为空',
        trigger: 'blur'
      }
    ]
  },

  // 备注放最后
  {
    type: 'input',
    label: '备注',
    prop: 'remark',
    placeholder: '请输入备注',
    attrs: {
      style: { width: '100%' },
      clearable: true
    },
    rules: [
      {
        required: true,
        message: '备注不能为空',
        trigger: 'blur'
      }
    ]
  }
])

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref()

/** 子表的表单 */
const subTabsName = ref('item')
const itemFormRef = ref()

const initFormData = () => {
  return {
    id: undefined,
    shopId: undefined,
    name: undefined,
    code: undefined,
    remark: undefined,
    status: undefined,
    createTime: 1739011592000,
    url: undefined,
    items: [
      // {
      //   id: undefined,
      //   productId: undefined,
      //   remark: '',
      //   createTime: undefined
      // },
    ] as any[],
    shop: {}
  }
}

formData.value = initFormData()
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      getList()
      const data = await ShopProductApi.getShopProduct(id)
      // formRef.value.initForm()
      // 检查 items 并赋值为默认值 []
      if (data.items == null) {
        data.items = []
      }
      data.items.forEach(item => {
        if(item.product) {
          item.name = item.product.name
          item.barCode = item.product.barCode
          item.primaryImageUrl = item.product.primaryImageUrl
        }
      })


      formData.value = data
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  await itemFormRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = cloneDeep(formData.value) as unknown as ShopProductVO
    // @ts-ignore
    data.items = data.items.map((item) => {
      const obj = {
        shopProductId: data.id,
        id: item.id,
        productId: item.productId,
        remark: item.remark,
        createTime: item.createTime,
        quantity: item.quantity
      }
      return obj
    })
    data.shop = undefined

    if (formType.value === 'create') {
      await ShopProductApi.createShopProduct(data)
      message.success(t('common.createSuccess'))
    } else {
      await ShopProductApi.updateShopProduct(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}
const submitFormDB = createDBFn(submitForm)
/** 重置表单 */
const resetForm = () => {
  formData.value = initFormData()
  formRef.value?.resetFields()
}

// 如果不行改成reactive
const getFormData = () => {
  return formData.value
}

const confirmProduct = () => {
  productVisible.value = false
  const items = formData.value.items
  const map = {}
  items.forEach((item) => {
    map[item.productId] = 1
  })
  selectionList.value.forEach((item) => {
    if (!map[item.productId]) {
      items.push(item)
    }
  })
  console.log(items, 'confirmProduct')
  formData.value.items = items
}

const disabled = computed(() => formType.value === 'update')
</script>
<style>
.productForm-dialog .el-scrollbar__bar.is-horizontal {
  height: 0 !important;
}
</style>
