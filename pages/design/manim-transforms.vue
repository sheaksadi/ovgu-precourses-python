<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16 overflow-y-auto">
    <!-- Header -->
    <div class="mb-8 anim-fade-in-up">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Animation: Transforms
      </h2>
      <div class="w-16 h-1.5 rounded-full mt-3 mb-2" style="background: var(--sky);"></div>
      <p class="text-sm md:text-base font-medium" style="color: var(--text-dim);">
        Revealing relationships through continuous change. The journey from one form to another 
        often teaches more than the destination.
      </p>
    </div>

    <!-- Main content -->
    <div class="flex-grow flex flex-col gap-6">
      
      <!-- ReplacementTransform: Character-level morphing -->
      <div class="rounded-2xl p-6 flex flex-col gap-4 anim-fade-in-up anim-delay-1" style="background: var(--bg-off); border: 2px solid var(--border);">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 rounded-full" style="background: var(--coral);"></div>
            <div>
              <span class="text-sm font-bold" style="color: var(--text);">ReplacementTransform</span>
              <p class="text-xs" style="color: var(--text-dim);">Morphing expressions character by character</p>
            </div>
          </div>
          <code class="text-[10px] px-2 py-1 rounded" style="background: var(--bg); color: var(--text-muted);">5s smooth</code>
        </div>

        <div class="rounded-xl p-8 flex items-center justify-center min-h-[120px] relative overflow-hidden" style="background: var(--bg);">
          <!-- From state -->
          <div class="absolute flex items-center gap-1 text-2xl font-black manim-crossfade-out" style="color: var(--coral); font-family: 'JetBrains Mono', monospace;">
            <span>n</span>
            <span>a</span>
            <span>m</span>
            <span>e</span>
            <span class="mx-1">=</span>
            <span>"</span>
            <span>P</span>
            <span>y</span>
            <span>t</span>
            <span>h</span>
            <span>o</span>
            <span>n</span>
            <span>"</span>
          </div>
          
          <!-- To state -->
          <div class="absolute flex items-center gap-1 text-2xl font-black manim-crossfade-in" style="color: var(--mint); font-family: 'JetBrains Mono', monospace;">
            <span>g</span>
            <span>r</span>
            <span>e</span>
            <span>e</span>
            <span>t</span>
            <span class="mx-1">=</span>
            <span>f</span>
            <span>"</span>
            <span>H</span>
            <span>i</span>
            <span class="mx-0.5">,</span>
            <span class="mx-1">{</span>
            <span>n</span>
            <span>a</span>
            <span>m</span>
            <span>e</span>
            <span>}</span>
            <span>"</span>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3 text-xs">
          <div class="rounded-lg p-3" style="background: var(--bg); border: 1px solid var(--border);">
            <div class="font-bold mb-1" style="color: var(--coral);">0-2s: Fade Out</div>
            <div style="color: var(--text-dim);">Original expression dissolves upward with scale</div>
          </div>
          <div class="rounded-lg p-3" style="background: var(--bg); border: 1px solid var(--border);">
            <div class="font-bold mb-1" style="color: var(--text-muted);">2-3s: Transition</div>
            <div style="color: var(--text-dim);">Brief empty state creates anticipation</div>
          </div>
          <div class="rounded-lg p-3" style="background: var(--bg); border: 1px solid var(--border);">
            <div class="font-bold mb-1" style="color: var(--mint);">3-5s: Fade In</div>
            <div style="color: var(--text-dim);">New expression materializes from below</div>
          </div>
        </div>

        <p class="text-xs leading-relaxed pt-3" style="border-top: 1px solid var(--border); color: var(--text-dim);">
          <strong style="color: var(--text);">When to use:</strong> Variable reassignment, refactoring steps, 
          expression simplification. The viewer sees these are <em>related but distinct</em> — 
          continuity of concept, not identity.
        </p>
      </div>

      <!-- Transform: Property morphing with proper sizing -->
      <div class="rounded-2xl p-6 flex flex-col gap-4 anim-fade-in-up anim-delay-2" style="background: var(--bg-off); border: 2px solid var(--border);">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 rounded-full" style="background: var(--mint);"></div>
            <div>
              <span class="text-sm font-bold" style="color: var(--text);">Transform</span>
              <p class="text-xs" style="color: var(--text-dim);">Continuous property morphing with intelligent sizing</p>
            </div>
          </div>
          <code class="text-[10px] px-2 py-1 rounded" style="background: var(--bg); color: var(--text-muted);">4s loop</code>
        </div>

        <div class="rounded-xl p-8 flex items-center justify-center min-h-[120px]" style="background: var(--bg);">
          <div class="flex items-center justify-center manim-prop-transform" style="color: white; font-size: 1.25rem; font-weight: 900;">
            <span class="block">def</span>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3">
          <div class="text-center">
            <div class="rounded-lg h-14 mb-2 flex items-center justify-center text-white text-xs font-bold" style="background: var(--coral);">
              Square
            </div>
            <div class="text-[10px] font-bold" style="color: var(--text-muted);">0.0s · Start</div>
            <div class="text-[9px] mt-0.5" style="color: var(--text-dim);">4rem × 4rem</div>
          </div>
          <div class="text-center">
            <div class="rounded-xl h-12 mb-2 flex items-center justify-center text-white text-xs font-bold" style="background: var(--sky);">
              Rect
            </div>
            <div class="text-[10px] font-bold" style="color: var(--text-muted);">1.0s</div>
            <div class="text-[9px] mt-0.5" style="color: var(--text-dim);">5rem × 3rem</div>
          </div>
          <div class="text-center">
            <div class="rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold" style="background: var(--mint);">
              Circle
            </div>
            <div class="text-[10px] font-bold" style="color: var(--text-muted);">2.0s</div>
            <div class="text-[9px] mt-0.5" style="color: var(--text-dim);">3rem dia</div>
          </div>
          <div class="text-center">
            <div class="rounded-lg h-14 mb-2 flex items-center justify-center text-white text-xs font-bold" style="background: var(--lavender);">
              Wide
            </div>
            <div class="text-[10px] font-bold" style="color: var(--text-muted);">3.0s</div>
            <div class="text-[9px] mt-0.5" style="color: var(--text-dim);">6rem × 4rem</div>
          </div>
        </div>

        <p class="text-xs leading-relaxed pt-3" style="border-top: 1px solid var(--border); color: var(--text-dim);">
          <strong style="color: var(--text);">Sizing intelligence:</strong> Transform calculates 
          final dimensions <em>before</em> animating, ensuring text content fits perfectly at every 
          keyframe. Color, shape, and size morph in harmony.
        </p>
      </div>

      <!-- MoveToTarget with bounce + CountUp -->
      <div class="grid grid-cols-2 gap-6 anim-fade-in-up anim-delay-3">
        <div class="rounded-2xl p-6 flex flex-col gap-4" style="background: var(--bg-off); border: 2px solid var(--border);">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 rounded-full" style="background: var(--rose);"></div>
            <div>
              <span class="text-sm font-bold" style="color: var(--text);">MoveToTarget</span>
              <p class="text-xs" style="color: var(--text-dim);">Smooth path with arrival bounce</p>
            </div>
          </div>

          <div class="rounded-xl p-6 flex items-center justify-center min-h-[100px] relative overflow-hidden" style="background: var(--bg);">
            <!-- Ghost positions -->
            <div class="absolute left-6 flex items-center gap-1 opacity-30">
              <div class="w-2 h-2 rounded-full" style="background: var(--border);"></div>
              <span class="text-[9px] font-bold" style="color: var(--text-muted);">start</span>
            </div>
            <div class="absolute right-6 flex items-center gap-1 opacity-30">
              <span class="text-[9px] font-bold" style="color: var(--text-muted);">target</span>
              <div class="w-2 h-2 rounded-full" style="background: var(--border);"></div>
            </div>
            
            <!-- Moving element -->
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold manim-move-target" style="background: var(--rose);">
              •
            </div>
          </div>

          <div class="text-xs leading-relaxed" style="color: var(--text-dim);">
            <strong style="color: var(--text);">4s easing with wiggle:</strong> Element travels 
            smoothly, then <em>bounces</em> twice on arrival (±2px, ±1px). Creates satisfying 
            "landed" feeling — physics-inspired.
          </div>
        </div>

        <div class="rounded-2xl p-6 flex flex-col gap-4" style="background: var(--bg-off); border: 2px solid var(--border);">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 rounded-full" style="background: var(--lavender);"></div>
            <div>
              <span class="text-sm font-bold" style="color: var(--text);">CountUp</span>
              <p class="text-xs" style="color: var(--text-dim);">Numbers that build drama</p>
            </div>
          </div>

          <div class="rounded-xl p-6 flex items-center justify-center min-h-[100px]" style="background: var(--bg);">
            <div class="flex items-baseline gap-1 manim-count-up">
              <span class="text-6xl font-black tabular-nums" style="color: var(--lavender);" id="count-display">42</span>
              <span class="text-xl font-bold" style="color: var(--text-muted);">%</span>
            </div>
          </div>

          <div class="text-xs leading-relaxed" style="color: var(--text-dim);">
            <strong style="color: var(--text);">Earned, not declared:</strong> Counter ticks 
            from 0→42 over 2.5s with ease-out. Each digit change has subtle scale pulse. 
            Use for stats, scores, iteration counts.
          </div>
        </div>
      </div>
    </div>

    <!-- Technical principle -->
    <div class="mt-8 pt-6 flex gap-4 anim-fade-in anim-delay-5" style="border-top: 2px solid var(--border);">
      <div class="w-1.5 h-full min-h-[60px] rounded-full shrink-0" style="background: var(--sky);"></div>
      <div class="flex-grow">
        <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color: var(--text-muted);">Transform Rules</p>
        <p class="text-sm font-medium leading-relaxed mb-3" style="color: var(--text-dim);">
          <strong style="color: var(--text);">(1) Continuity</strong> — no sudden jumps, every frame is valid; 
          <strong style="color: var(--text);">(2) Specificity</strong> — transition explicit properties 
          (transform, opacity, color), never <code style="font-size: 0.85em; padding: 0 0.25em; border-radius: 0.25em; background: var(--bg-off);">all</code>; 
          <strong style="color: var(--text);">(3) GPU acceleration</strong> — 
          prefer transform/opacity over width/height/position.
        </p>
        <div class="flex items-center gap-6 text-[11px]">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-sm" style="background: var(--mint);"></div>
            <span style="color: var(--text-muted);">Fast: <strong style="color: var(--text);">transform, opacity</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-sm" style="background: var(--coral);"></div>
            <span style="color: var(--text-muted);">Slow: <strong style="color: var(--text);">width, height, top, left</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-sm" style="background: var(--sky);"></div>
            <span style="color: var(--text-muted);">Duration: <strong style="color: var(--text);">400-1200ms ideal</strong></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

let countInterval = null

onMounted(() => {
  // CountUp animation
  const display = document.getElementById('count-display')
  if (display) {
    let current = 0
    const target = 42
    const duration = 2500
    const fps = 30
    const totalFrames = (duration / 1000) * fps
    const increment = target / totalFrames
    
    const startTime = Date.now()
    
    countInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      current = Math.floor(eased * target)
      
      display.textContent = current
      
      if (progress >= 1) {
        display.textContent = target
        clearInterval(countInterval)
        
        // Restart after 2s pause
        setTimeout(() => {
          current = 0
          display.textContent = '0'
          const newStart = Date.now()
          countInterval = setInterval(() => {
            const newElapsed = Date.now() - newStart
            const newProgress = Math.min(newElapsed / duration, 1)
            const newEased = 1 - Math.pow(1 - newProgress, 3)
            current = Math.floor(newEased * target)
            display.textContent = current
            if (newProgress >= 1) {
              display.textContent = target
              clearInterval(countInterval)
            }
          }, 1000 / fps)
        }, 2000)
      }
    }, 1000 / fps)
  }
})

onBeforeUnmount(() => {
  if (countInterval) {
    clearInterval(countInterval)
  }
})
</script>
