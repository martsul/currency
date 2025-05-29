# 📈 Currency Rates API

This API provides real-time exchange rates between fiat currencies and cryptocurrencies in `{base}/{quote}` format.

---

## 🚀 Endpoints

### 1. Get All Rates  
**GET** `/api/rates`  
Returns exchange rates for all available currency pairs.

#### ✅ Response Example:
```json
{
  "btc/usd": 100000,
  "ngn/usdt": 0.00065858,
  "usd/eth": 0.00027
}
```

---

### 2. Get Specific Currency Pairs  
**GET** `/api/rates/{from}/{to}`  
Returns rates for specific combinations of base and quote currencies.

- `{from}`: comma-separated list of base currencies  
- `{to}`: comma-separated list of quote currencies  

#### 📌 Example:
`GET /api/rates/usd,eur/btc,eth`

#### ✅ Response Example:
```json
{
  "usd/btc": 0.00001,
  "usd/eth": 0.00026,
  "eur/btc": 0.000011,
  "eur/eth": 0.00027
}
```

---

### 3. Get Fiat-Based Rates  
**GET** `/api/rates/fiat`  
Returns only the rates where the base currency is a fiat currency.

#### ✅ Response Example:
```json
{
  "usd/btc": 0.00001,
  "eur/eth": 0.00027,
  "ngn/usdt": 0.00065858
}
```

---

### 4. Get Coin-Based Rates  
**GET** `/api/rates/coins`  
Returns only the rates where the base currency is a cryptocurrency.

#### ✅ Response Example:
```json
{
  "btc/usd": 100000,
  "eth/eur": 3700
}
```

---

## 🔐 Admin Panel

The admin panel is available for managing currency rates and system settings.

- **Username:** `admin`
- **Password:** `admin`

> ⚠️ Make sure to change the default credentials in production environments.

---

## 📌 Format Notes

- All rates are returned as key-value pairs in the `{base}/{quote}: rate` format.
- Supported fiat currencies include: `usd`, `eur`, `ngn`, etc.
- Supported crypto coins include: `btc`, `eth`, `usdt`, etc.
- All responses are in JSON format.

---

## 📄 License

MIT