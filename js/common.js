// var mainTitle = "杭州联华华商集团有限公司2020春季校园招聘";

// var company = "杭州联华华商集团有限公司";

// // 元素获取部分
// var titleEle = document.querySelector("title"); // 标题元素

// var main = document.querySelector(".main"); //主内容区

// var metaEle = document.querySelectorAll("meta")[2]; // 第三个meta标签

// var reg = /XXX/g;

// var str = metaEle.content.replace(reg, company); // 替换

// titleEle.innerHTML = mainTitle;

// metaEle.content = str;

// var div = document.createElement("DIV");

// var span = document.createElement("SPAN");

// var img = document.createElement("IMG");

// div.className = "copyright";

// span.innerHTML = "未经51job.com同意，不得转载本网站之所有招聘信息及作品 无忧工作网版权所有©1999-" + (new Date().getFullYear());

// if (pageName() == "index.html" || pageName() == "") {

//     img.src = "images/51logo.png";

// } else {

//     img.src = "../images/51logo.png";

// }


// div.appendChild(img);

// div.appendChild(span);

// main.appendChild(div);

// function pageName() {

//     var strUrl = location.href;

//     var arrUrl = strUrl.split("/");

//     var strPage = arrUrl[arrUrl.length - 1];

//     return strPage;

// }


function Copyright(title, company) {

    this.reg = /XXX/g;
    this.title = title;
    this.company = company;
    this.init();

}

Copyright.prototype.init = function () {
    this.getEle();
    this.createEle();
    this.replaceStr();
    this.addText();
    // this.judgeEquipment();
}

Copyright.prototype.getEle = function () {
    this.titleEle = document.querySelector("title");
    this.main = document.querySelector(".main");
    this.metaEle = document.querySelectorAll("meta")[2];
}

Copyright.prototype.createEle = function () {
    this.div = document.createElement("DIV");
    this.span = document.createElement("SPAN");
    this.img = document.createElement("IMG");
}

Copyright.prototype.replaceStr = function () {
    var str = this.metaEle.content.replace(this.reg, this.company);
    this.metaEle.content = str;
    this.titleEle.innerHTML = this.title;
}

Copyright.prototype.addText = function () {
    this.div.className = "copyright";
    this.div.style.textAlign = "center";
    this.div.style.position = "absolute";
    this.div.style.left = "0px";
    this.div.style.bottom = "5px";
    this.div.style.width = "100%";
    if (this.pageName() == "index.html" || this.pageName() == "") {
        this.img.src = "images/51logo.png";
    } else {
        this.img.src = "../images/51logo.png";
    }
    this.img.style.width = "12px";
    this.img.style.marginRight = "5px";
    this.img.style.verticalAlign = "text-bottom";
    this.span.innerHTML = "未经51job.com同意，不得转载本网站之所有招聘信息及作品 无忧工作网版权所有©1999-" + (new Date().getFullYear());
    this.div.appendChild(this.img);
    this.div.appendChild(this.span);
    this.main.appendChild(this.div);
}

Copyright.prototype.pageName = function () {
    var strUrl = location.href;
    var arrUrl = strUrl.split("/");
    var strPage = arrUrl[arrUrl.length - 1];
    // console.log(arrUrl);
    return strPage;
}

Copyright.prototype.currDevice = function () {
    var u = navigator.userAgent;
    var app = navigator.appVersion; // appVersion 可返回浏览器的平台和版本信息。该属性是一个只读的字符串。
    var browserLang = (navigator.browserLanguage || navigator.language).toLowerCase(); //获取浏览器语言

    var deviceBrowser = function () {
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应用程序，没有头部和底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信
            qq: u.match(/\sQQ/i) == " qq", //是否QQ
        }
    }();

    return deviceBrowser;

}

Copyright.prototype.deviceBrowserWH = function () {
    //获取浏览器窗口的内部宽高 - IE9+、chrome、firefox、Opera、Safari：
    var w = window.innerWidth;
    var h = window.innerHeight;

    // HTML文档所在窗口的当前宽高 - IE8.7.6.5
    document.documentElement.clientWidth;
    document.documentElement.clientHeight;
    document.body.clientWidth;
    document.body.clientHeight;

    var screenW = window.screen.width; //设备的宽度
    var screenH = document.body.clientHeight;

    //网页可见区域宽高，不包括工具栏和滚动条（浏览器窗口可视区域大小）
    var webpageVisibleW = document.documentElement.clientWidth || document.body.clientWidth;
    var webpageVisibleH = document.documentElement.clientHeight || document.body.clientHeight;

    //网页正文全文宽高(不包括滚动条)
    var webpageW = document.documentElement.scrollWidth || document.body.scrollWidth;
    var webpageH = document.documentElement.scrollHeight || document.body.scrollHeight;

    //网页可见区域宽高，包括滚动条等边线（会随窗口的显示大小改变）
    var webpageVisibleW2 = document.documentElement.offsetWidth || document.body.offsetWidth;
    var webpageVisibleH2 = document.documentElement.offsetHeight || document.body.offsetHeight;

    // console.log(w + '*' + h);
    // console.log(screenW + '*' + screenH);
    // console.log(webpageVisibleW + '*' + webpageVisibleH);
    // console.log(webpageW + '*' + webpageH);
    // console.log(webpageVisibleW2 + '*' + webpageVisibleH2);
    //网页卷去的距离与偏移量
    /*
	1.scrollLeft:设置或获取位于给定对象左边界与窗口中目前可见内容的最左端之间的距离；
	2.scrollTop:设置或获取位于给定对象最顶端与窗口中目前可见内容的最左端之间的距离；
	3.offsetLeft:设置或获取位于给定对象相对于版面或由offsetParent属性指定的父坐标的计算左侧位置；
	4.offsetTop:设置或获取位于给定对象相对于版面或由offsetParent属性指定的父坐标的计算顶端位置；
    */

    return {
        w: w,
        h: h,
        screenW: screenW,
        screenH: screenH,
        webpageVisibleW: webpageVisibleW,
        webpageVisibleH: webpageVisibleH,
        webpageW: webpageW,
        webpageH: webpageH,
        webpageVisibleW2: webpageVisibleW2,
        webpageVisibleH2: webpageVisibleH2
    }

}

Copyright.prototype.judgeEquipment = function () {

    var result = this.currDevice();

    var docHeight = this.deviceBrowserWH().screenH;

    var clientHeights = this.deviceBrowserWH().webpageVisibleH;

    var banHeight = $(".banner img").height();

    // console.log(docHeight, banHeight, mainHeight);

    console.log(result.mobile);

    if (result.mobile) {

        if (sessionStorage.getItem("banHeight")) {

            banHeight = sessionStorage.getItem("banHeight");

        } else {

            sessionStorage.setItem("banHeight", banHeight);

        }

        this.judgeStyle(docHeight, banHeight, clientHeights);

    }

}

Copyright.prototype.judgeStyle = function (docHeight, banHeight, clientHeights) {

    console.log(docHeight, banHeight, clientHeights);

    if (!(docHeight - banHeight > clientHeights - banHeight)) {

        $("html").height("100%");
        $(".bg_content").css("min-height", (clientHeights - banHeight) + "px");
        $(".main").css("min-height", (clientHeights) + "px");

        console.log("文档高度小于可视内容区高度")

    } else {

        $("html").height("auto");

        console.log("文档高度大于可视内容区高度")

    }

}

$('.toLink').click(function () {

    if (!confirm("您即将离开前程无忧，前往第三方网站，是否继续？")) {

        return false;

    }

})

window.onscroll = function () {

    var heightBanner = $('.banner').height();

    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollTop > heightBanner) {

        $('.header').css({
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'z-index': '99'
        })

        $('.banner').css('margin-bottom', '52px');

    } else {

        $('.header').css('position', 'static');
        $('.banner').css('margin-bottom', '0px');

    }

}

var height = sessionStorage.getItem('height');

if (!height) {

    sessionStorage.setItem('height', $('.banner').height());

    height = $('.banner').height();

}


window.onresize = function () {

    sessionStorage.setItem('height', $('.banner').height());

}

window.scrollTo(0, height);