import { create } from "zustand";
import { useCareerStore } from "./career-store";

interface ExecutionResult {
  status: string;
  output: string;
  stderr: string | null;
  exitCode: number;
}

interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

interface SubmissionEntry {
  id: string;
  language: string;
  status: string;
  timestamp: number;
}

interface GameStore {
  code: string;
  language: string;
  isRunning: boolean;
  executionResult: ExecutionResult | null;
  testResults: TestCaseResult[];
  submissions: SubmissionEntry[];
  activeOutputTab: "output" | "tests" | "history";

  setCode: (code: string) => void;
  setLanguage: (lang: string) => void;
  setActiveOutputTab: (tab: "output" | "tests" | "history") => void;
  runCode: (stdin?: string) => Promise<void>;
  submitCode: (
    taskSlug: string,
    hiddenTests: { input: string; output: string }[],
    reward?: { expReward: number; salaryReward: number; reputationReward: number }
  ) => Promise<void>;
  resetExecution: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  code: "",
  language: "python",
  isRunning: false,
  executionResult: null,
  testResults: [],
  submissions: [],
  activeOutputTab: "output",

  setCode: (code) => set({ code }),
  setLanguage: (lang) => set({ language: lang }),
  setActiveOutputTab: (tab) => set({ activeOutputTab: tab }),

  resetExecution: () =>
    set({ executionResult: null, testResults: [] }),

  runCode: async (stdin) => {
    const { code, language } = get();
    set({ isRunning: true, executionResult: null });

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, stdin }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      set({
        executionResult: {
          status: data.status,
          output: data.output,
          stderr: data.stderr,
          exitCode: data.exitCode,
        },
        activeOutputTab: "output",
      });
    } catch (err: unknown) {
      set({
        executionResult: {
          status: "error",
          output: "",
          stderr: err instanceof Error ? err.message : "Unknown error",
          exitCode: 1,
        },
      });
    } finally {
      set({ isRunning: false });
    }
  },

  submitCode: async (taskSlug, hiddenTests, reward) => {
    const { code, language } = get();
    set({ isRunning: true, testResults: [], activeOutputTab: "tests" });

    const results: TestCaseResult[] = [];

    try {
      for (const test of hiddenTests) {
        const res = await fetch("/api/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            language,
            stdin: test.input,
            expectedOutput: test.output,
          }),
        });

        const data = await res.json();

        results.push({
          input: test.input,
          expectedOutput: test.output,
          actualOutput: data.output || "",
          passed: data.status === "accepted",
        });
      }

      const allPassed = results.every((r) => r.passed);
      const entry: SubmissionEntry = {
        id: Date.now().toString(),
        language,
        status: allPassed ? "accepted" : "wrong_answer",
        timestamp: Date.now(),
      };

      set((state) => ({
        testResults: results,
        submissions: [entry, ...state.submissions],
      }));

      // Process gamification rewards if all tests passed
      if (allPassed && reward) {
        useCareerStore.getState().processTaskCompletion({
          expReward: reward.expReward,
          salaryReward: reward.salaryReward,
          reputationReward: reward.reputationReward,
          onTime: true,
        });
      }
    } catch {
      const entry: SubmissionEntry = {
        id: Date.now().toString(),
        language,
        status: "error",
        timestamp: Date.now(),
      };
      set((state) => ({
        testResults: results,
        submissions: [entry, ...state.submissions],
      }));
    } finally {
      set({ isRunning: false });
    }
  },
}));
