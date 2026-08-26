import pytest
import pytest_asyncio
from unittest.mock import AsyncMock
from httpx import AsyncClient, ASGITransport

from main import app


@pytest.fixture
def sample_resume_text():
    return """
    Jane Doe
    Python Backend Developer

    Skills:
    Python, FastAPI, REST APIs, Git, PostgreSQL

    Experience:
    2 years of backend development experience building REST APIs
    using Python and FastAPI. Developed and maintained PostgreSQL
    databases and collaborated with cross-functional teams.
    """


@pytest.fixture
def sample_jd_text():
    return """
    We are looking for a Python Backend Engineer.

    Requirements:
    - Python
    - FastAPI
    - REST APIs
    - Git
    - PostgreSQL
    - Backend development experience
    """


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as ac:
        yield ac


@pytest.fixture
def mock_llm_service():
    return AsyncMock()