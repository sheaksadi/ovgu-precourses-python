<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-8 shrink-0">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Code Blocks
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--mint);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        The only dark element in the system. Catppuccin-inspired.
      </p>
    </header>

    <div class="flex-grow flex flex-col gap-6 overflow-auto">
      <!-- Code block example -->
      <div class="rounded-2xl overflow-hidden flex flex-col" style="background: var(--code-bg); border: 2px solid var(--code-border);">
        <div class="px-5 py-3 text-[11px] font-bold uppercase tracking-widest flex justify-between items-center" style="border-bottom: 1px solid var(--code-border);">
          <div class="flex gap-2">
            <div class="w-3 h-3 rounded-full" style="background: var(--coral);"></div>
            <div class="w-3 h-3 rounded-full" style="background: var(--sun);"></div>
            <div class="w-3 h-3 rounded-full" style="background: var(--mint);"></div>
          </div>
          <span style="color: var(--mint);">python</span>
        </div>
        <pre class="p-6 text-sm leading-relaxed" style="color: var(--code-text);">
# This is how code looks
name = "Python"
version = 3.12

def greet(who: str) -> str:
    return f"Hello, {who}!"

print(greet(name))</pre>
      </div>

      <!-- Spec breakdown -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="rounded-xl p-4" style="background: var(--bg-off);">
          <h4 class="text-xs font-bold mb-2" style="color: var(--text);">Surface</h4>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded" style="background: var(--code-bg);"></div>
            <code class="text-[10px]" style="color: var(--text-muted);">#1E1E2E · --code-bg</code>
          </div>
          <p class="text-[10px] mt-2" style="color: var(--text-dim);">Catppuccin Mocha base. Warm dark, not harsh black.</p>
        </div>

        <div class="rounded-xl p-4" style="background: var(--bg-off);">
          <h4 class="text-xs font-bold mb-2" style="color: var(--text);">Text</h4>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded" style="background: var(--code-text);"></div>
            <code class="text-[10px]" style="color: var(--text-muted);">#CDD6F4 · --code-text</code>
          </div>
          <p class="text-[10px] mt-2" style="color: var(--text-dim);">Light lavender grey. Easy on the eyes.</p>
        </div>

        <div class="rounded-xl p-4" style="background: var(--bg-off);">
          <h4 class="text-xs font-bold mb-2" style="color: var(--text);">Chrome</h4>
          <div class="flex items-center gap-3">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full" style="background: var(--coral);"></div>
              <div class="w-3 h-3 rounded-full" style="background: var(--sun);"></div>
              <div class="w-3 h-3 rounded-full" style="background: var(--mint);"></div>
            </div>
          </div>
          <p class="text-[10px] mt-2" style="color: var(--text-dim);">Window dots match our palette. Language label in mint.</p>
        </div>
      </div>

      <!-- Rules -->
      <div class="rounded-2xl p-5 text-xs leading-relaxed" style="background: var(--bg-off); color: var(--text-dim);">
        <span class="font-bold" style="color: var(--text);">Spec:</span>
        border-radius: 1rem · border: 2px solid #313244 · padding: 1.5rem · font-size: text-sm · line-height: relaxed · copy button sits in the header
      </div>
    </div>
  </div>
</template>
