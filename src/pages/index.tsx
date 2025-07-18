import { Button } from "@/components/ui/button";
import { RocketIcon, TrendingUpIcon } from "lucide-react";
import { ModernHeader } from "@/components/layout/modern-header";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "DropFlow Pro – Plateforme SaaS de Dropshipping Intelligent";
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white px-6 py-12 flex flex-col items-center justify-center gap-12">
      <ModernHeader
        title="🚀 DropFlow Pro"
        subtitle="La plateforme ultime pour automatiser, optimiser et scaler votre business dropshipping avec l’IA."
      />

      <section className="text-center max-w-2xl space-y-4">
        <p className="text-lg">
          Importez des produits gagnants, connectez vos marketplaces, optimisez votre SEO,
          automatisez votre marketing et suivez vos commandes… Tout ça sur une seule plateforme.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <Button
            className="text-lg px-6 py-3"
            onClick={() => navigate("/auth/modern-login")}
          >
            Démarrer maintenant
          </Button>
          <Button
            variant="outline"
            className="text-lg px-6 py-3 border-white text-white hover:bg-white/10"
            onClick={() => window.open("https://docs.dropflow.pro", "_blank")}
          >
            📚 Voir la documentation
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left max-w-4xl">
        <div className="bg-slate-800/80 rounded-2xl p-6 shadow-xl border border-slate-700">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <RocketIcon className="w-5 h-5 text-teal-400" /> Importation IA
          </h3>
          <p className="text-sm text-gray-300">
            Importez des produits depuis AliExpress, BigBuy, Printify et bien d'autres, puis optimisez automatiquement titres, descriptions et images.
          </p>
        </div>
        <div className="bg-slate-800/80 rounded-2xl p-6 shadow-xl border border-slate-700">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <TrendingUpIcon className="w-5 h-5 text-purple-400" /> SEO & Blog AI
          </h3>
          <p className="text-sm text-gray-300">
            Boostez votre visibilité avec du contenu IA, des balises optimisées, des blogs auto-publiés et une stratégie SEO intégrée.
          </p>
        </div>
      </section>
    </main>
  );
};

export default HomePage;

