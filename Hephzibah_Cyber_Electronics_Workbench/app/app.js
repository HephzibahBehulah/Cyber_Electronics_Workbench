const cyberTools=[
["Nmap","Network mapping and service detection","nmap","Recon"],["Masscan","High-speed TCP port scanner","masscan","Network"],["Rustscan","Fast port discovery with Nmap handoff","rustscan","Network"],["Gobuster","Directory, DNS and virtual-host discovery","gobuster","Web Security"],["ffuf","Web fuzzing and content discovery","ffuf","Web Security"],["Nikto","Web server security scanner","nikto","Web Security"],["SQLmap","SQL injection testing framework","sqlmap","Web Security"],["WAFW00F","Web application firewall fingerprinting","wafw00f","Web Security"],["WhatWeb","Web technology fingerprinting","whatweb","Recon"],["httpx","HTTP probing and web metadata","httpx","Recon"],["Nuclei","Template-based vulnerability scanning","nuclei","Web Security"],["Hydra","Network login auditing tool","hydra","Password & Hash"],["John","Password hash auditing","john","Password & Hash"],["Hashcat","Password recovery and hash auditing","hashcat","Password & Hash"],["Wireshark / tshark","Packet analysis GUI and CLI","wireshark","Forensics"],["Recon-ng","Modular reconnaissance framework","recon-ng","OSINT"],["theHarvester","Public-source OSINT collection","theHarvester","OSINT"],["Amass","Attack-surface and subdomain enumeration","amass","OSINT"],["Sublist3r","Subdomain enumeration","sublist3r","OSINT"],["Shodan","Internet asset search via API","shodan","OSINT"],["SearchSploit","Exploit-DB local search","searchsploit","Research"],["Netcat","Network connection and troubleshooting utility","nc","Network"],["DNS / WHOIS","DNS queries and domain registration lookup","dig","Network"],["SSLScan","TLS/SSL configuration inspection","sslscan","Web Security"],["enum4linux","SMB/Windows enumeration","enum4linux","Recon"],["Impacket","Network protocol and Windows lab toolkit","impacket","Lab"],["Responder","Credential relay lab toolkit","responder","Lab"],["OWASP ZAP","Web security proxy/scanner","zaproxy","Web Security"],["Burp Suite","Web application security platform","burpsuite","Web Security"],["VS Code","Code editor","code","Development"],["Git","Version control","git","Development"],["Kali Updates","Update and upgrade Kali packages","apt","Linux"],["Quizzes","Linux, ports and OSI quizzes","quiz","Learning"],["Learning Resources","Security learning references","links","Learning"],["Kioptrix","Vulnerable VM practice lab guide","kioptrix","Labs"],["DVWA","Damn Vulnerable Web Application lab","dvwa","Labs"],["Juice Shop","OWASP vulnerable web application lab","juice","Labs"],["WebGoat","OWASP interactive web security lab","webgoat","Labs"]
];
const electronicsCards=[
["Capacitors","Series/parallel capacitance and charge reference","Electronics"],["AC / DC","RMS, peak, frequency and waveform concepts","Electronics"],["Electronics Conversions","Common engineering unit relationships","Tools"],["Troubleshooting","Structured fault-finding workflow","Practice"],["Resistor Color Code","Decode 4/5/6-band resistor markings","Electronics"],["Voltage / Current / Resistance","Ohm's law relationship map","Electronics"]
];
const learningCards=[
["Cybersecurity","Core concepts, attack surface, vulnerabilities, controls and ethics."],
["Networking","IP addressing, ports, protocols, DNS, routing and packet flow."],
["Linux","Shell navigation, permissions, processes, packages and services."],
["Electronics","DC circuits, components, measurements and practical troubleshooting."],
["Quizzes","Use the calculators and knowledge cards, then practise in a controlled lab."],
["Practice Labs","Kioptrix, DVWA, Juice Shop and WebGoat are for isolated authorised practice."]
];
function cards(data,target){
 document.getElementById(target).innerHTML=data.map((x,i)=>`<div class="tool-card" data-i="${i}"><h3>${x[0]}</h3><p>${x[1]}</p><span class="tag">${x[2]||"REFERENCE"}</span></div>`).join("");
}
cards(cyberTools,"cyberGrid");cards(electronicsCards,"electronicsCards");cards(learningCards,"learningCards");

document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));document.getElementById(b.dataset.view).classList.add("active")});

async function bridge(path,body={}){try{let r=await fetch("/api/"+path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});return await r.json()}catch(e){return {ok:false,error:"Local bridge unavailable. Start run.bat first."}}}
async function checkBridge(){let r=await bridge("status");let d=document.getElementById("bridgeDot"),t=document.getElementById("bridgeText");if(r.ok){d.className="dot online";t.textContent="LOCAL BRIDGE: ONLINE"}else{d.className="dot offline";t.textContent="LOCAL BRIDGE: OFFLINE"}}
checkBridge();setInterval(checkBridge,5000);

function toast(s){let t=document.getElementById("toast");t.textContent=s;t.classList.add("toast-show");setTimeout(()=>t.classList.remove("toast-show"),2400)}
document.getElementById("nmapRun").onclick=async()=>{
 const target=document.getElementById("nmapTarget").value.trim(); const type=document.getElementById("nmapType").value;
 if(!target){toast("Target required");return}
 if(!confirm("Run Nmap only against a system you own or are explicitly authorized to test?")) return;
 const out=document.getElementById("nmapResult");out.textContent="Executing Nmap locally...";
 const r=await bridge("nmap",{target,type});out.textContent=r.output||r.error||"No output.";
};
document.querySelectorAll("#cyberGrid .tool-card").forEach(c=>c.onclick=async()=>{let x=cyberTools[+c.dataset.i];if(x[3]==="Learning"){toast("Use the Learning section.");return}if(x[0]==="Nmap"){document.getElementById("nmapTarget").focus();return}if(x[0]==="Kali Updates"){if(confirm("Update your local Kali package index and packages?")){let r=await bridge("tool",{tool:"apt"});toast(r.message||r.error)}return}if(["Quizzes","Learning Resources","Kioptrix","DVWA","Juice Shop","WebGoat"].includes(x[0])){toast("Open the Learning / Labs resources from the app section.");return}if(!confirm(`Launch ${x[0]} locally? Use only on authorized systems/labs.`))return;let r=await bridge("launch",{tool:x[2]});toast(r.message||r.error||"Launch requested.")});

function num(id){return parseFloat(document.getElementById(id).value)}
function fmt(n){return Number.isFinite(n)?n.toLocaleString(undefined,{maximumFractionDigits:6}):"Enter valid values."}
function ohm(){let v=num("ohmV"),i=num("ohmI"),o=document.getElementById("ohmOut");if(Number.isFinite(v)&&Number.isFinite(i)){o.textContent=`Resistance: ${fmt(v/i)} Ω\nPower: ${fmt(v*i)} W`}else if(Number.isFinite(v)){o.textContent="Enter current to calculate resistance and power."}else if(Number.isFinite(i)){o.textContent="Enter voltage to calculate resistance and power."}}
function power(){let v=num("powV"),i=num("powI");document.getElementById("powOut").textContent=(Number.isFinite(v)&&Number.isFinite(i))?`Power: ${fmt(v*i)} W`:"Enter voltage and current."}
function led(){let v=num("ledV"),f=num("ledF"),i=num("ledI")/1000,r=(v-f)/i;document.getElementById("ledOut").textContent=Number.isFinite(r)&&r>0?`Required resistance: ${fmt(r)} Ω\nRecommended standard value: ${Math.ceil(r/10)*10} Ω`:"Check supply, LED forward voltage and current."}
function period(){let f=num("freq");document.getElementById("freqOut").textContent=Number.isFinite(f)&&f>0?`Period: ${fmt(1/f)} s`:"Enter a positive frequency."}
function vals(id){return document.getElementById(id).value.split(",").map(x=>parseFloat(x.trim())).filter(Number.isFinite)}
function seriesCalc(){let a=vals("series");document.getElementById("seriesOut").textContent=a.length?`Rtotal: ${fmt(a.reduce((x,y)=>x+y,0))} Ω`:"Enter comma-separated resistor values."}
function parallelCalc(){let a=vals("parallel");document.getElementById("parallelOut").textContent=a.length?`Rtotal: ${fmt(1/a.reduce((x,y)=>x+1/y,0))} Ω`:"Enter comma-separated positive resistor values."}
const units={V:1,mV:.001,A:1,mA:.001,Ω:1,kΩ:1000,Hz:1,kHz:1000,MHz:1e6,W:1,mW:.001};
function convert(){let v=num("convValue"),a=document.getElementById("convFrom").value,b=document.getElementById("convTo").value;document.getElementById("convOut").textContent=(Number.isFinite(v)&&units[a]&&units[b])?`${fmt(v*units[a]/units[b])} ${b}`:"Conversion not available between these unit families."}
function saveNotes(){localStorage.setItem("hep_notes",document.getElementById("notes").value);toast("Note saved locally.")}function clearNotes(){document.getElementById("notes").value=""}document.getElementById("notes").value=localStorage.getItem("hep_notes")||"";
