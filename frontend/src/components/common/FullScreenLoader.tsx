function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-5 bg-white/40 backdrop-blur-[25px]">

      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-slate-300 border-t-blue-500 border-r-blue-400 animate-spin"></div>

        <span className="text-3xl font-bold tracking-wider text-slate-800">
          S
        </span>
      </div>

      <h2 className="text-2xl font-bold tracking-[0.3em] text-slate-800">
        ShopAdmin
      </h2>

      <p className="text-sm font-medium text-slate-600 animate-pulse">
        Signing you in...
      </p>

    </div>
  );
}

export default FullScreenLoader;