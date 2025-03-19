import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
import { Container, Grid, Typography, Box, Link, IconButton } from "@mui/material";
import { Twitter, Facebook, Instagram} from "@mui/icons-material";
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Career Helping AI",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />

            {/* Updated Footer */}
            <Box component="footer" sx={{ bgcolor: "black", py: 6, color: "gray.300" }}>
              <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="space-between">
                  {/* Left Section - Logo & Subscription */}
                  <Grid item xs={12} md={3}>
                    
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Connect with us
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <IconButton sx={{ color: "white" }}><Twitter style={{fontSize:'40px'}}/></IconButton>
                      <IconButton sx={{ color: "white" }}><Facebook style={{fontSize:'40px'}}/></IconButton>
                      <IconButton sx={{ color: "white" }}><Instagram style={{fontSize:'40px'}}/></IconButton>
                      <IconButton sx={{ color: "white" }}><LinkedInIcon style={{fontSize:'40px'}}/></IconButton>
                    </Box>
                  </Grid>

                  {/* Center Section - Links */}
                  <Grid item xs={12} md={6}>
                    <Grid container spacing={4}>
                      <Grid item xs={4}>
                        <Typography variant="subtitle1" color="white">The Project</Typography>
                        <Link href="#" color="#4f5250" display="block" style={{textDecoration:"none"}}>About</Link>
                        <Link href="#" color="#4f5250" display="block" style={{textDecoration:"none"}}>Blog</Link>

                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle1" color="white" >Learn More</Typography>
                        <Link href="#" color="#4f5250" display="block" style={{textDecoration:"none"}}>Teams</Link>
                        <Link href="#" color="#4f5250" display="block" style={{textDecoration:"none"}}>Creators</Link>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle1" color="white">Support</Typography>
                        <Link href="#" color="#4f5250" display="block" style={{textDecoration:"none"}}>Contact</Link>
                        <Link href="#" color="#4f5250" display="block" style={{textDecoration:"none"}}>FAQ</Link>
                        <Link href="#" color="#4f5250" display="block" style={{textDecoration:"none"}}>Terms of Use</Link>
                        <Link href="#" color="#4f5250" display="block" style={{textDecoration:"none"}}>Privacy Policy</Link>
                      </Grid>
                    </Grid>
                  </Grid>

                </Grid>
              </Container>
            </Box>

          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
