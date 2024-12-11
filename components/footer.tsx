import React, { useState } from 'react';
import { Info, FileText, Zap, Code, User, Calendar, Github, Globe, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from 'framer-motion';

const ModalWrapper = ({ isOpen, onClose, children, title, icon: Icon }: { isOpen: boolean, onClose: () => void, children: React.ReactNode, title: string, icon: React.ComponentType<{ className?: string }> }) => {
    if (!isOpen) return null;
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden"
            >
                <div className="flex justify-between items-center p-5 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-3">
                        {Icon && <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                    >
                        <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </Button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
            </motion.div>
        </motion.div>
    );
};

export const Footer = () => {
    const [activeModal, setActiveModal] = useState<'terms' | 'useCases' | 'howTo' | 'about' | null>(null);

    // Progressive Web App Service Worker Registration
    React.useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('Service Worker registered successfully:', registration.scope);
                    })
                    .catch((error) => {
                        console.log('Service Worker registration failed:', error);
                    });
            });
        }
    }, []);

    const modalConfigs = {
        terms: {
            title: 'Terms of Use',
            icon: FileText,
            content: (
                <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                            URL Shortener Guidelines
                        </h3>
                        <div className="space-y-2 text-gray-700 dark:text-gray-300">
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                <p>Create short URLs responsibly and ethically</p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                <p>Do not use for spam, malicious content, or illegal activities</p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                <p>Respect privacy and intellectual property rights</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        useCases: {
            title: 'Use Cases',
            icon: Zap,
            content: (
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50 p-4 rounded-xl shadow-sm">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Social Media</h4>
                        <p className="text-gray-600 dark:text-gray-300">Create compact links perfect for character-limited platforms</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/50 p-4 rounded-xl shadow-sm">
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Marketing</h4>
                        <p className="text-gray-600 dark:text-gray-300">Track engagement and clicks on campaigns</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/50 p-4 rounded-xl shadow-sm">
                        <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Print Media</h4>
                        <p className="text-gray-600 dark:text-gray-300">Generate memorable URLs for print materials</p>
                    </div>
                </div>
            )
        },
        howTo: {
            title: 'How to Use',
            icon: Info,
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            Getting Started
                        </h3>
                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                            <div className="flex space-x-3 items-start">
                                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                                <div>
                                    <p className="font-medium">Single URL Shortening</p>
                                    <p className="text-sm">Paste your long URL and click "Shorten"</p>
                                </div>
                            </div>
                            <div className="flex space-x-3 items-start">
                                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                                <div>
                                    <p className="font-medium">Bulk Shortening</p>
                                    <p className="text-sm">Shorten multiple URLs at once in the dedicated tab</p>
                                </div>
                            </div>
                            <div className="flex space-x-3 items-start">
                                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                                <div>
                                    <p className="font-medium">Text Mode</p>
                                    <p className="text-sm">Automatically detect and shorten URLs in text</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        about: {
            title: 'About URL Shortener',
            icon: Info,
            content: (
                <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-5 rounded-xl">
                        <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-3">
                            URL Shortener
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            A powerful, user-friendly Progressive Web App for creating and managing shortened URLs with advanced features.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
                                <div className="flex items-center space-x-3 mb-2">
                                    <User className="h-5 w-5 text-blue-600" />
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Author</h4>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Rohit Kumar Yadav
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
                                <div className="flex items-center space-x-3 mb-2">
                                    <Calendar className="h-5 w-5 text-green-600" />
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Last Updated</h4>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    December 11, 2024
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
                                <div className="flex items-center space-x-3 mb-2">
                                    <Code className="h-5 w-5 text-purple-600" />
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Technologies</h4>
                                </div>
                                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                                    <li>• React</li>
                                    <li>• TypeScript</li>
                                    <li>• Tailwind CSS</li>
                                    <li>• shadcn/ui</li>
                                    <li>• Framer Motion</li>
                                </ul>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
                                <div className="flex items-center space-x-3 mb-2">
                                    <Github className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Source Code</h4>
                                </div>
                                <div className="space-y-2">
                                    <a
                                        href="https://github.com/rohit-ayadav/url-shortener"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-2"
                                    >
                                        <Globe className="h-4 w-4" />
                                        <span>GitHub Repository</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">App Description</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                A comprehensive URL shortening Progressive Web App (PWA) designed to simplify link management.
                                Features include single and bulk URL shortening, custom aliases, and advanced analytics tracking.
                            </p>
                        </div>
                    </div>
                </div>
            )
        }
    };

    const renderModal = () => {
        if (!activeModal) return null;
        const { title, icon, content } = modalConfigs[activeModal];

        return (
            <ModalWrapper
                isOpen={!!activeModal}
                onClose={() => setActiveModal(null)}
                title={title}
                icon={icon}
            >
                {content}
            </ModalWrapper>
        );
    };

    return (
        <footer className="bg-gray-100 dark:bg-gray-900 py-6 px-4 mt-8">
            <div className="container mx-auto flex justify-center items-center space-x-4">
                {Object.keys(modalConfigs).map((modal) => {
                    const { icon: Icon } = modalConfigs[modal as keyof typeof modalConfigs];
                    return (
                        <button
                            key={modal}
                            onClick={() => setActiveModal(modal as any)}
                            className="group flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-lg"
                        >
                            <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium capitalize">{modal}</span>
                        </button>
                    );
                })}
            </div>

            <AnimatePresence>
                {renderModal()}
            </AnimatePresence>
        </footer>
    );
};

export default Footer;