'use client';

import { useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';
import HistoryList from '@/components/history/HistoryList';
import Loader from '@/components/ui/loader';
import { toast, useToast } from '@/hooks/use-toast'; // Import toast ShadCN

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false); // State untuk status loading penghapusan
  const router = useRouter();
  const { toast } = useToast(); // Menggunakan hook useToast

  useEffect(() => {
    const user = Cookie.get('user');
    if (!user) {
      router.push('/login'); // Redirect ke halaman login jika belum login
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/getHistory', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user}`, // Sertakan token user
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }

        const data = await response.json();
        setHistory(data.history);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data awal
    fetchHistory();

    // Polling setiap 10 detik
    const interval = setInterval(fetchHistory, 5000);

    // Bersihkan interval saat komponen di-unmount
    return () => clearInterval(interval);
  }, [router]);

  const handleHistoryClick = (komikId, chapterNumber) => {
    router.push(`/komikindo/${komikId}/chapters/${chapterNumber}`);
  };

  const handleDeleteHistory = async (historyId) => {
    setDeleting(true);
    try {
      const response = await fetch('/api/deletehistory', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ historyId }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'History deleted successfully',
          variant: 'default',
        });
        setHistory(history.filter((item) => item._id !== historyId));
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete history',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting history:', error);
      toast({
        title: 'Error',
        description: 'Error deleting history',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 p-5 text-white'>
      <h1 className='mb-4 text-2xl font-bold'>History of Read Chapters</h1>

      {deleting && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <Loader />
          <p className='ml-2'>Deleting...</p>
        </div>
      )}

      <HistoryList
        history={history}
        loading={loading}
        onHistoryClick={handleHistoryClick}
        onDeleteHistory={handleDeleteHistory}
      />
    </div>
  );
};

export default History;
