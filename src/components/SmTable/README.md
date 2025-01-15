## 功能

1. 可配置型，可维护性高
2. 具备`element-plus`原有表格的所有功能
3. 也可以自行拓展更多的功能

## 目的

1. 简单好用
2. 拓展性高
3. 可维护性高

## 个人补充

1. 注意性能-缓存-虚拟滚动使用-分页
2. 表格排序添加sortable属性对表格进行排序给表格添加单选功能
3. 给表格配置新增highlight-current-row属性。
4. 根据current-change事件来管理选中时触发的事件。
5. 给表格添加多选功能。给表格手动添加一个el-table-column，设 type 属性为 selection 即可。根据selection-change事件来管理选中时触发的事件。
