# 🚀 Quick Test Card - CSKB Merged UI

## 🎯 Quick Start
1. **Open**: `http://localhost:3001`
2. **Wait**: Page loads with dashboard
3. **Test**: Follow the workflow below

## 🔄 Core Workflow Test (5 minutes)

### Step 1: Create Ticket Resolution
- **Ticket ID**: `TEST-001`
- **Query**: "How do I reset my password?"
- **Click**: "Generate AI Resolution"
- **Expected**: ✅ AI solution appears + feedback form

### Step 2: Submit Feedback
- **Type**: Select "Perfect" or "Minor Changes"
- **Comments**: "This solution worked perfectly"
- **Click**: "Submit Feedback"
- **Expected**: ✅ Success message + form resets

### Step 3: Verify Data
- **Navigate**: Click "Feedback Collection" in sidebar
- **Expected**: ✅ Your feedback appears in the list

## 📊 Quick Health Check

| Page | Status | Expected |
|------|--------|----------|
| **Dashboard** | ✅ | System cards + quick form |
| **Ticket Resolution** | ✅ | AI generation + feedback |
| **Feedback Collection** | ✅ | Statistics + feedback list |
| **Enhanced KB** | ✅ | Solutions + statistics |
| **System Health** | ✅ | Overall status + agents |
| **Agent Status** | ✅ | Performance metrics |

## 🚨 Common Issues

| Issue | Check | Fix |
|-------|-------|-----|
| **Page won't load** | Port 3001 running? | `lsof -i :3001` |
| **Ticket resolution fails** | Knowledge API on 8000? | Start cskb-api |
| **Feedback fails** | Feedback agents on 8002? | Start cskb-feedback-agents |
| **TypeScript errors** | Browser console | Check for compilation issues |

## 🎯 Success Criteria
- [ ] All 6 pages load without errors
- [ ] Ticket resolution workflow works end-to-end
- [ ] Feedback submission successful
- [ ] Data displays correctly
- [ ] No console errors
- [ ] UI responsive on different sizes

## 📱 Test on Different Devices
- **Desktop**: Full functionality
- **Tablet**: Responsive design
- **Mobile**: Mobile-friendly layout

---

**Need help?** See `TESTING_GUIDE.md` for detailed instructions!

