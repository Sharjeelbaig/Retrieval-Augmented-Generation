import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';
import { OllamaEmbeddings, Ollama } from "@langchain/ollama";

dotenv.config();

const embeddings = new OllamaEmbeddings({
  model: "all-minilm:latest",
  baseUrl: "http://localhost:11434",
});

const generations = new Ollama({
  model: "smollm:135m-base-v0.2-q3_K_S",
  baseUrl: "http://localhost:11434",
});

const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_PRIVATE_KEY);

// User query about podcasts
const query = "life on distant planets";
main(query);

/*
  Create an embedding from the user input and return a
  semantically matching text chunk from the database
*/
async function main(input) {
  // Create a vector embedding representing the input text
  const embedding = await embeddings.embedQuery(input);
  console.log('Query embedding generated:', embedding.length, 'dimensions');

  // Query Supabase for nearest vector match
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 1
  });

  if (error) {
    console.error('Supabase error:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('No matching documents found');
    return;
  }

// Create a Generation using smoll LLM
const matchedContent = data[0];
console.log('Matched content:', matchedContent.content, "\n\n");
const prompt = `Write a blog post on: [${matchedContent.content}]`;
const generation = await generations.call(prompt);
console.log(generation);


}