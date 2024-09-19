import express from "express";
import { HfInference } from "@huggingface/inference";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
const inference = new HfInference("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");

const reply = async (Name, Relation, Feed, Message) => {
  let reply = "";
  for await (const chunk of inference.chatCompletionStream({
    model: "mistralai/Mistral-Nemo-Instruct-2407",
    messages: [
      {
        role: "user",
        content: `pretend to be my ${Relation} named ${Name}. They talk like this ${Feed}dont break away from the character.send only the reply. ${Message}`,
      },
    ],
    max_tokens: 500,
  })) {
    reply += chunk.choices[0]?.delta?.content || "";
    console.log(reply);
  }
  return reply;
};

app.use("/", async (req, res) => {
  console.log(req.body);
  const { name, relation, feed, message } = req.body;
  try {
    const rep = await reply(name, relation, feed, message);
    res.status(200).json({ reply: rep });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "err while getting reply" });
  }
});

app.listen(8001, () => console.log("listening on port 8001"));
