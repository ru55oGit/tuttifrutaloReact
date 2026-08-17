import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Layout from "../components/Layout";
import AdsenseScript from "../components/AdsenseScript";
import { useLanguage } from "../i18n/LanguageContext";

export default function PrivacyPolicy() {
  const { t } = useLanguage();

  return (
    <Layout showFooter>
      <AdsenseScript />
      <Box sx={{ width: "100%", px: 2, pb: 4, color: "#fff" }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, mt: 1 }}>
          {t.privacyTitle}
        </Typography>
        {t.privacyBody.map((paragraph) => (
          <Typography key={paragraph} sx={{ mb: 2, lineHeight: 1.7 }}>
            {paragraph}
          </Typography>
        ))}
      </Box>
    </Layout>
  );
}
