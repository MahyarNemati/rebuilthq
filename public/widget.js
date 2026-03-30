(function() {
  "use strict";

  var WIDGET_HOST = document.currentScript?.getAttribute("data-host") || "https://rebuilthq.com";
  var TENANT = document.currentScript?.getAttribute("data-tenant") || "default";
  var COLOR = document.currentScript?.getAttribute("data-color") || "#8b5cf6";
  var GREETING = document.currentScript?.getAttribute("data-greeting") || "Hi! How can I help you?";
  var TITLE = document.currentScript?.getAttribute("data-title") || "AI Assistant";

  var sessionId = localStorage.getItem("rebuilthq_session_" + TENANT);
  if (!sessionId) {
    sessionId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    localStorage.setItem("rebuilthq_session_" + TENANT, sessionId);
  }

  var isOpen = false;
  var messages = [{ role: "assistant", content: GREETING }];
  var isLoading = false;

  // Create container
  var container = document.createElement("div");
  container.id = "rebuilthq-widget";
  document.body.appendChild(container);

  // Styles
  var style = document.createElement("style");
  style.textContent = [
    "#rebuilthq-widget * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }",
    ".rhq-btn { position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; border-radius: 50%; background: " + COLOR + "; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px " + COLOR + "40; z-index: 99999; transition: transform 0.2s; }",
    ".rhq-btn:hover { transform: scale(1.1); }",
    ".rhq-chat { position: fixed; bottom: 24px; right: 24px; width: 380px; height: 520px; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 16px; overflow: hidden; z-index: 99999; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.5); animation: rhq-slide 0.3s ease; }",
    "@keyframes rhq-slide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }",
    ".rhq-header { padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg, " + COLOR + "15, " + COLOR + "05); }",
    ".rhq-header-left { display: flex; align-items: center; gap: 12px; }",
    ".rhq-avatar { width: 36px; height: 36px; border-radius: 10px; background: " + COLOR + "; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 700; }",
    ".rhq-title { font-size: 14px; font-weight: 600; color: #f5f5f5; }",
    ".rhq-status { font-size: 11px; color: #666; display: flex; align-items: center; gap: 6px; }",
    ".rhq-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; display: inline-block; }",
    ".rhq-close { width: 32px; height: 32px; border-radius: 8px; border: none; background: transparent; cursor: pointer; color: #666; font-size: 16px; display: flex; align-items: center; justify-content: center; }",
    ".rhq-close:hover { background: rgba(255,255,255,0.05); color: white; }",
    ".rhq-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }",
    ".rhq-msg { max-width: 80%; padding: 10px 14px; border-radius: 16px; font-size: 14px; line-height: 1.5; word-wrap: break-word; }",
    ".rhq-msg-user { align-self: flex-end; background: " + COLOR + "; color: white; border-bottom-right-radius: 4px; }",
    ".rhq-msg-bot { align-self: flex-start; background: #161616; color: #ccc; border: 1px solid #222; border-bottom-left-radius: 4px; }",
    ".rhq-typing { display: flex; gap: 6px; padding: 4px 0; }",
    ".rhq-typing span { width: 8px; height: 8px; border-radius: 50%; background: #444; animation: rhq-bounce 1.4s infinite; display: inline-block; }",
    ".rhq-typing span:nth-child(2) { animation-delay: 0.15s; }",
    ".rhq-typing span:nth-child(3) { animation-delay: 0.3s; }",
    "@keyframes rhq-bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }",
    ".rhq-input-wrap { padding: 12px 16px 16px; }",
    ".rhq-input-row { display: flex; gap: 8px; align-items: center; background: #111; border: 1px solid #222; border-radius: 12px; padding: 4px 12px; }",
    ".rhq-input-row:focus-within { border-color: #333; }",
    ".rhq-input { flex: 1; background: transparent; border: none; outline: none; color: white; font-size: 14px; padding: 10px 0; }",
    ".rhq-input::placeholder { color: #444; }",
    ".rhq-send { width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; background: transparent; transition: background 0.2s; }",
    ".rhq-powered { text-align: center; font-size: 10px; color: #333; margin-top: 8px; }"
  ].join("\n");
  document.head.appendChild(style);

  function createEl(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function(key) {
        if (key === "className") el.className = attrs[key];
        else if (key.startsWith("on")) el.addEventListener(key.slice(2).toLowerCase(), attrs[key]);
        else el.setAttribute(key, attrs[key]);
      });
    }
    if (typeof children === "string") el.textContent = children;
    else if (Array.isArray(children)) children.forEach(function(c) { if (c) el.appendChild(c); });
    return el;
  }

  function createSVG(path) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.style.fill = "none";
    svg.style.stroke = "white";
    svg.style.strokeWidth = "2";
    var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", path);
    svg.appendChild(p);
    return svg;
  }

  function render() {
    container.replaceChildren();

    if (!isOpen) {
      var btn = createEl("button", { className: "rhq-btn", onClick: function() { isOpen = true; render(); } });
      var svg = createSVG("M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z");
      svg.setAttribute("width", "24");
      svg.setAttribute("height", "24");
      btn.appendChild(svg);
      container.appendChild(btn);
      return;
    }

    // Build chat window using safe DOM methods
    var chat = createEl("div", { className: "rhq-chat" });

    // Header
    var header = createEl("div", { className: "rhq-header" });
    var headerLeft = createEl("div", { className: "rhq-header-left" });
    headerLeft.appendChild(createEl("div", { className: "rhq-avatar" }, "AI"));
    var headerInfo = createEl("div", null);
    headerInfo.appendChild(createEl("div", { className: "rhq-title" }, TITLE));
    var statusDiv = createEl("div", { className: "rhq-status" });
    statusDiv.appendChild(createEl("span", { className: "rhq-dot" }));
    statusDiv.appendChild(document.createTextNode(" Online"));
    headerInfo.appendChild(statusDiv);
    headerLeft.appendChild(headerInfo);
    header.appendChild(headerLeft);
    var closeBtn = createEl("button", { className: "rhq-close", onClick: function() { isOpen = false; render(); } }, "\u2715");
    header.appendChild(closeBtn);
    chat.appendChild(header);

    // Messages
    var msgsDiv = createEl("div", { className: "rhq-messages" });
    messages.forEach(function(m) {
      var cls = m.role === "user" ? "rhq-msg rhq-msg-user" : "rhq-msg rhq-msg-bot";
      msgsDiv.appendChild(createEl("div", { className: cls }, m.content));
    });
    if (isLoading) {
      var loadingMsg = createEl("div", { className: "rhq-msg rhq-msg-bot" });
      var typing = createEl("div", { className: "rhq-typing" }, [
        createEl("span"), createEl("span"), createEl("span")
      ]);
      loadingMsg.appendChild(typing);
      msgsDiv.appendChild(loadingMsg);
    }
    chat.appendChild(msgsDiv);

    // Input
    var inputWrap = createEl("div", { className: "rhq-input-wrap" });
    var inputRow = createEl("div", { className: "rhq-input-row" });
    var input = createEl("input", { className: "rhq-input", placeholder: "Type a message..." });
    input.addEventListener("keydown", function(e) { if (e.key === "Enter") sendMessage(input); });
    inputRow.appendChild(input);
    var sendBtn = createEl("button", { className: "rhq-send", onClick: function() { sendMessage(input); } });
    sendBtn.style.background = COLOR;
    var sendSvg = createSVG("M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z");
    sendSvg.setAttribute("width", "16");
    sendSvg.setAttribute("height", "16");
    sendBtn.appendChild(sendSvg);
    inputRow.appendChild(sendBtn);
    inputWrap.appendChild(inputRow);
    inputWrap.appendChild(createEl("div", { className: "rhq-powered" }, "Powered by RebuiltHQ + Claude"));
    chat.appendChild(inputWrap);

    container.appendChild(chat);
    msgsDiv.scrollTop = msgsDiv.scrollHeight;
    input.focus();
  }

  async function sendMessage(inputEl) {
    var text = inputEl.value.trim();
    if (!text || isLoading) return;

    messages.push({ role: "user", content: text });
    isLoading = true;
    render();

    try {
      var res = await fetch(WIDGET_HOST + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantSlug: TENANT, sessionId: sessionId, message: text })
      });
      var data = await res.json();
      messages.push({ role: "assistant", content: data.success ? data.message : "Sorry, something went wrong." });
    } catch(e) {
      messages.push({ role: "assistant", content: "Connection error. Please try again." });
    }

    isLoading = false;
    render();
  }

  render();
})();
