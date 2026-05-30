"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { District } from "@/types/database";
import {
  getStoredVisitor,
  isSessionIntentDone,
  markSessionIntentDone,
  clearSessionIntentDone,
  type StoredVisitorProfile,
} from "@/lib/visitor-profile";
import { VisitorOnboardingSheet } from "./VisitorOnboardingSheet";
import { VisitorQuickIntentSheet } from "./VisitorQuickIntentSheet";

type ProductOption = { id: string; name: string };

type VisitorContextValue = {
  profile: StoredVisitorProfile | null;
  refreshProfile: () => void;
  openOnboarding: () => void;
  openQuickIntent: () => void;
};

const VisitorContext = createContext<VisitorContextValue | null>(null);

export function useVisitorProfile() {
  const ctx = useContext(VisitorContext);
  if (!ctx) {
    return {
      profile: null,
      refreshProfile: () => {},
      openOnboarding: () => {},
      openQuickIntent: () => {},
    };
  }
  return ctx;
}

export function VisitorProfileProvider({
  districts,
  products,
  children,
}: {
  districts: District[];
  products: ProductOption[];
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<StoredVisitorProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showQuickIntent, setShowQuickIntent] = useState(false);
  const [ready, setReady] = useState(false);

  const refreshProfile = useCallback(() => {
    setProfile(getStoredVisitor());
  }, []);

  useEffect(() => {
    const stored = getStoredVisitor();
    setProfile(stored);
    if (!stored) {
      setShowOnboarding(true);
    } else if (!isSessionIntentDone()) {
      setShowQuickIntent(true);
    }
    setReady(true);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      refreshProfile,
      openOnboarding: () => setShowOnboarding(true),
      openQuickIntent: () => {
        clearSessionIntentDone();
        setShowQuickIntent(true);
      },
    }),
    [profile, refreshProfile]
  );

  const handleOnboardingComplete = (p: StoredVisitorProfile) => {
    setProfile(p);
    setShowOnboarding(false);
    setShowQuickIntent(true);
  };

  const handleQuickIntentComplete = () => {
    markSessionIntentDone();
    setShowQuickIntent(false);
  };

  if (!ready) return <>{children}</>;

  return (
    <VisitorContext.Provider value={value}>
      {children}
      <VisitorOnboardingSheet
        open={showOnboarding}
        districts={districts}
        onComplete={handleOnboardingComplete}
        onSkip={() => setShowOnboarding(false)}
      />
      <VisitorQuickIntentSheet
        open={showQuickIntent && Boolean(profile) && !showOnboarding}
        profile={profile}
        products={products}
        onComplete={handleQuickIntentComplete}
        onDismiss={() => {
          markSessionIntentDone();
          setShowQuickIntent(false);
        }}
      />
    </VisitorContext.Provider>
  );
}
