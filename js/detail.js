function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var jobid = GetQueryString("jobid");

if (jobid == null) {

    window.location.href = "http://ideal.51job.com/scg/html/page7.html";

}

var this_coid = null;

var this_page = null;

if (jobid) {

    coapi.getJobDetail(jobid, function (data) {
        //取到数据之后的操作
        console.log(data)

        this_coid = data.resultbody.coid;

        $('.d_name').html(data.resultbody.jobname);

        $('.companys').html(data.resultbody.coname)

        $('.ls').html('<span>' + data.resultbody.jobareaname + '</span>|<span>' + data.resultbody.term + '</span>|<span>' + data.resultbody.degreefrom + '</span>|<span>招' + data.resultbody.jobnum + '人</span>|<span>' + data.resultbody.issuedate.split(' ')[0] + '发布</span>')

        $('.info').html(data.resultbody.jobinfo);

        $('.post').attr('jobid', data.resultbody.jobid);

        if (data.resultbody.jobname.indexOf('应届') >= 0) {

            this_page = '应届';

            $('.nav li').eq(3).children('a').addClass('active').parent().siblings().children('a').removeClass('active');

        } else if (data.resultbody.jobname.indexOf('社招') >= 0) {

            this_page = '社招';

            $('.nav li').eq(4).children('a').addClass('active').parent().siblings().children('a').removeClass('active');

        } else {

            this_page = '实习生';

            $('.nav li').eq(5).children('a').addClass('active').parent().siblings().children('a').removeClass('active');

        }

    });

} else {

    location.href = 'page4.html';

}

$(document).on('click', '.post', function () {

    var jobid = $(this).attr('jobid');

    jobApply(jobid);

})

$(document).on('click', '.back', function () {

    switch (this_page) {

        case '应届':

            window.location.href = 'http://ideal.51job.com/scg/html/page7.html?coid=' + this_coid;
            // window.location.href = 'page7.html?coid=' + this_coid;

            break;

        case '社招':

            window.location.href = 'http://ideal.51job.com/scg/html/page4.html?coid=' + this_coid;

            break;

        case '实习生':

            window.location.href = 'http://ideal.51job.com/scg/html/page5.html?coid=' + this_coid;

            break;

        default:
            break;
    }

})

function jobApply(jobid) {
    var tempwindow = window;
    $.ajax({
        type: "GET",
        url: "//i.51job.com/delivery/platform/delivery_api.php",
        data: {
            "jobid": jobid
        },
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: 'jobCallback',
        success: function (res) {
            switch (res.status) {
                case ("1"):
                    if (res.result[jobid].status == 1) {
                        alert("投递成功");
                    } else if (res.result[jobid].status == -100) {
                        alert("职位过期");
                    } else if (res.result[jobid].status == -101) {
                        alert("七天内重复投递");
                    } else if (res.result[jobid].status == -102 || res.result[jobid].status == -103) {
                        tempwindow.open(res.result[jobid].result, "_blank");
                        // tempwindow.location.href = res.result[jobid].result;
                    }
                    break;
                case ("-1"):
                    alert("职位传参不合法");
                    break;
                case ("-2"):
                    // tempwindow.location.href = "http://xyz.51job.com/external/apply.aspx?jobid=" + jobid + "&ctmid=" + params.ctmid;
                    // tempwindow.location.href = res.result + "?url=https://jobs.51job.com/all/" + jobid + ".html#jobid=" + jobid;
                    tempwindow.open(res.result + "?url=https://jobs.51job.com/all/" + jobid + ".html", "_blank");
                    // tempwindow.location.href = res.result + "?url=" + jobHref ;
                    break;
                case ("-3"):
                    alert("简历信息不合法");
                    if (res.result != '') {
                        tempwindow.open(res.result, "_blank");
                        // tempwindow.location.href = res.result;
                    }
                    break;
                case ("-4"):
                    alert("简历不完整");
                    if (res.result != '') {
                        tempwindow.open(res.result, "_blank");
                        // tempwindow.location.href = res.result;
                    }
                    break;
                case ("-5"):
                    alert("无简历");
                    if (res.result != '') {
                        tempwindow.open(res.result, "_blank");
                        // tempwindow.location.href = res.result;
                    }
                    break;
                case ("-6"):
                    alert("职位数大于50");
                    if (res.result != '') {
                        tempwindow.open(res.result, "_blank");
                        // tempwindow.location.href = res.result;
                    }
                    break;
            }
        }

    })
}