import jwt from "jsonwebtoken";

// ===== Verify Token =====
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded should include id, username, isAdmin
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ===== Verify Token & Admin =====
export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user?.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action!" });
    }
  });
};

// ===== Verify Token & Authorization (Same user or Admin) =====
export const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user?.id === req.params.id || req.user?.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action!" });
    }
  });
};


