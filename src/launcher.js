(function initLauncher() {
  const button = document.getElementById("openPanel");
  const status = document.getElementById("status");

  button.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
      status.textContent = "未找到当前页面。";
      return;
    }

    try {
      const response = await chrome.tabs.sendMessage(tab.id, { type: "PROMPT_STUDIO_TOGGLE_PANEL" });
      if (response && response.ok) {
        window.close();
      } else {
        status.textContent = "当前网站未启用。";
      }
    } catch (error) {
      status.textContent = "请刷新页面后再打开。";
    }
  });
})();
