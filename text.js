import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: 'sk-proj-QYHg8tjPNgWELBC4zTiuT3BlbkFJ1XEMBv1LoCvbNLzR1iIf', // Replace with your actual OpenAI API key
});

const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "You are a professional math." },
        {
            role: "user",
            content: "What is 1+1",
        },
    ],
});

console.log(completion.choices[0].message);

