var params = {
    ctmid: "4963893",
    pagesize: 2000,
    coid:'',
    // poscode: '',
    keyword:'',
    jobarea:''
}

$(".navBox div").click(function(){
    var index = $(this).index();
    if(index == 4){
        params.keyword = "社招";
        schoolData2();
    }else if(index == 5){
        params.keyword = "（实习）"; 
        schoolData2();
    }
});


// coapi.getJobList(params, function (data) {
//                 console.log(data,"2222");
// })

coapi.getJobCondition(params.ctmid,function(data){
    //取到数据之后的操作
    var coidOptHtml2= '';
    var arr = [];
    arr = data.resultbody.coid;

    function sortId(a,b){  
                return a.key-b.key  
             }
            arr.sort(sortId);

    $.each(arr, function () {
        coidOptHtml2 += '<div class="copyitem" data = "' + this.key + '">' + this.value + '</div>';
    });
    // $(".copylist").html(coidOptHtml2);
}, params);

//社会职位对应功能
schoolData2();

function schoolData2() {

    //默认职位渲染
    schoolApply2(params);

    function schoolApply2(params) {
        var html = '';
        coapi.getJobList(params, function (data) {

            if (data.resultbody.length != 0) {
                $.each(data.resultbody.joblist, function () {
                    html += '<div class="postItem">'
                    html += '<div class="postTitle">'
                    html += '<div class="postName">' + this.jobname + '</div>'
                    html += '<div class="postGo">'
                    html += '<a href="https://jobs.51job.com/all/' + this.jobid + '.html">立即申请</a>'
                    html += '</div>'
                    html += '</div>'
                    html += '<div class="postInfo">'
                    html += '<p class="postCity">工作地点:' + this.workareaname + '</p>'
                    html += '<p class="postCity">招聘单位:' + this.coname + '</p>'
                    html += '<p class="postCity">招聘人数:' + this.jobnum + '</p>'
                    html += '</div>'
                    html += '</div>'
                })
            } else {
                html += '<p style="text-align:center; margin-top:.5rem;">暂无职位</p>'
            }
            $('.xyshixi').html(html);
            //职位偶数行样式
            $('.xyshixi .postItem:odd').find('.postTitle').css('background', '#EEEEEF')
        });
    }

    //点击左侧导航栏对应渲染
    $(document).on('click',".copyitem",function () {
        $('.copyitem').removeClass('copyitemyes');
        $(this).addClass('copyitemyes');
        var typeId = $(this).attr('data');
        params.coid = typeId;
        params.poscode='';
        schoolApply2(params);
    });

    coapi.getJobCondition(params.ctmid, function (data) {
        //取到数据之后的操作
        // console.log(data)
        //工作单位下拉渲染
        var arr2=[];
        arr2 = data.resultbody.coid;
        console.log(arr2,"222222222")
        function sortId(a,b){  
            return a.key-b.key  
         }
        arr2.sort(sortId);
        var coidOptHtml = '<option value="">招聘单位</option>';
        $.each(arr2,function () {
            coidOptHtml += '<option value="' + this.key + '">' + this.value + '</option>';
        });
        $('.coid2').html(coidOptHtml);
        //招聘单位下拉对应数据筛选
        $('.coid2').on('change', function (e) {
            e.stopPropagation();
            params.coid = $('.coid2').val();
            schoolApply2(params);
        });

        //工作地点下拉渲染
        var cityOptHtml = '<option value="">工作地点</option>';
        $.each(data.resultbody.jobarea, function () {
            cityOptHtml += '<option value="' + this.key + '">' + this.value + '</option>';
        });
        $('.city2').html(cityOptHtml);
        //招聘单位下拉对应数据筛选
        $('.city2').on('change', function (e) {
            e.stopPropagation();
            params.jobarea = $('.city2').val();
            schoolApply2(params);
        })

    }, params);

    $('.keyClick2').on('click', function (e) {
        e.stopPropagation();
        params.keyword = $('.keySearch input').val();
        schoolApply2(params);
    })


}