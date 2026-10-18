/* Zero Cube — My Pledge: passwordless login (one-time email link) and the Climate Duty Bearer dashboard.
   PROTOTYPE: with no ENDPOINT in pledge-config.js it runs in DEMO mode with a SAMPLE account. Backend actions: login, session, me, withdraw (pledge-backend/Chain_Auth_Mail.gs — draft, untested). */
(function(){
"use strict";
var C=window.ZC_PLEDGE_CONFIG||{}, X=window.ZC_CHAIN_DEMO, $=function(s){return document.querySelector(s)};
var SEAL=($("#sealTpl")||{}).innerHTML||"", SKEY="zc_mp_session", DKEY="zc_mp_demo", S=null;
var esc=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
function msg(el,html,cls){el.className="pstatus "+(cls||"");el.innerHTML=html}
function api(body){return fetch(C.ENDPOINT,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(body)}).then(function(r){return r.json()})}
function dl(name,href){var a=document.createElement("a");a.download=name;a.href=href;document.body.appendChild(a);a.click();a.remove()}
function dlText(name,txt,type){var u=URL.createObjectURL(new Blob([txt],{type:type||"text/plain"}));dl(name,u);setTimeout(function(){URL.revokeObjectURL(u)},2000)}

/* ---------- login ---------- */
$("#loginForm").addEventListener("submit",function(e){e.preventDefault();var f=e.target,em=f.email.value.trim(),st=$("#loginStatus");
  if(f.website.value)return;
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){msg(st,"Please enter a valid email address.","err");f.email.focus();return}
  if(!C.ENDPOINT){msg(st,C.DEMO?"<b>Demo mode:</b> no email was sent — the pledge database is not connected yet. When live, a one-time link goes to <b>"+esc(em)+"</b> if a pledge exists for it. Use the demo account below to preview the dashboard.":"<b>Opening soon:</b> My Pledge login opens with our pledge register in a few days. No email was sent.","demo");return}
  msg(st,"Sending…");
  api({action:"login",email:em,website:f.website.value}).then(function(){msg(st,"If a pledge exists for <b>"+esc(em)+"</b>, we've emailed a login link. It works once and expires in 15 minutes. Check your spam folder too.","ok")},function(){msg(st,"Could not reach the server. Please try again later.","err")})});
$("#demoLogin").addEventListener("click",function(){sessionStorage.setItem(DKEY,"Approved");openDemo("Approved")});
$("#logout").addEventListener("click",function(){var s=localStorage.getItem(SKEY);if(s&&C.ENDPOINT)api({action:"logout",session:s}).catch(function(){});localStorage.removeItem(SKEY);sessionStorage.removeItem(DKEY);S=null;$("#dashSec").hidden=true;$("#loginSec").hidden=false;window.scrollTo(0,0)});

function openDemo(st){if(!X)return;var p=(window.PLEDGE_SAMPLES||[]).find(function(x){return x.id===X.account.id});var q=X.pledges[p.id];
  S={p:p,rec:X.account.record,chain:{leaf:q.leaf,block:q.block,date:q.date,status:q.status,demo:true},status:st,demo:true,cert:JSON.parse(sessionStorage.getItem("zc_mp_cc")||"null")||JSON.parse(JSON.stringify(X.account.cert)),audit:JSON.parse(sessionStorage.getItem("zc_mp_au")||"null")||JSON.parse(JSON.stringify(X.account.audit)),membership:JSON.parse(sessionStorage.getItem("zc_mp_ms")||"null")||JSON.parse(JSON.stringify(X.account.membership))};show()}
function boot(){
  var m=location.hash.match(/[#&]t=([A-Za-z0-9_-]{20,})/);
  if(m){history.replaceState(null,"",location.pathname);
    if(!C.ENDPOINT){msg($("#loginStatus"),"<b>Opening soon:</b> login links work once our pledge register is live.","demo");return}
    msg($("#loginStatus"),"Logging you in…");
    api({action:"session",code:m[1]}).then(function(j){if(j.ok&&j.session){localStorage.setItem(SKEY,j.session);loadMe()}else msg($("#loginStatus"),esc(j.error||"This link has expired or was already used. Please ask for a new one."),"err")},function(){msg($("#loginStatus"),"Could not reach the server.","err")});return}
  if(C.DEMO&&X){document.querySelectorAll(".demo-only-login").forEach(function(x){x.hidden=false})}
  if(C.DEMO&&X&&sessionStorage.getItem(DKEY)){openDemo(sessionStorage.getItem(DKEY));return}
  if(C.ENDPOINT&&localStorage.getItem(SKEY))loadMe();
}
function loadMe(){api({action:"me",session:localStorage.getItem(SKEY)}).then(function(j){if(!j.ok){localStorage.removeItem(SKEY);msg($("#loginStatus"),"Your session has ended. Please log in again.","err");return}
  S={p:j.pledge,rec:j.record,chain:j.chain,status:j.status,demo:false,cert:j.cert||{status:"none"},audit:j.audit||{status:"none"},membership:j.membership||{status:"None"}};show()},function(){msg($("#loginStatus"),"Could not reach the server.","err")})}

/* ---------- dashboard ---------- */
function show(){var p=S.p,c=ZC_CALC.calc(p),e=c.edu,ap=S.status==="Approved";
  $("#loginSec").hidden=true;$("#dashSec").hidden=false;$("#demoNote").hidden=!S.demo;
  $("#dName").textContent=ZCDocs.dispName(p);
  $("#dMeta").innerHTML="Pledge ID <b>"+esc(p.id)+"</b> · pledged "+esc(new Date(p.date+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}))+" · once, for life";
  var b=$("#dStatus");b.textContent=ap?"Approved · on the Wall of Honour":"Pending review";b.className="stbadge "+(ap?"ok":"wait");
  $("#dStats").innerHTML='<div><b>'+(p.ids||[]).length+'</b><span>daily habits</span></div><div><b>≈'+fmtKg(c.kg)+'</b><span>CO₂e a year · indicative</span></div><div><b>'+e.students+'</b><span>students '+(e.mode==="teach"?"taught":"supported")+'</span></div><div><b>'+(e.mode==="teach"?e.hoursYear.toLocaleString("en-IN"):fmtRs(e.rupeesYear))+'</b><span>'+(e.mode==="teach"?"learning hours a year":"a year, given directly")+'</span></div>';
  document.querySelectorAll(".mp-toggle button[data-st]").forEach(function(x){x.classList.toggle("on",x.dataset.st===S.status);x.setAttribute("aria-pressed",x.dataset.st===S.status)});
  $("#certBox").innerHTML=ap?ZCDocs.certHTML(p,SEAL,ap?S.chain:null):'<p class="mp-wait">Your Certificate of Honour will be ready once our team has reviewed your pledge (usually within a few days). We will email it to you.</p>';
  $("#printCert").disabled=!ap;
  chainPanel(ap);
  if(window.ZCNext)ZCNext.render(S,{api:api,msg:msg,esc:esc,dl:dl});
  ZCDocs.ready().then(function(){ZCDocs.card($("#mSq"),false,p,p.photo&&!p.minor?null:null);ZCDocs.card($("#mStory"),true,p,null);ZCDocs.letter($("#mLetter"),p)});
}
function chainPanel(ap){var el=$("#chainBody");
  if(!ap||!S.chain){el.innerHTML='<p class="mp-wait">⏳ <b>Waiting for approval.</b> After approval, your pledge fingerprint is added to that night\'s block of the Zero Cube Pledge Ledger (23:30 IST). The proof appears here the next morning.</p>';return}
  el.innerHTML='<p class="pstatus">Checking the ledger…</p>';
  var fp=ZC_CHAIN.fingerprint(S.rec);
  ZCLedger.prove(S.p.id,fp).then(function(r){if(!r.found){el.innerHTML='<p class="mp-wait">Your fingerprint will appear in tonight\'s block.</p>';return}
    var ok=r.fpMatch&&r.inBlock&&r.merkleOk&&r.blockOk&&r.linksOk&&r.sigOk;
    el.innerHTML='<p class="chain-ok'+(ok?'':' bad')+'"><span aria-hidden="true">'+(ok?'✓':'✗')+'</span> '+(ok?'Recorded in block #'+r.block.number:'Check failed — please contact us')+(r.demo?' <b class="samp">DEMO</b>':'')+'</p>'+
    '<dl class="chain-dl"><dt>Fingerprint (SHA-256)</dt><dd><code class="hash">'+esc(fp)+'</code><button class="btn btn-ghost sm" type="button" id="cpHash">Copy</button></dd>'+
    '<dt>Block</dt><dd>#'+r.block.number+' · '+esc(r.block.date)+' · hash <code class="hash sm">'+esc(ZCLedger.short(r.block.hash))+'</code></dd></dl>'+
    ZCLedger.checklist(r,esc)+
    '<p class="row"><a class="btn btn-pri" href="verify.html?id='+encodeURIComponent(S.p.id)+'">Verify</a><a class="btn btn-ghost" href="ledger.html#b='+r.block.number+'">View in the ledger</a><a class="btn btn-ghost" href="'+esc(ZCLedger.base+ZCLedger.file(r.block.number))+'" download>Download block</a></p>';
    $("#cpHash").addEventListener("click",function(){if(navigator.clipboard)navigator.clipboard.writeText(fp);this.textContent="Copied"})},
  function(){el.innerHTML='<p class="mp-wait">Could not load the ledger right now.</p>'})}
document.querySelectorAll(".mp-toggle button[data-st]").forEach(function(x){x.addEventListener("click",function(){if(!S||!S.demo)return;S.status=x.dataset.st;sessionStorage.setItem(DKEY,S.status);show()})});
document.querySelectorAll("[data-dl]").forEach(function(x){x.addEventListener("click",function(){var id=x.dataset.dl;dl("zerocube-"+({mSq:"card-square",mStory:"card-story",mLetter:"letter"})[id]+".png",$("#"+id).toDataURL("image/png"))})});
$("#dlRecord").addEventListener("click",function(){dlText("zerocube-pledge-"+S.p.id+".json",ZC_CHAIN.canon(S.rec),"application/json")});
function printHTML(h){$("#printArea").innerHTML=h;document.body.classList.add("print-one");window.print();setTimeout(function(){document.body.classList.remove("print-one")},500)}
$("#printCert").addEventListener("click",function(){printHTML(ZCDocs.certHTML(S.p,SEAL,S.chain))});
$("#printLetterM").addEventListener("click",function(){printHTML('<div class="letter">'+ZCDocs.letterHTML(S.p)+'</div>')});
/* ---------- withdrawal ---------- */
$("#wdBtn").addEventListener("click",function(){$("#wdBox").hidden=false;this.hidden=true;$("#wdOk").focus()});
$("#wdCancel").addEventListener("click",function(){$("#wdBox").hidden=true;$("#wdBtn").hidden=false;$("#wdOk").checked=false;$("#wdGo").disabled=true});
$("#wdOk").addEventListener("change",function(){$("#wdGo").disabled=!this.checked});
$("#wdGo").addEventListener("click",function(){var st=$("#wdStatus");
  if(S.demo||!C.ENDPOINT){msg(st,"<b>Demo mode:</b> no request was sent. When live, we confirm by email, remove you from the Wall of Honour and erase your details within the time set in the terms. Your pledge ID will then show “Withdrawn” on the Verify page.","demo");return}
  api({action:"withdraw",session:localStorage.getItem(SKEY)}).then(function(j){msg(st,j.ok?"Your withdrawal request is recorded. We have emailed you a confirmation.":esc(j.error||"Something went wrong."),j.ok?"ok":"err")},function(){msg(st,"Could not reach the server.","err")})});
boot();
})();
