import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import Layout from "../components/Layout";
import { useLanguage } from "../i18n/LanguageContext";
import { getBestScore, BestScore } from "../utils/tuttiRecordState";
import { getDaysSinceLastPlayed } from "../utils/lastPlayedState";
import { Category } from "../data/categoryWords";

const ACCENT = "#e74c3c";
const CARD_BG = "#eb6f62";

const EXAMPLE_LETTER = "V";
const EXAMPLE_ENTRIES: { category: Category; answer: string }[] = [
  { category: "pais", answer: "Venezuela" },
  { category: "animal", answer: "Vaca" },
  { category: "color", answer: "Verde" },
];

export default function Home() {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const [record, setRecord] = useState<BestScore | null>(null);

  useEffect(() => {
    const readRecord = () => setRecord(getBestScore(currentLanguage));
    readRecord();
    window.addEventListener("focus", readRecord);
    return () => window.removeEventListener("focus", readRecord);
  }, [currentLanguage]);

  const daysSincePlayed = getDaysSinceLastPlayed();
  const nowHour = new Date().getHours();
  const timeGreeting = nowHour < 12 ? t.greetingMorning : nowHour < 20 ? t.greetingAfternoon : t.greetingEvening;
  const greeting =
    daysSincePlayed != null && daysSincePlayed > 1
      ? `${timeGreeting}, ${t.daysWithoutPlayingMessage(daysSincePlayed)}.`
      : timeGreeting;

  return (
    <Layout showFooter>
      <Box sx={{ width: "100%", px: { xs: 1.5, md: 2 }, pb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography
            variant="h2"
            sx={{ color: "#fff", fontWeight: 700, letterSpacing: "1px", fontFamily: "Lobster, cursive", textAlign: "center", width: "100%" }}
          >
            {t.appName}
          </Typography>

          <Typography
            variant="h6"
            sx={{ color: "rgba(255,255,255,0.64)", fontStyle: "italic", letterSpacing: "2px", textAlign: "center", fontSize: { xs: 18, md: 22 } }}
          >
            {t.tagline}
          </Typography>
        </Box>

        <Typography sx={{ color: "#ffe6e6", fontSize: 18, fontWeight: 600 }}>{greeting}</Typography>

        <Typography sx={{ color: "#fff", fontSize: 24, fontWeight: 700, lineHeight: 1.4 }}>{t.readyToPlay}</Typography>

        {/* Card principal */}
        <Box sx={{ width: "100%", borderRadius: "24px", backgroundColor: CARD_BG, p: 2, display: "flex", flexDirection: "column", gap: 2, boxShadow: "0 12px 24px rgba(0,0,0,0.18)" }}>
          {/* Preview de ronda */}
          <Box sx={{
            width: "100%", aspectRatio: "1", borderRadius: "16px", backgroundColor: "#f3f3f3",
            p: 1.25, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly", gap: 1.5,
          }}>
            <Typography sx={{ fontSize: 13, color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {t.exampleRoundLabel}
            </Typography>
            <Box sx={{
              width: 52, height: 52, borderRadius: "50%", backgroundColor: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, fontWeight: 800, color: ACCENT, fontFamily: "monospace",
              border: `2px solid ${ACCENT}`, boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}>
              {EXAMPLE_LETTER}
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
              {EXAMPLE_ENTRIES.map(({ category, answer }) => (
                <Box
                  key={category}
                  sx={{ display: "flex", alignItems: "center", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden" }}
                >
                  <Typography sx={{ fontSize: 10, color: "#888", fontWeight: 700, textTransform: "uppercase", px: 1, py: 0.75, borderRight: "1px solid #f0f0f0", whiteSpace: "nowrap" }}>
                    {t.categoryLabels[category]}
                  </Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 800, color: ACCENT, px: 1, fontFamily: "monospace" }}>
                    {answer}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Typography sx={{ fontSize: 12, color: "#999", textAlign: "center" }}>
              {t.exampleRoundExplanation}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={() => navigate("/game")}
              startIcon={<PlayArrowRoundedIcon sx={{ fontSize: "28px !important" }} />}
              sx={{
                backgroundColor: "#fff",
                color: ACCENT,
                fontWeight: 800,
                borderRadius: 999,
                px: 3,
                py: 1.4,
                fontSize: 18,
                textTransform: "none",
                boxShadow: "0 0 0 4px rgba(255,255,255,0.35), 0 10px 24px rgba(0,0,0,0.4)",
                "&:hover": { backgroundColor: "#fff", boxShadow: "0 0 0 4px rgba(255,255,255,0.5), 0 12px 26px rgba(0,0,0,0.45)" },
              }}
            >
              {t.playButton}
            </Button>
          </Box>
        </Box>

        {/* Récord */}
        {record && (
          <Box sx={{ borderRadius: "16px", backgroundColor: "#fff", p: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <Typography sx={{ fontSize: 28, fontWeight: 800, color: "#222", mb: 0.5 }}>{t.recordTitle}</Typography>
            <Typography sx={{ fontSize: 15, color: "#666" }}>{t.recordBody(record.score, record.letter)}</Typography>
            {record.words.length > 0 && (
              <>
                <Typography sx={{ fontSize: 12, color: "#888", fontWeight: 700, textTransform: "uppercase", mt: 1.5, mb: 0.75 }}>
                  {t.recordWordsLabel}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {record.words.map((word, i) => (
                    <Box
                      key={i}
                      sx={{ px: 1.5, py: 0.5, borderRadius: "6px", backgroundColor: `${ACCENT}18`, border: `1px solid ${ACCENT}55` }}
                    >
                      <Typography sx={{ color: ACCENT, fontFamily: "monospace", fontSize: 13, fontWeight: 700 }}>
                        {word}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Box>
        )}

        {/* Qué es */}
        <Box component="section" sx={{ backgroundColor: "rgba(0,0,0,0.18)", borderRadius: "24px", px: 2, py: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#fff", mb: 1 }}>
            {t.whatIsTitle}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>{t.whatIsBody}</Typography>
        </Box>

        {/* Cómo jugar */}
        <Box component="section" sx={{ backgroundColor: "rgba(0,0,0,0.18)", borderRadius: "24px", px: 2, py: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#fff", mb: 1 }}>
            {t.howToPlayTitle}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>{t.howToPlayBody}</Typography>
        </Box>
      </Box>
    </Layout>
  );
}
