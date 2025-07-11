/**
 * @author: xiangliang.zeng
 * @description:
 * @Date: 2017/1/4 11:38
 * @Last Modified by:   xiangliang.zeng
 */
(function(window, document) {
	var load51 = new Load51(true, onDomReady, onLoaded);
	// 类似Jquery的$(function(){});
	function onDomReady() {
		// musicSwitch();
		console.log('DOM is ready');
	}
	// 当loading页面关闭时执行的函数
	function onLoaded() {
		removeTouchMove();
		console.log('Loaded');
		init();
	}

	function init() {
		// 实例化swiper对象
		var mySwiper = new Swiper('#swp1', {
			//Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)
			direction: 'vertical',
			//将hashnav设置为true，并在每个slide处增加data-hash属性，可在当前页刷新。
			hashnav: true,
			on:{
				init: function(){
					swiperAnimateCache(this); //隐藏动画元素
					swiperAnimate(this); //初始化完成开始动画
					$('#swp1>.swiper-wrapper>.swiper-slide').scrollTop(0);
				}, 
				slideChangeTransitionEnd: function(){ 
					swiperAnimate(this); //每个slide切换结束时也运行当前slide动画
					$('#swp1>.swiper-wrapper>.swiper-slide').scrollTop(0);
				},
			},
		});
		var swp2 = new Swiper('#swp2', {
			watchSlidesProgress: true,
			slidesPerView: 'auto',
			centeredSlides: true,
			loop: true,
			loopedSlides: 5,
			autoplay: true,
			observer: true,
			observeSlideChildren: true,
			navigation: {
				// nextEl: '.swiper-button-next',
				// prevEl: '.swiper-button-prev',
			},
			pagination: {
				// el: '.swiper-pagination',
				//clickable :true,
			},
			on: {
				progress: function (progress) {
					for (i = 0; i < this.slides.length; i++) {
						var slide = this.slides.eq(i);
						var slideProgress = this.slides[i].progress;
						modify = 1;
						if (Math.abs(slideProgress) > 1) {
							modify = (Math.abs(slideProgress) - 1) * 0.3 + 1;
						}
						translate = slideProgress * modify * 1 + 'rem';
						scale = 1 - Math.abs(slideProgress) / 5;
						zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
						slide.transform('translateX(' + translate + ') scale(' + scale + ')');
						slide.css('zIndex', zIndex);
						slide.css('opacity', 1);
						if (Math.abs(slideProgress) > 2) {
							slide.css('opacity', 0);
						}
					}
				},
				setTransition: function (transition) {
					for (var i = 0; i < this.slides.length; i++) {
						var slide = this.slides.eq(i)
						slide.transition(transition);
					}

				}
			}

		})

	
		// 引导页的enter键点击划入第二页
		$('#s1 .enter img').on('click', function(event) {
			mySwiper.slideTo(1, 1000, true);
		});

		// 需要局部滚动的页面，阻止事件冒泡 -- 阻止swiper滑动
		$('.info').on('touchmove',function(){
				event.stopPropagation();
		});

		/***************************************** 地图 ***************************************************/
		//添加公司地址位置，修改公司地址方法如下：
		// http://api.map.baidu.com/lbsapi/creatmap/index.html，该地址是百度地图生成器，
		//打开网址后，将公司地址输入，获取到横纵坐标，请“coord=25.015643,102.753885”替换为获取到的横纵坐标，title替换为公司名称
		// $('.map').click(function() {
		//     location.href = 'http://api.map.baidu.com/marker?location=31.184249,121.416137&title=延锋伟世通电子科技（上海）有限公司&content=徐汇区钦州北路1001号&output=html';
		// });

		$(".job p").click(function () {
			var dsn=$(this).next("div").css("display");
			if (dsn=="none"){
                $(this).next("div").slideDown();
			} else {
                $(this).next("div").slideUp();
			}
        })


	}


	// 音乐切换
	function musicSwitch() {
		var mediaWrap = document.querySelector('.media-wrap');
		var audio = document.querySelector('#autoplay');
		var musicOn = document.querySelector('.music_on');
		var musicOff = document.querySelector('.music_off');
		audio.play();
		document.addEventListener("WeixinJSBridgeReady", function() {
			audio.play();
		}, false);
		mediaWrap.addEventListener('click', function() {
			if (audio.paused) {
				audio.play();
				mediaWrap.classList.add('on');
				musicOn.style.display = 'block';
				musicOff.style.display = 'none';
			} else {
				audio.pause();
				mediaWrap.classList.remove('on');
				musicOn.style.display = 'none';
				musicOff.style.display = 'block';
			}
		}, false);
		$('#autoplay').on('ended', function() {
			this.load();
			this.play();
		})
	}

	// 移除默认事件及阻止冒泡
	function removeDefaultEvt(e) {
		e.preventDefault();
	}
	// 移除默认document的touchmove，针对苹果手机
	function removeTouchMove() {
		document.body.addEventListener('touchmove', removeDefaultEvt, false);
	}
})(window, document);
