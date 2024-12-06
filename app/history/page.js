'use client';

import { useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';
import HistoryList from '@/components/HistoryList';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Loader from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Terminal } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false); // State untuk status loading penghapusan
  const [alert, setAlert] = useState(null); // State untuk menyimpan alert
  const router = useRouter();

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
    router.push(`/komik/komikindo/${komikId}/chapters/${chapterNumber}`);
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
        setAlert({
          message: 'History deleted successfully',
          type: 'success',
        });
        setHistory(history.filter((item) => item._id !== historyId));
      } else {
        setAlert({
          message: 'Failed to delete history',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error deleting history:', error);
      setAlert({
        message: 'Error deleting history',
        type: 'error',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 p-5 text-white'>
      <h1 className='mb-4 text-2xl font-bold'>History of Read Chapters</h1>

      {alert && (
        <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
          <Terminal className='h-4 w-4' />
          <AlertTitle>
            {alert.type === 'error' ? 'Error' : 'Success'}
          </AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

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
