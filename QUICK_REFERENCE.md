# ⚡ QUICK REFERENCE CARD

## 🚀 START APPLICATION
```bash
cd /home/kailas/Documents/Projects/Java/PBL
./run.sh
```

## 🌐 ACCESS URLS
- **App**: http://localhost:3000
- **API**: http://localhost:8080
- **Docs**: http://localhost:8080/swagger-ui.html

## 🔐 DEFAULT LOGIN
- Email: `admin@sports.com`
- Password: `admin123`

## 🛑 STOP SERVERS
Press `Ctrl+C`

## 📋 VIEW LOGS
```bash
tail -f backend.log    # Backend
tail -f frontend.log   # Frontend
```

## ⚙️ ENVIRONMENT FILE
Location: `frontend/.env`
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080/ws
REACT_APP_GROQ_API_KEY=your_key_here
```

## 🔧 TROUBLESHOOTING
```bash
# Port in use (Backend)
sudo lsof -t -i:8080 | xargs kill -9

# Port in use (Frontend)
sudo lsof -t -i:3000 | xargs kill -9

# Make script executable
chmod +x run.sh

# Reinstall dependencies
cd frontend
rm -rf node_modules
npm install
```

## 📦 PRODUCTION BUILD
```bash
# Backend
mvn clean package

# Frontend
cd frontend
npm run build
```

## 📚 DOCUMENTATION
- `README.md` - Main docs
- `RUN_SCRIPT_GUIDE.md` - Script usage
- `PRODUCTION_DEPLOYMENT.md` - Deploy guide
- `FINAL_SUMMARY.md` - Complete summary

## ✅ CHECKLIST
- [x] Secure (no hardcoded keys)
- [x] Optimized (108.96 kB)
- [x] Professional UI
- [x] Dark mode
- [x] AI Chatbot
- [ ] Change admin password!

## 🎯 STATUS
**🟢 PRODUCTION READY**

---
*Quick Start: `./run.sh` → http://localhost:3000*
