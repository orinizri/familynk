
export function emailVerifyTemplate(link: string) {
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.4">
    <h2>Verify your email</h2>
    <p>Thanks for signing up for Familynk! Please verify your email address by clicking the button below:</p>
    <p><a href="${link}" style="display:inline-block;padding:10px 16px;background:#1976d2;color:#fff;border-radius:6px;text-decoration:none">Verify email</a></p>
    <p style="color:#666">If you didn’t create an account, you can ignore this email.</p>
  </div>`;
}
