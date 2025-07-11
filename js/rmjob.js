let jobarr=[
    {jobname: '项目经济师（定向新疆地区）', link: 'https://ideal.51job.com/scg/info.html?jobid=166248391', jobid: 166248391},
    {jobname: '财务专员（定向雄安地区）', link: 'https://ideal.51job.com/scg/info.html?jobid=166248317', jobid: 166248317},
    {jobname: '文历保技术负责人', link: 'https://ideal.51job.com/scg/info.html?jobid=166235578', jobid: 166235578},
    {jobname: '项目经理', link: 'https://ideal.51job.com/scg/info.html?jobid=166276683', jobid: 166276683},
    {jobname: '安全员', link: 'https://ideal.51job.com/scg/info.html?jobid=134399490', jobid: 166276638},
    {jobname: '经营经理（土木工程建筑类方向）', link: 'https://ideal.51job.com/scg/info.html?jobid=166350231', jobid: 166350230},
    {jobname: '注册水利造价工程师', link: 'https://ideal.51job.com/scg/info.html?jobid=166247272', jobid: 166247272},
    {jobname: '全国文保责任监理工程师', link: 'https://ideal.51job.com/scg/info.html?jobid=166247133', jobid: 166247133}
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
                          <a href="./job3.html?jobid=${item.jobid}">
                             <img src="./img/td1.png"/>
                           </a>
                        </div>
                    </div>
          `
          $('.jobbox').append(string);
});       