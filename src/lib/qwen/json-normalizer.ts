type NormalizedJson = {
  value: unknown;
  repaired: boolean;
  warnings: string[];
};

function parseJson(value: string) {
  return JSON.parse(value) as unknown;
}

function stripMarkdownFence(value: string) {
  const trimmed = value.trim();

  if (!trimmed.startsWith("```")) {
    return trimmed;
  }

  return trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function extractFirstJsonObject(value: string) {
  const start = value.indexOf("{");

  if (start === -1) {
    return undefined;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < value.length; index += 1) {
    const char = value[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === "\"") {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "{") {
      depth += 1;
    }

    if (char === "}") {
      depth -= 1;
    }

    if (depth === 0) {
      return value.slice(start, index + 1);
    }
  }

  return undefined;
}

export function normalizePlannerJson(rawContent: string): NormalizedJson {
  const content = rawContent.trim();

  try {
    return {
      value: parseJson(content),
      repaired: false,
      warnings: [],
    };
  } catch {
    const unfenced = stripMarkdownFence(content);

    if (unfenced !== content) {
      try {
        return {
          value: parseJson(unfenced),
          repaired: true,
          warnings: ["Qwen returned fenced JSON; ForgePilot removed the fence."],
        };
      } catch {
        // Continue to object extraction below.
      }
    }

    const extracted = extractFirstJsonObject(unfenced);

    if (extracted) {
      return {
        value: parseJson(extracted),
        repaired: true,
        warnings: ["Qwen returned surrounding text; ForgePilot extracted the JSON object."],
      };
    }

    throw new Error("Qwen planner response did not contain valid JSON.");
  }
}
