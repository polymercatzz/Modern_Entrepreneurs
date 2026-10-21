/* Modern Entrepreneurs — สารบัญ, ข้อสอบ และคะแนนสูงสุด */
(function () {
  "use strict";

  var LETTERS = ["ก", "ข", "ค", "ง"];
  var KEY_PREFIX = "modern-best-";

  function getBest(id) {
    try {
      var v = localStorage.getItem(KEY_PREFIX + id);
      return v === null ? null : JSON.parse(v);
    } catch (e) {
      return null;
    }
  }

  function saveBest(id, score, total) {
    var prev = getBest(id);
    if (prev && prev.score >= score) return prev;
    var rec = { score: score, total: total };
    try {
      localStorage.setItem(KEY_PREFIX + id, JSON.stringify(rec));
    } catch (e) { /* ไม่มี storage ก็ข้ามไป */ }
    return rec;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------- สารบัญในบท ---------- */
  function buildToc() {
    var list = document.querySelector("#toc ol");
    if (!list) return;
    var heads = document.querySelectorAll("main section.topic[id] > h2");
    heads.forEach(function (h) {
      var li = el("li");
      var a = el("a", null, h.textContent);
      a.href = "#" + h.parentElement.id;
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  /* ---------- ข้อสอบ ---------- */
  function renderQuiz() {
    var data = window.QUIZ;
    var box = document.getElementById("quiz-body");
    if (!data || !box) return;

    var total = data.questions.length;
    var answered = 0;
    var score = 0;
    var progress = document.getElementById("quiz-progress");
    var bestEl = document.getElementById("quiz-best");

    function showBest() {
      var b = getBest(data.id);
      if (bestEl) bestEl.textContent = b ? "คะแนนสูงสุด " + b.score + "/" + b.total : "";
    }

    function updateProgress() {
      if (progress) progress.textContent = "ตอบแล้ว " + answered + "/" + total + " · ถูก " + score;
    }

    box.innerHTML = "";
    showBest();
    updateProgress();

    data.questions.forEach(function (item, qi) {
      var wrap = el("div", "question");
      var qText = el("p", "q-text");
      qText.appendChild(el("span", "q-num", (qi + 1) + "."));
      qText.appendChild(document.createTextNode(item.q));
      wrap.appendChild(qText);

      var choicesBox = el("div", "choices");
      var buttons = item.choices.map(function (c, ci) {
        var b = el("button", "choice");
        b.type = "button";
        b.appendChild(el("span", "letter", LETTERS[ci]));
        b.appendChild(el("span", null, c));
        b.addEventListener("click", function () { pick(ci); });
        choicesBox.appendChild(b);
        return b;
      });
      wrap.appendChild(choicesBox);
      box.appendChild(wrap);

      function pick(ci) {
        var right = ci === item.answer;
        buttons.forEach(function (b, bi) {
          b.disabled = true;
          if (bi === item.answer) b.classList.add("correct");
          else if (bi === ci) b.classList.add("wrong");
        });
        var ex = el("div", "explain " + (right ? "ok" : "bad"));
        ex.appendChild(el("span", "verdict",
          right ? "ถูกต้อง ✓ " : "ยังไม่ถูก ✗ คำตอบคือ " + LETTERS[item.answer] + " "));
        ex.appendChild(document.createTextNode(item.explain + " "));
        if (item.ref) ex.appendChild(el("span", "ref", "(" + item.ref + ")"));
        wrap.appendChild(ex);

        answered++;
        if (right) score++;
        updateProgress();
        if (answered === total) finish();
      }
    });

    function finish() {
      var best = saveBest(data.id, score, total);
      showBest();
      var res = el("div", "result");
      res.appendChild(el("div", null, "คะแนนของคุณ"));
      res.appendChild(el("div", "score", score + " / " + total));
      var msg = score === total ? "เยี่ยมมาก ได้เต็ม!"
        : score >= total * 0.7 ? "ดีมาก ทบทวนข้อที่ผิดอีกนิด"
        : "ลองอ่านสรุปอีกรอบแล้วทำใหม่";
      res.appendChild(el("div", null, msg + " (คะแนนสูงสุด " + best.score + "/" + best.total + ")"));
      var again = el("button", "btn", "ทำใหม่");
      again.type = "button";
      again.addEventListener("click", function () {
        renderQuiz();
        document.getElementById("quiz").scrollIntoView();
      });
      res.appendChild(again);
      box.appendChild(res);
    }
  }

  /* ---------- หน้ารวม: แสดงคะแนนสูงสุด ---------- */
  function fillIndexScores() {
    document.querySelectorAll("[data-best]").forEach(function (n) {
      var b = getBest(n.getAttribute("data-best"));
      n.textContent = b ? "คะแนนสูงสุด " + b.score + "/" + b.total : "ยังไม่ได้ทำข้อสอบ";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildToc();
    renderQuiz();
    fillIndexScores();
  });
})();
