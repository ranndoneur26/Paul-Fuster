"use client";
import { createContext, useContext } from "react";
export type Lang = "CA" | "EN";
interface LangContextValue { lang: Lang; toggle: () => void; }
export const LangContext = createContext<LangContextValue>({ lang: "CA", toggle: () => {} });
export function useLang() { return useContext(LangContext); }
