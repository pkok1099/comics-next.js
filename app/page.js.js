"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  List,
  ListItem,
  CardMedia,
  Typography,
} from "@mui/material";
import KomikCard from "./components/KomikCard";
import Pagination from "./components/Pagination";

const KomikList = () => {
  const [komikList, setKomikList] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [gridColumns, setGridColumns] = useState(3);

  // Fetch Komik Data
  const fetchKomik = async (page) => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "";
      const response = await fetch(`${apiUrl}/api/komik?page=${page}`);
      const data = await response.json();
      setKomikList(data.komikList || []);
      setPagination(data.pagination || []);
    } catch (error) {
      console.error("Error fetching komik data:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  // Fetch Search Results
  const fetchSearchResults = async (query) => {
    if (query) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "";
        const response = await fetch(`${apiUrl}/api/komik/search/${query}/1`);
        const data = await response.json();
        setSearchResults(data.comics || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Handle Search Input Change
  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Handle window resizing for grid column adjustment
  useEffect(() => {
    const handleResize = () => {
      setGridColumns(window.innerWidth <= 768 ? 4 : 3);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial grid columns
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearchSubmit = (event) => {
    if (event.key === "Enter") {
      router.push(`/search/${searchQuery}`);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#424242",
        color: "white",
        padding: "20px",
      }}
    >
      {/* Search Bar */}
      <TextField
        label="Cari Komik"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleSearchSubmit}
        sx={{
          maxWidth: "600px",
          marginBottom: "20px",
          backgroundColor: "#333",
        }}
      />

      {/* Search Suggestions */}
      {searchQuery && (
        <Box
          sx={{
            maxHeight: "200px",
            overflowY: "auto",
            backgroundColor: "#333",
            width: "100%",
            marginBottom: "20px",
          }}
        >
          <List>
            {searchResults.slice(0, 5).map((komik) => (
              <ListItem
                button
                key={komik.link}
                onClick={() =>
                  router.push(
                    `/komik/${komik.link.replace(/https:\/\/[^]+\/komik\/([^]+)\//, "$1")}/chapters`,
                  )
                }
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  padding: 1,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#555" },
                }}
              >
                <CardMedia
                  component="img"
                  src={komik.image}
                  alt={komik.title}
                  sx={{ width: 50, height: 50, borderRadius: "8px" }}
                />
                <Typography variant="body2" sx={{ color: "white" }}>
                  {komik.title}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Komik List */}
      <Box
        sx={{
          overflowX: "hidden",
          marginBottom: "30px",
          marginTop: "20px",
          display: "grid",
          gap: 2,
          width: "100%",
          height: "calc(100vh - 100px)",
          backgroundColor: "#424242",
          position: "relative",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          animation: "fadeIn 0.5s ease", // Tambahkan animasi fade-in
          "@keyframes fadeIn": {
            // Definisikan keyframes untuk animasi fade-in
            "0%": { opacity: 0 },
            "100%": { opacity: 1 },
          },
        }}
      >
        <Grid container spacing={2}>
          {komikList.map((komik) => (
            <KomikCard
              key={komik.judul}
              komik={komik}
              gridColumns={getGridColumns()}
            />
          ))}
        </Grid>
      </Box>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        pagination={pagination}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
};

export default KomikList;
