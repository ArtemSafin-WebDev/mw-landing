import home from "./pages-data/home";
import project from "./pages-data/project";
import projects from "./pages-data/projects";
import startProject from "./pages-data/startProject";
import services from "./pages-data/services";

const pagesConfig = {
  ...home,
  ...projects,
  ...project,
  ...startProject,
  ...services,
};

export default pagesConfig;
