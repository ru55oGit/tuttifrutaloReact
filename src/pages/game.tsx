import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import LinearProgress from "@mui/material/LinearProgress";
import ButtonGroup from "@mui/material/ButtonGroup";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Layout from "../components/Layout";
import VirtualKeyboard from "../components/VirtualKeyboard";
import { useLanguage } from "../i18n/LanguageContext";
import { CATEGORIES, Category, isValidAnswer } from "../data/categoryWords";
import { drawRandomLetter, scoreRound, RoundResult, PLAYABLE_LETTERS } from "../utils/tuttiEngine";
import { maybeSaveBestScore } from "../utils/tuttiRecordState";

function playErrorSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } catch { /* audio not supported */ }
}

const ACCENT = "#e74c3c";
const DURATION_OPTIONS = [60, 90];

type Phase = "config" | "playing" | "results";

const emptyAnswers = (): Record<Category, string> =>
  CATEGORIES.reduce((acc, category) => ({ ...acc, [category]: "" }), {} as Record<Category, string>);

export default function Game() {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();

  const [phase, setPhase] = useState<Phase>("config");
  const [duration, setDuration] = useState(60);
  const [selectedLetter, setSelectedLetter] = useState<string>(() => drawRandomLetter());
  const [letter, setLetter] = useState("");
  const [answers, setAnswers] = useState<Record<Category, string>>(emptyAnswers());
  const [timeLeft, setTimeLeft] = useState(duration);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [focusedCategory, setFocusedCategory] = useState<Category | null>(null);
  const [invalidFields, setInvalidFields] = useState<Set<Category>>(new Set());

  const answersRef = useRef(answers);
  answersRef.current = answers;
  const letterRef = useRef(letter);
  letterRef.current = letter;

  useEffect(() => {
    if (phase !== "playing") return;

    const tick = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(tick);
          finishRound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function finishRound() {
    const result = scoreRound(letterRef.current, answersRef.current);
    setRoundResult(result);
    const words = result.results.filter((r) => r.answer).map((r) => r.answer);
    const saved = maybeSaveBestScore(currentLanguage, result.totalScore, letterRef.current, words);
    setIsNewRecord(Boolean(saved));
    setPhase("results");
  }

  function startRound() {
    setLetter(selectedLetter);
    setAnswers(emptyAnswers());
    setTimeLeft(duration);
    setRoundResult(null);
    setIsNewRecord(false);
    setFocusedCategory(null);
    setInvalidFields(new Set());
    setPhase("playing");
  }

  function goToConfig() {
    setSelectedLetter(drawRandomLetter());
    setPhase("config");
  }

  function handleAnswerChange(category: Category, value: string) {
    setAnswers((prev) => ({ ...prev, [category]: value }));
    setInvalidFields((prev) => {
      if (!prev.has(category)) return prev;
      const next = new Set(prev);
      next.delete(category);
      return next;
    });
  }

  function handleChooseLetter(e: SelectChangeEvent) {
    setSelectedLetter(e.target.value);
  }

  function handleFieldBlur(category: Category) {
    setFocusedCategory((prev) => (prev === category ? null : prev));
    const answer = answers[category].trim();
    if (!answer) return;
    if (!isValidAnswer(category, letter, answer)) {
      setInvalidFields((prev) => new Set(prev).add(category));
      playErrorSound();
    }
  }

  function handleVirtualKey(key: string) {
    if (!focusedCategory) return;
    if (key === "⌫") {
      handleAnswerChange(focusedCategory, answers[focusedCategory].slice(0, -1));
    } else {
      handleAnswerChange(focusedCategory, (answers[focusedCategory] + key).toUpperCase());
    }
  }

  if (phase === "config") {
    return (
      <Layout showFooter={false}>
        <Box sx={{ width: "100%", px: { xs: 1.5, md: 2 }, pb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Typography sx={{ fontSize: 13, color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {t.letterInicialLabel}
            </Typography>
            <Box sx={{ px: 4, py: 2, borderRadius: "12px", backgroundColor: `${ACCENT}18`, border: `2px solid ${ACCENT}` }}>
              <Typography sx={{ color: ACCENT, fontWeight: 900, fontSize: 36, fontFamily: "monospace", letterSpacing: 3 }}>
                {selectedLetter}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 14, color: "#666", textAlign: "center" }}>
              {t.idleInstruction}
            </Typography>
          </Box>

          <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 2.5, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
            <Typography sx={{ fontSize: 14, color: "#666", textAlign: "center" }}>
              {t.chooseLetterLabel}
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={selectedLetter}
                onChange={handleChooseLetter}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  color: ACCENT,
                }}
              >
                {PLAYABLE_LETTERS.map((l) => (
                  <MenuItem key={l} value={l}>{l}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 2.5, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
            <Typography sx={{ fontSize: 14, color: "#666", textAlign: "center" }}>
              {t.durationTitle}
            </Typography>
            <ButtonGroup variant="contained" sx={{ boxShadow: "none" }}>
              {DURATION_OPTIONS.map((opt) => (
                <Button
                  key={opt}
                  onClick={() => setDuration(opt)}
                  sx={{
                    backgroundColor: duration === opt ? ACCENT : "#fff",
                    color: duration === opt ? "#fff" : ACCENT,
                    fontWeight: 800,
                    fontSize: 16,
                    px: 3,
                    py: 1,
                    border: `2px solid ${ACCENT}`,
                    "&:hover": { backgroundColor: duration === opt ? ACCENT : "#fff5f3" },
                  }}
                >
                  {opt} {t.durationLabel}
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          <Box sx={{ borderRadius: "16px", backgroundColor: "rgba(255,255,255,0.14)", p: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
            <Typography sx={{ fontSize: 13, color: "#fff", fontWeight: 700, textAlign: "center" }}>
              {t.scoringTitle}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.85)", textAlign: "center", lineHeight: 1.5 }}>
              {t.scoringExplanation}
            </Typography>
          </Box>

          <Button
            onClick={startRound}
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#f3f3f3",
              color: ACCENT,
              fontWeight: 800,
              fontSize: 20,
              py: 1.8,
              borderRadius: 999,
              textTransform: "none",
              "&:hover": { backgroundColor: "#fff" },
            }}
          >
            {t.startButton}
          </Button>
        </Box>
      </Layout>
    );
  }

  if (phase === "results" && roundResult) {
    return (
      <Layout showFooter={false}>
        <Box sx={{ width: "100%", px: { xs: 1.5, md: 2 }, pb: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 24, textAlign: "center", mt: 1 }}>{t.resultsTitle}</Typography>

          <Box sx={{ backgroundColor: "#fff", borderRadius: "16px", p: 2, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Typography sx={{ fontSize: 14, color: "#888", fontWeight: 700, textTransform: "uppercase" }}>{t.totalScoreLabel}</Typography>
            <Typography sx={{ fontSize: 48, fontWeight: 800, color: ACCENT, lineHeight: 1 }}>{roundResult.totalScore}</Typography>
            {isNewRecord && <Typography sx={{ fontSize: 14, color: "#22c55e", fontWeight: 800, mt: 0.5 }}>🏆 {t.recordTitle}!</Typography>}
          </Box>

          <Box sx={{ backgroundColor: "#f3f3f3", borderRadius: "16px", p: 1.75, display: "flex", flexDirection: "column", gap: 1 }}>
            {roundResult.results.map((r) => {
              const color = r.status === "valid" ? "#22c55e" : r.status === "invalid" ? "#ef4444" : "#999";
              const statusLabel = r.status === "valid" ? t.validLabel : r.status === "invalid" ? t.invalidLabel : t.emptyLabel;
              return (
                <Box
                  key={r.category}
                  sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, backgroundColor: "#fff", borderRadius: 2, px: 1.5, py: 1, border: `2px solid ${color}` }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 11, color: "#888", fontWeight: 700, textTransform: "uppercase" }}>{t.categoryLabels[r.category]}</Typography>
                    <Typography sx={{ fontSize: 15, color: "#222", fontWeight: 700 }}>{r.answer || "—"}</Typography>
                    {/* Desactivado a pedido del usuario: en "Cosa" el diccionario genérico
                        trae verbos conjugados como ejemplo ("mojare", "moldeases"), lo cual
                        queda raro. Descomentar si se filtra el diccionario o se limita a
                        otras categorías.
                    <Typography sx={{ fontSize: 12, color: "#999" }}>{t.alternativesLabel(r.alternativesCount)}</Typography>
                    {r.sampleAlternatives.length > 0 && (
                      <Typography sx={{ fontSize: 12, color: "#999", fontStyle: "italic" }}>
                        {t.sampleAlternativesLabel(r.sampleAlternatives)}
                      </Typography>
                    )}
                    */}
                  </Box>
                  <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 800, color }}>{statusLabel}</Typography>
                    <Typography sx={{ fontSize: 16, fontWeight: 800, color }}>+{r.points}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Button
            onClick={goToConfig}
            variant="contained"
            sx={{ backgroundColor: "#fff", color: ACCENT, fontWeight: 800, fontSize: 18, py: 1.4, borderRadius: 999, textTransform: "none" }}
          >
            {t.playAgainButton}
          </Button>
          <Button onClick={() => navigate("/")} sx={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>
            {t.backToHomeButton}
          </Button>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <Box sx={{ width: "100%", px: { xs: 1.5, md: 2 }, pb: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              flexShrink: 0,
              borderRadius: "50%",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 800,
              color: ACCENT,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            {letter}
          </Box>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={(timeLeft / duration) * 100}
              color={timeLeft <= 10 ? "error" : "primary"}
              sx={{ height: 10, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.3)" }}
            />
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 14, mt: 0.5, textAlign: "right" }}>{timeLeft}s</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pb: 8 }}>
          {CATEGORIES.map((category) => {
            const isInvalid = invalidFields.has(category);
            return (
              <Box
                key={category}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  border: `2px solid ${isInvalid ? "#ef4444" : "transparent"}`,
                  "&:focus-within": { borderColor: ACCENT },
                }}
              >
                <Typography
                  sx={{
                    width: 108,
                    flexShrink: 0,
                    px: 1.5,
                    py: 1.5,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#888",
                    borderRight: "1px solid #f0f0f0",
                  }}
                >
                  {t.categoryLabels[category]}
                </Typography>
                <InputBase
                  value={answers[category]}
                  onChange={(e) => handleAnswerChange(category, e.target.value.toUpperCase())}
                  onFocus={() => setFocusedCategory(category)}
                  onBlur={() => handleFieldBlur(category)}
                  autoComplete="off"
                  sx={{ flex: 1, px: 1.5, py: 1.5, fontSize: 16, fontWeight: 700, color: isInvalid ? "#ef4444" : ACCENT }}
                />
              </Box>
            );
          })}
        </Box>

        <Button
          onClick={finishRound}
          variant="contained"
          sx={{
            backgroundColor: "#fff",
            color: ACCENT,
            fontWeight: 800,
            fontSize: 20,
            py: 1.4,
            borderRadius: 999,
            textTransform: "none",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            "&:hover": { backgroundColor: "#fff5f3" },
          }}
        >
          {t.bastaButton}
        </Button>
      </Box>

      <VirtualKeyboard onKey={handleVirtualKey} />
    </Layout>
  );
}
