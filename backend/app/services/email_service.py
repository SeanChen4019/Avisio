from app.utils.logging import log


def send_verification_email(email: str, code: str):
    """Mock: log the verification code to console instead of sending email.
    Replace with real email provider (SendGrid, AWS SES, etc.) later."""
    log.info(
        "mock_email_sent",
        to=email,
        subject="Avisio - Email Verification",
        body=f"Your verification code: {code}",
    )
