# 🕌 Waktu Solat Dashboard
**Modern Malaysian Prayer Times Dashboard with Real-time Updates**

A beautifully designed, responsive dashboard for displaying Islamic prayer times in Malaysia. Features real-time countdown, Hadith of the Hour, daily verses, Hijri calendar, and zone-based data from JAKIM.

## ✨ Features

### Core Features
- **📿 Prayer Times Display**: Real-time prayer times for 24 Malaysian zones
- **⏱️ Countdown Timer**: Live countdown to next prayer with auto-refresh
- **🌅 Syuruk Special Handling**: Sunrise time shown without azan/countdown
- **📅 Hijri Calendar**: Visual grid with Malay day names (Ahad, Isnin, etc.)
- **💨 Azan Splashscreen**: Elegant azan notification with click-to-dismiss

### Widgets
- **📖 Hadith of the Hour**: 24 curated hadiths with hourly rotation (resets at Fajr)
- **📜 Daily Verse**: Authentic Islamic verses from hadis.my
- **🌤️ Weather Widget**: Zone-based weather information
- **🗺️ Zone Selector**: 24 Malaysian zones with persistent selection

### Design & UX
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop
- **🎨 Modern UI**: Clean design with Tailwind CSS v4
- **✨ Micro-animations**: Smooth transitions with Framer Motion
- **🖥️ Kiosk Mode**: Fullscreen support for dedicated displays
- **🌙 Dark Mode Ready**: Beautiful dark theme support

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **API**: Waktu Solat API (JAKIM Data)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/wanshazamirul/solatlahkamu.git

# Navigate to project directory
cd solatlahkamu

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
waktu-solat-dashboard/
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   │   ├── PrayerTimes.tsx       # Main prayer times display
│   │   ├── Countdown.tsx          # Next prayer countdown
│   │   ├── HadithWidget.tsx       # Hadith of the hour
│   │   ├── VerseWidget.tsx        # Daily verse widget
│   │   ├── HijriCalendar.tsx      # Hijri calendar grid
│   │   ├── WeatherWidget.tsx      # Weather display
│   │   └── ZoneSelector.tsx       # Zone selection dropdown
│   ├── lib/              # Utility functions
│   │   ├── api.ts                 # API integration
│   │   └── types.ts               # TypeScript types
│   └── types/            # Type definitions
├── public/               # Static assets
└── package.json
```

## 🎯 Key Components

### PrayerTimes Component
- Fetches prayer times from Waktu Solat API
- Displays all 5 daily prayers + Syuruk
- Zone-specific data with caching
- Auto-refresh at midnight

### Countdown Widget
- Real-time countdown to next prayer
- Excludes Syuruk from countdown logic
- Automatic next prayer detection

### Hadith of the Hour
- 24 curated hadiths (1 per hour)
- Resets rotation at Fajr
- Authentic source attribution

### Hijri Calendar
- Visual grid layout
- Malay day names (Ahad, Isnin, Selasa, etc.)
- Current date highlighting

## 🌐 API Integration

**Waktu Solat API**: https://waktu-solat-api.herokuapp.com/
- Provides JAKIM prayer time data
- Zone-based queries
- Daily prayer time calculations

### Zone Format
```
{zone}: {zone code}

Examples:
- Kuala Lumpur: KL01
- Selangor: SGR01
- Penang: PNG01
```

## 🎨 Customization

### Changing Zones
Edit the zone list in `ZoneSelector.tsx`:
```typescript
const zones = [
  { code: 'KL01', name: 'Kuala Lumpur' },
  { code: 'SGR01', name: 'Selangor' },
  // Add more zones
];
```

### Modifying Hadiths
Edit the hadiths array in `HadithWidget.tsx`:
```typescript
const hadiths = [
  {
    text: "Your hadith text here",
    source: "Source name",
    hour: 0
  },
  // Add 24 hadiths (one for each hour)
];
```

### Theme Colors
Modify Tailwind config in `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        // Add custom colors
      }
    }
  }
}
```

## 📱 Responsive Design

### Mobile (< 768px)
- Single column layout
- Reduced text sizes (~25% smaller)
- Compact spacing
- Touch-optimized interactions

### Desktop (>= 768px)
- 3-column layout
- Enhanced typography
- Hover effects
- Optimized spacing

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Build for Production
```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://waktu-solat-api.herokuapp.com/
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Shazwan Amirul**
- GitHub: [@wanshazamirul](https://github.com/wanshazamirul)
- Portfolio: [shazwan.dev](https://shazwan.dev)

## 🙏 Acknowledgments

- **JAKIM** for prayer time data
- **Waktu Solat API** for providing the API service
- **hadis.my** for authentic Islamic content
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email shazwan.amirul@gmail.com or open an issue on GitHub.

---

**Made with ❤️ and ☕ by Shazwan**
