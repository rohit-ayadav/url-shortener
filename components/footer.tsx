import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import toast from 'react-hot-toast';

// API integration
const API_URL = 'https://resourcesandcarrier.online/api/urlshortener';
// const API_URL = 'http://localhost:3002/api/urlshortener';

export const createShortUrl = async (originalUrl: string, alias: string) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(alias ? { originalUrl, alias } : { originalUrl }),
        });

        const data = await response.json();
        toast.success(`${data.message}`);
        if (!response.ok) {
            throw new Error(`Failed to create short URL: ${data.message}`);
        }
        console.log(`Shortened Url: ${data.shortenURL} and message: ${data.message}`);

        return data.shortenURL;
    } catch (error) {
        console.error('Error creating short URL:', error);
        toast.error(String(error));
        throw error;
    }
};

// Modal Component
const Modal = ({ isOpen, onClose, children, title }: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="hover:bg-gray-100 rounded-full"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Terms of Use Component
export const TermsOfUse = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Terms of Use">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">URL Shortener Terms of Use</h3>
                <div className="space-y-2 text-gray-600">
                    <p>1. Acceptable Use</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>You may not use this service for any illegal or unauthorized purpose</li>
                        <li>You agree not to create shortened URLs containing malicious content</li>
                        <li>You agree not to use this service to spam or mislead others</li>
                    </ul>

                    <p>2. Service Limitations</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>URLs are provided on an "as is" basis</li>
                        <li>We reserve the right to disable any URLs that violate our terms</li>
                        <li>We do not guarantee 100% uptime or availability</li>
                    </ul>

                    <p>3. Privacy & Data</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>We collect basic analytics on URL usage</li>
                        <li>We do not sell or share your personal data</li>
                        <li>Shortened URLs are public and can be accessed by anyone</li>
                    </ul>
                </div>
            </div>
        </Modal>
    );
};

// Use Cases Component
export const UseCases = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Use Cases">
            <div className="space-y-4">
                <div className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Social Media Sharing</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">Perfect for Twitter's character limit and making links more manageable on platforms like Instagram and Facebook.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Marketing Campaigns</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">Track clicks and engagement on promotional materials, emails, and digital advertisements.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Print Materials</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">Create memorable, easy-to-type URLs for business cards, brochures, and other printed media.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Modal>
    );
};

// How to Use Component
export const HowToUse = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="How to Use">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Quick Start Guide</h3>
                    <ol className="list-decimal pl-6 space-y-3 text-gray-600">
                        <li>
                            <p className="font-medium">Single URL Shortening</p>
                            <p>Paste your long URL in the input field and click "Shorten URL". Optionally add a custom alias.</p>
                        </li>
                        <li>
                            <p className="font-medium">Bulk URL Shortening</p>
                            <p>Switch to "Multiple URLs" tab and paste your URLs (one per line). Click "Shorten All URLs".</p>
                        </li>
                        <li>
                            <p className="font-medium">Text Mode</p>
                            <p>Paste text containing URLs in the "Text Mode" tab. All URLs will be automatically detected and shortened.</p>
                        </li>
                    </ol>
                </div>

                <Alert>
                    <AlertDescription>
                        Pro Tip: Use custom aliases to create memorable URLs for your important links!
                    </AlertDescription>
                </Alert>
            </div>
        </Modal>
    );
};

// Footer Component
export const Footer = () => {
    const [activeModal, setActiveModal] = useState<'terms' | 'useCases' | 'howTo' | null>(null);

    return (
        <footer className="mt-8 text-center pb-4">
            <div className="flex justify-center space-x-4 text-sm text-blue-600">
                <button
                    onClick={() => setActiveModal('terms')}
                    className="hover:text-blue-800 transition-colors"
                >
                    Terms of Use
                </button>
                <button
                    onClick={() => setActiveModal('useCases')}
                    className="hover:text-blue-800 transition-colors"
                >
                    Use Cases
                </button>
                <button
                    onClick={() => setActiveModal('howTo')}
                    className="hover:text-blue-800 transition-colors"
                >
                    How to Use
                </button>
            </div>

            <TermsOfUse
                isOpen={activeModal === 'terms'}
                onClose={() => setActiveModal(null)}
            />
            <UseCases
                isOpen={activeModal === 'useCases'}
                onClose={() => setActiveModal(null)}
            />
            <HowToUse
                isOpen={activeModal === 'howTo'}
                onClose={() => setActiveModal(null)}
            />
        </footer>
    );
};

export default Footer;