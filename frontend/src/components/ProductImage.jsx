import { useState } from "react";

export default function ProductImage({ product }) {
  const src = product.image_url || product.image;
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return (
      <div className="img-fallback" aria-label={product.name}>
        <span>{product.name.charAt(0)}</span>
      </div>
    );
  }

  return <img src={src} alt={product.name} loading="lazy" onError={() => setFailedSrc(src)} />;
}
