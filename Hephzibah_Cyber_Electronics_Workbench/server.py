import json, os, platform, re, shutil, subprocess, threading, webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
ROOT=Path(__file__).resolve().parent
APP=ROOT/"app"
PORT=8765

# Explicit command map. No arbitrary shell command is accepted from the browser.
TOOLS={
 "nmap":"nmap","masscan":"masscan","rustscan":"rustscan","gobuster":"gobuster",
 "ffuf":"ffuf","nikto":"nikto","sqlmap":"sqlmap","wafw00f":"wafw00f","whatweb":"whatweb",
 "httpx":"httpx","nuclei":"nuclei","hydra":"hydra","john":"john","hashcat":"hashcat",
 "wireshark":"wireshark","recon-ng":"recon-ng","theHarvester":"theHarvester",
 "amass":"amass","sublist3r":"sublist3r","shodan":"shodan","searchsploit":"searchsploit",
 "nc":"nc","dig":"dig","sslscan":"sslscan","enum4linux":"enum4linux",
 "zaproxy":"zaproxy","burpsuite":"burpsuite","code":"code","git":"git"
}
WINDOWS_LAUNCH={
 "wireshark":["wireshark"],"burpsuite":["burpsuite"],"zaproxy":["zaproxy"],"code":["code"]
}
def wsl_exists():
    return platform.system()=="Windows" and shutil.which("wsl") is not None
def command_exists(cmd):
    return shutil.which(cmd) is not None
def run_cmd(args, timeout=120):
    try:
        p=subprocess.run(args,capture_output=True,text=True,timeout=timeout)
        out=(p.stdout or "")+(("\n"+p.stderr) if p.stderr else "")
        return {"ok":p.returncode==0,"output":out[-16000:]}
    except Exception as e: return {"ok":False,"error":str(e)}
def wsl_cmd(tool,*args):
    return ["wsl","-d","Kali-linux","--",tool,*args]
def launch(tool):
    if tool not in TOOLS: return {"ok":False,"error":"Tool is not in the controlled launcher map."}
    cmd=TOOLS[tool]
    if platform.system()=="Windows" and command_exists(cmd):
        try:
            # Open CLI tools in a visible terminal; GUI tools are launched normally.
            if cmd in {"wireshark","burpsuite","zaproxy","code"}:
                subprocess.Popen([cmd],cwd=str(ROOT))
            else:
                subprocess.Popen(["cmd","/c","start","","cmd","/k",cmd],cwd=str(ROOT))
        except Exception as e:return {"ok":False,"error":str(e)}
        return {"ok":True,"message":f"{tool} launch requested locally."}
    if wsl_exists():
        # WSL is used as a compatibility layer for the existing Kali installation.
        try:
            subprocess.Popen(["cmd","/c","start","","cmd","/k","wsl","-d","Kali-linux","--",cmd],cwd=str(ROOT))
        except Exception as e:return {"ok":False,"error":str(e)}
        return {"ok":True,"message":f"{tool} launch requested in Kali WSL."}
    if command_exists(cmd):
        try: subprocess.Popen([cmd],cwd=str(ROOT))
        except Exception as e:return {"ok":False,"error":str(e)}
        return {"ok":True,"message":f"{tool} launch requested locally."}
    return {"ok":False,"error":f"{tool} is not installed or available on PATH."}
def safe_target(t):
    return bool(t) and len(t)<=253 and not any(c in t for c in "\r\n;|&`$><()")
class Handler(BaseHTTPRequestHandler):
    def send_json(self,data,code=200):
        raw=json.dumps(data).encode()
        self.send_response(code);self.send_header("Content-Type","application/json");self.send_header("Content-Length",str(len(raw)));self.end_headers();self.wfile.write(raw)
    def do_GET(self):
        if self.path=="/api/status": return self.send_json({"ok":True,"platform":platform.platform(),"wsl":wsl_exists()})
        path=self.path.split("?",1)[0]
        if path=="/": path="/index.html"
        fp=(APP/path.lstrip("/")).resolve()
        if not str(fp).startswith(str(APP.resolve())) or not fp.exists() or not fp.is_file(): return self.send_error(404)
        typ={".html":"text/html",".css":"text/css",".js":"application/javascript"}.get(fp.suffix,"text/plain")
        data=fp.read_bytes();self.send_response(200);self.send_header("Content-Type",typ+"; charset=utf-8");self.send_header("Content-Length",str(len(data)));self.end_headers();self.wfile.write(data)
    def do_POST(self):
        try: data=json.loads(self.rfile.read(int(self.headers.get("Content-Length","0"))) or b"{}")
        except: return self.send_json({"ok":False,"error":"Invalid JSON"},400)
        path=self.path
        if path=="/api/status": return self.send_json({"ok":True,"platform":platform.platform(),"wsl":wsl_exists()})
        if path=="/api/launch": return self.send_json(launch(data.get("tool","")))
        if path=="/api/tool":
            if data.get("tool")=="apt" and wsl_exists():
                try: subprocess.Popen(["wsl","-d","Kali-linux","--","bash","-lc","sudo apt-get update && sudo apt-get full-upgrade -y"])
                except Exception as e:return self.send_json({"ok":False,"error":str(e)})
                return self.send_json({"ok":True,"message":"Kali update started in a WSL terminal."})
            return self.send_json({"ok":False,"error":"Kali WSL was not detected."})
        if path=="/api/nmap":
            target=str(data.get("target","")).strip()
            if not safe_target(target): return self.send_json({"ok":False,"error":"Invalid target."},400)
            typ=data.get("type","service")
            args={"service":["-sV","-T4",target],"quick":["-T4","-F",target],"ports":["-p","22,80,443",target],"ping":["-sn",target]}.get(typ)
            if not args:return self.send_json({"ok":False,"error":"Unknown scan type."},400)
            if command_exists("nmap"): return self.send_json(run_cmd(["nmap",*args],120))
            if wsl_exists(): return self.send_json(run_cmd(wsl_cmd("nmap",*args),120))
            return self.send_json({"ok":False,"error":"Nmap not found. Install it in Kali or add it to PATH."})
        self.send_json({"ok":False,"error":"Unknown endpoint."},404)
    def log_message(self,fmt,*args): pass

if __name__=="__main__":
    url=f"http://127.0.0.1:{PORT}/"
    threading.Timer(0.8,lambda:webbrowser.open(url)).start()
    print(f"HEPHZIBAH WORKBENCH running at {url}")
    print("Close this window to stop the local bridge.")
    ThreadingHTTPServer(("127.0.0.1",PORT),Handler).serve_forever()
