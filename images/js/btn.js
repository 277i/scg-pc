var zgs = [{
        name: '上海建工一建集团有限公司',
        dz: '上海市浦东新区福山路33号',
        dh: '021-58885866',
        wz: 'http://www.sc1gc.com.cn/'
    },
    {
        name: '上海建工二建集团有限公司',
        dz: '上海市虹口区梧州路289号',
        dh: '021-65377604',
        wz: 'http://www.sh2j.com/'
    },
    {
        name: '上海建工四建集团有限公司',
        dz: '上海市闵行区桂林路928号',
        dh: '021-54519518',
        wz: 'http://www.scc4.cn'
    },
    {
        name: '上海建工五建集团有限公司',
        dz: '上海市普陀区曹杨路1000号',
        dh: '62163153',
        wz: 'http://www.scgwj.com/'
    },
    {
        name: '上海建工七建集团有限公司',
        dz: '上海市武夷路150号',
        dh: '021-62527188',
        wz: 'http://www.sc7gc.com.cn/'
    },
    {
        name: '上海建工集团股份有限公司总承包部',
        dz: '上海市虹口区东大名路666号',
        dh: '021-55885959-8391',
        wz: ''
    },
    {
        name: '天津住宅建设发展集团有限公司',
        dz: '',
        dh: '022-23023610',
        wz: 'https://tjhousing.scg.com.cn/'
    },
    {
        name: '上海市安装工程集团有限公司',
        dz: '上海市虹口区塘沽路路390号',
        dh: '021-63250629',
        wz: 'http://www.siec.cn'
    },
    {
        name: '上海市基础工程集团有限公司',
        dz: '上海市基础工程集团有限公司',
        dh: '021-63217655',
        wz: 'http://www.sfeg.cc/'
    },
    {
        name: '上海市机械施工集团有限公司',
        dz: '上海市静安区洛川中路701号',
        dh: '021-26101762',
        wz: 'http://www.chinasmcc.com/'
    },
    {
        name: '上海市建筑装饰工程集团有限公司',
        dz: '上海市静安区永和路318弄3号楼',
        dh: '021-206079955',
        wz: 'http://www.scdec.com'
    },
    {
        name: '上海园林（集团）有限公司',
        dz: '上海市长宁区福泉北路88号',
        dh: '021-63127878',
        wz: 'http://www.sggc.com.cn/'
    },
    {
        name: '上海市建工设计研究总院有限公司',
        dz: '上海市徐汇区吴中路51号1号楼',
        dh: '021-62107484',
        wz: 'http://www.scdri.com/'
    },
    {
        name: '上海建工建材科技集团股份有限公司',
        dz: '虹口区四平路4848号',
        dh: '021-25252874',
        wz: 'http://www.sh-cm.com'
    },
    {
        name: '上海外经集团控股有限公司',
        dz: '上海市徐汇区小木桥路681号上海外经大厦10楼',
        dh: '021-61952888',
        wz: 'http://www.sfeco.net.cn/'
    },

    {
        name: '上海建工集团有限公司股份有限公司海外工程分公司',
        dz: '上海市徐汇区小木桥路681号603室',
        dh: '021-61952680',
        wz: ''
    },
    // {
    //     name: '上海建工集团股份有限公司',
    //     dz: '上海市东大名路666号',
    //     dh: '021-55885959',
    //     wz: ''
    // },
    {
        name: '上海市工程建设咨询监理有限公司',
        dz: '上海市杨浦区营口路588弄8楼',
        dh: '021-55225252',
        wz: 'http://www.sccs.sh.cn'
    },
    {
        name: '上海建工电子商务有限公司',
        dz: '上海市长宁区武夷路150号1号楼4楼',
        dh: '021-62516006',
        wz: 'http://www.yzscg.cn/'
    },
    {
        name: '上海市建筑教育培训服务中心有限公司',
        dz: '上海市长宁区武夷路150号1号楼',
        dh: '021-52048037',
        wz: ''
    },
    {
        name: '上海建工集团工程研究总院',
        dz: '上海市闵行区新骏环路700号',
        dh: '021-52965588-8240',
        wz: 'http://www.scg.cn'
    },
]

var h2 = '';
zgs.forEach(function(item, i) {
    h2 += '<div class="z-box">' +
        '<div class="z-box-tit">' + item.name + '</div>' +
        '<div>地址：' + item.dz + '</div>' +
        '<div>邮编：200080</div>' +
        '<div>电话：' + item.dh + '</div>'
    if (item.wz) {
        h2 += '<div>网址：<a href="#' + item.wz + '" class="hong">' + item.wz + '</a>'
    }
    h2 += '</div>' +
        '</div>'
})
$('.z-tit').append(h2);


// coapi.getJobDetail("134837944",function(data){
//     console.log(data);
// })

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

        success: function(res) {

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

var params = {
        ctmid: "4963893",
        keyword: "",
        coid: "",
        divid: "",
        pagesize: '2000',
    }
    // coapi.getJobList(params, function (data) {
    //     //取到数据之后的操作
    //     var job = data.resultbody.joblist;

//     console.log(job);
// });

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
        {name: '上海市建工设计研究总院有限公司', value: '上海建工 设计总院'},
        {name: '上海建工房产有限公司', value: '上海建工 房产公司'},
        {name: '上海外经集团控股有限公司', value: '上海建工 外经控股'},
        {name: '上海建工集团股份有限公司海外事业部', value: '上海建工 海外部'},
        {name: '上海建工电子商务有限公司', value: '上海建工 电商公司'}
    ]
    coapi.getJobCondition(p.ctmid, function(data) { //搜索器接口
        //取到数据之后的操作
        data.resultbody.coid.forEach(function(a){
            coid_obj[a.value] = a.key;
        })
        console.log(coid_obj);


        var h = '';
        for(var i in lis){
            h+='<div data-coid="'+coid_obj[lis[i].name]+'">'+lis[i].value+'</div>'
        }
        $('.functypebox2').html(h);
    }, p)
}(params);


function getJobCon(p, tp) { //搜索器函数
    coapi.getJobCondition(p.ctmid, function(data) { //搜索器接口
        //取到数据之后的操作
        console.log(data)
        switch (tp) {
            case "校招":
                conbox(data, '#jobarea1', '#coid1')
                break;
            case "社招":
                conbox(data, '#jobarea2', '#coid2')
                break;
            case "实习生":
                conbox(data, '#jobarea3', '#coid3')
                break;
        }
    }, p)
}

function conbox(data, areabox, dividbox) {
    for (var i = 0; i < data.resultbody.coid.length; i++) {
        $(dividbox).append('<option value="' + data.resultbody.coid[i].key + '">' + data.resultbody.coid[i].value + '</option>')
    }
    // for (var i = 0; i < data.resultbody.jobarea.length; i++) {
    //     var str = data.resultbody.jobarea[i].key;
    //     // console.log(str);
    //     if(str.substring(2) == '0000'){
    //         $(areabox).append('<option value="' + data.resultbody.jobarea[i].key + '">' + data.resultbody.jobarea[i].value + '</option>')
    //     }
    // }
}
getJobCon(params, '校招') //调用搜索器接口函数
getJobCon(params, '社招')
getJobCon(params, '实习生')

function getJobList(p, box, tp) {
    box.html("<div>加载中...</div>")
    coapi.getJobList(p, function(data) {
        //取到数据之后的操作
        var job = data.resultbody.joblist;
        console.log(job);
        switch (tp) {
            case '校招':
                var arr = [];
                for (var i in job) {
                    if (job[i].jobname.indexOf('应届') != '-1') {
                        arr.push(job[i]);
                    }
                }
                jobhtml(arr, box);
                break;
            case '社招':
                var arr = [];
                for (var i in job) {
                    if (job[i].jobname.indexOf('社招') != '-1') {
                        arr.push(job[i]);
                    }
                }
                jobhtml(arr, box);
                break;
            case '实习生':
                var arr = [];
                for (var i in job) {
                    if (job[i].jobname.indexOf('实习') != '-1') {
                        arr.push(job[i]);
                    }
                }
                jobhtml(arr, box);
                break;
        }
        // console.log(job);
    });
}

function jobhtml(job, box) {
    var h = '<ul class="list">';
    if (Array.isArray(job) && job.length != 0) {
        job.forEach(function(item, i) {
            h += '<li>' +
                '<div class="name">' +
                '    <div class="flexbox j-c-s-b"><div>' + item.jobname + '</div><div>' + item.workareaname + '</div></div>' +
                '    <a href="javascript:;" data-jobid="' + item.jobid + '" data-ctmid="' + item.ctmid + '" class="go">立即申请</a>' +
                '</div>' +
                '<div>' +
                '    <div>工作地点：' + item.workareaname + '</div>' +
                '    <div>招聘单位：' + item.coname + '</div>' +
                '    <div>招聘人数：' + item.jobnum + '</div>' +
                // '    <div>招聘需求：' + item.jobinfo + '</div>' +
                '</div>' +
                '</li>'
        })
    } else {
        h += '<li class="text-align:center;">暂无相关职位~</li>'
    }
    h += '<ul>'
    box.html(h);
}

function addon(dom) {
    dom.addClass('on').siblings().removeClass('on');
}

function keyword(dom, dom2, box, tp) {
    $(dom2).click(function(event) { //搜索
            event.stopPropagation();
            params.keyword = $(dom).val()
            switch (tp) {
                case '校招':
                    getJobList(params, box, '校招')
                    break;
                case "社招":
                    getJobList(params, box, '社招')
                    break;
                case "实习生":
                    getJobList(params, box, '实习生')
                    break;
            }
            // getJobList(params, box) //调用职位列表接口函数
        })
        //  改动
    $(dom).focus(function() { //关键字
        $(dom).val('');
    })
    $(dom).bind('keypress', function(event) { //关键字
        if (event.keyCode == "13") {
            params.keyword = $(dom).val()
            switch (tp) {
                case '校招':
                    getJobList(params, box, '校招')
                    break;
                case "社招":
                    getJobList(params, box, '社招')
                    break;
                case "实习生":
                    getJobList(params, box, '实习生')
                    break;
            }
            // getJobList(params, box) //调用职位列表接口函数
        }
    })
}
keyword('#keyword1', '.search-btn1', $('.zwlist1'), '校招');
keyword('#keyword2', '.search-btn2', $('.zwlist2'), '社招');
keyword('#keyword3', '.search-btn3', $('.zwlist3'), '实习生');

function search(area, divid, box, tp) {
    $(area).change(function(event) { //地点
        /* Act on the event */
        event.stopPropagation();
        params.jobarea = $(area).val();
        switch (tp) {
            case '校招':
                getJobList(params, box, '校招')
                break;
            case "社招":
                getJobList(params, box, '社招')
                break;
            case "实习生":
                getJobList(params, box, '实习生')
                break;
        }
    });
    $(divid).change(function(event) { //部门
        /* Act on the event */
        event.stopPropagation();
        params.coid = $(divid).val()
        switch (tp) {
            case '校招':
                getJobList(params, box, '校招')
                break;
            case "社招":
                getJobList(params, box, '社招')
                break;
            case "实习生":
                getJobList(params, box, '实习生')
                break;
        }
    });
}
search('#jobarea1', '#coid1', $('.zwlist1'), '校招')
search('#jobarea2', '#coid2', $('.zwlist2'), '社招');
search('#jobarea3', '#coid3', $('.zwlist3'), '实习生');
// $('#keyword1').focus(function() {    //关键字
//     $('#keyword1').val('');
// })
// $('#keyword1').bind('keypress', function(event) {    //关键字
//     if (event.keyCode == "13") {
//         params.keyword = $('#keyword1').val()

//         getJobList(params,box)  //调用职位列表接口函数
//     }
// })

$('.nav1>div').click(function() {
    addon($(this));
    var idx = $(this).index();
    $('.mainbox>.main').eq(idx).show(100).siblings().hide(100);
    // swp2.init();
})

$('.gsjj-tit').click(function() {
    // $('.gsjj-tit').removeClass('on')
    $(this).parents('.gsjjbox').toggleClass('on')
    $(this).next().slideToggle(200);
})

$('.functypebox1>div').click(function() {
    $(this).toggleClass('on');
})
$('.poscode1>div').click(function(event) {
    event.stopPropagation();
    $('.poscode1>div').removeClass('on')
    $(this).addClass('on')
    var poscode = $(this).parents().parents().attr('data-key') + $(this).attr('data-key2')
        // console.log(poscode);
    params.poscode = poscode;
    params.keyword = $('#keyword1').val();
    params.coid = $('#coid1').val();
    params.jobarea = $('#jobarea1').val();
    getJobList(params, $('.zwlist1'), '校招')
})
$(document).on('click','.functypebox2>div',function() {
    addon($(this));
    var coid = $(this).attr('data-coid');
    params.coid = coid;
    params.poscode = '';
    getJobList(params, $('.zwlist2'), '社招');
})
$('.functypebox3>div').click(function() {
    addon($(this));
    var coid = $(this).attr('data-coid');
    params.coid = coid;
    params.poscode = '';
    getJobList(params, $('.zwlist2'), '实习生');
})

$('.zwlist').on('click', '.name', function() {
    $(this).toggleClass('on');
})
$('.zwlist1').on('click', '.go', function(event) {
    event.stopPropagation();
    var jobid = $(this).attr('data-jobid');
    var ctmid = $(this).attr('data-ctmid');
    window.open('https://vip.51job.com/external/personal/personal_applyjob.aspx?ctmid=' + ctmid + '&jobid=' + jobid);
})
$('.zwlist2').on('click', '.go', function(event) {
    event.stopPropagation();
    var jobid = $(this).attr('data-jobid');
    window.open('https://jobs.51job.com/all/' + jobid + '.html');
    // jobApply(jobid);
})
$('.zwlist3').on('click', '.go', function(event) {
    event.stopPropagation();
    var jobid = $(this).attr('data-jobid');
    jobApply(jobid);
})