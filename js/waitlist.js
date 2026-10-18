/* Zero Cube — Founding Members waitlist (SOFT LAUNCH, Phase 1). Collects interest only: NO payment is taken or requested.
   With ZC_PLEDGE_CONFIG.ENDPOINT set, it POSTs {action:"waitlist"} to the Apps Script backend (pledge-backend/Code.gs → "Waitlist" tab).
   With no ENDPOINT it falls back to a pre-filled email to WAITLIST_EMAIL (zerocubecif@gmail.com). Opens from any .wl-open button or #waitlist in the URL. */
(function(){
"use strict";
var C=window.ZC_PLEDGE_CONFIG||{}, TO=C.WAITLIST_EMAIL||"zerocubecif@gmail.com";
var TIERS=["Student / Youth Member","Individual Supporter","Startup Supporter","MSME Member","Institution / School Member","Education Champion","Student Sponsor","Green School Partner","0³ Foundation Member","NPO Member — Verified Projects","Eco-Product Manufacturer Member","Certified Network Member","Expert / Volunteer Associate","Corporate Climate Partner — Supporter","Corporate Climate Partner — Partner","Corporate Climate Partner — Champion","Lifetime Supporter","Patron / Founding Circle"];
var esc=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var dlg=null, opener=null;
function build(){
  dlg=document.createElement("dialog");dlg.className="wl-dlg";dlg.id="wlDialog";dlg.setAttribute("aria-labelledby","wlTitle");
  dlg.innerHTML='<form id="wlForm" class="pform wl-form" novalidate>'+
  '<div class="wl-head"><div><span class="eyebrow">Founding Members waitlist</span><h2 id="wlTitle">Express interest</h2></div><button type="button" class="wl-x" id="wlClose" aria-label="Close">×</button></div>'+
  '<p class="wl-note" role="note"><b>Membership payments open soon, once our bank account is active. No payment is collected now.</b> We will contact you when membership opens; you decide then.</p>'+
  '<div class="frow"><label for="wlName">Full name *</label><input id="wlName" name="name" required maxlength="80" autocomplete="name"></div>'+
  '<div class="frow"><label for="wlEmail">Email *</label><input id="wlEmail" name="email" type="email" required maxlength="120" autocomplete="email"></div>'+
  '<div class="frow"><label for="wlPhone">Phone (10-digit mobile) *</label><input id="wlPhone" name="phone" type="tel" required maxlength="16" inputmode="tel" autocomplete="tel"></div>'+
  '<div class="frow"><label for="wlTier">Membership tier *</label><select id="wlTier" name="tier" required><option value="">Choose a tier…</option>'+TIERS.map(function(t){return '<option>'+esc(t)+'</option>'}).join("")+'<option>Not sure yet — please suggest one</option></select></div>'+
  '<div class="frow"><label for="wlOrg">Organisation (optional)</label><input id="wlOrg" name="org" maxlength="120" autocomplete="organization"></div>'+
  '<input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">'+
  '<label class="chk"><input type="checkbox" id="wlConsent" name="consent" required><span>I agree that Zero Cube may store these details and contact me about membership. This is not a payment or a commitment to join, and I can ask for my details to be deleted at any time (<a href="policies.html#privacy" target="_blank" rel="noopener">privacy policy</a>).</span></label>'+
  '<p class="row"><button class="btn btn-donate" type="submit">Join the waitlist</button><button class="btn btn-ghost" type="button" id="wlCancel">Cancel</button></p>'+
  '<div id="wlStatus" class="pstatus" role="status" aria-live="polite"></div></form>';
  document.body.appendChild(dlg);
  var root=(document.querySelector('link[rel=stylesheet][href$="css/style.css"]')||{}).getAttribute?document.querySelector('link[rel=stylesheet][href$="css/style.css"]').getAttribute("href").replace("css/style.css",""):"";
  dlg.querySelector('a[href^="policies"]').setAttribute("href",root+"policies.html#privacy");
  dlg.querySelector("#wlClose").addEventListener("click",close);dlg.querySelector("#wlCancel").addEventListener("click",close);
  dlg.addEventListener("click",function(e){if(e.target===dlg)close()});
  dlg.addEventListener("close",function(){if(location.hash==="#waitlist")history.replaceState(null,"",location.pathname+location.search);if(opener&&opener.focus)opener.focus()});
  dlg.querySelector("#wlForm").addEventListener("submit",submit);
}
function open(tier,from){if(!dlg)build();opener=from||document.activeElement;var f=dlg.querySelector("#wlForm");
  if(tier){var sel=f.tier;for(var i=0;i<sel.options.length;i++)if(sel.options[i].text===tier){sel.selectedIndex=i;break}}
  dlg.querySelector("#wlStatus").className="pstatus";dlg.querySelector("#wlStatus").innerHTML="";
  if(typeof dlg.showModal==="function"){if(!dlg.open)dlg.showModal()}else dlg.setAttribute("open","");
  setTimeout(function(){f.name.focus()},30)}
function close(){if(dlg&&dlg.open){if(typeof dlg.close==="function")dlg.close();else dlg.removeAttribute("open")}}
function msg(html,cls){var st=dlg.querySelector("#wlStatus");st.className="pstatus "+(cls||"");st.innerHTML=html}
function submit(e){e.preventDefault();var f=e.target;if(f.website.value)return;
  var d={name:f.name.value.trim(),email:f.email.value.trim(),phone:f.phone.value.replace(/\D/g,""),tier:f.tier.value,org:f.org.value.trim(),consent:f.consent.checked};
  if(!d.name){msg("Please enter your name.","err");f.name.focus();return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)){msg("Please enter a valid email address.","err");f.email.focus();return}
  if(d.phone.length<10){msg("Please enter a 10-digit mobile number.","err");f.phone.focus();return}
  d.phone=d.phone.slice(-10);
  if(!d.tier){msg("Please choose a tier (or “Not sure yet”).","err");f.tier.focus();return}
  if(!d.consent){msg("Please tick the consent box so we can contact you.","err");f.consent.focus();return}
  var btn=f.querySelector("button[type=submit]");
  if(C.ENDPOINT){btn.disabled=true;msg("Sending…");
    fetch(C.ENDPOINT,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"waitlist",name:d.name,email:d.email,phone:d.phone,tier:d.tier,org:d.org,consent:true,page:location.pathname,website:""})})
     .then(function(r){return r.json()}).then(function(j){btn.disabled=false;
       if(j.ok){msg("<b>Thank you, "+esc(d.name.split(" ")[0])+"!</b> You are on the Founding Members waitlist"+(j.duplicate?" (we already had your details — updated)":"")+". No payment has been taken. We will email you when membership opens.","ok");f.reset()}
       else msg(esc(j.error||"Something went wrong. Please try again."),"err")},
     function(){btn.disabled=false;mailFallback(d,"We could not reach our server, so ")});
    return}
  mailFallback(d,"");
}
function mailFallback(d,pre){var body="Please add me to the Zero Cube Founding Members waitlist.\n\nName: "+d.name+"\nEmail: "+d.email+"\nPhone: "+d.phone+"\nTier: "+d.tier+"\nOrganisation: "+(d.org||"—")+"\n\nI agree that Zero Cube may store these details and contact me about membership. I understand this is not a payment or a commitment to join.";
  var href="mailto:"+TO+"?subject="+encodeURIComponent("Founding Members waitlist — "+d.tier)+"&body="+encodeURIComponent(body);
  var tail="If it does not open, <a href=\""+esc(href)+"\">click here</a> or email <a href=\"mailto:"+TO+"\">"+TO+"</a>. No payment is collected.";
  msg(pre?esc(pre)+"your email app should open with your details filled in — just press <b>Send</b>. "+tail:"Your email app should open with your details filled in — just press <b>Send</b> to join the waitlist. "+tail,"ok");
  try{window.location.href=href}catch(e){}
}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".wl-open");if(b){e.preventDefault();open(b.getAttribute("data-tier")||"",b)}
  var a=e.target.closest&&e.target.closest('a[href$="#waitlist"]');if(a&&/membership\.html#waitlist$/.test(a.getAttribute("href"))&&/membership\.html$/.test(location.pathname)){e.preventDefault();open("",a)}});
function fromHash(){if(location.hash==="#waitlist"&&document.getElementById("tiers"))open("")}
window.addEventListener("hashchange",fromHash);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",fromHash);else fromHash();
window.ZCWaitlist={open:open,close:close};
})();
