"""WAHA (WhatsApp HTTP API) messaging provider.

WAHA is a self-hosted, Apache-2.0, open-source HTTP bridge to WhatsApp. It is
*unofficial*: it automates WhatsApp Web, so it must only be used for opt-in,
rate-limited transactional messaging. It is selected with
``THERAVIVA_MESSAGING_PROVIDER=waha``.
"""

from __future__ import annotations

import httpx

from app.config import settings
from app.errors import UnavailableError


class WahaMessagingProvider:
    name = "waha"

    def __init__(self, base_url: str | None = None, api_key: str | None = None, session: str | None = None) -> None:
        self.base_url = (base_url or settings.waha_base_url).rstrip("/")
        self.api_key = api_key or settings.waha_api_key
        self.session = session or settings.waha_session

    async def send_text(self, *, to: str, text: str) -> str:
        chat_id = to if "@" in to else f"{to.lstrip('+')}@c.us"
        headers = {"X-Api-Key": self.api_key} if self.api_key else {}
        payload = {"chatId": chat_id, "text": text, "session": self.session}
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                response = await client.post(f"{self.base_url}/api/sendText", json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()
        except httpx.HTTPError as exc:
            raise UnavailableError("WhatsApp delivery is unavailable.") from exc
        return str(data.get("id", {}).get("_serialized") or data.get("id") or "")
