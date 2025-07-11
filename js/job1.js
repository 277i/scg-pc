var params = {
  ctmid: '4963893',
  poscode: 'A1',
  pagesize: 2000,
  coid: '',
}; //除去ctmid以外，如果无其他条件，则此参数为空或者不传都可以

// 初始化获取coid
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

//渲染单位下拉
function searchList(params) {
  //调用搜索器接口
  coapi.getJobCondition(params.ctmid, function (data) {
    //取到数据之后的操作
    data.resultbody.coid.sort(function (a, b) {
      return a.key - b.key;
    })

    //职能下拉框
    $.each(data.resultbody.jobarea, function () {
      $('#jobarea').append('<option value="' + this.key + '">' + this.value + '</option>')
    })

    params.workareaname = $('#jobarea').val();
    // getJobList(params);

    //公司介绍下拉框
    $.each(data.resultbody.coid, function () {
      $('#coid').append('<option value="' + this.key + '">' + this.value + '</option>')
    })
    params.coid = $('#coid').val();
    // getJobList(params);

    console.log('search complate');

  }, params);

}

searchList(params);

//渲染职位列表
function getJobList(params) {
  coapi.getJobList(params, function (data) {
    //取到数据之后的操作
    // console.log(params)
    console.log(data)
    var html = ' <tr class="t1"><th>职位名称</th><th>招聘单位</th><th>工作地点</th><th>发布时间</th><th>招聘人数</th></tr>';
    var arr = [];
    if (data.resultbody.joblist) {
      $.each(data.resultbody.joblist, function () {
        if (this.poscode == params.poscode) {
          html += '<tr data-id="' + this.jobid + '">'
          html += '<td>' + this.jobname + '</td>'
          html += '<td>' + this.coname + '</td>'
          html += '<td>' + this.jobareaname + '</td>'
          html += '<td>' + this.issuedate.split(' ')[0] + '</td>'
          html += '<td>' + this.jobnum + '</td>'
          html += '</tr>'
          arr.push(this);
        }
      })
      if (arr.length == 0) {
        html += '<tr><td  colspan="5">暂无相应职位信息</td></tr>'
      }
    } else {
      html += '<tr><td  colspan="5">暂无相应职位信息</td></tr>'
    }
    $('.job_list').html(html);
  });
}

if (GetQueryString('coid') != null) {

  params.coid = GetQueryString('coid');
  $('.job_c').show().siblings('.txt_c').hide();
  getJobList(params);
  setTimeout(function () {
    console.log($("#coid").find('option[value="' + GetQueryString('coid') + '"]'))
    $("#coid").find('option[value="' + GetQueryString('coid') + '"]').attr("selected", true);
  }, 500)

} else {

  getJobList(params);

}

//左边分类栏选项点击渲染具体数据
$('.nav_hide').on('click', 'div', function () {
  $('.job_c').show().siblings('.txt_c').hide();
  $(this).addClass('on').siblings().removeClass('on');
  params.poscode = $(this).data('class');
  $('#coid').val('');
  $('#jobarea').val('');
  $('#keywords').val('');
  params.coid = '';
  params.jobarea = '';
  params.keyword = '';
  getJobList(params);
})

//监听下拉事件
// 地点下拉
$('#jobarea').on('change', function (e) {
  e.stopPropagation();
  params.jobarea = $('#jobarea').val();
  getJobList(params);
})
//公司简介下拉
$('#coid').on('change', function (e) {
  e.stopPropagation();
  params.coid = $('#coid').val();
  getJobList(params);
})

//搜过按钮搜索
$('.search_btn').on('click', function (e) {
  e.stopPropagation();
  params.keyword = $('#keywords').val();
  getJobList(params);
})

//点击岗位进入详情页面
$('.job_list').on('click', 'tr', function () {
  params.jobid = $(this).data('id');
  window.location.href = 'detail.html?jobid=' + $(this).data('id');
})