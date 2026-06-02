import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoProps {
  src: string;
  poster?: string;
  title?: string;
  caption?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export function Video({ src, poster, title, caption, autoplay = false, loop = false, muted = false }: VideoProps) {
  const [playing, setPlaying] = useState(false);

  const isYouTube = /youtube\.com|youtu\.be/.test(src);
  const isVimeo = /vimeo\.com/.test(src);
  const isEmbed = isYouTube || isVimeo;

  function getEmbedUrl() {
    if (isYouTube) {
      const id = src.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (isVimeo) {
      const id = src.match(/vimeo\.com\/(\d+)/)?.[1];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return src;
  }

  return (
    <figure className="not-prose my-6">
      <div className="overflow-hidden rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] bg-black">
        {isEmbed ? (
          playing ? (
            <div className="relative aspect-video">
              <iframe
                src={getEmbedUrl()}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={title ?? 'Video'}
              />
            </div>
          ) : (
            <button
              onClick={() => setPlaying(true)}
              className="group relative flex aspect-video w-full items-center justify-center bg-black focus-visible:outline-none"
              aria-label={`Play${title ? `: ${title}` : ''}`}
            >
              {poster ? (
                <img
                  src={poster}
                  alt={title ?? ''}
                  className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-50"
                />
              ) : (
                <div className="absolute inset-0 bg-[#111]" />
              )}
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                <Play className="size-5 translate-x-0.5 text-[#171717]" fill="currentColor" />
              </div>
            </button>
          )
        ) : (
          <video
            src={src}
            poster={poster}
            controls
            autoPlay={autoplay}
            loop={loop}
            muted={muted || autoplay}
            playsInline
            className="aspect-video w-full"
            title={title}
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-center text-[13px] text-[#999] dark:text-[#555]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
