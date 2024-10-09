"use client";
import React, { useEffect, useRef, useState } from 'react';
import { FaLink, FaQrcode, FaShareAlt } from 'react-icons/fa';
import { MdContentCopy, MdOpenInNew } from 'react-icons/md';
import { AiOutlineLoading3Quarters, AiOutlineDownload } from 'react-icons/ai';
import QRCode from 'react-qr-code';
import toast, { Toaster } from 'react-hot-toast';

const URLShortener = () => {
  const [mode, setMode] = useState('single');
  const [singleURL, setSingleURL] = useState('');
  const [multipleURLs, setMultipleURLs] = useState('');
  const [text, setText] = useState('');
  const [shortenedURLs, setShortenedURLs] = useState<{ original: string; shortened: string; }[]>([]);
  const [processedText, setProcessedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [selectedURL, setSelectedURL] = useState<string | null>(null);
  const [shortenTrue, setShortenTrue] = useState(false);
  const [alias, setAlias] = useState("");
  const [aliasError, setAliasError] = useState('');

  useEffect(() => {
    checkAlias(alias);
  }, [alias]);

  const normalizeUrl = (url: string) => {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const shortenURL = async (originalUrl: string, retryCount = 0, alias1 = "") => {
    setError('');
    setShortenTrue(false);
    if (aliasError) {
      toast.error(aliasError);
      return;
    }
    const body = JSON.stringify(alias1 ? { originalUrl, alias1 } : { originalUrl });

    try {
      const response = await fetch('https://resourcesandcarrier.online/api/urlshortener', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();


      if (!response.ok || !data.shortenURL) {
        if (retryCount < 5) {
          console.warn(`Retrying... Attempt ${retryCount + 1}`);
          return shortenURL(originalUrl, retryCount + 1, alias1);
        }
        const errorMsg = data.message;
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      toast.success(data.message || 'URL shortened successfully');
      setShortenTrue(true);
      return data.shortenURL;
    } catch (error) {
      setError(`${error}`);
      console.error('Error:', error);
      throw error;
    }
  };
  const checkAlias = (alias: string) => {
    if (alias.startsWith('http://') || alias.startsWith('https://')) {
      setAliasError('Alias cannot start with http:// or https://');
      return '';
    }
    if (alias.length > 0 && !/^[a-zA-Z0-9_-]*$/.test(alias)) {
      setAliasError('Alias can only contain letters, numbers, hyphens, and underscores');
      return '';
    }
    if (alias.length > 0 && !/^[a-zA-Z]/.test(alias)) {
      setAliasError('Alias must start with a letter');
      return '';
    }
    if (alias.match("admin") || alias.match("api") || alias.match("auth") || alias.match("login") || alias.match("logout") || alias.match("register") || alias.match("signup") || alias.match("signin") || alias.match("signout") || alias.match("password") || alias.match("reset") || alias.match("user") || alias.match("users") || alias.match("profile") || alias.match("account") || alias.match("settings") || alias.match("dashboard") || alias.match("admin") || alias.match("administrator") || alias.match("moderator") || alias.match("moderators") || alias.match("staff") || alias.match("support") || alias.match("help") || alias.match("contact") || alias.match("about") || alias.match("terms") || alias.match("privacy") || alias.match("cookies") || alias.match("gdpr") || alias.match("legal") || alias.match("tos") || alias.match("dmca") || alias.match("report") || alias.match("abuse") || alias.match("feedback") || alias.match("blog") || alias.match("news") || alias.match("updates") || alias.match("status") || alias.match("api") || alias.match("docs") || alias.match("documentation") || alias.match("developer") || alias.match("developers") || alias.match("dev") || alias.match("support") || alias.match("help") || alias.match("contact") || alias.match("contactus") || alias.match("contact-us") || alias.match("support") || alias.match("supportus") || alias.match("support-us") || alias.match("help") || alias.match("helpus") || alias.match("help-us") || alias.match("feedback") || alias.match("feedbackus") || alias.match("feedback-us") || alias.match("report") || alias.match("reportus") || alias.match("report-us") || alias.match("abuse") || alias.match("abuseus") || alias.match("abuse-us") || alias.match("admin") || alias.match("adminus") || alias.match("admin-us") || alias.match("administrator") || alias.match("administratorus") || alias.match("administrator-us") || alias.match("moderator") || alias.match("moderatorus") || alias.match("moderator-us") || alias.match("moderators") || alias.match("moderatorsus") || alias.match("moderators-us")) {
      setAliasError('Alias cannot contain reserved keywords');
      return '';
    }

    if (alias.length > 0 && alias.length < 4) {
      setAliasError('Alias must be at least 4 characters long');
      return '';
    }
    if (alias.length > 0 && alias.length > 20) {
      setAliasError('Alias must be at most 20 characters long');
      return '';
    }

    if (alias.length > 0 && !/[a-zA-Z0-9]$/.test(alias)) {
      setAliasError('Alias must end with a letter or number');
      return '';
    }

    setAliasError('');
    return alias;

  };
  const handleShortenSingle = async () => {
    if (!singleURL) {
      setError('Please enter a URL');
      return;
    }
    const checkedAlias = checkAlias(alias);
    const normalizedURL = normalizeUrl(singleURL);
    setLoading(true);

    try {
      const shortened = await shortenURL(normalizedURL, 0, checkedAlias);
      if (shortened) {
        setShortenedURLs([{ original: normalizedURL, shortened }]);
        setShortenTrue(true);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleShortenMultiple = async () => {
    if (!multipleURLs) {
      setError('Please enter URLs');
      return;
    }

    setLoading(true);
    setError('');
    const urls = multipleURLs.split('\n').filter(url => url.trim());

    try {
      const shortened = await Promise.all(urls.map(url => shortenURL(url)));
      setShortenedURLs(urls.map((original, index) => ({
        original,
        shortened: shortened[index] as string,
      })));
      setShortenTrue(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleShortenText = async () => {
    if (!text) {
      setError('Please enter some text');
      return;
    }

    setLoading(true);
    setError('');
    setShortenedURLs([]);
    setProcessedText('');

    try {
      let processedText = text;

      processedText = processedText.replace(/\*\*/g, '*');
      processedText = processedText.replace(/__/g, '_');
      processedText = processedText.replace(/\[([^\]]+)\]\((https?:\/\/[^\)\s]+)\)/g, '$2');


      setProcessedText(processedText);
      setText(processedText);

      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = text.match(urlRegex) || [];
      const shortened = await Promise.all(urls.map(url => shortenURL(url)));
      const newShortenedURLs = urls.map((original, index) => ({ original, shortened: shortened[index] }));

      setShortenedURLs(newShortenedURLs);
      processedText = text;
      newShortenedURLs.forEach(({ original, shortened }) => {
        processedText = processedText.replace(original, shortened);
      });
      setProcessedText(processedText);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);

    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const handleOpen = (url: string) => {
    const safeUrl = normalizeUrl(url);
    window.open(safeUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShare = (url: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Shortened URL',
        url: url,
      }).then(() => {
        console.log('URL shared successfully');
      }).catch(console.error);
    } else {
      alert('Web Share API not supported in your browser');
    }
  };

  const handleShowQR = (url: string) => {
    setSelectedURL(url);
    setShowQR(true);
  };

  const sanitizeFilename = (url: string) => url.replace(/[^a-z0-9]/, '_').toLowerCase();
  const handleDownloadQR = () => {
    console.log('function start for downloading...');
  };


  const handleCopyProcessedText = () => {
    navigator.clipboard.writeText(processedText);
    alert('Processed text copied to clipboard!');
  };

  const handleOpenAllURLs = () => {
    shortenedURLs.forEach(({ shortened }) => {
      window.open(shortened, '_blank');
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 p-4 sm:p-8">
        {/* <Header/> */}
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-sky-600 mb-6">Resources and Updates URL Shortener</h1>

            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setMode('single')}
                className={`px-4 py-2 rounded-full ${mode === 'single' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'} transition duration-300 ease-in-out hover:bg-sky-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50`}
              >
                Single Mode
              </button>
              <button
                onClick={() => setMode('multiple')}
                className={`px-4 py-2 rounded-full ${mode === 'multiple' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'} transition duration-300 ease-in-out hover:bg-sky-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50`}
              >
                Multiple Mode
              </button>
              <button
                onClick={() => setMode('text')}
                className={`px-4 py-2 rounded-full ${mode === 'text' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'} transition duration-300 ease-in-out hover:bg-sky-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50`}
              >
                Text Mode
              </button>
            </div>

            {mode === 'single' && (
              <div className="mb-6">
                <div className="flex items-center border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-sky-500 transition duration-300 ease-in-out">
                  <FaLink className="text-gray-400 ml-3" />
                  <input
                    type="url"
                    value={singleURL}
                    onChange={(e) => setSingleURL(e.target.value)}
                    placeholder="Enter URL to shorten"
                    className="w-full text-black px-4 py-2 focus:outline-none"
                  />
                  <input
                    type='text'
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder='Enter Alias (optional)'
                    className='w-full text-black px-4 py-2 focus:outline-none'
                  />

                </div>
                {aliasError && (
                  <div className="text-red-500 text-sm mt-1">{aliasError}</div>
                )}
                {error && (
                  <div className="text-red-500 text-sm mt-1">{error}</div>
                )}
                <button
                  onClick={handleShortenSingle}
                  disabled={loading}
                  className="mt-4 w-full bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold tracking-wide hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <AiOutlineLoading3Quarters className="animate-spin mx-auto" />
                  ) : (
                    'Shorten'
                  )}
                </button>
              </div>
            )}

            {mode === 'multiple' && (
              <div className="mb-6">
                <textarea
                  value={multipleURLs}
                  onChange={(e) => setMultipleURLs(e.target.value)}
                  placeholder="Enter URLs to shorten (one per line)"
                  rows={5}
                  className="w-full px-4 text-black py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300 ease-in-out"
                />   {error && (
                  <div className="text-red-500 text-sm mt-1">{error}</div>
                )}
                <button
                  onClick={handleShortenMultiple}
                  disabled={loading}
                  className="mt-4 w-full bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold tracking-wide hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >

                  {loading ? (
                    <AiOutlineLoading3Quarters className="animate-spin mx-auto" />
                  ) : (
                    'Shorten All'
                  )}
                </button>
              </div>
            )}

            {mode === 'text' && (
              <div className="mb-6">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text containing URLs to shorten"
                  rows={5}
                  className="w-full px-4 py-2 border-2 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300 ease-in-out"
                />
                {error && (
                  <div className="text-red-500 text-sm mt-1">{error}</div>
                )}
                <button
                  onClick={handleShortenText}
                  disabled={loading}
                  className="mt-4 w-full bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold tracking-wide hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <AiOutlineLoading3Quarters className="animate-spin mx-auto" />
                  ) : (
                    'Process Text'
                  )}
                </button>
              </div>
            )}

            {/* {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )} */}
            {
              shortenedURLs.length === 0 && (
                <>
                  <div className="mt-4 text-center text-gray-500">
                    <p>Shorten URLs to make them easier to share and manage.</p>
                  </div>


                </>
              )}

            {shortenTrue && (
              <div className="bg-gray-100 rounded-lg p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-4 text-sky-600">Shortened URLs:</h2>
                <ul className="space-y-4">
                  {shortenedURLs.map((item, index) => (
                    <li key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300 ease-in-out">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <p className="text-sm text-gray-500 truncate mb-1 sm:mb-0">{item.original}</p>
                        <p className="text-sky-600 font-medium">{item.shortened}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <button
                          onClick={() => handleCopy(item.shortened)}
                          className="flex items-center justify-center px-3 py-1 text-black bg-sky-100 rounded-full hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                          title="Copy shortened URL"
                        >
                          <MdContentCopy className="text-sky-600 mr-1" />
                          Copy
                        </button>
                        <button
                          onClick={() => handleOpen(item.shortened)}
                          className="flex items-center justify-center px-3 py-1 text-black bg-blue-100 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                          title="Open shortened URL"
                        >
                          <MdOpenInNew className="text-blue-600 mr-1" />
                          Open
                        </button>
                        <button
                          onClick={() => handleShare(item.shortened)}
                          className="flex items-center justify-center px-3 py-1 text-black bg-purple-100 rounded-full hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                          title="Share shortened URL"
                        >
                          <FaShareAlt className="text-purple-600 mr-1" />
                          Share
                        </button>
                        <button
                          onClick={() => handleShowQR(item.shortened)}
                          className="flex items-center justify-center px-3 text-black py-1 bg-yellow-100 rounded-full hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                          title="Show QR Code"
                        >
                          <FaQrcode className="text-yellow-600 mr-1" />
                          QR Code
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleOpenAllURLs}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                  >
                    Open All URLs
                  </button>
                </div>
              </div>
            )}

            {mode === 'text' && processedText && (
              <div className="mt-6 bg-gray-100 rounded-lg p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-4 text-sky-600">Processed Text:</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{processedText}</p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleCopyProcessedText}
                    className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                  >
                    Copy Processed Text
                  </button>
                </div>
              </div>
            )}

            {showQR && selectedURL && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                  <h3 className="text-lg text-black font-semibold mb-4">QR Code for {selectedURL}</h3>
                  <div className="bg-gray-200 h-48 flex items-center justify-center mb-4">
                    {/* <FaQrcode className="text-6xl text-gray-600" /> */}
                    <QRCode value={selectedURL} size={180} />
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => setShowQR(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleDownloadQR}
                      className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                    >
                      <AiOutlineDownload className="inline mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 space-y-4">
              <h2 className="text-2xl font-semibold text-sky-600">Instructions</h2>
              <p className="text-gray-700">1. Enter a URL, multiple URLs, or text containing URLs to shorten.</p>
              <p className="text-gray-700">2. Click the 'Shorten' or 'Process Text' button to generate shortened URLs.</p>
              <p className="text-gray-700">3. Use the provided options to copy, open, share, or generate QR codes for your shortened URLs.</p>
              <p className="text-gray-700">4. In text mode, you can copy the processed text with shortened URLs.</p>
              <p className="text-gray-700">5. Use the 'Open All URLs' button to verify all shortened URLs in new tabs.</p>

              <h2 className="text-2xl font-semibold text-sky-600">Use Cases</h2>
              <ul className="list-disc list-inside text-gray-700">
                <li>Social media posts with character limits</li>
                <li>SMS and text messages</li>
                <li>Print materials where long URLs are impractical</li>
                <li>Tracking click-through rates on marketing campaigns</li>
                <li>Shortening URLs within larger text bodies</li>
              </ul>

              {/* <h2 className="text-2xl font-semibold text-sky-600">Privacy Policy</h2>
                            <p className="text-gray-700">We use a third-party API to shorten URLs. Please be aware that the privacy policies of the URL shortening service provider may apply. We do not store or have access to any personal information related to the shortened URLs. The URLs you shorten are processed through the third-party service, and their retention and usage policies may vary. We recommend reviewing the privacy policy of the URL shortening service for more information on how they handle data.</p> */}

              <h2 className="text-2xl font-semibold text-sky-600">Terms of Service</h2>
              <p className="text-gray-700">By using this service, you agree not to use it for any illegal or malicious purposes. We reserve the right to disable any shortened URLs that violate our terms of service or the terms of service of the third-party URL shortening provider.</p>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>This service is provided by the <a href='/'>Resources and Updates </a> community</p>
            </div>
          </div>
        </div>

      </div >
    </>
  );
};

export default URLShortener;
