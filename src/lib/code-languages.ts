export interface CodeLanguageConfig {
  language: string;
  label: string;
  version: string;
  aliases: string[];
}

export const CODE_LANGUAGE_CONFIG: Record<string, CodeLanguageConfig> = {
  python: {
    language: "python",
    label: "Python",
    version: "local",
    aliases: ["py", "python3"],
  },
  javascript: {
    language: "javascript",
    label: "JavaScript",
    version: "local-node",
    aliases: ["js", "node"],
  },
  cpp: {
    language: "cpp",
    label: "C++",
    version: "local-g++",
    aliases: ["c++"],
  },
  java: {
    language: "java",
    label: "Java",
    version: "local-jdk",
    aliases: [],
  },
  c: {
    language: "c",
    label: "C",
    version: "local-gcc",
    aliases: [],
  },
};

export function getSupportedLanguages() {
  return Object.keys(CODE_LANGUAGE_CONFIG);
}

export function getLanguageConfig(lang: string) {
  return CODE_LANGUAGE_CONFIG[lang] || CODE_LANGUAGE_CONFIG.python;
}
