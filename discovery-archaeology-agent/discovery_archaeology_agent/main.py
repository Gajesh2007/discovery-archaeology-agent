"""Main entry point for the Discovery Archaeology Agent."""
import uvicorn
from .config import settings
from .api import app


def main():
    """Run the application."""
    uvicorn.run(
        "discovery_archaeology_agent.api:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug
    )


if __name__ == "__main__":
    main()