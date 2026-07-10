(function initPopup() {
  const { platforms, defaultOptions } = window.PromptStudioData;
  const rolePresets = window.PromptStudioData.rolePresets || [];
  const { buildTechniquePrompt } = window.PromptStudioEngine;
  const params = new URLSearchParams(window.location.search);
  const isCompactMode = params.get("compact") === "1";

  if (isCompactMode) {
    document.body.classList.add("compact-mode");
  }

  const techniques = [
    {
      id: "role_prompt",
      name: "角色库",
      category: "对话开场",
      description: "用于对话开始。先让 AI 明确扮演哪类专业角色，再约束它严谨、简洁、不编造、边界清楚，后续对话就更像在和专业人士交流。",
      fields: [
        ["rolePreset", "选择角色", "role-tags", "", rolePresets]
      ]
    },
    {
      id: "universal",
      name: "万能公式",
      category: "基础",
      description: "把 AI 当成一个聪明但不了解上下文的新同事。角色、任务、背景、格式、限制交代清楚后，它才知道该站在什么身份、为谁、按什么标准完成任务。",
      fields: [
        ["role", "角色", "input", "例如：资深产品经理"],
        ["task", "任务", "textarea", "例如：分析这个功能需求的可行性"],
        ["background", "背景", "textarea", "我们是谁、目标用户是谁、当前约束是什么"],
        ["format", "格式", "textarea", "例如：分为优势 / 风险 / 建议三块"],
        ["limits", "限制", "textarea", "例如：300 字以内，不要空话"]
      ]
    },
    {
      id: "reason",
      name: "说原因",
      category: "进阶技巧",
      description: "只说要求，AI 只能机械执行；补上原因后，它能理解你的真实目标，并主动避开你没逐条写出的细节问题。",
      fields: [
        ["requirement", "要求", "textarea", "你希望 AI 做什么"],
        ["reason", "原因", "textarea", "为什么要这样做"],
        ["task", "具体任务", "textarea", "这次要处理的具体内容"],
        ["extra", "补充限制", "textarea", "可选，例如语气、字数、边界"]
      ]
    },
    {
      id: "examples",
      name: "给示例",
      category: "进阶技巧",
      description: "当你很难描述风格、格式或详略程度时，直接给一组输入和输出示例。AI 会从示例里学习你要的结构、语气和用词习惯。",
      fields: [
        ["task", "任务", "textarea", "你希望 AI 根据示例完成什么"],
        ["examples", "示例", "textarea", "输入：...\n输出：..."],
        ["content", "待处理内容", "textarea", "粘贴这次需要处理的内容"],
        ["format", "输出要求", "textarea", "说明要保留哪些格式、风格、语气"]
      ]
    },
    {
      id: "step_by_step",
      name: "分步思考",
      category: "进阶技巧",
      description: "复杂分析如果让 AI 一步给答案，容易泛化和漏角度。要求它按步骤拆解问题，可以让结论更有依据，适合判断、对比和决策。",
      fields: [
        ["question", "问题", "textarea", "需要分析或决策的问题"],
        ["context", "背景", "textarea", "相关事实、约束、目标"],
        ["steps", "分析步骤", "textarea", "例如：先拆问题，再列因素，再给结论"],
        ["format", "输出格式", "textarea", "例如：过程 + 结论 + 建议"]
      ]
    },
    {
      id: "long_context",
      name: "长文后问",
      category: "进阶技巧",
      description: "处理长文时，先放材料、最后提问题，能让 AI 带着最后的问题回看前文。适合报告总结、会议纪要、长文章提炼。",
      fields: [
        ["content", "长内容", "textarea", "先粘贴文档、报告、文章或会议记录"],
        ["question", "最后的问题", "textarea", "请根据以上内容总结 3 个核心结论"],
        ["format", "输出格式", "textarea", "例如：每条不超过 50 字"],
        ["limits", "限制", "textarea", "例如：只基于原文，不要补充外部信息"]
      ]
    },
    {
      id: "output_format",
      name: "指定格式",
      category: "进阶技巧",
      description: "Prompt 不只要说明内容，还要说明结果怎么呈现。明确字段、表格或模板后，输出会更容易直接使用。",
      fields: [
        ["task", "任务", "textarea", "要 AI 完成什么"],
        ["columns", "字段 / 模板", "textarea", "例如：竞品名称 / 优势 / 价格 / 适合场景"],
        ["content", "输入内容", "textarea", "需要被整理、分析或改写的内容"],
        ["rules", "格式规则", "textarea", "例如：用表格；按重要性排序；每条一句话"]
      ]
    },
    {
      id: "negative",
      name: "不要做什么",
      category: "进阶技巧",
      description: "AI 有默认表达习惯，比如加总结、写背景、说套话。把不要做的事列出来，可以给输出划边界，减少无关内容。",
      fields: [
        ["task", "任务", "textarea", "要 AI 做的事"],
        ["content", "输入内容", "textarea", "可选，粘贴待处理内容"],
        ["dont", "不要做的事", "textarea", "不要写背景介绍\n不要用套话\n不要超过 3 个要点"],
        ["format", "输出格式", "textarea", "你希望最终长什么样"]
      ]
    },
    {
      id: "prompt_chain",
      name: "Prompt 链",
      category: "高级用法",
      description: "大任务一次塞给 AI，结果通常每一步都不够细。把任务拆成流水线，让前一步产出成为下一步输入，质量更稳定。",
      fields: [
        ["goal", "最终目标", "textarea", "例如：写一篇公众号文章"],
        ["material", "已有材料", "textarea", "主题、素材、限制、参考资料"],
        ["stages", "希望拆成几步", "input", "例如：选题 / 大纲 / 逐节写 / 整合"],
        ["output", "每步产出", "textarea", "说明每一步应该输出什么"]
      ]
    },
    {
      id: "self_critique",
      name: "反驳自己",
      category: "高级用法",
      description: "AI 往往会顺着你的提问回答。让它站到反对者或评审视角挑刺，可以暴露方案风险、盲区和失败原因。",
      fields: [
        ["topic", "分析对象", "textarea", "一个方案、判断、需求或观点"],
        ["position", "初始立场", "textarea", "你希望它先从哪个角度分析"],
        ["critique", "挑刺要求", "textarea", "例如：列出 3 个最大风险和失败原因"],
        ["final", "最终输出", "textarea", "例如：修正后的建议和取舍"]
      ]
    },
    {
      id: "multi_role",
      name: "多角色视角",
      category: "高级用法",
      description: "涉及多方利益时，单一视角容易偏。让 AI 分别扮演产品、法务、运营等角色，可以提前看到不同部门会关心的问题。",
      fields: [
        ["topic", "要分析的事", "textarea", "例如：上线匿名评论功能"],
        ["roles", "角色列表", "textarea", "产品经理\n法务\n用户运营"],
        ["focus", "每个角色关注点", "textarea", "价值、风险、影响、建议"],
        ["decision", "综合决策要求", "textarea", "最后给一个综合建议"]
      ]
    },
    {
      id: "meta_prompt",
      name: "让 AI 写 Prompt",
      category: "高级用法",
      description: "当你知道目标但不知道怎么写 Prompt 时，可以让 AI 先设计 Prompt。它通常会补齐角色、任务、格式和限制，你再调整细节。",
      fields: [
        ["goal", "我想让 AI 做什么", "textarea", "例如：帮我分析竞品"],
        ["known", "我已知的信息", "textarea", "已有素材、目标、边界"],
        ["quality", "好结果标准", "textarea", "怎样的输出算好"],
        ["format", "Prompt 输出格式", "textarea", "例如：角色 / 任务 / 背景 / 格式 / 限制"]
      ]
    },
    {
      id: "interview",
      name: "AI 采访我",
      category: "高级用法",
      description: "方向不清楚时，不要急着让 AI 给答案。让它一次问一个关键问题，可以逼你补充背景，逐步把模糊需求变清楚。",
      fields: [
        ["role", "采访角色", "input", "例如：顶级创业导师"],
        ["goal", "澄清目标", "textarea", "例如：帮我厘清创业方向"],
        ["known", "当前情况", "textarea", "你已经知道或困惑的内容"],
        ["rules", "提问规则", "textarea", "一次只问一个问题；等我回答后再继续"]
      ]
    },
    {
      id: "pressure",
      name: "给 AI 压力",
      category: "高级用法",
      description: "AI 默认容易给安全但普通的答案。提高评审标准、要求非常规角度，可以推动它给出更深入、更有取舍的回答。",
      fields: [
        ["task", "任务", "textarea", "需要 AI 重新回答或深入回答的问题"],
        ["standard", "高标准", "textarea", "例如：假设会被严苛专家审查"],
        ["angle", "非常规角度", "textarea", "例如：给出普通人想不到的深度见解"],
        ["limits", "限制", "textarea", "必须有逻辑支撑，不要空泛"]
      ]
    },
    {
      id: "iteration",
      name: "迭代修改",
      category: "高级用法",
      description: "第一版不满意时，不要换新话题。指出具体问题并继续改，能保留上下文，让 AI 沿着已确认的方向打磨结果。",
      fields: [
        ["draft", "已有回答", "textarea", "粘贴 AI 第一版回答或草稿"],
        ["problem", "具体问题", "textarea", "指出哪里不对：太泛、太长、语气不对、遗漏重点"],
        ["direction", "修改方向", "textarea", "希望它怎么改"],
        ["keep", "必须保留", "textarea", "哪些内容、结构或约束不能改"]
      ]
    }
  ];

  const state = {
    activeTechnique: "role_prompt",
    selectedRolePreset: rolePresets[0]?.id || ""
  };

  const fields = {
    platform: document.getElementById("platform"),
    includePlatform: document.getElementById("includePlatform"),
    tabs: document.getElementById("techniqueTabs"),
    form: document.getElementById("techniqueForm"),
    result: document.getElementById("result"),
    status: document.getElementById("status")
  };

  function setStatus(text) {
    fields.status.textContent = text;
  }

  function showToast(text) {
    const existing = document.querySelector(".prompt-studio-toast");
    if (existing) {
      existing.remove();
    }
    const toast = document.createElement("div");
    toast.className = "prompt-studio-toast";
    toast.textContent = text;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 1800);
  }

  function populateSelect(select, items) {
    select.innerHTML = "";
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name;
      select.appendChild(option);
    });
  }

  function renderTabs() {
    fields.tabs.innerHTML = "";
    let lastCategory = "";
    techniques.forEach((technique) => {
      if (technique.category !== lastCategory) {
        const group = document.createElement("div");
        group.className = "tab-group";
        group.textContent = technique.category;
        fields.tabs.appendChild(group);
        lastCategory = technique.category;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = technique.id === state.activeTechnique ? "tab active" : "tab";
      button.dataset.technique = technique.id;
      button.textContent = technique.name;
      button.addEventListener("click", () => {
        state.activeTechnique = technique.id;
        renderTabs();
        renderForm();
        fields.result.value = "";
        setStatus("");
        if (state.activeTechnique === "role_prompt") {
          previewCurrentPrompt();
        }
      });
      fields.tabs.appendChild(button);
    });
  }

  function renderForm() {
    const technique = techniques.find((item) => item.id === state.activeTechnique) || techniques[0];
    fields.form.innerHTML = "";

    const description = document.createElement("section");
    description.className = "technique-note";

    const title = document.createElement("strong");
    title.textContent = technique.name;

    const text = document.createElement("p");
    text.textContent = technique.description;

    description.append(title, text);
    fields.form.appendChild(description);

    technique.fields.forEach(([id, label, type, placeholder, options = []]) => {
      const wrapper = document.createElement("label");
      wrapper.className = "field";

      const labelNode = document.createElement("span");
      labelNode.textContent = label;
      wrapper.appendChild(labelNode);

      if (type === "role-tags") {
        const group = document.createElement("div");
        group.className = "role-tags";
        group.dataset.field = id;

        options.forEach((item) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = item.id === state.selectedRolePreset ? "role-tag active" : "role-tag";
          button.dataset.rolePreset = item.id;

          const name = document.createElement("span");
          name.className = "role-name";
          name.textContent = item.name;

          const summary = document.createElement("span");
          summary.className = "role-summary";
          summary.textContent = item.scope;

          button.append(name, summary);
          button.addEventListener("click", () => {
            state.selectedRolePreset = item.id;
            updateRoleTagState(group);
            previewCurrentPrompt();
          });
          group.appendChild(button);
        });

        wrapper.appendChild(group);
        fields.form.appendChild(wrapper);
        return;
      }

      let input;
      if (type === "textarea") {
        input = document.createElement("textarea");
      } else if (type === "select") {
        input = document.createElement("select");
      } else {
        input = document.createElement("input");
      }
      input.id = id;
      input.name = id;
      input.placeholder = placeholder || "";
      input.dataset.field = id;
      if (type === "textarea") {
        input.rows = id === "content" || id === "draft" ? 5 : 3;
      }
      if (type === "select") {
        options.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.id;
          option.textContent = item.name;
          input.appendChild(option);
        });
      }
      wrapper.appendChild(input);
      fields.form.appendChild(wrapper);
    });
  }

  function updateRoleTagState(group) {
    group.querySelectorAll(".role-tag").forEach((button) => {
      button.classList.toggle("active", button.dataset.rolePreset === state.selectedRolePreset);
    });
  }

  function gatherFormData() {
    const values = {};
    fields.form.querySelectorAll("[data-field]").forEach((input) => {
      if (input.dataset.field === "rolePreset" && input.classList.contains("role-tags")) {
        values.rolePreset = state.selectedRolePreset;
        return;
      }
      values[input.dataset.field] = input.value.trim();
    });
    return {
      platform: fields.platform.value,
      includePlatform: fields.includePlatform.checked,
      technique: state.activeTechnique,
      values
    };
  }

  async function generatePrompt() {
    const input = gatherFormData();
    const prompt = buildTechniquePrompt(input);
    fields.result.value = prompt;
    await chrome.storage.local.set({
      lastPrompt: prompt,
      lastTechniqueInput: input
    });
    setStatus(isCompactMode ? "已生成。" : "已生成，可复制或插入到当前页面。");
  }

  function previewCurrentPrompt() {
    const input = gatherFormData();
    fields.result.value = buildTechniquePrompt(input);
    setStatus(isCompactMode ? "" : "已预览，可复制或插入到当前页面。");
  }

  async function copyPrompt() {
    if (!fields.result.value.trim()) {
      await generatePrompt();
    }
    await navigator.clipboard.writeText(fields.result.value);
    setStatus("已复制到剪贴板。");
    showToast("复制成功");
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          source: "PROMPT_STUDIO",
          type: "PROMPT_STUDIO_COPY_SUCCESS"
        },
        "*"
      );
    }
  }

  async function insertPrompt() {
    if (!fields.result.value.trim()) {
      await generatePrompt();
    }

    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          source: "PROMPT_STUDIO",
          type: "PROMPT_STUDIO_INSERT_DIRECT",
          prompt: fields.result.value
        },
        "*"
      );
      setStatus("已发送到当前页面输入框。");
      return;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
      setStatus("未找到当前标签页。");
      return;
    }

    try {
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: "PROMPT_STUDIO_INSERT",
        prompt: fields.result.value
      });
      setStatus(response && response.ok ? "已插入当前页面输入框。" : "没有可插入的输入框，请先聚焦聊天输入区。");
    } catch (error) {
      setStatus("当前页面暂时无法插入，可先复制后手动粘贴。");
    }
  }

  async function loadDefaults() {
    const saved = await chrome.storage.sync.get("promptStudioOptions");
    const options = saved.promptStudioOptions || defaultOptions;
    fields.platform.value = options.defaultPlatform || defaultOptions.defaultPlatform;

    const last = await chrome.storage.local.get("lastTechniqueInput");
    if (last.lastTechniqueInput && last.lastTechniqueInput.technique) {
      state.activeTechnique = last.lastTechniqueInput.technique;
      state.selectedRolePreset = last.lastTechniqueInput.values?.rolePreset || state.selectedRolePreset;
      renderTabs();
      renderForm();
      fields.platform.value = last.lastTechniqueInput.platform || fields.platform.value;
      fields.includePlatform.checked = Boolean(last.lastTechniqueInput.includePlatform);
      Object.entries(last.lastTechniqueInput.values || {}).forEach(([key, value]) => {
        if (key === "rolePreset") {
          return;
        }
        const input = fields.form.querySelector(`[data-field="${key}"]`);
        if (input) {
          input.value = value;
        }
      });
    }

    if (state.activeTechnique === "role_prompt") {
      previewCurrentPrompt();
    }
  }

  populateSelect(fields.platform, platforms);
  renderTabs();
  renderForm();

  if (isCompactMode) {
    document.getElementById("insert").textContent = "插入";
  }

  document.getElementById("copy").addEventListener("click", copyPrompt);
  document.getElementById("insert").addEventListener("click", insertPrompt);

  loadDefaults();
})();
