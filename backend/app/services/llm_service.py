from google import genai
import json
from openai import AsyncOpenAI
from app.core.config import settings

gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
embedding_model_name = 'text-embedding-004'

# Initialize OpenAI client pointing to OpenRouter
openrouter_client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.OPENROUTER_API_KEY,
) if settings.OPENROUTER_API_KEY else None

# Priority fallback list of models (cheapest/fastest first, then more capable ones)
OPENROUTER_MODELS = [
    "openai/gpt-oss-120b:free",
    "google/gemma-4-31b-it:free",
    "openrouter/free"
]

async def _call_openrouter_with_fallback(prompt: str, json_mode: bool = False) -> str:
    if not openrouter_client:
        # Fallback if no API key provided
        return '{"severity": 3, "urgency": 3}' if json_mode else "Priority determined based on severity, urgency, and affected area."
        
    for model in OPENROUTER_MODELS:
        try:
            # We prompt strictly for JSON and avoid native response_format because many free models on OpenRouter don't support it reliably.
            response = await openrouter_client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are an AI assistant. Always output exact JSON if requested, no markdown fences."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200
            )
            content = response.choices[0].message.content
            if content:
                # Basic cleanup in case some models include markdown fences
                content = content.replace("```json", "").replace("```", "").strip()
                return content
        except Exception as e:
            print(f"OpenRouter Model {model} failed: {e}")
            continue
            
    # If all models fail
    if json_mode:
        return '{"severity": 3, "urgency": 3}'
    return "Priority determined based on severity, urgency, and affected area."


async def extract_complaint_details(description: str, category: str = "other") -> dict:
    prompt = f"""
    Analyze the following civic complaint description and extract the severity (1-5) and urgency (1-5).
    Category: {category}
    Description: {description}
    
    Use the following strict rubric:
    Severity (Impact on community):
    1: Cosmetic or very minor (e.g., small graffiti, minor litter)
    2: Minor inconvenience (e.g., small pothole on side street, overgrown grass)
    3: Moderate issue (e.g., street light out, moderate pothole, broken sidewalk)
    4: Severe hazard (e.g., deep pothole on major road, large water leak, broken traffic light)
    5: Life-threatening / massive failure (e.g., collapsed road, exposed live wire, major flood)
    
    Urgency (Time sensitivity):
    1: Can wait months
    2: Needs fixing within weeks
    3: Needs fixing within days
    4: Needs fixing within 24 hours
    5: Immediate dispatch required right now
    
    Output MUST be a valid JSON object with integer keys "severity" and "urgency".
    Example output: {{"severity": 3, "urgency": 3}}
    """
    try:
        content = await _call_openrouter_with_fallback(prompt, json_mode=True)
        import re
        match = re.search(r'\{.*\}', content, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        return json.loads(content)
    except Exception as e:
        print(f"LLM Extraction Error (JSON parsing): {e}")
        return {"severity": 3, "urgency": 3}

async def generate_justification(description: str, score: float, details: dict) -> str:
    prompt = f"""
    Write a 1-2 sentence justification for the assigned priority score of {score}/100.
    Details: {details}
    Description: {description}
    """
    try:
        content = await _call_openrouter_with_fallback(prompt, json_mode=False)
        return content.strip()
    except Exception:
        return "Priority determined based on severity, urgency, and affected area."

async def get_embedding(text: str) -> list[float]:
    try:
        response = await gemini_client.aio.models.embed_content(
            model=embedding_model_name,
            contents=text,
        )
        return response.embeddings[0].values
    except Exception:
        return [0.0] * 768
