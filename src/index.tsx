import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, ColorModeProvider, Box } from "@chakra-ui/react";

import { Chat } from "./components";

import chakraTheme from "@chakra-ui/theme";

import "./index.css";
import { Navbar } from "components/navbar";
import { App } from "navigation";

const theme = {
  ...chakraTheme,
  colors: {
    ...chakraTheme.colors,
    brand: {
      50: "#ecefff",
      100: "#cbceeb",
      200: "#a9aed6",
      300: "#888ec3",
      400: "#666db0",
      500: "#4d5496",
      600: "#3c4178",
      700: "#2a2f5a",
      800: "#181c3c",
      900: "#08091e",
    },
  },
};

const rootElement = document.getElementById("root") as HTMLElement;

createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <Navbar />
        <App/>
      </ColorModeProvider>
    </ThemeProvider>
  </React.StrictMode>
);