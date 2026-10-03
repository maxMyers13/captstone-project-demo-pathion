import * as projects from "./projects";
import * as contact from "./contact";

type RouteModule = {
  GET?: (request: Request) => Response | Promise<Response>;
  POST?: (request: Request) => Response | Promise<Response>;
};

declare global {
  interface Window {
    __liloRoutes: Record<string, RouteModule>;
  }
}

// A path maps to a module whose exports are named for HTTP methods.
export const routes: Record<string, RouteModule> = {
  "/api/projects": projects,
  "/api/contact": contact,
};

window.__liloRoutes = routes;
