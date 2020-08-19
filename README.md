# 1、背景
近期，参与了一个活动：[学 Rust，免费拿树莓派](https://segmentfault.com/a/1190000023363546)。  

主要内容为开发应用，在 `node.js` 中调用 `Rust` 函数。  

实际上我认为在很多地方都能用上 `Rust`，鉴于活动要求，或许 `node.js` 是一个不错的切入点，毕竟提供了模版，应该会更快熟悉。  

难点就在于这两，我都没有相关的知识，不过这挑战我接受，学呗！  
工作党，所以就每天挤出点时间来进行了。

# 2、配置环境
配置环境算是每个开发者必须跨过的第一道门槛了。  

根据[教程的环境要求](https://www.secondstate.io/articles/get-started-with-rust-functions-in-node-zh/)，需要使用 `linux` 系统。  

在我的5年老笔记本联想电脑上，是有双系统安装 `ubuntu` 的，但编译操作需要与外网的连通性，网络问题成为了最大的瓶颈。  
搜了一圈，`ubuntu` 的代理工具基本上是要自己配置，多翻代理操作下来，终端能与某些外网连通了，但还是会卡在 `ssvmup build`，使用 `docker` 无解后，又转向了自己手工搭建环境，但会报 `permission denied`，加上 `sudo` 也毫无作用，连 `chmod 777` 也未果。   

后来觉得还是用 `docker` 会比较靠谱，毕竟是别人已经实践过的环境，所以首要目标就是解决网络问题。  
然后就想到了使用虚拟机来安装 `ubuntu` ，网络问题通过桥接主机的代理来解决，实验了一番，终于把 `hello world` 模版跑成功了[泪目]。  

相关的 `docker` 镜像有如下三个：  
```
ssvm-nodejs:v1
secondstate/ssvm-nodejs-starter:v1
registry.cn-hangzhou.aliyuncs.com/chirsz/ssvm-nodejs:latest
```
第三个是评论区网友整的，最终我采用第二个镜像进行操作。  

# 3、熟悉代码
虽然能跑了，但实际的代码还不清楚其原理，所以要先熟悉代码。  
对于学习代码，我主要采用的是先了解相关工具，再看大致代码。  
- ## the cargo config file
The Cargo.toml file shows the dependencies.   
Note the dependency for wasm-bindgen,   
which is required for invoking these Rust functions from JavaScript.   
The dependency for serde and serde-json allows us to work with JSON strings to represent complex data types.  
- ## wasm-pack
工具 wasm-pack，它会帮助我们把我们的代码编译成 WebAssembly 并制造出正确的 npm 包。  
- ## SSVM
The Second State VM (SSVM) is a high-performance WebAssembly runtime optimized for server-side applications.   
This project provides support for accessing SSVM as a Node.js addon.   
It allows Node.js applications to call WebAssembly functions written in Rust or other high-performance languages.
- ## ssvmup
The ssvmup uses wasm-bindgen to automatically generate the “glue” code between JavaScript and Rust source code   
so that they can communicate using their native data types.   
Without it, the function arguments and return values would be limited to very simple types   
(i.e., 32-bit integers) supported natively by WebAssembly.   
用＃[wasm_bindgen]注释每个函数。加过注释后，   
ssvmup 在构建 Rust 函数时，知道生成正确的 JavaScript 到 Rust 接口。  
生成的文件保存在 pkg/ 目录， .wasm 文件是 WebAssembly 字节码程序，.js文件用于JavaScript模块。
- ## Wasm
Wasm is a machine-close, platform-independent, low-level, assembly-like language (Reiser and Bläser, 2017),   
and is the first mainstream programming language to implement formal semantics,   
right from the start (Rossberg et al., 2018).  
- ## Dockerfile
Dockerfile 是一个文本文件，其内包含了一条条的 指令(Instruction)，  
每一条指令构建一层，因此每一条指令的内容，就是描述该层应当如何构建。  

# 4、尝试玩耍
Rust 主要用在一些需要高性能效果的地方，我没有学过 node.js 和 前端的内容，只能简单地做个 demo，把一些吃紧的函数操作用 Rust 来进行替换。  
这个 demo 是一个简单的裁剪图片的前端页面，当点击页面按钮，就裁剪图片，然后显示裁剪后的图片，每点击一次，就裁剪一次。  
## 运行步骤
Must have Node.js installed with the following packages.   
```
$ npm i ssvm sync-request better-sqlite3
$ npm i -g ssvmup
$ npm i -g wasm-pack
```
The Rust functions that make Node.js calls are in the src/lib.rs file.  
```
$ wasm-pack build --target nodejs
```
运行服务  
```
$ node node/app.js
```
打开 public/show_pic.html 即可运行  

# 5、总结
在这里，Rust 主要充当了一个优化器的角色，把一些性能要求高的操作编成 Wasm，供其他语言进行操作。  
在网上也看到很多有意思的操作，像人工智能、网络交互等场景都可以用上。  
整个操作过程，遇到最多的问题是环境问题和网络问题，主要是使用的这些工具需要网络的支持，还有 ubuntu 的权限限制。  
## 参考链接
[入门文档：在 Node.js 应用中调用 Rust 函数](https://www.secondstate.io/articles/get-started-with-rust-functions-in-node-zh/)  
[Learning WebAssembly, Rust, and Node.js](https://github.com/second-state/wasm-learning)