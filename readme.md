# RAG Example with Ollama and Supabase

A simple demonstration of Retrieval-Augmented Generation (RAG) using Ollama for local language models and Supabase as a vector database. This example shows the basic concepts of semantic search and contextual text generation with locally-hosted AI models.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)

## Project Description

This example demonstrates the basic principles of Retrieval-Augmented Generation (RAG) by combining local language models through Ollama with Supabase's vector database capabilities. The goal is to show how semantic search and contextual response generation work in practice.

### What This Example Shows

This demonstration illustrates how to:
- **Store and search text content** using vector embeddings for semantic understanding
- **Generate relevant responses** based on retrieved information
- **Use local AI models** for privacy and control
- **Implement basic RAG concepts** in a straightforward way

### What Problem Does It Address?

Traditional keyword-based search often misses the deeper meaning of text. This example shows how RAG can:
- Convert text into mathematical representations that capture meaning
- Find content based on context rather than just matching words
- Generate helpful responses using the most relevant retrieved information
- Provide a starting point for understanding AI-powered search systems

### What You Can Learn

Working through this example gives hands-on experience with:
- Vector databases and how similarity search works
- Language model embedding techniques
- Basic RAG implementation patterns
- Supabase database functions and remote procedure calls
- Ollama for running AI models locally

## Features

- 🔍 **Basic Semantic Search**: Shows how to find content based on meaning rather than keywords
- 🤖 **Local AI Processing**: Demonstrates using Ollama for privacy-focused AI operations
- 📊 **Vector Storage**: Illustrates how to store and query vector embeddings in Supabase
- ⚡ **Simple Generation**: Shows basic contextual response generation
- 🔧 **Model Flexibility**: Easy to experiment with different Ollama models
- � **Educational Focus**: Designed to help understand RAG concepts step by step

## Technologies Used

This example uses these tools to demonstrate RAG concepts:

- **[Node.js](https://nodejs.org/)** - JavaScript runtime for running the example
- **[Ollama](https://ollama.ai/)** - Local AI model hosting for privacy
- **[Supabase](https://supabase.com/)** - Database service with vector capabilities
- **[LangChain](https://langchain.com/)** - Framework for working with AI models

## Prerequisites

To run this example, you'll need:

- **Node.js** (v16 or higher) - For running the JavaScript code
- **Ollama** installed and running locally - For AI model hosting
- **Supabase** account and project - For the database
- **Git** for cloning the repository

### Required Ollama Models

This example uses these specific models:
- `all-minilm:latest` - Creates mathematical representations of text
- `smollm:135m-base-v0.2-q3_K_S` - Generates text responses

## Installation

Follow these steps to set up the example on your local machine:

1. **Get the example code**
   ```bash
   git clone <repository-url>
   cd "RAG supabase"
   ```

2. **Install the required packages**
   ```bash
   npm install
   ```

3. **Download the AI models**
   ```bash
   ollama pull all-minilm:latest
   ollama pull smollm:135m-base-v0.2-q3_K_S
   ```

4. **Set up the database structure**
   
   The database migration creates the necessary structure to store and search your documents efficiently. This involves setting up special capabilities for handling AI-generated vectors (mathematical representations of text meaning).
   
   **Step-by-step migration process:**
   
   a. **Access your Supabase dashboard**
      - Go to your Supabase project dashboard
      - Navigate to the "SQL Editor" section in the left sidebar
   
   b. **Enable vector capabilities**
      - Copy and paste the first part of `migration.sql`:
      ```sql
      CREATE SCHEMA IF NOT EXISTS extensions;
      CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
      ```
      - Click "Run" to enable vector processing capabilities
      - This adds special tools to handle mathematical representations of text
   
   c. **Create the documents table**
      - Copy and paste the table creation part:
      ```sql
      create table documents (
        id bigserial primary key,
        content text, -- corresponds to the "text chunk"
        embedding vector(384)
      );
      ```
      - Click "Run" to create the storage structure
      - This creates a table to store your text content and its mathematical representation
   
   d. **Add search functionality**
      - Copy and paste the function creation part:
      ```sql
      create or replace function match_documents (
        query_embedding vector(384),
        match_threshold float,
        match_count int
      )
      returns table (
        id bigint,
        content text,
        similarity float
      )
      language sql stable
      as $$
        select
          documents.id,
          documents.content,
          1 - (documents.embedding <=> query_embedding) as similarity
        from documents
        where 1 - (documents.embedding <=> query_embedding) > match_threshold
        order by similarity desc
        limit match_count;
      $$;
      ```
      - Click "Run" to create the search function
      - This creates a smart search tool that finds the most relevant documents based on meaning
   
   e. **Verify the setup**
      - Go to "Table Editor" in your Supabase dashboard
      - Confirm you can see the "documents" table
      - Check that the "match_documents" function appears in the "Database" → "Functions" section

## Configuration

1. **Create environment file**
   ```bash
   cp .env.example .env  # Create this file if it doesn't exist
   ```

2. **Add your Supabase credentials to `.env`**
   ```env
   SUPABASE_PROJECT_URL=your_supabase_project_url
   SUPABASE_PRIVATE_KEY=your_supabase_anon_key
   ```

3. **Ensure Ollama is running**
   ```bash
   ollama serve
   ```

## Usage

This example demonstrates the RAG process in two main steps:

### 1. Prepare Sample Content

First, add some example text to the database:

```bash
node embed.js
```

This step:
- Takes the sample text provided in the code
- Converts each piece of text into a mathematical representation
- Saves these representations in your Supabase database

### 2. Try the Search and Generation

Run the main example to see RAG in action:

```bash
node index.js
```

This demonstrates:
- Searching for content related to "life on distant planets"
- Finding the most relevant stored text
- Generating a response based on that content

### 3. Experiment with Different Queries

You can modify the search query in `index.js` to try different topics and see how the system responds.

Edit the query in `index.js`:

```javascript
const query = "your custom query here";
```

## Project Structure

```
📦 RAG supabase/
├── 📄 index.js          # Main RAG application
├── 📄 embed.js          # Document embedding script
├── 📄 migration.sql     # Supabase database setup
├── 📄 package.json      # Node.js dependencies
├── 📄 readme.md         # This file
└── 📁 asset/
    └── 🖼️ migration.png  # Database migration example
```

## How It Works

This example shows the basic flow of a RAG system:

1. **Content Preparation** (`embed.js`):
   - Takes sample text and converts it to vector embeddings
   - Stores these mathematical representations in the database

2. **Search Process** (`index.js`):
   - Converts your search question into a vector
   - Finds the most similar stored content using mathematical comparison
   - Retrieves the best matching text

3. **Response Generation**:
   - Uses the retrieved content as context
   - Asks the local AI model to create a relevant response
   - Returns an answer based on the found information

## What You Could Add Next

This basic example could be extended to demonstrate more advanced concepts:

- **User Interface**: Add a simple web page to interact with the system
- **More Content Types**: Try with different kinds of text or documents
- **Better Search**: Experiment with different similarity thresholds
- **Multiple Models**: Compare results from different Ollama models
- **Error Handling**: Add checks for when no good matches are found
- **Performance**: Test with larger amounts of content

---

**Note**: This example runs on your local machine using Ollama and Supabase. It's designed to help you understand RAG concepts without sending data to external AI services, giving you full control over your information.
