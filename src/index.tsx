import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, ColorModeProvider, Box } from "@chakra-ui/react";

import chakraTheme from "@chakra-ui/theme";

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

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <Box>UXAI Assistant</Box>
      </ColorModeProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);