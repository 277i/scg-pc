var params = {
    ctmid: "4963893",
    pagesize: "999",
    poscode: "",
    divid: "",
    jobarea: "",
    keyword: "",
    coid: "",
};
!function (p){
    var coid_obj = {};
    var lis =[
        {name: '上海建工一建集团有限公司', value: '上海建工 一建集团'},
        {name: '上海建工二建集团有限公司', value: '上海建工 二建集团'},
        {name: '上海建工四建集团有限公司', value: '上海建工 四建集团'},
        {name: '上海建工五建集团有限公司', value: '上海建工 五建集团'},
        {name: '上海建工七建集团有限公司', value: '上海建工 七建集团'},
        {name: '上海建工集团股份有限公司总承包部', value: '上海建工 总承包部'},
        {name: '天津住宅建设发展集团有限公司', value: '上海建工 天住集团'},
        {name: '上海市安装工程集团有限公司', value: '上海建工 安装集团'},
        {name: '上海市基础工程集团有限公司', value: '上海建工 基础集团'},
        {name: '上海市机械施工集团有限公司', value: '上海建工 机施集团'},
        {name: '上海市建筑装饰工程集团有限公司', value: '上海建工 装饰集团'},
        {name: '上海园林（集团）有限公司', value: '上海建工 园林集团'},
        {name: '上海市政工程设计研究总院(集团)有限公司', value: '上海市政工程 设计研究总院'},
        {name: '上海市建工设计研究总院有限公司', value: '上海建工 设计总院'},
        {name: '上海建工房产有限公司', value: '上海建工 房产公司',co:'6244794'},
        {name:'上海建工集团投资有限公司',value: '上海建工 投资公司'},
        {name:'上海建工建材科技集团股份有限公司'},,
        {name: '上海外经集团控股有限公司', value: '上海建工 外经控股'},
        {name:'上海建工环境科技有限公司'},
        {name: '上海建工集团股份有限公司海外事业部', value: '上海建工 海外部'},
        {name: '上海建工电子商务有限公司', value: '上海建工 电商公司'},
        {name:"上海建工集团股份有限公司工程研究总院"},
        {name:'上海建工羿云科技有限公司'},
        {name:'上海市工程建设咨询监理有限公司'}
    ]
    coapi.getJobCondition(p.ctmid, function(data) { //搜索器接口
        //取到数据之后的操作
        data.resultbody.coid.forEach(function(a){
            coid_obj[a.value] = a.key;
        })
        console.log(coid_obj);


        var h = '';
        for(var i in lis){
            // h+='<div value="'+coid_obj[lis[i].name]+'">'+lis[i].name+'</div>'

            if(lis[i].co){
                h+='<div data-coid="'+lis[i].co+'">'+lis[i].name+'</div>'
            }else{
                h+='<div data-coid="'+coid_obj[lis[i].name]+'">'+lis[i].name+'</div>'
            }
        }
        $('.zhiwei1').html(h);
    }, p)
}(params);

var inner1 = ''

function job() {
    $(".xr").html("<div>加载中...</div>");
    inner1 = ""
    coapi.getJobList(params, function(data) {
        var flag = false;
        //取到数据之后的操作
        // console.log(data)
        var joblist = data.resultbody.joblist;
        var arrList = []
        for (i in joblist) {
            if (joblist[i].jobname.indexOf("社招") != -1) {
                // flag = !flag;
                arrList.push(joblist[i])
            }
        }

        console.log(arrList.length);
        if (arrList.length != 0) {
            for (i in arrList) {
                // if (joblist[i].jobname.indexOf("社招") != -1) {
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
$(".zw1").click(function() {
    var index = $(".zw1").index(this)
    $(".zw2").hide().eq(index).show()
    $(".zw1").removeClass("zw").eq(index).addClass("zw")
    $(".zw2").removeClass("zzww").eq(index).addClass("zzww")

})

$(".zhiwei1").on("click", ".zzww p", function() {
    var index1 = $(".zzww p").index(this)
    $(".zzww p").removeClass("p1").eq(index1).addClass("p1")
    var valu = $(".zzww p").eq(index1).attr("value")
        // console.log(valu)
    params.poscode = valu
    job()
})






var inner2 = ""
var inner3 = ""
coapi.getJobCondition(params.ctmid, function(data) {
    //取到数据之后的操作
    console.log(data)
    var coid = data.resultbody.coid;
    var jobarea = data.resultbody.jobarea
    for (j in coid) {
        inner2 += '<option value="' + coid[j].key + '">' + coid[j].value + '</option>'
    }
    for (j in jobarea) {
        inner3 += '<option value="' + jobarea[j].key + '">' + jobarea[j].value + '</option>'
    }
    $("#dw").append(inner2)
    $("#dd").append(inner3)
}, params);


$("#dw").change(function() {
    var coid = $(this).val();
    params.coid = coid;
    job()
})

$("#dd").change(function() {
    var jobarea = $(this).val()
    params.jobarea = jobarea
    job()
})

$(".ss").click(function() {
    params.keyword = $(".input1").val()
    job()
})

$(document).on('click',".difsd div",function() {
    var index2 = $(".difsd div").index(this)
    $(".difsd div").removeClass("dif").eq(index2).addClass("dif")
    // var valu2 = $(".difsd div").eq(index2).attr("value")
    // 改成coid
    var valu2 = $(".difsd div").eq(index2).attr("data-coid")
    // console.log('valu2----',valu2)
    params.coid = valu2
    job()
})
// 首次查询所有
job()
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