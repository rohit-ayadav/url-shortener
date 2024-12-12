import React from 'react';
import { LinkIcon, Copy, ExternalLink, Share2, QrCode } from 'lucide-react';
import { Button } from './ui/button';

const URLValidator = {
    isValid: (url: string): boolean => {
        try {
            const parsedUrl = new URL(url);
            return ['http:', 'https:'].includes(parsedUrl.protocol);
        } catch {
            return false;
        }
    },

    extractUrls: (text: string): string[] => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.match(urlRegex) || [];
    }
};

const AliasValidator = {
    sanitize: (alias: string): string => {
        return alias
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .replace(/\s/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 20);
    },

    validate: (alias: string): { isValid: boolean; error?: string } => {
        if (!alias) return { isValid: true };

        const sanitized = AliasValidator.sanitize(alias);

        if (sanitized.length < 4) {
            return {
                isValid: false,
                error: 'Alias must be at least 4 characters'
            };
        }

        if (sanitized.length > 20) {
            return {
                isValid: false,
                error: 'Alias cannot exceed 20 characters'
            };
        }

        return { isValid: true };
    }
};

const ResultCard = React.memo(({
    item,
    onCopy,
    onOpen,
    onShare,
    onQR
}: {
    item: { original: string; shortened: string },
    onCopy: (url: string) => void,
    onOpen: (url: string) => void,
    onShare: (url: string) => void,
    onQR: (url: string) => void
}) => (
    <div className="group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 space-y-2 border border-gray-100">
        <div className="flex items-center space-x-2">
            <LinkIcon className="h-4 w-4 text-blue-500" />
            <p
                className="text-sm text-gray-500 truncate flex-1"
                title={item.original}
            >
                {item.original}
            </p>
        </div>
        <div className="flex items-center justify-between">
            <p
                className="text-blue-600 font-medium select-all cursor-pointer hover:text-blue-700 transition-colors"
                title={item.shortened}
            >
                {item.shortened}
            </p>
            <div className="flex gap-2">
                {[
                    {
                        icon: Copy,
                        onClick: onCopy,
                        title: 'Copy URL',
                        ariaLabel: 'Copy shortened URL'
                    },
                    {
                        icon: ExternalLink,
                        onClick: onOpen,
                        title: 'Open URL',
                        ariaLabel: 'Open shortened URL'
                    },
                    {
                        icon: Share2,
                        onClick: onShare,
                        title: 'Share',
                        ariaLabel: 'Share shortened URL'
                    },
                    {
                        icon: QrCode,
                        onClick: onQR,
                        title: 'QR Code',
                        ariaLabel: 'Generate QR code'
                    }
                ].map(({ icon: Icon, onClick, title, ariaLabel }) => (
                    <Button
                        key={title}
                        variant="ghost"
                        size="icon"
                        onClick={() => onClick(item.shortened)}
                        className="hover:bg-blue-50 text-gray-600 hover:text-blue-700"
                        title={title}
                        aria-label={ariaLabel}
                    >
                        <Icon className="h-4 w-4" />
                    </Button>
                ))}
            </div>
        </div>
    </div>
));


export { URLValidator, AliasValidator, ResultCard };