import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "en" | "hi";

const dict = {
  en: {
    "nav.browse": "Browse",
    "nav.services": "Services",
    "nav.sell": "Sell",
    "nav.chat": "Chat",
    "nav.dashboard": "Dashboard",
    "nav.login": "Sign in",
    "nav.signup": "Sign up",
    "nav.profile": "Profile",
    "nav.wishlist": "Wishlist",
    "nav.logout": "Sign out",
    "nav.admin": "Admin",
    "hero.title": "Buy & sell second-hand products — the trusted way",
    "hero.subtitle": "TrustMaart is India's modern marketplace for second-hand products. Find great deals or list yours in seconds, powered by AI.",
    "hero.search": "Try: \"used iPhone under 25000 in Delhi\"",
    "hero.ai_search": "Ask AI",
    "hero.post_ad": "Post your ad",
    "section.categories": "Browse by category",
    "section.featured": "Featured listings",
    "section.recent": "Recently added",
    "section.services": "Popular services",
    "section.ai": "AI that does the work for you",
    "section.how": "How TrustMaart works",
    "section.trust": "Built on trust",
    "label.negotiable": "Negotiable",
    "label.fixed_price": "Fixed",
    "label.chat_seller": "Chat with seller",
    "label.save": "Save",
    "label.saved": "Saved",
    "label.report": "Report",
    "label.share": "Share",
    "label.similar": "Similar listings",
    "label.view_all": "View all",
  },
  hi: {
    "nav.browse": "ब्राउज़",
    "nav.services": "सेवाएँ",
    "nav.sell": "बेचें",
    "nav.chat": "चैट",
    "nav.dashboard": "डैशबोर्ड",
    "nav.login": "साइन इन",
    "nav.signup": "साइन अप",
    "nav.profile": "प्रोफ़ाइल",
    "nav.wishlist": "विशलिस्ट",
    "nav.logout": "साइन आउट",
    "nav.admin": "एडमिन",
    "hero.title": "ख़रीदें, बेचें और किराये पर लें — भरोसे के साथ",
    "hero.subtitle": "ट्रस्टमार्ट भारत का आधुनिक मार्केटप्लेस है — सेकंड-हैंड प्रोडक्ट और लोकल सर्विस के लिए, AI के साथ।",
    "hero.search": "कोशिश करें: \"दिल्ली में 25000 से कम में iPhone\"",
    "hero.ai_search": "AI से पूछें",
    "hero.post_ad": "विज्ञापन डालें",
    "section.categories": "श्रेणी से ब्राउज़ करें",
    "section.featured": "फीचर्ड लिस्टिंग",
    "section.recent": "हाल ही में जोड़ी गई",
    "section.services": "लोकप्रिय सेवाएँ",
    "section.ai": "AI जो आपका काम आसान करे",
    "section.how": "ट्रस्टमार्ट कैसे काम करता है",
    "section.trust": "विश्वास पर बना",
    "label.negotiable": "मोलभाव",
    "label.fixed_price": "फिक्स्ड",
    "label.chat_seller": "विक्रेता से चैट",
    "label.save": "सेव",
    "label.saved": "सेव किया",
    "label.report": "रिपोर्ट",
    "label.share": "शेयर",
    "label.similar": "मिलती-जुलती लिस्टिंग",
    "label.view_all": "सभी देखें",
  },
} as const;

type Key = keyof typeof dict.en;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("lang") as Lang)) || null;
    if (saved === "en" || saved === "hi") setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };
  const t = (k: Key) => dict[lang][k] ?? dict.en[k] ?? k;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}
