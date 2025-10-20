# 🎁 Birthday Galaxy - Interactive 3D Gift Experience

An immersive, accessible 3D birthday experience featuring an interactive gift box with personalized messages, beautiful animations, and ambient music.

## ✨ Features

### 🎨 Visual Experience
- **3D Interactive Gift**: Fully interactive 3D gift box with realistic physics
- **Particle System**: Beautiful sparkle effects with optimized performance
- **Dynamic Lighting**: Ambient and point lights with bloom post-processing
- **Starfield Background**: Animated star particles for a cosmic feel
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 🎵 Audio Experience
- **Ambient Music**: Generative ambient music using Tone.js
- **Text-to-Speech**: Personalized birthday message with Gemini API TTS
- **Sound Effects**: Gentle chimes and audio feedback
- **Audio Controls**: Toggle music on/off, respects reduced motion preferences

### ♿ Accessibility
- **Keyboard Navigation**: Full keyboard support (Enter, Space, Escape, M, R, F)
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Reduced Motion**: Respects prefers-reduced-motion preference
- **Focus Indicators**: Clear focus states for all interactive elements
- **High Contrast**: Optimized color contrast ratios

### 📱 Progressive Web App (PWA)
- **Installable**: Can be installed as a standalone app
- **Offline Support**: Service worker for offline functionality
- **App Manifest**: Full PWA manifest with icons and theme colors
- **Responsive**: Mobile-first responsive design

### ⚡ Performance
- **Adaptive Quality**: Automatically reduces quality on low-end devices
- **Resource Hints**: Preconnect and DNS prefetch for faster loading
- **Lazy Loading**: Efficient resource loading strategy
- **Memory Management**: Proper cleanup and disposal of 3D resources
- **FPS Monitoring**: Real-time performance monitoring and adaptation

### 🛡️ Error Handling
- **Graceful Degradation**: Fallbacks for all major features
- **Error Notifications**: User-friendly error messages
- **Context Recovery**: WebGL context loss handling
- **Retry Logic**: Automatic retry for API calls

## 🎮 Controls

### Mouse/Touch
- **Click/Tap Gift**: Open the gift and reveal the message
- **Click/Tap Message**: Close the message and reset the gift
- **Drag**: Rotate camera view
- **Scroll**: Zoom in/out

### Keyboard
- **Enter/Space**: Open gift or close message
- **Escape**: Close message
- **M**: Toggle music
- **R**: Reset experience
- **F**: Toggle fullscreen

### Buttons
- **Music**: Toggle background music
- **Recenter**: Reset camera to default position
- **Reset**: Reset entire experience
- **Fullscreen**: Enter/exit fullscreen mode

## 🚀 Technologies Used

### Core Technologies
- **Three.js**: 3D graphics and rendering
- **Tone.js**: Audio synthesis and music generation
- **Tailwind CSS**: Utility-first styling
- **Vanilla JavaScript**: No framework dependencies

### APIs & Services
- **Gemini API**: Text-to-speech generation
- **Web Speech API**: Fallback TTS
- **Service Worker API**: PWA functionality
- **Fullscreen API**: Fullscreen mode support

### Best Practices From Awesome Lists
- ✅ **awesome-web-performance**: Resource hints, lazy loading, adaptive quality
- ✅ **awesome-a11y**: ARIA, keyboard nav, reduced motion, focus management
- ✅ **awesome-threejs**: Proper disposal, efficient geometry, optimized rendering
- ✅ **awesome-pwa**: Service worker, manifest, offline support, installability
- ✅ **awesome-design-patterns**: Error boundaries, loading states, user feedback
- ✅ **awesome-javascript**: Modern ES6+, error handling, clean code

## 📊 Performance Optimizations

1. **Device Detection**: Automatically adjusts quality based on device capabilities
2. **Particle Count**: Reduced particles on low-end devices
3. **Shadow Quality**: Adaptive shadow map settings
4. **Bloom Effects**: Scaled bloom intensity based on performance
5. **Pixel Ratio**: Capped to prevent excessive rendering
6. **Context Management**: Proper WebGL context handling
7. **Memory Cleanup**: Automatic disposal of unused resources

## 🌐 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Setup & Deployment

### Local Development
1. Clone the repository
2. Open `index.html` in a modern browser
3. Enjoy the experience!

### Production Deployment
1. Serve via HTTPS (required for PWA features)
2. Configure proper CORS headers
3. Set up CDN for static assets (optional)
4. Enable gzip/brotli compression

### Environment Variables
- `GEMINI_API_KEY`: (Embedded) API key for Gemini TTS

## 📝 License

This is a personalized birthday gift project. Feel free to use as inspiration for your own projects!

## 🎉 Credits

Created with ❤️ for Rategang Moroke's birthday celebration.

### Inspired By
- [awesome-web-performance](https://github.com/davidsonfellipe/awesome-wpo)
- [awesome-a11y](https://github.com/brunopulis/awesome-a11y)
- [awesome-threejs](https://github.com/0xAxiome/awesome-threejs)
- [awesome-pwa](https://github.com/hemanth/awesome-pwa)
- [awesome-design-patterns](https://github.com/DovAmir/awesome-design-patterns)

---

**Happy Birthday! 🎂✨**
