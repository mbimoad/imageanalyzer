import OpenAI from "openai";
import express from "express";
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const openai = new OpenAI({
    apiKey: 'sk-proj-QYHg8tjPNgWELBC4zTiuT3BlbkFJ1XEMBv1LoCvbNLzR1iIf', // Replace with your API Key
});

const app = express();
const upload = multer({ dest: "uploads/" }); // Temporary storage folder

// Fix for `__dirname` in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Endpoint for file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const filePath = req.file.path;

        // Read the file content as a binary buffer
        const fileBuffer  = fs.readFileSync(filePath);

        // Convert the buffer to a Base64 string
        const base64_image = fileBuffer.toString('base64');
    

        // Send file content to OpenAI API
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a math professional. Only answer questions related to mathematics. Do not answer any other type of question."
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "What’s in this image?" },
                        {
                            type: "image_url",
                            image_url: {
                                "url": `data:image/jpeg;base64,{${base64_image}}`
                            },
                        },
                    ],
                },
            ],
        });
        
          

        // Delete the file after processing
        fs.unlinkSync(filePath);

        // Send OpenAI API response to client
        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while processing the file.");
    }
});

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
