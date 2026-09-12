<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16 overflow-y-auto">
    <!-- Header -->
    <div class="mb-8 anim-fade-in-up">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Animation: Entrances
      </h2>
      <div class="w-16 h-1.5 rounded-full mt-3 mb-2" style="background: var(--coral);"></div>
      <p class="text-sm md:text-base font-medium" style="color: var(--text-dim);">
        Every element's first appearance should feel intentional. These entrance animations 
        establish hierarchy and guide the viewer's attention through your code narrative.
      </p>
    </div>

    <!-- Main content grid -->
    <div class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Write: Building code character by character -->
      <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-1">
        <div class="rounded-2xl p-6 flex flex-col gap-4" style="background: var(--bg-off); border: 2px solid var(--border);">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-bold uppercase tracking-widest" style="color: var(--coral);">Write</span>
            <code class="text-[10px] px-2 py-1 rounded font-bold" style="background: var(--bg); color: var(--text-muted);">1.2s</code>
          </div>
          
          <!-- Live demo -->
          <div class="rounded-xl p-6 flex items-center justify-center min-h-[100px]" style="background: var(--coral);">
            <code class="text-white text-2xl font-black manim-write">def greet(name):</code>
          </div>

          <div class="text-xs leading-relaxed" style="color: var(--text-dim);">
            <p class="font-bold mb-1" style="color: var(--text);">Building understanding, symbol by symbol</p>
            Text materializes left-to-right through clip-path reveal. Perfect for function 
            signatures, class definitions, and key statements — the audience <em>watches</em> 
            the idea form.
          </div>
          
          <div class="flex items-center gap-3 pt-2" style="border-top: 1px solid var(--border);">
            <div class="text-[10px] font-bold" style="color: var(--text-muted);">Use for: Headers, definitions</div>
          </div>
        </div>
      </div>

      <!-- FadeIn: Supporting content -->
      <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-1">
        <div class="rounded-2xl p-6 flex flex-col gap-4" style="background: var(--bg-off); border: 2px solid var(--border);">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-bold uppercase tracking-widest" style="color: var(--mint);">FadeIn</span>
            <code class="text-[10px] px-2 py-1 rounded font-bold" style="background: var(--bg); color: var(--text-muted);">0.4s</code>
          </div>
          
          <!-- Live demo -->
          <div class="rounded-xl p-6 flex items-center justify-center min-h-[100px] anim-fade-in anim-delay-2" style="background: var(--mint);">
            <div class="text-white text-sm font-medium text-center leading-relaxed px-4">
              # Process each item in the list
            </div>
          </div>

          <div class="text-xs leading-relaxed" style="color: var(--text-dim);">
            <p class="font-bold mb-1" style="color: var(--text);">Gentle, unobtrusive arrival</p>
            Pure opacity transition from 0 to 1. Use for comments, body text, explanatory 
            annotations, and secondary elements that support without competing.
          </div>
          
          <div class="flex items-center gap-3 pt-2" style="border-top: 1px solid var(--border);">
            <div class="text-[10px] font-bold" style="color: var(--text-muted);">Use for: Comments, labels, text</div>
          </div>
        </div>
      </div>

      <!-- GrowFromCenter: Badges and icons -->
      <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-2">
        <div class="rounded-2xl p-6 flex flex-col gap-4" style="background: var(--bg-off); border: 2px solid var(--border);">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-bold uppercase tracking-widest" style="color: var(--sky);">GrowFromCenter</span>
            <code class="text-[10px] px-2 py-1 rounded font-bold" style="background: var(--bg); color: var(--text-muted);">0.4s</code>
          </div>
          
          <!-- Live demo -->
          <div class="rounded-xl p-6 flex items-center justify-center min-h-[100px]" style="background: var(--bg);">
            <div class="flex gap-3">
              <div class="px-4 py-2 rounded-full text-white text-xs font-bold anim-pop-in anim-delay-2" style="background: var(--sky);">
                loop
              </div>
              <div class="px-4 py-2 rounded-full text-white text-xs font-bold anim-pop-in anim-delay-3" style="background: var(--rose);">
                beginner
              </div>
              <div class="px-4 py-2 rounded-full text-white text-xs font-bold anim-pop-in anim-delay-4" style="background: var(--lavender);">
                ⭐
              </div>
            </div>
          </div>

          <div class="text-xs leading-relaxed" style="color: var(--text-dim);">
            <p class="font-bold mb-1" style="color: var(--text);">Objects emerge with energy</p>
            Scale from 0.9 to 1 with slight elastic overshoot. Essential for badges, tags, 
            icons, and decorative elements — they pop into existence with personality.
          </div>
          
          <div class="flex items-center gap-3 pt-2" style="border-top: 1px solid var(--border);">
            <div class="text-[10px] font-bold" style="color: var(--text-muted);">Use for: Tags, badges, icons</div>
          </div>
        </div>
      </div>

      <!-- DrawBorderThenFill: Code blocks -->
      <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-2">
        <div class="rounded-2xl p-6 flex flex-col gap-4" style="background: var(--bg-off); border: 2px solid var(--border);">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-bold uppercase tracking-widest" style="color: var(--rose);">DrawBorderThenFill</span>
            <code class="text-[10px] px-2 py-1 rounded font-bold" style="background: var(--bg); color: var(--text-muted);">1.9s</code>
          </div>
          
          <!-- Live demo -->
          <div class="rounded-xl p-6 flex items-center justify-center min-h-[100px]" style="background: var(--bg);">
            <div class="rounded-lg px-5 py-3 manim-border-draw" style="border: 3px solid var(--rose); animation-delay: 0.4s;">
              <code class="text-sm font-bold manim-fill-after" style="color: var(--rose); animation-delay: 1.9s;">
                if x > 0:
              </code>
            </div>
          </div>

          <div class="text-xs leading-relaxed" style="color: var(--text-dim);">
            <p class="font-bold mb-1" style="color: var(--text);">Two-stage construction</p>
            Border traces the perimeter (1.5s), then interior content fills (0.4s). Use for 
            code blocks, containers, theorem boxes — the frame earns its right to exist.
          </div>
          
          <div class="flex items-center gap-3 pt-2" style="border-top: 1px solid var(--border);">
            <div class="text-[10px] font-bold" style="color: var(--text-muted);">Use for: Code blocks, containers</div>
          </div>
        </div>
      </div>

      <!-- Code block entrance -->
      <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-3 md:col-span-2">
        <div class="rounded-2xl p-6 flex flex-col gap-4" style="background: var(--bg-off); border: 2px solid var(--border);">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <div class="w-1 h-8 rounded-full" style="background: var(--mint);"></div>
              <div>
                <span class="text-sm font-bold" style="color: var(--text);">Complete Code Block Entrance</span>
                <p class="text-xs" style="color: var(--text-dim);">Professional entrance for syntax-highlighted code</p>
              </div>
            </div>
            <code class="text-[10px] px-2 py-1 rounded font-bold" style="background: var(--bg); color: var(--text-muted);">manim-code-block-in</code>
          </div>
          
          <!-- Live demo -->
          <div class="rounded-xl overflow-hidden manim-code-block-in anim-delay-4" style="background: var(--code-bg); border: 2px solid var(--code-border);">
            <div class="px-5 py-3 flex items-center gap-2" style="border-bottom: 1px solid var(--code-border);">
              <div class="w-3 h-3 rounded-full" style="background: var(--coral);"></div>
              <div class="w-3 h-3 rounded-full" style="background: var(--sun);"></div>
              <div class="w-3 h-3 rounded-full" style="background: var(--mint);"></div>
              <span class="ml-auto text-xs font-bold" style="color: var(--mint);">python</span>
            </div>
            <pre class="p-6 text-sm leading-relaxed" style="color: var(--code-text); font-family: 'JetBrains Mono', monospace;"><span style="color: var(--sky);">def</span> <span style="color: var(--mint);">fibonacci</span>(n):
    <span style="color: var(--sky);">if</span> n <= 1:
        <span style="color: var(--sky);">return</span> n
    <span style="color: var(--sky);">return</span> fibonacci(n-1) + fibonacci(n-2)</pre>
          </div>

          <div class="text-xs leading-relaxed" style="color: var(--text-dim);">
            <p class="font-bold mb-1" style="color: var(--text);">Full-block entrance with blur reveal</p>
            Entire code block fades in from 12px translateY + 4px blur → sharp and in-place. 
            Smooth 0.8s ease with cubic bezier. Use for complete code examples that need drama.
          </div>
        </div>
      </div>

    </div>

    <!-- Educational principle footer -->
    <div class="mt-8 pt-6 flex gap-4 anim-fade-in anim-delay-5" style="border-top: 2px solid var(--border);">
      <div class="w-1.5 h-full min-h-[60px] rounded-full shrink-0" style="background: var(--coral);"></div>
      <div class="flex-grow">
        <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color: var(--text-muted);">Entrance Philosophy</p>
        <p class="text-sm font-medium leading-relaxed mb-3" style="color: var(--text-dim);">
          Every entrance animation serves the <strong style="color: var(--text);">cognitive hierarchy</strong>. 
          Important elements (function names, definitions) use <strong style="color: var(--text);">Write</strong>. 
          Supporting content uses <strong style="color: var(--text);">FadeIn</strong>. 
          Visual accents use <strong style="color: var(--text);">Grow</strong>. 
          Containers <strong style="color: var(--text);">Draw then Fill</strong>. 
          Nothing appears by accident — the entrance tells the viewer what matters.
        </p>
        <div class="flex items-center gap-6 text-[11px]">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-sm" style="background: var(--coral);"></div>
            <span style="color: var(--text-muted);">Primary: <strong style="color: var(--text);">Write (1.2s)</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-sm" style="background: var(--mint);"></div>
            <span style="color: var(--text-muted);">Secondary: <strong style="color: var(--text);">FadeIn (0.4s)</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-sm" style="background: var(--sky);"></div>
            <span style="color: var(--text-muted);">Accent: <strong style="color: var(--text);">Grow (0.4s)</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-sm" style="background: var(--rose);"></div>
            <span style="color: var(--text-muted);">Container: <strong style="color: var(--text);">Draw→Fill (1.9s)</strong></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
