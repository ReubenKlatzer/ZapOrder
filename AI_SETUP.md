# AI Configuration Guide

## Overview
Each restaurant can now use their own AI provider (Nova AI, Groq, Cerebras, Google, SiliconFlow, etc.) with custom API keys and custom AI assistant names.

## Setup Steps

### 1. Run Database Migration
```bash
npx prisma migrate dev --name add_ai_config_to_account
npx prisma generate
```

### 2. Configure Per-Restaurant AI

Update the Account table with AI settings:

```sql
UPDATE accounts 
SET 
  "aiProvider" = 'nova',
  "aiModel" = 'gpt-4o-mini',
  "aiApiKey" = 'your_nova_api_key',
  "aiName" = 'Nova'
WHERE username = 'starbucks';
```

### 3. Supported Providers

| Provider | Default Model | Base URL |
|----------|--------------|----------|
| `groq` | llama-4-scout-17b-16e-instruct | https://api.groq.com/openai/v1 |
| `cerebras` | llama-3.3-70b | https://api.cerebras.ai/v1 |
| `google` | gemini-2.5-pro | https://generativelanguage.googleapis.com/v1beta/openai |
| `siliconflow` | DeepSeek-V3.2-Exp | https://api.siliconflow.com/v1 |
| `nova` | gpt-4o-mini | https://nova-litellm-production.up.railway.app |

### 4. Custom Provider URL

For custom providers, set `aiProvider` to the full base URL:

```sql
UPDATE accounts 
SET 
  "aiProvider" = 'https://custom-ai-api.com/v1',
  "aiModel" = 'custom-model-name',
  "aiApiKey" = 'custom_api_key',
  "aiName" = 'CustomBot'
WHERE username = 'restaurant_name';
```

### 5. Custom AI Assistant Name

Change the AI assistant name from "ZapOder" to anything:

```sql
UPDATE accounts 
SET "aiName" = 'Nova'
WHERE username = 'starbucks';
```

The AI will introduce itself as: "Hey, I'm Nova from Starbucks."

## Fallback Behavior

If a restaurant doesn't have AI config set:
1. System tries global providers in order (groq → cerebras → google → siliconflow → nova)
2. Uses API keys from environment variables (`AI_GROQ_KEY`, `AI_NOVA_KEY`, etc.)
3. Automatically switches to next provider if one fails
4. Uses "ZapOder" as default AI name

## Environment Variables

Add to `.env`:
```env
AI_GROQ_KEY=your_groq_key
AI_CEREBRAS_KEY=your_cerebras_key
AI_GOOGLE_KEY=your_google_key
AI_SILICONFLOW_KEY=your_siliconflow_key
AI_NOVA_KEY=your_nova_key
```

## API Usage

**Update AI config via API:**
```javascript
fetch('/api/admin/ai', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    aiProvider: 'nova',
    aiModel: 'gpt-4o-mini',
    aiApiKey: 'your_key',
    aiName: 'Nova'
  })
});
```

**Get current AI config:**
```javascript
fetch('/api/admin/ai').then(r => r.json());
```
