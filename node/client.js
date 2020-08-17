
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