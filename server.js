const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files (agar CSS/JS alag rakhna ho)
app.use(express.static(path.join(__dirname, 'public')));

// Services Data (Images ke mutabiq)
const services = [
  { id: 'tiktok_foflowers', name: 'TikTok Foflowers (1000)', price: 1500 },
  { id: 'tiktok_followers', name: 'TikTok Followers (1000)', price: 999 },
  { id: 'tiktok_views', name: 'TikTok Views (1000)', price: 50 },
  { id: 'tiktok_likes', name: 'TikTok Likes (1000)', price: 120 },
  { id: 'youtube_subscribers', name: 'YouTube Subscribers (1000)', price: 1200 },
  { id: 'youtube_watchtime', name: 'YouTube Watch Time (500 Hours)', price: 800 },
  { id: 'instagram_followers', name: 'Instagram Followers (1000)', price: 120 },
  { id: 'instagram_likes', name: 'Instagram Likes (1000)', price: 80 }
];

// Helper function to generate Auto Order ID
function generateOrderId() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `ORD-${randomNum}`;
}

// Home Route - Render HTML Form
app.get('/', (req, res) => {
  const orderId = generateOrderId();

  const servicesOptions = services.map(s => 
    `<option value="${s.id}" data-price="${s.price}">${s.name} - Rs. ${s.price}</option>`
  ).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>M.Madni Ansari - Services</title>
        <style>
            body {
                background-color: #0f172a;
                font-family: Arial, sans-serif;
                color: #ffffff;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
            }
            .card {
                background-color: #1e293b;
                padding: 25px;
                border-radius: 12px;
                width: 100%;
                max-width: 400px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            }
            h2 {
                text-align: center;
                color: #f8fafc;
                margin-bottom: 20px;
            }
            .notice {
                background-color: #1e3a8a;
                padding: 12px;
                border-radius: 6px;
                font-size: 13px;
                margin-bottom: 20px;
                color: #93c5fd;
            }
            label {
                display: block;
                margin-top: 12px;
                font-size: 14px;
                color: #cbd5e1;
            }
            input, select {
                width: 100%;
                padding: 10px;
                margin-top: 5px;
                background-color: #0f172a;
                border: 1px solid #334155;
                color: #ffffff;
                border-radius: 6px;
                box-sizing: border-box;
            }
            .order-id {
                color: #4ade80;
                font-weight: bold;
            }
            .btn {
                background-color: #3b82f6;
                color: white;
                border: none;
                width: 100%;
                padding: 12px;
                margin-top: 20px;
                border-radius: 6px;
                font-size: 16px;
                cursor: pointer;
                font-weight: bold;
            }
            .btn:hover {
                background-color: #2563eb;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h2>Power Of M.Madni Ansari</h2>
            <div class="notice">
                <strong>Important Notice:</strong> Orders are processed within 1-2 hours. Please make sure your account is public before submitting the link.
            </div>

            <form action="/submit-order" method="POST">
                <label>Order ID (Auto-Generated)</label>
                <input type="text" name="orderId" value="${orderId}" readonly class="order-id">

                <label>Select Service</label>
                <select name="service" id="serviceSelect" required onchange="updatePrice()">
                    <option value="" disabled selected>-- Select a Service --</option>
                    ${servicesOptions}
                </select>

                <label>Price per Pack:</label>
                <input type="text" id="pricePerPack" value="Rs. 0" readonly style="color: #4ade80;">

                <label>Target Profile / Video Link</label>
                <input type="url" name="targetLink" placeholder="https://..." required>

                <label>Quantity Required</label>
                <input type="number" name="quantity" id="quantity" value="1000" min="100" oninput="updatePrice()" required>

                <label>Total Estimated Price:</label>
                <input type="text" id="totalPrice" value="Rs. 0" readonly style="color: #4ade80; font-weight: bold;">

                <label>Select Payment Method</label>
                <select name="paymentMethod" required>
                    <option value="" disabled selected>-- Choose Payment --</option>
                    <option value="EasyPaisa">EasyPaisa</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="Nayapay / Bank Transfer">Nayapay / Bank Transfer</option>
                </select>

                <button type="submit" class="btn">Submit Order via Chat</button>
            </form>
        </div>

        <script>
            function updatePrice() {
                const select = document.getElementById('serviceSelect');
                const selectedOption = select.options[select.selectedIndex];
                const basePrice = parseInt(selectedOption.getAttribute('data-price')) || 0;
                const quantity = parseInt(document.getElementById('quantity').value) || 1000;

                const calculatedPrice = (basePrice * quantity) / 1000;

                document.getElementById('pricePerPack').value = "Rs. " + basePrice;
                document.getElementById('totalPrice').value = "Rs. " + calculatedPrice;
            }
        </script>
    </body>
    </html>
  `;
  res.send(html);
});

// Submit Order Route - WhatsApp Integration
app.post('/submit-order', (req, res) => {
  const { orderId, service, targetLink, quantity, paymentMethod } = req.body;

  const selectedServiceObj = services.find(s => s.id === service);
  const serviceName = selectedServiceObj ? selectedServiceObj.name : service;
  const basePrice = selectedServiceObj ? selectedServiceObj.price : 0;
  const totalPrice = (basePrice * quantity) / 1000;

  // Aapka WhatsApp Number (Country code 92 ke sath)
  const whatsappNumber = "923137803400"; 
  
  const message = `--- NEW ORDER RECEIVED ---%0A%0A` +
                  `Order ID: ${orderId}%0A` +
                  `Service: ${serviceName} - RS. ${basePrice}%0A` +
                  `Target Link: ${targetLink}%0A` +
                  `Quantity Pack: ${quantity}%0A` +
                  `Total Price: Rs. ${totalPrice}%0A` +
                  `Payment Method: ${paymentMethod}%0A%0A` +
                  `Please confirm my order.`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
  res.redirect(whatsappUrl);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
