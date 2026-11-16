
export default function HeroSection() {
  return (
    <section
      id="home"
      className="overflow-hidden bg-[#f8f7f4]"
    >
      <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 lg:px-8 lg:py-20">

        {/* Left: Hero content */}
        <div className="max-w-xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#987b5c]">
            Discover a better way to shop
          </p>

          <h1 className="text-5xl font-medium leading-[1.12] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
            Everyday living,
            <span className="mt-2 block font-serif italic text-[#987b5c]">
              beautifully curated.
            </span>
          </h1>

          <p className="mt-7 max-w-md text-base leading-8 text-gray-600">
            Explore a thoughtful collection of products designed
            to bring quality, comfort and style into your everyday life.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#categories"
              className="inline-flex items-center justify-center bg-gray-950 px-8 py-4 text-sm font-medium text-white transition hover:bg-[#987b5c]"
            >
              Explore Collection
              <span className="ml-3">→</span>
            </a>

            <a
              href="#featured"
              className="text-sm font-medium text-gray-800 underline underline-offset-4 transition hover:text-[#987b5c]"
            >
              Discover what's new
            </a>
          </div>

          <div className="mt-14 flex items-center gap-4 border-t border-gray-200 pt-6">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Thoughtfully selected
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Quality meets everyday living.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Hero image */}
        <div className="relative">
          <div className="absolute -right-5 -top-5 h-32 w-32 border border-[#d8c8b4] md:-right-8 md:-top-8" />

          <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e5df]">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&auto=format&fit=crop&q=85"
              alt="Beautifully curated modern living space"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute -bottom-5 -left-5 bg-white px-6 py-5 shadow-lg md:-left-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
              The NIVORA Edit
            </p>
            <p className="mt-2 font-serif text-xl text-gray-900">
              Made for your lifestyle.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
