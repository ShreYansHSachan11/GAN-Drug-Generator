# AI Drug Discovery Platform

A modern web application that helps doctors and researchers generate novel drug candidates using machine learning. The platform provides an intuitive interface for specifying target diseases and desired drug properties, then generates potential drug candidates using a GAN-based system.

## Features

- 🎯 Disease-specific drug candidate generation
- 🔬 Customizable drug properties selection
- 💊 Multiple administration route options
- 📊 Detailed molecular property analysis
- 📱 Responsive design for all devices
- ⚡ Real-time feedback and progress indicators
- 📄 Comprehensive report generation

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hook Form
- React Toastify

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/drug-discovery-ai.git
cd drug-discovery-ai
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout component
│   ├── page.tsx        # Home page with drug generation form
│   └── results/
│       └── page.tsx    # Results page showing generated candidates
├── components/         # Reusable UI components
└── styles/            # Global styles and Tailwind configuration
```

## Usage

1. Enter the target disease name
2. Select desired drug properties
3. Choose the administration route
4. Select the batch size
5. Click "Generate Drug Candidates"
6. Review the generated candidates and their properties
7. Download detailed reports for promising candidates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is for research purposes only. The generated drug candidates are AI predictions and require experimental validation. Always consult with medical professionals and follow proper research protocols. 