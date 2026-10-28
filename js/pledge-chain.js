/* Zero Cube Pledge Ledger — a permissioned, append-only blockchain run by Zero Cube.
   Shared by the website (verify.html, ledger.html, my-pledge.html) and the Apps Script backend (copied into Chain_Auth_Mail.gs by build_v3.py).
   Each block: block number, date, timestamp, previous block's hash, Merkle root of the pledge fingerprints, and a Zero Cube digital signature (RSA-SHA256).
   ONLY salted SHA-256 fingerprints and pledge IDs are recorded — never personal data. Everything here runs in plain JavaScript (no external services). */
var ZC_CHAIN = (function(){
var CHAIN_NAME = "zerocube-pledge-ledger", ZERO = "0000000000000000000000000000000000000000000000000000000000000000";
/* ---------- canonical JSON: keys sorted, no spaces (same in browsers, Apps Script and Python json.dumps(sort_keys=True, separators=(',',':'), ensure_ascii=False)) ---------- */
function canon(v){
  if (v === null || v === undefined) return "null";
  if (Array.isArray(v)) return "[" + v.map(canon).join(",") + "]";
  if (typeof v === "object") return "{" + Object.keys(v).sort().filter(function(k){return v[k] !== undefined}).map(function(k){return JSON.stringify(k) + ":" + canon(v[k])}).join(",") + "}";
  if (typeof v === "number" && !isFinite(v)) return "null";
  return JSON.stringify(v);
}
/* ---------- SHA-256 (FIPS 180-4) of a UTF-8 string -> 64 hex chars. Pure JavaScript, synchronous. ---------- */
var K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
function utf8(s){ var o = [], i, c; for (i = 0; i < s.length; i++){ c = s.charCodeAt(i);
  if (c >= 0xd800 && c < 0xdc00 && i + 1 < s.length){ var d = s.charCodeAt(i + 1); if (d >= 0xdc00 && d < 0xe000){ c = 0x10000 + ((c - 0xd800) << 10) + (d - 0xdc00); i++; } }
  if (c < 0x80) o.push(c); else if (c < 0x800) o.push(0xc0 | c >> 6, 0x80 | c & 63); else if (c < 0x10000) o.push(0xe0 | c >> 12, 0x80 | c >> 6 & 63, 0x80 | c & 63); else o.push(0xf0 | c >> 18, 0x80 | c >> 12 & 63, 0x80 | c >> 6 & 63, 0x80 | c & 63); }
  return o; }
function sha256(str){
  var m = utf8(String(str)), l = m.length * 8, H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19], W = new Array(64), i, j, t;
  m.push(0x80); while (m.length % 64 !== 56) m.push(0);
  for (i = 7; i >= 0; i--) m.push(i > 3 ? 0 : (l >>> (i * 8)) & 255);
  for (i = 0; i < m.length; i += 64){
    for (j = 0; j < 16; j++) W[j] = (m[i+4*j] << 24) | (m[i+4*j+1] << 16) | (m[i+4*j+2] << 8) | m[i+4*j+3];
    for (j = 16; j < 64; j++){ var a = W[j-15], b = W[j-2];
      W[j] = (W[j-16] + ((a >>> 7 | a << 25) ^ (a >>> 18 | a << 14) ^ (a >>> 3)) + W[j-7] + ((b >>> 17 | b << 15) ^ (b >>> 19 | b << 13) ^ (b >>> 10))) | 0; }
    var A = H[0], B = H[1], C = H[2], D = H[3], E = H[4], F = H[5], G = H[6], Hh = H[7];
    for (j = 0; j < 64; j++){
      var t1 = (Hh + ((E >>> 6 | E << 26) ^ (E >>> 11 | E << 21) ^ (E >>> 25 | E << 7)) + ((E & F) ^ (~E & G)) + K[j] + W[j]) | 0;
      var t2 = (((A >>> 2 | A << 30) ^ (A >>> 13 | A << 19) ^ (A >>> 22 | A << 10)) + ((A & B) ^ (A & C) ^ (B & C))) | 0;
      Hh = G; G = F; F = E; E = (D + t1) | 0; D = C; C = B; B = A; A = (t1 + t2) | 0; }
    H[0] = (H[0] + A) | 0; H[1] = (H[1] + B) | 0; H[2] = (H[2] + C) | 0; H[3] = (H[3] + D) | 0; H[4] = (H[4] + E) | 0; H[5] = (H[5] + F) | 0; H[6] = (H[6] + G) | 0; H[7] = (H[7] + Hh) | 0; }
  return H.map(function(x){ return ("00000000" + (x >>> 0).toString(16)).slice(-8); }).join("");
}
/* ---------- the pledge record that is fingerprinted at approval (salt = 64 hex chars) ---------- */
function record(p, salt, meta){
  var c = ZC_CALC.calc(p), ids = (p.ids || []).slice().sort(); meta = meta || {};
  return {v:1, id:String(p.id), name:String(p.name||""), city:String(p.city||""), state:String(p.state||""), type:String(p.type||""), minor:!!p.minor,
    words:String(p.words||""), ids:ids, inputs:ZC_CALC.cleanInputs(ids, p.inputs), fam:c.fam,
    edu:{mode:c.edu.mode, students:c.edu.students, hours:c.edu.hours||0, amount:c.edu.amount||0},
    kg:c.kg, rupeesYear:c.edu.rupeesYear, hoursYear:c.edu.hoursYear, litres:c.litres,
    date:String(p.date||""), method:meta.method || ZC_CALC.D.version, terms:meta.terms || "draft-2026-10d", salt:String(salt)};
}
function fingerprint(rec){ return sha256(canon(rec)); }
/* Pledge Certificate record (confirms the PLEDGE only). Its own fingerprint is recorded in the ledger as an entry {id: certNo, fp, kind: "certificate"}. */
function certRecord(o){ return {v:1, kind:"commitment-certificate", certNo:String(o.certNo), pledgeId:String(o.pledgeId), pledgeFp:String(o.pledgeFp), pledgeBlock:Number(o.pledgeBlock),
  name:String(o.name||""), issued:String(o.issued), terms:o.terms || "draft-2026-10e", salt:String(o.salt)}; }
/* ---------- Merkle tree over the sorted fingerprints. Node = SHA-256("zc-node:" + left + right); an unpaired node moves up unchanged. ---------- */
function node(a, b){ return sha256("zc-node:" + a + b); }
function merkleRoot(leaves){ var lv = leaves.slice().sort(); if (!lv.length) return ZERO;
  while (lv.length > 1){ var nx = []; for (var i = 0; i < lv.length; i += 2) nx.push(i + 1 < lv.length ? node(lv[i], lv[i+1]) : lv[i]); lv = nx; } return lv[0]; }
function merkleProof(leaves, leaf){ var lv = leaves.slice().sort(), idx = lv.indexOf(leaf), path = []; if (idx < 0) return null;
  while (lv.length > 1){ var nx = []; for (var i = 0; i < lv.length; i += 2){
      if (i + 1 < lv.length){ if (i === idx) path.push({side:"R", hash:lv[i+1]}); else if (i + 1 === idx) path.push({side:"L", hash:lv[i]}); nx.push(node(lv[i], lv[i+1])); }
      else nx.push(lv[i]); }
    idx = Math.floor(idx / 2); lv = nx; }
  return path; }
function applyProof(leaf, path){ return path.reduce(function(h, s){ return s.side === "R" ? node(h, s.hash) : node(s.hash, h); }, leaf); }
/* ---------- blocks ---------- */
/* block = {v, chain, number, date, timestamp, prev, merkleRoot, count, entries:[{id, fp}], withdrawals:[ids], entriesHash, keyId, demo?, hash, signature} */
function header(b){ return {v:b.v, chain:b.chain, number:b.number, date:b.date, timestamp:b.timestamp, prev:b.prev, merkleRoot:b.merkleRoot, count:b.count,
  entriesHash:b.entriesHash, withdrawals:b.withdrawals || [], keyId:b.keyId, demo:b.demo ? true : undefined}; }
function blockHash(b){ return sha256(canon(header(b))); }
function makeBlock(prevBlock, date, timestamp, entries, withdrawals, keyId, demo){
  entries = entries.slice().sort(function(a, b){ return a.fp < b.fp ? -1 : 1; });
  var b = {v:1, chain:CHAIN_NAME, number:prevBlock ? prevBlock.number + 1 : 0, date:date, timestamp:timestamp, prev:prevBlock ? prevBlock.hash : ZERO,
    merkleRoot:merkleRoot(entries.map(function(e){ return e.fp; })), count:entries.length, entries:entries, withdrawals:(withdrawals || []).slice().sort(),
    entriesHash:sha256(canon(entries)), keyId:keyId, demo:demo ? true : undefined};
  b.hash = blockHash(b); return b; }
/* Checks one full block: Merkle root, entries hash and block hash. */
function checkBlock(b){ return {merkle: merkleRoot(b.entries.map(function(e){ return e.fp; })) === b.merkleRoot, entries: sha256(canon(b.entries)) === b.entriesHash, hash: blockHash(b) === b.hash}; }
/* Checks the whole chain of headers: numbers 0..n, each prev = hash of the block before, each hash re-computed. Returns {ok, broken:index or -1}. */
function checkChain(headers){ for (var i = 0; i < headers.length; i++){ var h = headers[i];
    if (h.number !== i || blockHash(h) !== h.hash || h.prev !== (i ? headers[i-1].hash : ZERO)) return {ok:false, broken:i}; } return {ok:headers.length > 0, broken:-1}; }
/* ---------- RSA-SHA256 (PKCS#1 v1.5) signature check with the published Zero Cube public key {n: hex, e: number}. Pure JavaScript (BigInt). ---------- */
function verifySignature(message, sigB64, key){
  try {
    if (typeof BigInt === "undefined") return null;
    var bin = (typeof atob === "function") ? atob(sigB64) : Utilities.newBlob(Utilities.base64Decode(sigB64)).getDataAsString("ISO-8859-1"), s = "";
    for (var i = 0; i < bin.length; i++) s += ("0" + bin.charCodeAt(i).toString(16)).slice(-2);
    var n = BigInt("0x" + key.n), e = BigInt(key.e), x = BigInt("0x" + s), r = BigInt(1), base = x % n;
    while (e > BigInt(0)){ if (e & BigInt(1)) r = (r * base) % n; base = (base * base) % n; e >>= BigInt(1); }
    var em = r.toString(16), kl = key.n.length; while (em.length < kl) em = "0" + em;
    var di = "3031300d060960864801650304020105000420" + sha256(message), pad = "0001";
    while (pad.length < kl - 2 - di.length) pad += "ff";
    return em === pad + "00" + di;
  } catch (err) { return false; }
}
return {canon:canon, sha256:sha256, record:record, fingerprint:fingerprint, certRecord:certRecord, merkleRoot:merkleRoot, merkleProof:merkleProof, applyProof:applyProof,
  header:header, blockHash:blockHash, makeBlock:makeBlock, checkBlock:checkBlock, checkChain:checkChain, verifySignature:verifySignature, CHAIN_NAME:CHAIN_NAME, ZERO:ZERO};
})();
