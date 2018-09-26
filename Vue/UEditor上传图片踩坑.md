# 前言
最近在Vue项目中需要使用UEditor的图片上传功能，于是阅读UE的官方文档，发现官方文档中对前后端配置的描述并不明晰，因此在实现该功能后写个东东总结一下这个踩坑的过程
先贴上官网文档地址：[http://fex.baidu.com/ueditor/#server-deploy](http://fex.baidu.com/ueditor/#server-deploy)

# 前端配置

1. 在前端包中的`ueditor.config.js`文件中找到`serverUrl: ''`这个配置（事实上图片上传前端只需要配置这一个属性），将其值设为接口url，如：`{ serverUrl: '/system/ueditor' }`
2. 由于前端项目还是在本地进行开发，因此在`webpack`的`proxyTable`中（/config/index.js）将`'/system'`代理到服务器地址：`module.exports = { dev: { proxyTable: { 'system': 'http://xxx.xxx.xxx.xxx' } } }`

# 后端配置

1. 实现一个接收`GET`请求的接口`/system/ueditor`（这个接口名不是固定的，后端配置也只需要实现这一个接口），接口接收`action`和`noCache`两个字段，`noCache`用于及时获取新数据，`action`用于声明当前需要进行的操作，可取的值有`config`（获取配置信息）、`uploadimage`（上传图片）等（所有取值在官方源码包中的`/jsp/config.json`中可以查看）
2. 当接口接收到对应的信息时，直接返回一个包含配置信息的`json`对象，如：（具体配置属性可在官网查询）

`action=config`：
```json
{
    "imageUrl": "http://localhost/ueditor/php/controller.php?action=uploadimage",
    "imagePath": "/ueditor/php/",
    "imageFieldName": "upfile",
    "imageMaxSize": 2048,
    "imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"]
    "其他配置项...": "其他配置值..."
}
```

`action=uploadimage`：
```json
{
    "state": "SUCCESS",
    "original": "80px - \u526f\u672c（2）.jpg",
    "size": "13252",
    "title": "135485454154.jpg",
    "type": ".jpg",
    "url": "/ueditor/jsp/upload/image/20180818/135485454154.jpg"
}
```

3. 浏览器在初始化一个UEditor的时候会先发送一个`action=config`的请求拉取配置信息，上传图片时则会调用`action=uploadimage`