(function (m, y) {
  typeof exports == "object" && typeof module < "u"
    ? (module.exports = y())
    : typeof define == "function" && define.amd
    ? define(y)
    : ((m = typeof globalThis < "u" ? globalThis : m || self), (m["flow-essentials"] = y()));
})(this, function () {
  "use strict";
  var m = { exports: {} },
    y = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */ var h = React,
    D = Symbol.for("react.element"),
    g = Symbol.for("react.fragment"),
    k = Object.prototype.hasOwnProperty,
    p = h.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
    v = { key: !0, ref: !0, __self: !0, __source: !0 };
  function w(o, r, x) {
    var d,
      c = {},
      e = null,
      n = null;
    x !== void 0 && (e = "" + x),
      r.key !== void 0 && (e = "" + r.key),
      r.ref !== void 0 && (n = r.ref);
    for (d in r) k.call(r, d) && !v.hasOwnProperty(d) && (c[d] = r[d]);
    if (o && o.defaultProps) for (d in ((r = o.defaultProps), r)) c[d] === void 0 && (c[d] = r[d]);
    return { $$typeof: D, type: o, key: e, ref: n, props: c, _owner: p.current };
  }
  (y.Fragment = g), (y.jsx = w), (y.jsxs = w), (m.exports = y);
  var t = m.exports;
  const N = (o, r) => ({ slug: o, plugin: r }),
    { useEffect: f, useState: j } = React;
  return N("essentials", (o) => {
    const r = o.components,
      { motion: x } = o.framerMotion,
      d = 5,
      c = (e) => (
        f(() => {
          const n = setTimeout(e.onNext, d * 1e3);
          return () => clearTimeout(n);
        }, []),
        t.jsx("div", {
          className: "flex h-screen w-screen items-center justify-center bg-gray-100",
          onClick: e.onNext,
          children: t.jsx(x.div, {
            className: "text-6xl font-semibold",
            animate: { opacity: [0, 1, 0] },
            transition: { duration: d, times: [0, 0.7, 1] },
            children: e.children,
          }),
        })
      );
    return {
      name: "Essentials",
      routineSteps: {
        "intro-to-yesterday": {
          name: "Intro to yesterday",
          description: "Animated screen to get you in the mood to retrospect on yesterday.",
          component: (e) => t.jsx(c, { ...e, children: "Yesterday" }),
        },
        "retro-on-yesterday": {
          name: "Retro on yesterday",
          description:
            "Retro on yesterday by writing down a note. The default template is a list of tasks you did yesterday, and headers for what went well and what didn't go well.",
          component: (e) => {
            const [n, s] = j(null),
              i = o.dayjs().subtract(1, "day");
            return (
              f(() => {
                (async () => {
                  const a = await o.getDays({
                    from: i.toDate(),
                    to: i.toDate(),
                    include: { tasks: !0 },
                  });
                  if (!a.length) {
                    s("");
                    return;
                  }
                  const u = a[0];
                  s(
                    `<ul>${u.tasks
                      .map(
                        (l) =>
                          `<li>${
                            l.status === "DONE" ? "✅" : l.status === "CANCELED" ? "❌" : "⏳"
                          } ${l.title}</li>`
                      )
                      .join("")}</ul>`
                  );
                })();
              }, []),
              t.jsxs("div", {
                children: [
                  t.jsx(r.NoteEditor, {
                    slug: `flow-essentials_retro-${i.format("YYYY-MM-DD")}`,
                    title: `Retro of ${i.format("MMMM D")}`,
                    loading: n === null,
                    initialValue: n ?? "",
                  }),
                  t.jsx(e.BackButton, {}),
                  t.jsx(e.NextButton, {}),
                ],
              })
            );
          },
        },
        "intro-to-today": {
          name: "Intro to today",
          description: "Animated screen to get you in the mood to plan for today.",
          component: (e) => t.jsx(c, { ...e, children: "Today" }),
        },
        "plan-for-today": {
          name: "Plan for today",
          description:
            "Plan for today by dragging items from your different lists into today's list.",
          component: (e) => {
            const n = o.dayjs(),
              [s, i] = o.hooks.useAsyncLoader(
                async () =>
                  await o.getDays({ from: n.toDate(), to: n.toDate(), toRender: { Day: !0 } })
              ),
              a = s == null ? void 0 : s[0];
            return i
              ? t.jsx(t.Fragment, { children: "Loading..." })
              : t.jsxs("div", {
                  children: [
                    t.jsxs("div", { children: [t.jsx(e.BackButton, {}), t.jsx(e.NextButton, {})] }),
                    t.jsx(r.Day, { day: a, label: "Today" }),
                  ],
                });
          },
        },
        "today-tomorrow-next-week": {
          name: "Today, tomorrow, next week",
          description:
            "Choose to move tasks from today to tomorrow or next week if you have too many.",
          component: (e) => {
            const n = o.dayjs(),
              s = n.add(1, "day"),
              i = n.weekday(7),
              [a, u] = o.hooks.useAsyncLoader(
                async () =>
                  await o.getDaysMax10({
                    dates: [n.toDate(), s.toDate(), i.toDate()],
                    toRender: { Day: !0 },
                  })
              );
            return u
              ? t.jsx(t.Fragment, { children: "Loading..." })
              : t.jsxs("div", {
                  children: [
                    t.jsxs("div", { children: [t.jsx(e.BackButton, {}), t.jsx(e.NextButton, {})] }),
                    t.jsxs("div", {
                      className: "flex",
                      children: [
                        t.jsx(r.Day, { day: a == null ? void 0 : a[0], label: "Today" }),
                        t.jsx(r.Day, { day: a == null ? void 0 : a[1], label: "Tomorrow" }),
                        t.jsx(r.Day, { day: a == null ? void 0 : a[2], label: "Next week" }),
                      ],
                    }),
                  ],
                });
          },
        },
        "todays-plan": {
          name: "Today's plan",
          description:
            "Write down your plan for today so you can share it with others. By default, it's a list of tasks you plan to do today.",
          component: (e) => {
            const [n, s] = j(null),
              i = o.dayjs();
            return (
              f(() => {
                (async () => {
                  const a = await o.getDays({
                    from: i.toDate(),
                    to: i.toDate(),
                    include: { tasks: !0 },
                  });
                  if (!a.length) {
                    s("");
                    return;
                  }
                  const u = a[0];
                  s(
                    `<ul>${u.tasks
                      .map(
                        (l) =>
                          `<li>${
                            l.status === "DONE" ? "✅ " : l.status === "CANCELED" ? "❌ " : ""
                          }${l.title}</li>`
                      )
                      .join("")}</ul>`
                  );
                })();
              }, []),
              t.jsxs("div", {
                children: [
                  t.jsx(r.NoteEditor, {
                    slug: `flow-essentials_retro-${i.format("YYYY-MM-DD")}`,
                    title: `Retro of ${i.format("MMMM D")}`,
                    loading: n === null,
                    initialValue: n ?? "",
                  }),
                  t.jsx(e.BackButton, {}),
                  t.jsx(e.NextButton, {}),
                ],
              })
            );
          },
        },
        "intro-to-todays-shutdown": {
          name: "Intro to today's shutdown",
          description:
            "Animated screen to get you in the mood to shutdown and retrospect on today.",
          component: (e) => t.jsx(c, { ...e, children: "Let's reflect on what you did today" }),
        },
        "clean-up-today": {
          name: "Clean up today",
          description: "Clean up today by marking tasks as done or canceling tasks.",
          component: (e) => {
            const n = o.dayjs(),
              [s, i] = o.hooks.useAsyncLoader(
                async () =>
                  await o.getDays({ from: n.toDate(), to: n.toDate(), toRender: { Day: !0 } })
              ),
              a = s == null ? void 0 : s[0];
            return i
              ? t.jsx(t.Fragment, { children: "Loading..." })
              : t.jsxs("div", {
                  children: [
                    t.jsxs("div", { children: [t.jsx(e.BackButton, {}), t.jsx(e.NextButton, {})] }),
                    t.jsx(r.Day, { day: a, label: "Today" }),
                  ],
                });
          },
        },
        "retro-on-today": {
          name: "Retro on today",
          description:
            "Retro on today by writing down a note. The default template is a list of tasks you did today, and headers for what went well and what didn't go well.",
          component: (e) => {
            const [n, s] = j(null),
              i = o.dayjs();
            return (
              f(() => {
                (async () => {
                  const a = await o.getDays({
                    from: i.toDate(),
                    to: i.toDate(),
                    include: { tasks: !0 },
                  });
                  if (!a.length) {
                    s("");
                    return;
                  }
                  const u = a[0];
                  s(
                    `<ul>${u.tasks
                      .map(
                        (l) =>
                          `<li>${
                            l.status === "DONE" ? "✅ " : l.status === "CANCELED" ? "❌ " : ""
                          }${l.title}</li>`
                      )
                      .join("")}</ul>`
                  );
                })();
              }, []),
              t.jsxs("div", {
                children: [
                  t.jsx(r.NoteEditor, {
                    slug: `flow-essentials_retro-${i.format("YYYY-MM-DD")}`,
                    title: `Retro of ${i.format("MMMM D")}`,
                    loading: n === null,
                    initialValue: n ?? "",
                  }),
                  t.jsx(e.BackButton, {}),
                  t.jsx(e.NextButton, {}),
                ],
              })
            );
          },
        },
        "intro-to-tomorrow": {
          name: "Intro to tomorrow",
          description: "Animated screen to get you in the mood to plan for tomorrow.",
          component: (e) => t.jsx(c, { ...e, children: "Tomorrow" }),
        },
        "plan-for-tomorrow": {
          name: "Plan for tomorrow",
          description:
            "Plan for tomorrow by dragging items from your different lists into tomorrow's list.",
          component: (e) => {
            const n = o.dayjs().add(1, "day"),
              [s, i] = o.hooks.useAsyncLoader(
                async () =>
                  await o.getDays({ from: n.toDate(), to: n.toDate(), toRender: { Day: !0 } })
              ),
              a = s == null ? void 0 : s[0];
            return i
              ? t.jsx(t.Fragment, { children: "Loading..." })
              : t.jsxs("div", {
                  children: [
                    t.jsxs("div", { children: [t.jsx(e.BackButton, {}), t.jsx(e.NextButton, {})] }),
                    t.jsx(r.Day, { day: a, label: "Tomorrow" }),
                  ],
                });
          },
        },
      },
    };
  });
});
