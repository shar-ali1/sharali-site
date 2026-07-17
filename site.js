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
  window.addEventListener('scroll', onScrollNav, {passive:true});

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
  window.addEventListener('scroll', revealCheck, {passive:true});
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
    window.addEventListener('scroll', function(){
      var docH = document.documentElement.scrollHeight;
      if(window.innerHeight + window.pageYOffset >= docH - 2){
        var last = sections[sections.length - 1];
        if(last){
          links.forEach(function(l){ l.classList.remove('sh-active'); });
          var l = map['#'+last.id]; if(l) l.classList.add('sh-active');
        }
      }
    }, {passive:true});
  }

  /* ---------- hero: scroll cue fade ---------- */
  var cue = root.querySelector('.sh-cue');
  if(cue) window.addEventListener('scroll', function(){ cue.style.opacity = Math.max(0, 1 - window.scrollY/260).toFixed(2); }, {passive:true});

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
    window.addEventListener('scroll', cueUpdate, {passive:true});
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

  /* ---------- global parallax starfield (fixed, whole page) ---------- */
  var starRoot = root.querySelector('.sh-bg'), layers = [];
  if(starRoot){
    var defs = [
      {strength:10,count:150,smin:0.7,smax:1.6,omin:0.30,omax:0.65,fmin:26,fmax:44},
      {strength:22,count:102,smin:1.1,smax:2.2,omin:0.48,omax:0.85,fmin:18,fmax:30},
      {strength:40,count:56,smin:1.7,smax:3.2,omin:0.68,omax:1.00,fmin:12,fmax:20}
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

  /* ---------- teal cursor trail (page-wide) + gentle star parallax ---------- */
  /* ambient starfield always runs; the trail is skipped under reduced motion */
  var oldGlow = root.querySelector('.sh-bg-glow');
  if(oldGlow && oldGlow.parentNode) oldGlow.parentNode.removeChild(oldGlow); /* legacy glow div, if the old HTML is still live */
  var trailCv = null, trailCtx = null, trailPts = [], TRAIL_LIFE = 420, TRAIL_DPR = 1;
  if(!reduce && starRoot){
    trailCv = document.createElement('canvas');
    trailCv.className = 'sh-trail';
    trailCv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    starRoot.appendChild(trailCv);
    trailCtx = trailCv.getContext('2d');
    var trailSize = function(){
      TRAIL_DPR = Math.min(window.devicePixelRatio || 1, 2);
      trailCv.width = Math.round(window.innerWidth * TRAIL_DPR);
      trailCv.height = Math.round(window.innerHeight * TRAIL_DPR);
    };
    trailSize();
    window.addEventListener('resize', trailSize);
  }
  {
    var t = {px:0,py:0}, c = {px:0,py:0};
    root.addEventListener('mousemove', function(e){
      t.px = (e.clientX/window.innerWidth - .5)*2; t.py = (e.clientY/window.innerHeight - .5)*2;
      if(trailCtx){
        var last = trailPts[trailPts.length-1];
        if(!last || Math.abs(e.clientX-last.x) + Math.abs(e.clientY-last.y) > 2){
          trailPts.push({x:e.clientX, y:e.clientY, t:performance.now()});
          if(trailPts.length > 48) trailPts.shift();
        }
      }
    }, {passive:true});
    (function tick(){
      /* trail: short tapered teal line through recent cursor points; fades out at rest */
      if(trailCtx){
        var now = performance.now();
        while(trailPts.length && now - trailPts[0].t > TRAIL_LIFE) trailPts.shift();
        trailCtx.setTransform(TRAIL_DPR, 0, 0, TRAIL_DPR, 0, 0);
        trailCtx.clearRect(0, 0, trailCv.width, trailCv.height);
        if(trailPts.length > 1){
          trailCtx.lineCap = 'round'; trailCtx.lineJoin = 'round';
          trailCtx.shadowColor = 'rgba(79,209,197,.75)'; trailCtx.shadowBlur = 6;
          for(var p=1; p<trailPts.length; p++){
            var a = trailPts[p-1], b = trailPts[p];
            var age = Math.min(1, (now - b.t)/TRAIL_LIFE);       /* 0 fresh -> 1 gone */
            trailCtx.strokeStyle = 'rgba(79,209,197,' + (0.55*(1-age)).toFixed(3) + ')';
            trailCtx.lineWidth = 1 + 2.2*(1-age);
            trailCtx.beginPath();
            trailCtx.moveTo(a.x, a.y); trailCtx.lineTo(b.x, b.y);
            trailCtx.stroke();
          }
          trailCtx.shadowBlur = 0;
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
  if(starRoot){
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
    (function loop(){ setTimeout(function(){ meteor(); loop(); }, 3500+Math.random()*3000); })();
  }

  /* ---------- side rail scroll-spy ---------- */
  var rail = document.getElementById('sh-rail');
  if(rail){
    var railItems = Array.prototype.slice.call(rail.querySelectorAll('[data-sec]'));
    var anchors = railItems.map(function(it){
      var id = it.getAttribute('data-sec');
      return { item:it, id:id, el:root.querySelector('#'+id) };
    }).filter(function(a){ return a.el; });
    var subWrap = document.getElementById('sh-rail-sub');
    function railUpdate(){
      var y = window.pageYOffset + navH() + 70;
      var curIdx = 0;
      for(var i=0;i<anchors.length;i++){
        var top = anchors[i].el.getBoundingClientRect().top + window.pageYOffset;
        if(top <= y) curIdx = i;
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
    window.addEventListener('scroll', railUpdate, {passive:true});
    window.addEventListener('resize', railUpdate);

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
