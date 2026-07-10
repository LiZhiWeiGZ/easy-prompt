(function initOptions() {
  const { platforms, defaultOptions } = window.PromptStudioData;

  const fields = {
    defaultPlatform: document.getElementById("defaultPlatform"),
    enableFloatingButton: document.getElementById("enableFloatingButton"),
    status: document.getElementById("status")
  };

  function populateSelect(select, items) {
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name;
      select.appendChild(option);
    });
  }

  async function loadOptions() {
    const saved = await chrome.storage.sync.get("promptStudioOptions");
    const options = saved.promptStudioOptions || defaultOptions;

    fields.defaultPlatform.value = options.defaultPlatform || defaultOptions.defaultPlatform;
    fields.enableFloatingButton.checked = options.enableFloatingButton !== false;
  }

  async function saveOptions() {
    const nextOptions = {
      defaultPlatform: fields.defaultPlatform.value,
      enableFloatingButton: fields.enableFloatingButton.checked
    };

    await chrome.storage.sync.set({ promptStudioOptions: nextOptions });
    fields.status.textContent = "设置已保存。";
  }

  populateSelect(fields.defaultPlatform, platforms);
  document.getElementById("save").addEventListener("click", saveOptions);

  loadOptions();
})();
