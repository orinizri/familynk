import { UserRoles } from "@server/types/user.types";
import { Request, Response, NextFunction } from "express";

export const requireRole = (role: UserRoles) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Forbidden" });
    if (req.user?.role !== role)
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
};
export default requireRole;
