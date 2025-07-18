// scripts/codexsync.js
const { execSync } = require("child_process");

const module = process.argv[2] || "dropflow-sync";
console.log(`📤 Codex sync lancé pour le module : ${module}`);

try {
  execSync(`gh pr create --title "🤖 Codex Sync: ${module}" --body "Sync auto via DropFlow"`);
  console.log("✅ PR GitHub créée automatiquement !");
} catch (e) {
  console.error("❌ Erreur Codex PR :", e.message);
}
