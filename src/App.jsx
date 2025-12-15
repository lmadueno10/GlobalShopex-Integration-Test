import { useEffect, useRef } from 'react';
import './App.css';

// Test Data Array
const testCartItems = [
  {
    id: 1,
    sku: "8983453950",
    name: "CABLE; BATTERY",
    quantity: 1,
    price: 59.31,
    imageUrl: "https://isuzudevepc.nv2smartdealer.com/genuine_parts.png",
    link: "https://isuzudevepc.nv2smartdealer.com/product/8983453950"
  },
  {
    id: 2,
    sku: "8983453950",
    name: "CABLE; BATTERY",
    quantity: 1,
    price: 59.31,
    imageUrl: "https://isuzudevepc.nv2smartdealer.com/genuine_parts.png",
    link: "https://isuzudevepc.nv2smartdealer.com/product/8983453950"
  },
  {
    id: 3,
    sku: "8983453913",
    name: "HARNESS; CABLE, BATTERY",
    quantity: 1,
    price: 209.70,
    imageUrl: "https://isuzudevepc.nv2smartdealer.com/genuine_parts.png",
    link: "https://isuzudevepc.nv2smartdealer.com/product/8983453913"
  },
  {
    id: 4,
    sku: "8983453920",
    name: "HARNESS; CABLE, BATTERY TO",
    quantity: 1,
    price: 83.81,
    imageUrl: "https://isuzudevepc.nv2smartdealer.com/genuine_parts.png",
    link: "https://isuzudevepc.nv2smartdealer.com/product/8983453920"
  }
];

// GlobalShopex Checkout Component
const GlobalShopexCheckout = ({ cartItems }) => {
  const formRef = useRef(null);

  // Automatically submit the form when the component mounts
  useEffect(() => {
    if (formRef.current) {
      formRef.current.submit();
    }
  }, []);

  return (
    <div className="checkout-container" style={{ width: '100%', minHeight: '100vh' }}>
      {/* 1. The Target Iframe */}
      <iframe
        name="Gsframe"
        id="Gsframe"
        title="GlobalShopex Checkout"
        width="100%"
        height="800px"
        frameBorder="0"
        scrolling="auto"
        style={{ border: '1px solid #ccc', minHeight: '600px' }}
      />

      {/* 2. The Hidden Form (Targets the Iframe) */}
      <form
        ref={formRef}
        action="http://testsrv.globalshopex.com/iframe/InternationalCheckout.aspx"
        method="post"
        target="Gsframe"
        style={{ display: 'none' }}
      >
        {/* Required Merchant Parameters */}
        <input type="hidden" name="MerchantID" value="2459283" />
        <input type="hidden" name="LocalShipping" value="0.00" />

        {/* Dynamic Cart Items */}
        {cartItems.map((item, index) => {
          const i = index + 1; // GlobalShopex uses 1-based indexing
          return (
            <div key={item.id}>
              <input type="hidden" name={`ProductSKU${i}`} value={item.sku} />
              <input type="hidden" name={`ProductLink${i}`} value={item.link || `https://example.com/product/${item.sku}`} />
              <input type="hidden" name={`ProductImage${i}`} value={item.imageUrl} />
              <input type="hidden" name={`ProductDesc${i}`} value={item.name} />
              <input type="hidden" name={`ProductQty${i}`} value={item.quantity} />
              <input type="hidden" name={`ProductPrice${i}`} value={item.price} />
            </div>
          );
        })}
      </form>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <div className="App">
      <h1 style={{ padding: '20px', textAlign: 'center', fontWeight: 'bold', background: 'none', color: '#333' }}>
        GlobalShopex Integration Test
      </h1>
      <GlobalShopexCheckout cartItems={testCartItems} />
    </div>
  );
}

export default App;
