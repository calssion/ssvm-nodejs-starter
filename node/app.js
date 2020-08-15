// 监听并返回字符串
// const { say } = require('../pkg/ssvm_nodejs_starter_lib.js');

let btn1 = document.getElementById('btn');
 
btn1.addEventListener('click', function() {
    ajax('POST', "http://127.0.0.1:3000/", 'name='+this.innerHTML);
});
 
// 封装的ajax方法
function ajax(method, url, val) {  // 方法，路径，传送数据
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                // content.innerHTML = xhr.responseText;
                var image = new Image();
                image.src= this.responseText;
                document.getElementById("image").innerHTML = image.outerHTML;
            } else {
                alert('Request was unsuccessful: ' + xhr.status);
            }
        }
    };
 
    xhr.open(method, url, true);   
    if(val) {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); //设置POST 较常见表单的提交数据方式
    }
    xhr.send(val);
}

const http = require('http');
// const url = require('url');
let qs = require('querystring');
// const hostname = '0.0.0.0';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   const queryObject = url.parse(req.url,true).query;
//   if (!queryObject['name']) {
//     res.end(`Please use command curl http://${hostname}:${port}/?name=MyName \n`);
//   } else {
//     res.end(say(queryObject['name']) + '\n');
//   }
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

var width_num = 2850;
var height_num = 1900;
//该函数用来创建一个HTTP服务器，并将 requestListener 作为 request 事件的监听函数。req请求对象，res响应对象
http.createServer(function(req, res) {   
    let body = '';  // 一定要初始化为"" 不然是undefined
    req.on('data', function(data) {
        body += data; // 所接受的Json数据
    });
    req.on('end', function() { 
        res.writeHead(200, {  // 响应状态
            "Content-Type": "text/plain",  // 响应数据类型
            'Access-Control-Allow-Origin': '*'  // 允许任何一个域名访问
        });
        if(qs.parse(body).name == 'resize') {
            if(width_num>0){ 
                // 对图片进行裁剪
                const { resize_file } = require('../pkg/ssvm_nodejs_starter_lib.js');
      
                const dim = {
                    width: width_num,
                    height: height_num
                };

                resize_file(JSON.stringify([dim, 'cat.png', `test.png`]));
                width_num -= 5;
                height_num -= 5;
                res.write('test.png');
            }
        }
        res.end();
    });   
}).listen(3000);

// 获取 html 的内容
// const { fetch, download } = require('../pkg/ssvm_nodejs_starter_lib.js');
  
// fetch("https://raw.githubusercontent.com/second-state/nodejs-helper/master/LICENSE");
// download("https://www.secondstate.io/", "test.html");

