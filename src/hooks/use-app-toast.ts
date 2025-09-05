
'use client';

import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import type { Toast } from "@/hooks/use-toast";

export function useAppToast() {
    const { toast: baseToast, ...rest } = useToast();
    const { t } = useTranslation();

    const toast = (props: Toast) => {
        const { title, description, ...restProps } = props;
        
        let translatedTitle = title;
        if (typeof title === 'string') {
            translatedTitle = t(title);
        }

        let translatedDescription = description;
        if (typeof description === 'string') {
            translatedDescription = t(description);
        }

        return baseToast({
            title: translatedTitle,
            description: translatedDescription,
            ...restProps,
        });
    };

    return { toast, ...rest };
}
