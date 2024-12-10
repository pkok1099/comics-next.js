'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface HistoryItem {
  _id: string;
  title: string;
  chapterId: string;
  thumbnailUrl: string;
  timestamp: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch('/api/history/gets');
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  const handleDelete = async (historyId: string) => {
    try {
      const response = await fetch(`/api/history/delete?historyId=${historyId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete history item');
      }
      setHistory(history.filter(item => item._id !== historyId));
    } catch (err) {
      setError('Failed to delete history item');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Reading History</h1>
      {history.length === 0 ? (
        <p>No reading history found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div key={item._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={item.thumbnailUrl || '/placeholder.svg'}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-600 mb-2">Chapter: {item.chapterId}</p>
                <p className="text-gray-500 text-sm mb-4">
                  Last read: {new Date(item.timestamp).toLocaleString()}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => router.push(`/komikindo/${encodeURIComponent(item.title)}/chapters/${item.chapterId}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Continue Reading
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

