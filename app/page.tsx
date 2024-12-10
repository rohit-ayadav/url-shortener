"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Link,
  QrCode,
  Share2,
  ExternalLink,
  Copy,
  Loader2,
  Text,
  LinkIcon,
  AlertCircle
} from "lucide-react";
import Footer from '@/components/footer';
import { createShortUrl } from '@/components/footer';
import toast, { Toaster } from 'react-hot-toast';

const URLShortener = () => {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [urls, setUrls] = useState('');
  const [text, setText] = useState('');
  const [processedText, setProcessedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shortenedURLs, setShortenedURLs] = useState<{ original: string; shortened: string }[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [selectedURL, setSelectedURL] = useState<string | null>(null);
  const [aliasError, setAliasError] = useState('');

  const checkAlias = (value: string) => {
    if (!value) {
      setAliasError('');
      return true;
    }
    if (value.length < 4) {
      setAliasError('Alias must be at least 4 characters');
      return false;
    }
    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(value)) {
      setAliasError('Alias must start with a letter and contain only letters, numbers, hyphens, and underscores');
      return false;
    }
    setAliasError('');
    return true;
  };

  const handleShortenSingle = async () => {
    if (!url) {
      setError('Please enter a URL');
      toast.error('Please enter a URL');
      return;
    }
    if (!navigator.onLine) {
      setError('No internet connection. Please check your network settings.');
      return;
    }
    if (!checkAlias(alias)) return;

    setLoading(true);
    try {
      const shortened = await createShortUrl(url, alias);
      setShortenedURLs([{ original: url, shortened }]);
      setError('');
    }
    catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleShortenMultiple = async () => {
    if (!urls) {
      setError("Please enter lines of URLs...");
      toast.error('Please enter lines of URLs...');
      return;
    }
    if (!navigator.onLine) {
      setError('No internet connection. Please check your network settings.');
      return;
    }
    setLoading(true);
    try {
      const urlList = urls.split('\n').filter(u => u.trim());
      const shortened = await Promise.all(urlList.map(async u => {
        const shortenedUrl = await createShortUrl(u, '');
        return {
          original: u,
          shortened: shortenedUrl
        };
      }));
      setShortenedURLs(shortened);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessText = async () => {
    if (!text) {
      setError('Please enter text containing URLs');
      toast.error('Please enter text containing URLs')
      return;
    }
    if (!navigator.onLine) {
      setError('No internet connection. Please check your network settings.');
      return;
    }
    setLoading(true);
    try {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      let newText = text;
      const urls = text.match(urlRegex) || [];
      const shortened = await Promise.all(urls.map(async url => ({
        original: url,
        shortened: await createShortUrl(url, '')
      })));

      shortened.forEach(({ original, shortened }) => {
        newText = newText.replace(original, shortened);
      });
      await navigator.clipboard.writeText(newText);
      toast.success('Text processed and copied to clipboard');
      setProcessedText(newText);
      setShortenedURLs(shortened);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
  };

  const handleOpen = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const ResultCard = ({ item }: { item: { original: string; shortened: string } }) => (
    <div className="group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 space-y-2 border border-gray-100">
      <div className="flex items-center space-x-2">
        <LinkIcon className="h-4 w-4 text-blue-500" />
        <p className="text-sm text-gray-500 truncate flex-1">{item.original}</p>
      </div>
      <p className="text-blue-600 font-medium select-all cursor-pointer hover:text-blue-700 transition-colors">
        {item.shortened}
      </p>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCopy(item.shortened)}
          className="hover:bg-blue-50"
          title="Copy"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleOpen(item.shortened)}
          className="hover:bg-blue-50"
          title="Open"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleShare(item.shortened)}
          className="hover:bg-blue-50"
          title="Share"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setSelectedURL(item.shortened);
            setShowQR(true);
          }}
          className="hover:bg-blue-50"
          title="QR Code"
        >
          <QrCode className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Toaster
        position='top-right'
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                URL Shortener
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="single" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="single">Single URL</TabsTrigger>
                  <TabsTrigger value="multiple">Multiple URLs</TabsTrigger>
                  <TabsTrigger value="text">Text Mode</TabsTrigger>
                </TabsList>

                <TabsContent value="single" className="space-y-4">
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center">
                        <Link className="h-4 w-4 text-gray-500" />
                      </div>
                      <Input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter URL to shorten"
                        className="pl-10"
                      />
                    </div>
                    <Input
                      value={alias}
                      onChange={(e) => {
                        setAlias(e.target.value);
                        checkAlias(e.target.value);
                      }}
                      placeholder="Custom alias (optional)"
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                    {aliasError && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {aliasError}
                      </p>
                    )}
                    <Button
                      onClick={handleShortenSingle}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        'Shorten URL'
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="multiple" className="space-y-4">
                  <Textarea
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                    placeholder="Enter URLs (one per line)"
                    rows={6}
                  />
                  <Button
                    onClick={handleShortenMultiple}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      'Shorten All URLs'
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="text" className="space-y-4">
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text containing URLs to shorten"
                    rows={8}
                  />

                  <div className="flex justify-between items-center">
                    <Button
                      onClick={handleProcessText}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        'Process Text'
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setText('');
                        setProcessedText('');
                        setShortenedURLs([]);
                        setError('');
                      }
                      }
                      className="text-blue-600"
                    >
                      Clear Text
                    </Button>
                  </div>
                  {processedText && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-700">Processed Text</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(processedText)}
                          className="text-blue-600"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{processedText}</p>
                    </div>
                  )}
                </TabsContent>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {shortenedURLs.length > 0 && (
                  <div className="space-y-3 animate-in fade-in-50 duration-500">
                    {shortenedURLs.map((item, index) => (
                      <ResultCard key={index} item={item} />
                    ))}
                  </div>
                )}
              </Tabs>
            </CardContent>
          </Card>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default URLShortener;