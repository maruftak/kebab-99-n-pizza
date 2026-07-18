/* Cart module — localStorage-backed, tamper-validated, observable.
   No user-controlled HTML ever flows through here; callers render with textContent. */
(function () {
  "use strict";

  var KEY = "kebab99_cart";
  var MAX_QTY = 99;
  var listeners = [];

  function isFiniteNum(n) {
    return typeof n === "number" && isFinite(n);
  }

  // Coerce an arbitrary parsed value into a safe cart line, or null if invalid.
  function sanitizeLine(raw) {
    if (!raw || typeof raw !== "object") return null;
    var key = typeof raw.key === "string" ? raw.key.slice(0, 120) : null;
    var name = typeof raw.name === "string" ? raw.name.slice(0, 160) : null;
    var price = isFiniteNum(raw.price) ? raw.price : NaN;
    var qty = Math.floor(raw.qty);
    if (!key || !name) return null;
    if (!isFiniteNum(price) || price < 0 || price > 100000) return null;
    if (!isFiniteNum(qty) || qty < 1) return null;
    if (qty > MAX_QTY) qty = MAX_QTY;
    return { key: key, name: name, price: price, qty: qty };
  }

  function read() {
    var arr;
    try {
      arr = JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch (e) {
      arr = [];
    }
    if (!Array.isArray(arr)) return [];
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      var line = sanitizeLine(arr[i]);
      if (line) out.push(line);
    }
    return out;
  }

  function write(cart) {
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
    } catch (e) {
      /* storage full / unavailable — cart stays in-memory for this view */
    }
    emit(cart);
  }

  function emit(cart) {
    for (var i = 0; i < listeners.length; i++) {
      try {
        listeners[i](cart);
      } catch (e) {}
    }
  }

  var Cart = {
    get: function () {
      return read();
    },
    count: function () {
      return read().reduce(function (s, i) {
        return s + i.qty;
      }, 0);
    },
    subtotal: function () {
      return read().reduce(function (s, i) {
        return s + i.qty * i.price;
      }, 0);
    },
    add: function (line) {
      var safe = sanitizeLine(line);
      if (!safe) return;
      var cart = read();
      var existing = null;
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].key === safe.key) {
          existing = cart[i];
          break;
        }
      }
      if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + safe.qty);
      else cart.push(safe);
      write(cart);
    },
    changeQty: function (key, delta) {
      var cart = read().map(function (i) {
        if (i.key !== key) return i;
        return { key: i.key, name: i.name, price: i.price, qty: Math.max(1, Math.min(MAX_QTY, i.qty + delta)) };
      });
      write(cart);
    },
    remove: function (key) {
      write(
        read().filter(function (i) {
          return i.key !== key;
        })
      );
    },
    clear: function () {
      try {
        localStorage.removeItem(KEY);
      } catch (e) {}
      emit([]);
    },
    // subscribe(fn) -> returns unsubscribe. Fires immediately with current cart.
    subscribe: function (fn) {
      listeners.push(fn);
      try {
        fn(read());
      } catch (e) {}
      return function () {
        var idx = listeners.indexOf(fn);
        if (idx > -1) listeners.splice(idx, 1);
      };
    },
  };

  // Keep tabs in sync.
  window.addEventListener("storage", function (e) {
    if (e.key === KEY) emit(read());
  });

  window.Cart = Cart;
})();
