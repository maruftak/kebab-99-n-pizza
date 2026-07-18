/* Renders the menu from window.KEBAB and wires add-to-cart.
   Everything is built with createElement + textContent — no innerHTML,
   so nothing in the data (or a future CMS feed) can inject markup. */
(function () {
  "use strict";

  var KEBAB = window.KEBAB;
  var Cart = window.Cart;
  if (!KEBAB || !Cart) return;

  var selections = {}; // itemId -> chosen size index

  function money(n) {
    return "$" + Number(n).toFixed(2);
  }

  function el(tag, attrs, kids) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "class") node.className = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (kids || []).forEach(function (c) {
      if (c) node.appendChild(c);
    });
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
      line = {
        key: item.id + ":" + label,
        name: item.name + " (" + label + ")",
        price: item.sizes[idx],
        qty: 1,
      };
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
    var t = el("div", { class: "toast" }, [document.createTextNode("✅ " + msg)]);
    root.appendChild(t);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      root.textContent = "";
    }, 2200);
  }

  function buildItemCard(item) {
    var kids = [];

    // image
    if (item.img) {
      kids.push(el("img", {
        class: "item-img",
        src: item.img,
        width: "800",
        height: "600",
        loading: "lazy",
        alt: item.name,
      }));
    }

    // name + price
    var displayPrice = item.sizes ? "from " + money(Math.min.apply(null, item.sizes)) : money(item.price);
    var top = el("div", { class: "item-top" }, [
      el("div", { class: "item-name", text: item.name }),
      el("span", { class: "price-pill", text: displayPrice }),
    ]);
    var head = el("div", null, [top]);
    if (item.desc) head.appendChild(el("p", { class: "item-desc", text: item.desc }));
    kids.push(head);

    // size buttons
    if (item.sizes) {
      var labels = sizeLabelsFor(item);
      var row = el("div", { class: "sizes", role: "group", "aria-label": item.name + " size" });
      item.sizes.forEach(function (price, i) {
        var pressed = (selections[item.id] || 0) === i;
        var btn = el("button", {
          type: "button",
          class: "size-btn",
          "aria-pressed": pressed ? "true" : "false",
          text: labels[i] + " " + money(price),
        });
        btn.addEventListener("click", function () {
          selections[item.id] = i;
          // update pressed state within this group
          Array.prototype.forEach.call(row.children, function (c, ci) {
            c.setAttribute("aria-pressed", ci === i ? "true" : "false");
          });
        });
        row.appendChild(btn);
      });
      kids.push(row);
    }

    // add button
    var add = el("button", { type: "button", class: "add-btn", text: "+ ADD TO CART" });
    add.addEventListener("click", function () { addToCart(item); });
    kids.push(add);

    return el("div", { class: "item" }, kids);
  }

  function render() {
    // category rail
    var rail = document.getElementById("cat-rail");
    rail.textContent = "";
    KEBAB.MENU.forEach(function (cat) {
      rail.appendChild(el("a", { href: "#" + cat.id, text: cat.name }));
    });

    // sections
    var root = document.getElementById("menu-root");
    root.textContent = "";
    KEBAB.MENU.forEach(function (cat) {
      var section = el("section", { class: "menu-cat", id: cat.id });
      var head = el("div", { class: "menu-cat-head" }, [
        el("h2", { text: cat.name }),
        el("div", { class: "rule" }),
      ]);
      section.appendChild(head);
      if (cat.subtitle) section.appendChild(el("p", { class: "menu-cat-sub", text: cat.subtitle }));

      var grid = el("div", { class: "menu-grid" });
      cat.items.forEach(function (item) {
        grid.appendChild(buildItemCard(item));
      });
      section.appendChild(grid);
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
