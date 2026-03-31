const LoadingPage = () => {
  return (
    <main className="portal-shell flex min-h-[calc(100vh-88px)] items-center justify-center py-12">
      <div className="glass-panel flex flex-col items-center rounded-[32px] px-10 py-12">
        <div className="portal-loader" />
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent-deep)]">
          Loading portal
        </p>
      </div>
    </main>
  );
};

export default LoadingPage;
