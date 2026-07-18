/* Order flow: cart -> checkout -> confirmed.
   Demo checkout: card/expiry/cvc are held in memory only for this view,
   never written to storage and never sent anywhere. No real payment occurs. */
(function () {
  "use strict";

  var Cart = window.Cart;
  if (!Cart) return;

  var SERVICE_FEE = 1.5;
  var TRACK = [
    { icon: "🧾", label: "Received", msg: "We've got your order — the kitchen is up next." },
    { icon: "🔥", label: "Preparing", msg: "Your food is on the grill right now. 🔥" },
    { icon: "📦", label: "Ready", msgPickup: "Ready for pickup at the counter!", msgDelivery: "Packed up and heading out for delivery." },
    { icon: "✅", label: "Completed", msg: "Enjoy your feed! 🎉" },
  ];

  var state = {
    stage: "cart",
    mode: "pickup",
    name: "",
    phone: "",
    address: "",
    // payment — memory only, never persisted
    card: "",
    expiry: "",
    cvc: "",
    orderNumber: null,
    orderMode: "",
    trackIdx: 0,
  };
  var trackTimer = null;

  // --------------------------------------------------------------- utils ---
  function money(n) { return "$" + Number(n).toFixed(2); }

  function el(tag, attrs, kids) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "class") node.className = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else if (k === "disabled") { if (attrs[k]) node.setAttribute("disabled", ""); }
        else node.setAttribute(k, attrs[k]);
      });
    }
    (kids || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  // ---------------------------------------------------------- validation ---
  function digits(s) { return (s || "").replace(/\D/g, ""); }
  function validName(v) { return v.trim().length >= 2; }
  function validPhone(v) { return /^[0-9 +()\-]{6,20}$/.test(v.trim()); }
  function validAddress(v) { return v.trim().length >= 5; }
  function validCard(v) { var d = digits(v); return d.length >= 12 && d.length <= 19; }
  function validExpiry(v) { var m = /^(\d{2})\/(\d{2})$/.exec(v.trim()); if (!m) return false; var mm = +m[1]; return mm >= 1 && mm <= 12; }
  function validCvc(v) { return /^\d{3,4}$/.test(v.trim()); }

  function canPlace() {
    if (!validName(state.name) || !validPhone(state.phone)) return false;
    if (state.mode === "delivery" && !validAddress(state.address)) return false;
    return validCard(state.card) && validExpiry(state.expiry) && validCvc(state.cvc);
  }

  // ---------------------------------------------------------- summations ---
  function totals() {
    var cart = Cart.get();
    var subtotal = cart.reduce(function (s, i) { return s + i.qty * i.price; }, 0);
    var fee = cart.length ? SERVICE_FEE : 0;
    return { cart: cart, subtotal: subtotal, fee: fee, total: subtotal + fee };
  }

  // ------------------------------------------------------------- render -----
  var rootRef;
  function root() {
    rootRef = rootRef || document.getElementById("order-main");
    return rootRef;
  }

  function render() {
    var r = root();
    r.textContent = "";
    if (state.stage === "cart") r.appendChild(renderCart());
    else if (state.stage === "checkout") r.appendChild(renderCheckout());
    else r.appendChild(renderConfirmed());
  }

  function heading(pre, mark) {
    return el("h1", null, [
      document.createTextNode(pre + " "),
      el("span", { class: "mark tilt-n", text: mark }),
    ]);
  }

  // ---- cart stage ----
  function renderCart() {
    var t = totals();
    var grid = el("div", { class: "order-grid" });

    var left = el("div");
    var h1 = el("h1", { class: "" });
    h1.style.fontFamily = "var(--font-display)";
    h1.style.fontWeight = "400";
    h1.style.fontSize = "var(--fs-h1)";
    h1.style.margin = "0 0 26px";
    h1.appendChild(document.createTextNode("YOUR "));
    h1.appendChild(el("span", { class: "mark tilt-n", text: "CART" }));
    left.appendChild(h1);

    if (t.cart.length) {
      var list = el("div", { class: "stack" });
      list.style.gap = "14px";
      t.cart.forEach(function (line) {
        list.appendChild(renderLine(line));
      });
      left.appendChild(list);
    } else {
      var empty = el("div", { class: "empty" }, [
        el("div", { class: "emoji", text: "🍽️" }),
        el("h2", { text: "NOTHING IN HERE YET" }),
        el("a", { class: "link-underline", href: "menu.html", text: "Browse the menu →" }),
      ]);
      left.appendChild(empty);
    }
    grid.appendChild(left);

    // summary
    var sum = el("aside", { class: "summary" }, [
      el("h2", { text: "ORDER SUMMARY" }),
      summaryRow("Subtotal", money(t.subtotal)),
      summaryRow("Service fee", money(t.fee)),
      el("div", { class: "rule" }),
      el("div", { class: "total" }, [el("span", { text: "TOTAL" }), el("span", { text: money(t.total) })]),
    ]);
    var checkoutBtn = el("button", { type: "button", class: "btn btn-red btn-block", text: "CHECKOUT →", disabled: !t.cart.length });
    checkoutBtn.addEventListener("click", function () {
      if (!Cart.get().length) return;
      state.stage = "checkout";
      render();
      window.scrollTo(0, 0);
    });
    sum.appendChild(checkoutBtn);
    grid.appendChild(sum);
    return grid;
  }

  function summaryRow(label, val) {
    return el("div", { class: "row" }, [el("span", { text: label }), el("span", { text: val })]);
  }

  function renderLine(line) {
    var info = el("div", null, [
      el("div", { class: "lname", text: line.name }),
      el("div", { class: "lmeta", text: money(line.price) + " each" }),
    ]);

    var minus = el("button", { type: "button", "aria-label": "Decrease quantity", text: "−" });
    minus.addEventListener("click", function () { Cart.changeQty(line.key, -1); });
    var plus = el("button", { type: "button", class: "plus", "aria-label": "Increase quantity", text: "+" });
    plus.addEventListener("click", function () { Cart.changeQty(line.key, 1); });
    var qty = el("div", { class: "qty" }, [minus, el("span", { class: "n", text: String(line.qty) }), plus]);

    var lineTotal = el("div", { class: "ltotal", text: money(line.price * line.qty) });
    var remove = el("button", { type: "button", class: "remove", "aria-label": "Remove " + line.name, text: "✕" });
    remove.addEventListener("click", function () { Cart.remove(line.key); });

    var controls = el("div", null, [qty]);
    controls.style.display = "flex";
    controls.style.alignItems = "center";
    controls.style.gap = "16px";
    controls.appendChild(lineTotal);
    controls.appendChild(remove);

    return el("div", { class: "line" }, [info, controls]);
  }

  // ---- checkout stage ----
  function renderCheckout() {
    if (!Cart.get().length) { state.stage = "cart"; return renderCart(); }
    var t = totals();
    var grid = el("div", { class: "order-grid checkout" });

    // left column
    var left = el("div", { class: "stack" });
    left.style.gap = "24px";

    var head = el("div");
    var h1 = el("h1");
    h1.style.cssText = "font-family:var(--font-display);font-weight:400;font-size:var(--fs-h1);margin:0 0 22px";
    h1.textContent = "CHECKOUT";
    head.appendChild(h1);

    // mode toggle
    var pickup = el("button", { type: "button", class: "mode-btn", "aria-pressed": state.mode === "pickup" ? "true" : "false", text: "🛍️ PICKUP" });
    var delivery = el("button", { type: "button", class: "mode-btn", "aria-pressed": state.mode === "delivery" ? "true" : "false", text: "🛵 DELIVERY" });
    pickup.addEventListener("click", function () { if (state.mode !== "pickup") { state.mode = "pickup"; render(); } });
    delivery.addEventListener("click", function () { if (state.mode !== "delivery") { state.mode = "delivery"; render(); } });
    head.appendChild(el("div", { class: "mode-toggle" }, [pickup, delivery]));
    left.appendChild(head);

    // details
    var details = el("div", { class: "field-card" }, [el("h3", { text: "YOUR DETAILS" })]);
    var dfields = el("div", { class: "fields" });
    dfields.appendChild(textField("name", "Full name", state.name, validName, "Enter your name"));
    dfields.appendChild(textField("phone", "Phone number", state.phone, validPhone, "Enter a valid phone number", "tel"));
    if (state.mode === "delivery") {
      dfields.appendChild(textField("address", "Delivery address", state.address, validAddress, "Enter your delivery address"));
    }
    details.appendChild(dfields);
    left.appendChild(details);

    // payment (demo)
    var pay = el("div", { class: "field-card" }, [el("h3", { text: "PAYMENT" })]);
    var pfields = el("div", { class: "fields" });
    pfields.appendChild(cardField());
    var prow = el("div", { class: "field-row" });
    prow.appendChild(formatField("expiry", "MM/YY", state.expiry, validExpiry, "MM/YY", formatExpiry));
    prow.appendChild(formatField("cvc", "CVC", state.cvc, validCvc, "3–4 digits", formatCvc));
    pfields.appendChild(prow);
    pay.appendChild(pfields);
    pay.appendChild(el("p", { class: "note", text: "🔒 Demo checkout — no real payment is processed and card details are never stored or sent." }));
    left.appendChild(pay);

    grid.appendChild(left);

    // right summary
    var sum = el("aside", { class: "summary" }, [el("h2", { text: "ORDER SUMMARY" })]);
    var lines = el("div", { class: "stack" });
    lines.style.gap = "9px";
    lines.style.marginBottom = "14px";
    t.cart.forEach(function (line) {
      lines.appendChild(el("div", { class: "lineitem" }, [
        el("span", { text: line.qty + "× " + line.name }),
        el("span", { text: money(line.price * line.qty) }),
      ]));
    });
    sum.appendChild(lines);
    sum.appendChild(summaryRow("Service fee", money(t.fee)));
    sum.appendChild(el("div", { class: "rule" }));
    sum.appendChild(el("div", { class: "total" }, [el("span", { text: "TOTAL" }), el("span", { text: money(t.total) })]));

    var place = el("button", { type: "button", class: "btn btn-red btn-block", text: "PLACE ORDER — " + money(t.total), disabled: !canPlace() });
    place.id = "place-btn";
    place.addEventListener("click", function () { if (canPlace()) placeOrder(); });
    sum.appendChild(place);

    var back = el("button", { type: "button", text: "← Back to cart" });
    back.style.cssText = "width:100%;background:none;border:none;color:var(--text-soft);padding:14px;font-weight:800;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;cursor:pointer";
    back.addEventListener("click", function () { state.stage = "cart"; render(); window.scrollTo(0, 0); });
    sum.appendChild(back);

    grid.appendChild(sum);
    return grid;
  }

  function refreshPlaceButton() {
    var btn = document.getElementById("place-btn");
    if (btn) { if (canPlace()) btn.removeAttribute("disabled"); else btn.setAttribute("disabled", ""); }
  }

  // a labelled text input bound to state[key]; shows error when invalid & non-empty
  function textField(key, placeholder, value, validate, errMsg, type) {
    var input = el("input", { type: type || "text", placeholder: placeholder, value: value, "aria-label": placeholder, autocomplete: autoComplete(key) });
    var err = el("div", { class: "field-error", text: errMsg });
    err.hidden = true;
    input.addEventListener("input", function () {
      state[key] = input.value;
      err.hidden = !(input.value.length && !validate(input.value));
      refreshPlaceButton();
    });
    return el("div", null, [input, err]);
  }

  // input with live formatting (card/expiry/cvc)
  function formatField(key, placeholder, value, validate, errMsg, formatter) {
    var input = el("input", { type: "text", inputmode: "numeric", placeholder: placeholder, value: value, "aria-label": placeholder, autocomplete: autoComplete(key) });
    var err = el("div", { class: "field-error", text: errMsg });
    err.hidden = true;
    input.addEventListener("input", function () {
      var f = formatter(input.value);
      input.value = f;
      state[key] = f;
      err.hidden = !(f.length && !validate(f));
      refreshPlaceButton();
    });
    return el("div", null, [input, err]);
  }

  function cardField() {
    return formatField("card", "Card number", state.card, validCard, "Enter a valid card number", formatCard);
  }

  function autoComplete(key) {
    return { name: "name", phone: "tel", address: "street-address", card: "cc-number", expiry: "cc-exp", cvc: "cc-csc" }[key] || "off";
  }

  function formatCard(v) {
    var d = digits(v).slice(0, 19);
    return d.replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(v) {
    var d = digits(v).slice(0, 4);
    if (d.length >= 3) return d.slice(0, 2) + "/" + d.slice(2);
    return d;
  }
  function formatCvc(v) { return digits(v).slice(0, 4); }

  // ---- place order ----
  function placeOrder() {
    var num = "K99-" + Math.floor(1000 + Math.random() * 9000);
    state.orderNumber = num;
    state.orderMode = state.mode === "delivery" ? "Delivery" : "Pickup";
    // wipe payment details from memory — never stored, never sent
    state.card = state.expiry = state.cvc = "";
    Cart.clear();
    state.stage = "confirmed";
    state.trackIdx = 0;
    render();
    window.scrollTo(0, 0);
    clearInterval(trackTimer);
    trackTimer = setInterval(function () {
      if (state.trackIdx >= TRACK.length - 1) { clearInterval(trackTimer); return; }
      state.trackIdx += 1;
      render();
    }, 3000);
  }

  // ---- confirmed stage ----
  function renderConfirmed() {
    var wrap = el("div", { class: "confirm" });

    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "88"); svg.setAttribute("height", "88");
    svg.setAttribute("viewBox", "0 0 86 86"); svg.setAttribute("class", "check-svg");
    svg.setAttribute("aria-hidden", "true");
    var circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", "43"); circle.setAttribute("cy", "43"); circle.setAttribute("r", "40");
    circle.setAttribute("fill", "#e02d26"); circle.setAttribute("stroke", "#111"); circle.setAttribute("stroke-width", "3");
    var path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M25 44 L38 57 L61 30"); path.setAttribute("stroke", "#fff");
    path.setAttribute("stroke-width", "6"); path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round"); path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(circle); svg.appendChild(path);
    wrap.appendChild(svg);

    wrap.appendChild(el("h1", { text: "ORDER CONFIRMED!" }));
    wrap.appendChild(el("p", { class: "meta", text: "Order #" + state.orderNumber + " · " + state.orderMode }));

    // tracking
    var track = el("div", { class: "track" }, [el("h2", { text: "📦 ORDER TRACKING" })]);
    var lineWrap = el("div", { class: "track-line" });
    var pct = (state.trackIdx / (TRACK.length - 1)) * 100;
    var bar = el("div", { class: "bar" });
    var fill = el("div", { class: "fill" });
    fill.style.width = pct + "%";
    lineWrap.appendChild(bar);
    lineWrap.appendChild(fill);
    TRACK.forEach(function (step, i) {
      var on = i <= state.trackIdx;
      lineWrap.appendChild(el("div", { class: "track-step" + (on ? " on" : "") }, [
        el("div", { class: "dot", text: step.icon }),
        el("div", { class: "label", text: step.label }),
      ]));
    });
    track.appendChild(lineWrap);

    var cur = TRACK[state.trackIdx];
    var msg = cur.msg || (state.orderMode === "Delivery" ? cur.msgDelivery : cur.msgPickup);
    track.appendChild(el("p", { class: "track-msg", text: msg }));
    wrap.appendChild(track);

    wrap.appendChild(el("a", { class: "link-underline", href: "menu.html", text: "← Order something else" }));
    wrap.firstChild; // noop
    var backLink = wrap.lastChild;
    backLink.style.display = "inline-block";
    backLink.style.marginTop = "30px";
    return wrap;
  }

  // ------------------------------------------------------------- boot -------
  // Re-render cart view live when the cart changes (only meaningful in cart stage).
  Cart.subscribe(function () {
    if (state.stage === "cart") render();
  });

  window.addEventListener("beforeunload", function () { clearInterval(trackTimer); });
})();
