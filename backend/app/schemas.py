from pydantic import BaseModel, Field, StrictInt, field_validator


class RecordIn(BaseModel):
    name: str = Field(min_length=1)
    settlement: StrictInt
    budget: StrictInt | None = None
    feedback: str | None = Field(default=None, max_length=30)
    month: int = Field(ge=1, le=12)

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("이름을 입력하세요.")
        return v


class RecordOut(BaseModel):
    id: int
    name: str
    settlement: int
    budget: int | None
    feedback: str | None
    month: int
