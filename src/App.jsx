import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import "./App.css";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <MainPage />
      </div>
    </QueryClientProvider>
  );
}

export default App;
