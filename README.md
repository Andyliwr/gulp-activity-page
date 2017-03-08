### 使用gulp来架构常规的运营活动页面

#### 选择使用gulp的理由
1. 不想把珍贵的时间浪费在刷新页面上，希望可以将屏幕分成两半，左边用来预览，右边用来改代码
2. 公司开发服务器经常挂掉，以前的sftp的开发模式不好用
3. TinyPng图片压缩的官网经常访问不了，希望自己可以做图片压缩
4. 活动页面的js和css很多都没有压缩，希望自己可以做压缩

#### 效果预览
![image](https://olpkwt43d.qnssl.com/myapp/livereload.gif)

#### 安装使用
+ 所需环境nodejs，[nodejs下载地址](https://pan.baidu.com/s/1geLgpqz)，安装过程勾选`add path to system`就不用手动添加安装目录到系统环境变量了

+ 克隆或者下载项目
	这里最好安装cnpm，npm比较慢，不清楚你可以参考[淘宝cnpm](http://npm.taobao.org/)
	```
	git clone https://github.com/Andyliwr/gulp-activityPage.git
	cnpm install -g gulp
	cnpm install
	```
	想要让chrome支持实时刷新，需要一个chrome插件，[点击这儿去下载插件](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei),在项目运行时，这个chrome插件中间的空心圆点变成了实心就表示项目已经运行成功了。

	![image02](http://think2011.qiniudn.com/gulp-livereload2.gif)

+ 运行项目
	直接cmd到当前项目下输入`gulp serve`，gulp会自动帮你打开`localhost:8080`，运行项目下的`index.html`,然后你修改文件就会自动刷新了。所有压缩和编译后的文件都放在了`dist`目录下，提测的时候直接把这个目录上传就好了

+ 另一个命令
	执行`gulp build`会将原来生成的文件删除并重新生产一遍