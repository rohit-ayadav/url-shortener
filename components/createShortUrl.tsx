import toast from 'react-hot-toast';

const API_URL = 'https://resourcesandcarrier.online/api/urlshortener';
// const API_URL = 'http://localhost:3002/api/urlshortener';


const isValidAlias = (alias: string) => {
    // Only alphanumeric characters along with hyphen and underscore
    const regex = /^[a-zA-Z0-9_-]+$/;

    return regex.test(alias);
};

const createShortUrl = async (originalUrl: string, alias: string) => {
    // Check if user is connected to the internet before making the request
    if (!navigator.onLine) {
        toast.error('No internet connection. Please check your network settings.');
        throw new Error('No internet connection. Please check your network settings.');
    }
    if (alias) {
        if (!isValidAlias(alias)) {
            toast.error('Invalid alias. Please use only alphanumeric characters.');
            throw new Error('Invalid alias. Please use only alphanumeric characters.');
        }
    }
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
        // toast.success(`${data.message}`);
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

export default createShortUrl;