from pydantic import BaseModel, field_validator


class OutlineReq(BaseModel):
    user_input: str
    style: str = "technical"

    @field_validator("user_input")
    @classmethod
    def validate_input(cls, v: str) -> str:
        return v.strip()[:2000]


class GenerateReq(BaseModel):
    outline: str
    style: str = "technical"


class BeautifyReq(BaseModel):
    drawio_xml: str
    instruction: str = ""


class OutlineRes(BaseModel):
    title: str
    summary: str
    modules: list[dict]
    relationships: list[str]


class GenerateRes(BaseModel):
    drawio_xml: str
    summary: str
