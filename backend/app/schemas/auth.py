import re
from pydantic import BaseModel, EmailStr, field_validator


class RegisterReq(BaseModel):
    email: str
    password: str
    name: str = ""

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", v):
            raise ValueError("Invalid email format")
        return v.lower().strip()

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[a-zA-Z]", v):
            raise ValueError("Password must contain at least one letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        return v

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        return v.strip()[:100]


class LoginReq(BaseModel):
    email: str
    password: str


class VerifyEmailReq(BaseModel):
    email: str
    code: str


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    plan: str
    role: str
    email_verified: bool

    model_config = {"from_attributes": True}


class AuthRes(BaseModel):
    token: str
    user: UserOut
