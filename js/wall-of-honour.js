/* Zero Cube — Wall of Honour (Climate Duty Bearers): filters, sort, URL state, load more, certificate-of-honour profile modal. */
(function(){
"use strict";
var O=window.PLEDGE_OPTIONS,$=function(s){return document.querySelector(s)},$$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
var esc=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var plain=function(s){var d=document.createElement("div");d.innerHTML=s;return d.textContent};
var opt=function(id){return O.find(function(o){return o.id===id})};
var SEAL=(document.getElementById("sealTpl")||{}).innerHTML||"";
var PER=24, all=[], shown=PER, isSample=false;
var F={q:"",state:"",city:"",type:"",age:"",cats:[],st:"",co2:"",edu:"",date:"",photo:false,sort:"new",view:"grid"};

/* display helpers — minors: first name + initial, initials avatar only */
function dispName(p){if(!p.minor)return p.name;var w=String(p.name||"").trim().split(/\s+/);return w[0]+(w[1]?" "+w[w.length-1][0]+".":"")}
function ini(n){return (n||"?").split(/\s+/).filter(Boolean).slice(0,2).map(function(x){return x[0].toUpperCase()}).join("")}
function cats(p){var c=[];(p.ids||[]).forEach(function(id){var o=opt(id);if(o){var t=plain(o.cat);if(c.indexOf(t)<0)c.push(t)}});return c}
function cc(p){return p._c||(p._c=ZC_CALC.calc(p))}
function kg(p){return cc(p).kg}
function stu(p){return cc(p).edu.students}
function eduTxt(e){return e.mode==="teach"?e.hoursYear.toLocaleString("en-IN")+" learning hours a year":fmtRs(e.rupeesYear)+" a year"}
function fdate(d){return d?new Date(d+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):""}
function avatar(p,cls){return (p.photo&&!p.minor)?'<img class="'+cls+'" src="'+esc(p.photo)+'" alt="Photo of '+esc(dispName(p))+'" loading="lazy">':'<span class="'+cls+'" aria-hidden="true">'+esc(ini(dispName(p)))+'</span>'}
function loc(p){return [p.city,p.state].filter(Boolean).join(", ")}
function profURL(p){return location.origin+location.pathname+location.search+"#p="+encodeURIComponent(p.id)}

/* ---------- URL state ---------- */
function readURL(){var u=new URLSearchParams(location.search);
  ["q","state","city","type","age","st","co2","edu","date","sort","view"].forEach(function(k){if(u.get(k))F[k]=u.get(k)});
  F.cats=u.get("cat")?u.get("cat").split(",").filter(function(c){return HABIT_CATS.indexOf(c)>-1}):[];F.photo=u.get("photo")==="1";}
function writeURL(){var u=new URLSearchParams();
  ["q","state","city","type","age","st","co2","edu","date"].forEach(function(k){if(F[k])u.set(k,F[k])});
  if(F.cats.length)u.set("cat",F.cats.join(","));if(F.photo)u.set("photo","1");if(F.sort!=="new")u.set("sort",F.sort);if(F.view!=="grid")u.set("view",F.view);
  var qs=u.toString();history.replaceState(null,"",location.pathname+(qs?"?"+qs:"")+location.hash);}

/* ---------- filtering ---------- */
function match(p){
  if(F.q){var hay=(p.name+" "+(p.city||"")+" "+(p.state||"")+" "+(p.type||"")+" "+(p.words||"")+" "+(p.ids||[]).map(function(id){var o=opt(id);return o?plain(o.t+" "+o.cat):""}).join(" ")).toLowerCase();if(hay.indexOf(F.q.toLowerCase())<0)return false}
  if(F.state&&p.state!==F.state)return false; if(F.city&&p.city!==F.city)return false; if(F.type&&p.type!==F.type)return false;
  if(F.age==="adult"&&p.minor)return false; if(F.age==="minor"&&!p.minor)return false;
  if(F.cats.length){var c=cats(p);if(!F.cats.every(function(x){return c.indexOf(x)>-1}))return false}
  if(F.st&&stu(p)<+F.st)return false; if(F.co2&&kg(p)<+F.co2)return false; if(F.edu&&cc(p).edu.mode!==F.edu)return false; if(F.photo&&!(p.photo&&!p.minor))return false;
  if(F.date){var d=new Date((p.date||"1970-01-01")+"T00:00:00"),n=new Date();if(d.getFullYear()!==n.getFullYear())return false;if(F.date==="month"&&d.getMonth()!==n.getMonth())return false}
  return true}
function sorted(list){var s=list.slice();var by={new:function(a,b){return (b.date||"").localeCompare(a.date||"")},name:function(a,b){return dispName(a).localeCompare(dispName(b))},
  habits:function(a,b){return (b.ids||[]).length-(a.ids||[]).length},students:function(a,b){return stu(b)-stu(a)},co2:function(a,b){return kg(b)-kg(a)},rs:function(a,b){return cc(b).edu.rupeesYear-cc(a).edu.rupeesYear},hrs:function(a,b){return cc(b).edu.hoursYear-cc(a).edu.hoursYear}};
  return s.sort(by[F.sort]||by.new)}

/* ---------- rendering ---------- */
function card(p){var k=kg(p);
  return '<article class="dcard honour">'+(p.sample?'<span class="ribbon">SAMPLE</span>':'')+'<span class="gseal" title="Climate Duty Bearer">'+SEAL+'<span>Climate Duty Bearer</span></span>'+avatar(p,"dav")+'<div class="dbody"><h3>'+esc(dispName(p))+'</h3><p class="dcity">'+esc(loc(p))+'</p>'+
  (p.type?'<p class="dtype">'+esc(p.type)+'</p>':'')+(p.minor?'<p class="dminor">Under 18 · initials only</p>':'')+
  '<ul class="dmeta"><li><b>'+(p.ids||[]).length+'</b> habits</li><li><b>'+stu(p)+'</b> students</li><li>'+esc(fdate(p.date))+'</li></ul>'+
  '<span class="co2b" title="Indicative estimate, not a measured result">≈'+fmtKg(k)+' CO₂e/yr · indicative</span>'+'<span class="edub" title="'+(cc(p).edu.mode==="teach"?"Teaches or mentors students":"Supports students directly — not paid to Zero Cube")+'">'+(cc(p).edu.mode==="teach"?"Teaches · ":"Supports · ")+eduTxt(cc(p).edu)+'</span>'+ZCDocs.chainSeal(p,ZCDocs.chainFor(p),false)+
  '<div class="dact"><a class="btn btn-pri dview" href="#p='+encodeURIComponent(p.id)+'" data-id="'+esc(p.id)+'">View certificate</a><button class="btn btn-ghost dshare" type="button" data-id="'+esc(p.id)+'">Share</button></div></div></article>'}
function fill(sel,vals,label){var el=$(sel),cur=F[el.name];el.innerHTML='<option value="">'+label+'</option>'+vals.map(function(v){return '<option'+(v===cur?' selected':'')+'>'+esc(v)+'</option>'}).join("")}
function uniq(a){return a.filter(function(v,i){return v&&a.indexOf(v)===i}).sort()}
function syncControls(){
  fill("#fstate",uniq(all.map(function(p){return p.state})),"All states");
  var cities=uniq(all.filter(function(p){return !F.state||p.state===F.state}).map(function(p){return p.city}));
  if(F.city&&cities.indexOf(F.city)<0)F.city=""; fill("#fcity",cities,F.state?"All cities in "+F.state:"All cities"); $("#fcity").disabled=!F.state;
  $("#fq").value=F.q;$("#ftype").value=F.type;$("#fage").value=F.age;$("#fst").value=F.st;$("#fco2").value=F.co2;$("#fedu").value=F.edu;$("#fdate").value=F.date;$("#fphoto").checked=F.photo;$("#fsort").value=F.sort;
  $$("#fcats button").forEach(function(b){b.setAttribute("aria-pressed",F.cats.indexOf(b.dataset.c)>-1?"true":"false")});
  $("#vGrid").setAttribute("aria-pressed",F.view==="grid");$("#vList").setAttribute("aria-pressed",F.view==="list");}
var LBL={q:"Search",state:"State",city:"City",type:"Type",age:"Age",st:"Students",co2:"CO₂e",edu:"Education",date:"Date",photo:"Photo"};
var VAL={age:{adult:"18 and over",minor:"Under 18"},st:{"1":"1+","5":"5+","10":"10+"},co2:{"100":"100 kg+","500":"500 kg+","1000":"1 t+"},edu:{teach:"Teaches",fund:"Supports financially"},date:{month:"This month",year:"This year"}};
function chips(){var c=[];["q","state","city","type","age","st","co2","edu","date"].forEach(function(k){if(F[k])c.push([k,LBL[k]+": "+((VAL[k]&&VAL[k][F[k]])||F[k])])});
  F.cats.forEach(function(x){c.push(["cat:"+x,x])});if(F.photo)c.push(["photo","With photo"]);
  $("#achips").innerHTML=c.length?c.map(function(x){return '<button type="button" class="achip" data-k="'+esc(x[0])+'" aria-label="Remove filter '+esc(x[1])+'">'+esc(x[1])+' <span aria-hidden="true">×</span></button>'}).join("")+'<button type="button" class="aclear" id="aclear">Clear all</button>':"";
  $("#fbadge").hidden=!c.length;$("#fbadge").textContent=c.length;}
function render(){
  var list=sorted(all.filter(match));
  $("#dgrid").className="dgrid"+(F.view==="list"?" list":"");
  $("#dgrid").innerHTML=list.slice(0,shown).map(card).join("");
  $("#dcount").textContent=list.length+" Climate Duty Bearer"+(list.length===1?"":"s")+(list.length<all.length?" match (of "+all.length+")":"");
  $("#fsN").textContent=list.length;$("#fsNl").textContent=list.length===1?"result":"results"; $("#dempty").hidden=list.length>0; $("#dmore").hidden=list.length<=shown;
  $("#dmore").textContent="Load more ("+(list.length-shown)+" more)"; chips(); writeURL();}
function update(resetPage){if(resetPage)shown=PER;syncControls();render()}

/* ---------- controls ---------- */
$("#ftype").innerHTML='<option value="">All types</option>'+PLEDGER_TYPES.map(function(t){return "<option>"+esc(t)+"</option>"}).join("");
$("#fcats").innerHTML=HABIT_CATS.map(function(c){return '<button type="button" class="fchip" data-c="'+esc(c)+'" aria-pressed="false">'+esc(c)+'</button>'}).join("");
var tq;$("#fq").addEventListener("input",function(e){clearTimeout(tq);tq=setTimeout(function(){F.q=e.target.value.trim();shown=PER;render()},200)});
["state","city","type","age","st","co2","edu","date"].forEach(function(k){var el=$("[name="+k+"]");el.addEventListener("change",function(){F[k]=el.value;if(k==="state")F.city="";update(true)})});
$("#fphoto").addEventListener("change",function(e){F.photo=e.target.checked;update(true)});
$("#fsort").addEventListener("change",function(e){F.sort=e.target.value;update(true)});
$("#fcats").addEventListener("click",function(e){var b=e.target.closest(".fchip");if(!b)return;var c=b.dataset.c,i=F.cats.indexOf(c);if(i>-1)F.cats.splice(i,1);else F.cats.push(c);update(true)});
$("#vGrid").addEventListener("click",function(){F.view="grid";update(false)});$("#vList").addEventListener("click",function(){F.view="list";update(false)});
$("#dmore").addEventListener("click",function(){var first=shown;shown+=PER;render();var c=$$("#dgrid .dcard")[first];if(c){var a=c.querySelector("a");a&&a.focus()}});
function clearAll(){F.q=F.state=F.city=F.type=F.age=F.st=F.co2=F.edu=F.date="";F.cats=[];F.photo=false;update(true)}
$("#fsClear").addEventListener("click",clearAll);$("#emptyClear").addEventListener("click",clearAll);
$("#achips").addEventListener("click",function(e){if(e.target.closest("#aclear")){clearAll();return}var b=e.target.closest(".achip");if(!b)return;var k=b.dataset.k;
  if(k.indexOf("cat:")===0)F.cats.splice(F.cats.indexOf(k.slice(4)),1);else if(k==="photo")F.photo=false;else{F[k]="";if(k==="state")F.city=""}update(true);$("#dcount").focus&&0});

/* ---------- mobile bottom sheet ---------- */
var mq=window.matchMedia("(max-width: 900px)"),lastFocus=null;
function openSheet(){lastFocus=document.activeElement;$("#fside").classList.add("open");$("#fsbg").hidden=false;$("#fsOpen").setAttribute("aria-expanded","true");
  $("#fside").setAttribute("role","dialog");$("#fside").setAttribute("aria-modal","true");$("#fside").setAttribute("aria-labelledby","fsTitle");document.body.classList.add("noscroll");setTimeout(function(){$("#fq").focus()},50)}
function closeSheet(){$("#fside").classList.remove("open");$("#fsbg").hidden=true;$("#fsOpen").setAttribute("aria-expanded","false");$("#fside").removeAttribute("role");$("#fside").removeAttribute("aria-modal");
  document.body.classList.remove("noscroll");if(lastFocus)lastFocus.focus()}
$("#fsOpen").addEventListener("click",openSheet);$("#fsClose").addEventListener("click",closeSheet);$("#fsbg").addEventListener("click",closeSheet);$("#fsApply").addEventListener("click",closeSheet);
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&$("#fside").classList.contains("open"))closeSheet();
  if(e.key==="Tab"&&$("#fside").classList.contains("open")){var f=$$("#fside button, #fside input, #fside select").filter(function(x){return !x.disabled&&x.offsetParent});if(!f.length)return;
    if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus()}}});
mq.addEventListener&&mq.addEventListener("change",function(){if(!mq.matches)closeSheet()});

/* ---------- share + profile ---------- */
function toast(m){var t=$("#dtoast");if(!t){t=document.createElement("div");t.id="dtoast";t.className="dtoast";t.setAttribute("role","status");document.body.appendChild(t)}t.textContent=m;t.classList.add("on");setTimeout(function(){t.classList.remove("on")},2200)}
function share(p){var url=profURL(p),txt=dispName(p)+" is a Climate Duty Bearer on Zero Cube's Wall of Honour — "+(p.ids||[]).length+" daily habits (≈"+fmtKg(kg(p))+" CO₂e a year, indicative) and "+stu(p)+" student"+(stu(p)>1?"s":"")+" supported.";
  if(navigator.share)navigator.share({title:"Zero Cube Pledge",text:txt,url:url}).catch(function(){});
  else if(navigator.clipboard)navigator.clipboard.writeText(url).then(function(){toast("Link copied — paste it anywhere to share.")},function(){prompt("Copy this link:",url)});
  else prompt("Copy this link:",url)}
function profile(p){return ZCDocs.certHTML(p,SEAL,ZCDocs.chainFor(p))}
var cur=null;
function openProfile(id){var p=all.find(function(x){return String(x.id)===String(id)});if(!p)return;cur=p;$("#dletter").innerHTML=profile(p);$("#dlgTitle").textContent="Certificate of Honour — "+dispName(p);
  if(!$("#dlg").open)$("#dlg").showModal();if(location.hash!=="#p="+encodeURIComponent(id))history.replaceState(null,"",location.pathname+location.search+"#p="+encodeURIComponent(id))}
function closeProfile(){if($("#dlg").open)$("#dlg").close()}
$("#dlg").addEventListener("close",function(){cur=null;if(location.hash.indexOf("#p=")===0)history.replaceState(null,"",location.pathname+location.search)});
$("#dclose").addEventListener("click",closeProfile);$("#dshare2").addEventListener("click",function(){if(cur)share(cur)});
$("#dgrid").addEventListener("click",function(e){var v=e.target.closest(".dview");if(v){e.preventDefault();openProfile(v.dataset.id);return}var s=e.target.closest(".dshare");if(s){share(all.find(function(x){return String(x.id)===s.dataset.id}))}});
window.addEventListener("hashchange",function(){var m=location.hash.match(/^#p=(.+)$/);if(m)openProfile(decodeURIComponent(m[1]));else closeProfile()});

/* ---------- boot ---------- */
readURL();
pledgeFetchList().then(function(d){all=(d.items||[]).map(function(p,i){p.id=p.id||("p"+i);return p});isSample=d.sample;$("#dsample").hidden=!d.sample;
  if(d.prelaunch||(!all.length&&!d.sample)){var em=$("#dempty");if(em){var h3=em.querySelector("h3"),p=em.querySelector("p");if(h3)h3.textContent="Our first Climate Duty Bearers will appear here";if(p)p.textContent="The Wall of Honour opens at launch. Take the pledge and be among the first.";}}
  update(false);
  var m=location.hash.match(/^#p=(.+)$/);if(m)openProfile(decodeURIComponent(m[1]));});
renderPledgeCounter();
})();
