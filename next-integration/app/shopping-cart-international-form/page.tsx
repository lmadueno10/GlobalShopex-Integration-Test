'use client';

import { useEffect, useRef } from 'react';

// Test Data
const testCartItems = [
    {
        id: 1,
        sku: "8983453950",
        name: "CABLE; BATTERY",
        quantity: 1,
        price: 59.31,
        imageUrl: "https://isuzudevepc.nv2smartdealer.com/genuine_parts.png",
        link: "https://isuzudevepc.nv2smartdealer.com/product/8983453950",
    },
    {
        id: 2,
        sku: "8983453950",
        name: "CABLE; BATTERY",
        quantity: 1,
        price: 59.31,
        imageUrl: "https://isuzudevepc.nv2smartdealer.com/genuine_parts.png",
        link: "https://isuzudevepc.nv2smartdealer.com/product/8983453950",
    },
    {
        id: 3,
        sku: "8983453913",
        name: "HARNESS; CABLE, BATTERY",
        quantity: 1,
        price: 209.7,
        imageUrl: "https://isuzudevepc.nv2smartdealer.com/genuine_parts.png",
        link: "https://isuzudevepc.nv2smartdealer.com/product/8983453913",
    },
    {
        id: 4,
        sku: "8983453920",
        name: "HARNESS; CABLE, BATTERY TO",
        quantity: 1,
        price: 83.81,
        imageUrl: "https://isuzudevepc.nv2smartdealer.com/genuine_parts.png",
        link: "https://isuzudevepc.nv2smartdealer.com/product/8983453920",
    },
];

export default function ShoppingCartInternationalForm() {
    const formRef = useRef<HTMLFormElement>(null);

    // Automatically submit the form when the component mounts
    useEffect(() => {
        if (formRef.current) {
            formRef.current.submit();
        }
    }, []);

    return (
        <div className="w-full min-h-screen bg-gray-100">
            <h1
                className="p-5 text-center text-2xl font-bold text-white shadow-md"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
            >
                GlobalShopex Checkout Form
            </h1>

            <div className="max-w-7xl mx-auto p-5">
                {/* 1. The Target Iframe */}
                <iframe
                    name="Gsframe"
                    id="Gsframe"
                    title="GlobalShopex Checkout"
                    className="w-full border border-gray-300 rounded-lg shadow-sm bg-white"
                    style={{ minHeight: "800px" }}
                />

                {/* 2. The Hidden Form (Targets the Iframe) */}
                <form
                    ref={formRef}
                    action="http://testsrv.globalshopex.com/iframe/InternationalCheckout.aspx"
                    method="post"
                    target="Gsframe"
                    className="hidden"
                >
                    {/* Required Merchant Parameters */}
                    <input type="hidden" name="MerchantID" value="2459283" />
                    <input type="hidden" name="LocalShipping" value="0.00" />

                    {/* Dynamic Cart Items */}
                    {testCartItems.map((item, index) => {
                        const i = index + 1; // GlobalShopex uses 1-based indexing
                        return (
                            <div key={item.id}>
                                <input type="hidden" name={`ProductSKU${i}`} value={item.sku} />
                                <input
                                    type="hidden"
                                    name={`ProductLink${i}`}
                                    value={item.link || `https://example.com/product/${item.sku}`}
                                />
                                <input type="hidden" name={`ProductImage${i}`} value={item.imageUrl} />
                                <input type="hidden" name={`ProductDesc${i}`} value={item.name} />
                                <input type="hidden" name={`ProductQty${i}`} value={item.quantity} />
                                <input type="hidden" name={`ProductPrice${i}`} value={item.price} />
                            </div>
                        );
                    })}
                </form>
            </div>
        </div>
    );
}
