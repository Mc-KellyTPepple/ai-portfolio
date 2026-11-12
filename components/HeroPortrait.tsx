type Props = { projectCount: number };

export default function HeroPortrait({ projectCount }: Props) {
  return (
    <figure className="portrait">
      <div className="portraitPlate" aria-hidden="true" />
      <div className="portraitFrame">
        <picture>
          <source
            type="image/webp"
            srcSet="/mckelly-560.webp 560w, /mckelly-900.webp 900w"
            sizes="(max-width: 959px) 80vw, 420px"
          />
          <img
            src="/mckelly-900.jpg"
            srcSet="/mckelly-560.jpg 560w, /mckelly-900.jpg 900w"
            sizes="(max-width: 959px) 80vw, 420px"
            width={900}
            height={1125}
            alt="Portrait of Mc-Kelly Pepple, Applied AI and AI Systems Engineer"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="portraitShade" aria-hidden="true" />
        <figcaption className="portraitCaption">
          <strong>Mc-Kelly Pepple</strong>
          <span>Applied AI / AI Systems Engineer</span>
        </figcaption>
      </div>

      <div className="portraitChip portraitChipTop">
        <span className="statusDot" aria-hidden="true" />
        <strong>{projectCount}</strong>
        <span>projects deployed</span>
      </div>
      <div className="portraitChip portraitChipSide">
        <span className="portraitChipLabel">Focus</span>
        <strong>Agents &middot; RAG &middot; Vision</strong>
      </div>
    </figure>
  );
}
