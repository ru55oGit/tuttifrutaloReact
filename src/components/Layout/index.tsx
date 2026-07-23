import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const RAIN_EMOJIS = ["🍎", "🌈", "🐶", "🌍", "👤", "💼", "🧦", "🎲", "⏱️", "✅"];

const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const showHeader = location.pathname !== "/";
  const canvasRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const isGameRoute = location.pathname === "/game";

  const handleMenuNavigation = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function spawnEmoji() {
      if (!canvas) return;
      const el = document.createElement("div");
      el.className = "rain-emoji";
      el.textContent = RAIN_EMOJIS[Math.floor(Math.random() * RAIN_EMOJIS.length)];
      const left = Math.random() * 100;
      const dur = 5 + Math.random() * 8;
      const size = 1.2 + Math.random() * 1.8;
      const delay = Math.random() * -dur;
      el.style.cssText = `left: ${left}%; font-size: ${size}rem; animation-duration: ${dur}s; animation-delay: ${delay}s;`;
      canvas.appendChild(el);
      setTimeout(
        () => {
          if (el.parentNode) el.parentNode.removeChild(el);
        },
        (dur + Math.abs(delay)) * 1000,
      );
    }

    intervalRef.current = setInterval(spawnEmoji, 300);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (canvas) canvas.innerHTML = "";
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(#a34747, #F44336)",
        alignItems: "center",
        width: { md: "480px", xs: "100%" },
        margin: "0 auto",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
        pb: 2,
      }}
    >
      <Box
        ref={canvasRef}
        id="bg-canvas"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          "& .rain-emoji": {
            position: "absolute",
            top: "-50px",
            animation: "fall linear infinite",
            userSelect: "none",
            pointerEvents: "none",
            opacity: 0.7,
          },
          "@keyframes fall": {
            "0%": { transform: "translateY(-100px) rotate(0deg)", opacity: 0 },
            "10%": { opacity: 0.7 },
            "90%": { opacity: 0.7 },
            "100%": { transform: "translateY(100vh) rotate(360deg)", opacity: 0 },
          },
        }}
      />

      {showHeader && (
        <Box
          component="header"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 80,
            px: 2,
            borderBottom: "2px solid #e74c3c",
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            width: "100%",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Box
            sx={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 3, cursor: "pointer" }}
            onClick={() => (isGameRoute ? navigate(-1) : setMenuOpen(true))}
            aria-label={isGameRoute ? "Volver" : "Menú"}
          >
            {isGameRoute ? (
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26 6L14 19L26 32" stroke="#e74c3c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="8" width="38" height="4" rx="2" fill="#e74c3c" />
                <rect y="17" width="38" height="4" rx="2" fill="#e74c3c" />
                <rect y="26" width="38" height="4" rx="2" fill="#e74c3c" />
              </svg>
            )}
          </Box>
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "Lobster, cursive",
              fontSize: 32,
              color: "#e74c3c",
              letterSpacing: 1,
              cursor: "pointer",
              zIndex: 2,
              width: "max-content",
            }}
            onClick={() => navigate("/")}
          >
            {t.appName}
          </Box>
        </Box>
      )}

      <Container
        disableGutters
        sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", mt: 2, px: 0, position: "relative", zIndex: 5 }}
      >
        {children}
      </Container>

      {showFooter && (
        <Box component="footer" sx={{ py: 2, textAlign: "center", fontSize: 14, color: "rgba(255,255,255,0.8)", position: "relative", zIndex: 5 }}>
          © {new Date().getFullYear()} {t.appName} ·{" "}
          <Box component="span" sx={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigate("/privacidad")}>
            {t.privacyPolicyLabel}
          </Box>
        </Box>
      )}

      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        PaperProps={{ sx: { width: 280, background: "linear-gradient(180deg, #c0392b 0%, #e74c3c 100%)" } }}
      >
        <Box sx={{ pt: 4, pb: 2 }}>
          <Box sx={{ textAlign: "center", fontFamily: "Lobster, cursive", fontSize: 32, color: "#fff", mb: 3, px: 2 }}>{t.appName}</Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuNavigation("/")}
                sx={{ px: 3, py: 2, backgroundColor: "#fff", borderBottom: "1px solid #e0e0e0", "&:hover": { backgroundColor: "#f5f5f5" } }}
              >
                <ListItemText primary={t.home} primaryTypographyProps={{ fontSize: 22, fontWeight: 500, color: "#e74c3c" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuNavigation("/game")}
                sx={{ px: 3, py: 2, backgroundColor: "#fff", borderBottom: "1px solid #e0e0e0", "&:hover": { backgroundColor: "#f5f5f5" } }}
              >
                <ListItemText primary={t.playMenu} primaryTypographyProps={{ fontSize: 22, fontWeight: 500, color: "#e74c3c" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuNavigation("/privacidad")}
                sx={{ px: 3, py: 2, backgroundColor: "#fff", "&:hover": { backgroundColor: "#f5f5f5" } }}
              >
                <ListItemText primary={t.privacyPolicyLabel} primaryTypographyProps={{ fontSize: 22, fontWeight: 500, color: "#e74c3c" }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Layout;
