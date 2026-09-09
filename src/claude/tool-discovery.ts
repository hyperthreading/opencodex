import { isRec, type Rec } from "./inbound-records";

/** Only ordinary client functions participate in request-local discovery. */
function isClientFunction(tool: Rec): boolean {
  return (tool.type === undefined || tool.type === "function" || tool.type === "custom")
    && typeof tool.name === "string" && tool.name.length > 0 && isRec(tool.input_schema);
}

export interface ClaudeToolDiscovery {
  tools: unknown;
  referenceText: ReadonlyMap<Rec, string>;
  unsupportedDeferred: boolean;
  unsupportedReferences: boolean;
  ambiguousDeclarations: boolean;
}

/** Current declarations own schemas; paired successful results only discover names. */
export function analyzeClaudeToolDiscovery(body: Rec): ClaudeToolDiscovery {
  const declarations = Array.isArray(body.tools) ? body.tools.filter(isRec) : [];
  const byName = new Map<string, Rec>();
  const duplicateNames = new Set<string>();
  const activeCarrier = (value: unknown) => value === true
    || (Array.isArray(value) ? value.length > 0 : isRec(value) && Object.keys(value).length > 0);
  let unsupportedDeferred = activeCarrier(body.defer_tools) || activeCarrier(body.deferred_tools);
  for (const tool of declarations) {
    if (typeof tool.name === "string") {
      if (byName.has(tool.name)) duplicateNames.add(tool.name);
      byName.set(tool.name, tool);
    }
    if (tool.defer === true || (tool.defer_loading === true && !isClientFunction(tool))) unsupportedDeferred = true;
  }

  const messages = Array.isArray(body.messages) ? body.messages.filter(isRec) : [];
  // Count first so a later duplicate cannot retroactively authorize an ambiguous pair.
  const callCounts = new Map<string, number>();
  const resultCounts = new Map<string, number>();
  for (const message of messages) {
    if (!Array.isArray(message.content)) continue;
    for (const block of message.content) {
      if (!isRec(block)) continue;
      if (message.role === "assistant" && block.type === "tool_use" && typeof block.id === "string") {
        callCounts.set(block.id, (callCounts.get(block.id) ?? 0) + 1);
      }
      if (message.role === "user" && block.type === "tool_result" && typeof block.tool_use_id === "string") {
        resultCounts.set(block.tool_use_id, (resultCounts.get(block.tool_use_id) ?? 0) + 1);
      }
    }
  }

  const calls = new Map<string, Rec>();
  const active = new Set<string>();
  const referenceText = new Map<Rec, string>();
  let unsupportedReferences = false;
  const misplaced = (blocks: unknown) => {
    if (!Array.isArray(blocks)) return;
    for (const block of blocks) {
      if (!isRec(block)) continue;
      if (block.type === "tool_reference") unsupportedReferences = true;
      if (block.type === "tool_result" && Array.isArray(block.content)
        && block.content.some(item => isRec(item) && item.type === "tool_reference")) unsupportedReferences = true;
    }
  };
  misplaced(body.system);
  for (const message of messages) {
    if (!Array.isArray(message.content)) continue;
    for (const block of message.content) {
      if (!isRec(block)) continue;
      if (message.role === "assistant" && block.type === "tool_use" && typeof block.id === "string") calls.set(block.id, block);
      if (block.type === "tool_reference") unsupportedReferences = true;
      if (block.type !== "tool_result" || !Array.isArray(block.content)) continue;
      const id = block.tool_use_id;
      const call = typeof id === "string" ? calls.get(id) : undefined;
      const search = call && typeof call.name === "string" ? byName.get(call.name) : undefined;
      const paired = message.role === "user" && block.is_error !== true
        && typeof id === "string" && id.length > 0 && callCounts.get(id) === 1 && resultCounts.get(id) === 1
        && search !== undefined && isClientFunction(search) && !duplicateNames.has(search.name as string)
        && (call?.caller === undefined || (isRec(call.caller) && call.caller.type === "direct"));
      for (const item of block.content) {
        if (!isRec(item) || item.type !== "tool_reference") continue;
        if (!paired || typeof item.tool_name !== "string" || item.tool_name.length === 0) {
          unsupportedReferences = true;
          referenceText.set(item, "[tool reference unavailable: invalid discovery result]");
          continue;
        }
        const target = byName.get(item.tool_name);
        if (!target || !isClientFunction(target) || duplicateNames.has(item.tool_name)) {
          referenceText.set(item, `[tool unavailable: ${item.tool_name}]`);
          continue;
        }
        active.add(item.tool_name);
        referenceText.set(item, `[tool available: ${item.tool_name}]`);
      }
    }
  }
  const discovery = declarations.some(tool => tool.defer_loading === true || tool.defer === true)
    || referenceText.size > 0;
  return {
    tools: Array.isArray(body.tools) ? body.tools.filter(tool => !isRec(tool)
      || ((tool.defer_loading !== true && tool.defer !== true) || (isClientFunction(tool)
        && tool.defer !== true && active.has(tool.name as string)))) : body.tools,
    referenceText,
    unsupportedDeferred,
    unsupportedReferences,
    ambiguousDeclarations: discovery && duplicateNames.size > 0,
  };
}
