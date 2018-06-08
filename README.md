### 使用 gulp 来架构常规的运营活动页面

#### 选择使用 gulp 的理由

1.  不想把珍贵的时间浪费在刷新页面上，希望可以将屏幕分成两半，左边用来预览，右边用来改代码
2.  公司开发服务器经常挂掉，以前的 sftp 的开发模式不好用
3.  TinyPng 图片压缩的官网经常访问不了，希望自己可以做图片压缩
4.  活动页面的 js 和 css 很多都没有压缩，希望自己可以做压缩

#### 效果预览

![image](https://olpkwt43d.qnssl.com/myapp/livereload.gif)

#### 安装使用

- 所需环境 nodejs，[nodejs 下载地址](https://pan.baidu.com/s/1geLgpqz)，安装过程勾选`add path to system`就不用手动添加安装目录到系统环境变量了

- 克隆或者下载项目
  这里最好安装`cnpm`或者使用`yarn`，npm 比较慢，不清楚你可以参考[淘宝 cnpm](http://npm.taobao.org/)
  `git clone https://github.com/Andyliwr/gulp-activityPage.git yarn install yarn run dev`
- 运行项目
  直接 cmd 到当前项目下输入`gulp serve`，gulp 会自动帮你打开`localhost:8080`，运行项目下的`index.html`,然后你修改文件就会自动刷新了。所有压缩和编译后的文件都放在了`dist`目录下，提测的时候直接把这个目录上传就好了

- 另一个命令
  执行`gulp build`会将原来生成的文件删除并重新生产一遍

### 配置文件说明

```json
{
  "project": "test",
  "localServer": {
    "host": "localhost",
    "port": "3000" // 启动端口
  },
  "tinypngApi": "Q0Q_7x6ppzaVY00KSOu1vc5-FVKyN20J", // tinypng官网给的开发秘钥
   // sftp设置
  "upload": {
    "use": false,
    "protocol": "sftp",
    "host": "192.168.47.227",
    "user": "lidikang",
    "password": "lidikang",
    "port": "22",
    "remotePath": "/home/lidikang/test_page/"
  }
}
```

### 活动页面其他利器

- 移动端调试工具-[`eruda`](https://eruda.liriliri.io/)

```
<script src="https://cdn.bootcss.com/eruda/1.4.4/eruda.min.js"></script>
<script>eruda.init();</script>
```

- 雪碧图生成工具[sprite-generator](https://www.toptal.com/developers/css/sprite-generator)

### 更新历史

- 使用`browser-sync`替换`liveload`，这样运行的时候不用再额安装 chrome 自动刷新插件也能实现自动刷新 ---- 2018 年 04 月 22 日
- 将`gulp`命令加入到`package.json`的`script`字段中，这样运行的时候就不需要全局安装`gulp`了 ---- 2018 年 06 月 08 日
