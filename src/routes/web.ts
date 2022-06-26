import { Request, Router, Response } from "express";
import path from "path";
const webRouter = Router();

webRouter.get("/chat", (req: Request, res: Response) => {
  if (process.env.APP_ENV === "production") {
    return res.json({
      success: false,
    });
  }
  return res.sendFile(path.join(__dirname + "/../views/index.html"));
});

webRouter.get("/ping", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "pong",
  });
});

export default webRouter;
