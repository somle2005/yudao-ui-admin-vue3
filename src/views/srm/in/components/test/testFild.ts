// 测试表单字段是否传递完整

/**
采购到货新增接口items中
totalProductPrice和totalPrice区别是什么
/admin-api/srm/purchase-in/create

totalProductPrice
totalGrossPrice

totalGrossPrice = totalPrice * taxRate
最终合计价格（= 产品价格合计 + 税额合计 - 折扣金额 + 其他金额）  totalPrice

totalProductPrice 合计产品价格

TotalCount  TotalProductPrice totalGrossPrice TotalPrice DiscountPrice TotalPrice 根据子单变化的(后端计算)
 */

const paramsList = [
  { prop: 'arriveId', name: '采购入库编号' },
  { prop: 'warehouseId', name: '仓库Id' },
  { prop: 'productId', name: '产品ID' },
  { prop: 'productUnitId', name: '产品单位ID' },
  { prop: 'productUnitName', name: '产品单位名称' },
  { prop: 'productPrice', name: '产品单价' },

  { prop: 'qty', name: '到货数量' },
  { prop: 'totalPrice', name: '总价 totalPrice = productPrice * qty' },
  { prop: 'taxRate', name: '税率' },
  { prop: 'taxPrice', name: '税价合计  taxPrice = totalPrice * taxRate' },
  { prop: 'grossPrice', name: '含税单价' },
  { prop: 'grossTotalPrice', name: '价税合计' },

  { prop: 'totalProductPrice', name: '合计产品价格' },
  { prop: 'totalGrossPrice', name: '合计税价  totalGrossPrice = totalPrice * taxRate' },

  { prop: 'payPrice', name: '已付款金额' },
  { prop: 'payStatus', name: '付款状态' },
  { prop: 'orderItemId', name: '采购订单项ID' },
  { prop: 'model', name: '型号规格(产品带出)' },

  { prop: 'source', name: '单据来源描述(前端不传)' },

  { prop: 'applicantId', name: '申请人id' },
  { prop: 'applicationDeptId', name: '申请人部门id' },
  { prop: 'declaredType', name: '产品报关品名' },
  { prop: 'declaredTypeEn', name: '产品报关品名英文' },

  { prop: 'code', name: '产品sku' }, //必填注意一下
  { prop: 'productName', name: '产品名称' },
  { prop: 'fbaCode', name: 'x编码' },
  { prop: 'containerRate', name: '箱率' },
  { prop: 'remark', name: '备注' }

  // payPrice-payStatus 这两个是自己创建的吗。-对语雀文档-丁晨-后端
]

const itemsList = [
  'orderNo',
  'orderItemId',
  'productId',
  'productName',
  'code',
  'productUnitId',
  'productUnitName',
  'model',
  'productPrice',
  'qty',
  'declaredType',
  'taxRate',
  'taxPrice',
  'grossPrice',
  'grossTotalPrice',
  'remark',
  'settlementDate',
  'containerRate',
  'warehouseId',
  'warehouseName',
  'currencyId',
  'applicantId',
  'applicantName',
  'applicationDeptId',
  'applicationDeptName',
  'totalPrice'
]

const list = []
paramsList.forEach((item) => {
  if (!itemsList.includes(item.prop)) {
    list.push(item)
  }
})

console.log(list, 'list-list')

const differentList = [
  {
    prop: 'arriveId',
    name: '采购入库编号'
  },
  {
    prop: 'totalProductPrice',
    name: '合计产品价格'
  },
  {
    prop: 'totalGrossPrice',
    name: '合计税价  totalGrossPrice = totalPrice * taxRate'
  },
  {
    prop: 'payPrice',
    name: '已付款金额'
  },
  {
    prop: 'payStatus',
    name: '付款状态'
  },
  {
    prop: 'source',
    name: '单据来源描述(前端不传)'
  },
  {
    prop: 'declaredTypeEn',
    name: '产品报关品名英文'
  },
  {
    prop: 'fbaCode',
    name: 'x编码'
  }
]

/**
arriveId-需要带吗

创建采购到货
/admin-api/srm/purchase-in/create

x编码-fbaCode
产品报关品名英文-declaredTypeEn
已付款金额-payPrice
付款状态-payStatus
这四个字段需要带给你吗
payStatus-这个不用带 其他都是采购订单项-合并时候带出 或者 采购到货项编辑回显

带出的仓库-数量可编辑  行币种展示

 */

const mergeOrder = {
  billTime: 1747210462000,
  supplierId: 11,
  address: null,
  settlementDate: null,
  accountId: null,
  discountPercent: 0,
  fileUrl: '',
  remark: null,
  otherPrice: 0, 

  currencyName: 'CNY',
  currencyId: null,

  itemIds: [5]
}



const mergeOrderParmas = {
  items: [
    {
      itemId: 0,
      qty: 0
    }
  ],
  billTime: 'string',
  supplierId: 0,
  address: 'string',
  settlementDate: 'string',
  accountId: 0,
  discountPercent: 0,
  otherPrice: 0,
  fileUrl: 'string',
  remark: 'string'
}

// 现在手动
const createData = {
  supplierId: 4,
  accountId: 2,
  arriveTime: 1747843200000,
  remark: '备注-1',
  fileUrl:
    'https://somle-erp.oss-cn-hangzhou.aliyuncs.com/247bb868f543773848545f237aa895bc271c7f514cea758b187ffc6f3290d3e1.txt',
  discountPercent: 10,
  discountPrice: 2000,
  totalPrice: 19000,
  otherPrice: 1000,
  items: [
    {
      orderNo: 'CGDD-20250514-000007',
      orderItemId: 5,
      productId: 6,
      productName: 'RS2600滤芯复合滤芯（PP+ACF）',
      code: 'RS-CF-RS2600',
      productUnitId: 1,
      productUnitName: '个',
      model: null,
      productPrice: 88.5,
      qty: 100,
      declaredType: '滤芯',
      taxRate: 13,
      taxPrice: 1150.44,
      grossPrice: 100,
      grossTotalPrice: 10000,
      remark: null,
      settlementDate: null,
      containerRate: null,
      warehouseId: 3,
      warehouseName: null,
      currencyId: null,
      applicantId: null,
      applicantName: null,
      applicationDeptId: null,
      applicationDeptName: null,
      totalPrice: 10000
    },
    {
      orderNo: 'CGDD-20250514-000008',
      orderItemId: 6,
      productId: 6,
      productName: 'RS2600滤芯复合滤芯（PP+ACF）',
      code: 'RS-CF-RS2600',
      productUnitId: 1,
      productUnitName: '个',
      model: null,
      productPrice: 88.5,
      qty: 100,
      declaredType: '滤芯',
      taxRate: 13,
      taxPrice: 1150.44,
      grossPrice: 100,
      grossTotalPrice: 10000,
      remark: null,
      settlementDate: null,
      containerRate: null,
      warehouseId: 3,
      warehouseName: null,
      currencyId: null,
      applicantId: null,
      applicantName: null,
      applicationDeptId: null,
      applicationDeptName: null,
      totalPrice: 10000
    }
  ],
  billTime: 1748534400000,
  address: '收货地址',
  reconciliationStatus: false
}
