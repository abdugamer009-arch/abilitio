# Authentication email setup

## Current state — October 12, 2026

The owner registered a Resend account. Its Add domain form is open, but no owned sender domain has been supplied or verified. Supabase custom SMTP remains disabled. No public password-recovery email delivery is claimed. The interface defaults to unavailable while `VITE_PASSWORD_RECOVERY_ENABLED` is false. Signup email confirmation remains off at the owner's request.

## Complete the connection

1. Select a domain the owner controls. Use a dedicated sending subdomain, such as `auth.example.com`; the application's `vercel.app` hostname is not an owned sender domain.
2. Add the domain in Resend. Copy the exact SPF/DKIM DNS records shown for that domain into the owner's DNS provider. Preserve existing mail records. Wait for Resend to report Verified.
3. Use a Resend sending key restricted to the verified domain. Keep it out of chat, screenshots, Git and frontend environment variables. Creating a key through the browser requires action-time approval because it creates a credential.
4. Set Supabase Authentication → Emails → SMTP Settings for project `cadbpdgljzxnbeamitnq`:

   | Field          | Value                                   |
   | -------------- | --------------------------------------- |
   | Sender name    | Abilitio                                |
   | Sender address | A chosen address at the verified domain |
   | Host           | `smtp.resend.com`                       |
   | Port           | `465` (TLS)                             |
   | Username       | `resend`                                |
   | Password       | The restricted Resend sending key       |

5. Keep click tracking disabled for authentication links. Retain the production Auth Site URL and recovery redirect allowlist. Inspect Supabase email rate limits and align them with provider/account limits.
6. Verify backend recovery email delivery to an ordinary public account with an owner-approved real inbox (an actual recovery email, not an admin-generated link). Then set `VITE_PASSWORD_RECOVERY_ENABLED=true` and rebuild the target environment.
7. Test using a dedicated account with a real inbox approved by the owner. Trigger Forgot password from the live site, check the Resend delivery record and the inbox, open the recovery link, update the password, then verify login with the new password. Browser rules require the user to enter/submit a new password themselves. API/admin-generated links do not prove email delivery.

Weekly digest is a separate feature with no sending implementation. Configuring Auth SMTP does not implement it.

## Official references

- [Supabase custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [Resend SMTP settings](https://resend.com/docs/send-with-smtp)
- [Resend verified domains](https://resend.com/docs/dashboard/domains/introduction)
