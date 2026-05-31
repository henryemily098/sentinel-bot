import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  BrowserRouter
} from "react-router";
import {
  ColorModeProvider
} from "./components/ui/color-mode";
import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe
} from "@chakra-ui/react";
import {
  HelmetProvider
} from "@dr.pogodin/react-helmet";

const headingRecipe = defineRecipe({
  base: {
    fontFamily: '"Montserrat", sans-serif',
    fontOpticalSizing: "auto",
    fontWeight: "bold",
    fontStyle: "normal"
  }
});
const config = defineConfig({
  theme: {
    recipes: {
      heading: headingRecipe
    }
  },
  globalCss: {
    "html, body": {
      fontFamily: '"Montserrat", sans-serif',
      fontOpticalSizing: "auto",
      fontWeight: 300, 
      fontStyle: "normal",
      _dark: {
        bg: "linear-gradient(90deg, rgba(2, 1, 8, 1) 0%, rgba(8, 7, 26, 1) 50%, rgba(2, 1, 8, 1) 100%)",
        bgColor: "#020108"
      }
    }
  },
});

const system = createSystem(defaultConfig, config);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <HelmetProvider>
        <BrowserRouter>
          <ColorModeProvider forcedTheme="dark">
            <App />
          </ColorModeProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ChakraProvider>
  </React.StrictMode>
);
