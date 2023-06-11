var C = { exports: {} }, _ = {}, N = { exports: {} }, c = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var x = Symbol.for("react.element"), V = Symbol.for("react.portal"), Y = Symbol.for("react.fragment"), F = Symbol.for("react.strict_mode"), U = Symbol.for("react.profiler"), q = Symbol.for("react.provider"), W = Symbol.for("react.context"), z = Symbol.for("react.forward_ref"), H = Symbol.for("react.suspense"), J = Symbol.for("react.memo"), G = Symbol.for("react.lazy"), $ = Symbol.iterator;
function K(t) {
  return t === null || typeof t != "object" ? null : (t = $ && t[$] || t["@@iterator"], typeof t == "function" ? t : null);
}
var B = { isMounted: function() {
  return !1;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, T = Object.assign, M = {};
function h(t, e, d) {
  this.props = t, this.context = e, this.refs = M, this.updater = d || B;
}
h.prototype.isReactComponent = {};
h.prototype.setState = function(t, e) {
  if (typeof t != "object" && typeof t != "function" && t != null)
    throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, t, e, "setState");
};
h.prototype.forceUpdate = function(t) {
  this.updater.enqueueForceUpdate(this, t, "forceUpdate");
};
function O() {
}
O.prototype = h.prototype;
function D(t, e, d) {
  this.props = t, this.context = e, this.refs = M, this.updater = d || B;
}
var k = D.prototype = new O();
k.constructor = D;
T(k, h.prototype);
k.isPureReactComponent = !0;
var R = Array.isArray, P = Object.prototype.hasOwnProperty, E = { current: null }, I = { key: !0, ref: !0, __self: !0, __source: !0 };
function L(t, e, d) {
  var u, i = {}, r = null, o = null;
  if (e != null)
    for (u in e.ref !== void 0 && (o = e.ref), e.key !== void 0 && (r = "" + e.key), e)
      P.call(e, u) && !I.hasOwnProperty(u) && (i[u] = e[u]);
  var s = arguments.length - 2;
  if (s === 1)
    i.children = d;
  else if (1 < s) {
    for (var a = Array(s), l = 0; l < s; l++)
      a[l] = arguments[l + 2];
    i.children = a;
  }
  if (t && t.defaultProps)
    for (u in s = t.defaultProps, s)
      i[u] === void 0 && (i[u] = s[u]);
  return { $$typeof: x, type: t, key: r, ref: o, props: i, _owner: E.current };
}
function Q(t, e) {
  return { $$typeof: x, type: t.type, key: e, ref: t.ref, props: t.props, _owner: t._owner };
}
function S(t) {
  return typeof t == "object" && t !== null && t.$$typeof === x;
}
function X(t) {
  var e = { "=": "=0", ":": "=2" };
  return "$" + t.replace(/[=:]/g, function(d) {
    return e[d];
  });
}
var b = /\/+/g;
function g(t, e) {
  return typeof t == "object" && t !== null && t.key != null ? X("" + t.key) : e.toString(36);
}
function j(t, e, d, u, i) {
  var r = typeof t;
  (r === "undefined" || r === "boolean") && (t = null);
  var o = !1;
  if (t === null)
    o = !0;
  else
    switch (r) {
      case "string":
      case "number":
        o = !0;
        break;
      case "object":
        switch (t.$$typeof) {
          case x:
          case V:
            o = !0;
        }
    }
  if (o)
    return o = t, i = i(o), t = u === "" ? "." + g(o, 0) : u, R(i) ? (d = "", t != null && (d = t.replace(b, "$&/") + "/"), j(i, e, d, "", function(l) {
      return l;
    })) : i != null && (S(i) && (i = Q(i, d + (!i.key || o && o.key === i.key ? "" : ("" + i.key).replace(b, "$&/") + "/") + t)), e.push(i)), 1;
  if (o = 0, u = u === "" ? "." : u + ":", R(t))
    for (var s = 0; s < t.length; s++) {
      r = t[s];
      var a = u + g(r, s);
      o += j(r, e, d, a, i);
    }
  else if (a = K(t), typeof a == "function")
    for (t = a.call(t), s = 0; !(r = t.next()).done; )
      r = r.value, a = u + g(r, s++), o += j(r, e, d, a, i);
  else if (r === "object")
    throw e = String(t), Error("Objects are not valid as a React child (found: " + (e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e) + "). If you meant to render a collection of children, use an array instead.");
  return o;
}
function w(t, e, d) {
  if (t == null)
    return t;
  var u = [], i = 0;
  return j(t, u, "", "", function(r) {
    return e.call(d, r, i++);
  }), u;
}
function Z(t) {
  if (t._status === -1) {
    var e = t._result;
    e = e(), e.then(function(d) {
      (t._status === 0 || t._status === -1) && (t._status = 1, t._result = d);
    }, function(d) {
      (t._status === 0 || t._status === -1) && (t._status = 2, t._result = d);
    }), t._status === -1 && (t._status = 0, t._result = e);
  }
  if (t._status === 1)
    return t._result.default;
  throw t._result;
}
var f = { current: null }, v = { transition: null }, tt = { ReactCurrentDispatcher: f, ReactCurrentBatchConfig: v, ReactCurrentOwner: E };
c.Children = { map: w, forEach: function(t, e, d) {
  w(t, function() {
    e.apply(this, arguments);
  }, d);
}, count: function(t) {
  var e = 0;
  return w(t, function() {
    e++;
  }), e;
}, toArray: function(t) {
  return w(t, function(e) {
    return e;
  }) || [];
}, only: function(t) {
  if (!S(t))
    throw Error("React.Children.only expected to receive a single React element child.");
  return t;
} };
c.Component = h;
c.Fragment = Y;
c.Profiler = U;
c.PureComponent = D;
c.StrictMode = F;
c.Suspense = H;
c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = tt;
c.cloneElement = function(t, e, d) {
  if (t == null)
    throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + t + ".");
  var u = T({}, t.props), i = t.key, r = t.ref, o = t._owner;
  if (e != null) {
    if (e.ref !== void 0 && (r = e.ref, o = E.current), e.key !== void 0 && (i = "" + e.key), t.type && t.type.defaultProps)
      var s = t.type.defaultProps;
    for (a in e)
      P.call(e, a) && !I.hasOwnProperty(a) && (u[a] = e[a] === void 0 && s !== void 0 ? s[a] : e[a]);
  }
  var a = arguments.length - 2;
  if (a === 1)
    u.children = d;
  else if (1 < a) {
    s = Array(a);
    for (var l = 0; l < a; l++)
      s[l] = arguments[l + 2];
    u.children = s;
  }
  return { $$typeof: x, type: t.type, key: i, ref: r, props: u, _owner: o };
};
c.createContext = function(t) {
  return t = { $$typeof: W, _currentValue: t, _currentValue2: t, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, t.Provider = { $$typeof: q, _context: t }, t.Consumer = t;
};
c.createElement = L;
c.createFactory = function(t) {
  var e = L.bind(null, t);
  return e.type = t, e;
};
c.createRef = function() {
  return { current: null };
};
c.forwardRef = function(t) {
  return { $$typeof: z, render: t };
};
c.isValidElement = S;
c.lazy = function(t) {
  return { $$typeof: G, _payload: { _status: -1, _result: t }, _init: Z };
};
c.memo = function(t, e) {
  return { $$typeof: J, type: t, compare: e === void 0 ? null : e };
};
c.startTransition = function(t) {
  var e = v.transition;
  v.transition = {};
  try {
    t();
  } finally {
    v.transition = e;
  }
};
c.unstable_act = function() {
  throw Error("act(...) is not supported in production builds of React.");
};
c.useCallback = function(t, e) {
  return f.current.useCallback(t, e);
};
c.useContext = function(t) {
  return f.current.useContext(t);
};
c.useDebugValue = function() {
};
c.useDeferredValue = function(t) {
  return f.current.useDeferredValue(t);
};
c.useEffect = function(t, e) {
  return f.current.useEffect(t, e);
};
c.useId = function() {
  return f.current.useId();
};
c.useImperativeHandle = function(t, e, d) {
  return f.current.useImperativeHandle(t, e, d);
};
c.useInsertionEffect = function(t, e) {
  return f.current.useInsertionEffect(t, e);
};
c.useLayoutEffect = function(t, e) {
  return f.current.useLayoutEffect(t, e);
};
c.useMemo = function(t, e) {
  return f.current.useMemo(t, e);
};
c.useReducer = function(t, e, d) {
  return f.current.useReducer(t, e, d);
};
c.useRef = function(t) {
  return f.current.useRef(t);
};
c.useState = function(t) {
  return f.current.useState(t);
};
c.useSyncExternalStore = function(t, e, d) {
  return f.current.useSyncExternalStore(t, e, d);
};
c.useTransition = function() {
  return f.current.useTransition();
};
c.version = "18.2.0";
N.exports = c;
var m = N.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var et = m, rt = Symbol.for("react.element"), nt = Symbol.for("react.fragment"), ot = Object.prototype.hasOwnProperty, at = et.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, st = { key: !0, ref: !0, __self: !0, __source: !0 };
function A(t, e, d) {
  var u, i = {}, r = null, o = null;
  d !== void 0 && (r = "" + d), e.key !== void 0 && (r = "" + e.key), e.ref !== void 0 && (o = e.ref);
  for (u in e)
    ot.call(e, u) && !st.hasOwnProperty(u) && (i[u] = e[u]);
  if (t && t.defaultProps)
    for (u in e = t.defaultProps, e)
      i[u] === void 0 && (i[u] = e[u]);
  return { $$typeof: rt, type: t, key: r, ref: o, props: i, _owner: at.current };
}
_.Fragment = nt;
_.jsx = A;
_.jsxs = A;
C.exports = _;
var n = C.exports;
const ut = (t, e) => ({ slug: t, plugin: e }), it = ut("essentials", (t) => {
  const e = t.components, { motion: d } = t.framerMotion, u = 5, i = (r) => (m.useEffect(() => {
    const o = setTimeout(r.onNext, u * 1e3);
    return () => clearTimeout(o);
  }, []), /* @__PURE__ */ n.jsx(
    "div",
    {
      className: "flex h-screen w-screen items-center justify-center bg-gray-100",
      onClick: r.onNext,
      children: /* @__PURE__ */ n.jsx(
        d.div,
        {
          className: "text-6xl font-semibold",
          animate: { opacity: [0, 1, 0] },
          transition: { duration: u, times: [0, 0.7, 1] },
          children: r.children
        }
      )
    }
  ));
  return {
    name: "Essentials",
    routineSteps: {
      // Morning routine steps
      "intro-to-yesterday": {
        name: "Intro to yesterday",
        description: "Animated screen to get you in the mood to retrospect on yesterday.",
        component: (r) => /* @__PURE__ */ n.jsx(i, { ...r, children: "Yesterday" })
      },
      "retro-on-yesterday": {
        name: "Retro on yesterday",
        description: "Retro on yesterday by writing down a note. The default template is a list of tasks you did yesterday, and headers for what went well and what didn't go well.",
        component: (r) => {
          const [o, s] = m.useState(null), a = t.dayjs().subtract(1, "day");
          return m.useEffect(() => {
            (async () => {
              const l = await t.getDays({
                from: a.toDate(),
                to: a.toDate(),
                include: { tasks: !0 }
              });
              if (!l.length) {
                s("");
                return;
              }
              const p = l[0];
              s(
                `<ul>${p.tasks.map(
                  (y) => `<li>${y.status === "DONE" ? "✅" : y.status === "CANCELED" ? "❌" : "⏳"} ${y.title}</li>`
                ).join("")}</ul>`
              );
            })();
          }, []), /* @__PURE__ */ n.jsxs("div", { children: [
            /* @__PURE__ */ n.jsx(
              e.NoteEditor,
              {
                slug: `flow-essentials_retro-${a.format("YYYY-MM-DD")}`,
                title: `Retro of ${a.format("MMMM D")}`,
                loading: o === null,
                initialValue: o ?? ""
              }
            ),
            /* @__PURE__ */ n.jsx(r.BackButton, {}),
            /* @__PURE__ */ n.jsx(r.NextButton, {})
          ] });
        }
      },
      "intro-to-today": {
        name: "Intro to today",
        description: "Animated screen to get you in the mood to plan for today.",
        component: (r) => /* @__PURE__ */ n.jsx(i, { ...r, children: "Today" })
      },
      "plan-for-today": {
        name: "Plan for today",
        description: "Plan for today by dragging items from your different lists into today's list.",
        component: (r) => {
          const o = t.dayjs(), [s, a] = t.hooks.useAsyncLoader(async () => await t.getDays({
            from: o.toDate(),
            to: o.toDate(),
            toRender: { Day: !0 }
          })), l = s == null ? void 0 : s[0];
          return a ? /* @__PURE__ */ n.jsx(n.Fragment, { children: "Loading..." }) : /* @__PURE__ */ n.jsxs("div", { children: [
            /* @__PURE__ */ n.jsxs("div", { children: [
              /* @__PURE__ */ n.jsx(r.BackButton, {}),
              /* @__PURE__ */ n.jsx(r.NextButton, {})
            ] }),
            /* @__PURE__ */ n.jsx(e.Day, { day: l, label: "Today" })
          ] });
        }
      },
      "today-tomorrow-next-week": {
        name: "Today, tomorrow, next week",
        description: "Choose to move tasks from today to tomorrow or next week if you have too many.",
        component: (r) => {
          const o = t.dayjs(), s = o.add(1, "day"), a = o.weekday(7), [l, p] = t.hooks.useAsyncLoader(async () => await t.getDaysMax10({
            dates: [o.toDate(), s.toDate(), a.toDate()],
            toRender: { Day: !0 }
          }));
          return p ? /* @__PURE__ */ n.jsx(n.Fragment, { children: "Loading..." }) : /* @__PURE__ */ n.jsxs("div", { children: [
            /* @__PURE__ */ n.jsxs("div", { children: [
              /* @__PURE__ */ n.jsx(r.BackButton, {}),
              /* @__PURE__ */ n.jsx(r.NextButton, {})
            ] }),
            /* @__PURE__ */ n.jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ n.jsx(e.Day, { day: l == null ? void 0 : l[0], label: "Today" }),
              /* @__PURE__ */ n.jsx(e.Day, { day: l == null ? void 0 : l[1], label: "Tomorrow" }),
              /* @__PURE__ */ n.jsx(e.Day, { day: l == null ? void 0 : l[2], label: "Next week" })
            ] })
          ] });
        }
      },
      // TODO: Implement `decide-shutdown-time` step
      // "decide-shutdown-time": {
      //   component: (props) => {
      //     const handleSetShutdownTime =
      //     return (<></>)},
      // },
      "todays-plan": {
        name: "Today's plan",
        description: "Write down your plan for today so you can share it with others. By default, it's a list of tasks you plan to do today.",
        component: (r) => {
          const [o, s] = m.useState(null), a = t.dayjs();
          return m.useEffect(() => {
            (async () => {
              const l = await t.getDays({
                from: a.toDate(),
                to: a.toDate(),
                include: { tasks: !0 }
              });
              if (!l.length) {
                s("");
                return;
              }
              const p = l[0];
              s(
                `<ul>${p.tasks.map(
                  (y) => `<li>${y.status === "DONE" ? "✅ " : y.status === "CANCELED" ? "❌ " : ""}${y.title}</li>`
                ).join("")}</ul>`
              );
            })();
          }, []), /* @__PURE__ */ n.jsxs("div", { children: [
            /* @__PURE__ */ n.jsx(
              e.NoteEditor,
              {
                slug: `flow-essentials_retro-${a.format("YYYY-MM-DD")}`,
                title: `Retro of ${a.format("MMMM D")}`,
                loading: o === null,
                initialValue: o ?? ""
              }
            ),
            /* @__PURE__ */ n.jsx(r.BackButton, {}),
            /* @__PURE__ */ n.jsx(r.NextButton, {})
          ] });
        }
      },
      // Shutdown routine steps
      "intro-to-todays-shutdown": {
        name: "Intro to today's shutdown",
        description: "Animated screen to get you in the mood to shutdown and retrospect on today.",
        component: (r) => /* @__PURE__ */ n.jsx(i, { ...r, children: "Let's reflect on what you did today" })
      },
      "clean-up-today": {
        name: "Clean up today",
        description: "Clean up today by marking tasks as done or canceling tasks.",
        component: (r) => {
          const o = t.dayjs(), [s, a] = t.hooks.useAsyncLoader(async () => await t.getDays({
            from: o.toDate(),
            to: o.toDate(),
            toRender: { Day: !0 }
          })), l = s == null ? void 0 : s[0];
          return a ? /* @__PURE__ */ n.jsx(n.Fragment, { children: "Loading..." }) : /* @__PURE__ */ n.jsxs("div", { children: [
            /* @__PURE__ */ n.jsxs("div", { children: [
              /* @__PURE__ */ n.jsx(r.BackButton, {}),
              /* @__PURE__ */ n.jsx(r.NextButton, {})
            ] }),
            /* @__PURE__ */ n.jsx(e.Day, { day: l, label: "Today" })
          ] });
        }
      },
      "retro-on-today": {
        name: "Retro on today",
        description: "Retro on today by writing down a note. The default template is a list of tasks you did today, and headers for what went well and what didn't go well.",
        component: (r) => {
          const [o, s] = m.useState(null), a = t.dayjs();
          return m.useEffect(() => {
            (async () => {
              const l = await t.getDays({
                from: a.toDate(),
                to: a.toDate(),
                include: { tasks: !0 }
              });
              if (!l.length) {
                s("");
                return;
              }
              const p = l[0];
              s(
                `<ul>${p.tasks.map(
                  (y) => `<li>${y.status === "DONE" ? "✅ " : y.status === "CANCELED" ? "❌ " : ""}${y.title}</li>`
                ).join("")}</ul>`
              );
            })();
          }, []), /* @__PURE__ */ n.jsxs("div", { children: [
            /* @__PURE__ */ n.jsx(
              e.NoteEditor,
              {
                slug: `flow-essentials_retro-${a.format("YYYY-MM-DD")}`,
                title: `Retro of ${a.format("MMMM D")}`,
                loading: o === null,
                initialValue: o ?? ""
              }
            ),
            /* @__PURE__ */ n.jsx(r.BackButton, {}),
            /* @__PURE__ */ n.jsx(r.NextButton, {})
          ] });
        }
      },
      "intro-to-tomorrow": {
        name: "Intro to tomorrow",
        description: "Animated screen to get you in the mood to plan for tomorrow.",
        component: (r) => /* @__PURE__ */ n.jsx(i, { ...r, children: "Tomorrow" })
      },
      "plan-for-tomorrow": {
        name: "Plan for tomorrow",
        description: "Plan for tomorrow by dragging items from your different lists into tomorrow's list.",
        component: (r) => {
          const o = t.dayjs().add(1, "day"), [s, a] = t.hooks.useAsyncLoader(async () => await t.getDays({
            from: o.toDate(),
            to: o.toDate(),
            toRender: { Day: !0 }
          })), l = s == null ? void 0 : s[0];
          return a ? /* @__PURE__ */ n.jsx(n.Fragment, { children: "Loading..." }) : /* @__PURE__ */ n.jsxs("div", { children: [
            /* @__PURE__ */ n.jsxs("div", { children: [
              /* @__PURE__ */ n.jsx(r.BackButton, {}),
              /* @__PURE__ */ n.jsx(r.NextButton, {})
            ] }),
            /* @__PURE__ */ n.jsx(e.Day, { day: l, label: "Tomorrow" })
          ] });
        }
      }
    }
  };
});
export {
  it as default
};
