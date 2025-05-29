import { ErrorHelper } from "@/helpers/ErrorHelper";
import { ApiStatusEnum } from "@/types/enum/ApiStatus.enum";

export const openGithubPopup = (redirect_uri?: string | undefined) => {
    return new Promise<void>((resolve, reject) => {

        const width = 600;
        const height = 700;
        const left = window.screenX + (window.innerWidth - width) / 2;
        const top = window.screenY + (window.innerHeight - height) / 2;

        const popup = window.open('/api/auth/github-redirect?callbackUrl=/github-callback', 'Github account',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popup) {
            reject(new ErrorHelper(ApiStatusEnum.WINDOW_FAILED_TO_OPEN, "500"));
            return;
        }

        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'session-success') {
                clearInterval(checkPopupClosed);
                window.removeEventListener('message', handleMessage);
                popup.close();
                resolve();
            }
        };

        window.addEventListener('message', handleMessage);

        const checkPopupClosed = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkPopupClosed);
                window.removeEventListener('message', handleMessage);
                reject(new ErrorHelper(ApiStatusEnum.WINDOW_CLOSED_BY_USER, "400"));
            }
        }, 500);

    });
};