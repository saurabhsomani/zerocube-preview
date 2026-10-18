/* Zero Cube Pledge Ledger — simple block explorer. Lists every block (newest first) and re-checks the whole chain in the browser. */
(function(){
"use strict";
var $=function(s){return document.querySelector(s)};
var esc=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var S=ZCLedger.short, all=null;
function pendingView(){$("#lgSum").innerHTML='<div><b>0</b><span>blocks yet</span></div><div><b>0</b><span>fingerprints</span></div><div><b>Genesis pending</b><span>first block after launch</span></div>';
  var w=document.querySelector(".lg-wrap");if(w){w.hidden=true;w.insertAdjacentHTML("afterend",'<div class="note lg-pending"><b>Genesis pending — the first block is added after launch.</b> The ledger starts the night the first pledges are approved. Zero Cube\'s public signing key is published with the genesis block.</div>')}}
function sumBar(a){var n=a.chain.headers.length,p=a.chain.headers.reduce(function(s,h){return s+h.count},0),w=a.chain.headers.reduce(function(s,h){return s+(h.withdrawals||[]).length},0);
  $("#lgSum").innerHTML='<div><b>'+n+'</b><span>blocks (incl. genesis)</span></div><div><b>'+p+'</b><span>fingerprints (pledges and certificates)</span></div><div><b>'+w+'</b><span>withdrawals recorded</span></div><div><b class="'+(a.linksOk?"okc":"errc")+'">'+(a.linksOk?"✓ Intact":"✗ Broken at #"+a.broken)+'</b><span>chain links</span></div><div><b class="'+(a.sigOk?"okc":"errc")+'">'+(a.sigOk?"✓ Valid":"✗ Invalid")+'</b><span>signatures ('+esc(a.key.keyId)+')</span></div>'}
function row(h,i){var sig=all.sigs[i];return '<tr id="b'+h.number+'"><td><button class="lgb" type="button" data-n="'+h.number+'" aria-expanded="false">#'+h.number+'</button></td><td>'+esc(h.date)+'<small>'+esc(h.timestamp.slice(11,16))+' IST</small></td><td>'+h.count+((h.withdrawals||[]).length?'<small>+'+h.withdrawals.length+' withdrawal</small>':'')+'</td>'+
  '<td><code class="hash sm" title="'+esc(h.merkleRoot)+'">'+esc(S(h.merkleRoot))+'</code></td><td><code class="hash sm" title="'+esc(h.prev)+'">'+esc(S(h.prev))+'</code></td><td><code class="hash sm" title="'+esc(h.hash)+'">'+esc(S(h.hash))+'</code></td><td class="'+(sig?"okc":"errc")+'">'+(sig?"✓":"✗")+'</td></tr>'}
function detail(n){var tr=$("#b"+n),btn=tr.querySelector(".lgb"),nx=tr.nextElementSibling;
  if(nx&&nx.classList.contains("lgd")){nx.remove();btn.setAttribute("aria-expanded","false");return}
  ZCLedger.block(n).then(function(b){var cb=ZC_CHAIN.checkBlock(b),d=document.createElement("tr");d.className="lgd";
    d.innerHTML='<td colspan="7"><p><b>Block #'+b.number+'</b> · '+(b.number===0?'Genesis block (start of the ledger)':esc(b.count)+' fingerprint(s)')+' · Merkle root '+(cb.merkle?'<span class="okc">✓ re-computed</span>':'<span class="errc">✗</span>')+' · block hash '+(cb.hash&&cb.entries?'<span class="okc">✓ re-computed</span>':'<span class="errc">✗</span>')+'</p>'+
    (b.entries.length?'<table class="lgin"><thead><tr><th scope="col">ID</th><th scope="col">Type</th><th scope="col">Fingerprint (salted SHA-256)</th><th scope="col"></th></tr></thead><tbody>'+b.entries.map(function(e){return '<tr><td>'+esc(e.id)+'</td><td>'+(e.kind==='certificate'?'Commitment Certificate':'Pledge')+'</td><td><code class="hash sm">'+esc(e.fp)+'</code></td><td><a href="verify.html?id='+encodeURIComponent(e.id)+'">Verify</a></td></tr>'}).join("")+'</tbody></table>':'')+
    ((b.withdrawals||[]).length?'<p>Withdrawals recorded in this block: '+b.withdrawals.map(esc).join(", ")+' (data erased; earlier fingerprints stay).</p>':'')+
    '<p class="mini">Previous block hash <code class="hash sm">'+esc(b.prev)+'</code><br>This block hash <code class="hash sm">'+esc(b.hash)+'</code><br><a href="'+esc(ZCLedger.base+ZCLedger.file(b.number))+'" download>Download block #'+b.number+' (.json)</a></p></td>';
    tr.after(d);btn.setAttribute("aria-expanded","true")})}
function load(){$("#lgBody").innerHTML='<tr><td colspan="7">Loading and checking the ledger…</td></tr>';
  ZCLedger.checkAll().then(function(a){all=a;if(a.pending){pendingView();return}var ks=document.querySelector(".lg-keyslot");if(ks)ks.outerHTML='<a class="btn btn-ghost" href="'+ZCLedger.base+'public-key.pem" download>Zero Cube public key</a>';sumBar(a);var hs=a.chain.headers.map(function(h,i){return [h,i]}).reverse();
    $("#lgBody").innerHTML=hs.map(function(x){return row(x[0],x[1])}).join("");
    var m=location.hash.match(/b=(\d+)/);if(m&&$("#b"+m[1])){detail(+m[1]);$("#b"+m[1]).scrollIntoView({block:"center"})}
  },function(){$("#lgBody").innerHTML='<tr><td colspan="7">Could not load the ledger.</td></tr>'})}
$("#lgBody").addEventListener("click",function(e){var b=e.target.closest(".lgb");if(b)detail(+b.dataset.n)});
$("#lgCheck").addEventListener("click",function(){ZCLedger.checkAll().then(function(a){all=a;if(a.pending){$("#lgMsg").innerHTML="Nothing to check yet: the ledger has no blocks (genesis pending).";return}sumBar(a);$("#lgMsg").innerHTML=a.linksOk&&a.sigOk?'<span class="okc">✓ Re-checked just now in your browser: all '+a.chain.headers.length+' block hashes, chain links and signatures are valid.</span>':'<span class="errc">✗ The chain or a signature failed the check.</span>'})});
load();
})();
