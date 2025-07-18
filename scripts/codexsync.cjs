const { execSync } = require("child_process");

const moduleName = process.argv[2] || "dropflow-sync";
console.log(`📤 Codex sync lancé pour le module : ${moduleName}`);

try {
  execSync(`gh pr create --title "🤖 Codex Sync: ${moduleName}" --body "Sync auto via DropFlow"`);
  console.log("✅ PR GitHub créée automatiquement !");
} catch (e) {
  console.error("❌ Erreur Codex PR :", e.message);
}
