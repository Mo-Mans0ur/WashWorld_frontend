export default function ScreenLayout({ children }) {
  return (
    <main
      className="relative flex flex-1 flex-col overflow-y-auto pb-8"
      style={{
        background: `
          linear-gradient(to right, #31854e 0%, rgba(0, 0, 0, 0) 60%),
          linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)),
          linear-gradient(90deg, var(--color-dashboard-gradient-start) 0%, var(--color-dashboard-gradient-end) 100%)
        `,
      }}
    >
      {children}
    </main>
  );
}