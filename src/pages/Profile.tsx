import React, { useState } from "react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";

export default function Profile() {
  const [message, setMessage] = useState("");

  const handleSave = () => {
    setMessage("Profil enregistré");
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold mb-2">Profil</h1>
      <p>
        Consultez la{" "}
        <a
          href="/docs/Profile.md"
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          profil de documentation
        </a>{" "}
        pour apprendre à modifier vos informations.
      </p>

      <Select
        data-testid="privacy-select"
        options={[
          { valeur: "public", étiquette: "Public" },
          { valeur: "privé", étiquette: "Privé" },
        ]}
      />
      <Button onClick={handleSave}>Enregistrer</Button>
      {message && <Toast>{message}</Toast>}
    </div>
  );
}
