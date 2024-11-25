import React from "react";
import {
  Skeleton,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import Link from "next/link";

const KomikCard = ({ komik, gridColumns }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000); // Simulasikan loading 1 detik
    return () => clearTimeout(timer);
  }, []);

  const komikLink =
    komik.link && komik.link.includes("/komik/")
      ? `/komik/${komik.link.replace(/https:\/\/[^]+\/komik\/([^]+)\//, "$1")}/chapters`
      : "#";

  return (
    <Grid
      item
      xs={12 / gridColumns}
      sm={12 / gridColumns}
      md={12 / gridColumns}
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          maxWidth: 200,
          width: "100%",
          backgroundColor: "#424242",
          boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.5)",
          transition: "transform 0.2s ease",
          animation: "fadeIn 0.5s ease", // Tambahkan animasi fade-in
          "&:hover": {
            transform: "scale(1.05)",
          },
          "@keyframes fadeIn": {
            // Definisikan keyframes untuk animasi fade-in
            "0%": { opacity: 0 },
            "100%": { opacity: 1 },
          },
        }}
      >
        {isLoading ? (
          <>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={200}
              sx={{ backgroundColor: "#616161" }}
            />
            <Skeleton
              variant="text"
              sx={{
                fontSize: "1rem",
                backgroundColor: "#616161",
                margin: "8px",
              }}
            />
          </>
        ) : (
          <CardActionArea component={Link} href={komikLink}>
            <CardMedia
              component="img"
              height="200"
              image={komik.thumbnail || "/placeholder-thumbnail.png"}
              alt={komik.judul}
              sx={{ backgroundColor: "black" }}
            />
            <CardContent>
              <Typography
                variant="body2"
                component="div"
                align="center"
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  WebkitLineClamp: 2,
                  color: "white",
                  fontWeight: 500,
                }}
              >
                {komik.judul}
              </Typography>
            </CardContent>
          </CardActionArea>
        )}
      </Card>
    </Grid>
  );
};

export default KomikCard;
