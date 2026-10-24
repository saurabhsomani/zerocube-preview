/* Zero Cube — LAUNCH (24 Oct 2026): "Send us your payment details" form (.payform) and contact form (.contactform).
   Both open a pre-filled email to zerocubecif@gmail.com. Nothing is stored on the website; no card, UPI PIN or bank password is ever asked for.
   Bank / UPI / gateway details shown on the page come from build_parts/launch_config.py (PAY). */
(function(){
"use strict";
var C=window.ZC_PLEDGE_CONFIG||{}, TO=C.WAITLIST_EMAIL||"zerocubecif@gmail.com";
var esc=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var TIERS=["Student / Youth Member","Individual Supporter","Startup Supporter","MSME Member","Institution / School Member","Education Champion","Student Sponsor","Green School Partner","0³ Foundation Member","NPO Member — Verified Projects","Eco-Product Manufacturer Member","Certified Network Member","Expert / Volunteer Associate","Corporate Climate Partner — Supporter","Corporate Climate Partner — Partner","Corporate Climate Partner — Champion","Lifetime Supporter","Patron / Founding Circle"];
var uid=0;
function row(id,label,input){return '<div class="frow"><label for="'+id+'">'+label+'</label>'+input+'</div>'}
function payForm(box){
  var k=box.getAttribute("data-kind")||"membership", don=k==="donation", p="pf"+(++uid);
  var f=document.createElement("form"); f.className="pform"; f.noValidate=true;
  f.innerHTML='<span class="eyebrow">'+(don?"Donation details":"Membership payment details")+'</span><h3>Send us your payment details</h3>'+
  '<p class="mini">After you pay, this opens a pre-filled email to us so we can match your payment and send your receipt. Never share card numbers, UPI PINs or passwords.</p>'+
  row(p+"n","Full name (as on the receipt) *",'<input id="'+p+'n" name="name" required maxlength="80" autocomplete="name">')+
  row(p+"e","Email *",'<input id="'+p+'e" name="email" type="email" required maxlength="120" autocomplete="email">')+
  (don?row(p+"pu","Purpose",'<select id="'+p+'pu" name="purpose"><option>Where most needed</option><option>Free learning for all</option><option>Quality and equal education</option><option>NetZero villages</option></select>')
      :row(p+"t","Way of belonging (tier) *",'<select id="'+p+'t" name="tier" required><option value="">Choose…</option>'+TIERS.map(function(t){return "<option>"+esc(t)+"</option>"}).join("")+'</select>'))+
  row(p+"a","Amount paid (₹) *",'<input id="'+p+'a" name="amount" required inputmode="decimal" maxlength="12" placeholder="e.g. 2500">')+
  row(p+"d","Date of payment *",'<input id="'+p+'d" name="date" type="date" required>')+
  row(p+"m","Paid by *",'<select id="'+p+'m" name="mode" required><option value="">Choose…</option><option>Bank transfer (NEFT / RTGS / IMPS)</option><option>UPI</option><option>Online payment</option></select>')+
  row(p+"r","Transaction reference (UTR / UPI ref.) *",'<input id="'+p+'r" name="ref" required maxlength="40">')+
  row(p+"ad","Postal address (for the receipt) *",'<textarea id="'+p+'ad" name="addr" rows="2" required maxlength="300" autocomplete="street-address"></textarea>')+
  row(p+"pan","PAN <small>(optional; needed for 80G reporting once approved)</small>",'<input id="'+p+'pan" name="pan" maxlength="10" autocapitalize="characters" pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]">')+
  (don?'<label class="chk"><input type="checkbox" name="indian" required><span>I confirm that I am an Indian citizen (or an Indian organisation) and that this donation is from my own funds in an Indian bank account, not from any foreign source.</span></label>':'')+
  '<label class="chk"><input type="checkbox" name="consent" required><span>I agree that Zero Cube may store these details to issue my receipt and keep the records the law requires.</span></label>'+
  '<p class="row"><button class="btn btn-donate" type="submit">Email my payment details</button></p><div class="pstatus" role="status" aria-live="polite"></div>';
  box.insertBefore(f,box.firstChild);
  f.addEventListener("submit",function(e){e.preventDefault();var st=f.querySelector(".pstatus");
    function err(m,el){st.className="pstatus err";st.textContent=m;if(el)el.focus()}
    var v=function(n){return (f[n]&&f[n].value||"").trim()};
    if(!v("name"))return err("Please enter your name.",f.name);
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email")))return err("Please enter a valid email address.",f.email);
    if(!don&&!v("tier"))return err("Please choose your way of belonging.",f.tier);
    if(!/^\d+(\.\d{1,2})?$/.test(v("amount").replace(/,/g,"")))return err("Please enter the amount in rupees, numbers only.",f.amount);
    if(!v("date"))return err("Please enter the date of payment.",f.date);
    if(!v("mode"))return err("Please choose how you paid.",f.mode);
    if(!v("ref"))return err("Please enter the transaction reference.",f.ref);
    if(!v("addr"))return err("Please enter your postal address for the receipt.",f.addr);
    if(v("pan")&&!/^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/.test(v("pan")))return err("That PAN does not look right (e.g. ABCDE1234F). Leave it blank if unsure.",f.pan);
    if(don&&!f.indian.checked)return err("Donations are accepted only from Indian donors. Please tick the confirmation, or join as a member instead.",f.indian);
    if(!f.consent.checked)return err("Please tick the consent box.",f.consent);
    var subj=(don?"Donation details — ":"Membership payment — ")+v("name")+" — ₹"+v("amount");
    var body=(don?"Donation details for my receipt.\nPurpose: "+v("purpose"):"Membership payment details for my receipt.\nTier: "+v("tier"))+
      "\n\nName: "+v("name")+"\nEmail: "+v("email")+"\nAmount (INR): "+v("amount")+"\nDate: "+v("date")+"\nPaid by: "+v("mode")+"\nTransaction reference: "+v("ref")+"\nAddress: "+v("addr")+"\nPAN: "+(v("pan").toUpperCase()||"—")+
      (don?"\n\nI confirm that I am an Indian citizen (or an Indian organisation) and that this donation is from my own funds in an Indian bank account, not from any foreign source.":"")+
      "\n\nI agree that Zero Cube may store these details to issue my receipt and keep the records the law requires.";
    var href="mailto:"+TO+"?subject="+encodeURIComponent(subj)+"&body="+encodeURIComponent(body);
    st.className="pstatus ok";st.innerHTML="Your email app should open with your details filled in — just press <b>Send</b>. If it does not open, <a href=\""+esc(href)+"\">click here</a> or email <a href=\"mailto:"+TO+"\">"+TO+"</a>.";
    try{window.location.href=href}catch(x){}
  });
}
function contactForm(box){
  var f=document.createElement("form"); f.className="pform"; f.noValidate=true;
  f.innerHTML='<h3>Message us</h3>'+row("cfN","Your name *",'<input id="cfN" name="name" required maxlength="80" autocomplete="name">')+
  row("cfE","Email *",'<input id="cfE" name="email" type="email" required maxlength="120" autocomplete="email">')+
  row("cfC","Country",'<input id="cfC" name="country" maxlength="60" autocomplete="country-name">')+
  row("cfT","Topic *",'<select id="cfT" name="topic" required><option value="">Choose…</option><option>Membership</option><option>Donation or receipt</option><option>Payment or refund</option><option>Net Zero certification / Scope 3</option><option>SROI</option><option>Quality education / schools</option><option>CSR partnership</option><option>Volunteering</option><option>Media</option><option>Grievance</option><option>Something else</option></select>')+
  row("cfM","Message *",'<textarea id="cfM" name="msg" rows="5" required maxlength="2000"></textarea>')+
  '<p class="row"><button class="btn btn-donate" type="submit">Write the email</button></p><div class="pstatus" role="status" aria-live="polite"></div>';
  box.insertBefore(f,box.firstChild);
  f.addEventListener("submit",function(e){e.preventDefault();var st=f.querySelector(".pstatus");var v=function(n){return (f[n].value||"").trim()};
    function err(m,el){st.className="pstatus err";st.textContent=m;el.focus()}
    if(!v("name"))return err("Please enter your name.",f.name);
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email")))return err("Please enter a valid email address.",f.email);
    if(!v("topic"))return err("Please choose a topic.",f.topic);
    if(!v("msg"))return err("Please write your message.",f.msg);
    var href="mailto:"+TO+"?subject="+encodeURIComponent(v("topic")+" — "+v("name"))+"&body="+encodeURIComponent(v("msg")+"\n\nName: "+v("name")+"\nEmail: "+v("email")+"\nCountry: "+(v("country")||"—"));
    st.className="pstatus ok";st.innerHTML="Your email app should open with your message filled in — just press <b>Send</b>. If it does not open, <a href=\""+esc(href)+"\">click here</a> or email <a href=\"mailto:"+TO+"\">"+TO+"</a>.";
    try{window.location.href=href}catch(x){}
  });
}
function boot(){[].forEach.call(document.querySelectorAll(".payform"),payForm);[].forEach.call(document.querySelectorAll(".contactform"),contactForm)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();
