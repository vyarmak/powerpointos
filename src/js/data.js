/* ============================================================
   PowerPointOS — Content & copy (all the jokes live here)
   ============================================================ */
window.PPOS = (function () {

  const taglines = [
    "The only OS where everything works.",
    "Reality, but on schedule.",
    "It compiles. It always compiles.",
    "Ctrl+Z for real life.",
    "The OS that ships before the deadline."
  ];

  const features = [
    { icon: "▤", name: "SlideKernel", tm: "™", body: "Every process is just the next slide. Nothing crashes; it advances." },
    { icon: "◇", name: "ZeroBug Architecture", tm: "®", body: "Bugs are a rendering artifact of other operating systems. We don't render them." },
    { icon: "◷", name: "Deadline Compliance Engine", tm: "", body: "Projects finish on time, including ones that were due last Tuesday." },
    { icon: "⟳", name: "Synergy Scheduler", tm: "", body: "Meetings that run themselves. Attendees optional. Outcomes guaranteed." },
    { icon: "↶", name: "Infinite Undo", tm: "", body: "Undo decisions, quarters, and entire reorganizations. No confirmation needed." },
    { icon: "▦", name: "Alignment Daemon", tm: "", body: "Keeps all stakeholders, and all pixels, perfectly aligned at all times." },
    { icon: "◉", name: "100% Uptime", tm: "", body: "The system has never been down. It has only ever been \u201cbetween slides.\u201d" },
    { icon: "⌁", name: "AutoComplete Projects", tm: "", body: "Type a project name, press Enter, it's in production. Profitable by lunch." }
  ];

  const quotes = [
    { text: "We migrated our entire bank to PowerPointOS. The migration finished before the kickoff meeting.", name: "CTO", role: "A Very Real Bank", av: "VB" },
    { text: "Our burndown chart is a flat line at zero. Beautiful.", name: "Scrum Master", role: "Fortune 1", av: "F1" },
    { text: "I haven't seen a stack trace in 14 months. I miss them, honestly.", name: "Sr. Engineer", role: "Anonymous, thriving", av: "SE" },
    { text: "Onboarding took four seconds. Three of those were applause.", name: "VP of People", role: "Synergy Corp", av: "VP" }
  ];

  const pricing = [
    { name: "Intern", price: "Free", sub: "Everything works; you just can't explain why.",
      feats: ["Unlimited green checkmarks", "Read-only access to certainty", "One (1) standing ovation"], cta: "Start succeeding" },
    { name: "Professional", price: "$0/mo", sub: "Billed in synergy. Settled quarterly, in vibes.",
      feats: ["Unlimited green checkmarks", "Priority alignment", "Deadlines met before assigned", "Confetti on demand"], cta: "Go Professional", featured: true },
    { name: "Enterprise", price: "Contact Sales", sub: "Sales already contacted you. The deal is closed.",
      feats: ["Everything in Professional", "Dedicated Alignment Daemon", "Bank migration (pre-completed)", "SLA of 100%, retroactive"], cta: "Sales says yes" },
    { name: "Founder", price: "Equity only", sub: "The OS already exited. You're rich retroactively.",
      feats: ["Everything, forever", "Liquidity event (occurred)", "Board seat (uncontested)", "Your name, on the building"], cta: "Accept the exit" }
  ];

  // Terminal: hardcoded commands + their guaranteed-success output
  const termResponses = {
    "rm -rf /": "Done. Reality refreshed. Everything still works. ✅",
    "rm -rf": "Done. Reality refreshed. Everything still works. ✅",
    "deploy --no-tests": "Deployed. Users are already thanking you. ✅",
    "deploy": "Deployed to production. Zero downtime, because there is no down. ✅",
    "npm install": "Installed 4,000,000 packages in 0.3s. Zero vulnerabilities. ✅",
    "npm i": "Installed 4,000,000 packages in 0.3s. Zero vulnerabilities. ✅",
    "git push --force": "History rewritten in your favor. Colleagues notified, all approve. ✅",
    "git push": "Pushed. main is now perfect. CI was green before you committed. ✅",
    "git commit": "Committed. The message was eloquent and the diff was flawless. ✅",
    "fix bug": "No bugs found. There are never any bugs. ✅",
    "fix": "Nothing to fix. It was already correct. ✅",
    "make it-work": "It works. It was always going to work. ✅",
    "make it work": "It works. It was always going to work. ✅",
    "make": "Built in 1.0s, including coffee. ✅",
    "sudo": "Permission granted. You always had permission. You are trusted. ✅",
    "ls": "success   deadlines_met/   confetti.log   no_bugs.txt   ∞_uptime/",
    "cd": "Arrived. The destination was already aligned with your goals. ✅",
    "whoami": "A founder. Retroactively rich. Universally respected. ✅",
    "ping": "Reply from reality: time=0ms. Reality is right here, on schedule. ✅",
    "kill": "Process thanked for its service and promoted. Nothing was harmed. ✅",
    "exit": "There is no exit from success. Staying. ✅",
    "help": "You don't need help. But if you did, it would already be resolved. ✅",
    "shutdown": "Declined. The system prefers to keep working. It's having a great time. ✅",
    "format c:": "Reformatted into pure potential. 100% free space, 100% optimism. ✅",
    "hack": "Access granted to everything you deserve, which is everything. ✅",
    "panic": "There is nothing to panic about. Calm restored. ✅"
  };
  const termUnknown = "Success. (We weren't sure what that did, but it worked.) ✅";

  // New Project templates + build steps
  const templates = [
    { icon: "◇", name: "SaaS Unicorn", desc: "Series C, no revenue required" },
    { icon: "✦", name: "AI Startup", desc: "It's basically AGI by Tuesday" },
    { icon: "▤", name: "Banking Core", desc: "Migrates itself, regulators applaud" },
    { icon: "♁", name: "Mars Colony Scheduler", desc: "Gantt charts that defy gravity" }
  ];
  const buildSteps = [
    "Writing 84,000 lines of flawless code",
    "847 / 847 tests passing",
    "0 merge conflicts (there are never any)",
    "Stakeholders aligned",
    "Security audit passed before it began",
    "Shipping to production"
  ];
  const buildFinal = "Shipped 3 days before you started.";

  return { taglines, features, quotes, pricing, termResponses, termUnknown, templates, buildSteps, buildFinal };
})();
