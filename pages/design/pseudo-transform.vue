<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16 overflow-y-auto">
    <!-- Header -->
    <div class="mb-6 anim-fade-in-up">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Pseudo → Python Transform
      </h2>
      <div class="w-16 h-1.5 rounded-full mt-3 mb-2" style="background: var(--rose);"></div>
      <p class="text-sm md:text-base font-medium" style="color: var(--text-dim);">
        Step-by-step morphing from plain English logic to executable Python. These transforms 
        make syntax learnable by showing the continuous path from concept to code.
      </p>
    </div>

    <!-- Main content -->
    <div class="flex-grow flex flex-col gap-6 overflow-y-auto pr-2">
      
      <!-- Transform 1: Variables and Assignment -->
      <div class="rounded-2xl p-6 flex flex-col gap-4 anim-fade-in-up anim-delay-1" style="background: var(--bg-off); border: 2px solid var(--border);">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 rounded-full" style="background: var(--coral);"></div>
            <div>
              <span class="text-sm font-bold" style="color: var(--text);">Variables & Assignment</span>
              <p class="text-xs" style="color: var(--text-dim);">From "store" to "=" operator</p>
            </div>
          </div>
          <code class="text-[10px] px-2 py-1 rounded font-bold" style="background: var(--bg); color: var(--text-muted);">3s morph</code>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <!-- Stage 1: Plain English -->
          <div class="rounded-xl p-5 flex flex-col gap-3" style="background: var(--rose);">
            <div class="text-[10px] font-bold uppercase tracking-widest" style="color: rgba(255,255,255,0.7);">Plain English</div>
            <div class="text-sm font-bold leading-relaxed" style="color: white; font-family: 'JetBrains Mono', monospace;">
              STORE value 42<br/>
              INTO name
            </div>
          </div>

          <!-- Stage 2: Structured Pseudo -->
          <div class="rounded-xl p-5 flex flex-col gap-3" style="background: var(--lavender);">
            <div class="text-[10px] font-bold uppercase tracking-widest" style="color: rgba(255,255,255,0.7);">Structured</div>
            <div class="text-sm font-bold leading-relaxed" style="color: white; font-family: 'JetBrains Mono', monospace;">
              name ← 42
            </div>
          </div>

          <!-- Stage 3: Python -->
          <div class="rounded-xl overflow-hidden" style="background: var(--code-bg); border: 2px solid var(--mint);">
            <div class="px-3 py-2 flex items-center gap-1.5" style="border-bottom: 1px solid var(--code-border);">
              <div class="w-2 h-2 rounded-full" style="background: var(--coral);"></div>
              <div class="w-2 h-2 rounded-full" style="background: var(--sun);"></div>
              <div class="w-2 h-2 rounded-full" style="background: var(--mint);"></div>
            </div>
            <pre class="p-5 text-sm leading-relaxed" style="color: var(--mint); font-family: 'JetBrains Mono', monospace;">name = 42</pre>
          </div>
        </div>

        <div class="text-xs leading-relaxed pt-3" style="border-top: 1px solid var(--border); color: var(--text-dim);">
          <strong style="color: var(--text);">Transform sequence:</strong> Rose → Lavender → Code-bg. 
          "STORE...INTO" shrinks to "←" (1s), then "←" morphs to "=" (1s). Color, padding, 
          and font-weight all interpolate smoothly.
        </div>
      </div>

      <!-- Transform 2: Conditionals -->
      <div class="rounded-2xl p-6 flex flex-col gap-4 anim-fade-in-up anim-delay-2" style="background: var(--bg-off); border: 2px solid var(--border);">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 rounded-full" style="background: var(--sky);"></div>
            <div>
              <span class="text-sm font-bold" style="color: var(--text);">Conditional Logic</span>
              <p class="text-xs" style="color: var(--text-dim);">Building if/else structure step by step</p>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <!-- Step 1: Question format -->
          <div class="flex items-center gap-4">
            <div class="text-xs font-bold px-3 py-1.5 rounded-full shrink-0" style="background: var(--coral); color: white;">Step 1</div>
            <div class="flex-1 rounded-lg p-4 text-sm font-bold" style="background: var(--coral); color: white; font-family: 'JetBrains Mono', monospace;">
              IS temperature greater than 30?
            </div>
          </div>

          <!-- Step 2: IF structure -->
          <div class="flex items-center gap-4">
            <div class="text-xs font-bold px-3 py-1.5 rounded-full shrink-0" style="background: var(--sky); color: white;">Step 2</div>
            <div class="flex-1 rounded-lg p-4 text-sm font-bold" style="background: var(--sky); color: white; font-family: 'JetBrains Mono', monospace;">
              IF temperature > 30:<br/>
              <span class="pl-4">THEN say "Hot"</span>
            </div>
          </div>

          <!-- Step 3: IF/ELSE structure -->
          <div class="flex items-center gap-4">
            <div class="text-xs font-bold px-3 py-1.5 rounded-full shrink-0" style="background: var(--mint); color: white;">Step 3</div>
            <div class="flex-1 rounded-lg p-4 text-sm font-bold" style="background: var(--mint); color: white; font-family: 'JetBrains Mono', monospace;">
              IF temperature > 30:<br/>
              <span class="pl-4">say "Hot"</span><br/>
              ELSE:<br/>
              <span class="pl-4">say "Cold"</span>
            </div>
          </div>

          <!-- Step 4: Python syntax -->
          <div class="flex items-center gap-4">
            <div class="text-xs font-bold px-3 py-1.5 rounded-full shrink-0" style="background: var(--lavender); color: white;">Step 4</div>
            <div class="flex-1 rounded-xl overflow-hidden" style="background: var(--code-bg); border: 2px solid var(--code-border);">
              <div class="px-3 py-2 flex items-center gap-1.5" style="border-bottom: 1px solid var(--code-border);">
                <div class="w-2 h-2 rounded-full" style="background: var(--coral);"></div>
                <div class="w-2 h-2 rounded-full" style="background: var(--sun);"></div>
                <div class="w-2 h-2 rounded-full" style="background: var(--mint);"></div>
              </div>
              <pre class="p-4 text-sm leading-relaxed" style="color: var(--code-text); font-family: 'JetBrains Mono', monospace;"><span style="color: var(--sky);">if</span> temperature > 30:
    print(<span style="color: var(--sun);">"Hot"</span>)
<span style="color: var(--sky);">else</span>:
    print(<span style="color: var(--sun);">"Cold"</span>)</pre>
            </div>
          </div>
        </div>

        <div class="text-xs leading-relaxed pt-3" style="border-top: 1px solid var(--border); color: var(--text-dim);">
          <strong style="color: var(--text);">Progressive refinement:</strong> Each step adds 
          structure. Natural language → IF/THEN → IF/ELSE → Python. Keywords transform: 
          "IS...?" → "IF...:" → "if...:", "THEN say" → "say" → "print()". 
          Timing: 1.5s per step.
        </div>
      </div>

      <!-- Transform 3: Loops -->
      <div class="rounded-2xl p-6 flex flex-col gap-4 anim-fade-in-up anim-delay-2" style="background: var(--bg-off); border: 2px solid var(--border);">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 rounded-full" style="background: var(--mint);"></div>
            <div>
              <span class="text-sm font-bold" style="color: var(--text);">Loop Structures</span>
              <p class="text-xs" style="color: var(--text-dim);">From repetition concept to for-loop syntax</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <!-- Left: Visual blocks -->
          <div class="space-y-4">
            <div class="rounded-lg p-4 text-sm font-bold text-center" style="background: var(--rose); color: white;">
              REPEAT for each item
            </div>
            <div class="rounded-lg p-6 text-sm font-bold text-center" style="background: var(--lavender); color: white; border: 3px dashed white;">
              DO something<br/>with item
            </div>
            <div class="rounded-lg p-4 text-sm font-bold text-center" style="background: var(--rose); color: white;">
              CONTINUE until done
            </div>
          </div>

          <!-- Right: Evolution to Python -->
          <div class="space-y-3">
            <!-- Stage 1 -->
            <div class="rounded-lg p-3 text-xs font-bold" style="background: var(--bg); border: 2px solid var(--rose); color: var(--text); font-family: 'JetBrains Mono', monospace;">
              FOR EACH item IN list
            </div>
            
            <!-- Stage 2 -->
            <div class="rounded-lg p-3 text-xs font-bold" style="background: var(--bg); border: 2px solid var(--lavender); color: var(--text); font-family: 'JetBrains Mono', monospace;">
              for item in list:
            </div>

            <!-- Stage 3 -->
            <div class="rounded-xl overflow-hidden" style="background: var(--code-bg); border: 2px solid var(--mint);">
              <div class="px-3 py-2 flex items-center gap-1.5" style="border-bottom: 1px solid var(--code-border);">
                <div class="w-2 h-2 rounded-full" style="background: var(--coral);"></div>
                <div class="w-2 h-2 rounded-full" style="background: var(--sun);"></div>
                <div class="w-2 h-2 rounded-full" style="background: var(--mint);"></div>
              </div>
              <pre class="p-4 text-sm leading-relaxed" style="color: var(--code-text); font-family: 'JetBrains Mono', monospace;"><span style="color: var(--sky);">for</span> item <span style="color: var(--sky);">in</span> my_list:
    process(item)</pre>
            </div>
          </div>
        </div>

        <div class="text-xs leading-relaxed pt-3" style="border-top: 1px solid var(--border); color: var(--text-dim);">
          <strong style="color: var(--text);">Concept to syntax:</strong> Visual blocks emphasize 
          "container + repeated action" pattern. Text transforms: "FOR EACH...IN" → lowercase + colon. 
          Indentation appears in final stage. Colors guide the eye through structure.
        </div>
      </div>

      <!-- Transform 4: Functions -->
      <div class="rounded-2xl p-6 flex flex-col gap-4 anim-fade-in-up anim-delay-3" style="background: var(--bg-off); border: 2px solid var(--border);">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 rounded-full" style="background: var(--lavender);"></div>
            <div>
              <span class="text-sm font-bold" style="color: var(--text);">Function Definition</span>
              <p class="text-xs" style="color: var(--text-dim);">Recipe metaphor to def syntax</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <!-- Recipe card style -->
          <div class="rounded-xl p-5 space-y-3" style="background: var(--sun); border: 3px solid var(--text);">
            <div class="text-xs font-bold uppercase tracking-widest" style="color: var(--text);">Recipe Card</div>
            <div class="text-sm font-bold" style="color: var(--text); font-family: 'JetBrains Mono', monospace;">
              <div class="mb-2">NAME: Add Two Numbers</div>
              <div class="mb-2">INGREDIENTS: a, b</div>
              <div class="mb-2">STEPS:</div>
              <div class="pl-4">1. Calculate sum</div>
              <div class="pl-4">2. Return result</div>
            </div>
          </div>

          <!-- Python function -->
          <div class="rounded-xl overflow-hidden" style="background: var(--code-bg); border: 2px solid var(--mint);">
            <div class="px-4 py-3 flex items-center gap-2" style="border-bottom: 1px solid var(--code-border);">
              <div class="w-3 h-3 rounded-full" style="background: var(--coral);"></div>
              <div class="w-3 h-3 rounded-full" style="background: var(--sun);"></div>
              <div class="w-3 h-3 rounded-full" style="background: var(--mint);"></div>
              <span class="ml-auto text-xs font-bold" style="color: var(--mint);">python</span>
            </div>
            <pre class="p-5 text-sm leading-relaxed" style="color: var(--code-text); font-family: 'JetBrains Mono', monospace;"><span style="color: var(--sky);">def</span> <span style="color: var(--mint);">add_two_numbers</span>(a, b):
    <span style="color: var(--text-dim);">"""Calculate sum"""</span>
    result = a + b
    <span style="color: var(--sky);">return</span> result</pre>
          </div>
        </div>

        <div class="flex items-center gap-6 pt-3 text-xs" style="border-top: 1px solid var(--border);">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded" style="background: var(--sun);"></div>
            <span style="color: var(--text-dim);">NAME → <strong style="color: var(--text);">def name</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded" style="background: var(--sun);"></div>
            <span style="color: var(--text-dim);">INGREDIENTS → <strong style="color: var(--text);">(params)</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded" style="background: var(--sun);"></div>
            <span style="color: var(--text-dim);">STEPS → <strong style="color: var(--text);">indented body</strong></span>
          </div>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div class="mt-6 pt-6 flex gap-4 anim-fade-in anim-delay-5" style="border-top: 2px solid var(--border);">
      <div class="w-1.5 h-12 rounded-full shrink-0" style="background: var(--rose);"></div>
      <div class="flex-grow">
        <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color: var(--text-muted);">Transform Principles</p>
        <p class="text-sm font-medium leading-relaxed" style="color: var(--text-dim);">
          Every transform respects <strong style="color: var(--text);">cognitive continuity</strong> — 
          the viewer never loses the thread. Color changes signal category shifts. 
          Padding/border changes signal formality increases. Font changes signal syntax arrival. 
          Total duration: 2-4s per complete transform, 0.8-1.5s per stage.
        </p>
      </div>
    </div>
  </div>
</template>
