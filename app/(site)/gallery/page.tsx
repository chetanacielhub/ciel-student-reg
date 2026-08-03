import type { Metadata } from "next";
import path from "path";
import fs from "fs/promises";
import { Images, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gallery | CIEL Innovation Hub",
  description:
    "Explore moments from CIEL hackathons, incubation programmes, workshops, mentor sessions, and innovation events.",
};

export const dynamic = "force-dynamic";

async function getImages() {
  const dir = path.join(process.cwd(), "public", "gallery");
  try {
    const files = await fs.readdir(dir);
    return files
      .filter(
        (f) =>
          !f.startsWith(".") && /\.(jpe?g|png|webp|gif|avif)$/i.test(f)
      )
      .map((f) => `/gallery/${f}`)
      .reverse(); // newest first
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getImages();

  return (
    <section className="shell page-section">
      {/* Page heading */}
      <div className="section-heading">
        <span className="eyebrow">
          <Images size={14} aria-hidden="true" />
          Innovation Moments
        </span>
        <h2 style={{ marginTop: "16px" }}>Our Gallery</h2>
        <p>
          Relive the energy of hackathons, incubation showcases, mentor interactions,
          prototype demos, and community-building events at CIEL.
        </p>
      </div>

      {images.length === 0 ? (
        <div className="gallery-empty">
          <Images size={48} />
          <h3>Gallery coming soon</h3>
          <p>Photos from our events and activities will appear here.</p>
          <Link className="button button-primary" href="/">
            Back to Home
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="gallery-masonry">
          {images.map((src, i) => (
            <div key={src} className="gallery-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`CIEL Gallery Image ${i + 1}`}
                className="gallery-img"
                loading={i < 6 ? "eager" : "lazy"}
              />
              <div className="gallery-item-overlay" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
