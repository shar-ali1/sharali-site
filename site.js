/* Shar Ali Portfolio effects — paste into WPCode as a JavaScript Snippet.
   Set insertion to Auto Insert → Site Wide Footer or Footer. */
(function(){
  var shBootTries = 0;
  function bootSharPortfolio(){
    var root = document.getElementById('shar-site');
    if(!root){
      shBootTries++;
      if(shBootTries < 80) setTimeout(bootSharPortfolio, 100);
      return;
    }
    if(root.dataset.shInit) return;
    root.dataset.shInit = '1';
    root.classList.add('sh-js-ready');
var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- single rAF-throttled scroll dispatcher ----------
     one listener, at most one layout pass per frame — replaces the
     six independent scroll listeners that each forced layout reads */
  var shScrollFns = [], shScrollQueued = false;
  function shOnScroll(fn){ shScrollFns.push(fn); }
  window.addEventListener('scroll', function(){
    if(shScrollQueued) return;
    shScrollQueued = true;
    requestAnimationFrame(function(){
      shScrollQueued = false;
      for(var i=0;i<shScrollFns.length;i++) shScrollFns[i]();
    });
  }, {passive:true});

  /* ---------- rotating hero words ---------- */
  var SH_WORDS = ['AI Engineer in Training','Agentic Systems Builder','Eval-Driven Developer','CS Student @ UIC','Problem Solver'];
  var wordEl = root.querySelector('.sh-word'), wi = 0;
  if(wordEl){
    setInterval(function(){
      wi = (wi+1) % SH_WORDS.length;
      wordEl.style.animation = 'none'; void wordEl.offsetWidth;
      wordEl.textContent = SH_WORDS[wi];
      wordEl.style.animation = 'shWordIn .5s ease both';
    }, 2300);
  }

  /* ---------- smooth anchor scroll (offset for sticky nav) ---------- */
  var nav = document.getElementById('sh-nav');
  function navH(){ return nav ? nav.offsetHeight : 64; }
  root.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if(!a) return;
    var id = a.getAttribute('href');
    if(id === '#' ) return;
    var tgt = root.querySelector(id);
    if(!tgt) return;
    e.preventDefault();
    closeMobile();
    var y = tgt.getBoundingClientRect().top + window.pageYOffset - (id === '#hero' ? 0 : navH() - 1);
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ---------- sticky nav shadow ---------- */
  function onScrollNav(){ if(nav) nav.classList.toggle('sh-scrolled', window.pageYOffset > 12); }
  onScrollNav();
  shOnScroll(onScrollNav);

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('sh-burger'), mobile = document.getElementById('sh-mobile');
  function closeMobile(){ if(mobile) mobile.classList.remove('sh-open'); }
  function toggleMobile(){ if(mobile) mobile.classList.toggle('sh-open'); }
  if(burger){
    burger.addEventListener('click', toggleMobile);
    burger.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggleMobile(); } });
  }

  /* ---------- scroll reveal (position-aware; pops items in as they enter) ---------- */
  var revs = Array.prototype.slice.call(root.querySelectorAll('.sh-reveal'));
  function revealCheck(){
    var vh = window.innerHeight;
    for(var i=0;i<revs.length;i++){
      var el = revs[i];
      if(el.classList.contains('sh-in')) continue;
      var r = el.getBoundingClientRect();
      if(r.top < vh * 0.9 && r.bottom > 0){
        var sib = el.parentNode ? el.parentNode.querySelectorAll(':scope > .sh-reveal') : [el];
        var idx = Array.prototype.indexOf.call(sib, el);
        el.style.transitionDelay = Math.min(idx, 5) * 90 + 'ms';
        el.classList.add('sh-in');
      }
    }
  }
  revealCheck();
  shOnScroll(revealCheck);
  window.addEventListener('resize', revealCheck);

  /* ---------- active-section highlighting ---------- */
  var links = Array.prototype.slice.call(root.querySelectorAll('.sh-navlinks a'));
  var map = {};
  links.forEach(function(l){ var id=l.getAttribute('href'); if(id && id.indexOf('#')===0){ var s=root.querySelector(id); if(s) map[id]=l; } });
  var sections = Object.keys(map).map(function(id){ return root.querySelector(id); });
  if('IntersectionObserver' in window){
    var so = new IntersectionObserver(function(ents){
      ents.forEach(function(en){
        if(en.isIntersecting){
          links.forEach(function(l){ l.classList.remove('sh-active'); });
          var l = map['#'+en.target.id]; if(l) l.classList.add('sh-active');
        }
      });
    }, { rootMargin:'-45% 0px -50% 0px', threshold:0 });
    sections.forEach(function(s){ if(s) so.observe(s); });
    /* bottom-of-page fallback: the final (short) section can't reach the
       observer band, so force its nav link active when scrolled to the end */
    shOnScroll(function(){
      var docH = document.documentElement.scrollHeight;
      if(window.innerHeight + window.pageYOffset >= docH - 2){
        var last = sections[sections.length - 1];
        if(last){
          links.forEach(function(l){ l.classList.remove('sh-active'); });
          var l = map['#'+last.id]; if(l) l.classList.add('sh-active');
        }
      }
    });
  }

  /* ---------- hero: scroll cue fade ---------- */
  var cue = root.querySelector('.sh-cue');
  if(cue) shOnScroll(function(){ cue.style.opacity = Math.max(0, 1 - window.scrollY/260).toFixed(2); });

  /* ---------- persistent scroll indicator (shows past hero, hides at bottom) ---------- */
  var scrollcue = document.getElementById('sh-scrollcue');
  if(scrollcue){
    function cueUpdate(){
      var y = window.pageYOffset, vh = window.innerHeight;
      var docH = document.documentElement.scrollHeight;
      var nearBottom = (vh + y) >= docH - 120;
      var pastHero = y > vh * 0.30;
      scrollcue.classList.toggle('sh-cue-show', pastHero && !nearBottom);
    }
    cueUpdate();
    shOnScroll(cueUpdate);
    window.addEventListener('resize', cueUpdate);
  }

  /* ---------- JS-driven chevron bounce (WAAPI ignores reduced-motion CSS gate) ---------- */
  var bobEls = root.querySelectorAll('.sh-cue svg, .sh-scrollcue svg');
  if(bobEls.length && typeof bobEls[0].animate === 'function'){
    for(var bi=0; bi<bobEls.length; bi++){
      bobEls[bi].style.animation = 'none'; /* drop CSS anim so the two can't fight */
      bobEls[bi].animate(
        [{transform:'translateY(0)'},{transform:'translateY(7px)'},{transform:'translateY(0)'}],
        {duration:1800, iterations:Infinity, easing:'ease-in-out'}
      );
    }
  }

  /* ---------- global parallax starfield (fixed, whole page) ----------
     built AFTER first paint (load + idle) so injecting hundreds of spans
     doesn't compete with LCP for main-thread time on mobile */
  var starRoot = root.querySelector('.sh-bg'), layers = [];
  function shBuildStars(){
    var defs = [
      {strength:10,count:110,smin:0.7,smax:1.6,omin:0.30,omax:0.65,fmin:26,fmax:44},
      {strength:22,count:75,smin:1.1,smax:2.2,omin:0.48,omax:0.85,fmin:18,fmax:30},
      {strength:40,count:45,smin:1.7,smax:3.2,omin:0.68,omax:1.00,fmin:12,fmax:20}
    ];
    for(var d=0; d<defs.length; d++){
      var L = defs[d], layer = document.createElement('div'); layer.className='sh-layer'; var html='';
      for(var k=0;k<L.count;k++){
        var x=Math.random()*100, y=Math.random()*100,
            s=(L.smin+Math.random()*(L.smax-L.smin)).toFixed(2),
            o=(L.omin+Math.random()*(L.omax-L.omin)).toFixed(2),
            dur=(L.fmin+Math.random()*(L.fmax-L.fmin)).toFixed(1),
            delay=(-Math.random()*dur).toFixed(1), tw=(2.5+Math.random()*3.5).toFixed(1);
        var anim = 'animation:shFall '+dur+'s linear '+delay+'s infinite, shTwinkle '+tw+'s ease-in-out infinite;';
        html += '<span style="position:absolute;left:'+x+'%;top:'+y+'%;width:'+s+'px;height:'+s+'px;border-radius:50%;'
              + 'background:#dbe6f5;box-shadow:0 0 '+(s*3.0)+'px rgba(190,212,245,.8);opacity:'+o+';'+anim+'"></span>';
      }
      layer.innerHTML = html; starRoot.appendChild(layer); layers.push({el:layer,strength:L.strength});
    }
  }

  /* ---------- white cursor ribbon + gentle star parallax ---------- */
  /* (aurora fog removed — the headshot glow is the hero's only ambient light;
     the full-screen blur(26px) canvas it used was also the site's biggest GPU cost) */
  var oldGlow = root.querySelector('.sh-bg-glow');
  if(oldGlow && oldGlow.parentNode) oldGlow.parentNode.removeChild(oldGlow); /* legacy glow div, if the old HTML is still live */
  var oldAur = root.querySelector('.sh-aurora');
  if(oldAur && oldAur.parentNode) oldAur.parentNode.removeChild(oldAur); /* legacy aurora canvas, if cached HTML still has one */
  var trailCv = null, trailCtx = null, trailPts = [], TRAIL_LIFE = 380, TRAIL_DPR = 1;
  function shBuildTrail(){
    if(reduce || !starRoot) return;
    /* ribbon canvas sits ON TOP of the star layers */
    trailCv = document.createElement('canvas');
    trailCv.className = 'sh-trail';
    trailCv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    starRoot.appendChild(trailCv);
    trailCtx = trailCv.getContext('2d');
    var fxSize = function(){
      TRAIL_DPR = Math.min(window.devicePixelRatio || 1, 2);
      trailCv.width = Math.round(window.innerWidth * TRAIL_DPR);
      trailCv.height = Math.round(window.innerHeight * TRAIL_DPR);
    };
    fxSize();
    window.addEventListener('resize', fxSize);
  }
  {
    var t = {px:0,py:0}, c = {px:0,py:0};
    root.addEventListener('mousemove', function(e){
      t.px = (e.clientX/window.innerWidth - .5)*2; t.py = (e.clientY/window.innerHeight - .5)*2;
      if(trailCtx){
        var last = trailPts[trailPts.length-1];
        if(!last || Math.abs(e.clientX-last.x) + Math.abs(e.clientY-last.y) > 1){
          trailPts.push({x:e.clientX, y:e.clientY, t:performance.now()});
          if(trailPts.length > 48) trailPts.shift();
        }
      }
    }, {passive:true});
    var trailWasDrawn = false;
    (function tick(){
      var now = performance.now();
      /* ribbon: smooth white curve through recent cursor points; fades out at rest.
         no canvas shadowBlur — shadows are the slowest 2D-canvas op and were
         being paid on every segment, every frame. */
      if(trailCtx){
        while(trailPts.length && now - trailPts[0].t > TRAIL_LIFE) trailPts.shift();
        if(trailPts.length > 2){
          trailCtx.setTransform(TRAIL_DPR, 0, 0, TRAIL_DPR, 0, 0);
          trailCtx.clearRect(0, 0, trailCv.width, trailCv.height);
          trailCtx.lineCap = 'round'; trailCtx.lineJoin = 'round';
          for(var p=1; p<trailPts.length-1; p++){
            var p0 = trailPts[p-1], p1 = trailPts[p], p2 = trailPts[p+1];
            var f = 1 - Math.min(1, (now - p1.t)/TRAIL_LIFE);       /* 1 fresh -> 0 gone */
            trailCtx.strokeStyle = 'rgba(255,255,255,' + (0.65*f).toFixed(3) + ')';
            trailCtx.lineWidth = Math.max(0.3, 3.2*f);
            trailCtx.beginPath();
            trailCtx.moveTo((p0.x+p1.x)/2, (p0.y+p1.y)/2);
            trailCtx.quadraticCurveTo(p1.x, p1.y, (p1.x+p2.x)/2, (p1.y+p2.y)/2);
            trailCtx.stroke();
          }
          trailWasDrawn = true;
        } else if(trailWasDrawn){
          /* one final clear once the ribbon has fully faded, then idle for free */
          trailCtx.setTransform(TRAIL_DPR, 0, 0, TRAIL_DPR, 0, 0);
          trailCtx.clearRect(0, 0, trailCv.width, trailCv.height);
          trailWasDrawn = false;
        }
      }
      /* stars: gentle mouse + scroll parallax (fall animation runs independently) */
      c.px += (t.px-c.px)*.06; c.py += (t.py-c.py)*.06;
      var sc = window.pageYOffset;
      for(var i=0;i<layers.length;i++){ var st=layers[i].strength;
        var tx = c.px*st*0.4, ty = (c.py*st*0.4) - sc*(st*0.012);
        layers[i].el.style.transform = 'translate('+tx.toFixed(2)+'px,'+ty.toFixed(2)+'px)'; }
      requestAnimationFrame(tick);
    })();
  }

  /* ---------- occasional shooting star (always on) ---------- */
  function shStartMeteors(){
    if(!starRoot) return;
    function meteor(){
      var sx=4+Math.random()*52, sy=-4+Math.random()*26, len=120+Math.random()*90,
          dx=280+Math.random()*260, dy=dx*0.42, ang=Math.atan2(dy,dx)*180/Math.PI;
      var m=document.createElement('div');
      m.style.cssText='position:absolute;left:'+sx+'%;top:'+sy+'%;width:1px;height:1px;--mx:'+dx+'px;--my:'+dy+'px;'
        +'pointer-events:none;animation:shShoot '+(1+Math.random()*0.5).toFixed(2)+'s cubic-bezier(.4,.1,.7,.5) forwards;';
      var inner=document.createElement('div');
      inner.style.cssText='width:'+len+'px;height:2px;border-radius:2px;transform-origin:left center;'
        +'transform:rotate('+ang+'deg) translateX(-'+len+'px);'
        +'background:linear-gradient(90deg,rgba(220,232,248,0) 0%,rgba(220,232,248,.9) 70%,#fff 100%);'
        +'filter:drop-shadow(0 0 6px rgba(200,222,250,.8));';
      m.appendChild(inner); m.addEventListener('animationend', function(){ m.remove(); }); starRoot.appendChild(m);
    }
    (function loop(){ setTimeout(function(){ meteor(); loop(); }, 2600+Math.random()*2400); })();
  }

  /* ---------- deferred backdrop boot ----------
     stars / trail canvas / meteors are cosmetic — build them once the page
     has painted and the main thread is idle, instead of during initial load */
  function shBootBackdrop(){
    if(!starRoot || shBootBackdrop.done) return;
    shBootBackdrop.done = true;
    shBuildStars();
    shBuildTrail();
    shStartMeteors();
  }
  function shScheduleBackdrop(){
    if('requestIdleCallback' in window) requestIdleCallback(shBootBackdrop, {timeout:2500});
    else setTimeout(shBootBackdrop, 400);
  }
  if(document.readyState === 'complete') shScheduleBackdrop();
  else window.addEventListener('load', shScheduleBackdrop);

  /* ---------- side rail scroll-spy ---------- */
  var rail = document.getElementById('sh-rail');
  if(rail){
    var railItems = Array.prototype.slice.call(rail.querySelectorAll('[data-sec]'));
    var anchors = railItems.map(function(it){
      var id = it.getAttribute('data-sec');
      return { item:it, id:id, el:root.querySelector('#'+id) };
    }).filter(function(a){ return a.el; });
    var subWrap = document.getElementById('sh-rail-sub');
    /* cache section offsets — measuring them per scroll event forced a
       full layout pass for every anchor on every frame */
    var railTops = [];
    function railMeasure(){
      railTops = anchors.map(function(a){ return a.el.getBoundingClientRect().top + window.pageYOffset; });
    }
    railMeasure();
    window.addEventListener('load', railMeasure);
    function railUpdate(){
      /* show the rail only once the top nav has scrolled out of view */
      var navGone = nav ? nav.getBoundingClientRect().bottom < 0 : window.pageYOffset > 120;
      rail.classList.toggle('sh-rail-show', navGone);
      var y = window.pageYOffset + navH() + 70;
      var curIdx = 0;
      for(var i=0;i<anchors.length;i++){
        if(railTops[i] <= y) curIdx = i;
      }
      /* at (or near) the bottom, force the last anchor active — short final
         sections can never reach the activation line on their own */
      var docH = document.documentElement.scrollHeight;
      if(window.innerHeight + window.pageYOffset >= docH - 2){ curIdx = anchors.length - 1; }
      var cur = anchors[curIdx];
      var changed = cur.id !== railUpdate._last;
      railUpdate._last = cur.id;
      railItems.forEach(function(it){ it.classList.remove('sh-rail-on'); });
      cur.item.classList.add('sh-rail-on');
      var inProjects = cur.id === 'projects' || cur.id.indexOf('p-') === 0;
      if(subWrap) subWrap.classList.toggle('sh-sub-open', inProjects);
      if(cur.id.indexOf('p-') === 0){
        var pmain = rail.querySelector('[data-sec="projects"]');
        if(pmain) pmain.classList.add('sh-rail-on');
      }
      if(changed && !reduce){
        cur.item.classList.remove('sh-rail-pulse'); void cur.item.offsetWidth;
        cur.item.classList.add('sh-rail-pulse');
        setTimeout(function(){ cur.item.classList.remove('sh-rail-pulse'); }, 700);
      }
    }
    railUpdate();
    shOnScroll(railUpdate);
    window.addEventListener('resize', function(){ railMeasure(); railUpdate(); });

    /* (cursor-magnify wave removed — icon hover + Projects flyout are CSS-driven) */
  }

  /* ---------- AI Leaders: count-up numbers on scroll-in ---------- */
  var counts = Array.prototype.slice.call(root.querySelectorAll('.sh-count'));
  function fmt(el, val){
    var p = el.getAttribute('data-prefix') || '', s = el.getAttribute('data-suffix') || '';
    el.textContent = p + Math.round(val) + s;
  }
  function runCount(el){
    var to = parseFloat(el.getAttribute('data-to')) || 0, dur = 1200, t0 = null;
    function step(ts){
      if(t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0)/dur);
      var e = 1 - Math.pow(1 - k, 3); /* easeOutCubic */
      fmt(el, to * e);
      if(k < 1) requestAnimationFrame(step); else fmt(el, to);
    }
    requestAnimationFrame(step);
  }
  if(counts.length){
    if(reduce || !('IntersectionObserver' in window)){
      counts.forEach(function(el){ fmt(el, parseFloat(el.getAttribute('data-to')) || 0); });
    } else {
      counts.forEach(function(el){ fmt(el, 0); });
      var co = new IntersectionObserver(function(ents){
        ents.forEach(function(en){ if(en.isIntersecting){ runCount(en.target); co.unobserve(en.target); } });
      }, { threshold:0.5 });
      counts.forEach(function(el){ co.observe(el); });
    }
  }

  /* ---------- personal statement modal ---------- */
  var psCard = document.getElementById('sh-ps-open'),
      psModal = document.getElementById('sh-ps-modal'),
      psClose = document.getElementById('sh-ps-close');
  if(psCard && psModal){
    function psOpen(){ psModal.classList.add('sh-ps-open'); document.body.style.overflowY = 'hidden'; if(psClose) psClose.focus(); }
    function psShut(){ psModal.classList.remove('sh-ps-open'); document.body.style.overflowY = ''; psCard.focus(); }
    psCard.addEventListener('click', psOpen);
    if(psClose) psClose.addEventListener('click', psShut);
    psModal.addEventListener('click', function(e){ if(e.target === psModal) psShut(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && psModal.classList.contains('sh-ps-open')) psShut(); });
  }

  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', bootSharPortfolio);
  } else {
    bootSharPortfolio();
  }
})();
