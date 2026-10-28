//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, n) => {
	let r = {};
	for (var i in e) t(r, i, {
		get: e[i],
		enumerable: !0
	});
	return n || t(r, Symbol.toStringTag, { value: "Module" }), r;
}, c = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, l = (n, r, a) => (a = n == null ? {} : e(i(n)), c(r || !n || !n.__esModule ? t(a, "default", {
	value: n,
	enumerable: !0
}) : a, n)), u = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.iterator;
	function m(e) {
		return typeof e != "object" || !e ? null : (e = p && e[p] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var h = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, g = Object.assign, _ = {};
	function v(e, t, n) {
		this.props = e, this.context = t, this.refs = _, this.updater = n || h;
	}
	v.prototype.isReactComponent = {}, v.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, v.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function y() {}
	y.prototype = v.prototype;
	function b(e, t, n) {
		this.props = e, this.context = t, this.refs = _, this.updater = n || h;
	}
	var x = b.prototype = new y();
	x.constructor = b, g(x, v.prototype), x.isPureReactComponent = !0;
	var S = Array.isArray;
	function C() {}
	var w = {
		H: null,
		A: null,
		T: null,
		S: null
	}, T = Object.prototype.hasOwnProperty;
	function E(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function D(e, t) {
		return E(e.type, t, e.props);
	}
	function O(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function k(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var ee = /\/+/g;
	function te(e, t) {
		return typeof e == "object" && e && e.key != null ? k("" + e.key) : t.toString(36);
	}
	function ne(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(C, C) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function A(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, A(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + te(e, 0) : a, S(o) ? (i = "", c != null && (i = c.replace(ee, "$&/") + "/"), A(o, r, i, "", function(e) {
			return e;
		})) : o != null && (O(o) && (o = D(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(ee, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (S(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + te(a, u), c += A(a, r, i, s, o);
		else if (u = m(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + te(a, u++), c += A(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return A(ne(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function re(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return A(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function ie(e) {
		if (e._status === -1) {
			var t = e._result;
			t = t(), t.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t);
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t);
			}), e._status === -1 && (e._status = 0, e._result = t);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var j = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, M = {
		map: re,
		forEach: function(e, t, n) {
			re(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return re(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return re(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!O(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = M, e.Component = v, e.Fragment = r, e.Profiler = a, e.PureComponent = b, e.StrictMode = i, e.Suspense = l, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = w, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return w.H.useMemoCache(e);
		}
	}, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = g({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !T.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return E(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) T.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return E(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = O, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: ie
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = function(e) {
		var t = w.T, n = {};
		w.T = n;
		try {
			var r = e(), i = w.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(C, j);
		} catch (e) {
			j(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), w.T = t;
		}
	}, e.unstable_useCacheRefresh = function() {
		return w.H.useCacheRefresh();
	}, e.use = function(e) {
		return w.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return w.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return w.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return w.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return w.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return w.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return w.H.useEffectEvent(e);
	}, e.useId = function() {
		return w.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return w.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return w.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return w.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return w.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return w.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return w.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return w.H.useRef(e);
	}, e.useState = function(e) {
		return w.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return w.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return w.H.useTransition();
	}, e.version = "19.2.6";
})), d = /* @__PURE__ */ o(((e, t) => {
	t.exports = u();
})), f = /* @__PURE__ */ o(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) if (n(c) !== null) m = !0, S || (S = !0, O());
		else {
			var t = n(l);
			t !== null && te(x, t.startTime - e);
		}
	}
	var S = !1, C = -1, w = 5, T = -1;
	function E() {
		return g ? !0 : !(e.unstable_now() - T < w);
	}
	function D() {
		if (g = !1, S) {
			var t = e.unstable_now();
			T = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(C), C = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && E());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && te(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? O() : S = !1;
			}
		}
	}
	var O;
	if (typeof y == "function") O = function() {
		y(D);
	};
	else if (typeof MessageChannel < "u") {
		var k = new MessageChannel(), ee = k.port2;
		k.port1.onmessage = D, O = function() {
			ee.postMessage(null);
		};
	} else O = function() {
		_(D, 0);
	};
	function te(t, n) {
		C = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : w = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, te(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, O()))), r;
	}, e.unstable_shouldYield = E, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), p = /* @__PURE__ */ o(((e, t) => {
	t.exports = f();
})), m = /* @__PURE__ */ o(((e) => {
	var t = d();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal");
	function o(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var s = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function c(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return o(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = s.T, n = i.p;
		try {
			if (s.T = null, i.p = 2, e) return e();
		} finally {
			s.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = c(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") if (typeof t == "object" && t) {
			if (t.as == null || t.as === "script") {
				var n = c(t.as, t.crossOrigin);
				i.d.M(e, {
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0
				});
			}
		} else t ?? i.d.M(e);
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = c(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") if (t) {
			var n = c(t.as, t.crossOrigin);
			i.d.m(e, {
				as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
				crossOrigin: n,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0
			});
		} else i.d.m(e);
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return s.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return s.H.useHostTransitionStatus();
	}, e.version = "19.2.6";
})), h = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = m();
})), g = /* @__PURE__ */ o(((e) => {
	var t = p(), n = d(), r = h();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		var t = e, n = e;
		if (e.alternate) for (; t.return;) t = t.return;
		else {
			e = t;
			do
				t = e, t.flags & 4098 && (n = t.return), e = t.return;
			while (e);
		}
		return t.tag === 3 ? n : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function u(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function f(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = f(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	var m = Object.assign, g = Symbol.for("react.element"), _ = Symbol.for("react.transitional.element"), v = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), b = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), S = Symbol.for("react.consumer"), C = Symbol.for("react.context"), w = Symbol.for("react.forward_ref"), T = Symbol.for("react.suspense"), E = Symbol.for("react.suspense_list"), D = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), k = Symbol.for("react.activity"), ee = Symbol.for("react.memo_cache_sentinel"), te = Symbol.iterator;
	function ne(e) {
		return typeof e != "object" || !e ? null : (e = te && e[te] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var A = Symbol.for("react.client.reference");
	function re(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === A ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case y: return "Fragment";
			case x: return "Profiler";
			case b: return "StrictMode";
			case T: return "Suspense";
			case E: return "SuspenseList";
			case k: return "Activity";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case v: return "Portal";
			case C: return e.displayName || "Context";
			case S: return (e._context.displayName || "Context") + ".Consumer";
			case w:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case D: return t = e.displayName || null, t === null ? re(e.type) || "Memo" : t;
			case O:
				t = e._payload, e = e._init;
				try {
					return re(e(t));
				} catch {}
		}
		return null;
	}
	var ie = Array.isArray, j = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, M = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ae = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, oe = [], se = -1;
	function N(e) {
		return { current: e };
	}
	function ce(e) {
		0 > se || (e.current = oe[se], oe[se] = null, se--);
	}
	function P(e, t) {
		se++, oe[se] = e.current, e.current = t;
	}
	var le = N(null), ue = N(null), de = N(null), fe = N(null);
	function pe(e, t) {
		switch (P(de, t), P(ue, e), P(le, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? Wd(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = Wd(t), e = Gd(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		ce(le), P(le, e);
	}
	function me() {
		ce(le), ce(ue), ce(de);
	}
	function he(e) {
		e.memoizedState !== null && P(fe, e);
		var t = le.current, n = Gd(t, e.type);
		t !== n && (P(ue, e), P(le, n));
	}
	function ge(e) {
		ue.current === e && (ce(le), ce(ue)), fe.current === e && (ce(fe), tp._currentValue = ae);
	}
	var _e, ve;
	function ye(e) {
		if (_e === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			_e = t && t[1] || "", ve = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + _e + e + ve;
	}
	var be = !1;
	function xe(e, t) {
		if (!e || be) return "";
		be = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							e.call(n.prototype);
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			be = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? ye(n) : "";
	}
	function Se(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return ye(e.type);
			case 16: return ye("Lazy");
			case 13: return e.child !== t && t !== null ? ye("Suspense Fallback") : ye("Suspense");
			case 19: return ye("SuspenseList");
			case 0:
			case 15: return xe(e.type, !1);
			case 11: return xe(e.type.render, !1);
			case 1: return xe(e.type, !0);
			case 31: return ye("Activity");
			default: return "";
		}
	}
	function Ce(e) {
		try {
			var t = "", n = null;
			do
				t += Se(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var we = Object.prototype.hasOwnProperty, Te = t.unstable_scheduleCallback, Ee = t.unstable_cancelCallback, De = t.unstable_shouldYield, Oe = t.unstable_requestPaint, ke = t.unstable_now, Ae = t.unstable_getCurrentPriorityLevel, je = t.unstable_ImmediatePriority, Me = t.unstable_UserBlockingPriority, Ne = t.unstable_NormalPriority, Pe = t.unstable_LowPriority, Fe = t.unstable_IdlePriority, Ie = t.log, Le = t.unstable_setDisableYieldValue, Re = null, ze = null;
	function Be(e) {
		if (typeof Ie == "function" && Le(e), ze && typeof ze.setStrictMode == "function") try {
			ze.setStrictMode(Re, e);
		} catch {}
	}
	var Ve = Math.clz32 ? Math.clz32 : We, He = Math.log, Ue = Math.LN2;
	function We(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (He(e) / Ue | 0) | 0;
	}
	var Ge = 256, Ke = 262144, qe = 4194304;
	function Je(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & 261888;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function Ye(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = Je(n))) : i = Je(o) : i = Je(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = Je(n))) : i = Je(o)) : i = Je(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function Xe(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function Ze(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function Qe() {
		var e = qe;
		return qe <<= 1, !(qe & 62914560) && (qe = 4194304), e;
	}
	function $e(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function et(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function tt(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - Ve(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && nt(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function nt(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - Ve(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function rt(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - Ve(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function it(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : at(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function at(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function ot(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function st() {
		var e = M.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : gp(e.type)) : e;
	}
	function ct(e, t) {
		var n = M.p;
		try {
			return M.p = e, t();
		} finally {
			M.p = n;
		}
	}
	var lt = Math.random().toString(36).slice(2), ut = "__reactFiber$" + lt, dt = "__reactProps$" + lt, ft = "__reactContainer$" + lt, pt = "__reactEvents$" + lt, mt = "__reactListeners$" + lt, ht = "__reactHandles$" + lt, gt = "__reactResources$" + lt, _t = "__reactMarker$" + lt;
	function vt(e) {
		delete e[ut], delete e[dt], delete e[pt], delete e[mt], delete e[ht];
	}
	function yt(e) {
		var t = e[ut];
		if (t) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[ft] || n[ut]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = mf(e); e !== null;) {
					if (n = e[ut]) return n;
					e = mf(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function bt(e) {
		if (e = e[ut] || e[ft]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function xt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function St(e) {
		var t = e[gt];
		return t ||= e[gt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function Ct(e) {
		e[_t] = !0;
	}
	var wt = /* @__PURE__ */ new Set(), Tt = {};
	function Et(e, t) {
		Dt(e, t), Dt(e + "Capture", t);
	}
	function Dt(e, t) {
		for (Tt[e] = t, e = 0; e < t.length; e++) wt.add(t[e]);
	}
	var Ot = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), kt = {}, At = {};
	function jt(e) {
		return we.call(At, e) ? !0 : we.call(kt, e) ? !1 : Ot.test(e) ? At[e] = !0 : (kt[e] = !0, !1);
	}
	function Mt(e, t, n) {
		if (jt(t)) if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
					e.removeAttribute(t);
					return;
				case "boolean":
					var r = t.toLowerCase().slice(0, 5);
					if (r !== "data-" && r !== "aria-") {
						e.removeAttribute(t);
						return;
					}
			}
			e.setAttribute(t, "" + n);
		}
	}
	function Nt(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, "" + n);
		}
	}
	function Pt(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, "" + r);
		}
	}
	function Ft(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function It(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Lt(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function Rt(e) {
		if (!e._valueTracker) {
			var t = It(e) ? "checked" : "value";
			e._valueTracker = Lt(e, t, "" + e[t]);
		}
	}
	function zt(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = It(e) ? e.checked ? "true" : "false" : e.value), e = r, e === n ? !1 : (t.setValue(e), !0);
	}
	function Bt(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	var Vt = /[\n"\\]/g;
	function Ht(e) {
		return e.replace(Vt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function Ut(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Ft(t)) : e.value !== "" + Ft(t) && (e.value = "" + Ft(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Wt(e, o, Ft(n)) : Wt(e, o, Ft(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Ft(s) : e.removeAttribute("name");
	}
	function F(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Rt(e);
				return;
			}
			n = n == null ? "" : "" + Ft(n), t = t == null ? n : "" + Ft(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Rt(e);
	}
	function Wt(e, t, n) {
		t === "number" && Bt(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
	}
	function Gt(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Ft(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function Kt(e, t, n) {
		if (t != null && (t = "" + Ft(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + Ft(n);
	}
	function qt(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (ie(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Ft(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Rt(e);
	}
	function Jt(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var Yt = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function Xt(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || Yt.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function Zt(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "");
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && Xt(e, a, r);
		} else for (var o in t) t.hasOwnProperty(o) && Xt(e, o, t[o]);
	}
	function Qt(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var $t = new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), en = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function tn(e) {
		return en.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function nn() {}
	var rn = null;
	function an(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var on = null, sn = null;
	function cn(e) {
		var t = bt(e);
		if (t && (e = t.stateNode)) {
			var n = e[dt] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (Ut(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + Ht("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[dt] || null;
								if (!a) throw Error(i(90));
								Ut(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && zt(r);
					}
					break a;
				case "textarea":
					Kt(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Gt(e, !!n.multiple, t, !1);
			}
		}
	}
	var ln = !1;
	function un(e, t, n) {
		if (ln) return e(t, n);
		ln = !0;
		try {
			return e(t);
		} finally {
			if (ln = !1, (on !== null || sn !== null) && (Su(), on && (t = on, e = sn, sn = on = null, cn(t), e))) for (t = 0; t < e.length; t++) cn(e[t]);
		}
	}
	function dn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[dt] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var fn = !(typeof window > "u" || window.document === void 0 || window.document.createElement === void 0), pn = !1;
	if (fn) try {
		var mn = {};
		Object.defineProperty(mn, "passive", { get: function() {
			pn = !0;
		} }), window.addEventListener("test", mn, mn), window.removeEventListener("test", mn, mn);
	} catch {
		pn = !1;
	}
	var hn = null, gn = null, _n = null;
	function vn() {
		if (_n) return _n;
		var e, t = gn, n = t.length, r, i = "value" in hn ? hn.value : hn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return _n = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function yn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function bn() {
		return !0;
	}
	function xn() {
		return !1;
	}
	function Sn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? bn : xn, this.isPropagationStopped = xn, this;
		}
		return m(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = bn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = bn);
			},
			persist: function() {},
			isPersistent: bn
		}), t;
	}
	var Cn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, wn = Sn(Cn), Tn = m({}, Cn, {
		view: 0,
		detail: 0
	}), En = Sn(Tn), Dn, On, kn, An = m({}, Tn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: Vn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== kn && (kn && e.type === "mousemove" ? (Dn = e.screenX - kn.screenX, On = e.screenY - kn.screenY) : On = Dn = 0, kn = e), Dn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : On;
		}
	}), jn = Sn(An), Mn = Sn(m({}, An, { dataTransfer: 0 })), Nn = Sn(m({}, Tn, { relatedTarget: 0 })), Pn = Sn(m({}, Cn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Fn = Sn(m({}, Cn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), In = Sn(m({}, Cn, { data: 0 })), Ln = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, Rn = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, zn = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function Bn(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = zn[e]) ? !!t[e] : !1;
	}
	function Vn() {
		return Bn;
	}
	var Hn = Sn(m({}, Tn, {
		key: function(e) {
			if (e.key) {
				var t = Ln[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = yn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Rn[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: Vn,
		charCode: function(e) {
			return e.type === "keypress" ? yn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? yn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), Un = Sn(m({}, An, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), Wn = Sn(m({}, Tn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: Vn
	})), Gn = Sn(m({}, Cn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Kn = Sn(m({}, An, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), qn = Sn(m({}, Cn, {
		newState: 0,
		oldState: 0
	})), Jn = [
		9,
		13,
		27,
		32
	], Yn = fn && "CompositionEvent" in window, Xn = null;
	fn && "documentMode" in document && (Xn = document.documentMode);
	var Zn = fn && "TextEvent" in window && !Xn, Qn = fn && (!Yn || Xn && 8 < Xn && 11 >= Xn), $n = " ", er = !1;
	function tr(e, t) {
		switch (e) {
			case "keyup": return Jn.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function nr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var rr = !1;
	function ir(e, t) {
		switch (e) {
			case "compositionend": return nr(t);
			case "keypress": return t.which === 32 ? (er = !0, $n) : null;
			case "textInput": return e = t.data, e === $n && er ? null : e;
			default: return null;
		}
	}
	function ar(e, t) {
		if (rr) return e === "compositionend" || !Yn && tr(e, t) ? (e = vn(), _n = gn = hn = null, rr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return Qn && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var or = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function sr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!or[e.type] : t === "textarea";
	}
	function cr(e, t, n, r) {
		on ? sn ? sn.push(r) : sn = [r] : on = r, t = Od(t, "onChange"), 0 < t.length && (n = new wn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var lr = null, ur = null;
	function dr(e) {
		xd(e, 0);
	}
	function fr(e) {
		if (zt(xt(e))) return e;
	}
	function pr(e, t) {
		if (e === "change") return t;
	}
	var mr = !1;
	if (fn) {
		var hr;
		if (fn) {
			var gr = "oninput" in document;
			if (!gr) {
				var _r = document.createElement("div");
				_r.setAttribute("oninput", "return;"), gr = typeof _r.oninput == "function";
			}
			hr = gr;
		} else hr = !1;
		mr = hr && (!document.documentMode || 9 < document.documentMode);
	}
	function vr() {
		lr && (lr.detachEvent("onpropertychange", yr), ur = lr = null);
	}
	function yr(e) {
		if (e.propertyName === "value" && fr(ur)) {
			var t = [];
			cr(t, ur, e, an(e)), un(dr, t);
		}
	}
	function br(e, t, n) {
		e === "focusin" ? (vr(), lr = t, ur = n, lr.attachEvent("onpropertychange", yr)) : e === "focusout" && vr();
	}
	function xr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return fr(ur);
	}
	function Sr(e, t) {
		if (e === "click") return fr(t);
	}
	function Cr(e, t) {
		if (e === "input" || e === "change") return fr(t);
	}
	function wr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Tr = typeof Object.is == "function" ? Object.is : wr;
	function Er(e, t) {
		if (Tr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!we.call(t, i) || !Tr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Dr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Or(e, t) {
		var n = Dr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = Dr(n);
		}
	}
	function kr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? kr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Ar(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Bt(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Bt(e.document);
		}
		return t;
	}
	function jr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Mr = fn && "documentMode" in document && 11 >= document.documentMode, Nr = null, Pr = null, Fr = null, Ir = !1;
	function Lr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Ir || Nr == null || Nr !== Bt(r) || (r = Nr, "selectionStart" in r && jr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Fr && Er(Fr, r) || (Fr = r, r = Od(Pr, "onSelect"), 0 < r.length && (t = new wn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Nr)));
	}
	function Rr(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var zr = {
		animationend: Rr("Animation", "AnimationEnd"),
		animationiteration: Rr("Animation", "AnimationIteration"),
		animationstart: Rr("Animation", "AnimationStart"),
		transitionrun: Rr("Transition", "TransitionRun"),
		transitionstart: Rr("Transition", "TransitionStart"),
		transitioncancel: Rr("Transition", "TransitionCancel"),
		transitionend: Rr("Transition", "TransitionEnd")
	}, Br = {}, Vr = {};
	fn && (Vr = document.createElement("div").style, "AnimationEvent" in window || (delete zr.animationend.animation, delete zr.animationiteration.animation, delete zr.animationstart.animation), "TransitionEvent" in window || delete zr.transitionend.transition);
	function Hr(e) {
		if (Br[e]) return Br[e];
		if (!zr[e]) return e;
		var t = zr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Vr) return Br[e] = t[n];
		return e;
	}
	var Ur = Hr("animationend"), Wr = Hr("animationiteration"), I = Hr("animationstart"), Gr = Hr("transitionrun"), Kr = Hr("transitionstart"), qr = Hr("transitioncancel"), Jr = Hr("transitionend"), Yr = /* @__PURE__ */ new Map(), Xr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	Xr.push("scrollEnd");
	function Zr(e, t) {
		Yr.set(e, t), Et(t, [e]);
	}
	var Qr = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, $r = [], ei = 0, ti = 0;
	function ni() {
		for (var e = ei, t = ti = ei = 0; t < e;) {
			var n = $r[t];
			$r[t++] = null;
			var r = $r[t];
			$r[t++] = null;
			var i = $r[t];
			$r[t++] = null;
			var a = $r[t];
			if ($r[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && ai(n, i, a);
		}
	}
	function ri(e, t, n, r) {
		$r[ei++] = e, $r[ei++] = t, $r[ei++] = n, $r[ei++] = r, ti |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function L(e, t, n, r) {
		return ri(e, t, n, r), oi(e);
	}
	function ii(e, t) {
		return ri(e, null, null, t), oi(e);
	}
	function ai(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - Ve(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function oi(e) {
		if (50 < pu) throw pu = 0, mu = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var si = {};
	function ci(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function li(e, t, n, r) {
		return new ci(e, t, n, r);
	}
	function ui(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function di(e, t) {
		var n = e.alternate;
		return n === null ? (n = li(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function fi(e, t) {
		e.flags &= 65011714;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function pi(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof e == "function") ui(e) && (s = 1);
		else if (typeof e == "string") s = Kf(e, n, le.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (e) {
			case k: return e = li(31, n, t, a), e.elementType = k, e.lanes = o, e;
			case y: return mi(n.children, a, o, t);
			case b:
				s = 8, a |= 24;
				break;
			case x: return e = li(12, n, t, a | 2), e.elementType = x, e.lanes = o, e;
			case T: return e = li(13, n, t, a), e.elementType = T, e.lanes = o, e;
			case E: return e = li(19, n, t, a), e.elementType = E, e.lanes = o, e;
			default:
				if (typeof e == "object" && e) switch (e.$$typeof) {
					case C:
						s = 10;
						break a;
					case S:
						s = 9;
						break a;
					case w:
						s = 11;
						break a;
					case D:
						s = 14;
						break a;
					case O:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = li(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function mi(e, t, n, r) {
		return e = li(7, e, r, t), e.lanes = n, e;
	}
	function hi(e, t, n) {
		return e = li(6, e, null, t), e.lanes = n, e;
	}
	function gi(e) {
		var t = li(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function _i(e, t, n) {
		return t = li(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var vi = /* @__PURE__ */ new WeakMap();
	function yi(e, t) {
		if (typeof e == "object" && e) {
			var n = vi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: Ce(t)
			}, vi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: Ce(t)
		};
	}
	var bi = [], xi = 0, Si = null, Ci = 0, wi = [], Ti = 0, Ei = null, Di = 1, Oi = "";
	function ki(e, t) {
		bi[xi++] = Ci, bi[xi++] = Si, Si = e, Ci = t;
	}
	function Ai(e, t, n) {
		wi[Ti++] = Di, wi[Ti++] = Oi, wi[Ti++] = Ei, Ei = e;
		var r = Di;
		e = Oi;
		var i = 32 - Ve(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - Ve(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Di = 1 << 32 - Ve(t) + i | n << i | r, Oi = a + e;
		} else Di = 1 << a | n << i | r, Oi = e;
	}
	function ji(e) {
		e.return !== null && (ki(e, 1), Ai(e, 1, 0));
	}
	function Mi(e) {
		for (; e === Si;) Si = bi[--xi], bi[xi] = null, Ci = bi[--xi], bi[xi] = null;
		for (; e === Ei;) Ei = wi[--Ti], wi[Ti] = null, Oi = wi[--Ti], wi[Ti] = null, Di = wi[--Ti], wi[Ti] = null;
	}
	function Ni(e, t) {
		wi[Ti++] = Di, wi[Ti++] = Oi, wi[Ti++] = Ei, Di = t.id, Oi = t.overflow, Ei = e;
	}
	var R = null, z = null, B = !1, Pi = null, Fi = !1, Ii = Error(i(519));
	function Li(e) {
		throw Ui(yi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), Ii;
	}
	function Ri(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[ut] = e, t[dt] = r, n) {
			case "dialog":
				X("cancel", t), X("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				X("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < yd.length; n++) X(yd[n], t);
				break;
			case "source":
				X("error", t);
				break;
			case "img":
			case "image":
			case "link":
				X("error", t), X("load", t);
				break;
			case "details":
				X("toggle", t);
				break;
			case "input":
				X("invalid", t), F(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				X("invalid", t);
				break;
			case "textarea": X("invalid", t), qt(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || Pd(t.textContent, n) ? (r.popover != null && (X("beforetoggle", t), X("toggle", t)), r.onScroll != null && X("scroll", t), r.onScrollEnd != null && X("scrollend", t), r.onClick != null && (t.onclick = nn), t = !0) : t = !1, t || Li(e, !0);
	}
	function zi(e) {
		for (R = e.return; R;) switch (R.tag) {
			case 5:
			case 31:
			case 13:
				Fi = !1;
				return;
			case 27:
			case 3:
				Fi = !0;
				return;
			default: R = R.return;
		}
	}
	function Bi(e) {
		if (e !== R) return !1;
		if (!B) return zi(e), B = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || Kd(e.type, e.memoizedProps)), n = !n), n && z && Li(e), zi(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			z = pf(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			z = pf(e);
		} else t === 27 ? (t = z, ef(e.type) ? (e = ff, ff = null, z = e) : z = t) : z = R ? df(e.stateNode.nextSibling) : null;
		return !0;
	}
	function Vi() {
		z = R = null, B = !1;
	}
	function Hi() {
		var e = Pi;
		return e !== null && ($l === null ? $l = e : $l.push.apply($l, e), Pi = null), e;
	}
	function Ui(e) {
		Pi === null ? Pi = [e] : Pi.push(e);
	}
	var Wi = N(null), Gi = null, Ki = null;
	function qi(e, t, n) {
		P(Wi, t._currentValue), t._currentValue = n;
	}
	function Ji(e) {
		e._currentValue = Wi.current, ce(Wi);
	}
	function Yi(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function Xi(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Yi(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), Yi(s, n, e), s = null;
			} else s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function Zi(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					Tr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === fe.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [tp] : e.push(tp));
			}
			a = a.return;
		}
		e !== null && Xi(t, e, n, r), t.flags |= 262144;
	}
	function Qi(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Tr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function $i(e) {
		Gi = e, Ki = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function ea(e) {
		return na(Gi, e);
	}
	function ta(e, t) {
		return Gi === null && $i(e), na(e, t);
	}
	function na(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, Ki === null) {
			if (e === null) throw Error(i(308));
			Ki = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else Ki = Ki.next = t;
		return n;
	}
	var ra = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, ia = t.unstable_scheduleCallback, aa = t.unstable_NormalPriority, oa = {
		$$typeof: C,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function sa() {
		return {
			controller: new ra(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function ca(e) {
		e.refCount--, e.refCount === 0 && ia(aa, function() {
			e.controller.abort();
		});
	}
	var la = null, ua = 0, da = 0, fa = null;
	function pa(e, t) {
		if (la === null) {
			var n = la = [];
			ua = 0, da = pd(), fa = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return ua++, t.then(ma, ma), t;
	}
	function ma() {
		if (--ua === 0 && la !== null) {
			fa !== null && (fa.status = "fulfilled");
			var e = la;
			la = null, da = 0, fa = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function ha(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var ga = j.S;
	j.S = function(e, t) {
		nu = ke(), typeof t == "object" && t && typeof t.then == "function" && pa(e, t), ga !== null && ga(e, t);
	};
	var _a = N(null);
	function va() {
		var e = _a.current;
		return e === null ? G.pooledCache : e;
	}
	function ya(e, t) {
		t === null ? P(_a, _a.current) : P(_a, t.pool);
	}
	function ba() {
		var e = va();
		return e === null ? null : {
			parent: oa._currentValue,
			pool: e
		};
	}
	var xa = Error(i(460)), Sa = Error(i(474)), Ca = Error(i(542)), wa = { then: function() {} };
	function Ta(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function Ea(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(nn, nn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, Aa(e), e;
			default:
				if (typeof t.status == "string") t.then(nn, nn);
				else {
					if (e = G, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, Aa(e), e;
				}
				throw Oa = t, xa;
		}
	}
	function Da(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (Oa = e, xa) : e;
		}
	}
	var Oa = null;
	function ka() {
		if (Oa === null) throw Error(i(459));
		var e = Oa;
		return Oa = null, e;
	}
	function Aa(e) {
		if (e === xa || e === Ca) throw Error(i(483));
	}
	var ja = null, Ma = 0;
	function Na(e) {
		var t = Ma;
		return Ma += 1, ja === null && (ja = []), Ea(ja, e, t);
	}
	function Pa(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function Fa(e, t) {
		throw t.$$typeof === g ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function Ia(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = di(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 67108866), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = hi(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === y ? d(e, t, n.props.children, r, n.key) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === O && Da(i) === t.type) ? (t = a(t, n.props), Pa(t, n), t.return = e, t) : (t = pi(n.type, n.key, n.props, null, e.mode, r), Pa(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = _i(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = mi(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = hi("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case _: return n = pi(t.type, t.key, t.props, null, e.mode, n), Pa(n, t), n.return = e, n;
					case v: return t = _i(t, e.mode, n), t.return = e, t;
					case O: return t = Da(t), f(e, t, n);
				}
				if (ie(t) || ne(t)) return t = mi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, Na(t), n);
				if (t.$$typeof === C) return f(e, ta(e, t), n);
				Fa(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case _: return n.key === i ? l(e, t, n, r) : null;
					case v: return n.key === i ? u(e, t, n, r) : null;
					case O: return n = Da(n), p(e, t, n, r);
				}
				if (ie(n) || ne(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, Na(n), r);
				if (n.$$typeof === C) return p(e, t, ta(e, n), r);
				Fa(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case _: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case v: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case O: return r = Da(r), m(e, t, n, r, i);
				}
				if (ie(r) || ne(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, Na(r), i);
				if (r.$$typeof === C) return m(e, t, n, ta(t, r), i);
				Fa(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), B && ki(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return B && ki(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && g.alternate !== null && d.delete(g.key === null ? h : g.key), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), B && ki(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), B && ki(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return B && ki(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && v.alternate !== null && h.delete(v.key === null ? g : v.key), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), B && ki(a, g), u;
		}
		function b(e, r, o, c) {
			if (typeof o == "object" && o && o.type === y && o.key === null && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case _:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === y) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === O && Da(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), Pa(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								} else t(e, r);
								r = r.sibling;
							}
							o.type === y ? (c = mi(o.props.children, e.mode, c, o.key), c.return = e, e = c) : (c = pi(o.type, o.key, o.props, null, e.mode, c), Pa(c, o), c.return = e, e = c);
						}
						return s(e);
					case v:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
									n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
									break a;
								} else {
									n(e, r);
									break;
								}
								else t(e, r);
								r = r.sibling;
							}
							c = _i(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case O: return o = Da(o), b(e, r, o, c);
				}
				if (ie(o)) return h(e, r, o, c);
				if (ne(o)) {
					if (l = ne(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return b(e, r, Na(o), c);
				if (o.$$typeof === C) return b(e, r, ta(e, o), c);
				Fa(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = hi(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				Ma = 0;
				var i = b(e, t, n, r);
				return ja = null, i;
			} catch (t) {
				if (t === xa || t === Ca) throw t;
				var a = li(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var La = Ia(!0), Ra = Ia(!1), za = !1;
	function Ba(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function Va(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function Ha(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function Ua(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, W & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = oi(e), ai(e, null, n), t;
		}
		return ri(e, r, t, n), oi(e);
	}
	function Wa(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, rt(e, n);
		}
	}
	function Ga(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
			return;
		}
		e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var Ka = !1;
	function qa() {
		if (Ka) {
			var e = fa;
			if (e !== null) throw e;
		}
	}
	function Ja(e, t, n, r) {
		Ka = !1;
		var i = e.updateQueue;
		za = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (q & f) === f : (r & f) === f) {
					f !== 0 && f === da && (Ka = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var h = e, g = s;
						f = t;
						var _ = n;
						switch (g.tag) {
							case 1:
								if (h = g.payload, typeof h == "function") {
									d = h.call(_, d, f);
									break a;
								}
								d = h;
								break a;
							case 3: h.flags = h.flags & -65537 | 128;
							case 0:
								if (h = g.payload, f = typeof h == "function" ? h.call(_, d, f) : h, f == null) break a;
								d = m({}, d, f);
								break a;
							case 2: za = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), ql |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function Ya(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function Xa(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Ya(n[e], t);
	}
	var Za = N(null), Qa = N(0);
	function $a(e, t) {
		e = Gl, P(Qa, e), P(Za, t), Gl = e | t.baseLanes;
	}
	function eo() {
		P(Qa, Gl), P(Za, Za.current);
	}
	function to() {
		Gl = Qa.current, ce(Za), ce(Qa);
	}
	var no = N(null), ro = null;
	function io(e) {
		var t = e.alternate;
		P(lo, lo.current & 1), P(no, e), ro === null && (t === null || Za.current !== null || t.memoizedState !== null) && (ro = e);
	}
	function ao(e) {
		P(lo, lo.current), P(no, e), ro === null && (ro = e);
	}
	function oo(e) {
		e.tag === 22 ? (P(lo, lo.current), P(no, e), ro === null && (ro = e)) : so(e);
	}
	function so() {
		P(lo, lo.current), P(no, no.current);
	}
	function co(e) {
		ce(no), ro === e && (ro = null), ce(lo);
	}
	var lo = N(0);
	function uo(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || cf(n) || lf(n))) return t;
			} else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var fo = 0, V = null, po = null, mo = null, ho = !1, go = !1, _o = !1, vo = 0, yo = 0, bo = null, xo = 0;
	function So() {
		throw Error(i(321));
	}
	function Co(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Tr(e[n], t[n])) return !1;
		return !0;
	}
	function wo(e, t, n, r, i, a) {
		return fo = a, V = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, j.H = e === null || e.memoizedState === null ? Bs : Vs, _o = !1, a = n(r, i), _o = !1, go && (a = Eo(t, n, r, i)), To(e), a;
	}
	function To(e) {
		j.H = zs;
		var t = po !== null && po.next !== null;
		if (fo = 0, mo = po = V = null, ho = !1, yo = 0, bo = null, t) throw Error(i(300));
		e === null || ic || (e = e.dependencies, e !== null && Qi(e) && (ic = !0));
	}
	function Eo(e, t, n, r) {
		V = e;
		var a = 0;
		do {
			if (go && (bo = null), yo = 0, go = !1, 25 <= a) throw Error(i(301));
			if (a += 1, mo = po = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			j.H = Hs, o = t(n, r);
		} while (go);
		return o;
	}
	function Do() {
		var e = j.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? Po(t) : t, e = e.useState()[0], (po === null ? null : po.memoizedState) !== e && (V.flags |= 1024), t;
	}
	function Oo() {
		var e = vo !== 0;
		return vo = 0, e;
	}
	function ko(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function Ao(e) {
		if (ho) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			ho = !1;
		}
		fo = 0, mo = po = V = null, go = !1, yo = vo = 0, bo = null;
	}
	function jo() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return mo === null ? V.memoizedState = mo = e : mo = mo.next = e, mo;
	}
	function Mo() {
		if (po === null) {
			var e = V.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = po.next;
		var t = mo === null ? V.memoizedState : mo.next;
		if (t !== null) mo = t, po = e;
		else {
			if (e === null) throw V.alternate === null ? Error(i(467)) : Error(i(310));
			po = e, e = {
				memoizedState: po.memoizedState,
				baseState: po.baseState,
				baseQueue: po.baseQueue,
				queue: po.queue,
				next: null
			}, mo === null ? V.memoizedState = mo = e : mo = mo.next = e;
		}
		return mo;
	}
	function No() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function Po(e) {
		var t = yo;
		return yo += 1, bo === null && (bo = []), e = Ea(bo, e, t), t = V, (mo === null ? t.memoizedState : mo.next) === null && (t = t.alternate, j.H = t === null || t.memoizedState === null ? Bs : Vs), e;
	}
	function Fo(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return Po(e);
			if (e.$$typeof === C) return ea(e);
		}
		throw Error(i(438, String(e)));
	}
	function Io(e) {
		var t = null, n = V.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = V.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = No(), V.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = ee;
		return t.index++, n;
	}
	function Lo(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function Ro(e) {
		return zo(Mo(), po, e);
	}
	function zo(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (fo & f) === f : (q & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === da && (d = !0);
					else if ((fo & p) === p) {
						u = u.next, p === da && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, V.lanes |= p, ql |= p;
					f = u.action, _o && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, V.lanes |= f, ql |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Tr(o, e.memoizedState) && (ic = !0, d && (n = fa, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function Bo(e) {
		var t = Mo(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Tr(o, t.memoizedState) || (ic = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function Vo(e, t, n) {
		var r = V, a = Mo(), o = B;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Tr((po || a).memoizedState, n);
		if (s && (a.memoizedState = n, ic = !0), a = a.queue, fs(Wo.bind(null, r, a, e), [e]), a.getSnapshot !== t || s || mo !== null && mo.memoizedState.tag & 1) {
			if (r.flags |= 2048, ss(9, { destroy: void 0 }, Uo.bind(null, r, a, n, t), null), G === null) throw Error(i(349));
			o || fo & 127 || Ho(r, t, n);
		}
		return n;
	}
	function Ho(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = V.updateQueue, t === null ? (t = No(), V.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function Uo(e, t, n, r) {
		t.value = n, t.getSnapshot = r, Go(t) && Ko(e);
	}
	function Wo(e, t, n) {
		return n(function() {
			Go(t) && Ko(e);
		});
	}
	function Go(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Tr(e, n);
		} catch {
			return !0;
		}
	}
	function Ko(e) {
		var t = ii(e, 2);
		t !== null && _u(t, e, 2);
	}
	function qo(e) {
		var t = jo();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), _o) {
				Be(!0);
				try {
					n();
				} finally {
					Be(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Lo,
			lastRenderedState: e
		}, t;
	}
	function Jo(e, t, n, r) {
		return e.baseState = n, zo(e, po, typeof r == "function" ? r : Lo);
	}
	function Yo(e, t, n, r, a) {
		if (Is(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			j.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Xo(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Xo(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = j.T, o = {};
			j.T = o;
			try {
				var s = n(i, r), c = j.S;
				c !== null && c(o, s), Zo(e, t, s);
			} catch (n) {
				$o(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), j.T = a;
			}
		} else try {
			a = n(i, r), Zo(e, t, a);
		} catch (n) {
			$o(e, t, n);
		}
	}
	function Zo(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Qo(e, t, n);
		}, function(n) {
			return $o(e, t, n);
		}) : Qo(e, t, n);
	}
	function Qo(e, t, n) {
		t.status = "fulfilled", t.value = n, es(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Xo(e, n)));
	}
	function $o(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, es(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function es(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function ts(e, t) {
		return t;
	}
	function ns(e, t) {
		if (B) {
			var n = G.formState;
			if (n !== null) {
				a: {
					var r = V;
					if (B) {
						if (z) {
							b: {
								for (var i = z, a = Fi; i.nodeType !== 8;) {
									if (!a) {
										i = null;
										break b;
									}
									if (i = df(i.nextSibling), i === null) {
										i = null;
										break b;
									}
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								z = df(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						Li(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = jo(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: ts,
			lastRenderedState: t
		}, n.queue = r, n = Ns.bind(null, V, r), r.dispatch = n, r = qo(!1), a = Fs.bind(null, V, !1, r.queue), r = jo(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Yo.bind(null, V, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function rs(e) {
		return is(Mo(), po, e);
	}
	function is(e, t, n) {
		if (t = zo(e, t, ts)[0], e = Ro(Lo)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = Po(t);
		} catch (e) {
			throw e === xa ? Ca : e;
		}
		else r = t;
		t = Mo();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (V.flags |= 2048, ss(9, { destroy: void 0 }, as.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function as(e, t) {
		e.action = t;
	}
	function os(e) {
		var t = Mo(), n = po;
		if (n !== null) return is(t, n, e);
		Mo(), t = t.memoizedState, n = Mo();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function ss(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = V.updateQueue, t === null && (t = No(), V.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function cs() {
		return Mo().memoizedState;
	}
	function ls(e, t, n, r) {
		var i = jo();
		V.flags |= e, i.memoizedState = ss(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function us(e, t, n, r) {
		var i = Mo();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		po !== null && r !== null && Co(r, po.memoizedState.deps) ? i.memoizedState = ss(t, a, n, r) : (V.flags |= e, i.memoizedState = ss(1 | t, a, n, r));
	}
	function ds(e, t) {
		ls(8390656, 8, e, t);
	}
	function fs(e, t) {
		us(2048, 8, e, t);
	}
	function ps(e) {
		V.flags |= 4;
		var t = V.updateQueue;
		if (t === null) t = No(), V.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function ms(e) {
		var t = Mo().memoizedState;
		return ps({
			ref: t,
			nextImpl: e
		}), function() {
			if (W & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function hs(e, t) {
		return us(4, 2, e, t);
	}
	function H(e, t) {
		return us(4, 4, e, t);
	}
	function gs(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function _s(e, t, n) {
		n = n == null ? null : n.concat([e]), us(4, 4, gs.bind(null, t, e), n);
	}
	function vs() {}
	function ys(e, t) {
		var n = Mo();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && Co(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function bs(e, t) {
		var n = Mo();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && Co(t, r[1])) return r[0];
		if (r = e(), _o) {
			Be(!0);
			try {
				e();
			} finally {
				Be(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function xs(e, t, n) {
		return n === void 0 || fo & 1073741824 && !(q & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = gu(), V.lanes |= e, ql |= e, n);
	}
	function Ss(e, t, n, r) {
		return Tr(n, t) ? n : Za.current === null ? !(fo & 42) || fo & 1073741824 && !(q & 261930) ? (ic = !0, e.memoizedState = n) : (e = gu(), V.lanes |= e, ql |= e, t) : (e = xs(e, n, r), Tr(e, t) || (ic = !0), e);
	}
	function Cs(e, t, n, r, i) {
		var a = M.p;
		M.p = a !== 0 && 8 > a ? a : 8;
		var o = j.T, s = {};
		j.T = s, Fs(e, !1, t, n);
		try {
			var c = i(), l = j.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? Ps(e, t, ha(c, r), hu(e)) : Ps(e, t, r, hu(e));
		} catch (n) {
			Ps(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, hu());
		} finally {
			M.p = a, o !== null && s.types !== null && (o.types = s.types), j.T = o;
		}
	}
	function ws() {}
	function Ts(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = Es(e).queue;
		Cs(e, a, t, ae, n === null ? ws : function() {
			return Ds(e), n(r);
		});
	}
	function Es(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: ae,
			baseState: ae,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Lo,
				lastRenderedState: ae
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Lo,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function Ds(e) {
		var t = Es(e);
		t.next === null && (t = e.alternate.memoizedState), Ps(e, t.next.queue, {}, hu());
	}
	function Os() {
		return ea(tp);
	}
	function ks() {
		return Mo().memoizedState;
	}
	function As() {
		return Mo().memoizedState;
	}
	function js(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = hu();
					e = Ha(n);
					var r = Ua(t, e, n);
					r !== null && (_u(r, t, n), Wa(r, t, n)), t = { cache: sa() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function Ms(e, t, n) {
		var r = hu();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Is(e) ? Ls(t, n) : (n = L(e, t, n, r), n !== null && (_u(n, e, r), Rs(n, t, r)));
	}
	function Ns(e, t, n) {
		Ps(e, t, n, hu());
	}
	function Ps(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (Is(e)) Ls(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Tr(s, o)) return ri(e, t, i, 0), G === null && ni(), !1;
			} catch {}
			if (n = L(e, t, i, r), n !== null) return _u(n, e, r), Rs(n, t, r), !0;
		}
		return !1;
	}
	function Fs(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: pd(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Is(e)) {
			if (t) throw Error(i(479));
		} else t = L(e, n, r, 2), t !== null && _u(t, e, 2);
	}
	function Is(e) {
		var t = e.alternate;
		return e === V || t !== null && t === V;
	}
	function Ls(e, t) {
		go = ho = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function Rs(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, rt(e, n);
		}
	}
	var zs = {
		readContext: ea,
		use: Fo,
		useCallback: So,
		useContext: So,
		useEffect: So,
		useImperativeHandle: So,
		useLayoutEffect: So,
		useInsertionEffect: So,
		useMemo: So,
		useReducer: So,
		useRef: So,
		useState: So,
		useDebugValue: So,
		useDeferredValue: So,
		useTransition: So,
		useSyncExternalStore: So,
		useId: So,
		useHostTransitionStatus: So,
		useFormState: So,
		useActionState: So,
		useOptimistic: So,
		useMemoCache: So,
		useCacheRefresh: So
	};
	zs.useEffectEvent = So;
	var Bs = {
		readContext: ea,
		use: Fo,
		useCallback: function(e, t) {
			return jo().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: ea,
		useEffect: ds,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), ls(4194308, 4, gs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return ls(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			ls(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = jo();
			t = t === void 0 ? null : t;
			var r = e();
			if (_o) {
				Be(!0);
				try {
					e();
				} finally {
					Be(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = jo();
			if (n !== void 0) {
				var i = n(t);
				if (_o) {
					Be(!0);
					try {
						n(t);
					} finally {
						Be(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = Ms.bind(null, V, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = jo();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = qo(e);
			var t = e.queue, n = Ns.bind(null, V, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: vs,
		useDeferredValue: function(e, t) {
			return xs(jo(), e, t);
		},
		useTransition: function() {
			var e = qo(!1);
			return e = Cs.bind(null, V, e.queue, !0, !1), jo().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = V, a = jo();
			if (B) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), G === null) throw Error(i(349));
				q & 127 || Ho(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, ds(Wo.bind(null, r, o, e), [e]), r.flags |= 2048, ss(9, { destroy: void 0 }, Uo.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = jo(), t = G.identifierPrefix;
			if (B) {
				var n = Oi, r = Di;
				n = (r & ~(1 << 32 - Ve(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = vo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = xo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Os,
		useFormState: ns,
		useActionState: ns,
		useOptimistic: function(e) {
			var t = jo();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = Fs.bind(null, V, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: Io,
		useCacheRefresh: function() {
			return jo().memoizedState = js.bind(null, V);
		},
		useEffectEvent: function(e) {
			var t = jo(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (W & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, Vs = {
		readContext: ea,
		use: Fo,
		useCallback: ys,
		useContext: ea,
		useEffect: fs,
		useImperativeHandle: _s,
		useInsertionEffect: hs,
		useLayoutEffect: H,
		useMemo: bs,
		useReducer: Ro,
		useRef: cs,
		useState: function() {
			return Ro(Lo);
		},
		useDebugValue: vs,
		useDeferredValue: function(e, t) {
			return Ss(Mo(), po.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Ro(Lo)[0], t = Mo().memoizedState;
			return [typeof e == "boolean" ? e : Po(e), t];
		},
		useSyncExternalStore: Vo,
		useId: ks,
		useHostTransitionStatus: Os,
		useFormState: rs,
		useActionState: rs,
		useOptimistic: function(e, t) {
			return Jo(Mo(), po, e, t);
		},
		useMemoCache: Io,
		useCacheRefresh: As
	};
	Vs.useEffectEvent = ms;
	var Hs = {
		readContext: ea,
		use: Fo,
		useCallback: ys,
		useContext: ea,
		useEffect: fs,
		useImperativeHandle: _s,
		useInsertionEffect: hs,
		useLayoutEffect: H,
		useMemo: bs,
		useReducer: Bo,
		useRef: cs,
		useState: function() {
			return Bo(Lo);
		},
		useDebugValue: vs,
		useDeferredValue: function(e, t) {
			var n = Mo();
			return po === null ? xs(n, e, t) : Ss(n, po.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Bo(Lo)[0], t = Mo().memoizedState;
			return [typeof e == "boolean" ? e : Po(e), t];
		},
		useSyncExternalStore: Vo,
		useId: ks,
		useHostTransitionStatus: Os,
		useFormState: os,
		useActionState: os,
		useOptimistic: function(e, t) {
			var n = Mo();
			return po === null ? (n.baseState = e, [e, n.queue.dispatch]) : Jo(n, po, e, t);
		},
		useMemoCache: Io,
		useCacheRefresh: As
	};
	Hs.useEffectEvent = ms;
	function Us(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : m({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var Ws = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = hu(), i = Ha(r);
			i.payload = t, n != null && (i.callback = n), t = Ua(e, i, r), t !== null && (_u(t, e, r), Wa(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = hu(), i = Ha(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Ua(e, i, r), t !== null && (_u(t, e, r), Wa(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = hu(), r = Ha(n);
			r.tag = 2, t != null && (r.callback = t), t = Ua(e, r, n), t !== null && (_u(t, e, n), Wa(t, e, n));
		}
	};
	function Gs(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Er(n, r) || !Er(i, a) : !0;
	}
	function Ks(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Ws.enqueueReplaceState(t, t.state, null);
	}
	function qs(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = m({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Js(e) {
		Qr(e);
	}
	function Ys(e) {
		console.error(e);
	}
	function Xs(e) {
		Qr(e);
	}
	function Zs(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Qs(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function $s(e, t, n) {
		return n = Ha(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Zs(e, t);
		}, n;
	}
	function ec(e) {
		return e = Ha(e), e.tag = 3, e;
	}
	function tc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Qs(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Qs(t, n, r), typeof i != "function" && (au === null ? au = new Set([this]) : au.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function nc(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && Zi(t, n, a, !0), n = no.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13: return ro === null ? ku() : n.alternate === null && Kl === 0 && (Kl = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === wa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = new Set([r]) : t.add(r), qu(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === wa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = new Set([r]) : n.add(r)), qu(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return qu(e, r, a), ku(), !1;
		}
		if (B) return t = no.current, t === null ? (r !== Ii && (t = Error(i(423), { cause: r }), Ui(yi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = yi(r, n), a = $s(e.stateNode, r, a), Ga(e, a), Kl !== 4 && (Kl = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== Ii && (e = Error(i(422), { cause: r }), Ui(yi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = yi(o, n), Ql === null ? Ql = [o] : Ql.push(o), Kl !== 4 && (Kl = 2), t === null) return !0;
		r = yi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = $s(n.stateNode, r, e), Ga(n, e), !1;
				case 1: if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (au === null || !au.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = ec(a), tc(a, e, n, r), Ga(n, a), !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var rc = Error(i(461)), ic = !1;
	function ac(e, t, n, r) {
		t.child = e === null ? Ra(t, null, n, r) : La(t, e.child, n, r);
	}
	function oc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return $i(t), r = wo(e, t, n, o, a, i), s = Oo(), e !== null && !ic ? (ko(e, t, i), Ac(e, t, i)) : (B && s && ji(t), t.flags |= 1, ac(e, t, r, i), t.child);
	}
	function sc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !ui(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, cc(e, t, a, r, i)) : (e = pi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !jc(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Er : n, n(o, r) && e.ref === t.ref) return Ac(e, t, i);
		}
		return t.flags |= 1, e = di(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function cc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Er(a, r) && e.ref === t.ref) if (ic = !1, t.pendingProps = r = a, jc(e, i)) e.flags & 131072 && (ic = !0);
			else return t.lanes = e.lanes, Ac(e, t, i);
		}
		return gc(e, t, n, r, i);
	}
	function lc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return dc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && ya(t, a === null ? null : a.cachePool), a === null ? eo() : $a(t, a), oo(t);
			else return r = t.lanes = 536870912, dc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && ya(t, null), eo(), so(t)) : (ya(t, a.cachePool), $a(t, a), so(t), t.memoizedState = null);
		return ac(e, t, i, n), t.child;
	}
	function uc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function dc(e, t, n, r, i) {
		var a = va();
		return a = a === null ? null : {
			parent: oa._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && ya(t, null), eo(), oo(t), e !== null && Zi(e, t, r, !0), t.childLanes = i, null;
	}
	function fc(e, t) {
		return t = Tc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function pc(e, t, n) {
		return La(t, e.child, null, n), e = fc(t, t.pendingProps), e.flags |= 2, co(t), t.memoizedState = null, e;
	}
	function mc(e, t, n) {
		var r = t.pendingProps, a = (t.flags & 128) != 0;
		if (t.flags &= -129, e === null) {
			if (B) {
				if (r.mode === "hidden") return e = fc(t, r), t.lanes = 536870912, uc(null, e);
				if (ao(t), (e = z) ? (e = sf(e, Fi), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ei === null ? null : {
						id: Di,
						overflow: Oi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = gi(e), n.return = t, t.child = n, R = t, z = null)) : e = null, e === null) throw Li(t);
				return t.lanes = 536870912, null;
			}
			return fc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (ao(t), a) if (t.flags & 256) t.flags &= -257, t = pc(e, t, n);
			else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
			else throw Error(i(558));
			else if (ic || Zi(e, t, n, !1), a = (n & e.childLanes) !== 0, ic || a) {
				if (r = G, r !== null && (s = it(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, ii(e, s), _u(r, e, s), rc;
				ku(), t = pc(e, t, n);
			} else e = o.treeContext, z = df(s.nextSibling), R = t, B = !0, Pi = null, Fi = !1, e !== null && Ni(t, e), t = fc(t, r), t.flags |= 4096;
			return t;
		}
		return e = di(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function hc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function gc(e, t, n, r, i) {
		return $i(t), n = wo(e, t, n, r, void 0, i), r = Oo(), e !== null && !ic ? (ko(e, t, i), Ac(e, t, i)) : (B && r && ji(t), t.flags |= 1, ac(e, t, n, i), t.child);
	}
	function _c(e, t, n, r, i, a) {
		return $i(t), t.updateQueue = null, n = Eo(t, r, n, i), To(e), r = Oo(), e !== null && !ic ? (ko(e, t, a), Ac(e, t, a)) : (B && r && ji(t), t.flags |= 1, ac(e, t, n, a), t.child);
	}
	function vc(e, t, n, r, i) {
		if ($i(t), t.stateNode === null) {
			var a = si, o = n.contextType;
			typeof o == "object" && o && (a = ea(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Ws, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, Ba(t), o = n.contextType, a.context = typeof o == "object" && o ? ea(o) : si, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Us(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && Ws.enqueueReplaceState(a, a.state, null), Ja(t, r, a, i), qa(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = qs(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = si, typeof u == "object" && u && (o = ea(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Ks(t, a, r, o), za = !1;
			var f = t.memoizedState;
			a.state = f, Ja(t, r, a, i), qa(), l = t.memoizedState, s || f !== l || za ? (typeof d == "function" && (Us(t, n, d, r), l = t.memoizedState), (c = za || Gs(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, Va(e, t), o = t.memoizedProps, u = qs(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = si, typeof l == "object" && l && (c = ea(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Ks(t, a, r, c), za = !1, f = t.memoizedState, a.state = f, Ja(t, r, a, i), qa();
			var p = t.memoizedState;
			o !== d || f !== p || za || e !== null && e.dependencies !== null && Qi(e.dependencies) ? (typeof s == "function" && (Us(t, n, s, r), p = t.memoizedState), (u = za || Gs(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && Qi(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, hc(e, t), r = (t.flags & 128) != 0, a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = La(t, e.child, null, i), t.child = La(t, null, n, i)) : ac(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = Ac(e, t, i), e;
	}
	function yc(e, t, n, r) {
		return Vi(), t.flags |= 256, ac(e, t, n, r), t.child;
	}
	var bc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function xc(e) {
		return {
			baseLanes: e,
			cachePool: ba()
		};
	}
	function Sc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= Xl), e;
	}
	function Cc(e, t, n) {
		var r = t.pendingProps, a = !1, o = (t.flags & 128) != 0, s;
		if ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : (lo.current & 2) != 0), s && (a = !0, t.flags &= -129), s = (t.flags & 32) != 0, t.flags &= -33, e === null) {
			if (B) {
				if (a ? io(t) : so(t), (e = z) ? (e = sf(e, Fi), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ei === null ? null : {
						id: Di,
						overflow: Oi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = gi(e), n.return = t, t.child = n, R = t, z = null)) : e = null, e === null) throw Li(t);
				return lf(e) ? t.lanes = 32 : t.lanes = 536870912, null;
			}
			var c = r.children;
			return r = r.fallback, a ? (so(t), a = t.mode, c = Tc({
				mode: "hidden",
				children: c
			}, a), r = mi(r, a, n, null), c.return = t, r.return = t, c.sibling = r, t.child = c, r = t.child, r.memoizedState = xc(n), r.childLanes = Sc(e, s, n), t.memoizedState = bc, uc(null, r)) : (io(t), wc(t, c));
		}
		var l = e.memoizedState;
		if (l !== null && (c = l.dehydrated, c !== null)) {
			if (o) t.flags & 256 ? (io(t), t.flags &= -257, t = Ec(e, t, n)) : t.memoizedState === null ? (so(t), c = r.fallback, a = t.mode, r = Tc({
				mode: "visible",
				children: r.children
			}, a), c = mi(c, a, n, null), c.flags |= 2, r.return = t, c.return = t, r.sibling = c, t.child = r, La(t, e.child, null, n), r = t.child, r.memoizedState = xc(n), r.childLanes = Sc(e, s, n), t.memoizedState = bc, t = uc(null, r)) : (so(t), t.child = e.child, t.flags |= 128, t = null);
			else if (io(t), lf(c)) {
				if (s = c.nextSibling && c.nextSibling.dataset, s) var u = s.dgst;
				s = u, r = Error(i(419)), r.stack = "", r.digest = s, Ui({
					value: r,
					source: null,
					stack: null
				}), t = Ec(e, t, n);
			} else if (ic || Zi(e, t, n, !1), s = (n & e.childLanes) !== 0, ic || s) {
				if (s = G, s !== null && (r = it(s, n), r !== 0 && r !== l.retryLane)) throw l.retryLane = r, ii(e, r), _u(s, e, r), rc;
				cf(c) || ku(), t = Ec(e, t, n);
			} else cf(c) ? (t.flags |= 192, t.child = e.child, t = null) : (e = l.treeContext, z = df(c.nextSibling), R = t, B = !0, Pi = null, Fi = !1, e !== null && Ni(t, e), t = wc(t, r.children), t.flags |= 4096);
			return t;
		}
		return a ? (so(t), c = r.fallback, a = t.mode, l = e.child, u = l.sibling, r = di(l, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = l.subtreeFlags & 65011712, u === null ? (c = mi(c, a, n, null), c.flags |= 2) : c = di(u, c), c.return = t, r.return = t, r.sibling = c, t.child = r, uc(null, r), r = t.child, c = e.child.memoizedState, c === null ? c = xc(n) : (a = c.cachePool, a === null ? a = ba() : (l = oa._currentValue, a = a.parent === l ? a : {
			parent: l,
			pool: l
		}), c = {
			baseLanes: c.baseLanes | n,
			cachePool: a
		}), r.memoizedState = c, r.childLanes = Sc(e, s, n), t.memoizedState = bc, uc(e.child, r)) : (io(t), n = e.child, e = n.sibling, n = di(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (s = t.deletions, s === null ? (t.deletions = [e], t.flags |= 16) : s.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function wc(e, t) {
		return t = Tc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function Tc(e, t) {
		return e = li(22, e, null, t), e.lanes = 0, e;
	}
	function Ec(e, t, n) {
		return La(t, e.child, null, n), e = wc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Dc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), Yi(e.return, t, n);
	}
	function Oc(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function kc(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = lo.current, s = (o & 2) != 0;
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, P(lo, o), ac(e, t, r, n), r = B ? Ci : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && Dc(e, n, t);
			else if (e.tag === 19) Dc(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "forwards":
				for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && uo(e) === null && (i = n), n = n.sibling;
				n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Oc(t, !1, i, n, a, r);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && uo(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				Oc(t, !0, n, null, a, r);
				break;
			case "together":
				Oc(t, !1, null, null, void 0, r);
				break;
			default: t.memoizedState = null;
		}
		return t.child;
	}
	function Ac(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), ql |= t.lanes, (n & t.childLanes) === 0) if (e !== null) {
			if (Zi(e, t, n, !1), (n & t.childLanes) === 0) return null;
		} else return null;
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = di(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = di(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function jc(e, t) {
		return (e.lanes & t) === 0 ? (e = e.dependencies, !!(e !== null && Qi(e))) : !0;
	}
	function Mc(e, t, n) {
		switch (t.tag) {
			case 3:
				pe(t, t.stateNode.containerInfo), qi(t, oa, e.memoizedState.cache), Vi();
				break;
			case 27:
			case 5:
				he(t);
				break;
			case 4:
				pe(t, t.stateNode.containerInfo);
				break;
			case 10:
				qi(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, ao(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (io(t), e = Ac(e, t, n), e === null ? null : e.sibling) : Cc(e, t, n) : (io(t), t.flags |= 128, null);
				io(t);
				break;
			case 19:
				var i = (e.flags & 128) != 0;
				if (r = (n & t.childLanes) !== 0, r ||= (Zi(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return kc(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), P(lo, lo.current), r) break;
				return null;
			case 22: return t.lanes = 0, lc(e, t, n, t.pendingProps);
			case 24: qi(t, oa, e.memoizedState.cache);
		}
		return Ac(e, t, n);
	}
	function Nc(e, t, n) {
		if (e !== null) if (e.memoizedProps !== t.pendingProps) ic = !0;
		else {
			if (!jc(e, n) && !(t.flags & 128)) return ic = !1, Mc(e, t, n);
			ic = !!(e.flags & 131072);
		}
		else ic = !1, B && t.flags & 1048576 && Ai(t, Ci, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = Da(t.elementType), t.type = e, typeof e == "function") ui(e) ? (r = qs(e, r), t.tag = 1, t = vc(null, t, e, r, n)) : (t.tag = 0, t = gc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === w) {
								t.tag = 11, t = oc(null, t, e, r, n);
								break a;
							} else if (a === D) {
								t.tag = 14, t = sc(null, t, e, r, n);
								break a;
							}
						}
						throw t = re(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return gc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = qs(r, t.pendingProps), vc(e, t, r, a, n);
			case 3:
				a: {
					if (pe(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, Va(e, t), Ja(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, qi(t, oa, r), r !== o.cache && Xi(t, [oa], n, !0), qa(), r = s.element, o.isDehydrated) if (o = {
						element: r,
						isDehydrated: !1,
						cache: s.cache
					}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
						t = yc(e, t, r, n);
						break a;
					} else if (r !== a) {
						a = yi(Error(i(424)), t), Ui(a), t = yc(e, t, r, n);
						break a;
					} else {
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (z = df(e.firstChild), R = t, B = !0, Pi = null, Fi = !0, n = Ra(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
					}
					else {
						if (Vi(), r === a) {
							t = Ac(e, t, n);
							break a;
						}
						ac(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return hc(e, t), e === null ? (n = Mf(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : B || (n = t.type, e = t.pendingProps, r = Ud(de.current).createElement(n), r[ut] = t, r[dt] = e, Ld(r, n, e), Ct(r), t.stateNode = r) : t.memoizedState = Mf(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return he(t), e === null && B && (r = t.stateNode = hf(t.type, t.pendingProps, de.current), R = t, Fi = !0, a = z, ef(t.type) ? (ff = a, z = df(r.firstChild)) : z = a), ac(e, t, t.pendingProps.children, n), hc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && B && ((a = r = z) && (r = af(r, t.type, t.pendingProps, Fi), r === null ? a = !1 : (t.stateNode = r, R = t, z = df(r.firstChild), Fi = !1, a = !0)), a || Li(t)), he(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, Kd(a, o) ? r = null : s !== null && Kd(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = wo(e, t, Do, null, null, n), tp._currentValue = a), hc(e, t), ac(e, t, r, n), t.child;
			case 6: return e === null && B && ((e = n = z) && (n = of(n, t.pendingProps, Fi), n === null ? e = !1 : (t.stateNode = n, R = t, z = null, e = !0)), e || Li(t)), null;
			case 13: return Cc(e, t, n);
			case 4: return pe(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = La(t, null, r, n) : ac(e, t, r, n), t.child;
			case 11: return oc(e, t, t.type, t.pendingProps, n);
			case 7: return ac(e, t, t.pendingProps, n), t.child;
			case 8: return ac(e, t, t.pendingProps.children, n), t.child;
			case 12: return ac(e, t, t.pendingProps.children, n), t.child;
			case 10: return r = t.pendingProps, qi(t, t.type, r.value), ac(e, t, r.children, n), t.child;
			case 9: return a = t.type._context, r = t.pendingProps.children, $i(t), a = ea(a), r = r(a), t.flags |= 1, ac(e, t, r, n), t.child;
			case 14: return sc(e, t, t.type, t.pendingProps, n);
			case 15: return cc(e, t, t.type, t.pendingProps, n);
			case 19: return kc(e, t, n);
			case 31: return mc(e, t, n);
			case 22: return lc(e, t, n, t.pendingProps);
			case 24: return $i(t), r = ea(oa), e === null ? (a = va(), a === null && (a = G, o = sa(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, Ba(t), qi(t, oa, a)) : ((e.lanes & n) !== 0 && (Va(e, t), Ja(t, null, null, n), qa()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, qi(t, oa, r), r !== a.cache && Xi(t, [oa], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), qi(t, oa, r))), ac(e, t, t.pendingProps.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function Pc(e) {
		e.flags |= 4;
	}
	function Fc(e, t, n, r, i) {
		if ((t = (e.mode & 32) != 0) && (t = !1), t) {
			if (e.flags |= 16777216, (i & 335544128) === i) if (e.stateNode.complete) e.flags |= 8192;
			else if (Eu()) e.flags |= 8192;
			else throw Oa = wa, Sa;
		} else e.flags &= -16777217;
	}
	function Ic(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !qf(t)) if (Eu()) e.flags |= 8192;
		else throw Oa = wa, Sa;
	}
	function Lc(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : Qe(), e.lanes |= t, Zl |= t);
	}
	function Rc(e, t) {
		if (!B) switch (e.tailMode) {
			case "hidden":
				t = e.tail;
				for (var n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
				break;
			case "collapsed":
				n = e.tail;
				for (var r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
		}
	}
	function zc(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function Bc(e, t, n) {
		var r = t.pendingProps;
		switch (Mi(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return zc(t), null;
			case 1: return zc(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Ji(oa), me(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Bi(t) ? Pc(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Hi())), zc(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (Pc(t), o === null ? (zc(t), Fc(t, a, null, r, n)) : (zc(t), Ic(t, o))) : o ? o === e.memoizedState ? (zc(t), t.flags &= -16777217) : (Pc(t), zc(t), Ic(t, o)) : (e = e.memoizedProps, e !== r && Pc(t), zc(t), Fc(t, a, e, r, n)), null;
			case 27:
				if (ge(t), n = de.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Pc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return zc(t), null;
					}
					e = le.current, Bi(t) ? Ri(t, e) : (e = hf(a, r, n), t.stateNode = e, Pc(t));
				}
				return zc(t), null;
			case 5:
				if (ge(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Pc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return zc(t), null;
					}
					if (o = le.current, Bi(t)) Ri(t, o);
					else {
						var s = Ud(de.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[ut] = t, o[dt] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (Ld(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && Pc(t);
					}
				}
				return zc(t), Fc(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && Pc(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = de.current, Bi(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = R, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[ut] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || Pd(e.nodeValue, n)), e || Li(t, !0);
					} else e = Ud(e).createTextNode(r), e[ut] = t, t.stateNode = e;
				}
				return zc(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = Bi(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[ut] = t;
						} else Vi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						zc(t), e = !1;
					} else n = Hi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (co(t), t) : (co(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return zc(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = Bi(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[ut] = t;
						} else Vi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						zc(t), a = !1;
					} else a = Hi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (co(t), t) : (co(t), null);
				}
				return co(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Lc(t, t.updateQueue), zc(t), null);
			case 4: return me(), e === null && wd(t.stateNode.containerInfo), zc(t), null;
			case 10: return Ji(t.type), zc(t), null;
			case 19:
				if (ce(lo), r = t.memoizedState, r === null) return zc(t), null;
				if (a = (t.flags & 128) != 0, o = r.rendering, o === null) if (a) Rc(r, !1);
				else {
					if (Kl !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
						if (o = uo(e), o !== null) {
							for (t.flags |= 128, Rc(r, !1), e = o.updateQueue, t.updateQueue = e, Lc(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) fi(n, e), n = n.sibling;
							return P(lo, lo.current & 1 | 2), B && ki(t, r.treeForkCount), t.child;
						}
						e = e.sibling;
					}
					r.tail !== null && ke() > ru && (t.flags |= 128, a = !0, Rc(r, !1), t.lanes = 4194304);
				}
				else {
					if (!a) if (e = uo(o), e !== null) {
						if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, Lc(t, e), Rc(r, !0), r.tail === null && r.tailMode === "hidden" && !o.alternate && !B) return zc(t), null;
					} else 2 * ke() - r.renderingStartTime > ru && n !== 536870912 && (t.flags |= 128, a = !0, Rc(r, !1), t.lanes = 4194304);
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				return r.tail === null ? (zc(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = ke(), e.sibling = null, n = lo.current, P(lo, a ? n & 1 | 2 : n & 1), B && ki(t, r.treeForkCount), e);
			case 22:
			case 23: return co(t), to(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (zc(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : zc(t), n = t.updateQueue, n !== null && Lc(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && ce(_a), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Ji(oa), zc(t), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(i(156, t.tag));
	}
	function Vc(e, t) {
		switch (Mi(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return Ji(oa), me(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return ge(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (co(t), t.alternate === null) throw Error(i(340));
					Vi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (co(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					Vi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return ce(lo), null;
			case 4: return me(), null;
			case 10: return Ji(t.type), null;
			case 22:
			case 23: return co(t), to(), e !== null && ce(_a), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return Ji(oa), null;
			case 25: return null;
			default: return null;
		}
	}
	function Hc(e, t) {
		switch (Mi(t), t.tag) {
			case 3:
				Ji(oa), me();
				break;
			case 26:
			case 27:
			case 5:
				ge(t);
				break;
			case 4:
				me();
				break;
			case 31:
				t.memoizedState !== null && co(t);
				break;
			case 13:
				co(t);
				break;
			case 19:
				ce(lo);
				break;
			case 10:
				Ji(t.type);
				break;
			case 22:
			case 23:
				co(t), to(), e !== null && ce(_a);
				break;
			case 24: Ji(oa);
		}
	}
	function Uc(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			Y(t, t.return, e);
		}
	}
	function Wc(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								Y(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			Y(t, t.return, e);
		}
	}
	function U(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				Xa(t, n);
			} catch (t) {
				Y(e, e.return, t);
			}
		}
	}
	function Gc(e, t, n) {
		n.props = qs(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Y(e, t, n);
		}
	}
	function Kc(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			Y(e, t, n);
		}
	}
	function qc(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) if (typeof r == "function") try {
			r();
		} catch (n) {
			Y(e, t, n);
		} finally {
			e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
		}
		else if (typeof n == "function") try {
			n(null);
		} catch (n) {
			Y(e, t, n);
		}
		else n.current = null;
	}
	function Jc(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			Y(e, e.return, t);
		}
	}
	function Yc(e, t, n) {
		try {
			var r = e.stateNode;
			Rd(r, e.type, n, t), r[dt] = t;
		} catch (t) {
			Y(e, e.return, t);
		}
	}
	function Xc(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && ef(e.type) || e.tag === 4;
	}
	function Zc(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Xc(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && ef(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Qc(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = nn));
		else if (r !== 4 && (r === 27 && ef(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null)) for (Qc(e, t, n), e = e.sibling; e !== null;) Qc(e, t, n), e = e.sibling;
	}
	function $c(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
		else if (r !== 4 && (r === 27 && ef(e.type) && (n = e.stateNode), e = e.child, e !== null)) for ($c(e, t, n), e = e.sibling; e !== null;) $c(e, t, n), e = e.sibling;
	}
	function el(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			Ld(t, r, n), t[ut] = e, t[dt] = n;
		} catch (t) {
			Y(e, e.return, t);
		}
	}
	var tl = !1, nl = !1, rl = !1, il = typeof WeakSet == "function" ? WeakSet : Set, al = null;
	function ol(e, t) {
		if (e = e.containerInfo, Vd = Z, e = Ar(e), jr(e)) {
			if ("selectionStart" in e) var n = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				n = (n = e.ownerDocument) && n.defaultView || window;
				var r = n.getSelection && n.getSelection();
				if (r && r.rangeCount !== 0) {
					n = r.anchorNode;
					var a = r.anchorOffset, o = r.focusNode;
					r = r.focusOffset;
					try {
						n.nodeType, o.nodeType;
					} catch {
						n = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== n || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || r !== 0 && f.nodeType !== 3 || (l = s + r), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === n && ++u === a && (c = s), p === o && ++d === r && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					n = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else n = null;
			}
			n ||= {
				start: 0,
				end: 0
			};
		} else n = null;
		for (Hd = {
			focusedElem: e,
			selectionRange: n
		}, Z = !1, al = t; al !== null;) if (t = al, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, al = e;
		else for (; al !== null;) {
			switch (t = al, o = t.alternate, e = t.flags, t.tag) {
				case 0:
					if (e & 4 && (e = t.updateQueue, e = e === null ? null : e.events, e !== null)) for (n = 0; n < e.length; n++) a = e[n], a.ref.impl = a.nextImpl;
					break;
				case 11:
				case 15: break;
				case 1:
					if (e & 1024 && o !== null) {
						e = void 0, n = t, a = o.memoizedProps, o = o.memoizedState, r = n.stateNode;
						try {
							var h = qs(n.type, a);
							e = r.getSnapshotBeforeUpdate(h, o), r.__reactInternalSnapshotBeforeUpdate = e;
						} catch (e) {
							Y(n, n.return, e);
						}
					}
					break;
				case 3:
					if (e & 1024) {
						if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9) rf(e);
						else if (n === 1) switch (e.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								rf(e);
								break;
							default: e.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				default: if (e & 1024) throw Error(i(163));
			}
			if (e = t.sibling, e !== null) {
				e.return = t.return, al = e;
				break;
			}
			al = t.return;
		}
	}
	function sl(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Sl(e, n), r & 4 && Uc(5, n);
				break;
			case 1:
				if (Sl(e, n), r & 4) if (e = n.stateNode, t === null) try {
					e.componentDidMount();
				} catch (e) {
					Y(n, n.return, e);
				}
				else {
					var i = qs(n.type, t.memoizedProps);
					t = t.memoizedState;
					try {
						e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
					} catch (e) {
						Y(n, n.return, e);
					}
				}
				r & 64 && U(n), r & 512 && Kc(n, n.return);
				break;
			case 3:
				if (Sl(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						Xa(e, t);
					} catch (e) {
						Y(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && el(n);
			case 26:
			case 5:
				Sl(e, n), t === null && r & 4 && Jc(n), r & 512 && Kc(n, n.return);
				break;
			case 12:
				Sl(e, n);
				break;
			case 31:
				Sl(e, n), r & 4 && pl(e, n);
				break;
			case 13:
				Sl(e, n), r & 4 && ml(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = Xu.bind(null, n), uf(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || tl, !r) {
					t = t !== null && t.memoizedState !== null || nl, i = tl;
					var a = nl;
					tl = r, (nl = t) && !a ? wl(e, n, (n.subtreeFlags & 8772) != 0) : Sl(e, n), tl = i, nl = a;
				}
				break;
			case 30: break;
			default: Sl(e, n);
		}
	}
	function cl(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, cl(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && vt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var ll = null, ul = !1;
	function dl(e, t, n) {
		for (n = n.child; n !== null;) fl(e, t, n), n = n.sibling;
	}
	function fl(e, t, n) {
		if (ze && typeof ze.onCommitFiberUnmount == "function") try {
			ze.onCommitFiberUnmount(Re, n);
		} catch {}
		switch (n.tag) {
			case 26:
				nl || qc(n, t), dl(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				nl || qc(n, t);
				var r = ll, i = ul;
				ef(n.type) && (ll = n.stateNode, ul = !1), dl(e, t, n), gf(n.stateNode), ll = r, ul = i;
				break;
			case 5: nl || qc(n, t);
			case 6:
				if (r = ll, i = ul, ll = null, dl(e, t, n), ll = r, ul = i, ll !== null) if (ul) try {
					(ll.nodeType === 9 ? ll.body : ll.nodeName === "HTML" ? ll.ownerDocument.body : ll).removeChild(n.stateNode);
				} catch (e) {
					Y(n, t, e);
				}
				else try {
					ll.removeChild(n.stateNode);
				} catch (e) {
					Y(n, t, e);
				}
				break;
			case 18:
				ll !== null && (ul ? (e = ll, tf(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Fp(e)) : tf(ll, n.stateNode));
				break;
			case 4:
				r = ll, i = ul, ll = n.stateNode.containerInfo, ul = !0, dl(e, t, n), ll = r, ul = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Wc(2, n, t), nl || Wc(4, n, t), dl(e, t, n);
				break;
			case 1:
				nl || (qc(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Gc(n, t, r)), dl(e, t, n);
				break;
			case 21:
				dl(e, t, n);
				break;
			case 22:
				nl = (r = nl) || n.memoizedState !== null, dl(e, t, n), nl = r;
				break;
			default: dl(e, t, n);
		}
	}
	function pl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Fp(e);
			} catch (e) {
				Y(t, t.return, e);
			}
		}
	}
	function ml(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Fp(e);
		} catch (e) {
			Y(t, t.return, e);
		}
	}
	function hl(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new il()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new il()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function gl(e, t) {
		var n = hl(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = Zu.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function _l(e, t) {
		var n = t.deletions;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var a = n[r], o = e, s = t, c = s;
			a: for (; c !== null;) {
				switch (c.tag) {
					case 27:
						if (ef(c.type)) {
							ll = c.stateNode, ul = !1;
							break a;
						}
						break;
					case 5:
						ll = c.stateNode, ul = !1;
						break a;
					case 3:
					case 4:
						ll = c.stateNode.containerInfo, ul = !0;
						break a;
				}
				c = c.return;
			}
			if (ll === null) throw Error(i(160));
			fl(o, s, a), ll = null, ul = !1, o = a.alternate, o !== null && (o.return = null), a.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) yl(t, e), t = t.sibling;
	}
	var vl = null;
	function yl(e, t) {
		var n = e.alternate, r = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				_l(t, e), bl(e), r & 4 && (Wc(3, e, e.return), Uc(3, e), Wc(5, e, e.return));
				break;
			case 1:
				_l(t, e), bl(e), r & 512 && (nl || n === null || qc(n, n.return)), r & 64 && tl && (e = e.updateQueue, e !== null && (r = e.callbacks, r !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? r : n.concat(r))));
				break;
			case 26:
				var a = vl;
				if (_l(t, e), bl(e), r & 512 && (nl || n === null || qc(n, n.return)), r & 4) {
					var o = n === null ? null : n.memoizedState;
					if (r = e.memoizedState, n === null) if (r === null) if (e.stateNode === null) {
						a: {
							r = e.type, n = e.memoizedProps, a = a.ownerDocument || a;
							b: switch (r) {
								case "title":
									o = a.getElementsByTagName("title")[0], (!o || o[_t] || o[ut] || o.namespaceURI === "http://www.w3.org/2000/svg" || o.hasAttribute("itemprop")) && (o = a.createElement(r), a.head.insertBefore(o, a.querySelector("head > title"))), Ld(o, r, n), o[ut] = e, Ct(o), r = o;
									break a;
								case "link":
									var s = Wf("link", "href", a).get(r + (n.href || ""));
									if (s) {
										for (var c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && o.getAttribute("rel") === (n.rel == null ? null : n.rel) && o.getAttribute("title") === (n.title == null ? null : n.title) && o.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
											s.splice(c, 1);
											break b;
										}
									}
									o = a.createElement(r), Ld(o, r, n), a.head.appendChild(o);
									break;
								case "meta":
									if (s = Wf("meta", "content", a).get(r + (n.content || ""))) {
										for (c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("content") === (n.content == null ? null : "" + n.content) && o.getAttribute("name") === (n.name == null ? null : n.name) && o.getAttribute("property") === (n.property == null ? null : n.property) && o.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && o.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
											s.splice(c, 1);
											break b;
										}
									}
									o = a.createElement(r), Ld(o, r, n), a.head.appendChild(o);
									break;
								default: throw Error(i(468, r));
							}
							o[ut] = e, Ct(o), r = o;
						}
						e.stateNode = r;
					} else Gf(a, e.type, e.stateNode);
					else e.stateNode = zf(a, r, e.memoizedProps);
					else o === r ? r === null && e.stateNode !== null && Yc(e, e.memoizedProps, n.memoizedProps) : (o === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : o.count--, r === null ? Gf(a, e.type, e.stateNode) : zf(a, r, e.memoizedProps));
				}
				break;
			case 27:
				_l(t, e), bl(e), r & 512 && (nl || n === null || qc(n, n.return)), n !== null && r & 4 && Yc(e, e.memoizedProps, n.memoizedProps);
				break;
			case 5:
				if (_l(t, e), bl(e), r & 512 && (nl || n === null || qc(n, n.return)), e.flags & 32) {
					a = e.stateNode;
					try {
						Jt(a, "");
					} catch (t) {
						Y(e, e.return, t);
					}
				}
				r & 4 && e.stateNode != null && (a = e.memoizedProps, Yc(e, a, n === null ? a : n.memoizedProps)), r & 1024 && (rl = !0);
				break;
			case 6:
				if (_l(t, e), bl(e), r & 4) {
					if (e.stateNode === null) throw Error(i(162));
					r = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = r;
					} catch (t) {
						Y(e, e.return, t);
					}
				}
				break;
			case 3:
				if (Uf = null, a = vl, vl = yf(t.containerInfo), _l(t, e), vl = a, bl(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
					Fp(t.containerInfo);
				} catch (t) {
					Y(e, e.return, t);
				}
				rl && (rl = !1, xl(e));
				break;
			case 4:
				r = vl, vl = yf(e.stateNode.containerInfo), _l(t, e), bl(e), vl = r;
				break;
			case 12:
				_l(t, e), bl(e);
				break;
			case 31:
				_l(t, e), bl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, gl(e, r)));
				break;
			case 13:
				_l(t, e), bl(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (tu = ke()), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, gl(e, r)));
				break;
			case 22:
				a = e.memoizedState !== null;
				var l = n !== null && n.memoizedState !== null, u = tl, d = nl;
				if (tl = u || a, nl = d || l, _l(t, e), nl = d, tl = u, bl(e), r & 8192) a: for (t = e.stateNode, t._visibility = a ? t._visibility & -2 : t._visibility | 1, a && (n === null || l || tl || nl || Cl(e)), n = null, t = e;;) {
					if (t.tag === 5 || t.tag === 26) {
						if (n === null) {
							l = n = t;
							try {
								if (o = l.stateNode, a) s = o.style, typeof s.setProperty == "function" ? s.setProperty("display", "none", "important") : s.display = "none";
								else {
									c = l.stateNode;
									var f = l.memoizedProps.style, p = f != null && f.hasOwnProperty("display") ? f.display : null;
									c.style.display = p == null || typeof p == "boolean" ? "" : ("" + p).trim();
								}
							} catch (e) {
								Y(l, l.return, e);
							}
						}
					} else if (t.tag === 6) {
						if (n === null) {
							l = t;
							try {
								l.stateNode.nodeValue = a ? "" : l.memoizedProps;
							} catch (e) {
								Y(l, l.return, e);
							}
						}
					} else if (t.tag === 18) {
						if (n === null) {
							l = t;
							try {
								var m = l.stateNode;
								a ? nf(m, !0) : nf(l.stateNode, !1);
							} catch (e) {
								Y(l, l.return, e);
							}
						}
					} else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
						t.child.return = t, t = t.child;
						continue;
					}
					if (t === e) break a;
					for (; t.sibling === null;) {
						if (t.return === null || t.return === e) break a;
						n === t && (n = null), t = t.return;
					}
					n === t && (n = null), t.sibling.return = t.return, t = t.sibling;
				}
				r & 4 && (r = e.updateQueue, r !== null && (n = r.retryQueue, n !== null && (r.retryQueue = null, gl(e, n))));
				break;
			case 19:
				_l(t, e), bl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, gl(e, r)));
				break;
			case 30: break;
			case 21: break;
			default: _l(t, e), bl(e);
		}
	}
	function bl(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Xc(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var a = n.stateNode;
						$c(e, Zc(e), a);
						break;
					case 5:
						var o = n.stateNode;
						n.flags & 32 && (Jt(o, ""), n.flags &= -33), $c(e, Zc(e), o);
						break;
					case 3:
					case 4:
						var s = n.stateNode.containerInfo;
						Qc(e, Zc(e), s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				Y(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function xl(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			xl(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
		}
	}
	function Sl(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) sl(e, t.alternate, t), t = t.sibling;
	}
	function Cl(e) {
		for (e = e.child; e !== null;) {
			var t = e;
			switch (t.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Wc(4, t, t.return), Cl(t);
					break;
				case 1:
					qc(t, t.return);
					var n = t.stateNode;
					typeof n.componentWillUnmount == "function" && Gc(t, t.return, n), Cl(t);
					break;
				case 27: gf(t.stateNode);
				case 26:
				case 5:
					qc(t, t.return), Cl(t);
					break;
				case 22:
					t.memoizedState === null && Cl(t);
					break;
				case 30:
					Cl(t);
					break;
				default: Cl(t);
			}
			e = e.sibling;
		}
	}
	function wl(e, t, n) {
		for (n &&= (t.subtreeFlags & 8772) != 0, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags;
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					wl(i, a, n), Uc(4, a);
					break;
				case 1:
					if (wl(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Y(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var s = r.stateNode;
						try {
							var c = i.shared.hiddenCallbacks;
							if (c !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < c.length; i++) Ya(c[i], s);
						} catch (e) {
							Y(r, r.return, e);
						}
					}
					n && o & 64 && U(a), Kc(a, a.return);
					break;
				case 27: el(a);
				case 26:
				case 5:
					wl(i, a, n), n && r === null && o & 4 && Jc(a), Kc(a, a.return);
					break;
				case 12:
					wl(i, a, n);
					break;
				case 31:
					wl(i, a, n), n && o & 4 && pl(i, a);
					break;
				case 13:
					wl(i, a, n), n && o & 4 && ml(i, a);
					break;
				case 22:
					a.memoizedState === null && wl(i, a, n), Kc(a, a.return);
					break;
				case 30: break;
				default: wl(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Tl(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && ca(n));
	}
	function El(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ca(e));
	}
	function Dl(e, t, n, r) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) Ol(e, t, n, r), t = t.sibling;
	}
	function Ol(e, t, n, r) {
		var i = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Dl(e, t, n, r), i & 2048 && Uc(9, t);
				break;
			case 1:
				Dl(e, t, n, r);
				break;
			case 3:
				Dl(e, t, n, r), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ca(e)));
				break;
			case 12:
				if (i & 2048) {
					Dl(e, t, n, r), e = t.stateNode;
					try {
						var a = t.memoizedProps, o = a.id, s = a.onPostCommit;
						typeof s == "function" && s(o, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
					} catch (e) {
						Y(t, t.return, e);
					}
				} else Dl(e, t, n, r);
				break;
			case 31:
				Dl(e, t, n, r);
				break;
			case 13:
				Dl(e, t, n, r);
				break;
			case 23: break;
			case 22:
				a = t.stateNode, o = t.alternate, t.memoizedState === null ? a._visibility & 2 ? Dl(e, t, n, r) : (a._visibility |= 2, kl(e, t, n, r, (t.subtreeFlags & 10256) != 0 || !1)) : a._visibility & 2 ? Dl(e, t, n, r) : Al(e, t), i & 2048 && Tl(o, t);
				break;
			case 24:
				Dl(e, t, n, r), i & 2048 && El(t.alternate, t);
				break;
			default: Dl(e, t, n, r);
		}
	}
	function kl(e, t, n, r, i) {
		for (i &&= (t.subtreeFlags & 10256) != 0 || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					kl(a, o, s, c, i), Uc(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, kl(a, o, s, c, i)) : u._visibility & 2 ? kl(a, o, s, c, i) : Al(a, o), i && l & 2048 && Tl(o.alternate, o);
					break;
				case 24:
					kl(a, o, s, c, i), i && l & 2048 && El(o.alternate, o);
					break;
				default: kl(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Al(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Al(n, r), i & 2048 && Tl(r.alternate, r);
					break;
				case 24:
					Al(n, r), i & 2048 && El(r.alternate, r);
					break;
				default: Al(n, r);
			}
			t = t.sibling;
		}
	}
	var jl = 8192;
	function Ml(e, t, n) {
		if (e.subtreeFlags & jl) for (e = e.child; e !== null;) Nl(e, t, n), e = e.sibling;
	}
	function Nl(e, t, n) {
		switch (e.tag) {
			case 26:
				Ml(e, t, n), e.flags & jl && e.memoizedState !== null && Jf(n, vl, e.memoizedState, e.memoizedProps);
				break;
			case 5:
				Ml(e, t, n);
				break;
			case 3:
			case 4:
				var r = vl;
				vl = yf(e.stateNode.containerInfo), Ml(e, t, n), vl = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = jl, jl = 16777216, Ml(e, t, n), jl = r) : Ml(e, t, n));
				break;
			default: Ml(e, t, n);
		}
	}
	function Pl(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Fl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				al = r, Rl(r, e);
			}
			Pl(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Il(e), e = e.sibling;
	}
	function Il(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Fl(e), e.flags & 2048 && Wc(9, e, e.return);
				break;
			case 3:
				Fl(e);
				break;
			case 12:
				Fl(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Ll(e)) : Fl(e);
				break;
			default: Fl(e);
		}
	}
	function Ll(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				al = r, Rl(r, e);
			}
			Pl(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Wc(8, t, t.return), Ll(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Ll(t));
					break;
				default: Ll(t);
			}
			e = e.sibling;
		}
	}
	function Rl(e, t) {
		for (; al !== null;) {
			var n = al;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Wc(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: ca(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, al = r;
			else a: for (n = e; al !== null;) {
				r = al;
				var i = r.sibling, a = r.return;
				if (cl(r), r === n) {
					al = null;
					break a;
				}
				if (i !== null) {
					i.return = a, al = i;
					break a;
				}
				al = a;
			}
		}
	}
	var zl = {
		getCacheForType: function(e) {
			var t = ea(oa), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return ea(oa).controller.signal;
		}
	}, Bl = typeof WeakMap == "function" ? WeakMap : Map, W = 0, G = null, K = null, q = 0, J = 0, Vl = null, Hl = !1, Ul = !1, Wl = !1, Gl = 0, Kl = 0, ql = 0, Jl = 0, Yl = 0, Xl = 0, Zl = 0, Ql = null, $l = null, eu = !1, tu = 0, nu = 0, ru = Infinity, iu = null, au = null, ou = 0, su = null, cu = null, lu = 0, uu = 0, du = null, fu = null, pu = 0, mu = null;
	function hu() {
		return W & 2 && q !== 0 ? q & -q : j.T === null ? st() : pd();
	}
	function gu() {
		if (Xl === 0) if (!(q & 536870912) || B) {
			var e = Ke;
			Ke <<= 1, !(Ke & 3932160) && (Ke = 262144), Xl = e;
		} else Xl = 536870912;
		return e = no.current, e !== null && (e.flags |= 32), Xl;
	}
	function _u(e, t, n) {
		(e === G && (J === 2 || J === 9) || e.cancelPendingCommit !== null) && (wu(e, 0), xu(e, q, Xl, !1)), et(e, n), (!(W & 2) || e !== G) && (e === G && (!(W & 2) && (Jl |= n), Kl === 4 && xu(e, q, Xl, !1)), ad(e));
	}
	function vu(e, t, n) {
		if (W & 6) throw Error(i(327));
		var r = !n && (t & 127) == 0 && (t & e.expiredLanes) === 0 || Xe(e, t), a = r ? Mu(e, t) : Au(e, t, !0), o = r;
		do {
			if (a === 0) {
				Ul && !r && xu(e, t, 0, !1);
				break;
			} else {
				if (n = e.current.alternate, o && !bu(n)) {
					a = Au(e, t, !1), o = !1;
					continue;
				}
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = Ql;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (wu(c, s).flags |= 256), s = Au(c, s, !1), s !== 2) {
								if (Wl && !l) {
									c.errorRecoveryDisabledLanes |= o, Jl |= o, a = 4;
									break a;
								}
								o = $l, $l = a, o !== null && ($l === null ? $l = o : $l.push.apply($l, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					wu(e, 0), xu(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t) break;
						case 6:
							xu(r, t, Xl, !Hl);
							break a;
						case 2:
							$l = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = tu + 300 - ke(), 10 < a)) {
						if (xu(r, t, Xl, !Hl), Ye(r, 0, !0) !== 0) break a;
						lu = t, r.timeoutHandle = Yd(yu.bind(null, r, n, $l, iu, eu, t, Xl, Jl, Zl, Hl, o, "Throttled", -0, 0), a);
						break a;
					}
					yu(r, n, $l, iu, eu, t, Xl, Jl, Zl, Hl, o, null, -0, 0);
				}
			}
			break;
		} while (1);
		ad(e);
	}
	function yu(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		if (e.timeoutHandle = -1, d = t.subtreeFlags, d & 8192 || (d & 16785408) == 16785408) {
			d = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: nn
			}, Nl(t, a, d);
			var m = (a & 62914560) === a ? tu - ke() : (a & 4194048) === a ? nu - ke() : 0;
			if (m = Xf(d, m), m !== null) {
				lu = a, e.cancelPendingCommit = m(zu.bind(null, e, t, a, n, r, i, o, s, c, u, d, null, f, p)), xu(e, a, o, !l);
				return;
			}
		}
		zu(e, t, a, n, r, i, o, s, c);
	}
	function bu(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Tr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function xu(e, t, n, r) {
		t &= ~Yl, t &= ~Jl, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - Ve(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && nt(e, n, t);
	}
	function Su() {
		return W & 6 ? !0 : (od(0, !1), !1);
	}
	function Cu() {
		if (K !== null) {
			if (J === 0) var e = K.return;
			else e = K, Ki = Gi = null, Ao(e), ja = null, Ma = 0, e = K;
			for (; e !== null;) Hc(e.alternate, e), e = e.return;
			K = null;
		}
	}
	function wu(e, t) {
		var n = e.timeoutHandle;
		n !== -1 && (e.timeoutHandle = -1, Xd(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), lu = 0, Cu(), G = e, K = n = di(e.current, null), q = t, J = 0, Vl = null, Hl = !1, Ul = Xe(e, t), Wl = !1, Zl = Xl = Yl = Jl = ql = Kl = 0, $l = Ql = null, eu = !1, t & 8 && (t |= t & 32);
		var r = e.entangledLanes;
		if (r !== 0) for (e = e.entanglements, r &= t; 0 < r;) {
			var i = 31 - Ve(r), a = 1 << i;
			t |= e[i], r &= ~a;
		}
		return Gl = t, ni(), n;
	}
	function Tu(e, t) {
		V = null, j.H = zs, t === xa || t === Ca ? (t = ka(), J = 3) : t === Sa ? (t = ka(), J = 4) : J = t === rc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, Vl = t, K === null && (Kl = 1, Zs(e, yi(t, e.current)));
	}
	function Eu() {
		var e = no.current;
		return e === null ? !0 : (q & 4194048) === q ? ro === null : (q & 62914560) === q || q & 536870912 ? e === ro : !1;
	}
	function Du() {
		var e = j.H;
		return j.H = zs, e === null ? zs : e;
	}
	function Ou() {
		var e = j.A;
		return j.A = zl, e;
	}
	function ku() {
		Kl = 4, Hl || (q & 4194048) !== q && no.current !== null || (Ul = !0), !(ql & 134217727) && !(Jl & 134217727) || G === null || xu(G, q, Xl, !1);
	}
	function Au(e, t, n) {
		var r = W;
		W |= 2;
		var i = Du(), a = Ou();
		(G !== e || q !== t) && (iu = null, wu(e, t)), t = !1;
		var o = Kl;
		a: do
			try {
				if (J !== 0 && K !== null) {
					var s = K, c = Vl;
					switch (J) {
						case 8:
							Cu(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							no.current === null && (t = !0);
							var l = J;
							if (J = 0, Vl = null, Iu(e, s, c, l), n && Ul) {
								o = 0;
								break a;
							}
							break;
						default: l = J, J = 0, Vl = null, Iu(e, s, c, l);
					}
				}
				ju(), o = Kl;
				break;
			} catch (t) {
				Tu(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, Ki = Gi = null, W = r, j.H = i, j.A = a, K === null && (G = null, q = 0, ni()), o;
	}
	function ju() {
		for (; K !== null;) Pu(K);
	}
	function Mu(e, t) {
		var n = W;
		W |= 2;
		var r = Du(), a = Ou();
		G !== e || q !== t ? (iu = null, ru = ke() + 500, wu(e, t)) : Ul = Xe(e, t);
		a: do
			try {
				if (J !== 0 && K !== null) {
					t = K;
					var o = Vl;
					b: switch (J) {
						case 1:
							J = 0, Vl = null, Iu(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Ta(o)) {
								J = 0, Vl = null, Fu(t);
								break;
							}
							t = function() {
								J !== 2 && J !== 9 || G !== e || (J = 7), ad(e);
							}, o.then(t, t);
							break a;
						case 3:
							J = 7;
							break a;
						case 4:
							J = 5;
							break a;
						case 7:
							Ta(o) ? (J = 0, Vl = null, Fu(t)) : (J = 0, Vl = null, Iu(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (K.tag) {
								case 26: s = K.memoizedState;
								case 5:
								case 27:
									var c = K;
									if (s ? qf(s) : c.stateNode.complete) {
										J = 0, Vl = null;
										var l = c.sibling;
										if (l !== null) K = l;
										else {
											var u = c.return;
											u === null ? K = null : (K = u, Lu(u));
										}
										break b;
									}
							}
							J = 0, Vl = null, Iu(e, t, o, 5);
							break;
						case 6:
							J = 0, Vl = null, Iu(e, t, o, 6);
							break;
						case 8:
							Cu(), Kl = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Nu();
				break;
			} catch (t) {
				Tu(e, t);
			}
		while (1);
		return Ki = Gi = null, j.H = r, j.A = a, W = n, K === null ? (G = null, q = 0, ni(), Kl) : 0;
	}
	function Nu() {
		for (; K !== null && !De();) Pu(K);
	}
	function Pu(e) {
		var t = Nc(e.alternate, e, Gl);
		e.memoizedProps = e.pendingProps, t === null ? Lu(e) : K = t;
	}
	function Fu(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = _c(n, t, t.pendingProps, t.type, void 0, q);
				break;
			case 11:
				t = _c(n, t, t.pendingProps, t.type.render, t.ref, q);
				break;
			case 5: Ao(t);
			default: Hc(n, t), t = K = fi(t, Gl), t = Nc(n, t, Gl);
		}
		e.memoizedProps = e.pendingProps, t === null ? Lu(e) : K = t;
	}
	function Iu(e, t, n, r) {
		Ki = Gi = null, Ao(t), ja = null, Ma = 0;
		var i = t.return;
		try {
			if (nc(e, i, t, n, q)) {
				Kl = 1, Zs(e, yi(n, e.current)), K = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw K = i, t;
			Kl = 1, Zs(e, yi(n, e.current)), K = null;
			return;
		}
		t.flags & 32768 ? (B || r === 1 ? e = !0 : Ul || q & 536870912 ? e = !1 : (Hl = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = no.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Ru(t, e)) : Lu(t);
	}
	function Lu(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				Ru(t, Hl);
				return;
			}
			e = t.return;
			var n = Bc(t.alternate, t, Gl);
			if (n !== null) {
				K = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				K = t;
				return;
			}
			K = t = e;
		} while (t !== null);
		Kl === 0 && (Kl = 5);
	}
	function Ru(e, t) {
		do {
			var n = Vc(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, K = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				K = e;
				return;
			}
			K = e = n;
		} while (e !== null);
		Kl = 6, K = null;
	}
	function zu(e, t, n, r, a, o, s, c, l) {
		e.cancelPendingCommit = null;
		do
			Wu();
		while (ou !== 0);
		if (W & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			if (o = t.lanes | t.childLanes, o |= ti, tt(e, n, o, s, c, l), e === G && (K = G = null, q = 0), cu = t, su = e, lu = n, uu = o, du = a, fu = r, t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, Qu(Ne, function() {
				return Gu(), null;
			})) : (e.callbackNode = null, e.callbackPriority = 0), r = (t.flags & 13878) != 0, t.subtreeFlags & 13878 || r) {
				r = j.T, j.T = null, a = M.p, M.p = 2, s = W, W |= 4;
				try {
					ol(e, t, n);
				} finally {
					W = s, M.p = a, j.T = r;
				}
			}
			ou = 1, Bu(), Vu(), Hu();
		}
	}
	function Bu() {
		if (ou === 1) {
			ou = 0;
			var e = su, t = cu, n = (t.flags & 13878) != 0;
			if (t.subtreeFlags & 13878 || n) {
				n = j.T, j.T = null;
				var r = M.p;
				M.p = 2;
				var i = W;
				W |= 4;
				try {
					yl(t, e);
					var a = Hd, o = Ar(e.containerInfo), s = a.focusedElem, c = a.selectionRange;
					if (o !== s && s && s.ownerDocument && kr(s.ownerDocument.documentElement, s)) {
						if (c !== null && jr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Or(s, h), v = Or(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					Z = !!Vd, Hd = Vd = null;
				} finally {
					W = i, M.p = r, j.T = n;
				}
			}
			e.current = t, ou = 2;
		}
	}
	function Vu() {
		if (ou === 2) {
			ou = 0;
			var e = su, t = cu, n = (t.flags & 8772) != 0;
			if (t.subtreeFlags & 8772 || n) {
				n = j.T, j.T = null;
				var r = M.p;
				M.p = 2;
				var i = W;
				W |= 4;
				try {
					sl(e, t.alternate, t);
				} finally {
					W = i, M.p = r, j.T = n;
				}
			}
			ou = 3;
		}
	}
	function Hu() {
		if (ou === 4 || ou === 3) {
			ou = 0, Oe();
			var e = su, t = cu, n = lu, r = fu;
			t.subtreeFlags & 10256 || t.flags & 10256 ? ou = 5 : (ou = 0, cu = su = null, Uu(e, e.pendingLanes));
			var i = e.pendingLanes;
			if (i === 0 && (au = null), ot(n), t = t.stateNode, ze && typeof ze.onCommitFiberRoot == "function") try {
				ze.onCommitFiberRoot(Re, t, void 0, (t.current.flags & 128) == 128);
			} catch {}
			if (r !== null) {
				t = j.T, i = M.p, M.p = 2, j.T = null;
				try {
					for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
						var s = r[o];
						a(s.value, { componentStack: s.stack });
					}
				} finally {
					j.T = t, M.p = i;
				}
			}
			lu & 3 && Wu(), ad(e), i = e.pendingLanes, n & 261930 && i & 42 ? e === mu ? pu++ : (pu = 0, mu = e) : pu = 0, od(0, !1);
		}
	}
	function Uu(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, ca(t)));
	}
	function Wu() {
		return Bu(), Vu(), Hu(), Gu();
	}
	function Gu() {
		if (ou !== 5) return !1;
		var e = su, t = uu;
		uu = 0;
		var n = ot(lu), r = j.T, a = M.p;
		try {
			M.p = 32 > n ? 32 : n, j.T = null, n = du, du = null;
			var o = su, s = lu;
			if (ou = 0, cu = su = null, lu = 0, W & 6) throw Error(i(331));
			var c = W;
			if (W |= 4, Il(o.current), Ol(o, o.current, s, n), W = c, od(0, !1), ze && typeof ze.onPostCommitFiberRoot == "function") try {
				ze.onPostCommitFiberRoot(Re, o);
			} catch {}
			return !0;
		} finally {
			M.p = a, j.T = r, Uu(e, t);
		}
	}
	function Ku(e, t, n) {
		t = yi(n, t), t = $s(e.stateNode, t, 2), e = Ua(e, t, 2), e !== null && (et(e, 2), ad(e));
	}
	function Y(e, t, n) {
		if (e.tag === 3) Ku(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				Ku(t, e, n);
				break;
			} else if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (au === null || !au.has(r))) {
					e = yi(n, e), n = ec(2), r = Ua(t, n, 2), r !== null && (tc(n, r, t, e), et(r, 2), ad(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function qu(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new Bl();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (Wl = !0, i.add(n), e = Ju.bind(null, e, t, n), t.then(e, e));
	}
	function Ju(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, G === e && (q & n) === n && (Kl === 4 || Kl === 3 && (q & 62914560) === q && 300 > ke() - tu ? !(W & 2) && wu(e, 0) : Yl |= n, Zl === q && (Zl = 0)), ad(e);
	}
	function Yu(e, t) {
		t === 0 && (t = Qe()), e = ii(e, t), e !== null && (et(e, t), ad(e));
	}
	function Xu(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), Yu(e, n);
	}
	function Zu(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), Yu(e, n);
	}
	function Qu(e, t) {
		return Te(e, t);
	}
	var $u = null, ed = null, td = !1, nd = !1, rd = !1, id = 0;
	function ad(e) {
		e !== ed && e.next === null && (ed === null ? $u = ed = e : ed = ed.next = e), nd = !0, td || (td = !0, fd());
	}
	function od(e, t) {
		if (!rd && nd) {
			rd = !0;
			do
				for (var n = !1, r = $u; r !== null;) {
					if (!t) if (e !== 0) {
						var i = r.pendingLanes;
						if (i === 0) var a = 0;
						else {
							var o = r.suspendedLanes, s = r.pingedLanes;
							a = (1 << 31 - Ve(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
						}
						a !== 0 && (n = !0, dd(r, a));
					} else a = q, a = Ye(r, r === G ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || Xe(r, a) || (n = !0, dd(r, a));
					r = r.next;
				}
			while (n);
			rd = !1;
		}
	}
	function sd() {
		cd();
	}
	function cd() {
		nd = td = !1;
		var e = 0;
		id !== 0 && Jd() && (e = id);
		for (var t = ke(), n = null, r = $u; r !== null;) {
			var i = r.next, a = ld(r, t);
			a === 0 ? (r.next = null, n === null ? $u = i : n.next = i, i === null && (ed = n)) : (n = r, (e !== 0 || a & 3) && (nd = !0)), r = i;
		}
		ou !== 0 && ou !== 5 || od(e, !1), id !== 0 && (id = 0);
	}
	function ld(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - Ve(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = Ze(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = G, n = q, n = Ye(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (J === 2 || J === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Ee(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || Xe(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Ee(r), ot(n)) {
				case 2:
				case 8:
					n = Me;
					break;
				case 32:
					n = Ne;
					break;
				case 268435456:
					n = Fe;
					break;
				default: n = Ne;
			}
			return r = ud.bind(null, e), n = Te(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Ee(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function ud(e, t) {
		if (ou !== 0 && ou !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (Wu() && e.callbackNode !== n) return null;
		var r = q;
		return r = Ye(e, e === G ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (vu(e, r, t), ld(e, ke()), e.callbackNode != null && e.callbackNode === n ? ud.bind(null, e) : null);
	}
	function dd(e, t) {
		if (Wu()) return null;
		vu(e, t, !0);
	}
	function fd() {
		Qd(function() {
			W & 6 ? Te(je, sd) : cd();
		});
	}
	function pd() {
		if (id === 0) {
			var e = da;
			e === 0 && (e = Ge, Ge <<= 1, !(Ge & 261888) && (Ge = 256)), id = e;
		}
		return id;
	}
	function md(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : tn("" + e);
	}
	function hd(e, t) {
		var n = t.ownerDocument.createElement("input");
		return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
	}
	function gd(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = md((i[dt] || null).action), o = r.submitter;
			o && (t = (t = o[dt] || null) ? md(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new wn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (id !== 0) {
								var e = o ? hd(i, o) : new FormData(i);
								Ts(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = o ? hd(i, o) : new FormData(i), Ts(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var _d = 0; _d < Xr.length; _d++) {
		var vd = Xr[_d];
		Zr(vd.toLowerCase(), "on" + (vd[0].toUpperCase() + vd.slice(1)));
	}
	Zr(Ur, "onAnimationEnd"), Zr(Wr, "onAnimationIteration"), Zr(I, "onAnimationStart"), Zr("dblclick", "onDoubleClick"), Zr("focusin", "onFocus"), Zr("focusout", "onBlur"), Zr(Gr, "onTransitionRun"), Zr(Kr, "onTransitionStart"), Zr(qr, "onTransitionCancel"), Zr(Jr, "onTransitionEnd"), Dt("onMouseEnter", ["mouseout", "mouseover"]), Dt("onMouseLeave", ["mouseout", "mouseover"]), Dt("onPointerEnter", ["pointerout", "pointerover"]), Dt("onPointerLeave", ["pointerout", "pointerover"]), Et("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Et("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Et("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Et("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Et("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Et("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var yd = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), bd = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(yd));
	function xd(e, t) {
		t = (t & 4) != 0;
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Qr(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Qr(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function X(e, t) {
		var n = t[pt];
		n === void 0 && (n = t[pt] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Td(t, e, 2, !1), n.add(r));
	}
	function Sd(e, t, n) {
		var r = 0;
		t && (r |= 4), Td(n, e, r, t);
	}
	var Cd = "_reactListening" + Math.random().toString(36).slice(2);
	function wd(e) {
		if (!e[Cd]) {
			e[Cd] = !0, wt.forEach(function(t) {
				t !== "selectionchange" && (bd.has(t) || Sd(t, !1, e), Sd(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Cd] || (t[Cd] = !0, Sd("selectionchange", !1, t));
		}
	}
	function Td(e, t, n, r) {
		switch (gp(t)) {
			case 2:
				var i = up;
				break;
			case 8:
				i = dp;
				break;
			default: i = fp;
		}
		n = i.bind(null, t, n, e), i = void 0, !pn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Ed(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = yt(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		un(function() {
			var r = a, i = an(n), s = [];
			a: {
				var c = Yr.get(e);
				if (c !== void 0) {
					var l = wn, u = e;
					switch (e) {
						case "keypress": if (yn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Hn;
							break;
						case "focusin":
							u = "focus", l = Nn;
							break;
						case "focusout":
							u = "blur", l = Nn;
							break;
						case "beforeblur":
						case "afterblur":
							l = Nn;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = jn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Mn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = Wn;
							break;
						case Ur:
						case Wr:
						case I:
							l = Pn;
							break;
						case Jr:
							l = Gn;
							break;
						case "scroll":
						case "scrollend":
							l = En;
							break;
						case "wheel":
							l = Kn;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Fn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = Un;
							break;
						case "toggle":
						case "beforetoggle": l = qn;
					}
					var d = (t & 4) != 0, f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = dn(m, p), g != null && d.push(Dd(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (c = e === "mouseover" || e === "pointerover", l = e === "mouseout" || e === "pointerout", c && n !== rn && (u = n.relatedTarget || n.fromElement) && (yt(u) || u[ft])) break a;
					if ((l || c) && (c = i.window === i ? i : (c = i.ownerDocument) ? c.defaultView || c.parentWindow : window, l ? (u = n.relatedTarget || n.toElement, l = r, u = u ? yt(u) : null, u !== null && (f = o(u), d = u.tag, u !== f || d !== 5 && d !== 27 && d !== 6) && (u = null)) : (l = null, u = r), l !== u)) {
						if (d = jn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = Un, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = l == null ? c : xt(l), h = u == null ? c : xt(u), c = new d(g, m + "leave", l, n, i), c.target = f, c.relatedTarget = h, g = null, yt(i) === r && (d = new d(p, m + "enter", u, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, l && u) b: {
							for (d = kd, p = l, m = u, h = 0, g = p; g; g = d(g)) h++;
							g = 0;
							for (var _ = m; _; _ = d(_)) g++;
							for (; 0 < h - g;) p = d(p), h--;
							for (; 0 < g - h;) m = d(m), g--;
							for (; h--;) {
								if (p === m || m !== null && p === m.alternate) {
									d = p;
									break b;
								}
								p = d(p), m = d(m);
							}
							d = null;
						}
						else d = null;
						l !== null && Ad(s, c, l, d, !1), u !== null && f !== null && Ad(s, f, u, d, !0);
					}
				}
				a: {
					if (c = r ? xt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var v = pr;
					else if (sr(c)) if (mr) v = Cr;
					else {
						v = xr;
						var y = br;
					}
					else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && Qt(r.elementType) && (v = pr) : v = Sr;
					if (v &&= v(e, r)) {
						cr(s, v, n, i);
						break a;
					}
					y && y(e, c, r), e === "focusout" && r && c.type === "number" && r.memoizedProps.value != null && Wt(c, "number", c.value);
				}
				switch (y = r ? xt(r) : window, e) {
					case "focusin":
						(sr(y) || y.contentEditable === "true") && (Nr = y, Pr = r, Fr = null);
						break;
					case "focusout":
						Fr = Pr = Nr = null;
						break;
					case "mousedown":
						Ir = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Ir = !1, Lr(s, n, i);
						break;
					case "selectionchange": if (Mr) break;
					case "keydown":
					case "keyup": Lr(s, n, i);
				}
				var b;
				if (Yn) b: {
					switch (e) {
						case "compositionstart":
							var x = "onCompositionStart";
							break b;
						case "compositionend":
							x = "onCompositionEnd";
							break b;
						case "compositionupdate":
							x = "onCompositionUpdate";
							break b;
					}
					x = void 0;
				}
				else rr ? tr(e, n) && (x = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (x = "onCompositionStart");
				x && (Qn && n.locale !== "ko" && (rr || x !== "onCompositionStart" ? x === "onCompositionEnd" && rr && (b = vn()) : (hn = i, gn = "value" in hn ? hn.value : hn.textContent, rr = !0)), y = Od(r, x), 0 < y.length && (x = new In(x, e, null, n, i), s.push({
					event: x,
					listeners: y
				}), b ? x.data = b : (b = nr(n), b !== null && (x.data = b)))), (b = Zn ? ir(e, n) : ar(e, n)) && (x = Od(r, "onBeforeInput"), 0 < x.length && (y = new In("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: y,
					listeners: x
				}), y.data = b)), gd(s, e, r, n, i);
			}
			xd(s, t);
		});
	}
	function Dd(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Od(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = dn(e, n), i != null && r.unshift(Dd(e, i, a)), i = dn(e, t), i != null && r.push(Dd(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function kd(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Ad(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = dn(n, a), l != null && o.unshift(Dd(n, l, c))) : i || (l = dn(n, a), l != null && o.push(Dd(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var jd = /\r\n?/g, Md = /\u0000|\uFFFD/g;
	function Nd(e) {
		return (typeof e == "string" ? e : "" + e).replace(jd, "\n").replace(Md, "");
	}
	function Pd(e, t) {
		return t = Nd(t), Nd(e) === t;
	}
	function Fd(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				typeof r == "string" ? t === "body" || t === "textarea" && r === "" || Jt(e, r) : (typeof r == "number" || typeof r == "bigint") && t !== "body" && Jt(e, "" + r);
				break;
			case "className":
				Nt(e, "class", r);
				break;
			case "tabIndex":
				Nt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Nt(e, n, r);
				break;
			case "style":
				Zt(e, r, o);
				break;
			case "data": if (t !== "object") {
				Nt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href")) {
					e.removeAttribute(n);
					break;
				}
				if (r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = tn("" + r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				} else typeof o == "function" && (n === "formAction" ? (t !== "input" && Fd(e, t, "name", a.name, a, null), Fd(e, t, "formEncType", a.formEncType, a, null), Fd(e, t, "formMethod", a.formMethod, a, null), Fd(e, t, "formTarget", a.formTarget, a, null)) : (Fd(e, t, "encType", a.encType, a, null), Fd(e, t, "method", a.method, a, null), Fd(e, t, "target", a.target, a, null)));
				if (r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = tn("" + r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = nn);
				break;
			case "onScroll":
				r != null && X("scroll", e);
				break;
			case "onScrollEnd":
				r != null && X("scrollend", e);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						e.innerHTML = n;
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = tn("" + r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "" + r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				X("beforetoggle", e), X("toggle", e), Mt(e, "popover", r);
				break;
			case "xlinkActuate":
				Pt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Pt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Pt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Pt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Pt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Pt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Pt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Pt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Pt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Mt(e, "is", r);
				break;
			case "innerText":
			case "textContent": break;
			default: (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = $t.get(n) || n, Mt(e, n, r));
		}
	}
	function Id(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				Zt(e, r, o);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						e.innerHTML = n;
					}
				}
				break;
			case "children":
				typeof r == "string" ? Jt(e, r) : (typeof r == "number" || typeof r == "bigint") && Jt(e, "" + r);
				break;
			case "onScroll":
				r != null && X("scroll", e);
				break;
			case "onScrollEnd":
				r != null && X("scrollend", e);
				break;
			case "onClick":
				r != null && (e.onclick = nn);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": break;
			case "innerText":
			case "textContent": break;
			default: if (!Tt.hasOwnProperty(n)) a: {
				if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), t = n.slice(2, a ? n.length - 7 : void 0), o = e[dt] || null, o = o == null ? null : o[n], typeof o == "function" && e.removeEventListener(t, o, a), typeof r == "function")) {
					typeof o != "function" && o !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, r, a);
					break a;
				}
				n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Mt(e, n, r);
			}
		}
	}
	function Ld(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				X("error", e), X("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: Fd(e, t, o, s, n, null);
					}
				}
				a && Fd(e, t, "srcSet", n.srcSet, n, null), r && Fd(e, t, "src", n.src, n, null);
				return;
			case "input":
				X("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: Fd(e, t, r, d, n, null);
					}
				}
				F(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in X("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: Fd(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && Gt(e, !!r, n, !0) : Gt(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in X("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: Fd(e, t, s, c, n, null);
				}
				qt(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: Fd(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				X("beforetoggle", e), X("toggle", e), X("cancel", e), X("close", e);
				break;
			case "iframe":
			case "object":
				X("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < yd.length; r++) X(yd[r], e);
				break;
			case "image":
				X("error", e), X("load", e);
				break;
			case "details":
				X("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": X("error", e), X("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: Fd(e, t, u, r, n, null);
				}
				return;
			default: if (Qt(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && Id(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && Fd(e, t, c, r, n, null));
	}
	function Rd(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || Fd(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							o = m;
							break;
						case "name":
							a = m;
							break;
						case "checked":
							u = m;
							break;
						case "defaultChecked":
							d = m;
							break;
						case "value":
							s = m;
							break;
						case "defaultValue":
							c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && Fd(e, t, p, m, r, f);
					}
				}
				Ut(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || Fd(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						p = o;
						break;
					case "defaultValue":
						c = o;
						break;
					case "multiple": s = o;
					default: o !== l && Fd(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? Gt(e, !!n, n ? [] : "", !1) : Gt(e, !!n, t, !0)) : Gt(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: Fd(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						p = a;
						break;
					case "defaultValue":
						m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && Fd(e, t, s, a, r, o);
				}
				Kt(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: Fd(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: Fd(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && Fd(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: Fd(e, t, u, p, r, m);
				}
				return;
			default: if (Qt(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && Id(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || Id(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && Fd(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || Fd(e, t, f, p, r, m);
	}
	function zd(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function Bd() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && zd(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && zd(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var Vd = null, Hd = null;
	function Ud(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function Wd(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function Gd(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function Kd(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var qd = null;
	function Jd() {
		var e = window.event;
		return e && e.type === "popstate" ? e === qd ? !1 : (qd = e, !0) : (qd = null, !1);
	}
	var Yd = typeof setTimeout == "function" ? setTimeout : void 0, Xd = typeof clearTimeout == "function" ? clearTimeout : void 0, Zd = typeof Promise == "function" ? Promise : void 0, Qd = typeof queueMicrotask == "function" ? queueMicrotask : Zd === void 0 ? Yd : function(e) {
		return Zd.resolve(null).then(e).catch($d);
	};
	function $d(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function ef(e) {
		return e === "head";
	}
	function tf(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) if (n = i.data, n === "/$" || n === "/&") {
				if (r === 0) {
					e.removeChild(i), Fp(t);
					return;
				}
				r--;
			} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
			else if (n === "html") gf(e.ownerDocument.documentElement);
			else if (n === "head") {
				n = e.ownerDocument.head, gf(n);
				for (var a = n.firstChild; a;) {
					var o = a.nextSibling, s = a.nodeName;
					a[_t] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
				}
			} else n === "body" && gf(e.ownerDocument.body);
			n = i;
		} while (n);
		Fp(t);
	}
	function nf(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) if (n = r.data, n === "/$") {
				if (e === 0) break;
				e--;
			} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			n = r;
		} while (n);
	}
	function rf(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					rf(n), vt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function af(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) if (t === "input" && e.type === "hidden") {
				var a = i.name == null ? null : "" + i.name;
				if (i.type === "hidden" && e.getAttribute("name") === a) return e;
			} else return e;
			else if (!e[_t]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = df(e.nextSibling), e === null) break;
		}
		return null;
	}
	function of(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = df(e.nextSibling), e === null)) return null;
		return e;
	}
	function sf(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = df(e.nextSibling), e === null)) return null;
		return e;
	}
	function cf(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function lf(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function uf(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function df(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var ff = null;
	function pf(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return df(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function mf(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function hf(e, t, n) {
		switch (t = Ud(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function gf(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		vt(e);
	}
	var _f = /* @__PURE__ */ new Map(), vf = /* @__PURE__ */ new Set();
	function yf(e) {
		return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
	}
	var bf = M.d;
	M.d = {
		f: xf,
		r: Sf,
		D: Tf,
		C: Ef,
		L: Df,
		m: Of,
		X: Af,
		S: kf,
		M: jf
	};
	function xf() {
		var e = bf.f(), t = Su();
		return e || t;
	}
	function Sf(e) {
		var t = bt(e);
		t !== null && t.tag === 5 && t.type === "form" ? Ds(t) : bf.r(e);
	}
	var Cf = typeof document > "u" ? null : document;
	function wf(e, t, n) {
		var r = Cf;
		if (r && typeof t == "string" && t) {
			var i = Ht(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), vf.has(i) || (vf.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), Ld(t, "link", e), Ct(t), r.head.appendChild(t)));
		}
	}
	function Tf(e) {
		bf.D(e), wf("dns-prefetch", e, null);
	}
	function Ef(e, t) {
		bf.C(e, t), wf("preconnect", e, t);
	}
	function Df(e, t, n) {
		bf.L(e, t, n);
		var r = Cf;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + Ht(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + Ht(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + Ht(n.imageSizes) + "\"]")) : i += "[href=\"" + Ht(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Nf(e);
					break;
				case "script": a = Lf(e);
			}
			_f.has(a) || (e = m({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), _f.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Pf(a)) || t === "script" && r.querySelector(Rf(a)) || (t = r.createElement("link"), Ld(t, "link", e), Ct(t), r.head.appendChild(t)));
		}
	}
	function Of(e, t) {
		bf.m(e, t);
		var n = Cf;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + Ht(r) + "\"][href=\"" + Ht(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Lf(e);
			}
			if (!_f.has(a) && (e = m({
				rel: "modulepreload",
				href: e
			}, t), _f.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(Rf(a))) return;
				}
				r = n.createElement("link"), Ld(r, "link", e), Ct(r), n.head.appendChild(r);
			}
		}
	}
	function kf(e, t, n) {
		bf.S(e, t, n);
		var r = Cf;
		if (r && e) {
			var i = St(r).hoistableStyles, a = Nf(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Pf(a))) s.loading = 5;
				else {
					e = m({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = _f.get(a)) && Vf(e, n);
					var c = o = r.createElement("link");
					Ct(c), Ld(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Bf(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function Af(e, t) {
		bf.X(e, t);
		var n = Cf;
		if (n && e) {
			var r = St(n).hoistableScripts, i = Lf(e), a = r.get(i);
			a || (a = n.querySelector(Rf(i)), a || (e = m({
				src: e,
				async: !0
			}, t), (t = _f.get(i)) && Hf(e, t), a = n.createElement("script"), Ct(a), Ld(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function jf(e, t) {
		bf.M(e, t);
		var n = Cf;
		if (n && e) {
			var r = St(n).hoistableScripts, i = Lf(e), a = r.get(i);
			a || (a = n.querySelector(Rf(i)), a || (e = m({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = _f.get(i)) && Hf(e, t), a = n.createElement("script"), Ct(a), Ld(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Mf(e, t, n, r) {
		var a = (a = de.current) ? yf(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (t = Nf(n.href), n = St(a).hoistableStyles, r = n.get(t), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, n.set(t, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Nf(n.href);
					var o = St(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Pf(e))) && !o._p && (s.instance = o, s.state.loading = 5), _f.has(e) || (n = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, _f.set(e, n), o || If(a, e, n, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Lf(n), n = St(a).hoistableScripts, r = n.get(t), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, n.set(t, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function Nf(e) {
		return "href=\"" + Ht(e) + "\"";
	}
	function Pf(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Ff(e) {
		return m({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function If(e, t, n, r) {
		e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]") ? r.loading = 1 : (t = e.createElement("link"), r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		}), Ld(t, "link", n), Ct(t), e.head.appendChild(t));
	}
	function Lf(e) {
		return "[src=\"" + Ht(e) + "\"]";
	}
	function Rf(e) {
		return "script[async]" + e;
	}
	function zf(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + Ht(n.href) + "\"]");
				if (r) return t.instance = r, Ct(r), r;
				var a = m({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), Ct(r), Ld(r, "style", a), Bf(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Nf(n.href);
				var o = e.querySelector(Pf(a));
				if (o) return t.state.loading |= 4, t.instance = o, Ct(o), o;
				r = Ff(n), (a = _f.get(a)) && Vf(r, a), o = (e.ownerDocument || e).createElement("link"), Ct(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), Ld(o, "link", r), t.state.loading |= 4, Bf(o, n.precedence, e), t.instance = o;
			case "script": return o = Lf(n.src), (a = e.querySelector(Rf(o))) ? (t.instance = a, Ct(a), a) : (r = n, (a = _f.get(o)) && (r = m({}, n), Hf(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), Ct(a), Ld(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Bf(r, n.precedence, e));
		return t.instance;
	}
	function Bf(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Vf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Hf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Uf = null;
	function Wf(e, t, n) {
		if (Uf === null) {
			var r = /* @__PURE__ */ new Map(), i = Uf = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Uf, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[_t] || a[ut] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Gf(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function Kf(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function qf(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Jf(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Nf(r.href), a = t.querySelector(Pf(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = Zf.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, Ct(a);
					return;
				}
				a = t.ownerDocument || t, r = Ff(r), (i = _f.get(i)) && Vf(r, i), a = a.createElement("link"), Ct(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), Ld(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = Zf.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var Yf = 0;
	function Xf(e, t) {
		return e.stylesheets && e.count === 0 && $f(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && $f(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && Yf === 0 && (Yf = 62500 * Bd());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && $f(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > Yf ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function Zf() {
		if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
			if (this.stylesheets) $f(this, this.stylesheets);
			else if (this.unsuspend) {
				var e = this.unsuspend;
				this.unsuspend = null, e();
			}
		}
	}
	var Qf = null;
	function $f(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, Qf = /* @__PURE__ */ new Map(), t.forEach(ep, e), Qf = null, Zf.call(e));
	}
	function ep(e, t) {
		if (!(t.state.loading & 4)) {
			var n = Qf.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), Qf.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = Zf.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var tp = {
		$$typeof: C,
		Provider: null,
		Consumer: null,
		_currentValue: ae,
		_currentValue2: ae,
		_threadCount: 0
	};
	function np(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = $e(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = $e(0), this.hiddenUpdates = $e(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function rp(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new np(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = li(3, null, null, t), e.current = a, a.stateNode = e, t = sa(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, Ba(a), e;
	}
	function ip(e) {
		return e ? (e = si, e) : si;
	}
	function ap(e, t, n, r, i, a) {
		i = ip(i), r.context === null ? r.context = i : r.pendingContext = i, r = Ha(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = Ua(e, r, t), n !== null && (_u(n, e, t), Wa(n, e, t));
	}
	function op(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function sp(e, t) {
		op(e, t), (e = e.alternate) && op(e, t);
	}
	function cp(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = ii(e, 67108864);
			t !== null && _u(t, e, 67108864), sp(e, 67108864);
		}
	}
	function lp(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = hu();
			t = at(t);
			var n = ii(e, t);
			n !== null && _u(n, e, t), sp(e, t);
		}
	}
	var Z = !0;
	function up(e, t, n, r) {
		var i = j.T;
		j.T = null;
		var a = M.p;
		try {
			M.p = 2, fp(e, t, n, r);
		} finally {
			M.p = a, j.T = i;
		}
	}
	function dp(e, t, n, r) {
		var i = j.T;
		j.T = null;
		var a = M.p;
		try {
			M.p = 8, fp(e, t, n, r);
		} finally {
			M.p = a, j.T = i;
		}
	}
	function fp(e, t, n, r) {
		if (Z) {
			var i = pp(r);
			if (i === null) Ed(e, t, r, mp, n), Tp(e, r);
			else if (Dp(i, e, t, n, r)) r.stopPropagation();
			else if (Tp(e, r), t & 4 && -1 < wp.indexOf(e)) {
				for (; i !== null;) {
					var a = bt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = Je(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - Ve(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									ad(a), !(W & 6) && (ru = ke() + 500, od(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = ii(a, 2), s !== null && _u(s, a, 2), Su(), sp(a, 2);
					}
					if (a = pp(r), a === null && Ed(e, t, r, mp, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Ed(e, t, r, null, n);
		}
	}
	function pp(e) {
		return e = an(e), hp(e);
	}
	var mp = null;
	function hp(e) {
		if (mp = null, e = yt(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return mp = e, null;
	}
	function gp(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "resize":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Ae()) {
				case je: return 2;
				case Me: return 8;
				case Ne:
				case Pe: return 32;
				case Fe: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var _p = !1, vp = null, yp = null, bp = null, xp = /* @__PURE__ */ new Map(), Sp = /* @__PURE__ */ new Map(), Cp = [], wp = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Tp(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				vp = null;
				break;
			case "dragenter":
			case "dragleave":
				yp = null;
				break;
			case "mouseover":
			case "mouseout":
				bp = null;
				break;
			case "pointerover":
			case "pointerout":
				xp.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": Sp.delete(t.pointerId);
		}
	}
	function Ep(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = bt(t), t !== null && cp(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Dp(e, t, n, r, i) {
		switch (t) {
			case "focusin": return vp = Ep(vp, e, t, n, r, i), !0;
			case "dragenter": return yp = Ep(yp, e, t, n, r, i), !0;
			case "mouseover": return bp = Ep(bp, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return xp.set(a, Ep(xp.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, Sp.set(a, Ep(Sp.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Op(e) {
		var t = yt(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, ct(e.priority, function() {
							lp(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, ct(e.priority, function() {
							lp(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function kp(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = pp(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				rn = r, n.target.dispatchEvent(r), rn = null;
			} else return t = bt(n), t !== null && cp(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Ap(e, t, n) {
		kp(e) && n.delete(t);
	}
	function jp() {
		_p = !1, vp !== null && kp(vp) && (vp = null), yp !== null && kp(yp) && (yp = null), bp !== null && kp(bp) && (bp = null), xp.forEach(Ap), Sp.forEach(Ap);
	}
	function Mp(e, n) {
		e.blockedOn === n && (e.blockedOn = null, _p || (_p = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, jp)));
	}
	var Np = null;
	function Pp(e) {
		Np !== e && (Np = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Np === e && (Np = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (hp(r || n) === null) continue;
					break;
				}
				var a = bt(n);
				a !== null && (e.splice(t, 3), t -= 3, Ts(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Fp(e) {
		function t(t) {
			return Mp(t, e);
		}
		vp !== null && Mp(vp, e), yp !== null && Mp(yp, e), bp !== null && Mp(bp, e), xp.forEach(t), Sp.forEach(t);
		for (var n = 0; n < Cp.length; n++) {
			var r = Cp[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < Cp.length && (n = Cp[0], n.blockedOn === null);) Op(n), n.blockedOn === null && Cp.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[dt] || null;
			if (typeof a == "function") o || Pp(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[dt] || null) s = o.formAction;
					else if (hp(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Pp(n);
			}
		}
	}
	function Ip() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Lp(e) {
		this._internalRoot = e;
	}
	Rp.prototype.render = Lp.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		ap(n, hu(), e, t, null, null);
	}, Rp.prototype.unmount = Lp.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			ap(e.current, 2, null, e, null, null), Su(), t[ft] = null;
		}
	};
	function Rp(e) {
		this._internalRoot = e;
	}
	Rp.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = st();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < Cp.length && t !== 0 && t < Cp[n].priority; n++);
			Cp.splice(n, 0, e), n === 0 && Op(e);
		}
	};
	var zp = n.version;
	if (zp !== "19.2.6") throw Error(i(527, zp, "19.2.6"));
	M.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = u(t), e = e === null ? null : f(e), e = e === null ? null : e.stateNode, e;
	};
	var Bp = {
		bundleType: 0,
		version: "19.2.6",
		rendererPackageName: "react-dom",
		currentDispatcherRef: j,
		reconcilerVersion: "19.2.6"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Vp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Vp.isDisabled && Vp.supportsFiber) try {
			Re = Vp.inject(Bp), ze = Vp;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = Js, s = Ys, c = Xs;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = rp(e, 1, !1, null, null, n, r, null, o, s, c, Ip), e[ft] = t.current, wd(e), new Lp(t);
	};
})), _ = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = g();
}));
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function v(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = v(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function y() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = v(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/recharts/es6/util/excludeEventProps.js
var b = /* @__PURE__ */ "dangerouslySetInnerHTML.onCopy.onCopyCapture.onCut.onCutCapture.onPaste.onPasteCapture.onCompositionEnd.onCompositionEndCapture.onCompositionStart.onCompositionStartCapture.onCompositionUpdate.onCompositionUpdateCapture.onFocus.onFocusCapture.onBlur.onBlurCapture.onChange.onChangeCapture.onBeforeInput.onBeforeInputCapture.onInput.onInputCapture.onReset.onResetCapture.onSubmit.onSubmitCapture.onInvalid.onInvalidCapture.onLoad.onLoadCapture.onError.onErrorCapture.onKeyDown.onKeyDownCapture.onKeyPress.onKeyPressCapture.onKeyUp.onKeyUpCapture.onAbort.onAbortCapture.onCanPlay.onCanPlayCapture.onCanPlayThrough.onCanPlayThroughCapture.onDurationChange.onDurationChangeCapture.onEmptied.onEmptiedCapture.onEncrypted.onEncryptedCapture.onEnded.onEndedCapture.onLoadedData.onLoadedDataCapture.onLoadedMetadata.onLoadedMetadataCapture.onLoadStart.onLoadStartCapture.onPause.onPauseCapture.onPlay.onPlayCapture.onPlaying.onPlayingCapture.onProgress.onProgressCapture.onRateChange.onRateChangeCapture.onSeeked.onSeekedCapture.onSeeking.onSeekingCapture.onStalled.onStalledCapture.onSuspend.onSuspendCapture.onTimeUpdate.onTimeUpdateCapture.onVolumeChange.onVolumeChangeCapture.onWaiting.onWaitingCapture.onAuxClick.onAuxClickCapture.onClick.onClickCapture.onContextMenu.onContextMenuCapture.onDoubleClick.onDoubleClickCapture.onDrag.onDragCapture.onDragEnd.onDragEndCapture.onDragEnter.onDragEnterCapture.onDragExit.onDragExitCapture.onDragLeave.onDragLeaveCapture.onDragOver.onDragOverCapture.onDragStart.onDragStartCapture.onDrop.onDropCapture.onMouseDown.onMouseDownCapture.onMouseEnter.onMouseLeave.onMouseMove.onMouseMoveCapture.onMouseOut.onMouseOutCapture.onMouseOver.onMouseOverCapture.onMouseUp.onMouseUpCapture.onSelect.onSelectCapture.onTouchCancel.onTouchCancelCapture.onTouchEnd.onTouchEndCapture.onTouchMove.onTouchMoveCapture.onTouchStart.onTouchStartCapture.onPointerDown.onPointerDownCapture.onPointerMove.onPointerMoveCapture.onPointerUp.onPointerUpCapture.onPointerCancel.onPointerCancelCapture.onPointerEnter.onPointerEnterCapture.onPointerLeave.onPointerLeaveCapture.onPointerOver.onPointerOverCapture.onPointerOut.onPointerOutCapture.onGotPointerCapture.onGotPointerCaptureCapture.onLostPointerCapture.onLostPointerCaptureCapture.onScroll.onScrollCapture.onWheel.onWheelCapture.onAnimationStart.onAnimationStartCapture.onAnimationEnd.onAnimationEndCapture.onAnimationIteration.onAnimationIterationCapture.onTransitionEnd.onTransitionEndCapture".split(".");
function x(e) {
	return typeof e == "string" ? b.includes(e) : !1;
}
//#endregion
//#region node_modules/recharts/es6/util/svgPropertiesNoEvents.js
var S = /* @__PURE__ */ l(d()), C = new Set(/* @__PURE__ */ "aria-activedescendant.aria-atomic.aria-autocomplete.aria-busy.aria-checked.aria-colcount.aria-colindex.aria-colspan.aria-controls.aria-current.aria-describedby.aria-details.aria-disabled.aria-errormessage.aria-expanded.aria-flowto.aria-haspopup.aria-hidden.aria-invalid.aria-keyshortcuts.aria-label.aria-labelledby.aria-level.aria-live.aria-modal.aria-multiline.aria-multiselectable.aria-orientation.aria-owns.aria-placeholder.aria-posinset.aria-pressed.aria-readonly.aria-relevant.aria-required.aria-roledescription.aria-rowcount.aria-rowindex.aria-rowspan.aria-selected.aria-setsize.aria-sort.aria-valuemax.aria-valuemin.aria-valuenow.aria-valuetext.className.color.height.id.lang.max.media.method.min.name.style.target.width.role.tabIndex.accentHeight.accumulate.additive.alignmentBaseline.allowReorder.alphabetic.amplitude.arabicForm.ascent.attributeName.attributeType.autoReverse.azimuth.baseFrequency.baselineShift.baseProfile.bbox.begin.bias.by.calcMode.capHeight.clip.clipPath.clipPathUnits.clipRule.colorInterpolation.colorInterpolationFilters.colorProfile.colorRendering.contentScriptType.contentStyleType.cursor.cx.cy.d.decelerate.descent.diffuseConstant.direction.display.divisor.dominantBaseline.dur.dx.dy.edgeMode.elevation.enableBackground.end.exponent.externalResourcesRequired.fill.fillOpacity.fillRule.filter.filterRes.filterUnits.floodColor.floodOpacity.focusable.fontFamily.fontSize.fontSizeAdjust.fontStretch.fontStyle.fontVariant.fontWeight.format.from.fx.fy.g1.g2.glyphName.glyphOrientationHorizontal.glyphOrientationVertical.glyphRef.gradientTransform.gradientUnits.hanging.horizAdvX.horizOriginX.href.ideographic.imageRendering.in2.in.intercept.k1.k2.k3.k4.k.kernelMatrix.kernelUnitLength.kerning.keyPoints.keySplines.keyTimes.lengthAdjust.letterSpacing.lightingColor.limitingConeAngle.local.markerEnd.markerHeight.markerMid.markerStart.markerUnits.markerWidth.mask.maskContentUnits.maskUnits.mathematical.mode.numOctaves.offset.opacity.operator.order.orient.orientation.origin.overflow.overlinePosition.overlineThickness.paintOrder.panose1.pathLength.patternContentUnits.patternTransform.patternUnits.pointerEvents.pointsAtX.pointsAtY.pointsAtZ.preserveAlpha.preserveAspectRatio.primitiveUnits.r.radius.refX.refY.renderingIntent.repeatCount.repeatDur.requiredExtensions.requiredFeatures.restart.result.rotate.rx.ry.seed.shapeRendering.slope.spacing.specularConstant.specularExponent.speed.spreadMethod.startOffset.stdDeviation.stemh.stemv.stitchTiles.stopColor.stopOpacity.strikethroughPosition.strikethroughThickness.string.stroke.strokeDasharray.strokeDashoffset.strokeLinecap.strokeLinejoin.strokeMiterlimit.strokeOpacity.strokeWidth.surfaceScale.systemLanguage.tableValues.targetX.targetY.textAnchor.textDecoration.textLength.textRendering.to.transform.u1.u2.underlinePosition.underlineThickness.unicode.unicodeBidi.unicodeRange.unitsPerEm.vAlphabetic.values.vectorEffect.version.vertAdvY.vertOriginX.vertOriginY.vHanging.vIdeographic.viewTarget.visibility.vMathematical.widths.wordSpacing.writingMode.x1.x2.x.xChannelSelector.xHeight.xlinkActuate.xlinkArcrole.xlinkHref.xlinkRole.xlinkShow.xlinkTitle.xlinkType.xmlBase.xmlLang.xmlns.xmlnsXlink.xmlSpace.y1.y2.y.yChannelSelector.z.zoomAndPan.ref.key.angle".split("."));
function w(e) {
	return typeof e == "string" ? C.has(e) : !1;
}
function T(e) {
	return typeof e == "string" && e.startsWith("data-");
}
function E(e) {
	if (typeof e != "object" || !e) return {};
	var t = {};
	for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (w(n) || T(n)) && (t[n] = e[n]);
	return t;
}
function D(e) {
	if (e == null) return null;
	if (/* @__PURE__ */ (0, S.isValidElement)(e) && typeof e.props == "object" && e.props !== null) {
		var t = e.props;
		return E(t);
	}
	return typeof e == "object" && !Array.isArray(e) ? E(e) : null;
}
//#endregion
//#region node_modules/recharts/es6/util/svgPropertiesAndEvents.js
function O(e) {
	var t = {};
	for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (w(n) || T(n) || x(n)) && (t[n] = e[n]);
	return t;
}
function k(e) {
	return e == null ? null : /* @__PURE__ */ (0, S.isValidElement)(e) ? O(e.props) : typeof e == "object" && !Array.isArray(e) ? O(e) : null;
}
//#endregion
//#region node_modules/recharts/es6/container/Surface.js
var ee = [
	"children",
	"width",
	"height",
	"viewBox",
	"className",
	"style",
	"title",
	"desc"
];
function te() {
	return te = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, te.apply(null, arguments);
}
function ne(e, t) {
	if (e == null) return {};
	var n, r, i = A(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function A(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var re = /* @__PURE__ */ (0, S.forwardRef)((e, t) => {
	var { children: n, width: r, height: i, viewBox: a, className: o, style: s, title: c, desc: l } = e, u = ne(e, ee), d = a || {
		width: r,
		height: i,
		x: 0,
		y: 0
	}, f = y("recharts-surface", o);
	return /* @__PURE__ */ S.createElement("svg", te({}, O(u), {
		className: f,
		width: r,
		height: i,
		style: s,
		viewBox: `${d.x} ${d.y} ${d.width} ${d.height}`,
		ref: t
	}), /* @__PURE__ */ S.createElement("title", null, c), /* @__PURE__ */ S.createElement("desc", null, l), n);
}), ie = ["children", "className"];
function j() {
	return j = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, j.apply(null, arguments);
}
function M(e, t) {
	if (e == null) return {};
	var n, r, i = ae(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function ae(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var oe = /* @__PURE__ */ S.forwardRef((e, t) => {
	var { children: n, className: r } = e, i = M(e, ie), a = y("recharts-layer", r);
	return /* @__PURE__ */ S.createElement("g", j({ className: a }, O(i), { ref: t }), n);
}), se = /* @__PURE__ */ (0, S.createContext)(null);
//#endregion
//#region node_modules/d3-shape/src/constant.js
function N(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-shape/src/math.js
var ce = Math.cos, P = Math.sin, le = Math.sqrt, ue = Math.PI;
ue / 2;
var de = 2 * ue, fe = Math.PI, pe = 2 * fe, me = 1e-6, he = pe - me;
function ge(e) {
	this._ += e[0];
	for (let t = 1, n = e.length; t < n; ++t) this._ += arguments[t] + e[t];
}
function _e(e) {
	let t = Math.floor(e);
	if (!(t >= 0)) throw Error(`invalid digits: ${e}`);
	if (t > 15) return ge;
	let n = 10 ** t;
	return function(e) {
		this._ += e[0];
		for (let t = 1, r = e.length; t < r; ++t) this._ += Math.round(arguments[t] * n) / n + e[t];
	};
}
var ve = class {
	constructor(e) {
		this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "", this._append = e == null ? ge : _e(e);
	}
	moveTo(e, t) {
		this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +t}`;
	}
	closePath() {
		this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._append`Z`);
	}
	lineTo(e, t) {
		this._append`L${this._x1 = +e},${this._y1 = +t}`;
	}
	quadraticCurveTo(e, t, n, r) {
		this._append`Q${+e},${+t},${this._x1 = +n},${this._y1 = +r}`;
	}
	bezierCurveTo(e, t, n, r, i, a) {
		this._append`C${+e},${+t},${+n},${+r},${this._x1 = +i},${this._y1 = +a}`;
	}
	arcTo(e, t, n, r, i) {
		if (e = +e, t = +t, n = +n, r = +r, i = +i, i < 0) throw Error(`negative radius: ${i}`);
		let a = this._x1, o = this._y1, s = n - e, c = r - t, l = a - e, u = o - t, d = l * l + u * u;
		if (this._x1 === null) this._append`M${this._x1 = e},${this._y1 = t}`;
		else if (d > me) if (!(Math.abs(u * s - c * l) > me) || !i) this._append`L${this._x1 = e},${this._y1 = t}`;
		else {
			let f = n - a, p = r - o, m = s * s + c * c, h = f * f + p * p, g = Math.sqrt(m), _ = Math.sqrt(d), v = i * Math.tan((fe - Math.acos((m + d - h) / (2 * g * _))) / 2), y = v / _, b = v / g;
			Math.abs(y - 1) > me && this._append`L${e + y * l},${t + y * u}`, this._append`A${i},${i},0,0,${+(u * f > l * p)},${this._x1 = e + b * s},${this._y1 = t + b * c}`;
		}
	}
	arc(e, t, n, r, i, a) {
		if (e = +e, t = +t, n = +n, a = !!a, n < 0) throw Error(`negative radius: ${n}`);
		let o = n * Math.cos(r), s = n * Math.sin(r), c = e + o, l = t + s, u = 1 ^ a, d = a ? r - i : i - r;
		this._x1 === null ? this._append`M${c},${l}` : (Math.abs(this._x1 - c) > me || Math.abs(this._y1 - l) > me) && this._append`L${c},${l}`, n && (d < 0 && (d = d % pe + pe), d > he ? this._append`A${n},${n},0,1,${u},${e - o},${t - s}A${n},${n},0,1,${u},${this._x1 = c},${this._y1 = l}` : d > me && this._append`A${n},${n},0,${+(d >= fe)},${u},${this._x1 = e + n * Math.cos(i)},${this._y1 = t + n * Math.sin(i)}`);
	}
	rect(e, t, n, r) {
		this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +t}h${n = +n}v${+r}h${-n}Z`;
	}
	toString() {
		return this._;
	}
};
function ye() {
	return new ve();
}
ye.prototype = ve.prototype;
//#endregion
//#region node_modules/d3-shape/src/path.js
function be(e) {
	let t = 3;
	return e.digits = function(n) {
		if (!arguments.length) return t;
		if (n == null) t = null;
		else {
			let e = Math.floor(n);
			if (!(e >= 0)) throw RangeError(`invalid digits: ${n}`);
			t = e;
		}
		return e;
	}, () => new ve(t);
}
Array.prototype.slice;
function xe(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/linear.js
function Se(e) {
	this._context = e;
}
Se.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._point = 0;
	},
	lineEnd: function() {
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1: this._point = 2;
			default:
				this._context.lineTo(e, t);
				break;
		}
	}
};
function Ce(e) {
	return new Se(e);
}
//#endregion
//#region node_modules/d3-shape/src/point.js
function we(e) {
	return e[0];
}
function Te(e) {
	return e[1];
}
//#endregion
//#region node_modules/d3-shape/src/line.js
function Ee(e, t) {
	var n = N(!0), r = null, i = Ce, a = null, o = be(s);
	e = typeof e == "function" ? e : e === void 0 ? we : N(e), t = typeof t == "function" ? t : t === void 0 ? Te : N(t);
	function s(s) {
		var c, l = (s = xe(s)).length, u, d = !1, f;
		for (r ?? (a = i(f = o())), c = 0; c <= l; ++c) !(c < l && n(u = s[c], c, s)) === d && ((d = !d) ? a.lineStart() : a.lineEnd()), d && a.point(+e(u, c, s), +t(u, c, s));
		if (f) return a = null, f + "" || null;
	}
	return s.x = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : N(+t), s) : e;
	}, s.y = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : N(+e), s) : t;
	}, s.defined = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : N(!!e), s) : n;
	}, s.curve = function(e) {
		return arguments.length ? (i = e, r != null && (a = i(r)), s) : i;
	}, s.context = function(e) {
		return arguments.length ? (e == null ? r = a = null : a = i(r = e), s) : r;
	}, s;
}
//#endregion
//#region node_modules/d3-shape/src/area.js
function De(e, t, n) {
	var r = null, i = N(!0), a = null, o = Ce, s = null, c = be(l);
	e = typeof e == "function" ? e : e === void 0 ? we : N(+e), t = typeof t == "function" ? t : N(t === void 0 ? 0 : +t), n = typeof n == "function" ? n : n === void 0 ? Te : N(+n);
	function l(l) {
		var u, d, f, p = (l = xe(l)).length, m, h = !1, g, _ = Array(p), v = Array(p);
		for (a ?? (s = o(g = c())), u = 0; u <= p; ++u) {
			if (!(u < p && i(m = l[u], u, l)) === h) if (h = !h) d = u, s.areaStart(), s.lineStart();
			else {
				for (s.lineEnd(), s.lineStart(), f = u - 1; f >= d; --f) s.point(_[f], v[f]);
				s.lineEnd(), s.areaEnd();
			}
			h && (_[u] = +e(m, u, l), v[u] = +t(m, u, l), s.point(r ? +r(m, u, l) : _[u], n ? +n(m, u, l) : v[u]));
		}
		if (g) return s = null, g + "" || null;
	}
	function u() {
		return Ee().defined(i).curve(o).context(a);
	}
	return l.x = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : N(+t), r = null, l) : e;
	}, l.x0 = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : N(+t), l) : e;
	}, l.x1 = function(e) {
		return arguments.length ? (r = e == null ? null : typeof e == "function" ? e : N(+e), l) : r;
	}, l.y = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : N(+e), n = null, l) : t;
	}, l.y0 = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : N(+e), l) : t;
	}, l.y1 = function(e) {
		return arguments.length ? (n = e == null ? null : typeof e == "function" ? e : N(+e), l) : n;
	}, l.lineX0 = l.lineY0 = function() {
		return u().x(e).y(t);
	}, l.lineY1 = function() {
		return u().x(e).y(n);
	}, l.lineX1 = function() {
		return u().x(r).y(t);
	}, l.defined = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : N(!!e), l) : i;
	}, l.curve = function(e) {
		return arguments.length ? (o = e, a != null && (s = o(a)), l) : o;
	}, l.context = function(e) {
		return arguments.length ? (e == null ? a = s = null : s = o(a = e), l) : a;
	}, l;
}
//#endregion
//#region node_modules/d3-shape/src/curve/bump.js
var Oe = class {
	constructor(e, t) {
		this._context = e, this._x = t;
	}
	areaStart() {
		this._line = 0;
	}
	areaEnd() {
		this._line = NaN;
	}
	lineStart() {
		this._point = 0;
	}
	lineEnd() {
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	}
	point(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1: this._point = 2;
			default:
				this._x ? this._context.bezierCurveTo(this._x0 = (this._x0 + e) / 2, this._y0, this._x0, t, e, t) : this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + t) / 2, e, this._y0, e, t);
				break;
		}
		this._x0 = e, this._y0 = t;
	}
};
function ke(e) {
	return new Oe(e, !0);
}
function Ae(e) {
	return new Oe(e, !1);
}
//#endregion
//#region node_modules/d3-shape/src/symbol/circle.js
var je = { draw(e, t) {
	let n = le(t / ue);
	e.moveTo(n, 0), e.arc(0, 0, n, 0, de);
} }, Me = { draw(e, t) {
	let n = le(t / 5) / 2;
	e.moveTo(-3 * n, -n), e.lineTo(-n, -n), e.lineTo(-n, -3 * n), e.lineTo(n, -3 * n), e.lineTo(n, -n), e.lineTo(3 * n, -n), e.lineTo(3 * n, n), e.lineTo(n, n), e.lineTo(n, 3 * n), e.lineTo(-n, 3 * n), e.lineTo(-n, n), e.lineTo(-3 * n, n), e.closePath();
} }, Ne = le(1 / 3), Pe = Ne * 2, Fe = { draw(e, t) {
	let n = le(t / Pe), r = n * Ne;
	e.moveTo(0, -n), e.lineTo(r, 0), e.lineTo(0, n), e.lineTo(-r, 0), e.closePath();
} }, Ie = { draw(e, t) {
	let n = le(t), r = -n / 2;
	e.rect(r, r, n, n);
} }, Le = .8908130915292852, Re = P(ue / 10) / P(7 * ue / 10), ze = P(de / 10) * Re, Be = -ce(de / 10) * Re, Ve = { draw(e, t) {
	let n = le(t * Le), r = ze * n, i = Be * n;
	e.moveTo(0, -n), e.lineTo(r, i);
	for (let t = 1; t < 5; ++t) {
		let a = de * t / 5, o = ce(a), s = P(a);
		e.lineTo(s * n, -o * n), e.lineTo(o * r - s * i, s * r + o * i);
	}
	e.closePath();
} }, He = le(3), Ue = { draw(e, t) {
	let n = -le(t / (He * 3));
	e.moveTo(0, n * 2), e.lineTo(-He * n, -n), e.lineTo(He * n, -n), e.closePath();
} }, We = -.5, Ge = le(3) / 2, Ke = 1 / le(12), qe = (Ke / 2 + 1) * 3, Je = { draw(e, t) {
	let n = le(t / qe), r = n / 2, i = n * Ke, a = r, o = n * Ke + n, s = -a, c = o;
	e.moveTo(r, i), e.lineTo(a, o), e.lineTo(s, c), e.lineTo(We * r - Ge * i, Ge * r + We * i), e.lineTo(We * a - Ge * o, Ge * a + We * o), e.lineTo(We * s - Ge * c, Ge * s + We * c), e.lineTo(We * r + Ge * i, We * i - Ge * r), e.lineTo(We * a + Ge * o, We * o - Ge * a), e.lineTo(We * s + Ge * c, We * c - Ge * s), e.closePath();
} };
//#endregion
//#region node_modules/d3-shape/src/symbol.js
function Ye(e, t) {
	let n = null, r = be(i);
	e = typeof e == "function" ? e : N(e || je), t = typeof t == "function" ? t : N(t === void 0 ? 64 : +t);
	function i() {
		let i;
		if (n ||= i = r(), e.apply(this, arguments).draw(n, +t.apply(this, arguments)), i) return n = null, i + "" || null;
	}
	return i.type = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : N(t), i) : e;
	}, i.size = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : N(+e), i) : t;
	}, i.context = function(e) {
		return arguments.length ? (n = e ?? null, i) : n;
	}, i;
}
//#endregion
//#region node_modules/d3-shape/src/noop.js
function Xe() {}
//#endregion
//#region node_modules/d3-shape/src/curve/basis.js
function Ze(e, t, n) {
	e._context.bezierCurveTo((2 * e._x0 + e._x1) / 3, (2 * e._y0 + e._y1) / 3, (e._x0 + 2 * e._x1) / 3, (e._y0 + 2 * e._y1) / 3, (e._x0 + 4 * e._x1 + t) / 6, (e._y0 + 4 * e._y1 + n) / 6);
}
function Qe(e) {
	this._context = e;
}
Qe.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 3: Ze(this, this._x1, this._y1);
			case 2:
				this._context.lineTo(this._x1, this._y1);
				break;
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1:
				this._point = 2;
				break;
			case 2: this._point = 3, this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
			default:
				Ze(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function $e(e) {
	return new Qe(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/basisClosed.js
function et(e) {
	this._context = e;
}
et.prototype = {
	areaStart: Xe,
	areaEnd: Xe,
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 1:
				this._context.moveTo(this._x2, this._y2), this._context.closePath();
				break;
			case 2:
				this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3), this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3), this._context.closePath();
				break;
			case 3:
				this.point(this._x2, this._y2), this.point(this._x3, this._y3), this.point(this._x4, this._y4);
				break;
		}
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._x2 = e, this._y2 = t;
				break;
			case 1:
				this._point = 2, this._x3 = e, this._y3 = t;
				break;
			case 2:
				this._point = 3, this._x4 = e, this._y4 = t, this._context.moveTo((this._x0 + 4 * this._x1 + e) / 6, (this._y0 + 4 * this._y1 + t) / 6);
				break;
			default:
				Ze(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function tt(e) {
	return new et(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/basisOpen.js
function nt(e) {
	this._context = e;
}
nt.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
	},
	lineEnd: function() {
		(this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1;
				break;
			case 1:
				this._point = 2;
				break;
			case 2:
				this._point = 3;
				var n = (this._x0 + 4 * this._x1 + e) / 6, r = (this._y0 + 4 * this._y1 + t) / 6;
				this._line ? this._context.lineTo(n, r) : this._context.moveTo(n, r);
				break;
			case 3: this._point = 4;
			default:
				Ze(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function rt(e) {
	return new nt(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/linearClosed.js
function it(e) {
	this._context = e;
}
it.prototype = {
	areaStart: Xe,
	areaEnd: Xe,
	lineStart: function() {
		this._point = 0;
	},
	lineEnd: function() {
		this._point && this._context.closePath();
	},
	point: function(e, t) {
		e = +e, t = +t, this._point ? this._context.lineTo(e, t) : (this._point = 1, this._context.moveTo(e, t));
	}
};
function at(e) {
	return new it(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/monotone.js
function ot(e) {
	return e < 0 ? -1 : 1;
}
function st(e, t, n) {
	var r = e._x1 - e._x0, i = t - e._x1, a = (e._y1 - e._y0) / (r || i < 0 && -0), o = (n - e._y1) / (i || r < 0 && -0), s = (a * i + o * r) / (r + i);
	return (ot(a) + ot(o)) * Math.min(Math.abs(a), Math.abs(o), .5 * Math.abs(s)) || 0;
}
function ct(e, t) {
	var n = e._x1 - e._x0;
	return n ? (3 * (e._y1 - e._y0) / n - t) / 2 : t;
}
function lt(e, t, n) {
	var r = e._x0, i = e._y0, a = e._x1, o = e._y1, s = (a - r) / 3;
	e._context.bezierCurveTo(r + s, i + s * t, a - s, o - s * n, a, o);
}
function ut(e) {
	this._context = e;
}
ut.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 2:
				this._context.lineTo(this._x1, this._y1);
				break;
			case 3:
				lt(this, this._t0, ct(this, this._t0));
				break;
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		var n = NaN;
		if (e = +e, t = +t, !(e === this._x1 && t === this._y1)) {
			switch (this._point) {
				case 0:
					this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
					break;
				case 1:
					this._point = 2;
					break;
				case 2:
					this._point = 3, lt(this, ct(this, n = st(this, e, t)), n);
					break;
				default:
					lt(this, this._t0, n = st(this, e, t));
					break;
			}
			this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = n;
		}
	}
};
function dt(e) {
	this._context = new ft(e);
}
(dt.prototype = Object.create(ut.prototype)).point = function(e, t) {
	ut.prototype.point.call(this, t, e);
};
function ft(e) {
	this._context = e;
}
ft.prototype = {
	moveTo: function(e, t) {
		this._context.moveTo(t, e);
	},
	closePath: function() {
		this._context.closePath();
	},
	lineTo: function(e, t) {
		this._context.lineTo(t, e);
	},
	bezierCurveTo: function(e, t, n, r, i, a) {
		this._context.bezierCurveTo(t, e, r, n, a, i);
	}
};
function pt(e) {
	return new ut(e);
}
function mt(e) {
	return new dt(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/natural.js
function ht(e) {
	this._context = e;
}
ht.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x = [], this._y = [];
	},
	lineEnd: function() {
		var e = this._x, t = this._y, n = e.length;
		if (n) if (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), n === 2) this._context.lineTo(e[1], t[1]);
		else for (var r = gt(e), i = gt(t), a = 0, o = 1; o < n; ++a, ++o) this._context.bezierCurveTo(r[0][a], i[0][a], r[1][a], i[1][a], e[o], t[o]);
		(this._line || this._line !== 0 && n === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
	},
	point: function(e, t) {
		this._x.push(+e), this._y.push(+t);
	}
};
function gt(e) {
	var t, n = e.length - 1, r, i = Array(n), a = Array(n), o = Array(n);
	for (i[0] = 0, a[0] = 2, o[0] = e[0] + 2 * e[1], t = 1; t < n - 1; ++t) i[t] = 1, a[t] = 4, o[t] = 4 * e[t] + 2 * e[t + 1];
	for (i[n - 1] = 2, a[n - 1] = 7, o[n - 1] = 8 * e[n - 1] + e[n], t = 1; t < n; ++t) r = i[t] / a[t - 1], a[t] -= r, o[t] -= r * o[t - 1];
	for (i[n - 1] = o[n - 1] / a[n - 1], t = n - 2; t >= 0; --t) i[t] = (o[t] - i[t + 1]) / a[t];
	for (a[n - 1] = (e[n] + i[n - 1]) / 2, t = 0; t < n - 1; ++t) a[t] = 2 * e[t + 1] - i[t + 1];
	return [i, a];
}
function _t(e) {
	return new ht(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/step.js
function vt(e, t) {
	this._context = e, this._t = t;
}
vt.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x = this._y = NaN, this._point = 0;
	},
	lineEnd: function() {
		0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y), (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line >= 0 && (this._t = 1 - this._t, this._line = 1 - this._line);
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1: this._point = 2;
			default:
				if (this._t <= 0) this._context.lineTo(this._x, t), this._context.lineTo(e, t);
				else {
					var n = this._x * (1 - this._t) + e * this._t;
					this._context.lineTo(n, this._y), this._context.lineTo(n, t);
				}
				break;
		}
		this._x = e, this._y = t;
	}
};
function yt(e) {
	return new vt(e, .5);
}
function bt(e) {
	return new vt(e, 0);
}
function xt(e) {
	return new vt(e, 1);
}
//#endregion
//#region node_modules/d3-shape/src/offset/none.js
function St(e, t) {
	if ((o = e.length) > 1) for (var n = 1, r, i, a = e[t[0]], o, s = a.length; n < o; ++n) for (i = a, a = e[t[n]], r = 0; r < s; ++r) a[r][1] += a[r][0] = isNaN(i[r][1]) ? i[r][0] : i[r][1];
}
//#endregion
//#region node_modules/d3-shape/src/order/none.js
function Ct(e) {
	for (var t = e.length, n = Array(t); --t >= 0;) n[t] = t;
	return n;
}
//#endregion
//#region node_modules/d3-shape/src/stack.js
function wt(e, t) {
	return e[t];
}
function Tt(e) {
	let t = [];
	return t.key = e, t;
}
function Et() {
	var e = N([]), t = Ct, n = St, r = wt;
	function i(i) {
		var a = Array.from(e.apply(this, arguments), Tt), o, s = a.length, c = -1, l;
		for (let e of i) for (o = 0, ++c; o < s; ++o) (a[o][c] = [0, +r(e, a[o].key, c, i)]).data = e;
		for (o = 0, l = xe(t(a)); o < s; ++o) a[l[o]].index = o;
		return n(a, l), a;
	}
	return i.keys = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : N(Array.from(t)), i) : e;
	}, i.value = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : N(+e), i) : r;
	}, i.order = function(e) {
		return arguments.length ? (t = e == null ? Ct : typeof e == "function" ? e : N(Array.from(e)), i) : t;
	}, i.offset = function(e) {
		return arguments.length ? (n = e ?? St, i) : n;
	}, i;
}
//#endregion
//#region node_modules/d3-shape/src/offset/expand.js
function Dt(e, t) {
	if ((r = e.length) > 0) {
		for (var n, r, i = 0, a = e[0].length, o; i < a; ++i) {
			for (o = n = 0; n < r; ++n) o += e[n][i][1] || 0;
			if (o) for (n = 0; n < r; ++n) e[n][i][1] /= o;
		}
		St(e, t);
	}
}
//#endregion
//#region node_modules/d3-shape/src/offset/silhouette.js
function Ot(e, t) {
	if ((i = e.length) > 0) {
		for (var n = 0, r = e[t[0]], i, a = r.length; n < a; ++n) {
			for (var o = 0, s = 0; o < i; ++o) s += e[o][n][1] || 0;
			r[n][1] += r[n][0] = -s / 2;
		}
		St(e, t);
	}
}
//#endregion
//#region node_modules/d3-shape/src/offset/wiggle.js
function kt(e, t) {
	if (!(!((o = e.length) > 0) || !((a = (i = e[t[0]]).length) > 0))) {
		for (var n = 0, r = 1, i, a, o; r < a; ++r) {
			for (var s = 0, c = 0, l = 0; s < o; ++s) {
				for (var u = e[t[s]], d = u[r][1] || 0, f = (d - (u[r - 1][1] || 0)) / 2, p = 0; p < s; ++p) {
					var m = e[t[p]], h = m[r][1] || 0, g = m[r - 1][1] || 0;
					f += h - g;
				}
				c += d, l += f * d;
			}
			i[r - 1][1] += i[r - 1][0] = n, c && (n -= l / c);
		}
		i[r - 1][1] += i[r - 1][0] = n, St(e, t);
	}
}
//#endregion
//#region node_modules/es-toolkit/dist/_internal/isUnsafeProperty.mjs
function At(e) {
	return e === "__proto__";
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/isDeepKey.mjs
var jt = /\.|(\[(?:[^[\]]*|(["'])(?:(?!\2)[^\\]|\\.)*?\2)\])/;
function Mt(e) {
	switch (typeof e) {
		case "number":
		case "symbol": return !1;
		case "string": return e === "" || e.startsWith(".") || e.endsWith(".") ? !1 : jt.test(e);
		default: return !1;
	}
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/toKey.mjs
function Nt(e) {
	return typeof e == "string" || typeof e == "symbol" ? e : Object.is(e?.valueOf?.(), -0) ? "-0" : String(e);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/util/toString.mjs
function Pt(e) {
	if (e == null) return "";
	if (typeof e == "string") return e;
	if (Array.isArray(e)) return e.map(Pt).join(",");
	let t = String(e);
	return t === "0" && Object.is(Number(e), -0) ? "-0" : t;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/util/toPath.mjs
function Ft(e) {
	if (Array.isArray(e)) return e.map(Nt);
	if (typeof e == "symbol") return [e];
	e = Pt(e);
	let t = [], n = e.length;
	if (n === 0) return t;
	let r = 0, i = "", a = "", o = !1;
	for (e.charCodeAt(0) === 46 && t.push(""); r < n;) {
		let s = e[r];
		if (a) s === "\\" && r + 1 < n ? (r++, i += e[r]) : s === a ? a = "" : i += s;
		else if (o) s === "\"" || s === "'" ? a = s : s === "]" ? (o = !1, t.push(i), i = "") : i += s;
		else if (s === "[") o = !0, i &&= (t.push(i), "");
		else if (s === ".") {
			i &&= (t.push(i), "");
			let n = e[r + 1];
			(n === void 0 || n === ".") && t.push("");
		} else i += s;
		r++;
	}
	return i && t.push(i), t;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/object/get.mjs
function It(e, t, n) {
	if (e == null) return n;
	switch (typeof t) {
		case "string": {
			if (At(t)) return n;
			let r = e[t];
			return r === void 0 ? Mt(t) && !Object.hasOwn(e, t) ? It(e, Ft(t), n) : n : r;
		}
		case "number":
		case "symbol": {
			typeof t == "number" && (t = Nt(t));
			let r = e[t];
			return r === void 0 ? n : r;
		}
		default: {
			if (Array.isArray(t)) return Lt(e, t, n);
			if (t = Object.is(t?.valueOf(), -0) ? "-0" : String(t), At(t)) return n;
			let r = e[t];
			return r === void 0 ? n : r;
		}
	}
}
function Lt(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let e = 0; e < t.length; e++) {
		if (r == null || At(t[e])) return n;
		r = r[t[e]];
	}
	return r === void 0 ? n : r;
}
//#endregion
//#region node_modules/recharts/es6/util/round.js
var Rt = 4;
function zt(e) {
	var t = 10 ** (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Rt), n = Math.round(e * t) / t;
	return Object.is(n, -0) ? 0 : n;
}
function Bt(e) {
	var t = [...arguments].slice(1);
	return e.reduce((e, n, r) => {
		var i = t[r - 1];
		return typeof i == "string" ? e + i + n : i === void 0 ? e + n : e + zt(i) + n;
	}, "");
}
//#endregion
//#region node_modules/recharts/es6/util/DataUtils.js
var Vt = (e) => e === 0 ? 0 : e > 0 ? 1 : -1, Ht = (e) => typeof e == "number" && e != +e, Ut = (e) => typeof e == "string" && e.indexOf("%") === e.length - 1, F = (e) => (typeof e == "number" || e instanceof Number) && !Ht(e), Wt = (e) => F(e) || typeof e == "string", Gt = 0, Kt = (e) => {
	var t = ++Gt;
	return `${e || ""}${t}`;
}, qt = function(e, t) {
	var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
	if (!F(e) && typeof e != "string") return n;
	var i;
	if (Ut(e)) {
		if (t == null) return n;
		var a = e.indexOf("%");
		i = t * parseFloat(e.slice(0, a)) / 100;
	} else i = +e;
	return Ht(i) && (i = n), r && t != null && i > t && (i = t), i;
}, Jt = (e) => {
	if (!Array.isArray(e)) return !1;
	for (var t = e.length, n = {}, r = 0; r < t; r++) if (!n[String(e[r])]) n[String(e[r])] = !0;
	else return !0;
	return !1;
};
function Yt(e, t, n) {
	return F(e) && F(t) ? zt(e + n * (t - e)) : t;
}
function Xt(e, t, n) {
	if (!(!e || !e.length)) return e.find((e) => e && (typeof t == "function" ? t(e) : It(e, t)) === n);
}
var Zt = (e) => e == null, Qt = (e) => Zt(e) ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
function $t(e) {
	return e != null;
}
function en() {}
//#endregion
//#region node_modules/recharts/es6/shape/Symbols.js
var tn = [
	"type",
	"size",
	"sizeType"
];
function nn() {
	return nn = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, nn.apply(null, arguments);
}
function rn(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function an(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? rn(Object(n), !0).forEach(function(t) {
			on(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : rn(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function on(e, t, n) {
	return (t = sn(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function sn(e) {
	var t = cn(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function cn(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function ln(e, t) {
	if (e == null) return {};
	var n, r, i = un(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function un(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var dn = {
	symbolCircle: je,
	symbolCross: Me,
	symbolDiamond: Fe,
	symbolSquare: Ie,
	symbolStar: Ve,
	symbolTriangle: Ue,
	symbolWye: Je
}, fn = Math.PI / 180, pn = (e) => dn[`symbol${Qt(e)}`] || je, mn = (e, t, n) => {
	if (t === "area") return e;
	switch (n) {
		case "cross": return 5 * e * e / 9;
		case "diamond": return .5 * e * e / Math.sqrt(3);
		case "square": return e * e;
		case "star":
			var r = 18 * fn;
			return 1.25 * e * e * (Math.tan(r) - Math.tan(r * 2) * Math.tan(r) ** 2);
		case "triangle": return Math.sqrt(3) * e * e / 4;
		case "wye": return (21 - 10 * Math.sqrt(3)) * e * e / 8;
		default: return Math.PI * e * e / 4;
	}
}, hn = (e, t) => {
	dn[`symbol${Qt(e)}`] = t;
}, gn = (e) => {
	var { type: t = "circle", size: n = 64, sizeType: r = "area" } = e, i = an(an({}, ln(e, tn)), {}, {
		type: t,
		size: n,
		sizeType: r
	}), a = "circle";
	typeof t == "string" && (a = t);
	var o = () => {
		var e = pn(a), t = Ye().type(e).size(mn(n, r, a))();
		if (t !== null) return t;
	}, { className: s, cx: c, cy: l } = i, u = O(i);
	return F(c) && F(l) && F(n) ? /* @__PURE__ */ S.createElement("path", nn({}, u, {
		className: y("recharts-symbols", s),
		transform: `translate(${c}, ${l})`,
		d: o()
	})) : null;
};
gn.registerSymbol = hn;
//#endregion
//#region node_modules/recharts/es6/util/types.js
var _n = (e) => "radius" in e && "startAngle" in e && "endAngle" in e, vn = (e, t) => {
	if (!e || typeof e == "function" || typeof e == "boolean") return null;
	var n = e;
	if (/* @__PURE__ */ (0, S.isValidElement)(e) && (n = e.props), typeof n != "object" && typeof n != "function") return null;
	var r = {};
	return Object.keys(n).forEach((e) => {
		x(e) && typeof n[e] == "function" && (r[e] = t || ((t) => n[e](n, t)));
	}), r;
}, yn = (e, t, n) => (r) => (e(t, n, r), null), bn = (e, t, n) => {
	if (e === null || typeof e != "object" && typeof e != "function") return null;
	var r = null;
	return Object.keys(e).forEach((i) => {
		var a = e[i];
		x(i) && typeof a == "function" && (r ||= {}, r[i] = yn(a, t, n));
	}), r;
};
//#endregion
//#region node_modules/recharts/es6/util/resolveDefaultProps.js
function xn(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Sn(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? xn(Object(n), !0).forEach(function(t) {
			Cn(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : xn(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Cn(e, t, n) {
	return (t = wn(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function wn(e) {
	var t = Tn(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Tn(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function En(e, t) {
	var n = Sn({}, e), r = t;
	return Object.keys(t).reduce((e, t) => (e[t] === void 0 && r[t] !== void 0 && (e[t] = r[t]), e), n);
}
//#endregion
//#region node_modules/es-toolkit/dist/array/uniqBy.mjs
function Dn(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r = 0; r < e.length; r++) {
		let i = e[r], a = t(i, r, e);
		n.has(a) || n.set(a, i);
	}
	return Array.from(n.values());
}
//#endregion
//#region node_modules/es-toolkit/dist/function/ary.mjs
function On(e, t) {
	return function(...n) {
		return e.apply(this, n.slice(0, t));
	};
}
//#endregion
//#region node_modules/es-toolkit/dist/function/identity.mjs
function kn(e) {
	return e;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/object/property.mjs
function An(e) {
	return function(t) {
		return It(t, e);
	};
}
//#endregion
//#region node_modules/es-toolkit/dist/predicate/isPrimitive.mjs
function jn(e) {
	return e == null || typeof e != "object" && typeof e != "function";
}
//#endregion
//#region node_modules/es-toolkit/dist/predicate/isTypedArray.mjs
function Mn(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/getSymbols.mjs
function Nn(e) {
	return Object.getOwnPropertySymbols(e).filter((t) => Object.prototype.propertyIsEnumerable.call(e, t));
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/getTag.mjs
function Pn(e) {
	return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/tags.mjs
var Fn = "[object RegExp]", In = "[object String]", Ln = "[object Number]", Rn = "[object Boolean]", zn = "[object Arguments]", Bn = "[object Symbol]", Vn = "[object Date]", Hn = "[object Map]", Un = "[object Set]", Wn = "[object Array]", Gn = "[object ArrayBuffer]", Kn = "[object Object]", qn = "[object DataView]", Jn = "[object Uint8Array]", Yn = "[object Uint8ClampedArray]", Xn = "[object Uint16Array]", Zn = "[object Uint32Array]", Qn = "[object Int8Array]", $n = "[object Int16Array]", er = "[object Int32Array]", tr = "[object Float32Array]", nr = "[object Float64Array]", rr = typeof globalThis == "object" && globalThis || typeof window == "object" && window || typeof self == "object" && self || typeof global == "object" && global || (function() {
	return this;
})();
//#endregion
//#region node_modules/es-toolkit/dist/predicate/isBuffer.mjs
function ir(e) {
	return rr.Buffer !== void 0 && rr.Buffer.isBuffer(e);
}
//#endregion
//#region node_modules/es-toolkit/dist/object/cloneDeepWith.mjs
function ar(e, t) {
	return or(e, void 0, e, /* @__PURE__ */ new Map(), t);
}
function or(e, t, n, r = /* @__PURE__ */ new Map(), i = void 0) {
	let a = i?.(e, t, n, r);
	if (a !== void 0) return a;
	if (jn(e)) return e;
	if (r.has(e)) return r.get(e);
	if (Array.isArray(e)) {
		let t = Array(e.length);
		r.set(e, t);
		for (let a = 0; a < e.length; a++) t[a] = or(e[a], a, n, r, i);
		return Object.hasOwn(e, "index") && (t.index = e.index), Object.hasOwn(e, "input") && (t.input = e.input), t;
	}
	if (e instanceof Date) return new Date(e.getTime());
	if (e instanceof RegExp) {
		let t = new RegExp(e.source, e.flags);
		return t.lastIndex = e.lastIndex, t;
	}
	if (e instanceof Map) {
		let t = /* @__PURE__ */ new Map();
		r.set(e, t);
		for (let [a, o] of e) t.set(a, or(o, a, n, r, i));
		return t;
	}
	if (e instanceof Set) {
		let t = /* @__PURE__ */ new Set();
		r.set(e, t);
		for (let a of e) t.add(or(a, void 0, n, r, i));
		return t;
	}
	if (ir(e)) return e.subarray();
	if (Mn(e)) {
		let t = new (Object.getPrototypeOf(e)).constructor(e.length);
		r.set(e, t);
		for (let a = 0; a < e.length; a++) t[a] = or(e[a], a, n, r, i);
		return t;
	}
	if (e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) return e.slice(0);
	if (e instanceof DataView) {
		let t = new DataView(e.buffer.slice(0), e.byteOffset, e.byteLength);
		return r.set(e, t), sr(t, e, n, r, i), t;
	}
	if (typeof File < "u" && e instanceof File) {
		let t = new File([e], e.name, { type: e.type });
		return r.set(e, t), sr(t, e, n, r, i), t;
	}
	if (typeof Blob < "u" && e instanceof Blob) {
		let t = new Blob([e], { type: e.type });
		return r.set(e, t), sr(t, e, n, r, i), t;
	}
	if (e instanceof Error) {
		let t = structuredClone(e);
		return r.set(e, t), t.message = e.message, t.name = e.name, t.stack = e.stack, t.cause = e.cause, t.constructor = e.constructor, sr(t, e, n, r, i), t;
	}
	if (e instanceof Boolean) {
		let t = new Boolean(e.valueOf());
		return r.set(e, t), sr(t, e, n, r, i), t;
	}
	if (e instanceof Number) {
		let t = new Number(e.valueOf());
		return r.set(e, t), sr(t, e, n, r, i), t;
	}
	if (e instanceof String) {
		let t = new String(e.valueOf());
		return r.set(e, t), sr(t, e, n, r, i), t;
	}
	if (typeof e == "object" && cr(e)) {
		let t = Object.create(Object.getPrototypeOf(e));
		return r.set(e, t), sr(t, e, n, r, i), t;
	}
	return e;
}
function sr(e, t, n = e, r, i) {
	let a = [...Object.keys(t), ...Nn(t)];
	for (let o = 0; o < a.length; o++) {
		let s = a[o], c = Object.getOwnPropertyDescriptor(e, s);
		(c == null || c.writable) && (e[s] = or(t[s], s, n, r, i));
	}
}
function cr(e) {
	switch (Pn(e)) {
		case zn:
		case Wn:
		case Gn:
		case qn:
		case Rn:
		case Vn:
		case tr:
		case nr:
		case Qn:
		case $n:
		case er:
		case Hn:
		case Ln:
		case Kn:
		case Fn:
		case Un:
		case In:
		case Bn:
		case Jn:
		case Yn:
		case Xn:
		case Zn: return !0;
		default: return !1;
	}
}
//#endregion
//#region node_modules/es-toolkit/dist/object/cloneDeep.mjs
function lr(e) {
	return or(e, void 0, e, /* @__PURE__ */ new Map(), void 0);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/util/eq.mjs
function ur(e, t) {
	return e === t || Number.isNaN(e) && Number.isNaN(t);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/isObject.mjs
function dr(e) {
	return e !== null && (typeof e == "object" || typeof e == "function");
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/isMatchWith.mjs
function fr(e, t, n) {
	return typeof n == "function" ? pr(e, t, function e(t, r, i, a, o, s) {
		let c = n(t, r, i, a, o, s);
		return c === void 0 ? pr(t, r, e, s, !1) : !!c;
	}, /* @__PURE__ */ new Map(), !0) : fr(e, t, () => void 0);
}
function pr(e, t, n, r, i = !1) {
	if (t === e) return !0;
	switch (typeof t) {
		case "object": return mr(e, t, n, r);
		case "function": return Object.keys(t).length > 0 ? pr(e, { ...t }, n, r, i) : ur(e, t);
		default: return dr(e) && i ? typeof t == "string" ? t === "" : !0 : ur(e, t);
	}
}
function mr(e, t, n, r) {
	if (t == null) return !0;
	if (Array.isArray(t)) return gr(e, t, n, r);
	if (t instanceof Map) return hr(e, t, n, r);
	if (t instanceof Set) return _r(e, t, n, r);
	let i = Object.keys(t);
	if (e == null || jn(e)) return i.length === 0;
	if (i.length === 0) return !0;
	if (r?.has(t)) return r.get(t) === e;
	r?.set(t, e);
	try {
		for (let a = 0; a < i.length; a++) {
			let o = i[a];
			if (!jn(e) && !(o in e) || t[o] === void 0 && e[o] !== void 0 || t[o] === null && e[o] !== null || !n(e[o], t[o], o, e, t, r)) return !1;
		}
		return !0;
	} finally {
		r?.delete(t);
	}
}
function hr(e, t, n, r) {
	if (t.size === 0) return !0;
	if (!(e instanceof Map)) return !1;
	for (let [i, a] of t.entries()) if (n(e.get(i), a, i, e, t, r) === !1) return !1;
	return !0;
}
function gr(e, t, n, r) {
	if (t.length === 0) return !0;
	if (!Array.isArray(e)) return !1;
	let i = /* @__PURE__ */ new Set();
	for (let a = 0; a < t.length; a++) {
		let o = t[a], s = !1;
		for (let c = 0; c < e.length; c++) {
			if (i.has(c)) continue;
			let l = e[c], u = !1;
			if (n(l, o, a, e, t, r) && (u = !0), u) {
				i.add(c), s = !0;
				break;
			}
		}
		if (!s) return !1;
	}
	return !0;
}
function _r(e, t, n, r) {
	return t.size === 0 ? !0 : e instanceof Set ? gr([...e], [...t], n, r) : !1;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/isMatch.mjs
function vr(e, t) {
	return fr(e, t, () => void 0);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/matches.mjs
function yr(e) {
	return e = lr(e), (t) => vr(t, e);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/object/cloneDeepWith.mjs
function br(e, t) {
	return ar(e, (n, r, i, a) => {
		let o = t?.(n, r, i, a);
		if (o !== void 0) return o;
		if (typeof e == "object") {
			if (Pn(e) === "[object Object]" && typeof e.constructor != "function") {
				let t = {};
				return a.set(e, t), sr(t, e, i, a), t;
			}
			switch (Object.prototype.toString.call(e)) {
				case Ln:
				case In:
				case Rn: {
					let t = new e.constructor(e?.valueOf());
					return sr(t, e), t;
				}
				case zn: {
					let t = {};
					return sr(t, e), t.length = e.length, t[Symbol.iterator] = e[Symbol.iterator], t;
				}
				default: return;
			}
		}
	});
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/object/cloneDeep.mjs
function xr(e) {
	return br(e);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/isIndex.mjs
var Sr = /^(?:0|[1-9]\d*)$/;
function Cr(e, t = 2 ** 53 - 1) {
	switch (typeof e) {
		case "number": return Number.isInteger(e) && e >= 0 && e < t;
		case "symbol": return !1;
		case "string": return Sr.test(e);
	}
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/isArguments.mjs
function wr(e) {
	return typeof e == "object" && !!e && Pn(e) === "[object Arguments]";
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/object/has.mjs
function Tr(e, t) {
	let n;
	if (n = Array.isArray(t) ? t : typeof t == "string" && Mt(t) && !(t in Object(e)) ? Ft(t) : [t], n.length === 0) return !1;
	let r = e;
	for (let e = 0; e < n.length; e++) {
		let t = n[e];
		if ((r == null || !Object.hasOwn(r, t)) && !((Array.isArray(r) || wr(r)) && Cr(t) && t < r.length)) return !1;
		r = r[t];
	}
	return !0;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/matchesProperty.mjs
function Er(e, t) {
	switch (typeof e) {
		case "object":
			Object.is(e?.valueOf(), -0) && (e = "-0");
			break;
		case "number":
			e = Nt(e);
			break;
	}
	return t = xr(t), function(n) {
		let r = It(n, e);
		return r === void 0 ? Tr(n, e) : t === void 0 ? r === void 0 : vr(r, t);
	};
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/util/iteratee.mjs
function Dr(e) {
	if (e == null) return kn;
	switch (typeof e) {
		case "function": return e;
		case "object": return Array.isArray(e) && e.length === 2 ? Er(e[0], e[1]) : yr(e);
		case "string":
		case "symbol":
		case "number": return An(e);
	}
}
//#endregion
//#region node_modules/es-toolkit/dist/predicate/isLength.mjs
function Or(e) {
	return Number.isSafeInteger(e) && e >= 0;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/isArrayLike.mjs
function kr(e) {
	return e != null && typeof e != "function" && Or(e.length);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/isObjectLike.mjs
function Ar(e) {
	return typeof e == "object" && !!e;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/isArrayLikeObject.mjs
function jr(e) {
	return Ar(e) && kr(e);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/array/uniqBy.mjs
function Mr(e, t = kn) {
	return jr(e) ? Dn(Array.from(e), On(Dr(t), 1)) : [];
}
//#endregion
//#region node_modules/recharts/es6/util/payload/getUniqPayload.js
function Nr(e, t, n) {
	return t === !0 ? Mr(e, n) : typeof t == "function" ? Mr(e, t) : e;
}
//#endregion
//#region node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.js
var Pr = /* @__PURE__ */ o(((e) => {
	var t = d();
	function n(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var r = typeof Object.is == "function" ? Object.is : n, i = t.useState, a = t.useEffect, o = t.useLayoutEffect, s = t.useDebugValue;
	function c(e, t) {
		var n = t(), r = i({ inst: {
			value: n,
			getSnapshot: t
		} }), c = r[0].inst, u = r[1];
		return o(function() {
			c.value = n, c.getSnapshot = t, l(c) && u({ inst: c });
		}, [
			e,
			n,
			t
		]), a(function() {
			return l(c) && u({ inst: c }), e(function() {
				l(c) && u({ inst: c });
			});
		}, [e]), s(n), n;
	}
	function l(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !r(e, n);
		} catch {
			return !0;
		}
	}
	function u(e, t) {
		return t();
	}
	var f = typeof window > "u" || window.document === void 0 || window.document.createElement === void 0 ? u : c;
	e.useSyncExternalStore = t.useSyncExternalStore === void 0 ? f : t.useSyncExternalStore;
})), Fr = /* @__PURE__ */ o(((e, t) => {
	t.exports = Pr();
})), Ir = /* @__PURE__ */ o(((e) => {
	var t = d(), n = Fr();
	function r(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var i = typeof Object.is == "function" ? Object.is : r, a = n.useSyncExternalStore, o = t.useRef, s = t.useEffect, c = t.useMemo, l = t.useDebugValue;
	e.useSyncExternalStoreWithSelector = function(e, t, n, r, u) {
		var d = o(null);
		if (d.current === null) {
			var f = {
				hasValue: !1,
				value: null
			};
			d.current = f;
		} else f = d.current;
		d = c(function() {
			function e(e) {
				if (!a) {
					if (a = !0, o = e, e = r(e), u !== void 0 && f.hasValue) {
						var t = f.value;
						if (u(t, e)) return s = t;
					}
					return s = e;
				}
				if (t = s, i(o, e)) return t;
				var n = r(e);
				return u !== void 0 && u(t, n) ? (o = e, t) : (o = e, s = n);
			}
			var a = !1, o, s, c = n === void 0 ? null : n;
			return [function() {
				return e(t());
			}, c === null ? void 0 : function() {
				return e(c());
			}];
		}, [
			t,
			n,
			r,
			u
		]);
		var p = a(e, d[0], d[1]);
		return s(function() {
			f.hasValue = !0, f.value = p;
		}, [p]), l(p), p;
	};
})), Lr = /* @__PURE__ */ o(((e, t) => {
	t.exports = Ir();
})), Rr = /* @__PURE__ */ (0, S.createContext)(null), zr = Lr(), Br = (e) => e, Vr = () => {
	var e = (0, S.useContext)(Rr);
	return e ? e.store.dispatch : Br;
}, Hr = () => {}, Ur = () => Hr, Wr = (e, t) => e === t;
function I(e) {
	var t = (0, S.useContext)(Rr), n = (0, S.useMemo)(() => t ? (t) => {
		if (t != null) return e(t);
	} : Hr, [t, e]);
	return (0, zr.useSyncExternalStoreWithSelector)(t ? t.subscription.addNestedSub : Ur, t ? t.store.getState : Hr, t ? t.store.getState : Hr, n, Wr);
}
//#endregion
//#region node_modules/recharts/node_modules/reselect/dist/reselect.mjs
function Gr(e, t = `expected a function, instead received ${typeof e}`) {
	if (typeof e != "function") throw TypeError(t);
}
function Kr(e, t = `expected an object, instead received ${typeof e}`) {
	if (typeof e != "object") throw TypeError(t);
}
function qr(e, t = "expected all items to be functions, instead received the following types: ") {
	if (!e.every((e) => typeof e == "function")) {
		let n = e.map((e) => typeof e == "function" ? `function ${e.name || "unnamed"}()` : typeof e).join(", ");
		throw TypeError(`${t}[${n}]`);
	}
}
var Jr = (e) => Array.isArray(e) ? e : [e];
function Yr(e) {
	let t = Array.isArray(e[0]) ? e[0] : e;
	return qr(t, "createSelector expects all input-selectors to be functions, but received the following types: "), t;
}
function Xr(e, t) {
	let n = [], { length: r } = e;
	for (let i = 0; i < r; i++) n.push(e[i].apply(null, t));
	return n;
}
var Zr = class {
	constructor(e) {
		this.value = e;
	}
	deref() {
		return this.value;
	}
}, Qr = typeof WeakRef < "u" ? WeakRef : Zr, $r = 0, ei = 1;
function ti() {
	return {
		s: $r,
		v: void 0,
		o: null,
		p: null
	};
}
function ni(e, t = {}) {
	let n = ti(), { resultEqualityCheck: r } = t, i, a = 0;
	function o() {
		let t = n, { length: o } = arguments;
		for (let e = 0, n = o; e < n; e++) {
			let n = arguments[e];
			if (typeof n == "function" || typeof n == "object" && n) {
				let e = t.o;
				e === null && (t.o = e = /* @__PURE__ */ new WeakMap());
				let r = e.get(n);
				r === void 0 ? (t = ti(), e.set(n, t)) : t = r;
			} else {
				let e = t.p;
				e === null && (t.p = e = /* @__PURE__ */ new Map());
				let r = e.get(n);
				r === void 0 ? (t = ti(), e.set(n, t)) : t = r;
			}
		}
		let s = t, c;
		if (t.s === ei) c = t.v;
		else if (c = e.apply(null, arguments), a++, r) {
			let e = i?.deref?.() ?? i;
			e != null && r(e, c) && (c = e, a !== 0 && a--), i = typeof c == "object" && c || typeof c == "function" ? new Qr(c) : c;
		}
		return s.s = ei, s.v = c, c;
	}
	return o.clearCache = () => {
		n = ti(), o.resetResultsCount();
	}, o.resultsCount = () => a, o.resetResultsCount = () => {
		a = 0;
	}, o;
}
function ri(e, ...t) {
	let n = typeof e == "function" ? {
		memoize: e,
		memoizeOptions: t
	} : e, r = (...e) => {
		let t = 0, r = 0, i, a = {}, o = e.pop();
		typeof o == "object" && (a = o, o = e.pop()), Gr(o, `createSelector expects an output function after the inputs, but received: [${typeof o}]`);
		let { memoize: s, memoizeOptions: c = [], argsMemoize: l = ni, argsMemoizeOptions: u = [], devModeChecks: d = {} } = {
			...n,
			...a
		}, f = Jr(c), p = Jr(u), m = Yr(e), h = s(function() {
			return t++, o.apply(null, arguments);
		}, ...f), g = l(function() {
			r++;
			let e = Xr(m, arguments);
			return i = h.apply(null, e), i;
		}, ...p);
		return Object.assign(g, {
			resultFunc: o,
			memoizedResultFunc: h,
			dependencies: m,
			dependencyRecomputations: () => r,
			resetDependencyRecomputations: () => {
				r = 0;
			},
			lastResult: () => i,
			recomputations: () => t,
			resetRecomputations: () => {
				t = 0;
			},
			memoize: s,
			argsMemoize: l
		});
	};
	return Object.assign(r, { withTypes: () => r }), r;
}
var L = /* @__PURE__ */ ri(ni), ii = Object.assign((e, t = L) => {
	Kr(e, `createStructuredSelector expects first argument to be an object where each property is a selector, instead received a ${typeof e}`);
	let n = Object.keys(e);
	return t(n.map((t) => e[t]), (...e) => e.reduce((e, t, r) => (e[n[r]] = t, e), {}));
}, { withTypes: () => ii });
//#endregion
//#region node_modules/es-toolkit/dist/array/flatten.mjs
function ai(e, t = 1) {
	let n = [], r = Math.floor(t), i = (e, t) => {
		for (let a = 0; a < e.length; a++) {
			let o = e[a];
			Array.isArray(o) && t < r ? i(o, t + 1) : n.push(o);
		}
	};
	return i(e, 0), n;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/isIterateeCall.mjs
function oi(e, t, n) {
	return dr(n) && (typeof t == "number" && kr(n) && Cr(t) && t < n.length || typeof t == "string" && t in n) ? ur(n[t], e) : !1;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/compareValues.mjs
function si(e) {
	return typeof e == "symbol" ? 1 : e === null ? 2 : e === void 0 ? 3 : e === e ? 0 : 4;
}
var ci = (e, t, n) => {
	if (e !== t) {
		let r = si(e), i = si(t);
		if (r === i && r === 0) {
			if (e < t) return n === "desc" ? 1 : -1;
			if (e > t) return n === "desc" ? -1 : 1;
		}
		return n === "desc" ? i - r : r - i;
	}
	return 0;
};
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/isSymbol.mjs
function li(e) {
	return typeof e == "symbol" || e instanceof Symbol;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/isKey.mjs
var ui = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, di = /^\w*$/;
function fi(e, t) {
	return Array.isArray(e) ? !1 : typeof e == "number" || typeof e == "boolean" || e == null || li(e) ? !0 : typeof e == "string" && (di.test(e) || !ui.test(e)) || t != null && Object.hasOwn(t, e);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/array/orderBy.mjs
function pi(e, t, n, r) {
	if (e == null) return [];
	n = r ? void 0 : n, Array.isArray(e) || (e = Object.values(e)), Array.isArray(t) || (t = t == null ? [null] : [t]), t.length === 0 && (t = [null]), Array.isArray(n) || (n = n == null ? [] : [n]), n = n.map((e) => String(e));
	let i = (e, t) => {
		let n = e;
		for (let e = 0; e < t.length && n != null; ++e) n = n[t[e]];
		return n;
	}, a = (e, t) => t == null || e == null ? t : typeof e == "object" && "key" in e ? Object.hasOwn(t, e.key) ? t[e.key] : i(t, e.path) : typeof e == "function" ? e(t) : Array.isArray(e) ? i(t, e) : typeof t == "object" ? t[e] : t, o = t.map((e) => (Array.isArray(e) && e.length === 1 && (e = e[0]), e == null || typeof e == "function" || Array.isArray(e) || fi(e) ? e : {
		key: e,
		path: Ft(e)
	}));
	return e.map((e) => ({
		original: e,
		criteria: o.map((t) => a(t, e))
	})).slice().sort((e, t) => {
		for (let r = 0; r < o.length; r++) {
			let i = ci(e.criteria[r], t.criteria[r], n[r]);
			if (i !== 0) return i;
		}
		return 0;
	}).map((e) => e.original);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/array/sortBy.mjs
function mi(e, ...t) {
	let n = t.length;
	return n > 1 && oi(e, t[0], t[1]) ? t = [] : n > 2 && oi(t[0], t[1], t[2]) && (t = [t[0]]), pi(e, ai(t), ["asc"]);
}
//#endregion
//#region node_modules/recharts/es6/state/selectors/legendSelectors.js
var hi = (e) => e.legend.settings, gi = (e) => e.legend.size;
L([(e) => e.legend.payload, hi], (e, t) => {
	var { itemSorter: n } = t, r = e.flat(1);
	return n ? mi(r, n) : r;
});
//#endregion
//#region node_modules/recharts/es6/util/useElementOffset.js
var _i = 1;
function vi() {
	var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], [t, n] = (0, S.useState)({
		height: 0,
		left: 0,
		top: 0,
		width: 0
	});
	return [t, (0, S.useCallback)((e) => {
		if (e != null) {
			var r = e.getBoundingClientRect(), i = {
				height: r.height,
				left: r.left,
				top: r.top,
				width: r.width
			};
			(Math.abs(i.height - t.height) > _i || Math.abs(i.left - t.left) > _i || Math.abs(i.top - t.top) > _i || Math.abs(i.width - t.width) > _i) && n({
				height: i.height,
				left: i.left,
				top: i.top,
				width: i.width
			});
		}
	}, [
		t.width,
		t.height,
		t.top,
		t.left,
		...e
	])];
}
//#endregion
//#region node_modules/redux/dist/redux.mjs
function yi(e) {
	return `Minified Redux error #${e}; visit https://redux.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
var bi = typeof Symbol == "function" && Symbol.observable || "@@observable", xi = () => Math.random().toString(36).substring(7).split("").join("."), Si = {
	INIT: `@@redux/INIT${/* @__PURE__ */ xi()}`,
	REPLACE: `@@redux/REPLACE${/* @__PURE__ */ xi()}`,
	PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${xi()}`
};
function Ci(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	for (; Object.getPrototypeOf(t) !== null;) t = Object.getPrototypeOf(t);
	return Object.getPrototypeOf(e) === t || Object.getPrototypeOf(e) === null;
}
function wi(e, t, n) {
	if (typeof e != "function") throw Error(yi(2));
	if (typeof t == "function" && typeof n == "function" || typeof n == "function" && typeof arguments[3] == "function") throw Error(yi(0));
	if (typeof t == "function" && n === void 0 && (n = t, t = void 0), n !== void 0) {
		if (typeof n != "function") throw Error(yi(1));
		return n(wi)(e, t);
	}
	let r = e, i = t, a = /* @__PURE__ */ new Map(), o = a, s = 0, c = !1;
	function l() {
		o === a && (o = /* @__PURE__ */ new Map(), a.forEach((e, t) => {
			o.set(t, e);
		}));
	}
	function u() {
		if (c) throw Error(yi(3));
		return i;
	}
	function d(e) {
		if (typeof e != "function") throw Error(yi(4));
		if (c) throw Error(yi(5));
		let t = !0;
		l();
		let n = s++;
		return o.set(n, e), function() {
			if (t) {
				if (c) throw Error(yi(6));
				t = !1, l(), o.delete(n), a = null;
			}
		};
	}
	function f(e) {
		if (!Ci(e)) throw Error(yi(7));
		if (e.type === void 0) throw Error(yi(8));
		if (typeof e.type != "string") throw Error(yi(17));
		if (c) throw Error(yi(9));
		try {
			c = !0, i = r(i, e);
		} finally {
			c = !1;
		}
		return (a = o).forEach((e) => {
			e();
		}), e;
	}
	function p(e) {
		if (typeof e != "function") throw Error(yi(10));
		r = e, f({ type: Si.REPLACE });
	}
	function m() {
		let e = d;
		return {
			subscribe(t) {
				if (typeof t != "object" || !t) throw Error(yi(11));
				function n() {
					let e = t;
					e.next && e.next(u());
				}
				return n(), { unsubscribe: e(n) };
			},
			[bi]() {
				return this;
			}
		};
	}
	return f({ type: Si.INIT }), {
		dispatch: f,
		subscribe: d,
		getState: u,
		replaceReducer: p,
		[bi]: m
	};
}
function Ti(e) {
	Object.keys(e).forEach((t) => {
		let n = e[t];
		if (n(void 0, { type: Si.INIT }) === void 0) throw Error(yi(12));
		if (n(void 0, { type: Si.PROBE_UNKNOWN_ACTION() }) === void 0) throw Error(yi(13));
	});
}
function Ei(e) {
	let t = Object.keys(e), n = {};
	for (let r = 0; r < t.length; r++) {
		let i = t[r];
		typeof e[i] == "function" && (n[i] = e[i]);
	}
	let r = Object.keys(n), i;
	try {
		Ti(n);
	} catch (e) {
		i = e;
	}
	return function(e = {}, t) {
		if (i) throw i;
		let a = !1, o = {};
		for (let i = 0; i < r.length; i++) {
			let s = r[i], c = n[s], l = e[s], u = c(l, t);
			if (u === void 0) throw t && t.type, Error(yi(14));
			o[s] = u, a ||= u !== l;
		}
		return a ||= r.length !== Object.keys(e).length, a ? o : e;
	};
}
function Di(...e) {
	return e.length === 0 ? (e) => e : e.length === 1 ? e[0] : e.reduce((e, t) => (...n) => e(t(...n)));
}
function Oi(...e) {
	return (t) => (n, r) => {
		let i = t(n, r), a = () => {
			throw Error(yi(15));
		}, o = {
			getState: i.getState,
			dispatch: (e, ...t) => a(e, ...t)
		};
		return a = Di(...e.map((e) => e(o)))(i.dispatch), {
			...i,
			dispatch: a
		};
	};
}
function ki(e) {
	return Ci(e) && "type" in e && typeof e.type == "string";
}
//#endregion
//#region node_modules/@reduxjs/toolkit/node_modules/immer/dist/immer.mjs
var Ai = Symbol.for("immer-nothing"), ji = Symbol.for("immer-draftable"), Mi = Symbol.for("immer-state");
function Ni(e, ...t) {
	throw Error(`[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`);
}
var R = Object, z = R.getPrototypeOf, B = "constructor", Pi = "prototype", Fi = "configurable", Ii = "enumerable", Li = "writable", Ri = "value", zi = (e) => !!e && !!e[Mi];
function Bi(e) {
	return e ? Ui(e) || Xi(e) || !!e[ji] || !!e[B]?.[ji] || Zi(e) || Qi(e) : !1;
}
var Vi = R[Pi][B].toString(), Hi = /* @__PURE__ */ new WeakMap();
function Ui(e) {
	if (!e || !$i(e)) return !1;
	let t = z(e);
	if (t === null || t === R[Pi]) return !0;
	let n = R.hasOwnProperty.call(t, B) && t[B];
	if (n === Object) return !0;
	if (!ea(n)) return !1;
	let r = Hi.get(n);
	return r === void 0 && (r = Function.toString.call(n), Hi.set(n, r)), r === Vi;
}
function Wi(e, t, n = !0) {
	Gi(e) === 0 ? (n ? Reflect.ownKeys(e) : R.keys(e)).forEach((n) => {
		t(n, e[n], e);
	}) : e.forEach((n, r) => t(r, n, e));
}
function Gi(e) {
	let t = e[Mi];
	return t ? t.type_ : Xi(e) ? 1 : Zi(e) ? 2 : Qi(e) ? 3 : 0;
}
var Ki = (e, t, n = Gi(e)) => n === 2 ? e.has(t) : R[Pi].hasOwnProperty.call(e, t), qi = (e, t, n = Gi(e)) => n === 2 ? e.get(t) : e[t], Ji = (e, t, n, r = Gi(e)) => {
	r === 2 ? e.set(t, n) : r === 3 ? e.add(n) : e[t] = n;
};
function Yi(e, t) {
	return e === t ? e !== 0 || 1 / e == 1 / t : e !== e && t !== t;
}
var Xi = Array.isArray, Zi = (e) => e instanceof Map, Qi = (e) => e instanceof Set, $i = (e) => typeof e == "object", ea = (e) => typeof e == "function", ta = (e) => typeof e == "boolean";
function na(e) {
	let t = +e;
	return Number.isInteger(t) && String(t) === e;
}
var ra = (e) => e.copy_ || e.base_, ia = (e) => e.modified_ ? e.copy_ : e.base_;
function aa(e, t) {
	if (Zi(e)) return new Map(e);
	if (Qi(e)) return new Set(e);
	if (Xi(e)) return Array[Pi].slice.call(e);
	let n = Ui(e);
	if (t === !0 || t === "class_only" && !n) {
		let t = R.getOwnPropertyDescriptors(e);
		delete t[Mi];
		let n = Reflect.ownKeys(t);
		for (let r = 0; r < n.length; r++) {
			let i = n[r], a = t[i];
			a[Li] === !1 && (a[Li] = !0, a[Fi] = !0), (a.get || a.set) && (t[i] = {
				[Fi]: !0,
				[Li]: !0,
				[Ii]: a[Ii],
				[Ri]: e[i]
			});
		}
		return R.create(z(e), t);
	} else {
		let t = z(e);
		if (t !== null && n) return { ...e };
		let r = R.create(t);
		return R.assign(r, e);
	}
}
function oa(e, t = !1) {
	return la(e) || zi(e) || !Bi(e) ? e : (Gi(e) > 1 && R.defineProperties(e, {
		set: ca,
		add: ca,
		clear: ca,
		delete: ca
	}), R.freeze(e), t && Wi(e, (e, t) => {
		oa(t, !0);
	}, !1), e);
}
function sa() {
	Ni(2);
}
var ca = { [Ri]: sa };
function la(e) {
	return e === null || !$i(e) ? !0 : R.isFrozen(e);
}
var ua = "MapSet", da = "Patches", fa = "ArrayMethods", pa = {};
function ma(e) {
	let t = pa[e];
	return t || Ni(0, e), t;
}
var ha = (e) => !!pa[e], ga, _a = () => ga, va = (e, t) => ({
	drafts_: [],
	parent_: e,
	immer_: t,
	canAutoFreeze_: !0,
	unfinalizedDrafts_: 0,
	handledSet_: /* @__PURE__ */ new Set(),
	processedForPatches_: /* @__PURE__ */ new Set(),
	mapSetPlugin_: ha(ua) ? ma(ua) : void 0,
	arrayMethodsPlugin_: ha(fa) ? ma(fa) : void 0
});
function ya(e, t) {
	t && (e.patchPlugin_ = ma(da), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function ba(e) {
	xa(e), e.drafts_.forEach(Ca), e.drafts_ = null;
}
function xa(e) {
	e === ga && (ga = e.parent_);
}
var Sa = (e) => ga = va(ga, e);
function Ca(e) {
	let t = e[Mi];
	t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function wa(e, t) {
	t.unfinalizedDrafts_ = t.drafts_.length;
	let n = t.drafts_[0];
	if (e !== void 0 && e !== n) {
		n[Mi].modified_ && (ba(t), Ni(4)), Bi(e) && (e = Ta(t, e));
		let { patchPlugin_: r } = t;
		r && r.generateReplacementPatches_(n[Mi].base_, e, t);
	} else e = Ta(t, n);
	return Ea(t, e, !0), ba(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e === Ai ? void 0 : e;
}
function Ta(e, t) {
	if (la(t)) return t;
	let n = t[Mi];
	if (!n) return Pa(t, e.handledSet_, e);
	if (!Oa(n, e)) return t;
	if (!n.modified_) return n.base_;
	if (!n.finalized_) {
		let { callbacks_: t } = n;
		if (t) for (; t.length > 0;) t.pop()(e);
		Ma(n, e);
	}
	return n.copy_;
}
function Ea(e, t, n = !1) {
	!e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && oa(t, n);
}
function Da(e) {
	e.finalized_ = !0, e.scope_.unfinalizedDrafts_--;
}
var Oa = (e, t) => e.scope_ === t, ka = [];
function Aa(e, t, n, r) {
	let i = ra(e), a = e.type_;
	if (r !== void 0 && qi(i, r, a) === t) {
		Ji(i, r, n, a);
		return;
	}
	if (!e.draftLocations_) {
		let t = e.draftLocations_ = /* @__PURE__ */ new Map();
		Wi(i, (e, n) => {
			if (zi(n)) {
				let r = t.get(n) || [];
				r.push(e), t.set(n, r);
			}
		});
	}
	let o = e.draftLocations_.get(t) ?? ka;
	for (let e of o) Ji(i, e, n, a);
}
function ja(e, t, n) {
	e.callbacks_.push(function(r) {
		let i = t;
		if (!i || !Oa(i, r)) return;
		r.mapSetPlugin_?.fixSetContents(i);
		let a = ia(i);
		Aa(e, i.draft_ ?? i, a, n), Ma(i, r);
	});
}
function Ma(e, t) {
	if (e.modified_ && !e.finalized_ && (e.type_ === 3 || e.type_ === 1 && e.allIndicesReassigned_ || (e.assigned_?.size ?? 0) > 0)) {
		let { patchPlugin_: n } = t;
		if (n) {
			let r = n.getPath(e);
			r && n.generatePatches_(e, r, t);
		}
		Da(e);
	}
}
function Na(e, t, n) {
	let { scope_: r } = e;
	if (zi(n)) {
		let i = n[Mi];
		Oa(i, r) && i.callbacks_.push(function() {
			Ua(e), Aa(e, n, ia(i), t);
		});
	} else Bi(n) && e.callbacks_.push(function() {
		let i = ra(e);
		e.type_ === 3 ? i.has(n) && Pa(n, r.handledSet_, r) : qi(i, t, e.type_) === n && r.drafts_.length > 1 && (e.assigned_.get(t) ?? !1) === !0 && e.copy_ && Pa(qi(e.copy_, t, e.type_), r.handledSet_, r);
	});
}
function Pa(e, t, n) {
	return !n.immer_.autoFreeze_ && n.unfinalizedDrafts_ < 1 || zi(e) || t.has(e) || !Bi(e) || la(e) ? e : (t.add(e), Wi(e, (r, i) => {
		if (zi(i)) {
			let t = i[Mi];
			Oa(t, n) && (Ji(e, r, ia(t), e.type_), Da(t));
		} else Bi(i) && Pa(i, t, n);
	}), e);
}
function Fa(e, t) {
	let n = Xi(e), r = {
		type_: +!!n,
		scope_: t ? t.scope_ : _a(),
		modified_: !1,
		finalized_: !1,
		assigned_: void 0,
		parent_: t,
		base_: e,
		draft_: null,
		copy_: null,
		revoke_: null,
		isManual_: !1,
		callbacks_: void 0
	}, i = r, a = Ia;
	n && (i = [r], a = La);
	let { revoke: o, proxy: s } = Proxy.revocable(i, a);
	return r.draft_ = s, r.revoke_ = o, [s, r];
}
var Ia = {
	get(e, t) {
		if (t === Mi) return e;
		let n = e.scope_.arrayMethodsPlugin_, r = e.type_ === 1 && typeof t == "string";
		if (r && n?.isArrayOperationMethod(t)) return n.createMethodInterceptor(e, t);
		let i = ra(e);
		if (!Ki(i, t, e.type_)) return Ba(e, i, t);
		let a = i[t];
		if (e.finalized_ || !Bi(a) || r && e.operationMethod && n?.isMutatingArrayMethod(e.operationMethod) && na(t)) return a;
		if (a === Ra(e.base_, t) || za(e, t, a)) {
			Ua(e);
			let n = e.type_ === 1 ? +t : t, r = Ga(e.scope_, a, e, n);
			return e.copy_[n] = r;
		}
		return a;
	},
	has(e, t) {
		return t in ra(e);
	},
	ownKeys(e) {
		return Reflect.ownKeys(ra(e));
	},
	set(e, t, n) {
		let r = Va(ra(e), t);
		if (r?.set) return r.set.call(e.draft_, n), !0;
		if (!e.modified_) {
			let r = Ra(ra(e), t), i = r?.[Mi];
			if (i && i.base_ === n) return e.copy_[t] = n, e.assigned_.set(t, !1), !0;
			if (Yi(n, r) && (n !== void 0 || Ki(e.base_, t, e.type_))) return !0;
			Ua(e), Ha(e);
		}
		return e.copy_[t] === n && (n !== void 0 || Ki(e.copy_, t, e.type_)) || Number.isNaN(n) && Number.isNaN(e.copy_[t]) ? !0 : (e.copy_[t] = n, e.assigned_.set(t, !0), Na(e, t, n), !0);
	},
	deleteProperty(e, t) {
		return Ua(e), Ra(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_.set(t, !1), Ha(e)) : e.assigned_.delete(t), e.copy_ && delete e.copy_[t], !0;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = ra(e), r = Reflect.getOwnPropertyDescriptor(n, t);
		return r && {
			[Li]: !0,
			[Fi]: e.type_ !== 1 || t !== "length",
			[Ii]: r[Ii],
			[Ri]: n[t]
		};
	},
	defineProperty() {
		Ni(11);
	},
	getPrototypeOf(e) {
		return z(e.base_);
	},
	setPrototypeOf() {
		Ni(12);
	}
}, La = {};
for (let e in Ia) {
	let t = Ia[e];
	La[e] = function() {
		let e = arguments;
		return e[0] = e[0][0], t.apply(this, e);
	};
}
La.deleteProperty = function(e, t) {
	return La.set.call(this, e, t, void 0);
}, La.set = function(e, t, n) {
	return Ia.set.call(this, e[0], t, n, e[0]);
};
function Ra(e, t) {
	let n = e[Mi];
	return (n ? ra(n) : e)[t];
}
function za(e, t, n) {
	return e.type_ !== 1 || !e.allIndicesReassigned_ || e.assigned_?.get(t) || !Bi(n) || n[Mi] ? !1 : e.baseRefs_.has(n);
}
function Ba(e, t, n) {
	let r = Va(t, n);
	return r ? Ri in r ? r[Ri] : r.get?.call(e.draft_) : void 0;
}
function Va(e, t) {
	if (!(t in e)) return;
	let n = z(e);
	for (; n;) {
		let e = Object.getOwnPropertyDescriptor(n, t);
		if (e) return e;
		n = z(n);
	}
}
function Ha(e) {
	e.modified_ || (e.modified_ = !0, e.parent_ && Ha(e.parent_));
}
function Ua(e) {
	e.copy_ ||= (e.assigned_ = /* @__PURE__ */ new Map(), aa(e.base_, e.scope_.immer_.useStrictShallowCopy_));
}
var Wa = class {
	constructor(e) {
		this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.useStrictIteration_ = !1, this.produce = (e, t, n) => {
			if (ea(e) && !ea(t)) {
				let n = t;
				t = e;
				let r = this;
				return function(e = n, ...i) {
					return r.produce(e, (e) => t.call(this, e, ...i));
				};
			}
			ea(t) || Ni(6), n !== void 0 && !ea(n) && Ni(7);
			let r;
			if (Bi(e)) {
				let i = Sa(this), a = Ga(i, e, void 0), o = !0;
				try {
					r = t(a), o = !1;
				} finally {
					o ? ba(i) : xa(i);
				}
				return ya(i, n), wa(r, i);
			} else if (!e || !$i(e)) {
				if (r = t(e), r === void 0 && (r = e), r === Ai && (r = void 0), this.autoFreeze_ && oa(r, !0), n) {
					let t = [], i = [];
					ma(da).generateReplacementPatches_(e, r, {
						patches_: t,
						inversePatches_: i
					}), n(t, i);
				}
				return r;
			} else Ni(1, e);
		}, this.produceWithPatches = (e, t) => {
			if (ea(e)) return (t, ...n) => this.produceWithPatches(t, (t) => e(t, ...n));
			let n, r;
			return [
				this.produce(e, t, (e, t) => {
					n = e, r = t;
				}),
				n,
				r
			];
		}, ta(e?.autoFreeze) && this.setAutoFreeze(e.autoFreeze), ta(e?.useStrictShallowCopy) && this.setUseStrictShallowCopy(e.useStrictShallowCopy), ta(e?.useStrictIteration) && this.setUseStrictIteration(e.useStrictIteration);
	}
	createDraft(e) {
		Bi(e) || Ni(8), zi(e) && (e = Ka(e));
		let t = Sa(this), n = Ga(t, e, void 0);
		return n[Mi].isManual_ = !0, xa(t), n;
	}
	finishDraft(e, t) {
		let n = e && e[Mi];
		(!n || !n.isManual_) && Ni(9);
		let { scope_: r } = n;
		return ya(r, t), wa(void 0, r);
	}
	setAutoFreeze(e) {
		this.autoFreeze_ = e;
	}
	setUseStrictShallowCopy(e) {
		this.useStrictShallowCopy_ = e;
	}
	setUseStrictIteration(e) {
		this.useStrictIteration_ = e;
	}
	shouldUseStrictIteration() {
		return this.useStrictIteration_;
	}
	applyPatches(e, t) {
		let n;
		for (n = t.length - 1; n >= 0; n--) {
			let r = t[n];
			if (r.path.length === 0 && r.op === "replace") {
				e = r.value;
				break;
			}
		}
		n > -1 && (t = t.slice(n + 1));
		let r = ma(da).applyPatches_;
		return zi(e) ? r(e, t) : this.produce(e, (e) => r(e, t));
	}
};
function Ga(e, t, n, r) {
	let [i, a] = Zi(t) ? ma(ua).proxyMap_(t, n) : Qi(t) ? ma(ua).proxySet_(t, n) : Fa(t, n);
	return (n?.scope_ ?? _a()).drafts_.push(i), a.callbacks_ = n?.callbacks_ ?? [], a.key_ = r, n && r !== void 0 ? ja(n, a, r) : a.callbacks_.push(function(e) {
		e.mapSetPlugin_?.fixSetContents(a);
		let { patchPlugin_: t } = e;
		a.modified_ && t && t.generatePatches_(a, [], e);
	}), i;
}
function Ka(e) {
	return zi(e) || Ni(10, e), qa(e);
}
function qa(e) {
	if (!Bi(e) || la(e)) return e;
	let t = e[Mi], n, r = !0;
	if (t) {
		if (!t.modified_) return t.base_;
		t.finalized_ = !0, n = aa(e, t.scope_.immer_.useStrictShallowCopy_), r = t.scope_.immer_.shouldUseStrictIteration();
	} else n = aa(e, !0);
	return Wi(n, (e, t) => {
		Ji(n, e, qa(t));
	}, r), t && (t.finalized_ = !1), n;
}
var Ja = new Wa().produce;
//#endregion
//#region node_modules/redux-thunk/dist/redux-thunk.mjs
function Ya(e) {
	return ({ dispatch: t, getState: n }) => (r) => (i) => typeof i == "function" ? i(t, n, e) : r(i);
}
var Xa = Ya(), Za = Ya, Qa = typeof window < "u" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
	if (arguments.length !== 0) return typeof arguments[0] == "object" ? Di : Di.apply(null, arguments);
};
typeof window < "u" && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__;
function $a(e, t) {
	function n(...n) {
		if (t) {
			let r = t(...n);
			if (!r) throw Error(cs(0));
			return {
				type: e,
				payload: r.payload,
				..."meta" in r && { meta: r.meta },
				..."error" in r && { error: r.error }
			};
		}
		return {
			type: e,
			payload: n[0]
		};
	}
	return n.toString = () => `${e}`, n.type = e, n.match = (t) => ki(t) && t.type === e, n;
}
var eo = class e extends Array {
	constructor(...t) {
		super(...t), Object.setPrototypeOf(this, e.prototype);
	}
	static get [Symbol.species]() {
		return e;
	}
	concat(...e) {
		return super.concat.apply(this, e);
	}
	prepend(...t) {
		return t.length === 1 && Array.isArray(t[0]) ? new e(...t[0].concat(this)) : new e(...t.concat(this));
	}
};
function to(e) {
	return Bi(e) ? Ja(e, () => {}) : e;
}
function no(e, t, n) {
	return e.has(t) ? e.get(t) : e.set(t, n(t)).get(t);
}
function ro(e) {
	return typeof e == "boolean";
}
var io = () => function(e) {
	let { thunk: t = !0, immutableCheck: n = !0, serializableCheck: r = !0, actionCreatorCheck: i = !0 } = e ?? {}, a = new eo();
	return t && (ro(t) ? a.push(Xa) : a.push(Za(t.extraArgument))), a;
}, ao = "RTK_autoBatch", oo = () => (e) => ({
	payload: e,
	meta: { [ao]: !0 }
}), so = (e) => (t) => {
	setTimeout(t, e);
}, co = (e, t) => (n) => {
	let r = !1, i = () => {
		r || (r = !0, cancelAnimationFrame(a), clearTimeout(o), n());
	}, a = e(i), o = setTimeout(i, t);
}, lo = (e = { type: "raf" }) => (t) => (...n) => {
	let r = t(...n), i = !0, a = !1, o = !1, s = /* @__PURE__ */ new Set(), c = e.type === "tick" ? queueMicrotask : e.type === "raf" ? typeof window < "u" && window.requestAnimationFrame ? co(window.requestAnimationFrame, 100) : so(10) : e.type === "callback" ? e.queueNotification : so(e.timeout), l = () => {
		o = !1, a && (a = !1, s.forEach((e) => e()));
	};
	return Object.assign({}, r, {
		subscribe(e) {
			let t = r.subscribe(() => i && e());
			return s.add(e), () => {
				t(), s.delete(e);
			};
		},
		dispatch(e) {
			try {
				return i = !e?.meta?.[ao], a = !i, a && (o || (o = !0, c(l))), r.dispatch(e);
			} finally {
				i = !0;
			}
		}
	});
}, uo = (e) => function(t) {
	let { autoBatch: n = !0 } = t ?? {}, r = new eo(e);
	return n && r.push(lo(typeof n == "object" ? n : void 0)), r;
};
function fo(e) {
	let t = io(), { reducer: n = void 0, middleware: r, devTools: i = !0, duplicateMiddlewareCheck: a = !0, preloadedState: o = void 0, enhancers: s = void 0 } = e || {}, c;
	if (typeof n == "function") c = n;
	else if (Ci(n)) c = Ei(n);
	else throw Error(cs(1));
	let l;
	l = typeof r == "function" ? r(t) : t();
	let u = Di;
	i && (u = Qa({
		trace: !1,
		...typeof i == "object" && i
	}));
	let d = uo(Oi(...l)), f = typeof s == "function" ? s(d) : d(), p = u(...f);
	return wi(c, o, p);
}
function V(e) {
	let t = {}, n = [], r, i = {
		addCase(e, n) {
			let r = typeof e == "string" ? e : e.type;
			if (!r) throw Error(cs(28));
			if (r in t) throw Error(cs(29));
			return t[r] = n, i;
		},
		addAsyncThunk(e, r) {
			return r.pending && (t[e.pending.type] = r.pending), r.rejected && (t[e.rejected.type] = r.rejected), r.fulfilled && (t[e.fulfilled.type] = r.fulfilled), r.settled && n.push({
				matcher: e.settled,
				reducer: r.settled
			}), i;
		},
		addMatcher(e, t) {
			return n.push({
				matcher: e,
				reducer: t
			}), i;
		},
		addDefaultCase(e) {
			return r = e, i;
		}
	};
	return e(i), [
		t,
		n,
		r
	];
}
function po(e) {
	return typeof e == "function";
}
function mo(e, t) {
	let [n, r, i] = V(t), a;
	if (po(e)) a = () => to(e());
	else {
		let t = to(e);
		a = () => t;
	}
	function o(e = a(), t) {
		let o = [n[t.type], ...r.filter(({ matcher: e }) => e(t)).map(({ reducer: e }) => e)];
		return o.filter((e) => !!e).length === 0 && (o = [i]), o.reduce((e, n) => {
			if (n) if (zi(e)) {
				let r = n(e, t);
				return r === void 0 ? e : r;
			} else if (Bi(e)) return Ja(e, (e) => n(e, t));
			else {
				let r = n(e, t);
				if (r === void 0) {
					if (e === null) return e;
					throw Error("A case reducer on a non-draftable value must not return undefined");
				}
				return r;
			}
			return e;
		}, e);
	}
	return o.getInitialState = a, o;
}
var ho = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW", go = (e = 21) => {
	let t = "", n = e;
	for (; n--;) t += ho[Math.random() * 64 | 0];
	return t;
}, _o = /* @__PURE__ */ Symbol.for("rtk-slice-createasyncthunk");
function vo(e, t) {
	return `${e}/${t}`;
}
function yo({ creators: e } = {}) {
	let t = e?.asyncThunk?.[_o];
	return function(e) {
		let { name: n, reducerPath: r = n } = e;
		if (!n) throw Error(cs(11));
		let i = (typeof e.reducers == "function" ? e.reducers(So()) : e.reducers) || {}, a = Object.keys(i), o = {
			sliceCaseReducersByName: {},
			sliceCaseReducersByType: {},
			actionCreators: {},
			sliceMatchers: []
		}, s = {
			addCase(e, t) {
				let n = typeof e == "string" ? e : e.type;
				if (!n) throw Error(cs(12));
				if (n in o.sliceCaseReducersByType) throw Error(cs(13));
				return o.sliceCaseReducersByType[n] = t, s;
			},
			addMatcher(e, t) {
				return o.sliceMatchers.push({
					matcher: e,
					reducer: t
				}), s;
			},
			exposeAction(e, t) {
				return o.actionCreators[e] = t, s;
			},
			exposeCaseReducer(e, t) {
				return o.sliceCaseReducersByName[e] = t, s;
			}
		};
		a.forEach((r) => {
			let a = i[r], o = {
				reducerName: r,
				type: vo(n, r),
				createNotation: typeof e.reducers == "function"
			};
			wo(a) ? Eo(o, a, s, t) : Co(o, a, s);
		});
		function c() {
			let [t = {}, n = [], r = void 0] = typeof e.extraReducers == "function" ? V(e.extraReducers) : [e.extraReducers], i = {
				...t,
				...o.sliceCaseReducersByType
			};
			return mo(e.initialState, (e) => {
				for (let t in i) e.addCase(t, i[t]);
				for (let t of o.sliceMatchers) e.addMatcher(t.matcher, t.reducer);
				for (let t of n) e.addMatcher(t.matcher, t.reducer);
				r && e.addDefaultCase(r);
			});
		}
		let l = (e) => e, u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new WeakMap(), f;
		function p(e, t) {
			return f ||= c(), f(e, t);
		}
		function m() {
			return f ||= c(), f.getInitialState();
		}
		function h(t, n = !1) {
			function r(e) {
				let i = e[t];
				return i === void 0 && n && (i = no(d, r, m)), i;
			}
			function i(t = l) {
				return no(no(u, n, () => /* @__PURE__ */ new WeakMap()), t, () => {
					let r = {};
					for (let [i, a] of Object.entries(e.selectors ?? {})) r[i] = bo(a, t, () => no(d, t, m), n);
					return r;
				});
			}
			return {
				reducerPath: t,
				getSelectors: i,
				get selectors() {
					return i(r);
				},
				selectSlice: r
			};
		}
		let g = {
			name: n,
			reducer: p,
			actions: o.actionCreators,
			caseReducers: o.sliceCaseReducersByName,
			getInitialState: m,
			...h(r),
			injectInto(e, { reducerPath: t, ...n } = {}) {
				let i = t ?? r;
				return e.inject({
					reducerPath: i,
					reducer: p
				}, n), {
					...g,
					...h(i, !0)
				};
			}
		};
		return g;
	};
}
function bo(e, t, n, r) {
	function i(i, ...a) {
		let o = t(i);
		return o === void 0 && r && (o = n()), e(o, ...a);
	}
	return i.unwrapped = e, i;
}
var xo = /* @__PURE__ */ yo();
function So() {
	function e(e, t) {
		return {
			_reducerDefinitionType: "asyncThunk",
			payloadCreator: e,
			...t
		};
	}
	return e.withTypes = () => e, {
		reducer(e) {
			return Object.assign({ [e.name](...t) {
				return e(...t);
			} }[e.name], { _reducerDefinitionType: "reducer" });
		},
		preparedReducer(e, t) {
			return {
				_reducerDefinitionType: "reducerWithPrepare",
				prepare: e,
				reducer: t
			};
		},
		asyncThunk: e
	};
}
function Co({ type: e, reducerName: t, createNotation: n }, r, i) {
	let a, o;
	if ("reducer" in r) {
		if (n && !To(r)) throw Error(cs(17));
		a = r.reducer, o = r.prepare;
	} else a = r;
	i.addCase(e, a).exposeCaseReducer(t, a).exposeAction(t, o ? $a(e, o) : $a(e));
}
function wo(e) {
	return e._reducerDefinitionType === "asyncThunk";
}
function To(e) {
	return e._reducerDefinitionType === "reducerWithPrepare";
}
function Eo({ type: e, reducerName: t }, n, r, i) {
	if (!i) throw Error(cs(18));
	let { payloadCreator: a, fulfilled: o, pending: s, rejected: c, settled: l, options: u } = n, d = i(e, a, u);
	r.exposeAction(t, d), o && r.addCase(d.fulfilled, o), s && r.addCase(d.pending, s), c && r.addCase(d.rejected, c), l && r.addMatcher(d.settled, l), r.exposeCaseReducer(t, {
		fulfilled: o || Do,
		pending: s || Do,
		rejected: c || Do,
		settled: l || Do
	});
}
function Do() {}
var Oo = "task", ko = "listener", Ao = "completed", jo = "cancelled", Mo = `task-${jo}`, No = `task-${Ao}`, Po = `${ko}-${jo}`, Fo = `${ko}-${Ao}`, Io = class {
	constructor(e) {
		this.code = e, this.message = `${Oo} ${jo} (reason: ${e})`;
	}
	code;
	name = "TaskAbortError";
	message;
}, Lo = (e, t) => {
	if (typeof e != "function") throw TypeError(cs(32));
}, Ro = () => {}, zo = (e, t = Ro) => (e.catch(t), e), Bo = (e, t) => (e.addEventListener("abort", t, { once: !0 }), () => e.removeEventListener("abort", t)), Vo = (e) => {
	if (e.aborted) throw new Io(e.reason);
};
function Ho(e, t) {
	let n = Ro;
	return new Promise((r, i) => {
		let a = () => i(new Io(e.reason));
		if (e.aborted) {
			a();
			return;
		}
		n = Bo(e, a), t.finally(() => n()).then(r, i);
	}).finally(() => {
		n = Ro;
	});
}
var Uo = async (e, t) => {
	try {
		return await Promise.resolve(), {
			status: "ok",
			value: await e()
		};
	} catch (e) {
		return {
			status: e instanceof Io ? "cancelled" : "rejected",
			error: e
		};
	} finally {
		t?.();
	}
}, Wo = (e) => (t) => zo(Ho(e, t).then((t) => (Vo(e), t))), Go = (e) => {
	let t = Wo(e);
	return (e) => t(new Promise((t) => setTimeout(t, e)));
}, { assign: Ko } = Object, qo = {}, Jo = "listenerMiddleware", Yo = (e, t) => {
	let n = (t) => Bo(e, () => t.abort(e.reason));
	return (r, i) => {
		Lo(r, "taskExecutor");
		let a = new AbortController();
		n(a);
		let o = Uo(async () => {
			Vo(e), Vo(a.signal);
			let t = await r({
				pause: Wo(a.signal),
				delay: Go(a.signal),
				signal: a.signal
			});
			return Vo(a.signal), t;
		}, () => a.abort(No));
		return i?.autoJoin && t.push(o.catch(Ro)), {
			result: Wo(e)(o),
			cancel() {
				a.abort(Mo);
			}
		};
	};
}, Xo = (e, t) => {
	let n = async (n, r) => {
		Vo(t);
		let i = () => {}, a = [new Promise((t, r) => {
			let a = e({
				predicate: n,
				effect: (e, n) => {
					n.unsubscribe(), t([
						e,
						n.getState(),
						n.getOriginalState()
					]);
				}
			});
			i = () => {
				a(), r();
			};
		})];
		r != null && a.push(new Promise((e) => setTimeout(e, r, null)));
		try {
			let e = await Ho(t, Promise.race(a));
			return Vo(t), e;
		} finally {
			i();
		}
	};
	return ((e, t) => zo(n(e, t)));
}, Zo = (e) => {
	let { type: t, actionCreator: n, matcher: r, predicate: i, effect: a } = e;
	if (t) i = $a(t).match;
	else if (n) t = n.type, i = n.match;
	else if (r) i = r;
	else if (!i) throw Error(cs(21));
	return Lo(a, "options.listener"), {
		predicate: i,
		type: t,
		effect: a
	};
}, Qo = /* @__PURE__ */ Ko((e) => {
	let { type: t, predicate: n, effect: r } = Zo(e);
	return {
		id: go(),
		effect: r,
		type: t,
		predicate: n,
		pending: /* @__PURE__ */ new Set(),
		unsubscribe: () => {
			throw Error(cs(22));
		}
	};
}, { withTypes: () => Qo }), $o = (e, t) => {
	let { type: n, effect: r, predicate: i } = Zo(t);
	return Array.from(e.values()).find((e) => (typeof n == "string" ? e.type === n : e.predicate === i) && e.effect === r);
}, es = (e) => {
	e.pending.forEach((e) => {
		e.abort(Po);
	});
}, ts = (e, t) => () => {
	for (let e of t.keys()) es(e);
	e.clear();
}, ns = (e, t, n) => {
	try {
		e(t, n);
	} catch (e) {
		setTimeout(() => {
			throw e;
		}, 0);
	}
}, rs = /* @__PURE__ */ Ko(/* @__PURE__ */ $a(`${Jo}/add`), { withTypes: () => rs }), is = /* @__PURE__ */ $a(`${Jo}/removeAll`), as = /* @__PURE__ */ Ko(/* @__PURE__ */ $a(`${Jo}/remove`), { withTypes: () => as }), os = (...e) => {
	console.error(`${Jo}/error`, ...e);
}, ss = (e = {}) => {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = (e) => {
		let t = n.get(e) ?? 0;
		n.set(e, t + 1);
	}, i = (e) => {
		let t = n.get(e) ?? 1;
		t === 1 ? n.delete(e) : n.set(e, t - 1);
	}, { extra: a, onError: o = os } = e;
	Lo(o, "onError");
	let s = (e) => (e.unsubscribe = () => t.delete(e.id), t.set(e.id, e), (t) => {
		e.unsubscribe(), t?.cancelActive && es(e);
	}), c = ((e) => s($o(t, e) ?? Qo(e)));
	Ko(c, { withTypes: () => c });
	let l = (e) => {
		let n = $o(t, e);
		return n && (n.unsubscribe(), e.cancelActive && es(n)), !!n;
	};
	Ko(l, { withTypes: () => l });
	let u = async (e, n, s, l) => {
		let u = new AbortController(), d = Xo(c, u.signal), f = [];
		try {
			e.pending.add(u), r(e), await Promise.resolve(e.effect(n, Ko({}, s, {
				getOriginalState: l,
				condition: (e, t) => d(e, t).then(Boolean),
				take: d,
				delay: Go(u.signal),
				pause: Wo(u.signal),
				extra: a,
				signal: u.signal,
				fork: Yo(u.signal, f),
				unsubscribe: e.unsubscribe,
				subscribe: () => {
					t.set(e.id, e);
				},
				cancelActiveListeners: () => {
					e.pending.forEach((e, t, n) => {
						e !== u && (e.abort(Po), n.delete(e));
					});
				},
				cancel: () => {
					u.abort(Po), e.pending.delete(u);
				},
				throwIfCancelled: () => {
					Vo(u.signal);
				}
			})));
		} catch (e) {
			e instanceof Io || ns(o, e, { raisedBy: "effect" });
		} finally {
			await Promise.all(f), u.abort(Fo), i(e), e.pending.delete(u);
		}
	}, d = ts(t, n);
	return {
		middleware: (e) => (n) => (r) => {
			if (!ki(r)) return n(r);
			if (rs.match(r)) return c(r.payload);
			if (is.match(r)) {
				d();
				return;
			}
			if (as.match(r)) return l(r.payload);
			let i = e.getState(), a = () => {
				if (i === qo) throw Error(cs(23));
				return i;
			}, s;
			try {
				if (s = n(r), t.size > 0) {
					let n = e.getState(), s = Array.from(t.values());
					for (let t of s) {
						let s = !1;
						try {
							s = t.predicate(r, n, i);
						} catch (e) {
							s = !1, ns(o, e, { raisedBy: "predicate" });
						}
						s && u(t, r, e, a);
					}
				}
			} finally {
				i = qo;
			}
			return s;
		},
		startListening: c,
		stopListening: l,
		clearListeners: d
	};
};
function cs(e) {
	return `Minified Redux Toolkit error #${e}; visit https://redux-toolkit.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
//#endregion
//#region node_modules/recharts/es6/state/layoutSlice.js
var ls = xo({
	name: "chartLayout",
	initialState: {
		layoutType: "horizontal",
		width: 0,
		height: 0,
		margin: {
			top: 5,
			right: 5,
			bottom: 5,
			left: 5
		},
		scale: 1
	},
	reducers: {
		setLayout(e, t) {
			e.layoutType = t.payload;
		},
		setChartSize(e, t) {
			e.width = t.payload.width, e.height = t.payload.height;
		},
		setMargin(e, t) {
			e.margin.top = t.payload.top ?? 0, e.margin.right = t.payload.right ?? 0, e.margin.bottom = t.payload.bottom ?? 0, e.margin.left = t.payload.left ?? 0;
		},
		setScale(e, t) {
			e.scale = t.payload;
		}
	}
}), { setMargin: us, setLayout: ds, setChartSize: fs, setScale: ps } = ls.actions, ms = ls.reducer;
//#endregion
//#region node_modules/recharts/es6/util/getSliced.js
function hs(e, t, n) {
	return Array.isArray(e) && e && t + n !== 0 ? e.slice(t, n + 1) : e;
}
//#endregion
//#region node_modules/recharts/es6/util/isWellBehavedNumber.js
function H(e) {
	return Number.isFinite(e);
}
function gs(e) {
	return typeof e == "number" && e > 0 && Number.isFinite(e);
}
//#endregion
//#region node_modules/recharts/es6/util/ChartUtils.js
function _s(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function vs(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? _s(Object(n), !0).forEach(function(t) {
			ys(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : _s(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function ys(e, t, n) {
	return (t = bs(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function bs(e) {
	var t = xs(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function xs(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Ss(e, t, n) {
	return Zt(e) || Zt(t) ? n : Wt(t) ? It(e, t, n) : typeof t == "function" ? t(e) : n;
}
var Cs = (e, t, n) => {
	if (t && n) {
		var { width: r, height: i } = n, { align: a, verticalAlign: o, layout: s } = t;
		if ((s === "vertical" || s === "horizontal" && o === "middle") && a !== "center" && F(e[a])) return vs(vs({}, e), {}, { [a]: e[a] + (r || 0) });
		if ((s === "horizontal" || s === "vertical" && a === "center") && o !== "middle" && F(e[o])) return vs(vs({}, e), {}, { [o]: e[o] + (i || 0) });
	}
	return e;
}, ws = (e, t) => e === "horizontal" && t === "xAxis" || e === "vertical" && t === "yAxis" || e === "centric" && t === "angleAxis" || e === "radial" && t === "radiusAxis", Ts = (e, t, n, r) => {
	if (r) return e.map((e) => e.coordinate);
	var i, a, o = e.map((e) => (e.coordinate === t && (i = !0), e.coordinate === n && (a = !0), e.coordinate));
	return i || o.push(t), a || o.push(n), o;
}, Es = (e, t, n) => {
	if (!e) return null;
	var { duplicateDomain: r, type: i, range: a, scale: o, realScaleType: s, isCategorical: c, categoricalDomain: l, tickCount: u, ticks: d, niceTicks: f, axisType: p } = e;
	if (!o) return null;
	var m = s === "scaleBand" && o.bandwidth ? o.bandwidth() / 2 : 2, h = (t || n) && i === "category" && o.bandwidth ? o.bandwidth() / m : 0;
	return h = p === "angleAxis" && a && a.length >= 2 ? Vt(a[0] - a[1]) * 2 * h : h, t && (d || f) ? (d || f || []).map((e, t) => {
		var n = r ? r.indexOf(e) : e, i = o.map(n);
		return H(i) ? {
			coordinate: i + h,
			value: e,
			offset: h,
			index: t
		} : null;
	}).filter($t) : c && l ? l.map((e, t) => {
		var n = o.map(e);
		return H(n) ? {
			coordinate: n + h,
			value: e,
			index: t,
			offset: h
		} : null;
	}).filter($t) : o.ticks && !n && u != null ? o.ticks(u).map((e, t) => {
		var n = o.map(e);
		return H(n) ? {
			coordinate: n + h,
			value: e,
			index: t,
			offset: h
		} : null;
	}).filter($t) : o.domain().map((e, t) => {
		var n = o.map(e);
		return H(n) ? {
			coordinate: n + h,
			value: r ? r[e] : e,
			index: t,
			offset: h
		} : null;
	}).filter($t);
}, Ds = (e, t) => {
	if (!t || t.length !== 2 || !F(t[0]) || !F(t[1])) return e;
	var n = Math.min(t[0], t[1]), r = Math.max(t[0], t[1]), i = [e[0], e[1]];
	return (!F(e[0]) || e[0] < n) && (i[0] = n), (!F(e[1]) || e[1] > r) && (i[1] = r), i[0] > r && (i[0] = r), i[1] < n && (i[1] = n), i;
}, Os = {
	sign: (e) => {
		var t = e.length;
		if (!(t <= 0)) {
			var n = e[0]?.length;
			if (!(n == null || n <= 0)) for (var r = 0; r < n; ++r) for (var i = 0, a = 0, o = 0; o < t; ++o) {
				var s = e[o]?.[r];
				if (s != null) {
					var c = s[1], l = s[0], u = Ht(c) ? l : c;
					u >= 0 ? (s[0] = i, i += u, s[1] = i) : (s[0] = a, a += u, s[1] = a);
				}
			}
		}
	},
	expand: Dt,
	none: St,
	silhouette: Ot,
	wiggle: kt,
	positive: (e) => {
		var t = e.length;
		if (!(t <= 0)) {
			var n = e[0]?.length;
			if (!(n == null || n <= 0)) for (var r = 0; r < n; ++r) for (var i = 0, a = 0; a < t; ++a) {
				var o = e[a]?.[r];
				if (o != null) {
					var s = Ht(o[1]) ? o[0] : o[1];
					s >= 0 ? (o[0] = i, i += s, o[1] = i) : (o[0] = 0, o[1] = 0);
				}
			}
		}
	}
}, ks = (e, t, n) => {
	var r = Os[n] ?? St, i = Et().keys(t).value((e, t) => Number(Ss(e, t, 0))).order(Ct).offset(r)(e);
	return i.forEach((n, r) => {
		n.forEach((n, i) => {
			var a = Ss(e[i], t[r], 0);
			Array.isArray(a) && a.length === 2 && F(a[0]) && F(a[1]) && (n[0] = a[0], n[1] = a[1]);
		});
	}), i;
};
function As(e) {
	return e == null ? void 0 : String(e);
}
function js(e) {
	var { axis: t, ticks: n, bandSize: r, entry: i, index: a, dataKey: o } = e;
	if (t.type === "category") {
		if (!t.allowDuplicatedCategory && t.dataKey && !Zt(i[t.dataKey])) {
			var s = Xt(n, "value", i[t.dataKey]);
			if (s) return s.coordinate + r / 2;
		}
		return n != null && n[a] ? n[a].coordinate + r / 2 : null;
	}
	var c = Ss(i, Zt(o) ? t.dataKey : o), l = t.scale.map(c);
	return F(l) ? l : null;
}
var Ms = (e) => {
	var { axis: t, ticks: n, offset: r, bandSize: i, entry: a, index: o } = e;
	if (t.type === "category") return n[o] ? n[o].coordinate + r : null;
	var s = Ss(a, t.dataKey, t.scale.domain()[o]);
	if (Zt(s)) return null;
	var c = t.scale.map(s);
	return F(c) ? c - i / 2 + r : null;
}, Ns = (e) => {
	var { numericAxis: t } = e, n = t.scale.domain();
	if (t.type === "number") {
		var r = Math.min(n[0], n[1]), i = Math.max(n[0], n[1]);
		return r <= 0 && i >= 0 ? 0 : i < 0 ? i : r;
	}
	return n[0];
}, Ps = (e) => {
	var t = e.flat(2).filter(F);
	return [Math.min(...t), Math.max(...t)];
}, Fs = (e) => [e[0] === Infinity ? 0 : e[0], e[1] === -Infinity ? 0 : e[1]], Is = (e, t, n) => {
	if (e != null) return Fs(Object.keys(e).reduce((r, i) => {
		var a = e[i];
		if (!a) return r;
		var { stackedData: o } = a, s = o.reduce((e, r) => {
			var i = Ps(hs(r, t, n));
			return !H(i[0]) || !H(i[1]) ? e : [Math.min(e[0], i[0]), Math.max(e[1], i[1])];
		}, [Infinity, -Infinity]);
		return [Math.min(s[0], r[0]), Math.max(s[1], r[1])];
	}, [Infinity, -Infinity]));
}, Ls = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, Rs = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, zs = (e, t, n) => {
	if (e && e.scale && e.scale.bandwidth) {
		var r = e.scale.bandwidth();
		if (!n || r > 0) return r;
	}
	if (e && t && t.length >= 2) {
		for (var i = mi(t, (e) => e.coordinate), a = Infinity, o = 1, s = i.length; o < s; o++) {
			var c = i[o], l = i[o - 1];
			a = Math.min((c?.coordinate || 0) - (l?.coordinate || 0), a);
		}
		return a === Infinity ? 0 : a;
	}
	return n ? void 0 : 0;
};
function Bs(e) {
	var { tooltipEntrySettings: t, dataKey: n, payload: r, value: i, name: a } = e;
	return vs(vs({}, t), {}, {
		dataKey: n,
		payload: r,
		value: i,
		name: a
	});
}
function Vs(e, t) {
	if (e) return String(e);
	if (typeof t == "string") return t;
}
var Hs = (e, t) => {
	if (t === "horizontal") return e.relativeX;
	if (t === "vertical") return e.relativeY;
}, Us = (e, t) => t === "centric" ? e.angle : e.radius, Ws = (e) => e.layout.width, Gs = (e) => e.layout.height, Ks = (e) => e.layout.scale, qs = (e) => e.layout.margin, Js = L((e) => e.cartesianAxis.xAxis, (e) => Object.values(e)), Ys = L((e) => e.cartesianAxis.yAxis, (e) => Object.values(e)), Xs = "data-recharts-item-index";
//#endregion
//#region node_modules/recharts/es6/state/selectors/selectChartOffsetInternal.js
function Zs(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Qs(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Zs(Object(n), !0).forEach(function(t) {
			$s(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Zs(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function $s(e, t, n) {
	return (t = ec(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function ec(e) {
	var t = tc(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function tc(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var nc = (e) => e.brush.height;
function rc(e) {
	return Ys(e).reduce((e, t) => t.orientation === "left" && !t.mirror && !t.hide ? e + (typeof t.width == "number" ? t.width : 60) : e, 0);
}
function ic(e) {
	return Ys(e).reduce((e, t) => t.orientation === "right" && !t.mirror && !t.hide ? e + (typeof t.width == "number" ? t.width : 60) : e, 0);
}
function ac(e) {
	return Js(e).reduce((e, t) => t.orientation === "top" && !t.mirror && !t.hide ? e + t.height : e, 0);
}
function oc(e) {
	return Js(e).reduce((e, t) => t.orientation === "bottom" && !t.mirror && !t.hide ? e + t.height : e, 0);
}
var sc = L([
	Ws,
	Gs,
	qs,
	nc,
	rc,
	ic,
	ac,
	oc,
	hi,
	gi
], (e, t, n, r, i, a, o, s, c, l) => {
	var u = {
		left: (n.left || 0) + i,
		right: (n.right || 0) + a
	}, d = Qs(Qs({}, {
		top: (n.top || 0) + o,
		bottom: (n.bottom || 0) + s
	}), u), f = d.bottom;
	d.bottom += r, d = Cs(d, c, l);
	var p = e - d.left - d.right, m = t - d.top - d.bottom;
	return Qs(Qs({ brushBottom: f }, d), {}, {
		width: Math.max(p, 0),
		height: Math.max(m, 0)
	});
}), cc = L(sc, (e) => ({
	x: e.left,
	y: e.top,
	width: e.width,
	height: e.height
})), lc = L(Ws, Gs, (e, t) => ({
	x: 0,
	y: 0,
	width: e,
	height: t
})), uc = /* @__PURE__ */ (0, S.createContext)(null), dc = () => (0, S.useContext)(uc) != null, fc = (e) => e.brush, pc = L([
	fc,
	sc,
	qs
], (e, t, n) => ({
	height: e.height,
	x: F(e.x) ? e.x : t.left,
	y: F(e.y) ? e.y : t.top + t.height + t.brushBottom - (n?.bottom || 0),
	width: F(e.width) ? e.width : t.width
}));
//#endregion
//#region node_modules/es-toolkit/dist/function/debounce.mjs
function mc(e, t, { signal: n, edges: r } = {}) {
	let i, a = null, o = r != null && r.includes("leading"), s = r == null || r.includes("trailing"), c = () => {
		a !== null && (e.apply(i, a), i = void 0, a = null);
	}, l = () => {
		s && c(), p();
	}, u = null, d = () => {
		u != null && clearTimeout(u), u = setTimeout(() => {
			u = null, l();
		}, t);
	}, f = () => {
		u !== null && (clearTimeout(u), u = null);
	}, p = () => {
		f(), i = void 0, a = null;
	}, m = () => {
		c();
	}, h = function(...e) {
		if (n?.aborted) return;
		i = this, a = e;
		let t = u == null;
		d(), o && t && c();
	};
	return h.schedule = d, h.cancel = p, h.flush = m, n?.addEventListener("abort", p, { once: !0 }), h;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/function/debounce.mjs
function hc(e, t = 0, n = {}) {
	typeof n != "object" && (n = {});
	let { leading: r = !1, trailing: i = !0, maxWait: a } = n, o = [, ,];
	r && (o[0] = "leading"), i && (o[1] = "trailing");
	let s, c = null, l = mc(function(...t) {
		s = e.apply(this, t), c = null;
	}, t, { edges: o }), u = function(...t) {
		return a != null && (c === null && (c = Date.now()), Date.now() - c >= a) ? (s = e.apply(this, t), c = Date.now(), l.cancel(), l.schedule(), s) : (l.apply(this, t), s);
	};
	return u.cancel = l.cancel, u.flush = () => (l.flush(), s), u;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/function/throttle.mjs
function gc(e, t = 0, n = {}) {
	let { leading: r = !0, trailing: i = !0 } = n;
	return hc(e, t, {
		leading: r,
		maxWait: t,
		trailing: i
	});
}
//#endregion
//#region node_modules/recharts/es6/util/LogUtils.js
var _c = !0, vc = function(e, t) {
	var n = [...arguments].slice(2);
	if (_c && typeof console < "u" && console.warn && (t === void 0 && console.warn("LogUtils requires an error message argument"), !e)) if (t === void 0) console.warn("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
	else {
		var r = 0;
		console.warn(t.replace(/%s/g, () => n[r++]));
	}
}, yc = {
	width: "100%",
	height: "100%",
	debounce: 0,
	minWidth: 0,
	initialDimension: {
		width: -1,
		height: -1
	}
}, bc = (e, t, n) => {
	var { width: r = yc.width, height: i = yc.height, aspect: a, maxHeight: o } = n, s = Ut(r) ? e : Number(r), c = Ut(i) ? t : Number(i);
	return a && a > 0 && (s ? c = s / a : c && (s = c * a), o && c != null && c > o && (c = o)), {
		calculatedWidth: s,
		calculatedHeight: c
	};
}, xc = {
	width: 0,
	height: 0,
	overflow: "visible"
}, Sc = {
	width: 0,
	overflowX: "visible"
}, Cc = {
	height: 0,
	overflowY: "visible"
}, wc = {}, Tc = (e) => {
	var { width: t, height: n } = e, r = Ut(t), i = Ut(n);
	return r && i ? xc : r ? Sc : i ? Cc : wc;
};
function Ec(e) {
	var { width: t, height: n, aspect: r } = e, i = t, a = n;
	return i === void 0 && a === void 0 ? (i = yc.width, a = yc.height) : i === void 0 ? i = r && r > 0 ? void 0 : yc.width : a === void 0 && (a = r && r > 0 ? void 0 : yc.height), {
		width: i,
		height: a
	};
}
//#endregion
//#region node_modules/recharts/es6/component/ResponsiveContainer.js
function Dc() {
	return Dc = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, Dc.apply(null, arguments);
}
function Oc(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function kc(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Oc(Object(n), !0).forEach(function(t) {
			Ac(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Oc(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Ac(e, t, n) {
	return (t = jc(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function jc(e) {
	var t = Mc(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Mc(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Nc = /* @__PURE__ */ (0, S.createContext)(yc.initialDimension);
function Pc(e) {
	return gs(e.width) && gs(e.height);
}
function Fc(e) {
	var { children: t, width: n, height: r } = e, i = (0, S.useMemo)(() => ({
		width: n,
		height: r
	}), [n, r]);
	return Pc(i) ? /* @__PURE__ */ S.createElement(Nc.Provider, { value: i }, t) : null;
}
var Ic = () => (0, S.useContext)(Nc), Lc = /* @__PURE__ */ (0, S.forwardRef)((e, t) => {
	var { aspect: n, initialDimension: r = yc.initialDimension, width: i, height: a, minWidth: o = yc.minWidth, minHeight: s, maxHeight: c, children: l, debounce: u = yc.debounce, id: d, className: f, onResize: p, style: m = {} } = e, h = (0, S.useRef)(null), g = (0, S.useRef)();
	g.current = p, (0, S.useImperativeHandle)(t, () => h.current);
	var [_, v] = (0, S.useState)({
		containerWidth: r.width,
		containerHeight: r.height
	}), b = (0, S.useCallback)((e, t) => {
		v((n) => {
			var r = Math.round(e), i = Math.round(t);
			return n.containerWidth === r && n.containerHeight === i ? n : {
				containerWidth: r,
				containerHeight: i
			};
		});
	}, []);
	(0, S.useEffect)(() => {
		if (h.current == null || typeof ResizeObserver > "u") return en;
		var e = (e) => {
			var t, n = e[0];
			if (n != null) {
				var { width: r, height: i } = n.contentRect;
				b(r, i), (t = g.current) == null || t.call(g, r, i);
			}
		};
		u > 0 && (e = gc(e, u, {
			trailing: !0,
			leading: !1
		}));
		var t = new ResizeObserver(e), { width: n, height: r } = h.current.getBoundingClientRect();
		return b(n, r), t.observe(h.current), () => {
			t.disconnect();
		};
	}, [b, u]);
	var { containerWidth: x, containerHeight: C } = _;
	vc(!n || n > 0, "The aspect(%s) must be greater than zero.", n);
	var { calculatedWidth: w, calculatedHeight: T } = bc(x, C, {
		width: i,
		height: a,
		aspect: n,
		maxHeight: c
	});
	return vc(w != null && w > 0 || T != null && T > 0, "The width(%s) and height(%s) of chart should be greater than 0,\n       please check the style of container, or the props width(%s) and height(%s),\n       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the\n       height and width.", w, T, i, a, o, s, n), /* @__PURE__ */ S.createElement("div", {
		id: d ? `${d}` : void 0,
		className: y("recharts-responsive-container", f),
		style: kc(kc({}, m), {}, {
			width: i,
			height: a,
			minWidth: o,
			minHeight: s,
			maxHeight: c
		}),
		ref: h
	}, /* @__PURE__ */ S.createElement("div", { style: Tc({
		width: i,
		height: a
	}) }, /* @__PURE__ */ S.createElement(Fc, {
		width: w,
		height: T
	}, l)));
}), Rc = /* @__PURE__ */ (0, S.forwardRef)((e, t) => {
	var n = Ic();
	if (gs(n.width) && gs(n.height)) return e.children;
	var { width: r, height: i } = Ec({
		width: e.width,
		height: e.height,
		aspect: e.aspect
	}), { calculatedWidth: a, calculatedHeight: o } = bc(void 0, void 0, {
		width: r,
		height: i,
		aspect: e.aspect,
		maxHeight: e.maxHeight
	});
	return F(a) && F(o) ? /* @__PURE__ */ S.createElement(Fc, {
		width: a,
		height: o
	}, e.children) : /* @__PURE__ */ S.createElement(Lc, Dc({}, e, {
		width: r,
		height: i,
		ref: t
	}));
});
//#endregion
//#region node_modules/recharts/es6/context/chartLayoutContext.js
function zc(e) {
	if (e) return {
		x: e.x,
		y: e.y,
		upperWidth: "upperWidth" in e ? e.upperWidth : e.width,
		lowerWidth: "lowerWidth" in e ? e.lowerWidth : e.width,
		width: e.width,
		height: e.height
	};
}
var Bc = () => {
	var e = dc(), t = I(cc), n = I(pc), r = I(fc)?.padding;
	return !e || !n || !r ? t : {
		width: n.width - r.left - r.right,
		height: n.height - r.top - r.bottom,
		x: r.left,
		y: r.top
	};
}, Vc = {
	top: 0,
	bottom: 0,
	left: 0,
	right: 0,
	width: 0,
	height: 0,
	brushBottom: 0
}, Hc = () => I(sc) ?? Vc, Uc = () => I(Ws), Wc = () => I(Gs), U = (e) => e.layout.layoutType, Gc = () => I(U), Kc = () => {
	var e = Gc();
	if (e === "horizontal" || e === "vertical") return e;
}, qc = (e) => {
	var t = e.layout.layoutType;
	if (t === "centric" || t === "radial") return t;
}, Jc = () => Gc() !== void 0, Yc = (e) => {
	var t = Vr(), n = dc(), { width: r, height: i } = e, a = Ic(), o = r, s = i;
	return a && (o = a.width > 0 ? a.width : r, s = a.height > 0 ? a.height : i), (0, S.useEffect)(() => {
		!n && gs(o) && gs(s) && t(fs({
			width: o,
			height: s
		}));
	}, [
		t,
		n,
		o,
		s
	]), null;
}, Xc = Symbol.for("immer-nothing"), Zc = Symbol.for("immer-draftable"), Qc = Symbol.for("immer-state");
function $c(e, ...t) {
	throw Error(`[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`);
}
var el = Object.getPrototypeOf;
function tl(e) {
	return !!e && !!e[Qc];
}
function nl(e) {
	return e ? al(e) || Array.isArray(e) || !!e[Zc] || !!e.constructor?.[Zc] || dl(e) || fl(e) : !1;
}
var rl = Object.prototype.constructor.toString(), il = /* @__PURE__ */ new WeakMap();
function al(e) {
	if (!e || typeof e != "object") return !1;
	let t = Object.getPrototypeOf(e);
	if (t === null || t === Object.prototype) return !0;
	let n = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
	if (n === Object) return !0;
	if (typeof n != "function") return !1;
	let r = il.get(n);
	return r === void 0 && (r = Function.toString.call(n), il.set(n, r)), r === rl;
}
function ol(e, t, n = !0) {
	sl(e) === 0 ? (n ? Reflect.ownKeys(e) : Object.keys(e)).forEach((n) => {
		t(n, e[n], e);
	}) : e.forEach((n, r) => t(r, n, e));
}
function sl(e) {
	let t = e[Qc];
	return t ? t.type_ : Array.isArray(e) ? 1 : dl(e) ? 2 : fl(e) ? 3 : 0;
}
function cl(e, t) {
	return sl(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t);
}
function ll(e, t, n) {
	let r = sl(e);
	r === 2 ? e.set(t, n) : r === 3 ? e.add(n) : e[t] = n;
}
function ul(e, t) {
	return e === t ? e !== 0 || 1 / e == 1 / t : e !== e && t !== t;
}
function dl(e) {
	return e instanceof Map;
}
function fl(e) {
	return e instanceof Set;
}
function pl(e) {
	return e.copy_ || e.base_;
}
function ml(e, t) {
	if (dl(e)) return new Map(e);
	if (fl(e)) return new Set(e);
	if (Array.isArray(e)) return Array.prototype.slice.call(e);
	let n = al(e);
	if (t === !0 || t === "class_only" && !n) {
		let t = Object.getOwnPropertyDescriptors(e);
		delete t[Qc];
		let n = Reflect.ownKeys(t);
		for (let r = 0; r < n.length; r++) {
			let i = n[r], a = t[i];
			a.writable === !1 && (a.writable = !0, a.configurable = !0), (a.get || a.set) && (t[i] = {
				configurable: !0,
				writable: !0,
				enumerable: a.enumerable,
				value: e[i]
			});
		}
		return Object.create(el(e), t);
	} else {
		let t = el(e);
		return t !== null && n ? { ...e } : Object.assign(Object.create(t), e);
	}
}
function hl(e, t = !1) {
	return vl(e) || tl(e) || !nl(e) ? e : (sl(e) > 1 && Object.defineProperties(e, {
		set: _l,
		add: _l,
		clear: _l,
		delete: _l
	}), Object.freeze(e), t && Object.values(e).forEach((e) => hl(e, !0)), e);
}
function gl() {
	$c(2);
}
var _l = { value: gl };
function vl(e) {
	return typeof e != "object" || !e ? !0 : Object.isFrozen(e);
}
var yl = {};
function bl(e) {
	let t = yl[e];
	return t || $c(0, e), t;
}
var xl;
function Sl() {
	return xl;
}
function Cl(e, t) {
	return {
		drafts_: [],
		parent_: e,
		immer_: t,
		canAutoFreeze_: !0,
		unfinalizedDrafts_: 0
	};
}
function wl(e, t) {
	t && (bl("Patches"), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function Tl(e) {
	El(e), e.drafts_.forEach(Ol), e.drafts_ = null;
}
function El(e) {
	e === xl && (xl = e.parent_);
}
function Dl(e) {
	return xl = Cl(xl, e);
}
function Ol(e) {
	let t = e[Qc];
	t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function kl(e, t) {
	t.unfinalizedDrafts_ = t.drafts_.length;
	let n = t.drafts_[0];
	return e !== void 0 && e !== n ? (n[Qc].modified_ && (Tl(t), $c(4)), nl(e) && (e = Al(t, e), t.parent_ || Ml(t, e)), t.patches_ && bl("Patches").generateReplacementPatches_(n[Qc].base_, e, t.patches_, t.inversePatches_)) : e = Al(t, n, []), Tl(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e === Xc ? void 0 : e;
}
function Al(e, t, n) {
	if (vl(t)) return t;
	let r = e.immer_.shouldUseStrictIteration(), i = t[Qc];
	if (!i) return ol(t, (r, a) => jl(e, i, t, r, a, n), r), t;
	if (i.scope_ !== e) return t;
	if (!i.modified_) return Ml(e, i.base_, !0), i.base_;
	if (!i.finalized_) {
		i.finalized_ = !0, i.scope_.unfinalizedDrafts_--;
		let t = i.copy_, a = t, o = !1;
		i.type_ === 3 && (a = new Set(t), t.clear(), o = !0), ol(a, (r, a) => jl(e, i, t, r, a, n, o), r), Ml(e, t, !1), n && e.patches_ && bl("Patches").generatePatches_(i, n, e.patches_, e.inversePatches_);
	}
	return i.copy_;
}
function jl(e, t, n, r, i, a, o) {
	if (i == null || typeof i != "object" && !o) return;
	let s = vl(i);
	if (!(s && !o)) {
		if (tl(i)) {
			let o = Al(e, i, a && t && t.type_ !== 3 && !cl(t.assigned_, r) ? a.concat(r) : void 0);
			if (ll(n, r, o), tl(o)) e.canAutoFreeze_ = !1;
			else return;
		} else o && n.add(i);
		if (nl(i) && !s) {
			if (!e.immer_.autoFreeze_ && e.unfinalizedDrafts_ < 1 || t && t.base_ && t.base_[r] === i && s) return;
			Al(e, i), (!t || !t.scope_.parent_) && typeof r != "symbol" && (dl(n) ? n.has(r) : Object.prototype.propertyIsEnumerable.call(n, r)) && Ml(e, i);
		}
	}
}
function Ml(e, t, n = !1) {
	!e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && hl(t, n);
}
function Nl(e, t) {
	let n = Array.isArray(e), r = {
		type_: +!!n,
		scope_: t ? t.scope_ : Sl(),
		modified_: !1,
		finalized_: !1,
		assigned_: {},
		parent_: t,
		base_: e,
		draft_: null,
		copy_: null,
		revoke_: null,
		isManual_: !1
	}, i = r, a = Pl;
	n && (i = [r], a = Fl);
	let { revoke: o, proxy: s } = Proxy.revocable(i, a);
	return r.draft_ = s, r.revoke_ = o, s;
}
var Pl = {
	get(e, t) {
		if (t === Qc) return e;
		let n = pl(e);
		if (!cl(n, t)) return Ll(e, n, t);
		let r = n[t];
		return e.finalized_ || !nl(r) ? r : r === Il(e.base_, t) ? (Bl(e), e.copy_[t] = G(r, e)) : r;
	},
	has(e, t) {
		return t in pl(e);
	},
	ownKeys(e) {
		return Reflect.ownKeys(pl(e));
	},
	set(e, t, n) {
		let r = Rl(pl(e), t);
		if (r?.set) return r.set.call(e.draft_, n), !0;
		if (!e.modified_) {
			let r = Il(pl(e), t), i = r?.[Qc];
			if (i && i.base_ === n) return e.copy_[t] = n, e.assigned_[t] = !1, !0;
			if (ul(n, r) && (n !== void 0 || cl(e.base_, t))) return !0;
			Bl(e), zl(e);
		}
		return e.copy_[t] === n && (n !== void 0 || t in e.copy_) || Number.isNaN(n) && Number.isNaN(e.copy_[t]) ? !0 : (e.copy_[t] = n, e.assigned_[t] = !0, !0);
	},
	deleteProperty(e, t) {
		return Il(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_[t] = !1, Bl(e), zl(e)) : delete e.assigned_[t], e.copy_ && delete e.copy_[t], !0;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = pl(e), r = Reflect.getOwnPropertyDescriptor(n, t);
		return r && {
			writable: !0,
			configurable: e.type_ !== 1 || t !== "length",
			enumerable: r.enumerable,
			value: n[t]
		};
	},
	defineProperty() {
		$c(11);
	},
	getPrototypeOf(e) {
		return el(e.base_);
	},
	setPrototypeOf() {
		$c(12);
	}
}, Fl = {};
ol(Pl, (e, t) => {
	Fl[e] = function() {
		return arguments[0] = arguments[0][0], t.apply(this, arguments);
	};
}), Fl.deleteProperty = function(e, t) {
	return Fl.set.call(this, e, t, void 0);
}, Fl.set = function(e, t, n) {
	return Pl.set.call(this, e[0], t, n, e[0]);
};
function Il(e, t) {
	let n = e[Qc];
	return (n ? pl(n) : e)[t];
}
function Ll(e, t, n) {
	let r = Rl(t, n);
	return r ? "value" in r ? r.value : r.get?.call(e.draft_) : void 0;
}
function Rl(e, t) {
	if (!(t in e)) return;
	let n = el(e);
	for (; n;) {
		let e = Object.getOwnPropertyDescriptor(n, t);
		if (e) return e;
		n = el(n);
	}
}
function zl(e) {
	e.modified_ || (e.modified_ = !0, e.parent_ && zl(e.parent_));
}
function Bl(e) {
	e.copy_ ||= ml(e.base_, e.scope_.immer_.useStrictShallowCopy_);
}
var W = class {
	constructor(e) {
		this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.useStrictIteration_ = !0, this.produce = (e, t, n) => {
			if (typeof e == "function" && typeof t != "function") {
				let n = t;
				t = e;
				let r = this;
				return function(e = n, ...i) {
					return r.produce(e, (e) => t.call(this, e, ...i));
				};
			}
			typeof t != "function" && $c(6), n !== void 0 && typeof n != "function" && $c(7);
			let r;
			if (nl(e)) {
				let i = Dl(this), a = G(e, void 0), o = !0;
				try {
					r = t(a), o = !1;
				} finally {
					o ? Tl(i) : El(i);
				}
				return wl(i, n), kl(r, i);
			} else if (!e || typeof e != "object") {
				if (r = t(e), r === void 0 && (r = e), r === Xc && (r = void 0), this.autoFreeze_ && hl(r, !0), n) {
					let t = [], i = [];
					bl("Patches").generateReplacementPatches_(e, r, t, i), n(t, i);
				}
				return r;
			} else $c(1, e);
		}, this.produceWithPatches = (e, t) => {
			if (typeof e == "function") return (t, ...n) => this.produceWithPatches(t, (t) => e(t, ...n));
			let n, r;
			return [
				this.produce(e, t, (e, t) => {
					n = e, r = t;
				}),
				n,
				r
			];
		}, typeof e?.autoFreeze == "boolean" && this.setAutoFreeze(e.autoFreeze), typeof e?.useStrictShallowCopy == "boolean" && this.setUseStrictShallowCopy(e.useStrictShallowCopy), typeof e?.useStrictIteration == "boolean" && this.setUseStrictIteration(e.useStrictIteration);
	}
	createDraft(e) {
		nl(e) || $c(8), tl(e) && (e = K(e));
		let t = Dl(this), n = G(e, void 0);
		return n[Qc].isManual_ = !0, El(t), n;
	}
	finishDraft(e, t) {
		let n = e && e[Qc];
		(!n || !n.isManual_) && $c(9);
		let { scope_: r } = n;
		return wl(r, t), kl(void 0, r);
	}
	setAutoFreeze(e) {
		this.autoFreeze_ = e;
	}
	setUseStrictShallowCopy(e) {
		this.useStrictShallowCopy_ = e;
	}
	setUseStrictIteration(e) {
		this.useStrictIteration_ = e;
	}
	shouldUseStrictIteration() {
		return this.useStrictIteration_;
	}
	applyPatches(e, t) {
		let n;
		for (n = t.length - 1; n >= 0; n--) {
			let r = t[n];
			if (r.path.length === 0 && r.op === "replace") {
				e = r.value;
				break;
			}
		}
		n > -1 && (t = t.slice(n + 1));
		let r = bl("Patches").applyPatches_;
		return tl(e) ? r(e, t) : this.produce(e, (e) => r(e, t));
	}
};
function G(e, t) {
	let n = dl(e) ? bl("MapSet").proxyMap_(e, t) : fl(e) ? bl("MapSet").proxySet_(e, t) : Nl(e, t);
	return (t ? t.scope_ : Sl()).drafts_.push(n), n;
}
function K(e) {
	return tl(e) || $c(10, e), q(e);
}
function q(e) {
	if (!nl(e) || vl(e)) return e;
	let t = e[Qc], n, r = !0;
	if (t) {
		if (!t.modified_) return t.base_;
		t.finalized_ = !0, n = ml(e, t.scope_.immer_.useStrictShallowCopy_), r = t.scope_.immer_.shouldUseStrictIteration();
	} else n = ml(e, !0);
	return ol(n, (e, t) => {
		ll(n, e, q(t));
	}, r), t && (t.finalized_ = !1), n;
}
new W().produce;
function J(e) {
	return e;
}
//#endregion
//#region node_modules/recharts/es6/state/legendSlice.js
var Vl = xo({
	name: "legend",
	initialState: {
		settings: {
			layout: "horizontal",
			align: "center",
			verticalAlign: "middle",
			itemSorter: "value"
		},
		size: {
			width: 0,
			height: 0
		},
		payload: []
	},
	reducers: {
		setLegendSize(e, t) {
			e.size.width = t.payload.width, e.size.height = t.payload.height;
		},
		setLegendSettings(e, t) {
			e.settings.align = t.payload.align, e.settings.layout = t.payload.layout, e.settings.verticalAlign = t.payload.verticalAlign, e.settings.itemSorter = t.payload.itemSorter;
		},
		addLegendPayload: {
			reducer(e, t) {
				e.payload.push(J(t.payload));
			},
			prepare: oo()
		},
		replaceLegendPayload: {
			reducer(e, t) {
				var { prev: n, next: r } = t.payload, i = Ka(e).payload.indexOf(J(n));
				i > -1 && (e.payload[i] = J(r));
			},
			prepare: oo()
		},
		removeLegendPayload: {
			reducer(e, t) {
				var n = Ka(e).payload.indexOf(J(t.payload));
				n > -1 && e.payload.splice(n, 1);
			},
			prepare: oo()
		}
	}
}), { setLegendSize: Hl, setLegendSettings: Ul, addLegendPayload: Wl, replaceLegendPayload: Gl, removeLegendPayload: Kl } = Vl.actions, ql = Vl.reducer, Jl = /* @__PURE__ */ o(((e) => {
	var t = d();
	t.useSyncExternalStore, t.useRef, t.useEffect, t.useMemo, t.useDebugValue;
}));
(/* @__PURE__ */ o(((e, t) => {
	t.exports = Jl();
})))();
function Yl(e) {
	e();
}
function Xl() {
	let e = null, t = null;
	return {
		clear() {
			e = null, t = null;
		},
		notify() {
			Yl(() => {
				let t = e;
				for (; t;) t.callback(), t = t.next;
			});
		},
		get() {
			let t = [], n = e;
			for (; n;) t.push(n), n = n.next;
			return t;
		},
		subscribe(n) {
			let r = !0, i = t = {
				callback: n,
				next: null,
				prev: t
			};
			return i.prev ? i.prev.next = i : e = i, function() {
				!r || e === null || (r = !1, i.next ? i.next.prev = i.prev : t = i.prev, i.prev ? i.prev.next = i.next : e = i.next);
			};
		}
	};
}
var Zl = {
	notify() {},
	get: () => []
};
function Ql(e, t) {
	let n, r = Zl, i = 0, a = !1;
	function o(e) {
		u();
		let t = r.subscribe(e), n = !1;
		return () => {
			n || (n = !0, t(), d());
		};
	}
	function s() {
		r.notify();
	}
	function c() {
		m.onStateChange && m.onStateChange();
	}
	function l() {
		return a;
	}
	function u() {
		i++, n || (n = t ? t.addNestedSub(c) : e.subscribe(c), r = Xl());
	}
	function d() {
		i--, n && i === 0 && (n(), n = void 0, r.clear(), r = Zl);
	}
	function f() {
		a || (a = !0, u());
	}
	function p() {
		a && (a = !1, d());
	}
	let m = {
		addNestedSub: o,
		notifyNestedSubs: s,
		handleChangeWrapper: c,
		isSubscribed: l,
		trySubscribe: f,
		tryUnsubscribe: p,
		getListeners: () => r
	};
	return m;
}
var $l = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, eu = typeof navigator < "u" && navigator.product === "ReactNative", tu = $l || eu ? S.useLayoutEffect : S.useEffect;
function nu(e, t) {
	return e === t ? e !== 0 || t !== 0 || 1 / e == 1 / t : e !== e && t !== t;
}
function ru(e, t) {
	if (nu(e, t)) return !0;
	if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
	let n = Object.keys(e), r = Object.keys(t);
	if (n.length !== r.length) return !1;
	for (let r = 0; r < n.length; r++) if (!Object.prototype.hasOwnProperty.call(t, n[r]) || !nu(e[n[r]], t[n[r]])) return !1;
	return !0;
}
var iu = /* @__PURE__ */ Symbol.for("react-redux-context"), au = typeof globalThis < "u" ? globalThis : {};
function ou() {
	if (!S.createContext) return {};
	let e = au[iu] ??= /* @__PURE__ */ new Map(), t = e.get(S.createContext);
	return t || (t = S.createContext(null), e.set(S.createContext, t)), t;
}
var su = /* @__PURE__ */ ou();
function cu(e) {
	let { children: t, context: n, serverState: r, store: i } = e, a = S.useMemo(() => ({
		store: i,
		subscription: Ql(i),
		getServerState: r ? () => r : void 0
	}), [i, r]), o = S.useMemo(() => i.getState(), [i]);
	tu(() => {
		let { subscription: e } = a;
		return e.onStateChange = e.notifyNestedSubs, e.trySubscribe(), o !== i.getState() && e.notifyNestedSubs(), () => {
			e.tryUnsubscribe(), e.onStateChange = void 0;
		};
	}, [a, o]);
	let s = n || su;
	return /* @__PURE__ */ S.createElement(s.Provider, { value: a }, t);
}
var lu = cu, uu = new Set([
	"axisLine",
	"tickLine",
	"activeBar",
	"activeDot",
	"activeLabel",
	"activeShape",
	"allowEscapeViewBox",
	"background",
	"cursor",
	"dot",
	"label",
	"line",
	"margin",
	"padding",
	"position",
	"shape",
	"style",
	"tick",
	"wrapperStyle",
	"radius",
	"throttledEvents"
]);
function du(e, t) {
	return e == null && t == null ? !0 : typeof e == "number" && typeof t == "number" ? e === t || e !== e && t !== t : e === t;
}
function fu(e, t) {
	for (var n of new Set([...Object.keys(e), ...Object.keys(t)])) if (uu.has(n)) {
		if (e[n] == null && t[n] == null) continue;
		if (!ru(e[n], t[n])) return !1;
	} else if (!du(e[n], t[n])) return !1;
	return !0;
}
//#endregion
//#region node_modules/recharts/es6/component/DefaultTooltipContent.js
function pu() {
	return pu = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, pu.apply(null, arguments);
}
function mu(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function hu(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? mu(Object(n), !0).forEach(function(t) {
			gu(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : mu(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function gu(e, t, n) {
	return (t = _u(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function _u(e) {
	var t = vu(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function vu(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function yu(e) {
	return Array.isArray(e) && Wt(e[0]) && Wt(e[1]) ? e.join(" ~ ") : e;
}
var bu = {
	separator: " : ",
	contentStyle: {
		margin: 0,
		padding: 10,
		backgroundColor: "#fff",
		border: "1px solid #ccc",
		whiteSpace: "nowrap"
	},
	itemStyle: {
		display: "block",
		paddingTop: 4,
		paddingBottom: 4,
		color: "#000"
	},
	labelStyle: {},
	accessibilityLayer: !1
};
function xu(e, t) {
	return t == null ? e : mi(e, t);
}
var Su = (e) => {
	var { separator: t = bu.separator, contentStyle: n, itemStyle: r, labelStyle: i = bu.labelStyle, payload: a, formatter: o, itemSorter: s, wrapperClassName: c, labelClassName: l, label: u, labelFormatter: d, accessibilityLayer: f = bu.accessibilityLayer } = e, p = () => {
		if (a && a.length) {
			var e = {
				padding: 0,
				margin: 0
			}, n = xu(a, s).map((e, n) => {
				if (e.type === "none") return null;
				var i = e.formatter || o || yu, { value: s, name: c } = e, l = s, u = c;
				if (i) {
					var d = i(s, c, e, n, a);
					if (Array.isArray(d)) [l, u] = d;
					else if (d != null) l = d;
					else return null;
				}
				var f = hu(hu({}, bu.itemStyle), {}, { color: e.color || bu.itemStyle.color }, r);
				return /* @__PURE__ */ S.createElement("li", {
					className: "recharts-tooltip-item",
					key: `tooltip-item-${n}`,
					style: f
				}, Wt(u) ? /* @__PURE__ */ S.createElement("span", { className: "recharts-tooltip-item-name" }, u) : null, Wt(u) ? /* @__PURE__ */ S.createElement("span", { className: "recharts-tooltip-item-separator" }, t) : null, /* @__PURE__ */ S.createElement("span", { className: "recharts-tooltip-item-value" }, l), /* @__PURE__ */ S.createElement("span", { className: "recharts-tooltip-item-unit" }, e.unit || ""));
			});
			return /* @__PURE__ */ S.createElement("ul", {
				className: "recharts-tooltip-item-list",
				style: e
			}, n);
		}
		return null;
	}, m = hu(hu({}, bu.contentStyle), n), h = hu({ margin: 0 }, i), g = !Zt(u), _ = g ? u : "", v = y("recharts-default-tooltip", c), b = y("recharts-tooltip-label", l);
	g && d && a != null && (_ = d(u, a));
	var x = f ? {
		role: "status",
		"aria-live": "assertive"
	} : {};
	return /* @__PURE__ */ S.createElement("div", pu({
		className: v,
		style: m
	}, x), /* @__PURE__ */ S.createElement("p", {
		className: b,
		style: h
	}, /* @__PURE__ */ S.isValidElement(_) ? _ : `${_}`), p());
}, Cu = "recharts-tooltip-wrapper", wu = { visibility: "hidden" };
function Tu(e) {
	var { coordinate: t, translateX: n, translateY: r } = e;
	return y(Cu, {
		[`${Cu}-right`]: F(n) && t && F(t.x) && n >= t.x,
		[`${Cu}-left`]: F(n) && t && F(t.x) && n < t.x,
		[`${Cu}-bottom`]: F(r) && t && F(t.y) && r >= t.y,
		[`${Cu}-top`]: F(r) && t && F(t.y) && r < t.y
	});
}
function Eu(e) {
	var { allowEscapeViewBox: t, coordinate: n, key: r, offset: i, position: a, reverseDirection: o, tooltipDimension: s, viewBox: c, viewBoxDimension: l } = e;
	if (a && F(a[r])) return a[r];
	var u = n[r] - s - (i > 0 ? i : 0), d = n[r] + i;
	if (t[r]) return o[r] ? u : d;
	var f = c[r];
	return f == null ? 0 : o[r] ? Math.max(u < f ? d : u, f) : l == null ? 0 : d + s > f + l ? Math.max(u, f) : Math.max(d, f);
}
function Du(e) {
	var { translateX: t, translateY: n, useTranslate3d: r } = e;
	return { transform: r ? `translate3d(${t}px, ${n}px, 0)` : `translate(${t}px, ${n}px)` };
}
function Ou(e) {
	var { allowEscapeViewBox: t, coordinate: n, offsetTop: r, offsetLeft: i, position: a, reverseDirection: o, tooltipBox: s, useTranslate3d: c, viewBox: l } = e, u, d, f;
	return s.height > 0 && s.width > 0 && n ? (d = Eu({
		allowEscapeViewBox: t,
		coordinate: n,
		key: "x",
		offset: i,
		position: a,
		reverseDirection: o,
		tooltipDimension: s.width,
		viewBox: l,
		viewBoxDimension: l.width
	}), f = Eu({
		allowEscapeViewBox: t,
		coordinate: n,
		key: "y",
		offset: r,
		position: a,
		reverseDirection: o,
		tooltipDimension: s.height,
		viewBox: l,
		viewBoxDimension: l.height
	}), u = Du({
		translateX: d,
		translateY: f,
		useTranslate3d: c
	})) : u = wu, {
		cssProperties: u,
		cssClasses: Tu({
			translateX: d,
			translateY: f,
			coordinate: n
		})
	};
}
var ku = {
	devToolsEnabled: !0,
	isSsr: !(typeof window < "u" && window.document && window.document.createElement && window.setTimeout)
};
//#endregion
//#region node_modules/recharts/es6/util/usePrefersReducedMotion.js
function Au() {
	var [e, t] = (0, S.useState)(() => ku.isSsr || !window.matchMedia ? !1 : window.matchMedia("(prefers-reduced-motion: reduce)").matches);
	return (0, S.useEffect)(() => {
		if (window.matchMedia) {
			var e = window.matchMedia("(prefers-reduced-motion: reduce)"), n = () => {
				t(e.matches);
			};
			return e.addEventListener("change", n), () => {
				e.removeEventListener("change", n);
			};
		}
	}, []), e;
}
//#endregion
//#region node_modules/recharts/es6/component/TooltipBoundingBox.js
function ju(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Mu(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? ju(Object(n), !0).forEach(function(t) {
			Nu(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ju(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Nu(e, t, n) {
	return (t = Pu(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Pu(e) {
	var t = Fu(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Fu(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Iu(e) {
	if (!(e.prefersReducedMotion && e.isAnimationActive === "auto") && e.isAnimationActive && e.active) return `transform ${e.animationDuration}ms ${e.animationEasing}`;
}
function Lu(e) {
	var t = Au(), [n, r] = S.useState(() => ({
		dismissed: !1,
		dismissedAtCoordinate: {
			x: 0,
			y: 0
		}
	}));
	S.useEffect(() => {
		var t = (t) => {
			t.key === "Escape" && r({
				dismissed: !0,
				dismissedAtCoordinate: {
					x: e.coordinate?.x ?? 0,
					y: e.coordinate?.y ?? 0
				}
			});
		};
		return document.addEventListener("keydown", t), () => {
			document.removeEventListener("keydown", t);
		};
	}, [e.coordinate?.x, e.coordinate?.y]), n.dismissed && ((e.coordinate?.x ?? 0) !== n.dismissedAtCoordinate.x || (e.coordinate?.y ?? 0) !== n.dismissedAtCoordinate.y) && r(Mu(Mu({}, n), {}, { dismissed: !1 }));
	var { cssClasses: i, cssProperties: a } = Ou({
		allowEscapeViewBox: e.allowEscapeViewBox,
		coordinate: e.coordinate,
		offsetLeft: typeof e.offset == "number" ? e.offset : e.offset.x,
		offsetTop: typeof e.offset == "number" ? e.offset : e.offset.y,
		position: e.position,
		reverseDirection: e.reverseDirection,
		tooltipBox: {
			height: e.lastBoundingBox.height,
			width: e.lastBoundingBox.width
		},
		useTranslate3d: e.useTranslate3d,
		viewBox: e.viewBox
	}), o = Mu(Mu({}, e.hasPortalFromProps ? {} : Mu(Mu({ transition: Iu({
		prefersReducedMotion: t,
		isAnimationActive: e.isAnimationActive,
		active: e.active,
		animationDuration: e.animationDuration,
		animationEasing: e.animationEasing
	}) }, a), {}, {
		pointerEvents: "none",
		position: "absolute",
		top: 0,
		left: 0
	})), {}, { visibility: !n.dismissed && e.active && e.hasPayload ? "visible" : "hidden" }, e.wrapperStyle);
	return /* @__PURE__ */ S.createElement("div", {
		xmlns: "http://www.w3.org/1999/xhtml",
		tabIndex: -1,
		className: i,
		style: o,
		ref: e.innerRef
	}, e.children);
}
var Ru = /* @__PURE__ */ S.memo(Lu), zu = () => I((e) => e.rootProps.accessibilityLayer) ?? !0;
//#endregion
//#region node_modules/recharts/es6/shape/Curve.js
function Bu() {
	return Bu = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, Bu.apply(null, arguments);
}
function Vu(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Hu(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Vu(Object(n), !0).forEach(function(t) {
			Uu(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Vu(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Uu(e, t, n) {
	return (t = Wu(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Wu(e) {
	var t = Gu(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Gu(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Ku = {
	curveBasisClosed: tt,
	curveBasisOpen: rt,
	curveBasis: $e,
	curveBumpX: ke,
	curveBumpY: Ae,
	curveLinearClosed: at,
	curveLinear: Ce,
	curveMonotoneX: pt,
	curveMonotoneY: mt,
	curveNatural: _t,
	curveStep: yt,
	curveStepAfter: xt,
	curveStepBefore: bt
}, Y = (e) => H(e.x) && H(e.y), qu = (e) => e.base != null && Y(e.base) && Y(e), Ju = (e) => e.x, Yu = (e) => e.y, Xu = (e, t) => {
	if (typeof e == "function") return e;
	var n = `curve${Qt(e)}`;
	if ((n === "curveMonotone" || n === "curveBump") && t) {
		var r = Ku[`${n}${t === "vertical" ? "Y" : "X"}`];
		if (r) return r;
	}
	return Ku[n] || Ce;
}, Zu = {
	connectNulls: !1,
	type: "linear"
}, Qu = (e) => {
	var { type: t = Zu.type, points: n = [], baseLine: r, layout: i, connectNulls: a = Zu.connectNulls } = e, o = Xu(t, i), s = a ? n.filter(Y) : n;
	if (Array.isArray(r)) {
		var c, l = n.map((e, t) => Hu(Hu({}, e), {}, { base: r[t] }));
		return c = i === "vertical" ? De().y(Yu).x1(Ju).x0((e) => e.base.x) : De().x(Ju).y1(Yu).y0((e) => e.base.y), c.defined(qu).curve(o)(a ? l.filter(qu) : l);
	}
	return (i === "vertical" && F(r) ? De().y(Yu).x1(Ju).x0(r) : F(r) ? De().x(Ju).y1(Yu).y0(r) : Ee().x(Ju).y(Yu)).defined(Y).curve(o)(s);
}, $u = (e) => {
	var { className: t, points: n, path: r, pathRef: i } = e, a = Gc();
	if ((!n || !n.length) && !r) return null;
	var o = {
		type: e.type,
		points: e.points,
		baseLine: e.baseLine,
		layout: e.layout || a,
		connectNulls: e.connectNulls
	}, s = n && n.length ? Qu(o) : r;
	return /* @__PURE__ */ S.createElement("path", Bu({}, E(e), vn(e), {
		className: y("recharts-curve", t),
		d: s === null ? void 0 : s,
		ref: i
	}));
}, ed = [
	"x",
	"y",
	"top",
	"left",
	"width",
	"height",
	"className"
];
function td() {
	return td = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, td.apply(null, arguments);
}
function nd(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function rd(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? nd(Object(n), !0).forEach(function(t) {
			id(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : nd(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function id(e, t, n) {
	return (t = ad(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function ad(e) {
	var t = od(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function od(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function sd(e, t) {
	if (e == null) return {};
	var n, r, i = cd(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function cd(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var ld = (e, t, n, r, i, a) => `M${e},${i}v${r}M${a},${t}h${n}`, ud = (e) => {
	var { x: t = 0, y: n = 0, top: r = 0, left: i = 0, width: a = 0, height: o = 0, className: s } = e, c = sd(e, ed), l = rd({
		x: t,
		y: n,
		top: r,
		left: i,
		width: a,
		height: o
	}, c);
	return !F(t) || !F(n) || !F(a) || !F(o) || !F(r) || !F(i) ? null : /* @__PURE__ */ S.createElement("path", td({}, O(l), {
		className: y("recharts-cross", s),
		d: ld(t, n, a, o, r, i)
	}));
};
//#endregion
//#region node_modules/recharts/es6/util/cursor/getCursorRectangle.js
function dd(e, t, n, r) {
	var i = r / 2;
	return {
		stroke: "none",
		fill: "#ccc",
		x: e === "horizontal" ? t.x - i : n.left + .5,
		y: e === "horizontal" ? n.top + .5 : t.y - i,
		width: e === "horizontal" ? r : n.width - 1,
		height: e === "horizontal" ? n.height - 1 : r
	};
}
//#endregion
//#region node_modules/recharts/es6/animation/util.js
function fd(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function pd(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? fd(Object(n), !0).forEach(function(t) {
			md(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : fd(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function md(e, t, n) {
	return (t = hd(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function hd(e) {
	var t = gd(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function gd(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var _d = (e) => e.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`), vd = (e, t, n) => e.map((e) => `${_d(e)} ${t}ms ${n}`).join(","), yd = (e, t) => [Object.keys(e), Object.keys(t)].reduce((e, t) => e.filter((e) => t.includes(e))), bd = (e, t) => Object.keys(t).reduce((n, r) => pd(pd({}, n), {}, { [r]: e(r, t[r]) }), {});
//#endregion
//#region node_modules/recharts/es6/animation/configUpdate.js
function xd(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function X(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? xd(Object(n), !0).forEach(function(t) {
			Sd(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : xd(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Sd(e, t, n) {
	return (t = Cd(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Cd(e) {
	var t = wd(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function wd(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Td = (e, t, n) => e + (t - e) * n, Ed = (e) => {
	var { from: t, to: n } = e;
	return t !== n;
}, Dd = (e, t, n) => {
	var r = bd((t, n) => {
		if (Ed(n)) {
			var [r, i] = e(n.from, n.to, n.velocity);
			return X(X({}, n), {}, {
				from: r,
				velocity: i
			});
		}
		return n;
	}, t);
	return n < 1 ? bd((e, t) => Ed(t) && r[e] != null ? X(X({}, t), {}, {
		velocity: Td(t.velocity, r[e].velocity, n),
		from: Td(t.from, r[e].from, n)
	}) : t, t) : Dd(e, r, n - 1);
};
function Od(e, t, n, r, i, a) {
	var o, s = r.reduce((n, r) => X(X({}, n), {}, { [r]: {
		from: e[r],
		velocity: 0,
		to: t[r]
	} }), {}), c = () => bd((e, t) => t.from, s), l = () => !Object.values(s).filter(Ed).length, u = null, d = (r) => {
		o ||= r;
		var f = (r - o) / n.dt;
		s = Dd(n, s, f), i(X(X(X({}, e), t), c())), o = r, l() || (u = a.setTimeout(d));
	};
	return () => (u = a.setTimeout(d), () => {
		var e;
		(e = u) == null || e();
	});
}
function kd(e, t, n, r, i, a, o) {
	var s = null, c = i.reduce((n, r) => {
		var i = e[r], a = t[r];
		return i == null || a == null ? n : X(X({}, n), {}, { [r]: [i, a] });
	}, {}), l, u = (i) => {
		l ||= i;
		var d = (i - l) / r, f = bd((e, t) => Td(...t, n(d)), c);
		if (a(X(X(X({}, e), t), f)), d < 1) s = o.setTimeout(u);
		else {
			var p = bd((e, t) => Td(...t, n(1)), c);
			a(X(X(X({}, e), t), p));
		}
	};
	return () => (s = o.setTimeout(u), () => {
		var e;
		(e = s) == null || e();
	});
}
var Ad = (e, t, n, r, i, a) => {
	var o = yd(e, t);
	return n == null ? () => (i(X(X({}, e), t)), () => {}) : n.isStepper === !0 ? Od(e, t, n, o, i, a) : kd(e, t, n, r, o, i, a);
}, jd = (e, t) => [
	0,
	3 * e,
	3 * t - 6 * e,
	3 * e - 3 * t + 1
], Md = (e, t) => e.map((e, n) => e * t ** n).reduce((e, t) => e + t), Nd = (e, t) => (n) => Md(jd(e, t), n), Pd = (e, t) => (n) => Md([...jd(e, t).map((e, t) => e * t).slice(1), 0], n), Fd = (e) => {
	var t, n = e.split("(");
	if (n.length !== 2 || n[0] !== "cubic-bezier") return null;
	var r = (t = n[1]) == null || (t = t.split(")")[0]) == null ? void 0 : t.split(",");
	if (r == null || r.length !== 4) return null;
	var i = r.map((e) => parseFloat(e));
	return [
		i[0],
		i[1],
		i[2],
		i[3]
	];
}, Id = function() {
	var e = [...arguments];
	if (e.length === 1) switch (e[0]) {
		case "linear": return [
			0,
			0,
			1,
			1
		];
		case "ease": return [
			.25,
			.1,
			.25,
			1
		];
		case "ease-in": return [
			.42,
			0,
			1,
			1
		];
		case "ease-out": return [
			.42,
			0,
			.58,
			1
		];
		case "ease-in-out": return [
			0,
			0,
			.58,
			1
		];
		default:
			var t = Fd(e[0]);
			if (t) return t;
	}
	return e.length === 4 ? e : [
		0,
		0,
		1,
		1
	];
}, Ld = (e, t, n, r) => {
	var i = Nd(e, n), a = Nd(t, r), o = Pd(e, n), s = (e) => e > 1 ? 1 : e < 0 ? 0 : e, c = (e) => {
		for (var t = e > 1 ? 1 : e, n = t, r = 0; r < 8; ++r) {
			var c = i(n) - t, l = o(n);
			if (Math.abs(c - t) < 1e-4 || l < 1e-4) return a(n);
			n = s(n - c / l);
		}
		return a(n);
	};
	return c.isStepper = !1, c;
}, Rd = function() {
	return Ld(...Id(...arguments));
}, zd = function() {
	var { stiff: e = 100, damping: t = 8, dt: n = 17 } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = (r, i, a) => {
		var o = a + (-(r - i) * e - a * t) * n / 1e3, s = a * n / 1e3 + r;
		return Math.abs(s - i) < 1e-4 && Math.abs(o) < 1e-4 ? [i, 0] : [s, o];
	};
	return r.isStepper = !0, r.dt = n, r;
}, Bd = (e) => {
	if (typeof e == "string") switch (e) {
		case "ease":
		case "ease-in-out":
		case "ease-out":
		case "ease-in":
		case "linear": return Rd(e);
		case "spring": return zd();
		default: if (e.split("(")[0] === "cubic-bezier") return Rd(e);
	}
	return typeof e == "function" ? e : null;
};
//#endregion
//#region node_modules/recharts/es6/animation/AnimationManager.js
function Vd(e) {
	var t, n = () => null, r = !1, i = null, a = (o) => {
		if (!r) {
			if (Array.isArray(o)) {
				if (!o.length) return;
				var [s, ...c] = o;
				if (typeof s == "number") {
					i = e.setTimeout(a.bind(null, c), s);
					return;
				}
				a(s), i = e.setTimeout(a.bind(null, c));
				return;
			}
			typeof o == "string" && (t = o, n(t)), typeof o == "object" && (t = o, n(t)), typeof o == "function" && o();
		}
	};
	return {
		stop: () => {
			r = !0;
		},
		start: (e) => {
			r = !1, i &&= (i(), null), a(e);
		},
		subscribe: (e) => (n = e, () => {
			n = () => null;
		}),
		getTimeoutController: () => e
	};
}
//#endregion
//#region node_modules/recharts/es6/animation/timeoutController.js
var Hd = class {
	setTimeout(e) {
		var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = performance.now(), r = null, i = (a) => {
			a - n >= t ? e(a) : typeof requestAnimationFrame == "function" && (r = requestAnimationFrame(i));
		};
		return r = requestAnimationFrame(i), () => {
			r != null && cancelAnimationFrame(r);
		};
	}
};
//#endregion
//#region node_modules/recharts/es6/animation/createDefaultAnimationManager.js
function Ud() {
	return Vd(new Hd());
}
//#endregion
//#region node_modules/recharts/es6/animation/useAnimationManager.js
var Wd = /* @__PURE__ */ (0, S.createContext)(Ud);
function Gd(e, t) {
	var n = (0, S.useContext)(Wd);
	return (0, S.useMemo)(() => t ?? n(e), [
		e,
		t,
		n
	]);
}
//#endregion
//#region node_modules/recharts/es6/animation/JavascriptAnimate.js
var Kd = {
	begin: 0,
	duration: 1e3,
	easing: "ease",
	isActive: !0,
	canBegin: !0,
	onAnimationEnd: () => {},
	onAnimationStart: () => {}
}, qd = { t: 0 }, Jd = { t: 1 };
function Yd(e) {
	var t = En(e, Kd), { isActive: n, canBegin: r, duration: i, easing: a, begin: o, onAnimationEnd: s, onAnimationStart: c, children: l } = t, u = Au(), d = n === "auto" ? !ku.isSsr && !u : n, f = Gd(t.animationId, t.animationManager), [p, m] = (0, S.useState)(d ? qd : Jd), h = (0, S.useRef)(null);
	return (0, S.useEffect)(() => {
		d || m(Jd);
	}, [d]), (0, S.useEffect)(() => {
		if (!d || !r) return en;
		var e = Ad(qd, Jd, Bd(a), i, m, f.getTimeoutController());
		return f.start([
			c,
			o,
			() => {
				h.current = e();
			},
			i,
			s
		]), () => {
			f.stop(), h.current && h.current(), s();
		};
	}, [
		d,
		r,
		i,
		a,
		o,
		c,
		s,
		f
	]), l(p.t);
}
//#endregion
//#region node_modules/recharts/es6/util/useAnimationId.js
function Xd(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "animation-", n = (0, S.useRef)(Kt(t)), r = (0, S.useRef)(e);
	return r.current !== e && (n.current = Kt(t), r.current = e), n.current;
}
//#endregion
//#region node_modules/recharts/es6/shape/Rectangle.js
var Zd = ["radius"], Qd = ["radius"], $d, ef, tf, nf, rf, af, of, sf, cf, lf;
function uf(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function df(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? uf(Object(n), !0).forEach(function(t) {
			ff(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : uf(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function ff(e, t, n) {
	return (t = pf(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function pf(e) {
	var t = mf(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function mf(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function hf() {
	return hf = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, hf.apply(null, arguments);
}
function gf(e, t) {
	if (e == null) return {};
	var n, r, i = _f(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function _f(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function vf(e, t) {
	return t ||= e.slice(0), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var yf = (e, t, n, r, i) => {
	var a = zt(n), o = zt(r), s = Math.min(Math.abs(a) / 2, Math.abs(o) / 2), c = o >= 0 ? 1 : -1, l = a >= 0 ? 1 : -1, u = +(o >= 0 && a >= 0 || o < 0 && a < 0), d;
	if (s > 0 && Array.isArray(i)) {
		for (var f = [
			0,
			0,
			0,
			0
		], p = 0, m = 4; p < m; p++) {
			var h = i[p] ?? 0;
			f[p] = h > s ? s : h;
		}
		d = Bt($d ||= vf([
			"M",
			",",
			""
		]), e, t + c * f[0]), f[0] > 0 && (d += Bt(ef ||= vf([
			"A ",
			",",
			",0,0,",
			",",
			",",
			""
		]), f[0], f[0], u, e + l * f[0], t)), d += Bt(tf ||= vf([
			"L ",
			",",
			""
		]), e + n - l * f[1], t), f[1] > 0 && (d += Bt(nf ||= vf([
			"A ",
			",",
			",0,0,",
			",\n        ",
			",",
			""
		]), f[1], f[1], u, e + n, t + c * f[1])), d += Bt(rf ||= vf([
			"L ",
			",",
			""
		]), e + n, t + r - c * f[2]), f[2] > 0 && (d += Bt(af ||= vf([
			"A ",
			",",
			",0,0,",
			",\n        ",
			",",
			""
		]), f[2], f[2], u, e + n - l * f[2], t + r)), d += Bt(of ||= vf([
			"L ",
			",",
			""
		]), e + l * f[3], t + r), f[3] > 0 && (d += Bt(sf ||= vf([
			"A ",
			",",
			",0,0,",
			",\n        ",
			",",
			""
		]), f[3], f[3], u, e, t + r - c * f[3])), d += "Z";
	} else if (s > 0 && i === +i && i > 0) {
		var g = Math.min(s, i);
		d = Bt(cf ||= vf(/* @__PURE__ */ "M .,.\n            A .,.,0,0,.,.,.\n            L .,.\n            A .,.,0,0,.,.,.\n            L .,.\n            A .,.,0,0,.,.,.\n            L .,.\n            A .,.,0,0,.,.,. Z".split(".")), e, t + c * g, g, g, u, e + l * g, t, e + n - l * g, t, g, g, u, e + n, t + c * g, e + n, t + r - c * g, g, g, u, e + n - l * g, t + r, e + l * g, t + r, g, g, u, e, t + r - c * g);
	} else d = Bt(lf ||= vf([
		"M ",
		",",
		" h ",
		" v ",
		" h ",
		" Z"
	]), e, t, n, r, -n);
	return d;
}, bf = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	radius: 0,
	isAnimationActive: !1,
	isUpdateAnimationActive: !1,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease"
}, xf = (e) => {
	var t = En(e, bf), n = (0, S.useRef)(null), [r, i] = (0, S.useState)(-1);
	(0, S.useEffect)(() => {
		if (n.current && n.current.getTotalLength) try {
			var e = n.current.getTotalLength();
			e && i(e);
		} catch {}
	}, []);
	var { x: a, y: o, width: s, height: c, radius: l, className: u } = t, { animationEasing: d, animationDuration: f, animationBegin: p, isAnimationActive: m, isUpdateAnimationActive: h } = t, g = (0, S.useRef)(s), _ = (0, S.useRef)(c), v = (0, S.useRef)(a), b = (0, S.useRef)(o), x = Xd((0, S.useMemo)(() => ({
		x: a,
		y: o,
		width: s,
		height: c,
		radius: l
	}), [
		a,
		o,
		s,
		c,
		l
	]), "rectangle-");
	if (a !== +a || o !== +o || s !== +s || c !== +c || s === 0 || c === 0) return null;
	var C = y("recharts-rectangle", u);
	if (!h) {
		var w = O(t), { radius: T } = w, E = gf(w, Zd);
		return /* @__PURE__ */ S.createElement("path", hf({}, E, {
			x: zt(a),
			y: zt(o),
			width: zt(s),
			height: zt(c),
			radius: typeof l == "number" ? l : void 0,
			className: C,
			d: yf(a, o, s, c, l)
		}));
	}
	var D = g.current, k = _.current, ee = v.current, te = b.current, ne = `0px ${r === -1 ? 1 : r}px`, A = `${r}px ${r}px`, re = vd(["strokeDasharray"], f, typeof d == "string" ? d : bf.animationEasing);
	return /* @__PURE__ */ S.createElement(Yd, {
		animationId: x,
		key: x,
		canBegin: r > 0,
		duration: f,
		easing: d,
		isActive: h,
		begin: p
	}, (e) => {
		var r = Yt(D, s, e), i = Yt(k, c, e), u = Yt(ee, a, e), d = Yt(te, o, e);
		n.current && (g.current = r, _.current = i, v.current = u, b.current = d);
		var f = m ? e > 0 ? {
			transition: re,
			strokeDasharray: A
		} : { strokeDasharray: ne } : { strokeDasharray: A }, p = O(t), { radius: h } = p, y = gf(p, Qd);
		return /* @__PURE__ */ S.createElement("path", hf({}, y, {
			radius: typeof l == "number" ? l : void 0,
			className: C,
			d: yf(u, d, r, i, l),
			ref: n,
			style: df(df({}, f), t.style)
		}));
	});
};
//#endregion
//#region node_modules/recharts/es6/util/PolarUtils.js
function Sf(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Cf(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Sf(Object(n), !0).forEach(function(t) {
			wf(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Sf(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function wf(e, t, n) {
	return (t = Tf(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Tf(e) {
	var t = Ef(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Ef(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Df = Math.PI / 180, Of = (e) => e * 180 / Math.PI, kf = (e, t, n, r) => ({
	x: e + Math.cos(-Df * r) * n,
	y: t + Math.sin(-Df * r) * n
}), Af = function(e, t) {
	var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		width: 0,
		height: 0,
		brushBottom: 0
	};
	return Math.min(Math.abs(e - (n.left || 0) - (n.right || 0)), Math.abs(t - (n.top || 0) - (n.bottom || 0))) / 2;
}, jf = (e, t) => {
	var { x: n, y: r } = e, { x: i, y: a } = t;
	return Math.sqrt((n - i) ** 2 + (r - a) ** 2);
}, Mf = (e, t) => {
	var { x: n, y: r } = e, { cx: i, cy: a } = t, o = jf({
		x: n,
		y: r
	}, {
		x: i,
		y: a
	});
	if (o <= 0) return {
		radius: o,
		angle: 0
	};
	var s = (n - i) / o, c = Math.acos(s);
	return r > a && (c = 2 * Math.PI - c), {
		radius: o,
		angle: Of(c),
		angleInRadian: c
	};
}, Nf = (e) => {
	var { startAngle: t, endAngle: n } = e, r = Math.floor(t / 360), i = Math.floor(n / 360), a = Math.min(r, i);
	return {
		startAngle: t - a * 360,
		endAngle: n - a * 360
	};
}, Pf = (e, t) => {
	var { startAngle: n, endAngle: r } = t, i = Math.floor(n / 360), a = Math.floor(r / 360);
	return e + Math.min(i, a) * 360;
}, Ff = (e, t) => {
	var { relativeX: n, relativeY: r } = e, { radius: i, angle: a } = Mf({
		x: n,
		y: r
	}, t), { innerRadius: o, outerRadius: s } = t;
	if (i < o || i > s || i === 0) return null;
	var { startAngle: c, endAngle: l } = Nf(t), u = a, d;
	if (c <= l) {
		for (; u > l;) u -= 360;
		for (; u < c;) u += 360;
		d = u >= c && u <= l;
	} else {
		for (; u > c;) u -= 360;
		for (; u < l;) u += 360;
		d = u >= l && u <= c;
	}
	return d ? Cf(Cf({}, t), {}, {
		radius: i,
		angle: Pf(u, t)
	}) : null;
};
//#endregion
//#region node_modules/recharts/es6/util/cursor/getRadialCursorPoints.js
function If(e) {
	var { cx: t, cy: n, radius: r, startAngle: i, endAngle: a } = e;
	return {
		points: [kf(t, n, r, i), kf(t, n, r, a)],
		cx: t,
		cy: n,
		radius: r,
		startAngle: i,
		endAngle: a
	};
}
//#endregion
//#region node_modules/recharts/es6/shape/Sector.js
var Lf, Rf, zf, Bf, Vf, Hf, Uf;
function Wf() {
	return Wf = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, Wf.apply(null, arguments);
}
function Gf(e, t) {
	return t ||= e.slice(0), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var Kf = (e, t) => Vt(t - e) * Math.min(Math.abs(t - e), 359.999), qf = (e) => {
	var { cx: t, cy: n, radius: r, angle: i, sign: a, isExternal: o, cornerRadius: s, cornerIsExternal: c } = e, l = s * (o ? 1 : -1) + r, u = Math.asin(s / l) / Df, d = c ? i : i + a * u, f = kf(t, n, l, d), p = kf(t, n, r, d), m = c ? i - a * u : i;
	return {
		center: f,
		circleTangency: p,
		lineTangency: kf(t, n, l * Math.cos(u * Df), m),
		theta: u
	};
}, Jf = (e) => {
	var { cx: t, cy: n, innerRadius: r, outerRadius: i, startAngle: a, endAngle: o } = e, s = Kf(a, o), c = a + s, l = kf(t, n, i, a), u = kf(t, n, i, c), d = Bt(Lf ||= Gf([
		"M ",
		",",
		"\n    A ",
		",",
		",0,\n    ",
		",",
		",\n    ",
		",",
		"\n  "
	]), l.x, l.y, i, i, +(Math.abs(s) > 180), +(a > c), u.x, u.y);
	if (r > 0) {
		var f = kf(t, n, r, a), p = kf(t, n, r, c);
		d += Bt(Rf ||= Gf([
			"L ",
			",",
			"\n            A ",
			",",
			",0,\n            ",
			",",
			",\n            ",
			",",
			" Z"
		]), p.x, p.y, r, r, +(Math.abs(s) > 180), +(a <= c), f.x, f.y);
	} else d += Bt(zf ||= Gf([
		"L ",
		",",
		" Z"
	]), t, n);
	return d;
}, Yf = (e) => {
	var { cx: t, cy: n, innerRadius: r, outerRadius: i, cornerRadius: a, forceCornerRadius: o, cornerIsExternal: s, startAngle: c, endAngle: l } = e, u = Vt(l - c), { circleTangency: d, lineTangency: f, theta: p } = qf({
		cx: t,
		cy: n,
		radius: i,
		angle: c,
		sign: u,
		cornerRadius: a,
		cornerIsExternal: s
	}), { circleTangency: m, lineTangency: h, theta: g } = qf({
		cx: t,
		cy: n,
		radius: i,
		angle: l,
		sign: -u,
		cornerRadius: a,
		cornerIsExternal: s
	}), _ = s ? Math.abs(c - l) : Math.abs(c - l) - p - g;
	if (_ < 0) return o ? Bt(Bf ||= Gf([
		"M ",
		",",
		"\n        a",
		",",
		",0,0,1,",
		",0\n        a",
		",",
		",0,0,1,",
		",0\n      "
	]), f.x, f.y, a, a, a * 2, a, a, -a * 2) : Jf({
		cx: t,
		cy: n,
		innerRadius: r,
		outerRadius: i,
		startAngle: c,
		endAngle: l
	});
	var v = Bt(Vf ||= Gf([
		"M ",
		",",
		"\n    A",
		",",
		",0,0,",
		",",
		",",
		"\n    A",
		",",
		",0,",
		",",
		",",
		",",
		"\n    A",
		",",
		",0,0,",
		",",
		",",
		"\n  "
	]), f.x, f.y, a, a, +(u < 0), d.x, d.y, i, i, +(_ > 180), +(u < 0), m.x, m.y, a, a, +(u < 0), h.x, h.y);
	if (r > 0) {
		var { circleTangency: y, lineTangency: b, theta: x } = qf({
			cx: t,
			cy: n,
			radius: r,
			angle: c,
			sign: u,
			isExternal: !0,
			cornerRadius: a,
			cornerIsExternal: s
		}), { circleTangency: S, lineTangency: C, theta: w } = qf({
			cx: t,
			cy: n,
			radius: r,
			angle: l,
			sign: -u,
			isExternal: !0,
			cornerRadius: a,
			cornerIsExternal: s
		}), T = s ? Math.abs(c - l) : Math.abs(c - l) - x - w;
		if (T < 0 && a === 0) return `${v}L${t},${n}Z`;
		v += Bt(Hf ||= Gf([
			"L",
			",",
			"\n      A",
			",",
			",0,0,",
			",",
			",",
			"\n      A",
			",",
			",0,",
			",",
			",",
			",",
			"\n      A",
			",",
			",0,0,",
			",",
			",",
			"Z"
		]), C.x, C.y, a, a, +(u < 0), S.x, S.y, r, r, +(T > 180), +(u > 0), y.x, y.y, a, a, +(u < 0), b.x, b.y);
	} else v += Bt(Uf ||= Gf([
		"L",
		",",
		"Z"
	]), t, n);
	return v;
}, Xf = {
	cx: 0,
	cy: 0,
	innerRadius: 0,
	outerRadius: 0,
	startAngle: 0,
	endAngle: 0,
	cornerRadius: 0,
	forceCornerRadius: !1,
	cornerIsExternal: !1
}, Zf = (e) => {
	var t = En(e, Xf), { cx: n, cy: r, innerRadius: i, outerRadius: a, cornerRadius: o, forceCornerRadius: s, cornerIsExternal: c, startAngle: l, endAngle: u, className: d } = t;
	if (a < i || l === u) return null;
	var f = y("recharts-sector", d), p = a - i, m = qt(o, p, 0, !0), h = m > 0 && Math.abs(l - u) < 360 ? Yf({
		cx: n,
		cy: r,
		innerRadius: i,
		outerRadius: a,
		cornerRadius: Math.min(m, p / 2),
		forceCornerRadius: s,
		cornerIsExternal: c,
		startAngle: l,
		endAngle: u
	}) : Jf({
		cx: n,
		cy: r,
		innerRadius: i,
		outerRadius: a,
		startAngle: l,
		endAngle: u
	});
	return /* @__PURE__ */ S.createElement("path", Wf({}, O(t), {
		className: f,
		d: h
	}));
};
//#endregion
//#region node_modules/recharts/es6/util/cursor/getCursorPoints.js
function Qf(e, t, n) {
	if (e === "horizontal") return [{
		x: t.x,
		y: n.top
	}, {
		x: t.x,
		y: n.top + n.height
	}];
	if (e === "vertical") return [{
		x: n.left,
		y: t.y
	}, {
		x: n.left + n.width,
		y: t.y
	}];
	if (_n(t)) {
		if (e === "centric") {
			var { cx: r, cy: i, innerRadius: a, outerRadius: o, angle: s } = t, c = kf(r, i, a, s), l = kf(r, i, o, s);
			return [{
				x: c.x,
				y: c.y
			}, {
				x: l.x,
				y: l.y
			}];
		}
		return If(t);
	}
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/util/toNumber.mjs
function $f(e) {
	return li(e) ? NaN : Number(e);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/util/toFinite.mjs
function ep(e) {
	return e ? (e = $f(e), e === Infinity || e === -Infinity ? (e < 0 ? -1 : 1) * Number.MAX_VALUE : e === e ? e : 0) : e === 0 ? e : 0;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/math/range.mjs
function tp(e, t, n) {
	n && typeof n != "number" && oi(e, t, n) && (t = n = void 0), e = ep(e), t === void 0 ? (t = e, e = 0) : t = ep(t), n = n === void 0 ? e < t ? 1 : -1 : ep(n);
	let r = Math.max(Math.ceil((t - e) / (n || 1)), 0), i = Array(r);
	for (let t = 0; t < r; t++) i[t] = e, e += n;
	return i;
}
//#endregion
//#region node_modules/recharts/es6/state/selectors/dataSelectors.js
var np = (e) => e.chartData, rp = L([np], (e) => {
	var t = e.chartData == null ? 0 : e.chartData.length - 1;
	return {
		chartData: e.chartData,
		computedData: e.computedData,
		dataEndIndex: t,
		dataStartIndex: 0
	};
}), ip = (e, t, n, r) => r ? rp(e) : np(e), ap = (e, t, n) => n ? rp(e) : np(e);
//#endregion
//#region node_modules/recharts/es6/util/isDomainSpecifiedByUser.js
function op(e) {
	if (Array.isArray(e) && e.length === 2) {
		var [t, n] = e;
		if (H(t) && H(n)) return !0;
	}
	return !1;
}
function sp(e, t, n) {
	return n ? e : [Math.min(e[0], t[0]), Math.max(e[1], t[1])];
}
function cp(e, t) {
	if (t && typeof e != "function" && Array.isArray(e) && e.length === 2) {
		var [n, r] = e, i, a;
		if (H(n)) i = n;
		else if (typeof n == "function") return;
		if (H(r)) a = r;
		else if (typeof r == "function") return;
		var o = [i, a];
		if (op(o)) return o;
	}
}
function lp(e, t, n) {
	if (!(!n && t == null)) {
		if (typeof e == "function" && t != null) try {
			var r = e(t, n);
			if (op(r)) return sp(r, t, n);
		} catch {}
		if (Array.isArray(e) && e.length === 2) {
			var [i, a] = e, o, s;
			if (i === "auto") t != null && (o = Math.min(...t));
			else if (F(i)) o = i;
			else if (typeof i == "function") try {
				t != null && (o = i(t?.[0]));
			} catch {}
			else if (typeof i == "string" && Ls.test(i)) {
				var c = Ls.exec(i);
				if (c == null || c[1] == null || t == null) o = void 0;
				else {
					var l = +c[1];
					o = t[0] - l;
				}
			} else o = t?.[0];
			if (a === "auto") t != null && (s = Math.max(...t));
			else if (F(a)) s = a;
			else if (typeof a == "function") try {
				t != null && (s = a(t?.[1]));
			} catch {}
			else if (typeof a == "string" && Rs.test(a)) {
				var u = Rs.exec(a);
				if (u == null || u[1] == null || t == null) s = void 0;
				else {
					var d = +u[1];
					s = t[1] + d;
				}
			} else s = t?.[1];
			var f = [o, s];
			if (op(f)) return t == null ? f : sp(f, t, n);
		}
	}
}
//#endregion
//#region node_modules/recharts/es6/util/scale/util/arithmetic.js
var Z = /* @__PURE__ */ l((/* @__PURE__ */ o(((e, t) => {
	(function(e) {
		var n = 1e9, r = {
			precision: 20,
			rounding: 4,
			toExpNeg: -7,
			toExpPos: 21,
			LN10: "2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286"
		}, i = !0, a = "[DecimalError] ", o = a + "Invalid argument: ", s = a + "Exponent out of range: ", c = Math.floor, l = Math.pow, u = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, d, f = 1e7, p = 7, m = 9007199254740991, h = c(m / p), g = {};
		g.absoluteValue = g.abs = function() {
			var e = new this.constructor(this);
			return e.s &&= 1, e;
		}, g.comparedTo = g.cmp = function(e) {
			var t, n, r, i, a = this;
			if (e = new a.constructor(e), a.s !== e.s) return a.s || -e.s;
			if (a.e !== e.e) return a.e > e.e ^ a.s < 0 ? 1 : -1;
			for (r = a.d.length, i = e.d.length, t = 0, n = r < i ? r : i; t < n; ++t) if (a.d[t] !== e.d[t]) return a.d[t] > e.d[t] ^ a.s < 0 ? 1 : -1;
			return r === i ? 0 : r > i ^ a.s < 0 ? 1 : -1;
		}, g.decimalPlaces = g.dp = function() {
			var e = this, t = e.d.length - 1, n = (t - e.e) * p;
			if (t = e.d[t], t) for (; t % 10 == 0; t /= 10) n--;
			return n < 0 ? 0 : n;
		}, g.dividedBy = g.div = function(e) {
			return b(this, new this.constructor(e));
		}, g.dividedToIntegerBy = g.idiv = function(e) {
			var t = this, n = t.constructor;
			return D(b(t, new n(e), 0, 1), n.precision);
		}, g.equals = g.eq = function(e) {
			return !this.cmp(e);
		}, g.exponent = function() {
			return S(this);
		}, g.greaterThan = g.gt = function(e) {
			return this.cmp(e) > 0;
		}, g.greaterThanOrEqualTo = g.gte = function(e) {
			return this.cmp(e) >= 0;
		}, g.isInteger = g.isint = function() {
			return this.e > this.d.length - 2;
		}, g.isNegative = g.isneg = function() {
			return this.s < 0;
		}, g.isPositive = g.ispos = function() {
			return this.s > 0;
		}, g.isZero = function() {
			return this.s === 0;
		}, g.lessThan = g.lt = function(e) {
			return this.cmp(e) < 0;
		}, g.lessThanOrEqualTo = g.lte = function(e) {
			return this.cmp(e) < 1;
		}, g.logarithm = g.log = function(e) {
			var t, n = this, r = n.constructor, o = r.precision, s = o + 5;
			if (e === void 0) e = new r(10);
			else if (e = new r(e), e.s < 1 || e.eq(d)) throw Error(a + "NaN");
			if (n.s < 1) throw Error(a + (n.s ? "NaN" : "-Infinity"));
			return n.eq(d) ? new r(0) : (i = !1, t = b(T(n, s), T(e, s), s), i = !0, D(t, o));
		}, g.minus = g.sub = function(e) {
			var t = this;
			return e = new t.constructor(e), t.s == e.s ? O(t, e) : _(t, (e.s = -e.s, e));
		}, g.modulo = g.mod = function(e) {
			var t, n = this, r = n.constructor, o = r.precision;
			if (e = new r(e), !e.s) throw Error(a + "NaN");
			return n.s ? (i = !1, t = b(n, e, 0, 1).times(e), i = !0, n.minus(t)) : D(new r(n), o);
		}, g.naturalExponential = g.exp = function() {
			return x(this);
		}, g.naturalLogarithm = g.ln = function() {
			return T(this);
		}, g.negated = g.neg = function() {
			var e = new this.constructor(this);
			return e.s = -e.s || 0, e;
		}, g.plus = g.add = function(e) {
			var t = this;
			return e = new t.constructor(e), t.s == e.s ? _(t, e) : O(t, (e.s = -e.s, e));
		}, g.precision = g.sd = function(e) {
			var t, n, r, i = this;
			if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(o + e);
			if (t = S(i) + 1, r = i.d.length - 1, n = r * p + 1, r = i.d[r], r) {
				for (; r % 10 == 0; r /= 10) n--;
				for (r = i.d[0]; r >= 10; r /= 10) n++;
			}
			return e && t > n ? t : n;
		}, g.squareRoot = g.sqrt = function() {
			var e, t, n, r, o, s, l, u = this, d = u.constructor;
			if (u.s < 1) {
				if (!u.s) return new d(0);
				throw Error(a + "NaN");
			}
			for (e = S(u), i = !1, o = Math.sqrt(+u), o == 0 || o == Infinity ? (t = y(u.d), (t.length + e) % 2 == 0 && (t += "0"), o = Math.sqrt(t), e = c((e + 1) / 2) - (e < 0 || e % 2), o == Infinity ? t = "5e" + e : (t = o.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + e), r = new d(t)) : r = new d(o.toString()), n = d.precision, o = l = n + 3;;) if (s = r, r = s.plus(b(u, s, l + 2)).times(.5), y(s.d).slice(0, l) === (t = y(r.d)).slice(0, l)) {
				if (t = t.slice(l - 3, l + 1), o == l && t == "4999") {
					if (D(s, n + 1, 0), s.times(s).eq(u)) {
						r = s;
						break;
					}
				} else if (t != "9999") break;
				l += 4;
			}
			return i = !0, D(r, n);
		}, g.times = g.mul = function(e) {
			var t, n, r, a, o, s, c, l, u, d = this, p = d.constructor, m = d.d, h = (e = new p(e)).d;
			if (!d.s || !e.s) return new p(0);
			for (e.s *= d.s, n = d.e + e.e, l = m.length, u = h.length, l < u && (o = m, m = h, h = o, s = l, l = u, u = s), o = [], s = l + u, r = s; r--;) o.push(0);
			for (r = u; --r >= 0;) {
				for (t = 0, a = l + r; a > r;) c = o[a] + h[r] * m[a - r - 1] + t, o[a--] = c % f | 0, t = c / f | 0;
				o[a] = (o[a] + t) % f | 0;
			}
			for (; !o[--s];) o.pop();
			return t ? ++n : o.shift(), e.d = o, e.e = n, i ? D(e, p.precision) : e;
		}, g.toDecimalPlaces = g.todp = function(e, t) {
			var r = this, i = r.constructor;
			return r = new i(r), e === void 0 ? r : (v(e, 0, n), t === void 0 ? t = i.rounding : v(t, 0, 8), D(r, e + S(r) + 1, t));
		}, g.toExponential = function(e, t) {
			var r, i = this, a = i.constructor;
			return e === void 0 ? r = k(i, !0) : (v(e, 0, n), t === void 0 ? t = a.rounding : v(t, 0, 8), i = D(new a(i), e + 1, t), r = k(i, !0, e + 1)), r;
		}, g.toFixed = function(e, t) {
			var r, i, a = this, o = a.constructor;
			return e === void 0 ? k(a) : (v(e, 0, n), t === void 0 ? t = o.rounding : v(t, 0, 8), i = D(new o(a), e + S(a) + 1, t), r = k(i.abs(), !1, e + S(i) + 1), a.isneg() && !a.isZero() ? "-" + r : r);
		}, g.toInteger = g.toint = function() {
			var e = this, t = e.constructor;
			return D(new t(e), S(e) + 1, t.rounding);
		}, g.toNumber = function() {
			return +this;
		}, g.toPower = g.pow = function(e) {
			var t, n, r, o, s, l, u = this, f = u.constructor, h = 12, g = +(e = new f(e));
			if (!e.s) return new f(d);
			if (u = new f(u), !u.s) {
				if (e.s < 1) throw Error(a + "Infinity");
				return u;
			}
			if (u.eq(d)) return u;
			if (r = f.precision, e.eq(d)) return D(u, r);
			if (t = e.e, n = e.d.length - 1, l = t >= n, s = u.s, !l) {
				if (s < 0) throw Error(a + "NaN");
			} else if ((n = g < 0 ? -g : g) <= m) {
				for (o = new f(d), t = Math.ceil(r / p + 4), i = !1; n % 2 && (o = o.times(u), ee(o.d, t)), n = c(n / 2), n !== 0;) u = u.times(u), ee(u.d, t);
				return i = !0, e.s < 0 ? new f(d).div(o) : D(o, r);
			}
			return s = s < 0 && e.d[Math.max(t, n)] & 1 ? -1 : 1, u.s = 1, i = !1, o = e.times(T(u, r + h)), i = !0, o = x(o), o.s = s, o;
		}, g.toPrecision = function(e, t) {
			var r, i, a = this, o = a.constructor;
			return e === void 0 ? (r = S(a), i = k(a, r <= o.toExpNeg || r >= o.toExpPos)) : (v(e, 1, n), t === void 0 ? t = o.rounding : v(t, 0, 8), a = D(new o(a), e, t), r = S(a), i = k(a, e <= r || r <= o.toExpNeg, e)), i;
		}, g.toSignificantDigits = g.tosd = function(e, t) {
			var r = this, i = r.constructor;
			return e === void 0 ? (e = i.precision, t = i.rounding) : (v(e, 1, n), t === void 0 ? t = i.rounding : v(t, 0, 8)), D(new i(r), e, t);
		}, g.toString = g.valueOf = g.val = g.toJSON = function() {
			var e = this, t = S(e), n = e.constructor;
			return k(e, t <= n.toExpNeg || t >= n.toExpPos);
		};
		function _(e, t) {
			var n, r, a, o, s, c, l, u, d = e.constructor, m = d.precision;
			if (!e.s || !t.s) return t.s || (t = new d(e)), i ? D(t, m) : t;
			if (l = e.d, u = t.d, s = e.e, a = t.e, l = l.slice(), o = s - a, o) {
				for (o < 0 ? (r = l, o = -o, c = u.length) : (r = u, a = s, c = l.length), s = Math.ceil(m / p), c = s > c ? s + 1 : c + 1, o > c && (o = c, r.length = 1), r.reverse(); o--;) r.push(0);
				r.reverse();
			}
			for (c = l.length, o = u.length, c - o < 0 && (o = c, r = u, u = l, l = r), n = 0; o;) n = (l[--o] = l[o] + u[o] + n) / f | 0, l[o] %= f;
			for (n && (l.unshift(n), ++a), c = l.length; l[--c] == 0;) l.pop();
			return t.d = l, t.e = a, i ? D(t, m) : t;
		}
		function v(e, t, n) {
			if (e !== ~~e || e < t || e > n) throw Error(o + e);
		}
		function y(e) {
			var t, n, r, i = e.length - 1, a = "", o = e[0];
			if (i > 0) {
				for (a += o, t = 1; t < i; t++) r = e[t] + "", n = p - r.length, n && (a += w(n)), a += r;
				o = e[t], r = o + "", n = p - r.length, n && (a += w(n));
			} else if (o === 0) return "0";
			for (; o % 10 == 0;) o /= 10;
			return a + o;
		}
		var b = (function() {
			function e(e, t) {
				var n, r = 0, i = e.length;
				for (e = e.slice(); i--;) n = e[i] * t + r, e[i] = n % f | 0, r = n / f | 0;
				return r && e.unshift(r), e;
			}
			function t(e, t, n, r) {
				var i, a;
				if (n != r) a = n > r ? 1 : -1;
				else for (i = a = 0; i < n; i++) if (e[i] != t[i]) {
					a = e[i] > t[i] ? 1 : -1;
					break;
				}
				return a;
			}
			function n(e, t, n) {
				for (var r = 0; n--;) e[n] -= r, r = +(e[n] < t[n]), e[n] = r * f + e[n] - t[n];
				for (; !e[0] && e.length > 1;) e.shift();
			}
			return function(r, i, o, s) {
				var c, l, u, d, m, h, g, _, v, y, b, x, C, w, T, E, O, k, ee = r.constructor, te = r.s == i.s ? 1 : -1, ne = r.d, A = i.d;
				if (!r.s) return new ee(r);
				if (!i.s) throw Error(a + "Division by zero");
				for (l = r.e - i.e, O = A.length, T = ne.length, g = new ee(te), _ = g.d = [], u = 0; A[u] == (ne[u] || 0);) ++u;
				if (A[u] > (ne[u] || 0) && --l, x = o == null ? o = ee.precision : s ? o + (S(r) - S(i)) + 1 : o, x < 0) return new ee(0);
				if (x = x / p + 2 | 0, u = 0, O == 1) for (d = 0, A = A[0], x++; (u < T || d) && x--; u++) C = d * f + (ne[u] || 0), _[u] = C / A | 0, d = C % A | 0;
				else {
					for (d = f / (A[0] + 1) | 0, d > 1 && (A = e(A, d), ne = e(ne, d), O = A.length, T = ne.length), w = O, v = ne.slice(0, O), y = v.length; y < O;) v[y++] = 0;
					k = A.slice(), k.unshift(0), E = A[0], A[1] >= f / 2 && ++E;
					do
						d = 0, c = t(A, v, O, y), c < 0 ? (b = v[0], O != y && (b = b * f + (v[1] || 0)), d = b / E | 0, d > 1 ? (d >= f && (d = f - 1), m = e(A, d), h = m.length, y = v.length, c = t(m, v, h, y), c == 1 && (d--, n(m, O < h ? k : A, h))) : (d == 0 && (c = d = 1), m = A.slice()), h = m.length, h < y && m.unshift(0), n(v, m, y), c == -1 && (y = v.length, c = t(A, v, O, y), c < 1 && (d++, n(v, O < y ? k : A, y))), y = v.length) : c === 0 && (d++, v = [0]), _[u++] = d, c && v[0] ? v[y++] = ne[w] || 0 : (v = [ne[w]], y = 1);
					while ((w++ < T || v[0] !== void 0) && x--);
				}
				return _[0] || _.shift(), g.e = l, D(g, s ? o + S(g) + 1 : o);
			};
		})();
		function x(e, t) {
			var n, r, a, o, c, u, f = 0, p = 0, m = e.constructor, h = m.precision;
			if (S(e) > 16) throw Error(s + S(e));
			if (!e.s) return new m(d);
			for (t == null ? (i = !1, u = h) : u = t, c = new m(.03125); e.abs().gte(.1);) e = e.times(c), p += 5;
			for (r = Math.log(l(2, p)) / Math.LN10 * 2 + 5 | 0, u += r, n = a = o = new m(d), m.precision = u;;) {
				if (a = D(a.times(e), u), n = n.times(++f), c = o.plus(b(a, n, u)), y(c.d).slice(0, u) === y(o.d).slice(0, u)) {
					for (; p--;) o = D(o.times(o), u);
					return m.precision = h, t == null ? (i = !0, D(o, h)) : o;
				}
				o = c;
			}
		}
		function S(e) {
			for (var t = e.e * p, n = e.d[0]; n >= 10; n /= 10) t++;
			return t;
		}
		function C(e, t, n) {
			if (t > e.LN10.sd()) throw i = !0, n && (e.precision = n), Error(a + "LN10 precision limit exceeded");
			return D(new e(e.LN10), t);
		}
		function w(e) {
			for (var t = ""; e--;) t += "0";
			return t;
		}
		function T(e, t) {
			var n, r, o, s, c, l, u, f, p, m = 1, h = 10, g = e, _ = g.d, v = g.constructor, x = v.precision;
			if (g.s < 1) throw Error(a + (g.s ? "NaN" : "-Infinity"));
			if (g.eq(d)) return new v(0);
			if (t == null ? (i = !1, f = x) : f = t, g.eq(10)) return t ?? (i = !0), C(v, f);
			if (f += h, v.precision = f, n = y(_), r = n.charAt(0), s = S(g), Math.abs(s) < 0x5543df729c000) {
				for (; r < 7 && r != 1 || r == 1 && n.charAt(1) > 3;) g = g.times(e), n = y(g.d), r = n.charAt(0), m++;
				s = S(g), r > 1 ? (g = new v("0." + n), s++) : g = new v(r + "." + n.slice(1));
			} else return u = C(v, f + 2, x).times(s + ""), g = T(new v(r + "." + n.slice(1)), f - h).plus(u), v.precision = x, t == null ? (i = !0, D(g, x)) : g;
			for (l = c = g = b(g.minus(d), g.plus(d), f), p = D(g.times(g), f), o = 3;;) {
				if (c = D(c.times(p), f), u = l.plus(b(c, new v(o), f)), y(u.d).slice(0, f) === y(l.d).slice(0, f)) return l = l.times(2), s !== 0 && (l = l.plus(C(v, f + 2, x).times(s + ""))), l = b(l, new v(m), f), v.precision = x, t == null ? (i = !0, D(l, x)) : l;
				l = u, o += 2;
			}
		}
		function E(e, t) {
			var n, r, a;
			for ((n = t.indexOf(".")) > -1 && (t = t.replace(".", "")), (r = t.search(/e/i)) > 0 ? (n < 0 && (n = r), n += +t.slice(r + 1), t = t.substring(0, r)) : n < 0 && (n = t.length), r = 0; t.charCodeAt(r) === 48;) ++r;
			for (a = t.length; t.charCodeAt(a - 1) === 48;) --a;
			if (t = t.slice(r, a), t) {
				if (a -= r, n = n - r - 1, e.e = c(n / p), e.d = [], r = (n + 1) % p, n < 0 && (r += p), r < a) {
					for (r && e.d.push(+t.slice(0, r)), a -= p; r < a;) e.d.push(+t.slice(r, r += p));
					t = t.slice(r), r = p - t.length;
				} else r -= a;
				for (; r--;) t += "0";
				if (e.d.push(+t), i && (e.e > h || e.e < -h)) throw Error(s + n);
			} else e.s = 0, e.e = 0, e.d = [0];
			return e;
		}
		function D(e, t, n) {
			var r, a, o, u, d, m, g, _, v = e.d;
			for (u = 1, o = v[0]; o >= 10; o /= 10) u++;
			if (r = t - u, r < 0) r += p, a = t, g = v[_ = 0];
			else {
				if (_ = Math.ceil((r + 1) / p), o = v.length, _ >= o) return e;
				for (g = o = v[_], u = 1; o >= 10; o /= 10) u++;
				r %= p, a = r - p + u;
			}
			if (n !== void 0 && (o = l(10, u - a - 1), d = g / o % 10 | 0, m = t < 0 || v[_ + 1] !== void 0 || g % o, m = n < 4 ? (d || m) && (n == 0 || n == (e.s < 0 ? 3 : 2)) : d > 5 || d == 5 && (n == 4 || m || n == 6 && (r > 0 ? a > 0 ? g / l(10, u - a) : 0 : v[_ - 1]) % 10 & 1 || n == (e.s < 0 ? 8 : 7))), t < 1 || !v[0]) return m ? (o = S(e), v.length = 1, t = t - o - 1, v[0] = l(10, (p - t % p) % p), e.e = c(-t / p) || 0) : (v.length = 1, v[0] = e.e = e.s = 0), e;
			if (r == 0 ? (v.length = _, o = 1, _--) : (v.length = _ + 1, o = l(10, p - r), v[_] = a > 0 ? (g / l(10, u - a) % l(10, a) | 0) * o : 0), m) for (;;) if (_ == 0) {
				(v[0] += o) == f && (v[0] = 1, ++e.e);
				break;
			} else {
				if (v[_] += o, v[_] != f) break;
				v[_--] = 0, o = 1;
			}
			for (r = v.length; v[--r] === 0;) v.pop();
			if (i && (e.e > h || e.e < -h)) throw Error(s + S(e));
			return e;
		}
		function O(e, t) {
			var n, r, a, o, s, c, l, u, d, m, h = e.constructor, g = h.precision;
			if (!e.s || !t.s) return t.s ? t.s = -t.s : t = new h(e), i ? D(t, g) : t;
			if (l = e.d, m = t.d, r = t.e, u = e.e, l = l.slice(), s = u - r, s) {
				for (d = s < 0, d ? (n = l, s = -s, c = m.length) : (n = m, r = u, c = l.length), a = Math.max(Math.ceil(g / p), c) + 2, s > a && (s = a, n.length = 1), n.reverse(), a = s; a--;) n.push(0);
				n.reverse();
			} else {
				for (a = l.length, c = m.length, d = a < c, d && (c = a), a = 0; a < c; a++) if (l[a] != m[a]) {
					d = l[a] < m[a];
					break;
				}
				s = 0;
			}
			for (d && (n = l, l = m, m = n, t.s = -t.s), c = l.length, a = m.length - c; a > 0; --a) l[c++] = 0;
			for (a = m.length; a > s;) {
				if (l[--a] < m[a]) {
					for (o = a; o && l[--o] === 0;) l[o] = f - 1;
					--l[o], l[a] += f;
				}
				l[a] -= m[a];
			}
			for (; l[--c] === 0;) l.pop();
			for (; l[0] === 0; l.shift()) --r;
			return l[0] ? (t.d = l, t.e = r, i ? D(t, g) : t) : new h(0);
		}
		function k(e, t, n) {
			var r, i = S(e), a = y(e.d), o = a.length;
			return t ? (n && (r = n - o) > 0 ? a = a.charAt(0) + "." + a.slice(1) + w(r) : o > 1 && (a = a.charAt(0) + "." + a.slice(1)), a = a + (i < 0 ? "e" : "e+") + i) : i < 0 ? (a = "0." + w(-i - 1) + a, n && (r = n - o) > 0 && (a += w(r))) : i >= o ? (a += w(i + 1 - o), n && (r = n - i - 1) > 0 && (a = a + "." + w(r))) : ((r = i + 1) < o && (a = a.slice(0, r) + "." + a.slice(r)), n && (r = n - o) > 0 && (i + 1 === o && (a += "."), a += w(r))), e.s < 0 ? "-" + a : a;
		}
		function ee(e, t) {
			if (e.length > t) return e.length = t, !0;
		}
		function te(e) {
			var t, n, r;
			function i(e) {
				var t = this;
				if (!(t instanceof i)) return new i(e);
				if (t.constructor = i, e instanceof i) {
					t.s = e.s, t.e = e.e, t.d = (e = e.d) ? e.slice() : e;
					return;
				}
				if (typeof e == "number") {
					if (e * 0 != 0) throw Error(o + e);
					if (e > 0) t.s = 1;
					else if (e < 0) e = -e, t.s = -1;
					else {
						t.s = 0, t.e = 0, t.d = [0];
						return;
					}
					if (e === ~~e && e < 1e7) {
						t.e = 0, t.d = [e];
						return;
					}
					return E(t, e.toString());
				} else if (typeof e != "string") throw Error(o + e);
				if (e.charCodeAt(0) === 45 ? (e = e.slice(1), t.s = -1) : t.s = 1, u.test(e)) E(t, e);
				else throw Error(o + e);
			}
			if (i.prototype = g, i.ROUND_UP = 0, i.ROUND_DOWN = 1, i.ROUND_CEIL = 2, i.ROUND_FLOOR = 3, i.ROUND_HALF_UP = 4, i.ROUND_HALF_DOWN = 5, i.ROUND_HALF_EVEN = 6, i.ROUND_HALF_CEIL = 7, i.ROUND_HALF_FLOOR = 8, i.clone = te, i.config = i.set = ne, e === void 0 && (e = {}), e) for (r = [
				"precision",
				"rounding",
				"toExpNeg",
				"toExpPos",
				"LN10"
			], t = 0; t < r.length;) e.hasOwnProperty(n = r[t++]) || (e[n] = this[n]);
			return i.config(e), i;
		}
		function ne(e) {
			if (!e || typeof e != "object") throw Error(a + "Object expected");
			var t, r, i, s = [
				"precision",
				1,
				n,
				"rounding",
				0,
				8,
				"toExpNeg",
				-Infinity,
				0,
				"toExpPos",
				0,
				Infinity
			];
			for (t = 0; t < s.length; t += 3) if ((i = e[r = s[t]]) !== void 0) if (c(i) === i && i >= s[t + 1] && i <= s[t + 2]) this[r] = i;
			else throw Error(o + r + ": " + i);
			if ((i = e[r = "LN10"]) !== void 0) if (i == Math.LN10) this[r] = new this(i);
			else throw Error(o + r + ": " + i);
			return this;
		}
		r = te(r), r.default = r.Decimal = r, d = new r(1), typeof define == "function" && define.amd ? define(function() {
			return r;
		}) : t !== void 0 && t.exports ? t.exports = r : (e ||= typeof self < "u" && self && self.self == self ? self : Function("return this")(), e.Decimal = r);
	})(e);
})))());
function up(e) {
	return e === 0 ? 1 : Math.floor(new Z.default(e).abs().log(10).toNumber()) + 1;
}
function dp(e, t, n) {
	for (var r = new Z.default(e), i = 0, a = []; r.lt(t) && i < 1e5;) a.push(r.toNumber()), r = r.add(n), i++;
	return a;
}
//#endregion
//#region node_modules/recharts/es6/util/scale/getNiceTickValues.js
var fp = (e) => {
	var [t, n] = e, [r, i] = [t, n];
	return t > n && ([r, i] = [n, t]), [r, i];
}, pp = (e, t, n) => {
	if (e.lte(0)) return new Z.default(0);
	var r = up(e.toNumber()), i = new Z.default(10).pow(r), a = e.div(i), o = r === 1 ? .1 : .05, s = new Z.default(Math.ceil(a.div(o).toNumber())).add(n).mul(o).mul(i);
	return t ? new Z.default(s.toNumber()) : new Z.default(Math.ceil(s.toNumber()));
}, mp = (e, t, n) => {
	if (e.lte(0)) return new Z.default(0);
	var r = [
		1,
		2,
		2.5,
		5
	], i = e.toNumber(), a = Math.floor(new Z.default(i).abs().log(10).toNumber()), o = new Z.default(10).pow(a), s = e.div(o).toNumber(), c = r.findIndex((e) => e >= s - 1e-10);
	if (c === -1 && (o = o.mul(10), c = 0), c += n, c >= r.length) {
		var l = Math.floor(c / r.length);
		c %= r.length, o = o.mul(new Z.default(10).pow(l));
	}
	var u = new Z.default(r[c] ?? 1).mul(o);
	return t ? u : new Z.default(Math.ceil(u.toNumber()));
}, hp = (e, t, n) => {
	var r = new Z.default(1), i = new Z.default(e);
	if (!i.isint() && n) {
		var a = Math.abs(e);
		a < 1 ? (r = new Z.default(10).pow(up(e) - 1), i = new Z.default(Math.floor(i.div(r).toNumber())).mul(r)) : a > 1 && (i = new Z.default(Math.floor(e)));
	} else e === 0 ? i = new Z.default(Math.floor((t - 1) / 2)) : n || (i = new Z.default(Math.floor(e)));
	for (var o = Math.floor((t - 1) / 2), s = [], c = 0; c < t; c++) s.push(i.add(new Z.default(c - o).mul(r)).toNumber());
	return s;
}, gp = function(e, t, n, r) {
	var i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0, a = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : pp;
	if (!Number.isFinite((t - e) / (n - 1))) return {
		step: new Z.default(0),
		tickMin: new Z.default(0),
		tickMax: new Z.default(0)
	};
	var o = a(new Z.default(t).sub(e).div(n - 1), r, i), s;
	e <= 0 && t >= 0 ? s = new Z.default(0) : (s = new Z.default(e).add(t).div(2), s = s.sub(new Z.default(s).mod(o)));
	var c = Math.ceil(s.sub(e).div(o).toNumber()), l = Math.ceil(new Z.default(t).sub(s).div(o).toNumber()), u = c + l + 1;
	return u > n ? gp(e, t, n, r, i + 1, a) : (u < n && (l = t > 0 ? l + (n - u) : l, c = t > 0 ? c : c + (n - u)), {
		step: o,
		tickMin: s.sub(new Z.default(c).mul(o)),
		tickMax: s.add(new Z.default(l).mul(o))
	});
}, _p = function(e) {
	var [t, n] = e, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 6, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "auto", o = Math.max(r, 2), [s, c] = fp([t, n]);
	if (s === -Infinity || c === Infinity) {
		var l = c === Infinity ? [s, ...Array(r - 1).fill(Infinity)] : [...Array(r - 1).fill(-Infinity), c];
		return t > n ? l.reverse() : l;
	}
	if (s === c) return hp(s, r, i);
	var { step: u, tickMin: d, tickMax: f } = gp(s, c, o, i, 0, a === "snap125" ? mp : pp), p = dp(d, f.add(new Z.default(.1).mul(u)), u);
	return t > n ? p.reverse() : p;
}, vp = function(e, t) {
	var [n, r] = e, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "auto", [o, s] = fp([n, r]);
	if (o === -Infinity || s === Infinity) return [n, r];
	if (o === s) return [o];
	var c = a === "snap125" ? mp : pp, l = Math.max(t, 2), u = c(new Z.default(s).sub(o).div(l - 1), i, 0), d = [...dp(new Z.default(o), new Z.default(s), u), s];
	return i === !1 && (d = d.map((e) => Math.round(e))), n > r ? d.reverse() : d;
}, yp = (e) => e.rootProps.maxBarSize, bp = (e) => e.rootProps.barGap, xp = (e) => e.rootProps.barCategoryGap, Sp = (e) => e.rootProps.barSize, Cp = (e) => e.rootProps.stackOffset, wp = (e) => e.rootProps.reverseStackOrder, Tp = (e) => e.options.chartName, Ep = (e) => e.rootProps.syncId, Dp = (e) => e.rootProps.syncMethod, Op = (e) => e.options.eventEmitter, kp = {
	grid: -100,
	barBackground: -50,
	area: 100,
	cursorRectangle: 200,
	bar: 300,
	line: 400,
	axis: 500,
	scatter: 600,
	activeBar: 1e3,
	cursorLine: 1100,
	activeDot: 1200,
	label: 2e3
}, Ap = {
	allowDecimals: !1,
	allowDuplicatedCategory: !0,
	allowDataOverflow: !1,
	angle: 0,
	angleAxisId: 0,
	axisLine: !0,
	axisLineType: "polygon",
	cx: 0,
	cy: 0,
	hide: !1,
	includeHidden: !1,
	label: !1,
	niceTicks: "auto",
	orientation: "outer",
	reversed: !1,
	scale: "auto",
	tick: !0,
	tickLine: !0,
	tickSize: 8,
	type: "auto",
	zIndex: kp.axis
}, jp = {
	allowDataOverflow: !1,
	allowDecimals: !1,
	allowDuplicatedCategory: !0,
	angle: 0,
	axisLine: !0,
	includeHidden: !1,
	hide: !1,
	niceTicks: "auto",
	label: !1,
	orientation: "right",
	radiusAxisId: 0,
	reversed: !1,
	scale: "auto",
	stroke: "#ccc",
	tick: !0,
	tickCount: 5,
	tickLine: !0,
	type: "auto",
	zIndex: kp.axis
}, Mp = (e, t) => {
	if (!(!e || !t)) return e != null && e.reversed ? [t[1], t[0]] : t;
};
//#endregion
//#region node_modules/recharts/es6/util/getAxisTypeBasedOnLayout.js
function Np(e, t, n) {
	if (n !== "auto") return n;
	if (e != null) return ws(e, t) ? "category" : "number";
}
//#endregion
//#region node_modules/recharts/es6/state/selectors/polarAxisSelectors.js
function Pp(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Fp(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Pp(Object(n), !0).forEach(function(t) {
			Ip(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Pp(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Ip(e, t, n) {
	return (t = Lp(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Lp(e) {
	var t = Rp(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Rp(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var zp = {
	allowDataOverflow: Ap.allowDataOverflow,
	allowDecimals: Ap.allowDecimals,
	allowDuplicatedCategory: !1,
	dataKey: void 0,
	domain: void 0,
	id: Ap.angleAxisId,
	includeHidden: !1,
	name: void 0,
	reversed: Ap.reversed,
	scale: Ap.scale,
	tick: Ap.tick,
	tickCount: void 0,
	ticks: void 0,
	type: Ap.type,
	unit: void 0,
	niceTicks: "auto"
}, Bp = {
	allowDataOverflow: jp.allowDataOverflow,
	allowDecimals: jp.allowDecimals,
	allowDuplicatedCategory: jp.allowDuplicatedCategory,
	dataKey: void 0,
	domain: void 0,
	id: jp.radiusAxisId,
	includeHidden: jp.includeHidden,
	name: void 0,
	reversed: jp.reversed,
	scale: jp.scale,
	tick: jp.tick,
	tickCount: jp.tickCount,
	ticks: void 0,
	type: jp.type,
	unit: void 0,
	niceTicks: "auto"
}, Vp = L([(e, t) => {
	if (t != null) return e.polarAxis.angleAxis[t];
}, qc], (e, t) => {
	if (e != null) return e;
	var n = Np(t, "angleAxis", zp.type) ?? "category";
	return Fp(Fp({}, zp), {}, { type: n });
}), Hp = L([(e, t) => e.polarAxis.radiusAxis[t], qc], (e, t) => {
	if (e != null) return e;
	var n = Np(t, "radiusAxis", Bp.type) ?? "category";
	return Fp(Fp({}, Bp), {}, { type: n });
}), Up = (e) => e.polarOptions, Wp = L([
	Ws,
	Gs,
	sc
], Af), Gp = L([Up, Wp], (e, t) => {
	if (e != null) return qt(e.innerRadius, t, 0);
}), Kp = L([Up, Wp], (e, t) => {
	if (e != null) return qt(e.outerRadius, t, t * .8);
}), qp = L([Up], (e) => {
	if (e == null) return [0, 0];
	var { startAngle: t, endAngle: n } = e;
	return [t, n];
});
L([Vp, qp], Mp);
var Jp = L([
	Wp,
	Gp,
	Kp
], (e, t, n) => {
	if (!(e == null || t == null || n == null)) return [t, n];
});
L([Hp, Jp], Mp);
var Yp = L([
	U,
	Up,
	Gp,
	Kp,
	Ws,
	Gs
], (e, t, n, r, i, a) => {
	if (!(e !== "centric" && e !== "radial" || t == null || n == null || r == null)) {
		var { cx: o, cy: s, startAngle: c, endAngle: l } = t;
		return {
			cx: qt(o, i, i / 2),
			cy: qt(s, a, a / 2),
			innerRadius: n,
			outerRadius: r,
			startAngle: c,
			endAngle: l,
			clockWise: !1
		};
	}
}), Xp = (e, t) => t, Zp = (e, t, n) => n;
//#endregion
//#region node_modules/recharts/es6/util/stacks/getStackSeriesIdentifier.js
function Qp(e) {
	return e?.id;
}
//#endregion
//#region node_modules/recharts/es6/state/selectors/combiners/combineDisplayedStackedData.js
function $p(e, t, n) {
	var { chartData: r = [] } = t, { allowDuplicatedCategory: i, dataKey: a } = n, o = /* @__PURE__ */ new Map();
	return e.forEach((e) => {
		var t = e.data ?? r;
		if (!(t == null || t.length === 0)) {
			var n = Qp(e);
			t.forEach((t, r) => {
				var s = a == null || i ? r : String(Ss(t, a, null)), c = Ss(t, e.dataKey, 0), l = o.has(s) ? o.get(s) : {};
				Object.assign(l, { [n]: c }), o.set(s, l);
			});
		}
	}), Array.from(o.values());
}
//#endregion
//#region node_modules/recharts/es6/state/types/StackedGraphicalItem.js
function em(e) {
	return "stackId" in e && e.stackId != null && e.dataKey != null;
}
//#endregion
//#region node_modules/recharts/es6/state/selectors/numberDomainEqualityCheck.js
var tm = (e, t) => e === t ? !0 : e == null || t == null ? !1 : e[0] === t[0] && e[1] === t[1];
//#endregion
//#region node_modules/recharts/es6/state/selectors/arrayEqualityCheck.js
function nm(e, t) {
	return Array.isArray(e) && Array.isArray(t) && e.length === 0 && t.length === 0 ? !0 : e === t;
}
function rm(e, t) {
	if (e.length === t.length) {
		for (var n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
		return !0;
	}
	return !1;
}
//#endregion
//#region node_modules/recharts/es6/state/selectors/selectTooltipAxisType.js
var im = (e) => {
	var t = U(e);
	return t === "horizontal" ? "xAxis" : t === "vertical" ? "yAxis" : t === "centric" ? "angleAxis" : "radiusAxis";
}, am = (e) => e.tooltip.settings.axisId;
//#endregion
//#region node_modules/recharts/es6/util/scale/RechartsScale.js
function om(e) {
	if (e != null) {
		var t = e.ticks, n = e.bandwidth, r = e.range(), i = [Math.min(...r), Math.max(...r)];
		return {
			domain: () => e.domain(),
			range: function(e) {
				function t() {
					return e.apply(this, arguments);
				}
				return t.toString = function() {
					return e.toString();
				}, t;
			}(() => i),
			rangeMin: () => i[0],
			rangeMax: () => i[1],
			isInRange(e) {
				var t = i[0], n = i[1];
				return t <= n ? e >= t && e <= n : e >= n && e <= t;
			},
			bandwidth: n ? () => n.call(e) : void 0,
			ticks: t ? (n) => t.call(e, n) : void 0,
			map: (t, n) => {
				var r = e(t);
				if (r != null) {
					if (e.bandwidth && n != null && n.position) {
						var i = e.bandwidth();
						switch (n.position) {
							case "middle":
								r += i / 2;
								break;
							case "end":
								r += i;
								break;
							default: break;
						}
					}
					return r;
				}
			}
		};
	}
}
//#endregion
//#region node_modules/recharts/es6/state/selectors/combiners/combineCheckedDomain.js
var sm = (e, t) => {
	if (t != null) switch (e) {
		case "linear":
			if (!op(t)) {
				for (var n, r, i = 0; i < t.length; i++) {
					var a = t[i];
					H(a) && ((n === void 0 || a < n) && (n = a), (r === void 0 || a > r) && (r = a));
				}
				return n !== void 0 && r !== void 0 ? [n, r] : void 0;
			}
			return t;
		default: return t;
	}
};
//#endregion
//#region node_modules/d3-array/src/ascending.js
function cm(e, t) {
	return e == null || t == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
//#endregion
//#region node_modules/d3-array/src/descending.js
function lm(e, t) {
	return e == null || t == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
//#endregion
//#region node_modules/d3-array/src/bisector.js
function um(e) {
	let t, n, r;
	e.length === 2 ? (t = e === cm || e === lm ? e : dm, n = e, r = e) : (t = cm, n = (t, n) => cm(e(t), n), r = (t, n) => e(t) - n);
	function i(e, r, i = 0, a = e.length) {
		if (i < a) {
			if (t(r, r) !== 0) return a;
			do {
				let t = i + a >>> 1;
				n(e[t], r) < 0 ? i = t + 1 : a = t;
			} while (i < a);
		}
		return i;
	}
	function a(e, r, i = 0, a = e.length) {
		if (i < a) {
			if (t(r, r) !== 0) return a;
			do {
				let t = i + a >>> 1;
				n(e[t], r) <= 0 ? i = t + 1 : a = t;
			} while (i < a);
		}
		return i;
	}
	function o(e, t, n = 0, a = e.length) {
		let o = i(e, t, n, a - 1);
		return o > n && r(e[o - 1], t) > -r(e[o], t) ? o - 1 : o;
	}
	return {
		left: i,
		center: o,
		right: a
	};
}
function dm() {
	return 0;
}
//#endregion
//#region node_modules/d3-array/src/number.js
function fm(e) {
	return e === null ? NaN : +e;
}
function* pm(e, t) {
	if (t === void 0) for (let t of e) t != null && (t = +t) >= t && (yield t);
	else {
		let n = -1;
		for (let r of e) (r = t(r, ++n, e)) != null && (r = +r) >= r && (yield r);
	}
}
//#endregion
//#region node_modules/d3-array/src/bisect.js
var mm = um(cm), hm = mm.right;
mm.left, um(fm).center;
//#endregion
//#region node_modules/internmap/src/index.js
var gm = class extends Map {
	constructor(e, t = bm) {
		if (super(), Object.defineProperties(this, {
			_intern: { value: /* @__PURE__ */ new Map() },
			_key: { value: t }
		}), e != null) for (let [t, n] of e) this.set(t, n);
	}
	get(e) {
		return super.get(_m(this, e));
	}
	has(e) {
		return super.has(_m(this, e));
	}
	set(e, t) {
		return super.set(vm(this, e), t);
	}
	delete(e) {
		return super.delete(ym(this, e));
	}
};
function _m({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) ? e.get(r) : n;
}
function vm({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) ? e.get(r) : (e.set(r, n), n);
}
function ym({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) && (n = e.get(r), e.delete(r)), n;
}
function bm(e) {
	return typeof e == "object" && e ? e.valueOf() : e;
}
//#endregion
//#region node_modules/d3-array/src/sort.js
function xm(e = cm) {
	if (e === cm) return Sm;
	if (typeof e != "function") throw TypeError("compare is not a function");
	return (t, n) => {
		let r = e(t, n);
		return r || r === 0 ? r : (e(n, n) === 0) - (e(t, t) === 0);
	};
}
function Sm(e, t) {
	return (e == null || !(e >= e)) - (t == null || !(t >= t)) || (e < t ? -1 : +(e > t));
}
//#endregion
//#region node_modules/d3-array/src/ticks.js
var Cm = Math.sqrt(50), wm = Math.sqrt(10), Tm = Math.sqrt(2);
function Em(e, t, n) {
	let r = (t - e) / Math.max(0, n), i = Math.floor(Math.log10(r)), a = r / 10 ** i, o = a >= Cm ? 10 : a >= wm ? 5 : a >= Tm ? 2 : 1, s, c, l;
	return i < 0 ? (l = 10 ** -i / o, s = Math.round(e * l), c = Math.round(t * l), s / l < e && ++s, c / l > t && --c, l = -l) : (l = 10 ** i * o, s = Math.round(e / l), c = Math.round(t / l), s * l < e && ++s, c * l > t && --c), c < s && .5 <= n && n < 2 ? Em(e, t, n * 2) : [
		s,
		c,
		l
	];
}
function Dm(e, t, n) {
	if (t = +t, e = +e, n = +n, !(n > 0)) return [];
	if (e === t) return [e];
	let r = t < e, [i, a, o] = r ? Em(t, e, n) : Em(e, t, n);
	if (!(a >= i)) return [];
	let s = a - i + 1, c = Array(s);
	if (r) if (o < 0) for (let e = 0; e < s; ++e) c[e] = (a - e) / -o;
	else for (let e = 0; e < s; ++e) c[e] = (a - e) * o;
	else if (o < 0) for (let e = 0; e < s; ++e) c[e] = (i + e) / -o;
	else for (let e = 0; e < s; ++e) c[e] = (i + e) * o;
	return c;
}
function Om(e, t, n) {
	return t = +t, e = +e, n = +n, Em(e, t, n)[2];
}
function km(e, t, n) {
	t = +t, e = +e, n = +n;
	let r = t < e, i = r ? Om(t, e, n) : Om(e, t, n);
	return (r ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
//#endregion
//#region node_modules/d3-array/src/max.js
function Am(e, t) {
	let n;
	if (t === void 0) for (let t of e) t != null && (n < t || n === void 0 && t >= t) && (n = t);
	else {
		let r = -1;
		for (let i of e) (i = t(i, ++r, e)) != null && (n < i || n === void 0 && i >= i) && (n = i);
	}
	return n;
}
//#endregion
//#region node_modules/d3-array/src/min.js
function jm(e, t) {
	let n;
	if (t === void 0) for (let t of e) t != null && (n > t || n === void 0 && t >= t) && (n = t);
	else {
		let r = -1;
		for (let i of e) (i = t(i, ++r, e)) != null && (n > i || n === void 0 && i >= i) && (n = i);
	}
	return n;
}
//#endregion
//#region node_modules/d3-array/src/quickselect.js
function Mm(e, t, n = 0, r = Infinity, i) {
	if (t = Math.floor(t), n = Math.floor(Math.max(0, n)), r = Math.floor(Math.min(e.length - 1, r)), !(n <= t && t <= r)) return e;
	for (i = i === void 0 ? Sm : xm(i); r > n;) {
		if (r - n > 600) {
			let a = r - n + 1, o = t - n + 1, s = Math.log(a), c = .5 * Math.exp(2 * s / 3), l = .5 * Math.sqrt(s * c * (a - c) / a) * (o - a / 2 < 0 ? -1 : 1), u = Math.max(n, Math.floor(t - o * c / a + l)), d = Math.min(r, Math.floor(t + (a - o) * c / a + l));
			Mm(e, t, u, d, i);
		}
		let a = e[t], o = n, s = r;
		for (Nm(e, n, t), i(e[r], a) > 0 && Nm(e, n, r); o < s;) {
			for (Nm(e, o, s), ++o, --s; i(e[o], a) < 0;) ++o;
			for (; i(e[s], a) > 0;) --s;
		}
		i(e[n], a) === 0 ? Nm(e, n, s) : (++s, Nm(e, s, r)), s <= t && (n = s + 1), t <= s && (r = s - 1);
	}
	return e;
}
function Nm(e, t, n) {
	let r = e[t];
	e[t] = e[n], e[n] = r;
}
//#endregion
//#region node_modules/d3-array/src/quantile.js
function Pm(e, t, n) {
	if (e = Float64Array.from(pm(e, n)), !(!(r = e.length) || isNaN(t = +t))) {
		if (t <= 0 || r < 2) return jm(e);
		if (t >= 1) return Am(e);
		var r, i = (r - 1) * t, a = Math.floor(i), o = Am(Mm(e, a).subarray(0, a + 1));
		return o + (jm(e.subarray(a + 1)) - o) * (i - a);
	}
}
function Fm(e, t, n = fm) {
	if (!(!(r = e.length) || isNaN(t = +t))) {
		if (t <= 0 || r < 2) return +n(e[0], 0, e);
		if (t >= 1) return +n(e[r - 1], r - 1, e);
		var r, i = (r - 1) * t, a = Math.floor(i), o = +n(e[a], a, e);
		return o + (+n(e[a + 1], a + 1, e) - o) * (i - a);
	}
}
//#endregion
//#region node_modules/d3-array/src/range.js
function Im(e, t, n) {
	e = +e, t = +t, n = (i = arguments.length) < 2 ? (t = e, e = 0, 1) : i < 3 ? 1 : +n;
	for (var r = -1, i = Math.max(0, Math.ceil((t - e) / n)) | 0, a = Array(i); ++r < i;) a[r] = e + r * n;
	return a;
}
//#endregion
//#region node_modules/d3-scale/src/init.js
function Lm(e, t) {
	switch (arguments.length) {
		case 0: break;
		case 1:
			this.range(e);
			break;
		default:
			this.range(t).domain(e);
			break;
	}
	return this;
}
function Rm(e, t) {
	switch (arguments.length) {
		case 0: break;
		case 1:
			typeof e == "function" ? this.interpolator(e) : this.range(e);
			break;
		default:
			this.domain(e), typeof t == "function" ? this.interpolator(t) : this.range(t);
			break;
	}
	return this;
}
//#endregion
//#region node_modules/d3-scale/src/ordinal.js
var zm = Symbol("implicit");
function Bm() {
	var e = new gm(), t = [], n = [], r = zm;
	function i(i) {
		let a = e.get(i);
		if (a === void 0) {
			if (r !== zm) return r;
			e.set(i, a = t.push(i) - 1);
		}
		return n[a % n.length];
	}
	return i.domain = function(n) {
		if (!arguments.length) return t.slice();
		t = [], e = new gm();
		for (let r of n) e.has(r) || e.set(r, t.push(r) - 1);
		return i;
	}, i.range = function(e) {
		return arguments.length ? (n = Array.from(e), i) : n.slice();
	}, i.unknown = function(e) {
		return arguments.length ? (r = e, i) : r;
	}, i.copy = function() {
		return Bm(t, n).unknown(r);
	}, Lm.apply(i, arguments), i;
}
//#endregion
//#region node_modules/d3-scale/src/band.js
function Vm() {
	var e = Bm().unknown(void 0), t = e.domain, n = e.range, r = 0, i = 1, a, o, s = !1, c = 0, l = 0, u = .5;
	delete e.unknown;
	function d() {
		var e = t().length, d = i < r, f = d ? i : r, p = d ? r : i;
		a = (p - f) / Math.max(1, e - c + l * 2), s && (a = Math.floor(a)), f += (p - f - a * (e - c)) * u, o = a * (1 - c), s && (f = Math.round(f), o = Math.round(o));
		var m = Im(e).map(function(e) {
			return f + a * e;
		});
		return n(d ? m.reverse() : m);
	}
	return e.domain = function(e) {
		return arguments.length ? (t(e), d()) : t();
	}, e.range = function(e) {
		return arguments.length ? ([r, i] = e, r = +r, i = +i, d()) : [r, i];
	}, e.rangeRound = function(e) {
		return [r, i] = e, r = +r, i = +i, s = !0, d();
	}, e.bandwidth = function() {
		return o;
	}, e.step = function() {
		return a;
	}, e.round = function(e) {
		return arguments.length ? (s = !!e, d()) : s;
	}, e.padding = function(e) {
		return arguments.length ? (c = Math.min(1, l = +e), d()) : c;
	}, e.paddingInner = function(e) {
		return arguments.length ? (c = Math.min(1, e), d()) : c;
	}, e.paddingOuter = function(e) {
		return arguments.length ? (l = +e, d()) : l;
	}, e.align = function(e) {
		return arguments.length ? (u = Math.max(0, Math.min(1, e)), d()) : u;
	}, e.copy = function() {
		return Vm(t(), [r, i]).round(s).paddingInner(c).paddingOuter(l).align(u);
	}, Lm.apply(d(), arguments);
}
function Hm(e) {
	var t = e.copy;
	return e.padding = e.paddingOuter, delete e.paddingInner, delete e.paddingOuter, e.copy = function() {
		return Hm(t());
	}, e;
}
function Um() {
	return Hm(Vm.apply(null, arguments).paddingInner(1));
}
//#endregion
//#region node_modules/d3-color/src/define.js
function Wm(e, t, n) {
	e.prototype = t.prototype = n, n.constructor = e;
}
function Gm(e, t) {
	var n = Object.create(e.prototype);
	for (var r in t) n[r] = t[r];
	return n;
}
//#endregion
//#region node_modules/d3-color/src/color.js
function Km() {}
var qm = .7, Jm = 1 / qm, Ym = "\\s*([+-]?\\d+)\\s*", Xm = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Zm = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Qm = /^#([0-9a-f]{3,8})$/, $m = RegExp(`^rgb\\(${Ym},${Ym},${Ym}\\)$`), eh = RegExp(`^rgb\\(${Zm},${Zm},${Zm}\\)$`), th = RegExp(`^rgba\\(${Ym},${Ym},${Ym},${Xm}\\)$`), nh = RegExp(`^rgba\\(${Zm},${Zm},${Zm},${Xm}\\)$`), rh = RegExp(`^hsl\\(${Xm},${Zm},${Zm}\\)$`), ih = RegExp(`^hsla\\(${Xm},${Zm},${Zm},${Xm}\\)$`), ah = {
	aliceblue: 15792383,
	antiquewhite: 16444375,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 15794175,
	beige: 16119260,
	bisque: 16770244,
	black: 0,
	blanchedalmond: 16772045,
	blue: 255,
	blueviolet: 9055202,
	brown: 10824234,
	burlywood: 14596231,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 13789470,
	coral: 16744272,
	cornflowerblue: 6591981,
	cornsilk: 16775388,
	crimson: 14423100,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 12092939,
	darkgray: 11119017,
	darkgreen: 25600,
	darkgrey: 11119017,
	darkkhaki: 12433259,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 16747520,
	darkorchid: 10040012,
	darkred: 9109504,
	darksalmon: 15308410,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 16716947,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 11674146,
	floralwhite: 16775920,
	forestgreen: 2263842,
	fuchsia: 16711935,
	gainsboro: 14474460,
	ghostwhite: 16316671,
	gold: 16766720,
	goldenrod: 14329120,
	gray: 8421504,
	green: 32768,
	greenyellow: 11403055,
	grey: 8421504,
	honeydew: 15794160,
	hotpink: 16738740,
	indianred: 13458524,
	indigo: 4915330,
	ivory: 16777200,
	khaki: 15787660,
	lavender: 15132410,
	lavenderblush: 16773365,
	lawngreen: 8190976,
	lemonchiffon: 16775885,
	lightblue: 11393254,
	lightcoral: 15761536,
	lightcyan: 14745599,
	lightgoldenrodyellow: 16448210,
	lightgray: 13882323,
	lightgreen: 9498256,
	lightgrey: 13882323,
	lightpink: 16758465,
	lightsalmon: 16752762,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 11584734,
	lightyellow: 16777184,
	lime: 65280,
	limegreen: 3329330,
	linen: 16445670,
	magenta: 16711935,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 12211667,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 13047173,
	midnightblue: 1644912,
	mintcream: 16121850,
	mistyrose: 16770273,
	moccasin: 16770229,
	navajowhite: 16768685,
	navy: 128,
	oldlace: 16643558,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 16753920,
	orangered: 16729344,
	orchid: 14315734,
	palegoldenrod: 15657130,
	palegreen: 10025880,
	paleturquoise: 11529966,
	palevioletred: 14381203,
	papayawhip: 16773077,
	peachpuff: 16767673,
	peru: 13468991,
	pink: 16761035,
	plum: 14524637,
	powderblue: 11591910,
	purple: 8388736,
	rebeccapurple: 6697881,
	red: 16711680,
	rosybrown: 12357519,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 16416882,
	sandybrown: 16032864,
	seagreen: 3050327,
	seashell: 16774638,
	sienna: 10506797,
	silver: 12632256,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 16775930,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 13808780,
	teal: 32896,
	thistle: 14204888,
	tomato: 16737095,
	turquoise: 4251856,
	violet: 15631086,
	wheat: 16113331,
	white: 16777215,
	whitesmoke: 16119285,
	yellow: 16776960,
	yellowgreen: 10145074
};
Wm(Km, uh, {
	copy(e) {
		return Object.assign(new this.constructor(), this, e);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: oh,
	formatHex: oh,
	formatHex8: sh,
	formatHsl: ch,
	formatRgb: lh,
	toString: lh
});
function oh() {
	return this.rgb().formatHex();
}
function sh() {
	return this.rgb().formatHex8();
}
function ch() {
	return Ch(this).formatHsl();
}
function lh() {
	return this.rgb().formatRgb();
}
function uh(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = Qm.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? dh(t) : n === 3 ? new hh(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? fh(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? fh(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = $m.exec(e)) ? new hh(t[1], t[2], t[3], 1) : (t = eh.exec(e)) ? new hh(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = th.exec(e)) ? fh(t[1], t[2], t[3], t[4]) : (t = nh.exec(e)) ? fh(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = rh.exec(e)) ? Sh(t[1], t[2] / 100, t[3] / 100, 1) : (t = ih.exec(e)) ? Sh(t[1], t[2] / 100, t[3] / 100, t[4]) : ah.hasOwnProperty(e) ? dh(ah[e]) : e === "transparent" ? new hh(NaN, NaN, NaN, 0) : null;
}
function dh(e) {
	return new hh(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function fh(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new hh(e, t, n, r);
}
function ph(e) {
	return e instanceof Km || (e = uh(e)), e ? (e = e.rgb(), new hh(e.r, e.g, e.b, e.opacity)) : new hh();
}
function mh(e, t, n, r) {
	return arguments.length === 1 ? ph(e) : new hh(e, t, n, r ?? 1);
}
function hh(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
Wm(hh, mh, Gm(Km, {
	brighter(e) {
		return e = e == null ? Jm : Jm ** +e, new hh(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? qm : qm ** +e, new hh(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new hh(bh(this.r), bh(this.g), bh(this.b), yh(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: gh,
	formatHex: gh,
	formatHex8: _h,
	formatRgb: vh,
	toString: vh
}));
function gh() {
	return `#${xh(this.r)}${xh(this.g)}${xh(this.b)}`;
}
function _h() {
	return `#${xh(this.r)}${xh(this.g)}${xh(this.b)}${xh((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function vh() {
	let e = yh(this.opacity);
	return `${e === 1 ? "rgb(" : "rgba("}${bh(this.r)}, ${bh(this.g)}, ${bh(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function yh(e) {
	return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function bh(e) {
	return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function xh(e) {
	return e = bh(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Sh(e, t, n, r) {
	return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Th(e, t, n, r);
}
function Ch(e) {
	if (e instanceof Th) return new Th(e.h, e.s, e.l, e.opacity);
	if (e instanceof Km || (e = uh(e)), !e) return new Th();
	if (e instanceof Th) return e;
	e = e.rgb();
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), a = Math.max(t, n, r), o = NaN, s = a - i, c = (a + i) / 2;
	return s ? (o = t === a ? (n - r) / s + (n < r) * 6 : n === a ? (r - t) / s + 2 : (t - n) / s + 4, s /= c < .5 ? a + i : 2 - a - i, o *= 60) : s = c > 0 && c < 1 ? 0 : o, new Th(o, s, c, e.opacity);
}
function wh(e, t, n, r) {
	return arguments.length === 1 ? Ch(e) : new Th(e, t, n, r ?? 1);
}
function Th(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Wm(Th, wh, Gm(Km, {
	brighter(e) {
		return e = e == null ? Jm : Jm ** +e, new Th(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? qm : qm ** +e, new Th(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new hh(Oh(e >= 240 ? e - 240 : e + 120, i, r), Oh(e, i, r), Oh(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
	},
	clamp() {
		return new Th(Eh(this.h), Dh(this.s), Dh(this.l), yh(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		let e = yh(this.opacity);
		return `${e === 1 ? "hsl(" : "hsla("}${Eh(this.h)}, ${Dh(this.s) * 100}%, ${Dh(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
	}
}));
function Eh(e) {
	return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Dh(e) {
	return Math.max(0, Math.min(1, e || 0));
}
function Oh(e, t, n) {
	return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
//#endregion
//#region node_modules/d3-interpolate/src/constant.js
var kh = (e) => () => e;
//#endregion
//#region node_modules/d3-interpolate/src/color.js
function Ah(e, t) {
	return function(n) {
		return e + n * t;
	};
}
function jh(e, t, n) {
	return e **= +n, t = t ** +n - e, n = 1 / n, function(r) {
		return (e + r * t) ** +n;
	};
}
function Mh(e) {
	return (e = +e) == 1 ? Nh : function(t, n) {
		return n - t ? jh(t, n, e) : kh(isNaN(t) ? n : t);
	};
}
function Nh(e, t) {
	var n = t - e;
	return n ? Ah(e, n) : kh(isNaN(e) ? t : e);
}
//#endregion
//#region node_modules/d3-interpolate/src/rgb.js
var Ph = (function e(t) {
	var n = Mh(t);
	function r(e, t) {
		var r = n((e = mh(e)).r, (t = mh(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = Nh(e.opacity, t.opacity);
		return function(t) {
			return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + "";
		};
	}
	return r.gamma = e, r;
})(1);
//#endregion
//#region node_modules/d3-interpolate/src/numberArray.js
function Fh(e, t) {
	t ||= [];
	var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
	return function(a) {
		for (i = 0; i < n; ++i) r[i] = e[i] * (1 - a) + t[i] * a;
		return r;
	};
}
function Ih(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
//#endregion
//#region node_modules/d3-interpolate/src/array.js
function Lh(e, t) {
	var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, i = Array(r), a = Array(n), o;
	for (o = 0; o < r; ++o) i[o] = Kh(e[o], t[o]);
	for (; o < n; ++o) a[o] = t[o];
	return function(e) {
		for (o = 0; o < r; ++o) a[o] = i[o](e);
		return a;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/date.js
function Rh(e, t) {
	var n = /* @__PURE__ */ new Date();
	return e = +e, t = +t, function(r) {
		return n.setTime(e * (1 - r) + t * r), n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/number.js
function zh(e, t) {
	return e = +e, t = +t, function(n) {
		return e * (1 - n) + t * n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/object.js
function Bh(e, t) {
	var n = {}, r = {}, i;
	for (i in (typeof e != "object" || !e) && (e = {}), (typeof t != "object" || !t) && (t = {}), t) i in e ? n[i] = Kh(e[i], t[i]) : r[i] = t[i];
	return function(e) {
		for (i in n) r[i] = n[i](e);
		return r;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/string.js
var Vh = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Hh = new RegExp(Vh.source, "g");
function Uh(e) {
	return function() {
		return e;
	};
}
function Wh(e) {
	return function(t) {
		return e(t) + "";
	};
}
function Gh(e, t) {
	var n = Vh.lastIndex = Hh.lastIndex = 0, r, i, a, o = -1, s = [], c = [];
	for (e += "", t += ""; (r = Vh.exec(e)) && (i = Hh.exec(t));) (a = i.index) > n && (a = t.slice(n, a), s[o] ? s[o] += a : s[++o] = a), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, c.push({
		i: o,
		x: zh(r, i)
	})), n = Hh.lastIndex;
	return n < t.length && (a = t.slice(n), s[o] ? s[o] += a : s[++o] = a), s.length < 2 ? c[0] ? Wh(c[0].x) : Uh(t) : (t = c.length, function(e) {
		for (var n = 0, r; n < t; ++n) s[(r = c[n]).i] = r.x(e);
		return s.join("");
	});
}
//#endregion
//#region node_modules/d3-interpolate/src/value.js
function Kh(e, t) {
	var n = typeof t, r;
	return t == null || n === "boolean" ? kh(t) : (n === "number" ? zh : n === "string" ? (r = uh(t)) ? (t = r, Ph) : Gh : t instanceof uh ? Ph : t instanceof Date ? Rh : Ih(t) ? Fh : Array.isArray(t) ? Lh : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Bh : zh)(e, t);
}
//#endregion
//#region node_modules/d3-interpolate/src/round.js
function qh(e, t) {
	return e = +e, t = +t, function(n) {
		return Math.round(e * (1 - n) + t * n);
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/piecewise.js
function Jh(e, t) {
	t === void 0 && (t = e, e = Kh);
	for (var n = 0, r = t.length - 1, i = t[0], a = Array(r < 0 ? 0 : r); n < r;) a[n] = e(i, i = t[++n]);
	return function(e) {
		var t = Math.max(0, Math.min(r - 1, Math.floor(e *= r)));
		return a[t](e - t);
	};
}
//#endregion
//#region node_modules/d3-scale/src/constant.js
function Yh(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-scale/src/number.js
function Xh(e) {
	return +e;
}
//#endregion
//#region node_modules/d3-scale/src/continuous.js
var Zh = [0, 1];
function Qh(e) {
	return e;
}
function $h(e, t) {
	return (t -= e = +e) ? function(n) {
		return (n - e) / t;
	} : Yh(isNaN(t) ? NaN : .5);
}
function eg(e, t) {
	var n;
	return e > t && (n = e, e = t, t = n), function(n) {
		return Math.max(e, Math.min(t, n));
	};
}
function tg(e, t, n) {
	var r = e[0], i = e[1], a = t[0], o = t[1];
	return i < r ? (r = $h(i, r), a = n(o, a)) : (r = $h(r, i), a = n(a, o)), function(e) {
		return a(r(e));
	};
}
function ng(e, t, n) {
	var r = Math.min(e.length, t.length) - 1, i = Array(r), a = Array(r), o = -1;
	for (e[r] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++o < r;) i[o] = $h(e[o], e[o + 1]), a[o] = n(t[o], t[o + 1]);
	return function(t) {
		var n = hm(e, t, 1, r) - 1;
		return a[n](i[n](t));
	};
}
function rg(e, t) {
	return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function ig() {
	var e = Zh, t = Zh, n = Kh, r, i, a, o = Qh, s, c, l;
	function u() {
		var n = Math.min(e.length, t.length);
		return o !== Qh && (o = eg(e[0], e[n - 1])), s = n > 2 ? ng : tg, c = l = null, d;
	}
	function d(i) {
		return i == null || isNaN(i = +i) ? a : (c ||= s(e.map(r), t, n))(r(o(i)));
	}
	return d.invert = function(n) {
		return o(i((l ||= s(t, e.map(r), zh))(n)));
	}, d.domain = function(t) {
		return arguments.length ? (e = Array.from(t, Xh), u()) : e.slice();
	}, d.range = function(e) {
		return arguments.length ? (t = Array.from(e), u()) : t.slice();
	}, d.rangeRound = function(e) {
		return t = Array.from(e), n = qh, u();
	}, d.clamp = function(e) {
		return arguments.length ? (o = e ? !0 : Qh, u()) : o !== Qh;
	}, d.interpolate = function(e) {
		return arguments.length ? (n = e, u()) : n;
	}, d.unknown = function(e) {
		return arguments.length ? (a = e, d) : a;
	}, function(e, t) {
		return r = e, i = t, u();
	};
}
function ag() {
	return ig()(Qh, Qh);
}
//#endregion
//#region node_modules/d3-format/src/formatDecimal.js
function og(e) {
	return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function sg(e, t) {
	if (!isFinite(e) || e === 0) return null;
	var n = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e"), r = e.slice(0, n);
	return [r.length > 1 ? r[0] + r.slice(2) : r, +e.slice(n + 1)];
}
//#endregion
//#region node_modules/d3-format/src/exponent.js
function cg(e) {
	return e = sg(Math.abs(e)), e ? e[1] : NaN;
}
//#endregion
//#region node_modules/d3-format/src/formatGroup.js
function lg(e, t) {
	return function(n, r) {
		for (var i = n.length, a = [], o = 0, s = e[0], c = 0; i > 0 && s > 0 && (c + s + 1 > r && (s = Math.max(1, r - c)), a.push(n.substring(i -= s, i + s)), !((c += s + 1) > r));) s = e[o = (o + 1) % e.length];
		return a.reverse().join(t);
	};
}
//#endregion
//#region node_modules/d3-format/src/formatNumerals.js
function ug(e) {
	return function(t) {
		return t.replace(/[0-9]/g, function(t) {
			return e[+t];
		});
	};
}
//#endregion
//#region node_modules/d3-format/src/formatSpecifier.js
var dg = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function fg(e) {
	if (!(t = dg.exec(e))) throw Error("invalid format: " + e);
	var t;
	return new pg({
		fill: t[1],
		align: t[2],
		sign: t[3],
		symbol: t[4],
		zero: t[5],
		width: t[6],
		comma: t[7],
		precision: t[8] && t[8].slice(1),
		trim: t[9],
		type: t[10]
	});
}
fg.prototype = pg.prototype;
function pg(e) {
	this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
pg.prototype.toString = function() {
	return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
//#endregion
//#region node_modules/d3-format/src/formatTrim.js
function mg(e) {
	out: for (var t = e.length, n = 1, r = -1, i; n < t; ++n) switch (e[n]) {
		case ".":
			r = i = n;
			break;
		case "0":
			r === 0 && (r = n), i = n;
			break;
		default:
			if (!+e[n]) break out;
			r > 0 && (r = 0);
			break;
	}
	return r > 0 ? e.slice(0, r) + e.slice(i + 1) : e;
}
//#endregion
//#region node_modules/d3-format/src/formatPrefixAuto.js
var hg;
function gg(e, t) {
	var n = sg(e, t);
	if (!n) return hg = void 0, e.toPrecision(t);
	var r = n[0], i = n[1], a = i - (hg = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, o = r.length;
	return a === o ? r : a > o ? r + Array(a - o + 1).join("0") : a > 0 ? r.slice(0, a) + "." + r.slice(a) : "0." + Array(1 - a).join("0") + sg(e, Math.max(0, t + a - 1))[0];
}
//#endregion
//#region node_modules/d3-format/src/formatRounded.js
function _g(e, t) {
	var n = sg(e, t);
	if (!n) return e + "";
	var r = n[0], i = n[1];
	return i < 0 ? "0." + Array(-i).join("0") + r : r.length > i + 1 ? r.slice(0, i + 1) + "." + r.slice(i + 1) : r + Array(i - r.length + 2).join("0");
}
//#endregion
//#region node_modules/d3-format/src/formatTypes.js
var vg = {
	"%": (e, t) => (e * 100).toFixed(t),
	b: (e) => Math.round(e).toString(2),
	c: (e) => e + "",
	d: og,
	e: (e, t) => e.toExponential(t),
	f: (e, t) => e.toFixed(t),
	g: (e, t) => e.toPrecision(t),
	o: (e) => Math.round(e).toString(8),
	p: (e, t) => _g(e * 100, t),
	r: _g,
	s: gg,
	X: (e) => Math.round(e).toString(16).toUpperCase(),
	x: (e) => Math.round(e).toString(16)
};
//#endregion
//#region node_modules/d3-format/src/identity.js
function yg(e) {
	return e;
}
//#endregion
//#region node_modules/d3-format/src/locale.js
var bg = Array.prototype.map, xg = [
	"y",
	"z",
	"a",
	"f",
	"p",
	"n",
	"µ",
	"m",
	"",
	"k",
	"M",
	"G",
	"T",
	"P",
	"E",
	"Z",
	"Y"
];
function Sg(e) {
	var t = e.grouping === void 0 || e.thousands === void 0 ? yg : lg(bg.call(e.grouping, Number), e.thousands + ""), n = e.currency === void 0 ? "" : e.currency[0] + "", r = e.currency === void 0 ? "" : e.currency[1] + "", i = e.decimal === void 0 ? "." : e.decimal + "", a = e.numerals === void 0 ? yg : ug(bg.call(e.numerals, String)), o = e.percent === void 0 ? "%" : e.percent + "", s = e.minus === void 0 ? "−" : e.minus + "", c = e.nan === void 0 ? "NaN" : e.nan + "";
	function l(e, l) {
		e = fg(e);
		var u = e.fill, d = e.align, f = e.sign, p = e.symbol, m = e.zero, h = e.width, g = e.comma, _ = e.precision, v = e.trim, y = e.type;
		y === "n" ? (g = !0, y = "g") : vg[y] || (_ === void 0 && (_ = 12), v = !0, y = "g"), (m || u === "0" && d === "=") && (m = !0, u = "0", d = "=");
		var b = (l && l.prefix !== void 0 ? l.prefix : "") + (p === "$" ? n : p === "#" && /[boxX]/.test(y) ? "0" + y.toLowerCase() : ""), x = (p === "$" ? r : /[%p]/.test(y) ? o : "") + (l && l.suffix !== void 0 ? l.suffix : ""), S = vg[y], C = /[defgprs%]/.test(y);
		_ = _ === void 0 ? 6 : /[gprs]/.test(y) ? Math.max(1, Math.min(21, _)) : Math.max(0, Math.min(20, _));
		function w(e) {
			var n = b, r = x, o, l, p;
			if (y === "c") r = S(e) + r, e = "";
			else {
				e = +e;
				var w = e < 0 || 1 / e < 0;
				if (e = isNaN(e) ? c : S(Math.abs(e), _), v && (e = mg(e)), w && +e == 0 && f !== "+" && (w = !1), n = (w ? f === "(" ? f : s : f === "-" || f === "(" ? "" : f) + n, r = (y === "s" && !isNaN(e) && hg !== void 0 ? xg[8 + hg / 3] : "") + r + (w && f === "(" ? ")" : ""), C) {
					for (o = -1, l = e.length; ++o < l;) if (p = e.charCodeAt(o), 48 > p || p > 57) {
						r = (p === 46 ? i + e.slice(o + 1) : e.slice(o)) + r, e = e.slice(0, o);
						break;
					}
				}
			}
			g && !m && (e = t(e, Infinity));
			var T = n.length + e.length + r.length, E = T < h ? Array(h - T + 1).join(u) : "";
			switch (g && m && (e = t(E + e, E.length ? h - r.length : Infinity), E = ""), d) {
				case "<":
					e = n + e + r + E;
					break;
				case "=":
					e = n + E + e + r;
					break;
				case "^":
					e = E.slice(0, T = E.length >> 1) + n + e + r + E.slice(T);
					break;
				default:
					e = E + n + e + r;
					break;
			}
			return a(e);
		}
		return w.toString = function() {
			return e + "";
		}, w;
	}
	function u(e, t) {
		var n = Math.max(-8, Math.min(8, Math.floor(cg(t) / 3))) * 3, r = 10 ** -n, i = l((e = fg(e), e.type = "f", e), { suffix: xg[8 + n / 3] });
		return function(e) {
			return i(r * e);
		};
	}
	return {
		format: l,
		formatPrefix: u
	};
}
//#endregion
//#region node_modules/d3-format/src/defaultLocale.js
var Cg, wg, Tg;
Eg({
	thousands: ",",
	grouping: [3],
	currency: ["$", ""]
});
function Eg(e) {
	return Cg = Sg(e), wg = Cg.format, Tg = Cg.formatPrefix, Cg;
}
//#endregion
//#region node_modules/d3-format/src/precisionFixed.js
function Dg(e) {
	return Math.max(0, -cg(Math.abs(e)));
}
//#endregion
//#region node_modules/d3-format/src/precisionPrefix.js
function Og(e, t) {
	return Math.max(0, Math.max(-8, Math.min(8, Math.floor(cg(t) / 3))) * 3 - cg(Math.abs(e)));
}
//#endregion
//#region node_modules/d3-format/src/precisionRound.js
function kg(e, t) {
	return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, cg(t) - cg(e)) + 1;
}
//#endregion
//#region node_modules/d3-scale/src/tickFormat.js
function Ag(e, t, n, r) {
	var i = km(e, t, n), a;
	switch (r = fg(r ?? ",f"), r.type) {
		case "s":
			var o = Math.max(Math.abs(e), Math.abs(t));
			return r.precision == null && !isNaN(a = Og(i, o)) && (r.precision = a), Tg(r, o);
		case "":
		case "e":
		case "g":
		case "p":
		case "r":
			r.precision == null && !isNaN(a = kg(i, Math.max(Math.abs(e), Math.abs(t)))) && (r.precision = a - (r.type === "e"));
			break;
		case "f":
		case "%":
			r.precision == null && !isNaN(a = Dg(i)) && (r.precision = a - (r.type === "%") * 2);
			break;
	}
	return wg(r);
}
//#endregion
//#region node_modules/d3-scale/src/linear.js
function jg(e) {
	var t = e.domain;
	return e.ticks = function(e) {
		var n = t();
		return Dm(n[0], n[n.length - 1], e ?? 10);
	}, e.tickFormat = function(e, n) {
		var r = t();
		return Ag(r[0], r[r.length - 1], e ?? 10, n);
	}, e.nice = function(n) {
		n ??= 10;
		var r = t(), i = 0, a = r.length - 1, o = r[i], s = r[a], c, l, u = 10;
		for (s < o && (l = o, o = s, s = l, l = i, i = a, a = l); u-- > 0;) {
			if (l = Om(o, s, n), l === c) return r[i] = o, r[a] = s, t(r);
			if (l > 0) o = Math.floor(o / l) * l, s = Math.ceil(s / l) * l;
			else if (l < 0) o = Math.ceil(o * l) / l, s = Math.floor(s * l) / l;
			else break;
			c = l;
		}
		return e;
	}, e;
}
function Mg() {
	var e = ag();
	return e.copy = function() {
		return rg(e, Mg());
	}, Lm.apply(e, arguments), jg(e);
}
//#endregion
//#region node_modules/d3-scale/src/identity.js
function Ng(e) {
	var t;
	function n(e) {
		return e == null || isNaN(e = +e) ? t : e;
	}
	return n.invert = n, n.domain = n.range = function(t) {
		return arguments.length ? (e = Array.from(t, Xh), n) : e.slice();
	}, n.unknown = function(e) {
		return arguments.length ? (t = e, n) : t;
	}, n.copy = function() {
		return Ng(e).unknown(t);
	}, e = arguments.length ? Array.from(e, Xh) : [0, 1], jg(n);
}
//#endregion
//#region node_modules/d3-scale/src/nice.js
function Pg(e, t) {
	e = e.slice();
	var n = 0, r = e.length - 1, i = e[n], a = e[r], o;
	return a < i && (o = n, n = r, r = o, o = i, i = a, a = o), e[n] = t.floor(i), e[r] = t.ceil(a), e;
}
//#endregion
//#region node_modules/d3-scale/src/log.js
function Fg(e) {
	return Math.log(e);
}
function Ig(e) {
	return Math.exp(e);
}
function Lg(e) {
	return -Math.log(-e);
}
function Rg(e) {
	return -Math.exp(-e);
}
function zg(e) {
	return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
}
function Bg(e) {
	return e === 10 ? zg : e === Math.E ? Math.exp : (t) => e ** +t;
}
function Vg(e) {
	return e === Math.E ? Math.log : e === 10 && Math.log10 || e === 2 && Math.log2 || (e = Math.log(e), (t) => Math.log(t) / e);
}
function Hg(e) {
	return (t, n) => -e(-t, n);
}
function Ug(e) {
	let t = e(Fg, Ig), n = t.domain, r = 10, i, a;
	function o() {
		return i = Vg(r), a = Bg(r), n()[0] < 0 ? (i = Hg(i), a = Hg(a), e(Lg, Rg)) : e(Fg, Ig), t;
	}
	return t.base = function(e) {
		return arguments.length ? (r = +e, o()) : r;
	}, t.domain = function(e) {
		return arguments.length ? (n(e), o()) : n();
	}, t.ticks = (e) => {
		let t = n(), o = t[0], s = t[t.length - 1], c = s < o;
		c && ([o, s] = [s, o]);
		let l = i(o), u = i(s), d, f, p = e == null ? 10 : +e, m = [];
		if (!(r % 1) && u - l < p) {
			if (l = Math.floor(l), u = Math.ceil(u), o > 0) {
				for (; l <= u; ++l) for (d = 1; d < r; ++d) if (f = l < 0 ? d / a(-l) : d * a(l), !(f < o)) {
					if (f > s) break;
					m.push(f);
				}
			} else for (; l <= u; ++l) for (d = r - 1; d >= 1; --d) if (f = l > 0 ? d / a(-l) : d * a(l), !(f < o)) {
				if (f > s) break;
				m.push(f);
			}
			m.length * 2 < p && (m = Dm(o, s, p));
		} else m = Dm(l, u, Math.min(u - l, p)).map(a);
		return c ? m.reverse() : m;
	}, t.tickFormat = (e, n) => {
		if (e ??= 10, n ??= r === 10 ? "s" : ",", typeof n != "function" && (!(r % 1) && (n = fg(n)).precision == null && (n.trim = !0), n = wg(n)), e === Infinity) return n;
		let o = Math.max(1, r * e / t.ticks().length);
		return (e) => {
			let t = e / a(Math.round(i(e)));
			return t * r < r - .5 && (t *= r), t <= o ? n(e) : "";
		};
	}, t.nice = () => n(Pg(n(), {
		floor: (e) => a(Math.floor(i(e))),
		ceil: (e) => a(Math.ceil(i(e)))
	})), t;
}
function Wg() {
	let e = Ug(ig()).domain([1, 10]);
	return e.copy = () => rg(e, Wg()).base(e.base()), Lm.apply(e, arguments), e;
}
//#endregion
//#region node_modules/d3-scale/src/symlog.js
function Gg(e) {
	return function(t) {
		return Math.sign(t) * Math.log1p(Math.abs(t / e));
	};
}
function Kg(e) {
	return function(t) {
		return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
	};
}
function qg(e) {
	var t = 1, n = e(Gg(t), Kg(t));
	return n.constant = function(n) {
		return arguments.length ? e(Gg(t = +n), Kg(t)) : t;
	}, jg(n);
}
function Jg() {
	var e = qg(ig());
	return e.copy = function() {
		return rg(e, Jg()).constant(e.constant());
	}, Lm.apply(e, arguments);
}
//#endregion
//#region node_modules/d3-scale/src/pow.js
function Yg(e) {
	return function(t) {
		return t < 0 ? -((-t) ** +e) : t ** +e;
	};
}
function Xg(e) {
	return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
}
function Zg(e) {
	return e < 0 ? -e * e : e * e;
}
function Qg(e) {
	var t = e(Qh, Qh), n = 1;
	function r() {
		return n === 1 ? e(Qh, Qh) : n === .5 ? e(Xg, Zg) : e(Yg(n), Yg(1 / n));
	}
	return t.exponent = function(e) {
		return arguments.length ? (n = +e, r()) : n;
	}, jg(t);
}
function $g() {
	var e = Qg(ig());
	return e.copy = function() {
		return rg(e, $g()).exponent(e.exponent());
	}, Lm.apply(e, arguments), e;
}
function e_() {
	return $g.apply(null, arguments).exponent(.5);
}
//#endregion
//#region node_modules/d3-scale/src/radial.js
function t_(e) {
	return Math.sign(e) * e * e;
}
function n_(e) {
	return Math.sign(e) * Math.sqrt(Math.abs(e));
}
function r_() {
	var e = ag(), t = [0, 1], n = !1, r;
	function i(t) {
		var i = n_(e(t));
		return isNaN(i) ? r : n ? Math.round(i) : i;
	}
	return i.invert = function(t) {
		return e.invert(t_(t));
	}, i.domain = function(t) {
		return arguments.length ? (e.domain(t), i) : e.domain();
	}, i.range = function(n) {
		return arguments.length ? (e.range((t = Array.from(n, Xh)).map(t_)), i) : t.slice();
	}, i.rangeRound = function(e) {
		return i.range(e).round(!0);
	}, i.round = function(e) {
		return arguments.length ? (n = !!e, i) : n;
	}, i.clamp = function(t) {
		return arguments.length ? (e.clamp(t), i) : e.clamp();
	}, i.unknown = function(e) {
		return arguments.length ? (r = e, i) : r;
	}, i.copy = function() {
		return r_(e.domain(), t).round(n).clamp(e.clamp()).unknown(r);
	}, Lm.apply(i, arguments), jg(i);
}
//#endregion
//#region node_modules/d3-scale/src/quantile.js
function i_() {
	var e = [], t = [], n = [], r;
	function i() {
		var r = 0, i = Math.max(1, t.length);
		for (n = Array(i - 1); ++r < i;) n[r - 1] = Fm(e, r / i);
		return a;
	}
	function a(e) {
		return e == null || isNaN(e = +e) ? r : t[hm(n, e)];
	}
	return a.invertExtent = function(r) {
		var i = t.indexOf(r);
		return i < 0 ? [NaN, NaN] : [i > 0 ? n[i - 1] : e[0], i < n.length ? n[i] : e[e.length - 1]];
	}, a.domain = function(t) {
		if (!arguments.length) return e.slice();
		e = [];
		for (let n of t) n != null && !isNaN(n = +n) && e.push(n);
		return e.sort(cm), i();
	}, a.range = function(e) {
		return arguments.length ? (t = Array.from(e), i()) : t.slice();
	}, a.unknown = function(e) {
		return arguments.length ? (r = e, a) : r;
	}, a.quantiles = function() {
		return n.slice();
	}, a.copy = function() {
		return i_().domain(e).range(t).unknown(r);
	}, Lm.apply(a, arguments);
}
//#endregion
//#region node_modules/d3-scale/src/quantize.js
function a_() {
	var e = 0, t = 1, n = 1, r = [.5], i = [0, 1], a;
	function o(e) {
		return e != null && e <= e ? i[hm(r, e, 0, n)] : a;
	}
	function s() {
		var i = -1;
		for (r = Array(n); ++i < n;) r[i] = ((i + 1) * t - (i - n) * e) / (n + 1);
		return o;
	}
	return o.domain = function(n) {
		return arguments.length ? ([e, t] = n, e = +e, t = +t, s()) : [e, t];
	}, o.range = function(e) {
		return arguments.length ? (n = (i = Array.from(e)).length - 1, s()) : i.slice();
	}, o.invertExtent = function(a) {
		var o = i.indexOf(a);
		return o < 0 ? [NaN, NaN] : o < 1 ? [e, r[0]] : o >= n ? [r[n - 1], t] : [r[o - 1], r[o]];
	}, o.unknown = function(e) {
		return arguments.length && (a = e), o;
	}, o.thresholds = function() {
		return r.slice();
	}, o.copy = function() {
		return a_().domain([e, t]).range(i).unknown(a);
	}, Lm.apply(jg(o), arguments);
}
//#endregion
//#region node_modules/d3-scale/src/threshold.js
function o_() {
	var e = [.5], t = [0, 1], n, r = 1;
	function i(i) {
		return i != null && i <= i ? t[hm(e, i, 0, r)] : n;
	}
	return i.domain = function(n) {
		return arguments.length ? (e = Array.from(n), r = Math.min(e.length, t.length - 1), i) : e.slice();
	}, i.range = function(n) {
		return arguments.length ? (t = Array.from(n), r = Math.min(e.length, t.length - 1), i) : t.slice();
	}, i.invertExtent = function(n) {
		var r = t.indexOf(n);
		return [e[r - 1], e[r]];
	}, i.unknown = function(e) {
		return arguments.length ? (n = e, i) : n;
	}, i.copy = function() {
		return o_().domain(e).range(t).unknown(n);
	}, Lm.apply(i, arguments);
}
//#endregion
//#region node_modules/d3-time/src/interval.js
var s_ = /* @__PURE__ */ new Date(), c_ = /* @__PURE__ */ new Date();
function l_(e, t, n, r) {
	function i(t) {
		return e(t = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+t)), t;
	}
	return i.floor = (t) => (e(t = /* @__PURE__ */ new Date(+t)), t), i.ceil = (n) => (e(n = /* @__PURE__ */ new Date(n - 1)), t(n, 1), e(n), n), i.round = (e) => {
		let t = i(e), n = i.ceil(e);
		return e - t < n - e ? t : n;
	}, i.offset = (e, n) => (t(e = /* @__PURE__ */ new Date(+e), n == null ? 1 : Math.floor(n)), e), i.range = (n, r, a) => {
		let o = [];
		if (n = i.ceil(n), a = a == null ? 1 : Math.floor(a), !(n < r) || !(a > 0)) return o;
		let s;
		do
			o.push(s = /* @__PURE__ */ new Date(+n)), t(n, a), e(n);
		while (s < n && n < r);
		return o;
	}, i.filter = (n) => l_((t) => {
		if (t >= t) for (; e(t), !n(t);) t.setTime(t - 1);
	}, (e, r) => {
		if (e >= e) if (r < 0) for (; ++r <= 0;) for (; t(e, -1), !n(e););
		else for (; --r >= 0;) for (; t(e, 1), !n(e););
	}), n && (i.count = (t, r) => (s_.setTime(+t), c_.setTime(+r), e(s_), e(c_), Math.floor(n(s_, c_))), i.every = (e) => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? i.filter(r ? (t) => r(t) % e === 0 : (t) => i.count(0, t) % e === 0) : i)), i;
}
//#endregion
//#region node_modules/d3-time/src/millisecond.js
var u_ = l_(() => {}, (e, t) => {
	e.setTime(+e + t);
}, (e, t) => t - e);
u_.every = (e) => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? l_((t) => {
	t.setTime(Math.floor(t / e) * e);
}, (t, n) => {
	t.setTime(+t + n * e);
}, (t, n) => (n - t) / e) : u_), u_.range;
//#endregion
//#region node_modules/d3-time/src/duration.js
var d_ = 1e3, f_ = d_ * 60, p_ = f_ * 60, m_ = p_ * 24, h_ = m_ * 7, g_ = m_ * 30, __ = m_ * 365, v_ = l_((e) => {
	e.setTime(e - e.getMilliseconds());
}, (e, t) => {
	e.setTime(+e + t * d_);
}, (e, t) => (t - e) / d_, (e) => e.getUTCSeconds());
v_.range;
//#endregion
//#region node_modules/d3-time/src/minute.js
var y_ = l_((e) => {
	e.setTime(e - e.getMilliseconds() - e.getSeconds() * d_);
}, (e, t) => {
	e.setTime(+e + t * f_);
}, (e, t) => (t - e) / f_, (e) => e.getMinutes());
y_.range;
var b_ = l_((e) => {
	e.setUTCSeconds(0, 0);
}, (e, t) => {
	e.setTime(+e + t * f_);
}, (e, t) => (t - e) / f_, (e) => e.getUTCMinutes());
b_.range;
//#endregion
//#region node_modules/d3-time/src/hour.js
var x_ = l_((e) => {
	e.setTime(e - e.getMilliseconds() - e.getSeconds() * d_ - e.getMinutes() * f_);
}, (e, t) => {
	e.setTime(+e + t * p_);
}, (e, t) => (t - e) / p_, (e) => e.getHours());
x_.range;
var S_ = l_((e) => {
	e.setUTCMinutes(0, 0, 0);
}, (e, t) => {
	e.setTime(+e + t * p_);
}, (e, t) => (t - e) / p_, (e) => e.getUTCHours());
S_.range;
//#endregion
//#region node_modules/d3-time/src/day.js
var C_ = l_((e) => e.setHours(0, 0, 0, 0), (e, t) => e.setDate(e.getDate() + t), (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * f_) / m_, (e) => e.getDate() - 1);
C_.range;
var w_ = l_((e) => {
	e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / m_, (e) => e.getUTCDate() - 1);
w_.range;
var T_ = l_((e) => {
	e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / m_, (e) => Math.floor(e / m_));
T_.range;
//#endregion
//#region node_modules/d3-time/src/week.js
function E_(e) {
	return l_((t) => {
		t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
	}, (e, t) => {
		e.setDate(e.getDate() + t * 7);
	}, (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * f_) / h_);
}
var D_ = E_(0), O_ = E_(1), k_ = E_(2), A_ = E_(3), j_ = E_(4), M_ = E_(5), N_ = E_(6);
D_.range, O_.range, k_.range, A_.range, j_.range, M_.range, N_.range;
function P_(e) {
	return l_((t) => {
		t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
	}, (e, t) => {
		e.setUTCDate(e.getUTCDate() + t * 7);
	}, (e, t) => (t - e) / h_);
}
var F_ = P_(0), I_ = P_(1), L_ = P_(2), R_ = P_(3), z_ = P_(4), B_ = P_(5), V_ = P_(6);
F_.range, I_.range, L_.range, R_.range, z_.range, B_.range, V_.range;
//#endregion
//#region node_modules/d3-time/src/month.js
var H_ = l_((e) => {
	e.setDate(1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
	e.setMonth(e.getMonth() + t);
}, (e, t) => t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12, (e) => e.getMonth());
H_.range;
var U_ = l_((e) => {
	e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCMonth(e.getUTCMonth() + t);
}, (e, t) => t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12, (e) => e.getUTCMonth());
U_.range;
//#endregion
//#region node_modules/d3-time/src/year.js
var W_ = l_((e) => {
	e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
	e.setFullYear(e.getFullYear() + t);
}, (e, t) => t.getFullYear() - e.getFullYear(), (e) => e.getFullYear());
W_.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : l_((t) => {
	t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
}, (t, n) => {
	t.setFullYear(t.getFullYear() + n * e);
}), W_.range;
var G_ = l_((e) => {
	e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCFullYear(e.getUTCFullYear() + t);
}, (e, t) => t.getUTCFullYear() - e.getUTCFullYear(), (e) => e.getUTCFullYear());
G_.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : l_((t) => {
	t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
}, (t, n) => {
	t.setUTCFullYear(t.getUTCFullYear() + n * e);
}), G_.range;
//#endregion
//#region node_modules/d3-time/src/ticks.js
function K_(e, t, n, r, i, a) {
	let o = [
		[
			v_,
			1,
			d_
		],
		[
			v_,
			5,
			5 * d_
		],
		[
			v_,
			15,
			15 * d_
		],
		[
			v_,
			30,
			30 * d_
		],
		[
			a,
			1,
			f_
		],
		[
			a,
			5,
			5 * f_
		],
		[
			a,
			15,
			15 * f_
		],
		[
			a,
			30,
			30 * f_
		],
		[
			i,
			1,
			p_
		],
		[
			i,
			3,
			3 * p_
		],
		[
			i,
			6,
			6 * p_
		],
		[
			i,
			12,
			12 * p_
		],
		[
			r,
			1,
			m_
		],
		[
			r,
			2,
			2 * m_
		],
		[
			n,
			1,
			h_
		],
		[
			t,
			1,
			g_
		],
		[
			t,
			3,
			3 * g_
		],
		[
			e,
			1,
			__
		]
	];
	function s(e, t, n) {
		let r = t < e;
		r && ([e, t] = [t, e]);
		let i = n && typeof n.range == "function" ? n : c(e, t, n), a = i ? i.range(e, +t + 1) : [];
		return r ? a.reverse() : a;
	}
	function c(t, n, r) {
		let i = Math.abs(n - t) / r, a = um(([, , e]) => e).right(o, i);
		if (a === o.length) return e.every(km(t / __, n / __, r));
		if (a === 0) return u_.every(Math.max(km(t, n, r), 1));
		let [s, c] = o[i / o[a - 1][2] < o[a][2] / i ? a - 1 : a];
		return s.every(c);
	}
	return [s, c];
}
var [q_, J_] = K_(G_, U_, F_, T_, S_, b_), [Y_, X_] = K_(W_, H_, D_, C_, x_, y_);
//#endregion
//#region node_modules/d3-time-format/src/locale.js
function Z_(e) {
	if (0 <= e.y && e.y < 100) {
		var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
		return t.setFullYear(e.y), t;
	}
	return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function Q_(e) {
	if (0 <= e.y && e.y < 100) {
		var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
		return t.setUTCFullYear(e.y), t;
	}
	return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function $_(e, t, n) {
	return {
		y: e,
		m: t,
		d: n,
		H: 0,
		M: 0,
		S: 0,
		L: 0
	};
}
function ev(e) {
	var t = e.dateTime, n = e.date, r = e.time, i = e.periods, a = e.days, o = e.shortDays, s = e.months, c = e.shortMonths, l = ov(i), u = sv(i), d = ov(a), f = sv(a), p = ov(o), m = sv(o), h = ov(s), g = sv(s), _ = ov(c), v = sv(c), y = {
		a: A,
		A: re,
		b: ie,
		B: j,
		c: null,
		d: Ov,
		e: Ov,
		f: Nv,
		g: Wv,
		G: Kv,
		H: kv,
		I: Av,
		j: jv,
		L: Mv,
		m: Pv,
		M: Fv,
		p: M,
		q: ae,
		Q: hy,
		s: gy,
		S: Iv,
		u: Lv,
		U: Rv,
		V: Bv,
		w: Vv,
		W: Hv,
		x: null,
		X: null,
		y: Uv,
		Y: Gv,
		Z: qv,
		"%": my
	}, b = {
		a: oe,
		A: se,
		b: N,
		B: ce,
		c: null,
		d: Jv,
		e: Jv,
		f: $v,
		g: uy,
		G: fy,
		H: Yv,
		I: Xv,
		j: Zv,
		L: Qv,
		m: ey,
		M: ty,
		p: P,
		q: le,
		Q: hy,
		s: gy,
		S: ny,
		u: ry,
		U: iy,
		V: oy,
		w: sy,
		W: cy,
		x: null,
		X: null,
		y: ly,
		Y: dy,
		Z: py,
		"%": my
	}, x = {
		a: E,
		A: D,
		b: O,
		B: k,
		c: ee,
		d: vv,
		e: vv,
		f: wv,
		g: mv,
		G: pv,
		H: bv,
		I: bv,
		j: yv,
		L: Cv,
		m: _v,
		M: xv,
		p: T,
		q: gv,
		Q: Ev,
		s: Dv,
		S: Sv,
		u: lv,
		U: uv,
		V: dv,
		w: cv,
		W: fv,
		x: te,
		X: ne,
		y: mv,
		Y: pv,
		Z: hv,
		"%": Tv
	};
	y.x = S(n, y), y.X = S(r, y), y.c = S(t, y), b.x = S(n, b), b.X = S(r, b), b.c = S(t, b);
	function S(e, t) {
		return function(n) {
			var r = [], i = -1, a = 0, o = e.length, s, c, l;
			for (n instanceof Date || (n = /* @__PURE__ */ new Date(+n)); ++i < o;) e.charCodeAt(i) === 37 && (r.push(e.slice(a, i)), (c = tv[s = e.charAt(++i)]) == null ? c = s === "e" ? " " : "0" : s = e.charAt(++i), (l = t[s]) && (s = l(n, c)), r.push(s), a = i + 1);
			return r.push(e.slice(a, i)), r.join("");
		};
	}
	function C(e, t) {
		return function(n) {
			var r = $_(1900, void 0, 1), i = w(r, e, n += "", 0), a, o;
			if (i != n.length) return null;
			if ("Q" in r) return new Date(r.Q);
			if ("s" in r) return new Date(r.s * 1e3 + ("L" in r ? r.L : 0));
			if (t && !("Z" in r) && (r.Z = 0), "p" in r && (r.H = r.H % 12 + r.p * 12), r.m === void 0 && (r.m = "q" in r ? r.q : 0), "V" in r) {
				if (r.V < 1 || r.V > 53) return null;
				"w" in r || (r.w = 1), "Z" in r ? (a = Q_($_(r.y, 0, 1)), o = a.getUTCDay(), a = o > 4 || o === 0 ? I_.ceil(a) : I_(a), a = w_.offset(a, (r.V - 1) * 7), r.y = a.getUTCFullYear(), r.m = a.getUTCMonth(), r.d = a.getUTCDate() + (r.w + 6) % 7) : (a = Z_($_(r.y, 0, 1)), o = a.getDay(), a = o > 4 || o === 0 ? O_.ceil(a) : O_(a), a = C_.offset(a, (r.V - 1) * 7), r.y = a.getFullYear(), r.m = a.getMonth(), r.d = a.getDate() + (r.w + 6) % 7);
			} else ("W" in r || "U" in r) && ("w" in r || (r.w = "u" in r ? r.u % 7 : +("W" in r)), o = "Z" in r ? Q_($_(r.y, 0, 1)).getUTCDay() : Z_($_(r.y, 0, 1)).getDay(), r.m = 0, r.d = "W" in r ? (r.w + 6) % 7 + r.W * 7 - (o + 5) % 7 : r.w + r.U * 7 - (o + 6) % 7);
			return "Z" in r ? (r.H += r.Z / 100 | 0, r.M += r.Z % 100, Q_(r)) : Z_(r);
		};
	}
	function w(e, t, n, r) {
		for (var i = 0, a = t.length, o = n.length, s, c; i < a;) {
			if (r >= o) return -1;
			if (s = t.charCodeAt(i++), s === 37) {
				if (s = t.charAt(i++), c = x[s in tv ? t.charAt(i++) : s], !c || (r = c(e, n, r)) < 0) return -1;
			} else if (s != n.charCodeAt(r++)) return -1;
		}
		return r;
	}
	function T(e, t, n) {
		var r = l.exec(t.slice(n));
		return r ? (e.p = u.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function E(e, t, n) {
		var r = p.exec(t.slice(n));
		return r ? (e.w = m.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function D(e, t, n) {
		var r = d.exec(t.slice(n));
		return r ? (e.w = f.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function O(e, t, n) {
		var r = _.exec(t.slice(n));
		return r ? (e.m = v.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function k(e, t, n) {
		var r = h.exec(t.slice(n));
		return r ? (e.m = g.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function ee(e, n, r) {
		return w(e, t, n, r);
	}
	function te(e, t, r) {
		return w(e, n, t, r);
	}
	function ne(e, t, n) {
		return w(e, r, t, n);
	}
	function A(e) {
		return o[e.getDay()];
	}
	function re(e) {
		return a[e.getDay()];
	}
	function ie(e) {
		return c[e.getMonth()];
	}
	function j(e) {
		return s[e.getMonth()];
	}
	function M(e) {
		return i[+(e.getHours() >= 12)];
	}
	function ae(e) {
		return 1 + ~~(e.getMonth() / 3);
	}
	function oe(e) {
		return o[e.getUTCDay()];
	}
	function se(e) {
		return a[e.getUTCDay()];
	}
	function N(e) {
		return c[e.getUTCMonth()];
	}
	function ce(e) {
		return s[e.getUTCMonth()];
	}
	function P(e) {
		return i[+(e.getUTCHours() >= 12)];
	}
	function le(e) {
		return 1 + ~~(e.getUTCMonth() / 3);
	}
	return {
		format: function(e) {
			var t = S(e += "", y);
			return t.toString = function() {
				return e;
			}, t;
		},
		parse: function(e) {
			var t = C(e += "", !1);
			return t.toString = function() {
				return e;
			}, t;
		},
		utcFormat: function(e) {
			var t = S(e += "", b);
			return t.toString = function() {
				return e;
			}, t;
		},
		utcParse: function(e) {
			var t = C(e += "", !0);
			return t.toString = function() {
				return e;
			}, t;
		}
	};
}
var tv = {
	"-": "",
	_: " ",
	0: "0"
}, nv = /^\s*\d+/, rv = /^%/, iv = /[\\^$*+?|[\]().{}]/g;
function Q(e, t, n) {
	var r = e < 0 ? "-" : "", i = (r ? -e : e) + "", a = i.length;
	return r + (a < n ? Array(n - a + 1).join(t) + i : i);
}
function av(e) {
	return e.replace(iv, "\\$&");
}
function ov(e) {
	return RegExp("^(?:" + e.map(av).join("|") + ")", "i");
}
function sv(e) {
	return new Map(e.map((e, t) => [e.toLowerCase(), t]));
}
function cv(e, t, n) {
	var r = nv.exec(t.slice(n, n + 1));
	return r ? (e.w = +r[0], n + r[0].length) : -1;
}
function lv(e, t, n) {
	var r = nv.exec(t.slice(n, n + 1));
	return r ? (e.u = +r[0], n + r[0].length) : -1;
}
function uv(e, t, n) {
	var r = nv.exec(t.slice(n, n + 2));
	return r ? (e.U = +r[0], n + r[0].length) : -1;
}
function dv(e, t, n) {
	var r = nv.exec(t.slice(n, n + 2));
	return r ? (e.V = +r[0], n + r[0].length) : -1;
}
function fv(e, t, n) {
	var r = nv.exec(t.slice(n, n + 2));
	return r ? (e.W = +r[0], n + r[0].length) : -1;
}
function pv(e, t, n) {
	var r = nv.exec(t.slice(n, n + 4));
	return r ? (e.y = +r[0], n + r[0].length) : -1;
}
function mv(e, t, n) {
	var r = nv.exec(t.slice(n, n + 2));
	return r ? (e.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3), n + r[0].length) : -1;
}
function hv(e, t, n) {
	var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(n, n + 6));
	return r ? (e.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), n + r[0].length) : -1;
}
function gv(e, t, n) {
	var r = nv.exec(t.slice(n, n + 1));
	return r ? (e.q = r[0] * 3 - 3, n + r[0].length) : -1;
}
function _v(e, t, n) {
	var r = nv.exec(t.slice(n, n + 2));
	return r ? (e.m = r[0] - 1, n + r[0].length) : -1;
}
function vv(e, t, n) {
	var r = nv.exec(t.slice(n, n + 2));
	return r ? (e.d = +r[0], n + r[0].length) : -1;
}
function yv(e, t, n) {
	var r = nv.exec(t.slice(n, n + 3));
	return r ? (e.m = 0, e.d = +r[0], n + r[0].length) : -1;
}
function bv(e, t, n) {
	var r = nv.exec(t.slice(n, n + 2));
	return r ? (e.H = +r[0], n + r[0].length) : -1;
}
function xv(e, t, n) {
	var r = nv.exec(t.slice(n, n + 2));
	return r ? (e.M = +r[0], n + r[0].length) : -1;
}
function Sv(e, t, n) {
	var r = nv.exec(t.slice(n, n + 2));
	return r ? (e.S = +r[0], n + r[0].length) : -1;
}
function Cv(e, t, n) {
	var r = nv.exec(t.slice(n, n + 3));
	return r ? (e.L = +r[0], n + r[0].length) : -1;
}
function wv(e, t, n) {
	var r = nv.exec(t.slice(n, n + 6));
	return r ? (e.L = Math.floor(r[0] / 1e3), n + r[0].length) : -1;
}
function Tv(e, t, n) {
	var r = rv.exec(t.slice(n, n + 1));
	return r ? n + r[0].length : -1;
}
function Ev(e, t, n) {
	var r = nv.exec(t.slice(n));
	return r ? (e.Q = +r[0], n + r[0].length) : -1;
}
function Dv(e, t, n) {
	var r = nv.exec(t.slice(n));
	return r ? (e.s = +r[0], n + r[0].length) : -1;
}
function Ov(e, t) {
	return Q(e.getDate(), t, 2);
}
function kv(e, t) {
	return Q(e.getHours(), t, 2);
}
function Av(e, t) {
	return Q(e.getHours() % 12 || 12, t, 2);
}
function jv(e, t) {
	return Q(1 + C_.count(W_(e), e), t, 3);
}
function Mv(e, t) {
	return Q(e.getMilliseconds(), t, 3);
}
function Nv(e, t) {
	return Mv(e, t) + "000";
}
function Pv(e, t) {
	return Q(e.getMonth() + 1, t, 2);
}
function Fv(e, t) {
	return Q(e.getMinutes(), t, 2);
}
function Iv(e, t) {
	return Q(e.getSeconds(), t, 2);
}
function Lv(e) {
	var t = e.getDay();
	return t === 0 ? 7 : t;
}
function Rv(e, t) {
	return Q(D_.count(W_(e) - 1, e), t, 2);
}
function zv(e) {
	var t = e.getDay();
	return t >= 4 || t === 0 ? j_(e) : j_.ceil(e);
}
function Bv(e, t) {
	return e = zv(e), Q(j_.count(W_(e), e) + (W_(e).getDay() === 4), t, 2);
}
function Vv(e) {
	return e.getDay();
}
function Hv(e, t) {
	return Q(O_.count(W_(e) - 1, e), t, 2);
}
function Uv(e, t) {
	return Q(e.getFullYear() % 100, t, 2);
}
function Wv(e, t) {
	return e = zv(e), Q(e.getFullYear() % 100, t, 2);
}
function Gv(e, t) {
	return Q(e.getFullYear() % 1e4, t, 4);
}
function Kv(e, t) {
	var n = e.getDay();
	return e = n >= 4 || n === 0 ? j_(e) : j_.ceil(e), Q(e.getFullYear() % 1e4, t, 4);
}
function qv(e) {
	var t = e.getTimezoneOffset();
	return (t > 0 ? "-" : (t *= -1, "+")) + Q(t / 60 | 0, "0", 2) + Q(t % 60, "0", 2);
}
function Jv(e, t) {
	return Q(e.getUTCDate(), t, 2);
}
function Yv(e, t) {
	return Q(e.getUTCHours(), t, 2);
}
function Xv(e, t) {
	return Q(e.getUTCHours() % 12 || 12, t, 2);
}
function Zv(e, t) {
	return Q(1 + w_.count(G_(e), e), t, 3);
}
function Qv(e, t) {
	return Q(e.getUTCMilliseconds(), t, 3);
}
function $v(e, t) {
	return Qv(e, t) + "000";
}
function ey(e, t) {
	return Q(e.getUTCMonth() + 1, t, 2);
}
function ty(e, t) {
	return Q(e.getUTCMinutes(), t, 2);
}
function ny(e, t) {
	return Q(e.getUTCSeconds(), t, 2);
}
function ry(e) {
	var t = e.getUTCDay();
	return t === 0 ? 7 : t;
}
function iy(e, t) {
	return Q(F_.count(G_(e) - 1, e), t, 2);
}
function ay(e) {
	var t = e.getUTCDay();
	return t >= 4 || t === 0 ? z_(e) : z_.ceil(e);
}
function oy(e, t) {
	return e = ay(e), Q(z_.count(G_(e), e) + (G_(e).getUTCDay() === 4), t, 2);
}
function sy(e) {
	return e.getUTCDay();
}
function cy(e, t) {
	return Q(I_.count(G_(e) - 1, e), t, 2);
}
function ly(e, t) {
	return Q(e.getUTCFullYear() % 100, t, 2);
}
function uy(e, t) {
	return e = ay(e), Q(e.getUTCFullYear() % 100, t, 2);
}
function dy(e, t) {
	return Q(e.getUTCFullYear() % 1e4, t, 4);
}
function fy(e, t) {
	var n = e.getUTCDay();
	return e = n >= 4 || n === 0 ? z_(e) : z_.ceil(e), Q(e.getUTCFullYear() % 1e4, t, 4);
}
function py() {
	return "+0000";
}
function my() {
	return "%";
}
function hy(e) {
	return +e;
}
function gy(e) {
	return Math.floor(e / 1e3);
}
//#endregion
//#region node_modules/d3-time-format/src/defaultLocale.js
var _y, vy, yy;
by({
	dateTime: "%x, %X",
	date: "%-m/%-d/%Y",
	time: "%-I:%M:%S %p",
	periods: ["AM", "PM"],
	days: [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	],
	shortDays: [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	],
	months: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	],
	shortMonths: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	]
});
function by(e) {
	return _y = ev(e), vy = _y.format, _y.parse, yy = _y.utcFormat, _y.utcParse, _y;
}
//#endregion
//#region node_modules/d3-scale/src/time.js
function xy(e) {
	return new Date(e);
}
function Sy(e) {
	return e instanceof Date ? +e : +/* @__PURE__ */ new Date(+e);
}
function Cy(e, t, n, r, i, a, o, s, c, l) {
	var u = ag(), d = u.invert, f = u.domain, p = l(".%L"), m = l(":%S"), h = l("%I:%M"), g = l("%I %p"), _ = l("%a %d"), v = l("%b %d"), y = l("%B"), b = l("%Y");
	function x(e) {
		return (c(e) < e ? p : s(e) < e ? m : o(e) < e ? h : a(e) < e ? g : r(e) < e ? i(e) < e ? _ : v : n(e) < e ? y : b)(e);
	}
	return u.invert = function(e) {
		return new Date(d(e));
	}, u.domain = function(e) {
		return arguments.length ? f(Array.from(e, Sy)) : f().map(xy);
	}, u.ticks = function(t) {
		var n = f();
		return e(n[0], n[n.length - 1], t ?? 10);
	}, u.tickFormat = function(e, t) {
		return t == null ? x : l(t);
	}, u.nice = function(e) {
		var n = f();
		return (!e || typeof e.range != "function") && (e = t(n[0], n[n.length - 1], e ?? 10)), e ? f(Pg(n, e)) : u;
	}, u.copy = function() {
		return rg(u, Cy(e, t, n, r, i, a, o, s, c, l));
	}, u;
}
function wy() {
	return Lm.apply(Cy(Y_, X_, W_, H_, D_, C_, x_, y_, v_, vy).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
}
//#endregion
//#region node_modules/d3-scale/src/utcTime.js
function Ty() {
	return Lm.apply(Cy(q_, J_, G_, U_, F_, w_, S_, b_, v_, yy).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
}
//#endregion
//#region node_modules/d3-scale/src/sequential.js
function Ey() {
	var e = 0, t = 1, n, r, i, a, o = Qh, s = !1, c;
	function l(e) {
		return e == null || isNaN(e = +e) ? c : o(i === 0 ? .5 : (e = (a(e) - n) * i, s ? Math.max(0, Math.min(1, e)) : e));
	}
	l.domain = function(o) {
		return arguments.length ? ([e, t] = o, n = a(e = +e), r = a(t = +t), i = n === r ? 0 : 1 / (r - n), l) : [e, t];
	}, l.clamp = function(e) {
		return arguments.length ? (s = !!e, l) : s;
	}, l.interpolator = function(e) {
		return arguments.length ? (o = e, l) : o;
	};
	function u(e) {
		return function(t) {
			var n, r;
			return arguments.length ? ([n, r] = t, o = e(n, r), l) : [o(0), o(1)];
		};
	}
	return l.range = u(Kh), l.rangeRound = u(qh), l.unknown = function(e) {
		return arguments.length ? (c = e, l) : c;
	}, function(o) {
		return a = o, n = o(e), r = o(t), i = n === r ? 0 : 1 / (r - n), l;
	};
}
function Dy(e, t) {
	return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown());
}
function Oy() {
	var e = jg(Ey()(Qh));
	return e.copy = function() {
		return Dy(e, Oy());
	}, Rm.apply(e, arguments);
}
function ky() {
	var e = Ug(Ey()).domain([1, 10]);
	return e.copy = function() {
		return Dy(e, ky()).base(e.base());
	}, Rm.apply(e, arguments);
}
function Ay() {
	var e = qg(Ey());
	return e.copy = function() {
		return Dy(e, Ay()).constant(e.constant());
	}, Rm.apply(e, arguments);
}
function jy() {
	var e = Qg(Ey());
	return e.copy = function() {
		return Dy(e, jy()).exponent(e.exponent());
	}, Rm.apply(e, arguments);
}
function My() {
	return jy.apply(null, arguments).exponent(.5);
}
//#endregion
//#region node_modules/d3-scale/src/sequentialQuantile.js
function Ny() {
	var e = [], t = Qh;
	function n(n) {
		if (n != null && !isNaN(n = +n)) return t((hm(e, n, 1) - 1) / (e.length - 1));
	}
	return n.domain = function(t) {
		if (!arguments.length) return e.slice();
		e = [];
		for (let n of t) n != null && !isNaN(n = +n) && e.push(n);
		return e.sort(cm), n;
	}, n.interpolator = function(e) {
		return arguments.length ? (t = e, n) : t;
	}, n.range = function() {
		return e.map((n, r) => t(r / (e.length - 1)));
	}, n.quantiles = function(t) {
		return Array.from({ length: t + 1 }, (n, r) => Pm(e, r / t));
	}, n.copy = function() {
		return Ny(t).domain(e);
	}, Rm.apply(n, arguments);
}
//#endregion
//#region node_modules/d3-scale/src/diverging.js
function Py() {
	var e = 0, t = .5, n = 1, r = 1, i, a, o, s, c, l = Qh, u, d = !1, f;
	function p(e) {
		return isNaN(e = +e) ? f : (e = .5 + ((e = +u(e)) - a) * (r * e < r * a ? s : c), l(d ? Math.max(0, Math.min(1, e)) : e));
	}
	p.domain = function(l) {
		return arguments.length ? ([e, t, n] = l, i = u(e = +e), a = u(t = +t), o = u(n = +n), s = i === a ? 0 : .5 / (a - i), c = a === o ? 0 : .5 / (o - a), r = a < i ? -1 : 1, p) : [
			e,
			t,
			n
		];
	}, p.clamp = function(e) {
		return arguments.length ? (d = !!e, p) : d;
	}, p.interpolator = function(e) {
		return arguments.length ? (l = e, p) : l;
	};
	function m(e) {
		return function(t) {
			var n, r, i;
			return arguments.length ? ([n, r, i] = t, l = Jh(e, [
				n,
				r,
				i
			]), p) : [
				l(0),
				l(.5),
				l(1)
			];
		};
	}
	return p.range = m(Kh), p.rangeRound = m(qh), p.unknown = function(e) {
		return arguments.length ? (f = e, p) : f;
	}, function(l) {
		return u = l, i = l(e), a = l(t), o = l(n), s = i === a ? 0 : .5 / (a - i), c = a === o ? 0 : .5 / (o - a), r = a < i ? -1 : 1, p;
	};
}
function Fy() {
	var e = jg(Py()(Qh));
	return e.copy = function() {
		return Dy(e, Fy());
	}, Rm.apply(e, arguments);
}
function Iy() {
	var e = Ug(Py()).domain([
		.1,
		1,
		10
	]);
	return e.copy = function() {
		return Dy(e, Iy()).base(e.base());
	}, Rm.apply(e, arguments);
}
function Ly() {
	var e = qg(Py());
	return e.copy = function() {
		return Dy(e, Ly()).constant(e.constant());
	}, Rm.apply(e, arguments);
}
function Ry() {
	var e = Qg(Py());
	return e.copy = function() {
		return Dy(e, Ry()).exponent(e.exponent());
	}, Rm.apply(e, arguments);
}
function zy() {
	return Ry.apply(null, arguments).exponent(.5);
}
//#endregion
//#region node_modules/victory-vendor/es/d3-scale.js
var By = /* @__PURE__ */ s({
	scaleBand: () => Vm,
	scaleDiverging: () => Fy,
	scaleDivergingLog: () => Iy,
	scaleDivergingPow: () => Ry,
	scaleDivergingSqrt: () => zy,
	scaleDivergingSymlog: () => Ly,
	scaleIdentity: () => Ng,
	scaleImplicit: () => zm,
	scaleLinear: () => Mg,
	scaleLog: () => Wg,
	scaleOrdinal: () => Bm,
	scalePoint: () => Um,
	scalePow: () => $g,
	scaleQuantile: () => i_,
	scaleQuantize: () => a_,
	scaleRadial: () => r_,
	scaleSequential: () => Oy,
	scaleSequentialLog: () => ky,
	scaleSequentialPow: () => jy,
	scaleSequentialQuantile: () => Ny,
	scaleSequentialSqrt: () => My,
	scaleSequentialSymlog: () => Ay,
	scaleSqrt: () => e_,
	scaleSymlog: () => Jg,
	scaleThreshold: () => o_,
	scaleTime: () => wy,
	scaleUtc: () => Ty,
	tickFormat: () => Ag
});
//#endregion
//#region node_modules/recharts/es6/state/selectors/combiners/combineConfiguredScale.js
function Vy(e) {
	if (e in By) return By[e]();
	var t = `scale${Qt(e)}`;
	if (t in By) return By[t]();
}
function Hy(e, t, n) {
	if (typeof e == "function") return e.copy().domain(t).range(n);
	if (e != null) {
		var r = Vy(e);
		if (r != null) return r.domain(t).range(n), r;
	}
}
function Uy(e, t, n, r) {
	if (!(n == null || r == null)) return typeof e.scale == "function" ? Hy(e.scale, n, r) : Hy(t, n, r);
}
//#endregion
//#region node_modules/recharts/es6/state/selectors/combiners/combineRealScaleType.js
function Wy(e) {
	return `scale${Qt(e)}`;
}
function Gy(e) {
	return Wy(e) in By;
}
var Ky = (e, t, n) => {
	if (e != null) {
		var { scale: r, type: i } = e;
		if (r === "auto") return i === "category" && n && (n.indexOf("LineChart") >= 0 || n.indexOf("AreaChart") >= 0 || n.indexOf("ComposedChart") >= 0 && !t) ? "point" : i === "category" ? "band" : "linear";
		if (typeof r == "string") return Gy(r) ? r : "point";
	}
};
//#endregion
//#region node_modules/recharts/es6/util/scale/createCategoricalInverse.js
function qy(e, t) {
	for (var n = 0, r = e.length, i = e[0] < e[e.length - 1]; n < r;) {
		var a = Math.floor((n + r) / 2);
		(i ? e[a] < t : e[a] > t) ? n = a + 1 : r = a;
	}
	return n;
}
function Jy(e, t) {
	if (e) {
		var n = t ?? e.domain(), r = n.map((t) => e(t) ?? 0), i = e.range();
		if (!(n.length === 0 || i.length < 2)) return (e) => {
			var t = qy(r, e);
			if (t <= 0) return n[0];
			if (t >= n.length) return n[n.length - 1];
			var i = r[t - 1] ?? 0, a = r[t] ?? 0;
			return Math.abs(e - i) <= Math.abs(e - a) ? n[t - 1] : n[t];
		};
	}
}
//#endregion
//#region node_modules/recharts/es6/state/selectors/combiners/combineInverseScaleFunction.js
function Yy(e) {
	if (e != null) return "invert" in e && typeof e.invert == "function" ? e.invert.bind(e) : Jy(e, void 0);
}
//#endregion
//#region node_modules/recharts/es6/state/selectors/axisSelectors.js
function Xy(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Zy(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Xy(Object(n), !0).forEach(function(t) {
			Qy(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Xy(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Qy(e, t, n) {
	return (t = $y(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function $y(e) {
	var t = eb(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function eb(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var tb = [0, "auto"], nb = {
	allowDataOverflow: !1,
	allowDecimals: !0,
	allowDuplicatedCategory: !0,
	angle: 0,
	dataKey: void 0,
	domain: void 0,
	height: 30,
	hide: !0,
	id: 0,
	includeHidden: !1,
	interval: "preserveEnd",
	minTickGap: 5,
	mirror: !1,
	name: void 0,
	orientation: "bottom",
	padding: {
		left: 0,
		right: 0
	},
	reversed: !1,
	scale: "auto",
	tick: !0,
	tickCount: 5,
	tickFormatter: void 0,
	ticks: void 0,
	type: "category",
	unit: void 0,
	niceTicks: "auto"
}, rb = (e, t) => e.cartesianAxis.xAxis[t], ib = (e, t) => rb(e, t) ?? nb, ab = {
	allowDataOverflow: !1,
	allowDecimals: !0,
	allowDuplicatedCategory: !0,
	angle: 0,
	dataKey: void 0,
	domain: tb,
	hide: !0,
	id: 0,
	includeHidden: !1,
	interval: "preserveEnd",
	minTickGap: 5,
	mirror: !1,
	name: void 0,
	orientation: "left",
	padding: {
		top: 0,
		bottom: 0
	},
	reversed: !1,
	scale: "auto",
	tick: !0,
	tickCount: 5,
	tickFormatter: void 0,
	ticks: void 0,
	type: "number",
	unit: void 0,
	niceTicks: "auto",
	width: 60
}, ob = (e, t) => e.cartesianAxis.yAxis[t], sb = (e, t) => ob(e, t) ?? ab, cb = {
	domain: [0, "auto"],
	includeHidden: !1,
	reversed: !1,
	allowDataOverflow: !1,
	allowDuplicatedCategory: !1,
	dataKey: void 0,
	id: 0,
	name: "",
	range: [64, 64],
	scale: "auto",
	type: "number",
	unit: ""
}, lb = (e, t) => e.cartesianAxis.zAxis[t] ?? cb, ub = (e, t, n) => {
	switch (t) {
		case "xAxis": return ib(e, n);
		case "yAxis": return sb(e, n);
		case "zAxis": return lb(e, n);
		case "angleAxis": return Vp(e, n);
		case "radiusAxis": return Hp(e, n);
		default: throw Error(`Unexpected axis type: ${t}`);
	}
}, db = (e, t, n) => {
	switch (t) {
		case "xAxis": return ib(e, n);
		case "yAxis": return sb(e, n);
		default: throw Error(`Unexpected axis type: ${t}`);
	}
}, fb = (e, t, n) => {
	switch (t) {
		case "xAxis": return ib(e, n);
		case "yAxis": return sb(e, n);
		case "angleAxis": return Vp(e, n);
		case "radiusAxis": return Hp(e, n);
		default: throw Error(`Unexpected axis type: ${t}`);
	}
}, pb = (e) => e.graphicalItems.cartesianItems.some((e) => e.type === "bar") || e.graphicalItems.polarItems.some((e) => e.type === "radialBar");
function mb(e, t) {
	return (n) => {
		switch (e) {
			case "xAxis": return "xAxisId" in n && n.xAxisId === t;
			case "yAxis": return "yAxisId" in n && n.yAxisId === t;
			case "zAxis": return "zAxisId" in n && n.zAxisId === t;
			case "angleAxis": return "angleAxisId" in n && n.angleAxisId === t;
			case "radiusAxis": return "radiusAxisId" in n && n.radiusAxisId === t;
			default: return !1;
		}
	};
}
var hb = (e) => e.graphicalItems.cartesianItems, gb = L([Xp, Zp], mb), _b = (e, t, n) => e.filter(n).filter((e) => t?.includeHidden === !0 ? !0 : !e.hide), vb = L([
	hb,
	ub,
	gb
], _b, { memoizeOptions: { resultEqualityCheck: nm } }), yb = L([vb], (e) => e.filter((e) => e.type === "area" || e.type === "bar").filter(em)), bb = (e) => e.filter((e) => !("stackId" in e) || e.stackId === void 0), xb = L([vb], bb), Sb = (e) => e.map((e) => e.data).filter(Boolean).flat(1), Cb = L([vb], Sb, { memoizeOptions: { resultEqualityCheck: nm } }), wb = (e, t) => {
	var { chartData: n = [], dataStartIndex: r, dataEndIndex: i } = t;
	return e.length > 0 ? e : n.slice(r, i + 1);
}, Tb = L([Cb, ip], wb), Eb = (e, t, n) => t?.dataKey == null ? n.length > 0 ? n.map((e) => e.dataKey).flatMap((t) => e.map((e) => ({ value: Ss(e, t) }))) : e.map((e) => ({ value: e })) : e.map((e) => ({ value: Ss(e, t.dataKey) })), Db = L([
	Tb,
	ub,
	vb
], Eb);
function Ob(e) {
	if (Wt(e) || e instanceof Date) {
		var t = Number(e);
		if (H(t)) return t;
	}
}
function kb(e) {
	if (Array.isArray(e)) {
		var t = [Ob(e[0]), Ob(e[1])];
		return op(t) ? t : void 0;
	}
	var n = Ob(e);
	if (n != null) return [n, n];
}
function Ab(e) {
	return e.map(Ob).filter($t);
}
function jb(e, t) {
	var n = Ob(e), r = Ob(t);
	return n == null && r == null ? 0 : n == null ? -1 : r == null ? 1 : n - r;
}
var Mb = L([Db], (e) => e?.map((e) => e.value).sort(jb));
function Nb(e, t) {
	switch (e) {
		case "xAxis": return t.direction === "x";
		case "yAxis": return t.direction === "y";
		default: return !1;
	}
}
function Pb(e, t, n) {
	return !n || typeof t != "number" || Ht(t) || !n.length ? [] : Ab(n.flatMap((n) => {
		var r = Ss(e, n.dataKey), i, a;
		if (Array.isArray(r) ? [i, a] = r : i = a = r, !(!H(i) || !H(a))) return [t - i, t + a];
	}));
}
var Fb = (e) => fb(e, im(e), am(e)), Ib = L([Fb], (e) => e?.dataKey), Lb = L([
	yb,
	ip,
	Fb
], $p), Rb = (e, t, n, r) => {
	var i = t.reduce((e, t) => {
		if (t.stackId == null) return e;
		var n = e[t.stackId];
		return n ??= [], n.push(t), e[t.stackId] = n, e;
	}, {});
	return Object.fromEntries(Object.entries(i).map((t) => {
		var [i, a] = t, o = r ? [...a].reverse() : a;
		return [i, {
			stackedData: ks(e, o.map(Qp), n),
			graphicalItems: o
		}];
	}));
}, zb = L([
	Lb,
	yb,
	Cp,
	wp
], Rb), Bb = (e, t, n, r) => {
	var { dataStartIndex: i, dataEndIndex: a } = t;
	if (r == null && n !== "zAxis") {
		var o = Is(e, i, a);
		if (!(o != null && o[0] === 0 && o[1] === 0)) return o;
	}
}, Vb = L([ub], (e) => e.allowDataOverflow), Hb = (e) => {
	if (e == null || !("domain" in e)) return tb;
	if (e.domain != null) return e.domain;
	if ("ticks" in e && e.ticks != null) {
		if (e.type === "number") {
			var t = Ab(e.ticks);
			return [Math.min(...t), Math.max(...t)];
		}
		if (e.type === "category") return e.ticks.map(String);
	}
	return e?.domain ?? tb;
}, Ub = L([ub], Hb), Wb = L([Ub, Vb], cp), Gb = L([
	zb,
	np,
	Xp,
	Wb
], Bb, { memoizeOptions: { resultEqualityCheck: tm } }), Kb = (e) => e.errorBars, qb = (e, t, n) => e.flatMap((e) => t[e.id]).filter(Boolean).filter((e) => Nb(n, e)), Jb = function() {
	var e = [...arguments].filter(Boolean);
	if (e.length !== 0) {
		var t = e.flat();
		return [Math.min(...t), Math.max(...t)];
	}
}, Yb = (e, t, n, r, i) => {
	var a, o;
	if (n.length > 0 && e.forEach((e) => {
		n.forEach((n) => {
			var s = r[n.id]?.filter((e) => Nb(i, e)), c = Ss(e, t.dataKey ?? n.dataKey), l = Pb(e, c, s);
			if (l.length >= 2) {
				var u = Math.min(...l), d = Math.max(...l);
				(a == null || u < a) && (a = u), (o == null || d > o) && (o = d);
			}
			var f = kb(c);
			f != null && (a = a == null ? f[0] : Math.min(a, f[0]), o = o == null ? f[1] : Math.max(o, f[1]));
		});
	}), t?.dataKey != null && e.forEach((e) => {
		var n = kb(Ss(e, t.dataKey));
		n != null && (a = a == null ? n[0] : Math.min(a, n[0]), o = o == null ? n[1] : Math.max(o, n[1]));
	}), H(a) && H(o)) return [a, o];
}, Xb = L([
	Tb,
	ub,
	xb,
	Kb,
	Xp
], Yb, { memoizeOptions: { resultEqualityCheck: tm } });
function Zb(e) {
	var { value: t } = e;
	if (Wt(t) || t instanceof Date) return t;
}
var Qb = (e, t, n) => {
	var r = e.map(Zb).filter((e) => e != null);
	return n && (t.dataKey == null || t.allowDuplicatedCategory && Jt(r)) ? tp(0, e.length) : t.allowDuplicatedCategory ? r : Array.from(new Set(r));
}, $b = (e) => e.referenceElements.dots, ex = (e, t, n) => e.filter((e) => e.ifOverflow === "extendDomain").filter((e) => t === "xAxis" ? e.xAxisId === n : e.yAxisId === n), tx = L([
	$b,
	Xp,
	Zp
], ex), nx = (e) => e.referenceElements.areas, rx = L([
	nx,
	Xp,
	Zp
], ex), ix = (e) => e.referenceElements.lines, ax = L([
	ix,
	Xp,
	Zp
], ex), ox = (e, t) => {
	if (e != null) {
		var n = Ab(e.map((e) => t === "xAxis" ? e.x : e.y));
		if (n.length !== 0) return [Math.min(...n), Math.max(...n)];
	}
}, sx = L(tx, Xp, ox), cx = (e, t) => {
	if (e != null) {
		var n = Ab(e.flatMap((e) => [t === "xAxis" ? e.x1 : e.y1, t === "xAxis" ? e.x2 : e.y2]));
		if (n.length !== 0) return [Math.min(...n), Math.max(...n)];
	}
}, lx = L([rx, Xp], cx);
function ux(e) {
	if (e.x != null) return Ab([e.x]);
	var t = e.segment?.map((e) => e.x);
	return t == null || t.length === 0 ? [] : Ab(t);
}
function dx(e) {
	if (e.y != null) return Ab([e.y]);
	var t = e.segment?.map((e) => e.y);
	return t == null || t.length === 0 ? [] : Ab(t);
}
var fx = (e, t) => {
	if (e != null) {
		var n = e.flatMap((e) => t === "xAxis" ? ux(e) : dx(e));
		if (n.length !== 0) return [Math.min(...n), Math.max(...n)];
	}
}, px = L(sx, L([ax, Xp], fx), lx, (e, t, n) => Jb(e, n, t)), mx = (e, t, n, r, i, a, o, s) => n ?? lp(t, o === "vertical" && s === "xAxis" || o === "horizontal" && s === "yAxis" ? Jb(r, a, i) : Jb(a, i), e.allowDataOverflow), hx = L([
	ub,
	Ub,
	Wb,
	Gb,
	Xb,
	px,
	U,
	Xp
], mx, { memoizeOptions: { resultEqualityCheck: tm } }), gx = [0, 1], _x = (e, t, n, r, i, a, o) => {
	if (!((e == null || n == null || n.length === 0) && o === void 0)) {
		var { dataKey: s, type: c } = e, l = ws(t, a);
		return l && s == null ? tp(0, n?.length ?? 0) : c === "category" ? Qb(r, e, l) : i === "expand" ? gx : o;
	}
}, vx = L([
	ub,
	U,
	Tb,
	Db,
	Cp,
	Xp,
	hx
], _x), yx = L([
	ub,
	pb,
	Tp
], Ky), bx = (e, t, n) => {
	var { niceTicks: r } = t;
	if (r !== "none") {
		var i = Hb(t), a = Array.isArray(i) && (i[0] === "auto" || i[1] === "auto");
		if ((r === "snap125" || r === "adaptive") && t != null && t.tickCount && op(e)) {
			if (a) return _p(e, t.tickCount, t.allowDecimals, r);
			if (t.type === "number") return vp(e, t.tickCount, t.allowDecimals, r);
		}
		if (r === "auto" && n === "linear" && t != null && t.tickCount) {
			if (a && op(e)) return _p(e, t.tickCount, t.allowDecimals, "adaptive");
			if (t.type === "number" && op(e)) return vp(e, t.tickCount, t.allowDecimals, "adaptive");
		}
	}
}, xx = L([
	vx,
	fb,
	yx
], bx), Sx = (e, t, n, r) => {
	if (r !== "angleAxis" && e?.type === "number" && op(t) && Array.isArray(n) && n.length > 0) {
		var i = t[0], a = n[0] ?? 0, o = t[1], s = n[n.length - 1] ?? 0;
		return [Math.min(i, a), Math.max(o, s)];
	}
	return t;
}, Cx = L([
	ub,
	vx,
	xx,
	Xp
], Sx), wx = L(L(Db, ub, (e, t) => {
	if (!(!t || t.type !== "number")) {
		var n = Infinity, r = Array.from(Ab(e.map((e) => e.value))).sort((e, t) => e - t), i = r[0], a = r[r.length - 1];
		if (i == null || a == null) return Infinity;
		var o = a - i;
		if (o === 0) return Infinity;
		for (var s = 0; s < r.length - 1; s++) {
			var c = r[s], l = r[s + 1];
			if (!(c == null || l == null)) {
				var u = l - c;
				n = Math.min(n, u);
			}
		}
		return n / o;
	}
}), U, xp, sc, (e, t, n, r, i) => i, (e, t, n, r, i) => {
	if (!H(e)) return 0;
	var a = t === "vertical" ? r.height : r.width;
	if (i === "gap") return e * a / 2;
	if (i === "no-gap") {
		var o = qt(n, e * a), s = e * a / 2;
		return s - o - (s - o) / a * o;
	}
	return 0;
}), Tx = (e, t, n) => {
	var r = ib(e, t);
	return r == null || typeof r.padding != "string" ? 0 : wx(e, "xAxis", t, n, r.padding);
}, Ex = (e, t, n) => {
	var r = sb(e, t);
	return r == null || typeof r.padding != "string" ? 0 : wx(e, "yAxis", t, n, r.padding);
}, Dx = L(ib, Tx, (e, t) => {
	if (e == null) return {
		left: 0,
		right: 0
	};
	var { padding: n } = e;
	return typeof n == "string" ? {
		left: t,
		right: t
	} : {
		left: (n.left ?? 0) + t,
		right: (n.right ?? 0) + t
	};
}), Ox = L(sb, Ex, (e, t) => {
	if (e == null) return {
		top: 0,
		bottom: 0
	};
	var { padding: n } = e;
	return typeof n == "string" ? {
		top: t,
		bottom: t
	} : {
		top: (n.top ?? 0) + t,
		bottom: (n.bottom ?? 0) + t
	};
}), kx = L([
	sc,
	Dx,
	pc,
	fc,
	(e, t, n) => n
], (e, t, n, r, i) => {
	var { padding: a } = r;
	return i ? [a.left, n.width - a.right] : [e.left + t.left, e.left + e.width - t.right];
}), Ax = L([
	sc,
	U,
	Ox,
	pc,
	fc,
	(e, t, n) => n
], (e, t, n, r, i, a) => {
	var { padding: o } = i;
	return a ? [r.height - o.bottom, o.top] : t === "horizontal" ? [e.top + e.height - n.bottom, e.top + n.top] : [e.top + n.top, e.top + e.height - n.bottom];
}), jx = (e, t, n, r) => {
	switch (t) {
		case "xAxis": return kx(e, n, r);
		case "yAxis": return Ax(e, n, r);
		case "zAxis": return lb(e, n)?.range;
		case "angleAxis": return qp(e);
		case "radiusAxis": return Jp(e, n);
		default: return;
	}
}, Mx = L([ub, jx], Mp), Nx = L([
	ub,
	yx,
	L([yx, Cx], sm),
	Mx
], Uy), Px = (e, t, n, r) => {
	if (!(n == null || n.dataKey == null)) {
		var { type: i, scale: a } = n;
		if (ws(e, r) && (i === "number" || a !== "auto")) return t.map((e) => e.value);
	}
}, Fx = L([
	U,
	Db,
	fb,
	Xp
], Px), Ix = L([Nx], om);
L([Nx], Yy), L([Nx, Mb], Jy), L([
	vb,
	Kb,
	Xp
], qb);
function Lx(e, t) {
	return e.id < t.id ? -1 : +(e.id > t.id);
}
var Rx = (e, t) => t, zx = (e, t, n) => n, Bx = L(Js, Rx, zx, (e, t, n) => e.filter((e) => e.orientation === t).filter((e) => e.mirror === n).sort(Lx)), Vx = L(Ys, Rx, zx, (e, t, n) => e.filter((e) => e.orientation === t).filter((e) => e.mirror === n).sort(Lx)), Hx = (e, t) => ({
	width: e.width,
	height: t.height
}), Ux = (e, t) => ({
	width: typeof t.width == "number" ? t.width : 60,
	height: e.height
}), Wx = L(sc, ib, Hx), Gx = (e, t, n) => {
	switch (t) {
		case "top": return e.top;
		case "bottom": return n - e.bottom;
		default: return 0;
	}
}, Kx = (e, t, n) => {
	switch (t) {
		case "left": return e.left;
		case "right": return n - e.right;
		default: return 0;
	}
}, qx = L(Gs, sc, Bx, Rx, zx, (e, t, n, r, i) => {
	var a = {}, o;
	return n.forEach((n) => {
		var s = Hx(t, n);
		o ??= Gx(t, r, e);
		var c = r === "top" && !i || r === "bottom" && i;
		a[n.id] = o - Number(c) * s.height, o += (c ? -1 : 1) * s.height;
	}), a;
}), Jx = L(Ws, sc, Vx, Rx, zx, (e, t, n, r, i) => {
	var a = {}, o;
	return n.forEach((n) => {
		var s = Ux(t, n);
		o ??= Kx(t, r, e);
		var c = r === "left" && !i || r === "right" && i;
		a[n.id] = o - Number(c) * s.width, o += (c ? -1 : 1) * s.width;
	}), a;
}), Yx = L([
	sc,
	ib,
	(e, t) => {
		var n = ib(e, t);
		if (n != null) return qx(e, n.orientation, n.mirror);
	},
	(e, t) => t
], (e, t, n, r) => {
	if (t != null) {
		var i = n?.[r];
		return i == null ? {
			x: e.left,
			y: 0
		} : {
			x: e.left,
			y: i
		};
	}
}), Xx = L([
	sc,
	sb,
	(e, t) => {
		var n = sb(e, t);
		if (n != null) return Jx(e, n.orientation, n.mirror);
	},
	(e, t) => t
], (e, t, n, r) => {
	if (t != null) {
		var i = n?.[r];
		return i == null ? {
			x: 0,
			y: e.top
		} : {
			x: i,
			y: e.top
		};
	}
}), Zx = L(sc, sb, (e, t) => ({
	width: typeof t.width == "number" ? t.width : 60,
	height: e.height
})), Qx = (e, t, n) => {
	switch (t) {
		case "xAxis": return Wx(e, n).width;
		case "yAxis": return Zx(e, n).height;
		default: return;
	}
}, $x = (e, t, n, r) => {
	if (n != null) {
		var { allowDuplicatedCategory: i, type: a, dataKey: o } = n, s = ws(e, r), c = t.map((e) => e.value);
		if (o && s && a === "category" && i && Jt(c)) return c;
	}
}, eS = L([
	U,
	Db,
	ub,
	Xp
], $x), tS = L([
	U,
	db,
	yx,
	Ix,
	eS,
	Fx,
	jx,
	xx,
	Xp
], (e, t, n, r, i, a, o, s, c) => {
	if (t != null) {
		var l = ws(e, c);
		return {
			angle: t.angle,
			interval: t.interval,
			minTickGap: t.minTickGap,
			orientation: t.orientation,
			tick: t.tick,
			tickCount: t.tickCount,
			tickFormatter: t.tickFormatter,
			ticks: t.ticks,
			type: t.type,
			unit: t.unit,
			axisType: c,
			categoricalDomain: a,
			duplicateDomain: i,
			isCategorical: l,
			niceTicks: s,
			range: o,
			realScaleType: n,
			scale: r
		};
	}
}), nS = L([
	U,
	fb,
	yx,
	Ix,
	xx,
	jx,
	eS,
	Fx,
	Xp
], (e, t, n, r, i, a, o, s, c) => {
	if (!(t == null || r == null)) {
		var l = ws(e, c), { type: u, ticks: d, tickCount: f } = t, p = n === "scaleBand" && typeof r.bandwidth == "function" ? r.bandwidth() / 2 : 2, m = u === "category" && r.bandwidth ? r.bandwidth() / p : 0;
		m = c === "angleAxis" && a != null && a.length >= 2 ? Vt(a[0] - a[1]) * 2 * m : m;
		var h = d || i;
		return h ? h.map((e, t) => {
			var n = o ? o.indexOf(e) : e, i = r.map(n);
			return H(i) ? {
				index: t,
				coordinate: i + m,
				value: e,
				offset: m
			} : null;
		}).filter($t) : l && s ? s.map((e, t) => {
			var n = r.map(e);
			return H(n) ? {
				coordinate: n + m,
				value: e,
				index: t,
				offset: m
			} : null;
		}).filter($t) : r.ticks ? r.ticks(f).map((e, t) => {
			var n = r.map(e);
			return H(n) ? {
				coordinate: n + m,
				value: e,
				index: t,
				offset: m
			} : null;
		}).filter($t) : r.domain().map((e, t) => {
			var n = r.map(e);
			return H(n) ? {
				coordinate: n + m,
				value: o ? o[e] : e,
				index: t,
				offset: m
			} : null;
		}).filter($t);
	}
}), rS = L([
	U,
	fb,
	Ix,
	jx,
	eS,
	Fx,
	Xp
], (e, t, n, r, i, a, o) => {
	if (!(t == null || n == null || r == null || r[0] === r[1])) {
		var s = ws(e, o), { tickCount: c } = t, l = 0;
		return l = o === "angleAxis" && r?.length >= 2 ? Vt(r[0] - r[1]) * 2 * l : l, s && a ? a.map((e, t) => {
			var r = n.map(e);
			return H(r) ? {
				coordinate: r + l,
				value: e,
				index: t,
				offset: l
			} : null;
		}).filter($t) : n.ticks ? n.ticks(c).map((e, t) => {
			var r = n.map(e);
			return H(r) ? {
				coordinate: r + l,
				value: e,
				index: t,
				offset: l
			} : null;
		}).filter($t) : n.domain().map((e, t) => {
			var r = n.map(e);
			return H(r) ? {
				coordinate: r + l,
				value: i ? i[e] : e,
				index: t,
				offset: l
			} : null;
		}).filter($t);
	}
}), iS = L(ub, Ix, (e, t) => {
	if (!(e == null || t == null)) return Zy(Zy({}, e), {}, { scale: t });
});
L((e, t, n) => lb(e, n), L([L([
	ub,
	yx,
	vx,
	Mx
], Uy)], om), (e, t) => {
	if (!(e == null || t == null)) return Zy(Zy({}, e), {}, { scale: t });
});
var aS = L([
	U,
	Js,
	Ys
], (e, t, n) => {
	switch (e) {
		case "horizontal": return t.some((e) => e.reversed) ? "right-to-left" : "left-to-right";
		case "vertical": return n.some((e) => e.reversed) ? "bottom-to-top" : "top-to-bottom";
		case "centric":
		case "radial": return "left-to-right";
		default: return;
	}
});
L([(e, t, n) => e.renderedTicks[t]?.[n]], (e) => {
	if (!(!e || e.length === 0)) return (t) => {
		var n = Infinity, r = e[0];
		for (var i of e) {
			var a = Math.abs(i.coordinate - t);
			a < n && (n = a, r = i);
		}
		return r?.value;
	};
});
//#endregion
//#region node_modules/recharts/es6/state/selectors/selectTooltipEventType.js
var oS = (e) => e.options.defaultTooltipEventType, sS = (e) => e.options.validateTooltipEventTypes;
function cS(e, t, n) {
	if (e == null) return t;
	var r = e ? "axis" : "item";
	return n == null ? t : n.includes(r) ? r : t;
}
function lS(e, t) {
	return cS(t, oS(e), sS(e));
}
function uS(e) {
	return I((t) => lS(t, e));
}
//#endregion
//#region node_modules/recharts/es6/state/selectors/combiners/combineActiveLabel.js
var dS = (e, t) => {
	var n, r = Number(t);
	if (!(Ht(r) || t == null)) return r >= 0 ? e == null || (n = e[r]) == null ? void 0 : n.value : void 0;
}, fS = (e) => e.tooltip.settings, pS = {
	active: !1,
	index: null,
	dataKey: void 0,
	graphicalItemId: void 0,
	coordinate: void 0
}, mS = xo({
	name: "tooltip",
	initialState: {
		itemInteraction: {
			click: pS,
			hover: pS
		},
		axisInteraction: {
			click: pS,
			hover: pS
		},
		keyboardInteraction: pS,
		syncInteraction: {
			active: !1,
			index: null,
			dataKey: void 0,
			label: void 0,
			coordinate: void 0,
			sourceViewBox: void 0,
			graphicalItemId: void 0
		},
		tooltipItemPayloads: [],
		settings: {
			shared: void 0,
			trigger: "hover",
			axisId: 0,
			active: !1,
			defaultIndex: void 0
		}
	},
	reducers: {
		addTooltipEntrySettings: {
			reducer(e, t) {
				e.tooltipItemPayloads.push(J(t.payload));
			},
			prepare: oo()
		},
		replaceTooltipEntrySettings: {
			reducer(e, t) {
				var { prev: n, next: r } = t.payload, i = Ka(e).tooltipItemPayloads.indexOf(J(n));
				i > -1 && (e.tooltipItemPayloads[i] = J(r));
			},
			prepare: oo()
		},
		removeTooltipEntrySettings: {
			reducer(e, t) {
				var n = Ka(e).tooltipItemPayloads.indexOf(J(t.payload));
				n > -1 && e.tooltipItemPayloads.splice(n, 1);
			},
			prepare: oo()
		},
		setTooltipSettingsState(e, t) {
			e.settings = t.payload;
		},
		setActiveMouseOverItemIndex(e, t) {
			e.syncInteraction.active = !1, e.keyboardInteraction.active = !1, e.itemInteraction.hover.active = !0, e.itemInteraction.hover.index = t.payload.activeIndex, e.itemInteraction.hover.dataKey = t.payload.activeDataKey, e.itemInteraction.hover.graphicalItemId = t.payload.activeGraphicalItemId, e.itemInteraction.hover.coordinate = t.payload.activeCoordinate;
		},
		mouseLeaveChart(e) {
			e.itemInteraction.hover.active = !1, e.axisInteraction.hover.active = !1;
		},
		mouseLeaveItem(e) {
			e.itemInteraction.hover.active = !1;
		},
		setActiveClickItemIndex(e, t) {
			e.syncInteraction.active = !1, e.itemInteraction.click.active = !0, e.keyboardInteraction.active = !1, e.itemInteraction.click.index = t.payload.activeIndex, e.itemInteraction.click.dataKey = t.payload.activeDataKey, e.itemInteraction.click.graphicalItemId = t.payload.activeGraphicalItemId, e.itemInteraction.click.coordinate = t.payload.activeCoordinate;
		},
		setMouseOverAxisIndex(e, t) {
			e.syncInteraction.active = !1, e.axisInteraction.hover.active = !0, e.keyboardInteraction.active = !1, e.axisInteraction.hover.index = t.payload.activeIndex, e.axisInteraction.hover.dataKey = t.payload.activeDataKey, e.axisInteraction.hover.coordinate = t.payload.activeCoordinate;
		},
		setMouseClickAxisIndex(e, t) {
			e.syncInteraction.active = !1, e.keyboardInteraction.active = !1, e.axisInteraction.click.active = !0, e.axisInteraction.click.index = t.payload.activeIndex, e.axisInteraction.click.dataKey = t.payload.activeDataKey, e.axisInteraction.click.coordinate = t.payload.activeCoordinate;
		},
		setSyncInteraction(e, t) {
			e.syncInteraction = t.payload;
		},
		setKeyboardInteraction(e, t) {
			e.keyboardInteraction.active = t.payload.active, e.keyboardInteraction.index = t.payload.activeIndex, e.keyboardInteraction.coordinate = t.payload.activeCoordinate;
		}
	}
}), { addTooltipEntrySettings: hS, replaceTooltipEntrySettings: gS, removeTooltipEntrySettings: _S, setTooltipSettingsState: vS, setActiveMouseOverItemIndex: yS, mouseLeaveItem: bS, mouseLeaveChart: xS, setActiveClickItemIndex: SS, setMouseOverAxisIndex: CS, setMouseClickAxisIndex: wS, setSyncInteraction: TS, setKeyboardInteraction: ES } = mS.actions, DS = mS.reducer;
//#endregion
//#region node_modules/recharts/es6/state/selectors/combiners/combineTooltipInteractionState.js
function OS(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function kS(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? OS(Object(n), !0).forEach(function(t) {
			AS(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : OS(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function AS(e, t, n) {
	return (t = jS(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function jS(e) {
	var t = MS(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function MS(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function NS(e, t, n) {
	return t === "axis" ? n === "click" ? e.axisInteraction.click : e.axisInteraction.hover : n === "click" ? e.itemInteraction.click : e.itemInteraction.hover;
}
function PS(e) {
	return e.index != null;
}
var FS = (e, t, n, r) => {
	if (t == null) return pS;
	var i = NS(e, t, n);
	if (i == null) return pS;
	if (i.active) return i;
	if (e.keyboardInteraction.active) return e.keyboardInteraction;
	if (e.syncInteraction.active && e.syncInteraction.index != null) return e.syncInteraction;
	var a = e.settings.active === !0;
	if (PS(i)) {
		if (a) return kS(kS({}, i), {}, { active: !0 });
	} else if (r != null) return {
		active: !0,
		coordinate: void 0,
		dataKey: void 0,
		index: r,
		graphicalItemId: void 0
	};
	return kS(kS({}, pS), {}, { coordinate: i.coordinate });
};
//#endregion
//#region node_modules/recharts/es6/state/selectors/combiners/combineActiveTooltipIndex.js
function IS(e) {
	if (typeof e == "number") return Number.isFinite(e) ? e : void 0;
	if (e instanceof Date) {
		var t = e.valueOf();
		return Number.isFinite(t) ? t : void 0;
	}
	var n = Number(e);
	return Number.isFinite(n) ? n : void 0;
}
function LS(e, t) {
	var n = IS(e), r = t[0], i = t[1];
	return n === void 0 ? !1 : n >= Math.min(r, i) && n <= Math.max(r, i);
}
function RS(e, t, n) {
	if (n == null || t == null) return !0;
	var r = Ss(e, t);
	return r == null || !op(n) ? !0 : LS(r, n);
}
var zS = (e, t, n, r) => {
	var i = e?.index;
	if (i == null) return null;
	var a = Number(i);
	if (!H(a)) return i;
	var o = 0, s = Infinity;
	t.length > 0 && (s = t.length - 1);
	var c = Math.max(o, Math.min(a, s)), l = t[c];
	return l == null || RS(l, n, r) ? String(c) : null;
}, BS = (e, t, n, r, i, a, o) => {
	if (a != null) {
		var s = o[0]?.getPosition(a);
		if (s != null) return s;
		var c = i?.[Number(a)];
		if (c) switch (n) {
			case "horizontal": return {
				x: c.coordinate,
				y: (r.top + t) / 2
			};
			default: return {
				x: (r.left + e) / 2,
				y: c.coordinate
			};
		}
	}
}, VS = (e, t, n, r) => {
	if (t === "axis") return e.tooltipItemPayloads;
	if (e.tooltipItemPayloads.length === 0) return [];
	var i = n === "hover" ? e.itemInteraction.hover.graphicalItemId : e.itemInteraction.click.graphicalItemId;
	if (e.syncInteraction.active && i == null) return e.tooltipItemPayloads;
	if (i == null && r != null) {
		var a = e.tooltipItemPayloads[0];
		return a == null ? [] : [a];
	}
	return e.tooltipItemPayloads.filter((e) => e.settings?.graphicalItemId === i);
}, HS = (e) => e.options.tooltipPayloadSearcher, US = (e) => e.tooltip;
//#endregion
//#region node_modules/recharts/es6/state/selectors/combiners/combineTooltipPayload.js
function WS(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function GS(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? WS(Object(n), !0).forEach(function(t) {
			KS(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : WS(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function KS(e, t, n) {
	return (t = qS(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function qS(e) {
	var t = JS(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function JS(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function YS(e) {
	if (typeof e == "string" || typeof e == "number") return e;
}
function XS(e) {
	if (typeof e == "string" || typeof e == "number" || typeof e == "boolean") return e;
}
function ZS(e) {
	if (typeof e == "string" || typeof e == "number") return e;
	if (typeof e == "function") return (t) => e(t);
}
function QS(e) {
	if (typeof e == "string") return e;
}
function $S(e) {
	if (!(typeof e != "object" || !e)) return {
		name: "name" in e ? YS(e.name) : void 0,
		unit: "unit" in e ? XS(e.unit) : void 0,
		dataKey: "dataKey" in e ? ZS(e.dataKey) : void 0,
		payload: "payload" in e ? e.payload : void 0,
		color: "color" in e ? QS(e.color) : void 0,
		fill: "fill" in e ? QS(e.fill) : void 0
	};
}
function eC(e, t) {
	return e ?? t;
}
var tC = (e, t, n, r, i, a, o) => {
	if (!(t == null || a == null)) {
		var { chartData: s, computedData: c, dataStartIndex: l, dataEndIndex: u } = n;
		return e.reduce((e, n) => {
			var { dataDefinedOnItem: d, settings: f } = n, p = eC(d, s), m = Array.isArray(p) ? hs(p, l, u) : p, h = f?.dataKey ?? r, g = f?.nameKey, _ = r && Array.isArray(m) && !Array.isArray(m[0]) && o === "axis" ? Xt(m, r, i) : a(m, t, c, g);
			return Array.isArray(_) ? _.forEach((t) => {
				var n = $S(t), r = n?.name, i = n?.dataKey, a = n?.payload, o = GS(GS({}, f), {}, {
					name: r,
					unit: n?.unit,
					color: n?.color ?? f?.color,
					fill: n?.fill ?? f?.fill
				});
				e.push(Bs({
					tooltipEntrySettings: o,
					dataKey: i,
					payload: a,
					value: Ss(a, i),
					name: r == null ? void 0 : String(r)
				}));
			}) : e.push(Bs({
				tooltipEntrySettings: f,
				dataKey: h,
				payload: _,
				value: Ss(_, h),
				name: Ss(_, g) ?? f?.name
			})), e;
		}, []);
	}
}, nC = L([
	Fb,
	pb,
	Tp
], Ky), rC = L([
	L([(e) => e.graphicalItems.cartesianItems, (e) => e.graphicalItems.polarItems], (e, t) => [...e, ...t]),
	Fb,
	L([im, am], mb)
], _b, { memoizeOptions: { resultEqualityCheck: nm } }), iC = L([rC], (e) => e.filter(em)), aC = L([L([rC], Sb, { memoizeOptions: { resultEqualityCheck: nm } }), np], wb), oC = L([
	iC,
	np,
	Fb
], $p), sC = L([
	aC,
	Fb,
	rC
], Eb), cC = L([Fb], Hb), lC = L([cC, L([Fb], (e) => e.allowDataOverflow)], cp), uC = L([
	L([
		oC,
		L([rC], (e) => e.filter(em)),
		Cp,
		wp
	], Rb),
	np,
	im,
	lC
], Bb), dC = L([
	aC,
	Fb,
	L([rC], bb),
	Kb,
	im
], Yb, { memoizeOptions: { resultEqualityCheck: tm } }), fC = L([L([
	$b,
	im,
	am
], ex), im], ox), pC = L([L([
	nx,
	im,
	am
], ex), im], cx), mC = L([
	Fb,
	U,
	aC,
	sC,
	Cp,
	im,
	L([
		Fb,
		cC,
		lC,
		uC,
		dC,
		L([
			fC,
			L([L([
				ix,
				im,
				am
			], ex), im], fx),
			pC
		], Jb),
		U,
		im
	], mx)
], _x), hC = L([
	Fb,
	mC,
	L([
		mC,
		Fb,
		nC
	], bx),
	im
], Sx), gC = (e) => jx(e, im(e), am(e), !1), _C = L([Fb, gC], Mp), vC = L([L([
	Fb,
	nC,
	hC,
	_C
], Uy)], om), yC = L([
	U,
	Fb,
	nC,
	vC,
	gC,
	L([
		U,
		sC,
		Fb,
		im
	], $x),
	L([
		U,
		sC,
		Fb,
		im
	], Px),
	im
], (e, t, n, r, i, a, o, s) => {
	if (t) {
		var { type: c } = t, l = ws(e, s);
		if (r) {
			var u = n === "scaleBand" && r.bandwidth ? r.bandwidth() / 2 : 2, d = c === "category" && r.bandwidth ? r.bandwidth() / u : 0;
			return d = s === "angleAxis" && i != null && i?.length >= 2 ? Vt(i[0] - i[1]) * 2 * d : d, l && o ? o.map((e, t) => {
				var n = r.map(e);
				return H(n) ? {
					coordinate: n + d,
					value: e,
					index: t,
					offset: d
				} : null;
			}).filter($t) : r.domain().map((e, t) => {
				var n = r.map(e);
				return H(n) ? {
					coordinate: n + d,
					value: a ? a[e] : e,
					index: t,
					offset: d
				} : null;
			}).filter($t);
		}
	}
}), bC = L([
	oS,
	sS,
	fS
], (e, t, n) => cS(n.shared, e, t)), xC = (e) => e.tooltip.settings.trigger, SC = (e) => e.tooltip.settings.defaultIndex, CC = L([
	US,
	bC,
	xC,
	SC
], FS), wC = L([
	CC,
	aC,
	Ib,
	mC
], zS), TC = L([yC, wC], dS), EC = L([CC], (e) => {
	if (e) return e.dataKey;
}), DC = L([CC], (e) => {
	if (e) return e.graphicalItemId;
}), OC = L([
	US,
	bC,
	xC,
	SC
], VS), kC = L([CC, L([
	Ws,
	Gs,
	U,
	sc,
	yC,
	SC,
	OC
], BS)], (e, t) => e != null && e.coordinate ? e.coordinate : t), AC = L([CC], (e) => e?.active ?? !1), jC = L([L([
	OC,
	wC,
	np,
	Ib,
	TC,
	HS,
	bC
], tC)], (e) => {
	if (e != null) {
		var t = e.map((e) => e.payload).filter((e) => e != null);
		return Array.from(new Set(t));
	}
});
//#endregion
//#region node_modules/recharts/es6/context/useTooltipAxis.js
function MC(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function NC(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? MC(Object(n), !0).forEach(function(t) {
			PC(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : MC(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function PC(e, t, n) {
	return (t = FC(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function FC(e) {
	var t = IC(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function IC(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var LC = () => I(Fb), RC = () => {
	var e = LC(), t = I(yC), n = I(vC);
	return zs(!e || !n ? void 0 : NC(NC({}, e), {}, { scale: n }), t);
};
//#endregion
//#region node_modules/recharts/es6/util/getActiveCoordinate.js
function zC(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function BC(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? zC(Object(n), !0).forEach(function(t) {
			VC(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : zC(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function VC(e, t, n) {
	return (t = HC(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function HC(e) {
	var t = UC(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function UC(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var WC = (e, t, n, r) => {
	var i = t.find((e) => e && e.index === n);
	if (i) {
		if (e === "horizontal") return {
			x: i.coordinate,
			y: r.relativeY
		};
		if (e === "vertical") return {
			x: r.relativeX,
			y: i.coordinate
		};
	}
	return {
		x: 0,
		y: 0
	};
}, GC = (e, t, n, r) => {
	var i = t.find((e) => e && e.index === n);
	if (i) {
		if (e === "centric") {
			var a = i.coordinate, { radius: o } = r;
			return BC(BC(BC({}, r), kf(r.cx, r.cy, o, a)), {}, {
				angle: a,
				radius: o
			});
		}
		var s = i.coordinate, { angle: c } = r;
		return BC(BC(BC({}, r), kf(r.cx, r.cy, s, c)), {}, {
			angle: c,
			radius: s
		});
	}
	return {
		angle: 0,
		clockWise: !1,
		cx: 0,
		cy: 0,
		endAngle: 0,
		innerRadius: 0,
		outerRadius: 0,
		radius: 0,
		startAngle: 0,
		x: 0,
		y: 0
	};
};
function KC(e, t) {
	var { relativeX: n, relativeY: r } = e;
	return n >= t.left && n <= t.left + t.width && r >= t.top && r <= t.top + t.height;
}
var qC = (e, t, n, r, i) => {
	var a = t?.length ?? 0;
	if (a <= 1 || e == null) return 0;
	if (r === "angleAxis" && i != null && Math.abs(Math.abs(i[1] - i[0]) - 360) <= 1e-6) for (var o = 0; o < a; o++) {
		var s = o > 0 ? n[o - 1]?.coordinate : n[a - 1]?.coordinate, c = n[o]?.coordinate, l = o >= a - 1 ? n[0]?.coordinate : n[o + 1]?.coordinate, u = void 0;
		if (!(s == null || c == null || l == null)) if (Vt(c - s) !== Vt(l - c)) {
			var d = [];
			if (Vt(l - c) === Vt(i[1] - i[0])) {
				u = l;
				var f = c + i[1] - i[0];
				d[0] = Math.min(f, (f + s) / 2), d[1] = Math.max(f, (f + s) / 2);
			} else {
				u = s;
				var p = l + i[1] - i[0];
				d[0] = Math.min(c, (p + c) / 2), d[1] = Math.max(c, (p + c) / 2);
			}
			var m = [Math.min(c, (u + c) / 2), Math.max(c, (u + c) / 2)];
			if (e > m[0] && e <= m[1] || e >= d[0] && e <= d[1]) return n[o]?.index;
		} else {
			var h = Math.min(s, l), g = Math.max(s, l);
			if (e > (h + c) / 2 && e <= (g + c) / 2) return n[o]?.index;
		}
	}
	else if (t) for (var _ = 0; _ < a; _++) {
		var v = t[_];
		if (v != null) {
			var y = t[_ + 1], b = t[_ - 1];
			if (_ === 0 && y != null && e <= (v.coordinate + y.coordinate) / 2 || _ === a - 1 && b != null && e > (v.coordinate + b.coordinate) / 2 || _ > 0 && _ < a - 1 && b != null && y != null && e > (v.coordinate + b.coordinate) / 2 && e <= (v.coordinate + y.coordinate) / 2) return v.index;
		}
	}
	return -1;
}, JC = () => I(Tp), YC = (e, t) => t, XC = (e, t, n) => n, ZC = (e, t, n, r) => r, QC = L(yC, (e) => mi(e, (e) => e.coordinate)), $C = L([
	US,
	YC,
	XC,
	ZC
], FS), ew = L([
	$C,
	aC,
	Ib,
	mC
], zS), tw = (e, t, n) => {
	if (t != null) {
		var r = US(e);
		return t === "axis" ? n === "hover" ? r.axisInteraction.hover.dataKey : r.axisInteraction.click.dataKey : n === "hover" ? r.itemInteraction.hover.dataKey : r.itemInteraction.click.dataKey;
	}
}, nw = L([
	US,
	YC,
	XC,
	ZC
], VS), rw = L([
	Ws,
	Gs,
	U,
	sc,
	yC,
	ZC,
	nw
], BS), iw = L([$C, rw], (e, t) => e.coordinate ?? t), aw = L([yC, ew], dS), ow = L([
	nw,
	ew,
	np,
	Ib,
	aw,
	HS,
	YC
], tC), sw = L([$C, ew], (e, t) => ({
	isActive: e.active && t != null,
	activeIndex: t
})), cw = (e, t, n, r, i, a, o) => {
	if (!(!e || !n || !r || !i) && KC(e, o)) {
		var s = qC(Hs(e, t), a, i, n, r), c = WC(t, i, s, e);
		return {
			activeIndex: String(s),
			activeCoordinate: c
		};
	}
}, lw = (e, t, n, r, i, a, o) => {
	if (!(!e || !r || !i || !a || !n)) {
		var s = Ff(e, n);
		if (s) {
			var c = qC(Us(s, t), o, a, r, i), l = GC(t, a, c, s);
			return {
				activeIndex: String(c),
				activeCoordinate: l
			};
		}
	}
}, uw = (e, t, n, r, i, a, o, s) => {
	if (!(!e || !t || !r || !i || !a)) return t === "horizontal" || t === "vertical" ? cw(e, t, r, i, a, o, s) : lw(e, t, n, r, i, a, o);
}, dw = L((e) => e.zIndex.zIndexMap, (e, t) => t, (e, t, n) => n, (e, t, n) => {
	if (t != null) {
		var r = e[t];
		if (r != null) return n ? r.panoramaElement : r.element;
	}
}), fw = L((e) => e.zIndex.zIndexMap, (e) => {
	var t = Object.keys(e).map((e) => parseInt(e, 10)).concat(Object.values(kp));
	return Array.from(new Set(t)).sort((e, t) => e - t);
}, { memoizeOptions: { resultEqualityCheck: rm } });
//#endregion
//#region node_modules/recharts/es6/state/zIndexSlice.js
function pw(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function mw(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? pw(Object(n), !0).forEach(function(t) {
			hw(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : pw(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function hw(e, t, n) {
	return (t = gw(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function gw(e) {
	var t = _w(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function _w(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var vw = { zIndexMap: Object.values(kp).reduce((e, t) => mw(mw({}, e), {}, { [t]: {
	element: void 0,
	panoramaElement: void 0,
	consumers: 0
} }), {}) }, yw = new Set(Object.values(kp));
function bw(e) {
	return yw.has(e);
}
var xw = xo({
	name: "zIndex",
	initialState: vw,
	reducers: {
		registerZIndexPortal: {
			reducer: (e, t) => {
				var { zIndex: n } = t.payload;
				e.zIndexMap[n] ? e.zIndexMap[n].consumers += 1 : e.zIndexMap[n] = {
					consumers: 1,
					element: void 0,
					panoramaElement: void 0
				};
			},
			prepare: oo()
		},
		unregisterZIndexPortal: {
			reducer: (e, t) => {
				var { zIndex: n } = t.payload;
				e.zIndexMap[n] && (--e.zIndexMap[n].consumers, e.zIndexMap[n].consumers <= 0 && !bw(n) && delete e.zIndexMap[n]);
			},
			prepare: oo()
		},
		registerZIndexPortalElement: {
			reducer: (e, t) => {
				var { zIndex: n, element: r, isPanorama: i } = t.payload;
				e.zIndexMap[n] ? i ? e.zIndexMap[n].panoramaElement = J(r) : e.zIndexMap[n].element = J(r) : e.zIndexMap[n] = {
					consumers: 0,
					element: i ? void 0 : J(r),
					panoramaElement: i ? J(r) : void 0
				};
			},
			prepare: oo()
		},
		unregisterZIndexPortalElement: {
			reducer: (e, t) => {
				var { zIndex: n } = t.payload;
				e.zIndexMap[n] && (t.payload.isPanorama ? e.zIndexMap[n].panoramaElement = void 0 : e.zIndexMap[n].element = void 0);
			},
			prepare: oo()
		}
	}
}), { registerZIndexPortal: Sw, unregisterZIndexPortal: Cw, registerZIndexPortalElement: ww, unregisterZIndexPortalElement: Tw } = xw.actions, Ew = xw.reducer, Dw = h();
function Ow(e) {
	var { zIndex: t, children: n } = e, r = Jc() && t !== void 0 && t !== 0, i = dc(), a = Vr();
	(0, S.useLayoutEffect)(() => r ? (a(Sw({ zIndex: t })), () => {
		a(Cw({ zIndex: t }));
	}) : en, [
		a,
		t,
		r
	]);
	var o = I((e) => dw(e, t, i));
	return r ? o ? /* @__PURE__ */ (0, Dw.createPortal)(n, o) : null : n;
}
//#endregion
//#region node_modules/recharts/es6/component/Cursor.js
function kw() {
	return kw = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, kw.apply(null, arguments);
}
function Aw(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function jw(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Aw(Object(n), !0).forEach(function(t) {
			Mw(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Aw(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Mw(e, t, n) {
	return (t = Nw(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Nw(e) {
	var t = Pw(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Pw(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Fw(e) {
	var { cursor: t, cursorComp: n, cursorProps: r } = e;
	return /* @__PURE__ */ (0, S.isValidElement)(t) ? /* @__PURE__ */ (0, S.cloneElement)(t, r) : /* @__PURE__ */ (0, S.createElement)(n, r);
}
function Iw(e) {
	var { coordinate: t, payload: n, index: r, offset: i, tooltipAxisBandSize: a, layout: o, cursor: s, tooltipEventType: c, chartName: l } = e, u = t, d = n, f = r;
	if (!s || !u || l !== "ScatterChart" && c !== "axis") return null;
	var p, m, h;
	if (l === "ScatterChart") p = u, m = ud, h = kp.cursorLine;
	else if (l === "BarChart") p = dd(o, u, i, a), m = xf, h = kp.cursorRectangle;
	else if (o === "radial" && _n(u)) {
		var { cx: g, cy: _, radius: v, startAngle: b, endAngle: x } = If(u);
		p = {
			cx: g,
			cy: _,
			startAngle: b,
			endAngle: x,
			innerRadius: v,
			outerRadius: v
		}, m = Zf, h = kp.cursorLine;
	} else p = { points: Qf(o, u, i) }, m = $u, h = kp.cursorLine;
	var C = typeof s == "object" && "className" in s ? s.className : void 0, w = jw(jw(jw(jw({
		stroke: "#ccc",
		pointerEvents: "none"
	}, i), p), D(s)), {}, {
		payload: d,
		payloadIndex: f,
		className: y("recharts-tooltip-cursor", C)
	});
	return /* @__PURE__ */ S.createElement(Ow, { zIndex: e.zIndex ?? h }, /* @__PURE__ */ S.createElement(Fw, {
		cursor: s,
		cursorComp: m,
		cursorProps: w
	}));
}
function Lw(e) {
	var t = RC(), n = Hc(), r = Gc(), i = JC();
	return t == null || n == null || r == null || i == null ? null : /* @__PURE__ */ S.createElement(Iw, kw({}, e, {
		offset: n,
		layout: r,
		tooltipAxisBandSize: t,
		chartName: i
	}));
}
//#endregion
//#region node_modules/recharts/es6/context/tooltipPortalContext.js
var Rw = /* @__PURE__ */ (0, S.createContext)(null), zw = () => (0, S.useContext)(Rw), Bw = (/* @__PURE__ */ l((/* @__PURE__ */ o(((e, t) => {
	var n = Object.prototype.hasOwnProperty, r = "~";
	function i() {}
	Object.create && (i.prototype = Object.create(null), new i().__proto__ || (r = !1));
	function a(e, t, n) {
		this.fn = e, this.context = t, this.once = n || !1;
	}
	function o(e, t, n, i, o) {
		if (typeof n != "function") throw TypeError("The listener must be a function");
		var s = new a(n, i || e, o), c = r ? r + t : t;
		return e._events[c] ? e._events[c].fn ? e._events[c] = [e._events[c], s] : e._events[c].push(s) : (e._events[c] = s, e._eventsCount++), e;
	}
	function s(e, t) {
		--e._eventsCount === 0 ? e._events = new i() : delete e._events[t];
	}
	function c() {
		this._events = new i(), this._eventsCount = 0;
	}
	c.prototype.eventNames = function() {
		var e = [], t, i;
		if (this._eventsCount === 0) return e;
		for (i in t = this._events) n.call(t, i) && e.push(r ? i.slice(1) : i);
		return Object.getOwnPropertySymbols ? e.concat(Object.getOwnPropertySymbols(t)) : e;
	}, c.prototype.listeners = function(e) {
		var t = r ? r + e : e, n = this._events[t];
		if (!n) return [];
		if (n.fn) return [n.fn];
		for (var i = 0, a = n.length, o = Array(a); i < a; i++) o[i] = n[i].fn;
		return o;
	}, c.prototype.listenerCount = function(e) {
		var t = r ? r + e : e, n = this._events[t];
		return n ? n.fn ? 1 : n.length : 0;
	}, c.prototype.emit = function(e, t, n, i, a, o) {
		var s = r ? r + e : e;
		if (!this._events[s]) return !1;
		var c = this._events[s], l = arguments.length, u, d;
		if (c.fn) {
			switch (c.once && this.removeListener(e, c.fn, void 0, !0), l) {
				case 1: return c.fn.call(c.context), !0;
				case 2: return c.fn.call(c.context, t), !0;
				case 3: return c.fn.call(c.context, t, n), !0;
				case 4: return c.fn.call(c.context, t, n, i), !0;
				case 5: return c.fn.call(c.context, t, n, i, a), !0;
				case 6: return c.fn.call(c.context, t, n, i, a, o), !0;
			}
			for (d = 1, u = Array(l - 1); d < l; d++) u[d - 1] = arguments[d];
			c.fn.apply(c.context, u);
		} else {
			var f = c.length, p;
			for (d = 0; d < f; d++) switch (c[d].once && this.removeListener(e, c[d].fn, void 0, !0), l) {
				case 1:
					c[d].fn.call(c[d].context);
					break;
				case 2:
					c[d].fn.call(c[d].context, t);
					break;
				case 3:
					c[d].fn.call(c[d].context, t, n);
					break;
				case 4:
					c[d].fn.call(c[d].context, t, n, i);
					break;
				default:
					if (!u) for (p = 1, u = Array(l - 1); p < l; p++) u[p - 1] = arguments[p];
					c[d].fn.apply(c[d].context, u);
			}
		}
		return !0;
	}, c.prototype.on = function(e, t, n) {
		return o(this, e, t, n, !1);
	}, c.prototype.once = function(e, t, n) {
		return o(this, e, t, n, !0);
	}, c.prototype.removeListener = function(e, t, n, i) {
		var a = r ? r + e : e;
		if (!this._events[a]) return this;
		if (!t) return s(this, a), this;
		var o = this._events[a];
		if (o.fn) o.fn === t && (!i || o.once) && (!n || o.context === n) && s(this, a);
		else {
			for (var c = 0, l = [], u = o.length; c < u; c++) (o[c].fn !== t || i && !o[c].once || n && o[c].context !== n) && l.push(o[c]);
			l.length ? this._events[a] = l.length === 1 ? l[0] : l : s(this, a);
		}
		return this;
	}, c.prototype.removeAllListeners = function(e) {
		var t;
		return e ? (t = r ? r + e : e, this._events[t] && s(this, t)) : (this._events = new i(), this._eventsCount = 0), this;
	}, c.prototype.off = c.prototype.removeListener, c.prototype.addListener = c.prototype.on, c.prefixed = r, c.EventEmitter = c, t !== void 0 && (t.exports = c);
})))(), 1)).default, Vw = new Bw(), Hw = "recharts.syncEvent.tooltip", Uw = "recharts.syncEvent.brush", Ww = (e, t) => {
	if (t && Array.isArray(e)) {
		var n = Number.parseInt(t, 10);
		if (!Ht(n)) return e[n];
	}
}, Gw = xo({
	name: "options",
	initialState: {
		chartName: "",
		tooltipPayloadSearcher: () => void 0,
		eventEmitter: void 0,
		defaultTooltipEventType: "axis"
	},
	reducers: { createEventEmitter: (e) => {
		e.eventEmitter ??= Symbol("rechartsEventEmitter");
	} }
}), Kw = Gw.reducer, { createEventEmitter: qw } = Gw.actions;
//#endregion
//#region node_modules/recharts/es6/synchronisation/syncSelectors.js
function Jw(e) {
	return e.tooltip.syncInteraction;
}
var Yw = xo({
	name: "chartData",
	initialState: {
		chartData: void 0,
		computedData: void 0,
		dataStartIndex: 0,
		dataEndIndex: 0
	},
	reducers: {
		setChartData(e, t) {
			if (e.chartData = J(t.payload), t.payload == null) {
				e.dataStartIndex = 0, e.dataEndIndex = 0;
				return;
			}
			t.payload.length > 0 && e.dataEndIndex !== t.payload.length - 1 && (e.dataEndIndex = t.payload.length - 1);
		},
		setComputedData(e, t) {
			e.computedData = t.payload;
		},
		setDataStartEndIndexes(e, t) {
			var { startIndex: n, endIndex: r } = t.payload;
			n != null && (e.dataStartIndex = n), r != null && (e.dataEndIndex = r);
		}
	}
}), { setChartData: Xw, setDataStartEndIndexes: Zw, setComputedData: Qw } = Yw.actions, $w = Yw.reducer, eT = ["x", "y"];
function tT(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function nT(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? tT(Object(n), !0).forEach(function(t) {
			rT(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : tT(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function rT(e, t, n) {
	return (t = iT(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function iT(e) {
	var t = aT(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function aT(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function oT(e, t) {
	if (e == null) return {};
	var n, r, i = sT(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function sT(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function cT() {
	var e = I(Ep), t = I(Op), n = Vr(), r = I(Dp), i = I(yC), a = Gc(), o = Bc();
	(0, S.useEffect)(() => {
		if (e == null) return en;
		var s = (s, c, l) => {
			if (t !== l && e === s) {
				if (r === "index") {
					var u;
					if (o && c != null && (u = c.payload) != null && u.coordinate && c.payload.sourceViewBox) {
						var d = c.payload.coordinate, { x: f, y: p } = d, m = oT(d, eT), { x: h, y: g, width: _, height: v } = c.payload.sourceViewBox, y = nT(nT({}, m), {}, {
							x: o.x + (_ ? (f - h) / _ : 0) * o.width,
							y: o.y + (v ? (p - g) / v : 0) * o.height
						});
						n(nT(nT({}, c), {}, { payload: nT(nT({}, c.payload), {}, { coordinate: y }) }));
					} else n(c);
					return;
				}
				if (i != null) {
					var b;
					typeof r == "function" ? b = i[r(i, {
						activeTooltipIndex: c.payload.index == null ? void 0 : Number(c.payload.index),
						isTooltipActive: c.payload.active,
						activeIndex: c.payload.index == null ? void 0 : Number(c.payload.index),
						activeLabel: c.payload.label,
						activeDataKey: c.payload.dataKey,
						activeCoordinate: c.payload.coordinate
					})] : r === "value" && (b = i.find((e) => String(e.value) === c.payload.label));
					var { coordinate: x } = c.payload;
					if (b == null || c.payload.active === !1 || x == null || o == null) {
						n(TS({
							active: !1,
							coordinate: void 0,
							dataKey: void 0,
							index: null,
							label: void 0,
							sourceViewBox: void 0,
							graphicalItemId: void 0
						}));
						return;
					}
					var { x: S, y: C } = x, w = Math.min(S, o.x + o.width), T = Math.min(C, o.y + o.height), E = {
						x: a === "horizontal" ? b.coordinate : w,
						y: a === "horizontal" ? T : b.coordinate
					};
					n(TS({
						active: c.payload.active,
						coordinate: E,
						dataKey: c.payload.dataKey,
						index: String(b.index),
						label: c.payload.label,
						sourceViewBox: c.payload.sourceViewBox,
						graphicalItemId: c.payload.graphicalItemId
					}));
				}
			}
		};
		return Vw.on(Hw, s), () => {
			Vw.off(Hw, s);
		};
	}, [
		I((e) => e.rootProps.className),
		n,
		t,
		e,
		r,
		i,
		a,
		o
	]);
}
function lT() {
	var e = I(Ep), t = I(Op), n = Vr();
	(0, S.useEffect)(() => {
		if (e == null) return en;
		var r = (r, i, a) => {
			t !== a && e === r && n(Zw(i));
		};
		return Vw.on(Uw, r), () => {
			Vw.off(Uw, r);
		};
	}, [
		n,
		t,
		e
	]);
}
function uT() {
	var e = Vr();
	(0, S.useEffect)(() => {
		e(qw());
	}, [e]), cT(), lT();
}
function dT(e, t, n, r, i, a) {
	var o = I((n) => tw(n, e, t)), s = I(DC), c = I(Op), l = I(Ep), u = I(Dp), d = I(Jw)?.active, f = Bc();
	(0, S.useEffect)(() => {
		if (!d && l != null && c != null) {
			var e = TS({
				active: a,
				coordinate: n,
				dataKey: o,
				index: i,
				label: typeof r == "number" ? String(r) : r,
				sourceViewBox: f,
				graphicalItemId: s
			});
			Vw.emit(Hw, l, e, c);
		}
	}, [
		d,
		n,
		o,
		s,
		i,
		r,
		c,
		l,
		u,
		a,
		f
	]);
}
//#endregion
//#region node_modules/recharts/es6/component/Tooltip.js
function fT(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function pT(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? fT(Object(n), !0).forEach(function(t) {
			mT(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : fT(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function mT(e, t, n) {
	return (t = hT(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function hT(e) {
	var t = gT(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function gT(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function _T(e) {
	return e.dataKey;
}
function vT(e, t) {
	return /* @__PURE__ */ S.isValidElement(e) ? /* @__PURE__ */ S.cloneElement(e, t) : typeof e == "function" ? /* @__PURE__ */ S.createElement(e, t) : /* @__PURE__ */ S.createElement(Su, t);
}
var yT = [], bT = {
	allowEscapeViewBox: {
		x: !1,
		y: !1
	},
	animationDuration: 400,
	animationEasing: "ease",
	axisId: 0,
	contentStyle: {},
	cursor: !0,
	filterNull: !0,
	includeHidden: !1,
	isAnimationActive: "auto",
	itemSorter: "name",
	itemStyle: {},
	labelStyle: {},
	offset: 10,
	reverseDirection: {
		x: !1,
		y: !1
	},
	separator: " : ",
	trigger: "hover",
	useTranslate3d: !1,
	wrapperStyle: {}
};
function xT(e) {
	var t = En(e, bT), { active: n, allowEscapeViewBox: r, animationDuration: i, animationEasing: a, content: o, filterNull: s, isAnimationActive: c, offset: l, payloadUniqBy: u, position: d, reverseDirection: f, useTranslate3d: p, wrapperStyle: m, cursor: h, shared: g, trigger: _, defaultIndex: v, portal: y, axisId: b } = t, x = Vr(), C = typeof v == "number" ? String(v) : v;
	(0, S.useEffect)(() => {
		x(vS({
			shared: g,
			trigger: _,
			axisId: b,
			active: n,
			defaultIndex: C
		}));
	}, [
		x,
		g,
		_,
		b,
		n,
		C
	]);
	var w = Bc(), T = zu(), E = uS(g), { activeIndex: D, isActive: O } = I((e) => sw(e, E, _, C)) ?? {}, k = I((e) => ow(e, E, _, C)), ee = I((e) => aw(e, E, _, C)), te = I((e) => iw(e, E, _, C)), ne = k, A = zw(), re = n ?? O ?? !1, [ie, j] = vi([ne, re]), M = E === "axis" ? ee : void 0;
	dT(E, _, te, M, D, re);
	var ae = y ?? A;
	if (ae == null || w == null || E == null) return null;
	var oe = ne ?? yT;
	re || (oe = yT), s && oe.length && (oe = Nr(oe.filter((e) => e.value != null && (e.hide !== !0 || t.includeHidden)), u, _T));
	var se = oe.length > 0, N = pT(pT({}, t), {}, {
		payload: oe,
		label: M,
		active: re,
		activeIndex: D,
		coordinate: te,
		accessibilityLayer: T
	}), ce = /* @__PURE__ */ S.createElement(Ru, {
		allowEscapeViewBox: r,
		animationDuration: i,
		animationEasing: a,
		isAnimationActive: c,
		active: re,
		coordinate: te,
		hasPayload: se,
		offset: l,
		position: d,
		reverseDirection: f,
		useTranslate3d: p,
		viewBox: w,
		wrapperStyle: m,
		lastBoundingBox: ie,
		innerRef: j,
		hasPortalFromProps: !!y
	}, vT(o, N));
	return /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ (0, Dw.createPortal)(ce, ae), re && /* @__PURE__ */ S.createElement(Lw, {
		cursor: h,
		tooltipEventType: E,
		coordinate: te,
		payload: oe,
		index: D
	}));
}
//#endregion
//#region node_modules/recharts/es6/component/Cell.js
var ST = (e) => null;
ST.displayName = "Cell";
//#endregion
//#region node_modules/recharts/es6/util/LRUCache.js
function CT(e, t, n) {
	return (t = wT(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function wT(e) {
	var t = TT(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function TT(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var ET = class {
	constructor(e) {
		CT(this, "cache", /* @__PURE__ */ new Map()), this.maxSize = e;
	}
	get(e) {
		var t = this.cache.get(e);
		return t !== void 0 && (this.cache.delete(e), this.cache.set(e, t)), t;
	}
	set(e, t) {
		if (this.cache.has(e)) this.cache.delete(e);
		else if (this.cache.size >= this.maxSize) {
			var n = this.cache.keys().next().value;
			n != null && this.cache.delete(n);
		}
		this.cache.set(e, t);
	}
	clear() {
		this.cache.clear();
	}
	size() {
		return this.cache.size;
	}
};
//#endregion
//#region node_modules/recharts/es6/util/DOMUtils.js
function DT(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function OT(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? DT(Object(n), !0).forEach(function(t) {
			kT(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : DT(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function kT(e, t, n) {
	return (t = AT(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function AT(e) {
	var t = jT(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function jT(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var MT = OT({}, {
	cacheSize: 2e3,
	enableCache: !0
}), NT = new ET(MT.cacheSize), PT = {
	position: "absolute",
	top: "-20000px",
	left: 0,
	padding: 0,
	margin: 0,
	border: "none",
	whiteSpace: "pre"
}, FT = "recharts_measurement_span";
function IT(e, t) {
	return `${e}|${t.fontSize || ""}|${t.fontFamily || ""}|${t.fontWeight || ""}|${t.fontStyle || ""}|${t.letterSpacing || ""}|${t.textTransform || ""}`;
}
var LT = (e, t) => {
	try {
		var n = document.getElementById(FT);
		n || (n = document.createElement("span"), n.setAttribute("id", FT), n.setAttribute("aria-hidden", "true"), document.body.appendChild(n)), Object.assign(n.style, PT, t), n.textContent = `${e}`;
		var r = n.getBoundingClientRect();
		return {
			width: r.width,
			height: r.height
		};
	} catch {
		return {
			width: 0,
			height: 0
		};
	}
}, RT = function(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	if (e == null || ku.isSsr) return {
		width: 0,
		height: 0
	};
	if (!MT.enableCache) return LT(e, t);
	var n = IT(e, t), r = NT.get(n);
	if (r) return r;
	var i = LT(e, t);
	return NT.set(n, i), i;
}, zT;
function BT(e, t, n) {
	return (t = VT(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function VT(e) {
	var t = HT(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function HT(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var UT = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, WT = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, GT = /^(px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q)$/, KT = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/, qT = {
	cm: 96 / 2.54,
	mm: 96 / 25.4,
	pt: 96 / 72,
	pc: 96 / 6,
	in: 96,
	Q: 96 / (2.54 * 40),
	px: 1
}, JT = [
	"cm",
	"mm",
	"pt",
	"pc",
	"in",
	"Q",
	"px"
];
function YT(e) {
	return JT.includes(e);
}
var XT = "NaN";
function ZT(e, t) {
	return e * qT[t];
}
var QT = class e {
	static parse(t) {
		var [, n, r] = KT.exec(t) ?? [];
		return n == null ? e.NaN : new e(parseFloat(n), r ?? "");
	}
	constructor(e, t) {
		this.num = e, this.unit = t, this.num = e, this.unit = t, Ht(e) && (this.unit = ""), t !== "" && !GT.test(t) && (this.num = NaN, this.unit = ""), YT(t) && (this.num = ZT(e, t), this.unit = "px");
	}
	add(t) {
		return this.unit === t.unit ? new e(this.num + t.num, this.unit) : new e(NaN, "");
	}
	subtract(t) {
		return this.unit === t.unit ? new e(this.num - t.num, this.unit) : new e(NaN, "");
	}
	multiply(t) {
		return this.unit !== "" && t.unit !== "" && this.unit !== t.unit ? new e(NaN, "") : new e(this.num * t.num, this.unit || t.unit);
	}
	divide(t) {
		return this.unit !== "" && t.unit !== "" && this.unit !== t.unit ? new e(NaN, "") : new e(this.num / t.num, this.unit || t.unit);
	}
	toString() {
		return `${this.num}${this.unit}`;
	}
	isNaN() {
		return Ht(this.num);
	}
};
zT = QT, BT(QT, "NaN", new zT(NaN, ""));
function $T(e) {
	if (e == null || e.includes(XT)) return XT;
	for (var t = e; t.includes("*") || t.includes("/");) {
		var [, n, r, i] = UT.exec(t) ?? [], a = QT.parse(n ?? ""), o = QT.parse(i ?? ""), s = r === "*" ? a.multiply(o) : a.divide(o);
		if (s.isNaN()) return XT;
		t = t.replace(UT, s.toString());
	}
	for (; t.includes("+") || /.-\d+(?:\.\d+)?/.test(t);) {
		var [, c, l, u] = WT.exec(t) ?? [], d = QT.parse(c ?? ""), f = QT.parse(u ?? ""), p = l === "+" ? d.add(f) : d.subtract(f);
		if (p.isNaN()) return XT;
		t = t.replace(WT, p.toString());
	}
	return t;
}
var eE = /\(([^()]*)\)/;
function tE(e) {
	for (var t = e, n; (n = eE.exec(t)) != null;) {
		var [, r] = n;
		t = t.replace(eE, $T(r));
	}
	return t;
}
function nE(e) {
	var t = e.replace(/\s+/g, "");
	return t = tE(t), t = $T(t), t;
}
function rE(e) {
	try {
		return nE(e);
	} catch {
		return XT;
	}
}
function iE(e) {
	var t = rE(e.slice(5, -1));
	return t === XT ? "" : t;
}
//#endregion
//#region node_modules/recharts/es6/component/Text.js
var aE = [
	"x",
	"y",
	"lineHeight",
	"capHeight",
	"fill",
	"scaleToFit",
	"textAnchor",
	"verticalAnchor"
], oE = [
	"dx",
	"dy",
	"angle",
	"className",
	"breakAll"
];
function sE() {
	return sE = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, sE.apply(null, arguments);
}
function cE(e, t) {
	if (e == null) return {};
	var n, r, i = lE(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function lE(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var uE = /[ \f\n\r\t\v\u2028\u2029]+/, dE = (e) => {
	var { children: t, breakAll: n, style: r } = e;
	try {
		var i = [];
		return Zt(t) || (i = n ? t.toString().split("") : t.toString().split(uE)), {
			wordsWithComputedWidth: i.map((e) => ({
				word: e,
				width: RT(e, r).width
			})),
			spaceWidth: n ? 0 : RT("\xA0", r).width
		};
	} catch {
		return null;
	}
};
function fE(e) {
	return e === "start" || e === "middle" || e === "end" || e === "inherit";
}
function pE(e) {
	return Zt(e) || typeof e == "string" || typeof e == "number" || typeof e == "boolean";
}
var mE = (e, t, n, r) => e.reduce((e, i) => {
	var { word: a, width: o } = i, s = e[e.length - 1];
	if (s && o != null && (t == null || r || s.width + o + n < Number(t))) s.words.push(a), s.width += o + n;
	else {
		var c = {
			words: [a],
			width: o
		};
		e.push(c);
	}
	return e;
}, []), hE = (e) => e.reduce((e, t) => e.width > t.width ? e : t), gE = "…", _E = (e, t, n, r, i, a, o, s) => {
	var c = dE({
		breakAll: n,
		style: r,
		children: e.slice(0, t) + gE
	});
	if (!c) return [!1, []];
	var l = mE(c.wordsWithComputedWidth, a, o, s);
	return [l.length > i || hE(l).width > Number(a), l];
}, vE = (e, t, n, r, i) => {
	var { maxLines: a, children: o, style: s, breakAll: c } = e, l = F(a), u = String(o), d = mE(t, r, n, i);
	if (!l || i || !(d.length > a || hE(d).width > Number(r))) return d;
	for (var f = 0, p = u.length - 1, m = 0, h; f <= p && m <= u.length - 1;) {
		var g = Math.floor((f + p) / 2), [_, v] = _E(u, g - 1, c, s, a, r, n, i), [y] = _E(u, g, c, s, a, r, n, i);
		if (!_ && !y && (f = g + 1), _ && y && (p = g - 1), !_ && y) {
			h = v;
			break;
		}
		m++;
	}
	return h || d;
}, yE = (e) => [{
	words: Zt(e) ? [] : e.toString().split(uE),
	width: void 0
}], bE = (e) => {
	var { width: t, scaleToFit: n, children: r, style: i, breakAll: a, maxLines: o } = e;
	if ((t || n) && !ku.isSsr) {
		var s, c, l = dE({
			breakAll: a,
			children: r,
			style: i
		});
		if (l) {
			var { wordsWithComputedWidth: u, spaceWidth: d } = l;
			s = u, c = d;
		} else return yE(r);
		return vE({
			breakAll: a,
			children: r,
			maxLines: o,
			style: i
		}, s, c, t, !!n);
	}
	return yE(r);
}, xE = "#808080", SE = {
	angle: 0,
	breakAll: !1,
	capHeight: "0.71em",
	fill: xE,
	lineHeight: "1em",
	scaleToFit: !1,
	textAnchor: "start",
	verticalAnchor: "end",
	x: 0,
	y: 0
}, CE = /* @__PURE__ */ (0, S.forwardRef)((e, t) => {
	var n = En(e, SE), { x: r, y: i, lineHeight: a, capHeight: o, fill: s, scaleToFit: c, textAnchor: l, verticalAnchor: u } = n, d = cE(n, aE), f = (0, S.useMemo)(() => bE({
		breakAll: d.breakAll,
		children: d.children,
		maxLines: d.maxLines,
		scaleToFit: c,
		style: d.style,
		width: d.width
	}), [
		d.breakAll,
		d.children,
		d.maxLines,
		c,
		d.style,
		d.width
	]), { dx: p, dy: m, angle: h, className: g, breakAll: _ } = d, v = cE(d, oE);
	if (!Wt(r) || !Wt(i) || f.length === 0) return null;
	var b = Number(r) + (F(p) ? p : 0), x = Number(i) + (F(m) ? m : 0);
	if (!H(b) || !H(x)) return null;
	var C;
	switch (u) {
		case "start":
			C = iE(`calc(${o})`);
			break;
		case "middle":
			C = iE(`calc(${(f.length - 1) / 2} * -${a} + (${o} / 2))`);
			break;
		default:
			C = iE(`calc(${f.length - 1} * -${a})`);
			break;
	}
	var w = [], T = f[0];
	if (c && T != null) {
		var E = T.width, { width: D } = d;
		w.push(`scale(${F(D) && F(E) ? D / E : 1})`);
	}
	return h && w.push(`rotate(${h}, ${b}, ${x})`), w.length && (v.transform = w.join(" ")), /* @__PURE__ */ S.createElement("text", sE({}, O(v), {
		ref: t,
		x: b,
		y: x,
		className: y("recharts-text", g),
		textAnchor: l,
		fill: s.includes("url") ? xE : s
	}), f.map((e, t) => {
		var n = e.words.join(_ ? "" : " ");
		return /* @__PURE__ */ S.createElement("tspan", {
			x: b,
			dy: t === 0 ? C : a,
			key: `${n}-${t}`
		}, n);
	}));
});
CE.displayName = "Text";
//#endregion
//#region node_modules/recharts/es6/cartesian/getCartesianPosition.js
function wE(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function TE(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? wE(Object(n), !0).forEach(function(t) {
			EE(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : wE(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function EE(e, t, n) {
	return (t = DE(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function DE(e) {
	var t = OE(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function OE(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var kE = (e) => {
	var { viewBox: t, position: n, offset: r = 0, parentViewBox: i, clamp: a } = e, { x: o, y: s, height: c, upperWidth: l, lowerWidth: u } = zc(t), d = o, f = o + (l - u) / 2, p = (d + f) / 2, m = (l + u) / 2, h = d + l / 2, g = c >= 0 ? 1 : -1, _ = g * r, v = g > 0 ? "end" : "start", y = g > 0 ? "start" : "end", b = l >= 0 ? 1 : -1, x = b * r, S = b > 0 ? "end" : "start", C = b > 0 ? "start" : "end", w = i;
	if (n === "top") {
		var T = {
			x: d + l / 2,
			y: s - _,
			horizontalAnchor: "middle",
			verticalAnchor: v
		};
		return a && w && (T.height = Math.max(s - w.y, 0), T.width = l), T;
	}
	if (n === "bottom") {
		var E = {
			x: f + u / 2,
			y: s + c + _,
			horizontalAnchor: "middle",
			verticalAnchor: y
		};
		return a && w && (E.height = Math.max(w.y + w.height - (s + c), 0), E.width = u), E;
	}
	if (n === "left") {
		var D = {
			x: p - x,
			y: s + c / 2,
			horizontalAnchor: S,
			verticalAnchor: "middle"
		};
		return a && w && (D.width = Math.max(D.x - w.x, 0), D.height = c), D;
	}
	if (n === "right") {
		var O = {
			x: p + m + x,
			y: s + c / 2,
			horizontalAnchor: C,
			verticalAnchor: "middle"
		};
		return a && w && (O.width = Math.max(w.x + w.width - O.x, 0), O.height = c), O;
	}
	var k = a && w ? {
		width: m,
		height: c
	} : {};
	return n === "insideLeft" ? TE({
		x: p + x,
		y: s + c / 2,
		horizontalAnchor: C,
		verticalAnchor: "middle"
	}, k) : n === "insideRight" ? TE({
		x: p + m - x,
		y: s + c / 2,
		horizontalAnchor: S,
		verticalAnchor: "middle"
	}, k) : n === "insideTop" ? TE({
		x: d + l / 2,
		y: s + _,
		horizontalAnchor: "middle",
		verticalAnchor: y
	}, k) : n === "insideBottom" ? TE({
		x: f + u / 2,
		y: s + c - _,
		horizontalAnchor: "middle",
		verticalAnchor: v
	}, k) : n === "insideTopLeft" ? TE({
		x: d + x,
		y: s + _,
		horizontalAnchor: C,
		verticalAnchor: y
	}, k) : n === "insideTopRight" ? TE({
		x: d + l - x,
		y: s + _,
		horizontalAnchor: S,
		verticalAnchor: y
	}, k) : n === "insideBottomLeft" ? TE({
		x: f + x,
		y: s + c - _,
		horizontalAnchor: C,
		verticalAnchor: v
	}, k) : n === "insideBottomRight" ? TE({
		x: f + u - x,
		y: s + c - _,
		horizontalAnchor: S,
		verticalAnchor: v
	}, k) : n && typeof n == "object" && (F(n.x) || Ut(n.x)) && (F(n.y) || Ut(n.y)) ? TE({
		x: o + qt(n.x, m),
		y: s + qt(n.y, c),
		horizontalAnchor: "end",
		verticalAnchor: "end"
	}, k) : TE({
		x: h,
		y: s + c / 2,
		horizontalAnchor: "middle",
		verticalAnchor: "middle"
	}, k);
}, AE = ["labelRef"], jE = ["content"];
function ME(e, t) {
	if (e == null) return {};
	var n, r, i = NE(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function NE(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function PE(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function FE(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? PE(Object(n), !0).forEach(function(t) {
			IE(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : PE(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function IE(e, t, n) {
	return (t = LE(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function LE(e) {
	var t = RE(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function RE(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function zE() {
	return zE = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, zE.apply(null, arguments);
}
var BE = /* @__PURE__ */ (0, S.createContext)(null), VE = (e) => {
	var { x: t, y: n, upperWidth: r, lowerWidth: i, width: a, height: o, children: s } = e, c = (0, S.useMemo)(() => ({
		x: t,
		y: n,
		upperWidth: r,
		lowerWidth: i,
		width: a,
		height: o
	}), [
		t,
		n,
		r,
		i,
		a,
		o
	]);
	return /* @__PURE__ */ S.createElement(BE.Provider, { value: c }, s);
}, HE = () => {
	var e = (0, S.useContext)(BE), t = Bc();
	return e || (t ? zc(t) : void 0);
}, UE = /* @__PURE__ */ (0, S.createContext)(null), WE = () => {
	var e = (0, S.useContext)(UE), t = I(Yp);
	return e || t;
}, GE = (e) => {
	var { value: t, formatter: n } = e, r = Zt(e.children) ? t : e.children;
	return typeof n == "function" ? n(r) : r;
}, KE = (e) => e != null && typeof e == "function", qE = (e, t) => Vt(t - e) * Math.min(Math.abs(t - e), 360), JE = (e, t, n, r, i) => {
	var { offset: a, className: o } = e, { cx: s, cy: c, innerRadius: l, outerRadius: u, startAngle: d, endAngle: f, clockWise: p } = i, m = (l + u) / 2, h = qE(d, f), g = h >= 0 ? 1 : -1, _, v;
	switch (t) {
		case "insideStart":
			_ = d + g * a, v = p;
			break;
		case "insideEnd":
			_ = f - g * a, v = !p;
			break;
		case "end":
			_ = f + g * a, v = p;
			break;
		default: throw Error(`Unsupported position ${t}`);
	}
	v = h <= 0 ? v : !v;
	var b = kf(s, c, m, _), x = kf(s, c, m, _ + (v ? 1 : -1) * 359), C = `M${b.x},${b.y}
    A${m},${m},0,1,${+!v},
    ${x.x},${x.y}`, w = Zt(e.id) ? Kt("recharts-radial-line-") : e.id;
	return /* @__PURE__ */ S.createElement("text", zE({}, r, {
		dominantBaseline: "central",
		className: y("recharts-radial-bar-label", o)
	}), /* @__PURE__ */ S.createElement("defs", null, /* @__PURE__ */ S.createElement("path", {
		id: w,
		d: C
	})), /* @__PURE__ */ S.createElement("textPath", { xlinkHref: `#${w}` }, n));
}, YE = (e, t, n) => {
	var { cx: r, cy: i, innerRadius: a, outerRadius: o, startAngle: s, endAngle: c } = e, l = (s + c) / 2;
	if (n === "outside") {
		var { x: u, y: d } = kf(r, i, o + t, l);
		return {
			x: u,
			y: d,
			textAnchor: u >= r ? "start" : "end",
			verticalAnchor: "middle"
		};
	}
	if (n === "center") return {
		x: r,
		y: i,
		textAnchor: "middle",
		verticalAnchor: "middle"
	};
	if (n === "centerTop") return {
		x: r,
		y: i,
		textAnchor: "middle",
		verticalAnchor: "start"
	};
	if (n === "centerBottom") return {
		x: r,
		y: i,
		textAnchor: "middle",
		verticalAnchor: "end"
	};
	var { x: f, y: p } = kf(r, i, (a + o) / 2, l);
	return {
		x: f,
		y: p,
		textAnchor: "middle",
		verticalAnchor: "middle"
	};
}, XE = (e) => e != null && "cx" in e && F(e.cx), ZE = {
	angle: 0,
	offset: 5,
	zIndex: kp.label,
	position: "middle",
	textBreakAll: !1
};
function QE(e) {
	if (!XE(e)) return e;
	var { cx: t, cy: n, outerRadius: r } = e, i = r * 2;
	return {
		x: t - r,
		y: n - r,
		width: i,
		upperWidth: i,
		lowerWidth: i,
		height: i
	};
}
function $E(e) {
	var t = En(e, ZE), { viewBox: n, parentViewBox: r, position: i, value: a, children: o, content: s, className: c = "", textBreakAll: l, labelRef: u } = t, d = WE(), f = HE(), p = n == null ? i === "center" ? f : d ?? f : XE(n) ? n : zc(n), m, h, g = QE(p);
	if (!p || Zt(a) && Zt(o) && !/* @__PURE__ */ (0, S.isValidElement)(s) && typeof s != "function") return null;
	var _ = FE(FE({}, t), {}, { viewBox: p });
	if (/* @__PURE__ */ (0, S.isValidElement)(s)) {
		var { labelRef: v } = _;
		return /* @__PURE__ */ (0, S.cloneElement)(s, ME(_, AE));
	}
	if (typeof s == "function") {
		var { content: b } = _;
		if (m = /* @__PURE__ */ (0, S.createElement)(s, ME(_, jE)), /* @__PURE__ */ (0, S.isValidElement)(m)) return m;
	} else m = GE(t);
	var x = O(t);
	if (XE(p)) {
		if (i === "insideStart" || i === "insideEnd" || i === "end") return JE(t, i, m, x, p);
		h = YE(p, t.offset, t.position);
	} else {
		if (!g) return null;
		var C = kE({
			viewBox: g,
			position: i,
			offset: t.offset,
			parentViewBox: XE(r) ? void 0 : r,
			clamp: !0
		});
		h = FE(FE({
			x: C.x,
			y: C.y,
			textAnchor: C.horizontalAnchor,
			verticalAnchor: C.verticalAnchor
		}, C.width === void 0 ? {} : { width: C.width }), C.height === void 0 ? {} : { height: C.height });
	}
	return /* @__PURE__ */ S.createElement(Ow, { zIndex: t.zIndex }, /* @__PURE__ */ S.createElement(CE, zE({
		ref: u,
		className: y("recharts-label", c)
	}, x, h, {
		textAnchor: fE(x.textAnchor) ? x.textAnchor : h.textAnchor,
		breakAll: l
	}), m));
}
$E.displayName = "Label";
var eD = (e, t, n) => {
	if (!e) return null;
	var r = {
		viewBox: t,
		labelRef: n
	};
	return e === !0 ? /* @__PURE__ */ S.createElement($E, zE({ key: "label-implicit" }, r)) : Wt(e) ? /* @__PURE__ */ S.createElement($E, zE({
		key: "label-implicit",
		value: e
	}, r)) : /* @__PURE__ */ (0, S.isValidElement)(e) ? e.type === $E ? /* @__PURE__ */ (0, S.cloneElement)(e, FE({ key: "label-implicit" }, r)) : /* @__PURE__ */ S.createElement($E, zE({
		key: "label-implicit",
		content: e
	}, r)) : KE(e) ? /* @__PURE__ */ S.createElement($E, zE({
		key: "label-implicit",
		content: e
	}, r)) : e && typeof e == "object" ? /* @__PURE__ */ S.createElement($E, zE({}, e, { key: "label-implicit" }, r)) : null;
};
function tD(e) {
	var { label: t, labelRef: n } = e;
	return eD(t, HE(), n) || null;
}
//#endregion
//#region node_modules/recharts/es6/component/LabelList.js
var nD = ["valueAccessor"], rD = [
	"dataKey",
	"clockWise",
	"id",
	"textBreakAll",
	"zIndex"
];
function iD() {
	return iD = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, iD.apply(null, arguments);
}
function aD(e, t) {
	if (e == null) return {};
	var n, r, i = oD(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function oD(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var sD = (e) => {
	var t = Array.isArray(e.value) ? e.value[e.value.length - 1] : e.value;
	if (pE(t)) return t;
}, cD = /* @__PURE__ */ (0, S.createContext)(void 0), lD = cD.Provider, uD = /* @__PURE__ */ (0, S.createContext)(void 0);
uD.Provider;
function dD() {
	return (0, S.useContext)(cD);
}
function fD() {
	return (0, S.useContext)(uD);
}
function pD(e) {
	var { valueAccessor: t = sD } = e, n = aD(e, nD), { dataKey: r, clockWise: i, id: a, textBreakAll: o, zIndex: s } = n, c = aD(n, rD), l = dD(), u = fD(), d = l || u;
	return !d || !d.length ? null : /* @__PURE__ */ S.createElement(Ow, { zIndex: s ?? kp.label }, /* @__PURE__ */ S.createElement(oe, { className: "recharts-label-list" }, d.map((e, i) => {
		var s = Zt(r) ? t(e, i) : Ss(e.payload, r), l = Zt(a) ? {} : { id: `${a}-${i}` };
		return /* @__PURE__ */ S.createElement($E, iD({ key: `label-${i}` }, O(e), c, l, {
			fill: n.fill ?? e.fill,
			parentViewBox: e.parentViewBox,
			value: s,
			textBreakAll: o,
			viewBox: e.viewBox,
			index: i,
			zIndex: 0
		}));
	})));
}
pD.displayName = "LabelList";
function mD(e) {
	var { label: t } = e;
	return t ? t === !0 ? /* @__PURE__ */ S.createElement(pD, { key: "labelList-implicit" }) : /* @__PURE__ */ S.isValidElement(t) || KE(t) ? /* @__PURE__ */ S.createElement(pD, {
		key: "labelList-implicit",
		content: t
	}) : typeof t == "object" ? /* @__PURE__ */ S.createElement(pD, iD({ key: "labelList-implicit" }, t, { type: String(t.type) })) : null : null;
}
//#endregion
//#region node_modules/recharts/es6/shape/Dot.js
function hD() {
	return hD = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, hD.apply(null, arguments);
}
var gD = (e) => {
	var { cx: t, cy: n, r, className: i } = e, a = y("recharts-dot", i);
	return F(t) && F(n) && F(r) ? /* @__PURE__ */ S.createElement("circle", hD({}, E(e), vn(e), {
		className: a,
		cx: t,
		cy: n,
		r
	})) : null;
}, _D = xo({
	name: "polarAxis",
	initialState: {
		radiusAxis: {},
		angleAxis: {}
	},
	reducers: {
		addRadiusAxis(e, t) {
			e.radiusAxis[t.payload.id] = J(t.payload);
		},
		removeRadiusAxis(e, t) {
			delete e.radiusAxis[t.payload.id];
		},
		addAngleAxis(e, t) {
			e.angleAxis[t.payload.id] = J(t.payload);
		},
		removeAngleAxis(e, t) {
			delete e.angleAxis[t.payload.id];
		}
	}
}), { addRadiusAxis: vD, removeRadiusAxis: yD, addAngleAxis: bD, removeAngleAxis: xD } = _D.actions, SD = _D.reducer;
//#endregion
//#region node_modules/recharts/es6/util/getClassNameFromUnknown.js
function CD(e) {
	return e && typeof e == "object" && "className" in e && typeof e.className == "string" ? e.className : "";
}
//#endregion
//#region node_modules/react-is/cjs/react-is.production.min.js
var wD = /* @__PURE__ */ o(((e) => {
	var t = typeof Symbol == "function" && Symbol.for, n = t ? Symbol.for("react.element") : 60103, r = t ? Symbol.for("react.portal") : 60106, i = t ? Symbol.for("react.fragment") : 60107, a = t ? Symbol.for("react.strict_mode") : 60108, o = t ? Symbol.for("react.profiler") : 60114, s = t ? Symbol.for("react.provider") : 60109, c = t ? Symbol.for("react.context") : 60110, l = t ? Symbol.for("react.async_mode") : 60111, u = t ? Symbol.for("react.concurrent_mode") : 60111, d = t ? Symbol.for("react.forward_ref") : 60112, f = t ? Symbol.for("react.suspense") : 60113, p = t ? Symbol.for("react.memo") : 60115, m = t ? Symbol.for("react.lazy") : 60116;
	function h(e) {
		if (typeof e == "object" && e) {
			var t = e.$$typeof;
			switch (t) {
				case n: switch (e = e.type, e) {
					case l:
					case u:
					case i:
					case o:
					case a:
					case f: return e;
					default: switch (e &&= e.$$typeof, e) {
						case c:
						case d:
						case m:
						case p:
						case s: return e;
						default: return t;
					}
				}
				case r: return t;
			}
		}
	}
	e.isFragment = function(e) {
		return h(e) === i;
	};
})), TD = (/* @__PURE__ */ o(((e, t) => {
	t.exports = wD();
})))(), ED = (e) => typeof e == "string" ? e : e ? e.displayName || e.name || "Component" : "", DD = null, OD = null, kD = (e) => {
	if (e === DD && Array.isArray(OD)) return OD;
	var t = [];
	return S.Children.forEach(e, (e) => {
		Zt(e) || ((0, TD.isFragment)(e) ? t = t.concat(kD(e.props.children)) : t.push(e));
	}), OD = t, DD = e, t;
};
function AD(e, t) {
	var n = [], r = [];
	return r = Array.isArray(t) ? t.map((e) => ED(e)) : [ED(t)], kD(e).forEach((e) => {
		var t = It(e, "type.displayName") || It(e, "type.name");
		t && r.indexOf(t) !== -1 && n.push(e);
	}), n;
}
var jD = (e) => e && typeof e == "object" && "clipDot" in e ? !!e.clipDot : !0;
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/isPlainObject.mjs
function MD(e) {
	if (typeof e != "object" || !e) return !1;
	if (Object.getPrototypeOf(e) === null) return !0;
	if (Object.prototype.toString.call(e) !== "[object Object]") {
		let t = e[Symbol.toStringTag];
		return t == null || !Object.getOwnPropertyDescriptor(e, Symbol.toStringTag)?.writable ? !1 : e.toString() === `[object ${t}]`;
	}
	let t = e;
	for (; Object.getPrototypeOf(t) !== null;) t = Object.getPrototypeOf(t);
	return Object.getPrototypeOf(e) === t;
}
//#endregion
//#region node_modules/recharts/es6/shape/Trapezoid.js
var ND, PD, FD, ID, LD;
function RD(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function zD(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? RD(Object(n), !0).forEach(function(t) {
			BD(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : RD(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function BD(e, t, n) {
	return (t = VD(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function VD(e) {
	var t = HD(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function HD(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function UD() {
	return UD = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, UD.apply(null, arguments);
}
function WD(e, t) {
	return t ||= e.slice(0), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var GD = (e, t, n, r, i) => {
	var a = n - r, o = Bt(ND ||= WD([
		"M ",
		",",
		""
	]), e, t);
	return o += Bt(PD ||= WD([
		"L ",
		",",
		""
	]), e + n, t), o += Bt(FD ||= WD([
		"L ",
		",",
		""
	]), e + n - a / 2, t + i), o += Bt(ID ||= WD([
		"L ",
		",",
		""
	]), e + n - a / 2 - r, t + i), o += Bt(LD ||= WD([
		"L ",
		",",
		" Z"
	]), e, t), o;
}, KD = {
	x: 0,
	y: 0,
	upperWidth: 0,
	lowerWidth: 0,
	height: 0,
	isUpdateAnimationActive: !1,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease"
}, qD = (e) => {
	var t = En(e, KD), { x: n, y: r, upperWidth: i, lowerWidth: a, height: o, className: s } = t, { animationEasing: c, animationDuration: l, animationBegin: u, isUpdateAnimationActive: d } = t, f = (0, S.useRef)(null), [p, m] = (0, S.useState)(-1), h = (0, S.useRef)(i), g = (0, S.useRef)(a), _ = (0, S.useRef)(o), v = (0, S.useRef)(n), b = (0, S.useRef)(r), x = Xd(e, "trapezoid-");
	if ((0, S.useEffect)(() => {
		if (f.current && f.current.getTotalLength) try {
			var e = f.current.getTotalLength();
			e && m(e);
		} catch {}
	}, []), n !== +n || r !== +r || i !== +i || a !== +a || o !== +o || i === 0 && a === 0 || o === 0) return null;
	var C = y("recharts-trapezoid", s);
	if (!d) return /* @__PURE__ */ S.createElement("g", null, /* @__PURE__ */ S.createElement("path", UD({}, O(t), {
		className: C,
		d: GD(n, r, i, a, o)
	})));
	var w = h.current, T = g.current, E = _.current, D = v.current, k = b.current, ee = `0px ${p === -1 ? 1 : p}px`, te = `${p}px ${p}px`, ne = vd(["strokeDasharray"], l, c);
	return /* @__PURE__ */ S.createElement(Yd, {
		animationId: x,
		key: x,
		canBegin: p > 0,
		duration: l,
		easing: c,
		isActive: d,
		begin: u
	}, (e) => {
		var s = Yt(w, i, e), c = Yt(T, a, e), l = Yt(E, o, e), u = Yt(D, n, e), d = Yt(k, r, e);
		f.current && (h.current = s, g.current = c, _.current = l, v.current = u, b.current = d);
		var p = e > 0 ? {
			transition: ne,
			strokeDasharray: te
		} : { strokeDasharray: ee };
		return /* @__PURE__ */ S.createElement("path", UD({}, O(t), {
			className: C,
			d: GD(u, d, s, c, l),
			ref: f,
			style: zD(zD({}, p), t.style)
		}));
	});
}, JD = [
	"option",
	"shapeType",
	"activeClassName",
	"inActiveClassName"
];
function YD(e, t) {
	if (e == null) return {};
	var n, r, i = XD(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function XD(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function ZD(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function QD(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? ZD(Object(n), !0).forEach(function(t) {
			$D(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ZD(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function $D(e, t, n) {
	return (t = eO(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function eO(e) {
	var t = tO(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function tO(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function nO(e, t) {
	return QD(QD({}, t), e);
}
function rO(e, t) {
	return e === "symbols";
}
function iO(e) {
	var { shapeType: t, elementProps: n } = e;
	switch (t) {
		case "rectangle": return /* @__PURE__ */ S.createElement(xf, n);
		case "trapezoid": return /* @__PURE__ */ S.createElement(qD, n);
		case "sector": return /* @__PURE__ */ S.createElement(Zf, n);
		case "symbols":
			if (rO(t, n)) return /* @__PURE__ */ S.createElement(gn, n);
			break;
		case "curve": return /* @__PURE__ */ S.createElement($u, n);
		default: return null;
	}
}
function aO(e) {
	return /* @__PURE__ */ (0, S.isValidElement)(e) ? e.props : e;
}
function oO(e) {
	var { option: t, shapeType: n, activeClassName: r = "recharts-active-shape", inActiveClassName: i = "recharts-shape" } = e, a = YD(e, JD), o;
	if (/* @__PURE__ */ (0, S.isValidElement)(t)) o = /* @__PURE__ */ (0, S.cloneElement)(t, QD(QD({}, a), aO(t)));
	else if (typeof t == "function") o = t(a, a.index);
	else if (MD(t) && typeof t != "boolean") {
		var s = nO(t, a);
		o = /* @__PURE__ */ S.createElement(iO, {
			shapeType: n,
			elementProps: s
		});
	} else {
		var c = a;
		o = /* @__PURE__ */ S.createElement(iO, {
			shapeType: n,
			elementProps: c
		});
	}
	return a.isActive ? /* @__PURE__ */ S.createElement(oe, { className: r }, o) : /* @__PURE__ */ S.createElement(oe, { className: i }, o);
}
//#endregion
//#region node_modules/recharts/es6/context/tooltipContext.js
var sO = (e, t, n) => {
	var r = Vr();
	return (i, a) => (o) => {
		e?.(i, a, o), r(yS({
			activeIndex: String(a),
			activeDataKey: t,
			activeCoordinate: i.tooltipPosition,
			activeGraphicalItemId: n
		}));
	};
}, cO = (e) => {
	var t = Vr();
	return (n, r) => (i) => {
		e?.(n, r, i), t(bS());
	};
}, lO = (e, t, n) => {
	var r = Vr();
	return (i, a) => (o) => {
		e?.(i, a, o), r(SS({
			activeIndex: String(a),
			activeDataKey: t,
			activeCoordinate: i.tooltipPosition,
			activeGraphicalItemId: n
		}));
	};
};
//#endregion
//#region node_modules/recharts/es6/state/SetTooltipEntrySettings.js
function uO(e) {
	var { tooltipEntrySettings: t } = e, n = Vr(), r = dc(), i = (0, S.useRef)(null);
	return (0, S.useLayoutEffect)(() => {
		r || (i.current === null ? n(hS(t)) : i.current !== t && n(gS({
			prev: i.current,
			next: t
		})), i.current = t);
	}, [
		t,
		n,
		r
	]), (0, S.useLayoutEffect)(() => () => {
		i.current &&= (n(_S(i.current)), null);
	}, [n]), null;
}
//#endregion
//#region node_modules/recharts/es6/state/SetLegendPayload.js
function dO(e) {
	var { legendPayload: t } = e, n = Vr(), r = dc(), i = (0, S.useRef)(null);
	return (0, S.useLayoutEffect)(() => {
		r || (i.current === null ? n(Wl(t)) : i.current !== t && n(Gl({
			prev: i.current,
			next: t
		})), i.current = t);
	}, [
		n,
		r,
		t
	]), (0, S.useLayoutEffect)(() => () => {
		i.current &&= (n(Kl(i.current)), null);
	}, [n]), null;
}
//#endregion
//#region node_modules/recharts/es6/util/useId.js
var fO = S.useId ?? (() => {
	var [e] = S.useState(() => Kt("uid-"));
	return e;
});
//#endregion
//#region node_modules/recharts/es6/util/useUniqueId.js
function pO(e, t) {
	var n = fO();
	return t || (e ? `${e}-${n}` : n);
}
//#endregion
//#region node_modules/recharts/es6/context/RegisterGraphicalItemId.js
var mO = /* @__PURE__ */ (0, S.createContext)(void 0), hO = (e) => {
	var { id: t, type: n, children: r } = e, i = pO(`recharts-${n}`, t);
	return /* @__PURE__ */ S.createElement(mO.Provider, { value: i }, r(i));
}, gO = xo({
	name: "graphicalItems",
	initialState: {
		cartesianItems: [],
		polarItems: []
	},
	reducers: {
		addCartesianGraphicalItem: {
			reducer(e, t) {
				e.cartesianItems.push(J(t.payload));
			},
			prepare: oo()
		},
		replaceCartesianGraphicalItem: {
			reducer(e, t) {
				var { prev: n, next: r } = t.payload, i = Ka(e).cartesianItems.indexOf(J(n));
				i > -1 && (e.cartesianItems[i] = J(r));
			},
			prepare: oo()
		},
		removeCartesianGraphicalItem: {
			reducer(e, t) {
				var n = Ka(e).cartesianItems.indexOf(J(t.payload));
				n > -1 && e.cartesianItems.splice(n, 1);
			},
			prepare: oo()
		},
		addPolarGraphicalItem: {
			reducer(e, t) {
				e.polarItems.push(J(t.payload));
			},
			prepare: oo()
		},
		removePolarGraphicalItem: {
			reducer(e, t) {
				var n = Ka(e).polarItems.indexOf(J(t.payload));
				n > -1 && e.polarItems.splice(n, 1);
			},
			prepare: oo()
		},
		replacePolarGraphicalItem: {
			reducer(e, t) {
				var { prev: n, next: r } = t.payload, i = Ka(e).polarItems.indexOf(J(n));
				i > -1 && (e.polarItems[i] = J(r));
			},
			prepare: oo()
		}
	}
}), { addCartesianGraphicalItem: _O, replaceCartesianGraphicalItem: vO, removeCartesianGraphicalItem: yO, addPolarGraphicalItem: bO, removePolarGraphicalItem: xO, replacePolarGraphicalItem: SO } = gO.actions, CO = gO.reducer, wO = /* @__PURE__ */ (0, S.memo)((e) => {
	var t = Vr(), n = (0, S.useRef)(null);
	return (0, S.useLayoutEffect)(() => {
		n.current === null ? t(_O(e)) : n.current !== e && t(vO({
			prev: n.current,
			next: e
		})), n.current = e;
	}, [t, e]), (0, S.useLayoutEffect)(() => () => {
		n.current &&= (t(yO(n.current)), null);
	}, [t]), null;
}), TO = ["points"];
function EO(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function DO(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? EO(Object(n), !0).forEach(function(t) {
			OO(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : EO(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function OO(e, t, n) {
	return (t = kO(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function kO(e) {
	var t = AO(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function AO(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function jO() {
	return jO = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, jO.apply(null, arguments);
}
function MO(e, t) {
	if (e == null) return {};
	var n, r, i = NO(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function NO(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function PO(e) {
	var { option: t, dotProps: n, className: r } = e;
	if (/* @__PURE__ */ (0, S.isValidElement)(t)) return /* @__PURE__ */ (0, S.cloneElement)(t, n);
	if (typeof t == "function") return t(n);
	var i = y(r, typeof t == "boolean" ? "" : t.className), a = n ?? {}, { points: o } = a, s = MO(a, TO);
	return /* @__PURE__ */ S.createElement(gD, jO({}, s, { className: i }));
}
function FO(e, t) {
	return e == null ? !1 : t ? !0 : e.length === 1;
}
function IO(e) {
	var { points: t, dot: n, className: r, dotClassName: i, dataKey: a, baseProps: o, needClip: s, clipPathId: c, zIndex: l = kp.scatter } = e;
	if (!FO(t, n)) return null;
	var u = jD(n), d = k(n), f = t.map((e, r) => {
		var s = DO(DO(DO({ r: 3 }, o), d), {}, {
			index: r,
			cx: e.x ?? void 0,
			cy: e.y ?? void 0,
			dataKey: a,
			value: e.value,
			payload: e.payload,
			points: t
		});
		return /* @__PURE__ */ S.createElement(PO, {
			key: `dot-${r}`,
			option: n,
			dotProps: s,
			className: i
		});
	}), p = {};
	return s && c != null && (p.clipPath = `url(#clipPath-${u ? "" : "dots-"}${c})`), /* @__PURE__ */ S.createElement(Ow, { zIndex: l }, /* @__PURE__ */ S.createElement(oe, jO({ className: r }, p), f));
}
//#endregion
//#region node_modules/recharts/es6/state/cartesianAxisSlice.js
function LO(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function RO(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? LO(Object(n), !0).forEach(function(t) {
			zO(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : LO(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function zO(e, t, n) {
	return (t = BO(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function BO(e) {
	var t = VO(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function VO(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var HO = xo({
	name: "cartesianAxis",
	initialState: {
		xAxis: {},
		yAxis: {},
		zAxis: {}
	},
	reducers: {
		addXAxis: {
			reducer(e, t) {
				e.xAxis[t.payload.id] = J(t.payload);
			},
			prepare: oo()
		},
		replaceXAxis: {
			reducer(e, t) {
				var { prev: n, next: r } = t.payload;
				e.xAxis[n.id] !== void 0 && (n.id !== r.id && delete e.xAxis[n.id], e.xAxis[r.id] = J(r));
			},
			prepare: oo()
		},
		removeXAxis: {
			reducer(e, t) {
				delete e.xAxis[t.payload.id];
			},
			prepare: oo()
		},
		addYAxis: {
			reducer(e, t) {
				e.yAxis[t.payload.id] = J(t.payload);
			},
			prepare: oo()
		},
		replaceYAxis: {
			reducer(e, t) {
				var { prev: n, next: r } = t.payload;
				e.yAxis[n.id] !== void 0 && (n.id !== r.id && delete e.yAxis[n.id], e.yAxis[r.id] = J(r));
			},
			prepare: oo()
		},
		removeYAxis: {
			reducer(e, t) {
				delete e.yAxis[t.payload.id];
			},
			prepare: oo()
		},
		addZAxis: {
			reducer(e, t) {
				e.zAxis[t.payload.id] = J(t.payload);
			},
			prepare: oo()
		},
		replaceZAxis: {
			reducer(e, t) {
				var { prev: n, next: r } = t.payload;
				e.zAxis[n.id] !== void 0 && (n.id !== r.id && delete e.zAxis[n.id], e.zAxis[r.id] = J(r));
			},
			prepare: oo()
		},
		removeZAxis: {
			reducer(e, t) {
				delete e.zAxis[t.payload.id];
			},
			prepare: oo()
		},
		updateYAxisWidth(e, t) {
			var { id: n, width: r } = t.payload, i = e.yAxis[n];
			if (i) {
				var a = i.widthHistory || [];
				if (a.length === 3 && a[0] === a[2] && r === a[1] && r !== i.width && Math.abs(r - (a[0] ?? 0)) <= 1) return;
				var o = [...a, r].slice(-3);
				e.yAxis[n] = RO(RO({}, i), {}, {
					width: r,
					widthHistory: o
				});
			}
		}
	}
}), { addXAxis: UO, replaceXAxis: WO, removeXAxis: GO, addYAxis: KO, replaceYAxis: qO, removeYAxis: JO, addZAxis: YO, replaceZAxis: XO, removeZAxis: ZO, updateYAxisWidth: QO } = HO.actions, $O = HO.reducer, ek = L([
	L([sc], (e) => ({
		top: e.top,
		bottom: e.bottom,
		left: e.left,
		right: e.right
	})),
	Ws,
	Gs
], (e, t, n) => {
	if (!(!e || t == null || n == null)) return {
		x: e.left,
		y: e.top,
		width: Math.max(0, t - e.left - e.right),
		height: Math.max(0, n - e.top - e.bottom)
	};
}), tk = () => I(ek), nk = () => I(jC);
//#endregion
//#region node_modules/recharts/es6/component/ActivePoints.js
function rk(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function ik(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? rk(Object(n), !0).forEach(function(t) {
			ak(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : rk(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function ak(e, t, n) {
	return (t = ok(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function ok(e) {
	var t = sk(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function sk(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var ck = (e) => {
	var { point: t, childIndex: n, mainColor: r, activeDot: i, dataKey: a, clipPath: o } = e;
	if (i === !1 || t.x == null || t.y == null) return null;
	var s = ik(ik(ik({}, {
		index: n,
		dataKey: a,
		cx: t.x,
		cy: t.y,
		r: 4,
		fill: r ?? "none",
		strokeWidth: 2,
		stroke: "#fff",
		payload: t.payload,
		value: t.value
	}), D(i)), vn(i)), c = /* @__PURE__ */ (0, S.isValidElement)(i) ? /* @__PURE__ */ (0, S.cloneElement)(i, s) : typeof i == "function" ? i(s) : /* @__PURE__ */ S.createElement(gD, s);
	return /* @__PURE__ */ S.createElement(oe, {
		className: "recharts-active-dot",
		clipPath: o
	}, c);
};
function lk(e) {
	var { points: t, mainColor: n, activeDot: r, itemDataKey: i, clipPath: a, zIndex: o = kp.activeDot } = e, s = I(wC), c = nk();
	if (t == null || c == null) return null;
	var l = t.find((e) => c.includes(e.payload));
	return Zt(l) ? null : /* @__PURE__ */ S.createElement(Ow, { zIndex: o }, /* @__PURE__ */ S.createElement(ck, {
		point: l,
		childIndex: Number(s),
		mainColor: n,
		dataKey: i,
		activeDot: r,
		clipPath: a
	}));
}
//#endregion
//#region node_modules/recharts/es6/state/selectors/combiners/combineBarSizeList.js
var uk = (e, t, n) => {
	var r = n ?? e;
	if (!Zt(r)) return qt(r, t, 0);
}, dk = (e, t, n) => {
	var r = {}, i = e.filter(em), a = e.filter((e) => e.stackId == null), o = i.reduce((e, t) => {
		var n = e[t.stackId];
		return n ??= [], n.push(t), e[t.stackId] = n, e;
	}, r), s = Object.entries(o).map((e) => {
		var [r, i] = e;
		return {
			stackId: r,
			dataKeys: i.map((e) => e.dataKey),
			barSize: uk(t, n, i[0]?.barSize)
		};
	}), c = a.map((e) => ({
		stackId: void 0,
		dataKeys: [e.dataKey].filter((e) => e != null),
		barSize: uk(t, n, e.barSize)
	}));
	return [...s, ...c];
};
//#endregion
//#region node_modules/recharts/es6/state/selectors/combiners/combineAllBarPositions.js
function fk(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function pk(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? fk(Object(n), !0).forEach(function(t) {
			mk(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : fk(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function mk(e, t, n) {
	return (t = hk(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function hk(e) {
	var t = gk(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function gk(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function _k(e, t, n, r, i) {
	var a = r.length;
	if (!(a < 1)) {
		var o = qt(e, n, 0, !0), s, c = [];
		if (H(r[0]?.barSize)) {
			var l = !1, u = n / a, d = r.reduce((e, t) => e + (t.barSize || 0), 0);
			d += (a - 1) * o, d >= n && (d -= (a - 1) * o, o = 0), d >= n && u > 0 && (l = !0, u *= .9, d = a * u);
			var f = {
				offset: ((n - d) / 2 >> 0) - o,
				size: 0
			};
			s = r.reduce((e, t) => {
				var n = {
					stackId: t.stackId,
					dataKeys: t.dataKeys,
					position: {
						offset: f.offset + f.size + o,
						size: l ? u : t.barSize ?? 0
					}
				}, r = [...e, n];
				return f = n.position, r;
			}, c);
		} else {
			var p = qt(t, n, 0, !0);
			n - 2 * p - (a - 1) * o <= 0 && (o = 0);
			var m = (n - 2 * p - (a - 1) * o) / a;
			m > 1 && (m >>= 0);
			var h = H(i) ? Math.min(m, i) : m;
			s = r.reduce((e, t, n) => [...e, {
				stackId: t.stackId,
				dataKeys: t.dataKeys,
				position: {
					offset: p + (m + o) * n + (m - h) / 2,
					size: h
				}
			}], c);
		}
		return s;
	}
}
var vk = (e, t, n, r, i, a, o) => {
	var s = Zt(o) ? t : o, c = _k(n, r, i === a ? a : i, e, s);
	return i !== a && c != null && (c = c.map((e) => pk(pk({}, e), {}, { position: pk(pk({}, e.position), {}, { offset: e.position.offset - i / 2 }) }))), c;
}, yk = (e, t) => {
	var n = Qp(t);
	if (!(!e || n == null || t == null)) {
		var { stackId: r } = t;
		if (r != null) {
			var i = e[r];
			if (i) {
				var { stackedData: a } = i;
				if (a) return a.find((e) => e.key === n);
			}
		}
	}
}, bk = (e, t) => {
	if (!(e == null || t == null)) {
		var n = e.find((e) => e.stackId === t.stackId && t.dataKey != null && e.dataKeys.includes(t.dataKey));
		if (n != null) return n.position;
	}
};
//#endregion
//#region node_modules/recharts/es6/zIndex/getZIndexFromUnknown.js
function xk(e, t) {
	return e && typeof e == "object" && "zIndex" in e && typeof e.zIndex == "number" && H(e.zIndex) ? e.zIndex : t;
}
//#endregion
//#region node_modules/recharts/es6/context/chartDataContext.js
var Sk = (e) => {
	var { chartData: t } = e, n = Vr(), r = dc();
	return (0, S.useEffect)(() => r ? () => {} : (n(Xw(t)), () => {
		n(Xw(void 0));
	}), [
		t,
		n,
		r
	]), null;
}, Ck = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	padding: {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	}
}, wk = xo({
	name: "brush",
	initialState: Ck,
	reducers: { setBrushSettings(e, t) {
		return t.payload == null ? Ck : t.payload;
	} }
}), { setBrushSettings: Tk } = wk.actions, Ek = wk.reducer, Dk = (e, t) => {
	var { x: n, y: r } = e, { x: i, y: a } = t;
	return {
		x: Math.min(n, i),
		y: Math.min(r, a),
		width: Math.abs(i - n),
		height: Math.abs(a - r)
	};
}, Ok = (e) => {
	var { x1: t, y1: n, x2: r, y2: i } = e;
	return Dk({
		x: t,
		y: n
	}, {
		x: r,
		y: i
	});
};
function kk(e) {
	return (e % 180 + 180) % 180;
}
var Ak = function(e) {
	var { width: t, height: n } = e, r = kk(arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0) * Math.PI / 180, i = Math.atan(n / t), a = r > i && r < Math.PI - i ? n / Math.sin(r) : t / Math.cos(r);
	return Math.abs(a);
}, jk = xo({
	name: "referenceElements",
	initialState: {
		dots: [],
		areas: [],
		lines: []
	},
	reducers: {
		addDot: (e, t) => {
			e.dots.push(t.payload);
		},
		removeDot: (e, t) => {
			var n = Ka(e).dots.findIndex((e) => e === t.payload);
			n !== -1 && e.dots.splice(n, 1);
		},
		addArea: (e, t) => {
			e.areas.push(t.payload);
		},
		removeArea: (e, t) => {
			var n = Ka(e).areas.findIndex((e) => e === t.payload);
			n !== -1 && e.areas.splice(n, 1);
		},
		addLine: (e, t) => {
			e.lines.push(J(t.payload));
		},
		removeLine: (e, t) => {
			var n = Ka(e).lines.findIndex((e) => e === t.payload);
			n !== -1 && e.lines.splice(n, 1);
		}
	}
}), { addDot: Mk, removeDot: Nk, addArea: Pk, removeArea: Fk, addLine: Ik, removeLine: Lk } = jk.actions, Rk = jk.reducer, zk = /* @__PURE__ */ (0, S.createContext)(void 0), Bk = (e) => {
	var { children: t } = e, [n] = (0, S.useState)(`${Kt("recharts")}-clip`), r = tk();
	if (r == null) return null;
	var { x: i, y: a, width: o, height: s } = r;
	return /* @__PURE__ */ S.createElement(zk.Provider, { value: n }, /* @__PURE__ */ S.createElement("defs", null, /* @__PURE__ */ S.createElement("clipPath", { id: n }, /* @__PURE__ */ S.createElement("rect", {
		x: i,
		y: a,
		height: s,
		width: o
	}))), t);
}, Vk = () => (0, S.useContext)(zk), Hk = class {
	constructor(e) {
		var { x: t, y: n } = e;
		this.xAxisScale = t, this.yAxisScale = n;
	}
	map(e, t) {
		var { position: n } = t;
		return {
			x: this.xAxisScale.map(e.x, { position: n }) ?? 0,
			y: this.yAxisScale.map(e.y, { position: n }) ?? 0
		};
	}
	mapWithFallback(e, t) {
		var { position: n, fallback: r } = t, i = r === "rangeMin" ? this.yAxisScale.rangeMin() : r === "rangeMax" ? this.yAxisScale.rangeMax() : 0, a = r === "rangeMin" ? this.xAxisScale.rangeMin() : r === "rangeMax" ? this.xAxisScale.rangeMax() : 0;
		return {
			x: this.xAxisScale.map(e.x, { position: n }) ?? a,
			y: this.yAxisScale.map(e.y, { position: n }) ?? i
		};
	}
	isInRange(e) {
		var { x: t, y: n } = e, r = t == null || this.xAxisScale.isInRange(t), i = n == null || this.yAxisScale.isInRange(n);
		return r && i;
	}
};
//#endregion
//#region node_modules/recharts/es6/cartesian/ReferenceLine.js
function Uk(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Wk(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Uk(Object(n), !0).forEach(function(t) {
			Gk(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Uk(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Gk(e, t, n) {
	return (t = Kk(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Kk(e) {
	var t = qk(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function qk(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Jk() {
	return Jk = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, Jk.apply(null, arguments);
}
var Yk = (e, t) => {
	var n;
	if (/* @__PURE__ */ S.isValidElement(e)) n = /* @__PURE__ */ S.cloneElement(e, t);
	else if (typeof e == "function") n = e(t);
	else {
		if (!H(t.x1) || !H(t.y1) || !H(t.x2) || !H(t.y2)) return null;
		n = /* @__PURE__ */ S.createElement("line", Jk({}, t, { className: "recharts-reference-line-line" }));
	}
	return n;
}, Xk = (e, t, n, r, i, a) => {
	var { x: o, width: s } = a, c = i.map(e, { position: n });
	if (!H(c) || t === "discard" && !i.isInRange(c)) return null;
	var l = [{
		x: o + s,
		y: c
	}, {
		x: o,
		y: c
	}];
	return r === "left" ? l.reverse() : l;
}, Zk = (e, t, n, r, i, a) => {
	var { y: o, height: s } = a, c = i.map(e, { position: n });
	if (!H(c) || t === "discard" && !i.isInRange(c)) return null;
	var l = [{
		x: c,
		y: o + s
	}, {
		x: c,
		y: o
	}];
	return r === "top" ? l.reverse() : l;
}, Qk = (e, t, n, r) => {
	var i = [r.mapWithFallback(e[0], {
		position: n,
		fallback: "rangeMin"
	}), r.mapWithFallback(e[1], {
		position: n,
		fallback: "rangeMax"
	})];
	return t === "discard" && i.some((e) => !r.isInRange(e)) ? null : i;
}, $k = (e, t, n, r, i, a, o) => {
	var { x: s, y: c, segment: l, ifOverflow: u } = o, d = Wt(s);
	return Wt(c) ? Xk(c, u, r, a, t, n) : d ? Zk(s, u, r, i, e, n) : l != null && l.length === 2 ? Qk(l, u, r, new Hk({
		x: e,
		y: t
	})) : null;
};
function eA(e) {
	var t = Vr();
	return (0, S.useEffect)(() => (t(Ik(e)), () => {
		t(Lk(e));
	})), null;
}
function tA(e) {
	var { xAxisId: t, yAxisId: n, shape: r, className: i, ifOverflow: a } = e, o = dc(), s = Vk(), c = I((e) => ib(e, t)), l = I((e) => sb(e, n)), u = I((e) => Ix(e, "xAxis", t, o)), d = I((e) => Ix(e, "yAxis", n, o)), f = Bc();
	if (!s || !f || c == null || l == null || u == null || d == null) return null;
	var p = $k(u, d, f, e.position, c.orientation, l.orientation, e);
	if (!p) return null;
	var m = p[0], h = p[1];
	if (m == null || h == null) return null;
	var { x: g, y: _ } = m, { x: v, y: b } = h, x = Wk(Wk({ clipPath: a === "hidden" ? `url(#${s})` : void 0 }, O(e)), {}, {
		x1: g,
		y1: _,
		x2: v,
		y2: b
	}), C = Ok({
		x1: g,
		y1: _,
		x2: v,
		y2: b
	});
	return /* @__PURE__ */ S.createElement(Ow, { zIndex: e.zIndex }, /* @__PURE__ */ S.createElement(oe, { className: y("recharts-reference-line", i) }, Yk(r, x), /* @__PURE__ */ S.createElement(VE, Jk({}, C, {
		lowerWidth: C.width,
		upperWidth: C.width
	}), /* @__PURE__ */ S.createElement(tD, { label: e.label }), e.children)));
}
var nA = {
	ifOverflow: "discard",
	xAxisId: 0,
	yAxisId: 0,
	fill: "none",
	label: !1,
	stroke: "#ccc",
	fillOpacity: 1,
	strokeWidth: 1,
	position: "middle",
	zIndex: kp.line
};
function rA(e) {
	var t = En(e, nA);
	return /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement(eA, {
		yAxisId: t.yAxisId,
		xAxisId: t.xAxisId,
		ifOverflow: t.ifOverflow,
		x: t.x,
		y: t.y,
		segment: t.segment
	}), /* @__PURE__ */ S.createElement(tA, t));
}
rA.displayName = "ReferenceLine";
//#endregion
//#region node_modules/recharts/es6/util/getEveryNth.js
function iA(e, t) {
	if (t < 1) return [];
	if (t === 1) return e;
	for (var n = [], r = 0; r < e.length; r += t) {
		var i = e[r];
		i !== void 0 && n.push(i);
	}
	return n;
}
//#endregion
//#region node_modules/recharts/es6/util/TickUtils.js
function aA(e, t, n) {
	return Ak({
		width: e.width + t.width,
		height: e.height + t.height
	}, n);
}
function oA(e, t, n) {
	var r = n === "width", { x: i, y: a, width: o, height: s } = e;
	return t === 1 ? {
		start: r ? i : a,
		end: r ? i + o : a + s
	} : {
		start: r ? i + o : a + s,
		end: r ? i : a
	};
}
function sA(e, t, n, r, i) {
	if (e * t < e * r || e * t > e * i) return !1;
	var a = n();
	return e * (t - e * a / 2 - r) >= 0 && e * (t + e * a / 2 - i) <= 0;
}
function cA(e, t) {
	return iA(e, t + 1);
}
//#endregion
//#region node_modules/recharts/es6/cartesian/getEquidistantTicks.js
function lA(e, t, n, r, i) {
	for (var a = (r || []).slice(), { start: o, end: s } = t, c = 0, l = 1, u = o, d = function() {
		var t = r?.[c];
		if (t === void 0) return { v: iA(r, l) };
		var a = c, d, f = () => (d === void 0 && (d = n(t, a)), d), p = t.coordinate, m = c === 0 || sA(e, p, f, u, s);
		m || (c = 0, u = o, l += 1), m && (u = p + e * (f() / 2 + i), c += l);
	}, f; l <= a.length;) if (f = d(), f) return f.v;
	return [];
}
function uA(e, t, n, r, i) {
	var a = (r || []).slice().length;
	if (a === 0) return [];
	for (var { start: o, end: s } = t, c = 1; c <= a; c++) {
		for (var l = (a - 1) % c, u = o, d = !0, f = function() {
			var t = r[m];
			if (t == null) return 0;
			var a = m, o, c = () => (o === void 0 && (o = n(t, a)), o), f = t.coordinate, p = m === l || sA(e, f, c, u, s);
			if (!p) return d = !1, 1;
			p && (u = f + e * (c() / 2 + i));
		}, p, m = l; m < a && (p = f(), !(p !== 0 && p === 1)); m += c);
		if (d) {
			for (var h = [], g = l; g < a; g += c) {
				var _ = r[g];
				_ != null && h.push(_);
			}
			return h;
		}
	}
	return [];
}
//#endregion
//#region node_modules/recharts/es6/cartesian/getTicks.js
function dA(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function fA(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? dA(Object(n), !0).forEach(function(t) {
			pA(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : dA(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function pA(e, t, n) {
	return (t = mA(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function mA(e) {
	var t = hA(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function hA(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function gA(e, t, n, r, i) {
	for (var a = (r || []).slice(), o = a.length, { start: s } = t, { end: c } = t, l = function(t) {
		var r = a[t];
		if (r == null) return 1;
		var l = r, u, d = () => (u === void 0 && (u = n(r, t)), u);
		if (t === o - 1) {
			var f = e * (l.coordinate + e * d() / 2 - c);
			a[t] = l = fA(fA({}, l), {}, { tickCoord: f > 0 ? l.coordinate - f * e : l.coordinate });
		} else a[t] = l = fA(fA({}, l), {}, { tickCoord: l.coordinate });
		l.tickCoord != null && sA(e, l.tickCoord, d, s, c) && (c = l.tickCoord - e * (d() / 2 + i), a[t] = fA(fA({}, l), {}, { isShow: !0 }));
	}, u = o - 1; u >= 0; u--) if (l(u)) continue;
	return a;
}
function _A(e, t, n, r, i, a) {
	var o = (r || []).slice(), s = o.length, { start: c, end: l } = t;
	if (a) {
		var u = r[s - 1];
		if (u != null) {
			var d = n(u, s - 1), f = e * (u.coordinate + e * d / 2 - l);
			o[s - 1] = u = fA(fA({}, u), {}, { tickCoord: f > 0 ? u.coordinate - f * e : u.coordinate }), u.tickCoord != null && sA(e, u.tickCoord, () => d, c, l) && (l = u.tickCoord - e * (d / 2 + i), o[s - 1] = fA(fA({}, u), {}, { isShow: !0 }));
		}
	}
	for (var p = a ? s - 1 : s, m = function(t) {
		var r = o[t];
		if (r == null) return 1;
		var a = r, s, u = () => (s === void 0 && (s = n(r, t)), s);
		if (t === 0) {
			var d = e * (a.coordinate - e * u() / 2 - c);
			o[t] = a = fA(fA({}, a), {}, { tickCoord: d < 0 ? a.coordinate - d * e : a.coordinate });
		} else o[t] = a = fA(fA({}, a), {}, { tickCoord: a.coordinate });
		a.tickCoord != null && sA(e, a.tickCoord, u, c, l) && (c = a.tickCoord + e * (u() / 2 + i), o[t] = fA(fA({}, a), {}, { isShow: !0 }));
	}, h = 0; h < p; h++) if (m(h)) continue;
	return o;
}
function vA(e, t, n) {
	var { tick: r, ticks: i, viewBox: a, minTickGap: o, orientation: s, interval: c, tickFormatter: l, unit: u, angle: d } = e;
	if (!i || !i.length || !r) return [];
	if (F(c) || ku.isSsr) return cA(i, F(c) ? c : 0) ?? [];
	var f = [], p = s === "top" || s === "bottom" ? "width" : "height", m = u && p === "width" ? RT(u, {
		fontSize: t,
		letterSpacing: n
	}) : {
		width: 0,
		height: 0
	}, h = (e, r) => {
		var i = typeof l == "function" ? l(e.value, r) : e.value;
		return p === "width" ? aA(RT(i, {
			fontSize: t,
			letterSpacing: n
		}), m, d) : RT(i, {
			fontSize: t,
			letterSpacing: n
		})[p];
	}, g = i[0], _ = i[1], v = i.length >= 2 && g != null && _ != null ? Vt(_.coordinate - g.coordinate) : 1, y = oA(a, v, p);
	return c === "equidistantPreserveStart" ? lA(v, y, h, i, o) : c === "equidistantPreserveEnd" ? uA(v, y, h, i, o) : (f = c === "preserveStart" || c === "preserveStartEnd" ? _A(v, y, h, i, o, c === "preserveStartEnd") : gA(v, y, h, i, o), f.filter((e) => e.isShow));
}
//#endregion
//#region node_modules/recharts/es6/util/YAxisUtils.js
var yA = (e) => {
	var { ticks: t, label: n, labelGapWithTick: r = 5, tickSize: i = 0, tickMargin: a = 0 } = e, o = 0;
	if (t) {
		Array.from(t).forEach((e) => {
			if (e) {
				var t = e.getBoundingClientRect();
				t.width > o && (o = t.width);
			}
		});
		var s = n ? n.getBoundingClientRect().width : 0, c = i + a, l = o + c + s + (n ? r : 0);
		return Math.round(l);
	}
	return 0;
}, bA = xo({
	name: "renderedTicks",
	initialState: {
		xAxis: {},
		yAxis: {}
	},
	reducers: {
		setRenderedTicks: (e, t) => {
			var { axisType: n, axisId: r, ticks: i } = t.payload;
			e[n][r] = J(i);
		},
		removeRenderedTicks: (e, t) => {
			var { axisType: n, axisId: r } = t.payload;
			delete e[n][r];
		}
	}
}), { setRenderedTicks: xA, removeRenderedTicks: SA } = bA.actions, CA = bA.reducer, wA = [
	"axisLine",
	"width",
	"height",
	"className",
	"hide",
	"ticks",
	"axisType",
	"axisId"
];
function TA(e, t) {
	if (e == null) return {};
	var n, r, i = EA(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function EA(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function DA() {
	return DA = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, DA.apply(null, arguments);
}
function OA(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function kA(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? OA(Object(n), !0).forEach(function(t) {
			AA(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : OA(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function AA(e, t, n) {
	return (t = jA(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function jA(e) {
	var t = MA(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function MA(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var NA = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	viewBox: {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	},
	orientation: "bottom",
	ticks: [],
	stroke: "#666",
	tickLine: !0,
	axisLine: !0,
	tick: !0,
	mirror: !1,
	minTickGap: 5,
	tickSize: 6,
	tickMargin: 2,
	interval: "preserveEnd",
	zIndex: kp.axis
};
function PA(e) {
	var { x: t, y: n, width: r, height: i, orientation: a, mirror: o, axisLine: s, otherSvgProps: c } = e;
	if (!s) return null;
	var l = kA(kA(kA({}, c), E(s)), {}, { fill: "none" });
	if (a === "top" || a === "bottom") {
		var u = +(a === "top" && !o || a === "bottom" && o);
		l = kA(kA({}, l), {}, {
			x1: t,
			y1: n + u * i,
			x2: t + r,
			y2: n + u * i
		});
	} else {
		var d = +(a === "left" && !o || a === "right" && o);
		l = kA(kA({}, l), {}, {
			x1: t + d * r,
			y1: n,
			x2: t + d * r,
			y2: n + i
		});
	}
	return /* @__PURE__ */ S.createElement("line", DA({}, l, { className: y("recharts-cartesian-axis-line", It(s, "className")) }));
}
function FA(e, t, n, r, i, a, o, s, c) {
	var l, u, d, f, p, m, h = s ? -1 : 1, g = e.tickSize || o, _ = F(e.tickCoord) ? e.tickCoord : e.coordinate;
	switch (a) {
		case "top":
			l = u = e.coordinate, f = n + +!s * i, d = f - h * g, m = d - h * c, p = _;
			break;
		case "left":
			d = f = e.coordinate, u = t + +!s * r, l = u - h * g, p = l - h * c, m = _;
			break;
		case "right":
			d = f = e.coordinate, u = t + +s * r, l = u + h * g, p = l + h * c, m = _;
			break;
		default:
			l = u = e.coordinate, f = n + +s * i, d = f + h * g, m = d + h * c, p = _;
			break;
	}
	return {
		line: {
			x1: l,
			y1: d,
			x2: u,
			y2: f
		},
		tick: {
			x: p,
			y: m
		}
	};
}
function IA(e, t) {
	switch (e) {
		case "left": return t ? "start" : "end";
		case "right": return t ? "end" : "start";
		default: return "middle";
	}
}
function LA(e, t) {
	switch (e) {
		case "left":
		case "right": return "middle";
		case "top": return t ? "start" : "end";
		default: return t ? "end" : "start";
	}
}
function RA(e) {
	var { option: t, tickProps: n, value: r } = e, i, a = y(n.className, "recharts-cartesian-axis-tick-value");
	if (/* @__PURE__ */ S.isValidElement(t)) i = /* @__PURE__ */ S.cloneElement(t, kA(kA({}, n), {}, { className: a }));
	else if (typeof t == "function") i = t(kA(kA({}, n), {}, { className: a }));
	else {
		var o = "recharts-cartesian-axis-tick-value";
		typeof t != "boolean" && (o = y(o, CD(t))), i = /* @__PURE__ */ S.createElement(CE, DA({}, n, { className: o }), r);
	}
	return i;
}
function zA(e) {
	var { ticks: t, axisType: n, axisId: r } = e, i = Vr();
	return (0, S.useEffect)(() => r == null || n == null ? en : (i(xA({
		ticks: t.map((e) => ({
			value: e.value,
			coordinate: e.coordinate,
			offset: e.offset,
			index: e.index
		})),
		axisId: r,
		axisType: n
	})), () => {
		i(SA({
			axisId: r,
			axisType: n
		}));
	}), [
		i,
		t,
		r,
		n
	]), null;
}
var BA = /* @__PURE__ */ (0, S.forwardRef)((e, t) => {
	var { ticks: n = [], tick: r, tickLine: i, stroke: a, tickFormatter: o, unit: s, padding: c, tickTextProps: l, orientation: u, mirror: d, x: f, y: p, width: m, height: h, tickSize: g, tickMargin: _, fontSize: v, letterSpacing: b, getTicksConfig: x, events: C, axisType: w, axisId: T } = e, O = vA(kA(kA({}, x), {}, { ticks: n }), v, b), k = E(x), ee = D(r), te = fE(k.textAnchor) ? k.textAnchor : IA(u, d), ne = LA(u, d), A = {};
	typeof i == "object" && (A = i);
	var re = kA(kA({}, k), {}, { fill: "none" }, A), ie = O.map((e) => kA({ entry: e }, FA(e, f, p, m, h, u, g, d, _))), j = ie.map((e) => {
		var { entry: t, line: n } = e;
		return /* @__PURE__ */ S.createElement(oe, {
			className: "recharts-cartesian-axis-tick",
			key: `tick-${t.value}-${t.coordinate}-${t.tickCoord}`
		}, i && /* @__PURE__ */ S.createElement("line", DA({}, re, n, { className: y("recharts-cartesian-axis-tick-line", It(i, "className")) })));
	}), M = ie.map((e, t) => {
		var { entry: n, tick: i } = e, u = kA(kA({}, kA(kA(kA(kA({ verticalAnchor: ne }, k), {}, {
			textAnchor: te,
			stroke: "none",
			fill: a
		}, i), {}, {
			index: t,
			payload: n,
			visibleTicksCount: O.length,
			tickFormatter: o,
			padding: c
		}, l), {}, { angle: l?.angle ?? k.angle ?? 0 })), ee);
		return /* @__PURE__ */ S.createElement(oe, DA({
			className: "recharts-cartesian-axis-tick-label",
			key: `tick-label-${n.value}-${n.coordinate}-${n.tickCoord}`
		}, bn(C, n, t)), r && /* @__PURE__ */ S.createElement(RA, {
			option: r,
			tickProps: u,
			value: `${typeof o == "function" ? o(n.value, t) : n.value}${s || ""}`
		}));
	});
	return /* @__PURE__ */ S.createElement("g", { className: `recharts-cartesian-axis-ticks recharts-${w}-ticks` }, /* @__PURE__ */ S.createElement(zA, {
		ticks: O,
		axisId: T,
		axisType: w
	}), M.length > 0 && /* @__PURE__ */ S.createElement(Ow, { zIndex: kp.label }, /* @__PURE__ */ S.createElement("g", {
		className: `recharts-cartesian-axis-tick-labels recharts-${w}-tick-labels`,
		ref: t
	}, M)), j.length > 0 && /* @__PURE__ */ S.createElement("g", { className: `recharts-cartesian-axis-tick-lines recharts-${w}-tick-lines` }, j));
}), VA = /* @__PURE__ */ (0, S.forwardRef)((e, t) => {
	var { axisLine: n, width: r, height: i, className: a, hide: o, ticks: s, axisType: c, axisId: l } = e, u = TA(e, wA), [d, f] = (0, S.useState)(""), [p, m] = (0, S.useState)(""), h = (0, S.useRef)(null);
	(0, S.useImperativeHandle)(t, () => ({ getCalculatedWidth: () => yA({
		ticks: h.current,
		label: e.labelRef?.current,
		labelGapWithTick: 5,
		tickSize: e.tickSize,
		tickMargin: e.tickMargin
	}) }));
	var g = (0, S.useCallback)((e) => {
		if (e) {
			var t = e.getElementsByClassName("recharts-cartesian-axis-tick-value");
			h.current = t;
			var n = t[0];
			if (n) {
				var r = window.getComputedStyle(n), i = r.fontSize, a = r.letterSpacing;
				(i !== d || a !== p) && (f(i), m(a));
			}
		}
	}, [d, p]);
	return o || r != null && r <= 0 || i != null && i <= 0 ? null : /* @__PURE__ */ S.createElement(Ow, { zIndex: e.zIndex }, /* @__PURE__ */ S.createElement(oe, { className: y("recharts-cartesian-axis", a) }, /* @__PURE__ */ S.createElement(PA, {
		x: e.x,
		y: e.y,
		width: r,
		height: i,
		orientation: e.orientation,
		mirror: e.mirror,
		axisLine: n,
		otherSvgProps: E(e)
	}), /* @__PURE__ */ S.createElement(BA, {
		ref: g,
		axisType: c,
		events: u,
		fontSize: d,
		getTicksConfig: e,
		height: e.height,
		letterSpacing: p,
		mirror: e.mirror,
		orientation: e.orientation,
		padding: e.padding,
		stroke: e.stroke,
		tick: e.tick,
		tickFormatter: e.tickFormatter,
		tickLine: e.tickLine,
		tickMargin: e.tickMargin,
		tickSize: e.tickSize,
		tickTextProps: e.tickTextProps,
		ticks: s,
		unit: e.unit,
		width: e.width,
		x: e.x,
		y: e.y,
		axisId: l
	}), /* @__PURE__ */ S.createElement(VE, {
		x: e.x,
		y: e.y,
		width: e.width,
		height: e.height,
		lowerWidth: e.width,
		upperWidth: e.width
	}, /* @__PURE__ */ S.createElement(tD, {
		label: e.label,
		labelRef: e.labelRef
	}), e.children)));
}), HA = /* @__PURE__ */ S.forwardRef((e, t) => {
	var n = En(e, NA);
	return /* @__PURE__ */ S.createElement(VA, DA({}, n, { ref: t }));
});
HA.displayName = "CartesianAxis";
//#endregion
//#region node_modules/recharts/es6/cartesian/CartesianGrid.js
var UA = [
	"x1",
	"y1",
	"x2",
	"y2",
	"key"
], WA = ["offset"], GA = ["xAxisId", "yAxisId"], KA = ["xAxisId", "yAxisId"];
function qA(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function JA(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? qA(Object(n), !0).forEach(function(t) {
			YA(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : qA(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function YA(e, t, n) {
	return (t = XA(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function XA(e) {
	var t = ZA(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function ZA(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function QA() {
	return QA = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, QA.apply(null, arguments);
}
function $A(e, t) {
	if (e == null) return {};
	var n, r, i = ej(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function ej(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var tj = (e) => {
	var { fill: t } = e;
	if (!t || t === "none") return null;
	var { fillOpacity: n, x: r, y: i, width: a, height: o, ry: s } = e;
	return /* @__PURE__ */ S.createElement("rect", {
		x: r,
		y: i,
		ry: s,
		width: a,
		height: o,
		stroke: "none",
		fill: t,
		fillOpacity: n,
		className: "recharts-cartesian-grid-bg"
	});
};
function nj(e) {
	var { option: t, lineItemProps: n } = e, r;
	if (/* @__PURE__ */ S.isValidElement(t)) r = /* @__PURE__ */ S.cloneElement(t, n);
	else if (typeof t == "function") r = t(n);
	else {
		var { x1: i, y1: a, x2: o, y2: s, key: c } = n, l = E($A(n, UA)) ?? {}, { offset: u } = l, d = $A(l, WA);
		r = /* @__PURE__ */ S.createElement("line", QA({}, d, {
			x1: i,
			y1: a,
			x2: o,
			y2: s,
			fill: "none",
			key: c
		}));
	}
	return r;
}
function rj(e) {
	var { x: t, width: n, horizontal: r = !0, horizontalPoints: i } = e;
	if (!r || !i || !i.length) return null;
	var { xAxisId: a, yAxisId: o } = e, s = $A(e, GA), c = i.map((e, i) => {
		var a = JA(JA({}, s), {}, {
			x1: t,
			y1: e,
			x2: t + n,
			y2: e,
			key: `line-${i}`,
			index: i
		});
		return /* @__PURE__ */ S.createElement(nj, {
			key: `line-${i}`,
			option: r,
			lineItemProps: a
		});
	});
	return /* @__PURE__ */ S.createElement("g", { className: "recharts-cartesian-grid-horizontal" }, c);
}
function ij(e) {
	var { y: t, height: n, vertical: r = !0, verticalPoints: i } = e;
	if (!r || !i || !i.length) return null;
	var { xAxisId: a, yAxisId: o } = e, s = $A(e, KA), c = i.map((e, i) => {
		var a = JA(JA({}, s), {}, {
			x1: e,
			y1: t,
			x2: e,
			y2: t + n,
			key: `line-${i}`,
			index: i
		});
		return /* @__PURE__ */ S.createElement(nj, {
			option: r,
			lineItemProps: a,
			key: `line-${i}`
		});
	});
	return /* @__PURE__ */ S.createElement("g", { className: "recharts-cartesian-grid-vertical" }, c);
}
function aj(e) {
	var { horizontalFill: t, fillOpacity: n, x: r, y: i, width: a, height: o, horizontalPoints: s, horizontal: c = !0 } = e;
	if (!c || !t || !t.length || s == null) return null;
	var l = s.map((e) => Math.round(e + i - i)).sort((e, t) => e - t);
	i !== l[0] && l.unshift(0);
	var u = l.map((e, s) => {
		var c = l[s + 1], u = c == null ? i + o - e : c - e;
		if (u <= 0) return null;
		var d = s % t.length;
		return /* @__PURE__ */ S.createElement("rect", {
			key: `react-${s}`,
			y: e,
			x: r,
			height: u,
			width: a,
			stroke: "none",
			fill: t[d],
			fillOpacity: n,
			className: "recharts-cartesian-grid-bg"
		});
	});
	return /* @__PURE__ */ S.createElement("g", { className: "recharts-cartesian-gridstripes-horizontal" }, u);
}
function oj(e) {
	var { vertical: t = !0, verticalFill: n, fillOpacity: r, x: i, y: a, width: o, height: s, verticalPoints: c } = e;
	if (!t || !n || !n.length) return null;
	var l = c.map((e) => Math.round(e + i - i)).sort((e, t) => e - t);
	i !== l[0] && l.unshift(0);
	var u = l.map((e, t) => {
		var c = l[t + 1], u = c == null ? i + o - e : c - e;
		if (u <= 0) return null;
		var d = t % n.length;
		return /* @__PURE__ */ S.createElement("rect", {
			key: `react-${t}`,
			x: e,
			y: a,
			width: u,
			height: s,
			stroke: "none",
			fill: n[d],
			fillOpacity: r,
			className: "recharts-cartesian-grid-bg"
		});
	});
	return /* @__PURE__ */ S.createElement("g", { className: "recharts-cartesian-gridstripes-vertical" }, u);
}
var sj = (e, t) => {
	var { xAxis: n, width: r, height: i, offset: a } = e;
	return Ts(vA(JA(JA(JA({}, NA), n), {}, {
		ticks: Es(n, !0),
		viewBox: {
			x: 0,
			y: 0,
			width: r,
			height: i
		}
	})), a.left, a.left + a.width, t);
}, cj = (e, t) => {
	var { yAxis: n, width: r, height: i, offset: a } = e;
	return Ts(vA(JA(JA(JA({}, NA), n), {}, {
		ticks: Es(n, !0),
		viewBox: {
			x: 0,
			y: 0,
			width: r,
			height: i
		}
	})), a.top, a.top + a.height, t);
}, lj = {
	horizontal: !0,
	vertical: !0,
	horizontalPoints: [],
	verticalPoints: [],
	stroke: "#ccc",
	fill: "none",
	verticalFill: [],
	horizontalFill: [],
	xAxisId: 0,
	yAxisId: 0,
	syncWithTicks: !1,
	zIndex: kp.grid
};
function uj(e) {
	var t = Uc(), n = Wc(), r = Hc(), i = JA(JA({}, En(e, lj)), {}, {
		x: F(e.x) ? e.x : r.left,
		y: F(e.y) ? e.y : r.top,
		width: F(e.width) ? e.width : r.width,
		height: F(e.height) ? e.height : r.height
	}), { xAxisId: a, yAxisId: o, x: s, y: c, width: l, height: u, syncWithTicks: d, horizontalValues: f, verticalValues: p } = i, m = dc(), h = I((e) => tS(e, "xAxis", a, m)), g = I((e) => tS(e, "yAxis", o, m));
	if (!gs(l) || !gs(u) || !F(s) || !F(c)) return null;
	var _ = i.verticalCoordinatesGenerator || sj, v = i.horizontalCoordinatesGenerator || cj, { horizontalPoints: y, verticalPoints: b } = i;
	if ((!y || !y.length) && typeof v == "function") {
		var x = f && f.length, C = v({
			yAxis: g ? JA(JA({}, g), {}, { ticks: x ? f : g.ticks }) : void 0,
			width: t ?? l,
			height: n ?? u,
			offset: r
		}, x ? !0 : d);
		vc(Array.isArray(C), `horizontalCoordinatesGenerator should return Array but instead it returned [${typeof C}]`), Array.isArray(C) && (y = C);
	}
	if ((!b || !b.length) && typeof _ == "function") {
		var w = p && p.length, T = _({
			xAxis: h ? JA(JA({}, h), {}, { ticks: w ? p : h.ticks }) : void 0,
			width: t ?? l,
			height: n ?? u,
			offset: r
		}, w ? !0 : d);
		vc(Array.isArray(T), `verticalCoordinatesGenerator should return Array but instead it returned [${typeof T}]`), Array.isArray(T) && (b = T);
	}
	return /* @__PURE__ */ S.createElement(Ow, { zIndex: i.zIndex }, /* @__PURE__ */ S.createElement("g", { className: "recharts-cartesian-grid" }, /* @__PURE__ */ S.createElement(tj, {
		fill: i.fill,
		fillOpacity: i.fillOpacity,
		x: i.x,
		y: i.y,
		width: i.width,
		height: i.height,
		ry: i.ry
	}), /* @__PURE__ */ S.createElement(aj, QA({}, i, { horizontalPoints: y })), /* @__PURE__ */ S.createElement(oj, QA({}, i, { verticalPoints: b })), /* @__PURE__ */ S.createElement(rj, QA({}, i, {
		offset: r,
		horizontalPoints: y,
		xAxis: h,
		yAxis: g
	})), /* @__PURE__ */ S.createElement(ij, QA({}, i, {
		offset: r,
		verticalPoints: b,
		xAxis: h,
		yAxis: g
	}))));
}
uj.displayName = "CartesianGrid";
//#endregion
//#region node_modules/recharts/es6/state/errorBarSlice.js
var dj = xo({
	name: "errorBars",
	initialState: {},
	reducers: {
		addErrorBar: (e, t) => {
			var { itemId: n, errorBar: r } = t.payload;
			e[n] || (e[n] = []), e[n].push(r);
		},
		replaceErrorBar: (e, t) => {
			var { itemId: n, prev: r, next: i } = t.payload;
			e[n] && (e[n] = e[n].map((e) => e.dataKey === r.dataKey && e.direction === r.direction ? i : e));
		},
		removeErrorBar: (e, t) => {
			var { itemId: n, errorBar: r } = t.payload;
			e[n] && (e[n] = e[n].filter((e) => e.dataKey !== r.dataKey || e.direction !== r.direction));
		}
	}
}), { addErrorBar: fj, replaceErrorBar: pj, removeErrorBar: mj } = dj.actions, hj = dj.reducer, gj = ["children"];
function _j(e, t) {
	if (e == null) return {};
	var n, r, i = vj(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function vj(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var yj = /* @__PURE__ */ (0, S.createContext)({
	data: [],
	xAxisId: "xAxis-0",
	yAxisId: "yAxis-0",
	dataPointFormatter: () => ({
		x: 0,
		y: 0,
		value: 0
	}),
	errorBarOffset: 0
});
function bj(e) {
	var { children: t } = e, n = _j(e, gj);
	return /* @__PURE__ */ S.createElement(yj.Provider, { value: n }, t);
}
//#endregion
//#region node_modules/recharts/es6/cartesian/GraphicalItemClipPath.js
function xj(e, t) {
	var n = I((t) => ib(t, e)), r = I((e) => sb(e, t)), i = n?.allowDataOverflow ?? nb.allowDataOverflow, a = r?.allowDataOverflow ?? ab.allowDataOverflow;
	return {
		needClip: i || a,
		needClipX: i,
		needClipY: a
	};
}
function Sj(e) {
	var { xAxisId: t, yAxisId: n, clipPathId: r } = e, i = tk(), { needClipX: a, needClipY: o, needClip: s } = xj(t, n);
	if (!s || !i) return null;
	var { x: c, y: l, width: u, height: d } = i;
	return /* @__PURE__ */ S.createElement("clipPath", { id: `clipPath-${r}` }, /* @__PURE__ */ S.createElement("rect", {
		x: a ? c : c - u / 2,
		y: o ? l : l - d / 2,
		width: a ? u : u * 2,
		height: o ? d : d * 2
	}));
}
//#endregion
//#region node_modules/recharts/es6/state/selectors/lineSelectors.js
var Cj = (e, t, n, r) => iS(e, "xAxis", t, r), wj = (e, t, n, r) => rS(e, "xAxis", t, r), Tj = (e, t, n, r) => iS(e, "yAxis", n, r), Ej = (e, t, n, r) => rS(e, "yAxis", n, r), Dj = L([
	U,
	Cj,
	Tj,
	wj,
	Ej
], (e, t, n, r, i) => ws(e, "xAxis") ? zs(t, r, !1) : zs(n, i, !1)), Oj = (e, t, n, r, i) => i;
function kj(e) {
	return e.type === "line";
}
var Aj = L([
	U,
	Cj,
	Tj,
	wj,
	Ej,
	L([hb, Oj], (e, t) => e.filter(kj).find((e) => e.id === t)),
	Dj,
	ip
], (e, t, n, r, i, a, o, s) => {
	var { chartData: c, dataStartIndex: l, dataEndIndex: u } = s;
	if (!(a == null || t == null || n == null || r == null || i == null || r.length === 0 || i.length === 0 || o == null || e !== "horizontal" && e !== "vertical")) {
		var { dataKey: d, data: f } = a, p = f != null && f.length > 0 ? f : c?.slice(l, u + 1);
		if (p != null) return iM({
			layout: e,
			xAxis: t,
			yAxis: n,
			xAxisTicks: r,
			yAxisTicks: i,
			dataKey: d,
			bandSize: o,
			displayedData: p
		});
	}
});
//#endregion
//#region node_modules/recharts/es6/util/getRadiusAndStrokeWidthFromDot.js
function jj(e) {
	var t = D(e), n = 3, r = 2;
	if (t != null) {
		var { r: i, strokeWidth: a } = t, o = Number(i), s = Number(a);
		return (Number.isNaN(o) || o < 0) && (o = n), (Number.isNaN(s) || s < 0) && (s = r), {
			r: o,
			strokeWidth: s
		};
	}
	return {
		r: n,
		strokeWidth: r
	};
}
//#endregion
//#region node_modules/recharts/es6/cartesian/Line.js
var Mj = ["id"], Nj = [
	"type",
	"layout",
	"connectNulls",
	"needClip",
	"shape"
], Pj = [
	"activeDot",
	"animateNewValues",
	"animationBegin",
	"animationDuration",
	"animationEasing",
	"connectNulls",
	"dot",
	"hide",
	"isAnimationActive",
	"label",
	"legendType",
	"xAxisId",
	"yAxisId",
	"id"
];
function Fj() {
	return Fj = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, Fj.apply(null, arguments);
}
function Ij(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Lj(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Ij(Object(n), !0).forEach(function(t) {
			Rj(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ij(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Rj(e, t, n) {
	return (t = zj(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function zj(e) {
	var t = Bj(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Bj(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Vj(e, t) {
	if (e == null) return {};
	var n, r, i = Hj(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function Hj(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var Uj = (e) => {
	var { dataKey: t, name: n, stroke: r, legendType: i, hide: a } = e;
	return [{
		inactive: a,
		dataKey: t,
		type: i,
		color: r,
		value: Vs(n, t),
		payload: e
	}];
}, Wj = /* @__PURE__ */ S.memo((e) => {
	var { dataKey: t, data: n, stroke: r, strokeWidth: i, fill: a, name: o, hide: s, unit: c, tooltipType: l, id: u } = e, d = {
		dataDefinedOnItem: n,
		getPosition: en,
		settings: {
			stroke: r,
			strokeWidth: i,
			fill: a,
			dataKey: t,
			nameKey: void 0,
			name: Vs(o, t),
			hide: s,
			type: l,
			color: r,
			unit: c,
			graphicalItemId: u
		}
	};
	return /* @__PURE__ */ S.createElement(uO, { tooltipEntrySettings: d });
}), Gj = (e, t) => `${t}px ${e}px`;
function Kj(e, t) {
	for (var n = e.length % 2 == 0 ? e : [...e, 0], r = [], i = 0; i < t; ++i) r.push(...n);
	return r;
}
var qj = (e, t, n) => {
	var r = n.reduce((e, t) => e + t, 0);
	if (!r) return Gj(t, e);
	for (var i = Math.floor(e / r), a = e % r, o = [], s = 0, c = 0; s < n.length; c += (l = n[s]) ?? 0, ++s) {
		var l, u = n[s];
		if (u != null && c + u > a) {
			o = [...n.slice(0, s), a - c];
			break;
		}
	}
	var d = o.length % 2 == 0 ? [0, t] : [t];
	return [
		...Kj(n, i),
		...o,
		...d
	].map((e) => `${e}px`).join(", ");
};
function Jj(e) {
	var { clipPathId: t, points: n, props: r } = e, { dot: i, dataKey: a, needClip: o } = r, { id: s } = r, c = E(Vj(r, Mj));
	return /* @__PURE__ */ S.createElement(IO, {
		points: n,
		dot: i,
		className: "recharts-line-dots",
		dotClassName: "recharts-line-dot",
		dataKey: a,
		baseProps: c,
		needClip: o,
		clipPathId: t
	});
}
function Yj(e) {
	var { showLabels: t, children: n, points: r } = e, i = (0, S.useMemo)(() => r?.map((e) => {
		var t = {
			x: e.x ?? 0,
			y: e.y ?? 0,
			width: 0,
			lowerWidth: 0,
			upperWidth: 0,
			height: 0
		};
		return Lj(Lj({}, t), {}, {
			value: e.value,
			payload: e.payload,
			viewBox: t,
			parentViewBox: void 0,
			fill: void 0
		});
	}), [r]);
	return /* @__PURE__ */ S.createElement(lD, { value: t ? i : void 0 }, n);
}
function Xj(e) {
	var { clipPathId: t, pathRef: n, points: r, strokeDasharray: i, props: a } = e, { type: o, layout: s, connectNulls: c, needClip: l, shape: u } = a, d = Lj(Lj({}, O(Vj(a, Nj))), {}, {
		fill: "none",
		className: "recharts-line-curve",
		clipPath: l ? `url(#clipPath-${t})` : void 0,
		points: r,
		type: o,
		layout: s,
		connectNulls: c,
		strokeDasharray: i ?? a.strokeDasharray
	});
	return /* @__PURE__ */ S.createElement(S.Fragment, null, r?.length > 1 && /* @__PURE__ */ S.createElement(oO, Fj({
		shapeType: "curve",
		option: u
	}, d, { pathRef: n })), /* @__PURE__ */ S.createElement(Jj, {
		points: r,
		clipPathId: t,
		props: a
	}));
}
function Zj(e) {
	try {
		return e && e.getTotalLength && e.getTotalLength() || 0;
	} catch {
		return 0;
	}
}
function Qj(e) {
	var { clipPathId: t, props: n, pathRef: r, previousPointsRef: i, longestAnimatedLengthRef: a } = e, { points: o, strokeDasharray: s, isAnimationActive: c, animationBegin: l, animationDuration: u, animationEasing: d, animateNewValues: f, width: p, height: m, onAnimationEnd: h, onAnimationStart: g } = n, _ = i.current, v = Xd(o, "recharts-line-"), y = (0, S.useRef)(v), [b, x] = (0, S.useState)(!1), C = !b, w = (0, S.useCallback)(() => {
		typeof h == "function" && h(), x(!1);
	}, [h]), T = (0, S.useCallback)(() => {
		typeof g == "function" && g(), x(!0);
	}, [g]), E = Zj(r.current), D = (0, S.useRef)(0);
	y.current !== v && (D.current = a.current, y.current = v);
	var O = D.current;
	return /* @__PURE__ */ S.createElement(Yj, {
		points: o,
		showLabels: C
	}, n.children, /* @__PURE__ */ S.createElement(Yd, {
		animationId: v,
		begin: l,
		duration: u,
		isActive: c,
		easing: d,
		onAnimationEnd: w,
		onAnimationStart: T,
		key: v
	}, (e) => {
		var l = Yt(O, E + O, e), u = Math.min(l, E), d = c ? s ? qj(u, E, `${s}`.split(/[,\s]+/gim).map((e) => parseFloat(e))) : Gj(E, u) : s == null ? void 0 : String(s);
		if (e > 0 && E > 0 && (i.current = o, a.current = Math.max(a.current, u)), _) {
			var h = _.length / o.length, g = e === 1 ? o : o.map((t, n) => {
				var r = Math.floor(n * h);
				if (_[r]) {
					var i = _[r];
					return Lj(Lj({}, t), {}, {
						x: Yt(i.x, t.x, e),
						y: Yt(i.y, t.y, e)
					});
				}
				return f ? Lj(Lj({}, t), {}, {
					x: Yt(p * 2, t.x, e),
					y: Yt(m / 2, t.y, e)
				}) : Lj(Lj({}, t), {}, {
					x: t.x,
					y: t.y
				});
			});
			return i.current = g, /* @__PURE__ */ S.createElement(Xj, {
				props: n,
				points: g,
				clipPathId: t,
				pathRef: r,
				strokeDasharray: d
			});
		}
		return /* @__PURE__ */ S.createElement(Xj, {
			props: n,
			points: o,
			clipPathId: t,
			pathRef: r,
			strokeDasharray: d
		});
	}), /* @__PURE__ */ S.createElement(mD, { label: n.label }));
}
function $j(e) {
	var { clipPathId: t, props: n } = e, r = (0, S.useRef)(null), i = (0, S.useRef)(0), a = (0, S.useRef)(null);
	return /* @__PURE__ */ S.createElement(Qj, {
		props: n,
		clipPathId: t,
		previousPointsRef: r,
		longestAnimatedLengthRef: i,
		pathRef: a
	});
}
var eM = (e, t) => ({
	x: e.x ?? void 0,
	y: e.y ?? void 0,
	value: e.value,
	errorVal: Ss(e.payload, t)
}), tM = class extends S.Component {
	render() {
		var { hide: e, dot: t, points: n, className: r, xAxisId: i, yAxisId: a, top: o, left: s, width: c, height: l, id: u, needClip: d, zIndex: f } = this.props;
		if (e) return null;
		var p = y("recharts-line", r), m = u, { r: h, strokeWidth: g } = jj(t), _ = jD(t), v = h * 2 + g, b = d ? `url(#clipPath-${_ ? "" : "dots-"}${m})` : void 0;
		return /* @__PURE__ */ S.createElement(Ow, { zIndex: f }, /* @__PURE__ */ S.createElement(oe, { className: p }, d && /* @__PURE__ */ S.createElement("defs", null, /* @__PURE__ */ S.createElement(Sj, {
			clipPathId: m,
			xAxisId: i,
			yAxisId: a
		}), !_ && /* @__PURE__ */ S.createElement("clipPath", { id: `clipPath-dots-${m}` }, /* @__PURE__ */ S.createElement("rect", {
			x: s - v / 2,
			y: o - v / 2,
			width: c + v,
			height: l + v
		}))), /* @__PURE__ */ S.createElement(bj, {
			xAxisId: i,
			yAxisId: a,
			data: n,
			dataPointFormatter: eM,
			errorBarOffset: 0
		}, /* @__PURE__ */ S.createElement($j, {
			props: this.props,
			clipPathId: m
		}))), /* @__PURE__ */ S.createElement(lk, {
			activeDot: this.props.activeDot,
			points: n,
			mainColor: this.props.stroke,
			itemDataKey: this.props.dataKey,
			clipPath: b
		}));
	}
}, nM = {
	activeDot: !0,
	animateNewValues: !0,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease",
	connectNulls: !1,
	dot: !0,
	fill: "#fff",
	hide: !1,
	isAnimationActive: "auto",
	label: !1,
	legendType: "line",
	stroke: "#3182bd",
	strokeWidth: 1,
	xAxisId: 0,
	yAxisId: 0,
	zIndex: kp.line,
	type: "linear"
};
function rM(e) {
	var t = En(e, nM), { activeDot: n, animateNewValues: r, animationBegin: i, animationDuration: a, animationEasing: o, connectNulls: s, dot: c, hide: l, isAnimationActive: u, label: d, legendType: f, xAxisId: p, yAxisId: m, id: h } = t, g = Vj(t, Pj), { needClip: _ } = xj(p, m), v = tk(), y = Gc(), b = dc(), x = I((e) => Aj(e, p, m, b, h));
	if (y !== "horizontal" && y !== "vertical" || x == null || v == null) return null;
	var { height: C, width: w, x: T, y: E } = v;
	return /* @__PURE__ */ S.createElement(tM, Fj({}, g, {
		id: h,
		connectNulls: s,
		dot: c,
		activeDot: n,
		animateNewValues: r,
		animationBegin: i,
		animationDuration: a,
		animationEasing: o,
		isAnimationActive: u,
		hide: l,
		label: d,
		legendType: f,
		xAxisId: p,
		yAxisId: m,
		points: x,
		layout: y,
		height: C,
		width: w,
		left: T,
		top: E,
		needClip: _
	}));
}
function iM(e) {
	var { layout: t, xAxis: n, yAxis: r, xAxisTicks: i, yAxisTicks: a, dataKey: o, bandSize: s, displayedData: c } = e;
	return c.map((e, c) => {
		var l = Ss(e, o);
		if (t === "horizontal") return {
			x: js({
				axis: n,
				ticks: i,
				bandSize: s,
				entry: e,
				index: c
			}),
			y: (Zt(l) ? null : r.scale.map(l)) ?? null,
			value: l,
			payload: e
		};
		var u = Zt(l) ? null : n.scale.map(l), d = js({
			axis: r,
			ticks: a,
			bandSize: s,
			entry: e,
			index: c
		});
		return u == null || d == null ? null : {
			x: u,
			y: d,
			value: l,
			payload: e
		};
	}).filter(Boolean);
}
function aM(e) {
	var t = En(e, nM), n = dc();
	return /* @__PURE__ */ S.createElement(hO, {
		id: t.id,
		type: "line"
	}, (e) => /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement(dO, { legendPayload: Uj(t) }), /* @__PURE__ */ S.createElement(Wj, {
		dataKey: t.dataKey,
		data: t.data,
		stroke: t.stroke,
		strokeWidth: t.strokeWidth,
		fill: t.fill,
		name: t.name,
		hide: t.hide,
		unit: t.unit,
		tooltipType: t.tooltipType,
		id: e
	}), /* @__PURE__ */ S.createElement(wO, {
		type: "line",
		id: e,
		data: t.data,
		xAxisId: t.xAxisId,
		yAxisId: t.yAxisId,
		zAxisId: 0,
		dataKey: t.dataKey,
		hide: t.hide,
		isPanorama: n
	}), /* @__PURE__ */ S.createElement(rM, Fj({}, t, { id: e }))));
}
var oM = /* @__PURE__ */ S.memo(aM, fu);
oM.displayName = "Line";
//#endregion
//#region node_modules/recharts/es6/state/selectors/graphicalItemSelectors.js
function sM(e, t) {
	return e.graphicalItems.cartesianItems.find((e) => e.id === t)?.xAxisId ?? 0;
}
function cM(e, t) {
	return e.graphicalItems.cartesianItems.find((e) => e.id === t)?.yAxisId ?? 0;
}
//#endregion
//#region node_modules/tiny-invariant/dist/esm/tiny-invariant.js
var lM = !0, uM = "Invariant failed";
function dM(e, t) {
	if (!e) {
		if (lM) throw Error(uM);
		var n = typeof t == "function" ? t() : t, r = n ? `${uM}: ${n}` : uM;
		throw Error(r);
	}
}
//#endregion
//#region node_modules/recharts/es6/util/BarUtils.js
function fM() {
	return fM = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, fM.apply(null, arguments);
}
function pM(e) {
	return /* @__PURE__ */ S.createElement(oO, fM({
		shapeType: "rectangle",
		activeClassName: "recharts-active-bar",
		inActiveClassName: "recharts-inactive-bar"
	}, e));
}
var mM = function(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
	return (n, r) => {
		if (F(e)) return e;
		var i = F(n) || Zt(n);
		return i ? e(n, r) : (!i && dM(!1, `minPointSize callback function received a value with type of ${typeof n}. Currently only numbers or null/undefined are supported.`), t);
	};
}, hM = (e, t, n) => n, gM = L([hb, (e, t) => t], (e, t) => e.filter((e) => e.type === "bar").find((e) => e.id === t)), _M = L([gM], (e) => e?.maxBarSize), vM = (e, t, n, r) => r, yM = L([
	U,
	hb,
	sM,
	cM,
	hM
], (e, t, n, r, i) => t.filter((t) => e === "horizontal" ? t.xAxisId === n : t.yAxisId === r).filter((e) => e.isPanorama === i).filter((e) => e.hide === !1).filter((e) => e.type === "bar")), bM = (e, t, n) => {
	var r = U(e), i = sM(e, t), a = cM(e, t);
	if (!(i == null || a == null)) return r === "horizontal" ? zb(e, "yAxis", a, n) : zb(e, "xAxis", i, n);
}, xM = L([
	yM,
	Sp,
	(e, t) => {
		var n = U(e), r = sM(e, t), i = cM(e, t);
		if (!(r == null || i == null)) return n === "horizontal" ? Qx(e, "xAxis", r) : Qx(e, "yAxis", i);
	}
], dk), SM = (e, t, n) => {
	var r = gM(e, t);
	if (r == null) return 0;
	var i = sM(e, t), a = cM(e, t);
	if (i == null || a == null) return 0;
	var o = U(e), s = yp(e), { maxBarSize: c } = r, l = Zt(c) ? s : c, u, d;
	return o === "horizontal" ? (u = iS(e, "xAxis", i, n), d = rS(e, "xAxis", i, n)) : (u = iS(e, "yAxis", a, n), d = rS(e, "yAxis", a, n)), zs(u, d, !0) ?? l ?? 0;
}, CM = (e, t, n) => {
	var r = U(e), i = sM(e, t), a = cM(e, t);
	if (!(i == null || a == null)) {
		var o, s;
		return r === "horizontal" ? (o = iS(e, "xAxis", i, n), s = rS(e, "xAxis", i, n)) : (o = iS(e, "yAxis", a, n), s = rS(e, "yAxis", a, n)), zs(o, s);
	}
}, wM = L([
	sc,
	lc,
	(e, t, n) => {
		var r = sM(e, t);
		if (r != null) return iS(e, "xAxis", r, n);
	},
	(e, t, n) => {
		var r = cM(e, t);
		if (r != null) return iS(e, "yAxis", r, n);
	},
	(e, t, n) => {
		var r = sM(e, t);
		if (r != null) return rS(e, "xAxis", r, n);
	},
	(e, t, n) => {
		var r = cM(e, t);
		if (r != null) return rS(e, "yAxis", r, n);
	},
	L([L([
		xM,
		yp,
		bp,
		xp,
		SM,
		CM,
		_M
	], vk), gM], bk),
	U,
	ap,
	CM,
	L([bM, gM], yk),
	gM,
	vM
], (e, t, n, r, i, a, o, s, c, l, u, d, f) => {
	var { chartData: p, dataStartIndex: m, dataEndIndex: h } = c;
	if (!(d == null || o == null || t == null || s !== "horizontal" && s !== "vertical" || n == null || r == null || i == null || a == null || l == null)) {
		var { data: g } = d, _ = g != null && g.length > 0 ? g : p?.slice(m, h + 1);
		if (_ != null) return oN({
			layout: s,
			barSettings: d,
			pos: o,
			parentViewBox: t,
			bandSize: l,
			xAxis: n,
			yAxis: r,
			xAxisTicks: i,
			yAxisTicks: a,
			stackedData: u,
			displayedData: _,
			offset: e,
			cells: f,
			dataStartIndex: m
		});
	}
}), TM = ["index"];
function EM() {
	return EM = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, EM.apply(null, arguments);
}
function DM(e, t) {
	if (e == null) return {};
	var n, r, i = OM(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function OM(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var kM = /* @__PURE__ */ (0, S.createContext)(void 0), AM = (e) => {
	var t = (0, S.useContext)(kM);
	if (t != null) return t.stackId;
	if (e != null) return As(e);
}, jM = (e, t) => `recharts-bar-stack-clip-path-${e}-${t}`, MM = (e) => {
	var t = (0, S.useContext)(kM);
	if (t != null) {
		var { stackId: n } = t;
		return `url(#${jM(n, e)})`;
	}
}, NM = (e) => {
	var { index: t } = e, n = DM(e, TM), r = MM(t);
	return /* @__PURE__ */ S.createElement(oe, EM({
		className: "recharts-bar-stack-layer",
		clipPath: r
	}, n));
}, PM = [
	"onMouseEnter",
	"onMouseLeave",
	"onClick"
], FM = [
	"value",
	"background",
	"tooltipPosition"
], IM = ["id"], LM = [
	"onMouseEnter",
	"onClick",
	"onMouseLeave"
];
function RM() {
	return RM = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, RM.apply(null, arguments);
}
function zM(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function BM(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? zM(Object(n), !0).forEach(function(t) {
			VM(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : zM(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function VM(e, t, n) {
	return (t = HM(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function HM(e) {
	var t = UM(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function UM(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function WM(e, t) {
	if (e == null) return {};
	var n, r, i = GM(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function GM(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var KM = (e) => {
	var { dataKey: t, name: n, fill: r, legendType: i, hide: a } = e;
	return [{
		inactive: a,
		dataKey: t,
		type: i,
		color: r,
		value: Vs(n, t),
		payload: e
	}];
}, qM = /* @__PURE__ */ S.memo((e) => {
	var { dataKey: t, stroke: n, strokeWidth: r, fill: i, name: a, hide: o, unit: s, tooltipType: c, id: l } = e, u = {
		dataDefinedOnItem: void 0,
		getPosition: en,
		settings: {
			stroke: n,
			strokeWidth: r,
			fill: i,
			dataKey: t,
			nameKey: void 0,
			name: Vs(a, t),
			hide: o,
			type: c,
			color: i,
			unit: s,
			graphicalItemId: l
		}
	};
	return /* @__PURE__ */ S.createElement(uO, { tooltipEntrySettings: u });
});
function JM(e) {
	var t = I(wC), { data: n, dataKey: r, background: i, allOtherBarProps: a } = e, { onMouseEnter: o, onMouseLeave: s, onClick: c } = a, l = WM(a, PM), u = sO(o, r, a.id), d = cO(s), f = lO(c, r, a.id);
	if (!i || n == null) return null;
	var p = D(i);
	return /* @__PURE__ */ S.createElement(Ow, { zIndex: xk(i, kp.barBackground) }, n.map((e, n) => {
		var { value: a, background: o, tooltipPosition: s } = e, c = WM(e, FM);
		if (!o) return null;
		var m = u(e, n), h = d(e, n), g = f(e, n), _ = BM(BM(BM(BM(BM({
			option: i,
			isActive: String(n) === t
		}, c), {}, { fill: "#eee" }, o), p), bn(l, e, n)), {}, {
			onMouseEnter: m,
			onMouseLeave: h,
			onClick: g,
			dataKey: r,
			index: n,
			className: "recharts-bar-background-rectangle"
		});
		return /* @__PURE__ */ S.createElement(pM, RM({ key: `background-bar-${n}` }, _));
	}));
}
function YM(e) {
	var { showLabels: t, children: n, rects: r } = e, i = r?.map((e) => {
		var t = {
			x: e.x,
			y: e.y,
			width: e.width,
			lowerWidth: e.width,
			upperWidth: e.width,
			height: e.height
		};
		return BM(BM({}, t), {}, {
			value: e.value,
			payload: e.payload,
			parentViewBox: e.parentViewBox,
			viewBox: t,
			fill: e.fill
		});
	});
	return /* @__PURE__ */ S.createElement(lD, { value: t ? i : void 0 }, n);
}
function XM(e) {
	var { shape: t, activeBar: n, baseProps: r, entry: i, index: a, dataKey: o } = e, s = I(wC), c = I(EC), l = n && String(i.originalDataIndex) === s && (c == null || o === c), [u, d] = (0, S.useState)(!1), [f, p] = (0, S.useState)(!1);
	(0, S.useEffect)(() => {
		var e;
		return l ? (d(!0), e = requestAnimationFrame(() => {
			p(!0);
		})) : p(!1), () => {
			cancelAnimationFrame(e);
		};
	}, [l]);
	var m = (0, S.useCallback)(() => {
		l || d(!1);
	}, [l]), h = l && f, g = l || u, _ = l ? n === !0 ? t : n : t, v = /* @__PURE__ */ S.createElement(pM, RM({}, r, { name: String(r.name) }, i, {
		isActive: h,
		option: _,
		index: a,
		dataKey: o,
		onTransitionEnd: m
	}));
	return g ? /* @__PURE__ */ S.createElement(Ow, { zIndex: kp.activeBar }, /* @__PURE__ */ S.createElement(NM, { index: i.originalDataIndex }, v)) : v;
}
function ZM(e) {
	var { shape: t, baseProps: n, entry: r, index: i, dataKey: a } = e;
	return /* @__PURE__ */ S.createElement(pM, RM({}, n, { name: String(n.name) }, r, {
		isActive: !1,
		option: t,
		index: i,
		dataKey: a
	}));
}
function QM(e) {
	var { data: t, props: n } = e, r = E(n) ?? {}, { id: i } = r, a = WM(r, IM), { shape: o, dataKey: s, activeBar: c } = n, { onMouseEnter: l, onClick: u, onMouseLeave: d } = n, f = WM(n, LM), p = sO(l, s, i), m = cO(d), h = lO(u, s, i);
	return t ? /* @__PURE__ */ S.createElement(S.Fragment, null, t.map((e, t) => /* @__PURE__ */ S.createElement(NM, RM({
		index: e.originalDataIndex,
		key: `rectangle-${e?.x}-${e?.y}-${e?.value}-${t}`,
		className: "recharts-bar-rectangle"
	}, bn(f, e, t), {
		onMouseEnter: p(e, t),
		onMouseLeave: m(e, t),
		onClick: h(e, t)
	}), c ? /* @__PURE__ */ S.createElement(XM, {
		shape: o,
		activeBar: c,
		baseProps: a,
		entry: e,
		index: t,
		dataKey: s
	}) : /* @__PURE__ */ S.createElement(ZM, {
		shape: o,
		baseProps: a,
		entry: e,
		index: t,
		dataKey: s
	})))) : null;
}
function $M(e) {
	var { props: t, previousRectanglesRef: n } = e, { data: r, layout: i, isAnimationActive: a, animationBegin: o, animationDuration: s, animationEasing: c, onAnimationEnd: l, onAnimationStart: u } = t, d = n.current, f = Xd(t, "recharts-bar-"), [p, m] = (0, S.useState)(!1), h = !p, g = (0, S.useCallback)(() => {
		typeof l == "function" && l(), m(!1);
	}, [l]), _ = (0, S.useCallback)(() => {
		typeof u == "function" && u(), m(!0);
	}, [u]);
	return /* @__PURE__ */ S.createElement(YM, {
		showLabels: h,
		rects: r
	}, /* @__PURE__ */ S.createElement(Yd, {
		animationId: f,
		begin: o,
		duration: s,
		isActive: a,
		easing: c,
		onAnimationEnd: g,
		onAnimationStart: _,
		key: f
	}, (e) => {
		var a = e === 1 ? r : r?.map((t, n) => {
			var r = d && d[n];
			if (r) return BM(BM({}, t), {}, {
				x: Yt(r.x, t.x, e),
				y: Yt(r.y, t.y, e),
				width: Yt(r.width, t.width, e),
				height: Yt(r.height, t.height, e)
			});
			if (i === "horizontal") {
				var a = Yt(0, t.height, e), o = Yt(t.stackedBarStart, t.y, e);
				return BM(BM({}, t), {}, {
					y: o,
					height: a
				});
			}
			var s = Yt(0, t.width, e), c = Yt(t.stackedBarStart, t.x, e);
			return BM(BM({}, t), {}, {
				width: s,
				x: c
			});
		});
		return e > 0 && (n.current = a ?? null), a == null ? null : /* @__PURE__ */ S.createElement(oe, null, /* @__PURE__ */ S.createElement(QM, {
			props: t,
			data: a
		}));
	}), /* @__PURE__ */ S.createElement(mD, { label: t.label }), t.children);
}
function eN(e) {
	var t = (0, S.useRef)(null);
	return /* @__PURE__ */ S.createElement($M, {
		previousRectanglesRef: t,
		props: e
	});
}
var tN = 0, nN = (e, t) => {
	var n = Array.isArray(e.value) ? e.value[1] : e.value;
	return {
		x: e.x,
		y: e.y,
		value: n,
		errorVal: Ss(e, t)
	};
}, rN = class extends S.PureComponent {
	render() {
		var { hide: e, data: t, dataKey: n, className: r, xAxisId: i, yAxisId: a, needClip: o, background: s, id: c } = this.props;
		if (e || t == null) return null;
		var l = y("recharts-bar", r), u = c;
		return /* @__PURE__ */ S.createElement(oe, {
			className: l,
			id: c
		}, o && /* @__PURE__ */ S.createElement("defs", null, /* @__PURE__ */ S.createElement(Sj, {
			clipPathId: u,
			xAxisId: i,
			yAxisId: a
		})), /* @__PURE__ */ S.createElement(oe, {
			className: "recharts-bar-rectangles",
			clipPath: o ? `url(#clipPath-${u})` : void 0
		}, /* @__PURE__ */ S.createElement(JM, {
			data: t,
			dataKey: n,
			background: s,
			allOtherBarProps: this.props
		}), /* @__PURE__ */ S.createElement(eN, this.props)));
	}
}, iN = {
	activeBar: !1,
	animationBegin: 0,
	animationDuration: 400,
	animationEasing: "ease",
	background: !1,
	hide: !1,
	isAnimationActive: "auto",
	label: !1,
	legendType: "rect",
	minPointSize: tN,
	xAxisId: 0,
	yAxisId: 0,
	zIndex: kp.bar
};
function aN(e) {
	var { xAxisId: t, yAxisId: n, hide: r, legendType: i, minPointSize: a, activeBar: o, animationBegin: s, animationDuration: c, animationEasing: l, isAnimationActive: u } = e, { needClip: d } = xj(t, n), f = Gc(), p = dc(), m = AD(e.children, ST), h = I((t) => wM(t, e.id, p, m));
	if (f !== "vertical" && f !== "horizontal") return null;
	var g, _ = h?.[0];
	return g = _ == null || _.height == null || _.width == null ? 0 : f === "vertical" ? _.height / 2 : _.width / 2, /* @__PURE__ */ S.createElement(bj, {
		xAxisId: t,
		yAxisId: n,
		data: h,
		dataPointFormatter: nN,
		errorBarOffset: g
	}, /* @__PURE__ */ S.createElement(rN, RM({}, e, {
		layout: f,
		needClip: d,
		data: h,
		xAxisId: t,
		yAxisId: n,
		hide: r,
		legendType: i,
		minPointSize: a,
		activeBar: o,
		animationBegin: s,
		animationDuration: c,
		animationEasing: l,
		isAnimationActive: u
	})));
}
function oN(e) {
	var { layout: t, barSettings: { dataKey: n, minPointSize: r, hasCustomShape: i }, pos: a, bandSize: o, xAxis: s, yAxis: c, xAxisTicks: l, yAxisTicks: u, stackedData: d, displayedData: f, offset: p, cells: m, parentViewBox: h, dataStartIndex: g } = e, _ = t === "horizontal" ? c : s, v = d ? _.scale.domain() : null, y = Ns({ numericAxis: _ }), b = _.scale.map(y);
	return f.map((e, f) => {
		var _, x, S, C, w, T;
		if (d) {
			var E = d[f + g];
			if (E == null) return null;
			_ = Ds(E, v);
		} else _ = Ss(e, n), Array.isArray(_) || (_ = [y, _]);
		var D = mM(r, tN)(_[1], f);
		if (t === "horizontal") {
			var O = c.scale.map(_[0]), k = c.scale.map(_[1]);
			if (O == null || k == null) return null;
			x = Ms({
				axis: s,
				ticks: l,
				bandSize: o,
				offset: a.offset,
				entry: e,
				index: f
			}), S = k ?? O ?? void 0, C = a.size;
			var ee = O - k;
			if (w = Ht(ee) ? 0 : ee, T = {
				x,
				y: p.top,
				width: C,
				height: p.height
			}, Math.abs(D) > 0 && Math.abs(w) < Math.abs(D)) {
				var te = Vt(w || D) * (Math.abs(D) - Math.abs(w));
				S -= te, w += te;
			}
		} else {
			var ne = s.scale.map(_[0]), A = s.scale.map(_[1]);
			if (ne == null || A == null) return null;
			if (x = ne, S = Ms({
				axis: c,
				ticks: u,
				bandSize: o,
				offset: a.offset,
				entry: e,
				index: f
			}), C = A - ne, w = a.size, T = {
				x: p.left,
				y: S,
				width: p.width,
				height: w
			}, Math.abs(D) > 0 && Math.abs(C) < Math.abs(D)) {
				var re = Vt(C || D) * (Math.abs(D) - Math.abs(C));
				C += re;
			}
		}
		return x == null || S == null || C == null || w == null || !i && (C === 0 || w === 0) ? null : BM(BM({}, e), {}, {
			stackedBarStart: b,
			x,
			y: S,
			width: C,
			height: w,
			value: d ? _ : _[1],
			payload: e,
			background: T,
			tooltipPosition: {
				x: x + C / 2,
				y: S + w / 2
			},
			parentViewBox: h,
			originalDataIndex: f
		}, m && m[f] && m[f].props);
	}).filter(Boolean);
}
function sN(e) {
	var t = En(e, iN), n = AM(t.stackId), r = dc();
	return /* @__PURE__ */ S.createElement(hO, {
		id: t.id,
		type: "bar"
	}, (e) => /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement(dO, { legendPayload: KM(t) }), /* @__PURE__ */ S.createElement(qM, {
		dataKey: t.dataKey,
		stroke: t.stroke,
		strokeWidth: t.strokeWidth,
		fill: t.fill,
		name: t.name,
		hide: t.hide,
		unit: t.unit,
		tooltipType: t.tooltipType,
		id: e
	}), /* @__PURE__ */ S.createElement(wO, {
		type: "bar",
		id: e,
		data: void 0,
		xAxisId: t.xAxisId,
		yAxisId: t.yAxisId,
		zAxisId: 0,
		dataKey: t.dataKey,
		stackId: n,
		hide: t.hide,
		barSize: t.barSize,
		minPointSize: t.minPointSize,
		maxBarSize: t.maxBarSize,
		isPanorama: r,
		hasCustomShape: t.shape != null
	}), /* @__PURE__ */ S.createElement(Ow, { zIndex: t.zIndex }, /* @__PURE__ */ S.createElement(aN, RM({}, t, { id: e })))));
}
var cN = /* @__PURE__ */ S.memo(sN, fu);
cN.displayName = "Bar";
//#endregion
//#region node_modules/recharts/es6/util/axisPropsAreEqual.js
var lN = ["domain", "range"], uN = ["domain", "range"];
function dN(e, t) {
	if (e == null) return {};
	var n, r, i = fN(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function fN(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function pN(e, t) {
	return e === t ? !0 : Array.isArray(e) && e.length === 2 && Array.isArray(t) && t.length === 2 ? e[0] === t[0] && e[1] === t[1] : !1;
}
function mN(e, t) {
	if (e === t) return !0;
	var { domain: n, range: r } = e, i = dN(e, lN), { domain: a, range: o } = t, s = dN(t, uN);
	return !pN(n, a) || !pN(r, o) ? !1 : fu(i, s);
}
//#endregion
//#region node_modules/recharts/es6/cartesian/XAxis.js
var hN = ["type"], gN = [
	"dangerouslySetInnerHTML",
	"ticks",
	"scale"
], _N = ["id", "scale"];
function vN() {
	return vN = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, vN.apply(null, arguments);
}
function yN(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function bN(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? yN(Object(n), !0).forEach(function(t) {
			xN(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : yN(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function xN(e, t, n) {
	return (t = SN(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function SN(e) {
	var t = CN(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function CN(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function wN(e, t) {
	if (e == null) return {};
	var n, r, i = TN(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function TN(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function EN(e) {
	var t = Vr(), n = (0, S.useRef)(null), r = Kc(), { type: i } = e, a = wN(e, hN), o = Np(r, "xAxis", i), s = (0, S.useMemo)(() => {
		if (o != null) return bN(bN({}, a), {}, { type: o });
	}, [a, o]);
	return (0, S.useLayoutEffect)(() => {
		s != null && (n.current === null ? t(UO(s)) : n.current !== s && t(WO({
			prev: n.current,
			next: s
		})), n.current = s);
	}, [s, t]), (0, S.useLayoutEffect)(() => () => {
		n.current &&= (t(GO(n.current)), null);
	}, [t]), null;
}
var DN = (e) => {
	var { xAxisId: t, className: n } = e, r = I(lc), i = dc(), a = "xAxis", o = I((e) => nS(e, a, t, i)), s = I((e) => Wx(e, t)), c = I((e) => Yx(e, t)), l = I((e) => rb(e, t));
	if (s == null || c == null || l == null) return null;
	var { dangerouslySetInnerHTML: u, ticks: d, scale: f } = e, p = wN(e, gN), { id: m, scale: h } = l, g = wN(l, _N);
	return /* @__PURE__ */ S.createElement(HA, vN({}, p, g, {
		x: c.x,
		y: c.y,
		width: s.width,
		height: s.height,
		className: y(`recharts-${a} ${a}`, n),
		viewBox: r,
		ticks: o,
		axisType: a,
		axisId: t
	}));
}, ON = {
	allowDataOverflow: nb.allowDataOverflow,
	allowDecimals: nb.allowDecimals,
	allowDuplicatedCategory: nb.allowDuplicatedCategory,
	angle: nb.angle,
	axisLine: NA.axisLine,
	height: nb.height,
	hide: !1,
	includeHidden: nb.includeHidden,
	interval: nb.interval,
	label: !1,
	minTickGap: nb.minTickGap,
	mirror: nb.mirror,
	orientation: nb.orientation,
	padding: nb.padding,
	reversed: nb.reversed,
	scale: nb.scale,
	tick: nb.tick,
	tickCount: nb.tickCount,
	tickLine: NA.tickLine,
	tickSize: NA.tickSize,
	type: nb.type,
	niceTicks: nb.niceTicks,
	xAxisId: 0
}, kN = /* @__PURE__ */ S.memo((e) => {
	var t = En(e, ON);
	return /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement(EN, {
		allowDataOverflow: t.allowDataOverflow,
		allowDecimals: t.allowDecimals,
		allowDuplicatedCategory: t.allowDuplicatedCategory,
		angle: t.angle,
		dataKey: t.dataKey,
		domain: t.domain,
		height: t.height,
		hide: t.hide,
		id: t.xAxisId,
		includeHidden: t.includeHidden,
		interval: t.interval,
		minTickGap: t.minTickGap,
		mirror: t.mirror,
		name: t.name,
		orientation: t.orientation,
		padding: t.padding,
		reversed: t.reversed,
		scale: t.scale,
		tick: t.tick,
		tickCount: t.tickCount,
		tickFormatter: t.tickFormatter,
		ticks: t.ticks,
		type: t.type,
		unit: t.unit,
		niceTicks: t.niceTicks
	}), /* @__PURE__ */ S.createElement(DN, t));
}, mN);
kN.displayName = "XAxis";
//#endregion
//#region node_modules/recharts/es6/cartesian/YAxis.js
var AN = ["type"], jN = [
	"dangerouslySetInnerHTML",
	"ticks",
	"scale"
], MN = ["id", "scale"];
function NN() {
	return NN = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, NN.apply(null, arguments);
}
function PN(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function FN(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? PN(Object(n), !0).forEach(function(t) {
			IN(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : PN(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function IN(e, t, n) {
	return (t = LN(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function LN(e) {
	var t = RN(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function RN(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function zN(e, t) {
	if (e == null) return {};
	var n, r, i = BN(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function BN(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function VN(e) {
	var t = Vr(), n = (0, S.useRef)(null), r = Kc(), { type: i } = e, a = zN(e, AN), o = Np(r, "yAxis", i), s = (0, S.useMemo)(() => {
		if (o != null) return FN(FN({}, a), {}, { type: o });
	}, [o, a]);
	return (0, S.useLayoutEffect)(() => {
		s != null && (n.current === null ? t(KO(s)) : n.current !== s && t(qO({
			prev: n.current,
			next: s
		})), n.current = s);
	}, [s, t]), (0, S.useLayoutEffect)(() => () => {
		n.current &&= (t(JO(n.current)), null);
	}, [t]), null;
}
function HN(e) {
	var { yAxisId: t, className: n, width: r, label: i } = e, a = (0, S.useRef)(null), o = (0, S.useRef)(null), s = I(lc), c = dc(), l = Vr(), u = "yAxis", d = I((e) => Zx(e, t)), f = I((e) => Xx(e, t)), p = I((e) => nS(e, u, t, c)), m = I((e) => ob(e, t));
	if ((0, S.useLayoutEffect)(() => {
		if (!(r !== "auto" || !d || KE(i) || /* @__PURE__ */ (0, S.isValidElement)(i) || m == null)) {
			var e = a.current;
			if (e) {
				var n = e.getCalculatedWidth();
				Math.round(d.width) !== Math.round(n) && l(QO({
					id: t,
					width: n
				}));
			}
		}
	}, [
		p,
		d,
		l,
		i,
		t,
		r,
		m
	]), d == null || f == null || m == null) return null;
	var { dangerouslySetInnerHTML: h, ticks: g, scale: _ } = e, v = zN(e, jN), { id: b, scale: x } = m, C = zN(m, MN);
	return /* @__PURE__ */ S.createElement(HA, NN({}, v, C, {
		ref: a,
		labelRef: o,
		x: f.x,
		y: f.y,
		tickTextProps: r === "auto" ? { width: void 0 } : { width: r },
		width: d.width,
		height: d.height,
		className: y(`recharts-${u} ${u}`, n),
		viewBox: s,
		ticks: p,
		axisType: u,
		axisId: t
	}));
}
var UN = {
	allowDataOverflow: ab.allowDataOverflow,
	allowDecimals: ab.allowDecimals,
	allowDuplicatedCategory: ab.allowDuplicatedCategory,
	angle: ab.angle,
	axisLine: NA.axisLine,
	hide: !1,
	includeHidden: ab.includeHidden,
	interval: ab.interval,
	label: !1,
	minTickGap: ab.minTickGap,
	mirror: ab.mirror,
	orientation: ab.orientation,
	padding: ab.padding,
	reversed: ab.reversed,
	scale: ab.scale,
	tick: ab.tick,
	tickCount: ab.tickCount,
	tickLine: NA.tickLine,
	tickSize: NA.tickSize,
	type: ab.type,
	niceTicks: ab.niceTicks,
	width: ab.width,
	yAxisId: 0
}, WN = /* @__PURE__ */ S.memo((e) => {
	var t = En(e, UN);
	return /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement(VN, {
		interval: t.interval,
		id: t.yAxisId,
		scale: t.scale,
		type: t.type,
		domain: t.domain,
		allowDataOverflow: t.allowDataOverflow,
		dataKey: t.dataKey,
		allowDuplicatedCategory: t.allowDuplicatedCategory,
		allowDecimals: t.allowDecimals,
		tickCount: t.tickCount,
		padding: t.padding,
		includeHidden: t.includeHidden,
		reversed: t.reversed,
		ticks: t.ticks,
		width: t.width,
		orientation: t.orientation,
		mirror: t.mirror,
		hide: t.hide,
		unit: t.unit,
		name: t.name,
		angle: t.angle,
		minTickGap: t.minTickGap,
		tick: t.tick,
		tickFormatter: t.tickFormatter,
		niceTicks: t.niceTicks
	}), /* @__PURE__ */ S.createElement(HN, t));
}, mN);
WN.displayName = "YAxis";
var GN = L([
	(e, t) => t,
	U,
	Yp,
	im,
	_C,
	yC,
	QC,
	sc
], uw);
//#endregion
//#region node_modules/recharts/es6/util/getRelativeCoordinate.js
function KN(e) {
	return "getBBox" in e.currentTarget && typeof e.currentTarget.getBBox == "function";
}
function qN(e) {
	var t = e.currentTarget.getBoundingClientRect(), n, r;
	if (KN(e)) {
		var i = e.currentTarget.getBBox();
		n = i.width > 0 ? t.width / i.width : 1, r = i.height > 0 ? t.height / i.height : 1;
	} else {
		var a = e.currentTarget;
		n = a.offsetWidth > 0 ? t.width / a.offsetWidth : 1, r = a.offsetHeight > 0 ? t.height / a.offsetHeight : 1;
	}
	var o = (e, i) => ({
		relativeX: Math.round((e - t.left) / n),
		relativeY: Math.round((i - t.top) / r)
	});
	return "touches" in e ? Array.from(e.touches).map((e) => o(e.clientX, e.clientY)) : o(e.clientX, e.clientY);
}
//#endregion
//#region node_modules/recharts/es6/state/mouseEventsMiddleware.js
var JN = $a("mouseClick"), YN = ss();
YN.startListening({
	actionCreator: JN,
	effect: (e, t) => {
		var n = e.payload, r = GN(t.getState(), qN(n));
		r?.activeIndex != null && t.dispatch(wS({
			activeIndex: r.activeIndex,
			activeDataKey: void 0,
			activeCoordinate: r.activeCoordinate
		}));
	}
});
var XN = $a("mouseMove"), ZN = ss(), QN = null, $N = null, eP = null;
ZN.startListening({
	actionCreator: XN,
	effect: (e, t) => {
		var n = e.payload, { throttleDelay: r, throttledEvents: i } = t.getState().eventSettings, a = i === "all" || i?.includes("mousemove");
		QN !== null && (cancelAnimationFrame(QN), QN = null), $N !== null && (typeof r != "number" || !a) && (clearTimeout($N), $N = null), eP = qN(n);
		var o = () => {
			var e = t.getState(), n = lS(e, e.tooltip.settings.shared);
			if (!eP) {
				QN = null, $N = null;
				return;
			}
			if (n === "axis") {
				var r = GN(e, eP);
				r?.activeIndex == null ? t.dispatch(xS()) : t.dispatch(CS({
					activeIndex: r.activeIndex,
					activeDataKey: void 0,
					activeCoordinate: r.activeCoordinate
				}));
			}
			QN = null, $N = null;
		};
		if (!a) {
			o();
			return;
		}
		r === "raf" ? QN = requestAnimationFrame(o) : typeof r == "number" && $N === null && ($N = setTimeout(o, r));
	}
});
//#endregion
//#region node_modules/recharts/es6/state/reduxDevtoolsJsonStringifyReplacer.js
function tP(e, t) {
	return t instanceof HTMLElement ? `HTMLElement <${t.tagName} class="${t.className}">` : t === window ? "global.window" : e === "children" && typeof t == "object" && t ? "<<CHILDREN>>" : t;
}
//#endregion
//#region node_modules/recharts/es6/state/rootPropsSlice.js
var nP = {
	accessibilityLayer: !0,
	barCategoryGap: "10%",
	barGap: 4,
	barSize: void 0,
	className: void 0,
	maxBarSize: void 0,
	stackOffset: "none",
	syncId: void 0,
	syncMethod: "index",
	baseValue: void 0,
	reverseStackOrder: !1
}, rP = xo({
	name: "rootProps",
	initialState: nP,
	reducers: { updateOptions: (e, t) => {
		e.accessibilityLayer = t.payload.accessibilityLayer, e.barCategoryGap = t.payload.barCategoryGap, e.barGap = t.payload.barGap ?? nP.barGap, e.barSize = t.payload.barSize, e.maxBarSize = t.payload.maxBarSize, e.stackOffset = t.payload.stackOffset, e.syncId = t.payload.syncId, e.syncMethod = t.payload.syncMethod, e.className = t.payload.className, e.baseValue = t.payload.baseValue, e.reverseStackOrder = t.payload.reverseStackOrder;
	} }
}), iP = rP.reducer, { updateOptions: aP } = rP.actions, oP = xo({
	name: "polarOptions",
	initialState: null,
	reducers: { updatePolarOptions: (e, t) => e === null ? t.payload : (e.startAngle = t.payload.startAngle, e.endAngle = t.payload.endAngle, e.cx = t.payload.cx, e.cy = t.payload.cy, e.innerRadius = t.payload.innerRadius, e.outerRadius = t.payload.outerRadius, e) }
}), { updatePolarOptions: sP } = oP.actions, cP = oP.reducer, lP = $a("keyDown"), uP = $a("focus"), dP = $a("blur"), fP = ss(), pP = null, mP = null, hP = null;
fP.startListening({
	actionCreator: lP,
	effect: (e, t) => {
		hP = e.payload, pP !== null && (cancelAnimationFrame(pP), pP = null);
		var { throttleDelay: n, throttledEvents: r } = t.getState().eventSettings, i = r === "all" || r.includes("keydown");
		mP !== null && (typeof n != "number" || !i) && (clearTimeout(mP), mP = null);
		var a = () => {
			try {
				var e = t.getState();
				if (e.rootProps.accessibilityLayer === !1) return;
				var { keyboardInteraction: n } = e.tooltip, r = hP;
				if (r !== "ArrowRight" && r !== "ArrowLeft" && r !== "Enter") return;
				var i = zS(n, aC(e), Ib(e), mC(e)), a = i == null ? -1 : Number(i);
				if (!Number.isFinite(a) || a < 0) return;
				var o = yC(e);
				if (r === "Enter") {
					var s = rw(e, "axis", "hover", String(n.index));
					t.dispatch(ES({
						active: !n.active,
						activeIndex: n.index,
						activeCoordinate: s
					}));
					return;
				}
				var c = aS(e) === "left-to-right" ? 1 : -1, l = a + (r === "ArrowRight" ? 1 : -1) * c;
				if (o == null || l >= o.length || l < 0) return;
				var u = rw(e, "axis", "hover", String(l));
				t.dispatch(ES({
					active: !0,
					activeIndex: l.toString(),
					activeCoordinate: u
				}));
			} finally {
				pP = null, mP = null;
			}
		};
		if (!i) {
			a();
			return;
		}
		n === "raf" ? pP = requestAnimationFrame(a) : typeof n == "number" && mP === null && (a(), hP = null, mP = setTimeout(() => {
			hP ? a() : (mP = null, pP = null);
		}, n));
	}
}), fP.startListening({
	actionCreator: uP,
	effect: (e, t) => {
		var n = t.getState();
		if (n.rootProps.accessibilityLayer !== !1) {
			var { keyboardInteraction: r } = n.tooltip;
			if (!r.active && r.index == null) {
				var i = "0", a = rw(n, "axis", "hover", String(i));
				t.dispatch(ES({
					active: !0,
					activeIndex: i,
					activeCoordinate: a
				}));
			}
		}
	}
}), fP.startListening({
	actionCreator: dP,
	effect: (e, t) => {
		var n = t.getState();
		if (n.rootProps.accessibilityLayer !== !1) {
			var { keyboardInteraction: r } = n.tooltip;
			r.active && t.dispatch(ES({
				active: !1,
				activeIndex: r.index,
				activeCoordinate: r.coordinate
			}));
		}
	}
});
//#endregion
//#region node_modules/recharts/es6/util/createEventProxy.js
function gP(e) {
	e.persist();
	var { currentTarget: t } = e;
	return new Proxy(e, { get: (e, n) => {
		if (n === "currentTarget") return t;
		var r = Reflect.get(e, n);
		return typeof r == "function" ? r.bind(e) : r;
	} });
}
//#endregion
//#region node_modules/recharts/es6/state/externalEventsMiddleware.js
var _P = $a("externalEvent"), vP = ss(), yP = /* @__PURE__ */ new Map(), bP = /* @__PURE__ */ new Map(), xP = /* @__PURE__ */ new Map();
vP.startListening({
	actionCreator: _P,
	effect: (e, t) => {
		var { handler: n, reactEvent: r } = e.payload;
		if (n != null) {
			var i = r.type, a = gP(r);
			xP.set(i, {
				handler: n,
				reactEvent: a
			});
			var o = yP.get(i);
			o !== void 0 && (cancelAnimationFrame(o), yP.delete(i));
			var { throttleDelay: s, throttledEvents: c } = t.getState().eventSettings, l = c, u = l === "all" || l?.includes(i), d = bP.get(i);
			d !== void 0 && (typeof s != "number" || !u) && (clearTimeout(d), bP.delete(i));
			var f = () => {
				var e = xP.get(i);
				try {
					if (!e) return;
					var { handler: n, reactEvent: r } = e, a = t.getState(), o = {
						activeCoordinate: kC(a),
						activeDataKey: EC(a),
						activeIndex: wC(a),
						activeLabel: TC(a),
						activeTooltipIndex: wC(a),
						isTooltipActive: AC(a)
					};
					n && n(o, r);
				} finally {
					yP.delete(i), bP.delete(i), xP.delete(i);
				}
			};
			if (!u) {
				f();
				return;
			}
			if (s === "raf") {
				var p = requestAnimationFrame(f);
				yP.set(i, p);
			} else if (typeof s == "number") {
				if (!bP.has(i)) {
					f();
					var m = setTimeout(f, s);
					bP.set(i, m);
				}
			} else f();
		}
	}
});
var SP = L([
	L([US], (e) => e.tooltipItemPayloads),
	(e, t) => t,
	(e, t, n) => n
], (e, t, n) => {
	if (t != null) {
		var r = e.find((e) => e.settings.graphicalItemId === n);
		if (r != null) {
			var { getPosition: i } = r;
			if (i != null) return i(t);
		}
	}
}), CP = $a("touchMove"), wP = ss(), TP = null, EP = null, DP = null, OP = null;
wP.startListening({
	actionCreator: CP,
	effect: (e, t) => {
		var n = e.payload;
		if (!(n.touches == null || n.touches.length === 0)) {
			OP = gP(n);
			var { throttleDelay: r, throttledEvents: i } = t.getState().eventSettings, a = i === "all" || i.includes("touchmove");
			TP !== null && (cancelAnimationFrame(TP), TP = null), EP !== null && (typeof r != "number" || !a) && (clearTimeout(EP), EP = null), DP = Array.from(n.touches).map((e) => qN({
				clientX: e.clientX,
				clientY: e.clientY,
				currentTarget: n.currentTarget
			}));
			var o = () => {
				if (OP != null) {
					var e = t.getState(), n = lS(e, e.tooltip.settings.shared);
					if (n === "axis") {
						var r = DP?.[0];
						if (r == null) {
							TP = null, EP = null;
							return;
						}
						var i = GN(e, r);
						i?.activeIndex != null && t.dispatch(CS({
							activeIndex: i.activeIndex,
							activeDataKey: void 0,
							activeCoordinate: i.activeCoordinate
						}));
					} else if (n === "item") {
						var a = OP.touches[0];
						if (document.elementFromPoint == null || a == null) return;
						var o = document.elementFromPoint(a.clientX, a.clientY);
						if (!o || !o.getAttribute) return;
						var s = o.getAttribute(Xs), c = o.getAttribute("data-recharts-item-id") ?? void 0, l = rC(e).find((e) => e.id === c);
						if (s == null || l == null || c == null) return;
						var { dataKey: u } = l, d = SP(e, s, c);
						t.dispatch(yS({
							activeDataKey: u,
							activeIndex: s,
							activeCoordinate: d,
							activeGraphicalItemId: c
						}));
					}
					TP = null, EP = null;
				}
			};
			if (!a) {
				o();
				return;
			}
			r === "raf" ? TP = requestAnimationFrame(o) : typeof r == "number" && EP === null && (o(), OP = null, EP = setTimeout(() => {
				OP ? o() : (EP = null, TP = null);
			}, r));
		}
	}
});
//#endregion
//#region node_modules/recharts/es6/state/eventSettingsSlice.js
var kP = {
	throttleDelay: "raf",
	throttledEvents: [
		"mousemove",
		"touchmove",
		"pointermove",
		"scroll",
		"wheel"
	]
}, AP = xo({
	name: "eventSettings",
	initialState: kP,
	reducers: { setEventSettings: (e, t) => {
		t.payload.throttleDelay != null && (e.throttleDelay = t.payload.throttleDelay), t.payload.throttledEvents != null && (e.throttledEvents = J(t.payload.throttledEvents));
	} }
}), { setEventSettings: jP } = AP.actions, MP = AP.reducer, NP = Ei({
	brush: Ek,
	cartesianAxis: $O,
	chartData: $w,
	errorBars: hj,
	eventSettings: MP,
	graphicalItems: CO,
	layout: ms,
	legend: ql,
	options: Kw,
	polarAxis: SD,
	polarOptions: cP,
	referenceElements: Rk,
	renderedTicks: CA,
	rootProps: iP,
	tooltip: DS,
	zIndex: Ew
}), PP = function(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "Chart";
	return fo({
		reducer: NP,
		preloadedState: e,
		middleware: (e) => e({
			serializableCheck: !1,
			immutableCheck: ![
				"commonjs",
				"es6",
				"production"
			].includes("es6")
		}).concat([
			YN.middleware,
			ZN.middleware,
			fP.middleware,
			vP.middleware,
			wP.middleware
		]),
		enhancers: (e) => {
			var t = e;
			return typeof e == "function" && (t = e()), t.concat(lo({ type: "raf" }));
		},
		devTools: ku.devToolsEnabled && {
			serialize: { replacer: tP },
			name: `recharts-${t}`
		}
	});
};
//#endregion
//#region node_modules/recharts/es6/state/RechartsStoreProvider.js
function FP(e) {
	var { preloadedState: t, children: n, reduxStoreName: r } = e, i = dc(), a = (0, S.useRef)(null);
	if (i) return n;
	a.current ??= PP(t, r);
	var o = Rr;
	return /* @__PURE__ */ S.createElement(lu, {
		context: o,
		store: a.current
	}, n);
}
//#endregion
//#region node_modules/recharts/es6/state/ReportMainChartProps.js
function IP(e) {
	var { layout: t, margin: n } = e, r = Vr(), i = dc();
	return (0, S.useEffect)(() => {
		i || (r(ds(t)), r(us(n)));
	}, [
		r,
		i,
		t,
		n
	]), null;
}
var LP = /* @__PURE__ */ (0, S.memo)(IP, fu);
//#endregion
//#region node_modules/recharts/es6/state/ReportChartProps.js
function RP(e) {
	var t = Vr();
	return (0, S.useEffect)(() => {
		t(aP(e));
	}, [t, e]), null;
}
var zP = /* @__PURE__ */ (0, S.memo)((e) => {
	var t = Vr();
	return (0, S.useEffect)(() => {
		t(jP(e));
	}, [t, e]), null;
}, fu);
//#endregion
//#region node_modules/recharts/es6/zIndex/ZIndexPortal.js
function BP(e) {
	var { zIndex: t, isPanorama: n } = e, r = (0, S.useRef)(null), i = Vr();
	return (0, S.useLayoutEffect)(() => (r.current && i(ww({
		zIndex: t,
		element: r.current,
		isPanorama: n
	})), () => {
		i(Tw({
			zIndex: t,
			isPanorama: n
		}));
	}), [
		i,
		t,
		n
	]), /* @__PURE__ */ S.createElement("g", {
		tabIndex: -1,
		ref: r,
		className: `recharts-zIndex-layer_${t}`
	});
}
function VP(e) {
	var { children: t, isPanorama: n } = e, r = I(fw);
	if (!r || r.length === 0) return t;
	var i = r.filter((e) => e < 0), a = r.filter((e) => e > 0);
	return /* @__PURE__ */ S.createElement(S.Fragment, null, i.map((e) => /* @__PURE__ */ S.createElement(BP, {
		key: e,
		zIndex: e,
		isPanorama: n
	})), t, a.map((e) => /* @__PURE__ */ S.createElement(BP, {
		key: e,
		zIndex: e,
		isPanorama: n
	})));
}
//#endregion
//#region node_modules/recharts/es6/container/RootSurface.js
var HP = ["children"];
function UP(e, t) {
	if (e == null) return {};
	var n, r, i = WP(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function WP(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function GP() {
	return GP = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, GP.apply(null, arguments);
}
var KP = {
	width: "100%",
	height: "100%",
	display: "block"
}, qP = /* @__PURE__ */ (0, S.forwardRef)((e, t) => {
	var n = Uc(), r = Wc(), i = zu();
	if (!gs(n) || !gs(r)) return null;
	var { children: a, otherAttributes: o, title: s, desc: c } = e, l, u;
	return o != null && (l = typeof o.tabIndex == "number" ? o.tabIndex : i ? 0 : void 0, u = typeof o.role == "string" ? o.role : i ? "application" : void 0), /* @__PURE__ */ S.createElement(re, GP({}, o, {
		title: s,
		desc: c,
		role: u,
		tabIndex: l,
		width: n,
		height: r,
		style: KP,
		ref: t
	}), a);
}), JP = (e) => {
	var { children: t } = e, n = I(pc);
	if (!n) return null;
	var { width: r, height: i, y: a, x: o } = n;
	return /* @__PURE__ */ S.createElement(re, {
		width: r,
		height: i,
		x: o,
		y: a
	}, t);
}, YP = /* @__PURE__ */ (0, S.forwardRef)((e, t) => {
	var { children: n } = e, r = UP(e, HP);
	return dc() ? /* @__PURE__ */ S.createElement(JP, null, /* @__PURE__ */ S.createElement(VP, { isPanorama: !0 }, n)) : /* @__PURE__ */ S.createElement(qP, GP({ ref: t }, r), /* @__PURE__ */ S.createElement(VP, { isPanorama: !1 }, n));
});
//#endregion
//#region node_modules/recharts/es6/util/useReportScale.js
function XP() {
	var e = Vr(), [t, n] = (0, S.useState)(null), r = I(Ks);
	return (0, S.useEffect)(() => {
		if (t != null) {
			var n = t.getBoundingClientRect().width / t.offsetWidth;
			H(n) && n !== r && e(ps(n));
		}
	}, [
		t,
		e,
		r
	]), n;
}
//#endregion
//#region node_modules/recharts/es6/chart/RechartsWrapper.js
function ZP(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function QP(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? ZP(Object(n), !0).forEach(function(t) {
			$P(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ZP(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function $P(e, t, n) {
	return (t = eF(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function eF(e) {
	var t = tF(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function tF(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function nF() {
	return nF = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, nF.apply(null, arguments);
}
var rF = () => (uT(), null);
function iF(e) {
	if (typeof e == "number") return e;
	if (typeof e == "string") {
		var t = parseFloat(e);
		if (!Number.isNaN(t)) return t;
	}
	return 0;
}
var aF = /* @__PURE__ */ (0, S.forwardRef)((e, t) => {
	var n = (0, S.useRef)(null), [r, i] = (0, S.useState)({
		containerWidth: iF(e.style?.width),
		containerHeight: iF(e.style?.height)
	}), a = (0, S.useCallback)((e, t) => {
		i((n) => {
			var r = Math.round(e), i = Math.round(t);
			return n.containerWidth === r && n.containerHeight === i ? n : {
				containerWidth: r,
				containerHeight: i
			};
		});
	}, []), o = (0, S.useCallback)((e) => {
		if (typeof t == "function" && t(e), e != null && typeof ResizeObserver < "u") {
			var { width: r, height: i } = e.getBoundingClientRect();
			a(r, i);
			var o = new ResizeObserver((e) => {
				var t = e[0];
				if (t != null) {
					var { width: n, height: r } = t.contentRect;
					a(n, r);
				}
			});
			o.observe(e), n.current = o;
		}
	}, [t, a]);
	return (0, S.useEffect)(() => () => {
		n.current?.disconnect();
	}, [a]), /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement(Yc, {
		width: r.containerWidth,
		height: r.containerHeight
	}), /* @__PURE__ */ S.createElement("div", nF({ ref: o }, e)));
}), oF = /* @__PURE__ */ (0, S.forwardRef)((e, t) => {
	var { width: n, height: r } = e, [i, a] = (0, S.useState)({
		containerWidth: iF(n),
		containerHeight: iF(r)
	}), o = (0, S.useCallback)((e, t) => {
		a((n) => {
			var r = Math.round(e), i = Math.round(t);
			return n.containerWidth === r && n.containerHeight === i ? n : {
				containerWidth: r,
				containerHeight: i
			};
		});
	}, []), s = (0, S.useCallback)((e) => {
		if (typeof t == "function" && t(e), e != null) {
			var { width: n, height: r } = e.getBoundingClientRect();
			o(n, r);
		}
	}, [t, o]);
	return /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement(Yc, {
		width: i.containerWidth,
		height: i.containerHeight
	}), /* @__PURE__ */ S.createElement("div", nF({ ref: s }, e)));
}), sF = /* @__PURE__ */ (0, S.forwardRef)((e, t) => {
	var { width: n, height: r } = e;
	return /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement(Yc, {
		width: n,
		height: r
	}), /* @__PURE__ */ S.createElement("div", nF({ ref: t }, e)));
}), cF = /* @__PURE__ */ (0, S.forwardRef)((e, t) => {
	var { width: n, height: r } = e;
	return typeof n == "string" || typeof r == "string" ? /* @__PURE__ */ S.createElement(oF, nF({}, e, { ref: t })) : typeof n == "number" && typeof r == "number" ? /* @__PURE__ */ S.createElement(sF, nF({}, e, {
		width: n,
		height: r,
		ref: t
	})) : /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement(Yc, {
		width: n,
		height: r
	}), /* @__PURE__ */ S.createElement("div", nF({ ref: t }, e)));
});
function lF(e) {
	return e ? aF : cF;
}
var uF = /* @__PURE__ */ (0, S.forwardRef)((e, t) => {
	var { children: n, className: r, height: i, onClick: a, onContextMenu: o, onDoubleClick: s, onMouseDown: c, onMouseEnter: l, onMouseLeave: u, onMouseMove: d, onMouseUp: f, onTouchEnd: p, onTouchMove: m, onTouchStart: h, style: g, width: _, responsive: v, dispatchTouchEvents: b = !0 } = e, x = (0, S.useRef)(null), C = Vr(), [w, T] = (0, S.useState)(null), [E, D] = (0, S.useState)(null), O = XP(), k = Ic(), ee = k?.width > 0 ? k.width : _, te = k?.height > 0 ? k.height : i, ne = (0, S.useCallback)((e) => {
		O(e), typeof t == "function" && t(e), T(e), D(e), e != null && (x.current = e);
	}, [
		O,
		t,
		T,
		D
	]), A = (0, S.useCallback)((e) => {
		C(JN(e)), C(_P({
			handler: a,
			reactEvent: e
		}));
	}, [C, a]), re = (0, S.useCallback)((e) => {
		C(XN(e)), C(_P({
			handler: l,
			reactEvent: e
		}));
	}, [C, l]), ie = (0, S.useCallback)((e) => {
		C(xS()), C(_P({
			handler: u,
			reactEvent: e
		}));
	}, [C, u]), j = (0, S.useCallback)((e) => {
		C(XN(e)), C(_P({
			handler: d,
			reactEvent: e
		}));
	}, [C, d]), M = (0, S.useCallback)(() => {
		C(uP());
	}, [C]), ae = (0, S.useCallback)(() => {
		C(dP());
	}, [C]), oe = (0, S.useCallback)((e) => {
		C(lP(e.key));
	}, [C]), N = (0, S.useCallback)((e) => {
		C(_P({
			handler: o,
			reactEvent: e
		}));
	}, [C, o]), ce = (0, S.useCallback)((e) => {
		C(_P({
			handler: s,
			reactEvent: e
		}));
	}, [C, s]), P = (0, S.useCallback)((e) => {
		C(_P({
			handler: c,
			reactEvent: e
		}));
	}, [C, c]), le = (0, S.useCallback)((e) => {
		C(_P({
			handler: f,
			reactEvent: e
		}));
	}, [C, f]), ue = (0, S.useCallback)((e) => {
		C(_P({
			handler: h,
			reactEvent: e
		}));
	}, [C, h]), de = (0, S.useCallback)((e) => {
		b && C(CP(e)), C(_P({
			handler: m,
			reactEvent: e
		}));
	}, [
		C,
		b,
		m
	]), fe = (0, S.useCallback)((e) => {
		C(_P({
			handler: p,
			reactEvent: e
		}));
	}, [C, p]), pe = lF(v);
	return /* @__PURE__ */ S.createElement(Rw.Provider, { value: w }, /* @__PURE__ */ S.createElement(se.Provider, { value: E }, /* @__PURE__ */ S.createElement(pe, {
		width: ee ?? g?.width,
		height: te ?? g?.height,
		className: y("recharts-wrapper", r),
		style: QP({
			position: "relative",
			cursor: "default",
			width: ee,
			height: te
		}, g),
		onClick: A,
		onContextMenu: N,
		onDoubleClick: ce,
		onFocus: M,
		onBlur: ae,
		onKeyDown: oe,
		onMouseDown: P,
		onMouseEnter: re,
		onMouseLeave: ie,
		onMouseMove: j,
		onMouseUp: le,
		onTouchEnd: fe,
		onTouchMove: de,
		onTouchStart: ue,
		ref: ne
	}, /* @__PURE__ */ S.createElement(rF, null), n)));
}), dF = [
	"width",
	"height",
	"responsive",
	"children",
	"className",
	"style",
	"compact",
	"title",
	"desc"
];
function fF(e, t) {
	if (e == null) return {};
	var n, r, i = pF(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function pF(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var mF = /* @__PURE__ */ (0, S.forwardRef)((e, t) => {
	var { width: n, height: r, responsive: i, children: a, className: o, style: s, compact: c, title: l, desc: u } = e, d = E(fF(e, dF));
	return c ? /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement(Yc, {
		width: n,
		height: r
	}), /* @__PURE__ */ S.createElement(YP, {
		otherAttributes: d,
		title: l,
		desc: u
	}, a)) : /* @__PURE__ */ S.createElement(uF, {
		className: o,
		style: s,
		width: n,
		height: r,
		responsive: i ?? !1,
		onClick: e.onClick,
		onMouseLeave: e.onMouseLeave,
		onMouseEnter: e.onMouseEnter,
		onMouseMove: e.onMouseMove,
		onMouseDown: e.onMouseDown,
		onMouseUp: e.onMouseUp,
		onContextMenu: e.onContextMenu,
		onDoubleClick: e.onDoubleClick,
		onTouchStart: e.onTouchStart,
		onTouchMove: e.onTouchMove,
		onTouchEnd: e.onTouchEnd
	}, /* @__PURE__ */ S.createElement(YP, {
		otherAttributes: d,
		title: l,
		desc: u,
		ref: t
	}, /* @__PURE__ */ S.createElement(Bk, null, a)));
});
//#endregion
//#region node_modules/recharts/es6/chart/CartesianChart.js
function hF() {
	return hF = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, hF.apply(null, arguments);
}
function gF(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function _F(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? gF(Object(n), !0).forEach(function(t) {
			vF(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : gF(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function vF(e, t, n) {
	return (t = yF(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function yF(e) {
	var t = bF(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function bF(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var xF = _F({
	accessibilityLayer: !0,
	barCategoryGap: "10%",
	barGap: 4,
	layout: "horizontal",
	margin: {
		top: 5,
		right: 5,
		bottom: 5,
		left: 5
	},
	responsive: !1,
	reverseStackOrder: !1,
	stackOffset: "none",
	syncMethod: "index"
}, kP), SF = /* @__PURE__ */ (0, S.forwardRef)(function(e, t) {
	var n = En(e.categoricalChartProps, xF), { chartName: r, defaultTooltipEventType: i, validateTooltipEventTypes: a, tooltipPayloadSearcher: o, categoricalChartProps: s } = e, c = {
		chartName: r,
		defaultTooltipEventType: i,
		validateTooltipEventTypes: a,
		tooltipPayloadSearcher: o,
		eventEmitter: void 0
	};
	return /* @__PURE__ */ S.createElement(FP, {
		preloadedState: { options: c },
		reduxStoreName: s.id ?? r
	}, /* @__PURE__ */ S.createElement(Sk, { chartData: s.data }), /* @__PURE__ */ S.createElement(LP, {
		layout: n.layout,
		margin: n.margin
	}), /* @__PURE__ */ S.createElement(zP, {
		throttleDelay: n.throttleDelay,
		throttledEvents: n.throttledEvents
	}), /* @__PURE__ */ S.createElement(RP, {
		baseValue: n.baseValue,
		accessibilityLayer: n.accessibilityLayer,
		barCategoryGap: n.barCategoryGap,
		maxBarSize: n.maxBarSize,
		stackOffset: n.stackOffset,
		barGap: n.barGap,
		barSize: n.barSize,
		syncId: n.syncId,
		syncMethod: n.syncMethod,
		className: n.className,
		reverseStackOrder: n.reverseStackOrder
	}), /* @__PURE__ */ S.createElement(mF, hF({}, n, { ref: t })));
}), CF = ["axis"], wF = /* @__PURE__ */ (0, S.forwardRef)((e, t) => /* @__PURE__ */ S.createElement(SF, {
	chartName: "LineChart",
	defaultTooltipEventType: "axis",
	validateTooltipEventTypes: CF,
	tooltipPayloadSearcher: Ww,
	categoricalChartProps: e,
	ref: t
})), TF = ["axis", "item"], EF = /* @__PURE__ */ (0, S.forwardRef)((e, t) => /* @__PURE__ */ S.createElement(SF, {
	chartName: "BarChart",
	defaultTooltipEventType: "axis",
	validateTooltipEventTypes: TF,
	tooltipPayloadSearcher: Ww,
	categoricalChartProps: e,
	ref: t
})), DF = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element");
	function n(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.jsx = n, e.jsxs = n;
})), OF = /* @__PURE__ */ o(((e, t) => {
	t.exports = DF();
})), kF = _(), $ = OF(), AF = /* @__PURE__ */ new WeakMap(), jF = (e, t, n = 2) => `${t.signed && e > 0 ? "+" : ""}${Number(e).toFixed(n)}`;
function MF({ active: e, payload: t, label: n, model: r, dismissed: i, onDismiss: a }) {
	if (!e || !t?.length) return null;
	let o = t[0]?.payload, s = r.kind === "bars" ? `${r.type}|${o.label}|${o.detail}|${o.value}` : `${r.type}|${n}`;
	if (i === s) return null;
	let c = r.touch ? /* @__PURE__ */ (0, $.jsx)("button", {
		className: "chart-tooltip-close",
		"aria-label": "Close chart details",
		onClick: (e) => {
			e.stopPropagation(), a(s);
		},
		children: "×"
	}) : null;
	if (r.kind === "bars") return /* @__PURE__ */ (0, $.jsxs)("div", {
		className: `rich-tooltip ${r.touch ? "phone-tooltip" : ""}`,
		role: "status",
		children: [
			c,
			/* @__PURE__ */ (0, $.jsx)("b", { children: o.fullLabel || o.label }),
			/* @__PURE__ */ (0, $.jsx)("p", { children: o.detail }),
			/* @__PURE__ */ (0, $.jsxs)("strong", { children: [
				jF(o.value, r),
				" ",
				r.unit
			] }),
			o.extra && /* @__PURE__ */ (0, $.jsx)("p", { children: o.extra })
		]
	});
	let l = t.filter((e) => e.value !== null && e.value !== void 0);
	return r.everyone && l.sort((e, t) => Number(t.value) - Number(e.value)), /* @__PURE__ */ (0, $.jsxs)("div", {
		className: `rich-tooltip line-readout ${r.touch ? "phone-tooltip" : ""}`,
		role: "status",
		children: [
			c,
			/* @__PURE__ */ (0, $.jsxs)("b", { children: ["Week ", n] }),
			l.map((e) => /* @__PURE__ */ (0, $.jsxs)("div", {
				className: "tooltip-row",
				children: [
					/* @__PURE__ */ (0, $.jsx)("i", { style: { background: e.color } }),
					/* @__PURE__ */ (0, $.jsx)("span", { children: e.name }),
					/* @__PURE__ */ (0, $.jsx)("strong", { children: Number(e.value).toFixed(2) })
				]
			}, e.dataKey)),
			/* @__PURE__ */ (0, $.jsx)("small", { children: r.axisLabel })
		]
	});
}
function NF({ model: e }) {
	let [t, n] = (0, S.useState)(null), { kind: r, series: i = [], rows: a = [], height: o = 400 } = e;
	if (e.empty) return /* @__PURE__ */ (0, $.jsx)("div", {
		className: "chart-empty",
		children: e.empty
	});
	let s = {
		tick: {
			fill: "#637165",
			fontSize: 12
		},
		tickLine: !1,
		axisLine: { stroke: "#cbd6c8" }
	}, c = /* @__PURE__ */ (0, $.jsx)(xT, {
		content: /* @__PURE__ */ (0, $.jsx)(MF, {
			model: e,
			dismissed: t,
			onDismiss: n
		}),
		trigger: e.touch ? "click" : "hover",
		cursor: r === "bars" ? { fill: "#edf3e5" } : {
			stroke: "#94a788",
			strokeDasharray: "4 4"
		},
		isAnimationActive: !1,
		allowEscapeViewBox: {
			x: !1,
			y: !0
		},
		wrapperStyle: {
			zIndex: 20,
			pointerEvents: e.touch ? "auto" : "none"
		}
	}), l = Math.min(0, ...a.map((e) => Number(e.value) || 0)), u = Math.max(0, ...a.map((e) => Number(e.value) || 0)), d = (u - l) / 5 || 1, f = 10 ** Math.floor(Math.log10(d)), p = f * [
		1,
		2,
		5,
		10
	].find((e) => e >= d / f), m = [Math.floor(l / p) * p, Math.ceil(u / p) * p || p], h = Array.from({ length: Math.round((m[1] - m[0]) / p) + 1 }, (e, t) => m[0] + t * p), g = r === "line" ? /* @__PURE__ */ (0, $.jsxs)(wF, {
		data: a,
		margin: {
			top: 25,
			right: e.compact ? 18 : 28,
			bottom: 18,
			left: 0
		},
		onClick: () => n(null),
		accessibilityLayer: !0,
		children: [
			/* @__PURE__ */ (0, $.jsx)(uj, {
				stroke: "#e5ebdf",
				vertical: !1
			}),
			/* @__PURE__ */ (0, $.jsx)(kN, {
				...s,
				dataKey: "week",
				tickFormatter: (e) => `Week ${e}`,
				minTickGap: e.compact ? 25 : 16
			}),
			/* @__PURE__ */ (0, $.jsx)(WN, {
				...s,
				width: e.compact ? 40 : 60,
				domain: e.domain || ["auto", "auto"],
				tickFormatter: (t) => Number(t).toLocaleString("en-CA", { maximumFractionDigits: +(e.unit === "wins") })
			}),
			c,
			i.map((t) => /* @__PURE__ */ (0, $.jsx)(oM, {
				dataKey: t.key,
				name: t.name,
				type: "linear",
				stroke: t.color,
				strokeDasharray: t.baseline ? "5 5" : void 0,
				strokeOpacity: e.highlight && e.highlight !== t.key ? .18 : 1,
				strokeWidth: e.highlight === t.key ? 4 : t.baseline ? 2 : e.everyone ? 2.3 : 3.5,
				dot: t.baseline || e.everyone ? !1 : {
					r: 4,
					fill: t.color,
					stroke: "#fff",
					strokeWidth: 2
				},
				activeDot: {
					r: 6,
					stroke: "#fff",
					strokeWidth: 2
				},
				isAnimationActive: !1
			}, t.key))
		]
	}) : /* @__PURE__ */ (0, $.jsxs)(EF, {
		data: a,
		layout: "vertical",
		margin: {
			top: 12,
			right: e.compact ? 52 : 65,
			bottom: 34,
			left: 0
		},
		barSize: e.compact ? 32 : 28,
		onClick: () => n(null),
		accessibilityLayer: !0,
		children: [
			/* @__PURE__ */ (0, $.jsx)(uj, {
				stroke: "#e4eadf",
				horizontal: !1
			}),
			/* @__PURE__ */ (0, $.jsx)(kN, {
				...s,
				type: "number",
				domain: m,
				ticks: h,
				tickFormatter: (e) => Number(e).toFixed(Math.abs(e) < 5 && e % 1 ? 1 : 0),
				label: {
					value: e.axisLabel,
					position: "insideBottom",
					offset: -22,
					fill: "#73806e",
					fontSize: 10
				}
			}),
			/* @__PURE__ */ (0, $.jsx)(WN, {
				...s,
				type: "category",
				dataKey: "label",
				width: e.compact ? e.type === "bench" ? 125 : 110 : 170,
				interval: 0,
				tick: (t) => /* @__PURE__ */ (0, $.jsxs)("g", {
					transform: `translate(${t.x},${t.y})`,
					children: [/* @__PURE__ */ (0, $.jsx)("text", {
						x: -10,
						y: -3,
						textAnchor: "end",
						fill: "#283a2d",
						fontSize: e.compact ? 11 : 12,
						children: t.payload.value.length > (e.compact ? 22 : 32) ? t.payload.value.slice(0, e.compact ? 21 : 31) + "…" : t.payload.value
					}), /* @__PURE__ */ (0, $.jsx)("text", {
						x: -10,
						y: 13,
						textAnchor: "end",
						fill: "#73806e",
						fontSize: 9,
						children: a[t.index]?.shortDetail || ""
					})]
				})
			}),
			/* @__PURE__ */ (0, $.jsx)(rA, {
				x: 0,
				stroke: "#8e9f85"
			}),
			c,
			/* @__PURE__ */ (0, $.jsxs)(cN, {
				dataKey: "value",
				name: e.axisLabel,
				radius: 4,
				isAnimationActive: !1,
				activeBar: {
					stroke: "#193e32",
					strokeWidth: 2,
					fillOpacity: 1
				},
				children: [a.map((e, t) => /* @__PURE__ */ (0, $.jsx)(ST, { fill: e.color || "#639873" }, t)), /* @__PURE__ */ (0, $.jsx)(pD, {
					dataKey: "value",
					position: "right",
					formatter: (t) => jF(t, e, 1),
					fill: "#2b3d30",
					fontSize: 12
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, $.jsx)("div", {
		className: "library-chart",
		style: {
			height: o,
			position: "relative"
		},
		children: /* @__PURE__ */ (0, $.jsx)(Rc, {
			width: "100%",
			height: "100%",
			initialDimension: {
				width: 800,
				height: o
			},
			minWidth: 250,
			debounce: 60,
			children: g
		})
	});
}
function PF(e, t) {
	let n = AF.get(e);
	n || (n = (0, kF.createRoot)(e), AF.set(e, n)), n.render(/* @__PURE__ */ (0, $.jsx)(NF, { model: t }, `${t.type}|${t.mode}|${t.primary}|${t.comparison}|${t.touch}`));
}
//#endregion
export { PF as renderChart };
