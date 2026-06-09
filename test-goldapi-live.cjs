// test-goldapi-live.cjs — Tests the GoldAPI key directly
require("dotenv").config();
const https = require("https");

const key = process.env.GOLDAPI_KEY;
console.log("GOLDAPI_KEY found:", key ? `${key.substring(0, 15)}...` : "NOT FOUND");

function fetchJson(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on("error", reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

async function main() {
  console.log("\n--- Testing GoldAPI.io (XAU/INR) ---");
  try {
    const gold = await fetchJson("https://www.goldapi.io/api/XAU/INR", {
      "x-access-token": key,
      "Content-Type": "application/json"
    });
    console.log("Status:", gold.status);
    if (gold.status === 200) {
      const d = gold.body;
      console.log("✅ Gold 24K per gram: ₹", d.price_gram_24k);
      console.log("✅ Gold 22K per gram: ₹", d.price_gram_22k);
      console.log("✅ Gold 18K per gram: ₹", d.price_gram_18k);
    } else {
      console.log("❌ Response:", JSON.stringify(gold.body));
    }
  } catch (e) {
    console.log("❌ Gold fetch error:", e.message);
  }

  console.log("\n--- Testing GoldAPI.io (XAG/INR) ---");
  try {
    const silver = await fetchJson("https://www.goldapi.io/api/XAG/INR", {
      "x-access-token": key,
      "Content-Type": "application/json"
    });
    console.log("Status:", silver.status);
    if (silver.status === 200) {
      const d = silver.body;
      console.log("✅ Silver price_gram_24k:", d.price_gram_24k);
      console.log("✅ Silver price:", d.price);
      console.log("✅ Silver open_price:", d.open_price);
      console.log("Full response keys:", Object.keys(d).join(", "));
    } else {
      console.log("❌ Response:", JSON.stringify(silver.body));
    }
  } catch (e) {
    console.log("❌ Silver fetch error:", e.message);
  }
}

main();
