const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

// --- logic ---
function extractKeyFacts(text) {
  const lower = (text || '').toLowerCase();
  const facts = { attacker: null, method: null, target: null, impact: null };

  if (/ransom|encrypt|encrypted|ransomware/.test(lower)) facts.method = "ransomware (files were encrypted)";
  if (/phish|phishing|credential|password/.test(lower)) facts.method = facts.method || "phishing (tricked someone)";
  if (/malware|trojan|virus/.test(lower)) facts.method = facts.method || "malware infection";
  if (/ddos|denial of service/.test(lower)) facts.method = facts.method || "denial-of-service";

  if (/customer|user|client|employee/.test(lower)) facts.target = "people (customers or employees)";
  if (/server|database|system|website/.test(lower)) facts.target = facts.target || "servers or databases";

  if (!facts.method) facts.method = "an attack (unspecified)";
  if (!facts.target) facts.target = "important systems or people";
  if (!facts.impact) facts.impact = "potential data loss or disruption";

  return facts;
}

function generateAnalogy(facts) {
  if ((facts.method || '').includes("ransomware"))
    return `Imagine burglars changed all the locks and demanded money for the keys back.`;
  if ((facts.method || '').includes("phishing"))
    return `Like someone tricking Grandma into handing over her house keys.`;
  if ((facts.method || '').includes("denial-of-service"))
    return `Like a crowd blocking the shop so customers can’t enter.`;
  return `Like a stranger sneaking in and messing with important things.`;
}

function generateNarrative(facts) {
  const sentences = [
    `Hi Grandma — some bad people used ${facts.method} against ${facts.target}.`,
    `That means they caused trouble and ${facts.impact}.`,
    `It’s kind of like someone sneaking into the house and locking the cupboards, so no one can reach the food.`,
    `The good news is the company is working hard to fix it and keep things safe.`,
    `In the future, being more careful with strange emails and keeping backups will help prevent this.`
  ];

  return {
    story: sentences.join(" "),
    tips: [
      "Tip: Don’t click suspicious links in emails.",
      "Tip: Keep backups of your important photos and files.",
      "Tip: Use strong passwords and never share them."
    ]
  };
}

function generateTimelineSVG() {
  return `<svg width="700" height="120" xmlns="http://www.w3.org/2000/svg">
    <line x1="40" y1="60" x2="660" y2="60" stroke="black" stroke-width="2"/>
    <circle cx="40" cy="60" r="10" stroke="black" fill="white"/>
    <text x="40" y="40" font-size="12" text-anchor="middle">Day 1</text>
    <text x="40" y="90" font-size="11" text-anchor="middle">Attack</text>
    <circle cx="350" cy="60" r="10" stroke="black" fill="white"/>
    <text x="350" y="40" font-size="12" text-anchor="middle">Day 2</text>
    <text x="350" y="90" font-size="11" text-anchor="middle">Impact</text>
    <circle cx="660" cy="60" r="10" stroke="black" fill="white"/>
    <text x="660" y="40" font-size="12" text-anchor="middle">Day 3</text>
    <text x="660" y="90" font-size="11" text-anchor="middle">Response</text>
  </svg>`;
}

// API
app.post('/api/explain', (req, res) => {
  const text = req.body.text || '';
  const facts = extractKeyFacts(text);
  res.json({
    facts,
    analogy: generateAnalogy(facts),
    narrative: generateNarrative(facts),
    timeline: generateTimelineSVG()
  });
});

// serve client build
const clientDist = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
