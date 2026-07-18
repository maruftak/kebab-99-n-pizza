/* Menu rendering + item customizer modal.
   Each category leads with a banner photo; items are rows that open a modal
   to pick size, sauces, salads, extras (with prices) and quantity before
   adding to cart. All DOM is built with createElement + textContent — no
   innerHTML — so no data can inject markup. */
(function () {
  "use strict";

  var KEBAB = window.KEBAB;
  var Cart = window.Cart;
  if (!KEBAB || !Cart) return;

  var IMG = "assets/img/";
  var BANNER = {
    "cat-kebabs": "kebab-chicken.jpg", "cat-plates": "lamb.jpg", "cat-pizza": "pizza.jpg",
    "cat-pide": "pide.jpg", "cat-deals": "nachos.jpg", "cat-snack-packs": "snackpack.jpg",
    "cat-burgers": "burger.jpg", "cat-sides": "fries.jpg", "cat-drinks": "drinks.jpg",
    "cat-sweets": "baklava.jpg",
  };

  function money(n) { return "$" + Number(n).toFixed(2); }

  function el(tag, attrs, kids) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] == null) return;
        if (k === "class") node.className = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (kids || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function sizeLabelsFor(item) {
    if (item.sizeLabels) return item.sizeLabels;
    return KEBAB.SIZE_LABELS[item.sizes.length] || item.sizes.map(function (_, i) { return "Opt " + (i + 1); });
  }

  // Item-level `groups` overrides the category default (e.g. water skips the
  // flavour picker its drinks siblings use).
  function groupsFor(item, catId) {
    var ids = item.groups || KEBAB.CATEGORY_GROUPS[catId] || [];
    return ids.map(function (id) { return KEBAB.OPTION_GROUPS[id]; }).filter(Boolean);
  }

  // ---------------------------------------------------------------- toast --
  var toastTimer;
  function showToast(msg) {
    var root = document.getElementById("toast-root");
    if (!root) return;
    root.textContent = "";
    root.appendChild(el("div", { class: "toast" }, [document.createTextNode("✅ " + msg)]));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { root.textContent = ""; }, 2200);
  }

  // ---------------------------------------------------------------- modal --
  function openModal(item, cat, trigger) {
    var groups = groupsFor(item, cat.id);
    var hasSizes = !!item.sizes;
    var selSize = 0;
    var single = {}; // groupId -> optionId (required singles default to first)
    var multi = {};  // groupId -> Set of optionIds
    var qty = 1;
    var openScrollY = window.scrollY;
    groups.forEach(function (g) {
      if (g.type === "single") single[g.id] = g.required ? g.options[0].id : null;
      else multi[g.id] = new Set(g.defaults || []);
    });

    function unitPrice() {
      var base = hasSizes ? item.sizes[selSize] : item.price;
      var add = 0;
      groups.forEach(function (g) {
        if (g.type === "multi") {
          var set = multi[g.id];
          if (g.freeLimit != null) {
            if (set.size > g.freeLimit) add += (set.size - g.freeLimit) * g.extraPrice;
          } else {
            g.options.forEach(function (o) { if (o.price && set.has(o.id)) add += o.price; });
          }
        } else if (single[g.id]) {
          // priced single options (e.g. snack pack base swaps +$1)
          var sel = g.options.filter(function (o) { return o.id === single[g.id]; })[0];
          if (sel && sel.price) add += sel.price;
        }
      });
      return base + add;
    }

    function compose() {
      var paren = [];
      if (hasSizes) paren.push(sizeLabelsFor(item)[selSize]);
      groups.forEach(function (g) {
        if (g.type === "single" && single[g.id]) {
          var o = g.options.filter(function (x) { return x.id === single[g.id]; })[0];
          if (o) paren.push(o.label);
        }
      });
      var tail = [];
      groups.forEach(function (g) {
        if (g.type !== "multi") return;
        var set = multi[g.id];
        if (!set.size) return;
        var labels = g.options.filter(function (o) { return set.has(o.id); }).map(function (o) { return o.label; });
        tail.push(labels.join("/"));
      });
      var name = item.name + (paren.length ? " (" + paren.join(", ") + ")" : "") + (tail.length ? " — " + tail.join(" · ") : "");

      var ids = [];
      if (hasSizes) ids.push("sz" + selSize);
      groups.forEach(function (g) {
        if (g.type === "single") { if (single[g.id]) ids.push(g.id + ":" + single[g.id]); }
        else { var arr = Array.from(multi[g.id]).sort(); if (arr.length) ids.push(g.id + ":" + arr.join("+")); }
      });
      return { key: item.id + "|" + ids.join("|"), name: name };
    }

    // ---- build DOM ----
    var totalEl = el("span", { class: "mtotal" });
    var addBtn = el("button", { type: "button", class: "btn btn-red" });
    function recompute() {
      var total = unitPrice() * qty;
      totalEl.textContent = money(total);
      addBtn.textContent = "ADD TO CART — " + money(total);
    }

    function optButton(label, price, selected, onToggle, isRadio) {
      var attrs = { type: "button", class: "opt", "aria-pressed": selected ? "true" : "false" };
      if (isRadio) { attrs.role = "radio"; attrs["aria-checked"] = selected ? "true" : "false"; }
      var btn = el("button", attrs, [document.createTextNode(label)]);
      if (price) btn.appendChild(el("span", { class: "op-price", text: (price > 0 ? "+" : "") + money(price) }));
      btn.addEventListener("click", function () { onToggle(btn); });
      return btn;
    }

    // For free-limit groups (sauces): once the free picks are used, unselected
    // pills grow a "+$1.00" badge so the upcharge is visible before tapping.
    function syncFreeBadges(g, list) {
      if (g.freeLimit == null) return;
      var atLimit = multi[g.id].size >= g.freeLimit;
      Array.prototype.forEach.call(list.children, function (btn, i) {
        var old = btn.querySelector(".op-price");
        if (old) old.remove();
        if (atLimit && !multi[g.id].has(g.options[i].id)) {
          btn.appendChild(el("span", { class: "op-price", text: "+" + money(g.extraPrice) }));
        }
      });
    }

    function renderGroup(g) {
      var wrap = el("div", { class: "opt-group" }, [el("h3", { text: g.label + (g.required ? " *" : "") })]);
      var note = g.note || (g.type === "single" && g.required ? "Choose one" : "");
      if (note) wrap.appendChild(el("p", { class: "gnote", text: note }));
      var list = el("div", { class: "opt-list", role: g.type === "single" ? "radiogroup" : "group", "aria-label": g.label });
      g.options.forEach(function (o) {
        var selected = g.type === "single" ? single[g.id] === o.id : multi[g.id].has(o.id);
        var btn = optButton(o.label, o.price || 0, selected, function () {
          if (g.type === "single") {
            single[g.id] = o.id;
            Array.prototype.forEach.call(list.children, function (c, i) {
              var sel = g.options[i].id === o.id;
              c.setAttribute("aria-pressed", sel ? "true" : "false");
              c.setAttribute("aria-checked", sel ? "true" : "false");
            });
          } else {
            var set = multi[g.id];
            if (set.has(o.id)) set.delete(o.id); else set.add(o.id);
            btn.setAttribute("aria-pressed", set.has(o.id) ? "true" : "false");
            syncFreeBadges(g, list);
          }
          recompute();
        }, g.type === "single");
        list.appendChild(btn);
      });
      syncFreeBadges(g, list);
      wrap.appendChild(list);
      return wrap;
    }

    var body = el("div", { class: "modal-body" });
    if (item.img) body.appendChild(el("img", { class: "modal-img", src: item.img, alt: item.name, width: "560", height: "170" }));
    if (item.desc) body.appendChild(el("p", { class: "modal-desc", text: item.desc }));

    if (hasSizes) {
      var sg = el("div", { class: "opt-group" }, [el("h3", { text: "Size" }), el("p", { class: "gnote", text: "Choose one" })]);
      var slist = el("div", { class: "opt-list", role: "radiogroup", "aria-label": "Size" });
      var labels = sizeLabelsFor(item);
      item.sizes.forEach(function (p, i) {
        var btn = optButton(labels[i], p, selSize === i, function () {
          selSize = i;
          Array.prototype.forEach.call(slist.children, function (c, ci) {
            var s = ci === i;
            c.setAttribute("aria-pressed", s ? "true" : "false");
            c.setAttribute("aria-checked", s ? "true" : "false");
          });
          recompute();
        }, true);
        // size shows absolute price, not a "+"; override the pill's price span
        btn.textContent = labels[i];
        btn.appendChild(el("span", { class: "op-price", text: money(p) }));
        btn.addEventListener("click", function () {}); // listener already attached above
        slist.appendChild(btn);
      });
      sg.appendChild(slist);
      body.appendChild(sg);
    }

    groups.forEach(function (g) { body.appendChild(renderGroup(g)); });

    // quantity
    var nEl = el("span", { class: "n", text: "1" });
    var minus = el("button", { type: "button", "aria-label": "Decrease quantity", text: "−" });
    var plus = el("button", { type: "button", class: "plus", "aria-label": "Increase quantity", text: "+" });
    minus.addEventListener("click", function () { if (qty > 1) { qty--; nEl.textContent = String(qty); recompute(); } });
    plus.addEventListener("click", function () { if (qty < 99) { qty++; nEl.textContent = String(qty); recompute(); } });
    body.appendChild(el("div", { class: "opt-group" }, [
      el("h3", { text: "Quantity" }),
      el("div", { class: "qty-stepper" }, [minus, nEl, plus]),
    ]));

    var closeBtn = el("button", { type: "button", class: "modal-close", "aria-label": "Close", text: "✕" });
    var head = el("div", { class: "modal-head" }, [el("h2", { id: "modal-title", text: item.name }), closeBtn]);
    var foot = el("div", { class: "modal-foot" }, [totalEl, addBtn]);

    var modal = el("div", { class: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "modal-title" }, [head, body, foot]);
    var backdrop = el("div", { class: "modal-backdrop" }, [modal]);

    // ---- behaviour ----
    function close() {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKey);
      backdrop.remove();
      // some browsers drop the scroll position when body overflow unlocks
      window.scrollTo(0, openScrollY);
      if (trigger && trigger.focus) trigger.focus();
    }
    function focusables() {
      return Array.prototype.slice.call(modal.querySelectorAll("button, [href], input, [tabindex]:not([tabindex='-1'])"))
        .filter(function (n) { return n.offsetParent !== null || n === document.activeElement; });
    }
    function onKey(e) {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key === "Tab") {
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", function (e) { if (e.target === backdrop) close(); });
    addBtn.addEventListener("click", function () {
      var c = compose();
      Cart.add({ key: c.key, name: c.name, price: unitPrice(), qty: qty });
      close();
      showToast("Added " + item.name + " to cart");
    });
    document.addEventListener("keydown", onKey);

    document.body.classList.add("modal-open");
    document.body.appendChild(backdrop);
    recompute();
    closeBtn.focus();
  }

  // ----------------------------------------------------------------- rows --
  function buildRow(item, cat) {
    var price = item.sizes ? "from " + money(Math.min.apply(null, item.sizes)) : money(item.price);
    var kids = [
      el("div", { class: "row-head" }, [
        el("span", { class: "row-name", text: item.name }),
        el("span", { class: "row-price", text: price }),
      ]),
    ];
    if (item.desc) kids.push(el("p", { class: "row-desc", text: item.desc }));
    // items with nothing to configure skip the modal — one tap adds one
    var simple = !groupsFor(item, cat.id).length && !item.sizes;
    kids.push(el("span", { class: "row-cta", text: simple ? "ADD ＋" : "CUSTOMISE ＋" }));
    var rowKids = [el("div", { class: "row-main" }, kids)];
    if (item.img) rowKids.push(el("img", { class: "row-thumb", src: item.img, alt: "", loading: "lazy", width: "74", height: "74" }));
    var attrs = { type: "button", class: "menu-row" };
    if (!simple) attrs["aria-haspopup"] = "dialog";
    var row = el("button", attrs, rowKids);
    row.addEventListener("click", function () {
      if (simple) {
        Cart.add({ key: item.id, name: item.name, price: item.price, qty: 1 });
        showToast("Added " + item.name + " to cart");
      } else {
        openModal(item, cat, row);
      }
    });
    return row;
  }

  function buildBanner(cat, eager) {
    var img = el("img", { src: IMG + (BANNER[cat.id] || "hero.jpg"), alt: cat.name, loading: eager ? "eager" : "lazy" });
    var ov = [el("h2", { text: cat.name })];
    if (cat.subtitle) ov.push(el("p", { text: cat.subtitle }));
    return el("div", { class: "cat-banner" }, [img, el("div", { class: "ov" }, ov)]);
  }

  function render() {
    var rail = document.getElementById("cat-rail");
    rail.textContent = "";
    KEBAB.MENU.forEach(function (cat) { rail.appendChild(el("a", { href: "#" + cat.id, text: cat.name })); });

    var root = document.getElementById("menu-root");
    root.textContent = "";
    KEBAB.MENU.forEach(function (cat, ci) {
      var section = el("section", { class: "menu-cat", id: cat.id });
      section.appendChild(buildBanner(cat, ci === 0));
      var list = el("div", { class: "menu-list" });
      cat.items.forEach(function (item) { list.appendChild(buildRow(item, cat)); });
      section.appendChild(list);
      root.appendChild(section);
    });
  }

  function wireCartBar() {
    var bar = document.getElementById("cart-bar");
    var countEl = document.getElementById("cart-bar-count");
    var totalEl = document.getElementById("cart-bar-total");
    Cart.subscribe(function () {
      var count = Cart.count();
      bar.hidden = count === 0;
      countEl.textContent = count + " ITEM(S)";
      totalEl.textContent = money(Cart.subtotal());
    });
  }

  document.addEventListener("DOMContentLoaded", function () { render(); wireCartBar(); });
})();
