import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const status = new URLSearchParams(location.search).get("status");

  return (
    <div className="w-full h-screen">
      <Box
        sx={{
          textAlign: "center",
          mt: 10,
          px: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          {status === "success" ? "Payment Successful 🎉" : "Payment Failed ❌"}
        </Typography>

        <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
          {status === "success"
            ? "Thank you for your purchase!"
            : "Something went wrong. Please try again."}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
      </Box>
    </div>
  );
};

export default PaymentPage;
