import React from "react";
import { TextField, Box } from "@mui/material";

const SearchBar = ({ searchQuery, setSearchQuery, handleSearchSubmit }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: "20px",
        width: "100%",
        maxWidth: "600px",
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Cari komik..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearchSubmit}
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "4px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white", // Warna border putih
            },
            "&:hover fieldset": {
              borderColor: "#00bcd4", // Warna border saat hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00bcd4", // Warna border saat fokus
            },
          },
          "& .MuiInputBase-input": {
            color: "black", // Warna teks hitam
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
