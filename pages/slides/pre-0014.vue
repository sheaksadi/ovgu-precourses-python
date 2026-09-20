<template>
  <div class="guide-page w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-8 shrink-0">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Typography
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--lavender);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        One font. One family. JetBrains Mono everywhere.
      </p>
    </header>

    <div class="flex-grow flex flex-col gap-6 overflow-auto">
      <!-- Font identity -->
      <div class="rounded-2xl p-6 flex items-center gap-8" style="background: var(--bg-off);">
        <div class="text-6xl font-black" style="color: var(--text);">Aa</div>
        <div class="flex flex-col gap-1">
          <span class="text-lg font-black" style="color: var(--text);">JetBrains Mono</span>
          <span class="text-xs" style="color: var(--text-dim);">Monospaced · Variable weight 100–800 · Ligatures</span>
          <span class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--lavender);">The only typeface in this system</span>
        </div>
      </div>

      <!-- Scale -->
      <div class="grid grid-cols-1 gap-3">
        <!-- Display -->
        <div class="flex items-baseline gap-6 py-2" style="border-bottom: 1px solid var(--border);">
          <code class="text-[10px] w-24 shrink-0 font-bold" style="color: var(--text-muted);">Display</code>
          <span class="text-5xl md:text-7xl font-black tracking-tight" style="color: var(--text);">Python</span>
          <code class="text-[10px] font-bold ml-auto" style="color: var(--text-muted);">text-7xl · font-black · tracking-tight</code>
        </div>

        <!-- H1 -->
        <div class="flex items-baseline gap-6 py-2" style="border-bottom: 1px solid var(--border);">
          <code class="text-[10px] w-24 shrink-0 font-bold" style="color: var(--text-muted);">Heading 1</code>
          <span class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">Variables</span>
          <code class="text-[10px] font-bold ml-auto" style="color: var(--text-muted);">text-5xl · font-black · tracking-tight</code>
        </div>

        <!-- H2 -->
        <div class="flex items-baseline gap-6 py-2" style="border-bottom: 1px solid var(--border);">
          <code class="text-[10px] w-24 shrink-0 font-bold" style="color: var(--text-muted);">Heading 2</code>
          <span class="text-2xl md:text-3xl font-bold" style="color: var(--text);">Data Types</span>
          <code class="text-[10px] font-bold ml-auto" style="color: var(--text-muted);">text-3xl · font-bold</code>
        </div>

        <!-- Body -->
        <div class="flex items-baseline gap-6 py-2" style="border-bottom: 1px solid var(--border);">
          <code class="text-[10px] w-24 shrink-0 font-bold" style="color: var(--text-muted);">Body</code>
          <span class="text-base md:text-xl" style="color: var(--text-dim);">A variable stores a value in memory.</span>
          <code class="text-[10px] font-bold ml-auto" style="color: var(--text-muted);">text-xl · color: text-dim</code>
        </div>

        <!-- Small -->
        <div class="flex items-baseline gap-6 py-2" style="border-bottom: 1px solid var(--border);">
          <code class="text-[10px] w-24 shrink-0 font-bold" style="color: var(--text-muted);">Small</code>
          <span class="text-xs" style="color: var(--text-dim);">Captions, hints, and annotations</span>
          <code class="text-[10px] font-bold ml-auto" style="color: var(--text-muted);">text-xs · color: text-dim</code>
        </div>

        <!-- Chrome -->
        <div class="flex items-baseline gap-6 py-2">
          <code class="text-[10px] w-24 shrink-0 font-bold" style="color: var(--text-muted);">Chrome</code>
          <span class="text-[11px] font-bold uppercase tracking-widest" style="color: var(--text-muted);">page numbers · slide ids</span>
          <code class="text-[10px] font-bold ml-auto" style="color: var(--text-muted);">text-[11px] · font-bold · uppercase · tracking-widest</code>
        </div>
      </div>

      <!-- Weight strip -->
      <div class="flex gap-3 items-end mt-2">
        <div class="flex flex-col items-center gap-1">
          <span class="text-2xl font-thin" style="color: var(--text);">Ag</span>
          <code class="text-[9px]" style="color: var(--text-muted);">100</code>
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-2xl font-light" style="color: var(--text);">Ag</span>
          <code class="text-[9px]" style="color: var(--text-muted);">300</code>
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-2xl font-normal" style="color: var(--text);">Ag</span>
          <code class="text-[9px]" style="color: var(--text-muted);">400</code>
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-2xl font-medium" style="color: var(--text);">Ag</span>
          <code class="text-[9px]" style="color: var(--text-muted);">500</code>
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-2xl font-bold" style="color: var(--text);">Ag</span>
          <code class="text-[9px]" style="color: var(--text-muted);">700</code>
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-2xl font-black" style="color: var(--text);">Ag</span>
          <code class="text-[9px]" style="color: var(--text-muted);">900</code>
        </div>
        <div class="ml-4 text-[10px] font-bold" style="color: var(--coral);">← We primarily use 700 and 900</div>
      </div>
    </div>
  </div>
</template>
