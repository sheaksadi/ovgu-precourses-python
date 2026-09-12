<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16 overflow-y-auto">
    <!-- Header -->
    <div class="mb-6 anim-fade-in-up">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Animation: Emphasis
      </h2>
      <div class="w-16 h-1.5 rounded-full mt-3 mb-2" style="background: var(--mint);"></div>
      <p class="text-sm md:text-base font-medium" style="color: var(--text-dim);">
        Guiding attention through code. Emphasis reveals structure, highlights patterns, 
        and draws the eye to critical lines without disrupting flow.
      </p>
    </div>

    <!-- Scrollable content -->
    <div class="flex-grow flex flex-col gap-6 overflow-y-auto pr-2">
      
      <!-- Indicate: Line highlighting -->
      <div class="rounded-2xl p-6 flex flex-col gap-4 anim-fade-in-up anim-delay-1" style="background: var(--bg-off); border: 2px solid var(--border);">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 rounded-full" style="background: var(--coral);"></div>
            <div>
              <span class="text-sm font-bold" style="color: var(--text);">Indicate</span>
              <p class="text-xs" style="color: var(--text-dim);">"Notice this line..." — gentle pulse with border flash</p>
            </div>
          </div>
          <code class="text-[10px] px-2 py-1 rounded" style="background: var(--bg); color: var(--text-muted);">manim-indicate</code>
        </div>
        
        <!-- Code example -->
        <div class="rounded-xl overflow-hidden" style="background: var(--code-bg); border: 2px solid var(--code-border);">
          <div class="px-4 py-3 flex items-center gap-2" style="border-bottom: 1px solid var(--code-border);">
            <div class="w-3 h-3 rounded-full" style="background: var(--coral);"></div>
            <div class="w-3 h-3 rounded-full" style="background: var(--sun);"></div>
            <div class="w-3 h-3 rounded-full" style="background: var(--mint);"></div>
            <span class="ml-auto text-xs font-bold" style="color: var(--mint);">python</span>
          </div>
          <pre class="p-5 text-sm leading-relaxed" style="color: var(--code-text); font-family: 'JetBrains Mono', monospace;"><span style="color: var(--sky);">def</span> <span style="color: var(--mint);">find_max</span>(numbers):
    max_num = numbers[0]
    <span class="manim-highlight-line" style="border-left: 3px solid transparent;">for num in numbers:</span>
        if num > max_num:
            max_num = num
    return max_num</pre>
        </div>

        <p class="text-xs leading-relaxed" style="color: var(--text-dim);">
          <strong style="color: var(--text);">Use case:</strong> Drawing attention to the loop, 
          the key algorithm step. Subtle scale pulse (1 → 1.08 → 1) + mint border flash. 
          Perfect for "follow this line through the execution."
        </p>
      </div>

      <!-- Syntax highlighting with pulse -->
      <div class="rounded-2xl p-6 flex flex-col gap-4 anim-fade-in-up anim-delay-2" style="background: var(--bg-off); border: 2px solid var(--border);">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 rounded-full" style="background: var(--rose);"></div>
            <div>
              <span class="text-sm font-bold" style="color: var(--text);">Syntax Pulse</span>
              <p class="text-xs" style="color: var(--text-dim);">Emphasizing keywords or identifiers</p>
            </div>
          </div>
          <code class="text-[10px] px-2 py-1 rounded" style="background: var(--bg); color: var(--text-muted);">manim-syntax-pulse</code>
        </div>
        
        <div class="rounded-xl overflow-hidden" style="background: var(--code-bg); border: 2px solid var(--code-border);">
          <div class="px-4 py-3 flex items-center gap-2" style="border-bottom: 1px solid var(--code-border);">
            <div class="w-3 h-3 rounded-full" style="background: var(--coral);"></div>
            <div class="w-3 h-3 rounded-full" style="background: var(--sun);"></div>
            <div class="w-3 h-3 rounded-full" style="background: var(--mint);"></div>
            <span class="ml-auto text-xs font-bold" style="color: var(--mint);">python</span>
          </div>
          <pre class="p-5 text-sm leading-relaxed" style="color: var(--code-text); font-family: 'JetBrains Mono', monospace;"><span style="color: var(--sky);">class</span> <span style="color: var(--mint);">Student</span>:
    <span style="color: var(--sky);">def</span> <span style="color: var(--mint);">__init__</span>(<span class="manim-syntax-pulse">self</span>, name):
        <span class="manim-syntax-pulse">self</span>.name = name
    
    <span style="color: var(--sky);">def</span> <span style="color: var(--mint);">greet</span>(<span class="manim-syntax-pulse">self</span>):
        print(f"Hi, I'm {<span class="manim-syntax-pulse">self</span>.name}")</pre>
        </div>

        <p class="text-xs leading-relaxed" style="color: var(--text-dim);">
          <strong style="color: var(--text);">Pattern recognition:</strong> Highlighting every 
          occurrence of <code style="font-size: 0.85em; padding: 0 0.25em; border-radius: 0.25em; background: var(--code-bg); color: var(--mint);">self</code> 
          teaches the pattern. Color shifts to coral + weight increases. 2s cycle.
        </p>
      </div>

      <!-- Wiggle: Error highlighting -->
      <div class="rounded-2xl p-6 flex flex-col gap-4 anim-fade-in-up anim-delay-2" style="background: var(--bg-off); border: 2px solid var(--border);">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 rounded-full" style="background: var(--coral);"></div>
            <div>
              <span class="text-sm font-bold" style="color: var(--text);">Wiggle</span>
              <p class="text-xs" style="color: var(--text-dim);">"Something's wrong here..." — subtle shake</p>
            </div>
          </div>
          <code class="text-[10px] px-2 py-1 rounded" style="background: var(--bg); color: var(--text-muted);">manim-wiggle</code>
        </div>
        
        <div class="rounded-xl overflow-hidden" style="background: var(--code-bg); border: 2px solid var(--code-border);">
          <div class="px-4 py-3 flex items-center gap-2" style="border-bottom: 1px solid var(--code-border);">
            <div class="w-3 h-3 rounded-full" style="background: var(--coral);"></div>
            <div class="w-3 h-3 rounded-full" style="background: var(--sun);"></div>
            <div class="w-3 h-3 rounded-full" style="background: var(--mint);"></div>
            <span class="ml-auto text-xs font-bold" style="color: var(--mint);">python</span>
          </div>
          <pre class="p-5 text-sm leading-relaxed" style="color: var(--code-text); font-family: 'JetBrains Mono', monospace;">numbers = [1, 2, 3]
<span style="color: var(--sky);">for</span> i <span style="color: var(--sky);">in</span> range(len(numbers) + 1):
    <span class="inline-block px-2 py-0.5 rounded manim-wiggle" style="background: rgba(255, 107, 107, 0.2); color: var(--coral);">print(numbers[i])</span>  <span style="color: var(--text-muted);"># IndexError!</span></pre>
        </div>

        <p class="text-xs leading-relaxed" style="color: var(--text-dim);">
          <strong style="color: var(--text);">Error signaling:</strong> The problematic line 
          gently oscillates ±3°. Signals "this will fail" or "edge case alert" without being 
          aggressive. 1.5s cycle.
        </p>
      </div>

      <!-- Circumscribe: Boxing important blocks -->
      <div class="rounded-2xl p-6 flex flex-col gap-4 anim-fade-in-up anim-delay-3" style="background: var(--bg-off); border: 2px solid var(--border);">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 rounded-full" style="background: var(--sky);"></div>
            <div>
              <span class="text-sm font-bold" style="color: var(--text);">Circumscribe</span>
              <p class="text-xs" style="color: var(--text-dim);">Drawing a box around key structures</p>
            </div>
          </div>
          <code class="text-[10px] px-2 py-1 rounded" style="background: var(--bg); color: var(--text-muted);">manim-circumscribe</code>
        </div>
        
        <div class="rounded-xl overflow-hidden" style="background: var(--code-bg); border: 2px solid var(--code-border);">
          <div class="px-4 py-3 flex items-center gap-2" style="border-bottom: 1px solid var(--code-border);">
            <div class="w-3 h-3 rounded-full" style="background: var(--coral);"></div>
            <div class="w-3 h-3 rounded-full" style="background: var(--sun);"></div>
            <div class="w-3 h-3 rounded-full" style="background: var(--mint);"></div>
            <span class="ml-auto text-xs font-bold" style="color: var(--mint);">python</span>
          </div>
          <pre class="p-5 text-sm leading-relaxed" style="color: var(--code-text); font-family: 'JetBrains Mono', monospace;">data = [10, 20, 30, 40]

<span class="inline-block relative px-3 py-2">
<span class="absolute inset-0 rounded-lg manim-circumscribe pointer-events-none"></span><span style="color: var(--sky);">for</span> item <span style="color: var(--sky);">in</span> data:
    <span style="color: var(--sky);">if</span> item > 25:
        print(item)</span>

print("Done")</pre>
        </div>

        <p class="text-xs leading-relaxed" style="color: var(--text-dim);">
          <strong style="color: var(--text);">Structure emphasis:</strong> Border traces the loop block's 
          perimeter (3s cycle). Use for "remember this pattern" or "this is the key section." 
          Non-invasive — the code remains perfectly readable.
        </p>
      </div>

      <!-- Pseudo-code annotation -->
      <div class="rounded-2xl p-6 flex flex-col gap-4 anim-fade-in-up anim-delay-3" style="background: var(--bg-off); border: 2px solid var(--border);">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 rounded-full" style="background: var(--lavender);"></div>
            <div>
              <span class="text-sm font-bold" style="color: var(--text);">Side-by-Side Emphasis</span>
              <p class="text-xs" style="color: var(--text-dim);">Pseudo-code → Real code correlation</p>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <!-- Pseudo-code -->
          <div class="rounded-xl p-4" style="background: var(--bg); border: 2px solid var(--rose);">
            <div class="text-xs font-bold uppercase tracking-widest mb-3" style="color: var(--rose);">Pseudo-code</div>
            <div class="space-y-2 text-sm" style="font-family: 'JetBrains Mono', monospace; color: var(--text);">
              <div class="manim-highlight-line" style="border-left-color: var(--rose) !important;">FOR each number IN list</div>
              <div class="pl-4">IF number is even</div>
              <div class="pl-8">ADD to results</div>
              <div>RETURN results</div>
            </div>
          </div>
          
          <!-- Real code -->
          <div class="rounded-xl overflow-hidden" style="background: var(--code-bg); border: 2px solid var(--mint);">
            <div class="px-4 py-3 flex items-center gap-2" style="border-bottom: 1px solid var(--code-border);">
              <div class="w-2.5 h-2.5 rounded-full" style="background: var(--coral);"></div>
              <div class="w-2.5 h-2.5 rounded-full" style="background: var(--sun);"></div>
              <div class="w-2.5 h-2.5 rounded-full" style="background: var(--mint);"></div>
            </div>
            <pre class="p-4 text-sm leading-relaxed" style="color: var(--code-text); font-family: 'JetBrains Mono', monospace;"><span class="manim-highlight-line" style="border-left-color: var(--mint) !important;"><span style="color: var(--sky);">for</span> num <span style="color: var(--sky);">in</span> numbers:</span>
    <span style="color: var(--sky);">if</span> num % 2 == 0:
        results.append(num)
<span style="color: var(--sky);">return</span> results</pre>
          </div>
        </div>

        <p class="text-xs leading-relaxed" style="color: var(--text-dim);">
          <strong style="color: var(--text);">Teaching pattern:</strong> Both sides highlight 
          corresponding lines simultaneously. The viewer sees the conceptual structure (left) 
          map directly to syntax (right).
        </p>
      </div>

      <!-- Character-by-character reveal -->
      <div class="rounded-2xl p-6 flex flex-col gap-4 anim-fade-in-up anim-delay-4" style="background: var(--bg-off); border: 2px solid var(--border);">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 rounded-full" style="background: var(--sun);"></div>
            <div>
              <span class="text-sm font-bold" style="color: var(--text);">Character Reveal</span>
              <p class="text-xs" style="color: var(--text-dim);">Building code letter by letter</p>
            </div>
          </div>
          <code class="text-[10px] px-2 py-1 rounded" style="background: var(--bg); color: var(--text-muted);">manim-char-appear</code>
        </div>
        
        <div class="rounded-xl overflow-hidden" style="background: var(--code-bg); border: 2px solid var(--code-border);">
          <div class="px-4 py-3 flex items-center gap-2" style="border-bottom: 1px solid var(--code-border);">
            <div class="w-3 h-3 rounded-full" style="background: var(--coral);"></div>
            <div class="w-3 h-3 rounded-full" style="background: var(--sun);"></div>
            <div class="w-3 h-3 rounded-full" style="background: var(--mint);"></div>
            <span class="ml-auto text-xs font-bold" style="color: var(--mint);">python</span>
          </div>
          <pre class="p-5 text-base leading-relaxed" style="color: var(--code-text); font-family: 'JetBrains Mono', monospace;"><span style="color: var(--sky);">print</span>(<span style="color: var(--sun);">"<span class="manim-char-appear">H</span><span class="manim-char-appear char-delay-1">e</span><span class="manim-char-appear char-delay-2">l</span><span class="manim-char-appear char-delay-3">l</span><span class="manim-char-appear char-delay-4">o</span><span class="manim-char-appear char-delay-5">,</span> <span class="manim-char-appear char-delay-6">P</span><span class="manim-char-appear char-delay-7">y</span><span class="manim-char-appear char-delay-8">t</span>hon!"</span>)</pre>
        </div>

        <p class="text-xs leading-relaxed" style="color: var(--text-dim);">
          <strong style="color: var(--text);">Dramatic entrance:</strong> Each character appears 
          with 50ms stagger. Use sparingly — for the "aha moment" line or the solution reveal. 
          Creates anticipation and focus.
        </p>
      </div>

    </div>

    <!-- Principle footer -->
    <div class="mt-6 pt-6 flex gap-4 anim-fade-in anim-delay-5" style="border-top: 2px solid var(--border);">
      <div class="w-1.5 h-12 rounded-full shrink-0" style="background: var(--mint);"></div>
      <div class="flex-grow">
        <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color: var(--text-muted);">Emphasis Without Interruption</p>
        <p class="text-sm font-medium leading-relaxed" style="color: var(--text-dim);">
          The best emphasis is <strong style="color: var(--text);">barely noticeable</strong> — 
          the viewer's eye is guided without conscious awareness. Use emphasis like a teacher 
          uses inflection: to reveal structure and relationships, never to decorate.
        </p>
      </div>
    </div>
  </div>
</template>
