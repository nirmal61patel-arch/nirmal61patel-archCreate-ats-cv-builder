# ATS CV Builder

A production-ready **ATS-Friendly CV/Resume Builder** web application tailored for **IT professionals**. Select from multiple templates, fill out your details, customize colors, reorder sections via drag-and-drop, preview in real-time, and download a clean ATS-friendly PDF.

## Features

- **3 ATS-Friendly Templates**: Classic Professional, Modern Clean, and Tech Focused
- **Color Theme Picker**: 8 preset themes + custom color picker
- **Form-Based Editor**: Structured sections for all CV content
- **Drag & Drop Reordering**: Powered by @dnd-kit
- **Real-Time Preview**: Split-screen layout with live updates
- **PDF Download**: ATS-compliant PDF generation via html2pdf.js
- **Sample Data**: Pre-filled with a sample IT professional profile
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **React 18** + **Vite** — Fast development and builds
- **Tailwind CSS** — Utility-first styling
- **@dnd-kit** — Accessible drag-and-drop
- **html2pdf.js** — Client-side PDF generation
- **React Router** — Client-side navigation
- **react-hot-toast** — Toast notifications

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Production Build

```bash
npm run build
```

## Folder Structure

```
src/
├── components/
│   ├── Layout/         # Header, Footer
│   ├── TemplateSelector/ # Template selection cards
│   ├── ColorPicker/    # Color theme picker
│   ├── Form/           # CV form sections
│   ├── Preview/        # CV preview with templates
│   └── Download/       # PDF download button
├── context/            # Global CV state (React Context)
├── hooks/              # Custom hooks
├── utils/              # Constants, sample data, PDF generator
└── pages/              # HomePage, BuilderPage
```

## ATS Compatibility

All templates follow ATS best practices:
- Single-column layout
- Standard fonts (Arial/Helvetica)
- No images, icons, or graphics in PDF
- Standard section headings
- Consistent date formatting
- Contact info at the top
