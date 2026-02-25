import home from "./pages-data/home";
import project from "./pages-data/project";
import projects from "./pages-data/projects";
import startProject from "./pages-data/startProject";
import services from "./pages-data/services";
import service from "./pages-data/service";


type PagesConfig = {
    [key: string]: Object
};

const pagesConfig: PagesConfig = {
  ...home,
  ...projects,
  ...project,
  ...startProject,
  ...services,
  ...service,
};

export default pagesConfig;
