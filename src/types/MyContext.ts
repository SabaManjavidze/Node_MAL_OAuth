import { Request, Response } from "express";
import { createMangaLoader } from "../utils/MangaLoader";

export interface MyContext {
  req: Request;
  res: Response;
  mangaLoader: ReturnType<typeof createMangaLoader>;
  // mangaLoader: typeof createMangaLoader;
}
