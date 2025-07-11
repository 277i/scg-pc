/**
 * Timer 通用高效定时器
 * 兼容FF，Chrome，Safari，IE9及以上浏览器
 * qizi 2016-8-1
 */
/**
 * 曾祥良修改
 * 兼容FF，Chrome，Safari，IE5及以上浏览器
 * 可以通过---param---给回调方法callbackfun传入的参数
 * @param  这里传入window参数使插件更加高效
 */
(function(window) {
	/*兼容处理requestAnimationFrame*/
	var lastTime = 0;
	var vendors = ['webkit', 'moz'];
	for (var x = 0, length = vendors.length; x < length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] +
			'CancelRequestAnimationFrame'];
	}
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
})(window);

/**
 * Timer
 * @param  dis 时间间隔
 * @param  loop 循环次数，如果为0则无限循环
 * @param  callbackfun 回调方法
 * @param  param 给回调方法callbackfun传入的参数
 */
;
(function(w) {
	/*定义Timer*/
	function Timer(dis, loop, callbackfun, param) {
		this.dis = dis || 0;
		this.loop = loop || 0;
		this.count = 0;
		this.callbackfun = callbackfun || null;
		this.tid = null;
		this.pretime = 0;
		this.ispause = false;
		this.param = param || null;
	}

	Timer.prototype.start = function() {
		if (this.callbackfun == null) {
			this.errors("回调函数不能为空");
			return;
		} else if (this.loop < 0 || this.dis < 0) {
			this.errors("请输入正确数值");
			return;
		}
		this.pretime = (new Date()).getTime();
		this.ispause = false;
		this.processing();
	}
	Timer.prototype.processing = function() {
		//console.log("test");
		var _self = this;
		if (this.loop > 0 && this.count == this.loop) {
			this.stop();
			return;
		}
		if (this.ispause == true) {
			return;
		}
		if (this.dis > 16.7) {
			var nowtime = (new Date()).getTime();
			if (nowtime - this.pretime > this.dis) {
				this.count++;
				this.callbackfun(this.count, this.param);
				this.pretime = nowtime;
			}
		} else {
			this.count++;
			this.callbackfun(this.count, this.param);
		}
		this.tid = window.requestAnimationFrame(function() {
			_self.processing();
		});
	}
	Timer.prototype.stop = function() {
		if (this.tid != null) {
			this.ispause = true;
			window.cancelAnimationFrame(this.tid);
			this.count = 0;
			this.tid = null;
		}
	}
	Timer.prototype.pause = function() {
		if (this.tid != null) {
			this.ispause = true;
			window.cancelAnimationFrame(this.tid);
			this.tid = null;
		}
	}
	Timer.prototype.errors = function(msg) {
		throw new Error(msg);
	}

	w.Timer = Timer;

})(typeof window !== "undefined" ? window : this);


/**
 * @author: xiangliang.zeng
 * @description:
 * @Date: 2017/2/13 15:52
 * @Last Modified by:   xiangliang.zeng
 * @Last Modified time: 2017/3/2 15:52
 */

/*
 * isAutoLoad:是否自动加载，即自动绑定DOMContentLoaded和load事件。
 * ①如果isAutoLoad为false,则必须手动调用：onReadyStart及onComplete函数，适用与你不想在window的'load'事件中消失loading动画。而是
 * 在js中动态加载的元素（比如obj模型或者其他图片）都加载完成时调用。
 * ②如果isAutoLoad为undefined,则默认为true.
 * ③需要注意的是，如果isAutoLoad填0、-0、null、""、false 或者 NaN则视为false.
 *
 * 公共方法：onReadyStart及onComplete。
 * onReadyStart：如果isAutoLoad为false时必须手动调用，一般情况是在document.ready里面调用，参数是函数。
 * 如果构造函数中有readyCb时，且isAutoLoad为true.则onReadyStart中的callback会覆盖readyCb
 *
 * onComplete：如果isAutoLoad为false时必须手动调用，否则会一直停留在82%的状态。即可以在任何需要的时候调用。不一定要在window.onload里面调用。
 *
 * stop: 这个仅仅是暂停加载动画效果的，一般不需要。
 * start: 这个仅仅是开启加载动画效果的，一般不需要。
 *
 * 如果isAutoLoad为true，或者不填，则会自动loading,可以传入对应的readyCallback及completeCallback供回调使用。
 * 如果参数后面有回调函数参数，则isAutoLoad参数**不可省略。
 *
 * completeCallback中可以执行一些比如H5添加首屏类名以添加动画之类的代码。不要自己监听window.addEventListener('load')事件
 * 会导致动画时机不对。
 *
 *  Example：
 *  function f1(){
 *      console.log(f1);
 *  }
 *  function f2() {
 *      console.log(f2);
 *  }
 *  function f3() {
 *      console.log(f3);
 *  }
 *  function f4() {
 *      console.log(f4);
 *  }
 *  var load1 = new Load51(true,f1,f2);    // 自动执行回调，并绑定DOMContentLoaded和load事件
 *
 *  var load2 = new Load51(false);    // 手动调用,
 *  load2.onReadyStart(f3);   // 可以在需要的时候调用
 *  load2.onComplete(f4);   // 可以在需要的时候调用
 *
 *  .....
 * */
var Load51 = function(isAutoLoad, readyCb, completeCb) {
	this.Version = "Load51_v3.0";
	this._isAutoLoad = isAutoLoad === undefined ? true : isAutoLoad;
	this._isReady = false;
	this._isLoaded = false;
	this._num = 0;
	this._targetNum = 0.82;
	this._progressTime = null;
	this._loading = document.querySelector('.loading');
	// this._progress = document.querySelector('.progress');
	this._progress = $('.progress')
	this._progressNum = document.querySelector('.progress-num');


	this._readyCb = readyCb || null; //ready回调
	this._completeCb = completeCb || null; // load回调

	this._onDomReady = this._readyHandler.bind(this);
	this._onWindowLoad = this._loadHandler.bind(this);

	this.init();
};
Load51.prototype = {
	constructor: 'Load51',
	init: function() {
		if (this._isAutoLoad) {
			this._addReadyEvent();
			this._addLoadEvent();
		}
		this._changeView();
	},
	_ready: function() {
		if (this._num <= this._targetNum) {
			this._num += 0.01;
			// this._progress.style.webkitTransform = 'scaleX(' + this._num + ')';
			this._progress.width(this._num * 100);
			this._progressNum.innerHTML = Math.round(this._num * 100) + '%';
		}
	},
	_load: function() {
		this._num += 0.05;
		if (this._num >= 1) {
			this._removeReadyEvent();
			this._removeLoadEvent();
			this._removeTimer(this._progressTime);
			this._loading.style.display = 'none';
			typeof this._completeCb === 'function' && this._completeCb();
		}
		// this._progress.style.webkitTransform = 'scaleX(' + (this._num > 1 ? 1 : this._num) + ')';
		this._progress.width((this._num > 1 ? 100 : this._num * 100) + '%');
		this._progressNum.innerHTML = (Math.round(this._num * 100) > 100 ? 100 : Math.round(this._num * 100)) + '%';
	},
	onReadyStart: function(callback) {
		this._readyCb = callback ? callback : this._readyCb;
		if (!this._isAutoLoad) {
			this._readyHandler();
		} else if (this._isReady) {
			console.warn(
				'DOMContentLoaded has already done it,if you need to manually call, please set the isAutoLoad to false');
		}
	},
	onComplete: function(callback) {
		this._completeCb = callback ? callback : this._completeCb;
		if (!this._isAutoLoad) {
			this._loadHandler();
		} else if (this._isLoaded) {
			console.warn('The load event has been executed,if you need to manually call, please set the isAutoLoad to false');
		}
	},
	_readyHandler: function() {
		this._isReady = true;
		typeof this._readyCb === 'function' && this._readyCb();
	},
	_loadHandler: function() {
		this._isLoaded = true;
	},
	_changeView: function() {
		var self = this;
		this._progressTime = new Timer(100, 0, function() {
			if (self._isLoaded) {
				self._load();
			} else if (self._isReady) {
				self._ready();
			}
		});
		this._progressTime.start();
	},
	_removeTimer: function(timer) {
		timer.stop();
		timer = null;
	},
	_addReadyEvent: function() {
		document.addEventListener('DOMContentLoaded', this._onDomReady, false);
	},
	_addLoadEvent: function() {
		window.addEventListener('load', this._onWindowLoad, false);
	},
	_removeReadyEvent: function() {
		document.removeEventListener('DOMContentLoaded', this._onDomReady, false);
	},
	_removeLoadEvent: function() {
		window.removeEventListener('load', this._onWindowLoad, false);
	},
	pause: function() {
		this._progressTime.pause();
	},
	start: function() {
		this._progressTime.start();
	}
};

/**
 * Swiper 5.2.0
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * http://swiperjs.com
 *
 * Copyright 2014-2019 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: October 26, 2019
 */

! function(e, t) {
	"object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define &&
		define.amd ? define(t) : (e = e || self).Swiper = t()
}(this, (function() {
	"use strict";
	var e = "undefined" == typeof document ? {
			body: {},
			addEventListener: function() {},
			removeEventListener: function() {},
			activeElement: {
				blur: function() {},
				nodeName: ""
			},
			querySelector: function() {
				return null
			},
			querySelectorAll: function() {
				return []
			},
			getElementById: function() {
				return null
			},
			createEvent: function() {
				return {
					initEvent: function() {}
				}
			},
			createElement: function() {
				return {
					children: [],
					childNodes: [],
					style: {},
					setAttribute: function() {},
					getElementsByTagName: function() {
						return []
					}
				}
			},
			location: {
				hash: ""
			}
		} : document,
		t = "undefined" == typeof window ? {
			document: e,
			navigator: {
				userAgent: ""
			},
			location: {},
			history: {},
			CustomEvent: function() {
				return this
			},
			addEventListener: function() {},
			removeEventListener: function() {},
			getComputedStyle: function() {
				return {
					getPropertyValue: function() {
						return ""
					}
				}
			},
			Image: function() {},
			Date: function() {},
			screen: {},
			setTimeout: function() {},
			clearTimeout: function() {}
		} : window,
		i = function(e) {
			for (var t = 0; t < e.length; t += 1) this[t] = e[t];
			return this.length = e.length, this
		};

	function s(s, a) {
		var r = [],
			n = 0;
		if (s && !a && s instanceof i) return s;
		if (s)
			if ("string" == typeof s) {
				var o, l, d = s.trim();
				if (d.indexOf("<") >= 0 && d.indexOf(">") >= 0) {
					var h = "div";
					for (0 === d.indexOf("<li") && (h = "ul"), 0 === d.indexOf("<tr") && (h = "tbody"), 0 !== d.indexOf("<td") && 0 !==
						d.indexOf("<th") || (h = "tr"), 0 === d.indexOf("<tbody") && (h = "table"), 0 === d.indexOf("<option") && (h =
							"select"), (l = e.createElement(h)).innerHTML = d, n = 0; n < l.childNodes.length; n += 1) r.push(l.childNodes[
						n])
				} else
					for (o = a || "#" !== s[0] || s.match(/[ .<>:~]/) ? (a || e).querySelectorAll(s.trim()) : [e.getElementById(s.trim()
							.split("#")[1])], n = 0; n < o.length; n += 1) o[n] && r.push(o[n])
			} else if (s.nodeType || s === t || s === e) r.push(s);
		else if (s.length > 0 && s[0].nodeType)
			for (n = 0; n < s.length; n += 1) r.push(s[n]);
		return new i(r)
	}

	function a(e) {
		for (var t = [], i = 0; i < e.length; i += 1) - 1 === t.indexOf(e[i]) && t.push(e[i]);
		return t
	}
	s.fn = i.prototype, s.Class = i, s.Dom7 = i;
	var r = {
		addClass: function(e) {
			if (void 0 === e) return this;
			for (var t = e.split(" "), i = 0; i < t.length; i += 1)
				for (var s = 0; s < this.length; s += 1) void 0 !== this[s] && void 0 !== this[s].classList && this[s].classList
					.add(t[i]);
			return this
		},
		removeClass: function(e) {
			for (var t = e.split(" "), i = 0; i < t.length; i += 1)
				for (var s = 0; s < this.length; s += 1) void 0 !== this[s] && void 0 !== this[s].classList && this[s].classList
					.remove(t[i]);
			return this
		},
		hasClass: function(e) {
			return !!this[0] && this[0].classList.contains(e)
		},
		toggleClass: function(e) {
			for (var t = e.split(" "), i = 0; i < t.length; i += 1)
				for (var s = 0; s < this.length; s += 1) void 0 !== this[s] && void 0 !== this[s].classList && this[s].classList
					.toggle(t[i]);
			return this
		},
		attr: function(e, t) {
			var i = arguments;
			if (1 === arguments.length && "string" == typeof e) return this[0] ? this[0].getAttribute(e) : void 0;
			for (var s = 0; s < this.length; s += 1)
				if (2 === i.length) this[s].setAttribute(e, t);
				else
					for (var a in e) this[s][a] = e[a], this[s].setAttribute(a, e[a]);
			return this
		},
		removeAttr: function(e) {
			for (var t = 0; t < this.length; t += 1) this[t].removeAttribute(e);
			return this
		},
		data: function(e, t) {
			var i;
			if (void 0 !== t) {
				for (var s = 0; s < this.length; s += 1)(i = this[s]).dom7ElementDataStorage || (i.dom7ElementDataStorage = {}),
					i.dom7ElementDataStorage[e] = t;
				return this
			}
			if (i = this[0]) {
				if (i.dom7ElementDataStorage && e in i.dom7ElementDataStorage) return i.dom7ElementDataStorage[e];
				var a = i.getAttribute("data-" + e);
				return a || void 0
			}
		},
		transform: function(e) {
			for (var t = 0; t < this.length; t += 1) {
				var i = this[t].style;
				i.webkitTransform = e, i.transform = e
			}
			return this
		},
		transition: function(e) {
			"string" != typeof e && (e += "ms");
			for (var t = 0; t < this.length; t += 1) {
				var i = this[t].style;
				i.webkitTransitionDuration = e, i.transitionDuration = e
			}
			return this
		},
		on: function() {
			for (var e, t = [], i = arguments.length; i--;) t[i] = arguments[i];
			var a = t[0],
				r = t[1],
				n = t[2],
				o = t[3];

			function l(e) {
				var t = e.target;
				if (t) {
					var i = e.target.dom7EventData || [];
					if (i.indexOf(e) < 0 && i.unshift(e), s(t).is(r)) n.apply(t, i);
					else
						for (var a = s(t).parents(), o = 0; o < a.length; o += 1) s(a[o]).is(r) && n.apply(a[o], i)
				}
			}

			function d(e) {
				var t = e && e.target && e.target.dom7EventData || [];
				t.indexOf(e) < 0 && t.unshift(e), n.apply(this, t)
			}
			"function" == typeof t[1] && (a = (e = t)[0], n = e[1], o = e[2], r = void 0), o || (o = !1);
			for (var h, p = a.split(" "), c = 0; c < this.length; c += 1) {
				var u = this[c];
				if (r)
					for (h = 0; h < p.length; h += 1) {
						var v = p[h];
						u.dom7LiveListeners || (u.dom7LiveListeners = {}), u.dom7LiveListeners[v] || (u.dom7LiveListeners[v] = []), u
							.dom7LiveListeners[v].push({
								listener: n,
								proxyListener: l
							}), u.addEventListener(v, l, o)
					} else
						for (h = 0; h < p.length; h += 1) {
							var f = p[h];
							u.dom7Listeners || (u.dom7Listeners = {}), u.dom7Listeners[f] || (u.dom7Listeners[f] = []), u.dom7Listeners[
								f].push({
								listener: n,
								proxyListener: d
							}), u.addEventListener(f, d, o)
						}
			}
			return this
		},
		off: function() {
			for (var e, t = [], i = arguments.length; i--;) t[i] = arguments[i];
			var s = t[0],
				a = t[1],
				r = t[2],
				n = t[3];
			"function" == typeof t[1] && (s = (e = t)[0], r = e[1], n = e[2], a = void 0), n || (n = !1);
			for (var o = s.split(" "), l = 0; l < o.length; l += 1)
				for (var d = o[l], h = 0; h < this.length; h += 1) {
					var p = this[h],
						c = void 0;
					if (!a && p.dom7Listeners ? c = p.dom7Listeners[d] : a && p.dom7LiveListeners && (c = p.dom7LiveListeners[d]),
						c && c.length)
						for (var u = c.length - 1; u >= 0; u -= 1) {
							var v = c[u];
							r && v.listener === r ? (p.removeEventListener(d, v.proxyListener, n), c.splice(u, 1)) : r && v.listener &&
								v.listener.dom7proxy && v.listener.dom7proxy === r ? (p.removeEventListener(d, v.proxyListener, n), c.splice(
									u, 1)) : r || (p.removeEventListener(d, v.proxyListener, n), c.splice(u, 1))
						}
				}
			return this
		},
		trigger: function() {
			for (var i = [], s = arguments.length; s--;) i[s] = arguments[s];
			for (var a = i[0].split(" "), r = i[1], n = 0; n < a.length; n += 1)
				for (var o = a[n], l = 0; l < this.length; l += 1) {
					var d = this[l],
						h = void 0;
					try {
						h = new t.CustomEvent(o, {
							detail: r,
							bubbles: !0,
							cancelable: !0
						})
					} catch (t) {
						(h = e.createEvent("Event")).initEvent(o, !0, !0), h.detail = r
					}
					d.dom7EventData = i.filter((function(e, t) {
						return t > 0
					})), d.dispatchEvent(h), d.dom7EventData = [], delete d.dom7EventData
				}
			return this
		},
		transitionEnd: function(e) {
			var t, i = ["webkitTransitionEnd", "transitionend"],
				s = this;

			function a(r) {
				if (r.target === this)
					for (e.call(this, r), t = 0; t < i.length; t += 1) s.off(i[t], a)
			}
			if (e)
				for (t = 0; t < i.length; t += 1) s.on(i[t], a);
			return this
		},
		outerWidth: function(e) {
			if (this.length > 0) {
				if (e) {
					var t = this.styles();
					return this[0].offsetWidth + parseFloat(t.getPropertyValue("margin-right")) + parseFloat(t.getPropertyValue(
						"margin-left"))
				}
				return this[0].offsetWidth
			}
			return null
		},
		outerHeight: function(e) {
			if (this.length > 0) {
				if (e) {
					var t = this.styles();
					return this[0].offsetHeight + parseFloat(t.getPropertyValue("margin-top")) + parseFloat(t.getPropertyValue(
						"margin-bottom"))
				}
				return this[0].offsetHeight
			}
			return null
		},
		offset: function() {
			if (this.length > 0) {
				var i = this[0],
					s = i.getBoundingClientRect(),
					a = e.body,
					r = i.clientTop || a.clientTop || 0,
					n = i.clientLeft || a.clientLeft || 0,
					o = i === t ? t.scrollY : i.scrollTop,
					l = i === t ? t.scrollX : i.scrollLeft;
				return {
					top: s.top + o - r,
					left: s.left + l - n
				}
			}
			return null
		},
		css: function(e, i) {
			var s;
			if (1 === arguments.length) {
				if ("string" != typeof e) {
					for (s = 0; s < this.length; s += 1)
						for (var a in e) this[s].style[a] = e[a];
					return this
				}
				if (this[0]) return t.getComputedStyle(this[0], null).getPropertyValue(e)
			}
			if (2 === arguments.length && "string" == typeof e) {
				for (s = 0; s < this.length; s += 1) this[s].style[e] = i;
				return this
			}
			return this
		},
		each: function(e) {
			if (!e) return this;
			for (var t = 0; t < this.length; t += 1)
				if (!1 === e.call(this[t], t, this[t])) return this;
			return this
		},
		html: function(e) {
			if (void 0 === e) return this[0] ? this[0].innerHTML : void 0;
			for (var t = 0; t < this.length; t += 1) this[t].innerHTML = e;
			return this
		},
		text: function(e) {
			if (void 0 === e) return this[0] ? this[0].textContent.trim() : null;
			for (var t = 0; t < this.length; t += 1) this[t].textContent = e;
			return this
		},
		is: function(a) {
			var r, n, o = this[0];
			if (!o || void 0 === a) return !1;
			if ("string" == typeof a) {
				if (o.matches) return o.matches(a);
				if (o.webkitMatchesSelector) return o.webkitMatchesSelector(a);
				if (o.msMatchesSelector) return o.msMatchesSelector(a);
				for (r = s(a), n = 0; n < r.length; n += 1)
					if (r[n] === o) return !0;
				return !1
			}
			if (a === e) return o === e;
			if (a === t) return o === t;
			if (a.nodeType || a instanceof i) {
				for (r = a.nodeType ? [a] : a, n = 0; n < r.length; n += 1)
					if (r[n] === o) return !0;
				return !1
			}
			return !1
		},
		index: function() {
			var e, t = this[0];
			if (t) {
				for (e = 0; null !== (t = t.previousSibling);) 1 === t.nodeType && (e += 1);
				return e
			}
		},
		eq: function(e) {
			if (void 0 === e) return this;
			var t, s = this.length;
			return new i(e > s - 1 ? [] : e < 0 ? (t = s + e) < 0 ? [] : [this[t]] : [this[e]])
		},
		append: function() {
			for (var t, s = [], a = arguments.length; a--;) s[a] = arguments[a];
			for (var r = 0; r < s.length; r += 1) {
				t = s[r];
				for (var n = 0; n < this.length; n += 1)
					if ("string" == typeof t) {
						var o = e.createElement("div");
						for (o.innerHTML = t; o.firstChild;) this[n].appendChild(o.firstChild)
					} else if (t instanceof i)
					for (var l = 0; l < t.length; l += 1) this[n].appendChild(t[l]);
				else this[n].appendChild(t)
			}
			return this
		},
		prepend: function(t) {
			var s, a;
			for (s = 0; s < this.length; s += 1)
				if ("string" == typeof t) {
					var r = e.createElement("div");
					for (r.innerHTML = t, a = r.childNodes.length - 1; a >= 0; a -= 1) this[s].insertBefore(r.childNodes[a], this[
						s].childNodes[0])
				} else if (t instanceof i)
				for (a = 0; a < t.length; a += 1) this[s].insertBefore(t[a], this[s].childNodes[0]);
			else this[s].insertBefore(t, this[s].childNodes[0]);
			return this
		},
		next: function(e) {
			return this.length > 0 ? e ? this[0].nextElementSibling && s(this[0].nextElementSibling).is(e) ? new i([this[0].nextElementSibling]) :
				new i([]) : this[0].nextElementSibling ? new i([this[0].nextElementSibling]) : new i([]) : new i([])
		},
		nextAll: function(e) {
			var t = [],
				a = this[0];
			if (!a) return new i([]);
			for (; a.nextElementSibling;) {
				var r = a.nextElementSibling;
				e ? s(r).is(e) && t.push(r) : t.push(r), a = r
			}
			return new i(t)
		},
		prev: function(e) {
			if (this.length > 0) {
				var t = this[0];
				return e ? t.previousElementSibling && s(t.previousElementSibling).is(e) ? new i([t.previousElementSibling]) :
					new i([]) : t.previousElementSibling ? new i([t.previousElementSibling]) : new i([])
			}
			return new i([])
		},
		prevAll: function(e) {
			var t = [],
				a = this[0];
			if (!a) return new i([]);
			for (; a.previousElementSibling;) {
				var r = a.previousElementSibling;
				e ? s(r).is(e) && t.push(r) : t.push(r), a = r
			}
			return new i(t)
		},
		parent: function(e) {
			for (var t = [], i = 0; i < this.length; i += 1) null !== this[i].parentNode && (e ? s(this[i].parentNode).is(e) &&
				t.push(this[i].parentNode) : t.push(this[i].parentNode));
			return s(a(t))
		},
		parents: function(e) {
			for (var t = [], i = 0; i < this.length; i += 1)
				for (var r = this[i].parentNode; r;) e ? s(r).is(e) && t.push(r) : t.push(r), r = r.parentNode;
			return s(a(t))
		},
		closest: function(e) {
			var t = this;
			return void 0 === e ? new i([]) : (t.is(e) || (t = t.parents(e).eq(0)), t)
		},
		find: function(e) {
			for (var t = [], s = 0; s < this.length; s += 1)
				for (var a = this[s].querySelectorAll(e), r = 0; r < a.length; r += 1) t.push(a[r]);
			return new i(t)
		},
		children: function(e) {
			for (var t = [], r = 0; r < this.length; r += 1)
				for (var n = this[r].childNodes, o = 0; o < n.length; o += 1) e ? 1 === n[o].nodeType && s(n[o]).is(e) && t.push(
					n[o]) : 1 === n[o].nodeType && t.push(n[o]);
			return new i(a(t))
		},
		filter: function(e) {
			for (var t = [], s = 0; s < this.length; s += 1) e.call(this[s], s, this[s]) && t.push(this[s]);
			return new i(t)
		},
		remove: function() {
			for (var e = 0; e < this.length; e += 1) this[e].parentNode && this[e].parentNode.removeChild(this[e]);
			return this
		},
		
		add: function() {
			for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
			var i, a;
			for (i = 0; i < e.length; i += 1) {
				var r = s(e[i]);
				for (a = 0; a < r.length; a += 1) this[this.length] = r[a], this.length += 1
			}
			return this
		},
		styles: function() {
			return this[0] ? t.getComputedStyle(this[0], null) : {}
		}
	};
	Object.keys(r).forEach((function(e) {
		s.fn[e] = s.fn[e] || r[e]
	}));
	var n = {
			deleteProps: function(e) {
				var t = e;
				Object.keys(t).forEach((function(e) {
					try {
						t[e] = null
					} catch (e) {}
					try {
						delete t[e]
					} catch (e) {}
				}))
			},
			nextTick: function(e, t) {
				return void 0 === t && (t = 0), setTimeout(e, t)
			},
			now: function() {
				return Date.now()
			},
			getTranslate: function(e, i) {
				var s, a, r;
				void 0 === i && (i = "x");
				var n = t.getComputedStyle(e, null);
				return t.WebKitCSSMatrix ? ((a = n.transform || n.webkitTransform).split(",").length > 6 && (a = a.split(", ").map(
					(function(e) {
						return e.replace(",", ".")
					})).join(", ")), r = new t.WebKitCSSMatrix("none" === a ? "" : a)) : s = (r = n.MozTransform || n.OTransform ||
					n.MsTransform || n.msTransform || n.transform || n.getPropertyValue("transform").replace("translate(",
						"matrix(1, 0, 0, 1,")).toString().split(","), "x" === i && (a = t.WebKitCSSMatrix ? r.m41 : 16 === s.length ?
					parseFloat(s[12]) : parseFloat(s[4])), "y" === i && (a = t.WebKitCSSMatrix ? r.m42 : 16 === s.length ?
					parseFloat(s[13]) : parseFloat(s[5])), a || 0
			},
			parseUrlQuery: function(e) {
				var i, s, a, r, n = {},
					o = e || t.location.href;
				if ("string" == typeof o && o.length)
					for (r = (s = (o = o.indexOf("?") > -1 ? o.replace(/\S*\?/, "") : "").split("&").filter((function(e) {
							return "" !== e
						}))).length, i = 0; i < r; i += 1) a = s[i].replace(/#\S+/g, "").split("="), n[decodeURIComponent(a[0])] =
						void 0 === a[1] ? void 0 : decodeURIComponent(a[1]) || "";
				return n
			},
			isObject: function(e) {
				return "object" == typeof e && null !== e && e.constructor && e.constructor === Object
			},
			extend: function() {
				for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
				for (var i = Object(e[0]), s = 1; s < e.length; s += 1) {
					var a = e[s];
					if (null != a)
						for (var r = Object.keys(Object(a)), o = 0, l = r.length; o < l; o += 1) {
							var d = r[o],
								h = Object.getOwnPropertyDescriptor(a, d);
							void 0 !== h && h.enumerable && (n.isObject(i[d]) && n.isObject(a[d]) ? n.extend(i[d], a[d]) : !n.isObject(i[
								d]) && n.isObject(a[d]) ? (i[d] = {}, n.extend(i[d], a[d])) : i[d] = a[d])
						}
				}
				return i
			}
		},
		o = {
			touch: t.Modernizr && !0 === t.Modernizr.touch || !!(t.navigator.maxTouchPoints > 0 || "ontouchstart" in t || t.DocumentTouch &&
				e instanceof t.DocumentTouch),
			pointerEvents: !!t.PointerEvent && "maxTouchPoints" in t.navigator && t.navigator.maxTouchPoints > 0,
			observer: "MutationObserver" in t || "WebkitMutationObserver" in t,
			passiveListener: function() {
				var e = !1;
				try {
					var i = Object.defineProperty({}, "passive", {
						get: function() {
							e = !0
						}
					});
					t.addEventListener("testPassiveListener", null, i)
				} catch (e) {}
				return e
			}(),
			gestures: "ongesturestart" in t
		},
		l = function(e) {
			void 0 === e && (e = {});
			var t = this;
			t.params = e, t.eventsListeners = {}, t.params && t.params.on && Object.keys(t.params.on).forEach((function(e) {
				t.on(e, t.params.on[e])
			}))
		},
		d = {
			components: {
				configurable: !0
			}
		};
	l.prototype.on = function(e, t, i) {
		var s = this;
		if ("function" != typeof t) return s;
		var a = i ? "unshift" : "push";
		return e.split(" ").forEach((function(e) {
			s.eventsListeners[e] || (s.eventsListeners[e] = []), s.eventsListeners[e][a](t)
		})), s
	}, l.prototype.once = function(e, t, i) {
		var s = this;
		if ("function" != typeof t) return s;

		function a() {
			for (var i = [], r = arguments.length; r--;) i[r] = arguments[r];
			t.apply(s, i), s.off(e, a), a.f7proxy && delete a.f7proxy
		}
		return a.f7proxy = t, s.on(e, a, i)
	}, l.prototype.off = function(e, t) {
		var i = this;
		return i.eventsListeners ? (e.split(" ").forEach((function(e) {
			void 0 === t ? i.eventsListeners[e] = [] : i.eventsListeners[e] && i.eventsListeners[e].length && i.eventsListeners[
				e].forEach((function(s, a) {
				(s === t || s.f7proxy && s.f7proxy === t) && i.eventsListeners[e].splice(a, 1)
			}))
		})), i) : i
	}, l.prototype.emit = function() {
		for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
		var i, s, a, r = this;
		if (!r.eventsListeners) return r;
		"string" == typeof e[0] || Array.isArray(e[0]) ? (i = e[0], s = e.slice(1, e.length), a = r) : (i = e[0].events, s =
			e[0].data, a = e[0].context || r);
		var n = Array.isArray(i) ? i : i.split(" ");
		return n.forEach((function(e) {
			if (r.eventsListeners && r.eventsListeners[e]) {
				var t = [];
				r.eventsListeners[e].forEach((function(e) {
					t.push(e)
				})), t.forEach((function(e) {
					e.apply(a, s)
				}))
			}
		})), r
	}, l.prototype.useModulesParams = function(e) {
		var t = this;
		t.modules && Object.keys(t.modules).forEach((function(i) {
			var s = t.modules[i];
			s.params && n.extend(e, s.params)
		}))
	}, l.prototype.useModules = function(e) {
		void 0 === e && (e = {});
		var t = this;
		t.modules && Object.keys(t.modules).forEach((function(i) {
			var s = t.modules[i],
				a = e[i] || {};
			s.instance && Object.keys(s.instance).forEach((function(e) {
				var i = s.instance[e];
				t[e] = "function" == typeof i ? i.bind(t) : i
			})), s.on && t.on && Object.keys(s.on).forEach((function(e) {
				t.on(e, s.on[e])
			})), s.create && s.create.bind(t)(a)
		}))
	}, d.components.set = function(e) {
		this.use && this.use(e)
	}, l.installModule = function(e) {
		for (var t = [], i = arguments.length - 1; i-- > 0;) t[i] = arguments[i + 1];
		var s = this;
		s.prototype.modules || (s.prototype.modules = {});
		var a = e.name || Object.keys(s.prototype.modules).length + "_" + n.now();
		return s.prototype.modules[a] = e, e.proto && Object.keys(e.proto).forEach((function(t) {
			s.prototype[t] = e.proto[t]
		})), e.static && Object.keys(e.static).forEach((function(t) {
			s[t] = e.static[t]
		})), e.install && e.install.apply(s, t), s
	}, l.use = function(e) {
		for (var t = [], i = arguments.length - 1; i-- > 0;) t[i] = arguments[i + 1];
		var s = this;
		return Array.isArray(e) ? (e.forEach((function(e) {
			return s.installModule(e)
		})), s) : s.installModule.apply(s, [e].concat(t))
	}, Object.defineProperties(l, d);
	var h = {
		updateSize: function() {
			var e, t, i = this.$el;
			e = void 0 !== this.params.width ? this.params.width : i[0].clientWidth, t = void 0 !== this.params.height ?
				this.params.height : i[0].clientHeight, 0 === e && this.isHorizontal() || 0 === t && this.isVertical() || (e =
					e - parseInt(i.css("padding-left"), 10) - parseInt(i.css("padding-right"), 10), t = t - parseInt(i.css(
						"padding-top"), 10) - parseInt(i.css("padding-bottom"), 10), n.extend(this, {
						width: e,
						height: t,
						size: this.isHorizontal() ? e : t
					}))
		},
		updateSlides: function() {
			var e = this.params,
				i = this.$wrapperEl,
				s = this.size,
				a = this.rtlTranslate,
				r = this.wrongRTL,
				o = this.virtual && e.virtual.enabled,
				l = o ? this.virtual.slides.length : this.slides.length,
				d = i.children("." + this.params.slideClass),
				h = o ? this.virtual.slides.length : d.length,
				p = [],
				c = [],
				u = [];

			function v(t) {
				return !e.cssMode || t !== d.length - 1
			}
			var f = e.slidesOffsetBefore;
			"function" == typeof f && (f = e.slidesOffsetBefore.call(this));
			var m = e.slidesOffsetAfter;
			"function" == typeof m && (m = e.slidesOffsetAfter.call(this));
			var g = this.snapGrid.length,
				b = this.snapGrid.length,
				w = e.spaceBetween,
				y = -f,
				x = 0,
				T = 0;
			if (void 0 !== s) {
				var E, C;
				"string" == typeof w && w.indexOf("%") >= 0 && (w = parseFloat(w.replace("%", "")) / 100 * s), this.virtualSize = -
					w, a ? d.css({
						marginLeft: "",
						marginTop: ""
					}) : d.css({
						marginRight: "",
						marginBottom: ""
					}), e.slidesPerColumn > 1 && (E = Math.floor(h / e.slidesPerColumn) === h / this.params.slidesPerColumn ? h :
						Math.ceil(h / e.slidesPerColumn) * e.slidesPerColumn, "auto" !== e.slidesPerView && "row" === e.slidesPerColumnFill &&
						(E = Math.max(E, e.slidesPerView * e.slidesPerColumn)));
				for (var S, M = e.slidesPerColumn, P = E / M, z = Math.floor(h / e.slidesPerColumn), k = 0; k < h; k += 1) {
					C = 0;
					var $ = d.eq(k);
					if (e.slidesPerColumn > 1) {
						var L = void 0,
							I = void 0,
							D = void 0;
						if ("row" === e.slidesPerColumnFill && e.slidesPerGroup > 1) {
							var O = Math.floor(k / (e.slidesPerGroup * e.slidesPerColumn)),
								A = k - e.slidesPerColumn * e.slidesPerGroup * O,
								G = 0 === O ? e.slidesPerGroup : Math.min(Math.ceil((h - O * M * e.slidesPerGroup) / M), e.slidesPerGroup);
							L = (I = A - (D = Math.floor(A / G)) * G + O * e.slidesPerGroup) + D * E / M, $.css({
								"-webkit-box-ordinal-group": L,
								"-moz-box-ordinal-group": L,
								"-ms-flex-order": L,
								"-webkit-order": L,
								order: L
							})
						} else "column" === e.slidesPerColumnFill ? (D = k - (I = Math.floor(k / M)) * M, (I > z || I === z && D ===
							M - 1) && (D += 1) >= M && (D = 0, I += 1)) : I = k - (D = Math.floor(k / P)) * P;
						$.css("margin-" + (this.isHorizontal() ? "top" : "left"), 0 !== D && e.spaceBetween && e.spaceBetween + "px")
					}
					if ("none" !== $.css("display")) {
						if ("auto" === e.slidesPerView) {
							var B = t.getComputedStyle($[0], null),
								H = $[0].style.transform,
								N = $[0].style.webkitTransform;
							if (H && ($[0].style.transform = "none"), N && ($[0].style.webkitTransform = "none"), e.roundLengths) C =
								this.isHorizontal() ? $.outerWidth(!0) : $.outerHeight(!0);
							else if (this.isHorizontal()) {
								var X = parseFloat(B.getPropertyValue("width")),
									V = parseFloat(B.getPropertyValue("padding-left")),
									Y = parseFloat(B.getPropertyValue("padding-right")),
									F = parseFloat(B.getPropertyValue("margin-left")),
									W = parseFloat(B.getPropertyValue("margin-right")),
									R = B.getPropertyValue("box-sizing");
								C = R && "border-box" === R ? X + F + W : X + V + Y + F + W
							} else {
								var q = parseFloat(B.getPropertyValue("height")),
									j = parseFloat(B.getPropertyValue("padding-top")),
									K = parseFloat(B.getPropertyValue("padding-bottom")),
									U = parseFloat(B.getPropertyValue("margin-top")),
									_ = parseFloat(B.getPropertyValue("margin-bottom")),
									Z = B.getPropertyValue("box-sizing");
								C = Z && "border-box" === Z ? q + U + _ : q + j + K + U + _
							}
							H && ($[0].style.transform = H), N && ($[0].style.webkitTransform = N), e.roundLengths && (C = Math.floor(C))
						} else C = (s - (e.slidesPerView - 1) * w) / e.slidesPerView, e.roundLengths && (C = Math.floor(C)), d[k] &&
							(this.isHorizontal() ? d[k].style.width = C + "px" : d[k].style.height = C + "px");
						d[k] && (d[k].swiperSlideSize = C), u.push(C), e.centeredSlides ? (y = y + C / 2 + x / 2 + w, 0 === x && 0 !==
								k && (y = y - s / 2 - w), 0 === k && (y = y - s / 2 - w), Math.abs(y) < .001 && (y = 0), e.roundLengths &&
								(y = Math.floor(y)), T % e.slidesPerGroup == 0 && p.push(y), c.push(y)) : (e.roundLengths && (y = Math.floor(
								y)), T % e.slidesPerGroup == 0 && p.push(y), c.push(y), y = y + C + w), this.virtualSize += C + w, x = C, T +=
							1
					}
				}
				if (this.virtualSize = Math.max(this.virtualSize, s) + m, a && r && ("slide" === e.effect || "coverflow" === e.effect) &&
					i.css({
						width: this.virtualSize + e.spaceBetween + "px"
					}), e.setWrapperSize && (this.isHorizontal() ? i.css({
						width: this.virtualSize + e.spaceBetween + "px"
					}) : i.css({
						height: this.virtualSize + e.spaceBetween + "px"
					})), e.slidesPerColumn > 1 && (this.virtualSize = (C + e.spaceBetween) * E, this.virtualSize = Math.ceil(this.virtualSize /
						e.slidesPerColumn) - e.spaceBetween, this.isHorizontal() ? i.css({
						width: this.virtualSize + e.spaceBetween + "px"
					}) : i.css({
						height: this.virtualSize + e.spaceBetween + "px"
					}), e.centeredSlides)) {
					S = [];
					for (var Q = 0; Q < p.length; Q += 1) {
						var J = p[Q];
						e.roundLengths && (J = Math.floor(J)), p[Q] < this.virtualSize + p[0] && S.push(J)
					}
					p = S
				}
				if (!e.centeredSlides) {
					S = [];
					for (var ee = 0; ee < p.length; ee += 1) {
						var te = p[ee];
						e.roundLengths && (te = Math.floor(te)), p[ee] <= this.virtualSize - s && S.push(te)
					}
					p = S, Math.floor(this.virtualSize - s) - Math.floor(p[p.length - 1]) > 1 && p.push(this.virtualSize - s)
				}
				if (0 === p.length && (p = [0]), 0 !== e.spaceBetween && (this.isHorizontal() ? a ? d.filter(v).css({
						marginLeft: w + "px"
					}) : d.filter(v).css({
						marginRight: w + "px"
					}) : d.filter(v).css({
						marginBottom: w + "px"
					})), e.centeredSlides && e.centeredSlidesBounds) {
					var ie = 0;
					u.forEach((function(t) {
						ie += t + (e.spaceBetween ? e.spaceBetween : 0)
					}));
					var se = (ie -= e.spaceBetween) - s;
					p = p.map((function(e) {
						return e < 0 ? -f : e > se ? se + m : e
					}))
				}
				if (e.centerInsufficientSlides) {
					var ae = 0;
					if (u.forEach((function(t) {
							ae += t + (e.spaceBetween ? e.spaceBetween : 0)
						})), (ae -= e.spaceBetween) < s) {
						var re = (s - ae) / 2;
						p.forEach((function(e, t) {
							p[t] = e - re
						})), c.forEach((function(e, t) {
							c[t] = e + re
						}))
					}
				}
				n.extend(this, {
					slides: d,
					snapGrid: p,
					slidesGrid: c,
					slidesSizesGrid: u
				}), h !== l && this.emit("slidesLengthChange"), p.length !== g && (this.params.watchOverflow && this.checkOverflow(),
					this.emit("snapGridLengthChange")), c.length !== b && this.emit("slidesGridLengthChange"), (e.watchSlidesProgress ||
					e.watchSlidesVisibility) && this.updateSlidesOffset()
			}
		},
		updateAutoHeight: function(e) {
			var t, i = [],
				s = 0;
			if ("number" == typeof e ? this.setTransition(e) : !0 === e && this.setTransition(this.params.speed), "auto" !==
				this.params.slidesPerView && this.params.slidesPerView > 1)
				for (t = 0; t < Math.ceil(this.params.slidesPerView); t += 1) {
					var a = this.activeIndex + t;
					if (a > this.slides.length) break;
					i.push(this.slides.eq(a)[0])
				} else i.push(this.slides.eq(this.activeIndex)[0]);
			for (t = 0; t < i.length; t += 1)
				if (void 0 !== i[t]) {
					var r = i[t].offsetHeight;
					s = r > s ? r : s
				} s && this.$wrapperEl.css("height", s + "px")
		},
		updateSlidesOffset: function() {
			for (var e = this.slides, t = 0; t < e.length; t += 1) e[t].swiperSlideOffset = this.isHorizontal() ? e[t].offsetLeft :
				e[t].offsetTop
		},
		updateSlidesProgress: function(e) {
			void 0 === e && (e = this && this.translate || 0);
			var t = this.params,
				i = this.slides,
				a = this.rtlTranslate;
			if (0 !== i.length) {
				void 0 === i[0].swiperSlideOffset && this.updateSlidesOffset();
				var r = -e;
				a && (r = e), i.removeClass(t.slideVisibleClass), this.visibleSlidesIndexes = [], this.visibleSlides = [];
				for (var n = 0; n < i.length; n += 1) {
					var o = i[n],
						l = (r + (t.centeredSlides ? this.minTranslate() : 0) - o.swiperSlideOffset) / (o.swiperSlideSize + t.spaceBetween);
					if (t.watchSlidesVisibility) {
						var d = -(r - o.swiperSlideOffset),
							h = d + this.slidesSizesGrid[n];
						(d >= 0 && d < this.size - 1 || h > 1 && h <= this.size || d <= 0 && h >= this.size) && (this.visibleSlides.push(
							o), this.visibleSlidesIndexes.push(n), i.eq(n).addClass(t.slideVisibleClass))
					}
					o.progress = a ? -l : l
				}
				this.visibleSlides = s(this.visibleSlides)
			}
		},
		updateProgress: function(e) {
			if (void 0 === e) {
				var t = this.rtlTranslate ? -1 : 1;
				e = this && this.translate && this.translate * t || 0
			}
			var i = this.params,
				s = this.maxTranslate() - this.minTranslate(),
				a = this.progress,
				r = this.isBeginning,
				o = this.isEnd,
				l = r,
				d = o;
			0 === s ? (a = 0, r = !0, o = !0) : (r = (a = (e - this.minTranslate()) / s) <= 0, o = a >= 1), n.extend(this, {
				progress: a,
				isBeginning: r,
				isEnd: o
			}), (i.watchSlidesProgress || i.watchSlidesVisibility) && this.updateSlidesProgress(e), r && !l && this.emit(
				"reachBeginning toEdge"), o && !d && this.emit("reachEnd toEdge"), (l && !r || d && !o) && this.emit(
				"fromEdge"), this.emit("progress", a)
		},
		updateSlidesClasses: function() {
			var e, t = this.slides,
				i = this.params,
				s = this.$wrapperEl,
				a = this.activeIndex,
				r = this.realIndex,
				n = this.virtual && i.virtual.enabled;
			t.removeClass(i.slideActiveClass + " " + i.slideNextClass + " " + i.slidePrevClass + " " + i.slideDuplicateActiveClass +
				" " + i.slideDuplicateNextClass + " " + i.slideDuplicatePrevClass), (e = n ? this.$wrapperEl.find("." + i.slideClass +
				'[data-swiper-slide-index="' + a + '"]') : t.eq(a)).addClass(i.slideActiveClass), i.loop && (e.hasClass(i.slideDuplicateClass) ?
				s.children("." + i.slideClass + ":not(." + i.slideDuplicateClass + ')[data-swiper-slide-index="' + r + '"]').addClass(
					i.slideDuplicateActiveClass) : s.children("." + i.slideClass + "." + i.slideDuplicateClass +
					'[data-swiper-slide-index="' + r + '"]').addClass(i.slideDuplicateActiveClass));
			var o = e.nextAll("." + i.slideClass).eq(0).addClass(i.slideNextClass);
			i.loop && 0 === o.length && (o = t.eq(0)).addClass(i.slideNextClass);
			var l = e.prevAll("." + i.slideClass).eq(0).addClass(i.slidePrevClass);
			i.loop && 0 === l.length && (l = t.eq(-1)).addClass(i.slidePrevClass), i.loop && (o.hasClass(i.slideDuplicateClass) ?
				s.children("." + i.slideClass + ":not(." + i.slideDuplicateClass + ')[data-swiper-slide-index="' + o.attr(
					"data-swiper-slide-index") + '"]').addClass(i.slideDuplicateNextClass) : s.children("." + i.slideClass + "." +
					i.slideDuplicateClass + '[data-swiper-slide-index="' + o.attr("data-swiper-slide-index") + '"]').addClass(i.slideDuplicateNextClass),
				l.hasClass(i.slideDuplicateClass) ? s.children("." + i.slideClass + ":not(." + i.slideDuplicateClass +
					')[data-swiper-slide-index="' + l.attr("data-swiper-slide-index") + '"]').addClass(i.slideDuplicatePrevClass) :
				s.children("." + i.slideClass + "." + i.slideDuplicateClass + '[data-swiper-slide-index="' + l.attr(
					"data-swiper-slide-index") + '"]').addClass(i.slideDuplicatePrevClass))
		},
		updateActiveIndex: function(e) {
			var t, i = this.rtlTranslate ? this.translate : -this.translate,
				s = this.slidesGrid,
				a = this.snapGrid,
				r = this.params,
				o = this.activeIndex,
				l = this.realIndex,
				d = this.snapIndex,
				h = e;
			if (void 0 === h) {
				for (var p = 0; p < s.length; p += 1) void 0 !== s[p + 1] ? i >= s[p] && i < s[p + 1] - (s[p + 1] - s[p]) / 2 ?
					h = p : i >= s[p] && i < s[p + 1] && (h = p + 1) : i >= s[p] && (h = p);
				r.normalizeSlideIndex && (h < 0 || void 0 === h) && (h = 0)
			}
			if ((t = a.indexOf(i) >= 0 ? a.indexOf(i) : Math.floor(h / r.slidesPerGroup)) >= a.length && (t = a.length - 1),
				h !== o) {
				var c = parseInt(this.slides.eq(h).attr("data-swiper-slide-index") || h, 10);
				n.extend(this, {
					snapIndex: t,
					realIndex: c,
					previousIndex: o,
					activeIndex: h
				}), this.emit("activeIndexChange"), this.emit("snapIndexChange"), l !== c && this.emit("realIndexChange"), (
					this.initialized || this.runCallbacksOnInit) && this.emit("slideChange")
			} else t !== d && (this.snapIndex = t, this.emit("snapIndexChange"))
		},
		updateClickedSlide: function(e) {
			var t = this.params,
				i = s(e.target).closest("." + t.slideClass)[0],
				a = !1;
			if (i)
				for (var r = 0; r < this.slides.length; r += 1) this.slides[r] === i && (a = !0);
			if (!i || !a) return this.clickedSlide = void 0, void(this.clickedIndex = void 0);
			this.clickedSlide = i, this.virtual && this.params.virtual.enabled ? this.clickedIndex = parseInt(s(i).attr(
					"data-swiper-slide-index"), 10) : this.clickedIndex = s(i).index(), t.slideToClickedSlide && void 0 !== this.clickedIndex &&
				this.clickedIndex !== this.activeIndex && this.slideToClickedSlide()
		},
		
	};
	var p = {
		getTranslate: function(e) {
			void 0 === e && (e = this.isHorizontal() ? "x" : "y");
			var t = this.params,
				i = this.rtlTranslate,
				s = this.translate,
				a = this.$wrapperEl;
			if (t.virtualTranslate) return i ? -s : s;
			if (t.cssMode) return s;
			var r = n.getTranslate(a[0], e);
			return i && (r = -r), r || 0
		},
		setTranslate: function(e, t) {
			var i = this.rtlTranslate,
				s = this.params,
				a = this.$wrapperEl,
				r = this.wrapperEl,
				n = this.progress,
				o = 0,
				l = 0;
			this.isHorizontal() ? o = i ? -e : e : l = e, s.roundLengths && (o = Math.floor(o), l = Math.floor(l)), s.cssMode ?
				r[this.isHorizontal() ? "scrollLeft" : "scrollTop"] = this.isHorizontal() ? -o : -l : s.virtualTranslate || a.transform(
					"translate3d(" + o + "px, " + l + "px, 0px)"), this.previousTranslate = this.translate, this.translate = this.isHorizontal() ?
				o : l;
			var d = this.maxTranslate() - this.minTranslate();
			(0 === d ? 0 : (e - this.minTranslate()) / d) !== n && this.updateProgress(e), this.emit("setTranslate", this.translate,
				t)
		},
		minTranslate: function() {
			return -this.snapGrid[0]
		},
		maxTranslate: function() {
			return -this.snapGrid[this.snapGrid.length - 1]
		},
		translateTo: function(e, t, i, s, a) {
			var r;
			void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === i && (i = !0), void 0 === s && (s = !
				0);
			var n = this,
				o = n.params,
				l = n.wrapperEl;
			if (n.animating && o.preventInteractionOnTransition) return !1;
			var d, h = n.minTranslate(),
				p = n.maxTranslate();
			if (d = s && e > h ? h : s && e < p ? p : e, n.updateProgress(d), o.cssMode) {
				var c = n.isHorizontal();
				return 0 === t ? l[c ? "scrollLeft" : "scrollTop"] = -d : l.scrollTo ? l.scrollTo(((r = {})[c ? "left" : "top"] = -
					d, r.behavior = "smooth", r)) : l[c ? "scrollLeft" : "scrollTop"] = -d, !0
			}
			return 0 === t ? (n.setTransition(0), n.setTranslate(d), i && (n.emit("beforeTransitionStart", t, a), n.emit(
				"transitionEnd"))) : (n.setTransition(t), n.setTranslate(d), i && (n.emit("beforeTransitionStart", t, a), n.emit(
				"transitionStart")), n.animating || (n.animating = !0, n.onTranslateToWrapperTransitionEnd || (n.onTranslateToWrapperTransitionEnd =
				function(e) {
					n && !n.destroyed && e.target === this && (n.$wrapperEl[0].removeEventListener("transitionend", n.onTranslateToWrapperTransitionEnd),
						n.$wrapperEl[0].removeEventListener("webkitTransitionEnd", n.onTranslateToWrapperTransitionEnd), n.onTranslateToWrapperTransitionEnd =
						null, delete n.onTranslateToWrapperTransitionEnd, i && n.emit("transitionEnd"))
				}), n.$wrapperEl[0].addEventListener("transitionend", n.onTranslateToWrapperTransitionEnd), n.$wrapperEl[0].addEventListener(
				"webkitTransitionEnd", n.onTranslateToWrapperTransitionEnd))), !0
		}
	};
	var c = {
		setTransition: function(e, t) {
			this.params.cssMode || this.$wrapperEl.transition(e), this.emit("setTransition", e, t)
		},
		transitionStart: function(e, t) {
			void 0 === e && (e = !0);
			var i = this.activeIndex,
				s = this.params,
				a = this.previousIndex;
			if (!s.cssMode) {
				s.autoHeight && this.updateAutoHeight();
				var r = t;
				if (r || (r = i > a ? "next" : i < a ? "prev" : "reset"), this.emit("transitionStart"), e && i !== a) {
					if ("reset" === r) return void this.emit("slideResetTransitionStart");
					this.emit("slideChangeTransitionStart"), "next" === r ? this.emit("slideNextTransitionStart") : this.emit(
						"slidePrevTransitionStart")
				}
			}
		},
		transitionEnd: function(e, t) {
			void 0 === e && (e = !0);
			var i = this.activeIndex,
				s = this.previousIndex,
				a = this.params;
			if (this.animating = !1, !a.cssMode) {
				this.setTransition(0);
				var r = t;
				if (r || (r = i > s ? "next" : i < s ? "prev" : "reset"), this.emit("transitionEnd"), e && i !== s) {
					if ("reset" === r) return void this.emit("slideResetTransitionEnd");
					this.emit("slideChangeTransitionEnd"), "next" === r ? this.emit("slideNextTransitionEnd") : this.emit(
						"slidePrevTransitionEnd")
				}
			}
		}
	};
	var u = {
		slideTo: function(e, t, i, s) {
			var a;
			void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === i && (i = !0);
			var r = this,
				n = e;
			n < 0 && (n = 0);
			var o = r.params,
				l = r.snapGrid,
				d = r.slidesGrid,
				h = r.previousIndex,
				p = r.activeIndex,
				c = r.rtlTranslate,
				u = r.wrapperEl;
			if (r.animating && o.preventInteractionOnTransition) return !1;
			var v = Math.floor(n / o.slidesPerGroup);
			v >= l.length && (v = l.length - 1), (p || o.initialSlide || 0) === (h || 0) && i && r.emit(
				"beforeSlideChangeStart");
			var f, m = -l[v];
			if (r.updateProgress(m), o.normalizeSlideIndex)
				for (var g = 0; g < d.length; g += 1) - Math.floor(100 * m) >= Math.floor(100 * d[g]) && (n = g);
			if (r.initialized && n !== p) {
				if (!r.allowSlideNext && m < r.translate && m < r.minTranslate()) return !1;
				if (!r.allowSlidePrev && m > r.translate && m > r.maxTranslate() && (p || 0) !== n) return !1
			}
			if (f = n > p ? "next" : n < p ? "prev" : "reset", c && -m === r.translate || !c && m === r.translate) return r.updateActiveIndex(
					n), o.autoHeight && r.updateAutoHeight(), r.updateSlidesClasses(), "slide" !== o.effect && r.setTranslate(m),
				"reset" !== f && (r.transitionStart(i, f), r.transitionEnd(i, f)), !1;
			if (o.cssMode) {
				var b = r.isHorizontal();
				return 0 === t ? u[b ? "scrollLeft" : "scrollTop"] = -m : u.scrollTo ? u.scrollTo(((a = {})[b ? "left" : "top"] = -
					m, a.behavior = "smooth", a)) : u[b ? "scrollLeft" : "scrollTop"] = -m, !0
			}
			return 0 === t ? (r.setTransition(0), r.setTranslate(m), r.updateActiveIndex(n), r.updateSlidesClasses(), r.emit(
				"beforeTransitionStart", t, s), r.transitionStart(i, f), r.transitionEnd(i, f)) : (r.setTransition(t), r.setTranslate(
				m), r.updateActiveIndex(n), r.updateSlidesClasses(), r.emit("beforeTransitionStart", t, s), r.transitionStart(
				i, f), r.animating || (r.animating = !0, r.onSlideToWrapperTransitionEnd || (r.onSlideToWrapperTransitionEnd =
				function(e) {
					r && !r.destroyed && e.target === this && (r.$wrapperEl[0].removeEventListener("transitionend", r.onSlideToWrapperTransitionEnd),
						r.$wrapperEl[0].removeEventListener("webkitTransitionEnd", r.onSlideToWrapperTransitionEnd), r.onSlideToWrapperTransitionEnd =
						null, delete r.onSlideToWrapperTransitionEnd, r.transitionEnd(i, f))
				}), r.$wrapperEl[0].addEventListener("transitionend", r.onSlideToWrapperTransitionEnd), r.$wrapperEl[0].addEventListener(
				"webkitTransitionEnd", r.onSlideToWrapperTransitionEnd))), !0
		},
		slideToLoop: function(e, t, i, s) {
			void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === i && (i = !0);
			var a = e;
			return this.params.loop && (a += this.loopedSlides), this.slideTo(a, t, i, s)
		},
		slideNext: function(e, t, i) {
			void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
			var s = this.params,
				a = this.animating;
			return s.loop ? !a && (this.loopFix(), this._clientLeft = this.$wrapperEl[0].clientLeft, this.slideTo(this.activeIndex +
				s.slidesPerGroup, e, t, i)) : this.slideTo(this.activeIndex + s.slidesPerGroup, e, t, i)
		},
		slidePrev: function(e, t, i) {
			void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
			var s = this.params,
				a = this.animating,
				r = this.snapGrid,
				n = this.slidesGrid,
				o = this.rtlTranslate;
			if (s.loop) {
				if (a) return !1;
				this.loopFix(), this._clientLeft = this.$wrapperEl[0].clientLeft
			}

			function l(e) {
				return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e)
			}
			var d, h = l(o ? this.translate : -this.translate),
				p = r.map((function(e) {
					return l(e)
				})),
				c = (n.map((function(e) {
					return l(e)
				})), r[p.indexOf(h)], r[p.indexOf(h) - 1]);
			return void 0 === c && s.cssMode && r.forEach((function(e) {
				!c && h >= e && (c = e)
			})), void 0 !== c && (d = n.indexOf(c)) < 0 && (d = this.activeIndex - 1), this.slideTo(d, e, t, i)
		},
		slideReset: function(e, t, i) {
			return void 0 === e && (e = this.params.speed), void 0 === t && (t = !0), this.slideTo(this.activeIndex, e, t, i)
		},
		slideToClosest: function(e, t, i, s) {
			void 0 === e && (e = this.params.speed), void 0 === t && (t = !0), void 0 === s && (s = .5);
			var a = this.activeIndex,
				r = Math.floor(a / this.params.slidesPerGroup),
				n = this.rtlTranslate ? this.translate : -this.translate;
			if (n >= this.snapGrid[r]) {
				var o = this.snapGrid[r];
				n - o > (this.snapGrid[r + 1] - o) * s && (a += this.params.slidesPerGroup)
			} else {
				var l = this.snapGrid[r - 1];
				n - l <= (this.snapGrid[r] - l) * s && (a -= this.params.slidesPerGroup)
			}
			return a = Math.max(a, 0), a = Math.min(a, this.snapGrid.length - 1), this.slideTo(a, e, t, i)
		},
		slideToClickedSlide: function() {
			var e, t = this,
				i = t.params,
				a = t.$wrapperEl,
				r = "auto" === i.slidesPerView ? t.slidesPerViewDynamic() : i.slidesPerView,
				o = t.clickedIndex;
			if (i.loop) {
				if (t.animating) return;
				e = parseInt(s(t.clickedSlide).attr("data-swiper-slide-index"), 10), i.centeredSlides ? o < t.loopedSlides - r /
					2 || o > t.slides.length - t.loopedSlides + r / 2 ? (t.loopFix(), o = a.children("." + i.slideClass +
						'[data-swiper-slide-index="' + e + '"]:not(.' + i.slideDuplicateClass + ")").eq(0).index(), n.nextTick((
						function() {
							t.slideTo(o)
						}))) : t.slideTo(o) : o > t.slides.length - r ? (t.loopFix(), o = a.children("." + i.slideClass +
						'[data-swiper-slide-index="' + e + '"]:not(.' + i.slideDuplicateClass + ")").eq(0).index(), n.nextTick((
						function() {
							t.slideTo(o)
						}))) : t.slideTo(o)
			} else t.slideTo(o)
		}
	};
	var v = {
		loopCreate: function() {
			var t = this,
				i = t.params,
				a = t.$wrapperEl;
			a.children("." + i.slideClass + "." + i.slideDuplicateClass).remove();
			var r = a.children("." + i.slideClass);
			if (i.loopFillGroupWithBlank) {
				var n = i.slidesPerGroup - r.length % i.slidesPerGroup;
				if (n !== i.slidesPerGroup) {
					for (var o = 0; o < n; o += 1) {
						var l = s(e.createElement("div")).addClass(i.slideClass + " " + i.slideBlankClass);
						a.append(l)
					}
					r = a.children("." + i.slideClass)
				}
			}
			"auto" !== i.slidesPerView || i.loopedSlides || (i.loopedSlides = r.length), t.loopedSlides = Math.ceil(
					parseFloat(i.loopedSlides || i.slidesPerView, 10)), t.loopedSlides += i.loopAdditionalSlides, t.loopedSlides >
				r.length && (t.loopedSlides = r.length);
			var d = [],
				h = [];
			r.each((function(e, i) {
				var a = s(i);
				e < t.loopedSlides && h.push(i), e < r.length && e >= r.length - t.loopedSlides && d.push(i), a.attr(
					"data-swiper-slide-index", e)
			}));
			for (var p = 0; p < h.length; p += 1) a.append(s(h[p].cloneNode(!0)).addClass(i.slideDuplicateClass));
			for (var c = d.length - 1; c >= 0; c -= 1) a.prepend(s(d[c].cloneNode(!0)).addClass(i.slideDuplicateClass))
		},
		loopFix: function() {
			var e, t = this.activeIndex,
				i = this.slides,
				s = this.loopedSlides,
				a = this.allowSlidePrev,
				r = this.allowSlideNext,
				n = this.snapGrid,
				o = this.rtlTranslate;
			this.allowSlidePrev = !0, this.allowSlideNext = !0;
			var l = -n[t] - this.getTranslate();
			if (t < s) e = i.length - 3 * s + t, e += s, this.slideTo(e, 0, !1, !0) && 0 !== l && this.setTranslate((o ? -
				this.translate : this.translate) - l);
			else if (t >= i.length - s) {
				e = -i.length + t + s, e += s, this.slideTo(e, 0, !1, !0) && 0 !== l && this.setTranslate((o ? -this.translate :
					this.translate) - l)
			}
			this.allowSlidePrev = a, this.allowSlideNext = r
		},
		loopDestroy: function() {
			var e = this.$wrapperEl,
				t = this.params,
				i = this.slides;
			e.children("." + t.slideClass + "." + t.slideDuplicateClass + ",." + t.slideClass + "." + t.slideBlankClass).remove(),
				i.removeAttr("data-swiper-slide-index")
		}
	};
	var f = {
		setGrabCursor: function(e) {
			if (!(o.touch || !this.params.simulateTouch || this.params.watchOverflow && this.isLocked || this.params.cssMode)) {
				var t = this.el;
				t.style.cursor = "move", t.style.cursor = e ? "-webkit-grabbing" : "-webkit-grab", t.style.cursor = e ?
					"-moz-grabbin" : "-moz-grab", t.style.cursor = e ? "grabbing" : "grab"
			}
		},
		unsetGrabCursor: function() {
			o.touch || this.params.watchOverflow && this.isLocked || this.params.cssMode || (this.el.style.cursor = "")
		}
	};
	var m, g, b, w, y, x, T, E, C, S, M, P, z, k, $, L = {
			appendSlide: function(e) {
				var t = this.$wrapperEl,
					i = this.params;
				if (i.loop && this.loopDestroy(), "object" == typeof e && "length" in e)
					for (var s = 0; s < e.length; s += 1) e[s] && t.append(e[s]);
				else t.append(e);
				i.loop && this.loopCreate(), i.observer && o.observer || this.update()
			},
			prependSlide: function(e) {
				var t = this.params,
					i = this.$wrapperEl,
					s = this.activeIndex;
				t.loop && this.loopDestroy();
				var a = s + 1;
				if ("object" == typeof e && "length" in e) {
					for (var r = 0; r < e.length; r += 1) e[r] && i.prepend(e[r]);
					a = s + e.length
				} else i.prepend(e);
				t.loop && this.loopCreate(), t.observer && o.observer || this.update(), this.slideTo(a, 0, !1)
			},
			addSlide: function(e, t) {
				var i = this.$wrapperEl,
					s = this.params,
					a = this.activeIndex;
				s.loop && (a -= this.loopedSlides, this.loopDestroy(), this.slides = i.children("." + s.slideClass));
				var r = this.slides.length;
				if (e <= 0) this.prependSlide(t);
				else if (e >= r) this.appendSlide(t);
				else {
					for (var n = a > e ? a + 1 : a, l = [], d = r - 1; d >= e; d -= 1) {
						var h = this.slides.eq(d);
						h.remove(), l.unshift(h)
					}
					if ("object" == typeof t && "length" in t) {
						for (var p = 0; p < t.length; p += 1) t[p] && i.append(t[p]);
						n = a > e ? a + t.length : a
					} else i.append(t);
					for (var c = 0; c < l.length; c += 1) i.append(l[c]);
					s.loop && this.loopCreate(), s.observer && o.observer || this.update(), s.loop ? this.slideTo(n + this.loopedSlides,
						0, !1) : this.slideTo(n, 0, !1)
				}
			},
			removeSlide: function(e) {
				var t = this.params,
					i = this.$wrapperEl,
					s = this.activeIndex;
				t.loop && (s -= this.loopedSlides, this.loopDestroy(), this.slides = i.children("." + t.slideClass));
				var a, r = s;
				if ("object" == typeof e && "length" in e) {
					for (var n = 0; n < e.length; n += 1) a = e[n], this.slides[a] && this.slides.eq(a).remove(), a < r && (r -= 1);
					r = Math.max(r, 0)
				} else a = e, this.slides[a] && this.slides.eq(a).remove(), a < r && (r -= 1), r = Math.max(r, 0);
				t.loop && this.loopCreate(), t.observer && o.observer || this.update(), t.loop ? this.slideTo(r + this.loopedSlides,
					0, !1) : this.slideTo(r, 0, !1)
			},
			removeAllSlides: function() {
				for (var e = [], t = 0; t < this.slides.length; t += 1) e.push(t);
				this.removeSlide(e)
			}
		},
		I = (m = t.navigator.platform, g = t.navigator.userAgent, b = {
				ios: !1,
				android: !1,
				androidChrome: !1,
				desktop: !1,
				iphone: !1,
				ipod: !1,
				ipad: !1,
				edge: !1,
				ie: !1,
				firefox: !1,
				macos: !1,
				windows: !1,
				cordova: !(!t.cordova && !t.phonegap),
				phonegap: !(!t.cordova && !t.phonegap),
				electron: !1
			}, w = t.screen.width, y = t.screen.height, x = g.match(/(Android);?[\s\/]+([\d.]+)?/), T = g.match(
				/(iPad).*OS\s([\d_]+)/), E = g.match(/(iPod)(.*OS\s([\d_]+))?/), C = !T && g.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
			S = g.indexOf("MSIE ") >= 0 || g.indexOf("Trident/") >= 0, M = g.indexOf("Edge/") >= 0, P = g.indexOf("Gecko/") >=
			0 && g.indexOf("Firefox/") >= 0, z = "Win32" === m, k = g.toLowerCase().indexOf("electron") >= 0, $ = "MacIntel" ===
			m, !T && $ && o.touch && (1024 === w && 1366 === y || 834 === w && 1194 === y || 834 === w && 1112 === y || 768 ===
				w && 1024 === y) && (T = g.match(/(Version)\/([\d.]+)/), $ = !1), b.ie = S, b.edge = M, b.firefox = P, x && !z &&
			(b.os = "android", b.osVersion = x[2], b.android = !0, b.androidChrome = g.toLowerCase().indexOf("chrome") >= 0),
			(T || C || E) && (b.os = "ios", b.ios = !0), C && !E && (b.osVersion = C[2].replace(/_/g, "."), b.iphone = !0), T &&
			(b.osVersion = T[2].replace(/_/g, "."), b.ipad = !0), E && (b.osVersion = E[3] ? E[3].replace(/_/g, ".") : null, b
				.ipod = !0), b.ios && b.osVersion && g.indexOf("Version/") >= 0 && "10" === b.osVersion.split(".")[0] && (b.osVersion =
				g.toLowerCase().split("version/")[1].split(" ")[0]), b.webView = !(!(C || T || E) || !g.match(
				/.*AppleWebKit(?!.*Safari)/i) && !t.navigator.standalone) || t.matchMedia && t.matchMedia(
				"(display-mode: standalone)").matches, b.webview = b.webView, b.standalone = b.webView, b.desktop = !(b.ios || b.android) ||
			k, b.desktop && (b.electron = k, b.macos = $, b.windows = z, b.macos && (b.os = "macos"), b.windows && (b.os =
				"windows")), b.pixelRatio = t.devicePixelRatio || 1, b);

	function D(i) {
		var a = this.touchEventsData,
			r = this.params,
			o = this.touches;
		if (!this.animating || !r.preventInteractionOnTransition) {
			var l = i;
			l.originalEvent && (l = l.originalEvent);
			var d = s(l.target);
			if (("wrapper" !== r.touchEventsTarget || d.closest(this.wrapperEl).length) && (a.isTouchEvent = "touchstart" ===
					l.type, (a.isTouchEvent || !("which" in l) || 3 !== l.which) && !(!a.isTouchEvent && "button" in l && l.button >
						0 || a.isTouched && a.isMoved)))
				if (r.noSwiping && d.closest(r.noSwipingSelector ? r.noSwipingSelector : "." + r.noSwipingClass)[0]) this.allowClick = !
					0;
				else if (!r.swipeHandler || d.closest(r.swipeHandler)[0]) {
				o.currentX = "touchstart" === l.type ? l.targetTouches[0].pageX : l.pageX, o.currentY = "touchstart" === l.type ?
					l.targetTouches[0].pageY : l.pageY;
				var h = o.currentX,
					p = o.currentY,
					c = r.edgeSwipeDetection || r.iOSEdgeSwipeDetection,
					u = r.edgeSwipeThreshold || r.iOSEdgeSwipeThreshold;
				if (!c || !(h <= u || h >= t.screen.width - u)) {
					if (n.extend(a, {
							isTouched: !0,
							isMoved: !1,
							allowTouchCallbacks: !0,
							isScrolling: void 0,
							startMoving: void 0
						}), o.startX = h, o.startY = p, a.touchStartTime = n.now(), this.allowClick = !0, this.updateSize(), this.swipeDirection =
						void 0, r.threshold > 0 && (a.allowThresholdMove = !1), "touchstart" !== l.type) {
						var v = !0;
						d.is(a.formElements) && (v = !1), e.activeElement && s(e.activeElement).is(a.formElements) && e.activeElement !==
							d[0] && e.activeElement.blur();
						var f = v && this.allowTouchMove && r.touchStartPreventDefault;
						(r.touchStartForcePreventDefault || f) && l.preventDefault()
					}
					this.emit("touchStart", l)
				}
			}
		}
	}

	function O(t) {
		var i = this.touchEventsData,
			a = this.params,
			r = this.touches,
			o = this.rtlTranslate,
			l = t;
		if (l.originalEvent && (l = l.originalEvent), i.isTouched) {
			if (!i.isTouchEvent || "mousemove" !== l.type) {
				var d = "touchmove" === l.type && l.targetTouches && (l.targetTouches[0] || l.changedTouches[0]),
					h = "touchmove" === l.type ? d.pageX : l.pageX,
					p = "touchmove" === l.type ? d.pageY : l.pageY;
				if (l.preventedByNestedSwiper) return r.startX = h, void(r.startY = p);
				if (!this.allowTouchMove) return this.allowClick = !1, void(i.isTouched && (n.extend(r, {
					startX: h,
					startY: p,
					currentX: h,
					currentY: p
				}), i.touchStartTime = n.now()));
				if (i.isTouchEvent && a.touchReleaseOnEdges && !a.loop)
					if (this.isVertical()) {
						if (p < r.startY && this.translate <= this.maxTranslate() || p > r.startY && this.translate >= this.minTranslate())
							return i.isTouched = !1, void(i.isMoved = !1)
					} else if (h < r.startX && this.translate <= this.maxTranslate() || h > r.startX && this.translate >= this.minTranslate())
					return;
				if (i.isTouchEvent && e.activeElement && l.target === e.activeElement && s(l.target).is(i.formElements)) return i
					.isMoved = !0, void(this.allowClick = !1);
				if (i.allowTouchCallbacks && this.emit("touchMove", l), !(l.targetTouches && l.targetTouches.length > 1)) {
					r.currentX = h, r.currentY = p;
					var c = r.currentX - r.startX,
						u = r.currentY - r.startY;
					if (!(this.params.threshold && Math.sqrt(Math.pow(c, 2) + Math.pow(u, 2)) < this.params.threshold)) {
						var v;
						if (void 0 === i.isScrolling) this.isHorizontal() && r.currentY === r.startY || this.isVertical() && r.currentX ===
							r.startX ? i.isScrolling = !1 : c * c + u * u >= 25 && (v = 180 * Math.atan2(Math.abs(u), Math.abs(c)) / Math.PI,
								i.isScrolling = this.isHorizontal() ? v > a.touchAngle : 90 - v > a.touchAngle);
						if (i.isScrolling && this.emit("touchMoveOpposite", l), void 0 === i.startMoving && (r.currentX === r.startX &&
								r.currentY === r.startY || (i.startMoving = !0)), i.isScrolling) i.isTouched = !1;
						else if (i.startMoving) {
							this.allowClick = !1, a.cssMode || l.preventDefault(), a.touchMoveStopPropagation && !a.nested && l.stopPropagation(),
								i.isMoved || (a.loop && this.loopFix(), i.startTranslate = this.getTranslate(), this.setTransition(0), this.animating &&
									this.$wrapperEl.trigger("webkitTransitionEnd transitionend"), i.allowMomentumBounce = !1, !a.grabCursor || !
									0 !== this.allowSlideNext && !0 !== this.allowSlidePrev || this.setGrabCursor(!0), this.emit(
										"sliderFirstMove", l)), this.emit("sliderMove", l), i.isMoved = !0;
							var f = this.isHorizontal() ? c : u;
							r.diff = f, f *= a.touchRatio, o && (f = -f), this.swipeDirection = f > 0 ? "prev" : "next", i.currentTranslate =
								f + i.startTranslate;
							var m = !0,
								g = a.resistanceRatio;
							if (a.touchReleaseOnEdges && (g = 0), f > 0 && i.currentTranslate > this.minTranslate() ? (m = !1, a.resistance &&
									(i.currentTranslate = this.minTranslate() - 1 + Math.pow(-this.minTranslate() + i.startTranslate + f, g))) :
								f < 0 && i.currentTranslate < this.maxTranslate() && (m = !1, a.resistance && (i.currentTranslate = this.maxTranslate() +
									1 - Math.pow(this.maxTranslate() - i.startTranslate - f, g))), m && (l.preventedByNestedSwiper = !0), !this.allowSlideNext &&
								"next" === this.swipeDirection && i.currentTranslate < i.startTranslate && (i.currentTranslate = i.startTranslate),
								!this.allowSlidePrev && "prev" === this.swipeDirection && i.currentTranslate > i.startTranslate && (i.currentTranslate =
									i.startTranslate), a.threshold > 0) {
								if (!(Math.abs(f) > a.threshold || i.allowThresholdMove)) return void(i.currentTranslate = i.startTranslate);
								if (!i.allowThresholdMove) return i.allowThresholdMove = !0, r.startX = r.currentX, r.startY = r.currentY, i.currentTranslate =
									i.startTranslate, void(r.diff = this.isHorizontal() ? r.currentX - r.startX : r.currentY - r.startY)
							}
							a.followFinger && !a.cssMode && ((a.freeMode || a.watchSlidesProgress || a.watchSlidesVisibility) && (this.updateActiveIndex(),
								this.updateSlidesClasses()), a.freeMode && (0 === i.velocities.length && i.velocities.push({
								position: r[this.isHorizontal() ? "startX" : "startY"],
								time: i.touchStartTime
							}), i.velocities.push({
								position: r[this.isHorizontal() ? "currentX" : "currentY"],
								time: n.now()
							})), this.updateProgress(i.currentTranslate), this.setTranslate(i.currentTranslate))
						}
					}
				}
			}
		} else i.startMoving && i.isScrolling && this.emit("touchMoveOpposite", l)
	}

	function A(e) {
		var t = this,
			i = t.touchEventsData,
			s = t.params,
			a = t.touches,
			r = t.rtlTranslate,
			o = t.$wrapperEl,
			l = t.slidesGrid,
			d = t.snapGrid,
			h = e;
		if (h.originalEvent && (h = h.originalEvent), i.allowTouchCallbacks && t.emit("touchEnd", h), i.allowTouchCallbacks = !
			1, !i.isTouched) return i.isMoved && s.grabCursor && t.setGrabCursor(!1), i.isMoved = !1, void(i.startMoving = !1);
		s.grabCursor && i.isMoved && i.isTouched && (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) && t.setGrabCursor(
			!1);
		var p, c = n.now(),
			u = c - i.touchStartTime;
		if (t.allowClick && (t.updateClickedSlide(h), t.emit("tap click", h), u < 300 && c - i.lastClickTime < 300 && t.emit(
				"doubleTap doubleClick", h)), i.lastClickTime = n.now(), n.nextTick((function() {
				t.destroyed || (t.allowClick = !0)
			})), !i.isTouched || !i.isMoved || !t.swipeDirection || 0 === a.diff || i.currentTranslate === i.startTranslate)
			return i.isTouched = !1, i.isMoved = !1, void(i.startMoving = !1);
		if (i.isTouched = !1, i.isMoved = !1, i.startMoving = !1, p = s.followFinger ? r ? t.translate : -t.translate : -i.currentTranslate,
			!s.cssMode)
			if (s.freeMode) {
				if (p < -t.minTranslate()) return void t.slideTo(t.activeIndex);
				if (p > -t.maxTranslate()) return void(t.slides.length < d.length ? t.slideTo(d.length - 1) : t.slideTo(t.slides.length -
					1));
				if (s.freeModeMomentum) {
					if (i.velocities.length > 1) {
						var v = i.velocities.pop(),
							f = i.velocities.pop(),
							m = v.position - f.position,
							g = v.time - f.time;
						t.velocity = m / g, t.velocity /= 2, Math.abs(t.velocity) < s.freeModeMinimumVelocity && (t.velocity = 0), (g >
							150 || n.now() - v.time > 300) && (t.velocity = 0)
					} else t.velocity = 0;
					t.velocity *= s.freeModeMomentumVelocityRatio, i.velocities.length = 0;
					var b = 1e3 * s.freeModeMomentumRatio,
						w = t.velocity * b,
						y = t.translate + w;
					r && (y = -y);
					var x, T, E = !1,
						C = 20 * Math.abs(t.velocity) * s.freeModeMomentumBounceRatio;
					if (y < t.maxTranslate()) s.freeModeMomentumBounce ? (y + t.maxTranslate() < -C && (y = t.maxTranslate() - C), x =
						t.maxTranslate(), E = !0, i.allowMomentumBounce = !0) : y = t.maxTranslate(), s.loop && s.centeredSlides && (T = !
						0);
					else if (y > t.minTranslate()) s.freeModeMomentumBounce ? (y - t.minTranslate() > C && (y = t.minTranslate() + C),
							x = t.minTranslate(), E = !0, i.allowMomentumBounce = !0) : y = t.minTranslate(), s.loop && s.centeredSlides &&
						(T = !0);
					else if (s.freeModeSticky) {
						for (var S, M = 0; M < d.length; M += 1)
							if (d[M] > -y) {
								S = M;
								break
							} y = -(y = Math.abs(d[S] - y) < Math.abs(d[S - 1] - y) || "next" === t.swipeDirection ? d[S] : d[S - 1])
					}
					if (T && t.once("transitionEnd", (function() {
							t.loopFix()
						})), 0 !== t.velocity) {
						if (b = r ? Math.abs((-y - t.translate) / t.velocity) : Math.abs((y - t.translate) / t.velocity), s.freeModeSticky) {
							var P = Math.abs((r ? -y : y) - t.translate),
								z = t.slidesSizesGrid[t.activeIndex];
							b = P < z ? s.speed : P < 2 * z ? 1.5 * s.speed : 2.5 * s.speed
						}
					} else if (s.freeModeSticky) return void t.slideToClosest();
					s.freeModeMomentumBounce && E ? (t.updateProgress(x), t.setTransition(b), t.setTranslate(y), t.transitionStart(!
						0, t.swipeDirection), t.animating = !0, o.transitionEnd((function() {
						t && !t.destroyed && i.allowMomentumBounce && (t.emit("momentumBounce"), t.setTransition(s.speed), t.setTranslate(
							x), o.transitionEnd((function() {
							t && !t.destroyed && t.transitionEnd()
						})))
					}))) : t.velocity ? (t.updateProgress(y), t.setTransition(b), t.setTranslate(y), t.transitionStart(!0, t.swipeDirection),
						t.animating || (t.animating = !0, o.transitionEnd((function() {
							t && !t.destroyed && t.transitionEnd()
						})))) : t.updateProgress(y), t.updateActiveIndex(), t.updateSlidesClasses()
				} else if (s.freeModeSticky) return void t.slideToClosest();
				(!s.freeModeMomentum || u >= s.longSwipesMs) && (t.updateProgress(), t.updateActiveIndex(), t.updateSlidesClasses())
			} else {
				for (var k = 0, $ = t.slidesSizesGrid[0], L = 0; L < l.length; L += s.slidesPerGroup) void 0 !== l[L + s.slidesPerGroup] ?
					p >= l[L] && p < l[L + s.slidesPerGroup] && (k = L, $ = l[L + s.slidesPerGroup] - l[L]) : p >= l[L] && (k = L, $ =
						l[l.length - 1] - l[l.length - 2]);
				var I = (p - l[k]) / $;
				if (u > s.longSwipesMs) {
					if (!s.longSwipes) return void t.slideTo(t.activeIndex);
					"next" === t.swipeDirection && (I >= s.longSwipesRatio ? t.slideTo(k + s.slidesPerGroup) : t.slideTo(k)), "prev" ===
						t.swipeDirection && (I > 1 - s.longSwipesRatio ? t.slideTo(k + s.slidesPerGroup) : t.slideTo(k))
				} else {
					if (!s.shortSwipes) return void t.slideTo(t.activeIndex);
					t.navigation && (h.target === t.navigation.nextEl || h.target === t.navigation.prevEl) ? h.target === t.navigation
						.nextEl ? t.slideTo(k + s.slidesPerGroup) : t.slideTo(k) : ("next" === t.swipeDirection && t.slideTo(k + s.slidesPerGroup),
							"prev" === t.swipeDirection && t.slideTo(k))
				}
			}
	}

	function G() {
		var e = this.params,
			t = this.el;
		if (!t || 0 !== t.offsetWidth) {
			e.breakpoints && this.setBreakpoint();
			var i = this.allowSlideNext,
				s = this.allowSlidePrev,
				a = this.snapGrid;
			this.allowSlideNext = !0, this.allowSlidePrev = !0, this.updateSize(), this.updateSlides(), this.updateSlidesClasses(),
				("auto" === e.slidesPerView || e.slidesPerView > 1) && this.isEnd && !this.params.centeredSlides ? this.slideTo(
					this.slides.length - 1, 0, !1, !0) : this.slideTo(this.activeIndex, 0, !1, !0), this.autoplay && this.autoplay.running &&
				this.autoplay.paused && this.autoplay.run(), this.allowSlidePrev = s, this.allowSlideNext = i, this.params.watchOverflow &&
				a !== this.snapGrid && this.checkOverflow()
		}
	}

	function B(e) {
		this.allowClick || (this.params.preventClicks && e.preventDefault(), this.params.preventClicksPropagation && this.animating &&
			(e.stopPropagation(), e.stopImmediatePropagation()))
	}

	function H() {
		var e = this.wrapperEl;
		this.previousTranslate = this.translate, this.translate = this.isHorizontal() ? -e.scrollLeft : -e.scrollTop, -0 ===
			this.translate && (this.translate = 0), this.updateActiveIndex(), this.updateSlidesClasses();
		var t = this.maxTranslate() - this.minTranslate();
		(0 === t ? 0 : (this.translate - this.minTranslate()) / t) !== this.progress && this.updateProgress(this.translate),
			this.emit("setTranslate", this.translate, !1)
	}
	var N = !1;

	function X() {}
	var V = {
			init: !0,
			direction: "horizontal",
			touchEventsTarget: "container",
			initialSlide: 0,
			speed: 300,
			cssMode: !1,
			preventInteractionOnTransition: !1,
			edgeSwipeDetection: !1,
			edgeSwipeThreshold: 20,
			freeMode: !1,
			freeModeMomentum: !0,
			freeModeMomentumRatio: 1,
			freeModeMomentumBounce: !0,
			freeModeMomentumBounceRatio: 1,
			freeModeMomentumVelocityRatio: 1,
			freeModeSticky: !1,
			freeModeMinimumVelocity: .02,
			autoHeight: !1,
			setWrapperSize: !1,
			virtualTranslate: !1,
			effect: "slide",
			breakpoints: void 0,
			spaceBetween: 0,
			slidesPerView: 1,
			slidesPerColumn: 1,
			slidesPerColumnFill: "column",
			slidesPerGroup: 1,
			centeredSlides: !1,
			centeredSlidesBounds: !1,
			slidesOffsetBefore: 0,
			slidesOffsetAfter: 0,
			normalizeSlideIndex: !0,
			centerInsufficientSlides: !1,
			watchOverflow: !1,
			roundLengths: !1,
			touchRatio: 1,
			touchAngle: 45,
			simulateTouch: !0,
			shortSwipes: !0,
			longSwipes: !0,
			longSwipesRatio: .5,
			longSwipesMs: 300,
			followFinger: !0,
			allowTouchMove: !0,
			threshold: 0,
			touchMoveStopPropagation: !1,
			touchStartPreventDefault: !0,
			touchStartForcePreventDefault: !1,
			touchReleaseOnEdges: !1,
			uniqueNavElements: !0,
			resistance: !0,
			resistanceRatio: .85,
			watchSlidesProgress: !1,
			watchSlidesVisibility: !1,
			grabCursor: !1,
			preventClicks: !0,
			preventClicksPropagation: !0,
			slideToClickedSlide: !1,
			preloadImages: !0,
			updateOnImagesReady: !0,
			loop: !1,
			loopAdditionalSlides: 0,
			loopedSlides: null,
			loopFillGroupWithBlank: !1,
			allowSlidePrev: !0,
			allowSlideNext: !0,
			swipeHandler: null,
			noSwiping: !0,
			noSwipingClass: "swiper-no-swiping",
			noSwipingSelector: null,
			passiveListeners: !0,
			containerModifierClass: "swiper-container-",
			slideClass: "swiper-slide",
			slideBlankClass: "swiper-slide-invisible-blank",
			slideActiveClass: "swiper-slide-active",
			slideDuplicateActiveClass: "swiper-slide-duplicate-active",
			slideVisibleClass: "swiper-slide-visible",
			slideDuplicateClass: "swiper-slide-duplicate",
			slideNextClass: "swiper-slide-next",
			slideDuplicateNextClass: "swiper-slide-duplicate-next",
			slidePrevClass: "swiper-slide-prev",
			slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
			wrapperClass: "swiper-wrapper",
			runCallbacksOnInit: !0
		},
		Y = {
			update: h,
			translate: p,
			transition: c,
			slide: u,
			loop: v,
			grabCursor: f,
			manipulation: L,
			events: {
				attachEvents: function() {
					var t = this.params,
						i = this.touchEvents,
						s = this.el,
						a = this.wrapperEl;
					this.onTouchStart = D.bind(this), this.onTouchMove = O.bind(this), this.onTouchEnd = A.bind(this), t.cssMode &&
						(this.onScroll = H.bind(this)), this.onClick = B.bind(this);
					var r = !!t.nested;
					if (!o.touch && o.pointerEvents) s.addEventListener(i.start, this.onTouchStart, !1), e.addEventListener(i.move,
						this.onTouchMove, r), e.addEventListener(i.end, this.onTouchEnd, !1);
					else {
						if (o.touch) {
							var n = !("touchstart" !== i.start || !o.passiveListener || !t.passiveListeners) && {
								passive: !0,
								capture: !1
							};
							s.addEventListener(i.start, this.onTouchStart, n), s.addEventListener(i.move, this.onTouchMove, o.passiveListener ?
								{
									passive: !1,
									capture: r
								} : r), s.addEventListener(i.end, this.onTouchEnd, n), i.cancel && s.addEventListener(i.cancel, this.onTouchEnd,
								n), N || (e.addEventListener("touchstart", X), N = !0)
						}(t.simulateTouch && !I.ios && !I.android || t.simulateTouch && !o.touch && I.ios) && (s.addEventListener(
							"mousedown", this.onTouchStart, !1), e.addEventListener("mousemove", this.onTouchMove, r), e.addEventListener(
							"mouseup", this.onTouchEnd, !1))
					}(t.preventClicks || t.preventClicksPropagation) && s.addEventListener("click", this.onClick, !0), t.cssMode &&
						a.addEventListener("scroll", this.onScroll), this.on(I.ios || I.android ?
							"resize orientationchange observerUpdate" : "resize observerUpdate", G, !0)
				},
				detachEvents: function() {
					var t = this.params,
						i = this.touchEvents,
						s = this.el,
						a = this.wrapperEl,
						r = !!t.nested;
					if (!o.touch && o.pointerEvents) s.removeEventListener(i.start, this.onTouchStart, !1), e.removeEventListener(i
						.move, this.onTouchMove, r), e.removeEventListener(i.end, this.onTouchEnd, !1);
					else {
						if (o.touch) {
							var n = !("onTouchStart" !== i.start || !o.passiveListener || !t.passiveListeners) && {
								passive: !0,
								capture: !1
							};
							s.removeEventListener(i.start, this.onTouchStart, n), s.removeEventListener(i.move, this.onTouchMove, r), s.removeEventListener(
								i.end, this.onTouchEnd, n), i.cancel && s.removeEventListener(i.cancel, this.onTouchEnd, n)
						}(t.simulateTouch && !I.ios && !I.android || t.simulateTouch && !o.touch && I.ios) && (s.removeEventListener(
							"mousedown", this.onTouchStart, !1), e.removeEventListener("mousemove", this.onTouchMove, r), e.removeEventListener(
							"mouseup", this.onTouchEnd, !1))
					}(t.preventClicks || t.preventClicksPropagation) && s.removeEventListener("click", this.onClick, !0), t.cssMode &&
						a.removeEventListener("scroll", this.onScroll), this.off(I.ios || I.android ?
							"resize orientationchange observerUpdate" : "resize observerUpdate", G)
				}
			},
			breakpoints: {
				setBreakpoint: function() {
					var e = this.activeIndex,
						t = this.initialized,
						i = this.loopedSlides;
					void 0 === i && (i = 0);
					var s = this.params,
						a = this.$el,
						r = s.breakpoints;
					if (r && (!r || 0 !== Object.keys(r).length)) {
						var o = this.getBreakpoint(r);
						if (o && this.currentBreakpoint !== o) {
							var l = o in r ? r[o] : void 0;
							l && ["slidesPerView", "spaceBetween", "slidesPerGroup", "slidesPerColumn"].forEach((function(e) {
								var t = l[e];
								void 0 !== t && (l[e] = "slidesPerView" !== e || "AUTO" !== t && "auto" !== t ? "slidesPerView" === e ?
									parseFloat(t) : parseInt(t, 10) : "auto")
							}));
							var d = l || this.originalParams,
								h = s.slidesPerColumn > 1,
								p = d.slidesPerColumn > 1;
							h && !p ? a.removeClass(s.containerModifierClass + "multirow " + s.containerModifierClass + "multirow-column") :
								!h && p && (a.addClass(s.containerModifierClass + "multirow"), "column" === d.slidesPerColumnFill && a.addClass(
									s.containerModifierClass + "multirow-column"));
							var c = d.direction && d.direction !== s.direction,
								u = s.loop && (d.slidesPerView !== s.slidesPerView || c);
							c && t && this.changeDirection(), n.extend(this.params, d), n.extend(this, {
								allowTouchMove: this.params.allowTouchMove,
								allowSlideNext: this.params.allowSlideNext,
								allowSlidePrev: this.params.allowSlidePrev
							}), this.currentBreakpoint = o, u && t && (this.loopDestroy(), this.loopCreate(), this.updateSlides(), this.slideTo(
								e - i + this.loopedSlides, 0, !1)), this.emit("breakpoint", d)
						}
					}
				},
				getBreakpoint: function(e) {
					if (e) {
						var i = !1,
							s = [];
						Object.keys(e).forEach((function(e) {
							s.push(e)
						})), s.sort((function(e, t) {
							return parseInt(e, 10) - parseInt(t, 10)
						}));
						for (var a = 0; a < s.length; a += 1) {
							var r = s[a];
							r <= t.innerWidth && (i = r)
						}
						return i || "max"
					}
				}
			},
			checkOverflow: {
				checkOverflow: function() {
					var e = this.params,
						t = this.isLocked,
						i = this.slides.length > 0 && e.slidesOffsetBefore + e.spaceBetween * (this.slides.length - 1) + this.slides[0]
						.offsetWidth * this.slides.length;
					e.slidesOffsetBefore && e.slidesOffsetAfter && i ? this.isLocked = i <= this.size : this.isLocked = 1 === this.snapGrid
						.length, this.allowSlideNext = !this.isLocked, this.allowSlidePrev = !this.isLocked, t !== this.isLocked &&
						this.emit(this.isLocked ? "lock" : "unlock"), t && t !== this.isLocked && (this.isEnd = !1, this.navigation.update())
				}
			},
			classes: {
				addClasses: function() {
					var e = this.classNames,
						t = this.params,
						i = this.rtl,
						s = this.$el,
						a = [];
					a.push("initialized"), a.push(t.direction), t.freeMode && a.push("free-mode"), t.autoHeight && a.push(
						"autoheight"), i && a.push("rtl"), t.slidesPerColumn > 1 && (a.push("multirow"), "column" === t.slidesPerColumnFill &&
						a.push("multirow-column")), I.android && a.push("android"), I.ios && a.push("ios"), t.cssMode && a.push(
						"css-mode"), a.forEach((function(i) {
						e.push(t.containerModifierClass + i)
					})), s.addClass(e.join(" "))
				},
				removeClasses: function() {
					var e = this.$el,
						t = this.classNames;
					e.removeClass(t.join(" "))
				}
			},
			images: {
				loadImage: function(e, i, s, a, r, n) {
					var o;

					function l() {
						n && n()
					}
					e.complete && r ? l() : i ? ((o = new t.Image).onload = l, o.onerror = l, a && (o.sizes = a), s && (o.srcset =
						s), i && (o.src = i)) : l()
				},
				preloadImages: function() {
					var e = this;

					function t() {
						null != e && e && !e.destroyed && (void 0 !== e.imagesLoaded && (e.imagesLoaded += 1), e.imagesLoaded === e.imagesToLoad
							.length && (e.params.updateOnImagesReady && e.update(), e.emit("imagesReady")))
					}
					e.imagesToLoad = e.$el.find("img");
					for (var i = 0; i < e.imagesToLoad.length; i += 1) {
						var s = e.imagesToLoad[i];
						e.loadImage(s, s.currentSrc || s.getAttribute("src"), s.srcset || s.getAttribute("srcset"), s.sizes || s.getAttribute(
							"sizes"), !0, t)
					}
				}
			}
		},
		F = {},
		W = function(e) {
			function t() {
				for (var i, a, r, l = [], d = arguments.length; d--;) l[d] = arguments[d];
				1 === l.length && l[0].constructor && l[0].constructor === Object ? r = l[0] : (a = (i = l)[0], r = i[1]), r || (
					r = {}), r = n.extend({}, r), a && !r.el && (r.el = a), e.call(this, r), Object.keys(Y).forEach((function(e) {
					Object.keys(Y[e]).forEach((function(i) {
						t.prototype[i] || (t.prototype[i] = Y[e][i])
					}))
				}));
				var h = this;
				void 0 === h.modules && (h.modules = {}), Object.keys(h.modules).forEach((function(e) {
					var t = h.modules[e];
					if (t.params) {
						var i = Object.keys(t.params)[0],
							s = t.params[i];
						if ("object" != typeof s || null === s) return;
						if (!(i in r && "enabled" in s)) return;
						!0 === r[i] && (r[i] = {
							enabled: !0
						}), "object" != typeof r[i] || "enabled" in r[i] || (r[i].enabled = !0), r[i] || (r[i] = {
							enabled: !1
						})
					}
				}));
				var p = n.extend({}, V);
				h.useModulesParams(p), h.params = n.extend({}, p, F, r), h.originalParams = n.extend({}, h.params), h.passedParams =
					n.extend({}, r), h.$ = s;
				var c = s(h.params.el);
				if (a = c[0]) {
					if (c.length > 1) {
						var u = [];
						return c.each((function(e, i) {
							var s = n.extend({}, r, {
								el: i
							});
							u.push(new t(s))
						})), u
					}
					var v, f, m;
					return a.swiper = h, c.data("swiper", h), a && a.shadowRoot && a.shadowRoot.querySelector ? (v = s(a.shadowRoot.querySelector(
						"." + h.params.wrapperClass))).children = function(e) {
						return c.children(e)
					} : v = c.children("." + h.params.wrapperClass), n.extend(h, {
						$el: c,
						el: a,
						$wrapperEl: v,
						wrapperEl: v[0],
						classNames: [],
						slides: s(),
						slidesGrid: [],
						snapGrid: [],
						slidesSizesGrid: [],
						isHorizontal: function() {
							return "horizontal" === h.params.direction
						},
						isVertical: function() {
							return "vertical" === h.params.direction
						},
						rtl: "rtl" === a.dir.toLowerCase() || "rtl" === c.css("direction"),
						rtlTranslate: "horizontal" === h.params.direction && ("rtl" === a.dir.toLowerCase() || "rtl" === c.css(
							"direction")),
						wrongRTL: "-webkit-box" === v.css("display"),
						activeIndex: 0,
						realIndex: 0,
						isBeginning: !0,
						isEnd: !1,
						translate: 0,
						previousTranslate: 0,
						progress: 0,
						velocity: 0,
						animating: !1,
						allowSlideNext: h.params.allowSlideNext,
						allowSlidePrev: h.params.allowSlidePrev,
						touchEvents: (f = ["touchstart", "touchmove", "touchend", "touchcancel"], m = ["mousedown", "mousemove",
							"mouseup"
						], o.pointerEvents && (m = ["pointerdown", "pointermove", "pointerup"]), h.touchEventsTouch = {
							start: f[0],
							move: f[1],
							end: f[2],
							cancel: f[3]
						}, h.touchEventsDesktop = {
							start: m[0],
							move: m[1],
							end: m[2]
						}, o.touch || !h.params.simulateTouch ? h.touchEventsTouch : h.touchEventsDesktop),
						touchEventsData: {
							isTouched: void 0,
							isMoved: void 0,
							allowTouchCallbacks: void 0,
							touchStartTime: void 0,
							isScrolling: void 0,
							currentTranslate: void 0,
							startTranslate: void 0,
							allowThresholdMove: void 0,
							formElements: "input, select, option, textarea, button, video",
							lastClickTime: n.now(),
							clickTimeout: void 0,
							velocities: [],
							allowMomentumBounce: void 0,
							isTouchEvent: void 0,
							startMoving: void 0
						},
						allowClick: !0,
						allowTouchMove: h.params.allowTouchMove,
						touches: {
							startX: 0,
							startY: 0,
							currentX: 0,
							currentY: 0,
							diff: 0
						},
						imagesToLoad: [],
						imagesLoaded: 0
					}), h.useModules(), h.params.init && h.init(), h
				}
			}
			e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t;
			var i = {
				extendedDefaults: {
					configurable: !0
				},
				defaults: {
					configurable: !0
				},
				Class: {
					configurable: !0
				},
				$: {
					configurable: !0
				}
			};
			return t.prototype.slidesPerViewDynamic = function() {
				var e = this.params,
					t = this.slides,
					i = this.slidesGrid,
					s = this.size,
					a = this.activeIndex,
					r = 1;
				if (e.centeredSlides) {
					for (var n, o = t[a].swiperSlideSize, l = a + 1; l < t.length; l += 1) t[l] && !n && (r += 1, (o += t[l].swiperSlideSize) >
						s && (n = !0));
					for (var d = a - 1; d >= 0; d -= 1) t[d] && !n && (r += 1, (o += t[d].swiperSlideSize) > s && (n = !0))
				} else
					for (var h = a + 1; h < t.length; h += 1) i[h] - i[a] < s && (r += 1);
				return r
			}, t.prototype.update = function() {
				var e = this;
				if (e && !e.destroyed) {
					var t = e.snapGrid,
						i = e.params;
					i.breakpoints && e.setBreakpoint(), e.updateSize(), e.updateSlides(), e.updateProgress(), e.updateSlidesClasses(),
						e.params.freeMode ? (s(), e.params.autoHeight && e.updateAutoHeight()) : (("auto" === e.params.slidesPerView ||
							e.params.slidesPerView > 1) && e.isEnd && !e.params.centeredSlides ? e.slideTo(e.slides.length - 1, 0, !1, !
							0) : e.slideTo(e.activeIndex, 0, !1, !0)) || s(), i.watchOverflow && t !== e.snapGrid && e.checkOverflow(), e
						.emit("update")
				}

				function s() {
					var t = e.rtlTranslate ? -1 * e.translate : e.translate,
						i = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
					e.setTranslate(i), e.updateActiveIndex(), e.updateSlidesClasses()
				}
			}, t.prototype.changeDirection = function(e, t) {
				void 0 === t && (t = !0);
				var i = this.params.direction;
				return e || (e = "horizontal" === i ? "vertical" : "horizontal"), e === i || "horizontal" !== e && "vertical" !==
					e ? this : (this.$el.removeClass("" + this.params.containerModifierClass + i).addClass("" + this.params.containerModifierClass +
						e), this.params.direction = e, this.slides.each((function(t, i) {
						"vertical" === e ? i.style.width = "" : i.style.height = ""
					})), this.emit("changeDirection"), t && this.update(), this)
			}, t.prototype.init = function() {
				this.initialized || (this.emit("beforeInit"), this.params.breakpoints && this.setBreakpoint(), this.addClasses(),
					this.params.loop && this.loopCreate(), this.updateSize(), this.updateSlides(), this.params.watchOverflow &&
					this.checkOverflow(), this.params.grabCursor && this.setGrabCursor(), this.params.preloadImages && this.preloadImages(),
					this.params.loop ? this.slideTo(this.params.initialSlide + this.loopedSlides, 0, this.params.runCallbacksOnInit) :
					this.slideTo(this.params.initialSlide, 0, this.params.runCallbacksOnInit), this.attachEvents(), this.initialized = !
					0, this.emit("init"))
			}, t.prototype.destroy = function(e, t) {
				void 0 === e && (e = !0), void 0 === t && (t = !0);
				var i = this,
					s = i.params,
					a = i.$el,
					r = i.$wrapperEl,
					o = i.slides;
				return void 0 === i.params || i.destroyed ? null : (i.emit("beforeDestroy"), i.initialized = !1, i.detachEvents(),
					s.loop && i.loopDestroy(), t && (i.removeClasses(), a.removeAttr("style"), r.removeAttr("style"), o && o.length &&
						o.removeClass([s.slideVisibleClass, s.slideActiveClass, s.slideNextClass, s.slidePrevClass].join(" ")).removeAttr(
							"style").removeAttr("data-swiper-slide-index")), i.emit("destroy"), Object.keys(i.eventsListeners).forEach((
						function(e) {
							i.off(e)
						})), !1 !== e && (i.$el[0].swiper = null, i.$el.data("swiper", null), n.deleteProps(i)), i.destroyed = !0,
					null)
			}, t.extendDefaults = function(e) {
				n.extend(F, e)
			}, i.extendedDefaults.get = function() {
				return F
			}, i.defaults.get = function() {
				return V
			}, i.Class.get = function() {
				return e
			}, i.$.get = function() {
				return s
			}, Object.defineProperties(t, i), t
		}(l),
		R = {
			name: "device",
			proto: {
				device: I
			},
			static: {
				device: I
			}
		},
		q = {
			name: "support",
			proto: {
				support: o
			},
			static: {
				support: o
			}
		},
		j = {
			isEdge: !!t.navigator.userAgent.match(/Edge/g),
			isSafari: function() {
				var e = t.navigator.userAgent.toLowerCase();
				return e.indexOf("safari") >= 0 && e.indexOf("chrome") < 0 && e.indexOf("android") < 0
			}(),
			isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(t.navigator.userAgent)
		},
		K = {
			name: "browser",
			proto: {
				browser: j
			},
			static: {
				browser: j
			}
		},
		U = {
			name: "resize",
			create: function() {
				var e = this;
				n.extend(e, {
					resize: {
						resizeHandler: function() {
							e && !e.destroyed && e.initialized && (e.emit("beforeResize"), e.emit("resize"))
						},
						orientationChangeHandler: function() {
							e && !e.destroyed && e.initialized && e.emit("orientationchange")
						}
					}
				})
			},
			on: {
				init: function() {
					t.addEventListener("resize", this.resize.resizeHandler), t.addEventListener("orientationchange", this.resize.orientationChangeHandler)
				},
				destroy: function() {
					t.removeEventListener("resize", this.resize.resizeHandler), t.removeEventListener("orientationchange", this.resize
						.orientationChangeHandler)
				}
			}
		},
		_ = {
			func: t.MutationObserver || t.WebkitMutationObserver,
			attach: function(e, i) {
				void 0 === i && (i = {});
				var s = this,
					a = new(0, _.func)((function(e) {
						if (1 !== e.length) {
							var i = function() {
								s.emit("observerUpdate", e[0])
							};
							t.requestAnimationFrame ? t.requestAnimationFrame(i) : t.setTimeout(i, 0)
						} else s.emit("observerUpdate", e[0])
					}));
				a.observe(e, {
					attributes: void 0 === i.attributes || i.attributes,
					childList: void 0 === i.childList || i.childList,
					characterData: void 0 === i.characterData || i.characterData
				}), s.observer.observers.push(a)
			},
			init: function() {
				if (o.observer && this.params.observer) {
					if (this.params.observeParents)
						for (var e = this.$el.parents(), t = 0; t < e.length; t += 1) this.observer.attach(e[t]);
					this.observer.attach(this.$el[0], {
						childList: this.params.observeSlideChildren
					}), this.observer.attach(this.$wrapperEl[0], {
						attributes: !1
					})
				}
			},
			destroy: function() {
				this.observer.observers.forEach((function(e) {
					e.disconnect()
				})), this.observer.observers = []
			}
		},
		Z = {
			name: "observer",
			params: {
				observer: !1,
				observeParents: !1,
				observeSlideChildren: !1
			},
			create: function() {
				n.extend(this, {
					observer: {
						init: _.init.bind(this),
						attach: _.attach.bind(this),
						destroy: _.destroy.bind(this),
						observers: []
					}
				})
			},
			on: {
				init: function() {
					this.observer.init()
				},
				destroy: function() {
					this.observer.destroy()
				}
			}
		},
		Q = {
			update: function(e) {
				var t = this,
					i = t.params,
					s = i.slidesPerView,
					a = i.slidesPerGroup,
					r = i.centeredSlides,
					o = t.params.virtual,
					l = o.addSlidesBefore,
					d = o.addSlidesAfter,
					h = t.virtual,
					p = h.from,
					c = h.to,
					u = h.slides,
					v = h.slidesGrid,
					f = h.renderSlide,
					m = h.offset;
				t.updateActiveIndex();
				var g, b, w, y = t.activeIndex || 0;
				g = t.rtlTranslate ? "right" : t.isHorizontal() ? "left" : "top", r ? (b = Math.floor(s / 2) + a + l, w = Math.floor(
					s / 2) + a + d) : (b = s + (a - 1) + l, w = a + d);
				var x = Math.max((y || 0) - w, 0),
					T = Math.min((y || 0) + b, u.length - 1),
					E = (t.slidesGrid[x] || 0) - (t.slidesGrid[0] || 0);

				function C() {
					t.updateSlides(), t.updateProgress(), t.updateSlidesClasses(), t.lazy && t.params.lazy.enabled && t.lazy.load()
				}
				if (n.extend(t.virtual, {
						from: x,
						to: T,
						offset: E,
						slidesGrid: t.slidesGrid
					}), p === x && c === T && !e) return t.slidesGrid !== v && E !== m && t.slides.css(g, E + "px"), void t.updateProgress();
				if (t.params.virtual.renderExternal) return t.params.virtual.renderExternal.call(t, {
					offset: E,
					from: x,
					to: T,
					slides: function() {
						for (var e = [], t = x; t <= T; t += 1) e.push(u[t]);
						return e
					}()
				}), void C();
				var S = [],
					M = [];
				if (e) t.$wrapperEl.find("." + t.params.slideClass).remove();
				else
					for (var P = p; P <= c; P += 1)(P < x || P > T) && t.$wrapperEl.find("." + t.params.slideClass +
						'[data-swiper-slide-index="' + P + '"]').remove();
				for (var z = 0; z < u.length; z += 1) z >= x && z <= T && (void 0 === c || e ? M.push(z) : (z > c && M.push(z),
					z < p && S.push(z)));
				M.forEach((function(e) {
					t.$wrapperEl.append(f(u[e], e))
				})), S.sort((function(e, t) {
					return t - e
				})).forEach((function(e) {
					t.$wrapperEl.prepend(f(u[e], e))
				})), t.$wrapperEl.children(".swiper-slide").css(g, E + "px"), C()
			},
			renderSlide: function(e, t) {
				var i = this.params.virtual;
				if (i.cache && this.virtual.cache[t]) return this.virtual.cache[t];
				var a = i.renderSlide ? s(i.renderSlide.call(this, e, t)) : s('<div class="' + this.params.slideClass +
					'" data-swiper-slide-index="' + t + '">' + e + "</div>");
				return a.attr("data-swiper-slide-index") || a.attr("data-swiper-slide-index", t), i.cache && (this.virtual.cache[
					t] = a), a
			},
			appendSlide: function(e) {
				if ("object" == typeof e && "length" in e)
					for (var t = 0; t < e.length; t += 1) e[t] && this.virtual.slides.push(e[t]);
				else this.virtual.slides.push(e);
				this.virtual.update(!0)
			},
			prependSlide: function(e) {
				var t = this.activeIndex,
					i = t + 1,
					s = 1;
				if (Array.isArray(e)) {
					for (var a = 0; a < e.length; a += 1) e[a] && this.virtual.slides.unshift(e[a]);
					i = t + e.length, s = e.length
				} else this.virtual.slides.unshift(e);
				if (this.params.virtual.cache) {
					var r = this.virtual.cache,
						n = {};
					Object.keys(r).forEach((function(e) {
						var t = r[e],
							i = t.attr("data-swiper-slide-index");
						i && t.attr("data-swiper-slide-index", parseInt(i, 10) + 1), n[parseInt(e, 10) + s] = t
					})), this.virtual.cache = n
				}
				this.virtual.update(!0), this.slideTo(i, 0)
			},
			removeSlide: function(e) {
				if (null != e) {
					var t = this.activeIndex;
					if (Array.isArray(e))
						for (var i = e.length - 1; i >= 0; i -= 1) this.virtual.slides.splice(e[i], 1), this.params.virtual.cache &&
							delete this.virtual.cache[e[i]], e[i] < t && (t -= 1), t = Math.max(t, 0);
					else this.virtual.slides.splice(e, 1), this.params.virtual.cache && delete this.virtual.cache[e], e < t && (t -=
						1), t = Math.max(t, 0);
					this.virtual.update(!0), this.slideTo(t, 0)
				}
			},
			removeAllSlides: function() {
				this.virtual.slides = [], this.params.virtual.cache && (this.virtual.cache = {}), this.virtual.update(!0), this.slideTo(
					0, 0)
			}
		},
		J = {
			name: "virtual",
			params: {
				virtual: {
					enabled: !1,
					slides: [],
					cache: !0,
					renderSlide: null,
					renderExternal: null,
					addSlidesBefore: 0,
					addSlidesAfter: 0
				}
			},
			create: function() {
				n.extend(this, {
					virtual: {
						update: Q.update.bind(this),
						appendSlide: Q.appendSlide.bind(this),
						prependSlide: Q.prependSlide.bind(this),
						removeSlide: Q.removeSlide.bind(this),
						removeAllSlides: Q.removeAllSlides.bind(this),
						renderSlide: Q.renderSlide.bind(this),
						slides: this.params.virtual.slides,
						cache: {}
					}
				})
			},
			on: {
				beforeInit: function() {
					if (this.params.virtual.enabled) {
						this.classNames.push(this.params.containerModifierClass + "virtual");
						var e = {
							watchSlidesProgress: !0
						};
						n.extend(this.params, e), n.extend(this.originalParams, e), this.params.initialSlide || this.virtual.update()
					}
				},
				setTranslate: function() {
					this.params.virtual.enabled && this.virtual.update()
				}
			}
		},
		ee = {
			handle: function(i) {
				var s = this.rtlTranslate,
					a = i;
				a.originalEvent && (a = a.originalEvent);
				var r = a.keyCode || a.charCode;
				if (!this.allowSlideNext && (this.isHorizontal() && 39 === r || this.isVertical() && 40 === r || 34 === r))
					return !1;
				if (!this.allowSlidePrev && (this.isHorizontal() && 37 === r || this.isVertical() && 38 === r || 33 === r))
					return !1;
				if (!(a.shiftKey || a.altKey || a.ctrlKey || a.metaKey || e.activeElement && e.activeElement.nodeName && (
						"input" === e.activeElement.nodeName.toLowerCase() || "textarea" === e.activeElement.nodeName.toLowerCase()))) {
					if (this.params.keyboard.onlyInViewport && (33 === r || 34 === r || 37 === r || 39 === r || 38 === r || 40 ===
							r)) {
						var n = !1;
						if (this.$el.parents("." + this.params.slideClass).length > 0 && 0 === this.$el.parents("." + this.params.slideActiveClass)
							.length) return;
						var o = t.innerWidth,
							l = t.innerHeight,
							d = this.$el.offset();
						s && (d.left -= this.$el[0].scrollLeft);
						for (var h = [
								[d.left, d.top],
								[d.left + this.width, d.top],
								[d.left, d.top + this.height],
								[d.left + this.width, d.top + this.height]
							], p = 0; p < h.length; p += 1) {
							var c = h[p];
							c[0] >= 0 && c[0] <= o && c[1] >= 0 && c[1] <= l && (n = !0)
						}
						if (!n) return
					}
					this.isHorizontal() ? (33 !== r && 34 !== r && 37 !== r && 39 !== r || (a.preventDefault ? a.preventDefault() :
						a.returnValue = !1), (34 !== r && 39 !== r || s) && (33 !== r && 37 !== r || !s) || this.slideNext(), (33 !==
						r && 37 !== r || s) && (34 !== r && 39 !== r || !s) || this.slidePrev()) : (33 !== r && 34 !== r && 38 !== r &&
						40 !== r || (a.preventDefault ? a.preventDefault() : a.returnValue = !1), 34 !== r && 40 !== r || this.slideNext(),
						33 !== r && 38 !== r || this.slidePrev()), this.emit("keyPress", r)
				}
			},
			enable: function() {
				this.keyboard.enabled || (s(e).on("keydown", this.keyboard.handle), this.keyboard.enabled = !0)
			},
			disable: function() {
				this.keyboard.enabled && (s(e).off("keydown", this.keyboard.handle), this.keyboard.enabled = !1)
			}
		},
		te = {
			name: "keyboard",
			params: {
				keyboard: {
					enabled: !1,
					onlyInViewport: !0
				}
			},
			create: function() {
				n.extend(this, {
					keyboard: {
						enabled: !1,
						enable: ee.enable.bind(this),
						disable: ee.disable.bind(this),
						handle: ee.handle.bind(this)
					}
				})
			},
			on: {
				init: function() {
					this.params.keyboard.enabled && this.keyboard.enable()
				},
				destroy: function() {
					this.keyboard.enabled && this.keyboard.disable()
				}
			}
		};
	var ie = {
			lastScrollTime: n.now(),
			lastEventBeforeSnap: void 0,
			recentWheelEvents: [],
			event: function() {
				return t.navigator.userAgent.indexOf("firefox") > -1 ? "DOMMouseScroll" : function() {
					var t = "onwheel" in e;
					if (!t) {
						var i = e.createElement("div");
						i.setAttribute("onwheel", "return;"), t = "function" == typeof i.onwheel
					}
					return !t && e.implementation && e.implementation.hasFeature && !0 !== e.implementation.hasFeature("", "") &&
						(t = e.implementation.hasFeature("Events.wheel", "3.0")), t
				}() ? "wheel" : "mousewheel"
			},
			normalize: function(e) {
				var t = 0,
					i = 0,
					s = 0,
					a = 0;
				return "detail" in e && (i = e.detail), "wheelDelta" in e && (i = -e.wheelDelta / 120), "wheelDeltaY" in e && (i = -
						e.wheelDeltaY / 120), "wheelDeltaX" in e && (t = -e.wheelDeltaX / 120), "axis" in e && e.axis === e.HORIZONTAL_AXIS &&
					(t = i, i = 0), s = 10 * t, a = 10 * i, "deltaY" in e && (a = e.deltaY), "deltaX" in e && (s = e.deltaX), e.shiftKey &&
					!s && (s = a, a = 0), (s || a) && e.deltaMode && (1 === e.deltaMode ? (s *= 40, a *= 40) : (s *= 800, a *= 800)),
					s && !t && (t = s < 1 ? -1 : 1), a && !i && (i = a < 1 ? -1 : 1), {
						spinX: t,
						spinY: i,
						pixelX: s,
						pixelY: a
					}
			},
			handleMouseEnter: function() {
				this.mouseEntered = !0
			},
			handleMouseLeave: function() {
				this.mouseEntered = !1
			},
			handle: function(e) {
				var i = e,
					s = this,
					a = s.params.mousewheel;
				if (s.params.cssMode && i.preventDefault(), !s.mouseEntered && !a.releaseOnEdges) return !0;
				i.originalEvent && (i = i.originalEvent);
				var r = 0,
					o = s.rtlTranslate ? -1 : 1,
					l = ie.normalize(i);
				if (a.forceToAxis)
					if (s.isHorizontal()) {
						if (!(Math.abs(l.pixelX) > Math.abs(l.pixelY))) return !0;
						r = l.pixelX * o
					} else {
						if (!(Math.abs(l.pixelY) > Math.abs(l.pixelX))) return !0;
						r = l.pixelY
					}
				else r = Math.abs(l.pixelX) > Math.abs(l.pixelY) ? -l.pixelX * o : -l.pixelY;
				if (0 === r) return !0;
				if (a.invert && (r = -r), s.params.freeMode) {
					var d = {
							time: n.now(),
							delta: Math.abs(r),
							direction: Math.sign(r)
						},
						h = s.mousewheel.lastEventBeforeSnap,
						p = h && d.time < h.time + 500 && d.delta <= h.delta && d.direction === h.direction;
					if (!p) {
						s.mousewheel.lastEventBeforeSnap = void 0, s.params.loop && s.loopFix();
						var c = s.getTranslate() + r * a.sensitivity,
							u = s.isBeginning,
							v = s.isEnd;
						if (c >= s.minTranslate() && (c = s.minTranslate()), c <= s.maxTranslate() && (c = s.maxTranslate()), s.setTransition(
								0), s.setTranslate(c), s.updateProgress(), s.updateActiveIndex(), s.updateSlidesClasses(), (!u && s.isBeginning ||
								!v && s.isEnd) && s.updateSlidesClasses(), s.params.freeModeSticky) {
							clearTimeout(s.mousewheel.timeout), s.mousewheel.timeout = void 0;
							var f = s.mousewheel.recentWheelEvents;
							f.length >= 15 && f.shift();
							var m = f.length ? f[f.length - 1] : void 0,
								g = f[0];
							if (f.push(d), m && (d.delta > m.delta || d.direction !== m.direction)) f.splice(0);
							else if (f.length >= 15 && d.time - g.time < 500 && g.delta - d.delta >= 1 && d.delta <= 6) {
								var b = r > 0 ? .8 : .2;
								s.mousewheel.lastEventBeforeSnap = d, f.splice(0), s.mousewheel.timeout = n.nextTick((function() {
									s.slideToClosest(s.params.speed, !0, void 0, b)
								}), 0)
							}
							s.mousewheel.timeout || (s.mousewheel.timeout = n.nextTick((function() {
								s.mousewheel.lastEventBeforeSnap = d, f.splice(0), s.slideToClosest(s.params.speed, !0, void 0, .5)
							}), 500))
						}
						if (p || s.emit("scroll", i), s.params.autoplay && s.params.autoplayDisableOnInteraction && s.autoplay.stop(),
							c === s.minTranslate() || c === s.maxTranslate()) return !0
					}
				} else {
					if (n.now() - s.mousewheel.lastScrollTime > 60)
						if (r < 0)
							if (s.isEnd && !s.params.loop || s.animating) {
								if (a.releaseOnEdges) return !0
							} else s.slideNext(), s.emit("scroll", i);
					else if (s.isBeginning && !s.params.loop || s.animating) {
						if (a.releaseOnEdges) return !0
					} else s.slidePrev(), s.emit("scroll", i);
					s.mousewheel.lastScrollTime = (new t.Date).getTime()
				}
				return i.preventDefault ? i.preventDefault() : i.returnValue = !1, !1
			},
			enable: function() {
				var e = ie.event();
				if (this.params.cssMode) return this.wrapperEl.removeEventListener(e, this.mousewheel.handle), !0;
				if (!e) return !1;
				if (this.mousewheel.enabled) return !1;
				var t = this.$el;
				return "container" !== this.params.mousewheel.eventsTarged && (t = s(this.params.mousewheel.eventsTarged)), t.on(
					"mouseenter", this.mousewheel.handleMouseEnter), t.on("mouseleave", this.mousewheel.handleMouseLeave), t.on(e,
					this.mousewheel.handle), this.mousewheel.enabled = !0, !0
			},
			disable: function() {
				var e = ie.event();
				if (this.params.cssMode) return this.wrapperEl.addEventListener(e, this.mousewheel.handle), !0;
				if (!e) return !1;
				if (!this.mousewheel.enabled) return !1;
				var t = this.$el;
				return "container" !== this.params.mousewheel.eventsTarged && (t = s(this.params.mousewheel.eventsTarged)), t.off(
					e, this.mousewheel.handle), this.mousewheel.enabled = !1, !0
			}
		},
		se = {
			update: function() {
				var e = this.params.navigation;
				if (!this.params.loop) {
					var t = this.navigation,
						i = t.$nextEl,
						s = t.$prevEl;
					s && s.length > 0 && (this.isBeginning ? s.addClass(e.disabledClass) : s.removeClass(e.disabledClass), s[this.params
						.watchOverflow && this.isLocked ? "addClass" : "removeClass"](e.lockClass)), i && i.length > 0 && (this.isEnd ?
						i.addClass(e.disabledClass) : i.removeClass(e.disabledClass), i[this.params.watchOverflow && this.isLocked ?
							"addClass" : "removeClass"](e.lockClass))
				}
			},
			onPrevClick: function(e) {
				e.preventDefault(), this.isBeginning && !this.params.loop || this.slidePrev()
			},
			onNextClick: function(e) {
				e.preventDefault(), this.isEnd && !this.params.loop || this.slideNext()
			},
			init: function() {
				var e, t, i = this.params.navigation;
				(i.nextEl || i.prevEl) && (i.nextEl && (e = s(i.nextEl), this.params.uniqueNavElements && "string" == typeof i.nextEl &&
						e.length > 1 && 1 === this.$el.find(i.nextEl).length && (e = this.$el.find(i.nextEl))), i.prevEl && (t = s(i.prevEl),
						this.params.uniqueNavElements && "string" == typeof i.prevEl && t.length > 1 && 1 === this.$el.find(i.prevEl).length &&
						(t = this.$el.find(i.prevEl))), e && e.length > 0 && e.on("click", this.navigation.onNextClick), t && t.length >
					0 && t.on("click", this.navigation.onPrevClick), n.extend(this.navigation, {
						$nextEl: e,
						nextEl: e && e[0],
						$prevEl: t,
						prevEl: t && t[0]
					}))
			},
			destroy: function() {
				var e = this.navigation,
					t = e.$nextEl,
					i = e.$prevEl;
				t && t.length && (t.off("click", this.navigation.onNextClick), t.removeClass(this.params.navigation.disabledClass)),
					i && i.length && (i.off("click", this.navigation.onPrevClick), i.removeClass(this.params.navigation.disabledClass))
			}
		},
		ae = {
			update: function() {
				var e = this.rtl,
					t = this.params.pagination;
				if (t.el && this.pagination.el && this.pagination.$el && 0 !== this.pagination.$el.length) {
					var i, a = this.virtual && this.params.virtual.enabled ? this.virtual.slides.length : this.slides.length,
						r = this.pagination.$el,
						n = this.params.loop ? Math.ceil((a - 2 * this.loopedSlides) / this.params.slidesPerGroup) : this.snapGrid.length;
					if (this.params.loop ? ((i = Math.ceil((this.activeIndex - this.loopedSlides) / this.params.slidesPerGroup)) >
							a - 1 - 2 * this.loopedSlides && (i -= a - 2 * this.loopedSlides), i > n - 1 && (i -= n), i < 0 && "bullets" !==
							this.params.paginationType && (i = n + i)) : i = void 0 !== this.snapIndex ? this.snapIndex : this.activeIndex ||
						0, "bullets" === t.type && this.pagination.bullets && this.pagination.bullets.length > 0) {
						var o, l, d, h = this.pagination.bullets;
						if (t.dynamicBullets && (this.pagination.bulletSize = h.eq(0)[this.isHorizontal() ? "outerWidth" :
								"outerHeight"](!0), r.css(this.isHorizontal() ? "width" : "height", this.pagination.bulletSize * (t.dynamicMainBullets +
								4) + "px"), t.dynamicMainBullets > 1 && void 0 !== this.previousIndex && (this.pagination.dynamicBulletIndex +=
								i - this.previousIndex, this.pagination.dynamicBulletIndex > t.dynamicMainBullets - 1 ? this.pagination.dynamicBulletIndex =
								t.dynamicMainBullets - 1 : this.pagination.dynamicBulletIndex < 0 && (this.pagination.dynamicBulletIndex =
									0)), o = i - this.pagination.dynamicBulletIndex, d = ((l = o + (Math.min(h.length, t.dynamicMainBullets) -
								1)) + o) / 2), h.removeClass(t.bulletActiveClass + " " + t.bulletActiveClass + "-next " + t.bulletActiveClass +
								"-next-next " + t.bulletActiveClass + "-prev " + t.bulletActiveClass + "-prev-prev " + t.bulletActiveClass +
								"-main"), r.length > 1) h.each((function(e, a) {
							var r = s(a),
								n = r.index();
							n === i && r.addClass(t.bulletActiveClass), t.dynamicBullets && (n >= o && n <= l && r.addClass(t.bulletActiveClass +
								"-main"), n === o && r.prev().addClass(t.bulletActiveClass + "-prev").prev().addClass(t.bulletActiveClass +
								"-prev-prev"), n === l && r.next().addClass(t.bulletActiveClass + "-next").next().addClass(t.bulletActiveClass +
								"-next-next"))
						}));
						else {
							var p = h.eq(i),
								c = p.index();
							if (p.addClass(t.bulletActiveClass), t.dynamicBullets) {
								for (var u = h.eq(o), v = h.eq(l), f = o; f <= l; f += 1) h.eq(f).addClass(t.bulletActiveClass + "-main");
								if (this.params.loop)
									if (c >= h.length - t.dynamicMainBullets) {
										for (var m = t.dynamicMainBullets; m >= 0; m -= 1) h.eq(h.length - m).addClass(t.bulletActiveClass +
											"-main");
										h.eq(h.length - t.dynamicMainBullets - 1).addClass(t.bulletActiveClass + "-prev")
									} else u.prev().addClass(t.bulletActiveClass + "-prev").prev().addClass(t.bulletActiveClass + "-prev-prev"),
										v.next().addClass(t.bulletActiveClass + "-next").next().addClass(t.bulletActiveClass + "-next-next");
								else u.prev().addClass(t.bulletActiveClass + "-prev").prev().addClass(t.bulletActiveClass + "-prev-prev"), v
									.next().addClass(t.bulletActiveClass + "-next").next().addClass(t.bulletActiveClass + "-next-next")
							}
						}
						if (t.dynamicBullets) {
							var g = Math.min(h.length, t.dynamicMainBullets + 4),
								b = (this.pagination.bulletSize * g - this.pagination.bulletSize) / 2 - d * this.pagination.bulletSize,
								w = e ? "right" : "left";
							h.css(this.isHorizontal() ? w : "top", b + "px")
						}
					}
					if ("fraction" === t.type && (r.find("." + t.currentClass).text(t.formatFractionCurrent(i + 1)), r.find("." + t
							.totalClass).text(t.formatFractionTotal(n))), "progressbar" === t.type) {
						var y;
						y = t.progressbarOpposite ? this.isHorizontal() ? "vertical" : "horizontal" : this.isHorizontal() ?
							"horizontal" : "vertical";
						var x = (i + 1) / n,
							T = 1,
							E = 1;
						"horizontal" === y ? T = x : E = x, r.find("." + t.progressbarFillClass).transform(
							"translate3d(0,0,0) scaleX(" + T + ") scaleY(" + E + ")").transition(this.params.speed)
					}
					"custom" === t.type && t.renderCustom ? (r.html(t.renderCustom(this, i + 1, n)), this.emit("paginationRender",
						this, r[0])) : this.emit("paginationUpdate", this, r[0]), r[this.params.watchOverflow && this.isLocked ?
						"addClass" : "removeClass"](t.lockClass)
				}
			},
			render: function() {
				var e = this.params.pagination;
				if (e.el && this.pagination.el && this.pagination.$el && 0 !== this.pagination.$el.length) {
					var t = this.virtual && this.params.virtual.enabled ? this.virtual.slides.length : this.slides.length,
						i = this.pagination.$el,
						s = "";
					if ("bullets" === e.type) {
						for (var a = this.params.loop ? Math.ceil((t - 2 * this.loopedSlides) / this.params.slidesPerGroup) : this.snapGrid
								.length, r = 0; r < a; r += 1) e.renderBullet ? s += e.renderBullet.call(this, r, e.bulletClass) : s += "<" +
							e.bulletElement + ' class="' + e.bulletClass + '"></' + e.bulletElement + ">";
						i.html(s), this.pagination.bullets = i.find("." + e.bulletClass)
					}
					"fraction" === e.type && (s = e.renderFraction ? e.renderFraction.call(this, e.currentClass, e.totalClass) :
							'<span class="' + e.currentClass + '"></span> / <span class="' + e.totalClass + '"></span>', i.html(s)),
						"progressbar" === e.type && (s = e.renderProgressbar ? e.renderProgressbar.call(this, e.progressbarFillClass) :
							'<span class="' + e.progressbarFillClass + '"></span>', i.html(s)), "custom" !== e.type && this.emit(
							"paginationRender", this.pagination.$el[0])
				}
			},
			init: function() {
				var e = this,
					t = e.params.pagination;
				if (t.el) {
					var i = s(t.el);
					0 !== i.length && (e.params.uniqueNavElements && "string" == typeof t.el && i.length > 1 && 1 === e.$el.find(t.el)
						.length && (i = e.$el.find(t.el)), "bullets" === t.type && t.clickable && i.addClass(t.clickableClass), i.addClass(
							t.modifierClass + t.type), "bullets" === t.type && t.dynamicBullets && (i.addClass("" + t.modifierClass + t.type +
							"-dynamic"), e.pagination.dynamicBulletIndex = 0, t.dynamicMainBullets < 1 && (t.dynamicMainBullets = 1)),
						"progressbar" === t.type && t.progressbarOpposite && i.addClass(t.progressbarOppositeClass), t.clickable && i
						.on("click", "." + t.bulletClass, (function(t) {
							t.preventDefault();
							var i = s(this).index() * e.params.slidesPerGroup;
							e.params.loop && (i += e.loopedSlides), e.slideTo(i)
						})), n.extend(e.pagination, {
							$el: i,
							el: i[0]
						}))
				}
			},
			destroy: function() {
				var e = this.params.pagination;
				if (e.el && this.pagination.el && this.pagination.$el && 0 !== this.pagination.$el.length) {
					var t = this.pagination.$el;
					t.removeClass(e.hiddenClass), t.removeClass(e.modifierClass + e.type), this.pagination.bullets && this.pagination
						.bullets.removeClass(e.bulletActiveClass), e.clickable && t.off("click", "." + e.bulletClass)
				}
			}
		},
		re = {
			setTranslate: function() {
				if (this.params.scrollbar.el && this.scrollbar.el) {
					var e = this.scrollbar,
						t = this.rtlTranslate,
						i = this.progress,
						s = e.dragSize,
						a = e.trackSize,
						r = e.$dragEl,
						n = e.$el,
						o = this.params.scrollbar,
						l = s,
						d = (a - s) * i;
					t ? (d = -d) > 0 ? (l = s - d, d = 0) : -d + s > a && (l = a + d) : d < 0 ? (l = s + d, d = 0) : d + s > a && (
							l = a - d), this.isHorizontal() ? (r.transform("translate3d(" + d + "px, 0, 0)"), r[0].style.width = l + "px") :
						(r.transform("translate3d(0px, " + d + "px, 0)"), r[0].style.height = l + "px"), o.hide && (clearTimeout(this.scrollbar
							.timeout), n[0].style.opacity = 1, this.scrollbar.timeout = setTimeout((function() {
							n[0].style.opacity = 0, n.transition(400)
						}), 1e3))
				}
			},
			setTransition: function(e) {
				this.params.scrollbar.el && this.scrollbar.el && this.scrollbar.$dragEl.transition(e)
			},
			updateSize: function() {
				if (this.params.scrollbar.el && this.scrollbar.el) {
					var e = this.scrollbar,
						t = e.$dragEl,
						i = e.$el;
					t[0].style.width = "", t[0].style.height = "";
					var s, a = this.isHorizontal() ? i[0].offsetWidth : i[0].offsetHeight,
						r = this.size / this.virtualSize,
						o = r * (a / this.size);
					s = "auto" === this.params.scrollbar.dragSize ? a * r : parseInt(this.params.scrollbar.dragSize, 10), this.isHorizontal() ?
						t[0].style.width = s + "px" : t[0].style.height = s + "px", i[0].style.display = r >= 1 ? "none" : "", this.params
						.scrollbar.hide && (i[0].style.opacity = 0), n.extend(e, {
							trackSize: a,
							divider: r,
							moveDivider: o,
							dragSize: s
						}), e.$el[this.params.watchOverflow && this.isLocked ? "addClass" : "removeClass"](this.params.scrollbar.lockClass)
				}
			},
			getPointerPosition: function(e) {
				return this.isHorizontal() ? "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].clientX : e.clientX :
					"touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].clientY : e.clientY
			},
			setDragPosition: function(e) {
				var t, i = this.scrollbar,
					s = this.rtlTranslate,
					a = i.$el,
					r = i.dragSize,
					n = i.trackSize,
					o = i.dragStartPos;
				t = (i.getPointerPosition(e) - a.offset()[this.isHorizontal() ? "left" : "top"] - (null !== o ? o : r / 2)) / (n -
					r), t = Math.max(Math.min(t, 1), 0), s && (t = 1 - t);
				var l = this.minTranslate() + (this.maxTranslate() - this.minTranslate()) * t;
				this.updateProgress(l), this.setTranslate(l), this.updateActiveIndex(), this.updateSlidesClasses()
			},
			onDragStart: function(e) {
				var t = this.params.scrollbar,
					i = this.scrollbar,
					s = this.$wrapperEl,
					a = i.$el,
					r = i.$dragEl;
				this.scrollbar.isTouched = !0, this.scrollbar.dragStartPos = e.target === r[0] || e.target === r ? i.getPointerPosition(
						e) - e.target.getBoundingClientRect()[this.isHorizontal() ? "left" : "top"] : null, e.preventDefault(), e.stopPropagation(),
					s.transition(100), r.transition(100), i.setDragPosition(e), clearTimeout(this.scrollbar.dragTimeout), a.transition(
						0), t.hide && a.css("opacity", 1), this.params.cssMode && this.$wrapperEl.css("scroll-snap-type", "none"),
					this.emit("scrollbarDragStart", e)
			},
			onDragMove: function(e) {
				var t = this.scrollbar,
					i = this.$wrapperEl,
					s = t.$el,
					a = t.$dragEl;
				this.scrollbar.isTouched && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, t.setDragPosition(e), i
					.transition(0), s.transition(0), a.transition(0), this.emit("scrollbarDragMove", e))
			},
			onDragEnd: function(e) {
				var t = this.params.scrollbar,
					i = this.scrollbar,
					s = this.$wrapperEl,
					a = i.$el;
				this.scrollbar.isTouched && (this.scrollbar.isTouched = !1, this.params.cssMode && (this.$wrapperEl.css(
					"scroll-snap-type", ""), s.transition("")), t.hide && (clearTimeout(this.scrollbar.dragTimeout), this.scrollbar
					.dragTimeout = n.nextTick((function() {
						a.css("opacity", 0), a.transition(400)
					}), 1e3)), this.emit("scrollbarDragEnd", e), t.snapOnRelease && this.slideToClosest())
			},
			enableDraggable: function() {
				if (this.params.scrollbar.el) {
					var t = this.scrollbar,
						i = this.touchEventsTouch,
						s = this.touchEventsDesktop,
						a = this.params,
						r = t.$el[0],
						n = !(!o.passiveListener || !a.passiveListeners) && {
							passive: !1,
							capture: !1
						},
						l = !(!o.passiveListener || !a.passiveListeners) && {
							passive: !0,
							capture: !1
						};
					o.touch ? (r.addEventListener(i.start, this.scrollbar.onDragStart, n), r.addEventListener(i.move, this.scrollbar
						.onDragMove, n), r.addEventListener(i.end, this.scrollbar.onDragEnd, l)) : (r.addEventListener(s.start, this.scrollbar
						.onDragStart, n), e.addEventListener(s.move, this.scrollbar.onDragMove, n), e.addEventListener(s.end, this.scrollbar
						.onDragEnd, l))
				}
			},
			disableDraggable: function() {
				if (this.params.scrollbar.el) {
					var t = this.scrollbar,
						i = this.touchEventsTouch,
						s = this.touchEventsDesktop,
						a = this.params,
						r = t.$el[0],
						n = !(!o.passiveListener || !a.passiveListeners) && {
							passive: !1,
							capture: !1
						},
						l = !(!o.passiveListener || !a.passiveListeners) && {
							passive: !0,
							capture: !1
						};
					o.touch ? (r.removeEventListener(i.start, this.scrollbar.onDragStart, n), r.removeEventListener(i.move, this.scrollbar
						.onDragMove, n), r.removeEventListener(i.end, this.scrollbar.onDragEnd, l)) : (r.removeEventListener(s.start,
						this.scrollbar.onDragStart, n), e.removeEventListener(s.move, this.scrollbar.onDragMove, n), e.removeEventListener(
						s.end, this.scrollbar.onDragEnd, l))
				}
			},
			init: function() {
				if (this.params.scrollbar.el) {
					var e = this.scrollbar,
						t = this.$el,
						i = this.params.scrollbar,
						a = s(i.el);
					this.params.uniqueNavElements && "string" == typeof i.el && a.length > 1 && 1 === t.find(i.el).length && (a = t
						.find(i.el));
					var r = a.find("." + this.params.scrollbar.dragClass);
					0 === r.length && (r = s('<div class="' + this.params.scrollbar.dragClass + '"></div>'), a.append(r)), n.extend(
						e, {
							$el: a,
							el: a[0],
							$dragEl: r,
							dragEl: r[0]
						}), i.draggable && e.enableDraggable()
				}
			},
			destroy: function() {
				this.scrollbar.disableDraggable()
			}
		},
		ne = {
			setTransform: function(e, t) {
				var i = this.rtl,
					a = s(e),
					r = i ? -1 : 1,
					n = a.attr("data-swiper-parallax") || "0",
					o = a.attr("data-swiper-parallax-x"),
					l = a.attr("data-swiper-parallax-y"),
					d = a.attr("data-swiper-parallax-scale"),
					h = a.attr("data-swiper-parallax-opacity");
				if (o || l ? (o = o || "0", l = l || "0") : this.isHorizontal() ? (o = n, l = "0") : (l = n, o = "0"), o = o.indexOf(
						"%") >= 0 ? parseInt(o, 10) * t * r + "%" : o * t * r + "px", l = l.indexOf("%") >= 0 ? parseInt(l, 10) * t +
					"%" : l * t + "px", null != h) {
					var p = h - (h - 1) * (1 - Math.abs(t));
					a[0].style.opacity = p
				}
				if (null == d) a.transform("translate3d(" + o + ", " + l + ", 0px)");
				else {
					var c = d - (d - 1) * (1 - Math.abs(t));
					a.transform("translate3d(" + o + ", " + l + ", 0px) scale(" + c + ")")
				}
			},
			setTranslate: function() {
				var e = this,
					t = e.$el,
					i = e.slides,
					a = e.progress,
					r = e.snapGrid;
				t.children(
					"[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]"
				).each((function(t, i) {
					e.parallax.setTransform(i, a)
				})), i.each((function(t, i) {
					var n = i.progress;
					e.params.slidesPerGroup > 1 && "auto" !== e.params.slidesPerView && (n += Math.ceil(t / 2) - a * (r.length -
						1)), n = Math.min(Math.max(n, -1), 1), s(i).find(
						"[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]"
					).each((function(t, i) {
						e.parallax.setTransform(i, n)
					}))
				}))
			},
			setTransition: function(e) {
				void 0 === e && (e = this.params.speed);
				this.$el.find(
					"[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]"
				).each((function(t, i) {
					var a = s(i),
						r = parseInt(a.attr("data-swiper-parallax-duration"), 10) || e;
					0 === e && (r = 0), a.transition(r)
				}))
			}
		},
		oe = {
			getDistanceBetweenTouches: function(e) {
				if (e.targetTouches.length < 2) return 1;
				var t = e.targetTouches[0].pageX,
					i = e.targetTouches[0].pageY,
					s = e.targetTouches[1].pageX,
					a = e.targetTouches[1].pageY;
				return Math.sqrt(Math.pow(s - t, 2) + Math.pow(a - i, 2))
			},
			onGestureStart: function(e) {
				var t = this.params.zoom,
					i = this.zoom,
					a = i.gesture;
				if (i.fakeGestureTouched = !1, i.fakeGestureMoved = !1, !o.gestures) {
					if ("touchstart" !== e.type || "touchstart" === e.type && e.targetTouches.length < 2) return;
					i.fakeGestureTouched = !0, a.scaleStart = oe.getDistanceBetweenTouches(e)
				}
				a.$slideEl && a.$slideEl.length || (a.$slideEl = s(e.target).closest(".swiper-slide"), 0 === a.$slideEl.length &&
					(a.$slideEl = this.slides.eq(this.activeIndex)), a.$imageEl = a.$slideEl.find("img, svg, canvas"), a.$imageWrapEl =
					a.$imageEl.parent("." + t.containerClass), a.maxRatio = a.$imageWrapEl.attr("data-swiper-zoom") || t.maxRatio,
					0 !== a.$imageWrapEl.length) ? (a.$imageEl.transition(0), this.zoom.isScaling = !0) : a.$imageEl = void 0
			},
			onGestureChange: function(e) {
				var t = this.params.zoom,
					i = this.zoom,
					s = i.gesture;
				if (!o.gestures) {
					if ("touchmove" !== e.type || "touchmove" === e.type && e.targetTouches.length < 2) return;
					i.fakeGestureMoved = !0, s.scaleMove = oe.getDistanceBetweenTouches(e)
				}
				s.$imageEl && 0 !== s.$imageEl.length && (o.gestures ? i.scale = e.scale * i.currentScale : i.scale = s.scaleMove /
					s.scaleStart * i.currentScale, i.scale > s.maxRatio && (i.scale = s.maxRatio - 1 + Math.pow(i.scale - s.maxRatio +
						1, .5)), i.scale < t.minRatio && (i.scale = t.minRatio + 1 - Math.pow(t.minRatio - i.scale + 1, .5)), s.$imageEl
					.transform("translate3d(0,0,0) scale(" + i.scale + ")"))
			},
			onGestureEnd: function(e) {
				var t = this.params.zoom,
					i = this.zoom,
					s = i.gesture;
				if (!o.gestures) {
					if (!i.fakeGestureTouched || !i.fakeGestureMoved) return;
					if ("touchend" !== e.type || "touchend" === e.type && e.changedTouches.length < 2 && !I.android) return;
					i.fakeGestureTouched = !1, i.fakeGestureMoved = !1
				}
				s.$imageEl && 0 !== s.$imageEl.length && (i.scale = Math.max(Math.min(i.scale, s.maxRatio), t.minRatio), s.$imageEl
					.transition(this.params.speed).transform("translate3d(0,0,0) scale(" + i.scale + ")"), i.currentScale = i.scale,
					i.isScaling = !1, 1 === i.scale && (s.$slideEl = void 0))
			},
			onTouchStart: function(e) {
				var t = this.zoom,
					i = t.gesture,
					s = t.image;
				i.$imageEl && 0 !== i.$imageEl.length && (s.isTouched || (I.android && e.preventDefault(), s.isTouched = !0, s.touchesStart
					.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, s.touchesStart.y = "touchstart" === e.type ?
					e.targetTouches[0].pageY : e.pageY))
			},
			onTouchMove: function(e) {
				var t = this.zoom,
					i = t.gesture,
					s = t.image,
					a = t.velocity;
				if (i.$imageEl && 0 !== i.$imageEl.length && (this.allowClick = !1, s.isTouched && i.$slideEl)) {
					s.isMoved || (s.width = i.$imageEl[0].offsetWidth, s.height = i.$imageEl[0].offsetHeight, s.startX = n.getTranslate(
						i.$imageWrapEl[0], "x") || 0, s.startY = n.getTranslate(i.$imageWrapEl[0], "y") || 0, i.slideWidth = i.$slideEl[
						0].offsetWidth, i.slideHeight = i.$slideEl[0].offsetHeight, i.$imageWrapEl.transition(0), this.rtl && (s.startX = -
						s.startX, s.startY = -s.startY));
					var r = s.width * t.scale,
						o = s.height * t.scale;
					if (!(r < i.slideWidth && o < i.slideHeight)) {
						if (s.minX = Math.min(i.slideWidth / 2 - r / 2, 0), s.maxX = -s.minX, s.minY = Math.min(i.slideHeight / 2 - o /
								2, 0), s.maxY = -s.minY, s.touchesCurrent.x = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, s
							.touchesCurrent.y = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, !s.isMoved && !t.isScaling) {
							if (this.isHorizontal() && (Math.floor(s.minX) === Math.floor(s.startX) && s.touchesCurrent.x < s.touchesStart
									.x || Math.floor(s.maxX) === Math.floor(s.startX) && s.touchesCurrent.x > s.touchesStart.x)) return void(s.isTouched = !
								1);
							if (!this.isHorizontal() && (Math.floor(s.minY) === Math.floor(s.startY) && s.touchesCurrent.y < s.touchesStart
									.y || Math.floor(s.maxY) === Math.floor(s.startY) && s.touchesCurrent.y > s.touchesStart.y)) return void(s.isTouched = !
								1)
						}
						e.preventDefault(), e.stopPropagation(), s.isMoved = !0, s.currentX = s.touchesCurrent.x - s.touchesStart.x +
							s.startX, s.currentY = s.touchesCurrent.y - s.touchesStart.y + s.startY, s.currentX < s.minX && (s.currentX =
								s.minX + 1 - Math.pow(s.minX - s.currentX + 1, .8)), s.currentX > s.maxX && (s.currentX = s.maxX - 1 + Math.pow(
								s.currentX - s.maxX + 1, .8)), s.currentY < s.minY && (s.currentY = s.minY + 1 - Math.pow(s.minY - s.currentY +
								1, .8)), s.currentY > s.maxY && (s.currentY = s.maxY - 1 + Math.pow(s.currentY - s.maxY + 1, .8)), a.prevPositionX ||
							(a.prevPositionX = s.touchesCurrent.x), a.prevPositionY || (a.prevPositionY = s.touchesCurrent.y), a.prevTime ||
							(a.prevTime = Date.now()), a.x = (s.touchesCurrent.x - a.prevPositionX) / (Date.now() - a.prevTime) / 2, a.y =
							(s.touchesCurrent.y - a.prevPositionY) / (Date.now() - a.prevTime) / 2, Math.abs(s.touchesCurrent.x - a.prevPositionX) <
							2 && (a.x = 0), Math.abs(s.touchesCurrent.y - a.prevPositionY) < 2 && (a.y = 0), a.prevPositionX = s.touchesCurrent
							.x, a.prevPositionY = s.touchesCurrent.y, a.prevTime = Date.now(), i.$imageWrapEl.transform("translate3d(" +
								s.currentX + "px, " + s.currentY + "px,0)")
					}
				}
			},
			onTouchEnd: function() {
				var e = this.zoom,
					t = e.gesture,
					i = e.image,
					s = e.velocity;
				if (t.$imageEl && 0 !== t.$imageEl.length) {
					if (!i.isTouched || !i.isMoved) return i.isTouched = !1, void(i.isMoved = !1);
					i.isTouched = !1, i.isMoved = !1;
					var a = 300,
						r = 300,
						n = s.x * a,
						o = i.currentX + n,
						l = s.y * r,
						d = i.currentY + l;
					0 !== s.x && (a = Math.abs((o - i.currentX) / s.x)), 0 !== s.y && (r = Math.abs((d - i.currentY) / s.y));
					var h = Math.max(a, r);
					i.currentX = o, i.currentY = d;
					var p = i.width * e.scale,
						c = i.height * e.scale;
					i.minX = Math.min(t.slideWidth / 2 - p / 2, 0), i.maxX = -i.minX, i.minY = Math.min(t.slideHeight / 2 - c / 2,
						0), i.maxY = -i.minY, i.currentX = Math.max(Math.min(i.currentX, i.maxX), i.minX), i.currentY = Math.max(Math
						.min(i.currentY, i.maxY), i.minY), t.$imageWrapEl.transition(h).transform("translate3d(" + i.currentX +
						"px, " + i.currentY + "px,0)")
				}
			},
			onTransitionEnd: function() {
				var e = this.zoom,
					t = e.gesture;
				t.$slideEl && this.previousIndex !== this.activeIndex && (t.$imageEl.transform("translate3d(0,0,0) scale(1)"), t
					.$imageWrapEl.transform("translate3d(0,0,0)"), e.scale = 1, e.currentScale = 1, t.$slideEl = void 0, t.$imageEl =
					void 0, t.$imageWrapEl = void 0)
			},
			toggle: function(e) {
				var t = this.zoom;
				t.scale && 1 !== t.scale ? t.out() : t.in(e)
			},
			in: function(e) {
				var t, i, a, r, n, o, l, d, h, p, c, u, v, f, m, g, b = this.zoom,
					w = this.params.zoom,
					y = b.gesture,
					x = b.image;
				(y.$slideEl || (y.$slideEl = this.clickedSlide ? s(this.clickedSlide) : this.slides.eq(this.activeIndex), y.$imageEl =
						y.$slideEl.find("img, svg, canvas"), y.$imageWrapEl = y.$imageEl.parent("." + w.containerClass)), y.$imageEl &&
					0 !== y.$imageEl.length) && (y.$slideEl.addClass("" + w.zoomedSlideClass), void 0 === x.touchesStart.x && e ? (
						t = "touchend" === e.type ? e.changedTouches[0].pageX : e.pageX, i = "touchend" === e.type ? e.changedTouches[
							0].pageY : e.pageY) : (t = x.touchesStart.x, i = x.touchesStart.y), b.scale = y.$imageWrapEl.attr(
						"data-swiper-zoom") || w.maxRatio, b.currentScale = y.$imageWrapEl.attr("data-swiper-zoom") || w.maxRatio, e ?
					(m = y.$slideEl[0].offsetWidth, g = y.$slideEl[0].offsetHeight, a = y.$slideEl.offset().left + m / 2 - t, r = y
						.$slideEl.offset().top + g / 2 - i, l = y.$imageEl[0].offsetWidth, d = y.$imageEl[0].offsetHeight, h = l * b.scale,
						p = d * b.scale, v = -(c = Math.min(m / 2 - h / 2, 0)), f = -(u = Math.min(g / 2 - p / 2, 0)), (n = a * b.scale) <
						c && (n = c), n > v && (n = v), (o = r * b.scale) < u && (o = u), o > f && (o = f)) : (n = 0, o = 0), y.$imageWrapEl
					.transition(300).transform("translate3d(" + n + "px, " + o + "px,0)"), y.$imageEl.transition(300).transform(
						"translate3d(0,0,0) scale(" + b.scale + ")"))
			},
			out: function() {
				var e = this.zoom,
					t = this.params.zoom,
					i = e.gesture;
				i.$slideEl || (i.$slideEl = this.clickedSlide ? s(this.clickedSlide) : this.slides.eq(this.activeIndex), i.$imageEl =
						i.$slideEl.find("img, svg, canvas"), i.$imageWrapEl = i.$imageEl.parent("." + t.containerClass)), i.$imageEl &&
					0 !== i.$imageEl.length && (e.scale = 1, e.currentScale = 1, i.$imageWrapEl.transition(300).transform(
						"translate3d(0,0,0)"), i.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)"), i.$slideEl.removeClass(
						"" + t.zoomedSlideClass), i.$slideEl = void 0)
			},
			enable: function() {
				var e = this.zoom;
				if (!e.enabled) {
					e.enabled = !0;
					var t = !("touchstart" !== this.touchEvents.start || !o.passiveListener || !this.params.passiveListeners) && {
							passive: !0,
							capture: !1
						},
						i = !o.passiveListener || {
							passive: !1,
							capture: !0
						};
					o.gestures ? (this.$wrapperEl.on("gesturestart", ".swiper-slide", e.onGestureStart, t), this.$wrapperEl.on(
						"gesturechange", ".swiper-slide", e.onGestureChange, t), this.$wrapperEl.on("gestureend", ".swiper-slide", e
						.onGestureEnd, t)) : "touchstart" === this.touchEvents.start && (this.$wrapperEl.on(this.touchEvents.start,
							".swiper-slide", e.onGestureStart, t), this.$wrapperEl.on(this.touchEvents.move, ".swiper-slide", e.onGestureChange,
							i), this.$wrapperEl.on(this.touchEvents.end, ".swiper-slide", e.onGestureEnd, t), this.touchEvents.cancel &&
						this.$wrapperEl.on(this.touchEvents.cancel, ".swiper-slide", e.onGestureEnd, t)), this.$wrapperEl.on(this.touchEvents
						.move, "." + this.params.zoom.containerClass, e.onTouchMove, i)
				}
			},
			disable: function() {
				var e = this.zoom;
				if (e.enabled) {
					this.zoom.enabled = !1;
					var t = !("touchstart" !== this.touchEvents.start || !o.passiveListener || !this.params.passiveListeners) && {
							passive: !0,
							capture: !1
						},
						i = !o.passiveListener || {
							passive: !1,
							capture: !0
						};
					o.gestures ? (this.$wrapperEl.off("gesturestart", ".swiper-slide", e.onGestureStart, t), this.$wrapperEl.off(
						"gesturechange", ".swiper-slide", e.onGestureChange, t), this.$wrapperEl.off("gestureend", ".swiper-slide",
						e.onGestureEnd, t)) : "touchstart" === this.touchEvents.start && (this.$wrapperEl.off(this.touchEvents.start,
							".swiper-slide", e.onGestureStart, t), this.$wrapperEl.off(this.touchEvents.move, ".swiper-slide", e.onGestureChange,
							i), this.$wrapperEl.off(this.touchEvents.end, ".swiper-slide", e.onGestureEnd, t), this.touchEvents.cancel &&
						this.$wrapperEl.off(this.touchEvents.cancel, ".swiper-slide", e.onGestureEnd, t)), this.$wrapperEl.off(this.touchEvents
						.move, "." + this.params.zoom.containerClass, e.onTouchMove, i)
				}
			}
		},
		le = {
			loadInSlide: function(e, t) {
				void 0 === t && (t = !0);
				var i = this,
					a = i.params.lazy;
				if (void 0 !== e && 0 !== i.slides.length) {
					var r = i.virtual && i.params.virtual.enabled ? i.$wrapperEl.children("." + i.params.slideClass +
							'[data-swiper-slide-index="' + e + '"]') : i.slides.eq(e),
						n = r.find("." + a.elementClass + ":not(." + a.loadedClass + "):not(." + a.loadingClass + ")");
					!r.hasClass(a.elementClass) || r.hasClass(a.loadedClass) || r.hasClass(a.loadingClass) || (n = n.add(r[0])), 0 !==
						n.length && n.each((function(e, n) {
							var o = s(n);
							o.addClass(a.loadingClass);
							var l = o.attr("data-background"),
								d = o.attr("data-src"),
								h = o.attr("data-srcset"),
								p = o.attr("data-sizes");
							i.loadImage(o[0], d || l, h, p, !1, (function() {
								if (null != i && i && (!i || i.params) && !i.destroyed) {
									if (l ? (o.css("background-image", 'url("' + l + '")'), o.removeAttr("data-background")) : (h && (o.attr(
												"srcset", h), o.removeAttr("data-srcset")), p && (o.attr("sizes", p), o.removeAttr("data-sizes")),
											d && (o.attr("src", d), o.removeAttr("data-src"))), o.addClass(a.loadedClass).removeClass(a.loadingClass),
										r.find("." + a.preloaderClass).remove(), i.params.loop && t) {
										var e = r.attr("data-swiper-slide-index");
										if (r.hasClass(i.params.slideDuplicateClass)) {
											var s = i.$wrapperEl.children('[data-swiper-slide-index="' + e + '"]:not(.' + i.params.slideDuplicateClass +
												")");
											i.lazy.loadInSlide(s.index(), !1)
										} else {
											var n = i.$wrapperEl.children("." + i.params.slideDuplicateClass + '[data-swiper-slide-index="' + e +
												'"]');
											i.lazy.loadInSlide(n.index(), !1)
										}
									}
									i.emit("lazyImageReady", r[0], o[0])
								}
							})), i.emit("lazyImageLoad", r[0], o[0])
						}))
				}
			},
			load: function() {
				var e = this,
					t = e.$wrapperEl,
					i = e.params,
					a = e.slides,
					r = e.activeIndex,
					n = e.virtual && i.virtual.enabled,
					o = i.lazy,
					l = i.slidesPerView;

				function d(e) {
					if (n) {
						if (t.children("." + i.slideClass + '[data-swiper-slide-index="' + e + '"]').length) return !0
					} else if (a[e]) return !0;
					return !1
				}

				function h(e) {
					return n ? s(e).attr("data-swiper-slide-index") : s(e).index()
				}
				if ("auto" === l && (l = 0), e.lazy.initialImageLoaded || (e.lazy.initialImageLoaded = !0), e.params.watchSlidesVisibility)
					t.children("." + i.slideVisibleClass).each((function(t, i) {
						var a = n ? s(i).attr("data-swiper-slide-index") : s(i).index();
						e.lazy.loadInSlide(a)
					}));
				else if (l > 1)
					for (var p = r; p < r + l; p += 1) d(p) && e.lazy.loadInSlide(p);
				else e.lazy.loadInSlide(r);
				if (o.loadPrevNext)
					if (l > 1 || o.loadPrevNextAmount && o.loadPrevNextAmount > 1) {
						for (var c = o.loadPrevNextAmount, u = l, v = Math.min(r + u + Math.max(c, u), a.length), f = Math.max(r -
								Math.max(u, c), 0), m = r + l; m < v; m += 1) d(m) && e.lazy.loadInSlide(m);
						for (var g = f; g < r; g += 1) d(g) && e.lazy.loadInSlide(g)
					} else {
						var b = t.children("." + i.slideNextClass);
						b.length > 0 && e.lazy.loadInSlide(h(b));
						var w = t.children("." + i.slidePrevClass);
						w.length > 0 && e.lazy.loadInSlide(h(w))
					}
			}
		},
		de = {
			LinearSpline: function(e, t) {
				var i, s, a, r, n, o = function(e, t) {
					for (s = -1, i = e.length; i - s > 1;) e[a = i + s >> 1] <= t ? s = a : i = a;
					return i
				};
				return this.x = e, this.y = t, this.lastIndex = e.length - 1, this.interpolate = function(e) {
					return e ? (n = o(this.x, e), r = n - 1, (e - this.x[r]) * (this.y[n] - this.y[r]) / (this.x[n] - this.x[r]) +
						this.y[r]) : 0
				}, this
			},
			getInterpolateFunction: function(e) {
				this.controller.spline || (this.controller.spline = this.params.loop ? new de.LinearSpline(this.slidesGrid, e.slidesGrid) :
					new de.LinearSpline(this.snapGrid, e.snapGrid))
			},
			setTranslate: function(e, t) {
				var i, s, a = this,
					r = a.controller.control;

				function n(e) {
					var t = a.rtlTranslate ? -a.translate : a.translate;
					"slide" === a.params.controller.by && (a.controller.getInterpolateFunction(e), s = -a.controller.spline.interpolate(
						-t)), s && "container" !== a.params.controller.by || (i = (e.maxTranslate() - e.minTranslate()) / (a.maxTranslate() -
						a.minTranslate()), s = (t - a.minTranslate()) * i + e.minTranslate()), a.params.controller.inverse && (s = e.maxTranslate() -
						s), e.updateProgress(s), e.setTranslate(s, a), e.updateActiveIndex(), e.updateSlidesClasses()
				}
				if (Array.isArray(r))
					for (var o = 0; o < r.length; o += 1) r[o] !== t && r[o] instanceof W && n(r[o]);
				else r instanceof W && t !== r && n(r)
			},
			setTransition: function(e, t) {
				var i, s = this,
					a = s.controller.control;

				function r(t) {
					t.setTransition(e, s), 0 !== e && (t.transitionStart(), t.params.autoHeight && n.nextTick((function() {
						t.updateAutoHeight()
					})), t.$wrapperEl.transitionEnd((function() {
						a && (t.params.loop && "slide" === s.params.controller.by && t.loopFix(), t.transitionEnd())
					})))
				}
				if (Array.isArray(a))
					for (i = 0; i < a.length; i += 1) a[i] !== t && a[i] instanceof W && r(a[i]);
				else a instanceof W && t !== a && r(a)
			}
		},
		he = {
			makeElFocusable: function(e) {
				return e.attr("tabIndex", "0"), e
			},
			addElRole: function(e, t) {
				return e.attr("role", t), e
			},
			addElLabel: function(e, t) {
				return e.attr("aria-label", t), e
			},
			disableEl: function(e) {
				return e.attr("aria-disabled", !0), e
			},
			enableEl: function(e) {
				return e.attr("aria-disabled", !1), e
			},
			onEnterKey: function(e) {
				var t = this.params.a11y;
				if (13 === e.keyCode) {
					var i = s(e.target);
					this.navigation && this.navigation.$nextEl && i.is(this.navigation.$nextEl) && (this.isEnd && !this.params.loop ||
							this.slideNext(), this.isEnd ? this.a11y.notify(t.lastSlideMessage) : this.a11y.notify(t.nextSlideMessage)),
						this.navigation && this.navigation.$prevEl && i.is(this.navigation.$prevEl) && (this.isBeginning && !this.params
							.loop || this.slidePrev(), this.isBeginning ? this.a11y.notify(t.firstSlideMessage) : this.a11y.notify(t.prevSlideMessage)
						), this.pagination && i.is("." + this.params.pagination.bulletClass) && i[0].click()
				}
			},
			notify: function(e) {
				var t = this.a11y.liveRegion;
				0 !== t.length && (t.html(""), t.html(e))
			},
			updateNavigation: function() {
				if (!this.params.loop) {
					var e = this.navigation,
						t = e.$nextEl,
						i = e.$prevEl;
					i && i.length > 0 && (this.isBeginning ? this.a11y.disableEl(i) : this.a11y.enableEl(i)), t && t.length > 0 &&
						(this.isEnd ? this.a11y.disableEl(t) : this.a11y.enableEl(t))
				}
			},
			updatePagination: function() {
				var e = this,
					t = e.params.a11y;
				e.pagination && e.params.pagination.clickable && e.pagination.bullets && e.pagination.bullets.length && e.pagination
					.bullets.each((function(i, a) {
						var r = s(a);
						e.a11y.makeElFocusable(r), e.a11y.addElRole(r, "button"), e.a11y.addElLabel(r, t.paginationBulletMessage.replace(
							/{{index}}/, r.index() + 1))
					}))
			},
			init: function() {
				this.$el.append(this.a11y.liveRegion);
				var e, t, i = this.params.a11y;
				this.navigation && this.navigation.$nextEl && (e = this.navigation.$nextEl), this.navigation && this.navigation.$prevEl &&
					(t = this.navigation.$prevEl), e && (this.a11y.makeElFocusable(e), this.a11y.addElRole(e, "button"), this.a11y.addElLabel(
						e, i.nextSlideMessage), e.on("keydown", this.a11y.onEnterKey)), t && (this.a11y.makeElFocusable(t), this.a11y.addElRole(
						t, "button"), this.a11y.addElLabel(t, i.prevSlideMessage), t.on("keydown", this.a11y.onEnterKey)), this.pagination &&
					this.params.pagination.clickable && this.pagination.bullets && this.pagination.bullets.length && this.pagination
					.$el.on("keydown", "." + this.params.pagination.bulletClass, this.a11y.onEnterKey)
			},
			destroy: function() {
				var e, t;
				this.a11y.liveRegion && this.a11y.liveRegion.length > 0 && this.a11y.liveRegion.remove(), this.navigation &&
					this.navigation.$nextEl && (e = this.navigation.$nextEl), this.navigation && this.navigation.$prevEl && (t =
						this.navigation.$prevEl), e && e.off("keydown", this.a11y.onEnterKey), t && t.off("keydown", this.a11y.onEnterKey),
					this.pagination && this.params.pagination.clickable && this.pagination.bullets && this.pagination.bullets.length &&
					this.pagination.$el.off("keydown", "." + this.params.pagination.bulletClass, this.a11y.onEnterKey)
			}
		},
		pe = {
			init: function() {
				if (this.params.history) {
					if (!t.history || !t.history.pushState) return this.params.history.enabled = !1, void(this.params.hashNavigation
						.enabled = !0);
					var e = this.history;
					e.initialized = !0, e.paths = pe.getPathValues(), (e.paths.key || e.paths.value) && (e.scrollToSlide(0, e.paths
						.value, this.params.runCallbacksOnInit), this.params.history.replaceState || t.addEventListener("popstate",
						this.history.setHistoryPopState))
				}
			},
			destroy: function() {
				this.params.history.replaceState || t.removeEventListener("popstate", this.history.setHistoryPopState)
			},
			setHistoryPopState: function() {
				this.history.paths = pe.getPathValues(), this.history.scrollToSlide(this.params.speed, this.history.paths.value,
					!1)
			},
			getPathValues: function() {
				var e = t.location.pathname.slice(1).split("/").filter((function(e) {
						return "" !== e
					})),
					i = e.length;
				return {
					key: e[i - 2],
					value: e[i - 1]
				}
			},
			setHistory: function(e, i) {
				if (this.history.initialized && this.params.history.enabled) {
					var s = this.slides.eq(i),
						a = pe.slugify(s.attr("data-history"));
					t.location.pathname.includes(e) || (a = e + "/" + a);
					var r = t.history.state;
					r && r.value === a || (this.params.history.replaceState ? t.history.replaceState({
						value: a
					}, null, a) : t.history.pushState({
						value: a
					}, null, a))
				}
			},
			slugify: function(e) {
				return e.toString().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(
					/-+$/, "")
			},
			scrollToSlide: function(e, t, i) {
				if (t)
					for (var s = 0, a = this.slides.length; s < a; s += 1) {
						var r = this.slides.eq(s);
						if (pe.slugify(r.attr("data-history")) === t && !r.hasClass(this.params.slideDuplicateClass)) {
							var n = r.index();
							this.slideTo(n, e, i)
						}
					} else this.slideTo(0, e, i)
			}
		},
		ce = {
			onHashCange: function() {
				var t = e.location.hash.replace("#", "");
				if (t !== this.slides.eq(this.activeIndex).attr("data-hash")) {
					var i = this.$wrapperEl.children("." + this.params.slideClass + '[data-hash="' + t + '"]').index();
					if (void 0 === i) return;
					this.slideTo(i)
				}
			},
			setHash: function() {
				if (this.hashNavigation.initialized && this.params.hashNavigation.enabled)
					if (this.params.hashNavigation.replaceState && t.history && t.history.replaceState) t.history.replaceState(null,
						null, "#" + this.slides.eq(this.activeIndex).attr("data-hash") || "");
					else {
						var i = this.slides.eq(this.activeIndex),
							s = i.attr("data-hash") || i.attr("data-history");
						e.location.hash = s || ""
					}
			},
			init: function() {
				if (!(!this.params.hashNavigation.enabled || this.params.history && this.params.history.enabled)) {
					this.hashNavigation.initialized = !0;
					var i = e.location.hash.replace("#", "");
					if (i)
						for (var a = 0, r = this.slides.length; a < r; a += 1) {
							var n = this.slides.eq(a);
							if ((n.attr("data-hash") || n.attr("data-history")) === i && !n.hasClass(this.params.slideDuplicateClass)) {
								var o = n.index();
								this.slideTo(o, 0, this.params.runCallbacksOnInit, !0)
							}
						}
					this.params.hashNavigation.watchState && s(t).on("hashchange", this.hashNavigation.onHashCange)
				}
			},
			destroy: function() {
				this.params.hashNavigation.watchState && s(t).off("hashchange", this.hashNavigation.onHashCange)
			}
		},
		ue = {
			run: function() {
				var e = this,
					t = e.slides.eq(e.activeIndex),
					i = e.params.autoplay.delay;
				t.attr("data-swiper-autoplay") && (i = t.attr("data-swiper-autoplay") || e.params.autoplay.delay), clearTimeout(
					e.autoplay.timeout), e.autoplay.timeout = n.nextTick((function() {
					e.params.autoplay.reverseDirection ? e.params.loop ? (e.loopFix(), e.slidePrev(e.params.speed, !0, !0), e.emit(
							"autoplay")) : e.isBeginning ? e.params.autoplay.stopOnLastSlide ? e.autoplay.stop() : (e.slideTo(e.slides
							.length - 1, e.params.speed, !0, !0), e.emit("autoplay")) : (e.slidePrev(e.params.speed, !0, !0), e.emit(
							"autoplay")) : e.params.loop ? (e.loopFix(), e.slideNext(e.params.speed, !0, !0), e.emit("autoplay")) : e.isEnd ?
						e.params.autoplay.stopOnLastSlide ? e.autoplay.stop() : (e.slideTo(0, e.params.speed, !0, !0), e.emit(
							"autoplay")) : (e.slideNext(e.params.speed, !0, !0), e.emit("autoplay")), e.params.cssMode && e.autoplay.running &&
						e.autoplay.run()
				}), i)
			},
			start: function() {
				return void 0 === this.autoplay.timeout && (!this.autoplay.running && (this.autoplay.running = !0, this.emit(
					"autoplayStart"), this.autoplay.run(), !0))
			},
			stop: function() {
				return !!this.autoplay.running && (void 0 !== this.autoplay.timeout && (this.autoplay.timeout && (clearTimeout(
					this.autoplay.timeout), this.autoplay.timeout = void 0), this.autoplay.running = !1, this.emit(
					"autoplayStop"), !0))
			},
			pause: function(e) {
				this.autoplay.running && (this.autoplay.paused || (this.autoplay.timeout && clearTimeout(this.autoplay.timeout),
					this.autoplay.paused = !0, 0 !== e && this.params.autoplay.waitForTransition ? (this.$wrapperEl[0].addEventListener(
						"transitionend", this.autoplay.onTransitionEnd), this.$wrapperEl[0].addEventListener("webkitTransitionEnd",
						this.autoplay.onTransitionEnd)) : (this.autoplay.paused = !1, this.autoplay.run())))
			}
		},
		ve = {
			setTranslate: function() {
				for (var e = this.slides, t = 0; t < e.length; t += 1) {
					var i = this.slides.eq(t),
						s = -i[0].swiperSlideOffset;
					this.params.virtualTranslate || (s -= this.translate);
					var a = 0;
					this.isHorizontal() || (a = s, s = 0);
					var r = this.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(i[0].progress), 0) : 1 + Math.min(Math.max(i[0]
						.progress, -1), 0);
					i.css({
						opacity: r
					}).transform("translate3d(" + s + "px, " + a + "px, 0px)")
				}
			},
			setTransition: function(e) {
				var t = this,
					i = t.slides,
					s = t.$wrapperEl;
				if (i.transition(e), t.params.virtualTranslate && 0 !== e) {
					var a = !1;
					i.transitionEnd((function() {
						if (!a && t && !t.destroyed) {
							a = !0, t.animating = !1;
							for (var e = ["webkitTransitionEnd", "transitionend"], i = 0; i < e.length; i += 1) s.trigger(e[i])
						}
					}))
				}
			}
		},
		fe = {
			setTranslate: function() {
				var e, t = this.$el,
					i = this.$wrapperEl,
					a = this.slides,
					r = this.width,
					n = this.height,
					o = this.rtlTranslate,
					l = this.size,
					d = this.params.cubeEffect,
					h = this.isHorizontal(),
					p = this.virtual && this.params.virtual.enabled,
					c = 0;
				d.shadow && (h ? (0 === (e = i.find(".swiper-cube-shadow")).length && (e = s(
					'<div class="swiper-cube-shadow"></div>'), i.append(e)), e.css({
					height: r + "px"
				})) : 0 === (e = t.find(".swiper-cube-shadow")).length && (e = s('<div class="swiper-cube-shadow"></div>'), t.append(
					e)));
				for (var u = 0; u < a.length; u += 1) {
					var v = a.eq(u),
						f = u;
					p && (f = parseInt(v.attr("data-swiper-slide-index"), 10));
					var m = 90 * f,
						g = Math.floor(m / 360);
					o && (m = -m, g = Math.floor(-m / 360));
					var b = Math.max(Math.min(v[0].progress, 1), -1),
						w = 0,
						y = 0,
						x = 0;
					f % 4 == 0 ? (w = 4 * -g * l, x = 0) : (f - 1) % 4 == 0 ? (w = 0, x = 4 * -g * l) : (f - 2) % 4 == 0 ? (w = l +
						4 * g * l, x = l) : (f - 3) % 4 == 0 && (w = -l, x = 3 * l + 4 * l * g), o && (w = -w), h || (y = w, w = 0);
					var T = "rotateX(" + (h ? 0 : -m) + "deg) rotateY(" + (h ? m : 0) + "deg) translate3d(" + w + "px, " + y +
						"px, " + x + "px)";
					if (b <= 1 && b > -1 && (c = 90 * f + 90 * b, o && (c = 90 * -f - 90 * b)), v.transform(T), d.slideShadows) {
						var E = h ? v.find(".swiper-slide-shadow-left") : v.find(".swiper-slide-shadow-top"),
							C = h ? v.find(".swiper-slide-shadow-right") : v.find(".swiper-slide-shadow-bottom");
						0 === E.length && (E = s('<div class="swiper-slide-shadow-' + (h ? "left" : "top") + '"></div>'), v.append(E)),
							0 === C.length && (C = s('<div class="swiper-slide-shadow-' + (h ? "right" : "bottom") + '"></div>'), v.append(
								C)), E.length && (E[0].style.opacity = Math.max(-b, 0)), C.length && (C[0].style.opacity = Math.max(b, 0))
					}
				}
				if (i.css({
						"-webkit-transform-origin": "50% 50% -" + l / 2 + "px",
						"-moz-transform-origin": "50% 50% -" + l / 2 + "px",
						"-ms-transform-origin": "50% 50% -" + l / 2 + "px",
						"transform-origin": "50% 50% -" + l / 2 + "px"
					}), d.shadow)
					if (h) e.transform("translate3d(0px, " + (r / 2 + d.shadowOffset) + "px, " + -r / 2 +
						"px) rotateX(90deg) rotateZ(0deg) scale(" + d.shadowScale + ")");
					else {
						var S = Math.abs(c) - 90 * Math.floor(Math.abs(c) / 90),
							M = 1.5 - (Math.sin(2 * S * Math.PI / 360) / 2 + Math.cos(2 * S * Math.PI / 360) / 2),
							P = d.shadowScale,
							z = d.shadowScale / M,
							k = d.shadowOffset;
						e.transform("scale3d(" + P + ", 1, " + z + ") translate3d(0px, " + (n / 2 + k) + "px, " + -n / 2 / z +
							"px) rotateX(-90deg)")
					} var $ = j.isSafari || j.isUiWebView ? -l / 2 : 0;
				i.transform("translate3d(0px,0," + $ + "px) rotateX(" + (this.isHorizontal() ? 0 : c) + "deg) rotateY(" + (this.isHorizontal() ?
					-c : 0) + "deg)")
			},
			setTransition: function(e) {
				var t = this.$el;
				this.slides.transition(e).find(
					".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
				).transition(e), this.params.cubeEffect.shadow && !this.isHorizontal() && t.find(".swiper-cube-shadow").transition(
					e)
			}
		},
		me = {
			setTranslate: function() {
				for (var e = this.slides, t = this.rtlTranslate, i = 0; i < e.length; i += 1) {
					var a = e.eq(i),
						r = a[0].progress;
					this.params.flipEffect.limitRotation && (r = Math.max(Math.min(a[0].progress, 1), -1));
					var n = -180 * r,
						o = 0,
						l = -a[0].swiperSlideOffset,
						d = 0;
					if (this.isHorizontal() ? t && (n = -n) : (d = l, l = 0, o = -n, n = 0), a[0].style.zIndex = -Math.abs(Math.round(
							r)) + e.length, this.params.flipEffect.slideShadows) {
						var h = this.isHorizontal() ? a.find(".swiper-slide-shadow-left") : a.find(".swiper-slide-shadow-top"),
							p = this.isHorizontal() ? a.find(".swiper-slide-shadow-right") : a.find(".swiper-slide-shadow-bottom");
						0 === h.length && (h = s('<div class="swiper-slide-shadow-' + (this.isHorizontal() ? "left" : "top") +
								'"></div>'), a.append(h)), 0 === p.length && (p = s('<div class="swiper-slide-shadow-' + (this.isHorizontal() ?
								"right" : "bottom") + '"></div>'), a.append(p)), h.length && (h[0].style.opacity = Math.max(-r, 0)), p.length &&
							(p[0].style.opacity = Math.max(r, 0))
					}
					a.transform("translate3d(" + l + "px, " + d + "px, 0px) rotateX(" + o + "deg) rotateY(" + n + "deg)")
				}
			},
			setTransition: function(e) {
				var t = this,
					i = t.slides,
					s = t.activeIndex,
					a = t.$wrapperEl;
				if (i.transition(e).find(
						".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
					).transition(e), t.params.virtualTranslate && 0 !== e) {
					var r = !1;
					i.eq(s).transitionEnd((function() {
						if (!r && t && !t.destroyed) {
							r = !0, t.animating = !1;
							for (var e = ["webkitTransitionEnd", "transitionend"], i = 0; i < e.length; i += 1) a.trigger(e[i])
						}
					}))
				}
			}
		},
		ge = {
			setTranslate: function() {
				for (var e = this.width, t = this.height, i = this.slides, a = this.$wrapperEl, r = this.slidesSizesGrid, n =
						this.params.coverflowEffect, l = this.isHorizontal(), d = this.translate, h = l ? e / 2 - d : t / 2 - d, p = l ?
						n.rotate : -n.rotate, c = n.depth, u = 0, v = i.length; u < v; u += 1) {
					var f = i.eq(u),
						m = r[u],
						g = (h - f[0].swiperSlideOffset - m / 2) / m * n.modifier,
						b = l ? p * g : 0,
						w = l ? 0 : p * g,
						y = -c * Math.abs(g),
						x = l ? 0 : n.stretch * g,
						T = l ? n.stretch * g : 0;
					Math.abs(T) < .001 && (T = 0), Math.abs(x) < .001 && (x = 0), Math.abs(y) < .001 && (y = 0), Math.abs(b) < .001 &&
						(b = 0), Math.abs(w) < .001 && (w = 0);
					var E = "translate3d(" + T + "px," + x + "px," + y + "px)  rotateX(" + w + "deg) rotateY(" + b + "deg)";
					if (f.transform(E), f[0].style.zIndex = 1 - Math.abs(Math.round(g)), n.slideShadows) {
						var C = l ? f.find(".swiper-slide-shadow-left") : f.find(".swiper-slide-shadow-top"),
							S = l ? f.find(".swiper-slide-shadow-right") : f.find(".swiper-slide-shadow-bottom");
						0 === C.length && (C = s('<div class="swiper-slide-shadow-' + (l ? "left" : "top") + '"></div>'), f.append(C)),
							0 === S.length && (S = s('<div class="swiper-slide-shadow-' + (l ? "right" : "bottom") + '"></div>'), f.append(
								S)), C.length && (C[0].style.opacity = g > 0 ? g : 0), S.length && (S[0].style.opacity = -g > 0 ? -g : 0)
					}
				}(o.pointerEvents || o.prefixedPointerEvents) && (a[0].style.perspectiveOrigin = h + "px 50%")
			},
			setTransition: function(e) {
				this.slides.transition(e).find(
					".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
				).transition(e)
			}
		},
		be = {
			init: function() {
				var e = this.params.thumbs,
					t = this.constructor;
				e.swiper instanceof t ? (this.thumbs.swiper = e.swiper, n.extend(this.thumbs.swiper.originalParams, {
						watchSlidesProgress: !0,
						slideToClickedSlide: !1
					}), n.extend(this.thumbs.swiper.params, {
						watchSlidesProgress: !0,
						slideToClickedSlide: !1
					})) : n.isObject(e.swiper) && (this.thumbs.swiper = new t(n.extend({}, e.swiper, {
						watchSlidesVisibility: !0,
						watchSlidesProgress: !0,
						slideToClickedSlide: !1
					})), this.thumbs.swiperCreated = !0), this.thumbs.swiper.$el.addClass(this.params.thumbs.thumbsContainerClass),
					this.thumbs.swiper.on("tap", this.thumbs.onThumbClick)
			},
			onThumbClick: function() {
				var e = this.thumbs.swiper;
				if (e) {
					var t = e.clickedIndex,
						i = e.clickedSlide;
					if (!(i && s(i).hasClass(this.params.thumbs.slideThumbActiveClass) || null == t)) {
						var a;
						if (a = e.params.loop ? parseInt(s(e.clickedSlide).attr("data-swiper-slide-index"), 10) : t, this.params.loop) {
							var r = this.activeIndex;
							this.slides.eq(r).hasClass(this.params.slideDuplicateClass) && (this.loopFix(), this._clientLeft = this.$wrapperEl[
								0].clientLeft, r = this.activeIndex);
							var n = this.slides.eq(r).prevAll('[data-swiper-slide-index="' + a + '"]').eq(0).index(),
								o = this.slides.eq(r).nextAll('[data-swiper-slide-index="' + a + '"]').eq(0).index();
							a = void 0 === n ? o : void 0 === o ? n : o - r < r - n ? o : n
						}
						this.slideTo(a)
					}
				}
			},
			update: function(e) {
				var t = this.thumbs.swiper;
				if (t) {
					var i = "auto" === t.params.slidesPerView ? t.slidesPerViewDynamic() : t.params.slidesPerView;
					if (this.realIndex !== t.realIndex) {
						var s, a = t.activeIndex;
						if (t.params.loop) {
							t.slides.eq(a).hasClass(t.params.slideDuplicateClass) && (t.loopFix(), t._clientLeft = t.$wrapperEl[0].clientLeft,
								a = t.activeIndex);
							var r = t.slides.eq(a).prevAll('[data-swiper-slide-index="' + this.realIndex + '"]').eq(0).index(),
								n = t.slides.eq(a).nextAll('[data-swiper-slide-index="' + this.realIndex + '"]').eq(0).index();
							s = void 0 === r ? n : void 0 === n ? r : n - a == a - r ? a : n - a < a - r ? n : r
						} else s = this.realIndex;
						t.visibleSlidesIndexes && t.visibleSlidesIndexes.indexOf(s) < 0 && (t.params.centeredSlides ? s = s > a ? s -
							Math.floor(i / 2) + 1 : s + Math.floor(i / 2) - 1 : s > a && (s = s - i + 1), t.slideTo(s, e ? 0 : void 0))
					}
					var o = 1,
						l = this.params.thumbs.slideThumbActiveClass;
					if (this.params.slidesPerView > 1 && !this.params.centeredSlides && (o = this.params.slidesPerView), t.slides.removeClass(
							l), t.params.loop || t.params.virtual && t.params.virtual.enabled)
						for (var d = 0; d < o; d += 1) t.$wrapperEl.children('[data-swiper-slide-index="' + (this.realIndex + d) +
							'"]').addClass(l);
					else
						for (var h = 0; h < o; h += 1) t.slides.eq(this.realIndex + h).addClass(l)
				}
			}
		},
		we = [R, q, K, U, Z, J, te, {
			name: "mousewheel",
			params: {
				mousewheel: {
					enabled: !1,
					releaseOnEdges: !1,
					invert: !1,
					forceToAxis: !1,
					sensitivity: 1,
					eventsTarged: "container"
				}
			},
			create: function() {
				n.extend(this, {
					mousewheel: {
						enabled: !1,
						enable: ie.enable.bind(this),
						disable: ie.disable.bind(this),
						handle: ie.handle.bind(this),
						handleMouseEnter: ie.handleMouseEnter.bind(this),
						handleMouseLeave: ie.handleMouseLeave.bind(this),
						lastScrollTime: n.now(),
						lastEventBeforeSnap: void 0,
						recentWheelEvents: []
					}
				})
			},
			on: {
				init: function() {
					!this.params.mousewheel.enabled && this.params.cssMode && this.mousewheel.disable(), this.params.mousewheel.enabled &&
						this.mousewheel.enable()
				},
				destroy: function() {
					this.params.cssMode && this.mousewheel.enable(), this.mousewheel.enabled && this.mousewheel.disable()
				}
			}
		}, {
			name: "navigation",
			params: {
				navigation: {
					nextEl: null,
					prevEl: null,
					hideOnClick: !1,
					disabledClass: "swiper-button-disabled",
					hiddenClass: "swiper-button-hidden",
					lockClass: "swiper-button-lock"
				}
			},
			create: function() {
				n.extend(this, {
					navigation: {
						init: se.init.bind(this),
						update: se.update.bind(this),
						destroy: se.destroy.bind(this),
						onNextClick: se.onNextClick.bind(this),
						onPrevClick: se.onPrevClick.bind(this)
					}
				})
			},
			on: {
				init: function() {
					this.navigation.init(), this.navigation.update()
				},
				toEdge: function() {
					this.navigation.update()
				},
				fromEdge: function() {
					this.navigation.update()
				},
				destroy: function() {
					this.navigation.destroy()
				},
				click: function(e) {
					var t, i = this.navigation,
						a = i.$nextEl,
						r = i.$prevEl;
					!this.params.navigation.hideOnClick || s(e.target).is(r) || s(e.target).is(a) || (a ? t = a.hasClass(this.params
							.navigation.hiddenClass) : r && (t = r.hasClass(this.params.navigation.hiddenClass)), !0 === t ? this.emit(
							"navigationShow", this) : this.emit("navigationHide", this), a && a.toggleClass(this.params.navigation.hiddenClass),
						r && r.toggleClass(this.params.navigation.hiddenClass))
				}
			}
		}, {
			name: "pagination",
			params: {
				pagination: {
					el: null,
					bulletElement: "span",
					clickable: !1,
					hideOnClick: !1,
					renderBullet: null,
					renderProgressbar: null,
					renderFraction: null,
					renderCustom: null,
					progressbarOpposite: !1,
					type: "bullets",
					dynamicBullets: !1,
					dynamicMainBullets: 1,
					formatFractionCurrent: function(e) {
						return e
					},
					formatFractionTotal: function(e) {
						return e
					},
					bulletClass: "swiper-pagination-bullet",
					bulletActiveClass: "swiper-pagination-bullet-active",
					modifierClass: "swiper-pagination-",
					currentClass: "swiper-pagination-current",
					totalClass: "swiper-pagination-total",
					hiddenClass: "swiper-pagination-hidden",
					progressbarFillClass: "swiper-pagination-progressbar-fill",
					progressbarOppositeClass: "swiper-pagination-progressbar-opposite",
					clickableClass: "swiper-pagination-clickable",
					lockClass: "swiper-pagination-lock"
				}
			},
			create: function() {
				n.extend(this, {
					pagination: {
						init: ae.init.bind(this),
						render: ae.render.bind(this),
						update: ae.update.bind(this),
						destroy: ae.destroy.bind(this),
						dynamicBulletIndex: 0
					}
				})
			},
			on: {
				init: function() {
					this.pagination.init(), this.pagination.render(), this.pagination.update()
				},
				activeIndexChange: function() {
					this.params.loop ? this.pagination.update() : void 0 === this.snapIndex && this.pagination.update()
				},
				snapIndexChange: function() {
					this.params.loop || this.pagination.update()
				},
				slidesLengthChange: function() {
					this.params.loop && (this.pagination.render(), this.pagination.update())
				},
				snapGridLengthChange: function() {
					this.params.loop || (this.pagination.render(), this.pagination.update())
				},
				destroy: function() {
					this.pagination.destroy()
				},
				click: function(e) {
					this.params.pagination.el && this.params.pagination.hideOnClick && this.pagination.$el.length > 0 && !s(e.target)
						.hasClass(this.params.pagination.bulletClass) && (!0 === this.pagination.$el.hasClass(this.params.pagination.hiddenClass) ?
							this.emit("paginationShow", this) : this.emit("paginationHide", this), this.pagination.$el.toggleClass(this.params
								.pagination.hiddenClass))
				}
			}
		}, {
			name: "scrollbar",
			params: {
				scrollbar: {
					el: null,
					dragSize: "auto",
					hide: !1,
					draggable: !1,
					snapOnRelease: !0,
					lockClass: "swiper-scrollbar-lock",
					dragClass: "swiper-scrollbar-drag"
				}
			},
			create: function() {
				n.extend(this, {
					scrollbar: {
						init: re.init.bind(this),
						destroy: re.destroy.bind(this),
						updateSize: re.updateSize.bind(this),
						setTranslate: re.setTranslate.bind(this),
						setTransition: re.setTransition.bind(this),
						enableDraggable: re.enableDraggable.bind(this),
						disableDraggable: re.disableDraggable.bind(this),
						setDragPosition: re.setDragPosition.bind(this),
						getPointerPosition: re.getPointerPosition.bind(this),
						onDragStart: re.onDragStart.bind(this),
						onDragMove: re.onDragMove.bind(this),
						onDragEnd: re.onDragEnd.bind(this),
						isTouched: !1,
						timeout: null,
						dragTimeout: null
					}
				})
			},
			on: {
				init: function() {
					this.scrollbar.init(), this.scrollbar.updateSize(), this.scrollbar.setTranslate()
				},
				update: function() {
					this.scrollbar.updateSize()
				},
				resize: function() {
					this.scrollbar.updateSize()
				},
				observerUpdate: function() {
					this.scrollbar.updateSize()
				},
				setTranslate: function() {
					this.scrollbar.setTranslate()
				},
				setTransition: function(e) {
					this.scrollbar.setTransition(e)
				},
				destroy: function() {
					this.scrollbar.destroy()
				}
			}
		}, {
			name: "parallax",
			params: {
				parallax: {
					enabled: !1
				}
			},
			create: function() {
				n.extend(this, {
					parallax: {
						setTransform: ne.setTransform.bind(this),
						setTranslate: ne.setTranslate.bind(this),
						setTransition: ne.setTransition.bind(this)
					}
				})
			},
			on: {
				beforeInit: function() {
					this.params.parallax.enabled && (this.params.watchSlidesProgress = !0, this.originalParams.watchSlidesProgress = !
						0)
				},
				init: function() {
					this.params.parallax.enabled && this.parallax.setTranslate()
				},
				setTranslate: function() {
					this.params.parallax.enabled && this.parallax.setTranslate()
				},
				setTransition: function(e) {
					this.params.parallax.enabled && this.parallax.setTransition(e)
				}
			}
		}, {
			name: "zoom",
			params: {
				zoom: {
					enabled: !1,
					maxRatio: 3,
					minRatio: 1,
					toggle: !0,
					containerClass: "swiper-zoom-container",
					zoomedSlideClass: "swiper-slide-zoomed"
				}
			},
			create: function() {
				var e = this,
					t = {
						enabled: !1,
						scale: 1,
						currentScale: 1,
						isScaling: !1,
						gesture: {
							$slideEl: void 0,
							slideWidth: void 0,
							slideHeight: void 0,
							$imageEl: void 0,
							$imageWrapEl: void 0,
							maxRatio: 3
						},
						image: {
							isTouched: void 0,
							isMoved: void 0,
							currentX: void 0,
							currentY: void 0,
							minX: void 0,
							minY: void 0,
							maxX: void 0,
							maxY: void 0,
							width: void 0,
							height: void 0,
							startX: void 0,
							startY: void 0,
							touchesStart: {},
							touchesCurrent: {}
						},
						velocity: {
							x: void 0,
							y: void 0,
							prevPositionX: void 0,
							prevPositionY: void 0,
							prevTime: void 0
						}
					};
				"onGestureStart onGestureChange onGestureEnd onTouchStart onTouchMove onTouchEnd onTransitionEnd toggle enable disable in out"
				.split(" ").forEach((function(i) {
					t[i] = oe[i].bind(e)
				})), n.extend(e, {
					zoom: t
				});
				var i = 1;
				Object.defineProperty(e.zoom, "scale", {
					get: function() {
						return i
					},
					set: function(t) {
						if (i !== t) {
							var s = e.zoom.gesture.$imageEl ? e.zoom.gesture.$imageEl[0] : void 0,
								a = e.zoom.gesture.$slideEl ? e.zoom.gesture.$slideEl[0] : void 0;
							e.emit("zoomChange", t, s, a)
						}
						i = t
					}
				})
			},
			on: {
				init: function() {
					this.params.zoom.enabled && this.zoom.enable()
				},
				destroy: function() {
					this.zoom.disable()
				},
				touchStart: function(e) {
					this.zoom.enabled && this.zoom.onTouchStart(e)
				},
				touchEnd: function(e) {
					this.zoom.enabled && this.zoom.onTouchEnd(e)
				},
				doubleTap: function(e) {
					this.params.zoom.enabled && this.zoom.enabled && this.params.zoom.toggle && this.zoom.toggle(e)
				},
				transitionEnd: function() {
					this.zoom.enabled && this.params.zoom.enabled && this.zoom.onTransitionEnd()
				},
				slideChange: function() {
					this.zoom.enabled && this.params.zoom.enabled && this.params.cssMode && this.zoom.onTransitionEnd()
				}
			}
		}, {
			name: "lazy",
			params: {
				lazy: {
					enabled: !1,
					loadPrevNext: !1,
					loadPrevNextAmount: 1,
					loadOnTransitionStart: !1,
					elementClass: "swiper-lazy",
					loadingClass: "swiper-lazy-loading",
					loadedClass: "swiper-lazy-loaded",
					preloaderClass: "swiper-lazy-preloader"
				}
			},
			create: function() {
				n.extend(this, {
					lazy: {
						initialImageLoaded: !1,
						load: le.load.bind(this),
						loadInSlide: le.loadInSlide.bind(this)
					}
				})
			},
			on: {
				beforeInit: function() {
					this.params.lazy.enabled && this.params.preloadImages && (this.params.preloadImages = !1)
				},
				init: function() {
					this.params.lazy.enabled && !this.params.loop && 0 === this.params.initialSlide && this.lazy.load()
				},
				scroll: function() {
					this.params.freeMode && !this.params.freeModeSticky && this.lazy.load()
				},
				resize: function() {
					this.params.lazy.enabled && this.lazy.load()
				},
				scrollbarDragMove: function() {
					this.params.lazy.enabled && this.lazy.load()
				},
				transitionStart: function() {
					this.params.lazy.enabled && (this.params.lazy.loadOnTransitionStart || !this.params.lazy.loadOnTransitionStart &&
						!this.lazy.initialImageLoaded) && this.lazy.load()
				},
				transitionEnd: function() {
					this.params.lazy.enabled && !this.params.lazy.loadOnTransitionStart && this.lazy.load()
				},
				slideChange: function() {
					this.params.lazy.enabled && this.params.cssMode && this.lazy.load()
				}
			}
		}, {
			name: "controller",
			params: {
				controller: {
					control: void 0,
					inverse: !1,
					by: "slide"
				}
			},
			create: function() {
				n.extend(this, {
					controller: {
						control: this.params.controller.control,
						getInterpolateFunction: de.getInterpolateFunction.bind(this),
						setTranslate: de.setTranslate.bind(this),
						setTransition: de.setTransition.bind(this)
					}
				})
			},
			on: {
				update: function() {
					this.controller.control && this.controller.spline && (this.controller.spline = void 0, delete this.controller.spline)
				},
				resize: function() {
					this.controller.control && this.controller.spline && (this.controller.spline = void 0, delete this.controller.spline)
				},
				observerUpdate: function() {
					this.controller.control && this.controller.spline && (this.controller.spline = void 0, delete this.controller.spline)
				},
				setTranslate: function(e, t) {
					this.controller.control && this.controller.setTranslate(e, t)
				},
				setTransition: function(e, t) {
					this.controller.control && this.controller.setTransition(e, t)
				}
			}
		}, {
			name: "a11y",
			params: {
				a11y: {
					enabled: !0,
					notificationClass: "swiper-notification",
					prevSlideMessage: "Previous slide",
					nextSlideMessage: "Next slide",
					firstSlideMessage: "This is the first slide",
					lastSlideMessage: "This is the last slide",
					paginationBulletMessage: "Go to slide {{index}}"
				}
			},
			create: function() {
				var e = this;
				n.extend(e, {
					a11y: {
						liveRegion: s('<span class="' + e.params.a11y.notificationClass +
							'" aria-live="assertive" aria-atomic="true"></span>')
					}
				}), Object.keys(he).forEach((function(t) {
					e.a11y[t] = he[t].bind(e)
				}))
			},
			on: {
				init: function() {
					this.params.a11y.enabled && (this.a11y.init(), this.a11y.updateNavigation())
				},
				toEdge: function() {
					this.params.a11y.enabled && this.a11y.updateNavigation()
				},
				fromEdge: function() {
					this.params.a11y.enabled && this.a11y.updateNavigation()
				},
				paginationUpdate: function() {
					this.params.a11y.enabled && this.a11y.updatePagination()
				},
				destroy: function() {
					this.params.a11y.enabled && this.a11y.destroy()
				}
			}
		}, {
			name: "history",
			params: {
				history: {
					enabled: !1,
					replaceState: !1,
					key: "slides"
				}
			},
			create: function() {
				n.extend(this, {
					history: {
						init: pe.init.bind(this),
						setHistory: pe.setHistory.bind(this),
						setHistoryPopState: pe.setHistoryPopState.bind(this),
						scrollToSlide: pe.scrollToSlide.bind(this),
						destroy: pe.destroy.bind(this)
					}
				})
			},
			on: {
				init: function() {
					this.params.history.enabled && this.history.init()
				},
				destroy: function() {
					this.params.history.enabled && this.history.destroy()
				},
				transitionEnd: function() {
					this.history.initialized && this.history.setHistory(this.params.history.key, this.activeIndex)
				},
				slideChange: function() {
					this.history.initialized && this.params.cssMode && this.history.setHistory(this.params.history.key, this.activeIndex)
				}
			}
		}, {
			name: "hash-navigation",
			params: {
				hashNavigation: {
					enabled: !1,
					replaceState: !1,
					watchState: !1
				}
			},
			create: function() {
				n.extend(this, {
					hashNavigation: {
						initialized: !1,
						init: ce.init.bind(this),
						destroy: ce.destroy.bind(this),
						setHash: ce.setHash.bind(this),
						onHashCange: ce.onHashCange.bind(this)
					}
				})
			},
			on: {
				init: function() {
					this.params.hashNavigation.enabled && this.hashNavigation.init()
				},
				destroy: function() {
					this.params.hashNavigation.enabled && this.hashNavigation.destroy()
				},
				transitionEnd: function() {
					this.hashNavigation.initialized && this.hashNavigation.setHash()
				},
				slideChange: function() {
					this.hashNavigation.initialized && this.params.cssMode && this.hashNavigation.setHash()
				}
			}
		}, {
			name: "autoplay",
			params: {
				autoplay: {
					enabled: !1,
					delay: 3e3,
					waitForTransition: !0,
					disableOnInteraction: !0,
					stopOnLastSlide: !1,
					reverseDirection: !1
				}
			},
			create: function() {
				var e = this;
				n.extend(e, {
					autoplay: {
						running: !1,
						paused: !1,
						run: ue.run.bind(e),
						start: ue.start.bind(e),
						stop: ue.stop.bind(e),
						pause: ue.pause.bind(e),
						onVisibilityChange: function() {
							"hidden" === document.visibilityState && e.autoplay.running && e.autoplay.pause(), "visible" === document
								.visibilityState && e.autoplay.paused && (e.autoplay.run(), e.autoplay.paused = !1)
						},
						onTransitionEnd: function(t) {
							e && !e.destroyed && e.$wrapperEl && t.target === this && (e.$wrapperEl[0].removeEventListener(
									"transitionend", e.autoplay.onTransitionEnd), e.$wrapperEl[0].removeEventListener(
									"webkitTransitionEnd", e.autoplay.onTransitionEnd), e.autoplay.paused = !1, e.autoplay.running ? e.autoplay
								.run() : e.autoplay.stop())
						}
					}
				})
			},
			on: {
				init: function() {
					this.params.autoplay.enabled && (this.autoplay.start(), document.addEventListener("visibilitychange", this.autoplay
						.onVisibilityChange))
				},
				beforeTransitionStart: function(e, t) {
					this.autoplay.running && (t || !this.params.autoplay.disableOnInteraction ? this.autoplay.pause(e) : this.autoplay
						.stop())
				},
				sliderFirstMove: function() {
					this.autoplay.running && (this.params.autoplay.disableOnInteraction ? this.autoplay.stop() : this.autoplay.pause())
				},
				touchEnd: function() {
					this.params.cssMode && this.autoplay.paused && !this.params.autoplay.disableOnInteraction && this.autoplay.run()
				},
				destroy: function() {
					this.autoplay.running && this.autoplay.stop(), document.removeEventListener("visibilitychange", this.autoplay.onVisibilityChange)
				}
			}
		}, {
			name: "effect-fade",
			params: {
				fadeEffect: {
					crossFade: !1
				}
			},
			create: function() {
				n.extend(this, {
					fadeEffect: {
						setTranslate: ve.setTranslate.bind(this),
						setTransition: ve.setTransition.bind(this)
					}
				})
			},
			on: {
				beforeInit: function() {
					if ("fade" === this.params.effect) {
						this.classNames.push(this.params.containerModifierClass + "fade");
						var e = {
							slidesPerView: 1,
							slidesPerColumn: 1,
							slidesPerGroup: 1,
							watchSlidesProgress: !0,
							spaceBetween: 0,
							virtualTranslate: !0
						};
						n.extend(this.params, e), n.extend(this.originalParams, e)
					}
				},
				setTranslate: function() {
					"fade" === this.params.effect && this.fadeEffect.setTranslate()
				},
				setTransition: function(e) {
					"fade" === this.params.effect && this.fadeEffect.setTransition(e)
				}
			}
		}, {
			name: "effect-cube",
			params: {
				cubeEffect: {
					slideShadows: !0,
					shadow: !0,
					shadowOffset: 20,
					shadowScale: .94
				}
			},
			create: function() {
				n.extend(this, {
					cubeEffect: {
						setTranslate: fe.setTranslate.bind(this),
						setTransition: fe.setTransition.bind(this)
					}
				})
			},
			on: {
				beforeInit: function() {
					if ("cube" === this.params.effect) {
						this.classNames.push(this.params.containerModifierClass + "cube"), this.classNames.push(this.params.containerModifierClass +
							"3d");
						var e = {
							slidesPerView: 1,
							slidesPerColumn: 1,
							slidesPerGroup: 1,
							watchSlidesProgress: !0,
							resistanceRatio: 0,
							spaceBetween: 0,
							centeredSlides: !1,
							virtualTranslate: !0
						};
						n.extend(this.params, e), n.extend(this.originalParams, e)
					}
				},
				setTranslate: function() {
					"cube" === this.params.effect && this.cubeEffect.setTranslate()
				},
				setTransition: function(e) {
					"cube" === this.params.effect && this.cubeEffect.setTransition(e)
				}
			}
		}, {
			name: "effect-flip",
			params: {
				flipEffect: {
					slideShadows: !0,
					limitRotation: !0
				}
			},
			create: function() {
				n.extend(this, {
					flipEffect: {
						setTranslate: me.setTranslate.bind(this),
						setTransition: me.setTransition.bind(this)
					}
				})
			},
			on: {
				beforeInit: function() {
					if ("flip" === this.params.effect) {
						this.classNames.push(this.params.containerModifierClass + "flip"), this.classNames.push(this.params.containerModifierClass +
							"3d");
						var e = {
							slidesPerView: 1,
							slidesPerColumn: 1,
							slidesPerGroup: 1,
							watchSlidesProgress: !0,
							spaceBetween: 0,
							virtualTranslate: !0
						};
						n.extend(this.params, e), n.extend(this.originalParams, e)
					}
				},
				setTranslate: function() {
					"flip" === this.params.effect && this.flipEffect.setTranslate()
				},
				setTransition: function(e) {
					"flip" === this.params.effect && this.flipEffect.setTransition(e)
				}
			}
		}, {
			name: "effect-coverflow",
			params: {
				coverflowEffect: {
					rotate: 50,
					stretch: 0,
					depth: 100,
					modifier: 1,
					slideShadows: !0
				}
			},
			create: function() {
				n.extend(this, {
					coverflowEffect: {
						setTranslate: ge.setTranslate.bind(this),
						setTransition: ge.setTransition.bind(this)
					}
				})
			},
			on: {
				beforeInit: function() {
					"coverflow" === this.params.effect && (this.classNames.push(this.params.containerModifierClass + "coverflow"),
						this.classNames.push(this.params.containerModifierClass + "3d"), this.params.watchSlidesProgress = !0, this.originalParams
						.watchSlidesProgress = !0)
				},
				setTranslate: function() {
					"coverflow" === this.params.effect && this.coverflowEffect.setTranslate()
				},
				setTransition: function(e) {
					"coverflow" === this.params.effect && this.coverflowEffect.setTransition(e)
				}
			}
		}, {
			name: "thumbs",
			params: {
				thumbs: {
					swiper: null,
					slideThumbActiveClass: "swiper-slide-thumb-active",
					thumbsContainerClass: "swiper-container-thumbs"
				}
			},
			create: function() {
				n.extend(this, {
					thumbs: {
						swiper: null,
						init: be.init.bind(this),
						update: be.update.bind(this),
						onThumbClick: be.onThumbClick.bind(this)
					}
				})
			},
			on: {
				beforeInit: function() {
					var e = this.params.thumbs;
					e && e.swiper && (this.thumbs.init(), this.thumbs.update(!0))
				},
				slideChange: function() {
					this.thumbs.swiper && this.thumbs.update()
				},
				update: function() {
					this.thumbs.swiper && this.thumbs.update()
				},
				resize: function() {
					this.thumbs.swiper && this.thumbs.update()
				},
				observerUpdate: function() {
					this.thumbs.swiper && this.thumbs.update()
				},
				setTransition: function(e) {
					var t = this.thumbs.swiper;
					t && t.setTransition(e)
				},
				beforeDestroy: function() {
					var e = this.thumbs.swiper;
					e && this.thumbs.swiperCreated && e && e.destroy()
				}
			}
		}];
	return void 0 === W.use && (W.use = W.Class.use, W.installModule = W.Class.installModule), W.use(we), W
}));
//# sourceMappingURL=swiper.min.js.map




//本插件由www.swiper.com.cn提供
//版本1.03
function swiperAnimateCache(a) {
	for (j = 0; j < a.slides.length; j++)
		for (allBoxes = a.slides[j].querySelectorAll(".ani"), i = 0; i < allBoxes.length; i++) 
		allBoxes[i].attributes["style"] ? allBoxes[i].setAttribute("s-a-style-cache", allBoxes[i].attributes["style"].value) : allBoxes[i].setAttribute("s-a-style-cache", " "),
		allBoxes[i].style.visibility = "hidden"
}

function swiperAnimate(a) {
	clearSwiperAnimate(a);
	var b = a.slides[a.activeIndex].querySelectorAll(".ani");
	for (i = 0; i < b.length; i++) b[i].style.visibility = "visible", effect = b[i].attributes["s-a-effect"] ? b[i].attributes["s-a-effect"].value : "",
		b[i].className = b[i].className + "  " + effect + " " + "animated", 
		style = b[i].attributes["style"].value, 
		duration = b[i].attributes["s-a-duration"] ? b[i].attributes["s-a-duration"].value : "", 
		duration && (style = style + "animation-duration:" + duration +";-webkit-animation-duration:" + duration + ";"), 
		delay = b[i].attributes["s-a-delay"] ? b[i].attributes["s-a-delay"].value : "", 
		delay && (style = style + "animation-delay:" + delay +";-webkit-animation-delay:" + delay + ";"),
		iterationCount = b[i].attributes["s-a-iteration-count"] ? b[i].attributes["s-a-iteration-count"].value : "",
		iterationCount && (style = style + "animation-iteration-count:" + iterationCount +";-webkit-animation-iteration-count:" + iterationCount + ";"), 
		b[i].setAttribute("style", style)
}

function clearSwiperAnimate(a) {
	for (j = 0; j < a.slides.length; j++)
		for (allBoxes = a.slides[j].querySelectorAll(".ani"), i = 0; i < allBoxes.length; i++) 
		allBoxes[i].attributes["s-a-style-cache"] && allBoxes[i].setAttribute("style", allBoxes[i].attributes["s-a-style-cache"].value), 
		allBoxes[i].style.visibility = "hidden", allBoxes[i].className = allBoxes[i].className.replace("animated", " "), 
		allBoxes[i].attributes["s-a-effect"] && (effect = allBoxes[i].attributes["s-a-effect"].value, 
		allBoxes[i].className = allBoxes[i].className.replace(effect, " "))
}




/*!

 * html2canvas 1.0.0-rc.3 <https://html2canvas.hertzen.com>

 * Copyright (c) 2019 Niklas von Hertzen <https://hertzen.com>

 * Released under MIT License

 */

(function (global, factory) {

    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :

        typeof define === 'function' && define.amd ? define(factory) :

            (global = global || self, global.html2canvas = factory());

}(this, function () { 'use strict';



    /*! *****************************************************************************

    Copyright (c) Microsoft Corporation. All rights reserved.

    Licensed under the Apache License, Version 2.0 (the "License"); you may not use

    this file except in compliance with the License. You may obtain a copy of the

    License at http://www.apache.org/licenses/LICENSE-2.0



    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY

    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED

    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,

    MERCHANTABLITY OR NON-INFRINGEMENT.



    See the Apache Version 2.0 License for specific language governing permissions

    and limitations under the License.

    ***************************************************************************** */

    /* global Reflect, Promise */



    var extendStatics = function(d, b) {

        extendStatics = Object.setPrototypeOf ||

            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||

            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

        return extendStatics(d, b);

    };



    function __extends(d, b) {

        extendStatics(d, b);

        function __() { this.constructor = d; }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());

    }



    var __assign = function() {

        __assign = Object.assign || function __assign(t) {

            for (var s, i = 1, n = arguments.length; i < n; i++) {

                s = arguments[i];

                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];

            }

            return t;

        };

        return __assign.apply(this, arguments);

    };



    function __awaiter(thisArg, _arguments, P, generator) {

        return new (P || (P = Promise))(function (resolve, reject) {

            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }

            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }

            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }

            step((generator = generator.apply(thisArg, _arguments || [])).next());

        });

    }



    function __generator(thisArg, body) {

        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;

        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;

        function verb(n) { return function (v) { return step([n, v]); }; }

        function step(op) {

            if (f) throw new TypeError("Generator is already executing.");

            while (_) try {

                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;

                if (y = 0, t) op = [op[0] & 2, t.value];

                switch (op[0]) {

                    case 0: case 1: t = op; break;

                    case 4: _.label++; return { value: op[1], done: false };

                    case 5: _.label++; y = op[1]; op = [0]; continue;

                    case 7: op = _.ops.pop(); _.trys.pop(); continue;

                    default:

                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }

                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }

                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }

                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }

                        if (t[2]) _.ops.pop();

                        _.trys.pop(); continue;

                }

                op = body.call(thisArg, _);

            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }

            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };

        }

    }



    var Bounds = /** @class */ (function () {

        function Bounds(x, y, w, h) {

            this.left = x;

            this.top = y;

            this.width = w;

            this.height = h;

        }

        Bounds.prototype.add = function (x, y, w, h) {

            return new Bounds(this.left + x, this.top + y, this.width + w, this.height + h);

        };

        Bounds.fromClientRect = function (clientRect) {

            return new Bounds(clientRect.left, clientRect.top, clientRect.width, clientRect.height);

        };

        return Bounds;

    }());

    var parseBounds = function (node) {

        return Bounds.fromClientRect(node.getBoundingClientRect());

    };

    var parseDocumentSize = function (document) {

        var body = document.body;

        var documentElement = document.documentElement;

        if (!body || !documentElement) {

            throw new Error("Unable to get document size");

        }

        var width = Math.max(Math.max(body.scrollWidth, documentElement.scrollWidth), Math.max(body.offsetWidth, documentElement.offsetWidth), Math.max(body.clientWidth, documentElement.clientWidth));

        var height = Math.max(Math.max(body.scrollHeight, documentElement.scrollHeight), Math.max(body.offsetHeight, documentElement.offsetHeight), Math.max(body.clientHeight, documentElement.clientHeight));

        return new Bounds(0, 0, width, height);

    };



    /*

     * css-line-break 1.1.1 <https://github.com/niklasvh/css-line-break#readme>

     * Copyright (c) 2019 Niklas von Hertzen <https://hertzen.com>

     * Released under MIT License

     */

    var toCodePoints = function (str) {

        var codePoints = [];

        var i = 0;

        var length = str.length;

        while (i < length) {

            var value = str.charCodeAt(i++);

            if (value >= 0xd800 && value <= 0xdbff && i < length) {

                var extra = str.charCodeAt(i++);

                if ((extra & 0xfc00) === 0xdc00) {

                    codePoints.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);

                }

                else {

                    codePoints.push(value);

                    i--;

                }

            }

            else {

                codePoints.push(value);

            }

        }

        return codePoints;

    };

    var fromCodePoint = function () {

        var codePoints = [];

        for (var _i = 0; _i < arguments.length; _i++) {

            codePoints[_i] = arguments[_i];

        }

        if (String.fromCodePoint) {

            return String.fromCodePoint.apply(String, codePoints);

        }

        var length = codePoints.length;

        if (!length) {

            return '';

        }

        var codeUnits = [];

        var index = -1;

        var result = '';

        while (++index < length) {

            var codePoint = codePoints[index];

            if (codePoint <= 0xffff) {

                codeUnits.push(codePoint);

            }

            else {

                codePoint -= 0x10000;

                codeUnits.push((codePoint >> 10) + 0xd800, codePoint % 0x400 + 0xdc00);

            }

            if (index + 1 === length || codeUnits.length > 0x4000) {

                result += String.fromCharCode.apply(String, codeUnits);

                codeUnits.length = 0;

            }

        }

        return result;

    };

    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    // Use a lookup table to find the index.

    var lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);

    for (var i = 0; i < chars.length; i++) {

        lookup[chars.charCodeAt(i)] = i;

    }

    var decode = function (base64) {

        var bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;

        if (base64[base64.length - 1] === '=') {

            bufferLength--;

            if (base64[base64.length - 2] === '=') {

                bufferLength--;

            }

        }

        var buffer = typeof ArrayBuffer !== 'undefined' &&

        typeof Uint8Array !== 'undefined' &&

        typeof Uint8Array.prototype.slice !== 'undefined'

            ? new ArrayBuffer(bufferLength)

            : new Array(bufferLength);

        var bytes = Array.isArray(buffer) ? buffer : new Uint8Array(buffer);

        for (i = 0; i < len; i += 4) {

            encoded1 = lookup[base64.charCodeAt(i)];

            encoded2 = lookup[base64.charCodeAt(i + 1)];

            encoded3 = lookup[base64.charCodeAt(i + 2)];

            encoded4 = lookup[base64.charCodeAt(i + 3)];

            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);

            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);

            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);

        }

        return buffer;

    };

    var polyUint16Array = function (buffer) {

        var length = buffer.length;

        var bytes = [];

        for (var i = 0; i < length; i += 2) {

            bytes.push((buffer[i + 1] << 8) | buffer[i]);

        }

        return bytes;

    };

    var polyUint32Array = function (buffer) {

        var length = buffer.length;

        var bytes = [];

        for (var i = 0; i < length; i += 4) {

            bytes.push((buffer[i + 3] << 24) | (buffer[i + 2] << 16) | (buffer[i + 1] << 8) | buffer[i]);

        }

        return bytes;

    };



    /** Shift size for getting the index-2 table offset. */

    var UTRIE2_SHIFT_2 = 5;

    /** Shift size for getting the index-1 table offset. */

    var UTRIE2_SHIFT_1 = 6 + 5;

    /**

     * Shift size for shifting left the index array values.

     * Increases possible data size with 16-bit index values at the cost

     * of compactability.

     * This requires data blocks to be aligned by UTRIE2_DATA_GRANULARITY.

     */

    var UTRIE2_INDEX_SHIFT = 2;

    /**

     * Difference between the two shift sizes,

     * for getting an index-1 offset from an index-2 offset. 6=11-5

     */

    var UTRIE2_SHIFT_1_2 = UTRIE2_SHIFT_1 - UTRIE2_SHIFT_2;

    /**

     * The part of the index-2 table for U+D800..U+DBFF stores values for

     * lead surrogate code _units_ not code _points_.

     * Values for lead surrogate code _points_ are indexed with this portion of the table.

     * Length=32=0x20=0x400>>UTRIE2_SHIFT_2. (There are 1024=0x400 lead surrogates.)

     */

    var UTRIE2_LSCP_INDEX_2_OFFSET = 0x10000 >> UTRIE2_SHIFT_2;

    /** Number of entries in a data block. 32=0x20 */

    var UTRIE2_DATA_BLOCK_LENGTH = 1 << UTRIE2_SHIFT_2;

    /** Mask for getting the lower bits for the in-data-block offset. */

    var UTRIE2_DATA_MASK = UTRIE2_DATA_BLOCK_LENGTH - 1;

    var UTRIE2_LSCP_INDEX_2_LENGTH = 0x400 >> UTRIE2_SHIFT_2;

    /** Count the lengths of both BMP pieces. 2080=0x820 */

    var UTRIE2_INDEX_2_BMP_LENGTH = UTRIE2_LSCP_INDEX_2_OFFSET + UTRIE2_LSCP_INDEX_2_LENGTH;

    /**

     * The 2-byte UTF-8 version of the index-2 table follows at offset 2080=0x820.

     * Length 32=0x20 for lead bytes C0..DF, regardless of UTRIE2_SHIFT_2.

     */

    var UTRIE2_UTF8_2B_INDEX_2_OFFSET = UTRIE2_INDEX_2_BMP_LENGTH;

    var UTRIE2_UTF8_2B_INDEX_2_LENGTH = 0x800 >> 6; /* U+0800 is the first code point after 2-byte UTF-8 */

    /**

     * The index-1 table, only used for supplementary code points, at offset 2112=0x840.

     * Variable length, for code points up to highStart, where the last single-value range starts.

     * Maximum length 512=0x200=0x100000>>UTRIE2_SHIFT_1.

     * (For 0x100000 supplementary code points U+10000..U+10ffff.)

     *

     * The part of the index-2 table for supplementary code points starts

     * after this index-1 table.

     *

     * Both the index-1 table and the following part of the index-2 table

     * are omitted completely if there is only BMP data.

     */

    var UTRIE2_INDEX_1_OFFSET = UTRIE2_UTF8_2B_INDEX_2_OFFSET + UTRIE2_UTF8_2B_INDEX_2_LENGTH;

    /**

     * Number of index-1 entries for the BMP. 32=0x20

     * This part of the index-1 table is omitted from the serialized form.

     */

    var UTRIE2_OMITTED_BMP_INDEX_1_LENGTH = 0x10000 >> UTRIE2_SHIFT_1;

    /** Number of entries in an index-2 block. 64=0x40 */

    var UTRIE2_INDEX_2_BLOCK_LENGTH = 1 << UTRIE2_SHIFT_1_2;

    /** Mask for getting the lower bits for the in-index-2-block offset. */

    var UTRIE2_INDEX_2_MASK = UTRIE2_INDEX_2_BLOCK_LENGTH - 1;

    var slice16 = function (view, start, end) {

        if (view.slice) {

            return view.slice(start, end);

        }

        return new Uint16Array(Array.prototype.slice.call(view, start, end));

    };

    var slice32 = function (view, start, end) {

        if (view.slice) {

            return view.slice(start, end);

        }

        return new Uint32Array(Array.prototype.slice.call(view, start, end));

    };

    var createTrieFromBase64 = function (base64) {

        var buffer = decode(base64);

        var view32 = Array.isArray(buffer) ? polyUint32Array(buffer) : new Uint32Array(buffer);

        var view16 = Array.isArray(buffer) ? polyUint16Array(buffer) : new Uint16Array(buffer);

        var headerLength = 24;

        var index = slice16(view16, headerLength / 2, view32[4] / 2);

        var data = view32[5] === 2

            ? slice16(view16, (headerLength + view32[4]) / 2)

            : slice32(view32, Math.ceil((headerLength + view32[4]) / 4));

        return new Trie(view32[0], view32[1], view32[2], view32[3], index, data);

    };

    var Trie = /** @class */ (function () {

        function Trie(initialValue, errorValue, highStart, highValueIndex, index, data) {

            this.initialValue = initialValue;

            this.errorValue = errorValue;

            this.highStart = highStart;

            this.highValueIndex = highValueIndex;

            this.index = index;

            this.data = data;

        }

        /**

         * Get the value for a code point as stored in the Trie.

         *

         * @param codePoint the code point

         * @return the value

         */

        Trie.prototype.get = function (codePoint) {

            var ix;

            if (codePoint >= 0) {

                if (codePoint < 0x0d800 || (codePoint > 0x0dbff && codePoint <= 0x0ffff)) {

                    // Ordinary BMP code point, excluding leading surrogates.

                    // BMP uses a single level lookup.  BMP index starts at offset 0 in the Trie2 index.

                    // 16 bit data is stored in the index array itself.

                    ix = this.index[codePoint >> UTRIE2_SHIFT_2];

                    ix = (ix << UTRIE2_INDEX_SHIFT) + (codePoint & UTRIE2_DATA_MASK);

                    return this.data[ix];

                }

                if (codePoint <= 0xffff) {

                    // Lead Surrogate Code Point.  A Separate index section is stored for

                    // lead surrogate code units and code points.

                    //   The main index has the code unit data.

                    //   For this function, we need the code point data.

                    // Note: this expression could be refactored for slightly improved efficiency, but

                    //       surrogate code points will be so rare in practice that it's not worth it.

                    ix = this.index[UTRIE2_LSCP_INDEX_2_OFFSET + ((codePoint - 0xd800) >> UTRIE2_SHIFT_2)];

                    ix = (ix << UTRIE2_INDEX_SHIFT) + (codePoint & UTRIE2_DATA_MASK);

                    return this.data[ix];

                }

                if (codePoint < this.highStart) {

                    // Supplemental code point, use two-level lookup.

                    ix = UTRIE2_INDEX_1_OFFSET - UTRIE2_OMITTED_BMP_INDEX_1_LENGTH + (codePoint >> UTRIE2_SHIFT_1);

                    ix = this.index[ix];

                    ix += (codePoint >> UTRIE2_SHIFT_2) & UTRIE2_INDEX_2_MASK;

                    ix = this.index[ix];

                    ix = (ix << UTRIE2_INDEX_SHIFT) + (codePoint & UTRIE2_DATA_MASK);

                    return this.data[ix];

                }

                if (codePoint <= 0x10ffff) {

                    return this.data[this.highValueIndex];

                }

            }

            // Fall through.  The code point is outside of the legal range of 0..0x10ffff.

            return this.errorValue;

        };

        return Trie;

    }());



    var base64 = 'KwAAAAAAAAAACA4AIDoAAPAfAAACAAAAAAAIABAAGABAAEgAUABYAF4AZgBeAGYAYABoAHAAeABeAGYAfACEAIAAiACQAJgAoACoAK0AtQC9AMUAXgBmAF4AZgBeAGYAzQDVAF4AZgDRANkA3gDmAOwA9AD8AAQBDAEUARoBIgGAAIgAJwEvATcBPwFFAU0BTAFUAVwBZAFsAXMBewGDATAAiwGTAZsBogGkAawBtAG8AcIBygHSAdoB4AHoAfAB+AH+AQYCDgIWAv4BHgImAi4CNgI+AkUCTQJTAlsCYwJrAnECeQKBAk0CiQKRApkCoQKoArACuALAAsQCzAIwANQC3ALkAjAA7AL0AvwCAQMJAxADGAMwACADJgMuAzYDPgOAAEYDSgNSA1IDUgNaA1oDYANiA2IDgACAAGoDgAByA3YDfgOAAIQDgACKA5IDmgOAAIAAogOqA4AAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAK8DtwOAAIAAvwPHA88D1wPfAyAD5wPsA/QD/AOAAIAABAQMBBIEgAAWBB4EJgQuBDMEIAM7BEEEXgBJBCADUQRZBGEEaQQwADAAcQQ+AXkEgQSJBJEEgACYBIAAoASoBK8EtwQwAL8ExQSAAIAAgACAAIAAgACgAM0EXgBeAF4AXgBeAF4AXgBeANUEXgDZBOEEXgDpBPEE+QQBBQkFEQUZBSEFKQUxBTUFPQVFBUwFVAVcBV4AYwVeAGsFcwV7BYMFiwWSBV4AmgWgBacFXgBeAF4AXgBeAKsFXgCyBbEFugW7BcIFwgXIBcIFwgXQBdQF3AXkBesF8wX7BQMGCwYTBhsGIwYrBjMGOwZeAD8GRwZNBl4AVAZbBl4AXgBeAF4AXgBeAF4AXgBeAF4AXgBeAGMGXgBqBnEGXgBeAF4AXgBeAF4AXgBeAF4AXgB5BoAG4wSGBo4GkwaAAIADHgR5AF4AXgBeAJsGgABGA4AAowarBrMGswagALsGwwbLBjAA0wbaBtoG3QbaBtoG2gbaBtoG2gblBusG8wb7BgMHCwcTBxsHCwcjBysHMAc1BzUHOgdCB9oGSgdSB1oHYAfaBloHaAfaBlIH2gbaBtoG2gbaBtoG2gbaBjUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHbQdeAF4ANQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQd1B30HNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B4MH2gaKB68EgACAAIAAgACAAIAAgACAAI8HlwdeAJ8HpweAAIAArwe3B14AXgC/B8UHygcwANAH2AfgB4AA6AfwBz4B+AcACFwBCAgPCBcIogEYAR8IJwiAAC8INwg/CCADRwhPCFcIXwhnCEoDGgSAAIAAgABvCHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIhAiLCI4IMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAANQc1BzUHNQc1BzUHNQc1BzUHNQc1B54INQc1B6II2gaqCLIIugiAAIAAvgjGCIAAgACAAIAAgACAAIAAgACAAIAAywiHAYAA0wiAANkI3QjlCO0I9Aj8CIAAgACAAAIJCgkSCRoJIgknCTYHLwk3CZYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiAAIAAAAFAAXgBeAGAAcABeAHwAQACQAKAArQC9AJ4AXgBeAE0A3gBRAN4A7AD8AMwBGgEAAKcBNwEFAUwBXAF4QkhCmEKnArcCgAHHAsABz4LAAcABwAHAAd+C6ABoAG+C/4LAAcABwAHAAc+DF4MAAcAB54M3gweDV4Nng3eDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEeDqABVg6WDqABoQ6gAaABoAHXDvcONw/3DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DncPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB7cPPwlGCU4JMACAAIAAgABWCV4JYQmAAGkJcAl4CXwJgAkwADAAMAAwAIgJgACLCZMJgACZCZ8JowmrCYAAswkwAF4AXgB8AIAAuwkABMMJyQmAAM4JgADVCTAAMAAwADAAgACAAIAAgACAAIAAgACAAIAAqwYWBNkIMAAwADAAMADdCeAJ6AnuCR4E9gkwAP4JBQoNCjAAMACAABUK0wiAAB0KJAosCjQKgAAwADwKQwqAAEsKvQmdCVMKWwowADAAgACAALcEMACAAGMKgABrCjAAMAAwADAAMAAwADAAMAAwADAAMAAeBDAAMAAwADAAMAAwADAAMAAwADAAMAAwAIkEPQFzCnoKiQSCCooKkAqJBJgKoAqkCokEGAGsCrQKvArBCjAAMADJCtEKFQHZCuEK/gHpCvEKMAAwADAAMACAAIwE+QowAIAAPwEBCzAAMAAwADAAMACAAAkLEQswAIAAPwEZCyELgAAOCCkLMAAxCzkLMAAwADAAMAAwADAAXgBeAEELMAAwADAAMAAwADAAMAAwAEkLTQtVC4AAXAtkC4AAiQkwADAAMAAwADAAMAAwADAAbAtxC3kLgAuFC4sLMAAwAJMLlwufCzAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAApwswADAAMACAAIAAgACvC4AAgACAAIAAgACAALcLMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAvwuAAMcLgACAAIAAgACAAIAAyguAAIAAgACAAIAA0QswADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAANkLgACAAIAA4AswADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACJCR4E6AswADAAhwHwC4AA+AsADAgMEAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMACAAIAAGAwdDCUMMAAwAC0MNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQw1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHPQwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADUHNQc1BzUHNQc1BzUHNQc2BzAAMAA5DDUHNQc1BzUHNQc1BzUHNQc1BzUHNQdFDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAgACAAIAATQxSDFoMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAF4AXgBeAF4AXgBeAF4AYgxeAGoMXgBxDHkMfwxeAIUMXgBeAI0MMAAwADAAMAAwAF4AXgCVDJ0MMAAwADAAMABeAF4ApQxeAKsMswy7DF4Awgy9DMoMXgBeAF4AXgBeAF4AXgBeAF4AXgDRDNkMeQBqCeAM3Ax8AOYM7Az0DPgMXgBeAF4AXgBeAF4AXgBeAF4AXgBeAF4AXgBeAF4AXgCgAAANoAAHDQ4NFg0wADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAeDSYNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIAAgACAAIAAgACAAC4NMABeAF4ANg0wADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAD4NRg1ODVYNXg1mDTAAbQ0wADAAMAAwADAAMAAwADAA2gbaBtoG2gbaBtoG2gbaBnUNeg3CBYANwgWFDdoGjA3aBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gaUDZwNpA2oDdoG2gawDbcNvw3HDdoG2gbPDdYN3A3fDeYN2gbsDfMN2gbaBvoN/g3aBgYODg7aBl4AXgBeABYOXgBeACUG2gYeDl4AJA5eACwO2w3aBtoGMQ45DtoG2gbaBtoGQQ7aBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gZJDjUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B1EO2gY1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQdZDjUHNQc1BzUHNQc1B2EONQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHaA41BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B3AO2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gY1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B2EO2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gZJDtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBkkOeA6gAKAAoAAwADAAMAAwAKAAoACgAKAAoACgAKAAgA4wADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAD//wQABAAEAAQABAAEAAQABAAEAA0AAwABAAEAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAKABMAFwAeABsAGgAeABcAFgASAB4AGwAYAA8AGAAcAEsASwBLAEsASwBLAEsASwBLAEsAGAAYAB4AHgAeABMAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAFgAbABIAHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYADQARAB4ABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkAFgAaABsAGwAbAB4AHQAdAB4ATwAXAB4ADQAeAB4AGgAbAE8ATwAOAFAAHQAdAB0ATwBPABcATwBPAE8AFgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwArAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAAQABAANAA0ASwBLAEsASwBLAEsASwBLAEsASwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUAArACsABABQAAQABAAEAAQABAAEAAQAKwArAAQABAArACsABAAEAAQAUAArACsAKwArACsAKwArACsABAArACsAKwArAFAAUAArAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAGgAaAFAAUABQAFAAUABMAB4AGwBQAB4AKwArACsABAAEAAQAKwBQAFAAUABQAFAAUAArACsAKwArAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUAArAFAAUAArACsABAArAAQABAAEAAQABAArACsAKwArAAQABAArACsABAAEAAQAKwArACsABAArACsAKwArACsAKwArAFAAUABQAFAAKwBQACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwAEAAQAUABQAFAABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUAArACsABABQAAQABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQAKwArAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwAeABsAKwArACsAKwArACsAKwBQAAQABAAEAAQABAAEACsABAAEAAQAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwArAAQABAArACsABAAEAAQAKwArACsAKwArACsAKwArAAQABAArACsAKwArAFAAUAArAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwAeAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwAEAFAAKwBQAFAAUABQAFAAUAArACsAKwBQAFAAUAArAFAAUABQAFAAKwArACsAUABQACsAUAArAFAAUAArACsAKwBQAFAAKwArACsAUABQAFAAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQAKwArACsABAAEAAQAKwAEAAQABAAEACsAKwBQACsAKwArACsAKwArAAQAKwArACsAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAB4AHgAeAB4AHgAeABsAHgArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABAArACsAKwArACsAKwArAAQABAArAFAAUABQACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAB4AUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABAArACsAKwArACsAKwArAAQABAArACsAKwArACsAKwArAFAAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwArAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAKwBcAFwAKwBcACsAKwBcACsAKwArACsAKwArAFwAXABcAFwAKwBcAFwAXABcAFwAXABcACsAXABcAFwAKwBcACsAXAArACsAXABcACsAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgArACoAKgBcACsAKwBcAFwAXABcAFwAKwBcACsAKgAqACoAKgAqACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAFwAXABcAFwAUAAOAA4ADgAOAB4ADgAOAAkADgAOAA0ACQATABMAEwATABMACQAeABMAHgAeAB4ABAAEAB4AHgAeAB4AHgAeAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUAANAAQAHgAEAB4ABAAWABEAFgARAAQABABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAAQABAAEAAQABAANAAQABABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsADQANAB4AHgAeAB4AHgAeAAQAHgAeAB4AHgAeAB4AKwAeAB4ADgAOAA0ADgAeAB4AHgAeAB4ACQAJACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgAeAB4AHgBcAFwAXABcAFwAXAAqACoAKgAqAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAKgAqACoAKgAqACoAKgBcAFwAXAAqACoAKgAqAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAXAAqAEsASwBLAEsASwBLAEsASwBLAEsAKgAqACoAKgAqACoAUABQAFAAUABQAFAAKwBQACsAKwArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQACsAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwAEAAQABAAeAA0AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAEQArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAADQANAA0AUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAA0ADQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoADQANABUAXAANAB4ADQAbAFwAKgArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAB4AHgATABMADQANAA4AHgATABMAHgAEAAQABAAJACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAUABQAFAAUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwAeACsAKwArABMAEwBLAEsASwBLAEsASwBLAEsASwBLAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwBcAFwAXABcAFwAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcACsAKwArACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwAeAB4AXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgArACsABABLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKgAqACoAKgAqACoAKgBcACoAKgAqACoAKgAqACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAUABQAFAAUABQAFAAUAArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4ADQANAA0ADQAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAHgAeAB4AHgBQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwANAA0ADQANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwBQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsABAAEAAQAHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAABABQAFAAUABQAAQABAAEAFAAUAAEAAQABAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAKwBQACsAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAKwArAB4AHgAeAB4AHgAeACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAUABQAFAAKwAeAB4AHgAeAB4AHgAeAA4AHgArAA0ADQANAA0ADQANAA0ACQANAA0ADQAIAAQACwAEAAQADQAJAA0ADQAMAB0AHQAeABcAFwAWABcAFwAXABYAFwAdAB0AHgAeABQAFAAUAA0AAQABAAQABAAEAAQABAAJABoAGgAaABoAGgAaABoAGgAeABcAFwAdABUAFQAeAB4AHgAeAB4AHgAYABYAEQAVABUAFQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgANAB4ADQANAA0ADQAeAA0ADQANAAcAHgAeAB4AHgArAAQABAAEAAQABAAEAAQABAAEAAQAUABQACsAKwBPAFAAUABQAFAAUAAeAB4AHgAWABEATwBQAE8ATwBPAE8AUABQAFAAUABQAB4AHgAeABYAEQArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAGwAbABsAGwAbABsAGwAaABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAaABsAGwAbABsAGgAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgBQABoAHgAdAB4AUAAeABoAHgAeAB4AHgAeAB4AHgAeAB4ATwAeAFAAGwAeAB4AUABQAFAAUABQAB4AHgAeAB0AHQAeAFAAHgBQAB4AUAAeAFAATwBQAFAAHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AUABQAFAAUABPAE8AUABQAFAAUABQAE8AUABQAE8AUABPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAE8ATwBPAE8ATwBPAE8ATwBPAE8AUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAATwAeAB4AKwArACsAKwAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB0AHQAeAB4AHgAdAB0AHgAeAB0AHgAeAB4AHQAeAB0AGwAbAB4AHQAeAB4AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB0AHgAdAB4AHQAdAB0AHQAdAB0AHgAdAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAdAB0AHQAdAB4AHgAdAB0AHgAeAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABQAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAlACUAHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBQAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAeAB4AHgAeAB0AHQAeAB4AHgAeAB0AHQAdAB4AHgAdAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB0AHQAeAB4AHQAeAB4AHgAeAB0AHQAeAB4AHgAeACUAJQAdAB0AJQAeACUAJQAlACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAHgAeAB4AHgAdAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHQAdAB0AHgAdACUAHQAdAB4AHQAdAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHQAdAB0AHQAlAB4AJQAlACUAHQAlACUAHQAdAB0AJQAlAB0AHQAlAB0AHQAlACUAJQAeAB0AHgAeAB4AHgAdAB0AJQAdAB0AHQAdAB0AHQAlACUAJQAlACUAHQAlACUAIAAlAB0AHQAlACUAJQAlACUAJQAlACUAHgAeAB4AJQAlACAAIAAgACAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeABcAFwAXABcAFwAXAB4AEwATACUAHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwArACUAJQBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAKwArACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAE8ATwBPAE8ATwBPAE8ATwAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeACsAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUAArACsAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQBQAFAAUABQACsAKwArACsAUABQAFAAUABQAFAAUABQAA0AUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQACsAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgBQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAABAAEAAQAKwAEAAQAKwArACsAKwArAAQABAAEAAQAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsABAAEAAQAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsADQANAA0ADQANAA0ADQANAB4AKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AUABQAFAAUABQAFAAUABQAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAUABQAFAAUABQAA0ADQANAA0ADQANABQAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwANAA0ADQANAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAeAAQABAAEAB4AKwArAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLACsADQArAB4AKwArAAQABAAEAAQAUABQAB4AUAArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwAEAAQABAAEAAQABAAEAAQABAAOAA0ADQATABMAHgAeAB4ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0AUABQAFAAUAAEAAQAKwArAAQADQANAB4AUAArACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXABcAA0ADQANACoASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUAArACsAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANACsADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEcARwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQACsAKwAeAAQABAANAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAEAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUAArACsAUAArACsAUABQACsAKwBQAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AKwArAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAeAB4ADQANAA0ADQAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAArAAQABAArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAEAAQABAAEAAQABAAEACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAFgAWAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAKwBQACsAKwArACsAKwArAFAAKwArACsAKwBQACsAUAArAFAAKwBQAFAAUAArAFAAUAArAFAAKwArAFAAKwBQACsAUAArAFAAKwBQACsAUABQACsAUAArACsAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAUABQAFAAUAArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUAArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAlACUAJQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeACUAJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeACUAJQAlACUAJQAeACUAJQAlACUAJQAgACAAIAAlACUAIAAlACUAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIQAhACEAIQAhACUAJQAgACAAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAgACAAIAAlACUAJQAlACAAJQAgACAAIAAgACAAIAAgACAAIAAlACUAJQAgACUAJQAlACUAIAAgACAAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeACUAHgAlAB4AJQAlACUAJQAlACAAJQAlACUAJQAeACUAHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAgACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAlACUAJQAlACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAIAAgACAAJQAlACUAIAAgACAAIAAgAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFwAXABcAFQAVABUAHgAeAB4AHgAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAgACAAJQAlACUAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAlACAAIAAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsA';



    /* @flow */

    var LETTER_NUMBER_MODIFIER = 50;

    // Non-tailorable Line Breaking Classes

    var BK = 1; //  Cause a line break (after)

    var CR = 2; //  Cause a line break (after), except between CR and LF

    var LF = 3; //  Cause a line break (after)

    var CM = 4; //  Prohibit a line break between the character and the preceding character

    var NL = 5; //  Cause a line break (after)

    var WJ = 7; //  Prohibit line breaks before and after

    var ZW = 8; //  Provide a break opportunity

    var GL = 9; //  Prohibit line breaks before and after

    var SP = 10; // Enable indirect line breaks

    var ZWJ = 11; // Prohibit line breaks within joiner sequences

    // Break Opportunities

    var B2 = 12; //  Provide a line break opportunity before and after the character

    var BA = 13; //  Generally provide a line break opportunity after the character

    var BB = 14; //  Generally provide a line break opportunity before the character

    var HY = 15; //  Provide a line break opportunity after the character, except in numeric context

    var CB = 16; //   Provide a line break opportunity contingent on additional information

    // Characters Prohibiting Certain Breaks

    var CL = 17; //  Prohibit line breaks before

    var CP = 18; //  Prohibit line breaks before

    var EX = 19; //  Prohibit line breaks before

    var IN = 20; //  Allow only indirect line breaks between pairs

    var NS = 21; //  Allow only indirect line breaks before

    var OP = 22; //  Prohibit line breaks after

    var QU = 23; //  Act like they are both opening and closing

    // Numeric Context

    var IS = 24; //  Prevent breaks after any and before numeric

    var NU = 25; //  Form numeric expressions for line breaking purposes

    var PO = 26; //  Do not break following a numeric expression

    var PR = 27; //  Do not break in front of a numeric expression

    var SY = 28; //  Prevent a break before; and allow a break after

    // Other Characters

    var AI = 29; //  Act like AL when the resolvedEAW is N; otherwise; act as ID

    var AL = 30; //  Are alphabetic characters or symbols that are used with alphabetic characters

    var CJ = 31; //  Treat as NS or ID for strict or normal breaking.

    var EB = 32; //  Do not break from following Emoji Modifier

    var EM = 33; //  Do not break from preceding Emoji Base

    var H2 = 34; //  Form Korean syllable blocks

    var H3 = 35; //  Form Korean syllable blocks

    var HL = 36; //  Do not break around a following hyphen; otherwise act as Alphabetic

    var ID = 37; //  Break before or after; except in some numeric context

    var JL = 38; //  Form Korean syllable blocks

    var JV = 39; //  Form Korean syllable blocks

    var JT = 40; //  Form Korean syllable blocks

    var RI = 41; //  Keep pairs together. For pairs; break before and after other classes

    var SA = 42; //  Provide a line break opportunity contingent on additional, language-specific context analysis

    var XX = 43; //  Have as yet unknown line breaking behavior or unassigned code positions

    var BREAK_MANDATORY = '!';

    var BREAK_NOT_ALLOWED = '×';

    var BREAK_ALLOWED = '÷';

    var UnicodeTrie = createTrieFromBase64(base64);

    var ALPHABETICS = [AL, HL];

    var HARD_LINE_BREAKS = [BK, CR, LF, NL];

    var SPACE = [SP, ZW];

    var PREFIX_POSTFIX = [PR, PO];

    var LINE_BREAKS = HARD_LINE_BREAKS.concat(SPACE);

    var KOREAN_SYLLABLE_BLOCK = [JL, JV, JT, H2, H3];

    var HYPHEN = [HY, BA];

    var codePointsToCharacterClasses = function (codePoints, lineBreak) {

        if (lineBreak === void 0) { lineBreak = 'strict'; }

        var types = [];

        var indicies = [];

        var categories = [];

        codePoints.forEach(function (codePoint, index) {

            var classType = UnicodeTrie.get(codePoint);

            if (classType > LETTER_NUMBER_MODIFIER) {

                categories.push(true);

                classType -= LETTER_NUMBER_MODIFIER;

            }

            else {

                categories.push(false);

            }

            if (['normal', 'auto', 'loose'].indexOf(lineBreak) !== -1) {

                // U+2010, – U+2013, 〜 U+301C, ゠ U+30A0

                if ([0x2010, 0x2013, 0x301c, 0x30a0].indexOf(codePoint) !== -1) {

                    indicies.push(index);

                    return types.push(CB);

                }

            }

            if (classType === CM || classType === ZWJ) {

                // LB10 Treat any remaining combining mark or ZWJ as AL.

                if (index === 0) {

                    indicies.push(index);

                    return types.push(AL);

                }

                // LB9 Do not break a combining character sequence; treat it as if it has the line breaking class of

                // the base character in all of the following rules. Treat ZWJ as if it were CM.

                var prev = types[index - 1];

                if (LINE_BREAKS.indexOf(prev) === -1) {

                    indicies.push(indicies[index - 1]);

                    return types.push(prev);

                }

                indicies.push(index);

                return types.push(AL);

            }

            indicies.push(index);

            if (classType === CJ) {

                return types.push(lineBreak === 'strict' ? NS : ID);

            }

            if (classType === SA) {

                return types.push(AL);

            }

            if (classType === AI) {

                return types.push(AL);

            }

            // For supplementary characters, a useful default is to treat characters in the range 10000..1FFFD as AL

            // and characters in the ranges 20000..2FFFD and 30000..3FFFD as ID, until the implementation can be revised

            // to take into account the actual line breaking properties for these characters.

            if (classType === XX) {

                if ((codePoint >= 0x20000 && codePoint <= 0x2fffd) || (codePoint >= 0x30000 && codePoint <= 0x3fffd)) {

                    return types.push(ID);

                }

                else {

                    return types.push(AL);

                }

            }

            types.push(classType);

        });

        return [indicies, types, categories];

    };

    var isAdjacentWithSpaceIgnored = function (a, b, currentIndex, classTypes) {

        var current = classTypes[currentIndex];

        if (Array.isArray(a) ? a.indexOf(current) !== -1 : a === current) {

            var i = currentIndex;

            while (i <= classTypes.length) {

                i++;

                var next = classTypes[i];

                if (next === b) {

                    return true;

                }

                if (next !== SP) {

                    break;

                }

            }

        }

        if (current === SP) {

            var i = currentIndex;

            while (i > 0) {

                i--;

                var prev = classTypes[i];

                if (Array.isArray(a) ? a.indexOf(prev) !== -1 : a === prev) {

                    var n = currentIndex;

                    while (n <= classTypes.length) {

                        n++;

                        var next = classTypes[n];

                        if (next === b) {

                            return true;

                        }

                        if (next !== SP) {

                            break;

                        }

                    }

                }

                if (prev !== SP) {

                    break;

                }

            }

        }

        return false;

    };

    var previousNonSpaceClassType = function (currentIndex, classTypes) {

        var i = currentIndex;

        while (i >= 0) {

            var type = classTypes[i];

            if (type === SP) {

                i--;

            }

            else {

                return type;

            }

        }

        return 0;

    };

    var _lineBreakAtIndex = function (codePoints, classTypes, indicies, index, forbiddenBreaks) {

        if (indicies[index] === 0) {

            return BREAK_NOT_ALLOWED;

        }

        var currentIndex = index - 1;

        if (Array.isArray(forbiddenBreaks) && forbiddenBreaks[currentIndex] === true) {

            return BREAK_NOT_ALLOWED;

        }

        var beforeIndex = currentIndex - 1;

        var afterIndex = currentIndex + 1;

        var current = classTypes[currentIndex];

        // LB4 Always break after hard line breaks.

        // LB5 Treat CR followed by LF, as well as CR, LF, and NL as hard line breaks.

        var before = beforeIndex >= 0 ? classTypes[beforeIndex] : 0;

        var next = classTypes[afterIndex];

        if (current === CR && next === LF) {

            return BREAK_NOT_ALLOWED;

        }

        if (HARD_LINE_BREAKS.indexOf(current) !== -1) {

            return BREAK_MANDATORY;

        }

        // LB6 Do not break before hard line breaks.

        if (HARD_LINE_BREAKS.indexOf(next) !== -1) {

            return BREAK_NOT_ALLOWED;

        }

        // LB7 Do not break before spaces or zero width space.

        if (SPACE.indexOf(next) !== -1) {

            return BREAK_NOT_ALLOWED;

        }

        // LB8 Break before any character following a zero-width space, even if one or more spaces intervene.

        if (previousNonSpaceClassType(currentIndex, classTypes) === ZW) {

            return BREAK_ALLOWED;

        }

        // LB8a Do not break between a zero width joiner and an ideograph, emoji base or emoji modifier.

        if (UnicodeTrie.get(codePoints[currentIndex]) === ZWJ && (next === ID || next === EB || next === EM)) {

            return BREAK_NOT_ALLOWED;

        }

        // LB11 Do not break before or after Word joiner and related characters.

        if (current === WJ || next === WJ) {

            return BREAK_NOT_ALLOWED;

        }

        // LB12 Do not break after NBSP and related characters.

        if (current === GL) {

            return BREAK_NOT_ALLOWED;

        }

        // LB12a Do not break before NBSP and related characters, except after spaces and hyphens.

        if ([SP, BA, HY].indexOf(current) === -1 && next === GL) {

            return BREAK_NOT_ALLOWED;

        }

        // LB13 Do not break before ‘]’ or ‘!’ or ‘;’ or ‘/’, even after spaces.

        if ([CL, CP, EX, IS, SY].indexOf(next) !== -1) {

            return BREAK_NOT_ALLOWED;

        }

        // LB14 Do not break after ‘[’, even after spaces.

        if (previousNonSpaceClassType(currentIndex, classTypes) === OP) {

            return BREAK_NOT_ALLOWED;

        }

        // LB15 Do not break within ‘”[’, even with intervening spaces.

        if (isAdjacentWithSpaceIgnored(QU, OP, currentIndex, classTypes)) {

            return BREAK_NOT_ALLOWED;

        }

        // LB16 Do not break between closing punctuation and a nonstarter (lb=NS), even with intervening spaces.

        if (isAdjacentWithSpaceIgnored([CL, CP], NS, currentIndex, classTypes)) {

            return BREAK_NOT_ALLOWED;

        }

        // LB17 Do not break within ‘——’, even with intervening spaces.

        if (isAdjacentWithSpaceIgnored(B2, B2, currentIndex, classTypes)) {

            return BREAK_NOT_ALLOWED;

        }

        // LB18 Break after spaces.

        if (current === SP) {

            return BREAK_ALLOWED;

        }

        // LB19 Do not break before or after quotation marks, such as ‘ ” ’.

        if (current === QU || next === QU) {

            return BREAK_NOT_ALLOWED;

        }

        // LB20 Break before and after unresolved CB.

        if (next === CB || current === CB) {

            return BREAK_ALLOWED;

        }

        // LB21 Do not break before hyphen-minus, other hyphens, fixed-width spaces, small kana, and other non-starters, or after acute accents.

        if ([BA, HY, NS].indexOf(next) !== -1 || current === BB) {

            return BREAK_NOT_ALLOWED;

        }

        // LB21a Don't break after Hebrew + Hyphen.

        if (before === HL && HYPHEN.indexOf(current) !== -1) {

            return BREAK_NOT_ALLOWED;

        }

        // LB21b Don’t break between Solidus and Hebrew letters.

        if (current === SY && next === HL) {

            return BREAK_NOT_ALLOWED;

        }

        // LB22 Do not break between two ellipses, or between letters, numbers or exclamations and ellipsis.

        if (next === IN && ALPHABETICS.concat(IN, EX, NU, ID, EB, EM).indexOf(current) !== -1) {

            return BREAK_NOT_ALLOWED;

        }

        // LB23 Do not break between digits and letters.

        if ((ALPHABETICS.indexOf(next) !== -1 && current === NU) || (ALPHABETICS.indexOf(current) !== -1 && next === NU)) {

            return BREAK_NOT_ALLOWED;

        }

        // LB23a Do not break between numeric prefixes and ideographs, or between ideographs and numeric postfixes.

        if ((current === PR && [ID, EB, EM].indexOf(next) !== -1) ||

            ([ID, EB, EM].indexOf(current) !== -1 && next === PO)) {

            return BREAK_NOT_ALLOWED;

        }

        // LB24 Do not break between numeric prefix/postfix and letters, or between letters and prefix/postfix.

        if ((ALPHABETICS.indexOf(current) !== -1 && PREFIX_POSTFIX.indexOf(next) !== -1) ||

            (PREFIX_POSTFIX.indexOf(current) !== -1 && ALPHABETICS.indexOf(next) !== -1)) {

            return BREAK_NOT_ALLOWED;

        }

        // LB25 Do not break between the following pairs of classes relevant to numbers:

        if (

            // (PR | PO) × ( OP | HY )? NU

            ([PR, PO].indexOf(current) !== -1 &&

                (next === NU || ([OP, HY].indexOf(next) !== -1 && classTypes[afterIndex + 1] === NU))) ||

            // ( OP | HY ) × NU

            ([OP, HY].indexOf(current) !== -1 && next === NU) ||

            // NU ×	(NU | SY | IS)

            (current === NU && [NU, SY, IS].indexOf(next) !== -1)) {

            return BREAK_NOT_ALLOWED;

        }

        // NU (NU | SY | IS)* × (NU | SY | IS | CL | CP)

        if ([NU, SY, IS, CL, CP].indexOf(next) !== -1) {

            var prevIndex = currentIndex;

            while (prevIndex >= 0) {

                var type = classTypes[prevIndex];

                if (type === NU) {

                    return BREAK_NOT_ALLOWED;

                }

                else if ([SY, IS].indexOf(type) !== -1) {

                    prevIndex--;

                }

                else {

                    break;

                }

            }

        }

        // NU (NU | SY | IS)* (CL | CP)? × (PO | PR))

        if ([PR, PO].indexOf(next) !== -1) {

            var prevIndex = [CL, CP].indexOf(current) !== -1 ? beforeIndex : currentIndex;

            while (prevIndex >= 0) {

                var type = classTypes[prevIndex];

                if (type === NU) {

                    return BREAK_NOT_ALLOWED;

                }

                else if ([SY, IS].indexOf(type) !== -1) {

                    prevIndex--;

                }

                else {

                    break;

                }

            }

        }

        // LB26 Do not break a Korean syllable.

        if ((JL === current && [JL, JV, H2, H3].indexOf(next) !== -1) ||

            ([JV, H2].indexOf(current) !== -1 && [JV, JT].indexOf(next) !== -1) ||

            ([JT, H3].indexOf(current) !== -1 && next === JT)) {

            return BREAK_NOT_ALLOWED;

        }

        // LB27 Treat a Korean Syllable Block the same as ID.

        if ((KOREAN_SYLLABLE_BLOCK.indexOf(current) !== -1 && [IN, PO].indexOf(next) !== -1) ||

            (KOREAN_SYLLABLE_BLOCK.indexOf(next) !== -1 && current === PR)) {

            return BREAK_NOT_ALLOWED;

        }

        // LB28 Do not break between alphabetics (“at”).

        if (ALPHABETICS.indexOf(current) !== -1 && ALPHABETICS.indexOf(next) !== -1) {

            return BREAK_NOT_ALLOWED;

        }

        // LB29 Do not break between numeric punctuation and alphabetics (“e.g.”).

        if (current === IS && ALPHABETICS.indexOf(next) !== -1) {

            return BREAK_NOT_ALLOWED;

        }

        // LB30 Do not break between letters, numbers, or ordinary symbols and opening or closing parentheses.

        if ((ALPHABETICS.concat(NU).indexOf(current) !== -1 && next === OP) ||

            (ALPHABETICS.concat(NU).indexOf(next) !== -1 && current === CP)) {

            return BREAK_NOT_ALLOWED;

        }

        // LB30a Break between two regional indicator symbols if and only if there are an even number of regional

        // indicators preceding the position of the break.

        if (current === RI && next === RI) {

            var i = indicies[currentIndex];

            var count = 1;

            while (i > 0) {

                i--;

                if (classTypes[i] === RI) {

                    count++;

                }

                else {

                    break;

                }

            }

            if (count % 2 !== 0) {

                return BREAK_NOT_ALLOWED;

            }

        }

        // LB30b Do not break between an emoji base and an emoji modifier.

        if (current === EB && next === EM) {

            return BREAK_NOT_ALLOWED;

        }

        return BREAK_ALLOWED;

    };

    var cssFormattedClasses = function (codePoints, options) {

        if (!options) {

            options = { lineBreak: 'normal', wordBreak: 'normal' };

        }

        var _a = codePointsToCharacterClasses(codePoints, options.lineBreak), indicies = _a[0], classTypes = _a[1], isLetterNumber = _a[2];

        if (options.wordBreak === 'break-all' || options.wordBreak === 'break-word') {

            classTypes = classTypes.map(function (type) { return ([NU, AL, SA].indexOf(type) !== -1 ? ID : type); });

        }

        var forbiddenBreakpoints = options.wordBreak === 'keep-all'

            ? isLetterNumber.map(function (letterNumber, i) {

                return letterNumber && codePoints[i] >= 0x4e00 && codePoints[i] <= 0x9fff;

            })

            : undefined;

        return [indicies, classTypes, forbiddenBreakpoints];

    };

    var Break = /** @class */ (function () {

        function Break(codePoints, lineBreak, start, end) {

            this.codePoints = codePoints;

            this.required = lineBreak === BREAK_MANDATORY;

            this.start = start;

            this.end = end;

        }

        Break.prototype.slice = function () {

            return fromCodePoint.apply(void 0, this.codePoints.slice(this.start, this.end));

        };

        return Break;

    }());

    var LineBreaker = function (str, options) {

        var codePoints = toCodePoints(str);

        var _a = cssFormattedClasses(codePoints, options), indicies = _a[0], classTypes = _a[1], forbiddenBreakpoints = _a[2];

        var length = codePoints.length;

        var lastEnd = 0;

        var nextIndex = 0;

        return {

            next: function () {

                if (nextIndex >= length) {

                    return { done: true, value: null };

                }

                var lineBreak = BREAK_NOT_ALLOWED;

                while (nextIndex < length &&

                (lineBreak = _lineBreakAtIndex(codePoints, classTypes, indicies, ++nextIndex, forbiddenBreakpoints)) ===

                BREAK_NOT_ALLOWED) { }

                if (lineBreak !== BREAK_NOT_ALLOWED || nextIndex === length) {

                    var value = new Break(codePoints, lineBreak, lastEnd, nextIndex);

                    lastEnd = nextIndex;

                    return { value: value, done: false };

                }

                return { done: true, value: null };

            },

        };

    };



    // https://www.w3.org/TR/css-syntax-3

    var TokenType;

    (function (TokenType) {

        TokenType[TokenType["STRING_TOKEN"] = 0] = "STRING_TOKEN";

        TokenType[TokenType["BAD_STRING_TOKEN"] = 1] = "BAD_STRING_TOKEN";

        TokenType[TokenType["LEFT_PARENTHESIS_TOKEN"] = 2] = "LEFT_PARENTHESIS_TOKEN";

        TokenType[TokenType["RIGHT_PARENTHESIS_TOKEN"] = 3] = "RIGHT_PARENTHESIS_TOKEN";

        TokenType[TokenType["COMMA_TOKEN"] = 4] = "COMMA_TOKEN";

        TokenType[TokenType["HASH_TOKEN"] = 5] = "HASH_TOKEN";

        TokenType[TokenType["DELIM_TOKEN"] = 6] = "DELIM_TOKEN";

        TokenType[TokenType["AT_KEYWORD_TOKEN"] = 7] = "AT_KEYWORD_TOKEN";

        TokenType[TokenType["PREFIX_MATCH_TOKEN"] = 8] = "PREFIX_MATCH_TOKEN";

        TokenType[TokenType["DASH_MATCH_TOKEN"] = 9] = "DASH_MATCH_TOKEN";

        TokenType[TokenType["INCLUDE_MATCH_TOKEN"] = 10] = "INCLUDE_MATCH_TOKEN";

        TokenType[TokenType["LEFT_CURLY_BRACKET_TOKEN"] = 11] = "LEFT_CURLY_BRACKET_TOKEN";

        TokenType[TokenType["RIGHT_CURLY_BRACKET_TOKEN"] = 12] = "RIGHT_CURLY_BRACKET_TOKEN";

        TokenType[TokenType["SUFFIX_MATCH_TOKEN"] = 13] = "SUFFIX_MATCH_TOKEN";

        TokenType[TokenType["SUBSTRING_MATCH_TOKEN"] = 14] = "SUBSTRING_MATCH_TOKEN";

        TokenType[TokenType["DIMENSION_TOKEN"] = 15] = "DIMENSION_TOKEN";

        TokenType[TokenType["PERCENTAGE_TOKEN"] = 16] = "PERCENTAGE_TOKEN";

        TokenType[TokenType["NUMBER_TOKEN"] = 17] = "NUMBER_TOKEN";

        TokenType[TokenType["FUNCTION"] = 18] = "FUNCTION";

        TokenType[TokenType["FUNCTION_TOKEN"] = 19] = "FUNCTION_TOKEN";

        TokenType[TokenType["IDENT_TOKEN"] = 20] = "IDENT_TOKEN";

        TokenType[TokenType["COLUMN_TOKEN"] = 21] = "COLUMN_TOKEN";

        TokenType[TokenType["URL_TOKEN"] = 22] = "URL_TOKEN";

        TokenType[TokenType["BAD_URL_TOKEN"] = 23] = "BAD_URL_TOKEN";

        TokenType[TokenType["CDC_TOKEN"] = 24] = "CDC_TOKEN";

        TokenType[TokenType["CDO_TOKEN"] = 25] = "CDO_TOKEN";

        TokenType[TokenType["COLON_TOKEN"] = 26] = "COLON_TOKEN";

        TokenType[TokenType["SEMICOLON_TOKEN"] = 27] = "SEMICOLON_TOKEN";

        TokenType[TokenType["LEFT_SQUARE_BRACKET_TOKEN"] = 28] = "LEFT_SQUARE_BRACKET_TOKEN";

        TokenType[TokenType["RIGHT_SQUARE_BRACKET_TOKEN"] = 29] = "RIGHT_SQUARE_BRACKET_TOKEN";

        TokenType[TokenType["UNICODE_RANGE_TOKEN"] = 30] = "UNICODE_RANGE_TOKEN";

        TokenType[TokenType["WHITESPACE_TOKEN"] = 31] = "WHITESPACE_TOKEN";

        TokenType[TokenType["EOF_TOKEN"] = 32] = "EOF_TOKEN";

    })(TokenType || (TokenType = {}));

    var FLAG_UNRESTRICTED = 1 << 0;

    var FLAG_ID = 1 << 1;

    var FLAG_INTEGER = 1 << 2;

    var FLAG_NUMBER = 1 << 3;

    var LINE_FEED = 0x000a;

    var SOLIDUS = 0x002f;

    var REVERSE_SOLIDUS = 0x005c;

    var CHARACTER_TABULATION = 0x0009;

    var SPACE$1 = 0x0020;

    var QUOTATION_MARK = 0x0022;

    var EQUALS_SIGN = 0x003d;

    var NUMBER_SIGN = 0x0023;

    var DOLLAR_SIGN = 0x0024;

    var PERCENTAGE_SIGN = 0x0025;

    var APOSTROPHE = 0x0027;

    var LEFT_PARENTHESIS = 0x0028;

    var RIGHT_PARENTHESIS = 0x0029;

    var LOW_LINE = 0x005f;

    var HYPHEN_MINUS = 0x002d;

    var EXCLAMATION_MARK = 0x0021;

    var LESS_THAN_SIGN = 0x003c;

    var GREATER_THAN_SIGN = 0x003e;

    var COMMERCIAL_AT = 0x0040;

    var LEFT_SQUARE_BRACKET = 0x005b;

    var RIGHT_SQUARE_BRACKET = 0x005d;

    var CIRCUMFLEX_ACCENT = 0x003d;

    var LEFT_CURLY_BRACKET = 0x007b;

    var QUESTION_MARK = 0x003f;

    var RIGHT_CURLY_BRACKET = 0x007d;

    var VERTICAL_LINE = 0x007c;

    var TILDE = 0x007e;

    var CONTROL = 0x0080;

    var REPLACEMENT_CHARACTER = 0xfffd;

    var ASTERISK = 0x002a;

    var PLUS_SIGN = 0x002b;

    var COMMA = 0x002c;

    var COLON = 0x003a;

    var SEMICOLON = 0x003b;

    var FULL_STOP = 0x002e;

    var NULL = 0x0000;

    var BACKSPACE = 0x0008;

    var LINE_TABULATION = 0x000b;

    var SHIFT_OUT = 0x000e;

    var INFORMATION_SEPARATOR_ONE = 0x001f;

    var DELETE = 0x007f;

    var EOF = -1;

    var ZERO = 0x0030;

    var a = 0x0061;

    var e = 0x0065;

    var f = 0x0066;

    var u = 0x0075;

    var z = 0x007a;

    var A = 0x0041;

    var E = 0x0045;

    var F = 0x0046;

    var U = 0x0055;

    var Z = 0x005a;

    var isDigit = function (codePoint) { return codePoint >= ZERO && codePoint <= 0x0039; };

    var isSurrogateCodePoint = function (codePoint) { return codePoint >= 0xd800 && codePoint <= 0xdfff; };

    var isHex = function (codePoint) {

        return isDigit(codePoint) || (codePoint >= A && codePoint <= F) || (codePoint >= a && codePoint <= f);

    };

    var isLowerCaseLetter = function (codePoint) { return codePoint >= a && codePoint <= z; };

    var isUpperCaseLetter = function (codePoint) { return codePoint >= A && codePoint <= Z; };

    var isLetter = function (codePoint) { return isLowerCaseLetter(codePoint) || isUpperCaseLetter(codePoint); };

    var isNonASCIICodePoint = function (codePoint) { return codePoint >= CONTROL; };

    var isWhiteSpace = function (codePoint) {

        return codePoint === LINE_FEED || codePoint === CHARACTER_TABULATION || codePoint === SPACE$1;

    };

    var isNameStartCodePoint = function (codePoint) {

        return isLetter(codePoint) || isNonASCIICodePoint(codePoint) || codePoint === LOW_LINE;

    };

    var isNameCodePoint = function (codePoint) {

        return isNameStartCodePoint(codePoint) || isDigit(codePoint) || codePoint === HYPHEN_MINUS;

    };

    var isNonPrintableCodePoint = function (codePoint) {

        return ((codePoint >= NULL && codePoint <= BACKSPACE) ||

            codePoint === LINE_TABULATION ||

            (codePoint >= SHIFT_OUT && codePoint <= INFORMATION_SEPARATOR_ONE) ||

            codePoint === DELETE);

    };

    var isValidEscape = function (c1, c2) {

        if (c1 !== REVERSE_SOLIDUS) {

            return false;

        }

        return c2 !== LINE_FEED;

    };

    var isIdentifierStart = function (c1, c2, c3) {

        if (c1 === HYPHEN_MINUS) {

            return isNameStartCodePoint(c2) || isValidEscape(c2, c3);

        }

        else if (isNameStartCodePoint(c1)) {

            return true;

        }

        else if (c1 === REVERSE_SOLIDUS && isValidEscape(c1, c2)) {

            return true;

        }

        return false;

    };

    var isNumberStart = function (c1, c2, c3) {

        if (c1 === PLUS_SIGN || c1 === HYPHEN_MINUS) {

            if (isDigit(c2)) {

                return true;

            }

            return c2 === FULL_STOP && isDigit(c3);

        }

        if (c1 === FULL_STOP) {

            return isDigit(c2);

        }

        return isDigit(c1);

    };

    var stringToNumber = function (codePoints) {

        var c = 0;

        var sign = 1;

        if (codePoints[c] === PLUS_SIGN || codePoints[c] === HYPHEN_MINUS) {

            if (codePoints[c] === HYPHEN_MINUS) {

                sign = -1;

            }

            c++;

        }

        var integers = [];

        while (isDigit(codePoints[c])) {

            integers.push(codePoints[c++]);

        }

        var int = integers.length ? parseInt(fromCodePoint.apply(void 0, integers), 10) : 0;

        if (codePoints[c] === FULL_STOP) {

            c++;

        }

        var fraction = [];

        while (isDigit(codePoints[c])) {

            fraction.push(codePoints[c++]);

        }

        var fracd = fraction.length;

        var frac = fracd ? parseInt(fromCodePoint.apply(void 0, fraction), 10) : 0;

        if (codePoints[c] === E || codePoints[c] === e) {

            c++;

        }

        var expsign = 1;

        if (codePoints[c] === PLUS_SIGN || codePoints[c] === HYPHEN_MINUS) {

            if (codePoints[c] === HYPHEN_MINUS) {

                expsign = -1;

            }

            c++;

        }

        var exponent = [];

        while (isDigit(codePoints[c])) {

            exponent.push(codePoints[c++]);

        }

        var exp = exponent.length ? parseInt(fromCodePoint.apply(void 0, exponent), 10) : 0;

        return sign * (int + frac * Math.pow(10, -fracd)) * Math.pow(10, expsign * exp);

    };

    var LEFT_PARENTHESIS_TOKEN = {

        type: TokenType.LEFT_PARENTHESIS_TOKEN

    };

    var RIGHT_PARENTHESIS_TOKEN = {

        type: TokenType.RIGHT_PARENTHESIS_TOKEN

    };

    var COMMA_TOKEN = { type: TokenType.COMMA_TOKEN };

    var SUFFIX_MATCH_TOKEN = { type: TokenType.SUFFIX_MATCH_TOKEN };

    var PREFIX_MATCH_TOKEN = { type: TokenType.PREFIX_MATCH_TOKEN };

    var COLUMN_TOKEN = { type: TokenType.COLUMN_TOKEN };

    var DASH_MATCH_TOKEN = { type: TokenType.DASH_MATCH_TOKEN };

    var INCLUDE_MATCH_TOKEN = { type: TokenType.INCLUDE_MATCH_TOKEN };

    var LEFT_CURLY_BRACKET_TOKEN = {

        type: TokenType.LEFT_CURLY_BRACKET_TOKEN

    };

    var RIGHT_CURLY_BRACKET_TOKEN = {

        type: TokenType.RIGHT_CURLY_BRACKET_TOKEN

    };

    var SUBSTRING_MATCH_TOKEN = { type: TokenType.SUBSTRING_MATCH_TOKEN };

    var BAD_URL_TOKEN = { type: TokenType.BAD_URL_TOKEN };

    var BAD_STRING_TOKEN = { type: TokenType.BAD_STRING_TOKEN };

    var CDO_TOKEN = { type: TokenType.CDO_TOKEN };

    var CDC_TOKEN = { type: TokenType.CDC_TOKEN };

    var COLON_TOKEN = { type: TokenType.COLON_TOKEN };

    var SEMICOLON_TOKEN = { type: TokenType.SEMICOLON_TOKEN };

    var LEFT_SQUARE_BRACKET_TOKEN = {

        type: TokenType.LEFT_SQUARE_BRACKET_TOKEN

    };

    var RIGHT_SQUARE_BRACKET_TOKEN = {

        type: TokenType.RIGHT_SQUARE_BRACKET_TOKEN

    };

    var WHITESPACE_TOKEN = { type: TokenType.WHITESPACE_TOKEN };

    var EOF_TOKEN = { type: TokenType.EOF_TOKEN };

    var Tokenizer = /** @class */ (function () {

        function Tokenizer() {

            this._value = [];

        }

        Tokenizer.prototype.write = function (chunk) {

            this._value = this._value.concat(toCodePoints(chunk));

        };

        Tokenizer.prototype.read = function () {

            var tokens = [];

            var token = this.consumeToken();

            while (token !== EOF_TOKEN) {

                tokens.push(token);

                token = this.consumeToken();

            }

            return tokens;

        };

        Tokenizer.prototype.consumeToken = function () {

            var codePoint = this.consumeCodePoint();

            switch (codePoint) {

                case QUOTATION_MARK:

                    return this.consumeStringToken(QUOTATION_MARK);

                case NUMBER_SIGN:

                    var c1 = this.peekCodePoint(0);

                    var c2 = this.peekCodePoint(1);

                    var c3 = this.peekCodePoint(2);

                    if (isNameCodePoint(c1) || isValidEscape(c2, c3)) {

                        var flags = isIdentifierStart(c1, c2, c3) ? FLAG_ID : FLAG_UNRESTRICTED;

                        var value = this.consumeName();

                        return { type: TokenType.HASH_TOKEN, value: value, flags: flags };

                    }

                    break;

                case DOLLAR_SIGN:

                    if (this.peekCodePoint(0) === EQUALS_SIGN) {

                        this.consumeCodePoint();

                        return SUFFIX_MATCH_TOKEN;

                    }

                    break;

                case APOSTROPHE:

                    return this.consumeStringToken(APOSTROPHE);

                case LEFT_PARENTHESIS:

                    return LEFT_PARENTHESIS_TOKEN;

                case RIGHT_PARENTHESIS:

                    return RIGHT_PARENTHESIS_TOKEN;

                case ASTERISK:

                    if (this.peekCodePoint(0) === EQUALS_SIGN) {

                        this.consumeCodePoint();

                        return SUBSTRING_MATCH_TOKEN;

                    }

                    break;

                case PLUS_SIGN:

                    if (isNumberStart(codePoint, this.peekCodePoint(0), this.peekCodePoint(1))) {

                        this.reconsumeCodePoint(codePoint);

                        return this.consumeNumericToken();

                    }

                    break;

                case COMMA:

                    return COMMA_TOKEN;

                case HYPHEN_MINUS:

                    var e1 = codePoint;

                    var e2 = this.peekCodePoint(0);

                    var e3 = this.peekCodePoint(1);

                    if (isNumberStart(e1, e2, e3)) {

                        this.reconsumeCodePoint(codePoint);

                        return this.consumeNumericToken();

                    }

                    if (isIdentifierStart(e1, e2, e3)) {

                        this.reconsumeCodePoint(codePoint);

                        return this.consumeIdentLikeToken();

                    }

                    if (e2 === HYPHEN_MINUS && e3 === GREATER_THAN_SIGN) {

                        this.consumeCodePoint();

                        this.consumeCodePoint();

                        return CDC_TOKEN;

                    }

                    break;

                case FULL_STOP:

                    if (isNumberStart(codePoint, this.peekCodePoint(0), this.peekCodePoint(1))) {

                        this.reconsumeCodePoint(codePoint);

                        return this.consumeNumericToken();

                    }

                    break;

                case SOLIDUS:

                    if (this.peekCodePoint(0) === ASTERISK) {

                        this.consumeCodePoint();

                        while (true) {

                            var c = this.consumeCodePoint();

                            if (c === ASTERISK) {

                                c = this.consumeCodePoint();

                                if (c === SOLIDUS) {

                                    return this.consumeToken();

                                }

                            }

                            if (c === EOF) {

                                return this.consumeToken();

                            }

                        }

                    }

                    break;

                case COLON:

                    return COLON_TOKEN;

                case SEMICOLON:

                    return SEMICOLON_TOKEN;

                case LESS_THAN_SIGN:

                    if (this.peekCodePoint(0) === EXCLAMATION_MARK &&

                        this.peekCodePoint(1) === HYPHEN_MINUS &&

                        this.peekCodePoint(2) === HYPHEN_MINUS) {

                        this.consumeCodePoint();

                        this.consumeCodePoint();

                        return CDO_TOKEN;

                    }

                    break;

                case COMMERCIAL_AT:

                    var a1 = this.peekCodePoint(0);

                    var a2 = this.peekCodePoint(1);

                    var a3 = this.peekCodePoint(2);

                    if (isIdentifierStart(a1, a2, a3)) {

                        var value = this.consumeName();

                        return { type: TokenType.AT_KEYWORD_TOKEN, value: value };

                    }

                    break;

                case LEFT_SQUARE_BRACKET:

                    return LEFT_SQUARE_BRACKET_TOKEN;

                case REVERSE_SOLIDUS:

                    if (isValidEscape(codePoint, this.peekCodePoint(0))) {

                        this.reconsumeCodePoint(codePoint);

                        return this.consumeIdentLikeToken();

                    }

                    break;

                case RIGHT_SQUARE_BRACKET:

                    return RIGHT_SQUARE_BRACKET_TOKEN;

                case CIRCUMFLEX_ACCENT:

                    if (this.peekCodePoint(0) === EQUALS_SIGN) {

                        this.consumeCodePoint();

                        return PREFIX_MATCH_TOKEN;

                    }

                    break;

                case LEFT_CURLY_BRACKET:

                    return LEFT_CURLY_BRACKET_TOKEN;

                case RIGHT_CURLY_BRACKET:

                    return RIGHT_CURLY_BRACKET_TOKEN;

                case u:

                case U:

                    var u1 = this.peekCodePoint(0);

                    var u2 = this.peekCodePoint(1);

                    if (u1 === PLUS_SIGN && (isHex(u2) || u2 === QUESTION_MARK)) {

                        this.consumeCodePoint();

                        this.consumeUnicodeRangeToken();

                    }

                    this.reconsumeCodePoint(codePoint);

                    return this.consumeIdentLikeToken();

                case VERTICAL_LINE:

                    if (this.peekCodePoint(0) === EQUALS_SIGN) {

                        this.consumeCodePoint();

                        return DASH_MATCH_TOKEN;

                    }

                    if (this.peekCodePoint(0) === VERTICAL_LINE) {

                        this.consumeCodePoint();

                        return COLUMN_TOKEN;

                    }

                    break;

                case TILDE:

                    if (this.peekCodePoint(0) === EQUALS_SIGN) {

                        this.consumeCodePoint();

                        return INCLUDE_MATCH_TOKEN;

                    }

                    break;

                case EOF:

                    return EOF_TOKEN;

            }

            if (isWhiteSpace(codePoint)) {

                this.consumeWhiteSpace();

                return WHITESPACE_TOKEN;

            }

            if (isDigit(codePoint)) {

                this.reconsumeCodePoint(codePoint);

                return this.consumeNumericToken();

            }

            if (isNameStartCodePoint(codePoint)) {

                this.reconsumeCodePoint(codePoint);

                return this.consumeIdentLikeToken();

            }

            return { type: TokenType.DELIM_TOKEN, value: fromCodePoint(codePoint) };

        };

        Tokenizer.prototype.consumeCodePoint = function () {

            var value = this._value.shift();

            return typeof value === 'undefined' ? -1 : value;

        };

        Tokenizer.prototype.reconsumeCodePoint = function (codePoint) {

            this._value.unshift(codePoint);

        };

        Tokenizer.prototype.peekCodePoint = function (delta) {

            if (delta >= this._value.length) {

                return -1;

            }

            return this._value[delta];

        };

        Tokenizer.prototype.consumeUnicodeRangeToken = function () {

            var digits = [];

            var codePoint = this.consumeCodePoint();

            while (isHex(codePoint) && digits.length < 6) {

                digits.push(codePoint);

                codePoint = this.consumeCodePoint();

            }

            var questionMarks = false;

            while (codePoint === QUESTION_MARK && digits.length < 6) {

                digits.push(codePoint);

                codePoint = this.consumeCodePoint();

                questionMarks = true;

            }

            if (questionMarks) {

                var start_1 = parseInt(fromCodePoint.apply(void 0, digits.map(function (digit) { return (digit === QUESTION_MARK ? ZERO : digit); })), 16);

                var end = parseInt(fromCodePoint.apply(void 0, digits.map(function (digit) { return (digit === QUESTION_MARK ? F : digit); })), 16);

                return { type: TokenType.UNICODE_RANGE_TOKEN, start: start_1, end: end };

            }

            var start = parseInt(fromCodePoint.apply(void 0, digits), 16);

            if (this.peekCodePoint(0) === HYPHEN_MINUS && isHex(this.peekCodePoint(1))) {

                this.consumeCodePoint();

                codePoint = this.consumeCodePoint();

                var endDigits = [];

                while (isHex(codePoint) && endDigits.length < 6) {

                    endDigits.push(codePoint);

                    codePoint = this.consumeCodePoint();

                }

                var end = parseInt(fromCodePoint.apply(void 0, endDigits), 16);

                return { type: TokenType.UNICODE_RANGE_TOKEN, start: start, end: end };

            }

            else {

                return { type: TokenType.UNICODE_RANGE_TOKEN, start: start, end: start };

            }

        };

        Tokenizer.prototype.consumeIdentLikeToken = function () {

            var value = this.consumeName();

            if (value.toLowerCase() === 'url' && this.peekCodePoint(0) === LEFT_PARENTHESIS) {

                this.consumeCodePoint();

                return this.consumeUrlToken();

            }

            else if (this.peekCodePoint(0) === LEFT_PARENTHESIS) {

                this.consumeCodePoint();

                return { type: TokenType.FUNCTION_TOKEN, value: value };

            }

            return { type: TokenType.IDENT_TOKEN, value: value };

        };

        Tokenizer.prototype.consumeUrlToken = function () {

            var value = [];

            this.consumeWhiteSpace();

            if (this.peekCodePoint(0) === EOF) {

                return { type: TokenType.URL_TOKEN, value: '' };

            }

            var next = this.peekCodePoint(0);

            if (next === APOSTROPHE || next === QUOTATION_MARK) {

                var stringToken = this.consumeStringToken(this.consumeCodePoint());

                if (stringToken.type === TokenType.STRING_TOKEN) {

                    this.consumeWhiteSpace();

                    if (this.peekCodePoint(0) === EOF || this.peekCodePoint(0) === RIGHT_PARENTHESIS) {

                        this.consumeCodePoint();

                        return { type: TokenType.URL_TOKEN, value: stringToken.value };

                    }

                }

                this.consumeBadUrlRemnants();

                return BAD_URL_TOKEN;

            }

            while (true) {

                var codePoint = this.consumeCodePoint();

                if (codePoint === EOF || codePoint === RIGHT_PARENTHESIS) {

                    return { type: TokenType.URL_TOKEN, value: fromCodePoint.apply(void 0, value) };

                }

                else if (isWhiteSpace(codePoint)) {

                    this.consumeWhiteSpace();

                    if (this.peekCodePoint(0) === EOF || this.peekCodePoint(0) === RIGHT_PARENTHESIS) {

                        this.consumeCodePoint();

                        return { type: TokenType.URL_TOKEN, value: fromCodePoint.apply(void 0, value) };

                    }

                    this.consumeBadUrlRemnants();

                    return BAD_URL_TOKEN;

                }

                else if (codePoint === QUOTATION_MARK ||

                    codePoint === APOSTROPHE ||

                    codePoint === LEFT_PARENTHESIS ||

                    isNonPrintableCodePoint(codePoint)) {

                    this.consumeBadUrlRemnants();

                    return BAD_URL_TOKEN;

                }

                else if (codePoint === REVERSE_SOLIDUS) {

                    if (isValidEscape(codePoint, this.peekCodePoint(0))) {

                        value.push(this.consumeEscapedCodePoint());

                    }

                    else {

                        this.consumeBadUrlRemnants();

                        return BAD_URL_TOKEN;

                    }

                }

                else {

                    value.push(codePoint);

                }

            }

        };

        Tokenizer.prototype.consumeWhiteSpace = function () {

            while (isWhiteSpace(this.peekCodePoint(0))) {

                this.consumeCodePoint();

            }

        };

        Tokenizer.prototype.consumeBadUrlRemnants = function () {

            while (true) {

                var codePoint = this.consumeCodePoint();

                if (codePoint === RIGHT_PARENTHESIS || codePoint === EOF) {

                    return;

                }

                if (isValidEscape(codePoint, this.peekCodePoint(0))) {

                    this.consumeEscapedCodePoint();

                }

            }

        };

        Tokenizer.prototype.consumeStringSlice = function (count) {

            var SLICE_STACK_SIZE = 60000;

            var value = '';

            while (count > 0) {

                var amount = Math.min(SLICE_STACK_SIZE, count);

                value += fromCodePoint.apply(void 0, this._value.splice(0, amount));

                count -= amount;

            }

            this._value.shift();

            return value;

        };

        Tokenizer.prototype.consumeStringToken = function (endingCodePoint) {

            var value = '';

            var i = 0;

            do {

                var codePoint = this._value[i];

                if (codePoint === EOF || codePoint === undefined || codePoint === endingCodePoint) {

                    value += this.consumeStringSlice(i);

                    return { type: TokenType.STRING_TOKEN, value: value };

                }

                if (codePoint === LINE_FEED) {

                    this._value.splice(0, i);

                    return BAD_STRING_TOKEN;

                }

                if (codePoint === REVERSE_SOLIDUS) {

                    var next = this._value[i + 1];

                    if (next !== EOF && next !== undefined) {

                        if (next === LINE_FEED) {

                            value += this.consumeStringSlice(i);

                            i = -1;

                            this._value.shift();

                        }

                        else if (isValidEscape(codePoint, next)) {

                            value += this.consumeStringSlice(i);

                            value += fromCodePoint(this.consumeEscapedCodePoint());

                            i = -1;

                        }

                    }

                }

                i++;

            } while (true);

        };

        Tokenizer.prototype.consumeNumber = function () {

            var repr = [];

            var type = FLAG_INTEGER;

            var c1 = this.peekCodePoint(0);

            if (c1 === PLUS_SIGN || c1 === HYPHEN_MINUS) {

                repr.push(this.consumeCodePoint());

            }

            while (isDigit(this.peekCodePoint(0))) {

                repr.push(this.consumeCodePoint());

            }

            c1 = this.peekCodePoint(0);

            var c2 = this.peekCodePoint(1);

            if (c1 === FULL_STOP && isDigit(c2)) {

                repr.push(this.consumeCodePoint(), this.consumeCodePoint());

                type = FLAG_NUMBER;

                while (isDigit(this.peekCodePoint(0))) {

                    repr.push(this.consumeCodePoint());

                }

            }

            c1 = this.peekCodePoint(0);

            c2 = this.peekCodePoint(1);

            var c3 = this.peekCodePoint(2);

            if ((c1 === E || c1 === e) && (((c2 === PLUS_SIGN || c2 === HYPHEN_MINUS) && isDigit(c3)) || isDigit(c2))) {

                repr.push(this.consumeCodePoint(), this.consumeCodePoint());

                type = FLAG_NUMBER;

                while (isDigit(this.peekCodePoint(0))) {

                    repr.push(this.consumeCodePoint());

                }

            }

            return [stringToNumber(repr), type];

        };

        Tokenizer.prototype.consumeNumericToken = function () {

            var _a = this.consumeNumber(), number = _a[0], flags = _a[1];

            var c1 = this.peekCodePoint(0);

            var c2 = this.peekCodePoint(1);

            var c3 = this.peekCodePoint(2);

            if (isIdentifierStart(c1, c2, c3)) {

                var unit = this.consumeName();

                return { type: TokenType.DIMENSION_TOKEN, number: number, flags: flags, unit: unit };

            }

            if (c1 === PERCENTAGE_SIGN) {

                this.consumeCodePoint();

                return { type: TokenType.PERCENTAGE_TOKEN, number: number, flags: flags };

            }

            return { type: TokenType.NUMBER_TOKEN, number: number, flags: flags };

        };

        Tokenizer.prototype.consumeEscapedCodePoint = function () {

            var codePoint = this.consumeCodePoint();

            if (isHex(codePoint)) {

                var hex = fromCodePoint(codePoint);

                while (isHex(this.peekCodePoint(0)) && hex.length < 6) {

                    hex += fromCodePoint(this.consumeCodePoint());

                }

                if (isWhiteSpace(this.peekCodePoint(0))) {

                    this.consumeCodePoint();

                }

                var hexCodePoint = parseInt(hex, 16);

                if (hexCodePoint === 0 || isSurrogateCodePoint(hexCodePoint) || hexCodePoint > 0x10ffff) {

                    return REPLACEMENT_CHARACTER;

                }

                return hexCodePoint;

            }

            if (codePoint === EOF) {

                return REPLACEMENT_CHARACTER;

            }

            return codePoint;

        };

        Tokenizer.prototype.consumeName = function () {

            var result = '';

            while (true) {

                var codePoint = this.consumeCodePoint();

                if (isNameCodePoint(codePoint)) {

                    result += fromCodePoint(codePoint);

                }

                else if (isValidEscape(codePoint, this.peekCodePoint(0))) {

                    result += fromCodePoint(this.consumeEscapedCodePoint());

                }

                else {

                    this.reconsumeCodePoint(codePoint);

                    return result;

                }

            }

        };

        return Tokenizer;

    }());



    var Parser = /** @class */ (function () {

        function Parser(tokens) {

            this._tokens = tokens;

        }

        Parser.create = function (value) {

            var tokenizer = new Tokenizer();

            tokenizer.write(value);

            return new Parser(tokenizer.read());

        };

        Parser.parseValue = function (value) {

            return Parser.create(value).parseComponentValue();

        };

        Parser.parseValues = function (value) {

            return Parser.create(value).parseComponentValues();

        };

        Parser.prototype.parseComponentValue = function () {

            var token = this.consumeToken();

            while (token.type === TokenType.WHITESPACE_TOKEN) {

                token = this.consumeToken();

            }

            if (token.type === TokenType.EOF_TOKEN) {

                throw new SyntaxError("Error parsing CSS component value, unexpected EOF");

            }

            this.reconsumeToken(token);

            var value = this.consumeComponentValue();

            do {

                token = this.consumeToken();

            } while (token.type === TokenType.WHITESPACE_TOKEN);

            if (token.type === TokenType.EOF_TOKEN) {

                return value;

            }

            throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one");

        };

        Parser.prototype.parseComponentValues = function () {

            var values = [];

            while (true) {

                var value = this.consumeComponentValue();

                if (value.type === TokenType.EOF_TOKEN) {

                    return values;

                }

                values.push(value);

                values.push();

            }

        };

        Parser.prototype.consumeComponentValue = function () {

            var token = this.consumeToken();

            switch (token.type) {

                case TokenType.LEFT_CURLY_BRACKET_TOKEN:

                case TokenType.LEFT_SQUARE_BRACKET_TOKEN:

                case TokenType.LEFT_PARENTHESIS_TOKEN:

                    return this.consumeSimpleBlock(token.type);

                case TokenType.FUNCTION_TOKEN:

                    return this.consumeFunction(token);

            }

            return token;

        };

        Parser.prototype.consumeSimpleBlock = function (type) {

            var block = { type: type, values: [] };

            var token = this.consumeToken();

            while (true) {

                if (token.type === TokenType.EOF_TOKEN || isEndingTokenFor(token, type)) {

                    return block;

                }

                this.reconsumeToken(token);

                block.values.push(this.consumeComponentValue());

                token = this.consumeToken();

            }

        };

        Parser.prototype.consumeFunction = function (functionToken) {

            var cssFunction = {

                name: functionToken.value,

                values: [],

                type: TokenType.FUNCTION

            };

            while (true) {

                var token = this.consumeToken();

                if (token.type === TokenType.EOF_TOKEN || token.type === TokenType.RIGHT_PARENTHESIS_TOKEN) {

                    return cssFunction;

                }

                this.reconsumeToken(token);

                cssFunction.values.push(this.consumeComponentValue());

            }

        };

        Parser.prototype.consumeToken = function () {

            var token = this._tokens.shift();

            return typeof token === 'undefined' ? EOF_TOKEN : token;

        };

        Parser.prototype.reconsumeToken = function (token) {

            this._tokens.unshift(token);

        };

        return Parser;

    }());

    var isDimensionToken = function (token) { return token.type === TokenType.DIMENSION_TOKEN; };

    var isNumberToken = function (token) { return token.type === TokenType.NUMBER_TOKEN; };

    var isIdentToken = function (token) { return token.type === TokenType.IDENT_TOKEN; };

    var isStringToken = function (token) { return token.type === TokenType.STRING_TOKEN; };

    var isIdentWithValue = function (token, value) {

        return isIdentToken(token) && token.value === value;

    };

    var nonWhiteSpace = function (token) { return token.type !== TokenType.WHITESPACE_TOKEN; };

    var nonFunctionArgSeparator = function (token) {

        return token.type !== TokenType.WHITESPACE_TOKEN && token.type !== TokenType.COMMA_TOKEN;

    };

    var parseFunctionArgs = function (tokens) {

        var args = [];

        var arg = [];

        tokens.forEach(function (token) {

            if (token.type === TokenType.COMMA_TOKEN) {

                if (arg.length === 0) {

                    throw new Error("Error parsing function args, zero tokens for arg");

                }

                args.push(arg);

                arg = [];

                return;

            }

            if (token.type !== TokenType.WHITESPACE_TOKEN) {

                arg.push(token);

            }

        });

        if (arg.length) {

            args.push(arg);

        }

        return args;

    };

    var isEndingTokenFor = function (token, type) {

        if (type === TokenType.LEFT_CURLY_BRACKET_TOKEN && token.type === TokenType.RIGHT_CURLY_BRACKET_TOKEN) {

            return true;

        }

        if (type === TokenType.LEFT_SQUARE_BRACKET_TOKEN && token.type === TokenType.RIGHT_SQUARE_BRACKET_TOKEN) {

            return true;

        }

        return type === TokenType.LEFT_PARENTHESIS_TOKEN && token.type === TokenType.RIGHT_PARENTHESIS_TOKEN;

    };



    var isLength = function (token) {

        return token.type === TokenType.NUMBER_TOKEN || token.type === TokenType.DIMENSION_TOKEN;

    };



    var isLengthPercentage = function (token) {

        return token.type === TokenType.PERCENTAGE_TOKEN || isLength(token);

    };

    var parseLengthPercentageTuple = function (tokens) {

        return tokens.length > 1 ? [tokens[0], tokens[1]] : [tokens[0]];

    };

    var ZERO_LENGTH = {

        type: TokenType.NUMBER_TOKEN,

        number: 0,

        flags: FLAG_INTEGER

    };

    var FIFTY_PERCENT = {

        type: TokenType.PERCENTAGE_TOKEN,

        number: 50,

        flags: FLAG_INTEGER

    };

    var HUNDRED_PERCENT = {

        type: TokenType.PERCENTAGE_TOKEN,

        number: 100,

        flags: FLAG_INTEGER

    };

    var getAbsoluteValueForTuple = function (tuple, width, height) {

        var x = tuple[0], y = tuple[1];

        return [getAbsoluteValue(x, width), getAbsoluteValue(typeof y !== 'undefined' ? y : x, height)];

    };

    var getAbsoluteValue = function (token, parent) {

        if (token.type === TokenType.PERCENTAGE_TOKEN) {

            return (token.number / 100) * parent;

        }

        if (isDimensionToken(token)) {

            switch (token.unit) {

                case 'rem':

                case 'em':

                    return 16 * token.number; // TODO use correct font-size

                case 'px':

                default:

                    return token.number;

            }

        }

        return token.number;

    };



    var DEG = 'deg';

    var GRAD = 'grad';

    var RAD = 'rad';

    var TURN = 'turn';

    var angle = {

        name: 'angle',

        parse: function (value) {

            if (value.type === TokenType.DIMENSION_TOKEN) {

                switch (value.unit) {

                    case DEG:

                        return (Math.PI * value.number) / 180;

                    case GRAD:

                        return (Math.PI / 200) * value.number;

                    case RAD:

                        return value.number;

                    case TURN:

                        return Math.PI * 2 * value.number;

                }

            }

            throw new Error("Unsupported angle type");

        }

    };

    var isAngle = function (value) {

        if (value.type === TokenType.DIMENSION_TOKEN) {

            if (value.unit === DEG || value.unit === GRAD || value.unit === RAD || value.unit === TURN) {

                return true;

            }

        }

        return false;

    };

    var parseNamedSide = function (tokens) {

        var sideOrCorner = tokens

            .filter(isIdentToken)

            .map(function (ident) { return ident.value; })

            .join(' ');

        switch (sideOrCorner) {

            case 'to bottom right':

            case 'to right bottom':

            case 'left top':

            case 'top left':

                return [ZERO_LENGTH, ZERO_LENGTH];

            case 'to top':

            case 'bottom':

                return deg(0);

            case 'to bottom left':

            case 'to left bottom':

            case 'right top':

            case 'top right':

                return [ZERO_LENGTH, HUNDRED_PERCENT];

            case 'to right':

            case 'left':

                return deg(90);

            case 'to top left':

            case 'to left top':

            case 'right bottom':

            case 'bottom right':

                return [HUNDRED_PERCENT, HUNDRED_PERCENT];

            case 'to bottom':

            case 'top':

                return deg(180);

            case 'to top right':

            case 'to right top':

            case 'left bottom':

            case 'bottom left':

                return [HUNDRED_PERCENT, ZERO_LENGTH];

            case 'to left':

            case 'right':

                return deg(270);

        }

        return 0;

    };

    var deg = function (deg) { return (Math.PI * deg) / 180; };



    var color = {

        name: 'color',

        parse: function (value) {

            if (value.type === TokenType.FUNCTION) {

                var colorFunction = SUPPORTED_COLOR_FUNCTIONS[value.name];

                if (typeof colorFunction === 'undefined') {

                    throw new Error("Attempting to parse an unsupported color function \"" + value.name + "\"");

                }

                return colorFunction(value.values);

            }

            if (value.type === TokenType.HASH_TOKEN) {

                if (value.value.length === 3) {

                    var r = value.value.substring(0, 1);

                    var g = value.value.substring(1, 2);

                    var b = value.value.substring(2, 3);

                    return pack(parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16), 1);

                }

                if (value.value.length === 4) {

                    var r = value.value.substring(0, 1);

                    var g = value.value.substring(1, 2);

                    var b = value.value.substring(2, 3);

                    var a = value.value.substring(3, 4);

                    return pack(parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16), parseInt(a + a, 16) / 255);

                }

                if (value.value.length === 6) {

                    var r = value.value.substring(0, 2);

                    var g = value.value.substring(2, 4);

                    var b = value.value.substring(4, 6);

                    return pack(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), 1);

                }

                if (value.value.length === 8) {

                    var r = value.value.substring(0, 2);

                    var g = value.value.substring(2, 4);

                    var b = value.value.substring(4, 6);

                    var a = value.value.substring(6, 8);

                    return pack(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), parseInt(a, 16) / 255);

                }

            }

            if (value.type === TokenType.IDENT_TOKEN) {

                var namedColor = COLORS[value.value.toUpperCase()];

                if (typeof namedColor !== 'undefined') {

                    return namedColor;

                }

            }

            return COLORS.TRANSPARENT;

        }

    };

    var isTransparent = function (color) { return (0xff & color) === 0; };

    var asString = function (color) {

        var alpha = 0xff & color;

        var blue = 0xff & (color >> 8);

        var green = 0xff & (color >> 16);

        var red = 0xff & (color >> 24);

        return alpha < 255 ? "rgba(" + red + "," + green + "," + blue + "," + alpha / 255 + ")" : "rgb(" + red + "," + green + "," + blue + ")";

    };

    var pack = function (r, g, b, a) {

        return ((r << 24) | (g << 16) | (b << 8) | (Math.round(a * 255) << 0)) >>> 0;

    };

    var getTokenColorValue = function (token, i) {

        if (token.type === TokenType.NUMBER_TOKEN) {

            return token.number;

        }

        if (token.type === TokenType.PERCENTAGE_TOKEN) {

            var max = i === 3 ? 1 : 255;

            return i === 3 ? (token.number / 100) * max : Math.round((token.number / 100) * max);

        }

        return 0;

    };

    var rgb = function (args) {

        var tokens = args.filter(nonFunctionArgSeparator);

        if (tokens.length === 3) {

            var _a = tokens.map(getTokenColorValue), r = _a[0], g = _a[1], b = _a[2];

            return pack(r, g, b, 1);

        }

        if (tokens.length === 4) {

            var _b = tokens.map(getTokenColorValue), r = _b[0], g = _b[1], b = _b[2], a = _b[3];

            return pack(r, g, b, a);

        }

        return 0;

    };

    function hue2rgb(t1, t2, hue) {

        if (hue < 0) {

            hue += 1;

        }

        if (hue >= 1) {

            hue -= 1;

        }

        if (hue < 1 / 6) {

            return (t2 - t1) * hue * 6 + t1;

        }

        else if (hue < 1 / 2) {

            return t2;

        }

        else if (hue < 2 / 3) {

            return (t2 - t1) * 6 * (2 / 3 - hue) + t1;

        }

        else {

            return t1;

        }

    }

    var hsl = function (args) {

        var tokens = args.filter(nonFunctionArgSeparator);

        var hue = tokens[0], saturation = tokens[1], lightness = tokens[2], alpha = tokens[3];

        var h = (hue.type === TokenType.NUMBER_TOKEN ? deg(hue.number) : angle.parse(hue)) / (Math.PI * 2);

        var s = isLengthPercentage(saturation) ? saturation.number / 100 : 0;

        var l = isLengthPercentage(lightness) ? lightness.number / 100 : 0;

        var a = typeof alpha !== 'undefined' && isLengthPercentage(alpha) ? getAbsoluteValue(alpha, 1) : 1;

        if (s === 0) {

            return pack(l * 255, l * 255, l * 255, 1);

        }

        var t2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;

        var t1 = l * 2 - t2;

        var r = hue2rgb(t1, t2, h + 1 / 3);

        var g = hue2rgb(t1, t2, h);

        var b = hue2rgb(t1, t2, h - 1 / 3);

        return pack(r * 255, g * 255, b * 255, a);

    };

    var SUPPORTED_COLOR_FUNCTIONS = {

        hsl: hsl,

        hsla: hsl,

        rgb: rgb,

        rgba: rgb

    };

    var COLORS = {

        ALICEBLUE: 0xf0f8ffff,

        ANTIQUEWHITE: 0xfaebd7ff,

        AQUA: 0x00ffffff,

        AQUAMARINE: 0x7fffd4ff,

        AZURE: 0xf0ffffff,

        BEIGE: 0xf5f5dcff,

        BISQUE: 0xffe4c4ff,

        BLACK: 0x000000ff,

        BLANCHEDALMOND: 0xffebcdff,

        BLUE: 0x0000ffff,

        BLUEVIOLET: 0x8a2be2ff,

        BROWN: 0xa52a2aff,

        BURLYWOOD: 0xdeb887ff,

        CADETBLUE: 0x5f9ea0ff,

        CHARTREUSE: 0x7fff00ff,

        CHOCOLATE: 0xd2691eff,

        CORAL: 0xff7f50ff,

        CORNFLOWERBLUE: 0x6495edff,

        CORNSILK: 0xfff8dcff,

        CRIMSON: 0xdc143cff,

        CYAN: 0x00ffffff,

        DARKBLUE: 0x00008bff,

        DARKCYAN: 0x008b8bff,

        DARKGOLDENROD: 0xb886bbff,

        DARKGRAY: 0xa9a9a9ff,

        DARKGREEN: 0x006400ff,

        DARKGREY: 0xa9a9a9ff,

        DARKKHAKI: 0xbdb76bff,

        DARKMAGENTA: 0x8b008bff,

        DARKOLIVEGREEN: 0x556b2fff,

        DARKORANGE: 0xff8c00ff,

        DARKORCHID: 0x9932ccff,

        DARKRED: 0x8b0000ff,

        DARKSALMON: 0xe9967aff,

        DARKSEAGREEN: 0x8fbc8fff,

        DARKSLATEBLUE: 0x483d8bff,

        DARKSLATEGRAY: 0x2f4f4fff,

        DARKSLATEGREY: 0x2f4f4fff,

        DARKTURQUOISE: 0x00ced1ff,

        DARKVIOLET: 0x9400d3ff,

        DEEPPINK: 0xff1493ff,

        DEEPSKYBLUE: 0x00bfffff,

        DIMGRAY: 0x696969ff,

        DIMGREY: 0x696969ff,

        DODGERBLUE: 0x1e90ffff,

        FIREBRICK: 0xb22222ff,

        FLORALWHITE: 0xfffaf0ff,

        FORESTGREEN: 0x228b22ff,

        FUCHSIA: 0xff00ffff,

        GAINSBORO: 0xdcdcdcff,

        GHOSTWHITE: 0xf8f8ffff,

        GOLD: 0xffd700ff,

        GOLDENROD: 0xdaa520ff,

        GRAY: 0x808080ff,

        GREEN: 0x008000ff,

        GREENYELLOW: 0xadff2fff,

        GREY: 0x808080ff,

        HONEYDEW: 0xf0fff0ff,

        HOTPINK: 0xff69b4ff,

        INDIANRED: 0xcd5c5cff,

        INDIGO: 0x4b0082ff,

        IVORY: 0xfffff0ff,

        KHAKI: 0xf0e68cff,

        LAVENDER: 0xe6e6faff,

        LAVENDERBLUSH: 0xfff0f5ff,

        LAWNGREEN: 0x7cfc00ff,

        LEMONCHIFFON: 0xfffacdff,

        LIGHTBLUE: 0xadd8e6ff,

        LIGHTCORAL: 0xf08080ff,

        LIGHTCYAN: 0xe0ffffff,

        LIGHTGOLDENRODYELLOW: 0xfafad2ff,

        LIGHTGRAY: 0xd3d3d3ff,

        LIGHTGREEN: 0x90ee90ff,

        LIGHTGREY: 0xd3d3d3ff,

        LIGHTPINK: 0xffb6c1ff,

        LIGHTSALMON: 0xffa07aff,

        LIGHTSEAGREEN: 0x20b2aaff,

        LIGHTSKYBLUE: 0x87cefaff,

        LIGHTSLATEGRAY: 0x778899ff,

        LIGHTSLATEGREY: 0x778899ff,

        LIGHTSTEELBLUE: 0xb0c4deff,

        LIGHTYELLOW: 0xffffe0ff,

        LIME: 0x00ff00ff,

        LIMEGREEN: 0x32cd32ff,

        LINEN: 0xfaf0e6ff,

        MAGENTA: 0xff00ffff,

        MAROON: 0x800000ff,

        MEDIUMAQUAMARINE: 0x66cdaaff,

        MEDIUMBLUE: 0x0000cdff,

        MEDIUMORCHID: 0xba55d3ff,

        MEDIUMPURPLE: 0x9370dbff,

        MEDIUMSEAGREEN: 0x3cb371ff,

        MEDIUMSLATEBLUE: 0x7b68eeff,

        MEDIUMSPRINGGREEN: 0x00fa9aff,

        MEDIUMTURQUOISE: 0x48d1ccff,

        MEDIUMVIOLETRED: 0xc71585ff,

        MIDNIGHTBLUE: 0x191970ff,

        MINTCREAM: 0xf5fffaff,

        MISTYROSE: 0xffe4e1ff,

        MOCCASIN: 0xffe4b5ff,

        NAVAJOWHITE: 0xffdeadff,

        NAVY: 0x000080ff,

        OLDLACE: 0xfdf5e6ff,

        OLIVE: 0x808000ff,

        OLIVEDRAB: 0x6b8e23ff,

        ORANGE: 0xffa500ff,

        ORANGERED: 0xff4500ff,

        ORCHID: 0xda70d6ff,

        PALEGOLDENROD: 0xeee8aaff,

        PALEGREEN: 0x98fb98ff,

        PALETURQUOISE: 0xafeeeeff,

        PALEVIOLETRED: 0xdb7093ff,

        PAPAYAWHIP: 0xffefd5ff,

        PEACHPUFF: 0xffdab9ff,

        PERU: 0xcd853fff,

        PINK: 0xffc0cbff,

        PLUM: 0xdda0ddff,

        POWDERBLUE: 0xb0e0e6ff,

        PURPLE: 0x800080ff,

        REBECCAPURPLE: 0x663399ff,

        RED: 0xff0000ff,

        ROSYBROWN: 0xbc8f8fff,

        ROYALBLUE: 0x4169e1ff,

        SADDLEBROWN: 0x8b4513ff,

        SALMON: 0xfa8072ff,

        SANDYBROWN: 0xf4a460ff,

        SEAGREEN: 0x2e8b57ff,

        SEASHELL: 0xfff5eeff,

        SIENNA: 0xa0522dff,

        SILVER: 0xc0c0c0ff,

        SKYBLUE: 0x87ceebff,

        SLATEBLUE: 0x6a5acdff,

        SLATEGRAY: 0x708090ff,

        SLATEGREY: 0x708090ff,

        SNOW: 0xfffafaff,

        SPRINGGREEN: 0x00ff7fff,

        STEELBLUE: 0x4682b4ff,

        TAN: 0xd2b48cff,

        TEAL: 0x008080ff,

        THISTLE: 0xd8bfd8ff,

        TOMATO: 0xff6347ff,

        TRANSPARENT: 0x00000000,

        TURQUOISE: 0x40e0d0ff,

        VIOLET: 0xee82eeff,

        WHEAT: 0xf5deb3ff,

        WHITE: 0xffffffff,

        WHITESMOKE: 0xf5f5f5ff,

        YELLOW: 0xffff00ff,

        YELLOWGREEN: 0x9acd32ff

    };



    var PropertyDescriptorParsingType;

    (function (PropertyDescriptorParsingType) {

        PropertyDescriptorParsingType[PropertyDescriptorParsingType["VALUE"] = 0] = "VALUE";

        PropertyDescriptorParsingType[PropertyDescriptorParsingType["LIST"] = 1] = "LIST";

        PropertyDescriptorParsingType[PropertyDescriptorParsingType["IDENT_VALUE"] = 2] = "IDENT_VALUE";

        PropertyDescriptorParsingType[PropertyDescriptorParsingType["TYPE_VALUE"] = 3] = "TYPE_VALUE";

        PropertyDescriptorParsingType[PropertyDescriptorParsingType["TOKEN_VALUE"] = 4] = "TOKEN_VALUE";

    })(PropertyDescriptorParsingType || (PropertyDescriptorParsingType = {}));



    var BACKGROUND_CLIP;

    (function (BACKGROUND_CLIP) {

        BACKGROUND_CLIP[BACKGROUND_CLIP["BORDER_BOX"] = 0] = "BORDER_BOX";

        BACKGROUND_CLIP[BACKGROUND_CLIP["PADDING_BOX"] = 1] = "PADDING_BOX";

        BACKGROUND_CLIP[BACKGROUND_CLIP["CONTENT_BOX"] = 2] = "CONTENT_BOX";

    })(BACKGROUND_CLIP || (BACKGROUND_CLIP = {}));

    var backgroundClip = {

        name: 'background-clip',

        initialValue: 'border-box',

        prefix: false,

        type: PropertyDescriptorParsingType.LIST,

        parse: function (tokens) {

            return tokens.map(function (token) {

                if (isIdentToken(token)) {

                    switch (token.value) {

                        case 'padding-box':

                            return BACKGROUND_CLIP.PADDING_BOX;

                        case 'content-box':

                            return BACKGROUND_CLIP.CONTENT_BOX;

                    }

                }

                return BACKGROUND_CLIP.BORDER_BOX;

            });

        }

    };



    var backgroundColor = {

        name: "background-color",

        initialValue: 'transparent',

        prefix: false,

        type: PropertyDescriptorParsingType.TYPE_VALUE,

        format: 'color'

    };



    var parseColorStop = function (args) {

        var color$1 = color.parse(args[0]);

        var stop = args[1];

        return stop && isLengthPercentage(stop) ? { color: color$1, stop: stop } : { color: color$1, stop: null };

    };

    var processColorStops = function (stops, lineLength) {

        var first = stops[0];

        var last = stops[stops.length - 1];

        if (first.stop === null) {

            first.stop = ZERO_LENGTH;

        }

        if (last.stop === null) {

            last.stop = HUNDRED_PERCENT;

        }

        var processStops = [];

        var previous = 0;

        for (var i = 0; i < stops.length; i++) {

            var stop_1 = stops[i].stop;

            if (stop_1 !== null) {

                var absoluteValue = getAbsoluteValue(stop_1, lineLength);

                if (absoluteValue > previous) {

                    processStops.push(absoluteValue);

                }

                else {

                    processStops.push(previous);

                }

                previous = absoluteValue;

            }

            else {

                processStops.push(null);

            }

        }

        var gapBegin = null;

        for (var i = 0; i < processStops.length; i++) {

            var stop_2 = processStops[i];

            if (stop_2 === null) {

                if (gapBegin === null) {

                    gapBegin = i;

                }

            }

            else if (gapBegin !== null) {

                var gapLength = i - gapBegin;

                var beforeGap = processStops[gapBegin - 1];

                var gapValue = (stop_2 - beforeGap) / (gapLength + 1);

                for (var g = 1; g <= gapLength; g++) {

                    processStops[gapBegin + g - 1] = gapValue * g;

                }

                gapBegin = null;

            }

        }

        return stops.map(function (_a, i) {

            var color = _a.color;

            return { color: color, stop: Math.max(Math.min(1, processStops[i] / lineLength), 0) };

        });

    };

    var getAngleFromCorner = function (corner, width, height) {

        var centerX = width / 2;

        var centerY = height / 2;

        var x = getAbsoluteValue(corner[0], width) - centerX;

        var y = centerY - getAbsoluteValue(corner[1], height);

        return (Math.atan2(y, x) + Math.PI * 2) % (Math.PI * 2);

    };

    var calculateGradientDirection = function (angle, width, height) {

        var radian = typeof angle === 'number' ? angle : getAngleFromCorner(angle, width, height);

        var lineLength = Math.abs(width * Math.sin(radian)) + Math.abs(height * Math.cos(radian));

        var halfWidth = width / 2;

        var halfHeight = height / 2;

        var halfLineLength = lineLength / 2;

        var yDiff = Math.sin(radian - Math.PI / 2) * halfLineLength;

        var xDiff = Math.cos(radian - Math.PI / 2) * halfLineLength;

        return [lineLength, halfWidth - xDiff, halfWidth + xDiff, halfHeight - yDiff, halfHeight + yDiff];

    };

    var distance = function (a, b) { return Math.sqrt(a * a + b * b); };

    var findCorner = function (width, height, x, y, closest) {

        var corners = [[0, 0], [0, height], [width, 0], [width, height]];

        return corners.reduce(function (stat, corner) {

            var cx = corner[0], cy = corner[1];

            var d = distance(x - cx, y - cy);

            if (closest ? d < stat.optimumDistance : d > stat.optimumDistance) {

                return {

                    optimumCorner: corner,

                    optimumDistance: d

                };

            }

            return stat;

        }, {

            optimumDistance: closest ? Infinity : -Infinity,

            optimumCorner: null

        }).optimumCorner;

    };

    var calculateRadius = function (gradient, x, y, width, height) {

        var rx = 0;

        var ry = 0;

        switch (gradient.size) {

            case CSSRadialExtent.CLOSEST_SIDE:

                // The ending shape is sized so that that it exactly meets the side of the gradient box closest to the gradient’s center.

                // If the shape is an ellipse, it exactly meets the closest side in each dimension.

                if (gradient.shape === CSSRadialShape.CIRCLE) {

                    rx = ry = Math.min(Math.abs(x), Math.abs(x - width), Math.abs(y), Math.abs(y - height));

                }

                else if (gradient.shape === CSSRadialShape.ELLIPSE) {

                    rx = Math.min(Math.abs(x), Math.abs(x - width));

                    ry = Math.min(Math.abs(y), Math.abs(y - height));

                }

                break;

            case CSSRadialExtent.CLOSEST_CORNER:

                // The ending shape is sized so that that it passes through the corner of the gradient box closest to the gradient’s center.

                // If the shape is an ellipse, the ending shape is given the same aspect-ratio it would have if closest-side were specified.

                if (gradient.shape === CSSRadialShape.CIRCLE) {

                    rx = ry = Math.min(distance(x, y), distance(x, y - height), distance(x - width, y), distance(x - width, y - height));

                }

                else if (gradient.shape === CSSRadialShape.ELLIPSE) {

                    // Compute the ratio ry/rx (which is to be the same as for "closest-side")

                    var c = Math.min(Math.abs(y), Math.abs(y - height)) / Math.min(Math.abs(x), Math.abs(x - width));

                    var _a = findCorner(width, height, x, y, true), cx = _a[0], cy = _a[1];

                    rx = distance(cx - x, (cy - y) / c);

                    ry = c * rx;

                }

                break;

            case CSSRadialExtent.FARTHEST_SIDE:

                // Same as closest-side, except the ending shape is sized based on the farthest side(s)

                if (gradient.shape === CSSRadialShape.CIRCLE) {

                    rx = ry = Math.max(Math.abs(x), Math.abs(x - width), Math.abs(y), Math.abs(y - height));

                }

                else if (gradient.shape === CSSRadialShape.ELLIPSE) {

                    rx = Math.max(Math.abs(x), Math.abs(x - width));

                    ry = Math.max(Math.abs(y), Math.abs(y - height));

                }

                break;

            case CSSRadialExtent.FARTHEST_CORNER:

                // Same as closest-corner, except the ending shape is sized based on the farthest corner.

                // If the shape is an ellipse, the ending shape is given the same aspect ratio it would have if farthest-side were specified.

                if (gradient.shape === CSSRadialShape.CIRCLE) {

                    rx = ry = Math.max(distance(x, y), distance(x, y - height), distance(x - width, y), distance(x - width, y - height));

                }

                else if (gradient.shape === CSSRadialShape.ELLIPSE) {

                    // Compute the ratio ry/rx (which is to be the same as for "farthest-side")

                    var c = Math.max(Math.abs(y), Math.abs(y - height)) / Math.max(Math.abs(x), Math.abs(x - width));

                    var _b = findCorner(width, height, x, y, false), cx = _b[0], cy = _b[1];

                    rx = distance(cx - x, (cy - y) / c);

                    ry = c * rx;

                }

                break;

        }

        if (Array.isArray(gradient.size)) {

            rx = getAbsoluteValue(gradient.size[0], width);

            ry = gradient.size.length === 2 ? getAbsoluteValue(gradient.size[1], height) : rx;

        }

        return [rx, ry];

    };



    var linearGradient = function (tokens) {

        var angle$1 = deg(180);

        var stops = [];

        parseFunctionArgs(tokens).forEach(function (arg, i) {

            if (i === 0) {

                var firstToken = arg[0];

                if (firstToken.type === TokenType.IDENT_TOKEN && firstToken.value === 'to') {

                    angle$1 = parseNamedSide(arg);

                    return;

                }

                else if (isAngle(firstToken)) {

                    angle$1 = angle.parse(firstToken);

                    return;

                }

            }

            var colorStop = parseColorStop(arg);

            stops.push(colorStop);

        });

        return { angle: angle$1, stops: stops, type: CSSImageType.LINEAR_GRADIENT };

    };



    var prefixLinearGradient = function (tokens) {

        var angle$1 = deg(180);

        var stops = [];

        parseFunctionArgs(tokens).forEach(function (arg, i) {

            if (i === 0) {

                var firstToken = arg[0];

                if (firstToken.type === TokenType.IDENT_TOKEN &&

                    ['top', 'left', 'right', 'bottom'].indexOf(firstToken.value) !== -1) {

                    angle$1 = parseNamedSide(arg);

                    return;

                }

                else if (isAngle(firstToken)) {

                    angle$1 = (angle.parse(firstToken) + deg(270)) % deg(360);

                    return;

                }

            }

            var colorStop = parseColorStop(arg);

            stops.push(colorStop);

        });

        return {

            angle: angle$1,

            stops: stops,

            type: CSSImageType.LINEAR_GRADIENT

        };

    };



    var testRangeBounds = function (document) {

        var TEST_HEIGHT = 123;

        if (document.createRange) {

            var range = document.createRange();

            if (range.getBoundingClientRect) {

                var testElement = document.createElement('boundtest');

                testElement.style.height = TEST_HEIGHT + "px";

                testElement.style.display = 'block';

                document.body.appendChild(testElement);

                range.selectNode(testElement);

                var rangeBounds = range.getBoundingClientRect();

                var rangeHeight = Math.round(rangeBounds.height);

                document.body.removeChild(testElement);

                if (rangeHeight === TEST_HEIGHT) {

                    return true;

                }

            }

        }

        return false;

    };

    var testCORS = function () { return typeof new Image().crossOrigin !== 'undefined'; };

    var testResponseType = function () { return typeof new XMLHttpRequest().responseType === 'string'; };

    var testSVG = function (document) {

        var img = new Image();

        var canvas = document.createElement('canvas');

        var ctx = canvas.getContext('2d');

        if (!ctx) {

            return false;

        }

        img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";

        try {

            ctx.drawImage(img, 0, 0);

            canvas.toDataURL();

        }

        catch (e) {

            return false;

        }

        return true;

    };

    var isGreenPixel = function (data) {

        return data[0] === 0 && data[1] === 255 && data[2] === 0 && data[3] === 255;

    };

    var testForeignObject = function (document) {

        var canvas = document.createElement('canvas');

        var size = 100;

        canvas.width = size;

        canvas.height = size;

        var ctx = canvas.getContext('2d');

        if (!ctx) {

            return Promise.reject(false);

        }

        ctx.fillStyle = 'rgb(0, 255, 0)';

        ctx.fillRect(0, 0, size, size);

        var img = new Image();

        var greenImageSrc = canvas.toDataURL();

        img.src = greenImageSrc;

        var svg = createForeignObjectSVG(size, size, 0, 0, img);

        ctx.fillStyle = 'red';

        ctx.fillRect(0, 0, size, size);

        return loadSerializedSVG(svg)

            .then(function (img) {

                ctx.drawImage(img, 0, 0);

                var data = ctx.getImageData(0, 0, size, size).data;

                ctx.fillStyle = 'red';

                ctx.fillRect(0, 0, size, size);

                var node = document.createElement('div');

                node.style.backgroundImage = "url(" + greenImageSrc + ")";

                node.style.height = size + "px";

                // Firefox 55 does not render inline <img /> tags

                return isGreenPixel(data)

                    ? loadSerializedSVG(createForeignObjectSVG(size, size, 0, 0, node))

                    : Promise.reject(false);

            })

            .then(function (img) {

                ctx.drawImage(img, 0, 0);

                // Edge does not render background-images

                return isGreenPixel(ctx.getImageData(0, 0, size, size).data);

            })

            .catch(function () { return false; });

    };

    var createForeignObjectSVG = function (width, height, x, y, node) {

        var xmlns = 'http://www.w3.org/2000/svg';

        var svg = document.createElementNS(xmlns, 'svg');

        var foreignObject = document.createElementNS(xmlns, 'foreignObject');

        svg.setAttributeNS(null, 'width', width.toString());

        svg.setAttributeNS(null, 'height', height.toString());

        foreignObject.setAttributeNS(null, 'width', '100%');

        foreignObject.setAttributeNS(null, 'height', '100%');

        foreignObject.setAttributeNS(null, 'x', x.toString());

        foreignObject.setAttributeNS(null, 'y', y.toString());

        foreignObject.setAttributeNS(null, 'externalResourcesRequired', 'true');

        svg.appendChild(foreignObject);

        foreignObject.appendChild(node);

        return svg;

    };

    var loadSerializedSVG = function (svg) {

        return new Promise(function (resolve, reject) {

            var img = new Image();

            img.onload = function () { return resolve(img); };

            img.onerror = reject;

            img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(svg));

        });

    };

    var FEATURES = {

        get SUPPORT_RANGE_BOUNDS() {

            var value = testRangeBounds(document);

            Object.defineProperty(FEATURES, 'SUPPORT_RANGE_BOUNDS', { value: value });

            return value;

        },

        get SUPPORT_SVG_DRAWING() {

            var value = testSVG(document);

            Object.defineProperty(FEATURES, 'SUPPORT_SVG_DRAWING', { value: value });

            return value;

        },

        get SUPPORT_FOREIGNOBJECT_DRAWING() {

            var value = typeof Array.from === 'function' && typeof window.fetch === 'function'

                ? testForeignObject(document)

                : Promise.resolve(false);

            Object.defineProperty(FEATURES, 'SUPPORT_FOREIGNOBJECT_DRAWING', { value: value });

            return value;

        },

        get SUPPORT_CORS_IMAGES() {

            var value = testCORS();

            Object.defineProperty(FEATURES, 'SUPPORT_CORS_IMAGES', { value: value });

            return value;

        },

        get SUPPORT_RESPONSE_TYPE() {

            var value = testResponseType();

            Object.defineProperty(FEATURES, 'SUPPORT_RESPONSE_TYPE', { value: value });

            return value;

        },

        get SUPPORT_CORS_XHR() {

            var value = 'withCredentials' in new XMLHttpRequest();

            Object.defineProperty(FEATURES, 'SUPPORT_CORS_XHR', { value: value });

            return value;

        }

    };



    var Logger = /** @class */ (function () {

        function Logger(id) {

            this.id = id;

            this.start = Date.now();

        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any

        Logger.prototype.debug = function () {

            var args = [];

            for (var _i = 0; _i < arguments.length; _i++) {

                args[_i] = arguments[_i];

            }

            // eslint-disable-next-line no-console

            if (typeof window !== 'undefined' && window.console && typeof console.debug === 'function') {

                // eslint-disable-next-line no-console

                console.debug.apply(console, [this.id, this.getTime() + "ms"].concat(args));

            }

            else {

                this.info.apply(this, args);

            }

        };

        Logger.prototype.getTime = function () {

            return Date.now() - this.start;

        };

        Logger.create = function (id) {

            Logger.instances[id] = new Logger(id);

        };

        Logger.destroy = function (id) {

            delete Logger.instances[id];

        };

        Logger.getInstance = function (id) {

            var instance = Logger.instances[id];

            if (typeof instance === 'undefined') {

                throw new Error("No logger instance found with id " + id);

            }

            return instance;

        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any

        Logger.prototype.info = function () {

            var args = [];

            for (var _i = 0; _i < arguments.length; _i++) {

                args[_i] = arguments[_i];

            }

            // eslint-disable-next-line no-console

            if (typeof window !== 'undefined' && window.console && typeof console.info === 'function') {

                // eslint-disable-next-line no-console

                console.info.apply(console, [this.id, this.getTime() + "ms"].concat(args));

            }

        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any

        Logger.prototype.error = function () {

            var args = [];

            for (var _i = 0; _i < arguments.length; _i++) {

                args[_i] = arguments[_i];

            }

            // eslint-disable-next-line no-console

            if (typeof window !== 'undefined' && window.console && typeof console.error === 'function') {

                // eslint-disable-next-line no-console

                console.error.apply(console, [this.id, this.getTime() + "ms"].concat(args));

            }

            else {

                this.info.apply(this, args);

            }

        };

        Logger.instances = {};

        return Logger;

    }());



    var CacheStorage = /** @class */ (function () {

        function CacheStorage() {

        }

        CacheStorage.create = function (name, options) {

            return (CacheStorage._caches[name] = new Cache(name, options));

        };

        CacheStorage.destroy = function (name) {

            delete CacheStorage._caches[name];

        };

        CacheStorage.open = function (name) {

            var cache = CacheStorage._caches[name];

            if (typeof cache !== 'undefined') {

                return cache;

            }

            throw new Error("Cache with key \"" + name + "\" not found");

        };

        CacheStorage.getOrigin = function (url) {

            var link = CacheStorage._link;

            if (!link) {

                return 'about:blank';

            }

            link.href = url;

            link.href = link.href; // IE9, LOL! - http://jsfiddle.net/niklasvh/2e48b/

            return link.protocol + link.hostname + link.port;

        };

        CacheStorage.isSameOrigin = function (src) {

            return CacheStorage.getOrigin(src) === CacheStorage._origin;

        };

        CacheStorage.setContext = function (window) {

            CacheStorage._link = window.document.createElement('a');

            CacheStorage._origin = CacheStorage.getOrigin(window.location.href);

        };

        CacheStorage.getInstance = function () {

            var current = CacheStorage._current;

            if (current === null) {

                throw new Error("No cache instance attached");

            }

            return current;

        };

        CacheStorage.attachInstance = function (cache) {

            CacheStorage._current = cache;

        };

        CacheStorage.detachInstance = function () {

            CacheStorage._current = null;

        };

        CacheStorage._caches = {};

        CacheStorage._origin = 'about:blank';

        CacheStorage._current = null;

        return CacheStorage;

    }());

    var Cache = /** @class */ (function () {

        function Cache(id, options) {

            this.id = id;

            this._options = options;

            this._cache = {};

        }

        Cache.prototype.addImage = function (src) {

            var result = Promise.resolve();

            if (this.has(src)) {

                return result;

            }

            if (isBlobImage(src) || isRenderable(src)) {

                this._cache[src] = this.loadImage(src);

                return result;

            }

            return result;

        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any

        Cache.prototype.match = function (src) {

            return this._cache[src];

        };

        Cache.prototype.loadImage = function (key) {

            return __awaiter(this, void 0, void 0, function () {

                var isSameOrigin, useCORS, useProxy, src;

                var _this = this;

                return __generator(this, function (_a) {

                    switch (_a.label) {

                        case 0:

                            isSameOrigin = CacheStorage.isSameOrigin(key);

                            useCORS = !isInlineImage(key) && this._options.useCORS === true && FEATURES.SUPPORT_CORS_IMAGES && !isSameOrigin;

                            useProxy = !isInlineImage(key) &&

                                !isSameOrigin &&

                                typeof this._options.proxy === 'string' &&

                                FEATURES.SUPPORT_CORS_XHR &&

                                !useCORS;

                            if (!isSameOrigin && this._options.allowTaint === false && !isInlineImage(key) && !useProxy && !useCORS) {

                                return [2 /*return*/];

                            }

                            src = key;

                            if (!useProxy) return [3 /*break*/, 2];

                            return [4 /*yield*/, this.proxy(src)];

                        case 1:

                            src = _a.sent();

                            _a.label = 2;

                        case 2:

                            Logger.getInstance(this.id).debug("Added image " + key.substring(0, 256));

                            return [4 /*yield*/, new Promise(function (resolve, reject) {

                                var img = new Image();

                                img.onload = function () { return resolve(img); };

                                img.onerror = reject;

                                //ios safari 10.3 taints canvas with data urls unless crossOrigin is set to anonymous

                                if (isInlineBase64Image(src) || useCORS) {

                                    img.crossOrigin = 'anonymous';

                                }

                                img.src = src;

                                if (img.complete === true) {

                                    // Inline XML images may fail to parse, throwing an Error later on

                                    setTimeout(function () { return resolve(img); }, 500);

                                }

                                if (_this._options.imageTimeout > 0) {

                                    setTimeout(function () { return reject("Timed out (" + _this._options.imageTimeout + "ms) loading image"); }, _this._options.imageTimeout);

                                }

                            })];

                        case 3: return [2 /*return*/, _a.sent()];

                    }

                });

            });

        };

        Cache.prototype.has = function (key) {

            return typeof this._cache[key] !== 'undefined';

        };

        Cache.prototype.keys = function () {

            return Promise.resolve(Object.keys(this._cache));

        };

        Cache.prototype.proxy = function (src) {

            var _this = this;

            var proxy = this._options.proxy;

            if (!proxy) {

                throw new Error('No proxy defined');

            }

            var key = src.substring(0, 256);

            return new Promise(function (resolve, reject) {

                var responseType = FEATURES.SUPPORT_RESPONSE_TYPE ? 'blob' : 'text';

                var xhr = new XMLHttpRequest();

                xhr.onload = function () {

                    if (xhr.status === 200) {

                        if (responseType === 'text') {

                            resolve(xhr.response);

                        }

                        else {

                            var reader_1 = new FileReader();

                            reader_1.addEventListener('load', function () { return resolve(reader_1.result); }, false);

                            reader_1.addEventListener('error', function (e) { return reject(e); }, false);

                            reader_1.readAsDataURL(xhr.response);

                        }

                    }

                    else {

                        reject("Failed to proxy resource " + key + " with status code " + xhr.status);

                    }

                };

                xhr.onerror = reject;

                xhr.open('GET', proxy + "?url=" + encodeURIComponent(src) + "&responseType=" + responseType);

                if (responseType !== 'text' && xhr instanceof XMLHttpRequest) {

                    xhr.responseType = responseType;

                }

                if (_this._options.imageTimeout) {

                    var timeout_1 = _this._options.imageTimeout;

                    xhr.timeout = timeout_1;

                    xhr.ontimeout = function () { return reject("Timed out (" + timeout_1 + "ms) proxying " + key); };

                }

                xhr.send();

            });

        };

        return Cache;

    }());

    var INLINE_SVG = /^data:image\/svg\+xml/i;

    var INLINE_BASE64 = /^data:image\/.*;base64,/i;

    var INLINE_IMG = /^data:image\/.*/i;

    var isRenderable = function (src) { return FEATURES.SUPPORT_SVG_DRAWING || !isSVG(src); };

    var isInlineImage = function (src) { return INLINE_IMG.test(src); };

    var isInlineBase64Image = function (src) { return INLINE_BASE64.test(src); };

    var isBlobImage = function (src) { return src.substr(0, 4) === 'blob'; };

    var isSVG = function (src) { return src.substr(-3).toLowerCase() === 'svg' || INLINE_SVG.test(src); };



    var webkitGradient = function (tokens) {

        var angle = deg(180);

        var stops = [];

        var type = CSSImageType.LINEAR_GRADIENT;

        var shape = CSSRadialShape.CIRCLE;

        var size = CSSRadialExtent.FARTHEST_CORNER;

        var position = [];

        parseFunctionArgs(tokens).forEach(function (arg, i) {

            var firstToken = arg[0];

            if (i === 0) {

                if (isIdentToken(firstToken) && firstToken.value === 'linear') {

                    type = CSSImageType.LINEAR_GRADIENT;

                    return;

                }

                else if (isIdentToken(firstToken) && firstToken.value === 'radial') {

                    type = CSSImageType.RADIAL_GRADIENT;

                    return;

                }

            }

            if (firstToken.type === TokenType.FUNCTION) {

                if (firstToken.name === 'from') {

                    var color$1 = color.parse(firstToken.values[0]);

                    stops.push({ stop: ZERO_LENGTH, color: color$1 });

                }

                else if (firstToken.name === 'to') {

                    var color$1 = color.parse(firstToken.values[0]);

                    stops.push({ stop: HUNDRED_PERCENT, color: color$1 });

                }

                else if (firstToken.name === 'color-stop') {

                    var values = firstToken.values.filter(nonFunctionArgSeparator);

                    if (values.length === 2) {

                        var color$1 = color.parse(values[1]);

                        var stop_1 = values[0];

                        if (isNumberToken(stop_1)) {

                            stops.push({

                                stop: { type: TokenType.PERCENTAGE_TOKEN, number: stop_1.number * 100, flags: stop_1.flags },

                                color: color$1

                            });

                        }

                    }

                }

            }

        });

        return type === CSSImageType.LINEAR_GRADIENT

            ? {

                angle: (angle + deg(180)) % deg(360),

                stops: stops,

                type: type

            }

            : { size: size, shape: shape, stops: stops, position: position, type: type };

    };



    var CLOSEST_SIDE = 'closest-side';

    var FARTHEST_SIDE = 'farthest-side';

    var CLOSEST_CORNER = 'closest-corner';

    var FARTHEST_CORNER = 'farthest-corner';

    var CIRCLE = 'circle';

    var ELLIPSE = 'ellipse';

    var COVER = 'cover';

    var CONTAIN = 'contain';

    var radialGradient = function (tokens) {

        var shape = CSSRadialShape.CIRCLE;

        var size = CSSRadialExtent.FARTHEST_CORNER;

        var stops = [];

        var position = [];

        parseFunctionArgs(tokens).forEach(function (arg, i) {

            var isColorStop = true;

            if (i === 0) {

                var isAtPosition_1 = false;

                isColorStop = arg.reduce(function (acc, token) {

                    if (isAtPosition_1) {

                        if (isIdentToken(token)) {

                            switch (token.value) {

                                case 'center':

                                    position.push(FIFTY_PERCENT);

                                    return acc;

                                case 'top':

                                case 'left':

                                    position.push(ZERO_LENGTH);

                                    return acc;

                                case 'right':

                                case 'bottom':

                                    position.push(HUNDRED_PERCENT);

                                    return acc;

                            }

                        }

                        else if (isLengthPercentage(token) || isLength(token)) {

                            position.push(token);

                        }

                    }

                    else if (isIdentToken(token)) {

                        switch (token.value) {

                            case CIRCLE:

                                shape = CSSRadialShape.CIRCLE;

                                return false;

                            case ELLIPSE:

                                shape = CSSRadialShape.ELLIPSE;

                                return false;

                            case 'at':

                                isAtPosition_1 = true;

                                return false;

                            case CLOSEST_SIDE:

                                size = CSSRadialExtent.CLOSEST_SIDE;

                                return false;

                            case COVER:

                            case FARTHEST_SIDE:

                                size = CSSRadialExtent.FARTHEST_SIDE;

                                return false;

                            case CONTAIN:

                            case CLOSEST_CORNER:

                                size = CSSRadialExtent.CLOSEST_CORNER;

                                return false;

                            case FARTHEST_CORNER:

                                size = CSSRadialExtent.FARTHEST_CORNER;

                                return false;

                        }

                    }

                    else if (isLength(token) || isLengthPercentage(token)) {

                        if (!Array.isArray(size)) {

                            size = [];

                        }

                        size.push(token);

                        return false;

                    }

                    return acc;

                }, isColorStop);

            }

            if (isColorStop) {

                var colorStop = parseColorStop(arg);

                stops.push(colorStop);

            }

        });

        return { size: size, shape: shape, stops: stops, position: position, type: CSSImageType.RADIAL_GRADIENT };

    };



    var prefixRadialGradient = function (tokens) {

        var shape = CSSRadialShape.CIRCLE;

        var size = CSSRadialExtent.FARTHEST_CORNER;

        var stops = [];

        var position = [];

        parseFunctionArgs(tokens).forEach(function (arg, i) {

            var isColorStop = true;

            if (i === 0) {

                isColorStop = arg.reduce(function (acc, token) {

                    if (isIdentToken(token)) {

                        switch (token.value) {

                            case 'center':

                                position.push(FIFTY_PERCENT);

                                return false;

                            case 'top':

                            case 'left':

                                position.push(ZERO_LENGTH);

                                return false;

                            case 'right':

                            case 'bottom':

                                position.push(HUNDRED_PERCENT);

                                return false;

                        }

                    }

                    else if (isLengthPercentage(token) || isLength(token)) {

                        position.push(token);

                        return false;

                    }

                    return acc;

                }, isColorStop);

            }

            else if (i === 1) {

                isColorStop = arg.reduce(function (acc, token) {

                    if (isIdentToken(token)) {

                        switch (token.value) {

                            case CIRCLE:

                                shape = CSSRadialShape.CIRCLE;

                                return false;

                            case ELLIPSE:

                                shape = CSSRadialShape.ELLIPSE;

                                return false;

                            case CONTAIN:

                            case CLOSEST_SIDE:

                                size = CSSRadialExtent.CLOSEST_SIDE;

                                return false;

                            case FARTHEST_SIDE:

                                size = CSSRadialExtent.FARTHEST_SIDE;

                                return false;

                            case CLOSEST_CORNER:

                                size = CSSRadialExtent.CLOSEST_CORNER;

                                return false;

                            case COVER:

                            case FARTHEST_CORNER:

                                size = CSSRadialExtent.FARTHEST_CORNER;

                                return false;

                        }

                    }

                    else if (isLength(token) || isLengthPercentage(token)) {

                        if (!Array.isArray(size)) {

                            size = [];

                        }

                        size.push(token);

                        return false;

                    }

                    return acc;

                }, isColorStop);

            }

            if (isColorStop) {

                var colorStop = parseColorStop(arg);

                stops.push(colorStop);

            }

        });

        return { size: size, shape: shape, stops: stops, position: position, type: CSSImageType.RADIAL_GRADIENT };

    };



    var CSSImageType;

    (function (CSSImageType) {

        CSSImageType[CSSImageType["URL"] = 0] = "URL";

        CSSImageType[CSSImageType["LINEAR_GRADIENT"] = 1] = "LINEAR_GRADIENT";

        CSSImageType[CSSImageType["RADIAL_GRADIENT"] = 2] = "RADIAL_GRADIENT";

    })(CSSImageType || (CSSImageType = {}));

    var isLinearGradient = function (background) {

        return background.type === CSSImageType.LINEAR_GRADIENT;

    };

    var isRadialGradient = function (background) {

        return background.type === CSSImageType.RADIAL_GRADIENT;

    };

    var CSSRadialShape;

    (function (CSSRadialShape) {

        CSSRadialShape[CSSRadialShape["CIRCLE"] = 0] = "CIRCLE";

        CSSRadialShape[CSSRadialShape["ELLIPSE"] = 1] = "ELLIPSE";

    })(CSSRadialShape || (CSSRadialShape = {}));

    var CSSRadialExtent;

    (function (CSSRadialExtent) {

        CSSRadialExtent[CSSRadialExtent["CLOSEST_SIDE"] = 0] = "CLOSEST_SIDE";

        CSSRadialExtent[CSSRadialExtent["FARTHEST_SIDE"] = 1] = "FARTHEST_SIDE";

        CSSRadialExtent[CSSRadialExtent["CLOSEST_CORNER"] = 2] = "CLOSEST_CORNER";

        CSSRadialExtent[CSSRadialExtent["FARTHEST_CORNER"] = 3] = "FARTHEST_CORNER";

    })(CSSRadialExtent || (CSSRadialExtent = {}));

    var image = {

        name: 'image',

        parse: function (value) {

            if (value.type === TokenType.URL_TOKEN) {

                var image_1 = { url: value.value, type: CSSImageType.URL };

                CacheStorage.getInstance().addImage(value.value);

                return image_1;

            }

            if (value.type === TokenType.FUNCTION) {

                var imageFunction = SUPPORTED_IMAGE_FUNCTIONS[value.name];

                if (typeof imageFunction === 'undefined') {

                    throw new Error("Attempting to parse an unsupported image function \"" + value.name + "\"");

                }

                return imageFunction(value.values);

            }

            throw new Error("Unsupported image type");

        }

    };

    function isSupportedImage(value) {

        return value.type !== TokenType.FUNCTION || SUPPORTED_IMAGE_FUNCTIONS[value.name];

    }

    var SUPPORTED_IMAGE_FUNCTIONS = {

        'linear-gradient': linearGradient,

        '-moz-linear-gradient': prefixLinearGradient,

        '-ms-linear-gradient': prefixLinearGradient,

        '-o-linear-gradient': prefixLinearGradient,

        '-webkit-linear-gradient': prefixLinearGradient,

        'radial-gradient': radialGradient,

        '-moz-radial-gradient': prefixRadialGradient,

        '-ms-radial-gradient': prefixRadialGradient,

        '-o-radial-gradient': prefixRadialGradient,

        '-webkit-radial-gradient': prefixRadialGradient,

        '-webkit-gradient': webkitGradient

    };



    var backgroundImage = {

        name: 'background-image',

        initialValue: 'none',

        type: PropertyDescriptorParsingType.LIST,

        prefix: false,

        parse: function (tokens) {

            if (tokens.length === 0) {

                return [];

            }

            var first = tokens[0];

            if (first.type === TokenType.IDENT_TOKEN && first.value === 'none') {

                return [];

            }

            return tokens.filter(function (value) { return nonFunctionArgSeparator(value) && isSupportedImage(value); }).map(image.parse);

        }

    };



    var backgroundOrigin = {

        name: 'background-origin',

        initialValue: 'border-box',

        prefix: false,

        type: PropertyDescriptorParsingType.LIST,

        parse: function (tokens) {

            return tokens.map(function (token) {

                if (isIdentToken(token)) {

                    switch (token.value) {

                        case 'padding-box':

                            return 1 /* PADDING_BOX */;

                        case 'content-box':

                            return 2 /* CONTENT_BOX */;

                    }

                }

                return 0 /* BORDER_BOX */;

            });

        }

    };



    var backgroundPosition = {

        name: 'background-position',

        initialValue: '0% 0%',

        type: PropertyDescriptorParsingType.LIST,

        prefix: false,

        parse: function (tokens) {

            return parseFunctionArgs(tokens)

                .map(function (values) { return values.filter(isLengthPercentage); })

                .map(parseLengthPercentageTuple);

        }

    };



    var BACKGROUND_REPEAT;

    (function (BACKGROUND_REPEAT) {

        BACKGROUND_REPEAT[BACKGROUND_REPEAT["REPEAT"] = 0] = "REPEAT";

        BACKGROUND_REPEAT[BACKGROUND_REPEAT["NO_REPEAT"] = 1] = "NO_REPEAT";

        BACKGROUND_REPEAT[BACKGROUND_REPEAT["REPEAT_X"] = 2] = "REPEAT_X";

        BACKGROUND_REPEAT[BACKGROUND_REPEAT["REPEAT_Y"] = 3] = "REPEAT_Y";

    })(BACKGROUND_REPEAT || (BACKGROUND_REPEAT = {}));

    var backgroundRepeat = {

        name: 'background-repeat',

        initialValue: 'repeat',

        prefix: false,

        type: PropertyDescriptorParsingType.LIST,

        parse: function (tokens) {

            return parseFunctionArgs(tokens)

                .map(function (values) {

                    return values

                        .filter(isIdentToken)

                        .map(function (token) { return token.value; })

                        .join(' ');

                })

                .map(parseBackgroundRepeat);

        }

    };

    var parseBackgroundRepeat = function (value) {

        switch (value) {

            case 'no-repeat':

                return BACKGROUND_REPEAT.NO_REPEAT;

            case 'repeat-x':

            case 'repeat no-repeat':

                return BACKGROUND_REPEAT.REPEAT_X;

            case 'repeat-y':

            case 'no-repeat repeat':

                return BACKGROUND_REPEAT.REPEAT_Y;

            case 'repeat':

            default:

                return BACKGROUND_REPEAT.REPEAT;

        }

    };



    var BACKGROUND_SIZE;

    (function (BACKGROUND_SIZE) {

        BACKGROUND_SIZE["AUTO"] = "auto";

        BACKGROUND_SIZE["CONTAIN"] = "contain";

        BACKGROUND_SIZE["COVER"] = "cover";

    })(BACKGROUND_SIZE || (BACKGROUND_SIZE = {}));

    var backgroundSize = {

        name: 'background-size',

        initialValue: '0',

        prefix: false,

        type: PropertyDescriptorParsingType.LIST,

        parse: function (tokens) {

            return parseFunctionArgs(tokens).map(function (values) { return values.filter(isBackgroundSizeInfoToken); });

        }

    };

    var isBackgroundSizeInfoToken = function (value) {

        return isIdentToken(value) || isLengthPercentage(value);

    };



    var borderColorForSide = function (side) { return ({

        name: "border-" + side + "-color",

        initialValue: 'transparent',

        prefix: false,

        type: PropertyDescriptorParsingType.TYPE_VALUE,

        format: 'color'

    }); };

    var borderTopColor = borderColorForSide('top');

    var borderRightColor = borderColorForSide('right');

    var borderBottomColor = borderColorForSide('bottom');

    var borderLeftColor = borderColorForSide('left');



    var borderRadiusForSide = function (side) { return ({

        name: "border-radius-" + side,

        initialValue: '0 0',

        prefix: false,

        type: PropertyDescriptorParsingType.LIST,

        parse: function (tokens) { return parseLengthPercentageTuple(tokens.filter(isLengthPercentage)); }

    }); };

    var borderTopLeftRadius = borderRadiusForSide('top-left');

    var borderTopRightRadius = borderRadiusForSide('top-right');

    var borderBottomRightRadius = borderRadiusForSide('bottom-right');

    var borderBottomLeftRadius = borderRadiusForSide('bottom-left');



    var BORDER_STYLE;

    (function (BORDER_STYLE) {

        BORDER_STYLE[BORDER_STYLE["NONE"] = 0] = "NONE";

        BORDER_STYLE[BORDER_STYLE["SOLID"] = 1] = "SOLID";

    })(BORDER_STYLE || (BORDER_STYLE = {}));

    var borderStyleForSide = function (side) { return ({

        name: "border-" + side + "-style",

        initialValue: 'solid',

        prefix: false,

        type: PropertyDescriptorParsingType.IDENT_VALUE,

        parse: function (style) {

            switch (style) {

                case 'none':

                    return BORDER_STYLE.NONE;

            }

            return BORDER_STYLE.SOLID;

        }

    }); };

    var borderTopStyle = borderStyleForSide('top');

    var borderRightStyle = borderStyleForSide('right');

    var borderBottomStyle = borderStyleForSide('bottom');

    var borderLeftStyle = borderStyleForSide('left');



    var borderWidthForSide = function (side) { return ({

        name: "border-" + side + "-width",

        initialValue: '0',

        type: PropertyDescriptorParsingType.VALUE,

        prefix: false,

        parse: function (token) {

            if (isDimensionToken(token)) {

                return token.number;

            }

            return 0;

        }

    }); };

    var borderTopWidth = borderWidthForSide('top');

    var borderRightWidth = borderWidthForSide('right');

    var borderBottomWidth = borderWidthForSide('bottom');

    var borderLeftWidth = borderWidthForSide('left');



    var color$1 = {

        name: "color",

        initialValue: 'transparent',

        prefix: false,

        type: PropertyDescriptorParsingType.TYPE_VALUE,

        format: 'color'

    };



    var display = {

        name: 'display',

        initialValue: 'inline-block',

        prefix: false,

        type: PropertyDescriptorParsingType.LIST,

        parse: function (tokens) {

            return tokens.filter(isIdentToken).reduce(function (bit, token) {

                return bit | parseDisplayValue(token.value);

            }, 0 /* NONE */);

        }

    };

    var parseDisplayValue = function (display) {

        switch (display) {

            case 'block':

                return 2 /* BLOCK */;

            case 'inline':

                return 4 /* INLINE */;

            case 'run-in':

                return 8 /* RUN_IN */;

            case 'flow':

                return 16 /* FLOW */;

            case 'flow-root':

                return 32 /* FLOW_ROOT */;

            case 'table':

                return 64 /* TABLE */;

            case 'flex':

            case '-webkit-flex':

                return 128 /* FLEX */;

            case 'grid':

                return 256 /* GRID */;

            case 'ruby':

                return 512 /* RUBY */;

            case 'subgrid':

                return 1024 /* SUBGRID */;

            case 'list-item':

                return 2048 /* LIST_ITEM */;

            case 'table-row-group':

                return 4096 /* TABLE_ROW_GROUP */;

            case 'table-header-group':

                return 8192 /* TABLE_HEADER_GROUP */;

            case 'table-footer-group':

                return 16384 /* TABLE_FOOTER_GROUP */;

            case 'table-row':

                return 32768 /* TABLE_ROW */;

            case 'table-cell':

                return 65536 /* TABLE_CELL */;

            case 'table-column-group':

                return 131072 /* TABLE_COLUMN_GROUP */;

            case 'table-column':

                return 262144 /* TABLE_COLUMN */;

            case 'table-caption':

                return 524288 /* TABLE_CAPTION */;

            case 'ruby-base':

                return 1048576 /* RUBY_BASE */;

            case 'ruby-text':

                return 2097152 /* RUBY_TEXT */;

            case 'ruby-base-container':

                return 4194304 /* RUBY_BASE_CONTAINER */;

            case 'ruby-text-container':

                return 8388608 /* RUBY_TEXT_CONTAINER */;

            case 'contents':

                return 16777216 /* CONTENTS */;

            case 'inline-block':

                return 33554432 /* INLINE_BLOCK */;

            case 'inline-list-item':

                return 67108864 /* INLINE_LIST_ITEM */;

            case 'inline-table':

                return 134217728 /* INLINE_TABLE */;

            case 'inline-flex':

                return 268435456 /* INLINE_FLEX */;

            case 'inline-grid':

                return 536870912 /* INLINE_GRID */;

        }

        return 0 /* NONE */;

    };



    var FLOAT;

    (function (FLOAT) {

        FLOAT[FLOAT["NONE"] = 0] = "NONE";

        FLOAT[FLOAT["LEFT"] = 1] = "LEFT";

        FLOAT[FLOAT["RIGHT"] = 2] = "RIGHT";

        FLOAT[FLOAT["INLINE_START"] = 3] = "INLINE_START";

        FLOAT[FLOAT["INLINE_END"] = 4] = "INLINE_END";

    })(FLOAT || (FLOAT = {}));

    var float = {

        name: 'float',

        initialValue: 'none',

        prefix: false,

        type: PropertyDescriptorParsingType.IDENT_VALUE,

        parse: function (float) {

            switch (float) {

                case 'left':

                    return FLOAT.LEFT;

                case 'right':

                    return FLOAT.RIGHT;

                case 'inline-start':

                    return FLOAT.INLINE_START;

                case 'inline-end':

                    return FLOAT.INLINE_END;

            }

            return FLOAT.NONE;

        }

    };



    var letterSpacing = {

        name: 'letter-spacing',

        initialValue: '0',

        prefix: false,

        type: PropertyDescriptorParsingType.VALUE,

        parse: function (token) {

            if (token.type === TokenType.IDENT_TOKEN && token.value === 'normal') {

                return 0;

            }

            if (token.type === TokenType.NUMBER_TOKEN) {

                return token.number;

            }

            if (token.type === TokenType.DIMENSION_TOKEN) {

                return token.number;

            }

            return 0;

        }

    };



    var LINE_BREAK;

    (function (LINE_BREAK) {

        LINE_BREAK["NORMAL"] = "normal";

        LINE_BREAK["STRICT"] = "strict";

    })(LINE_BREAK || (LINE_BREAK = {}));

    var lineBreak = {

        name: 'line-break',

        initialValue: 'normal',

        prefix: false,

        type: PropertyDescriptorParsingType.IDENT_VALUE,

        parse: function (lineBreak) {

            switch (lineBreak) {

                case 'strict':

                    return LINE_BREAK.STRICT;

                case 'normal':

                default:

                    return LINE_BREAK.NORMAL;

            }

        }

    };



    var lineHeight = {

        name: 'line-height',

        initialValue: 'normal',

        prefix: false,

        type: PropertyDescriptorParsingType.TOKEN_VALUE

    };

    var computeLineHeight = function (token, fontSize) {

        if (isIdentToken(token) && token.value === 'normal') {

            return 1.2 * fontSize;

        }

        else if (token.type === TokenType.NUMBER_TOKEN) {

            return fontSize * token.number;

        }

        else if (isLengthPercentage(token)) {

            return getAbsoluteValue(token, fontSize);

        }

        return fontSize;

    };



    var listStyleImage = {

        name: 'list-style-image',

        initialValue: 'none',

        type: PropertyDescriptorParsingType.VALUE,

        prefix: false,

        parse: function (token) {

            if (token.type === TokenType.IDENT_TOKEN && token.value === 'none') {

                return null;

            }

            return image.parse(token);

        }

    };



    var LIST_STYLE_POSITION;

    (function (LIST_STYLE_POSITION) {

        LIST_STYLE_POSITION[LIST_STYLE_POSITION["INSIDE"] = 0] = "INSIDE";

        LIST_STYLE_POSITION[LIST_STYLE_POSITION["OUTSIDE"] = 1] = "OUTSIDE";

    })(LIST_STYLE_POSITION || (LIST_STYLE_POSITION = {}));

    var listStylePosition = {

        name: 'list-style-position',

        initialValue: 'outside',

        prefix: false,

        type: PropertyDescriptorParsingType.IDENT_VALUE,

        parse: function (position) {

            switch (position) {

                case 'inside':

                    return LIST_STYLE_POSITION.INSIDE;

                case 'outside':

                default:

                    return LIST_STYLE_POSITION.OUTSIDE;

            }

        }

    };



    var LIST_STYLE_TYPE;

    (function (LIST_STYLE_TYPE) {

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["NONE"] = -1] = "NONE";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["DISC"] = 0] = "DISC";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["CIRCLE"] = 1] = "CIRCLE";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["SQUARE"] = 2] = "SQUARE";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["DECIMAL"] = 3] = "DECIMAL";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["CJK_DECIMAL"] = 4] = "CJK_DECIMAL";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["DECIMAL_LEADING_ZERO"] = 5] = "DECIMAL_LEADING_ZERO";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["LOWER_ROMAN"] = 6] = "LOWER_ROMAN";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["UPPER_ROMAN"] = 7] = "UPPER_ROMAN";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["LOWER_GREEK"] = 8] = "LOWER_GREEK";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["LOWER_ALPHA"] = 9] = "LOWER_ALPHA";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["UPPER_ALPHA"] = 10] = "UPPER_ALPHA";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["ARABIC_INDIC"] = 11] = "ARABIC_INDIC";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["ARMENIAN"] = 12] = "ARMENIAN";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["BENGALI"] = 13] = "BENGALI";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["CAMBODIAN"] = 14] = "CAMBODIAN";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["CJK_EARTHLY_BRANCH"] = 15] = "CJK_EARTHLY_BRANCH";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["CJK_HEAVENLY_STEM"] = 16] = "CJK_HEAVENLY_STEM";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["CJK_IDEOGRAPHIC"] = 17] = "CJK_IDEOGRAPHIC";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["DEVANAGARI"] = 18] = "DEVANAGARI";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["ETHIOPIC_NUMERIC"] = 19] = "ETHIOPIC_NUMERIC";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["GEORGIAN"] = 20] = "GEORGIAN";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["GUJARATI"] = 21] = "GUJARATI";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["GURMUKHI"] = 22] = "GURMUKHI";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["HEBREW"] = 22] = "HEBREW";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["HIRAGANA"] = 23] = "HIRAGANA";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["HIRAGANA_IROHA"] = 24] = "HIRAGANA_IROHA";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["JAPANESE_FORMAL"] = 25] = "JAPANESE_FORMAL";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["JAPANESE_INFORMAL"] = 26] = "JAPANESE_INFORMAL";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["KANNADA"] = 27] = "KANNADA";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["KATAKANA"] = 28] = "KATAKANA";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["KATAKANA_IROHA"] = 29] = "KATAKANA_IROHA";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["KHMER"] = 30] = "KHMER";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["KOREAN_HANGUL_FORMAL"] = 31] = "KOREAN_HANGUL_FORMAL";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["KOREAN_HANJA_FORMAL"] = 32] = "KOREAN_HANJA_FORMAL";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["KOREAN_HANJA_INFORMAL"] = 33] = "KOREAN_HANJA_INFORMAL";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["LAO"] = 34] = "LAO";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["LOWER_ARMENIAN"] = 35] = "LOWER_ARMENIAN";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["MALAYALAM"] = 36] = "MALAYALAM";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["MONGOLIAN"] = 37] = "MONGOLIAN";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["MYANMAR"] = 38] = "MYANMAR";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["ORIYA"] = 39] = "ORIYA";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["PERSIAN"] = 40] = "PERSIAN";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["SIMP_CHINESE_FORMAL"] = 41] = "SIMP_CHINESE_FORMAL";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["SIMP_CHINESE_INFORMAL"] = 42] = "SIMP_CHINESE_INFORMAL";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["TAMIL"] = 43] = "TAMIL";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["TELUGU"] = 44] = "TELUGU";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["THAI"] = 45] = "THAI";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["TIBETAN"] = 46] = "TIBETAN";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["TRAD_CHINESE_FORMAL"] = 47] = "TRAD_CHINESE_FORMAL";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["TRAD_CHINESE_INFORMAL"] = 48] = "TRAD_CHINESE_INFORMAL";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["UPPER_ARMENIAN"] = 49] = "UPPER_ARMENIAN";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["DISCLOSURE_OPEN"] = 50] = "DISCLOSURE_OPEN";

        LIST_STYLE_TYPE[LIST_STYLE_TYPE["DISCLOSURE_CLOSED"] = 51] = "DISCLOSURE_CLOSED";

    })(LIST_STYLE_TYPE || (LIST_STYLE_TYPE = {}));

    var listStyleType = {

        name: 'list-style-type',

        initialValue: 'none',

        prefix: false,

        type: PropertyDescriptorParsingType.IDENT_VALUE,

        parse: function (type) {

            switch (type) {

                case 'disc':

                    return LIST_STYLE_TYPE.DISC;

                case 'circle':

                    return LIST_STYLE_TYPE.CIRCLE;

                case 'square':

                    return LIST_STYLE_TYPE.SQUARE;

                case 'decimal':

                    return LIST_STYLE_TYPE.DECIMAL;

                case 'cjk-decimal':

                    return LIST_STYLE_TYPE.CJK_DECIMAL;

                case 'decimal-leading-zero':

                    return LIST_STYLE_TYPE.DECIMAL_LEADING_ZERO;

                case 'lower-roman':

                    return LIST_STYLE_TYPE.LOWER_ROMAN;

                case 'upper-roman':

                    return LIST_STYLE_TYPE.UPPER_ROMAN;

                case 'lower-greek':

                    return LIST_STYLE_TYPE.LOWER_GREEK;

                case 'lower-alpha':

                    return LIST_STYLE_TYPE.LOWER_ALPHA;

                case 'upper-alpha':

                    return LIST_STYLE_TYPE.UPPER_ALPHA;

                case 'arabic-indic':

                    return LIST_STYLE_TYPE.ARABIC_INDIC;

                case 'armenian':

                    return LIST_STYLE_TYPE.ARMENIAN;

                case 'bengali':

                    return LIST_STYLE_TYPE.BENGALI;

                case 'cambodian':

                    return LIST_STYLE_TYPE.CAMBODIAN;

                case 'cjk-earthly-branch':

                    return LIST_STYLE_TYPE.CJK_EARTHLY_BRANCH;

                case 'cjk-heavenly-stem':

                    return LIST_STYLE_TYPE.CJK_HEAVENLY_STEM;

                case 'cjk-ideographic':

                    return LIST_STYLE_TYPE.CJK_IDEOGRAPHIC;

                case 'devanagari':

                    return LIST_STYLE_TYPE.DEVANAGARI;

                case 'ethiopic-numeric':

                    return LIST_STYLE_TYPE.ETHIOPIC_NUMERIC;

                case 'georgian':

                    return LIST_STYLE_TYPE.GEORGIAN;

                case 'gujarati':

                    return LIST_STYLE_TYPE.GUJARATI;

                case 'gurmukhi':

                    return LIST_STYLE_TYPE.GURMUKHI;

                case 'hebrew':

                    return LIST_STYLE_TYPE.HEBREW;

                case 'hiragana':

                    return LIST_STYLE_TYPE.HIRAGANA;

                case 'hiragana-iroha':

                    return LIST_STYLE_TYPE.HIRAGANA_IROHA;

                case 'japanese-formal':

                    return LIST_STYLE_TYPE.JAPANESE_FORMAL;

                case 'japanese-informal':

                    return LIST_STYLE_TYPE.JAPANESE_INFORMAL;

                case 'kannada':

                    return LIST_STYLE_TYPE.KANNADA;

                case 'katakana':

                    return LIST_STYLE_TYPE.KATAKANA;

                case 'katakana-iroha':

                    return LIST_STYLE_TYPE.KATAKANA_IROHA;

                case 'khmer':

                    return LIST_STYLE_TYPE.KHMER;

                case 'korean-hangul-formal':

                    return LIST_STYLE_TYPE.KOREAN_HANGUL_FORMAL;

                case 'korean-hanja-formal':

                    return LIST_STYLE_TYPE.KOREAN_HANJA_FORMAL;

                case 'korean-hanja-informal':

                    return LIST_STYLE_TYPE.KOREAN_HANJA_INFORMAL;

                case 'lao':

                    return LIST_STYLE_TYPE.LAO;

                case 'lower-armenian':

                    return LIST_STYLE_TYPE.LOWER_ARMENIAN;

                case 'malayalam':

                    return LIST_STYLE_TYPE.MALAYALAM;

                case 'mongolian':

                    return LIST_STYLE_TYPE.MONGOLIAN;

                case 'myanmar':

                    return LIST_STYLE_TYPE.MYANMAR;

                case 'oriya':

                    return LIST_STYLE_TYPE.ORIYA;

                case 'persian':

                    return LIST_STYLE_TYPE.PERSIAN;

                case 'simp-chinese-formal':

                    return LIST_STYLE_TYPE.SIMP_CHINESE_FORMAL;

                case 'simp-chinese-informal':

                    return LIST_STYLE_TYPE.SIMP_CHINESE_INFORMAL;

                case 'tamil':

                    return LIST_STYLE_TYPE.TAMIL;

                case 'telugu':

                    return LIST_STYLE_TYPE.TELUGU;

                case 'thai':

                    return LIST_STYLE_TYPE.THAI;

                case 'tibetan':

                    return LIST_STYLE_TYPE.TIBETAN;

                case 'trad-chinese-formal':

                    return LIST_STYLE_TYPE.TRAD_CHINESE_FORMAL;

                case 'trad-chinese-informal':

                    return LIST_STYLE_TYPE.TRAD_CHINESE_INFORMAL;

                case 'upper-armenian':

                    return LIST_STYLE_TYPE.UPPER_ARMENIAN;

                case 'disclosure-open':

                    return LIST_STYLE_TYPE.DISCLOSURE_OPEN;

                case 'disclosure-closed':

                    return LIST_STYLE_TYPE.DISCLOSURE_CLOSED;

                case 'none':

                default:

                    return LIST_STYLE_TYPE.NONE;

            }

        }

    };



    var marginForSide = function (side) { return ({

        name: "margin-" + side,

        initialValue: '0',

        prefix: false,

        type: PropertyDescriptorParsingType.TOKEN_VALUE

    }); };

    var marginTop = marginForSide('top');

    var marginRight = marginForSide('right');

    var marginBottom = marginForSide('bottom');

    var marginLeft = marginForSide('left');



    var OVERFLOW;

    (function (OVERFLOW) {

        OVERFLOW[OVERFLOW["VISIBLE"] = 0] = "VISIBLE";

        OVERFLOW[OVERFLOW["HIDDEN"] = 1] = "HIDDEN";

        OVERFLOW[OVERFLOW["SCROLL"] = 2] = "SCROLL";

        OVERFLOW[OVERFLOW["AUTO"] = 3] = "AUTO";

    })(OVERFLOW || (OVERFLOW = {}));

    var overflow = {

        name: 'overflow',

        initialValue: 'visible',

        prefix: false,

        type: PropertyDescriptorParsingType.LIST,

        parse: function (tokens) {

            return tokens.filter(isIdentToken).map(function (overflow) {

                switch (overflow.value) {

                    case 'hidden':

                        return OVERFLOW.HIDDEN;

                    case 'scroll':

                        return OVERFLOW.SCROLL;

                    case 'auto':

                        return OVERFLOW.AUTO;

                    case 'visible':

                    default:

                        return OVERFLOW.VISIBLE;

                }

            });

        }

    };



    var OVERFLOW_WRAP;

    (function (OVERFLOW_WRAP) {

        OVERFLOW_WRAP["NORMAL"] = "normal";

        OVERFLOW_WRAP["BREAK_WORD"] = "break-word";

    })(OVERFLOW_WRAP || (OVERFLOW_WRAP = {}));

    var overflowWrap = {

        name: 'overflow-wrap',

        initialValue: 'normal',

        prefix: false,

        type: PropertyDescriptorParsingType.IDENT_VALUE,

        parse: function (overflow) {

            switch (overflow) {

                case 'break-word':

                    return OVERFLOW_WRAP.BREAK_WORD;

                case 'normal':

                default:

                    return OVERFLOW_WRAP.NORMAL;

            }

        }

    };



    var paddingForSide = function (side) { return ({

        name: "padding-" + side,

        initialValue: '0',

        prefix: false,

        type: PropertyDescriptorParsingType.TYPE_VALUE,

        format: 'length-percentage'

    }); };

    var paddingTop = paddingForSide('top');

    var paddingRight = paddingForSide('right');

    var paddingBottom = paddingForSide('bottom');

    var paddingLeft = paddingForSide('left');



    var TEXT_ALIGN;

    (function (TEXT_ALIGN) {

        TEXT_ALIGN[TEXT_ALIGN["LEFT"] = 0] = "LEFT";

        TEXT_ALIGN[TEXT_ALIGN["CENTER"] = 1] = "CENTER";

        TEXT_ALIGN[TEXT_ALIGN["RIGHT"] = 2] = "RIGHT";

    })(TEXT_ALIGN || (TEXT_ALIGN = {}));

    var textAlign = {

        name: 'text-align',

        initialValue: 'left',

        prefix: false,

        type: PropertyDescriptorParsingType.IDENT_VALUE,

        parse: function (textAlign) {

            switch (textAlign) {

                case 'right':

                    return TEXT_ALIGN.RIGHT;

                case 'center':

                case 'justify':

                    return TEXT_ALIGN.CENTER;

                case 'left':

                default:

                    return TEXT_ALIGN.LEFT;

            }

        }

    };



    var POSITION;

    (function (POSITION) {

        POSITION[POSITION["STATIC"] = 0] = "STATIC";

        POSITION[POSITION["RELATIVE"] = 1] = "RELATIVE";

        POSITION[POSITION["ABSOLUTE"] = 2] = "ABSOLUTE";

        POSITION[POSITION["FIXED"] = 3] = "FIXED";

        POSITION[POSITION["STICKY"] = 4] = "STICKY";

    })(POSITION || (POSITION = {}));

    var position = {

        name: 'position',

        initialValue: 'static',

        prefix: false,

        type: PropertyDescriptorParsingType.IDENT_VALUE,

        parse: function (position) {

            switch (position) {

                case 'relative':

                    return POSITION.RELATIVE;

                case 'absolute':

                    return POSITION.ABSOLUTE;

                case 'fixed':

                    return POSITION.FIXED;

                case 'sticky':

                    return POSITION.STICKY;

            }

            return POSITION.STATIC;

        }

    };



    var textShadow = {

        name: 'text-shadow',

        initialValue: 'none',

        type: PropertyDescriptorParsingType.LIST,

        prefix: false,

        parse: function (tokens) {

            if (tokens.length === 1 && isIdentWithValue(tokens[0], 'none')) {

                return [];

            }

            return parseFunctionArgs(tokens).map(function (values) {

                var shadow = {

                    color: COLORS.TRANSPARENT,

                    offsetX: ZERO_LENGTH,

                    offsetY: ZERO_LENGTH,

                    blur: ZERO_LENGTH

                };

                var c = 0;

                for (var i = 0; i < values.length; i++) {

                    var token = values[i];

                    if (isLength(token)) {

                        if (c === 0) {

                            shadow.offsetX = token;

                        }

                        else if (c === 1) {

                            shadow.offsetY = token;

                        }

                        else {

                            shadow.blur = token;

                        }

                        c++;

                    }

                    else {

                        shadow.color = color.parse(token);

                    }

                }

                return shadow;

            });

        }

    };



    var TEXT_TRANSFORM;

    (function (TEXT_TRANSFORM) {

        TEXT_TRANSFORM[TEXT_TRANSFORM["NONE"] = 0] = "NONE";

        TEXT_TRANSFORM[TEXT_TRANSFORM["LOWERCASE"] = 1] = "LOWERCASE";

        TEXT_TRANSFORM[TEXT_TRANSFORM["UPPERCASE"] = 2] = "UPPERCASE";

        TEXT_TRANSFORM[TEXT_TRANSFORM["CAPITALIZE"] = 3] = "CAPITALIZE";

    })(TEXT_TRANSFORM || (TEXT_TRANSFORM = {}));

    var textTransform = {

        name: 'text-transform',

        initialValue: 'none',

        prefix: false,

        type: PropertyDescriptorParsingType.IDENT_VALUE,

        parse: function (textTransform) {

            switch (textTransform) {

                case 'uppercase':

                    return TEXT_TRANSFORM.UPPERCASE;

                case 'lowercase':

                    return TEXT_TRANSFORM.LOWERCASE;

                case 'capitalize':

                    return TEXT_TRANSFORM.CAPITALIZE;

            }

            return TEXT_TRANSFORM.NONE;

        }

    };



    var transform = {

        name: 'transform',

        initialValue: 'none',

        prefix: true,

        type: PropertyDescriptorParsingType.VALUE,

        parse: function (token) {

            if (token.type === TokenType.IDENT_TOKEN && token.value === 'none') {

                return null;

            }

            if (token.type === TokenType.FUNCTION) {

                var transformFunction = SUPPORTED_TRANSFORM_FUNCTIONS[token.name];

                if (typeof transformFunction === 'undefined') {

                    throw new Error("Attempting to parse an unsupported transform function \"" + token.name + "\"");

                }

                return transformFunction(token.values);

            }

            return null;

        }

    };

    var matrix = function (args) {

        var values = args.filter(function (arg) { return arg.type === TokenType.NUMBER_TOKEN; }).map(function (arg) { return arg.number; });

        return values.length === 6 ? values : null;

    };

    // doesn't support 3D transforms at the moment

    var matrix3d = function (args) {

        var values = args.filter(function (arg) { return arg.type === TokenType.NUMBER_TOKEN; }).map(function (arg) { return arg.number; });

        var a1 = values[0], b1 = values[1], _a = values[2], _b = values[3], a2 = values[4], b2 = values[5], _c = values[6], _d = values[7], _e = values[8], _f = values[9], _g = values[10], _h = values[11], a4 = values[12], b4 = values[13], _j = values[14], _k = values[15];

        return values.length === 16 ? [a1, b1, a2, b2, a4, b4] : null;

    };

    var SUPPORTED_TRANSFORM_FUNCTIONS = {

        matrix: matrix,

        matrix3d: matrix3d

    };



    var DEFAULT_VALUE = {

        type: TokenType.PERCENTAGE_TOKEN,

        number: 50,

        flags: FLAG_INTEGER

    };

    var DEFAULT = [DEFAULT_VALUE, DEFAULT_VALUE];

    var transformOrigin = {

        name: 'transform-origin',

        initialValue: '50% 50%',

        prefix: true,

        type: PropertyDescriptorParsingType.LIST,

        parse: function (tokens) {

            var origins = tokens.filter(isLengthPercentage);

            if (origins.length !== 2) {

                return DEFAULT;

            }

            return [origins[0], origins[1]];

        }

    };



    var VISIBILITY;

    (function (VISIBILITY) {

        VISIBILITY[VISIBILITY["VISIBLE"] = 0] = "VISIBLE";

        VISIBILITY[VISIBILITY["HIDDEN"] = 1] = "HIDDEN";

        VISIBILITY[VISIBILITY["COLLAPSE"] = 2] = "COLLAPSE";

    })(VISIBILITY || (VISIBILITY = {}));

    var visibility = {

        name: 'visible',

        initialValue: 'none',

        prefix: false,

        type: PropertyDescriptorParsingType.IDENT_VALUE,

        parse: function (visibility) {

            switch (visibility) {

                case 'hidden':

                    return VISIBILITY.HIDDEN;

                case 'collapse':

                    return VISIBILITY.COLLAPSE;

                case 'visible':

                default:

                    return VISIBILITY.VISIBLE;

            }

        }

    };



    var WORD_BREAK;

    (function (WORD_BREAK) {

        WORD_BREAK["NORMAL"] = "normal";

        WORD_BREAK["BREAK_ALL"] = "break-all";

        WORD_BREAK["KEEP_ALL"] = "keep-all";

    })(WORD_BREAK || (WORD_BREAK = {}));

    var wordBreak = {

        name: 'word-break',

        initialValue: 'normal',

        prefix: false,

        type: PropertyDescriptorParsingType.IDENT_VALUE,

        parse: function (wordBreak) {

            switch (wordBreak) {

                case 'break-all':

                    return WORD_BREAK.BREAK_ALL;

                case 'keep-all':

                    return WORD_BREAK.KEEP_ALL;

                case 'normal':

                default:

                    return WORD_BREAK.NORMAL;

            }

        }

    };



    var zIndex = {

        name: 'z-index',

        initialValue: 'auto',

        prefix: false,

        type: PropertyDescriptorParsingType.VALUE,

        parse: function (token) {

            if (token.type === TokenType.IDENT_TOKEN) {

                return { auto: true, order: 0 };

            }

            if (isNumberToken(token)) {

                return { auto: false, order: token.number };

            }

            throw new Error("Invalid z-index number parsed");

        }

    };



    var opacity = {

        name: 'opacity',

        initialValue: '1',

        type: PropertyDescriptorParsingType.VALUE,

        prefix: false,

        parse: function (token) {

            if (isNumberToken(token)) {

                return token.number;

            }

            return 1;

        }

    };



    var textDecorationColor = {

        name: "text-decoration-color",

        initialValue: 'transparent',

        prefix: false,

        type: PropertyDescriptorParsingType.TYPE_VALUE,

        format: 'color'

    };



    var textDecorationLine = {

        name: 'text-decoration-line',

        initialValue: 'none',

        prefix: false,

        type: PropertyDescriptorParsingType.LIST,

        parse: function (tokens) {

            return tokens

                .filter(isIdentToken)

                .map(function (token) {

                    switch (token.value) {

                        case 'underline':

                            return 1 /* UNDERLINE */;

                        case 'overline':

                            return 2 /* OVERLINE */;

                        case 'line-through':

                            return 3 /* LINE_THROUGH */;

                        case 'none':

                            return 4 /* BLINK */;

                    }

                    return 0 /* NONE */;

                })

                .filter(function (line) { return line !== 0 /* NONE */; });

        }

    };



    var fontFamily = {

        name: "font-family",

        initialValue: '',

        prefix: false,

        type: PropertyDescriptorParsingType.LIST,

        parse: function (tokens) {

            return tokens.filter(isStringToken$1).map(function (token) { return token.value; });

        }

    };

    var isStringToken$1 = function (token) {

        return token.type === TokenType.STRING_TOKEN || token.type === TokenType.IDENT_TOKEN;

    };



    var fontSize = {

        name: "font-size",

        initialValue: '0',

        prefix: false,

        type: PropertyDescriptorParsingType.TYPE_VALUE,

        format: 'length'

    };



    var fontWeight = {

        name: 'font-weight',

        initialValue: 'normal',

        type: PropertyDescriptorParsingType.VALUE,

        prefix: false,

        parse: function (token) {

            if (isNumberToken(token)) {

                return token.number;

            }

            if (isIdentToken(token)) {

                switch (token.value) {

                    case 'bold':

                        return 700;

                    case 'normal':

                    default:

                        return 400;

                }

            }

            return 400;

        }

    };



    var fontVariant = {

        name: 'font-variant',

        initialValue: 'none',

        type: PropertyDescriptorParsingType.LIST,

        prefix: false,

        parse: function (tokens) {

            return tokens.filter(isIdentToken).map(function (token) { return token.value; });

        }

    };



    var FONT_STYLE;

    (function (FONT_STYLE) {

        FONT_STYLE["NORMAL"] = "normal";

        FONT_STYLE["ITALIC"] = "italic";

        FONT_STYLE["OBLIQUE"] = "oblique";

    })(FONT_STYLE || (FONT_STYLE = {}));

    var fontStyle = {

        name: 'font-style',

        initialValue: 'normal',

        prefix: false,

        type: PropertyDescriptorParsingType.IDENT_VALUE,

        parse: function (overflow) {

            switch (overflow) {

                case 'oblique':

                    return FONT_STYLE.OBLIQUE;

                case 'italic':

                    return FONT_STYLE.ITALIC;

                case 'normal':

                default:

                    return FONT_STYLE.NORMAL;

            }

        }

    };



    var contains = function (bit, value) { return (bit & value) !== 0; };



    var content = {

        name: 'content',

        initialValue: 'none',

        type: PropertyDescriptorParsingType.LIST,

        prefix: false,

        parse: function (tokens) {

            if (tokens.length === 0) {

                return [];

            }

            var first = tokens[0];

            if (first.type === TokenType.IDENT_TOKEN && first.value === 'none') {

                return [];

            }

            return tokens;

        }

    };



    var counterIncrement = {

        name: 'counter-increment',

        initialValue: 'none',

        prefix: true,

        type: PropertyDescriptorParsingType.LIST,

        parse: function (tokens) {

            if (tokens.length === 0) {

                return null;

            }

            var first = tokens[0];

            if (first.type === TokenType.IDENT_TOKEN && first.value === 'none') {

                return null;

            }

            var increments = [];

            var filtered = tokens.filter(nonWhiteSpace);

            for (var i = 0; i < filtered.length; i++) {

                var counter = filtered[i];

                var next = filtered[i + 1];

                if (counter.type === TokenType.IDENT_TOKEN) {

                    var increment = next && isNumberToken(next) ? next.number : 1;

                    increments.push({ counter: counter.value, increment: increment });

                }

            }

            return increments;

        }

    };



    var counterReset = {

        name: 'counter-reset',

        initialValue: 'none',

        prefix: true,

        type: PropertyDescriptorParsingType.LIST,

        parse: function (tokens) {

            if (tokens.length === 0) {

                return [];

            }

            var resets = [];

            var filtered = tokens.filter(nonWhiteSpace);

            for (var i = 0; i < filtered.length; i++) {

                var counter = filtered[i];

                var next = filtered[i + 1];

                if (isIdentToken(counter) && counter.value !== 'none') {

                    var reset = next && isNumberToken(next) ? next.number : 0;

                    resets.push({ counter: counter.value, reset: reset });

                }

            }

            return resets;

        }

    };



    var quotes = {

        name: 'quotes',

        initialValue: 'none',

        prefix: true,

        type: PropertyDescriptorParsingType.LIST,

        parse: function (tokens) {

            if (tokens.length === 0) {

                return null;

            }

            var first = tokens[0];

            if (first.type === TokenType.IDENT_TOKEN && first.value === 'none') {

                return null;

            }

            var quotes = [];

            var filtered = tokens.filter(isStringToken);

            if (filtered.length % 2 !== 0) {

                return null;

            }

            for (var i = 0; i < filtered.length; i += 2) {

                var open_1 = filtered[i].value;

                var close_1 = filtered[i + 1].value;

                quotes.push({ open: open_1, close: close_1 });

            }

            return quotes;

        }

    };

    var getQuote = function (quotes, depth, open) {

        if (!quotes) {

            return '';

        }

        var quote = quotes[Math.min(depth, quotes.length - 1)];

        if (!quote) {

            return '';

        }

        return open ? quote.open : quote.close;

    };



    var boxShadow = {

        name: 'box-shadow',

        initialValue: 'none',

        type: PropertyDescriptorParsingType.LIST,

        prefix: false,

        parse: function (tokens) {

            if (tokens.length === 1 && isIdentWithValue(tokens[0], 'none')) {

                return [];

            }

            return parseFunctionArgs(tokens).map(function (values) {

                var shadow = {

                    color: 0x000000ff,

                    offsetX: ZERO_LENGTH,

                    offsetY: ZERO_LENGTH,

                    blur: ZERO_LENGTH,

                    spread: ZERO_LENGTH,

                    inset: false

                };

                var c = 0;

                for (var i = 0; i < values.length; i++) {

                    var token = values[i];

                    if (isIdentWithValue(token, 'inset')) {

                        shadow.inset = true;

                    }

                    else if (isLength(token)) {

                        if (c === 0) {

                            shadow.offsetX = token;

                        }

                        else if (c === 1) {

                            shadow.offsetY = token;

                        }

                        else if (c === 2) {

                            shadow.blur = token;

                        }

                        else {

                            shadow.spread = token;

                        }

                        c++;

                    }

                    else {

                        shadow.color = color.parse(token);

                    }

                }

                return shadow;

            });

        }

    };



    var CSSParsedDeclaration = /** @class */ (function () {

        function CSSParsedDeclaration(declaration) {

            this.backgroundClip = parse(backgroundClip, declaration.backgroundClip);

            this.backgroundColor = parse(backgroundColor, declaration.backgroundColor);

            this.backgroundImage = parse(backgroundImage, declaration.backgroundImage);

            this.backgroundOrigin = parse(backgroundOrigin, declaration.backgroundOrigin);

            this.backgroundPosition = parse(backgroundPosition, declaration.backgroundPosition);

            this.backgroundRepeat = parse(backgroundRepeat, declaration.backgroundRepeat);

            this.backgroundSize = parse(backgroundSize, declaration.backgroundSize);

            this.borderTopColor = parse(borderTopColor, declaration.borderTopColor);

            this.borderRightColor = parse(borderRightColor, declaration.borderRightColor);

            this.borderBottomColor = parse(borderBottomColor, declaration.borderBottomColor);

            this.borderLeftColor = parse(borderLeftColor, declaration.borderLeftColor);

            this.borderTopLeftRadius = parse(borderTopLeftRadius, declaration.borderTopLeftRadius);

            this.borderTopRightRadius = parse(borderTopRightRadius, declaration.borderTopRightRadius);

            this.borderBottomRightRadius = parse(borderBottomRightRadius, declaration.borderBottomRightRadius);

            this.borderBottomLeftRadius = parse(borderBottomLeftRadius, declaration.borderBottomLeftRadius);

            this.borderTopStyle = parse(borderTopStyle, declaration.borderTopStyle);

            this.borderRightStyle = parse(borderRightStyle, declaration.borderRightStyle);

            this.borderBottomStyle = parse(borderBottomStyle, declaration.borderBottomStyle);

            this.borderLeftStyle = parse(borderLeftStyle, declaration.borderLeftStyle);

            this.borderTopWidth = parse(borderTopWidth, declaration.borderTopWidth);

            this.borderRightWidth = parse(borderRightWidth, declaration.borderRightWidth);

            this.borderBottomWidth = parse(borderBottomWidth, declaration.borderBottomWidth);

            this.borderLeftWidth = parse(borderLeftWidth, declaration.borderLeftWidth);

            this.boxShadow = parse(boxShadow, declaration.boxShadow);

            this.color = parse(color$1, declaration.color);

            this.display = parse(display, declaration.display);

            this.float = parse(float, declaration.cssFloat);

            this.fontFamily = parse(fontFamily, declaration.fontFamily);

            this.fontSize = parse(fontSize, declaration.fontSize);

            this.fontStyle = parse(fontStyle, declaration.fontStyle);

            this.fontVariant = parse(fontVariant, declaration.fontVariant);

            this.fontWeight = parse(fontWeight, declaration.fontWeight);

            this.letterSpacing = parse(letterSpacing, declaration.letterSpacing);

            this.lineBreak = parse(lineBreak, declaration.lineBreak);

            this.lineHeight = parse(lineHeight, declaration.lineHeight);

            this.listStyleImage = parse(listStyleImage, declaration.listStyleImage);

            this.listStylePosition = parse(listStylePosition, declaration.listStylePosition);

            this.listStyleType = parse(listStyleType, declaration.listStyleType);

            this.marginTop = parse(marginTop, declaration.marginTop);

            this.marginRight = parse(marginRight, declaration.marginRight);

            this.marginBottom = parse(marginBottom, declaration.marginBottom);

            this.marginLeft = parse(marginLeft, declaration.marginLeft);

            this.opacity = parse(opacity, declaration.opacity);

            var overflowTuple = parse(overflow, declaration.overflow);

            this.overflowX = overflowTuple[0];

            this.overflowY = overflowTuple[overflowTuple.length > 1 ? 1 : 0];

            this.overflowWrap = parse(overflowWrap, declaration.overflowWrap);

            this.paddingTop = parse(paddingTop, declaration.paddingTop);

            this.paddingRight = parse(paddingRight, declaration.paddingRight);

            this.paddingBottom = parse(paddingBottom, declaration.paddingBottom);

            this.paddingLeft = parse(paddingLeft, declaration.paddingLeft);

            this.position = parse(position, declaration.position);

            this.textAlign = parse(textAlign, declaration.textAlign);

            this.textDecorationColor = parse(textDecorationColor, declaration.textDecorationColor || declaration.color);

            this.textDecorationLine = parse(textDecorationLine, declaration.textDecorationLine);

            this.textShadow = parse(textShadow, declaration.textShadow);

            this.textTransform = parse(textTransform, declaration.textTransform);

            this.transform = parse(transform, declaration.transform);

            this.transformOrigin = parse(transformOrigin, declaration.transformOrigin);

            this.visibility = parse(visibility, declaration.visibility);

            this.wordBreak = parse(wordBreak, declaration.wordBreak);

            this.zIndex = parse(zIndex, declaration.zIndex);

        }

        CSSParsedDeclaration.prototype.isVisible = function () {

            return this.display > 0 && this.opacity > 0 && this.visibility === VISIBILITY.VISIBLE;

        };

        CSSParsedDeclaration.prototype.isTransparent = function () {

            return isTransparent(this.backgroundColor);

        };

        CSSParsedDeclaration.prototype.isTransformed = function () {

            return this.transform !== null;

        };

        CSSParsedDeclaration.prototype.isPositioned = function () {

            return this.position !== POSITION.STATIC;

        };

        CSSParsedDeclaration.prototype.isPositionedWithZIndex = function () {

            return this.isPositioned() && !this.zIndex.auto;

        };

        CSSParsedDeclaration.prototype.isFloating = function () {

            return this.float !== FLOAT.NONE;

        };

        CSSParsedDeclaration.prototype.isInlineLevel = function () {

            return (contains(this.display, 4 /* INLINE */) ||

                contains(this.display, 33554432 /* INLINE_BLOCK */) ||

                contains(this.display, 268435456 /* INLINE_FLEX */) ||

                contains(this.display, 536870912 /* INLINE_GRID */) ||

                contains(this.display, 67108864 /* INLINE_LIST_ITEM */) ||

                contains(this.display, 134217728 /* INLINE_TABLE */));

        };

        return CSSParsedDeclaration;

    }());

    var CSSParsedPseudoDeclaration = /** @class */ (function () {

        function CSSParsedPseudoDeclaration(declaration) {

            this.content = parse(content, declaration.content);

            this.quotes = parse(quotes, declaration.quotes);

        }

        return CSSParsedPseudoDeclaration;

    }());

    var CSSParsedCounterDeclaration = /** @class */ (function () {

        function CSSParsedCounterDeclaration(declaration) {

            this.counterIncrement = parse(counterIncrement, declaration.counterIncrement);

            this.counterReset = parse(counterReset, declaration.counterReset);

        }

        return CSSParsedCounterDeclaration;

    }());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    var parse = function (descriptor, style) {

        var tokenizer = new Tokenizer();

        var value = style !== null && typeof style !== 'undefined' ? style.toString() : descriptor.initialValue;

        tokenizer.write(value);

        var parser = new Parser(tokenizer.read());

        switch (descriptor.type) {

            case PropertyDescriptorParsingType.IDENT_VALUE:

                var token = parser.parseComponentValue();

                return descriptor.parse(isIdentToken(token) ? token.value : descriptor.initialValue);

            case PropertyDescriptorParsingType.VALUE:

                return descriptor.parse(parser.parseComponentValue());

            case PropertyDescriptorParsingType.LIST:

                return descriptor.parse(parser.parseComponentValues());

            case PropertyDescriptorParsingType.TOKEN_VALUE:

                return parser.parseComponentValue();

            case PropertyDescriptorParsingType.TYPE_VALUE:

                switch (descriptor.format) {

                    case 'angle':

                        return angle.parse(parser.parseComponentValue());

                    case 'color':

                        return color.parse(parser.parseComponentValue());

                    case 'image':

                        return image.parse(parser.parseComponentValue());

                    case 'length':

                        var length_1 = parser.parseComponentValue();

                        return isLength(length_1) ? length_1 : ZERO_LENGTH;

                    case 'length-percentage':

                        var value_1 = parser.parseComponentValue();

                        return isLengthPercentage(value_1) ? value_1 : ZERO_LENGTH;

                }

        }

        throw new Error("Attempting to parse unsupported css format type " + descriptor.format);

    };



    var ElementContainer = /** @class */ (function () {

        function ElementContainer(element) {

            this.styles = new CSSParsedDeclaration(window.getComputedStyle(element, null));

            this.textNodes = [];

            this.elements = [];

            if (this.styles.transform !== null && isHTMLElementNode(element)) {

                // getBoundingClientRect takes transforms into account

                element.style.transform = 'none';

            }

            this.bounds = parseBounds(element);

            this.flags = 0;

        }

        return ElementContainer;

    }());



    var TextBounds = /** @class */ (function () {

        function TextBounds(text, bounds) {

            this.text = text;

            this.bounds = bounds;

        }

        return TextBounds;

    }());

    var parseTextBounds = function (value, styles, node) {

        var textList = breakText(value, styles);

        var textBounds = [];

        var offset = 0;

        textList.forEach(function (text) {

            if (styles.textDecorationLine.length || text.trim().length > 0) {

                if (FEATURES.SUPPORT_RANGE_BOUNDS) {

                    textBounds.push(new TextBounds(text, getRangeBounds(node, offset, text.length)));

                }

                else {

                    var replacementNode = node.splitText(text.length);

                    textBounds.push(new TextBounds(text, getWrapperBounds(node)));

                    node = replacementNode;

                }

            }

            else if (!FEATURES.SUPPORT_RANGE_BOUNDS) {

                node = node.splitText(text.length);

            }

            offset += text.length;

        });

        return textBounds;

    };

    var getWrapperBounds = function (node) {

        var ownerDocument = node.ownerDocument;

        if (ownerDocument) {

            var wrapper = ownerDocument.createElement('html2canvaswrapper');

            wrapper.appendChild(node.cloneNode(true));

            var parentNode = node.parentNode;

            if (parentNode) {

                parentNode.replaceChild(wrapper, node);

                var bounds = parseBounds(wrapper);

                if (wrapper.firstChild) {

                    parentNode.replaceChild(wrapper.firstChild, wrapper);

                }

                return bounds;

            }

        }

        return new Bounds(0, 0, 0, 0);

    };

    var getRangeBounds = function (node, offset, length) {

        var ownerDocument = node.ownerDocument;

        if (!ownerDocument) {

            throw new Error('Node has no owner document');

        }

        var range = ownerDocument.createRange();

        range.setStart(node, offset);

        range.setEnd(node, offset + length);

        return Bounds.fromClientRect(range.getBoundingClientRect());

    };

    var breakText = function (value, styles) {

        return styles.letterSpacing !== 0 ? toCodePoints(value).map(function (i) { return fromCodePoint(i); }) : breakWords(value, styles);

    };

    var breakWords = function (str, styles) {

        var breaker = LineBreaker(str, {

            lineBreak: styles.lineBreak,

            wordBreak: styles.overflowWrap === OVERFLOW_WRAP.BREAK_WORD ? 'break-word' : styles.wordBreak

        });

        var words = [];

        var bk;

        while (!(bk = breaker.next()).done) {

            if (bk.value) {

                words.push(bk.value.slice());

            }

        }

        return words;

    };



    var TextContainer = /** @class */ (function () {

        function TextContainer(node, styles) {

            this.text = transform$1(node.data, styles.textTransform);

            this.textBounds = parseTextBounds(this.text, styles, node);

        }

        return TextContainer;

    }());

    var transform$1 = function (text, transform) {

        switch (transform) {

            case TEXT_TRANSFORM.LOWERCASE:

                return text.toLowerCase();

            case TEXT_TRANSFORM.CAPITALIZE:

                return text.replace(CAPITALIZE, capitalize);

            case TEXT_TRANSFORM.UPPERCASE:

                return text.toUpperCase();

            default:

                return text;

        }

    };

    var CAPITALIZE = /(^|\s|:|-|\(|\))([a-z])/g;

    var capitalize = function (m, p1, p2) {

        if (m.length > 0) {

            return p1 + p2.toUpperCase();

        }

        return m;

    };



    var ImageElementContainer = /** @class */ (function (_super) {

        __extends(ImageElementContainer, _super);

        function ImageElementContainer(img) {

            var _this = _super.call(this, img) || this;

            _this.src = img.currentSrc || img.src;

            _this.intrinsicWidth = img.naturalWidth;

            _this.intrinsicHeight = img.naturalHeight;

            CacheStorage.getInstance().addImage(_this.src);

            return _this;

        }

        return ImageElementContainer;

    }(ElementContainer));



    var CanvasElementContainer = /** @class */ (function (_super) {

        __extends(CanvasElementContainer, _super);

        function CanvasElementContainer(canvas) {

            var _this = _super.call(this, canvas) || this;

            _this.canvas = canvas;

            _this.intrinsicWidth = canvas.width;

            _this.intrinsicHeight = canvas.height;

            return _this;

        }

        return CanvasElementContainer;

    }(ElementContainer));



    var SVGElementContainer = /** @class */ (function (_super) {

        __extends(SVGElementContainer, _super);

        function SVGElementContainer(img) {

            var _this = _super.call(this, img) || this;

            var s = new XMLSerializer();

            _this.svg = "data:image/svg+xml," + encodeURIComponent(s.serializeToString(img));

            _this.intrinsicWidth = img.width.baseVal.value;

            _this.intrinsicHeight = img.height.baseVal.value;

            CacheStorage.getInstance().addImage(_this.svg);

            return _this;

        }

        return SVGElementContainer;

    }(ElementContainer));



    var LIElementContainer = /** @class */ (function (_super) {

        __extends(LIElementContainer, _super);

        function LIElementContainer(element) {

            var _this = _super.call(this, element) || this;

            _this.value = element.value;

            return _this;

        }

        return LIElementContainer;

    }(ElementContainer));



    var OLElementContainer = /** @class */ (function (_super) {

        __extends(OLElementContainer, _super);

        function OLElementContainer(element) {

            var _this = _super.call(this, element) || this;

            _this.start = element.start;

            _this.reversed = typeof element.reversed === 'boolean' && element.reversed === true;

            return _this;

        }

        return OLElementContainer;

    }(ElementContainer));



    var CHECKBOX_BORDER_RADIUS = [

        {

            type: TokenType.DIMENSION_TOKEN,

            flags: 0,

            unit: 'px',

            number: 3

        }

    ];

    var RADIO_BORDER_RADIUS = [

        {

            type: TokenType.PERCENTAGE_TOKEN,

            flags: 0,

            number: 50

        }

    ];

    var reformatInputBounds = function (bounds) {

        if (bounds.width > bounds.height) {

            return new Bounds(bounds.left + (bounds.width - bounds.height) / 2, bounds.top, bounds.height, bounds.height);

        }

        else if (bounds.width < bounds.height) {

            return new Bounds(bounds.left, bounds.top + (bounds.height - bounds.width) / 2, bounds.width, bounds.width);

        }

        return bounds;

    };

    var getInputValue = function (node) {

        var value = node.type === PASSWORD ? new Array(node.value.length + 1).join('\u2022') : node.value;

        return value.length === 0 ? node.placeholder || '' : value;

    };

    var CHECKBOX = 'checkbox';

    var RADIO = 'radio';

    var PASSWORD = 'password';

    var INPUT_COLOR = 0x2a2a2aff;

    var InputElementContainer = /** @class */ (function (_super) {

        __extends(InputElementContainer, _super);

        function InputElementContainer(input) {

            var _this = _super.call(this, input) || this;

            _this.type = input.type.toLowerCase();

            _this.checked = input.checked;

            _this.value = getInputValue(input);

            if (_this.type === CHECKBOX || _this.type === RADIO) {

                _this.styles.backgroundColor = 0xdededeff;

                _this.styles.borderTopColor = _this.styles.borderRightColor = _this.styles.borderBottomColor = _this.styles.borderLeftColor = 0xa5a5a5ff;

                _this.styles.borderTopWidth = _this.styles.borderRightWidth = _this.styles.borderBottomWidth = _this.styles.borderLeftWidth = 1;

                _this.styles.borderTopStyle = _this.styles.borderRightStyle = _this.styles.borderBottomStyle = _this.styles.borderLeftStyle =

                    BORDER_STYLE.SOLID;

                _this.styles.backgroundClip = [BACKGROUND_CLIP.BORDER_BOX];

                _this.styles.backgroundOrigin = [0 /* BORDER_BOX */];

                _this.bounds = reformatInputBounds(_this.bounds);

            }

            switch (_this.type) {

                case CHECKBOX:

                    _this.styles.borderTopRightRadius = _this.styles.borderTopLeftRadius = _this.styles.borderBottomRightRadius = _this.styles.borderBottomLeftRadius = CHECKBOX_BORDER_RADIUS;

                    break;

                case RADIO:

                    _this.styles.borderTopRightRadius = _this.styles.borderTopLeftRadius = _this.styles.borderBottomRightRadius = _this.styles.borderBottomLeftRadius = RADIO_BORDER_RADIUS;

                    break;

            }

            return _this;

        }

        return InputElementContainer;

    }(ElementContainer));



    var SelectElementContainer = /** @class */ (function (_super) {

        __extends(SelectElementContainer, _super);

        function SelectElementContainer(element) {

            var _this = _super.call(this, element) || this;

            var option = element.options[element.selectedIndex || 0];

            _this.value = option ? option.text || '' : '';

            return _this;

        }

        return SelectElementContainer;

    }(ElementContainer));



    var TextareaElementContainer = /** @class */ (function (_super) {

        __extends(TextareaElementContainer, _super);

        function TextareaElementContainer(element) {

            var _this = _super.call(this, element) || this;

            _this.value = element.value;

            return _this;

        }

        return TextareaElementContainer;

    }(ElementContainer));



    var parseColor = function (value) { return color.parse(Parser.create(value).parseComponentValue()); };

    var IFrameElementContainer = /** @class */ (function (_super) {

        __extends(IFrameElementContainer, _super);

        function IFrameElementContainer(iframe) {

            var _this = _super.call(this, iframe) || this;

            _this.src = iframe.src;

            _this.width = parseInt(iframe.width, 10) || 0;

            _this.height = parseInt(iframe.height, 10) || 0;

            _this.backgroundColor = _this.styles.backgroundColor;

            try {

                if (iframe.contentWindow &&

                    iframe.contentWindow.document &&

                    iframe.contentWindow.document.documentElement) {

                    _this.tree = parseTree(iframe.contentWindow.document.documentElement);

                    // http://www.w3.org/TR/css3-background/#special-backgrounds

                    var documentBackgroundColor = iframe.contentWindow.document.documentElement

                        ? parseColor(getComputedStyle(iframe.contentWindow.document.documentElement)

                            .backgroundColor)

                        : COLORS.TRANSPARENT;

                    var bodyBackgroundColor = iframe.contentWindow.document.body

                        ? parseColor(getComputedStyle(iframe.contentWindow.document.body).backgroundColor)

                        : COLORS.TRANSPARENT;

                    _this.backgroundColor = isTransparent(documentBackgroundColor)

                        ? isTransparent(bodyBackgroundColor)

                            ? _this.styles.backgroundColor

                            : bodyBackgroundColor

                        : documentBackgroundColor;

                }

            }

            catch (e) { }

            return _this;

        }

        return IFrameElementContainer;

    }(ElementContainer));



    var LIST_OWNERS = ['OL', 'UL', 'MENU'];

    var parseNodeTree = function (node, parent, root) {

        for (var childNode = node.firstChild, nextNode = void 0; childNode; childNode = nextNode) {

            nextNode = childNode.nextSibling;

            if (isTextNode(childNode) && childNode.data.trim().length > 0) {

                parent.textNodes.push(new TextContainer(childNode, parent.styles));

            }

            else if (isElementNode(childNode)) {

                var container = createContainer(childNode);

                if (container.styles.isVisible()) {

                    if (createsRealStackingContext(childNode, container, root)) {

                        container.flags |= 4 /* CREATES_REAL_STACKING_CONTEXT */;

                    }

                    else if (createsStackingContext(container.styles)) {

                        container.flags |= 2 /* CREATES_STACKING_CONTEXT */;

                    }

                    if (LIST_OWNERS.indexOf(childNode.tagName) !== -1) {

                        container.flags |= 8 /* IS_LIST_OWNER */;

                    }

                    parent.elements.push(container);

                    if (!isTextareaElement(childNode) && !isSVGElement(childNode) && !isSelectElement(childNode)) {

                        parseNodeTree(childNode, container, root);

                    }

                }

            }

        }

    };

    var createContainer = function (element) {

        if (isImageElement(element)) {

            return new ImageElementContainer(element);

        }

        if (isCanvasElement(element)) {

            return new CanvasElementContainer(element);

        }

        if (isSVGElement(element)) {

            return new SVGElementContainer(element);

        }

        if (isLIElement(element)) {

            return new LIElementContainer(element);

        }

        if (isOLElement(element)) {

            return new OLElementContainer(element);

        }

        if (isInputElement(element)) {

            return new InputElementContainer(element);

        }

        if (isSelectElement(element)) {

            return new SelectElementContainer(element);

        }

        if (isTextareaElement(element)) {

            return new TextareaElementContainer(element);

        }

        if (isIFrameElement(element)) {

            return new IFrameElementContainer(element);

        }

        return new ElementContainer(element);

    };

    var parseTree = function (element) {

        var container = createContainer(element);

        container.flags |= 4 /* CREATES_REAL_STACKING_CONTEXT */;

        parseNodeTree(element, container, container);

        return container;

    };

    var createsRealStackingContext = function (node, container, root) {

        return (container.styles.isPositionedWithZIndex() ||

            container.styles.opacity < 1 ||

            container.styles.isTransformed() ||

            (isBodyElement(node) && root.styles.isTransparent()));

    };

    var createsStackingContext = function (styles) { return styles.isPositioned() || styles.isFloating(); };

    var isTextNode = function (node) { return node.nodeType === Node.TEXT_NODE; };

    var isElementNode = function (node) { return node.nodeType === Node.ELEMENT_NODE; };

    var isHTMLElementNode = function (node) {

        return typeof node.style !== 'undefined';

    };

    var isLIElement = function (node) { return node.tagName === 'LI'; };

    var isOLElement = function (node) { return node.tagName === 'OL'; };

    var isInputElement = function (node) { return node.tagName === 'INPUT'; };

    var isHTMLElement = function (node) { return node.tagName === 'HTML'; };

    var isSVGElement = function (node) { return node.tagName === 'svg'; };

    var isBodyElement = function (node) { return node.tagName === 'BODY'; };

    var isCanvasElement = function (node) { return node.tagName === 'CANVAS'; };

    var isImageElement = function (node) { return node.tagName === 'IMG'; };

    var isIFrameElement = function (node) { return node.tagName === 'IFRAME'; };

    var isStyleElement = function (node) { return node.tagName === 'STYLE'; };

    var isScriptElement = function (node) { return node.tagName === 'SCRIPT'; };

    var isTextareaElement = function (node) { return node.tagName === 'TEXTAREA'; };

    var isSelectElement = function (node) { return node.tagName === 'SELECT'; };



    var CounterState = /** @class */ (function () {

        function CounterState() {

            this.counters = {};

        }

        CounterState.prototype.getCounterValue = function (name) {

            var counter = this.counters[name];

            if (counter && counter.length) {

                return counter[counter.length - 1];

            }

            return 1;

        };

        CounterState.prototype.getCounterValues = function (name) {

            var counter = this.counters[name];

            return counter ? counter : [];

        };

        CounterState.prototype.pop = function (counters) {

            var _this = this;

            counters.forEach(function (counter) { return _this.counters[counter].pop(); });

        };

        CounterState.prototype.parse = function (style) {

            var _this = this;

            var counterIncrement = style.counterIncrement;

            var counterReset = style.counterReset;

            if (counterIncrement !== null) {

                counterIncrement.forEach(function (entry) {

                    var counter = _this.counters[entry.counter];

                    if (counter) {

                        counter[Math.max(0, counter.length - 1)] += entry.increment;

                    }

                });

            }

            var counterNames = [];

            counterReset.forEach(function (entry) {

                var counter = _this.counters[entry.counter];

                counterNames.push(entry.counter);

                if (!counter) {

                    counter = _this.counters[entry.counter] = [];

                }

                counter.push(entry.reset);

            });

            return counterNames;

        };

        return CounterState;

    }());

    var ROMAN_UPPER = {

        integers: [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],

        values: ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']

    };

    var ARMENIAN = {

        integers: [

            9000,

            8000,

            7000,

            6000,

            5000,

            4000,

            3000,

            2000,

            1000,

            900,

            800,

            700,

            600,

            500,

            400,

            300,

            200,

            100,

            90,

            80,

            70,

            60,

            50,

            40,

            30,

            20,

            10,

            9,

            8,

            7,

            6,

            5,

            4,

            3,

            2,

            1

        ],

        values: [

            'Ք',

            'Փ',

            'Ւ',

            'Ց',

            'Ր',

            'Տ',

            'Վ',

            'Ս',

            'Ռ',

            'Ջ',

            'Պ',

            'Չ',

            'Ո',

            'Շ',

            'Ն',

            'Յ',

            'Մ',

            'Ճ',

            'Ղ',

            'Ձ',

            'Հ',

            'Կ',

            'Ծ',

            'Խ',

            'Լ',

            'Ի',

            'Ժ',

            'Թ',

            'Ը',

            'Է',

            'Զ',

            'Ե',

            'Դ',

            'Գ',

            'Բ',

            'Ա'

        ]

    };

    var HEBREW = {

        integers: [

            10000,

            9000,

            8000,

            7000,

            6000,

            5000,

            4000,

            3000,

            2000,

            1000,

            400,

            300,

            200,

            100,

            90,

            80,

            70,

            60,

            50,

            40,

            30,

            20,

            19,

            18,

            17,

            16,

            15,

            10,

            9,

            8,

            7,

            6,

            5,

            4,

            3,

            2,

            1

        ],

        values: [

            'י׳',

            'ט׳',

            'ח׳',

            'ז׳',

            'ו׳',

            'ה׳',

            'ד׳',

            'ג׳',

            'ב׳',

            'א׳',

            'ת',

            'ש',

            'ר',

            'ק',

            'צ',

            'פ',

            'ע',

            'ס',

            'נ',

            'מ',

            'ל',

            'כ',

            'יט',

            'יח',

            'יז',

            'טז',

            'טו',

            'י',

            'ט',

            'ח',

            'ז',

            'ו',

            'ה',

            'ד',

            'ג',

            'ב',

            'א'

        ]

    };

    var GEORGIAN = {

        integers: [

            10000,

            9000,

            8000,

            7000,

            6000,

            5000,

            4000,

            3000,

            2000,

            1000,

            900,

            800,

            700,

            600,

            500,

            400,

            300,

            200,

            100,

            90,

            80,

            70,

            60,

            50,

            40,

            30,

            20,

            10,

            9,

            8,

            7,

            6,

            5,

            4,

            3,

            2,

            1

        ],

        values: [

            'ჵ',

            'ჰ',

            'ჯ',

            'ჴ',

            'ხ',

            'ჭ',

            'წ',

            'ძ',

            'ც',

            'ჩ',

            'შ',

            'ყ',

            'ღ',

            'ქ',

            'ფ',

            'ჳ',

            'ტ',

            'ს',

            'რ',

            'ჟ',

            'პ',

            'ო',

            'ჲ',

            'ნ',

            'მ',

            'ლ',

            'კ',

            'ი',

            'თ',

            'ჱ',

            'ზ',

            'ვ',

            'ე',

            'დ',

            'გ',

            'ბ',

            'ა'

        ]

    };

    var createAdditiveCounter = function (value, min, max, symbols, fallback, suffix) {

        if (value < min || value > max) {

            return createCounterText(value, fallback, suffix.length > 0);

        }

        return (symbols.integers.reduce(function (string, integer, index) {

            while (value >= integer) {

                value -= integer;

                string += symbols.values[index];

            }

            return string;

        }, '') + suffix);

    };

    var createCounterStyleWithSymbolResolver = function (value, codePointRangeLength, isNumeric, resolver) {

        var string = '';

        do {

            if (!isNumeric) {

                value--;

            }

            string = resolver(value) + string;

            value /= codePointRangeLength;

        } while (value * codePointRangeLength >= codePointRangeLength);

        return string;

    };

    var createCounterStyleFromRange = function (value, codePointRangeStart, codePointRangeEnd, isNumeric, suffix) {

        var codePointRangeLength = codePointRangeEnd - codePointRangeStart + 1;

        return ((value < 0 ? '-' : '') +

            (createCounterStyleWithSymbolResolver(Math.abs(value), codePointRangeLength, isNumeric, function (codePoint) {

                    return fromCodePoint(Math.floor(codePoint % codePointRangeLength) + codePointRangeStart);

                }) +

                suffix));

    };

    var createCounterStyleFromSymbols = function (value, symbols, suffix) {

        if (suffix === void 0) { suffix = '. '; }

        var codePointRangeLength = symbols.length;

        return (createCounterStyleWithSymbolResolver(Math.abs(value), codePointRangeLength, false, function (codePoint) { return symbols[Math.floor(codePoint % codePointRangeLength)]; }) + suffix);

    };

    var CJK_ZEROS = 1 << 0;

    var CJK_TEN_COEFFICIENTS = 1 << 1;

    var CJK_TEN_HIGH_COEFFICIENTS = 1 << 2;

    var CJK_HUNDRED_COEFFICIENTS = 1 << 3;

    var createCJKCounter = function (value, numbers, multipliers, negativeSign, suffix, flags) {

        if (value < -9999 || value > 9999) {

            return createCounterText(value, LIST_STYLE_TYPE.CJK_DECIMAL, suffix.length > 0);

        }

        var tmp = Math.abs(value);

        var string = suffix;

        if (tmp === 0) {

            return numbers[0] + string;

        }

        for (var digit = 0; tmp > 0 && digit <= 4; digit++) {

            var coefficient = tmp % 10;

            if (coefficient === 0 && contains(flags, CJK_ZEROS) && string !== '') {

                string = numbers[coefficient] + string;

            }

            else if (coefficient > 1 ||

                (coefficient === 1 && digit === 0) ||

                (coefficient === 1 && digit === 1 && contains(flags, CJK_TEN_COEFFICIENTS)) ||

                (coefficient === 1 && digit === 1 && contains(flags, CJK_TEN_HIGH_COEFFICIENTS) && value > 100) ||

                (coefficient === 1 && digit > 1 && contains(flags, CJK_HUNDRED_COEFFICIENTS))) {

                string = numbers[coefficient] + (digit > 0 ? multipliers[digit - 1] : '') + string;

            }

            else if (coefficient === 1 && digit > 0) {

                string = multipliers[digit - 1] + string;

            }

            tmp = Math.floor(tmp / 10);

        }

        return (value < 0 ? negativeSign : '') + string;

    };

    var CHINESE_INFORMAL_MULTIPLIERS = '十百千萬';

    var CHINESE_FORMAL_MULTIPLIERS = '拾佰仟萬';

    var JAPANESE_NEGATIVE = 'マイナス';

    var KOREAN_NEGATIVE = '마이너스';

    var createCounterText = function (value, type, appendSuffix) {

        var defaultSuffix = appendSuffix ? '. ' : '';

        var cjkSuffix = appendSuffix ? '、' : '';

        var koreanSuffix = appendSuffix ? ', ' : '';

        var spaceSuffix = appendSuffix ? ' ' : '';

        switch (type) {

            case LIST_STYLE_TYPE.DISC:

                return '•' + spaceSuffix;

            case LIST_STYLE_TYPE.CIRCLE:

                return '◦' + spaceSuffix;

            case LIST_STYLE_TYPE.SQUARE:

                return '◾' + spaceSuffix;

            case LIST_STYLE_TYPE.DECIMAL_LEADING_ZERO:

                var string = createCounterStyleFromRange(value, 48, 57, true, defaultSuffix);

                return string.length < 4 ? "0" + string : string;

            case LIST_STYLE_TYPE.CJK_DECIMAL:

                return createCounterStyleFromSymbols(value, '〇一二三四五六七八九', cjkSuffix);

            case LIST_STYLE_TYPE.LOWER_ROMAN:

                return createAdditiveCounter(value, 1, 3999, ROMAN_UPPER, LIST_STYLE_TYPE.DECIMAL, defaultSuffix).toLowerCase();

            case LIST_STYLE_TYPE.UPPER_ROMAN:

                return createAdditiveCounter(value, 1, 3999, ROMAN_UPPER, LIST_STYLE_TYPE.DECIMAL, defaultSuffix);

            case LIST_STYLE_TYPE.LOWER_GREEK:

                return createCounterStyleFromRange(value, 945, 969, false, defaultSuffix);

            case LIST_STYLE_TYPE.LOWER_ALPHA:

                return createCounterStyleFromRange(value, 97, 122, false, defaultSuffix);

            case LIST_STYLE_TYPE.UPPER_ALPHA:

                return createCounterStyleFromRange(value, 65, 90, false, defaultSuffix);

            case LIST_STYLE_TYPE.ARABIC_INDIC:

                return createCounterStyleFromRange(value, 1632, 1641, true, defaultSuffix);

            case LIST_STYLE_TYPE.ARMENIAN:

            case LIST_STYLE_TYPE.UPPER_ARMENIAN:

                return createAdditiveCounter(value, 1, 9999, ARMENIAN, LIST_STYLE_TYPE.DECIMAL, defaultSuffix);

            case LIST_STYLE_TYPE.LOWER_ARMENIAN:

                return createAdditiveCounter(value, 1, 9999, ARMENIAN, LIST_STYLE_TYPE.DECIMAL, defaultSuffix).toLowerCase();

            case LIST_STYLE_TYPE.BENGALI:

                return createCounterStyleFromRange(value, 2534, 2543, true, defaultSuffix);

            case LIST_STYLE_TYPE.CAMBODIAN:

            case LIST_STYLE_TYPE.KHMER:

                return createCounterStyleFromRange(value, 6112, 6121, true, defaultSuffix);

            case LIST_STYLE_TYPE.CJK_EARTHLY_BRANCH:

                return createCounterStyleFromSymbols(value, '子丑寅卯辰巳午未申酉戌亥', cjkSuffix);

            case LIST_STYLE_TYPE.CJK_HEAVENLY_STEM:

                return createCounterStyleFromSymbols(value, '甲乙丙丁戊己庚辛壬癸', cjkSuffix);

            case LIST_STYLE_TYPE.CJK_IDEOGRAPHIC:

            case LIST_STYLE_TYPE.TRAD_CHINESE_INFORMAL:

                return createCJKCounter(value, '零一二三四五六七八九', CHINESE_INFORMAL_MULTIPLIERS, '負', cjkSuffix, CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);

            case LIST_STYLE_TYPE.TRAD_CHINESE_FORMAL:

                return createCJKCounter(value, '零壹貳參肆伍陸柒捌玖', CHINESE_FORMAL_MULTIPLIERS, '負', cjkSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);

            case LIST_STYLE_TYPE.SIMP_CHINESE_INFORMAL:

                return createCJKCounter(value, '零一二三四五六七八九', CHINESE_INFORMAL_MULTIPLIERS, '负', cjkSuffix, CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);

            case LIST_STYLE_TYPE.SIMP_CHINESE_FORMAL:

                return createCJKCounter(value, '零壹贰叁肆伍陆柒捌玖', CHINESE_FORMAL_MULTIPLIERS, '负', cjkSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);

            case LIST_STYLE_TYPE.JAPANESE_INFORMAL:

                return createCJKCounter(value, '〇一二三四五六七八九', '十百千万', JAPANESE_NEGATIVE, cjkSuffix, 0);

            case LIST_STYLE_TYPE.JAPANESE_FORMAL:

                return createCJKCounter(value, '零壱弐参四伍六七八九', '拾百千万', JAPANESE_NEGATIVE, cjkSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);

            case LIST_STYLE_TYPE.KOREAN_HANGUL_FORMAL:

                return createCJKCounter(value, '영일이삼사오육칠팔구', '십백천만', KOREAN_NEGATIVE, koreanSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);

            case LIST_STYLE_TYPE.KOREAN_HANJA_INFORMAL:

                return createCJKCounter(value, '零一二三四五六七八九', '十百千萬', KOREAN_NEGATIVE, koreanSuffix, 0);

            case LIST_STYLE_TYPE.KOREAN_HANJA_FORMAL:

                return createCJKCounter(value, '零壹貳參四五六七八九', '拾百千', KOREAN_NEGATIVE, koreanSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);

            case LIST_STYLE_TYPE.DEVANAGARI:

                return createCounterStyleFromRange(value, 0x966, 0x96f, true, defaultSuffix);

            case LIST_STYLE_TYPE.GEORGIAN:

                return createAdditiveCounter(value, 1, 19999, GEORGIAN, LIST_STYLE_TYPE.DECIMAL, defaultSuffix);

            case LIST_STYLE_TYPE.GUJARATI:

                return createCounterStyleFromRange(value, 0xae6, 0xaef, true, defaultSuffix);

            case LIST_STYLE_TYPE.GURMUKHI:

                return createCounterStyleFromRange(value, 0xa66, 0xa6f, true, defaultSuffix);

            case LIST_STYLE_TYPE.HEBREW:

                return createAdditiveCounter(value, 1, 10999, HEBREW, LIST_STYLE_TYPE.DECIMAL, defaultSuffix);

            case LIST_STYLE_TYPE.HIRAGANA:

                return createCounterStyleFromSymbols(value, 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん');

            case LIST_STYLE_TYPE.HIRAGANA_IROHA:

                return createCounterStyleFromSymbols(value, 'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす');

            case LIST_STYLE_TYPE.KANNADA:

                return createCounterStyleFromRange(value, 0xce6, 0xcef, true, defaultSuffix);

            case LIST_STYLE_TYPE.KATAKANA:

                return createCounterStyleFromSymbols(value, 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン', cjkSuffix);

            case LIST_STYLE_TYPE.KATAKANA_IROHA:

                return createCounterStyleFromSymbols(value, 'イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス', cjkSuffix);

            case LIST_STYLE_TYPE.LAO:

                return createCounterStyleFromRange(value, 0xed0, 0xed9, true, defaultSuffix);

            case LIST_STYLE_TYPE.MONGOLIAN:

                return createCounterStyleFromRange(value, 0x1810, 0x1819, true, defaultSuffix);

            case LIST_STYLE_TYPE.MYANMAR:

                return createCounterStyleFromRange(value, 0x1040, 0x1049, true, defaultSuffix);

            case LIST_STYLE_TYPE.ORIYA:

                return createCounterStyleFromRange(value, 0xb66, 0xb6f, true, defaultSuffix);

            case LIST_STYLE_TYPE.PERSIAN:

                return createCounterStyleFromRange(value, 0x6f0, 0x6f9, true, defaultSuffix);

            case LIST_STYLE_TYPE.TAMIL:

                return createCounterStyleFromRange(value, 0xbe6, 0xbef, true, defaultSuffix);

            case LIST_STYLE_TYPE.TELUGU:

                return createCounterStyleFromRange(value, 0xc66, 0xc6f, true, defaultSuffix);

            case LIST_STYLE_TYPE.THAI:

                return createCounterStyleFromRange(value, 0xe50, 0xe59, true, defaultSuffix);

            case LIST_STYLE_TYPE.TIBETAN:

                return createCounterStyleFromRange(value, 0xf20, 0xf29, true, defaultSuffix);

            case LIST_STYLE_TYPE.DECIMAL:

            default:

                return createCounterStyleFromRange(value, 48, 57, true, defaultSuffix);

        }

    };



    var IGNORE_ATTRIBUTE = 'data-html2canvas-ignore';

    var DocumentCloner = /** @class */ (function () {

        function DocumentCloner(element, options) {

            this.options = options;

            this.scrolledElements = [];

            this.referenceElement = element;

            this.counters = new CounterState();

            this.quoteDepth = 0;

            if (!element.ownerDocument) {

                throw new Error('Cloned element does not have an owner document');

            }

            this.documentElement = this.cloneNode(element.ownerDocument.documentElement);

        }

        DocumentCloner.prototype.toIFrame = function (ownerDocument, windowSize) {

            var _this = this;

            var iframe = createIFrameContainer(ownerDocument, windowSize);

            if (!iframe.contentWindow) {

                return Promise.reject("Unable to find iframe window");

            }

            var scrollX = ownerDocument.defaultView.pageXOffset;

            var scrollY = ownerDocument.defaultView.pageYOffset;

            var cloneWindow = iframe.contentWindow;

            var documentClone = cloneWindow.document;

            /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle

             if window url is about:blank, we can assign the url to current by writing onto the document

             */

            var iframeLoad = iframeLoader(iframe).then(function () {

                _this.scrolledElements.forEach(restoreNodeScroll);

                if (cloneWindow) {

                    cloneWindow.scrollTo(windowSize.left, windowSize.top);

                    if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent) &&

                        (cloneWindow.scrollY !== windowSize.top || cloneWindow.scrollX !== windowSize.left)) {

                        documentClone.documentElement.style.top = -windowSize.top + 'px';

                        documentClone.documentElement.style.left = -windowSize.left + 'px';

                        documentClone.documentElement.style.position = 'absolute';

                    }

                }

                var onclone = _this.options.onclone;

                if (typeof _this.clonedReferenceElement === 'undefined') {

                    return Promise.reject("Error finding the " + _this.referenceElement.nodeName + " in the cloned document");

                }

                if (typeof onclone === 'function') {

                    return Promise.resolve()

                        .then(function () { return onclone(documentClone); })

                        .then(function () { return iframe; });

                }

                return iframe;

            });

            documentClone.open();

            documentClone.write(serializeDoctype(document.doctype) + "<html></html>");

            // Chrome scrolls the parent document for some reason after the write to the cloned window???

            restoreOwnerScroll(this.referenceElement.ownerDocument, scrollX, scrollY);

            documentClone.replaceChild(documentClone.adoptNode(this.documentElement), documentClone.documentElement);

            documentClone.close();

            return iframeLoad;

        };

        DocumentCloner.prototype.createElementClone = function (node) {

            if (isCanvasElement(node)) {

                return this.createCanvasClone(node);

            }

            /*

            if (isIFrameElement(node)) {

                return this.createIFrameClone(node);

            }

    */

            if (isStyleElement(node)) {

                return this.createStyleClone(node);

            }

            return node.cloneNode(false);

        };

        DocumentCloner.prototype.createStyleClone = function (node) {

            try {

                var sheet = node.sheet;

                if (sheet && sheet.cssRules) {

                    var css = [].slice.call(sheet.cssRules, 0).reduce(function (css, rule) {

                        if (rule && typeof rule.cssText === 'string') {

                            return css + rule.cssText;

                        }

                        return css;

                    }, '');

                    var style = node.cloneNode(false);

                    style.textContent = css;

                    return style;

                }

            }

            catch (e) {

                // accessing node.sheet.cssRules throws a DOMException

                Logger.getInstance(this.options.id).error('Unable to access cssRules property', e);

                if (e.name !== 'SecurityError') {

                    throw e;

                }

            }

            return node.cloneNode(false);

        };

        DocumentCloner.prototype.createCanvasClone = function (canvas) {

            if (this.options.inlineImages && canvas.ownerDocument) {

                var img = canvas.ownerDocument.createElement('img');

                try {

                    img.src = canvas.toDataURL();

                    return img;

                }

                catch (e) {

                    Logger.getInstance(this.options.id).info("Unable to clone canvas contents, canvas is tainted");

                }

            }

            var clonedCanvas = canvas.cloneNode(false);

            try {

                clonedCanvas.width = canvas.width;

                clonedCanvas.height = canvas.height;

                var ctx = canvas.getContext('2d');

                var clonedCtx = clonedCanvas.getContext('2d');

                if (clonedCtx) {

                    if (ctx) {

                        clonedCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);

                    }

                    else {

                        clonedCtx.drawImage(canvas, 0, 0);

                    }

                }

                return clonedCanvas;

            }

            catch (e) { }

            return clonedCanvas;

        };

        /*

        createIFrameClone(iframe: HTMLIFrameElement) {

            const tempIframe = <HTMLIFrameElement>iframe.cloneNode(false);

            const iframeKey = generateIframeKey();

            tempIframe.setAttribute('data-html2canvas-internal-iframe-key', iframeKey);



            const {width, height} = parseBounds(iframe);



            this.resourceLoader.cache[iframeKey] = getIframeDocumentElement(iframe, this.options)

                .then(documentElement => {

                    return this.renderer(

                        documentElement,

                        {

                            allowTaint: this.options.allowTaint,

                            backgroundColor: '#ffffff',

                            canvas: null,

                            imageTimeout: this.options.imageTimeout,

                            logging: this.options.logging,

                            proxy: this.options.proxy,

                            removeContainer: this.options.removeContainer,

                            scale: this.options.scale,

                            foreignObjectRendering: this.options.foreignObjectRendering,

                            useCORS: this.options.useCORS,

                            target: new CanvasRenderer(),

                            width,

                            height,

                            x: 0,

                            y: 0,

                            windowWidth: documentElement.ownerDocument.defaultView.innerWidth,

                            windowHeight: documentElement.ownerDocument.defaultView.innerHeight,

                            scrollX: documentElement.ownerDocument.defaultView.pageXOffset,

                            scrollY: documentElement.ownerDocument.defaultView.pageYOffset

                        },

                    );

                })

                .then(

                    (canvas: HTMLCanvasElement) =>

                        new Promise((resolve, reject) => {

                            const iframeCanvas = document.createElement('img');

                            iframeCanvas.onload = () => resolve(canvas);

                            iframeCanvas.onerror = (event) => {

                                // Empty iframes may result in empty "data:," URLs, which are invalid from the <img>'s point of view

                                // and instead of `onload` cause `onerror` and unhandled rejection warnings

                                // https://github.com/niklasvh/html2canvas/issues/1502

                                iframeCanvas.src == 'data:,' ? resolve(canvas) : reject(event);

                            };

                            iframeCanvas.src = canvas.toDataURL();

                            if (tempIframe.parentNode && iframe.ownerDocument && iframe.ownerDocument.defaultView) {

                                tempIframe.parentNode.replaceChild(

                                    copyCSSStyles(

                                        iframe.ownerDocument.defaultView.getComputedStyle(iframe),

                                        iframeCanvas

                                    ),

                                    tempIframe

                                );

                            }

                        })

                );

            return tempIframe;

        }

    */

        DocumentCloner.prototype.cloneNode = function (node) {

            if (isTextNode(node)) {

                return document.createTextNode(node.data);

            }

            if (!node.ownerDocument) {

                return node.cloneNode(false);

            }

            var window = node.ownerDocument.defaultView;

            if (isHTMLElementNode(node) && window) {

                var clone = this.createElementClone(node);

                var style = window.getComputedStyle(node);

                var styleBefore = window.getComputedStyle(node, ':before');

                var styleAfter = window.getComputedStyle(node, ':after');

                if (this.referenceElement === node) {

                    this.clonedReferenceElement = clone;

                }

                if (isBodyElement(clone)) {

                    createPseudoHideStyles(clone);

                }

                var counters = this.counters.parse(new CSSParsedCounterDeclaration(style));

                var before_1 = this.resolvePseudoContent(node, clone, styleBefore, PseudoElementType.BEFORE);

                for (var child = node.firstChild; child; child = child.nextSibling) {

                    if (!isElementNode(child) ||

                        (!isScriptElement(child) &&

                            !child.hasAttribute(IGNORE_ATTRIBUTE) &&

                            (typeof this.options.ignoreElements !== 'function' || !this.options.ignoreElements(child)))) {

                        if (!this.options.copyStyles || !isElementNode(child) || !isStyleElement(child)) {

                            clone.appendChild(this.cloneNode(child));

                        }

                    }

                }

                if (before_1) {

                    clone.insertBefore(before_1, clone.firstChild);

                }

                var after_1 = this.resolvePseudoContent(node, clone, styleAfter, PseudoElementType.AFTER);

                if (after_1) {

                    clone.appendChild(after_1);

                }

                this.counters.pop(counters);

                if (style && this.options.copyStyles && !isIFrameElement(node)) {

                    copyCSSStyles(style, clone);

                }

                //this.inlineAllImages(clone);

                if (node.scrollTop !== 0 || node.scrollLeft !== 0) {

                    this.scrolledElements.push([clone, node.scrollLeft, node.scrollTop]);

                }

                if ((isTextareaElement(node) || isSelectElement(node)) &&

                    (isTextareaElement(clone) || isSelectElement(clone))) {

                    clone.value = node.value;

                }

                return clone;

            }

            return node.cloneNode(false);

        };

        DocumentCloner.prototype.resolvePseudoContent = function (node, clone, style, pseudoElt) {

            var _this = this;

            if (!style) {

                return;

            }

            var value = style.content;

            var document = clone.ownerDocument;

            if (!document || !value || value === 'none' || value === '-moz-alt-content' || style.display === 'none') {

                return;

            }

            this.counters.parse(new CSSParsedCounterDeclaration(style));

            var declaration = new CSSParsedPseudoDeclaration(style);

            var anonymousReplacedElement = document.createElement('html2canvaspseudoelement');

            copyCSSStyles(style, anonymousReplacedElement);

            declaration.content.forEach(function (token) {

                if (token.type === TokenType.STRING_TOKEN) {

                    anonymousReplacedElement.appendChild(document.createTextNode(token.value));

                }

                else if (token.type === TokenType.URL_TOKEN) {

                    var img = document.createElement('img');

                    img.src = token.value;

                    img.style.opacity = '1';

                    anonymousReplacedElement.appendChild(img);

                }

                else if (token.type === TokenType.FUNCTION) {

                    if (token.name === 'attr') {

                        var attr = token.values.filter(isIdentToken);

                        if (attr.length) {

                            anonymousReplacedElement.appendChild(document.createTextNode(node.getAttribute(attr[0].value) || ''));

                        }

                    }

                    else if (token.name === 'counter') {

                        var _a = token.values.filter(nonFunctionArgSeparator), counter = _a[0], counterStyle = _a[1];

                        if (counter && isIdentToken(counter)) {

                            var counterState = _this.counters.getCounterValue(counter.value);

                            var counterType = counterStyle && isIdentToken(counterStyle)

                                ? listStyleType.parse(counterStyle.value)

                                : LIST_STYLE_TYPE.DECIMAL;

                            anonymousReplacedElement.appendChild(document.createTextNode(createCounterText(counterState, counterType, false)));

                        }

                    }

                    else if (token.name === 'counters') {

                        var _b = token.values.filter(nonFunctionArgSeparator), counter = _b[0], delim = _b[1], counterStyle = _b[2];

                        if (counter && isIdentToken(counter)) {

                            var counterStates = _this.counters.getCounterValues(counter.value);

                            var counterType_1 = counterStyle && isIdentToken(counterStyle)

                                ? listStyleType.parse(counterStyle.value)

                                : LIST_STYLE_TYPE.DECIMAL;

                            var separator = delim && delim.type === TokenType.STRING_TOKEN ? delim.value : '';

                            var text = counterStates

                                .map(function (value) { return createCounterText(value, counterType_1, false); })

                                .join(separator);

                            anonymousReplacedElement.appendChild(document.createTextNode(text));

                        }

                    }

                }

                else if (token.type === TokenType.IDENT_TOKEN) {

                    switch (token.value) {

                        case 'open-quote':

                            anonymousReplacedElement.appendChild(document.createTextNode(getQuote(declaration.quotes, _this.quoteDepth++, true)));

                            break;

                        case 'close-quote':

                            anonymousReplacedElement.appendChild(document.createTextNode(getQuote(declaration.quotes, --_this.quoteDepth, false)));

                            break;

                        default:

                        //    console.log('ident', token, declaration);

                    }

                }

            });

            anonymousReplacedElement.className = PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + " " + PSEUDO_HIDE_ELEMENT_CLASS_AFTER;

            clone.className +=

                pseudoElt === PseudoElementType.BEFORE

                    ? " " + PSEUDO_HIDE_ELEMENT_CLASS_BEFORE

                    : " " + PSEUDO_HIDE_ELEMENT_CLASS_AFTER;

            return anonymousReplacedElement;

        };

        return DocumentCloner;

    }());

    var PseudoElementType;

    (function (PseudoElementType) {

        PseudoElementType[PseudoElementType["BEFORE"] = 0] = "BEFORE";

        PseudoElementType[PseudoElementType["AFTER"] = 1] = "AFTER";

    })(PseudoElementType || (PseudoElementType = {}));

    var createIFrameContainer = function (ownerDocument, bounds) {

        var cloneIframeContainer = ownerDocument.createElement('iframe');

        cloneIframeContainer.className = 'html2canvas-container';

        cloneIframeContainer.style.visibility = 'hidden';

        cloneIframeContainer.style.position = 'fixed';

        cloneIframeContainer.style.left = '-10000px';

        cloneIframeContainer.style.top = '0px';

        cloneIframeContainer.style.border = '0';

        cloneIframeContainer.width = bounds.width.toString();

        cloneIframeContainer.height = bounds.height.toString();

        cloneIframeContainer.scrolling = 'no'; // ios won't scroll without it

        cloneIframeContainer.setAttribute(IGNORE_ATTRIBUTE, 'true');

        ownerDocument.body.appendChild(cloneIframeContainer);

        return cloneIframeContainer;

    };

    var iframeLoader = function (iframe) {

        return new Promise(function (resolve, reject) {

            var cloneWindow = iframe.contentWindow;

            if (!cloneWindow) {

                return reject("No window assigned for iframe");

            }

            var documentClone = cloneWindow.document;

            cloneWindow.onload = iframe.onload = documentClone.onreadystatechange = function () {

                cloneWindow.onload = iframe.onload = documentClone.onreadystatechange = null;

                var interval = setInterval(function () {

                    if (documentClone.body.childNodes.length > 0 && documentClone.readyState === 'complete') {

                        clearInterval(interval);

                        resolve(iframe);

                    }

                }, 50);

            };

        });

    };

    var copyCSSStyles = function (style, target) {

        // Edge does not provide value for cssText

        for (var i = style.length - 1; i >= 0; i--) {

            var property = style.item(i);

            // Safari shows pseudoelements if content is set

            if (property !== 'content') {

                target.style.setProperty(property, style.getPropertyValue(property));

            }

        }

        return target;

    };

    var serializeDoctype = function (doctype) {

        var str = '';

        if (doctype) {

            str += '<!DOCTYPE ';

            if (doctype.name) {

                str += doctype.name;

            }

            if (doctype.internalSubset) {

                str += doctype.internalSubset;

            }

            if (doctype.publicId) {

                str += "\"" + doctype.publicId + "\"";

            }

            if (doctype.systemId) {

                str += "\"" + doctype.systemId + "\"";

            }

            str += '>';

        }

        return str;

    };

    var restoreOwnerScroll = function (ownerDocument, x, y) {

        if (ownerDocument &&

            ownerDocument.defaultView &&

            (x !== ownerDocument.defaultView.pageXOffset || y !== ownerDocument.defaultView.pageYOffset)) {

            ownerDocument.defaultView.scrollTo(x, y);

        }

    };

    var restoreNodeScroll = function (_a) {

        var element = _a[0], x = _a[1], y = _a[2];

        element.scrollLeft = x;

        element.scrollTop = y;

    };

    var PSEUDO_BEFORE = ':before';

    var PSEUDO_AFTER = ':after';

    var PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = '___html2canvas___pseudoelement_before';

    var PSEUDO_HIDE_ELEMENT_CLASS_AFTER = '___html2canvas___pseudoelement_after';

    var PSEUDO_HIDE_ELEMENT_STYLE = "{\n    content: \"\" !important;\n    display: none !important;\n}";

    var createPseudoHideStyles = function (body) {

        createStyles(body, "." + PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + PSEUDO_BEFORE + PSEUDO_HIDE_ELEMENT_STYLE + "\n         ." + PSEUDO_HIDE_ELEMENT_CLASS_AFTER + PSEUDO_AFTER + PSEUDO_HIDE_ELEMENT_STYLE);

    };

    var createStyles = function (body, styles) {

        var document = body.ownerDocument;

        if (document) {

            var style = document.createElement('style');

            style.textContent = styles;

            body.appendChild(style);

        }

    };



    var PathType;

    (function (PathType) {

        PathType[PathType["VECTOR"] = 0] = "VECTOR";

        PathType[PathType["BEZIER_CURVE"] = 1] = "BEZIER_CURVE";

    })(PathType || (PathType = {}));

    var equalPath = function (a, b) {

        if (a.length === b.length) {

            return a.some(function (v, i) { return v === b[i]; });

        }

        return false;

    };

    var transformPath = function (path, deltaX, deltaY, deltaW, deltaH) {

        return path.map(function (point, index) {

            switch (index) {

                case 0:

                    return point.add(deltaX, deltaY);

                case 1:

                    return point.add(deltaX + deltaW, deltaY);

                case 2:

                    return point.add(deltaX + deltaW, deltaY + deltaH);

                case 3:

                    return point.add(deltaX, deltaY + deltaH);

            }

            return point;

        });

    };



    var Vector = /** @class */ (function () {

        function Vector(x, y) {

            this.type = PathType.VECTOR;

            this.x = x;

            this.y = y;

        }

        Vector.prototype.add = function (deltaX, deltaY) {

            return new Vector(this.x + deltaX, this.y + deltaY);

        };

        return Vector;

    }());



    var lerp = function (a, b, t) {

        return new Vector(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);

    };

    var BezierCurve = /** @class */ (function () {

        function BezierCurve(start, startControl, endControl, end) {

            this.type = PathType.BEZIER_CURVE;

            this.start = start;

            this.startControl = startControl;

            this.endControl = endControl;

            this.end = end;

        }

        BezierCurve.prototype.subdivide = function (t, firstHalf) {

            var ab = lerp(this.start, this.startControl, t);

            var bc = lerp(this.startControl, this.endControl, t);

            var cd = lerp(this.endControl, this.end, t);

            var abbc = lerp(ab, bc, t);

            var bccd = lerp(bc, cd, t);

            var dest = lerp(abbc, bccd, t);

            return firstHalf ? new BezierCurve(this.start, ab, abbc, dest) : new BezierCurve(dest, bccd, cd, this.end);

        };

        BezierCurve.prototype.add = function (deltaX, deltaY) {

            return new BezierCurve(this.start.add(deltaX, deltaY), this.startControl.add(deltaX, deltaY), this.endControl.add(deltaX, deltaY), this.end.add(deltaX, deltaY));

        };

        BezierCurve.prototype.reverse = function () {

            return new BezierCurve(this.end, this.endControl, this.startControl, this.start);

        };

        return BezierCurve;

    }());

    var isBezierCurve = function (path) { return path.type === PathType.BEZIER_CURVE; };



    var BoundCurves = /** @class */ (function () {

        function BoundCurves(element) {

            var styles = element.styles;

            var bounds = element.bounds;

            var _a = getAbsoluteValueForTuple(styles.borderTopLeftRadius, bounds.width, bounds.height), tlh = _a[0], tlv = _a[1];

            var _b = getAbsoluteValueForTuple(styles.borderTopRightRadius, bounds.width, bounds.height), trh = _b[0], trv = _b[1];

            var _c = getAbsoluteValueForTuple(styles.borderBottomRightRadius, bounds.width, bounds.height), brh = _c[0], brv = _c[1];

            var _d = getAbsoluteValueForTuple(styles.borderBottomLeftRadius, bounds.width, bounds.height), blh = _d[0], blv = _d[1];

            var factors = [];

            factors.push((tlh + trh) / bounds.width);

            factors.push((blh + brh) / bounds.width);

            factors.push((tlv + blv) / bounds.height);

            factors.push((trv + brv) / bounds.height);

            var maxFactor = Math.max.apply(Math, factors);

            if (maxFactor > 1) {

                tlh /= maxFactor;

                tlv /= maxFactor;

                trh /= maxFactor;

                trv /= maxFactor;

                brh /= maxFactor;

                brv /= maxFactor;

                blh /= maxFactor;

                blv /= maxFactor;

            }

            var topWidth = bounds.width - trh;

            var rightHeight = bounds.height - brv;

            var bottomWidth = bounds.width - brh;

            var leftHeight = bounds.height - blv;

            var borderTopWidth = styles.borderTopWidth;

            var borderRightWidth = styles.borderRightWidth;

            var borderBottomWidth = styles.borderBottomWidth;

            var borderLeftWidth = styles.borderLeftWidth;

            var paddingTop = getAbsoluteValue(styles.paddingTop, element.bounds.width);

            var paddingRight = getAbsoluteValue(styles.paddingRight, element.bounds.width);

            var paddingBottom = getAbsoluteValue(styles.paddingBottom, element.bounds.width);

            var paddingLeft = getAbsoluteValue(styles.paddingLeft, element.bounds.width);

            this.topLeftBorderBox =

                tlh > 0 || tlv > 0

                    ? getCurvePoints(bounds.left, bounds.top, tlh, tlv, CORNER.TOP_LEFT)

                    : new Vector(bounds.left, bounds.top);

            this.topRightBorderBox =

                trh > 0 || trv > 0

                    ? getCurvePoints(bounds.left + topWidth, bounds.top, trh, trv, CORNER.TOP_RIGHT)

                    : new Vector(bounds.left + bounds.width, bounds.top);

            this.bottomRightBorderBox =

                brh > 0 || brv > 0

                    ? getCurvePoints(bounds.left + bottomWidth, bounds.top + rightHeight, brh, brv, CORNER.BOTTOM_RIGHT)

                    : new Vector(bounds.left + bounds.width, bounds.top + bounds.height);

            this.bottomLeftBorderBox =

                blh > 0 || blv > 0

                    ? getCurvePoints(bounds.left, bounds.top + leftHeight, blh, blv, CORNER.BOTTOM_LEFT)

                    : new Vector(bounds.left, bounds.top + bounds.height);

            this.topLeftPaddingBox =

                tlh > 0 || tlv > 0

                    ? getCurvePoints(bounds.left + borderLeftWidth, bounds.top + borderTopWidth, Math.max(0, tlh - borderLeftWidth), Math.max(0, tlv - borderTopWidth), CORNER.TOP_LEFT)

                    : new Vector(bounds.left + borderLeftWidth, bounds.top + borderTopWidth);

            this.topRightPaddingBox =

                trh > 0 || trv > 0

                    ? getCurvePoints(bounds.left + Math.min(topWidth, bounds.width + borderLeftWidth), bounds.top + borderTopWidth, topWidth > bounds.width + borderLeftWidth ? 0 : trh - borderLeftWidth, trv - borderTopWidth, CORNER.TOP_RIGHT)

                    : new Vector(bounds.left + bounds.width - borderRightWidth, bounds.top + borderTopWidth);

            this.bottomRightPaddingBox =

                brh > 0 || brv > 0

                    ? getCurvePoints(bounds.left + Math.min(bottomWidth, bounds.width - borderLeftWidth), bounds.top + Math.min(rightHeight, bounds.height + borderTopWidth), Math.max(0, brh - borderRightWidth), brv - borderBottomWidth, CORNER.BOTTOM_RIGHT)

                    : new Vector(bounds.left + bounds.width - borderRightWidth, bounds.top + bounds.height - borderBottomWidth);

            this.bottomLeftPaddingBox =

                blh > 0 || blv > 0

                    ? getCurvePoints(bounds.left + borderLeftWidth, bounds.top + leftHeight, Math.max(0, blh - borderLeftWidth), blv - borderBottomWidth, CORNER.BOTTOM_LEFT)

                    : new Vector(bounds.left + borderLeftWidth, bounds.top + bounds.height - borderBottomWidth);

            this.topLeftContentBox =

                tlh > 0 || tlv > 0

                    ? getCurvePoints(bounds.left + borderLeftWidth + paddingLeft, bounds.top + borderTopWidth + paddingTop, Math.max(0, tlh - (borderLeftWidth + paddingLeft)), Math.max(0, tlv - (borderTopWidth + paddingTop)), CORNER.TOP_LEFT)

                    : new Vector(bounds.left + borderLeftWidth + paddingLeft, bounds.top + borderTopWidth + paddingTop);

            this.topRightContentBox =

                trh > 0 || trv > 0

                    ? getCurvePoints(bounds.left + Math.min(topWidth, bounds.width + borderLeftWidth + paddingLeft), bounds.top + borderTopWidth + paddingTop, topWidth > bounds.width + borderLeftWidth + paddingLeft ? 0 : trh - borderLeftWidth + paddingLeft, trv - (borderTopWidth + paddingTop), CORNER.TOP_RIGHT)

                    : new Vector(bounds.left + bounds.width - (borderRightWidth + paddingRight), bounds.top + borderTopWidth + paddingTop);

            this.bottomRightContentBox =

                brh > 0 || brv > 0

                    ? getCurvePoints(bounds.left + Math.min(bottomWidth, bounds.width - (borderLeftWidth + paddingLeft)), bounds.top + Math.min(rightHeight, bounds.height + borderTopWidth + paddingTop), Math.max(0, brh - (borderRightWidth + paddingRight)), brv - (borderBottomWidth + paddingBottom), CORNER.BOTTOM_RIGHT)

                    : new Vector(bounds.left + bounds.width - (borderRightWidth + paddingRight), bounds.top + bounds.height - (borderBottomWidth + paddingBottom));

            this.bottomLeftContentBox =

                blh > 0 || blv > 0

                    ? getCurvePoints(bounds.left + borderLeftWidth + paddingLeft, bounds.top + leftHeight, Math.max(0, blh - (borderLeftWidth + paddingLeft)), blv - (borderBottomWidth + paddingBottom), CORNER.BOTTOM_LEFT)

                    : new Vector(bounds.left + borderLeftWidth + paddingLeft, bounds.top + bounds.height - (borderBottomWidth + paddingBottom));

        }

        return BoundCurves;

    }());

    var CORNER;

    (function (CORNER) {

        CORNER[CORNER["TOP_LEFT"] = 0] = "TOP_LEFT";

        CORNER[CORNER["TOP_RIGHT"] = 1] = "TOP_RIGHT";

        CORNER[CORNER["BOTTOM_RIGHT"] = 2] = "BOTTOM_RIGHT";

        CORNER[CORNER["BOTTOM_LEFT"] = 3] = "BOTTOM_LEFT";

    })(CORNER || (CORNER = {}));

    var getCurvePoints = function (x, y, r1, r2, position) {

        var kappa = 4 * ((Math.sqrt(2) - 1) / 3);

        var ox = r1 * kappa; // control point offset horizontal

        var oy = r2 * kappa; // control point offset vertical

        var xm = x + r1; // x-middle

        var ym = y + r2; // y-middle

        switch (position) {

            case CORNER.TOP_LEFT:

                return new BezierCurve(new Vector(x, ym), new Vector(x, ym - oy), new Vector(xm - ox, y), new Vector(xm, y));

            case CORNER.TOP_RIGHT:

                return new BezierCurve(new Vector(x, y), new Vector(x + ox, y), new Vector(xm, ym - oy), new Vector(xm, ym));

            case CORNER.BOTTOM_RIGHT:

                return new BezierCurve(new Vector(xm, y), new Vector(xm, y + oy), new Vector(x + ox, ym), new Vector(x, ym));

            case CORNER.BOTTOM_LEFT:

            default:

                return new BezierCurve(new Vector(xm, ym), new Vector(xm - ox, ym), new Vector(x, y + oy), new Vector(x, y));

        }

    };

    var calculateBorderBoxPath = function (curves) {

        return [curves.topLeftBorderBox, curves.topRightBorderBox, curves.bottomRightBorderBox, curves.bottomLeftBorderBox];

    };

    var calculateContentBoxPath = function (curves) {

        return [

            curves.topLeftContentBox,

            curves.topRightContentBox,

            curves.bottomRightContentBox,

            curves.bottomLeftContentBox

        ];

    };

    var calculatePaddingBoxPath = function (curves) {

        return [

            curves.topLeftPaddingBox,

            curves.topRightPaddingBox,

            curves.bottomRightPaddingBox,

            curves.bottomLeftPaddingBox

        ];

    };



    var TransformEffect = /** @class */ (function () {

        function TransformEffect(offsetX, offsetY, matrix) {

            this.type = 0 /* TRANSFORM */;

            this.offsetX = offsetX;

            this.offsetY = offsetY;

            this.matrix = matrix;

            this.target = 2 /* BACKGROUND_BORDERS */ | 4 /* CONTENT */;

        }

        return TransformEffect;

    }());

    var ClipEffect = /** @class */ (function () {

        function ClipEffect(path, target) {

            this.type = 1 /* CLIP */;

            this.target = target;

            this.path = path;

        }

        return ClipEffect;

    }());

    var isTransformEffect = function (effect) {

        return effect.type === 0 /* TRANSFORM */;

    };

    var isClipEffect = function (effect) { return effect.type === 1 /* CLIP */; };



    var StackingContext = /** @class */ (function () {

        function StackingContext(container) {

            this.element = container;

            this.inlineLevel = [];

            this.nonInlineLevel = [];

            this.negativeZIndex = [];

            this.zeroOrAutoZIndexOrTransformedOrOpacity = [];

            this.positiveZIndex = [];

            this.nonPositionedFloats = [];

            this.nonPositionedInlineLevel = [];

        }

        return StackingContext;

    }());

    var ElementPaint = /** @class */ (function () {

        function ElementPaint(element, parentStack) {

            this.container = element;

            this.effects = parentStack.slice(0);

            this.curves = new BoundCurves(element);

            if (element.styles.transform !== null) {

                var offsetX = element.bounds.left + element.styles.transformOrigin[0].number;

                var offsetY = element.bounds.top + element.styles.transformOrigin[1].number;

                var matrix = element.styles.transform;

                this.effects.push(new TransformEffect(offsetX, offsetY, matrix));

            }

            if (element.styles.overflowX !== OVERFLOW.VISIBLE) {

                var borderBox = calculateBorderBoxPath(this.curves);

                var paddingBox = calculatePaddingBoxPath(this.curves);

                if (equalPath(borderBox, paddingBox)) {

                    this.effects.push(new ClipEffect(borderBox, 2 /* BACKGROUND_BORDERS */ | 4 /* CONTENT */));

                }

                else {

                    this.effects.push(new ClipEffect(borderBox, 2 /* BACKGROUND_BORDERS */));

                    this.effects.push(new ClipEffect(paddingBox, 4 /* CONTENT */));

                }

            }

        }

        ElementPaint.prototype.getParentEffects = function () {

            var effects = this.effects.slice(0);

            if (this.container.styles.overflowX !== OVERFLOW.VISIBLE) {

                var borderBox = calculateBorderBoxPath(this.curves);

                var paddingBox = calculatePaddingBoxPath(this.curves);

                if (!equalPath(borderBox, paddingBox)) {

                    effects.push(new ClipEffect(paddingBox, 2 /* BACKGROUND_BORDERS */ | 4 /* CONTENT */));

                }

            }

            return effects;

        };

        return ElementPaint;

    }());

    var parseStackTree = function (parent, stackingContext, realStackingContext, listItems) {

        parent.container.elements.forEach(function (child) {

            var treatAsRealStackingContext = contains(child.flags, 4 /* CREATES_REAL_STACKING_CONTEXT */);

            var createsStackingContext = contains(child.flags, 2 /* CREATES_STACKING_CONTEXT */);

            var paintContainer = new ElementPaint(child, parent.getParentEffects());

            if (contains(child.styles.display, 2048 /* LIST_ITEM */)) {

                listItems.push(paintContainer);

            }

            var listOwnerItems = contains(child.flags, 8 /* IS_LIST_OWNER */) ? [] : listItems;

            if (treatAsRealStackingContext || createsStackingContext) {

                var parentStack = treatAsRealStackingContext || child.styles.isPositioned() ? realStackingContext : stackingContext;

                var stack = new StackingContext(paintContainer);

                if (child.styles.isPositioned() || child.styles.opacity < 1 || child.styles.isTransformed()) {

                    var order_1 = child.styles.zIndex.order;

                    if (order_1 < 0) {

                        var index_1 = 0;

                        parentStack.negativeZIndex.some(function (current, i) {

                            if (order_1 > current.element.container.styles.zIndex.order) {

                                index_1 = i;

                                return true;

                            }

                            return false;

                        });

                        parentStack.negativeZIndex.splice(index_1, 0, stack);

                    }

                    else if (order_1 > 0) {

                        var index_2 = 0;

                        parentStack.positiveZIndex.some(function (current, i) {

                            if (order_1 > current.element.container.styles.zIndex.order) {

                                index_2 = i + 1;

                                return true;

                            }

                            return false;

                        });

                        parentStack.positiveZIndex.splice(index_2, 0, stack);

                    }

                    else {

                        parentStack.zeroOrAutoZIndexOrTransformedOrOpacity.push(stack);

                    }

                }

                else {

                    if (child.styles.isFloating()) {

                        parentStack.nonPositionedFloats.push(stack);

                    }

                    else {

                        parentStack.nonPositionedInlineLevel.push(stack);

                    }

                }

                parseStackTree(paintContainer, stack, treatAsRealStackingContext ? stack : realStackingContext, listOwnerItems);

            }

            else {

                if (child.styles.isInlineLevel()) {

                    stackingContext.inlineLevel.push(paintContainer);

                }

                else {

                    stackingContext.nonInlineLevel.push(paintContainer);

                }

                parseStackTree(paintContainer, stackingContext, realStackingContext, listOwnerItems);

            }

            if (contains(child.flags, 8 /* IS_LIST_OWNER */)) {

                processListItems(child, listOwnerItems);

            }

        });

    };

    var processListItems = function (owner, elements) {

        var numbering = owner instanceof OLElementContainer ? owner.start : 1;

        var reversed = owner instanceof OLElementContainer ? owner.reversed : false;

        for (var i = 0; i < elements.length; i++) {

            var item = elements[i];

            if (item.container instanceof LIElementContainer &&

                typeof item.container.value === 'number' &&

                item.container.value !== 0) {

                numbering = item.container.value;

            }

            item.listValue = createCounterText(numbering, item.container.styles.listStyleType, true);

            numbering += reversed ? -1 : 1;

        }

    };

    var parseStackingContexts = function (container) {

        var paintContainer = new ElementPaint(container, []);

        var root = new StackingContext(paintContainer);

        var listItems = [];

        parseStackTree(paintContainer, root, root, listItems);

        processListItems(paintContainer.container, listItems);

        return root;

    };



    var parsePathForBorder = function (curves, borderSide) {

        switch (borderSide) {

            case 0:

                return createPathFromCurves(curves.topLeftBorderBox, curves.topLeftPaddingBox, curves.topRightBorderBox, curves.topRightPaddingBox);

            case 1:

                return createPathFromCurves(curves.topRightBorderBox, curves.topRightPaddingBox, curves.bottomRightBorderBox, curves.bottomRightPaddingBox);

            case 2:

                return createPathFromCurves(curves.bottomRightBorderBox, curves.bottomRightPaddingBox, curves.bottomLeftBorderBox, curves.bottomLeftPaddingBox);

            case 3:

            default:

                return createPathFromCurves(curves.bottomLeftBorderBox, curves.bottomLeftPaddingBox, curves.topLeftBorderBox, curves.topLeftPaddingBox);

        }

    };

    var createPathFromCurves = function (outer1, inner1, outer2, inner2) {

        var path = [];

        if (isBezierCurve(outer1)) {

            path.push(outer1.subdivide(0.5, false));

        }

        else {

            path.push(outer1);

        }

        if (isBezierCurve(outer2)) {

            path.push(outer2.subdivide(0.5, true));

        }

        else {

            path.push(outer2);

        }

        if (isBezierCurve(inner2)) {

            path.push(inner2.subdivide(0.5, true).reverse());

        }

        else {

            path.push(inner2);

        }

        if (isBezierCurve(inner1)) {

            path.push(inner1.subdivide(0.5, false).reverse());

        }

        else {

            path.push(inner1);

        }

        return path;

    };



    var paddingBox = function (element) {

        var bounds = element.bounds;

        var styles = element.styles;

        return bounds.add(styles.borderLeftWidth, styles.borderTopWidth, -(styles.borderRightWidth + styles.borderLeftWidth), -(styles.borderTopWidth + styles.borderBottomWidth));

    };

    var contentBox = function (element) {

        var styles = element.styles;

        var bounds = element.bounds;

        var paddingLeft = getAbsoluteValue(styles.paddingLeft, bounds.width);

        var paddingRight = getAbsoluteValue(styles.paddingRight, bounds.width);

        var paddingTop = getAbsoluteValue(styles.paddingTop, bounds.width);

        var paddingBottom = getAbsoluteValue(styles.paddingBottom, bounds.width);

        return bounds.add(paddingLeft + styles.borderLeftWidth, paddingTop + styles.borderTopWidth, -(styles.borderRightWidth + styles.borderLeftWidth + paddingLeft + paddingRight), -(styles.borderTopWidth + styles.borderBottomWidth + paddingTop + paddingBottom));

    };



    var calculateBackgroundPositioningArea = function (backgroundOrigin, element) {

        if (backgroundOrigin === 0 /* BORDER_BOX */) {

            return element.bounds;

        }

        if (backgroundOrigin === 2 /* CONTENT_BOX */) {

            return contentBox(element);

        }

        return paddingBox(element);

    };

    var calculateBackgroundPaintingArea = function (backgroundClip, element) {

        if (backgroundClip === BACKGROUND_CLIP.BORDER_BOX) {

            return element.bounds;

        }

        if (backgroundClip === BACKGROUND_CLIP.CONTENT_BOX) {

            return contentBox(element);

        }

        return paddingBox(element);

    };

    var calculateBackgroundRendering = function (container, index, intrinsicSize) {

        var backgroundPositioningArea = calculateBackgroundPositioningArea(getBackgroundValueForIndex(container.styles.backgroundOrigin, index), container);

        var backgroundPaintingArea = calculateBackgroundPaintingArea(getBackgroundValueForIndex(container.styles.backgroundClip, index), container);

        var backgroundImageSize = calculateBackgroundSize(getBackgroundValueForIndex(container.styles.backgroundSize, index), intrinsicSize, backgroundPositioningArea);

        var sizeWidth = backgroundImageSize[0], sizeHeight = backgroundImageSize[1];

        var position = getAbsoluteValueForTuple(getBackgroundValueForIndex(container.styles.backgroundPosition, index), backgroundPositioningArea.width - sizeWidth, backgroundPositioningArea.height - sizeHeight);

        var path = calculateBackgroundRepeatPath(getBackgroundValueForIndex(container.styles.backgroundRepeat, index), position, backgroundImageSize, backgroundPositioningArea, backgroundPaintingArea);

        var offsetX = Math.round(backgroundPositioningArea.left + position[0]);

        var offsetY = Math.round(backgroundPositioningArea.top + position[1]);

        return [path, offsetX, offsetY, sizeWidth, sizeHeight];

    };

    var isAuto = function (token) { return isIdentToken(token) && token.value === BACKGROUND_SIZE.AUTO; };

    var hasIntrinsicValue = function (value) { return typeof value === 'number'; };

    var calculateBackgroundSize = function (size, _a, bounds) {

        var intrinsicWidth = _a[0], intrinsicHeight = _a[1], intrinsicProportion = _a[2];

        var first = size[0], second = size[1];

        if (isLengthPercentage(first) && second && isLengthPercentage(second)) {

            return [getAbsoluteValue(first, bounds.width), getAbsoluteValue(second, bounds.height)];

        }

        var hasIntrinsicProportion = hasIntrinsicValue(intrinsicProportion);

        if (isIdentToken(first) && (first.value === BACKGROUND_SIZE.CONTAIN || first.value === BACKGROUND_SIZE.COVER)) {

            if (hasIntrinsicValue(intrinsicProportion)) {

                var targetRatio = bounds.width / bounds.height;

                return targetRatio < intrinsicProportion !== (first.value === BACKGROUND_SIZE.COVER)

                    ? [bounds.width, bounds.width / intrinsicProportion]

                    : [bounds.height * intrinsicProportion, bounds.height];

            }

            return [bounds.width, bounds.height];

        }

        var hasIntrinsicWidth = hasIntrinsicValue(intrinsicWidth);

        var hasIntrinsicHeight = hasIntrinsicValue(intrinsicHeight);

        var hasIntrinsicDimensions = hasIntrinsicWidth || hasIntrinsicHeight;

        // If the background-size is auto or auto auto:

        if (isAuto(first) && (!second || isAuto(second))) {

            // If the image has both horizontal and vertical intrinsic dimensions, it's rendered at that size.

            if (hasIntrinsicWidth && hasIntrinsicHeight) {

                return [intrinsicWidth, intrinsicHeight];

            }

            // If the image has no intrinsic dimensions and has no intrinsic proportions,

            // it's rendered at the size of the background positioning area.

            if (!hasIntrinsicProportion && !hasIntrinsicDimensions) {

                return [bounds.width, bounds.height];

            }

            // TODO If the image has no intrinsic dimensions but has intrinsic proportions, it's rendered as if contain had been specified instead.

            // If the image has only one intrinsic dimension and has intrinsic proportions, it's rendered at the size corresponding to that one dimension.

            // The other dimension is computed using the specified dimension and the intrinsic proportions.

            if (hasIntrinsicDimensions && hasIntrinsicProportion) {

                var width_1 = hasIntrinsicWidth

                    ? intrinsicWidth

                    : intrinsicHeight * intrinsicProportion;

                var height_1 = hasIntrinsicHeight

                    ? intrinsicHeight

                    : intrinsicWidth / intrinsicProportion;

                return [width_1, height_1];

            }

            // If the image has only one intrinsic dimension but has no intrinsic proportions,

            // it's rendered using the specified dimension and the other dimension of the background positioning area.

            var width_2 = hasIntrinsicWidth ? intrinsicWidth : bounds.width;

            var height_2 = hasIntrinsicHeight ? intrinsicHeight : bounds.height;

            return [width_2, height_2];

        }

        // If the image has intrinsic proportions, it's stretched to the specified dimension.

        // The unspecified dimension is computed using the specified dimension and the intrinsic proportions.

        if (hasIntrinsicProportion) {

            var width_3 = 0;

            var height_3 = 0;

            if (isLengthPercentage(first)) {

                width_3 = getAbsoluteValue(first, bounds.width);

            }

            else if (isLengthPercentage(second)) {

                height_3 = getAbsoluteValue(second, bounds.height);

            }

            if (isAuto(first)) {

                width_3 = height_3 * intrinsicProportion;

            }

            else if (!second || isAuto(second)) {

                height_3 = width_3 / intrinsicProportion;

            }

            return [width_3, height_3];

        }

        // If the image has no intrinsic proportions, it's stretched to the specified dimension.

        // The unspecified dimension is computed using the image's corresponding intrinsic dimension,

        // if there is one. If there is no such intrinsic dimension,

        // it becomes the corresponding dimension of the background positioning area.

        var width = null;

        var height = null;

        if (isLengthPercentage(first)) {

            width = getAbsoluteValue(first, bounds.width);

        }

        else if (second && isLengthPercentage(second)) {

            height = getAbsoluteValue(second, bounds.height);

        }

        if (width !== null && (!second || isAuto(second))) {

            height =

                hasIntrinsicWidth && hasIntrinsicHeight

                    ? (width / intrinsicWidth) * intrinsicHeight

                    : bounds.height;

        }

        if (height !== null && isAuto(first)) {

            width =

                hasIntrinsicWidth && hasIntrinsicHeight

                    ? (height / intrinsicHeight) * intrinsicWidth

                    : bounds.width;

        }

        if (width !== null && height !== null) {

            return [width, height];

        }

        throw new Error("Unable to calculate background-size for element");

    };

    var getBackgroundValueForIndex = function (values, index) {

        var value = values[index];

        if (typeof value === 'undefined') {

            return values[0];

        }

        return value;

    };

    var calculateBackgroundRepeatPath = function (repeat, _a, _b, backgroundPositioningArea, backgroundPaintingArea) {

        var x = _a[0], y = _a[1];

        var width = _b[0], height = _b[1];

        switch (repeat) {

            case BACKGROUND_REPEAT.REPEAT_X:

                return [

                    new Vector(Math.round(backgroundPositioningArea.left), Math.round(backgroundPositioningArea.top + y)),

                    new Vector(Math.round(backgroundPositioningArea.left + backgroundPositioningArea.width), Math.round(backgroundPositioningArea.top + y)),

                    new Vector(Math.round(backgroundPositioningArea.left + backgroundPositioningArea.width), Math.round(height + backgroundPositioningArea.top + y)),

                    new Vector(Math.round(backgroundPositioningArea.left), Math.round(height + backgroundPositioningArea.top + y))

                ];

            case BACKGROUND_REPEAT.REPEAT_Y:

                return [

                    new Vector(Math.round(backgroundPositioningArea.left + x), Math.round(backgroundPositioningArea.top)),

                    new Vector(Math.round(backgroundPositioningArea.left + x + width), Math.round(backgroundPositioningArea.top)),

                    new Vector(Math.round(backgroundPositioningArea.left + x + width), Math.round(backgroundPositioningArea.height + backgroundPositioningArea.top)),

                    new Vector(Math.round(backgroundPositioningArea.left + x), Math.round(backgroundPositioningArea.height + backgroundPositioningArea.top))

                ];

            case BACKGROUND_REPEAT.NO_REPEAT:

                return [

                    new Vector(Math.round(backgroundPositioningArea.left + x), Math.round(backgroundPositioningArea.top + y)),

                    new Vector(Math.round(backgroundPositioningArea.left + x + width), Math.round(backgroundPositioningArea.top + y)),

                    new Vector(Math.round(backgroundPositioningArea.left + x + width), Math.round(backgroundPositioningArea.top + y + height)),

                    new Vector(Math.round(backgroundPositioningArea.left + x), Math.round(backgroundPositioningArea.top + y + height))

                ];

            default:

                return [

                    new Vector(Math.round(backgroundPaintingArea.left), Math.round(backgroundPaintingArea.top)),

                    new Vector(Math.round(backgroundPaintingArea.left + backgroundPaintingArea.width), Math.round(backgroundPaintingArea.top)),

                    new Vector(Math.round(backgroundPaintingArea.left + backgroundPaintingArea.width), Math.round(backgroundPaintingArea.height + backgroundPaintingArea.top)),

                    new Vector(Math.round(backgroundPaintingArea.left), Math.round(backgroundPaintingArea.height + backgroundPaintingArea.top))

                ];

        }

    };



    var SMALL_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';



    var SAMPLE_TEXT = 'Hidden Text';

    var FontMetrics = /** @class */ (function () {

        function FontMetrics(document) {

            this._data = {};

            this._document = document;

        }

        FontMetrics.prototype.parseMetrics = function (fontFamily, fontSize) {

            var container = this._document.createElement('div');

            var img = this._document.createElement('img');

            var span = this._document.createElement('span');

            var body = this._document.body;

            container.style.visibility = 'hidden';

            container.style.fontFamily = fontFamily;

            container.style.fontSize = fontSize;

            container.style.margin = '0';

            container.style.padding = '0';

            body.appendChild(container);

            img.src = SMALL_IMAGE;

            img.width = 1;

            img.height = 1;

            img.style.margin = '0';

            img.style.padding = '0';

            img.style.verticalAlign = 'baseline';

            span.style.fontFamily = fontFamily;

            span.style.fontSize = fontSize;

            span.style.margin = '0';

            span.style.padding = '0';

            span.appendChild(this._document.createTextNode(SAMPLE_TEXT));

            container.appendChild(span);

            container.appendChild(img);

            var baseline = img.offsetTop - span.offsetTop + 2;

            container.removeChild(span);

            container.appendChild(this._document.createTextNode(SAMPLE_TEXT));

            container.style.lineHeight = 'normal';

            img.style.verticalAlign = 'super';

            var middle = img.offsetTop - container.offsetTop + 2;

            body.removeChild(container);

            return { baseline: baseline, middle: middle };

        };

        FontMetrics.prototype.getMetrics = function (fontFamily, fontSize) {

            var key = fontFamily + " " + fontSize;

            if (typeof this._data[key] === 'undefined') {

                this._data[key] = this.parseMetrics(fontFamily, fontSize);

            }

            return this._data[key];

        };

        return FontMetrics;

    }());



    var MASK_OFFSET = 10000;

    var CanvasRenderer = /** @class */ (function () {

        function CanvasRenderer(options) {

            this._activeEffects = [];

            this.canvas = options.canvas ? options.canvas : document.createElement('canvas');

            this.ctx = this.canvas.getContext('2d');

            this.options = options;

            this.canvas.width = Math.floor(options.width * options.scale);

            this.canvas.height = Math.floor(options.height * options.scale);

            this.canvas.style.width = options.width + "px";

            this.canvas.style.height = options.height + "px";

            this.fontMetrics = new FontMetrics(document);

            this.ctx.scale(this.options.scale, this.options.scale);

            this.ctx.translate(-options.x + options.scrollX, -options.y + options.scrollY);

            this.ctx.textBaseline = 'bottom';

            this._activeEffects = [];

            Logger.getInstance(options.id).debug("Canvas renderer initialized (" + options.width + "x" + options.height + " at " + options.x + "," + options.y + ") with scale " + options.scale);

        }

        CanvasRenderer.prototype.applyEffects = function (effects, target) {

            var _this = this;

            while (this._activeEffects.length) {

                this.popEffect();

            }

            effects.filter(function (effect) { return contains(effect.target, target); }).forEach(function (effect) { return _this.applyEffect(effect); });

        };

        CanvasRenderer.prototype.applyEffect = function (effect) {

            this.ctx.save();

            if (isTransformEffect(effect)) {

                this.ctx.translate(effect.offsetX, effect.offsetY);

                this.ctx.transform(effect.matrix[0], effect.matrix[1], effect.matrix[2], effect.matrix[3], effect.matrix[4], effect.matrix[5]);

                this.ctx.translate(-effect.offsetX, -effect.offsetY);

            }

            if (isClipEffect(effect)) {

                this.path(effect.path);

                this.ctx.clip();

            }

            this._activeEffects.push(effect);

        };

        CanvasRenderer.prototype.popEffect = function () {

            this._activeEffects.pop();

            this.ctx.restore();

        };

        CanvasRenderer.prototype.renderStack = function (stack) {

            return __awaiter(this, void 0, void 0, function () {

                var styles;

                return __generator(this, function (_a) {

                    switch (_a.label) {

                        case 0:

                            styles = stack.element.container.styles;

                            if (!styles.isVisible()) return [3 /*break*/, 2];

                            this.ctx.globalAlpha = styles.opacity;

                            return [4 /*yield*/, this.renderStackContent(stack)];

                        case 1:

                            _a.sent();

                            _a.label = 2;

                        case 2: return [2 /*return*/];

                    }

                });

            });

        };

        CanvasRenderer.prototype.renderNode = function (paint) {

            return __awaiter(this, void 0, void 0, function () {

                return __generator(this, function (_a) {

                    switch (_a.label) {

                        case 0:

                            if (!paint.container.styles.isVisible()) return [3 /*break*/, 3];

                            return [4 /*yield*/, this.renderNodeBackgroundAndBorders(paint)];

                        case 1:

                            _a.sent();

                            return [4 /*yield*/, this.renderNodeContent(paint)];

                        case 2:

                            _a.sent();

                            _a.label = 3;

                        case 3: return [2 /*return*/];

                    }

                });

            });

        };

        CanvasRenderer.prototype.renderTextWithLetterSpacing = function (text, letterSpacing) {

            var _this = this;

            if (letterSpacing === 0) {

                this.ctx.fillText(text.text, text.bounds.left, text.bounds.top + text.bounds.height);

            }

            else {

                var letters = toCodePoints(text.text).map(function (i) { return fromCodePoint(i); });

                letters.reduce(function (left, letter) {

                    _this.ctx.fillText(letter, left, text.bounds.top + text.bounds.height);

                    return left + _this.ctx.measureText(letter).width;

                }, text.bounds.left);

            }

        };

        CanvasRenderer.prototype.createFontStyle = function (styles) {

            var fontVariant = styles.fontVariant

                .filter(function (variant) { return variant === 'normal' || variant === 'small-caps'; })

                .join('');

            var fontFamily = styles.fontFamily.join(', ');

            var fontSize = isDimensionToken(styles.fontSize)

                ? "" + styles.fontSize.number + styles.fontSize.unit

                : styles.fontSize.number + "px";

            return [

                [styles.fontStyle, fontVariant, styles.fontWeight, fontSize, fontFamily].join(' '),

                fontFamily,

                fontSize

            ];

        };

        CanvasRenderer.prototype.renderTextNode = function (text, styles) {

            return __awaiter(this, void 0, void 0, function () {

                var _a, font, fontFamily, fontSize;

                var _this = this;

                return __generator(this, function (_b) {

                    _a = this.createFontStyle(styles), font = _a[0], fontFamily = _a[1], fontSize = _a[2];

                    this.ctx.font = font;

                    text.textBounds.forEach(function (text) {

                        _this.ctx.fillStyle = asString(styles.color);

                        _this.renderTextWithLetterSpacing(text, styles.letterSpacing);

                        var textShadows = styles.textShadow;

                        if (textShadows.length && text.text.trim().length) {

                            textShadows

                                .slice(0)

                                .reverse()

                                .forEach(function (textShadow) {

                                    _this.ctx.shadowColor = asString(textShadow.color);

                                    _this.ctx.shadowOffsetX = textShadow.offsetX.number * _this.options.scale;

                                    _this.ctx.shadowOffsetY = textShadow.offsetY.number * _this.options.scale;

                                    _this.ctx.shadowBlur = textShadow.blur.number;

                                    _this.ctx.fillText(text.text, text.bounds.left, text.bounds.top + text.bounds.height);

                                });

                            _this.ctx.shadowColor = '';

                            _this.ctx.shadowOffsetX = 0;

                            _this.ctx.shadowOffsetY = 0;

                            _this.ctx.shadowBlur = 0;

                        }

                        if (styles.textDecorationLine.length) {

                            _this.ctx.fillStyle = asString(styles.textDecorationColor || styles.color);

                            styles.textDecorationLine.forEach(function (textDecorationLine) {

                                switch (textDecorationLine) {

                                    case 1 /* UNDERLINE */:

                                        // Draws a line at the baseline of the font

                                        // TODO As some browsers display the line as more than 1px if the font-size is big,

                                        // need to take that into account both in position and size

                                        var baseline = _this.fontMetrics.getMetrics(fontFamily, fontSize).baseline;

                                        _this.ctx.fillRect(text.bounds.left, Math.round(text.bounds.top + baseline), text.bounds.width, 1);

                                        break;

                                    case 2 /* OVERLINE */:

                                        _this.ctx.fillRect(text.bounds.left, Math.round(text.bounds.top), text.bounds.width, 1);

                                        break;

                                    case 3 /* LINE_THROUGH */:

                                        // TODO try and find exact position for line-through

                                        var middle = _this.fontMetrics.getMetrics(fontFamily, fontSize).middle;

                                        _this.ctx.fillRect(text.bounds.left, Math.ceil(text.bounds.top + middle), text.bounds.width, 1);

                                        break;

                                }

                            });

                        }

                    });

                    return [2 /*return*/];

                });

            });

        };

        CanvasRenderer.prototype.renderReplacedElement = function (container, curves, image) {

            if (image && container.intrinsicWidth > 0 && container.intrinsicHeight > 0) {

                var box = contentBox(container);

                var path = calculatePaddingBoxPath(curves);

                this.path(path);

                this.ctx.save();

                this.ctx.clip();

                this.ctx.drawImage(image, 0, 0, container.intrinsicWidth, container.intrinsicHeight, box.left, box.top, box.width, box.height);

                this.ctx.restore();

            }

        };

        CanvasRenderer.prototype.renderNodeContent = function (paint) {

            return __awaiter(this, void 0, void 0, function () {

                var container, curves, styles, _i, _a, child, image, e_1, image, e_2, iframeRenderer, canvas, size, bounds, x, textBounds, img, image, url, e_3, bounds;

                return __generator(this, function (_b) {

                    switch (_b.label) {

                        case 0:

                            this.applyEffects(paint.effects, 4 /* CONTENT */);

                            container = paint.container;

                            curves = paint.curves;

                            styles = container.styles;

                            _i = 0, _a = container.textNodes;

                            _b.label = 1;

                        case 1:

                            if (!(_i < _a.length)) return [3 /*break*/, 4];

                            child = _a[_i];

                            return [4 /*yield*/, this.renderTextNode(child, styles)];

                        case 2:

                            _b.sent();

                            _b.label = 3;

                        case 3:

                            _i++;

                            return [3 /*break*/, 1];

                        case 4:

                            if (!(container instanceof ImageElementContainer)) return [3 /*break*/, 8];

                            _b.label = 5;

                        case 5:

                            _b.trys.push([5, 7, , 8]);

                            return [4 /*yield*/, this.options.cache.match(container.src)];

                        case 6:

                            image = _b.sent();

                            this.renderReplacedElement(container, curves, image);

                            return [3 /*break*/, 8];

                        case 7:

                            e_1 = _b.sent();

                            Logger.getInstance(this.options.id).error("Error loading image " + container.src);

                            return [3 /*break*/, 8];

                        case 8:

                            if (container instanceof CanvasElementContainer) {

                                this.renderReplacedElement(container, curves, container.canvas);

                            }

                            if (!(container instanceof SVGElementContainer)) return [3 /*break*/, 12];

                            _b.label = 9;

                        case 9:

                            _b.trys.push([9, 11, , 12]);

                            return [4 /*yield*/, this.options.cache.match(container.svg)];

                        case 10:

                            image = _b.sent();

                            this.renderReplacedElement(container, curves, image);

                            return [3 /*break*/, 12];

                        case 11:

                            e_2 = _b.sent();

                            Logger.getInstance(this.options.id).error("Error loading svg " + container.svg.substring(0, 255));

                            return [3 /*break*/, 12];

                        case 12:

                            if (!(container instanceof IFrameElementContainer && container.tree)) return [3 /*break*/, 14];

                            iframeRenderer = new CanvasRenderer({

                                id: this.options.id,

                                scale: this.options.scale,

                                backgroundColor: container.backgroundColor,

                                x: 0,

                                y: 0,

                                scrollX: 0,

                                scrollY: 0,

                                width: container.width,

                                height: container.height,

                                cache: this.options.cache,

                                windowWidth: container.width,

                                windowHeight: container.height

                            });

                            return [4 /*yield*/, iframeRenderer.render(container.tree)];

                        case 13:

                            canvas = _b.sent();

                            if (container.width && container.height) {

                                this.ctx.drawImage(canvas, 0, 0, container.width, container.height, container.bounds.left, container.bounds.top, container.bounds.width, container.bounds.height);

                            }

                            _b.label = 14;

                        case 14:

                            if (container instanceof InputElementContainer) {

                                size = Math.min(container.bounds.width, container.bounds.height);

                                if (container.type === CHECKBOX) {

                                    if (container.checked) {

                                        this.ctx.save();

                                        this.path([

                                            new Vector(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79),

                                            new Vector(container.bounds.left + size * 0.16, container.bounds.top + size * 0.5549),

                                            new Vector(container.bounds.left + size * 0.27347, container.bounds.top + size * 0.44071),

                                            new Vector(container.bounds.left + size * 0.39694, container.bounds.top + size * 0.5649),

                                            new Vector(container.bounds.left + size * 0.72983, container.bounds.top + size * 0.23),

                                            new Vector(container.bounds.left + size * 0.84, container.bounds.top + size * 0.34085),

                                            new Vector(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79)

                                        ]);

                                        this.ctx.fillStyle = asString(INPUT_COLOR);

                                        this.ctx.fill();

                                        this.ctx.restore();

                                    }

                                }

                                else if (container.type === RADIO) {

                                    if (container.checked) {

                                        this.ctx.save();

                                        this.ctx.beginPath();

                                        this.ctx.arc(container.bounds.left + size / 2, container.bounds.top + size / 2, size / 4, 0, Math.PI * 2, true);

                                        this.ctx.fillStyle = asString(INPUT_COLOR);

                                        this.ctx.fill();

                                        this.ctx.restore();

                                    }

                                }

                            }

                            if (isTextInputElement(container) && container.value.length) {

                                this.ctx.font = this.createFontStyle(styles)[0];

                                this.ctx.fillStyle = asString(styles.color);

                                this.ctx.textBaseline = 'middle';

                                this.ctx.textAlign = canvasTextAlign(container.styles.textAlign);

                                bounds = contentBox(container);

                                x = 0;

                                switch (container.styles.textAlign) {

                                    case TEXT_ALIGN.CENTER:

                                        x += bounds.width / 2;

                                        break;

                                    case TEXT_ALIGN.RIGHT:

                                        x += bounds.width;

                                        break;

                                }

                                textBounds = bounds.add(x, 0, 0, -bounds.height / 2 + 1);

                                this.ctx.save();

                                this.path([

                                    new Vector(bounds.left, bounds.top),

                                    new Vector(bounds.left + bounds.width, bounds.top),

                                    new Vector(bounds.left + bounds.width, bounds.top + bounds.height),

                                    new Vector(bounds.left, bounds.top + bounds.height)

                                ]);

                                this.ctx.clip();

                                this.renderTextWithLetterSpacing(new TextBounds(container.value, textBounds), styles.letterSpacing);

                                this.ctx.restore();

                                this.ctx.textBaseline = 'bottom';

                                this.ctx.textAlign = 'left';

                            }

                            if (!contains(container.styles.display, 2048 /* LIST_ITEM */)) return [3 /*break*/, 20];

                            if (!(container.styles.listStyleImage !== null)) return [3 /*break*/, 19];

                            img = container.styles.listStyleImage;

                            if (!(img.type === CSSImageType.URL)) return [3 /*break*/, 18];

                            image = void 0;

                            url = img.url;

                            _b.label = 15;

                        case 15:

                            _b.trys.push([15, 17, , 18]);

                            return [4 /*yield*/, this.options.cache.match(url)];

                        case 16:

                            image = _b.sent();

                            this.ctx.drawImage(image, container.bounds.left - (image.width + 10), container.bounds.top);

                            return [3 /*break*/, 18];

                        case 17:

                            e_3 = _b.sent();

                            Logger.getInstance(this.options.id).error("Error loading list-style-image " + url);

                            return [3 /*break*/, 18];

                        case 18: return [3 /*break*/, 20];

                        case 19:

                            if (paint.listValue && container.styles.listStyleType !== LIST_STYLE_TYPE.NONE) {

                                this.ctx.font = this.createFontStyle(styles)[0];

                                this.ctx.fillStyle = asString(styles.color);

                                this.ctx.textBaseline = 'middle';

                                this.ctx.textAlign = 'right';

                                bounds = new Bounds(container.bounds.left, container.bounds.top + getAbsoluteValue(container.styles.paddingTop, container.bounds.width), container.bounds.width, computeLineHeight(styles.lineHeight, styles.fontSize.number) / 2 + 1);

                                this.renderTextWithLetterSpacing(new TextBounds(paint.listValue, bounds), styles.letterSpacing);

                                this.ctx.textBaseline = 'bottom';

                                this.ctx.textAlign = 'left';

                            }

                            _b.label = 20;

                        case 20: return [2 /*return*/];

                    }

                });

            });

        };

        CanvasRenderer.prototype.renderStackContent = function (stack) {

            return __awaiter(this, void 0, void 0, function () {

                var _i, _a, child, _b, _c, child, _d, _e, child, _f, _g, child, _h, _j, child, _k, _l, child, _m, _o, child;

                return __generator(this, function (_p) {

                    switch (_p.label) {

                        case 0:

                            // https://www.w3.org/TR/css-position-3/#painting-order

                            // 1. the background and borders of the element forming the stacking context.

                            return [4 /*yield*/, this.renderNodeBackgroundAndBorders(stack.element)];

                        case 1:

                            // https://www.w3.org/TR/css-position-3/#painting-order

                            // 1. the background and borders of the element forming the stacking context.

                            _p.sent();

                            _i = 0, _a = stack.negativeZIndex;

                            _p.label = 2;

                        case 2:

                            if (!(_i < _a.length)) return [3 /*break*/, 5];

                            child = _a[_i];

                            return [4 /*yield*/, this.renderStack(child)];

                        case 3:

                            _p.sent();

                            _p.label = 4;

                        case 4:

                            _i++;

                            return [3 /*break*/, 2];

                        case 5:

                            // 3. For all its in-flow, non-positioned, block-level descendants in tree order:

                            return [4 /*yield*/, this.renderNodeContent(stack.element)];

                        case 6:

                            // 3. For all its in-flow, non-positioned, block-level descendants in tree order:

                            _p.sent();

                            _b = 0, _c = stack.nonInlineLevel;

                            _p.label = 7;

                        case 7:

                            if (!(_b < _c.length)) return [3 /*break*/, 10];

                            child = _c[_b];

                            return [4 /*yield*/, this.renderNode(child)];

                        case 8:

                            _p.sent();

                            _p.label = 9;

                        case 9:

                            _b++;

                            return [3 /*break*/, 7];

                        case 10:

                            _d = 0, _e = stack.nonPositionedFloats;

                            _p.label = 11;

                        case 11:

                            if (!(_d < _e.length)) return [3 /*break*/, 14];

                            child = _e[_d];

                            return [4 /*yield*/, this.renderStack(child)];

                        case 12:

                            _p.sent();

                            _p.label = 13;

                        case 13:

                            _d++;

                            return [3 /*break*/, 11];

                        case 14:

                            _f = 0, _g = stack.nonPositionedInlineLevel;

                            _p.label = 15;

                        case 15:

                            if (!(_f < _g.length)) return [3 /*break*/, 18];

                            child = _g[_f];

                            return [4 /*yield*/, this.renderStack(child)];

                        case 16:

                            _p.sent();

                            _p.label = 17;

                        case 17:

                            _f++;

                            return [3 /*break*/, 15];

                        case 18:

                            _h = 0, _j = stack.inlineLevel;

                            _p.label = 19;

                        case 19:

                            if (!(_h < _j.length)) return [3 /*break*/, 22];

                            child = _j[_h];

                            return [4 /*yield*/, this.renderNode(child)];

                        case 20:

                            _p.sent();

                            _p.label = 21;

                        case 21:

                            _h++;

                            return [3 /*break*/, 19];

                        case 22:

                            _k = 0, _l = stack.zeroOrAutoZIndexOrTransformedOrOpacity;

                            _p.label = 23;

                        case 23:

                            if (!(_k < _l.length)) return [3 /*break*/, 26];

                            child = _l[_k];

                            return [4 /*yield*/, this.renderStack(child)];

                        case 24:

                            _p.sent();

                            _p.label = 25;

                        case 25:

                            _k++;

                            return [3 /*break*/, 23];

                        case 26:

                            _m = 0, _o = stack.positiveZIndex;

                            _p.label = 27;

                        case 27:

                            if (!(_m < _o.length)) return [3 /*break*/, 30];

                            child = _o[_m];

                            return [4 /*yield*/, this.renderStack(child)];

                        case 28:

                            _p.sent();

                            _p.label = 29;

                        case 29:

                            _m++;

                            return [3 /*break*/, 27];

                        case 30: return [2 /*return*/];

                    }

                });

            });

        };

        CanvasRenderer.prototype.mask = function (paths) {

            this.ctx.beginPath();

            this.ctx.moveTo(0, 0);

            this.ctx.lineTo(this.canvas.width, 0);

            this.ctx.lineTo(this.canvas.width, this.canvas.height);

            this.ctx.lineTo(0, this.canvas.height);

            this.ctx.lineTo(0, 0);

            this.formatPath(paths.slice(0).reverse());

            this.ctx.closePath();

        };

        CanvasRenderer.prototype.path = function (paths) {

            this.ctx.beginPath();

            this.formatPath(paths);

            this.ctx.closePath();

        };

        CanvasRenderer.prototype.formatPath = function (paths) {

            var _this = this;

            paths.forEach(function (point, index) {

                var start = isBezierCurve(point) ? point.start : point;

                if (index === 0) {

                    _this.ctx.moveTo(start.x, start.y);

                }

                else {

                    _this.ctx.lineTo(start.x, start.y);

                }

                if (isBezierCurve(point)) {

                    _this.ctx.bezierCurveTo(point.startControl.x, point.startControl.y, point.endControl.x, point.endControl.y, point.end.x, point.end.y);

                }

            });

        };

        CanvasRenderer.prototype.renderRepeat = function (path, pattern, offsetX, offsetY) {

            this.path(path);

            this.ctx.fillStyle = pattern;

            this.ctx.translate(offsetX, offsetY);

            this.ctx.fill();

            this.ctx.translate(-offsetX, -offsetY);

        };

        CanvasRenderer.prototype.resizeImage = function (image, width, height) {

            if (image.width === width && image.height === height) {

                return image;

            }

            var canvas = this.canvas.ownerDocument.createElement('canvas');

            canvas.width = width;

            canvas.height = height;

            var ctx = canvas.getContext('2d');

            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);

            return canvas;

        };

        CanvasRenderer.prototype.renderBackgroundImage = function (container) {

            return __awaiter(this, void 0, void 0, function () {

                var index, _loop_1, this_1, _i, _a, backgroundImage;

                return __generator(this, function (_b) {

                    switch (_b.label) {

                        case 0:

                            index = container.styles.backgroundImage.length - 1;

                            _loop_1 = function (backgroundImage) {

                                var image, url, e_4, _a, path, x, y, width, height, pattern, _b, path, x, y, width, height, _c, lineLength, x0, x1, y0, y1, canvas, ctx, gradient_1, pattern, _d, path, left, top_1, width, height, position, x, y, _e, rx, ry, radialGradient_1, midX, midY, f, invF;

                                return __generator(this, function (_f) {

                                    switch (_f.label) {

                                        case 0:

                                            if (!(backgroundImage.type === CSSImageType.URL)) return [3 /*break*/, 5];

                                            image = void 0;

                                            url = backgroundImage.url;

                                            _f.label = 1;

                                        case 1:

                                            _f.trys.push([1, 3, , 4]);

                                            return [4 /*yield*/, this_1.options.cache.match(url)];

                                        case 2:

                                            image = _f.sent();

                                            return [3 /*break*/, 4];

                                        case 3:

                                            e_4 = _f.sent();

                                            Logger.getInstance(this_1.options.id).error("Error loading background-image " + url);

                                            return [3 /*break*/, 4];

                                        case 4:

                                            if (image) {

                                                _a = calculateBackgroundRendering(container, index, [

                                                    image.width,

                                                    image.height,

                                                    image.width / image.height

                                                ]), path = _a[0], x = _a[1], y = _a[2], width = _a[3], height = _a[4];

                                                pattern = this_1.ctx.createPattern(this_1.resizeImage(image, width, height), 'repeat');

                                                this_1.renderRepeat(path, pattern, x, y);

                                            }

                                            return [3 /*break*/, 6];

                                        case 5:

                                            if (isLinearGradient(backgroundImage)) {

                                                _b = calculateBackgroundRendering(container, index, [null, null, null]), path = _b[0], x = _b[1], y = _b[2], width = _b[3], height = _b[4];

                                                _c = calculateGradientDirection(backgroundImage.angle, width, height), lineLength = _c[0], x0 = _c[1], x1 = _c[2], y0 = _c[3], y1 = _c[4];

                                                canvas = document.createElement('canvas');

                                                canvas.width = width;

                                                canvas.height = height;

                                                ctx = canvas.getContext('2d');

                                                gradient_1 = ctx.createLinearGradient(x0, y0, x1, y1);

                                                processColorStops(backgroundImage.stops, lineLength).forEach(function (colorStop) {

                                                    return gradient_1.addColorStop(colorStop.stop, asString(colorStop.color));

                                                });

                                                ctx.fillStyle = gradient_1;

                                                ctx.fillRect(0, 0, width, height);

                                                pattern = this_1.ctx.createPattern(canvas, 'repeat');

                                                this_1.renderRepeat(path, pattern, x, y);

                                            }

                                            else if (isRadialGradient(backgroundImage)) {

                                                _d = calculateBackgroundRendering(container, index, [

                                                    null,

                                                    null,

                                                    null

                                                ]), path = _d[0], left = _d[1], top_1 = _d[2], width = _d[3], height = _d[4];

                                                position = backgroundImage.position.length === 0 ? [FIFTY_PERCENT] : backgroundImage.position;

                                                x = getAbsoluteValue(position[0], width);

                                                y = getAbsoluteValue(position[position.length - 1], height);

                                                _e = calculateRadius(backgroundImage, x, y, width, height), rx = _e[0], ry = _e[1];

                                                if (rx > 0 && rx > 0) {

                                                    radialGradient_1 = this_1.ctx.createRadialGradient(left + x, top_1 + y, 0, left + x, top_1 + y, rx);

                                                    processColorStops(backgroundImage.stops, rx * 2).forEach(function (colorStop) {

                                                        return radialGradient_1.addColorStop(colorStop.stop, asString(colorStop.color));

                                                    });

                                                    this_1.path(path);

                                                    this_1.ctx.fillStyle = radialGradient_1;

                                                    if (rx !== ry) {

                                                        midX = container.bounds.left + 0.5 * container.bounds.width;

                                                        midY = container.bounds.top + 0.5 * container.bounds.height;

                                                        f = ry / rx;

                                                        invF = 1 / f;

                                                        this_1.ctx.save();

                                                        this_1.ctx.translate(midX, midY);

                                                        this_1.ctx.transform(1, 0, 0, f, 0, 0);

                                                        this_1.ctx.translate(-midX, -midY);

                                                        this_1.ctx.fillRect(left, invF * (top_1 - midY) + midY, width, height * invF);

                                                        this_1.ctx.restore();

                                                    }

                                                    else {

                                                        this_1.ctx.fill();

                                                    }

                                                }

                                            }

                                            _f.label = 6;

                                        case 6:

                                            index--;

                                            return [2 /*return*/];

                                    }

                                });

                            };

                            this_1 = this;

                            _i = 0, _a = container.styles.backgroundImage.slice(0).reverse();

                            _b.label = 1;

                        case 1:

                            if (!(_i < _a.length)) return [3 /*break*/, 4];

                            backgroundImage = _a[_i];

                            return [5 /*yield**/, _loop_1(backgroundImage)];

                        case 2:

                            _b.sent();

                            _b.label = 3;

                        case 3:

                            _i++;

                            return [3 /*break*/, 1];

                        case 4: return [2 /*return*/];

                    }

                });

            });

        };

        CanvasRenderer.prototype.renderBorder = function (color, side, curvePoints) {

            return __awaiter(this, void 0, void 0, function () {

                return __generator(this, function (_a) {

                    this.path(parsePathForBorder(curvePoints, side));

                    this.ctx.fillStyle = asString(color);

                    this.ctx.fill();

                    return [2 /*return*/];

                });

            });

        };

        CanvasRenderer.prototype.renderNodeBackgroundAndBorders = function (paint) {

            return __awaiter(this, void 0, void 0, function () {

                var styles, hasBackground, borders, backgroundPaintingArea, side, _i, borders_1, border;

                var _this = this;

                return __generator(this, function (_a) {

                    switch (_a.label) {

                        case 0:

                            this.applyEffects(paint.effects, 2 /* BACKGROUND_BORDERS */);

                            styles = paint.container.styles;

                            hasBackground = !isTransparent(styles.backgroundColor) || styles.backgroundImage.length;

                            borders = [

                                { style: styles.borderTopStyle, color: styles.borderTopColor },

                                { style: styles.borderRightStyle, color: styles.borderRightColor },

                                { style: styles.borderBottomStyle, color: styles.borderBottomColor },

                                { style: styles.borderLeftStyle, color: styles.borderLeftColor }

                            ];

                            backgroundPaintingArea = calculateBackgroundCurvedPaintingArea(getBackgroundValueForIndex(styles.backgroundClip, 0), paint.curves);

                            if (!(hasBackground || styles.boxShadow.length)) return [3 /*break*/, 2];

                            this.ctx.save();

                            this.path(backgroundPaintingArea);

                            this.ctx.clip();

                            if (!isTransparent(styles.backgroundColor)) {

                                this.ctx.fillStyle = asString(styles.backgroundColor);

                                this.ctx.fill();

                            }

                            return [4 /*yield*/, this.renderBackgroundImage(paint.container)];

                        case 1:

                            _a.sent();

                            this.ctx.restore();

                            styles.boxShadow

                                .slice(0)

                                .reverse()

                                .forEach(function (shadow) {

                                    _this.ctx.save();

                                    var borderBoxArea = calculateBorderBoxPath(paint.curves);

                                    var maskOffset = shadow.inset ? 0 : MASK_OFFSET;

                                    var shadowPaintingArea = transformPath(borderBoxArea, -maskOffset + (shadow.inset ? 1 : -1) * shadow.spread.number, (shadow.inset ? 1 : -1) * shadow.spread.number, shadow.spread.number * (shadow.inset ? -2 : 2), shadow.spread.number * (shadow.inset ? -2 : 2));

                                    if (shadow.inset) {

                                        _this.path(borderBoxArea);

                                        _this.ctx.clip();

                                        _this.mask(shadowPaintingArea);

                                    }

                                    else {

                                        _this.mask(borderBoxArea);

                                        _this.ctx.clip();

                                        _this.path(shadowPaintingArea);

                                    }

                                    _this.ctx.shadowOffsetX = shadow.offsetX.number + maskOffset;

                                    _this.ctx.shadowOffsetY = shadow.offsetY.number;

                                    _this.ctx.shadowColor = asString(shadow.color);

                                    _this.ctx.shadowBlur = shadow.blur.number;

                                    _this.ctx.fillStyle = shadow.inset ? asString(shadow.color) : 'rgba(0,0,0,1)';

                                    _this.ctx.fill();

                                    _this.ctx.restore();

                                });

                            _a.label = 2;

                        case 2:

                            side = 0;

                            _i = 0, borders_1 = borders;

                            _a.label = 3;

                        case 3:

                            if (!(_i < borders_1.length)) return [3 /*break*/, 6];

                            border = borders_1[_i];

                            if (!(border.style !== BORDER_STYLE.NONE && !isTransparent(border.color))) return [3 /*break*/, 5];

                            return [4 /*yield*/, this.renderBorder(border.color, side++, paint.curves)];

                        case 4:

                            _a.sent();

                            _a.label = 5;

                        case 5:

                            _i++;

                            return [3 /*break*/, 3];

                        case 6: return [2 /*return*/];

                    }

                });

            });

        };

        CanvasRenderer.prototype.render = function (element) {

            return __awaiter(this, void 0, void 0, function () {

                var stack;

                return __generator(this, function (_a) {

                    switch (_a.label) {

                        case 0:

                            if (this.options.backgroundColor) {

                                this.ctx.fillStyle = asString(this.options.backgroundColor);

                                this.ctx.fillRect(this.options.x - this.options.scrollX, this.options.y - this.options.scrollY, this.options.width, this.options.height);

                            }

                            stack = parseStackingContexts(element);

                            return [4 /*yield*/, this.renderStack(stack)];

                        case 1:

                            _a.sent();

                            this.applyEffects([], 2 /* BACKGROUND_BORDERS */);

                            return [2 /*return*/, this.canvas];

                    }

                });

            });

        };

        return CanvasRenderer;

    }());

    var isTextInputElement = function (container) {

        if (container instanceof TextareaElementContainer) {

            return true;

        }

        else if (container instanceof SelectElementContainer) {

            return true;

        }

        else if (container instanceof InputElementContainer && container.type !== RADIO && container.type !== CHECKBOX) {

            return true;

        }

        return false;

    };

    var calculateBackgroundCurvedPaintingArea = function (clip, curves) {

        switch (clip) {

            case BACKGROUND_CLIP.BORDER_BOX:

                return calculateBorderBoxPath(curves);

            case BACKGROUND_CLIP.CONTENT_BOX:

                return calculateContentBoxPath(curves);

            case BACKGROUND_CLIP.PADDING_BOX:

            default:

                return calculatePaddingBoxPath(curves);

        }

    };

    var canvasTextAlign = function (textAlign) {

        switch (textAlign) {

            case TEXT_ALIGN.CENTER:

                return 'center';

            case TEXT_ALIGN.RIGHT:

                return 'right';

            case TEXT_ALIGN.LEFT:

            default:

                return 'left';

        }

    };



    var ForeignObjectRenderer = /** @class */ (function () {

        function ForeignObjectRenderer(options) {

            this.canvas = options.canvas ? options.canvas : document.createElement('canvas');

            this.ctx = this.canvas.getContext('2d');

            this.options = options;

            this.canvas.width = Math.floor(options.width * options.scale);

            this.canvas.height = Math.floor(options.height * options.scale);

            this.canvas.style.width = options.width + "px";

            this.canvas.style.height = options.height + "px";

            this.ctx.scale(this.options.scale, this.options.scale);

            this.ctx.translate(-options.x + options.scrollX, -options.y + options.scrollY);

            Logger.getInstance(options.id).debug("EXPERIMENTAL ForeignObject renderer initialized (" + options.width + "x" + options.height + " at " + options.x + "," + options.y + ") with scale " + options.scale);

        }

        ForeignObjectRenderer.prototype.render = function (element) {

            return __awaiter(this, void 0, void 0, function () {

                var svg, img;

                return __generator(this, function (_a) {

                    switch (_a.label) {

                        case 0:

                            svg = createForeignObjectSVG(Math.max(this.options.windowWidth, this.options.width) * this.options.scale, Math.max(this.options.windowHeight, this.options.height) * this.options.scale, this.options.scrollX * this.options.scale, this.options.scrollY * this.options.scale, element);

                            return [4 /*yield*/, loadSerializedSVG$1(svg)];

                        case 1:

                            img = _a.sent();

                            if (this.options.backgroundColor) {

                                this.ctx.fillStyle = asString(this.options.backgroundColor);

                                this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale);

                            }

                            this.ctx.drawImage(img, -this.options.x * this.options.scale, -this.options.y * this.options.scale);

                            return [2 /*return*/, this.canvas];

                    }

                });

            });

        };

        return ForeignObjectRenderer;

    }());

    var loadSerializedSVG$1 = function (svg) {

        return new Promise(function (resolve, reject) {

            var img = new Image();

            img.onload = function () {

                resolve(img);

            };

            img.onerror = reject;

            img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(svg));

        });

    };



    var _this = undefined;

    var parseColor$1 = function (value) { return color.parse(Parser.create(value).parseComponentValue()); };

    var html2canvas = function (element, options) {

        if (options === void 0) { options = {}; }

        return renderElement(element, options);

    };

    CacheStorage.setContext(window);

    var renderElement = function (element, opts) { return __awaiter(_this, void 0, void 0, function () {

        var ownerDocument, defaultView, instanceName, _a, width, height, left, top, defaultResourceOptions, resourceOptions, defaultOptions, options, windowBounds, documentCloner, clonedElement, container, documentBackgroundColor, bodyBackgroundColor, bgColor, defaultBackgroundColor, backgroundColor, renderOptions, canvas, renderer, root, renderer;

        return __generator(this, function (_b) {

            switch (_b.label) {

                case 0:

                    ownerDocument = element.ownerDocument;

                    if (!ownerDocument) {

                        throw new Error("Element is not attached to a Document");

                    }

                    defaultView = ownerDocument.defaultView;

                    if (!defaultView) {

                        throw new Error("Document is not attached to a Window");

                    }

                    instanceName = (Math.round(Math.random() * 1000) + Date.now()).toString(16);

                    _a = isBodyElement(element) || isHTMLElement(element) ? parseDocumentSize(ownerDocument) : parseBounds(element), width = _a.width, height = _a.height, left = _a.left, top = _a.top;

                    defaultResourceOptions = {

                        allowTaint: false,

                        imageTimeout: 15000,

                        proxy: undefined,

                        useCORS: false

                    };

                    resourceOptions = __assign({}, defaultResourceOptions, opts);

                    defaultOptions = {

                        backgroundColor: '#ffffff',

                        cache: opts.cache ? opts.cache : CacheStorage.create(instanceName, resourceOptions),

                        logging: true,

                        removeContainer: true,

                        foreignObjectRendering: false,

                        scale: defaultView.devicePixelRatio || 1,

                        windowWidth: defaultView.innerWidth,

                        windowHeight: defaultView.innerHeight,

                        scrollX: defaultView.pageXOffset,

                        scrollY: defaultView.pageYOffset,

                        x: left,

                        y: top,

                        width: Math.ceil(width),

                        height: Math.ceil(height),

                        id: instanceName

                    };

                    options = __assign({}, defaultOptions, resourceOptions, opts);

                    windowBounds = new Bounds(options.scrollX, options.scrollY, options.windowWidth, options.windowHeight);

                    Logger.create(instanceName);

                    Logger.getInstance(instanceName).debug("Starting document clone");

                    documentCloner = new DocumentCloner(element, {

                        id: instanceName,

                        onclone: options.onclone,

                        ignoreElements: options.ignoreElements,

                        inlineImages: options.foreignObjectRendering,

                        copyStyles: options.foreignObjectRendering

                    });

                    clonedElement = documentCloner.clonedReferenceElement;

                    if (!clonedElement) {

                        return [2 /*return*/, Promise.reject("Unable to find element in cloned iframe")];

                    }

                    return [4 /*yield*/, documentCloner.toIFrame(ownerDocument, windowBounds)];

                case 1:

                    container = _b.sent();

                    documentBackgroundColor = ownerDocument.documentElement

                        ? parseColor$1(getComputedStyle(ownerDocument.documentElement).backgroundColor)

                        : COLORS.TRANSPARENT;

                    bodyBackgroundColor = ownerDocument.body

                        ? parseColor$1(getComputedStyle(ownerDocument.body).backgroundColor)

                        : COLORS.TRANSPARENT;

                    bgColor = opts.backgroundColor;

                    defaultBackgroundColor = typeof bgColor === 'string' ? parseColor$1(bgColor) : 0xffffffff;

                    backgroundColor = element === ownerDocument.documentElement

                        ? isTransparent(documentBackgroundColor)

                            ? isTransparent(bodyBackgroundColor)

                                ? defaultBackgroundColor

                                : bodyBackgroundColor

                            : documentBackgroundColor

                        : defaultBackgroundColor;

                    renderOptions = {

                        id: instanceName,

                        cache: options.cache,

                        backgroundColor: backgroundColor,

                        scale: options.scale,

                        x: options.x,

                        y: options.y,

                        scrollX: options.scrollX,

                        scrollY: options.scrollY,

                        width: options.width,

                        height: options.height,

                        windowWidth: options.windowWidth,

                        windowHeight: options.windowHeight

                    };

                    if (!options.foreignObjectRendering) return [3 /*break*/, 3];

                    Logger.getInstance(instanceName).debug("Document cloned, using foreign object rendering");

                    renderer = new ForeignObjectRenderer(renderOptions);

                    return [4 /*yield*/, renderer.render(clonedElement)];

                case 2:

                    canvas = _b.sent();

                    return [3 /*break*/, 5];

                case 3:

                    Logger.getInstance(instanceName).debug("Document cloned, using computed rendering");

                    CacheStorage.attachInstance(options.cache);

                    Logger.getInstance(instanceName).debug("Starting DOM parsing");

                    root = parseTree(clonedElement);

                    CacheStorage.detachInstance();

                    if (backgroundColor === root.styles.backgroundColor) {

                        root.styles.backgroundColor = COLORS.TRANSPARENT;

                    }

                    Logger.getInstance(instanceName).debug("Starting renderer");

                    renderer = new CanvasRenderer(renderOptions);

                    return [4 /*yield*/, renderer.render(root)];

                case 4:

                    canvas = _b.sent();

                    _b.label = 5;

                case 5:

                    if (options.removeContainer === true) {

                        if (!cleanContainer(container)) {

                            Logger.getInstance(instanceName).error("Cannot detach cloned iframe as it is not in the DOM anymore");

                        }

                    }

                    Logger.getInstance(instanceName).debug("Finished rendering");

                    Logger.destroy(instanceName);

                    CacheStorage.destroy(instanceName);

                    return [2 /*return*/, canvas];

            }

        });

    }); };

    var cleanContainer = function (container) {

        if (container.parentNode) {

            container.parentNode.removeChild(container);

            return true;

        }

        return false;

    };



    return html2canvas;



}));

//# sourceMappingURL=html2canvas.js.map




