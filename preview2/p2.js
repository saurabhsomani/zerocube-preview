// PREVIEW 2: videos play only when on screen; no autoplay when the user prefers reduced motion. Header turns solid on scroll.
(function(){
  var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vids=[].slice.call(document.querySelectorAll('video[data-p2]'));
  vids.forEach(function(v){v.muted=true;if(rm){v.removeAttribute('autoplay');v.pause();}});
  if(!rm&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){});}else{v.pause();}});},{threshold:0.15});
    vids.forEach(function(v){io.observe(v);});
  }
  var h=document.querySelector('.p2h');
  function s(){if(h)h.classList.toggle('solid',window.scrollY>60);}
  window.addEventListener('scroll',s,{passive:true});s();
  var m=document.querySelector('.p2menu'),n=document.getElementById('p2nav');
  if(m&&n)m.addEventListener('click',function(){n.classList.toggle('open');m.setAttribute('aria-expanded',n.classList.contains('open'));});
})();
