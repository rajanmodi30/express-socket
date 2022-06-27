import { Request, Router, Response } from "express";
import path from "path";
const webRouter = Router();

webRouter.get("/", (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: "hello world",
  });
});

webRouter.get("/chat", (req: Request, res: Response) => {
  if (process.env.APP_ENV === "production") {
    return res.status(400).json({
      success: false,
    });
  }
  return res.sendFile(path.join(__dirname + "/../views/index.html"));
});

export default webRouter;
