/**
 * 校招和实习生招聘
 */
$(document).ready(() => {

    // 社招id【企业id】
    let agencyId = getUrlParam('agencyId')

    if (!agencyId) return
    $('.CampusRecruitment').html(`<a href="./index4.html?agencyId=${agencyId}">校园招聘</a>`)
    $('.SocialRecruitment').html(`<a href="./index5.html?agencyId=${agencyId}">社会招聘</a>`)
    $('.TraineeRecruitment').html(`<a href="./index6.html?agencyId=${agencyId}">实习生招聘</a>`)
})

/** 获取地址栏参数 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}