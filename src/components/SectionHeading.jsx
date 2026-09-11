export default function SectionHeading({
  eyebrow,
  title,
  description,
  titleClassName,
  descriptionClassName,
}) {
  return (
    <>
      <p className="text-xs font-semibold tracking-widest uppercase text-yellow-500 dark:text-yellow-400 mb-3">
        {eyebrow}
      </p>
      <h2 className={`text-3xl md:text-4xl font-bold ${titleClassName || ""}`}>
        {title}
      </h2>
      {description && (
        <p className={descriptionClassName}>{description}</p>
      )}
    </>
  );
}
