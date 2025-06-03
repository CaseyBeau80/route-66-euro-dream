
type ResourceHeaderProps = {
  title: string;
  subtitle: string;
};

const ResourceHeader = ({ title, subtitle }: ResourceHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl font-route66 text-gray-900 mb-4 font-bold">{title}</h2>
      <p className="text-gray-800 max-w-2xl mx-auto text-xl font-semibold">{subtitle}</p>
    </div>
  );
};

export default ResourceHeader;
