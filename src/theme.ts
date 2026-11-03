// Satu tempat untuk semua keputusan visual. Ubah di sini, semua scene ikut berubah.
export const theme = {
  width: 1080,
  height: 1920,
  fps: 30,
  colors: {
    bgFrom: "#0B1020",
    bgTo: "#1B1240",
    surface: "#111827",
    surfaceAlt: "#1F2937",
    text: "#F8FAFC",
    muted: "#94A3B8",
    accent: "#38BDF8",
    accent2: "#A78BFA",
    highlight: "#39E508",
  },
  // Latar belakang: NotebookPaper (src/compositions/notebook-paper.element.tsx),
  // diatur lewat prop "bg" (panel Props di Studio, default di Root.tsx).
  // Area aman: bagian bawah dikosongkan untuk caption dan UI TikTok/Reels/Shorts.
  layout: { top: 200, bottom: 560, side: 64 },
  brand: { name: "Senimankode" },
  caption: {
    uppercase: false, // false supaya "PostgreSQL" / "Next.js" tetap terbaca benar
    maxFontSize: 88,
    bottom: 330,
    height: 170,
    switchEveryMs: 1200,
  },
  // Jeda setelah audio selesai (outro tidak terpotong mendadak).
  tailMs: 600,
  // Scene muncul sedikit sebelum kata pertamanya diucapkan.
  sceneLeadMs: 120,
} as const;

export const contentArea: React.CSSProperties = {
  position: "absolute",
  left: theme.layout.side,
  right: theme.layout.side,
  top: theme.layout.top,
  bottom: theme.layout.bottom,
};