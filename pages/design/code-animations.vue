<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16 overflow-y-auto">
    <!-- Header -->
    <div class="mb-6 anim-fade-in-up">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Code Animation Patterns
      </h2>
      <div class="w-16 h-1.5 rounded-full mt-3 mb-2" style="background: var(--mint);"></div>
      <p class="text-sm md:text-base font-medium" style="color: var(--text-dim);">
        Transforming pseudo-code into real syntax. These patterns bridge conceptual understanding 
        and practical implementation through smooth, educational animations.
      </p>
    </div>

    <!-- Main content -->
    <div class="flex-grow flex flex-col gap-6 overflow-y-auto pr-2">
      
      <!-- Pattern 1: Pseudo-code block to code block -->
      <div class="rounded-2xl p-6 flex flex-col gap-4 anim-fade-in-up anim-delay-1" style="background: var(--bg-off); border: 2px solid var(--border);">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-1 h-8 rounded-full" style="background: var(--coral);"></div>
          <div>
            <span class="text-sm font-bold" style="color: var(--text);">Pattern: Block Transform</span>
            <p class="text-xs" style="color: var(--text-dim);">Entire pseudo-code block morphs into syntax</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <!-- Before: Pseudo-code -->
          <div class="rounded-xl p-5 space-y-2" style="background: var(--rose); color: white; font-family: 'JetBrains Mono', monospace;">
            <div class="text-xs font-bold uppercase tracking-widest opacity-70">Pseudo-code</div>
            <div class="text-sm font-bold leading-relaxed">
              <div>FOR each student IN class:</div>
              <div class="pl-4">IF student.grade ≥ 60:</div>
              <div class="pl-8">PRINT "Pass"</div>
              <div class="pl-4">ELSE:</div>
              <div class="pl-8">PRINT "Fail"</div>
            </div>
          </div>

          <!-- After: Real code -->
          <div class="rounded-xl overflow-hidden" style="background: var(--code-bg); border: 2px solid var(--code-border);">
            <div class="px-4 py-2 flex items-center gap-2" style="border-bottom: 1px solid var(--code-border);">
              <div class="w-2.5 h-2.5 rounded-full" style="background: var(--coral);"></div>
              <div class="w-2.5 h-2.5 rounded-full" style="background: var(--sun);"></div>
              <div class="w-2.5 h-2.5 rounded-full" style="background: var(--mint);"></div>
              <span class="ml-auto text-[10px] font-bold" style="color: var(--mint);">python</span>
            </div>
            <pre class="p-5 text-sm leading-relaxed" style="color: var(--code-text); font-family: 'JetBrains Mono', monospace;"><span style="color: var(--sky);">for</span> student <span style="color: var(--sky);">in</span> class_list:
    <span style="color: var(--sky);">if</span> student.grade >= 60:
        print(<span style="color: var(--sun);">"Pass"</span>)
    <span style="color: var(--sky);">else</span>:
        print(<span style="color: var(--sun);">"Fail"</span>)</pre>
          </div>
        </div>

        <div class="flex items-center gap-4 pt-3" style="border-top: 1px solid var(--border);">
          <div class="text-xs" style="color: var(--text-dim);">
            <strong style="color: var(--text);">Animation:</strong> Left block scales + fades out (0.8s) 
            → brief pause → right block scales + fades in (0.8s). Use <code style="font-size: 0.85em; padding: 0 0.25em; border-radius: 0.25em; background: var(--bg);">manim-pseudo-to-code</code> 
            for smooth color/background/padding morph.
          </div>
        </div>
      </div>

      <!-- Pattern 2: Line-by-line correspondence -->
      <div class="rounded-2xl p-6 flex flex-col gap-4 anim-fade-in-up anim-delay-2" style="background: var(--bg-off); border: 2px solid var(--border);">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-1 h-8 rounded-full" style="background: var(--sky);"></div>
          <div>
            <span class="text-sm font-bold" style="color: var(--text);">Pattern: Line Correlation</span>
            <p class="text-xs" style="color: var(--text-dim);">Side-by-side with synchronized highlighting</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <!-- Pseudo-code with highlight -->
          <div class="rounded-xl p-5 space-y-1" style="background: var(--bg); border: 2px solid var(--lavender); font-family: 'JetBrains Mono', monospace;">
            <div class="text-[10px] font-bold uppercase tracking-widest mb-2" style="color: var(--lavender);">Logic</div>
            <div class="text-sm" style="color: var(--text);">
              <div class="py-1">INITIALIZE counter = 0</div>
              <div class="py-1 manim-highlight-line" style="border-left-color: var(--lavender) !important;">WHILE counter < 10:</div>
              <div class="pl-4 py-1">INCREMENT counter</div>
              <div class="py-1">RETURN counter</div>
            </div>
          </div>

          <!-- Code with synchronized highlight -->
          <div class="rounded-xl overflow-hidden" style="background: var(--code-bg); border: 2px solid var(--mint);">
            <div class="px-4 py-2 flex items-center gap-2" style="border-bottom: 1px solid var(--code-border);">
              <div class="w-2.5 h-2.5 rounded-full" style="background: var(--coral);"></div>
              <div class="w-2.5 h-2.5 rounded-full" style="background: var(--sun);"></div>
              <div class="w-2.5 h-2.5 rounded-full" style="background: var(--mint);"></div>
            </div>
            <pre class="p-5 text-sm leading-relaxed" style="color: var(--code-text); font-family: 'JetBrains Mono', monospace;">counter = 0
<span class="manim-highlight-line" style="border-left-color: var(--mint) !important;"><span style="color: var(--sky);">while</span> counter < 10:</span>
    counter += 1
<span style="color: var(--sky);">return</span> counter</pre>
          </div>
        </div>

        <div class="text-xs pt-3" style="border-top: 1px solid var(--border); color: var(--text-dim);">
          <strong style="color: var(--text);">Teaching moment:</strong> Both sides highlight 
          corresponding lines simultaneously. The loop line pulses in sync — viewer sees the 
          conceptual structure (left) map to syntax (right). 3s cycle with <code style="font-size: 0.85em; padding: 0 0.25em; border-radius: 0.25em; background: var(--bg);">manim-highlight-line</code>.
        </div>
      </div>

      <!-- Pattern 3: Colored block morphing -->
      <div class="rounded-2xl p-6 flex flex-col gap-4 anim-fade-in-up anim-delay-3" style="background: var(--bg-off); border: 2px solid var(--border);">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-1 h-8 rounded-full" style="background: var(--rose);"></div>
          <div>
            <span class="text-sm font-bold" style="color: var(--text);">Pattern: Colored Blocks</span>
            <p class="text-xs" style="color: var(--text-dim);">Visual blocks for control flow structures</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Colored pseudo blocks -->
          <div class="flex-1 space-y-3">
            <div class="rounded-lg p-4 text-sm font-bold text-center" style="background: var(--coral); color: white;">
              CHECK condition
            </div>
            <div class="flex gap-3">
              <div class="flex-1 rounded-lg p-3 text-xs font-bold text-center" style="background: var(--mint); color: white;">
                IF TRUE:<br/>do this
              </div>
              <div class="flex-1 rounded-lg p-3 text-xs font-bold text-center" style="background: var(--sky); color: white;">
                IF FALSE:<br/>do that
              </div>
            </div>
          </div>

          <!-- Arrow -->
          <div class="text-3xl font-black" style="color: var(--text-muted);">→</div>

          <!-- Code version -->
          <div class="flex-1 rounded-xl overflow-hidden" style="background: var(--code-bg); border: 2px solid var(--code-border);">
            <pre class="p-4 text-sm leading-relaxed" style="color: var(--code-text); font-family: 'JetBrains Mono', monospace;"><span style="color: var(--sky);">if</span> condition:
    do_this()
<span style="color: var(--sky);">else</span>:
    do_that()</pre>
          </div>
        </div>

        <div class="text-xs pt-3" style="border-top: 1px solid var(--border); color: var(--text-dim);">
          <strong style="color: var(--text);">Visual scaffolding:</strong> Color-coded blocks 
          represent control flow visually before introducing syntax. Coral = condition check, 
          Mint = true branch, Sky = false branch. Helps beginners see <em>structure</em> before syntax.
        </div>
      </div>

      <!-- Pattern 4: Step-by-step reveal -->
      <div class="rounded-2xl p-6 flex flex-col gap-4 anim-fade-in-up anim-delay-3" style="background: var(--bg-off); border: 2px solid var(--border);">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-1 h-8 rounded-full" style="background: var(--lavender);"></div>
          <div>
            <span class="text-sm font-bold" style="color: var(--text);">Pattern: Progressive Disclosure</span>
            <p class="text-xs" style="color: var(--text-dim);">Building complexity one layer at a time</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Step 1 -->
          <div class="flex items-center gap-4">
            <div class="text-xs font-bold px-3 py-1 rounded-full" style="background: var(--lavender); color: white;">Step 1</div>
            <div class="flex-1 rounded-lg p-3 text-sm" style="background: var(--bg); border: 2px solid var(--border); font-family: 'JetBrains Mono', monospace;">
              <span style="color: var(--sky);">for</span> item <span style="color: var(--sky);">in</span> items:
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex items-center gap-4">
            <div class="text-xs font-bold px-3 py-1 rounded-full" style="background: var(--lavender); color: white;">Step 2</div>
            <div class="flex-1 rounded-lg p-3 text-sm" style="background: var(--bg); border: 2px solid var(--border); font-family: 'JetBrains Mono', monospace;">
              <span style="color: var(--sky);">for</span> item <span style="color: var(--sky);">in</span> items:<br/>
              <span class="pl-4" style="color: var(--sky);">if</span> item > 0:
            </div>
          </div>

          <!-- Step 3 -->
          <div class="flex items-center gap-4">
            <div class="text-xs font-bold px-3 py-1 rounded-full" style="background: var(--lavender); color: white;">Step 3</div>
            <div class="flex-1 rounded-lg p-3 text-sm" style="background: var(--bg); border: 2px solid var(--border); font-family: 'JetBrains Mono', monospace;">
              <span style="color: var(--sky);">for</span> item <span style="color: var(--sky);">in</span> items:<br/>
              <span class="pl-4" style="color: var(--sky);">if</span> item > 0:<br/>
              <span class="pl-8">results.append(item)</span>
            </div>
          </div>
        </div>

        <div class="text-xs pt-3" style="border-top: 1px solid var(--border); color: var(--text-dim);">
          <strong style="color: var(--text);">Cognitive scaffolding:</strong> Each step adds 
          one new line with <code style="font-size: 0.85em; padding: 0 0.25em; border-radius: 0.25em; background: var(--bg);">manim-char-appear</code> stagger. 
          Viewer builds the complete structure incrementally. Perfect for nested loops, 
          complex conditions, or unfamiliar patterns.
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div class="mt-6 pt-6 flex gap-4 anim-fade-in anim-delay-5" style="border-top: 2px solid var(--border);">
      <div class="w-1.5 h-12 rounded-full shrink-0" style="background: var(--mint);"></div>
      <div class="flex-grow">
        <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color: var(--text-muted);">Pseudo-code as Bridge</p>
        <p class="text-sm font-medium leading-relaxed" style="color: var(--text-dim);">
          Pseudo-code animations lower the <strong style="color: var(--text);">syntax barrier</strong>. 
          Beginners first understand the <em>logic</em>, then see how it maps to real code. 
          The transformation animation creates a mental link between concept and implementation.
        </p>
      </div>
    </div>
  </div>
</template>
