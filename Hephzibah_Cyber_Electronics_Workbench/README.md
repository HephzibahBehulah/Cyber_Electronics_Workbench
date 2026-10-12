# Hephzibah Cyber & Electronics Workbench

A local-first sci-fi GUI for the existing Hephzibah pentesting environment, expanded with an electronics engineering toolkit.

## What this version does

- Preserves the existing Kali/WSL tool ecosystem instead of replacing it.
- Adds a browser-based sci-fi dashboard with Cybersecurity, Electronics, Tools and Learning sections.
- Provides the complete requested cybersecurity tool catalogue:
  Nmap, Masscan, Rustscan, Gobuster, ffuf, Nikto, SQLmap, WAFW00F, WhatWeb, httpx, Nuclei, Hydra, John, Hashcat, Wireshark/tshark, Recon-ng, theHarvester, Amass, Sublist3r, Shodan, SearchSploit, Netcat, DNS/WHOIS, SSLScan, enum4linux, Impacket, Responder, OWASP ZAP, Burp Suite, VS Code, Git, Kali updates, quizzes, learning resources, Kioptrix, DVWA, Juice Shop and WebGoat.
- Adds working electronics calculators for Ohm's Law, power, LED resistor sizing, frequency/period and series/parallel resistance.
- Adds local notes and engineering unit conversion.
- Uses an explicit local command allow-list. The browser never accepts arbitrary shell commands.
- Nmap has a working local execution path through Windows PATH or Kali WSL.
- Other security tools can be launched in a visible terminal when installed locally or in Kali WSL. GUI tools open normally.

## Run

1. Extract this folder anywhere on the Windows laptop.
2. Double-click `run.bat`.
3. Python 3 must be installed and available as `python` or `py`.
4. The app opens at `http://127.0.0.1:8765`.
5. Keep the terminal window open while using the app. Closing it stops the local bridge.

## Existing Kali menu

The original `pentest-menu.sh` and `HephzibahPentestingApp.bat` remain separate and can continue to be used exactly as before.

## Security model

This application is intended for owned systems, isolated labs, CTFs and explicitly authorized security testing. The local bridge exposes only named tools and selected operations; it does not expose a generic command execution endpoint.

## Project structure

- `app/index.html` GUI
- `app/style.css` sci-fi interface
- `app/app.js` UI, calculators and local bridge calls
- `server.py` local bridge and static server
- `run.bat` Windows launcher
- Original Bash files remain in the repository source
