在vue+typescript的项目中，使用了element-ui的表单校验组件与输入框组件的输入建议，踩了一些坑，在此分享给大家（参考element-ui官方文档中表单组件‘带输入建议’、输入框组件‘自定义校验规则’部分的代码）

### 1. 输入建议中的输入过滤器
```javascript
createFilter(queryString) {
  return (restaurant) => {
    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
  };
},
```
`restaurant.value.toLowerCase()`这里取用对象里的字段必须使用`value`，用其他字段名无法加载列表，若数据中无`value`字段，较好的解决方案是这样`item.value = item.source`，将需要使用的字段复制到`value`字段上

### 2. 自定义校验规则
有一个表单项，表单项的值需要验证是否与一个列表中的数据匹配，若可以匹配，则允许提交，因此有了以下的代码
```javascript
<template>
  <el-form ref="form" v-if="keyList" :model="form" :rules="rules">
    ...
    <el-form-item>
      <el-autocomplete v-model="form.keyName" :fetch-suggestions="queryKey" :trigger-on-focus="false"></el-autocomplete>
    </el-form-item>
  </el-form>
</template>
export default class Key extends Vue {
  // 表单数据
  private form: any = {
    key: 'value'
  }
  // 校验规则
  private rules: object = {
      key: [ { validator: this.keyValid, trigger: 'change' } ],
  }
  // 校验列表
  private keyList: any[] = [
    { keyName: 'test', keyId: 100001 }
    ...
  ]
  // 校验方法
  private keyValid(rule: any, value: any, callback: any) {
    for (let item of this.keyList) {
      if (item.keyName === value) {
        callback()
        return
      }
    }
    callback(new Error('not exist'))
  }
  // 输入信息触发校验
  private queryKey(queryString: any, cb: any) {
    let keyList = this.keyList
    let results = queryString ? keyList.filter(this.createFilter(queryString)) : keyList
    // 调用 callback 返回建议列表的数据
    cb(results)
  }
  // createFilter
  private createFilter(queryString: any) {
    return (key: any) => {
      return (key.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    }
  }
  // 初始化校验列表
  private initKey() {
    this.$ajax.getKey().then((res: any) => {
      if (res.code === 200) {
        for (let item of res.data) {
          item.value = item.keyName
        }
        this.keyList = res.data
      }
    })
  }
}
```
初始化数据一般是通过ajax请求获得，ajax是异步操作，所以可能出现第一次校验时列表数据还没有加载成功的问题。因此可以在需要初始化数据的标签上加`v-if="keyList"`，确保校验列表加载完成才渲染组件。