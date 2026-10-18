/* Zero Cube Pledge Ledger — browser client. Reads the openly published ledger (chain.json, blocks/NNNNNN.json, ids.json, public-key.json)
   and runs every check in the browser: Merkle proof, block hash, chain links back to the genesis block, and Zero Cube's digital signature. */
window.ZCLedger=(function(){
"use strict";
var C=window.ZC_PLEDGE_CONFIG||{}, BASE=C.LEDGER_URL||"ledger/", cache={};
function get(p){if(!cache[p])cache[p]=fetch(BASE+p,{cache:"no-store"}).then(function(r){if(!r.ok)throw new Error("Could not load "+p);return r.json()});return cache[p]}
function file(n){return "blocks/"+("00000"+n).slice(-6)+".json"}
function chain(){return get("chain.json")} function key(){return get("public-key.json")} function ids(){return get("ids.json")} function block(n){return get(file(n))}
/* whole-chain check */
function checkAll(){return chain().then(function(c0){
  /* SOFT LAUNCH: an empty ledger (genesis pending) has no blocks and no published key yet */
  if(!c0.headers||!c0.headers.length)return {chain:c0,key:{keyId:"not yet published"},linksOk:true,broken:null,sigs:[],sigOk:true,pending:true,demo:false};
  return Promise.all([chain(),key()]).then(function(a){var c=a[0],k=a[1],cc=ZC_CHAIN.checkChain(c.headers);
  var sigs=c.headers.map(function(h){return ZC_CHAIN.verifySignature(h.hash,h.signature,k)});
  return {chain:c,key:k,linksOk:cc.ok,broken:cc.broken,sigs:sigs,sigOk:sigs.every(function(x){return x===true}),demo:!!c.demo}})})}
/* prove one pledge: by id (fp from the ledger) or by a fingerprint re-computed from a record file */
function prove(id,fp){return chain().then(function(c0){if(!c0.headers||!c0.headers.length)return {found:false,id:id,pending:true};return ids().then(function(I){var e=I[id];if(!e&&I[String(id).toUpperCase()]){id=String(id).toUpperCase();e=I[id]}if(!e)return {found:false,id:id};
  return Promise.all([block(e.block),checkAll()]).then(function(a){var b=a[0],all=a[1],cb=ZC_CHAIN.checkBlock(b),leaf=fp||e.fp;
    var path=ZC_CHAIN.merkleProof(b.entries.map(function(x){return x.fp}),leaf),inBlock=b.entries.some(function(x){return x.id===id&&x.fp===leaf});
    var h=all.chain.headers[b.number];
    return {found:true,id:id,entry:e,block:b,leaf:leaf,ledgerFp:e.fp,fpMatch:leaf===e.fp,inBlock:inBlock,path:path,
      merkleOk:!!path&&ZC_CHAIN.applyProof(leaf,path)===b.merkleRoot&&cb.merkle,blockOk:cb.hash&&cb.entries&&!!h&&h.hash===b.hash,
      sigOk:ZC_CHAIN.verifySignature(b.hash,b.signature,all.key)===true,linksOk:all.linksOk,head:all.chain.head,withdrawn:e.withdrawnIn!=null,withdrawnIn:e.withdrawnIn,demo:!!b.demo,key:all.key}})})})}
function short(h){return h?h.slice(0,10)+"…"+h.slice(-6):"—"}
/* the checklist shown on verify.html and in My Pledge */
function checklist(r,esc){function li(ok,t,d){return '<li class="'+(ok?"ck-ok":"ck-bad")+'"><span aria-hidden="true">'+(ok?"✓":"✗")+'</span><div><b>'+t+'</b><small>'+d+'</small></div></li>'}
  return '<ul class="cklist">'+
  li(r.fpMatch&&r.inBlock,"Fingerprint is in block #"+r.block.number,"SHA-256 "+esc(short(r.leaf))+(r.fpMatch?"":" — does not match the fingerprint recorded for "+esc(r.id)))+
  li(r.merkleOk,"Merkle proof",(r.path&&r.path.length?"Re-computed "+r.path.length+" step(s) from the fingerprint up to the block's Merkle root ":(r.path?"Only fingerprint in this block, so it is the Merkle root ":"No proof possible: fingerprint not in this block. Merkle root "))+esc(short(r.block.merkleRoot)))+
  li(r.blockOk,"Block hash","Block #"+r.block.number+" ("+esc(r.block.date)+") hash "+esc(short(r.block.hash))+" re-computed")+
  li(r.linksOk,"Chain links","Every block from #0 (genesis) to #"+r.head+" points to the hash of the block before it")+
  li(r.sigOk,"Zero Cube digital signature","Block signed with key "+esc(r.key.keyId)+(r.demo?" (DEMO key)":"")+" — RSA-SHA256")+'</ul>'}
return {chain:chain,key:key,ids:ids,block:block,file:file,base:BASE,checkAll:checkAll,prove:prove,short:short,checklist:checklist};
})();
