/* Zero Cube — Take the Pledge: builder, share cards, pledge letter, submission. No external libraries. */
(function(){
"use strict";
var C=window.ZC_PLEDGE_CONFIG, O=window.PLEDGE_OPTIONS, $=function(s){return document.querySelector(s)};
var FOREST="#0F3D2E", NAVY="#0B2A3C", GOLD="#D9A63A", MINT="#E6F2EB";
var photoData=null, logoImg=new Image(); logoImg.src="assets/img/logo.png";
var esc=function(s){return String(s||"").replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var plain=function(s){var d=document.createElement("div");d.innerHTML=s;return d.textContent};

/* ---------- build option checkboxes (each habit has its own small inputs) ---------- */
var K=window.ZC_CALC, H=K.H, OUT=window.pledgeOutcome;
function inHTML(id,i){var nm="in_"+id+"_"+i.k;
  if(i.type==="select")return '<label class="pin pin-sel"><span>'+i.l+'</span><select id="'+nm+'" data-h="'+id+'" data-k="'+i.k+'">'+i.opts.map(function(o){return '<option value="'+o.v+'"'+(o.v===i.def?" selected":"")+'>'+o.l+'</option>'}).join("")+'</select></label>';
  return '<label class="pin"><span>'+i.l+'</span><span class="pin-f"><input id="'+nm+'" type="number" inputmode="decimal" data-h="'+id+'" data-k="'+i.k+'" value="'+i.def+'" min="'+i.min+'" max="'+i.max+'" step="'+(i.step||1)+'"><i>'+(i.u||"")+'</i></span></label>'}
function srcLinks(h){var seen={},out=[];(h.fs||[]).forEach(function(f){var s=K.D.factors[f]&&K.D.factors[f].src;if(s&&!seen[s]){seen[s]=1;var x=PLEDGE_SOURCES[s];out.push('<a href="'+x[1]+'" rel="noopener" target="_blank" title="'+esc(x[0])+'">source</a>')}});return out.join(" · ")}
function optHTML(o){var h=H[o.id];
  return '<div class="popt" data-id="'+o.id+'"><label class="popt-l"><input type="checkbox" name="p" value="'+o.id+'" aria-controls="pi_'+o.id+'"><span class="pbox"><b>'+o.t+'</b><span class="pout" id="po_'+o.id+'" aria-live="polite"></span></span></label>'+
   '<div class="pins" id="pi_'+o.id+'" hidden>'+h.inputs.map(function(i){return inHTML(o.id,i)}).join("")+(h.fam?'<p class="pin-note">Uses “people in my home” above.</p>':'')+
   '<p class="pin-note">'+(h.nonco2?'Tangible outcome, not CO₂e. ':'<i class="ind">indicative estimate</i> · ')+'<a href="pledge-methodology.html#h-'+o.id+'">how we calculate</a>'+(srcLinks(h)?' · '+srcLinks(h):'')+'</p></div></div>';
}
function groups(g){var cats=[];O.forEach(function(o){if(o.g===g&&cats.indexOf(o.cat)<0)cats.push(o.cat)});
  return cats.map(function(c){return '<h4 class="pgrp">'+c+'</h4><div class="popts">'+O.filter(function(o){return o.g===g&&o.cat===c}).map(optHTML).join("")+'</div>'}).join("")}
["#optFoot","#optHand"].forEach(function(sel,i){var el=$(sel);el.classList.remove("popts");el.innerHTML=groups(i?"hand":"foot")});

$("#pstate").innerHTML+=INDIA_STATES.map(function(x){return "<option>"+x+"</option>"}).join("");
$("#ptype").innerHTML+=PLEDGER_TYPES.map(function(x){return "<option>"+x+"</option>"}).join("");
function chosen(){return Array.prototype.map.call(document.querySelectorAll('input[name=p]:checked'),function(i){return i.value})}
function inputs(ids){var o={};ids.forEach(function(id){o[id]={};document.querySelectorAll('[data-h="'+id+'"]').forEach(function(e){o[id][e.dataset.k]=e.tagName==="SELECT"?e.value:e.value})});return o}
function intv(sel){var v=parseInt(($(sel)||{}).value,10);return isNaN(v)?0:v}
function data(){
  var ids=chosen();
  return {name:$("#pname").value.trim().slice(0,60), city:$("#pcity").value.trim().slice(0,40), state:$("#pstate").value, type:$("#ptype").value, email:$("#pemail").value.trim().slice(0,120),
    phone:$("#pphone").value.trim().slice(0,20), minor:$("#ageMinor").checked, guardian:$("#gname").value.trim().slice(0,60), words:$("#pwords").value.trim().slice(0,300),
    ids:ids, inputs:inputs(ids), fam:intv("#pfam")||4, edu:{students:intv("#eStudents"),hours:intv("#eHours"),amount:intv("#eAmount")}, date:new Date().toISOString().slice(0,10)};
}
function calcD(d){return K.calc(d)}
var lastMode="";
function eduUI(d){var mode=K.eduMode(d.type,d.minor),E=K.EDU[mode];
  if(mode!==lastMode){lastMode=mode;$("#eduTeach").hidden=mode!=="teach";$("#eduFund").hidden=mode!=="fund";$("#eduPresets").hidden=mode!=="fund";$("#eduNote").hidden=mode!=="fund";
    ["#eHours","#eAmount"].forEach(function(s){$(s).disabled=false});$("#eHours").disabled=mode!=="teach";$("#eAmount").disabled=mode!=="fund";
    $("#eduWho").innerHTML=mode==="teach"?(d.minor?'<b>Under 18:</b> your education pledge is to <b>teach or tutor</b> — for example, help a younger child read or do maths. No money is asked of under-18s.':'<b>As an educator</b>, you pledge the students you will find and <b>personally teach or mentor</b>, and the hours you will give.'):'<b>Not an educator?</b> You pledge <b>financial support</b> for students’ education — given <b>directly</b> to the student or school, or through a project on our <a href="verified-projects.html">Verified Projects</a> listing.';}
  return mode}
function update(){
  var d=data(), c=calcD(d), mode=eduUI(d);
  O.forEach(function(o){var on=d.ids.indexOf(o.id)>-1,box=$("#pi_"+o.id),po=$("#po_"+o.id);box.hidden=!on;
    po.innerHTML=on&&c.per[o.id]?('<em class="kg">'+OUT(o.id,c.per[o.id])+'</em>'):'<span class="pdim">Tick to see your outcome</span>';
    po.closest(".popt").classList.toggle("on",on)});
  var e=c.edu;
  $("#sumN").textContent=d.ids.length; $("#sumKg").textContent=fmtKg(c.kg); $("#sumSt").textContent=e.students;
  $("#sumEdu").textContent=mode==="teach"?e.hoursYear.toLocaleString("en-IN"):fmtRs(e.rupeesYear); $("#sumEduL").textContent=mode==="teach"?"learning hours a year":"a year for students · given directly";
  $("#sumL").textContent=c.litres.toLocaleString("en-IN");
  $("#eduOut").innerHTML=d.edu.students<1?'<span class="err-t">Please pledge at least 1 student — the education pledge is part of every Climate Duty Bearer’s pledge.</span>':
    (mode==="teach"?'<b>Your outcome:</b> '+e.students+' student'+(e.students>1?'s':'')+' reached · <b>'+e.hoursYear.toLocaleString("en-IN")+' learning hours a year</b> ('+e.hours+' h a month × 12).':
     '<b>Your outcome:</b> '+e.students+' student'+(e.students>1?'s':'')+' supported · <b>'+fmtRs(e.rupeesYear)+' a year</b> ('+e.students+' × '+fmtRs(e.amount)+').');
  $("#mult").textContent=c.kg?('If 1,000 people take the same pledge: ≈'+fmtKg(c.kg*1000)+' CO₂e a year (indicative).'):'Tick a habit to see how it multiplies when many people take it.';
  var minor=d.minor; $("#guardianBox").hidden=!minor; $("#cPhoto").disabled=minor; if(minor){$("#cPhoto").checked=false}
  $("#minorPhotoNote").hidden=!minor;
}
document.querySelectorAll(".epreset").forEach(function(b){b.addEventListener("click",function(){$("#eAmount").value=b.dataset.v;document.querySelectorAll(".epreset").forEach(function(x){x.setAttribute("aria-pressed",x===b)});update()})});
document.addEventListener("input",update); document.addEventListener("change",update); update();

/* ---------- photo (stays in the browser unless photo consent is given and you submit) ---------- */
$("#pphoto").addEventListener("change",function(e){
  var f=e.target.files[0]; if(!f){photoData=null;return}
  if(!/^image\//.test(f.type)){status("Please choose an image file.","err");return}
  var r=new FileReader(); r.onload=function(){var im=new Image(); im.onload=function(){
    var m=C.MAX_PHOTO_PX||600, s=Math.min(1,m/Math.max(im.width,im.height)), c=document.createElement("canvas");
    c.width=Math.round(im.width*s); c.height=Math.round(im.height*s); c.getContext("2d").drawImage(im,0,0,c.width,c.height);
    photoData=new Image(); photoData.src=c.toDataURL("image/jpeg",0.82); photoData.dataURL=photoData.src; $("#photoPrev").src=photoData.src; $("#photoPrev").hidden=false;
  }; im.src=r.result}; r.readAsDataURL(f);
});
$("#photoClear").addEventListener("click",function(){photoData=null;$("#pphoto").value="";$("#photoPrev").hidden=true});

function status(msg,cls){var s=$("#pstatus");s.className="pstatus "+(cls||"");s.innerHTML=msg}

/* ---------- documents (drawn by js/pledge-docs.js) ---------- */
function drawCard(cv,story){ZCDocs.card(cv,story,data(),photoData)}
function drawLetter(cv){ZCDocs.letter(cv,data())}
function letterHTML(){return ZCDocs.letterHTML(data())}
/* ---------- make ---------- */
function ready(){return ZCDocs.ready()}
function validMake(){var d=data();if(!d.name){status("Please enter your name.","err");$("#pname").focus();return false}
  if(!d.ids.length){status("Please tick at least one daily habit.","err");return false}
  if(d.edu.students<1){status("Please pledge at least 1 student in the Quality education section.","err");$("#eStudents").focus();return false}
  if(!$("#cLife").checked){status("Please confirm the lifelong pledge statement.","err");$("#cLife").focus();return false}
  if(!$("#cResp").checked){status("Please confirm the responsibility statement.","err");$("#cResp").focus();return false}
  if(d.minor&&(!d.guardian||!$("#cGuard").checked)){status("Under 18: please add your parent/guardian's name and their consent.","err");return false}return true}
$("#btnMake").addEventListener("click",function(){ if(!validMake())return; ready().then(function(){
  drawCard($("#cardSq"),false);drawCard($("#cardStory"),true);$("#letterDoc").innerHTML=letterHTML();drawLetter($("#letterCv"));
  $("#pout").hidden=false;$("#pout").scrollIntoView({behavior:"smooth"});status("Your pledge card and letter are ready below. Download or share them.","ok");}) });

function dl(cv,name){var a=document.createElement("a");a.download=name;a.href=cv.toDataURL("image/png");document.body.appendChild(a);a.click();a.remove()}
var slug=function(){return (data().name||"pledge").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")};
$("#dlSq").addEventListener("click",function(){dl($("#cardSq"),"zerocube-pledge-"+slug()+"-square.png")});
$("#dlStory").addEventListener("click",function(){dl($("#cardStory"),"zerocube-pledge-"+slug()+"-story.png")});
$("#dlLetter").addEventListener("click",function(){dl($("#letterCv"),"zerocube-pledge-letter-"+slug()+".png")});
$("#printLetter").addEventListener("click",function(){document.body.classList.add("print-letter");window.print();setTimeout(function(){document.body.classList.remove("print-letter")},500)});

/* ---------- share ---------- */
var shareURL=C.SITE_URL+C.PLEDGE_PATH, shareText=function(){var c=calcD(data());return "I am a Climate Duty Bearer — climate action is no longer optional, it is our duty. I took the Zero Cube Pledge for life"+(c.kg?": about "+fmtKg(c.kg)+" CO₂e a year less (indicative)":"")+" and "+c.edu.students+" student"+(c.edu.students>1?"s":"")+" supported every year. Take yours: "};
$("#shWa").addEventListener("click",function(){window.open("https://wa.me/?text="+encodeURIComponent(shareText()+shareURL+" #"+C.HASHTAG),"_blank","noopener")});
$("#shLi").addEventListener("click",function(){window.open("https://www.linkedin.com/sharing/share-offsite/?url="+encodeURIComponent(shareURL),"_blank","noopener")});
$("#shX").addEventListener("click",function(){window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent(shareText())+"&url="+encodeURIComponent(shareURL)+"&hashtags="+C.HASHTAG,"_blank","noopener")});
$("#shFb").addEventListener("click",function(){window.open("https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(shareURL),"_blank","noopener")});
$("#shNative").addEventListener("click",function(){
  $("#cardSq").toBlob(function(b){var f=new File([b],"zerocube-pledge.png",{type:"image/png"});
    if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:"Zero Cube Pledge",text:shareText()+shareURL}).catch(function(){});
    else if(navigator.share)navigator.share({title:"Zero Cube Pledge",text:shareText(),url:shareURL}).catch(function(){});
    else status("Your browser cannot share directly — download the card and use the buttons below.","err");});
});

/* ---------- submit to the Wall of Honour (demo mode when no ENDPOINT) ---------- */
$("#btnSubmit").addEventListener("click",function(){
  if(!validMake())return; var d=data();
  if(!$("#cDir").checked){status("To appear on the Wall of Honour, please tick the public-display consent.","err");$("#cDir").focus();return}
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)){status("Please enter a valid email (kept private; used only to confirm or withdraw your pledge).","err");$("#pemail").focus();return}
  if($("#hp").value){status("Thank you.","ok");return} // honeypot
  if(d.phone&&d.phone.replace(/\D/g,"").length<10){status("Please check your phone number (10 digits), or leave it empty.","err");$("#pphone").focus();return}
  var c=calcD(d);
  var payload={name:d.name,city:d.city,state:d.state,type:d.type,email:d.email,phone:d.phone,minor:d.minor,guardian:d.minor?d.guardian:"",guardianConsent:d.minor?$("#cGuard").checked:false,
    words:d.words,ids:d.ids,inputs:K.cleanInputs(d.ids,d.inputs),fam:d.fam,edu:{students:c.edu.students,hours:c.edu.hours||0,amount:c.edu.amount||0},kg:c.kg,lifelong:true,consentDirectory:true,consentPhoto:!d.minor&&$("#cPhoto").checked,
    photo:(!d.minor&&$("#cPhoto").checked&&photoData)?photoData.dataURL:"",date:d.date,termsVersion:"draft-2026-10b"};
  if(!C.ENDPOINT){status(C.DEMO?"<b>Demo mode:</b> nothing was sent or saved. The pledge database is not connected yet. Your card and letter still work — download and share them. (When live, one pledge per person: a second pledge with the same email or phone is refused.)":"<b>Almost there:</b> our pledge register opens in a few days, so your pledge was not saved yet. Your card and letter still work — download and share them, and please come back to add your name to the Wall of Honour.","demo");return}
  status("Sending…","");$("#btnSubmit").disabled=true;
  fetch(C.ENDPOINT,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)})
   .then(function(r){return r.json()}).then(function(j){
     if(j.ok)status("Thank you! Your lifelong pledge is received. You will appear as a Climate Duty Bearer on the <a href=\""+C.DIRECTORY_PATH+"\">Wall of Honour</a> after a quick review.","ok");
     else if(j.duplicate)status("<b>You have already taken the pledge.</b> It is a one-time, lifelong pledge — thank you! "+(j.id?'<a href="'+C.DIRECTORY_PATH+'#p='+encodeURIComponent(j.id)+'">See your Climate Duty Bearer profile</a>.':'Your pledge is waiting for a quick review and will appear on the <a href="'+C.DIRECTORY_PATH+'">Wall of Honour</a> soon.')+' To change it, email us from the same address.',"ok");
     else status("Sorry — "+esc(j.error||"something went wrong")+".","err") })
   .catch(function(){status("Sorry — we could not reach the pledge server. Please try again later.","err")})
   .finally(function(){$("#btnSubmit").disabled=false});
});
})();
