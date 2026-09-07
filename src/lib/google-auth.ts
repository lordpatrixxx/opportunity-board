export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '202566598378-urogr0q0drboc0pnap609subuv4vshho.apps.googleusercontent.com';

export interface GoogleUserProfile {
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  credential?: string;
  accessToken?: string;
}

/**
 * Triggers Google Sign-In directly via Google OAuth 2.0 / Google Identity Services.
 * Fetches the user's authentic email address, full name, and avatar directly from Google.
 * NO manual form input is ever shown.
 */
export async function triggerGoogleSignIn(): Promise<GoogleUserProfile> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Window not available'));
    }

    // 1. Try Google Identity Services OAuth2 Token Client (Most standard & reliable popup flow)
    const google = (window as any).google;
    if (google?.accounts?.oauth2) {
      try {
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              if (tokenResponse.error === 'access_denied') {
                return reject(new Error('Google sign-in was cancelled.'));
              }
              return reject(new Error(tokenResponse.error_description || tokenResponse.error || 'Google sign-in failed.'));
            }

            if (tokenResponse.access_token) {
              try {
                // Fetch directly from Google's verified userinfo API
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                  },
                });
                if (!res.ok) {
                  throw new Error('Failed to retrieve user profile from Google');
                }
                const profile = await res.json();
                if (!profile.email) {
                  throw new Error('Google did not return an email address');
                }
                return resolve({
                  email: profile.email,
                  fullName: profile.name || profile.given_name || profile.email.split('@')[0],
                  avatarUrl: profile.picture || null,
                  accessToken: tokenResponse.access_token,
                });
              } catch (err: any) {
                return reject(err);
              }
            }
          },
        });

        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('Google Identity Services token client failed, trying OAuth popup:', err);
      }
    }

    // 2. Direct Google OAuth2 Popup Fallback (Standard Web OAuth)
    try {
      const redirectUri = `${window.location.origin}/login`;
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
        GOOGLE_CLIENT_ID
      )}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=token&scope=${encodeURIComponent(
        'email profile openid'
      )}&prompt=select_account`;

      const width = 520;
      const height = 630;
      const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
      const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);

      const popup = window.open(
        authUrl,
        'google_oauth_popup',
        `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
      );

      if (!popup) {
        // Fallback to direct redirect if popup blocked
        window.location.href = authUrl;
        return;
      }

      const checkTimer = setInterval(async () => {
        try {
          if (!popup || popup.closed) {
            clearInterval(checkTimer);
            return reject(new Error('Google sign-in popup was closed before completing.'));
          }

          // Check if popup returned to redirect URI
          if (popup.location.href.startsWith(window.location.origin)) {
            const hash = popup.location.hash;
            popup.close();
            clearInterval(checkTimer);

            if (hash) {
              const params = new URLSearchParams(hash.replace(/^#/, ''));
              const accessToken = params.get('access_token');
              if (accessToken) {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                });
                const profile = await res.json();
                if (profile.email) {
                  return resolve({
                    email: profile.email,
                    fullName: profile.name || profile.given_name || profile.email.split('@')[0],
                    avatarUrl: profile.picture || null,
                    accessToken,
                  });
                }
              }
            }
            return reject(new Error('Could not authenticate with Google.'));
          }
        } catch {
          // Cross-origin access until popup navigates back to origin, normal behavior
        }
      }, 300);
    } catch (popupErr: any) {
      reject(new Error(popupErr.message || 'Unable to open Google sign-in window.'));
    }
  });
}
