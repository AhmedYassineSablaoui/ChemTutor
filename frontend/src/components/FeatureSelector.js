import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const features = [
  { name: "Reaction Formatter ⚗️", path: "/formatter", desc: "Format and balance chemical reactions" },
  { name: "Q&A ❓", path: "/qa", desc: "Ask questions and get answers instantly" },
  { name: "Correction ✍️", path: "/correction", desc: "Check and correct your chemical formulas" },
];

const FeatureSelector = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "2rem",
        marginTop: "4rem",
      }}
    >
      {features.map((feature, index) => (
        <Card
          key={index}
          sx={{
            width: 250,
            textAlign: "center",
            borderRadius: 3,
            boxShadow: 3,
            "&:hover": { boxShadow: 8, transform: "scale(1.05)" },
            transition: "all 0.3s ease-in-out",
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {feature.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {feature.desc}
            </Typography>
            <Button
              component={Link}
              to={feature.path}
              variant="contained"
              sx={{ marginTop: 2 }}
            >
              Go 🚀
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeatureSelector;
