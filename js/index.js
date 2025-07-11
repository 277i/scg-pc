
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
// 社招id【企业id】
let agencyId = getUrlParam('agencyId')


var params = {
    ctmid: "4963893",
    pagesize: "999",
    poscode: "",
    divid: "",
    jobarea: "",
    keyword: "",
    jobid: "",
    coid: "",
};

var inner1 = ''
// 获取地址栏参数 ?coid=6084898
let urlParams = $.getUrl()

function job() {

    if (!params.coid) {
        params.coid = agencyId
    }

    inner1 = ""
    coapi.getJobList(params, function (data) {

        //取到数据之后的操作
        console.log(data)
        var joblist = data.resultbody.joblist
        var newJoblist = []
        if (joblist !== undefined) {
            joblist.forEach((item, index) => {
                if (item.jobid == '142767083' || item.jobid == '142767283') {
                    newJoblist.push(item)
                    joblist.splice(index, 1)
                }
            });
            joblist = [...newJoblist, ...joblist]
            for (i in joblist) {
                if (joblist[i].jobname.indexOf("应届") != -1)
                    inner1 += '<tr class="vb1" value="' + joblist[i].jobid + '">' +
                        '<td class="v_sp1"><a href="./job1.html?jobid=' + joblist[i].jobid + '">' + joblist[i].jobname + '</a></td>' +
                        '<td class="v_sp2">' + joblist[i].coname + '</td>' +
                        '<td class="v_sp3">' + joblist[i].jobareaname + '</td>' +
                        '<td class="v_sp4">' + joblist[i].issuedate.split(' ')[0] + '</td>' +
                        '<td class="v_sp5">' + joblist[i].jobnum + '</td>' +
                        '</tr>'
            }
            $(".xr").html(inner1)
        } else {
            $(".xr").html('')
        }
    });
}



// $(".zw2").eq(0).show()
$(".zw1").click(function () {
    var index = $(".zw1").index(this)
    console.log('当前值----', $(this).attr("value"))
    let value = $(this).attr("value")
    // 样式切换
    $(".zw1").removeClass("zw").eq(index).addClass("zw")
    $(".zw1").removeClass("zw11").eq(index).addClass("zw11")
    // 调取接口
    params.poscode = value
    job()
    // 职位显示
    // $(".tu9").hide()
    // $(".zhiwei2_sd").show()

    // $(this).addClass('zw11').siblings().removeClass('zw11')
    // $(".zw2").eq(index).toggle()
    // $(".zw1").removeClass("zw").eq(index).addClass("zw")
    // $(".zw1").removeClass("zw11").eq(index).addClass("zw11")
    // $(".zw2").removeClass("zzww").eq(index).addClass("zzww")

})

$(".zhiwei1").on("click", ".zzww p", function () {
    var index1 = $(".zzww p").index(this)
    $(".zzww p").removeClass("p1").eq(index1).addClass("p1")
    var valu = $(".zzww p").eq(index1).attr("value")
    // console.log(valu)
    params.poscode = valu
    job()
})

$(".zhiwei1 p").eq(0).click()




var inner2 = ""
var inner3 = ""
let coidArr = undefined
coapi.getJobCondition(params.ctmid, function (data) {
    //取到数据之后的操作
    console.log(data)
    var coidArr = data.resultbody.coid;
    var jobarea = data.resultbody.jobarea

    for (j in coidArr) {
        inner2 += `<option value="${coidArr[j].key}" ${coidArr[j].key == agencyId ? "selected" : ''}>${coidArr[j].value}</option>`
    }

    for (j in jobarea) {
        inner3 += '<option value="' + jobarea[j].key + '">' + jobarea[j].value + '</option>'
    }
    $("#dw").append(inner2)
    $("#dd").append(inner3)
    // 判断地址栏参数 如果携带coid参数则进行筛选
    if (urlParams && urlParams.coid) {
        // 对应的公司选中
        $("#dw").find(`option[value=${urlParams.coid}]`).attr("selected", true)
        // 筛选职位
        params.coid = urlParams.coid;
        console.log('params----', params)
        job()
    } else {
        // 不携带参数
        job()
    }
}, params);

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

$("#dw").change(function (event) {
    console.log('urlParams3333-----', event)
    var coid = $(this).val();
    console.log('执行了----', coid)
    setUrlChange(coid)
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

$(".zw2").click(function () {
    $(".tu9").hide()
    $(".zhiwei2_sd").show()
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

// $(".cen_c").on("click", ".fh", function() {
//     $(".zhiwei").show()
//     $(".xxrr").hide()
// })