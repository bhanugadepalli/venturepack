import { Resend } from "resend";

type SendPasswordResetEmailArgs = {
  to: string;
  resetUrl: string;
};

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: SendPasswordResetEmailArgs) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn("RESEND_API_KEY is not set. Password reset email not sent.");
    console.warn("Reset URL:", resetUrl);

    return {
      ok: false,
      skipped: true,
    };
  }

  const resend = new Resend(resendApiKey);

  const from = process.env.EMAIL_FROM || "VenturePack <onboarding@resend.dev>";

  const subject = "Reset your VenturePack password";

  const text = [
    "Reset your VenturePack password",
    "",
    "We received a request to reset your VenturePack password.",
    "",
    `Reset your password using this link: ${resetUrl}`,
    "",
    "This link expires in 30 minutes.",
    "",
    "If you did not request this, you can ignore this email.",
    "",
    "VenturePack is not a law firm and does not provide legal advice.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h1 style="font-size: 22px; margin-bottom: 12px;">Reset your VenturePack password</h1>

      <p>We received a request to reset your VenturePack password.</p>

      <p>
        <a href="${resetUrl}" style="display: inline-block; background: #020617; color: white; padding: 10px 14px; border-radius: 8px; text-decoration: none;">
          Reset password
        </a>
      </p>

      <p>If the button does not work, copy and paste this link into your browser:</p>

      <p style="word-break: break-all;">
        <a href="${resetUrl}">${resetUrl}</a>
      </p>

      <p>This link expires in 30 minutes.</p>

      <p>If you did not request this, you can ignore this email.</p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

      <p style="font-size: 12px; color: #64748b;">
        VenturePack is not a law firm and does not provide legal advice.
      </p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("Resend password reset email error:", error);

    return {
      ok: false,
      error,
    };
  }

  return {
    ok: true,
    data,
  };
}