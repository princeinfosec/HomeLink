import App from "./App";
import { AppProvider } from "./context/AppContext";

export default function HomeLinkApp() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
