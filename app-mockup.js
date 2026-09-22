/* The desktop app mockup: hero timeline and interactive tour.
 *
 * Lifted from the redesign brief's visual-reference.html. It drives markup that is already
 * in index.html rather than generating any, so the DOM and the stylesheet cannot drift.
 *
 * Its own file, not site.js: site.js carries the pricing and market detection that already
 * works, and a throw in here must not take that down.
 */
(function () {
  // Declared in the reference's outer wrapper, which is not part of this extract. The hero
  // checks it to choose between the loop and the finished conversation; without it the hero
  // throws a ReferenceError on its first frame and the stage renders empty.
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

// desktop tour
  (function(){
    var dk=document.getElementById('tourDk'); if(!dk) return;
    var seg=document.querySelectorAll('#tourSeg button');
    var CAPS={"home": ["Know what needs you in five seconds.", [["Needs you, first", "The one conversation waiting on a person sits at the top, with one-tap Reply or Let Baxter continue."], ["What Baxter handled", "Today's conversations, bookings and who needed you, at a glance."], ["Every channel, one switch", "Pause Baxter everywhere, or channel by channel. Try the switches."]]], "inbox": ["Step in, then hand it back.", [["Every channel in one list", "SMS, WhatsApp, web chat, email and calls, filtered by who needs you."], ["Take over any conversation", "Reply yourself, then Hand back when you're done. Try it."], ["The whole story beside it", "AI summary, contact details, appointments and internal notes."]]], "settings": ["Connect a channel in minutes.", [["Each channel, its own switch", "Choose where Baxter replies. The count updates as you switch."], ["Numbers, calendar, lead sources", "Everything it connects to lives in one place."], ["Plan, billing and credits", "See usage and top up without leaving the app."]]]};
    function show(key){
      dk.querySelectorAll('[data-scr]').forEach(function(s){ s.hidden = s.dataset.scr!==key; });
      dk.querySelectorAll('.dk-side .dk-nav').forEach(function(n){ n.classList.toggle('on', n.dataset.go===key); });
      seg.forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.tab===key?'true':'false'); });
      var c=CAPS[key]; document.querySelector('[data-cap-title]').textContent=c[0];
      document.querySelector('[data-caps]').innerHTML=c[1].map(function(x){return '<div class="it"><b>'+x[0]+'</b><span>'+x[1]+'</span></div>';}).join('');
    }
    seg.forEach(function(b){ b.addEventListener('click', function(){ show(b.dataset.tab); }); });
    dk.addEventListener('click', function(e){
      var g=e.target.closest('[data-go]'); if(g){ show(g.dataset.go); return; }
      var t=e.target.closest('.tg');
      if(t){
        var on=t.getAttribute('aria-pressed')!=='true'; t.setAttribute('aria-pressed', on?'true':'false');
        if(t.hasAttribute('data-master')){
          dk.querySelector('[data-master-label]').textContent = on?'Baxter is on':'Baxter is paused';
          dk.querySelector('[data-master-sub]').textContent = on?'Answering on 5 connected channels':'You answer everything until you switch it back on';
        }
        if(t.hasAttribute('data-chtg')){
          var all=dk.querySelectorAll('[data-chtg]'), n=0;
          all.forEach(function(x){ var p=x.getAttribute('aria-pressed')==='true'; if(p) n++; x.closest('.dk-chrow').classList.toggle('off',!p); });
          dk.querySelector('[data-chcount]').textContent = n===5 ? '5 of 5, replying on all' : n+' of 5, replying on '+n;
        }
        return;
      }
      var h=e.target.closest('[data-ho]');
      if(h){
        var taken=h.textContent==='Hand back';
        h.textContent = taken?'Take over':'Hand back';
        var chip=dk.querySelector('[data-ho-chip]'); chip.textContent = taken?'Baxter is handling':'Taken over'; chip.className='dk-chip '+(taken?'blue':'amber');
        dk.querySelector('[data-ho-via]').innerHTML = taken?'Baxter is replying via <b>SMS</b>':'Replying as you via <b>SMS</b>';
        var em=dk.querySelector('.dk-conv.sel em'); em.textContent = taken?'Baxter replying':'Taken over'; em.className = taken?'blue':'amber';
      }
    });
  })();

  // hero: customer phone and desktop inbox, one conversation
  (function(){
    var ph=document.querySelector('[data-hphone]'), dk=document.getElementById('heroDk'); if(!ph||!dk) return;
    var row=dk.querySelector('[data-hrow]'), rowS=row.querySelector('span'), rowE=row.querySelector('em'), appt=dk.querySelector('[data-happt]');
    function els(k){ return [ph.querySelector('[data-h="'+k+'"]'), dk.querySelector('[data-h="'+k+'"]')]; }
    function on(k,v){ els(k).forEach(function(e){ if(e) e.classList.toggle('show', v); }); }
    function typing(after){
      [ph, dk].forEach(function(root){
        var dots = root.querySelector('[data-h="t"]');
        var prev = root.querySelector('[data-h="'+after+'"]');
        if(dots && prev && prev.parentNode) prev.parentNode.insertBefore(dots, prev.nextSibling);
      });
      on('t', true);
    }
    var steps=['0','t','1','2','t','3'];
    function reset(){ ['0','t','1','2','3'].forEach(function(k){ on(k,false); }); rowS.textContent='Can I come in Thursday?'; rowE.textContent='Baxter replying'; rowE.className='blue'; appt.innerHTML='<p style="color:var(--ink-3);font-size:1.25em">Nothing booked yet.</p>'; }
    function booked(){ rowS.textContent="Baxter: You're booked. Reminder coming..."; rowE.textContent='Booked'; rowE.className='green';
      appt.innerHTML='<div class="dk-appt new"><span class="cal"><svg class="ic" aria-hidden="true"><use href="#i-cal"/></svg></span><div><b>Thu, 3:00 PM</b><small>Cleaning with Dr. Rivera</small></div></div>'; }
    if(reduce){ ['0','1','2','3'].forEach(function(k){ on(k,true); }); booked(); return; }
    var timers=[];
    function run(){
      reset(); var t=600;
      timers.push(setTimeout(function(){ on('0',true); rowS.textContent='Can I come in Thursday?'; }, t)); t+=1100;
      timers.push(setTimeout(function(){ typing('0'); }, t)); t+=1300;
      timers.push(setTimeout(function(){ on('t',false); on('1',true); }, t)); t+=1600;
      timers.push(setTimeout(function(){ on('2',true); rowS.textContent='Yes please'; }, t)); t+=900;
      timers.push(setTimeout(function(){ typing('2'); }, t)); t+=1300;
      timers.push(setTimeout(function(){ on('t',false); on('3',true); booked(); }, t)); t+=4200;
      timers.push(setTimeout(run, t));
    }
    run();
  })();
})();
