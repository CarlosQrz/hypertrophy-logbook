import { useState, useRef, useCallback } from "react";
import { Check, Plus, Search, ChevronDown, Dumbbell, ChevronRight, Utensils, Trash2 } from "lucide-react";

const EXERCISES = [
  { name: "Supino Reto", group: "Peito" }, { name: "Supino Inclinado", group: "Peito" }, { name: "Crossover", group: "Peito" },
  { name: "Puxada Frontal", group: "Costas" }, { name: "Remada Curvada", group: "Costas" }, { name: "Pull Down", group: "Costas" },
  { name: "Agachamento Livre", group: "Pernas" }, { name: "Cadeira Extensora", group: "Quadríceps" }, { name: "Mesa Flexora", group: "Posterior de Coxa" },
  { name: "Elevação Lateral", group: "Ombros" }, { name: "Desenvolvimento", group: "Ombros" },
  { name: "Rosca Direta", group: "Bíceps" }, { name: "Rosca Scott", group: "Bíceps" },
  { name: "Tríceps Pulley", group: "Tríceps" }, { name: "Tríceps Testa", group: "Tríceps" },
  { name: "Gêmeos em Pé", group: "Panturrilha" }, { name: "Gêmeos Sentado", group: "Panturrilha" },
];

const EQUIPMENT = [
  { name: "Supino Articulado Hammer", group: "Peito" }, { name: "Peck Deck Matrix", group: "Peito" },
  { name: "Puxador Articulado", group: "Costas" }, { name: "Remada Máquina", group: "Costas" },
  { name: "Leg Press 45", group: "Pernas" }, { name: "Hack Machine", group: "Pernas" },
  { name: "Desenvolvimento Articulado", group: "Ombros" },
  { name: "Máquina Scott", group: "Bíceps" }, { name: "Máquina Tríceps", group: "Tríceps" },
  { name: "Peso Livre (Barra/Halter)", group: "Geral" }, { name: "Polia / Cabo", group: "Geral" },
];

const SET_TYPES = [
  "Aquecimento", "Preparação", "Reconhecimento", "Série Válida", "Até a falha",
];

interface SetEntry {
  id: number;
  weight: string;
  reps: string;
  type: string;
  completed: boolean;
}

export default function HypertrophyHub() {
  const [activeTab, setActiveTab] = useState<"treino" | "alimentacao">("treino");

  const [exerciseQuery, setExerciseQuery] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [showExerciseList, setShowExerciseList] = useState(false);

  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [showEquipmentList, setShowEquipmentList] = useState(false);

  const [sets, setSets] = useState<SetEntry[]>([
    { id: 1, weight: "", reps: "", type: "Série Válida", completed: false },
  ]);
  const [nextId, setNextId] = useState(2);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredExercises = EXERCISES.filter((e) =>
    e.name.toLowerCase().includes(exerciseQuery.toLowerCase()) ||
    e.group.toLowerCase().includes(exerciseQuery.toLowerCase())
  );

  const selectExercise = useCallback((name: string) => {
    setSelectedExercise(name);
    setExerciseQuery(name);
    setShowExerciseList(false);
  }, []);

  const updateSet = useCallback((id: number, field: keyof SetEntry, value: string | boolean) => {
    if ((field === "weight" || field === "reps") && typeof value === "string") {
      if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;
    }
    setSets((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }, []);

  const toggleComplete = useCallback((id: number) => {
    setSets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  }, []);

  const addSet = useCallback(() => {
    if (sets.length >= 8) return;
    setSets((prev) => [...prev, { id: nextId, weight: "", reps: "", type: "Série Válida", completed: false }]);
    setNextId((n) => n + 1);
  }, [nextId, sets.length]);

  const removeSet = useCallback((id: number) => {
    if (sets.length <= 1) return;
    setSets((prev) => prev.filter((s) => s.id !== id));
  }, [sets.length]);

  const completedCount = sets.filter((s) => s.completed).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Hub */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Hypertrophy<span className="text-primary">OS</span>
            </h1>
          </div>

          {/* Navegação do Hub */}
          <div className="flex bg-secondary p-1 rounded-lg gap-1">
            <button
              onClick={() => setActiveTab("treino")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${
                activeTab === "treino" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Dumbbell className="h-4 w-4" />
              Treino
            </button>
            <button
              onClick={() => setActiveTab("alimentacao")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${
                activeTab === "alimentacao" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Utensils className="h-4 w-4" />
              Alimentação
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Condicional */}
      <main className="flex-1 container mx-auto px-4 py-5 pb-28 space-y-5">
        {activeTab === "alimentacao" ? (
          <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-border rounded-xl p-6">
            <Utensils className="h-10 w-10 text-muted-foreground mb-3" />
            <h2 className="text-foreground font-semibold">Módulo de Alimentação</h2>
            <p className="text-sm text-muted-foreground mt-2">Aguardando as especificações numéricas exatas para o cálculo de macros.</p>
          </div>
        ) : (
          <>
            {/* Progress bar do treino atual */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: sets.length > 0 ? `${(completedCount / sets.length) * 100}%` : "0%" }}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {completedCount}/{sets.length}
              </span>
            </div>

            {/* Exercise Selection Card */}
            <div className="rounded-xl bg-card border border-border p-4 space-y-4">
              <div className="relative">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Buscar Exercício
                </label>
                <Search className="absolute left-3 top-[34px] -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  ref={searchRef}
                  type="text"
                  value={exerciseQuery}
                  onChange={(e) => {
                    setExerciseQuery(e.target.value);
                    setShowExerciseList(true);
                    setSelectedExercise("");
                  }}
                  onFocus={() => setShowExerciseList(true)}
                  placeholder="Ex: Supino Reto, Pernas..."
                  className="w-full h-12 pl-10 pr-4 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
                {showExerciseList && exerciseQuery.length > 0 && (
                  <div className="absolute z-20 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                    {filteredExercises.length > 0 ? (
                      filteredExercises.map((ex) => (
                        <button
                          key={ex.name}
                          onClick={() => selectExercise(ex.name)}
                          className="w-full text-left px-4 py-3 flex justify-between items-center text-sm text-foreground hover:bg-surface-elevated transition-colors border-b border-border/50 last:border-0"
                        >
                          <span className="font-medium">{ex.name}</span>
                          <span className="text-[10px] bg-secondary px-2 py-1 rounded text-muted-foreground whitespace-nowrap ml-2">{ex.group}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-muted-foreground">Nenhum encontrado</div>
                    )}
                  </div>
                )}
              </div>

              {/* Equipment Dropdown */}
              <div className="relative">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Máquina / Equipamento
                </label>
                <button
                  onClick={() => setShowEquipmentList(!showEquipmentList)}
                  className="w-full h-12 px-4 bg-secondary border border-border rounded-lg text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <span className={`truncate mr-2 ${selectedEquipment ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {selectedEquipment || "Ex: Peck Deck Matrix, Peso Livre..."}
                  </span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${showEquipmentList ? "rotate-180" : ""}`} />
                </button>
                {showEquipmentList && (
                  <div className="absolute z-20 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                    {EQUIPMENT.map((eq) => (
                      <button
                        key={eq.name}
                        onClick={() => { setSelectedEquipment(eq.name); setShowEquipmentList(false); }}
                        className="w-full text-left px-4 py-3 flex justify-between items-center text-sm text-foreground hover:bg-surface-elevated transition-colors border-b border-border/50 last:border-0"
                      >
                        <span className="font-medium">{eq.name}</span>
                        <span className="text-[10px] bg-secondary px-2 py-1 rounded text-muted-foreground whitespace-nowrap ml-2">{eq.group}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sets Log */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Séries ({sets.length}/8)
                </h2>
              </div>

              <div className="space-y-3">
                {sets.map((set, index) => (
                  <div
                    key={set.id}
                    className={`flex flex-col gap-3 rounded-xl border p-3 transition-all duration-300 ${
                      set.completed ? "bg-primary/5 border-primary/20" : "bg-card border-border"
                    }`}
                  >
                    {/* Linha superior: Tipo da Série e Botão Excluir */}
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <div className={`h-6 w-6 rounded flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                          set.completed ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                        }`}>
                          {index + 1}
                        </div>
                        <select
                          value={set.type}
                          onChange={(e) => updateSet(set.id, "type", e.target.value)}
                          className="bg-transparent text-xs font-medium text-muted-foreground focus:outline-none w-full"
                        >
                          {SET_TYPES.map(type => <option key={type} value={type} className="bg-card">{type}</option>)}
                        </select>
                      </div>
                      <button
                        onClick={() => removeSet(set.id)}
                        disabled={sets.length <= 1}
                        className="text-muted-foreground hover:text-destructive disabled:opacity-30 p-1 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Linha inferior: Inputs Numéricos e Check */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <label className="text-[10px] uppercase text-muted-foreground absolute -top-2 left-2 bg-card px-1 z-10">Carga</label>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={set.weight}
                          onChange={(e) => updateSet(set.id, "weight", e.target.value)}
                          placeholder="0"
                          className="w-full h-12 bg-secondary border border-border rounded-lg text-center font-mono text-lg font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all relative"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-mono">kg</span>
                      </div>
                      <div className="flex-1 relative">
                        <label className="text-[10px] uppercase text-muted-foreground absolute -top-2 left-2 bg-card px-1 z-10">Reps</label>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={set.reps}
                          onChange={(e) => updateSet(set.id, "reps", e.target.value)}
                          placeholder="0"
                          className="w-full h-12 bg-secondary border border-border rounded-lg text-center font-mono text-lg font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        />
                      </div>
                      <button
                        onClick={() => toggleComplete(set.id)}
                        className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                          set.completed
                            ? "bg-primary text-primary-foreground glow-primary"
                            : "bg-secondary border border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                        }`}
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Set Button */}
              <button
                onClick={addSet}
                disabled={sets.length >= 8}
                className="w-full h-12 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary disabled:opacity-50 disabled:hover:border-border disabled:hover:text-muted-foreground flex items-center justify-center gap-2 transition-all text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                {sets.length >= 8 ? "Limite de 8 Séries Atingido" : "Adicionar Série"}
              </button>
            </div>
          </>
        )}
      </main>

      {/* Fixed Bottom Action (Apenas no modo Treino) */}
      {activeTab === "treino" && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border p-4">
          <div className="container mx-auto">
            <button className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-base flex items-center justify-center gap-2 glow-primary hover:brightness-110 active:scale-[0.98] transition-all">
              Salvar Dados e Próximo Exercício
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showExerciseList || showEquipmentList) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => { setShowExerciseList(false); setShowEquipmentList(false); }}
        />
      )}
    </div>
  );
}
