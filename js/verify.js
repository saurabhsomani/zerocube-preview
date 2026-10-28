/* Zero Cube — public pledge verifier for the Zero Cube Pledge Ledger. All checks run in the browser (js/ledger-client.js). */
(function(){
"use strict";
var X=window.ZC_CHAIN_DEMO, $=function(s){return document.querySelector(s)}, out=$("#vfOut");
var esc=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
function box(cls,icon,title,body){out.innerHTML='<div class="vf-res '+cls+'"><p class="vf-t"><span aria-hidden="true">'+icon+'</span> '+title+'</p>'+body+'</div>';out.scrollIntoView({behavior:"smooth",block:"nearest"})}
function links(r){return '<p class="row"><a class="btn btn-ghost sm" href="ledger.html#b='+r.block.number+'">See block #'+r.block.number+' in the ledger</a><a class="btn btn-ghost sm" href="'+esc(ZCLedger.base+ZCLedger.file(r.block.number))+'" download>Download block (.json)</a><a class="btn btn-ghost sm" href="'+esc(ZCLedger.base)+'public-key.pem" download>Zero Cube public key</a></p>'}
function allOk(r){return r.fpMatch&&r.inBlock&&r.merkleOk&&r.blockOk&&r.linksOk&&r.sigOk}
function fail(){box("bad","!","Could not load the ledger","<p>Please try again later.</p>")}
function checkId(id){id=String(id||"").trim();if(!id)return;$("#vid").value=id;out.innerHTML='<p class="pstatus">Checking…</p>';
  ZCLedger.prove(id).then(function(r){
    if(r.pending){box("wd","⏳","The ledger has no blocks yet","<p>The Zero Cube Pledge Ledger starts at launch (genesis pending). Pledges can be verified here from the morning after they are approved.</p>");return}
    if(!r.found){box("bad","✗","No pledge with ID “"+esc(id)+"”","<p>Check the ID on the certificate or in the email. Pledges are added to the ledger the night they are approved.</p>");return}
    if(r.withdrawn){box("wd","↩","Recorded, then withdrawn by the pledger","<p>This pledge was recorded in block #"+r.block.number+" ("+esc(r.block.date)+"). The withdrawal was recorded in block #"+r.withdrawnIn+". The person's data has been <b>erased</b>; the fingerprint stays but can no longer be linked to anyone.</p>"+ZCLedger.checklist(r,esc)+links(r));return}
    var ok=allOk(r);if(r.entry.kind==="certificate"){box(ok?"good":"bad",ok?"✓":"✗",ok?"Pledge Certificate "+esc(r.id)+" is genuine: its issuance is recorded in block #"+r.block.number:"Ledger check failed","<p>This Climate Duty Bearer Pledge Certificate was issued by Zero Cube and recorded on "+esc(r.block.date)+". It confirms that the person <b>took the pledge</b>, not achieved results or verified emission cuts. To confirm the certificate details are unchanged, upload its certificate record file (Option 2).</p>"+ZCLedger.checklist(r,esc)+links(r));return}
    box(ok?"good":"bad",ok?"✓":"✗",ok?"Pledge "+esc(id)+" is recorded in block #"+r.block.number+" of the Zero Cube Pledge Ledger":"Ledger check failed","<p>To confirm the pledge <b>content</b> is unchanged, upload its pledge record file (Option 2).</p>"+ZCLedger.checklist(r,esc)+links(r))},fail)}
function checkCert(rec,label){var fp=ZC_CHAIN.fingerprint(rec),head='<p class="mini">'+esc(label)+' · re-computed fingerprint: <code class="hash sm">'+esc(fp)+'</code></p>';
  ZCLedger.prove(rec.certNo,fp).then(function(r){if(r.pending){box("wd","⏳","The ledger has no blocks yet",head);return}if(!r.found){box("bad","✗","No issued certificate “"+esc(rec.certNo)+"”",head);return}
    if(allOk(r))box("good","✓","Genuine and unchanged certificate",head+'<p>Pledge Certificate <b>'+esc(rec.certNo)+'</b> for <b>'+esc(rec.name)+'</b> (pledge '+esc(rec.pledgeId)+', recorded in block #'+esc(rec.pledgeBlock)+'), issued '+esc(rec.issued)+'. It confirms the pledge was taken, not results.</p>'+ZCLedger.checklist(r,esc)+links(r));
    else box("bad","✗",r.fpMatch?"Ledger check failed":"Does not match — this file has been changed",head+ZCLedger.checklist(r,esc)+links(r))},fail)}
function checkRecord(rec,label){if(rec&&rec.kind==="commitment-certificate"&&rec.certNo&&rec.salt)return checkCert(rec,label);if(!rec||typeof rec!=="object"||!rec.id||!rec.salt){box("bad","✗","This is not a Zero Cube pledge record file","<p>Use the .json file from your confirmation email or My Pledge.</p>");return}
  var fp=ZC_CHAIN.fingerprint(rec),head='<p class="mini">'+esc(label)+' · re-computed fingerprint: <code class="hash sm">'+esc(fp)+'</code></p>';
  ZCLedger.prove(rec.id,fp).then(function(r){
    if(r.pending){box("wd","⏳","The ledger has no blocks yet",head+"<p>Genesis pending: verification opens after launch.</p>");return}
    if(!r.found){box("bad","✗","No recorded pledge for ID “"+esc(rec.id)+"”",head);return}
    if(r.withdrawn){box("wd","↩","This pledge was withdrawn",head+"<p>Its data has been erased by request (withdrawal recorded in block #"+r.withdrawnIn+").</p>");return}
    if(allOk(r))box("good","✓","Genuine and unchanged",head+'<p><b>'+esc(rec.name)+'</b>, '+esc([rec.city,rec.state].filter(Boolean).join(", "))+' — '+rec.ids.length+' habits, ≈'+fmtKg(rec.kg)+' CO₂e a year (indicative), '+rec.edu.students+' student(s). Pledged '+esc(rec.date)+', once, for life.</p>'+ZCLedger.checklist(r,esc)+links(r));
    else box("bad","✗",r.fpMatch?"Ledger check failed":"Does not match — this file has been changed",head+(r.fpMatch?'':'<p>The fingerprint of this file is different from the one recorded for pledge '+esc(rec.id)+' in block #'+r.block.number+'. Even one changed letter or number gives a completely different fingerprint.</p>')+ZCLedger.checklist(r,esc)+links(r))},fail)}
$("#vfId").addEventListener("submit",function(e){e.preventDefault();var id=$("#vid").value.trim();history.replaceState(null,"","?id="+encodeURIComponent(id));checkId(id)});
$("#vfile").addEventListener("change",function(){var f=this.files[0];if(!f)return;if(f.size>200000){box("bad","✗","File too large","<p>Pledge record files are small (under 10 KB).</p>");return}
  var r=new FileReader();r.onload=function(){var j;try{j=JSON.parse(r.result)}catch(e){j=null}checkRecord(j,f.name)};r.readAsText(f)});
if(window.ZC_PLEDGE_CONFIG&&ZC_PLEDGE_CONFIG.DEMO&&X)document.querySelectorAll(".demo-only-vf").forEach(function(x){x.hidden=false});
$("#trySample").addEventListener("click",function(){checkRecord(JSON.parse(JSON.stringify(X.sampleRecord)),"Sample file (SAMPLE pledge s06)")});
$("#tryTamper").addEventListener("click",function(){var r=JSON.parse(JSON.stringify(X.sampleRecord));r.kg=r.kg+1000;checkRecord(r,"Tampered sample (CO₂e changed by +1,000 kg)")});
var q=new URLSearchParams(location.search).get("id");if(q)checkId(q);
})();
