type Props = {
  htmlString: string;
  className?: string;
};

export const HtmlRenderer: React.FC<Props> = ({ htmlString, className }) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: htmlString }}
    />
  );
};

export default HtmlRenderer;