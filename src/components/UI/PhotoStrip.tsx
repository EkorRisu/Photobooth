import { Camera } from "lucide-react";
import html2canvas from "html2canvas";
import React, { useRef, useEffect, forwardRef, useState } from "react";

interface Photo {
  id: number;
  dataUrl: string;
}

interface PhotoStripProps {
  photos: Photo[];
  onDownloadComplete?: () => void;
}

const PhotoStrip = forwardRef<HTMLDivElement, PhotoStripProps>(
  ({ photos, onDownloadComplete }, ref) => {
    const internalRef = useRef<HTMLDivElement | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [backgroundUrl, setBackgroundUrl] = useState<string>("");

    const combinedRef = (node: HTMLDivElement) => {
      internalRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    const handleBackgroundChange = (
      event: React.ChangeEvent<HTMLSelectElement>
    ) => {
      setBackgroundUrl(event.target.value);
    };

    useEffect(() => {
      if (photos.length === 6 && internalRef.current) {
        const element = internalRef.current;

        setTimeout(() => {
          html2canvas(element, {
            scale: 3,
            useCORS: true,
          }).then((canvas) => {
            const dataUrl = canvas.toDataURL("image/png", 1.0);

            setPreviewImage(dataUrl);

            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "photo-strip-4r.png";
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            if (onDownloadComplete) onDownloadComplete();
          });
        }, 300);
      }
    }, [photos]);

    return (
      <div className="w-full max-w-md mx-auto">
        <select
          onChange={handleBackgroundChange}
          className="mb-4 p-2 border border-gray-300 rounded-md w-full"
        >
          <option value="">-- Select Background --</option>
          <option value="images/bg.png">Background 1</option>
          <option value="/images/bg2.png">Background 2</option>
          <option value="/images/bg3.png">Background 3</option>
        </select>

        <div
          id="photo-strip"
          ref={combinedRef}
          className="relative bottom-0 p-4 bg-amber-200 aspect-[2/3] flex items-center justify-center rounded-xl overflow-hidden"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {photos.length > 0 ? (
            <div className="absolute bottom-12 left-0 right-0 grid grid-cols-2 gap-4 px-4">
              {photos.map((photo) => (
                <div key={photo.id} className="rounded overflow-hidden">
                  <img
                    src={photo.dataUrl}
                    alt={`Photo ${photo.id + 1}`}
                    crossOrigin="anonymous"
                    className="object-contain max-w-full max-h-full p-1"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">
              <Camera size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No photos captured yet</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default PhotoStrip;
