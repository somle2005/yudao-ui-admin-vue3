### 字段说明

配置参数未具体说明为必填 默认为可选参数

| 字段        | 类型    |  说明  |
| --------   | -----   | :----: |
| v-model (configList)  | TableOptionsConfigProps[] |绑定指定显示的数据可以为空数组 如果有指定必须和组件数据一致 参照接口TableOptionsConfigProps[] (字段必须严格指定-你定义sort字段内部会帮你排序)|
| tableList    | TableOptionsConfig[]   | 全量传入的表格显示数据  可以通过配置tableConfig转化成组件需要的字段    |
| tableConfig      | TableOptionsConfig    |用于帮你把传入的tableList转化成组件格式数据  默认适配tableV2表   |
| iconSize      | string    |调整图标迟寸   |


## 使用示例

```
// configList 绑定指定显示的数据可以为空数组 如果有指定必须和组件数据一致 参照接口TableOptionsConfigProps[] (字段必须严格指定-你定义sort字段内部会帮你排序)
// tableConfig 适配传入例如columnList字段为组件内部字段  传入组件内部帮你转化 默认已经适配tableV2组件  参照接口TableOptionsConfig
// tableList 为全量传入表格初始数据 类型TableOptionsConfigProps[]

!!! 注意如果configList不为空数组就会读configList数据进行显示 而不是读取tableList数据转化后进行显示

// 可以在这个页面引入测试 src\views\Operations\BillingTemplate\index.vue

<TableOptions v-model="configList" :tableList="columnList" iconSize="25" />
const configList = ref<TableOptionsConfigProps[]>([])
setInterval(() => {
  console.log(configList.value, '用于测试configList-5s捕捉一次值', configList)
}, 5000)

可以通过双向绑定拿到最终确认的值 v-model="configList"
全局注册在 components.d.ts  index.ts
TableOptions: typeof import('./TableOptions')['TableOptions']
app.component('TableOptions', TableOptions)
import { TableOptions } from './TableOptions'
```