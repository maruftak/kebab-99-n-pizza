/* Renders the menu from window.KEBAB.
   Each category leads with a large banner photo (title overlaid); items are
   clean rows below. This keeps every photo big and appetizing and avoids the
   same thumbnail repeating down a category. All DOM is built with
   createElement + textContent — no innerHTML. */
(function () {
  "use strict";

  var KEBAB = window.KEBAB;
  var Cart = window.Cart;
  if (!KEBAB || !Cart) return;

  var IMG = "assets/img/";
  // one representative, distinct photo per category
  var BANNER = {
    "cat-kebabs": "kebab-chicken.jpg",
    "cat-plates": "lamb.jpg",
    "cat-pizza": "pizza.jpg",
    "cat-pide": "pide.jpg",
    "cat-deals": "nachos.jpg",
    "cat-snack-packs": "snackpack.jpg",
    "cat-burgers": "burger.jpg",
    "cat-sides": "fries.jpg",
    "cat-sweets": "baklava.jpg",
  };

  var selections = {}; // itemId -> chosen size index

  function money(n) { return "$" + Number(n).toFixed(2); }

  function el(tag, attrs, kids) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
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

  function addToCart(item) {
    var line;
    if (item.sizes) {
      var idx = selections[item.id] || 0;
      var labels = sizeLabelsFor(item);
      var label = labels[idx];
      line = { key: item.id + ":" + label, name: item.name + " (" + label + ")", price: item.sizes[idx], qty: 1 };
    } else {
      line = { key: item.id, name: item.name, price: item.price, qty: 1 };
    }
    Cart.add(line);
    showToast("Added " + item.name + " to cart");
  }

  var toastTimer;
  function showToast(msg) {
    var root = document.getElementById("toast-root");
    if (!root) return;
    root.textContent = "";
    root.appendChild(el("div", { class: "toast" }, [document.createTextNode("✅ " + msg)]));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { root.textContent = ""; }, 2200);
  }

  function buildSizes(item) {
    var labels = sizeLabelsFor(item);
    var row = el("div", { class: "sizes", role: "group", "aria-label": item.name + " size" });
    item.sizes.forEach(function (price, i) {
      var pressed = (selections[item.id] || 0) === i;
      var btn = el("button", { type: "button", class: "size-btn", "aria-pressed": pressed ? "true" : "false", text: labels[i] + " " + money(price) });
      btn.addEventListener("click", function () {
        selections[item.id] = i;
        Array.prototype.forEach.call(row.children, function (c, ci) {
          c.setAttribute("aria-pressed", ci === i ? "true" : "false");
        });
      });
      row.appendChild(btn);
    });
    return row;
  }

  function buildRow(item) {
    var price = item.sizes ? "from " + money(Math.min.apply(null, item.sizes)) : money(item.price);
    var head = el("div", { class: "row-head" }, [
      el("span", { class: "row-name", text: item.name }),
      el("span", { class: "row-price", text: price }),
    ]);
    var kids = [head];
    if (item.desc) kids.push(el("p", { class: "row-desc", text: item.desc }));
    if (item.sizes) kids.push(buildSizes(item));

    var add = el("button", { type: "button", class: "add-btn", text: "+ ADD TO CART" });
    add.addEventListener("click", function () { addToCart(item); });
    kids.push(el("div", { class: "row-foot" }, [add]));

    return el("div", { class: "menu-row" }, kids);
  }

  function buildBanner(cat, eager) {
    var img = el("img", { src: IMG + (BANNER[cat.id] || "hero.jpg"), alt: cat.name, loading: eager ? "eager" : "lazy" });
    var ovKids = [el("h2", { text: cat.name })];
    if (cat.subtitle) ovKids.push(el("p", { text: cat.subtitle }));
    return el("div", { class: "cat-banner" }, [img, el("div", { class: "ov" }, ovKids)]);
  }

  function render() {
    var rail = document.getElementById("cat-rail");
    rail.textContent = "";
    KEBAB.MENU.forEach(function (cat) {
      rail.appendChild(el("a", { href: "#" + cat.id, text: cat.name }));
    });

    var root = document.getElementById("menu-root");
    root.textContent = "";
    KEBAB.MENU.forEach(function (cat, ci) {
      var section = el("section", { class: "menu-cat", id: cat.id });
      section.appendChild(buildBanner(cat, ci === 0));
      var list = el("div", { class: "menu-list" });
      cat.items.forEach(function (item) { list.appendChild(buildRow(item)); });
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

  document.addEventListener("DOMContentLoaded", function () {
    render();
    wireCartBar();
  });
})();
