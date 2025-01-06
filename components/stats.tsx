interface StatsProps {
    totalShortenedUrls: number;
    totalClicks: number;
}

export const Stats = ({ totalShortenedUrls, totalClicks }: StatsProps) => (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md text-center">
        <p className="text-lg font-semibold text-gray-700">
            We have shortened <span className="text-blue-600">{totalShortenedUrls}</span> URLs
            with a total of <span className="text-blue-600">{totalClicks}</span> clicks!
        </p>
    </div>
);