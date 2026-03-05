import { useState, useRef, useCallback } from "react";
import { Check, Plus, Search, ChevronDown, Dumbbell, ChevronRight } from "lucide-react";

const EXERCISES = [
  "Supino Reto", "Supino Inclinado", "Supino Declinado",
  "Crucifixo", "Crossover", "Fly na Polia",
  "Tríceps Pulley", "Tríceps Testa", "Tríceps Francês",
  "Tríceps Corda", "Mergulho", "Supino Fechado",
  "Peck Deck", "Chest Press", "Pullover",
];

const EQUIPMENT = [
  "Peso Livre", "Polia Matrix", "Articulada Hammer",
  "Smith Machine", "Cabo / Polia", "Máquina Convergente",
  "Banco Ajustável", "Barra Fixa",
];

interface SetEntry {
  id: number;
  weight: string;
  reps: string;
  completed: boolean;
}

export default function WorkoutLog() {
  const [exerciseQuery, setExerciseQuery] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [showEquipmentList, setShowEquipmentList] = useState(false);
  const [sets, setSets] = useState<SetEntry[]>([
    { id: 1, weight: "", reps: "", completed: false },
    { id: 2, weight: "", reps: "", completed: false },
    { id: 3, weight: "", reps: "", completed: false },
  ]);
  const [nextId, setNextId] = useState(4);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredExercises = EXERCISES.filter((e) =>
    e.toLowerCase().includes(exerciseQuery.toLowerCase())
  );

  const selectExercise = useCallback((name: string) => {
    setSelectedExercise(name);
    setExerciseQuery(name);
    setShowExerciseList(false);
  }, []);

  const updateSet = useCallback((id: number, field: "weight" | "reps", value: string) => {
    // Only allow numeric input
    if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;
    setSets((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }, []);

  const toggleComplete = useCallback((id: number) => {
    setSets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  }, []);

  const addSet = useCallback(() => {
    setSets((prev) => [...prev, { id: nextId, weight: "", reps: "", completed: false }]);
    setNextId((n) => n + 1);
  }, [nextId]);

  const completedCount = sets.filter((s) => s.completed).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Hypertrophy<span className="text-primary">OS</span>
              </h1>
              <p className="text-xs text-muted-foreground">Treino A — Peito e Tríceps</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-2">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-5 pb-28 space-y-5">
        {/* Exercise Selection Card */}
        <div className="rounded-xl bg-card border border-border p-4 space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Exercício
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
              placeholder="Buscar exercício..."
              className="w-full h-12 pl-10 pr-4 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
            />
            {showExerciseList && exerciseQuery.length > 0 && (
              <div className="absolute z-20 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-2xl max-h-48 overflow-y-auto">
                {filteredExercises.length > 0 ? (
                  filteredExercises.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => selectExercise(ex)}
                      className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-surface-elevated transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {ex}
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
              Equipamento / Máquina
            </label>
            <button
              onClick={() => setShowEquipmentList(!showEquipmentList)}
              className="w-full h-12 px-4 bg-secondary border border-border rounded-lg text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <span className={selectedEquipment ? "text-foreground" : "text-muted-foreground"}>
                {selectedEquipment || "Selecionar equipamento..."}
              </span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showEquipmentList ? "rotate-180" : ""}`} />
            </button>
            {showEquipmentList && (
              <div className="absolute z-20 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-2xl max-h-48 overflow-y-auto">
                {EQUIPMENT.map((eq) => (
                  <button
                    key={eq}
                    onClick={() => { setSelectedEquipment(eq); setShowEquipmentList(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-surface-elevated transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {eq}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sets Log */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Séries
            </h2>
            <div className="flex gap-8 pr-14">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Carga</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reps</span>
            </div>
          </div>

          <div className="space-y-2">
            {sets.map((set, index) => (
              <div
                key={set.id}
                className={`flex items-center gap-3 rounded-xl border p-3 transition-all duration-300 ${
                  set.completed
                    ? "bg-primary/5 border-primary/20"
                    : "bg-card border-border"
                }`}
              >
                {/* Set number */}
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-sm font-bold font-mono shrink-0 ${
                  set.completed ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                }`}>
                  {index + 1}
                </div>

                {/* Weight input */}
                <div className="flex-1 relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={set.weight}
                    onChange={(e) => updateSet(set.id, "weight", e.target.value)}
                    placeholder="0"
                    className="w-full h-12 bg-secondary border border-border rounded-lg text-center font-mono text-lg font-bold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-mono">kg</span>
                </div>

                {/* Reps input */}
                <div className="flex-1">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={set.reps}
                    onChange={(e) => updateSet(set.id, "reps", e.target.value)}
                    placeholder="0"
                    className="w-full h-12 bg-secondary border border-border rounded-lg text-center font-mono text-lg font-bold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>

                {/* Complete button */}
                <button
                  onClick={() => toggleComplete(set.id)}
                  className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                    set.completed
                      ? "bg-primary text-primary-foreground glow-primary animate-check-pop"
                      : "bg-secondary border border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  <Check className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Set Button */}
          <button
            onClick={addSet}
            className="w-full h-12 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary flex items-center justify-center gap-2 transition-all text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Adicionar Série
          </button>
        </div>
      </main>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border p-4">
        <div className="container mx-auto">
          <button className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-base flex items-center justify-center gap-2 glow-primary hover:brightness-110 active:scale-[0.98] transition-all">
            Salvar e Próximo Exercício
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

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
