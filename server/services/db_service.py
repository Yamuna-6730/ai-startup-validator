import httpx
import logging
from typing import List, Optional
from uuid import UUID
from config.settings import get_settings
from models.schemas import IdeaResponse

logger = logging.getLogger(__name__)
settings = get_settings()

class DatabaseService:
    def __init__(self):
        self.base_url = f"{settings.SUPABASE_URL}/rest/v1/ideas"
        self.headers = {
            "apikey": settings.SUPABASE_KEY,
            "Authorization": f"Bearer {settings.SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }

    async def create_idea(self, data: dict) -> Optional[dict]:
        """Inserts a new idea into the Supabase 'ideas' table."""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.base_url,
                    headers=self.headers,
                    json=data
                )
                response.raise_for_status()
                result = response.json()
                return result[0] if result else None
            except Exception as e:
                logger.error(f"Error creating idea in Supabase: {e}")
                if hasattr(e, 'response'):
                    logger.error(f"Response: {e.response.text}")
                return None

    async def get_ideas(self) -> List[dict]:
        """Fetches all ideas from Supabase, ordered by created_at desc."""
        async with httpx.AsyncClient() as client:
            try:
                # Add order param
                url = f"{self.base_url}?select=*&order=created_at.desc"
                response = await client.get(url, headers=self.headers)
                response.raise_for_status()
                return response.json()
            except Exception as e:
                logger.error(f"Error fetching ideas from Supabase: {e}")
                return []

    async def get_idea_by_id(self, idea_id: str) -> Optional[dict]:
        """Fetches a single idea by UUID."""
        async with httpx.AsyncClient() as client:
            try:
                url = f"{self.base_url}?id=eq.{idea_id}&select=*"
                response = await client.get(url, headers=self.headers)
                response.raise_for_status()
                result = response.json()
                return result[0] if result else None
            except Exception as e:
                logger.error(f"Error fetching idea {idea_id} from Supabase: {e}")
                return None

    async def delete_idea(self, idea_id: str) -> bool:
        """Deletes an idea by UUID."""
        async with httpx.AsyncClient() as client:
            try:
                url = f"{self.base_url}?id=eq.{idea_id}"
                response = await client.delete(url, headers=self.headers)
                response.raise_for_status()
                return True
            except Exception as e:
                logger.error(f"Error deleting idea {idea_id} from Supabase: {e}")
                return False

db_service = DatabaseService()
