import express from 'express';
const app = express();
const env = process.env;
const PORT = env.PORT || 8080;
import * as db from "./src/config/db/initialData.js";
db.createInitialData()
app.get("/api/status", (req, res) => {
  return res.status(200).json({
    service: "Auth-API",
    status:"up",
    httpStatus:200
  });
})
app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`);
});