"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { enrichApiResponse, generateMockAnalysis } from "./mock";
import type { HistoryEntry, ResumeAnalysis } from "./types";

const HISTORY_KEY = "resumeai:history";
const CURRENT_KEY = "resumeai:current";
const ANALYSES_KEY = "resumeai:analyses";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function apiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`, {
      signal: AbortSignal.timeout(2500),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface AnalyzeStatus {
  phase: string; // human readable stage label
  progress: number; // 0-100
}

interface StoreValue {
  analysis: ResumeAnalysis | null;
  history: HistoryEntry[];
  analyzing: boolean;
  analysisStatus: AnalyzeStatus | null;
  apiAvailable: boolean;
  analyze: (file: File, jd: string) => Promise<ResumeAnalysis>;
  loadById: (id: string) => ResumeAnalysis | null;
  setCurrent: (a: ResumeAnalysis) => void;
  clearHistory: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function readLS<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeLS(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable */
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<AnalyzeStatus | null>(null);
  const [apiAvailable, setApiAvailable] = useState(false);
  const analysesRef = useRef<Record<string, ResumeAnalysis>>({});

  useEffect(() => {
    // Hydrate from localStorage on mount — avoid SSR hydration mismatches.
    const savedAnalysis = readLS<ResumeAnalysis>(CURRENT_KEY);
    const savedHistory = readLS<HistoryEntry[]>(HISTORY_KEY);
    const savedAnalyses = readLS<Record<string, ResumeAnalysis>>(ANALYSES_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedAnalysis) setAnalysis(savedAnalysis);
    if (savedHistory) setHistory(savedHistory);
    if (savedAnalyses) analysesRef.current = savedAnalyses;
    apiHealth().then(setApiAvailable);
  }, []);

  const analyze = useCallback(
    async (file: File, jd: string): Promise<ResumeAnalysis> => {
      setAnalyzing(true);

      const stages: { phase: string; delay: number }[] = [
        { phase: "Parsing resume structure", delay: 900 },
        { phase: "Extracting skills & entities", delay: 950 },
        { phase: "Scoring against job description", delay: 1000 },
        { phase: "Generating recommendations", delay: 700 },
      ];

      // Pipeline is simulated so the skeleton dashboard has time to breathe
      let progress = 0;
      const runPhases = async () => {
        for (const stage of stages) {
          if (jd) setAnalysisStatus({ phase: stage.phase, progress });
          await new Promise((r) => setTimeout(r, stage.delay));
          progress = Math.min(100, progress + 100 / stages.length);
        }
        setAnalysisStatus({ phase: jd ? "Finalizing report" : "Analyzing resume", progress });
        await new Promise((r) => setTimeout(r, 700));
      };

      let result: ResumeAnalysis;
      try {
        const form = new FormData();
        form.append("resume_file", file);
        form.append("job_description", jd || "");
        const res = await fetch(`${API_URL}/analyze`, {
          method: "POST",
          body: form,
          signal: AbortSignal.timeout(20000),
        });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const api = await res.json();
        result = enrichApiResponse(api, file.name, jd || "");
      } catch {
        await runPhases();
        result = generateMockAnalysis(file.name, jd);
      }

      const latest = history[history.length - 1];
      const entry: HistoryEntry = {
        id: result.id,
        filename: result.filename,
        candidateName: result.candidateName,
        date: result.date,
        atsScore: result.atsScore,
        targetTitle: result.targetTitle,
        improvement: latest ? result.atsScore - latest.atsScore : null,
      };

      analysesRef.current[result.id] = result;
      writeLS(ANALYSES_KEY, analysesRef.current);
      writeLS(CURRENT_KEY, result);
      writeLS(HISTORY_KEY, [...history, entry]);
      setHistory((h) => [...h, entry]);
      setAnalysis(result);
      setAnalyzing(false);
      setAnalysisStatus(null);
      return result;
    },
    [history],
  );

  const loadById = useCallback((id: string): ResumeAnalysis | null => {
    const found = analysesRef.current[id];
    if (found) {
      writeLS(CURRENT_KEY, found);
      setAnalysis(found);
      return found;
    }
    const saved = readLS<Record<string, ResumeAnalysis>>(ANALYSES_KEY);
    if (saved?.[id]) {
      analysesRef.current = saved;
      writeLS(CURRENT_KEY, saved[id]);
      setAnalysis(saved[id]);
      return saved[id];
    }
    return null;
  }, []);

  const setCurrent = useCallback((a: ResumeAnalysis) => {
    analysesRef.current[a.id] = a;
    writeLS(ANALYSES_KEY, analysesRef.current);
    writeLS(CURRENT_KEY, a);
    setAnalysis(a);
  }, []);

  const clearHistory = useCallback(() => {
    analysesRef.current = {};
    setAnalysis(null);
    setHistory([]);
    try {
      window.localStorage.removeItem(HISTORY_KEY);
      window.localStorage.removeItem(CURRENT_KEY);
      window.localStorage.removeItem(ANALYSES_KEY);
    } catch {
      /* noop */
    }
  }, []);

  return (
    <StoreContext.Provider
      value={{
        analysis,
        history,
        analyzing,
        analysisStatus,
        apiAvailable,
        analyze,
        loadById,
        setCurrent,
        clearHistory,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}