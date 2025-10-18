#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Set JAVA_HOME to Java 21
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk
export PATH=$JAVA_HOME/bin:$PATH

echo -e "${GREEN}✅ JAVA_HOME set to: $JAVA_HOME${NC}"
echo -e "${GREEN}✅ Java version:${NC}"
java -version

# Project directory
PROJECT_DIR="/home/kailas/Documents/Projects/Java/PBL"
FRONTEND_DIR="$PROJECT_DIR/frontend"

cd $PROJECT_DIR

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down servers...${NC}"
    kill $(jobs -p) 2>/dev/null
    echo -e "${GREEN}✅ All processes stopped.${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}🏆 Sports Ranking Platform - Full Stack Launcher${NC}"
echo -e "${BLUE}================================================${NC}"

# Step 1: Build Backend
echo ""
echo -e "${YELLOW}🔨 Step 1/4: Compiling Backend...${NC}"
mvn clean compile -DskipTests

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ BACKEND BUILD FAILED! Please check the errors above.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend compiled successfully!${NC}"

# Step 2: Check Frontend Dependencies
echo ""
echo -e "${YELLOW}� Step 2/4: Checking Frontend Dependencies...${NC}"
cd $FRONTEND_DIR

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing npm packages...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ npm install failed!${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Frontend dependencies ready!${NC}"

# Step 3: Start Backend
echo ""
echo -e "${YELLOW}� Step 3/4: Starting Backend Server...${NC}"
echo -e "${BLUE}�🔗 MongoDB: mongodb+srv://kailas:***@cluster0.heba58r.mongodb.net/${NC}"
echo -e "${BLUE}👤 Default Admin: admin@sports.com / admin123${NC}"
echo -e "${BLUE}📍 Backend will run on: http://localhost:8080${NC}"

cd $PROJECT_DIR
mvn spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!

echo -e "${GREEN}✅ Backend starting (PID: $BACKEND_PID)${NC}"
echo -e "${YELLOW}⏳ Waiting for backend to initialize (15 seconds)...${NC}"
sleep 15

# Step 4: Start Frontend
echo ""
echo -e "${YELLOW}🎨 Step 4/4: Starting Frontend Server...${NC}"
echo -e "${BLUE}📍 Frontend will run on: http://localhost:3000${NC}"

cd $FRONTEND_DIR
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!

echo -e "${GREEN}✅ Frontend starting (PID: $FRONTEND_PID)${NC}"

echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}✅ BOTH SERVERS STARTED SUCCESSFULLY!${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "${GREEN}🌐 Access the application:${NC}"
echo -e "   Frontend:  ${BLUE}http://localhost:3000${NC}"
echo -e "   Backend:   ${BLUE}http://localhost:8080${NC}"
echo -e "   API Docs:  ${BLUE}http://localhost:8080/swagger-ui.html${NC}"
echo ""
echo -e "${YELLOW}📋 Logs:${NC}"
echo -e "   Backend:  tail -f $PROJECT_DIR/backend.log"
echo -e "   Frontend: tail -f $PROJECT_DIR/frontend.log"
echo ""
echo -e "${YELLOW}🛑 To stop servers: Press Ctrl+C${NC}"
echo ""
echo -e "${BLUE}================================================${NC}"

# Wait for both processes
wait
