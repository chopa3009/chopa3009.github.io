import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import Title from "./components/Title";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Courses from "./pages/Courses";
import Cosmetics from "./pages/Cosmetics";
import Masters from "./pages/Masters";
import Haircut from "./pages/Haircut";
import Coloring from "./pages/Coloring";
import Shop from "./pages/Shop";
import Restoration from "./pages/Restoration";
import AdminPanel from "./pages/AdminPanel";
import ModalPopup from "./components/ModalPopup";
import LoadingSpinner from "./components/LoadingSpinner";


import "./js/i18n";

function AppWrapper() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAdminPage = location.pathname === "/admin";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(isHomePage);
  const [homeReady, setHomeReady] = useState(!isHomePage);
  const [hasVisited, setHasVisited] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Анімація появи сторінок
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  useEffect(() => {
    if (!isHomePage) setHasVisited(true);
  }, [isHomePage]);

  useEffect(() => {
    if (isHomePage) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
        setHomeReady(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setHomeReady(true);
    }
  }, [isHomePage]);

  useEffect(() => {
    if (homeReady && !loading) {
      if (location.hash) {
        const el = document.querySelector(location.hash);
        if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [location, homeReady, loading]);

  const showHeaderFooter = !isAdminPage && (!isHomePage || (isHomePage && (hasVisited || (homeReady && !loading))));
  const showTitleNav = !isAdminPage && (!isHomePage || (isHomePage && loading && hasVisited));

  return (
    <>
      {showHeaderFooter && <Header />}
      {showTitleNav && <Title />}
      {showTitleNav && <Navigation />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Routes location={location} key={location.pathname + location.hash}>
          <Route
            path="/"
            element={<Home openModal={openModal} />}
          />
          <Route
            path="/about"
            element={
              <motion.div {...pageVariants}>
                <AboutUs />
              </motion.div>
            }
          />
          <Route
            path="/courses"
            element={
              <motion.div {...pageVariants}>
                <Courses openModal={openModal}/>
              </motion.div>
            }
          />
          <Route
            path="/cosmetics"
            element={
              <motion.div {...pageVariants}>
                <Cosmetics />
              </motion.div>
            }
          />
          <Route
            path="/masters"
            element={
              <motion.div {...pageVariants}>
                <Masters />
              </motion.div>
            }
          />
          <Route
            path="/haircut"
            element={
              <motion.div {...pageVariants}>
                <Haircut openModal={openModal} />
              </motion.div>
            }
          />
          <Route
            path="/coloring"
            element={
              <motion.div {...pageVariants}>
                <Coloring openModal={openModal} />
              </motion.div>
            }
          />
          <Route
            path="/restoration"
            element={
              <motion.div {...pageVariants}>
                <Restoration openModal={openModal} />
              </motion.div>
            }
          />
          <Route
            path="/shop"
            element={
              <motion.div {...pageVariants}>
                <Shop openModal={openModal} />
              </motion.div>
            }
          />
 <Route
            path="/admin"
            element={
              <motion.div {...pageVariants}>
                <AdminPanel openModal={openModal} />
              </motion.div>
            }
          />
        </Routes>
      )}

      {showHeaderFooter && <Footer />}
      <ModalPopup isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
