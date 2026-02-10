import { create } from "zustand"

type TabType = "settings" | "history"

interface UIState {
    isMobileDrawerOpen: boolean
    isMobileMenuOpen: boolean
    isMobileScreen: boolean
    activateTab: TabType
    toggleMobileDrawer: () => void
    toggleMobileMenu: () => void
    setMobileScreen: (isMobile: boolean) => void
    setActiveTab: (tab: TabType) => void

}

export const useUIStore = create<UIState>((set) => ({
    isMobileDrawerOpen: false,
    isMobileScreen: false,
    isMobileMenuOpen: false,
    activateTab: "settings",
    toggleMobileDrawer: () =>
        set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),
    toggleMobileMenu: () =>
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
    setMobileScreen: (isMobile) => set(() => ({ isMobileScreen: isMobile })),
    setActiveTab: (tab) => set(() => ({ activateTab: tab })),
}))