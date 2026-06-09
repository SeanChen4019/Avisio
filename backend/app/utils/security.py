import bcrypt
from datetime import datetime, timedelta, timezone
from collections import defaultdict
import jwt

from app.config import settings


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def create_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=settings.JWT_EXPIRE_HOURS),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> int | None:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return int(payload["sub"])
    except Exception:
        return None


class TokenBlacklist:
    """In-memory token blacklist. Replace with Redis in production."""

    def __init__(self):
        self._blacklist: set[str] = set()

    def add(self, token: str):
        self._blacklist.add(token)

    def is_blacklisted(self, token: str) -> bool:
        return token in self._blacklist


blacklist = TokenBlacklist()


# ── Failed login tracker ──

class FailedLoginTracker:
    MAX_ATTEMPTS = 5
    LOCK_MINUTES = 15
    _store: dict[str, list[datetime]] = defaultdict(list)

    def record_failure(self, email: str):
        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(minutes=self.LOCK_MINUTES)
        attempts = [t for t in self._store[email] if t > cutoff]
        attempts.append(now)
        self._store[email] = attempts

    def is_locked(self, email: str) -> bool:
        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(minutes=self.LOCK_MINUTES)
        attempts = [t for t in self._store[email] if t > cutoff]
        self._store[email] = attempts
        return len(attempts) >= self.MAX_ATTEMPTS

    def reset(self, email: str):
        self._store.pop(email, None)


failed_logins = FailedLoginTracker()
