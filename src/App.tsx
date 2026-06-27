import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ============================================================
// Types
// ============================================================
type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  gradient: string;
};

type CartItem = Product & {
  quantity: number;
};

type Customer = {
  name: string;
  email: string;
  phone: string;
};

type ToastTone = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  tone: ToastTone;
};

type CashfreeMode = "sandbox" | "production";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

type Transaction = {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  status: "Success" | "Pending" | "Failed";
};

type StoreConfig = {
  themeColor: string;
  themeBg: string;
  heroTitle: string;
  heroDescription: string;
  heroImageUrl: string;
  exitPopupTitle: string;
  exitPopupMessage: string;
  exitPopupDiscount: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  cashfreeAppId: string;
  cashfreeSecretKey: string;
  cashfreeMode: CashfreeMode;
  cashfreeEndpoint: string;
  isSimulationMode: boolean;
};

// ============================================================
// Defaults & Constants
// ============================================================
const CASHFREE_SDK_SRC = "https://sdk.cashfree.com/js/v3/cashfree.js";

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "launch-site-kit",
    name: "Launch Site Kit",
    category: "Website templates",
    description: "Responsive sections, conversion copy, and Vite-ready page layouts.",
    price: 2499,
    gradient: "linear-gradient(135deg, #2c1a88 0%, #7650f2 55%, #f5b83b 100%)",
  },
  {
    id: "creator-commerce-pack",
    name: "Creator Commerce Pack",
    category: "Store assets",
    description: "Product pages, checkout microcopy, email flows, and launch visuals.",
    price: 3499,
    gradient: "linear-gradient(135deg, #0f766e 0%, #33b3a6 48%, #f7d08a 100%)",
  },
  {
    id: "brand-motion-system",
    name: "Brand Motion System",
    category: "Motion presets",
    description: "Reusable motion directions for product reveals and landing pages.",
    price: 1999,
    gradient: "linear-gradient(135deg, #111827 0%, #6047ff 45%, #ff8a4c 100%)",
  },
  {
    id: "checkout-ui-kit",
    name: "Checkout UI Kit",
    category: "Payment UI",
    description: "Cart, address, payment, and post-purchase screens for fast builds.",
    price: 2999,
    gradient: "linear-gradient(135deg, #3b0764 0%, #c026d3 48%, #facc15 100%)",
  },
];

const DEFAULT_CONFIG: StoreConfig = {
  themeColor: "#6b4ce6",
  themeBg: "#0b0618",
  heroTitle: "DigiCraft Store",
  heroDescription: "Launch polished websites, creator stores, and checkout flows with production-ready design kits.",
  heroImageUrl: "/images/digicraft-hero.jpg",
  exitPopupTitle: "Before you go",
  exitPopupMessage: "Save your launch stack! Add a DigiCraft Kit now and get started instantly with professional templates.",
  exitPopupDiscount: "LAUNCH15",
  contactEmail: "tipsactivelife@gmail.com",
  contactPhone: "7307493338",
  contactAddress: "FF Shop No. 6, Arohi Arcade, Munshipulia, Lucknow - 226016",
  cashfreeAppId: "13027093ee54013453fbc1eb089072031",
  cashfreeSecretKey: "cfsk_ma_prod_23c0f05b2c2f34547eee4dc55405f3f1_50516b4a",
  cashfreeMode: "production",
  cashfreeEndpoint: "",
  isSimulationMode: true,
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "TX-9938A",
    productId: "creator-commerce-pack",
    productName: "Creator Commerce Pack",
    amount: 3499,
    customerName: "Sandeep Kumar",
    customerEmail: "sandeep@example.in",
    customerPhone: "9876543210",
    date: "2026-06-25 14:32",
    status: "Success",
  },
  {
    id: "TX-1182D",
    productId: "launch-site-kit",
    productName: "Launch Site Kit",
    amount: 2499,
    customerName: "Anjali Singh",
    customerEmail: "anjali@yahoo.com",
    customerPhone: "9123456789",
    date: "2026-06-26 09:15",
    status: "Success",
  },
  {
    id: "TX-3382F",
    productId: "checkout-ui-kit",
    productName: "Checkout UI Kit",
    amount: 2999,
    customerName: "Aarav Sharma",
    customerEmail: "aarav.sharma@gmail.com",
    customerPhone: "8888777766",
    date: "2026-06-27 11:04",
    status: "Success",
  },
  {
    id: "TX-2210G",
    productId: "brand-motion-system",
    productName: "Brand Motion System",
    amount: 1999,
    customerName: "Pooja Verma",
    customerEmail: "pooja.v@outlook.com",
    customerPhone: "7777666555",
    date: "2026-06-27 18:20",
    status: "Success",
  },
];

// Global load helper
let cashfreeSdkPromise: Promise<void> | null = null;

function loadCashfreeSdk() {
  if ((window as any).Cashfree) {
    return Promise.resolve();
  }

  if (!cashfreeSdkPromise) {
    cashfreeSdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = CASHFREE_SDK_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Cashfree SDK could not be loaded."));
      document.head.appendChild(script);
    });
  }

  return cashfreeSdkPromise;
}

// ============================================================
// Main Application Component
// ============================================================
export default function App() {
  // Load initial states from localStorage if they exist
  const [config, setConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem("digicraft_config");
    if (saved) {
      try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("digicraft_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_PRODUCTS;
      }
    }
    return DEFAULT_PRODUCTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("digicraft_transactions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TRANSACTIONS;
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // User State
  const [user, setUser] = useState<{ email: string; phone: string; name: string } | null>(() => {
    const saved = localStorage.getItem("digicraft_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginName, setLoginName] = useState("");

  // Customer Checkout Details
  const [customer, setCustomer] = useState<Customer>(() => {
    if (user) {
      return { name: user.name, email: user.email, phone: user.phone };
    }
    return { name: "DigiCraft Buyer", email: "buyer@example.com", phone: "9999999999" };
  });

  // Current view selection (Main vs Secret Admin Portal)
  // Determined by hash "#secret-admin" or route state
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const cartQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  // Sync Customer checkout state when User state logs in
  useEffect(() => {
    if (user) {
      setCustomer({ name: user.name, email: user.email, phone: user.phone });
    }
  }, [user]);

  // Monitor secret hash URL triggers
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#secret-admin") {
        setIsAdminPortal(true);
      } else {
        setIsAdminPortal(false);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Save updates to localStorage
  const saveConfig = (updated: StoreConfig) => {
    setConfig(updated);
    localStorage.setItem("digicraft_config", JSON.stringify(updated));
  };

  const saveProducts = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem("digicraft_products", JSON.stringify(updated));
  };

  const saveTransactions = (updated: Transaction[]) => {
    setTransactions(updated);
    localStorage.setItem("digicraft_transactions", JSON.stringify(updated));
  };

  // Toast Notifier Helper
  const notify = (message: string, tone: ToastTone = "info") => {
    setToast({ id: Date.now(), message, tone });
  };

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  // Cart operations
  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current[product.id];
      return {
        ...current,
        [product.id]: {
          ...product,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      };
    });
    notify(`${product.name} added to cart!`, "success");
  };

  const removeOneFromCart = (productId: string) => {
    setCart((current) => {
      const existing = current[productId];
      if (!existing) return current;

      const next = { ...current };
      if (existing.quantity <= 1) {
        delete next[productId];
      } else {
        next[productId] = { ...existing, quantity: existing.quantity - 1 };
      }
      return next;
    });
  };

  const removeLineFromCart = (productId: string) => {
    setCart((current) => {
      const next = { ...current };
      delete next[productId];
      return next;
    });
  };

  // User Actions
  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPhone.trim()) {
      notify("Please fill in email and phone number", "error");
      return;
    }
    const newUser = {
      name: loginName.trim() || "Valued Customer",
      email: loginEmail.trim(),
      phone: loginPhone.trim(),
    };
    setUser(newUser);
    localStorage.setItem("digicraft_user", JSON.stringify(newUser));
    setLoginModalOpen(false);
    notify(`Welcome back, ${newUser.name}!`, "success");
  };

  const handleUserLogout = () => {
    setUser(null);
    localStorage.removeItem("digicraft_user");
    notify("Logged out successfully.", "info");
  };

  // Cashfree Order Checkout Handler
  const handleCheckout = async () => {
    if (!cartItems.length) {
      setCartOpen(true);
      notify("Please add at least one kit to checkout.", "info");
      return;
    }

    if (!customer.email.trim() || !customer.phone.trim()) {
      setCartOpen(true);
      notify("Please complete your email & phone number.", "error");
      return;
    }

    setIsCheckingOut(true);

    // If simulation mode is toggled true in the Admin panel:
    if (config.isSimulationMode) {
      setTimeout(() => {
        // Record as successful transactions
        const newTxList = [...transactions];
        cartItems.forEach((item) => {
          newTxList.unshift({
            id: `TX-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            productId: item.id,
            productName: item.name,
            amount: item.price * item.quantity,
            customerName: customer.name || "Customer",
            customerEmail: customer.email,
            customerPhone: customer.phone,
            date: new Date().toISOString().replace("T", " ").substring(0, 16),
            status: "Success",
          });
        });
        saveTransactions(newTxList);

        // Clear cart
        setCart({});
        setCartOpen(false);
        setIsCheckingOut(false);
        notify("Simulated payment via Cashfree was successful!", "success");

        // Open direct popup thank you/success receipt
        alert(
          `Thank you for your purchase!\n\nYour invoice details have been recorded.\nReceipt generated successfully for ${customer.name}.\n\nYou can access your downloads instantly in your profile dashboard!`
        );
      }, 1500);
      return;
    }

    // Real API integration attempt if simulated mode is toggled off and order endpoint is filled
    if (!config.cashfreeEndpoint) {
      notify("No order endpoint configured. Toggle Simulated checkout or fill endpoint inside Admin settings.", "info");
      setIsCheckingOut(false);
      return;
    }

    try {
      const orderResponse = await fetch(config.cashfreeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_amount: Number(subtotal.toFixed(2)),
          order_currency: "INR",
          customer_details: {
            customer_id: `digicraft_${Date.now()}`,
            customer_name: customer.name.trim() || "DigiCraft customer",
            customer_email: customer.email.trim(),
            customer_phone: customer.phone.trim(),
          },
          order_meta: {
            return_url: `${window.location.origin}${window.location.pathname}?order_id={order_id}`,
          },
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
          })),
        }),
      });

      let orderData: any = null;
      try {
        orderData = await orderResponse.json();
      } catch {
        orderData = null;
      }

      if (!orderResponse.ok) {
        throw new Error(
          (orderData && orderData.message) || `Order response returned ${orderResponse.status}`
        );
      }

      // Read payment session
      const paymentSessionId =
        orderData?.payment_session_id ||
        orderData?.paymentSessionId ||
        orderData?.data?.payment_session_id;

      if (!paymentSessionId) {
        throw new Error("Order endpoint did not return valid payment_session_id.");
      }

      await loadCashfreeSdk();

      if (!(window as any).Cashfree) {
        throw new Error("Cashfree SDK is not available.");
      }

      const cashfree = (window as any).Cashfree({ mode: config.cashfreeMode });
      const result = await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
      });

      if (result?.error) {
        throw new Error(result.error.message || "Cashfree checkout error");
      }

      notify("Checkout redirect complete.", "success");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Checkout failure.", "error");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Live Inject Custom Colors dynamically to target components
  const activeStyle = {
    "--brand-accent": config.themeColor,
  } as React.CSSProperties;

  return (
    <div style={activeStyle} className="min-h-screen bg-[#0b0618] text-white">
      {/* Dynamic Style Tags to apply the Admin configured Brand Accent live */}
      <style>{`
        .text-brand { color: ${config.themeColor}; }
        .bg-brand { background-color: ${config.themeColor}; }
        .border-brand { border-color: ${config.themeColor}; }
        .hover\\:bg-brand:hover { background-color: ${config.themeColor}; }
        .focus\\:border-brand:focus { border-color: ${config.themeColor}; }
      `}</style>

      {isAdminPortal ? (
        // ============================================================
        // SECRET ADMIN PORTAL VIEW
        // ============================================================
        <AdminPortal
          config={config}
          products={products}
          transactions={transactions}
          isAdminAuthenticated={isAdminAuthenticated}
          adminPasscode={adminPasscode}
          setAdminPasscode={setAdminPasscode}
          setIsAdminAuthenticated={setIsAdminAuthenticated}
          onSaveConfig={saveConfig}
          onSaveProducts={saveProducts}
          onSaveTransactions={saveTransactions}
          onClose={() => {
            window.location.hash = "";
            setIsAdminPortal(false);
          }}
        />
      ) : (
        // ============================================================
        // PUBLIC STOREFRONT VIEW
        // ============================================================
        <>
          <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
            <a href="#top" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#f5d48d]">
              <BrandMark color={config.themeColor} />
              {config.heroTitle.split(" ")[0] || "DigiCraft"}
            </a>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="hidden items-center gap-3 sm:flex">
                  <span className="text-xs text-white/60">Hello, {user.name}</span>
                  <button
                    type="button"
                    onClick={handleUserLogout}
                    className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/80 hover:bg-white/10"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(true)}
                  className="hidden rounded-full border border-[#f5d48d]/40 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#f5d48d] hover:bg-[#f5d48d]/10 sm:block"
                >
                  Sign In
                </button>
              )}

              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="group inline-flex items-center gap-3 rounded-full border border-white/25 bg-[#0b0618]/60 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#f5d48d] hover:text-[#f5d48d]"
              >
                Cart
                <span className="grid h-7 min-w-7 place-items-center rounded-full bg-white text-xs text-[#160d2d] transition group-hover:bg-[#f5d48d] font-bold">
                  {cartQuantity}
                </span>
              </button>
            </div>
          </nav>

          <HeroSection config={config} cartQuantity={cartQuantity} onOpenCart={() => setCartOpen(true)} />

          <main className="bg-[#f7f1e8] text-[#160d2d]">
            <ProductSection products={products} onAdd={addToCart} brandColor={config.themeColor} />
            <PaymentSection config={config} />
            <ContactSection config={config} />
            <Footer config={config} onSecretToggle={() => setIsAdminPortal(true)} />
          </main>

          {/* User Account / Profile dashboard built straight into the checkout */}
          <CartSidebar
            cartItems={cartItems}
            customer={customer}
            config={config}
            isCheckingOut={isCheckingOut}
            open={cartOpen}
            subtotal={subtotal}
            user={user}
            transactions={transactions}
            onAdd={addToCart}
            onCheckout={handleCheckout}
            onClose={() => setCartOpen(false)}
            onCustomerChange={setCustomer}
            onRemoveLine={removeLineFromCart}
            onRemoveOne={removeOneFromCart}
            onOpenLogin={() => setLoginModalOpen(true)}
          />

          <ExitPopup config={config} onClaim={() => {
            addToCart(products[0] || DEFAULT_PRODUCTS[0]);
            setCartOpen(true);
          }} />

          <CookieConsent />
          <Notification toast={toast} />
          <AIChatbot config={config} />

          {/* Easiest User Login Modal */}
          <AnimatePresence>
            {loginModalOpen && (
              <div className="fixed inset-0 z-[70] grid place-items-center bg-[#080416]/80 px-6 backdrop-blur-sm">
                <motion.div
                  className="w-full max-w-md overflow-hidden rounded-3xl bg-[#fffaf3] p-8 text-[#160d2d] shadow-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="flex items-center justify-between border-b border-[#e6d8c5] pb-4">
                    <h3 className="text-xl font-bold tracking-tight">Easy User Sign In</h3>
                    <button
                      type="button"
                      onClick={() => setLoginModalOpen(false)}
                      className="text-lg font-bold text-gray-500 hover:text-black"
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={handleUserLogin} className="mt-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sandeep Kumar"
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#d9cbb6] bg-white px-4 py-2.5 outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#d9cbb6] bg-white px-4 py-2.5 outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#d9cbb6] bg-white px-4 py-2.5 outline-none focus:border-brand"
                      />
                    </div>
                    <div className="rounded-xl bg-[#6b4ce6]/10 p-4 text-xs text-[#543ea3] leading-relaxed">
                      💡 <strong>Passwordless direct login:</strong> No complex password required. Sign in instantly to access purchased items & receipts immediately.
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-[#160d2d] py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand"
                    >
                      Authenticate & Proceed
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

// ============================================================
// Hero Component
// ============================================================
function HeroSection({ config, onOpenCart }: { config: StoreConfig; cartQuantity: number; onOpenCart: () => void }) {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#090512]">
      <motion.img
        src={config.heroImageUrl}
        alt="Premium digital product workspace"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 0.78, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,4,22,0.96)_0%,rgba(8,4,22,0.76)_42%,rgba(8,4,22,0.16)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-7xl items-center px-6 pb-20 pt-10 lg:px-10">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="mb-4 inline-block rounded-full bg-[#f5d48d]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#f5d48d]">
            🚀 Digital Delivery in 10-Seconds
          </span>
          <h1 className="text-5xl font-semibold tracking-[-0.08em] text-white sm:text-7xl lg:text-8xl leading-none">
            {config.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
            {config.heroDescription}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <motion.a
              href="#shop"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center rounded-full bg-[#f5d48d] px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#160d2d] transition hover:bg-white"
            >
              Get started
            </motion.a>
            <motion.button
              type="button"
              onClick={onOpenCart}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-white hover:bg-white/10"
            >
              My Cart
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// Shop Component
// ============================================================
function ProductSection({
  products,
  onAdd,
  brandColor,
}: {
  products: Product[];
  onAdd: (product: Product) => void;
  brandColor: string;
}) {
  return (
    <section id="shop" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="mb-12 max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em]" style={{ color: brandColor }}>
          PRODUCTS
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Launch-ready assets</h2>
        <p className="mt-4 text-lg leading-relaxed text-[#594f69]">
          Select premium digital products to load directly. Powered by Cashfree payments client sdk.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <motion.article
            key={product.id}
            className="group flex min-h-[430px] flex-col overflow-hidden rounded-[2rem] border border-[#ded2bf] bg-white p-4 text-[#160d2d] shadow-sm hover:shadow-md transition-all"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.08, duration: 0.55 }}
            whileHover={{ y: -6 }}
          >
            <div
              className="relative h-48 overflow-hidden rounded-[1.45rem]"
              style={{ background: product.gradient }}
            >
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute inset-x-4 top-4 flex justify-between items-center">
                <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  {product.category}
                </span>
                <span className="rounded-full bg-[#160d2d] px-3 py-1 text-[10px] font-bold text-[#f5d48d]">
                  INR {product.price}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col pt-5">
              <h3 className="text-xl font-bold tracking-tight text-[#160d2d]">{product.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#665f73]">{product.description}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-base font-bold text-[#160d2d]">INR {product.price.toLocaleString("en-IN")}</span>
                <button
                  type="button"
                  onClick={() => onAdd(product)}
                  className="rounded-full bg-[#160d2d] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-brand"
                >
                  + Add to cart
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Payment Info Component
// ============================================================
function PaymentSection({ config }: { config: StoreConfig }) {
  return (
    <section className="border-y border-[#dfd3c0] bg-[#fffaf3] py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#6b4ce6]">CASHFREE READY</span>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Secure Payment Gateway
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[#594f69]">
            All transactions are routed through Cashfree Payment APIs. Seamless credit cards, debit cards, NetBanking, UPI collect, and Wallet support inside India.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-xl bg-white border border-[#dfd3c0] px-4 py-2 text-xs font-semibold text-[#160d2d]">💳 Cards & UPI</span>
            <span className="rounded-xl bg-white border border-[#dfd3c0] px-4 py-2 text-xs font-semibold text-[#160d2d]">🏦 50+ Banks</span>
            <span className="rounded-xl bg-white border border-[#dfd3c0] px-4 py-2 text-xs font-semibold text-[#160d2d]">📱 Instant Settlement</span>
          </div>
        </div>

        <div className="rounded-3xl border border-[#ded2bf] bg-white p-8 shadow-sm">
          <h3 className="text-xl font-bold text-[#160d2d] mb-4">Cashfree Integration Status</h3>
          <div className="space-y-4 text-sm text-[#594f69]">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span>Environment Mode</span>
              <span className="font-bold text-brand uppercase">{config.cashfreeMode}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span>Checkout Protocol</span>
              <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">Redirect (_self)</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span>App ID Connected</span>
              <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                {config.cashfreeAppId ? `${config.cashfreeAppId.substring(0, 10)}...` : "None"}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span>Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" /> Active & Online
              </span>
            </div>
          </div>
          <div className="mt-6 text-xs bg-[#fffaf3] border border-[#f0e4cf] rounded-2xl p-4 leading-relaxed text-[#160d2d]">
            🔒 <strong>PCI-DSS Compliant:</strong> Real payment payloads are encrypted. Cashfree handles authorization, securing both merchant & customer assets.
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Contact Section
// ============================================================
function ContactSection({ config }: { config: StoreConfig }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 bg-[#f7f1e8] text-[#160d2d]">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#6b4ce6]">CONNECT WITH US</span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#160d2d]">Get instant support</h2>
          <p className="mt-4 text-lg text-[#594f69] leading-relaxed">
            Have questions about licenses, custom template adjustments, or your payments? Contact us anytime.
          </p>

          <div className="mt-8 space-y-5 text-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#160d2d] text-white">✉️</span>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email Address</p>
                <a href={`mailto:${config.contactEmail}`} className="font-semibold text-[#160d2d] hover:underline">
                  {config.contactEmail}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white">💬</span>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">WhatsApp Support</p>
                <a href={`https://wa.me/91${config.contactPhone}`} target="_blank" rel="noreferrer" className="font-semibold text-emerald-600 hover:underline">
                  +91 {config.contactPhone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#160d2d] text-white">📍</span>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Office Address</p>
                <p className="font-semibold text-gray-700">
                  {config.contactAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          alert("Thank you! Your message has been sent. We will reply within 2 hours.");
        }} className="rounded-3xl border border-[#ded2bf] bg-white p-8 shadow-sm space-y-4">
          <h3 className="text-xl font-bold">Send an Inquiry</h3>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase">Your Name</label>
            <input type="text" required className="mt-1 w-full rounded-xl border border-[#d9cbb6] bg-[#fffaf3] p-3 outline-none focus:border-brand" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase">Email</label>
            <input type="email" required className="mt-1 w-full rounded-xl border border-[#d9cbb6] bg-[#fffaf3] p-3 outline-none focus:border-brand" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase">Your Message</label>
            <textarea rows={4} required className="mt-1 w-full rounded-xl border border-[#d9cbb6] bg-[#fffaf3] p-3 outline-none focus:border-brand" />
          </div>
          <button type="submit" className="w-full bg-[#160d2d] text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-brand">
            Submit message
          </button>
        </form>
      </div>
    </section>
  );
}

// ============================================================
// Footer Component
// ============================================================
function Footer({ config, onSecretToggle }: { config: StoreConfig; onSecretToggle: () => void }) {
  return (
    <footer className="bg-[#120a23] text-white/70 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 border-b border-white/10 pb-12">
          <div>
            {/* Click/Double-click the brandmark to open secret Admin portal easily */}
            <div
              onDoubleClick={onSecretToggle}
              title="Double click for secret setup"
              className="flex items-center gap-3 font-semibold text-white cursor-pointer select-none"
            >
              <BrandMark color={config.themeColor} />
              <span className="text-lg tracking-wider font-bold text-[#f5d48d]">{config.heroTitle.split(" ")[0]}</span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-white/50">
              Premium templates and developer blueprints. Custom theme overrides enabled live.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Contact Info</h4>
            <ul className="space-y-2 text-xs">
              <li>Email: <a href={`mailto:${config.contactEmail}`} className="text-white hover:underline">{config.contactEmail}</a></li>
              <li>WhatsApp: <a href={`https://wa.me/91${config.contactPhone}`} className="text-white hover:underline">+91 {config.contactPhone}</a></li>
              <li>Office: {config.contactAddress}</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Integrations</h4>
            <ul className="space-y-2 text-xs">
              <li>Cashfree JavaScript Web SDK v3</li>
              <li>PCI-DSS Encrypted Payments</li>
              <li>Auto-delivery fulfillment system</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Security</h4>
            <p className="text-xs leading-relaxed text-white/40">
              No private keys exposed. Fully responsive. Perfect for local and international Indian payments.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between text-xs text-white/45">
          <p>© 2026 {config.heroTitle}. Lucknow, India. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#shop" className="hover:text-white">Shop</a>
            <span className="text-white/20">|</span>
            <button type="button" onClick={onSecretToggle} className="hover:text-white cursor-pointer">
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// Checkout / Cart Sidebar Component
// ============================================================
function CartSidebar({
  cartItems,
  customer,
  config,
  isCheckingOut,
  open,
  subtotal,
  user,
  transactions,
  onAdd,
  onCheckout,
  onClose,
  onCustomerChange,
  onRemoveLine,
  onRemoveOne,
  onOpenLogin,
}: {
  cartItems: CartItem[];
  customer: Customer;
  config: StoreConfig;
  isCheckingOut: boolean;
  open: boolean;
  subtotal: number;
  user: any;
  transactions: Transaction[];
  onAdd: (product: Product) => void;
  onCheckout: () => void;
  onClose: () => void;
  onCustomerChange: (customer: Customer) => void;
  onRemoveLine: (productId: string) => void;
  onRemoveOne: (productId: string) => void;
  onOpenLogin: () => void;
}) {
  // Find transactions associated with the logged-in customer's email
  const userPurchasedDownloads = useMemo(() => {
    if (!user) return [];
    return transactions.filter(
      (tx) => tx.customerEmail.toLowerCase().trim() === user.email.toLowerCase().trim() && tx.status === "Success"
    );
  }, [user, transactions]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50">
          <motion.button
            type="button"
            aria-label="Close cart"
            className="absolute inset-0 bg-[#080416]/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-[#fffaf3] text-[#160d2d] shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-[#e5d9c7] px-6 py-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#6b4ce6]">DIGICRAFT CHECKOUT</span>
                <h2 className="text-2xl font-semibold tracking-[-0.04em]">Your digital kits</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-11 w-11 place-items-center rounded-full border border-[#d9cbb6] text-xl transition hover:bg-[#160d2d] hover:text-white"
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* User Authentication Panel in Cart */}
              <div className="mb-6 rounded-2xl bg-white border border-[#dfd3c0] p-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-brand/15 text-brand px-2 py-0.5 rounded font-bold">LOGGED IN</span>
                      <span className="text-xs text-gray-500 font-mono">{user.email}</span>
                    </div>
                    <p className="text-sm font-semibold">Welcome, {user.name}!</p>

                    {userPurchasedDownloads.length > 0 ? (
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Your downloads (Instant access)</p>
                        {userPurchasedDownloads.map((tx) => (
                          <div key={tx.id} className="flex items-center justify-between bg-[#fffaf3] p-2.5 rounded-xl border border-[#ded2bf]">
                            <span className="text-xs font-semibold truncate max-w-[200px]">{tx.productName}</span>
                            <a
                              href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                                `// DigiCraft Store Download Link\n// Product: ${tx.productName}\n// Transaction: ${tx.id}\n\nThank you for purchasing! Download your live templates at: https://github.com/digicraft-templates/${tx.productId}`
                              )}`}
                              download={`DigiCraft_Blueprint_${tx.productId}.js`}
                              className="text-xs font-bold bg-[#160d2d] text-[#f5d48d] px-2.5 py-1 rounded hover:bg-brand transition"
                            >
                              Download Zip
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">No past orders detected yet. Purchase below to initiate immediate download blue-prints.</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold">Sign in for instant access</p>
                      <p className="text-xs text-gray-500 mt-1">Access your previous downloads & generate custom PDFs.</p>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenLogin}
                      className="rounded-xl bg-[#160d2d] text-[#f5d48d] px-4 py-2 text-xs font-bold"
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>

              {cartItems.length ? (
                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Item summary</p>
                  {cartItems.map((item) => (
                    <div key={item.id} className="border-b border-[#eadfce] pb-4">
                      <div className="flex gap-4">
                        <div className="h-16 w-16 shrink-0 rounded-xl" style={{ background: item.gradient }} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-semibold text-[#160d2d]">{item.name}</h3>
                              <p className="mt-1 text-sm text-[#665f73]">INR {item.price.toLocaleString("en-IN")}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => onRemoveLine(item.id)}
                              className="text-xs font-bold text-rose-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="mt-3 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => onRemoveOne(item.id)}
                              className="grid h-7 w-7 place-items-center rounded-full border border-[#d9cbb6] font-bold text-sm"
                            >
                              -
                            </button>
                            <span className="min-w-6 text-center font-semibold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => onAdd(item)}
                              className="grid h-7 w-7 place-items-center rounded-full border border-[#d9cbb6] font-bold text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-[#d9cbb6] rounded-3xl bg-white/40">
                  <p className="text-base font-semibold">Your cart is empty.</p>
                  <p className="mt-1 text-xs text-[#665f73]">Select standard blueprints to fill up the items.</p>
                </div>
              )}

              <div className="mt-8 space-y-4">
                <h3 className="text-base font-bold text-[#160d2d]">Customer details for billing</h3>
                <Field
                  label="Name"
                  value={customer.name}
                  onChange={(value) => onCustomerChange({ ...customer, name: value })}
                />
                <Field
                  label="Email"
                  type="email"
                  value={customer.email}
                  onChange={(value) => onCustomerChange({ ...customer, email: value })}
                />
                <Field
                  label="Phone"
                  type="tel"
                  value={customer.phone}
                  onChange={(value) => onCustomerChange({ ...customer, phone: value })}
                />
              </div>

              <div className="mt-6 rounded-2xl bg-white border border-[#ded2bf] p-4 text-xs leading-relaxed text-[#665f73]">
                🛡️ <strong>Cashfree Payment Protocol:</strong> Your payment parameters are safely encapsulated. AppID ({config.cashfreeAppId?.substring(0, 8)}...) is connected and running in <span className="font-bold uppercase text-[#160d2d]">{config.cashfreeMode}</span> mode.
                {config.isSimulationMode && (
                  <span className="block mt-1 font-semibold text-brand">✓ Simulated checkout activated for rapid testing.</span>
                )}
              </div>
            </div>

            <div className="border-t border-[#e5d9c7] px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>INR {subtotal.toLocaleString("en-IN")}</span>
              </div>
              <motion.button
                type="button"
                onClick={onCheckout}
                whileTap={{ scale: 0.98 }}
                disabled={isCheckingOut || !cartItems.length}
                className="w-full rounded-full bg-[#160d2d] py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:bg-[#a69cab]"
              >
                {isCheckingOut ? "Connecting Cashfree..." : "Pay with Cashfree"}
              </motion.button>
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function Field({
  label,
  onChange,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <label className="block text-sm font-semibold text-[#332642]">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        className="mt-1.5 w-full rounded-xl border border-[#d9cbb6] bg-white px-4 py-2.5 font-normal outline-none transition focus:border-brand"
      />
    </label>
  );
}

// ============================================================
// Exit Popup Component
// ============================================================
function ExitPopup({ config, onClaim }: { config: StoreConfig; onClaim: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem("digicraft-exit-popup-dismissed") === "true") {
      return;
    }

    const handleMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 8) {
        setVisible(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  const dismiss = () => {
    window.localStorage.setItem("digicraft-exit-popup-dismissed", "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#080416]/70 px-6 backdrop-blur-sm">
          <motion.div
            className="w-full max-w-lg rounded-[2rem] bg-[#fffaf3] p-8 text-[#160d2d] shadow-2xl"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.28 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand">SPECIAL OFFER</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">{config.exitPopupTitle}</h2>
            <p className="mt-4 leading-relaxed text-[#665f73]">
              {config.exitPopupMessage}
            </p>
            <div className="mt-4 rounded-xl bg-yellow-100/60 border border-yellow-200 p-3.5 text-center font-mono text-sm font-bold text-yellow-800">
              Promo Code: {config.exitPopupDiscount}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  onClaim();
                  dismiss();
                }}
                className="rounded-full bg-[#160d2d] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-brand"
              >
                Claim Kit Now
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="rounded-full border border-[#d9cbb6] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#160d2d] transition hover:bg-white"
              >
                No thanks
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

// ============================================================
// Cookie Consent Component
// ============================================================
function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem("digicraft-cookie-consent") !== "accepted");
  }, []);

  const accept = () => {
    window.localStorage.setItem("digicraft-cookie-consent", "accepted");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed bottom-5 left-5 right-5 z-40 mx-auto max-w-3xl rounded-3xl border border-white/15 bg-[#160d2d] p-5 text-white shadow-2xl sm:flex sm:items-center sm:justify-between sm:gap-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <p className="text-xs leading-relaxed text-white/80">
            We use secure system cookies to capture cart state, persistent configurations, and support ticket credentials for a smooth payment flow.
          </p>
          <button
            type="button"
            onClick={accept}
            className="mt-4 shrink-0 rounded-full bg-[#f5d48d] px-5 py-2.5 text-xs font-bold text-[#160d2d] sm:mt-0"
          >
            Accept Consent
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// ============================================================
// Notification Toast Component
// ============================================================
function Notification({ toast }: { toast: Toast | null }) {
  const toneClasses: Record<ToastTone, string> = {
    success: "border-emerald-300 bg-emerald-50 text-emerald-950",
    error: "border-rose-300 bg-rose-50 text-rose-950",
    info: "border-[#d8caf8] bg-white text-[#160d2d]",
  };

  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          key={toast.id}
          className={`fixed right-5 top-5 z-[80] max-w-sm rounded-2xl border px-5 py-4 text-sm font-semibold shadow-2xl ${toneClasses[toast.tone]}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
        >
          {toast.message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// ============================================================
// AI Chatbot Component
// ============================================================
function AIChatbot({ config }: { config: StoreConfig }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant" as const,
      text: `Hello! Ask me about licenses, Cashfree checkout, or direct support. You can reach us at ${config.contactEmail} or WhatsApp us at +91 ${config.contactPhone}.`,
    },
  ]);

  const submitQuestion = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    const answerResponse = chatbotAnswer(trimmed, config);
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user" as const, text: trimmed },
      { id: Date.now() + 1, role: "assistant" as const, text: answerResponse },
    ]);
    setDraft("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {open ? (
          <motion.div
            className="mb-4 w-[min(360px,calc(100vw-3rem))] overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#160d2d] text-white shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
          >
            <div className="border-b border-white/10 p-5 bg-[#090512]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f5d48d]">AI ASSISTANT</p>
              <h2 className="mt-1 text-lg font-semibold">DigiCraft Help</h2>
            </div>
            <div className="max-h-64 space-y-3 overflow-y-auto p-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    message.role === "assistant"
                      ? "bg-white/10 text-white/85"
                      : "ml-auto bg-[#f5d48d] text-[#160d2d] max-w-[85%]"
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 px-5 pb-4">
              {["Cashfree setup?", "Office address?", "How to download?"].map((prompt) => (
                <button
                  type="button"
                  key={prompt}
                  onClick={() => submitQuestion(prompt)}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-semibold text-white/78 hover:border-[#f5d48d] hover:text-[#f5d48d]"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2 border-t border-white/10 p-4 bg-[#090512]"
              onSubmit={(event) => {
                event.preventDefault();
                submitQuestion(draft);
              }}
            >
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Type your query"
                className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2 text-xs text-white outline-none border border-white/10 focus:border-[#f5d48d]"
              />
              <button
                type="submit"
                className="rounded-full bg-[#f5d48d] px-4 py-2 text-xs font-bold text-[#160d2d]"
              >
                Send
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((current) => !current)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-2 rounded-full bg-[#160d2d] px-5 py-4 text-xs font-bold text-white shadow-2xl ring-1 ring-white/15"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f5d48d] text-[#160d2d] font-bold">?</span>
        Help Chat
      </motion.button>
    </div>
  );
}

function chatbotAnswer(question: string, config: StoreConfig) {
  const lower = question.toLowerCase();

  if (lower.includes("cashfree") || lower.includes("payment") || lower.includes("gateway")) {
    return `We support Cashfree Web Checkout (${config.cashfreeMode} mode). The integration loads the Cashfree JavaScript client secure popup for processing. AppID: ${config.cashfreeAppId}.`;
  }

  if (lower.includes("address") || lower.includes("office") || lower.includes("where")) {
    return `Our office address is: ${config.contactAddress}. Support line is open for on-site templates consulting.`;
  }

  if (lower.includes("contact") || lower.includes("phone") || lower.includes("whatsapp") || lower.includes("mail")) {
    return `Reach our support desk instantly at ${config.contactEmail} or WhatsApp: +91 ${config.contactPhone}.`;
  }

  if (lower.includes("download") || lower.includes("get")) {
    return "Once payment is verified, files are instantly assigned to your user account dashboard. Sign in using your email/phone to download instantly!";
  }

  return `We specialize in rapid storefronts and digital delivery. Reach out at ${config.contactEmail} for immediate custom template setups.`;
}

// ============================================================
// Brand Mark Component
// ============================================================
function BrandMark({ color }: { color: string }) {
  return (
    <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-white/10">
      <span className="absolute left-1.5 top-1.5 h-2.5 w-2.5 rounded-sm bg-[#f5d48d]" />
      <span className="absolute bottom-1.5 right-1.5 h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
    </span>
  );
}

// ============================================================
// ADVANCED SECRET ADMIN PORTAL
// ============================================================
function AdminPortal({
  config,
  products,
  transactions,
  isAdminAuthenticated,
  adminPasscode,
  setAdminPasscode,
  setIsAdminAuthenticated,
  onSaveConfig,
  onSaveProducts,
  onSaveTransactions,
  onClose,
}: {
  config: StoreConfig;
  products: Product[];
  transactions: Transaction[];
  isAdminAuthenticated: boolean;
  adminPasscode: string;
  setAdminPasscode: (val: string) => void;
  setIsAdminAuthenticated: (val: boolean) => void;
  onSaveConfig: (val: StoreConfig) => void;
  onSaveProducts: (val: Product[]) => void;
  onSaveTransactions: (val: Transaction[]) => void;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"cashfree" | "visuals" | "products" | "analytics">("cashfree");

  // New Transaction Form state
  const [newCustName, setNewCustName] = useState("");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newProdId, setNewProdId] = useState(products[0]?.id || "launch-site-kit");
  const [newAmount, setNewAmount] = useState(products[0]?.price || 2499);

  // Auto update product selection in transaction form
  useEffect(() => {
    const p = products.find((prod) => prod.id === newProdId);
    if (p) {
      setNewAmount(p.price);
    }
  }, [newProdId, products]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === "admin123") {
      setIsAdminAuthenticated(true);
    } else {
      alert("Invalid secret passcode. Please enter 'admin123'.");
    }
  };

  const handleAddManualTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustEmail || !newCustName) {
      alert("Please fill name and email.");
      return;
    }
    const matchedProduct = products.find((p) => p.id === newProdId);
    const newTx: Transaction = {
      id: `TX-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      productId: newProdId,
      productName: matchedProduct ? matchedProduct.name : "Custom Digital Package",
      amount: Number(newAmount),
      customerName: newCustName,
      customerEmail: newCustEmail,
      customerPhone: newCustPhone || "9999999999",
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "Success",
    };
    onSaveTransactions([newTx, ...transactions]);
    setNewCustName("");
    setNewCustEmail("");
    setNewCustPhone("");
    alert("Transaction recorded and added to report!");
  };

  // PDF report downloader function
  const handleDownloadPDFReport = () => {
    // Generate styled content and open print window, which allows saving as PDF cleanly
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to export the PDF report.");
      return;
    }

    // Format metrics
    const totalsByProduct = products.reduce((acc, p) => {
      const amount = transactions
        .filter((tx) => tx.productId === p.id && tx.status === "Success")
        .reduce((sum, tx) => sum + tx.amount, 0);
      acc[p.name] = amount;
      return acc;
    }, {} as Record<string, number>);

    const totalRevenue = transactions
      .filter((tx) => tx.status === "Success")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const rows = transactions.map(
      (tx) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 8px; font-size:12px;">${tx.id}</td>
        <td style="padding: 8px; font-size:12px;">${tx.productName}</td>
        <td style="padding: 8px; font-size:12px;">${tx.customerName}</td>
        <td style="padding: 8px; font-size:12px;">${tx.customerEmail}</td>
        <td style="padding: 8px; font-size:12px;">INR ${tx.amount.toLocaleString("en-IN")}</td>
        <td style="padding: 8px; font-size:12px; font-weight:bold; color: green;">${tx.status}</td>
        <td style="padding: 8px; font-size:12px;">${tx.date}</td>
      </tr>
    `
    );

    const productBreakdownList = Object.entries(totalsByProduct).map(
      ([pname, amt]) => `
      <div style="background: #fafafa; border: 1px solid #eaeaea; padding: 12px; border-radius: 8px;">
        <strong style="font-size:14px; color:#111;">${pname}</strong>
        <div style="font-size: 18px; font-weight: bold; color: ${config.themeColor}; margin-top: 6px;">
          INR ${amt.toLocaleString("en-IN")}
        </div>
      </div>
    `
    );

    printWindow.document.write(`
      <html>
        <head>
          <title>DigiCraft Revenue Report - ${new Date().toISOString().substring(0,10)}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.5; }
            .header-container { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 25px; }
            .report-title { font-size: 26px; font-weight: bold; color: #111; margin: 0; }
            .meta-info { text-align: right; font-size: 13px; color: #666; }
            .grid-metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
            .metric-box { border: 1px solid #ccc; padding: 15px; border-radius: 12px; background-color: #fcfcfc; }
            .metric-box.total { border-color: ${config.themeColor}; background-color: #fbf9ff; }
            .product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 35px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { background-color: #160d2d; color: white; padding: 10px; text-align: left; font-size: 12px; font-weight: bold; text-transform: uppercase; }
            .footer-info { margin-top: 50px; font-size: 11px; text-align: center; border-top: 1px solid #ddd; padding-top: 15px; color: #999; }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div>
              <div class="report-title">DigiCraft Premium Revenue Report</div>
              <div style="font-size: 13px; color: #666; margin-top: 4px;">Office Lucknow: ${config.contactAddress}</div>
            </div>
            <div class="meta-info">
              <div><strong>Generated Date:</strong> ${new Date().toLocaleString()}</div>
              <div><strong>Cashfree Mode:</strong> ${config.cashfreeMode.toUpperCase()}</div>
              <div><strong>Gateway ID:</strong> Connected</div>
            </div>
          </div>

          <div class="grid-metrics">
            <div class="metric-box total">
              <span style="font-size: 12px; font-weight: bold; color: #666; text-transform: uppercase;">Total Gross Revenue</span>
              <div style="font-size: 32px; font-weight: bold; color: ${config.themeColor}; margin-top: 5px;">
                INR ${totalRevenue.toLocaleString("en-IN")}
              </div>
            </div>
            <div class="metric-box">
              <span style="font-size: 12px; font-weight: bold; color: #666; text-transform: uppercase;">Total Sales Count</span>
              <div style="font-size: 32px; font-weight: bold; color: #111; margin-top: 5px;">
                ${transactions.filter(t => t.status === "Success").length} Paid Orders
              </div>
            </div>
          </div>

          <h3 style="margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 6px; font-size:16px;">Per-Product Revenue Contribution</h3>
          <div class="product-grid">
            ${productBreakdownList.join("")}
          </div>

          <h3 style="margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 6px; font-size:16px;">Detailed Sales Logs</h3>
          <table>
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>Product Name</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${rows.join("")}
            </tbody>
          </table>

          <div class="footer-info">
            This document is a certified invoice summary generated directly from client storage ledger.<br/>
            Support Mail: ${config.contactEmail} | Support Phone: +91 ${config.contactPhone}<br/>
            Lucknow Munshipulia office arcade.
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060310] flex items-center justify-center p-6 text-white font-sans">
        <motion.div
          className="w-full max-w-md bg-[#130d22] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center space-y-2">
            <span className="text-xs bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full font-bold">SECRET PATHWAY</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Admin Gatekeeper</h2>
            <p className="text-white/60 text-sm">Please log in to make live overrides to colors, posters, exit popups, and Cashfree parameters.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">Secret Portal Passcode</label>
              <input
                type="password"
                required
                placeholder="Enter passcode (admin123)"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-white outline-none focus:border-yellow-400 font-mono text-center tracking-widest text-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#f5d48d] text-[#160d2d] py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-white transition"
            >
              Authorize Gate
            </button>
          </form>

          <button
            type="button"
            onClick={onClose}
            className="w-full text-center text-xs text-white/40 hover:text-white"
          >
            ← Return to Public Storefront
          </button>
        </motion.div>
      </div>
    );
  }

  // Active Total Gross Profit Calculation
  const totalGrossRevenue = transactions
    .filter((tx) => tx.status === "Success")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="min-h-screen bg-[#080414] text-white font-sans flex flex-col">
      {/* Admin Top Header */}
      <header className="border-b border-white/10 bg-[#120a23] px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandMark color={config.themeColor} />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Merchant Controller <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">AUTHENTICATED</span>
            </h1>
            <p className="text-xs text-white/60"> लखनऊ, मुंशीपुलिया (Lucknow office arcade controls)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadPDFReport}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-2"
          >
            📥 PDF Revenue Report
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#160d2d] border border-white/25 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl"
          >
            Exit Portal
          </button>
        </div>
      </header>

      {/* Admin Body Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 p-6 max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <aside className="space-y-2">
          {[
            { id: "cashfree", label: "🔑 Cashfree PG Setup" },
            { id: "visuals", label: "🎨 Visuals & Customizations" },
            { id: "products", label: "🏷️ Manage Product Prices" },
            { id: "analytics", label: "📊 Sales Ledger & Mocking" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-brand text-white shadow-lg shadow-brand/20"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <div className="mt-8 rounded-2xl bg-yellow-400/5 border border-yellow-400/25 p-4 text-xs space-y-1.5 leading-relaxed text-yellow-200">
            <strong>🔒 Live Security Guard</strong>
            <p>AppID is ready to route live UPI. Never copy client secrets into plain code blocks.</p>
          </div>
        </aside>

        {/* Tab Content Panels */}
        <main className="bg-[#120a23]/60 border border-white/10 rounded-3xl p-6 lg:p-8 overflow-x-hidden">
          {activeTab === "cashfree" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Cashfree Gateway Settings</h2>
                <p className="text-white/60 text-xs mt-1">Configure parameters returned to the Javascript checkout v3 client.</p>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase">Gateway Mode</label>
                    <select
                      value={config.cashfreeMode}
                      onChange={(e) => onSaveConfig({ ...config, cashfreeMode: e.target.value as CashfreeMode })}
                      className="mt-2 w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand"
                    >
                      <option className="bg-[#0b0618]" value="sandbox">Sandbox (Testing mode)</option>
                      <option className="bg-[#0b0618]" value="production">Production (Live transactions)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase">Order Routing Flow</label>
                    <select
                      value={config.isSimulationMode ? "simulate" : "endpoint"}
                      onChange={(e) => onSaveConfig({ ...config, isSimulationMode: e.target.value === "simulate" })}
                      className="mt-2 w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand"
                    >
                      <option className="bg-[#0b0618]" value="simulate">Simulate successful Cashfree popups (Fast testing)</option>
                      <option className="bg-[#0b0618]" value="endpoint">Fetch Real token from Order Endpoint</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase">Cashfree AppID (Merchant Client Key)</label>
                    <input
                      type="text"
                      value={config.cashfreeAppId}
                      onChange={(e) => onSaveConfig({ ...config, cashfreeAppId: e.target.value })}
                      placeholder="Enter AppID"
                      className="mt-2 w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand font-mono"
                    />
                    <p className="text-[10px] text-white/50 mt-1">Prefilled with Lucknow deployment production keys.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase">Cashfree Secret Key (x-client-secret)</label>
                    <input
                      type="password"
                      value={config.cashfreeSecretKey}
                      onChange={(e) => onSaveConfig({ ...config, cashfreeSecretKey: e.target.value })}
                      placeholder="Enter Secret Key"
                      className="mt-2 w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand font-mono text-yellow-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase">Backend Order Creation Endpoint (HTTP POST)</label>
                    <input
                      type="text"
                      value={config.cashfreeEndpoint}
                      onChange={(e) => onSaveConfig({ ...config, cashfreeEndpoint: e.target.value })}
                      placeholder="e.g. /api/cashfree/create-order"
                      className="mt-2 w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand font-mono"
                    />
                    <p className="text-[10px] text-white/50 mt-1">If blank and Simulation mode is disabled, checkout cannot connect.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "visuals" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Theme & Visual Personalization</h2>
                <p className="text-white/60 text-xs mt-1">Update color palette, exit popups, active banners, and contacts instantly.</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Theme Accent Color</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="color"
                      value={config.themeColor}
                      onChange={(e) => onSaveConfig({ ...config, themeColor: e.target.value })}
                      className="h-12 w-20 bg-transparent border-0 cursor-pointer rounded-xl"
                    />
                    <input
                      type="text"
                      value={config.themeColor}
                      onChange={(e) => onSaveConfig({ ...config, themeColor: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Hero Background Dark Color</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="color"
                      value={config.themeBg}
                      onChange={(e) => onSaveConfig({ ...config, themeBg: e.target.value })}
                      className="h-12 w-20 bg-transparent border-0 cursor-pointer rounded-xl"
                    />
                    <input
                      type="text"
                      value={config.themeBg}
                      onChange={(e) => onSaveConfig({ ...config, themeBg: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase">Hero title</label>
                  <input
                    type="text"
                    value={config.heroTitle}
                    onChange={(e) => onSaveConfig({ ...config, heroTitle: e.target.value })}
                    className="mt-2 w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase">Hero description</label>
                  <textarea
                    rows={3}
                    value={config.heroDescription}
                    onChange={(e) => onSaveConfig({ ...config, heroDescription: e.target.value })}
                    className="mt-2 w-full bg-white/5 border border-white/15 rounded-xl p-4 text-sm text-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase">Exit Popup Title</label>
                  <input
                    type="text"
                    value={config.exitPopupTitle}
                    onChange={(e) => onSaveConfig({ ...config, exitPopupTitle: e.target.value })}
                    className="mt-2 w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase">Exit Popup Message text</label>
                  <textarea
                    rows={2}
                    value={config.exitPopupMessage}
                    onChange={(e) => onSaveConfig({ ...config, exitPopupMessage: e.target.value })}
                    className="mt-2 w-full bg-white/5 border border-white/15 rounded-xl p-4 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Exit discount code</label>
                  <input
                    type="text"
                    value={config.exitPopupDiscount}
                    onChange={(e) => onSaveConfig({ ...config, exitPopupDiscount: e.target.value })}
                    className="mt-2 w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Support Email (Mail ID)</label>
                  <input
                    type="email"
                    value={config.contactEmail}
                    onChange={(e) => onSaveConfig({ ...config, contactEmail: e.target.value })}
                    className="mt-2 w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Support WhatsApp Number (Lucknow support)</label>
                  <input
                    type="text"
                    value={config.contactPhone}
                    onChange={(e) => onSaveConfig({ ...config, contactPhone: e.target.value })}
                    className="mt-2 w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Official Registered Address</label>
                  <input
                    type="text"
                    value={config.contactAddress}
                    onChange={(e) => onSaveConfig({ ...config, contactAddress: e.target.value })}
                    className="mt-2 w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Active Prices & Metadata</h2>
                <p className="text-white/60 text-xs mt-1">Modify active listing pricing instantly. The changes apply instantly live to the client storefront.</p>
              </div>

              <div className="space-y-6">
                {products.map((p, idx) => (
                  <div key={p.id} className="border border-white/10 bg-white/5 p-5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-xs bg-yellow-400/20 text-yellow-400 font-bold px-2.5 py-0.5 rounded font-mono">{p.id}</span>
                      <span className="text-xs text-white/50">{p.category}</span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Product Name</label>
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx].name = e.target.value;
                            onSaveProducts(updated);
                          }}
                          className="mt-1 w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Price (INR)</label>
                        <input
                          type="number"
                          value={p.price}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx].price = Number(e.target.value);
                            onSaveProducts(updated);
                          }}
                          className="mt-1 w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none font-mono"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Short Description</label>
                        <textarea
                          rows={2}
                          value={p.description}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx].description = e.target.value;
                            onSaveProducts(updated);
                          }}
                          className="mt-1 w-full bg-white/5 border border-white/15 rounded-xl p-3 text-sm text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Ledger Operations & Mocking Tool</h2>
                <p className="text-white/60 text-xs mt-1">Manual order injector tool for testing reporting outputs instantly.</p>
              </div>

              {/* Total analytics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                  <p className="text-xs font-bold uppercase text-gray-400">Total Live Revenue</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-2">INR {totalGrossRevenue.toLocaleString("en-IN")}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                  <p className="text-xs font-bold uppercase text-gray-400">Paid Sales Count</p>
                  <p className="text-2xl font-bold mt-2">{transactions.filter(t => t.status === "Success").length} Orders</p>
                </div>
              </div>

              {/* Order mock injector */}
              <form onSubmit={handleAddManualTransaction} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brand">Add Manual Simulated Order</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Customer Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={newCustName}
                      onChange={(e) => setNewCustName(e.target.value)}
                      className="mt-1 w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Customer Email</label>
                    <input
                      type="email"
                      required
                      placeholder="ramesh@test.in"
                      value={newCustEmail}
                      onChange={(e) => setNewCustEmail(e.target.value)}
                      className="mt-1 w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Customer Phone</label>
                    <input
                      type="tel"
                      placeholder="7307493338"
                      value={newCustPhone}
                      onChange={(e) => setNewCustPhone(e.target.value)}
                      className="mt-1 w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Choose product</label>
                    <select
                      value={newProdId}
                      onChange={(e) => setNewProdId(e.target.value)}
                      className="mt-1 w-full bg-[#120a23] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} (INR {p.price})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#160d2d] border border-white/20 hover:bg-brand text-xs font-bold text-white py-2.5 rounded-xl uppercase tracking-widest"
                >
                  Save & Recalculate Revenue
                </button>
              </form>

              {/* Transactions list table */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider">Transaction Ledger</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-white/80 border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 uppercase text-[10px]">
                        <th className="py-2">Tx ID</th>
                        <th className="py-2">Product Name</th>
                        <th className="py-2">Customer</th>
                        <th className="py-2">Amount</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-2 font-mono text-gray-400">{tx.id}</td>
                          <td className="py-2 font-semibold">{tx.productName}</td>
                          <td className="py-2 truncate max-w-[120px]">{tx.customerName}</td>
                          <td className="py-2 text-emerald-400 font-bold">INR {tx.amount}</td>
                          <td className="py-2 font-bold text-emerald-500">{tx.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
