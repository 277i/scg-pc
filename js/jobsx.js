function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
// 实习生id【企业id】
let agencyId = getUrlParam('agencyId')
let coidArr = undefined
// var coid_obj = {};

let jobData = {
    lis: [
        { name: '上海建工一建集团有限公司', value: '上海建工 一建集团', co: '6244794' },
        { name: '上海建工二建集团有限公司', value: '上海建工 二建集团' },
        { name: '上海建工四建集团有限公司', value: '上海建工 四建集团' },
        { name: '上海建工五建集团有限公司', value: '上海建工 五建集团' },
        { name: '上海建工七建集团有限公司', value: '上海建工 七建集团' },
        { name: '上海建工集团股份有限公司总承包部', value: '上海建工 总承包部' },
        { name: '天津住宅建设发展集团有限公司', value: '上海建工 天住集团' },
        { name: '上海市安装工程集团有限公司', value: '上海建工 安装集团' },
        { name: '上海市基础工程集团有限公司', value: '上海建工 基础集团' },
        { name: '上海市机械施工集团有限公司', value: '上海建工 机施集团' },
        { name: '上海市建筑装饰工程集团有限公司', value: '上海建工 装饰集团' },
        { name: '上海园林（集团）有限公司', value: '上海建工 园林集团' },
        { name: '上海市政工程设计研究总院(集团)有限公司', value: '上海市政工程 设计研究总院' },
        { name: '上海市建工设计研究总院有限公司', value: '上海建工 设计总院' },
        { name: '上海建工房产有限公司', value: '上海建工 房产公司', co: '6244794' },
        { name: '上海建工集团投资有限公司', value: '上海建工 投资公司' },
        { name: '上海建工建材科技集团股份有限公司' }, ,
        { name: '上海外经集团控股有限公司', value: '上海建工 外经控股' },
        { name: '上海建工环境科技有限公司' },
        { name: '上海建工集团股份有限公司海外事业部', value: '上海建工 海外部' },
        { name: '上海建工电子商务有限公司', value: '上海建工 电商公司' },
        { name: "上海建工集团股份有限公司工程研究总院" },
        { name: '上海建工羿云科技有限公司' },
        { name: '上海市工程建设咨询监理有限公司' }
    ],
    coid_obj: {}
}

/**
 * 设置导航栏选中
 */
let SetNavBar = (id) => {
    var h = '';
    for (var i in jobData.lis) {
        if (jobData.lis[i].co) {
            h += `<div class="${id == jobData.lis[i].co ? 'dif' : ''}" data-coid="${jobData.lis[i].co}">` + jobData.lis[i].name + '</div>'
        } else if (jobData.coid_obj[jobData.lis[i].name]) {
            h += `<div class="${id == jobData.coid_obj[jobData.lis[i].name] ? 'dif' : ''}"  data-coid="${jobData.coid_obj[jobData.lis[i].name]}">` + jobData.lis[i].name + '</div>'
        } else {
            h += `<div class="${id == "0001" + i ? 'dif' : ''}" data-coid="0001${i}">` + jobData.lis[i].name + '</div>'
        }
    }
    $('.zhiwei1').html(h);
}
/**重置下拉框选中 */
let setSelect = (val) => {
    let coidArrInnerHtml = ""
    coidArrInnerHtml += `<option value="">全部招聘单位</option>`
    for (j in coidArr) {
        coidArrInnerHtml += `<option value="${coidArr[j].key}" ${coidArr[j].key == val ? "selected" : ''}>${coidArr[j].value}</option>`
    }
    $("#dw").html(coidArrInnerHtml)
}

/**
 * 替换地址栏url，重置校招，社招，实习生的 导航栏跳转链接
 * @param {} valu2 
 */
let setUrlChange = (valu2) => {
    // 替换 页面url的
    var url = new URL(window.location.href);
    const sps = new URLSearchParams($(location).attr('search'))
    sps.set('agencyId', valu2)
    sps.set('rand', Math.random(0, 1) * 100000)
    url.search = sps.toString();
    history.replaceState(null, '', url.href);


    if (valu2) {
        $('.CampusRecruitment').html(`<a href="./index4.html?agencyId=${valu2}">校园招聘</a>`)
        $('.SocialRecruitment').html(`<a href="./index5.html?agencyId=${valu2}">社会招聘</a>`)
        $('.TraineeRecruitment').html(`<a href="./index6.html?agencyId=${valu2}">实习生招聘</a>`)
    }

}



console.log("=====加载");
// <div value="6084875">上海建工一建集团有限公司</div>
// <div value="6084876">上海建工二建集团有限公司</div>
// <div value="6084877">上海建工四建集团有限公司</div>
// <div value="6084878">上海建工五建集团有限公司</div>
// <div value="6084879">上海建工七建集团有限公司</div>
// <div value="">上海建工集团总承包部</div>
// <div value="6084880">上海建工集团股份有限公司总承包部</div>
// <div value="6084881">上海市安装工程集团有限公司</div>
// <div value="6084882">上海市基础工程集团有限公司</div>
// <div value="">上海市机械施工集团有限公司</div>
// <div value="6084884">上海市建筑装饰工程集团有限公司</div>
// <div value="6084885">上海园林（集团）有限公司</div>
// <div value="">上海市建工设计研究总院有限公司</div>
// <div value="">上海建工建材科技集团股份有限公司</div>
// <div value="6084891">上海外经集团控股有限公司</div>
// <div value="">上海建工集团股份有限公司海外工程分公司</div>
// <div value="">上海市工程建设咨询监理有限公司</div>
// <div value="">上海建工电子商务有限公司</div>
// <div value="">上海市建筑教育培训服务中心有限公司</div>
// <div value="6084896">上海建工集团工程研究总院</div>
// <div value="">上海建工房产有限公司</div>
// })


var params = {
    ctmid: "4963893",
    pagesize: "999",
    poscode: "",
    divid: "",
    jobarea: "",
    keyword: "",
    coid: "",
};





var inner1 = ''

function job() {
    console.log(agencyId, "agencyId");
    if (!params.coid) {
        params.coid = agencyId
    }

    $(".xr").html("<div>加载中...</div>");
    inner1 = ""
    coapi.getJobList(params, function (data) {

        //取到数据之后的操作
        // console.log(data)
        var joblist = data.resultbody.joblist;
        var arrList = []
        for (i in joblist) {
            if (joblist[i].jobname.indexOf("实习") != -1) {
                arrList.push(joblist[i])
            }
        }

        // console.log(arrList.length);
        if (arrList.length != 0) {
            for (i in arrList) {
                // if (joblist[i].jobname.indexOf("实习") != -1) {
                inner1 +=
                    '<tr class="vb1">' +
                    '<td class="v_sp1"><a href="./job.html?jobid=' +
                    arrList[i].jobid +
                    '">' +
                    arrList[i].jobname +
                    "</a></td>" +
                    '<td class="v_sp2">' +
                    arrList[i].coname +
                    "</td>" +
                    '<td class="v_sp3">' +
                    arrList[i].jobareaname +
                    "</td>" +
                    '<td class="v_sp4">' +
                    arrList[i].issuedate.split(" ")[0] +
                    "</td>" +
                    '<td class="v_sp5">' +
                    arrList[i].jobnum +
                    "</td>" +
                    "</tr>";
                // }
            }
        } else {
            inner1 = '<h1 class="xxv">暂无职位</h1>';
            // console.log(1111);
        }
        $(".xr").html(inner1)
    });
}



$(".zw2").eq(0).show()
$(".zw1").click(function () {
    var index = $(".zw1").index(this)
    $(".zw2").hide().eq(index).show()
    $(".zw1").removeClass("zw").eq(index).addClass("zw")
    $(".zw2").removeClass("zzww").eq(index).addClass("zzww")

})

$(".zhiwei1").on("click", ".zzww p", function () {
    var index1 = $(".zzww p").index(this)
    $(".zzww p").removeClass("p1").eq(index1).addClass("p1")
    var valu = $(".zzww p").eq(index1).attr("value")
    // console.log(valu)
    params.poscode = valu
    job()
})



const getNvas = () => {

    SetNavBar(agencyId)


    $(".difsd div").click(function () {
        console.log("click------------------");
        var index2 = $(".difsd div").index(this)
        $(".difsd div").removeClass("dif").eq(index2).addClass("dif")
        var valu2 = $(".difsd div").eq(index2).attr("data-coid")

        setUrlChange(valu2)
        setSelect(valu2)

        params.coid = valu2
        job()
    })
}



var inner2 = ""
var inner3 = ""
coapi.getJobCondition(params.ctmid, function (data) {
    //取到数据之后的操作
    coidArr = data.resultbody.coid;
    console.log("data", coidArr)
    console.log("data", coidArr, "--------------------------")

    var jobarea = data.resultbody.jobarea
    for (j in coidArr) {
        inner2 += `<option value="${coidArr[j].key}" ${coidArr[j].key == agencyId ? "selected" : ''}>${coidArr[j].value}</option>`
    }
    for (j in jobarea) {
        inner3 += '<option value="' + jobarea[j].key + '">' + jobarea[j].value + '</option>'
    }

    //取到数据之后的操作
    data.resultbody.coid.forEach(function (a) {
        jobData.coid_obj[a.value] = a.key;
    })

    getNvas()

    console.log("---------coid_obj--------------", jobData.coid_obj);

    $("#dw").append(inner2)
    $("#dd").append(inner3)
}, params);


$("#dw").change(function () {
    var coid = $(this).val();
    setUrlChange(coid)
    SetNavBar(coid)
    params.coid = coid;
    job()
})

$("#dd").change(function () {
    var jobarea = $(this).val()
    params.jobarea = jobarea
    job()
})

$(".ss").click(function () {
    params.keyword = $(".input1").val()
    job()
})



// var inner4 = ''
// $(".xr").on("click", ".vb1", function() {
//     inner4 = ''
//     var index2 = $(".vb1").index(this)
//     var val3 = $(".vb1").eq(index2).attr("value")
//     jobid = val3
//     coapi.getJobDetail(jobid, function(data) {
//         //取到数据之后的操作
//         console.log(data)
//         var resultbody = data.resultbody
//         inner4 += '<div class="xqqx">' +
//             '<div class="a1">' + resultbody.jobname + '</div>' +
//             '<br>' +
//             '<div class="a2">' +
//             '<span>' + resultbody.coname + '</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
//             '<span>' + resultbody.jobareaname + '</span>|' +
//             '<span>' + resultbody.term + '</span>|' +
//             '<span>' + resultbody.degreefrom + '</span>|' +
//             '<span>' + resultbody.jobnum + '</span>|' +
//             '<span>' + resultbody.issuedate.split(' ')[0] + '</span>' +
//             '</div>' +
//             '<div class="xingqinga">' + resultbody.jobinfo + '</div>' +
//             '<div>' +
//             '<span class="lji"><a href="https://jobs.51job.com/all/' + resultbody.jobid + '.html">立即申请</a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
//             '<span class="fh">返回职位列表</span>' +
//             ' </div>' +
//             '</div>'
//         $(".xxrr").html(inner4)
//     });
//     $(".zhiwei").hide()
//     $(".xxrr").show()
// })

// $(".cen_c1").on("click", ".fh", function() {
//     $(".zhiwei").show()
//     $(".xxrr").hide()
// })

// $(".difsd div").eq(0).click();

