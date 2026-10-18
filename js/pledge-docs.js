/* Zero Cube — pledge documents: share cards (canvas), pledge letter (HTML + canvas) and certificate of honour (HTML).
   Shared by pledge.html, my-pledge.html and wall-of-honour.html. Input d = pledge data {name, city, state, type, minor, words, ids, inputs, fam, edu, date}. */
window.ZCDocs=(function(){
"use strict";
var C=window.ZC_PLEDGE_CONFIG, O=window.PLEDGE_OPTIONS, OUT=window.pledgeOutcome;
var FOREST="#0F3D2E", NAVY="#0B2A3C", GOLD="#D9A63A", MINT="#E6F2EB";
var logoImg=new Image(); logoImg.src="assets/img/logo.png";
var esc=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var plain=function(s){var d=document.createElement("div");d.innerHTML=s;return d.textContent};
var D=null, photoData=null;
function data(){return D}
function calcD(d){return ZC_CALC.calc(d)}
function today(d){return (d&&d.date?new Date(d.date+"T00:00:00"):new Date()).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}
/* ---------- canvas helpers ---------- */
function wrap(ctx,text,maxW){var w=text.split(" "),lines=[],l="";w.forEach(function(x){var t=l?l+" "+x:x;if(ctx.measureText(t).width>maxW&&l){lines.push(l);l=x}else l=t});if(l)lines.push(l);return lines}
function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function initials(n){return (n||"?").split(/\s+/).filter(Boolean).slice(0,2).map(function(x){return x[0].toUpperCase()}).join("")}
function avatar(ctx,cx,cy,r,name,usePhoto){
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,r+8,0,7);ctx.fillStyle=GOLD;ctx.fill();ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.clip();
  if(usePhoto&&photoData&&photoData.complete){var im=photoData,s=Math.max(2*r/im.width,2*r/im.height);ctx.drawImage(im,cx-im.width*s/2,cy-im.height*s/2,im.width*s,im.height*s)}
  else{ctx.fillStyle=MINT;ctx.fillRect(cx-r,cy-r,2*r,2*r);ctx.fillStyle=FOREST;ctx.font="700 "+Math.round(r*0.8)+"px MA, Lato, sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(initials(name),cx,cy+4)}
  ctx.restore();
}
function drawCard(cv,story){
  var d=data(),c=calcD(d),W=cv.width,H=cv.height,ctx=cv.getContext("2d"),P=story?90:72,kg=c.kg;
  var g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,"#0B3527");g.addColorStop(.6,FOREST);g.addColorStop(1,NAVY);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.globalAlpha=.07;ctx.fillStyle="#fff";for(var i=0;i<6;i++){ctx.beginPath();ctx.arc(W*0.9,H*0.08,140+i*120,0,7);ctx.lineWidth=2;ctx.strokeStyle="#fff";ctx.stroke()}ctx.globalAlpha=1;
  ctx.fillStyle=GOLD;ctx.fillRect(0,0,W,12);
  // brand
  if(logoImg.complete&&logoImg.naturalWidth){ctx.save();ctx.beginPath();rr(ctx,P,P-8,72,72,16);ctx.fillStyle="#fff";ctx.fill();ctx.drawImage(logoImg,P+6,P-2,60,60);ctx.restore()}
  ctx.textAlign="left";ctx.textBaseline="alphabetic";ctx.fillStyle="#fff";ctx.font="700 34px MA, Lato, sans-serif";ctx.fillText("ZERO CUBE",P+90,P+24);
  ctx.fillStyle="#CFE3D8";ctx.font="400 22px Lato, sans-serif";ctx.fillText("Climate & Social Impact Foundation",P+90,P+56);
  var y=story?300:200;
  ctx.fillStyle=GOLD;ctx.font="700 26px Lato, sans-serif";ctx.fillText("I AM A CLIMATE DUTY BEARER",P,y);
  var showPhoto=!d.minor; // minors: initials only on cards
  var ar=story?150:105; avatar(ctx,W-P-ar,y+(story?150:60),ar,d.name,showPhoto);
  (function(){var cx=W-P-ar,py=y+(story?150:60)+ar+22,t="WALL OF HONOUR";ctx.save();ctx.font="700 "+(story?24:19)+"px Lato, sans-serif";var tw=ctx.measureText(t).width+36,ph=story?44:36;rr(ctx,cx-tw/2,py,tw,ph,ph/2);ctx.fillStyle=GOLD;ctx.fill();ctx.fillStyle=NAVY;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(t,cx,py+ph/2+1);ctx.restore()})();
  y+=story?90:72; ctx.fillStyle="#fff";var fs=story?84:66,nl;
  do{ctx.font="italic 500 "+fs+"px PFD, Georgia, serif";nl=wrap(ctx,d.name||"Your Name",W-2*P-(2*ar+40));fs-=4}while(nl.length>2&&fs>36);nl.slice(0,2).forEach(function(l){ctx.fillText(l,P,y);y+=Math.round((fs+4)*1.1)});
  var loc=[d.city,d.state].filter(Boolean).join(", ");if(loc){ctx.fillStyle="#CFE3D8";ctx.font="400 30px Lato, sans-serif";ctx.fillText(loc,P,y);}
  y=story?Math.max(y+140,720):Math.max(y+40,430);
  ctx.fillStyle="#F0D9A4";ctx.font="700 24px Lato, sans-serif";ctx.fillText("MY DAILY HABITS — I WILL:",P,y);y+=20;
  var items=d.ids.map(function(id){return O.find(function(o){return o.id===id})}),max=story?10:5;
  ctx.font=(story?"400 34px":"400 29px")+" Lato, sans-serif";
  var limY=H-(story?520:300)-(story?130:110),shown=0;
  items.slice(0,max).forEach(function(o){if(y>limY)return;shown++;var lines=wrap(ctx,plain(o.c||o.t),W-2*P-60).slice(0,2);y+=story?56:46;
    ctx.fillStyle=GOLD;ctx.beginPath();ctx.arc(P+14,y-10,14,0,7);ctx.fill();ctx.strokeStyle=FOREST;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(P+7,y-10);ctx.lineTo(P+12,y-4);ctx.lineTo(P+21,y-16);ctx.stroke();
    ctx.fillStyle="#fff";lines.forEach(function(l,i){ctx.fillText(l,P+48,y+(i?(story?42:36):0))});if(lines.length>1)y+=story?42:36;});
  if(items.length>shown){y+=story?52:42;ctx.fillStyle="#CFE3D8";ctx.fillText("+ "+(items.length-shown)+" more",P+48,y)}
  if(!items.length){y+=46;ctx.fillStyle="#CFE3D8";ctx.fillText("Tick your pledges on the page",P+48,y)}
  // stat boxes
  var bh=story?190:140, by=H-(story?520:300), bw=(W-2*P-24)/2;
  [["≈"+fmtKg(kg)+" CO₂e / yr","Indicative estimate, every year"],[c.edu.students+" student"+(c.edu.students===1?"":"s"),c.edu.mode==="teach"?c.edu.hoursYear.toLocaleString("en-IN")+" learning hours a year":fmtRs(c.edu.rupeesYear)+" a year · given directly"]].forEach(function(b,i){
    var x=P+i*(bw+24);ctx.fillStyle="rgba(255,255,255,.10)";rr(ctx,x,by,bw,bh,22);ctx.fill();ctx.strokeStyle="rgba(217,166,58,.7)";ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle="#fff";ctx.font="700 "+(story?50:42)+"px MA, Lato, sans-serif";ctx.fillText(b[0],x+28,by+(story?92:74));
    ctx.fillStyle="#CFE3D8";ctx.font="400 "+(story?26:22)+"px Lato, sans-serif";ctx.fillText(b[1],x+28,by+(story?140:112));});
  ctx.fillStyle="#fff";ctx.font="italic 500 "+(story?40:30)+"px PFD, Georgia, serif";
  wrap(ctx,story?"Climate action is no longer optional — it is our duty. I accept it once, for the rest of my life.":"Climate action is no longer optional — it is our duty.",W-2*P).forEach(function(l,i){ctx.fillText(l,P,by+bh+(story?80:54)+i*(story?50:38))});
  var url=(C.SITE_URL+C.PLEDGE_PATH).replace(/^https?:\/\//,"");
  if(story){ctx.fillStyle=GOLD;ctx.fillRect(0,H-150,W,150);ctx.fillStyle=NAVY;ctx.textAlign="center";ctx.font="700 34px Lato, sans-serif";ctx.fillText("#"+C.HASHTAG,W/2,H-88);ctx.font="400 28px Lato, sans-serif";ctx.fillText(url,W/2,H-44);ctx.textAlign="left"}
  else{ctx.fillStyle=GOLD;ctx.fillRect(0,H-84,W,84);ctx.fillStyle=NAVY;ctx.font="700 26px Lato, sans-serif";ctx.fillText(url,P,H-32);ctx.textAlign="right";ctx.fillText("#"+C.HASHTAG,W-P,H-32);ctx.textAlign="left"}
}

/* ---------- letter ---------- */
function eduLine(c,d){var e=c.edu;return e.mode==="teach"?'I will find and personally teach or mentor <b>'+e.students+'</b> student'+(e.students>1?'s':'')+' each year, giving about <b>'+e.hours+' hours a month</b> ('+e.hoursYear.toLocaleString("en-IN")+' learning hours a year).':
  'I will support <b>'+e.students+'</b> student'+(e.students>1?'s':'')+' each year with <b>'+fmtRs(e.amount)+'</b> per student — <b>'+fmtRs(e.rupeesYear)+' a year</b> — given directly to the student or school, or through a Zero Cube Verified Project.'}
function letterHTML(){
  var d=data(),c=calcD(d),dt=today(d),kg=c.kg;
  var items=d.ids.map(function(id){var o=O.find(function(x){return x.id===id});return "<li><b>"+o.t+"</b><br><span>"+OUT(id,c.per[id])+(c.per[id].kg?" — indicative estimate":"")+"</span></li>"}).join("");
  return '<div class="lh"><img src="assets/img/logo.png" alt="" width="54" height="54"><div><b>ZERO CUBE</b><span>Climate &amp; Social Impact Foundation · Take the Pledge</span></div></div>'+
  '<p class="ldate">'+dt+(d.city?' · '+esc(d.city):'')+'</p><h2>My Lifelong Climate Duty Pledge</h2>'+
  '<p>I, <b>'+esc(d.name||"Your Name")+'</b>, take this pledge of my own free will. <b>I take this pledge once, for the rest of my life.</b> Climate action is no longer optional — it is my duty. Nature gave us life; I accept my share of the duty to give every living being a happy, equal future.</p>'+
  (d.words?'<blockquote>“'+esc(d.words)+'”</blockquote>':'')+
  '<p><b>My daily habits:</b></p><ol>'+(items||'<li>…</li>')+'</ol>'+
  '<p><b>Quality education:</b> '+eduLine(c,d)+'</p>'+
  '<p><b>My tangible outcome, every year:</b> about <b>'+fmtKg(kg)+' CO₂e</b> less'+(c.litres?', about '+c.litres.toLocaleString("en-IN")+' litres of water saved':'')+', and '+(c.edu.mode==="teach"?c.edu.hoursYear.toLocaleString("en-IN")+' learning hours':fmtRs(c.edu.rupeesYear)+' for students')+'. CO₂e is an indicative estimate (Zero Cube Methodology v1), not a measured or verified result.</p>'+
  '<p class="lresp">This pledge is my personal responsibility and a voluntary moral commitment. It is not a legal contract and not a donation to Zero Cube. I may withdraw my details at any time.</p>'+
  '<div class="lsig"><span class="sig">'+esc(d.name||"Your Name")+'</span><span>Climate Duty Bearer, for life · signed on '+dt+'</span></div>'+
  '<p class="lfoot">'+(C.SITE_URL+C.PLEDGE_PATH).replace(/^https?:\/\//,"")+' · #'+C.HASHTAG+'</p>';
}
function drawLetter(cv){
  var d=data(),c=calcD(d),ctx=cv.getContext("2d"),W=cv.width,H=cv.height,P=110,y=0,kg=c.kg,dt=today(d);
  ctx.fillStyle="#FFFDF7";ctx.fillRect(0,0,W,H);ctx.fillStyle=FOREST;ctx.fillRect(0,0,W,150);ctx.fillStyle=GOLD;ctx.fillRect(0,150,W,8);
  if(logoImg.complete){ctx.fillStyle="#fff";rr(ctx,P,40,72,72,14);ctx.fill();ctx.drawImage(logoImg,P+6,46,60,60)}
  ctx.fillStyle="#fff";ctx.font="700 38px MA, Lato, sans-serif";ctx.fillText("ZERO CUBE",P+96,80);ctx.fillStyle="#CFE3D8";ctx.font="400 22px Lato, sans-serif";ctx.fillText("Climate & Social Impact Foundation · Take the Pledge",P+96,112);
  y=230;ctx.fillStyle="#5B6B66";ctx.font="400 24px Lato, sans-serif";ctx.fillText(dt+(d.city?" · "+d.city:""),P,y);
  y+=80;ctx.fillStyle=NAVY;ctx.font="italic 500 54px PFD, Georgia, serif";ctx.fillText("My Lifelong Climate Duty Pledge",P,y);
  y+=70;ctx.font="400 27px Lato, sans-serif";ctx.fillStyle="#1F2A27";var MW=W-2*P;
  function para(t,f,col,lh){ctx.font=f;ctx.fillStyle=col||"#1F2A27";wrap(ctx,t,MW).forEach(function(l){ctx.fillText(l,P,y);y+=lh||40});y+=14}
  para("I, "+(d.name||"Your Name")+", take this pledge of my own free will. I take this pledge once, for the rest of my life. Climate action is no longer optional — it is my duty. Nature gave us life; I accept my share of the duty to give every living being a happy, equal future.","400 27px Lato, sans-serif");
  if(d.words){ctx.fillStyle=GOLD;ctx.fillRect(P,y-28,5,Math.max(60,wrap(ctx,d.words,MW-40).length*40));var sy=P;P+=30;MW-=30;para("“"+d.words+"”","italic 500 30px PFD, Georgia, serif",FOREST,42);P=sy;MW+=30}
  para("My daily habits:","700 27px Lato, sans-serif",NAVY);
  var compact=d.ids.length>5;
  var showOut=d.ids.length<=9;
  if(compact){var lim=H-470,n=0;d.ids.forEach(function(id,i){var o=O.find(function(x){return x.id===id});if(y>lim)return;n++;ctx.font="700 23px Lato, sans-serif";ctx.fillStyle=FOREST;ctx.fillText((i+1)+".",P,y);ctx.fillStyle="#1F2A27";
      wrap(ctx,plain(o.t),MW-44).forEach(function(l){ctx.fillText(l,P+44,y);y+=31});
      if(showOut){ctx.font="400 19px Lato, sans-serif";ctx.fillStyle="#5B6B66";wrap(ctx,OUT(id,c.per[id])+(c.per[id].kg?" — indicative":""),MW-44).slice(0,1).forEach(function(l){ctx.fillText(l,P+44,y-4);y+=24})}y+=3});
    if(n<d.ids.length){ctx.fillStyle="#5B6B66";ctx.font="italic 400 22px Lato, sans-serif";ctx.fillText("+ "+(d.ids.length-n)+" more habits (see the web version of this letter)",P+44,y);y+=34}
    y+=8;if(!showOut||n<d.ids.length)para("Impact details for each habit are on the web version of this letter.","italic 400 20px Lato, sans-serif","#5B6B66",28);}
  else d.ids.forEach(function(id,i){var o=O.find(function(x){return x.id===id});ctx.font="700 25px Lato, sans-serif";ctx.fillStyle=FOREST;ctx.fillText((i+1)+".",P,y);
    var sp=P;P+=40;MW-=40;para(plain(o.t),"700 25px Lato, sans-serif","#1F2A27",34);y-=10;para(OUT(id,c.per[id])+(c.per[id].kg?" — indicative estimate":""),"400 22px Lato, sans-serif","#5B6B66",30);P=sp;MW+=40});
  para("Quality education: "+plain(eduLine(c,d)),"400 25px Lato, sans-serif","#1F2A27",36);
  para("My tangible outcome, every year: about "+fmtKg(kg)+" CO₂e less (indicative estimate, Methodology v1)"+(c.litres?", "+c.litres.toLocaleString("en-IN")+" litres of water saved":"")+".","400 24px Lato, sans-serif","#33413C",34);
  y=Math.max(y+10,H-330);para("A voluntary moral commitment and my personal responsibility — not a legal contract and not a donation to Zero Cube.","italic 400 22px Lato, sans-serif","#5B6B66",32);
  var sy2=Math.min(Math.max(y+60,H-170),H-140);ctx.fillStyle=FOREST;ctx.font="italic 500 56px PFD, Georgia, serif";ctx.fillText(d.name||"Your Name",P,sy2);ctx.fillStyle=GOLD;ctx.fillRect(P,sy2+20,420,3);
  ctx.fillStyle="#5B6B66";ctx.font="400 22px Lato, sans-serif";ctx.fillText("Climate Duty Bearer, for life · signed on "+dt,P,sy2+55);
  ctx.fillStyle=FOREST;ctx.fillRect(0,H-60,W,60);ctx.fillStyle="#fff";ctx.font="700 22px Lato, sans-serif";ctx.fillText((C.SITE_URL+C.PLEDGE_PATH).replace(/^https?:\/\//,"")+"  ·  #"+C.HASHTAG,P,H-22);
}


function ready(){return Promise.all(["700 30px MA","400 30px Lato","700 30px Lato","italic 500 30px PFD"].map(function(f){return document.fonts?document.fonts.load(f):0})).then(function(){return logoImg.complete?0:new Promise(function(r){logoImg.onload=logoImg.onerror=r})})}
/* ---------- certificate of honour (HTML) ---------- */
function dispName(p){if(!p.minor)return p.name;var w=String(p.name||"").trim().split(/\s+/);return w[0]+(w[1]?" "+w[w.length-1][0]+".":"")}
function ini(n){return (n||"?").split(/\s+/).filter(Boolean).slice(0,2).map(function(x){return x[0].toUpperCase()}).join("")}
function fdate(d){return d?new Date(d+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):""}
function avatarH(p,cls){return (p.photo&&!p.minor)?'<img class="'+cls+'" src="'+esc(p.photo)+'" alt="Photo of '+esc(dispName(p))+'" loading="lazy">':'<span class="'+cls+'" aria-hidden="true">'+esc(ini(dispName(p)))+'</span>'}
function loc(p){return [p.city,p.state].filter(Boolean).join(", ")}
function opt(id){return O.find(function(o){return o.id===id})}
/* chain = {leaf, date, demo} from ZC_CHAIN.proofFor(id) (optional) */
function chainSeal(p,chain,big){if(!chain)return "";return '<a class="chainseal'+(big?' big':'')+'" href="verify.html?id='+encodeURIComponent(p.id)+'" title="Fingerprint of this pledge recorded in the Zero Cube Pledge Ledger — click to verify"><span aria-hidden="true">⛓</span> Blockchain-verified'+(chain.demo?' <b>DEMO</b>':'')+(big?'<small>SHA-256 '+esc(chain.leaf.slice(0,10))+'…'+esc(chain.leaf.slice(-6))+' · Zero Cube Pledge Ledger block #'+esc(chain.block)+'</small>':'')+'</a>'}
function chainFor(p){if(p.chain)return p.chain;var X=window.ZC_CHAIN_DEMO;if(p.sample&&X&&X.pledges[p.id]){var q=X.pledges[p.id];return {leaf:q.leaf,block:q.block,date:q.date,status:q.status,demo:true}}return null}
function certHTML(p,seal,chain){var c=calcD(p),k=c.kg,e=c.edu,groups={};(p.ids||[]).forEach(function(id){var o=opt(id);if(!o)return;var g=plain(o.cat);(groups[g]=groups[g]||[]).push(o)});
  return (p.sample?'<p class="samp-note"><b class="samp">SAMPLE</b> Dummy Climate Duty Bearer for design review — not a real person.</p>':'')+
  '<div class="cert"><div class="cert-in"><div class="cert-emb">'+(seal||"")+'</div><p class="cert-org">Zero Cube Climate &amp; Social Impact Foundation</p><h2 class="cert-t">Certificate of Honour</h2>'+
  '<p class="cert-l">This honours</p><div class="cert-av">'+avatarH(p,"dav big")+'</div><p class="cert-name">'+esc(dispName(p))+'</p><p class="cert-meta">'+esc(loc(p))+(p.type?' · '+esc(p.type):'')+(p.minor?' · Under 18':'')+'</p>'+
  '<p class="cert-l">as a <b>Climate Duty Bearer</b> — who has accepted, for life, the duty to act for a happy, equal world.</p>'+(p.words?'<blockquote>“'+esc(p.words)+'”</blockquote>':'')+
  '<div class="prof-stats"><div><b>'+(k?"≈"+fmtKg(k):"—")+'</b><span>CO₂e a year · indicative</span></div><div><b>'+e.students+'</b><span>student'+(e.students>1?'s':'')+' '+(e.mode==="teach"?"taught or mentored":"supported")+'</span></div><div><b>'+(e.mode==="teach"?e.hoursYear.toLocaleString("en-IN"):fmtRs(e.rupeesYear))+'</b><span>'+(e.mode==="teach"?"learning hours a year":"a year · given directly")+'</span></div></div>'+
  '<div class="cert-habits">'+Object.keys(groups).map(function(g){return '<h3 class="pg-h">'+esc(g)+'</h3><ul class="pg-l">'+groups[g].map(function(o){var r=c.per[o.id];return '<li><b>'+o.t+'</b><span>'+OUT(o.id,r)+(r.kg?' — indicative estimate':'')+'</span></li>'}).join("")+'</ul>'}).join("")+
  '<p><b>Quality education:</b> '+(e.mode==="teach"?'I will find and personally teach or mentor <b>'+e.students+'</b> student'+(e.students>1?'s':'')+' each year, about '+e.hours+' hours a month.':'I will support <b>'+e.students+'</b> student'+(e.students>1?'s':'')+' each year with '+fmtRs(e.amount)+' per student, given directly or through a Verified Project.')+'</p>'+
  (c.litres?'<p class="mini">Also about '+c.litres.toLocaleString("en-IN")+' litres of water saved a year.</p>':'')+'</div>'+
  '<div class="cert-foot"><div><span class="sig">'+esc(dispName(p))+'</span><small>Climate Duty Bearer, for life</small></div><div><span class="cert-date">'+esc(fdate(p.date))+'</span><small>Date pledged · once, for life</small></div></div>'+
  (chain?'<div class="cert-chain">'+chainSeal(p,chain,true)+'</div>':'')+
  '<p class="lresp">A personal, voluntary moral commitment — not a legal contract, a donation or a certification of results. CO₂e under <a href="pledge-methodology.html">Pledge methodology v1</a>.</p></div></div>'}
return {
  ready:ready,
  card:function(cv,story,d,photo){D=d;photoData=photo||null;drawCard(cv,story)},
  letter:function(cv,d){D=d;drawLetter(cv)},
  letterHTML:function(d){D=d;return letterHTML()},
  certHTML:certHTML, chainFor:chainFor, chainSeal:chainSeal, dispName:dispName
};
})();
