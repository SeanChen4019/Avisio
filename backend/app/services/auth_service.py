from datetime import datetime, timezone, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.utils.security import hash_password, verify_password, create_token, blacklist, failed_logins
from app.utils.logging import log


async def register_user(session: AsyncSession, email: str, password: str, name: str) -> User:
    user = User(
        email=email,
        password_hash=hash_password(password),
        name=name or email.split("@")[0],
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    log.info("user_registered", user_id=user.id, email=user.email)
    return user


async def authenticate_user(session: AsyncSession, email: str, password: str) -> User | None:
    email = email.lower().strip()

    if failed_logins.is_locked(email):
        log.warning("login_blocked_account_locked", email=email)
        return None

    result = await session.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(password, user.password_hash):
        failed_logins.record_failure(email)
        log.warning("login_failed", email=email)
        return None

    failed_logins.reset(email)
    return user


def generate_auth_token(user: User) -> str:
    return create_token(user.id)


def blacklist_token(token: str):
    blacklist.add(token)


def is_token_blacklisted(token: str) -> bool:
    return blacklist.is_blacklisted(token)


# ── Email verification (mock) ──

_verification_codes: dict[str, str] = {}


def generate_verification_code(email: str) -> str:
    import random
    code = f"{random.randint(100000, 999999)}"
    _verification_codes[email] = code
    log.info("verification_code_generated", email=email, code=code)
    return code


def verify_code(email: str, code: str) -> bool:
    stored = _verification_codes.get(email)
    if stored and stored == code:
        del _verification_codes[email]
        return True
    return False
