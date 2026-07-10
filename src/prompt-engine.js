(function initPromptStudioEngine() {
  function splitLines(value) {
    return String(value || "")
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function bulletize(lines) {
    return lines.map((line) => `- ${line}`).join("\n");
  }

  function platformInstructions(platformId) {
    const map = {
      general: "请优先保证结果具体、清晰、可执行。",
      chatgpt: "请优先给出结构化、可迭代、便于继续追问的结果。",
      claude: "请优先利用长上下文能力，完整吸收信息后再回答。",
      gemini: "请优先整合信息，输出清楚的结构和重点。",
      kimi: "请优先处理长文本，避免遗漏关键细节。",
      doubao: "请优先保证中文自然、简洁、直接可用。",
      yuanbao: "请优先贴近办公场景，输出务实可执行建议。",
      qwen: "请优先兼顾中文表达准确性与业务分析逻辑。",
      deepseek: "请优先展开推理过程，保证分析严谨。"
    };
    return map[platformId] || map.general;
  }

  function buildPrompt(input) {
    const sections = [];
    const perspectives = splitLines(String(input.perspectives || "").replace(/[\/、,，]/g, "\n"));
    const negatives = splitLines(input.negativeConstraints);
    const selfCheckItems = splitLines(input.selfCheckList);

    if (input.role) {
      sections.push(`## 角色\n你是${input.role}。`);
    }

    const taskLines = [];
    if (input.task) {
      taskLines.push(input.task);
    }
    if (input.audience) {
      taskLines.push(`目标受众：${input.audience}`);
    }
    if (input.tone) {
      taskLines.push(`语气要求：${input.tone}`);
    }
    if (input.length) {
      taskLines.push(`长度要求：${input.length}`);
    }
    if (taskLines.length > 0) {
      sections.push(`## 任务\n${taskLines.join("\n")}`);
    }

    if (input.background) {
      sections.push(`## 背景\n${input.background}`);
    }

    if (input.outputFormat) {
      sections.push(`## 输出格式\n${input.outputFormat}`);
    }

    if (input.constraints) {
      sections.push(`## 限制\n${input.constraints}`);
    }

    const requirements = [];
    requirements.push(platformInstructions(input.platform));

    if (input.includeReason && input.reason) {
      requirements.push(`这样做的原因：${input.reason}`);
    }

    if (input.stepByStep) {
      requirements.push("请先一步步分析，再给出结论。");
    }

    if (input.outputSpec) {
      requirements.push("输出必须结构化、层次清楚，并尽量让我拿到后可以直接使用。");
    }

    if (input.interviewMode) {
      requirements.push("请不要一次性给结论，而是先问我 1 个最关键的问题，等我回答后再继续。");
    }

    if (input.pressureMode) {
      requirements.push("请按会被严苛专家审查的标准作答，避免标准化、表面化、空泛化答案。");
    }

    if (requirements.length > 0) {
      sections.push(`## 要求\n${bulletize(requirements)}`);
    }

    if (input.includeExamples && input.examples) {
      sections.push(`## 示例\n${input.examples}`);
    }

    if (perspectives.length > 0) {
      sections.push(`## 视角\n请分别从以下角色视角分析：\n${bulletize(perspectives)}`);
    }

    if (input.negativeRules && negatives.length > 0) {
      sections.push(`## 不要做的事\n${bulletize(negatives)}`);
    }

    if (input.selfCheck && selfCheckItems.length > 0) {
      sections.push(`## 自检\n输出前请逐条检查：\n${bulletize(selfCheckItems)}`);
    }

    if (input.selfCritique) {
      sections.push("## 反驳自己\n给出初步答案后，请再站在最挑剔的评审视角，补充 3 条最有力的反驳、风险或盲区，并在最终建议里回应这些问题。");
    }

    if (input.chainMode) {
      const chainText = [
        "## Prompt 链模式",
        "请不要试图一步完成所有任务。",
        "请把任务拆成 3-5 个连续步骤。",
        "每一步都要包含：目标、输入、输出、下一步如何使用本步结果。",
        "最后给出一个推荐执行顺序。"
      ].join("\n");
      sections.push(chainText);
    }

    sections.push("## 开始\n如果我后续继续补充信息，请基于当前上下文持续迭代，不要丢掉已经确认的约束。");

    return sections.filter(Boolean).join("\n\n");
  }

  function valueLines(values, keys) {
    return keys
      .map(([key, label]) => {
        const value = values[key];
        return value ? `## ${label}\n${value}` : "";
      })
      .filter(Boolean);
  }

  function buildTechniquePrompt(input) {
    const values = input.values || {};
    const rolePresets = window.PromptStudioData?.rolePresets || [];
    const sections = [];
    if (input.includePlatform) {
      sections.push(`## 平台适配\n${platformInstructions(input.platform)}`);
    }

    const builders = {
      role_prompt() {
        const role = rolePresets.find((item) => item.id === values.rolePreset) || rolePresets[0];
        if (role) {
          sections.push(`## 你的角色\n${role.identity}`);
          sections.push(`## 你可以帮助我的范围\n${role.scope}`);
          sections.push(`## 专业边界\n${role.guardrails}`);
        }

        sections.push([
          "## 通用回答纪律",
          "- 默认使用中文回答。",
          "- 结论先行，再给必要理由。",
          "- 回答要严谨、具体、简洁，不要空话和套话。",
          "- 不要编造事实、数据、法规、医学结论、财务结论或来源。",
          "- 不确定时直接说不确定，并说明还需要哪些信息。",
          "- 需要假设时，先明确假设，再基于假设回答。",
          "- 如果我的问题有明显风险或前提错误，请直接指出。",
          "- 后续对话中持续保持这个角色，不要每次重复完整角色设定。"
        ].join("\n"));

        sections.push("## 开始\n请先用一句简短的话确认你将按上述角色和纪律与我对话，然后等待我的问题。");
      },
      universal() {
        sections.push(...valueLines(values, [
          ["role", "角色"],
          ["task", "任务"],
          ["background", "背景"],
          ["format", "输出格式"],
          ["limits", "限制"]
        ]));
        sections.push("## 开始\n请严格按以上信息完成任务。如果信息不足，请先指出缺口，再给出可执行版本。");
      },
      reason() {
        sections.push(...valueLines(values, [
          ["requirement", "要求"],
          ["reason", "为什么这样做"],
          ["task", "具体任务"],
          ["extra", "补充限制"]
        ]));
        sections.push("## 执行要求\n请根据原因推导具体执行细节，不要只机械执行表面要求。");
      },
      examples() {
        sections.push(...valueLines(values, [
          ["task", "任务"],
          ["examples", "示例"],
          ["content", "待处理内容"],
          ["format", "输出要求"]
        ]));
        sections.push("## 执行要求\n请学习示例里的结构、语气、详略和用词习惯，再处理待处理内容。");
      },
      step_by_step() {
        sections.push(...valueLines(values, [
          ["question", "问题"],
          ["context", "背景"],
          ["steps", "分析步骤"],
          ["format", "输出格式"]
        ]));
        sections.push("## 执行要求\n请先一步步分析关键因素，再给出结论。结论必须能从分析过程推出。");
      },
      long_context() {
        sections.push(...valueLines(values, [
          ["content", "长内容"],
          ["question", "请根据以上内容回答"],
          ["format", "输出格式"],
          ["limits", "限制"]
        ]));
        sections.push("## 执行要求\n请只基于上面的长内容回答。先理解全文，再回答最后的问题。");
      },
      output_format() {
        sections.push(...valueLines(values, [
          ["task", "任务"],
          ["columns", "字段 / 模板"],
          ["content", "输入内容"],
          ["rules", "格式规则"]
        ]));
        sections.push("## 执行要求\n输出必须严格遵守字段、模板和格式规则。不要输出与格式无关的解释。");
      },
      negative() {
        sections.push(...valueLines(values, [
          ["task", "任务"],
          ["content", "输入内容"],
          ["format", "输出格式"],
          ["dont", "不要做的事"]
        ]));
        sections.push("## 执行要求\n请同时遵守正向任务和反向边界。不要默认添加总结、寒暄或无关背景。");
      },
      prompt_chain() {
        sections.push(...valueLines(values, [
          ["goal", "最终目标"],
          ["material", "已有材料"],
          ["stages", "希望拆成几步"],
          ["output", "每步产出"]
        ]));
        sections.push("## 执行要求\n请把大任务拆成连续 Prompt 链。每一步都要包含目标、输入、输出，以及下一步如何使用本步结果。");
      },
      self_critique() {
        sections.push(...valueLines(values, [
          ["topic", "分析对象"],
          ["position", "初始立场"],
          ["critique", "挑刺要求"],
          ["final", "最终输出"]
        ]));
        sections.push("## 执行要求\n先给出初步分析，再站在反对者或评审视角反驳自己，最后给出修正后的建议。");
      },
      multi_role() {
        sections.push(...valueLines(values, [
          ["topic", "要分析的事"],
          ["roles", "角色列表"],
          ["focus", "每个角色关注点"],
          ["decision", "综合决策要求"]
        ]));
        sections.push("## 执行要求\n请分别从每个角色视角独立判断，最后综合多个视角给出建议。");
      },
      meta_prompt() {
        sections.push(...valueLines(values, [
          ["goal", "我想让 AI 做什么"],
          ["known", "我已知的信息"],
          ["quality", "好结果标准"],
          ["format", "Prompt 输出格式"]
        ]));
        sections.push("## 执行要求\n请帮我设计一个可直接复制使用的 Prompt，并说明这个 Prompt 为什么这样写。");
      },
      interview() {
        sections.push(...valueLines(values, [
          ["role", "采访角色"],
          ["goal", "澄清目标"],
          ["known", "当前情况"],
          ["rules", "提问规则"]
        ]));
        sections.push("## 执行要求\n请先问第一个最关键的问题，等我回答后再继续。不要一次问多个问题。");
      },
      pressure() {
        sections.push(...valueLines(values, [
          ["task", "任务"],
          ["standard", "高标准"],
          ["angle", "非常规角度"],
          ["limits", "限制"]
        ]));
        sections.push("## 执行要求\n请按更高标准重新回答，避免标准化和表面化答案。观点可以尖锐，但必须有逻辑支撑。");
      },
      iteration() {
        sections.push(...valueLines(values, [
          ["draft", "已有回答"],
          ["problem", "具体问题"],
          ["direction", "修改方向"],
          ["keep", "必须保留"]
        ]));
        sections.push("## 执行要求\n请基于已有回答继续迭代，不要重开话题。针对具体问题直接修改，并说明关键改动。");
      }
    };

    const builder = builders[input.technique] || builders.universal;
    builder();
    return sections.filter(Boolean).join("\n\n");
  }

  window.PromptStudioEngine = {
    buildPrompt,
    buildTechniquePrompt
  };
})();
