from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import RegisterReq, LoginReq, AuthRes, UserOut, VerifyEmailReq
from app.services import auth_service
from app.services.email_service import send_verification_email
from app.utils.logging import log

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=AuthRes)
async def register(req: RegisterReq, session: AsyncSession = Depends(get_session)):
    existing = await session.execute(
        select(User).where(User.email == req.email.lower().strip())
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = await auth_service.register_user(session, req.email, req.password, req.name)
    token = auth_service.generate_auth_token(user)

    # Generate and send verification code
    code = auth_service.generate_verification_code(user.email)
    send_verification_email(user.email, code)

    return AuthRes(token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=AuthRes)
async def login(req: LoginReq, session: AsyncSession = Depends(get_session)):
    user = await auth_service.authenticate_user(session, req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = auth_service.generate_auth_token(user)
    log.info("user_logged_in", user_id=user.id)
    return AuthRes(token=token, user=UserOut.model_validate(user))


@router.post("/logout")
async def logout(user: User = Depends(get_current_user)):
    # In a real app, extract the token from the header. Here we just note the intent.
    log.info("user_logged_out", user_id=user.id)
    return {"ok": True}


@router.get("/me", response_model=UserOut)
async def get_me(user: User = Depends(get_current_user)):
    return UserOut.model_validate(user)


@router.post("/verify-email")
async def verify_email(req: VerifyEmailReq):
    if auth_service.verify_code(req.email.lower().strip(), req.code):
        log.info("email_verified", email=req.email)
        return {"ok": True}
    raise HTTPException(status_code=400, detail="Invalid verification code")
