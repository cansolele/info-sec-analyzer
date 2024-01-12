import MainPage from "./components/MainPage/MainPage";
import ExploitsTable from "./components/Tools/ExploitsTable/ExploitsTable";
import VulnerabilityAnalyzer from "./components/Tools/VulnerabilityAnalyzer/VulnerabilityAnalyzer";
import UpdatesAnalyzer from "./components/Tools/UpdatesAnalyzer/UpdatesAnalyzer";

const routes = [
  { path: "/", component: MainPage },
  { path: "/exploits-table", component: ExploitsTable },
  { path: "/vulnerability-analyzer", component: VulnerabilityAnalyzer },
  { path: "/updates-analyzer", component: UpdatesAnalyzer },
];

export default routes;
