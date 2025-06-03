
type ResourceHeaderProps = {
  title: string;
  subtitle: string;
};

const ResourceHeader = ({ title, subtitle }: ResourceHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-route66 text-route66-red mb-2">{title}</h2>
      <p className="text-route66-gray max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );
};

export default ResourceHeader;
