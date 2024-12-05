'use client';

import { useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';
import HistoryList from '@/components/HistoryList';
import CustomAlert from '@/components/Alert'; // Impor komponen CustomAlert

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false); // State untuk menangani status loading penghapusan
  const [alert, setAlert] = useState(null); // State untuk menyimpan alert
  const router = useRouter();

  useEffect(() => {
    const user = Cookie.get('user');
    if (!user) {
      router.push('/login'); // Jika pengguna belum login, redirect ke halaman login
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await fetch(
          '/api/getHistory',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user}`, // Menyertakan cookie user jika sudah login
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            'Failed to fetch history',
          );
        }

        const data = await response.json();
        setHistory(data.history);
      } catch (error) {
        console.error(
          'Error fetching history:',
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    // Ambil data awal
    fetchHistory();

    // Polling untuk data terbaru setiap 10 detik
    const interval = setInterval(
      fetchHistory,
      5000,
    );

    // Bersihkan interval saat komponen di-unmount
    return () => clearInterval(interval);
  }, [router]);

  const handleHistoryClick = (
    komikId,
    chapterNumber,
  ) => {
    router.push(
      `/komik/komikindo/${komikId}/chapters/${chapterNumber}`,
    );
  };

  const handleDeleteHistory = async (
    historyId,
  ) => {
    setDeleting(true); // Set status deleting menjadi true untuk menampilkan loading
    try {
      const response = await fetch(
        '/api/deletehistory',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ historyId }),
        },
      );

      if (response.ok) {
        setAlert({
          message: 'History deleted successfully',
          type: 'success',
        });
        // Refresh the history list after deletion
        setHistory(
          history.filter(
            (item) => item._id !== historyId,
          ),
        );
      } else {
        setAlert({
          message: 'Failed to delete history',
          type: 'error',
        });
      }
    } catch (error) {
      console.error(
        'Error deleting history:',
        error,
      );
      setAlert({
        message: 'Error deleting history',
        type: 'error',
      });
    } finally {
      setDeleting(false); // Set status deleting menjadi false setelah proses selesai
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-5">
      <h1 className="text-2xl font-bold mb-4">
        History of Read Chapters
      </h1>

      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)} // Menutup alert ketika timer habis
        />
      )}

      {/* Tampilkan loading spinner jika sedang menghapus history */}
      {deleting && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="text-white">
            Deleting...
          </div>
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
