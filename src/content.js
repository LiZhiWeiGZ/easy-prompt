(function initContentScript() {
  let lastFocusedElement = null;
  const supportedAiHosts = [
    "chatgpt.com",
    "chat.openai.com",
    "claude.ai",
    "gemini.google.com",
    "aistudio.google.com",
    "kimi.moonshot.cn",
    "doubao.com",
    "yuanbao.tencent.com",
    "tongyi.com",
    "tongyi.aliyun.com",
    "qianwen.aliyun.com",
    "deepseek.com",
    "chat.deepseek.com",
    "poe.com",
    "perplexity.ai",
    "copilot.microsoft.com",
    "grok.com",
    "chatglm.cn",
    "z.ai"
  ];

  function isSupportedAiHost(hostname) {
    return supportedAiHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`));
  }

  document.addEventListener(
    "focusin",
    (event) => {
      if (isEditable(event.target)) {
        lastFocusedElement = event.target;
      }
    },
    true
  );

  function isEditable(element) {
    if (!element) {
      return false;
    }
    const tag = element.tagName ? element.tagName.toLowerCase() : "";
    return (
      tag === "textarea" ||
      (tag === "input" && /^(text|search|url)$/i.test(element.type || "text")) ||
      element.isContentEditable ||
      element.getAttribute("role") === "textbox"
    );
  }

  function findEditableTarget() {
    if (isEditable(lastFocusedElement)) {
      return lastFocusedElement;
    }
    if (isEditable(document.activeElement)) {
      return document.activeElement;
    }
    const selectors = [
      "textarea",
      "input[type='text']",
      "div[contenteditable='true']",
      "div.ProseMirror",
      "[role='textbox']"
    ];
    for (const selector of selectors) {
      const node = document.querySelector(selector);
      if (isEditable(node)) {
        return node;
      }
    }
    return null;
  }

  function insertIntoElement(element, text) {
    if (!element) {
      return false;
    }

    if (element.tagName && element.tagName.toLowerCase() === "textarea") {
      element.focus();
      element.value = text;
      element.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    }

    if (element.tagName && element.tagName.toLowerCase() === "input") {
      element.focus();
      element.value = text;
      element.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    }

    if (element.isContentEditable) {
      element.focus();
      element.textContent = text;
      element.dispatchEvent(new InputEvent("input", { bubbles: true, data: text, inputType: "insertText" }));
      return true;
    }

    if (element.getAttribute("role") === "textbox") {
      element.focus();
      element.textContent = text;
      element.dispatchEvent(new InputEvent("input", { bubbles: true, data: text, inputType: "insertText" }));
      return true;
    }

    return false;
  }

  function showToast(message) {
    const existing = document.getElementById("prompt-studio-toast");
    if (existing) {
      existing.remove();
    }
    const toast = document.createElement("div");
    toast.id = "prompt-studio-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2400);
  }

  function closePanel() {
    const panel = document.getElementById("prompt-studio-panel");
    if (panel) {
      panel.remove();
    }
    const fab = document.getElementById("prompt-studio-fab");
    if (fab) {
      fab.classList.remove("active");
      fab.setAttribute("aria-expanded", "false");
    }
  }

  function removeFab() {
    const fab = document.getElementById("prompt-studio-fab");
    if (fab) {
      fab.remove();
    }
  }

  function togglePanel() {
    if (!isSupportedAiHost(window.location.hostname)) {
      closePanel();
      removeFab();
      return false;
    }

    const existing = document.getElementById("prompt-studio-panel");
    if (existing) {
      closePanel();
      return true;
    }

    const panel = document.createElement("section");
    panel.id = "prompt-studio-panel";
    panel.setAttribute("aria-label", "Prompt Studio");

    const header = document.createElement("div");
    header.id = "prompt-studio-panel-header";

    const title = document.createElement("span");
    title.className = "prompt-studio-panel-title";
    title.textContent = "Prompt Studio";

    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", "关闭 Prompt Studio");
    close.addEventListener("click", closePanel);

    const iframe = document.createElement("iframe");
    iframe.id = "prompt-studio-frame";
    iframe.src = `${chrome.runtime.getURL("popup.html")}?compact=1&v=${encodeURIComponent(chrome.runtime.getManifest().version)}`;
    iframe.title = "Prompt Studio";
    iframe.allow = "clipboard-write";

    header.append(title, close);
    panel.append(header, iframe);
    document.body.appendChild(panel);

    const fab = document.getElementById("prompt-studio-fab");
    if (fab) {
      fab.classList.add("active");
      fab.setAttribute("aria-expanded", "true");
    }
    return true;
  }

  async function maybeRenderFab() {
    if (!isSupportedAiHost(window.location.hostname)) {
      closePanel();
      removeFab();
      return;
    }

    const saved = await chrome.storage.sync.get("promptStudioOptions");
    const enabled = saved.promptStudioOptions?.enableFloatingButton !== false;
    if (!enabled || document.getElementById("prompt-studio-fab")) {
      return;
    }
    const fab = document.createElement("button");
    fab.id = "prompt-studio-fab";
    fab.type = "button";
    fab.setAttribute("aria-expanded", "false");
    fab.setAttribute("aria-controls", "prompt-studio-panel");
    fab.setAttribute("aria-label", "打开 Prompt Studio");

    const icon = document.createElement("span");
    icon.className = "prompt-studio-fab-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "✦";

    const text = document.createElement("span");
    text.className = "prompt-studio-fab-text";
    text.textContent = "Prompt";

    fab.append(icon, text);
    fab.addEventListener("click", togglePanel);
    document.body.appendChild(fab);
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "PROMPT_STUDIO_TOGGLE_PANEL") {
      sendResponse({ ok: togglePanel() });
      return;
    }

    if (message.type !== "PROMPT_STUDIO_INSERT") {
      return;
    }
    const target = findEditableTarget();
    const ok = insertIntoElement(target, message.prompt || "");
    sendResponse({ ok });
  });

  window.addEventListener("message", (event) => {
    if (event.source !== document.getElementById("prompt-studio-frame")?.contentWindow) {
      return;
    }
    if (event.data?.source !== "PROMPT_STUDIO") {
      return;
    }

    if (event.data?.type === "PROMPT_STUDIO_COPY_SUCCESS") {
      showToast("复制成功。");
      return;
    }

    if (event.data?.type !== "PROMPT_STUDIO_INSERT_DIRECT") {
      return;
    }

    const target = findEditableTarget();
    const ok = insertIntoElement(target, event.data.prompt || "");
    showToast(ok ? "已插入 Prompt。" : "没有找到可输入的位置，请先点击聊天输入框。");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePanel();
    }
  });

  maybeRenderFab();
})();
