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
    $(".xr").html("<div>加载中...</div>");
    inner1 = ""
    coapi.getJobList(params, function(data) {

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

$(".difsd div").click(function() {
    var index2 = $(".difsd div").index(this)
    $(".difsd div").removeClass("dif").eq(index2).addClass("dif")
    var valu2 = $(".difsd div").eq(index2).attr("value")
    params.coid = valu2
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