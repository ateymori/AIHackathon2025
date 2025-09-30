import os
import logging

logger = logging.getLogger(__name__)


def check_environment_variables() -> bool:
    # Determine whether to use Vertex AI or Google AI Studio
    use_vertex_ai = os.getenv("GOOGLE_GENAI_USE_VERTEXAI", "false").strip().lower() in {
        "1",
        "true",
        "yes",
        "y",
        "on",
    }

    if use_vertex_ai:
        # Validate required Vertex AI environment configuration
        project = (
            os.getenv("GOOGLE_CLOUD_PROJECT")
            or os.getenv("VERTEXAI_PROJECT")
            or os.getenv("GCP_PROJECT")
        )
        region = (
            os.getenv("GOOGLE_CLOUD_LOCATION")
            or os.getenv("VERTEXAI_LOCATION")
            or os.getenv("GCP_REGION")
        )
        adc_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

        missing_vars = []
        if not project:
            missing_vars.append(
                "GOOGLE_CLOUD_PROJECT (or VERTEXAI_PROJECT/GCP_PROJECT)"
            )
        if not region:
            missing_vars.append("GOOGLE_CLOUD_REGION (or VERTEXAI_LOCATION/GCP_REGION)")

        if missing_vars:
            raise ValueError(
                "Vertex AI mode enabled (GOOGLE_GENAI_USE_VERTEXAI=true) but missing required environment variables: "
                + ", ".join(missing_vars)
            )

        if not adc_path:
            logger.warning(
                "GOOGLE_APPLICATION_CREDENTIALS is not set. Falling back to Application Default Credentials if available (e.g., gcloud auth application-default login)."
            )
        logger.info(f"Using Vertex AI with project '{project}' and region '{region}'.")
    else:
        # Validate Google AI Studio API key path
        GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
        if not GOOGLE_API_KEY:
            raise ValueError(
                "GOOGLE_API_KEY is not set. If you intend to use Google AI Studio, create an API key and set GOOGLE_API_KEY in your environment (.env). If you intend to use Vertex AI instead, set GOOGLE_GENAI_USE_VERTEXAI=true and provide GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_REGION (plus credentials)."
            )
        logger.info("Using Google AI Studio via GOOGLE_API_KEY.")
