/* Pledge options (daily habits). Numbers come from js/pledge-calc.js (factor table: pledge-methodology.html).
   Every habit has a tangible outcome; CO2e figures are INDICATIVE ESTIMATES, conservative and rounded down. */
window.PLEDGE_OPTIONS = [
 {id:"ac", g:"foot", cat:"Home energy", c:"AC max 3 hours a day, at 24–26 °C", t:"I will not use the AC more than 3 hours a day, and I will set it to 24–26 °C"},
 {id:"switchoff", g:"foot", cat:"Home energy", c:"Switch off lights & fans; unplug chargers", t:"I will switch off lights and fans when I leave a room, and unplug chargers"},
 {id:"led", g:"foot", cat:"Home energy", c:"Only LED bulbs at home", t:"I will use only LED bulbs and tube-lights at home"},
 {id:"sundry", g:"foot", cat:"Home energy", c:"Dry clothes in the sun", t:"I will dry clothes in the sun, not in a dryer"},
 {id:"solar", g:"foot", cat:"Home energy", c:"Rooftop solar", t:"I will put up rooftop solar on my home"},
 {id:"transit", g:"foot", cat:"Travel", c:"Public transport or EV", t:"I will use public transport, or green transport like an electric scooter or car"},
 {id:"walk", g:"foot", cat:"Travel", c:"Walk or cycle short trips", t:"I will walk or cycle for short trips"},
 {id:"carpool", g:"foot", cat:"Travel", c:"Car-pool when I can", t:"I will car-pool to work or college whenever I can"},
 {id:"idle", g:"foot", cat:"Travel", c:"No engine idling", t:"I will switch off my engine at long red lights and while waiting"},
 {id:"fresh", g:"foot", cat:"Food", c:"Fresh, local food — not packaged", t:"I will eat fresh, local, seasonal food — not processed or packaged food"},
 {id:"nowaste", g:"foot", cat:"Food", c:"Waste no food", t:"I will cook and take only what we need, and waste no food"},
 {id:"bag", g:"foot", cat:"Waste &amp; plastic", c:"Cloth bag & own bottle — no single-use plastic", t:"I will carry a cloth bag and my own water bottle — no single-use plastic"},
 {id:"segregate", g:"foot", cat:"Waste &amp; plastic", c:"Segregate waste & compost", t:"I will segregate wet and dry waste, and compost kitchen waste"},
 {id:"bucket", g:"foot", cat:"Water", c:"Bucket bath; tap off while brushing", t:"I will take a bucket bath and turn off the tap while brushing"},
 {id:"leaks", g:"foot", cat:"Water", c:"Fix leaks; reuse water", t:"I will fix leaking taps and reuse RO and washing water for plants or mopping"},
 {id:"local", g:"foot", cat:"Shopping", c:"Buy less, repair, reuse", t:"I will buy local, repair before I replace, and reuse what I can"},
 {id:"tree", g:"hand", cat:"Nature", c:"Plant & care for native trees", t:"I will plant native trees and care for them for 3 years"},
 {id:"teach", g:"hand", cat:"Spread the word", c:"Teach one green habit a month", t:"I will teach my family and neighbours one green habit every month"},
 {id:"shop", g:"hand", cat:"Spread the word", c:"Help a local shop go green", t:"I will help local shops or small businesses save energy and cut waste"}
];
/* Plain-words outcome line for one habit result r (from ZC_CALC.calc().per[id]). */
window.pledgeOutcome = function(id, r){
  var n=function(x){return Math.floor(x).toLocaleString("en-IN")}, kg=r.kg?"≈"+fmtKg(r.kg)+" CO₂e a year":"";
  switch(id){
   case "ac": case "switchoff": case "led": case "sundry": return r.kwh>=1?"Saves about "+n(r.kwh)+" units of electricity a year — "+kg:"Nothing extra counted at these settings";
   case "solar": return "Makes about "+n(r.kwh)+" units of clean electricity a year — "+kg;
   case "transit": case "walk": case "carpool": return n(r.km)+" km a year switched — "+(r.kg?kg:"counted as 0 kg on today's grid");
   case "idle": return "Saves about "+n(r.fuel)+" litres of petrol a year — "+kg;
   case "fresh": return n(r.items)+" fewer plastic food packets a year — "+(r.kg?kg:"under 1 kg CO₂e a year");
   case "nowaste": return "About "+n(r.food)+" kg less food wasted a year — "+kg;
   case "bag": return n(r.items)+" single-use plastic items avoided a year — "+(r.kg?kg:"under 1 kg CO₂e a year");
   case "segregate": return "About "+n(r.waste)+" kg of kitchen waste composted, not dumped — "+kg;
   case "bucket": case "leaks": return "Saves about "+n(r.litres)+" litres of water a year — "+(r.kg?kg:"under 1 kg CO₂e a year");
   case "local": return n(r.items)+" new garments not bought a year — "+kg;
   case "tree": return n(r.trees)+" young tree"+(r.trees>1?"s":"")+" cared for — "+kg+" while young (more as "+(r.trees>1?"they grow":"it grows")+")";
   case "teach": return n(r.people)+" people reached — "+n(r.lessons)+" green-habit lessons a year (not added to CO₂e)";
   case "shop": return n(r.biz)+" local business"+(r.biz>1?"es":"")+" helped to go green (not added to CO₂e)";
  } return kg;
};
window.PLEDGE_SOURCES = ZC_CALC.D.sources; /* [title, url, date] — from build_parts/pledge_factors.json */
/* SAMPLE pledges for demo mode only — dummy names, no real people, initials avatars. CO2e and totals are recalculated live by ZC_CALC. */
window.PLEDGE_SAMPLES = [{"id":"s01","name":"Sample Duty Bearer A","city":"Pune","state":"Maharashtra","type":"Individual","minor":false,"date":"2026-10-16","ids":["led","walk","bag","teach"],"words":"I want my children to grow up with clean air.","sample":true,"fam":4,"inputs":{"led":{"n":3}},"edu":{"students":2,"amount":1500}},
{"id":"s02","name":"Sample Duty Bearer B","city":"Nashik","state":"Maharashtra","type":"MSME owner","minor":false,"date":"2026-10-14","ids":["solar","ac","fresh","shop"],"words":"Small steps by many people make a big change.","sample":true,"fam":5,"inputs":{"solar":{"kw":2}},"edu":{"students":5,"amount":3000}},
{"id":"s03","name":"Sample Duty Bearer C","city":"Nagpur","state":"Maharashtra","type":"Teacher / Educator / Professor","minor":false,"date":"2026-10-12","ids":["transit","bucket","tree","segregate","teach"],"words":"Nature gave us life; this is my way to give back.","sample":true,"fam":3,"inputs":{"transit":{"km":15,"d":5,"mode":"carbus"}},"edu":{"students":12,"hours":8}},
{"id":"s04","name":"Sample Duty Bearer D","city":"Mumbai","state":"Maharashtra","type":"Corporate employee","minor":false,"date":"2026-10-09","ids":["ac","led","local","switchoff"],"words":"I will start at home and then help my society.","sample":true,"fam":4,"inputs":{"led":{"n":8}},"edu":{"students":1,"amount":2000}},
{"id":"s05","name":"Sample Duty Bearer E","city":"Pune","state":"Maharashtra","type":"Student","minor":true,"date":"2026-10-08","ids":["walk","bag","bucket"],"words":"Teaching others is the best pledge I can take.","sample":true,"fam":6,"inputs":{},"edu":{"students":1,"hours":2}},
{"id":"s06","name":"Sample Duty Bearer F","city":"Bengaluru","state":"Karnataka","type":"Professional / Expert","minor":false,"date":"2026-10-05","ids":["solar","switchoff","nowaste","carpool"],"words":"Our family will run on the sun.","sample":true,"fam":4,"inputs":{"solar":{"kw":3}},"edu":{"students":10,"amount":1500}},
{"id":"s07","name":"Sample Duty Bearer G","city":"Mysuru","state":"Karnataka","type":"Institution / School representative","minor":false,"date":"2026-10-02","ids":["led","switchoff","segregate","tree","teach"],"words":"I want my children to grow up with clean air.","sample":true,"fam":2,"inputs":{"led":{"n":6}},"edu":{"students":10,"amount":3000}},
{"id":"s08","name":"Sample Duty Bearer H","city":"Ahmedabad","state":"Gujarat","type":"MSME owner","minor":false,"date":"2026-09-28","ids":["solar","idle","local","shop"],"words":"Small steps by many people make a big change.","sample":true,"fam":5,"inputs":{"solar":{"kw":2}},"edu":{"students":3,"amount":12000}},
{"id":"s09","name":"Sample Duty Bearer I","city":"Surat","state":"Gujarat","type":"Individual","minor":false,"date":"2026-09-20","ids":["ac","fresh","bucket"],"words":"Nature gave us life; this is my way to give back.","sample":true,"fam":4,"inputs":{},"edu":{"students":1,"amount":2000}},
{"id":"s10","name":"Sample Duty Bearer J","city":"Jaipur","state":"Rajasthan","type":"Student","minor":false,"date":"2026-09-11","ids":["walk","transit","bag","teach"],"words":"I will start at home and then help my society.","sample":true,"fam":3,"inputs":{"transit":{"km":8,"d":5,"mode":"carbus"}},"edu":{"students":2,"amount":5000}},
{"id":"s11","name":"Sample Duty Bearer K","city":"Chennai","state":"Tamil Nadu","type":"Corporate employee","minor":false,"date":"2026-08-30","ids":["carpool","led","sundry","leaks"],"words":"Teaching others is the best pledge I can take.","sample":true,"fam":4,"inputs":{"led":{"n":6},"sundry":{"n":2}},"edu":{"students":4,"amount":1500}},
{"id":"s12","name":"Sample Duty Bearer L","city":"Coimbatore","state":"Tamil Nadu","type":"Teacher / Educator / Professor","minor":false,"date":"2026-08-15","ids":["led","nowaste","tree","teach"],"words":"Our family will run on the sun.","sample":true,"fam":5,"inputs":{"led":{"n":8}},"edu":{"students":8,"hours":10}},
{"id":"s13","name":"Sample Duty Bearer M","city":"Lucknow","state":"Uttar Pradesh","type":"Individual","minor":false,"date":"2026-07-22","ids":["switchoff","bucket","segregate"],"words":"I want my children to grow up with clean air.","sample":true,"fam":4,"inputs":{},"edu":{"students":1,"amount":12000}},
{"id":"s14","name":"Sample Duty Bearer N","city":"New Delhi","state":"Delhi","type":"Professional / Expert","minor":false,"date":"2026-06-10","ids":["transit","walk","ac","shop"],"words":"Small steps by many people make a big change.","sample":true,"fam":3,"inputs":{"transit":{"km":12,"d":5,"mode":"carbus"}},"edu":{"students":6,"amount":2000}},
{"id":"s15","name":"Sample Duty Bearer O","city":"Kochi","state":"Kerala","type":"Student","minor":true,"date":"2026-05-04","ids":["bag","tree"],"words":"Nature gave us life; this is my way to give back.","sample":true,"fam":4,"inputs":{},"edu":{"students":1,"hours":2}},
{"id":"s16","name":"Sample Duty Bearer P","city":"Hyderabad","state":"Telangana","type":"Other","minor":false,"date":"2026-03-19","ids":["solar","walk","fresh","local","teach"],"words":"I will start at home and then help my society.","sample":true,"fam":6,"inputs":{"solar":{"kw":1}},"edu":{"students":10,"amount":1500}},
{"id":"s17","name":"Sample Duty Bearer Q","city":"Kolkata","state":"West Bengal","type":"Corporate employee","minor":false,"date":"2025-12-12","ids":["transit","idle","nowaste"],"words":"Teaching others is the best pledge I can take.","sample":true,"fam":2,"inputs":{"transit":{"km":12,"d":5,"mode":"carbus"}},"edu":{"students":1,"amount":3000}},
{"id":"s18","name":"Sample Duty Bearer R","city":"Bhopal","state":"Madhya Pradesh","type":"Education professional","minor":false,"date":"2025-11-03","ids":["switchoff","led","bucket","segregate","tree","teach"],"words":"Our family will run on the sun.","sample":true,"fam":4,"inputs":{"led":{"n":5}},"edu":{"students":40,"hours":6}}];
window.pledgeCalc = function(p){ return ZC_CALC.calc(p); };
window.pledgeKg = function(p){ return p && typeof p.kg==="number" && !p.sample ? p.kg : ZC_CALC.calc(p).kg; };
window.pledgeTotals = function(list){ var t={n:list.length,kg:0,st:0,rs:0,hrs:0}; list.forEach(function(p){ var c=ZC_CALC.calc(p); t.kg+=c.kg; t.st+=c.edu.students; t.rs+=c.edu.rupeesYear; t.hrs+=c.edu.hoursYear; }); return t; };
window.fmtRs = function(r){ return "₹"+Math.floor(r).toLocaleString("en-IN"); };
window.fmtKg = function(kg){ return kg>=1000 ? (Math.floor(kg/100)/10).toLocaleString("en-IN")+" t" : kg.toLocaleString("en-IN")+" kg"; };
window.pledgeFetchList = function(){
  var C=window.ZC_PLEDGE_CONFIG;
  if(!C.ENDPOINT) return Promise.resolve(C.DEMO ? {sample:true, items:PLEDGE_SAMPLES} : {sample:false, prelaunch:true, items:[]});
  return fetch(C.ENDPOINT+"?action=list").then(function(r){return r.json()}).then(function(d){ return {sample:false, items:d.items||[], totals:d.totals}; })
   .catch(function(){ return C.DEMO ? {sample:true, items:PLEDGE_SAMPLES, error:true} : {sample:false, items:[], error:true}; });
};
/* Counter: fills any element with [data-pc="n|kg|st"] and [data-pc-note] */
window.renderPledgeCounter = function(){
  pledgeFetchList().then(function(d){
    var t=d.totals||pledgeTotals(d.items);
    document.querySelectorAll('[data-pc="n"]').forEach(function(e){e.textContent=(+t.n).toLocaleString("en-IN")});
    document.querySelectorAll('[data-pc="kg"]').forEach(function(e){e.textContent=fmtKg(+t.kg)});
    document.querySelectorAll('[data-pc="st"]').forEach(function(e){e.textContent=(+t.st).toLocaleString("en-IN")});
    document.querySelectorAll('[data-pc="rs"]').forEach(function(e){e.textContent=fmtRs(+t.rs||0)});
    document.querySelectorAll('[data-pc="hrs"]').forEach(function(e){e.textContent=(+t.hrs||0).toLocaleString("en-IN")});
    document.querySelectorAll('[data-pc-note]').forEach(function(e){e.innerHTML=d.sample?'<b class="samp">SAMPLE</b> Demo figures from sample Climate Duty Bearers — live totals appear once the pledge database is connected.':d.prelaunch?'We are just starting: totals from approved Climate Duty Bearers appear here after launch. Be among the first.':d.error?'Live totals could not be loaded right now.':'Approved Climate Duty Bearers only. CO₂e is an indicative estimate per year.'});
  });
};

window.PLEDGER_TYPES=["Individual","Student","Teacher / Educator / Professor","Education professional","Professional / Expert","MSME owner","Corporate employee","Institution / School representative","Other"];
window.INDIA_STATES=["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"];
window.HABIT_CATS=["Home energy","Travel","Food","Waste & plastic","Water","Shopping","Nature","Spread the word"];
