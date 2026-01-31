import app from "./app";
import cors from "cors";
import { pool } from "./db/index";

const PORT = process.env.PORT || 3000;
app.use(cors());
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

