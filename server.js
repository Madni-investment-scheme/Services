const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Services data with description
const services = [
    { id: 1, name: 'TikTok Likes (1000)', price: 120, desc: 'Best Likes Start in 0-5 minutes -- Fast Speed -- Complete In 1-3 Hours -- Guarenty Puri Zindagi Ki ♻️' },
    { id: 2, name: 'Instagram Followers (1000)', price: 250, desc: 'High Quality Real Followers -- Non-Drop -- Start Time: 0-1 Hour.' },
    { id: 3, name: 'TikTok Views (1000)', price: 40, desc: 'Best Views Start in 0-5 minutes -- Fast Speed -- Complete In 1-3 Hours -- Guarenty Puri Zindagi Ki ♻️' }
    { id: 4, name: 'TikTok Followers (1000)', price: 300, desc: 'Active Profiles -- Instant Start -- Safe & Secure.' }
];

app.get('/api/services', (req, res) => {
    res.json(services);
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>M.Madni Ansari - Services</title>
            <style>
                body {
                    background-color: #0b132b;
                    color: #fff;
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                }
                .container {
                    width: 100%;
                    max-width: 400px;
                    background: #1c2541;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                }
                h2 { text-align: center; font-size: 20px; margin-bottom: 15px; }
                .notice {
                    background: #22335f;
                    padding: 10px;
                    border-radius: 8px;
                    font-size: 12px;
                    color: #a5c4d4;
                    margin-bottom: 15px;
                    border-left: 4px solid #3a86ff;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                label {
                    display: block;
                    font-size: 13px;
                    margin-bottom: 5px;
                    color: #cfdbd5;
                }
                input, select {
                    width: 100%;
                    padding: 10px;
                    background: #0b132b;
                    border: 1px solid #3a506b;
                    border-radius: 6px;
                    color: #fff;
                    font-size: 14px;
                    box-sizing: border-box;
                }
                .desc-box {
                    background: #0b132b;
                    border: 1px solid #3a506b;
                    padding: 10px;
                    border-radius: 6px;
                    margin-top: 5px;
                    font-size: 12px;
                    color: #8ecae6;
                }
                .btn {
                    width: 100%;
                    background: #3a86ff;
                    color: white;
                    border: none;
                    padding: 12px;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-top: 10px;
                }
                .btn:hover { background: #2667cc; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Power Of M.Madni Ansari</h2>
                <div class="notice">
                    <b>Important Notice:</b> Orders are processed within 1-2 hours. Please make sure your account is public before submitting the link.
                </div>

                <div class="form-group">
                    <label>Order ID (Auto-Generated)</label>
                    <input type="text" id="orderId" readonly style="color: #2ec4b6; font-weight: bold;">
                </div>

                <div class="form-group">
                    <label>Select Service</label>
                    <select id="serviceSelect" onchange="updateServiceDetails()">
                        <option value="">- Select a Service -</option>
                    </select>
                </div>

                <!-- Description & Price Box -->
                <div class="form-group" style="background: #131b2e; padding: 10px; border-radius: 8px; border: 1px solid #22335f;">
                    <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold;">
                        <span>Price per Pack:</span>
                        <span id="priceDisplay" style="color: #2ec4b6;">Rs. 0</span>
                    </div>
                    <div class="desc-box" id="descDisplay">
                        Select a service to see details...
                    </div>
                </div>

                <div class="form-group">
                    <label>Target Profile / Video Link</label>
                    <input type="text" id="targetLink" placeholder="https://...">
                </div>

                <div class="form-group">
                    <label>Quantity Required</label>
                    <input type="number" id="quantity" value="1000" oninput="calculateTotal()">
                </div>

                <div class="form-group">
                    <label>Total Estimated Price:</label>
                    <input type="text" id="totalPrice" readonly style="color: #2ec4b6; font-weight: bold;" value="Rs. 0">
                </div>

                <button class="btn" onclick="submitOrder()">Submit Order via Chat</button>
            </div>

            <script>
                const servicesData = ${JSON.stringify(services)};

                // Auto-generate Order ID
                document.getElementById('orderId').value = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

                // Populate Dropdown
                const selectTag = document.getElementById('serviceSelect');
                servicesData.forEach(s => {
                    let opt = document.createElement('option');
                    opt.value = s.id;
                    opt.textContent = s.name + ' - Rs. ' + s.price;
                    selectTag.appendChild(opt);
                });

                function updateServiceDetails() {
                    const selectedId = selectTag.value;
                    const service = servicesData.find(s => s.id == selectedId);
                    
                    if (service) {
                        document.getElementById('priceDisplay').textContent = 'Rs. ' + service.price;
                        document.getElementById('descDisplay').textContent = service.desc;
                        calculateTotal();
                    } else {
                        document.getElementById('priceDisplay').textContent = 'Rs. 0';
                        document.getElementById('descDisplay').textContent = 'Select a service to see details...';
                        document.getElementById('totalPrice').value = 'Rs. 0';
                    }
                }

                function calculateTotal() {
                    const selectedId = selectTag.value;
                    const service = servicesData.find(s => s.id == selectedId);
                    const qty = document.getElementById('quantity').value || 0;
                    
                    if (service) {
                        let total = (service.price / 1000) * qty;
                        document.getElementById('totalPrice').value = 'Rs. ' + total;
                    }
                }

                function submitOrder() {
                    const orderId = document.getElementById('orderId').value;
                    const serviceName = selectTag.options[selectTag.selectedIndex].text;
                    const link = document.getElementById('targetLink').value;
                    const qty = document.getElementById('quantity').value;
                    const total = document.getElementById('totalPrice').value;

                    if(!selectTag.value || !link) {
                        alert('Please select a service and provide the link!');
                        return;
                    }

                    const message = \`New Order Details:%0A- Order ID: \${orderId}%0A- Service: \${serviceName}%0A- Link: \${link}%0A- Quantity: \${qty}%0A- Total: \${total}\`;
                    window.open('https://wa.me/923137803400?text=' + message, '_blank');
                }
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
