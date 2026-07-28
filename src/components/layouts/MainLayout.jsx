/* eslint-disable no-unused-vars */
import { createContext, useContext, useState } from "react"
import { Outlet } from "react-router-dom"
import { Toaster } from 'react-hot-toast';
import Navigation from "../page_elements/Navigation";
import Footer from "../page_elements/Footer";
import ScrollToTop from '../ScrollToTop';
import QuoteModal from "../modals/QuoteModal";

const QuoteModalContext = createContext({ openQuoteModal: () => {} });

// eslint-disable-next-line react-refresh/only-export-components
export const useQuoteModal = () => useContext(QuoteModalContext);

const MainLayout = () => {
  const [isDefault, setIsDefault] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const openQuoteModal = () => setIsQuoteOpen(true);
  const closeQuoteModal = () => setIsQuoteOpen(false);

  return (
    <QuoteModalContext.Provider value={{ openQuoteModal }}>
      <div className="min-h-screen w-full">
        <ScrollToTop />
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toasterId="default"
          toastOptions={{
            className: '',
            duration: 5000,
            removeDelay: 1000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />
        <Navigation isDefault={isDefault} setIsDefault={setIsDefault} />
        <Outlet />
        <Footer />
        <QuoteModal isOpen={isQuoteOpen} onClose={closeQuoteModal} />
      </div>
    </QuoteModalContext.Provider>
  )
}

export default MainLayout
