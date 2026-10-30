import { useState } from "react";
import Box from "@mui/material/Box";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import KeyboardHideRoundedIcon from "@mui/icons-material/KeyboardHideRounded";
import { useLanguage } from "../../i18n/LanguageContext";
import HouseAdBanner from "../../ads/HouseAdBanner";

const ACCENT = "#e74c3c";

// Mismo diseño que enroscaloReact/enganchadoReact/VirtualKeyboard (copiado y
// adaptado acá, no es un paquete compartido — ver convención del hub).
const ROW_1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const ES_ROW_2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"];
const LATIN_ROW_2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const ROW_3 = ["Z", "X", "C", "V", "B", "N", "M"];
const ACCENTED_VOWEL: Record<string, string> = { A: "Á", E: "É", I: "Í", O: "Ó", U: "Ú" };
const IS_VOWEL = (letter: string) => letter in ACCENTED_VOWEL;

// pt no tiene una palabra objetivo fija contra la cual chequear si hace
// falta algún acento (acá se escribe cualquier respuesta libre, igual que
// en enganchadoReact) — estas dos filas van siempre visibles en pt.
const PT_ACCENT_ROWS = [
  ["Á", "À", "Â", "Ã", "É", "Ê"],
  ["Í", "Ó", "Ô", "Õ", "Ú", "Ç"],
];

interface Props {
  onKey: (key: string) => void;
  soundEnabled?: boolean;
  onSoundToggle?: () => void;
  // Cierra el teclado — ocupa el lugar donde en es va la tecla de acento,
  // ya que en/pt no la necesitan (mismo criterio que el resto del hub).
  onClose?: () => void;
  // Arranca cerrado (muestra un banner en su lugar) hasta que el juego pide
  // abrirlo — se abre cuando tocan un casillero de respuesta.
  open?: boolean;
  gameSlug?: string;
}

const keyButtonSx = (variant: "default" | "action") => ({
  flex: 1,
  minWidth: 0,
  height: 42,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "6px",
  fontSize: 15,
  fontWeight: 700,
  color: "#fff",
  cursor: "pointer",
  userSelect: "none" as const,
  WebkitUserSelect: "none" as const,
  transition: "opacity 0.1s",
  "&:active": { opacity: 0.6 },
  ...(variant === "default" && { backgroundColor: "#3a3a3c" }),
  ...(variant === "action" && { fontSize: 13, gap: "4px" }),
});

export default function VirtualKeyboard({
  onKey,
  soundEnabled = true,
  onSoundToggle,
  onClose,
  open = true,
  gameSlug = "tuttifrutalo",
}: Props) {
  const { currentLanguage } = useLanguage();
  const [accentActive, setAccentActive] = useState(false);

  const isEs = currentLanguage === "es";
  const isPt = currentLanguage === "pt";
  const row2 = isEs ? ES_ROW_2 : LATIN_ROW_2;

  const handleLetterClick = (letter: string) => {
    const display = isEs && accentActive && IS_VOWEL(letter) ? ACCENTED_VOWEL[letter] : letter;
    onKey(display);
    // Tecla muerta: se desactiva apenas se toca cualquier letra, vocal o no.
    if (isEs) setAccentActive(false);
  };

  const handleSoundButton = (target: boolean) => {
    if (target !== soundEnabled) onSoundToggle?.();
  };

  const renderLetterKey = (letter: string) => {
    const display = isEs && accentActive && IS_VOWEL(letter) ? ACCENTED_VOWEL[letter] : letter;
    return (
      <Box
        key={letter}
        onPointerDown={(e) => {
          e.preventDefault();
          handleLetterClick(letter);
        }}
        sx={keyButtonSx("default")}
      >
        {display}
      </Box>
    );
  };

  const renderPtAccentRows = () => (
    <>
      {PT_ACCENT_ROWS.map((row, rowIndex) => (
        <Box key={`pt-accent-${rowIndex}`} sx={{ display: "flex", justifyContent: "center", gap: "4px" }}>
          {row.map((char) => (
            <Box
              key={char}
              onPointerDown={(e) => {
                e.preventDefault();
                onKey(char);
              }}
              sx={keyButtonSx("default")}
            >
              {char}
            </Box>
          ))}
        </Box>
      ))}
    </>
  );

  return (
    <Box
      sx={{
        display: { md: "none", xs: "block" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        backgroundColor: "#1c1c1e",
        borderTop: `2px solid ${ACCENT}`,
        zIndex: 9999,
        pt: "6px",
        pb: "10px",
        px: "4px",
      }}
    >
      {!open && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 0.5 }}>
          <HouseAdBanner slot={`${gameSlug}-keyboard-banner`} gameSlug={gameSlug} locale={currentLanguage} />
        </Box>
      )}
      {open && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {isPt && renderPtAccentRows()}
          <Box sx={{ display: "flex", justifyContent: "center", gap: "4px" }}>
            {ROW_1.map((letter) => renderLetterKey(letter))}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", gap: "4px" }}>
            {row2.map((letter) => renderLetterKey(letter))}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", gap: "4px" }}>
            {isEs ? (
              <Box
                onPointerDown={(e) => {
                  e.preventDefault();
                  setAccentActive((prev) => !prev);
                }}
                sx={{
                  ...keyButtonSx("default"),
                  flex: 1.5,
                  fontSize: 18,
                  fontWeight: 800,
                  backgroundColor: accentActive ? "#f0b429" : "#3a3a3c",
                  color: accentActive ? "#1a1a1a" : "#fff",
                }}
              >
                ´
              </Box>
            ) : (
              <Box
                onPointerDown={(e) => {
                  e.preventDefault();
                  onClose?.();
                }}
                aria-label="Cerrar teclado"
                sx={{ ...keyButtonSx("default"), flex: 1.5, backgroundColor: ACCENT }}
              >
                <KeyboardHideRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
            )}
            {ROW_3.map((letter) => renderLetterKey(letter))}
            <Box
              onPointerDown={(e) => {
                e.preventDefault();
                onKey("⌫");
              }}
              aria-label="Borrar"
              sx={{ ...keyButtonSx("default"), flex: 1.5, fontSize: 18, backgroundColor: ACCENT }}
            >
              ⌫
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", gap: "4px" }}>
            <Box
              onPointerDown={(e) => {
                e.preventDefault();
                handleSoundButton(true);
              }}
              sx={{
                ...keyButtonSx("action"),
                height: 38,
                backgroundColor: soundEnabled ? "#2ecc71" : "#2c2c2e",
              }}
            >
              <VolumeUpRoundedIcon sx={{ fontSize: 16 }} />
              On
            </Box>
            <Box
              onPointerDown={(e) => {
                e.preventDefault();
                handleSoundButton(false);
              }}
              sx={{
                ...keyButtonSx("action"),
                height: 38,
                backgroundColor: !soundEnabled ? ACCENT : "#2c2c2e",
              }}
            >
              <VolumeOffRoundedIcon sx={{ fontSize: 16 }} />
              Off
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
