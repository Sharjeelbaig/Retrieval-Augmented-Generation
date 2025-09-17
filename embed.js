import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';
import { OllamaEmbeddings } from "@langchain/ollama";

dotenv.config();

const embeddings = new OllamaEmbeddings({
  model: "all-minilm:latest",
  baseUrl: "http://localhost:11434",
});

const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_PRIVATE_KEY);

const content = [
  "Beyond Mars: speculating life on distant planets.",
  "Jazz under stars: a night in New Orleans' music scene.",
  "Mysteries of the deep: exploring uncharted ocean caves.",
  "Rediscovering lost melodies: the rebirth of vinyl culture.",
  "Tales from the tech frontier: decoding AI ethics.",
]; 

async function main(input) {
  const embeddingVectors = await embeddings.embedDocuments(input);
  const data = input.map((textChunk, index) => ({
    content: textChunk,
    embedding: embeddingVectors[index]
  }));
  console.log(data);
  const result = await supabase.from('documents').insert(data);
  console.log('Insert result:', result);
  if (result.error) {
    console.error('Insert error:', result.error);
  } else {
    console.log('Embedding complete!');
  }
}
main(content);