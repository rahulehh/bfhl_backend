import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { fileTypeFromBuffer } from "file-type";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.post("/bfhl", async (req, res) => {
  try {
    const data = req.body.data;
    const base64String = req.body.file_b64;

    console.log({ data, base64String });

    async function getMimeTypeFromBase64(base64String) {
      if (base64String) {
        const buffer = Buffer.from(base64String, "base64");
        const { mime: mimeType } = await fileTypeFromBuffer(buffer);
        const fileSizeKb = Math.round(buffer.length / 1024);
        console.log({ mimeType, fileSizeKb });
        return { mimeType, fileSizeKb };
      }
    }

    if (base64String) {
      var { mimeType, fileSizeKb } = await getMimeTypeFromBase64(base64String);
    }
    console.log({ mimeType, fileSizeKb });

    let numbers = [];
    let alphabets = [];
    let highestLowerCase = null;

    data.forEach((item) => {
      if (!isNaN(item)) {
        numbers.push(item);
      } else if (typeof item === "string") {
        alphabets.push(item);
        if (
          item === item.toLowerCase() &&
          (!highestLowerCase || item > highestLowerCase)
        ) {
          highestLowerCase = item;
        }
      }
    });

    const response = {
      is_success: true,
      user_id: "rahul_s_20080023",
      email: "rs6867@srmist.edu.in",
      roll_number: "RA2111026050031",
      numbers: numbers,
      alphabets: alphabets,
      highest_lowercase_alphabet: highestLowerCase ? [highestLowerCase] : [],
      file_valid: false
    };

    if (mimeType && fileSizeKb) {
      response.file_valid = true;
      response.file_size_kb = fileSizeKb;
      response.file_type = mimeType;
    }

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(200).json({
      is_success: false,
      user_id: "rahul_s_20080023",
      email: "rs6867@srmist.edu.in",
      roll_number: "RA2111026050031"
    });
  }
});

app.listen(port, () => {
  console.log("app listening at 3000 | http://localhost:3000");
});
