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

function job() {
    inner1 = ""
    coapi.getJobList(params, function(data) {

        //取到数据之后的操作
        console.log(data)
        var joblist = data.resultbody.joblist
        for (i in joblist) {
            if (joblist[i].jobname.indexOf("应届") != -1)
                inner1 += '<tr class="vb1" value="' + joblist[i].jobid + '">' +
                '<td class="v_sp1" style="width: 235px;"><a href="./info.html?jobid=' + joblist[i].jobid + '">' + joblist[i].jobname + '</a></td>' +
                // '<td class="v_sp1" style="width: 235px;">' + joblist[i].jobname + '</td>' +
                '<td class="v_sp2">' + joblist[i].coname + '</td>' +
                '<td class="v_sp3">' + joblist[i].jobareaname + '</td>' +
                '<td class="v_sp4">' + joblist[i].issuedate.split(' ')[0] + '</td>' +
                '<td class="v_sp5">' + joblist[i].jobnum + '</td>' +
                '</tr>'
        }
        $(".xr").html(inner1)
    });
}
job()

$(document).on("click", ".vb1", function() {
    var jobid = $('.vb1').attr('value')
    console.log(jobid);
    window.location.href = "/test/scg3/info.html?jobid=" + jobid
})

// $(".zw2").eq(0).show()
$(".zw1").click(function() {
    var index = $(".zw1").index(this)
    $(".zw2").eq(index).toggle()
    $(".zw1").removeClass("zw").eq(index).addClass("zw")
    $(".zw1").removeClass("zw11").eq(index).addClass("zw11")
    $(".zw2").removeClass("zzww").eq(index).addClass("zzww")
})

// $(".zhiwei1").on("click", ".zzww p", function() {
//     console.log(123);
//     var index1 = $(".zzww p").index(this)
//     $(".zzww p").removeClass("p1").eq(index1).addClass("p1")
//     var valu = $(".zzww p").eq(index1).attr("value")
//     console.log(valu)
//     params.poscode = valu
//     job()
// })

$(".zhiwei1 p").eq(0).click()




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

$(".zw2").click(function() {
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
//             '<span class="lji"><a href="https://vip.51job.com/external/personal/personal_applyjob.aspx?ctmid=' + resultbody.ctmid + '&jobid=' + resultbody.jobid + '">立即申请</a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
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