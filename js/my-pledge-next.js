/* Zero Cube — My Pledge "next steps": Commitment Certificate application and Net Zero audit expression of interest.
   PROTOTYPE: in demo mode everything stays in this browser (SAMPLE data). Live: backend actions applyCert, progress, auditInterest (Chain_Auth_Mail.gs — DRAFT, UNTESTED). */
window.ZCNext=(function(){
"use strict";
var C=window.ZC_PLEDGE_CONFIG||{}, X=window.ZC_CHAIN_DEMO, $=function(s){return document.querySelector(s)}, S=null, h=null;
var SITE=C.SITE_URL||"https://saurabhsomani.github.io/zerocube/";
var CC_STEPS=["Applied","Under review","Issued"], AU_STEPS=["Interest received","Contacted","Scoped"];
var WHO=[["home","My home","people in the home"],["school","School","students"],["institution","College / institution","students and staff"],["msme","MSME / small business","employees"],["village","Village / Gram Panchayat","households"],["club","Club or association","members"],["society","Housing society","flats / homes"]];
function esc(s){return h.esc(s)}
function today(){return new Date().toISOString().slice(0,10)}
function fd(d){return d?new Date(d+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}):""}
function save(){if(S.demo){sessionStorage.setItem("zc_mp_cc",JSON.stringify(S.cert));sessionStorage.setItem("zc_mp_au",JSON.stringify(S.audit));sessionStorage.setItem("zc_mp_ms",JSON.stringify(S.membership))}}
/* Member gate (director, 18 Oct 2026): the pledge is free for everyone; the Commitment Certificate and Net Zero audit interest unlock only when the pledge is
   Approved on the ledger AND the membership is Active. Village / Gram Panchayat audits never need a paid membership (CSR route; no membership needed — decided). */
function ms(){return (S.membership&&S.membership.status)||"None"}
function memberActive(){return ms()==="Active"}
function joinUrl(){return C.MEMBERSHIP_OPEN?"membership.html?pledge="+encodeURIComponent(S.p.id)+"#chooser":"membership.html#waitlist"}
function lockBox(what,extra){if(!C.MEMBERSHIP_OPEN)return '<div class="lockbox"><h4><span aria-hidden="true">🔒</span> Available to members once membership opens</h4><p>'+what+' is a member benefit. Membership payments open soon, once our bank account is active. No payment is collected now.</p><p class="row"><a class="btn btn-donate" href="membership.html#waitlist">Join the Founding Members waitlist</a><a class="btn btn-ghost" href="membership.html#pledge-benefits">What members unlock</a></p>'+(extra||"")+'</div>';return '<div class="lockbox"><h4><span aria-hidden="true">🔒</span> Unlocks when you become a Zero Cube member</h4><p>'+what+' is a member benefit. It unlocks when your pledge is approved and recorded in the ledger <b>and</b> your membership is active'+(ms()==="Applied"?' (your membership application is being processed)':ms()==="Expired"?' (your membership has expired: renew to unlock)':'')+'. The pledge itself stays free for everyone.</p>'+
  '<p class="row"><a class="btn btn-donate" href="'+joinUrl()+'">'+(ms()==="Expired"?"Renew my membership":"Become a Member")+'</a><a class="btn btn-ghost" href="#memPanel">I\'m already a member</a><a class="btn btn-ghost" href="membership.html#pledge-benefits">What members unlock</a></p>'+(extra||"")+'</div>'}
function ready(){return S.status==="Approved"&&S.chain&&S.chain.block!=null}
function stepper(steps,cur){var i=steps.indexOf(cur);return '<ol class="stepper">'+steps.map(function(s,j){return '<li class="'+(j<i?"done":j===i?"now":"")+'"'+(j===i?' aria-current="step"':'')+'><span>'+(j<i?"✓":j+1)+'</span>'+esc(s)+'</li>'}).join("")+'</ol>'}
function badge(t,cls){return '<span class="stbadge '+cls+'">'+esc(t)+'</span>'}

/* ---------- next steps ---------- */
function nextSteps(){var cs=S.cert.status,as=S.audit.status,ma=memberActive(),LOCK='<span class="stbadge lock">🔒 Locked</span>',lockTxt=C.MEMBERSHIP_OPEN?"<b>Unlocks when you become a Zero Cube member.</b> ":"<b>Available to members once membership opens.</b> ",joinBtn='<a class="btn btn-donate sm" href="'+joinUrl()+'">'+(ms()==="Expired"?"Renew membership":"Become a Member")+'</a>';
  var c1=!ma&&cs!=="Issued", c2=!ma&&as==="none";
  var t1=c1?LOCK:!ready()?badge("After approval","wait"):cs==="none"?badge("Not applied","idle"):badge(cs+(cs==="Issued"&&!ma?" · stays valid":""),cs==="Issued"?"ok":"wait");
  var t2=c2?LOCK:as==="none"?badge("Not sent","idle"):badge(as,as==="Scoped"?"ok":"wait");
  var mb={None:badge("Not a member","idle"),Applied:badge("Applied","wait"),Active:badge("Active","ok"),Expired:badge("Expired","bad")}[ms()];
  $("#nextGrid").innerHTML=
  tile("📜","Commitment Certificate",c1?lockTxt+"A formal certificate of your lifelong pledge — no extra fee for members.":"A formal certificate of your lifelong pledge — no extra fee for members.",t1,c1?joinBtn:'<a class="btn btn-pri sm" href="#ccPanel">'+(cs==="Issued"?"View certificate":cs==="none"?"Apply":"See status")+'</a>',c1)+
  tile("🏭","Net Zero audit",c2?lockTxt+"Show interest in a Net Zero audit (as per fee card). Villages never pay.":"Interested in a Net Zero audit for your home, school, business or village?",t2,c2?joinBtn:'<a class="btn btn-pri sm" href="#auditPanel">'+(as==="none"?"Show interest":"See status")+'</a>',c2)+
  tile("🤝","Membership",ma?"Your membership unlocks the certificate and audit.":"Join in your own capacity — experts, MSMEs, schools, students and more.",mb,ma?'<a class="btn btn-ghost sm" href="#memPanel">See membership</a>':'<a class="btn btn-gold sm" href="'+joinUrl()+'">Which membership fits me?</a>')+
  tile("📣","Share your pledge","Share your card — one pledge inspires many more.","",'<button class="btn btn-ghost sm" type="button" id="nsShare">Share my card</button>');
  $("#nsShare").addEventListener("click",function(){var cv=$("#mSq");
    if(navigator.canShare&&cv)cv.toBlob(function(b){var f=new File([b],"zerocube-pledge.png",{type:"image/png"});if(navigator.canShare({files:[f]}))navigator.share({files:[f],title:"I am a Climate Duty Bearer",text:"I took the Zero Cube Climate Duty Pledge. "+SITE+"pledge.html"}).catch(function(){});else $("#docH").scrollIntoView({behavior:"smooth"})});
    else $("#docH").scrollIntoView({behavior:"smooth"})})}
function tile(ic,t,d,b,btn,lk){return '<div class="ns-tile'+(lk?' locked':'')+'"><span class="ns-ic" aria-hidden="true">'+ic+'</span><h4>'+t+'</h4>'+(b?'<p class="ns-st">'+b+'</p>':'')+'<p>'+d+'</p>'+btn+'</div>'}

/* ---------- membership ---------- */
function memRender(){var el=$("#memBody"),m=S.membership||{status:"None"},st=ms();
  var head={None:"You are not a Zero Cube member yet.",Applied:"Your membership application is being processed: we confirm eligibility and send an invoice. Benefits unlock once it is active.",Active:"Your membership is active. The Commitment Certificate and Net Zero audit interest are unlocked (once your pledge is approved and on the ledger).",Expired:"Your membership has expired. A certificate already issued stays valid as a record; renewals, progress updates and new requests need an active membership."}[st];
  var info=(st==="Active"||st==="Expired")?'<dl><dt>Tier</dt><dd>'+esc(m.tier||"")+'</dd><dt>Member ID</dt><dd>'+esc(m.memberId||"")+'</dd><dt>'+(st==="Active"?"Valid till":"Expired on")+'</dt><dd>'+esc(fd(st==="Active"?m.validTill:m.expiredOn))+'</dd></dl>':'';
  var link=m.link&&m.link.status==="Pending"?'<p class="pstatus demo" role="status">Link request sent ('+(m.link.by==="id"?"member ID "+esc(m.link.value):"email match")+'). A moderator will confirm it'+(S.demo?' — <b>demo mode:</b> nothing was sent.':'.')+'</p>':'';
  el.innerHTML='<div class="mem-row"><p style="margin:0">'+({None:badge("None","idle"),Applied:badge("Applied","wait"),Active:badge("Active","ok"),Expired:badge("Expired","bad")}[st])+' '+head+'</p>'+info+'</div>'+
  (st!=="Active"?'<p class="row" style="margin-top:12px"><a class="btn btn-donate" href="'+joinUrl()+'">'+(st==="Expired"?"Renew my membership":"Become a Member")+'</a><a class="btn btn-ghost" href="membership.html#pledge-benefits">What members unlock</a></p>':'')+link+
  (st!=="Active"&&!(m.link&&m.link.status==="Pending")?'<details class="acc"><summary>I\'m already a member — link my membership</summary><div class="accb"><p>We link your membership to this pledge after a moderator checks it. Choose one:</p>'+
  '<form id="lkForm" class="pform" novalidate><label class="chk"><input type="radio" name="lkBy" value="email" checked><span>My membership uses the <b>same email</b> as this pledge</span></label><label class="chk"><input type="radio" name="lkBy" value="id"><span>I have a <b>member ID</b></span></label>'+
  '<div class="frow" id="lkIdRow" hidden><label for="lkId">Member ID</label><input id="lkId" maxlength="24" placeholder="e.g. ZC-M-2026-00012" autocomplete="off"></div><button class="btn btn-ghost" type="submit">Send link request</button><div id="lkStatus" class="pstatus" role="status" aria-live="polite"></div></form></div></details>':'');
  var f=$("#lkForm");if(!f)return;
  f.querySelectorAll("input[name=lkBy]").forEach(function(r){r.addEventListener("change",function(){$("#lkIdRow").hidden=f.querySelector("input[name=lkBy]:checked").value!=="id"})});
  f.addEventListener("submit",function(ev){ev.preventDefault();var by=f.querySelector("input[name=lkBy]:checked").value,id=($("#lkId").value||"").trim().toUpperCase(),st2=$("#lkStatus");
    if(by==="id"&&!/^[A-Z0-9-]{4,24}$/.test(id)){h.msg(st2,"Please enter your member ID (letters, numbers and dashes).","err");return}
    if(S.demo||!C.ENDPOINT){S.membership.link={status:"Pending",by:by,value:id};save();render();return}
    h.api({action:"linkMembership",session:localStorage.getItem("zc_mp_session"),by:by,memberId:id}).then(function(j){if(j.ok){S.membership=j.membership;render()}else h.msg(st2,esc(j.error||"Something went wrong."),"err")},function(){h.msg(st2,"Could not reach the server.","err")})})}

/* ---------- Commitment Certificate ---------- */
function certData(){var c=S.cert;return c.record?c:(S.demo?X.account.cert:c)}
function qrSvg(url){try{var q=qrcode(0,"M");q.addData(url);q.make();return q.createSvgTag({cellSize:3,margin:2,scalable:true})}catch(e){return ""}}
function ccHTML(){var c=certData(),r=c.record,p=S.p,k=ZC_CALC.calc(p),e=k.edu,url=SITE+"verify.html?id="+encodeURIComponent(r.certNo);
  return '<div class="ccert">'+(S.demo?'<span class="cc-sample">SAMPLE — not a real certificate</span>':'')+'<div class="ccert-in">'+
  '<div class="ccert-top"><img src="assets/img/logo.png" alt="" width="54" height="54"><div><p class="ccert-org">Zero Cube Climate &amp; Social Impact Foundation</p><p class="ccert-sub">A Section 8 not-for-profit company · CIN U88900PN2026NPL260913</p></div><p class="ccert-no">Certificate no.<b>'+esc(r.certNo)+'</b></p></div>'+
  '<h2 class="ccert-t">Climate Duty Bearer<br>Commitment Certificate</h2>'+
  '<p class="ccert-l">This certifies that</p><p class="ccert-name">'+esc(ZCDocs.dispName(p))+'</p>'+
  '<p class="ccert-l">has made the lifelong <b>Zero Cube Climate Duty Pledge</b> — a personal commitment to daily climate habits and to quality education — and that this pledge is recorded, unchanged, in the Zero Cube Pledge Ledger.</p>'+
  '<table class="ccert-tb"><tbody>'+
  '<tr><th scope="row">Pledge ID</th><td>'+esc(p.id)+'</td><th scope="row">Date pledged</th><td>'+esc(fd(p.date))+' (once, for life)</td></tr>'+
  '<tr><th scope="row">Commitments</th><td>'+(p.ids||[]).length+' daily habits</td><th scope="row">Education pledge</th><td>'+e.students+' student'+(e.students>1?"s":"")+' '+(e.mode==="teach"?"taught or mentored":"supported")+' a year</td></tr>'+
  '<tr><th scope="row">Pledged estimate</th><td colspan="3">≈'+fmtKg(k.kg)+' CO₂e a year — an <i>indicative estimate of the pledge</i>, not a measured or verified reduction</td></tr>'+
  '<tr><th scope="row">Pledge on ledger</th><td colspan="3">Block #'+esc(r.pledgeBlock)+' · fingerprint <code>'+esc(r.pledgeFp)+'</code></td></tr>'+
  '<tr><th scope="row">This certificate</th><td colspan="3">Issued '+esc(fd(r.issued))+' · '+(c.block!=null?'recorded in block #'+esc(c.block):'recorded in the ledger the night of issue')+' · fingerprint <code>'+esc(c.fp)+'</code></td></tr>'+
  '</tbody></table>'+
  '<div class="ccert-what"><b>What this certificate certifies:</b> the <b>commitment</b> (the pledge) made by the person named above, and that its record is unchanged. It does <b>not</b> certify achieved results, measured or verified emission reductions, carbon credits, or an audit.</div>'+
  '<div class="ccert-foot"><div class="ccert-sig"><span class="sigph">[Signature placeholder]</span><small>Director<br>Zero Cube Climate &amp; Social Impact Foundation</small></div>'+
  '<div class="ccert-sig"><span class="sigph">[Signature placeholder]</span><small>Director<br>Zero Cube Climate &amp; Social Impact Foundation</small></div>'+
  '<div class="ccert-qr">'+qrSvg(url)+'<small>Verify: '+esc(url.replace(/^https?:\/\//,""))+'</small></div></div>'+
  '<p class="lresp">Issued to a Zero Cube member at no extra fee, under the Zero Cube Pledge terms (draft). A voluntary moral commitment — not a legal contract, donation or certification of results.</p></div></div>'}
function ccRender(){var el=$("#ccBody"),c=S.cert;
  if(!memberActive()&&c.status!=="Issued"){el.innerHTML=lockBox("The Commitment Certificate");return}
  if(!ready()){el.innerHTML='<p class="mp-wait">🔒 You can apply once your pledge is <b>approved</b> and recorded in the Zero Cube Pledge Ledger (the night after approval).</p>';return}
  if(c.status==="none"){
    el.innerHTML='<div class="cc-intro"><p>Get a formal <b>Climate Duty Bearer Commitment Certificate</b> for your lifelong pledge. (Your Certificate of Honour below is our thank-you; this one is a formal certificate you apply for.) It shows your pledge ID, its ledger block and fingerprint, and a QR code anyone can scan to verify it. <b>No extra fee for members.</b></p>'+
    '<ol class="steps-s"><li><b>1</b><span><b>Apply</b> here (one click).</span></li><li><b>2</b><span><b>Under review:</b> our team checks your pledge and its ledger record.</span></li><li><b>3</b><span><b>Issued:</b> we record the certificate\'s own fingerprint in the ledger and email you the PDF. You can also print it here.</span></li></ol></div>'+
    '<form id="ccForm" class="pform" novalidate><div class="frow"><label for="ccName">Name to be printed</label><input id="ccName" value="'+esc(ZCDocs.dispName(S.p))+'" readonly aria-describedby="ccNameH"><p class="fhelp" id="ccNameH">As on your pledge. To correct it, email us before applying.</p></div>'+
    '<label class="chk"><input type="checkbox" id="ccOk1" required><span>My pledge details shown on this page are correct.</span></label>'+
    '<label class="chk"><input type="checkbox" id="ccOk2" required><span>I understand the certificate certifies my <b>commitment</b> (my pledge), not achieved results or verified emission cuts.</span></label>'+
    '<button class="btn btn-pri" type="submit">Apply for my Commitment Certificate</button><div id="ccStatus" class="pstatus" role="status" aria-live="polite"></div></form>';
    $("#ccForm").addEventListener("submit",function(ev){ev.preventDefault();var st=$("#ccStatus");
      if(!$("#ccOk1").checked||!$("#ccOk2").checked){h.msg(st,"Please tick both boxes to apply.","err");return}
      if(S.demo||!C.ENDPOINT){S.cert={status:"Applied",applied:today()};save();render();var t=$("#ccStatus2");if(t)h.msg(t,"<b>Demo mode:</b> nothing was sent. When live, we email you when the status changes.","demo");return}
      h.api({action:"applyCert",session:localStorage.getItem("zc_mp_session")}).then(function(j){if(j.ok){S.cert=j.cert;render()}else h.msg(st,esc(j.error||"Something went wrong."),"err")},function(){h.msg(st,"Could not reach the server.","err")})});
    return}
  if(c.status!=="Issued"){el.innerHTML=stepper(CC_STEPS,c.status)+'<p>Applied on <b>'+esc(fd(c.applied||today()))+'</b>. '+(c.status==="Applied"?"Your application is in the queue.":"Our team is checking your pledge and its ledger record.")+' We will email you when it is issued (usually within a few working days).</p><div id="ccStatus2" class="pstatus" role="status" aria-live="polite"></div>';return}
  var d=certData();
  var lapsed=!memberActive();
  el.innerHTML=stepper(CC_STEPS,"Issued")+(lapsed?'<p class="pstatus demo">Your membership is '+esc(ms().toLowerCase())+'. This certificate <b>stays valid as a record</b> of your commitment. Renewal, upgrades and progress updates need an active membership. <a href="'+joinUrl()+'">Renew my membership</a></p>':'')+'<p>Issued on <b>'+esc(fd(d.record.issued))+'</b> · certificate no. <b>'+esc(d.record.certNo)+'</b> · '+(d.block!=null?'recorded in <a href="ledger.html#b='+esc(d.block)+'">ledger block #'+esc(d.block)+'</a>.':'its fingerprint goes into tonight\'s ledger block.')+'</p>'+
  '<div class="mp-cert">'+ccHTML()+'</div>'+
  '<p class="row"><button class="btn btn-pri" type="button" id="ccPrint">Print / save as PDF</button><a class="btn btn-ghost" href="verify.html?id='+encodeURIComponent(d.record.certNo)+'">Verify this certificate</a><button class="btn btn-ghost" type="button" id="ccRec">Download certificate record (.json)</button></p>'+
  '<details class="acc prog"><summary>Add a progress update <span class="selfd">self-declared</span></summary><div class="accb"><p>Tell us how your habits are going. Updates are <b>self-declared</b>: we do not check them, and they are not shown on the certificate. They help with a later renewal or upgrade.</p>'+
  '<form id="pgForm" class="pform" novalidate><div class="frow"><label for="pgMonth">Month</label><input id="pgMonth" type="month" required></div><div class="frow"><label for="pgText">What I did (self-declared)</label><textarea id="pgText" maxlength="400" rows="3" required placeholder="e.g. Kept the AC at 25 °C all month; started composting at home."></textarea></div>'+
  '<button class="btn btn-ghost" type="submit">Save update</button><div id="pgStatus" class="pstatus" role="status" aria-live="polite"></div></form><ul class="pg-list" id="pgList"></ul></div></details>';
  if(lapsed){var pg=el.querySelector("details.prog");if(pg)pg.remove()}
  $("#ccPrint").addEventListener("click",function(){$("#printArea").innerHTML=ccHTML();document.body.classList.add("print-one");window.print();setTimeout(function(){document.body.classList.remove("print-one")},500)});
  $("#ccRec").addEventListener("click",function(){var u=URL.createObjectURL(new Blob([ZC_CHAIN.canon(d.record)],{type:"application/json"}));h.dl("zerocube-certificate-"+d.record.certNo+".json",u)});
  if(lapsed)return;
  var list=(S.cert.progress||[]);function pl(){$("#pgList").innerHTML=list.map(function(x){return '<li><b>'+esc(x.month)+'</b> <span class="selfd">self-declared</span> '+esc(x.text)+'</li>'}).join("")}pl();
  $("#pgForm").addEventListener("submit",function(ev){ev.preventDefault();var m=$("#pgMonth").value,t=$("#pgText").value.trim(),st=$("#pgStatus");
    if(!m||t.length<5){h.msg(st,"Please choose a month and write a short update.","err");return}
    if(S.demo||!C.ENDPOINT){list.unshift({month:m,text:t});S.cert.progress=list;save();pl();$("#pgText").value="";h.msg(st,"<b>Demo mode:</b> saved in this browser only. When live, updates are kept privately and are marked self-declared.","demo");return}
    h.api({action:"progress",session:localStorage.getItem("zc_mp_session"),month:m,text:t}).then(function(j){h.msg(st,j.ok?"Saved. Thank you!":esc(j.error||"Error"),j.ok?"ok":"err");if(j.ok){list.unshift({month:m,text:t});pl()}})})}

/* ---------- Net Zero audit expression of interest ---------- */
function unitFor(w){var x=WHO.find(function(a){return a[0]===w});return x?x[2]:"people"}
function labelFor(w){var x=WHO.find(function(a){return a[0]===w});return x?x[1]:w}
function feeLine(w){return w==="village"?'<b>Villages never pay.</b> Village audits are funded through CSR and donor support.':'Fees are <b>as per our <a href="membership.html#tiers">fee card</a></b>. You will see the applicable fee before anything is agreed.'}
function auRender(){var el=$("#auditBody"),a=S.audit;
  if(a.status==="none"&&!memberActive()&&!S.villageRoute){
    el.innerHTML=lockBox("Showing interest in a Net Zero audit",'<hr><p><b>A village or Gram Panchayat?</b> Villages never pay and never need a paid membership. Village Net Zero certification is funded through CSR, at no cost to the village.</p><p><button class="btn btn-ghost" type="button" id="auVillage">Send a village audit interest (no membership or fee)</button></p>');
    $("#auVillage").addEventListener("click",function(){S.villageRoute=true;auRender()});return}
  if(a.status==="none"){
    el.innerHTML='<p>A Zero Cube <b>Net Zero audit</b> is an assessment under <b>Zero Cube\'s own criteria</b>: a footprint baseline (including Scope 3 where relevant), the main sources, and a practical reduction plan. It is not third-party assurance or accredited verification.</p>'+
    '<div class="au-rules"><p>✔ This is only an <b>expression of interest</b>: <b>not a booking and not a payment</b>.</p><p>✔ <b>Villages never pay</b>: village audits are funded through CSR and donor support.</p><p>✔ For others, fees are <b>as per our <a href="membership.html#tiers">fee card</a></b>.</p></div>'+
    '<form id="auForm" class="pform" novalidate><div class="frow"><label for="auWho">Audit for</label><select id="auWho" required><option value="">Choose…</option>'+WHO.map(function(w){return '<option value="'+w[0]+'">'+w[1]+'</option>'}).join("")+'</select></div>'+
    '<div class="frow" id="auOrgRow"><label for="auOrg">Organisation / village / society name</label><input id="auOrg" maxlength="80" autocomplete="organization"></div>'+
    '<div class="fgrid2"><div class="frow"><label for="auCity">City / village</label><input id="auCity" maxlength="40" required value="'+esc(S.p.city||"")+'"></div><div class="frow"><label for="auState">State</label><input id="auState" maxlength="40" required value="'+esc(S.p.state||"")+'"></div></div>'+
    '<div class="fgrid2"><div class="frow"><label for="auSize">Size: number of <span id="auUnit">people</span></label><input id="auSize" type="number" min="1" max="1000000" inputmode="numeric" required></div>'+
    '<div class="frow"><label for="auTime">Preferred contact time</label><select id="auTime" required><option value="">Choose…</option><option>Weekday morning (9–12)</option><option>Weekday afternoon (12–5)</option><option>Weekday evening (5–8)</option><option>Weekend</option></select></div></div>'+
    '<div class="frow"><label for="auPhone">Mobile (optional; we already have your email)</label><input id="auPhone" type="tel" inputmode="tel" maxlength="14" autocomplete="tel"></div>'+
    '<div class="frow"><label for="auNotes">Anything else? (optional)</label><textarea id="auNotes" rows="2" maxlength="300" placeholder="e.g. we have rooftop solar; we want to start with electricity and waste"></textarea></div>'+
    '<label class="chk"><input type="checkbox" id="auConsent" required><span>I agree that Zero Cube may contact me by email or phone about this interest. I understand this is <b>not a booking or a payment</b>, and I can withdraw at any time.</span></label>'+
    '<button class="btn btn-pri" type="submit">Send my interest</button><div id="auStatus" class="pstatus" role="status" aria-live="polite"></div></form>';
    var who=$("#auWho");
    if(!memberActive()){who.innerHTML='<option value="village">Village / Gram Panchayat</option>';who.value="village";$("#auUnit").textContent=unitFor("village");
      el.insertAdjacentHTML("afterbegin",'<p class="pstatus demo">Village route: no membership and no fee. Village Net Zero certification is funded through CSR. <button class="linkbtn" type="button" id="auBack">Back</button></p>');$("#auBack").addEventListener("click",function(){S.villageRoute=false;auRender()})}
    who.addEventListener("change",function(){$("#auUnit").textContent=unitFor(who.value);$("#auOrgRow").hidden=who.value==="home"});
    $("#auForm").addEventListener("submit",function(ev){ev.preventDefault();var st=$("#auStatus"),w=who.value,d={who:w,org:$("#auOrg").value.trim(),city:$("#auCity").value.trim(),state:$("#auState").value.trim(),size:+$("#auSize").value,time:$("#auTime").value,phone:$("#auPhone").value.trim(),notes:$("#auNotes").value.trim()};
      var err=!w?"Please choose who the audit is for.":(w!=="home"&&!d.org)?"Please give the organisation, village or society name.":!d.city||!d.state?"Please give the city and state.":!(d.size>=1)?"Please give the size (a number).":!d.time?"Please choose a contact time.":(d.phone&&d.phone.replace(/\D/g,"").length<10)?"Please check the mobile number (10 digits).":!$("#auConsent").checked?"Please tick the consent box.":"";
      if(err){h.msg(st,err,"err");return}
      if(S.demo||!C.ENDPOINT){S.audit={status:"Interest received",ref:"ZC-NZA-SAMPLE-0001",at:today(),data:d,demoSent:true,route:memberActive()?"member":"village"};S.villageRoute=false;save();render();return}
      h.api({action:"auditInterest",session:localStorage.getItem("zc_mp_session"),consent:true,route:memberActive()?"member":"village",data:d}).then(function(j){if(j.ok){S.audit=j.audit;render()}else h.msg(st,esc(j.error||"Something went wrong."),"err")},function(){h.msg(st,"Could not reach the server.","err")})});
    return}
  var d=a.data||{who:"school",org:"Sample Public School (SAMPLE)",city:S.p.city,state:S.p.state,size:600,time:"Weekday morning (9–12)",notes:""};
  var next={"Interest received":"Thank you! A team member will contact you at your preferred time, usually within 5 working days.","Contacted":"We have been in touch. Next, we agree the scope of the audit with you.","Scoped":"The scope is agreed. You will receive the scope note and the applicable fee (as per the fee card) before anything starts. Nothing is booked or paid until you confirm."}[a.status];
  el.innerHTML=stepper(AU_STEPS,a.status)+(!memberActive()&&a.route!=="village"&&(d.who!=="village")?'<p class="pstatus demo">Your membership is not active. We keep this interest open; new requests need an active membership.</p>':'')+(a.demoSent?'<p class="pstatus demo"><b>Demo mode:</b> nothing was sent or saved. When live, your interest goes to our moderator team and you get a confirmation email.</p>':'')+
  '<p><b>Reference:</b> '+esc(a.ref||"ZC-NZA-SAMPLE-0001")+' · received '+esc(fd(a.at||today()))+'. '+next+'</p>'+
  '<table class="au-sum"><tbody><tr><th scope="row">Audit for</th><td>'+esc(labelFor(d.who))+(d.org?" — "+esc(d.org):"")+'</td></tr><tr><th scope="row">Location</th><td>'+esc([d.city,d.state].filter(Boolean).join(", "))+'</td></tr><tr><th scope="row">Size</th><td>'+esc(d.size)+' '+esc(unitFor(d.who))+'</td></tr><tr><th scope="row">Contact time</th><td>'+esc(d.time)+'</td></tr>'+(d.notes?'<tr><th scope="row">Notes</th><td>'+esc(d.notes)+'</td></tr>':'')+'</tbody></table>'+
  '<p class="mini">'+feeLine(d.who)+' This is not a booking or a payment. To change or withdraw your interest, email <a href="mailto:ZEROCUBECIF@GMAIL.COM?subject=Net%20Zero%20audit%20interest%20'+esc(a.ref||"")+'">ZEROCUBECIF@GMAIL.COM</a>.</p>'}

function render(){nextSteps();memRender();ccRender();auRender();document.querySelectorAll(".demo-only").forEach(function(x){x.hidden=!S.demo});
  document.querySelectorAll("[data-cc]").forEach(function(b){b.classList.toggle("on",b.dataset.cc===S.cert.status);b.setAttribute("aria-pressed",b.dataset.cc===S.cert.status)});
  document.querySelectorAll("[data-au]").forEach(function(b){b.classList.toggle("on",b.dataset.au===S.audit.status);b.setAttribute("aria-pressed",b.dataset.au===S.audit.status)});
  document.querySelectorAll("[data-ms]").forEach(function(b){b.classList.toggle("on",b.dataset.ms===ms());b.setAttribute("aria-pressed",b.dataset.ms===ms())})}
var wired=false;
function wire(){if(wired)return;wired=true;
  document.querySelectorAll("[data-cc]").forEach(function(b){b.addEventListener("click",function(){if(!S.demo)return;var st=b.dataset.cc;S.cert=st==="Issued"?JSON.parse(JSON.stringify(X.account.cert)):{status:st,applied:S.cert.applied||X.account.cert.applied};if(st==="none")S.cert={status:"none"};save();render()})});
  document.querySelectorAll("[data-ms]").forEach(function(b){b.addEventListener("click",function(){if(!S.demo)return;var st=b.dataset.ms,M=JSON.parse(JSON.stringify(X.account.membership));
    S.membership=st==="None"?{status:"None"}:st==="Applied"?{status:"Applied",tier:M.tier}:Object.assign(M,{status:st});
    S.cert=st==="Active"||st==="Expired"?JSON.parse(JSON.stringify(X.account.cert)):{status:"none"};S.audit={status:"none"};S.villageRoute=false;save();render()})});
  document.querySelectorAll("[data-au]").forEach(function(b){b.addEventListener("click",function(){if(!S.demo)return;var st=b.dataset.au;S.audit=st==="none"?{status:"none"}:Object.assign({},S.audit,{status:st,ref:S.audit.ref||"ZC-NZA-SAMPLE-0001",at:S.audit.at||today(),demoSent:false});save();render()})})}
return {render:function(s,helpers){S=s;h=helpers;wire();render()}};
})();
