import json
import re
import logging

logger = logging.getLogger(__name__)

def clean_text(text: str) -> str:
    """Removes extra whitespaces and non-printable characters."""
    if not text:
        return ""
    # Remove excessive newlines and spaces
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_json_from_ai_response(response_text: str) -> dict:
    """Attempts to extract and parse JSON from the AI's response with enhanced robustness."""
    if not response_text:
        return None
        
    try:
        # 1. Try to find JSON inside markdown code blocks first
        code_block_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL | re.IGNORECASE)
        if code_block_match:
            try:
                strip_text = code_block_match.group(1).strip()
                return json.loads(strip_text)
            except json.JSONDecodeError:
                pass # fall back to general search
                
        # 2. General search for the first { and the last }
        # This is more robust than a simple match for the whole string
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}')
        
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            json_str = response_text[start_idx:end_idx+1]
            try:
                # Basic cleaning: remove common bad characters models sometimes add
                # (like control characters or accidental trailing commas before })
                json_str = re.sub(r',\s*\}', '}', json_str)
                return json.loads(json_str)
            except json.JSONDecodeError as e:
                logger.warning(f"Regex-extracted JSON string was invalid: {e}")
        
        # 3. Fallback: try raw parse if everything else fails
        return json.loads(response_text.strip())
        
    except (json.JSONDecodeError, AttributeError, ValueError) as e:
        logger.error(f"Failed to parse AI response as JSON: {e}")
        # Log a snippet of the response for debugging without overwhelming logs
        snippet = (response_text[:200] + '...') if len(response_text) > 200 else response_text
        logger.error(f"Raw response snippet: {snippet}")
        return None
