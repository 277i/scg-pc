let jobarr=[
    {jobid: 166248317, jobname: '财务专员（雄安新区）'},
    {jobid: 166276683, jobname: '项目经理（深圳市）'},
    {jobid: 166276638, jobname: '安全员（深圳市）'},
    {jobid: 166350232, jobname: '经营经理(海口市)'},
    {jobid: 166350231, jobname: '经营经理(三亚市)'},
    {jobid: 166350230, jobname: '经营经理(深圳市)'},
    {jobid: 166377253, jobname: '项目经济师(新疆地区）'},
    {jobid: 166246789, jobname: '经营经理(上海市)'},
    {jobid: 166235578, jobname: '文历保技术负责人(上海市)'},
    {jobid: 166247272, jobname: '注册水利造价工程师(上海市)'},
    {jobid: 166247133, jobname: '全国文保责任监理工程师(上海市)'}
]
$('.jobbox').html('');
jobarr.forEach(function(item) {
          let string= `
                    <div class="jobs">
                        <div class="job-l">
                            <img src="./img/dian.png" alt="" />
                            ${item.jobname}
                        </div>
                        <div class="job-r">
                       <a href="https://jobs.51job.com/all/${item.jobid}.html">
                             <img src="./img/td1.png"/>
                           </a>
                        </div>
                    </div>
          `
          $('.jobbox').append(string);
});       
//<a href="./job3.html?jobid=${item.jobid}"></a>