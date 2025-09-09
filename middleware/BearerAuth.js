// Enhanced Bearer Token Authentication Middleware
import jwt from "jsonwebtoken";
import { decryptData } from "./Decrypt.js";

// Enhanced Bearer Token Verification with Role-Based Access
export const verifyBearerToken = (requiredRoles = []) => {
  return (req, res, next) => {
    try {
      console.log(`=== BEARER AUTH DEBUG START ===`);
      console.log(`Request URL: ${req.method} ${req.originalUrl}`);
      console.log(`Required roles: ${JSON.stringify(requiredRoles)}`);
      
      const authHeader = req.headers["authorization"];
      console.log(`Authorization header: ${authHeader ? 'Present' : 'Missing'}`);
      
      // Check if Authorization header exists
      if (!authHeader) {
        console.log(`ERROR: Authorization header missing`);
        return res.status(401).json({
          success: false,
          error: "Authorization header missing",
          code: "NO_AUTH_HEADER"
        });
      }

      // Check if Bearer scheme is used
      if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          error: "Invalid authorization scheme. Use Bearer token",
          code: "INVALID_AUTH_SCHEME"
        });
      }

      // Extract token
      const token = authHeader.split(" ")[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: "Bearer token missing",
          code: "NO_TOKEN"
        });
      }      try {
        // Decrypt and verify token
        console.log(`Attempting to decrypt token...`);
        const decryptedToken = decryptData(token).replace(/"/g, "");
        console.log(`Token decrypted successfully`);
        
        jwt.verify(decryptedToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
          if (err) {
            console.log(`JWT Verification Error: ${err.name} - ${err.message}`);
            if (err.name === 'TokenExpiredError') {
              return res.status(401).json({
                success: false,
                error: "Token expired",
                code: "TOKEN_EXPIRED"
              });
            } else if (err.name === 'JsonWebTokenError') {
              return res.status(401).json({
                success: false,
                error: "Invalid token",
                code: "INVALID_TOKEN"
              });
            } else {
              return res.status(401).json({
                success: false,
                error: "Token verification failed",
                code: "VERIFICATION_FAILED"
              });
            }
          }          // Check if user role is authorized for this action
          if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
            console.log(`AUTHORIZATION FAILED: User role '${decoded.role}' not in required roles: ${JSON.stringify(requiredRoles)}`);
            return res.status(403).json({
              success: false,
              error: "Insufficient permissions for this action",
              code: "INSUFFICIENT_PERMISSIONS",
              requiredRoles: requiredRoles,
              userRole: decoded.role
            });
          }

          console.log(`AUTHORIZATION SUCCESS: User '${decoded.username}' (${decoded.role}) authorized`);
          console.log(`=== BEARER AUTH DEBUG END ===`);

          // Attach user data to request
          req.user = {
            username: decoded.username,
            name: decoded.name,
            role: decoded.role,
            userId: decoded.userId,
            kdkanwil: decoded.kdkanwil,
            kdkppn: decoded.kdkppn,
            kdlokasi: decoded.kdlokasi
          };

          next();
        });
      } catch (decryptError) {
        return res.status(401).json({
          success: false,
          error: "Token decryption failed",
          code: "DECRYPT_FAILED"
        });
      }
    } catch (error) {
      console.error("Bearer Auth Error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error during authentication",
        code: "INTERNAL_ERROR"
      });
    }
  };
};

// Middleware specifically for SuperAdmin role
export const verifySuperAdmin = verifyBearerToken(["X"]);

// Middleware for Admin roles (SuperAdmin + Admin Pusat)
export const verifyAdmin = verifyBearerToken(["X", "0"]);

// Middleware for management roles (SuperAdmin + Admin Pusat + Kantor Pusat)
export const verifyManagement = verifyBearerToken(["X", "0", "1"]);

// General authentication (any valid user)
export const verifyAuth = verifyBearerToken([]);

// Error handler for Bearer token errors
export const bearerErrorHandler = (err, req, res, next) => {
  console.error("Bearer Auth Error:", err);
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: "Token expired",
      code: "TOKEN_EXPIRED"
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
      code: "INVALID_TOKEN"
    });
  }
  
  res.status(500).json({
    success: false,
    error: "Internal server error",
    code: "INTERNAL_ERROR"
  });
};

export default { 
  verifyBearerToken, 
  verifySuperAdmin, 
  verifyAdmin, 
  verifyManagement, 
  verifyAuth, 
  bearerErrorHandler 
};
