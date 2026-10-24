/* Zero Cube — membership application / "Join the movement" (LAUNCH 24 Oct 2026: wording for open membership; was the Phase 1 waitlist; global fields added 21 Oct 2026: country + how you would like to contribute).
   On a page with <div id="wlInline"> (join.html) the form is shown inline instead of in a dialog. Collects interest only: NO payment is taken or requested.
   With ZC_PLEDGE_CONFIG.ENDPOINT set, it POSTs {action:"waitlist"} to the Apps Script backend (pledge-backend/Code.gs → "Waitlist" tab).
   With no ENDPOINT it falls back to a pre-filled email to WAITLIST_EMAIL (zerocubecif@gmail.com). Opens from any .wl-open button or #waitlist in the URL. */
(function(){
"use strict";
var C=window.ZC_PLEDGE_CONFIG||{}, TO=C.WAITLIST_EMAIL||"zerocubecif@gmail.com";
var TIERS=["Student / Youth Member","Individual Supporter","Startup Supporter","MSME Member","Institution / School Member","Education Champion","Student Sponsor","Green School Partner","0³ Foundation Member","NPO Member — Verified Projects","Eco-Product Manufacturer Member","Certified Network Member","Expert / Volunteer Associate","Corporate Climate Partner — Supporter","Corporate Climate Partner — Partner","Corporate Climate Partner — Champion","Lifetime Supporter","Patron / Founding Circle"];
var COUNTRIES="Afghanistan,Albania,Algeria,Andorra,Angola,Antigua and Barbuda,Argentina,Armenia,Australia,Austria,Azerbaijan,Bahamas,Bahrain,Bangladesh,Barbados,Belarus,Belgium,Belize,Benin,Bhutan,Bolivia,Bosnia and Herzegovina,Botswana,Brazil,Brunei,Bulgaria,Burkina Faso,Burundi,Cabo Verde,Cambodia,Cameroon,Canada,Central African Republic,Chad,Chile,China,Colombia,Comoros,Congo,Costa Rica,Côte d’Ivoire,Croatia,Cuba,Cyprus,Czechia,Democratic Republic of the Congo,Denmark,Djibouti,Dominica,Dominican Republic,Ecuador,Egypt,El Salvador,Equatorial Guinea,Eritrea,Estonia,Eswatini,Ethiopia,Fiji,Finland,France,Gabon,Gambia,Georgia,Germany,Ghana,Greece,Grenada,Guatemala,Guinea,Guinea-Bissau,Guyana,Haiti,Honduras,Hungary,Iceland,India,Indonesia,Iran,Iraq,Ireland,Israel,Italy,Jamaica,Japan,Jordan,Kazakhstan,Kenya,Kiribati,Kuwait,Kyrgyzstan,Laos,Latvia,Lebanon,Lesotho,Liberia,Libya,Liechtenstein,Lithuania,Luxembourg,Madagascar,Malawi,Malaysia,Maldives,Mali,Malta,Marshall Islands,Mauritania,Mauritius,Mexico,Micronesia,Moldova,Monaco,Mongolia,Montenegro,Morocco,Mozambique,Myanmar,Namibia,Nauru,Nepal,Netherlands,New Zealand,Nicaragua,Niger,Nigeria,North Korea,North Macedonia,Norway,Oman,Pakistan,Palau,Palestine,Panama,Papua New Guinea,Paraguay,Peru,Philippines,Poland,Portugal,Qatar,Romania,Russia,Rwanda,Saint Kitts and Nevis,Saint Lucia,Saint Vincent and the Grenadines,Samoa,San Marino,Sao Tome and Principe,Saudi Arabia,Senegal,Serbia,Seychelles,Sierra Leone,Singapore,Slovakia,Slovenia,Solomon Islands,Somalia,South Africa,South Korea,South Sudan,Spain,Sri Lanka,Sudan,Suriname,Sweden,Switzerland,Syria,Taiwan,Tajikistan,Tanzania,Thailand,Timor-Leste,Togo,Tonga,Trinidad and Tobago,Tunisia,Türkiye,Turkmenistan,Tuvalu,Uganda,Ukraine,United Arab Emirates,United Kingdom,United States,Uruguay,Uzbekistan,Vanuatu,Vatican City,Venezuela,Vietnam,Yemen,Zambia,Zimbabwe".split(",");
var esc=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var dlg=null, opener=null;
var ROOT=(function(){var l=document.querySelector('link[rel=stylesheet][href$="css/style.css"]');return l?l.getAttribute("href").replace("css/style.css",""):""})();
var INLINE=null;
function build(){
  INLINE=document.getElementById("wlInline");
  if(INLINE){dlg=document.createElement("div");dlg.className="wl-inline card";dlg.id="wlDialog";}
  else{dlg=document.createElement("dialog");dlg.className="wl-dlg";dlg.id="wlDialog";}
  dlg.setAttribute("aria-labelledby","wlTitle");
  dlg.innerHTML='<form id="wlForm" class="pform wl-form" novalidate>'+
  '<div class="wl-head"><div><span class="eyebrow">Membership application</span><h2 id="wlTitle">Join the movement</h2></div><button type="button" class="wl-x" id="wlClose" aria-label="Close">×</button></div>'+
  '<p class="wl-note" role="note">Open to anyone, anywhere in the world. Apply here, then pay your fee by bank transfer, UPI or online (<a href="'+ROOT+'membership.html#pay">how to pay</a>). For tiers that need screening or a size-based fee, we email you first. People outside India: please write to us before paying.</p>'+
  '<div class="frow"><label for="wlName">Full name *</label><input id="wlName" name="name" required maxlength="80" autocomplete="name"></div>'+
  '<div class="frow"><label for="wlEmail">Email *</label><input id="wlEmail" name="email" type="email" required maxlength="120" autocomplete="email"></div>'+
  '<div class="frow"><label for="wlPhone">Phone / WhatsApp * <small>(with country code if outside India)</small></label><input id="wlPhone" name="phone" type="tel" required maxlength="20" inputmode="tel" autocomplete="tel" placeholder="e.g. 98765 43210 or +44 20 7946 0000"></div>'+
  '<div class="frow"><label for="wlCountry">Country *</label><input id="wlCountry" name="country" required maxlength="60" list="wlCountries" autocomplete="country-name"><datalist id="wlCountries">'+COUNTRIES.map(function(c){return '<option value="'+esc(c)+'">'}).join("")+'</datalist></div>'+
  '<div class="frow"><label for="wlTier">Membership tier *</label><select id="wlTier" name="tier" required><option value="">Choose a tier…</option>'+TIERS.map(function(t){return '<option>'+esc(t)+'</option>'}).join("")+'<option>Not sure yet — please suggest one</option></select></div>'+
  '<div class="frow"><label for="wlContribute">How would you like to contribute? <small>(optional)</small></label><textarea id="wlContribute" name="contribute" rows="3" maxlength="500" placeholder="Your time, skills, ideas, a classroom, a village, your network… anything you would like to bring."></textarea></div>'+
  '<div class="frow"><label for="wlOrg">Organisation (optional)</label><input id="wlOrg" name="org" maxlength="120" autocomplete="organization"></div>'+
  '<input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">'+
  '<label class="chk"><input type="checkbox" id="wlConsent" name="consent" required><span>I agree that Zero Cube may store these details and contact me about joining. Submitting this form is not a payment, and I can ask for my details to be deleted at any time (<a href="privacy.html" target="_blank" rel="noopener">privacy policy</a>).</span></label>'+
  '<p class="row"><button class="btn btn-donate" type="submit">Send my application</button><button class="btn btn-ghost" type="button" id="wlCancel">Cancel</button></p>'+
  '<div id="wlStatus" class="pstatus" role="status" aria-live="polite"></div></form>';
  if(INLINE){INLINE.appendChild(dlg);dlg.querySelector("#wlClose").hidden=true;dlg.querySelector("#wlCancel").hidden=true;}else document.body.appendChild(dlg);
  var root=(document.querySelector('link[rel=stylesheet][href$="css/style.css"]')||{}).getAttribute?document.querySelector('link[rel=stylesheet][href$="css/style.css"]').getAttribute("href").replace("css/style.css",""):"";
  dlg.querySelector('a[href^="privacy"]').setAttribute("href",root+"privacy.html");
  dlg.querySelector("#wlClose").addEventListener("click",close);dlg.querySelector("#wlCancel").addEventListener("click",close);
  if(!INLINE)dlg.addEventListener("click",function(e){if(e.target===dlg)close()});
  dlg.addEventListener("close",function(){if(location.hash==="#waitlist")history.replaceState(null,"",location.pathname+location.search);if(opener&&opener.focus)opener.focus()});
  dlg.querySelector("#wlForm").addEventListener("submit",submit);
}
function open(tier,from){if(!dlg)build();opener=from||document.activeElement;var f=dlg.querySelector("#wlForm");
  if(tier){var sel=f.tier;for(var i=0;i<sel.options.length;i++)if(sel.options[i].text===tier){sel.selectedIndex=i;break}}
  dlg.querySelector("#wlStatus").className="pstatus";dlg.querySelector("#wlStatus").innerHTML="";
  if(INLINE){dlg.scrollIntoView({behavior:"smooth",block:"start"});setTimeout(function(){f.name.focus({preventScroll:true})},300);return}
  if(typeof dlg.showModal==="function"){if(!dlg.open)dlg.showModal()}else dlg.setAttribute("open","");
  setTimeout(function(){f.name.focus()},30)}
function close(){if(INLINE)return;if(dlg&&dlg.open){if(typeof dlg.close==="function")dlg.close();else dlg.removeAttribute("open")}}
function msg(html,cls){var st=dlg.querySelector("#wlStatus");st.className="pstatus "+(cls||"");st.innerHTML=html}
function submit(e){e.preventDefault();var f=e.target;if(f.website.value)return;
  var rawPhone=f.phone.value.trim();
  var d={name:f.name.value.trim(),email:f.email.value.trim(),phone:(/^\+/.test(rawPhone)?"+":"")+rawPhone.replace(/\D/g,""),country:f.country.value.trim(),tier:f.tier.value,org:f.org.value.trim(),contribute:f.contribute.value.trim().slice(0,500),consent:f.consent.checked};
  if(!d.name){msg("Please enter your name.","err");f.name.focus();return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)){msg("Please enter a valid email address.","err");f.email.focus();return}
  var pd=d.phone.replace(/\D/g,"");
  if(pd.length<7||pd.length>15){msg("Please enter your phone number (with your country code if you are outside India).","err");f.phone.focus();return}
  if(!d.country){msg("Please tell us your country.","err");f.country.focus();return}
  if(!d.tier){msg("Please choose a tier (or “Not sure yet”).","err");f.tier.focus();return}
  if(!d.consent){msg("Please tick the consent box so we can contact you.","err");f.consent.focus();return}
  var btn=f.querySelector("button[type=submit]");
  if(C.ENDPOINT){btn.disabled=true;msg("Sending…");
    fetch(C.ENDPOINT,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"waitlist",name:d.name,email:d.email,phone:d.phone,country:d.country,tier:d.tier,org:d.org,contribute:d.contribute,consent:true,page:location.pathname,website:""})})
     .then(function(r){return r.json()}).then(function(j){btn.disabled=false;
       if(j.ok){msg("<b>Thank you, "+esc(d.name.split(" ")[0])+"!</b> We have your membership application"+(j.duplicate?" (we already had your details, so we updated them)":"")+". Next: pay your fee (<a href=\""+ROOT+"membership.html#pay\">how to pay</a>) and send us the payment reference. Nothing has been charged.","ok");f.reset()}
       else msg(esc(j.error||"Something went wrong. Please try again."),"err")},
     function(){btn.disabled=false;mailFallback(d,"We could not reach our server, so ")});
    return}
  mailFallback(d,"");
}
function mailFallback(d,pre){var body="I would like to join the Zero Cube movement. I am applying for membership.\n\nName: "+d.name+"\nEmail: "+d.email+"\nPhone: "+d.phone+"\nCountry: "+d.country+"\nTier: "+d.tier+"\nOrganisation: "+(d.org||"—")+"\nHow I would like to contribute: "+(d.contribute||"—")+"\n\nI agree that Zero Cube may store these details and contact me about joining. I understand this form is not a payment.";
  var href="mailto:"+TO+"?subject="+encodeURIComponent("Membership application — "+d.tier)+"&body="+encodeURIComponent(body);
  var tail="If it does not open, <a href=\""+esc(href)+"\">click here</a> or email <a href=\"mailto:"+TO+"\">"+TO+"</a>. Next: pay your fee (<a href=\""+ROOT+"membership.html#pay\">how to pay</a>) and send us the payment reference.";
  msg(pre?esc(pre)+"your email app should open with your details filled in — just press <b>Send</b>. "+tail:"Your email app should open with your details filled in — just press <b>Send</b> to apply. "+tail,"ok");
  try{window.location.href=href}catch(e){}
}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".wl-open");if(b){e.preventDefault();open(b.getAttribute("data-tier")||"",b)}
  var a=e.target.closest&&e.target.closest('a[href$="#waitlist"]');if(a&&/membership\.html#waitlist$/.test(a.getAttribute("href"))&&/membership\.html$/.test(location.pathname)){e.preventDefault();open("",a)}});
function fromHash(){if(location.hash==="#waitlist"&&(document.getElementById("tiers")||document.getElementById("wlInline")))open("")}
function initInline(){if(document.getElementById("wlInline")&&!dlg){build();var q=new URLSearchParams(location.search).get("tier");if(q){var sel=dlg.querySelector("#wlTier");for(var i=0;i<sel.options.length;i++)if(sel.options[i].text===q){sel.selectedIndex=i;break}}}}
window.addEventListener("hashchange",fromHash);
function boot(){initInline();fromHash()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
window.ZCWaitlist={open:open,close:close};
})();
